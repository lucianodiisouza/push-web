#!/usr/bin/env node
/** Generates PWA + app preset PNG icons — run: node scripts/generate-icons.mjs */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "icons");
const appsDir = join(iconsDir, "apps");
mkdirSync(appsDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(raw, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function setPixel(raw, size, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const row = y * (size * 4 + 1) + 1;
  const i = row + x * 4;
  raw[i] = r;
  raw[i + 1] = g;
  raw[i + 2] = b;
  raw[i + 3] = a;
}

function fillCircle(raw, size, cx, cy, radius, r, g, b) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(raw, size, x, y, r, g, b);
      }
    }
  }
}

function fillRect(raw, size, x0, y0, x1, y1, r, g, b) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      setPixel(raw, size, x, y, r, g, b);
    }
  }
}

function pwaIcon(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) raw[y * (size * 4 + 1)] = 0;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const inCircle = dx * dx + dy * dy <= r * r;
      const corner = (x < size * 0.22 || x > size * 0.78) && (y < size * 0.22 || y > size * 0.78);
      const bar = y > size * 0.35 && y < size * 0.65 && x > size * 0.28 && x < size * 0.72;

      if (inCircle && (corner || bar)) {
        setPixel(raw, size, x, y, 91, 141, 239);
      } else if (inCircle) {
        setPixel(raw, size, x, y, 22, 22, 28);
      } else {
        setPixel(raw, size, x, y, 10, 10, 10);
      }
    }
  }

  return encodePng(raw, size);
}

function appIcon(size, { bg, accent, style }) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) raw[y * (size * 4 + 1)] = 0;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.46;
  fillCircle(raw, size, cx, cy, radius, ...bg);

  if (style === "phone") {
    const w = size * 0.34;
    const h = size * 0.34;
    fillRect(raw, size, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, ...accent);
    fillRect(raw, size, cx - w * 0.22, cy + h * 0.18, cx + w * 0.22, cy + h * 0.32, ...bg);
  } else if (style === "paper") {
    const w = size * 0.36;
    const h = size * 0.44;
    fillRect(raw, size, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, ...accent);
    fillRect(raw, size, cx - w * 0.22, cy - h * 0.12, cx + w * 0.22, cy - h * 0.04, ...bg);
    fillRect(raw, size, cx - w * 0.22, cy + h * 0.04, cx + w * 0.08, cy + h * 0.12, ...bg);
  } else if (style === "hash") {
    const t = size * 0.08;
    fillRect(raw, size, cx - size * 0.18, cy - size * 0.22, cx - size * 0.18 + t, cy + size * 0.22, ...accent);
    fillRect(raw, size, cx + size * 0.1, cy - size * 0.22, cx + size * 0.1 + t, cy + size * 0.22, ...accent);
    fillRect(raw, size, cx - size * 0.22, cy - size * 0.06, cx + size * 0.22, cy - size * 0.06 + t, ...accent);
    fillRect(raw, size, cx - size * 0.22, cy + size * 0.12, cx + size * 0.22, cy + size * 0.12 + t, ...accent);
  } else if (style === "bubble") {
    fillCircle(raw, size, cx, cy - size * 0.04, size * 0.2, ...accent);
    fillCircle(raw, size, cx - size * 0.14, cy + size * 0.12, size * 0.07, ...accent);
  } else if (style === "envelope") {
    const w = size * 0.42;
    const h = size * 0.28;
    fillRect(raw, size, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, ...accent);
    for (let i = 0; i < size * 0.22; i++) {
      setPixel(raw, size, Math.round(cx - w / 2 + i), Math.round(cy - h / 2 + i * 0.55), ...bg);
      setPixel(raw, size, Math.round(cx + w / 2 - i), Math.round(cy - h / 2 + i * 0.55), ...bg);
    }
  } else if (style === "grid") {
    const cell = size * 0.14;
    const gap = size * 0.06;
    const startX = cx - cell - gap / 2;
    const startY = cy - cell - gap / 2;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        fillRect(
          raw,
          size,
          startX + col * (cell + gap),
          startY + row * (cell + gap),
          startX + col * (cell + gap) + cell,
          startY + row * (cell + gap) + cell,
          ...accent
        );
      }
    }
  }

  return encodePng(raw, size);
}

const APP_ICONS = {
  whatsapp: { bg: [37, 211, 102], accent: [255, 255, 255], style: "phone" },
  telegram: { bg: [0, 136, 204], accent: [255, 255, 255], style: "paper" },
  slack: { bg: [74, 21, 75], accent: [236, 182, 255], style: "hash" },
  messages: { bg: [52, 199, 89], accent: [255, 255, 255], style: "bubble" },
  gmail: { bg: [234, 67, 53], accent: [255, 255, 255], style: "envelope" },
  calendar: { bg: [255, 59, 48], accent: [255, 255, 255], style: "grid" },
};

for (const size of [192, 512]) {
  const path = join(iconsDir, `icon-${size}.png`);
  writeFileSync(path, pwaIcon(size));
  console.log("Wrote", path);
}

for (const [name, spec] of Object.entries(APP_ICONS)) {
  const path = join(appsDir, `${name}.png`);
  writeFileSync(path, appIcon(192, spec));
  console.log("Wrote", path);
}
