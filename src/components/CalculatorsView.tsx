import React, { useState, useEffect } from 'react';
import {
  calculateEgfr,
  calculateCardiovascularRisk,
  calculateAntipsychoticEquivalence,
  DetailedCardiovascularResult,
} from '../utils/calculators';
import { CalculatorResult } from '../types';
import { CalculatorTabId } from '../utils/navigation';
import {
  Calculator,
  Activity,
  Heart,
  Pill,
  FileCheck,
  Sparkles,
  Check,
  Copy,
  BookOpen,
  Info,
  ShieldAlert,
  AlertTriangle,
  Flame,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  TrendingUp,
} from 'lucide-react';
import { AntidepressantSwitchCalculator } from './AntidepressantSwitchCalculator';
import { BenzodiazepineTaperCalculator } from './BenzodiazepineTaperCalculator';

interface CalculatorsViewProps {
  onImportToSoap?: (text: string, title: string) => void;
  onImportToSoapPlan?: (text: string, title: string) => void;
  onImportToSoapObjective?: (text: string, title: string) => void;
  onOpenEvidenceModal?: () => void;
  initialTab?: CalculatorTabId;
  onSelectTab?: (tab: CalculatorTabId) => void;
}

export const CalculatorsView: React.FC<CalculatorsViewProps> = ({
  onImportToSoap,
  onImportToSoapPlan,
  onImportToSoapObjective,
  onOpenEvidenceModal,
  initialTab = 'antidepressant',
  onSelectTab,
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTabId>(initialTab);
  const [imported, setImported] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  // Sync state when initialTab changes from URL
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: CalculatorTabId) => {
    setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  const handleImportPlan = onImportToSoapPlan || onImportToSoap || (() => {});
  const handleImportObj = onImportToSoapObjective || onImportToSoap || (() => {});

  // eGFR Inputs
  const [creatinine, setCreatinine] = useState('1.0');
  const [egfrAge, setEgfrAge] = useState('45');
  const [egfrGender, setEgfrGender] = useState<'male' | 'female'>('female');

  // CV Risk Inputs & Modes
  const [cvCalcMode, setCvCalcMode] = useState<'lipid' | 'bmi' | 'direct'>('lipid');
  const [cvAge, setCvAge] = useState('52');
  const [cvGender, setCvGender] = useState<'male' | 'female'>('male');
  const [sysBp, setSysBp] = useState('135');
  const [isBpTreated, setIsBpTreated] = useState(false);
  const [isSmoker, setIsSmoker] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  
  // Lipid Parameters
  const [totCholesterol, setTotCholesterol] = useState('210');
  const [hdlCholesterol, setHdlCholesterol] = useState('45');
  
  // BMI Parameters (Non-laboratory)
  const [weightKg, setWeightKg] = useState('78');
  const [heightCm, setHeightCm] = useState('172');

  // Direct Risk Criteria
  const [hasEstablishedCvd, setHasEstablishedCvd] = useState(false);
  const [hasAorticAneurysm, setHasAorticAneurysm] = useState(false);
  const [hasSevereCkd, setHasSevereCkd] = useState(false);
  const [hasSevereHypercholesterolemia, setHasSevereHypercholesterolemia] = useState(false);
  const [hasSubclinicalAtherosclerosis, setHasSubclinicalAtherosclerosis] = useState(false);
  const [hasDiabetesWithRiskFactors, setHasDiabetesWithRiskFactors] = useState(false);

  // SBC Aggravators (Reclassificadores de Risco)
  const [hasFamilyHistoryPrematureCvd, setHasFamilyHistoryPrematureCvd] = useState(false);
  const [hasMetabolicSyndrome, setHasMetabolicSyndrome] = useState(false);
  const [hasMicroalbuminuria, setHasMicroalbuminuria] = useState(false);
  const [hasHighSensitivityCrp, setHasHighSensitivityCrp] = useState(false);

  // Mental Health & Psychopharmacology
  const [usesHighRiskAntipsychotic, setUsesHighRiskAntipsychotic] = useState(false);
  const [antipsychoticName, setAntipsychoticName] = useState('Olanzapina');
  const [hasSevereMentalIllness, setHasSevereMentalIllness] = useState(false);

  // Sections collapse toggles
  const [showDirectRiskSection, setShowDirectRiskSection] = useState(false);
  const [showAggravatorsSection, setShowAggravatorsSection] = useState(false);
  const [showPsychSection, setShowPsychSection] = useState(true);

  // Antipsychotic Inputs
  const [apDrug, setApDrug] = useState('Risperidona');
  const [apDose, setApDose] = useState('3');

  const egfrResult: CalculatorResult = calculateEgfr(
    parseFloat(creatinine) || 1.0,
    parseInt(egfrAge, 10) || 45,
    egfrGender
  );

  const cvResult: DetailedCardiovascularResult = calculateCardiovascularRisk({
    age: parseInt(cvAge, 10) || 52,
    gender: cvGender,
    sysBp: parseInt(sysBp, 10) || 135,
    isBpTreated,
    isSmoker,
    hasDiabetes,
    calcMode: cvCalcMode,
    totCholesterol: parseFloat(totCholesterol) || 210,
    hdlCholesterol: parseFloat(hdlCholesterol) || 45,
    weightKg: parseFloat(weightKg) || 78,
    heightCm: parseFloat(heightCm) || 172,
    hasEstablishedCvd,
    hasAorticAneurysm,
    hasSevereCkd,
    hasSevereHypercholesterolemia,
    hasSubclinicalAtherosclerosis,
    hasDiabetesWithRiskFactors,
    hasFamilyHistoryPrematureCvd,
    hasMetabolicSyndrome,
    hasMicroalbuminuria,
    hasHighSensitivityCrp,
    usesHighRiskAntipsychotic,
    antipsychoticName: usesHighRiskAntipsychotic ? antipsychoticName : undefined,
    hasSevereMentalIllness,
  });

  const apResult: CalculatorResult = calculateAntipsychoticEquivalence(
    apDrug,
    parseFloat(apDose) || 2
  );

  const handleExport = (res: CalculatorResult) => {
    onImportToSoap(res.soapText, res.title);
    setImported((prev) => ({ ...prev, [res.id]: true }));
    setTimeout(() => {
      setImported((prev) => ({ ...prev, [res.id]: false }));
    }, 3000);
  };

  const handleCopy = (res: CalculatorResult) => {
    navigator.clipboard.writeText(res.soapText);
    setCopied((prev) => ({ ...prev, [res.id]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [res.id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto space-y-4 sm:space-y-6 py-1 font-sans">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Calculadoras Clínicas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Calculadoras Médicas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Suporte para troca segura de psicofármacos, desmame gradual, equivalência antipsicótica, monitoramento de função renal e estratificação de risco cardiovascular na APS.
          </p>
        </div>

        {/* Tabs Navigation */}
        <nav aria-label="Abas de calculadoras médicas" className="flex border-b border-slate-200 pt-1 gap-2 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabChange('antidepressant')}
            aria-selected={activeTab === 'antidepressant'}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'antidepressant'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Troca de Antidepressivos (Maudsley)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('benzodiazepine')}
            aria-selected={activeTab === 'benzodiazepine'}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'benzodiazepine'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4 text-amber-600" />
            <span>Desmame Benzodiazepínicos (Maudsley/Ashton)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('antipsychotic')}
            aria-selected={activeTab === 'antipsychotic'}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'antipsychotic'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Equivalência Antipsicóticos (CPZE)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('egfr')}
            aria-selected={activeTab === 'egfr'}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'egfr'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Função Renal (CKD-EPI 2021)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('cv')}
            aria-selected={activeTab === 'cv'}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[44px] ${
              activeTab === 'cv'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Risco Cardiovascular (SBC / Framingham)</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: Antidepressant Switching Calculator */}
      {activeTab === 'antidepressant' && (
        <AntidepressantSwitchCalculator
          onImportToSoap={handleImportPlan}
          onOpenEvidenceModal={onOpenEvidenceModal}
        />
      )}

      {/* Tab: Benzodiazepine Ashton Tapering Calculator */}
      {activeTab === 'benzodiazepine' && (
        <BenzodiazepineTaperCalculator
          onImportToSoap={handleImportPlan}
          onOpenEvidenceModal={onOpenEvidenceModal}
        />
      )}

      {/* Tab 2: Antipsychotic Equivalence (CPZE) */}
      {activeTab === 'antipsychotic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Parâmetros de Entrada
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase text-slate-700">
                  Antipsicótico Atual:
                </label>
                <select
                  value={apDrug}
                  onChange={(e) => setApDrug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                >
                  <option value="Risperidona">Risperidona (VO)</option>
                  <option value="Haloperidol">Haloperidol (VO)</option>
                  <option value="Olanzapina">Olanzapina (VO)</option>
                  <option value="Quetiapina">Quetiapina (VO)</option>
                  <option value="Aripiprazol">Aripiprazol (VO)</option>
                  <option value="Clozapina">Clozapina (VO)</option>
                  <option value="Clorpromazina">Clorpromazina (VO)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase text-slate-700">
                  Dose Diária Atual (mg/dia):
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={apDose}
                  onChange={(e) => setApDose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
                <strong>Metodologia CPZE:</strong> Padronização baseada nas diretrizes de Leucht et al. (2016) e Davis (1974) para estimar potência dopaminérgica D2 e risco de efeitos extrapiramidais e síndrome metabólica.
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Result (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-md space-y-5 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                Resultado do Escore
              </span>
              <span className="font-mono text-xs text-slate-400">
                CPZE
              </span>
            </div>

            <div className="text-center space-y-1 py-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="font-mono text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                {apResult.value}
                <span className="text-base text-slate-400 font-normal"> mg/dia</span>
              </div>
              <div className="text-xs font-sans font-medium text-slate-500">
                Equivalente em Clorpromazina (CPZE)
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded text-center text-xs font-medium">
              {apResult.interpretation}
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
              <span className="font-sans font-semibold uppercase text-[11px] block text-slate-600">
                Texto para Prontuário:
              </span>
              <p className="leading-relaxed">{apResult.soapText}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleExport(apResult)}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <FileCheck className="w-4 h-4 text-teal-200" />
                <span>{imported[apResult.id] ? 'Importado!' : 'Copiar para Prontuário (SOAP)'}</span>
              </button>

              <button
                onClick={() => handleCopy(apResult)}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied[apResult.id] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied[apResult.id] ? 'Copiado!' : 'Copiar Texto Simples'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Renal Function (CKD-EPI) */}
      {activeTab === 'egfr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Parâmetros para CKD-EPI (2021 race-free)
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase text-slate-700">
                  Creatinina Sérica (mg/dL):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={creatinine}
                  onChange={(e) => setCreatinine(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase text-slate-700">
                  Idade do Paciente (anos):
                </label>
                <input
                  type="number"
                  value={egfrAge}
                  onChange={(e) => setEgfrAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono font-bold uppercase text-slate-700">
                  Sexo Biológico:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEgfrGender('female')}
                    className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      egfrGender === 'female'
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Feminino
                  </button>
                  <button
                    type="button"
                    onClick={() => setEgfrGender('male')}
                    className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                      egfrGender === 'male'
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                <strong className="text-slate-900 font-semibold">Relevância na APS:</strong> A taxa de filtração glomerular estimada (eGFR) é fundamental antes do início ou titulação de <strong>Carbonato de Lítio</strong>, <strong>Pregabalina</strong>, <strong>Gabapentina</strong> e <strong>Topiramato</strong>.
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Result (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-sans text-xs font-medium uppercase tracking-wider text-slate-500">
                Resultado do Escore
              </span>
              <span className="font-mono text-xs text-slate-400">
                CKD-EPI 2021
              </span>
            </div>

            <div className="text-center space-y-1 py-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="font-mono text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                {egfrResult.value}
                <span className="text-base text-slate-400 font-normal"> mL/min/1.73m²</span>
              </div>
              <div className="text-xs font-sans font-medium text-slate-500">
                Taxa de Filtração Glomerular Estimada
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded text-center text-xs font-medium">
              {egfrResult.interpretation}
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
              <span className="font-sans font-semibold uppercase text-[11px] block text-slate-600">
                Texto para Prontuário:
              </span>
              <p className="leading-relaxed">{egfrResult.soapText}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleExport(egfrResult)}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <FileCheck className="w-4 h-4 text-teal-200" />
                <span>{imported[egfrResult.id] ? 'Importado!' : 'Copiar para Prontuário (SOAP)'}</span>
              </button>

              <button
                onClick={() => handleCopy(egfrResult)}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied[egfrResult.id] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied[egfrResult.id] ? 'Copiado!' : 'Copiar Texto Simples'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Cardiovascular Risk (SBC / Framingham Global) */}
      {activeTab === 'cv' && (
        <div className="space-y-6">
          {/* Method Selection Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Método de Estimativa de Risco Cardiovascular:
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  Alinhado à Diretriz de Prevenção Cardiovascular da SBC (2019/2021) & Framingham Heart Study
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setCvCalcMode('lipid')}
                  className={`py-1.5 px-3 rounded-md transition-all cursor-pointer text-center ${
                    cvCalcMode === 'lipid'
                      ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Perfil Lipídico
                </button>
                <button
                  type="button"
                  onClick={() => setCvCalcMode('bmi')}
                  className={`py-1.5 px-3 rounded-md transition-all cursor-pointer text-center ${
                    cvCalcMode === 'bmi'
                      ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Clínico / IMC (Sem Lab)
                </button>
                <button
                  type="button"
                  onClick={() => setCvCalcMode('direct')}
                  className={`py-1.5 px-3 rounded-md transition-all cursor-pointer text-center ${
                    cvCalcMode === 'direct'
                      ? 'bg-white text-teal-800 font-semibold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Risco Direto
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Section 1: Base Demographic & Clinical Parameters */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>1. Parâmetros Clínicos Basais</span>
                  </h2>
                  <span className="font-mono text-[11px] text-slate-500">
                    {cvCalcMode === 'lipid' ? 'Modo Lipídico' : cvCalcMode === 'bmi' ? 'Modo IMC (APS)' : 'Estratificação Direta'}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase text-slate-700">
                        Idade (30 a 74 anos):
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="74"
                        value={cvAge}
                        onChange={(e) => setCvAge(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase text-slate-700">
                        Sexo Biológico:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setCvGender('male')}
                          className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                            cvGender === 'male'
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Masculino
                        </button>
                        <button
                          type="button"
                          onClick={() => setCvGender('female')}
                          className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                            cvGender === 'female'
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Feminino
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase text-slate-700">
                        Pressão Arterial Sistólica (PAS em mmHg):
                      </label>
                      <input
                        type="number"
                        value={sysBp}
                        onChange={(e) => setSysBp(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono font-bold uppercase text-slate-700">
                        Tratamento Anti-hipertensivo Atual:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIsBpTreated(false)}
                          className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                            !isBpTreated
                              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Não tratado
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsBpTreated(true)}
                          className={`py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                            isBpTreated
                              ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Em tratamento (HAS)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mode Specific Inputs */}
                  {cvCalcMode === 'lipid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 bg-blue-50/50 p-3 rounded border border-blue-100">
                      <div className="space-y-1.5">
                        <label className="font-mono font-bold uppercase text-slate-700">
                          Colesterol Total (mg/dL):
                        </label>
                        <input
                          type="number"
                          value={totCholesterol}
                          onChange={(e) => setTotCholesterol(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono font-bold uppercase text-slate-700">
                          HDL-Colesterol (mg/dL):
                        </label>
                        <input
                          type="number"
                          value={hdlCholesterol}
                          onChange={(e) => setHdlCholesterol(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {cvCalcMode === 'bmi' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 bg-teal-50/50 p-3 rounded border border-teal-100">
                      <div className="space-y-1.5">
                        <label className="font-mono font-bold uppercase text-slate-700">
                          Peso Corporal (kg):
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={weightKg}
                          onChange={(e) => setWeightKg(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono font-bold uppercase text-slate-700">
                          Estatura (cm):
                        </label>
                        <input
                          type="number"
                          value={heightCm}
                          onChange={(e) => setHeightCm(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                      </div>
                      {cvResult.bmiCalculated && (
                        <div className="sm:col-span-2 text-xs font-semibold text-teal-800 bg-white p-2 rounded border border-teal-200 flex items-center justify-between">
                          <span>IMC Calculado: {cvResult.bmiCalculated} kg/m²</span>
                          <span className="font-normal text-slate-500">Modelo D'Agostino 2008 Não-Laboratorial</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* General Major Risk Factors Checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={isSmoker}
                        onChange={(e) => setIsSmoker(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-800">Tabagismo Ativo</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={hasDiabetes}
                        onChange={(e) => setHasDiabetes(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className="font-semibold text-slate-800">Diabetes Mellitus</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 2: Direct High / Very High Risk Conditions (SBC) */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setShowDirectRiskSection(!showDirectRiskSection)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold text-slate-900">
                      2. Condições de Muito Alto & Alto Risco Direto (SBC)
                    </span>
                  </div>
                  {showDirectRiskSection ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  A presença de qualquer uma dessas condições dispensa o cálculo do escore e categoriza diretamente o paciente em Alto ou Muito Alto Risco.
                </p>

                {(showDirectRiskSection || cvCalcMode === 'direct') && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                        Muito Alto Risco (Meta LDL &lt; 50 mg/dL):
                      </span>
                      <label className="flex items-start gap-2 p-2 rounded bg-red-50/60 border border-red-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasEstablishedCvd}
                          onChange={(e) => setHasEstablishedCvd(e.target.checked)}
                          className="rounded border-red-300 text-red-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Doença Aterosclerótica Manifesta:</strong> IAM prévio, DAC (angina/revascularização), AVC/AIT ou Doença Arterial Periférica.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 rounded bg-red-50/60 border border-red-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasAorticAneurysm}
                          onChange={(e) => setHasAorticAneurysm(e.target.checked)}
                          className="rounded border-red-300 text-red-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Aneurisma de Aorta Abdominal</strong> documentado.
                        </span>
                      </label>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="font-mono text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
                        Alto Risco Direto (Meta LDL &lt; 70 mg/dL):
                      </span>
                      <label className="flex items-start gap-2 p-2 rounded bg-orange-50/60 border border-orange-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSevereHypercholesterolemia}
                          onChange={(e) => setHasSevereHypercholesterolemia(e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Hipercolesterolemia Grave:</strong> LDL-C ≥ 190 mg/dL ou Colesterol Total ≥ 310 mg/dL.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 rounded bg-orange-50/60 border border-orange-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSevereCkd}
                          onChange={(e) => setHasSevereCkd(e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Doença Renal Crônica (DRC):</strong> TFG &lt; 60 mL/min/1,73m² (estágios 3 a 5).
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 rounded bg-orange-50/60 border border-orange-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasDiabetesWithRiskFactors}
                          onChange={(e) => setHasDiabetesWithRiskFactors(e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Diabetes com Complicações / Tempo ≥ 10 anos:</strong> Presença de lesão de órgão-alvo ou múltiplos fatores de risco.
                        </span>
                      </label>

                      <label className="flex items-start gap-2 p-2 rounded bg-orange-50/60 border border-orange-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasSubclinicalAtherosclerosis}
                          onChange={(e) => setHasSubclinicalAtherosclerosis(e.target.checked)}
                          className="rounded border-orange-300 text-orange-600 w-4 h-4 mt-0.5 cursor-pointer"
                        />
                        <span className="text-slate-800 leading-tight">
                          <strong>Aterosclerose Subclínica:</strong> Escore de cálcio coronariano &gt; 100 UA ou estenose carotídea &gt; 50%.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: SBC Risk Aggravators (Reclassificadores de Risco) */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAggravatorsSection(!showAggravatorsSection)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-slate-900">
                      3. Fatores Agravantes do Risco (Reclassificadores da SBC)
                    </span>
                  </div>
                  {showAggravatorsSection ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <p className="text-[11px] text-slate-500">
                  Na presença de 1 ou mais fatores agravantes, o paciente inicialmente de <strong>Risco Intermediário</strong> é reclassificado para <strong>ALTO RISCO</strong>.
                </p>

                {showAggravatorsSection && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <label className="flex items-start gap-2 p-2 rounded bg-amber-50/60 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFamilyHistoryPrematureCvd}
                        onChange={(e) => setHasFamilyHistoryPrematureCvd(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-slate-800 leading-tight">
                        <strong>História Familiar Prematura de DCV:</strong> Parente de 1º grau masculino &lt; 55 anos ou feminino &lt; 65 anos.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 p-2 rounded bg-amber-50/60 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasMetabolicSyndrome}
                        onChange={(e) => setHasMetabolicSyndrome(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-slate-800 leading-tight">
                        <strong>Síndrome Metabólica (IDF / ATP III):</strong> Obesidade abdominal + alteração de TG, HDL, PA ou glicemia.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 p-2 rounded bg-amber-50/60 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasMicroalbuminuria}
                        onChange={(e) => setHasMicroalbuminuria(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-slate-800 leading-tight">
                        <strong>Microalbuminúria Confirmada:</strong> 30 a 300 mg/g de creatinina em amostra isolada.
                      </span>
                    </label>

                    <label className="flex items-start gap-2 p-2 rounded bg-amber-50/60 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasHighSensitivityCrp}
                        onChange={(e) => setHasHighSensitivityCrp(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-slate-800 leading-tight">
                        <strong>Proteína C-Reativa Ultrassensível Elevada:</strong> PCR-us &gt; 2,0 mg/L sem infecção ativa.
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Section 4: Psychopharmacology & Mental Health Interface */}
              <div className="bg-white border border-teal-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3 bg-gradient-to-br from-white to-teal-50/30">
                <button
                  type="button"
                  onClick={() => setShowPsychSection(!showPsychSection)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-teal-700" />
                    <span className="text-sm font-bold text-slate-900">
                      4. Interface com Saúde Mental & Psicofármacos (APS)
                    </span>
                  </div>
                  {showPsychSection ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <p className="text-[11px] text-slate-600">
                  Vigilância metabólica para usuários de antipsicóticos de 2ª geração e portadores de transtornos mentais graves (Consenso ADA / APA).
                </p>

                {showPsychSection && (
                  <div className="space-y-3 pt-2 border-t border-teal-100 text-xs">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={usesHighRiskAntipsychotic}
                          onChange={(e) => setUsesHighRiskAntipsychotic(e.target.checked)}
                          className="rounded border-slate-300 text-teal-700 w-4 h-4 cursor-pointer"
                        />
                        <span className="font-semibold text-slate-800">
                          Uso ou planejamento de Antipsicótico Atípico
                        </span>
                      </label>

                      {usesHighRiskAntipsychotic && (
                        <div className="pl-6 space-y-1.5">
                          <label className="font-mono text-[11px] font-bold text-slate-600 uppercase">
                            Selecione o Antipsicótico:
                          </label>
                          <select
                            value={antipsychoticName}
                            onChange={(e) => setAntipsychoticName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold text-slate-900 focus:border-teal-600 outline-none"
                          >
                            <option value="Olanzapina">Olanzapina (Alto Risco de Ganho Ponderal & Dislipidemia)</option>
                            <option value="Clozapina">Clozapina (Alto Risco Metabólico / Ganho Ponderal Severo)</option>
                            <option value="Quetiapina">Quetiapina (Risco Moderado-Alto / Sedação & Disglicemia)</option>
                            <option value="Risperidona">Risperidona (Risco Moderado / Ganho de Peso & Hiperprolactinemia)</option>
                            <option value="Aripiprazol">Aripiprazol (Baixo Risco Metabólico / Perfil Neutro)</option>
                            <option value="Haloperidol">Haloperidol (Baixo Risco Metabólico / Risco de QTc)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <label className="flex items-start gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSevereMentalIllness}
                        onChange={(e) => setHasSevereMentalIllness(e.target.checked)}
                        className="rounded border-slate-300 text-teal-700 w-4 h-4 mt-0.5 cursor-pointer"
                      />
                      <span className="text-slate-800 leading-tight">
                        <strong>Transtorno Mental Grave (TMG):</strong> Esquizofrenia, Transtorno Bipolar ou Depressão Maior Recorrente Grave (Mortalidade CV 2 a 3x maior por subdiagnóstico).
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Result & Decision Support (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-md space-y-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                  Escore de Risco Cardiovascular
                </span>
                <span className="font-mono text-xs text-slate-400">
                  SBC / Framingham
                </span>
              </div>

              {/* Numerical Score Block */}
              <div className="text-center space-y-1 py-4 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="font-mono text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                  {cvResult.value}
                </div>
                <div className="text-xs font-sans font-medium text-slate-500">
                  Probabilidade de Evento Aterosclerótico em 10 Anos
                </div>
              </div>

              {/* Status Banner with Clinical Severity Colors */}
              <div
                className={`p-3.5 rounded-lg border text-xs font-medium space-y-1 text-center ${
                  cvResult.riskCategory === 'very_high'
                    ? 'bg-red-50 text-red-900 border-red-300'
                    : cvResult.riskCategory === 'high'
                    ? 'bg-orange-50 text-orange-900 border-orange-300'
                    : cvResult.riskCategory === 'intermediate'
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}
              >
                <div className="uppercase tracking-wider font-semibold text-sm">
                  {cvResult.riskLabel}
                </div>
                <p className="font-normal text-[11px] leading-relaxed opacity-90">
                  {cvResult.interpretation}
                </p>
              </div>

              {/* Reclassification Badges */}
              {cvResult.isReclassified && (
                <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded text-[11px] font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Reclassificado para <strong>ALTO RISCO</strong> por fatores agravantes da SBC.</span>
                </div>
              )}

              {cvResult.isDirectRisk && (
                <div className="bg-red-50 border border-red-300 text-red-900 p-2.5 rounded text-[11px] font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-700 shrink-0" />
                  <span>Classificação por <strong>Estratificação Direta da SBC</strong>.</span>
                </div>
              )}

              {/* Clinical Targets Table (SBC) */}
              <div className="space-y-2 border border-slate-200 rounded-lg p-3.5 bg-slate-50/70 text-xs">
                <span className="font-sans text-[11px] font-semibold uppercase text-slate-700 block border-b border-slate-200 pb-1">
                  Metas Terapêuticas & Condutas (SBC):
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Meta de LDL-C:</span>
                    <strong className="text-slate-900 font-bold">{cvResult.ldlTarget}</strong>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Meta Não-HDL:</span>
                    <strong className="text-slate-900 font-bold">{cvResult.nonHdlTarget}</strong>
                  </div>

                  <div className="bg-white p-2 rounded border border-slate-200 sm:col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Meta Pressórica (PA):</span>
                    <strong className="text-slate-900 font-bold">{cvResult.bpTarget}</strong>
                  </div>
                </div>

                <div className="space-y-1 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Estatina Recomendada:</span>
                    <p className="text-slate-800 font-medium leading-tight">{cvResult.statinRecommendation}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-mono text-[10px] uppercase block">Antiagregação (AAS):</span>
                    <p className="text-slate-800 font-medium leading-tight">{cvResult.aspirinRecommendation}</p>
                  </div>
                </div>
              </div>

              {/* Mental Health Surveillance Plan (if active) */}
              {cvResult.metabolicMonitoringPlan && (
                <div className="space-y-2 border border-teal-200 rounded-lg p-3.5 bg-teal-50/60 text-xs">
                  <span className="font-mono text-[11px] font-bold uppercase text-teal-800 flex items-center gap-1.5 border-b border-teal-200 pb-1">
                    <Flame className="w-3.5 h-3.5 text-teal-700" />
                    <span>Plano de Vigilância Metabólica (ADA / APA na APS):</span>
                  </span>

                  <ul className="space-y-1.5 text-[11px] text-slate-800 list-disc list-inside leading-tight">
                    {cvResult.metabolicMonitoringPlan.map((step, idx) => (
                      <li key={`cv-step-${idx}`} className="pl-1 font-medium">{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Text for SOAP record */}
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="font-mono font-bold uppercase text-[11px] block">
                  Texto Formatado para Prontuário (SOAP):
                </span>
                <pre className="leading-relaxed whitespace-pre-wrap font-sans text-[11px] max-h-40 overflow-y-auto bg-white p-2 rounded border border-slate-200 text-slate-800">
                  {cvResult.soapText}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleExport(cvResult)}
                  className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <FileCheck className="w-4 h-4 text-teal-200" />
                  <span>{imported[cvResult.id] ? 'Importado para o SOAP!' : 'Importar para Prontuário (SOAP)'}</span>
                </button>

                <button
                  onClick={() => handleCopy(cvResult)}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied[cvResult.id] ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied[cvResult.id] ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>

                {onOpenEvidenceModal && (
                  <button
                    onClick={onOpenEvidenceModal}
                    className="w-full py-1.5 text-slate-500 hover:text-slate-800 text-[11px] font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ver Diretriz SBC 2019/2021 & D'Agostino 2008</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Clinical Disclaimer Footer */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Escala ≠ diagnóstico · Cálculo ≠ conduta · Decisão permanece médica
        </p>
      </footer>
    </div>
  );
};

