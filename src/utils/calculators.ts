import { CalculatorResult } from '../types';

/**
 * Calculadora de Função Renal (CKD-EPI 2021 race-free eGFR)
 * Vital para ajuste de Lítio, Pregabalina, Gabapentina e Antidepressivos em idosos.
 */
export function calculateEgfr(
  creatinine: number, // mg/dL
  age: number,
  gender: 'male' | 'female'
): CalculatorResult {
  const isFemale = gender === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const genderMultiplier = isFemale ? 1.012 : 1.0;

  const scrOverKappa = creatinine / kappa;
  const minPart = Math.min(scrOverKappa, 1) ** alpha;
  const maxPart = Math.max(scrOverKappa, 1) ** -1.2;
  const agePart = 0.9938 ** age;

  const egfr = Math.round(142 * minPart * maxPart * agePart * genderMultiplier);

  let interpretation = '';
  if (egfr >= 90) {
    interpretation = 'Função renal normal / G1. Sem necessidade de ajuste de dose por TFG.';
  } else if (egfr >= 60) {
    interpretation = 'Declínio leve da TFG / G2. Monitorar função renal se em uso de Lítio ou Lítio + AINEs.';
  } else if (egfr >= 45) {
    interpretation = 'Declínio moderado (G3a). Atentar para ajuste de dose de Lítio, Pregabalina e Gabapentina.';
  } else if (egfr >= 30) {
    interpretation = 'Declínio moderadamente grave (G3b). Reduzir doses de fármacos de excreção renal e evitar nefrotóxicos.';
  } else if (egfr >= 15) {
    interpretation = 'Declínio grave (G4). Contraindicação formal para Lítio em APS ou necessidade de manejo especialista conjunto.';
  } else {
    interpretation = 'Falência renal (G5). Risco imediato, discussão urgente com Nefrologia/CAPS.';
  }

  const soapText = `Avaliada Função Renal (CKD-EPI 2021): Creatinina ${creatinine} mg/dL, TFG estimada de ${egfr} mL/min/1,73m² (${interpretation.split('.')[0]}).`;

  return {
    id: 'egfr-ckdepi',
    title: 'Função Renal (CKD-EPI 2021)',
    value: egfr,
    unit: 'mL/min/1,73m²',
    interpretation,
    soapText,
    details: { creatinine, age, gender },
  };
}

export interface CardiovascularRiskInput {
  age: number;
  gender: 'male' | 'female';
  sysBp: number;
  isBpTreated: boolean;
  isSmoker: boolean;
  hasDiabetes: boolean;
  calcMode?: 'lipid' | 'bmi' | 'direct';
  // Lipid parameters
  totCholesterol?: number; // mg/dL
  hdlCholesterol?: number; // mg/dL
  // BMI parameters (for APS without immediate lab)
  weightKg?: number;
  heightCm?: number;
  // Direct High / Very High Risk criteria
  hasEstablishedCvd?: boolean; // DAC, IAM prévio, AVC/AIT, DAP, cirurgia/angioplastia -> Muito Alto Risco
  hasAorticAneurysm?: boolean; // Aneurisma de aorta -> Muito Alto Risco
  hasSevereCkd?: boolean; // DRC estágios 3-5 (TFG < 60 mL/min) -> Alto Risco
  hasSevereHypercholesterolemia?: boolean; // LDL >= 190 mg/dL -> Alto Risco
  hasSubclinicalAtherosclerosis?: boolean; // CAC > 100 ou estenose > 50% -> Alto Risco
  hasDiabetesWithRiskFactors?: boolean; // DM com lesão de órgão-alvo ou tempo >= 10 anos -> Alto Risco
  // SBC Risk Aggravators (Reclassificadores de Risco)
  hasFamilyHistoryPrematureCvd?: boolean; // Familiar 1º grau masc < 55 / fem < 65
  hasMetabolicSyndrome?: boolean; // Síndrome Metabólica (IDF / ATP III)
  hasMicroalbuminuria?: boolean; // Microalbuminúria 30-300 mg/g
  hasHighSensitivityCrp?: boolean; // PCR-us > 2 mg/L
  // Mental Health & Psychopharmacology Context
  usesHighRiskAntipsychotic?: boolean; // Olanzapina, Quetiapina, Clozapina, Risperidona
  antipsychoticName?: string;
  hasSevereMentalIllness?: boolean; // Esquizofrenia, Transtorno Bipolar, Depressão Maior Grave Recorrente
}

export interface DetailedCardiovascularResult extends CalculatorResult {
  riskPercentage: number;
  rawPercentageFormatted: string;
  riskCategory: 'low' | 'intermediate' | 'high' | 'very_high';
  riskLabel: string;
  isReclassified: boolean;
  isDirectRisk: boolean;
  directRiskReason?: string;
  ldlTarget: string;
  nonHdlTarget: string;
  bpTarget: string;
  statinRecommendation: string;
  aspirinRecommendation: string;
  lifestyleRecommendation: string;
  psychiatricAlert?: string;
  metabolicMonitoringPlan?: string[];
  evidenceSource: string;
  bmiCalculated?: number;
}

/**
 * Calculadora de Risco Cardiovascular Global (Framingham / SBC 2019/2021)
 * Adaptada com rigor para a Atenção Primária à Saúde (APS) e interface com Saúde Mental
 * Implementa os modelos de D'Agostino et al. (2008 Circulation), critérios de Risco Direto da SBC,
 * fatores reclassificadores de risco e monitoramento metabólico em uso de psicofármacos.
 */
export function calculateCardiovascularRisk(
  inputOrAge: number | CardiovascularRiskInput,
  genderParam?: 'male' | 'female',
  sysBpParam?: number,
  isSmokerParam?: boolean,
  hasDiabetesParam?: boolean,
  totCholesterolParam?: number
): DetailedCardiovascularResult {
  // Normalizar entrada (suporta tanto objeto quanto parâmetros posicionais)
  let input: CardiovascularRiskInput;
  if (typeof inputOrAge === 'object') {
    input = inputOrAge;
  } else {
    input = {
      age: inputOrAge,
      gender: genderParam || 'male',
      sysBp: sysBpParam || 120,
      isBpTreated: false,
      isSmoker: isSmokerParam || false,
      hasDiabetes: hasDiabetesParam || false,
      totCholesterol: totCholesterolParam || 200,
      hdlCholesterol: 45,
      calcMode: 'lipid',
    };
  }

  const {
    age = 50,
    gender = 'male',
    sysBp = 125,
    isBpTreated = false,
    isSmoker = false,
    hasDiabetes = false,
    calcMode = 'lipid',
    totCholesterol = 200,
    hdlCholesterol = 45,
    weightKg = 75,
    heightCm = 170,
    hasEstablishedCvd = false,
    hasAorticAneurysm = false,
    hasSevereCkd = false,
    hasSevereHypercholesterolemia = false,
    hasSubclinicalAtherosclerosis = false,
    hasDiabetesWithRiskFactors = false,
    hasFamilyHistoryPrematureCvd = false,
    hasMetabolicSyndrome = false,
    hasMicroalbuminuria = false,
    hasHighSensitivityCrp = false,
    usesHighRiskAntipsychotic = false,
    antipsychoticName = '',
    hasSevereMentalIllness = false,
  } = input;

  const isFemale = gender === 'female';

  // 1. Checar Critérios de Muito Alto Risco Direto (SBC / Prevenção Cardiovascular)
  const isVeryHighDirectRisk = hasEstablishedCvd || hasAorticAneurysm;
  let directReason = '';
  if (hasEstablishedCvd) {
    directReason = 'Doença Aterosclerótica Cardiovascular clinicamente manifesta (DAC / IAM / AVC / AIT / DAP / Revascularização)';
  } else if (hasAorticAneurysm) {
    directReason = 'Aneurisma de Aorta Abdominal documentado';
  }

  // 2. Checar Critérios de Alto Risco Direto (SBC)
  const isHighDirectRisk =
    !isVeryHighDirectRisk &&
    (hasSevereCkd ||
      hasSevereHypercholesterolemia ||
      hasSubclinicalAtherosclerosis ||
      hasDiabetesWithRiskFactors);

  if (isHighDirectRisk) {
    if (hasSevereHypercholesterolemia) directReason = 'Hipercolesterolemia Grave (LDL-C ≥ 190 mg/dL ou Colesterol Total ≥ 310 mg/dL)';
    else if (hasSevereCkd) directReason = 'Doença Renal Crônica (TFG < 60 mL/min/1,73m² / Estágio 3-5 ou Microalbuminúria persistente)';
    else if (hasSubclinicalAtherosclerosis) directReason = 'Aterosclerose Subclínica documentada (Escore de Cálcio Coronário > 100 ou estenose > 50%)';
    else if (hasDiabetesWithRiskFactors) directReason = 'Diabetes Mellitus com lesão de órgão-alvo ou tempo de evolução ≥ 10 anos / múltiplos fatores de risco';
  }

  // 3. Cálculo Matemático de Framingham Global (D'Agostino et al., 2008 Circulation)
  const clampedAge = Math.min(Math.max(age, 30), 74);
  const clampedSysBp = Math.min(Math.max(sysBp, 90), 200);
  const lnAge = Math.log(clampedAge);
  const lnSysBp = Math.log(clampedSysBp);

  let calculatedPercentage = 5;
  let bmiValue: number | undefined = undefined;

  if (calcMode === 'bmi' || (!totCholesterol && weightKg && heightCm)) {
    // Modelo Baseado em IMC (Sem dosagem laboratorial - D'Agostino 2008 / OMS HEARTS)
    const heightM = (heightCm || 170) / 100;
    bmiValue = Math.round(((weightKg || 75) / (heightM * heightM)) * 10) / 10;
    const lnBmi = Math.log(Math.min(Math.max(bmiValue, 15), 50));

    if (!isFemale) {
      // Homens - Modelo IMC
      const sum =
        lnAge * 3.11296 +
        lnBmi * 0.79277 +
        (isBpTreated ? lnSysBp * 1.92672 : lnSysBp * 1.85508) +
        (isSmoker ? 0.70953 : 0) +
        (hasDiabetes || hasDiabetesWithRiskFactors ? 0.5316 : 0);
      const meanRisk = 23.9388;
      const baseSurvival = 0.88431;
      const risk = 1 - Math.pow(baseSurvival, Math.exp(sum - meanRisk));
      calculatedPercentage = Math.round(risk * 1000) / 10;
    } else {
      // Mulheres - Modelo IMC
      const sum =
        lnAge * 2.72107 +
        lnBmi * 0.51125 +
        (isBpTreated ? lnSysBp * 2.88267 : lnSysBp * 2.81291) +
        (isSmoker ? 0.61868 : 0) +
        (hasDiabetes || hasDiabetesWithRiskFactors ? 0.77763 : 0);
      const meanRisk = 26.0145;
      const baseSurvival = 0.94833;
      const risk = 1 - Math.pow(baseSurvival, Math.exp(sum - meanRisk));
      calculatedPercentage = Math.round(risk * 1000) / 10;
    }
  } else {
    // Modelo Laboratorial Lipídico (Padrão-Ouro D'Agostino 2008)
    const clampedTotChol = Math.min(Math.max(totCholesterol || 200, 100), 400);
    const clampedHdl = Math.min(Math.max(hdlCholesterol || 45, 20), 100);
    const lnTotChol = Math.log(clampedTotChol);
    const lnHdl = Math.log(clampedHdl);

    if (!isFemale) {
      // Homens - Modelo Lipídico
      const sum =
        lnAge * 3.06117 +
        lnTotChol * 1.1237 -
        lnHdl * 0.93263 +
        (isBpTreated ? lnSysBp * 1.99881 : lnSysBp * 1.93303) +
        (isSmoker ? 0.65451 : 0) +
        (hasDiabetes || hasDiabetesWithRiskFactors ? 0.57367 : 0);
      const meanRisk = 23.9802;
      const baseSurvival = 0.88936;
      const risk = 1 - Math.pow(baseSurvival, Math.exp(sum - meanRisk));
      calculatedPercentage = Math.round(risk * 1000) / 10;
    } else {
      // Mulheres - Modelo Lipídico
      const sum =
        lnAge * 2.32888 +
        lnTotChol * 1.20904 -
        lnHdl * 0.70833 +
        (isBpTreated ? lnSysBp * 2.82263 : lnSysBp * 2.76157) +
        (isSmoker ? 0.52873 : 0) +
        (hasDiabetes || hasDiabetesWithRiskFactors ? 0.69154 : 0);
      const meanRisk = 26.1931;
      const baseSurvival = 0.95012;
      const risk = 1 - Math.pow(baseSurvival, Math.exp(sum - meanRisk));
      calculatedPercentage = Math.round(risk * 1000) / 10;
    }
  }

  // Garantir limites sensatos de percentual calculado
  calculatedPercentage = Math.min(Math.max(calculatedPercentage, 0.5), 75.0);

  // 4. Estratificação Inicial de Risco segundo a SBC (2019/2021)
  let riskCategory: 'low' | 'intermediate' | 'high' | 'very_high' = 'low';
  let riskLabel = 'Baixo Risco Cardiovascular (< 5% em 10 anos)';
  let isReclassified = false;

  if (isVeryHighDirectRisk) {
    riskCategory = 'very_high';
    riskLabel = 'MUITO ALTO RISCO CARDIOVASCULAR (Estratificação Direta)';
    calculatedPercentage = Math.max(calculatedPercentage, 25.0);
  } else if (isHighDirectRisk) {
    riskCategory = 'high';
    riskLabel = 'ALTO RISCO CARDIOVASCULAR (Estratificação Direta)';
    calculatedPercentage = Math.max(calculatedPercentage, 20.0);
  } else {
    // Estratificação baseada no Escore de Framingham / ERG SBC
    if (!isFemale) {
      // Homens: Baixo < 5%, Intermediário 5-20%, Alto > 20%
      if (calculatedPercentage >= 20.0) {
        riskCategory = 'high';
        riskLabel = `Alto Risco Cardiovascular (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      } else if (calculatedPercentage >= 5.0) {
        riskCategory = 'intermediate';
        riskLabel = `Risco Cardiovascular Intermediário (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      } else {
        riskCategory = 'low';
        riskLabel = `Baixo Risco Cardiovascular (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      }
    } else {
      // Mulheres: Baixo < 5%, Intermediário 5-10%, Alto > 10%
      if (calculatedPercentage >= 10.0) {
        riskCategory = 'high';
        riskLabel = `Alto Risco Cardiovascular (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      } else if (calculatedPercentage >= 5.0) {
        riskCategory = 'intermediate';
        riskLabel = `Risco Cardiovascular Intermediário (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      } else {
        riskCategory = 'low';
        riskLabel = `Baixo Risco Cardiovascular (${calculatedPercentage.toFixed(1)}% em 10 anos)`;
      }
    }

    // 5. Avaliação dos Fatores Agravantes do Risco (Reclassificadores da SBC)
    // Se o paciente for de Risco Intermediário e apresentar >= 1 fator agravante, é reclassificado para ALTO RISCO
    const hasAggravatingFactor =
      hasFamilyHistoryPrematureCvd ||
      hasMetabolicSyndrome ||
      hasMicroalbuminuria ||
      hasHighSensitivityCrp;

    if (riskCategory === 'intermediate' && hasAggravatingFactor) {
      riskCategory = 'high';
      isReclassified = true;
      riskLabel = `ALTO RISCO (Reclassificado por Fatores Agravantes da SBC)`;
    }
  }

  // 6. Definição de Metas Terapêuticas segundo a SBC (2019/2021) & Diretrizes de HAS (2020)
  let ldlTarget = '< 130 mg/dL';
  let nonHdlTarget = '< 160 mg/dL';
  let bpTarget = '< 140/90 mmHg (ótimo < 130/80 mmHg)';
  let statinRecommendation = 'Modificações do Estilo de Vida (MEV). Considerar estatina se LDL persistir elevado após 3-6 meses.';
  let aspirinRecommendation = 'Não indicado para prevenção primária em baixo risco.';
  let lifestyleRecommendation = 'Dieta cardioprotetora (DASH/Mediterrânea), cessação do tabagismo, 150 min/sem de atividade física aeróbica moderada e controle de peso.';
  let interpretation = '';

  switch (riskCategory) {
    case 'very_high':
      ldlTarget = '< 50 mg/dL (e redução ≥ 50% do valor basal)';
      nonHdlTarget = '< 80 mg/dL';
      bpTarget = '< 130/80 mmHg';
      statinRecommendation = 'Estatina de ALTA POTÊNCIA (Atorvastatina 40-80 mg/dia ou Rosuvastatina 20-40 mg/dia). Associar Ezetimiba 10 mg se LDL fora da meta.';
      aspirinRecommendation = 'AAS 100 mg/dia formalmente indicado (prevenção secundária).';
      interpretation = 'MUITO ALTO RISCO DE EVENTOS CARDIOVASCULARES GRAVES OU MORTE. Meta estrita de LDL < 50 mg/dL e controle pressórico intensivo.';
      break;

    case 'high':
      ldlTarget = '< 70 mg/dL (e redução ≥ 50% do valor basal)';
      nonHdlTarget = '< 100 mg/dL';
      bpTarget = '< 130/80 mmHg';
      statinRecommendation = 'Estatina de ALTA POTÊNCIA (Atorvastatina 40-80 mg ou Rosuvastatina 20-40 mg) ou MODERADA POTÊNCIA (Atorvastatina 20 mg, Rosuvastatina 10 mg, Sinvastatina 40 mg).';
      aspirinRecommendation = 'AAS 100 mg/dia pode ser considerado individualmente se DM com múltiplos fatores ou CAC > 100 com baixo risco de sangramento.';
      interpretation = isReclassified
        ? 'Paciente com risco inicial intermediário RECLASSIFICADO PARA ALTO RISCO pela presença de fatores agravantes (histórico familiar precoce, síndrome metabólica ou marcadores subclínicos).'
        : isHighDirectRisk
        ? `ALTO RISCO POR CRITÉRIO DIRETO: ${directReason}. Exige meta de LDL < 70 mg/dL e terapia farmacológica preventiva imediata.`
        : 'ALTO RISCO DE EVENTOS CORONARIANOS E CEREBROVASCULARES EM 10 ANOS (> 20% M / > 10% F). Indicação formal de estatina e controle de fatores de risco.';
      break;

    case 'intermediate':
      ldlTarget = '< 100 mg/dL';
      nonHdlTarget = '< 130 mg/dL';
      bpTarget = '< 130/80 mmHg';
      statinRecommendation = 'MEV intensiva por 3 a 6 meses. Se LDL permanecer ≥ 100 mg/dL, iniciar Estatina de MODERADA POTÊNCIA (Atorvastatina 10-20 mg, Rosuvastatina 5-10 mg, Sinvastatina 20-40 mg).';
      aspirinRecommendation = 'Geralmente não indicado em prevenção primária no risco intermediário.';
      interpretation = 'Risco cardiovascular intermediário. Pactuar metas de estilo de vida, investigar fatores agravantes ocultos e avaliar introdução de estatina se LDL ≥ 100 mg/dL.';
      break;

    case 'low':
      ldlTarget = '< 130 mg/dL';
      nonHdlTarget = '< 160 mg/dL';
      bpTarget = '< 140/90 mmHg (se bem tolerado, < 130/80 mmHg)';
      statinRecommendation = 'Modificações no Estilo de Vida (MEV) constituem a conduta primordial. Reavaliar em 1 a 2 anos.';
      aspirinRecommendation = 'Contraindicado para prevenção primária em baixo risco.';
      interpretation = 'Padrão cardiovascular de baixo risco (< 5% em 10 anos). Estimular a manutenção de hábitos de vida saudáveis e reavaliação periódica na APS.';
      break;
  }

  // 7. Alertas e Recomendações Específicas de Saúde Mental & Psicofármacos
  let psychiatricAlert: string | undefined = undefined;
  const metabolicMonitoringPlan: string[] = [];

  if (usesHighRiskAntipsychotic || antipsychoticName) {
    const drugLabel = antipsychoticName ? `(${antipsychoticName})` : '(Olanzapina, Quetiapina, Clozapina ou Risperidona)';
    psychiatricAlert = `⚠️ ALERTA METABÓLICO APS: O paciente está em uso ou planejamento de antipsicótico atípico com alto potencial de ganho ponderal e síndrome metabólica ${drugLabel}.`;
    
    metabolicMonitoringPlan.push('Basal (pré-início): Peso, IMC, Circunferência Abdominal, PA, Glicemia de jejum / HbA1c e Perfil Lipídico (CT, HDL, LDL, TG).');
    metabolicMonitoringPlan.push('4 e 8 semanas: Reavaliação de peso e IMC (se ganho > 5% do peso basal, considerar troca precoce por Aripiprazol ou Lurasidona).');
    metabolicMonitoringPlan.push('12 semanas: Repetir Glicemia de jejum, Perfil Lipídico completo e PA.');
    metabolicMonitoringPlan.push('Anual: Manter monitoramento metabólico periódico ou semestral se fatores de risco presentes.');
    metabolicMonitoringPlan.push('Eletrocardiograma (ECG): Avaliar intervalo QTc prévio e pós-titulação se associação de psicofármacos ou histórico cardiovascular.');
  }

  if (hasSevereMentalIllness) {
    const smiAlert = '⚠️ TRANSTORNO MENTAL GRAVE (Esquizofrenia / TAB / TDM Grave): Condição reconhecida como aceleradora de aterosclerose com mortalidade cardiovascular 2 a 3 vezes superior à população geral e subdiagnóstico frequente na APS.';
    psychiatricAlert = psychiatricAlert ? `${psychiatricAlert} | ${smiAlert}` : smiAlert;
  }

  // 8. Formatação do Texto SOAP Estruturado
  const soapRiskStr = `${calculatedPercentage.toFixed(1)}% em 10 anos (${riskLabel})`;
  const modeStr = calcMode === 'bmi' ? `Modo Clínico / IMC (${bmiValue} kg/m²)` : `Perfil Lipídico (CT ${totCholesterol} mg/dL, HDL ${hdlCholesterol} mg/dL)`;
  
  let soapText = `ESTRATIFICAÇÃO DE RISCO CARDIOVASCULAR (SBC / Framingham Global):
- Escore Estimado em 10 Anos: ${soapRiskStr} [${modeStr}]
- Parâmetros: Idade ${age}a, Sexo ${isFemale ? 'F' : 'M'}, PAS ${sysBp} mmHg (${isBpTreated ? 'HAS tratada' : 'HAS não tratada'}), Tabagismo: ${isSmoker ? 'Sim' : 'Não'}, Diabetes: ${hasDiabetes || hasDiabetesWithRiskFactors ? 'Sim' : 'Não'}
- Classificação de Risco: ${riskCategory.toUpperCase()} RISCO ${isReclassified ? '(Reclassificado por Fatores Agravantes)' : ''}
- Metas Terapêuticas (SBC): LDL-C ${ldlTarget} | Não-HDL ${nonHdlTarget} | PA ${bpTarget}
- Conduta Farmacológica: ${statinRecommendation}
- Antiagregação (AAS): ${aspirinRecommendation}
- Plano de Mudança de Estilo de Vida: ${lifestyleRecommendation}`;

  if (psychiatricAlert) {
    soapText += `\n- Monitoramento Metabólico em Saúde Mental: ${psychiatricAlert}`;
  }

  const resultValue = isVeryHighDirectRisk
    ? '> 20.0%'
    : isHighDirectRisk
    ? `${Math.max(calculatedPercentage, 20.0).toFixed(1)}%`
    : `${calculatedPercentage.toFixed(1)}%`;

  return {
    id: 'cv-risk-sbc',
    title: 'Risco Cardiovascular Global (SBC / Framingham)',
    value: resultValue,
    unit: 'em 10 anos',
    interpretation,
    soapText,
    riskPercentage: calculatedPercentage,
    rawPercentageFormatted: `${calculatedPercentage.toFixed(1)}%`,
    riskCategory,
    riskLabel,
    isReclassified,
    isDirectRisk: isVeryHighDirectRisk || isHighDirectRisk,
    directRiskReason: directReason || undefined,
    ldlTarget,
    nonHdlTarget,
    bpTarget,
    statinRecommendation,
    aspirinRecommendation,
    lifestyleRecommendation,
    psychiatricAlert,
    metabolicMonitoringPlan: metabolicMonitoringPlan.length > 0 ? metabolicMonitoringPlan : undefined,
    evidenceSource: "Diretriz Brasileira de Prevenção Cardiovascular da SBC (2019/2021) & Framingham Heart Study (D'Agostino et al., 2008 Circulation)",
    bmiCalculated: bmiValue,
    details: {
      ...input,
      calculatedPercentage,
      riskCategory,
    },
  };
}

/**
 * Tabela e conversão de Dose Equivalente de Antidepressivos
 */
export function calculateAntidepressantEquivalence(
  drug: string,
  doseMg: number
): CalculatorResult {
  // Padrão de equivalência aproximada em relação à Fluoxetina 20mg
  const baseEquivalents: Record<string, number> = {
    Fluoxetina: 20,
    Sertralina: 50,
    Escitalopram: 10,
    Citalopram: 20,
    Paroxetina: 20,
    Venlafaxina: 75,
    Duloxetina: 60,
    Amitriptilina: 50,
  };

  const stdDose = baseEquivalents[drug] || 20;
  const ratio = doseMg / stdDose;

  const fluoxetinaEq = Math.round(ratio * 20);
  const sertralinaEq = Math.round(ratio * 50);
  const escitalopramEq = Math.round(ratio * 10);

  const interpretation = `A dose de ${drug} ${doseMg} mg equivale aproximadamente a Fluoxetina ${fluoxetinaEq} mg/dia, Sertralina ${sertralinaEq} mg/dia ou Escitalopram ${escitalopramEq} mg/dia.`;
  const soapText = `Estimada dose equivalente do antidepressivo: ${drug} ${doseMg} mg/dia (~ Fluoxetina ${fluoxetinaEq} mg/dia / Sertralina ${sertralinaEq} mg/dia).`;

  return {
    id: 'antidepressant-eq',
    title: 'Equivalência de Antidepressivos',
    value: `${fluoxetinaEq} mg Fluoxetina Eq.`,
    interpretation,
    soapText,
  };
}

/**
 * Tabela e conversão de Dose Equivalente de Antipsicóticos (em mg de Clorpromazina)
 */
export function calculateAntipsychoticEquivalence(
  drug: string,
  doseMg: number
): CalculatorResult {
  // Equivalência aproximada para 100mg de Clorpromazina
  const baseEquivalents: Record<string, number> = {
    Clorpromazina: 100,
    Haloperidol: 2,
    Risperidona: 2,
    Quetiapina: 100,
    Olanzapina: 5,
    Aripiprazol: 5,
    Levomepromazina: 100,
  };

  const stdDose = baseEquivalents[drug] || 100;
  const ratio = doseMg / stdDose;

  const clorpromazinaEq = Math.round(ratio * 100);
  const haloperidolEq = (ratio * 2).toFixed(1);
  const risperidonaEq = (ratio * 2).toFixed(1);

  const interpretation = `A dose de ${drug} ${doseMg} mg/dia corresponde a aproximadamente ${clorpromazinaEq} mg/dia de Clorpromazina equivalente (ou ~${haloperidolEq} mg de Haloperidol / ~${risperidonaEq} mg de Risperidona).`;
  const soapText = `Calculada equivalência de antipsicótico: ${drug} ${doseMg} mg/dia (~ Clorpromazina ${clorpromazinaEq} mg/dia equivalente).`;

  return {
    id: 'antipsychotic-eq',
    title: 'Equivalência de Antipsicóticos',
    value: `${clorpromazinaEq} mg Clorpromazina Eq.`,
    interpretation,
    soapText,
  };
}
