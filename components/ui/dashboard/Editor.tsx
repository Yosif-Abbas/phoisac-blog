"use client";

import React, { useEffect, useRef } from "react";
import type { OutputData } from "@editorjs/editorjs";
import PoemTool from "./tools/PoemTool";
import imageCompression from "browser-image-compression";

interface EditorProps {
  onReady?: () => void; // Add this prop
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
}

export interface EditorHandle {
  save: () => Promise<OutputData | undefined>;
}

const Editor = (
  { data, onChange, placeholder, onReady }: EditorProps,
  ref: React.ForwardedRef<EditorHandle>,
) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);

  // expose instance methods to parent via ref
  React.useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorInstance.current) return;
      return await editorInstance.current.save();
    },
  }));

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (editorInstance.current) return; // prevent re-init

    let isMounted = true;

    const initEditor = async () => {
      // Dynamically import tools to prevent SSR issues in Next.js
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const Quote = (await import("@editorjs/quote")).default;

      if (!isMounted) return;

      const editor = new EditorJS({
        holder: wrapperRef.current!,
        data,
        minHeight: 150,
        placeholder: placeholder || "ابدأ بالكتابة...",
        autofocus: true,

        async onChange() {
          if (!onChange) return;
          try {
            const saved = await editor.save();
            onChange(saved);
          } catch (e) {
            console.error("Editor.js save error:", e);
          }
        },

        onReady: () => {
          if (onReady) onReady();
        },

        tools: {
          poem: {
            class: PoemTool,
            inlineToolbar: true,
          },
          // header: {
          //   class: Header as any,
          //   inlineToolbar: true,
          // },
          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
          },
          // 📝 QUOTES: Great for novels and poetry emphasis
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          // 🎥 EMBEDS: Fixed the TypeScript error using "as any"
          embed: {
            class: Embed as any,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true, // Bonus: useful for a blog
              },
            },
          },
          // 🖼️ IMAGES: Set up to use local object URLs for immediate preview
          image: {
            class: ImageTool as any,
            config: {
              uploader: {
                async uploadByUrl(url: string) {
                  return {
                    success: 1,
                    file: { url },
                  };
                },

                async uploadByFile(file: File) {
                  const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1, // Shrinks 10MB down to ~1MB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                  });

                  // 2. Create the preview from the LIGHT file
                  const previewUrl = URL.createObjectURL(compressedFile);

                  return {
                    success: 1,
                    file: {
                      url: previewUrl,
                      localFile: file,
                    },
                  };
                },
              },
            },
          },
        },
      });

      editorInstance.current = editor;
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstance.current && editorInstance.current.destroy) {
        try {
          editorInstance.current.destroy();
        } catch (e) {
          console.error("Editor cleanup error", e);
        }
      }
      editorInstance.current = null;
    };
  }, [data, onChange, placeholder]);

  return <div ref={wrapperRef} className="editorjs-wrapper" />;
};

export default React.forwardRef(Editor);
