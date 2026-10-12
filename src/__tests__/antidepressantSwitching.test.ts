import { describe, it, expect } from 'vitest';
import {
  ANTIDEPRESSANTS_DB,
  calculateAntidepressantTransition,
  EQUIVALENCE_REFERENCE_TABLE,
} from '../utils/antidepressantSwitching';

describe('Módulo Psicofarmacológico - Transição e Equivalência de Antidepressivos', () => {
  it('contém a base de antidepressivos com propriedades farmacológicas essenciais', () => {
    expect(ANTIDEPRESSANTS_DB['sertralina']).toBeDefined();
    expect(ANTIDEPRESSANTS_DB['fluoxetina']).toBeDefined();
    expect(ANTIDEPRESSANTS_DB['tranilcipromina']).toBeDefined();
    expect(ANTIDEPRESSANTS_DB['desvenlafaxina']).toBeDefined();
  });

  it('calcula a equivalência estimada para fármacos com coeficientes de Hayasaka (Sertralina 100 mg/dia -> Paroxetina)', () => {
    const plan = calculateAntidepressantTransition('sertralina', 100, 'paroxetina');
    expect(plan).toBeDefined();
    expect(plan.sourceDrug.id).toBe('sertralina');
    expect(plan.sourceDoseMg).toBe(100);
    expect(plan.targetDrug.id).toBe('paroxetina');
    expect(plan.estimatedEquivalence.available).toBe(true);
    expect(plan.calculatedEquivalentDoseMg).toBeGreaterThan(0);
    expect(plan.recommendedTargetDoseMg).toBeGreaterThan(0);
    // Verifica que não utiliza terminologia proibida de dose exata
    expect(plan.soapPrescriptionText).not.toContain('Dose exata');
    expect(plan.soapPrescriptionText).toContain('PLANO DE TRANSIÇÃO');
  });

  it('informa ausência de equivalência primária de Hayasaka para fármacos sem coeficiente (Sertralina -> Desvenlafaxina)', () => {
    const plan = calculateAntidepressantTransition('sertralina', 100, 'desvenlafaxina');
    expect(plan).toBeDefined();
    expect(plan.estimatedEquivalence.available).toBe(false);
    expect(plan.calculatedEquivalentDoseMg).toBe(0);
    expect(plan.recommendedTargetDoseMg).toBe(50); // Dose recomendada de introdução
  });

  it('aplica o período de washout obrigatório de 5 semanas (35 dias) para Fluoxetina -> Tranilcipromina', () => {
    const plan = calculateAntidepressantTransition('fluoxetina', 40, 'tranilcipromina');
    expect(plan.strategyType).toBe('washout');
    expect(plan.strategySummary).toContain('5 semanas');
    expect(plan.clinicalRisks.serotoninSyndrome.risk).toBe('Crítico');
  });

  it('aplica o período de washout de 14 dias para ISRS comum -> Tranilcipromina', () => {
    const plan = calculateAntidepressantTransition('sertralina', 50, 'tranilcipromina');
    expect(plan.strategyType).toBe('washout');
    expect(plan.strategySummary).toContain('14 dias');
  });

  it('realiza troca direta facilitada para Fluoxetina -> outro ISRS', () => {
    const plan = calculateAntidepressantTransition('fluoxetina', 20, 'escitalopram');
    expect(plan.strategyType).toBe('direct');
  });
});
