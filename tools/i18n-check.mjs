// Drift check D1-D9 (contracts src/contracts/i18n.ts 2.0.0 and i18n-keys.ts). Run as `npm run i18n -- --check` or
// `node tools/check-i18n.mjs [--ci] [--strict] [--verbose] [--update-baseline] [--placement]`.
//   D1 every id is a string literal; a text that is not a key and a tc() call are errors; a key matches the key pattern, starts with its namespace and is in en-GB.json
//   D2 every id has en-US and nl entries with the same arguments
//   D3 en-GB spelling                    D4 en-US.json equals the generator output
//   D5 no hard-coded user text (ratchet) D6 every message parses     D7 runtime size, import scan and
//   placement (which bundle holds the runtime, the tables and each namespace's call sites; reads the
//   production build's module list, node_modules/.cache/magic-card/i18n-stats.json, written by webpack.config.js;
//   --placement requires it and runs after `npm run build`, without it the placement part is skipped)
//   D8 every en-GB.json entry has a note, a max and the vars its text needs; no text is over max; the files are sorted
//   D9 a translation made from other English is stale unless i18n/waivers.json holds a waiver for the key and the
//   current hash; waivers for an unknown key, an old hash or with no reason fail
// Namespaces whose status in I18N_MODULES is 'pending' report D2 as warnings. --strict (or
// I18N_RELEASE_STRICT in the contract) makes them errors, requires every namespace to be
// 'complete' and every D5 baseline to be 0. --ci adds GitHub annotations. Exit 1 on any error.
// --base <commit>: a key is touched when it is new against that commit or its en-GB text differs from it; D2 and D9 on touched keys
// are errors even where they would be warnings. Untouched keys keep their level. Without --base the output is unchanged.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { run as checkUS } from './i18n-us.mjs';
import { placement } from './i18n/placement.mjs';
const require = createRequire(import.meta.url);
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');
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

/** The keys of a catalogue that are new against the base catalogue (a Map, or null when the base has none) or whose en-GB text differs. */
export function touchedKeys(gb, baseGb) {
  const out = new Set();
  for (const [key, e] of gb) {
    const was = baseGb?.get(key);
    if (was === undefined || was?.text !== e?.text) out.add(key);
  }
  return out;
}

/** Turns the D2 and D9 warnings about a touched key into errors. */
export function escalateTouched(results, ns, touched) {
  const head = `${ns} "`;
  return results.map((r) => {
    if (r.level !== 'warn' || (r.rule !== 'D2' && r.rule !== 'D9') || !r.msg.startsWith(head)) return r;
    return touched.has(r.msg.slice(head.length, r.msg.indexOf('"', head.length))) ? { ...r, level: 'error' } : r;
  });
}

function git(args) {
  return execFileSync('git', args, { cwd: lib.ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 });
}

/** The commit a --base value names, or '' when it is not a commit. */
function resolveBase(value) {
  if (!value || value.startsWith('-')) return '';
  try {
    return git(['rev-parse', '--verify', '--quiet', `${value}^{commit}`]).trim();
  } catch {
    return '';
  }
}

/** The en-GB catalogue of a namespace folder at the base commit as a Map, or null when the commit has none. */
function baseCatalogue(commit, dir) {
  let raw;
  try {
    raw = git(['show', `${commit}:${lib.rel(path.join(dir, 'en-GB.json'))}`]);
  } catch {
    return null;
  }
  return new Map(Object.entries(JSON.parse(raw)));
}

export async function main(argv = process.argv.slice(2)) {
  const flags = new Set(argv);
  const placementOnly = flags.has('--placement');
  const contract = lib.loadContract();
  const strict = flags.has('--strict') || contract.I18N_RELEASE_STRICT === true || process.env.I18N_RELEASE_STRICT === '1';
  const ci = flags.has('--ci') || process.env.CI === 'true';
  const verbose = flags.has('--verbose');
  let baseCommit = '';
  const baseAt = argv.findIndex((a) => a === '--base' || a.startsWith('--base='));
  if (baseAt >= 0) {
    const value = argv[baseAt].startsWith('--base=') ? argv[baseAt].slice(7) : argv[baseAt + 1];
    baseCommit = resolveBase(value);
    if (!baseCommit) {
      console.error(`${ci ? '::error::' : 'FAIL '}base ${value ?? ''} does not resolve to a commit (shallow checkout or wrong ref)`);
      return 1;
    }
  }
  let touchedCount = 0;
  const errors = [];
  const warnings = [];
  const err = (rule, msg) => errors.push(`${rule} ${msg}`);
  const warn = (rule, msg) => warnings.push(`${rule} ${msg}`);

  const { keys: keyUses, violations, nsList } = lib.extractAll();
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
      if (ns === 'mcu-panel') continue; // lives in the Magic Card Utils repository
      if (e.status !== 'complete') err('D2', `${ns}: status is '${e.status}', the release gate needs 'complete'`);
      if (!nsList.some((n) => n.ns === ns)) err('D2', `${ns}: no src/<folder>/i18n folder yet`);
    }
  }

  const keyCatalogues = new Map();
  const waivers = keys.readWaivers();
  for (const p of waivers.problems) err('D9', p);
  for (const n of nsList) {
    const pending = modules[n.ns]?.status !== 'complete' && !strict;
    let cat;
    try {
      cat = keys.loadCatalogues(n.dir);
    } catch (e) {
      err('D8', `${n.ns}: ${e.message}`);
      continue;
    }
    if (!cat.has) {
      for (const [key, sites] of keyUses.get(n.ns)) err('D1', `${n.ns} "${key}" is a key but the namespace has no en-GB.json (${sites[0].file}:${sites[0].line})`);
      continue;
    }
    keyCatalogues.set(n.ns, cat);
    let results = keys.checkNamespace({ ns: n.ns, cat, uses: keyUses.get(n.ns), waivers: waivers.waivers, pending, strict, spelling: (t) => spellingErrors(contract, t) });
    if (baseCommit) {
      const touched = touchedKeys(cat.gb, baseCatalogue(baseCommit, n.dir));
      touchedCount += touched.size;
      results = escalateTouched(results, n.ns, touched);
    }
    for (const r of results) (r.level === 'warn' ? warn : err)(r.rule, r.msg);
  }

  // D4
  for (const r of checkUS({ check: true })) if (!r.ok) err('D4', `${r.ns}: out of date, run npm run i18n and review the diff`);
  const exceptions = lib.readJson(path.join(lib.ROOT, 'tools/i18n/en-US-exceptions.json'), {});
  const all = new Set();
  for (const cat of keyCatalogues.values()) for (const e of cat.gb.values()) if (typeof e?.text === 'string') all.add(e.text);
  for (const k of Object.keys(exceptions)) {
    if (!all.has(k)) err('D4', `en-US-exceptions.json: "${k}" is not an en-GB text`);
    else if (lib.usText(k, contract.EN_US_WORDS) === exceptions[k]) err('D4', `en-US-exceptions.json: "${k}" equals the word-list result, remove the exception`);
  }

  // D9 waivers
  for (const m of keys.checkWaivers(waivers.waivers, keyCatalogues.values())) err('D9', m.replace(/^D9 /, ''));

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
      if (/contracts\/i18n(-keys)?$/.test(spec) && !st.importClause?.isTypeOnly) err('D7', `${r}: imports a value from the i18n contract (tools only; use import type)`);
      if (/\.gen$/.test(spec) && !/\/i18n\/index\.ts$|^src\/card\/pause-i18n\/index\.ts$|^src\/i18n\/labels\/(index|mark)\.ts$/.test(r)) err('D7', `${r}: imports a messages.gen table (only src/<folder>/i18n/index.ts, src/card/pause-i18n/index.ts and src/i18n/labels/{index,mark}.ts may)`);
    }
  }

  // D7 placement from the production build's module list (skipped when no build has run)
  const pl = placement(contract, nsList, { required: false });
  for (const e of pl.errors) err('D7', e.replace(/^D7 /, ''));
  for (const n of pl.notes) console.log(n);

  for (const w of warnings) console.warn(`${ci ? '::warning::' : 'warn '}${w}`);
  for (const e of errors) console.error(`${ci ? '::error::' : 'FAIL '}${e}`);
  if (baseCommit) console.log(`i18n check: base ${baseCommit.slice(0, 8)}, ${touchedCount} touched keys`);
  console.log(`i18n check: ${nsList.length} namespaces, ${errors.length} errors, ${warnings.length} warnings${strict ? ' (strict)' : ' (non-strict)'}`);
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
          const txt = m[1].replaceAll('\0', ' ');
          if (userText(txt)) hit(file, line(n), `text "${txt.trim().slice(0, 40)}"`);
        }
        for (const tag of joined.matchAll(/<[a-z][^<>]*>/gi)) {
          for (const a of tag[0].matchAll(/\s(\.?[a-z][\w-]*)="([^"]*)"/gi)) {
            if (attrs.has(a[1].replace(/^\./, '')) && userText(a[2].replaceAll('\0', ' '))) hit(file, line(n), `${a[1]}="${a[2].slice(0, 30)}"`);
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
