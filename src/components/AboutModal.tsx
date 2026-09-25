import React, { useState } from 'react';
import {
  Brain,
  X,
  ShieldAlert,
  Award,
  Code,
  User,
  Mail,
  Building2,
  BookmarkCheck,
  Search,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Target,
  HeartPulse,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { EVIDENCE_REFERENCES } from '../data/evidenceData';
import { NexusLogo } from './NexusLogo';

export type AboutModalTab = 'sobre' | 'desenvolvedor' | 'contato' | 'evidencias';

interface AboutModalProps {
  onClose: () => void;
  onOpenCodeExport?: () => void;
  initialTab?: AboutModalTab;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  onClose,
  onOpenCodeExport,
  initialTab = 'sobre',
}) => {
  const [activeTab, setActiveTab] = useState<AboutModalTab>(initialTab);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('adolfodelfino@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const filteredReferences = EVIDENCE_REFERENCES.filter((ref) => {
    const q = searchQuery.toLowerCase();
    return (
      (ref.title || '').toLowerCase().includes(q) ||
      (ref.source || '').toLowerCase().includes(q) ||
      (ref.topic || '').toLowerCase().includes(q) ||
      (ref.summary || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 bg-[#1A1C1E]/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border-[1.5px] border-[#1A1C1E] text-[#1A1C1E] rounded-[4px] p-5 sm:p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1A1C1E]/15 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <NexusLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-lg sm:text-xl font-black text-[#0A3B74] tracking-tight">
                  NEXUS <span className="text-teal-700">CLÍNICO</span>
                </h2>
                <span className="font-mono bg-[#0A3B74] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase">
                  v2.2.0-APS
                </span>
              </div>
              <p className="font-sans text-xs text-slate-600 mt-0.5">
                Plataforma de Suporte à Decisão Clínica & Registro Estruturado na APS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#1A1C1E]/5 rounded-[4px] text-[#1A1C1E]/60 hover:text-[#1A1C1E] transition-colors cursor-pointer"
            title="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#1A1C1E]/15 pb-2 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sobre')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-[0.7rem] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sobre'
                ? 'bg-[#1A1C1E] text-[#F8F7F4] shadow-xs'
                : 'bg-transparent text-[#1A1C1E]/70 hover:bg-[#1A1C1E]/8 hover:text-[#1A1C1E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sobre o Nexus</span>
          </button>

          <button
            onClick={() => setActiveTab('desenvolvedor')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-[0.7rem] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'desenvolvedor'
                ? 'bg-[#1A1C1E] text-[#F8F7F4] shadow-xs'
                : 'bg-transparent text-[#1A1C1E]/70 hover:bg-[#1A1C1E]/8 hover:text-[#1A1C1E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Desenvolvedor</span>
          </button>

          <button
            onClick={() => setActiveTab('contato')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-[0.7rem] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'contato'
                ? 'bg-[#1A1C1E] text-[#F8F7F4] shadow-xs'
                : 'bg-transparent text-[#1A1C1E]/70 hover:bg-[#1A1C1E]/8 hover:text-[#1A1C1E]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contato</span>
          </button>

          <button
            onClick={() => setActiveTab('evidencias')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-[0.7rem] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'evidencias'
                ? 'bg-[#1A1C1E] text-[#F8F7F4] shadow-xs'
                : 'bg-transparent text-[#1A1C1E]/70 hover:bg-[#1A1C1E]/8 hover:text-[#1A1C1E]'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Evidências & Diretrizes</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* TAB 1: SOBRE O NEXUS */}
          {activeTab === 'sobre' && (
            <div className="space-y-4 text-xs text-[#1A1C1E]/80">
              <NexusLogo variant="banner" />

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-[#115E59] font-mono font-bold uppercase tracking-wider text-[11px]">
                  <Zap className="w-4 h-4 text-[#115E59]" />
                  <span>Transformando o Cuidado em Saúde Mental na APS</span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1C1E] leading-snug">
                  Mais Agilidade, Maior Precisão Semiológica e Registro Clínico de Excelência.
                </h3>

                <p className="font-sans leading-relaxed text-[#1A1C1E]/80 text-xs sm:text-sm">
                  O <strong>Nexus Clínico</strong> foi desenvolvido para apoiar médicos de família, residentes e equipes multiprofissionais no manejo qualificado, seguro e baseado em evidências na atenção clínica e ambulatorial.
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="bg-white border border-[#1A1C1E]/20 text-[#115E59] px-2.5 py-1 rounded-[2px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#115E59]" />
                    <span>Método Centrado na Pessoa</span>
                  </span>
                  <span className="bg-white border border-[#1A1C1E]/20 text-[#115E59] px-2.5 py-1 rounded-[2px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#115E59]" />
                    <span>Escalas Validadas</span>
                  </span>
                  <span className="bg-white border border-[#1A1C1E]/20 text-[#115E59] px-2.5 py-1 rounded-[2px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#115E59]" />
                    <span>Prontuário SOAP Estruturado</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-[#1A1C1E]/15 p-4 rounded-[4px] space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#115E59] text-sm">
                    <Target className="w-4 h-4 text-[#115E59]" />
                    <span>Motivação & Propósito</span>
                  </div>
                  <p className="leading-relaxed text-[#1A1C1E]/70 text-[11px]">
                    Reduzir a carga cognitiva e o tempo de documentação manual, permitindo focar na escuta qualificada e no vínculo terapêutico longitudinal.
                  </p>
                </div>

                <div className="bg-white border border-[#1A1C1E]/15 p-4 rounded-[4px] space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-[#115E59] text-sm">
                    <HeartPulse className="w-4 h-4 text-[#115E59]" />
                    <span>Cuidado Compartilhado</span>
                  </div>
                  <p className="leading-relaxed text-[#1A1C1E]/70 text-[11px]">
                    Facilitar a articulação e referência entre a APS (MFC) e a Atenção Especializada (CAPS / Psiquiatria), garantindo transições farmacológicas seguras.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#1A1C1E]/15 p-4 rounded-[4px] space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#1A1C1E]">
                  <Award className="w-4 h-4 text-[#115E59]" />
                  <span>Desenvolvimento & Contexto Clínico</span>
                </div>
                <p className="leading-relaxed text-[#1A1C1E]/70">
                  Projeto concebido e desenvolvido para a prática clínica em <strong>Atenção Primária à Saúde (APS)</strong> e <strong>Medicina de Família e Comunidade (MFC)</strong>, fundamentado nas melhores evidências científicas e diretrizes nacionais e internacionais.
                </p>
              </div>

              <div className="bg-[#1A1C1E]/5 border border-[#1A1C1E]/20 p-3.5 rounded-[4px] space-y-1 text-[#1A1C1E]">
                <div className="font-bold flex items-center gap-1.5 text-xs text-[#1A1C1E]">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Aviso de Responsabilidade Médica</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#1A1C1E]/70">
                  O Nexus Clínico é uma ferramenta determinística de apoio e suporte à decisão. Não substitui a avaliação presencial soberana nem a anamnese clínica individualizada.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DESENVOLVEDOR */}
          {activeTab === 'desenvolvedor' && (
            <div className="space-y-4 text-xs text-[#1A1C1E]/80">
              <div className="bg-white border border-[#1A1C1E]/15 p-5 rounded-[4px] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1A1C1E] text-white rounded-[4px] flex items-center justify-center text-xl font-bold font-serif shadow-xs">
                    AA
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#1A1C1E]">Dr. Adolfo Aranha</h3>
                  </div>
                </div>

                <div className="bg-[#F8F7F4] border border-[#1A1C1E]/15 p-3.5 rounded-[4px] text-xs font-medium text-[#1A1C1E] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#115E59] shrink-0" />
                  <span>Médico Residente de Medicina de Família e Comunidade (MFC) • APS</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTATO */}
          {activeTab === 'contato' && (
            <div className="space-y-4 text-xs text-[#1A1C1E]/80">
              <div className="bg-white border border-[#1A1C1E]/15 p-5 rounded-[4px] space-y-4">
                <div className="flex items-center gap-2 text-[#115E59] font-bold text-sm">
                  <Mail className="w-5 h-5 text-[#115E59]" />
                  <span>Canais de Comunicação & Colaboração</span>
                </div>

                <p className="leading-relaxed text-[#1A1C1E]/70">
                  Dúvidas, sugestões clínicas, parcerias acadêmicas ou interesse em integrar a ferramenta em novas redes de saúde:
                </p>

                <div className="bg-[#F8F7F4] border border-[#1A1C1E]/15 p-4 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#1A1C1E]/50 block">
                      E-mail Direto do Desenvolvedor
                    </span>
                    <span className="text-sm font-mono font-bold text-[#115E59]">
                      adolfodelfino@gmail.com
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-2 bg-white hover:bg-[#F8F7F4] text-[#1A1C1E] border border-[#1A1C1E]/20 rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar E-mail</span>
                        </>
                      )}
                    </button>

                    <a
                      href="mailto:adolfodelfino@gmail.com?subject=Contato%20Nexus%20Clinico"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#115E59] hover:bg-[#0d4a46] text-white rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Enviar E-mail</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVIDÊNCIAS & DIRETRIZES */}
          {activeTab === 'evidencias' && (
            <div className="space-y-4 text-xs text-[#1A1C1E]/80">
              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#1A1C1E]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar diretriz por título, fonte ou palavra-chave (ex: Hayasaka, Maudsley, PCDT, DSM)..."
                  className="w-full bg-[#F8F7F4] border border-[#1A1C1E]/20 rounded-[4px] pl-9 pr-3 py-2.5 text-xs text-[#1A1C1E] placeholder-[#1A1C1E]/40 focus:outline-none focus:ring-1 focus:ring-[#115E59]"
                />
              </div>

              {/* References List */}
              <div className="space-y-3">
                {filteredReferences.map((ref) => (
                  <div
                    key={ref.id}
                    className="bg-white border border-[#1A1C1E]/15 rounded-[4px] p-4 space-y-2 hover:border-[#1A1C1E]/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1A1C1E]/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#115E59] text-white px-2 py-0.5 rounded-[2px] text-[10px] font-bold">
                          {ref.topic}
                        </span>
                        <span className="font-mono text-[11px] text-[#1A1C1E]/60">
                          {ref.source} ({ref.year})
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1A1C1E]">{ref.title}</h4>

                    <p className="text-[#1A1C1E]/80 leading-relaxed text-[11px]">{ref.summary}</p>

                    {ref.keyPoints && ref.keyPoints.length > 0 && (
                      <div className="bg-[#F8F7F4] border border-[#1A1C1E]/10 p-2.5 rounded-[4px] space-y-1 text-[11px]">
                        <span className="font-bold text-[#115E59] block">Pontos-Chave:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[#1A1C1E]/80">
                          {ref.keyPoints.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                {filteredReferences.length === 0 && (
                  <div className="p-8 text-center bg-[#F8F7F4] border border-[#1A1C1E]/15 rounded-[4px] text-[#1A1C1E]/50">
                    Nenhuma diretriz encontrada para a pesquisa "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1A1C1E]/15 shrink-0 text-xs">
          {onOpenCodeExport ? (
            <button
              onClick={() => {
                onClose();
                onOpenCodeExport();
              }}
              className="px-3.5 py-2 bg-[#F8F7F4] hover:bg-white text-[#115E59] border border-[#1A1C1E]/20 rounded-[4px] font-mono text-[0.7rem] uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4 text-[#115E59]" />
              <span>Ver Códigos-Fonte do Sistema</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1A1C1E] hover:bg-[#115E59] text-white rounded-[4px] font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
