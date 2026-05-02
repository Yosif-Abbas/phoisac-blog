import { slugify } from "transliteration";
import imageCompression from "browser-image-compression";

/**
 * Generates an SEO-friendly slug with a unique hash to prevent collisions.
 * Example: "my-awesome-post-f8a9b2c1"
 */
export function generateSlug(title: string): string {
  // Grab an 8-character random string
  const shortId = crypto.randomUUID().split("-")[0];

  // Clean the title, remove weird chars, and cap it at 60 characters so URLs don't look insane
  const cleanTitle = slugify(title).substring(0, 60);

  return `${cleanTitle}-${shortId}`;
}

/**
 * Generates a WordPress-style file path organized by year and month.
 * Example: "uploads/2026/04/sunset-beach-a1b2c3.webp"
 */
export function generateStoragePath(
  fileName: string,
  baseFolder: string = "uploads",
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  // Safely extract the extension and the name
  const parts = fileName.split(".");
  const ext = parts.pop()?.toLowerCase() || "jpg";
  const originalName = parts.join(".");

  const safeName = slugify(originalName || "image").substring(0, 30);
  const fileHash = crypto.randomUUID().split("-")[0];

  return `${baseFolder}/${year}/${month}/${safeName}-${fileHash}.${ext}`;
}

export async function optimizeImageBeforeUpload(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.9,
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const newFileName = file.name.replace(/\.[^/.]+$/, ".webp");

    return new File([compressedBlob], newFileName, { type: "image/webp" });
  } catch (error) {
    console.error("Compression failed:", error);
    return file;
  }
}

export async function generateSquareThumbnail(
  file: File,
  size = 300,
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Basic type check
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File is not an image"));
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Always clean up the memory link
      URL.revokeObjectURL(objectUrl);

      try {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas context failed");

        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFileName = file.name.replace(/\.[^/.]+$/, "_thumb.webp");
              resolve(new File([blob], newFileName, { type: "image/webp" }));
            } else {
              reject(new Error("Blob conversion failed"));
            }
          },
          "image/webp",
          0.8,
        );
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image loading failed"));
    };

    img.src = objectUrl;
  });
}

// utils/image.ts
export const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
