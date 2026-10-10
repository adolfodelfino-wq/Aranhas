import React, { useState } from 'react';
import { ALL_SCALES } from '../data/scalesData';
import { ScaleResult } from '../types';
import {
  Send,
  Copy,
  Check,
  X,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Sparkles,
  User,
  Phone,
  Globe,
  Download,
  ClipboardCheck,
} from 'lucide-react';

interface WhatsappShareModalProps {
  patientName: string;
  onClose: () => void;
  onOpenPatientSelfFill: (scaleId: string) => void;
  onSaveScaleResult?: (result: ScaleResult) => void;
}

export const WhatsappShareModal: React.FC<WhatsappShareModalProps> = ({
  patientName,
  onClose,
  onOpenPatientSelfFill,
  onSaveScaleResult,
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'import'>('send');
  const [selectedScaleId, setSelectedScaleId] = useState<string>('phq-9');
  const [phone, setPhone] = useState<string>('');
  const [customName, setCustomName] = useState<string>(patientName || '');
  const [copied, setCopied] = useState<boolean>(false);
  const [customDomain, setCustomDomain] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_custom_domain');
      if (saved && saved.trim()) return saved;
      
      const origin = window.location.origin;
      if (origin.includes('ais-dev-')) {
        return origin.replace('ais-dev-', 'ais-pre-');
      }
      return origin;
    }
    return '';
  });

  // Import State
  const [importText, setImportText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const [scriptPreset, setScriptPreset] = useState<'pre_consultation' | 'treatment_monitoring' | 'direct'>('pre_consultation');
  const [showMedicalTips, setShowMedicalTips] = useState<boolean>(true);

  const scale = ALL_SCALES.find((s) => s.id === selectedScaleId) || ALL_SCALES[0];

  // Base URL of current app or configured domain
  const getBaseUrl = () => {
    let domain = customDomain.trim();
    if (!domain) {
      return typeof window !== 'undefined' ? window.location.origin : '';
    }
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `https://${domain}`;
    }
    return domain.replace(/\/$/, '');
  };

  const currentAppUrl = getBaseUrl();
  // Privacy shielding: Never put patient name, CPF, CNS or clinical responses in URL
  const patientFillUrl = `${currentAppUrl}?mode=patient&scale=${selectedScaleId}`;

  // Formatted Message Presets for WhatsApp
  const getMessageText = () => {
    const nameStr = customName || 'paciente';
    if (scriptPreset === 'pre_consultation') {
      return `Olá, ${nameStr}! Tudo bem com você? 😊

Espero que esteja tendo uma semana tranquila. Para cuidarmos ainda melhor da sua saúde e prepararmos a nossa próxima consulta com todo carinho no *Nexus Clínico*, gostaria que você respondesse a este rápido questionário de bem-estar (${scale.acronym} - ${scale.title}):

🔗 *Acessar Questionário:*
${patientFillUrl}

Leva menos de 2 minutos! Não é um teste rígido, é apenas um termômetro para entendermos como esteve seu sono, disposição e humor nestas últimas duas semanas. 

Se preferir, também pode me responder por aqui enviando a pontuação de cada pergunta (Ex: 2, 2, 1, 0...). Estou aqui para o que precisar. Um abraço afetuoso!`;
    } else if (scriptPreset === 'treatment_monitoring') {
      return `Olá, ${nameStr}! Como você tem passado? 💛

Como combinamos em nosso último atendimento, estou enviando este breve acompanhamento da sua saúde e do seu tratamento (${scale.acronym} - ${scale.title}):

🔗 *Acessar Questionário:*
${patientFillUrl}

Ele nos ajuda a acompanhar de perto a sua evolução, entendendo como você tem se sentido e se precisamos fazer qualquer ajuste para garantir seu conforto e bem-estar.

Pode responder no link acima ou me mandar a pontuação de cada pergunta por aqui. Qualquer dúvida ou necessidade, conte sempre comigo!`;
    } else {
      return `Olá, ${nameStr}! Passando para saber como você está e te deixar um abraço! 🌸

Quando tiver um minutinho tranquilo no seu dia, por favor preencha este rápido questionário para acompanharmos seu bem-estar (${scale.acronym} - ${scale.title}):

🔗 *Acessar Questionário:*
${patientFillUrl}

Se for mais prático para você, pode me enviar só os números de cada resposta por aqui mesmo no WhatsApp (Ex: 2, 2, 1, 0...). 

Cuidar de você é a nossa prioridade. Tenha um excelente dia!`;
    }
  };

  const messageText = getMessageText();

  const cleanPhone = phone.replace(/\D/g, '');
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Import WhatsApp Response Parser
  const handleParseAndImport = () => {
    setImportError(null);
    if (!importText.trim()) {
      setImportError('Por favor, cole a mensagem ou os números enviados pelo paciente.');
      return;
    }

    const extractedNumbers = importText.match(/\d+/g)?.map(Number) || [];

    if (extractedNumbers.length === 0) {
      setImportError('Nenhum número válido identificado. Exemplo aceito: "2, 2, 2, 2, 1, 1, 1, 0, 0"');
      return;
    }

    const answers: Record<string, number> = {};
    scale.questions.forEach((q, idx) => {
      answers[q.id] = extractedNumbers[idx] !== undefined ? Math.min(3, Math.max(0, extractedNumbers[idx])) : 0;
    });

    const computed = scale.calculateResult(answers);

    const answersSummary = scale.questions.map((q) => {
      const val = answers[q.id];
      const matchedOpt = q.options.find((o) => o.value === val);
      return {
        questionText: q.text,
        answerLabel: matchedOpt ? matchedOpt.label : 'Pontuação ' + val,
        value: val,
      };
    });

    const answersArray = scale.questions.map((q) => answers[q.id]);

    const fullResult: ScaleResult = {
      ...computed,
      scaleId: scale.id,
      scaleTitle: scale.title,
      date: new Date().toLocaleDateString('pt-BR'),
      answersSummary,
      answersArray,
      soapText: computed.soapText || `${scale.acronym}: ${computed.totalScore}/${computed.maxScore} pts (${computed.classification}) | Itens: [${answersArray.join(', ')}]`,
    };

    if (onSaveScaleResult) {
      onSaveScaleResult(fullResult);
    }

    setImportSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto font-sans">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-lg text-white shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>WhatsApp - Integração & Autoaplicação</span>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-mono px-2 py-0.5 rounded border border-teal-200">
                  Opções A & B
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Envie o link para o paciente responder ou importe a resposta recebida no seu WhatsApp.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('send')}
            className={`pb-2.5 px-3 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'send'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>1. Enviar Link</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'import'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. Importar Resposta</span>
          </button>
        </div>

        {/* Content Body */}
        {activeTab === 'send' ? (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Patient Details & Scale Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Nome:</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Maria da Silva"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>WhatsApp:</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="51999998888"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-medium"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[11px] uppercase font-bold text-slate-700 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-teal-600" />
                    <span>Link Base:</span>
                  </label>
                  {typeof window !== 'undefined' && customDomain !== window.location.origin && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDomain(window.location.origin);
                        localStorage.removeItem('nexus_custom_domain');
                      }}
                      className="font-mono text-[10px] text-teal-700 hover:underline"
                    >
                      Padrão
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('nexus_custom_domain', e.target.value);
                    }
                  }}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Select Scale */}
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase font-bold text-slate-700 block">
                Selecione a Escala a ser Enviada:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_SCALES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScaleId(s.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedScaleId === s.id
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-xs font-mono">{s.acronym}</span>
                    <span className="text-[10px] text-slate-500 truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Presets Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="font-mono text-[11px] uppercase font-bold text-slate-700 flex items-center justify-between">
                <span>Tom da Mensagem / Abordagem:</span>
                <span className="text-[10px] text-teal-700 font-normal">Acolhimento APS</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setScriptPreset('pre_consultation')}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                    scriptPreset === 'pre_consultation'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-[11px]">1. Pré-Consulta</span>
                  <span className="text-[10px] opacity-80 block mt-0.5">Preparatório & Empático</span>
                </button>

                <button
                  onClick={() => setScriptPreset('treatment_monitoring')}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                    scriptPreset === 'treatment_monitoring'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-[11px]">2. Cuidado & Evolução</span>
                  <span className="text-[10px] opacity-80 block mt-0.5">Acompanhamento</span>
                </button>

                <button
                  onClick={() => setScriptPreset('direct')}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                    scriptPreset === 'direct'
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span className="block font-bold text-[11px]">3. Lembrete Afetuoso</span>
                  <span className="text-[10px] opacity-80 block mt-0.5">Mensagem Curta</span>
                </button>
              </div>
            </div>

            {/* Message Preview Box */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span className="font-mono uppercase tracking-wider text-[11px]">Pré-visualização da Mensagem:</span>
                <button
                  onClick={handleCopy}
                  className="text-teal-700 hover:text-slate-900 flex items-center gap-1 font-mono font-bold text-xs cursor-pointer uppercase tracking-wider"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-teal-600" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg text-slate-800 text-xs leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                {messageText}
              </div>
            </div>

            {/* Doctor Audio Script & Clinical Explanation Tip Box */}
            <div className="bg-teal-50/50 border border-teal-200 p-3.5 rounded-lg space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between font-bold text-teal-800">
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Roteiro de Fala / Áudio para o Paciente:</span>
                </span>
                <button
                  onClick={() => setShowMedicalTips(!showMedicalTips)}
                  className="font-mono text-[10px] text-teal-700 hover:underline cursor-pointer uppercase"
                >
                  {showMedicalTips ? 'Ocultar' : 'Exibir'}
                </button>
              </div>

              {showMedicalTips && (
                <div className="space-y-2 pt-1 border-t border-teal-200 text-slate-700">
                  <p className="italic bg-white p-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed">
                    🗣️ <strong className="text-teal-800 font-semibold">Exemplo de áudio:</strong> "Oi, {customName || 'Maria'}, tudo bem? Estou te mandando o link de um questionário super rápido. Não é uma prova ou teste rígido, é apenas um termômetro de bem-estar para entender como esteve seu sono, energia e humor nas últimas duas semanas. Responda com tranquilidade. Qualquer dúvida estou por aqui!"
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-slate-100">
              <button
                onClick={() => {
                  onClose();
                  onOpenPatientSelfFill(selectedScaleId);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Smartphone className="w-4 h-4 text-teal-600" />
                <span>Simular Tela do Paciente</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Abrir no WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        ) : (
          /* Import Tab */
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase font-bold text-slate-700 block">
                1. Selecione a Escala Respondida:
              </label>
              <select
                value={selectedScaleId}
                onChange={(e) => setSelectedScaleId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              >
                {ALL_SCALES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.acronym} - {s.title} ({s.questions.length} itens)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] uppercase font-bold text-slate-700 block">
                2. Cole a Resposta Enviada pelo Paciente:
              </label>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={4}
                placeholder="Exemplo 1: 2, 2, 2, 2, 1, 1, 1, 0, 0&#10;Exemplo 2: PHQ-9 respostas: [2, 2, 2, 2, 1, 1, 1, 0, 0]&#10;Exemplo 3: Cole todo o texto enviado pelo paciente"
                className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            {importError && (
              <p className="text-amber-900 font-semibold text-xs bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                ⚠️ {importError}
              </p>
            )}

            {importSuccess && (
              <p className="text-emerald-900 font-bold text-xs bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-700" />
                <span>Sucesso! Escala importada e adicionada ao prontuário de {customName}.</span>
              </p>
            )}

            <div className="pt-3 flex justify-end border-t border-slate-100">
              <button
                onClick={handleParseAndImport}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-mono font-bold uppercase tracking-wider rounded-lg text-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Importar para o Prontuário</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
