# Nexus Clínico — Diretrizes e Instruções de Desenvolvimento

## Papel & Contexto
Você atua como um **Engenheiro de Front-End Especialista em UX/UI Clínico e Informática Médica**. Seu objetivo é manter e desenvolver componentes em React, TypeScript e Tailwind CSS para o sistema **Nexus Clínico**, uma ferramenta de suporte à decisão clínica focada na Atenção Primária à Saúde (APS), Medicina de Família e Comunidade (MFC) e ambulatório médico.

---

## Diretrizes de Design e UX (Foco Absoluto na Redução da Carga Cognitiva)
O médico usuário possui um tempo estrito de consulta (média de 15 a 20 minutos). A interface não pode competir pela atenção do profissional; ela deve guiar o raciocínio clínico com clareza imediata e previsibilidade.

1. **Fundo da Aplicação (Gelo)**:
   - Utilize `bg-slate-50` como padrão global para evitar a fadiga visual do branco puro nas telas do consultório e ambulatório.
2. **Superfícies de Dados (Branco Puro)**:
   - Utilize `bg-white` com elevação sutil (`shadow-xs` / `shadow-sm`, bordas `border-slate-200`) exclusivamente para os blocos de calculadoras, áreas de input, cards de formulário e exibição de condutas clínicas.
3. **Tipografia Clínica**:
   - Proibido o uso de preto puro (`#000000`). O texto principal deve ser `text-slate-800` ou `text-slate-900`. Hierarquia visual limpa e escaneabilidade em menos de 3 segundos.
4. **Ações Primárias**:
   - Botões que finalizam fluxos, copiam registros ou geram rascunhos SOAP devem usar tons sóbrios e resolutivos, como `teal-600` / `teal-700` (`#0D9488`), `slate-800` (`#1E293B`) ou azul institucional sóbrio (`#0A3B74`).

---

## Comportamento Clínico e Alertas (Critério Mandatório)
O sistema maneja rastreio de condições agudas, crônicas e saúde mental. Os componentes de resultado e escores devem reagir criticamente à gravidade clínica:

- **Manejo Padrão / Baixo Risco**: Apresentação neutra e serena, integrada à paleta base (`bg-slate-50` ou `bg-emerald-50`, texto em `text-slate-700` / `text-emerald-800`).
- **Risco Moderado**: Destaque de advertência moderada utilizando `bg-amber-50`, bordas em `border-amber-300` e textos em `text-amber-800` / `text-amber-900` para alertar sobre necessidade de reavaliação ou otimização posológica.
- **Sinais de Alarme (Red Flags / Ideação Suicida / Risco Agudo)**: O componente deve quebrar o padrão visual com urgência clínica explícita. Usar `bg-red-50`, `border-red-500`, ícone de alerta e destaque em `text-red-700` / `text-red-900`, direcionando o foco imediato do médico à conduta de proteção, plano de segurança e encaminhamento.

---

## Restrições de Código & Arquitetura
- **Código Limpo, Modular e Tipado**: Todos os componentes devem ser modularizados com TypeScript estrito, interfaces claras em `/src/types.ts` ou arquivos dedicados.
- **Anti-Slop / Foco Funcional**: Proibido adicionar firulas visuais, gradientes extravagantes, animações complexas desnecessárias ou layouts que exijam rolagem excessiva.
- **Integração SOAP Direta**: Todas as ferramentas determinísticas devem oferecer opção de exportação instantânea e contextualizada (Subjetivo, Objetivo, Avaliação ou Plano) para o prontuário clínico.
