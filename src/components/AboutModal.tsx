import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  User,
  Mail,
  Building2,
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  Target,
  FileText,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { ALL_EVIDENCE_REFERENCES, TCR_EVIDENCE_GROUPS, TCR_EVIDENCE_REFERENCES } from '../data/evidenceData';
import { TCR_SCALES } from '../data/scalesData';
import { NexusLogo } from './NexusLogo';

export type AboutModalTab = 'sobre' | 'desenvolvedor' | 'contato' | 'evidencias';
type EvidenceGroup = 'all' | typeof TCR_EVIDENCE_GROUPS[number]['id'];

const evidenceScopes = [
  { id: 'tcr', label: 'Escopo do TCR', references: TCR_EVIDENCE_REFERENCES },
  { id: 'general', label: 'Acervo geral', references: ALL_EVIDENCE_REFERENCES },
] as const;
const evidenceGroups = [{ id: 'all', label: 'Todas' }, ...TCR_EVIDENCE_GROUPS] as const;

interface AboutModalProps {
  onClose: () => void;
  initialTab?: AboutModalTab;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  onClose,
  initialTab = 'sobre',
}) => {
  const [activeTab, setActiveTab] = useState<AboutModalTab>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceScope, setEvidenceScope] = useState<typeof evidenceScopes[number]>(evidenceScopes[0]);
  const [evidenceGroup, setEvidenceGroup] = useState<EvidenceGroup>('all');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('adolfodelfino@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const group = TCR_EVIDENCE_GROUPS.find((entry) => entry.id === evidenceGroup);
  const query = searchQuery.trim().toLowerCase();
  const filteredReferences = evidenceScope.references.filter((ref) =>
    (!group || group.referenceIds.some((id) => id === ref.id)) &&
    [ref.title, ref.source, ref.topic, ref.summary].some((field) => field.toLowerCase().includes(query))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 text-slate-800 rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 sm:px-6 py-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <NexusLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                  Nexus Clínico
                </h2>
                <span className="font-sans text-[11px] bg-slate-100 text-slate-600 border border-slate-200 font-medium px-2 py-0.5 rounded">
                  v2.4.0
                </span>
              </div>
              <p className="font-sans text-xs text-slate-500 mt-0.5">
                Suporte à Decisão Clínica e Registro Estruturado na APS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 px-5 sm:px-6 pt-2 pb-0 bg-white shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sobre')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'sobre'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Sobre o Nexus</span>
          </button>

          <button
            onClick={() => setActiveTab('desenvolvedor')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'desenvolvedor'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Desenvolvedor</span>
          </button>

          <button
            onClick={() => setActiveTab('contato')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'contato'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contato</span>
          </button>

          <button
            onClick={() => setActiveTab('evidencias')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              activeTab === 'evidencias'
                ? 'border-teal-700 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Evidências & Diretrizes</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4 font-sans text-xs">
          {/* TAB 1: SOBRE O NEXUS */}
          {activeTab === 'sobre' && (
            <div className="space-y-4 text-slate-700">
              <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-teal-800 font-medium text-xs">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <span>Atenção Primária à Saúde e Medicina de Família e Comunidade</span>
                </div>

                <h3 className="font-sans text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  Suporte à decisão clínica e documentação estruturada no consultório.
                </h3>

                <p className="font-sans leading-relaxed text-slate-600 text-xs">
                  O <strong>Nexus Clínico</strong> organiza o registro em consulta ambulatorial, reunindo notas no formato SOAP, Exame do Estado Mental e escalas padronizadas.
                </p>

                <div className="pt-1.5 flex flex-wrap gap-2 text-[11px]">
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                    <span>Registro SOAP Estruturado</span>
                  </span>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                    <span>Exame do Estado Mental (EEM)</span>
                  </span>
                  <span className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                    <span>Instrumentos Padronizados</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <Target className="w-4 h-4 text-teal-700" />
                    <span>Propósito Clínico</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 text-[11px]">
                    Organizar achados e escores para facilitar a continuidade do cuidado. A interpretação clínica e a decisão terapêutica permanecem com o médico.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Princípio Fundamental</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 text-[11px]">
                    <em>"O Nexus mede, calcula, alerta e estrutura. O médico interpreta, revisa e decide."</em> Nenhum plano é aplicado sem a conferência do profissional.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-lg space-y-1 text-amber-900">
                <div className="font-semibold flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Aviso de Responsabilidade Médica</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  O Nexus Clínico é uma ferramenta determinística de apoio ao registro clínico. As escalas e sínteses não substituem a anamnese, o exame físico e a avaliação presencial do médico.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DESENVOLVEDOR */}
          {activeTab === 'desenvolvedor' && (
            <div className="space-y-4 text-slate-700">
              <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 bg-slate-800 text-white rounded-lg flex items-center justify-center text-base font-semibold">
                    AA
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-semibold text-slate-900">Dr. Adolfo Aranha</h3>
                    <p className="text-xs text-slate-500">Médico Idealizador e Desenvolvedor</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Médico Residente de Medicina de Família e Comunidade (MFC) • Atenção Primária à Saúde</span>
                </div>

                <p className="leading-relaxed text-slate-600 text-xs">
                  Desenvolvido com o objetivo de aproximar a informática médica das necessidades reais da consulta na Atenção Primária, priorizando ergonomia cognitiva, segurança clínica e agilidade de registro.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CONTATO */}
          {activeTab === 'contato' && (
            <div className="space-y-4 text-slate-700">
              <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-3.5">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
                  <Mail className="w-4 h-4 text-teal-700" />
                  <span>Contato Institucional e Acadêmico</span>
                </div>

                <p className="leading-relaxed text-slate-600 text-xs">
                  Para dúvidas, sugestões de aprimoramento clínico, diálogo acadêmico ou colaborações no contexto da APS:
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                      E-mail Direto
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      adolfodelfino@gmail.com
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    <a
                      href="mailto:adolfodelfino@gmail.com?subject=Contato%20Nexus%20Clinico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Enviar E-mail</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVIDÊNCIAS & DIRETRIZES */}
          {activeTab === 'evidencias' && (
            <div className="space-y-4 text-slate-700">
              <div role="group" aria-label="Escopo das evidências" className="flex flex-wrap gap-2">
                {evidenceScopes.map((scope) => (
                  <button
                    key={scope.id}
                    type="button"
                    aria-pressed={evidenceScope.id === scope.id}
                    onClick={() => {
                      setEvidenceScope(scope);
                      setEvidenceGroup('all');
                    }}
                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      evidenceScope.id === scope.id
                        ? 'border-teal-700 bg-teal-700 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {scope.label} ({scope.references.length})
                  </button>
                ))}
              </div>

              {evidenceScope.id === 'tcr' && (
                <div className="space-y-2">
                  <p className="text-slate-600 text-xs">
                    Núcleo avaliado no TCR: SOAP, EEM, {TCR_SCALES.map((scale) => scale.acronym).join(' e ')}.
                    {' '}As referências dos demais instrumentos e das calculadoras estão no acervo geral.
                  </p>
                  <div role="group" aria-label="Categorias de evidências do TCR" className="flex flex-wrap gap-1.5">
                    {evidenceGroups.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        aria-pressed={evidenceGroup === entry.id}
                        onClick={() => setEvidenceGroup(entry.id)}
                        className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                          evidenceGroup === entry.id
                            ? 'border-teal-300 bg-teal-50 text-teal-900 font-semibold'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Pesquisar evidências"
                  placeholder="Pesquisar por título, fonte ou palavra-chave..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-700"
                />
              </div>

              {/* References List */}
              <div className="space-y-2.5">
                {filteredReferences.map((ref) => (
                  <div
                    key={ref.id}
                    className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-1.5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-medium">
                          {ref.topic}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {ref.source} ({ref.year})
                        </span>
                      </div>
                    </div>

                    <h4 className="font-sans font-semibold text-xs text-slate-900">{ref.title}</h4>

                    <p className="text-slate-600 leading-relaxed text-[11px]">{ref.summary}</p>

                    {ref.keyPoints && ref.keyPoints.length > 0 && (
                      <div className="bg-slate-50 border border-slate-200/70 p-2.5 rounded-md space-y-1 text-[11px]">
                        <span className="font-semibold text-teal-900 block">Pontos-Chave:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                          {ref.keyPoints.map((pt, idx) => (
                            <li key={`kp-${ref.id}-${idx}`}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {filteredReferences.length === 0 && (
                  <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs">
                    Nenhuma diretriz encontrada para a pesquisa "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-5 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/50 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-sans text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
