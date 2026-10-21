/*
 * Shared code of the i18n tools (contract src/contracts/i18n.ts 1.0.0): contract loading,
 * source scan (t / tc / tx / m calls found through the imports of a namespace's i18n folder), catalogues,
 * messages.gen.ts writer, en-US generator, message validator. CommonJS so the webpack pre-loader
 * (tools/i18n-loader.cjs) and the .mjs tools use the same code.
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'src');

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/** The contract's constants (the file is TypeScript with no imports: transpile and run it). */
let contractCache;
function loadContract() {
  if (contractCache) return contractCache;
  const src = fs.readFileSync(path.join(SRC, 'contracts/i18n.ts'), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', out)(mod, mod.exports);
  contractCache = mod.exports;
  return contractCache;
}

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

const FNS = new Set(['t', 'tc', 'tx', 'm']);
/** lm() (src/i18n/labels/mark.ts) is m() for the 'labels' namespace in files magic-card.js carries. */
const LABEL_MARK = 'i18n/labels/mark';
/** Joins the entries of a table (contract TABLE_SEPARATOR). A tc() id is 'context|text' in the tools; the en-GB table keeps the context apart with CTX. */
const SEP = '|';
const CTX = '\u0001';

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
 * call: { ns, fn, argNode (the id literal), ctx, text, id, start, end, callStart, callEnd }
 * violation (D1): { line, fn, reason }
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
      else
        calls.push({ ns, fn, ctx, text, id: fn === 'tc' ? `${ctx}|${text}` : text, start: idNode.getStart(sf), end: idNode.getEnd(), callStart: n.getStart(sf), callEnd: n.getEnd(), line });
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return { calls, violations, sf };
}

/** Scans every source file once: { ids: Map ns -> Set, violations: [{file,...}] }. */
function extractAll() {
  const nsList = activeNamespaces();
  const ids = new Map(nsList.map((n) => [n.ns, new Set()]));
  const ctxIds = new Map(nsList.map((n) => [n.ns, new Map()])); // ns -> id -> context
  const violations = [];
  if (!nsList.length) return { ids, ctxIds, violations, nsList };
  for (const file of listSourceFiles()) {
    if (!isScanned(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (!/i18n/.test(source)) continue;
    const r = scanSource(file, source, nsList);
    for (const c of r.calls) {
      ids.get(c.ns).add(c.id);
      if (c.ctx !== undefined) ctxIds.get(c.ns).set(c.id, c.ctx);
    }
    for (const v of r.violations) violations.push({ file: rel(file), ...v });
  }
  return { ids, ctxIds, violations, nsList };
}

const sortedIds = (set) => [...set].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

const catalogue = (n, name) => readJson(path.join(n.dir, name), {});

/** Table text of an en-US / nl entry: the catalogue value; a context id stores the text without the prefix. */
function tablesFor(n, ids) {
  const us = catalogue(n, 'en-US.json');
  const nl = catalogue(n, 'nl.json');
  const list = sortedIds(ids);
  return { list, rows: [list, list.map((i) => us[i] ?? ''), list.map((i) => nl[i] ?? '')] };
}

function genSource(rows) {
  const lit = (r, i) => '  ' + JSON.stringify((i === 0 ? r.map((x) => x.replace(SEP, CTX)) : r).join(SEP)) + ',';
  return `// generated by tools/i18n-build.mjs (npm run i18n); git-ignored, do not edit\nconst tables: readonly [string, string, string] = [\n${rows.map(lit).join('\n')}\n];\nexport default tables;\n`;
}

function writeIfChanged(file, content) {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.writeFileSync(file, content);
  return true;
}

/** Reads the id list (the en-GB table) back from a messages.gen.ts. */
function readGenIds(genFile) {
  const lines = fs.readFileSync(genFile, 'utf8').split('\n');
  const first = lines.find((l) => l.startsWith('  "'));
  if (first === undefined) return [];
  const s = JSON.parse(first.trim().replace(/,$/, ''));
  return s === '' ? [] : s.split(SEP).map((x) => x.replace(CTX, SEP));
}

// ---- messages (ICU subset, validator for the tools; the run-time parser is src/i18n/runtime.ts) ----

const closeAt = (s, i) => {
  for (let d = 0; i < s.length; i++) {
    d += s[i] === '{' ? 1 : s[i] === '}' ? -1 : 0;
    if (!d) return i;
  }
  return -1;
};

/**
 * Parses one message. Returns { args: Map name -> 'plain' | 'plural' | 'select', error }.
 * Rules (D6): no newline, braces only for {name} / plural / select, `other` required, no nesting of
 * plural or select inside a branch.
 */
function parseMessage(text, inBranch = false, args = new Map()) {
  if (/\n/.test(text)) return { args, error: 'contains a newline' };
  if (!inBranch && text.includes(SEP)) return { args, error: `contains '${SEP}' (the table separator)` };
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
        const sub = parseMessage(r.slice(open + 1, e), true, args);
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
function usText(text, words, exceptions) {
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

/** en-US table for the extracted ids: { id: american text }; a context id loses its prefix. */
function generateUS(ids, ctxIds = new Map()) {
  const { EN_US_WORDS } = loadContract();
  const exceptions = readJson(path.join(__dirname, 'en-US-exceptions.json'), {});
  const out = {};
  for (const id of sortedIds(ids)) {
    const plain = ctxIds.has(id) ? id.slice(ctxIds.get(id).length + 1) : id;
    out[id] = Object.prototype.hasOwnProperty.call(exceptions, id) ? exceptions[id] : usText(plain, EN_US_WORDS, exceptions);
  }
  return out;
}

const stableJson = (o) => JSON.stringify(o, null, 2) + '\n';

/** Writes messages.gen.ts of every active namespace; returns { ns, count, changed }[]. */
function buildAll() {
  const { ids, violations, nsList } = extractAll();
  const res = [];
  for (const n of nsList) {
    const { list, rows } = tablesFor(n, ids.get(n.ns));
    res.push({ ns: n.ns, count: list.length, changed: writeIfChanged(path.join(n.dir, 'messages.gen.ts'), genSource(rows)) });
  }
  return { res, violations };
}

module.exports = {
  ROOT, SRC, rel, loadContract, readJson, activeNamespaces, listSourceFiles, isScanned, scanSource, extractAll,
  sortedIds, catalogue, tablesFor, genSource, writeIfChanged, readGenIds, parseMessage, argSig, argNames,
  usText, generateUS, stableJson, buildAll, closeAt,
};
