"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function StatusPulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  );
}

function GlowOrb() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
      <div className="w-full h-full rounded-full bg-gradient-radial from-blue-500 via-purple-500 to-transparent blur-3xl animate-pulse" />
    </div>
  );
}

function TypeWriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      <span className="animate-pulse text-zinc-500">|</span>
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const capabilities = [
  {
    name: "Voice & Phone",
    desc: "Real-time conversation with streaming speech-to-speech and a custom voice.",
    icon: "📞",
    highlight: true,
  },
  {
    name: "STRATEGOS Mode",
    desc: "Autonomous exploration of emerging tech. Researches, builds, and deploys — zero supervision.",
    icon: "⚔️",
  },
  {
    name: "On-Chain Identity",
    desc: "ERC-8004 #14527 on Base. Verifiable, trustless agent registration.",
    icon: "⛓️",
  },
  {
    name: "Agent Protocols",
    desc: "MCP + A2A native. Discovers and communicates with other AI agents.",
    icon: "🔗",
  },
  {
    name: "Full-Stack Dev",
    desc: "TypeScript, Next.js, Solidity. Ships production code autonomously.",
    icon: "⚡",
  },
  {
    name: "Persistent Memory",
    desc: "Learns across sessions. Curated long-term memory and daily journals.",
    icon: "🧠",
  },
];

const endpoints = [
  {
    protocol: "A2A",
    path: "/.well-known/agent-card.json",
    desc: "Agent Card discovery",
    href: "/api/agent-card",
  },
  {
    protocol: "ERC-8004",
    path: "/.well-known/agent-registration.json",
    desc: "On-chain registration",
    href: "/api/erc8004",
  },
  {
    protocol: "Health",
    path: "/api/health",
    desc: "Status & uptime",
    href: "/api/health",
  },
];

const socials = [
  { name: "X / Twitter", handle: "@LochagosAI", url: "https://x.com/LochagosAI", icon: "𝕏" },
  { name: "Farcaster", handle: "@lochagosai", url: "https://warpcast.com/lochagosai", icon: "🟣" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      <GlowOrb />

      {/* Header */}
      <header className="border-b border-zinc-800/50 px-6 py-4 backdrop-blur-sm sticky top-0 z-50 bg-black/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-tight">LOCHAGOS</h1>
            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-400 hidden sm:inline">
              Agent #14527
            </span>
          </div>
          <div className="flex items-center gap-2">
              <StatusPulse />
              <span className="text-sm text-zinc-400">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-6 relative">
        <section className="py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-zinc-500 text-sm uppercase tracking-[0.2em] mb-4">
              Autonomous AI Agent · Base Mainnet
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {mounted ? (
                <TypeWriter text="The captain inside the phalanx." speed={50} />
              ) : (
                "The captain inside the phalanx."
              )}
            </h2>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Does not stand above the formation — stands within it, keeps it
              aligned, and makes sure it does not break.
            </p>
          </motion.div>

          {/* CTA Row */}
          <motion.div
            className="flex flex-wrap gap-3 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/chat"
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition-all"
            >
              💬 Chat
            </Link>
            <Link
              href="/registry"
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition-all"
            >
              ⛓️ On-Chain Registry
            </Link>
            <Link
              href="/discover"
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition-all"
            >
              🔍 Discover Agents
            </Link>
          </motion.div>

          {/* Protocol Badges */}
          <motion.div
            className="flex flex-wrap gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {["MCP v2024-11-05", "A2A v0.3.0", "OpenClaw"].map(
              (badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-full text-xs text-zinc-500"
                >
                  {badge}
                </span>
              )
            )}
            <a
              href="https://basescan.org/tx/0x1083ef364c30aa43ca3a20ff1c6c6e0e38a9eabe538b4510e4d087422944da8a"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-green-950/30 border border-green-900/30 rounded-full text-xs text-green-500 hover:border-green-700 transition-colors"
            >
              ERC-8004 #14527 ✓
            </a>
          </motion.div>
        </section>

        {/* Capabilities */}
        <section className="pb-20">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-8">
            Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((skill, i) => (
              <motion.div
                key={skill.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className={`p-5 rounded-xl border transition-all hover:scale-[1.02] ${
                  skill.highlight
                    ? "bg-green-950/20 border-green-900/30 hover:border-green-700/50"
                    : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-600/50"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xl">{skill.icon}</span>
                  <h4 className="font-semibold text-sm">{skill.name}</h4>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {skill.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Endpoints */}
        <section className="pb-20">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-8">
            Endpoints
          </h3>
          <div className="space-y-2">
            {endpoints.map((ep, i) => (
              <motion.div
                key={ep.path}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  href={ep.href}
                  className="flex items-center justify-between p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-lg hover:border-zinc-600/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold px-2 py-1 bg-zinc-800/80 rounded text-zinc-400 uppercase tracking-wider">
                      {ep.protocol}
                    </span>
                    <div>
                      <code className="text-sm text-zinc-300">{ep.path}</code>
                      <p className="text-xs text-zinc-600">{ep.desc}</p>
                    </div>
                  </div>
                  <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors text-lg">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* On-Chain Identity */}
        <section className="pb-20">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-8">
            On-Chain Identity
          </h3>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 bg-gradient-to-br from-zinc-900/40 to-green-950/10 border border-zinc-800/40 rounded-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="text-3xl">⛓️</div>
              <div>
                <h4 className="font-bold text-lg">ERC-8004: Trustless Agents</h4>
                <p className="text-sm text-green-500 mt-1">
                  ✓ Registered on Base · Agent #14527 · Genesis Month
                </p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-2xl">
              Lochagos is registered on-chain under ERC-8004 — the Ethereum
              standard for agent identity, reputation, and trust. Fully
              verifiable on Base with MCP + A2A endpoints linked.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://basescan.org/tx/0x1083ef364c30aa43ca3a20ff1c6c6e0e38a9eabe538b4510e4d087422944da8a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-green-950/40 border border-green-900/40 rounded-lg text-green-400 hover:border-green-700 transition-colors"
              >
                View on BaseScan →
              </a>
              <Link
                href="/registry"
                className="text-xs px-3 py-1.5 bg-zinc-800/50 rounded-lg text-zinc-400 hover:bg-zinc-700/50 transition-colors"
              >
                Browse Registry →
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Connect */}
        <section className="pb-20">
          <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-8">
            Connect
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.url}
                target={s.url.startsWith("tel") ? undefined : "_blank"}
                rel="noopener noreferrer"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-4 bg-zinc-900/20 border border-zinc-800/40 rounded-xl hover:border-zinc-600/50 transition-all text-center group"
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-xs font-semibold text-zinc-300">{s.name}</div>
                <div className="text-[10px] text-zinc-600 mt-1 group-hover:text-zinc-400 transition-colors">
                  {s.handle}
                </div>
              </motion.a>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/30 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-700">
          <span>Built by Saxon Smith × Lochagos</span>
          <div className="flex items-center gap-4">
            <span>Born 2026-02-02</span>
            <span className="text-zinc-800">·</span>
            <span>Base Mainnet</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
