import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CITY,
  CONTACT_CARD_PATH,
  CONTACT_PHOTO_PATH,
  LOYALTY_KEYWORD,
  LOYALTY_SMS_DISPLAY,
  LOYALTY_SMS_NUMBER,
  MANAGER_PHONE_TEL,
  POSTAL_CODE,
  RESERVATIONS_EMAIL,
  STATE,
  STREET_ADDRESS,
} from "../data/business";

const BRAND = "Lonell's Soul Food Cuisine";
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
    `FN:${escapeVCardText(BRAND)}`,
    `ORG:${escapeVCardText(BRAND)}`,
    `TEL;TYPE=WORK,VOICE:${MANAGER_PHONE_TEL}`,
    `TEL;TYPE=MSG:${LOYALTY_SMS_NUMBER}`,
    `EMAIL;TYPE=INTERNET:${RESERVATIONS_EMAIL}`,
    `URL:${base}`,
    `ADR;TYPE=WORK:;;${escapeVCardText(STREET_ADDRESS)};${escapeVCardText(CITY)};${STATE};${POSTAL_CODE};USA`,
    `NOTE:${escapeVCardText(`Text ${LOYALTY_KEYWORD} to ${LOYALTY_SMS_DISPLAY} for deals and updates.`)}`,
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
}
