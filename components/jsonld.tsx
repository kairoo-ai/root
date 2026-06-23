import { site } from "@/config/site";
import type { tiers } from "@/config/tiers";

const base = site.baseUrl;

/* ------------------------------------------------------------------ */
/*  JsonLd — render any JSON-LD as a <script> tag                    */
/* ------------------------------------------------------------------ */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Organization                                                      */
/* ------------------------------------------------------------------ */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: base,
    logo: `${base}/icon.svg`,
    description: site.description,
    slogan: site.tagline,
    foundingDate: "2025",
    email: site.supportEmail,
    contactPoint: [
      { "@type": "ContactPoint", email: site.supportEmail, contactType: "customer support" },
      { "@type": "ContactPoint", email: site.investorEmail, contactType: "investor relations" },
    ],
    sameAs: [
      "https://linkedin.com/company/kairoo",
      "https://twitter.com/kairoo",
      "https://github.com/kairoo",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  WebSite                                                           */
/* ------------------------------------------------------------------ */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: base,
    description: site.description,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  SoftwareApplication                                               */
/* ------------------------------------------------------------------ */
export function softwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    url: base,
    description: "AI-powered career development platform with 38+ tools, intelligent learning paths, and strategic business intelligence.",
    applicationCategory: ["CareerDevelopment", "EducationApplication", "BusinessApplication"],
    operatingSystem: "Web",
    browserRequirements: "Modern browser required",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: 0,
      highPrice: 19,
      priceCurrency: "USD",
      offerCount: 3,
      offers: [
        { "@type": "Offer", name: "Explorer", price: 0, priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: 19, priceCurrency: "USD", billingDuration: "P1M" },
        { "@type": "Offer", name: "Enterprise", priceCurrency: "USD" },
      ],
    },
    featureList: "Dynamic Career Roadmaps, AI Interview Coach, Salary Negotiation Coach, Learning Paths, AI Tutor, Team Skill Analytics, Skill Gap Analysis, Resume Builder, Career Simulator, Networking Strategist",
  };
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList                                                    */
/* ------------------------------------------------------------------ */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.path}`,
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Product (pricing tier)                                            */
/* ------------------------------------------------------------------ */
export function productSchema(name: string, description: string, price: number | string, currency = "USD") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${site.name} ${name}`,
    description,
    url: `${base}/pricing`,
    offers: {
      "@type": "Offer",
      price: typeof price === "number" ? price : undefined,
      priceCurrency: currency,
      ...(typeof price === "string" ? {} : {}),
      availability: "https://schema.org/InStock",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  AggregateRating                                                   */
/* ------------------------------------------------------------------ */
export function aggregateRatingSchema(ratingValue: number, bestRating: number, ratingCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Organization", name: site.name, url: base },
    ratingValue,
    bestRating,
    ratingCount,
  };
}

/* ------------------------------------------------------------------ */
/*  Review                                                            */
/* ------------------------------------------------------------------ */
export function reviewSchema(author: string, reviewBody: string, ratingValue: number) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "SoftwareApplication", name: site.name },
    author: { "@type": "Person", name: author },
    reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  FAQPage                                                           */
/* ------------------------------------------------------------------ */
export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  ItemList (features catalog)                                       */
/* ------------------------------------------------------------------ */
export function itemListSchema(items: { name: string; description: string }[], itemType: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": itemType,
        name: item.name,
        description: item.description,
      },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  Person                                                            */
/* ------------------------------------------------------------------ */
export function personSchema(name: string, jobTitle: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    worksFor: { "@type": "Organization", name: site.name },
  };
}
