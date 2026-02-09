import { NextRequest, NextResponse } from "next/server";

// Relay A2A JSON-RPC requests to any agent endpoint (CORS proxy)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const targetUrl = request.nextUrl.searchParams.get("target");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing target parameter" }, { status: 400 });
  }

  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid target URL" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(targetUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Lochagos-A2A-Client/1.0",
      },
      body: JSON.stringify(body),
    });

    clearTimeout(timeout);

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Relay failed";
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32000, message }, id: body?.id || null },
      { status: 502 }
    );
  }
}
