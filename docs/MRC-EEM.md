# MRC-EEM v1.0 — Matriz de Rastreabilidade de Critérios

**Objeto:** Exame do Estado Mental (EEM) psiquiátrico semiestruturado, geração textual e sua incorporação ao campo Objetivo do SOAP.  
**Método:** avaliação técnico-funcional preliminar de instanciação de software, com casos inteiramente sintéticos.  
**Nota metodológica:** MRC é abreviatura operacional de Matriz de Rastreabilidade de Critérios, utilizada neste TCR. Não significa validação clínica, psicométrica ou de usabilidade. O Mini-Exame do Estado Mental (MEEM) é uma escala cognitiva distinta deste módulo.

## Critérios gerais

- Definir entradas e resultados esperados antes da execução e manter evidências associadas ao commit testado.
- Não preencher domínios não examinados com “normal”, “preservado” ou achados equivalentes.
- Apenas opções *explicitamente selecionadas* pelo profissional podem produzir descritores clínicos.
- Preservar observações livres, sinais vitais, escores já presentes e outros registros preexistentes.
- Não inferir diagnóstico, risco suicida ou decisão terapêutica a partir da geração textual.
- Itens incompatíveis do mesmo domínio não devem aparecer simultaneamente como achados válidos.
- O botão “Padrão Eutímico”, quando acionado, é um preenchimento **explícito** pelo usuário; seus IDs devem corresponder ao catálogo real. Não implica que o exame esteja normal antes do clique.
- Testes de função determinística não demonstram o comportamento completo de interface. Registrar parte manual separadamente.

## Cenários especificados (todos definidos antes da execução)

| ID | Requisito | Entrada sintética / procedimento | Resultado esperado | Código relacionado | Modalidade | Estado |
|---|---|---|---|---|---|---|
| EEM-01 | Ausência de inferência quando vazio | EemState com todos os domínios e observações vazios | Indicar ausência de parâmetros selecionados, sem afirmar normalidade | src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-02 | Seleção restrita ao observado | Selecionar apenas “Humor: ansioso” | Conter ansiedade e não incluir aparência, afeto, orientação ou outros domínios não selecionados | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-03 | Diferenciação do pensamento | Informar curso, forma e conteúdo em seleções distintas | Conservar todos os descritores sob Pensamento, sem misturar ou omitir categorias | src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-04 | Achado negativo somente se selecionado | Selecionar somente “Sem alterações perceptivas” | Incluir exatamente a seleção de sensopercepção, sem presumir normalidade de outros domínios | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-05 | Preservação das observações livres | Preencher Observações complementares com texto sintético acentuado, quebras de linha | Texto preservado na síntese gerada, sem reescrita nem informações adicionais | src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-06 | Descritores desconhecidos ou inválidos | IDs inexistentes ou campo de seleção em formato inesperado | Não converter IDs em achados clínicos nem presumir normalidade | src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-07 | Preservação de achado sensível | Selecionar explicitamente ideação suicida no conteúdo do pensamento | Registrar o descritor selecionado, sem automaticamente estratificar risco ou definir conduta | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-08 | Integração no Objetivo | Objetivo com PA e FC; inserir síntese do EEM | Manter PA e FC, inserir único bloco de EEM | src/utils/eemFormatter.ts; src/components/EemSoapWorkstationView.tsx | Automatizada | Pendente |
| EEM-09 | Substituição e preservação de outros dados | Reimportar EEM atualizado com escala já presente em Objetivo | Substituir descritores antigos sem apagar achados ou resultado de escala | src/utils/eemFormatter.ts | Automatizada | Pendente |
| EEM-10 | Consistência dos controles visuais | Acionar Padrão Eutímico e selecionar achados incompatíveis em interface | Opções do padrão existem no catálogo; exclusão mútua evita descritores contraditórios; não se aplica preenchimento normal automático | src/components/EemSoapWorkstationView.tsx; src/components/EemView.tsx; src/data/eemData.ts | Inspeção técnica + interface | Pendente |

## Registro inicial da inspeção do código — não é execução de cenário

Ao confrontar as opções cadastradas em src/data/eemData.ts com src/components/EemSoapWorkstationView.tsx, observaram-se identificadores potencialmente incompatíveis no preenchimento de “Padrão Eutímico” (por exemplo, humor_eutimico em vez de eutimico; afeto_modulado em vez de normoemotivo; curso_normal em vez de curso_normopsiquico; forma_logico em vez de forma_coerente). As regras de exclusão mútua também utilizam algumas dessas variantes. **Esta é uma divergência de inspeção estática**, pendente de reprodução no teste EEM-10; não classificar como falha executada antes da verificação.

O componente isolado EemView.tsx possui um estado inicial de normalidade quando não recebe eemState, devendo ser examinada sua exposição no aplicativo e a condição de uso; o estado EEM no App.tsx inicia com seleções vazias.

## Registro de rodada

- Rodada / finalidade: pendente
- Branch e SHA de avaliação: pendente
- Ambiente Node/Vitest/navegador e isolamento de serviços externos: pendente
- Dados: somente sintéticos
- Testes automatizados: pendente
- Inspeção e testes manuais (EEM-10): pendente
- Conformes / não conformes / bloqueados / não executados: pendente
- Evidência (log/captura sem dados reais): pendente
- Correções, commits e reexecuções: pendente

**Interpretação:** mesmo que os nove cenários automatizados estejam conformes, a MRC-EEM não estará integralmente concluída enquanto EEM-10 e a revisão do fluxo real estiverem pendentes.
