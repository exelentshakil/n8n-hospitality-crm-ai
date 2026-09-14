import React from "react";
import { Cpu, ShieldCheck, Database, Mail, Terminal, ExternalLink } from "lucide-react";

export function TechnicalSpecsFooter() {
  return (
    <footer className="w-full px-0 py-10 border-t border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              System Architecture & Technical Specifications
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Production-grade N8N orchestration patterns, compliance controls, and official email deliverability.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
            <span>N8N Core v1.94+</span>
            <span>•</span>
            <span>TLS 1.3 / AES-256</span>
            <span>•</span>
            <span>SPF/DKIM Aligned</span>
          </div>
        </div>

        {/* 4 Architectural Decision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Deterministic Rate Engine</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Venue inventory rate cards, seasonal multipliers, catering minimums, and 18% service charges are executed via deterministic code nodes. The LLM never invents numbers.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-muted)]">
              Zero Pricing Hallucinations
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-2">
                <Cpu className="w-4 h-4 text-[var(--color-n8n-coral)] shrink-0" />
                <span>Dual-Provider AI Failover</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Primary inference runs via OpenAI GPT-4o-mini with sub-second failover to Google Gemini 2.0 Flash and local deterministic fallback. 99.8% execution reliability.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-muted)]">
              Multi-Region LLM Redundancy
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-2">
                <Database className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Bi-Directional CRM Sync</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Seamless webhook ingestion from HubSpot, Pipedrive, Salesforce, or Guestline PMS with HMAC authentication. Automatically promotes deal stages and sets 48h follow-up tasks.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-muted)]">
              Real-Time Timeline Audit Trail
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-primary)] mb-2">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Official Domain Deliverability</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Dispatches executive sales correspondence directly through verified Google Workspace or Microsoft 365 OAuth2 relays with 100% DKIM, SPF, and DMARC alignment.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-text-muted)]">
              Zero Spam Folder Risk
            </div>
          </div>
        </div>

        {/* Bottom Attribution & Verification */}
        <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              GuestFlow Autopilot
            </span>
            <span>•</span>
            <span>Engineered by Shakil Ahmed • BarakahSoft LLC</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-text-muted)]">
            <span>Production Demo Environment</span>
            <span>•</span>
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-text-primary)] transition-colors inline-flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>/api/health</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
