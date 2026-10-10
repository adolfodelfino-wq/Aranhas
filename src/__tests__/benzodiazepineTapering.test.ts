import { describe, it, expect } from 'vitest';
import {
  BZD_DATABASE,
  calculateDiazepamEquivalent,
  calculateGabaOccupancyPercent,
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

    it('calculates 5mg Diazepam equivalent for Zolpidem 10mg (Z-drug)', () => {
      const res = calculateDiazepamEquivalent('zolpidem', 10.0);
      expect(res.equivalentDiazepamMg).toBe(5);
    });

    it('calculates non-linear hyperbolic GABA-A receptor occupancy according to Hill model', () => {
      // 0 mg -> 0%
      expect(calculateGabaOccupancyPercent(0)).toBe(0);
      // 4.5 mg (ED50) -> ~50%
      expect(calculateGabaOccupancyPercent(4.5)).toBe(50);
      // 10 mg -> ~69%
      expect(calculateGabaOccupancyPercent(10)).toBeGreaterThan(65);
      expect(calculateGabaOccupancyPercent(10)).toBeLessThan(75);
      // 40 mg -> ~89.9%
      expect(calculateGabaOccupancyPercent(40)).toBeGreaterThan(85);
    });
  });

  describe('Maudsley Hyperbolic Tapering Strategy (15ª Ed., 2025)', () => {
    it('generates proportional reductions with progressively smaller micro-steps down to 0mg', () => {
      const plan = generateBzdTaperPlan('clonazepam', 2.0, 'maudsley_hyperbolic', 'standard');
      expect(plan.schedule.length).toBe(6);
      expect(plan.strategy).toBe('maudsley_hyperbolic');
      expect(plan.baselineGabaReceptorOccupancy).toBeGreaterThan(80);

      // Verify that step reductions are proportional and not fixed jumps
      const step1Dose = plan.schedule[0].sourceDrugDoseMg;
      const step2Dose = plan.schedule[1].sourceDrugDoseMg;
      const step3Dose = plan.schedule[2].sourceDrugDoseMg;
      expect(step1Dose).toBeLessThan(2.0);
      expect(step2Dose).toBeLessThan(step1Dose);
      expect(step3Dose).toBeLessThan(step2Dose);

      // Last step terminates safely at 0mg
      const lastStep = plan.schedule[plan.schedule.length - 1];
      expect(lastStep.sourceDrugDoseMg).toBe(0);
      expect(lastStep.percentRemaining).toBe(0);
      expect(lastStep.estimatedGabaReceptorOccupancy).toBe(0);
      expect(lastStep.sourceDrugInstructions).toContain('SUSPENSÃO COMPLETA');
    });

    it('calculates liquid formulation drop instructions for Clonazepam', () => {
      const plan = generateBzdTaperPlan('clonazepam', 1.0, 'maudsley_hyperbolic', 'standard');
      const stepWithDose = plan.schedule.find((s) => s.sourceDrugDoseMg > 0);
      expect(stepWithDose?.sourceDrugInstructions).toContain('gota');
    });

    it('supports conservative pace with 8 steps and accelerated with 4 steps', () => {
      const planConserv = generateBzdTaperPlan('diazepam', 10.0, 'maudsley_hyperbolic', 'conservative');
      expect(planConserv.schedule.length).toBe(8);

      const planAccel = generateBzdTaperPlan('diazepam', 10.0, 'maudsley_hyperbolic', 'accelerated');
      expect(planAccel.schedule.length).toBe(4);
    });
  });

  describe('Maudsley / Ashton Switch Strategy with Hyperbolic Reduction', () => {
    it('transitions Alprazolam to Diazepam and then performs hyperbolic reduction', () => {
      const plan = generateBzdTaperPlan('alprazolam', 1.0, 'maudsley_ashton_switch', 'standard');
      expect(plan.schedule.length).toBe(6);

      // Step 1: Introduces partial Diazepam at night
      expect(plan.schedule[0].diazepamDoseMg).toBeGreaterThan(0);
      expect(plan.schedule[0].sourceDrugDoseMg).toBeGreaterThan(0);

      // Step 2: Source drug is suspended, fully on Diazepam
      expect(plan.schedule[1].sourceDrugDoseMg).toBe(0);
      expect(plan.schedule[1].diazepamDoseMg).toBe(20);

      // Final step: Diazepam reaches 0 mg
      const lastStep = plan.schedule[plan.schedule.length - 1];
      expect(lastStep.diazepamDoseMg).toBe(0);
      expect(lastStep.percentRemaining).toBe(0);
      expect(lastStep.diazepamInstructions).toContain('SUSPENSÃO COMPLETA');
    });
  });

  describe('Clinical Safety, Patient-Led Tapering & Differential Diagnosis', () => {
    it('provides the Maudsley 2025 differential table for Withdrawal vs Relapse', () => {
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
      expect(allWarnings).toContain('PATIENT-LED TAPERING');
      expect(allWarnings).toContain('PAUSAR');
      expect(allWarnings).toContain('CURVA HIPERBÓLICA DE RECEPTORES');
      expect(plan.soapPlanText).toContain('DIRETRIZES MAUDSLEY DE DESPRESCRIÇÃO (15ª ED., 2025)');
      expect(plan.soapPlanText).toContain('Ocupação basal estimada de receptores GABA-A');
    });

    it('includes patient guidance text with accessible rules of thumb', () => {
      const plan = generateBzdTaperPlan('clonazepam', 0.5, 'maudsley_hyperbolic', 'standard');
      expect(plan.patientGuidanceText).toContain('DIRETRIZES MAUDSLEY 2025');
      expect(plan.patientGuidanceText).toContain('POR QUE REDUZIMOS EM PASSOS CADA VEZ MENORES?');
      expect(plan.patientGuidanceText).toContain('SE VOCÊ TIVER UMA SEMANA DIFÍCIL');
    });
  });
});
