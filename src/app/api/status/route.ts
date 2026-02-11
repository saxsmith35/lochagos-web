import { NextResponse } from "next/server";
import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

const REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as const;
const AGENT_ID = BigInt(14527);

const abi = parseAbi([
  "function getAgentURI(uint256 agentId) view returns (string)",
  "function getAgentOwner(uint256 agentId) view returns (address)",
]);

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

interface EndpointResult {
  url: string;
  status: "ok" | "error";
  latencyMs: number;
  statusCode?: number;
  error?: string;
}

async function checkEndpoint(url: string): Promise<EndpointResult> {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });
    return {
      url,
      status: res.ok ? "ok" : "error",
      latencyMs: Date.now() - start,
      statusCode: res.status,
    };
  } catch (e: unknown) {
    return {
      url,
      status: "error",
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://lochagos-web.vercel.app";

  // Check endpoints in parallel
  const [health, agentCard, erc8004, mcp] = await Promise.all([
    checkEndpoint(`${baseUrl}/api/health`),
    checkEndpoint(`${baseUrl}/.well-known/agent-card.json`),
    checkEndpoint(`${baseUrl}/.well-known/agent-registration.json`),
    checkEndpoint(`${baseUrl}/api/mcp`),
  ]);

  // On-chain data
  let onChain: {
    owner?: string;
    uri?: string;
    error?: string;
  } = {};

  try {
    const [owner, uri] = await Promise.all([
      client.readContract({
        address: REGISTRY,
        abi,
        functionName: "getAgentOwner",
        args: [AGENT_ID],
      }),
      client.readContract({
        address: REGISTRY,
        abi,
        functionName: "getAgentURI",
        args: [AGENT_ID],
      }),
    ]);
    onChain = { owner: owner as string, uri: uri as string };
  } catch (e: unknown) {
    onChain = { error: e instanceof Error ? e.message : "Failed to read chain" };
  }

  const allOk = [health, agentCard, erc8004].every((e) => e.status === "ok");

  return NextResponse.json({
    agent: "Lochagos",
    agentId: 14527,
    status: allOk ? "operational" : "degraded",
    timestamp: new Date().toISOString(),
    endpoints: { health, agentCard, erc8004, mcp },
    onChain,
    meta: {
      registry: REGISTRY,
      chain: "Base Mainnet (8453)",
      born: "2026-02-02",
      renamed: "2026-02-09",
    },
  });
}
