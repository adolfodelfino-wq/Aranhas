import { describe, it, expect } from 'vitest';
import type { ScaleDefinition } from '../types';
import { PHQ9_SCALE, GAD7_SCALE, AUDIT_SCALE, MEEM_SCALE, ASRS18_SCALE, SNAP_IV_SCALE } from '../data/scalesData';
import { EPDS_SCALE } from '../data/additionalScalesData';

/**
 * MRC-ESC — technical invariants for the seven instruments in TCR scope.
 * Score bounds are independent specifications for the corresponding type of
 * score. These tests DO NOT establish external clinical interpretation.
 * Bibliographic divergences are separately inventoried in docs/MRC-ESC.md.
 */
const scope: { scale: ScaleDefinition; max: number; expectedItems: number }[] = [
  { scale: PHQ9_SCALE, max: 27, expectedItems: 9 },
  { scale: GAD7_SCALE, max: 21, expectedItems: 7 },
  { scale: AUDIT_SCALE, max: 40, expectedItems: 10 },
  { scale: EPDS_SCALE, max: 30, expectedItems: 10 },
  { scale: MEEM_SCALE, max: 30, expectedItems: 19 },
  { scale: ASRS18_SCALE, max: 18, expectedItems: 18 },
  { scale: SNAP_IV_SCALE, max: 54, expectedItems: 18 },
];

function responseAt(scale: ScaleDefinition, extreme: 'min' | 'max'): Record<string, number> {
  return Object.fromEntries(scale.questions.map((q) => {
    const options = q.options.map((option) => option.value);
    return [q.id, extreme === 'min' ? Math.min(...options) : Math.max(...options)];
  }));
}

describe('MRC-ESC — invariantes técnicas das sete escalas', () => {
  for (const { scale, max, expectedItems } of scope) {
    it('[ESC-' + scale.id + '-02] possui itens esperados e pontuações 0 e máximo', () => {
      expect(scale.questions).toHaveLength(expectedItems);
      const ids = scale.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(scale.questions.every((q) => q.options.length >= 2)).toBe(true);
      const lowest = scale.calculateResult(responseAt(scale, 'min'));
      const highest = scale.calculateResult(responseAt(scale, 'max'));
      expect(lowest.isComplete).toBe(true);
      expect(highest.isComplete).toBe(true);
      expect(lowest.totalScore).toBe(0);
      expect(highest.totalScore).toBe(max);
      expect(highest.maxScore).toBe(max);
    });

    it('[ESC-' + scale.id + '-04] não classifica instrumento vazio ou incompleto como concluído', () => {
      const empty = scale.calculateResult({});
      const partial = scale.calculateResult(Object.fromEntries(
        scale.questions.slice(0, 1).map((q) => [q.id, q.options[0].value])
      ));
      for (const result of [empty, partial]) {
        expect(result.isComplete).toBe(false);
        expect(result.classification).toBe('Preenchimento Incompleto');
        expect(result.completionStatus).toBe('incomplete');
        expect(result.soapText).toMatch(/incompleto/i);
      }
    });

    it('[ESC-' + scale.id + '-04-invalid] recusa valores fora das alternativas permitidas', () => {
      const valid = responseAt(scale, 'min');
      const first = scale.questions[0];
      valid[first.id] = Math.max(...first.options.map((q) => q.value)) + 100;
      const result = scale.calculateResult(valid);
      expect(result.isComplete).toBe(false);
      expect(result.classification).toBe('Preenchimento Incompleto');
    });
  }

  it('[ESC-AUD-02] AUDIT mantém opções especiais 0, 2 e 4 nos itens 9 e 10', () => {
    for (const id of ['q9', 'q10']) {
      expect(AUDIT_SCALE.questions.find((q) => q.id === id)?.options.map((o) => o.value)).toEqual([0, 2, 4]);
    }
  });

  it('[ESC-PHQ-05] item 9 positivo dispara alerta mesmo se o resto está incompleto', () => {
    const result = PHQ9_SCALE.calculateResult({ q9: 1 });
    expect(result.isComplete).toBe(false);
    expect(result.hasCriticalAlert).toBe(true);
    expect(result.individualAlerts?.join(' ')).toMatch(/item 9/i);
    expect(result.classification).toBe('Preenchimento Incompleto');
  });

  it('[ESC-EPD-05] item 10 positivo dispara alerta mesmo com demais campos incompletos', () => {
    const result = EPDS_SCALE.calculateResult({ q10: 1 });
    expect(result.isComplete).toBe(false);
    expect(result.hasCriticalAlert).toBe(true);
    expect(result.individualAlerts?.join(' ')).toMatch(/item 10/i);
    expect(result.classification).toBe('Preenchimento Incompleto');
  });

  it('[ESC-PHQ-05-complete] alerta do item 9 permanece mesmo com soma total baixa', () => {
    const result = PHQ9_SCALE.calculateResult({ ...responseAt(PHQ9_SCALE, 'min'), q9: 1 });
    expect(result.isComplete).toBe(true);
    expect(result.totalScore).toBe(1);
    expect(result.hasCriticalAlert).toBe(true);
  });

  it('[ESC-EPD-05-complete] alerta do item 10 permanece mesmo com soma total baixa', () => {
    const result = EPDS_SCALE.calculateResult({ ...responseAt(EPDS_SCALE, 'min'), q10: 1 });
    expect(result.isComplete).toBe(true);
    expect(result.totalScore).toBe(1);
    expect(result.hasCriticalAlert).toBe(true);
  });
});
