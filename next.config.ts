import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      { source: "/business-strategy", destination: "/investors/strategy", permanent: true },
      { source: "/market-analysis", destination: "/investors/market", permanent: true },
      { source: "/investor-deck", destination: "/investors/deck", permanent: true },
      { source: "/technical-architecture", destination: "/investors/architecture", permanent: true },
    ];
  },
};

export default nextConfig;
