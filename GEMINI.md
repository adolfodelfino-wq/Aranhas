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
