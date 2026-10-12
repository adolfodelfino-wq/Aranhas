/**
 * Nexus Clínico — Módulo Farmacológico de Transição entre Antidepressivos
 *
 * Base Científica:
 * 1. Hayasaka Y et al. Dose equivalents of antidepressants: Evidence-based recommendations
 *    from randomized controlled trials. J Affect Disord. 2015;180:179-184. DOI: 10.1016/j.jad.2015.03.021
 *    (Análise primária estabelecendo equivalências à Fluoxetina 40 mg/dia para 12 antidepressivos;
 *    citalopram e drogas mais recentes não tiveram coeficientes primários estabelecidos).
 * 2. Taylor DM, Barnes TRE, Young AH. The Maudsley Prescribing Guidelines in Psychiatry. 15th ed. Wiley, 2025.
 * 3. Horowitz MA, Taylor DM. The Maudsley Deprescribing Guidelines. Wiley, 2024. DOI: 10.1002/9781394291052.
 * 4. Lam RW et al. CANMAT 2023 Update on Clinical Guidelines for Management of Major Depressive Disorder in Adults.
 *    Can J Psychiatry. 2024;69(9):641-687. DOI: 10.1177/07067437241245384.
 * 5. NHS Specialist Pharmacy Service (SPS 2024). Switching strategies for antidepressants in adults.
 */

export interface AntidepressantInfo {
  id: string;
  name: string;
  class: 'ISRS' | 'ISRN' | 'Atípico / Modulador' | 'Tricíclico' | 'IMAO' | 'Outro';
  standardDoses: number[];
  recommendedStartingDoseMg: number; // Dose de introdução clínica recomendada
  referenceTherapeuticRange: {
    min: number;
    max: number;
    unit: string;
    clinicalNotes?: string;
  }; // Faixa terapêutica de referência (Maudsley 15ª ed. 2025 / CANMAT 2023)
  hayasakaEquivalenceToFluoxetine40: number | null; // Equivalência do estudo primário Hayasaka et al. (2015) para Fluoxetina 40mg
  // Propriedades mantidas para compatibilidade retroativa:
  minTherapeuticDose: number;
  maxRecommendedDose: number;
  hayasakaEqToFluoxetine40: number | null;
  isRctEvidence: boolean;
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
    standardDoses: [10, 20, 40, 60],
    recommendedStartingDoseMg: 20,
    referenceTherapeuticRange: {
      min: 20,
      max: 60,
      unit: 'mg/dia',
      clinicalNotes: 'Dose máxima até 80 mg/dia em casos refratários ou bulimia nervosa.',
    },
    hayasakaEquivalenceToFluoxetine40: 40.0,
    minTherapeuticDose: 20,
    maxRecommendedDose: 80,
    hayasakaEqToFluoxetine40: 40.0,
    isRctEvidence: true,
    halfLifeHours: '48 - 72h (2-3 dias)',
    activeMetaboliteHalfLife: 'Norfluoxetina: 168 - 360h (7-15 dias)',
    cypInteractions: {
      cyp2D6: 'Inibidor potente',
      cyp2C19: 'Inibidor moderado',
      cyp3A4: 'Inibidor fraco',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Meia-vida biológica ultralonga (Norfluoxetina: até 15 dias). Proporciona autodesmame natural e dispensa desmame em pequenos degraus.',
      'Inibidor potente de CYP2D6: eleva fortemente os níveis séricos de tricíclicos, antipsicóticos e carvedilol/metoprolol.',
      'Washout de 5 semanas (35 dias) OBRIGATÓRIO antes de iniciar IMAO irreversível (Tranilcipromina).',
    ],
  },
  sertralina: {
    id: 'sertralina',
    name: 'Sertralina',
    class: 'ISRS',
    standardDoses: [25, 50, 100, 150, 200],
    recommendedStartingDoseMg: 50,
    referenceTherapeuticRange: {
      min: 50,
      max: 200,
      unit: 'mg/dia',
      clinicalNotes: 'Pode iniciar com 25 mg/dia nos primeiros 4 a 7 dias em pacientes com transtorno de pânico ou idosos.',
    },
    hayasakaEquivalenceToFluoxetine40: 98.5,
    minTherapeuticDose: 50,
    maxRecommendedDose: 200,
    hayasakaEqToFluoxetine40: 98.5,
    isRctEvidence: true,
    halfLifeHours: '26h',
    activeMetaboliteHalfLife: 'N-desmetilsertralina: 62 - 104h (pouca relevância clínica)',
    cypInteractions: {
      cyp2D6: 'Fraco (moderado em doses >150 mg/dia)',
      cyp2C19: 'Fraco',
      cyp3A4: 'Fraco',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Perfil de segurança cardiovascular de primeira linha (estudos SADHART e ENRICHD).',
      'Baixo potencial de interações farmacocinéticas comparada a fluoxetina e paroxetina.',
    ],
  },
  escitalopram: {
    id: 'escitalopram',
    name: 'Escitalopram',
    class: 'ISRS',
    standardDoses: [5, 10, 15, 20],
    recommendedStartingDoseMg: 10,
    referenceTherapeuticRange: {
      min: 10,
      max: 20,
      unit: 'mg/dia',
      clinicalNotes: 'Dose máxima de 10 mg/dia para idosos (>65 anos) devido ao risco de prolongamento do intervalo QTc.',
    },
    hayasakaEquivalenceToFluoxetine40: 18.0,
    minTherapeuticDose: 10,
    maxRecommendedDose: 20,
    hayasakaEqToFluoxetine40: 18.0,
    isRctEvidence: true,
    halfLifeHours: '27 - 32h',
    cypInteractions: {
      cyp2D6: 'Inibidor fraco',
      cyp2C19: 'Substrato principal',
      cyp3A4: 'Substrato secundário',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'ISRS de maior seletividade para o transportador de serotonina (SERT).',
      'Risco dose-dependente de prolongamento do intervalo QTc (dose máxima em idosos limitada a 10 mg/dia).',
    ],
  },
  citalopram: {
    id: 'citalopram',
    name: 'Citalopram',
    class: 'ISRS',
    standardDoses: [10, 20, 30, 40],
    recommendedStartingDoseMg: 20,
    referenceTherapeuticRange: {
      min: 20,
      max: 40,
      unit: 'mg/dia',
      clinicalNotes: 'Dose máxima de 20 mg/dia em idosos (>65 anos) e em insuficiência hepática (alerta FDA/Anvisa sobre QTc).',
    },
    hayasakaEquivalenceToFluoxetine40: null, // Não consta entre as equivalências primárias a Fluoxetina 40mg do estudo Hayasaka 2015
    minTherapeuticDose: 20,
    maxRecommendedDose: 40,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '35h',
    cypInteractions: {
      cyp2C19: 'Substrato',
      cyp2D6: 'Inibidor fraco',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Não teve equivalência primária estabelecida no resumo de Hayasaka et al. (2015). A prescrição deve seguir a faixa terapêutica clínica.',
      'Alerta estrito de prolongamento de QTc e risco de Torsades de Pointes: teto de 40 mg/dia (20 mg/dia para idosos).',
    ],
  },
  paroxetina: {
    id: 'paroxetina',
    name: 'Paroxetina',
    class: 'ISRS',
    standardDoses: [10, 20, 30, 40, 50, 60],
    recommendedStartingDoseMg: 20,
    referenceTherapeuticRange: {
      min: 20,
      max: 50,
      unit: 'mg/dia',
      clinicalNotes: 'Dose máxima até 60 mg/dia em TOC e fobia social; iniciar com 10 mg em idosos.',
    },
    hayasakaEquivalenceToFluoxetine40: 34.0,
    minTherapeuticDose: 20,
    maxRecommendedDose: 60,
    hayasakaEqToFluoxetine40: 34.0,
    isRctEvidence: true,
    halfLifeHours: '21 - 24h',
    cypInteractions: {
      cyp2D6: 'Inibidor potente (inibe seu próprio metabolismo)',
      cyp1A2: 'Inibidor fraco',
      cyp3A4: 'Inibidor fraco',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Risco elevadíssimo de Síndrome de Descontinuação (meia-vida curta, ausência de metabólitos ativos e efeito anticolinérgico). Exige desmame lento.',
      'Carga anticolinérgica intrínseca significativa (boca seca, constipação, sonolência e potencial piora cognitiva em idosos).',
      'Inibidor potente do CYP2D6.',
    ],
  },
  fluvoxamina: {
    id: 'fluvoxamina',
    name: 'Fluvoxamina',
    class: 'ISRS',
    standardDoses: [50, 100, 150, 200, 300],
    recommendedStartingDoseMg: 50,
    referenceTherapeuticRange: {
      min: 100,
      max: 300,
      unit: 'mg/dia',
      clinicalNotes: 'Doses superiores a 100 mg/dia devem ser divididas em 2 tomadas, com a maior dose ao deitar.',
    },
    hayasakaEquivalenceToFluoxetine40: 143.3,
    minTherapeuticDose: 100,
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: 143.3,
    isRctEvidence: true,
    halfLifeHours: '15 - 20h',
    cypInteractions: {
      cyp1A2: 'Inibidor muito potente',
      cyp2C19: 'Inibidor potente',
      cyp2C9: 'Inibidor moderado',
      cyp3A4: 'Inibidor moderado',
      cyp2D6: 'Inibidor fraco',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Inibidor potente de CYP1A2: contraindicação estrita com tizanidina e ramelteona. Eleva maciçamente os níveis séricos de clozapina, teofilina e cafeína.',
      'Afinidade marcante com receptores Sigma-1.',
    ],
  },
  venlafaxina: {
    id: 'venlafaxina',
    name: 'Venlafaxina (XR)',
    class: 'ISRN',
    standardDoses: [37.5, 75, 150, 225],
    recommendedStartingDoseMg: 75,
    referenceTherapeuticRange: {
      min: 75,
      max: 225,
      unit: 'mg/dia',
      clinicalNotes: 'Iniciar com 37.5 mg/dia por 4 a 7 dias para atenuar náuseas; em ambiente hospitalar/refratário, titulação até 375 mg/dia.',
    },
    hayasakaEquivalenceToFluoxetine40: 149.4,
    minTherapeuticDose: 75,
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: 149.4,
    isRctEvidence: true,
    halfLifeHours: '5h',
    activeMetaboliteHalfLife: 'O-desmetilvenlafaxina: 11h',
    cypInteractions: {
      cyp2D6: 'Substrato (fraco inibidor em doses elevadas)',
      cyp3A4: 'Substrato',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Bloqueio predominantemente serotoninérgico abaixo de 150 mg/dia; inibição da recaptação de noradrenalina torna-se clinicamente relevante a partir de ≥150 mg/dia.',
      'Risco severo de síndrome de descontinuação (sensação de "choques na cabeça", náuseas, vertigem incapacitante). Exige desmame lento.',
      'Monitorar rotineiramente a pressão arterial sistêmica e a frequência cardíaca em doses ≥150 mg/dia.',
    ],
  },
  desvenlafaxina: {
    id: 'desvenlafaxina',
    name: 'Desvenlafaxina',
    class: 'ISRN',
    standardDoses: [50, 100],
    recommendedStartingDoseMg: 50,
    referenceTherapeuticRange: {
      min: 50,
      max: 100,
      unit: 'mg/dia',
      clinicalNotes: 'A dose de 50 mg/dia é a dose terapêutica recomendada. Doses de 100 mg/dia não demonstraram benefício adicional consistente na maioria dos ensaios clínicos e aumentam eventos adversos.',
    },
    hayasakaEquivalenceToFluoxetine40: null, // Fármaco não avaliado na meta-análise primária de Hayasaka et al. (2015)
    minTherapeuticDose: 50,
    maxRecommendedDose: 150,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '11h',
    cypInteractions: {
      cyp2D6: 'Inibidor fraco',
      cyp3A4: 'Mínimo',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Metabólito ativo direto da venlafaxina (eliminação predominantemente por conjugação glicurônica, independente do CYP2D6).',
      'Não avaliada na meta-análise de Hayasaka et al. (2015). A prescrição baseia-se na dose de introdução clínica de 50 mg/dia e na faixa de referência (50-100 mg/dia).',
      'Monitorar pressão arterial devido à ação noradrenérgica.',
    ],
  },
  duloxetina: {
    id: 'duloxetina',
    name: 'Duloxetina',
    class: 'ISRN',
    standardDoses: [30, 60, 90, 120],
    recommendedStartingDoseMg: 30,
    referenceTherapeuticRange: {
      min: 60,
      max: 120,
      unit: 'mg/dia',
      clinicalNotes: 'Dose terapêutica padrão para depressão e dor crônica é 60 mg/dia. Doses de 30 mg são utilizadas apenas para adaptação inicial de 1 a 2 semanas.',
    },
    hayasakaEquivalenceToFluoxetine40: null, // Não contemplada na análise primária de Hayasaka 2015
    minTherapeuticDose: 60,
    maxRecommendedDose: 120,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '12h',
    cypInteractions: {
      cyp2D6: 'Inibidor moderado',
      cyp1A2: 'Substrato principal',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Duplo bloqueio equilibrado de serotonina e noradrenalina desde o início. Eficaz também em dor crônica neuropática e osteomuscular.',
      'Contraindicada em hepatopatia grave ou consumo crônico abusivo de álcool.',
      'Inibidor moderado do CYP2D6.',
    ],
  },
  bupropiona: {
    id: 'bupropiona',
    name: 'Bupropiona (XL/SR)',
    class: 'Atípico / Modulador',
    standardDoses: [150, 300],
    recommendedStartingDoseMg: 150,
    referenceTherapeuticRange: {
      min: 150,
      max: 300,
      unit: 'mg/dia',
      clinicalNotes: 'Titulação para 300 mg/dia após 1 a 2 semanas se boa tolerabilidade. Dose máxima ambulatorial de 450 mg/dia.',
    },
    hayasakaEquivalenceToFluoxetine40: 348.5, // Incluída no estudo de Hayasaka et al. (2015)
    minTherapeuticDose: 150,
    maxRecommendedDose: 450,
    hayasakaEqToFluoxetine40: 348.5,
    isRctEvidence: true,
    halfLifeHours: '14 - 21h',
    activeMetaboliteHalfLife: 'Hidroxibupropiona: 20 - 37h',
    cypInteractions: {
      cyp2D6: 'Inibidor potente',
      cyp2B6: 'Substrato principal',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Moderado', // Não possui ação serotoninérgica direta
    specialAlerts: [
      'Inibidor da recaptação de dopamina e noradrenalina (IRDN). Não afeta serotonina (isenta de disfunção sexual e ganho ponderal).',
      'Contraindicada formalmente em histórico de convulsões, bulimia/anorexia e abstinência abrupta de álcool ou benzodiazepínicos.',
      'Inibidor potente do CYP2D6.',
    ],
  },
  mirtazapina: {
    id: 'mirtazapina',
    name: 'Mirtazapina',
    class: 'Atípico / Modulador',
    standardDoses: [15, 30, 45],
    recommendedStartingDoseMg: 15,
    referenceTherapeuticRange: {
      min: 15,
      max: 45,
      unit: 'mg/dia',
      clinicalNotes: 'Administrar sempre em dose única noturna (ao deitar) devido ao forte bloqueio anti-histamínico H1.',
    },
    hayasakaEquivalenceToFluoxetine40: 50.9, // Incluída no estudo de Hayasaka et al. (2015)
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
      'Antagonista alfa-2 pré-sináptico e bloqueador 5-HT2/5-HT3 e H1 (NaSSA).',
      'Maior efeito sedativo em doses baixas (7.5 a 15 mg/dia) por predomínio do bloqueio histaminérgico; ação noradrenérgica aumenta em 30 a 45 mg/dia.',
      'Aumento marcante de apetite e ganho de peso.',
    ],
  },
  vortioxetina: {
    id: 'vortioxetina',
    name: 'Vortioxetina',
    class: 'Atípico / Modulador',
    standardDoses: [5, 10, 15, 20],
    recommendedStartingDoseMg: 10,
    referenceTherapeuticRange: {
      min: 10,
      max: 20,
      unit: 'mg/dia',
      clinicalNotes: 'Iniciar com 5 mg/dia em idosos (>65 anos). Dose máxima de 20 mg/dia.',
    },
    hayasakaEquivalenceToFluoxetine40: null, // Não incluída na análise primária de Hayasaka 2015
    minTherapeuticDose: 10,
    maxRecommendedDose: 20,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '66h',
    cypInteractions: {
      cyp2D6: 'Substrato principal',
      cyp3A4: 'Substrato secundário',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antidepressivo multimodal (bloqueio do SERT + agonismo 5-HT1A + antagonismo 5-HT3/5-HT7).',
      'Excelente tolerabilidade cognitiva e menor incidência de disfunção sexual.',
      'Meia-vida longa (~66 horas). Reduzir dose pela metade se coadministrada com inibidores potentes de CYP2D6 (ex.: fluoxetina, bupropiona).',
    ],
  },
  trazodona: {
    id: 'trazodona',
    name: 'Trazodona',
    class: 'Atípico / Modulador',
    standardDoses: [50, 100, 150, 300],
    recommendedStartingDoseMg: 150,
    referenceTherapeuticRange: {
      min: 150,
      max: 300,
      unit: 'mg/dia',
      clinicalNotes: 'Doses de 50 a 100 mg/dia atuam apenas como hipnótico/sedativo. Ação antidepressiva requer doses ≥150 mg/dia divididas ou XR.',
    },
    hayasakaEquivalenceToFluoxetine40: null,
    minTherapeuticDose: 150,
    maxRecommendedDose: 300,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '7 - 13h',
    cypInteractions: {
      cyp3A4: 'Substrato principal',
      cyp2D6: 'Substrato menor',
    },
    discontinuationRisk: 'Baixo',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Antagonista 5-HT2A e inibidor da recaptação de serotonina (SARI).',
      'Risco de hipotensão ortostática e priapismo (raro, mas emergência urológica).',
    ],
  },
  amitriptilina: {
    id: 'amitriptilina',
    name: 'Amitriptilina',
    class: 'Tricíclico',
    standardDoses: [25, 50, 75, 100, 150],
    recommendedStartingDoseMg: 25,
    referenceTherapeuticRange: {
      min: 75,
      max: 150,
      unit: 'mg/dia',
      clinicalNotes: 'Dose analgésica/neuropática: 10 a 50 mg/dia ao deitar. Dose antidepressiva plena: 75 a 150 mg/dia.',
    },
    hayasakaEquivalenceToFluoxetine40: 122.3, // Incluída no estudo de Hayasaka et al. (2015)
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
      'Potente ação anticolinérgica, anti-histamínica e bloqueadora alfa-adrenérgica.',
      'Cardiotoxicidade e risco de letalidade em caso de intoxicação exógena (arritmias por alargamento de QRS/QTc). Solicitar ECG antes de prescrever em idosos ou cardiopatas.',
      'Níveis plasmáticos quadruplicam na presença de inibidores de CYP2D6 (fluoxetina, paroxetina, bupropiona).',
    ],
  },
  nortriptilina: {
    id: 'nortriptilina',
    name: 'Nortriptilina',
    class: 'Tricíclico',
    standardDoses: [25, 50, 75, 100],
    recommendedStartingDoseMg: 25,
    referenceTherapeuticRange: {
      min: 50,
      max: 100,
      unit: 'mg/dia',
      clinicalNotes: 'Janela terapêutica plasmática bem estabelecida (50 a 150 ng/mL). Doses >100 mg/dia podem reduzir eficácia por efeito de janela.',
    },
    hayasakaEquivalenceToFluoxetine40: 100.9, // Incluída no estudo de Hayasaka et al. (2015)
    minTherapeuticDose: 50,
    maxRecommendedDose: 100,
    hayasakaEqToFluoxetine40: 100.9,
    isRctEvidence: true,
    halfLifeHours: '20 - 40h',
    cypInteractions: {
      cyp2D6: 'Substrato principal',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Metabólito ativo da amitriptilina. Menor risco de hipotensão ortostática e menor carga anticolinérgica (mais segura em idosos).',
      'Cardiotoxicidade dose-dependente semelhante aos demais tricíclicos.',
    ],
  },
  clomipramina: {
    id: 'clomipramina',
    name: 'Clomipramina',
    class: 'Tricíclico',
    standardDoses: [25, 75, 150, 225],
    recommendedStartingDoseMg: 25,
    referenceTherapeuticRange: {
      min: 100,
      max: 225,
      unit: 'mg/dia',
      clinicalNotes: 'Padrão-ouro histórico farmacológico no TOC. Iniciar com 25 mg/dia e titular gradualmente para minimizar efeitos colaterais.',
    },
    hayasakaEquivalenceToFluoxetine40: 116.1, // Incluída no estudo de Hayasaka et al. (2015)
    minTherapeuticDose: 75,
    maxRecommendedDose: 225,
    hayasakaEqToFluoxetine40: 116.1,
    isRctEvidence: true,
    halfLifeHours: '20 - 32h',
    activeMetaboliteHalfLife: 'Desmetilclomipramina: 36 - 60h',
    cypInteractions: {
      cyp2D6: 'Substrato e inibidor moderado',
      cyp1A2: 'Substrato',
      cyp2C19: 'Substrato',
    },
    discontinuationRisk: 'Alto',
    serotoninRisk: 'Muito Alto',
    specialAlerts: [
      'Tricíclico com maior potência inibidora da recaptação de serotonina.',
      'Elevadíssimo risco de síndrome serotoninérgica em associações e maior potencial epileptogênico entre os tricíclicos.',
    ],
  },
  tranilcipromina: {
    id: 'tranilcipromina',
    name: 'Tranilcipromina',
    class: 'IMAO',
    standardDoses: [10, 20, 30, 40],
    recommendedStartingDoseMg: 10,
    referenceTherapeuticRange: {
      min: 20,
      max: 40,
      unit: 'mg/dia',
      clinicalNotes: 'Dose máxima até 60 mg/dia sob supervisão especializada de psiquiatria.',
    },
    hayasakaEquivalenceToFluoxetine40: null,
    minTherapeuticDose: 20,
    maxRecommendedDose: 60,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '2h (mas inibição irreversível da MAO dura 14 dias)',
    cypInteractions: {
      cyp2C19: 'Inibidor',
      cyp2A6: 'Inibidor',
    },
    discontinuationRisk: 'Muito Alto',
    serotoninRisk: 'Muito Alto (IMAO)',
    specialAlerts: [
      'IMAO Irreversível e Não-Seletivo (inibe MAO-A e MAO-B).',
      'RISCO CRÍTICO: Exige dieta estrita com restrição de tiramina sob risco de crise hipertensiva fatal (efeito queijo).',
      'WASHOUT OBRIGATÓRIO: 14 dias de intervalo livre após suspender qualquer outro antidepressivo (ou 5 semanas se for fluoxetina). E 14 dias após suspender tranilcipromina antes de introduzir qualquer outro antidepressivo!',
    ],
  },
  moclobemida: {
    id: 'moclobemida',
    name: 'Moclobemida',
    class: 'IMAO',
    standardDoses: [150, 300, 600],
    recommendedStartingDoseMg: 150,
    referenceTherapeuticRange: {
      min: 300,
      max: 600,
      unit: 'mg/dia',
      clinicalNotes: 'Doses fracionadas após as refeições. Iniciar com 150 a 300 mg/dia.',
    },
    hayasakaEquivalenceToFluoxetine40: null,
    minTherapeuticDose: 300,
    maxRecommendedDose: 600,
    hayasakaEqToFluoxetine40: null,
    isRctEvidence: false,
    halfLifeHours: '2 - 4h (RIMA reversível)',
    cypInteractions: {
      cyp2C19: 'Inibidor',
      cyp2D6: 'Inibidor moderado',
    },
    discontinuationRisk: 'Moderado',
    serotoninRisk: 'Alto',
    specialAlerts: [
      'Inibidor Reversível da MAO-A (RIMA). Menor risco de crise hipertensiva por tiramina em doses habituais.',
      'Washout mais curto necessário (24 a 48 horas) em comparação aos IMAOs irreversíveis.',
    ],
  },
};

export interface TransitionStep {
  stepNumber: number;
  periodLabel: string; // Ex: 'Semana 1 (Dias 1 - 7)'
  sourceDose: string; // Ex: 'Sertralina 50 mg/dia (redução de 50%)'
  targetDose: string; // Ex: 'Desvenlafaxina 50 mg/dia (dose de introdução)'
  clinicalAction: string;
  symptomsToMonitor: string;
}

export interface EstimatedEquivalenceInfo {
  available: boolean;
  valueText: string;
  explanation: string;
  isRct: boolean;
}

export interface AntidepressantSwitchPlan {
  sourceDrug: AntidepressantInfo;
  sourceDoseMg: number;
  targetDrug: AntidepressantInfo;
  hasValidatedProtocol: boolean;
  unsupportedReason?: string;
  // Três pilares farmacológicos claramente separados:
  estimatedEquivalence: EstimatedEquivalenceInfo;
  referenceTherapeuticRange: { min: number; max: number; unit: string; clinicalNotes?: string };
  recommendedStartingDoseMg: number;
  // Estratégia de transição (NHS SPS / Maudsley 15ª ed. 2025):
  strategyType: 'direct' | 'cross_taper' | 'washout' | 'individualized';
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
  // Campos de compatibilidade com interfaces anteriores:
  calculatedEquivalentDoseMg: number;
  recommendedTargetDoseMg: number;
  evidenceSource: string;
}

/**
 * Motor determinístico de transição entre antidepressivos.
 * Baseado estritamente em:
 * - Hayasaka et al. (2015) para equivalências baseadas em ensaios clínicos (quando disponíveis)
 * - The Maudsley Prescribing Guidelines in Psychiatry (15ª Ed., 2025)
 * - CANMAT (2023) e NHS Specialist Pharmacy Service (SPS 2024)
 *
 * Princípio P0: Não transforma equivalências teóricas em doses de prescrição obrigatórias.
 * Não gera cronograma para pares sem protocolo validado.
 */
export function calculateAntidepressantTransition(
  sourceDrugId: string,
  sourceDoseMg: number,
  targetDrugId: string
): AntidepressantSwitchPlan {
  const source = ANTIDEPRESSANTS_DB[sourceDrugId] || ANTIDEPRESSANTS_DB.fluoxetina;
  const target = ANTIDEPRESSANTS_DB[targetDrugId] || ANTIDEPRESSANTS_DB.sertralina;

  // 1. Pilar 1: Equivalência Estimada (Hayasaka 2015)
  let estimatedEquivalence: EstimatedEquivalenceInfo;
  let rawEquivalentDose = 0;

  if (source.id === target.id) {
    estimatedEquivalence = {
      available: true,
      valueText: `${sourceDoseMg} mg/dia`,
      explanation: 'Mesmo medicamento selecionado (manutenção da mesma dose).',
      isRct: true,
    };
    rawEquivalentDose = sourceDoseMg;
  } else if (
    source.hayasakaEquivalenceToFluoxetine40 !== null &&
    target.hayasakaEquivalenceToFluoxetine40 !== null
  ) {
    const ratioToFluoxetine40 = sourceDoseMg / source.hayasakaEquivalenceToFluoxetine40;
    rawEquivalentDose = ratioToFluoxetine40 * target.hayasakaEquivalenceToFluoxetine40;
    estimatedEquivalence = {
      available: true,
      valueText: `~${rawEquivalentDose.toFixed(1)} mg/dia`,
      explanation: `Equivalência teórica segundo meta-análise de ensaios clínicos de Hayasaka et al. (2015, DOI: 10.1016/j.jad.2015.03.021), tomando Fluoxetina 40 mg/dia como referência. ATENÇÃO: É um valor descritivo populacional, NÃO uma dose de prescrição individual.`,
      isRct: true,
    };
  } else {
    estimatedEquivalence = {
      available: false,
      valueText: 'Não disponível em ensaios clínicos',
      explanation: `Pelo menos um dos medicamentos (${source.hayasakaEquivalenceToFluoxetine40 === null ? source.name : ''}${source.hayasakaEquivalenceToFluoxetine40 === null && target.hayasakaEquivalenceToFluoxetine40 === null ? ' e ' : ''}${target.hayasakaEquivalenceToFluoxetine40 === null ? target.name : ''}) não possui coeficiente de equivalência primário estabelecido na meta-análise de Hayasaka et al. (2015). A prescrição deve seguir a dose de introdução clínica e a faixa terapêutica recomendada.`,
      isRct: false,
    };
  }

  // 2. Pilar 2: Dose Terapêutica de Referência
  const referenceTherapeuticRange = target.referenceTherapeuticRange;

  // 3. Pilar 3: Dose de Introdução Recomendada
  const recommendedStartingDoseMg = target.recommendedStartingDoseMg;

  // 4. Determinação da Estratégia de Transição (NHS SPS 2024 / Maudsley 15ª ed. 2025)
  let hasValidatedProtocol = true;
  let unsupportedReason: string | undefined;
  let strategyType: 'direct' | 'cross_taper' | 'washout' | 'individualized' = 'cross_taper';
  let strategyTitle = 'Troca Cruzada Gradual';
  let strategySummary = '';
  let durationWeeks = 3;
  const timelineSteps: TransitionStep[] = [];
  const pharmacologicalRationale: string[] = [];

  // -------------------------------------------------------------
  // REGRA A: ENVOLVENDO IMAO (Tranilcipromina / Moclobemida)
  // Washout estrito obrigatório para prevenir Síndrome Serotoninérgica letal
  // -------------------------------------------------------------
  if (source.class === 'IMAO' || target.class === 'IMAO') {
    strategyType = 'washout';
    strategyTitle = 'Washout Obrigatório (Janela Livre de Fármacos)';

    if (source.id === 'fluoxetina' && target.id === 'tranilcipromina') {
      durationWeeks = 6;
      strategySummary = 'Devido à meia-vida ultralonga da norfluoxetina (até 15 dias), é OBRIGATÓRIO aguardar 5 semanas (35 dias) de intervalo livre completo entre a suspensão da fluoxetina e o início da tranilcipromina.';
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Semana 1 (Dias 1 - 7)',
          sourceDose: `${source.name} ${Math.round(sourceDoseMg / 2)} mg/dia`,
          targetDose: 'NÃO INICIAR',
          clinicalAction: 'Reduzir a dose de Fluoxetina pela metade.',
          symptomsToMonitor: 'Estabilidade emocional e queixas de descontinuação.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Semanas 2 a 6 (Dias 8 a 42 — 5 Semanas Livres)',
          sourceDose: 'SUSPENSA TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR (Janela de eliminação da norfluoxetina)',
          clinicalAction: 'Período livre de fármacos. Acompanhamento semanal de suporte.',
          symptomsToMonitor: 'Sinais de piora depressiva ou ansiedade.',
        },
        {
          stepNumber: 3,
          periodLabel: 'Semana 7 em diante (Dia 43+)',
          sourceDose: 'SUSPENSA DEFINITIVAMENTE',
          targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
          clinicalAction: `Iniciar ${target.name} sob dieta estrita com restrição de tiramina.`,
          symptomsToMonitor: 'Pressão arterial (risco de crise hipertensiva com tiramina).',
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
          targetDose: 'NÃO INICIAR',
          clinicalAction: `Redução de 50% na dose de ${source.name}.`,
          symptomsToMonitor: 'Sintomas de descontinuação (vertigem, náuseas).',
        },
        {
          stepNumber: 2,
          periodLabel: 'Semanas 2 e 3 (Dias 8 a 21 — 14 Dias Livres)',
          sourceDose: 'SUSPENSO TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR (Aguardar clareamento farmacológico)',
          clinicalAction: 'Intervalo livre obrigatório para eliminação de fármacos serotoninérgicos.',
          symptomsToMonitor: 'Sintomas depressivos e suporte psicoterápico.',
        },
        {
          stepNumber: 3,
          periodLabel: 'Semana 4 (Dia 22+)',
          sourceDose: 'SUSPENSO DEFINITIVAMENTE',
          targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
          clinicalAction: `Introduzir ${target.name} ${recommendedStartingDoseMg} mg/dia com orientação dietética restritiva.`,
          symptomsToMonitor: 'Pressão arterial ortostática.',
        }
      );
    } else if (source.id === 'tranilcipromina') {
      durationWeeks = 3;
      strategySummary = `A inibição da MAO é irreversível e exige 14 dias para que o organismo ressíntese novas enzimas MAO. Aguardar 14 dias de intervalo livre após a última dose de ${source.name} antes de iniciar ${target.name}.`;
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Dias 1 a 14 (Intervalo Livre de 14 dias)',
          sourceDose: 'SUSPENSA TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR',
          clinicalAction: `Interromper ${source.name} e manter a dieta sem tiramina durante todo o período de 14 dias.`,
          symptomsToMonitor: 'Ansiedade de rebote e retorno de humor deprimido.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Dia 15 em diante',
          sourceDose: 'SUSPENSA DEFINITIVAMENTE',
          targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
          clinicalAction: `Iniciar ${target.name} na dose de introdução clínica recomendada (${recommendedStartingDoseMg} mg/dia).`,
          symptomsToMonitor: 'Tolerabilidade gastrointestinal e resposta clínica.',
        }
      );
    } else if (source.id === 'moclobemida') {
      durationWeeks = 2;
      strategySummary = 'A moclobemida é um inibidor reversível da MAO-A (RIMA) com meia-vida curta (2 a 4 horas). Um intervalo livre de 24 a 48 horas é suficiente antes de introduzir o novo antidepressivo.';
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Dias 1 e 2 (Washout de 48 horas)',
          sourceDose: 'SUSPENSA TOTALMENTE (0 mg)',
          targetDose: 'NÃO INICIAR',
          clinicalAction: 'Suspender moclobemida e aguardar 48 horas.',
          symptomsToMonitor: 'Sintomas de descontinuação.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Dia 3 em diante',
          sourceDose: 'SUSPENSA DEFINITIVAMENTE',
          targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
          clinicalAction: `Iniciar ${target.name} na dose de introdução clínica recomendada (${recommendedStartingDoseMg} mg/dia).`,
          symptomsToMonitor: 'Adaptação posológica inicial.',
        }
      );
    } else {
      durationWeeks = 2;
      strategySummary = `Suspender gradualmente ${source.name} e aguardar 1 semana antes de iniciar moclobemida (ou 5 semanas se fluoxetina).`;
      timelineSteps.push(
        {
          stepNumber: 1,
          periodLabel: 'Semana 1',
          sourceDose: 'Desmame e suspensão',
          targetDose: 'NÃO INICIAR',
          clinicalAction: `Descontinuar ${source.name}.`,
          symptomsToMonitor: 'Sintomas de descontinuação.',
        },
        {
          stepNumber: 2,
          periodLabel: 'Semana 2 em diante',
          sourceDose: 'SUSPENSO DEFINITIVAMENTE',
          targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
          clinicalAction: `Introduzir ${target.name} ${recommendedStartingDoseMg} mg/dia.`,
          symptomsToMonitor: 'Tolerabilidade posológica.',
        }
      );
    }
  }
  // -------------------------------------------------------------
  // REGRA B: DE FLUOXETINA PARA OUTRO ISRS / ISRN / ATÍPICO
  // Meia-vida longa da Norfluoxetina fornece autodesmame biológico
  // -------------------------------------------------------------
  else if (source.id === 'fluoxetina') {
    strategyType = 'direct';
    strategyTitle = 'Troca Direta com Janela Curta (Autodesmame pela Norfluoxetina)';
    durationWeeks = 2;
    strategySummary = `A fluoxetina e seu metabólito norfluoxetina possuem meia-vida biológica de até 15 dias. Suspender a fluoxetina e aguardar de 4 a 7 dias (ou iniciar no dia seguinte se a dose for baixa, 20 mg/dia) antes de introduzir ${target.name} na dose de introdução recomendada (${recommendedStartingDoseMg} mg/dia).`;

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: 'SUSPENSA TOTALMENTE (0 mg/dia)',
        targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
        clinicalAction: `Interromper a Fluoxetina. Se dose era de 20 mg/dia, iniciar ${target.name} no dia seguinte. Se dose era ≥40 mg/dia, aguardar 4 a 7 dias sem medicação antes de iniciar ${target.name} na dose de introdução.`,
        symptomsToMonitor: 'Sinais leves de sobreposição serotoninérgica transitória (inquietação, náusea).',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 em diante (Dia 8+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} (titular conforme resposta clínica)`,
        clinicalAction: `Avaliar tolerabilidade. Titular dentro da faixa terapêutica recomendada (${target.referenceTherapeuticRange.min} a ${target.referenceTherapeuticRange.max} ${target.referenceTherapeuticRange.unit}).`,
        symptomsToMonitor: 'Resposta terapêutica e remissão de sintomas.',
      }
    );
  }
  // -------------------------------------------------------------
  // REGRA C: ISRS PARA ISRS EM DOSES BAIXAS OU MODERADAS
  // Mesma classe farmacológica: Troca direta recomendada pelo NHS SPS
  // -------------------------------------------------------------
  else if (
    source.class === 'ISRS' &&
    target.class === 'ISRS' &&
    source.id !== 'paroxetina' &&
    sourceDoseMg <= (source.referenceTherapeuticRange.min * 2)
  ) {
    strategyType = 'direct';
    strategyTitle = 'Troca Direta (Direct Switch)';
    durationWeeks = 2;
    strategySummary = `Ambos são ISRS. Em doses baixas a moderadas (sem paroxetina), as diretrizes do NHS SPS e Maudsley recomendam a troca direta de um dia para o outro, cessando ${source.name} e iniciando ${target.name} no dia seguinte na dose de introdução recomendada (${recommendedStartingDoseMg} mg/dia).`;

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: 'SUSPENSA (Troca Direta)',
        targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia`,
        clinicalAction: `Tomar a última dose de ${source.name} no dia anterior e iniciar ${target.name} ${recommendedStartingDoseMg} mg/dia na manhã seguinte.`,
        symptomsToMonitor: 'Náuseas leves de adaptação ou cefaleia transitória.',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 em diante (Dia 8+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} (titulação clínica)`,
        clinicalAction: `Se houver boa tolerabilidade, titular dentro da faixa terapêutica recomendada (${target.referenceTherapeuticRange.min} a ${target.referenceTherapeuticRange.max} ${target.referenceTherapeuticRange.unit}) conforme avaliação médica.`,
        symptomsToMonitor: 'Eficácia clínica e adesão posológica.',
      }
    );
  }
  // -------------------------------------------------------------
  // REGRA D: ISRS (doses altas ou Paroxetina) OU ISRS PARA ISRN / ATÍPICO / TRICÍCLICO
  // Troca Cruzada Gradual (Cross-Taper) em 2 a 3 Semanas
  // -------------------------------------------------------------
  else if (
    (source.class === 'ISRS' && (target.class === 'ISRN' || target.class === 'Atípico / Modulador' || target.class === 'Tricíclico' || target.class === 'ISRS')) ||
    (source.class === 'ISRN' && (target.class === 'ISRS' || target.class === 'ISRN' || target.class === 'Atípico / Modulador' || target.class === 'Tricíclico')) ||
    (source.class === 'Atípico / Modulador' && (target.class === 'ISRS' || target.class === 'ISRN' || target.class === 'Atípico / Modulador')) ||
    (source.class === 'Tricíclico' && (target.class === 'ISRS' || target.class === 'ISRN' || target.class === 'Tricíclico'))
  ) {
    strategyType = 'cross_taper';
    strategyTitle = 'Troca Cruzada Gradual (Cross-Tapering)';
    durationWeeks = 3;
    strategySummary = `Redução progressiva da dose de ${source.name} enquanto se introduz e titula ${target.name} a partir de sua dose inicial (${recommendedStartingDoseMg} mg/dia). Essa conduta atenua os sintomas de descontinuação e mantém a cobertura terapêutica.`;

    const halfSourceDose = Math.round(sourceDoseMg / 2);

    timelineSteps.push(
      {
        stepNumber: 1,
        periodLabel: 'Semana 1 (Dias 1 - 7)',
        sourceDose: `${source.name} ${halfSourceDose} mg/dia (redução de 50%)`,
        targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia (dose de introdução)`,
        clinicalAction: `Reduzir a dose de ${source.name} pela metade e introduzir ${target.name} em sua dose de introdução clínica recomendada.`,
        symptomsToMonitor: 'Sintomas de descontinuação (tontura, sensação de choque, náuseas) e queixas de adaptação.',
      },
      {
        stepNumber: 2,
        periodLabel: 'Semana 2 (Dias 8 - 14)',
        sourceDose: sourceDoseMg > (source.referenceTherapeuticRange.min * 2)
          ? `${source.name} ${Math.round(halfSourceDose / 2)} mg/dia (quarto da dose)`
          : 'SUSPENSA TOTALMENTE (0 mg)',
        targetDose: `${target.name} ${recommendedStartingDoseMg} mg/dia (manter ou titular)`,
        clinicalAction: `Suspender totalmente (ou reduzir ainda mais) ${source.name}. Manter ${target.name} na dose de introdução ou avançar para a faixa terapêutica conforme tolerabilidade.`,
        symptomsToMonitor: 'Tolerabilidade gastrointestinal, sono e humor.',
      },
      {
        stepNumber: 3,
        periodLabel: 'Semana 3 em diante (Dia 15+)',
        sourceDose: 'SUSPENSA DEFINITIVAMENTE',
        targetDose: `${target.name} (ajuste dentro da faixa terapêutica)`,
        clinicalAction: `Estabilizar ${target.name} dentro da faixa terapêutica de referência (${target.referenceTherapeuticRange.min} a ${target.referenceTherapeuticRange.max} ${target.referenceTherapeuticRange.unit}), orientando o paciente sobre o tempo de resposta terapêutica (4 a 6 semanas).`,
        symptomsToMonitor: 'Resposta clínica e remissão de sintomas depressivos/ansiosos.',
      }
    );
  }
  // -------------------------------------------------------------
  // REGRA E: COMBINAÇÃO SEM PROTOCOLO DETERMINÍSTICO VALIDADO
  // -------------------------------------------------------------
  else {
    hasValidatedProtocol = false;
    strategyType = 'individualized';
    strategyTitle = 'Avaliação Médica Individualizada Necessária';
    durationWeeks = 0;
    unsupportedReason = `A transição específica entre ${source.name} (${source.class}) e ${target.name} (${target.class}) não possui diretriz padronizada consensual no NHS SPS ou Maudsley Prescribing Guidelines (15ª Ed., 2025). Exige avaliação individualizada pelo médico assistente/psiquiatra considerando farmacocinética e perfil clínico.`;
    strategySummary = unsupportedReason;
  }

  // 5. Racional Farmacológico Específico
  pharmacologicalRationale.push(
    `Meia-vida de eliminação: ${source.name} (${source.halfLifeHours}${source.activeMetaboliteHalfLife ? ' | ' + source.activeMetaboliteHalfLife : ''}) vs. ${target.name} (${target.halfLifeHours}${target.activeMetaboliteHalfLife ? ' | ' + target.activeMetaboliteHalfLife : ''}).`,
    `Potencial de Descontinuação de ${source.name}: classificado como ${source.discontinuationRisk}. ${source.discontinuationRisk === 'Muito Alto' || source.discontinuationRisk === 'Alto' ? 'Requer desmame gradual e atenção redobrada a sintomas como tontura e parestesias.' : 'Baixo risco de sintomas intensos de retirada.'}`,
    `Dose de introdução clínica recomendada de ${target.name}: ${recommendedStartingDoseMg} mg/dia. Faixa terapêutica de referência: ${referenceTherapeuticRange.min} a ${referenceTherapeuticRange.max} ${referenceTherapeuticRange.unit}.`
  );

  if (estimatedEquivalence.available) {
    pharmacologicalRationale.push(`Equivalência em ensaios clínicos (Hayasaka 2015): ${estimatedEquivalence.valueText} (referência teórica descritiva, não vinculativa a prescrição direta).`);
  } else {
    pharmacologicalRationale.push('Equivalência primária não estabelecida no estudo de Hayasaka et al. (2015). A prescrição médica orienta-se pela dose de introdução clínica e titulação guiada pela resposta do paciente.');
  }

  // 6. Alertas de CYP450
  const cypAlerts: string[] = [];
  if (source.cypInteractions?.cyp2D6 && source.cypInteractions.cyp2D6.includes('potente')) {
    cypAlerts.push(`${source.name} é inibidor potente de CYP2D6. Ao transicionar para drogas metabolizadas por CYP2D6 (${target.name}), os níveis plasmáticos de ${target.name} podem atingir picos maiores inicialmente.`);
  }
  if (source.cypInteractions?.cyp1A2 && source.cypInteractions.cyp1A2.includes('potente')) {
    cypAlerts.push(`${source.name} é inibidor muito potente de CYP1A2.`);
  }

  // 7. Riscos Clínicos
  let serotoninRiskLevel: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico' = 'Moderado';
  let serotoninNote = 'Risco padrão de sobreposição serotoninérgica durante a transição. Orientar o paciente quanto a tremores finos, sudorese e agitação.';

  if (source.class === 'IMAO' || target.class === 'IMAO') {
    serotoninRiskLevel = 'Crítico';
    serotoninNote = 'PERIGO FATAL: A combinação concomitante de IMAO com fármacos serotoninérgicos pode precipitar Síndrome Serotoninérgica letal e colapso cardiovascular. O respeito à janela de intervalo livre (washout) é inegociável.';
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

  // 8. Orientações para o Paciente
  const patientInstructions: string[] = [
    `Siga rigorosamente o cronograma semanal prescrito. Nunca interrompa o uso de ${source.name} de forma abrupta por conta própria.`,
    'Caso apresente sensações transitórias semelhantes a pequenos choques na cabeça, tonturas leves ou náuseas, relate à equipe: são sintomas de adaptação comuns da redução posológica.',
    'Procure atendimento médico imediato em caso de febre inexplicada, tremores intensos, rigidez muscular, contrações involuntárias ou agitação súbita.',
    'Evite o consumo de bebidas alcoólicas e não inicie medicamentos novos (inclusive fitoterápicos como Hipérico/Erva de São João) sem orientação médica.',
  ];

  // 9. Texto estruturado para SOAP / Prescrição
  const soapStepsText = timelineSteps.length > 0
    ? timelineSteps.map((s) => `• ${s.periodLabel}: [Desmame] ${s.sourceDose} | [Introdução] ${s.targetDose}`).join('\n')
    : '• Transição individualizada sem cronograma algorítmico padronizado. Planejar degraus posológicos com o paciente.';

  const soapPrescriptionText = hasValidatedProtocol
    ? `PLANO DE TRANSIÇÃO E DESMAME DE ANTIDEPRESSIVO (${strategyTitle}):
Medicação Atual (Desmame): ${source.name} ${sourceDoseMg} mg/dia
Nova Medicação (Introdução): ${target.name} (Dose de Introdução: ${recommendedStartingDoseMg} mg/dia | Faixa de Referência: ${referenceTherapeuticRange.min}-${referenceTherapeuticRange.max} ${referenceTherapeuticRange.unit})
${estimatedEquivalence.available ? `Equivalência Teórica (Hayasaka 2015): ${estimatedEquivalence.valueText} (referência de ensaio clínico, não vinculativa a prescrição direta)` : 'Equivalência teórica primária: Não disponível em Hayasaka et al. (2015)'}

CRONOGRAMA SEMANAL:
${soapStepsText}

Orientações: Paciente orientado sobre sintomas transitórios de descontinuação e sinais de alerta. Retorno pactuado em 3 a 4 semanas.`
    : `AVALIAÇÃO DE TRANSIÇÃO DE ANTIDEPRESSIVO:
${source.name} (${sourceDoseMg} mg/dia) -> ${target.name}
Aviso Clínico: Par farmacológico sem diretriz padronizada determinística validada no NHS SPS / Maudsley 15ª ed.
Conduta: Requer planejamento individualizado e acompanhamento especializado.`;

  return {
    sourceDrug: source,
    sourceDoseMg,
    targetDrug: target,
    hasValidatedProtocol,
    unsupportedReason,
    estimatedEquivalence,
    referenceTherapeuticRange,
    recommendedStartingDoseMg,
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
    calculatedEquivalentDoseMg: rawEquivalentDose,
    recommendedTargetDoseMg: recommendedStartingDoseMg,
    evidenceSource: estimatedEquivalence.available
      ? 'Hayasaka et al., 2015 (Meta-análise RCTs) & Maudsley 15ª Ed. (2025)'
      : 'Diretrizes Maudsley (15ª Ed. 2025) & CANMAT (2023)',
  };
}

/**
 * Tabela Resumida de Equivalência de Doses (baseada rigorosamente na meta-análise primária de Hayasaka et al. 2015)
 */
export const EQUIVALENCE_REFERENCE_TABLE = [
  { drug: 'Fluoxetina', class: 'ISRS', dose40Eq: '40,0 mg', isPrimaryHayasaka: true, halfLife: '2-3 dias (Norflx: 7-15 dias)', notes: 'Fármaco de referência primária (Hayasaka 2015)' },
  { drug: 'Sertralina', class: 'ISRS', dose40Eq: '98,5 mg (~100 mg)', isPrimaryHayasaka: true, halfLife: '26h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Escitalopram', class: 'ISRS', dose40Eq: '18,0 mg (~20 mg)', isPrimaryHayasaka: true, halfLife: '30h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Paroxetina', class: 'ISRS', dose40Eq: '34,0 mg', isPrimaryHayasaka: true, halfLife: '21h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Fluvoxamina', class: 'ISRS', dose40Eq: '143,3 mg', isPrimaryHayasaka: true, halfLife: '15-20h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Venlafaxina', class: 'ISRN', dose40Eq: '149,4 mg (~150 mg)', isPrimaryHayasaka: true, halfLife: '5h (ODV: 11h)', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Mirtazapina', class: 'Atípico / NaSSA', dose40Eq: '50,9 mg', isPrimaryHayasaka: true, halfLife: '20-40h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Bupropiona', class: 'Atípico / IRDN', dose40Eq: '348,5 mg (~300-350 mg)', isPrimaryHayasaka: true, halfLife: '14-21h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Amitriptilina', class: 'Tricíclico', dose40Eq: '122,3 mg', isPrimaryHayasaka: true, halfLife: '15-30h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Nortriptilina', class: 'Tricíclico', dose40Eq: '100,9 mg (~100 mg)', isPrimaryHayasaka: true, halfLife: '20-40h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Clomipramina', class: 'Tricíclico', dose40Eq: '116,1 mg', isPrimaryHayasaka: true, halfLife: '20-32h', notes: 'Meta-análise RCTs Hayasaka 2015' },
  { drug: 'Citalopram', class: 'ISRS', dose40Eq: 'Sem equivalência primária no resumo', isPrimaryHayasaka: false, halfLife: '35h', notes: 'Não consta nos coeficientes primários a Fluoxetina 40mg de Hayasaka 2015. Faixa terapêutica: 20-40 mg/dia.' },
  { drug: 'Desvenlafaxina', class: 'ISRN', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '11h', notes: 'Dose de introdução clínica: 50 mg/dia. Faixa de referência: 50-100 mg/dia.' },
  { drug: 'Duloxetina', class: 'ISRN', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '12h', notes: 'Dose de introdução clínica: 30-60 mg/dia. Faixa de referência: 60-120 mg/dia.' },
  { drug: 'Vortioxetina', class: 'Atípico / Multimodal', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '66h', notes: 'Dose de introdução clínica: 10 mg/dia. Faixa de referência: 10-20 mg/dia.' },
  { drug: 'Trazodona', class: 'Atípico / SARI', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '7-13h', notes: 'Dose antidepressiva plena: 150-300 mg/dia.' },
  { drug: 'Tranilcipromina', class: 'IMAO', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '2h (irreversível)', notes: 'Washout obrigatório de 14 dias (ou 5 semanas se após fluoxetina).' },
  { drug: 'Moclobemida', class: 'IMAO', dose40Eq: 'Não avaliada em Hayasaka 2015', isPrimaryHayasaka: false, halfLife: '2-4h (RIMA)', notes: 'Washout de 24 a 48 horas.' },
];
