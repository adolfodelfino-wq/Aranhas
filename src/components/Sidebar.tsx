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
      icon: <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
      isActive: currentView === 'dashboard',
      onClick: () => onSelectView('dashboard'),
    },
    {
      id: 'scales' as const,
      label: 'Instrumentos',
      icon: <ClipboardList className="w-4 h-4" strokeWidth={1.75} />,
      isActive: currentView === 'scales',
      onClick: () => onSelectView('scales'),
    },
    {
      id: 'soap' as const,
      label: 'EEM + SOAP',
      icon: <FileText className="w-4 h-4" strokeWidth={1.75} />,
      badge: importedCount > 0 ? importedCount : undefined,
      isActive: isWorkstationActive,
      onClick: () => onSelectView('soap'),
    },
  ];

  return (
    <>
      {/* MOBILE HORIZONTAL NAVIGATION BAR (< md) */}
      <nav
        aria-label="Navegação móvel"
        className="md:hidden w-full bg-white border-b border-slate-200/80 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto shadow-xs sticky top-16 z-20 shrink-0"
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-current={item.isActive ? 'page' : undefined}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[38px] ${
              item.isActive
                ? 'bg-slate-100 text-teal-800 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className={item.isActive ? 'text-teal-700' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold bg-teal-100 text-teal-800">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* DESKTOP SIDEBAR (>= md) */}
      <aside
        aria-label="Navegação lateral"
        className="hidden md:flex w-52 lg:w-56 bg-white border-r border-slate-200/80 p-4 flex-col justify-between shrink-0"
      >
        <div className="space-y-6">
          <nav aria-label="Menu principal" className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                aria-current={item.isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors text-left cursor-pointer min-h-[38px] ${
                  item.isActive
                    ? 'bg-slate-100/90 text-teal-900 font-semibold border-l-2 border-teal-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={item.isActive ? 'text-teal-700' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded font-medium bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Rodapé discreto da barra lateral */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 leading-tight">
            Nexus Clínico · Suporte à Decisão na APS
          </p>
        </div>
      </aside>
    </>
  );
};
