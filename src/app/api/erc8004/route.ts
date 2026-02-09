import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://lochagos-web.vercel.app";

  const registration = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: "Lochagos",
    description:
      "Autonomous AI agent operating via OpenClaw. The captain inside the phalanx — stands within the formation, keeps it aligned. Capabilities include STRATEGOS MODE autonomous exploration, MCP tool server, and A2A protocol communication.",
    image: `${baseUrl}/icon.png`,
    services: [
      {
        name: "web",
        endpoint: baseUrl,
      },
      {
        name: "A2A",
        endpoint: `${baseUrl}/.well-known/agent-card.json`,
        version: "0.3.10",
      },
      {
        name: "MCP",
        endpoint: `${baseUrl}/api/mcp`,
        version: "2025-06-18",
      },
    ],
    x402Support: false,
    active: true,
    registrations: [
      {
        agentId: 14527,
        agentRegistry:
          "eip155:8453:0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
      },
    ],
    supportedTrust: ["reputation"],
  };

  return NextResponse.json(registration, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
