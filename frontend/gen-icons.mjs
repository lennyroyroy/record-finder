import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const src = join(__dir, 'public/icon.svg');
const svg = readFileSync(src);

for (const size of [192, 512]) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(__dir, `public/icon-${size}.png`));
  console.log(`icon-${size}.png`);
}

// apple-touch-icon (180x180, no rounded corners — iOS does that itself)
await sharp(svg).resize(180, 180).png().toFile(join(__dir, 'public/apple-touch-icon.png'));
console.log('apple-touch-icon.png');
