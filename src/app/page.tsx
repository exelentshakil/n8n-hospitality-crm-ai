"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { WorkspaceHeader } from "@/components/WorkspaceHeader";
import { N8nVisualWorkflow } from "@/components/N8nVisualWorkflow";
import { LeadSimulator } from "@/components/LeadSimulator";
import { ProposalEmailWorkspace } from "@/components/ProposalEmailWorkspace";
import { TechnicalSpecsFooter } from "@/components/TechnicalSpecsFooter";
import { N8nExportModal } from "@/components/N8nExportModal";
import { GuestLead, HospitalityQuote, AiProposalPayload, N8nNode } from "@/lib/types";
import { SAMPLE_GUEST_LEADS, INITIAL_N8N_NODES } from "@/lib/constants";
import { calculateHospitalityQuote } from "@/lib/rate-engine";
import { getDeterministicProposal } from "@/lib/ai";

export default function HomePage() {
  const [lead, setLead] = useState<GuestLead>(SAMPLE_GUEST_LEADS[0]);
  const [quote, setQuote] = useState<HospitalityQuote>(() =>
    calculateHospitalityQuote(SAMPLE_GUEST_LEADS[0])
  );
  const [aiOutput, setAiOutput] = useState<AiProposalPayload>(() =>
    getDeterministicProposal(
      SAMPLE_GUEST_LEADS[0],
      calculateHospitalityQuote(SAMPLE_GUEST_LEADS[0])
    )
  );
  const [nodes, setNodes] = useState<N8nNode[]>(INITIAL_N8N_NODES);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hitlTriggered, setHitlTriggered] = useState(true);
  const [hitlApproved, setHitlApproved] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Recalculate deterministic quote whenever lead parameters change
  const handleLeadChange = (newLead: GuestLead) => {
    setLead(newLead);
    const newQuote = calculateHospitalityQuote(newLead);
    setQuote(newQuote);
    setHitlTriggered(newQuote.grandTotal > 10000);
    setHitlApproved(false);
  };

  const handleRunPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setHitlApproved(false);

    // Reset node states
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: "idle",
        durationMs: undefined
      }))
    );

    const updateNodeStatus = (
      nodeId: string,
      status: "running" | "success" | "warning",
      durationMs?: number
    ) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, status, durationMs } : n))
      );
    };

    try {
      // Step 1: Webhook Ingest
      setActiveNodeId("node_webhook");
      updateNodeStatus("node_webhook", "running");
      await new Promise((r) => setTimeout(r, 220));
      updateNodeStatus("node_webhook", "success", 78);

      // Step 2: Normalize
      setActiveNodeId("node_normalize");
      updateNodeStatus("node_normalize", "running");
      await new Promise((r) => setTimeout(r, 180));
      updateNodeStatus("node_normalize", "success", 45);

      // Step 3: Enrich Context
      setActiveNodeId("node_enrich");
      updateNodeStatus("node_enrich", "running");
      await new Promise((r) => setTimeout(r, 240));
      updateNodeStatus("node_enrich", "success", 185);

      // Step 4: Rate Calculation (Deterministic)
      setActiveNodeId("node_pricing");
      updateNodeStatus("node_pricing", "running");
      const currentQuote = calculateHospitalityQuote(lead);
      setQuote(currentQuote);
      await new Promise((r) => setTimeout(r, 160));
      updateNodeStatus("node_pricing", "success", 18);

      // Step 5: AI Proposal & Email Generation (Live API Call)
      setActiveNodeId("node_ai_gen");
      updateNodeStatus("node_ai_gen", "running");

      let generatedAiOutput: AiProposalPayload;
      try {
        const response = await fetch("/api/ai/generate-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead })
        });

        if (response.ok) {
          const data = await response.json();
          generatedAiOutput = data.aiOutput;
          if (data.quote) setQuote(data.quote);
        } else {
          generatedAiOutput = getDeterministicProposal(lead, currentQuote);
        }
      } catch {
        generatedAiOutput = getDeterministicProposal(lead, currentQuote);
      }

      setAiOutput(generatedAiOutput);
      updateNodeStatus(
        "node_ai_gen",
        "success",
        generatedAiOutput.latencyMs || 420
      );

      // Step 6: HITL Gate Check
      setActiveNodeId("node_hitl_gate");
      updateNodeStatus("node_hitl_gate", "running");
      await new Promise((r) => setTimeout(r, 180));
      const requiresHitl = currentQuote.grandTotal > 10000;
      setHitlTriggered(requiresHitl);
      updateNodeStatus("node_hitl_gate", "success", 15);

      // Step 7 & 8: Dispatch & CRM Sync
      setActiveNodeId("node_smtp_dispatch");
      updateNodeStatus("node_smtp_dispatch", "running");
      await new Promise((r) => setTimeout(r, 250));
      updateNodeStatus("node_smtp_dispatch", "success", 280);

      setActiveNodeId("node_crm_sync");
      updateNodeStatus("node_crm_sync", "running");
      await new Promise((r) => setTimeout(r, 200));
      updateNodeStatus("node_crm_sync", "success", 145);

      setActiveNodeId(null);
    } catch (err) {
      console.error("Pipeline run error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApproveHitl = () => {
    setHitlApproved(true);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === "node_hitl_gate"
          ? { ...n, status: "success", configSummary: "GM Approved: Dispatched" }
          : n
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar onOpenExportModal={() => setIsExportModalOpen(true)} />
      <WorkspaceHeader />

      <main className="flex-1 w-full px-0 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Section 1: Lead Ingestion Simulator */}
          <LeadSimulator
            currentLead={lead}
            onLeadChange={handleLeadChange}
            onRunPipeline={handleRunPipeline}
            isRunning={isRunning}
          />

          {/* Section 2: Visual N8N Workflow Graph */}
          <N8nVisualWorkflow
            nodes={nodes}
            activeNodeId={activeNodeId}
            isRunning={isRunning}
            onSelectNode={() => {}}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />

          {/* Section 3: Proposal & Email Workspace */}
          <ProposalEmailWorkspace
            lead={lead}
            quote={quote}
            aiOutput={aiOutput}
            hitlTriggered={hitlTriggered}
            hitlApproved={hitlApproved}
            onApproveHitl={handleApproveHitl}
          />
        </div>
      </main>

      <TechnicalSpecsFooter />

      {/* N8N Workflow Export Modal */}
      <N8nExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
