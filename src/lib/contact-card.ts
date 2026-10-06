import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CONTACT_CARD_PATH,
  CONTACT_PHOTO_PATH,
  LOYALTY_KEYWORD,
  LOYALTY_SMS_DISPLAY,
  LOYALTY_SMS_NUMBER,
} from "../data/business";

const VCARD_NAME = "Lonell's Soul Food (Text Deals)";
const CRLF = "\r\n";

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, "");
}

export function contactCardUrl(siteUrl: string): string {
  return `${normalizeSiteUrl(siteUrl)}${CONTACT_CARD_PATH}`;
}

export function contactPhotoUrl(siteUrl: string): string {
  return `${normalizeSiteUrl(siteUrl)}${CONTACT_PHOTO_PATH}`;
}

/** Shown on SMS opt-in welcome (vCard link + HELP/STOP). */
export function contactSaveOptInLine(siteUrl: string): string {
  const card = contactCardUrl(siteUrl);
  return `Click the link to save our text deals number in your phone: ${card}. Reply HELP for help. Reply STOP to opt out.`;
}

function escapeVCardText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function foldVCardLines(content: string): string {
  const lines = content.split(/\r?\n/);
  const folded: string[] = [];

  for (const line of lines) {
    if (line.length <= 75) {
      folded.push(line);
      continue;
    }
    folded.push(line.slice(0, 75));
    let i = 75;
    while (i < line.length) {
      folded.push(` ${line.slice(i, i + 74)}`);
      i += 74;
    }
  }

  return folded.join(CRLF);
}

export function readContactPhotoBase64(): string | undefined {
  try {
    const filePath = path.join(process.cwd(), "public", CONTACT_PHOTO_PATH.replace(/^\//, ""));
    return readFileSync(filePath).toString("base64");
  } catch {
    return undefined;
  }
}

export function buildContactVCard(siteUrl: string, photoBase64?: string): string {
  const base = normalizeSiteUrl(siteUrl);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardText(VCARD_NAME)}`,
    `ORG:${escapeVCardText("Lonell's Soul Food Cuisine")}`,
    `TEL;TYPE=CELL,PREF:${LOYALTY_SMS_NUMBER}`,
    `URL:${base}`,
    `NOTE:${escapeVCardText(`Deals & updates via text. Text ${LOYALTY_KEYWORD} to ${LOYALTY_SMS_DISPLAY}.`)}`,
  ];

  if (photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=PNG:${photoBase64}`);
  } else {
    lines.push(`PHOTO;VALUE=URI:${contactPhotoUrl(base)}`);
  }

  lines.push("END:VCARD");
  return foldVCardLines(lines.join(CRLF)) + CRLF;
}

if (import.meta.env?.DEV) {
  const sample = buildContactVCard("https://lonellssoulfood.com", "abc123");
  console.assert(sample.includes("BEGIN:VCARD"), "vcard: begins with VCARD");
  console.assert(sample.includes("/lonells.vcf") === false, "vcard: no html path in card body");
  console.assert(sample.includes("PHOTO;ENCODING=b;TYPE=PNG:abc123"), "vcard: embeds photo when provided");
  console.assert(contactCardUrl("https://lonellssoulfood.com/") === "https://lonellssoulfood.com/lonells.vcf", "vcard: card url");
  console.assert(
    contactSaveOptInLine("https://lonellssoulfood.com").includes("/lonells.vcf"),
    "vcard: opt-in save line includes card link",
  );
  console.assert(
    !contactSaveOptInLine("https://lonellssoulfood.com").includes(LOYALTY_SMS_DISPLAY),
    "vcard: opt-in save line omits phone digits",
  );
  console.assert(sample.includes(LOYALTY_SMS_NUMBER), "vcard: SMS bot number only");
  console.assert(!sample.includes("+13234513104"), "vcard: no restaurant phone");
}
