import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Users } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { ASSETS } from '../data/assets';
import { StickerButton } from '../components/ui/StickerButton';
import { StickerBadge } from '../components/ui/StickerBadge';
import { UploadZone } from '../components/upload/UploadZone';

export const Home: React.FC = () => {
  const setActiveStep = useBuilderStore((state) => state.setActiveStep);

  return (
    <div className="relative min-h-[calc(100vh-75px)] flex flex-col justify-between overflow-hidden">
      {/* Official "footer trees.png" Background Fully Filling the Screen */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <img
          src={ASSETS.FOOTER_TREES.path}
          alt="Goa Palm Trees"
          className="w-full h-full object-cover object-center opacity-45"
        />
        {/* Subtle studio gradient overlay for high text contrast */}
        <div className="absolute inset-0 bg-[#032011]/50 bg-grid-pattern opacity-60" />
      </div>

      {/* Main Hero Container — Tightened Vertical Rhythm */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-4 md:pt-6 pb-12 flex flex-col items-center text-center gap-5 md:gap-7">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <StickerBadge variant="yellow" size="sm" rotation={-1.5}>
            🌴 HACKER HOUSE GOA 2026
          </StickerBadge>
          <StickerBadge variant="pink" size="sm" rotation={1.5}>
            #FrameInGoa
          </StickerBadge>
          <span className="text-[11px] md:text-xs font-mono font-bold text-white bg-black/80 border-2 border-white/30 px-3 py-0.5 rounded-full shadow-[2px_2px_0px_0px_#000000]">
            OFFICIAL BUILDER PASSPORT
          </span>
        </div>

        {/* Hero Headline */}
        <div className="flex flex-col items-center gap-1.5 max-w-3xl">
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase leading-[0.96] text-[#FFFDF5] drop-shadow-[4px_4px_0px_#000000]">
            BUILD YOUR <br />
            <span className="text-[#FEE101] underline decoration-[#FF0080] decoration-wavy decoration-3 md:decoration-4">
              HH GOA ID
            </span>
          </h1>

          <p className="font-display font-black text-base sm:text-xl md:text-2xl uppercase tracking-wider text-[#9AC95F] mt-1.5">
            PUT A FACE TO THE BUILDER.
          </p>

          <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-lg font-medium">
            Pick a photo. Pick your vibe. Claim your builder title and mint your HH Goa passport.
          </p>
        </div>

        {/* Pinned Upload Card — The Signature Tactile Object */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-xl bg-[#084E2A]/95 backdrop-blur-sm p-4 sm:p-6 md:p-7 rounded-3xl border-3 md:border-4 border-black shadow-[8px_8px_0px_0px_#000000] flex flex-col gap-4"
        >
          {/* Top-Left Washi Tape Accent */}
          <div className="absolute -top-3 left-6 washi-tape px-3 py-0.5 text-[10px] font-mono font-black text-black uppercase rotate-[-3deg] select-none pointer-events-none">
            📌 PINNED FOR GOA
          </div>

          {/* Top-Right Goa Moment Stamp */}
          <div className="absolute -top-3 right-6 washi-tape-pink px-2.5 py-0.5 text-[10px] font-mono font-black text-white uppercase rotate-[2.5deg] select-none pointer-events-none">
            🌴 GOA · 2026
          </div>

          {/* Interactive Upload Dropzone */}
          <UploadZone
            onPhotoProcessed={() => {
              setActiveStep('builder');
            }}
          />

          {/* Card Footer: Microcopy & Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t-2 border-black/30">
            {/* Microcopy with diamond bullet markers */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] md:text-xs font-mono text-white/90 font-bold">
              <span>◈ No signup</span>
              <span className="text-[#FEE101]">·</span>
              <span>◈ No waiting</span>
              <span className="text-[#FEE101]">·</span>
              <span>◈ Instant PNG</span>
            </div>

            {/* Signature CTA Button */}
            <StickerButton
              variant="yellow"
              size="md"
              onClick={() => setActiveStep('builder')}
              icon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            >
              BUILD MY ID →
            </StickerButton>
          </div>
        </motion.div>

        {/* Lower Section: Crew Mode Teaser */}
        <div className="w-full max-w-4xl pt-2 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FEE101]" />
            <span className="font-display font-black text-xs md:text-sm uppercase tracking-widest text-[#FEE101]">
              DESIGNED FOR BUILDERS WHO SHIP
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#FEE101]" />
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden border-3 border-black bg-black/85 shadow-[5px_5px_0px_0px_#000000] p-3.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-left">
              <img
                src={ASSETS.GOA_HINDI_BADGE.path}
                alt="Goa Badge"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain flex-shrink-0 animate-spin-slow filter drop-shadow-[2px_2px_0px_#000000]"
              />
              <div className="flex flex-col gap-0.5">
                <h4 className="font-display font-black text-sm sm:text-base md:text-lg uppercase text-[#FFFDF5]">
                  HACKING WITH YOUR SQUAD?
                </h4>
                <p className="text-xs text-white/80">
                  Generate a 1600 × 900 landscape poster featuring up to 3 builders with Crew Mode.
                </p>
              </div>
            </div>

            <StickerButton
              variant="pink"
              size="sm"
              onClick={() => setActiveStep('crew')}
              icon={<Users className="w-4 h-4 stroke-[2.5]" />}
            >
              BUILD WITH CREW 🌴
            </StickerButton>
          </div>
        </div>

      </div>
    </div>
  );
};
