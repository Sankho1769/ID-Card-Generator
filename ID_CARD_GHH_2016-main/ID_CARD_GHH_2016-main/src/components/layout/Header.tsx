import React from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { ASSETS } from '../../data/assets';
import { Users, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const activeStep = useBuilderStore((state) => state.activeStep);
  const setActiveStep = useBuilderStore((state) => state.setActiveStep);
  const resetAll = useBuilderStore((state) => state.resetAll);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#032011]/95 backdrop-blur-md border-b-3 border-black px-4 md:px-8 py-2.5 md:py-3 shadow-[0_4px_0_0_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Official Hacker House Brand + 2:47 PM Studio Signature */}
        <div 
          onClick={() => setActiveStep('landing')}
          className="flex items-center gap-3 md:gap-4 cursor-pointer group select-none"
        >
          {/* Main Logo */}
          <img
            src={ASSETS.HACKER_HOUSE_LOGO.path}
            alt="Hacker House Goa 2026"
            className="h-7 sm:h-9 md:h-11 w-auto object-contain filter drop-shadow-[2px_2px_0px_#000000] group-hover:scale-105 transition-transform"
          />

          {/* Hindi Stamp */}
          <img
            src={ASSETS.GOA_HINDI_BADGE.path}
            alt="Goa Hindi Stamp"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain animate-spin-slow filter drop-shadow-[2px_2px_0px_#000000]"
          />

          {/* 2:47 PM STUDIO Official Logo PNG */}
          <img
            src={ASSETS.STUDIO_LOGO_PNG.path}
            alt="2:47 PM Studio"
            className="h-6 sm:h-8 md:h-9 w-auto object-contain filter drop-shadow-[2px_2px_0px_#000000] group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Right: Tactile Physical Sticker Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">

          <motion.button
            whileHover={{ y: -2, rotate: 1 }}
            whileTap={{ y: 1, rotate: 0 }}
            onClick={() => setActiveStep('crew')}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-lg border-2 md:border-3 border-black font-display text-xs md:text-sm font-black uppercase transition-colors
              ${activeStep === 'crew' || activeStep === 'crew-result'
                ? 'bg-[#FF0080] text-white shadow-[3px_3px_0px_0px_#000000]'
                : 'bg-[#FF0080] text-white hover:bg-[#ff1a8c] shadow-[3px_3px_0px_0px_#000000]'
              }
            `}
          >
            <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">The</span>
            <span>Crew 🌴</span>
          </motion.button>

          {activeStep !== 'landing' && (
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetAll}
              title="Reset & Start Fresh"
              className="p-2 rounded-lg bg-[#084E2A] text-[#FEE101] hover:bg-[#0B6839] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
