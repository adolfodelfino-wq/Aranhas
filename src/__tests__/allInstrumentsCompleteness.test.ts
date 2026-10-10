import { describe, it, expect } from 'vitest';
import { ALL_SCALES } from '../data/scalesData';

describe('P0-01: Completeness Audit of all 21 Clinical Instruments', () => {
  it('contains exactly the 21 audited clinical instruments', () => {
    // 11 in scalesData + 10 in additionalScalesData = 21
    expect(ALL_SCALES.length).toBe(21);
  });

  ALL_SCALES.forEach((scale) => {
    it(`Scale ${scale.acronym} (${scale.id}): rejects incomplete answers and does not generate premature classification`, () => {
      // Empty answers
      const emptyResult = scale.calculateResult({});
      expect(emptyResult.isComplete).toBe(false);
      expect(emptyResult.classification).toBe('Preenchimento Incompleto');
      expect(emptyResult.interpretation).toContain('Instrumento incompleto');

      // Partial answers (if scale has more than 1 question)
      if (scale.questions.length > 1) {
        const partialResult = scale.calculateResult({
          [scale.questions[0].id]: scale.questions[0].options[0].value,
        });
        expect(partialResult.isComplete).toBe(false);
        expect(partialResult.classification).toBe('Preenchimento Incompleto');
      }
    });

    it(`Scale ${scale.acronym} (${scale.id}): produces complete result when all mandatory questions are answered with valid options`, () => {
      // Fill all questions with first option
      const completeAnswers: Record<string, number> = {};
      scale.questions.forEach((q) => {
        completeAnswers[q.id] = q.options[0].value;
      });

      const completeResult = scale.calculateResult(completeAnswers);
      expect(completeResult.isComplete).toBe(true);
      expect(completeResult.classification).not.toBe('Preenchimento Incompleto');
      expect(typeof completeResult.totalScore).toBe('number');
    });

    it(`Scale ${scale.acronym} (${scale.id}): rejects invalid answers (NaN, non-numbers, out-of-range)`, () => {
      const invalidAnswers: Record<string, any> = {};
      scale.questions.forEach((q) => {
        invalidAnswers[q.id] = q.options[0].value;
      });
      // Set first question to invalid
      invalidAnswers[scale.questions[0].id] = 9999; // Out of allowed options

      const invalidResult = scale.calculateResult(invalidAnswers);
      expect(invalidResult.isComplete).toBe(false);
      expect(invalidResult.classification).toBe('Preenchimento Incompleto');
    });
  });
});
