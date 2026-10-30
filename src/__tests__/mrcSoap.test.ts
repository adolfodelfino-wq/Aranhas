import { describe, expect, it } from 'vitest';
import { COMMON_APS_CODES, formatForPec } from '../utils/pecFormatter';
import { formatEemIntoObjective } from '../utils/eemFormatter';
import type { PatientSession, SoapState } from '../types';

/**
 * MRC-SOAP v1.0 — casos técnicos com dados sintéticos.
 *
 * Estes testes cobrem funções determinísticas de exportação e formatação.
 * NÃO substituem os testes manuais de interface da MRC-SOAP (SOAP-09 a SOAP-12)
 * nem demonstram segurança clínica em atendimento real.
 */
describe('MRC-SOAP v1.0 | verificação automatizada de registro e exportação', () => {
  const patient: PatientSession = {
    name: 'Paciente Sintético Alfa',
    age: 40,
    prontuario: 'TESTE-SOAP-001',
    date: '26/10/2026',
    isDemo: true,
  };

  const emptySoap = (): SoapState => ({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    importedItems: [],
  });

  it('[SOAP-01] preserva a independência e a correspondência S/O/A/P na exportação', () => {
    const soap: SoapState = {
      subjective: 'S: queixa relatada',
      objective: 'O: PA 120/80 mmHg',
      assessment: 'A: hipótese a esclarecer',
      plan: 'P: retorno combinado',
      importedItems: [],
    };
    const output = formatForPec(soap, patient);

    expect(output.subjective).toBe(soap.subjective);
    expect(output.objective).toBe(soap.objective);
    expect(output.assessment).toBe(soap.assessment);
    expect(output.plan).toBe(soap.plan);

    const headers = ['[S - SUBJETIVO]', '[O - OBJETIVO]', '[A - AVALIAÇÃO]', '[P - PLANO]'];
    const positions = headers.map((header) => output.fullNarrative.indexOf(header));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('[SOAP-02] preserva diacríticos, sinais e quebras de linha internas', () => {
    const subjective = 'Relata angústia, insônia e sensação de aperto torácico.\nNega febre; início há 3 dias.';
    const objective = 'PA 118/72 mmHg.\nFC: 72 bpm; sem conclusão diagnóstica registrada.';
    const output = formatForPec({
      ...emptySoap(),
      subjective,
      objective,
    }, patient);

    expect(output.subjective).toBe(subjective);
    expect(output.objective).toBe(objective);
    expect(output.fullNarrative).toContain(subjective);
    expect(output.fullNarrative).toContain(objective);
  });

  it('[SOAP-03] não presume exame normal quando o Objetivo não foi preenchido', () => {
    const output = formatForPec({
      ...emptySoap(),
      subjective: 'Insônia há três semanas.',
      assessment: 'Queixa a esclarecer.',
      plan: 'Retorno agendado.',
    }, patient);

    expect(output.objective).toBe('Não registrado.');
    expect(output.fullNarrative).not.toMatch(/exame físico e mental sem alterações/i);
  });

  it('[SOAP-04] exporta SOAP completo na ordem dos campos sem omitir seus textos', () => {
    const soap: SoapState = {
      subjective: 'Texto subjetivo EXCLUSIVO.',
      objective: 'Texto objetivo EXCLUSIVO.',
      assessment: 'Texto avaliação EXCLUSIVO.',
      plan: 'Texto plano EXCLUSIVO.',
      importedItems: [],
    };
    const narrative = formatForPec(soap, patient).fullNarrative;
    const segments = [
      '[S - SUBJETIVO]\nTexto subjetivo EXCLUSIVO.',
      '[O - OBJETIVO]\nTexto objetivo EXCLUSIVO.',
      '[A - AVALIAÇÃO]\nTexto avaliação EXCLUSIVO.',
      '[P - PLANO]\nTexto plano EXCLUSIVO.',
    ];
    for (const segment of segments) expect(narrative).toContain(segment);
    expect(narrative.indexOf(segments[0])).toBeLessThan(narrative.indexOf(segments[1]));
    expect(narrative.indexOf(segments[1])).toBeLessThan(narrative.indexOf(segments[2]));
    expect(narrative.indexOf(segments[2])).toBeLessThan(narrative.indexOf(segments[3]));
  });

  it('[SOAP-05] representa quatro campos vazios sem inventar fatos ou condutas', () => {
    const output = formatForPec(emptySoap(), patient);
    expect([
      output.subjective,
      output.objective,
      output.assessment,
      output.plan,
    ]).toEqual(Array(4).fill('Não registrado.'));
    expect(output.fullNarrative.match(/Não registrado\./g)).toHaveLength(4);
    expect(output.fullNarrative).not.toMatch(/sem queixas|exame normal|sem alterações|orientações gerais|plano terapêutico pactuado/i);
  });

  it('[SOAP-06] insere somente os códigos explicitamente selecionados', () => {
    const output = formatForPec({
      ...emptySoap(),
      subjective: 'Registro clínico não alterável pela codificação.',
    }, patient, [COMMON_APS_CODES[0]]);

    expect(output.assessment).toContain('CIAP-2: P76 | CID-10: F32.9');
    expect(output.assessment).not.toContain('CIAP-2: P74');
    expect(output.assessment).not.toContain('CIAP-2: P18');
    expect(output.subjective).toBe('Registro clínico não alterável pela codificação.');
  });

  it('[SOAP-07] integra EEM preservando achados objetivos anteriores', () => {
    const currentObjective = 'PA 120/80 mmHg.\nFC 70 bpm.';
    const eem = 'Exame do Estado Mental (EEM):\nHumor: ansioso.';
    const updated = formatEemIntoObjective(currentObjective, eem);

    expect(updated).toContain('PA 120/80 mmHg.');
    expect(updated).toContain('FC 70 bpm.');
    expect(updated).toContain(eem);
    expect(updated.match(/Exame do Estado Mental \(EEM\):/gi)).toHaveLength(1);
  });

  it('[SOAP-08] ao reimportar EEM atualiza o bloco sem duplicá-lo nem apagar escala', () => {
    const currentObjective = [
      'PA 120/80 mmHg.',
      '',
      'Exame do Estado Mental (EEM):',
      'Humor: ansioso.',
      '',
      '• PHQ-9: 10/27 pontos.',
    ].join('\n');
    const revised = 'Exame do Estado Mental (EEM):\nHumor: eutímico.';
    const updated = formatEemIntoObjective(currentObjective, revised);
    const importedAgain = formatEemIntoObjective(updated, revised);

    expect(importedAgain).toContain('PA 120/80 mmHg.');
    expect(importedAgain).toContain('• PHQ-9: 10/27 pontos.');
    expect(importedAgain).toContain('Humor: eutímico.');
    expect(importedAgain).not.toContain('Humor: ansioso.');
    expect(importedAgain.match(/Exame do Estado Mental \(EEM\):/gi)).toHaveLength(1);
  });
});
