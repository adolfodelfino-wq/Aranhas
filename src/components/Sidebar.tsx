import React from 'react';
import { NavView } from '../types';
import {
  LayoutDashboard,
  ClipboardList,
  Calculator,
  FileText,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView, options?: { scaleId?: string; calcTab?: any }) => void;
  onOpenEvidence?: () => void;
  importedCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenEvidence,
  importedCount = 0,
}) => {
  const isWorkstationActive = currentView === 'soap' || currentView === 'eem';

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Início',
      subLabel: 'Visão geral',
      icon: <LayoutDashboard className="w-4 h-4" strokeWidth={2} />,
      path: '/',
      isActive: currentView === 'dashboard',
      onClick: () => onSelectView('dashboard'),
    },
    {
      id: 'scales' as const,
      label: 'Instrumentos',
      subLabel: '15 inventários clínicos',
      icon: <ClipboardList className="w-4 h-4" strokeWidth={2} />,
      path: '/escalas',
      isActive: currentView === 'scales',
      onClick: () => onSelectView('scales'),
    },
    {
      id: 'calculators' as const,
      label: 'Calculadoras',
      subLabel: 'Maudsley, CPZE, eGFR',
      icon: <Calculator className="w-4 h-4" strokeWidth={2} />,
      path: '/calculadoras',
      isActive: currentView === 'calculators',
      onClick: () => onSelectView('calculators'),
    },
    {
      id: 'soap' as const,
      label: 'EEM + SOAP',
      subLabel: 'Workstation clínica',
      icon: <FileText className="w-4 h-4" strokeWidth={2} />,
      badge: importedCount > 0 ? importedCount : undefined,
      path: '/soap',
      isActive: isWorkstationActive,
      onClick: () => onSelectView('soap'),
    },
    {
      id: 'evidence' as const,
      label: 'Evidências',
      subLabel: 'Diretrizes & referências',
      icon: <BookOpen className="w-4 h-4" strokeWidth={2} />,
      path: '/evidencias',
      isActive: false,
      onClick: () => {
        if (onOpenEvidence) {
          onOpenEvidence();
        }
      },
    },
  ];

  return (
    <>
      {/* MOBILE HORIZONTAL NAVIGATION BAR (< md) */}
      <nav
        aria-label="Navegação móvel de módulos clínicos"
        className="md:hidden w-full bg-white border-b border-slate-200 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto shadow-xs sticky top-16 z-20 shrink-0"
      >
        {menuItems.map((item) => {
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              aria-current={item.isActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[40px] ${
                item.isActive
                  ? 'bg-[#0A2540] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span className={item.isActive ? 'text-teal-400' : 'text-slate-500'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    item.isActive
                      ? 'bg-teal-400 text-[#0A2540]'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* DESKTOP SIDEBAR (>= md) - ESTREITA E FIXA */}
      <aside
        aria-label="Navegação lateral"
        className="hidden md:flex w-52 lg:w-56 bg-white border-r border-slate-200 p-3 sm:p-4 flex-col justify-between shrink-0 shadow-xs"
      >
        <div className="space-y-5">
          <div>
            <div className="px-2 mb-2">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Navegação
              </span>
            </div>

            <nav aria-label="Menu principal" className="flex flex-col gap-1">
              {menuItems.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    aria-current={item.isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer min-h-[42px] ${
                      item.isActive
                        ? 'bg-[#0A2540] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={item.isActive ? 'text-teal-400' : 'text-slate-500'}>
                        {item.icon}
                      </span>
                      <div className="truncate">
                        <span className="font-sans block text-xs leading-tight font-medium">
                          {item.label}
                        </span>
                        <span
                          className={`text-[10px] block leading-tight truncate mt-0.5 ${
                            item.isActive ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {item.subLabel}
                        </span>
                      </div>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          item.isActive
                            ? 'bg-teal-400 text-[#0A2540]'
                            : 'bg-teal-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-3 border-t border-slate-200">
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-semibold block px-2 mb-1.5">
              Atalhos Rápidos
            </span>
            <div className="space-y-0.5 text-xs">
              <button
                onClick={() => onSelectView('scales', { scaleId: 'phq-9' })}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-between text-[11px] font-medium cursor-pointer transition-colors"
              >
                <span>PHQ-9 (Depressão)</span>
                <span className="text-[9px] font-mono text-slate-400">9 itens</span>
              </button>
              <button
                onClick={() => onSelectView('scales', { scaleId: 'gad-7' })}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-between text-[11px] font-medium cursor-pointer transition-colors"
              >
                <span>GAD-7 (Ansiedade)</span>
                <span className="text-[9px] font-mono text-slate-400">7 itens</span>
              </button>
              <button
                onClick={() => onSelectView('calculators', { calcTab: 'antidepressant' })}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-between text-[11px] font-medium cursor-pointer transition-colors"
              >
                <span>Troca Antidep</span>
                <span className="text-[9px] font-mono text-teal-700 font-bold">Maudsley</span>
              </button>
              <button
                onClick={() => onSelectView('calculators', { calcTab: 'egfr' })}
                className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-between text-[11px] font-medium cursor-pointer transition-colors"
              >
                <span>CKD-EPI 2021</span>
                <span className="text-[9px] font-mono text-slate-400">eGFR</span>
              </button>
            </div>
          </div>
        </div>

        {/* Discrete Legal / Clinical Disclaimer in Sidebar */}
        <div className="pt-3 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 leading-tight">
            Apoio à decisão clínica na APS. Uso exclusivo sob julgamento médico.
          </p>
        </div>
      </aside>
    </>
  );
};

