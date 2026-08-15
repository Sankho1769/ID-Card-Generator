/**
 * High-performance Image Utilities & Rescaling
 */

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Only set crossOrigin for remote HTTP URLs, NOT data: or blob:
    if (src.startsWith('http://') || src.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error('Image load failed for src:', src.slice(0, 100), err);
      reject(new Error('Failed to load image.'));
    };
    img.src = src;
  });
}

/**
 * Reads a File into a Data URL string
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Downscales huge photos (e.g. 48MP) to reasonable dimensions (max 1600px)
 * for instant 60fps canvas dragging and rendering.
 * Falls back gracefully to original dataUrl if canvas downscaling encounters issues.
 */
export async function optimizeUserPhoto(file: File): Promise<string> {
  // First, get the direct Data URL
  const dataUrl = await fileToDataUrl(file);

  try {
    const img = await loadImage(dataUrl);
    const MAX_DIM = 1600;
    let { width, height } = img;

    if (width <= MAX_DIM && height <= MAX_DIM) {
      return dataUrl;
    }

    if (width > height) {
      if (width > MAX_DIM) {
        height = Math.round((height * MAX_DIM) / width);
        width = MAX_DIM;
      }
    } else {
      if (height > MAX_DIM) {
        width = Math.round((width * MAX_DIM) / height);
        height = MAX_DIM;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.92);
  } catch (err) {
    console.warn('Canvas optimization skipped, using raw dataUrl:', err);
    return dataUrl;
  }
}

/**
 * Generates a clean, sanitized filename for download
 */
export function sanitizeFilename(name: string, prefix = 'hh-goa-2026'): string {
  const cleanName = (name || 'builder')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${prefix}-${cleanName || 'builder'}.png`;
}

/**
 * Triggers native browser download for a data URL or Blob
 */
export function downloadImage(dataUrlOrBlob: string | Blob, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;

  if (typeof dataUrlOrBlob === 'string') {
    link.href = dataUrlOrBlob;
  } else {
    link.href = URL.createObjectURL(dataUrlOrBlob);
  }

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof dataUrlOrBlob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}
