// Scans public/images for the production food assets and writes src/lib/asset-manifest.json.
// Files are never renamed. src/lib/assets.ts references each one either by exact filename or,
// when the same filename exists in several folders, by its path under public/images.
// Real sizes and the bounding box of visible pixels are recorded so layers align without guessing.
//
// Usage: npm run assets
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");
const configFile = path.join(root, "src", "lib", "assets.ts");
const manifestFile = path.join(root, "src", "lib", "asset-manifest.json");
const IMAGE = /\.(png|webp|jpe?g|avif)$/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : IMAGE.test(entry.name) ? [full] : [];
  });
}

/** Bounding box [x, y, w, h] of pixels that are not (almost) fully transparent. */
async function visibleBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX < 0 ? null : [minX, minY, maxX - minX + 1, maxY - minY + 1];
}

// Keyed by path relative to public/images, e.g. "entrecote/layers/entrecote-sauce.png".
const files = {};
for (const file of walk(imagesDir)) {
  const key = path.relative(imagesDir, file).split(path.sep).join("/");
  const meta = await sharp(file).metadata();
  const alpha = Boolean(meta.hasAlpha);
  files[key] = {
    src: "/images/" + key,
    w: meta.width,
    h: meta.height,
    alpha,
    format: meta.format,
    box: alpha ? await visibleBox(file) : null,
  };
}

const sorted = Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(manifestFile, JSON.stringify({ files: sorted }, null, 2) + "\n");

// Every reference in the role map must resolve to exactly one file.
const keys = Object.keys(files);
const referenced = [...new Set(fs.readFileSync(configFile, "utf8").match(/[\w/-]+\.(?:png|webp|jpe?g|avif)/g) ?? [])];
const used = new Set();
let missing = 0;
console.log(`Assets: ${keys.length} found in public/images, ${referenced.length} referenced.`);
for (const ref of referenced) {
  const matches = ref.includes("/") ? keys.filter((k) => k === ref) : keys.filter((k) => k.split("/").pop() === ref);
  if (matches.length === 0) {
    missing++;
    console.log(`Missing asset: ${ref}`);
  } else if (matches.length > 1) {
    console.log(`Ambiguous asset: ${ref} exists as ${matches.join(" and ")}; reference it by path in src/lib/assets.ts`);
  } else {
    used.add(matches[0]);
  }
}
for (const key of keys) if (!used.has(key)) console.log(`Not referenced by src/lib/assets.ts: ${key}`);
if (!missing) console.log("No missing assets.");
