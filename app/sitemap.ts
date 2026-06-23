import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const base = site.baseUrl.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "", "/about", "/careers", "/contact", "/customers", "/features",
    "/features/career", "/features/learning", "/features/teams",
    "/how-it-works", "/pricing", "/security",
    "/privacy", "/terms", "/cookies", "/acceptable-use",
    "/ai-disclosure", "/dpa", "/sub-processors",
    "/investors", "/investors/architecture", "/investors/deck",
    "/investors/market", "/investors/strategy",
  ];

  return routes.map((r) => ({ url: `${base}${r}`, lastModified: now }));
}
