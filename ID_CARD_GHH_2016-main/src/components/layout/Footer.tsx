import React from 'react';
import { ASSETS } from '../../data/assets';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-[#02140A] border-t-3 border-black text-[#FFFDF5] pt-10 pb-12 px-4 md:px-8 overflow-hidden">
      {/* Background Palm Tree Silhouettes */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <img
          src={ASSETS.FOOTER_TREES.path}
          alt="Goa palm trees"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand & Mission */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <img
              src={ASSETS.HACKER_HOUSE_LOGO.path}
              alt="Hacker House Goa"
              className="h-7 object-contain"
            />
            <span className="bg-[#FEE101] text-black font-display text-[11px] font-black px-2 py-0.5 rounded border border-black">
              GOA 2026
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/70 max-w-sm">
            Put a face to the builder. The official collectible Builder Passport & Crew Frame generator for Hacker House Goa 2026.
          </p>
        </div>

        {/* Official Hashtag Stamp */}
        <div className="flex flex-col items-center gap-2">
          <div className="px-4 py-2 rounded-lg bg-[#FF0080] text-white border-2 border-black font-display font-black text-sm shadow-[3px_3px_0px_0px_#000000] rotate-[-2deg]">
            #FrameInGoa · #HHGoa
          </div>
          <span className="text-[11px] text-white/50 font-mono">
            BUILD · SHIP · BREAK · REPEAT
          </span>
        </div>

        {/* Social Icons from official Assets */}
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/intent/tweet?text=Building%20at%20%23HHGoa%202026%20🌴%20%23FrameInGoa"
            target="_blank"
            rel="noopener noreferrer"
            title="Share on X"
            className="p-2.5 rounded-lg bg-[#084E2A] hover:bg-[#0B6839] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-transform hover:-translate-y-0.5"
          >
            <img src={ASSETS.ICON_X_TWITTER.path} alt="X (Twitter)" className="w-5 h-5 object-contain" />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram Community"
            className="p-2.5 rounded-lg bg-[#084E2A] hover:bg-[#0B6839] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-transform hover:-translate-y-0.5"
          >
            <img src={ASSETS.ICON_TELEGRAM.path} alt="Telegram" className="w-5 h-5 object-contain" />
          </a>
          <a
            href="mailto:contact@hackerhouse.in"
            title="Contact Organizers"
            className="p-2.5 rounded-lg bg-[#084E2A] hover:bg-[#0B6839] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-transform hover:-translate-y-0.5"
          >
            <img src={ASSETS.ICON_MAIL.path} alt="Email" className="w-5 h-5 object-contain" />
          </a>
        </div>
      </div>
    </footer>
  );
};
