import React from 'react';
import { AboutModalTab } from './AboutModal';

interface FooterProps {
  onOpenAboutWithTab: (tab: AboutModalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAboutWithTab }) => {
  return (
    <footer className="min-h-[52px] sm:h-[60px] py-2.5 sm:py-0 bg-white border-t border-slate-200 px-3 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[0.65rem] text-[#1A1C1E] uppercase tracking-[0.05em] shrink-0 z-20 w-full min-w-0">
      <div className="flex items-center gap-4 sm:gap-8 text-[#1A1C1E]/70 font-medium">
        <span>APS • Medicina de Família e Comunidade</span>
        <span>v2.1.0-STABLE</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => onOpenAboutWithTab('sobre')}
          className="text-[#1A1C1E] hover:text-[#115E59] hover:underline transition-colors cursor-pointer"
        >
          Sobre o Projeto
        </button>

        <button
          onClick={() => onOpenAboutWithTab('evidencias')}
          className="text-[#1A1C1E] hover:text-[#115E59] hover:underline transition-colors cursor-pointer"
        >
          Evidências Científicas
        </button>

        <button
          onClick={() => onOpenAboutWithTab('desenvolvedor')}
          className="text-[#1A1C1E]/60 hover:text-[#1A1C1E] transition-colors hidden md:inline cursor-pointer"
        >
          Desenvolvedor
        </button>

        <span className="bg-[#115E59] text-white px-2 py-0.5 rounded-[2px] font-bold text-[0.6rem] tracking-wider ml-1">
          Decisão Clínica
        </span>
      </div>
    </footer>
  );
};
