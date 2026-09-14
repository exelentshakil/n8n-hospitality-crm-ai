import { GuestLead, N8nNode } from "./types";

export const SAMPLE_GUEST_LEADS: GuestLead[] = [
  {
    id: "lead_crm_84920",
    crmSource: "hubspot",
    guestName: "Marcus Vance",
    email: "m.vance@vancetech-ventures.ca",
    phone: "+1 (416) 555-0198",
    company: "Vance Tech Ventures (Toronto, ON)",
    guestTier: "Executive_Summit",
    checkInDate: "2026-10-15",
    checkOutDate: "2026-10-18",
    nights: 3,
    headcount: 24,
    suiteType: "Executive_Suite",
    suiteCount: 16,
    cateringTier: "Michelin_Plated",
    avRequirement: true,
    specialRequests: [
      "Private board room with secure 4K hybrid AV",
      "Cellar wine pairing for closing dinner",
      "Dedicated concierge and airport Tesla transfer"
    ],
    estimatedBudget: 48000,
    venueLocation: "Lake Louise Alpine Reserve, AB",
    receivedAt: "Just now"
  },
  {
    id: "lead_crm_84921",
    crmSource: "salesforce",
    guestName: "Elena Rostova",
    email: "elena.rostova@rostovacapital.com",
    phone: "+1 (604) 555-0842",
    company: "Rostova Private Wealth Management",
    guestTier: "VIP",
    checkInDate: "2026-11-05",
    checkOutDate: "2026-11-09",
    nights: 4,
    headcount: 12,
    suiteType: "Boutique_Villa",
    suiteCount: 4,
    cateringTier: "Full_Board",
    avRequirement: false,
    specialRequests: [
      "Helicopter transfer from Vancouver harbor",
      "Private chef for mountain-side fireside dinners",
      "Gluten-free and organic seasonal foraging menu"
    ],
    estimatedBudget: 55000,
    venueLocation: "Whistler Blackcomb Private Chalet, BC",
    receivedAt: "4 mins ago"
  },
  {
    id: "lead_crm_84922",
    crmSource: "pipedrive",
    guestName: "Julian & Chloe Tremblay",
    email: "chloe.tremblay.events@gmail.com",
    phone: "+1 (514) 555-0371",
    company: "Tremblay-Gagnon Wedding Celebration",
    guestTier: "Wedding_Social",
    checkInDate: "2026-09-26",
    checkOutDate: "2026-09-28",
    nights: 2,
    headcount: 85,
    suiteType: "Deluxe_King",
    suiteCount: 35,
    cateringTier: "Cocktail_Reception",
    avRequirement: true,
    specialRequests: [
      "Ballroom terrace ceremony facing mountain ridge",
      "Presidential bridal suite upgrade included",
      "Late-night poutine and artisanal cocktail station"
    ],
    estimatedBudget: 72000,
    venueLocation: "Mont-Tremblant Manor, QC",
    receivedAt: "12 mins ago"
  },
  {
    id: "lead_crm_84923",
    crmSource: "guestline",
    guestName: "Dr. Aris Thorne",
    email: "athorne@genomix-canada.ca",
    phone: "+1 (403) 555-0144",
    company: "Canadian Genomics Institute",
    guestTier: "Corporate",
    checkInDate: "2026-10-02",
    checkOutDate: "2026-10-04",
    nights: 2,
    headcount: 40,
    suiteType: "Deluxe_King",
    suiteCount: 28,
    cateringTier: "Artisan_Buffet",
    avRequirement: true,
    specialRequests: [
      "Keynote amphitheater with dual laser projectors",
      "Dietary accommodations for vegan & halal attendees",
      "Consolidated master folio billing to institute corporate card"
    ],
    estimatedBudget: 38000,
    venueLocation: "Banff Springs Conference Estate, AB",
    receivedAt: "28 mins ago"
  }
];

export const INITIAL_N8N_NODES: N8nNode[] = [
  {
    id: "node_webhook",
    name: "CRM Webhook Trigger",
    nodeType: "n8n-nodes-base.webhook",
    description: "Listens for new customer/lead events from HubSpot, Pipedrive, Salesforce, or Guestline with HMAC SHA256 verification.",
    status: "idle",
    icon: "Webhook",
    configSummary: "POST /webhook/crm-lead • HMAC Auth: Active"
  },
  {
    id: "node_normalize",
    name: "Normalize Guest Profile",
    nodeType: "n8n-nodes-base.set",
    description: "Sanitizes phone to E.164, parses party headcount, dates, suite preference, and assigns Guest Tier classification.",
    status: "idle",
    icon: "Sliders",
    configSummary: "Transforms raw CRM payload -> Canonical GuestLead schema"
  },
  {
    id: "node_enrich",
    name: "CRM Context & History",
    nodeType: "n8n-nodes-base.httpRequest",
    description: "Queries historical PMS/CRM stays, corporate domain intelligence, and previous guest preferences.",
    status: "idle",
    icon: "Database",
    configSummary: "CRM API & PMS History query • Cache TTL 1h"
  },
  {
    id: "node_pricing",
    name: "Hospitality Rate Engine",
    nodeType: "n8n-nodes-base.code",
    description: "Deterministic rate calculator: enforces venue rate cards, seasonal multipliers, catering minimums, and 18% service charge.",
    status: "idle",
    icon: "Calculator",
    configSummary: "100% Deterministic Rule Engine • Zero Hallucinations"
  },
  {
    id: "node_ai_gen",
    name: "AI Proposal & Email Generator",
    nodeType: "n8n-nodes-base.openAi",
    description: "Dual-provider LLM (OpenAI GPT-4o-mini + Gemini fallback) writes bespoke executive email and customized hospitality proposal.",
    status: "idle",
    icon: "Sparkles",
    configSummary: "OpenAI gpt-4o-mini • Gemini 2.0 Flash Fallback"
  },
  {
    id: "node_hitl_gate",
    name: "Policy & Approval Gate",
    nodeType: "n8n-nodes-base.if",
    description: "Evaluates proposal value. Auto-approves under $10k; queues 1-click GM/Director approval for VIP bookings > $10,000.",
    status: "idle",
    icon: "ShieldAlert",
    configSummary: "Threshold: $10,000 CAD • 1-Click Approval Hook"
  },
  {
    id: "node_smtp_dispatch",
    name: "Official Domain SMTP Dispatch",
    nodeType: "n8n-nodes-base.emailSend",
    description: "Transmits verified executive email via official venue domain (Google Workspace / M365 / SMTP) with DKIM/SPF alignment.",
    status: "idle",
    icon: "Send",
    configSummary: "SMTP / Google Workspace OAuth2 • DKIM/SPF Signed"
  },
  {
    id: "node_crm_sync",
    name: "CRM Timeline & Stage Sync",
    nodeType: "n8n-nodes-base.hubspot",
    description: "Promotes deal stage to 'Proposal Sent', attaches generated proposal link to CRM timeline, and schedules 48h follow-up task.",
    status: "idle",
    icon: "CheckCircle2",
    configSummary: "Deal Stage: Proposal Dispatched • Follow-up task +48h"
  }
];

export const N8N_WORKFLOW_EXPORT_JSON = {
  name: "Hospitality CRM AI Proposal & Email Autopilot",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "crm-new-customer",
        responseMode: "onReceived",
        options: {
          rawBody: true
        }
      },
      name: "CRM Webhook Trigger",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1.1,
      position: [240, 300],
      id: "node_webhook"
    },
    {
      parameters: {
        keepOnlySet: true,
        values: {
          string: [
            { name: "guestName", value: "={{$json.body.name}}" },
            { name: "email", value: "={{$json.body.email}}" },
            { name: "company", value: "={{$json.body.company}}" },
            { name: "checkInDate", value: "={{$json.body.checkInDate}}" },
            { name: "checkOutDate", value: "={{$json.body.checkOutDate}}" },
            { name: "headcount", value: "={{$json.body.headcount}}" },
            { name: "suiteType", value: "={{$json.body.suiteType}}" }
          ]
        }
      },
      name: "Normalize Guest Profile",
      type: "n8n-nodes-base.set",
      typeVersion: 2,
      position: [460, 300],
      id: "node_normalize"
    },
    {
      parameters: {
        method: "GET",
        url: "https://api.crm-hospitality.internal/v1/guests/history",
        authentication: "predefinedCredentialType",
        sendQuery: true,
        queryParameters: {
          parameters: [
            { name: "email", value: "={{$json.email}}" }
          ]
        }
      },
      name: "CRM Context & History",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.1,
      position: [680, 300],
      id: "node_enrich"
    },
    {
      parameters: {
        jsCode: `// Deterministic Rate Calculation Engine
const lead = $input.first().json;
const nights = 3;
const suiteRates = { Presidential: 2850, Boutique_Villa: 1950, Executive_Suite: 850, Deluxe_King: 420 };
const cateringRates = { Michelin_Plated: 240, Full_Board: 295, Artisan_Buffet: 165, Cocktail_Reception: 135 };

const ratePerNight = suiteRates[lead.suiteType] || 850;
const roomSubtotal = ratePerNight * (lead.suiteCount || 10) * nights;
const cateringSubtotal = (cateringRates[lead.cateringTier] || 165) * lead.headcount * nights;
const avFee = lead.avRequirement ? 3500 : 0;
const subtotal = roomSubtotal + cateringSubtotal + avFee;
const serviceFee = subtotal * 0.18;
const tax = (subtotal + serviceFee) * 0.13;
const grandTotal = subtotal + serviceFee + tax;

return [{
  json: {
    ...lead,
    quote: {
      roomSubtotal,
      cateringSubtotal,
      avFee,
      serviceFee,
      tax,
      grandTotal,
      depositRequired: grandTotal * 0.30
    }
  }
}];`
      },
      name: "Hospitality Rate Engine",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [900, 300],
      id: "node_pricing"
    },
    {
      parameters: {
        resource: "chat",
        model: "gpt-4o-mini",
        prompt: {
          messages: [
            {
              role: "system",
              content: "You are the Executive Director of Hospitality. Draft a compelling personalized proposal and email."
            },
            {
              role: "user",
              content: "={{JSON.stringify($json)}}"
            }
          ]
        }
      },
      name: "AI Proposal & Email Generator",
      type: "n8n-nodes-base.openAi",
      typeVersion: 1.3,
      position: [1120, 300],
      id: "node_ai_gen"
    },
    {
      parameters: {
        conditions: {
          number: [
            {
              value1: "={{$json.quote.grandTotal}}",
              operation: "larger",
              value2: 10000
            }
          ]
        }
      },
      name: "Policy & Approval Gate",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [1340, 300],
      id: "node_hitl_gate"
    },
    {
      parameters: {
        fromEmail: "reservations@mountain-reserve-estates.ca",
        toEmail: "={{$json.email}}",
        subject: "={{$json.aiOutput.emailSubject}}",
        html: "={{$json.aiOutput.emailBody}}"
      },
      name: "Official Domain SMTP Dispatch",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2.1,
      position: [1560, 300],
      id: "node_smtp_dispatch"
    },
    {
      parameters: {
        operation: "update",
        dealId: "={{$json.dealId}}",
        stage: "proposal_sent",
        notes: "Automated Hospitality Proposal Dispatched via N8N Autopilot"
      },
      name: "CRM Timeline & Stage Sync",
      type: "n8n-nodes-base.hubspot",
      typeVersion: 1.2,
      position: [1780, 300],
      id: "node_crm_sync"
    }
  ],
  connections: {
    "CRM Webhook Trigger": {
      main: [[{ node: "Normalize Guest Profile", type: "main", index: 0 }]]
    },
    "Normalize Guest Profile": {
      main: [[{ node: "CRM Context & History", type: "main", index: 0 }]]
    },
    "CRM Context & History": {
      main: [[{ node: "Hospitality Rate Engine", type: "main", index: 0 }]]
    },
    "Hospitality Rate Engine": {
      main: [[{ node: "AI Proposal & Email Generator", type: "main", index: 0 }]]
    },
    "AI Proposal & Email Generator": {
      main: [[{ node: "Policy & Approval Gate", type: "main", index: 0 }]]
    },
    "Policy & Approval Gate": {
      main: [
        [{ node: "Official Domain SMTP Dispatch", type: "main", index: 0 }],
        [{ node: "Official Domain SMTP Dispatch", type: "main", index: 0 }]
      ]
    },
    "Official Domain SMTP Dispatch": {
      main: [[{ node: "CRM Timeline & Stage Sync", type: "main", index: 0 }]]
    }
  }
};
