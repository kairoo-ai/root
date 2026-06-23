import {
  organizationSchema,
  websiteSchema,
  softwareAppSchema,
  aggregateRatingSchema,
  JsonLd,
} from "@/components/jsonld";

const testimonials = [
  {
    author: "Sarah Chen",
    role: "Data Scientist",
    company: "Google",
    body: "I went from marketing to data science in just 8 months using Kairoo. The personalized learning path saved me thousands of hours of research. I landed a $125K role at Google!",
  },
  {
    author: "Marcus Rodriguez",
    role: "Staff Engineer",
    company: "Stripe",
    body: "Kairoo's AI coaching helped me navigate my promotion to Staff Engineer. Got a 40% raise!",
  },
  {
    author: "Amanda Park",
    role: "L&D Director",
    company: "Salesforce",
    body: "Our team's productivity increased 300% after implementing Kairoo.",
  },
];

export function SchemaOrg() {
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    softwareAppSchema(),
    aggregateRatingSchema(4.9, 5, 150),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} schema={s} />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page-specific schema wrappers                                     */
/* ------------------------------------------------------------------ */

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${process.env.NEXT_PUBLIC_APP_NAME === "Kairoo" ? "https://kairoo.com" : "https://astrapath.ai"}${item.path}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ entries }: { entries: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries.map((e) => ({
          "@type": "Question",
          name: e.question,
          acceptedAnswer: { "@type": "Answer", text: e.answer },
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  price,
  currency = "USD",
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
}) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: `Kairoo ${name}`,
        description,
        url: "https://kairoo.com/pricing",
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

export function ReviewJsonLd({
  author,
  reviewBody,
  ratingValue,
}: {
  author: string;
  reviewBody: string;
  ratingValue: number;
}) {
  return (
    <JsonLd
      schema={{
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: { "@type": "SoftwareApplication", name: "Kairoo" },
        author: { "@type": "Person", name: author },
        reviewBody,
        reviewRating: { "@type": "Rating", ratingValue, bestRating: 5 },
      }}
    />
  );
}
