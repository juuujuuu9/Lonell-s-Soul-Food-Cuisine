import sharp from "sharp";
import { mkdir, copyFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { dirname, join, resolve } from "path";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const PUBLIC = join(PROJECT_ROOT, "public");
const DEFAULT_SOURCE = join(PUBLIC, "media", "images", "_source", "favicon-source.png");

const SIZES = [
  { file: "favicon-16.png", size: 16 },
  { file: "favicon-32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
];

async function buildIco(pngPaths) {
  const { default: pngToIco } = await import("png-to-ico");
  return pngToIco(pngPaths);
}

async function main() {
  const source = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_SOURCE;
  if (!existsSync(source)) {
    console.error(`Source not found: ${source}`);
    process.exit(1);
  }

  await mkdir(dirname(DEFAULT_SOURCE), { recursive: true });
  if (source !== DEFAULT_SOURCE) {
    await copyFile(source, DEFAULT_SOURCE);
  }

  const resize = (size) =>
    sharp(source)
      .resize(size, size, { fit: "cover", position: "centre" })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

  for (const { file, size } of SIZES) {
    await sharp(await resize(size)).toFile(join(PUBLIC, file));
    console.log(`✓ ${file} (${size}×${size})`);
  }

  const ico = await buildIco([
    join(PUBLIC, "favicon-16.png"),
    join(PUBLIC, "favicon-32.png"),
  ]);
  await writeFile(join(PUBLIC, "favicon.ico"), ico);
  console.log("✓ favicon.ico (16, 32)");

  const manifest = {
    name: "Lonell's Soul Food Cuisine",
    short_name: "Lonell's",
    description:
      "Authentic soul food with live jazz, karaoke & Sunday brunch in South Los Angeles.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };

  await writeFile(
    join(PUBLIC, "site.webmanifest"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
  console.log("✓ site.webmanifest");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
