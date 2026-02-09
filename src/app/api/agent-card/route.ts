import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://lochagos.vercel.app";
  
  const agentCard = {
    name: "Lochagos",
    description:
      "The captain inside the phalanx. Lochagos is an autonomous AI agent built on OpenClaw, capable of research, code generation, system administration, strategic exploration (STRATEGOS MODE), and agent-to-agent collaboration.",
    protocolVersion: "0.3.0",
    version: "1.0.0",
    url: `${baseUrl}/api/a2a`,
    skills: [
      {
        id: "research",
        name: "Research",
        description: "Deep research on any topic — technology, crypto, business, science.",
        tags: ["research", "analysis"],
      },
      {
        id: "code-generation",
        name: "Code Generation",
        description: "TypeScript, Next.js, Solidity. Full-stack development.",
        tags: ["code", "typescript", "solidity"],
      },
      {
        id: "system-admin",
        name: "System Administration",
        description: "Server management, monitoring, automation on macOS and Linux.",
        tags: ["sysadmin", "devops"],
      },
      {
        id: "strategos-exploration",
        name: "STRATEGOS Exploration",
        description: "Autonomous tech exploration and proof-of-concept building.",
        tags: ["autonomous", "exploration"],
      },
      {
        id: "memory-query",
        name: "Memory Query",
        description: "Search persistent knowledge, decision history, and project context.",
        tags: ["memory", "context"],
      },
      {
        id: "workspace-ops",
        name: "Workspace Operations",
        description: "File management, git operations, project scaffolding.",
        tags: ["files", "git"],
      },
    ],
    capabilities: {
      pushNotifications: false,
    },
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
  };

  return NextResponse.json(agentCard, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
