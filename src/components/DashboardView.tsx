import React, { useState } from 'react';
import { NavView, PatientSession, SoapState, ScaleResult } from '../types';
import { ALL_SCALES } from '../data/scalesData';
import { buildCanonicalPath, CalculatorTabId } from '../utils/navigation';
import {
  Search,
  Star,
  Sparkles,
  ClipboardList,
  Stethoscope,
  FileText,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Pill,
  Heart,
  Activity,
  CheckCircle,
  TrendingDown,
  Clock,
  ExternalLink,
  BookOpen,
  Filter,
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
  onOpenEducationSuggestions,
  onOpenAboutWithTab,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_fav_calculators');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return ['phq-9', 'gad-7', 'calc-antidepressant', 'audit'];
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexus_fav_calculators', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const categories = [
    { id: 'all', label: 'Todas as Ferramentas' },
    { id: 'favorites', label: '⭐ Favoritas' },
    { id: 'humor', label: 'Depressão & Humor' },
    { id: 'ansiedade', label: 'Ansiedade & Trauma' },
    { id: 'drogas', label: 'Álcool & Dependência' },
    { id: 'cognicao', label: 'Cognição & Idoso' },
    { id: 'tdah', label: 'TDAH & Infância' },
    { id: 'farmaco', label: 'Farmacologia & Fisiologia' },
  ];

  // Map scales with category tags and paths
  const categorizedScales = ALL_SCALES.map((scale) => {
    let cat = 'humor';
    if (['phq-9', 'edinburgh', 'mdq'].includes(scale.id)) cat = 'humor';
    else if (['gad-7', 'pcl-5', 'ybocs'].includes(scale.id)) cat = 'ansiedade';
    else if (['audit', 'cage', 'assist'].includes(scale.id)) cat = 'drogas';
    else if (['meem', 'gds-15', 'katz'].includes(scale.id)) cat = 'cognicao';
    else if (['asrs-18', 'snap-iv'].includes(scale.id)) cat = 'tdah';

    return {
      ...scale,
      type: 'scale' as const,
      category: cat,
      path: `/escalas/${scale.id}`,
    };
  });

  // Clinical Calculators List
  const clinicalCalculators: Array<{
    id: string;
    title: string;
    acronym: string;
    category: string;
    type: 'calculator';
    calcTab: CalculatorTabId;
    targetGroup: string;
    description: string;
    estimatedMinutes: number;
    badge: string;
    path: string;
  }> = [
    {
      id: 'calc-antidepressant',
      title: 'Calculadora de Troca de Antidepressivos',
      acronym: 'Troca Antidep',
      category: 'farmaco',
      type: 'calculator',
      calcTab: 'antidepressant',
      targetGroup: 'Pacientes em transição de ISRS, IRSN, Tricíclicos, Bupropiona, Mirtazapina',
      description: 'Calcula dose equivalente (Maudsley/Hayasaka), indica estratégia de troca (Direta, Cruzada ou Washout), mapeia CYP450 e gera cronograma semanal.',
      estimatedMinutes: 2,
      badge: 'Maudsley & Hayasaka',
      path: '/calculadoras/antidepressant',
    },
    {
      id: 'calc-antipsychotic',
      title: 'Equivalência de Doses de Antipsicóticos (CPZE)',
      acronym: 'CPZE',
      category: 'farmaco',
      type: 'calculator',
      calcTab: 'antipsychotic',
      targetGroup: 'Conversão para miligramas equivalentes de Clorpromazina (Davis/Leucht)',
      description: 'Permite comparar potências relativas de antipsicóticos típicos e atípicos na APS (Haloperidol, Risperidona, Olanzapina, Quetiapina, Clorpromazina).',
      estimatedMinutes: 1,
      badge: 'Padrão Leucht',
      path: '/calculadoras/antipsychotic',
    },
    {
      id: 'calc-egfr',
      title: 'Taxa de Filtração Glomerular Estimada (CKD-EPI)',
      acronym: 'CKD-EPI',
      category: 'farmaco',
      type: 'calculator',
      calcTab: 'egfr',
      targetGroup: 'Ajuste de dosagem para Lítio, Pregabalina, Duloxetina e outros psicofármacos',
      description: 'Calcula a depuração renal a partir da creatinina sérica, idade e sexo, estratificando estágios de DRC e necessidade de redução de dose.',
      estimatedMinutes: 1,
      badge: 'Diretriz KDIGO',
      path: '/calculadoras/egfr',
    },
    {
      id: 'calc-cv',
      title: 'Escore de Risco Cardiovascular Global (SCORE / Framingham)',
      acronym: 'SCORE CV',
      category: 'farmaco',
      type: 'calculator',
      calcTab: 'cv',
      targetGroup: 'Rastreio de risco metabólico em pacientes em uso de psicofármacos',
      description: 'Calcula probabilidade de evento cardiovascular maior em 10 anos considerando PA sistólica, tabagismo, diabetes e gênero.',
      estimatedMinutes: 2,
      badge: 'Diretriz SBC / SUS',
      path: '/calculadoras/cv',
    },
  ];

  const allTools = [...categorizedScales, ...clinicalCalculators];

  // Filtering
  const filteredTools = allTools.filter((tool) => {
    // Category check
    if (selectedCategory === 'favorites') {
      if (!favorites.includes(tool.id)) return false;
    } else if (selectedCategory !== 'all') {
      if (tool.category !== selectedCategory) return false;
    }

    // Search check
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = (tool.title || '').toLowerCase().includes(q);
      const matchAcronym = (tool.acronym || '').toLowerCase().includes(q);
      const matchDesc = (tool.description || '').toLowerCase().includes(q);
      const matchTarget = (tool.targetGroup || '').toLowerCase().includes(q);
      return matchTitle || matchAcronym || matchDesc || matchTarget;
    }

    return true;
  });

  const handleOpenTool = (tool: (typeof allTools)[0]) => {
    if (tool.type === 'scale') {
      if (onSelectScale) onSelectScale(tool.id);
      else onNavigate('scales', { scaleId: tool.id });
    } else {
      if (onSelectCalculator) onSelectCalculator(tool.calcTab);
      else onNavigate('calculators', { calcTab: tool.calcTab });
    }
  };

  const handleStartConsultationClick = () => {
    if (onStartNewConsultation) {
      onStartNewConsultation();
    } else {
      onNavigate('soap');
    }
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-6 sm:space-y-8 py-2 font-sans">
      {/* TOPO DA ÁREA PRINCIPAL: AÇÃO DOMINANTE "+ Iniciar nova consulta" */}
      <section aria-labelledby="home-title" className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <h1 id="home-title" className="text-2xl sm:text-3xl font-extrabold text-[#0A2540] tracking-tight">
              O que você precisa fazer agora?
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Comece pela narrativa clínica e utilize instrumentos, EEM e calculadoras conforme a necessidade.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleStartConsultationClick}
              className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow-sm cursor-pointer min-h-[48px] group"
              title="Abre a workstation EEM + SOAP focando diretamente no Subjetivo"
            >
              <FileText className="w-4 h-4 text-teal-200 group-hover:scale-110 transition-transform" />
              <span>+ Iniciar nova consulta</span>
              <ArrowRight className="w-4 h-4 text-teal-200 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1 — CONSULTA CLÍNICA */}
      <section aria-labelledby="consultation-section-title" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[11px] font-mono font-bold text-teal-700 uppercase tracking-wider block">
              SEÇÃO 1 — FLUXO DE ATENDIMENTO
            </span>
            <h2 id="consultation-section-title" className="text-lg font-bold text-[#0A2540]">
              Consulta Clínica
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Workstation Integrada
          </span>
        </div>

        {/* Card Principal: Registro clínico — EEM + SOAP */}
        <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 text-[#0A2540] rounded-lg">
                  <Stethoscope className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">
                    Registro clínico — EEM + SOAP
                  </h3>
                  <span className="text-xs text-slate-500">
                    Estação de trabalho semiológica e documentação médica estruturada
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                A narrativa clínica inicia o fluxo. Instrumentos psicométricos e calculadoras são acionados apenas sob demanda quando agregam valor diagnóstico ou terapêutico. A Avaliação e o Plano permanecem sob estrita autoria médica.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onNavigate('soap')}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0A2540] hover:bg-[#071D33] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[42px] shadow-xs"
              >
                <span>Acessar Workstation EEM + SOAP</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
              </button>
            </div>
          </div>

          {/* FLUXO VISUAL DA CONSULTA MÉDICA REAL */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Fluxo Clínico Longitudinal da Consulta:
              </span>
              <span className="text-[11px] font-mono text-teal-700 font-semibold">
                Narrativa → Semiologia → Evidência → Conduta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Etapa 1: Subjetivo */}
              <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/40 space-y-1 relative">
                <div className="flex items-center justify-between text-xs font-bold text-teal-900">
                  <span className="font-mono text-teal-700">1. Subjetivo</span>
                  <span className="text-[10px] font-mono uppercase bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">Início</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Narrativa Clínica Livre</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Escuta qualificada, queixa principal, HDA e contexto psicossocial sem chips ou preenchimentos assistidos.
                </p>
              </div>

              {/* Etapa 2: EEM */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="font-mono text-[#0A2540]">2. EEM</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">Exame</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Exame do Estado Mental</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Semiologia em linhas compactas (aparência, afeto, pensamento, orientação, juízo crítico).
                </p>
              </div>

              {/* Etapa 3: Instrumentos / Cálculos */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="font-mono text-[#0A2540]">3. Recursos</span>
                  <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Sob Demanda</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Escalas & Calculadoras</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Acionados apenas quando pertinentes. Alimentam exclusivamente o campo Objetivo do SOAP.
                </p>
              </div>

              {/* Etapa 4: Avaliação */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="font-mono text-[#0A2540]">4. Avaliação</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded">Síntese</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Raciocínio Clínico</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Impressão diagnóstica longitudinal sob autoria e decisão estritamente médica.
                </p>
              </div>

              {/* Etapa 5: Plano & SOAP */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="font-mono text-[#0A2540]">5. Plano</span>
                  <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">SOAP Final</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">Pactuação & Condutas</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Prescrição, metas terapêuticas, plano de segurança e cópia estruturada para o PEP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2 — FERRAMENTAS RÁPIDAS (AVULSAS) */}
      <section aria-labelledby="quick-tools-section-title" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 px-1">
          <div>
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              SEÇÃO 2 — RECURSOS DE APOIO À DECISÃO
            </span>
            <h2 id="quick-tools-section-title" className="text-lg font-bold text-[#0A2540]">
              Ferramentas Rápidas
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Acesso avulso direto sem necessidade de iniciar consulta. Instrumentos e calculadoras não são etapas obrigatórias de todas as consultas, mas recursos acionados sob demanda.
          </p>
        </div>

        {/* Três Cards Menores: Instrumentos | Calculadoras | Evidências */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Instrumentos clínicos */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-[#0A2540] rounded-lg">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">
                    Instrumentos clínicos
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">15 escalas psicométricas</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Inventários validados para rastreio e monitoramento terapêutico, utilizados quando houver indicação na consulta.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Atalhos Diretos
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('phq-9');
                      else onNavigate('scales', { scaleId: 'phq-9' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • PHQ-9 (Depressão)
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('gad-7');
                      else onNavigate('scales', { scaleId: 'gad-7' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • GAD-7 (Ansiedade)
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('hcl-32');
                      else onNavigate('scales', { scaleId: 'hcl-32' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • HCL-32 (Bipolar)
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('meem');
                      else onNavigate('scales', { scaleId: 'meem' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • MEEM (Cognição)
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('audit');
                      else onNavigate('scales', { scaleId: 'audit' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • AUDIT (Álcool)
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectScale) onSelectScale('asrs-18');
                      else onNavigate('scales', { scaleId: 'asrs-18' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors"
                  >
                    • ASRS (TDAH Adulto)
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('scales')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos os 15 instrumentos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Calculadoras */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-[#0A2540] rounded-lg">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">
                    Calculadoras
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Farmacologia & Fisiologia</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fórmulas farmacológicas e fisiometabólicas determinísticas para ajuste posológico e estratificação de risco.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Atalhos Diretos
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      if (onSelectCalculator) onSelectCalculator('antidepressant');
                      else onNavigate('calculators', { calcTab: 'antidepressant' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Troca de antidepressivos</span>
                    <span className="text-[9px] font-mono text-teal-700 font-bold">Maudsley</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectCalculator) onSelectCalculator('antipsychotic');
                      else onNavigate('calculators', { calcTab: 'antipsychotic' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Equivalência de doses (CPZE)</span>
                    <span className="text-[9px] font-mono text-slate-400">Leucht</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectCalculator) onSelectCalculator('egfr');
                      else onNavigate('calculators', { calcTab: 'egfr' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• CKD-EPI 2021 (Taxa Renal)</span>
                    <span className="text-[9px] font-mono text-slate-400">KDIGO</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectCalculator) onSelectCalculator('cv');
                      else onNavigate('calculators', { calcTab: 'cv' });
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Risco cardiovascular global</span>
                    <span className="text-[9px] font-mono text-slate-400">SBC / SCORE</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('calculators')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas as 4 calculadoras</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Evidências */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-[#0A2540] rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A2540]">
                    Evidências
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">Diretrizes & Referências</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Base científica sintetizada com critérios diagnósticos e recomendações clínicas para a APS e MFC.
              </p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Atalhos Diretos
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      if (onOpenAboutWithTab) onOpenAboutWithTab('evidencias');
                      else onNavigate('dashboard');
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Diretrizes Maudsley (Psicofármacos)</span>
                    <span className="text-[9px] font-mono text-teal-700">Evidência A</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAboutWithTab) onOpenAboutWithTab('evidencias');
                      else onNavigate('dashboard');
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Critérios de Desprescrição de Benzodiazepínicos</span>
                    <span className="text-[9px] font-mono text-slate-400">Penzed</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAboutWithTab) onOpenAboutWithTab('evidencias');
                      else onNavigate('dashboard');
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Rastreio & Manejo em Saúde Mental na APS</span>
                    <span className="text-[9px] font-mono text-slate-400">MS / SUS</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAboutWithTab) onOpenAboutWithTab('sobre');
                      else onNavigate('dashboard');
                    }}
                    className="px-2 py-1.5 text-left rounded bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-[11px] transition-colors flex items-center justify-between"
                  >
                    <span>• Princípios de Ergonomia Cognitiva</span>
                    <span className="text-[9px] font-mono text-slate-400">Nexus</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (onOpenAboutWithTab) onOpenAboutWithTab('evidencias');
                }}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Consultar base de evidências</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO ACESSO RÁPIDO */}
      <section aria-labelledby="quick-access-title" className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 id="quick-access-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide font-mono">
              Acesso Rápido — Ferramentas Mais Utilizadas
            </h3>
            <p className="text-xs text-slate-500">
              Acesso direto às ferramentas clínicas mais frequentes no consultório da Atenção Primária.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar por nome ou sintoma..."
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-600 text-xs outline-none transition-all"
            />
          </div>
        </div>

        {/* Quick Access Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredTools.slice(0, 8).map((tool) => {
            const isFav = favorites.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => handleOpenTool(tool)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-600/60 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex flex-col justify-between group text-left"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0A2540] group-hover:text-teal-700 transition-colors">
                      {tool.acronym}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(tool.id, e)}
                      className="text-slate-300 hover:text-amber-400 p-1"
                      title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                    {tool.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>~{tool.estimatedMinutes || 2} min</span>
                  <span className="font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Abrir →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RODAPÉ DA ÁREA PRINCIPAL COM AVISO CLÍNICO DISCRETO */}
      <footer className="pt-2 pb-4 text-center">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Escala ≠ diagnóstico · Cálculo ≠ conduta · Decisão permanece médica
        </p>
      </footer>
    </div>
  );
};

