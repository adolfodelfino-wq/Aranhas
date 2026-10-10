/**
 * Módulo de Equivalência e Desmame Gradual de Benzodiazepínicos e Drogas Z
 * Atualizado com base nas Diretrizes Maudsley de Desprescrição (The Maudsley Deprescribing Guidelines - Mark Horowitz & David Taylor, 2024)
 * e The Maudsley Prescribing Guidelines in Psychiatry (15ª Edição, 2025 - David M. Taylor, Thomas R. E. Barnes, Allan H. Young).
 * Integração com o Manual de Ashton e Tratado de Medicina de Família e Comunidade (SBMFC).
 */

export interface BzdDrug {
  id: string;
  name: string;
  genericName: string;
  commercialNames: string[];
  category: 'benzodiazepine' | 'z_drug';
  equivalentTo10mgDiazepam: number; // Dose equivalente a 10mg de Diazepam oral
  halfLifeHours: string;
  halfLifeCategory: 'ultrashort' | 'short' | 'intermediate' | 'long';
  activeMetabolites: boolean;
  metabolism: string;
  standardDoseRange: string;
  availablePresentations: string[];
  supportsDrops: boolean;
  dropsMgPerDrop?: number; // Ex: 1 gota de Clonazepam 2.5mg/mL = 0.1mg
  clinicalPearls: string[];
}

export type BzdTaperStrategy =
  | 'maudsley_hyperbolic'
  | 'maudsley_ashton_switch'
  | 'direct_taper';

export type BzdTaperPace = 'conservative' | 'standard' | 'accelerated';

export interface BzdScheduleStep {
  stepNumber: number;
  durationWeeks: number;
  label: string; // Ex: "Semanas 1-2"
  sourceDrugDoseMg: number;
  sourceDrugInstructions: string;
  diazepamDoseMg: number;
  diazepamInstructions: string;
  totalDailyEquivalentDiazepamMg: number;
  percentRemaining: number;
  estimatedGabaReceptorOccupancy: number; // % estimada de ocupação de receptores GABA-A (modelo de Hill/Michaelis-Menten)
  clinicalNotes: string;
}

export interface WithdrawalVsRelapseItem {
  feature: string;
  withdrawal: string;
  relapse: string;
  clinicalImplication: string;
}

export interface BzdTaperPlan {
  sourceDrug: BzdDrug;
  currentDoseMg: number;
  equivalentDiazepamMg: number;
  baselineGabaReceptorOccupancy: number;
  strategy: BzdTaperStrategy;
  pace: BzdTaperPace;
  totalEstimatedWeeks: number;
  numberOfSteps: number;
  schedule: BzdScheduleStep[];
  safetyWarnings: string[];
  withdrawalSymptoms: string[];
  nonPharmacologicalAdvice: string[];
  withdrawalVsRelapseDiff: WithdrawalVsRelapseItem[];
  soapPlanText: string;
  patientGuidanceText: string;
}

export const BZD_DATABASE: Record<string, BzdDrug> = {
  clonazepam: {
    id: 'clonazepam',
    name: 'Clonazepam',
    genericName: 'Clonazepam',
    commercialNames: ['Rivotril', 'Navotrax', 'Clopam'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 0.5, // 0.5mg clonazepam = 10mg diazepam
    halfLifeHours: '20-50 horas',
    halfLifeCategory: 'long',
    activeMetabolites: false,
    metabolism: 'Nitroredução hepática (CYP3A4)',
    standardDoseRange: '0.5 a 4.0 mg/dia',
    availablePresentations: [
      'Comprimidos: 0.5 mg e 2.0 mg (sulcados)',
      'Gotas: 2.5 mg/mL (1 gota = 0.1 mg / 20 gotas = 2 mg)',
    ],
    supportsDrops: true,
    dropsMgPerDrop: 0.1,
    clinicalPearls: [
      'Diretrizes Maudsley 15ª ed. (2025): A disponibilidade de formulação líquida no Brasil (1 gota = 0.1 mg) é o formato ideal para aplicar o desmame hiperbólico direto sem transição obrigatória para Diazepam.',
      'Alta potência e meia-vida longa. Risco elevado de tolerância em uso crônico > 4 semanas e declínio cognitivo em idosos.',
    ],
  },
  alprazolam: {
    id: 'alprazolam',
    name: 'Alprazolam',
    genericName: 'Alprazolam',
    commercialNames: ['Frontal', 'Apraz', 'Tranquinal'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 0.5, // 0.5mg alprazolam = 10mg diazepam
    halfLifeHours: '6-12 horas',
    halfLifeCategory: 'short',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática (CYP3A4)',
    standardDoseRange: '0.75 a 4.0 mg/dia',
    availablePresentations: [
      'Comprimidos: 0.25 mg, 0.5 mg, 1.0 mg e 2.0 mg (sulcados)',
      'Comprimidos XR: 0.5 mg, 1.0 mg, 2.0 mg',
    ],
    supportsDrops: false,
    clinicalPearls: [
      'Alta potência e meia-vida curta. Apresenta o maior risco de fissura interdose e ansiedade rebote entre tomadas.',
      'Maudsley 15ª ed. (2025): Recomenda fortemente a substituição progressiva por Diazepam (ou Clonazepam) antes do desmame hiperbólico para evitar flutuações plasmáticas bruscas.',
    ],
  },
  diazepam: {
    id: 'diazepam',
    name: 'Diazepam',
    genericName: 'Diazepam',
    commercialNames: ['Valium', 'Dienpax', 'Compaz'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 10.0, // Padrão de referência (10mg = 10mg)
    halfLifeHours: '20-100 horas',
    halfLifeCategory: 'long',
    activeMetabolites: true, // Desmetildiazepam tem meia-vida de até 200h
    metabolism: 'Oxidação e desmetilação hepática (CYP2C19, CYP3A4)',
    standardDoseRange: '5 a 30 mg/dia',
    availablePresentations: [
      'Comprimidos: 5 mg e 10 mg (sulcados, padrão SUS gratuito)',
      'Solução oral/gotas: 2 mg/mL (em serviços especializados)',
    ],
    supportsDrops: false,
    clinicalPearls: [
      'Fármaco de escolha do Protocolo de Ashton e das Diretrizes Maudsley para desmame devido à sua meia-vida prolongada e metabólito ativo desmetildiazepam.',
      'Permite redução suave sem flutuações bruscas de nível sérico.',
      'Atenção ao acúmulo em idosos e obesos (alta lipossolubilidade).',
    ],
  },
  lorazepam: {
    id: 'lorazepam',
    name: 'Lorazepam',
    genericName: 'Lorazepam',
    commercialNames: ['Lorax', 'Ansirax'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 1.0, // 1mg lorazepam = 10mg diazepam
    halfLifeHours: '10-20 horas',
    halfLifeCategory: 'intermediate',
    activeMetabolites: false,
    metabolism: 'Glicuronidação direta (não depende do citocromo CYP450)',
    standardDoseRange: '1 a 6 mg/dia',
    availablePresentations: ['Comprimidos: 1.0 mg e 2.0 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Metabolização por glicuronidação pura: escolha de segurança para idosos frágeis e hepatopatas (Child-Pugh B/C).',
      'Maudsley 15ª ed.: Pode ser desmamado diretamente em microfrações ou transicionado para Diazepam.',
    ],
  },
  bromazepam: {
    id: 'bromazepam',
    name: 'Bromazepam',
    genericName: 'Bromazepam',
    commercialNames: ['Lexotan', 'Somalium', 'Deptran'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 5.5, // ~5 a 6 mg bromazepam = 10mg diazepam
    halfLifeHours: '10-20 horas',
    halfLifeCategory: 'intermediate',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática (CYP1A2, CYP3A4)',
    standardDoseRange: '3 a 18 mg/dia',
    availablePresentations: ['Comprimidos: 3 mg e 6 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Amplamente prescrito na APS brasileira para queixas somáticas e ansiedade leve.',
      'Comprimidos sulcados de 3 mg permitem fracionamento em 1.5 mg, mas a fase hiperbólica final se beneficia de transição para Diazepam.',
    ],
  },
  cloxazolam: {
    id: 'cloxazolam',
    name: 'Cloxazolam',
    genericName: 'Cloxazolam',
    commercialNames: ['Olcadil', 'Elum'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 1.0, // 1mg cloxazolam = 10mg diazepam
    halfLifeHours: '18-30 horas',
    halfLifeCategory: 'intermediate',
    activeMetabolites: true,
    metabolism: 'Oxidação hepática (CYP3A4)',
    standardDoseRange: '1 a 6 mg/dia',
    availablePresentations: ['Comprimidos: 1 mg, 2 mg e 4 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Pró-fármaco com início de ação rápido e metabólitos de meia-vida intermediária a longa.',
    ],
  },
  clordiazepoxido: {
    id: 'clordiazepoxido',
    name: 'Clordiazepóxido',
    genericName: 'Clordiazepóxido',
    commercialNames: ['Psicosedin', 'Limbitrol (associado à Amitriptilina)'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 25.0, // 25mg = 10mg diazepam
    halfLifeHours: '10-30 horas',
    halfLifeCategory: 'long',
    activeMetabolites: true,
    metabolism: 'Oxidação e desmetilação hepática',
    standardDoseRange: '25 a 100 mg/dia',
    availablePresentations: ['Cápsulas: 25 mg'],
    supportsDrops: false,
    clinicalPearls: [
      'Frequentemente consumido na forma de Limbitrol na APS para dores crônicas ou cefaleias.',
      'Meia-vida longa; transição para Diazepam simplifica o desmame de microdoses.',
    ],
  },
  zolpidem: {
    id: 'zolpidem',
    name: 'Zolpidem',
    genericName: 'Hemitartarato de Zolpidem',
    commercialNames: ['Stilnox', 'Patz SL', 'Noctiden', 'Lioram'],
    category: 'z_drug',
    equivalentTo10mgDiazepam: 20.0, // 10mg zolpidem ≈ 5mg diazepam => 20mg zolpidem = 10mg diazepam
    halfLifeHours: '2-3 horas',
    halfLifeCategory: 'ultrashort',
    activeMetabolites: false,
    metabolism: 'Oxidação rápida (CYP3A4)',
    standardDoseRange: '5 a 10 mg ao deitar',
    availablePresentations: [
      'Comprimidos: 5 mg e 10 mg (sulcados)',
      'Sublingual (SL): 5 mg',
      'Liberação Prolongada (CR): 6.25 mg e 12.5 mg',
    ],
    supportsDrops: false,
    clinicalPearls: [
      'Hipnótico Z com ação seletiva na subunidade Alfa-1 do GABA-A.',
      'Maudsley Deprescribing Guidelines (2024): Meia-vida ultracurta predispõe a tolerância acelerada e sonambulismo. Para doses > 10 mg/dia, estabilizar previamente com Diazepam 5-10 mg ao deitar antes de iniciar o desmame hiperbólico.',
    ],
  },
  eszopiclona: {
    id: 'eszopiclona',
    name: 'Eszopiclona',
    genericName: 'Eszopiclona',
    commercialNames: ['Puranox', 'Ezopen'],
    category: 'z_drug',
    equivalentTo10mgDiazepam: 6.0, // 3mg eszopiclona ≈ 5mg diazepam => 6mg = 10mg diazepam
    halfLifeHours: '6 horas',
    halfLifeCategory: 'short',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática (CYP3A4, CYP2E1)',
    standardDoseRange: '1 a 3 mg ao deitar',
    availablePresentations: ['Comprimidos: 1 mg, 2 mg e 3 mg'],
    supportsDrops: false,
    clinicalPearls: [
      'Enantiômero S ativo da zopiclona, com meia-vida um pouco mais prolongada que o zolpidem (6h).',
      'Sabor metálico residual é queixa frequente.',
    ],
  },
  midazolam: {
    id: 'midazolam',
    name: 'Midazolam',
    genericName: 'Maleato de Midazolam',
    commercialNames: ['Dormonid'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 7.5, // 7.5mg midazolam = 10mg diazepam
    halfLifeHours: '1.5-3 horas',
    halfLifeCategory: 'ultrashort',
    activeMetabolites: false,
    metabolism: 'Oxidação rápida (CYP3A4)',
    standardDoseRange: '7.5 a 15 mg ao deitar',
    availablePresentations: ['Comprimidos: 7.5 mg e 15 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Ação ultracurta e alta indução hipnótica. Risco expressivo de amnésia anterógrada e dependência rápida.',
      'Desmame mandatório por transição para Diazepam equivalente para evitar insônia de rebote intratável.',
    ],
  },
};

/**
 * Calcula a dose equivalente de Diazepam a partir da dose do fármaco de origem
 */
export function calculateDiazepamEquivalent(
  drugId: string,
  doseMg: number
): { equivalentDiazepamMg: number; drug: BzdDrug } {
  const drug = BZD_DATABASE[drugId] || BZD_DATABASE.clonazepam;
  const equivalent = (doseMg / drug.equivalentTo10mgDiazepam) * 10;
  const rounded = Math.round(equivalent * 10) / 10;
  return { equivalentDiazepamMg: rounded, drug };
}

/**
 * Calcula a ocupação estimada de receptores GABA-A segundo a curva hiperbólica de Michaelis-Menten / Hill
 * Baseada nos estudos de neuroimagem (PET) citados nas Diretrizes Maudsley de Desprescrição (Horowitz & Taylor, 2024 / 2025).
 * ED50 estimada para Diazepam oral ~4.5 mg.
 */
export function calculateGabaOccupancyPercent(diazepamEqMg: number): number {
  if (diazepamEqMg <= 0) return 0;
  const ed50 = 4.5;
  const occupancy = (diazepamEqMg / (diazepamEqMg + ed50)) * 100;
  return Math.min(100, Math.round(occupancy * 10) / 10);
}

/**
 * Tabela diferencial de sintomas segundo as Diretrizes Maudsley 15ª ed. (2025):
 * Síndrome de Retirada (Abstinência) vs. Recaída do Transtorno de Base (Relapse)
 */
export const MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF: WithdrawalVsRelapseItem[] = [
  {
    feature: 'Tempo de Início',
    withdrawal: 'Rápido: surge em horas a dias (1-3 dias p/ meia-vida curta; 3-7 dias p/ meia-vida longa) após a redução.',
    relapse: 'Insidioso e tardio: surge semanas a meses (4 a 12 semanas) após descontinuação completa ou estabilização.',
    clinicalImplication: 'Sintomas que surgem logo nos primeiros dias após o degrau são quase invariavelmente de RETIRADA, não recidiva da doença.',
  },
  {
    feature: 'Natureza dos Sintomas Sensoriais',
    withdrawal: 'Sintomas atípicos novos: choques elétricos ("brain zaps"), disestesias, parestesias, hiperacusia intensa, gosto metálico, fotofobia, zumbido e fasciculações.',
    relapse: 'Sintomas estritamente familiares: ansiedade psíquica habitual, preocupações rotineiras, insônia pura sem sintomas sensoriais.',
    clinicalImplication: 'A presença de hiperacusia ou disestesias confirma biologicamente a síndrome de retirada de receptores GABA-A.',
  },
  {
    feature: 'Padrão Temporal (Evolução)',
    withdrawal: 'Curso ondulatório ("ondas e janelas" / waves and windows): picos de piora intercalados com momentos de melhora, atenuando com as semanas.',
    relapse: 'Curso estável ou progressivamente pior, persistindo indefinidamente se não houver nova intervenção psicoterapêutica ou farmacológica.',
    clinicalImplication: 'Explicar o padrão de "ondas" ao paciente evita pânico e previne reinício desnecessário da dose cheia.',
  },
  {
    feature: 'Resposta à Reintrodução de Dose',
    withdrawal: 'Alívio rápido e expressivo em horas ou 1-2 dias após restaurar uma pequena fração da dose anterior.',
    relapse: 'Melhora lenta e gradual, levando semanas para restabelecer a resposta terapêutica prévia.',
    clinicalImplication: 'Se houver sofrimento intolerável, a regra Maudsley orienta restaurar apenas o último degrau (nunca a dose original) para alívio imediato.',
  },
];

/**
 * Motor determinístico que calcula o plano estruturado de desmame
 * Suporta o Desmame Hiperbólico Maudsley (15ª ed., 2025), Transição Ashton com Desmame Hiperbólico e Desmame Linear Tradicional.
 */
export function generateBzdTaperPlan(
  sourceDrugId: string,
  currentDoseMg: number,
  strategy: BzdTaperStrategy,
  pace: BzdTaperPace
): BzdTaperPlan {
  const { equivalentDiazepamMg, drug: sourceDrug } = calculateDiazepamEquivalent(
    sourceDrugId,
    currentDoseMg
  );

  const baselineGabaReceptorOccupancy = calculateGabaOccupancyPercent(equivalentDiazepamMg);

  // Configuração do ritmo de desmame (intervalo de semanas por degrau)
  const paceConfig = {
    conservative: { stepDurationWeeks: 3, numSteps: 8, reductionRatio: 0.15 },
    standard: { stepDurationWeeks: 2, numSteps: 6, reductionRatio: 0.2 },
    accelerated: { stepDurationWeeks: 1, numSteps: 4, reductionRatio: 0.3 },
  }[pace];

  const schedule: BzdScheduleStep[] = [];

  if (strategy === 'maudsley_hyperbolic') {
    // =========================================================================
    // 1. DESMAME HIPERBÓLICO MAUDSLEY (15ª ED., 2025 / HOROWITZ & TAYLOR)
    // Reduções de dose proporcionais à dose remanescente (e à curva de Hill dos receptores GABA-A).
    // Cada degrau reduz uma fração da dose corrente, gerando microdoses progressivamente menores
    // para evitar o abismo de desocupação de receptores na fase final.
    // =========================================================================
    let remainingDose = currentDoseMg;
    let accumulatedWeeks = 0;
    const targetSteps = paceConfig.numSteps;
    const reductionPerStep = paceConfig.reductionRatio;

    for (let step = 1; step <= targetSteps; step++) {
      accumulatedWeeks += paceConfig.stepDurationWeeks;
      const startW = accumulatedWeeks - paceConfig.stepDurationWeeks + 1;
      const endW = accumulatedWeeks;

      if (step === targetSteps) {
        remainingDose = 0;
      } else {
        remainingDose = remainingDose * (1 - reductionPerStep);
      }

      // Arredonda dose do fármaco conforme características farmacêuticas
      let stepDose = 0;
      if (remainingDose > 0) {
        if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
          // Arredonda para a gota mais próxima (0.1 mg)
          const drops = Math.max(1, Math.round(remainingDose / sourceDrug.dropsMgPerDrop));
          stepDose = Math.round(drops * sourceDrug.dropsMgPerDrop * 100) / 100;
        } else {
          // Arredonda para 2 casas decimais (ex: 0.25mg, 0.12mg)
          stepDose = Math.round(remainingDose * 100) / 100;
          if (stepDose < 0.05 && step < targetSteps) stepDose = 0.05;
        }
      }

      const percentRem = Math.round((stepDose / currentDoseMg) * 100);
      const stepEqDz = Math.round(((stepDose / sourceDrug.equivalentTo10mgDiazepam) * 10) * 10) / 10;
      const stepGabaOccupancy = calculateGabaOccupancyPercent(stepEqDz);

      let instructions = '';
      if (stepDose === 0) {
        instructions = 'SUSPENSÃO COMPLETA. Receptores GABA-A adaptados. Monitorar com suporte não-farmacológico.';
      } else if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
        const drops = Math.max(1, Math.round(stepDose / sourceDrug.dropsMgPerDrop));
        instructions = `${stepDose} mg/dia (~${drops} ${drops === 1 ? 'gota' : 'gotas'}/dia).`;
      } else {
        instructions = `${stepDose} mg/dia (usar frações de comprimidos sulcados ou diluição oral).`;
      }

      schedule.push({
        stepNumber: step,
        durationWeeks: paceConfig.stepDurationWeeks,
        label: `Semanas ${startW}-${endW}`,
        sourceDrugDoseMg: stepDose,
        sourceDrugInstructions: instructions,
        diazepamDoseMg: 0,
        diazepamInstructions: 'Sem uso de Diazepam (desmame hiperbólico direto no próprio fármaco).',
        totalDailyEquivalentDiazepamMg: stepEqDz,
        percentRemaining: percentRem,
        estimatedGabaReceptorOccupancy: stepGabaOccupancy,
        clinicalNotes:
          step === 1
            ? 'Início do desmame hiperbólico Maudsley (2025). Redução proporcional inicial bem tolerada.'
            : step === targetSteps
            ? 'Cessação definitiva. Microdegraus hiperbólicos prévios protegeram contra choque de receptores.'
            : percentRem <= 25
            ? 'Fase hiperbólica crítica ("the difficult last mile"): microdoses mantêm declínio suave da ocupação GABA-A.'
            : 'Redução hiperbólica progressiva. Se houver abstinência, aplicar regra de pausa (hold) por 2 semanas.',
      });
    }
  } else if (strategy === 'maudsley_ashton_switch') {
    // =========================================================================
    // 2. TRANSIÇÃO PARA DIAZEPAM + DESMAME HIPERBÓLICO MAUDSLEY
    // Para fármacos de meia-vida curta (Alprazolam, Zolpidem, Lorazepam) que provocam fissura interdose.
    // Transição inicial para Diazepam, seguida de redução hiperbólica até microdoses (ex: 0.5 mg).
    // =========================================================================
    const switchSteps = 2;
    const taperSteps = paceConfig.numSteps - switchSteps;

    // Etapa 1: Substitui 50% pelo Diazepam equivalente (ao deitar)
    const step1Dz = Math.round((equivalentDiazepamMg * 0.5) * 2) / 2;
    const step1Source = Math.round((currentDoseMg * 0.5) * 100) / 100;
    schedule.push({
      stepNumber: 1,
      durationWeeks: paceConfig.stepDurationWeeks,
      label: `Semanas 1-${paceConfig.stepDurationWeeks}`,
      sourceDrugDoseMg: step1Source,
      sourceDrugInstructions: `${sourceDrug.name} ${step1Source} mg diurno (reduzir dose noturna).`,
      diazepamDoseMg: step1Dz,
      diazepamInstructions: `Diazepam ${step1Dz} mg ao deitar (substituindo a dose noturna).`,
      totalDailyEquivalentDiazepamMg: equivalentDiazepamMg,
      percentRemaining: 100,
      estimatedGabaReceptorOccupancy: baselineGabaReceptorOccupancy,
      clinicalNotes:
        'Fase de Transição Maudsley/Ashton 1: Introduzir Diazepam ao deitar. Estabilizar níveis séricos basais.',
    });

    // Etapa 2: Substitui 100% da dose por Diazepam
    const step2Dz = Math.round(equivalentDiazepamMg * 2) / 2;
    const startW2 = paceConfig.stepDurationWeeks + 1;
    const endW2 = paceConfig.stepDurationWeeks * 2;
    schedule.push({
      stepNumber: 2,
      durationWeeks: paceConfig.stepDurationWeeks,
      label: `Semanas ${startW2}-${endW2}`,
      sourceDrugDoseMg: 0,
      sourceDrugInstructions: `SUSPENDER ${sourceDrug.name}. Transição completa para Diazepam.`,
      diazepamDoseMg: step2Dz,
      diazepamInstructions: `Diazepam ${step2Dz} mg/dia dividido em 2 a 3 tomadas.`,
      totalDailyEquivalentDiazepamMg: equivalentDiazepamMg,
      percentRemaining: 100,
      estimatedGabaReceptorOccupancy: baselineGabaReceptorOccupancy,
      clinicalNotes:
        'Fase de Transição 2: Paciente estabilizado exclusivamente em Diazepam de meia-vida prolongada (até 200h).',
    });

    // Etapas hiperbólicas de redução do Diazepam
    let remainingDz = step2Dz;
    let accWeeks = endW2;
    const reductionRatioDz = Math.max(0.18, 1 / taperSteps);

    for (let i = 1; i <= taperSteps; i++) {
      const stepIdx = switchSteps + i;
      accWeeks += paceConfig.stepDurationWeeks;
      const startW = accWeeks - paceConfig.stepDurationWeeks + 1;
      const endW = accWeeks;

      if (i === taperSteps) {
        remainingDz = 0;
      } else {
        remainingDz = remainingDz * (1 - reductionRatioDz);
      }

      let stepDzDose = 0;
      if (remainingDz > 0) {
        // Degraus arredondados para facilitar fracionamento de 5mg/2.5mg ou líquido (0.5mg)
        if (remainingDz > 5) {
          stepDzDose = Math.round(remainingDz * 2) / 2;
        } else if (remainingDz > 1) {
          stepDzDose = Math.round(remainingDz * 4) / 4; // frações de 0.25mg
        } else {
          stepDzDose = Math.round(remainingDz * 10) / 10;
        }
      }

      const percentRem = Math.round((stepDzDose / equivalentDiazepamMg) * 100);
      const stepGabaOccupancy = calculateGabaOccupancyPercent(stepDzDose);

      let instructions = '';
      if (stepDzDose === 0) {
        instructions = 'SUSPENSÃO COMPLETA DO DIAZEPAM. Desmame concluído com sucesso.';
      } else {
        instructions = `Diazepam ${stepDzDose} mg/dia (fracionar comprimidos de 5mg ou usar solução oral 2mg/mL).`;
      }

      schedule.push({
        stepNumber: stepIdx,
        durationWeeks: paceConfig.stepDurationWeeks,
        label: `Semanas ${startW}-${endW}`,
        sourceDrugDoseMg: 0,
        sourceDrugInstructions: 'Mantido suspenso.',
        diazepamDoseMg: stepDzDose,
        diazepamInstructions: instructions,
        totalDailyEquivalentDiazepamMg: stepDzDose,
        percentRemaining: percentRem,
        estimatedGabaReceptorOccupancy: stepGabaOccupancy,
        clinicalNotes:
          stepDzDose === 0
            ? 'Conclusão Maudsley. Desocupação suave e finalizada sem sintomas de rebote.'
            : stepDzDose <= 2.5
            ? 'Microdegraus finais (Maudsley 15ª ed.): proteção essencial contra a queda abrupta da ocupação de receptores.'
            : 'Desmame hiperbólico regular de Diazepam. Manter acompanhamento quinzenal.',
      });
    }
  } else {
    // =========================================================================
    // 3. DESMAME LINEAR TRADICIONAL (ASHTON 2002 / CONVENCIONAL)
    // Redução em degraus fixos em mg (mantido para fins comparativos)
    // =========================================================================
    const totalSteps = paceConfig.numSteps;
    for (let step = 1; step <= totalSteps; step++) {
      const remainingRatio = Math.max(0, 1 - (step / totalSteps));
      const stepDose = Math.round((currentDoseMg * remainingRatio) * 100) / 100;
      const stepEqDz = Math.round((equivalentDiazepamMg * remainingRatio) * 10) / 10;
      const startWeek = (step - 1) * paceConfig.stepDurationWeeks + 1;
      const endWeek = step * paceConfig.stepDurationWeeks;
      const stepGabaOccupancy = calculateGabaOccupancyPercent(stepEqDz);

      let instructions = '';
      if (stepDose === 0) {
        instructions = 'SUSPENSÃO COMPLETA. Manter suporte não-farmacológico e monitorar sintomas residuais.';
      } else if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
        const drops = Math.round(stepDose / sourceDrug.dropsMgPerDrop);
        instructions = `${stepDose} mg/dia (~${drops} gotas/dia divididas conforme horário habitual).`;
      } else {
        instructions = `${stepDose} mg/dia (usar comprimidos sulcados fracionados).`;
      }

      schedule.push({
        stepNumber: step,
        durationWeeks: paceConfig.stepDurationWeeks,
        label: `Semanas ${startWeek}-${endWeek}`,
        sourceDrugDoseMg: stepDose,
        sourceDrugInstructions: instructions,
        diazepamDoseMg: 0,
        diazepamInstructions: 'Sem uso de Diazepam (estratégia direta).',
        totalDailyEquivalentDiazepamMg: stepEqDz,
        percentRemaining: Math.round(remainingRatio * 100),
        estimatedGabaReceptorOccupancy: stepGabaOccupancy,
        clinicalNotes:
          step === 1
            ? 'Início do desmame linear.'
            : step === totalSteps
            ? 'Fase final de retirada linear. Atenção redobrada para sintomas de abstinência no último salto.'
            : 'Redução linear de dose.',
      });
    }
  }

  const totalEstimatedWeeks = schedule.reduce((sum, s) => sum + s.durationWeeks, 0);

  // Alertas de Segurança Clínicos (Diretrizes Maudsley 15ª ed., Beers 2023 e SBMFC)
  const safetyWarnings: string[] = [
    'REGRA MAUDSLEY DO DESMAME GUIADO PELO PACIENTE (PATIENT-LED TAPERING): Se o paciente apresentar sintomas de abstinência moderados a graves, NÃO avançar para o próximo degrau. PAUSAR (manter a dose atual) por 2 a 4 semanas até estabilização biológica. Nunca aumentar de volta para a dose inicial cheia.',
    'PROIBIDA INTERRUPÇÃO ABRUPTA: A cessação repentina pode desencadear convulsões tônico-clônicas, estado de mal epiléptico, delirium tremens, desrealização psicótica e hipertermia grave.',
    'CURVA HIPERBÓLICA DE RECEPTORES: Os últimos miligramas ("the difficult last mile") causam a maior perda proporcional de ocupação de receptores GABA-A. É por isso que desmames lineares falham no final; o método hiperbólico previne essa queda brusca.',
    'CONTRAINDICAÇÃO COM OPIOIDES E ÁLCOOL: Risco crítico de depressão respiratória fatal por sinergismo de sedação central.',
    'CRITÉRIOS DE BEERS (AGS 2023) / STOPP: Benzodiazepínicos em idosos aumentam em >50% o risco de quedas, fraturas graves de fêmur e declínio cognitivo pseudo-demencial. A redução hiperbólica melhora o estado funcional já nas primeiras 4 semanas.',
  ];

  if (sourceDrug.category === 'z_drug') {
    safetyWarnings.push(
      'ALERTA DROGA Z (Zolpidem/Eszopiclona): Risco aumentado de comportamentos automáticos e amnésia durante o sono (sonambulismo, cozinhar, dirigir, compras involuntárias). Em doses > 10 mg/dia, a estabilização com Diazepam antes do desmame hiperbólico é recomendada pelas Diretrizes Maudsley (2024).'
    );
  }

  // Sintomas Frequentes de Abstinência (Psicoeducação para o paciente)
  const withdrawalSymptoms: string[] = [
    'Ansiedade rebote e agitação transitória (pico esperado entre o 2º e o 5º dia após cada redução).',
    'Insônia de rebote e sonhos vívidos (remitem espontaneamente em 1 a 2 semanas com adaptação sináptica).',
    'Sintomas sensoriais/disestésicos transitórios: hiperacusia (sensibilidade a ruídos), formigamentos, fotofobia e gosto metálico.',
    'Tensão muscular, cefaleia tensional, fasciculações e tremores finos.',
    'Sintomas gastrointestinais: desconforto epigástrico leve ou perda transitória do apetite.',
  ];

  // Alternativas e Não Farmacológicos (APS / MFC / TCC-I)
  const nonPharmacologicalAdvice: string[] = [
    'Terapia Cognitivo-Comportamental para Insônia (TCC-I) / Controle de Estímulos: Usar a cama apenas para dormir. Se não adormecer em 20 minutos, levantar e realizar atividade monótona na penumbra.',
    'Higiene do Sono Estrita: Manter horário fixo para acordar (incluindo fins de semana), eliminar telas luminosas 1h antes de deitar e preservar quarto escuro.',
    'Manejo de Cafeína e Estimulantes: Suspender café, refrigerantes à base de cola, energéticos e chá preto após as 14h.',
    'Técnicas de Relaxamento Neurovegetativo: Respiração diafragmática 4-7-8, relaxamento muscular progressivo e mindfulness breve.',
    'Atividade Física Aeróbica: Caminhada de 30 minutos pela manhã ou início da tarde para otimizar o tônus adenosinérgico endógeno.',
  ];

  // Geração de Registro SOAP Estruturado (Plano - P)
  const soapPlanText = [
    `PLANO DE DESMAME DE BENZODIAZEPÍNICO — DIRETRIZES MAUDSLEY DE DESPRESCRIÇÃO (15ª ED., 2025):`,
    `- Fármaco em uso: ${sourceDrug.name} ${currentDoseMg} mg/dia (~${equivalentDiazepamMg} mg Diazepam Eq.). Ocupação basal estimada de receptores GABA-A: ~${baselineGabaReceptorOccupancy}%.`,
    `- Estratégia adotada: ${
      strategy === 'maudsley_hyperbolic'
        ? 'Desmame Hiperbólico Maudsley (redução proporcional à dose remanescente)'
        : strategy === 'maudsley_ashton_switch'
        ? 'Transição para Diazepam seguida de Desmame Hiperbólico Maudsley'
        : 'Desmame Linear Convencional'
    }. Ritmo: ${pace === 'conservative' ? 'Conservador' : pace === 'standard' ? 'Padrão' : 'Acelerado'} (~${totalEstimatedWeeks} semanas estimadas).`,
    `- Cronograma pactuado com o paciente:`,
    ...schedule.map(
      (s) =>
        `  • ${s.label}: ${
          strategy === 'maudsley_ashton_switch'
            ? `${s.diazepamInstructions} (${s.sourceDrugInstructions})`
            : s.sourceDrugInstructions
        } [Ocupação GABA-A: ~${s.estimatedGabaReceptorOccupancy}%]`
    ),
    `- Orientações de segurança & Manejo Maudsley: Orientado sobre a Regra do Desmame Guiado pelo Paciente (em caso de sintomas de abstinência moderados, manter o degrau por +2 a 4 semanas sem avançar e sem regredir à dose cheia). Proibida interrupção abrupta ou associação com álcool e opioides.`,
    `- Prescrito fracionamento/formulação e pactuado retorno em UBS a cada 2 a 4 semanas para revisão do plano.`,
  ].join('\n');

  // Geração de Orientação em Linguagem Clara para o Paciente
  const patientGuidanceText = [
    `📋 GUIA DE ORIENTAÇÃO PARA DESMAME SEGURO DE ${sourceDrug.name.toUpperCase()} (DIRETRIZES MAUDSLEY 2025)`,
    `Olá! Preparamos este plano baseado nas diretrizes médicas mais recentes para ajudar você a reduzir gradualmente sua medicação com total segurança, respeito ao seu ritmo e sem sofrimento.`,
    ``,
    `🧠 POR QUE REDUZIMOS EM PASSOS CADA VEZ MENORES?`,
    `O cérebro precisa de tempo para religar suas próprias defesas naturais. Em vez de cortar pedaços grandes no final, fazemos degraus suaves para você não sentir mal-estar!`,
    ``,
    `📅 SEU CRONOGRAMA DE REDUÇÃO:`,
    ...schedule.map(
      (s) =>
        `✔ ${s.label} (${s.durationWeeks} semanas):\n   ${
          strategy === 'maudsley_ashton_switch' ? s.diazepamInstructions : s.sourceDrugInstructions
        }`
    ),
    ``,
    `💡 O QUE É NORMAL SENTIR NOS PRIMEIROS DIAS:`,
    `- Um pouco de inquietação, sono leve ou sensibilidade a barulhos altos nos primeiros 2 a 5 dias após cada mudança. Isso é normal e passageiro: é seu corpo se readaptando!`,
    ``,
    `🚨 AS REGRAS DE OURO (MÉTODO GUIADO POR VOCÊ):`,
    `1. NUNCA pare o remédio de uma vez só!`,
    `2. NÃO beba bebidas alcoólicas enquanto estiver no processo de desmame.`,
    `3. SE VOCÊ TIVER UMA SEMANA DIFÍCIL: Você está no comando! Não precisa dar o próximo passo: apenas MANTENHA a mesma dose da semana atual por mais 1 ou 2 semanas até se sentir bem novamente. Nunca tome a dose antiga inteira.`,
  ].join('\n');

  return {
    sourceDrug,
    currentDoseMg,
    equivalentDiazepamMg,
    baselineGabaReceptorOccupancy,
    strategy,
    pace,
    totalEstimatedWeeks,
    numberOfSteps: schedule.length,
    schedule,
    safetyWarnings,
    withdrawalSymptoms,
    nonPharmacologicalAdvice,
    withdrawalVsRelapseDiff: MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF,
    soapPlanText,
    patientGuidanceText,
  };
}
