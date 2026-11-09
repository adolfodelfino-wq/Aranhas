import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ALL_SCALES, PHQ9_SCALE, GAD7_SCALE, TCR_SCALE_IDS, hasTcrConductSuggestions } from '../data/scalesData';
import { getEmptyEemState } from '../utils/eemSelection';
import { generateEemSummary, formatEemIntoObjective } from '../utils/eemFormatter';
import { ScalesView } from '../components/ScalesView';

const answersForTotal = (items: number, total: number) => Object.fromEntries(
  Array.from({ length: items }, (_, i) => [`q${i + 1}`, Math.max(0, Math.min(3, total - 3 * i))])
);

describe('Núcleo do TCR e integridade documental', () => {
  it('[CORE-01] delimita PHQ-9/GAD-7 mantendo os demais instrumentos no catálogo', () => {
    expect(TCR_SCALE_IDS).toEqual(['phq-9', 'gad-7']);
    for (const scale of ALL_SCALES) {
      expect(hasTcrConductSuggestions(scale.id)).toBe(['phq-9', 'gad-7'].includes(scale.id));
    }
    expect(ALL_SCALES.find(s => s.id === 'audit')).toBeDefined();
  });

  it('[CORE-02] conserva texto livre em todos os onze blocos do EEM sem inferir normalidade', () => {
    const fields = ['aparenciaOutros', 'atitudeOutros', 'falaOutros', 'humorOutros', 'afetoOutros',
      'pensamentoOutros', 'sensopercepcaoOutros', 'orientacaoOutros', 'atencaoMemoriaOutros', 'insightOutros', 'julgamentoOutros'];
    for (const field of fields) {
      const note = `Observação ${field}: NÃO investigado.\nRetomar avaliação.`;
      const summary = generateEemSummary({ ...getEmptyEemState(), [field]: note });
      expect(summary).toContain(note);
      expect(summary).not.toMatch(/nenhum parâmetro selecionado|eutímico|orientado global|preservada/i);
      const objective = formatEemIntoObjective('PA 120/80 mmHg.', summary);
      expect(objective).toContain(note);
      expect(objective).toContain('PA 120/80 mmHg.');
    }
  });

  it('[CORE-03] mantém descritor e narrativa do mesmo domínio sem repetir o título', () => {
    const summary = generateEemSummary({ ...getEmptyEemState(), humor: ['ansioso'], humorOutros: 'Paciente relata ansiedade apenas no trabalho.' });
    expect(summary).toContain('ansioso / apreensivo; Paciente relata ansiedade apenas no trabalho.');
    expect(summary.match(/Humor:/g)).toHaveLength(1);
  });

  it('[CORE-04] confere todas as transições de intensidade do PHQ-9', () => {
    for (const [total, label] of [[0, 'mínimos'], [4, 'mínimos'], [5, 'leve'], [9, 'leve'], [10, 'moderada'], [14, 'moderada'], [15, 'moderadamente grave'], [19, 'moderadamente grave'], [20, 'grave'], [27, 'grave']] as const) {
      const result = PHQ9_SCALE.calculateResult(answersForTotal(9, total));
      expect(result.totalScore).toBe(total);
      expect(result.classification).toContain(label);
      expect(result.classification).not.toMatch(/^Depressão/);
    }
  });

  it('[CORE-05] não transforma o escore em prescrição ou prejuízo funcional constatado', () => {
    for (const [scale, n, max] of [[PHQ9_SCALE, 9, 27], [GAD7_SCALE, 7, 21]] as const) {
      for (let score = 0; score <= max; score++) {
        const result = scale.calculateResult(answersForTotal(n, score));
        expect(result.interpretation).toMatch(/não define diagnóstico/);
        expect(result.recommendations.join(' ')).not.toMatch(/iniciar (?:tratamento|farmacoterapia)|dose|ISRS|ISRN/i);
        expect(result.interpretation).not.toMatch(/com (?:alto risco de )?prejuízo funcional|com comprometimento/);
      }
    }
  });

  it('[CORE-06] distingue acurácia do estudo original e propriedades da versão brasileira', () => {
    expect(PHQ9_SCALE.description).not.toMatch(/padrão-ouro/);
    expect(PHQ9_SCALE.validationInfo).toContain('estudo original');
    expect(GAD7_SCALE.validationInfo).toContain('estudo original norte-americano');
    expect(GAD7_SCALE.validationInfo).toContain('não esses índices de acurácia');
  });

  it('[CORE-07] preserva alerta do item 9 em preenchimento parcial e com total baixo', () => {
    for (const answers of [{ q9: 1 }, { ...answersForTotal(9, 0), q9: 1 }]) {
      const result = PHQ9_SCALE.calculateResult(answers);
      expect(result.hasCriticalAlert).toBe(true);
      expect(result.individualAlerts?.length).toBeGreaterThan(0);
      expect(result.classification).not.toMatch(/alto risco de suicídio/i);
    }
  });

  it('[CORE-08] não exibe a caixa de condutas de instrumentos complementares na renderização inicial', () => {
    for (const scale of ALL_SCALES.filter(s => !hasTcrConductSuggestions(s.id))) {
      const html = renderToStaticMarkup(<ScalesView initialScaleId={scale.id} onImportToSoap={() => {}} />);
      expect(html).not.toContain('As orientações clínicas serão ativadas após a conclusão');
      expect(html).toContain(scale.acronym);
    }
    for (const id of TCR_SCALE_IDS) {
      expect(renderToStaticMarkup(<ScalesView initialScaleId={id} onImportToSoap={() => {}} />))
        .toContain('As orientações clínicas serão ativadas após a conclusão');
    }
  });
});
