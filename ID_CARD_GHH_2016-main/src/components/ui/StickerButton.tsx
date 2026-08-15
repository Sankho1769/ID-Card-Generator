import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface StickerButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'yellow' | 'pink' | 'green' | 'cream' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const StickerButton: React.FC<StickerButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  icon,
  children,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    yellow: 'bg-[#FEE101] text-black hover:bg-[#ffe833] border-black',
    pink: 'bg-[#FF0080] text-white hover:bg-[#ff1a8c] border-black',
    green: 'bg-[#0B6839] text-[#FFFDF5] hover:bg-[#0d7d45] border-black',
    cream: 'bg-[#FFFDF5] text-black hover:bg-[#f0ebe0] border-black',
    dark: 'bg-[#02140A] text-[#FFFDF5] hover:bg-[#042815] border-black',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5 shadow-[2px_2px_0px_0px_#000000]',
    md: 'px-5 py-2.5 text-sm font-extrabold gap-2 shadow-[4px_4px_0px_0px_#000000]',
    lg: 'px-7 py-3.5 text-base font-extrabold gap-2.5 shadow-[5px_5px_0px_0px_#000000]',
    xl: 'px-9 py-4 text-lg font-black gap-3 shadow-[6px_6px_0px_0px_#000000]',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, rotate: -0.5, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98, y: 2, boxShadow: '2px 2px 0px 0px #000000' }}
      className={`
        inline-flex items-center justify-center
        rounded-lg border-2 md:border-3 font-display uppercase tracking-wider
        transition-colors cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
