import React from 'react';

export interface StickerBadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'pink' | 'green' | 'cream' | 'dark';
  rotation?: number; // degrees
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  children,
  variant = 'yellow',
  rotation = 0,
  className = '',
  size = 'md',
}) => {
  const variantStyles = {
    yellow: 'bg-[#FEE101] text-black border-black',
    pink: 'bg-[#FF0080] text-white border-black',
    green: 'bg-[#0B6839] text-[#FFFDF5] border-black',
    cream: 'bg-[#FFFDF5] text-black border-black',
    dark: 'bg-[#032011] text-[#FEE101] border-[#FEE101]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_#000000]',
    md: 'px-3.5 py-1.5 text-xs md:text-sm font-extrabold shadow-[3px_3px_0px_0px_#000000]',
    lg: 'px-5 py-2 text-sm md:text-base font-black shadow-[4px_4px_0px_0px_#000000]',
  };

  return (
    <span
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`
        inline-flex items-center justify-center
        rounded-md border-2 font-display uppercase tracking-wider
        select-none whitespace-nowrap
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
