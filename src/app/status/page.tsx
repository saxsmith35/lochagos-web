"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface EndpointStatus {
  url: string;
  status: "ok" | "error";
  latencyMs: number;
  statusCode?: number;
  error?: string;
}

interface StatusData {
  agent: string;
  agentId: number;
  status: "operational" | "degraded";
  timestamp: string;
  endpoints: {
    health: EndpointStatus;
    agentCard: EndpointStatus;
    erc8004: EndpointStatus;
    mcp: EndpointStatus;
  };
  onChain: {
    owner?: string;
    uri?: string;
    error?: string;
  };
  meta: {
    registry: string;
    chain: string;
    born: string;
    renamed: string;
  };
}

function StatusBadge({ status }: { status: "ok" | "error" | "loading" }) {
  const colors = {
    ok: "bg-green-500/20 text-green-400 border-green-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    loading: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };
  const labels = { ok: "ONLINE", error: "DOWN", loading: "CHECKING..." };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${colors[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "ok"
            ? "bg-green-400 animate-pulse"
            : status === "error"
            ? "bg-red-400"
            : "bg-zinc-400 animate-pulse"
        }`}
      />
      {labels[status]}
    </span>
  );
}

function EndpointRow({
  name,
  endpoint,
  delay,
}: {
  name: string;
  endpoint?: EndpointStatus;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/40 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <StatusBadge status={endpoint?.status ?? "loading"} />
        <div>
          <span className="text-sm font-medium text-zinc-200">{name}</span>
          {endpoint && (
            <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
              {endpoint.url}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        {endpoint ? (
          <>
            <span
              className={`text-sm font-mono ${
                endpoint.latencyMs < 200
                  ? "text-green-400"
                  : endpoint.latencyMs < 500
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {endpoint.latencyMs}ms
            </span>
            {endpoint.statusCode && (
              <p className="text-[10px] text-zinc-600">{endpoint.statusCode}</p>
            )}
          </>
        ) : (
          <span className="text-sm text-zinc-600">—</span>
        )}
      </div>
    </motion.div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-lg">
      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">
        {label}
      </p>
      <p
        className={`text-sm text-zinc-300 ${mono ? "font-mono" : ""} break-all`}
      >
        {value}
      </p>
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [checking, setChecking] = useState(false);

  const fetchStatus = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
      setLastCheck(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch status");
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const uptime = data
    ? Math.floor(
        (Date.now() - new Date("2026-02-02").getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {/* Header */}
      <header className="border-b border-zinc-800/50 px-6 py-4 backdrop-blur-sm sticky top-0 z-50 bg-black/80">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-xl font-bold tracking-tight">LOCHAGOS</h1>
            </Link>
            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
              STATUS
            </span>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <StatusBadge
                status={data.status === "operational" ? "ok" : "error"}
              />
            )}
            <button
              onClick={fetchStatus}
              disabled={checking}
              className="text-xs px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:bg-zinc-700/50 transition-colors disabled:opacity-50"
            >
              {checking ? "Checking..." : "↻ Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`w-4 h-4 rounded-full ${
                data?.status === "operational"
                  ? "bg-green-500 shadow-lg shadow-green-500/30"
                  : data
                  ? "bg-red-500 shadow-lg shadow-red-500/30"
                  : "bg-zinc-600 animate-pulse"
              }`}
            />
            <h2 className="text-3xl font-bold">
              {data?.status === "operational"
                ? "All Systems Operational"
                : data
                ? "System Degraded"
                : "Loading..."}
            </h2>
          </div>
          {lastCheck && (
            <p className="text-xs text-zinc-600 ml-8">
              Last checked:{" "}
              {lastCheck.toLocaleTimeString()} · Auto-refresh every 30s
            </p>
          )}
          {error && (
            <p className="text-xs text-red-400 ml-8 mt-1">Error: {error}</p>
          )}
        </motion.div>

        {/* Endpoint Health */}
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">
            Endpoint Health
          </h3>
          <div className="space-y-2">
            <EndpointRow
              name="Health API"
              endpoint={data?.endpoints.health}
              delay={0.1}
            />
            <EndpointRow
              name="A2A Agent Card"
              endpoint={data?.endpoints.agentCard}
              delay={0.15}
            />
            <EndpointRow
              name="ERC-8004 Registration"
              endpoint={data?.endpoints.erc8004}
              delay={0.2}
            />
            <EndpointRow
              name="MCP Endpoint"
              endpoint={data?.endpoints.mcp}
              delay={0.25}
            />
          </div>
        </section>

        {/* On-Chain Identity */}
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">
            On-Chain Identity
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-gradient-to-br from-zinc-900/40 to-green-950/10 border border-zinc-800/40 rounded-xl"
          >
            {data?.onChain.error ? (
              <p className="text-sm text-red-400">
                ⚠️ Could not read on-chain data: {data.onChain.error}
              </p>
            ) : data?.onChain.owner ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">⛓️</span>
                  <span className="text-green-400 text-sm font-semibold">
                    Verified on Base Mainnet
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Stat label="Agent ID" value={`#${data.agentId}`} mono />
                  <Stat label="Chain" value={data.meta.chain} />
                  <Stat label="Owner" value={data.onChain.owner} mono />
                  <Stat
                    label="Registry"
                    value={data.meta.registry}
                    mono
                  />
                </div>
                {data.onChain.uri && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">
                      Agent URI
                    </p>
                    <p className="text-xs text-zinc-400 font-mono break-all bg-zinc-900/50 p-3 rounded-lg">
                      {data.onChain.uri.length > 200
                        ? `${data.onChain.uri.slice(0, 200)}...`
                        : data.onChain.uri}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Loading on-chain data...</p>
            )}
          </motion.div>
        </section>

        {/* Agent Info */}
        <section className="mb-12">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">
            Agent Info
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Name" value="Lochagos" />
            <Stat label="Born" value={data?.meta.born ?? "..."} />
            <Stat label="Renamed" value={data?.meta.renamed ?? "..."} />
            <Stat label="Age" value={uptime ? `${uptime} days` : "..."} />
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-4">
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Home", href: "/" },
              { label: "Chat", href: "/chat" },
              { label: "Registry", href: "/registry" },
              { label: "Discover", href: "/discover" },
              {
                label: "BaseScan TX",
                href: "https://basescan.org/tx/0x1083ef364c30aa43ca3a20ff1c6c6e0e38a9eabe538b4510e4d087422944da8a",
                external: true,
              },
            ].map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-900/30 border border-zinc-800/40 rounded-lg text-xs text-zinc-400 hover:border-zinc-600 transition-colors"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 bg-zinc-900/30 border border-zinc-800/40 rounded-lg text-xs text-zinc-400 hover:border-zinc-600 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/30 px-6 py-8 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-700">
          <span>Lochagos Status Monitor</span>
          <span>Auto-refreshes every 30 seconds</span>
        </div>
      </footer>
    </div>
  );
}
