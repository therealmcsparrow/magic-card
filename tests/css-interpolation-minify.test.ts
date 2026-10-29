import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { minify } = require('../tools/minify-templates-loader.cjs') as { minify: (s: string, f?: string) => string };

describe('production template minifier: css`` with ${} expressions', () => {
  it('shrinks the static parts and leaves every expression untouched', () => {
    const src = 'const a = css`\n  /* c */\n  .a ${sel}  {\n    color: ${c};\n    margin: 0.5em 0;\n  }\n`;';
    expect(minify(src)).toBe('const a = css`.a ${sel}{color:${c};margin:.5em 0}`;');
  });

  it('keeps one space wherever whitespace touched an expression', () => {
    expect(minify('const a = css`.a { margin: ${x}px ${y}px; }\n.b ${s} .c { top: 0 }`;')).toBe('const a = css`.a{margin:${x}px ${y}px}.b ${s} .c{top:0}`;');
    expect(minify('const a = css`${a}\n${b}`;')).toBe('const a = css`${a} ${b}`;');
  });

  it('never drops the leading zero of a decimal that follows an expression', () => {
    const src = 'const a = css`.a { width: ${n}0.5px; height: 0.5px; }`;';
    expect(minify(src)).toBe('const a = css`.a{width:${n}0.5px;height:.5px}`;');
  });

  it('leaves expression code with its own whitespace, comments and nested templates alone', () => {
    const src = 'const a = css`\n  .a {  color:  ${  pick( 1,  2 )  };  }\n  ${ css`\n  .b {  top: 0.5px;  }\n` }\n`;';
    const out = minify(src);
    expect(out).toContain('${  pick( 1,  2 )  }');
    expect(out).toContain('.b{top:.5px}');
  });

  it('keeps strings and url() as written', () => {
    const src = 'const a = css`.a { content: "a   ${1}  b"; background: url( x  y ) ${z}; }`;';
    expect(minify(src)).toBe('const a = css`.a{content:"a   ${1}  b";background:url( x  y ) ${z}}`;');
  });

  it('leaves a template unminified when an expression sits in a comment', () => {
    const src = 'const a = css`\n  /* ${gone} */\n  .a {  top: 0;  }\n`;';
    expect(minify(src)).toBe(src);
  });

  it('leaves a template unminified when its text already holds the placeholder marker', () => {
    const src = 'const a = css`\n  .mcph0000 {  top: 0;  }\n  ${x}\n`;';
    expect(minify(src)).toBe(src);
  });

  it('still gives the same value when the expressions are filled in', () => {
    const src = 'const a = css`\n  .a ${s} {\n    color: ${c};\n    margin: ${m} 0;\n  }\n  .b > ${t}, .c { top: 0 }\n`;';
    const fill = (code: string) => {
      const vals = ['S', 'C', 'M', 'T'];
      let i = 0;
      return code.replace(/\$\{[a-z]\}/g, () => vals[i++]);
    };
    const text = (code: string) => /css`([\s\S]*)`/.exec(code)![1];
    const norm = (t: string) => t.replace(/\s+/g, '').replace(/;}/g, '}');
    expect(norm(fill(text(minify(src))))).toBe(norm(fill(text(src))));
  });

  it('every ts file under src parses after minifying, and no template loses an expression', () => {
    const files = ['src/css/css.ts', 'src/css/editor-css.ts', 'src/css/popup.ts'];
    for (const f of files) {
      const src = readFileSync(path.resolve(__dirname, '..', f), 'utf8');
      const out = minify(src, f);
      const res = ts.transpileModule(out, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2021, experimentalDecorators: true } });
      expect(res.diagnostics?.length ?? 0, f).toBe(0);
      const count = (s: string) => (s.match(/\$\{/g) ?? []).length;
      expect(count(out), f).toBe(count(src));
    }
  });
});
