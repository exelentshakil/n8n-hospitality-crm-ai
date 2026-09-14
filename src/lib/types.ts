export type CRMProvider = "hubspot" | "pipedrive" | "salesforce" | "guestline" | "webhook";

export type GuestTier = "VIP" | "Corporate" | "Wedding_Social" | "Executive_Summit";

export type SuiteType = "Presidential" | "Executive_Suite" | "Deluxe_King" | "Boutique_Villa";

export type CateringTier = "Artisan_Buffet" | "Michelin_Plated" | "Cocktail_Reception" | "Full_Board";

export interface GuestLead {
  id: string;
  crmSource: CRMProvider;
  guestName: string;
  email: string;
  phone: string;
  company?: string;
  guestTier: GuestTier;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  headcount: number;
  suiteType: SuiteType;
  suiteCount: number;
  cateringTier: CateringTier;
  avRequirement: boolean;
  specialRequests: string[];
  estimatedBudget: number;
  venueLocation: string;
  receivedAt: string;
}

export interface HospitalityQuote {
  quoteId: string;
  suiteRatePerNight: number;
  suiteCount: number;
  nights: number;
  roomSubtotal: number;
  cateringPerPerson: number;
  headcount: number;
  cateringSubtotal: number;
  avPackageFee: number;
  subtotalBeforeTax: number;
  serviceCharge: number; // 18% standard luxury hospitality fee
  taxAmount: number;     // 13% Harmonized Sales Tax (HST)
  grandTotal: number;
  depositRequired: number; // 30% advance retainer
  balanceDueDays: number;
  currency: "CAD" | "USD";
  rateCardVersion: string;
  basis: {
    roomBasis: string;
    cateringBasis: string;
    serviceFeeBasis: string;
    taxBasis: string;
  };
}

export type N8nNodeId =
  | "node_webhook"
  | "node_normalize"
  | "node_enrich"
  | "node_pricing"
  | "node_ai_gen"
  | "node_hitl_gate"
  | "node_smtp_dispatch"
  | "node_crm_sync";

export interface N8nNode {
  id: N8nNodeId;
  name: string;
  nodeType: string;
  description: string;
  status: "idle" | "running" | "success" | "warning" | "error";
  durationMs?: number;
  icon: string;
  configSummary: string;
  outputData?: Record<string, unknown>;
}

export interface AiProposalPayload {
  emailSubject: string;
  emailBody: string;
  proposalTitle: string;
  executiveSummary: string;
  tailoredHighlights: string[];
  amenityPerks: string[];
  itineraryOverview: string;
  provider: "openai" | "gemini" | "deterministic-fallback";
  model: string;
  latencyMs: number;
  tokensUsed: number;
  rawProposalMarkdown?: string;
}

export interface PipelineExecutionResult {
  executionId: string;
  lead: GuestLead;
  quote: HospitalityQuote;
  aiOutput: AiProposalPayload;
  totalDurationMs: number;
  nodes: N8nNode[];
  hitlTriggered: boolean;
  hitlApproved: boolean;
  emailDispatched: boolean;
  crmSynced: boolean;
  timestamp: string;
}
