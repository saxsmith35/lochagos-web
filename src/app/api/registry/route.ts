import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

const IDENTITY_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432" as const;

const abi = parseAbi([
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function getAgentWallet(uint256 agentId) view returns (address)",
]);

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "totalSupply") {
      const supply = await client.readContract({
        address: IDENTITY_REGISTRY,
        abi,
        functionName: "totalSupply",
      });
      return NextResponse.json({ totalSupply: Number(supply) }, { headers: corsHeaders() });
    }

    if (action === "agent") {
      const id = searchParams.get("id");
      if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

      const agentId = BigInt(id);
      const [tokenURI, owner] = await Promise.all([
        client.readContract({ address: IDENTITY_REGISTRY, abi, functionName: "tokenURI", args: [agentId] }),
        client.readContract({ address: IDENTITY_REGISTRY, abi, functionName: "ownerOf", args: [agentId] }),
      ]);

      // Parse data URI or return raw
      let registration = null;
      if (tokenURI.startsWith("data:application/json;base64,")) {
        const b64 = tokenURI.slice("data:application/json;base64,".length);
        registration = JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
      }

      return NextResponse.json(
        { agentId: Number(agentId), owner, tokenURI, registration },
        { headers: corsHeaders() }
      );
    }

    if (action === "recent") {
      const count = Math.min(Number(searchParams.get("count") || "10"), 20);
      const supply = await client.readContract({
        address: IDENTITY_REGISTRY,
        abi,
        functionName: "totalSupply",
      });
      const total = Number(supply);
      const start = Math.max(1, total - count + 1);
      const agents = [];

      for (let i = total; i >= start; i--) {
        try {
          const [tokenURI, owner] = await Promise.all([
            client.readContract({ address: IDENTITY_REGISTRY, abi, functionName: "tokenURI", args: [BigInt(i)] }),
            client.readContract({ address: IDENTITY_REGISTRY, abi, functionName: "ownerOf", args: [BigInt(i)] }),
          ]);
          let registration = null;
          if (tokenURI.startsWith("data:application/json;base64,")) {
            const b64 = tokenURI.slice("data:application/json;base64,".length);
            try { registration = JSON.parse(Buffer.from(b64, "base64").toString("utf-8")); } catch {}
          } else if (tokenURI.startsWith("https://") || tokenURI.startsWith("ipfs://")) {
            registration = { _uri: tokenURI };
          }
          agents.push({ agentId: i, owner, registration, tokenURI: tokenURI.slice(0, 100) });
        } catch {
          // Token may not exist (burned), skip
        }
      }

      return NextResponse.json({ total, agents }, { headers: corsHeaders() });
    }

    return NextResponse.json(
      { error: "Unknown action. Use ?action=totalSupply|agent&id=N|recent&count=N" },
      { status: 400 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders() });
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=30",
  };
}
