/**
 * HEIC/HEIF Conversion Utility with Dynamic Chunk Loading
 * Converts iOS/modern camera HEIC files into standard JPEG/PNG in the browser.
 */

export async function isHeicFile(file: File): Promise<boolean> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'heic' || ext === 'heif') return true;
  return file.type === 'image/heic' || file.type === 'image/heif';
}

export async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // Dynamic import to keep initial bundle tiny and fast
    const heic2any = (await import('heic2any')).default;
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.92,
    });

    const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');

    return new File([singleBlob], newName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('That HEIC photo couldn’t be converted on this device. Please try a JPG or PNG!');
  }
}
