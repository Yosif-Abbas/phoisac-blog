"use client";

import React, { useEffect, useRef } from "react";
import type { StructuredContent } from "../../types/post";
import PoemTool from "./tools/PoemTool";
import imageCompression from "browser-image-compression";

interface EditorProps {
  onReady?: () => void; // Add this prop
  data?: StructuredContent;
  onChange?: (data: StructuredContent) => void;
  placeholder?: string;
}

export interface EditorHandle {
  save: () => Promise<StructuredContent | undefined>;
}

const Editor = (
  { data, onChange, placeholder, onReady }: EditorProps,
  ref: React.ForwardedRef<EditorHandle>,
) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const onChangeRef = useRef<typeof onChange | undefined>(onChange);

  // keep onChange ref updated without re-running the init effect
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // expose instance methods to parent via ref
  React.useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorInstance.current) return;
      const saved = await editorInstance.current.save();
      return saved as StructuredContent;
    },
  }));

  useEffect(() => {
    if (!wrapperRef.current) return;

    let isMounted = true;
    const initialData = data as unknown as StructuredContent;

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
        data: initialData,
        minHeight: 150,
        placeholder: placeholder || "ابدأ بالكتابة...",
        autofocus: true,

        async onChange() {
          const cb = onChangeRef.current;
          if (!cb) return;
          try {
            const saved = await editor.save();
            cb(saved as StructuredContent);
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
          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
          },
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          embed: {
            class: Embed as any,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true,
              },
            },
          },
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
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                  });

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
    // Run only once on mount/unmount. Editor re-mounts are controlled by parent via `key`.
  }, []);

  return <div ref={wrapperRef} className="editorjs-wrapper" />;
};

export default React.forwardRef(Editor);
