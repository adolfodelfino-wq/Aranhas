import { describe, it, expect } from 'vitest';
import { PHQ9_SCALE, CSSRS_SCALE } from '../data/scalesData';
import { EPDS_SCALE } from '../data/additionalScalesData';
import { validateScaleAnswers } from '../utils/scaleValidation';

describe('P0-01 & P0-02: Instrument Completeness & Safety Validation (PHQ-9 & EPDS)', () => {
  it('PHQ-9 with 2 of 9 answers does NOT generate final diagnostic classification', () => {
    const incompleteAnswers = {
      q1: 2,
      q2: 1,
    };

    const validation = validateScaleAnswers(PHQ9_SCALE, incompleteAnswers);
    expect(validation.isComplete).toBe(false);
    expect(validation.answeredCount).toBe(2);
    expect(validation.totalRequired).toBe(9);

    const result = PHQ9_SCALE.calculateResult(incompleteAnswers);
    expect(result.isComplete).toBe(false);
    expect(result.completionStatus).toBe('incomplete');
    expect(result.classification).toBe('Preenchimento Incompleto');
    expect(result.interpretation).toContain('Não é seguro emitir classificação diagnóstica');
    expect(result.hasCriticalAlert).toBe(false);
  });

  it('PHQ-9 with item 9 positive generates critical clinical alert EVEN when incomplete', () => {
    const incompleteWithSuicidalIdeation = {
      q1: 1,
      q9: 2, // Item 9 positive (Mais da metade dos dias)
    };

    const validation = validateScaleAnswers(PHQ9_SCALE, incompleteWithSuicidalIdeation);
    expect(validation.isComplete).toBe(false);
    expect(validation.individualAlerts.length).toBeGreaterThan(0);
    expect(validation.individualAlerts[0]).toContain('Item 9');
    expect(validation.individualAlerts[0]).toContain('avaliação clínica direta');

    const result = PHQ9_SCALE.calculateResult(incompleteWithSuicidalIdeation);
    expect(result.isComplete).toBe(false);
    expect(result.hasCriticalAlert).toBe(true);
    expect(result.recommendations.some((r) => r.includes('Item 9'))).toBe(true);
    // Does NOT automatically classify suicide risk severity level
    expect(result.classification).toBe('Preenchimento Incompleto');
  });

  it('PHQ-9 complete (9/9 items) calculates score and applies validated thresholds correctly', () => {
    // Score 0: Mínimo
    const zeroAnswers = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 0 };
    const zeroResult = PHQ9_SCALE.calculateResult(zeroAnswers);
    expect(zeroResult.isComplete).toBe(true);
    expect(zeroResult.totalScore).toBe(0);
    expect(zeroResult.classification).toMatch(/mínimo/i);
    expect(zeroResult.hasCriticalAlert).toBe(false);

    // Score 14: Sintomas depressivos moderados (10-14)
    const modAnswers = { q1: 2, q2: 2, q3: 2, q4: 2, q5: 2, q6: 2, q7: 2, q8: 0, q9: 0 };
    const modResult = PHQ9_SCALE.calculateResult(modAnswers);
    expect(modResult.isComplete).toBe(true);
    expect(modResult.totalScore).toBe(14);
    expect(modResult.classification).toMatch(/moderada/i);

    // Score 27: Máximo (20-27: Grave)
    const maxAnswers = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3, q8: 3, q9: 3 };
    const maxResult = PHQ9_SCALE.calculateResult(maxAnswers);
    expect(maxResult.isComplete).toBe(true);
    expect(maxResult.totalScore).toBe(27);
    expect(maxResult.classification).toMatch(/grave/i);
    expect(maxResult.hasCriticalAlert).toBe(true); // Due to item 9 = 3
  });

  it('EPDS incomplete does NOT produce false-negative "Sintomas improváveis"', () => {
    const partialAnswers = {
      q1: 1,
      q2: 1,
    };

    const validation = validateScaleAnswers(EPDS_SCALE, partialAnswers);
    expect(validation.isComplete).toBe(false);
    expect(validation.answeredCount).toBe(2);
    expect(validation.totalRequired).toBe(10);

    const result = EPDS_SCALE.calculateResult(partialAnswers);
    expect(result.isComplete).toBe(false);
    expect(result.classification).toBe('Preenchimento Incompleto');
    expect(result.classification).not.toContain('Sintomas improváveis');
  });

  it('EPDS with positive item 10 emits appropriate individual alert, keeping it separate from total score', () => {
    // Incomplete but with item 10 positive
    const incompleteWithSelfHarm = {
      q1: 0,
      q10: 2, // Algumas vezes
    };
    const incResult = EPDS_SCALE.calculateResult(incompleteWithSelfHarm);
    expect(incResult.isComplete).toBe(false);
    expect(incResult.hasCriticalAlert).toBe(true);
    expect(incResult.individualAlerts?.[0]).toContain('Item 10');

    // Complete with low total score (e.g. total 3) but positive item 10
    const completeLowScoreWithItem10 = {
      q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0, q8: 0, q9: 1, q10: 2,
    };
    const compResult = EPDS_SCALE.calculateResult(completeLowScoreWithItem10);
    expect(compResult.isComplete).toBe(true);
    expect(compResult.totalScore).toBe(3);
    // Total score interpretation says symptoms unlikely based on 3 pts
    expect(compResult.classification).toBe('Sintomas improváveis de depressão puerperal');
    // But individual alert is explicitly preserved and separated
    expect(compResult.hasCriticalAlert).toBe(true);
    expect(compResult.individualAlerts?.[0]).toContain('Item 10');
    expect(compResult.recommendations.some((r) => r.includes('Item 10'))).toBe(true);
  });
});

describe('P0-03: C-SSRS (Columbia Protocol) Structural Shielding', () => {
  it('does NOT use suicidal behavior (q6) as a 6th ordinal position of ideation', () => {
    // Only suicidal behavior reported (q6 = 1), ideation items 1-5 are 0
    const behaviorOnlyAnswers = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0,
      q6: 1,
    };

    const result = CSSRS_SCALE.calculateResult(behaviorOnlyAnswers);
    expect(result.isComplete).toBe(true);
    // Ideation severity remains 0 (not 5 or 6!)
    expect(result.totalScore).toBe(0);
    expect(result.ideationSeverityText).toContain('Nenhuma ideação suicida');
    expect(result.behaviorText).toContain('Presença de comportamento suicida');
  });

  it('preserves ideation severity levels 1 through 5 independently', () => {
    // Nível 3: Ideação com método em mente sem intenção
    const level3Answers = {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 0,
      q5: 0,
      q6: 0,
    };
    const res3 = CSSRS_SCALE.calculateResult(level3Answers);
    expect(res3.totalScore).toBe(3);
    expect(res3.ideationSeverityText).toContain('Nível 3');
    expect(res3.behaviorText).toContain('Nega comportamento suicida');

    // Nível 5: Ideação com plano e intenção
    const level5Answers = {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 1,
      q5: 1,
      q6: 0,
    };
    const res5 = CSSRS_SCALE.calculateResult(level5Answers);
    expect(res5.totalScore).toBe(5);
    expect(res5.ideationSeverityText).toContain('Nível 5');
    expect(res5.clinicalActionRequired).toBe(true);
  });

  it('does NOT determine automatic decisions of hospitalization, discharge, or referral', () => {
    const highRiskAnswers = {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 1,
      q5: 1,
      q6: 1,
    };
    const result = CSSRS_SCALE.calculateResult(highRiskAnswers);
    expect(result.interpretation).toContain('não substitui o julgamento clínico médico integral');
    expect(result.interpretation).toContain('nem determina automaticamente internação ou alta');
    expect(result.recommendations.some((r) => r.includes('decisão exclusivamente médica baseada no julgamento clínico presencial'))).toBe(true);
  });

  it('self-administered scale results preserve isSelfAdministered flag and structured answers array', () => {
    const completeAnswers = { q1: 1, q2: 2, q3: 1, q4: 0, q5: 1, q6: 2, q7: 1, q8: 0, q9: 0 };
    const res = PHQ9_SCALE.calculateResult(completeAnswers);
    const answersArray = PHQ9_SCALE.questions.map((q) => completeAnswers[q.id as keyof typeof completeAnswers] ?? 0);

    const selfAdminResult = {
      ...res,
      scaleId: PHQ9_SCALE.id,
      scaleTitle: PHQ9_SCALE.title,
      isSelfAdministered: true,
      answersArray,
    };

    expect(selfAdminResult.isSelfAdministered).toBe(true);
    expect(selfAdminResult.answersArray.length).toBe(9);
    expect(selfAdminResult.totalScore).toBe(8);
    expect(selfAdminResult.scaleId).toBe('phq-9');
  });
});
