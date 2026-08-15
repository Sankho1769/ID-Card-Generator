import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Share2 } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { generateXCaption, shareWithNativeApi, canWebShareFiles, copyImageToClipboard, shareToXWithImage } from '../../utils/share';
import { sanitizeFilename } from '../../utils/image';
import { StickerButton } from '../ui/StickerButton';
import { ASSETS } from '../../data/assets';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);

  const builder = useBuilderStore((state) => state.builder);
  const generatedBlob = useBuilderStore((state) => state.generatedBlob);
  const generatedDataUrl = useBuilderStore((state) => state.generatedDataUrl);
  const showToast = useBuilderStore((state) => state.showToast);

  if (!isOpen) return null;

  const caption = generateXCaption({
    name: builder.name,
    role: builder.role,
    builderTitle: builder.builderTitle,
  });

  const handleOpenX = async () => {
    await shareToXWithImage(
      {
        name: builder.name,
        role: builder.role,
        builderTitle: builder.builderTitle,
        blob: generatedBlob,
        dataUrl: generatedDataUrl,
        isCrew: false,
      },
      (msg) => showToast(msg)
    );
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      showToast('Caption copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy text.');
    }
  };

  const handleCopyImage = async () => {
    if (!generatedBlob) return;
    const success = await copyImageToClipboard(generatedBlob);
    if (success) {
      setImgCopied(true);
      showToast('Image copied to clipboard! (Ctrl+V / ⌘+V to paste)');
      setTimeout(() => setImgCopied(false), 2500);
    } else {
      showToast('Clipboard image paste not supported on this browser. Download instead!');
    }
  };

  const handleNativeShare = async () => {
    if (!generatedBlob) return;
    const file = new File([generatedBlob], sanitizeFilename(builder.name), {
      type: 'image/png',
    });
    const shared = await shareWithNativeApi({
      title: 'HH Goa 2026 Builder Passport',
      text: caption,
      file,
    });
    if (shared) {
      showToast('Shared successfully!');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#FFFDF5] text-black border-4 border-black p-6 rounded-3xl max-w-lg w-full shadow-[10px_10px_0px_0px_#000000] flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2">
              <img src={ASSETS.ICON_X_TWITTER.path} alt="X" className="w-5 h-5 object-contain bg-black p-0.5 rounded" />
              <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-wider">
                SHARE TO X (TWITTER)
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-black/10 transition-colors"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Tweet Caption Box */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase text-black/70 font-display">
              X POST PREVIEW (#FrameInGoa)
            </label>
            <div className="bg-[#032011] text-[#FFFDF5] p-4 rounded-xl border-2 border-black font-sans text-xs md:text-sm whitespace-pre-wrap leading-relaxed shadow-inner">
              {caption}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Direct Tweet Intent Button with Image flow */}
            <StickerButton
              variant="yellow"
              size="lg"
              fullWidth
              onClick={handleOpenX}
              icon={<ExternalLink className="w-4 h-4" />}
            >
              OPEN POST ON X (WITH IMAGE) →
            </StickerButton>

            {/* Mobile Native Web Share if supported */}
            {canWebShareFiles() && (
              <StickerButton
                variant="pink"
                size="md"
                fullWidth
                onClick={handleNativeShare}
                icon={<Share2 className="w-4 h-4" />}
              >
                SHARE PHOTO DIRECTLY
              </StickerButton>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyCaption}
                className="neo-button neo-button-cream text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED!' : 'COPY TEXT'}</span>
              </button>

              <button
                onClick={handleCopyImage}
                className="neo-button neo-button-cream text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5"
              >
                {imgCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{imgCopied ? 'IMAGE COPIED!' : 'COPY IMAGE'}</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-black/60 font-mono">
            Tip: Attach your downloaded PNG to get high engagement on X! 🌴
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
