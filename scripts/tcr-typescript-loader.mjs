import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

// Permite executar as verificações isoladas com Node 24, sem alterar o código
// de produção nem confundir esta execução com a suíte Vitest do projeto.
export async function resolve(specifier, context, nextResolve) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    try { return await nextResolve(`${specifier}.ts`, context); } catch {}
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith('file:') || !url.endsWith('.ts')) return nextLoad(url, context);
  let source = await readFile(new URL(url), 'utf8');
  source = source.replace(/import\s+(?!type\b)(\{[^}]+\})\s+from\s+(['"])(?:\.\.\/)+types\2;/g, 'import type $1 from $2../types$2;');
  return { format: 'module', source: stripTypeScriptTypes(source, { mode: 'strip', sourceUrl: url }), shortCircuit: true };
}
