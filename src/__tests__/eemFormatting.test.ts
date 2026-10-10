import { describe, it, expect } from 'vitest';
import { generateEemSummary, formatEemIntoObjective, sanitizeDuplicateEemHeader } from '../utils/eemFormatter';
import { EemState } from '../types';

describe('Exame do Estado Mental (EEM) Formatting & Header Integrity', () => {
  const sampleEem: EemState = {
    aparencia: ['higienizado', 'vestuario_adequado'],
    aparenciaOutros: '',
    atitude: ['cooperativo'],
    atitudeOutros: '',
    fala: ['fala_normal'],
    falaOutros: '',
    humor: ['eutimico'],
    humorOutros: '',
    afeto: ['normoemotivo'],
    afetoOutros: '',
    pensamentoCurso: ['curso_normopsiquico'],
    pensamentoForma: ['forma_coerente'],
    pensamentoConteudo: ['conteudo_sem_alteracoes'],
    pensamentoOutros: '',
    sensopercepcao: ['senso_sem_alteracoes'],
    sensopercepcaoOutros: '',
    orientacao: ['orientado_global'],
    orientacaoOutros: '',
    atencaoMemoria: ['atencao_normoprosexica'],
    atencaoMemoriaOutros: '',
    insight: ['insight_preservado'],
    insightOutros: '',
    julgamento: ['julgamento_preservado'],
    julgamentoOutros: '',
    observacoesLivres: '',
  };

  it('generateEemSummary outputs a single header', () => {
    const summary = generateEemSummary(sampleEem);
    const headerOccurrences = summary.match(/Exame do Estado Mental \(EEM\):?/gi);
    expect(headerOccurrences).toHaveLength(1);
    expect(summary.startsWith('Exame do Estado Mental (EEM):')).toBe(true);
  });

  it('formatEemIntoObjective never duplicates the EEM header into empty objective', () => {
    const summary = generateEemSummary(sampleEem);
    const objective = formatEemIntoObjective('', summary);

    const matches = objective.match(/Exame do Estado Mental \(EEM\):?/gi);
    expect(matches).toHaveLength(1);
    expect(objective).not.toMatch(/EXAME DO ESTADO MENTAL \(EEM\):\s*Exame do Estado Mental \(EEM\):/i);
  });

  it('formatEemIntoObjective replaces existing duplicate header block without retaining duplicates', () => {
    const corruptedObjective = `PA 120/80 mmHg.

EXAME DO ESTADO MENTAL (EEM):
Exame do Estado Mental (EEM):
Aparência e Higiene: desleixado.
Atitude: hostil.

• PHQ-9 (Hoje): 18/27 pts.`;

    const summary = generateEemSummary(sampleEem);
    const updated = formatEemIntoObjective(corruptedObjective, summary);

    // Should only have 1 single occurrence of the EEM title
    const matches = updated.match(/Exame do Estado Mental \(EEM\):?/gi);
    expect(matches).toHaveLength(1);

    // Preserves surrounding clinical notes
    expect(updated).toContain('PA 120/80 mmHg.');
    expect(updated).toContain('• PHQ-9 (Hoje): 18/27 pts.');
    expect(updated).toContain('Aparência e Higiene: cuidados pessoais e higiene adequados');
  });

  it('sanitizeDuplicateEemHeader cleans up stacked uppercase and title-case headers', () => {
    const textWithDuplicate = `EXAME DO ESTADO MENTAL (EEM):
Exame do Estado Mental (EEM):
Aparência e Higiene: higienizado.`;

    const cleaned = sanitizeDuplicateEemHeader(textWithDuplicate);
    expect(cleaned).toBe(`Exame do Estado Mental (EEM):
Aparência e Higiene: higienizado.`);
  });
});
