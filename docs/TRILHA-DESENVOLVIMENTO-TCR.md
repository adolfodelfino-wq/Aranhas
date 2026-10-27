# Trilha de desenvolvimento e evidências do recorte acadêmico — Nexus Clínico

## Finalidade

Evidenciar **decisões e modificações efetivamente realizadas** na etapa de desenvolvimento incremental estudada, distinguindo-as das funcionalidades que já compunham o software e das verificações técnicas ou bibliográficas subsequentes.

O estudo não pressupõe que todos os módulos foram criados do zero durante a investigação. Os casos abaixo são **amostras intencionais, rastreáveis**, escolhidas porque documentam o vínculo requisito clínico → solução de programação → evidência automatizada. O histórico Git fornece evidência da modificação do código; testes automatizados fornecem evidência dos comportamentos testados, mas não demonstram usabilidade ou efetividade clínica.

## Casos selecionados de desenvolvimento

| Caso | Problema/requisito clínico | Mudança comprovável no código | Evidência da alteração | Verificação automatizada | Limites |
|---|---|---|---|---|---|
| DEV-01 — registro SOAP | Evitar que se registrem achados, diagnósticos ou condutas inexistentes quando um campo está vazio | `src/utils/pecFormatter.ts`: campos vazios passam a ser representados por **"Não registrado."**, sem normalidade presumida; códigos apenas mediante seleção | Commits `65f24d06edaf` e `b6a8f95945d4`; arquivo `src/__tests__/pecExport.test.ts` | `MRC-SOAP` SOAP-01 a SOAP-06; testes sintéticos de preservação, campos vazios e codificação | Não atesta precisão da anamnese inserida pelo médico nem integração automática com o PEC |
| DEV-02 — seleção semiestruturada do EEM | Evitar estado inicial preenchido como normal e prevenir descritores contraditórios ou inexistentes | `src/utils/eemSelection.ts` e componentes `EemView.tsx` e `EemSoapWorkstationView.tsx`: estado inicial vazio, identificadores padronizados, exclusões mútuas e acionamento explícito de preset | Commits `4e36c68dcde4`, `06015ac3f375`, `0a78718c2943` e `df63e7c3f19c` | `MRC-EEM` EEM-01, EEM-06 e EEM-10; reexecuções com logs vinculados ao commit | Testes unitários não comprovam, isoladamente, aplicação correta por usuários nem adequação semiológica de todas as opções |
| DEV-03 — integração EEM–SOAP | Evitar sobrescrita de informação clínica existente e importação de resultado de escala incompleto | Ajustes de proteção na estação em `src/components/EemSoapWorkstationView.tsx` e verificação do formatador em `src/utils/eemFormatter.ts` | Commits `fff8e2b49bb5` e `5dc997cb8381`; MRC-SOAP e MRC-EEM documentam os casos | SOAP-07, SOAP-08, EEM-08 e EEM-09: preservação de sinais vitais e resultado de escala em cenários sintéticos; substituição sem duplicação | Ainda faltam cenários de interface, importação entre atendimentos e possíveis fluxos não cobertos |

## Escalas: situação distinta dos casos de desenvolvimento

As sete escalas já estavam representadas por definições, funções de cálculo e validações no código examinado. Na etapa documentada, foram criadas a **MRC-ESC** e verificações automatizadas delimitadas (26 verificações em rodada formativa). Isso demonstra **instrumentação de teste e identificação de lacunas**, e não a criação original das sete escalas nesta etapa.

A revisão bibliográfica preliminar identificou divergências clínico-semânticas em MEEM, ASRS-18 e EPDS; as modificações clínicas correspondentes **ainda não foram executadas**. Não narrar como implementados novos pontos de corte, novos formulários ou recomendações revisadas antes que existam commits, fontes justificativas e reexecuções.

## Registros de verificação

- MRC-SOAP e MRC-EEM (18 verificações automatizadas na execução delimitada): https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40376917221 .
- MRC-SOAP, MRC-EEM e MRC-ESC (44 verificações automatizadas delimitadas): https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40439681470 .
- Os resultados são **formativos**, vinculados ao código efetivamente testado. O repositório principal e a branch de revisão não devem ser tratados como versões equivalentes enquanto não houver merge e validação.

## Regra de redação científica

Para cada exemplo destacado em Resultados:

1. Descrever **a necessidade clínica** e a decisão de projeto.
2. Afirmar apenas **a implementação demonstrável** pelo diff/commit.
3. Citar como resultado apenas **o comportamento exercitado e observado** em teste.
4. Registrar **o que a avaliação não demonstra**.
5. Não converter a existência do código em prova de uso, acurácia diagnóstica, benefício assistencial ou eficiência do fluxo.

**Escopo:** SOAP, EEM, sete escalas e integração. Calculadoras e outras funcionalidades ficam fora do TCR. Evitar datas desnecessárias na narrativa do artigo; datas e SHAs permanecem nos documentos técnicos de rastreabilidade.
