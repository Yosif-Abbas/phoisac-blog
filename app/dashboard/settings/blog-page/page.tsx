"use client";

import React, { useEffect, useState } from "react";
import { Save, FileText } from "lucide-react";
import { useSettings } from "@/hooks/settings/useSettings";
import Loading from "@/components/ui/Loading";
import { useUpdateBlogSettings } from "@/hooks/settings/useUpdateBlogSettings";

export default function BlogPageSettings() {
  const { settings, isLoading } = useSettings();
  const { updateBlogSettings, isPending } = useUpdateBlogSettings();

  const [blogDescription, setBlogDescription] = useState("");

  useEffect(() => {
    if (settings) {
      setBlogDescription(settings.blog_page_description || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateBlogSettings(blogDescription);
  };

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-x-2">
          <FileText className="w-5 h-5 text-primary" />
          إعدادات صفحة المدونة
        </h2>
        <p className="text-sm text-muted-foreground">
          تعديل الوصف التعريفي الذي يظهر في أعلى قائمة المنشورات.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">وصف المدونة</label>
        <textarea
          rows={4}
          className="w-full p-2.5 rounded-lg bg-background border border-card-hover focus:border-primary/50 outline-none transition-all resize-none"
          value={blogDescription}
          onChange={(e) => setBlogDescription(e.target.value)}
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
