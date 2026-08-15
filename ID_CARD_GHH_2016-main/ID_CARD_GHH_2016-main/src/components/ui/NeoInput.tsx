import React from 'react';

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  helperText,
  badge,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#FFFDF5] font-display">
          {label}
        </label>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEE101] text-black border border-black uppercase">
            {badge}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-black/60 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-[#FFFDF5] text-black font-semibold text-sm md:text-base
            rounded-lg border-2 border-black px-4 py-3
            shadow-[3px_3px_0px_0px_#000000]
            placeholder:text-black/40
            focus:outline-none focus:ring-2 focus:ring-[#FEE101] focus:border-black
            transition-all
            ${icon ? 'pl-11' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {helperText && (
        <p className="text-[11px] text-gray-300 font-mono tracking-tight">{helperText}</p>
      )}
    </div>
  );
};
