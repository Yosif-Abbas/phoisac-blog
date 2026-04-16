"use client";

import { useState } from "react";
import { useMedia } from "@/hooks/media/useMedia";
import Image from "next/image";
import { RowsPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import { Trash2, Hash } from "lucide-react";

// Styles
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";

export default function MediaLibrary() {
  const { mediaItems, isLoading } = useMedia();
  const [index, setIndex] = useState(-1);

  if (isLoading)
    return <div className="p-10 text-center">Loading Media...</div>;

  const photos = (mediaItems || []).map((item) => ({
    src: item.public_url,
    width: item.width || 800,
    height: item.height || 600,
    key: item.id,
    id: item.id,
    usage_count: item.usage_count,
    alt: item.file_name,
  }));

  const renderPhoto = ({ imageProps }: any, { photo, width, height }: any) => {
    const w = width ?? photo?.width ?? 800;
    const h = height ?? photo?.height ?? 600;
    const alt = photo?.alt;
    const title = photo?.title;
    const sizes = imageProps?.sizes;
    console.log(photo);
    return (
      <div
        className="group relative overflow-hidden rounded-md"
        style={{ width: "100%", aspectRatio: `${w} / ${h}` }}
      >
        <Image
          fill
          src={photo.src}
          alt={alt}
          title={title}
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Hash size={10} />
          <span>Used in {photo?.usage_count ?? 0} posts</span>
        </div>

        {/* Overlay: 3-Dots Menu (Top Right) */}
        {/* Overlay: 3-Dots Menu (Top Right) */}
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            role="button" // Tells screen readers this acts like a button
            tabIndex={0} // Makes it focusable via keyboard
            onClick={(e) => {
              e.stopPropagation(); // Prevents lightbox from opening
              if (confirm("Are you sure you want to delete this image?")) {
                // deleteMedia(photo.id);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                // Trigger delete logic here for accessibility
              }
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-sm hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete Image"
          >
            <Trash2 size={16} />
          </div>
        </div>

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="p-4">
      <RowsPhotoAlbum
        photos={photos}
        render={{ image: renderPhoto }}
        defaultContainerWidth={1200}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        index={index}
        slides={photos}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </div>
  );
}
