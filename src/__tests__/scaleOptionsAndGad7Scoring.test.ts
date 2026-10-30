import { describe, it, expect } from 'vitest';
import { ALL_SCALES, GAD7_SCALE, TCR_SCALES, TCR_SCALE_IDS } from '../data/scalesData';
import { cleanOptionLabel } from '../components/ScalesView';

describe('Option Labels Neutrality & Score Protection (Anti-Induction)', () => {
  it('cleanOptionLabel strips parenthesized points from option labels', () => {
    expect(cleanOptionLabel('Controle total (0)')).toBe('Controle total');
    expect(cleanOptionLabel('Muito controle (1)')).toBe('Muito controle');
    expect(cleanOptionLabel('Não (0)')).toBe('Não');
    expect(cleanOptionLabel('Sim (1)')).toBe('Sim');
    expect(cleanOptionLabel('Ausente (0)')).toBe('Ausente');
    expect(cleanOptionLabel('Leve (1)')).toBe('Leve');
    expect(cleanOptionLabel('1 palavra (1)')).toBe('1 palavra');
    expect(cleanOptionLabel('3 passos completos (3)')).toBe('3 passos completos');
    expect(cleanOptionLabel('Nenhuma vez (0 pts)')).toBe('Nenhuma vez');
    expect(cleanOptionLabel('Quase todos os dias (3 pontos)')).toBe('Quase todos os dias');
    expect(cleanOptionLabel('Nenhuma vez')).toBe('Nenhuma vez');
    expect(cleanOptionLabel('Vários dias')).toBe('Vários dias');
  });

  it('no scale in ALL_SCALES displays raw point numbers in its option labels', () => {
    ALL_SCALES.forEach((scale) => {
      scale.questions.forEach((q) => {
        q.options.forEach((opt) => {
          expect(opt.label).not.toMatch(/\([0-9]+\)/);
        });
      });
    });
  });
});

describe('GAD-7 Scoring Accuracy & Completeness', () => {
  it('calculates exact score and clinical classification for GAD-7 across all severity brackets', () => {
    // 0 pts: Mínima ou ausente
    const allZero = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0, q7: 0 };
    const res0 = GAD7_SCALE.calculateResult(allZero);
    expect(res0.isComplete).toBe(true);
    expect(res0.totalScore).toBe(0);
    expect(res0.classification).toMatch(/mínima/i);

    // 4 pts: Mínima (teto de 0-4)
    const score4 = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 0, q6: 0, q7: 0 };
    const res4 = GAD7_SCALE.calculateResult(score4);
    expect(res4.totalScore).toBe(4);
    expect(res4.classification).toMatch(/mínima/i);

    // 5 pts: Leve (piso de 5-9)
    const score5 = { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0, q7: 0 };
    const res5 = GAD7_SCALE.calculateResult(score5);
    expect(res5.totalScore).toBe(5);
    expect(res5.classification).toMatch(/leve/i);

    // 9 pts: Leve (teto de 5-9)
    const score9 = { q1: 2, q2: 2, q3: 2, q4: 1, q5: 1, q6: 1, q7: 0 };
    const res9 = GAD7_SCALE.calculateResult(score9);
    expect(res9.totalScore).toBe(9);
    expect(res9.classification).toMatch(/leve/i);

    // 10 pts: Moderada (piso corte >= 10)
    const score10 = { q1: 2, q2: 2, q3: 2, q4: 2, q5: 1, q6: 1, q7: 0 };
    const res10 = GAD7_SCALE.calculateResult(score10);
    expect(res10.totalScore).toBe(10);
    expect(res10.classification).toMatch(/moderada/i);

    // 14 pts: Moderada (teto de 10-14)
    const score14 = { q1: 2, q2: 2, q3: 2, q4: 2, q5: 2, q6: 2, q7: 2 };
    const res14 = GAD7_SCALE.calculateResult(score14);
    expect(res14.totalScore).toBe(14);
    expect(res14.classification).toMatch(/moderada/i);

    // 15 pts: Grave (piso corte >= 15)
    const score15 = { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2, q6: 1, q7: 1 };
    const res15 = GAD7_SCALE.calculateResult(score15);
    expect(res15.totalScore).toBe(15);
    expect(res15.classification).toMatch(/grave/i);

    // 21 pts: Grave máximo
    const allMax = { q1: 3, q2: 3, q3: 3, q4: 3, q5: 3, q6: 3, q7: 3 };
    const res21 = GAD7_SCALE.calculateResult(allMax);
    expect(res21.totalScore).toBe(21);
    expect(res21.classification).toMatch(/grave/i);
  });

  it('accumulates partial score in real time when GAD-7 is in progress', () => {
    // 2 questions answered: q1=2, q2=3 -> partial score must be 5
    const partialAnswers = { q1: 2, q2: 3 };
    const partialRes = GAD7_SCALE.calculateResult(partialAnswers);
    expect(partialRes.isComplete).toBe(false);
    expect(partialRes.totalScore).toBe(5);
    expect(partialRes.classification).toBe('Preenchimento Incompleto');
  });

  it('all questions across all 21 scales have unique option values (no duplicate React keys or collision)', () => {
    ALL_SCALES.forEach((scale) => {
      scale.questions.forEach((q) => {
        const vals = q.options.map((o) => o.value);
        const unique = new Set(vals);
        expect(unique.size).toBe(vals.length);
      });
    });
  });

  it('calculates ASRS-18 score and classification accurately with OMS / Mattos cut-offs', () => {
    const asrsScale = ALL_SCALES.find((s) => s.id === 'asrs-18')!;
    expect(asrsScale).toBeDefined();

    // All negative: 'Nunca' (0)
    const negativeAnswers: Record<string, number> = {};
    for (let i = 1; i <= 18; i++) negativeAnswers[`q${i}`] = 0;
    const resNeg = asrsScale.calculateResult(negativeAnswers);
    expect(resNeg.isComplete).toBe(true);
    expect(resNeg.totalScore).toBe(0);
    expect(resNeg.classification).toMatch(/negativo/i);

    // Highly suggestive (inattention >= 4 and hyperactivity >= 4) with 'Frequentemente' (3)
    const positiveAnswers: Record<string, number> = {};
    for (let i = 1; i <= 18; i++) positiveAnswers[`q${i}`] = 3;
    const resPos = asrsScale.calculateResult(positiveAnswers);
    expect(resPos.isComplete).toBe(true);
    expect(resPos.totalScore).toBe(18);
    expect(resPos.classification).toMatch(/combinada/i);
  });

  it('exposes exactly the 7 TCR instruments in TCR_SCALES for interface accessibility', () => {
    expect(TCR_SCALES).toHaveLength(7);
    const ids = TCR_SCALES.map((s) => s.id);
    expect(ids).toEqual(['phq-9', 'gad-7', 'audit', 'epds', 'meem', 'asrs-18', 'snap-iv']);
    expect(TCR_SCALE_IDS).toEqual(['phq-9', 'gad-7', 'audit', 'epds', 'meem', 'asrs-18', 'snap-iv']);
    TCR_SCALES.forEach((s) => {
      expect(s.questions.length).toBeGreaterThan(0);
      expect(typeof s.calculateResult).toBe('function');
    });
  });
});
