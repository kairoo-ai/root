// Single source for legally-significant values. Fill the TODOs and set draft=false
// only AFTER a lawyer reviews. Everything renders from here.
export type SubProcessor = { name: string; purpose: string; region: string };

export type LegalConfig = {
  productName: string;
  legalEntity: string;        // TODO: confirm the registered entity that owns Kairoo
  jurisdiction: string;       // TODO: confirm governing-law country/state
  effectiveDate: string;      // ISO date shown as "Last updated"
  contactEmail: string;       // general/privacy contact
  dpoEmail: string;           // data requests
  grievanceEmail: string;     // grievance officer (DPDP)
  websiteUrl: string;
  draft: boolean;             // true => show DRAFT banner sitewide on legal pages
  subProcessors: SubProcessor[];
};

export const legal: LegalConfig = {
  productName: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  legalEntity: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"} (operated by Matters AI)`, // TODO confirm registered entity
  jurisdiction: "India",                            // TODO confirm governing law
  effectiveDate: "2026-06-14",
  contactEmail: "privacy+kairoo@mreshank.com",
  dpoEmail: "privacy+kairoo@mreshank.com",
  grievanceEmail: "privacy+kairoo@mreshank.com",
  websiteUrl: "https://kairoo.mreshank.com",
  draft: true,
  subProcessors: [
    { name: "Google (Gemini API)", purpose: "AI generation of career guidance from user input", region: "USA / Global" },
    { name: "Vercel", purpose: "Application hosting & delivery", region: "USA / Global" },
  ],
};
