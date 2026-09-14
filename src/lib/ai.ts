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

function formatSpecialRequests(specialRequests: unknown): string {
  const list = Array.isArray(specialRequests)
    ? specialRequests
    : (typeof specialRequests === "string" && specialRequests.trim().length > 0
      ? [specialRequests.trim()]
      : ["Dedicated concierge and executive arrival escort"]);
  return list.join("; ");
}

export function cleanMarkdownFromText(text: string): string {
  if (!text) return "";
  return text
    // Replace markdown links [Label](#) or [Label](url) with clean readable text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
      if (url === "#" || url.startsWith("#") || url.toLowerCase().includes("schedule")) {
        return `${label}: https://reservations.mountain-reserve-estates.ca/concierge/walkthrough`;
      }
      return `${label} (${url})`;
    })
    // Remove bold/italic markdown asterisks: **text** -> text, *text* -> text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    // Replace bullet points like "- **Label:** text" with clean prose bullet
    .replace(/^[ \t]*[-*][ \t]+/gm, "• ")
    // Clean headers like "### Heading" -> "Heading"
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "")
    // Normalize excessive newlines
    .replace(/\n{3,}/g, "\n\n");
}

export async function generateHospitalityProposal(
  lead: GuestLead,
  quote: HospitalityQuote
): Promise<AiProposalPayload> {
  const startTime = Date.now();
  const suiteInfo = SUITE_RATES[lead.suiteType] || SUITE_RATES.Executive_Suite;
  const cateringInfo = CATERING_RATES[lead.cateringTier] || CATERING_RATES.Artisan_Buffet;

  const specialRequestsStr = formatSpecialRequests(lead.specialRequests);
  const estimatedBudgetStr = (lead.estimatedBudget || 0).toLocaleString();

  const systemPrompt = `You are Claire St-Laurent, Executive Director of Luxury Sales & Guest Experience at The Reserve Alpine Resort & Conference Estates (Banff / Lake Louise / Whistler, Canada).
You are an expert luxury hospitality executive. A high-value group lead has just entered the venue CRM.
Your objective is to generate an immediate, compelling, bespoke executive email and customized hospitality proposal that makes the client feel deeply valued and books the venue.

STRICT COPYWRITING RULES FOR emailBody:
1. Tone: Warm, poised, articulate, and bespoke luxury hospitality (caliber of Four Seasons, Aman, or Ritz-Carlton Reserve).
2. ABSOLUTELY NO RAW MARKDOWN SYNTAX in emailBody:
   - NEVER use asterisks (do NOT use **bold** or *italic*).
   - NEVER use markdown bullet characters (- or * or #).
   - NEVER use raw markdown links like [Schedule a Call](#).
   - Write in flowing, elegant, fully articulated prose paragraphs separated by clean double line-breaks.
3. Specific Narrative Structure for emailBody:
   - Salutation: "Dear ${lead.guestName},"
   - Opening: Gracious personal acknowledgment of their inquiry for ${lead.company || "their gathering"} at ${lead.venueLocation} from ${lead.checkInDate} to ${lead.checkOutDate}.
   - Accommodations & Culinary: Detail holding ${quote.suiteCount} private ${suiteInfo.name} suites for their party of ${lead.headcount} guests, paired with ${cateringInfo.name}.
   - Special Logistics: Seamlessly address their exact requests (${specialRequestsStr}) with executive concierge assurance.
   - Investment Locking: State the comprehensive hosting investment of $${quote.grandTotal.toLocaleString()} CAD (inclusive of 18% master service gratuity and 13% HST) and the 30% advance deposit ($${quote.depositRequired.toLocaleString()} CAD) required to secure the estate hold.
   - Walkthrough Invitation: Explicitly provide the direct concierge walkthrough link: https://reservations.mountain-reserve-estates.ca/concierge/walkthrough
   - Formal Sign-off:
Warmest regards,

Claire St-Laurent
Executive Director of Luxury Sales & Guest Experience
The Reserve Alpine Resort & Estates • reservations@mountain-reserve-estates.ca
Direct Concierge Desk: +1 (403) 555-0199

4. Return ONLY a valid JSON object with this exact schema:
{
  "emailSubject": "Compelling luxury subject line with guest name and resort estate",
  "emailBody": "Full articulated prose email body adhering strictly to the copywriting rules above.",
  "proposalTitle": "Formal executive proposal headline",
  "executiveSummary": "2-3 sentence executive summary of the bespoke hosting arrangement.",
  "tailoredHighlights": ["4 specific bullet points addressing party size, suites, dining, and custom amenities"],
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
            emailBody: cleanMarkdownFromText(parsed.emailBody),
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
            emailBody: cleanMarkdownFromText(parsed.emailBody),
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
  const specialRequestsStr = formatSpecialRequests(lead.specialRequests);
  const companyMention = lead.company ? `for ${lead.company}` : "for your private gathering";

  return {
    emailSubject: `Exclusive Hospitality Proposal: ${lead.company || lead.guestName} at The Reserve Alpine Estate`,
    emailBody: `Dear ${lead.guestName},

Thank you for contacting The Reserve Alpine Estate. It is our distinct pleasure to present this tailored hosting specification ${companyMention} from ${lead.checkInDate} through ${lead.checkOutDate}.

We have placed an exclusive priority hold on ${quote.suiteCount} ${suiteInfo.name} suites to accommodate your party of ${lead.headcount} guests in complete comfort and mountain-view privacy. Our culinary director has curated a bespoke ${cateringInfo.name} program, featuring sommelier cellar pairings and customized seasonal menus prepared specifically for your party.

Regarding your requested accommodations, our executive concierge desk has pre-coordinated every logistical detail: ${specialRequestsStr}. Your group will be escorted by dedicated arrival valets and provided with a designated estate liaison available around the clock throughout your ${quote.nights}-night stay.

Your comprehensive hosting investment is locked at $${quote.grandTotal.toLocaleString()} CAD, which fully includes all private suites, bespoke dining curation, our 18% master service gratuity, and 13% HST. To guarantee these preferred dates and secure the estate wing, a 30% advance deposit of $${quote.depositRequired.toLocaleString()} CAD is required upon confirmation.

To review the master specifications, request tailored culinary adjustments, or schedule a 15-minute executive walkthrough call with our concierge desk at your convenience, please reserve a time directly:
https://reservations.mountain-reserve-estates.ca/concierge/walkthrough

We look forward to welcoming you and your distinguished guests to an exceptional alpine retreat.

Warmest regards,

Claire St-Laurent
Executive Director of Luxury Sales & Guest Experience
The Reserve Alpine Resort & Estates • reservations@mountain-reserve-estates.ca
Direct Liaison Desk: +1 (403) 555-0199`,
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
