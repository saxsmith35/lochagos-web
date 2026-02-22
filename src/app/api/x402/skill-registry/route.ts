/**
 * x402-protected Skill Registry endpoint
 *
 * Paid access to Lochagos skill registry data.
 * Requires a $0.01 USDC payment on Base Sepolia (testnet).
 *
 * Payment details:
 * - Amount: $0.01 USDC
 * - Network: Base Sepolia (eip155:84532) — testnet supported by the public x402 facilitator
 * - Receiver: 0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea
 *
 * Returns:
 * - Current skill count
 * - Full skill list
 * - Registry metadata (version, last harvest time)
 * - Recent additions (up to 5 most recently added)
 *
 * Usage (without payment — returns 402):
 *   curl https://lochagos-web.vercel.app/api/x402/skill-registry
 *
 * Usage (with x402 client):
 *   import { wrapFetchWithPayment } from "@x402/fetch";
 *   const fetch402 = wrapFetchWithPayment(fetch, wallet);
 *   const res = await fetch402("https://lochagos-web.vercel.app/api/x402/skill-registry");
 */

import { withX402, x402ResourceServer } from "@x402/next";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { NextRequest, NextResponse } from "next/server";

// Lochagos payment configuration
const PAYMENT_ADDRESS = "0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea";
const BASE_SEPOLIA = "eip155:84532";

// Embedded registry snapshot — updated at build time
// Source: lochagos-skill-registry/registry.json
const REGISTRY_SNAPSHOT = {
  version: 1,
  last_harvest: "2026-02-21T21:39:28.949538+00:00",
  total_skills: 10,
  skills: [
    "browser-use",
    "composio",
    "exa-search",
    "firecrawl",
    "mem0",
    "mcp-server",
    "openai-swarm",
    "perplexity-sonar",
    "replicate-image",
    "tavily-search",
  ],
  categories: {
    search: ["exa-search", "perplexity-sonar", "tavily-search"],
    memory: ["mem0"],
    web: ["browser-use", "firecrawl"],
    integration: ["composio", "mcp-server", "openai-swarm"],
    media: ["replicate-image"],
  },
};

// Create and configure the x402 resource server (module-level singleton)
const server = new x402ResourceServer();
registerExactEvmScheme(server);

// The core handler — only reached after successful payment
async function skillRegistryHandler(
  _request: NextRequest
): Promise<NextResponse> {
  const skills = REGISTRY_SNAPSHOT.skills;
  const recentCount = Math.min(5, skills.length);
  const recentAdditions = skills.slice(-recentCount);

  // Compute category stats
  const categoryStats = Object.entries(REGISTRY_SNAPSHOT.categories).map(
    ([cat, entries]) => ({
      category: cat,
      count: entries.length,
      skills: entries,
    })
  );

  return NextResponse.json({
    success: true,
    registry: {
      version: REGISTRY_SNAPSHOT.version,
      last_harvest: REGISTRY_SNAPSHOT.last_harvest,
      total_skills: REGISTRY_SNAPSHOT.total_skills,
      skills: skills,
    },
    stats: {
      total_skills: skills.length,
      total_categories: Object.keys(REGISTRY_SNAPSHOT.categories).length,
      by_category: categoryStats,
    },
    recent_additions: recentAdditions,
    timestamp: new Date().toISOString(),
    source: "Lochagos Skill Registry",
    payment: {
      protocol: "x402",
      version: 2,
      network: BASE_SEPOLIA,
      amount: "$0.01 USDC",
      receiver: PAYMENT_ADDRESS,
    },
  });
}

// Wrap with x402 payment protection
export const GET = withX402(
  skillRegistryHandler,
  {
    accepts: {
      scheme: "exact",
      network: BASE_SEPOLIA,
      payTo: PAYMENT_ADDRESS,
      price: "$0.01",
      maxTimeoutSeconds: 300,
    },
    description:
      "Lochagos Skill Registry — Paid access to current skill list, stats, and recent additions. $0.01 USDC per request.",
    resource: "https://lochagos-web.vercel.app/api/x402/skill-registry",
    mimeType: "application/json",
  },
  server,
);
