import React from 'react';
import { AboutModalTab } from './AboutModal';

interface FooterProps {
  onOpenAboutWithTab: (tab: AboutModalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAboutWithTab }) => {
  return (
    <footer className="min-h-[48px] sm:h-[52px] py-2 sm:py-0 bg-white border-t border-slate-200/80 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 font-sans text-xs text-slate-500 shrink-0 z-20 w-full min-w-0">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-500">
        <span>Atenção Primária à Saúde · MFC</span>
        <span className="text-slate-400">v2.4.0-estável</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">Idealizado e desenvolvido por Adolfo Aranha (@adolfoaranha)</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => onOpenAboutWithTab('sobre')}
          className="text-slate-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
        >
          Sobre o Projeto
        </button>

        <button
          onClick={() => onOpenAboutWithTab('evidencias')}
          className="text-slate-600 hover:text-teal-700 hover:underline transition-colors cursor-pointer"
        >
          Evidências Clínicas
        </button>

        <button
          onClick={() => onOpenAboutWithTab('desenvolvedor')}
          className="text-slate-400 hover:text-slate-700 transition-colors hidden md:inline cursor-pointer"
        >
          Desenvolvedor
        </button>

        <span className="text-xs text-teal-700 font-medium">
          Decisão Clínica
        </span>
      </div>
    </footer>
  );
};
