import { site } from "@/config/site";

export function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.baseUrl,
        description: site.description,
        slogan: site.tagline,
        contactPoint: [
          { "@type": "ContactPoint", email: site.supportEmail, contactType: "support" },
          { "@type": "ContactPoint", email: site.investorEmail, contactType: "investor relations" },
        ],
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: site.name,
        url: site.baseUrl,
        description: site.description,
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
    />
  );
}
