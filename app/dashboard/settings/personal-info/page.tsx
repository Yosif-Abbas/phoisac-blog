"use client";

import React, { useEffect, useRef, useState } from "react";
import { Save, User, Image as ImageIcon, Upload, X } from "lucide-react";
import { useSettings } from "@/hooks/settings/useSettings";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { useUpdatePersonalSettings } from "@/hooks/settings/useUpdatePersonalSettings";

export default function PersonalInfoSettings() {
  const { settings, isLoading } = useSettings();
  const { updatePersonalSettings, isPending } = useUpdatePersonalSettings();

  const [fullName, setFullName] = useState("");
  const [currentIconUrl, setCurrentIconUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setFullName(settings.full_name || "");
      setCurrentIconUrl(settings.icon_image_url || "");
      setPreview(settings.icon_image_url || null);
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
    setCurrentIconUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updatePersonalSettings({
      full_name: fullName,
      icon_image_file: imageFile,
      current_icon_url: currentIconUrl,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-x-2">
          <User className="w-5 h-5 text-primary" />
          المعلومات الشخصية
        </h2>
        <p className="text-sm text-muted-foreground">
          تعديل المعلومات الشخصية التي تظهر في الصفحات المختلفة.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">الاسم الكامل</label>
        <input
          type="text"
          disabled={isPending}
          className="w-full p-2.5 rounded-lg bg-background border border-card-hover focus:border-primary/50 outline-none transition-all disabled:opacity-50"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div className="space-y-4 flex flex-col items-center md:items-start">
        {/* Centered label for mobile, right-aligned (RTL) for desktop */}
        <label className="text-sm font-medium w-full text-center md:text-start">
          صورة الأيقونة
        </label>

        <div
          onClick={() => !isPending && fileInputRef.current?.click()}
          className={`
      relative group cursor-pointer border-2 border-dashed border-card-hover bg-background 
      hover:border-primary/50 transition-all flex flex-col items-center justify-center 
      rounded-full 
      /* Responsive Sizes: 32 on mobile, 48 on desktop */
      w-32 h-32 md:w-48 md:h-48
      ${isPending ? "opacity-50 cursor-not-allowed" : "active:scale-95 md:active:scale-100"}
    `}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Icon Preview"
                fill
                loading="eager"
                className="object-cover rounded-full"
              />

              {/* Overlay: Always visible on mobile (low opacity), hover on desktop */}
              {!isPending && (
                <div className="absolute inset-0 bg-black/20 md:bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Upload className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
              )}

              {/* Delete Button: Larger hit area for mobile */}
              <button
                type="button"
                disabled={isPending}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute top-1 right-1 md:top-2 md:right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 active:bg-red-700 z-10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-muted-foreground text-center">
              <ImageIcon className="w-6 h-6 md:w-8 md:h-8 opacity-20" />
              <p className="text-[10px] md:text-xs">انقر لرفع أيقونة</p>
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
