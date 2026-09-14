import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAi = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
  const hasSupabase = Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);

  return NextResponse.json({
    status: "healthy",
    engine: "N8N Hospitality CRM AI Orchestrator v1.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    providers: {
      openai: {
        active: hasOpenAi,
        model: "gpt-4o-mini",
        role: "Primary Inference Engine"
      },
      gemini: {
        active: hasGemini,
        model: "gemini-2.0-flash",
        role: "Sub-Second Failover Engine"
      },
      deterministicFallback: {
        active: true,
        model: "hospitality-rules-engine-v1",
        role: "100% Offline Regulatory & Math Lock"
      }
    },
    integrations: {
      crmWebhooks: ["HubSpot", "Pipedrive", "Salesforce", "Guestline", "Mews"],
      emailDispatch: "SMTP / Google Workspace / M365 (DKIM/SPF)",
      storage: hasSupabase ? "Supabase PostgreSQL Active" : "In-Memory Session Engine"
    }
  });
}
