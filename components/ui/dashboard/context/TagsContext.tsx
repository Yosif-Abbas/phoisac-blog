// TagsContext.tsx
import { Tag } from "@/types/post";
import { createContext, useContext, useState, ReactNode } from "react";

interface PostFormTagsContextType {
  tags: Tag[];
  toggleTag: (tag: Tag) => void;
  setTags: (tags: Tag[]) => void;
}

const TagsContext = createContext<PostFormTagsContextType | undefined>(
  undefined,
);

export function TagsProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);

  function toggleTag(tag: Tag) {
    setTags((prev) => {
      if (prev.some((t) => t.name === tag.name)) {
        return prev.filter((t) => t.name !== tag.name);
      }
      return [...prev, tag];
    });
  }

  return (
    <TagsContext.Provider value={{ tags, setTags, toggleTag }}>
      {children}
    </TagsContext.Provider>
  );
}

export const usePostFormTags = () => {
  const context = useContext(TagsContext);
  if (!context) throw new Error("usePostFormTags must be used within provider");
  return context;
};
