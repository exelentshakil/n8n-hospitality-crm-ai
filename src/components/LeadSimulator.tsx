"use client";

import React, { useState } from "react";
import { Play, Sparkles, Building2, Calendar, Users, DollarSign, RefreshCw, Layers } from "lucide-react";
import { GuestLead, SuiteType, CateringTier, CRMProvider, GuestTier } from "@/lib/types";
import { SAMPLE_GUEST_LEADS } from "@/lib/constants";

interface LeadSimulatorProps {
  currentLead: GuestLead;
  onLeadChange: (lead: GuestLead) => void;
  onRunPipeline: () => void;
  isRunning: boolean;
}

export function LeadSimulator({
  currentLead,
  onLeadChange,
  onRunPipeline,
  isRunning
}: LeadSimulatorProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(currentLead.id);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const found = SAMPLE_GUEST_LEADS.find((l) => l.id === id);
    if (found) {
      onLeadChange({ ...found });
    }
  };

  const updateLeadField = <K extends keyof GuestLead>(field: K, value: GuestLead[K]) => {
    onLeadChange({
      ...currentLead,
      [field]: value
    });
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 sm:p-6 shadow-xs">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] tracking-tight">
            1. CRM Lead Ingestion Simulator
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Select an authentic inbound guest lead or tweak properties to test real-time N8N ingestion.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 shrink-0">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)] mr-1 hidden lg:inline">
            Presets:
          </span>
          {SAMPLE_GUEST_LEADS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--color-n8n-coral)] text-white shadow-xs"
                    : "bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)]"
                }`}
              >
                {preset.guestName.split(" ")[0]} ({preset.guestTier.replace("_", " ")})
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Form Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4">
        {/* Guest & Company */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Guest Name & Company
          </label>
          <input
            type="text"
            value={currentLead.guestName}
            onChange={(e) => updateLeadField("guestName", e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--color-n8n-coral)]"
            placeholder="Guest Name"
          />
          <input
            type="text"
            value={currentLead.company || ""}
            onChange={(e) => updateLeadField("company", e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-n8n-coral)]"
            placeholder="Company or Occasion"
          />
        </div>

        {/* CRM Source & Guest Tier */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            CRM Source & Guest Tier
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={currentLead.crmSource}
              onChange={(e) => updateLeadField("crmSource", e.target.value as CRMProvider)}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-primary)] font-medium focus:outline-none"
            >
              <option value="hubspot">HubSpot CRM</option>
              <option value="pipedrive">Pipedrive</option>
              <option value="salesforce">Salesforce</option>
              <option value="guestline">Guestline PMS</option>
              <option value="webhook">Custom Webhook</option>
            </select>
            <select
              value={currentLead.guestTier}
              onChange={(e) => updateLeadField("guestTier", e.target.value as GuestTier)}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-primary)] font-medium focus:outline-none"
            >
              <option value="Executive_Summit">Exec Summit</option>
              <option value="VIP">VIP Retreat</option>
              <option value="Wedding_Social">Wedding</option>
              <option value="Corporate">Corporate Group</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-mono mt-0.5">
            <span>Lead ID: {currentLead.id}</span>
          </div>
        </div>

        {/* Headcount, Nights & Suites */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Party Size, Nights & Suites
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Guests</span>
              <input
                type="number"
                min={2}
                max={300}
                value={currentLead.headcount}
                onChange={(e) => updateLeadField("headcount", parseInt(e.target.value) || 2)}
                className="w-full px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-mono text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Nights</span>
              <input
                type="number"
                min={1}
                max={14}
                value={currentLead.nights}
                onChange={(e) => updateLeadField("nights", parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-mono text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Suites</span>
              <input
                type="number"
                min={1}
                max={150}
                value={currentLead.suiteCount}
                onChange={(e) => updateLeadField("suiteCount", parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs font-mono text-[var(--color-text-primary)]"
              />
            </div>
          </div>
          <select
            value={currentLead.suiteType}
            onChange={(e) => updateLeadField("suiteType", e.target.value as SuiteType)}
            className="w-full px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-primary)] font-medium mt-1 focus:outline-none"
          >
            <option value="Executive_Suite">Executive Grand Suite ($850/nt)</option>
            <option value="Boutique_Villa">Private Chalet Villa ($1,950/nt)</option>
            <option value="Presidential">Presidential Penthouse ($2,850/nt)</option>
            <option value="Deluxe_King">Deluxe Mountainview ($420/nt)</option>
          </select>
        </div>

        {/* Catering & AV Package */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
            Catering & Venue Package
          </label>
          <select
            value={currentLead.cateringTier}
            onChange={(e) => updateLeadField("cateringTier", e.target.value as CateringTier)}
            className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-xs text-[var(--color-text-primary)] font-medium focus:outline-none"
          >
            <option value="Michelin_Plated">Michelin-Plated 4-Course ($240/p)</option>
            <option value="Full_Board">Executive Full-Board ($295/p)</option>
            <option value="Artisan_Buffet">Artisan Mountain Buffet ($165/p)</option>
            <option value="Cocktail_Reception">Cocktail & Canapés ($135/p)</option>
          </select>
          <div className="flex items-center gap-2 mt-1">
            <label className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={currentLead.avRequirement}
                onChange={(e) => updateLeadField("avRequirement", e.target.checked)}
                className="rounded border-[var(--color-border)] text-[var(--color-n8n-coral)] focus:ring-[var(--color-n8n-coral)]"
              />
              <span className="font-medium">Hybrid 4K Boardroom AV Package</span>
            </label>
          </div>
          <div className="text-xs font-mono text-[var(--color-text-muted)] truncate">
            Venue: {currentLead.venueLocation}
          </div>
        </div>
      </div>

      {/* Execution Trigger Bar */}
      <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Triggers 8-node N8N pipeline: Webhook Ingest → 100% Rate Lock → Dual AI Generation → SMTP Delivery
          </span>
        </div>

        <button
          onClick={onRunPipeline}
          disabled={isRunning}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all whitespace-nowrap shrink-0 shadow-md cursor-pointer ${
            isRunning
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-[var(--color-n8n-coral)] hover:bg-[#d4385e] active:scale-98 shadow-[var(--color-n8n-coral)]/30"
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Orchestrating N8N Workflow...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Simulate CRM Ingestion & Run N8N Pipeline</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
