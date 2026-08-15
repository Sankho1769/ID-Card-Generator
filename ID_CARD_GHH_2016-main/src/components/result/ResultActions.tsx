import React, { useState } from 'react';
import { Download, Share2, Users, RefreshCw, Copy, Check, SlidersHorizontal } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { downloadImage, sanitizeFilename } from '../../utils/image';
import { copyImageToClipboard, shareToXWithImage } from '../../utils/share';
import { StickerButton } from '../ui/StickerButton';
import { ShareModal } from './ShareModal';
import { fireGoaConfetti } from '../ui/Confetti';

export const ResultActions: React.FC = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const builder = useBuilderStore((state) => state.builder);
  const generatedDataUrl = useBuilderStore((state) => state.generatedDataUrl);
  const generatedBlob = useBuilderStore((state) => state.generatedBlob);
  const setActiveStep = useBuilderStore((state) => state.setActiveStep);
  const resetSingleBuilder = useBuilderStore((state) => state.resetSingleBuilder);
  const showToast = useBuilderStore((state) => state.showToast);

  const handleDownload = () => {
    if (!generatedDataUrl && !generatedBlob) {
      showToast('Image is still rendering...');
      return;
    }
    const filename = sanitizeFilename(builder.name);
    downloadImage(generatedDataUrl || generatedBlob!, filename);
    fireGoaConfetti();
    showToast(`Downloaded ${filename}! Ready for the internet 🚀`);
  };

  const handleShareToX = async () => {
    if (!generatedBlob && !generatedDataUrl) {
      showToast('Image is still rendering, please wait a second...');
      return;
    }

    setIsSharing(true);
    fireGoaConfetti();

    try {
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
    } catch (err) {
      console.error('Share to X error:', err);
      showToast('Could not open X. Please try again!');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedBlob) return;
    const success = await copyImageToClipboard(generatedBlob);
    if (success) {
      setIsCopied(true);
      showToast('Copied high-res image to clipboard! (Ctrl+V / ⌘+V)');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      showToast('Clipboard copy failed. Download instead!');
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Primary Download CTA */}
      <StickerButton
        variant="yellow"
        size="xl"
        fullWidth
        onClick={handleDownload}
        icon={<Download className="w-6 h-6 stroke-[2.5]" />}
      >
        DOWNLOAD PNG (1080×1350)
      </StickerButton>

      {/* Share to X CTA */}
      <StickerButton
        variant="pink"
        size="lg"
        fullWidth
        onClick={handleShareToX}
        icon={<Share2 className="w-5 h-5 stroke-[2.5]" />}
      >
        {isSharing ? 'OPENING X...' : 'SHARE TO X (#FrameInGoa)'}
      </StickerButton>

      <div className="grid grid-cols-2 gap-3">
        {/* Copy Image Button */}
        <button
          onClick={handleCopy}
          className="neo-button neo-button-cream text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-1.5"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          <span>{isCopied ? 'COPIED!' : 'COPY IMAGE'}</span>
        </button>

        {/* Crew Mode CTA */}
        <button
          onClick={() => setActiveStep('crew')}
          className="neo-button neo-button-green text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-1.5"
        >
          <Users className="w-4 h-4" />
          <span>ADD CREW 🌴</span>
        </button>
      </div>

      {/* Secondary Edit, Share Options & Make Another */}
      <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-bold">
        <button
          onClick={() => setActiveStep('builder')}
          className="text-[#FEE101] hover:underline uppercase flex items-center gap-1"
        >
          <span>← Edit Badge</span>
        </button>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="text-white/70 hover:text-white hover:underline uppercase flex items-center gap-1"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Options</span>
        </button>

        <button
          onClick={resetSingleBuilder}
          className="text-white/70 hover:text-white hover:underline uppercase flex items-center gap-1"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Make Another</span>
        </button>
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
