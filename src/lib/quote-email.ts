import { attributionEmailRows } from "./attribution";
import type { QuoteDetails } from "./quote-validation";

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function layout(title: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#edf3fa;color:#142b47;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#edf3fa"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #dce7f4;border-radius:14px">
<tr><td style="padding:28px 24px;background:#0c274a;color:#ffffff;border-radius:13px 13px 0 0">
<p style="margin:0 0 8px;color:#a8d1ff;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase">Custom Patch America</p>
<h1 style="margin:0;font-size:26px;line-height:34px">${escapeHtml(title)}</h1>
</td></tr><tr><td style="padding:24px;font-size:15px;line-height:1.6;overflow-wrap:anywhere">${body}</td></tr>
</table></td></tr></table></body></html>`;
}

function rows(entries: ReadonlyArray<readonly [string, string | number]>) {
  return `<table width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.5">
  ${entries.map(([label, value]) => `<tr>
  <th scope="row" width="36%" align="left" valign="top" style="padding:7px 10px 7px 0;border-bottom:1px solid #e7eef7;color:#425a75">${escapeHtml(label)}</th>
  <td valign="top" style="padding:7px 0;border-bottom:1px solid #e7eef7;overflow-wrap:anywhere">${escapeHtml(String(value || "Not available"))}</td>
  </tr>`).join("")}</table>`;
}

function section(title: string, body: string) {
  return `<h2 style="margin:24px 0 8px;font-size:17px;color:#0c274a">${escapeHtml(title)}</h2>${body}`;
}

export function enquiryEmail(details: QuoteDetails, source: string, id: string, submittedAt: string, attribution: unknown, origin: string) {
  const kind = source === "contact-us" ? "contact" : "quote";
  const title = `New ${kind} request`;
  const traffic = attributionEmailRows(attribution, origin, submittedAt);
  const customerDetails = Object.entries({ reference: id, submitted: submittedAt, source, ...details })
    .map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const trafficText = traffic.map(group => group.map(([label, value]) => `${label}: ${value}`).join("\n")).join("\n\n");
  const message = escapeHtml(details.message || "Not available").replace(/\r\n|\r|\n/g, "<br>");
  const html = layout(title,
    rows([["Reference", id], ["Submitted (UTC)", submittedAt], ["Form", source]]) +
    section("Customer details", rows([["Name", details.name], ["Email", details.email],
      ["Phone", details.phone], ["Company", details.company]])) +
    section("Patch details", rows([["Patch type", details.patchType], ["Quantity", details.quantity],
      ...(details.backing ? [["Backing", details.backing] as const] : [])])) +
    section("Message", `<div style="padding:14px 16px;background:#f3f7fc;border-radius:8px">${message}</div>`) +
    section("CUSTOMER TRAFFIC SOURCE", rows(traffic[0]) +
      `<h3 style="margin:16px 0 2px;font-size:14px">Latest campaign details</h3>${rows(traffic[1])}
       <h3 style="margin:16px 0 2px;font-size:14px">First campaign details</h3>${rows(traffic[2])}`));
  return {
    subject: `${title}: ${details.patchType} (${details.quantity})`,
    text: `${customerDetails}\n\nCUSTOMER TRAFFIC SOURCE\n${trafficText}`,
    html,
  };
}

export function confirmationEmail(id: string) {
  const subject = "We received your request | Custom Patch America";
  const thanks = "Thank you for contacting Custom Patch America. We’ve received your request and our team will be in touch to discuss the details.";
  const followUp = "If you have anything to add, reply to this email and include your reference number.";
  return {
    subject,
    text: `${thanks}\n\nReference: ${id}\n\n${followUp}\n\nCustom Patch America`,
    html: layout("Thank you for reaching out", `<p style="margin:0 0 16px">${escapeHtml(thanks)}</p>
      <p style="margin:0 0 16px;padding:12px 16px;background:#f3f7fc;border-radius:8px">
      <strong>Reference number</strong><br>${escapeHtml(id)}</p>
      <p style="margin:0">${escapeHtml(followUp)}</p>`),
  };
}
