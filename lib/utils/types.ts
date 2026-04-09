import { Block } from "@/types/cms";

export const normalizeBlock = (block: unknown): Block => {
  const b = (block ?? {}) as { type?: unknown; data?: unknown };
  const type = typeof b.type === "string" ? b.type : "paragraph";
  const data = b.data;

  const dataObj =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>)
      : undefined;

  switch (type) {
    case "paragraph": {
      const text =
        dataObj && typeof dataObj["text"] === "string"
          ? (dataObj["text"] as string)
          : "";
      return { type: "paragraph", data: { text } };
    }
    case "quote": {
      const text =
        dataObj && typeof dataObj["text"] === "string"
          ? (dataObj["text"] as string)
          : "";
      const caption =
        dataObj && typeof dataObj["caption"] === "string"
          ? (dataObj["caption"] as string)
          : undefined;
      return { type: "quote", data: { text, caption } };
    }
    case "image": {
      const urlFromUrlKey =
        dataObj && typeof dataObj["url"] === "string"
          ? (dataObj["url"] as string)
          : undefined;

      const fileObj =
        dataObj &&
        typeof dataObj["file"] === "object" &&
        dataObj["file"] !== null
          ? (dataObj["file"] as Record<string, unknown>)
          : undefined;

      const urlFromFileKey =
        fileObj && typeof fileObj["url"] === "string"
          ? (fileObj["url"] as string)
          : undefined;

      const url = urlFromUrlKey ?? urlFromFileKey ?? undefined;

      const captionFromTop =
        dataObj && typeof dataObj["caption"] === "string"
          ? (dataObj["caption"] as string)
          : undefined;
      const captionFromFile =
        fileObj && typeof fileObj["caption"] === "string"
          ? (fileObj["caption"] as string)
          : undefined;
      const caption = captionFromTop ?? captionFromFile ?? undefined;

      return { type: "image", data: { file: { url }, caption } };
    }
    case "poem": {
      const colsRaw =
        dataObj && Array.isArray(dataObj["cols"])
          ? (dataObj["cols"] as unknown[])
          : [];
      const cols = colsRaw.map((item) => {
        const col =
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)
            : {};
        return {
          ajuuz:
            typeof col["ajuuz"] === "string"
              ? (col["ajuuz"] as string)
              : undefined,
          sadr:
            typeof col["sadr"] === "string"
              ? (col["sadr"] as string)
              : undefined,
        };
      });
      const caption =
        dataObj && typeof dataObj["caption"] === "string"
          ? (dataObj["caption"] as string)
          : undefined;
      const style =
        dataObj && typeof dataObj["style"] === "string"
          ? (dataObj["style"] as string)
          : undefined;
      return { type: "poem", data: { cols, caption, style } };
    }
    default: {
      const raw = dataObj ?? (typeof data === "string" ? { value: data } : {});
      return { type: type, data: raw as Record<string, unknown> };
    }
  }
};
