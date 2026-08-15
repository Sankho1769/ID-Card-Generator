import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Wand2 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { LivePreview } from '../components/generator/LivePreview';
import { PhotoAdjuster } from '../components/upload/PhotoAdjuster';
import { UploadZone } from '../components/upload/UploadZone';
import { DetailsForm } from '../components/builder/DetailsForm';
import { StyleSelector } from '../components/builder/StyleSelector';
import { StickerButton } from '../components/ui/StickerButton';
import { StickerBadge } from '../components/ui/StickerBadge';
import { LoadingSequence } from '../components/generator/LoadingSequence';
import { fireGoaConfetti } from '../components/ui/Confetti';
import { ASSETS } from '../data/assets';

export const Create: React.FC = () => {
  const [showLoadingSeq, setShowLoadingSeq] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);

  const builder = useBuilderStore((state) => state.builder);
  const setPhotoZoom = useBuilderStore((state) => state.setPhotoZoom);
  const setPhotoPosition = useBuilderStore((state) => state.setPhotoPosition);
  const setStyle = useBuilderStore((state) => state.setStyle);
  const setActiveStep = useBuilderStore((state) => state.setActiveStep);
  const showToast = useBuilderStore((state) => state.showToast);

  const handleGenerate = () => {
    if (!builder.photo) {
      showToast('Please upload a photo of your face first! 🌴');
      return;
    }
    if (!builder.name || builder.name.trim().length === 0) {
      showToast('Please enter your builder name!');
      return;
    }

    setShowLoadingSeq(true);
  };

  const onLoadingComplete = () => {
    setShowLoadingSeq(false);
    fireGoaConfetti();
    setActiveStep('result');
  };

  return (
    <div className="relative min-h-[calc(100vh-75px)] w-full overflow-hidden">
      {/* Official "sun rise 2.png" Background Fully Filling Screen */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <img
          src={ASSETS.SUN_RISE_2.path}
          alt="Goa Sunrise 2"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-[#032011]/60 bg-grid-pattern opacity-50" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col gap-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-white/20 pb-4">
          <button
            onClick={() => setActiveStep('landing')}
            className="self-start text-xs font-bold text-white/80 hover:text-white flex items-center gap-1.5 uppercase hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={ASSETS.STUDIO_EMBLEM.path}
              alt="Studio Emblem"
              className="h-8 md:h-10 w-auto object-contain filter drop-shadow-[2px_2px_0px_#000000]"
            />
            <StickerBadge variant="yellow" size="sm" rotation={-1}>
              PASSPORT STUDIO
            </StickerBadge>
            <span className="text-xs font-mono text-[#FFFDF5]">1080 × 1350</span>
          </div>
        </div>

        {/* Main Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Canvas Preview */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4 lg:sticky lg:top-24">
            <div className="flex items-center justify-between w-full max-w-[420px]">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FEE101] font-display flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> LIVE PASSPORT PREVIEW
              </span>
              <span className="text-[11px] font-mono text-white/60">EXACT OUTPUT</span>
            </div>

            <LivePreview />
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6 bg-[#084E2A]/95 backdrop-blur-sm p-5 md:p-8 rounded-3xl border-3 border-black shadow-[6px_6px_0px_0px_#000000]">
            {/* 1. Photo Section */}
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#FFFDF5] font-display">
                1. BUILDER PHOTO
              </span>

              {!builder.photo || isChangingPhoto ? (
                <div className="flex flex-col gap-2">
                  <UploadZone
                    onPhotoProcessed={() => {
                      setIsChangingPhoto(false);
                    }}
                  />
                  {builder.photo && (
                    <button
                      onClick={() => setIsChangingPhoto(false)}
                      className="text-xs text-white/80 hover:underline text-center mt-1"
                    >
                      Cancel & Keep Current Photo
                    </button>
                  )}
                </div>
              ) : (
                <PhotoAdjuster
                  photo={builder.photo}
                  zoom={builder.photoZoom}
                  panX={builder.photoPosition.x}
                  panY={builder.photoPosition.y}
                  onChangeZoom={setPhotoZoom}
                  onChangePan={setPhotoPosition}
                  onChangePhotoClick={() => setIsChangingPhoto(true)}
                />
              )}
            </div>

            {/* 2. Builder Details & Title */}
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#FFFDF5] font-display">
                2. BUILDER IDENTITY
              </span>
              <DetailsForm />
            </div>

            {/* 3. Style Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#FFFDF5] font-display">
                3. VISUAL STYLE
              </span>
              <StyleSelector
                selectedStyle={builder.style}
                onSelectStyle={setStyle}
              />
            </div>

            {/* 4. Generation CTA Button */}
            <div className="pt-4 border-t-2 border-black/30 flex flex-col gap-2">
              <StickerButton
                variant="yellow"
                size="xl"
                fullWidth
                onClick={handleGenerate}
                icon={<Wand2 className="w-5 h-5 stroke-[2.5]" />}
              >
                MINT MY BUILDER PASSPORT →
              </StickerButton>
              <p className="text-[11px] text-center text-white/60 font-mono">
                Generates a crisp 1080 × 1350 PNG ready for X and social sharing.
              </p>
            </div>
          </div>
        </div>

        {showLoadingSeq && (
          <LoadingSequence onComplete={onLoadingComplete} />
        )}
      </div>
    </div>
  );
};
