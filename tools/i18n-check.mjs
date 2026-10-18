// Drift check D1-D7 (contract src/contracts/i18n.ts 1.0.0 r3). Run as `npm run i18n -- --check` or
// `node tools/check-i18n.mjs [--ci] [--strict] [--verbose] [--update-baseline] [--placement]`.
//   D1 every id is a string literal      D2 every id has en-US and nl entries with the same arguments
//   D3 en-GB spelling                    D4 en-US.json equals the generator output
//   D5 no hard-coded user text (ratchet) D6 every message parses     D7 runtime size, import scan and
//   placement (which bundle holds the runtime, the tables and each namespace's call sites; reads the
//   production build's module list, node_modules/.cache/magic-card/i18n-stats.json, written by webpack.config.js;
//   --placement requires it and runs after `npm run build`, without it the placement part is skipped)
// Namespaces whose status in I18N_MODULES is 'pending' report D2 as warnings. --strict (or
// I18N_RELEASE_STRICT in the contract, on from slice I11) makes them errors, requires every namespace to be
// 'complete' and every D5 baseline to be 0. --ci adds GitHub annotations. Exit 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { run as checkUS } from './i18n-us.mjs';
import { placement, STATS_FILE } from './i18n/placement.mjs';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const ts = require('typescript');

const BASELINE = path.join(lib.ROOT, 'tools/i18n/baseline.json');
const ALLOW = lib.readJson(path.join(lib.ROOT, 'tools/i18n/allow.json'), {});
const COMMON_ISE = [
  'rise', 'arise', 'raise', 'praise', 'noise', 'poise', 'promise', 'precise', 'concise', 'otherwise', 'likewise', 'wise', 'exercise',
  'enterprise', 'expertise', 'premise', 'surprise', 'disguise', 'advise', 'revise', 'devise', 'supervise', 'compromise', 'comprise',
  'franchise', 'merchandise', 'treatise', 'paradise', 'demise', 'cruise', 'bruise', 'televise', 'improvise', 'excise', 'incise', 'despise',
  'rises', 'raises', 'promises', 'exercises', 'advises', 'surprises', 'revises', 'noises', 'risen', 'rising', 'raising', 'arising',
  'surprised', 'surprising', 'advised', 'revised', 'promised', 'exercised', 'raised', 'praised', 'compromised', 'supervised', 'risk',
];
const COMMON_OUR = ['our', 'ours', 'your', 'yours', 'hour', 'hours', 'four', 'tour', 'tours', 'pour', 'flour', 'sour', 'devour', 'detour', 'contour', 'scour'];
const OK = new Set([...(ALLOW.britishWords ?? []), ...COMMON_ISE, ...COMMON_OUR].map((w) => w.toLowerCase()));

/** D3 on one en-GB text: the messages for American forms and unlisted -ise/-our words. Also used for the MCU panel (tools/i18n-mcu.mjs). */
export function spellingErrors(contract, text) {
  const out = [];
  const { EN_US_WORDS } = contract;
  const usForms = new Set(Object.values(EN_US_WORDS));
  for (const tok of text.match(/[A-Za-z]+(?:[-_][A-Za-z]+)*/g) ?? []) {
    if (OK.has(tok.toLowerCase())) continue;
    for (const part of tok.toLowerCase().split(/[-_]/)) {
      if (OK.has(part)) continue;
      if (usForms.has(part)) out.push(`"${tok}" is American, write the British form`);
      else if (part.length > 4 && !(part in EN_US_WORDS) && /(ise|ised|ises|ising|isation|isations|our|ours)$/.test(part))
        out.push(`"${tok}" ends in -ise/-isation/-our but is not in EN_US_WORDS; add the pair to the contract list, or allow it in tools/i18n/allow.json`);
    }
  }
  return out;
}

export async function main(argv = process.argv.slice(2)) {
  const flags = new Set(argv);
  const placementOnly = flags.has('--placement');
  const contract = lib.loadContract();
  const strict = flags.has('--strict') || contract.I18N_RELEASE_STRICT === true || process.env.I18N_RELEASE_STRICT === '1';
  const ci = flags.has('--ci') || process.env.CI === 'true';
  const verbose = flags.has('--verbose');
  const errors = [];
  const warnings = [];
  const err = (rule, msg) => errors.push(`${rule} ${msg}`);
  const warn = (rule, msg) => warnings.push(`${rule} ${msg}`);

  const { ids, ctxIds, violations, nsList } = lib.extractAll();
  const modules = contract.I18N_MODULES;
  if (placementOnly) {
    const out = placement(contract, nsList, { required: true });
    for (const e of out.errors) console.error(`${ci ? '::error::' : 'FAIL '}${e}`);
    for (const n of out.notes) console.log(n);
    console.log(`i18n placement: ${out.errors.length} errors`);
    return out.errors.length ? 1 : 0;
  }

  // D1
  for (const v of violations) err('D1', `${v.file}:${v.line} ${v.fn}(): ${v.reason}`);

  // strict: every namespace of the contract is complete and has an i18n folder
  if (strict) {
    for (const [ns, e] of Object.entries(modules)) {
      if (ns === 'mcu-panel') continue; // lives in the Magic Card Utils repository (slice I9)
      if (e.status !== 'complete') err('D2', `${ns}: status is '${e.status}', the release gate needs 'complete'`);
      if (!nsList.some((n) => n.ns === ns)) err('D2', `${ns}: no src/<folder>/i18n folder yet`);
    }
  }

  for (const n of nsList) {
    const pending = modules[n.ns]?.status !== 'complete' && !strict;
    const report = pending ? warn : err;
    const set = ids.get(n.ns);
    const us = lib.catalogue(n, 'en-US.json');
    const nl = lib.catalogue(n, 'nl.json');
    const ctx = ctxIds.get(n.ns);
    const text = (id) => (ctx.has(id) ? id.slice(ctx.get(id).length + 1) : id);

    for (const id of lib.sortedIds(set)) {
      const base = lib.parseMessage(text(id));
      if (base.error) err('D6', `${n.ns} "${id}" (en-GB): ${base.error}`);
      for (const [loc, table] of [['en-US', us], ['nl', nl]]) {
        const v = table[id];
        if (typeof v !== 'string' || v.trim() === '') {
          report('D2', `${n.ns} "${id}": no ${loc} entry`);
          continue;
        }
        const p = lib.parseMessage(v);
        if (p.error) err('D6', `${n.ns} "${id}" (${loc}): ${p.error}`);
        else if (!base.error && lib.argSig(p.args) !== lib.argSig(base.args)) report('D2', `${n.ns} "${id}" (${loc}): arguments differ (${lib.argNames(p.args)} vs ${lib.argNames(base.args)})`);
      }
      // D3 spelling of the en-GB id
      for (const m of spellingErrors(contract, text(id))) err('D3', `${n.ns} "${id}": ${m}`);
    }
    for (const k of Object.keys(us)) if (!set.has(k)) err('D2', `${n.ns} en-US.json: stale entry "${k}"`);
    for (const k of Object.keys(nl)) if (!set.has(k)) report('D2', `${n.ns} nl.json: stale entry "${k}"`);
  }

  // D4
  for (const r of checkUS({ check: true })) if (!r.ok) err('D4', `${r.ns}: out of date, run npm run i18n and review the diff`);
  const exceptions = lib.readJson(path.join(lib.ROOT, 'tools/i18n/en-US-exceptions.json'), {});
  const all = new Set([...ids.values()].flatMap((s) => [...s]));
  for (const k of Object.keys(exceptions)) {
    if (!all.has(k)) err('D4', `en-US-exceptions.json: "${k}" is not an extracted id`);
    else if (lib.usText(k, contract.EN_US_WORDS, {}) === exceptions[k]) err('D4', `en-US-exceptions.json: "${k}" equals the word-list result, remove the exception`);
  }

  // D5
  const counts = scanHardCoded(contract, nsList, verbose);
  const base = lib.readJson(BASELINE, {});
  if (flags.has('--update-baseline')) {
    fs.writeFileSync(BASELINE, lib.stableJson(Object.fromEntries(Object.keys(counts).sort().map((k) => [k, counts[k].n]))));
    console.log('i18n: D5 baseline written');
  } else {
    for (const [k, c] of Object.entries(counts)) {
      const b = strict ? 0 : base[k];
      if (b === undefined) err('D5', `${k}: ${c.n} hard-coded texts and no baseline entry (npm run i18n -- --check --update-baseline)`);
      else if (c.n > b) err('D5', `${k}: ${c.n} hard-coded texts, baseline ${b}; wrap new text in t() (see --verbose for places)`);
      else if (c.n < b) warn('D5', `${k}: ${c.n} hard-coded texts, baseline ${b}; lower the baseline (--update-baseline)`);
      if (verbose && c.where.length) for (const w of c.where.slice(0, +(process.env.I18N_WHERE || 40))) console.log(`  D5 ${k} ${w}`);
    }
  }

  // D7
  const rt = await runtimeBytes();
  if (rt > contract.I18N_RUNTIME_MAX_BYTES) err('D7', `src/i18n/runtime.ts minifies to ${rt} B > ${contract.I18N_RUNTIME_MAX_BYTES} B`);
  else console.log(`i18n: runtime.ts ${rt} B minified (cap ${contract.I18N_RUNTIME_MAX_BYTES} B)`);
  for (const f of lib.listSourceFiles()) {
    const r = lib.rel(f);
    if (r.startsWith('src/contracts/')) continue;
    const src = fs.readFileSync(f, 'utf8');
    if (!/contracts\/i18n|\.gen['"]/.test(src)) continue;
    const sf = ts.createSourceFile(f, src, ts.ScriptTarget.ES2021, false);
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
      const spec = st.moduleSpecifier.text;
      if (/contracts\/i18n$/.test(spec) && !st.importClause?.isTypeOnly) err('D7', `${r}: imports a value from the i18n contract (tools only; use import type)`);
      if (/\.gen$/.test(spec) && !/\/i18n\/index\.ts$/.test(r)) err('D7', `${r}: imports a messages.gen table (only src/<folder>/i18n/index.ts may)`);
    }
  }

  // D7 placement from the production build's module list (skipped when no build has run)
  const pl = placement(contract, nsList, { required: false });
  for (const e of pl.errors) err('D7', e.replace(/^D7 /, ''));
  for (const n of pl.notes) console.log(n);

  for (const w of warnings) console.warn(`${ci ? '::warning::' : 'warn '}${w}`);
  for (const e of errors) console.error(`${ci ? '::error::' : 'FAIL '}${e}`);
  console.log(`i18n check: ${nsList.length} namespaces, ${errors.length} errors, ${warnings.length} warnings${strict ? ' (strict)' : ' (non-strict until I11)'}`);
  return errors.length ? 1 : 0;
}

async function runtimeBytes() {
  const { minify } = require('terser');
  const src = fs.readFileSync(path.join(lib.SRC, 'i18n/runtime.ts'), 'utf8');
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2021 } }).outputText;
  const out = await minify(js, { module: true, compress: { passes: 2 }, mangle: true });
  return Buffer.byteLength(out.code ?? '', 'utf8');
}

const hasLetters = (s) => /[A-Za-z]{2,}/.test(s.replace(/&#?\w+;/g, ' '));
const ALLOWED_TEXT = new Set(ALLOW.text ?? []);

/** D5: counts of hard-coded user text per namespace folder bucket. */
function scanHardCoded(contract, nsList, verbose) {
  const cfg = lib.readJson(path.join(lib.ROOT, 'tools/i18n/config.json'), { namespaces: {} }).namespaces;
  const roots = Object.entries(cfg).flatMap(([ns, c]) => c.roots.map((r) => [r, ns])).sort((a, b) => b[0].length - a[0].length);
  const bucket = (file) => roots.find(([r]) => file === r || file.startsWith(r + '/'))?.[1] ?? '_other';
  const attrs = new Set(contract.SCANNED_ATTRIBUTES.map((a) => a.replace(/^\./, '')));
  const props = new Set(contract.SCANNED_PROPERTIES);
  const counts = {};
  const hit = (file, line, what) => {
    const k = bucket(file);
    const c = (counts[k] ||= { n: 0, where: [] });
    c.n++;
    if (verbose) c.where.push(`${file}:${line} ${what}`);
  };
  // the string tables `const S = { ... }` (svg editor, shape editor) and `const T = { ... }` (path tools): any key counts
  const inTable = (n) => {
    const o = n.parent;
    let d = o && ts.isObjectLiteralExpression(o) ? o.parent : undefined;
    while (d && (ts.isAsExpression(d) || ts.isSatisfiesExpression(d) || ts.isParenthesizedExpression(d))) d = d.parent;
    return !!d && ts.isVariableDeclaration(d) && ts.isIdentifier(d.name) && (d.name.text === 'S' || d.name.text === 'T');
  };
  const userText = (s) => hasLetters(s) && !ALLOWED_TEXT.has(s.trim());
  const propText = (s) => userText(s) && (/\s/.test(s.trim()) || /^[A-Z]/.test(s.trim())) && !/^[A-Z0-9_]+$/.test(s.trim());
  for (const f of lib.listSourceFiles()) {
    if (!lib.isScanned(f)) continue;
    const file = lib.rel(f);
    if (file.startsWith('src/ui-kit/css') || /\/i18n\//.test(file)) continue;
    const source = fs.readFileSync(f, 'utf8');
    const sf = ts.createSourceFile(f, source, ts.ScriptTarget.ES2021, true, ts.ScriptKind.TS);
    const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
    const visit = (n) => {
      if (ts.isTaggedTemplateExpression(n) && ts.isIdentifier(n.tag) && (n.tag.text === 'html' || n.tag.text === 'svg')) {
        const t = n.template;
        const parts = ts.isNoSubstitutionTemplateLiteral(t) ? [t.text] : [t.head.text, ...t.templateSpans.map((s) => s.literal.text)];
        const joined = parts.join('\u0000').replace(/<!--[\s\S]*?-->/g, '').replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, '');
        for (const m of joined.matchAll(/(?:^|>)([^<>]*)(?=<|$)/g)) {
          const txt = m[1].replace(/\u0000/g, ' ');
          if (userText(txt)) hit(file, line(n), `text "${txt.trim().slice(0, 40)}"`);
        }
        for (const tag of joined.matchAll(/<[a-z][^<>]*>/gi)) {
          for (const a of tag[0].matchAll(/\s(\.?[a-z][\w-]*)="([^"]*)"/gi)) {
            if (attrs.has(a[1].replace(/^\./, '')) && userText(a[2].replace(/\u0000/g, ' '))) hit(file, line(n), `${a[1]}="${a[2].slice(0, 30)}"`);
          }
        }
      } else if (ts.isPropertyAssignment(n) && (ts.isIdentifier(n.name) || ts.isStringLiteral(n.name)) && (props.has(n.name.text) || inTable(n))) {
        const v = n.initializer;
        if ((ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) && propText(v.text)) hit(file, line(n), `${n.name.text}: "${v.text.slice(0, 30)}"`);
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  for (const n of nsList) counts[n.ns] ||= { n: 0, where: [] };
  return counts;
}

if (process.argv[1]?.endsWith('i18n-check.mjs')) process.exit(await main());
