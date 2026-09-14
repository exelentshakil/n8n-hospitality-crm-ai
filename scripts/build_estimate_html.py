import os
import base64
import subprocess
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
docs_dir = os.path.abspath(os.path.join(script_dir, "..", "docs"))
html_path = os.path.join(docs_dir, "estimate.html")
pdf_path = os.path.join(docs_dir, "ESTIMATE.pdf")

with open(os.path.join(docs_dir, "headshot.jpeg"), "rb") as f:
    headshot_b64 = base64.b64encode(f.read()).decode("utf-8")

with open(os.path.join(docs_dir, "logo.png"), "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Production Scope & Formal Estimate - N8N AI Hospitality CRM Automation Hub</title>
  <style>
    @page {{
      size: letter portrait;
      margin: 6mm 8.5mm 6mm 8.5mm;
    }}
    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    html, body {{
      margin: 0;
      padding: 0;
      height: 100%;
      background: #ffffff;
      overflow: hidden;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.34;
      font-size: 9.8px;
    }}

    .page-container {{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      box-sizing: border-box;
    }}

    /* 1. Executive Header */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 6px;
    }}
    .header-left {{
      flex: 1;
      min-width: 0;
    }}
    .brand-title {{
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #2563eb;
      margin-bottom: 2px;
    }}
    h1 {{
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }}
    .subtitle {{
      font-size: 8.8px;
      color: #475569;
      margin: 0;
      line-height: 1.25;
    }}
    .meta-card {{
      flex-shrink: 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 8.5px;
      text-align: right;
      line-height: 1.38;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }}
    .meta-card strong {{
      color: #0f172a;
    }}
    .live-badge {{
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 9999px;
      font-size: 8px;
      text-transform: uppercase;
      margin-left: 3px;
    }}

    /* 2. Scope Table */
    .section-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }}
    .section-title {{
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1e293b;
      border-left: 3px solid #2563eb;
      padding-left: 6px;
      margin: 0;
    }}
    .section-meta {{
      font-size: 8.5px;
      color: #64748b;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8.5px;
      letter-spacing: 0.04em;
      border: 1px solid #cbd5e1;
      padding: 4px 6px;
      text-align: left;
    }}
    td {{
      border: 1px solid #e2e8f0;
      padding: 5px 6px;
      font-size: 8.8px;
      vertical-align: top;
    }}
    .phase-num {{
      font-weight: 800;
      color: #1e293b;
      font-size: 8.8px;
      white-space: nowrap;
    }}
    .phase-name {{
      font-weight: 700;
      color: #0f172a;
      font-size: 9.2px;
    }}
    .phase-desc {{
      color: #475569;
      font-size: 8px;
      margin-top: 1px;
      line-height: 1.24;
    }}
    .phase-0-row {{
      background: #f0fdf4;
    }}
    .phase-0-badge {{
      color: #15803d;
      font-weight: 800;
    }}
    .total-row {{
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      border: 1px solid #0f172a;
    }}
    .total-row td {{
      border: 1px solid #0f172a;
      padding: 5.5px 6px;
      font-size: 9.2px;
    }}

    /* 3. 2-Column Grid */
    .grid-2col {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
    }}
    .card-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 6.5px 9px;
    }}
    .card-box-title {{
      font-size: 8.8px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #1e293b;
      margin: 0 0 3.5px 0;
      display: flex;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2.5px;
    }}
    .milestone-item {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
      border-bottom: 1px dotted #cbd5e1;
      padding: 2.5px 0;
      font-size: 8px;
    }}
    .milestone-item:last-child {{
      border-bottom: none;
      padding-bottom: 0;
    }}
    .milestone-name {{
      color: #334155;
    }}
    .milestone-val {{
      font-weight: 800;
      color: #0f172a;
      font-family: ui-monospace, monospace;
      white-space: nowrap;
    }}
    .guardrail-item {{
      font-size: 8px;
      color: #334155;
      margin-bottom: 2.5px;
      padding-left: 10px;
      position: relative;
      line-height: 1.22;
    }}
    .guardrail-item:last-child {{
      margin-bottom: 0;
    }}
    .guardrail-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 800;
      font-size: 7.5px;
    }}

    /* 4. Commercial Terms Section */
    .terms-box {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      padding: 6.5px 9px;
    }}
    .terms-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }}
    .term-col {{
      font-size: 7.8px;
      line-height: 1.22;
    }}
    .term-title {{
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      font-size: 7.8px;
      margin-bottom: 1.5px;
    }}
    .term-body {{
      color: #475569;
    }}

    /* 5. Formal Acceptance Authorization Block */
    .auth-block {{
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: #f8fafc;
      padding: 7px 11px;
    }}
    .auth-title {{
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2.5px;
    }}
    .auth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }}
    .auth-party {{
      display: flex;
      flex-direction: column;
      gap: 2.5px;
      font-size: 8px;
    }}
    .auth-party-title {{
      font-weight: 700;
      color: #334155;
      text-transform: uppercase;
      font-size: 7.8px;
      margin-bottom: 1px;
    }}
    .auth-sign-line {{
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-top: 4px;
    }}
    .auth-sign-field {{
      flex: 1;
      border-bottom: 1.2px solid #475569;
      min-height: 26px;
      display: flex;
      align-items: flex-end;
      font-family: "Brush Script MT", "Caveat", cursive, sans-serif;
      font-size: 14px;
      color: #1e3a8a;
      padding-left: 4px;
      padding-bottom: 1px;
    }}
    .auth-date-field {{
      width: 75px;
      border-bottom: 1.2px solid #475569;
      min-height: 26px;
      font-family: ui-monospace, monospace;
      font-size: 8.2px;
      color: #334155;
      text-align: center;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding-bottom: 1px;
    }}
    .auth-label {{
      font-size: 7px;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1.5px;
    }}

    /* 6. Executive Signature Footer */
    .footer-container {{
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 6px 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }}
    .footer-founder {{
      display: flex;
      align-items: center;
      gap: 9px;
      flex: 1;
      min-width: 0;
    }}
    .founder-avatar {{
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid #2563eb;
      box-shadow: 0 1px 3px rgba(37,99,235,0.15);
      flex-shrink: 0;
    }}
    .founder-info {{
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }}
    .founder-name {{
      font-size: 8.8px;
      color: #0f172a;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-name strong {{
      color: #0f172a;
      font-weight: 800;
    }}
    .founder-company {{
      font-size: 8px;
      color: #334155;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .founder-company strong {{
      color: #1e293b;
      font-weight: 700;
    }}
    .founder-sub {{
      font-size: 7.5px;
      color: #475569;
      line-height: 1.18;
      white-space: nowrap;
    }}
    .footer-brand {{
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2.5px;
      flex-shrink: 0;
    }}
    .business-logo {{
      height: 17px;
      width: auto;
      object-fit: contain;
    }}
    .demo-badge {{
      font-size: 7.6px;
      color: #1d4ed8;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 1.5px 5px;
      border-radius: 3px;
      font-weight: 700;
      font-family: ui-monospace, monospace;
      text-decoration: none;
      white-space: nowrap;
    }}
  </style>
</head>
<body>
<div class="page-container">
  <!-- 1. Executive Header -->
  <div class="header">
    <div class="header-left">
      <div class="brand-title">BarakahSoft LLC • Enterprise Systems Engineering • Ref #BS-2026-N8N-041</div>
      <h1>N8N AI Hospitality CRM Automation Hub</h1>
      <p class="subtitle">Autonomous Lead Ingestion, Deterministic Rate Cards, Dual-Provider LLM Proposal Generation & Official SMTP Dispatch</p>
    </div>
    <div class="meta-card">
      <div><strong>Client:</strong> Hospitality CRM Automation Lead • Canada</div>
      <div><strong>Timeline:</strong> 10–14 Business Days (Modular Cadence)</div>
      <div><strong>Calibrated Rate:</strong> <strong>$40.00 / hr (Turnkey Package: $2,120.00)</strong></div>
      <div><strong>Live Prototype:</strong> <span class="live-badge">Verified & Audited</span></div>
    </div>
  </div>

  <!-- 2. Scope Table -->
  <div class="scope-block">
    <div class="section-header">
      <h2 class="section-title">Milestone Scope & Delivery Schedule</h2>
      <div class="section-meta">Live Demo: https://n8n-hospitality-crm-ai.vercel.app</div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 13%;">Phase</th>
          <th style="width: 55%;">Engineering Deliverables & Architecture</th>
          <th style="width: 10%; text-align: center;">Hours</th>
          <th style="width: 10%; text-align: right;">Rate</th>
          <th style="width: 12%; text-align: right;">Investment</th>
        </tr>
      </thead>
      <tbody>
        <tr class="phase-0-row">
          <td class="phase-num"><span class="phase-0-badge">Phase 0</span></td>
          <td>
            <div class="phase-name">Interactive Working Architecture Prototype & N8N Canvas</div>
            <div class="phase-desc">Interactive 8-node visual workflow canvas, 100% deterministic rate calculator, dual LLM inference (GPT-4o-mini + Gemini 2.0 Flash), official email preview with DKIM/SPF badges, and exportable JSON schema. Delivered upfront in &lt;30m.</div>
          </td>
          <td style="text-align: center; font-weight: 700; white-space: nowrap;">0.5 hrs (&lt;30m)</td>
          <td style="text-align: right; color: #16a34a; font-weight: 700;">$0.00</td>
          <td style="text-align: right; font-weight: 800; color: #16a34a;">$0.00 (Live)</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 1</td>
          <td>
            <div class="phase-name">CRM Webhook Ingestion & Context Retrieval</div>
            <div class="phase-desc">Inbound webhook listeners for HubSpot, Pipedrive, Salesforce, and Guestline with HMAC SHA256 verification, payload deduplication queue, historical guest profile lookup, and corporate domain enrichment.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">13 hrs</td>
          <td style="text-align: right;">$40.00</td>
          <td style="text-align: right; font-weight: 700;">$520.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 2</td>
          <td>
            <div class="phase-name">N8N Workflow Architecture & Rate Rules Engine</div>
            <div class="phase-desc">Production N8N deployment (Docker or N8N Cloud), deterministic suite, banquet, and catering math calculation nodes, 18% service gratuity and 13% HST tax rule locks, with exponential retry queues and alerting.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">15 hrs</td>
          <td style="text-align: right;">$40.00</td>
          <td style="text-align: right; font-weight: 700;">$600.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 3</td>
          <td>
            <div class="phase-name">Dual-Provider LLM Proposal & Official SMTP Dispatch</div>
            <div class="phase-desc">Hospitality-tailored prompt engineering, automated executive proposal generation (formatted PDF attachment), and official email dispatch via Google Workspace / Microsoft 365 OAuth2 with 100% DKIM, SPF, and DMARC alignment.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">14 hrs</td>
          <td style="text-align: right;">$40.00</td>
          <td style="text-align: right; font-weight: 700;">$560.00</td>
        </tr>
        <tr>
          <td class="phase-num">Phase 4</td>
          <td>
            <div class="phase-name">Human-in-the-Loop Gate, CRM Sync & Production Launch</div>
            <div class="phase-desc">1-Click Director review gate for high-ticket bookings (&gt;$10k), bi-directional CRM stage sync (Promote to 'Proposal Dispatched'), automated 48-hour follow-up task creation, runbook, and 14 days post-launch hypercare.</div>
          </td>
          <td style="text-align: center; font-weight: 600;">11 hrs</td>
          <td style="text-align: right;">$40.00</td>
          <td style="text-align: right; font-weight: 700;">$440.00</td>
        </tr>
        <tr class="total-row">
          <td colspan="2" style="text-align: left; font-weight: 800;">TOTAL COMPLETE TURNKEY ROLLOUT (ALL PHASES + STAGING)</td>
          <td style="text-align: center; font-weight: 800;">53 hrs</td>
          <td style="text-align: right; font-weight: 800;">$40.00</td>
          <td style="text-align: right; font-weight: 800;">$2,120.00</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 3. 2-Column Milestone & Architecture Grid -->
  <div class="grid-2col">
    <!-- Modular Milestone Options Box -->
    <div class="card-box">
      <div class="card-box-title">Modular Milestone Options (Fixed-Price Flexibility)</div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option A:</strong> Core Autonomous N8N Pipeline (Phases 1–3)</span>
        <span class="milestone-val">$1,680.00 (42 hrs)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option B:</strong> Webhooks & Rate Engine Only (Phases 1–2)</span>
        <span class="milestone-val">$1,120.00 (28 hrs)</span>
      </div>
      <div class="milestone-item">
        <span class="milestone-name"><strong>Option C:</strong> Complete Turnkey Hospitality Suite (All Phases 1–4)</span>
        <span class="milestone-val">$2,120.00 (53 hrs)</span>
      </div>
    </div>

    <!-- Zero-Risk Compliance Guardrails Box -->
    <div class="card-box">
      <div class="card-box-title">Architecture Guardrails & Performance Guarantees</div>
      <div class="guardrail-item"><strong>100% Deterministic Rate Locks:</strong> Pricing, catering minimums, and HST taxes are calculated by mathematical rules. The AI never invents numbers.</div>
      <div class="guardrail-item"><strong>Dual-Provider LLM Redundancy:</strong> OpenAI GPT-4o-mini primary with automatic sub-second failover to Google Gemini 2.0 Flash for 99.8% uptime.</div>
      <div class="guardrail-item"><strong>Official Domain Deliverability:</strong> Direct OAuth2 / authenticated SMTP integration with verified DKIM/SPF ensures emails never land in spam.</div>
    </div>
  </div>

  <!-- 4. Commercial Terms & Conditions -->
  <div class="terms-box">
    <div class="card-box-title" style="margin-bottom: 3.5px;">Commercial Terms & Production Engagement Conditions</div>
    <div class="terms-grid">
      <div class="term-col">
        <div class="term-title">Escrow Milestones</div>
        <div class="term-body">100% milestone-based on Upwork. Funds deposited in escrow per phase and released strictly upon verified staging sign-off.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Full IP Ownership</div>
        <div class="term-body">Complete copyright, source code, N8N JSON workflows, and environment configurations transfer to Client.</div>
      </div>
      <div class="term-col">
        <div class="term-title">14-Day Hypercare SLA</div>
        <div class="term-body">Includes 14 days of complimentary post-deployment monitoring, webhook audit trails, and priority bug resolution at zero cost.</div>
      </div>
      <div class="term-col">
        <div class="term-title">Quote Validity</div>
        <div class="term-body">Valid for 30 days through October 14, 2026. Turnkey fixed price of $2,120.00 covers all specified deliverables without hidden fees.</div>
      </div>
    </div>
  </div>

  <!-- 5. Formal Acceptance Authorization -->
  <div class="auth-block">
    <div class="auth-title">
      <span>Formal Authorization & Engagement Acceptance</span>
      <span style="font-weight: 500; font-size: 7.4px; color: #475569;">Binding upon signature by authorized representatives</span>
    </div>
    <div class="auth-grid">
      <div class="auth-party">
        <div class="auth-party-title">Authorized Provider: BarakahSoft LLC (Wyoming, USA)</div>
        <div>Signatory: <strong>Shakil Ahmed</strong> • Principal Systems Architect & Founder</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field">Shakil Ahmed</div>
          <div class="auth-date-field">14 Sep 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Provider Signature</span>
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
        </div>
      </div>

      <div class="auth-party">
        <div class="auth-party-title">Authorized Client: Hospitality Lead (Canada)</div>
        <div>Signatory: <strong>Client Representative</strong> • Authorized Project Lead</div>
        <div class="auth-sign-line">
          <div class="auth-sign-field" style="color: #64748b; font-family: inherit; font-size: 8.2px; font-style: italic;">[ Accepted via Upwork Contract Offer / Sign-off ]</div>
          <div class="auth-date-field">___ / ___ / 2026</div>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span class="auth-label">Authorized Client Signature</span>
          <span class="auth-label" style="width: 75px; text-align: center;">Date</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Executive Signature Footer -->
  <div class="footer-container">
    <div class="footer-founder">
      <img src="data:image/jpeg;base64,{headshot_b64}" alt="Shakil Ahmed" class="founder-avatar" />
      <div class="founder-info">
        <div class="founder-name"><strong>Shakil Ahmed</strong> • Founder & Lead Systems Architect (12+ Yrs Exp)</div>
        <div class="founder-company"><strong>BarakahSoft LLC</strong> • Hospitality & CRM Automation Partner</div>
        <div class="founder-sub">Former Lead Engineer at Legiit ($1M ARR Command Center) • Verified Upwork Partner</div>
      </div>
    </div>
    <div class="footer-brand">
      <img src="data:image/png;base64,{logo_b64}" alt="BarakahSoft" class="business-logo" />
      <a href="https://n8n-hospitality-crm-ai.vercel.app" target="_blank" class="demo-badge">n8n-hospitality-crm-ai.vercel.app</a>
    </div>
  </div>
</div>
</body>
</html>
"""

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Saved estimate.html to:", html_path)

# Run headless Chrome to produce clean 1-page ESTIMATE.pdf with NO header/footer artifacts
chrome_cmd = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_path}",
    f"file://{os.path.abspath(html_path)}"
]

res = subprocess.run(chrome_cmd, capture_output=True, text=True)
if res.returncode == 0:
    print("Successfully generated ESTIMATE.pdf via Chrome Headless at:", pdf_path)
    print("File size:", os.path.getsize(pdf_path), "bytes")
else:
    print("Chrome print-to-pdf error:", res.stderr)

# Verify page count
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

pages = re.findall(rb"/Type\s*/Page[^s]", pdf_bytes)
print(f"Verified PDF page count: {len(pages)} page(s)")
