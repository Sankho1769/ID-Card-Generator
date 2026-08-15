/**
 * X Sharing & Web Share API Integration
 */

import { sanitizeFilename, downloadImage } from './image';

export interface ShareDataPayload {
  name: string;
  role?: string;
  builderTitle?: string;
  imageBlob?: Blob | null;
  imageDataUrl?: string | null;
  isCrew?: boolean;
}

export function generateXCaption(payload: ShareDataPayload): string {
  if (payload.isCrew) {
    return `Just minted our official HH Goa 2026 Crew Frame! 🌴🔥

We came to ship in Goa.

#FrameInGoa #HHGoa @HackerHouseGoa`;
  }

  const roleText = payload.role ? ` building at the intersection of ${payload.role}` : '';
  return `Just got my HH Goa Builder ID 🌴

I'm a ${payload.builderTitle || 'BUILDER'}${roleText}.

See you in Goa.

#FrameInGoa #HHGoa`;
}

export function getXTweetUrl(caption: string, url?: string): string {
  const params = new URLSearchParams();
  params.set('text', caption);
  if (url) {
    params.set('url', url);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Detects if the user is running on a mobile device (iOS, Android, etc.)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent))
  );
}

/**
 * Gets the native app deep link for X (Twitter) on mobile devices
 */
export function getXMobileAppUrl(caption: string): string {
  return `twitter://post?message=${encodeURIComponent(caption)}`;
}

/**
 * Checks if the browser supports sharing direct image files
 */
export function canWebShareFiles(): boolean {
  if (!navigator.share || !navigator.canShare) return false;
  try {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch {
    return false;
  }
}

/**
 * Executes Web Share API with image file attachment
 */
export async function shareWithNativeApi(payload: {
  title: string;
  text: string;
  file: File;
}): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({
      title: payload.title,
      text: payload.text,
      files: [payload.file],
    });
    return true;
  } catch (err: any) {
    if (err.name === 'AbortError') return false; // user dismissed share sheet
    console.warn('Native share failed:', err);
    return false;
  }
}

/**
 * Copies PNG Blob directly to system clipboard
 */
export async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
    return true;
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return false;
  }
}

export interface ShareToXParams {
  name: string;
  role?: string;
  builderTitle?: string;
  blob?: Blob | null;
  dataUrl?: string | null;
  isCrew?: boolean;
}

/**
 * High-level helper to share directly to X with the image:
 * 1. On Mobile: Invokes native sharing with the image File attached, so choosing X directly opens the X app with the image attached!
 *    Falls back to deep link/web if native file sharing is unavailable.
 * 2. On Desktop: Copies image to clipboard, downloads PNG, and opens the X website in a new tab (press Ctrl+V / ⌘+V on X to paste).
 */
export async function shareToXWithImage(
  params: ShareToXParams,
  onToast?: (msg: string) => void
): Promise<void> {
  const caption = generateXCaption({
    name: params.name,
    role: params.role,
    builderTitle: params.builderTitle,
    isCrew: params.isCrew,
  });

  const encodedCaption = encodeURIComponent(caption);
  const webUrl = `https://twitter.com/intent/tweet?text=${encodedCaption}`;
  const mobileAppUrl = `twitter://post?message=${encodedCaption}`;
  const filename = sanitizeFilename(params.name || (params.isCrew ? 'crew' : 'builder'));
  const isMobile = isMobileDevice();

  // 1. Copy image to clipboard as immediate convenience
  let copied = false;
  if (params.blob) {
    copied = await copyImageToClipboard(params.blob);
  }

  // 2. Also trigger PNG download
  if (params.dataUrl || params.blob) {
    downloadImage(params.dataUrl || params.blob!, filename);
  }

  // 3. Mobile flow with image attachment
  if (isMobile) {
    // If browser supports native file sharing (iOS Safari, Android Chrome, etc.),
    // this passes the image file directly into the X App composer with the image attached!
    if (params.blob && canWebShareFiles()) {
      try {
        const file = new File([params.blob], filename, { type: 'image/png' });
        const shared = await shareWithNativeApi({
          title: params.isCrew ? 'HH Goa 2026 Crew Frame' : 'HH Goa 2026 Builder Passport',
          text: caption,
          file,
        });
        if (shared) {
          onToast?.('Shared to X with image attached! 🌴');
          return;
        }
      } catch (err) {
        console.warn('Native share with file failed, falling back:', err);
      }
    }

    // Fallback on mobile: Deep link to open the native X / Twitter App
    onToast?.(
      copied
        ? '🚀 Opening X App! Image copied to clipboard — paste (or attach) directly in your post!'
        : '🚀 Opening X App! Image saved to your device — attach it to your post!'
    );

    const start = Date.now();
    window.location.href = mobileAppUrl;

    setTimeout(() => {
      if (document.visibilityState === 'visible' && Date.now() - start < 2500) {
        window.location.href = webUrl;
      }
    }, 1200);
  } else {
    // Desktop flow: Open X website in a new tab
    window.open(webUrl, '_blank', 'noopener,noreferrer');

    if (copied) {
      onToast?.('🚀 Opening X! Image copied to clipboard — press Ctrl+V (or ⌘+V) in the tweet box to attach it!');
    } else {
      onToast?.('🚀 Opening X! Image saved to Downloads — attach it to your post!');
    }
  }
}
