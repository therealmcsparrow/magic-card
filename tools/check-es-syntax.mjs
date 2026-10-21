// Emitted-syntax gate. The browser floor is Chromium 85, so every shipped dist/*.js
// must be ES2021, and must not call the built-ins that arrived after it. Minifiers and bundler runtimes can write syntax the
// source never had, and tsc does not check DOM or newer built-ins, so this reads the output.
//
// 1. Syntax. Every dist .js is parsed with acorn at ecmaVersion 2021, sourceType "module" (HA loads magic-card.js as a module
//    script, the entries use import.meta, and the chunks are ES modules). If that fails, the file is parsed again at 2022 and
//    walked: class fields and private members (marked, swiper and js-yaml ship them; Chromium 72-84 runs them) are accepted,
//    and everything else that is new in ES2022 is rejected: StaticBlock (Chromium 94), `#x in o` (91), top-level await (89)
//    and the regex `d` flag (90). A file that fails both parses, or fails the walk, is an error.
// 2. Built-ins. A token scan (acorn tokens, so strings and comments never match) counts `.at(`, `Object.hasOwn`,
//    `structuredClone` and `.findLast(` / `.findLastIndex(`. On magic-card.js and every card chunk any use fails, because
//    the card runs on the oldest browser. On the editor side (studio, theme editor, editor chunks) the counts start from
//    tools/es-syntax-debt.json ({file, token, count}): a count above the recorded one fails, a count below it fails too (lower
//    the number, so the debt only shrinks), and with a base ref the debt file may not grow against it.
//    One guarded use is accepted: magic-card-markdown.js holds marked, which calls `.at(` and `Object.hasOwn`, and the same
//    chunk defines both when missing (polyfillForMarked in src/modules/content/markdown-view.ts). The scan
//    accepts those two tokens there only while the chunk still holds the polyfill's property names as string literals.
//
// Usage: node tools/check-es-syntax.mjs [--dist <dir>] [--debt <file>] [--print-debt] [--no-base | --require-base]
//        node tools/check-es-syntax.mjs --self-test      run the rules against synthetic files
// Env:   ES_SYNTAX_BASE  git ref whose tools/es-syntax-debt.json the debt may not grow against.
//        Default run (local): ES_SYNTAX_BASE or origin/main, skipped with a note when missing.
//        --require-base (CI): ES_SYNTAX_BASE must be set and must resolve to a commit that holds the file, or the check fails.
//        --no-base: no growth check (the release workflow; the validate workflow does it).
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';

const ROOT = resolve(fileURLToPath(new URL('../', import.meta.url)));
const DEBT_REL = 'tools/es-syntax-debt.json';

/** Editor-side files: the animation studio, the theme editor and the card editor with the chunks only it loads. Everything else is the card. */
const EDITOR_SIDE = /^magic-card-(animation-studio|theme-editor|editor|icon-library|layer-editor|look-editor|path-canvas|path-tools|shape-editor|svg-editor|transfer)\.js$/;
export const isEditorSide = (name) => EDITOR_SIDE.test(name);

/** Accepted guarded uses: file -> tokens -> string literals the file must still hold (the polyfill's property names). */
const GUARDED = { 'magic-card-markdown.js': { '.at(': ['at'], 'Object.hasOwn': ['hasOwn'] } };

/** The content hash of a chunk name, if any, is not part of the key: magic-card-x.1a2b3c4d.js -> magic-card-x.js */
export const keyOf = (name) => name.replace(/\.[0-9a-f]{8}\.js$/, '.js');

const nodeChildren = (n) => Object.values(n).flatMap((v) => (Array.isArray(v) ? v.filter((x) => x && typeof x.type === 'string') : v && typeof v.type === 'string' ? [v] : []));

/** ES2022-only syntax that Chromium 85 cannot run, found in an AST that parsed at 2022. Class fields and private members are fine. */
export const es2022Problems = (ast) => {
  const out = [];
  const visit = (n, fnDepth) => {
    switch (n.type) {
      case 'StaticBlock':
        out.push(`class static block at ${n.start}`);
        break;
      case 'BinaryExpression':
        if (n.operator === 'in' && n.left.type === 'PrivateIdentifier') out.push(`#${n.left.name} in ... at ${n.start}`);
        break;
      case 'AwaitExpression':
        if (fnDepth === 0) out.push(`top-level await at ${n.start}`);
        break;
      case 'ForOfStatement':
        if (n.await && fnDepth === 0) out.push(`top-level for await at ${n.start}`);
        break;
      case 'Literal':
        if (n.regex && n.regex.flags.includes('d')) out.push(`regex d flag at ${n.start}`);
        break;
    }
    const fn = n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression';
    for (const c of nodeChildren(n)) visit(c, fn ? fnDepth + 1 : fnDepth);
  };
  visit(ast, 0);
  return out;
};

const parseWith = (source, ecmaVersion) => {
  const tokens = [];
  const ast = acorn.parse(source, { ecmaVersion, sourceType: 'module', onToken: tokens });
  return { ast, tokens };
};

/** Counts of the post-floor built-ins in a token list, plus the string literals (for the guard check). */
export const scanTokens = (tokens) => {
  const counts = {};
  const strings = new Set();
  const add = (k) => (counts[k] = (counts[k] ?? 0) + 1);
  const dot = (t) => t && (t.type.label === '.' || t.type.label === '?.');
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type.label === 'string') strings.add(t.value);
    if (t.type.label !== 'name') continue;
    const prev = tokens[i - 1];
    const next = tokens[i + 1];
    if (t.value === 'at' && dot(prev) && next?.type.label === '(') add('.at(');
    else if (t.value === 'hasOwn' && dot(prev) && tokens[i - 2]?.value === 'Object') add('Object.hasOwn');
    else if (t.value === 'structuredClone') add('structuredClone');
    else if ((t.value === 'findLast' || t.value === 'findLastIndex') && dot(prev)) add('.findLast(');
  }
  return { counts, strings };
};

/**
 * Pure rule. files: Map<name, source>. debt: [{file, token, count}]. baseDebt: the same from the base ref, or null.
 * Returns { errors, notes }.
 */
export const evaluate = ({ files, debt, baseDebt = null }) => {
  const errors = [];
  const notes = [];
  const recorded = new Map(debt.map((d) => [`${d.file}\u0000${d.token}`, d.count]));
  if (recorded.size !== debt.length) errors.push(`${DEBT_REL}: duplicate (file, token) entries`);
  for (const d of debt) {
    if (!isEditorSide(d.file)) errors.push(`${DEBT_REL}: ${d.file} is not an editor-side file, the card side has no debt`);
    if (!Number.isInteger(d.count) || d.count < 1) errors.push(`${DEBT_REL}: ${d.file} ${d.token} count must be a positive integer (delete the entry at 0)`);
  }
  if (baseDebt) {
    const base = new Map(baseDebt.map((d) => [`${d.file}\u0000${d.token}`, d.count]));
    for (const d of debt) {
      const was = base.get(`${d.file}\u0000${d.token}`);
      if (was === undefined) errors.push(`${DEBT_REL}: new entry ${d.file} ${d.token} (the debt list only shrinks)`);
      else if (d.count > was) errors.push(`${DEBT_REL}: ${d.file} ${d.token} went from ${was} to ${d.count} (the debt list only shrinks)`);
    }
  }
  const seen = new Set();
  const measured = [];
  for (const [name, source] of [...files].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const key = keyOf(name);
    seen.add(key);
    let parsed;
    try {
      parsed = parseWith(source, 2021);
    } catch (e21) {
      try {
        parsed = parseWith(source, 2022);
        const bad = es2022Problems(parsed.ast);
        if (bad.length) {
          errors.push(`${name}: ES2022 syntax Chromium 85 cannot run: ${bad.slice(0, 5).join('; ')}${bad.length > 5 ? ` (+${bad.length - 5} more)` : ''}`);
          continue;
        }
        notes.push(`${name}: parses at 2022 only (${e21.message}); accepted, it holds class fields or private members and no other ES2022 syntax`);
      } catch {
        errors.push(`${name}: does not parse as ES2021 (${e21.message})`);
        continue;
      }
    }
    const { counts, strings } = scanTokens(parsed.tokens);
    const guards = GUARDED[key] ?? {};
    for (const [token, needs] of Object.entries(guards)) {
      if (counts[token] === undefined) continue;
      if (needs.every((s) => strings.has(s))) {
        notes.push(`${name}: ${counts[token]} x ${token} accepted, guarded by the polyfill held in the same chunk`);
        delete counts[token];
      }
    }
    for (const [token, count] of Object.entries(counts)) {
      if (isEditorSide(key)) {
        measured.push({ file: key, token, count });
        const have = recorded.get(`${key}\u0000${token}`) ?? 0;
        if (count > have) errors.push(`${name}: ${count} x ${token}, the recorded debt is ${have} (editor side may not add uses of post-Chromium-85 built-ins)`);
      } else {
        errors.push(`${name}: ${count} x ${token}, a built-in newer than Chromium 85 (hard gate on the card side)`);
      }
    }
  }
  for (const d of debt) {
    if (!isEditorSide(d.file)) continue;
    const m = measured.find((x) => x.file === d.file && x.token === d.token);
    if (!seen.has(d.file)) errors.push(`${DEBT_REL}: ${d.file} is not in the dist any more, delete its entries`);
    else if ((m?.count ?? 0) < d.count) errors.push(`${DEBT_REL}: ${d.file} ${d.token} is down to ${m?.count ?? 0} from ${d.count}, lower the number (delete the entry at 0)`);
  }
  if (files.size === 0) errors.push('no .js files to check');
  return { errors, notes, measured };
};

const readJs = (dir) => new Map(readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => [f, readFileSync(join(dir, f), 'utf8')]));

const readDebt = (file) => {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(j.entries)) throw new Error(`${file}: "entries" must be an array`);
  return j.entries;
};

const baseDebtFromGit = (required) => {
  const ref = process.env.ES_SYNTAX_BASE || (required ? '' : 'origin/main');
  if (!ref) {
    console.error('FAIL --require-base needs ES_SYNTAX_BASE (the PR base branch or the commit before the push)');
    process.exit(1);
  }
  try {
    return JSON.parse(execFileSync('git', ['show', `${ref}:${DEBT_REL}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })).entries ?? null;
  } catch {
    if (required) {
      console.error(`FAIL base ${ref} does not resolve to a commit with ${DEBT_REL}`);
      process.exit(1);
    }
    console.log(`note: no ${DEBT_REL} at ${ref}, the growth check is skipped`);
    return null;
  }
};

const selfTest = () => {
  let failed = 0;
  const run = (label, files, debt, expect, baseDebt = null) => {
    const { errors } = evaluate({ files: new Map(Object.entries(files)), debt, baseDebt });
    const ok = expect === 'pass' ? errors.length === 0 : errors.some((e) => e.includes(expect));
    if (!ok) {
      failed++;
      console.error(`self-test FAILED: ${label}: expected ${expect === 'pass' ? 'no errors' : `an error with "${expect}"`}, got ${JSON.stringify(errors)}`);
    }
  };
  const ok = 'export const a = (x) => x?.y ?? 1; let b; b ||= 2; const n = 1_000;';
  const card = 'magic-card-slider.js';
  const editor = 'magic-card-editor.js';
  run('plain ES2021', { 'magic-card.js': ok }, [], 'pass');
  run('class fields (marked, swiper, js-yaml)', { [card]: 'class A{static d;x=1;#p=2;#m(){return this.#p}}new A' }, [], 'pass');
  run('static block', { [card]: 'class A{static{}}' }, [], 'ES2022 syntax');
  run('#x in o', { [card]: 'class A{#p;static h(o){return #p in o}}' }, [], 'ES2022 syntax');
  run('top-level await', { [card]: 'await 1;' }, [], 'ES2022 syntax');
  run('await inside async function is ES2017', { [card]: 'export const f=async()=>{await 1}' }, [], 'pass');
  run('regex d flag', { [card]: 'export const r=/a/d' }, [], 'ES2022 syntax');
  run('syntax error', { [card]: 'let = = ;' }, [], 'does not parse');
  run('.at( in the entry', { 'magic-card.js': `${ok} [1].at(0)` }, [], '.at(');
  run('.at( in a card chunk', { [card]: '[1].at(0)' }, [], 'hard gate');
  run('?.at( in a card chunk', { [card]: 'const x=[];x?.at(0)' }, [], 'hard gate');
  run('Object.hasOwn', { [card]: 'Object.hasOwn({}, "a")' }, [], 'Object.hasOwn');
  run('structuredClone', { [card]: 'structuredClone({})' }, [], 'structuredClone');
  run('findLast', { [card]: '[].findLast(Boolean); [].findLastIndex(Boolean)' }, [], '.findLast(');
  run('a method named at that is not called is fine', { [card]: 'const o={at:1}; o.at' }, [], 'pass');
  run('strings and comments do not count', { [card]: '/* .at(0) structuredClone */ const s=".at(0) Object.hasOwn(x) structuredClone"' }, [], 'pass');
  run('markdown chunk with its polyfill', { 'magic-card-markdown.js': 'if(!Object.hasOwn)d(Object,"hasOwn",f);if(!Array.prototype.at)d(Array.prototype,"at",g);[1].at(-1);Object.hasOwn({},"a")' }, [], 'pass');
  run('markdown chunk without its polyfill', { 'magic-card-markdown.js': '[1].at(-1);Object.hasOwn({},"a")' }, [], 'hard gate');
  run('polyfill does not excuse another chunk', { [card]: 'd(Array.prototype,"at",g);[1].at(-1)' }, [], 'hard gate');
  run('editor side: use within debt', { [editor]: 'structuredClone({});structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 2 }], 'pass');
  run('editor side: one use over the debt', { [editor]: 'structuredClone({});structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 1 }], 'recorded debt is 1');
  run('editor side: new token not in debt', { [editor]: '[1].at(0)' }, [], 'recorded debt is 0');
  run('editor side: debt not lowered', { [editor]: 'structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 2 }], 'lower the number');
  run('editor side: debt for a file that is gone', { 'magic-card.js': ok }, [{ file: editor, token: 'structuredClone', count: 1 }], 'not in the dist any more');
  run('debt on a card file is refused', { [card]: ok }, [{ file: card, token: 'structuredClone', count: 1 }], 'no debt');
  run('debt grew against the base', { [editor]: 'structuredClone({});structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 2 }], 'only shrinks', [{ file: editor, token: 'structuredClone', count: 1 }]);
  run('debt entry added against the base', { [editor]: 'structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 1 }], 'new entry', []);
  run('debt same as base', { [editor]: 'structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 1 }], 'pass', [{ file: editor, token: 'structuredClone', count: 1 }]);
  run('hashed chunk name is keyed without the hash', { 'magic-card-editor.1a2b3c4d.js': 'structuredClone({})' }, [{ file: editor, token: 'structuredClone', count: 1 }], 'pass');
  run('no files', {}, [], 'no .js files');
  if (failed) {
    console.error(`${failed} self-test case(s) failed`);
    process.exit(1);
  }
  console.log('es-syntax self-test passed');
};

const main = () => {
  const args = process.argv.slice(2);
  const opt = (name) => {
    const i = args.indexOf(name);
    return i === -1 ? undefined : args[i + 1];
  };
  if (args.includes('--self-test')) return selfTest();
  const dist = opt('--dist') ?? join(ROOT, 'dist');
  const debtFile = opt('--debt') ?? join(ROOT, DEBT_REL);
  const files = readJs(dist);
  if (args.includes('--print-debt')) {
    const { measured } = evaluate({ files, debt: [] });
    console.log(JSON.stringify(measured.filter((m) => isEditorSide(m.file)), null, 2));
    return;
  }
  const debt = readDebt(debtFile);
  const baseDebt = opt('--debt') || args.includes('--no-base') ? null : baseDebtFromGit(args.includes('--require-base'));
  const { errors, notes } = evaluate({ files, debt, baseDebt });
  for (const n of notes) console.log(`note: ${n}`);
  if (errors.length) {
    for (const e of errors) console.error(`FAIL ${e}`);
    console.error(`es-syntax: ${errors.length} problem(s) in ${files.size} file(s)`);
    process.exit(1);
  }
  console.log(`ok   ${files.size} dist .js files parse as ES2021 (class fields tolerated), no post-Chromium-85 built-ins beyond the recorded editor-side debt (${debt.reduce((a, d) => a + d.count, 0)} uses)`);
};

main();
