import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("image");

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fff",
      }}
    >
      <img
        src={imageUrl || ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>,
    { width: 300, height: 300 }, // This forces the "Diwan" square size
  );
}
