import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    agent: "Lochagos",
    version: "1.0.0",
    protocols: {
      a2a: "0.3.0",
      mcp: "2024-11-05",
      erc8004: "draft",
    },
    platform: "OpenClaw",
    owner: "Saxon Smith",
    born: "2026-02-02",
    renamed: "2026-02-09",
    timestamp: new Date().toISOString(),
  });
}
