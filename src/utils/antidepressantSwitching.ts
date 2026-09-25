export interface AntidepressantInfo {
  id: string;
  name: string;
  class: 'ISRS' | 'ISRN' | 'Atípico / Modulador' | 'Tricíclico' | 'IMAO' | 'Outro';
  standardDoses: number[];
  minTherapeuticDose: number;
  maxRecommendedDose: number;
  hayasakaEqToFluoxetine40: number; // Equivalência a Fluoxetina 40mg (Hayasaka et al., 2015 ou Estimativa Clínica)
  isRctEvidence: boolean; // true if from Hayasaka RCT meta-analysis, false if widely accepted clinical consensus
  halfLifeHours: string;
  activeMetaboliteHalfLife?: string;
  cypInteractions: Record<string, string>;
  discontinuationRisk: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto';
  serotoninRisk: 'Moderado' | 'Alto' | 'Muito Alto' | 'Muito Alto (IMAO)';
  specialAlerts: string[];
}

export const ANTIDEPRESSANTS_DB: Record<string, AntidepressantInfo> = {
  fluoxetina: {
    id: 'fluoxetina',
    name: 'Fluoxetina',
    class: 'ISRS',
    standardDoses: [10, 20, 40, 60, 80],
    minTherapeuticDose: 20,
    maxRecommendedDose: 80,
    hayasakaEqToFluoxetine40: 40.0,
    isRctEvidence: true,
    halfLifeHours: '48 - 72h (2-3 dias)',
    activeMetaboliteHalfLife: 'Norfluoxetina: 168 - 360h (7-15 dias)',
    cypInteractions: {
      cyp2D6: 'Potente',
      cyp2C19: 'Moderado',
      cyp3A4: 'Fraco',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Meia-vida plasmática ultralonga da norfluoxetina (~1 a 2 semanas): "auto-desmame" biológico natural.',
      'Inibidor potente do CYP2D6: eleva significativamente os níveis de tricíclicos, antipsicóticos, betabloqueadores e tramadol.',
      'Obrigatório aguardar 5 semanas (35 dias) de washout estrito caso a troca seja direcionada para IMAO (Tranilcipromina).',
    ],
  },
  sertralina: {
    id: 'sertralina',
    name: 'Sertralina',
    class: 'ISRS',
    standardDoses: [25, 50, 100, 150, 200],
    minTherapeuticDose: 50,
    maxRecommendedDose: 200,
    hayasakaEqToFluoxetine40: 98.5,
    isRctEvidence: true,
    halfLifeHours: '26h',
    activeMetaboliteHalfLife: 'N-desmetilsertralina: 62 - 104h (pouca atividade)',
    cypInteractions: {
      cyp2D6: 'Fraco (moderado em doses >150mg)',
      cyp2C19: 'Fraco',
      cyp3A4: 'Fraco',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Perfil de segurança cardiovascular favorável (estudos SADHART / ENRICHD).',
      'Leve ação inibidora da recaptação de dopamina em doses elevadas (>150mg/dia).',
      'Baixo potencial de interações farmacocinéticas comparada a Fluoxetina e Paroxetina.',
    ],
  },
  escitalopram: {
    id: 'escitalopram',
    name: 'Escitalopram',
    class: 'ISRS',
    standardDoses: [5, 10, 15, 20],
    minTherapeuticDose: 10,
    maxRecommendedDose: 20,
    hayasakaEqToFluoxetine40: 18.0,
    isRctEvidence: true,
    halfLifeHours: '27 - 32h',
    cypInteractions: {
      cyp2D6: 'Fraco',
      cyp2C19: 'Substrato',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'ISRS mais seletivo para o transportador SERT (alostérico).',
      'Risco dose-dependente de prolongamento do intervalo QTc (dose máxima em idosos >65 anos limitada a 10 mg/dia).',
      'Perfil límpido de interações metabólicas CYP450.',
    ],
  },
  citalopram: {
    id: 'citalopram',
    name: 'Citalopram',
    class: 'ISRS',
    standardDoses: [10, 20, 30, 40],
    minTherapeuticDose: 20,
    maxRecommendedDose: 40,
    hayasakaEqToFluoxetine40: 36.6,
    isRctEvidence: true,
    halfLifeHours: '35h',
    cypInteractions: {
      cyp2C19: 'Substrato',
      cyp2D6: 'Fraco',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Alerta FDA/Anvisa de prolongamento de QTc e risco de Torsades de Pointes: dose teto de 40 mg/dia (20 mg/dia para idosos).',
    ],
  },
  paroxetina: {
    id: 'paroxetina',
    name: 'Paroxetina',
    class: 'ISRS',
    standardDoses: [10, 20, 30, 40, 50, 60],
    minTherapeuticDose: 20,
    maxRecommendedDose: 60,
    hayasakaEqToFluoxetine40: 34.0,
    isRctEvidence: true,
    halfLifeHours: '21 - 24h',
    cypInteractions: {
      cyp2D6: 'Potente (inibe sua própria eliminação)',
      cyp1A2: 'Fraco',
      cyp3A4: 'Fraco',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Altíssimo risco de Síndrome de Descontinuação (meia-vida curta sem metabólitos ativos e bloqueio colinérgico). Exige desmame extremamente lento.',
      'Efeito anticolinérgico intrínseco (boca seca, constipação, sedação, risco de disfunção cognitiva em idosos).',
      'Inibidor potente de CYP2D6.',
    ],
  },
  fluvoxamina: {
    id: 'fluvoxamina',
    name: 'Fluvoxamina',
    class: 'ISRS',
    standardDoses: [50, 100, 150, 200, 300],
    minTherapeuticDose: 100,
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: 143.3,
    isRctEvidence: true,
    halfLifeHours: '15 - 20h',
    cypInteractions: {
      cyp1A2: 'Potente',
      cyp2C19: 'Potente',
      cyp2C9: 'Moderado',
      cyp3A4: 'Moderado',
      cyp2D6: 'Fraco',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Inibidor potente do CYP1A2 e CYP2C19: contraindicação com Tizanidina, Ramelteona e aumento maciço de Clozapina, Teofilina e Cafeína.',
      'Potente afinidade com receptores Sigma-1.',
    ],
  },
  venlafaxina: {
    id: 'venlafaxina',
    name: 'Venlafaxina (XR)',
    class: 'ISRN',
    standardDoses: [37.5, 75, 150, 225, 300],
    minTherapeuticDose: 75,
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: 146.5,
    isRctEvidence: true,
    halfLifeHours: '5h',
    activeMetaboliteHalfLife: 'O-desmetilvenlafaxina: 11h',
    cypInteractions: {
      cyp2D6: 'Substrato (fraco inibidor em altas doses)',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Ação predominantemente serotoninérgica em doses <150mg/dia; bloqueio de recaptação de noradrenalina robusto a partir de ≥150mg/dia.',
      'Elevadíssimo risco de síndrome de descontinuação abrupta ("choques na cabeça" / brain zaps, náuseas e disforia intensa).',
      'Monitorar pressão arterial sistêmica e frequência cardíaca em doses elevadas.',
    ],
  },
  desvenlafaxina: {
    id: 'desvenlafaxina',
    name: 'Desvenlafaxina',
    class: 'ISRN',
    standardDoses: [50, 100, 150],
    minTherapeuticDose: 50,
    maxRecommendedDose: 150,
    hayasakaEqToFluoxetine40: 90.0, // Estimativa clínica proporcional (50mg ~ 20mg Flx / 100mg ~ 40mg Flx)
    isRctEvidence: false,
    halfLifeHours: '11h',
    cypInteractions: {
      cyp2D6: 'Fraco',
      cyp3A4: 'Mínimo',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Metabólito ativo direto da venlafaxina (eliminação predominantemente por conjugação glicurônica, independente de polimorfismos do CYP2D6).',
      'Dose terapêutica padrão inicia em 50 mg/dia.',
    ],
  },
  duloxetina: {
    id: 'duloxetina',
    name: 'Duloxetina',
    class: 'ISRN',
    standardDoses: [30, 60, 90, 120],
    minTherapeuticDose: 60,
    maxRecommendedDose: 120,
    hayasakaEqToFluoxetine40: 75.0, // Estimativa clínica consensual (60mg ~ 30-40mg Flx)
    isRctEvidence: false,
    halfLifeHours: '12h',
    cypInteractions: {
      cyp2D6: 'Moderado',
      cyp1A2: 'Substrato',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Duplo bloqueio 5-HT e NA equilibrado desde a dose inicial (60 mg/dia). Indicada em dor crônica e neuropática.',
      'Inibidor moderado do CYP2D6.',
      'Evitar em insuficiência hepática ou consumo crônico de álcool.',
    ],
  },
  bupropiona: {
    id: 'bupropiona',
    name: 'Bupropiona (XL/SR)',
    class: 'Atípico / Modulador',
    standardDoses: [150, 300, 450],
    minTherapeuticDose: 150,
    maxRecommendedDose: 450,
    hayasakaEqToFluoxetine40: 300.0, // Estimativa clínica consensual (150mg ~ 20mg Flx / 300mg ~ 40mg Flx)
    isRctEvidence: false,
    halfLifeHours: '14 - 21h',
    activeMetaboliteHalfLife: 'Hidroxibupropiona: 20 - 37h',
    cypInteractions: {
      cyp2D6: 'Potente',
      cyp2B6: 'Substrato',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Moderado', // Não tem ação serotoninérgica direta
    specialAlerts: [
      'Inibidor da recaptação de Dopamina e Noradrenalina (IRDN). ZERO impacto na recaptação de serotonina (não causa disfunção sexual nem ganho de peso).',
      'Inibidor potente do CYP2D6: eleva níveis de tricíclicos, duloxetina, venlafaxina e paroxetina.',
      'Contraindicado formalmente em histórico de convulsões, bulimia/anorexia e desmame abrupto de álcool ou benzodiazepínicos.',
    ],
  },
  mirtazapina: {
    id: 'mirtazapina',
    name: 'Mirtazapina',
    class: 'Atípico / Modulador',
    standardDoses: [15, 30, 45],
    minTherapeuticDose: 15,
    maxRecommendedDose: 45,
    hayasakaEqToFluoxetine40: 50.9,
    isRctEvidence: true,
    halfLifeHours: '20 - 40h',
    cypInteractions: {
      cyp1A2: 'Substrato',
      cyp2D6: 'Substrato',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antagonista alfa-2 adrenérgico pré-sináptico e bloqueador 5-HT2 / 5-HT3 e H1 (NaSSA).',
      'Sedação acentuada e apetite aumentado (maior sedação em doses baixas de 7,5-15mg por predomínio anti-histamínico H1).',
      'Quase nulo potencial de indução ou inibição enzimática no citocromo P450.',
    ],
  },
  vortioxetina: {
    id: 'vortioxetina',
    name: 'Vortioxetina',
    class: 'Atípico / Modulador',
    standardDoses: [5, 10, 15, 20],
    minTherapeuticDose: 10,
    maxRecommendedDose: 20,
    hayasakaEqToFluoxetine40: 20.0, // Estimativa clínica (10mg ~ 20mg Flx / 20mg ~ 40mg Flx)
    isRctEvidence: false,
    halfLifeHours: '66h',
    cypInteractions: {
      cyp2D6: 'Substrato principal',
      cyp3A4: 'Substrato menor',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antidepressivo multimodal (inibidor do SERT + agonista 5-HT1A + antagonista 5-HT3/5-HT7/5-HT1D).',
      'Excelente perfil de tolerabilidade cognitiva e menor taxa de disfunção sexual.',
      'Meia-vida longa (~66 horas). Se associada a inibidores potentes de CYP2D6 (ex: Fluoxetina/Bupropiona), reduzir dose da Vortioxetina pela metade.',
    ],
  },
  trazodona: {
    id: 'trazodona',
    name: 'Trazodona',
    class: 'Atípico / Modulador',
    standardDoses: [50, 100, 150, 300],
    minTherapeuticDose: 150, // Como antidepressivo (em doses de 50-100mg atua apenas como hipnótico)
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: 300.0,
    isRctEvidence: false,
    halfLifeHours: '7 - 13h',
    cypInteractions: {
      cyp3A4: 'Substrato',
      cyp2D6: 'Substrato menor',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antagonista e Inibidor de Recaptação de Serotonina (SARI).',
      'Doses baixas (50-100 mg) atuam primariamente como sedativo/hipnótico por bloqueio 5-HT2A, H1 e alfa-1.',
      'Efeito antidepressivo clínico requer doses de 150 a 300 mg/dia.',
      'Risco de hipotensão ortostática e priapismo (raro).',
    ],
  },
  amitriptilina: {
    id: 'amitriptilina',
    name: 'Amitriptilina',
    class: 'Tricíclico',
    standardDoses: [25, 50, 75, 100, 150],
    minTherapeuticDose: 75,
    maxRecommendedDose: 150,
    hayasakaEqToFluoxetine40: 122.3,
    isRctEvidence: true,
    halfLifeHours: '15 - 30h',
    activeMetaboliteHalfLife: 'Nortriptilina: 20 - 40h',
    cypInteractions: {
      cyp2D6: 'Substrato principal',
      cyp2C19: 'Substrato principal',
      cyp1A2: 'Substrato',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antidepressivo Tricíclico clássico com fortes propriedades anticolinérgicas, anti-histamínicas e bloqueadoras alfa-1.',
      'Risco de toxicidade cardíaca e letalidade em caso de overdose (arritmias, alargamento de QRS/QTc). Solicitar ECG prévio em cardiopatas e idosos.',
      'Níveis séricos aumentam dramaticamente quando combinada a inibidores de CYP2D6 (Fluoxetina, Paroxetina, Bupropiona).',
    ],
  },
  nortriptilina: {
    id: 'nortriptilina',
    name: 'Nortriptilina',
    class: 'Tricíclico',
    standardDoses: [25, 50, 75, 100],
    minTherapeuticDose: 50,
    maxRecommendedDose: 100,
    hayasakaEqToFluoxetine40: 75.0,
    isRctEvidence: false,
    halfLifeHours: '20 - 40h',
    cypInteractions: {
      cyp2D6: 'Substrato principal',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Apresenta janela terapêutica plasmática bem estabelecida (50 - 150 ng/mL).',
      'Menor efeito hipotensor postural e menor carga anticolinérgica que a Amitriptilina (melhor tolerada em idosos).',
    ],
  },
  clomipramina: {
    id: 'clomipramina',
    name: 'Clomipramina',
    class: 'Tricíclico',
    standardDoses: [25, 75, 150, 225],
    minTherapeuticDose: 75,
    maxRecommendedDose: 225,
    hayasakaEqToFluoxetine40: 116.1,
    isRctEvidence: true,
    halfLifeHours: '20 - 32h',
    activeMetaboliteHalfLife: 'Desmetilclomipramina: 36 - 60h',
    cypInteractions: {
      cyp2D6: 'Substrato / Inibidor moderado',
      cyp1A2: 'Substrato',
      cyp2C19: 'Substrato',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Muito Alto',
    specialAlerts: [
      'Tricíclico com potente ação inibidora de recaptação de serotonina (padrão-ouro histórico em TOC).',
      'Alto risco de síndrome serotoninérgica em associações e maior potencial convulsivógeno entre os tricíclicos.',
    ],
  },
  tranilcipromina: {
    id: 'tranilcipromina',
    name: 'Tranilcipromina (Parnate)',
    class: 'IMAO',
    standardDoses: [10, 20, 30, 40],
    minTherapeuticDose: 20,
    maxRecommendedDose: 60,
    hayasakaEqToFluoxetine40: 25.0, // Estimativa clínica
    isRctEvidence: false,
    halfLifeHours: '2h (mas inibição enzimática irreversível dura 14 dias)',
    cypInteractions: {
      cyp2C19: 'Inibidor',
      cyp2A6: 'Inibidor',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Muito Alto (IMAO)',
    specialAlerts: [
      'IMAO Irreversível e Não-Seletivo (inibe MAO-A e MAO-B).',
      'RISCO CRÍTICO: Requer dieta estrita com restrição de Tiramina (queijos curados, vinhos, defumados) sob risco de Crise Hipertensiva fatal ("efeito queijo").',
      'PERÍODO DE WASHOUT OBRIGATÓRIO: Aguardar 14 dias após suspender qualquer outro antidepressivo (ou 5 semanas se for Fluoxetina) antes de iniciar Tranilcipromina. E aguardar 14 dias após suspender Tranilcipromina antes de iniciar qualquer outro antidepressivo!',
    ],
  },
  moclobemida: {
    id: 'moclobemida',
    name: 'Moclobemida (Aurorix)',
    class: 'IMAO',
    standardDoses: [150, 300, 600],
    minTherapeuticDose: 300,
    maxRecommendedDose: 600,
    hayasakaEqToFluoxetine40: 300.0,
    isRctEvidence: false,
    halfLifeHours: '2 - 4h (RIMA reversível)',
    cypInteractions: {
      cyp2C19: 'Inibidor',
      cyp2D6: 'Inibidor moderado',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Inibidor Reversível da MAO-A (RIMA). Menor risco de crise hipertensiva com tiramina em doses habituais.',
      'Washout mais curto necessário (24 a 48 horas) em comparação aos IMAOs irreversíveis.',
    ],
  },
};

export interface TransitionStep {
  stepNumber: number;
  periodLabel: string; // ex: 'Semana 1 (Dias 1 - 7)'
  sourceDose: string; // ex: 'Sertralina 50 mg/dia (redução de 50%)'
  targetDose: string; // ex: 'Desvenlafaxina 50 mg/dia (início da dose padrão)'
  clinicalAction: string;
  symptomsToMonitor: string;
}

export interface AntidepressantSwitchPlan {
  sourceDrug: AntidepressantInfo;
  sourceDoseMg: number;
  targetDrug: AntidepressantInfo;
  calculatedEquivalentDoseMg: number;
  recommendedStartingDoseMg: number;
  recommendedTargetDoseMg: number;
  evidenceSource: 'Hayasaka et al., 2015 (Meta-análise de RCTs)' | 'Consenso Clínico Especializado (Maudsley / APA / CANMAT)';
  strategyType: 'direct' | 'cross_taper' | 'washout';
  strategyTitle: string;
  strategySummary: string;
  durationWeeks: number;
  timelineSteps: TransitionStep[];
  pharmacologicalRationale: string[];
  clinicalRisks: {
    serotoninSyndrome: { risk: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico'; note: string };
    discontinuationSyndrome: { risk: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto'; note: string };
    cypInteractions: string[];
    cardiacAndOtherAlerts: string[];
  };
  patientInstructions: string[];
  soapPrescriptionText: string;
}

/**
 * Motor de Cálculo e Regras Farmacológicas de Transição entre Antidepressivos
 * Baseado no modelo de Hayasaka et al. (2015) e Maudsley Prescribing Guidelines (14ª Edição, 2021).
 */
export function calculateAntidepressantTransition(
  sourceDrugId: string,
  sourceDoseMg: number,
  targetDrugId: string
): AntidepressantSwitchPlan {
  const source = ANTIDEPRESSANTS_DB[sourceDrugId] || ANTIDEPRESSANTS_DB.fluoxetina;
  const target = ANTIDEPRESSANTS_DB[targetDrugId] || ANTIDEPRESSANTS_DB.sertralina;

  // 1. Cálculo da Dose Equivalente em relação ao padrão Hayasaka (referência Fluoxetina 40mg)
  const sourceRatioToFluoxetine40 = sourceDoseMg / source.hayasakaEqToFluoxetine40;
  const rawEquivalentDose = sourceRatioToFluoxetine40 * target.hayasakaEqToFluoxetine40;

  // Encontra a dose padrão comercial mais próxima
  let closestCommercialDose = target.standardDoses[0];
  let minDiff = Math.abs(target.standardDoses[0] - rawEquivalentDose);
  for (const stdDose of target.standardDoses) {
    const diff = Math.abs(stdDose - rawEquivalentDose);
    if (diff < minDiff) {
      minDiff = diff;
      closestCommercialDose = stdDose;
    }
  }

  // Dose inicial recomendada (geralmente a dose mínima terapêutica ou 50% da dose alvo)
  const initialDose = Math.min(target.minTherapeuticDose, closestCommercialDose);
  const targetDose = closestCommercialDose;

  const isRctEvidence = source.isRctEvidence && target.isRctEvidence;
  const evidenceSource = isRctEvidence
    ? 'Hayasaka et al., 2015 (Meta-análise de RCTs)'
    : 'Consenso Clínico Especializado (Maudsley / APA / CANMAT)';

  // 2. Determinação da Estratégia de Transição (Troca Direta vs Troca Cruzada vs Janela Livre)
  let strategyType: 'direct' | 'cross_taper' | 'washout' = 'cross_taper';
  let strategyTitle = 'Troca Cruzada Gradual';
  let strategySummary = '';
  let durationWeeks = 3;
  const timelineSteps: TransitionStep[] = [];
  const pharmacologicalRationale: string[] = [];

  // Regra 1: Qualquer troca envolvendo IMAO (Tranilcipromina / Moclobemida)
  if (source.class === 'IMAO' || target.class === 'IMAO') {
    strategyType = 'washout';
    strategyTitle = 'Troca com Janela de Descontinuação Obrigatória (Intervalo Livre de Fármacos)';

    if (source.id === 'fluoxetina' && target.id === 'tranilcipromina') {
      durationWeeks = 6;
      strategySummary = 'Devido à meia-vida prolongada da Fluoxetina e do seu metabólito ativo Norfluoxetina (~7 a 15 dias), é OBRIGATÓRIO aguardar 5 semanas (35 dias) de intervalo livre completo para prevenir Síndrome Serotoninérgica potencialmente fatal.';
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Semana 1 (Dias 1 - 7)',
          sourceDose: `${source.name} ${Math.round(sourceDoseMg / 2)} mg/dia`,
          targetDose: 'NENHUMA (Intervalo livre ainda não iniciado)',
          clinicalAction: 'Reduzir a dose de Fluoxetina pela metade.',
          symptomsToMonitor: 'Monitore estabilidade emocional e sintomas depressivos residuais.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Semanas 2 a 6 (Dias 8 a 42 - 5 Semanas de Intervalo Livre)',
          sourceDose: 'SUSPENSA TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR AINDA (Janela de eliminação plasmática)',
          clinicalAction: 'Aguardar 5 semanas completas sem nenhum antidepressivo.',
          symptomsToMonitor: 'Acompanhamento semanal na UBS ou via contato telefônico.',
        },
        {
          stepNumber: 3,
          periodLabel: 'Semana 7 em diante (Dia 43+)',
          sourceDose: 'SUSPENSA DEFINITIVAMENTE',
          targetDose: `${target.name} 10 mg/dia (manhã)`,
          clinicalAction: `Iniciar ${target.name} em dose inicial baixa com dieta estrita com restrição de Tiramina.`,
          symptomsToMonitor: 'Controle rigoroso da pressão arterial e adesão alimentar.',
        }
      );
    } else if (source.class !== 'IMAO' && target.id === 'tranilcipromina') {
      durationWeeks = 4;
      strategySummary = `Suspender gradualmente o antidepressivo atual e aguardar 14 dias (2 semanas) de intervalo livre absoluto antes de introduzir ${target.name}.`;
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Semana 1 (Dias 1 - 7)',
          sourceDose: `${source.name} ${Math.round(sourceDoseMg / 2)} mg/dia`,
          targetDose: 'NENHUMA',
          clinicalAction: `Redução de 50% na dose de ${source.name}.`,
          symptomsToMonitor: 'Sintomas de descontinuação (náuseas, vertigem).',
        },
        {
          stepNumber: 2,
          periodLabel: 'Semanas 2 e 3 (Dias 8 a 21 - 14 Dias de Intervalo Livre)',
          sourceDose: 'SUSPENSO TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR AINDA',
          clinicalAction: 'Período livre de fármacos para clareamento do transportador de serotonina.',
          symptomsToMonitor: 'Suporte psicológico e monitoramento semanal de humor.',
        },
        {
          stepNumber: 3,
          periodLabel: 'Semana 4 (Dia 22+)',
          sourceDose: 'SUSPENSO DEFINITIVAMENTE',
          targetDose: `${target.name} 10 mg/dia`,
          clinicalAction: `Introduzir ${target.name} 10 mg/dia após café da manhã com orientação dietética restritiva.`,
          symptomsToMonitor: 'Pressão arterial ortostática e queixas cefálicas.',
        }
      );
    } else if (source.id === 'tranilcipromina') {
      durationWeeks = 3;
      strategySummary = `A inibição da MAO é irreversível e exige 14 dias para que o organismo sintetize novas enzimas. Aguardar 14 dias de intervalo livre após a última dose de ${source.name} antes de iniciar ${target.name}.`;
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Dias 1 a 14 (Período de Intervalo Livre Obrigatório)',
          sourceDose: 'SUSPENSA TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR',
          clinicalAction: `Interromper ${source.name} e manter restrições dietéticas de tiramina durante todo o período de 14 dias.`,
          symptomsToMonitor: 'Refratariedade ou retorno de ansiedade/depressão.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Dia 15 em diante',
          sourceDose: 'SUSPENSA DEFINITIVAMENTE',
          targetDose: `${target.name} ${initialDose} mg/dia`,
          clinicalAction: `Iniciar ${target.name} na menor dose eficaz e liberar dieta aos poucos.`,
          symptomsToMonitor: 'Sintomas gástricos e resposta terapêutica.',
        }
      );
    }
  }
  // Regra 2: De Fluoxetina para outro ISRS/ISRN/Atípico (Graças à meia-vida da Norfluoxetina, pode-se fazer Troca Direta sem desmame)
  else if (source.id === 'fluoxetina') {
    strategyType = 'direct';
    strategyTitle = 'Troca Direta Facilitada (Auto-Desmame pela Meia-Vida Longa)';
    durationWeeks = 2;
    strategySummary = 'A Fluoxetina e seu metabólito ativo Norfluoxetina possuem meia-vida de até 15 dias. Por isso, a Fluoxetina realiza um "desmame biológico automático". Pode-se interromper a Fluoxetina e iniciar o novo fármaco no dia seguinte em dose baixa a moderada.';

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: 'SUSPENSA TOTALMENTE (0 mg/dia)',
        targetDose: `${target.name} ${initialDose} mg/dia`,
        clinicalAction: `Suspender a Fluoxetina no Dia 1 e iniciar ${target.name} ${initialDose} mg/dia no dia seguinte.`,
        symptomsToMonitor: 'Monitorar sinais leves de sobreposição serotoninérgica (náusea leve, inquietação transitória).',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 em diante (Dia 8+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} ${targetDose} mg/dia`,
        clinicalAction: `Ajustar ${target.name} para a dose terapêutica alvo (${targetDose} mg/dia).`,
        symptomsToMonitor: 'Avaliar resposta clínica e remissão de queixas.',
      }
    );
  }
  // Regra 3: Entre ISRS da mesma classe em doses baixas ou médias (Troca Direta ou Cruzada Curta)
  else if (source.class === 'ISRS' && target.class === 'ISRS' && sourceDoseMg <= source.hayasakaEqToFluoxetine40) {
    strategyType = 'direct';
    strategyTitle = 'Troca Direta';
    durationWeeks = 2;
    strategySummary = `Ambos pertencem à mesma classe farmacológica (ISRS). Em doses equivalentes baixas a médias, a transição pode ser realizada diretamente de um dia para o outro sem período de interrupção.`;

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: 'SUSPENSA (Troca Direta)',
        targetDose: `${target.name} ${initialDose} mg/dia`,
        clinicalAction: `Interromper ${source.name} e iniciar imediatamente ${target.name} ${initialDose} mg/dia no dia seguinte.`,
        symptomsToMonitor: 'Sintomas gástricos iniciais leves ou cefaleia transitória.',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 em diante (Dia 8+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} ${targetDose} mg/dia`,
        clinicalAction: `Se boa tolerabilidade, titular ${target.name} para a dose equivalente alvo (${targetDose} mg/dia).`,
        symptomsToMonitor: 'Eficácia clínica no controle dos sintomas.',
      }
    );
  }
  // Regra 4: Padrão Ouro — Troca Cruzada Gradual em 3 a 4 Semanas
  else {
    strategyType = 'cross_taper';
    strategyTitle = 'Troca Cruzada Gradual em 3 Semanas';
    durationWeeks = 3;
    strategySummary = `Reduz-se progressivamente a dose de ${source.name} enquanto se introduz e titula ${target.name}. Essa estratégia minimiza o risco de Síndrome de Descontinuação e previne períodos de desassistência farmacológica.`;

    const halfSourceDose = Math.round(sourceDoseMg / 2);

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: `${source.name} ${halfSourceDose} mg/dia (reduzir 50%)`,
        targetDose: `${target.name} ${initialDose} mg/dia (dose inicial)`,
        clinicalAction: `Diminuir ${source.name} pela metade e iniciar ${target.name} em dose inicial baixa/terapêutica.`,
        symptomsToMonitor: 'Sintomas de descontinuação (tontura, sensação de choque) e efeitos colaterais de adaptação.',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 (Dias 8 - 14)',
        sourceDose: sourceDoseMg > source.hayasakaEqToFluoxetine40
          ? `${source.name} ${Math.round(halfSourceDose / 2)} mg/dia (ou dias alternados)`
          : 'SUSPENSA TOTALMENTE (0 mg)',
        targetDose: `${target.name} ${initialDose} a ${targetDose} mg/dia`,
        clinicalAction: `Suspender totalmente (ou reduzir ainda mais) ${source.name} e manter ou progredir ${target.name}.`,
        symptomsToMonitor: 'Tolerabilidade e sono.',
      },
      {
        stepNumber: 3,
        periodLabel: 'Semana 3 em diante (Dia 15+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} ${targetDose} mg/dia (dose alvo equivalente)`,
        clinicalAction: `Estabilizar ${target.name} na dose alvo estimada (${targetDose} mg/dia).`,
        symptomsToMonitor: 'Avaliação da resposta clínica após 4 a 6 semanas de dose plena.',
      }
    );
  }

  // 3. Racional Farmacológico Específico
  pharmacologicalRationale.push(
    `Meia-vida de eliminação: ${source.name} (${source.halfLifeHours}${source.activeMetaboliteHalfLife ? ' | Metabólito ativo: ' + source.activeMetaboliteHalfLife : ''}) vs ${target.name} (${target.halfLifeHours}${target.activeMetaboliteHalfLife ? ' | Metabólito ativo: ' + target.activeMetaboliteHalfLife : ''}).`,
    `Potencial de Descontinuação do fármaco em desmame: ${source.discontinuationRisk} (risco ${source.discontinuationRisk === 'Muito Alto' || source.discontinuationRisk === 'Alto' ? 'elevado de sintomas tipo FINISH com retirada rápida' : 'baixo/moderado'}).`,
    `Equivalência calculada: ${source.name} ${sourceDoseMg} mg/dia ≈ ${target.name} ~${rawEquivalentDose.toFixed(1)} mg/dia (dose comercial mais próxima ajustada: ${targetDose} mg/dia).`
  );

  // 4. Interações CYP450
  const cypAlerts: string[] = [];
  if (source.cypInteractions?.cyp2D6 && ((source.cypInteractions.cyp2D6 || '').includes('Potente') || (source.cypInteractions.cyp2D6 || '').includes('Moderado'))) {
    cypAlerts.push(`${source.name} é inibidor ${source.cypInteractions.cyp2D6.toLowerCase()} de CYP2D6. Ao associar ou transicionar para drogas metabolizadas por CYP2D6 (${target.name}), os níveis plasmáticos de ${target.name} podem atingir picos maiores inicialmente.`);
  }
  if (source.cypInteractions?.cyp1A2 && (source.cypInteractions.cyp1A2 || '').includes('Potente')) {
    cypAlerts.push(`${source.name} é inibidor potente de CYP1A2.`);
  }

  // 5. Riscos Clínicos
  let serotoninRiskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico' = 'Moderado';
  let serotoninNote = 'Risco padrão de sobreposição serotoninérgica. Orientar paciente sobre tremores, sudorese excessiva e agitação.';

  if (source.class === 'IMAO' || target.class === 'IMAO') {
    serotoninRiskLevel = 'Crítico';
    serotoninNote = 'PERIGO FATAL: A combinação de IMAO com qualquer fármaco serotoninérgico pode precipitar tempestade serotoninérgica e colapso autonômico. O respeito ao período de intervalo livre é inegociável.';
  } else if (source.class === 'ISRS' && target.class === 'ISRN' && strategyType === 'cross_taper') {
    serotoninRiskLevel = 'Moderado';
    serotoninNote = 'Monitorar nas semanas de transição combinada quanto a hiperreflexia, náuseas e tremores finos.';
  }

  let discontinuationRiskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Muito Alto' = source.discontinuationRisk;
  let discontinuationNote = 'Sintomas da Síndrome FINISH (Flu-like, Insônia, Náusea, Instabilidade motora, Sensação de choque/brain zaps, Hiperarousal).';

  if (source.id === 'paroxetina' || source.id === 'venlafaxina') {
    discontinuationRiskLevel = 'Muito Alto';
    discontinuationNote = `Atenção máxima: ${source.name} possui meia-vida curta e alto índice de sintomas de descontinuação. Reduzir em passos lentos; se o paciente queixar-se de choques na cabeça ou vertigem intensa, desacelerar o desmame em 1 semana extra.`;
  }

  const cardiacAlerts: string[] = [];
  if (target.id === 'citalopram' || target.id === 'escitalopram') {
    cardiacAlerts.push('Atenção ao intervalo QTc: dose máxima de Citalopram 40 mg/dia (20 mg para idosos) e Escitalopram 20 mg/dia (10 mg para idosos).');
  }
  if (target.class === 'Tricíclico') {
    cardiacAlerts.push('Tricíclicos possuem efeito quinidina-símile (risco de alargamento de QRS e arritmias ventriculares). Recomenda-se ECG prévio em idosos.');
  }
  if (target.id === 'venlafaxina' || target.id === 'desvenlafaxina') {
    cardiacAlerts.push('Monitorar pressão arterial sistêmica devido à ativação noradrenérgica periférica.');
  }

  // 6. Orientações para o Paciente
  const patientInstructions: string[] = [
    `Siga exatamente o cronograma de caixas e dosagens indicado para cada semana. Nunca interrompa bruscamente ${source.name}.`,
    'Caso sinta tonturas, náuseas ou sensações rápidas semelhantes a "pequenos choques" na cabeça, não se assuste: são sintomas temporários de adaptação aos quais o corpo se acomodará.',
    'Entre em contato imediatamente com a equipe de saúde caso apresente febre alta inexplicada, tremores intensos, rigidez muscular ou confusão mental súbita.',
    'Evite o consumo de bebidas alcoólicas e não inicie medicamentos fitoterápicos (ex: Erva de São João / Hipérico) ou antigripais sem aviso prévio.',
  ];

  // 7. Texto estruturado para SOAP / Prescrição
  const soapStepsText = timelineSteps
    .map((s) => `• ${s.periodLabel}: [Desmame] ${s.sourceDose} + [Introdução] ${s.targetDose}`)
    .join('\n');

  const soapPrescriptionText = `PLANO DE TRANSIÇÃO E DESMAME DE ANTIDEPRESSIVO (${strategyTitle}):
Medicação Atual (Desmame): ${source.name} ${sourceDoseMg} mg/dia -> Nova Medicação (Introdução): ${target.name} (Dose Alvo Estimada: ${targetDose} mg/dia)
Fonte de Equivalência: ${evidenceSource}

CRONOGRAMA SEMANAL:
${soapStepsText}

Orientações: Paciente orientado sobre sintomas transitórios de descontinuação e sinais de alerta. Retorno pactuado em 3 a 4 semanas.`;

  return {
    sourceDrug: source,
    sourceDoseMg,
    targetDrug: target,
    calculatedEquivalentDoseMg: rawEquivalentDose,
    recommendedStartingDoseMg: initialDose,
    recommendedTargetDoseMg: targetDose,
    evidenceSource,
    strategyType,
    strategyTitle,
    strategySummary,
    durationWeeks,
    timelineSteps,
    pharmacologicalRationale,
    clinicalRisks: {
      serotoninSyndrome: { risk: serotoninRiskLevel, note: serotoninNote },
      discontinuationSyndrome: { risk: discontinuationRiskLevel, note: discontinuationNote },
      cypInteractions: cypAlerts,
      cardiacAndOtherAlerts: cardiacAlerts,
    },
    patientInstructions,
    soapPrescriptionText,
  };
}

/**
 * Tabela Resumida de Equivalência de Doses (baseada em Hayasaka et al. 2015 e consensos)
 */
export const EQUIVALENCE_REFERENCE_TABLE = [
  { drug: 'Fluoxetina', class: 'ISRS', dose40Eq: '40 mg', dose20Eq: '20 mg', isRct: true, halfLife: '2-3 dias (Norflx: 7-15 dias)', notes: 'Padrão de referência (Hayasaka 2015)' },
  { drug: 'Sertralina', class: 'ISRS', dose40Eq: '98,5 mg (~100 mg)', dose20Eq: '50 mg', isRct: true, halfLife: '26h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Escitalopram', class: 'ISRS', dose40Eq: '18,0 mg (~20 mg)', dose20Eq: '10 mg', isRct: true, halfLife: '30h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Citalopram', class: 'ISRS', dose40Eq: '36,6 mg (~40 mg)', dose20Eq: '20 mg', isRct: true, halfLife: '35h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Paroxetina', class: 'ISRS', dose40Eq: '34,0 mg (~40 mg)', dose20Eq: '20 mg', isRct: true, halfLife: '21h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Fluvoxamina', class: 'ISRS', dose40Eq: '143,3 mg (~150 mg)', dose20Eq: '75 mg', isRct: true, halfLife: '15-20h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Venlafaxina', class: 'ISRN', dose40Eq: '146,5 mg (~150 mg)', dose20Eq: '75 mg', isRct: true, halfLife: '5h (ODV: 11h)', notes: 'RCT Hayasaka 2015' },
  { drug: 'Desvenlafaxina', class: 'ISRN', dose40Eq: '90-100 mg', dose20Eq: '50 mg', isRct: false, halfLife: '11h', notes: 'Estimativa clínica consensual' },
  { drug: 'Duloxetina', class: 'ISRN', dose40Eq: '60-90 mg', dose20Eq: '30-60 mg', isRct: false, halfLife: '12h', notes: 'Estimativa clínica consensual' },
  { drug: 'Bupropiona', class: 'IRDN', dose40Eq: '300 mg', dose20Eq: '150 mg', isRct: false, halfLife: '14-21h', notes: 'Estimativa clínica consensual' },
  { drug: 'Mirtazapina', class: 'NaSSA', dose40Eq: '50,9 mg (~45 mg)', dose20Eq: '30 mg', isRct: true, halfLife: '20-40h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Vortioxetina', class: 'Multimodal', dose40Eq: '20 mg', dose20Eq: '10 mg', isRct: false, halfLife: '66h', notes: 'Estimativa clínica consensual' },
  { drug: 'Amitriptilina', class: 'Tricíclico', dose40Eq: '122,3 mg (~125-150 mg)', dose20Eq: '75 mg', isRct: true, halfLife: '15-30h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Nortriptilina', class: 'Tricíclico', dose40Eq: '75-100 mg', dose20Eq: '50 mg', isRct: false, halfLife: '20-40h', notes: 'Estimativa clínica consensual' },
  { drug: 'Clomipramina', class: 'Tricíclico', dose40Eq: '116,1 mg (~125 mg)', dose20Eq: '75 mg', isRct: true, halfLife: '20-32h', notes: 'RCT Hayasaka 2015' },
  { drug: 'Tranilcipromina', class: 'IMAO', dose40Eq: '25-30 mg', dose20Eq: '20 mg', isRct: false, halfLife: '2h (irreversível)', notes: 'Washout obrigatório de 14d / 5 sem' },
  { drug: 'Moclobemida', class: 'IMAO', dose40Eq: '300 mg', dose20Eq: '150 mg', isRct: false, halfLife: '2-4h (RIMA)', notes: 'Washout curto (24-48h)' },
];
