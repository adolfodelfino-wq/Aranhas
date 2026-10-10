export type ScaleMetricDirection = 'lower_is_better' | 'higher_is_better';

export interface ScoreComparisonInput {
  scaleId: string;
  baselineScore: number;
  currentScore: number;
  baselineDate?: string;
  currentDate?: string;
}

export interface ScoreComparisonResult {
  baselineScore: number;
  currentScore: number;
  absoluteDifference: number; // current - baseline
  relativeVariationPercent: number | null; // null when baseline is 0
  scoreDirection: 'increase' | 'decrease' | 'unchanged';
  scoreDirectionText: string;
  clinicalMeaning: 'favorable' | 'unfavorable' | 'stable';
  clinicalMeaningText: string;
  relativeVariationText: string;
  formattedSummary: string;
}

/**
 * Determines whether a scale improves with lower or higher scores.
 */
export function getScaleMetricDirection(scaleId: string): ScaleMetricDirection {
  const higherIsBetterScales = ['meem', 'who-5', 'eurohis-qol', 'whoqol-srpb'];
  return higherIsBetterScales.includes(scaleId.toLowerCase()) ? 'higher_is_better' : 'lower_is_better';
}

/**
 * Calculates longitudinal variation according to strict clinical rules:
 * - 10 to 15: diff +5, relative +50%, score increase
 * - 10 to 5: diff -5, relative -50%, score decrease
 * - 10 to 10: diff 0, relative 0%, unchanged
 * - 0 to 5: diff +5, relative non-calculable (never divide by fictive 1!), score increase
 *
 * Does not assume clinical improvement purely from mathematical signs:
 * Lower is better for symptom scales (PHQ-9, GAD-7, etc.);
 * Higher is better for cognitive/QoL scales (MEEM, EUROHIS-QOL, etc.).
 */
export function calculateScoreVariation(input: ScoreComparisonInput): ScoreComparisonResult {
  const { scaleId, baselineScore, currentScore, baselineDate, currentDate } = input;
  const directionType = getScaleMetricDirection(scaleId);

  const absoluteDifference = currentScore - baselineScore;

  let relativeVariationPercent: number | null = null;
  let relativeVariationText = '';

  if (baselineScore === 0) {
    if (currentScore === 0) {
      relativeVariationPercent = 0;
      relativeVariationText = '0%';
    } else {
      // 0 to X: non-calculable relative percentage because baseline is zero.
      // Must NEVER divide by fictitious 1.
      relativeVariationPercent = null;
      relativeVariationText = 'Não calculável (linha de base zero)';
    }
  } else {
    const rawRel = ((currentScore - baselineScore) / Math.abs(baselineScore)) * 100;
    // Round to 1 decimal place or integer
    const rounded = Math.round(rawRel * 10) / 10;
    relativeVariationPercent = rounded;
    relativeVariationText = `${rounded > 0 ? `+${rounded}` : rounded}%`;
  }

  // Direction of score
  let scoreDirection: 'increase' | 'decrease' | 'unchanged' = 'unchanged';
  let scoreDirectionText = 'Estabilidade na pontuação';
  if (absoluteDifference > 0) {
    scoreDirection = 'increase';
    scoreDirectionText = `Aumento de pontuação (+${absoluteDifference} pts)`;
  } else if (absoluteDifference < 0) {
    scoreDirection = 'decrease';
    scoreDirectionText = `Redução de pontuação (${absoluteDifference} pts)`;
  }

  // Clinical interpretation depends on scale metric direction
  let clinicalMeaning: 'favorable' | 'unfavorable' | 'stable' = 'stable';
  let clinicalMeaningText = 'Estabilidade clínica';

  if (directionType === 'lower_is_better') {
    // Symptom scales: lower is favorable
    if (absoluteDifference < 0) {
      clinicalMeaning = 'favorable';
      clinicalMeaningText = `Evolução favorável (Atenuação/redução de sintomas em ${Math.abs(absoluteDifference)} pts)`;
    } else if (absoluteDifference > 0) {
      clinicalMeaning = 'unfavorable';
      clinicalMeaningText = `Evolução desfavorável (Exacerbação/aumento de sintomas em +${absoluteDifference} pts)`;
    } else {
      clinicalMeaning = 'stable';
      clinicalMeaningText = 'Estabilidade do quadro sintomático';
    }
  } else {
    // Functional / QoL / Cognitive scales: higher is favorable
    if (absoluteDifference > 0) {
      clinicalMeaning = 'favorable';
      clinicalMeaningText = `Evolução favorável (Ganho/melhora funcional ou cognitiva de +${absoluteDifference} pts)`;
    } else if (absoluteDifference < 0) {
      clinicalMeaning = 'unfavorable';
      clinicalMeaningText = `Evolução desfavorável (Declínio funcional ou cognitivo de ${absoluteDifference} pts)`;
    } else {
      clinicalMeaning = 'stable';
      clinicalMeaningText = 'Estabilidade funcional/cognitiva';
    }
  }

  const baselineStr = baselineDate ? ` (${baselineDate})` : '';
  const currentStr = currentDate ? ` (${currentDate})` : '';
  const formattedSummary = `• Linha de Base: ${baselineScore} pts${baselineStr} ➔ Avaliação Atual: ${currentScore} pts${currentStr}
• Diferença Absoluta: ${absoluteDifference > 0 ? `+${absoluteDifference}` : absoluteDifference} pts
• Variação Relativa: ${relativeVariationText}
• Direção da Pontuação: ${scoreDirectionText}
• Interpretação Clínica: ${clinicalMeaningText}`;

  return {
    baselineScore,
    currentScore,
    absoluteDifference,
    relativeVariationPercent,
    scoreDirection,
    scoreDirectionText,
    clinicalMeaning,
    clinicalMeaningText,
    relativeVariationText,
    formattedSummary,
  };
}

/**
 * Parses Brazilian date string (DD/MM/YYYY or DD/MM/YYYY HH:mm) into a sortable epoch timestamp.
 */
export function parseDateToEpoch(dateStr?: string, fallbackIndex = 0): number {
  if (!dateStr) return fallbackIndex;
  // Handle DD/MM/YYYY HH:mm:ss or DD/MM/YYYY
  const parts = dateStr.trim().split(' ');
  const datePart = parts[0] || '';
  const timePart = parts[1] || '00:00:00';

  const dParts = datePart.split('/');
  if (dParts.length === 3) {
    const day = parseInt(dParts[0], 10);
    const month = parseInt(dParts[1], 10) - 1;
    const year = parseInt(dParts[2], 10);

    const tParts = timePart.split(':');
    const hours = parseInt(tParts[0] || '0', 10);
    const minutes = parseInt(tParts[1] || '0', 10);
    const seconds = parseInt(tParts[2] || '0', 10);

    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!Number.isNaN(d.getTime())) {
      return d.getTime();
    }
  }

  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? fallbackIndex : parsed;
}

/**
 * Sorts longitudinal clinical records chronologically by date and time,
 * preserving distinct assessments performed on the same calendar day.
 */
export function sortLongitudinalRecords<T extends { date?: string; consultationNumber?: number }>(
  records: T[]
): T[] {
  return [...records].sort((a, b) => {
    const epochA = parseDateToEpoch(a.date, a.consultationNumber || 0);
    const epochB = parseDateToEpoch(b.date, b.consultationNumber || 0);

    if (epochA !== epochB) {
      return epochA - epochB;
    }
    // Same day and time: fallback to consultationNumber
    return (a.consultationNumber || 0) - (b.consultationNumber || 0);
  });
}
