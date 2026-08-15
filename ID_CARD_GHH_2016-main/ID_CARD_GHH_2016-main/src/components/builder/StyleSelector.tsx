import React from 'react';
import { motion } from 'framer-motion';
import { STYLE_LIST, StyleId } from '../../data/styles';
import { Palmtree, Zap, Sun, Check } from 'lucide-react';

export interface StyleSelectorProps {
  selectedStyle: StyleId;
  onSelectStyle: (style: StyleId) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  const getIcon = (id: StyleId) => {
    switch (id) {
      case 'beach-club':
        return <Palmtree className="w-5 h-5" />;
      case 'night-hacker':
        return <Zap className="w-5 h-5" />;
      case 'goa-sunset':
        return <Sun className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#FFFDF5] font-display flex items-center gap-2">
          <span>PICK YOUR VIBE</span>
          <span className="text-[11px] font-mono text-[#FEE101]">3 STYLES</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STYLE_LIST.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectStyle(style.id)}
              className={`
                relative p-4 rounded-xl border-3 cursor-pointer select-none transition-all flex flex-col justify-between gap-3
                ${isSelected
                  ? 'border-black bg-[#FFFDF5] text-black shadow-[5px_5px_0px_0px_#000000] ring-3 ring-[#FEE101]'
                  : 'border-white/30 bg-[#084E2A]/50 text-[#FFFDF5] hover:border-white/60 hover:bg-[#084E2A]'
                }
              `}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 bg-[#FF0080] text-white p-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg border-2 border-black ${isSelected ? 'bg-[#FEE101] text-black' : 'bg-black/40 text-[#FEE101]'}`}>
                  {getIcon(style.id)}
                </div>
                <div className="flex gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full border border-black"
                    style={{ backgroundColor: style.accentColor }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black"
                    style={{ backgroundColor: style.frameColor }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-display font-black text-sm md:text-base uppercase tracking-wider">
                  {style.name}
                </h4>
                <p className={`text-[11px] font-mono leading-tight mt-0.5 ${isSelected ? 'text-black/70' : 'text-white/70'}`}>
                  {style.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
