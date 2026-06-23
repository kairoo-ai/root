import type { MetadataRoute } from "next";
import { site } from "@/config/site";

const base = site.baseUrl.replace(/\/$/, "");
const now = new Date();

type RouteDef = { path: string; priority: number; changefreq?: MetadataRoute.Sitemap[number]["changeFrequency"] };

const routes: RouteDef[] = [
  /* Marketing — highest priority */
  { path: "", priority: 1.0, changefreq: "weekly" },
  { path: "/pricing", priority: 0.9, changefreq: "monthly" },
  { path: "/features", priority: 0.9, changefreq: "weekly" },
  { path: "/how-it-works", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/customers", priority: 0.7, changefreq: "monthly" },
  { path: "/security", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.6, changefreq: "monthly" },
  { path: "/careers", priority: 0.6, changefreq: "weekly" },

  /* Feature sub-pages */
  { path: "/features/career", priority: 0.8, changefreq: "monthly" },
  { path: "/features/learning", priority: 0.8, changefreq: "monthly" },
  { path: "/features/teams", priority: 0.7, changefreq: "monthly" },

  /* Legal */
  { path: "/privacy", priority: 0.4, changefreq: "yearly" },
  { path: "/terms", priority: 0.4, changefreq: "yearly" },
  { path: "/cookies", priority: 0.3, changefreq: "yearly" },
  { path: "/acceptable-use", priority: 0.3, changefreq: "yearly" },
  { path: "/ai-disclosure", priority: 0.3, changefreq: "yearly" },
  { path: "/dpa", priority: 0.3, changefreq: "yearly" },
  { path: "/sub-processors", priority: 0.3, changefreq: "yearly" },

  /* Investors */
  { path: "/investors", priority: 0.5, changefreq: "monthly" },
  { path: "/investors/deck", priority: 0.4, changefreq: "monthly" },
  { path: "/investors/market", priority: 0.4, changefreq: "monthly" },
  { path: "/investors/strategy", priority: 0.4, changefreq: "monthly" },
  { path: "/investors/architecture", priority: 0.3, changefreq: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));
}
