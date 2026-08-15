import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { LivePreview } from '../components/generator/LivePreview';
import { ResultActions } from '../components/result/ResultActions';
import { StickerBadge } from '../components/ui/StickerBadge';
import { ASSETS } from '../data/assets';

export const Result: React.FC = () => {
  const builder = useBuilderStore((state) => state.builder);
  const setActiveStep = useBuilderStore((state) => state.setActiveStep);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col items-center gap-8">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between border-b-2 border-white/20 pb-4">
        <button
          onClick={() => setActiveStep('builder')}
          className="text-xs font-bold text-white/80 hover:text-white flex items-center gap-1.5 uppercase hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Editor</span>
        </button>

        <div className="flex items-center gap-2">
          <StickerBadge variant="pink" size="sm" rotation={1}>
            ✔ APPROVED TO SHIP
          </StickerBadge>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-[#FEE101] font-bold uppercase">
          <Sparkles className="w-4 h-4" />
          <span>OFFICIAL HH GOA 2026 PASSPORT</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight text-[#FFFDF5] leading-tight">
          YOUR BUILDER ID <br />
          <span className="text-[#FEE101] underline decoration-[#FF0080] decoration-wavy decoration-3">
            IS READY.
          </span>
        </h1>

        <p className="text-sm md:text-lg font-bold text-[#9AC95F] font-display uppercase tracking-wider mt-1">
          NOW GO SHOW THE INTERNET.
        </p>
      </div>

      {/* Main Showcase: Canvas Preview on Left/Center, Action Panel on Right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center pt-4">
        {/* Left/Center: High-Res Live Preview */}
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-6 flex justify-center"
        >
          <LivePreview />
        </motion.div>

        {/* Right: Actions & Details */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start gap-6 bg-[#084E2A] p-6 md:p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
          <div className="flex items-center gap-3">
            <img
              src={ASSETS.GOA_HINDI_BADGE.path}
              alt=""
              className="w-12 h-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-lg text-white uppercase">
                {builder.name || 'ANONYMOUS BUILDER'}
              </span>
              <span className="text-xs font-mono text-[#FEE101]">
                ⚡ {builder.builderTitle} · {builder.role || 'BUILDER'}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-white/80 leading-relaxed">
            Your high-resolution 1080 × 1350 px PNG is fully baked with official branding, stamps, and tropical Goa artwork. Download it or share it directly with <strong className="text-[#FEE101]">#FrameInGoa</strong> on X!
          </p>

          <ResultActions />
        </div>
      </div>
    </div>
  );
};
