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
  const aparenciaOutros = eem.aparenciaOutros?.trim();
  if (aparencia.length > 0 || aparenciaOutros) {
    const descriptors = aparencia.join(', ').toLowerCase();
    parts.push(`Aparência e Higiene: ${[descriptors, aparenciaOutros].filter(Boolean).join('; ')}`);
  }

  const atitude = getLabels('atitude', eem.atitude);
  const atitudeOutros = eem.atitudeOutros?.trim();
  if (atitude.length > 0 || atitudeOutros) {
    const descriptors = atitude.join(', ').toLowerCase();
    parts.push(`Atitude: ${[descriptors, atitudeOutros].filter(Boolean).join('; ')}`);
  }

  const fala = getLabels('fala', eem.fala);
  const falaOutros = eem.falaOutros?.trim();
  if (fala.length > 0 || falaOutros) {
    const descriptors = fala.join(', ').toLowerCase();
    parts.push(`Fala e Linguagem: ${[descriptors, falaOutros].filter(Boolean).join('; ')}`);
  }

  const humor = getLabels('humor', eem.humor);
  const humorOutros = eem.humorOutros?.trim();
  if (humor.length > 0 || humorOutros) {
    const descriptors = humor.join(', ').toLowerCase();
    parts.push(`Humor: ${[descriptors, humorOutros].filter(Boolean).join('; ')}`);
  }

  const afeto = getLabels('afeto', eem.afeto);
  const afetoOutros = eem.afetoOutros?.trim();
  if (afeto.length > 0 || afetoOutros) {
    const descriptors = afeto.join(', ').toLowerCase();
    parts.push(`Afeto: ${[descriptors, afetoOutros].filter(Boolean).join('; ')}`);
  }

  const pCurso = getLabels('pensamentoCurso', eem.pensamentoCurso);
  const pForma = getLabels('pensamentoForma', eem.pensamentoForma);
  const pConteudo = getLabels('pensamentoConteudo', eem.pensamentoConteudo);
  const pensParts = [...pCurso, ...pForma, ...pConteudo];
  const pensamentoOutros = eem.pensamentoOutros?.trim();
  if (pensParts.length > 0 || pensamentoOutros) {
    const descriptors = pensParts.join(', ').toLowerCase();
    parts.push(`Pensamento: ${[descriptors, pensamentoOutros].filter(Boolean).join('; ')}`);
  }

  const senso = getLabels('sensopercepcao', eem.sensopercepcao);
  const sensopercepcaoOutros = eem.sensopercepcaoOutros?.trim();
  if (senso.length > 0 || sensopercepcaoOutros) {
    const descriptors = senso.join(', ').toLowerCase();
    parts.push(`Sensopercepção: ${[descriptors, sensopercepcaoOutros].filter(Boolean).join('; ')}`);
  }

  const orient = getLabels('orientacao', eem.orientacao);
  const orientacaoOutros = eem.orientacaoOutros?.trim();
  if (orient.length > 0 || orientacaoOutros) {
    const descriptors = orient.join(', ').toLowerCase();
    parts.push(`Orientação (Auto e Alopsíquica): ${[descriptors, orientacaoOutros].filter(Boolean).join('; ')}`);
  }

  const atencaoMem = getLabels('atencaoMemoria', eem.atencaoMemoria);
  const atencaoMemoriaOutros = eem.atencaoMemoriaOutros?.trim();
  if (atencaoMem.length > 0 || atencaoMemoriaOutros) {
    const descriptors = atencaoMem.join(', ').toLowerCase();
    parts.push(`Atenção, Concentração e Memória: ${[descriptors, atencaoMemoriaOutros].filter(Boolean).join('; ')}`);
  }

  const insight = getLabels('insight', eem.insight);
  const insightOutros = eem.insightOutros?.trim();
  if (insight.length > 0 || insightOutros) {
    const descriptors = insight.join(', ').toLowerCase();
    parts.push(`Insight / Consciência de morbidade: ${[descriptors, insightOutros].filter(Boolean).join('; ')}`);
  }

  const julgamento = getLabels('julgamento', eem.julgamento);
  const julgamentoOutros = eem.julgamentoOutros?.trim();
  if (julgamento.length > 0 || julgamentoOutros) {
    const descriptors = julgamento.join(', ').toLowerCase();
    parts.push(`Julgamento e Crítica da Realidade: ${[descriptors, julgamentoOutros].filter(Boolean).join('; ')}`);
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

/**
 * Removes duplicate or repeated EEM headers (e.g. uppercase header stacked immediately above mixed-case header)
 */
export const sanitizeDuplicateEemHeader = (text: string): string => {
  if (!text) return text;
  return text.replace(
    /(?:(?:EXAME DO ESTADO MENTAL|Exame do Estado Mental)\s*\(EEM\):?\s*\n+)+(?=(?:EXAME DO ESTADO MENTAL|Exame do Estado Mental)\s*\(EEM\):?)/gi,
    ''
  );
};

/**
 * Seamlessly integrates or replaces the EEM block within SOAP Objective without duplicating headers.
 */
export const formatEemIntoObjective = (currentObjective: string, eemNarrative: string): string => {
  const trimmed = (currentObjective || '').trim();
  if (!trimmed) return eemNarrative;

  const eemBlockRegex = /(?:EXAME DO ESTADO MENTAL \(EEM\):?\s*\n*)?(?:Exame do Estado Mental \(EEM\):?)(?:[^\n\r]|\n(?!\n))*/i;
  const eemUpperRegex = /(?:EXAME DO ESTADO MENTAL \(EEM\):?)(?:[^\n\r]|\n(?!\n))*/i;

  let result = '';
  if (eemBlockRegex.test(trimmed)) {
    result = trimmed.replace(eemBlockRegex, eemNarrative);
  } else if (eemUpperRegex.test(trimmed)) {
    result = trimmed.replace(eemUpperRegex, eemNarrative);
  } else {
    result = `${trimmed}\n\n${eemNarrative}`;
  }

  return sanitizeDuplicateEemHeader(result);
};
