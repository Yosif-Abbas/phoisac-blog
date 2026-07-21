export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName: string = "cropped-image.jpeg",
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Set canvas size to match the cropped area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped area onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Convert canvas to File
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/jpeg",
      0.95,
    ); // High quality JPEG
  });
}

export async function getFittedImage(
  imageSrc: string,
  targetAspect?: number,
  bgColor: string = "#ffffff",
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const imgWidth = image.width;
  const imgHeight = image.height;
  const imgAspect = imgWidth / imgHeight;

  // If no aspect is forced by the parent, use the image's natural aspect
  const finalAspect = targetAspect || imgAspect;

  let canvasWidth, canvasHeight;

  if (imgAspect > finalAspect) {
    // Image is wider than target aspect, pad top and bottom
    canvasWidth = imgWidth;
    canvasHeight = imgWidth / finalAspect;
  } else {
    // Image is taller than target aspect, pad left and right
    canvasHeight = imgHeight;
    canvasWidth = imgHeight * finalAspect;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw image centered
  const dx = (canvasWidth - imgWidth) / 2;
  const dy = (canvasHeight - imgHeight) / 2;
  ctx.drawImage(image, dx, dy, imgWidth, imgHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], "fitted-image.jpeg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95,
    ); // High quality JPEG
  });
}
