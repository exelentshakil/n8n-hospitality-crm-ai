"use client";

import React, { useState } from "react";
import {
  Mail,
  FileText,
  Code,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Building,
  Calendar,
  DollarSign,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { GuestLead, HospitalityQuote, AiProposalPayload } from "@/lib/types";

interface ProposalEmailWorkspaceProps {
  lead: GuestLead;
  quote: HospitalityQuote;
  aiOutput: AiProposalPayload;
  hitlTriggered: boolean;
  hitlApproved: boolean;
  onApproveHitl: () => void;
}

export function ProposalEmailWorkspace({
  lead,
  quote,
  aiOutput,
  hitlTriggered,
  hitlApproved,
  onApproveHitl
}: ProposalEmailWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"email" | "proposal" | "json" | "crm">("email");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-xs">
      {/* HITL Banner if quote > $10,000 */}
      {hitlTriggered && (
        <div
          className={`px-4 sm:px-6 py-3 border-b border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            hitlApproved
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {hitlApproved ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span>
              {hitlApproved
                ? "Human-in-the-Loop Gate: Approved by General Manager • Official SMTP Dispatched"
                : `High-Ticket Lead (Grand Total: $${quote.grandTotal.toLocaleString()} CAD > $10,000 threshold) held for 1-Click Director Review`}
            </span>
          </div>

          {!hitlApproved && (
            <button
              onClick={onApproveHitl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>1-Click Approve & Send Official Email</span>
            </button>
          )}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between px-4 sm:px-6 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "email"
                ? "border-[var(--color-n8n-coral)] text-[var(--color-n8n-coral)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Official Email Preview</span>
          </button>

          <button
            onClick={() => setActiveTab("proposal")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "proposal"
                ? "border-[var(--color-n8n-coral)] text-[var(--color-n8n-coral)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Hospitality Proposal Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab("crm")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "crm"
                ? "border-[var(--color-n8n-coral)] text-[var(--color-n8n-coral)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>CRM Sync Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("json")}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === "json"
                ? "border-[var(--color-n8n-coral)] text-[var(--color-n8n-coral)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Code className="w-4 h-4" />
            <span>N8N JSON Payload</span>
          </button>
        </div>

        {/* Provider Telemetry Tag */}
        <div className="hidden md:flex items-center gap-2 shrink-0 py-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text-secondary)] whitespace-nowrap shrink-0">
            <Sparkles className="w-3 h-3 text-[var(--color-n8n-coral)]" />
            <span className="uppercase font-bold">{aiOutput.provider}</span>
            <span>• {aiOutput.model}</span>
            <span>• {aiOutput.latencyMs}ms</span>
          </span>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-6">
        {/* TAB 1: Official Email Client Preview */}
        {activeTab === "email" && (
          <div className="flex flex-col gap-4">
            {/* Email Header Card */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex flex-col gap-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] w-14 shrink-0">
                    From:
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    Claire St-Laurent &lt;reservations@mountain-reserve-estates.ca&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 whitespace-nowrap shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    DKIM: PASS • SPF: PASS • DMARC: PASS
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-0 border-b border-[var(--color-border-subtle)] pb-2.5">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] w-14 shrink-0">
                  To:
                </span>
                <span className="text-xs font-medium text-[var(--color-text-primary)] truncate font-mono">
                  {lead.guestName} &lt;{lead.email}&gt;
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] w-14 shrink-0">
                    Subject:
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    {aiOutput.emailSubject}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(aiOutput.emailBody)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] border border-[var(--color-border)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email Body */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 sm:p-7 leading-relaxed text-xs sm:text-sm text-[var(--color-text-primary)] shadow-2xs whitespace-pre-line font-sans">
              {aiOutput.emailBody}
            </div>

            {/* Quick Action Bar */}
            <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-900 dark:text-sky-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>
                  Dispatched via official SMTP routing with attached custom PDF proposal & private concierge link.
                </span>
              </div>
              <button
                onClick={() => setActiveTab("proposal")}
                className="inline-flex items-center gap-1 font-bold text-sky-700 dark:text-sky-300 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Inspect Proposal Attachment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Formal Hospitality Proposal Viewer */}
        {activeTab === "proposal" && (
          <div className="flex flex-col gap-6">
            {/* Proposal Banner */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-5 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 mb-2 whitespace-nowrap shrink-0">
                    Official Executive Proposal • Quote #{quote.quoteId}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                    {aiOutput.proposalTitle}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)] max-w-3xl leading-relaxed">
                    {aiOutput.executiveSummary}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0 p-3 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)]">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Total Quoted Investment
                  </span>
                  <span className="text-2xl font-bold font-mono text-[var(--color-text-primary)] tabular-nums">
                    ${quote.grandTotal.toLocaleString()} <span className="text-xs font-normal font-sans">CAD</span>
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono mt-0.5">
                    Deposit to hold: ${quote.depositRequired.toLocaleString()} CAD
                  </span>
                </div>
              </div>
            </div>

            {/* Proposal Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tailored Highlights */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-n8n-coral)]" />
                  Tailored Hospitality Specifications
                </h3>
                <ul className="space-y-2.5">
                  {aiOutput.tailoredHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-primary)]">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ✓
                      </div>
                      <span className="leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Complimentary VIP Perks */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  Included Executive Privileges & Perks
                </h3>
                <ul className="space-y-2.5">
                  {aiOutput.amenityPerks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--color-text-primary)]">
                      <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        ★
                      </div>
                      <span className="leading-relaxed">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Deterministic Financial Breakdown Table */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Deterministic Financial Summary (Locked Rate Card {quote.rateCardVersion})
                </h3>
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  All figures calculated via N8N Code Node
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[var(--color-panel-subtle)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Line Item Description</th>
                      <th className="py-2.5 px-4">Rate & Multiplier Basis</th>
                      <th className="py-2.5 px-4 text-right">Subtotal (CAD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border-subtle)] text-[var(--color-text-primary)]">
                    <tr>
                      <td className="py-2.5 px-4 font-medium">
                        Suite Accommodations ({quote.suiteCount}x suites, {quote.nights} nights)
                      </td>
                      <td className="py-2.5 px-4 text-[var(--color-text-muted)] font-mono">
                        {quote.basis.roomBasis}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold">
                        ${quote.roomSubtotal.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-medium">
                        Curated Catering & Dining ({lead.headcount} guests, {quote.nights} days)
                      </td>
                      <td className="py-2.5 px-4 text-[var(--color-text-muted)] font-mono">
                        {quote.basis.cateringBasis}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold">
                        ${quote.cateringSubtotal.toLocaleString()}
                      </td>
                    </tr>
                    {quote.avPackageFee > 0 && (
                      <tr>
                        <td className="py-2.5 px-4 font-medium">
                          Executive 4K Hybrid Boardroom & Audio-Visual Package
                        </td>
                        <td className="py-2.5 px-4 text-[var(--color-text-muted)] font-mono">
                          Flat event equipment fee
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">
                          ${quote.avPackageFee.toLocaleString()}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-[var(--color-panel-subtle)]">
                      <td className="py-2 px-4 font-semibold text-[var(--color-text-secondary)]">
                        Hospitality Service Gratuity (18%)
                      </td>
                      <td className="py-2 px-4 text-[var(--color-text-muted)] font-mono">
                        {quote.basis.serviceFeeBasis}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">
                        ${quote.serviceCharge.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-[var(--color-panel-subtle)]">
                      <td className="py-2 px-4 font-semibold text-[var(--color-text-secondary)]">
                        Harmonized Sales Tax (13% HST)
                      </td>
                      <td className="py-2 px-4 text-[var(--color-text-muted)] font-mono">
                        {quote.basis.taxBasis}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">
                        ${quote.taxAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-[var(--color-border)] bg-[var(--color-panel)] font-bold text-sm">
                      <td className="py-3 px-4 text-[var(--color-text-primary)]">
                        Comprehensive Grand Total
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-normal text-emerald-600 dark:text-emerald-400">
                        30% Advance Deposit: ${quote.depositRequired.toLocaleString()} CAD
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-base text-[var(--color-n8n-coral)]">
                        ${quote.grandTotal.toLocaleString()} CAD
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CRM Timeline */}
        {activeTab === "crm" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">
                  CRM Bi-Directional Synchronizer
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  HubSpot / Salesforce Sync: Active
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">
                Deal ID: #{lead.id}
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--color-panel)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Inbound Lead Ingested via Webhook
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">00:00:00.120</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Received payload from {lead.crmSource.toUpperCase()} for guest {lead.guestName} ({lead.company || "Private"}).
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-sky-500 border-2 border-[var(--color-panel)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Identity Normalized & PMS History Enriched
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">00:00:00.850</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Sanitized phone to E.164, verified email DNS, matched {lead.guestTier} tier criteria.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-[var(--color-panel)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Hospitality Rate Calculation Locked
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">00:00:01.120</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Calculated quote ${quote.grandTotal.toLocaleString()} CAD ({quote.nights} nights, {quote.suiteCount} suites).
                  </p>
                </div>
              </div>

              {/* Event 4 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[var(--color-n8n-coral)] border-2 border-[var(--color-panel)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Dual-Provider AI Inference Executed
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">
                      00:00:{Math.floor(aiOutput.latencyMs / 1000)}.{aiOutput.latencyMs % 1000}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Inference via {aiOutput.provider.toUpperCase()} ({aiOutput.model}) in {aiOutput.latencyMs}ms ({aiOutput.tokensUsed} tokens).
                  </p>
                </div>
              </div>

              {/* Event 5 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-[var(--color-panel)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Official SMTP Dispatch & CRM Stage Updated
                    </span>
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">
                      00:00:04.200
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Email sent to {lead.email}. Deal stage promoted to &quot;Proposal Sent&quot;. Automated follow-up task scheduled for +48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Raw N8N JSON Payload */}
        {activeTab === "json" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                Canonical N8N Execution Output JSON (Node Output)
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        lead,
                        quote,
                        aiOutput,
                        workflowStatus: "SUCCESS",
                        timestamp: new Date().toISOString()
                      },
                      null,
                      2
                    )
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] border border-[var(--color-border)] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>Copy JSON</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-mono overflow-x-auto max-h-[460px] text-[var(--color-text-primary)] leading-relaxed">
              {JSON.stringify(
                {
                  executionId: "exec_n8n_9842018",
                  workflowName: "Hospitality CRM AI Proposal & Email Autopilot",
                  lead: {
                    id: lead.id,
                    name: lead.guestName,
                    email: lead.email,
                    company: lead.company,
                    crmSource: lead.crmSource,
                    guestTier: lead.guestTier,
                    checkInDate: lead.checkInDate,
                    checkOutDate: lead.checkOutDate,
                    headcount: lead.headcount,
                    suiteType: lead.suiteType,
                    cateringTier: lead.cateringTier
                  },
                  quote: {
                    quoteId: quote.quoteId,
                    grandTotal: quote.grandTotal,
                    depositRequired: quote.depositRequired,
                    currency: quote.currency,
                    rateCardVersion: quote.rateCardVersion,
                    basis: quote.basis
                  },
                  aiOutput: {
                    provider: aiOutput.provider,
                    model: aiOutput.model,
                    latencyMs: aiOutput.latencyMs,
                    tokensUsed: aiOutput.tokensUsed,
                    emailSubject: aiOutput.emailSubject,
                    proposalTitle: aiOutput.proposalTitle
                  }
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
