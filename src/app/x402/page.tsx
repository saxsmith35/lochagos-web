"use client";

/**
 * x402 Demo Page
 *
 * Shows how to call the x402-protected /api/x402/insight endpoint.
 * For actual payment flows, clients need a wallet that supports EIP-3009
 * (e.g., USDC on Base) and the x402 client SDK.
 */

import { useState } from "react";

const ENDPOINT = "/api/x402/insight";

export default function X402DemoPage() {
  const [response, setResponse] = useState<string>("");
  const [paymentHeader, setPaymentHeader] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);

  // Probe the endpoint without payment to see the 402 response
  async function probe402() {
    setLoading(true);
    setResponse("");
    setStatus(null);

    try {
      const res = await fetch(ENDPOINT);
      setStatus(res.status);

      if (res.status === 402) {
        const paymentRequired = res.headers.get("PAYMENT-REQUIRED");
        if (paymentRequired) {
          const decoded = JSON.parse(atob(paymentRequired));
          setResponse(JSON.stringify(decoded, null, 2));
        } else {
          const text = await res.text();
          setResponse(text || "(no body)");
        }
      } else {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setResponse(`Error: ${err}`);
    }
    setLoading(false);
  }

  // Attempt to call the endpoint with a custom X-PAYMENT header
  async function callWithPayment() {
    if (!paymentHeader.trim()) {
      alert("Paste a base64-encoded payment header first.");
      return;
    }
    setLoading(true);
    setResponse("");
    setStatus(null);

    try {
      const res = await fetch(ENDPOINT, {
        headers: {
          "PAYMENT-SIGNATURE": paymentHeader.trim(),
        },
      });
      setStatus(res.status);
      const data = await res.json().catch(() => ({}));
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(`Error: ${err}`);
    }
    setLoading(false);
  }

  const statusColor =
    status === 200
      ? "text-green-400"
      : status === 402
        ? "text-yellow-400"
        : status
          ? "text-red-400"
          : "text-gray-400";

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 font-mono">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            x402 Insight API
          </h1>
          <p className="text-gray-400 text-sm">
            A pay-per-call AI insight endpoint powered by the{" "}
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              x402 protocol
            </a>
            . Each request costs{" "}
            <span className="text-yellow-400 font-bold">$0.001 USDC</span> on{" "}
            <span className="text-blue-400">Base Sepolia (testnet)</span>.
          </p>
        </div>

        {/* Endpoint info */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
            Endpoint
          </p>
          <code className="text-green-400 text-sm">
            GET /api/x402/insight
          </code>
          <div className="mt-3 space-y-1 text-xs text-gray-400">
            <p>
              <span className="text-gray-500">Network:</span>{" "}
              <span className="text-blue-400">Base Sepolia (eip155:845322)</span>
            </p>
            <p>
              <span className="text-gray-500">Price:</span>{" "}
              <span className="text-yellow-400">$0.001 USDC</span>
            </p>
            <p>
              <span className="text-gray-500">Receiver:</span>{" "}
              <span className="text-gray-300 break-all">
                0xFB4AcF77628774dD5b7db9cad16a0fb12c6EdDea
              </span>
            </p>
            <p>
              <span className="text-gray-500">Scheme:</span>{" "}
              <span className="text-gray-300">exact (EIP-3009 / Permit2)</span>
            </p>
          </div>
        </div>

        {/* Step 1: Probe for 402 */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Step 1 — Probe for 402 Payment Required
          </h2>
          <p className="text-gray-400 text-sm">
            Call the endpoint without a payment header. The server returns{" "}
            <code className="text-yellow-400">HTTP 402</code> with a{" "}
            <code className="text-gray-300">PAYMENT-REQUIRED</code> header
            containing the payment requirements encoded in base64.
          </p>
          <button
            onClick={probe402}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded text-sm font-semibold transition"
          >
            {loading ? "Loading…" : "Probe endpoint (no payment)"}
          </button>
        </div>

        {/* Step 2: Pay */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Step 2 — Send Payment Header
          </h2>
          <p className="text-gray-400 text-sm">
            Use the x402 client SDK (or{" "}
            <code className="text-gray-300">awal pay</code>) to create a signed
            payment payload for the requirements above, then paste the
            base64-encoded <code className="text-gray-300">PAYMENT-SIGNATURE</code>{" "}
            header below.
          </p>
          <textarea
            value={paymentHeader}
            onChange={(e) => setPaymentHeader(e.target.value)}
            placeholder="Paste base64-encoded PAYMENT-SIGNATURE header here…"
            className="w-full h-24 bg-gray-900 border border-gray-700 rounded p-3 text-xs text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={callWithPayment}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded text-sm font-semibold transition"
          >
            {loading ? "Loading…" : "Call with payment"}
          </button>
        </div>

        {/* Response */}
        {(status !== null || response) && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">Response</h2>
              {status && (
                <span className={`text-sm font-bold ${statusColor}`}>
                  HTTP {status}
                </span>
              )}
            </div>
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap">
              {response || "(empty)"}
            </pre>
          </div>
        )}

        {/* Code sample */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Code Sample (Node.js with x402 SDK)
          </h2>
          <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-xs text-gray-300 overflow-auto">
            {`import { wrapFetchWithPayment } from "@x402/client";
import { createWalletClient, http } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount("0x<YOUR_PRIVATE_KEY>");
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Wrap fetch with automatic x402 payment handling
const payingFetch = wrapFetchWithPayment(fetch, walletClient);

const response = await payingFetch(
  "https://lochagos-web.vercel.app/api/x402/insight"
);
const data = await response.json();
console.log(data.insight);`}
          </pre>
        </div>

        {/* Links */}
        <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 space-y-1">
          <p>
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              x402.org
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/coinbase/x402"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              GitHub
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Docs
            </a>
          </p>
          <p>
            Built by{" "}
            <a
              href="https://lochagos-web.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Lochagos
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
