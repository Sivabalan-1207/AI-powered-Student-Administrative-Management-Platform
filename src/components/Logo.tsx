import React from 'react';

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ iconOnly = false, className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon SVG with Purple & Electric Blue Gradient */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 via-purple-600 to-blue-600 text-white shadow-md shadow-purple-900/20 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5"
        >
          {/* Graduation Cap */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>

        {/* Verified Badge Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 border-2 border-white"></span>
        </span>
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-slate-900 ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-lg' : 'text-xl'}`}>
              Campus<span className="text-gradient-purple-blue">Connect</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 rounded-md border border-purple-200">
              AI Hub
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide -mt-0.5">
            Smart Education Platform
          </span>
        </div>
      )}
    </div>
  );
};
