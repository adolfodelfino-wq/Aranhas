import { EEM_DOMAINS } from '../data/eemData';
import { EemState } from '../types';

/**
 * Generates structured, clinical Exame do Estado Mental (EEM) narrative
 * formatted in clean sequential lines with each psychopathological dimension
 * placed directly one below the other for immediate clinical scanning and SOAP Objective entry.
 */
export const generateEemSummary = (eem: EemState): string => {
  const parts: string[] = [];

  const getLabels = (domainId: string, list?: string[]) => {
    const domain = EEM_DOMAINS.find((d) => d.id === domainId);
    if (!domain || !Array.isArray(list)) return [];
    return list
      .map((id) => domain.options.find((o) => o.id === id)?.label)
      .filter(Boolean) as string[];
  };

  const aparencia = getLabels('aparencia', eem.aparencia);
  if (aparencia.length > 0) {
    parts.push(`Aparência e Higiene: ${aparencia.join(', ').toLowerCase()}`);
  }

  const atitude = getLabels('atitude', eem.atitude);
  if (atitude.length > 0) {
    parts.push(`Atitude: ${atitude.join(', ').toLowerCase()}`);
  }

  const fala = getLabels('fala', eem.fala);
  if (fala.length > 0) {
    parts.push(`Fala e Linguagem: ${fala.join(', ').toLowerCase()}`);
  }

  const humor = getLabels('humor', eem.humor);
  if (humor.length > 0) {
    parts.push(`Humor: ${humor.join(', ').toLowerCase()}`);
  }

  const afeto = getLabels('afeto', eem.afeto);
  if (afeto.length > 0) {
    parts.push(`Afeto: ${afeto.join(', ').toLowerCase()}`);
  }

  const pCurso = getLabels('pensamentoCurso', eem.pensamentoCurso);
  const pForma = getLabels('pensamentoForma', eem.pensamentoForma);
  const pConteudo = getLabels('pensamentoConteudo', eem.pensamentoConteudo);
  const pensParts = [...pCurso, ...pForma, ...pConteudo];
  if (pensParts.length > 0) {
    parts.push(`Pensamento: ${pensParts.join(', ').toLowerCase()}`);
  }

  const senso = getLabels('sensopercepcao', eem.sensopercepcao);
  if (senso.length > 0) {
    parts.push(`Sensopercepção: ${senso.join(', ').toLowerCase()}`);
  }

  const orient = getLabels('orientacao', eem.orientacao);
  if (orient.length > 0) {
    parts.push(`Orientação (Auto e Alopsíquica): ${orient.join(', ').toLowerCase()}`);
  }

  const atencaoMem = getLabels('atencaoMemoria', eem.atencaoMemoria);
  if (atencaoMem.length > 0) {
    parts.push(`Atenção, Concentração e Memória: ${atencaoMem.join(', ').toLowerCase()}`);
  }

  const insight = getLabels('insight', eem.insight);
  if (insight.length > 0) {
    parts.push(`Insight / Consciência de Mórbida: ${insight.join(', ').toLowerCase()}`);
  }

  const julgamento = getLabels('julgamento', eem.julgamento);
  if (julgamento.length > 0) {
    parts.push(`Julgamento e Crítica da Realidade: ${julgamento.join(', ').toLowerCase()}`);
  }

  if (eem.observacoesLivres && eem.observacoesLivres.trim()) {
    parts.push(`Observações complementares: ${eem.observacoesLivres.trim()}`);
  }

  if (parts.length === 0) {
    return 'Exame do Estado Mental (EEM):\nNenhum parâmetro selecionado.';
  }

  const formattedLines = parts.map((line) => (line.endsWith('.') ? line : `${line}.`));
  return `Exame do Estado Mental (EEM):\n${formattedLines.join('\n')}`;
};

// Clinical alias for compatibility
export const generateEemNarrative = generateEemSummary;
