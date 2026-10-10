import React from 'react';

export interface NexusLogoProps {
  variant?: 'icon' | 'full' | 'banner';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  variant = 'full',
  size = 'md',
  showBadge = true,
  theme = 'light',
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const imageSrc = '/logo.jpg';

  const logoIcon = (
    <div
      className={`relative ${sizeMap[size]} rounded-lg overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-200/60 shadow-xs shrink-0 transition-opacity group-hover:opacity-90`}
    >
      <img
        src={imageSrc}
        alt="Nexus Clínico Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-lg"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`} onClick={onClick}>
        {logoIcon}
      </div>
    );
  }

  const isLight = theme === 'light';

  const titleBlock = (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span
          className={`font-sans font-semibold text-base sm:text-lg tracking-tight leading-none truncate ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Nexus{' '}
          <span className={isLight ? 'text-teal-700 font-semibold' : 'text-teal-300 font-semibold'}>
            Clínico
          </span>
        </span>
        {showBadge && (
          <span
            className={`hidden md:inline-block font-mono text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.2 rounded shrink-0 ${
              isLight
                ? 'bg-slate-100 text-slate-600 border border-slate-200/70'
                : 'bg-teal-900/60 text-teal-200 border border-teal-700/60'
            }`}
          >
            APS / SUS
          </span>
        )}
      </div>
      <span
        className={`hidden sm:inline font-sans text-[11px] font-normal truncate mt-0.5 ${
          isLight ? 'text-slate-500' : 'text-slate-300'
        }`}
      >
        Suporte à Decisão Clínica & Registro Estruturado
      </span>
    </div>
  );

  if (onClick) {
    return (
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 min-w-0 ${className}`}
        aria-label="Nexus Clínico - Página Inicial"
      >
        {logoIcon}
        {titleBlock}
      </a>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 ${className}`}>
      {logoIcon}
      {titleBlock}
    </div>
  );
};
