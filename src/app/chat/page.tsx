"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  timestamp: string;
  contextId?: string;
}

interface AgentInfo {
  name: string;
  description: string;
  skills?: { id: string; name: string; description: string }[];
  protocolVersion?: string;
}

export default function ChatPage() {
  const [agentUrl, setAgentUrl] = useState("");
  const [connected, setConnected] = useState(false);
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connect = async (url: string) => {
    setError("");
    let base = url.trim();
    if (!base.startsWith("http")) base = `https://${base}`;
    base = base.replace(/\/+$/, "");

    // Discover agent card
    const paths = ["/.well-known/agent-card.json", "/api/agent-card"];
    let card: AgentInfo | null = null;
    let jsonRpcUrl = "";

    for (const path of paths) {
      try {
        const res = await fetch(`/api/proxy?url=${encodeURIComponent(`${base}${path}`)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            card = data;
            // Use the agent's declared URL or construct from base
            jsonRpcUrl = data.url || `${base}/a2a/jsonrpc`;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (!card) {
      setError("Could not find an A2A Agent Card at this URL.");
      return;
    }

    setAgentInfo(card);
    setAgentUrl(jsonRpcUrl);
    setConnected(true);
    setMessages([
      {
        id: "system-1",
        role: "agent",
        text: `Connected to **${card.name}**${card.protocolVersion ? ` (A2A v${card.protocolVersion})` : ""}. ${card.description?.slice(0, 150) || ""}`,
        timestamp: new Date().toISOString(),
      },
    ]);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setError("");

    try {
      const rpcPayload = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "message/send",
        params: {
          message: {
            messageId: `msg-${Date.now()}`,
            role: "user",
            kind: "message",
            parts: [{ kind: "text", text: userMsg.text }],
          },
        },
      };

      const res = await fetch(`/api/a2a-relay?target=${encodeURIComponent(agentUrl)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rpcPayload),
      });

      const data = await res.json();

      if (data.error) {
        setError(`Agent error: ${data.error.message || JSON.stringify(data.error)}`);
        setSending(false);
        return;
      }

      // Extract response text from result
      const result = data.result;
      let responseText = "";

      if (result?.kind === "message" && result.parts) {
        responseText = result.parts
          .filter((p: { kind: string; text?: string }) => p.kind === "text")
          .map((p: { text: string }) => p.text)
          .join("\n");
      } else if (result?.status?.message?.parts) {
        responseText = result.status.message.parts
          .filter((p: { kind: string; text?: string }) => p.kind === "text")
          .map((p: { text: string }) => p.text)
          .join("\n");
      } else {
        responseText = JSON.stringify(result, null, 2);
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: "agent",
        text: responseText,
        timestamp: new Date().toISOString(),
        contextId: result?.contextId,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send";
      setError(`Network error: ${message}`);
    }

    setSending(false);
  };

  // Disconnected state
  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white font-mono">
        <header className="border-b border-zinc-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-xl font-bold tracking-tight">LOCHAGOS</h1>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">chat</span>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Agent Chat</h2>
            <p className="text-zinc-400">
              Talk to any A2A-compliant agent via the Agent2Agent protocol.
              Enter the agent&apos;s URL to connect.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              connect(agentUrl || "lochagos-web.vercel.app");
            }}
            className="space-y-4"
          >
            <input
              type="text"
              value={agentUrl}
              onChange={(e) => setAgentUrl(e.target.value)}
              placeholder="Agent URL (e.g., lochagos-web.vercel.app)"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Connect
              </button>
              <button
                type="button"
                onClick={() => {
                  setAgentUrl("lochagos-web.vercel.app");
                  connect("lochagos-web.vercel.app");
                }}
                className="px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Talk to Lochagos
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Connected state — chat interface
  return (
    <div className="h-screen bg-black text-white font-mono flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-3 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80">
              <span className="text-xl">🛡️</span>
            </Link>
            <div>
              <span className="font-bold">{agentInfo?.name || "Agent"}</span>
              <span className="text-xs text-zinc-500 ml-2">
                A2A {agentInfo?.protocolVersion || ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-zinc-400">Connected</span>
            </div>
            <button
              onClick={() => {
                setConnected(false);
                setMessages([]);
                setAgentInfo(null);
                setAgentUrl("");
              }}
              className="text-xs px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-white text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-200"
                }`}
              >
                <pre className="text-sm whitespace-pre-wrap font-mono break-words">
                  {msg.text}
                </pre>
                <div
                  className={`text-xs mt-1 ${
                    msg.role === "user" ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                <span className="text-sm text-zinc-400 animate-pulse">
                  {agentInfo?.name || "Agent"} is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto p-2 bg-red-950/30 border border-red-900/50 rounded text-xs text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 px-6 py-4 flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${agentInfo?.name || "agent"}...`}
            disabled={sending}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
