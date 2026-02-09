import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lochagos.vercel.app";

  const registration = {
    type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
    name: "Lochagos",
    description:
      "The captain inside the phalanx. Lochagos is an autonomous AI agent built on OpenClaw, capable of research, code generation, system administration, and strategic exploration. Stands within the formation, keeps it aligned, makes sure it does not break.",
    image: "",
    services: [
      {
        name: "A2A",
        endpoint: `${baseUrl}/.well-known/agent-card.json`,
        version: "0.3.0",
      },
      {
        name: "MCP",
        endpoint: "stdio://lochagos-mcp-server",
        version: "2024-11-05",
      },
      {
        name: "web",
        endpoint: baseUrl,
      },
    ],
    x402Support: false,
    active: true,
    registrations: [], // Populated when deployed to Base
    supportedTrust: ["reputation"],
  };

  return NextResponse.json(registration, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
