#!/usr/bin/env node
// Generates simple solid-color circular PWA icons as PNGs.
// No external dependencies — uses node:zlib for deflate and a hand-rolled CRC32.
// Re-run any time you want to regenerate the assets.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'icons');

const CREAM = [0xfa, 0xf7, 0xf2];
const SAGE = [0x7b, 0xa8, 0x9c];

function crc32(buf) {
  let c;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, pixels) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    pixels.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeIcon(size, { maskable }) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const cornerRadius = maskable ? 0 : size * 0.18;
  const safeOuter = maskable ? size * 0.4 : size * 0.42;
  const innerRing = maskable ? size * 0.27 : size * 0.22;
  const innerDot = size * 0.085;

  const bg = maskable ? SAGE : CREAM;
  const fg = maskable ? CREAM : SAGE;

  function setPixel(x, y, r, g, b, a = 255) {
    const i = (y * size + x) * 4;
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (!maskable) {
        // rounded rectangle background
        const inX = x >= cornerRadius && x < size - cornerRadius;
        const inY = y >= cornerRadius && y < size - cornerRadius;
        if (!inX && !inY) {
          const corners = [
            [cornerRadius, cornerRadius],
            [size - cornerRadius - 1, cornerRadius],
            [cornerRadius, size - cornerRadius - 1],
            [size - cornerRadius - 1, size - cornerRadius - 1],
          ];
          let inside = false;
          for (const [ccx, ccy] of corners) {
            const ddx = x - ccx;
            const ddy = y - ccy;
            if (Math.sqrt(ddx * ddx + ddy * ddy) <= cornerRadius) {
              inside = true;
              break;
            }
          }
          if (!inside) {
            setPixel(x, y, 0, 0, 0, 0);
            continue;
          }
        }
      }

      setPixel(x, y, bg[0], bg[1], bg[2], 255);

      if (d <= safeOuter) {
        setPixel(x, y, fg[0], fg[1], fg[2], 255);
      }
      if (d <= innerRing) {
        // soft inner ring
        const v = Math.round(255 * 0.65);
        setPixel(x, y, CREAM[0], CREAM[1], CREAM[2], v);
        // re-apply alpha blending against bg color for solid PNG
        const r = Math.round((CREAM[0] * v + bg[0] * (255 - v)) / 255);
        const g = Math.round((CREAM[1] * v + bg[1] * (255 - v)) / 255);
        const b = Math.round((CREAM[2] * v + bg[2] * (255 - v)) / 255);
        setPixel(x, y, r, g, b, 255);
      }
      if (d <= innerDot) {
        setPixel(x, y, fg[0], fg[1], fg[2], 255);
      }
    }
  }

  return encodePNG(size, size, pixels);
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const tasks = [
    { size: 192, file: 'icon-192.png', maskable: false },
    { size: 512, file: 'icon-512.png', maskable: false },
    { size: 192, file: 'icon-maskable-192.png', maskable: true },
    { size: 512, file: 'icon-maskable-512.png', maskable: true },
    { size: 180, file: 'apple-touch-icon.png', maskable: false },
  ];
  for (const t of tasks) {
    const png = makeIcon(t.size, { maskable: t.maskable });
    writeFileSync(join(OUT_DIR, t.file), png);
    console.log(`wrote ${t.file} (${png.length} bytes)`);
  }
}

main();
