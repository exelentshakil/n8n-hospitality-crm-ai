import React from "react";
import { Zap, ShieldCheck, Clock, TrendingUp, CheckCircle2 } from "lucide-react";

export function WorkspaceHeader() {
  return (
    <section className="w-full px-0 py-6 border-b border-[var(--color-border)] bg-[var(--color-panel)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Context Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-brand-subtle)] text-[var(--color-n8n-coral)] border border-[var(--color-n8n-coral)]/20 mb-2 whitespace-nowrap shrink-0">
              <span className="w-2 h-2 rounded-full bg-[var(--color-n8n-coral)] animate-pulse" />
              N8N Production Orchestrator Active • CRM Ingestion Engine
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
              Hospitality CRM AI Proposal & Email Autopilot
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
              Triggers automatically when a new customer enters HubSpot, Pipedrive, Salesforce, or Guestline.
              Retrieves guest history, locks approved seasonal rate cards deterministically, generates compelling
              executive proposals via dual-provider AI, and dispatches via official company SMTP within 45 seconds.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Email Route: Active</span>
            </div>
          </div>
        </div>

        {/* Bento KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1 */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] truncate">
                Avg Response Latency
              </span>
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
                42s
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono whitespace-nowrap">
                -99.2% vs manual (14h)
              </span>
            </div>
            <span className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
              Trigger to official email delivery
            </span>
          </div>

          {/* KPI 2 */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] truncate">
                Rate Math Precision
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
                100%
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono whitespace-nowrap">
                Zero AI drift
              </span>
            </div>
            <span className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
              Locked to venue inventory rate card
            </span>
          </div>

          {/* KPI 3 */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] truncate">
                Pipeline Reliability
              </span>
              <Zap className="w-4 h-4 text-[var(--color-n8n-coral)] shrink-0" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
                99.8%
              </span>
              <span className="text-xs font-medium text-sky-600 dark:text-sky-400 font-mono whitespace-nowrap">
                Dual LLM Failover
              </span>
            </div>
            <span className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
              GPT-4o-mini + Gemini 2.0 Flash
            </span>
          </div>

          {/* KPI 4 */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] truncate">
                Lead-to-Tour Close
              </span>
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight text-[var(--color-text-primary)]">
                68.4%
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono whitespace-nowrap">
                +31% lift
              </span>
            </div>
            <span className="mt-1 text-xs text-[var(--color-text-muted)] truncate">
              Immediate personalized quoting
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
