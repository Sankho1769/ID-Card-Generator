import sharp from "sharp";

// ---- Brand tokens -----------------------------------------------------
export const COLORS = {
  ink: "#14110F",
  inkDeep: "#0B0A08",
  sand: "#F1E6D2",
  sandDim: "#9A8F7A",
  coral: "#FF6B4A",
  gold: "#E8B23D",
  teal: "#0F5C57",
};

const FONT = {
  displayBold: "SG Bold",
  displayMedium: "SG Medium",
  monoBold: "JBM Bold",
  monoRegular: "JBM Regular",
  bodyRegular: "Inter Regular",
};

export function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function badgeNumberFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return String(h % 100000).padStart(5, "0");
}

// Rough visual width estimate for auto-shrinking display text to fit a
// target pixel width (avoids pulling in a full text-measurement library).
function fitFontSize(text, maxWidth, baseSize, avgCharWidthRatio = 0.56) {
  const estWidth = text.length * baseSize * avgCharWidthRatio;
  if (estWidth <= maxWidth) return baseSize;
  return Math.max(28, Math.floor(baseSize * (maxWidth / estWidth)));
}

// ---- Format A: PFP Frame / Overlay ------------------------------------
// Square canvas. Photo fills the frame edge-to-edge; a gradient ring sits
// near the outer edge so it survives X's circular avatar crop, with a
// branded chip parked at the bottom of the ring.

const PFP_SIZE = 1200;

function pfpOverlaySVG() {
  const size = PFP_SIZE;
  const cx = size / 2;
  const cy = size / 2;
  const ringR = size * 0.465;
  const chipW = 420;
  const chipH = 74;
  const chipX = cx - chipW / 2;
  const chipY = size - 158;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.coral}"/>
      <stop offset="100%" stop-color="${COLORS.gold}"/>
    </linearGradient>
  </defs>

  <circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="url(#ring)" stroke-width="30"/>
  <circle cx="${cx}" cy="${cy}" r="${ringR - 20}" fill="none" stroke="${COLORS.ink}" stroke-width="2" opacity="0.35"/>

  <g opacity="0.9">
    <path d="M40 40 h60 M40 40 v60" stroke="${COLORS.gold}" stroke-width="4" stroke-linecap="round"/>
    <path d="M${size - 40} 40 h-60 M${size - 40} 40 v60" stroke="${COLORS.gold}" stroke-width="4" stroke-linecap="round"/>
    <path d="M40 ${size - 40} h60 M40 ${size - 40} v-60" stroke="${COLORS.gold}" stroke-width="4" stroke-linecap="round"/>
    <path d="M${size - 40} ${size - 40} h-60 M${size - 40} ${size - 40} v-60" stroke="${COLORS.gold}" stroke-width="4" stroke-linecap="round"/>
  </g>

  <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="${chipH / 2}" fill="${COLORS.ink}" stroke="${COLORS.gold}" stroke-width="2"/>
  <text x="${cx}" y="${chipY + chipH / 2 + 11}" text-anchor="middle" font-family="${FONT.displayBold}" font-size="30" letter-spacing="1.5" fill="${COLORS.gold}">HH GOA 2026</text>
</svg>`;
}

export async function generatePfpFrame(photoBuffer) {
  const photo = await sharp(photoBuffer)
    .rotate()
    .resize(PFP_SIZE, PFP_SIZE, { fit: "cover", position: sharp.strategy.attention })
    .toBuffer();

  const overlay = Buffer.from(pfpOverlaySVG());

  return sharp(photo)
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png({ quality: 92 })
    .toBuffer();
}

// ---- Format B: Builder ID Card -----------------------------------------
// Portrait badge with a ticket-stub header (lanyard hole + perforation),
// a photo slot, name/role, a generated builder title, and a footer strip.

const CARD_W = 1000;
const CARD_H = 1260;
const SLOT = { x: 270, y: 226, w: 460, h: 460, rx: 26 };

function cardBackgroundSVG({ name, role, title, badgeNo }) {
  const w = CARD_W, h = CARD_H;
  const nameSize = fitFontSize(name, w - 140, 60);

  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="${COLORS.sand}" opacity="0.05"/>
    </pattern>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.coral}"/>
      <stop offset="100%" stop-color="${COLORS.gold}"/>
    </linearGradient>
  </defs>

  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="48" fill="${COLORS.ink}" stroke="${COLORS.gold}" stroke-width="3"/>
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="48" fill="url(#dots)"/>

  <g opacity="0.07" stroke="${COLORS.coral}" fill="none" stroke-width="3">
    <circle cx="${w}" cy="${h}" r="120"/>
    <circle cx="${w}" cy="${h}" r="180"/>
    <circle cx="${w}" cy="${h}" r="240"/>
  </g>

  <circle cx="${w / 2}" cy="54" r="22" fill="${COLORS.inkDeep}" stroke="${COLORS.gold}" stroke-width="3"/>
  <text x="66" y="60" font-family="${FONT.monoRegular}" font-size="20" letter-spacing="2" fill="${COLORS.sandDim}">GOA, IN</text>
  <text x="${w - 66}" y="60" text-anchor="end" font-family="${FONT.monoRegular}" font-size="20" letter-spacing="2" fill="${COLORS.gold}">2026</text>
  <line x1="40" y1="108" x2="${w - 40}" y2="108" stroke="${COLORS.sandDim}" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>

  <text x="${w / 2}" y="160" text-anchor="middle" font-family="${FONT.displayMedium}" font-size="27" letter-spacing="3" fill="${COLORS.gold}">HH GOA 2026 · BUILDER PASS</text>
  <line x1="80" y1="188" x2="${w - 80}" y2="188" stroke="${COLORS.coral}" stroke-width="2"/>

  <rect x="${SLOT.x - 6}" y="${SLOT.y - 6}" width="${SLOT.w + 12}" height="${SLOT.h + 12}" rx="${SLOT.rx + 6}" fill="${COLORS.inkDeep}"/>

  <text x="${w / 2}" y="748" text-anchor="middle" font-family="${FONT.displayBold}" font-size="${nameSize}" fill="${COLORS.sand}">${escapeXml(name)}</text>
  ${role ? `<text x="${w / 2}" y="790" text-anchor="middle" font-family="${FONT.monoRegular}" font-size="26" letter-spacing="1" fill="${COLORS.coral}">${escapeXml(role)}</text>` : ""}

  ${titleChipSVG(title, w / 2, 840)}

  <path d="M 60 1010 Q 210 970 360 1010 T 660 1010 T ${w - 60} 1010" fill="none" stroke="${COLORS.teal}" stroke-width="3" opacity="0.4"/>
  <path d="M 60 1040 Q 210 1005 360 1040 T 660 1040 T ${w - 60} 1040" fill="none" stroke="${COLORS.coral}" stroke-width="2" opacity="0.22"/>

  <line x1="80" y1="1160" x2="${w - 80}" y2="1160" stroke="${COLORS.sandDim}" stroke-width="2" stroke-dasharray="6 8" opacity="0.5"/>
  <text x="70" y="1200" font-family="${FONT.monoRegular}" font-size="19" letter-spacing="1.5" fill="${COLORS.sandDim}">NO. ${badgeNo}</text>
  <text x="${w / 2}" y="1200" text-anchor="middle" font-family="${FONT.monoRegular}" font-size="19" letter-spacing="1.5" fill="${COLORS.sandDim}">AUG 2026</text>
  <text x="${w - 70}" y="1200" text-anchor="end" font-family="${FONT.monoBold}" font-size="19" letter-spacing="1" fill="${COLORS.coral}">#FrameInGoa</text>

  <g stroke="${COLORS.gold}" stroke-width="2.5" stroke-linecap="round" opacity="0.85">
    <path d="M40 130 h34 M40 130 v34"/>
    <path d="M${w - 40} 130 h-34 M${w - 40} 130 v34"/>
  </g>
</svg>`;
}

function titleChipSVG(title, cx, y) {
  const chipW = Math.min(760, Math.max(320, title.length * 15 + 80));
  const chipH = 56;
  const x = cx - chipW / 2;
  const size = fitFontSize(title, chipW - 60, 25);
  return `
  <rect x="${x}" y="${y}" width="${chipW}" height="${chipH}" rx="${chipH / 2}" fill="${COLORS.inkDeep}" stroke="${COLORS.gold}" stroke-width="2"/>
  <text x="${cx}" y="${y + chipH / 2 + 8}" text-anchor="middle" font-family="${FONT.displayMedium}" font-size="${size}" letter-spacing="0.5" fill="${COLORS.gold}">${escapeXml(title)}</text>`;
}

function cardForegroundSVG() {
  return `
<svg width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ring2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${COLORS.coral}"/>
      <stop offset="100%" stop-color="${COLORS.gold}"/>
    </linearGradient>
  </defs>
  <rect x="${SLOT.x}" y="${SLOT.y}" width="${SLOT.w}" height="${SLOT.h}" rx="${SLOT.rx}" fill="none" stroke="url(#ring2)" stroke-width="6"/>
</svg>`;
}

async function roundedPhotoBuffer(photoBuffer, w, h, rx) {
  const resized = await sharp(photoBuffer)
    .rotate()
    .resize(w, h, { fit: "cover", position: sharp.strategy.attention })
    .toBuffer();

  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="#fff"/></svg>`
  );

  return sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

export async function generateBuilderCard({ photoBuffer, name, role, title, id }) {
  const badgeNo = badgeNumberFromId(id);
  const background = Buffer.from(cardBackgroundSVG({ name, role, title, badgeNo }));
  const foreground = Buffer.from(cardForegroundSVG());
  const photo = await roundedPhotoBuffer(photoBuffer, SLOT.w, SLOT.h, SLOT.rx);

  return sharp(background)
    .composite([
      { input: photo, top: SLOT.y, left: SLOT.x },
      { input: foreground, top: 0, left: 0 },
    ])
    .png({ quality: 92 })
    .toBuffer();
}
