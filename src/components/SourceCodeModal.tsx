import React, { useState } from 'react';
import { Code, Copy, Check, X, Download, FileCode, Layers } from 'lucide-react';

interface SourceCodeModalProps {
  onClose: () => void;
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({ onClose }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    'backend' | 'engine' | 'types' | 'components' | 'data'
  >('engine');

  const handleCopy = (fileName: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Sample representations / core source contents for quick AI context sharing
  const filesMap = {
    backend: [
      {
        name: 'server.ts (Express Backend & Vite Proxy)',
        path: 'server.ts',
        description: 'Servidor Express em TypeScript com suporte ao Gemini API server-side e proxy do Vite.',
        code: `import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Rota de IA para Minuta do SOAP via Gemini API (Server-side seguro)
  app.post("/api/generate-soap-draft", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor." });
      }

      const { subjective, objective, eemText, scalesSummary } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = \`Você é um médico especialista em Medicina de Família e Comunidade (MFC).
Sintetize os achados abaixo em uma minuta de registro clínico SOAP e plano de cuidados para APS.
- Subjetivo: \${subjective || 'Não informado'}
- Objetivo: \${objective || 'Não informado'}
- EEM: \${eemText || 'Não informado'}
- Escalas: \${scalesSummary || 'Não informado'}\`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ draft: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Erro ao processar minuta com IA" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Servidor Nexus Clínico ativo na porta \${PORT}\`);
  });
}

startServer();`,
      },
    ],
    engine: [
      {
        name: 'healthEducationEngine.ts (Motor de Educação em Saúde Contextual)',
        path: 'src/utils/healthEducationEngine.ts',
        description: 'Motor determinístico que cruza resultados de escalas e EEM com regras clínicas para APS.',
        code: `import { ScaleResult, EemState, EducationSuggestion } from '../types';

export interface EducationEngineResult {
  suggestions: EducationSuggestion[];
  hasHighRiskWarning: boolean;
  warningMessage?: string;
}

export function runHealthEducationEngine(
  scaleResults: Record<string, ScaleResult>,
  eemState: EemState
): EducationEngineResult {
  const suggestions: EducationSuggestion[] = [];
  let hasHighRiskWarning = false;
  let warningMessage: string | undefined;

  // Lógica determinística e segura
  // ...
  return { suggestions, hasHighRiskWarning, warningMessage };
}`,
      },
      {
        name: 'antidepressantSwitching.ts (Calculadora Farmacológica de Troca)',
        path: 'src/utils/antidepressantSwitching.ts',
        description: 'Mapeamento de doses equivalentes (Hayasaka 2015 / Maudsley) e gerador de cronograma semanal.',
        code: `// Mapeamento farmacológico completo de 15 antidepressivos para APS
export function calculateAntidepressantTransition(
  sourceDrugId: string,
  sourceDoseMg: number,
  targetDrugId: string
): AntidepressantSwitchPlan {
  // Cálculo de equivalência e regras de transição segura
  // ...
}`,
      },
    ],
    types: [
      {
        name: 'types.ts (Interfaces TypeScript)',
        path: 'src/types.ts',
        description: 'Definições centrais de tipos de escalas, EEM, SOAP, paciente e sessões clínicas.',
        code: `export type NavView = 'dashboard' | 'scales' | 'eem' | 'soap' | 'calculators' | 'education';

export interface PatientSession {
  name: string;
  age: number;
  prontuario: string;
  date: string;
}

export interface ScaleResult {
  scaleId: string;
  score: number;
  severity: string;
  category: string;
  date: string;
}

export interface EemState {
  aparencia: string[];
  consciencia: string;
  atencao: string;
  orientacao: string;
  memoria: string;
  pensamentoCurso: string;
  pensamentoForma: string;
  pensamentoConteudo: string[];
  humorAfeto: string[];
  sensopercepcao: string[];
  juizoCritica: string;
  psicomotricidade: string;
  linguagem: string[];
  insights: string;
  observacoesLivres: string;
}

export interface SoapRecord {
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
}`,
      },
    ],
    components: [
      {
        name: 'ScalesView.tsx & EemView.tsx',
        path: 'src/components/ScalesView.tsx',
        description: 'Componentes reativos para aplicação rápida de questionários estruturados e exame mental.',
        code: `// Componente modular com renderização instantânea, pontuação em tempo real e integração ao SOAP.`,
      },
    ],
    data: [
      {
        name: 'scalesData.ts (Banco de 11 Escalas Validadas)',
        path: 'src/data/scalesData.ts',
        description: 'PHQ-9, GAD-7, AUDIT, CAGE, ASSIST, ASRS-18, PCL-5, MDQ, ISI, SRQ-20 e CSSRS.',
        code: `// Definições completas de perguntas, pontuações, categorias de gravidade e pontos de corte clínicos.`,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white border-[1.5px] border-[#1A1C1E] text-[#1A1C1E] rounded-[4px] p-6 w-full max-w-4xl shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1A1C1E]/15 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#115E59]/10 p-2.5 rounded-[4px] text-[#115E59] border border-[#115E59]/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-[#1A1C1E] text-xl sm:text-2xl">
                Códigos-Fonte e Arquitetura do App
              </h2>
              <p className="font-sans text-xs text-[#1A1C1E]/60">
                Copie trechos arquiteturais e módulos TypeScript para análise ou expansão com IAs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F8F7F4] rounded-[4px] text-[#1A1C1E]/60 hover:text-[#1A1C1E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 border-b border-[#1A1C1E]/15 pb-3 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('engine')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'engine'
                ? 'bg-[#1A1C1E] text-white shadow-xs'
                : 'bg-[#F8F7F4] hover:bg-[#1A1C1E]/10 text-[#1A1C1E]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Motores Clínicos</span>
          </button>

          <button
            onClick={() => setSelectedCategory('backend')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'backend'
                ? 'bg-[#1A1C1E] text-white shadow-xs'
                : 'bg-[#F8F7F4] hover:bg-[#1A1C1E]/10 text-[#1A1C1E]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Backend Server</span>
          </button>

          <button
            onClick={() => setSelectedCategory('types')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'types'
                ? 'bg-[#1A1C1E] text-white shadow-xs'
                : 'bg-[#F8F7F4] hover:bg-[#1A1C1E]/10 text-[#1A1C1E]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Types & Interfaces</span>
          </button>

          <button
            onClick={() => setSelectedCategory('components')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'components'
                ? 'bg-[#1A1C1E] text-white shadow-xs'
                : 'bg-[#F8F7F4] hover:bg-[#1A1C1E]/10 text-[#1A1C1E]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Componentes UI</span>
          </button>

          <button
            onClick={() => setSelectedCategory('data')}
            className={`px-3.5 py-2 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'data'
                ? 'bg-[#1A1C1E] text-white shadow-xs'
                : 'bg-[#F8F7F4] hover:bg-[#1A1C1E]/10 text-[#1A1C1E]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Escalas & Dados</span>
          </button>
        </div>

        {/* Code Files List */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1 font-sans">
          {filesMap[selectedCategory].map((file, idx) => (
            <div
              key={idx}
              className="bg-[#F8F7F4] border border-[#1A1C1E]/15 rounded-[4px] p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#1A1C1E]/10 pb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-[#1A1C1E] text-base">{file.name}</h3>
                  <p className="font-sans text-xs text-[#1A1C1E]/70">{file.description}</p>
                </div>

                <button
                  onClick={() => handleCopy(file.name, file.code)}
                  className="px-3.5 py-2 bg-white hover:bg-[#F8F7F4] text-[#115E59] border border-[#115E59]/30 rounded-[4px] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  {copiedFile === file.name ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#115E59]" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-white border border-[#1A1C1E]/15 p-4 rounded-[4px] text-[#1A1C1E] text-xs font-mono overflow-x-auto max-h-60 leading-relaxed shadow-2xs">
                <code>{file.code}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[#1A1C1E]/15 shrink-0 text-xs font-sans text-[#1A1C1E]/70">
          <span>Pronto para colar em qualquer modelo de linguagem.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1A1C1E] hover:bg-[#115E59] text-white rounded-[4px] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
