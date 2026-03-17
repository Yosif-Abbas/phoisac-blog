"use client";

import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import type EditorJSType from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Paragraph from "@editorjs/paragraph";

interface EditorProps {
  /** initial data to load into the editor */
  data?: OutputData;
  /** callback fired whenever the editor content changes */
  onChange?: (data: OutputData) => void;
  /** placeholder text for the first block */
  placeholder?: string;
}

export interface EditorHandle {
  /** programmatically trigger a save to retrieve the latest data */
  save: () => Promise<OutputData | undefined>;
}

const Editor = (
  { data, onChange, placeholder }: EditorProps,
  ref: React.ForwardedRef<EditorHandle>,
) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<EditorJSType | null>(null);

  // expose instance methods to parent via ref
  React.useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorInstance.current) return undefined;
      try {
        const saved = await editorInstance.current.save();
        return saved as OutputData;
      } catch (e) {
        console.error("Failed to save EditorJS data", e);
        return undefined;
      }
    },
  }));

  useEffect(() => {
    if (!wrapperRef.current) return;

    const editor = new EditorJS({
      holder: wrapperRef.current,
      data,
      placeholder: placeholder || "Write something...",
      autofocus: true,
      onChange: async () => {
        if (!onChange) return;
        try {
          const savedData = await editor.save();
          onChange(savedData as OutputData);
        } catch (e) {
          console.error("Failed to save EditorJS data", e);
        }
      },
      tools: {
        header: Header,
        paragraph: Paragraph,
        embed: Embed,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const previewUrl = URL.createObjectURL(file);
                return {
                  success: 1,
                  file: { url: previewUrl, localFile: file }, // store file for later upload
                };
              },
            },
          },
        },
      },
    });

    editorInstance.current = editor;

    return () => {
      editorInstance.current?.destroy();
      editorInstance.current = null;
    };
  }, [data, onChange, placeholder]);

  return <div ref={wrapperRef} className="editorjs-wrapper" />;
};

export default React.forwardRef(Editor);
