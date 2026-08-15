/**
 * High-Resolution 1600 × 900 "THE CREW - WE CAME TO SHIP" Landscape Poster Generator
 */
import { BuilderData } from '../store/builderStore';
import { ASSETS } from '../data/assets';
import { loadCanvasAsset } from './assetLoader';
import { drawAsset, roundRect } from './drawAsset';
import { drawFramedPhoto } from './drawPhoto';
import { drawStickerBadge, drawBrutalistText } from './drawText';
import { loadImage } from '../utils/image';

export const CREW_WIDTH = 1600;
export const CREW_HEIGHT = 900;

export interface CrewRenderResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  blob: Blob;
}

export async function generateCrewGraphic(
  builders: BuilderData[],
  targetCanvas?: HTMLCanvasElement
): Promise<CrewRenderResult> {
  const canvas = targetCanvas || document.createElement('canvas');
  canvas.width = CREW_WIDTH;
  canvas.height = CREW_HEIGHT;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get 2D context for Crew Canvas');

  // Load shared assets
  const [
    logoImg,
    hindiBadgeImg,
    studioImg,
    sunriseImg,
    treesImg,
    hackersImg,
    bannerBorderImg,
    burstImg,
    ...builderPhotos
  ] = await Promise.all([
    loadCanvasAsset(ASSETS.HACKER_HOUSE_LOGO.path).catch(() => null),
    loadCanvasAsset(ASSETS.GOA_HINDI_BADGE.path).catch(() => null),
    loadCanvasAsset(ASSETS.STUDIO_EMBLEM.path).catch(() => null),
    loadCanvasAsset(ASSETS.SUN_RISE.path).catch(() => null),
    loadCanvasAsset(ASSETS.FOOTER_TREES.path).catch(() => null),
    loadCanvasAsset(ASSETS.HACKERS_CREW.path).catch(() => null),
    loadCanvasAsset(ASSETS.GOA_BANNER_BORDER.path).catch(() => null),
    loadCanvasAsset(ASSETS.STICKER_BURST_LARGE.path).catch(() => null),
    ...builders.map((b) => (b.photo ? loadImage(b.photo).catch(() => null) : Promise.resolve(null))),
  ]);

  // 1. BASE BACKGROUND GRADIENT
  const bgGrad = ctx.createLinearGradient(0, 0, 0, CREW_HEIGHT);
  bgGrad.addColorStop(0, '#02150A');
  bgGrad.addColorStop(0.4, '#084E2A');
  bgGrad.addColorStop(0.8, '#0B6839');
  bgGrad.addColorStop(1, '#042815');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CREW_WIDTH, CREW_HEIGHT);

  // Background Sunrise glow
  if (sunriseImg) {
    drawAsset({
      ctx,
      img: sunriseImg,
      x: (CREW_WIDTH - 1100) / 2,
      y: -100,
      width: 1100,
      height: 1100,
      opacity: 0.35,
      fit: 'contain',
    });
  }

  // Hacker crew artwork in background
  if (hackersImg) {
    drawAsset({
      ctx,
      img: hackersImg,
      x: -40,
      y: CREW_HEIGHT - 380,
      width: CREW_WIDTH + 80,
      height: 380,
      opacity: 0.22,
      fit: 'cover',
    });
  }

  // Palm trees silhouettes
  if (treesImg) {
    drawAsset({
      ctx,
      img: treesImg,
      x: -20,
      y: CREW_HEIGHT - 320,
      width: CREW_WIDTH + 40,
      height: 320,
      opacity: 0.28,
      fit: 'cover',
    });
  }

  // 2. OUTER POSTER BORDER
  const margin = 28;
  const cardW = CREW_WIDTH - margin * 2;
  const cardH = CREW_HEIGHT - margin * 2;

  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 6;
  roundRect(ctx, margin, margin, cardW, cardH, 24);
  ctx.stroke();

  ctx.strokeStyle = '#FEE101';
  ctx.lineWidth = 3;
  roundRect(ctx, margin + 8, margin + 8, cardW - 16, cardH - 16, 18);
  ctx.stroke();
  ctx.restore();

  if (bannerBorderImg) {
    drawAsset({
      ctx,
      img: bannerBorderImg,
      x: margin + 12,
      y: margin + 12,
      width: cardW - 24,
      height: 14,
      opacity: 0.85,
      fit: 'fill',
    });
  }

  // 3. HEADER BRANDING & TITLE
  // Hacker house logo (top left)
  if (logoImg) {
    drawAsset({
      ctx,
      img: logoImg,
      x: 60,
      y: 50,
      width: 320,
      height: 68,
      opacity: 1,
      fit: 'contain',
    });
  }

  // "THE CREW" Centerpiece Banner
  drawStickerBadge({
    ctx,
    text: '🌴 THE CREW · GOA 2026 🌴',
    x: CREW_WIDTH / 2,
    y: 85,
    fontSize: 28,
    fontWeight: '900',
    bg: '#FEE101',
    color: '#000000',
    borderColor: '#000000',
    borderWidth: 4,
    paddingX: 28,
    paddingY: 10,
    rotation: -0.01,
    shadowOffset: 6,
  });

  // Hindi Goa badge (top right)
  if (hindiBadgeImg) {
    drawAsset({
      ctx,
      img: hindiBadgeImg,
      x: CREW_WIDTH - 170,
      y: 48,
      width: 105,
      height: 105,
      rotation: 0.06,
    });
  }

  // 4. DRAW CREW MEMBERS (1, 2, or 3 builders)
  const count = Math.min(3, Math.max(1, builders.length));
  const frameWidth = count === 1 ? 440 : count === 2 ? 380 : 340;
  const frameHeight = count === 1 ? 440 : count === 2 ? 380 : 340;
  const totalSlotsWidth = count * frameWidth;
  const spacing = count === 1 ? 0 : (CREW_WIDTH - 240 - totalSlotsWidth) / (count - 1);
  const startX = (CREW_WIDTH - (totalSlotsWidth + (count - 1) * spacing)) / 2;
  const frameY = 175;

  const frameColors = ['#FEE101', '#FF0080', '#FFFDF5'];
  const rotations = [-0.03, 0.025, -0.02];

  for (let i = 0; i < count; i++) {
    const builder = builders[i];
    const photoImg = builderPhotos[i] as HTMLImageElement | null;
    const currentX = startX + i * (frameWidth + spacing);
    const rot = rotations[i % rotations.length];
    const frameCol = frameColors[i % frameColors.length];

    if (photoImg) {
      drawFramedPhoto({
        ctx,
        photoImg,
        frameX: currentX,
        frameY,
        frameWidth,
        frameHeight,
        innerPadding: 12,
        frameColor: frameCol,
        borderColor: '#000000',
        borderWidth: 5,
        shadowOffset: 8,
        rotation: rot,
        zoom: builder.photoZoom || 1.0,
        panX: builder.photoPosition?.x || 0,
        panY: builder.photoPosition?.y || 0,
      });
    } else {
      // Empty placeholder
      ctx.save();
      ctx.fillStyle = '#000000';
      roundRect(ctx, currentX + 8, frameY + 8, frameWidth, frameHeight, 14);
      ctx.fill();

      ctx.fillStyle = frameCol;
      roundRect(ctx, currentX, frameY, frameWidth, frameHeight, 14);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      ctx.fillStyle = '#111111';
      roundRect(ctx, currentX + 12, frameY + 12, frameWidth - 24, frameHeight - 24, 8);
      ctx.fill();

      drawBrutalistText(ctx, `BUILDER ${i + 1}`, currentX + frameWidth / 2, frameY + frameHeight / 2, {
        fontSize: 22,
        color: '#FEE101',
        align: 'center',
      });
      ctx.restore();
    }

    // Builder Details Under Frame
    const detailsY = frameY + frameHeight + 32;

    // Builder Name
    const nameStr = (builder.name || `BUILDER ${i + 1}`).toUpperCase();
    drawBrutalistText(ctx, nameStr, currentX + frameWidth / 2, detailsY, {
      fontSize: count === 1 ? 34 : count === 2 ? 28 : 24,
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: '900',
      color: '#FFFDF5',
      strokeColor: '#000000',
      strokeWidth: 4,
      shadowOffset: 3,
      align: 'center',
    });

    // Role / Stack
    const roleStr = (builder.role || 'BUILDER').toUpperCase();
    drawBrutalistText(ctx, roleStr, currentX + frameWidth / 2, detailsY + 30, {
      fontSize: count === 1 ? 20 : 16,
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: '700',
      color: '#FEE101',
      strokeColor: '#000000',
      strokeWidth: 2,
      align: 'center',
    });

    // Builder Title Badge
    const titleStr = (builder.builderTitle || 'GOA BUILDER').toUpperCase();
    drawStickerBadge({
      ctx,
      text: titleStr,
      x: currentX + frameWidth / 2,
      y: detailsY + 70,
      fontSize: count === 1 ? 22 : count === 2 ? 18 : 16,
      fontWeight: '900',
      bg: i === 1 ? '#FF0080' : '#FEE101',
      color: i === 1 ? '#FFFFFF' : '#000000',
      borderColor: '#000000',
      borderWidth: 3,
      paddingX: 18,
      paddingY: 6,
      rotation: rot * 0.5,
      shadowOffset: 4,
    });
  }

  // 5. FOOTER DETAILS & MICROCOPY
  const footerY = CREW_HEIGHT - 75;

  // "WE CAME TO SHIP" sticker badge on bottom left
  drawStickerBadge({
    ctx,
    text: 'WE CAME TO SHIP',
    x: 180,
    y: footerY + 10,
    fontSize: 18,
    fontWeight: '900',
    bg: '#FF0080',
    color: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 3,
    rotation: -0.06,
    shadowOffset: 4,
  });

  // 2:47 PM STUDIO logo on footer
  if (studioImg) {
    drawAsset({
      ctx,
      img: studioImg,
      x: CREW_WIDTH - 210,
      y: footerY - 55,
      width: 120,
      height: 70,
      opacity: 0.95,
      rotation: 0.05,
    });
  }

  // Burst sticker (Bottom right)
  if (burstImg) {
    drawAsset({
      ctx,
      img: burstImg,
      x: CREW_WIDTH - 300,
      y: footerY - 50,
      width: 90,
      height: 80,
      opacity: 0.8,
      rotation: 0.1,
    });
  }

  // Center Footer Text
  drawBrutalistText(ctx, 'GOA · INDIA · 2026', CREW_WIDTH / 2, footerY + 12, {
    fontSize: 26,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: '900',
    color: '#FFFDF5',
    strokeColor: '#000000',
    strokeWidth: 3,
    shadowOffset: 2,
    align: 'center',
  });

  // Hashtags on bottom right
  drawBrutalistText(ctx, '#FrameInGoa · #HHGoa', CREW_WIDTH - 130, footerY + 12, {
    fontSize: 16,
    fontFamily: '"Space Mono", monospace',
    fontWeight: '700',
    color: '#FEE101',
    align: 'center',
  });

  // 6. EXPORT
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((b) => resolve(b || new Blob()), 'image/png', 1.0);
  });

  return { canvas, dataUrl, blob };
}
