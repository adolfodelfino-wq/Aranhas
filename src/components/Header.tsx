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
  Cloud,
  Check,
  Loader2,
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
  isSyncingCloud?: boolean;
  cloudSynced?: boolean;
  onRefreshCloud?: () => void;
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
  isSyncingCloud = false,
  cloudSynced = false,
  onRefreshCloud,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState(patient.name || '');
  const [age, setAge] = useState(patient.age && patient.age > 0 ? patient.age.toString() : '');
  const [prontuario, setProntuario] = useState(patient.prontuario || '');

  // Global Quick Search Bar
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(patient.name || '');
    setAge(patient.age && patient.age > 0 ? patient.age.toString() : '');
    setProntuario(patient.prontuario || '');
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
    const trimmedName = name.trim();
    const trimmedProntuario = prontuario.trim();
    const isSameAsCurrent =
      trimmedName === (patient.name || '').trim() &&
      trimmedProntuario === (patient.prontuario || '').trim();

    if (isSameAsCurrent || !trimmedName) {
      // Clear patient session completely to blank state
      setName('');
      setAge('');
      setProntuario('');
      onResetNewPatient({
        name: '',
        age: 0,
        prontuario: '',
        date: new Date().toLocaleDateString('pt-BR'),
        isDemo: false,
      });
    } else {
      // User entered a new patient's name and wants a fresh consultation for them
      onResetNewPatient({
        name: trimmedName,
        age: parseInt(age, 10) || 0,
        prontuario: trimmedProntuario,
        date: new Date().toLocaleDateString('pt-BR'),
        isDemo: false,
      });
    }
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
    <header className="bg-white text-slate-800 border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs w-full shrink-0">
      {/* Top Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6 min-w-0">
        {/* Brand & Subtitle with Adapted Logo */}
        <NexusLogo
          variant="full"
          size="md"
          theme="light"
          showBadge={true}
          onClick={() => onNavigate && onNavigate('dashboard')}
        />

        {/* Global Central Quick Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Pesquisar instrumentos, calculadoras, fármacos..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 pl-10 pr-16 py-2 rounded-lg border border-slate-200 focus:border-teal-700 text-xs font-sans transition-all outline-hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                Ctrl+K
              </kbd>
            )}
          </div>

          {/* Live Search Dropdown */}
          {isSearchFocused && (searchQuery.trim() || isSearchFocused) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150 max-h-96 overflow-y-auto">
              <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>{searchQuery ? `Resultados para "${searchQuery}"` : 'Ferramentas Mais Utilizadas'}</span>
                <span className="text-[10px] text-slate-400">ESC fecha</span>
              </div>

              {/* Escalas Clínicas */}
              <div className="p-1.5">
                <div className="px-2 py-1 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-400">
                  Instrumentos Clínicos
                </div>
                {(searchQuery ? filteredScales : ALL_SCALES.slice(0, 5)).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectTool('scale', s.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-teal-700">
                          {s.acronym}
                        </span>
                        <span className="text-xs text-slate-700 font-normal">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-md">
                        {s.targetGroup}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                      ~{s.estimatedMinutes || 2} min
                    </span>
                  </button>
                ))}
              </div>

              {/* Calculadoras Médicas */}
              <div className="p-1.5 border-t border-slate-100">
                <div className="px-2 py-1 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-400">
                  Calculadoras Médicas
                </div>
                {clinicalCalculators.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectTool('calc', c.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-teal-700">
                          {c.acronym}
                        </span>
                        <span className="text-xs text-slate-700 font-normal">
                          {c.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {c.category}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-200/60 px-2 py-0.5 rounded">
                      Decisão Clínica
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Patient Card & Utility Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Patient Context Pill with Silent Cloud Status */}
          <button
            type="button"
            onClick={() => setIsOpenModal(true)}
            className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg px-3 py-1.5 flex items-center gap-2.5 transition-colors text-left cursor-pointer min-h-[38px]"
            title={
              patient.prontuario
                ? `Prontuário: ${patient.prontuario} ${cloudSynced ? '(Sincronizado na Nuvem)' : isSyncingCloud ? '(Sincronizando...)' : ''}`
                : 'Identificar paciente ou gerenciar sessão'
            }
          >
            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${patient.name ? 'bg-emerald-500' : 'bg-amber-500'} shrink-0`} />
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-medium truncate">
                  {patient.name ? (patient.isDemo ? 'Demonstração' : 'Ativo') : 'Paciente'}
                </span>
                {patient.prontuario && !patient.isDemo && (
                  <span className="flex items-center text-[9px] font-mono text-slate-400 ml-1">
                    {isSyncingCloud ? (
                      <Loader2 className="w-2.5 h-2.5 text-teal-600 animate-spin" />
                    ) : cloudSynced ? (
                      <span className="inline-flex items-center text-teal-700" title="Histórico longitudinal sincronizado">
                        <Cloud className="w-2.5 h-2.5 text-teal-600 mr-0.5" />
                        <Check className="w-2 h-2 text-teal-600" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-400" title="Prontuário vinculado">
                        <Cloud className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </span>
                )}
              </div>
              <span className="font-sans font-medium text-xs text-slate-800 block truncate max-w-[110px] sm:max-w-[170px]">
                {patient.name ? `${patient.name} ${patient.age ? `(${patient.age}a)` : ''}` : 'Identificar...'}
              </span>
            </div>

            <div className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors pl-1 shrink-0">
              <Edit3 className="w-3 h-3" />
            </div>
          </button>

          {/* Evidências Button (Large Screens) */}
          <button
            type="button"
            onClick={() => onOpenAboutWithTab ? onOpenAboutWithTab('evidencias') : onOpenAbout()}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer min-h-[38px]"
            title="Ver referências e fundamentação científica"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-700" />
            <span>Evidências</span>
          </button>

          {/* Sobre / Informações */}
          <button
            type="button"
            onClick={onOpenAbout}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center min-h-[38px] min-w-[38px]"
            title="Sobre a plataforma"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Patient Edit / New Consultation Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-xl text-slate-900 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-teal-50 p-2 rounded-lg text-teal-700">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-base text-slate-900">
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
                <label className="text-xs font-medium text-slate-700">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria da Silva"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-teal-700 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Idade (anos):
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="38"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-teal-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Prontuário / Cartão SUS:
                  </label>
                  <input
                    type="text"
                    value={prontuario}
                    onChange={(e) => setProntuario(e.target.value)}
                    placeholder="482019-2"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-teal-700 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Ao informar o prontuário, o histórico longitudinal de escalas é resgatado e sincronizado automaticamente.
                  </p>
                </div>
              </div>

              {(name || age || prontuario) && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setName('');
                      setAge('');
                      setProntuario('');
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Limpar campos digitados
                  </button>
                </div>
              )}

              <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações de Cadastro</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartNewConsultation}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title="Limpar todos os dados clínicos e iniciar nova sessão de atendimento"
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
