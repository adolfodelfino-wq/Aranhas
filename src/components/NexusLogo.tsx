import React from 'react';

export interface NexusLogoProps {
  variant?: 'icon' | 'full' | 'banner';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NexusLogo: React.FC<NexusLogoProps> = ({
  variant = 'full',
  size = 'md',
  showBadge = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const imageSrc = '/logo.jpg';

  const logoIcon = (
    <div
      className={`relative ${sizeMap[size]} rounded-lg overflow-hidden flex items-center justify-center bg-[#07284F] border border-blue-400/30 shadow-xs shrink-0 group-hover:border-cyan-400 transition-colors`}
    >
      <img
        src={imageSrc}
        alt="Nexus Clínico Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          // Fallback to inline SVG if image fails
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      {/* Subtle overlay glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0A3B74]/40 via-transparent to-cyan-400/20 pointer-events-none rounded-lg" />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`} onClick={onClick}>
        {logoIcon}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center gap-4 bg-gradient-to-r from-[#0A3B74] via-[#082F5D] to-[#041D3B] p-4 rounded-xl border border-blue-400/20 text-white shadow-md ${className}`}
        onClick={onClick}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-lg shrink-0 bg-[#07284F] relative">
          <img
            src={imageSrc}
            alt="Nexus Clínico Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A3B74]/30 via-transparent to-cyan-300/30 pointer-events-none" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-sans font-black text-xl sm:text-2xl text-white tracking-tight leading-none">
              NEXUS <span className="text-[#38BDF8] font-bold">CLÍNICO</span>
            </span>
            {showBadge && (
              <span className="bg-[#0284C7] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                APS / SUS • MBE
              </span>
            )}
          </div>
          <span className="font-sans text-xs text-blue-100/90 font-medium mt-1">
            Sistema Especialista de Suporte à Decisão Clínica & Registro Estruturado
          </span>
          <span className="font-mono text-[10px] text-teal-300/80 mt-0.5">
            Atenção Primária à Saúde • Medicina de Família e Comunidade
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' variant
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
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-sans font-black text-lg sm:text-2xl text-white tracking-tight leading-none truncate">
              NEXUS <span className="text-[#38BDF8] font-bold">CLÍNICO</span>
            </span>
            {showBadge && (
              <span className="hidden md:inline-block bg-[#0284C7] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 shadow-xs">
                APS / SUS
              </span>
            )}
          </div>
          <span className="hidden sm:inline font-sans text-[11px] text-blue-200/90 font-medium truncate">
            Suporte à Decisão Clínica & Registro Estruturado
          </span>
        </div>
      </a>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 ${className}`}
    >
      {logoIcon}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-sans font-black text-lg sm:text-2xl text-white tracking-tight leading-none truncate">
            NEXUS <span className="text-[#38BDF8] font-bold">CLÍNICO</span>
          </span>
          {showBadge && (
            <span className="hidden md:inline-block bg-[#0284C7] text-white font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 shadow-xs">
              APS / SUS
            </span>
          )}
        </div>
        <span className="hidden sm:inline font-sans text-[11px] text-blue-200/90 font-medium truncate">
          Suporte à Decisão Clínica & Registro Estruturado
        </span>
      </div>
    </div>
  );
};
