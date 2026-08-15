/**
 * QR Code barcode generator for Builder ID canvas.
 * Encodes all builder details into a scannable QR code drawn directly on the canvas.
 */
import QRCode from 'qrcode';
import { BuilderData } from '../store/builderStore';
import { roundRect } from './drawAsset';

export interface DrawBarcodeOptions {
  ctx: CanvasRenderingContext2D;
  builder: BuilderData;
  x: number; // center X position
  y: number; // top Y position
  size: number; // QR code size (width & height)
  fgColor?: string;
  bgColor?: string;
  borderWidth?: number;
  borderColor?: string;
  shadowOffset?: number;
  labelText?: string;
  labelColor?: string;
  labelFontSize?: number;
  idNumber?: string;
  idNumberColor?: string;
  idNumberBg?: string;
  idNumberBorderColor?: string;
}

/**
 * Builds a vCard-style string containing all builder details.
 */
function encodeBuilderData(builder: BuilderData): string {
  const namePrefix = builder.name?.trim()
    ? builder.name.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()
    : 'GOA';
  const idStr = `HH-${namePrefix || 'GOA'}-2026`;

  const lines: string[] = [];
  lines.push('═══ HACKER HOUSE GOA 2026 ═══');
  lines.push('');
  lines.push(`ID: ${idStr}`);
  lines.push(`Name: ${builder.name || 'Anonymous Builder'}`);
  lines.push(`Role: ${builder.role || 'Builder'}`);
  if (builder.teamName) {
    lines.push(`Team: ${builder.teamName}`);
  }
  lines.push(`Title: ${builder.builderTitle || 'GOA BUILDER'}`);
  if (builder.power) {
    lines.push(`Power: ${builder.power}`);
  }
  lines.push(`Style: ${builder.style || 'beach-club'}`);
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('═══ VERIFIED BUILDER ═══');
  return lines.join('\n');
}

/**
 * Generates a QR code data URL from builder data.
 */
async function generateQRDataUrl(
  data: string,
  size: number,
  fgColor: string,
  bgColor: string
): Promise<string> {
  return QRCode.toDataURL(data, {
    width: size,
    margin: 1,
    color: {
      dark: fgColor,
      light: bgColor,
    },
    errorCorrectionLevel: 'M',
  });
}

/**
 * Draws a scannable QR code barcode containing all builder details onto the canvas.
 */
export async function drawBarcode(options: DrawBarcodeOptions): Promise<void> {
  const {
    ctx,
    builder,
    x,
    y,
    size,
    fgColor = '#000000',
    bgColor = '#FFFDF5',
    borderWidth = 4,
    borderColor = '#000000',
    shadowOffset = 5,
    labelText = '',
    labelColor = '#FFFDF5',
    labelFontSize = 11,
    idNumber,
    idNumberColor = '#FEE101',
    idNumberBg = '#000000',
    idNumberBorderColor = '#FEE101',
  } = options;

  // Encode builder data as vCard
  const vcardData = encodeBuilderData(builder);

  // Generate QR code image
  const qrDataUrl = await generateQRDataUrl(vcardData, size * 2, fgColor, bgColor);

  // Load QR as image
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });

  const padding = 8;
  const totalBoxW = size + padding * 2;
  const totalBoxH = size + padding * 2;
  const boxX = x - totalBoxW / 2;
  const boxY = y;

  ctx.save();

  // Hard shadow
  if (shadowOffset > 0) {
    ctx.fillStyle = '#000000';
    roundRect(
      ctx,
      boxX + shadowOffset,
      boxY + shadowOffset,
      totalBoxW,
      totalBoxH,
      8
    );
    ctx.fill();
  }

  // White background card for QR
  ctx.fillStyle = bgColor;
  roundRect(ctx, boxX, boxY, totalBoxW, totalBoxH, 8);
  ctx.fill();

  // Border
  if (borderWidth > 0) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
  }

  // Draw the QR code image inside the box with padding
  ctx.drawImage(qrImg, boxX + padding, boxY + padding, size, size);

  // ID Number badge on the down side of the QR
  if (idNumber) {
    const idY = boxY + totalBoxH + 5;
    const badgeFontSize = 13;
    ctx.font = `800 ${badgeFontSize}px "Space Mono", monospace`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const metrics = ctx.measureText(idNumber);
    const badgePadX = 12;
    const badgePadY = 5;
    const badgeW = metrics.width + badgePadX * 2;
    const badgeH = badgeFontSize + badgePadY * 2;
    const badgeX = x - badgeW / 2;
    const badgeCenterY = idY + badgeH / 2;

    // Hard Shadow
    ctx.fillStyle = '#000000';
    roundRect(ctx, badgeX + 3, idY + 3, badgeW, badgeH, 6);
    ctx.fill();

    // Badge Background
    ctx.fillStyle = idNumberBg;
    roundRect(ctx, badgeX, idY, badgeW, badgeH, 6);
    ctx.fill();

    // Badge Border
    ctx.lineWidth = 2;
    ctx.strokeStyle = idNumberBorderColor;
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = idNumberColor;
    ctx.fillText(idNumber, x, badgeCenterY + 1);
  } else if (labelText) {
    ctx.font = `700 ${labelFontSize}px "Space Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = labelColor;
    ctx.fillText(labelText, x, boxY + totalBoxH + 6);
  }

  ctx.restore();
}
