import { ImageResponse } from "next/og";

// We removed 'runtime' and 'dynamic' completely to satisfy Turbopack
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("image");

    if (!imageUrl) {
      return new Response("Missing image URL", { status: 400 });
    }

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>,
      {
        width: 300,
        height: 300,
      },
    );
  } catch (e) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
