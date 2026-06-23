const appName = process.env.NEXT_PUBLIC_APP_NAME || process.env.APP_NAME || "Kairoo";

// Production domain — override via NEXT_PUBLIC_APP_URL or fall back to kairoo.mreshank.com
const envUrl = process.env.NEXT_PUBLIC_APP_URL;
const domain = envUrl
  ? envUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
  : "kairoo.mreshank.com";

export const site = {
  name: appName,
  tagline: "The right moment to grow.",
  description: `${appName} career development that grows with you.`,
  baseUrl: `https://${domain}`,
  supportEmail: `support@${domain}`,
  investorEmail: `investors@${domain}`,
} as const;

export type Site = typeof site;
