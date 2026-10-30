import { z } from 'zod';

/**
 * Métodos de estimativa de dose equivalente em Clorpromazina (CPZE)
 */
export type CpzeMethod =
  | 'leucht_2015_classic_mean' // Leucht et al. (2015) - Classical mean dose method (Método principal de dose média)
  | 'leucht_2014_min_effective' // Leucht et al. (2014) - Minimum effective dose method (Método comparativo independente)
  | 'leucht_2016_ddd' // Leucht et al. (2016) - Defined Daily Dose method (Informação complementar de utilização)
  | 'gardner_2010_consensus'; // Gardner et al. (2010) - International consensus (Consenso internacional comparativo)

export interface CpzeMethodData {
  method: CpzeMethod;
  methodName: string;
  sourceStudyId: string;
  referenceCitation: string;
  doi?: string;
  sourceTableOrSection: string;
  year: number;
  equivalentTo100mgCpz: number; // Dose (mg/dia) equivalente a 100 mg de Clorpromazina oral
  population: string;
  limitations: string;
}

export interface AntipsychoticDrugProfile {
  id: string;
  name: string;
  genericName: string;
  route: 'oral' | 'im_depot' | 'im_short';
  typicalDoseRange?: { min: number; max: number }; // Referência indicativa de bula/literatura
  methods: Partial<Record<CpzeMethod, CpzeMethodData>>;
  clinicalAlerts?: string[];
  isClozapine?: boolean;
}

/**
 * Base de Dados Tipada e Verificável de Antipsicóticos e Métodos de Equivalência
 *
 * Fontes primárias:
 * - Leucht et al. (2015). Schizophrenia Bulletin, 42(S1), S90-S99. DOI: 10.1093/schbul/sbv037
 *   Tabela 1: Classical mean dose ratio to chlorpromazine (100 mg/dia CPZ).
 * - Leucht et al. (2014). Schizophrenia Bulletin, 40(2), 314-326. DOI: 10.1093/schbul/sbu001
 *   Tabela 2 / Análises: Dose-response meta-analysis (Minimum effective dose method).
 * - Leucht et al. (2016). Schizophrenia Bulletin, 42(S1), S90-S94.
 *   Dose Equivalents for Antipsychotic Drugs: The DDD Method (WHO Defined Daily Dose).
 * - Gardner et al. (2010). Am J Psychiatry, 167(6), 686-693. DOI: 10.1176/appi.ajp.2009.09060802
 *   International consensus study of antipsychotic dosing.
 * - Furukawa et al. (2026). eClinicalMedicine. DOI: 10.1016/j.eclinm.2026.103847
 *   Evidência contemporânea de dose-resposta e limitações de extrapolação.
 */
export const ANTIPSYCHOTIC_DATABASE: Record<string, AntipsychoticDrugProfile> = {
  clorpromazina: {
    id: 'clorpromazina',
    name: 'Clorpromazina (VO)',
    genericName: 'Clorpromazina',
    route: 'oral',
    typicalDoseRange: { min: 100, max: 1000 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Reference compound)',
        year: 2015,
        equivalentTo100mgCpz: 100,
        population: 'Adultos com esquizofrenia crônica ou subaguda em RCTs',
        limitations: 'Composto de referência (1:1). Não reflete variações de biodisponibilidade individual.',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Reference compound)',
        year: 2014,
        equivalentTo100mgCpz: 100,
        population: 'Adultos com esquizofrenia em ensaios de dose fixa',
        limitations: 'Composto de referência.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1 (DDD ratios)',
        year: 2016,
        equivalentTo100mgCpz: 100,
        population: 'Estatística de utilização populacional internacional (WHO ATC/DDD)',
        limitations: 'Unidade técnica de consumo populacional; não foi desenhada como equivalência clínica individual.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1 (Reference)',
        year: 2010,
        equivalentTo100mgCpz: 100,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Baseado em consenso de especialistas.',
      },
    },
  },

  haloperidol: {
    id: 'haloperidol',
    name: 'Haloperidol (VO)',
    genericName: 'Haloperidol',
    route: 'oral',
    typicalDoseRange: { min: 2, max: 20 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 2.0,
        population: 'Adultos com esquizofrenia em RCTs duplo-cegos',
        limitations: 'Razão média observada em doses fixas/flexíveis. Risco de impregnação extrapiramidal em doses > 4-5 mg/dia.',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Dose-response curve)',
        year: 2014,
        equivalentTo100mgCpz: 2.1,
        population: 'Adultos em RCTs de dose fixa (curva dose-resposta)',
        limitations: 'Identifica o platô de eficácia (ED95 ~ 4 mg/dia), mas não a dose individual ideal.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 2.67, // DDD ratio WHO: Haloperidol 8mg vs CPZ 300mg -> (8/300)*100 = 2.67
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'Superestima a dose diária típica comparada à prática clínica atual.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 2.0,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso Delphi com dispersão em subpopulações de primeiro episódio.',
      },
    },
  },

  risperidona: {
    id: 'risperidona',
    name: 'Risperidona (VO)',
    genericName: 'Risperidona',
    route: 'oral',
    typicalDoseRange: { min: 2, max: 8 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 1.4,
        population: 'Adultos com esquizofrenia crônica ou recorrente em RCTs',
        limitations: 'Em doses > 4 mg/dia, o perfil de efeitos extrapiramidais e hiperprolactinemia aproxima-se dos antipsicóticos típicos.',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Dose-response curve)',
        year: 2014,
        equivalentTo100mgCpz: 1.1,
        population: 'Adultos em RCTs de dose fixa (curva dose-resposta)',
        limitations: 'Curva atinge platô terapêutico em ~ 4 mg/dia.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 1.67, // DDD ratio WHO: Risperidone 5mg vs CPZ 300mg -> (5/300)*100 = 1.67
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'DDD fixada pela OMS em 5 mg/dia; acima da dose média modal na APS.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 1.5,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso Delphi.',
      },
    },
  },

  olanzapina: {
    id: 'olanzapina',
    name: 'Olanzapina (VO)',
    genericName: 'Olanzapina',
    route: 'oral',
    typicalDoseRange: { min: 5, max: 20 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 4.2,
        population: 'Adultos com esquizofrenia em RCTs duplo-cegos',
        limitations: 'Não considera risco metabólico desproporcional (ganho ponderal, disglicemia e dislipidemia).',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Dose-response curve)',
        year: 2014,
        equivalentTo100mgCpz: 3.8,
        population: 'Adultos em RCTs de dose fixa (curva dose-resposta)',
        limitations: 'Platô de resposta na curva clássica em ~ 15 mg/dia.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 3.33, // DDD ratio WHO: Olanzapine 10mg vs CPZ 300mg -> (10/300)*100 = 3.33
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'Subestima equivalência em relação à média clínica de RCTs.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 5.0,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso Delphi internacional.',
      },
    },
  },

  quetiapina: {
    id: 'quetiapina',
    name: 'Quetiapina (VO)',
    genericName: 'Quetiapina',
    route: 'oral',
    typicalDoseRange: { min: 150, max: 800 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 111.0,
        population: 'Adultos com esquizofrenia em RCTs (doses antipsicóticas plenas)',
        limitations: 'Doses < 150-300 mg/dia possuem ação predominantemente anti-histamínica/sedativa e NÃO têm eficácia antipsicótica demonstrada.',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Dose-response curve)',
        year: 2014,
        equivalentTo100mgCpz: 78.0,
        population: 'Adultos em RCTs de dose fixa (curva dose-resposta)',
        limitations: 'Curva linear ascendente sem platô nítido até 600-800 mg/dia.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 133.3, // DDD ratio WHO: Quetiapine 400mg vs CPZ 300mg -> (400/300)*100 = 133.3
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'DDD de 400 mg reflete média técnica global, subestimando necessidade em esquizofrenia.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 75.0,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso Delphi.',
      },
    },
  },

  aripiprazol: {
    id: 'aripiprazol',
    name: 'Aripiprazol (VO)',
    genericName: 'Aripiprazol',
    route: 'oral',
    typicalDoseRange: { min: 10, max: 30 },
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 4.1,
        population: 'Adultos com esquizofrenia em RCTs duplo-cegos',
        limitations: 'Mecanismo agonista parcial D2; não há relação linear direta de bloqueio estrito como os antagonistas plenos.',
      },
      leucht_2014_min_effective: {
        method: 'leucht_2014_min_effective',
        methodName: 'Dose Mínima Eficaz (Leucht 2014)',
        sourceStudyId: 'leucht-2014-min-effective',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2014;40(2):314-326.',
        doi: '10.1093/schbul/sbu001',
        sourceTableOrSection: 'Table 2 (Dose-response curve)',
        year: 2014,
        equivalentTo100mgCpz: 3.3,
        population: 'Adultos em RCTs de dose fixa (curva dose-resposta)',
        limitations: 'Platô precoce de eficácia em ~ 10-15 mg/dia; doses superiores aumentam taxa de acatisia sem ganho proporcional de eficácia.',
      },
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 5.0, // DDD ratio WHO: Aripiprazole 15mg vs CPZ 300mg -> (15/300)*100 = 5.0
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'Unidade técnica populacional baseada em DDD de 15 mg.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 7.5,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso Delphi com maior estimativa de equivalente em relação aos RCTs.',
      },
    },
  },

  clozapina: {
    id: 'clozapina',
    name: 'Clozapina (VO)',
    genericName: 'Clozapina',
    route: 'oral',
    typicalDoseRange: { min: 100, max: 900 },
    isClozapine: true,
    clinicalAlerts: [
      'DROGA RESERVADA EXCLUSIVAMENTE PARA ESQUIZOFRENIA RESISTENTE AO TRATAMENTO (ERT) OU ALTO RISCO DE SUICÍDIO.',
      'PROIBIDA A SUBSTITUIÇÃO OU TRANSIÇÃO AUTOMÁTICA: O cálculo de equivalência em CPZE tem finalidade estritamente descritiva de carga de exposição.',
      'NUNCA interromper abruptamente (risco crítico de psicose de rebote colinérgica/serotoninérgica grave e convulsões).',
      'MONITORAMENTO HEMATOLÓGICO OBRIGATÓRIO: Risco de agranulocitose potencialmente fatal. Exige controle estrito de leucócitos e neutrófilos (ANC).',
      'A eficácia clínica da Clozapina depende de nível sérico de clozapinemia (> 350-420 ng/mL) e farmacocinética do citocromo CYP1A2 (influenciada por tabagismo e café), não de equivalências aritméticas simples.',
    ],
    methods: {
      leucht_2015_classic_mean: {
        method: 'leucht_2015_classic_mean',
        methodName: 'Dose Média Clássica (Leucht 2015)',
        sourceStudyId: 'leucht-2015-mean-dose',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2015;42(Suppl 1):S90-S99.',
        doi: '10.1093/schbul/sbv037',
        sourceTableOrSection: 'Table 1 (Classical mean dose ratio)',
        year: 2015,
        equivalentTo100mgCpz: 88.0,
        population: 'Adultos com esquizofrenia resistente ao tratamento em RCTs',
        limitations: 'População de ensaios com ERT. Não deve ser transposta como meta de troca.',
      },
      // Leucht 2014 NÃO incluiu Clozapina em curva dose-resposta fixa primária (estudos não comparáveis por questões éticas/metodológicas em ERT)
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1',
        year: 2016,
        equivalentTo100mgCpz: 100.0, // DDD ratio WHO: Clozapine 300mg vs CPZ 300mg -> (300/300)*100 = 100.0
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'Métrica puramente estatística da OMS.',
      },
      gardner_2010_consensus: {
        method: 'gardner_2010_consensus',
        methodName: 'Consenso Internacional (Gardner 2010)',
        sourceStudyId: 'gardner-2010-consensus',
        referenceCitation: 'Gardner DM, et al. Am J Psychiatry. 2010;167(6):686-693.',
        doi: '10.1176/appi.ajp.2009.09060802',
        sourceTableOrSection: 'Table 1',
        year: 2010,
        equivalentTo100mgCpz: 100.0,
        population: 'Painel internacional de especialistas clínicos',
        limitations: 'Consenso internacional para fins de pesquisa.',
      },
    },
  },

  levomepromazina: {
    id: 'levomepromazina',
    name: 'Levomepromazina (VO)',
    genericName: 'Levomepromazina',
    route: 'oral',
    typicalDoseRange: { min: 25, max: 200 },
    clinicalAlerts: [
      'Antipsicótico fenotiazínico sedativo de baixa potência; uso frequente como adjuvante em insônia grave e agitação.',
      'Ausência de dados contemporâneos de meta-análise de dose fixa (Leucht 2014/2015).',
      'Risco proeminente de hipotensão ortostática e sedação por potente bloqueio alfa-1 e H1.',
    ],
    methods: {
      // Sem dados em Leucht 2015 ou Leucht 2014
      leucht_2016_ddd: {
        method: 'leucht_2016_ddd',
        methodName: 'Defined Daily Dose (OMS / Leucht 2016)',
        sourceStudyId: 'leucht-2016-ddd-method',
        referenceCitation: 'Leucht S, et al. Schizophr Bull. 2016;42(Suppl 1):S90-S94.',
        sourceTableOrSection: 'Table 1 (DDD ratios)',
        year: 2016,
        equivalentTo100mgCpz: 100.0, // DDD ratio WHO: Levomepromazine 300mg vs CPZ 300mg -> (300/300)*100 = 100.0
        population: 'Métrica de consumo populacional ATC/DDD',
        limitations: 'Informação complementar de utilização populacional. Não derivada de ensaios comparativos de dose fixa.',
      },
    },
  },
};

// ============================================================================
// VALIDAÇÃO COM ZOD (MOTOR DE CÁLCULO)
// ============================================================================

export const AntipsychoticEquivalenceInputSchema = z.object({
  drugId: z
    .string()
    .min(1, 'Identificador de medicamento é obrigatório')
    .refine((val) => Object.prototype.hasOwnProperty.call(ANTIPSYCHOTIC_DATABASE, val.toLowerCase()), {
      message: 'Medicamento não cadastrado na base verificável de equivalências',
    }),
  doseMg: z
    .number()
    .finite('A dose deve ser um número finito')
    .positive('A dose deve ser estritamente positiva (> 0)')
    .max(2000, 'Dose fora do intervalo plausível de segurança farmacológica'),
  isFirstEpisode: z.boolean().default(false),
});

export type AntipsychoticEquivalenceInput = z.infer<typeof AntipsychoticEquivalenceInputSchema>;

export interface CpzeMethodResult {
  method: CpzeMethod;
  methodName: string;
  sourceStudyId: string;
  referenceCitation: string;
  doi?: string;
  sourceTableOrSection: string;
  equivalentCpzeMg: number;
  equivalentTo100mgCpz: number;
  population: string;
  limitations: string;
}

export interface AntipsychoticEquivalenceResult {
  drug: AntipsychoticDrugProfile;
  inputDoseMg: number;
  isFirstEpisode: boolean;
  primaryResult: CpzeMethodResult | null; // Baseado no método de dose média clássica de Leucht et al. (2015)
  comparativeResults: CpzeMethodResult[]; // Outros métodos independentes verificáveis
  dddComplementaryInfo: CpzeMethodResult | null; // Leucht et al. (2016) DDD exclusivamente complementar
  availableMethodsCount: number;
  firstEpisodeNotice?: string;
  clozapineNotice?: string;
  doseResponseCaveat: string;
  clinicalAlerts: string[];
  soapText: string;
}

/**
 * Função Pura de Cálculo de Equivalência de Antipsicóticos (CPZE)
 *
 * Implementa rigorosamente as diretrizes metodológicas:
 * 1. Método principal: Dose média clássica de Leucht et al. (2015)
 * 2. Método comparativo independente: Leucht et al. (2014)
 * 3. DDD exclusivamente complementar: Leucht et al. (2016)
 * 4. Consenso comparativo: Gardner et al. (2010)
 * 5. NUNCA calcula médias artificiais ou faixas inventadas entre métodos
 * 6. Primeiro episódio: emite aviso de aplicabilidade sem produzir nova dose arbitrária
 * 7. Clozapina: aviso explícito de proibição de transição automática
 */
export function calculateAntipsychoticEquivalenceV2(
  rawInput: unknown
): AntipsychoticEquivalenceResult {
  const parsed = AntipsychoticEquivalenceInputSchema.parse(rawInput);
  const drugId = parsed.drugId.toLowerCase();
  const drug = ANTIPSYCHOTIC_DATABASE[drugId];

  if (!drug) {
    throw new Error(`Medicamento desconhecido: ${parsed.drugId}`);
  }

  // 1. Método Principal: Leucht et al. (2015) - Classical mean dose
  let primaryResult: CpzeMethodResult | null = null;
  const primaryMethodData = drug.methods.leucht_2015_classic_mean;
  if (primaryMethodData) {
    const cpzeMg = Math.round((parsed.doseMg / primaryMethodData.equivalentTo100mgCpz) * 100 * 10) / 10;
    primaryResult = {
      method: primaryMethodData.method,
      methodName: primaryMethodData.methodName,
      sourceStudyId: primaryMethodData.sourceStudyId,
      referenceCitation: primaryMethodData.referenceCitation,
      doi: primaryMethodData.doi,
      sourceTableOrSection: primaryMethodData.sourceTableOrSection,
      equivalentCpzeMg: cpzeMg,
      equivalentTo100mgCpz: primaryMethodData.equivalentTo100mgCpz,
      population: primaryMethodData.population,
      limitations: primaryMethodData.limitations,
    };
  }

  // 2. Métodos Comparativos Independentes (Leucht 2014, Gardner 2010)
  const comparativeResults: CpzeMethodResult[] = [];

  const minEffectiveData = drug.methods.leucht_2014_min_effective;
  if (minEffectiveData) {
    const cpzeMg = Math.round((parsed.doseMg / minEffectiveData.equivalentTo100mgCpz) * 100 * 10) / 10;
    comparativeResults.push({
      method: minEffectiveData.method,
      methodName: minEffectiveData.methodName,
      sourceStudyId: minEffectiveData.sourceStudyId,
      referenceCitation: minEffectiveData.referenceCitation,
      doi: minEffectiveData.doi,
      sourceTableOrSection: minEffectiveData.sourceTableOrSection,
      equivalentCpzeMg: cpzeMg,
      equivalentTo100mgCpz: minEffectiveData.equivalentTo100mgCpz,
      population: minEffectiveData.population,
      limitations: minEffectiveData.limitations,
    });
  }

  const gardnerData = drug.methods.gardner_2010_consensus;
  if (gardnerData) {
    const cpzeMg = Math.round((parsed.doseMg / gardnerData.equivalentTo100mgCpz) * 100 * 10) / 10;
    comparativeResults.push({
      method: gardnerData.method,
      methodName: gardnerData.methodName,
      sourceStudyId: gardnerData.sourceStudyId,
      referenceCitation: gardnerData.referenceCitation,
      doi: gardnerData.doi,
      sourceTableOrSection: gardnerData.sourceTableOrSection,
      equivalentCpzeMg: cpzeMg,
      equivalentTo100mgCpz: gardnerData.equivalentTo100mgCpz,
      population: gardnerData.population,
      limitations: gardnerData.limitations,
    });
  }

  // 3. Métrica DDD Complementar (Leucht et al., 2016)
  let dddComplementaryInfo: CpzeMethodResult | null = null;
  const dddData = drug.methods.leucht_2016_ddd;
  if (dddData) {
    const cpzeMg = Math.round((parsed.doseMg / dddData.equivalentTo100mgCpz) * 100 * 10) / 10;
    dddComplementaryInfo = {
      method: dddData.method,
      methodName: dddData.methodName,
      sourceStudyId: dddData.sourceStudyId,
      referenceCitation: dddData.referenceCitation,
      doi: dddData.doi,
      sourceTableOrSection: dddData.sourceTableOrSection,
      equivalentCpzeMg: cpzeMg,
      equivalentTo100mgCpz: dddData.equivalentTo100mgCpz,
      population: dddData.population,
      limitations: dddData.limitations,
    };
  }

  // 4. Consideração de Primeiro Episódio Psicotrópico (FEP)
  let firstEpisodeNotice: string | undefined;
  if (parsed.isFirstEpisode) {
    firstEpisodeNotice =
      'LIMITAÇÃO EM PRIMEIRO EPISÓDIO PSICÓTICO (PEP): As razões CPZE clássicas foram derivadas primariamente de amostras com esquizofrenia multiepisódica ou crônica. Pacientes em primeiro episódio apresentam maior sensibilidade biológica e resposta terapêutica robusta a doses substancialmente menores (tipicamente 30% a 50% das doses convencionais de manutenção), além de risco marcadamente elevado de efeitos extrapiramidais e ganho de peso. Não utilizar coeficientes CPZE padrão para guiar metas posológicas em PEP; recomenda-se iniciar na dose mínima eficaz e titular com parcimônia.';
  }

  // 5. Clozapina Alertas
  let clozapineNotice: string | undefined;
  if (drug.isClozapine) {
    clozapineNotice =
      'ATENÇÃO: A Clozapina possui farmacocinética não linear e seu uso é restrito à Esquizofrenia Resistente ao Tratamento. A estimativa em CPZE tem finalidade exclusivamente descritiva de carga de tratamento. É expressamente contraindicada a substituição ou transição automática orientada por equivalências matemáticas.';
  }

  // 6. Limitação Contemporânea de Dose-Resposta (Furukawa et al., 2026 / Leucht)
  const doseResponseCaveat =
    'Limitação Farmacológica Fundamental (Furukawa et al., 2026; Leucht et al., 2015): Os antipsicóticos apresentam curvas dose-resposta não lineares com platôs de eficácia em doses distintas (ex: saturação precoce de D2 com risperidona vs. curva mais inclinada com quetiapina). Portanto, a razão CPZE não expressa equivalência biológica idêntica em todas as faixas posológicas nem reflete perfis desiguais de efeitos adversos (metabólicos vs. extrapiramidais). O resultado informa a exposição teórica e não deve ser utilizado como cálculo de substituição direta.';

  // 7. Lista consolidada de alertas clínicos
  const clinicalAlerts: string[] = [];
  if (drug.clinicalAlerts) {
    clinicalAlerts.push(...drug.clinicalAlerts);
  }
  if (firstEpisodeNotice) {
    clinicalAlerts.push(firstEpisodeNotice);
  }

  // 8. Registro Estruturado para Prontuário (SOAP)
  const primaryText = primaryResult
    ? `~${primaryResult.equivalentCpzeMg} mg/dia de Clorpromazina equivalente (Método Dose Média: Leucht et al., 2015)`
    : `Dado primário de dose média não disponível em Leucht (2015)`;

  const compText = comparativeResults.length > 0
    ? `Método comparativo: ${comparativeResults.map((c) => `${c.methodName}: ${c.equivalentCpzeMg} mg CPZE`).join('; ')}.`
    : '';

  const dddText = dddComplementaryInfo
    ? `Métrica de utilização DDD (Leucht 2016): ~${dddComplementaryInfo.equivalentCpzeMg} mg CPZE.`
    : '';

  const soapText = [
    `Avaliação de dose equivalente em Clorpromazina (CPZE):`,
    `- Fármaco: ${drug.name} na dose prescrita de ${parsed.doseMg} mg/dia.`,
    `- Estimativa principal: ${primaryText}.`,
    compText,
    dddText,
    parsed.isFirstEpisode ? `- Contexto: Paciente em Primeiro Episódio Psicótico (PEP) - sensibilidade aumentada a doses reduzidas.` : '',
    drug.isClozapine ? `- Alerta: Clozapina em regime de alta especificidade/monitoramento hematológico; valor descritivo sem equivalência de troca.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const availableMethodsCount =
    (primaryResult ? 1 : 0) + comparativeResults.length + (dddComplementaryInfo ? 1 : 0);

  return {
    drug,
    inputDoseMg: parsed.doseMg,
    isFirstEpisode: parsed.isFirstEpisode,
    primaryResult,
    comparativeResults,
    dddComplementaryInfo,
    availableMethodsCount,
    firstEpisodeNotice,
    clozapineNotice,
    doseResponseCaveat,
    clinicalAlerts,
    soapText,
  };
}
