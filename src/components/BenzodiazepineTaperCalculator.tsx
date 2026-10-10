import React, { useState } from 'react';
import {
  BZD_DATABASE,
  generateBzdTaperPlan,
  BzdTaperStrategy,
  BzdTaperPace,
  BzdTaperPlan,
} from '../utils/benzodiazepineTapering';
import {
  Pill,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Copy,
  FileCheck,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  HeartPulse,
  Share2,
  Activity,
  Layers,
  PauseCircle,
  HelpCircle,
} from 'lucide-react';

interface BenzodiazepineTaperCalculatorProps {
  onImportToSoap?: (text: string, title: string) => void;
  onOpenEvidenceModal?: () => void;
}

export const BenzodiazepineTaperCalculator: React.FC<BenzodiazepineTaperCalculatorProps> = ({
  onImportToSoap,
  onOpenEvidenceModal,
}) => {
  const [sourceDrugId, setSourceDrugId] = useState<string>('clonazepam');
  const [currentDose, setCurrentDose] = useState<number>(2.0);
  const [strategy, setStrategy] = useState<BzdTaperStrategy>('maudsley_hyperbolic');
  const [pace, setPace] = useState<BzdTaperPace>('standard');

  const [copiedPlan, setCopiedPlan] = useState(false);
  const [copiedPatient, setCopiedPatient] = useState(false);
  const [imported, setImported] = useState(false);
  const [showFullEquivalenceTable, setShowFullEquivalenceTable] = useState(false);
  const [showDifferentialTable, setShowDifferentialTable] = useState(false);
  const [showPatientGuidance, setShowPatientGuidance] = useState(false);

  const selectedDrug = BZD_DATABASE[sourceDrugId] || BZD_DATABASE.clonazepam;

  const plan: BzdTaperPlan = generateBzdTaperPlan(
    sourceDrugId,
    currentDose,
    strategy,
    pace
  );

  const handleCopyPlan = () => {
    navigator.clipboard.writeText(plan.soapPlanText);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  const handleCopyPatientGuidance = () => {
    navigator.clipboard.writeText(plan.patientGuidanceText);
    setCopiedPatient(true);
    setTimeout(() => setCopiedPatient(false), 2000);
  };

  const handleImportSoap = () => {
    if (onImportToSoap) {
      onImportToSoap(
        plan.soapPlanText,
        `Desmame de ${plan.sourceDrug.name} (Diretrizes Maudsley 15ª ed. 2025)`
      );
      setImported(true);
      setTimeout(() => setImported(false), 2500);
    }
  };

  const handleSelectDrug = (drugId: string) => {
    setSourceDrugId(drugId);
    const drug = BZD_DATABASE[drugId];
    if (drug) {
      if (drug.id === 'clonazepam') setCurrentDose(2.0);
      else if (drug.id === 'alprazolam') setCurrentDose(1.0);
      else if (drug.id === 'diazepam') setCurrentDose(10.0);
      else if (drug.id === 'lorazepam') setCurrentDose(2.0);
      else if (drug.id === 'bromazepam') setCurrentDose(6.0);
      else if (drug.id === 'zolpidem') setCurrentDose(10.0);
      else if (drug.id === 'eszopiclona') setCurrentDose(3.0);
      else setCurrentDose(drug.equivalentTo10mgDiazepam);

      // Meia-vida ultracurta/curta se beneficia prioritariamente de transição para Diazepam
      if (drug.halfLifeCategory === 'short' || drug.halfLifeCategory === 'ultrashort') {
        setStrategy('maudsley_ashton_switch');
      } else {
        setStrategy('maudsley_hyperbolic');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Rationale & Evidence Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Diretrizes Maudsley 15ª Ed. (2025)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Horowitz & Taylor (2024)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Desmame Hiperbólico & APS
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              Calculadora de Desmame Hiperbólico de Benzodiazepínicos e Drogas Z
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              Protocolo farmacocinético atualizado pelas <strong>Diretrizes Maudsley de Desprescrição (15ª ed. 2025 / Horowitz & Taylor 2024)</strong>. Baseado na curva hiperbólica de ocupação de receptores GABA-A e no <em>Desmame Guiado pelo Paciente</em>, prevenindo a falha do desmame nos últimos miligramas (&quot;the difficult last mile&quot;) e quedas em idosos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenEvidenceModal && (
              <button
                type="button"
                onClick={onOpenEvidenceModal}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                Evidências Maudsley
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowDifferentialTable(!showDifferentialTable)}
              className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              {showDifferentialTable ? 'Ocultar Diferencial' : 'Abstinência vs. Recaída'}
            </button>
            <button
              type="button"
              onClick={() => setShowFullEquivalenceTable(!showFullEquivalenceTable)}
              className="px-3 py-2 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {showFullEquivalenceTable ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ocultar Equivalências
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Tabela Oral de Conversão
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible: Maudsley Differential Diagnostic Table (Withdrawal vs Relapse) */}
        {showDifferentialTable && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-indigo-600" />
                Diferenciação Clínica Maudsley (15ª Ed.): Síndrome de Retirada vs. Recaída do Transtorno de Base
              </h4>
              <span className="text-[11px] text-slate-500">
                Evita falso diagnóstico de recaída e previne o reinício crônico desnecessário
              </span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-indigo-50/70 border-b border-slate-200 text-indigo-950 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3 w-1/5">Critério Clínico</th>
                    <th className="py-2.5 px-3 w-2/5 bg-amber-50/50 text-amber-950">
                      Síndrome de Retirada (Abstinência GABA-A)
                    </th>
                    <th className="py-2.5 px-3 w-2/5 bg-slate-50 text-slate-900">
                      Recaída do Transtorno Pré-existente
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
                  {plan.withdrawalVsRelapseDiff.map((item, idx) => (
                    <tr key={`diff-row-${idx}`} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50/40">
                        {item.feature}
                      </td>
                      <td className="py-2.5 px-3 text-amber-900 bg-amber-50/20 leading-relaxed">
                        {item.withdrawal}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 leading-relaxed">
                        {item.relapse}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Collapsible: Equivalence Table */}
        {showFullEquivalenceTable && (
          <div className="mt-5 pt-4 border-t border-slate-100 overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Matriz de Conversão em Relação a 10 mg de Diazepam Oral (Maudsley / Ashton)
            </h4>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Fármaco</th>
                  <th className="py-2.5 px-3">Nomes Comerciais</th>
                  <th className="py-2.5 px-3">Dose Equivalente (~10mg Diazepam)</th>
                  <th className="py-2.5 px-3">Meia-Vida de Eliminação</th>
                  <th className="py-2.5 px-3">Metabolismo</th>
                  <th className="py-2.5 px-3">Apresentações no Brasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
                {Object.values(BZD_DATABASE).map((drug) => (
                  <tr
                    key={drug.id}
                    className={`hover:bg-slate-50 ${
                      drug.id === sourceDrugId ? 'bg-teal-50/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{drug.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{drug.commercialNames.join(', ')}</td>
                    <td className="py-2.5 px-3 text-teal-700 font-bold">
                      {drug.equivalentTo10mgDiazepam} mg
                    </td>
                    <td className="py-2.5 px-3">{drug.halfLifeHours}</td>
                    <td className="py-2.5 px-3 text-slate-600">{drug.metabolism}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      {drug.availablePresentations.join('; ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Main Grid: Controls (Left) & Schedule / Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Configuration Form (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Drug & Dose */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>1. Identificação do Uso Atual</span>
              <span className="text-xs font-normal text-slate-500">Etapa 1 de 3</span>
            </h3>

            {/* Drug Selection */}
            <div>
              <label
                htmlFor="bzd-drug-select"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Medicamento em Uso
              </label>
              <select
                id="bzd-drug-select"
                value={sourceDrugId}
                onChange={(e) => handleSelectDrug(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer font-medium"
              >
                {Object.values(BZD_DATABASE).map((drug) => (
                  <option key={drug.id} value={drug.id}>
                    {drug.name} ({drug.commercialNames.slice(0, 2).join(', ')}) — {drug.standardDoseRange}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Dose Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="bzd-dose-input"
                  className="text-xs font-bold text-slate-700 uppercase tracking-wider"
                >
                  Dose Diária Atual (mg/dia)
                </label>
                <span className="text-xs text-slate-500">
                  Faixa usual: {selectedDrug.standardDoseRange}
                </span>
              </div>
              <div className="relative">
                <input
                  id="bzd-dose-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={currentDose}
                  onChange={(e) => setCurrentDose(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 pr-16 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <span className="absolute right-3 top-2 text-xs font-medium text-slate-400">
                  mg / dia
                </span>
              </div>

              {/* Quick Dose Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedDrug.id === 'clonazepam' &&
                  [0.5, 1.0, 2.0, 4.0].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCurrentDose(d)}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        currentDose === d
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} mg {d === 2 ? '(1 cp ou 20 gts)' : d === 0.5 ? '(5 gts)' : ''}
                    </button>
                  ))}

                {selectedDrug.id === 'alprazolam' &&
                  [0.25, 0.5, 1.0, 2.0].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCurrentDose(d)}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        currentDose === d
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} mg
                    </button>
                  ))}

                {selectedDrug.id === 'diazepam' &&
                  [5.0, 10.0, 20.0].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCurrentDose(d)}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        currentDose === d
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} mg
                    </button>
                  ))}

                {selectedDrug.id === 'zolpidem' &&
                  [5.0, 10.0, 20.0].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCurrentDose(d)}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
                        currentDose === d
                          ? 'bg-teal-600 text-white border-teal-600 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d} mg
                    </button>
                  ))}
              </div>
            </div>

            {/* Calculated Receptor Occupancy & Equivalent Highlight */}
            <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-900 font-medium">Equivalente em Diazepam Oral:</span>
                <span className="text-sm font-extrabold text-teal-800">
                  {plan.equivalentDiazepamMg} mg / dia
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-teal-100">
                <span className="text-teal-900 font-medium flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-teal-700" />
                  Ocupação Estimada de GABA-A (PET):
                </span>
                <span className="text-sm font-extrabold text-teal-900">
                  ~{plan.baselineGabaReceptorOccupancy}%
                </span>
              </div>
              <div className="w-full bg-teal-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all"
                  style={{ width: `${plan.baselineGabaReceptorOccupancy}%` }}
                />
              </div>
              <p className="text-[10px] text-teal-700 leading-tight">
                Estudos de neuroimagem PET confirmam que a relação entre dose e ligação ao receptor segue curva hiperbólica; por isso, a fase final exige passos em microdoses.
              </p>
            </div>
          </div>

          {/* Step 2: Strategy Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>2. Estratégia de Desmame</span>
              <span className="text-xs font-normal text-slate-500">Etapa 2 de 3</span>
            </h3>

            <div className="space-y-3">
              {/* Strategy A: Maudsley Hyperbolic */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  strategy === 'maudsley_hyperbolic'
                    ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="maudsley_hyperbolic"
                  checked={strategy === 'maudsley_hyperbolic'}
                  onChange={() => setStrategy('maudsley_hyperbolic')}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Desmame Hiperbólico Maudsley (15ª Ed., 2025)</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-teal-100 text-teal-800 font-bold">
                      Padrão Ouro 2025
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Reduções proporcionais à dose remanescente (evita cortes fixos em mg). Protege a desocupação de receptores GABA-A e viabiliza a retirada sem sofrimento, especialmente com apresentações em gotas ou frações.
                  </p>
                </div>
              </label>

              {/* Strategy B: Ashton / Maudsley Switch to Diazepam */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  strategy === 'maudsley_ashton_switch'
                    ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="maudsley_ashton_switch"
                  checked={strategy === 'maudsley_ashton_switch'}
                  onChange={() => setStrategy('maudsley_ashton_switch')}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Transição para Diazepam + Desmame Hiperbólico</span>
                    {(selectedDrug.halfLifeCategory === 'short' ||
                      selectedDrug.halfLifeCategory === 'ultrashort') && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                        Recomendado p/ Meia-Vida Curta
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Substitui em 2 etapas o fármaco por Diazepam (meia-vida de até 200h) para eliminar a fissura interdose (típica de Alprazolam e Zolpidem), seguido de redução hiperbólica.
                  </p>
                </div>
              </label>

              {/* Strategy C: Direct Linear */}
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  strategy === 'direct_taper'
                    ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="strategy"
                  value="direct_taper"
                  checked={strategy === 'direct_taper'}
                  onChange={() => setStrategy('direct_taper')}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Desmame Linear Tradicional (Ashton Clássico)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Degraus fixos em mg</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Redução linear convencional de dose em mg. Atenção: pode precipitar sintomas de abstinência nos últimos degraus devido à desocupação acelerada de receptores.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Pace Selection */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>3. Ritmo de Desmame (Maudsley 2025)</span>
              <span className="text-xs font-normal text-slate-500">Etapa 3 de 3</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPace('conservative')}
                className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                  pace === 'conservative'
                    ? 'border-teal-600 bg-teal-50/50 font-bold ring-1 ring-teal-600'
                    : 'border-slate-200 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className="text-xs text-slate-900">Conservador</div>
                <div className="text-[10px] text-slate-500 mt-0.5">8 degraus (~24 sem.)</div>
                <div className="text-[10px] text-teal-700 font-medium mt-1">Uso &gt; 1 ano / Idosos</div>
              </button>

              <button
                type="button"
                onClick={() => setPace('standard')}
                className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                  pace === 'standard'
                    ? 'border-teal-600 bg-teal-50/50 font-bold ring-1 ring-teal-600'
                    : 'border-slate-200 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className="text-xs text-slate-900">Padrão</div>
                <div className="text-[10px] text-slate-500 mt-0.5">6 degraus (~12 sem.)</div>
                <div className="text-[10px] text-teal-700 font-medium mt-1">Maudsley Padrão</div>
              </button>

              <button
                type="button"
                onClick={() => setPace('accelerated')}
                className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                  pace === 'accelerated'
                    ? 'border-teal-600 bg-teal-50/50 font-bold ring-1 ring-teal-600'
                    : 'border-slate-200 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className="text-xs text-slate-900">Acelerado</div>
                <div className="text-[10px] text-slate-500 mt-0.5">4 degraus (~4 sem.)</div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">Uso recente &lt; 3 meses</div>
              </button>
            </div>

            {/* Patient-Led Tapering Callout */}
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2">
              <PauseCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-relaxed">
                <strong>Regra de Ouro Maudsley (Patient-Led Tapering):</strong> Se o paciente apresentar sintomas de abstinência moderados, <strong>PAUSAR</strong> a redução no degrau atual por 2 a 4 semanas até estabilização biológica. Nunca regredir para a dose cheia inicial.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule, Warnings & Export Actions (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Plan Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Cronograma Maudsley de Desprescrição
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{plan.sourceDrug.name} ({plan.currentDoseMg} mg/dia)</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className="text-teal-700 font-extrabold">0 mg/dia</span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleImportSoap}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    imported
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {imported ? (
                    <>
                      <Check className="w-4 h-4" />
                      Importado no Plano (P)!
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      Importar no SOAP (Plano)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedPlan ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  {copiedPlan ? 'Copiado!' : 'Copiar Texto'}
                </button>
              </div>
            </div>

            {/* Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Duração Estimada</span>
                <span className="text-sm font-bold text-slate-900">~{plan.totalEstimatedWeeks} semanas</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Número de Degraus</span>
                <span className="text-sm font-bold text-slate-900">{plan.numberOfSteps} etapas</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Equivalente Oral</span>
                <span className="text-sm font-bold text-teal-800">{plan.equivalentDiazepamMg} mg Diazepam</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ocupação Basal</span>
                <span className="text-sm font-bold text-teal-900">~{plan.baselineGabaReceptorOccupancy}% GABA-A</span>
              </div>
            </div>

            {/* Schedule Steps Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Passo a Passo das Consultas e Posologias</span>
                <span className="text-[11px] font-normal text-slate-500">
                  {strategy === 'maudsley_hyperbolic'
                    ? 'Redução hiperbólica (degraus decrescentes em mg)'
                    : 'Ajuste posológico progressivo'}
                </span>
              </h4>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {plan.schedule.map((step) => (
                  <div
                    key={step.stepNumber}
                    className={`p-3 transition-colors ${
                      step.percentRemaining === 0 ? 'bg-emerald-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.percentRemaining === 0
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-white'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{step.label}</span>
                        <span className="text-[10px] text-slate-500">
                          ({step.durationWeeks} {step.durationWeeks === 1 ? 'semana' : 'semanas'})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-slate-500">
                          GABA-A: <strong className="text-teal-800">~{step.estimatedGabaReceptorOccupancy}%</strong>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-700">
                            {step.percentRemaining}% da dose inicial
                          </span>
                          <div className="w-14 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                step.percentRemaining === 0 ? 'bg-emerald-500' : 'bg-teal-600'
                              }`}
                              style={{ width: `${step.percentRemaining}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-800 pl-8 space-y-1">
                      {strategy === 'maudsley_ashton_switch' ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900">{step.diazepamInstructions}</div>
                          {step.sourceDrugDoseMg > 0 && (
                            <div className="text-slate-600 text-[11px]">{step.sourceDrugInstructions}</div>
                          )}
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-900">
                          Posologia: {step.sourceDrugInstructions}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 italic">{step.clinicalNotes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle Patient Guidance Box */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowPatientGuidance(!showPatientGuidance)}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-teal-600" />
                  Guia do Paciente (Diretrizes Maudsley 2025 / WhatsApp / Impressão)
                </span>
                {showPatientGuidance ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {showPatientGuidance && (
                <div className="mt-3 p-4 bg-teal-50/40 border border-teal-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                      Texto Pronto para Orientação ao Cidadão
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPatientGuidance}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-white border border-teal-300 rounded hover:bg-teal-50 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedPatient ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copiedPatient ? 'Copiado!' : 'Copiar para WhatsApp'}
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 bg-white p-3 rounded border border-teal-100 font-sans whitespace-pre-wrap leading-relaxed">
                    {plan.patientGuidanceText}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Safety Warnings & Red Flags (Mandatory Clinical Protocols) */}
          <div className="bg-red-50/70 border border-red-300 rounded-xl p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Sinais de Alarme & Alertas Clínicos Críticos (Segurança do Paciente)
            </h4>
            <ul className="text-xs text-red-800 space-y-1.5 pl-1">
              {plan.safetyWarnings.map((warning, idx) => (
                <li key={`safety-${idx}`} className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Withdrawal Symptoms & Non-Pharmacological Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Sintomas Esperados de Retirada
              </h4>
              <ul className="text-xs text-amber-900/90 space-y-1 pl-1">
                {plan.withdrawalSymptoms.map((sym, idx) => (
                  <li key={`sym-${idx}`} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                Não-Farmacológicos na APS (TCC-I)
              </h4>
              <ul className="text-xs text-emerald-900 space-y-1 pl-1">
                {plan.nonPharmacologicalAdvice.map((adv, idx) => (
                  <li key={`adv-${idx}`} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
