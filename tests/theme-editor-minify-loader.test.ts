import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const { minify } = require('../tools/minify-templates-loader.cjs') as { minify: (s: string, f?: string) => string };
const DIR = path.resolve(__dirname, '../src/theme-editor');
const walk = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.ts') ? [path.join(d, e.name)] : []));

describe('production template minifier (theme editor chunk size)', () => {
  it('collapses css whitespace, drops comments and the last semicolon', () => {
    const out = minify('const a = css`\n  /* c */\n  :host {\n    display: block;\n    color: red;\n  }\n  .a > .b, .c {\n    margin: 0 4px;\n  }\n`;');
    expect(out).toBe('const a = css`:host{display:block;color:red}.a>.b,.c{margin:0 4px}`;');
  });

  it('shrinks css with ${} expressions around the expressions', () => {
    const src = 'const a = css`\n  :host { color: ${x}; }\n`;';
    expect(minify(src)).toBe('const a = css`:host{color:${x}}`;');
  });

  it('collapses whitespace runs in html text but never touches ${} code, <pre> or other templates', () => {
    const src = 'const t = html`\n    <p>  a   b </p>\n    ${items.map((i) => {\n      return  i;\n    })}\n  `;\nconst s = `x   y`;';
    const out = minify(src);
    expect(out).toContain('<p> a b </p>');
    expect(out).toContain('return  i;\n    })');
    expect(out).toContain('const s = `x   y`;');
    const pre = 'const t = html`<pre>\n  keep   this\n</pre>`;';
    expect(minify(pre)).toBe(pre);
  });

  it('every theme editor source still parses after minifying, and has no whitespace-sensitive <pre> text', () => {
    for (const f of walk(DIR)) {
      const src = readFileSync(f, 'utf8');
      const out = minify(src, f);
      const res = ts.transpileModule(out, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2021, experimentalDecorators: true } });
      expect(res.diagnostics?.length ?? 0, path.relative(DIR, f)).toBe(0);
      for (const m of src.matchAll(/<pre[^>]*>([^<$]*)/g)) expect(m[1].trim(), `${path.relative(DIR, f)} has static <pre> text`).toBe('');
    }
  });
});

describe('production template minifier: size rules added with the preset dialog', () => {
  it('css drops the leading zero of decimals', () => {
    const out = minify('const a = css`.a { font-size: 0.875rem; margin: 10.5px 0 0.25em; opacity: 0.5; }`;');
    expect(out).toBe('const a = css`.a{font-size:.875rem;margin:10.5px 0 .25em;opacity:.5}`;');
  });

  it('html drops the space between two tags when one of them is a block element', () => {
    const out = minify('const t = html`<div class="a"> <p>x</p> </div> <span>a</span> <span>b</span>`;');
    expect(out).toBe('const t = html`<div class="a"><p>x</p></div><span>a</span> <span>b</span>`;');
  });

  it('html keeps the space between inline elements and next to ${} code', () => {
    const src = 'const t = html`<span>a</span> ${x} <button>b</button> <span>c</span>`;';
    expect(minify(src)).toBe(src);
  });

  it('html trims the edge of a block next to ${} and the space before the > of a tag', () => {
    const out = minify('const t = html`<div class="a" > ${x}   </div> <p>${y} </p> <span>${z} </span>`;');
    expect(out).toBe('const t = html`<div class="a">${x}</div><p>${y}</p><span>${z} </span>`;');
  });
});

describe('production template minifier: card sources', () => {
  it('leaves an html template part that sets white-space: pre* alone', () => {
    for (const v of ['pre', 'pre-wrap', 'pre-line']) {
      const h = `const t = html\`<div style="white-space: ${v}">  a   b  </div>\`;`;
      expect(minify(h)).toBe(h);
    }
    const h2 = 'const t = html`<p style="white-space:PRE-WRAP">a   b</p>`;';
    expect(minify(h2)).toBe(h2);
  });

  it('shrinks css that sets white-space: pre-wrap (the css source whitespace never reaches the page)', () => {
    expect(minify('const a = css`\n  .t {\n    white-space: pre-wrap;\n    color: red;\n  }\n`;')).toBe('const a = css`.t{white-space:pre-wrap;color:red}`;');
  });

  it('still shrinks white-space: normal and nowrap', () => {
    expect(minify('const a = css`.t { white-space: nowrap; }`;')).toBe('const a = css`.t{white-space:nowrap}`;');
  });

  it('copies quoted strings and url() in css as written', () => {
    const out = minify('const a = css`.a::after { content: "a,  b > c: d"; background: url("data:image/svg+xml,<svg a=\'1\' >"); }`;');
    expect(out).toBe('const a = css`.a::after{content:"a,  b > c: d";background:url("data:image/svg+xml,<svg a=\'1\' >")}`;');
  });

  it('an apostrophe in a css comment does not open a string, and the space around a url() stays', () => {
    const out = minify("const a = css`/* it's here, don't touch */ .a { background: url(x.svg) no-repeat; margin: 0 4px; }`;");
    expect(out).toBe('const a = css`.a{background:url(x.svg) no-repeat;margin:0 4px}`;');
  });

  // The DOM-diff does not see adopted style sheets, so the card's static css`` text is compared here: what the minifier
  // may change is whitespace, comments, a leading zero and the last semicolon of a block, nothing else.
  const flat = (css: string): string =>
    css
      .split(/(\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|url\([^)]*\))/)
      .map((p, i) => (i % 2 ? (p.startsWith('/*') ? '' : p) : p.replace(/\s+/g, '').replace(/;}/g, '}').replace(/(^|[^\d.])0\.(\d)/g, '$1.$2')))
      .join('');
  it.each(['card', 'css', 'modules'])('src/%s: every static css template differs from its source by whitespace only', (dir) => {
    const root = path.resolve(__dirname, '../src', dir);
    let seen = 0;
    for (const f of walk(root)) {
      const src = readFileSync(f, 'utf8');
      const out = minify(src, f);
      const tpl = (s: string): string[] => [...s.matchAll(/\bcss`([^`$]*)`/g)].map((m) => m[1]);
      const a = tpl(src);
      const b = tpl(out);
      expect(b.length, path.relative(root, f)).toBe(a.length);
      a.forEach((t, i) => {
        seen++;
        expect(flat(b[i]), path.relative(root, f)).toBe(flat(t));
      });
    }
    expect(seen).toBeGreaterThan(0);
  });
});
