import { describe, it, expect } from 'vitest';
import {
  BZD_DATABASE,
  calculateDiazepamEquivalent,
  generateBzdTaperPlan,
  MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF,
} from '../utils/benzodiazepineTapering';

describe('P1-01: Benzodiazepine & Z-Drug Maudsley 15th Edition (2025) / Horowitz & Taylor Protocol', () => {
  describe('Dose Equivalence & Hill Receptor Occupancy', () => {
    it('calculates 10mg Diazepam equivalent for Clonazepam 0.5mg and 40mg for 2.0mg', () => {
      const res05 = calculateDiazepamEquivalent('clonazepam', 0.5);
      expect(res05.equivalentDiazepamMg).toBe(10);

      const res20 = calculateDiazepamEquivalent('clonazepam', 2.0);
      expect(res20.equivalentDiazepamMg).toBe(40);
    });

    it('calculates 20mg Diazepam equivalent for Alprazolam 1.0mg', () => {
      const res = calculateDiazepamEquivalent('alprazolam', 1.0);
      expect(res.equivalentDiazepamMg).toBe(20);
    });

    it('calculates 20mg Diazepam equivalent for Lorazepam 2.0mg', () => {
      const res = calculateDiazepamEquivalent('lorazepam', 2.0);
      expect(res.equivalentDiazepamMg).toBe(20);
    });

    it('calculates 10mg Diazepam equivalent for Zolpidem 10mg (Z-drug)', () => {
      const res = calculateDiazepamEquivalent('zolpidem', 10.0);
      expect(res.equivalentDiazepamMg).toBe(10);
    });
  });

  describe('ASAM (2025) & Maudsley Deprescribing (2024) Tapering Strategy', () => {
    it('generates proportional reductions with progressively smaller micro-steps terminating in stabilization without forcing zero', () => {
      const plan = generateBzdTaperPlan('clonazepam', 2.0, 'maudsley_hyperbolic', 'standard');
      expect(plan.schedule.length).toBeGreaterThanOrEqual(5);
      expect(plan.strategy).toBe('maudsley_hyperbolic');

      // Verify that step reductions are proportional and not fixed jumps
      const step1Dose = plan.schedule[0].sourceDrugDoseMg;
      const step2Dose = plan.schedule[1].sourceDrugDoseMg;
      const step3Dose = plan.schedule[2].sourceDrugDoseMg;
      expect(step1Dose).toBeLessThan(2.0);
      expect(step2Dose).toBeLessThan(step1Dose);
      expect(step3Dose).toBeLessThan(step2Dose);

      // Last step terminates safely in consolidation at minimum dose, without forcing premature zero (ASAM 2025)
      const lastStep = plan.schedule[plan.schedule.length - 1];
      expect(lastStep.isConsolidationPhase).toBe(true);
      expect(lastStep.sourceDrugDoseMg).toBeGreaterThan(0);
      expect(lastStep.clinicalNotes).toContain('FASE DE CONSOLIDAÇÃO');
    });

    it('calculates liquid formulation drop instructions for Clonazepam', () => {
      const plan = generateBzdTaperPlan('clonazepam', 1.0, 'maudsley_hyperbolic', 'standard');
      const stepWithDose = plan.schedule.find((s) => s.sourceDrugDoseMg > 0);
      expect(stepWithDose?.sourceDrugInstructions).toContain('gota');
    });

    it('supports individualized custom settings for reduction percentage and step duration', () => {
      const planCustom = generateBzdTaperPlan('diazepam', 10.0, 'maudsley_hyperbolic', 'standard', {
        reductionPercentage: 10,
        stepDurationWeeks: 3,
      });
      expect(planCustom.reductionPercentage).toBe(10);
      expect(planCustom.stepDurationWeeks).toBe(3);
      expect(planCustom.schedule[0].durationWeeks).toBe(3);
    });
  });

  describe('Maudsley / Ashton Switch Strategy with Gradual Reduction', () => {
    it('transitions Alprazolam to Diazepam and then performs gradual reduction', () => {
      const plan = generateBzdTaperPlan('alprazolam', 1.0, 'maudsley_ashton_switch', 'standard');
      expect(plan.schedule.length).toBeGreaterThanOrEqual(4);

      // Step 1: Introduces partial Diazepam at night
      expect(plan.schedule[0].diazepamDoseMg).toBeGreaterThan(0);
      expect(plan.schedule[0].sourceDrugDoseMg).toBeGreaterThan(0);

      // Step 2: Source drug is suspended, fully on Diazepam
      expect(plan.schedule[1].sourceDrugDoseMg).toBe(0);
      expect(plan.schedule[1].diazepamDoseMg).toBe(20);

      // Final step: Diazepam reaches minimum consolidation dose (1 mg) without forcing zero
      const lastStep = plan.schedule[plan.schedule.length - 1];
      expect(lastStep.isConsolidationPhase).toBe(true);
      expect(lastStep.diazepamDoseMg).toBe(1.0);
      expect(lastStep.clinicalNotes).toContain('FASE DE CONSOLIDAÇÃO');
    });
  });

  describe('Clinical Safety, Patient-Led Tapering & Differential Diagnosis', () => {
    it('provides the differential table for Withdrawal vs Relapse', () => {
      expect(MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF.length).toBeGreaterThanOrEqual(4);
      const features = MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF.map((i) => i.feature);
      expect(features).toContain('Tempo de Início');
      expect(features).toContain('Natureza dos Sintomas Sensoriais');
      expect(features).toContain('Padrão Temporal (Evolução)');
      expect(features).toContain('Resposta à Reintrodução de Dose');
    });

    it('includes patient-led tapering (hold rule) in warnings and SOAP', () => {
      const plan = generateBzdTaperPlan('alprazolam', 2.0, 'maudsley_ashton_switch', 'standard');
      const allWarnings = plan.safetyWarnings.join(' ');
      expect(allWarnings).toContain('REGRA DO DESMAME GUIADO PELO PACIENTE');
      expect(allWarnings).toContain('PAUSAR');
      expect(allWarnings).toContain('ASAM 2025');
      expect(plan.soapPlanText).toContain('DIRETRIZES ASAM (2025)');
    });

    it('includes patient guidance text with accessible rules of thumb', () => {
      const plan = generateBzdTaperPlan('clonazepam', 0.5, 'maudsley_hyperbolic', 'standard');
      expect(plan.patientGuidanceText).toContain('DIRETRIZES ASAM 2025');
      expect(plan.patientGuidanceText).toContain('COMO FUNCIONA A REDUÇÃO GRADUAL?');
      expect(plan.patientGuidanceText).toContain('REGRAS DE OURO');
    });
  });
});
