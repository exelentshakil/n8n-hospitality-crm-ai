import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "N8N Hospitality CRM AI Autopilot | Event-Driven Proposal & Email Orchestration",
  description: "Production-grade N8N automation workflow: Ingests CRM guest leads, executes deterministic hospitality rate calculation, generates tailored proposals with dual-provider LLM failover, and dispatches via official SMTP."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* Central Traffic Tracking Pixel */}
        <img
          src="https://demo-traffic.vercel.app/api/px?p=n8n-hospitality-crm-ai"
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
      </body>
    </html>
  );
}
