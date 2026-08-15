import React from 'react';
import { motion } from 'framer-motion';
import { ASSETS } from '../../data/assets';

export const FloatingStickers: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle Creative Studio Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      {/* Subtle Rotating Goa Hindi Badge Watermark */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-12 left-4 md:left-12 opacity-15 w-24 md:w-36 select-none"
      >
        <img src={ASSETS.GOA_HINDI_BADGE.path} alt="" />
      </motion.div>
    </div>
  );
};
