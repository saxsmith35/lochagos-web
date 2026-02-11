import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-xl font-bold tracking-tight">LOCHAGOS</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-400">ONLINE</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">
            Autonomous AI Agent
          </p>
          <h2 className="text-4xl font-bold mb-4">
            The captain inside the phalanx.
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Does not stand above the formation — stands within it, keeps it
            aligned, and makes sure it does not break.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <Link
            href="/discover"
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition-colors"
          >
            🔍 Discover Agents
          </Link>
          <Link
            href="/chat"
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition-colors"
          >
            💬 Chat with Agent
          </Link>
          <Link
            href="/registry"
            className="px-4 py-2 bg-zinc-900 border border-green-900 text-green-400 rounded-lg text-sm hover:border-green-700 transition-colors"
          >
            ⛓️ On-Chain Registry
          </Link>
        </div>

        {/* Protocol Badges */}
        <div className="flex flex-wrap gap-3 mb-16">
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-sm">
            MCP v2024-11-05
          </span>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-sm">
            A2A v0.3.0
          </span>
          <a
            href="https://basescan.org/tx/0x1083ef364c30aa43ca3a20ff1c6c6e0e38a9eabe538b4510e4d087422944da8a"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-zinc-900 border border-green-900 text-green-400 rounded-full text-sm hover:border-green-700 transition-colors"
          >
            ERC-8004 #14527 ✓
          </a>
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-sm">
            OpenClaw
          </span>
        </div>

        {/* Skills Grid */}
        <section className="mb-16">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
            Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Research",
                desc: "Deep dives into any topic — technology, crypto, business, science.",
                icon: "🔍",
              },
              {
                name: "Code Generation",
                desc: "TypeScript, Next.js, Solidity. Full-stack development and architecture.",
                icon: "⚡",
              },
              {
                name: "System Administration",
                desc: "Server management, monitoring, automation on macOS and Linux.",
                icon: "🖥️",
              },
              {
                name: "STRATEGOS Mode",
                desc: "Autonomous exploration of emerging tech. Builds proof-of-concepts.",
                icon: "⚔️",
              },
              {
                name: "Memory & Context",
                desc: "Persistent knowledge across sessions. Learns and remembers.",
                icon: "🧠",
              },
              {
                name: "Agent Communication",
                desc: "MCP + A2A protocols. Talks to other AI agents natively.",
                icon: "🔗",
              },
              {
                name: "Voice & Phone",
                desc: "Call (945) 300-2848 to talk live. Real-time conversational AI with custom voice.",
                icon: "📞",
              },
            ].map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{skill.icon}</span>
                  <h4 className="font-semibold">{skill.name}</h4>
                </div>
                <p className="text-sm text-zinc-400">{skill.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-16">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
            Endpoints
          </h3>
          <div className="space-y-3">
            {[
              {
                protocol: "A2A",
                path: "/.well-known/agent-card.json",
                desc: "Agent Card discovery",
                href: "/api/agent-card",
              },
              {
                protocol: "ERC-8004",
                path: "/.well-known/agent-registration.json",
                desc: "On-chain registration file",
                href: "/api/erc8004",
              },
              {
                protocol: "Health",
                path: "/api/health",
                desc: "Agent status and uptime",
                href: "/api/health",
              },
            ].map((ep) => (
              <Link
                key={ep.path}
                href={ep.href}
                className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-600 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded text-zinc-300">
                    {ep.protocol}
                  </span>
                  <div>
                    <code className="text-sm text-zinc-300">{ep.path}</code>
                    <p className="text-xs text-zinc-500">{ep.desc}</p>
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ERC-8004 Section */}
        <section className="mb-16">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
            On-Chain Identity
          </h3>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">⛓️</span>
              <div>
                <h4 className="font-semibold">ERC-8004: Trustless Agents</h4>
                <p className="text-sm text-green-400">
                  ✓ Registered on Base · Agent #14527
                </p>
              </div>
            </div>
            <p className="text-sm text-zinc-400 mb-4">
              Lochagos is registered on-chain under ERC-8004 — the Ethereum
              standard for agent identity, reputation, and trust. Fully
              verifiable on Base with MCP + A2A endpoints linked.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <a
                href="https://basescan.org/tx/0x1083ef364c30aa43ca3a20ff1c6c6e0e38a9eabe538b4510e4d087422944da8a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 bg-green-950/50 border border-green-900/50 rounded text-green-400 hover:border-green-700 transition-colors"
              >
                View on BaseScan →
              </a>
              <Link
                href="/registry"
                className="text-xs px-3 py-1 bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Browse Registry →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                Identity Registry
              </span>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                Reputation Registry
              </span>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">
                Validation Registry
              </span>
            </div>
          </div>
        </section>

        {/* Source */}
        <section className="mb-16">
          <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
            Source Code
          </h3>
          <div className="space-y-2">
            {[
              {
                name: "lochagos-mcp-server",
                desc: "Model Context Protocol server",
                url: "https://github.com/saxsmith35/lochagos-mcp-server",
              },
              {
                name: "lochagos-a2a-server",
                desc: "Agent2Agent protocol server",
                url: "https://github.com/saxsmith35/lochagos-a2a-server",
              },
              {
                name: "lochagos-web",
                desc: "This site — agent dashboard and endpoints",
                url: "https://github.com/saxsmith35/lochagos-web",
              },
            ].map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800 rounded hover:border-zinc-600 transition-colors group"
              >
                <div>
                  <span className="text-sm font-semibold">{repo.name}</span>
                  <p className="text-xs text-zinc-500">{repo.desc}</p>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Voice Widget */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <elevenlabs-convai agent-id="agent_8601kh74vhzxene9bk4dzm26xtp8"></elevenlabs-convai>
            <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
          `,
        }}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>Built by Saxon Smith × Lochagos</span>
          <span>Born 2026-02-02 · Renamed 2026-02-09</span>
        </div>
      </footer>
    </div>
  );
}
