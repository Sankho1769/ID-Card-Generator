/**
 * Photo rendering with framing, smart cover-fit, zoom, pan, and sticker shadows
 */
import { roundRect } from './drawAsset';

export interface DrawPhotoOptions {
  ctx: CanvasRenderingContext2D;
  photoImg: HTMLImageElement;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  innerPadding?: number;
  frameColor?: string;
  borderColor?: string;
  borderWidth?: number;
  shadowOffset?: number;
  rotation?: number; // radians
  zoom?: number;
  panX?: number; // -100 to 100
  panY?: number; // -100 to 100
}

export function drawFramedPhoto(options: DrawPhotoOptions): void {
  const {
    ctx,
    photoImg,
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    innerPadding = 14,
    frameColor = '#FEE101',
    borderColor = '#000000',
    borderWidth = 5,
    shadowOffset = 10,
    rotation = 0,
    zoom = 1.0,
    panX = 0,
    panY = 0,
  } = options;

  ctx.save();

  // Apply rotation around frame center
  const centerX = frameX + frameWidth / 2;
  const centerY = frameY + frameHeight / 2;
  if (rotation !== 0) {
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);
  }

  // 1. Draw Hard Drop Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
  roundRect(ctx, frameX + shadowOffset, frameY + shadowOffset, frameWidth, frameHeight, 16);
  ctx.fill();

  // 2. Draw Outer Frame Background
  ctx.fillStyle = frameColor;
  roundRect(ctx, frameX, frameY, frameWidth, frameHeight, 16);
  ctx.fill();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;
  ctx.stroke();

  // 3. Inner Photo Aperture Area
  const innerX = frameX + innerPadding;
  const innerY = frameY + innerPadding;
  const innerW = frameWidth - innerPadding * 2;
  const innerH = frameHeight - innerPadding * 2;

  // Background behind photo (dark filler if photo edges show)
  ctx.fillStyle = '#111111';
  roundRect(ctx, innerX, innerY, innerW, innerH, 8);
  ctx.fill();

  // 4. Clip & Draw Photo with Smart Cover + Zoom + Pan
  ctx.save();
  roundRect(ctx, innerX, innerY, innerW, innerH, 8);
  ctx.clip();

  // Base Cover Scale
  const baseScale = Math.max(innerW / photoImg.width, innerH / photoImg.height);
  const effectiveScale = baseScale * Math.max(1.0, zoom);

  const drawW = photoImg.width * effectiveScale;
  const drawH = photoImg.height * effectiveScale;

  // Pan offsets: panX and panY are -100 to 100 percentage of remaining slack
  const maxSlackX = Math.max(0, drawW - innerW);
  const maxSlackY = Math.max(0, drawH - innerH);

  const offsetX = innerX + (innerW - drawW) / 2 + (panX / 100) * (maxSlackX / 2);
  const offsetY = innerY + (innerH - drawH) / 2 + (panY / 100) * (maxSlackY / 2);

  ctx.drawImage(photoImg, offsetX, offsetY, drawW, drawH);

  // Subtle vignette / inner shadow on photo
  const grad = ctx.createLinearGradient(innerX, innerY + innerH - 60, innerX, innerY + innerH);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(innerX, innerY + innerH - 60, innerW, 60);

  ctx.restore();

  // 5. Inner Border stroke around photo
  ctx.lineWidth = 3;
  ctx.strokeStyle = borderColor;
  roundRect(ctx, innerX, innerY, innerW, innerH, 8);
  ctx.stroke();

  ctx.restore();
}
