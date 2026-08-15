/**
 * Canvas drawing helpers for assets and shapes
 */

export interface DrawAssetOptions {
  ctx: CanvasRenderingContext2D;
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  rotation?: number; // radians
  fit?: 'contain' | 'cover' | 'fill';
}

export function drawAsset(options: DrawAssetOptions): void {
  const { ctx, img, x, y, width, height, opacity = 1, rotation = 0, fit = 'fill' } = options;

  ctx.save();
  ctx.globalAlpha = opacity;

  if (rotation !== 0) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation);
    ctx.translate(-(x + width / 2), -(y + height / 2));
  }

  if (fit === 'fill') {
    ctx.drawImage(img, x, y, width, height);
  } else if (fit === 'contain') {
    const scale = Math.min(width / img.width, height / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = x + (width - drawW) / 2;
    const drawY = y + (height - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } else if (fit === 'cover') {
    const scale = Math.max(width / img.width, height / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = x + (width - drawW) / 2;
    const drawY = y + (height - drawH) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws rounded rectangle path
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | number[]
): void {
  ctx.beginPath();
  if (typeof radius === 'number') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.roundRect(x, y, width, height, radius);
  }
}
