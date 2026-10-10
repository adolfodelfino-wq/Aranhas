import React, { useState, useMemo } from 'react';
import { SoapState, PatientSession } from '../types';
import {
  COMMON_APS_CODES,
  CiapCidItem,
  formatForPec,
} from '../utils/pecFormatter';
import {
  X,
  Copy,
  Check,
  Building2,
  FileCheck2,
  Tag,
  Share2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface PecExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  soapState: SoapState;
  patient: PatientSession;
}

export const PecExportModal: React.FC<PecExportModalProps> = ({
  isOpen,
  onClose,
  soapState,
  patient,
}) => {
  const [selectedCodes, setSelectedCodes] = useState<CiapCidItem[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const toggleCode = (code: CiapCidItem) => {
    setSelectedCodes((prev) =>
      prev.some((c) => c.ciap2 === code.ciap2)
        ? prev.filter((c) => c.ciap2 !== code.ciap2)
        : [...prev, code]
    );
  };

  const formatted = useMemo(() => {
    return formatForPec(soapState, patient, selectedCodes);
  }, [soapState, patient, selectedCodes]);

  if (!isOpen) return null;

  const handleCopySingle = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(formatted.fullNarrative);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  e-SUS APS / PEC
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  Prontuário Eletrônico do Cidadão
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Assistente de cópia para PEC (e-SUS APS)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* Instructions Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-teal-700" />
              Assistente de Formatação e Cópia Manual para o PEC
            </div>
            <p className="text-slate-600">
              Copie individualmente cada campo para colar nas caixas correspondentes do PEC (Subjetivo, Objetivo, Avaliação, Plano) ou utilize o botão de cópia unificada. Recurso estritamente textual para agilizar a rotina clínica na APS.
            </p>
          </div>

          {/* CIAP-2 / CID-10 Quick Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                Vincular Códigos de Problema / Condição (CIAP-2 / CID-10)
              </label>
              <span className="text-[11px] text-slate-500">
                {selectedCodes.length} código(s) anexado(s) à Avaliação
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {COMMON_APS_CODES.map((item) => {
                const isSelected = selectedCodes.some((c) => c.ciap2 === item.ciap2);
                return (
                  <button
                    key={item.ciap2}
                    type="button"
                    onClick={() => toggleCode(item)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-mono font-semibold text-teal-800">{item.ciap2}</span>
                    <span className="text-slate-400">/</span>
                    <span className="font-mono text-slate-700">{item.cid10}</span>
                    <span className="text-slate-600 hidden sm:inline">({item.label})</span>
                    {isSelected && <Check className="w-3 h-3 text-teal-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SOAP 4-Field Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* S - Subjetivo */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-mono font-bold text-xs text-slate-900">
                  [S] SUBJETIVO (Queixa / HDA)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(formatted.subjective, 'S')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedSection === 'S' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar S</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                {formatted.subjective}
              </p>
            </div>

            {/* O - Objetivo */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-mono font-bold text-xs text-slate-900">
                  [O] OBJETIVO (EEM & Escalas)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(formatted.objective, 'O')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedSection === 'O' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar O</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                {formatted.objective}
              </p>
            </div>

            {/* A - Avaliação */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-mono font-bold text-xs text-slate-900">
                  [A] AVALIAÇÃO & DIAGNÓSTICO
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(formatted.assessment, 'A')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedSection === 'A' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar A</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                {formatted.assessment}
              </p>
            </div>

            {/* P - Plano */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <span className="font-mono font-bold text-xs text-slate-900">
                  [P] PLANO & DESPRESCRIÇÃO
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySingle(formatted.plan, 'P')}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedSection === 'P' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar P</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                {formatted.plan}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Paciente: <strong>{patient.name}</strong> • Prontuário: {patient.prontuario || 'S/N'}
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md text-xs font-semibold transition-colors cursor-pointer"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={handleCopyAll}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {copiedAll ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Copiado para o PEC!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Registro Completo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
