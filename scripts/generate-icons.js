// Generates PNG icons for the PWA from the SVG sources.
// Run: node scripts/generate-icons.js
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const out = resolve(root, 'public');
mkdirSync(out, { recursive: true });

const TASKS = [
  { src: 'public/icon.svg',          out: 'icon-192.png',          size: 192 },
  { src: 'public/icon.svg',          out: 'icon-512.png',          size: 512 },
  { src: 'public/icon-maskable.svg', out: 'icon-192-maskable.png', size: 192 },
  { src: 'public/icon-maskable.svg', out: 'icon-512-maskable.png', size: 512 },
  { src: 'public/apple-touch-icon.svg', out: 'apple-touch-icon.png', size: 180 },
  { src: 'public/icon.svg',          out: 'favicon-32.png',        size: 32 }
];

for (const t of TASKS) {
  const svg = readFileSync(resolve(root, t.src));
  await sharp(svg, { density: 384 })
    .resize(t.size, t.size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(resolve(out, t.out));
  console.log(`✓ ${t.out}  (${t.size}×${t.size})`);
}

console.log('\nDone.');
