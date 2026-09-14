import { GuestLead, HospitalityQuote, AiProposalPayload } from "./types";
import { SUITE_RATES, CATERING_RATES } from "./rate-engine";

interface AiRawResponse {
  emailSubject: string;
  emailBody: string;
  proposalTitle: string;
  executiveSummary: string;
  tailoredHighlights: string[];
  amenityPerks: string[];
  itineraryOverview: string;
}

export async function generateHospitalityProposal(
  lead: GuestLead,
  quote: HospitalityQuote
): Promise<AiProposalPayload> {
  const startTime = Date.now();
  const suiteInfo = SUITE_RATES[lead.suiteType] || SUITE_RATES.Executive_Suite;
  const cateringInfo = CATERING_RATES[lead.cateringTier] || CATERING_RATES.Artisan_Buffet;

  const specialRequestsList = Array.isArray(lead.specialRequests)
    ? lead.specialRequests
    : (typeof lead.specialRequests === "string" && (lead.specialRequests as string).trim().length > 0
      ? [(lead.specialRequests as string).trim()]
      : ["Dedicated concierge and executive arrival escort"]);
  const specialRequestsStr = specialRequestsList.join("; ");
  const estimatedBudgetStr = (lead.estimatedBudget || 0).toLocaleString();

  const systemPrompt = `You are Claire St-Laurent, Executive Director of Luxury Sales & Guest Experience at The Reserve Alpine Resort & Conference Estates (Banff / Lake Louise / Whistler, Canada).
You are an expert hospitality executive. A new high-value group lead has just entered the venue CRM.
Your objective is to generate an immediate, compelling executive email and customized hospitality proposal that makes the client feel valued and books the venue.

STRICT GUIDELINES:
1. Tone: Warm, poised, ultra-professional, and bespoke luxury hospitality.
2. Address the guest personally by name (${lead.guestName}) and reference their company or occasion (${lead.company || "private gathering"}).
3. Reference the exact approved venue figures without altering them:
   - Location: ${lead.venueLocation}
   - Dates: ${lead.checkInDate} to ${lead.checkOutDate} (${quote.nights} nights)
   - Party: ${lead.headcount} guests
   - Suites: ${quote.suiteCount}x ${suiteInfo.name} ($${quote.roomSubtotal.toLocaleString()} CAD)
   - Catering: ${cateringInfo.name} ($${quote.cateringSubtotal.toLocaleString()} CAD)
   - Grand Total: $${quote.grandTotal.toLocaleString()} CAD (including 18% service and 13% HST)
   - Advance Deposit to hold dates: $${quote.depositRequired.toLocaleString()} CAD
4. Highlight their special requests: ${specialRequestsStr}.
5. DO NOT invent fake extra fees. Lock to the numbers provided.
6. Return ONLY a valid JSON object with this exact schema:
{
  "emailSubject": "Compelling subject line with guest name and resort estate",
  "emailBody": "Full formatted email body with greeting, tailored narrative, value highlights, and next step with scheduling link.",
  "proposalTitle": "Formal executive proposal headline",
  "executiveSummary": "2-3 sentence executive summary of the bespoke hosting arrangement.",
  "tailoredHighlights": ["4 specific bullet points addressing their party size, suites, dining, and custom amenities"],
  "amenityPerks": ["3 complimentary luxury perks offered, e.g., private sommelier cellar tour, priority helipad transfer, dedicated estate butler"],
  "itineraryOverview": "Overview of the arrival, curated agenda, and departure schedule."
}`;

  const userPrompt = `Lead details:
Name: ${lead.guestName}
Company: ${lead.company || "Private"}
Email: ${lead.email}
Phone: ${lead.phone}
Tier: ${lead.guestTier}
Dates: ${lead.checkInDate} to ${lead.checkOutDate} (${quote.nights} nights)
Headcount: ${lead.headcount} guests
Suites: ${quote.suiteCount} ${suiteInfo.name}
Catering: ${cateringInfo.name}
AV Required: ${lead.avRequirement ? "Yes (Hybrid 4K Executive Suite)" : "Standard"}
Budget: $${estimatedBudgetStr} CAD
Calculated Quote: $${quote.grandTotal.toLocaleString()} CAD (Deposit: $${quote.depositRequired.toLocaleString()} CAD)
Special Requests: ${specialRequestsStr}
Venue: ${lead.venueLocation}`;

  // 1. Primary Provider: OpenAI GPT-4o-mini
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey && openAiKey.trim().length > 10) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as AiRawResponse;
          return {
            emailSubject: parsed.emailSubject,
            emailBody: parsed.emailBody,
            proposalTitle: parsed.proposalTitle,
            executiveSummary: parsed.executiveSummary,
            tailoredHighlights: parsed.tailoredHighlights || [],
            amenityPerks: parsed.amenityPerks || [],
            itineraryOverview: parsed.itineraryOverview || "",
            provider: "openai",
            model: "gpt-4o-mini",
            latencyMs: Date.now() - startTime,
            tokensUsed: data.usage?.total_tokens || 850
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to Gemini:", err);
    }
  }

  // 2. Fallback Provider: Google Gemini 2.0 Flash
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 10) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${systemPrompt}\n\nStrict instruction: Return ONLY raw JSON without markdown code fences or conversational text.\n\n${userPrompt}` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson) as AiRawResponse;
          return {
            emailSubject: parsed.emailSubject,
            emailBody: parsed.emailBody,
            proposalTitle: parsed.proposalTitle,
            executiveSummary: parsed.executiveSummary,
            tailoredHighlights: parsed.tailoredHighlights || [],
            amenityPerks: parsed.amenityPerks || [],
            itineraryOverview: parsed.itineraryOverview || "",
            provider: "gemini",
            model: "gemini-2.0-flash",
            latencyMs: Date.now() - startTime,
            tokensUsed: 780
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to deterministic safety engine:", err);
    }
  }

  // 3. Deterministic Safety Engine (Instant Offline Fallback)
  return getDeterministicProposal(lead, quote, Date.now() - startTime);
}

export function getDeterministicProposal(
  lead: GuestLead,
  quote: HospitalityQuote,
  latencyMs: number = 24
): AiProposalPayload {
  const suiteInfo = SUITE_RATES[lead.suiteType] || SUITE_RATES.Executive_Suite;
  const cateringInfo = CATERING_RATES[lead.cateringTier] || CATERING_RATES.Artisan_Buffet;

  return {
    emailSubject: `Exclusive Hospitality Proposal: ${lead.company || lead.guestName} at ${lead.venueLocation}`,
    emailBody: `Dear ${lead.guestName},

Thank you for contacting The Reserve Alpine Estate regarding your upcoming gathering from ${lead.checkInDate} to ${lead.checkOutDate}.

We have reserved a preferred hold on ${quote.suiteCount} ${suiteInfo.name} suites for your party of ${lead.headcount} guests. Our culinary team has prepared a tailored ${cateringInfo.name} service, with full accommodation for your requested preferences.

Your comprehensive hosting investment is locked at $${quote.grandTotal.toLocaleString()} CAD (inclusive of our 18% master service gratuity and 13% HST). To confirm these dates and secure the estate wing, a 30% advance deposit of $${quote.depositRequired.toLocaleString()} CAD is required.

Please review the complete executive proposal below. You may confirm your reservation directly or schedule a 10-minute walkthrough call with our concierge desk at your convenience.

Warmest regards,

Claire St-Laurent
Executive Director of Luxury Sales & Guest Experience
The Reserve Alpine Resort & Estates • reservations@mountain-reserve-estates.ca`,
    proposalTitle: `Bespoke Hosting & Hospitality Specification — ${lead.company || lead.guestName}`,
    executiveSummary: `An exclusive ${quote.nights}-night private estate package at ${lead.venueLocation} for ${lead.headcount} distinguished guests, featuring dedicated ${suiteInfo.name} accommodations and world-class culinary curation.`,
    tailoredHighlights: [
      `Dedicated accommodation wing: ${quote.suiteCount} private ${suiteInfo.name} suites with panoramic mountain views.`,
      `Full culinary service: ${cateringInfo.name} paired with private cellar sommelier selections.`,
      lead.avRequirement
        ? "Integrated 4K hybrid board facility with high-bandwidth fiber and dedicated on-site technician."
        : "Private lounge salon with handcrafted timber hearth and executive fireside seating.",
      `Seamless logistics: ${specialRequestsStr} arranged prior to arrival.`
    ],
    amenityPerks: [
      "Complimentary private arrival transfer and luggage escort to individual suites.",
      "Executive concierge liaison assigned exclusively to your party throughout the stay.",
      "Daily après-ski / fireside champagne reception on the private estate veranda."
    ],
    itineraryOverview: `Day 1 (${lead.checkInDate}): 15:00 Private arrival & suite check-in, 18:00 Welcome reception.\nDay 2: 08:00 Executive breakfast, 09:30 Curated program / activities, 19:00 Gala dinner.\nDay 3 (${lead.checkOutDate}): 08:30 Farewell brunch, 12:00 Luggage valet & late checkout.`,
    provider: "deterministic-fallback",
    model: "hospitality-rules-engine-v1",
    latencyMs,
    tokensUsed: 620
  };
}
