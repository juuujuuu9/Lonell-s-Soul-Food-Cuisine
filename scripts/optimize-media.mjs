import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "fs";
import { copyFile, readFile } from "fs/promises";
import { basename, extname, join, resolve } from "path";

const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const PUBLIC_MEDIA = join(PROJECT_ROOT, "public", "media");
const SOURCE_PREFIX = "_source";

const NEW_FILES = process.argv.slice(2).map((f) => resolve(f));

// Extensions grouped by media type
const EXT_GROUPS = {
  images: new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".bmp", ".gif", ".svg"]),
  videos: new Set([".mp4", ".webm", ".mov", ".avi", ".mkv"]),
  audio: new Set([".mp3", ".wav", ".ogg", ".m4a", ".flac"]),
};
const ALL_MEDIA_EXTS = new Set([...EXT_GROUPS.images, ...EXT_GROUPS.videos, ...EXT_GROUPS.audio]);

// Magic bytes for extensionless detection
const MAGIC_BYTES = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header
  gif: [0x47, 0x49, 0x46, 0x38],
  bmp: [0x42, 0x4d],
  tiff: [0x49, 0x49, 0x2a, 0x00], // little-endian
  tiff_be: [0x4d, 0x4d, 0x00, 0x2a], // big-endian
  avif: [0x00, 0x00, 0x00, 0x1c], // ftyp avif
  mp4: [0x00, 0x00, 0x00, 0x18], // ftyp mp42
  webm: [0x1a, 0x45, 0xdf, 0xa3],
};

const MAGIC_TO_EXT = {
  jpeg: ".jpg",
  png: ".png",
  webp: ".webp",
  gif: ".gif",
  bmp: ".bmp",
  tiff: ".tiff",
  tiff_be: ".tiff",
  avif: ".avif",
  mp4: ".mp4",
  webm: ".webm",
};

// ── Image config (sensible web defaults) ──────────────────────
const IMAGE_CONFIGS = [
  { suffix: "", quality: 80 },
  { suffix: "@2x", quality: 60 },
];

const LARGE_THRESHOLD = 2000;
const LARGE_CONFIG = { suffix: "-lg", width: 1920, quality: 80 };

// ── Helpers ──────────────────────────────────────────────────

async function detectFormat(filePath) {
  const buf = new Uint8Array(await readFile(filePath)).subarray(0, 12);

  for (const [name, magic] of Object.entries(MAGIC_BYTES)) {
    if (magic.every((b, i) => buf[i] === b)) {
      return MAGIC_TO_EXT[name] || null;
    }
  }

  // Check for SVG (text-based)
  const header = new TextDecoder().decode(buf);
  if (header.includes("<svg") || header.includes("<?xml")) return ".svg";

  return null;
}

function getExtension(filePath) {
  let ext = extname(filePath).toLowerCase();
  if (ext) return ext;

  // File has no extension. Will be resolved later by detectFormat.
  return null;
}

function getMediaType(ext) {
  if (!ext) return "other";
  for (const [type, exts] of Object.entries(EXT_GROUPS)) {
    if (exts.has(ext)) return type;
  }
  return "other";
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function slugify(filePath) {
  const name = basename(filePath);
  return name
    .replace(extname(name), "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "media-file";
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
}

// ── Optimizers ───────────────────────────────────────────────

async function optimizeImage(sourcePath, destDir, slug) {
  const metadata = await sharp(sourcePath).metadata();
  const maxDim = Math.max(metadata.width || 0, metadata.height || 0);
  const originalSize = statSync(sourcePath).size;

  const configs = [...IMAGE_CONFIGS];
  if (maxDim > LARGE_THRESHOLD) configs.push(LARGE_CONFIG);

  const results = [];

  for (const cfg of configs) {
    const webpName = `${slug}${cfg.suffix}.webp`;
    const webpPath = join(destDir, webpName);

    let pipeline = sharp(sourcePath).webp({ quality: cfg.quality, effort: 6 });
    if (cfg.width) pipeline = pipeline.resize({ width: cfg.width, withoutEnlargement: true });

    await pipeline.toFile(webpPath);
    results.push({ path: webpPath, type: "webp" });

    // JPEG fallback for browsers that don't support WebP
    if (!cfg.suffix || cfg.suffix === "-lg") {
      const jpgName = `${slug}${cfg.suffix}.jpg`;
      const jpgPath = join(destDir, jpgName);

      let jpgPipeline = sharp(sourcePath).jpeg({ quality: cfg.quality, mozjpeg: true });
      if (cfg.width) jpgPipeline = jpgPipeline.resize({ width: cfg.width, withoutEnlargement: true });

      await jpgPipeline.toFile(jpgPath);
      results.push({ path: jpgPath, type: "jpg" });
    }
  }

  console.log(`    Original: ${formatSize(originalSize)}`);

  // Archive source
  const sourceDir = join(destDir, SOURCE_PREFIX);
  ensureDir(sourceDir);
  await copyFile(sourcePath, join(sourceDir, basename(sourcePath)));

  return results;
}

async function optimizeGeneral(sourcePath, destDir) {
  const originalSize = statSync(sourcePath).size;
  const dest = join(destDir, basename(sourcePath));
  await copyFile(sourcePath, dest);

  console.log(`    Original: ${formatSize(originalSize)}`);

  return [{ path: dest, type: "copy" }];
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  if (NEW_FILES.length === 0) return;

  console.log(`\n📦 Media optimizer`);

  for (const filePath of NEW_FILES) {
    if (!existsSync(filePath)) continue;

    let ext = getExtension(filePath);
    let resolvedPath = filePath;

    // If no extension, detect by magic bytes
    if (!ext) {
      const detected = await detectFormat(filePath);
      if (!detected) {
        console.log(`  ⚠ ${basename(filePath)}: unrecognized format, skipping`);
        continue;
      }
      ext = detected;
    }

    // Check if it's a media file at all
    if (!ALL_MEDIA_EXTS.has(ext)) continue;

    const mediaType = getMediaType(ext);
    const destDir = join(PUBLIC_MEDIA, mediaType);
    ensureDir(destDir);

    const slug = slugify(filePath);
    const displayName = basename(filePath);

    console.log(`  📄 ${displayName} → ${mediaType}/`);

    try {
      let results;
      if (EXT_GROUPS.images.has(ext)) {
        results = await optimizeImage(resolvedPath, destDir, slug);
      } else {
        results = await optimizeGeneral(resolvedPath, destDir);
      }

      for (const r of results) {
        console.log(`    ✓ ${basename(r.path)} (${formatSize(statSync(r.path).size)}, ${r.type})`);
      }

      // Summarize savings for images
      if (EXT_GROUPS.images.has(ext)) {
        const webpResult = results.find((r) => r.type === "webp" && !r.path.includes("@2x") && !r.path.includes("-lg"));
        if (webpResult) {
          const orig = statSync(filePath).size;
          const optimized = statSync(webpResult.path).size;
          const pct = ((1 - optimized / orig) * 100).toFixed(0);
          console.log(`    💾 Saved ${pct}% on primary WebP`);
        }
      }
    } catch (err) {
      console.error(`    ✗ ${err.message}`);
    }
  }
}

main().catch(console.error);
