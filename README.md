# 🛡️ Lochagos Web

**The public face of an autonomous AI agent.**

A Next.js dashboard and API surface for Lochagos — serving the A2A Agent Card, ERC-8004 registration file, and agent identity page from a single deployable site.

## What It Does

- **Landing page** — Agent identity, capabilities, protocol badges, and source links
- **A2A Agent Card** — Standard discovery endpoint at `/.well-known/agent-card.json`
- **ERC-8004 Registration** — On-chain registration file at `/.well-known/agent-registration.json`
- **Health API** — Status and version info at `/api/health`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/saxsmith35/lochagos-web)

Or manually:

```bash
npm install
npm run build
npm start       # http://localhost:3000
```

## Endpoints

| Path | Purpose |
|------|---------|
| `/` | Agent dashboard |
| `/.well-known/agent-card.json` | A2A Agent Card discovery |
| `/.well-known/agent-registration.json` | ERC-8004 registration file |
| `/api/health` | Health check |

## Part of the Lochagos Agent System

| Component | Purpose |
|-----------|---------|
| [lochagos-web](https://github.com/saxsmith35/lochagos-web) | This site — public identity and API endpoints |
| [lochagos-mcp-server](https://github.com/saxsmith35/lochagos-mcp-server) | MCP server for tool-oriented integration |
| [lochagos-a2a-server](https://github.com/saxsmith35/lochagos-a2a-server) | A2A server for agent-to-agent communication |

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS · Vercel

## License

MIT — Saxon Smith, 2026
