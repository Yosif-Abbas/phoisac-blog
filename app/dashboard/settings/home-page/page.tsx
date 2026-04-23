"use client";

import React, { useEffect, useRef, useState } from "react";
import { Save, Upload, X, ImageIcon } from "lucide-react";
import { useSettings } from "@/hooks/settings/useSettings";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { useUpdateHomeSettings } from "@/hooks/settings/useUpdateHomeSettings";

export default function HomePageSettings() {
  const { settings, isLoading } = useSettings();
  const { updateHomeSettings, isPending } = useUpdateHomeSettings();

  const [homeQuote, setHomeQuote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setHomeQuote(settings.home_quote || "");
      setPreview(settings.home_image_url || null);
    }
  }, [settings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateHomeSettings({
      home_quote: homeQuote,
      home_image_file: imageFile,
      current_image_url: settings.home_image_url,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-x-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          إعدادات الصفحة الرئيسية
        </h2>
        <p className="text-sm text-muted-foreground">
          تعديل محتوى القسم العلوي (Hero Section) في الصفحة الرئيسية.
        </p>
      </div>

      {/* Image Uploader */}
      <div className="space-y-4">
        <label className="text-sm font-medium">صورة الواجهة</label>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed border-card-hover rounded-xl overflow-hidden bg-background hover:border-primary/50 transition-all flex flex-col items-center justify-center 
      ${!preview ? "min-h-[200px]" : "h-auto"}`} // Only fixed height when empty
        >
          {preview ? (
            <>
              {/* 1. Remove 'fill'. Use 'w-full h-auto' to maintain aspect ratio */}
              {/* 2. We use a standard img here because it's a blob/preview */}
              <Image
                src={preview}
                alt="Preview"
                height={1000}
                width={1000}
                loading="eager"
                className="w-full h-auto object-contain transition-transform group-hover:scale-[1.02]"
              />

              {/* Overlay on hover */}
              {!isPending && (
                <div className="absolute inset-0 bg-black/20 md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
              )}

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-10 text-muted-foreground">
              <ImageIcon className="w-10 h-10 opacity-20" />
              <p className="text-sm">انقر هنا لرفع صورة</p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Quote Textarea */}
      <div className="space-y-2">
        <label className="text-sm font-medium">اقتباس الصفحة الرئيسية</label>
        <textarea
          rows={3}
          className="w-full p-2.5 rounded-lg bg-background border border-card-hover focus:border-primary/50 outline-none transition-all resize-none"
          value={homeQuote}
          onChange={(e) => setHomeQuote(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-x-2 hover:opacity-90 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          <Save className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
