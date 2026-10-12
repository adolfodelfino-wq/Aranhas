/**
 * Nexus Clínico — Módulo de Equivalência e Desmame Gradual de Benzodiazepínicos e Drogas Z
 *
 * Base Científica:
 * 1. The ASAM Clinical Practice Guideline on Benzodiazepine Tapering (American Society of Addiction Medicine, 2025).
 *    - Desmame centrado no paciente, com reduções individualizáveis de 5% a 25% a cada 1 a 4 semanas.
 *    - Desaceleração nas doses baixas finais ("the difficult last mile").
 *    - Proibição de forçar a dose para zero sem estabilização e reavaliação clínica individual.
 * 2. Horowitz MA, Taylor DM. The Maudsley Deprescribing Guidelines: Antidepressants, Benzodiazepines,
 *    Gabapentinoids and Z-drugs. Wiley-Blackwell, 2024. DOI: 10.1002/9781394291052.
 * 3. Taylor DM, Barnes TRE, Young AH. The Maudsley Prescribing Guidelines in Psychiatry (15ª Edição, 2025). Wiley.
 * 4. Ashton CH. Benzodiazepines: How They Work and How to Withdraw (The Ashton Manual, 2002).
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

export interface BzdCustomSettings {
  reductionPercentage?: number; // 5% a 25% por degrau
  stepDurationWeeks?: number; // 1 a 4 semanas por degrau
}

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
  isConsolidationPhase: boolean; // Indica a fase final de estabilização na dose mínima e reavaliação clínica
  clinicalNotes: string;
  estimatedGabaReceptorOccupancy?: number; // Mantido como opcional para compatibilidade retroativa
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
  strategy: BzdTaperStrategy;
  pace: BzdTaperPace;
  reductionPercentage: number;
  stepDurationWeeks: number;
  totalEstimatedWeeks: number;
  numberOfSteps: number;
  schedule: BzdScheduleStep[];
  safetyWarnings: string[];
  withdrawalSymptoms: string[];
  nonPharmacologicalAdvice: string[];
  withdrawalVsRelapseDiff: WithdrawalVsRelapseItem[];
  soapPlanText: string;
  patientGuidanceText: string;
  baselineGabaReceptorOccupancy?: number; // Mantido como opcional para compatibilidade
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
      'Diretrizes Maudsley (2024/2025): A formulação líquida disponível no Brasil (1 gota = 0.1 mg) permite o desmame hiperbólico direto sem transição obrigatória para Diazepam.',
      'Alta potência e meia-vida longa. Alto risco de dependência e declínio cognitivo em idosos.',
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
      'Recomenda-se fortemente a transição gradual para Diazepam antes da redução de doses para prevenir flutuações plasmáticas bruscas.',
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
      'Fármaco de escolha do Protocolo de Ashton e diretrizes de desprescrição devido à sua meia-vida prolongada e metabólito desmetildiazepam.',
      'Permite redução suave sem oscilações bruscas nos níveis plasmáticos.',
      'Atenção ao risco de acúmulo em idosos e obesos (alta lipossolubilidade).',
    ],
  },
  lorazepam: {
    id: 'lorazepam',
    name: 'Lorazepam',
    genericName: 'Lorazepam',
    commercialNames: ['Lorax', 'Ansitemp'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 1.0, // 1mg lorazepam = 10mg diazepam
    halfLifeHours: '10-20 horas',
    halfLifeCategory: 'intermediate',
    activeMetabolites: false,
    metabolism: 'Conjugação direta com ácido glicurônico (metabolismo hepático simples)',
    standardDoseRange: '1.0 a 6.0 mg/dia',
    availablePresentations: ['Comprimidos: 1.0 mg e 2.0 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Benzodiazepínico de escolha em hepatopatas graves e idosos, pois não depende de oxidação pelo citocromo P450.',
      'Meia-vida intermediária pode causar ansiedade interdose durante o desmame; transição para diazepam pode ser considerada.',
    ],
  },
  bromazepam: {
    id: 'bromazepam',
    name: 'Bromazepam',
    genericName: 'Bromazepam',
    commercialNames: ['Lexotan', 'Somalium', 'Deptran'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 5.0, // 5 a 6mg bromazepam = 10mg diazepam
    halfLifeHours: '12-20 horas',
    halfLifeCategory: 'intermediate',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática (CYP3A4)',
    standardDoseRange: '3.0 a 18.0 mg/dia',
    availablePresentations: ['Comprimidos: 3.0 mg e 6.0 mg (sulcados)'],
    supportsDrops: false,
    clinicalPearls: [
      'Potência intermediária com meia-vida moderada.',
      'Uso muito prevalente na APS para queixas somáticas e ansiedade.',
    ],
  },
  cloxazolam: {
    id: 'cloxazolam',
    name: 'Cloxazolam',
    genericName: 'Cloxazolam',
    commercialNames: ['Olcadil', 'Elum'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 2.0, // 1 a 2mg = 10mg diazepam
    halfLifeHours: '18-40 horas (pró-fármaco)',
    halfLifeCategory: 'long',
    activeMetabolites: true,
    metabolism: 'Metabolismo hepático com metabólitos ativos de meia-vida longa',
    standardDoseRange: '1.0 a 6.0 mg/dia',
    availablePresentations: ['Comprimidos: 1.0 mg, 2.0 mg e 4.0 mg'],
    supportsDrops: false,
    clinicalPearls: [
      'Pró-fármaco com início de ação relativamente suave e ação prolongada.',
    ],
  },
  chlordiazepoxide: {
    id: 'chlordiazepoxide',
    name: 'Clordiazepóxido',
    genericName: 'Clordiazepóxido',
    commercialNames: ['Limbitrol (associado a amitriptilina)', 'Psicosedin'],
    category: 'benzodiazepine',
    equivalentTo10mgDiazepam: 25.0, // 25mg = 10mg diazepam
    halfLifeHours: '24-48 horas',
    halfLifeCategory: 'long',
    activeMetabolites: true,
    metabolism: 'Oxidação hepática com metabólitos ativos',
    standardDoseRange: '10 a 100 mg/dia',
    availablePresentations: ['Cápsulas: frequentemente associado a antidepressivo tricíclico'],
    supportsDrops: false,
    clinicalPearls: [
      'Histórico primeiro benzodiazepínico sintetizado.',
      'Atenção ao risco de toxicidade cumulativa quando associado em formulações combinadas.',
    ],
  },
  zolpidem: {
    id: 'zolpidem',
    name: 'Zolpidem',
    genericName: 'Hemitartarato de Zolpidem',
    commercialNames: ['Stilnox', 'Patz', 'Noctiden'],
    category: 'z_drug',
    equivalentTo10mgDiazepam: 10.0, // 10mg zolpidem ~ 5 a 10mg diazepam (efeito hipnótico)
    halfLifeHours: '2-3 horas',
    halfLifeCategory: 'ultrashort',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática rápida (CYP3A4, CYP1A2)',
    standardDoseRange: '5 a 10 mg ao deitar',
    availablePresentations: [
      'Comprimidos: 5 mg e 10 mg (sulcados)',
      'Sublingual: 5 mg',
      'Comprimidos CR: 6.25 mg e 12.5 mg',
    ],
    supportsDrops: false,
    clinicalPearls: [
      'Agonista seletivo do subtipo alfa-1 do receptor GABA-A (hipnótico "não-benzodiazepínico").',
      'Alto risco de dependência e comportamentos complexos do sono (sonambulismo, amnésia anterógrada).',
      'Meia-vida ultracurta: desmame direto com redução percentual ou transição curta para diazepam se insônia rebote grave.',
    ],
  },
  eszopiclona: {
    id: 'eszopiclona',
    name: 'Eszopiclona',
    genericName: 'Eszopiclona',
    commercialNames: ['Prysma', 'Eszop'],
    category: 'z_drug',
    equivalentTo10mgDiazepam: 3.0, // 3mg eszopiclona ~ 10mg diazepam
    halfLifeHours: '6 horas',
    halfLifeCategory: 'short',
    activeMetabolites: false,
    metabolism: 'Oxidação hepática (CYP3A4, CYP2E1)',
    standardDoseRange: '1 a 3 mg ao deitar',
    availablePresentations: ['Comprimidos: 1 mg, 2 mg e 3 mg'],
    supportsDrops: false,
    clinicalPearls: [
      'Isômero ativo da zopiclona com afinidade pelos subtipos alfa-1, 2 e 3 de GABA-A.',
      'Menor risco de fissura precoce que o zolpidem, mas risco de tolerância mantido.',
    ],
  },
};

/**
 * Calcula a dose equivalente em Diazepam oral.
 */
export function calculateDiazepamEquivalent(
  sourceDrugId: string,
  doseMg: number
): { equivalentDiazepamMg: number; drug: BzdDrug } {
  const drug = BZD_DATABASE[sourceDrugId] || BZD_DATABASE.clonazepam;
  const ratio = 10.0 / drug.equivalentTo10mgDiazepam;
  const equivalentDiazepamMg = Math.round(doseMg * ratio * 10) / 10;
  return { equivalentDiazepamMg, drug };
}

/**
 * Tabela diferencial de sintomas (Maudsley Deprescribing Guidelines, 2024):
 * Síndrome de Retirada (Abstinência) vs. Recaída do Transtorno de Base (Relapse)
 */
export const MAUDSLEY_WITHDRAWAL_VS_RELAPSE_DIFF: WithdrawalVsRelapseItem[] = [
  {
    feature: 'Tempo de Início',
    withdrawal: 'Rápido: surge em horas a dias (1-3 dias para meia-vida curta; 3-7 dias para meia-vida longa) após o degrau de redução.',
    relapse: 'Insidioso e tardio: surge semanas a meses (4 a 12 semanas) após descontinuação ou estabilização.',
    clinicalImplication: 'Sintomas que surgem logo nos primeiros dias após a redução decorrem quase invariavelmente da retirada biológica e não da recidiva da doença.',
  },
  {
    feature: 'Natureza dos Sintomas Sensoriais',
    withdrawal: 'Sintomas atípicos novos: sensações de choque elétrico ("brain zaps"), disestesias, parestesias, hiperacusia marcante, gosto metálico, fotofobia e fasciculações.',
    relapse: 'Sintomas estritamente familiares: ansiedade psíquica habitual, preocupações rotineiras, insônia pura sem queixas sensoriais atípicas.',
    clinicalImplication: 'A presença de hiperacusia ou disestesias confirma a síndrome de adaptação e retirada de receptores GABA-A.',
  },
  {
    feature: 'Padrão Temporal (Evolução)',
    withdrawal: 'Curso ondulatório ("ondas e janelas" / waves and windows): picos de piora intercalados com intervalos de alívio espontâneo.',
    relapse: 'Curso contínuo ou progressivo, persistindo indefinidamente se não houver abordagem do quadro de base.',
    clinicalImplication: 'Explicar o padrão de "ondas" ao paciente previne o pânico e evita o retorno desnecessário à dose inicial plena.',
  },
  {
    feature: 'Resposta à Reintrodução de Dose',
    withdrawal: 'Alívio rápido em horas ou 1-2 dias após restaurar apenas o último degrau reduzido.',
    relapse: 'Melhora lenta e gradual, levando semanas para restabelecer a resposta terapêutica prévia.',
    clinicalImplication: 'Se houver sofrimento intolerável, a regra clínica orienta restaurar apenas o último degrau (nunca a dose original) para alívio imediato.',
  },
];

/**
 * Motor determinístico de desmame gradual de benzodiazepínicos e drogas Z.
 * Alinhado com a diretriz da ASAM (2025) e Maudsley Deprescribing Guidelines (2024):
 * - Permite percentuais e intervalos individualizáveis (5% a 25% por etapa, 1 a 4 semanas).
 * - Não força a última dose para zero (encerra em etapa de estabilização na dose mínima e reavaliação clínica).
 * - Remove estimativa de ocupação GABA-A não fundamentada.
 */
export function generateBzdTaperPlan(
  sourceDrugId: string,
  currentDoseMg: number,
  strategy: BzdTaperStrategy,
  pace: BzdTaperPace,
  customSettings?: BzdCustomSettings
): BzdTaperPlan {
  const { equivalentDiazepamMg, drug: sourceDrug } = calculateDiazepamEquivalent(
    sourceDrugId,
    currentDoseMg
  );

  // Definição dos parâmetros de desmame conforme ASAM 2025 (individualizável pelo clínico)
  const defaultPaceMap = {
    conservative: { reductionPct: 10, durationWeeks: 3 }, // ASAM: 5-10% a cada 2-4 semanas para idosos ou uso > 1 ano
    standard: { reductionPct: 15, durationWeeks: 2 }, // ASAM: 10-15% a cada 2-3 semanas
    accelerated: { reductionPct: 20, durationWeeks: 1 }, // ASAM: 20-25% a cada 1-2 semanas para uso recente
  };

  const defaultPace = defaultPaceMap[pace] || defaultPaceMap.standard;
  const reductionPercentage = Math.min(25, Math.max(5, customSettings?.reductionPercentage ?? defaultPace.reductionPct));
  const stepDurationWeeks = Math.min(4, Math.max(1, customSettings?.stepDurationWeeks ?? defaultPace.durationWeeks));
  const reductionRatio = reductionPercentage / 100;

  const schedule: BzdScheduleStep[] = [];

  // =========================================================================
  // ESTRATÉGIA 1: DESMAME HIPERBÓLICO DIRETO NO PRÓPRIO FÁRMACO (HOROWITZ & TAYLOR 2024 / ASAM 2025)
  // Reduções proporcionais à dose remanescente (e não quedas fixas em mg).
  // Não força término para zero: estabiliza na menor dose viável com reavaliação clínica.
  // =========================================================================
  if (strategy === 'maudsley_hyperbolic') {
    let remainingDose = currentDoseMg;
    let accumulatedWeeks = 0;
    let stepCount = 0;

    // Define o limite mínimo viável de dose para o fármaco
    const minViableDose = sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop
      ? sourceDrug.dropsMgPerDrop // 0.1 mg (1 gota)
      : Math.max(0.1, Math.round((currentDoseMg * 0.05) * 100) / 100);

    while (remainingDose > minViableDose && stepCount < 10) {
      stepCount++;
      accumulatedWeeks += stepDurationWeeks;
      const startW = accumulatedWeeks - stepDurationWeeks + 1;
      const endW = accumulatedWeeks;

      // Redução proporcional à dose remanescente
      remainingDose = remainingDose * (1 - reductionRatio);

      let stepDose = 0;
      if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
        const drops = Math.max(1, Math.round(remainingDose / sourceDrug.dropsMgPerDrop));
        stepDose = Math.round(drops * sourceDrug.dropsMgPerDrop * 100) / 100;
      } else {
        stepDose = Math.round(remainingDose * 100) / 100;
        if (stepDose < 0.125 && remainingDose > minViableDose) stepDose = 0.125;
      }

      const percentRem = Math.round((stepDose / currentDoseMg) * 100);
      const stepEqDz = Math.round(((stepDose / sourceDrug.equivalentTo10mgDiazepam) * 10) * 10) / 10;

      let instructions = '';
      if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
        const drops = Math.max(1, Math.round(stepDose / sourceDrug.dropsMgPerDrop));
        instructions = `${stepDose} mg/dia (~${drops} ${drops === 1 ? 'gota' : 'gotas'}/dia).`;
      } else {
        instructions = `${stepDose} mg/dia (fracionar comprimidos sulcados ou formulação oral).`;
      }

      schedule.push({
        stepNumber: stepCount,
        durationWeeks: stepDurationWeeks,
        label: `Semanas ${startW}-${endW}`,
        sourceDrugDoseMg: stepDose,
        sourceDrugInstructions: instructions,
        diazepamDoseMg: 0,
        diazepamInstructions: 'Sem transição para Diazepam (desmame hiperbólico direto no próprio fármaco).',
        totalDailyEquivalentDiazepamMg: stepEqDz,
        percentRemaining: percentRem,
        isConsolidationPhase: false,
        clinicalNotes: stepCount === 1
          ? `Início da redução gradual (${reductionPercentage}% por etapa). Redução proporcional inicial geralmente bem tolerada.`
          : `Redução progressiva da dose atual. Se surgirem sintomas moderados de abstinência, aplicar regra de pausa (hold) por 2 a 4 semanas.`,
      });

      if (stepDose <= minViableDose) {
        break;
      }
    }

    // Degrau final: Fase de Estabilização na Dose Mínima e Reavaliação Clínica (ASAM 2025 / Maudsley 2024)
    // Sem forçar zero artificialmente!
    stepCount++;
    accumulatedWeeks += stepDurationWeeks;
    const finalStartW = accumulatedWeeks - stepDurationWeeks + 1;
    const finalEndW = accumulatedWeeks;
    const finalStepDose = sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop
      ? sourceDrug.dropsMgPerDrop
      : Math.min(0.25, Math.round(currentDoseMg * 0.1 * 100) / 100);
    const finalEqDz = Math.round(((finalStepDose / sourceDrug.equivalentTo10mgDiazepam) * 10) * 10) / 10;
    const finalPercent = Math.round((finalStepDose / currentDoseMg) * 100);

    schedule.push({
      stepNumber: stepCount,
      durationWeeks: stepDurationWeeks,
      label: `Semanas ${finalStartW}-${finalEndW} (Consolidação)`,
      sourceDrugDoseMg: finalStepDose,
      sourceDrugInstructions: sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop
        ? `${finalStepDose} mg/dia (1 gota/dia ao deitar). Manter estabilização.`
        : `${finalStepDose} mg/dia (dose mínima fracionada). Manter estabilização.`,
      diazepamDoseMg: 0,
      diazepamInstructions: 'Manter dose mínima.',
      totalDailyEquivalentDiazepamMg: finalEqDz,
      percentRemaining: finalPercent,
      isConsolidationPhase: true,
      clinicalNotes: 'FASE DE CONSOLIDAÇÃO E REAVALIAÇÃO CLÍNICA (ASAM 2025 / Maudsley 2024): Não forçar término abrupto para zero. Estabilizar o paciente na dose mínima tolerável. A interrupção definitiva ou espaçamento em dias alternados deve ser decidida conjuntamente após estabilidade clínica prolongada.',
    });
  }

  // =========================================================================
  // ESTRATÉGIA 2: TRANSIÇÃO PARA DIAZEPAM + DESMAME HIPERBÓLICO (ASHTON / MAUDSLEY)
  // Para fármacos de meia-vida curta (Alprazolam, Zolpidem, Lorazepam) com ansiedade interdose.
  // =========================================================================
  else if (strategy === 'maudsley_ashton_switch') {
    // Etapa 1: Substitui 50% por Diazepam equivalente
    const step1Dz = Math.round((equivalentDiazepamMg * 0.5) * 2) / 2;
    const step1Source = Math.round((currentDoseMg * 0.5) * 100) / 100;
    schedule.push({
      stepNumber: 1,
      durationWeeks: stepDurationWeeks,
      label: `Semanas 1-${stepDurationWeeks} (Transição 1)`,
      sourceDrugDoseMg: step1Source,
      sourceDrugInstructions: `${sourceDrug.name} ${step1Source} mg diurno (reduzir dose noturna).`,
      diazepamDoseMg: step1Dz,
      diazepamInstructions: `Diazepam ${step1Dz} mg ao deitar (substituindo a tomada noturna).`,
      totalDailyEquivalentDiazepamMg: equivalentDiazepamMg,
      percentRemaining: 100,
      isConsolidationPhase: false,
      clinicalNotes: 'Fase de Transição Ashton 1: Introduzir Diazepam ao deitar. Estabilizar níveis séricos basais com meia-vida longa.',
    });

    // Etapa 2: Substitui 100% por Diazepam
    const step2Dz = Math.round(equivalentDiazepamMg * 2) / 2;
    const startW2 = stepDurationWeeks + 1;
    const endW2 = stepDurationWeeks * 2;
    schedule.push({
      stepNumber: 2,
      durationWeeks: stepDurationWeeks,
      label: `Semanas ${startW2}-${endW2} (Transição 2)`,
      sourceDrugDoseMg: 0,
      sourceDrugInstructions: `SUSPENDER ${sourceDrug.name}. Transição completa para Diazepam.`,
      diazepamDoseMg: step2Dz,
      diazepamInstructions: `Diazepam ${step2Dz} mg/dia dividido em tomadas diurnas/noturnas.`,
      totalDailyEquivalentDiazepamMg: equivalentDiazepamMg,
      percentRemaining: 100,
      isConsolidationPhase: false,
      clinicalNotes: 'Fase de Transição 2: Paciente estabilizado exclusivamente em Diazepam (meia-vida de até 100-200h pelo desmetildiazepam).',
    });

    // Etapas graduais de redução do Diazepam
    let remainingDz = step2Dz;
    let accWeeks = endW2;
    let taperStepCount = 2;
    const minDiazepamDose = 1.0; // 1 mg de diazepam

    while (remainingDz > minDiazepamDose && taperStepCount < 10) {
      taperStepCount++;
      accWeeks += stepDurationWeeks;
      const startW = accWeeks - stepDurationWeeks + 1;
      const endW = accWeeks;

      remainingDz = remainingDz * (1 - reductionRatio);

      let stepDzDose = 0;
      if (remainingDz > 5) {
        stepDzDose = Math.round(remainingDz * 2) / 2;
      } else if (remainingDz > 1) {
        stepDzDose = Math.round(remainingDz * 4) / 4;
      } else {
        stepDzDose = Math.round(remainingDz * 10) / 10;
      }

      const percentRem = Math.round((stepDzDose / equivalentDiazepamMg) * 100);

      schedule.push({
        stepNumber: taperStepCount,
        durationWeeks: stepDurationWeeks,
        label: `Semanas ${startW}-${endW}`,
        sourceDrugDoseMg: 0,
        sourceDrugInstructions: 'Mantido suspenso.',
        diazepamDoseMg: stepDzDose,
        diazepamInstructions: `Diazepam ${stepDzDose} mg/dia (usar comprimidos sulcados ou solução oral).`,
        totalDailyEquivalentDiazepamMg: stepDzDose,
        percentRemaining: percentRem,
        isConsolidationPhase: false,
        clinicalNotes: `Redução gradual de Diazepam (${reductionPercentage}% por etapa). Se houver sintomas de abstinência, pausar na dose atual por 2 a 4 semanas.`,
      });

      if (stepDzDose <= minDiazepamDose) {
        break;
      }
    }

    // Degrau final de consolidação em dose mínima de Diazepam (sem forçar zero)
    taperStepCount++;
    accWeeks += stepDurationWeeks;
    const finalStartW = accWeeks - stepDurationWeeks + 1;
    const finalEndW = accWeeks;
    const finalDzDose = 1.0;
    const finalPercent = Math.round((finalDzDose / equivalentDiazepamMg) * 100);

    schedule.push({
      stepNumber: taperStepCount,
      durationWeeks: stepDurationWeeks,
      label: `Semanas ${finalStartW}-${finalEndW} (Consolidação)`,
      sourceDrugDoseMg: 0,
      sourceDrugInstructions: 'Mantido suspenso.',
      diazepamDoseMg: finalDzDose,
      diazepamInstructions: `Diazepam ${finalDzDose} mg/dia ao deitar (estabilização em microdose).`,
      totalDailyEquivalentDiazepamMg: finalDzDose,
      percentRemaining: finalPercent,
      isConsolidationPhase: true,
      clinicalNotes: 'FASE DE CONSOLIDAÇÃO (ASAM 2025): Paciente estabilizado na menor dose diária (1 mg/dia). Avaliar ausência de sintomas de abstinência e suporte psicoterápico antes de planejar a descontinuação completa.',
    });
  }

  // =========================================================================
  // ESTRATÉGIA 3: DESMAME LINEAR CONVENCIONAL
  // =========================================================================
  else {
    const numLinearSteps = Math.max(4, Math.round(100 / reductionPercentage));
    for (let step = 1; step <= numLinearSteps; step++) {
      const isLast = step === numLinearSteps;
      const remainingRatio = Math.max(0.1, 1 - ((step - 1) * reductionRatio));
      const stepDose = Math.round((currentDoseMg * remainingRatio) * 100) / 100;
      const stepEqDz = Math.round((equivalentDiazepamMg * remainingRatio) * 10) / 10;
      const startWeek = (step - 1) * stepDurationWeeks + 1;
      const endWeek = step * stepDurationWeeks;

      let instructions = '';
      if (sourceDrug.supportsDrops && sourceDrug.dropsMgPerDrop) {
        const drops = Math.max(1, Math.round(stepDose / sourceDrug.dropsMgPerDrop));
        instructions = `${stepDose} mg/dia (~${drops} gotas/dia).`;
      } else {
        instructions = `${stepDose} mg/dia (usar comprimidos sulcados fracionados).`;
      }

      schedule.push({
        stepNumber: step,
        durationWeeks: stepDurationWeeks,
        label: isLast ? `Semanas ${startWeek}-${endWeek} (Consolidação)` : `Semanas ${startWeek}-${endWeek}`,
        sourceDrugDoseMg: stepDose,
        sourceDrugInstructions: instructions,
        diazepamDoseMg: 0,
        diazepamInstructions: 'Sem uso de Diazepam.',
        totalDailyEquivalentDiazepamMg: stepEqDz,
        percentRemaining: Math.round(remainingRatio * 100),
        isConsolidationPhase: isLast,
        clinicalNotes: isLast
          ? 'Consolidação na dose mínima linear. Reavaliar clinicamente antes de considerar suspensão total.'
          : 'Redução linear de dose.',
      });
    }
  }

  const totalEstimatedWeeks = schedule.reduce((sum, s) => sum + s.durationWeeks, 0);

  // Alertas de Segurança Clínicos (ASAM 2025, Maudsley 2024/2025 e SBMFC)
  const safetyWarnings: string[] = [
    'REGRA DO DESMAME GUIADO PELO PACIENTE (ASAM 2025 / MAUDSLEY 2024): Em caso de sintomas moderados a severos de abstinência, NÃO avançar para a etapa seguinte. PAUSAR (manter a dose atual) por 2 a 4 semanas até estabilização biológica. Nunca aumentar abruptamente para a dose inicial cheia.',
    'PROIBIDA INTERRUPÇÃO ABRUPTA: A cessação repentina pode desencadear convulsões tônico-clônicas, estado de mal epiléptico, delirium tremens, desrealização e hipertermia grave.',
    'NÃO FORÇAR TÉRMINO PREMATURO PARA ZERO: As diretrizes da ASAM (2025) desaconselham cronogramas rígidos que forçam a última dose para zero sem estabilização e consentimento do paciente.',
    'CONTRAINDICAÇÃO COM OPIOIDES E ÁLCOOL: Risco crítico de depressão respiratória fatal por sinergismo de sedação central.',
    'CRITÉRIOS DE BEERS (AGS 2023) / STOPP: Benzodiazepínicos em idosos aumentam em >50% o risco de quedas, fraturas de fêmur e declínio cognitivo. A desprescrição melhora o estado funcional e reduz acidentes.',
  ];

  if (sourceDrug.category === 'z_drug') {
    safetyWarnings.push(
      'ALERTA DROGA Z (Zolpidem/Eszopiclona): Risco aumentado de comportamentos automáticos e amnésia durante o sono. Em doses elevadas ou uso prolongado, a transição para diazepam ou desmame por microdoses previne insônia de rebote intensa.'
    );
  }

  // Sintomas Frequentes de Abstinência (Psicoeducação para o paciente)
  const withdrawalSymptoms: string[] = [
    'Ansiedade de rebote e inquietação transitória (pico esperado entre o 2º e o 5º dia após cada redução).',
    'Insônia de rebote e sonhos vívidos (tendem a remitir espontaneamente em 1 a 2 semanas com adaptação).',
    'Sintomas sensoriais e disestésicos: hiperacusia (sensibilidade aumentada a ruídos), formigamentos, fotofobia e gosto metálico.',
    'Tensão muscular, cefaleia tensional e tremores finos.',
    'Sintomas gastrointestinais leves.',
  ];

  // Alternativas e Não Farmacológicos (APS / MFC / TCC-I)
  const nonPharmacologicalAdvice: string[] = [
    'Terapia Cognitivo-Comportamental para Insônia (TCC-I) / Controle de Estímulos: Usar a cama apenas para dormir. Se não adormecer em 20 minutos, levantar e realizar atividade monótona na penumbra.',
    'Higiene do Sono Estrita: Manter horário fixo para acordar (inclusive fins de semana), eliminar telas luminosas 1h antes de deitar e preservar quarto escuro.',
    'Manejo de Estimulantes: Suspender café, refrigerantes com cafeína, energéticos e chá preto após as 14h.',
    'Técnicas de Relaxamento Neurovegetativo: Respiração diafragmática 4-7-8 e relaxamento muscular progressivo.',
    'Atividade Física Regular: Caminhada diária de 30 minutos pela manhã ou início da tarde.',
  ];

  // Geração de Registro SOAP Estruturado (Plano - P)
  const soapPlanText = [
    `PLANO DE DESMAME DE BENZODIAZEPÍNICO — DIRETRIZES ASAM (2025) & MAUDSLEY DE DESPRESCRIÇÃO (2024):`,
    `- Fármaco em uso: ${sourceDrug.name} ${currentDoseMg} mg/dia (~${equivalentDiazepamMg} mg Diazepam Eq.).`,
    `- Estratégia: ${
      strategy === 'maudsley_hyperbolic'
        ? 'Desmame Proporcional (redução percentual da dose atual)'
        : strategy === 'maudsley_ashton_switch'
        ? 'Transição para Diazepam seguida de Desmame Gradual'
        : 'Desmame Linear'
    }. Ritmo individualizado: ${reductionPercentage}% por etapa a cada ${stepDurationWeeks} ${stepDurationWeeks === 1 ? 'semana' : 'semanas'} (~${totalEstimatedWeeks} semanas estimadas).`,
    `- Cronograma individualizado pactuado:`,
    ...schedule.map(
      (s) =>
        `  • ${s.label}: ${
          strategy === 'maudsley_ashton_switch'
            ? `${s.diazepamInstructions} (${s.sourceDrugInstructions})`
            : s.sourceDrugInstructions
        } [${s.percentRemaining}% da dose inicial]${s.isConsolidationPhase ? ' (Consolidação na dose mínima)' : ''}`
    ),
    `- Orientações de segurança (ASAM 2025): Desmame guiado pelo paciente. Em caso de sintomas moderados de abstinência, pausar a redução por 2 a 4 semanas sem avançar e sem retornar à dose cheia. Proibida interrupção abrupta ou associação com álcool e opioides.`,
    `- A última etapa estabelece estabilização na menor dose tolerável; a suspensão completa será pactuada individualmente após consolidação clínica.`,
    `- Retorno em UBS pactuado a cada ${stepDurationWeeks} a 4 semanas para acompanhamento clínico compartilhado.`,
  ].join('\n');

  // Geração de Orientação em Linguagem Clara para o Paciente
  const patientGuidanceText = [
    `📋 GUIA DE ORIENTAÇÃO PARA DESMAME SEGURO DE ${sourceDrug.name.toUpperCase()} (DIRETRIZES ASAM 2025 / MAUDSLEY)`,
    `Olá! Preparamos este plano com base nas melhores evidências médicas para apoiar você a reduzir gradualmente sua medicação com segurança, respeito ao seu tempo e conforto.`,
    ``,
    `🧠 COMO FUNCIONA A REDUÇÃO GRADUAL?`,
    `Reduzimos uma pequena porcentagem da sua dose a cada degrau para que o organismo se acostume sem sustos. Na fase final, estabilizamos na menor dose possível antes de decidir a retirada completa!`,
    ``,
    `📅 SEU CRONOGRAMA DE REDUÇÃO:`,
    ...schedule.map(
      (s) =>
        `✔ ${s.label} (${s.durationWeeks} ${s.durationWeeks === 1 ? 'semana' : 'semanas'}):\n   ${
          strategy === 'maudsley_ashton_switch' ? s.diazepamInstructions : s.sourceDrugInstructions
        }`
    ),
    ``,
    `💡 O QUE É ESPERADO SENTIR NOS PRIMEIROS DIAS:`,
    `- Inquietação leve, sono mais superficial ou sensibilidade a barulhos nos primeiros dias após cada mudança são normais e tendem a passar com a acomodação do organismo.`,
    ``,
    `🚨 REGRAS DE OURO:`,
    `1. NUNCA pare o medicamento de repente por conta própria.`,
    `2. NÃO tome bebidas alcoólicas durante o desmame.`,
    `3. SE VOCÊ TIVER DIAS DIFÍCEIS: Você está no controle! Apenas MANTENHA a mesma dose por mais tempo até se sentir estável. Não precisa dar o próximo passo até estar pronto. Nunca volte para a dose alta antiga.`,
  ].join('\n');

  return {
    sourceDrug,
    currentDoseMg,
    equivalentDiazepamMg,
    strategy,
    pace,
    reductionPercentage,
    stepDurationWeeks,
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
