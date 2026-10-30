import { ScaleDefinition, ScaleResult, ScaleQuestionOption } from '../types';
import { ADDITIONAL_SCALES } from './additionalScalesData';
import { validateScaleAnswers, createIncompleteScaleResult } from '../utils/scaleValidation';

export const PHQ9_SCALE: ScaleDefinition = {
  id: 'phq-9',
  title: 'PHQ-9 (Patient Health Questionnaire-9)',
  acronym: 'PHQ-9',
  targetGroup: 'Adultos na APS com suspeita de episódio depressivo',
  description: 'Instrumento padrão-ouro para rastreamento e estratificação de gravidade dos sintomas depressivos nas últimas duas semanas.',
  shortInstruction: 'Avalie a frequência de cada sintoma nas últimas 2 semanas.',
  instructions: 'Para cada item abaixo, selecione com que frequência você (ou o paciente) foi incomodado(a) por esse problema nas últimas 2 semanas.',
  referenceCitation: 'Kroenke K, Spitzer RL, Williams JB. J Gen Intern Med. 2001; 16(9):606-13. Validação brasileira: de Lima Osório F et al. (2009) e Santos IS et al. (2013).',
  validationInfo: 'Validada no Brasil na APS. Sensibilidade: 88%, Especificidade: 88% (para corte ≥ 10).',
  cutoffInfo: '0-4: Mínimo | 5-9: Leve | 10-14: Moderado | 15-19: Mod. Grave | 20-27: Grave (Corte ≥ 10)',
  estimatedMinutes: 3,
  questions: [
    {
      id: 'q1',
      text: '1. Pouco interesse ou pouco prazer em fazer as coisas',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q2',
      text: '2. Sentir-se "na pior", deprimido(a) ou sem esperança',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q3',
      text: '3. Dificuldade para adormecer ou permanecer dormindo, ou dormir demais',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q4',
      text: '4. Sentir-se cansado(a) ou com pouca energia',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q5',
      text: '5. Falta de apetite ou comendo demais',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q6',
      text: '6. Sentir-se mal consigo mesmo(a) — ou achar que é um fracasso ou que decepcionou a si mesmo(a) ou sua família',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q7',
      text: '7. Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q8',
      text: '8. Lentidão para se mover ou falar (a ponto de outras pessoas perceberem), ou o oposto: agitação física',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q9',
      text: '9. Pensamentos de que seria melhor estar morto(a) ou de se ferir de alguma maneira',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(PHQ9_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(PHQ9_SCALE, validation);
    }

    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'].map(
      (k) => Number(answers[k])
    );
    answersArray.forEach((val) => {
      totalScore += val;
    });

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (totalScore <= 4) {
      classification = 'Sintomas depressivos mínimos ou ausentes';
      severityLevel = 'low';
      interpretation = 'Escore baixo (0-4 pts), sem indicação de intervenção farmacológica para depressão.';
      recs.push('Acompanhamento longitudinal de rotina na APS', 'Orientações gerais de estilo de vida e higiene do sono');
    } else if (totalScore <= 9) {
      classification = 'Depressão leve';
      severityLevel = 'low';
      interpretation = 'Sintomas leves (5-9 pts). Avaliar contexto psicossocial e impacto funcional.';
      recs.push('Psicoeducação e suporte na APS', 'Ativação comportamental e atividade física orientada', 'Reavaliação em 4 a 8 semanas');
    } else if (totalScore <= 14) {
      classification = 'Depressão moderada';
      severityLevel = 'moderate';
      interpretation = 'Sintomas moderados (10-14 pts, corte ≥ 10 atingido) com comprometimento das atividades diárias.';
      recs.push('Considerar psicoterapia (TCC/interpessoal) e/ou farmacoterapia (ISRS de 1ª linha)', 'Pactuar plano de acompanhamento em APS');
    } else if (totalScore <= 19) {
      classification = 'Depressão moderadamente grave';
      severityLevel = 'high';
      interpretation = 'Sintomas significativos (15-19 pts) exigindo intervenção clínica e medicamentosa estruturada.';
      recs.push('Iniciar tratamento medicamentoso com ISRS', 'Pactuar retorno em 2 semanas', 'Avaliar suporte familiar e rede de apoio social');
    } else {
      classification = 'Depressão grave';
      severityLevel = 'severe';
      interpretation = 'Sintomas graves (20-27 pts) com alto risco de prejuízo funcional e sofrimento psíquico severo.';
      recs.push('Iniciar farmacoterapia combinada/otimizada', 'Investigar ativamente ideação e planejamento suicida', 'Considerar discussão de caso em Apoio Matricial / Psiquiatria');
    }

    const individualAlerts: string[] = [];
    if (answers['q9'] && answers['q9'] > 0) {
      const q9Val = answers['q9'];
      const optLabel = PHQ9_SCALE.questions[8]?.options.find((o) => o.value === q9Val)?.label || `${q9Val} pts`;
      const alertMsg = `⚠️ ALERTA DE SEGURANÇA (PHQ-9 - Pergunta 9): Resposta positiva ("${optLabel}"). Exige avaliação clínica direta e presencial do risco de ideação de morte/autolesão (investigar planos, meios, intencionalidade e fatores de proteção). Não classificar automaticamente como alto risco de suicídio antes da avaliação médica.`;
      recs.unshift(alertMsg);
      individualAlerts.push(alertMsg);
    }

    const soapText = `PHQ-9: ${totalScore}/27 pts (${classification}) | Respostas: [${answersArray.join(', ')}] | Fonte: Kroenke et al., 2001 (Validação BR: Osório, 2009)${
      individualAlerts.length > 0 ? `\n• ${individualAlerts[0]}` : ''
    }`;

    return {
      scaleId: 'phq-9',
      scaleTitle: 'PHQ-9',
      totalScore,
      maxScore: 27,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 9,
      totalRequired: 9,
      individualAlerts,
      hasCriticalAlert: individualAlerts.length > 0,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Escore 0 a 4 — Sintomas Mínimos ou Ausentes',
      description: 'Conduta habitual na APS. Reforçar hábitos de vida saudáveis, prática regular de atividade física (150 min/semana), higiene do sono e estratégias de redução do estresse. Não há indicação de antidepressivos.',
      badge: '0-4 pts: Mínimo',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 5 a 9 — Depressão Leve (Watchful Waiting)',
      description: 'Estratégia de monitoramento vigilante ativo ("Watchful Waiting") associada à psicoeducação e ativação comportamental. Estimular engajamento social, autocuidado e reavaliar em 4 a 8 semanas antes de cogitar intervenção farmacológica.',
      badge: '5-9 pts: Leve',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 10 a 14 — Depressão Moderada (Corte ≥ 10)',
      description: 'Ponto de corte clínico positivo. Indicação formal de Psicoterapia baseada em evidências (Terapia Cognitivo-Comportamental ou Interpessoal) e/ou Farmacoterapia com ISRS de 1ª linha (Sertralina 50-100mg, Fluoxetina 20-40mg, Escitalopram 10-20mg). Pactuar consultas mensais na APS.',
      badge: '10-14 pts: Moderado',
      badgeType: 'warning',
    },
    {
      title: 'Escore 15 a 19 — Depressão Moderadamente Grave',
      description: 'Iniciar tratamento medicamentoso estruturado com ISRS/ISRN em doses terapêuticas plenas. Retorno em 2 semanas para avaliação de tolerabilidade e adesão. Avaliar suporte familiar e articulação com equipe multiprofissional (eMulti).',
      badge: '15-19 pts: Mod. Grave',
      badgeType: 'warning',
    },
    {
      title: 'Escore 20 a 27 — Depressão Grave',
      description: 'Tratamento farmacológico imediato em dose otimizada associado a acompanhamento intensivo. Investigação sistemática de ideação suicida, suporte familiar e discussão do caso com Apoio Matricial em Saúde Mental ou CAPS.',
      badge: '20-27 pts: Grave',
      badgeType: 'danger',
    },
    {
      title: '⚠️ Manejo Obrigatório do Item 9 (Ideação Suicida / Autolesão)',
      description: 'Qualquer pontuação > 0 no item 9 exige aplicação imediata do protocolo C-SSRS (Columbia), investigação de plano/meios, bloqueio de meios letais e pactuação de Plano de Segurança Pessoal.',
      badge: 'Alerta Item 9',
      badgeType: 'danger',
    },
  ],
  monitoringGoals: [
    {
      title: 'Resposta Clínica Inicial (4 a 6 semanas)',
      description: 'Redução ≥ 50% na pontuação basal do PHQ-9 após 4 a 6 semanas de uso do antidepressivo em dose terapêutica plena (CANMAT / APA / SUS).',
    },
    {
      title: 'Remissão Sintomática Completa',
      description: 'Escore PHQ-9 < 5 pontos mantido de forma contínua por pelo menos 6 a 12 meses na fase de manutenção para consolidação neurobiológica e prevenção de recaídas.',
    },
    {
      title: 'Conduta em Falha Terapêutica (< 25% de melhora)',
      description: 'Ausência de resposta significativa (< 25% de redução no PHQ-9) após 4-6 semanas em dose terapêutica exige: 1. Confirmar adesão; 2. Otimizar dose até o teto terapêutico; 3. Trocar de classe ou potencializar (ex: Lítio, Quetiapina, TCC).',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Acurácia Diagnóstica e Validação Brasileira',
      text: 'O PHQ-9 possui sensibilidade de 88% e especificidade de 88% para o diagnóstico de Episódio Depressivo Maior na Atenção Primária no ponto de corte ≥ 10 (Kroenke et al., 2001; validação brasileira por Osório et al., 2009 e Santos et al., 2013).',
      reference: 'Kroenke K et al. J Gen Intern Med. 2001; Osório FL et al. Cad Saude Publica. 2009.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: A Regra dos 2 Itens Cardeais (PHQ-2)',
      text: 'Os itens 1 (anedonia) e 2 (humor deprimido) são os sintomas cardinais obrigatórios do DSM-5. Se ambos forem zero ("Nenhuma vez"), a probabilidade de depressão maior é inferior a 2%.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha Clínica: Sintomas Somáticos em Doenças Crônicas e Idosos',
      text: 'Em pacientes com diabetes descompensada, insuficiência cardíaca, DPOC ou idosos frágeis, itens somáticos (fadiga, alteração de sono e apetite) podem estar aumentados pela condição de base. Valorize anedonia, culpa excessiva e humor rebaixado para confirmar a etiologia psiquiátrica.',
    },
  ],
};

export const GAD7_SCALE: ScaleDefinition = {
  id: 'gad-7',
  title: 'GAD-7 (Generalized Anxiety Disorder-7)',
  acronym: 'GAD-7',
  targetGroup: 'Adultos na APS com queixas de ansiedade, tensão ou preocupação excessiva',
  description: 'Instrumento validado para triagem e mensuração da gravidade do Transtorno de Ansiedade Generalizada.',
  shortInstruction: 'Avalie a frequência dos sintomas ansiosos nas últimas 2 semanas.',
  instructions: 'Para cada item abaixo, selecione com que frequência você (ou o paciente) foi incomodado(a) pelo sintoma nas últimas 2 semanas.',
  referenceCitation: 'Spitzer RL, Kroenke K, Williams JB, Löwe B. Arch Intern Med. 2006; 166(10):1092-7. Validação brasileira: Moreno AL et al. (2016).',
  validationInfo: 'Versão brasileira validada. Sensibilidade: 89%, Especificidade: 82% para corte ≥ 10.',
  cutoffInfo: '0-4: Mínima | 5-9: Leve | 10-14: Moderada | 15-21: Grave (Corte ≥ 10 para TAG provável)',
  estimatedMinutes: 2,
  questions: [
    {
      id: 'q1',
      text: '1. Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q2',
      text: '2. Não ser capaz de impedir ou de controlar as preocupações',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q3',
      text: '3. Preocupar-se demais com diversas coisas',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q4',
      text: '4. Dificuldade para relaxar',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q5',
      text: '5. Ficar tão agitado(a) que se torna difícil permanecer sentado(a)',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q6',
      text: '6. Ficar facilmente irritado(a) ou chateado(a)',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
    {
      id: 'q7',
      text: '7. Sentir medo como se algo terrível fosse acontecer',
      options: [
        { label: 'Nenhuma vez', value: 0 },
        { label: 'Vários dias', value: 1 },
        { label: 'Mais da metade dos dias', value: 2 },
        { label: 'Quase todos os dias', value: 3 },
      ],
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(GAD7_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(GAD7_SCALE, validation);
    }

    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'].map(
      (k) => Number(answers[k])
    );
    answersArray.forEach((val) => {
      totalScore += val;
    });

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (totalScore <= 4) {
      classification = 'Ansiedade mínima ou ausente';
      severityLevel = 'low';
      interpretation = 'Sintomas dentro do espectro fisiológico (0-4 pts).';
      recs.push('Acompanhamento longitudinal habitual na APS', 'Orientações para manejo do estresse e estilo de vida');
    } else if (totalScore <= 9) {
      classification = 'Ansiedade leve';
      severityLevel = 'low';
      interpretation = 'Sintomas leves (5-9 pts). Benefício com psicoeducação e técnicas de relaxamento.';
      recs.push('Técnicas de respiração diafragmática e higiene do sono', 'Acompanhamento periódico na APS');
    } else if (totalScore <= 14) {
      classification = 'Ansiedade moderada';
      severityLevel = 'moderate';
      interpretation = 'Sintomas moderados (10-14 pts, corte ≥ 10 atingido). Indicação de investigação detalhada para TAG.';
      recs.push('Avaliar indicação de psicoterapia (TCC) e/ou farmacoterapia (ISRS)', 'Pactuar consultas de acompanhamento');
    } else {
      classification = 'Ansiedade grave';
      severityLevel = 'severe';
      interpretation = 'Sintomas graves (15-21 pts) com prejuízo funcional marcante.';
      recs.push('Pactuar plano terapêutico medicamentoso e psicoterápico', 'Reavaliação em 2 semanas', 'Considerar apoio matricial se refratário');
    }

    const soapText = `GAD-7: ${totalScore}/21 pts (${classification}) | Respostas: [${answersArray.join(', ')}] | Fonte: Spitzer et al., 2006 (Validação BR: Moreno, 2016)`;

    return {
      scaleId: 'gad-7',
      scaleTitle: 'GAD-7',
      totalScore,
      maxScore: 21,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 7,
      totalRequired: 7,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Escore 0 a 4 — Ansiedade Mínima ou Ausente',
      description: 'Sintomas dentro do espectro adaptativo. Reforçar hábitos de vida saudáveis, manejo do estresse no trabalho e higiene do sono. Não há indicação de ansiolíticos ou antidepressivos.',
      badge: '0-4 pts: Mínimo',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 5 a 9 — Ansiedade Leve',
      description: 'Oferecer psicoeducação sobre o ciclo da ansiedade, treino de respiração diafragmática (respiração 4-7-8) e incentivo à atividade física aeróbica regular. Reavaliar em 4 a 6 semanas.',
      badge: '5-9 pts: Leve',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 10 a 14 — Ansiedade Moderada (Corte ≥ 10 para TAG)',
      description: 'Rastreio positivo para Transtorno de Ansiedade Generalizada. Indicação formal de Psicoterapia (TCC) e/ou Farmacoterapia de 1ª linha com ISRS (Sertralina 50-100mg, Escitalopram 10-20mg) ou Venlafaxina 75-150mg. Evitar benzodiazepínicos em monoterapia contínua.',
      badge: '10-14 pts: Moderado',
      badgeType: 'warning',
    },
    {
      title: 'Escore 15 a 21 — Ansiedade Grave',
      description: 'Tratamento combinado (ISRS/ISRN em dose otimizada + TCC estruturada). Retorno em 2 semanas para monitorar sintomas de ativação inicial do ISRS e pactuar plano de enfrentamento de crises.',
      badge: '15-21 pts: Grave',
      badgeType: 'danger',
    },
    {
      title: '⚠️ Uso Racional de Benzodiazepínicos na APS',
      description: 'Se prescritos para alívio agudo de crises graves de ansiedade ou insônia inicial, restringir a dose mínima eficaz por no máximo 2 a 4 semanas (ex: Clonazepam 0,5mg ou Diazepam 5mg), sempre combinados ao ISRS e com plano de desmame explícito.',
      badge: 'Alerta Farmacológico',
      badgeType: 'warning',
    },
  ],
  monitoringGoals: [
    {
      title: 'Resposta Clínica Inicial (4 a 6 semanas)',
      description: 'Redução ≥ 50% no escore basal do GAD-7 após atingir a dose terapêutica do ISRS/ISRN.',
    },
    {
      title: 'Remissão e Manutenção',
      description: 'Escore final do GAD-7 < 5 pontos mantido por 6 a 12 meses após a estabilização para consolidação e prevenção de recidivas.',
    },
    {
      title: 'Descontinuação Gradual e Segura',
      description: 'Após período de manutenção, realizar desmame lento e hiperbólico do antidepressivo ao longo de 2 a 4 meses para prevenir a síndrome de descontinuação (vertigem, parestesia, insônia).',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Acurácia Diagnóstica e Triagem Multidimensional',
      text: 'No ponto de corte ≥ 10, o GAD-7 possui Sensibilidade de 89% e Especificidade de 82% para TAG (Spitzer et al., 2006; validação brasileira por Moreno et al., 2016). Também apresenta boa sensibilidade para Transtorno do Pânico (74%), Fobia Social (72%) e TEPT (66%).',
      reference: 'Spitzer RL et al. Arch Intern Med. 2006; Moreno AL et al. Trends Psychiatry Psychother. 2016.',
    },
    {
      type: 'pearl',
      title: 'Pérola Prática: Piora Paradoxal Inicial com ISRS',
      text: 'Nos primeiros 7 a 14 dias de início de ISRS/ISRN, pode ocorrer aumento transitório da ansiedade e inquietude ("ansiedade de ativação"). Oriente previamente o paciente para evitar abandono do tratamento e inicie com metade da dose na primeira semana.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha Clínica: Causas Orgânicas e Estimulantes Mascarados',
      text: 'Sempre descarte causas secundárias de ansiedade: hipertireoidismo (dosar TSH), arritmias cardíacas, consumo excessivo de café/energéticos (> 400mg cafeína/dia), abuso de descongestionantes nasais (pseudoefedrina), broncodilatadores e abstinência oculta de álcool ou sedativos.',
    },
  ],
};

export const HCL32_SCALE: ScaleDefinition = {
  id: 'hcl-32',
  title: 'HCL-32 (Hypomania Checklist - 32 itens)',
  acronym: 'HCL-32',
  targetGroup: 'Adultos na APS com episódios depressivos recorrentes ou oscilações de humor/energia',
  description: 'Instrumento de autorrelato com 32 itens para rastreamento de episódios prévios de hipomania em pacientes com depressão, auxiliando na identificação do Transtorno Bipolar (especialmente Tipo II) e do Espectro Bipolar.',
  shortInstruction: 'Avalie como você se sentiu nos períodos em que estava "numa fase de alta", com mais energia ou humor mais elevado do que o normal.',
  instructions: 'Comparado a como você é habitualmente, pense em períodos da sua vida em que você se sentiu "numa fase de alta", com muita energia, disposição ou humor mais elevado. Responda SIM ou NÃO para cada uma das 32 afirmações abaixo.',
  referenceCitation: 'Angst J, Adolfsson R, Benazzi F, et al. J Affect Disord. 2005; 88(2):217-33. Versão Brasileira Validada: Soares OT, Moreno RA, Moura EC, Angst J. Rev Bras Psiquiatr. 2010; 32(4):438-445.',
  validationInfo: 'Versão Brasileira validada (USP). Alfa de Cronbach: 0.86. Ponto de corte validado no Brasil: ≥ 18 pontos (Sensibilidade 75%, Especificidade 58%). Ponto de corte internacional: ≥ 14 pontos.',
  cutoffInfo: '0-13: Rastreio Negativo | 14-17: Traços Moderados de Hipomania | ≥ 18: Rastreio Positivo para Espectro Bipolar (Corte BR)',
  estimatedMinutes: 5,
  questions: [
    { id: 'q1', text: '1. Preciso de menos sono.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q2', text: '2. Sinto-me com mais energia e mais ativo(a).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q3', text: '3. Sou mais autoconfiante.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q4', text: '4. Aprecio mais o meu trabalho / Trabalho com mais prazer.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q5', text: '5. Sou mais sociável (faço mais telefonemas, saio mais com as pessoas).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q6', text: '6. Tenho vontade de viajar e/ou viajo mais.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q7', text: '7. Tendo a dirigir mais rápido ou correr mais riscos na direção/trânsito.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q8', text: '8. Gasto mais dinheiro ou gasto dinheiro demais (compras impulsivas).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q9', text: '9. Corro mais riscos na minha vida diária (no trabalho e/ou em outras atividades).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q10', text: '10. Fico fisicamente mais ativo(a) (prática de esportes, caminhadas, etc.).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q11', text: '11. Planejo mais atividades ou projetos.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q12', text: '12. Tenho mais ideias, sou mais criativo(a).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q13', text: '13. Sou menos tímido(a) ou inibido(a).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q14', text: '14. Visto roupas mais coloridas, extravagantes ou uso mais maquiagem.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q15', text: '15. Quero conhecer ou de fato conheço mais pessoas.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q16', text: '16. Tenho mais interesse em sexo e/ou aumento do desejo sexual.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q17', text: '17. Sou mais paquerador(a) / sedutor(a) e/ou mais sexualmente ativo(a).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q18', text: '18. Falo mais / falo pelos cotovelos.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q19', text: '19. Penso mais rápido.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q20', text: '20. Faço mais piadas ou trocadilhos quando estou conversando.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q21', text: '21. Fico facilmente distraído(a).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q22', text: '22. Envolvo-me em muitas coisas novas.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q23', text: '23. Meus pensamentos pulam de um assunto para outro (fuga de ideias).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q24', text: '24. Faço as coisas com mais rapidez e/ou mais facilidade.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q25', text: '25. Fico mais impaciente e/ou me irrito mais facilmente.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q26', text: '26. Posso ser cansativo(a) ou irritante para os outros.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q27', text: '27. Entro em mais discussões, brigas ou conflitos.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q28', text: '28. Meu humor fica mais elevado, mais otimista.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'ativacao' },
    { id: 'q29', text: '29. Bebo mais café ou cafeína.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q30', text: '30. Fumo mais cigarros ou derivados do tabaco.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q31', text: '31. Bebo mais bebidas alcoólicas.', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
    { id: 'q32', text: '32. Uso mais medicamentos ou outras substâncias (sedativos, estimulantes, ansiolíticos).', options: [{ label: 'Não', value: 0 }, { label: 'Sim', value: 1 }], subscale: 'risco' },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(HCL32_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(HCL32_SCALE, validation);
    }

    let totalScore = 0;
    let ativacaoScore = 0;
    let riscoScore = 0;

    const ativacaoIds = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q18', 'q19', 'q20', 'q22', 'q24', 'q28'];
    const riscoIds = ['q7', 'q8', 'q9', 'q17', 'q21', 'q23', 'q25', 'q26', 'q27', 'q29', 'q30', 'q31', 'q32'];

    ativacaoIds.forEach((id) => {
      if (answers[id] === 1) {
        totalScore += 1;
        ativacaoScore += 1;
      }
    });

    riscoIds.forEach((id) => {
      if (answers[id] === 1) {
        totalScore += 1;
        riscoScore += 1;
      }
    });

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (totalScore >= 18) {
      classification = 'Rastreio Positivo para Transtorno do Espectro Bipolar (Corte Brasileiro ≥ 18)';
      severityLevel = 'high';
      interpretation = `Escore de ${totalScore}/32 pontos ultrapassa a linha de corte validada no Brasil (≥ 18 pontos - Soares & Moreno, 2010; Sensibilidade 75%, Especificidade 58%). Fator Ativação/Elação: ${ativacaoScore}/19; Fator Risco/Irritabilidade: ${riscoScore}/13. Sugere forte probabilidade de histórico de hipomania (Transtorno Bipolar Tipo II ou Espectro Bipolar).`;
      recs.push(
        '⚠️ ATENÇÃO: Evitar monoterapia com antidepressivos (risco de virada maníaca, indução de ciclagem rápida ou agitação psicomotora)',
        'Realizar anamnese psiquiátrica longitudinal e investigar histórico familiar de transtorno bipolar e suicídio',
        'Investigar a duração dos episódios de hipomania (critério DSM-5: mínimo de 4 dias consecutivos com mudança nítida de comportamento)',
        'Discutir caso com Apoio Matricial em Saúde Mental / Psiquiatria para pactuação de estabilizador de humor (ex: Lítio, Lamotrigina, Quetiapina)'
      );
    } else if (totalScore >= 14) {
      classification = 'Traços Moderados de Hipomania (Corte Internacional ≥ 14)';
      severityLevel = 'moderate';
      interpretation = `Escore de ${totalScore}/32 pontos atinge a faixa de corte internacional (14 a 17 pts). Ativação: ${ativacaoScore}/19; Risco: ${riscoScore}/13. Há relato moderado de sintomas de elevação do humor no histórico prévio.`;
      recs.push(
        'Aprofundar a investigação clínica de fases prévias de hiperatividade, redução do sono e impulsividade financeira/comportamental',
        'Avaliar resposta a tratamentos antidepressivos anteriores (houve piora da insônia, irritabilidade ou perda de efeito?)',
        'Monitorar evolução longitudinal na APS'
      );
    } else {
      classification = 'Rastreio Negativo para Hipomania / Espectro Bipolar';
      severityLevel = 'low';
      interpretation = `Escore de ${totalScore}/32 pontos abaixo da linha de corte sugestiva de episódios hipomaníacos (Ativação: ${ativacaoScore}/19, Risco: ${riscoScore}/13).`;
      recs.push(
        'Seguir propedêutica e tratamento padrão para Transtorno Depressivo Unipolar ou Ansiedade conforme protocolos clínicos',
        'Reavaliar se houver piora paradoxal ou agitação durante tratamento com antidepressivos'
      );
    }

    const answersArray = Array.from({ length: 32 }, (_, i) => Number(answers[`q${i + 1}`] ?? 0));
    const soapText = `HCL-32: ${totalScore}/32 pts (${classification}) [Ativação: ${ativacaoScore}/19 | Risco/Irritabilidade: ${riscoScore}/13] | Fonte: Angst et al., 2005 (Validação BR: Soares & Moreno, 2010 - Corte ≥18)`;

    return {
      scaleId: 'hcl-32',
      scaleTitle: 'HCL-32',
      totalScore,
      maxScore: 32,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 32,
      totalRequired: 32,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Escore < 14 — Rastreio Negativo para Hipomania',
      description: 'Baixa probabilidade de episódios hipomaníacos prévios. Se o paciente apresentar queixa depressiva atual, conduzir o tratamento de acordo com as diretrizes para Transtorno Depressivo Maior unipolar.',
      badge: '0-13 pts: Negativo',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 14 a 17 — Traços Moderados de Hipomania (Corte Internacional)',
      description: 'Aprofundar a anamnese cronológica com o paciente e informantes familiares. Investigar períodos de aumento súbito de energia, redução objetiva da necessidade de sono (dormir 3-4h e acordar descansado) e impulsividade com dinheiro ou relacionamentos.',
      badge: '14-17 pts: Moderado',
      badgeType: 'warning',
    },
    {
      title: 'Escore ≥ 18 — Rastreio Positivo no Brasil (Soares & Moreno, 2010)',
      description: 'Forte suspeita de Transtorno do Espectro Bipolar (especialmente Transtorno Bipolar Tipo II ou ciclotimia). Investigar duração dos períodos de elação/irritabilidade (mínimo de 4 dias consecutivos conforme DSM-5) e histórico familiar de transtorno de humor ou suicídio.',
      badge: '≥ 18 pts: Positivo (Corte BR)',
      badgeType: 'danger',
    },
    {
      title: '⚠️ REGRA DE OURO: Contraindicação de Antidepressivo em Monoterapia',
      description: 'NUNCA prescrever antidepressivos isolados para pacientes deprimidos com HCL-32 ≥ 18 sem estabilizador de humor associado. A monoterapia antidepressiva pode desencadear virada maníaca, aceleração de ciclagem, disforia mista e aumento agudo do risco de suicídio.',
      badge: 'Alerta Absoluto',
      badgeType: 'danger',
    },
    {
      title: 'Pactuação Terapêutica & Apoio Matricial em Saúde Mental',
      description: 'Discutir o caso no Apoio Matricial / Psiquiatria para introdução e titulação de estabilizadores de humor de 1ª linha (Carbonato de Lítio, Lamotrigina, Quetiapina ou Valproato de Sódio).',
      badge: 'Matriciamento',
      badgeType: 'warning',
    },
  ],
  monitoringGoals: [
    {
      title: 'Estabilização Timolépica & Regulação Circadiana',
      description: 'Alcançar eutanásia do humor sem oscilações maníacas ou depressivas. Estabelecer rotina estrita de sono-vigília (higiene circadiana) como pilar não farmacológico essencial.',
    },
    {
      title: 'Monitoramento Laboratorial de Estabilizadores',
      description: 'Para Lítio: Litiemia a cada 3-6 meses (alvo 0,6 a 0,8 mEq/L na manutenção), TSH, Ureia e Creatinina. Para Valproato: Enzimas hepáticas (TGO/TGP) e hemograma com plaquetas.',
    },
    {
      title: 'Psicoeducação Familiar de Sinais Precoces de Recaída',
      description: 'Orientar o paciente e sua família a reconhecer os pródromos de hipomania (diminuição da necessidade de sono, loquacidade excessiva, compras desnecessárias) para ajuste posológico precoce.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Estudo de Validação Brasileiro (FMUSP)',
      text: 'O estudo de validação no Brasil realizado por Soares, Moreno, Moura & Angst (Rev Bras Psiquiatr, 2010; 32(4):438-45) demonstrou que o ponto de corte ótimo na população brasileira é de 18 pontos (Sensibilidade 75%, Especificidade 58% e Alfa de Cronbach 0.86).',
      reference: 'Soares OT et al. Rev Bras Psiquiatr. 2010; 32(4):438-445.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: A Ilusão do "Estou Apenas Ótimo"',
      text: 'Pacientes com Bipolar Tipo II demoram em média 8 a 10 anos para receber o diagnóstico correto, pois só procuram a UBS nas fases depressivas e consideram os períodos de hipomania como os únicos momentos em que "finalmente estavam saudáveis, produtivos e inspirados".',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: Diferenciar Hipomania de Alívio Pós-Depressão',
      text: 'Não confunda a recuperação do humor deprimido com hipomania. A hipomania verdadeira cursa com alteração quantitativa do sono (dorme poucas horas sem sentir cansaço diurno), desinibição social anormal, pressão para falar e projetos mirabolantes não finalizados.',
    },
  ],
};

export const AUDIT_SCALE: ScaleDefinition = {
  id: 'audit',
  title: 'AUDIT (Alcohol Use Disorders Identification Test)',
  acronym: 'AUDIT',
  targetGroup: 'Adultos e adolescentes na APS para rastreamento de padrão de consumo e dependência de álcool',
  description: 'Instrumento desenvolvido pela OMS e amplamente validado no Brasil para identificação precoce do uso de risco, uso nocivo e provável dependência de álcool na Atenção Primária.',
  shortInstruction: 'Avalie o padrão de consumo de bebidas alcoólicas no último ano.',
  instructions: 'Para cada pergunta abaixo, selecione a resposta que melhor reflete seus hábitos de consumo de bebidas alcoólicas no último ano.',
  referenceCitation: 'Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. WHO/MSD/MSB/01.6a, 2001. Validação brasileira: Mendez EB (1999); Moretti-Pires RO, Corradi-Webster CM (2011).',
  validationInfo: 'Padrão-ouro da OMS validado no Brasil para a APS. Sensibilidade: 92%, Especificidade: 94% para uso de risco (corte ≥ 8).',
  cutoffInfo: '0-7: Baixo Risco | 8-15: Uso de Risco | 16-19: Uso Nocivo | 20-40: Provável Dependência (Corte ≥ 8)',
  estimatedMinutes: 3,
  questions: [
    {
      id: 'q1',
      text: '1. Com que frequência consome bebidas que contêm álcool?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Mensalmente ou menos', value: 1 },
        { label: '2 a 4 vezes por mês', value: 2 },
        { label: '2 a 3 vezes por semana', value: 3 },
        { label: '4 ou mais vezes por semana', value: 4 },
      ],
      subscale: 'consumo',
    },
    {
      id: 'q2',
      text: '2. Quantas doses de bebida alcoólica consome num dia normal em que bebe? (1 dose = 1 lata de cerveja, 1 taça de vinho ou 1 shot de destilado)',
      options: [
        { label: '1 ou 2 doses', value: 0 },
        { label: '3 ou 4 doses', value: 1 },
        { label: '5 ou 6 doses', value: 2 },
        { label: '7 a 9 doses', value: 3 },
        { label: '10 ou mais doses', value: 4 },
      ],
      subscale: 'consumo',
    },
    {
      id: 'q3',
      text: '3. Com que frequência consome 6 ou mais doses de bebida alcoólica numa única ocasião ("binge drinking")?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'consumo',
    },
    {
      id: 'q4',
      text: '4. Com que frequência, durante o último ano, percebeu que não conseguia parar de beber uma vez que havia começado?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'dependencia',
    },
    {
      id: 'q5',
      text: '5. Com que frequência, durante o último ano, não conseguiu fazer o que era esperado de você devido à bebida?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'dependencia',
    },
    {
      id: 'q6',
      text: '6. Com que frequência, durante o último ano, precisou de uma primeira dose pela manhã para se recuperar após uma bebedeira anterior?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'dependencia',
    },
    {
      id: 'q7',
      text: '7. Com que frequência, durante o último ano, teve sentimentos de culpa ou remorso após ter bebido?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'problemas',
    },
    {
      id: 'q8',
      text: '8. Com que frequência, durante o último ano, não conseguiu se lembrar do que aconteceu na noite anterior por ter bebido?',
      options: [
        { label: 'Nunca', value: 0 },
        { label: 'Menos de uma vez por mês', value: 1 },
        { label: 'Mensalmente', value: 2 },
        { label: 'Semanalmente', value: 3 },
        { label: 'Diariamente ou quase diariamente', value: 4 },
      ],
      subscale: 'problemas',
    },
    {
      id: 'q9',
      text: '9. Você ou outra pessoa já se machucou em consequência de você ter bebido?',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim, mas não no último ano', value: 2 },
        { label: 'Sim, durante o último ano', value: 4 },
      ],
      subscale: 'problemas',
    },
    {
      id: 'q10',
      text: '10. Algum parente, amigo, médico ou outro profissional de saúde já se preocupou com seu hábito de beber ou sugeriu que você parasse?',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim, mas não no último ano', value: 2 },
        { label: 'Sim, durante o último ano', value: 4 },
      ],
      subscale: 'problemas',
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(AUDIT_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(AUDIT_SCALE, validation);
    }

    let totalScore = 0;
    const q1 = Number(answers['q1'] || 0);
    const q2 = Number(answers['q2'] || 0);
    const q3 = Number(answers['q3'] || 0);
    const q4 = Number(answers['q4'] || 0);
    const q5 = Number(answers['q5'] || 0);
    const q6 = Number(answers['q6'] || 0);
    const q7 = Number(answers['q7'] || 0);
    const q8 = Number(answers['q8'] || 0);
    const q9 = Number(answers['q9'] || 0);
    const q10 = Number(answers['q10'] || 0);

    const consumoScore = q1 + q2 + q3;
    const dependenciaScore = q4 + q5 + q6;
    const problemasScore = q7 + q8 + q9 + q10;

    totalScore = consumoScore + dependenciaScore + problemasScore;

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (totalScore <= 7) {
      classification = 'Zona I: Uso de Baixo Risco ou Abstinência';
      severityLevel = 'low';
      interpretation = `Escore de ${totalScore}/40 pontos. Padrão de consumo atual com baixo risco de danos à saúde física e psicossocial.`;
      recs.push('Educação em saúde sobre limites seguros de consumo e riscos da associação com medicamentos', 'Manter acompanhamento de rotina');
    } else if (totalScore <= 15) {
      classification = 'Zona II: Uso de Risco (Intervenção Breve Recomendada)';
      severityLevel = 'moderate';
      interpretation = `Escore de ${totalScore}/40 pontos (corte ≥ 8 atingido). Consumo que excede os limites de segurança e eleva risco de morbidades e acidentes.`;
      recs.push(
        'Realizar Intervenção Breve (IB) na própria consulta da APS (Feedback, Responsabilidade, Aconselhamento, Menu de opções, Empatia, Autoeficácia - FRAMES)',
        'Fornecer folheto educativo e pactuar metas de redução do consumo',
        'Reavaliar em 1 a 3 meses'
      );
    } else if (totalScore <= 19) {
      classification = 'Zona III: Uso Nocivo de Álcool';
      severityLevel = 'high';
      interpretation = `Escore de ${totalScore}/40 pontos. Presença de danos físicos, psicológicos ou sociais decorrentes do consumo de álcool.`;
      recs.push(
        'Intervenção Breve estruturada + Aconselhamento contínuo e monitoramento regular na APS',
        'Avaliar exames laboratoriais (GGT, TGO, TGP, VCM) e investigar comorbidades psiquiátricas (Depressão, Ansiedade)',
        'Considerar envolvimento da família e discussão com equipe de apoio / NASF'
      );
    } else {
      classification = 'Zona IV: Provável Dependência de Álcool';
      severityLevel = 'severe';
      interpretation = `Escore de ${totalScore}/40 pontos (≥ 20). Forte indicativo de síndrome de dependência de álcool. Alto risco de sintomas de abstinência.`;
      recs.push(
        'Avaliação médica detalhada para risco de Síndrome de Abstinência Alcoólica (SAA / Protocolo CIWA-Ar)',
        'Considerar farmacoterapia para cessação/redução (ex: Naltrexona, Acamprosato, Dissulfiram) e Tiamina profilática',
        'Encaminhamento / Acompanhamento compartilhado com CAPS AD (Atenção Psicossocial Álcool e Drogas)',
        'Articulação com grupos de apoio mútuo (Alcoólicos Anônimos - AA)'
      );
    }

    const answersArray = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10];
    const soapText = `AUDIT: ${totalScore}/40 pts (${classification}) [Consumo: ${consumoScore}/12 | Dependência: ${dependenciaScore}/12 | Problemas: ${problemasScore}/16] | Fonte: OMS (Babor et al., 2001 - Validação BR: Mendez, 1999)`;

    return {
      scaleId: 'audit',
      scaleTitle: 'AUDIT',
      totalScore,
      maxScore: 40,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 10,
      totalRequired: 10,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Zona I (0 a 7 pts) — Uso de Baixo Risco ou Abstinência',
      description: 'Educação em saúde sobre limites seguros de consumo segundo a OMS (máximo de 2 doses/dia para homens e 1 dose/dia para mulheres e idosos, com no mínimo 2 dias livres de álcool por semana). Orientar riscos da associação com psicotrópicos.',
      badge: '0-7 pts: Zona I (Baixo Risco)',
      badgeType: 'neutral',
    },
    {
      title: 'Zona II (8 a 15 pts) — Uso de Risco (Intervenção Breve)',
      description: 'Realizar Intervenção Breve (IB) de 5 a 15 minutos na própria consulta usando o acrônimo FRAMES: 1. Feedback sobre o escore; 2. Responsabilidade do paciente na mudança; 3. Aconselhamento claro e direto; 4. Menu de opções e metas; 5. Postura Empática; 6. Fomento da Autoeficácia. Reavaliar em 1 a 3 meses.',
      badge: '8-15 pts: Zona II (Uso de Risco)',
      badgeType: 'warning',
    },
    {
      title: 'Zona III (16 a 19 pts) — Uso Nocivo de Álcool',
      description: 'Intervenção Breve estruturada + Aconselhamento contínuo na UBS. Solicitar painel laboratorial de rastreio de lesão hepática e hematológica (GGT, TGO, TGP, VCM, Bilirrubinas, Plaquetas). Rastrear comorbidades psiquiátricas frequentes (Depressão - PHQ-9, Ansiedade - GAD-7).',
      badge: '16-19 pts: Zona III (Uso Nocivo)',
      badgeType: 'warning',
    },
    {
      title: 'Zona IV (20 a 40 pts) — Provável Síndrome de Dependência',
      description: 'Avaliação médica imediata para risco de Síndrome de Abstinência Alcoólica (escala CIWA-Ar). Prescrição profilática obrigatória de Tiamina (Vitamina B1) 100 a 300 mg/dia oral. Considerar farmacoterapia anticraving (Naltrexona 50mg/dia ou Acamprosato). Articulação e acompanhamento compartilhado com CAPS AD e grupos de autoajuda (Alcoólicos Anônimos - AA).',
      badge: '20-40 pts: Zona IV (Dependência)',
      badgeType: 'danger',
    },
    {
      title: '⚠️ Prevenção da Encefalopatia de Wernicke',
      description: 'NUNCA prescrever soro glicosado endovenoso para pacientes etilistas desnutridos ou em abstinência sem administrar Tiamina parenteral previamente ou concomitantemente (a infusão de glicose isolada precipita encefalopatia de Wernicke aguda por consumo de estoques críticos de tiamina).',
      badge: 'Alerta Crítico de Emergência',
      badgeType: 'danger',
    },
  ],
  monitoringGoals: [
    {
      title: 'Meta Primária: Redução do Consumo / Cessação',
      description: 'Redução progressiva de dias de consumo pesado ("binge drinking" — ≥ 5 doses para homens ou ≥ 4 doses para mulheres numa mesma ocasião) ou abstinência completa conforme pactuação do paciente.',
    },
    {
      title: 'Normalização dos Marcadores Biológicos',
      description: 'Monitoramento da queda de Gama-GT (GGT) e Volume Corpuscular Médio (VCM) em 6 a 12 semanas após a redução/cessação do consumo alcoólico.',
    },
    {
      title: 'Prevenção de Recaídas & Cuidado Compartilhado',
      description: 'Fortalecimento da rede de suporte sociofamiliar e agendamento de consultas regulares de seguimento na UBS a cada 30 a 60 dias.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Eficácia da Intervenção Breve na Atenção Primária',
      text: 'Ensaios clínicos randomizados demonstram que uma Intervenção Breve de 5 a 15 minutos realizada pelo médico de família reduz o consumo nocivo de álcool em até 30% e diminui significativamente idas à emergência hospitalar e traumas.',
      reference: 'Babor TF et al. WHO/MSD/MSB/01.6a, 2001; Moretti-Pires RO et al. Rev Bras Psiquiatr. 2011.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: Estrutura dos 3 Domínios do AUDIT',
      text: 'Os itens 1-3 avaliam a Quantidade e Frequência do consumo (max 12 pts); os itens 4-6 avaliam Sintomas de Dependência (tolerância, perda de controle, compulsão - max 12 pts); e os itens 7-10 avaliam Problemas e Consequências Danosas (culpa, amnésia alcoólica, traumas - max 16 pts).',
    },
    {
      type: 'pitfall',
      title: 'Armadilha Clínica: Abstinência Aguda Não Reconhecida no Leito/Consultório',
      text: 'Tremores finos de extremidades, sudorese profusa, náuseas, taquicardia e insônia em pacientes internados ou em observação na UBS podem ser os primeiros sinais de Síndrome de Abstinência Alcoólica (SAA). Utilize o protocolo CIWA-Ar e trate precocemente com benzodiazepínicos de meia-vida longa (Diazepam) e Tiamina.',
    },
  ],
};

const ASRS18_OPTIONS: ScaleQuestionOption[] = [
  { label: 'Nunca', value: 0 },
  { label: 'Raramente', value: 1 },
  { label: 'Às vezes', value: 2 },
  { label: 'Frequentemente', value: 3 },
  { label: 'Muito frequentemente', value: 4 },
];

export const ASRS18_SCALE: ScaleDefinition = {
  id: 'asrs-18',
  title: 'ASRS-18 (Adult ADHD Self-Report Scale v1.1)',
  acronym: 'ASRS-18',
  targetGroup: 'Adultos na APS com suspeita de Transtorno do Déficit de Atenção com Hiperatividade (TDAH)',
  description: 'Instrumento oficial da OMS para rastreamento de sintomas de desatenção (9 itens) e hiperatividade/impulsividade (9 itens) em adultos.',
  shortInstruction: 'Avalie a frequência dos comportamentos nos últimos 6 meses.',
  instructions: 'Para cada pergunta abaixo, selecione a resposta que melhor descreve como você se sentiu e se comportou nos últimos 6 meses.',
  referenceCitation: 'Kessler RC, Adler L, Ames M, et al. Psychol Med. 2005; 35(2):245-56. Validação brasileira: Mattos P, Segenreich D, Saboya E, Louzã M, et al. Rev Psiquiatr Clín. 2006; 33(4):188-94.',
  validationInfo: 'Versão brasileira oficial da OMS. Ponto de corte: ≥ 4 respostas positivas no Domínio de Desatenção e/ou no Domínio de Hiperatividade/Impulsividade.',
  cutoffInfo: 'Desatenção: ≥ 4/9 itens positivos | Hiperatividade: ≥ 4/9 itens positivos (Parte A da OMS)',
  estimatedMinutes: 4,
  questions: [
    // Desatenção (Itens 1-9)
    {
      id: 'q1',
      text: '1. Com que frequência você comete erros por falta de atenção quando precisa trabalhar num projeto chato ou difícil?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q2',
      text: '2. Com que frequência você tem dificuldade para manter a atenção quando está fazendo um trabalho chato ou repetitivo?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q3',
      text: '3. Com que frequência você tem dificuldade para se concentrar no que as pessoas dizem, mesmo quando estão falando diretamente com você?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q4',
      text: '4. Com que frequência você tem dificuldade para finalizar os últimos detalhes de um projeto, depois de já ter feito as partes mais difíceis?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q5',
      text: '5. Com que frequência você tem dificuldade para organizar as coisas quando precisa fazer uma tarefa que exige organização?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q6',
      text: '6. Quando você tem uma tarefa que exige muito pensamento, com que frequência você evita ou adia o início?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q7',
      text: '7. Com que frequência você perde ou tem dificuldade para encontrar objetos necessários em casa ou no trabalho?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q8',
      text: '8. Com que frequência você se distrai com barulhos ou outras coisas que acontecem ao seu redor?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    {
      id: 'q9',
      text: '9. Com que frequência você se esquece de compromissos ou obrigações cotidianas?',
      options: ASRS18_OPTIONS,
      subscale: 'desatencao',
    },
    // Hiperatividade / Impulsividade (Itens 10-18)
    {
      id: 'q10',
      text: '10. Com que frequência você mexe as mãos ou os pés ou se contorce na cadeira quando precisa ficar sentado(a)?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q11',
      text: '11. Com que frequência você se levanta da cadeira em reuniões ou em outras situações nas quais deveria ficar sentado(a)?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q12',
      text: '12. Com que frequência você se sente inquieto(a) ou agitado(a) por dentro?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q13',
      text: '13. Com que frequência você tem dificuldade para relaxar e praticar atividades de lazer calmamente?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q14',
      text: '14. Com que frequência você se sente "a todo vapor" ou dirigido(a) por um motor?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q15',
      text: '15. Com que frequência você se pega falando demais em conversas?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q16',
      text: '16. Quando está conversando, com que frequência você termina as frases das pessoas antes delas?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q17',
      text: '17. Com que frequência você tem dificuldade para esperar sua vez em situações nas quais há fila ou espera?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
    {
      id: 'q18',
      text: '18. Com que frequência você interrompe os outros quando eles estão ocupados?',
      options: ASRS18_OPTIONS,
      subscale: 'hiperatividade',
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(ASRS18_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(ASRS18_SCALE, validation);
    }

    // Ponto de corte validado OMS / Mattos et al. (2006):
    // Itens 1, 2, 3, 9, 12, 16, 18 são positivos se >= 2 ('Às vezes', 'Frequentemente', 'Muito frequentemente')
    // Demais itens (4, 5, 6, 7, 8, 10, 11, 13, 14, 15, 17) são positivos se >= 3 ('Frequentemente', 'Muito frequentemente')
    const AS_VEZES_THRESHOLD_ITEMS = new Set(['q1', 'q2', 'q3', 'q9', 'q12', 'q16', 'q18']);
    const isPositiveItem = (qId: string, val: number) => {
      return AS_VEZES_THRESHOLD_ITEMS.has(qId) ? val >= 2 : val >= 3;
    };

    let desatencaoScore = 0;
    let hiperatividadeScore = 0;

    for (let i = 1; i <= 9; i++) {
      const qId = `q${i}`;
      if (answers[qId] !== undefined && isPositiveItem(qId, Number(answers[qId]))) {
        desatencaoScore++;
      }
    }
    for (let i = 10; i <= 18; i++) {
      const qId = `q${i}`;
      if (answers[qId] !== undefined && isPositiveItem(qId, Number(answers[qId]))) {
        hiperatividadeScore++;
      }
    }

    const totalPositive = desatencaoScore + hiperatividadeScore;
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (desatencaoScore >= 4 && hiperatividadeScore >= 4) {
      classification = 'Rastreio Altamente Sugestivo para TDAH em Adultos (Apresentação Combinada/Mista)';
      severityLevel = 'high';
      interpretation = `Corte OMS atingido em ambos os domínios: Desatenção (${desatencaoScore}/9 itens positivos) e Hiperatividade/Impulsividade (${hiperatividadeScore}/9 itens positivos).`;
      recs.push(
        'Investigar história do desenvolvimento na infância e adolescência (critério retrospectivo DSM-5)',
        'Investigar prejuízos funcionais em múltiplos contextos (trabalho, estudos, relacionamentos afetivos)',
        'Descartar comorbidades ou diagnósticos diferenciais (Depressão, TAG, Transtorno Bipolar, Apneia do Sono)',
        'Discutir caso em Apoio Matricial em Saúde Mental'
      );
    } else if (desatencaoScore >= 4) {
      classification = 'Rastreio Sugestivo para TDAH em Adultos (Predomínio Desatento)';
      severityLevel = 'moderate';
      interpretation = `Corte OMS atingido para a dimensão de Desatenção (${desatencaoScore}/9 itens positivos). Hiperatividade: ${hiperatividadeScore}/9.`;
      recs.push('Avaliação clínica detalhada de estratégias de organização, rotina e foco', 'Acompanhamento longitudinal na APS');
    } else if (hiperatividadeScore >= 4) {
      classification = 'Rastreio Sugestivo para TDAH em Adultos (Predomínio Hiperativo/Impulsivo)';
      severityLevel = 'moderate';
      interpretation = `Corte OMS atingido para a dimensão de Hiperatividade/Impulsividade (${hiperatividadeScore}/9 itens positivos). Desatenção: ${desatencaoScore}/9.`;
      recs.push('Investigar impulsividade financeira e comportamental e controle inibitório', 'Acompanhamento longitudinal');
    } else {
      classification = 'Rastreio Negativo para TDAH em Adultos';
      severityLevel = 'low';
      interpretation = 'Pontuação abaixo da linha de corte (menos de 4 pontos positivos em cada domínio).';
      recs.push('Investigar causas secundárias de queixa de desatenção (sobrecarga de trabalho, privação crônica de sono, estresse, ansiedade)');
    }

    const answersArray = Array.from({ length: 18 }, (_, i) => Number(answers[`q${i + 1}`] ?? 0));
    const soapText = `ASRS-18 v1.1 (OMS): Desatenção ${desatencaoScore}/9 positivos | Hiperatividade ${hiperatividadeScore}/9 positivos (${classification}) | Fonte: Kessler et al., 2005 (Validação BR: Mattos et al., 2006)`;

    return {
      scaleId: 'asrs-18',
      scaleTitle: 'ASRS-18',
      totalScore: totalPositive,
      maxScore: 18,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 18,
      totalRequired: 18,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Passo 1: Investigação Retrospectiva na Infância (Obrigatório DSM-5)',
      description: 'O TDAH é um transtorno do neurodesenvolvimento. É obrigatório comprovar que os sintomas já estavam presentes antes dos 12 anos de idade (relatos de pais, irmãos mais velhos, boletins escolares antigos com anotações de desatenção ou agitação).',
      badge: 'Critério DSM-5',
      badgeType: 'warning',
    },
    {
      title: 'Passo 2: Comprovação de Prejuízo em Múltiplos Contextos',
      description: 'Verificar impacto funcional evidente e persistente em pelo menos 2 ambientes distintos da vida adulta (desempenho laboral/acadêmico, finanças pessoais, relacionamentos interpessoais ou acidentes frequentes de trânsito).',
      badge: 'Funcionalidade',
      badgeType: 'warning',
    },
    {
      title: 'Passo 3: Exclusão Criteriosa de Diagnósticos Diferenciais',
      description: 'Descartar causas que mimetizam queixas de desatenção: privação crônica de sono (síndrome do sono insuficiente), Apneia Obstrutiva do Sono, Transtorno Depressivo Maior, TAG, Transtorno Bipolar ou abuso de substâncias.',
      badge: 'Diagnóstico Diferencial',
      badgeType: 'neutral',
    },
    {
      title: 'Passo 4: Plano Terapêutico Integrado (Não Farmacológico + Farmacológico)',
      description: 'Psicoeducação e Terapia Cognitivo-Comportamental focada em TDAH (estratégias visuais, blocos de tempo, alarmes, desfragmentação de tarefas). Para casos com prejuízo moderado a grave, avaliar farmacoterapia de 1ª linha (Psicoestimulantes: Cloridrato de Metilfenidato ou Dimesilato de Lisdexanfetamina; ou Não-estimulantes: Atomoxetina).',
      badge: 'Conduta Terapêutica',
      badgeType: 'neutral',
    },
    {
      title: '⚠️ Avaliação Cardiovascular Pré-Estimulante',
      description: 'Antes de iniciar psicoestimulantes em adultos, aferir rigorosamente a Pressão Arterial e Frequência Cardíaca basais, pesquisar história pessoal ou familiar de morte súbita precoce, arritmias graves e solicitar ECG basal.',
      badge: 'Segurança Clínica',
      badgeType: 'danger',
    },
  ],
  monitoringGoals: [
    {
      title: 'Otimização Executiva e Redução do Prejuízo Funcional',
      description: 'Avaliar melhora na conclusão de tarefas laborais no prazo, diminuição de erros por distração e melhora na pontualidade e gestão do tempo.',
    },
    {
      title: 'Monitoramento Cardiovascular e de Efeitos Adversos',
      description: 'Aferição de PA, FC, peso e rastreio de sintomas adversos (insônia inicial, boca seca, perda de apetite, cefaleia, ansiedade de rebote) em cada consulta de renovação de receituário controlado.',
    },
    {
      title: 'Prevenção do Uso Indevido / Desvio',
      description: 'Prescrever quantidades estritas para 30 a 60 dias com Notificação de Receita A (amarela) ou respectivo talonário de controle especial, orientando guarda segura.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Validação da Versão da OMS (ASRS v1.1)',
      text: 'Desenvolvido pelo grupo de trabalho de TDAH em adultos da Organização Mundial da Saúde em conjunto com Harvard Medical School (Kessler et al., 2005) e validado no Brasil por Paulo Mattos et al. (Rev Psiquiatr Clín, 2006).',
      reference: 'Kessler RC et al. Psychol Med. 2005; Mattos P et al. Rev Psiquiatr Clin. 2006.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: A Metamorfose da Hiperatividade no Adulto',
      text: 'A hiperatividade motora visível da infância (correr, subir em móveis) transforma-se no adulto em uma sensação interna contínua de "mente a mil por hora" que nunca desliga, impaciência com lentidão alheia, interrupção constante da fala dos outros e necessidade de estar sempre fazendo múltiplas tarefas.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: TDAH de Início Recente no Adulto NÃO Existe',
      text: 'Se um paciente adulto relata que a falta de foco e o esquecimento começaram há alguns meses ou anos, trata-se de burnout, depressão, ansiedade, sobrecarga de multitarefas ou insônia crônica, NUNCA TDAH (que por definição neurobiológica inicia-se na infância).',
    },
  ],
};

export const SNAP_IV_SCALE: ScaleDefinition = {
  id: 'snap-iv',
  title: 'SNAP-IV (Swanson, Nolan, and Pelham Rating Scale)',
  acronym: 'SNAP-IV',
  targetGroup: 'Crianças e adolescentes na APS (preenchido por pais ou professores) para triagem de TDAH e TOD',
  description: 'Escala de 18 itens correspondentes aos critérios do DSM-IV / DSM-5 para Desatenção (itens 1-9) e Hiperatividade/Impulsividade (itens 10-18).',
  shortInstruction: 'Avalie a frequência de cada comportamento da criança nos últimos 6 meses.',
  instructions: 'Para cada item, selecione o grau em que o comportamento foi apresentado pela criança ou adolescente nos últimos 6 meses no ambiente doméstico ou escolar.',
  referenceCitation: 'Swanson JM, et al. 2001. Validação brasileira: Mattos P, Serra-Pinheiro MA, Rohde LA, Pinto D. Rev Psiquiatr Rio Gd Sul. 2006; 28(3):290-297.',
  validationInfo: 'Versão brasileira validada. Ponto de corte positivo: presença de 6 ou mais itens pontuados como "Bastante" ou "Demais" (valor ≥ 2) por domínio, ou média de escores > percentil 95.',
  cutoffInfo: 'Desatenção: ≥ 6 itens significativos | Hiperatividade: ≥ 6 itens significativos (Corte DSM-5)',
  estimatedMinutes: 4,
  questions: [
    // 1-9 Desatenção
    { id: 'q1', text: '1. Não consegue prestar muita atenção a detalhes ou comete erros por descuido nos trabalhos escolares ou tarefas.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q2', text: '2. Tem dificuldade para manter a atenção em tarefas ou jogos.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q3', text: '3. Parece não escutar quando se fala diretamente com ela.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q4', text: '4. Não segue instruções até o fim e não termina deveres escolares, tarefas domésticas ou deveres.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q5', text: '5. Tem dificuldade para organizar tarefas e atividades.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q6', text: '6. Evita, não gosta ou reluta em se envolver em tarefas que exigem esforço mental constante (como lição de casa).', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q7', text: '7. Perde coisas necessárias para tarefas ou atividades (brinquedos, lápis, livros, cadernos).', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q8', text: '8. É facilmente distraído(a) por estímulos externos.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q9', text: '9. É esquecido(a) em atividades do dia a dia.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    // 10-18 Hiperatividade/Impulsividade
    { id: 'q10', text: '10. Mexe com as mãos ou os pés ou se remexe na cadeira.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q11', text: '11. Sai da cadeira em sala de aula ou em outras situações em que se espera que fique sentado(a).', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q12', text: '12. Corre ou sobe nas coisas em demasia em situações nas quais isso é inapropriado.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q13', text: '13. Tem dificuldade para brincar ou se envolver silenciosamente em atividades de lazer.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q14', text: '14. Não para ou frequentemente age como se estivesse "a todo vapor" ou movido(a) por um motor.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q15', text: '15. Fala demais.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q16', text: '16. Responde precipitadamente antes de as perguntas terem sido terminadas.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q17', text: '17. Tem dificuldade para esperar a sua vez.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
    { id: 'q18', text: '18. Interrompe os outros ou se intromete em conversas ou jogos.', options: [{ label: 'Nem um pouco', value: 0 }, { label: 'Só um pouco', value: 1 }, { label: 'Bastante', value: 2 }, { label: 'Demais', value: 3 }] },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(SNAP_IV_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(SNAP_IV_SCALE, validation);
    }

    let desatencaoItems = 0;
    let desatencaoTotalScore = 0;
    for (let i = 1; i <= 9; i++) {
      const val = Number(answers[`q${i}`] || 0);
      desatencaoTotalScore += val;
      if (val >= 2) desatencaoItems++;
    }

    let hiperTotalScore = 0;
    let hiperItems = 0;
    for (let i = 10; i <= 18; i++) {
      const val = Number(answers[`q${i}`] || 0);
      hiperTotalScore += val;
      if (val >= 2) hiperItems++;
    }

    const meanDesatencao = (desatencaoTotalScore / 9).toFixed(2);
    const meanHiper = (hiperTotalScore / 9).toFixed(2);

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (desatencaoItems >= 6 && hiperItems >= 6) {
      classification = 'Rastreio Positivo para TDAH na Infância/Adolescência (Apresentação Combinada)';
      severityLevel = 'high';
      interpretation = `Critérios atingidos em Desatenção (${desatencaoItems}/9 itens significativos, média ${meanDesatencao}) e Hiperatividade (${hiperItems}/9 itens significativos, média ${meanHiper}).`;
      recs.push(
        'Solicitar preenchimento da escala pelos professores/escola para confirmar sintomas em múltiplos ambientes',
        'Avaliar acuidade auditiva e visual e marcos do desenvolvimento neuropsicomotor',
        'Discussão matricial com eNASF / Saúde Mental Infantil / Pediatria'
      );
    } else if (desatencaoItems >= 6) {
      classification = 'Rastreio Positivo para TDAH (Predomínio Desatento)';
      severityLevel = 'moderate';
      interpretation = `Critérios atingidos para Desatenção (${desatencaoItems}/9 itens significativos, média ${meanDesatencao}). Hiperatividade: ${hiperItems}/9 itens.`;
      recs.push('Avaliar ambiente escolar e de aprendizagem', 'Acompanhamento na APS');
    } else if (hiperItems >= 6) {
      classification = 'Rastreio Positivo para TDAH (Predomínio Hiperativo/Impulsivo)';
      severityLevel = 'moderate';
      interpretation = `Critérios atingidos para Hiperatividade (${hiperItems}/9 itens significativos, média ${meanHiper}). Desatenção: ${desatencaoItems}/9 itens.`;
      recs.push('Orientações de rotina, limites e estrutura comportamental', 'Acompanhamento na APS');
    } else {
      classification = 'Rastreio SNAP-IV Negativo para TDAH';
      severityLevel = 'low';
      interpretation = 'Sintomas abaixo do ponto de corte (menos de 6 itens significativos por domínio).';
      recs.push('Acompanhamento longitudinal de puericultura/APS');
    }

    const answersArray = Array.from({ length: 18 }, (_, i) => Number(answers[`q${i + 1}`] ?? 0));
    const soapText = `SNAP-IV: Desatenção média ${meanDesatencao} (${desatencaoItems}/9 itens) | Hiperatividade média ${meanHiper} (${hiperItems}/9 itens) - ${classification} | Fonte: Swanson, 2001 (Validação BR: Mattos et al., 2006)`;

    return {
      scaleId: 'snap-iv',
      scaleTitle: 'SNAP-IV',
      totalScore: desatencaoTotalScore + hiperTotalScore,
      maxScore: 54,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 18,
      totalRequired: 18,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Passo 1: Coleta Pareada Obrigatória (Pais + Professores)',
      description: 'O diagnóstico de TDAH na infância exige manifestação dos sintomas em pelo menos dois ambientes distintos (casa e escola). Solicitar que os professores preencham a versão escolar do SNAP-IV para confrontar as respostas.',
      badge: 'Multiambiente',
      badgeType: 'warning',
    },
    {
      title: 'Passo 2: Exame Físico, Sensorial & Neurodesenvolvimento',
      description: 'Triagem de acuidade visual (Tabela de Snellen) e auditiva na UBS. Avaliar marcos do desenvolvimento neuropsicomotor, lateralidade, tônus e descartar crises de ausência (epilepsia tipo ausência).',
      badge: 'Exame Clínico',
      badgeType: 'neutral',
    },
    {
      title: 'Passo 3: Intervenções Não Farmacológicas na Escola e Família',
      description: 'Treinamento de pais em manejo comportamental (reforço positivo, rotina clara, comandos curtos). Orientações pedagógicas à escola: sentar na primeira fileira longe de janelas/portas, segmentar tarefas e permitir pequenas pausas monitoradas.',
      badge: 'Intervenção 1ª Linha',
      badgeType: 'neutral',
    },
    {
      title: 'Passo 4: Farmacoterapia Escalonada & Monitoramento Somatométrico',
      description: 'Para casos moderados a graves com prejuízo pedagógico e social evidente: Metilfenidato (iniciar com 5-10mg/dia com café da manhã/almoço). Monitorar rigorosamente a curva de peso e estatura (curva OMS) e sono.',
      badge: 'Farmacoterapia',
      badgeType: 'warning',
    },
    {
      title: 'Passo 5: Matriciamento com eMulti / Saúde Mental Infantil / Pediatria',
      description: 'Discutir casos refratários, presença de comorbidades (Transtorno Opositivo-Desafiador - TOD, dislexia, ansiedade de separação) com a equipe de matriciamento em saúde da criança.',
      badge: 'Matriciamento',
      badgeType: 'neutral',
    },
  ],
  monitoringGoals: [
    {
      title: 'Rendimento Pedagógico e Comportamental',
      description: 'Avaliar a redução de anotações e advertências escolares, entrega de tarefas no prazo e melhora na socialização com colegas de turma.',
    },
    {
      title: 'Vigilância Antropométrica Trimestral',
      description: 'Aferição trimestral de peso, estatura e IMC plotted nas curvas de crescimento da OMS para identificar precocemente desaceleração de crescimento ou hiporexia induzida por estimulantes.',
    },
    {
      title: 'Pausas Medicamentosas Programadas ("Drug Holidays")',
      description: 'Avaliar com a família e psiquiatra/pediatra a realização de pausas nos finais de semana ou férias escolares para avaliar a persistência dos sintomas e recuperar o apetite.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Validação Brasileira com Normas Populacionais',
      text: 'Validada no Brasil por Mattos, Serra-Pinheiro, Rohde & Pinto (Rev Psiquiatr Rio Gd Sul, 2006). A escala possui 18 itens diretamente derivados dos critérios diagnósticos do DSM-IV e DSM-5.',
      reference: 'Mattos P et al. Rev Psiquiatr Rio Gd Sul. 2006; 28(3):290-297.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: A Regra dos 6 Itens Significativos',
      text: 'O ponto de corte clínico no Brasil considera a presença de 6 ou mais itens pontuados como "Bastante (2)" ou "Demais (3)" em cada um dos subdomínios (Desatenção ou Hiperatividade/Impulsividade), refletindo o critério do DSM-5.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: Sintomas Restritos a Apenas Um Ambiente',
      text: 'Se a criança só apresenta desatenção na escola mas é perfeitamente atenta em casa e nos esportes (ou vice-versa), NÃO é TDAH. Investigue bullying, defasagem pedagógica, problemas de visão/audição ou dinâmica familiar disfuncional.',
    },
  ],
};

export const YBOCS_SCALE: ScaleDefinition = {
  id: 'ybocs',
  title: 'Y-BOCS (Yale-Brown Obsessive Compulsive Scale)',
  acronym: 'Y-BOCS',
  targetGroup: 'Pacientes na APS com queixas de pensamentos obsessivos intrusivos ou rituais compulsivos',
  description: 'Escala clínica padrão-ouro para mensuração da gravidade dos sintomas do Transtorno Obsessivo-Compulsivo (TOC).',
  shortInstruction: 'Avalie a gravidade das obsessões e compulsões na última semana.',
  instructions: 'Classifique o tempo ocupado, interferência, angústia, resistência e grau de controle sobre as obsessões (itens 1-5) e compulsões (itens 6-10) na última semana.',
  referenceCitation: 'Goodman WK, Price LH, Rasmussen SA, et al. Arch Gen Psychiatry. 1989; 46(11):1006-11. Versão brasileira validada: Cordioli AV et al. (1998).',
  validationInfo: 'Padrão-ouro internacional e brasileiro para avaliação da gravidade do TOC. 10 itens clínicos (0 a 40 pontos).',
  cutoffInfo: '0-7: Subclínico | 8-15: Leve | 16-23: Moderado | 24-31: Grave | 32-40: Extremo',
  estimatedMinutes: 4,
  questions: [
    {
      id: 'q1',
      text: '1. Tempo ocupado por pensamentos obsessivos por dia',
      options: [
        { label: 'Nenhum', value: 0 },
        { label: 'Menos de 1h/dia', value: 1 },
        { label: '1h a 3h/dia', value: 2 },
        { label: '3h a 8h/dia', value: 3 },
        { label: 'Mais de 8h/dia', value: 4 },
      ],
      subscale: 'obsessoes'
    },
    {
      id: 'q2',
      text: '2. Interferência das obsessões nas atividades sociais ou ocupacionais',
      options: [
        { label: 'Nenhuma', value: 0 },
        { label: 'Leve', value: 1 },
        { label: 'Moderada', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Extrema / Incapacitante', value: 4 },
      ],
      subscale: 'obsessoes'
    },
    {
      id: 'q3',
      text: '3. Sofrimento/angústia causado pelas obsessões',
      options: [
        { label: 'Nenhum', value: 0 },
        { label: 'Pouco / Leve', value: 1 },
        { label: 'Moderado', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Insuportável', value: 4 },
      ],
      subscale: 'obsessoes'
    },
    {
      id: 'q4',
      text: '4. Resistência contra as obsessões (tentativa de ignorar ou afastar)',
      options: [
        { label: 'Sempre tenta resistir', value: 0 },
        { label: 'Muitas vezes resiste', value: 1 },
        { label: 'Alguma resistência', value: 2 },
        { label: 'Raramente resiste', value: 3 },
        { label: 'Entrega-se completamente', value: 4 },
      ],
      subscale: 'obsessoes'
    },
    {
      id: 'q5',
      text: '5. Grau de controle sobre os pensamentos obsessivos',
      options: [
        { label: 'Controle total', value: 0 },
        { label: 'Muito controle', value: 1 },
        { label: 'Controle moderado', value: 2 },
        { label: 'Pouco controle', value: 3 },
        { label: 'Nenhum controle', value: 4 },
      ],
      subscale: 'obsessoes'
    },
    {
      id: 'q6',
      text: '6. Tempo gasto executando comportamentos compulsivos ou rituais por dia',
      options: [
        { label: 'Nenhum', value: 0 },
        { label: 'Menos de 1h/dia', value: 1 },
        { label: '1h a 3h/dia', value: 2 },
        { label: '3h a 8h/dia', value: 3 },
        { label: 'Mais de 8h/dia', value: 4 },
      ],
      subscale: 'compulsoes'
    },
    {
      id: 'q7',
      text: '7. Interferência das compulsões na rotina diária e atividades',
      options: [
        { label: 'Nenhuma', value: 0 },
        { label: 'Leve', value: 1 },
        { label: 'Moderada', value: 2 },
        { label: 'Grave', value: 3 },
        { label: 'Incapacitante', value: 4 },
      ],
      subscale: 'compulsoes'
    },
    {
      id: 'q8',
      text: '8. Ansiedade gerada caso as compulsões sejam impedidas de serem realizadas',
      options: [
        { label: 'Nenhuma ansiedade', value: 0 },
        { label: 'Ansiedade leve', value: 1 },
        { label: 'Ansiedade moderada', value: 2 },
        { label: 'Ansiedade grave', value: 3 },
        { label: 'Ansiedade extrema / pânico', value: 4 },
      ],
      subscale: 'compulsoes'
    },
    {
      id: 'q9',
      text: '9. Resistência contra a realização dos rituais compulsivos',
      options: [
        { label: 'Tenta resistir sempre', value: 0 },
        { label: 'Resiste na maioria das vezes', value: 1 },
        { label: 'Tenta resistir às vezes', value: 2 },
        { label: 'Raramente resiste', value: 3 },
        { label: 'Rende-se totalmente', value: 4 },
      ],
      subscale: 'compulsoes'
    },
    {
      id: 'q10',
      text: '10. Grau de controle sobre os comportamentos compulsivos',
      options: [
        { label: 'Controle total', value: 0 },
        { label: 'Muito controle', value: 1 },
        { label: 'Controle moderado', value: 2 },
        { label: 'Pouco controle', value: 3 },
        { label: 'Nenhum controle', value: 4 },
      ],
      subscale: 'compulsoes'
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(YBOCS_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(YBOCS_SCALE, validation);
    }

    let totalScore = 0;
    let obsScore = 0;
    let compScore = 0;

    for (let i = 1; i <= 5; i++) {
      obsScore += Number(answers[`q${i}`] || 0);
    }
    for (let i = 6; i <= 10; i++) {
      compScore += Number(answers[`q${i}`] || 0);
    }
    totalScore = obsScore + compScore;

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    let interpretation = '';
    const recs: string[] = [];

    if (totalScore <= 7) {
      classification = 'Sintomas subclínicos ou mínimos de TOC';
      severityLevel = 'low';
      interpretation = `Escore de ${totalScore}/40 pontos (Obsessões: ${obsScore}/20, Compulsões: ${compScore}/20). Sintomas sem prejuízo funcional marcante.`;
      recs.push('Acompanhamento longitudinal de rotina na APS');
    } else if (totalScore <= 15) {
      classification = 'TOC de intensidade leve';
      severityLevel = 'low';
      interpretation = `Escore de ${totalScore}/40 pontos. Obsessões: ${obsScore}/20, Compulsões: ${compScore}/20. Impacto diário leve.`;
      recs.push('Considerar Terapia Cognitivo-Comportamental com Exposição e Prevenção de Resposta (EPR)', 'Acompanhamento na APS');
    } else if (totalScore <= 23) {
      classification = 'TOC de intensidade moderada';
      severityLevel = 'moderate';
      interpretation = `Escore de ${totalScore}/40 pontos. Obsessões: ${obsScore}/20, Compulsões: ${compScore}/20. Prejuízo funcional significativo no cotidiano.`;
      recs.push('Indicação de ISRS em doses elevadas (ex: Fluoxetina 40-80mg, Sertralina 150-200mg) e/ou TCC focada em TOC', 'Acompanhamento quinzenal');
    } else if (totalScore <= 31) {
      classification = 'TOC de intensidade grave';
      severityLevel = 'high';
      interpretation = `Escore de ${totalScore}/40 pontos. Obsessões: ${obsScore}/20, Compulsões: ${compScore}/20. Sintomas acentuados e interferência marcante na vida pessoal e familiar.`;
      recs.push('Tratamento combinado obrigatório (Farmacoterapia otimizada + TCC/EPR)', 'Discutir caso com Apoio Matricial em Psiquiatria');
    } else {
      classification = 'TOC extremamente grave / incapacitante';
      severityLevel = 'severe';
      interpretation = `Escore de ${totalScore}/40 pontos. Obsessões: ${obsScore}/20, Compulsões: ${compScore}/20. Incapacidade quase total para atividades cotidianas.`;
      recs.push('Apoio Matricial urgente e considerar encaminhamento para CAPS / Ambulatório Especializado de TOC');
    }

    const answersArray = Array.from({ length: 10 }, (_, i) => Number(answers[`q${i + 1}`] ?? 0));
    const soapText = `Y-BOCS: ${totalScore}/40 pts (${classification}) [Obsessões: ${obsScore}/20 | Compulsões: ${compScore}/20] | Fonte: Goodman et al., 1989 (Validação BR: Cordioli, 1998)`;

    return {
      scaleId: 'ybocs',
      scaleTitle: 'Y-BOCS',
      totalScore,
      maxScore: 40,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 10,
      totalRequired: 10,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Escore 0 a 7 — Sintomas Subclínicos de TOC',
      description: 'Sintomas mínimos sem prejuízo funcional marcante. Psicoeducação sobre pensamentos intrusivos comuns e seguimento de rotina na APS.',
      badge: '0-7 pts: Subclínico',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 8 a 15 — TOC de Intensidade Leve',
      description: 'Terapia Cognitivo-Comportamental (TCC) com foco em Exposição e Prevenção de Resposta (EPR) é o tratamento de 1ª linha recomendado. Treino de tolerância à incerteza e quebra de rituais.',
      badge: '8-15 pts: Leve',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 16 a 23 — TOC de Intensidade Moderada',
      description: 'Tratamento combinado: TCC/EPR associada a Farmacoterapia com ISRS em doses terapêuticas plenas (Fluoxetina 40-60mg, Sertralina 150-200mg, Escitalopram 20mg). Retornos a cada 2 a 4 semanas.',
      badge: '16-23 pts: Moderado',
      badgeType: 'warning',
    },
    {
      title: 'Escore 24 a 31 — TOC de Intensidade Grave',
      description: 'ISRS em dose máxima permitida (ex: Fluoxetina 80mg, Sertralina 200mg) com tempo de espera terapêutico de 10 a 12 semanas. Discutir com Apoio Matricial / Psiquiatria para potencialização (Aripiprazol 2-5mg, Risperidona 0,5-1mg ou Clomipramina).',
      badge: '24-31 pts: Grave',
      badgeType: 'danger',
    },
    {
      title: 'Escore 32 a 40 — TOC Extremo / Incapacitante',
      description: 'Incapacidade quase total para autocuidado e atividades da vida diária. Articular encaminhamento para CAPS / Ambulatório Especializado em TOC e suporte psicossocial à família.',
      badge: '32-40 pts: Extremo',
      badgeType: 'danger',
    },
    {
      title: '⚠️ Orientação Anti-Acomodação Familiar',
      description: 'Orientar a família a não participar nem facilitar os rituais (não limpar para o paciente, não responder a perguntas repetitivas de checagem/reasseguramento), pois a acomodação familiar perpetua o ciclo obsessivo-compulsivo.',
      badge: 'Conduta Familiar',
      badgeType: 'warning',
    },
  ],
  monitoringGoals: [
    {
      title: 'Critério de Resposta Clínica (10 a 12 semanas)',
      description: 'Redução ≥ 25% a 35% no escore total da Y-BOCS após tratamento com dose plena de ISRS por período de latência adequado.',
    },
    {
      title: 'Remissão e Normalização Funcional',
      description: 'Escore final da Y-BOCS ≤ 12 pontos com capacidade preservada de desempenhar atividades rotineiras sem interferência incapacitante de rituais.',
    },
    {
      title: 'Manutenção Prolongada (1 a 2 anos)',
      description: 'Manter a farmacoterapia e as técnicas de prevenção de resposta por no mínimo 12 a 24 meses após a remissão devido à alta taxa de recaída do TOC.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Padrão-Ouro Mundial e Validação Brasileira',
      text: 'Desenvolvida por Goodman et al. (Arch Gen Psychiatry, 1989) e validada no Brasil por Aristides Cordioli et al. (UFRGS). É a escala de referência universal para ensaios clínicos e prática clínica no TOC.',
      reference: 'Goodman WK et al. Arch Gen Psychiatry. 1989; Cordioli AV et al. 1998.',
    },
    {
      type: 'pearl',
      title: 'Pérola Farmacológica: Altas Doses e Maior Tempo de Latência',
      text: 'O tratamento medicamentoso do TOC exige doses de ISRS no teto terapêutico (muitas vezes superiores às da depressão) e um tempo de latência de 8 a 12 semanas para o início da resposta clínica.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: Confundir TOC com Ideia Delirante ou Personalidade Anancástica',
      text: 'No TOC, as obsessões são egodistônicas (o paciente reconhece o pensamento como irracional, absurdo ou indesejado, gerando intensa angústia). Se os rituais forem prazerosos e vistos como perfeitos (egossintônicos), avalie Transtorno de Personalidade Obsessivo-Compulsiva.',
    },
  ],
};

export const CSSRS_SCALE: ScaleDefinition = {
  id: 'cssrs',
  title: 'Avaliação de Risco de Suicídio e Segurança (C-SSRS Adaptada APS)',
  acronym: 'C-SSRS / Suicídio',
  targetGroup: 'Qualquer paciente na APS com ideação, sofrimento psíquico intenso ou comportamento autolesivo',
  description: 'Protocolo padronizado de triagem de ideação e comportamento suicida da Universidade de Columbia, adaptado para a Atenção Primária para estratificação de risco imediata e construção de plano de segurança.',
  shortInstruction: 'Aplique de forma direta, empática e acolhedora, sem emitir julgamentos morais.',
  instructions: 'Pergunte diretamente ao paciente de forma empática e sem tabus. Se a resposta for SIM, investigue o detalhamento de plano, meios e histórico prévio.',
  referenceCitation: 'Posner K, Brown GK, Stanley B, et al. Am J Psychiatry. 2011; 168(12):1266-77. Recomendado pelo Ministério da Saúde e Associação Brasileira de Psiquiatria (ABP).',
  validationInfo: 'Instrumento padrão-ouro global com alta confiabilidade preditiva para comportamento e ideação suicida.',
  cutoffInfo: 'Gravidade da Ideação (Itens 1-5): Nível 0 a 5 | Comportamento Suicida (Item 6): Presença / Ausência | Avaliação Clínica Direta Indicada',
  estimatedMinutes: 2,
  questions: [
    {
      id: 'q1',
      text: '1. Desejo passivo de estar morto(a) (Ex: "Teve pensamentos de que gostaria de dormir e não acordar mais?")',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
    {
      id: 'q2',
      text: '2. Pensamentos suicidas ativos não específicos (Ex: "Pensou em se matar, mesmo sem ter um método definido?")',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
    {
      id: 'q3',
      text: '3. Ideação suicida ativa com método em mente (sem plano estruturado nem intenção de agir)',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
    {
      id: 'q4',
      text: '4. Ideação suicida ativa com alguma intenção de agir (sem plano totalmente elaborado)',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
    {
      id: 'q5',
      text: '5. Ideação suicida com plano elaborado e intenção específica de agir',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
    {
      id: 'q6',
      text: '6. Comportamento suicida prévio ou recente (tentativas prévias ao longo da vida, atos preparatórios ou tentativas abortadas/interrompidas)',
      options: [
        { label: 'Não', value: 0 },
        { label: 'Sim', value: 1 },
      ],
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(CSSRS_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(CSSRS_SCALE, validation);
    }

    const q1 = answers['q1'] ? 1 : 0;
    const q2 = answers['q2'] ? 1 : 0;
    const q3 = answers['q3'] ? 1 : 0;
    const q4 = answers['q4'] ? 1 : 0;
    const q5 = answers['q5'] ? 1 : 0;
    const q6 = answers['q6'] ? 1 : 0;

    // 1. Gravidade da Ideação Suicida (Itens 1 a 5 da Columbia)
    let ideationSeverityNumber = 0;
    let ideationSeverityText = 'Nenhuma ideação suicida relatada na avaliação atual';
    if (q5 === 1) {
      ideationSeverityNumber = 5;
      ideationSeverityText = 'Ideação suicida ativa com plano elaborado e intenção de agir (Nível 5)';
    } else if (q4 === 1) {
      ideationSeverityNumber = 4;
      ideationSeverityText = 'Ideação suicida ativa com intenção de agir, sem plano totalmente elaborado (Nível 4)';
    } else if (q3 === 1) {
      ideationSeverityNumber = 3;
      ideationSeverityText = 'Ideação suicida ativa com método em mente, sem intenção de agir (Nível 3)';
    } else if (q2 === 1) {
      ideationSeverityNumber = 2;
      ideationSeverityText = 'Pensamentos suicidas ativos não específicos (Nível 2)';
    } else if (q1 === 1) {
      ideationSeverityNumber = 1;
      ideationSeverityText = 'Desejo passivo de estar morto(a) (Nível 1)';
    }

    // 2. Comportamento Suicida (Dimensão separada da ideação)
    const hasSuicidalBehavior = q6 === 1;
    const behaviorText = hasSuicidalBehavior
      ? 'Presença de comportamento suicida relatado (tentativa prévia, atos preparatórios ou tentativa abortada/interrompida)'
      : 'Nega comportamento suicida prévio ou recente';

    // 3. Necessidade de Avaliação Clínica e Condutas de Segurança
    const clinicalActionRequired = q4 === 1 || q5 === 1 || hasSuicidalBehavior;
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
    const recs: string[] = [];

    if (clinicalActionRequired) {
      severityLevel = 'severe';
      recs.push(
        '⚠️ AVALIAÇÃO CLÍNICA DIRETA E IMEDIATA: Presença de ideação com intenção/plano ou relato de comportamento suicida.',
        'Manter acompanhamento acolhedor na unidade sem deixar o paciente desacompanhado durante a consulta.',
        'Restringir e bloquear imediatamente o acesso a quaisquer meios potencialmente letais (medicamentos no domicílio, objetos perfurocortantes, armas).',
        'Construir ou atualizar o Plano de Segurança Pessoal estruturado (Stanley & Brown) em parceria com o paciente.',
        'Envolver familiar ou pessoa de confiança da rede de apoio de forma compartilhada (com consentimento).',
        'A definição de encaminhamento para atenção especializada (CAPS / emergência) ou acompanhamento intensificado na UBS é decisão exclusivamente médica baseada no julgamento clínico presencial e fatores protetores.'
      );
    } else if (ideationSeverityNumber >= 1) {
      severityLevel = ideationSeverityNumber >= 3 ? 'moderate' : 'low';
      recs.push(
        'Avaliação clínica detalhada da ideação na APS: investigar sofrimento emocional subjacente, precipitantes e rede de apoio.',
        'Pactuar Plano de Segurança Pessoal e fornecer contatos de emergência (CVV 188, UBS, SAMU 192).',
        'Agendar retorno em curto prazo e pactuar canal aberto de escuta na UBS.'
      );
    } else {
      severityLevel = 'low';
      recs.push(
        'Manter acompanhamento de rotina na APS com postura de acolhimento e escuta empática.',
        'Reforçar fatores protetores pessoais e sociais.'
      );
    }

    const classification = `${ideationSeverityText} | Comportamento: ${hasSuicidalBehavior ? 'Positivo' : 'Negativo'}`;
    const interpretation = `C-SSRS (Versão de Triagem APS):
• Gravidade da Ideação: ${ideationSeverityText}
• Comportamento Suicida: ${behaviorText}
• Necessidade de Avaliação Clínica: ${clinicalActionRequired ? 'Avaliação clínica presencial imediata indicada' : ideationSeverityNumber > 0 ? 'Avaliação clínica ambulatorial da ideação indicada' : 'Acompanhamento longitudinal habitual'}
• Nota de Governança: O C-SSRS descreve os achados semiológicos e não substitui o julgamento clínico médico integral, nem determina automaticamente internação ou alta.`;

    const soapText = `C-SSRS (Columbia APS): Ideação: ${ideationSeverityText} | Comportamento: ${hasSuicidalBehavior ? 'Positivo' : 'Negativo'} | Necessidade de Avaliação Clínica: ${clinicalActionRequired ? 'Imediata/Prioritária' : 'Ambulatorial de Rotina'} | Fonte: Posner et al., 2011 (Recomendações ABP/MS)`;

    return {
      scaleId: 'cssrs',
      scaleTitle: 'Triagem C-SSRS / Suicídio',
      totalScore: ideationSeverityNumber,
      maxScore: 5,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray: [q1, q2, q3, q4, q5, q6],
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 6,
      totalRequired: 6,
      ideationSeverityText,
      behaviorText,
      clinicalActionRequired,
      hasCriticalAlert: clinicalActionRequired,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Nível 0 — Sem Ideação Suicida Ativa',
      description: 'Manter postura de acolhimento e escuta empática. Reforçar fatores protetores pessoais e manter canal aberto para que o paciente procure a UBS caso ocorra agravamento do sofrimento emocional.',
      badge: 'Nível 0: Sem Risco Imediato',
      badgeType: 'neutral',
    },
    {
      title: 'Níveis 1 e 2 — Risco Baixo (Desejo Passivo ou Pensamentos Não Específicos)',
      description: '1. Elaborar o Plano de Segurança Pessoal; 2. Identificar rede de apoio socioafetivo; 3. Fornecer contatos de emergência (CVV 188, UBS, SAMU 192); 4. Agendar retorno em 1 a 2 semanas na APS.',
      badge: 'Níveis 1-2: Risco Baixo',
      badgeType: 'neutral',
    },
    {
      title: 'Nível 3 — Risco Moderado (Ideação Ativa com Método, sem Intenção Imediata)',
      description: '1. Envolver familiar ou pessoa de confiança (com consentimento); 2. Bloquear e remover imediatamente o acesso a meios letais no domicílio (guardar medicamentos sob chave, recolher armas/objetos perfurocortantes); 3. Pactuar contato telefônico ou retorno em 24-48h; 4. Discussão com Apoio Matricial / Saúde Mental.',
      badge: 'Nível 3: Risco Moderado',
      badgeType: 'warning',
    },
    {
      title: 'Níveis 4 a 6 — Risco Alto / Emergência em Saúde Mental',
      description: '⚠️ NUNCA DEIXAR O PACIENTE SOZINHO. Manter acolhido na unidade com vigilância contínua da equipe. Remover imediatamente quaisquer objetos cortantes ou medicamentos. Acionar familiar responsável e organizar encaminhamento regulado para emergência psiquiátrica (CAPS III, UPA ou Hospital de Referência).',
      badge: 'Níveis 4-6: Risco Alto / Emergência',
      badgeType: 'danger',
    },
    {
      title: 'Construção do Plano de Segurança em 6 Etapas (Stanley & Brown)',
      description: '1. Reconhecer sinais precoces de crise; 2. Estratégias internas de distração (caminhada, música); 3. Pessoas e ambientes sociais para distração; 4. Familiares para pedir ajuda; 5. Profissionais e serviços de crise; 6. Segurança do ambiente domiciliar.',
      badge: 'Protocolo de Segurança',
      badgeType: 'neutral',
    },
  ],
  monitoringGoals: [
    {
      title: 'Proteção Imediata e Neutralização de Meios Letais',
      description: 'Garantir que 100% dos meios letais domiciliares (psicotrópicos estocados, pesticidas, cordas, armas de fogo) estejam sob custódia segura de um familiar ou responsável.',
    },
    {
      title: 'Engajamento no Plano de Segurança',
      description: 'Verificar se o paciente tem cópia física ou digital do Plano de Segurança e se o familiar de referência conhece os números de emergência (188 e 192).',
    },
    {
      title: 'Seguimento Estreito na Fase Crítica',
      description: 'Contatos semanais nas primeiras 4 semanas de tratamento antidepressivo ou pós-alta de internação psiquiátrica (fase de maior vulnerabilidade).',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Padrão-Ouro Global Recomendado pela ABP e Ministério da Saúde',
      text: 'O Columbia-Suicide Severity Rating Scale (C-SSRS; Posner et al., Am J Psychiatry, 2011) é o instrumento preditivo padrão-ouro mundial para estratificação do comportamento suicida, reduzindo a sobrecarga nas emergências e identificando precocemente pacientes de risco.',
      reference: 'Posner K et al. Am J Psychiatry. 2011; 168(12):1266-77.',
    },
    {
      type: 'pearl',
      title: 'Pérola Vital da Atenção Primária: Perguntar NÃO Induz ao Suicídio',
      text: 'Perguntar clara e diretamente sobre pensamentos de morte ("Você tem pensado em desistir de viver ou se machucar?") NÃO aumenta o risco nem "coloca a ideia na cabeça". Pelo contrário: valida o sofrimento, diminui o isolamento e abre uma janela de acolhimento protetor.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: Melhora Súbita de Energia no Início do Antidepressivo',
      text: 'Quando um paciente gravemente deprimido apresenta um aumento rápido e inexplicável de energia logo após iniciar antidepressivos, fique em alerta máximo: o ganho de energia psicomotora pode preceder a melhora do humor e fornecer o impulso necessário para executar um plano suicida.',
    },
  ],
};

export const MEEM_SCALE: ScaleDefinition = {
  id: 'meem',
  title: 'MEEM - Mini-Exame do Estado Mental (Folstein / Normas Brasileiras de Sônia Maria Brucki)',
  acronym: 'MEEM',
  targetGroup: 'Idosos e adultos na APS com queixa ou suspeita de declínio cognitivo / síndrome demencial',
  description: 'Instrumento padrão de rastreamento cognitivo multidimensional na APS, avaliando orientação temporal/espacial, memória imediata, atenção/cálculo, evocação, linguagem e praxia visuoespacial.',
  shortInstruction: 'Aplique em ambiente calmo e silencioso. Pontue a primeira tentativa em cada tarefa.',
  instructions: 'Siga rigorosamente as instruções do examinador para cada etapa. Pontue 1 para acerto e 0 para erro. Interprete o resultado final de acordo com os pontos de corte por escolaridade propostos por Sônia Maria Dozzi Brucki et al. (2003) e preconizados pelo TelessaúdeRS e Academia Brasileira de Neurologia.',
  referenceCitation: 'Folstein MF, Folstein SE, McHugh PR. J Psychiatr Res. 1975; 12(3):189-98. Validação e Pontos de Corte Brasileiros por Escolaridade: Brucki SMD, Nitrini R, Caramelli P, Bertolucci PH, Okamoto IH. Sugestões para o uso do mini-exame do estado mental no Brasil. Arq Neuropsiquiatr. 2003; 61(3B):777-781. Diretrizes Clínicas: TelessaúdeRS/UFRGS e Caderno de Atenção Básica nº 19 (Envelhecimento e Saúde da Pessoa Idosa - Ministério da Saúde).',
  validationInfo: 'Normatizado no Brasil pelo Grupo de Neurologia Cognitiva (ABN) e TelessaúdeRS com 5 estratos de escolaridade (Brucki et al., 2003). Sensibilidade e especificidade elevadas quando ajustado por anos de estudo.',
  cutoffInfo: 'Pontos de Corte (Brucki, 2003 / TelessaúdeRS): Analfabetos: 20 pts | 1-4 anos: 25 pts | 5-8 anos: 26,5 pts | 9-11 anos: 28 pts | >11 anos: 29 pts',
  estimatedMinutes: 7,
  questions: [
    {
      id: 'q1_ano',
      text: '1. Orientação Temporal: Em que ano estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_temporal'
    },
    {
      id: 'q1_semestre',
      text: '2. Orientação Temporal: Em que semestre ou estação do ano estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_temporal'
    },
    {
      id: 'q1_mes',
      text: '3. Orientação Temporal: Em que mês estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_temporal'
    },
    {
      id: 'q1_diasemana',
      text: '4. Orientação Temporal: Em que dia da semana estamos hoje? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_temporal'
    },
    {
      id: 'q1_diames',
      text: '5. Orientação Temporal: Em que dia do mês estamos hoje? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_temporal'
    },
    {
      id: 'q2_estado',
      text: '6. Orientação Espacial: Em que estado estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_espacial'
    },
    {
      id: 'q2_cidade',
      text: '7. Orientação Espacial: Em que cidade ou município estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_espacial'
    },
    {
      id: 'q2_bairro',
      text: '8. Orientação Espacial: Em que bairro estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_espacial'
    },
    {
      id: 'q2_local',
      text: '9. Orientação Espacial: Que local é este aqui? (ex: Posto de Saúde, Clínica, Hospital) (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_espacial'
    },
    {
      id: 'q2_andar',
      text: '10. Orientação Espacial: Em que sala ou andar estamos? (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'orientacao_espacial'
    },
    {
      id: 'q3_memoria',
      text: '11. Registro de Memória Imediata: Diga 3 palavras ("Carro, Vaso, Tijolo"). Quantas repetiu corretamente de primeira? (0 a 3 pontos)',
      instruction: 'Fale pausadamente. Repita até 6 vezes se necessário para fixação, mas pontue apenas a primeira tentativa.',
      options: [
        { label: '0 palavras', value: 0 },
        { label: '1 palavra', value: 1 },
        { label: '2 palavras', value: 2 },
        { label: '3 palavras', value: 3 },
      ],
      subscale: 'memoria_imediata'
    },
    {
      id: 'q4_atencao',
      text: '12. Atenção e Cálculo: Subtrair 7 de 100 sucessivamente (93, 86, 79, 72, 65) ou soletrar "M-U-N-D-O" de trás para frente (O-D-N-U-M). (0 a 5 pontos)',
      options: [
        { label: '0 acertos', value: 0 },
        { label: '1 acerto', value: 1 },
        { label: '2 acertos', value: 2 },
        { label: '3 acertos', value: 3 },
        { label: '4 acertos', value: 4 },
        { label: '5 acertos', value: 5 },
      ],
      subscale: 'atencao_calculo'
    },
    {
      id: 'q5_evocacao',
      text: '13. Evocação Tardia de Memória: Pergunte novamente as 3 palavras ditas anteriormente. (0 a 3 pontos)',
      options: [
        { label: '0 palavras', value: 0 },
        { label: '1 palavra', value: 1 },
        { label: '2 palavras', value: 2 },
        { label: '3 palavras', value: 3 },
      ],
      subscale: 'evocacao_tardia'
    },
    {
      id: 'q6_nomeacao',
      text: '14. Linguagem - Nomeação: Apresente um Relógio e uma Caneta e peça para o paciente nomear. (0 a 2 pontos)',
      options: [
        { label: '0 acertos', value: 0 },
        { label: '1 acerto', value: 1 },
        { label: '2 acertos', value: 2 },
      ],
      subscale: 'linguagem'
    },
    {
      id: 'q7_repeticao',
      text: '15. Linguagem - Repetição: Peça para repetir exatamente: "Nem aqui, nem ali, nem lá". (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'linguagem'
    },
    {
      id: 'q8_comando',
      text: '16. Comando de 3 estágios: "Pegue este papel com a mão direita, dobre-o ao meio e coloque-o no chão". (0 a 3 pontos)',
      options: [
        { label: '0 passos', value: 0 },
        { label: '1 passo', value: 1 },
        { label: '2 passos', value: 2 },
        { label: '3 passos completos', value: 3 },
      ],
      subscale: 'linguagem'
    },
    {
      id: 'q9_leitura',
      text: '17. Leitura e Execução: Mostre a frase "FECHE OS OLHOS" escrita em papel e peça para o paciente ler e fazer o que está escrito. (1 ponto)',
      options: [{ label: 'Não executou', value: 0 }, { label: 'Executou corretamente', value: 1 }],
      subscale: 'linguagem'
    },
    {
      id: 'q10_frase',
      text: '18. Redação: Peça para escrever uma frase completa com sujeito e verbo e com sentido lógico. (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'linguagem'
    },
    {
      id: 'q11_desenho',
      text: '19. Praxia Construtiva: Peça para copiar o desenho de dois pentágonos intersectados formando um quadrilátero na interseção. (1 ponto)',
      options: [{ label: 'Incorreto', value: 0 }, { label: 'Correto', value: 1 }],
      subscale: 'praxia_construtiva'
    },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(MEEM_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(MEEM_SCALE, validation);
    }

    let totalScore = 0;
    MEEM_SCALE.questions.forEach((q) => {
      totalScore += Number(answers[q.id] || 0);
    });

    // Análise detalhada por estrato de escolaridade segundo Sônia Maria Brucki et al. (2003) e TelessaúdeRS
    const isAnalfabetoNormal = totalScore >= 20;
    const is1a4Normal = totalScore >= 25;
    const is5a8Normal = totalScore >= 26.5;
    const is9a11Normal = totalScore >= 28;
    const isSuperiorNormal = totalScore >= 29;

    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore >= 27) {
      classification = 'Desempenho Cognitivo Preservado na Maioria das Faixas de Escolaridade';
      severityLevel = 'low';
    } else if (totalScore >= 20) {
      classification = 'Desempenho Limítrofe / Dependente do Nível de Escolaridade (Brucki, 2003)';
      severityLevel = 'moderate';
    } else {
      classification = 'Rastreio Sugestivo de Declínio Cognitivo Significativo em Todas as Escolaridades';
      severityLevel = 'severe';
    }

    const interpretation = `Pontuação obtida: ${totalScore}/30 pontos.

ESTRATIFICAÇÃO SEGUNDO SÔNIA MARIA BRUCKI ET AL. (2003) & TELESSAÚDERS:
• Analfabetos (Corte ≥ 20 pts): ${isAnalfabetoNormal ? '✅ Preservado (≥ 20)' : '⚠️ Sugestivo de declínio (< 20)'}
• 1 a 4 anos de estudo (Corte ≥ 25 pts): ${is1a4Normal ? '✅ Preservado (≥ 25)' : '⚠️ Sugestivo de declínio (< 25)'}
• 5 a 8 anos de estudo (Corte ≥ 26,5 pts): ${is5a8Normal ? '✅ Preservado (≥ 26,5)' : '⚠️ Sugestivo de declínio (< 26,5)'}
• 9 a 11 anos de estudo (Corte ≥ 28 pts): ${is9a11Normal ? '✅ Preservado (≥ 28)' : '⚠️ Sugestivo de declínio (< 28)'}
• > 11 anos de estudo / Superior (Corte ≥ 29 pts): ${isSuperiorNormal ? '✅ Preservado (≥ 29)' : '⚠️ Sugestivo de declínio (< 29)'}

O MEEM é uma ferramenta de triagem e não fecha diagnóstico isoladamente. O resultado deve ser correlacionado com a funcionalidade do paciente no dia a dia.`;

    const recs: string[] = [
      'Confrontar a pontuação de ' + totalScore + ' pts com os anos exatos de estudo formal do paciente conforme a tabela de Brucki et al. (2003)',
      'Avaliar a funcionalidade nas Atividades de Vida Diária (ABVD - Índice de Katz e AIVD - Escala de Lawton & Brody ou Questionário de Pfeffer / FAQ)',
      'Aplicar o Teste do Desenho do Relógio (TDR) como instrumento complementar para funções executivas e visuoespaciais',
      'Rastrear sintomas depressivos (Escala de Depressão Geriátrica GDS-15 ou PHQ-9) para investigar pseudodemência depressiva',
      'Solicitar exames laboratoriais básicos para exclusão de causas reversíveis de demência na APS (TelessaúdeRS): Hemograma, TSH, Vitamina B12, Creatinina, Eletrólitos, VDRL, Função Hepática e Glicemia',
      'Se confirmado declínio funcional e cognitivo: planejar apoio ao cuidador, segurança domiciliar e discutir caso com Apoio Matricial / Teleconsultoria TelessaúdeRS'
    ];

    // Pontuações somadas por dimensões cognitivas
    const orientacaoTemporal = (answers['q1_ano'] ?? 0) + (answers['q1_semestre'] ?? 0) + (answers['q1_mes'] ?? 0) + (answers['q1_diasemana'] ?? 0) + (answers['q1_diames'] ?? 0);
    const orientacaoEspacial = (answers['q2_estado'] ?? 0) + (answers['q2_cidade'] ?? 0) + (answers['q2_bairro'] ?? 0) + (answers['q2_local'] ?? 0) + (answers['q2_andar'] ?? 0);
    const memoriaImediata = answers['q3_memoria'] ?? 0;
    const atencaoCalculo = answers['q4_atencao'] ?? 0;
    const evocacaoTardia = answers['q5_evocacao'] ?? 0;
    const linguagem = (answers['q6_nomeacao'] ?? 0) + (answers['q7_repeticao'] ?? 0) + (answers['q8_comando'] ?? 0) + (answers['q9_leitura'] ?? 0) + (answers['q10_frase'] ?? 0);
    const praxiaConstrutiva = answers['q11_desenho'] ?? 0;

    const dimensoesText = `Orientação Temporal: ${orientacaoTemporal}/5, Orientação Espacial: ${orientacaoEspacial}/5, Memória Imediata: ${memoriaImediata}/3, Atenção e Cálculo: ${atencaoCalculo}/5, Evocação Tardia: ${evocacaoTardia}/3, Linguagem: ${linguagem}/8, Praxia Construtiva: ${praxiaConstrutiva}/1`;

    const soapText = `MEEM: ${totalScore}/30 pts (${classification}) | Dimensões: [${dimensoesText}]`;

    return {
      scaleId: 'meem',
      scaleTitle: 'MEEM',
      totalScore,
      maxScore: 30,
      classification,
      severityLevel,
      interpretation,
      recommendations: recs,
      soapText,
      answersArray: MEEM_SCALE.questions.map((q) => Number(answers[q.id])),
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 19,
      totalRequired: 19,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Passo 1: Correlação Obrigatória com Anos de Escolaridade (Brucki et al., 2003)',
      description: 'Comparar o escore bruto com o ponto de corte do estrato educacional: Analfabetos: < 20 pts | 1 a 4 anos: < 25 pts | 5 a 8 anos: < 26,5 pts | 9 a 11 anos: < 28 pts | > 11 anos (Superior): < 29 pts. Pontuações abaixo do corte indicam necessidade de propedêutica confirmatória.',
      badge: 'Normas Brucki / ABN',
      badgeType: 'warning',
    },
    {
      title: 'Passo 2: Avaliação Funcional e de Atividades de Vida Diária',
      description: 'O declínio cognitivo só configura Síndrome Demencial se houver perda objetiva de autonomia. Aplicar o Questionário de Atividades Funcionais de Pfeffer (FAQ) com o informante/cuidador e a escala de Lawton & Brody (AIVDs).',
      badge: 'Funcionalidade',
      badgeType: 'warning',
    },
    {
      title: 'Passo 3: Investigação Laboratorial de Causas Reversíveis de Declínio (APS / TelessaúdeRS)',
      description: 'Solicitar rastreio etiológico básico: TSH (hipotireoidismo), Vitamina B12 (deficiência carencial), VDRL (neurossífilis), Hemograma, Creatinina, Eletrólitos (Sódio/Potássio/Cálcio), Glicemia de jejum e Sorologia anti-HIV se clinicamente indicada.',
      badge: 'Rastreio Reversível',
      badgeType: 'neutral',
    },
    {
      title: 'Passo 4: Rastreamento de "Pseudodemência" Depressiva & Teste do Desenho do Relógio',
      description: 'Aplicar a Escala de Depressão Geriátrica (GDS-15) ou PHQ-9. Aplicar o Teste do Desenho do Relógio (TDR) de Mendes-Santos / Shulman para avaliar disfunção executiva e praxia visuoespacial.',
      badge: 'Diagnóstico Diferencial',
      badgeType: 'neutral',
    },
    {
      title: 'Passo 5: Plano de Cuidado Integral e Apoio ao Cuidador',
      description: 'Estimulação cognitiva não farmacológica, adequação de segurança domiciliar (prevenção de quedas e fugas), identificação de sobrecarga do cuidador (Escala de Zarit) e discussão no Apoio Matricial / TelessaúdeRS.',
      badge: 'Cuidado Integral',
      badgeType: 'neutral',
    },
  ],
  monitoringGoals: [
    {
      title: 'Monitoramento da Taxa de Declínio Anual',
      description: 'Reaplicação do MEEM a cada 6 a 12 meses. Uma queda de ≥ 2 a 4 pontos por ano é indicativa de progressão neurodegenerativa ativa (ex: Doença de Alzheimer).',
    },
    {
      title: 'Preservação da Autonomia & Segurança Domiciliar',
      description: 'Acompanhar a capacidade de autoadministração medicamentosa (organizador de comprimidos supervisionado) e controle de finanças.',
    },
    {
      title: 'Suporte à Saúde Mental do Cuidador Principal',
      description: 'Aferição periódica de sobrecarga emocional e sinais de burnout no cuidador familiar de referência nas consultas de enfermagem e medicina de família.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Normatização Brasileira por Sônia Maria Dozzi Brucki (ABN / TelessaúdeRS)',
      text: 'O estudo seminal de Brucki et al. (Sugestões para o uso do mini-exame do estado mental no Brasil. Arq Neuropsiquiatr. 2003; 61(3B):777-781) estabeleceu as médias e desvios-padrão populacionais para o MEEM em 5 estratos de escolaridade, sendo a referência oficial adotada pela Academia Brasileira de Neurologia e pelo Ministério da Saúde.',
      reference: 'Brucki SMD et al. Arq Neuropsiquiatr. 2003; 61(3B):777-781.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: O "Efeito Teto" em Pacientes com Alta Escolaridade',
      text: 'Pacientes com ensino superior completo ou alta reserva cognitiva podem pontuar 28 ou 29 no MEEM mesmo já apresentando Comprometimento Cognitivo Leve (CCL) ou fases iniciais de demência. Nesses casos, o Teste do Desenho do Relógio e o relato funcional do cônjuge são mais sensíveis.',
    },
    {
      type: 'pitfall',
      title: 'Armadilha: Confundir Delirium Agudo com Demência',
      text: 'Nunca aplique o MEEM ou feche diagnóstico de demência durante um episódio de confusão mental aguda (delirium) precipitada por infecção urinária, pneumonia, desidratação, retenção urinária ou fármacos anticolinérgicos em idosos. Trate a causa clínica de base primeiro.',
    },
  ],
};

export const EUROHIS_QOL_SCALE: ScaleDefinition = {
  id: 'eurohis-qol',
  title: 'EUROHIS-QOL (Índice de Qualidade de Vida de 8 Itens)',
  acronym: 'EUROHIS-QOL',
  targetGroup: 'Adultos na APS em acompanhamento de saúde mental ou condições crônicas',
  description: 'Instrumento abreviado da OMS para mensuração da qualidade de vida global, saúde física, energia, relações e condições de moradia.',
  shortInstruction: 'Avalie a qualidade de vida e satisfação pessoal referente às últimas duas semanas.',
  instructions: 'Para cada item abaixo, selecione o nível de satisfação ou percepção referente às últimas duas semanas.',
  referenceCitation: 'Schmidt S, Mühlan H, Power M. Qual Life Res. 2006; 15(9):1501-10. Validação brasileira: Rocha NS, Power MJ, Bushnell DM, Fleck MP. Rev Saude Publica. 2008; 42(6):1085-94.',
  validationInfo: 'Versão brasileira validada por Rocha & Fleck (UFRGS). Escore total de 8 a 40 pontos.',
  cutoffInfo: '≥ 32: Boa/Preservada | 24-31: Moderada | < 24: Comprometida',
  estimatedMinutes: 2,
  questions: [
    { id: 'q1', text: '1. Como você avalia sua qualidade de vida global?', options: [{ label: 'Muito ruim', value: 1 }, { label: 'Ruim', value: 2 }, { label: 'Nem boa/nem ruim', value: 3 }, { label: 'Boa', value: 4 }, { label: 'Muito boa', value: 5 }] },
    { id: 'q2', text: '2. Quão satisfeito(a) você está com a sua saúde?', options: [{ label: 'Muito insatisfeito', value: 1 }, { label: 'Insatisfeito', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Satisfeito', value: 4 }, { label: 'Muito satisfeito', value: 5 }] },
    { id: 'q3', text: '3. Você tem energia suficiente para seu dia a dia?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Média', value: 3 }, { label: 'Muita', value: 4 }, { label: 'Total', value: 5 }] },
    { id: 'q4', text: '4. Quão satisfeito(a) está com sua capacidade para realizar as atividades do cotidiano?', options: [{ label: 'Muito insatisfeito', value: 1 }, { label: 'Insatisfeito', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Satisfeito', value: 4 }, { label: 'Muito satisfeito', value: 5 }] },
    { id: 'q5', text: '5. Quão satisfeito(a) você está consigo mesmo(a)?', options: [{ label: 'Muito insatisfeito', value: 1 }, { label: 'Insatisfeito', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Satisfeito', value: 4 }, { label: 'Muito satisfeito', value: 5 }] },
    { id: 'q6', text: '6. Quão satisfeito(a) está com suas relações pessoais e familiares?', options: [{ label: 'Muito insatisfeito', value: 1 }, { label: 'Insatisfeito', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Satisfeito', value: 4 }, { label: 'Muito satisfeito', value: 5 }] },
    { id: 'q7', text: '7. Você tem dinheiro suficiente para satisfazer suas necessidades básicas?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Bastante', value: 4 }, { label: 'Total', value: 5 }] },
    { id: 'q8', text: '8. Quão satisfeito(a) você está com as condições do local onde mora?', options: [{ label: 'Muito insatisfeito', value: 1 }, { label: 'Insatisfeito', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Satisfeito', value: 4 }, { label: 'Muito satisfeito', value: 5 }] },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(EUROHIS_QOL_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(EUROHIS_QOL_SCALE, validation);
    }

    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].map((k) => Number(answers[k]));
    answersArray.forEach((val) => {
      totalScore += val;
    });

    const meanScore = (totalScore / 8).toFixed(2);
    let classification = '';
    let severityLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';

    if (totalScore >= 32) {
      classification = 'Percepção de qualidade de vida boa e preservada';
      severityLevel = 'low';
    } else if (totalScore >= 24) {
      classification = 'Percepção de qualidade de vida moderada';
      severityLevel = 'moderate';
    } else {
      classification = 'Percepção de qualidade de vida comprometida';
      severityLevel = 'high';
    }

    const soapText = `EUROHIS-QOL: ${totalScore}/40 pts (Média ${meanScore}/5) - ${classification} | Fonte: Schmidt et al., 2006 (Validação BR: Rocha & Fleck, 2008)`;

    return {
      scaleId: 'eurohis-qol',
      scaleTitle: 'EUROHIS-QOL',
      totalScore,
      maxScore: 40,
      classification,
      severityLevel,
      interpretation: `Qualidade de vida global avaliada com média ${meanScore}/5 pontos por item (${totalScore}/40 total).`,
      recommendations: ['Identificar dimensões prioritárias de suporte social, atividade física e autonomia'],
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 8,
      totalRequired: 8,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Escore ≥ 32 pts — Qualidade de Vida Boa / Preservada',
      description: 'Reforçar os fatores protetores identificados (sono reparador, rede social ativa, satisfação com moradia e autonomia). Manter acompanhamento longitudinal na APS.',
      badge: '≥ 32 pts: Preservada',
      badgeType: 'neutral',
    },
    {
      title: 'Escore 24 a 31 pts — Qualidade de Vida Moderada',
      description: 'Identificar domínios específicos com menor pontuação (físico, psicológico, social ou ambiental). Propor intervenções focadas em estilo de vida, grupos de convivência na UBS ou otimização de terapias de condições crônicas.',
      badge: '24-31 pts: Moderada',
      badgeType: 'warning',
    },
    {
      title: 'Escore < 24 pts — Qualidade de Vida Comprometida',
      description: 'Rastrear transtornos do humor subjacentes (depressão, ansiedade), dor crônica não controlada ou vulnerabilidade socioeconômica crítica. Encaminhar para avaliação do Serviço Social da UBS e planejar PTS (Projeto Terapêutico Singular).',
      badge: '< 24 pts: Comprometida',
      badgeType: 'danger',
    },
  ],
  monitoringGoals: [
    {
      title: 'Evolução Longitudinal dos Desfechos Centrados no Paciente (PROMs)',
      description: 'Acompanhar a melhoria da qualidade de vida percebida antes e após intervenções clínicas (ex: introdução de antidepressivos, controle glicêmico/pressórico, reabilitação física).',
    },
    {
      title: 'Integração com Determinantes Sociais da Saúde',
      description: 'Articulação com a rede intersetorial (CRAS, Programa Bolsa Família, grupos comunitários de atividade física).',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Validação Brasileira do Instrumento Abreviado da OMS',
      text: 'O EUROHIS-QOL é o índice abreviado de 8 itens derivado do WHOQOL-100 e WHOQOL-BREF, validado no Brasil por Rocha, Power, Bushnell e Fleck (Rev Saude Publica, 2008; 42(6):1085-94). Possui alta consistência interna (alfa de Cronbach = 0.83) e excelente sensibilidade clínica.',
      reference: 'Rocha NS et al. Rev Saude Publica. 2008; 42(6):1085-94.',
    },
    {
      type: 'pearl',
      title: 'Pérola Clínica: Cuidado Centrado na Pessoa (PROMs)',
      text: 'Na Medicina de Família e Comunidade, mensurar desfechos relatados pelo paciente (PROMs) através do EUROHIS-QOL permite avaliar se a melhora laboratorial/biológica está de fato se traduzindo em bem-estar e funcionalidade real no cotidiano do indivíduo.',
    },
  ],
};

export const WHOQOL_SRPB_SCALE: ScaleDefinition = {
  id: 'whoqol-srpb',
  title: 'WHOQOL-SRPB (Espiritualidade, Religiosidade e Crenças Pessoais)',
  acronym: 'WHOQOL-SRPB',
  targetGroup: 'Pacientes interessados na exploração de recursos existenciais e de enfrentamento',
  description: 'Módulo da OMS para avaliação neutra do papel do sentido de vida, esperança, fé e paz interior como suporte emocional e resiliência.',
  shortInstruction: 'Avalie o quanto seus valores, fé ou crenças pessoais auxiliam no seu dia a dia.',
  instructions: 'Para cada pergunta abaixo, avalie de forma voluntária o quanto seus recursos espirituais ou crenças pessoais ajudam a lidar com momentos difíceis.',
  referenceCitation: 'WHOQOL SRPB Group. Soc Sci Med. 2006; 62(6):1486-97. Validação brasileira: Panzini RG, Maganha C, Rocha NS, Bandeira DR, Fleck MP. Rev Saude Publica. 2011; 45(1):153-65.',
  validationInfo: 'Versão brasileira validada por Panzini & Fleck (UFRGS). Escore de 4 a 20 pontos.',
  cutoffInfo: 'Mede recursos existenciais de enfrentamento e resiliência pessoal.',
  estimatedMinutes: 2,
  questions: [
    { id: 'q1', text: '1. O quanto suas crenças e valores dão sentido à sua vida?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Bastante', value: 4 }, { label: 'Extremamente', value: 5 }] },
    { id: 'q2', text: '2. O quanto você sente paz interior em momentos de estresse?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Bastante', value: 4 }, { label: 'Extremamente', value: 5 }] },
    { id: 'q3', text: '3. Suas crenças pessoais servem como fonte de força nos momentos difíceis?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Bastante', value: 4 }, { label: 'Extremamente', value: 5 }] },
    { id: 'q4', text: '4. O quanto você se sente conectado(a) com o mundo e com os outros?', options: [{ label: 'Nada', value: 1 }, { label: 'Pouco', value: 2 }, { label: 'Médio', value: 3 }, { label: 'Bastante', value: 4 }, { label: 'Extremamente', value: 5 }] },
  ],
  calculateResult: (answers) => {
    const validation = validateScaleAnswers(WHOQOL_SRPB_SCALE, answers);
    if (!validation.isComplete) {
      return createIncompleteScaleResult(WHOQOL_SRPB_SCALE, validation);
    }

    let totalScore = 0;
    const answersArray = ['q1', 'q2', 'q3', 'q4'].map((k) => Number(answers[k]));
    answersArray.forEach((val) => {
      totalScore += val;
    });

    const soapText = `WHOQOL-SRPB: ${totalScore}/20 pts | Recursos existenciais e crenças pessoais reconhecidos no plano terapêutico | Fonte: OMS (Validação BR: Panzini & Fleck, 2011)`;

    return {
      scaleId: 'whoqol-srpb',
      scaleTitle: 'WHOQOL-SRPB',
      totalScore,
      maxScore: 20,
      classification: 'Avaliação de suporte existencial e crenças concluída',
      severityLevel: 'low',
      interpretation: `Escore de ${totalScore}/20 pontos. Recursos pessoais, sentido de vida e fé identificados como fatores protetores de resiliência.`,
      recommendations: ['Respeitar a autonomia do paciente e considerar apoio de suas redes comunitárias habituais'],
      soapText,
      answersArray,
      isComplete: true,
      completionStatus: 'complete',
      answeredCount: 4,
      totalRequired: 4,
    };
  },
  clinicalConductSteps: [
    {
      title: 'Acolhimento Não Julgador da Dimensão Espiritual/Existencial',
      description: 'Reconhecer que crenças, valores e espiritualidade representam dimensões fundamentais do conceito ampliado de saúde da OMS. Explorar como a fé ou o sentido de vida atuam como recurso de enfrentamento (coping religioso-espiritual positivo).',
      badge: 'Abordagem Holística',
      badgeType: 'neutral',
    },
    {
      title: 'Integração Ética com o Projeto Terapêutico Singular (PTS)',
      description: 'Respeitar integralmente a laicidade do atendimento médico e a autonomia do paciente. Identificar se o paciente deseja a inclusão de suas redes de apoio espiritual/comunitário no suporte ao sofrimento psíquico ou luto.',
      badge: 'Ética Médica',
      badgeType: 'neutral',
    },
    {
      title: '⚠️ Rastreio de Coping Religioso-Espiritual Negativo',
      description: 'Identificar se o paciente interpreta o adoecimento como "castigo divino", culpa moral ou abandono espiritual, o que se associa a maior risco de depressão grave, isolamento e recusa de tratamentos médicos necessários.',
      badge: 'Alerta Clínico',
      badgeType: 'warning',
    },
  ],
  monitoringGoals: [
    {
      title: 'Fortalecimento da Resiliência e Sentido de Vida',
      description: 'Acompanhar a reintegração do paciente às suas atividades sociais, comunitárias e existenciais significativas.',
    },
    {
      title: 'Aliança Terapêutica Empática e Respeito à Diversidade',
      description: 'Garantir ambiente seguro e acolhedor na APS livre de proselitismo religioso ou discriminação de qualquer natureza.',
    },
  ],
  clinicalPearls: [
    {
      type: 'evidence',
      title: 'Validação Brasileira do Módulo SRPB da OMS',
      text: 'Validado no Brasil por Panzini, Maganha, Rocha, Bandeira e Fleck (Rev Saude Publica, 2011; 45(1):153-65). O módulo SRPB (Spirituality, Religiousness and Personal Beliefs) demonstrou robustas propriedades psicométricas e correlação positiva com saúde mental e bem-estar global.',
      reference: 'Panzini RG et al. Rev Saude Publica. 2011; 45(1):153-65.',
    },
    {
      type: 'pearl',
      title: 'Pérola da MFC: O Protocolo FICA de História Espiritual',
      text: 'Na Atenção Primária, utilize o mnemônico FICA para uma anamnese espiritual rápida de 2 minutos: F (Fé ou crenças), I (Importância ou influência na vida/decisões), C (Comunidade de apoio), A (Ação no plano de cuidado).',
    },
  ],
};

export const ALL_SCALES: ScaleDefinition[] = [
  PHQ9_SCALE,
  GAD7_SCALE,
  HCL32_SCALE,
  AUDIT_SCALE,
  ASRS18_SCALE,
  SNAP_IV_SCALE,
  YBOCS_SCALE,
  CSSRS_SCALE,
  MEEM_SCALE,
  EUROHIS_QOL_SCALE,
  WHOQOL_SRPB_SCALE,
  ...ADDITIONAL_SCALES,
];

/**
 * Escopo do TCR (20/11/2026): 7 instrumentos prioritários e validados na APS:
 * 1. PHQ-9 (Depressão)
 * 2. GAD-7 (Ansiedade)
 * 3. AUDIT (Padrão de uso de álcool - 10 itens)
 * 4. EPDS (Depressão perinatal / pós-parto)
 * 5. MEEM (Rastreio cognitivo)
 * 6. ASRS-18 (TDAH em adultos)
 * 7. SNAP-IV (TDAH / Desatenção e Hiperatividade)
 */
export const TCR_SCALE_IDS = [
  'phq-9',
  'gad-7',
  'audit',
  'epds',
  'meem',
  'asrs-18',
  'snap-iv',
] as const;

export type TcrScaleId = typeof TCR_SCALE_IDS[number];

export const TCR_SCALES: ScaleDefinition[] = TCR_SCALE_IDS.map(
  (id) => ALL_SCALES.find((s) => s.id === id)!
).filter(Boolean);

