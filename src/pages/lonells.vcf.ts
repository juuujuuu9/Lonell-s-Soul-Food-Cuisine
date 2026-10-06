import type { APIRoute } from "astro";
import { buildContactVCard, readContactPhotoBase64 } from "../lib/contact-card";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const siteUrl =
    process.env["PUBLIC_SITE_URL"]?.replace(/\/$/, "") || url.origin.replace(/\/$/, "");
  const vcard = buildContactVCard(siteUrl, readContactPhotoBase64());

  return new Response(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Lonells-Soul-Food.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
};
