import QRCode from "qrcode";
import { mkdir } from "fs/promises";
import { join, resolve } from "path";

const OUT_DIR = resolve(import.meta.dirname, "..", "public", "media", "qrcodes");
const SITE_URL = "https://lonellssoulfood.com";

// SMS details (mirrors src/data/business.ts)
const SMS_NUMBER = "+14242958020";
const KEYWORD = "SOUL";

const QR_CODES = [
  {
    // Menu page — standard URL QR code
    filename: "qr-menu.png",
    text: `${SITE_URL}/menu`,
    label: "Menu",
    description: "Scan to view our full menu",
  },
  {
    // In-store display — direct sms: URI so scanning opens the messenger app
    // with the opt-in keyword pre-populated. Works on iOS Messages, Android Messages, etc.
    filename: "qr-sms-optin.png",
    text: `sms:${SMS_NUMBER}?body=${encodeURIComponent(KEYWORD)}`,
    label: "SMS Club Signup",
    description: `Scan to text "${KEYWORD}" to ${SMS_NUMBER} and join our SMS club`,
  },
  {
    // Web-friendly fallback that goes through /sms landing page
    filename: "qr-sms-web.png",
    text: `${SITE_URL}/sms`,
    label: "SMS Club Signup (Web fallback)",
    description: "Scan to open the SMS signup landing page",
  },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const qr of QR_CODES) {
    const outPath = join(OUT_DIR, qr.filename);
    await QRCode.toFile(outPath, qr.text, {
      type: "png",
      width: 800,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    console.log(`✓ ${qr.filename} — ${qr.label}`);
  }

  console.log(`\nAll QR codes saved to ${OUT_DIR.replace(process.cwd(), ".")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
