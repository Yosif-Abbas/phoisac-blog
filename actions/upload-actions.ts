"use server";

import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { generateStoragePath } from "@/lib/utils/media";

export async function processAndUploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const supabase = await createClient(); // Server-side client

    // 1. Get Buffer & Metadata
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const metadata = await sharp(buffer).metadata();

    const filePath = generateStoragePath(file.name, "blog");
    const thumbFilePath = filePath.replace(/\.[^/.]+$/, "_thumb.webp");

    // 2. Process in parallel (Optimized + Thumbnail)
    // Sharp is much more robust than Canvas for high-res/HEIC files
    const [optimizedBuffer, thumbBuffer] = await Promise.all([
      sharp(buffer).webp({ quality: 85 }).toBuffer(),
      sharp(buffer)
        .resize(300, 300, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer(),
    ]);

    // 3. Upload to Supabase Storage
    const [mainUpload, thumbUpload] = await Promise.all([
      supabase.storage.from("post-images").upload(filePath, optimizedBuffer, {
        contentType: "image/webp",
        upsert: true,
      }),
      supabase.storage.from("post-images").upload(thumbFilePath, thumbBuffer, {
        contentType: "image/webp",
        upsert: true,
      }),
    ]);

    if (mainUpload.error || thumbUpload.error)
      throw new Error("Storage upload failed");

    const mainUrl = supabase.storage.from("post-images").getPublicUrl(filePath)
      .data.publicUrl;
    const thumbUrl = supabase.storage
      .from("post-images")
      .getPublicUrl(thumbFilePath).data.publicUrl;

    // 4. Persist Media Records (The "media" table logic)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("media").insert([
      {
        file_name: file.name,
        file_path: filePath,
        public_url: mainUrl,
        file_size: optimizedBuffer.length,
        mime_type: "image/webp",
        width: metadata.width,
        height: metadata.height,
        uploader_id: user?.id || null,
      },
    ]);

    return { success: true, mainUrl, thumbUrl };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
