import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ASSETS } from '../../data/assets';

export interface LoadingSequenceProps {
  onComplete: () => void;
}

const STEPS = [
  { text: 'finding your frame...', duration: 500 },
  { text: 'adding some Goa magic...', duration: 600 },
  { text: 'minting your builder title...', duration: 500 },
  { text: 'shipping pixels to paradise...', duration: 400 },
];

export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStepIndex < STEPS.length) {
      timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, STEPS[currentStepIndex].duration);
    } else {
      timer = setTimeout(() => {
        onComplete();
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [currentStepIndex, onComplete]);

  const activeStep = STEPS[Math.min(currentStepIndex, STEPS.length - 1)];

  return (
    <div className="fixed inset-0 z-50 bg-[#02140A]/95 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#FFFDF5] text-black border-4 border-black p-8 rounded-3xl max-w-sm w-full shadow-[10px_10px_0px_0px_#000000] text-center flex flex-col items-center gap-6"
      >
        <div className="relative">
          <img
            src={ASSETS.GOA_HINDI_BADGE.path}
            alt=""
            className="w-24 h-24 animate-spin-slow"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#FF0080] animate-bounce" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display font-black text-2xl uppercase tracking-wider text-black">
            BUILDING YOUR ID...
          </h3>
          <p className="font-mono text-sm text-[#0B6839] font-bold h-6 animate-pulse">
            {activeStep.text}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                idx <= currentStepIndex ? 'bg-[#FF0080] scale-110' : 'bg-black/10'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
