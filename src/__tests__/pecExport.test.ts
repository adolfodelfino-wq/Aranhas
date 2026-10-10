import { describe, it, expect } from 'vitest';
import {
  COMMON_APS_CODES,
  formatForPec,
} from '../utils/pecFormatter';
import { SoapState, PatientSession } from '../types';

describe('Assistente de cópia para PEC (e-SUS APS)', () => {
  const dummyPatient: PatientSession = {
    name: 'Dona Maria de Lourdes',
    age: 74,
    prontuario: 'APS-2026-441',
    date: '28/09/2026',
  };

  const dummySoap: SoapState = {
    subjective: 'Paciente relata insônia crônica há 6 meses e tontura matinal ao levantar.',
    objective: 'PA 130/80 mmHg, FC 72 bpm. EEM: orientada globalmente, sem déficits focais.',
    assessment: 'Insônia crônica + Polifarmácia em idosa com risco elevado de quedas.',
    plan: 'Pactuado desmame hiperbólico de Clonazepam conforme Diretrizes Maudsley 2025.',
    importedItems: [],
  };

  it('formats full PEC narrative with all 4 SOAP fields and patient demographics', () => {
    const pec = formatForPec(dummySoap, dummyPatient);
    expect(pec.subjective).toBe(dummySoap.subjective);
    expect(pec.objective).toBe(dummySoap.objective);
    expect(pec.plan).toBe(dummySoap.plan);
    expect(pec.fullNarrative).toContain('[ATENDIMENTO MÉDICO - APS / e-SUS PEC]');
    expect(pec.fullNarrative).toContain('Dona Maria de Lourdes');
    expect(pec.fullNarrative).toContain('[S - SUBJETIVO]');
    expect(pec.fullNarrative).toContain('[O - OBJETIVO]');
    expect(pec.fullNarrative).toContain('[A - AVALIAÇÃO]');
    expect(pec.fullNarrative).toContain('[P - PLANO]');
  });

  it('attaches CIAP-2 and CID-10 codes cleanly to the Assessment section without corrupting Subjective', () => {
    const selectedCodes = [COMMON_APS_CODES[0], COMMON_APS_CODES[2]]; // P76 and P18
    const pec = formatForPec(dummySoap, dummyPatient, selectedCodes);

    expect(pec.assessment).toContain('CIAP-2: P76 | CID-10: F32.9');
    expect(pec.assessment).toContain('CIAP-2: P18 | CID-10: F13.2');
    // Ensure Subjective remains 100% untampered
    expect(pec.subjective).toBe(dummySoap.subjective);
  });

  it('provides safe fallback text when SOAP fields are empty', () => {
    const emptySoap: SoapState = {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      importedItems: [],
    };

    const pec = formatForPec(emptySoap, dummyPatient);
    expect(pec.subjective).toContain('Sem queixas registradas');
    expect(pec.objective).toContain('Exame físico e mental');
    expect(pec.assessment).toContain('Avaliação clínica');
    expect(pec.plan).toContain('Orientações gerais');
  });
});
