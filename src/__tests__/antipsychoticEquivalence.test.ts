import { describe, it, expect } from 'vitest';
import {
  ANTIPSYCHOTIC_DATABASE,
  calculateAntipsychoticEquivalenceV2,
  AntipsychoticEquivalenceInputSchema,
} from '../utils/antipsychoticEquivalence';
import { calculateAntipsychoticEquivalence } from '../utils/calculators';

describe('Motor de Equivalência de Antipsicóticos (CPZE)', () => {
  describe('Validação Rigorosa de Entradas (Zod)', () => {
    it('rejeita valores de dose negativos, zero ou não finitos', () => {
      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'risperidona',
          doseMg: -2,
        })
      ).toThrow();

      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'risperidona',
          doseMg: 0,
        })
      ).toThrow();

      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'risperidona',
          doseMg: Infinity,
        })
      ).toThrow();

      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'risperidona',
          doseMg: NaN,
        })
      ).toThrow();
    });

    it('rejeita medicamentos desconhecidos sem fallback silencioso', () => {
      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'droga_inventada_inexistente',
          doseMg: 10,
        })
      ).toThrow();
    });

    it('rejeita doses fora do intervalo de segurança farmacológica (> 2000 mg)', () => {
      expect(() =>
        calculateAntipsychoticEquivalenceV2({
          drugId: 'haloperidol',
          doseMg: 2500,
        })
      ).toThrow();
    });
  });

  describe('Método Principal: Dose Média Clássica (Leucht et al., 2015)', () => {
    it('calcula equivalência exata de Haloperidol (2 mg = 100 mg CPZE)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'haloperidol',
        doseMg: 2.0,
      });

      expect(res.primaryResult).not.toBeNull();
      expect(res.primaryResult?.equivalentCpzeMg).toBe(100);
      expect(res.primaryResult?.sourceStudyId).toBe('leucht-2015-mean-dose');
      expect(res.primaryResult?.referenceCitation).toContain('Leucht S, et al. Schizophr Bull. 2015');
      expect(res.primaryResult?.sourceTableOrSection).toContain('Table 1');
    });

    it('calcula equivalência exata de Risperidona (1.4 mg = 100 mg CPZE / 2.8 mg = 200 mg CPZE)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'risperidona',
        doseMg: 2.8,
      });

      expect(res.primaryResult).not.toBeNull();
      expect(res.primaryResult?.equivalentCpzeMg).toBe(200);
      expect(res.primaryResult?.equivalentTo100mgCpz).toBe(1.4);
    });

    it('calcula equivalência de Olanzapina (4.2 mg = 100 mg CPZE / 10 mg ~ 238.1 mg CPZE)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'olanzapina',
        doseMg: 10,
      });

      expect(res.primaryResult).not.toBeNull();
      // 10 / 4.2 * 100 = 238.1 mg
      expect(res.primaryResult?.equivalentCpzeMg).toBe(238.1);
      expect(res.primaryResult?.equivalentTo100mgCpz).toBe(4.2);
    });

    it('calcula equivalência de Quetiapina (111 mg = 100 mg CPZE)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'quetiapina',
        doseMg: 111,
      });

      expect(res.primaryResult).not.toBeNull();
      expect(res.primaryResult?.equivalentCpzeMg).toBe(100);
      expect(res.primaryResult?.equivalentTo100mgCpz).toBe(111);
    });

    it('calcula equivalência de Aripiprazol (4.1 mg = 100 mg CPZE)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'aripiprazol',
        doseMg: 4.1,
      });

      expect(res.primaryResult).not.toBeNull();
      expect(res.primaryResult?.equivalentCpzeMg).toBe(100);
      expect(res.primaryResult?.equivalentTo100mgCpz).toBe(4.1);
    });
  });

  describe('Diferenciação Metodológica Independente (Sem Misturar ou Criar Médias Artificiais)', () => {
    it('mantém Leucht 2014 (Dose Mínima Eficaz) e Gardner 2010 como resultados comparativos independentes', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'risperidona',
        doseMg: 2.0,
      });

      // Método principal (Leucht 2015: 1.4 mg -> 2 / 1.4 * 100 = 142.9 mg CPZE)
      expect(res.primaryResult?.equivalentCpzeMg).toBe(142.9);

      // Métodos comparativos independentes
      const minEffective = res.comparativeResults.find(
        (c) => c.method === 'leucht_2014_min_effective'
      );
      expect(minEffective).toBeDefined();
      expect(minEffective?.sourceStudyId).toBe('leucht-2014-min-effective');
      // Leucht 2014: 1.1 mg -> 2 / 1.1 * 100 = 181.8 mg CPZE
      expect(minEffective?.equivalentCpzeMg).toBe(181.8);

      const gardner = res.comparativeResults.find(
        (c) => c.method === 'gardner_2010_consensus'
      );
      expect(gardner).toBeDefined();
      // Gardner 2010: 1.5 mg -> 2 / 1.5 * 100 = 133.3 mg CPZE
      expect(gardner?.equivalentCpzeMg).toBe(133.3);

      // Não calcula média artificial entre eles
      expect(res.primaryResult?.equivalentCpzeMg).not.toBe(
        ((minEffective?.equivalentCpzeMg || 0) + (gardner?.equivalentCpzeMg || 0)) / 2
      );
    });

    it('trata o método DDD (Leucht 2016) exclusivamente como informação complementar de utilização', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'haloperidol',
        doseMg: 5.0,
      });

      expect(res.dddComplementaryInfo).not.toBeNull();
      expect(res.dddComplementaryInfo?.method).toBe('leucht_2016_ddd');
      expect(res.dddComplementaryInfo?.population).toContain('ATC/DDD');
      expect(res.dddComplementaryInfo?.limitations).toContain('Superestima a dose diária típica');
    });
  });

  describe('Fármacos sem Dados Primários em RCTs (Levomepromazina)', () => {
    it('retorna primaryResult como null para fármacos sem ensaios comparativos de dose média (Levomepromazina)', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'levomepromazina',
        doseMg: 100,
      });

      // Não inventa coeficiente para Leucht 2015
      expect(res.primaryResult).toBeNull();
      // Mas disponibiliza a métrica DDD como complementar
      expect(res.dddComplementaryInfo).not.toBeNull();
      expect(res.dddComplementaryInfo?.equivalentCpzeMg).toBe(100);
    });
  });

  describe('Tratamento Específico de Clozapina (Sem Substituição Automática)', () => {
    it('identifica Clozapina, apresenta avisos hematológicos e proíbe substituição direta', () => {
      const res = calculateAntipsychoticEquivalenceV2({
        drugId: 'clozapina',
        doseMg: 200,
      });

      expect(res.drug.isClozapine).toBe(true);
      expect(res.clozapineNotice).toBeDefined();
      expect(res.clozapineNotice).toContain('Esquizofrenia Resistente ao Tratamento');
      expect(res.clozapineNotice).toContain('contraindicada a substituição ou transição automática');
      expect(res.clinicalAlerts.join(' ')).toContain('agranulocitose');
      expect(res.soapText).toContain('Clozapina em regime de alta especificidade');
    });
  });

  describe('Manejo de Primeiro Episódio Psicótico (PEP / FEP)', () => {
    it('não altera arbitrariamente a fórmula da dose, mas emite aviso categórico de aplicabilidade e redução de dose', () => {
      const resStandard = calculateAntipsychoticEquivalenceV2({
        drugId: 'olanzapina',
        doseMg: 10,
        isFirstEpisode: false,
      });

      const resFirstEpisode = calculateAntipsychoticEquivalenceV2({
        drugId: 'olanzapina',
        doseMg: 10,
        isFirstEpisode: true,
      });

      // O valor CPZE é matematicamente o mesmo (não inventa dose nova automática)
      expect(resFirstEpisode.primaryResult?.equivalentCpzeMg).toBe(
        resStandard.primaryResult?.equivalentCpzeMg
      );

      // Emite o aviso de aplicabilidade clínica
      expect(resFirstEpisode.firstEpisodeNotice).toBeDefined();
      expect(resFirstEpisode.firstEpisodeNotice).toContain('PRIMEIRO EPISÓDIO PSICÓTICO');
      expect(resFirstEpisode.firstEpisodeNotice).toContain('sensibilidade biológica e resposta terapêutica robusta a doses substancialmente menores');
      expect(resFirstEpisode.soapText).toContain('Primeiro Episódio Psicótico');
    });
  });

  describe('Compatibilidade com calculateAntipsychoticEquivalence em calculators.ts', () => {
    it('retorna resultado formatado para SOAP e trata entradas inválidas graciosamente', () => {
      const valid = calculateAntipsychoticEquivalence('Risperidona', 3);
      expect(valid.id).toBe('antipsychotic-eq');
      expect(valid.value).toContain('CPZE');
      expect(valid.soapText).toContain('Leucht et al., 2015');

      const invalidDrug = calculateAntipsychoticEquivalence('DrogaInexistente', 5);
      expect(invalidDrug.value).toBe('Dado indisponível');

      const invalidDose = calculateAntipsychoticEquivalence('Risperidona', -5);
      expect(invalidDose.value).toBe('Dado indisponível');
    });
  });
});
