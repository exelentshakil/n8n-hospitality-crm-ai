import { NextRequest, NextResponse } from "next/server";
import { GuestLead } from "@/lib/types";
import { calculateHospitalityQuote } from "@/lib/rate-engine";
import { generateHospitalityProposal } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const lead: GuestLead = body.lead;

    if (!lead || !lead.guestName || !lead.checkInDate) {
      return NextResponse.json(
        { success: false, error: "Invalid guest lead payload" },
        { status: 400 }
      );
    }

    // Step 1: 100% Deterministic rate calculation
    const quote = calculateHospitalityQuote(lead);

    // Step 2: Dual-provider AI proposal and email narrative generation
    const aiOutput = await generateHospitalityProposal(lead, quote);

    return NextResponse.json({
      success: true,
      lead,
      quote,
      aiOutput,
      executionTimeMs: Date.now() - start
    });
  } catch (err: unknown) {
    console.error("Proposal generation route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal pipeline error"
      },
      { status: 500 }
    );
  }
}
