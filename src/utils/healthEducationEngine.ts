import { ScaleResult, EemState, EducationSuggestion } from '../types';

export interface EducationEngineResult {
  suggestions: EducationSuggestion[];
  hasHighRiskWarning: boolean;
  warningMessage?: string;
}

/**
 * Motor determinístico de Sugestões de Educação em Saúde Contextual.
 * Combina resultados de escalas preenchidas e achados estruturados do EEM.
 */
export function generateHealthEducationSuggestions(
  scaleResults: ScaleResult[] = [],
  eemState?: EemState
): EducationEngineResult {
  // 1. Verificação de Risco de Segurança
  let hasHighRiskWarning = false;
  let warningMessage: string | undefined = undefined;

  const safeScales = Array.isArray(scaleResults) ? scaleResults : [];
  const safeEem: Partial<EemState> = eemState || {};

  const phq9 = safeScales.find((s) => s.scaleId === 'phq-9');
  const gad7 = safeScales.find((s) => s.scaleId === 'gad-7');
  const asrs18 = safeScales.find((s) => s.scaleId === 'asrs-18');
  const snap4 = safeScales.find((s) => s.scaleId === 'snap-iv');
  const hcl32 = safeScales.find((s) => s.scaleId === 'hcl-32');
  const eurohis = safeScales.find((s) => s.scaleId === 'eurohis-qol');
  const whoqol = safeScales.find((s) => s.scaleId === 'whoqol-srpb');
  const cssrs = safeScales.find((s) => s.scaleId === 'cssrs');

  // Checar ideação/risco no PHQ-9 item 9 ou C-SSRS
  const phq9Risk = phq9?.answersSummary?.find((a) => a.questionText?.toLowerCase().includes('morto') || a.questionText?.toLowerCase().includes('ferir'))?.value ?? 0;
  const cssrsRisk = cssrs?.totalScore ?? 0;

  if (phq9Risk > 0 || cssrsRisk > 0 || cssrs?.severityLevel === 'severe' || cssrs?.severityLevel === 'high') {
    hasHighRiskWarning = true;
    warningMessage = 'Avaliação clínica e manejo de segurança têm prioridade antes das orientações educativas.';
  }

  // 2. Análise dos achados do EEM com checagem segura
  const obs = (safeEem.observacoesLivres || '').toLowerCase();
  const humorList = Array.isArray(safeEem.humor) ? safeEem.humor : [];
  const afetoList = Array.isArray(safeEem.afeto) ? safeEem.afeto : [];
  const atitudeList = Array.isArray(safeEem.atitude) ? safeEem.atitude : [];
  const falaList = Array.isArray(safeEem.fala) ? safeEem.fala : [];
  const insightList = Array.isArray(safeEem.insight) ? safeEem.insight : [];
  const julgamentoList = Array.isArray(safeEem.julgamento) ? safeEem.julgamento : [];
  const atencaoMemoriaList = Array.isArray(safeEem.atencaoMemoria) ? safeEem.atencaoMemoria : [];

  const eemHasSleep =
    obs.includes('sono') ||
    obs.includes('insonia') ||
    obs.includes('insônia') ||
    humorList.includes('ansioso') ||
    humorList.includes('distimico') ||
    atitudeList.includes('agita_psicomotora');

  const eemHasPsychomotor =
    atitudeList.includes('agita_psicomotora') ||
    falaList.includes('fala_acelerada') ||
    falaList.includes('fala_lentificada');

  const eemHasMoodDistress =
    humorList.includes('distimico') ||
    humorList.includes('ansioso') ||
    humorList.includes('apatico') ||
    afetoList.includes('embotado') ||
    afetoList.includes('labil');

  const eemHasInsightIssue =
    insightList.includes('insight_parcial') ||
    insightList.includes('insight_ausente');

  const eemHasJudgmentIssue =
    julgamentoList.includes('julgamento_comprometido') ||
    julgamentoList.includes('julgamento_parcial');

  const eemHasAttentionIssue =
    atencaoMemoriaList.includes('atencao_hipoprosexia') ||
    atencaoMemoriaList.includes('atencao_hiperprosexia') ||
    atencaoMemoriaList.includes('memoria_hipomnesia_fixacao');

  // 3. Construção do catálogo de sugestões potenciais
  const candidates: (EducationSuggestion & { score: number })[] = [];

  // SUGGESTION 1: Sono e Higiene Circadiana
  const scaleSleepTrigger = (phq9 && phq9.totalScore >= 5) || (gad7 && gad7.totalScore >= 5);
  if (scaleSleepTrigger || eemHasSleep) {
    const matchedSources: string[] = [];
    if (phq9 && phq9.totalScore >= 5) matchedSources.push(`PHQ-9 (${phq9.totalScore} pts)`);
    if (gad7 && gad7.totalScore >= 5) matchedSources.push(`GAD-7 (${gad7.totalScore} pts)`);
    if (eemHasSleep) matchedSources.push('EEM (Queixa/alteração de sono ou inquietação)');

    const isCombo = (phq9 || gad7) && eemHasSleep;
    const score = isCombo ? 3 : 2;

    candidates.push({
      id: 'sug-sono',
      topic: 'Sono',
      title: 'Higiene do sono e organização da rotina noturna',
      shortDescription:
        'Manter horários regulares para dormir e acordar, desacelerar o uso de telas 1 hora antes de deitar e evitar estimulantes à noite.',
      soapPhrase:
        'Realizadas orientações sobre higiene do sono e regulação do ciclo circadiano, incluindo horários fixos de despertar e redução de estimulantes noturnos.',
      reasonText: isCombo
        ? 'Relacionada ao resultado da escala e a alterações de sono/inquietação no EEM.'
        : matchedSources.some((s) => (s || '').includes('PHQ-9') || (s || '').includes('GAD-7'))
        ? 'Relacionada ao resultado da escala aplicada.'
        : 'Relacionada aos achados de sono do EEM.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: true,
      score,
    });
  }

  // SUGGESTION 2: Sintomas Depressivos e Ativação de Rotina
  const scaleDepressionTrigger = phq9 && phq9.totalScore >= 5;
  if (scaleDepressionTrigger || (eemHasMoodDistress && !humorList.includes('ansioso'))) {
    const matchedSources: string[] = [];
    if (phq9) matchedSources.push(`PHQ-9 (${phq9.totalScore} pts - ${phq9.classification})`);
    if (eemHasMoodDistress) matchedSources.push('EEM (Humor distímico/apático ou afeto alterado)');

    const isCombo = scaleDepressionTrigger && eemHasMoodDistress;
    const score = isCombo ? 3 : 2;

    candidates.push({
      id: 'sug-depressao-rotina',
      topic: 'Depressão',
      title: 'Compreensão de sintomas depressivos e ativação gradual de rotina',
      shortDescription:
        'Estimular a retomada compassiva de atividades em pequenas metas diárias, reconhecendo o impacto do sofrimento emocional na energia.',
      soapPhrase:
        'Orientado sobre compreensão dos sintomas depressivos e pactuação de pequenas metas diárias para ativação gradual da rotina e fortalecimento do autocuidado.',
      reasonText: isCombo
        ? 'Relacionada ao escore do PHQ-9 e ao humor distímico/apático no EEM.'
        : scaleDepressionTrigger
        ? 'Relacionada à pontuação da escala PHQ-9.'
        : 'Relacionada ao estado de humor observado no EEM.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: true,
      score,
    });
  }

  // SUGGESTION 3: Manejo da Ansiedade e Respiração
  const scaleAnxietyTrigger = gad7 && gad7.totalScore >= 5;
  if (scaleAnxietyTrigger || humorList.includes('ansioso') || atitudeList.includes('agita_psicomotora')) {
    const matchedSources: string[] = [];
    if (gad7) matchedSources.push(`GAD-7 (${gad7.totalScore} pts - ${gad7.classification})`);
    if (humorList.includes('ansioso')) matchedSources.push('EEM (Humor ansioso)');
    if (atitudeList.includes('agita_psicomotora')) matchedSources.push('EEM (Agitação psicomotora)');

    const isCombo = scaleAnxietyTrigger && (humorList.includes('ansioso') || atitudeList.includes('agita_psicomotora'));
    const score = isCombo ? 3 : 2;

    candidates.push({
      id: 'sug-ansiedade-manejo',
      topic: 'Ansiedade',
      title: 'Estratégias de desaceleração e controle da ansiedade',
      shortDescription:
        'Prática de respiração diafragmática pausada, identificação de gatilhos ansiogênicos e técnicas simples de aterramento no presente.',
      soapPhrase:
        'Orientações prestadas sobre estratégias simples para manejo da ansiedade, incluindo técnicas de respiração pausada e desaceleração física.',
      reasonText: isCombo
        ? 'Relacionada ao resultado do GAD-7 e ao humor ansioso/agitação no EEM.'
        : scaleAnxietyTrigger
        ? 'Relacionada ao escore da escala GAD-7.'
        : 'Relacionada ao humor ansioso no EEM.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: true,
      score,
    });
  }

  // SUGGESTION 4: Atividade Física Regular
  if (scaleDepressionTrigger || scaleAnxietyTrigger || eemHasPsychomotor) {
    const matchedSources: string[] = [];
    if (phq9 && phq9.totalScore >= 5) matchedSources.push(`PHQ-9 (${phq9.totalScore} pts)`);
    if (gad7 && gad7.totalScore >= 5) matchedSources.push(`GAD-7 (${gad7.totalScore} pts)`);
    if (eemHasPsychomotor) matchedSources.push('EEM (Alteração da psicomotricidade/fala)');

    const isCombo = (scaleDepressionTrigger || scaleAnxietyTrigger) && eemHasPsychomotor;
    const score = isCombo ? 3 : 2;

    candidates.push({
      id: 'sug-atividade-fisica',
      topic: 'Atividade Física',
      title: 'Atividade física leve a moderada na rotina',
      shortDescription:
        'Caminhadas curtas ao ar livre ou exercícios aeróbicos leves adaptados à rotina para regulação natural do humor e tensão.',
      soapPhrase:
        'Incentivada a prática regular de atividade física leve a moderada como aliada no manejo dos sintomas e regulação do humor.',
      reasonText: isCombo
        ? 'Relacionada às escalas de sintomas e alterações psicomotoras registradas no EEM.'
        : 'Relacionada ao plano de cuidados da Atenção Primária.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: false,
      score,
    });
  }

  // SUGGESTION 5: TDAH e Organização de Foco
  const scaleAdhdTrigger = (asrs18 && asrs18.totalScore >= 4) || (snap4 && snap4.totalScore >= 12);
  if (scaleAdhdTrigger || eemHasAttentionIssue) {
    const matchedSources: string[] = [];
    if (asrs18) matchedSources.push(`ASRS-18 (${asrs18.totalScore} pts)`);
    if (snap4) matchedSources.push(`SNAP-IV (${snap4.totalScore} pts)`);
    if (eemHasAttentionIssue) matchedSources.push('EEM (Atenção/concentração alterada)');

    const isCombo = scaleAdhdTrigger && eemHasAttentionIssue;
    const score = isCombo ? 3 : 2;

    candidates.push({
      id: 'sug-tdah-foco',
      topic: 'TDAH',
      title: 'Estruturação do ambiente e organização do foco',
      shortDescription:
        'Fragmentação de obrigações em etapas pequenas, checklists visuais e pausas estratégicas durante tarefas exigentes.',
      soapPhrase:
        'Pactuadas estratégias organizacionais de apoio ao foco, incluindo fragmentação de tarefas em pequenas etapas e uso de rotinas visuais.',
      reasonText: isCombo
        ? 'Relacionada ao rastreio de TDAH e à desatenção registrada no EEM.'
        : scaleAdhdTrigger
        ? 'Relacionada ao resultado do rastreio de TDAH.'
        : 'Relacionada às queixas de atenção do EEM.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: false,
      score,
    });
  }

  // SUGGESTION 6: Oscilações do Humor e Acompanhamento Longitudinal (HCL-32 / Humor alterado)
  const scaleHclTrigger = hcl32 && hcl32.totalScore >= 12;
  const eemEuphoria = humorList.includes('euforico') || humorList.includes('disforico') || afetoList.includes('labil');

  if (scaleHclTrigger || eemEuphoria) {
    const matchedSources: string[] = [];
    if (hcl32) matchedSources.push(`HCL-32 (${hcl32.totalScore} pts)`);
    if (eemEuphoria) matchedSources.push('EEM (Humor eufórico/disfórico ou afeto lábil)');

    const isCombo = scaleHclTrigger && eemEuphoria;

    candidates.push({
      id: 'sug-oscilacao-humor',
      topic: 'Humor',
      title: 'Oscilações do humor e acompanhamento longitudinal',
      shortDescription:
        'Conversar sobre variações de energia, sono, comportamento e humor ao longo do tempo para promover o autocuidado continuado.',
      soapPhrase:
        'Realizadas orientações sobre a percepção continuada das variações de energia, padrão de sono e oscilações do humor no acompanhamento longitudinal.',
      reasonText: isCombo
        ? 'Relacionada ao resultado do HCL-32 e a alterações de humor registradas no EEM.'
        : scaleHclTrigger
        ? 'Relacionada ao inventário HCL-32.'
        : 'Relacionada ao estado de humor e afeto no EEM.',
      matchedSources,
      isComboMatch: !!isCombo,
      selected: false,
      score: isCombo ? 3 : 2,
    });
  }

  // SUGGESTION 7: Compreensão do Quadro e Adesão (Insight)
  if (eemHasInsightIssue || eemHasJudgmentIssue) {
    const matchedSources: string[] = ['EEM (Insight parcial/ausente ou juízo crítico)'];
    candidates.push({
      id: 'sug-insight-adesao',
      topic: 'Adesão & Insight',
      title: 'Compreensão do quadro e adesão ao acompanhamento',
      shortDescription:
        'Esclarecimento empático sobre os sintomas vivenciados, escuta das dúvidas da pessoa e aliança terapêutica com a equipe de saúde.',
      soapPhrase:
        'Orientado de forma empática sobre a natureza dos sintomas vivenciados e fortalecida a pactuação para o acompanhamento continuado na UBS.',
      reasonText: 'Relacionada ao achado de insight e juízo crítico registrado no EEM.',
      matchedSources,
      isComboMatch: false,
      selected: false,
      score: 2,
    });
  }

  // SUGGESTION 8: Qualidade de Vida (EUROHIS-QOL)
  if (eurohis || safeScales.length > 0) {
    const matchedSources: string[] = eurohis
      ? [`EUROHIS-QOL (${eurohis.totalScore} pts)`]
      : ['Acompanhamento de rotina na APS'];

    candidates.push({
      id: 'sug-qualidade-vida',
      topic: 'Qualidade de Vida',
      title: 'Qualidade de vida e áreas prioritárias para o cuidado',
      shortDescription:
        'Identificar áreas do cotidiano que geram satisfação ou sobrecarga para pactuar pequenas mudanças no estilo de vida.',
      soapPhrase:
        'Conversado sobre percepção de qualidade de vida, identificando áreas prioritárias de autocuidado e fortalecimento de hábitos saudáveis.',
      reasonText: eurohis
        ? 'Relacionada à avaliação do índice EUROHIS-QOL.'
        : 'Tema educativo de promoção da saúde na APS.',
      matchedSources,
      isComboMatch: false,
      selected: false,
      score: eurohis ? 2 : 1,
    });
  }

  // SUGGESTION 9: Espiritualidade e Recursos Pessoais (WHOQOL-SRPB)
  if (whoqol) {
    const matchedSources: string[] = [`WHOQOL-SRPB (${whoqol.totalScore} pts)`];
    candidates.push({
      id: 'sug-espiritualidade',
      topic: 'Recursos Pessoais',
      title: 'Espiritualidade, crenças e recursos pessoais de enfrentamento',
      shortDescription:
        'Abordagem neutra e respeitosa sobre fontes pessoais de força, fé, sentido de vida e redes de apoio comunitário.',
      soapPhrase:
        'Abordados de forma opcional e respeitosa os recursos pessoais e fontes de apoio comunitário e espiritual como fatores de suporte emocional.',
      reasonText: 'Relacionada ao preenchimento do módulo WHOQOL-SRPB.',
      matchedSources,
      isComboMatch: false,
      selected: false,
      score: 2,
    });
  }

  // SUGGESTION 10: Sinais de Alerta e Reavaliação na UBS (Geral / Sempre pertinente)
  candidates.push({
    id: 'sug-sinais-alerta',
    topic: 'Segurança & Reavaliação',
    title: 'Sinais de alerta e canais de reavaliação na UBS',
    shortDescription:
      'Orientação clara sobre quando buscar retorno antecipado na Unidade Básica de Saúde em caso de piora dos sintomas.',
    soapPhrase:
      'Pactuados sinais de alerta para reavaliação precoce e reforçados os canais de contato com a equipe de Saúde da Família.',
    reasonText: 'Recomendação essencial de segurança no plano de cuidados da APS.',
    matchedSources: ['Protocolo de Segurança APS'],
    isComboMatch: false,
    selected: true,
    score: 1,
  });

  // 4. Ordenação e filtragem para garantir no máximo 3 a 5 sugestões prioritárias
  candidates.sort((a, b) => {
    if (a.isComboMatch !== b.isComboMatch) {
      return a.isComboMatch ? -1 : 1;
    }
    return b.score - a.score;
  });

  // Remover duplicatas por id
  const uniqueSuggestions: EducationSuggestion[] = [];
  const seenIds = new Set<string>();

  for (const item of candidates) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      const { score, ...suggestion } = item;
      uniqueSuggestions.push(suggestion);
    }
  }

  // Limitar entre 3 e 5 sugestões no máximo
  const maxLimit = Math.min(Math.max(uniqueSuggestions.length, 3), 5);
  const finalSuggestions = uniqueSuggestions.slice(0, maxLimit);

  // Garantir que pelo menos 2 e no máximo 3 venham pré-selecionadas para facilidade do médico
  finalSuggestions.forEach((s, idx) => {
    if (idx < 3) {
      s.selected = true;
    } else {
      s.selected = false;
    }
  });

  return {
    suggestions: finalSuggestions,
    hasHighRiskWarning,
    warningMessage,
  };
}

/**
 * Formata as orientações selecionadas e editadas pelo médico em uma frase clínica fluida e natural para o Plano (P) do SOAP.
 */
export function formatConfirmedEducationToPlan(confirmedSuggestions: EducationSuggestion[]): string {
  const selected = confirmedSuggestions.filter((s) => s.selected);
  if (selected.length === 0) return '';

  // Se o médico editou manualmente o texto das frases do SOAP, usamos as frases editadas
  const phrases = selected.map((s) => s.soapPhrase.trim()).filter(Boolean);

  if (phrases.length === 1) {
    return phrases[0];
  }

  // Agrupamento harmônico e sem duplicações para formar um parágrafo clínico natural
  return phrases.join(' ');
}
