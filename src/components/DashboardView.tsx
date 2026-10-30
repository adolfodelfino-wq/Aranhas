import React from 'react';
import { NavView, PatientSession, SoapState, ScaleResult } from '../types';
import { CalculatorTabId } from '../utils/navigation';
import {
  Plus,
  ClipboardList,
  Calculator,
  FileText,
  TrendingUp,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { AboutModalTab } from './AboutModal';

interface DashboardViewProps {
  patient: PatientSession;
  soapState: SoapState;
  onNavigate: (view: NavView, options?: { scaleId?: string; calcTab?: CalculatorTabId }) => void;
  onSelectScale?: (scaleId: string) => void;
  onSelectCalculator?: (calcTab: CalculatorTabId) => void;
  onStartNewConsultation?: () => void;
  scaleHistory?: ScaleResult[];
  onOpenEducationSuggestions?: () => void;
  onOpenAboutWithTab?: (tab: AboutModalTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patient,
  soapState,
  onNavigate,
  onSelectScale,
  onSelectCalculator,
  onStartNewConsultation,
  scaleHistory = [],
  onOpenAboutWithTab,
}) => {
  const handleStartConsultation = () => {
    if (onStartNewConsultation) {
      onStartNewConsultation();
    } else {
      onNavigate('soap');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-14 px-4 space-y-12">
      {/* 1. HERO INSTITUCIONAL SERENO */}
      <section className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Nexus Clínico
          </h1>
          <p className="text-base text-slate-600 font-normal leading-relaxed">
            Suporte estruturado à consulta na Atenção Primária.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleStartConsultation}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Iniciar nova consulta</span>
          </button>
        </div>
      </section>

      {/* 2. FERRAMENTAS RÁPIDAS (4 ACESSOS LEVES) */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Ferramentas rápidas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. Instrumentos */}
          <button
            type="button"
            onClick={() => onNavigate('scales')}
            className="p-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg text-left transition-all hover:bg-slate-50/50 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 group-hover:text-teal-700">
                <ClipboardList className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                  Instrumentos
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  PHQ-9, GAD-7, AUDIT, EPDS, MEEM e escalas
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* 2. EEM + SOAP */}
          <button
            type="button"
            onClick={() => onNavigate('soap')}
            className="p-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg text-left transition-all hover:bg-slate-50/50 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 group-hover:text-teal-700">
                <FileText className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                  EEM + SOAP
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Exame do estado mental e registro estruturado
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* 3. Evolução */}
          <button
            type="button"
            onClick={() => onNavigate('scales', { scaleId: 'phq-9' })}
            className="p-4 bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg text-left transition-all hover:bg-slate-50/50 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 group-hover:text-teal-700">
                <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                  Evolução
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  Trajetória longitudinal e acompanhamento temporal
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* 3. ÁREA SECUNDÁRIA DISCRETA: ESTADO ATUAL DA SESSÃO */}
      <section className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Paciente em atendimento:{' '}
          <span className="font-medium text-slate-800">{patient.name}</span>
          {patient.age ? ` (${patient.age} anos)` : ''}
          {patient.prontuario ? ` · Prontuário: ${patient.prontuario}` : ''}
        </div>

        {onOpenAboutWithTab && (
          <button
            type="button"
            onClick={() => onOpenAboutWithTab('evidencias')}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-teal-700 cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Consultar referências e evidências</span>
          </button>
        )}
      </section>
    </div>
  );
};
