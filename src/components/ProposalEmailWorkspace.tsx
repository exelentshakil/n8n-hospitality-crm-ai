"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  FileText,
  Code,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Smartphone,
  Monitor,
  Eye,
  Edit3,
  Download,
  Calendar,
  Layers,
  Send,
  RefreshCw,
  X
} from "lucide-react";
import { GuestLead, HospitalityQuote, AiProposalPayload } from "@/lib/types";
import { generateBrevoHtmlEmail } from "@/lib/email-template";

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
  const [emailMode, setEmailMode] = useState<"visual" | "plaintext" | "html" | "editor">("visual");
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState<string | null>(null);

  // Live copy editor state
  const [editedSubject, setEditedSubject] = useState(aiOutput.emailSubject);
  const [editedBody, setEditedBody] = useState(aiOutput.emailBody);

  // Concierge scheduling modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM MST (Denver/Calgary)");
  const [isScheduledConfirmed, setIsScheduledConfirmed] = useState(false);

  // Synchronize when parent aiOutput updates
  useEffect(() => {
    setEditedSubject(aiOutput.emailSubject);
    setEditedBody(aiOutput.emailBody);
    setIsScheduledConfirmed(false);
  }, [aiOutput]);

  const activeAiOutput: AiProposalPayload = {
    ...aiOutput,
    emailSubject: editedSubject,
    emailBody: editedBody
  };

  const htmlEmailString = generateBrevoHtmlEmail(lead, quote, activeAiOutput);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlEmailString], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proposal-email-${lead.id}-${quote.quoteId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetCopy = () => {
    setEditedSubject(aiOutput.emailSubject);
    setEditedBody(aiOutput.emailBody);
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>1-Click Approve & Send Official Email</span>
            </button>
          )}
        </div>
      )}

      {/* Primary Tabs Navigation */}
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
            <span>Visual Email Studio (Brevo Standard)</span>
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
        {/* TAB 1: Brevo / GetResponse Style Email Studio */}
        {activeTab === "email" && (
          <div className="flex flex-col gap-5">
            {/* Email Header Metadata Card */}
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
                    {editedSubject}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(editedBody, "body")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-panel)] border border-[var(--color-border)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copied === "body" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>Text Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Plain Text</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopy(htmlEmailString, "html")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[var(--color-n8n-coral)] text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer font-semibold shadow-2xs"
                  >
                    {copied === "html" ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>HTML Copied!</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3 h-3" />
                        <span>Copy Brevo HTML</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Studio Toolbar (Brevo / GetResponse Style) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
              {/* Studio Format Selector */}
              <div className="flex items-center gap-1 bg-[var(--color-panel)] p-1 rounded-lg border border-[var(--color-border)]">
                <button
                  onClick={() => setEmailMode("visual")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    emailMode === "visual"
                      ? "bg-[var(--color-n8n-coral)] text-white shadow-xs"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visual Template</span>
                </button>

                <button
                  onClick={() => setEmailMode("editor")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    emailMode === "editor"
                      ? "bg-[var(--color-n8n-coral)] text-white shadow-xs"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Live Copy Editor</span>
                </button>

                <button
                  onClick={() => setEmailMode("plaintext")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    emailMode === "plaintext"
                      ? "bg-[var(--color-n8n-coral)] text-white shadow-xs"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Clean Prose</span>
                </button>

                <button
                  onClick={() => setEmailMode("html")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    emailMode === "html"
                      ? "bg-[var(--color-n8n-coral)] text-white shadow-xs"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>ESP HTML Code</span>
                </button>
              </div>

              {/* Viewport Switcher & Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {emailMode === "visual" && (
                  <div className="flex items-center gap-1 bg-[var(--color-panel)] p-1 rounded-lg border border-[var(--color-border)]">
                    <button
                      onClick={() => setViewport("desktop")}
                      className={`p-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1 ${
                        viewport === "desktop"
                          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                      }`}
                      title="Desktop View (600px canvas)"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden md:inline text-xs">Desktop</span>
                    </button>
                    <button
                      onClick={() => setViewport("mobile")}
                      className={`p-1.5 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1 ${
                        viewport === "mobile"
                          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                      }`}
                      title="Mobile View (390px iPhone canvas)"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden md:inline text-xs">Mobile</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleDownloadHtml}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-panel)] hover:bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                  title="Download .html file for Brevo/GetResponse/SendGrid"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download HTML</span>
                </button>

                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Test Walkthrough CTA</span>
                </button>
              </div>
            </div>

            {/* Visual Mode (Desktop or Mobile iPhone 390px Frame) */}
            {emailMode === "visual" && (
              <div className="w-full flex justify-center py-4 bg-slate-100 dark:bg-slate-950/80 rounded-2xl border border-[var(--color-border)] p-2 sm:p-6 overflow-hidden">
                {viewport === "desktop" ? (
                  // Desktop 600px Canvas
                  <div className="w-full max-w-[620px] bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Fake Browser / Client Tab Strip */}
                    <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        <span className="ml-2 font-mono text-[11px] text-slate-400">
                          Brevo ESP Preview • 600px Max-Width
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono font-medium">
                        100% Client Responsive
                      </span>
                    </div>

                    {/* Rendered Email Content */}
                    <div className="p-6 sm:p-8 bg-slate-50">
                      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                        {/* Luxury Header */}
                        <div className="bg-slate-900 p-6 text-center border-b-2 border-amber-600">
                          <div className="text-[10px] tracking-[2px] uppercase text-amber-400 font-bold mb-1">
                            Est. 1928 • Private Estates & Reserves
                          </div>
                          <div className="text-xl font-extrabold text-white tracking-wide uppercase">
                            The Reserve Alpine Resort
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 font-mono">
                            Banff • Lake Louise • Whistler | Private Concierge Directorate
                          </div>
                        </div>

                        {/* Envelope Header Strip */}
                        <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                          <div>
                            <strong>Proposal Hold:</strong>{" "}
                            <span className="font-mono text-slate-900 font-bold">
                              Quote #{quote.quoteId}
                            </span>
                          </div>
                          <div className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>100% SPF/DKIM Verified</span>
                          </div>
                        </div>

                        {/* Main Letter */}
                        <div className="p-6 sm:p-7 text-slate-700 text-sm leading-relaxed space-y-4">
                          {editedBody
                            .split("\n\n")
                            .filter(
                              (p) =>
                                !p.startsWith("Warmest regards") &&
                                !p.startsWith("Claire St-Laurent") &&
                                !p.startsWith("Direct Liaison") &&
                                !p.startsWith("The Reserve Alpine") &&
                                !p.startsWith("Executive Director")
                            )
                            .map((paragraph, idx) => (
                              <p key={idx} className="text-[14px] leading-[1.65] text-slate-700">
                                {paragraph}
                              </p>
                            ))}

                          {/* Curated Specifications Card */}
                          <div className="my-6 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                            <div className="bg-slate-900 text-white px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase">
                              Curated Estate Specifications & Locked Rates
                            </div>
                            <div className="p-4 text-xs space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Estate Venue:</span>
                                <span className="font-bold text-slate-900">{lead.venueLocation}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Reserved Dates:</span>
                                <span className="font-bold text-slate-900">
                                  {lead.checkInDate} to {lead.checkOutDate} ({quote.nights} Nights)
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Distinguished Party:</span>
                                <span className="font-bold text-slate-900">{lead.headcount} Guests</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Suite Allocation:</span>
                                <span className="font-bold text-slate-900">
                                  {quote.suiteCount}x {lead.suiteType.replace(/_/g, " ")}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-200">
                                <span className="text-slate-500">Culinary Program:</span>
                                <span className="font-bold text-slate-900">
                                  {lead.cateringTier.replace(/_/g, " ")}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t-2 border-slate-300 font-bold text-sm">
                                <span className="text-slate-900">Total Quoted Investment:</span>
                                <span className="text-slate-900 font-mono">
                                  ${quote.grandTotal.toLocaleString()} CAD
                                </span>
                              </div>
                              <div className="flex justify-between text-emerald-700 text-xs font-semibold">
                                <span>Advance Deposit to Hold:</span>
                                <span className="font-mono">
                                  ${quote.depositRequired.toLocaleString()} CAD (30%)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Logistics & Special Requests Card */}
                          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs">
                            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                              <span>✦ Pre-Coordinated Special Requests & Logistics</span>
                            </div>
                            <ul className="space-y-1.5 text-slate-800 pl-4 list-disc marker:text-amber-600">
                              {(Array.isArray(lead.specialRequests)
                                ? lead.specialRequests
                                : [lead.specialRequests]
                              ).map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Interactive Call to Action */}
                          <div className="pt-4 pb-2 text-center">
                            <button
                              onClick={() => setIsScheduleModalOpen(true)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#ea4b71] hover:bg-[#d93860] shadow-md hover:shadow-lg transition-all cursor-pointer"
                            >
                              <span>Schedule 15-Minute Concierge Walkthrough</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            <p className="mt-2 text-[11px] text-slate-500">
                              Direct executive calendar • Guaranteed reservation hold
                            </p>
                          </div>

                          {/* Executive Signature */}
                          <div className="pt-5 mt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                            <p className="italic text-slate-500">Warmest regards,</p>
                            <div className="text-sm font-bold text-slate-900 pt-1">
                              Claire St-Laurent
                            </div>
                            <div className="text-slate-700 font-medium">
                              Executive Director of Luxury Sales & Guest Experience
                            </div>
                            <div className="text-slate-500">
                              The Reserve Alpine Resort & Conference Estates • Lake Louise & Banff, AB
                            </div>
                            <div className="text-[#ea4b71] font-mono text-[11px] pt-1">
                              Direct Desk: +1 (403) 555-0199 • reservations@mountain-reserve-estates.ca
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-100 p-4 text-center text-[10px] text-slate-500 border-t border-slate-200">
                          © 2026 The Reserve Alpine Resort & Estates • Dispatched via N8N Autopilot
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile iPhone Frame (390px Viewport)
                  <div className="relative w-[390px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-[4px] border-slate-800 overflow-hidden">
                    {/* iPhone Notch & Speaker */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
                      <div className="w-12 h-1 bg-slate-700 rounded-full" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-2" />
                    </div>

                    {/* Mobile Screen Container */}
                    <div className="w-full bg-white rounded-[40px] pt-8 pb-6 px-3.5 text-slate-800 max-h-[640px] overflow-y-auto text-xs scrollbar-thin">
                      {/* Mobile Header */}
                      <div className="bg-slate-900 -mx-3.5 -mt-2 p-4 text-center border-b-2 border-amber-600">
                        <div className="text-[9px] tracking-[1.5px] uppercase text-amber-400 font-bold mb-0.5">
                          Private Estates
                        </div>
                        <div className="text-base font-extrabold text-white uppercase tracking-wide">
                          The Reserve Alpine
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                          Banff • Lake Louise • Whistler
                        </div>
                      </div>

                      {/* Quote Strip */}
                      <div className="bg-slate-100 -mx-3.5 px-4 py-2 border-b border-slate-200 text-[10px] text-slate-600 flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-900">
                          Quote #{quote.quoteId}
                        </span>
                        <span className="text-emerald-700 font-bold">✓ 100% SPF/DKIM</span>
                      </div>

                      {/* Body Prose */}
                      <div className="py-4 space-y-3">
                        {editedBody
                          .split("\n\n")
                          .filter(
                            (p) =>
                              !p.startsWith("Warmest regards") &&
                              !p.startsWith("Claire St-Laurent") &&
                              !p.startsWith("Direct Liaison") &&
                              !p.startsWith("The Reserve Alpine") &&
                              !p.startsWith("Executive Director")
                          )
                          .map((paragraph, idx) => (
                            <p key={idx} className="text-[12px] leading-relaxed text-slate-700">
                              {paragraph}
                            </p>
                          ))}

                        {/* Mobile Specs Summary */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                          <div className="font-bold text-slate-900 uppercase text-[10px] pb-1 border-b border-slate-200">
                            Proposal Specifications
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Dates:</span>
                            <span className="font-semibold text-slate-900">
                              {lead.checkInDate} ({quote.nights} nts)
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Party:</span>
                            <span className="font-semibold text-slate-900">
                              {lead.headcount} Guests • {quote.suiteCount} Suites
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-xs">
                            <span>Total (CAD):</span>
                            <span className="font-mono">${quote.grandTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-medium text-[10px]">
                            <span>Hold Deposit:</span>
                            <span className="font-mono">
                              ${quote.depositRequired.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Mobile CTA */}
                        <div className="pt-2 text-center">
                          <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#ea4b71] hover:bg-[#d93860] shadow-sm cursor-pointer"
                          >
                            Schedule Concierge Walkthrough →
                          </button>
                        </div>

                        {/* Signature */}
                        <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-600">
                          <p className="italic text-slate-500">Warmest regards,</p>
                          <div className="font-bold text-slate-900 text-xs">Claire St-Laurent</div>
                          <div className="text-[10px] text-slate-500">
                            Executive Director • The Reserve Alpine Estates
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Copy Editor Mode */}
            {emailMode === "editor" && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[var(--color-n8n-coral)]" />
                      Executive Copy Studio (Live Tuning)
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Modify email text before SMTP transmission. The visual template and ESP HTML update instantly.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCopy}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset to AI Output</span>
                    </button>
                    <button
                      onClick={() => setEmailMode("visual")}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-n8n-coral)] text-white hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview in Template</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-medium focus:outline-hidden focus:ring-1 focus:ring-[var(--color-n8n-coral)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Email Letter Body (Prose Paragraphs)
                  </label>
                  <textarea
                    rows={14}
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    className="w-full p-3.5 text-xs sm:text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] font-sans leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-[var(--color-n8n-coral)]"
                  />
                </div>
              </div>
            )}

            {/* Clean Plaintext Mode */}
            {emailMode === "plaintext" && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 sm:p-7 leading-relaxed text-xs sm:text-sm text-[var(--color-text-primary)] shadow-2xs whitespace-pre-line font-sans">
                {editedBody}
              </div>
            )}

            {/* ESP HTML Code Mode */}
            {emailMode === "html" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--color-text-muted)]">
                    Cross-Client 600px Responsive HTML Email (Brevo / GetResponse / SendGrid / Outlook Compatible)
                  </span>
                  <button
                    onClick={() => handleCopy(htmlEmailString, "html_code")}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-[var(--color-n8n-coral)] text-white hover:opacity-90 cursor-pointer"
                  >
                    {copied === "html_code" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied === "html_code" ? "Copied!" : "Copy Full HTML"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-mono overflow-x-auto max-h-[480px] text-[var(--color-text-primary)] leading-relaxed">
                  {htmlEmailString}
                </pre>
              </div>
            )}

            {/* Quick Action Bar & ESP Compatibility Guarantee */}
            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-sky-900 dark:text-sky-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>
                  <strong>Brevo & GetResponse Ready:</strong> Inlined CSS, table layout, 600px width constraint, and tested across Apple Mail, Gmail, and Microsoft Outlook.
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
                        aiOutput: activeAiOutput,
                        workflowStatus: "SUCCESS",
                        template: "Brevo-600px-Responsive-v2"
                      },
                      null,
                      2
                    ),
                    "json"
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] border border-[var(--color-border)] cursor-pointer"
              >
                {copied === "json" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
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
                    provider: activeAiOutput.provider,
                    model: activeAiOutput.model,
                    latencyMs: activeAiOutput.latencyMs,
                    tokensUsed: activeAiOutput.tokensUsed,
                    emailSubject: activeAiOutput.emailSubject,
                    proposalTitle: activeAiOutput.proposalTitle
                  }
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>

      {/* Interactive 15-Minute Concierge Walkthrough Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-n8n-coral)] text-white flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Executive Concierge Walkthrough
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    The Reserve Alpine Estates • Private Reservation Directorate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-panel-subtle)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isScheduledConfirmed ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                  Walkthrough Confirmed!
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
                  A private video conference invitation and calendar invite have been dispatched to{" "}
                  <strong className="font-mono text-[var(--color-text-primary)]">{lead.email}</strong> for{" "}
                  <strong className="text-[var(--color-text-primary)]">{selectedTimeSlot}</strong>.
                </p>
                <div className="p-3 bg-[var(--color-panel-subtle)] rounded-xl border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)]">
                  Hold Reference: RES-WALKTHROUGH-{lead.id.replace(/\D/g, "") || "84920"}
                </div>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="mt-2 px-5 py-2 rounded-xl text-xs font-bold bg-[var(--color-n8n-coral)] text-white hover:opacity-90 cursor-pointer"
                >
                  Close & Return to Studio
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>VIP Estate Hold Guaranteed:</strong> During this 15-minute call with Claire St-Laurent, we will review the suite wing floorplan, culinary menu selections, and finalize your arrival escort logistics.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)]">
                    Host & Location
                  </label>
                  <div className="p-2.5 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-xs flex justify-between">
                    <span className="text-[var(--color-text-primary)] font-semibold">
                      Claire St-Laurent (Executive Director)
                    </span>
                    <span className="text-[var(--color-text-muted)]">{lead.venueLocation}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text-secondary)]">
                    Select Convenient Time Slot
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "10:00 AM MST (Denver/Calgary)",
                      "02:00 PM MST (Denver/Calgary)",
                      "04:30 PM MST (Denver/Calgary)"
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2.5 text-xs text-left rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          selectedTimeSlot === slot
                            ? "border-[var(--color-n8n-coral)] bg-[var(--color-brand-subtle)] text-[var(--color-text-primary)] font-bold shadow-xs"
                            : "border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)]"
                        }`}
                      >
                        <span>{slot}</span>
                        {selectedTimeSlot === slot && (
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-n8n-coral)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsScheduledConfirmed(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#ea4b71] hover:bg-[#d93860] text-white shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm Walkthrough Booking</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
