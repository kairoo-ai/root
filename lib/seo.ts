import type { Metadata } from "next";
import { site } from "@/config/site";

type SeoProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function seo({ title, description, path, noindex }: SeoProps): Metadata {
  const url = `${site.baseUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function ogMetadata(title: string, description: string, path: string) {
  const url = `${site.baseUrl}${path}`;
  return {
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

