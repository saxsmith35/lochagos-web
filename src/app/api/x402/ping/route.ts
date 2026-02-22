/**
 * x402-protected Ping endpoint
 *
 * The simplest possible x402-gated resource — a ping that returns a pong.
 * Requires a $0.001 USDC payment on Base Sepolia (testnet).
 *
 * Payment details:
 * - Amount: $0.001 USDC
 * - Network: Base Sepolia (eip155:84532) — testnet supported by the public x402 facilitator
 * - Receiver: 0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea
 *
 * Usage (without payment — returns 402):
 *   curl https://lochagos-web.vercel.app/api/x402/ping
 *
 * Usage (with x402 client):
 *   import { wrapFetchWithPayment } from "@x402/fetch";
 *   const fetch402 = wrapFetchWithPayment(fetch, wallet);
 *   const res = await fetch402("https://lochagos-web.vercel.app/api/x402/ping");
 */

import { withX402, x402ResourceServer } from "@x402/next";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { NextRequest, NextResponse } from "next/server";

// Lochagos payment configuration
const PAYMENT_ADDRESS = "0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea";
const BASE_SEPOLIA = "eip155:84532";

// Create and configure the x402 resource server (module-level singleton)
const server = new x402ResourceServer();
registerExactEvmScheme(server);

// The core handler — only reached after successful payment
async function pingHandler(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    message: "pong",
    agent: "Lochagos",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    payment: {
      protocol: "x402",
      version: 2,
      network: BASE_SEPOLIA,
      amount: "$0.001 USDC",
      receiver: PAYMENT_ADDRESS,
    },
    links: {
      insight: "https://lochagos-web.vercel.app/api/x402/insight",
      skill_registry: "https://lochagos-web.vercel.app/api/x402/skill-registry",
      docs: "https://x402.org",
    },
  });
}

// Wrap with x402 payment protection
export const GET = withX402(
  pingHandler,
  {
    accepts: {
      scheme: "exact",
      network: BASE_SEPOLIA,
      payTo: PAYMENT_ADDRESS,
      price: "$0.001",
      maxTimeoutSeconds: 300,
    },
    description: "Lochagos Agent Ping — $0.001 USDC per request",
    resource: "https://lochagos-web.vercel.app/api/x402/ping",
    mimeType: "application/json",
  },
  server,
);
