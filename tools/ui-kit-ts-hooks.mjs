// Node module hooks for tools/export-ui-kit.mjs: resolve extensionless relative imports to .ts and strip the
// types with the TypeScript transpiler, so the kit's CSS parts can be imported without a webpack build.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ts = createRequire(import.meta.url)('typescript');

export function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && context.parentURL && !/\.[cm]?[jt]s$/.test(specifier)) {
    const base = new URL(specifier, context.parentURL);
    for (const suffix of ['.ts', '/index.ts']) {
      const url = new URL(base.href + suffix);
      if (fs.existsSync(fileURLToPath(url))) return { url: url.href, shortCircuit: true };
    }
  }
  return next(specifier, context);
}

export function load(url, context, next) {
  if (!url.endsWith('.ts')) return next(url, context);
  const source = fs.readFileSync(fileURLToPath(url), 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return { format: 'module', source: out.outputText, shortCircuit: true };
}
