export const routes = {
  home: "/",
  pricing: "/pricing",
  features: "/features",
  about: "/about",
  contact: "/contact",
  investors: "/investors",
  investorsDeck: "/investors/deck",
  investorsMarket: "/investors/market",
  investorsStrategy: "/investors/strategy",
  investorsArchitecture: "/investors/architecture",
  style: "/style",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
} as const;

export type RouteKey = keyof typeof routes;
