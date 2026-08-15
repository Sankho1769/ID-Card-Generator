import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, Sparkles, Loader2 } from 'lucide-react';
import { validateImageFile } from '../../utils/validation';
import { isHeicFile, convertHeicToJpeg } from '../../utils/heic';
import { optimizeUserPhoto } from '../../utils/image';
import { useBuilderStore } from '../../store/builderStore';

export interface UploadZoneProps {
  onPhotoProcessed?: (dataUrl: string) => void;
  compact?: boolean;
  label?: string;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onPhotoProcessed,
  compact = false,
  label,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const setPhoto = useBuilderStore((state) => state.setPhoto);
  const showToast = useBuilderStore((state) => state.showToast);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid file format');
        return;
      }

      setIsProcessing(true);
      try {
        let processedFile = file;
        const isHeic = await isHeicFile(file);

        if (isHeic) {
          setStatusMessage('Converting HEIC image to high-res JPEG...');
          processedFile = await convertHeicToJpeg(file);
        } else {
          setStatusMessage('Processing photo for passport...');
        }

        const optimizedDataUrl = await optimizeUserPhoto(processedFile);

        // Update store with uploaded photo
        setPhoto(optimizedDataUrl, processedFile);

        if (onPhotoProcessed) {
          onPhotoProcessed(optimizedDataUrl);
        }

        showToast('Photo loaded successfully! Looking sharp in Goa 🌴');
      } catch (err: any) {
        console.error('File processing error:', err);
        showToast(err.message || 'Something went sideways with that photo. Try again!');
      } finally {
        setIsProcessing(false);
        setStatusMessage('');
      }
    },
    [onPhotoProcessed, setPhoto, showToast]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleFile(acceptedFiles[0]);
      }
    },
    [handleFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.jfif', '.bmp', '.gif'],
    },
    maxFiles: 1,
    disabled: isProcessing,
    noClick: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden cursor-pointer rounded-2xl border-3 border-dashed
        transition-all duration-200 text-center select-none group bg-[#021A0D]/70
        ${isDragActive
          ? 'border-[#FF0080] bg-[#FF0080]/15 scale-[1.01] shadow-[0_0_15px_rgba(255,0,128,0.3)]'
          : 'border-[#FEE101]/80 hover:border-[#FEE101] hover:bg-[#021A0D]/90'
        }
        ${compact ? 'p-4' : 'p-5 sm:p-7 md:p-8'}
      `}
    >
      <input {...getInputProps()} />

      {/* Screen-Printed Corner Crosshairs */}
      <div className="absolute top-2 left-2 text-[#FEE101]/40 font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute top-2 right-2 text-[#FEE101]/40 font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute bottom-2 left-2 text-[#FEE101]/40 font-mono text-[10px] select-none pointer-events-none">+</div>
      <div className="absolute bottom-2 right-2 text-[#FEE101]/40 font-mono text-[10px] select-none pointer-events-none">+</div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <Loader2 className="w-9 h-9 text-[#FEE101] animate-spin" />
          <p className="text-sm font-bold text-[#FFFDF5] font-display uppercase tracking-wider animate-pulse">
            {statusMessage || 'Processing Photo...'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2.5">
          {/* Tactile Sticker Icon */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            className="w-13 h-13 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[#FEE101] text-black border-3 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center group-hover:shadow-[5px_5px_0px_0px_#000000] transition-all"
          >
            {isDragActive ? (
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-black animate-bounce stroke-[2.5]" />
            ) : (
              <UploadCloud className="w-6 h-6 md:w-7 md:h-7 text-black stroke-[2.5]" />
            )}
          </motion.div>

          <div className="flex flex-col gap-0.5">
            <h3 className="font-display font-black text-base sm:text-lg md:text-xl uppercase tracking-wider text-[#FFFDF5]">
              {label || (isDragActive ? 'DROP YOUR PHOTO HERE!' : 'DROP YOUR PHOTO HERE')}
            </h3>
            <p className="text-xs md:text-sm text-[#FEE101] font-extrabold tracking-wide">
              or click to browse from device / camera
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase bg-black/60 border border-white/25 px-2.5 py-0.5 rounded-full text-white/90">
              JPG · PNG · HEIC · WEBP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
