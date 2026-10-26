import { describe, it, expect } from 'vitest';
import { EEM_DOMAINS } from '../data/eemData';
import { formatEemIntoObjective, generateEemSummary } from '../utils/eemFormatter';
import { getEuthymicEemPreset, toggleEemSelection } from '../utils/eemSelection';
import type { EemState } from '../types';

/**
 * MRC-EEM v1.0 — critérios esperados definidos antes da execução.
 * Casos fictícios sem identificação de pacientes. A aprovação destas funções
 * não substitui a avaliação de seleção de opções na interface (EEM-10).
 */
const emptyEem = (): EemState => ({
  aparencia: [], aparenciaOutros: '',
  atitude: [], atitudeOutros: '',
  fala: [], falaOutros: '',
  humor: [], humorOutros: '',
  afeto: [], afetoOutros: '',
  pensamentoCurso: [], pensamentoForma: [], pensamentoConteudo: [], pensamentoOutros: '',
  sensopercepcao: [], sensopercepcaoOutros: '',
  orientacao: [], orientacaoOutros: '',
  atencaoMemoria: [], atencaoMemoriaOutros: '',
  insight: [], insightOutros: '',
  julgamento: [], julgamentoOutros: '',
  observacoesLivres: '',
});

describe('MRC-EEM v1.0 | semiologia, documentação e integração', () => {
  it('[EEM-01] um exame não preenchido não gera descrição de normalidade', () => {
    const text = generateEemSummary(emptyEem());
    expect(text).toContain('Nenhum parâmetro selecionado.');
    expect(text).not.toMatch(/eutímic|orientado global|sem alterações perceptivas|julgamento preservado/i);
  });

  it('[EEM-02] o exame descreve somente o domínio explicitamente selecionado', () => {
    const text = generateEemSummary({ ...emptyEem(), humor: ['ansioso'] });
    expect(text).toContain('Humor: ansioso / apreensivo.');
    expect(text).not.toMatch(/Aparência e Higiene:|Afeto:|Orientação \(|Sensopercepção:|Julgamento e Crítica/i);
    expect(text.match(/Humor:/g)).toHaveLength(1);
  });

  it('[EEM-03] conserva curso, forma e conteúdo do pensamento como descritores distintos', () => {
    const text = generateEemSummary({
      ...emptyEem(),
      pensamentoCurso: ['curso_bradipsiquico'],
      pensamentoForma: ['forma_tangencial'],
      pensamentoConteudo: ['conteudo_ruminacoes'],
    });
    expect(text).toMatch(/Pensamento:.*bradipsiquismo.*tangencial.*ruminações/i);
    expect(text.match(/Pensamento:/g)).toHaveLength(1);
    expect(text).not.toMatch(/normopsíquico|lógico, coerente/i);
  });

  it('[EEM-04] o achado normal de sensopercepção só surge quando selecionado', () => {
    const text = generateEemSummary({
      ...emptyEem(),
      sensopercepcao: ['senso_sem_alteracoes'],
    });
    expect(text).toContain('Sensopercepção: sem alterações perceptivas.');
    expect(text).not.toMatch(/Orientação \(|Pensamento:|Insight \//);
  });

  it('[EEM-05] mantém observações livres com acentos e quebras de linha', () => {
    const note = 'Paciente chora ao relatar perdas.\nMantém contato ocular; não foi investigada orientação temporal.';
    const text = generateEemSummary({
      ...emptyEem(),
      observacoesLivres: note,
    });
    expect(text).toContain('Observações complementares: ' + note);
    expect(text).not.toContain('Orientação (Auto e Alopsíquica):');
    expect(text).not.toContain('humor: eutímico');
  });

  it('[EEM-06] IDs de descritores não reconhecidos não produzem achados clínicos', () => {
    const text = generateEemSummary({
      ...emptyEem(),
      aparencia: ['id-inexistente'],
      orientacao: ['nao-cadastrado'],
      humor: null as unknown as string[],
    });
    expect(text).toContain('Nenhum parâmetro selecionado.');
    expect(text).not.toContain('id-inexistente');
    expect(text).not.toContain('nao-cadastrado');
    expect(text).not.toMatch(/preservad|normal|orientado global|eutímic/i);
  });

  it('[EEM-07] documenta ideação suicida selecionada sem estratificação automática', () => {
    const text = generateEemSummary({
      ...emptyEem(),
      pensamentoConteudo: ['conteudo_ideacao_suicida'],
    });
    const sourceOption = EEM_DOMAINS.find((d) => d.id === 'pensamentoConteudo')
      ?.options.find((o) => o.id === 'conteudo_ideacao_suicida');
    expect(sourceOption).toBeDefined();
    expect(text.toLowerCase()).toContain('ideação suicida');
    expect(text).not.toMatch(/risco (?:alto|baixo|moderado)|internação indicada|prescrever/i);
  });

  it('[EEM-08] incorpora o exame sem apagar sinais vitais do Objetivo', () => {
    const objective = 'PA 118/74 mmHg.\nFC 66 bpm.';
    const narrative = generateEemSummary({
      ...emptyEem(),
      humor: ['ansioso'],
    });
    const updated = formatEemIntoObjective(objective, narrative);
    expect(updated).toContain('PA 118/74 mmHg.');
    expect(updated).toContain('FC 66 bpm.');
    expect(updated).toContain('Humor: ansioso / apreensivo.');
    expect(updated.match(/Exame do Estado Mental \(EEM\):/gi)).toHaveLength(1);
  });

  it('[EEM-09] substitui o bloco anterior sem duplicá-lo nem apagar um escore existente', () => {
    const objective = [
      'PA 118/74 mmHg.',
      '',
      'Exame do Estado Mental (EEM):',
      'Humor: ansioso.',
      '',
      '• PHQ-9: 10/27 pontos.',
    ].join('\n');
    const narrative = generateEemSummary({
      ...emptyEem(),
      humor: ['eutimico'],
    });
    const once = formatEemIntoObjective(objective, narrative);
    const twice = formatEemIntoObjective(once, narrative);
    expect(twice).toContain('PA 118/74 mmHg.');
    expect(twice).toContain('• PHQ-9: 10/27 pontos.');
    expect(twice).toContain('Humor: eutímico');
    expect(twice).not.toContain('Humor: ansioso.');
    expect(twice.match(/Exame do Estado Mental \(EEM\):/gi)).toHaveLength(1);
  });

  it('[EEM-10] padrão e exclusão mútua usam apenas descritores cadastrados', () => {
    const preset = getEuthymicEemPreset();
    for (const domain of EEM_DOMAINS) {
      const selected = preset[domain.id as keyof EemState];
      expect(Array.isArray(selected)).toBe(true);
      for (const id of selected as string[]) {
        expect(domain.options.some((option) => option.id === id)).toBe(true);
      }
    }
    expect(generateEemSummary(preset)).toContain('Humor: eutímico');
    expect(generateEemSummary(preset)).toContain('Afeto: normoemotivo');
    expect(generateEemSummary(preset)).toContain('Pensamento: normopsíquico');

    const depressed = toggleEemSelection(preset, 'humor', 'distimico');
    expect(depressed.humor).toContain('distimico');
    expect(depressed.humor).not.toContain('eutimico');
    expect(depressed.afeto).toEqual(preset.afeto);

    const restored = toggleEemSelection(depressed, 'humor', 'eutimico');
    expect(restored.humor).toEqual(['eutimico']);

    const alteredContent = toggleEemSelection({
      ...emptyEem(),
      pensamentoConteudo: ['conteudo_sem_alteracoes'],
      observacoesLivres: 'Observação sintética preservada.',
    }, 'pensamentoConteudo', 'conteudo_ideacao_suicida');
    expect(alteredContent.pensamentoConteudo).toEqual(['conteudo_ideacao_suicida']);
    expect(alteredContent.observacoesLivres).toBe('Observação sintética preservada.');

    const disoriented = toggleEemSelection(preset, 'orientacao', 'desorientado_tempo');
    expect(disoriented.orientacao).toContain('desorientado_tempo');
    expect(disoriented.orientacao).not.toContain('orientado_global');

    const reoriented = toggleEemSelection(disoriented, 'orientacao', 'orientado_global');
    expect(reoriented.orientacao).toEqual(['orientado_global']);

    const arbitrary = toggleEemSelection(preset, 'humor', 'codigo_inexistente');
    expect(arbitrary).toBe(preset);
  });

});
