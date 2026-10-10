import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const app = express();
// Resolve server port: AI Studio Cloud Run uses port 8080 for nginx reverse proxy.
// The backend / Vite dev server must always bind to port 3000 to avoid EADDRINUSE on 8080.
function resolvePort(): number {
  const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.APP_PORT) {
    const parsed = parseInt(process.env.APP_PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.PORT && process.env.PORT !== "8080") {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 3000;
}
const PORT = resolvePort();

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

    // Privacy and Clinical Safety Shielding:
    // In this academic/validation phase, transmission of clinical patient notes to external AI services
    // is disabled. Furthermore, the Subjective field is strictly human-authored and cannot be generated or overwritten by AI.
    return res.json({
      subjective: subjectiveNotes || "Registro clínico exclusivo do médico assistente.",
      objective: objectiveData || "Dados objetivos estruturados.",
      assessment: "Avaliação longitudinal a cargo do médico assistente.",
      plan: "Plano terapêutico singular pactuado na APS.",
      warnings: [
        "Blindagem P0: Geração automática de Subjetivo desabilitada. O Subjetivo é estritamente de autoria médica.",
        "Envio de dados clínicos reais a serviços externos desabilitado nesta fase acadêmica."
      ],
      missingInformation: [],
      mock: true,
      promptVersion: "soap-shielded-v1"
    });
  } catch (err: any) {
    // Sanitized log: Never log req.body or clinical notes to server logs
    console.error("Erro interno no endpoint /api/ai/soap-draft");
    return res.status(500).json({
      error: "Serviço indisponível ou desabilitado para proteção de dados clínicos."
    });
  }
});

async function startServer() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === "production" && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nexus Mental APS] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[Nexus Mental APS] Falha fatal ao iniciar o servidor:", err);
});
