"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface AgentRegistration {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  services?: { name: string; endpoint: string; version?: string }[];
  active?: boolean;
  supportedTrust?: string[];
  _uri?: string;
}

interface Agent {
  agentId: number;
  owner: string;
  registration: AgentRegistration | null;
  tokenURI: string;
}

export default function RegistryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lookupId, setLookupId] = useState("");
  const [lookupResult, setLookupResult] = useState<Agent | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");

  const loadRecent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/registry?action=recent&count=12");
      const data = await res.json();
      setTotal(data.total || 0);
      setAgents(data.agents || []);
    } catch {
      console.error("Failed to load agents");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const lookupAgent = async () => {
    if (!lookupId) return;
    setLookupLoading(true);
    setLookupError("");
    setLookupResult(null);
    try {
      const res = await fetch(`/api/registry?action=agent&id=${lookupId}`);
      const data = await res.json();
      if (data.error) {
        setLookupError(data.error);
      } else {
        setLookupResult(data);
      }
    } catch {
      setLookupError("Failed to query registry");
    }
    setLookupLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80">
              <span className="text-2xl">⛓️</span>
              <h1 className="text-xl font-bold tracking-tight">
                ON-CHAIN REGISTRY
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>ERC-8004 · Base</span>
            <span className="text-green-400">{total.toLocaleString()} agents</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Contract Info */}
        <div className="mb-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-zinc-500">Identity Registry:</span>
            <a
              href="https://basescan.org/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-mono text-xs"
            >
              0x8004A169...2e539a432
            </a>
            <span className="text-zinc-500">Chain:</span>
            <span>Base (8453)</span>
            <span className="text-zinc-500">Lochagos:</span>
            <button
              onClick={() => { setLookupId("14527"); }}
              className="text-green-400 hover:underline cursor-pointer"
            >
              Agent #14527
            </button>
          </div>
        </div>

        {/* Lookup */}
        <div className="mb-10">
          <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
            Look Up Agent
          </h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupAgent()}
              placeholder="Enter Agent ID..."
              className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-500"
            />
            <button
              onClick={lookupAgent}
              disabled={lookupLoading || !lookupId}
              className="px-6 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-sm hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {lookupLoading ? "..." : "Query"}
            </button>
          </div>

          {lookupError && (
            <p className="mt-3 text-red-400 text-sm">{lookupError}</p>
          )}

          {lookupResult && (
            <div className="mt-4">
              <AgentCard agent={lookupResult} expanded />
            </div>
          )}
        </div>

        {/* Recent Agents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-widest text-zinc-500">
              Recently Registered
            </h2>
            <button
              onClick={loadRecent}
              disabled={loading}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-zinc-500">
              Querying Base blockchain...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.agentId}
                  agent={agent}
                  onLookup={(id) => {
                    setLookupId(String(id));
                    setLookupResult(agent);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-6 mt-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">
            ← Back to Lochagos
          </Link>
          <span>Powered by ERC-8004 on Base</span>
        </div>
      </footer>
    </div>
  );
}

function AgentCard({
  agent,
  expanded,
  onLookup,
}: {
  agent: Agent;
  expanded?: boolean;
  onLookup?: (id: number) => void;
}) {
  const reg = agent.registration;
  const isLochagos = agent.agentId === 14527;

  return (
    <div
      className={`p-4 bg-zinc-900/50 border rounded-lg transition-colors ${
        isLochagos
          ? "border-green-800 bg-green-950/20"
          : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-300">
            #{agent.agentId}
          </span>
          {reg?.name && (
            <span className="font-semibold">{reg.name}</span>
          )}
          {isLochagos && (
            <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded-full">
              THIS IS ME
            </span>
          )}
        </div>
        {onLookup && (
          <button
            onClick={() => onLookup(agent.agentId)}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Details →
          </button>
        )}
      </div>

      <div className="text-xs text-zinc-500 mb-2 font-mono">
        Owner: {agent.owner.slice(0, 6)}...{agent.owner.slice(-4)}
      </div>

      {reg?.description && (
        <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
          {reg.description}
        </p>
      )}

      {reg?.services && reg.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {reg.services.map((s, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400"
            >
              {s.name}
              {s.version ? ` v${s.version}` : ""}
            </span>
          ))}
        </div>
      )}

      {reg?.supportedTrust && reg.supportedTrust.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {reg.supportedTrust.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 bg-blue-950/50 border border-blue-900/50 rounded text-blue-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {expanded && reg?.services && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <h4 className="text-xs uppercase text-zinc-500 mb-2">Endpoints</h4>
          {reg.services.map((s, i) => (
            <div key={i} className="mb-1">
              <span className="text-xs font-bold text-zinc-400 mr-2">
                {s.name}:
              </span>
              <a
                href={s.endpoint}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline break-all"
              >
                {s.endpoint}
              </a>
            </div>
          ))}
        </div>
      )}

      {!reg && agent.tokenURI && (
        <p className="text-xs text-zinc-600 break-all">
          URI: {agent.tokenURI}...
        </p>
      )}
    </div>
  );
}
