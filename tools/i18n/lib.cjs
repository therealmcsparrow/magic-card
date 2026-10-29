/*
 * Shared code of the i18n tools (contracts src/contracts/i18n.ts 2.0.0 and i18n-keys.ts): contract loading,
 * source scan (t / tx / m calls found through the imports of a namespace's i18n folder; a call whose first argument
 * is not a key is a D1 violation), messages.gen.ts writer, en-US generator, message validator. The key
 * catalogues, hashes, tables and types are in tools/i18n/keys.cjs. CommonJS so the webpack pre-loader
 * (tools/i18n-loader.cjs) and the .mjs tools use the same code.
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'src');

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/** The constants of a contract file (TypeScript with no imports: transpile and run it). */
function loadContractFile(name) {
  const src = fs.readFileSync(path.join(SRC, 'contracts', name), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', out)(mod, mod.exports);
  return mod.exports;
}
let contractCache;
const loadContract = () => (contractCache ||= loadContractFile('i18n.ts'));
let keysContractCache;
const loadKeysContract = () => (keysContractCache ||= loadContractFile('i18n-keys.ts'));

const readJson = (p, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

const config = () => readJson(path.join(__dirname, 'config.json'), { namespaces: {} }).namespaces;

/** Namespaces whose i18n folder exists: [{ ns, dir (absolute), roots }]. */
function activeNamespaces() {
  return Object.entries(config())
    .map(([ns, c]) => ({ ns, dir: path.join(ROOT, c.dir), roots: c.roots }))
    .filter((n) => fs.existsSync(path.join(n.dir, 'index.ts')));
}

function listSourceFiles(dir = SRC, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listSourceFiles(p, out);
    else if (p.endsWith('.ts') && !p.endsWith('.d.ts') && !p.endsWith('.gen.ts')) out.push(p);
  }
  return out;
}

const SKIP_DIRS = ['src/i18n/', 'src/contracts/'];
const isScanned = (file) => !SKIP_DIRS.some((d) => rel(file).startsWith(d));

/** tc is no longer exported by any namespace; a call of it is still found so that it is reported (D1). */
const FNS = new Set(['t', 'tc', 'tx', 'm']);
/** lm() (src/i18n/labels/mark.ts) is m() for the 'labels' namespace in files magic-card.js carries. */
const LABEL_MARK = 'i18n/labels/mark';
/** Joins the entries of a table (contract TABLE_SEPARATOR). */
const SEP = '|';

/** Absolute path (no extension, no /index) an import specifier points at, or null for packages. */
function resolveSpec(file, spec) {
  let p;
  if (spec.startsWith('.')) p = path.resolve(path.dirname(file), spec);
  else if (spec.startsWith('@/')) p = path.join(SRC, spec.slice(2));
  else return null;
  return p.replace(/[\\/]index(\.ts)?$/, '').replace(/\.ts$/, '');
}

/**
 * Finds the i18n calls of one file. Returns { calls, violations }.
 * call: { ns, fn, kind ('key' | 'text'), ctx, text, id, start, end, callStart, callEnd, line }
 * kind 'key': the first argument is a string literal that matches KEY_PATTERN (never for tc). Every other literal is a text id,
 * which is also a violation.
 * violation (D1): { line, fn, ns, reason, text? } (text: the id is a literal that is not a key, or a tc call)
 */
function scanSource(file, source, nsList = activeNamespaces()) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.ES2021, false, ts.ScriptKind.TS);
  const byDir = new Map(nsList.map((n) => [n.dir, n.ns]));
  const local = new Map(); // local name -> { ns, fn }
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause?.namedBindings || !ts.isNamedImports(st.importClause.namedBindings)) continue;
    const target = resolveSpec(file, st.moduleSpecifier.text);
    const ns = target && byDir.get(target);
    if (!ns) {
      const dir = target && target.split(path.sep).join('/').endsWith('/' + LABEL_MARK) ? path.dirname(target) : undefined;
      if (dir && byDir.has(dir)) {
        for (const el of st.importClause.namedBindings.elements) if ((el.propertyName ?? el.name).text === 'lm') local.set(el.name.text, { ns: byDir.get(dir), fn: 'lm' });
      }
      continue;
    }
    for (const el of st.importClause.namedBindings.elements) {
      const fn = (el.propertyName ?? el.name).text;
      if (FNS.has(fn)) local.set(el.name.text, { ns, fn });
    }
  }
  const calls = [];
  const violations = [];
  if (!local.size) return { calls, violations, sf };
  const { KEY_PATTERN } = loadKeysContract();
  const lit = (n) => (n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : undefined);
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && local.has(n.expression.text)) {
      const { ns, fn } = local.get(n.expression.text);
      const line = sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
      const ctxNode = fn === 'tc' ? n.arguments[0] : undefined;
      const idNode = fn === 'tc' ? n.arguments[1] : n.arguments[0];
      const ctx = lit(ctxNode);
      const text = lit(idNode);
      // t(item.label) / tx(id, ...): renders a MessageId that an m() / lm() mark (or a table row) holds; nothing to extract
      const isValue = (a) => !!a && (ts.isIdentifier(a) || ts.isPropertyAccessExpression(a) || ts.isElementAccessExpression(a) || ts.isCallExpression(a) || ts.isNonNullExpression(a) || ts.isParenthesizedExpression(a));
      if (text === undefined && (fn === 't' || fn === 'tx') && isValue(idNode)) {
        ts.forEachChild(n, visit);
        return;
      }
      if (text === undefined || (fn === 'tc' && ctx === undefined)) violations.push({ line, fn, ns, reason: 'the id is not a string literal (D1)' });
      else {
        const kind = fn !== 'tc' && KEY_PATTERN.test(text) ? 'key' : 'text';
        if (kind === 'text') violations.push({ line, fn, ns, text: true, reason: fn === 'tc' ? 'tc() is removed; write one key per meaning (D1)' : `"${text.slice(0, 40)}" is not a key; use a key of ${ns}/en-GB.json (D1)` });
        calls.push({ ns, fn, kind, ctx, text, id: fn === 'tc' ? `${ctx}|${text}` : text, start: idNode.getStart(sf), end: idNode.getEnd(), callStart: n.getStart(sf), callEnd: n.getEnd(), line });
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { calls, violations, sf };
}

/**
 * Scans every source file once. keys: ns -> Map key -> [{file, line, fn}]; violations: [{file, ...}] (a non-literal id, a text id).
 */
function extractAll() {
  const nsList = activeNamespaces();
  const keys = new Map(nsList.map((n) => [n.ns, new Map()]));
  const violations = [];
  if (!nsList.length) return { keys, violations, nsList };
  for (const file of listSourceFiles()) {
    if (!isScanned(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!/i18n/.test(source)) continue;
    const r = scanSource(file, source, nsList);
    for (const c of r.calls) {
      if (c.kind !== 'key') continue;
      const uses = keys.get(c.ns);
      if (!uses.has(c.id)) uses.set(c.id, []);
      uses.get(c.id).push({ file: rel(file), line: c.line, fn: c.fn });
    }
    for (const v of r.violations) violations.push({ file: rel(file), ...v });
  }
  return { keys, violations, nsList };
}

const sortedIds = (set) => [...set].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

function genSource(rows) {
  const lit = (r) => '  ' + JSON.stringify(r.join(SEP)) + ',';
  return `// generated by tools/i18n-build.mjs (npm run i18n); git-ignored, do not edit\nconst tables: readonly [string, string, string] = [\n${rows.map(lit).join('\n')}\n];\nexport default tables;\n`;
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.writeFileSync(file, content);
  return true;
}

/** Reads the en-GB texts (the first table) back from a messages.gen.ts. */
function readGenIds(genFile) {
  const lines = fs.readFileSync(genFile, 'utf8').split('\n');
  const first = lines.find((l) => l.startsWith('  "'));
  if (first === undefined) return [];
  const s = JSON.parse(first.trim().replace(/,$/, ''));
  return s === '' ? [] : s.split(SEP);
}

// ---- messages (ICU subset, validator for the tools; the run-time parser is src/i18n/runtime.ts) ----

const closeAt = (s, i) => {
  for (let d = 0; i < s.length; i++) {
    d += s[i] === '{' ? 1 : s[i] === '}' ? -1 : 0;
    if (!d) return i;
  }
  return -1;
};

/** Deepest nesting of braces in a text; the run-time parser (TOP in src/i18n/runtime.ts) reads three levels. */
const MAX_BRACE_DEPTH = 3;
function braceDepth(text) {
  let d = 0;
  let max = 0;
  for (const c of text) {
    if (c === '{') max = Math.max(max, ++d);
    else if (c === '}') d--;
  }
  return max;
}

/** Plural categories of a locale, from Node's own Intl.PluralRules; undefined when no locale is given. */
const categoryCache = new Map();
function pluralCategories(locale) {
  if (!locale) return undefined;
  if (!categoryCache.has(locale)) categoryCache.set(locale, new Set(new Intl.PluralRules(locale).resolvedOptions().pluralCategories));
  return categoryCache.get(locale);
}

/**
 * Parses one message. Returns { args: Map name -> 'plain' | 'plural' | 'select', error }.
 * Rules (D6): no newline, no '|', braces only for {name} / plural / select, at most three brace levels, no
 * apostrophe before { } or # when opts.quotes is set (messages of key catalogues; the run time has no quoting),
 * `other` required, no nesting of plural or select inside a branch. With opts.locale, plural branch keywords are
 * that locale's CLDR categories or =N.
 */
function parseMessage(text, inBranch = false, args = new Map(), opts = {}) {
  const { locale } = opts;
  if (/\n/.test(text)) return { args, error: 'contains a newline' };
  if (!inBranch && text.includes(SEP)) return { args, error: `contains '${SEP}' (the table separator)` };
  if (!inBranch && opts.quotes && /'[{}#]/.test(text)) return { args, error: 'has an apostrophe before { } or # (the run time has no quoting)' };
  if (!inBranch && braceDepth(text) > MAX_BRACE_DEPTH) return { args, error: 'nests deeper than three brace levels (write one key per select value)' };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '}') return { args, error: 'unmatched }' };
    if (c !== '{') continue;
    const j = closeAt(text, i);
    if (j < 0) return { args, error: 'unmatched {' };
    const m = /^\s*(\w+)\s*(?:,\s*(plural|select)\s*,([\s\S]*))?$/.exec(text.slice(i + 1, j));
    if (!m) return { args, error: 'bad argument syntax near "' + text.slice(i, j + 1) + '"' };
    if (m[2]) {
      if (inBranch) return { args, error: 'plural or select inside a branch' };
      args.set(m[1], m[2]);
      const r = m[3];
      const keys = [];
      let k = 0;
      for (;;) {
        const rest = r.slice(k);
        if (!rest.trim()) break;
        const q = /^\s*(=?\w+)\s*\{/.exec(rest);
        if (!q) return { args, error: 'bad branch near "' + rest.trim().slice(0, 20) + '"' };
        const open = k + q[0].length - 1;
        const e = closeAt(r, open);
        if (e < 0) return { args, error: 'unmatched { in a branch' };
        keys.push(q[1]);
        const known = m[2] === 'plural' ? pluralCategories(locale) : undefined;
        if (known && !/^=\d+$/.test(q[1]) && !known.has(q[1])) return { args, error: `plural branch "${q[1]}" is not a ${locale} category (${[...known].join(', ')}) or =N` };
        const sub = parseMessage(r.slice(open + 1, e), true, args, opts);
        if (sub.error) return sub;
        k = e + 1;
      }
      if (!keys.includes('other')) return { args, error: 'missing the other branch' };
    } else if (!args.has(m[1])) args.set(m[1], 'plain');
    i = j;
  }
  return { args };
}

const argSig = (a) => [...a.entries()].map(([k, v]) => `${k}:${v === 'plain' ? 'x' : v}`).sort().join(',');
const argNames = (a) => [...a.keys()].sort().join(',');

// ---- en-US generator ----

const cap = (w, like) => (like === like.toUpperCase() && like.length > 1 ? w.toUpperCase() : like[0] === like[0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w);

/** Applies the word list to text outside the {name}, plural / select keys of a message. */
function usText(text, words) {
  const word = (s) => s.replace(/[A-Za-z]+/g, (w) => (Object.prototype.hasOwnProperty.call(words, w.toLowerCase()) ? cap(words[w.toLowerCase()], w) : w));
  const walk = (s) => {
    let out = '';
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '{') {
        let j = s.indexOf('{', i);
        if (j < 0) j = s.length;
        out += word(s.slice(i, j));
        i = j - 1;
        continue;
      }
      const j = closeAt(s, i);
      if (j < 0) {
        out += s.slice(i);
        break;
      }
      const body = s.slice(i + 1, j);
      const m = /^(\s*\w+\s*,\s*(?:plural|select)\s*,)([\s\S]*)$/.exec(body);
      if (!m) out += '{' + body + '}';
      else {
        let r = m[2];
        let res = '';
        for (;;) {
          const q = /^(\s*=?\w+\s*)\{/.exec(r);
          if (!q) {
            res += r;
            break;
          }
          const open = q[0].length - 1;
          const e = closeAt(r, open);
          if (e < 0) {
            res += r;
            break;
          }
          res += q[1] + '{' + walk(r.slice(open + 1, e)) + '}';
          r = r.slice(e + 1);
        }
        out += '{' + m[1] + res + '}';
      }
      i = j;
    }
    return out;
  };
  return walk(text);
}

/** Function en-GB text -> en-US text: a reviewed exception for that exact text, else the word list. */
function usConverter() {
  const { EN_US_WORDS } = loadContract();
  const exceptions = new Map(Object.entries(readJson(path.join(__dirname, 'en-US-exceptions.json'), {})));
  return (text) => (exceptions.has(text) ? exceptions.get(text) : usText(text, EN_US_WORDS));
}

/** en-US table for a set of English texts: { text: american text }. */
function generateUS(ids) {
  const { EN_US_WORDS } = loadContract();
  const exceptions = readJson(path.join(__dirname, 'en-US-exceptions.json'), {});
  const out = {};
  for (const id of sortedIds(ids)) {
    out[id] = Object.prototype.hasOwnProperty.call(exceptions, id) ? exceptions[id] : usText(id, EN_US_WORDS);
  }
  return out;
}

const stableJson = (o) => JSON.stringify(o, null, 2) + '\n';

/**
 * Writes messages.gen.ts of every active namespace (and keys.gen.ts of a key namespace);
 * returns { res: [{ ns, count, changed }], violations }.
 */
function buildAll() {
  const keys = require('./keys.cjs');
  const { violations, nsList } = extractAll();
  const res = [];
  for (const n of nsList) {
    const cat = keys.loadCatalogues(n.dir);
    const t = keys.tablesForKeys(cat);
    const changed = writeIfChanged(path.join(n.dir, 'messages.gen.ts'), genSource(t.rows));
    writeIfChanged(path.join(n.dir, 'keys.gen.ts'), keys.typesSource(cat));
    res.push({ ns: n.ns, count: t.count, changed });
  }
  return { res, violations };
}

module.exports = {
  ROOT, SRC, rel, loadContract, loadKeysContract, readJson, activeNamespaces, listSourceFiles, isScanned, scanSource, extractAll,
  sortedIds, genSource, writeIfChanged, readGenIds, parseMessage, braceDepth, pluralCategories, argSig, argNames,
  usText, usConverter, generateUS, stableJson, buildAll, closeAt,
};
