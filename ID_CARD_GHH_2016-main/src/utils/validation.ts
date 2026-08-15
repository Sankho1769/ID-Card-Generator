/**
 * File & Photo Validation Utility
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'jfif', 'svg', 'gif', 'bmp'];
const MAX_FILE_SIZE_MB = 35; // 35 MB max before resize
const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'No photo selected. Drop your face here!',
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isAcceptedExt = ACCEPTED_EXTENSIONS.includes(ext);
  const isAcceptedMime = file.type ? file.type.startsWith('image/') || ext === 'heic' || ext === 'heif' : true;

  if (!isAcceptedExt && !isAcceptedMime) {
    return {
      valid: false,
      error: 'That photo didn’t make it through the Goa gate 😭 Try a JPG, PNG or HEIC.',
    };
  }

  if (file.size > MAX_BYTES) {
    return {
      valid: false,
      error: `That image is massive (${(file.size / (1024 * 1024)).toFixed(1)}MB)! Keep it under ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}
