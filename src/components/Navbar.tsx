"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Download, Cpu, GitBranch, ShieldCheck } from "lucide-react";
import { N8N_WORKFLOW_EXPORT_JSON } from "@/lib/constants";

interface NavbarProps {
  onOpenExportModal: () => void;
}

export function Navbar({ onOpenExportModal }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-panel)]/90 backdrop-blur-md px-0 py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand & Engine Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-n8n-coral)] flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-[var(--color-n8n-coral)]/30">
              n8n
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[var(--color-text-primary)] tracking-tight truncate">
                  GuestFlow Autopilot
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-brand-subtle)] text-[var(--color-n8n-coral)] border border-[var(--color-n8n-coral)]/20 whitespace-nowrap shrink-0">
                  <Cpu className="w-3 h-3" />
                  N8N AI Workflow
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] font-mono hidden sm:inline truncate">
                Hospitality CRM • Dual-Provider LLM • Official SMTP Dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)] whitespace-nowrap shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Rate Lock: 100% Deterministic</span>
          </div>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            title="Download N8N Workflow JSON"
          >
            <Download className="w-3.5 h-3.5 text-[var(--color-n8n-coral)]" />
            <span className="hidden sm:inline">Export N8N JSON</span>
            <span className="sm:hidden">N8N JSON</span>
          </button>

          <a
            href="https://github.com/exelentshakil/n8n-hospitality-crm-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-panel-subtle)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors whitespace-nowrap shrink-0"
          >
            <GitBranch className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-subtle)] border border-[var(--color-border)] transition-colors shrink-0 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
