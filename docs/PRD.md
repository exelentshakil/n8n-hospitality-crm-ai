# Product Requirements Document (PRD)
## N8N AI Automation Pipeline for Hospitality CRM & Automated Proposal Engine

### Executive Summary & Vision
High-value hospitality and event operations (luxury boutique hotels, mountain resorts, banquet facilities, and corporate retreat venues) lose up to 50% of inbound group inquiries because traditional sales desks take 12 to 24 hours to manually enrich guest records, consult rate books, draft custom proposals, and reply.

This system delivers an end-to-end event-driven **N8N workflow automation engine** that triggers the moment a new guest lead lands in the venue's CRM (HubSpot, Pipedrive, Salesforce, Guestline, or Mews). Within **45 seconds**, the pipeline:
1. Normalizes the guest identity and validates webhook signatures.
2. Enriches corporate background, group headcount, event dates, and historical stay preferences.
3. Computes 100% deterministic room/suite rates, banquet minimums, hospitality taxes, and deposit schedules.
4. Generates a tailored, compelling executive proposal and personalized sales email using a dual-provider LLM chain (OpenAI GPT-4o-mini + Google Gemini 2.0 Flash fallback).
5. Provides an optional Human-in-the-Loop (HITL) approval gate for high-ticket bookings (> $10,000).
6. Dispatches directly through the venue's official domain via authenticated SMTP / Google Workspace / Microsoft 365 with full DKIM/SPF alignment.
7. Logs the interaction, proposal PDF link, and updates CRM deal stages automatically.

---

### The Defensibility Hook (Core Architectural Principle)
> **"Your pricing database and inventory rate card dictate the quote and deposit schedule with 100% mathematical precision—the AI only writes the personalized narrative and compelling executive proposal around approved venue figures, with an automated 1-click review gate for high-ticket bookings before official SMTP dispatch."**

The non-deterministic layer (LLM narrative generation) is strictly separated from the deterministic layer (room pricing, catering minimums, seasonal multipliers, and tax calculations). AI hallucinations can never result in unauthorized pricing or unapproved terms being sent from official executive mailboxes.

---

### User Personas & Stakeholders
1. **Director of Hospitality Sales / GM**: Needs rapid, flawless response times to capture corporate retreats, weddings, and executive summits before competitors reply.
2. **Event & Group Sales Coordinators**: Spends 3+ hours daily on repetitive proposal drafting; needs an automated copilot that pre-builds 95% of the proposal and handles routine inquiries autonomously.
3. **Inquiring Guest / Corporate Meeting Planner**: Expects immediate, highly detailed, transparent options tailored to their specific party size, dietary needs, and VIP amenities.
4. **Systems Administrator / IT**: Demands zero-lockin self-hosted or cloud N8N workflows, audit logs, webhook signature verification, and official domain reputation protection.

---

### Scope of Work

#### In-Scope (Phase 0 & Production Engine)
- **CRM Webhook Ingestion & Poller**: Multi-CRM adapters (HubSpot, Pipedrive, Salesforce, webhook triggers) with payload validation and deduplication.
- **Guest Context Retrieval & Enrichment**: Historical CRM lookup, corporate domain analysis, guest tier tagging (VIP, Corporate, Wedding/Social, Executive Summit).
- **Deterministic Rate & Availability Engine**: Structured hospitality pricing matrix (suite tiers, catering per-person minimums, audio-visual packages, seasonal rates, deposit milestones).
- **Dual-Provider AI Narrative Engine**: OpenAI `gpt-4o-mini` primary with Google Gemini `gemini-2.0-flash` fallback and deterministic local safety engine.
- **Dual Output Generation**:
  - Executive email (warm, tailored luxury hospitality tone, personalized value propositions, calendar booking CTA).
  - Formal hospitality proposal (interactive web viewer & formatted PDF export with room blocks, catering breakdown, and payment terms).
- **Human-in-the-Loop (HITL) Review Gate**: Automatic threshold routing (e.g. leads under $10,000 auto-send; leads over $10,000 queue for 1-click email/Slack approval).
- **Official Domain SMTP Dispatch**: Seamless integration with Google Workspace, Microsoft 365, or dedicated SMTP relays (Resend/SendGrid) with DKIM/SPF alignment.
- **Bi-Directional CRM Timeline Sync**: Automatic deal stage promotion (`Lead Ingested` -> `Proposal Generated` -> `Proposal Dispatched`), activity notes, and scheduled 48h follow-up task.
- **Interactive N8N Visual Workflow Canvas**: Visual node graph simulator with real-time execution telemetry and exportable workflow JSON.

#### Out-of-Scope (Deferred to Phase 2/3)
- Direct payment gateway processing inside the email (handled via integrated invoice links).
- Physical PBX phone routing (SMS/WhatsApp notification add-ons available in Phase 2).

---

### Data Models & Schemas

#### 1. `GuestLead`
```typescript
interface GuestLead {
  id: string;
  crmSource: "hubspot" | "pipedrive" | "salesforce" | "webhook";
  guestName: string;
  email: string;
  phone: string;
  company?: string;
  guestTier: "VIP" | "Corporate" | "Wedding_Social" | "Executive_Summit";
  checkInDate: string;
  checkOutDate: string;
  headcount: number;
  suiteType: "Presidential" | "Executive_Suite" | "Deluxe_King" | "Boutique_Villa";
  cateringTier: "Artisan_Buffet" | "Michelin_Plated" | "Cocktail_Reception" | "Full_Board";
  specialRequests: string[];
  estimatedBudget: number;
}
```

#### 2. `HospitalityQuote` (Deterministic)
```typescript
interface HospitalityQuote {
  quoteId: string;
  roomSubtotal: number;
  cateringSubtotal: number;
  avServices: number;
  serviceCharge: number; // 18% standard hospitality
  taxAmount: number;     // 13% HST/GST
  grandTotal: number;
  depositRequired: number; // 25% to 50%
  balanceDueDays: number;
  currency: "CAD" | "USD";
  rateCardVersion: string;
}
```

#### 3. `N8nWorkflowExecution`
```typescript
interface N8nWorkflowExecution {
  executionId: string;
  timestamp: string;
  leadId: string;
  status: "success" | "running" | "hitl_pending" | "failed";
  durationMs: number;
  nodesExecuted: Array<{
    nodeId: string;
    nodeName: string;
    status: "success" | "warning" | "error";
    durationMs: number;
    outputSample?: Record<string, unknown>;
  }>;
  aiTelemetry: {
    provider: "openai" | "gemini" | "deterministic-fallback";
    model: string;
    latencyMs: number;
    tokensUsed: number;
  };
}
```

---

### The 8-Node N8N Workflow Execution Pipeline

```
[ Node 1: CRM Webhook Trigger ]
          │ (HMAC Verified Payload)
          ▼
[ Node 2: Guest Identity & Dedup ]
          │ (Normalized Profile)
          ▼
[ Node 3: CRM Context & Domain Enrichment ]
          │ (Guest History + Corporate Profile)
          ▼
[ Node 4: Inventory & Rate Engine (Deterministic) ]
          │ (Locked Room & Banquet Calculations)
          ▼
[ Node 5: Dual-Provider AI Proposal Generator ]
          │ (OpenAI GPT-4o-mini / Gemini 2.0 Flash)
          ▼
[ Node 6: Policy & Human Review Gate ]
          ├── (Grand Total > $10k) ──> [ 1-Click Approval Hold ]
          └── (Standard Tier)       ──┐
                                     ▼
[ Node 7: Official Domain SMTP Dispatch ]
          │ (SPF/DKIM Signed MIME Email)
          ▼
[ Node 8: Bi-Directional CRM Sync & Task Set ]
```

---

### Non-Functional Requirements & Security
1. **Response Time SLA**: Under 45 seconds from CRM event creation to official email dispatch.
2. **Uptime & Fault Tolerance**: 99.9% uptime with dual-provider LLM failover and automatic webhook retry mechanics with exponential backoff.
3. **Domain Protection**: Rate-limiting to prevent outbound spam flags; strict RFC 5322 compliance and SPF/DKIM verification.
4. **Data Isolation**: Multi-tenant guest data encrypted in transit (TLS 1.3) and at rest (AES-256).

---

### Acceptance Criteria (Mapped to Client Brief)
- [x] **Trigger on new customer entry**: Listens to CRM webhooks or polled lead entries in real-time.
- [x] **Process customer & retrieve relevant info**: Extracts guest count, preferred suites, dates, corporate context, and dietary notes.
- [x] **Generate compelling email & proposal**: Dual-provider AI writes bespoke, executive-level correspondence with itemized hospitality proposals.
- [x] **Send through official email**: Outbound dispatch via verified official domain SMTP/OAuth2 with branded layout.
- [x] **Demonstrated ability to handle quickly & efficiently**: Live working demo, instant visual pipeline simulator, and downloadable N8N JSON workflow.
