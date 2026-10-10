import { ScaleDefinition, ScaleResult } from '../types';

export interface ValidationItemResult {
  questionId: string;
  status: 'answered' | 'unanswered' | 'invalid';
  value?: number;
  reason?: string;
}

export interface ScaleValidationReport {
  scaleId: string;
  isComplete: boolean;
  totalRequired: number;
  answeredCount: number;
  unansweredCount: number;
  invalidCount: number;
  items: Record<string, ValidationItemResult>;
  individualAlerts: string[];
}

/**
 * Validates responses for any clinical scale:
 * - Checks that answers is an object and values are valid numbers.
 * - Distinguishes unanswered (missing/undefined/null), answered (valid option value), and invalid (NaN, non-number, out of bounds).
 * - Honors conditional screening rules (e.g., C-SSRS, PC-PTSD-5).
 * - Detects critical individual alerts (e.g. PHQ-9 item 9, EPDS item 10) even when incomplete.
 */
export function validateScaleAnswers(
  scale: ScaleDefinition,
  rawAnswers: Record<string, any> = {}
): ScaleValidationReport {
  const items: Record<string, ValidationItemResult> = {};
  const individualAlerts: string[] = [];
  let answeredCount = 0;
  let unansweredCount = 0;
  let invalidCount = 0;

  // Safe answers dictionary
  const answers = rawAnswers && typeof rawAnswers === 'object' ? rawAnswers : {};

  // Check questions
  for (const question of scale.questions) {
    const qId = question.id;
    const val = answers[qId];

    if (val === undefined || val === null || val === '') {
      items[qId] = { questionId: qId, status: 'unanswered', reason: 'Não respondido' };
      unansweredCount++;
      continue;
    }

    if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
      items[qId] = { questionId: qId, status: 'invalid', reason: 'Valor numérico inválido' };
      invalidCount++;
      continue;
    }

    // Verify option boundary
    const allowedValues = question.options.map((o) => o.value);
    if (!allowedValues.includes(val)) {
      items[qId] = {
        questionId: qId,
        status: 'invalid',
        value: val,
        reason: `Valor fora do intervalo permitido (${allowedValues.join(', ')})`,
      };
      invalidCount++;
      continue;
    }

    items[qId] = { questionId: qId, status: 'answered', value: val };
    answeredCount++;

    // Individual clinical alerts check (even if incomplete)
    // 1. PHQ-9 Item 9 (Ideation of death / self-harm)
    if (scale.id === 'phq-9' && qId === 'q9' && val > 0) {
      const optionLabel = question.options.find((o) => o.value === val)?.label || `${val} pts`;
      individualAlerts.push(
        `⚠️ ALERTA CLÍNICO INDIVIDUAL (PHQ-9 - Item 9): Resposta positiva ("${optionLabel}"). Exige avaliação clínica direta e presencial de ideação de morte/autolesão (investigar planos, meios, intencionalidade e fatores de proteção). Não classificar automaticamente como alto risco antes da avaliação médica presencial.`
      );
    }

    // 2. EPDS Item 10 (Self-harm thoughts in perinatal care)
    if (scale.id === 'epds' && qId === 'q10' && val > 0) {
      const optionLabel = question.options.find((o) => o.value === val)?.label || `${val} pts`;
      individualAlerts.push(
        `⚠️ ALERTA CLÍNICO INDIVIDUAL (EPDS - Item 10): Resposta afirmativa para pensamentos de autoagressão ("${optionLabel}"). Requer acolhimento imediato na unidade e avaliação clínica direta da puérpera/gestante e suporte familiar.`
      );
    }

    // 3. SRQ-20 Item 17 (Thoughts of ending one's life)
    if (scale.id === 'srq-20' && qId === 'q17' && val > 0) {
      individualAlerts.push(
        `⚠️ ALERTA CLÍNICO INDIVIDUAL (SRQ-20 - Item 17): Resposta positiva para ideação de acabar com a própria vida. Exige acolhimento prioritário e avaliação clínica direta de segurança.`
      );
    }
  }

  // Handle clinical conditional screening rules:
  // C-SSRS: Screening questions are q1 & q2.
  // If q1=0 and q2=0, questions q3, q4, q5 are naturally 0 (skip logic in Columbia Protocol),
  // but q6 (suicidal behavior) is mandatory!
  if (scale.id === 'cssrs') {
    const q1 = answers['q1'];
    const q2 = answers['q2'];
    const q6 = answers['q6'];

    const q1Valid = q1 !== undefined && typeof q1 === 'number' && [0, 1].includes(q1);
    const q2Valid = q2 !== undefined && typeof q2 === 'number' && [0, 1].includes(q2);
    const q6Valid = q6 !== undefined && typeof q6 === 'number' && [0, 1].includes(q6);

    if (q1Valid && q2Valid && q1 === 0 && q2 === 0) {
      // Questions 3, 4, 5 are conditionally not applicable (treated as 0)
      ['q3', 'q4', 'q5'].forEach((id) => {
        if (!items[id] || items[id].status === 'unanswered') {
          items[id] = { questionId: id, status: 'answered', value: 0 };
        }
      });
      // Recount
      answeredCount = Object.values(items).filter((it) => it.status === 'answered').length;
      unansweredCount = Object.values(items).filter((it) => it.status === 'unanswered').length;
      invalidCount = Object.values(items).filter((it) => it.status === 'invalid').length;
    }
  }

  const totalRequired = scale.questions.length;
  const isComplete = unansweredCount === 0 && invalidCount === 0;

  return {
    scaleId: scale.id,
    isComplete,
    totalRequired,
    answeredCount,
    unansweredCount,
    invalidCount,
    items,
    individualAlerts,
  };
}

/**
 * Creates a standardized safe ScaleResult when an instrument is incomplete or has invalid answers.
 * It prevents premature diagnostic classification or false-negative scoring.
 */
export function createIncompleteScaleResult(
  scale: ScaleDefinition,
  validation: ScaleValidationReport
): ScaleResult {
  const { answeredCount, totalRequired, individualAlerts } = validation;

  const answersArray = scale.questions.map((q) => {
    const it = validation.items[q.id];
    return it && it.status === 'answered' ? (it.value ?? 0) : 0;
  });

  const partialScore = answersArray.reduce((acc, v) => acc + (Number.isFinite(v) ? v : 0), 0);

  const recommendations: string[] = [];

  if (individualAlerts.length > 0) {
    recommendations.push(...individualAlerts);
  }

  recommendations.push(
    `Preenchimento incompleto (${answeredCount} de ${totalRequired} questões respondidas). Conclua todas as questões obrigatórias para gerar a pontuação total e classificação clínica.`
  );

  const soapText = `${scale.acronym}: Preenchimento Incompleto (${answeredCount}/${totalRequired} respondidas, soma parcial: ${partialScore} pts) — Classificação clínica e escore total retidos por segurança.${
    individualAlerts.length > 0 ? `\n• ${individualAlerts.join('\n• ')}` : ''
  }`;

  return {
    scaleId: scale.id,
    scaleTitle: scale.title,
    totalScore: partialScore,
    maxScore: scale.questions.reduce((acc, q) => {
      const maxOpt = Math.max(...q.options.map((o) => o.value));
      return acc + (Number.isFinite(maxOpt) ? maxOpt : 0);
    }, 0),
    classification: 'Preenchimento Incompleto',
    severityLevel: 'low',
    interpretation: `Instrumento incompleto (${answeredCount} de ${totalRequired} questões respondidas, soma parcial: ${partialScore} pts). Não é seguro emitir classificação diagnóstica ou estratificação de gravidade com dados parciais.`,
    recommendations,
    soapText,
    answersArray,
    isComplete: false,
    completionStatus: 'incomplete',
    answeredCount,
    totalRequired,
    individualAlerts,
    hasCriticalAlert: individualAlerts.length > 0,
  };
}
