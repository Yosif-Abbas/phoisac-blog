"use server";

import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { generateStoragePath } from "@/lib/utils/media";

export async function processAndUploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const intent = (formData.get("intent") as "cover" | "editor") || "editor";

    if (!file) throw new Error("No file provided");

    const supabase = await createClient(); // Server-side client

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const baseFilePath = generateStoragePath(file.name, "blog");

    let finalBuffer: Buffer;
    let finalFilePath: string;

    // Process differently based on intent
    if (intent === "cover") {
      // DEDICATED COVER: Only upload a highly compressed, resized version.
      // 800px width is perfect for both feed grids and mobile hero images.
      finalFilePath = baseFilePath.replace(/\.[^/.]+$/, "_cover.webp");
      finalBuffer = await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } else {
      // EDITOR IMAGE: Keep higher resolution for article reading, but still optimize.
      finalFilePath = baseFilePath.replace(/\.[^/.]+$/, ".webp");
      finalBuffer = await sharp(buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    }

    // Get the exact dimensions of the newly resized buffer for the database
    const finalMetadata = await sharp(finalBuffer).metadata();
    const finalWidth = finalMetadata.width || 0;
    const finalHeight = finalMetadata.height || 0;

    // Upload only the ONE needed file
    const uploadResult = await supabase.storage
      .from("post-images")
      .upload(finalFilePath, finalBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadResult.error) throw new Error("Storage upload failed");

    const publicUrl = supabase.storage
      .from("post-images")
      .getPublicUrl(finalFilePath).data.publicUrl;

    // Persist Media Record
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("media").insert([
      {
        file_name: file.name,
        file_path: finalFilePath,
        public_url: publicUrl,
        file_size: finalBuffer.length,
        mime_type: "image/webp",
        width: finalWidth,
        height: finalHeight,
        uploader_id: user?.id || null,
      },
    ]);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
