import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AboutModal } from '../components/AboutModal';
import { ALL_EVIDENCE_REFERENCES, TCR_EVIDENCE_REFERENCES } from '../data/evidenceData';

describe('Escopo de evidências do TCR', () => {
  it('inclui PHQ-9, GAD-7 e referências de apoio, mantendo os instrumentos complementares no acervo geral', () => {
    const tcrIds = TCR_EVIDENCE_REFERENCES.map((reference) => reference.id);
    const allIds = ALL_EVIDENCE_REFERENCES.map((reference) => reference.id);

    expect(tcrIds).toEqual(expect.arrayContaining([
      'phq9-kroenke-osorio',
      'gad7-spitzer-moreno',
      'cssrs-posner',
      'dalgalarrondo-semiologia-psicopatologia',
      'tcr-peffers-2007',
    ]));
    for (const id of ['audit-oms-mendez', 'meem-folstein-brucki', 'asrs18-kessler-mattos', 'snap4-swanson-mattos', 'leucht-2015-mean-dose']) {
      expect(allIds).toContain(id);
      expect(tcrIds).not.toContain(id);
    }
  });

  it('abre o modal com as fichas do TCR e oferece acesso ao acervo geral', () => {
    const markup = renderToStaticMarkup(<AboutModal initialTab="evidencias" onClose={() => {}} />);

    expect(markup).toContain('SOAP, EEM, PHQ-9 e GAD-7.');
    expect(markup).toContain(`Escopo do TCR (${TCR_EVIDENCE_REFERENCES.length})`);
    expect(markup).toContain(`Acervo geral (${ALL_EVIDENCE_REFERENCES.length})`);
    expect(markup).not.toContain('The Alcohol Use Disorders Identification Test');
  });
});
