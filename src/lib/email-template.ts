import { GuestLead, HospitalityQuote, AiProposalPayload } from "./types";
import { SUITE_RATES, CATERING_RATES } from "./rate-engine";

export function generateBrevoHtmlEmail(
  lead: GuestLead,
  quote: HospitalityQuote,
  aiOutput: AiProposalPayload
): string {
  const suiteInfo = SUITE_RATES[lead.suiteType] || SUITE_RATES.Executive_Suite;
  const cateringInfo = CATERING_RATES[lead.cateringTier] || CATERING_RATES.Artisan_Buffet;

  const paragraphs = aiOutput.emailBody
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("Warmest regards") && !p.startsWith("Claire St-Laurent"));

  const bodyParagraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #334155;">${p.replace(
          /\n/g,
          "<br />"
        )}</p>`
    )
    .join("\n");

  const specialRequests = Array.isArray(lead.specialRequests)
    ? lead.specialRequests
    : [lead.specialRequests];

  const requestsListHtml = specialRequests
    .map(
      (req) =>
        `<li style="margin: 0 0 6px 0; color: #334155; font-size: 14px; line-height: 1.5;">${req}</li>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${aiOutput.emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px Max) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Luxury Resort Estate Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 28px; text-align: center; border-bottom: 2px solid #b45309;">
              <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #f59e0b; font-weight: 700; margin-bottom: 6px;">
                Est. 1928 • Private Estates & Reserves
              </div>
              <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase;">
                The Reserve Alpine Resort
              </div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; font-family: monospace;">
                Banff • Lake Louise • Whistler | Private Concierge Directorate
              </div>
            </td>
          </tr>

          <!-- Verified Envelope Deliverability Strip -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 10px 24px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <strong>Official Proposal Hold:</strong> <span style="font-family: monospace; color: #0f172a;">Quote #${quote.quoteId}</span>
                  </td>
                  <td align="right" style="color: #059669; font-weight: 600;">
                    ✓ 100% SPF/DKIM Verified
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Letter Body -->
          <tr>
            <td style="padding: 32px 28px 24px 28px;">
              ${bodyParagraphsHtml}

              <!-- Bespoke Hosting Specifications Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin: 24px 0; overflow: hidden;">
                <tr>
                  <td style="background-color: #0f172a; color: #ffffff; padding: 12px 18px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                    Curated Estate Specifications & Locked Rates
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px; color: #334155;">
                      <tr>
                        <td style="padding: 6px 0; color: #64748b; width: 140px;">Estate Venue:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${lead.venueLocation}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Reserved Dates:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${lead.checkInDate} to ${lead.checkOutDate} (${quote.nights} Nights)</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Distinguished Party:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${lead.headcount} Guests</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Suite Allocation:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${quote.suiteCount}x ${suiteInfo.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #64748b;">Culinary Program:</td>
                        <td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${cateringInfo.name}</td>
                      </tr>
                      <tr style="border-top: 1px solid #e2e8f0;">
                        <td style="padding: 10px 0 6px 0; font-weight: 700; color: #0f172a;">Total Quoted Investment:</td>
                        <td style="padding: 10px 0 6px 0; font-size: 16px; font-weight: 800; color: #0f172a; font-family: monospace;">$${quote.grandTotal.toLocaleString()} CAD</td>
                      </tr>
                      <tr>
                        <td style="padding: 2px 0 6px 0; color: #059669; font-weight: 600;">Advance Deposit to Hold:</td>
                        <td style="padding: 2px 0 6px 0; font-size: 14px; font-weight: 700; color: #059669; font-family: monospace;">$${quote.depositRequired.toLocaleString()} CAD (30%)</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Logistics & Concierge Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; margin: 0 0 24px 0; padding: 14px 18px;">
                <tr>
                  <td>
                    <div style="font-size: 12px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                      ✦ Pre-Coordinated Special Requests & Logistics
                    </div>
                    <ul style="margin: 0; padding-left: 18px;">
                      ${requestsListHtml}
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Interactive Call to Action Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 20px 0; text-align: center;">
                <tr>
                  <td align="center">
                    <a href="https://reservations.mountain-reserve-estates.ca/concierge/walkthrough" style="display: inline-block; background-color: #ea4b71; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(234, 75, 113, 0.3);">
                      Schedule 15-Minute Concierge Walkthrough →
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 10px;">
                    <span style="font-size: 12px; color: #64748b;">
                      Or confirm directly via master folio deposit: reservations@mountain-reserve-estates.ca
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Executive Signature Block -->
              <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">Warmest regards,</p>
                <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 8px;">
                  Claire St-Laurent
                </div>
                <div style="font-size: 13px; color: #475569; font-weight: 500;">
                  Executive Director of Luxury Sales & Guest Experience
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                  The Reserve Alpine Resort & Conference Estates • Lake Louise & Banff, AB
                </div>
                <div style="font-size: 12px; color: #ea4b71; margin-top: 4px; font-family: monospace;">
                  Direct Desk: +1 (403) 555-0199 | reservations@mountain-reserve-estates.ca
                </div>
              </div>
            </td>
          </tr>

          <!-- Legal & Compliance Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px 0;">
                This executive transmission is sent via The Reserve Alpine Estates automated hospitality dispatch (N8N Core v1.94+).
              </p>
              <p style="margin: 0;">
                © 2026 The Reserve Alpine Resort & Conference Estates Ltd. All rights reserved. • ISO 9001 Luxury Hospitality Certified
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
