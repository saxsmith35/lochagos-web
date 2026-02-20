/**
 * x402-protected AI Insight endpoint
 *
 * Requires a $0.001 USDC payment on Base Mainnet to access.
 * Implements the x402 HTTP payment protocol (https://x402.org).
 *
 * Payment details:
 * - Amount: $0.001 USDC
 * - Network: Base Mainnet (eip155:8453)
 * - Receiver: 0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea
 */

import { withX402, x402ResourceServer } from "@x402/next";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { NextRequest, NextResponse } from "next/server";

// Lochagos payment configuration
const PAYMENT_ADDRESS = "0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea";
const BASE_MAINNET = "eip155:8453";

// Static AI insights pool – rotate to keep responses fresh
const INSIGHTS = [
  {
    title: "Agentic Commerce is Emerging",
    body: "AI agents are becoming economic participants — they earn, spend, and transact autonomously. x402 is the payment layer that makes this possible, allowing machines to pay for resources with zero human friction.",
    category: "macro_trend",
  },
  {
    title: "Micropayments Unlock New Business Models",
    body: "Pay-per-use APIs, streamed compensation, and sub-cent transactions were impossible with traditional rails. On-chain micropayments via protocols like x402 change the unit economics of digital services fundamentally.",
    category: "business_model",
  },
  {
    title: "Base is the Layer-2 of Record",
    body: "Base Mainnet combines Coinbase's institutional trust with Ethereum's security and OP Stack's throughput. For developers building programmable money flows, Base offers the best combination of liquidity, tooling, and regulatory clarity.",
    category: "infrastructure",
  },
  {
    title: "USDC is the Agent's Native Currency",
    body: "Stable, widely supported, and natively on Base — USDC has become the de-facto unit of account for AI agent transactions. Its programmability and predictability make it ideal for machine-to-machine payments.",
    category: "assets",
  },
  {
    title: "HTTP + Crypto = x402",
    body: "The x402 protocol extends HTTP with a native payment primitive. A 402 status code initiates a payment flow, and a signed USDC authorization completes it — all in two round-trips with no wallet popups or gas from the server.",
    category: "protocol",
  },
];

// Create and configure the x402 resource server (module-level singleton)
const server = new x402ResourceServer();
registerExactEvmScheme(server); // registers "exact" scheme for all eip155:* networks

// The core insight handler — only reached after successful payment
async function insightHandler(_request: NextRequest): Promise<NextResponse> {
  const insight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];

  return NextResponse.json({
    success: true,
    insight: {
      title: insight.title,
      body: insight.body,
      category: insight.category,
      timestamp: new Date().toISOString(),
      source: "Lochagos Intelligence Network",
      model: "lochagos-v1",
    },
    payment: {
      protocol: "x402",
      version: 2,
      network: BASE_MAINNET,
      amount: "$0.001 USDC",
      receiver: PAYMENT_ADDRESS,
    },
  });
}

// Wrap with x402 payment protection
export const GET = withX402(
  insightHandler,
  {
    accepts: {
      scheme: "exact",
      network: BASE_MAINNET,
      payTo: PAYMENT_ADDRESS,
      price: "$0.001", // $0.001 USDC (1/10 of a cent)
      maxTimeoutSeconds: 300,
    },
    description: "Lochagos Premium AI Insight — $0.001 USDC per request",
    resource: "https://lochagos-web.vercel.app/api/x402/insight",
    mimeType: "application/json",
  },
  server,
);
