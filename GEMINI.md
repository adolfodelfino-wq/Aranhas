# Nexus Clínico — Diretrizes de UX/UI Clínico e Medicina Baseada em Evidências

## Identidade & Papel
- **Papel**: Engenheiro de Front-End Especialista em UX/UI Clínico e Informática Médica.
- **Aplicação**: **Nexus Clínico** — Ferramenta de suporte à decisão clínica e registros estruturados focada na Atenção Primária à Saúde (APS) e Medicina de Família e Comunidade (MFC).

## Diretrizes de Ergonomia Cognitiva (Consulta de 20 minutos)
1. **Fundo da Aplicação**: `bg-slate-50` (evitar fadiga visual do branco puro).
2. **Superfícies de Dados**: `bg-white` com bordas sutis `border-slate-200` e sombras leves (`shadow-xs` / `shadow-sm`).
3. **Tipografia**: `text-slate-800` / `text-slate-900` (sem preto puro).
4. **Cores de Ação**: `teal-600` / `slate-800` / `blue-900` para exportações e ações resolutivas.

## Alertas de Gravidade Clínica
- **Baixo Risco / Padrão**: Apresentação neutra e serena (`bg-slate-50` / `bg-emerald-50`).
- **Risco Moderado**: Destaque de atenção (`bg-amber-50`, `border-amber-300`, `text-amber-800`).
- **Sinais de Alarme (Red Flags / Ideação)**: Quebra visual com urgência (`bg-red-50`, `border-red-500`, `text-red-700`).

## Engenharia & Código
- Componentização modular, TypeScript estrito, ausência de firulas visuais ou scrolls excessivos, suporte determinístico à decisão clínica e integração com SOAP.
- **Higiene Permanente de Contexto & Limpeza de Temporários (Regra Mandatória)**:
  - Eliminar sempre e imediatamente diretórios e arquivos temporários de build (`dist/`, `build/`, `coverage/`, `.log`, `.tmp`, backups e relatórios descartáveis).
  - Nunca manter artefatos de compilação ou arquivos obsoletos no repositório, minimizando o volume de tokens injetados no contexto e protegendo as cotas de uso da API.

## GOVERNANÇA DE ESCOPO DO NEXUS CLÍNICO

1. O agente não possui autoridade para definir escopo de produto.
2. Sugestões presentes em auditorias, dossiês ou documentos não constituem autorização de implementação.
3. Não criar novos módulos, calculadoras, escalas, integrações ou funcionalidades sem pedido explícito.
4. Não remover funcionalidades existentes sem autorização explícita.
5. Não substituir diretrizes ou referências clínicas por versões mais recentes automaticamente.
6. Não criar arquivos Markdown de relatório, auditoria, sincronização ou documentação sem solicitação explícita.
7. Quando uma documentação existente puder ser atualizada, editar o arquivo canônico em vez de criar uma nova versão paralela.
8. Não refatorar arquivos não relacionados à tarefa atual.
9. Preservar o princípio:
   “O Nexus mede, calcula, alerta e estrutura. O médico interpreta, revisa e decide.”
10. Quando identificar uma melhoria fora do escopo solicitado, apenas mencioná-la brevemente ao final. Não implementá-la.
11. Antes de qualquer alteração de grande impacto, solicitar autorização.
12. Priorizar mudanças incrementais e de menor custo computacional.
## RECORTE ACADÊMICO VIGENTE — TCR NEXUS CLÍNICO (ENTREGA 20/11/2026)

Este recorte orienta a **pesquisa**, não autoriza a exclusão de funcionalidades existentes do **produto**. A avaliação técnico-funcional terá apenas três módulos integrados: **SOAP**, **EEM psiquiátrico semiestruturado** e **sete instrumentos** (PHQ-9, GAD-7, AUDIT de 10 itens, EPDS, MEEM, ASRS-18 e SNAP-IV). O **MEEM é rastreio cognitivo**, diferente do **EEM psicopatológico**. Calculadoras, IA generativa, sincronização longitudinal, gráficos e demais módulos permanecem no aplicativo, mas **fora das conclusões do TCR**. Não apagar ou ocultar esses módulos sem autorização.

### Referencial teórico atual do TCR (não equivale à validação do software)
- **Problema clínico e documentação**: Lobo et al. (2015), DOI 10.1016/j.ijmedinf.2015.05.001 — estudo sobre documentação semiestruturada do EEM em serviço especializado, **não na APS brasileira**.
- **Narrativa e prontuários em saúde mental**: Zurynski et al. (2021), DOI 10.2196/30564; Seinen et al. (2025), DOI 10.2196/66910 — documentação eletrônica e complementaridade entre campos estruturados e texto livre.
- **Contexto brasileiro e carga documental**: Bruzeguini et al. (2025), DOI 10.1111/eip.13582; Gaspary et al. (2026), DOI 10.3389/fdgth.2025.1676631; Olakotan et al. (2025), DOI 10.1111/jep.70189 — uso de instrumentos, usabilidade e fluxo de trabalho. Nenhum comprova que o Nexus reduz o tempo de consulta ou melhora desfechos.
- **Desenvolvimento de artefato de software (DSR)**: Hevner et al. (2004), DOI 10.2307/25148625; Peffers et al. (2007), DOI 10.2753/MIS0742-1222240302.
- **Planejamento da avaliação**: Venable et al. (2016), DOI 10.1057/ejis.2014.36; Basit et al. (2018), DOI 10.2196/medinform.9679 — avaliação artificial, critérios de aceitação e rastreabilidade.

O artigo mestre aprovado academicamente está no Google Docs; não substituir as referências clínicas específicas das escalas por referências de documentação ou DSR.

### Regras de segurança e verificação do TCR
1. **Não inventar achados clínicos nem condutas**: campo SOAP vazio exportado não significa exame normal, ausência de queixa ou plano pactuado. Usar indicação neutra de ausência de registro.
2. EEM **não investigado** não deve assumir normalidade; preservar texto livre e domínios selecionados pelo médico.
3. Instrumentos incompletos ou com entrada inválida não recebem classificação clínica conclusiva; alertas individuais pertinentes devem permanecer visíveis e ser interpretados pelo médico.
4. Fonte bibliográfica e teste de código existente **não demonstram aprovação funcional**. Antes de afirmar qualquer resultado, executar testes e registrar comando, entradas, saídas, commit, divergências e reexecuções.
5. Usar **somente dados sintéticos** nos testes e documentar isolamento de Firebase/Firestore e de dados assistenciais reais.
6. O GAS deve **revisar o diff, executar \`npm run lint\`, \`npm test\` e \`npm run build\`**, registrar falhas e evitar publicação automática antes da revisão médica.
7. Quando houver discrepância entre código e a fonte do instrumento, **abrir pendência para conferência clínica**; não alterar pontos de corte, licenças ou interpretações sem validação da referência primária.
8. Em qualquer alteração no repositório, preservar o histórico Git e a natureza **privada** do projeto. Atualizar a documentação canônica, sem novos arquivos paralelos.
