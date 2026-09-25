import { ScaleDefinition, ScaleResult } from '../types';

export const AUDITC_SCALE: ScaleDefinition = {
  id: 'audit-c',
  title: 'AUDIT-C (Rastreio Rápido do Padrão de Consumo de Álcool)',
  acronym: 'AUDIT-C',
  targetGroup: 'Adultos na APS para rastreamento breve de consumo de risco',
  description: 'Versão abreviada de 3 itens do AUDIT focada em consumo e padrão de risco. Rastreia uso arriscado ou dependência em menos de 1 minuto.',
  shortInstruction: 'Avalie o padrão de ingestão alcoólica nos últimos 12 meses.',
  instructions: 'Selecione a alternativa que melhor descreve o hábito de consumo de bebidas alcoólicas no último ano.',
  referenceCitation: 'Bush K, Kivlahan DR, McDonell MB, Fihn SD, Bradley KA. The AUDIT alcohol consumption questions (AUDIT-C). Arch Intern Med. 1998; 158(16):1789-95.',
  validationInfo: 'Sensibilidade de 86% e especificidade de 72% para corte ≥ 4 em homens e ≥ 3 em mulheres.',
  cutoffInfo: 'Homens: Corte ≥ 4 (Consumo de risco) | Mulheres: Corte ≥ 3 (Consumo de risco)',
  estimatedMinutes: 1,
  questions: [
    {
      id: 'q1',
      text: '1. Com que frequência você consome bebidas alcoólicas?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: '1 vez por mês ou menos', value: 1 },
        { label: '2 a 4 vezes por mês', value: 2 },
        { label: '2 a 3 vezes por semana', value: 3 },
        { label: '4 ou mais vezes por semana', value: 4 },
      ],
    },
    {
      id: 'q2',
      text: '2. Quantas doses de bebida alcoólica você consome em um dia típico em que bebe?',
      options: [
        { label: '1 ou 2 doses', value: 0 },
        { label: '3 ou 4 doses', value: 1 },
        { label: '5 ou 6 doses', value: 2 },
        { label: '7 a 9 doses', value: 3 },
        { label: '10 ou mais doses', value: 4 },
      ],
    },
    {
      id: 'q3',
      text: '3. Com que frequência você consome 6 ou mais doses de bebida alcoólica em uma única ocasião (binge drinking)?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de 1 vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
    },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isHighRisk = totalScore >= 4;
    return {
      scaleId: 'audit-c',
      scaleTitle: 'AUDIT-C',
      totalScore,
      maxScore: 12,
      classification: isHighRisk ? 'AUDIT-C Positivo (Padrão de consumo de risco / nocivo)' : 'AUDIT-C Negativo (Baixo risco / Consumo moderado)',
      severityLevel: isHighRisk ? 'moderate' : 'low',
      interpretation: `Escore de ${totalScore}/12 pontos no AUDIT-C. ${isHighRisk ? 'Indica padrão de consumo de risco. Recomenda-se aplicar o AUDIT completo de 10 itens para avaliação detalhada.' : 'Consumo compatível com baixo risco.'}`,
      recommendations: isHighRisk
        ? ['Realizar intervenção breve (IB) baseada em entrevista motivacional', 'Aplicar AUDIT completo de 10 itens para mapear dependência', 'Pactuar redução do padrão de consumo']
        : ['Reforçar orientações preventivas de saúde'],
      soapText: `AUDIT-C: ${totalScore}/12 pts (${isHighRisk ? 'Positivo / Consumo de risco' : 'Negativo / Baixo risco'}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Intervenção Breve (IB)', description: 'Fornecer feedback sobre o escore e limites recomendados.', badge: 'APS / MFC', badgeType: 'neutral' },
    { title: 'Avaliação Integral com AUDIT-10', description: 'Em caso de rastreio positivo, aprofundar a avaliação.', badge: 'Rastreio Positivo', badgeType: 'warning' },
  ],
};

export const CAGE_SCALE: ScaleDefinition = {
  id: 'cage',
  title: 'CAGE (Questionário de Rastreamento de Suspeita de Dependência Alcoólica)',
  acronym: 'CAGE',
  targetGroup: 'Adultos na APS com suspeita de problemas relacionados ao álcool',
  description: 'Instrumento clássico de 4 perguntas mnemônicas para rastreio de problemas e dependência de álcool.',
  shortInstruction: 'Responda Sim (1) ou Não (0) para cada uma das 4 questões.',
  instructions: 'Selecione Sim ou Não para cada pergunta.',
  referenceCitation: 'Ewing JA. Detecting alcoholism. The CAGE questionnaire. JAMA. 1984; 252(14):1905-7. Validação brasileira: Masur J, Monteiro MG. Rev Assoc Med Bras. 1983.',
  validationInfo: 'Corte ≥ 2 respostas afirmativas sugere fortemente problemas relacionados ao uso de álcool.',
  cutoffInfo: '0-1: Baixa probabilidade | ≥ 2: Suspeita de uso problemático / dependência de álcool',
  estimatedMinutes: 1,
  questions: [
    {
      id: 'q1',
      text: '1. (Cut-down) Você já sentiu que deveria diminuir a quantidade de bebida?',
      options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }],
    },
    {
      id: 'q2',
      text: '2. (Annoyed) As pessoas já o(a) irritaram criticando seu modo de beber?',
      options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }],
    },
    {
      id: 'q3',
      text: '3. (Guilty) Você já se sentiu culpado(a) ou chateado(a) consigo mesmo(a) pela maneira como bebe?',
      options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }],
    },
    {
      id: 'q4',
      text: '4. (Eye-opener) Você já teve que beber pela manhã para acalmar os nervos ou se livrar de uma ressaca?',
      options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }],
    },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isPositive = totalScore >= 2;
    return {
      scaleId: 'cage',
      scaleTitle: 'CAGE',
      totalScore,
      maxScore: 4,
      classification: isPositive ? 'CAGE Positivo (Suspeita de transtorno por uso de álcool)' : 'CAGE Negativo (Baixa probabilidade)',
      severityLevel: isPositive ? 'high' : 'low',
      interpretation: `Escore de ${totalScore}/4 respostas afirmativas no CAGE. ${isPositive ? 'Rastreamento positivo (≥ 2 itens). Exige anamnese clínica direta sobre dependência, tolerância e abstinência.' : 'Rastreio negativo.'}`,
      recommendations: isPositive
        ? ['Avaliação clínica direta sobre critérios diagnósticos de dependência', 'Investigar sintomas de abstinência e complicações clínicas/sociais', 'Abordagem motivacional e projeto terapêutico singular']
        : ['Orientações preventivas habituais'],
      soapText: `CAGE: ${totalScore}/4 respostas afirmativas (${isPositive ? 'Positivo ≥ 2' : 'Negativo'}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Anamnese Clínica Detalhada', description: 'Investigar tempo de uso, tolerância e sintomas de abstinência matinal.', badge: 'Clínica', badgeType: 'warning' },
  ],
};

export const EPDS_SCALE: ScaleDefinition = {
  id: 'epds',
  title: 'EPDS (Escala de Depressão Pós-Parto de Edimburgo)',
  acronym: 'EPDS',
  targetGroup: 'Gestantes e puérperas na Atenção Primária à Saúde',
  description: 'Instrumento autoaplicável de 10 itens desenvolvido especificamente para rastreamento de sintomas depressivos no ciclo gravídico-puerperal.',
  shortInstruction: 'Avalie como você tem se sentido nos últimos 7 dias.',
  instructions: 'Por favor, escolha a resposta que melhor descreve como você tem se sentido nos últimos 7 dias, não apenas hoje.',
  referenceCitation: 'Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression. Development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry. 1987; 150:782-6. Validação brasileira: Santos IS et al. Cad Saude Publica. 2007.',
  validationInfo: 'Validada no Brasil na APS. Ponto de corte ≥ 10 para rastreamento (Sensibilidade 82,6%, Especificidade 88,9%).',
  cutoffInfo: '0-9: Sintomas improváveis | 10-11: Possibilidade de depressão | ≥ 12: Forte suspeita de depressão pós-parto | Item 10 positivo: Alerta de autoagressão',
  estimatedMinutes: 3,
  questions: [
    {
      id: 'q1',
      text: '1. Eu tenho sido capaz de rir e ver o lado engraçado das coisas:',
      options: [
        { label: 'Tanto quanto antes', value: 0 },
        { label: 'Não tanto quanto antes', value: 1 },
        { label: 'Definitivamente menos', value: 2 },
        { label: 'De jeito nenhum', value: 3 },
      ],
    },
    {
      id: 'q2',
      text: '2. Eu tenho olhado o futuro com entusiasmo e esperança:',
      options: [
        { label: 'Tanto quanto antes', value: 0 },
        { label: 'Um pouco menos do que antes', value: 1 },
        { label: 'Definitivamente menos', value: 2 },
        { label: 'Quase nunca', value: 3 },
      ],
    },
    {
      id: 'q3',
      text: '3. Eu tenho me culpado sem necessidade quando as coisas dão errado:',
      options: [
        { label: 'Não, nunca', value: 0 },
        { label: 'Poucas vezes', value: 1 },
        { label: 'Sim, algumas vezes', value: 2 },
        { label: 'Sim, a maior parte do tempo', value: 3 },
      ],
    },
    {
      id: 'q4',
      text: '4. Eu tenho ficado ansiosa ou preocupada sem motivo aparente:',
      options: [
        { label: 'Não, de jeito nenhum', value: 0 },
        { label: 'Quase nunca', value: 1 },
        { label: 'Sim, algumas vezes', value: 2 },
        { label: 'Sim, muito frequentemente', value: 3 },
      ],
    },
    {
      id: 'q5',
      text: '5. Eu tenho me sentido com medo ou em pânico sem motivo:',
      options: [
        { label: 'Não, de jeito nenhum', value: 0 },
        { label: 'Quase nunca', value: 1 },
        { label: 'Sim, algumas vezes', value: 2 },
        { label: 'Sim, muito frequentemente', value: 3 },
      ],
    },
    {
      id: 'q6',
      text: '6. Eu tenho me sentido sobrecarregada, sentindo que não dou conta de tudo:',
      options: [
        { label: 'Não, tenho lidado bem', value: 0 },
        { label: 'A maior parte do tempo tenho lidado bem', value: 1 },
        { label: 'Sim, algumas vezes não tenho conseguido lidar', value: 2 },
        { label: 'Sim, na maior parte do tempo não consigo lidar', value: 3 },
      ],
    },
    {
      id: 'q7',
      text: '7. Eu tenho me sentido tão infeliz que tenho tido dificuldade para dormir:',
      options: [
        { label: 'Não, de jeito nenhum', value: 0 },
        { label: 'Não com frequência', value: 1 },
        { label: 'Sim, algumas vezes', value: 2 },
        { label: 'Sim, a maior parte do tempo', value: 3 },
      ],
    },
    {
      id: 'q8',
      text: '8. Eu tenho me sentido triste ou desanimada:',
      options: [
        { label: 'Não, de jeito nenhum', value: 0 },
        { label: 'Poucas vezes', value: 1 },
        { label: 'Sim, muitas vezes', value: 2 },
        { label: 'Sim, a maior parte do tempo', value: 3 },
      ],
    },
    {
      id: 'q9',
      text: '9. Eu tenho me sentido tão infeliz que tenho chorado:',
      options: [
        { label: 'Não, nunca', value: 0 },
        { label: 'Só de vez em quando', value: 1 },
        { label: 'Sim, com frequência', value: 2 },
        { label: 'Sim, a maior parte do tempo', value: 3 },
      ],
    },
    {
      id: 'q10',
      text: '10. O pensamento de fazer mal a mim mesma ocorreu-me:',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Dificilmente', value: 1 },
        { label: 'Algumas vezes', value: 2 },
        { label: 'Sim, muitas vezes', value: 3 },
      ],
    },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const item10 = answers['q10'] || 0;
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore < 10) {
      classification = 'Sintomas improváveis de depressão puerperal';
      severityLevel = 'low';
    } else if (totalScore < 12) {
      classification = 'Possibilidade de depressão puerperal (Reavaliação indicada)';
      severityLevel = 'moderate';
    } else {
      classification = 'Forte suspeita de episódio depressivo puerperal';
      severityLevel = 'high';
    }

    if (item10 > 0) {
      classification += ' | ⚠️ ALERTA: Resposta positiva para ideação de autoagressão (Item 10)';
      severityLevel = 'severe';
    }

    return {
      scaleId: 'epds',
      scaleTitle: 'EPDS',
      totalScore,
      maxScore: 30,
      classification,
      severityLevel,
      interpretation: `Escore de ${totalScore}/30 pontos na EPDS. ${item10 > 0 ? 'ATENÇÃO: Resposta positiva no item 10 referente a autoagressão requer avaliação médica presencial imediata.' : ''}`,
      recommendations: [
        totalScore >= 10 ? 'Avaliação clínica médica aprofundada da puérpera' : 'Reforço do suporte de puericultura e acolhimento na APS',
        'Avaliar vínculo mãe-bebê, rede de apoio familiar e amamentação',
        ...(item10 > 0 ? ['Realizar avaliação direta de risco de suicídio / segurança'] : []),
      ],
      soapText: `EPDS: ${totalScore}/30 pts (${classification}) | Item 10 (Autoagressão): ${item10} pts | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Apoio ao Binômio Mãe-Bebê', description: 'Investigar sobrecarga de cuidados, privação de sono e apoio do parceiro/família.', badge: 'Puerpério', badgeType: 'neutral' },
  ],
};

export const ISI_SCALE: ScaleDefinition = {
  id: 'isi',
  title: 'ISI (Índice de Gravidade da Insônia - Morin)',
  acronym: 'ISI',
  targetGroup: 'Adultos na APS com queixas de insônia inicial, intermediária ou terminal',
  description: 'Instrumento de 7 itens que avalia a natureza, gravidade e impacto diurno da insônia nas últimas duas semanas.',
  shortInstruction: 'Avalie a gravidade dos seus problemas com sono nas últimas 2 semanas.',
  instructions: 'Para cada item abaixo, selecione a resposta que melhor descreve o seu sono nas últimas 2 semanas.',
  referenceCitation: 'Bastien CH, Vallières A, Morin CM. Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Med. 2001; 2(4):297-307. Validação brasileira: Castro LS et al. 2009.',
  validationInfo: 'Sensibilidade de 86,1% e especificidade de 87,7% para detecção de insônia clínica (corte ≥ 15).',
  cutoffInfo: '0-7: Ausência de insônia clinicamente significativa | 8-14: Insônia subclínica/leve | 15-21: Insônia clínica moderada | 22-28: Insônia clínica grave',
  estimatedMinutes: 2,
  questions: [
    {
      id: 'q1',
      text: '1. Dificuldade para pegar no sono (adormecer):',
      options: [
        { label: 'Nenhuma', value: 0 },
        { label: 'Leve', value: 1 },
        { label: 'Moderada', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Muito grave', value: 4 },
      ],
    },
    {
      id: 'q2',
      text: '2. Dificuldade para permanecer dormindo (despertares no meio da noite):',
      options: [
        { label: 'Nenhuma', value: 0 },
        { label: 'Leve', value: 1 },
        { label: 'Moderada', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Muito grave', value: 4 },
      ],
    },
    {
      id: 'q3',
      text: '3. Problemas com acordar muito cedo pela manhã (despertar precoce):',
      options: [
        { label: 'Nenhuma', value: 0 },
        { label: 'Leve', value: 1 },
        { label: 'Moderada', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Muito grave', value: 4 },
      ],
    },
    {
      id: 'q4',
      text: '4. Quão SATISFEITO(A) ou insatisfeito(a) você está com seu padrão de sono atual?',
      options: [
        { label: 'Muito satisfeito', value: 0 },
        { label: 'Satisfeito', value: 1 },
        { label: 'Indiferente', value: 2 },
        { label: 'Insatisfeito', value: 3 },
        { label: 'Muito insatisfeito', value: 4 },
      ],
    },
    {
      id: 'q5',
      text: '5. O quanto você considera que seu problema de sono INTERFERE no seu funcionamento diário (fadiga, concentração, humor)?',
      options: [
        { label: 'Nada', value: 0 },
        { label: 'Um pouco', value: 1 },
        { label: 'De forma moderada', value: 2 },
        { label: 'Muito', value: 3 },
        { label: 'Extremamente', value: 4 },
      ],
    },
    {
      id: 'q6',
      text: '6. Quão EVIDENTE para os outros você acha que é o prejuízo na qualidade de vida causado pelo seu problema de sono?',
      options: [
        { label: 'Nada perceptível', value: 0 },
        { label: 'Um pouco perceptível', value: 1 },
        { label: 'De forma moderada', value: 2 },
        { label: 'Muito perceptível', value: 3 },
        { label: 'Extremamente perceptível', value: 4 },
      ],
    },
    {
      id: 'q7',
      text: '7. Quão PREOCUPADO(A) ou angustiado(a) você está em relação ao seu problema de sono atual?',
      options: [
        { label: 'Nada preocupado', value: 0 },
        { label: 'Um pouco', value: 1 },
        { label: 'Moderadamente', value: 2 },
        { label: 'Muito', value: 3 },
        { label: 'Extremamente', value: 4 },
      ],
    },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore <= 7) {
      classification = 'Ausência de insônia clínica significativa';
      severityLevel = 'low';
    } else if (totalScore <= 14) {
      classification = 'Insônia subclínica (limítrofe)';
      severityLevel = 'moderate';
    } else if (totalScore <= 21) {
      classification = 'Insônia clínica de gravidade moderada';
      severityLevel = 'high';
    } else {
      classification = 'Insônia clínica grave';
      severityLevel = 'severe';
    }

    return {
      scaleId: 'isi',
      scaleTitle: 'ISI',
      totalScore,
      maxScore: 28,
      classification,
      severityLevel,
      interpretation: `Escore de ${totalScore}/28 pontos no ISI. ${classification}. A primeira linha de cuidado inclui TCC para insônia (TCC-I) e higiene do sono.`,
      recommendations: [
        'Higiene do sono e intervenção comportamental (TCC-I)',
        'Avaliar comorbidades psiquiátricas (depressão, ansiedade) ou clínicas (apneia do sono)',
        'Evitar uso indiscriminado de benzodiazepínicos',
      ],
      soapText: `ISI (Índice de Insônia): ${totalScore}/28 pts (${classification}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'TCC-I (Primeira Linha)', description: 'Controle de estímulos, restrição de tempo de leito e higiene do sono.', badge: 'Primeira Linha', badgeType: 'neutral' },
  ],
};

export const HAMA_SCALE: ScaleDefinition = {
  id: 'ham-a',
  title: 'HAM-A (Escala de Avaliação de Ansiedade de Hamilton)',
  acronym: 'HAM-A',
  targetGroup: 'Adultos na APS com sintomas ansiosos para quantificação de gravidade',
  description: 'Escala clínica de 14 itens avaliada pelo profissional para mensuração e quantificação de sintomas ansiosos psíquicos e somáticos.',
  shortInstruction: 'Avalie cada item de 0 (ausente) a 4 (muito grave / incapacitante).',
  instructions: 'Selecione a pontuação de 0 a 4 para cada um dos 14 agrupamentos de sintomas com base na entrevista clínica.',
  referenceCitation: 'Hamilton M. The assessment of anxiety states by rating. Br J Med Psychol. 1959; 32(1):50-5.',
  validationInfo: 'Padrão ouro clássico em ensaios clínicos para quantificação dimensional da resposta terapêutica.',
  cutoffInfo: '< 14: Ansiedade leve/normal | 14-17: Ansiedade leve a moderada | 18-24: Ansiedade moderada a grave | 25-30: Ansiedade grave | > 30: Muito grave',
  estimatedMinutes: 5,
  questions: [
    { id: 'q1', text: '1. Humor Ansioso (preocupações, antecipação do pior, apreensão, irritabilidade)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q2', text: '2. Tensão Psíquica (fadiga fácil, tremores, incapacidade de relaxar, choro fácil)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q3', text: '3. Medos / Fobias (escuro, estranhos, multidão, trânsito, ficar sozinho)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q4', text: '4. Insônia (dificuldade de adormecer, sono agitado, pesadelos, acordar cansado)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q5', text: '5. Cognição / Intelectual (dificuldade de concentração, lapsos de memória)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q6', text: '6. Humor Deprimido (perda de interesse, anedonia, variação diurna do humor)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q7', text: '7. Somático Muscular (dores, mialgias, rigidez, bruxismo, voz trêmula)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q8', text: '8. Somático Sensorial (zumbidos, visão turva, ondas de calor/frio, parestesias)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q9', text: '9. Cardiovascular (taquicardia, palpitações, dor precordial, sensação de desmaio)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q10', text: '10. Respiratório (aperto torácico, sensação de sufocamento, suspiros, dispneia)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q11', text: '11. Gastrointestinal (disfagia, dor epigástrica, empachamento, náusea, diarreia)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q12', text: '12. Genitourinário (polaciúria, urgência, alterações menstruais, perda de libido)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q13', text: '13. Sintomas Autonômicos (boca seca, rubor facial, palidez, sudorese, tonturas)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
    { id: 'q14', text: '14. Comportamento na Entrevista (inquietação, tremor de mãos, suspiros, palidez)', options: [{ label: 'Ausente (0)', value: 0 }, { label: 'Leve (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Grave (3)', value: 3 }, { label: 'Muito Grave (4)', value: 4 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore < 14) {
      classification = 'Ansiedade leve ou ausência de ansiedade clinicamente significativa';
      severityLevel = 'low';
    } else if (totalScore <= 17) {
      classification = 'Ansiedade leve a moderada';
      severityLevel = 'moderate';
    } else if (totalScore <= 24) {
      classification = 'Ansiedade moderada a grave';
      severityLevel = 'high';
    } else {
      classification = 'Ansiedade grave a incapacitante';
      severityLevel = 'severe';
    }

    return {
      scaleId: 'ham-a',
      scaleTitle: 'HAM-A',
      totalScore,
      maxScore: 56,
      classification,
      severityLevel,
      interpretation: `Escore de ${totalScore}/56 pontos na escala HAM-A. ${classification}.`,
      recommendations: [
        'Avaliar necessidade de suporte psicoterapêutico e intervenção farmacológica',
        'Mapear predomínio de sintomas psíquicos versus somáticos',
      ],
      soapText: `HAM-A: ${totalScore}/56 pts (${classification}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Diferenciação Somático vs Psíquico', description: 'Separar componentes autonômicos/motores de preocupações cognitivas.', badge: 'Clínica', badgeType: 'neutral' },
  ],
};

export const PHQ15_SCALE: ScaleDefinition = {
  id: 'phq-15',
  title: 'PHQ-15 (Módulo de Sintomas Somáticos do PHQ)',
  acronym: 'PHQ-15',
  targetGroup: 'Adultos na APS com sintomas físicos múltiplos ou queixas somáticas recorrentes',
  description: 'Instrumento de 15 itens que avalia a gravidade e o impacto de sintomas somáticos comuns nas últimas quatro semanas.',
  shortInstruction: 'Avalie o quanto cada sintoma físico incomodou você nas últimas 4 semanas.',
  instructions: 'Selecione para cada sintoma o quanto você foi incomodado(a) nas últimas 4 semanas.',
  referenceCitation: 'Kroenke K, Spitzer RL, Williams JB. The PHQ-15: validity of a new measure for evaluating the severity of somatic symptoms. Psychosom Med. 2002; 64(2):258-66.',
  validationInfo: 'Sensibilidade de 78% e especificidade de 71% para transtorno de sintomas somáticos (corte ≥ 10).',
  cutoffInfo: '0-4: Gravidade somática mínima | 5-9: Gravidade somática baixa | 10-14: Gravidade somática média | 15-30: Gravidade somática alta',
  estimatedMinutes: 3,
  questions: [
    { id: 'q1', text: '1. Dores de estômago ou abdominais', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q2', text: '2. Dor nas costas ou coluna', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q3', text: '3. Dor nos braços, pernas ou articulações', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q4', text: '4. Dores ou cólicas menstruais (ou outros problemas no período)', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q5', text: '5. Dores de cabeça', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q6', text: '6. Dor no peito ou aperto precordial', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q7', text: '7. Tonturas ou instabilidade', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q8', text: '8. Desmaios ou sensação de apagar', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q9', text: '9. Coração batendo rápido ou acelerado (palpitações)', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q10', text: '10. Falta de ar ou respiração curta', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q11', text: '11. Dor ou desconforto durante a relação sexual', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q12', text: '12. Prisão de ventre ou intestino solto (diarreia)', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q13', text: '13. Náuseas, indigestão ou empachamento', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q14', text: '14. Sentir-se cansado(a) ou com pouca energia', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
    { id: 'q15', text: '15. Problemas para dormir', options: [{ label: 'Nem um pouco (0)', value: 0 }, { label: 'Incomodou um pouco (1)', value: 1 }, { label: 'Incomodou muito (2)', value: 2 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore <= 4) {
      classification = 'Sintomas somáticos mínimos';
      severityLevel = 'low';
    } else if (totalScore <= 9) {
      classification = 'Sintomas somáticos de gravidade baixa';
      severityLevel = 'low';
    } else if (totalScore <= 14) {
      classification = 'Sintomas somáticos de gravidade média (Moderada)';
      severityLevel = 'moderate';
    } else {
      classification = 'Sintomas somáticos de gravidade alta';
      severityLevel = 'high';
    }

    return {
      scaleId: 'phq-15',
      scaleTitle: 'PHQ-15',
      totalScore,
      maxScore: 30,
      classification,
      severityLevel,
      interpretation: `Escore de ${totalScore}/30 pontos no PHQ-15 (${classification}). Sintomas físicos sem causa orgânica aparente devem ser investigados com empatia e sem exames redundantes desnecessários.`,
      recommendations: [
        'Acolher queixas físicas com abordagem integral na APS',
        'Evitar cascata propedêutica de exames repetitivos',
        'Investigar comorbidades com transtornos depressivos ou ansiosos',
      ],
      soapText: `PHQ-15: ${totalScore}/30 pts (${classification}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Abordagem Centrada na Pessoa', description: 'Validação do sofrimento somático sem reforçar hipermedicalização.', badge: 'APS / MFC', badgeType: 'neutral' },
  ],
};

export const SRQ20_SCALE: ScaleDefinition = {
  id: 'srq-20',
  title: 'SRQ-20 (Self-Reporting Questionnaire - Rastreio de Transtornos Mentais Comuns)',
  acronym: 'SRQ-20',
  targetGroup: 'População geral na Atenção Primária à Saúde para rastreio de TMC',
  description: 'Instrumento recomendado pela OMS para triagem populacional de transtornos mentais comuns (ansiedade, depressão e queixas somatoformes).',
  shortInstruction: 'Responda Sim (1) ou Não (0) para o que sentiu nos últimos 30 dias.',
  instructions: 'Para cada questão abaixo, assinale Sim se esteve presente nos últimos 30 dias, ou Não.',
  referenceCitation: 'Harding TW et al. Mental disorders in primary health care: a study of their frequency and diagnosis in four developing countries. Psychol Med. 1980; 10(2):231-41. Validação brasileira: Mari JJ, Williams P. 1986.',
  validationInfo: 'Sensibilidade de 83% e especificidade de 80% no Brasil para corte ≥ 7 em homens e ≥ 8 em mulheres.',
  cutoffInfo: 'Homens: Corte ≥ 7 (Suspeita de TMC) | Mulheres: Corte ≥ 8 (Suspeita de TMC) | Média geral APS: ≥ 7',
  estimatedMinutes: 4,
  questions: [
    { id: 'q1', text: '1. Você tem dores de cabeça frequentes?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q2', text: '2. Tem falta de apetite?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q3', text: '3. Dorme mal?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q4', text: '4. Assusta-se com facilidade?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q5', text: '5. Tem tremores nas mãos?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q6', text: '6. Sente-se nervoso(a), tenso(a) ou preocupado(a)?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q7', text: '7. Tem má digestão?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q8', text: '8. Tem dificuldade de pensar com clareza?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q9', text: '9. Tem se sentido triste ultimamente?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q10', text: '10. Tem chorado mais do que de costume?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q11', text: '11. Encontra dificuldades para realizar com prazer suas atividades diárias?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q12', text: '12. Tem dificuldades para tomar decisões?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q13', text: '13. É difícil para você realizar o trabalho com prazer?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q14', text: '14. É incapaz de desempenhar um papel útil em sua vida?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q15', text: '15. Tem perdido o interesse pelas coisas?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q16', text: '16. Sente-se uma pessoa inútil, sem valor?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q17', text: '17. Tem tido a ideia de acabar com a própria vida?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q18', text: '18. Sente-se cansado(a) o tempo todo?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q19', text: '19. Tem sensações desagradáveis no estômago?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q20', text: '20. Você se cansa com facilidade?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isPositive = totalScore >= 7;
    const item17 = answers['q17'] || 0;

    let classification = isPositive ? 'SRQ-20 Positivo (Suspeita de Transtorno Mental Comum)' : 'SRQ-20 Negativo (Sem sofrimento psíquico evidente)';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = isPositive ? 'moderate' : 'low';

    if (item17 > 0) {
      classification += ' | ⚠️ ALERTA: Resposta positiva para ideação de morte (Item 17)';
      severityLevel = 'severe';
    }

    return {
      scaleId: 'srq-20',
      scaleTitle: 'SRQ-20',
      totalScore,
      maxScore: 20,
      classification,
      severityLevel,
      interpretation: `Escore de ${totalScore}/20 no SRQ-20. ${isPositive ? 'Rastreio positivo sugerindo sofrimento psíquico relevante (TMC).' : 'Rastreio negativo.'} ${item17 > 0 ? 'ATENÇÃO: Item 17 afirmativo exige acolhimento e avaliação direta de segurança.' : ''}`,
      recommendations: [
        isPositive ? 'Consulta clínica e escuta qualificada na APS' : 'Ações preventivas e promoção de saúde mental',
        'Explorar fatores psicossociais e rede de apoio',
      ],
      soapText: `SRQ-20: ${totalScore}/20 pts (${classification}) | Item 17: ${item17} | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Acolhimento na APS', description: 'Investigar determinantes sociais e estressores de vida.', badge: 'Saúde Coletiva', badgeType: 'neutral' },
  ],
};

export const MDQ_SCALE: ScaleDefinition = {
  id: 'mdq',
  title: 'MDQ (Mood Disorder Questionnaire - Rastreio de Transtorno Bipolar)',
  acronym: 'MDQ',
  targetGroup: 'Adultos na APS com queixas de humor para rastreio de episódios hipomaníacos/maníacos',
  description: 'Instrumento de 13 itens de sintomas + 2 itens de simultaneidade e prejuízo funcional, para rastreamento de espectro bipolar.',
  shortInstruction: 'Avalie se você já viveu períodos de humor elevado, hiperatividade ou aceleração.',
  instructions: 'Responda se você já vivenciou as situações descritas em algum momento da sua vida.',
  referenceCitation: 'Hirschfeld RM et al. Development and validation of a screening instrument for bipolar spectrum disorder: The Mood Disorder Questionnaire. Am J Psychiatry. 2000; 157(11):1873-5. Validação brasileira: Mansur CG et al. 2005.',
  validationInfo: 'Critério positivo: ≥ 7 itens positivos na Parte 1 + ocorrência simultânea (Parte 2) + prejuízo moderado/grave (Parte 3).',
  cutoffInfo: '≥ 7 sintomas concomitantes com prejuízo funcional indicam suspeita de espectro bipolar',
  estimatedMinutes: 3,
  questions: [
    { id: 'q1', text: '1. Você se sentiu tão bem ou hiperativo(a) que outras pessoas acharam que você não estava normal?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q2', text: '2. Você ficou tão irritado(a) que gritou com as pessoas ou começou brigas?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q3', text: '3. Você se sentiu muito mais autoconfiante do que o habitual?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q4', text: '4. Você dormiu muito menos do que o habitual e mesmo assim não sentiu falta de sono?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q5', text: '5. Você esteve muito mais falante ou falou muito mais rápido do que de costume?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q6', text: '6. Os pensamentos passavam tão rápido pela sua cabeça que você não conseguia acompanhá-los?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q7', text: '7. Você se distraía tão facilmente que qualquer coisa tirava sua atenção?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q8', text: '8. Você teve muito mais energia para fazer coisas do que o habitual?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q9', text: '9. Você foi muito mais ativo(a) ou fez muito mais coisas do que de costume?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q10', text: '10. Você foi muito mais social ou expansivo(a) do que o habitual?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q11', text: '11. Você esteve muito mais interessado(a) em sexo do que de costume?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q12', text: '12. Você fez coisas arriscadas, imprudentes ou com gastos excessivos de dinheiro?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q13', text: '13. Gastar dinheiro causou problemas para você ou para sua família?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isPositive = totalScore >= 7;

    return {
      scaleId: 'mdq',
      scaleTitle: 'MDQ',
      totalScore,
      maxScore: 13,
      classification: isPositive ? 'MDQ Positivo (Suspeita de Transtorno do Espectro Bipolar)' : 'MDQ Negativo (Baixa probabilidade de hipomania)',
      severityLevel: isPositive ? 'high' : 'low',
      interpretation: `Escore de ${totalScore}/13 itens afirmativos no MDQ. ${isPositive ? 'Rastreamento positivo para sintomas hipomaníacos. ATENÇÃO: Contraindica início de antidepressivo em monoterapia antes de avaliação psiquiátrica cuidadosa.' : 'Rastreio negativo.'}`,
      recommendations: [
        isPositive ? 'Cuidado ao prescrever antidepressivos isolados pelo risco de viragem maníaca' : 'Seguimento clínico habitual',
        'Anamnese psiquiátrica detalhada longitudinal com histórico familiar',
      ],
      soapText: `MDQ: ${totalScore}/13 itens afirmativos (${isPositive ? 'Positivo ≥ 7' : 'Negativo'}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Risco de Viragem Maníaca', description: 'Evitar monoterapia antidepressiva em casos suspeitos de bipolaridade.', badge: 'Alerta Farmacológico', badgeType: 'warning' },
  ],
};

export const PCPTSD5_SCALE: ScaleDefinition = {
  id: 'pc-ptsd-5',
  title: 'PC-PTSD-5 (Rastreamento de TEPT na Atenção Primária - DSM-5)',
  acronym: 'PC-PTSD-5',
  targetGroup: 'Adultos na APS expostos a eventos potencialmente traumáticos',
  description: 'Instrumento breve de 5 itens projetado para identificar suspeita de Transtorno de Estresse Pós-Traumático na Atenção Primária.',
  shortInstruction: 'Responda Sim (1) ou Não (0) referente ao último mês após evento traumático.',
  instructions: 'Após vivenciar evento traumático grave, assinale se você teve estes sintomas no último mês.',
  referenceCitation: 'Prins A et al. The Primary Care PTSD Screen for DSM-5 (PC-PTSD-5): Development and evaluation within a Veteran Primary Care Sample. J Gen Intern Med. 2016; 31(10):1206-11.',
  validationInfo: 'Ponto de corte ≥ 3 respostas afirmativas maximiza sensibilidade e especificidade para rastreio de TEPT.',
  cutoffInfo: '0-2: Baixa probabilidade de TEPT | ≥ 3: Rastreio positivo para TEPT (Avaliação clínica diagnóstica indicada)',
  estimatedMinutes: 2,
  questions: [
    { id: 'q1', text: '1. Teve pesadelos sobre o evento ou pensou sobre ele quando não queria?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q2', text: '2. Esforçou-se muito para não pensar sobre o evento ou evitou situações que lembravam o fato?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q3', text: '3. Esteve constantemente em guarda, vigilante ou se assustou com muita facilidade?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q4', text: '4. Sentiu-se anestesiado(a) ou distante de outras pessoas, atividades ou ambiente ao redor?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
    { id: 'q5', text: '5. Sentiu culpa ou não conseguiu parar de culpar a si mesmo(a) ou a terceiros pelo evento?', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isPositive = totalScore >= 3;

    return {
      scaleId: 'pc-ptsd-5',
      scaleTitle: 'PC-PTSD-5',
      totalScore,
      maxScore: 5,
      classification: isPositive ? 'PC-PTSD-5 Positivo (Suspeita de TEPT)' : 'PC-PTSD-5 Negativo (Baixa probabilidade de TEPT)',
      severityLevel: isPositive ? 'high' : 'low',
      interpretation: `Escore de ${totalScore}/5 respostas afirmativas no PC-PTSD-5. ${isPositive ? 'Rastreamento positivo (≥ 3 itens afirmativos). Indicação de avaliação clínica formal dos critérios de TEPT.' : 'Rastreio negativo.'}`,
      recommendations: [
        isPositive ? 'Avaliação médica e psicológica focada em trauma' : 'Acompanhamento de rotina',
        'Abordagem empática evitando revitimização na entrevista',
      ],
      soapText: `PC-PTSD-5: ${totalScore}/5 afirmativos (${isPositive ? 'Positivo ≥ 3' : 'Negativo'}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Cuidado Informado sobre Trauma', description: 'Ambiente seguro e escuta empática respeitando o ritmo do paciente.', badge: 'MFC / Trauma', badgeType: 'neutral' },
  ],
};

export const PCL5_SCALE: ScaleDefinition = {
  id: 'pcl-5',
  title: 'PCL-5 (Posttraumatic Stress Disorder Checklist - DSM-5)',
  acronym: 'PCL-5',
  targetGroup: 'Adultos com histórico de trauma para quantificação dos 4 clusters de TEPT',
  description: 'Lista de verificação autoaplicável de 20 sintomas do DSM-5 dividida nos clusters: Intrusão (B), Esquiva (C), Alterações Cognitivas/Humor (D) e Hiperestimulação (E).',
  shortInstruction: 'Avalie o quanto cada sintoma incomodou você no último mês (0 a 4).',
  instructions: 'Para cada sintoma abaixo, selecione o grau de incômodo no último mês em relação a uma experiência estressante do passado.',
  referenceCitation: 'Blevins CA, Weathers FW, Davis MT, Witte TK, Domino JL. The Posttraumatic Stress Disorder Checklist for DSM-5 (PCL-5): Development and Initial Psychometric Evaluation. J Trauma Stress. 2015; 28(6):489-98. Validação brasileira: Osório FL et al. 2017.',
  validationInfo: 'Ponto de corte de 31 a 33 pontos indica provável diagnóstico de TEPT.',
  cutoffInfo: '0-30: Sintomas abaixo do limiar de TEPT | 31-80: Provável diagnóstico de TEPT (Corte ≥ 33)',
  estimatedMinutes: 6,
  questions: [
    { id: 'q1', text: '1. Memórias indesejadas e perturbadoras do evento estressante', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q2', text: '2. Sonhos perturbadores ou pesadelos sobre o evento estressante', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q3', text: '3. Reviver o evento como se estivesse acontecendo de novo (flashbacks)', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q4', text: '4. Sentir-se muito chateado(a) quando algo lembra o evento', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q5', text: '5. Reações físicas fortes (taquicardia, suor) quando lembrado do evento', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q6', text: '6. Evitar memórias, pensamentos ou sentimentos ligados ao evento', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q7', text: '7. Evitar lembretes externos (pessoas, lugares, conversas, objetos)', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q8', text: '8. Dificuldade de lembrar partes importantes do evento estressante', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q9', text: '9. Crenças muito negativas sobre si mesmo(a), os outros ou o mundo', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q10', text: '10. Culpar a si mesmo(a) ou a terceiros de forma distorcida pelo evento', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q11', text: '11. Ter sentimentos negativos constantes (medo, horror, raiva, culpa, vergonha)', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q12', text: '12. Perda de interesse em atividades que costumava gostar', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q13', text: '13. Sentir-se distante ou isolado(a) de outras pessoas', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q14', text: '14. Dificuldade de sentir sentimentos positivos (alegria, afeto)', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q15', text: '15. Comportamento irritável, explosões de raiva ou agressividade', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q16', text: '16. Correr riscos desnecessários ou agir de forma autodestrutiva', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q17', text: '17. Ficar "em guarda" constante ou hipervigilante', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q18', text: '18. Assustar-se com muita facilidade (sobressalto exagerado)', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q19', text: '19. Ter dificuldade de concentração', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
    { id: 'q20', text: '20. Ter problemas para adormecer ou manter o sono', options: [{ label: 'Nada (0)', value: 0 }, { label: 'Pouco (1)', value: 1 }, { label: 'Moderado (2)', value: 2 }, { label: 'Muito (3)', value: 3 }, { label: 'Extremamente (4)', value: 4 }] },
  ],
  calculateResult: (answers): ScaleResult => {
    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'].map((k) => answers[k] ?? 0);
    answersArray.forEach((v) => { totalScore += v; });
    const isProbablePTSD = totalScore >= 33;

    return {
      scaleId: 'pcl-5',
      scaleTitle: 'PCL-5',
      totalScore,
      maxScore: 80,
      classification: isProbablePTSD ? 'PCL-5 Positivo (Provável TEPT - Escore ≥ 33)' : 'PCL-5 Negativo (Sintomatologia pós-traumática abaixo do limiar)',
      severityLevel: isProbablePTSD ? 'high' : 'low',
      interpretation: `Escore total de ${totalScore}/80 pontos no PCL-5. ${isProbablePTSD ? 'Indica presença significativa de sintomas de TEPT nos 4 domínios do DSM-5.' : 'Sintomas abaixo do ponto de corte.'}`,
      recommendations: [
        isProbablePTSD ? 'Indicação de psicoterapia baseada em evidências focada em trauma (ex.: TCC focada no trauma, EMDR)' : 'Monitoramento',
        'Avaliar necessidade de suporte psicofarmacológico adjuvante',
      ],
      soapText: `PCL-5: ${totalScore}/80 pts (${isProbablePTSD ? 'Positivo ≥ 33' : 'Negativo'}) | Itens: [${answersArray.join(', ')}]`,
      answersArray,
    };
  },
  clinicalConductSteps: [
    { title: 'Terapia Focada em Trauma', description: 'Encaminhamento ou manejo conjunto com atenção psicossocial.', badge: 'PTS / APS', badgeType: 'neutral' },
  ],
};

export const ADDITIONAL_SCALES: ScaleDefinition[] = [
  AUDITC_SCALE,
  CAGE_SCALE,
  MDQ_SCALE,
  PCL5_SCALE,
  PCPTSD5_SCALE,
  EPDS_SCALE,
  SRQ20_SCALE,
  HAMA_SCALE,
  ISI_SCALE,
  PHQ15_SCALE,
];
