import { describe, it, expect } from 'vitest';
import {
  calculateScoreVariation,
  sortLongitudinalRecords,
  getScaleMetricDirection,
} from '../utils/longitudinalAnalysis';

describe('P0-04: Longitudinal Evolution & Variation Semantics', () => {
  it('Mandatory Case 1: 10 to 15 produces diff +5, relative +50%, and score increase', () => {
    const variation = calculateScoreVariation({
      scaleId: 'phq-9',
      baselineScore: 10,
      currentScore: 15,
    });

    expect(variation.absoluteDifference).toBe(5);
    expect(variation.relativeVariationPercent).toBe(50);
    expect(variation.relativeVariationText).toBe('+50%');
    expect(variation.scoreDirection).toBe('increase');
    expect(variation.scoreDirectionText).toContain('Aumento de pontuação (+5 pts)');
    // In PHQ-9 (symptom scale), increase is unfavorable
    expect(variation.clinicalMeaning).toBe('unfavorable');
    expect(variation.clinicalMeaningText).toContain('Exacerbação/aumento de sintomas');
  });

  it('Mandatory Case 2: 10 to 5 produces diff -5, relative -50%, and score decrease', () => {
    const variation = calculateScoreVariation({
      scaleId: 'phq-9',
      baselineScore: 10,
      currentScore: 5,
    });

    expect(variation.absoluteDifference).toBe(-5);
    expect(variation.relativeVariationPercent).toBe(-50);
    expect(variation.relativeVariationText).toBe('-50%');
    expect(variation.scoreDirection).toBe('decrease');
    expect(variation.scoreDirectionText).toContain('Redução de pontuação (-5 pts)');
    // In PHQ-9 (symptom scale), reduction is favorable
    expect(variation.clinicalMeaning).toBe('favorable');
    expect(variation.clinicalMeaningText).toContain('Atenuação/redução de sintomas');
  });

  it('Mandatory Case 3: 10 to 10 produces diff 0, relative 0%, and stability', () => {
    const variation = calculateScoreVariation({
      scaleId: 'phq-9',
      baselineScore: 10,
      currentScore: 10,
    });

    expect(variation.absoluteDifference).toBe(0);
    expect(variation.relativeVariationPercent).toBe(0);
    expect(variation.relativeVariationText).toBe('0%');
    expect(variation.scoreDirection).toBe('unchanged');
    expect(variation.clinicalMeaning).toBe('stable');
  });

  it('Mandatory Case 4: 0 to 5 produces diff +5, non-calculable relative %, and NEVER divides by fictive 1', () => {
    const variation = calculateScoreVariation({
      scaleId: 'phq-9',
      baselineScore: 0,
      currentScore: 5,
    });

    expect(variation.absoluteDifference).toBe(5);
    // Relative percentage must be null / non-calculable (never 500% or dividing by 1!)
    expect(variation.relativeVariationPercent).toBeNull();
    expect(variation.relativeVariationText).toBe('Não calculável (linha de base zero)');
    expect(variation.scoreDirection).toBe('increase');
    expect(variation.formattedSummary).toContain('Não calculável');
  });

  it('Instrument direction sensitivity: does NOT assume improvement purely from mathematical signs', () => {
    // 1. MEEM (higher score is better)
    expect(getScaleMetricDirection('meem')).toBe('higher_is_better');
    const meemGain = calculateScoreVariation({
      scaleId: 'meem',
      baselineScore: 22,
      currentScore: 26,
    });
    // Positive difference in MEEM is favorable
    expect(meemGain.absoluteDifference).toBe(4);
    expect(meemGain.clinicalMeaning).toBe('favorable');
    expect(meemGain.clinicalMeaningText).toContain('Ganho/melhora funcional ou cognitiva');

    const meemDecline = calculateScoreVariation({
      scaleId: 'meem',
      baselineScore: 26,
      currentScore: 21,
    });
    // Negative difference in MEEM is unfavorable
    expect(meemDecline.absoluteDifference).toBe(-5);
    expect(meemDecline.clinicalMeaning).toBe('unfavorable');
    expect(meemDecline.clinicalMeaningText).toContain('Declínio funcional ou cognitivo');

    // 2. GAD-7 (lower score is better)
    expect(getScaleMetricDirection('gad-7')).toBe('lower_is_better');
    const gadReduction = calculateScoreVariation({
      scaleId: 'gad-7',
      baselineScore: 16,
      currentScore: 8,
    });
    // Negative difference in GAD-7 is favorable
    expect(gadReduction.absoluteDifference).toBe(-8);
    expect(gadReduction.relativeVariationPercent).toBe(-50);
    expect(gadReduction.clinicalMeaning).toBe('favorable');
  });

  it('Chronological sorting: correctly sorts records by date and time, distinguishing same-day assessments', () => {
    const unsortedRecords = [
      { id: 'rec-3', date: '15/04/2026 14:30', consultationNumber: 2, totalScore: 8 },
      { id: 'rec-1', date: '10/01/2026 10:00', consultationNumber: 1, totalScore: 18 },
      { id: 'rec-4', date: '20/05/2026 09:00', consultationNumber: 3, totalScore: 6 },
      { id: 'rec-2', date: '15/04/2026 09:15', consultationNumber: 2, totalScore: 12 }, // Same day earlier
    ];

    const sorted = sortLongitudinalRecords(unsortedRecords);
    expect(sorted.map((r) => r.id)).toEqual(['rec-1', 'rec-2', 'rec-3', 'rec-4']);
  });
});
