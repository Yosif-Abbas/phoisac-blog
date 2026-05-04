"use client";

import Modal from "../Modal/Modal";
import { Button } from "../ui/Button";
import { Check, CheckCircle2, CloudUpload, Loader2 } from "lucide-react";

type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

type PublishConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalMB: string;
  imageCount: number;
  uploadQueue?: UploadStatus[];
  isUploading: boolean;
};

export default function PublishConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  totalMB,
  imageCount,
  uploadQueue,
  isUploading,
}: PublishConfirmationModalProps) {
  const formattedSize = parseFloat(totalMB).toFixed(2);
  const isQueueEmpty = !uploadQueue || uploadQueue.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isUploading ? () => {} : onClose}
      title={isUploading ? "جاري النشر..." : "تأكيد نشر المحتوى"}
    >
      <div className="space-y-6 pt-2">
        {!isUploading ? (
          <div className="flex flex-col gap-y-6">
            <div className="flex items-start gap-x-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <CloudUpload size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  تحميل الوسائط
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  يحتوي هذا المنشور على{" "}
                  <span className="text-foreground font-semibold">
                    {imageCount} صور
                  </span>{" "}
                  بإجمالي حجم{" "}
                  <span className="text-foreground font-semibold">
                    {formattedSize} ميجابايت
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 px-6 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
              >
                تراجع
              </button>
              <Button
                onClick={onConfirm}
                className="order-1 sm:order-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                تأكيد ونشر
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <span className="text-sm font-medium text-foreground">
                  جاري رفع الصور...
                </span>
              </div>
              {/* <span className="text-xs text-muted-foreground italic">
                لا تغلق هذه النافذة
              </span> */}
            </div>

            {isQueueEmpty ? (
              <div className="py-10 flex flex-col items-center justify-center gap-y-4">
                <Loader2
                  className="animate-spin text-muted-foreground/20"
                  size={40}
                />
                <p className="text-sm text-muted-foreground">
                  جاري تهيئة الملفات...
                </p>
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-5">
                {uploadQueue &&
                  uploadQueue.map((file, index) => {
                    const isDone = file.progress === 100;
                    return (
                      <div key={index} className="space-y-3 group">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-x-2 truncate">
                            {isDone ? (
                              <CheckCircle2
                                size={14}
                                className="text-emerald-500"
                              />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                            <span
                              className={`truncate text-start font-medium transition-colors ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}
                            >
                              {file.name}
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full">
                            {/*{Math.round(file.progress)}%*/}

                            {isDone ? (
                              <Check className="text-emerald-500" size={14} />
                            ) : (
                              <Loader2
                                className="animate-spin text-primary"
                                size={14}
                              />
                            )}
                          </span>
                        </div>

                        {/* ENHANCED PROGRESS BAR */}
                        {/* <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
                          <div
                            className={`
                            h-full bg-primary relative transition-all duration-500 ease-out rounded-full
                            ${!isDone && "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:animate-shimmer"}
                          `}
                            style={{ width: `${file.progress}%` }}
                          />
                        </div> */}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
