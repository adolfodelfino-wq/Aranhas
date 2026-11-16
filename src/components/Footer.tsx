import React from 'react';
import { AboutModalTab } from './AboutModal';

interface FooterProps {
  onOpenAboutWithTab: (tab: AboutModalTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAboutWithTab }) => {
  return (
    <footer className="min-h-[48px] sm:h-[50px] py-2 sm:py-0 bg-white border-t border-slate-200/80 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 font-sans text-xs shrink-0 z-20 w-full min-w-0">
      {/* Lado Esquerdo: Links Institucionais com tipografia e cores uniformes */}
      <div className="flex items-center gap-4 sm:gap-6 text-slate-500">
        <button
          type="button"
          onClick={() => onOpenAboutWithTab('sobre')}
          className="text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
        >
          Sobre o Projeto
        </button>

        <button
          type="button"
          onClick={() => onOpenAboutWithTab('evidencias')}
          className="text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
        >
          Evidências Clínicas
        </button>

        <button
          type="button"
          onClick={() => onOpenAboutWithTab('desenvolvedor')}
          className="text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
        >
          Desenvolvedor
        </button>
      </div>

      {/* Lado Direito: Versão e Autoria */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-slate-400 text-xs">
        <span>v2.4.0-estável</span>
        <span className="text-slate-300">·</span>
        <span>Idealizado e desenvolvido por Adolfo Aranha (@adolfoaranha)</span>
      </div>
    </footer>
  );
};
