import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG encoder in pure Node.js
function createPNG(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rowSize = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT Chunk
  const idatChunk = createChunk('IDAT', deflated);

  // IEND Chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(typeAndData);

  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  typeAndData.copy(chunk, 4);
  chunk.writeUInt32BE(crc, 4 + 4 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Medical Brand Drawing function (Deep Medical Blue + Clinical Emerald + ECG pulse cross)
function medicalBrandDrawer(isMaskable = false) {
  return (x, y, width, height) => {
    const cx = width / 2;
    const cy = height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Background gradient: Deep Medical Blue #071b2f to #0F4C81
    const t = y / height;
    let r = Math.round(7 * (1 - t) + 15 * t);
    let g = Math.round(27 * (1 - t) + 76 * t);
    let b = Math.round(47 * (1 - t) + 129 * t);
    let a = 255;

    const scale = width / 512;
    const crossThickness = 32 * scale;
    const crossLength = 120 * scale;
    const innerRadius = 54 * scale;

    // Outer safe margin for maskable icon
    const safeZone = isMaskable ? 0.75 : 0.9;
    
    // Draw cross if within vertical or horizontal bar
    const inVert = Math.abs(dx) <= crossThickness && Math.abs(dy) <= crossLength;
    const inHoriz = Math.abs(dy) <= crossThickness && Math.abs(dx) <= crossLength;

    if (inVert || inHoriz) {
      // Emerald gradient #10B981 to #34D399
      r = 16;
      g = 185;
      b = 129;
    }

    // Inner circle
    if (dist <= innerRadius) {
      r = 7;
      g = 27;
      b = 47;
    }

    // Border of inner circle
    if (Math.abs(dist - innerRadius) < 3 * scale) {
      r = 255;
      g = 255;
      b = 255;
    }

    // Central ECG pulse line
    if (Math.abs(dy) < 4 * scale && Math.abs(dx) < 45 * scale) {
      r = 52;
      g = 211;
      b = 153;
    }

    // Pulse peak
    const peak1Dist = Math.sqrt(Math.pow(dx + 10 * scale, 2) + Math.pow(dy + 16 * scale, 2));
    const peak2Dist = Math.sqrt(Math.pow(dx - 8 * scale, 2) + Math.pow(dy - 16 * scale, 2));
    if (peak1Dist < 6 * scale || peak2Dist < 6 * scale) {
      r = 56;
      g = 189;
      b = 248;
    }

    return [r, g, b, a];
  };
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Icons
console.log('Generating PWA Icons...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, medicalBrandDrawer(false)));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, medicalBrandDrawer(false)));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, medicalBrandDrawer(true)));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, medicalBrandDrawer(false)));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, medicalBrandDrawer(false)));

console.log('Successfully generated all PWA icons in /public.');
