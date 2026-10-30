/**
 * Formatador Estruturado para o PEC (Prontuário Eletrônico do Cidadão - e-SUS APS)
 * Ministério da Saúde - Atenção Primária à Saúde (APS) / Medicina de Família e Comunidade (MFC)
 */

import { SoapState, PatientSession } from '../types';

export interface CiapCidItem {
  ciap2: string;
  cid10: string;
  label: string;
  category: 'mental' | 'desprescricao' | 'geriatria' | 'geral';
}

export const COMMON_APS_CODES: CiapCidItem[] = [
  { ciap2: 'P76', cid10: 'F32.9', label: 'Transtorno Depressivo / Depressão', category: 'mental' },
  { ciap2: 'P74', cid10: 'F41.9', label: 'Transtorno de Ansiedade / Ansiedade generalizada', category: 'mental' },
  { ciap2: 'P18', cid10: 'F13.2', label: 'Uso crônico / Dependência de sedativos ou hipnóticos', category: 'desprescricao' },
  { ciap2: 'P03', cid10: 'F51.0', label: 'Insônia / Distúrbios do sono', category: 'mental' },
  { ciap2: 'P01', cid10: 'R45.0', label: 'Sensação de ansiedade / Nervosismo / Tensão', category: 'mental' },
  { ciap2: 'P19', cid10: 'F10.2', label: 'Uso nocivo de álcool / Outras substâncias', category: 'mental' },
  { ciap2: 'A98', cid10: 'Z00.0', label: 'Manutenção da saúde / Prevenção / Desprescrição', category: 'geriatria' },
  { ciap2: 'P20', cid10: 'F06.7', label: 'Déficit cognitivo leve / Queixa de memória', category: 'geriatria' },
];

export interface PecFormattedOutput {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  fullNarrative: string;
}

export function formatForPec(
  soap: SoapState,
  patient: PatientSession,
  selectedCodes: CiapCidItem[] = []
): PecFormattedOutput {
  const codesString = selectedCodes.length > 0
    ? selectedCodes.map((c) => `• CIAP-2: ${c.ciap2} | CID-10: ${c.cid10} - ${c.label}`).join('\n')
    : '';

  // Empty SOAP sections must not be converted into negative findings, diagnoses,
  // clinical assessments or therapeutic decisions not provided by the physician.
  const missingFieldText = 'Não registrado.';
  const cleanSubjective = soap.subjective?.trim() || missingFieldText;
  const cleanObjective = soap.objective?.trim() || missingFieldText;

  let cleanAssessment = soap.assessment?.trim() || missingFieldText;
  if (codesString) {
    cleanAssessment = `${cleanAssessment}\n\n[CODIFICAÇÃO CIAP-2 / CID-10]:\n${codesString}`;
  }

  const cleanPlan = soap.plan?.trim() || missingFieldText;

  const fullNarrative = `[ATENDIMENTO MÉDICO - APS / e-SUS PEC]
PACIENTE: ${patient.name} (${patient.age} anos, Pront: ${patient.prontuario || 'S/N'})
DATA: ${patient.date}

[S - SUBJETIVO]
${cleanSubjective}

[O - OBJETIVO]
${cleanObjective}

[A - AVALIAÇÃO]
${cleanAssessment}

[P - PLANO]
${cleanPlan}

---
Registro estruturado via Nexus Clínico - APS/MFC`;

  return {
    subjective: cleanSubjective,
    objective: cleanObjective,
    assessment: cleanAssessment,
    plan: cleanPlan,
    fullNarrative,
  };
}
