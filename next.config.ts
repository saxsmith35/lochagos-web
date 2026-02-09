import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/agent-card.json",
        destination: "/api/agent-card",
      },
      {
        source: "/.well-known/agent-registration.json",
        destination: "/api/erc8004",
      },
    ];
  },
};

export default nextConfig;
