import { EEM_DOMAINS } from '../data/eemData';
import type { EemState } from '../types';

/**
 * Empty starting state. No normal clinical findings may be inferred from
 * an unexamined domain or from opening the EEM interface.
 */
export const getEmptyEemState = (): EemState => ({
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

/**
 * User-triggered preset only. Never apply it to an unevaluated patient
 * automatically: normal descriptors require explicit confirmation.
 */
export const getEuthymicEemPreset = (): EemState => ({
  aparencia: ['higienizado', 'vestuario_adequado', 'aparente_idade'],
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
  pensamentoConteudo: [],
  pensamentoOutros: '',
  sensopercepcao: ['senso_sem_alteracoes'],
  sensopercepcaoOutros: '',
  orientacao: ['orientado_global'],
  orientacaoOutros: '',
  atencaoMemoria: ['atencao_normoprosexica', 'memoria_preservada'],
  atencaoMemoriaOutros: '',
  insight: ['insight_preservado'],
  insightOutros: '',
  julgamento: ['julgamento_preservado'],
  julgamentoOutros: '',
  observacoesLivres: '',
});

/**
 * Pure transition for a clinician-selected descriptor.
 * Keeps domain selection consistent across the EEM views and does not infer
 * or auto-populate other domains.
 */
export const toggleEemSelection = (state: EemState, key: keyof EemState, optionId: string): EemState => {
  const domain = EEM_DOMAINS.find((d) => d.id === key);
  if (!domain || !domain.options.some((option) => option.id === optionId)) return state;

  const existing = Array.isArray(state[key]) ? (state[key] as string[]) : [];
  if (existing.includes(optionId)) {
    return { ...state, [key]: existing.filter((id) => id !== optionId) };
  }
  let selected = [...existing, optionId];

  const exclusiveNormal = (normal: string, altered: string[]) => {
    if (optionId === normal) {
      selected = selected.filter((id) => !altered.includes(id));
    } else if (altered.includes(optionId)) {
      selected = selected.filter((id) => id !== normal);
    }
  };

  switch (key) {
    case 'aparencia': {
      const pairs = [
        ['higienizado', 'desleixado'],
        ['vestuario_adequado', 'vestuario_extravagante'],
        ['aparente_idade', 'aparente_envelhecido'],
      ];
      for (const [a, b] of pairs) {
        if (optionId === a) selected = selected.filter((id) => id !== b);
        if (optionId === b) selected = selected.filter((id) => id !== a);
      }
      break;
    }
    case 'atitude':
      exclusiveNormal('cooperativo', ['desconfiado', 'hostil', 'inhibido', 'agita_psicomotora', 'seductor_teatral']);
      break;
    case 'fala':
      exclusiveNormal('fala_normal', ['fala_lentificada', 'fala_acelerada', 'fala_baixo_volume', 'fala_disartrica', 'mutismo']);
      if (optionId === 'fala_lentificada') selected = selected.filter((id) => id !== 'fala_acelerada');
      if (optionId === 'fala_acelerada') selected = selected.filter((id) => id !== 'fala_lentificada');
      break;
    case 'humor':
      exclusiveNormal('eutimico', ['distimico', 'ansioso', 'euforico', 'disforico', 'apatico']);
      break;
    case 'afeto':
      exclusiveNormal('normoemotivo', ['embotado', 'labil', 'incongruente', 'hipomodulado']);
      break;
    case 'pensamentoCurso':
      exclusiveNormal('curso_normopsiquico', ['curso_bradipsiquico', 'curso_taquipsiquico', 'curso_bloqueio']);
      if (optionId === 'curso_bradipsiquico') selected = selected.filter((id) => id !== 'curso_taquipsiquico');
      if (optionId === 'curso_taquipsiquico') selected = selected.filter((id) => id !== 'curso_bradipsiquico');
      break;
    case 'pensamentoForma':
      exclusiveNormal('forma_coerente', ['forma_circunstancial', 'forma_tangencial', 'forma_fuga_ideias', 'forma_frouxidao']);
      break;
    case 'pensamentoConteudo':
      exclusiveNormal('conteudo_sem_alteracoes', [
        'conteudo_ruminacoes', 'conteudo_ideias_obsessivas', 'conteudo_ideacao_suicida',
        'conteudo_delirio_perseguitorio', 'conteudo_delirio_grandeza', 'conteudo_delirio_ruina',
      ]);
      break;
    case 'sensopercepcao':
      exclusiveNormal('senso_sem_alteracoes', [
        'senso_alucinacao_auditiva', 'senso_alucinacao_visual', 'senso_ilusoes', 'senso_despersonalizacao',
      ]);
      break;
    case 'orientacao':
      if (optionId === 'orientado_global') {
        selected = ['orientado_global'];
      } else {
        selected = selected.filter((id) => id !== 'orientado_global');
        if (optionId === 'orientado_autopsiquica') {
          selected = selected.filter((id) => id !== 'desorientado_autopsiquica');
        }
        if (optionId === 'desorientado_autopsiquica') {
          selected = selected.filter((id) => id !== 'orientado_autopsiquica');
        }
      }
      break;
    case 'atencaoMemoria':
      if (optionId === 'atencao_normoprosexica') {
        selected = selected.filter((id) => id !== 'atencao_hipoprosexia' && id !== 'atencao_hiperprosexia');
      }
      if (optionId === 'atencao_hipoprosexia' || optionId === 'atencao_hiperprosexia') {
        selected = selected.filter((id) => id !== 'atencao_normoprosexica');
      }
      if (optionId === 'memoria_preservada') {
        selected = selected.filter((id) => id !== 'memoria_hipomnesia_fixacao' && id !== 'memoria_hipomnesia_evocacao');
      }
      if (optionId === 'memoria_hipomnesia_fixacao' || optionId === 'memoria_hipomnesia_evocacao') {
        selected = selected.filter((id) => id !== 'memoria_preservada');
      }
      break;
    case 'insight':
    case 'julgamento':
      selected = [optionId];
      break;
  }

  return { ...state, [key]: selected };
};
