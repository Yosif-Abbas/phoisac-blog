import React, { useRef, useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import ImageCropperModal from "./ImageCropperModal"; // Adjust path if needed
import { optimizeImageBeforeUpload } from "@/lib/utils/media";
import Image from "next/image";

interface CoverImageSelectorProps {
  coverUrl: string | null;
  onCoverChange: (
    data: { url: string; file?: File } | null,
    isManual: boolean,
  ) => void;
  editorImages: string[];
}

export default function CoverImageSelector({
  coverUrl,
  onCoverChange,
  editorImages,
}: CoverImageSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localUploads, setLocalUploads] = useState<
    { url: string; file: File }[]
  >([]);
  const blobsToRevoke = useRef<Set<string>>(new Set());

  // --- Crop State ---
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      blobsToRevoke.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a temporary URL of the RAW uncropped image
    const rawUrl = URL.createObjectURL(file);
    blobsToRevoke.current.add(rawUrl);
    setRawImageUrl(rawUrl);

    // Open the cropper modal instead of updating the form immediately
    setIsCropModalOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- UNIFIED CROP & OPTIMIZE HANDLER ---
  const handleCropComplete = async (croppedFile: File, croppedUrl: string) => {
    try {
      // 1. Pass the cropped cover image through your optimizer
      const optimizedFile = await optimizeImageBeforeUpload(croppedFile);

      // 2. Generate a clean preview URL for the optimized file
      const optimizedUrl = URL.createObjectURL(optimizedFile);
      blobsToRevoke.current.add(optimizedUrl); // Ensure this gets cleaned up later

      // 3. Clean up the unoptimized crop preview URL to avoid memory leaks
      URL.revokeObjectURL(croppedUrl);

      // 4. Update local state and tell the parent form about the safe file
      const newUpload = { url: optimizedUrl, file: optimizedFile };
      setLocalUploads((prev) => [newUpload, ...prev]);
      onCoverChange(newUpload, true);
    } catch (error) {
      console.error("Failed to optimize cover image:", error);
    } finally {
      setIsCropModalOpen(false);
    }
  };

  const allOptions = [
    ...(coverUrl ? [{ url: coverUrl, file: undefined }] : []),
    ...localUploads,
    ...editorImages.map((url) => ({ url, file: undefined })),
  ];

  const uniqueOptions = allOptions.filter(
    (item, index, self) => index === self.findIndex((t) => t.url === item.url),
  );

  return (
    <>
      <div className="w-full h-full bg-white/5 dark:bg-[#1F2937]/30 border border-[#E5E7EB] dark:border-card-hover rounded-xl p-4 flex flex-col">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-4">
          صورة الغلاف (Cover Image)
        </h3>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full aspect-square max-w-96 rounded-lg overflow-hidden bg-background/50 border border-dashed border-border/60 self-center flex items-center justify-center cursor-pointer group transition-all hover:border-primary/50"
        >
          {coverUrl ? (
            <>
              <Image
                width={300}
                height={300}
                src={coverUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  تغيير الصورة
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCoverChange(null, true);
                }}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-md backdrop-blur-sm transition-colors"
                type="button"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
              <ImagePlus className="w-8 h-8 opacity-50 group-hover:opacity-100" />
              <span className="text-sm font-medium">
                انقر لاختيار صورة الغلاف
              </span>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept="image/*"
          className="hidden"
        />

        {uniqueOptions.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] text-muted-foreground mb-2">
              الصور المتاحة:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {uniqueOptions.map((option, idx) => (
                <button
                  key={`${option.url}-${idx}`}
                  type="button"
                  onClick={() =>
                    onCoverChange({ url: option.url, file: option.file }, true)
                  }
                  className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                    coverUrl === option.url
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    width={100}
                    height={100}
                    src={option.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageCropperModal
        isOpen={isCropModalOpen}
        imageUrl={rawImageUrl}
        aspect={1}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
