import React, { useState, useEffect, useRef } from 'react';
import { PatientSession, NavView } from '../types';
import { ALL_SCALES } from '../data/scalesData';
import {
  Search,
  Brain,
  Code,
  Info,
  UserPlus,
  Save,
  Sparkles,
  X,
  Edit3,
  Calculator,
  ClipboardList,
  Stethoscope,
  FileText,
  Heart,
  Pill,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { AboutModalTab } from './AboutModal';
import { NexusLogo } from './NexusLogo';

interface HeaderProps {
  currentView?: NavView;
  patient: PatientSession;
  onUpdatePatient: (updated: PatientSession) => void;
  onResetNewPatient: (customPatient?: Partial<PatientSession>) => void;
  onLoadDemoPatient: () => void;
  onOpenAbout: () => void;
  onOpenAboutWithTab?: (tab: AboutModalTab) => void;
  onOpenCodeExport?: () => void;
  onNavigate?: (view: NavView) => void;
  onSelectScale?: (scaleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'dashboard',
  patient,
  onUpdatePatient,
  onResetNewPatient,
  onLoadDemoPatient,
  onOpenAbout,
  onOpenAboutWithTab,
  onOpenCodeExport,
  onNavigate,
  onSelectScale,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age.toString());
  const [prontuario, setProntuario] = useState(patient.prontuario);

  // Global Quick Search Bar
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(patient.name);
    setAge(patient.age.toString());
    setProntuario(patient.prontuario);
  }, [patient]);

  // Global Ctrl+K / Cmd+K shortcut listener to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tools for instant search
  const filteredScales = searchQuery.trim()
    ? ALL_SCALES.filter(
        (s) =>
          (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.acronym || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.targetGroup || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (s.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const clinicalCalculators = [
    {
      id: 'antidepressant',
      title: 'Troca de Antidepressivos (Maudsley/Hayasaka)',
      acronym: 'Troca Antidep',
      category: 'Farmacologia & Transição',
    },
    {
      id: 'antipsychotic',
      title: 'Equivalência de Antipsicóticos (CPZE)',
      acronym: 'CPZE',
      category: 'Doses & Farmacologia',
    },
    {
      id: 'egfr',
      title: 'Taxa de Filtração Glomerular (CKD-EPI)',
      acronym: 'CKD-EPI',
      category: 'Função Renal & Ajuste',
    },
    {
      id: 'cv',
      title: 'Risco Cardiovascular Global (SBC / Framingham)',
      acronym: 'ERG / Framingham',
      category: 'Risco Clínico & Prevenção',
    },
  ].filter(
    (c) =>
      !searchQuery.trim() ||
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.acronym || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateOnly = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdatePatient({
      ...patient,
      name: name.trim(),
      age: parseInt(age, 10) || 0,
      prontuario: prontuario.trim(),
    });
    setIsOpenModal(false);
  };

  const handleStartNewConsultation = () => {
    onResetNewPatient({
      name: name.trim(),
      age: parseInt(age, 10) || 0,
      prontuario: prontuario.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
    });
    setIsOpenModal(false);
  };

  const handleTriggerLoadDemo = () => {
    onLoadDemoPatient();
    setIsOpenModal(false);
  };

  const handleSelectTool = (type: 'scale' | 'calc', id: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    if (type === 'scale') {
      if (onSelectScale) onSelectScale(id);
      if (onNavigate) onNavigate('scales');
    } else {
      if (onNavigate) onNavigate('calculators');
    }
  };

  return (
    <header className="bg-[#0A3B74] text-white border-b border-[#082F5D] sticky top-0 z-30 shadow-md w-full shrink-0">
      {/* Top Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        {/* Brand & Subtitle with Adapted Logo */}
        <NexusLogo
          variant="full"
          size="md"
          showBadge={true}
          onClick={() => onNavigate && onNavigate('dashboard')}
        />

        {/* Global Central Quick Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-blue-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Pesquisar instrumentos, calculadoras, fármacos..."
              className="w-full bg-[#082F5D]/90 hover:bg-[#082F5D] focus:bg-white text-white focus:text-[#0F172A] placeholder-blue-300/70 focus:placeholder-slate-400 pl-10 pr-20 py-2 rounded-md border border-blue-400/30 focus:border-blue-500 text-xs font-sans transition-all outline-none shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-blue-200 bg-white/10 rounded border border-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                Ctrl+K
              </kbd>
            )}
          </div>

          {/* Live Search Dropdown */}
          {isSearchFocused && (searchQuery.trim() || isSearchFocused) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-md shadow-2xl overflow-hidden z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150 max-h-96 overflow-y-auto">
              <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                <span>{searchQuery ? `Resultados para "${searchQuery}"` : 'Ferramentas Mais Utilizadas'}</span>
                <span className="text-[10px] text-slate-400">ESC fecha</span>
              </div>

              {/* Escalas Clínicas */}
              <div className="p-1.5">
                <div className="px-2 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
                  Instrumentos Clínicos
                </div>
                {(searchQuery ? filteredScales : ALL_SCALES.slice(0, 5)).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectTool('scale', s.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#0A3B74] group-hover:text-blue-700">
                          {s.acronym}
                        </span>
                        <span className="text-xs text-slate-700 font-medium">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-md">
                        {s.targetGroup}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded group-hover:bg-blue-100 group-hover:text-blue-800">
                      ~{s.estimatedMinutes || 2} min
                    </span>
                  </button>
                ))}
              </div>

              {/* Calculadoras Médicas */}
              <div className="p-1.5 border-t border-slate-100">
                <div className="px-2 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500">
                  Calculadoras Médicas
                </div>
                {clinicalCalculators.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectTool('calc', c.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-teal-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-teal-800 group-hover:text-teal-900">
                          {c.acronym}
                        </span>
                        <span className="text-xs text-slate-700 font-medium">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {c.category}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                      Decisão Clínica
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Patient Card & Utility Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Patient Context Pill */}
          <button
            onClick={() => setIsOpenModal(true)}
            className="bg-[#082F5D] hover:bg-[#07284F] border border-blue-400/30 rounded-md px-2.5 py-1.5 flex items-center gap-2 sm:gap-3 transition-colors shadow-inner text-left cursor-pointer min-h-[40px]"
            title="Identificar paciente ou gerenciar sessão"
          >
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${patient.name ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse shrink-0`} />
                <span className="font-mono text-[9px] uppercase tracking-wider text-blue-200 font-semibold truncate">
                  {patient.name ? (patient.isDemo ? 'Teste' : 'Ativo') : 'Paciente'}
                </span>
              </div>
              <span className="font-sans font-bold text-xs text-white block truncate max-w-[100px] sm:max-w-[160px]">
                {patient.name ? `${patient.name} ${patient.age ? `(${patient.age}a)` : ''}` : 'Identificar...'}
              </span>
            </div>

            <div className="font-mono text-[10px] font-bold text-[#38BDF8] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors px-1 py-0.5 rounded hover:bg-white/10 shrink-0">
              <Edit3 className="w-3 h-3" />
              <span className="hidden sm:inline">{patient.name ? 'Alterar' : 'Entrar'}</span>
            </div>
          </button>

          {/* Evidências Button (Large Screens) */}
          <button
            onClick={() => onOpenAboutWithTab ? onOpenAboutWithTab('evidencias') : onOpenAbout()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs font-semibold text-white transition-colors cursor-pointer min-h-[40px]"
            title="Ver referências e fundamentação científica"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Evidências</span>
          </button>

          {/* Sobre / Informações */}
          <button
            onClick={onOpenAbout}
            className="p-2 sm:px-2.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-white transition-colors cursor-pointer flex items-center justify-center min-h-[40px] min-w-[40px]"
            title="Sobre a plataforma e autoria médica"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Export Code Modal */}
          {onOpenCodeExport && (
            <button
              onClick={onOpenCodeExport}
              className="hidden sm:flex p-2 sm:px-2.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-white transition-colors cursor-pointer items-center justify-center min-h-[40px] min-w-[40px]"
              title="Ver código-fonte completo"
            >
              <Code className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Patient Edit / New Consultation Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-[1.5px] border-[#0A3B74] rounded-md p-6 w-full max-w-md shadow-2xl text-[#0F172A] space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded text-[#0A3B74]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-[#0F172A]">
                    Identificação do Paciente
                  </h3>
                  <p className="font-sans text-xs text-slate-500">
                    Gerencie a sessão de atendimento clínico
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOnly} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase font-bold text-slate-700">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria da Silva"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase font-bold text-slate-700">
                    Idade (anos):
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="38"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] uppercase font-bold text-slate-700">
                    Prontuário / Cartão SUS:
                  </label>
                  <input
                    type="text"
                    value={prontuario}
                    onChange={(e) => setProntuario(e.target.value)}
                    placeholder="482019-2"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0A3B74] hover:bg-[#07284F] text-white font-mono font-bold uppercase tracking-wider rounded text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações de Cadastro</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartNewConsultation}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-mono font-semibold uppercase tracking-wider rounded text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span>Limpar / Novo Paciente</span>
                </button>

                <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-sans">Simulação didática:</span>
                  <button
                    type="button"
                    onClick={handleTriggerLoadDemo}
                    className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    title="Preencher com caso clínico fictício demonstrativo"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Carregar Paciente Teste</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
