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
| EEM-01 | Ausência de inferência quando vazio | EemState com todos os domínios e observações vazios | Indicar ausência de parâmetros selecionados, sem afirmar normalidade | src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-02 | Seleção restrita ao observado | Selecionar apenas “Humor: ansioso” | Conter ansiedade e não incluir aparência, afeto, orientação ou outros domínios não selecionados | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-03 | Diferenciação do pensamento | Informar curso, forma e conteúdo em seleções distintas | Conservar todos os descritores sob Pensamento, sem misturar ou omitir categorias | src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-04 | Achado negativo somente se selecionado | Selecionar somente “Sem alterações perceptivas” | Incluir exatamente a seleção de sensopercepção, sem presumir normalidade de outros domínios | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-05 | Preservação das observações livres | Preencher Observações complementares com texto sintético acentuado, quebras de linha | Texto preservado na síntese gerada, sem reescrita nem informações adicionais | src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-06 | Descritores desconhecidos ou inválidos | IDs inexistentes ou campo de seleção em formato inesperado | Não converter IDs em achados clínicos nem presumir normalidade | src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-07 | Preservação de achado sensível | Selecionar explicitamente ideação suicida no conteúdo do pensamento | Registrar o descritor selecionado, sem automaticamente estratificar risco ou definir conduta | src/data/eemData.ts; src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-08 | Integração no Objetivo | Objetivo com PA e FC; inserir síntese do EEM | Manter PA e FC, inserir único bloco de EEM | src/utils/eemFormatter.ts; src/components/EemSoapWorkstationView.tsx | Automatizada | Automatizado aprovado |
| EEM-09 | Substituição e preservação de outros dados | Reimportar EEM atualizado com escala já presente em Objetivo | Substituir descritores antigos sem apagar achados ou resultado de escala | src/utils/eemFormatter.ts | Automatizada | Automatizado aprovado |
| EEM-10 | Consistência dos controles visuais | Acionar Padrão Eutímico e selecionar achados incompatíveis em interface | Opções do padrão existem no catálogo; exclusão mútua evita descritores contraditórios; não se aplica preenchimento normal automático | src/components/EemSoapWorkstationView.tsx; src/components/EemView.tsx; src/data/eemData.ts | Inspeção técnica + interface | Regras automatizadas aprovadas; interface pendente |

## Registro inicial da inspeção do código — não é execução de cenário

Ao confrontar as opções cadastradas em src/data/eemData.ts com src/components/EemSoapWorkstationView.tsx, observaram-se identificadores potencialmente incompatíveis no preenchimento de “Padrão Eutímico” (por exemplo, humor_eutimico em vez de eutimico; afeto_modulado em vez de normoemotivo; curso_normal em vez de curso_normopsiquico; forma_logico em vez de forma_coerente). As regras de exclusão mútua também utilizam algumas dessas variantes. **Esta é uma divergência de inspeção estática**, pendente de reprodução no teste EEM-10; não classificar como falha executada antes da verificação.

O componente isolado EemView.tsx possui um estado inicial de normalidade quando não recebe eemState, devendo ser examinada sua exposição no aplicativo e a condição de uso; o estado EEM no App.tsx inicia com seleções vazias.

## Rodadas formativas executadas — evidência técnica

**R01 — geração e formatação textual do EEM (código anterior à correção do preset)**

- Commit: `adf9e1c1cfec62a666790db4002f641112840191`.
- Evidência: https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40375432785
- EEM-01 a EEM-09: **9/9 verificações automatizadas aprovadas**. Suíte geral: **133/133 testes aprovados**; build realizado.
- Inspeção do EEM-10 identificou IDs divergentes entre o preset da estação integrada e o catálogo. O problema foi classificado como **divergência documental do código (inspeção estática)**; não havia teste manual do botão, portanto não afirmar falha observada da interface.
- A checagem global de tipos retornou erro em calculadora farmacológica, **fora do recorte deste TCR**, não computado como falha de EEM.

**Correção controlada do EEM-10**

- Criado `src/utils/eemSelection.ts` com IDs do preset derivados do catálogo, transições puras e exclusão de descritores incompatíveis.
- `EemSoapWorkstationView.tsx` e `EemView.tsx` passaram a compartilhar a função de seleção; o padrão preenchido na estação integrada passou a usar os IDs existentes. A ação é explícita por clique, não representa normalidade inferida automaticamente.
- Novo teste EEM-10 verifica a consistência dos IDs e a exclusão mútua em função determinística.
- Testes manuais dos controles React permanecem necessários para concluir o cenário.

**R02 — reexecução após a correção**

- Commit: `06b475244244f7236da7e4d8f10486210c04dbcb`.
- Evidência: https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40376049655
- EEM-01 a EEM-10: **10/10 verificações automatizadas aprovadas**. Suíte geral: **134/134 testes aprovados**, build aprovado.
- Erro global de TypeScript permanece restrito à calculadora farmacológica e não foi incluído entre os resultados do EEM.
- **Pendente:** teste de interface (clique no padrão, marcação/desmarcação, atualização visível e importação pelo usuário), conferência do estado inicial do componente isolado e execução da rodada final em versão congelada.

**Interpretação:** R01 e R02 constituem evidências técnicas formativas com commits distintos. Não caracterizam validação clínica, aprovação dos cenários manuais ou efetividade assistencial.

## Rodada formativa R03 — escopo delimitado e estado inicial protegido

- Versão/commit: `8724d0d1e24d5cb6cf055ac9db6304e24d71d21e`.
- Evidência: https://github.com/adolfodelfino-wq/Aranhas/actions/runs/40376917221
- Foi corrigida a inicialização do componente EemView isolado: um estado sem informação começa vazio, sem descritores de normalidade. O preenchimento eutímico permanece disponível **somente por comando explícito do usuário**, sendo aplicado ao estado pelo mesmo mecanismo de atualização utilizado nas demais seleções.
- A rotina do GitHub Actions passou a executar apenas testes do TCR: **8 verificações MRC-SOAP + 10 MRC-EEM = 18/18 verificações automatizadas aprovadas**; build geral concluído.
- Diagnóstico global TypeScript apresenta pendência em calculadora farmacológica fora do recorte. Permanece documentado como observação de engenharia e **não é critério nem resultado do TCR**.
- Ainda pendentes: controles e importação em interface, avaliação de dados sintéticos com ambiente isolado, rodada final congelada.
- Não relatar como aprovação de 10 cenários EEM completos enquanto a parte manual do EEM-10 não estiver testada.

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

**Interpretação:** as dez verificações automatizadas foram aprovadas após a correção, porém a MRC-EEM somente estará concluída após verificar os controles na interface, documentar evidências e executar a rodada final sobre uma versão definida.
