import { routes } from "@/config/routes";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  requiresAuth?: boolean;
  children?: NavItem[];
};

export const primaryNav: NavItem[] = [
  { label: "Features", href: routes.features },
  { label: "Pricing", href: routes.pricing },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Product",
    items: [
      { label: "Features", href: routes.features },
      { label: "Pricing", href: routes.pricing },
      { label: "Style guide", href: routes.style },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: routes.about },
      { label: "Contact", href: routes.contact },
      { label: "Investors", href: routes.investors, requiresAuth: true },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy", href: routes.privacy },
      { label: "Terms", href: routes.terms },
      { label: "Cookies", href: routes.cookies },
    ],
  },
];

export const investorNav: NavItem[] = [
  { label: "Overview", href: routes.investors, requiresAuth: true },
  { label: "Deck", href: routes.investorsDeck, requiresAuth: true },
  { label: "Market", href: routes.investorsMarket, requiresAuth: true },
  { label: "Strategy", href: routes.investorsStrategy, requiresAuth: true },
  {
    label: "Architecture",
    href: routes.investorsArchitecture,
    requiresAuth: true,
  },
];
