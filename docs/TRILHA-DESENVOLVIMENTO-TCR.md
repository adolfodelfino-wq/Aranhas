# Trilha de concepção, desenvolvimento e avaliação — Nexus Clínico

## Finalidade

Documentar a **concepção e construção inicial da aplicação**, sua evolução funcional e modificações selecionadas que podem ser demonstradas no código e nos registros técnicos. Diferenciar decisões de projeto reconstituídas retrospectivamente, mudanças efetivamente implementadas e resultados de verificações executadas.

O projeto **teve início em sua própria estruturação**, não a partir da avaliação de um software externo já pronto. O histórico do repositório documenta a montagem da aplicação web e seus componentes e posteriores modificações. Os casos abaixo são **exemplos selecionados de sua evolução**, porque evidenciam o vínculo requisito clínico → implementação → verificação. Não se exige que cada decisão inicial tenha sido registrada contemporaneamente: sua descrição retrospectiva deve ser compatível com os artefatos existentes e distinguida de entrevistas, testes ou outras atividades que não aconteceram. O histórico Git demonstra modificações; testes automatizados demonstram apenas comportamentos efetivamente exercitados.

## Marco inicial comprovável e exemplos selecionados de desenvolvimento

O commit `ad2b9deb9ac9`, descrito no Git como inicialização da aplicação, documenta a criação do projeto com Vite, Express, Tailwind CSS e a inclusão de diversos módulos da estação. Ele permite descrever a **construção da aplicação desde sua base técnica**, sem afirmar que todos os módulos foram escritos num único momento ou que o primeiro registro Git captura integralmente a fase anterior de concepção. O commit `6f9cca375459` documenta a modularização da síntese EEM em função reutilizável. Outras etapas posteriores incluem testes e aperfeiçoamentos específicos abaixo.

| Caso | Problema/requisito clínico | Mudança comprovável no código | Evidência da alteração | Verificação automatizada | Limites |
|---|---|---|---|---|---|
| DEV-01 — registro SOAP | Evitar que se registrem achados, diagnósticos ou condutas inexistentes quando um campo está vazio | `src/utils/pecFormatter.ts`: campos vazios passam a ser representados por **"Não registrado."**, sem normalidade presumida; códigos apenas mediante seleção | Commits `65f24d06edaf` e `b6a8f95945d4`; arquivo `src/__tests__/pecExport.test.ts` | `MRC-SOAP` SOAP-01 a SOAP-06; testes sintéticos de preservação, campos vazios e codificação | Não atesta precisão da anamnese inserida pelo médico nem integração automática com o PEC |
| DEV-02 — seleção semiestruturada do EEM | Evitar estado inicial preenchido como normal e prevenir descritores contraditórios ou inexistentes | `src/utils/eemSelection.ts` e componentes `EemView.tsx` e `EemSoapWorkstationView.tsx`: estado inicial vazio, identificadores padronizados, exclusões mútuas e acionamento explícito de preset | Commits `4e36c68dcde4`, `06015ac3f375`, `0a78718c2943` e `df63e7c3f19c` | `MRC-EEM` EEM-01, EEM-06 e EEM-10; reexecuções com logs vinculados ao commit | Testes unitários não comprovam, isoladamente, aplicação correta por usuários nem adequação semiológica de todas as opções |
| DEV-03 — integração EEM–SOAP | Evitar sobrescrita de informação clínica existente e importação de resultado de escala incompleto | Ajustes de proteção na estação em `src/components/EemSoapWorkstationView.tsx` e verificação do formatador em `src/utils/eemFormatter.ts` | Commits `fff8e2b49bb5` e `5dc997cb8381`; MRC-SOAP e MRC-EEM documentam os casos | SOAP-07, SOAP-08, EEM-08 e EEM-09: preservação de sinais vitais e resultado de escala em cenários sintéticos; substituição sem duplicação | Ainda faltam cenários de interface, importação entre atendimentos e possíveis fluxos não cobertos |

## Escalas: trajetória de implementação e verificação

O projeto incluiu progressivamente definições de escalas, funções de cálculo e validações, presentes no código da aplicação. A etapa atual acrescentou a **MRC-ESC** e verificações automatizadas delimitadas (26 verificações em rodada formativa). Isso evidencia que a trajetória do produto inclui **construção funcional e posterior auditoria**; não se deve apresentar os novos testes como se fossem os commits de criação original das escalas.

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
