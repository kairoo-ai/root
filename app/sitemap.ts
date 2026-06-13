import type { MetadataRoute } from "next";
import { legal } from "@/lib/legal/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = legal.websiteUrl.replace(/\/$/, "");
  const routes = ["", "/privacy", "/terms", "/cookies", "/acceptable-use", "/ai-disclosure", "/dpa", "/sub-processors", "/security"];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date(legal.effectiveDate + "T00:00:00Z") }));
}
