import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { parseKeyframeBlocks } from '../src/anim-studio/css-keyframes';
import * as keyframes from '../src/css/animation-keyframes';
import * as scenes from '../src/css/animation-scenes';
import * as extra from '../src/css/animation-extra';
import * as shared from '../src/css/scene-keyframes';

const require = createRequire(import.meta.url);
const { minify } = require('../tools/minify-templates-loader.cjs') as { minify: (s: string, f?: string) => string };
const CSS = path.resolve(__dirname, '../src/css');
const TABLES: Record<string, Record<string, unknown>> = {
  'animation-keyframes': keyframes,
  'animation-scenes': scenes,
  'animation-extra': extra,
  'scene-keyframes': shared,
};

/** Loads a table file as CommonJS after the loader has run over it; its imports of sibling tables get the shrunk text too. */
function loadMinified(name: string): Record<string, unknown> {
  const file = path.join(CSS, `${name}.ts`);
  const out = minify(readFileSync(file, 'utf8'), file);
  const js = ts.transpileModule(out, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  const mod = { exports: {} as Record<string, unknown> };
  new Function('exports', 'require', 'module', js)(mod.exports, (id: string) => loadMinified(id.replace('./', '')), mod);
  return mod.exports;
}

/** One declaration or selector fragment with the whitespace the minifier may drop, and the leading zero of decimals, normalised. */
const norm = (s: string): string =>
  s
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*([,>])\s*/g, '$1')
    .replace(/(^|[^\d.])0\.(\d)/g, '$1.$2');
const pieces = (body: string): string[] =>
  body
    .split(/[{};]/)
    .map((p) => norm(p.replace(/:\s+/g, ':')))
    .filter(Boolean);

describe('animation table mode of the template loader', () => {
  const file = path.join(CSS, 'animation-extra.ts');
  const src = 'export const T = {\n  a: `\n    0%, 100% { scale: 0.5; }\n    50% { content: "a   b"; }`,\n  b: `\n    left: 50%;  ${X}\n    top: 0;`,\n};\nconst s = `x   y`;';

  it('shrinks a plain template that is a property value, and keeps quoted text as written', () => {
    const out = minify(src, file);
    expect(out).toContain('a: `0%,100%{scale:.5}50%{content:"a   b"}`');
    expect(out).toContain('const s = `x   y`;');
  });

  it('shrinks each part of a template with ${} and keeps the code inside ${}', () => {
    const out = minify('const T = { b: `\n  left: 50%;  ${X + 1}\n  top: 0;` };', file);
    expect(out).toBe('const T = { b: ` left:50%;${X + 1} top:0;` };');
  });

  it('leaves a file that is not on the list alone', () => {
    expect(minify(src, path.join(CSS, 'popup.ts'))).toBe(src);
  });
});

describe('animation table minifier', () => {
  it('shrinks the tables and leaves the same keyframe blocks, declarations and particle styles', () => {
    let shrunk = 0;
    for (const [name, original] of Object.entries(TABLES)) {
      const min = loadMinified(name);
      for (const [exportName, table] of Object.entries(original)) {
        const minTable = min[exportName] as Record<string, string>;
        for (const [key, body] of Object.entries(table as Record<string, string>)) {
          expect(pieces(minTable[key]), `${name} ${exportName} ${key}`).toEqual(pieces(body));
          if (exportName.endsWith('KEYFRAMES')) {
            const blocks = (b: string) => parseKeyframeBlocks(b).map((x) => ({ offsets: x.offsets, decls: x.decls.map(([p, v]) => [p, norm(v)]) }));
            expect(blocks(minTable[key]), `${name} ${key} blocks`).toEqual(blocks(body));
          }
          shrunk += body.length - minTable[key].length;
        }
      }
    }
    expect(shrunk).toBeGreaterThan(3000);
  });

  it('keeps every key of every table', () => {
    for (const [name, original] of Object.entries(TABLES)) {
      const min = loadMinified(name);
      for (const [exportName, table] of Object.entries(original)) {
        expect(Object.keys(min[exportName] as object)).toEqual(Object.keys(table as object));
      }
    }
  });
});

describe('animationStyles', () => {
  it('is one sheet: static rules, then the generated keyframes and particle styles, then the reduced-motion block', async () => {
    const { animationStyles } = await import('../src/css/animations');
    const text = animationStyles.cssText;
    const rules = text.indexOf('[data-mc-anim~=\'module\']');
    const keyframes = text.indexOf('@keyframes mc-anim-breathe');
    const fx = text.indexOf('.mc-anim-fx[data-fx="');
    const reduced = text.indexOf('@media (prefers-reduced-motion: reduce)');
    expect(rules).toBeGreaterThan(-1);
    expect(keyframes).toBeGreaterThan(rules);
    expect(fx).toBeGreaterThan(keyframes);
    expect(reduced).toBeGreaterThan(fx);
    expect(text.indexOf('@media (prefers-reduced-motion', reduced + 1)).toBe(-1);
  });
});
