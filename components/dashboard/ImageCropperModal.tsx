import { useState, useRef } from "react";
import { X } from "lucide-react";
import getCroppedImg from "@/lib/utils/cropImage";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Image from "next/image";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  aspect?: number; // Pass 1 for square, undefined for free-form
  onClose: () => void;
  onCropComplete: (croppedFile: File, croppedUrl: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageUrl,
  aspect,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleSave = async () => {
    if (!imageUrl || !completedCrop || !imgRef.current) return;

    try {
      setIsProcessing(true);

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const truePixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };

      const croppedFile = await getCroppedImg(imageUrl, truePixelCrop);

      if (croppedFile) {
        const croppedUrl = URL.createObjectURL(croppedFile);
        onCropComplete(croppedFile, croppedUrl);
      }
    } catch (e) {
      console.error("Failed to crop image", e);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl overflow-hidden w-full max-w-3xl border border-card-hover shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-card-hover bg-card">
          <h3 className="font-bold text-lg">
            {aspect ? "تحديد صورة الغلاف" : "قص الصورة"}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Area - Scrollable to support tall/portrait images */}
        <div className="relative w-full max-h-[65vh] bg-[#111] overflow-auto p-4 flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            className="my-auto"
          >
            <Image
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              className="max-w-full h-auto block"
              width={350}
              height={350}
              onLoad={(e) => {
                const { width, height } = e.currentTarget;
                const minDim = Math.min(width, height);
                const cropWidth = aspect ? minDim * 0.8 : width * 0.8;
                const cropHeight = aspect
                  ? (minDim * 0.8) / aspect
                  : height * 0.8;

                setCrop({
                  unit: "px",
                  x: (width - cropWidth) / 2,
                  y: (height - cropHeight) / 2,
                  width: cropWidth,
                  height: cropHeight,
                });
              }}
            />
          </ReactCrop>
        </div>

        {/* Controls & Actions */}
        <div className="p-4 bg-card flex justify-between items-center border-t border-card-hover">
          <p className="text-sm text-muted-foreground hidden sm:block">
            {aspect
              ? "اسحب الزوايا لتحديد الجزء المناسب (مربع ثابت)."
              : "اسحب الزوايا لاختيار أي شكل تريده بحرية (يمكنك التمرير لرؤية كامل الصورة)."}
          </p>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              disabled={isProcessing}
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={
                isProcessing || !completedCrop?.width || !completedCrop?.height
              }
              type="button"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? "جاري القص..." : "حفظ الصورة"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
