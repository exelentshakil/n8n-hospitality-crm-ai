import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const signature = req.headers.get("x-n8n-hmac-sha256") || "demo_hmac_verified";

    // Simulate N8N webhook trigger processing
    return NextResponse.json({
      received: true,
      workflowId: "wf_hospitality_crm_autopilot",
      nodeId: "node_webhook",
      status: "queued",
      signatureVerified: true,
      timestamp: new Date().toISOString(),
      leadSample: {
        name: rawBody.name || rawBody.guestName || "Elena Rostova",
        email: rawBody.email || "guest@luxury-resort.ca",
        crmSource: rawBody.crmSource || "hubspot"
      }
    });
  } catch {
    return NextResponse.json(
      { received: false, error: "Invalid JSON webhook payload" },
      { status: 400 }
    );
  }
}
