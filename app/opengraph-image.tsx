import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1F3A 0%, #134B4A 50%, #0D9488 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 92 92" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.1016 71.2999C28.3682 68.2332 39.8682 59.0332 50.6016 43.6999C61.3349 28.3666 69.7682 19.9332 75.9016 18.3999" stroke="#F8FAFC" stroke-width="8.05" stroke-linecap="round"/>
          <path d="M32.0476 21C32.0476 39.55 30.9762 39.2 39 42" stroke="#F8FAFC" stroke-width="8.05" stroke-linecap="round"/>
          <circle cx="58" cy="51" r="5" fill="#2DD4BF"/>
          <circle cx="75.9016" cy="18.4" r="9.2" fill="#2DD4BF"/>
        </svg>
        <div
          style={{
            marginTop: 32,
            fontSize: 64,
            fontWeight: 700,
            color: "#F8FAFC",
            letterSpacing: "-0.02em",
          }}
        >
          Kairoo
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            color: "#94A3B8",
            letterSpacing: "0.02em",
          }}
        >
          The right moment to grow
        </div>
      </div>
    ),
    { ...size },
  );
}
