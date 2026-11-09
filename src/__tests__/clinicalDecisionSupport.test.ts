import { describe, expect, it } from 'vitest';
import { PHQ9_SCALE, GAD7_SCALE } from '../data/scalesData';
import { generateClinicalSuggestions } from '../utils/clinicalDecisionSupport';
import { getEmptyEemState } from '../utils/eemSelection';

const completeAnswers = (count: number, value: number) =>
  Object.fromEntries(Array.from({ length: count }, (_, index) => [`q${index + 1}`, value]));

describe('Apoio à Avaliação e ao Plano', () => {
  it('deixa os rascunhos vazios quando faltam dados estruturados', () => {
    const eemState = { ...getEmptyEemState(), observacoesLivres: 'Paciente nega insônia.' };
    const output = generateClinicalSuggestions({ eemState });
    expect(output).toEqual({ assessmentText: '', planText: '', safetySignals: [] });
  });

  it('mantém o aviso do item 9 mesmo no PHQ-9 incompleto', () => {
    const phq9Result = PHQ9_SCALE.calculateResult({ q9: 1 });
    const output = generateClinicalSuggestions({ phq9Result });
    expect(output.safetySignals).toHaveLength(1);
    expect(output.assessmentText).not.toMatch(/\/27 pontos/);
    expect(output.planText).toContain('avaliação clínica direta de segurança nesta consulta');
    expect(output.planText).toContain('se houver risco iminente');
    expect(output.planText).not.toMatch(/\d+\s*(mg|horas|dias|semanas)\b/i);
  });

  it('recupera o item 9 do resumo em resultados sem vetor de respostas', () => {
    const phq9Result = {
      ...PHQ9_SCALE.calculateResult({}),
      answersArray: undefined,
      hasCriticalAlert: undefined,
      answersSummary: [{ questionText: '9. Pensamentos de morte ou autolesão', answerLabel: 'Vários dias', value: 1 }],
    };
    expect(generateClinicalSuggestions({ phq9Result }).safetySignals).toHaveLength(1);
  });

  it('registra escores elevados como medidas de sintomas, sem diagnósticos ou doses', () => {
    const phq9Result = PHQ9_SCALE.calculateResult({ ...completeAnswers(9, 3), q9: 0 });
    const gad7Result = GAD7_SCALE.calculateResult(completeAnswers(7, 3));
    const output = generateClinicalSuggestions({ phq9Result, gad7Result });
    expect(output.assessmentText).toContain('PHQ-9: 24/27 pontos');
    expect(output.assessmentText).toContain('GAD-7: 21/21 pontos');
    expect(output.assessmentText).not.toMatch(/episódio depressivo maior|transtorno de ansiedade|síndrome ansioso-depressiva/i);
    expect(output.planText).not.toMatch(/\bmg\b|ISRS|benzodiazepín/i);
    expect(output.safetySignals).toEqual([]);
  });

  it('mostra descritores do EEM e prioriza o sinal de ideação suicida', () => {
    const eemState = {
      ...getEmptyEemState(),
      pensamentoConteudo: ['conteudo_ideacao_suicida'],
      orientacao: ['desorientado_tempo'],
    };
    const output = generateClinicalSuggestions({ eemState });
    expect(output.safetySignals).toHaveLength(1);
    expect(output.assessmentText).toMatch(/desorientação temporal/i);
    expect(output.assessmentText).not.toMatch(/sem alterações|delirium/i);
    expect(output.planText).toContain('rede de urgência');
  });

  it('rejeita um resultado rotulado como completo quando as respostas divergem do escore', () => {
    const gad7Result = { ...GAD7_SCALE.calculateResult(completeAnswers(7, 1)), totalScore: 20 };
    expect(generateClinicalSuggestions({ gad7Result }).assessmentText).toBe('');
  });

  it('aceita totais plausíveis de registros legados e ignora instrumentos complementares', () => {
    const legacy = { ...GAD7_SCALE.calculateResult(completeAnswers(7, 1)), answersArray: undefined, isComplete: undefined, completionStatus: undefined };
    expect(generateClinicalSuggestions({ gad7Result: legacy }).assessmentText).toContain('7/21 pontos');
    expect(generateClinicalSuggestions({ gad7Result: { ...legacy, scaleId: 'audit' } }).assessmentText).toBe('');
  });
});
