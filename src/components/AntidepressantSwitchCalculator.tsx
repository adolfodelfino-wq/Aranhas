import React, { useState } from 'react';
import {
  ANTIDEPRESSANTS_DB,
  calculateAntidepressantTransition,
  EQUIVALENCE_REFERENCE_TABLE,
  AntidepressantSwitchPlan,
} from '../utils/antidepressantSwitching';
import {
  Pill,
  ArrowRight,
  ArrowLeftRight,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  Copy,
  FileCheck,
  BookOpen,
  Sparkles,
  ExternalLink,
  HeartPulse,
  Activity,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';

interface AntidepressantSwitchCalculatorProps {
  onImportToSoap?: (text: string, title: string) => void;
  onOpenEvidenceModal?: () => void;
}

export const AntidepressantSwitchCalculator: React.FC<AntidepressantSwitchCalculatorProps> = ({
  onImportToSoap,
  onOpenEvidenceModal,
}) => {
  const drugKeys = Object.keys(ANTIDEPRESSANTS_DB);

  const [sourceDrugId, setSourceDrugId] = useState<string>('sertralina');
  const [sourceDose, setSourceDose] = useState<number>(100);
  const [targetDrugId, setTargetDrugId] = useState<string>('desvenlafaxina');
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);
  const [showFullEquivalenceTable, setShowFullEquivalenceTable] = useState(false);

  const plan: AntidepressantSwitchPlan = calculateAntidepressantTransition(
    sourceDrugId,
    sourceDose,
    targetDrugId
  );

  const handleSwap = () => {
    const prevSource = sourceDrugId;
    const prevTarget = targetDrugId;
    setSourceDrugId(prevTarget);
    setTargetDrugId(prevSource);
    setSourceDose(plan.recommendedTargetDoseMg);
  };

  const handleCopyPlan = () => {
    navigator.clipboard.writeText(plan.soapPrescriptionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportSoap = () => {
    if (onImportToSoap) {
      onImportToSoap(
        plan.soapPrescriptionText,
        `Transição: ${plan.sourceDrug.name} -> ${plan.targetDrug.name}`
      );
      setImported(true);
      setTimeout(() => setImported(false), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase">
              Diretrizes Maudsley (14th Ed) & Hayasaka (2015)
            </span>
            <span className="text-xs text-slate-500 font-normal">
              Meta-Análise RCTs
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" />
            <span>Guia de Troca de Antidepressivos</span>
          </h2>
          <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
            Calcula a dose clinicamente equivalente, determina a estratégia recomendada (Troca Direta, Cruzada ou Washout), avalia riscos de síndrome serotoninérgica/descontinuação e gera cronograma semanal.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowFullEquivalenceTable(!showFullEquivalenceTable)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TableIcon className="w-4 h-4 text-teal-700" />
            <span>{showFullEquivalenceTable ? 'Ocultar Tabela' : 'Ver Tabela de Equivalências'}</span>
            {showFullEquivalenceTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Tabela de Equivalência Geral Expansível */}
      {showFullEquivalenceTable && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>Tabela Geral de Doses Equivalentes de Antidepressivos</span>
              </h3>
              <p className="text-xs text-slate-500">
                Baseado em <strong>Hayasaka Y et al. (J Affect Disord, 2015)</strong> e Maudsley Prescribing Guidelines.
              </p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded font-mono font-semibold">
              Ref: Fluoxetina 40 mg/d
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-semibold">Antidepressivo</th>
                  <th className="py-2.5 px-3 font-semibold">Classe</th>
                  <th className="py-2.5 px-3 font-semibold text-teal-800">Eq. Fluoxetina 40mg</th>
                  <th className="py-2.5 px-3 font-semibold">Eq. Fluoxetina 20mg</th>
                  <th className="py-2.5 px-3 font-semibold">Meia-vida Plasmática</th>
                  <th className="py-2.5 px-3 font-semibold">Base Científica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {EQUIVALENCE_REFERENCE_TABLE.map((row, idx) => (
                  <tr key={`ad-row-${idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 font-semibold text-slate-900">{row.drug}</td>
                    <td className="py-2 px-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600 border border-slate-200">
                        {row.class}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-teal-900 font-mono">{row.dose40Eq}</td>
                    <td className="py-2 px-3 font-medium text-slate-600 font-mono">{row.dose20Eq}</td>
                    <td className="py-2 px-3 text-slate-500">{row.halfLife}</td>
                    <td className="py-2 px-3">
                      {row.isRct ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          RCT (Hayasaka 2015)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                          Consenso Clínico
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selectors Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* Drug 1 (Source) */}
          <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>1. Medicação Atual (Desmame)</span>
              </label>
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                {plan.sourceDrug.class}
              </span>
            </div>

            <div>
              <select
                value={sourceDrugId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSourceDrugId(newId);
                  const newDrug = ANTIDEPRESSANTS_DB[newId];
                  if (newDrug && Array.isArray(newDrug.standardDoses) && !newDrug.standardDoses.includes(sourceDose)) {
                    setSourceDose(newDrug.standardDoses[1] || newDrug.standardDoses[0] || 20);
                  }
                }}
                className="w-full bg-white border border-slate-300 text-slate-900 rounded p-2.5 text-xs font-semibold focus:border-blue-600 outline-none"
              >
                {drugKeys.map((key) => {
                  const drug = ANTIDEPRESSANTS_DB[key];
                  return (
                    <option key={key} value={key}>
                      {drug.name} ({drug.class})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Doses Rápidas */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 font-medium flex justify-between">
                <span>Dose Atual em Uso (mg/dia):</span>
                <span className="text-slate-400">Faixa: {plan.sourceDrug.minTherapeuticDose} - {plan.sourceDrug.maxRecommendedDose} mg</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plan.sourceDrug.standardDoses.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSourceDose(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      sourceDose === d
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {d} mg
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <input
                  type="number"
                  min={1}
                  max={600}
                  value={sourceDose}
                  onChange={(e) => setSourceDose(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3 py-1.5 text-xs font-mono focus:border-teal-700 outline-none"
                  placeholder="Ou digite outra dose em mg"
                />
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="lg:col-span-1 flex justify-center py-2 lg:py-0">
            <button
              onClick={handleSwap}
              className="p-2.5 bg-slate-100 hover:bg-teal-700 text-slate-600 hover:text-white rounded-full border border-slate-200 transition-colors shadow-xs cursor-pointer group"
              title="Inverter Medicações"
            >
              <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* Drug 2 (Target) */}
          <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span>2. Nova Medicação (Introdução)</span>
              </label>
              <span className="text-[11px] text-teal-800 font-medium bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                {plan.targetDrug.class}
              </span>
            </div>

            <div>
              <select
                value={targetDrugId}
                onChange={(e) => setTargetDrugId(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg p-2.5 text-xs font-medium focus:border-teal-700 outline-none"
              >
                {drugKeys.map((key) => {
                  const drug = ANTIDEPRESSANTS_DB[key];
                  return (
                    <option key={key} value={key} disabled={key === sourceDrugId}>
                      {drug.name} ({drug.class}) {key === sourceDrugId ? '(Atual)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Informações da Molécula Alvo */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] text-slate-500 font-medium flex justify-between">
                <span>Doses Comerciais:</span>
                <span className="text-teal-800 font-semibold font-mono">
                  {plan.targetDrug.standardDoses.join(', ')} mg
                </span>
              </div>
              <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                <strong className="text-slate-800 font-medium">Meia-vida:</strong> {plan.targetDrug.halfLifeHours}
              </div>
            </div>
          </div>
        </div>

        {/* Pairing Result Summary Box */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 font-mono font-semibold uppercase tracking-wider">
                Pareamento Farmacológico Calculado
              </span>
              <div className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
                <span>{plan.sourceDrug.name} {plan.sourceDoseMg} mg/dia</span>
                <ArrowRight className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-teal-900 font-semibold">{plan.targetDrug.name} ~{plan.recommendedTargetDoseMg} mg/dia</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-xs font-medium">
                Equivalência estimada: <strong className="text-teal-800 font-mono">{plan.calculatedEquivalentDoseMg.toFixed(1)} mg</strong>
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                {plan.evidenceSource}
              </span>
              {onOpenEvidenceModal && (
                <button
                  type="button"
                  onClick={onOpenEvidenceModal}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                  <span>Ver evidências</span>
                </button>
              )}
            </div>
          </div>

          {/* Strategy Box */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            plan.strategyType === 'washout'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : plan.strategyType === 'direct'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-teal-50/60 border-teal-200 text-teal-950'
          }`}>
            <div className="mt-0.5 shrink-0">
              {plan.strategyType === 'washout' ? (
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              ) : plan.strategyType === 'direct' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <Activity className="w-5 h-5 text-teal-700" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs sm:text-sm">
                  Estratégia Recomendada: {plan.strategyTitle}
                </span>
                <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded border border-slate-200 font-mono font-medium">
                  ~{plan.durationWeeks} semanas
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {plan.strategySummary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE TRANSIÇÃO PASSO A PASSO (CRONOGRAMA SEMANAL) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>Cronograma Semanal de Transição</span>
            </h3>
            <p className="text-xs text-slate-500">
              Protocolo posológico detalhado para orientar o paciente e prescrever no prontuário.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlan}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Cronograma'}</span>
            </button>

            {onImportToSoap && (
              <button
                onClick={handleExportSoap}
                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-teal-200" />
                <span>{imported ? 'Inserido no SOAP!' : 'Inserir no SOAP (Plano)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabela Formatada */}
        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <th className="py-2.5 px-3 font-bold w-36">Período / Fase</th>
                <th className="py-2.5 px-3 font-bold text-amber-800 w-52">
                  1. Desmame ({plan.sourceDrug.name})
                </th>
                <th className="py-2.5 px-3 font-bold text-blue-800 w-52">
                  2. Introdução ({plan.targetDrug.name})
                </th>
                <th className="py-2.5 px-3 font-bold">Conduta Clínica e Ações</th>
                <th className="py-2.5 px-3 font-bold">Sintomas para Monitorar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {plan.timelineSteps.map((step) => (
                <tr key={step.stepNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                    {step.periodLabel}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-900 bg-amber-50/40 font-medium">
                    {step.sourceDose}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-blue-900 bg-blue-50/40 font-semibold">
                    {step.targetDose}
                  </td>
                  <td className="py-2.5 px-3 leading-relaxed text-slate-800">
                    {step.clinicalAction}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] leading-relaxed">
                    {step.symptomsToMonitor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Racional Farmacológico & Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Racional */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <h3 className="font-semibold text-slate-900 text-xs uppercase font-mono">
              Racional Farmacocinético & Dinâmico
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            {plan.pharmacologicalRationale.map((rat, i) => (
              <li key={`rat-${i}`} className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>{rat}</span>
              </li>
            ))}
            {plan.clinicalRisks.cypInteractions.map((cyp, i) => (
              <li key={`cyp-${i}`} className="flex items-start gap-2 text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Interação CYP450:</strong> {cyp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alertas */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-xs uppercase font-mono">
              Sinais de Alerta & Monitoramento
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-slate-800">Síndrome de Descontinuação (FINISH):</strong>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {plan.clinicalRisks.discontinuationSyndrome.risk}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {plan.clinicalRisks.discontinuationSyndrome.note}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-slate-800">Risco Síndrome Serotoninérgica:</strong>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-900 border border-blue-300">
                  {plan.clinicalRisks.serotoninSyndrome.risk}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {plan.clinicalRisks.serotoninSyndrome.note}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
