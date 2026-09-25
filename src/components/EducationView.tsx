import React, { useState } from 'react';
import { EDUCATION_MATERIALS } from '../data/educationData';
import { EducationMaterial } from '../types';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Printer,
  FileCheck,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface EducationViewProps {
  onImportToSoapPlan: (text: string, title: string) => void;
  onOpenEducationSuggestions?: () => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  onImportToSoapPlan,
  onOpenEducationSuggestions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Todos');
  const [selectedMaterial, setSelectedMaterial] = useState<EducationMaterial | null>(null);
  const [printModalMaterial, setPrintModalMaterial] = useState<EducationMaterial | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importedId, setImportedId] = useState<string | null>(null);

  const topics = ['Todos', 'TDAH', 'Depressão', 'Ansiedade', 'Sono', 'Psicofármacos'];

  const filteredMaterials = EDUCATION_MATERIALS.filter((mat) => {
    const matchesTopic = selectedTopic === 'Todos' || mat.topic === selectedTopic;
    const matchesSearch =
      (mat.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mat.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mat.topic || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const copyMaterialText = (mat: EducationMaterial) => {
    navigator.clipboard.writeText(mat.fullText);
    setCopiedId(mat.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportToPlan = (mat: EducationMaterial) => {
    const textToInsert = `Entregue e orientado material de Educação em Saúde: "${mat.title}". Pactuadas ações práticas de manejo no cotidiano.`;
    onImportToSoapPlan(textToInsert, mat.title);
    setImportedId(mat.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-teal-400" />
          <span>Biblioteca de Educação em Saúde para a APS</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Materiais práticos para orientação de pacientes e familiares, com suporte a visualização para impressão.
        </p>
      </div>

      {/* Banner de Educação Contextual do Atendimento */}
      {onOpenEducationSuggestions && (
        <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-800/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h2 className="font-bold text-slate-100 text-sm">
                Sugestões de Educação em Saúde Contextual
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Obtenha de 3 a 5 sugestões orientadas especificamente pelo resultado das Escalas preenchidas e pelos dados do Exame do Estado Mental (EEM) deste atendimento.
            </p>
          </div>

          <button
            onClick={onOpenEducationSuggestions}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver sugestões contextuais do caso</span>
          </button>
        </div>
      )}

      {/* Busca e Filtro por Tema */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por palavra-chave..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedTopic === t
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Materiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/50 transition-all space-y-3 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-300 bg-teal-950 border border-teal-800/60 px-2.5 py-0.5 rounded-md">
                  {mat.topic}
                </span>
                <span className="text-[11px] text-slate-400">
                  {mat.targetAudience}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-base leading-snug">
                {mat.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {mat.summary}
              </p>

              {/* Ações Práticas */}
              {mat.practicalActions && mat.practicalActions.length > 0 && (
                <div className="bg-slate-850 border border-slate-800 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="font-semibold text-teal-400 text-[11px] uppercase tracking-wider">
                    Ações Práticas Destaque:
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {mat.practicalActions.slice(0, 3).map((act, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Ações do Card */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <button
                onClick={() => setSelectedMaterial(mat)}
                className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline underline-offset-2"
              >
                Ver Texto Completo
              </button>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => copyMaterialText(mat)}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                  title="Copiar texto do material"
                >
                  {copiedId === mat.id ? (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => setPrintModalMaterial(mat)}
                  className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                  title="Visualizar modo de impressão limpo"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                </button>

                <button
                  onClick={() => handleExportToPlan(mat)}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>
                    {importedId === mat.id ? 'Anexado!' : 'Anexar ao Plano'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Texto Completo */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {selectedMaterial.topic}
                </span>
                <h2 className="font-bold text-slate-100 text-base mt-1">
                  {selectedMaterial.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans space-y-3 flex-1">
              {selectedMaterial.fullText}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800 shrink-0">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modo Impressão Limpo */}
      {printModalMaterial && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-2xl p-8 w-full max-w-2xl shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
              <div>
                <div className="font-bold text-teal-700 text-xs tracking-wider uppercase">
                  Nexus Clínico — Folheto de Orientação ao Paciente
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {printModalMaterial.title}
                </h2>
              </div>

              <button
                onClick={() => setPrintModalMaterial(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans flex-1 p-2 bg-slate-50 rounded-xl border border-slate-200">
              {printModalMaterial.printFriendly}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 shrink-0">
              <span className="text-[11px] text-slate-500 italic">
                Atenção Primária à Saúde • Medicina de Família e Comunidade (MFC/APS)
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => setPrintModalMaterial(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-medium"
                >
                  Fechar
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Material</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
