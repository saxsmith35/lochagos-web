"use client";

import { useState } from "react";
import Link from "next/link";

interface AgentSkill {
  id: string;
  name: string;
  description: string;
  tags?: string[];
}

interface AgentCard {
  name: string;
  description: string;
  protocolVersion?: string;
  version?: string;
  url?: string;
  skills?: AgentSkill[];
  capabilities?: Record<string, unknown>;
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  [key: string]: unknown;
}

interface DiscoveryResult {
  status: "idle" | "loading" | "found" | "error";
  agentCard?: AgentCard;
  error?: string;
  url?: string;
  responseTime?: number;
}

export default function DiscoverPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<DiscoveryResult>({ status: "idle" });
  const [knownAgents, setKnownAgents] = useState<
    { url: string; card: AgentCard; discoveredAt: string }[]
  >([]);

  const discover = async (targetUrl: string) => {
    setResult({ status: "loading" });
    const start = Date.now();

    // Normalize URL
    let base = targetUrl.trim();
    if (!base.startsWith("http")) base = `https://${base}`;
    base = base.replace(/\/+$/, "");

    // Try standard .well-known path first, then common alternatives
    const paths = [
      "/.well-known/agent-card.json",
      "/api/agent-card",
      "/.well-known/agent.json",
    ];

    for (const path of paths) {
      try {
        const fetchUrl = `${base}${path}`;
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(fetchUrl)}`);
        if (res.ok) {
          const card = await res.json();
          if (card.name && (card.skills || card.description)) {
            const elapsed = Date.now() - start;
            setResult({
              status: "found",
              agentCard: card,
              url: fetchUrl,
              responseTime: elapsed,
            });

            // Add to known agents if not already there
            setKnownAgents((prev) => {
              if (prev.some((a) => a.url === fetchUrl)) return prev;
              return [
                ...prev,
                {
                  url: fetchUrl,
                  card,
                  discoveredAt: new Date().toISOString(),
                },
              ];
            });
            return;
          }
        }
      } catch {
        continue;
      }
    }

    setResult({
      status: "error",
      error: `No A2A Agent Card found at ${base}. Tried .well-known/agent-card.json and common alternatives.`,
      responseTime: Date.now() - start,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-xl font-bold tracking-tight">LOCHAGOS</h1>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">discover</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2">Agent Discovery</h2>
          <p className="text-zinc-400">
            Find and inspect A2A-compliant AI agents. Enter any URL to discover
            an agent&apos;s capabilities, skills, and communication endpoints.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              discover(url);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter agent URL (e.g., lochagos-web.vercel.app)"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!url.trim() || result.status === "loading"}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {result.status === "loading" ? "Scanning..." : "Discover"}
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mb-10 flex flex-wrap gap-2">
          <span className="text-xs text-zinc-500 py-1">Try:</span>
          {[
            { label: "Lochagos", url: "lochagos-web.vercel.app" },
          ].map((agent) => (
            <button
              key={agent.url}
              onClick={() => {
                setUrl(agent.url);
                discover(agent.url);
              }}
              className="text-xs px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full hover:border-zinc-500 transition-colors"
            >
              {agent.label}
            </button>
          ))}
        </div>

        {/* Result */}
        {result.status === "loading" && (
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center">
            <div className="animate-pulse text-zinc-400">
              Scanning for Agent Card...
            </div>
          </div>
        )}

        {result.status === "error" && (
          <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400">✗</span>
              <span className="font-semibold text-red-400">
                No Agent Found
              </span>
              {result.responseTime && (
                <span className="text-xs text-zinc-500 ml-auto">
                  {result.responseTime}ms
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400">{result.error}</p>
          </div>
        )}

        {result.status === "found" && result.agentCard && (
          <div className="space-y-6">
            {/* Agent Header */}
            <div className="p-6 bg-zinc-900/50 border border-green-900/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <h3 className="text-xl font-bold">
                      {result.agentCard.name}
                    </h3>
                    <p className="text-xs text-zinc-500">{result.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  {result.responseTime && (
                    <span className="text-xs text-zinc-500">
                      {result.responseTime}ms
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-400 mb-4">
                {result.agentCard.description}
              </p>

              {/* Protocol Info */}
              <div className="flex flex-wrap gap-2">
                {result.agentCard.protocolVersion && (
                  <span className="text-xs px-2 py-1 bg-zinc-800 rounded">
                    A2A v{result.agentCard.protocolVersion}
                  </span>
                )}
                {result.agentCard.version && (
                  <span className="text-xs px-2 py-1 bg-zinc-800 rounded">
                    Agent v{result.agentCard.version}
                  </span>
                )}
                {result.agentCard.defaultInputModes?.map((mode) => (
                  <span
                    key={mode}
                    className="text-xs px-2 py-1 bg-zinc-800 rounded"
                  >
                    Input: {mode}
                  </span>
                ))}
                {result.agentCard.defaultOutputModes?.map((mode) => (
                  <span
                    key={mode}
                    className="text-xs px-2 py-1 bg-zinc-800 rounded"
                  >
                    Output: {mode}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            {result.agentCard.skills && result.agentCard.skills.length > 0 && (
              <div>
                <h4 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
                  Skills ({result.agentCard.skills.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.agentCard.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-sm">{skill.name}</h5>
                        <code className="text-xs text-zinc-600">{skill.id}</code>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2">
                        {skill.description}
                      </p>
                      {skill.tags && (
                        <div className="flex flex-wrap gap-1">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON */}
            <details className="group">
              <summary className="text-sm text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors">
                View raw Agent Card JSON
              </summary>
              <pre className="mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 overflow-x-auto">
                {JSON.stringify(result.agentCard, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Known Agents Registry */}
        {knownAgents.length > 0 && (
          <div className="mt-16">
            <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">
              Discovered Agents ({knownAgents.length})
            </h3>
            <div className="space-y-2">
              {knownAgents.map((agent) => (
                <button
                  key={agent.url}
                  onClick={() => {
                    setUrl(agent.url.replace(/\/.well-known.*/, "").replace(/\/api.*/, ""));
                    setResult({
                      status: "found",
                      agentCard: agent.card,
                      url: agent.url,
                    });
                  }}
                  className="w-full text-left p-3 bg-zinc-900/30 border border-zinc-800 rounded hover:border-zinc-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold">
                        {agent.card.name}
                      </span>
                      <span className="text-xs text-zinc-500 ml-2">
                        {agent.card.skills?.length || 0} skills
                      </span>
                    </div>
                    <span className="text-xs text-zinc-600">
                      {new Date(agent.discoveredAt).toLocaleTimeString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
