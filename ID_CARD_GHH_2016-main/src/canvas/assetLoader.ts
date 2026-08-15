/**
 * High-performance Asset Preloader & Cache for Canvas Rendering
 */
import { ALL_ASSETS } from '../data/assets';

const imageCache: Map<string, HTMLImageElement> = new Map();
const loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

export async function loadCanvasAsset(path: string): Promise<HTMLImageElement> {
  if (imageCache.has(path)) {
    return imageCache.get(path)!;
  }

  if (loadingPromises.has(path)) {
    return loadingPromises.get(path)!;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(path, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn(`Failed to load asset at ${path}`, err);
      reject(err);
    };
    img.src = path;
  });

  loadingPromises.set(path, promise);
  return promise;
}

/**
 * Preloads all official assets in the background
 */
export async function preloadAllAssets(): Promise<void> {
  const promises = ALL_ASSETS.map((asset) => loadCanvasAsset(asset.path).catch(() => null));
  await Promise.all(promises);
}
