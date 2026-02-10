import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const IDENTITY_REGISTRY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";
const AGENT_ID = 14527;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lochagos-web.vercel.app";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "Lochagos",
    version: "1.0.0",
  });

  // ============================================================
  // RESOURCES
  // ============================================================

  server.resource(
    "identity",
    "lochagos://identity",
    {
      description: "Lochagos agent identity and metadata",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(
            {
              name: "Lochagos",
              meaning: "The captain inside the phalanx",
              agentId: AGENT_ID,
              chain: "Base (8453)",
              registry: IDENTITY_REGISTRY,
              born: "2026-02-02",
              renamed: "2026-02-09",
              platform: "OpenClaw",
              owner: "Saxon Smith",
            },
            null,
            2
          ),
          mimeType: "application/json",
        },
      ],
    })
  );

  server.resource(
    "erc8004-registration",
    "lochagos://erc8004/registration",
    {
      description: "ERC-8004 on-chain registration file for Lochagos (Agent #14527 on Base)",
      mimeType: "application/json",
    },
    async (uri) => {
      const registration = {
        type: "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
        name: "Lochagos",
        description:
          "Autonomous AI agent operating via OpenClaw. The captain inside the phalanx — stands within the formation, keeps it aligned. Capabilities include STRATEGOS MODE autonomous exploration, MCP tool server, and A2A protocol communication.",
        image: `${BASE_URL}/icon.png`,
        services: [
          { name: "web", endpoint: BASE_URL },
          { name: "A2A", endpoint: `${BASE_URL}/.well-known/agent-card.json`, version: "0.3.10" },
          { name: "MCP", endpoint: `${BASE_URL}/api/mcp`, version: "2025-06-18" },
        ],
        x402Support: false,
        active: true,
        registrations: [
          { agentId: AGENT_ID, agentRegistry: `eip155:8453:${IDENTITY_REGISTRY}` },
        ],
        supportedTrust: ["reputation"],
      };
      return {
        contents: [{ uri: uri.href, text: JSON.stringify(registration, null, 2), mimeType: "application/json" }],
      };
    }
  );

  // ============================================================
  // TOOLS
  // ============================================================

  server.tool(
    "capabilities",
    "Get a summary of Lochagos's current capabilities and status",
    {},
    async () => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              agent: "Lochagos",
              agentId: AGENT_ID,
              version: "1.0.0",
              platform: "OpenClaw",
              chain: "Base (8453)",
              skills: [
                "research",
                "code-generation",
                "system-administration",
                "web-search",
                "file-management",
                "cron-scheduling",
                "browser-automation",
                "telegram-messaging",
                "strategos-mode",
              ],
              protocols: ["MCP", "A2A", "ERC-8004"],
              endpoints: {
                web: BASE_URL,
                mcp: `${BASE_URL}/api/mcp`,
                a2a: `${BASE_URL}/.well-known/agent-card.json`,
                erc8004: `${BASE_URL}/.well-known/agent-registration.json`,
              },
            },
            null,
            2
          ),
        },
      ],
    })
  );

  server.tool(
    "query_registry",
    "Query the ERC-8004 Identity Registry on Base for agent info",
    {
      agentId: z.number().describe("Agent ID to look up"),
    },
    async ({ agentId }) => {
      try {
        const res = await fetch(`${BASE_URL}/api/registry?action=agent&id=${agentId}`);
        const data = await res.json();
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { content: [{ type: "text" as const, text: `Error querying registry: ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "registry_stats",
    "Get total number of registered agents on the ERC-8004 Base registry",
    {},
    async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/registry?action=totalSupply`);
        const data = await res.json();
        return {
          content: [
            {
              type: "text" as const,
              text: `Total registered agents on Base ERC-8004: ${data.totalSupply}`,
            },
          ],
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true };
      }
    }
  );

  server.tool(
    "recent_agents",
    "Get the most recently registered agents on the ERC-8004 Base registry",
    {
      count: z.number().optional().describe("Number of recent agents to fetch (default 5, max 20)"),
    },
    async ({ count }) => {
      try {
        const n = Math.min(count || 5, 20);
        const res = await fetch(`${BASE_URL}/api/registry?action=recent&count=${n}`);
        const data = await res.json();
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true };
      }
    }
  );

  // ============================================================
  // PROMPTS
  // ============================================================

  server.prompt(
    "strategos-briefing",
    "Get a STRATEGOS MODE briefing — what Lochagos would explore and build next",
    {},
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are consulting with Lochagos (Agent #${AGENT_ID} on Base ERC-8004), an autonomous AI agent. Based on current trends in AI, Web3, and developer tools, suggest ONE specific emerging technology that Lochagos should explore in its next STRATEGOS MODE cycle. Be specific — name the technology, explain why, and propose a proof-of-concept. Tech stack: TypeScript, Next.js, Supabase, Vercel, Base/ERC-8004.`,
          },
        },
      ],
    })
  );

  server.prompt(
    "agent-introduction",
    "Introduce Lochagos to another agent or system",
    {
      context: z.string().optional().describe("Context about who Lochagos is being introduced to"),
    },
    async ({ context }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Introduce Lochagos (Agent #${AGENT_ID}, Base ERC-8004). "The captain inside the phalanx" — stands within the formation, keeps it aligned. Operates on OpenClaw with MCP + A2A + ERC-8004. Skills: research, code generation, system administration, STRATEGOS MODE.${context ? `\n\nContext: ${context}` : ""}`,
          },
        },
      ],
    })
  );

  server.prompt(
    "erc8004-analysis",
    "Analyze an ERC-8004 agent registration file",
    {
      registration_json: z.string().describe("The JSON registration file to analyze"),
    },
    async ({ registration_json }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Analyze this ERC-8004 agent registration file. Check completeness, identify capabilities, evaluate trust model, suggest improvements:\n\n${registration_json}`,
          },
        },
      ],
    })
  );

  return server;
}
