/**
 * High-Resolution 1080 × 1350 Builder ID ("Goa Builder Passport") Canvas Generator
 */
import { BuilderData } from '../store/builderStore';
import { STYLES, StyleTheme } from '../data/styles';
import { ASSETS } from '../data/assets';
import { loadCanvasAsset } from './assetLoader';
import { drawAsset, roundRect } from './drawAsset';
import { drawFramedPhoto } from './drawPhoto';
import { drawStickerBadge, drawBrutalistText } from './drawText';
import { drawBarcode } from './drawBarcode';
import { loadImage } from '../utils/image';

export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT = 1350;

export interface RenderResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob;
}

export async function generateBuilderId(
  builder: BuilderData,
  targetCanvas?: HTMLCanvasElement
): Promise<RenderResult> {
  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const theme: StyleTheme = STYLES[builder.style] || STYLES['beach-club'];

  // Load essential assets concurrently
  const [
    logoImg,
    hindiBadgeImg,
    studioImg,
    sunriseImg,
    treesImg,
    detailsImg,
    bannerBorderImg,
    leafDividerImg,
    burstImg,
    userPhotoImg,
  ] = await Promise.all([
    loadCanvasAsset(ASSETS.HACKER_HOUSE_LOGO.path).catch(() => null),
    loadCanvasAsset(ASSETS.GOA_HINDI_BADGE.path).catch(() => null),
    loadCanvasAsset(ASSETS.STUDIO_EMBLEM.path).catch(() => null),
    loadCanvasAsset(ASSETS.SUN_RISE.path).catch(() => null),
    loadCanvasAsset(ASSETS.FOOTER_TREES.path).catch(() => null),
    loadCanvasAsset(ASSETS.DETAILS_BG.path).catch(() => null),
    loadCanvasAsset(ASSETS.GOA_BANNER_BORDER.path).catch(() => null),
    loadCanvasAsset(ASSETS.LEAF_DIVIDER_1.path).catch(() => null),
    loadCanvasAsset(ASSETS.STICKER_BURST_SMALL.path).catch(() => null),
    builder.photo ? loadImage(builder.photo).catch(() => null) : null,
  ]);

  // 1. BASE BACKGROUND
  if (builder.style === 'beach-club') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#032011');
    bgGrad.addColorStop(0.3, '#084E2A');
    bgGrad.addColorStop(0.7, '#0B6839');
    bgGrad.addColorStop(1, '#04321A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sunrise background in top half
    if (sunriseImg) {
      drawAsset({
        ctx,
        img: sunriseImg,
        x: (CANVAS_WIDTH - 900) / 2,
        y: 40,
        width: 900,
        height: 900,
        opacity: 0.45,
        fit: 'contain',
      });
    }

    // Palm trees in lower background
    if (treesImg) {
      drawAsset({
        ctx,
        img: treesImg,
        x: -40,
        y: CANVAS_HEIGHT - 480,
        width: CANVAS_WIDTH + 80,
        height: 480,
        opacity: 0.35,
        fit: 'cover',
      });
    }
  } else if (builder.style === 'night-hacker') {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#011107');
    bgGrad.addColorStop(0.4, '#032011');
    bgGrad.addColorStop(0.8, '#082E1A');
    bgGrad.addColorStop(1, '#02160A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Subtle dark details scenery
    if (detailsImg) {
      drawAsset({
        ctx,
        img: detailsImg,
        x: -50,
        y: CANVAS_HEIGHT - 600,
        width: CANVAS_WIDTH + 100,
        height: 600,
        opacity: 0.28,
        fit: 'cover',
      });
    }

    // Sunrise neon silhouette
    if (sunriseImg) {
      drawAsset({
        ctx,
        img: sunriseImg,
        x: (CANVAS_WIDTH - 850) / 2,
        y: 60,
        width: 850,
        height: 850,
        opacity: 0.25,
        fit: 'contain',
      });
    }
  } else {
    // Goa Sunset
    const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    bgGrad.addColorStop(0, '#260F03');
    bgGrad.addColorStop(0.35, '#682D07');
    bgGrad.addColorStop(0.7, '#A5520D');
    bgGrad.addColorStop(1, '#0B4E26');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (sunriseImg) {
      drawAsset({
        ctx,
        img: sunriseImg,
        x: (CANVAS_WIDTH - 960) / 2,
        y: 20,
        width: 960,
        height: 960,
        opacity: 0.6,
        fit: 'contain',
      });
    }

    if (treesImg) {
      drawAsset({
        ctx,
        img: treesImg,
        x: -30,
        y: CANVAS_HEIGHT - 450,
        width: CANVAS_WIDTH + 60,
        height: 450,
        opacity: 0.4,
        fit: 'cover',
      });
    }
  }

  // 2. RETRO-TROPICAL GRID / GRAIN LINES
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 40; x < CANVAS_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let y = 40; y < CANVAS_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. PASSPORT OUTER FRAME BORDER (Double border with brutalist corners)
  const margin = 32;
  const cardW = CANVAS_WIDTH - margin * 2;
  const cardH = CANVAS_HEIGHT - margin * 2;

  ctx.save();
  // Outer Card Border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  roundRect(ctx, margin, margin, cardW, cardH, 28);
  ctx.stroke();

  // Inner Accent Border
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 3;
  roundRect(ctx, margin + 8, margin + 8, cardW - 16, cardH - 16, 22);
  ctx.stroke();
  ctx.restore();

  // Decorative top pattern banner
  if (bannerBorderImg) {
    drawAsset({
      ctx,
      img: bannerBorderImg,
      x: margin + 14,
      y: margin + 14,
      width: cardW - 28,
      height: 18,
      opacity: 0.85,
      fit: 'fill',
    });
  }

  // 4. HEADER BRANDING & LOGO
  // Hacker House Logo
  if (logoImg) {
    drawAsset({
      ctx,
      img: logoImg,
      x: 70,
      y: 72,
      width: 440,
      height: 92,
      opacity: 1,
      fit: 'contain',
    });
  } else {
    drawBrutalistText(ctx, 'HACKER HOUSE', 240, 110, {
      fontSize: 38,
      fontFamily: '"Space Grotesk", sans-serif',
      color: theme.accentColor,
      strokeColor: '#000000',
      strokeWidth: 4,
      align: 'center',
    });
  }

  // "GOA 2026" Badge next to logo
  drawStickerBadge({
    ctx,
    text: 'GOA 2026',
    x: 430,
    y: 165,
    fontSize: 18,
    bg: theme.accentColor,
    color: '#000000',
    rotation: -0.04,
    shadowOffset: 4,
  });

  // "OFFICIAL BUILDER PASSPORT" Pill
  drawStickerBadge({
    ctx,
    text: '★ BUILDER PASSPORT ★',
    x: 210,
    y: 165,
    fontSize: 14,
    bg: '#000000',
    color: '#FFFDF5',
    borderColor: theme.accentColor,
    borderWidth: 2,
    rotation: 0.02,
    shadowOffset: 3,
  });

  // Circular Hindi Goa Stamp (Top Right)
  if (hindiBadgeImg) {
    drawAsset({
      ctx,
      img: hindiBadgeImg,
      x: CANVAS_WIDTH - 210,
      y: 65,
      width: 135,
      height: 135,
      opacity: 1,
      rotation: 0.08,
    });
  }

  // 5. CENTER PHOTO FRAME
  const photoFrameW = 540;
  const photoFrameH = 540;
  const photoFrameX = (CANVAS_WIDTH - photoFrameW) / 2;
  const photoFrameY = 225;

  if (userPhotoImg) {
    drawFramedPhoto({
      ctx,
      photoImg: userPhotoImg,
      frameX: photoFrameX,
      frameY: photoFrameY,
      frameWidth: photoFrameW,
      frameHeight: photoFrameH,
      innerPadding: 16,
      frameColor: theme.frameColor,
      borderColor: '#000000',
      borderWidth: 6,
      shadowOffset: 12,
      rotation: -0.015,
      zoom: builder.photoZoom || 1.0,
      panX: builder.photoPosition?.x || 0,
      panY: builder.photoPosition?.y || 0,
    });
  } else {
    // Empty state frame placeholder
    ctx.save();
    ctx.fillStyle = '#000000';
    roundRect(ctx, photoFrameX + 12, photoFrameY + 12, photoFrameW, photoFrameH, 16);
    ctx.fill();

    ctx.fillStyle = theme.frameColor;
    roundRect(ctx, photoFrameX, photoFrameY, photoFrameW, photoFrameH, 16);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.fillStyle = '#111111';
    roundRect(ctx, photoFrameX + 16, photoFrameY + 16, photoFrameW - 32, photoFrameH - 32, 10);
    ctx.fill();

    drawBrutalistText(ctx, 'DROP YOUR PHOTO', photoFrameX + photoFrameW / 2, photoFrameY + photoFrameH / 2, {
      fontSize: 28,
      color: theme.accentColor,
      align: 'center',
    });
    ctx.restore();
  }

  // Corner sticker tape / pin on photo
  const tapeText = builder.teamName?.trim()
    ? `TEAM ${builder.teamName.trim().toUpperCase()}`
    : 'HH-GOA-2026';

  drawStickerBadge({
    ctx,
    text: tapeText,
    x: photoFrameX + (tapeText.length > 12 ? 115 : 90),
    y: photoFrameY + 14,
    fontSize: 12,
    bg: '#FFFDF5',
    color: '#000000',
    rotation: -0.15,
    shadowOffset: 2,
    borderWidth: 1.5,
    paddingX: 10,
    paddingY: 4,
  });

  // "VERIFIED BUILDER" badge on bottom right of photo
  drawStickerBadge({
    ctx,
    text: '✔ VERIFIED BUILDER',
    x: photoFrameX + photoFrameW - 110,
    y: photoFrameY + photoFrameH - 12,
    fontSize: 14,
    bg: '#000000',
    color: theme.accentColor,
    borderColor: theme.accentColor,
    borderWidth: 2,
    rotation: 0.05,
    shadowOffset: 4,
  });

  // 6. BUILDER IDENTITY DETAILS
  const detailsStartY = 808;

  // Builder Name
  const rawName = (builder.name || 'ANONYMOUS BUILDER').toUpperCase();
  drawBrutalistText(ctx, rawName, CANVAS_WIDTH / 2, detailsStartY, {
    fontSize: rawName.length > 20 ? 40 : 48,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: '900',
    color: '#FFFDF5',
    strokeColor: '#000000',
    strokeWidth: 6,
    shadowOffset: 4,
    shadowColor: '#000000',
    align: 'center',
  });

  // Role / Stack & Squad Subtitle
  let roleText = (builder.role || 'FULL STACK BUILDER').toUpperCase();
  if (builder.teamName && builder.teamName.trim().length > 0) {
    roleText += ` · ${builder.teamName.trim().toUpperCase()}`;
  }

  drawBrutalistText(ctx, roleText, CANVAS_WIDTH / 2, detailsStartY + 48, {
    fontSize: roleText.length > 32 ? 18 : roleText.length > 24 ? 21 : 24,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: '700',
    color: theme.accentColor,
    strokeColor: '#000000',
    strokeWidth: 3,
    shadowOffset: 2,
    shadowColor: '#000000',
    align: 'center',
  });

  // 7. BUILDER TITLE (STATIONERY / RETRO BANNER)
  const titleY = detailsStartY + 110;
  const titleText = (builder.builderTitle || 'GOA BUILDER').toUpperCase();

  drawStickerBadge({
    ctx,
    text: `⚡ ${titleText} ⚡`,
    x: CANVAS_WIDTH / 2,
    y: titleY,
    fontSize: 32,
    fontWeight: '900',
    bg: theme.accentColor === '#FF0080' ? '#FF0080' : '#FEE101',
    color: theme.accentColor === '#FF0080' ? '#FFFFFF' : '#000000',
    borderColor: '#000000',
    borderWidth: 5,
    paddingX: 34,
    paddingY: 12,
    radius: 12,
    rotation: -0.02,
    shadowOffset: 6,
  });

  // Optional Power / Fun Fact
  const hasPower = Boolean(builder.power && builder.power.trim().length > 0);
  if (hasPower && builder.power) {
    const powerText = `POWER: ${builder.power.trim().toUpperCase()}`;
    drawStickerBadge({
      ctx,
      text: powerText,
      x: CANVAS_WIDTH / 2,
      y: titleY + 54,
      fontSize: 15,
      bg: '#000000',
      color: '#FFFDF5',
      borderColor: theme.secondaryColor,
      borderWidth: 2,
      paddingX: 18,
      paddingY: 5,
      radius: 6,
      shadowOffset: 3,
    });
  }

  // 8. STAMPS & STICKERS
  // 2:47 PM STUDIO Official Logo Vector Graphic (2-47.svg)
  if (studioImg) {
    drawAsset({
      ctx,
      img: studioImg,
      x: 85,
      y: 980,
      width: 175,
      height: 105,
      opacity: 1,
      rotation: -0.07,
    });
  }

  // "2:47 PM STUDIO" mini stamp label
  drawStickerBadge({
    ctx,
    text: '2:47 PM STUDIO',
    x: 170,
    y: 1060,
    fontSize: 13,
    fontWeight: '900',
    bg: '#FEE101',
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 2.5,
    rotation: -0.06,
    shadowOffset: 3,
  });

  // "APPROVED TO SHIP" Stamp (Rotated on bottom left)
  drawStickerBadge({
    ctx,
    text: 'APPROVED TO SHIP',
    x: 180,
    y: 1120,
    fontSize: 16,
    fontWeight: '900',
    bg: '#FF0080',
    color: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 3,
    rotation: -0.12,
    shadowOffset: 5,
  });

  // Burst sticker (Bottom right)
  if (burstImg) {
    drawAsset({
      ctx,
      img: burstImg,
      x: CANVAS_WIDTH - 210,
      y: 1015,
      width: 130,
      height: 115,
      opacity: 0.95,
      rotation: 0.12,
    });
  }

  // "SHIP OR SHIP" stamp
  drawStickerBadge({
    ctx,
    text: 'SHIP OR SHIP',
    x: CANVAS_WIDTH - 150,
    y: 1122,
    fontSize: 15,
    fontWeight: '800',
    bg: '#FEE101',
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 3,
    rotation: 0.08,
    shadowOffset: 4,
  });

  // 8.5 SCANNABLE QR BARCODE & ID NUMBER (Center, below power badge, between stamp clusters)
  const namePrefix = builder.name?.trim()
    ? builder.name.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    : 'GOA';
  const idNumber = `ID: HH-${namePrefix || 'GOA'}-2026`;

  const qrY = hasPower ? 996 : 975;
  const qrSize = 135; // Increased QR size

  await drawBarcode({
    ctx,
    builder,
    x: CANVAS_WIDTH / 2,
    y: qrY,
    size: qrSize,
    fgColor: '#000000',
    bgColor: '#FFFDF5',
    borderWidth: 4,
    borderColor: '#000000',
    shadowOffset: 5,
    labelText: '',
    idNumber,
    idNumberBg: '#000000',
    idNumberColor: theme.accentColor,
    idNumberBorderColor: theme.accentColor,
  });

  // 9. FOOTER DIVIDER & PASSPORT CREDENTIALS
  const footerY = 1205;

  if (leafDividerImg) {
    drawAsset({
      ctx,
      img: leafDividerImg,
      x: 90,
      y: footerY - 20,
      width: CANVAS_WIDTH - 180,
      height: 16,
      opacity: 0.75,
      fit: 'fill',
    });
  }

  // Microcopy: "BUILD · SHIP · BREAK · REPEAT"
  drawBrutalistText(ctx, 'BUILD · SHIP · BREAK · REPEAT', CANVAS_WIDTH / 2, footerY + 18, {
    fontSize: 16,
    fontFamily: '"Space Mono", monospace',
    fontWeight: '700',
    color: theme.accentColor,
    align: 'center',
  });

  // Bottom Line: "GOA · INDIA · 2026"
  drawBrutalistText(ctx, 'GOA · INDIA · 2026', CANVAS_WIDTH / 2, footerY + 54, {
    fontSize: 26,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: '900',
    color: '#FFFDF5',
    strokeColor: '#000000',
    strokeWidth: 3,
    shadowOffset: 2,
    align: 'center',
  });

  // Passport Watermark ID (Bottom Left)
  const passId = `PASSPORT NO: HH-${namePrefix || 'GOA'}-2026`;
  drawBrutalistText(ctx, passId, 80, footerY + 84, {
    fontSize: 12,
    fontFamily: '"Space Mono", monospace',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
    align: 'left',
  });

  // Hashtag Watermark (Bottom Right)
  drawBrutalistText(ctx, '#FrameInGoa', CANVAS_WIDTH - 80, footerY + 84, {
    fontSize: 13,
    fontFamily: '"Space Mono", monospace',
    fontWeight: '700',
    color: theme.accentColor,
    align: 'right',
  });

  // 10. EXPORT PNG & BLOB
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png', 1.0);
  });

  return { canvas, dataUrl, blob };
}
