import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateHealthEducationSuggestions as run } from '../src/utils/healthEducationEngine.ts';
import { getEmptyEemState } from '../src/utils/eemSelection.ts';
import { PHQ9_SCALE, GAD7_SCALE } from '../src/data/scalesData.ts';

const eem = (changes = {}) => ({ ...getEmptyEemState(), ...changes });
const answers = (n, selected = {}) => Object.fromEntries(
  Array.from({ length: n }, (_, i) => [`q${i + 1}`, selected[`q${i + 1}`] ?? 0])
);
const result = (scale, values) => scale.calculateResult(values);
const summary = (scale, values) => scale.questions.map((question) => ({
  questionText: question.text, value: values[question.id] ?? 0, answerLabel: 'sintético',
}));
const sleep = (out) => out.suggestions.find((s) => s.id === 'sug-sono');

test('nenhum achado não aciona alerta ou sugestão específica de sono', () => {
  const out = run([], eem());
  assert.equal(out.hasHighRiskWarning, false);
  assert.equal(sleep(out), undefined);
});

for (const text of ['Paciente nega insônia.', 'Sem queixas de sono.', 'Refere sono preservado.', 'Nega dificuldade para dormir.']) {
  test(`texto livre não é interpretado automaticamente: ${text}`, () => {
    assert.equal(sleep(run([], eem({ observacoesLivres: text }))), undefined);
  });
}

test('texto livre positivo também não é interpretado automaticamente', () => {
  assert.equal(sleep(run([], eem({ observacoesLivres: 'Refere insônia frequente.' }))), undefined);
});

test('humor ansioso e GAD-7 elevado não são atribuídos a alteração de sono', () => {
  const gad = result(GAD7_SCALE, answers(7, { q1: 3, q2: 3, q3: 3 }));
  assert.equal(sleep(run([gad], eem({ humor: ['ansioso'], atitude: ['agita_psicomotora'] }))), undefined);
});

test('PHQ-9 elevado com item 3 negativo não aciona sugestão de sono', () => {
  const phq = result(PHQ9_SCALE, answers(9, { q1: 3, q2: 3, q3: 0 }));
  assert.equal(sleep(run([phq], eem({ humor: ['distimico'] }))), undefined);
});

test('resposta positiva ao item 3 no histórico aciona sugestão com origem no PHQ-9', () => {
  const phq = result(PHQ9_SCALE, answers(9, { q3: 2 }));
  const found = sleep(run([phq], eem()));
  assert.ok(found);
  assert.deepEqual(found.matchedSources, ['PHQ-9 (resposta ao item 3 sobre sono)']);
  assert.equal(found.isComboMatch, false);
});

test('resposta positiva ao item 3 no resumo aciona sugestão de sono', () => {
  const values = answers(9, { q3: 1 });
  const phq = { ...result(PHQ9_SCALE, values), answersArray: undefined, answersSummary: summary(PHQ9_SCALE, values) };
  assert.ok(sleep(run([phq], eem())));
});

test('ideação selecionada no conteúdo do pensamento aciona aviso prioritário', () => {
  assert.equal(run([], eem({ pensamentoConteudo: ['conteudo_ideacao_suicida'] })).hasHighRiskWarning, true);
});

test('outro conteúdo de pensamento não aciona aviso de ideação', () => {
  assert.equal(run([], eem({ pensamentoConteudo: ['conteudo_ruminacoes'] })).hasHighRiskWarning, false);
});

test('ideação apenas em texto livre não é interpretada automaticamente', () => {
  assert.equal(run([], eem({ observacoesLivres: 'Relata pensamentos de morte.' })).hasHighRiskWarning, false);
});

test('item 9 positivo no histórico aciona aviso mesmo sem resumo das respostas', () => {
  const phq = result(PHQ9_SCALE, answers(9, { q9: 1 }));
  assert.equal(phq.answersSummary, undefined);
  assert.equal(run([phq], eem()).hasHighRiskWarning, true);
});

test('alerta crítico preservado no resultado aciona aviso mesmo sem array', () => {
  const phq = { ...result(PHQ9_SCALE, answers(9, { q9: 1 })), answersArray: undefined };
  assert.equal(run([phq], eem()).hasHighRiskWarning, true);
});

test('item 9 positivo no resumo de escala incompleta aciona aviso', () => {
  const values = { q9: 1 };
  const phq = { ...result(PHQ9_SCALE, values), answersSummary: summary(PHQ9_SCALE, values) };
  assert.equal(phq.isComplete, false);
  assert.equal(run([phq], eem()).hasHighRiskWarning, true);
});

test('item 9 negativo com sintomas nos outros itens não aciona aviso de ideação', () => {
  const phq = result(PHQ9_SCALE, answers(9, { q1: 3, q2: 3, q9: 0 }));
  assert.equal(run([phq], eem()).hasHighRiskWarning, false);
});

test('humor distímico e PHQ-9 mantêm sugestão combinada', () => {
  const phq = result(PHQ9_SCALE, answers(9, { q1: 2, q2: 2, q3: 2 }));
  const suggestion = run([phq], eem({ humor: ['distimico'] })).suggestions.find((s) => s.id === 'sug-depressao-rotina');
  assert.equal(suggestion?.isComboMatch, true);
});
