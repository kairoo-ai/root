import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kairoo - The right moment to grow",
    short_name: "Kairoo",
    description: "AI career development platform with 38+ tools, learning paths, and team analytics",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0B1F3A",
    theme_color: "#0B1F3A",
    icons: [
      { src: "/icon.svg", sizes: "92x92", type: "image/svg+xml" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
    categories: ["career", "education", "productivity"],
    lang: "en-US",
  };
}
