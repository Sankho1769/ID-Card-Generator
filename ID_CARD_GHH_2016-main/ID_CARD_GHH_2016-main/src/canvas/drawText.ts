/**
 * Canvas typography & neo-brutalist sticker text rendering
 */
import { roundRect } from './drawAsset';

export interface DrawBadgeOptions {
  ctx: CanvasRenderingContext2D;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  bg?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  paddingX?: number;
  paddingY?: number;
  radius?: number;
  rotation?: number; // radians
  shadowOffset?: number;
}

export function drawStickerBadge(options: DrawBadgeOptions): void {
  const {
    ctx,
    text,
    x,
    y,
    fontSize = 24,
    fontFamily = '"Space Grotesk", sans-serif',
    fontWeight = '800',
    bg = '#FEE101',
    color = '#000000',
    borderColor = '#000000',
    borderWidth = 3,
    paddingX = 16,
    paddingY = 8,
    radius = 8,
    rotation = 0,
    shadowOffset = 5,
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = fontSize + paddingY * 2;

  ctx.translate(x, y);
  if (rotation !== 0) {
    ctx.rotate(rotation);
  }

  // Hard Shadow
  if (shadowOffset > 0) {
    ctx.fillStyle = '#000000';
    roundRect(ctx, -boxWidth / 2 + shadowOffset, -boxHeight / 2 + shadowOffset, boxWidth, boxHeight, radius);
    ctx.fill();
  }

  // Background Box
  ctx.fillStyle = bg;
  roundRect(ctx, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, radius);
  ctx.fill();

  if (borderWidth > 0) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 1);

  ctx.restore();
}

/**
 * Draws text with brutalist outline and shadow
 */
export function drawBrutalistText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    align?: CanvasTextAlign;
    baseline?: CanvasTextBaseline;
    shadowOffset?: number;
    shadowColor?: string;
  } = {}
): void {
  const {
    fontSize = 32,
    fontFamily = '"Space Grotesk", sans-serif',
    fontWeight = '800',
    color = '#FFFDF5',
    strokeColor = '#000000',
    strokeWidth = 0,
    align = 'center',
    baseline = 'middle',
    shadowOffset = 0,
    shadowColor = '#000000',
  } = options;

  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;

  if (shadowOffset > 0) {
    ctx.fillStyle = shadowColor;
    ctx.fillText(text, x + shadowOffset, y + shadowOffset);
  }

  if (strokeWidth > 0) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.restore();
}
