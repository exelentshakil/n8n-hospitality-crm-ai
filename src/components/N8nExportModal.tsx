"use client";

import React, { useState } from "react";
import { X, Download, Copy, Check, FileJson, CheckCircle2 } from "lucide-react";
import { N8N_WORKFLOW_EXPORT_JSON } from "@/lib/constants";

interface N8nExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function N8nExportModal({ isOpen, onClose }: N8nExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(N8N_WORKFLOW_EXPORT_JSON, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hospitality-crm-ai-proposal-workflow.n8n.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-[var(--color-brand-subtle)] text-[var(--color-n8n-coral)]">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                Production N8N Workflow Export
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Ready to import into any N8N instance (Cloud or Self-Hosted Docker)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Strip */}
        <div className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Compatible with N8N v1.0+. Includes 8 pre-configured nodes, connections, webhook handlers, and dual AI prompts.
          </span>
        </div>

        {/* Code Preview */}
        <div className="p-4 overflow-y-auto flex-1 bg-[var(--color-panel-subtle)]">
          <pre className="text-xs font-mono text-[var(--color-text-primary)] leading-relaxed whitespace-pre p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)]">
            {jsonString}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-panel)]">
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            Size: ~{(jsonString.length / 1024).toFixed(1)} KB • 8 Nodes
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[var(--color-n8n-coral)] hover:bg-[#d4385e] transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
