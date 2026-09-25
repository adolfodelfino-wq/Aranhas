import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const app = express();
const PORT = 3000;

app.use(express.json());

// Check environment settings
const enableAiEnv = process.env.ENABLE_AI === "true";
const hasApiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
const aiMode = hasApiKey && enableAiEnv ? "live" : "mock";

// Zod Schema for SOAP draft
const SoapDraftSchema = z.object({
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.string(),
  warnings: z.array(z.string()),
  missingInformation: z.array(z.string()),
  mock: z.boolean(),
  promptVersion: z.string()
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Nexus Mental APS",
    aiEnabled: enableAiEnv && hasApiKey,
    aiMode: aiMode,
    timestamp: new Date().toISOString()
  });
});

// Reject GET on SOAP draft
app.get("/api/ai/soap-draft", (req, res) => {
  res.status(405).json({ error: "Method Not Allowed. Use POST." });
});

// POST endpoint for SOAP draft generation
app.post("/api/ai/soap-draft", async (req, res) => {
  try {
    const { subjectiveNotes, objectiveData, clinicalContext } = req.body || {};

    // If AI mode is mock or API key is not present/enabled, return a deterministic structured mock
    if (aiMode === "mock") {
      const mockDraft = {
        subjective: subjectiveNotes || "Paciente em acompanhamento na APS por quadro de queixas ansiosas e desânimo. Relata dificuldades no sono e impacto parcial na rotina de trabalho.",
        objective: objectiveData || "Exame Físico/EEM: Aparenta bom estado geral, orientado, afeto modulado. Escalas aplicadas: PHQ-9 e GAD-7 registradas em prontuário.",
        assessment: "1. Transtorno do humor/ansiedade a esclarecer em acompanhamento longitudinal na APS.\n2. Ausência de sinais de alarme ou ideação suicida atual no momento.",
        plan: "1. Pactuada higiene do sono e técnicas de desaceleração ansiogênica.\n2. Entregue material educativo de Educação em Saúde para manejo de ansiedade.\n3. Reavaliação clínica em 15-30 dias ou antes em caso de piora dos sintomas.",
        warnings: [
          "Rascunho gerado em modo demonstrativo/mock. Exige revisão e validação pelo médico residente/preceptor.",
          "Não foram identificados sinais de ideação suicida explícita na entrada."
        ],
        missingInformation: [
          "Histórico familiar de transtornos do humor não detalhado.",
          "Verificar exames laboratoriais recentes (função tireoidiana, B12, hemograma) para descartar causas orgânicas."
        ],
        mock: true,
        promptVersion: "soap-draft-v1"
      };

      const validated = SoapDraftSchema.parse(mockDraft);
      return res.json(validated);
    }

    // Live AI mode using server-side Gemini 3.6 Flash
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const systemPrompt = `Você é um assistente especializado em Medicina de Família e Comunidade (MFC) e Saúde Mental na Atenção Primária à Saúde (APS) no Brasil (padrão GHC/SUS).
Sua tarefa é organizar as notas brutas fornecidas no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano).

DIRETRIZES RÍGIDAS DE SEGURANÇA E QUALIDADE CLÍNICA (promptVersion: soap-draft-v1):
1. PROIBIDO inventar fatos ou exames que não constem na entrada.
2. PROIBIDO automatizar diagnóstico definitivo. Formule a Avaliação como hipótese ou síndrome sob acompanhamento longitudinal na APS.
3. Se houver lacunas clínicas importantes (ex: ideação suicida não pesquisada, hipotireoidismo não descartado), OBRIGATÓRIO listar em missingInformation.
4. Respeite o tom natural e humanizado do registro médico em APS (evite formatações robóticas como "Resultado:", "Classificação:").
5. O Plano deve conter apenas condutas pactuadas e seguimento realista da APS.`;

    const userPrompt = `Anotações fornecidas:
- Subjetivo bruto: ${subjectiveNotes || "Não informado"}
- Dados objetivos / escalas / EEM: ${objectiveData || "Não informado"}
- Contexto adicional: ${clinicalContext || "Consulta de rotina em APS"}

Por favor, gere uma resposta estritamente no seguinte formato JSON:
{
  "subjective": "texto do S",
  "objective": "texto do O",
  "assessment": "texto do A",
  "plan": "texto do P",
  "warnings": ["alerta 1", "alerta 2"],
  "missingInformation": ["lacuna 1", "lacuna 2"],
  "mock": false,
  "promptVersion": "soap-draft-v1"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    const validated = SoapDraftSchema.parse({
      ...parsed,
      mock: false,
      promptVersion: "soap-draft-v1"
    });

    return res.json(validated);
  } catch (err: any) {
    console.error("Erro no SOAP draft:", err);
    // Fallback safe mock response in case of error
    return res.json({
      subjective: req.body?.subjectiveNotes || "Queixa registrada em atendimento na APS.",
      objective: req.body?.objectiveData || "Exame físico e EEM dentro dos parâmetros habituais.",
      assessment: "Quadro mental em avaliação longitudinal na APS.",
      plan: "Acompanhamento pactuado com retorno agendado.",
      warnings: ["Falha ao contatar serviço de IA. Retornado rascunho de segurança."],
      missingInformation: ["Validação clínica obrigatória."],
      mock: true,
      promptVersion: "soap-draft-v1"
    });
  }
});

async function startServer() {
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
    console.log(`[Nexus Mental APS] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Nexus Mental APS] Falha fatal ao iniciar o servidor:", err);
});
