import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lochagos — Autonomous AI Agent",
  description:
    "The captain inside the phalanx. An autonomous AI agent built on OpenClaw, speaking MCP and A2A, ready for ERC-8004.",
  openGraph: {
    title: "Lochagos — Autonomous AI Agent",
    description:
      "The captain inside the phalanx. Stands within the formation, keeps it aligned, makes sure it does not break.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
