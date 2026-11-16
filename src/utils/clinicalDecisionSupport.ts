import { EEM_DOMAINS } from '../data/eemData';
import type { EemState, ScaleResult } from '../types';
import { generateHealthEducationSuggestions } from './healthEducationEngine';
import { hasPositivePhq9Item9 } from './scaleValidation';

function completeScore(result: ScaleResult | undefined, scaleId: string, items: number) {
  if (
    result?.scaleId !== scaleId || result.isComplete === false ||
    result.completionStatus === 'incomplete' || result.completionStatus === 'invalid' ||
    !Number.isInteger(result.totalScore) || result.totalScore < 0 || result.totalScore > items * 3
  ) return undefined;

  const answers = result.answersArray;
  if (answers && (
    answers.length !== items ||
    answers.some((value) => !Number.isInteger(value) || value < 0 || value > 3) ||
    answers.reduce((total, value) => total + value, 0) !== result.totalScore
  )) return undefined;

  return result;
}

export function generateClinicalSuggestions({
  phq9Result,
  gad7Result,
  eemState,
}: {
  phq9Result?: ScaleResult;
  gad7Result?: ScaleResult;
  eemState?: EemState;
}) {
  const phq9 = completeScore(phq9Result, 'phq-9', 9);
  const gad7 = completeScore(gad7Result, 'gad-7', 7);
  const assessment: string[] = [];
  const safetySignals: string[] = [];

  if (hasPositivePhq9Item9(phq9Result)) safetySignals.push('PHQ-9 com resposta positiva ao item 9');
  if (Array.isArray(eemState?.pensamentoConteudo) && eemState.pensamentoConteudo.includes('conteudo_ideacao_suicida')) {
    safetySignals.push('Ideação suicida selecionada no conteúdo do pensamento do EEM');
  }
  if (safetySignals.length) assessment.push(`Sinais que requerem avaliação clínica de segurança: ${safetySignals.join(' e ')}.`);

  if (phq9) assessment.push(`PHQ-9${phq9.date ? ` (${phq9.date})` : ''}: ${phq9.totalScore}/27 pontos.`);
  if (gad7) assessment.push(`GAD-7${gad7.date ? ` (${gad7.date})` : ''}: ${gad7.totalScore}/21 pontos.`);

  for (const domain of EEM_DOMAINS) {
    const selected = eemState?.[domain.id as keyof EemState];
    if (!Array.isArray(selected)) continue;
    const labels = domain.options.filter((option) => selected.includes(option.id)).map((option) => option.label);
    const domainLabel = domain.title.replace(/^\d+[a-z]?\.\s*/, '');
    if (labels.length) assessment.push(`${domainLabel}: ${labels.join(', ')}.`);
  }

  const plan: string[] = [];
  if (safetySignals.length) {
    plan.push('Realizar avaliação clínica direta de segurança nesta consulta, incluindo ideação atual, intenção, plano e acesso a meios.');
    plan.push('Definir a proteção e o encaminhamento conforme a avaliação. Acionar a rede de urgência se houver risco iminente.');
  } else if (assessment.length) {
    const scales = [phq9, gad7].filter((result): result is ScaleResult => result !== undefined);
    const { suggestions } = generateHealthEducationSuggestions(scales, eemState);
    const educationIds = ['sug-sono', 'sug-depressao-rotina', 'sug-ansiedade-manejo'];
    for (const suggestion of suggestions) {
      if (educationIds.includes(suggestion.id)) plan.push(`Discutir ${suggestion.title.toLowerCase()}, conforme a avaliação clínica.`);
    }
    plan.push('Revisar a repercussão funcional e pactuar o plano e o prazo de reavaliação com a pessoa.');
  }

  return {
    safetySignals,
    assessmentText: assessment.join('\n'),
    planText: plan.join('\n'),
  };
}
