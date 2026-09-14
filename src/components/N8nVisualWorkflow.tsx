"use client";

import React, { useState } from "react";
import {
  Webhook,
  Sliders,
  Database,
  Calculator,
  Sparkles,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Code2,
  FileJson
} from "lucide-react";
import { N8nNode } from "@/lib/types";

interface N8nVisualWorkflowProps {
  nodes: N8nNode[];
  activeNodeId: string | null;
  isRunning: boolean;
  onSelectNode: (nodeId: string) => void;
  onOpenExportModal: () => void;
}

export function N8nVisualWorkflow({
  nodes,
  activeNodeId,
  isRunning,
  onSelectNode,
  onOpenExportModal
}: N8nVisualWorkflowProps) {
  const [selectedNode, setSelectedNode] = useState<N8nNode>(nodes[0]);

  const handleNodeClick = (node: N8nNode) => {
    setSelectedNode(node);
    onSelectNode(node.id);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Webhook":
        return <Webhook className="w-4 h-4 text-emerald-500" />;
      case "Sliders":
        return <Sliders className="w-4 h-4 text-sky-500" />;
      case "Database":
        return <Database className="w-4 h-4 text-indigo-500" />;
      case "Calculator":
        return <Calculator className="w-4 h-4 text-amber-500" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-[var(--color-n8n-coral)]" />;
      case "ShieldAlert":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "Send":
        return <Send className="w-4 h-4 text-sky-600" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-xs">
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-3 h-3 rounded-full bg-[var(--color-n8n-coral)] animate-pulse" />
          <span className="font-semibold text-xs sm:text-sm text-[var(--color-text-primary)] truncate">
            Active N8N Workflow Graph: <span className="font-mono text-[var(--color-n8n-coral)]">wf_hospitality_crm_autopilot</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap shrink-0">
            Active v1.94
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--color-panel)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
          >
            <FileJson className="w-3.5 h-3.5 text-[var(--color-n8n-coral)]" />
            <span>Workflow Schema</span>
          </button>
          <div className="text-xs text-[var(--color-text-muted)] font-mono hidden md:inline">
            Click any node to inspect parameters
          </div>
        </div>
      </div>

      {/* Visual N8N Node Pipeline Grid */}
      <div className="p-4 sm:p-6 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] overflow-x-auto">
        <div className="min-w-[840px] flex items-center justify-between gap-2 py-4 relative">
          {nodes.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            const isCurrentlyExecuting = isRunning && activeNodeId === node.id;
            const hasSucceeded = node.status === "success";

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onClick={() => handleNodeClick(node)}
                  className={`relative flex flex-col justify-between w-44 p-3 rounded-xl border transition-all cursor-pointer select-none shrink-0 ${
                    isSelected
                      ? "ring-2 ring-[var(--color-n8n-coral)] border-transparent shadow-md bg-[var(--color-panel)]"
                      : "border-[var(--color-border)] bg-[var(--color-panel)] hover:border-[var(--color-text-muted)]"
                  } ${
                    isCurrentlyExecuting
                      ? "animate-pulse border-[var(--color-n8n-coral)] ring-2 ring-[var(--color-n8n-coral)]/50"
                      : ""
                  }`}
                >
                  {/* Status Pip */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-md bg-[var(--color-panel-subtle)] border border-[var(--color-border)]">
                        {getIcon(node.icon)}
                      </div>
                      <span className="text-xs font-mono font-medium text-[var(--color-text-muted)]">
                        0{index + 1}
                      </span>
                    </div>

                    {node.status === "success" && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        {node.durationMs ? `${node.durationMs}ms` : "ok"}
                      </span>
                    )}
                    {isCurrentlyExecuting && (
                      <span className="text-xs font-mono font-semibold text-[var(--color-n8n-coral)] animate-pulse whitespace-nowrap shrink-0">
                        executing...
                      </span>
                    )}
                    {node.status === "idle" && (
                      <span className="text-xs font-mono text-[var(--color-text-muted)] whitespace-nowrap shrink-0">
                        idle
                      </span>
                    )}
                  </div>

                  {/* Node Name */}
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate leading-tight">
                      {node.name}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] truncate font-mono mt-0.5">
                      {node.nodeType.replace("n8n-nodes-base.", "")}
                    </p>
                  </div>

                  {/* Node Connection Port */}
                  <div className="mt-2.5 pt-2 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                    <span className="truncate text-xs font-mono">
                      {node.id === "node_hitl_gate" ? "Branch: >$10k" : "Output: main"}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        hasSucceeded
                          ? "bg-emerald-500"
                          : isCurrentlyExecuting
                          ? "bg-[var(--color-n8n-coral)] animate-ping"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                  </div>
                </div>

                {/* Connection Line Arrow (if not last node) */}
                {index < nodes.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 w-6">
                    <div
                      className={`h-0.5 w-full transition-colors ${
                        hasSucceeded
                          ? "bg-emerald-500"
                          : isCurrentlyExecuting
                          ? "bg-[var(--color-n8n-coral)]"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    />
                    <ChevronRight
                      className={`w-3.5 h-3.5 -ml-2 transition-colors ${
                        hasSucceeded
                          ? "text-emerald-500"
                          : isCurrentlyExecuting
                          ? "text-[var(--color-n8n-coral)]"
                          : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Parameter Inspector Drawer */}
      <div className="px-4 sm:px-6 py-3.5 border-t border-[var(--color-border)] bg-[var(--color-panel)] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] shrink-0">
            {getIcon(selectedNode.icon)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-[var(--color-text-primary)]">
                Selected Node: {selectedNode.name}
              </span>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                ({selectedNode.nodeType})
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
              {selectedNode.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 rounded-md bg-[var(--color-panel-subtle)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-secondary)] whitespace-nowrap shrink-0">
            {selectedNode.configSummary}
          </div>
        </div>
      </div>
    </div>
  );
}
