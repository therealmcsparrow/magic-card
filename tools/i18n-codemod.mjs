// Moves one namespace from text ids to domain keys (contract src/contracts/i18n-keys.ts).
//
//   node tools/i18n-codemod.mjs <namespace>            dry run: prints what would change, writes nothing
//   node tools/i18n-codemod.mjs <namespace> --write    rewrites the calls and writes en-GB.json, en-US.json, nl.json
//   --reworded-out <file>                               saves the list of changed texts for text-snapshot.mjs --reworded
//
// Every t / tx / m / lm / tc call of the namespace whose first argument is a British text becomes a call with a
// literal key: the namespace, the file the call sits in (its place in the UI) and a slug of the English text,
// e.g. t('Toggle {name}') in light-view.ts -> t('controls.light-view.toggle-name'). tc(context, text) becomes
// t(key) and its context moves into the note. The catalogues are written the way keys.canonicalJson writes them:
// en-GB.json holds text, a note made from the place, max and vars; en-US.json comes from the word list; nl.json
// keeps the old Dutch text. Both translation files get the hash of the current English, which marks them as
// confirmed. Nothing is written when a file has to be skipped, so a namespace moves whole or not at all.
// Run it in a plain copy of the tree first; text-snapshot.mjs proves that the English did not change.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const lib = require('./i18n/lib.cjs');
const keys = require('./i18n/keys.cjs');

/** Source files above this size are not read. */
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
/** A text longer than this is cut before its slug is made. */
const MAX_SLUG_INPUT = 2000;
const MAX_PLACE_CHARS = 32;
const MAX_SLUG_CHARS = 40;
/** The longest text a place holds is at least this many times the English length (room for translations). */
const MAX_GROWTH = 1.6;
const MAX_STEP = 5;

const LEFT_QUOTE = '‘';
const RIGHT_QUOTE = '’';

export const relFile = (root, file) => path.relative(root, file).split(path.sep).join('/');

/** Lower-case ASCII words of a text: accents folded, every other character is a separator. */
export function kebabWords(text) {
  return text
    .slice(0, MAX_SLUG_INPUT)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Words joined with '-' up to `limit` characters, cut at a word boundary (the first word is cut when it is longer). */
function joinWords(words, limit) {
  let out = '';
  for (const w of words) {
    const next = out ? `${out}-${w}` : w;
    if (next.length > limit) {
      if (!out) out = w.slice(0, limit);
      break;
    }
    out = next;
  }
  return out;
}

/** The text of a message with every {argument} and plural / select replaced by the argument name. */
function flatten(text) {
  const s = text.slice(0, MAX_SLUG_INPUT);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '{') {
      out += s[i];
      continue;
    }
    const j = lib.closeAt(s, i);
    if (j < 0) break;
    const m = /^\s*(\w+)/.exec(s.slice(i + 1, i + 81));
    out += ` ${m ? m[1] : ''} `;
    i = j;
  }
  return out;
}

/** An apostrophe before { } or # is read as quoting by ICU tools and not by the run time; curly quotes say the same. */
export function reword(text) {
  if (!/'[{}#]/.test(text)) return text;
  return text.replace(/'(?=[{}#])/g, LEFT_QUOTE).replace(/([}#])'(?!\w)/g, `$1${RIGHT_QUOTE}`);
}

const roundUp = (n, step) => Math.ceil(n / step) * step;

/** Characters of the longest rendering of a message (a message that does not parse counts as written). */
function longest(text, parsedOk) {
  return [...(parsedOk ? keys.longestText(text) : text)].length;
}

/** Edits are { start, end, text } on the original source; applied from the end so offsets stay valid. */
export function applyEdits(source, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  for (let i = 1; i < sorted.length; i++) if (sorted[i].end > sorted[i - 1].start) throw new Error('overlapping edits');
  let out = source;
  for (const e of sorted) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

/** The quote character the literal at `start` used; a template literal or single quote gives a single quote. */
export const quoteLike = (source, start, text) => {
  const q = source[start] === '"' ? '"' : "'";
  return q + text + q;
};

function resolveImport(file, spec) {
  let p;
  if (spec.startsWith('.')) p = path.resolve(path.dirname(file), spec);
  else if (spec.startsWith('@/')) p = path.join(lib.SRC, spec.slice(2));
  else return null;
  return p.replace(/[\\/]index(\.ts)?$/, '').replace(/\.ts$/, '');
}

/** The named imports of a file that come from the i18n folder of a namespace: [{ ns, named, elements: [{ imported, local, node }] }]. */
export function nsImports(sf, file, nsList) {
  const byDir = new Map(nsList.map((n) => [n.dir, n.ns]));
  const out = [];
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause?.namedBindings || !ts.isNamedImports(st.importClause.namedBindings)) continue;
    const target = resolveImport(file, st.moduleSpecifier.text);
    const ns = target && byDir.get(target);
    if (!ns) continue;
    const named = st.importClause.namedBindings;
    out.push({ ns, named, elements: named.elements.map((node) => ({ imported: (node.propertyName ?? node.name).text, local: node.name.text, node })) });
  }
  return out;
}

/** Every name the file declares (variables, parameters, functions, classes, imports). */
function declaredNames(sf) {
  const names = new Set();
  const add = (n) => {
    if (!n) return;
    if (ts.isIdentifier(n)) names.add(n.text);
    else if (ts.isObjectBindingPattern(n) || ts.isArrayBindingPattern(n)) for (const e of n.elements) if (ts.isBindingElement(e)) add(e.name);
  };
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) || ts.isParameter(n) || ts.isBindingElement(n) || ts.isFunctionDeclaration(n) || ts.isClassDeclaration(n) || ts.isImportSpecifier(n) || ts.isImportClause(n) || ts.isNamespaceImport(n)) add(n.name);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return names;
}

/** How many identifiers named `name` stand outside import declarations. */
function countRefs(sf, name) {
  let n = 0;
  const visit = (node) => {
    if (ts.isImportDeclaration(node)) return;
    if (ts.isIdentifier(node) && node.text === name) n++;
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return n;
}

/** CallExpression nodes of a file by their start offset. */
function callNodes(sf) {
  const map = new Map();
  const visit = (n) => {
    if (ts.isCallExpression(n)) map.set(n.getStart(sf), n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return map;
}

/** Writes every file; when one write fails the files already written are put back. Returns the number of files written. */
export function applyWrites(writes) {
  const originals = new Map();
  const done = [];
  try {
    for (const [file, content] of writes) {
      originals.set(file, fs.existsSync(file) ? fs.readFileSync(file) : null);
      const tmp = `${file}.${process.pid}.tmp`;
      fs.writeFileSync(tmp, content);
      fs.renameSync(tmp, file);
      done.push(file);
    }
  } catch (e) {
    for (const file of done) {
      const was = originals.get(file);
      if (was === null) fs.rmSync(file, { force: true });
      else fs.writeFileSync(file, was);
    }
    for (const file of writes.keys()) fs.rmSync(`${file}.${process.pid}.tmp`, { force: true });
    throw e;
  }
  return done.length;
}

/** The source files a namespace can be called from: every scanned file of the tree, in path order. */
export function sourceFiles() {
  return lib.listSourceFiles().filter(lib.isScanned).sort();
}

const placeOf = (file) => {
  const stem = path.basename(file).replace(/\.ts$/, '');
  const base = stem === 'index' ? path.basename(path.dirname(file)) : stem;
  const words = kebabWords(base);
  return { words, place: joinWords(words, MAX_PLACE_CHARS) || 'text' };
};

const stringOf = (map, id) => {
  const v = map?.get(id);
  return typeof v === 'string' && v !== '' ? v : undefined;
};

/**
 * Moves a namespace to keys. Returns
 * { ns, keys: Map id -> key, files: [{ file, calls }], reworded: [{ key, locale, from, to }], missingNl, orphans: { us, nl },
 *   problems, skipped, written }.
 */
export function migrateNamespace({ ns, nsList = lib.activeNamespaces(), files, root = lib.ROOT, write = false }) {
  const entry = nsList.find((n) => n.ns === ns);
  if (!entry) throw new Error(`namespace "${ns}" is not in tools/i18n/config.json`);
  const { KEY_PATTERN, KEY_MAX_CHARS } = lib.loadKeysContract();
  const cat = keys.loadCatalogues(entry.dir);
  const legacy = cat.has ? null : { us: keys.readMap(path.join(entry.dir, 'en-US.json'))?.map ?? new Map(), nl: keys.readMap(path.join(entry.dir, 'nl.json'))?.map ?? new Map() };
  const toUS = lib.usConverter();

  const gbOut = new Map(cat.gb);
  const usOut = new Map(cat.us);
  const nlOut = new Map(cat.nl);
  const claimed = new Map(); // key -> id
  const idKey = new Map(); // `${file}\0${id}` -> key
  const reportKeys = new Map();
  const reworded = [];
  const missingNl = [];
  const problems = [];
  const fileReports = [];
  const writes = new Map();
  const usedIds = new Set();
  let skipped = 0;
  let added = 0;

  const list = files ?? sourceFiles();
  for (const file of [...list].sort()) {
    const rf = relFile(root, file);
    if (fs.statSync(file).size > MAX_SOURCE_BYTES) {
      problems.push(`${rf}: larger than ${MAX_SOURCE_BYTES} bytes, not read`);
      continue;
    }
    const source = fs.readFileSync(file, 'utf8');
    if (!/i18n/.test(source)) continue;
    const scan = lib.scanSource(file, source, nsList);
    for (const v of scan.violations) if (v.ns === ns && !v.text) problems.push(`${rf}:${v.line} ${v.fn}(): ${v.reason}`);
    const calls = scan.calls.filter((c) => c.ns === ns && c.kind === 'text');
    if (!calls.length) continue;

    const sf = scan.sf;
    const imports = nsImports(sf, file, nsList).filter((i) => i.ns === ns);
    const elements = imports.flatMap((i) => i.elements);
    const hasTc = calls.some((c) => c.fn === 'tc');
    let tLocal = elements.find((e) => e.imported === 't')?.local;
    if (hasTc && !tLocal && declaredNames(sf).has('t')) {
      problems.push(`${rf}: the file declares t, so its tc() calls cannot become t() calls; rename that t first`);
      skipped++;
      continue;
    }
    tLocal ??= 't';

    const { words: placeWords, place } = placeOf(file);
    const nodes = callNodes(sf);
    const edits = [];
    const converted = new Map(); // local tc name -> converted call count
    let count = 0;
    for (const c of calls) {
      const gbText = reword(c.text);
      const parsed = lib.parseMessage(gbText, false, new Map(), { locale: 'en-GB', quotes: true });
      const memo = `${file}\0${c.id}`;
      let key = idKey.get(memo);
      if (!key) {
        key = allocate({ ns, place, text: gbText, ctx: c.ctx, claimed, gbOut, cat, KEY_MAX_CHARS });
        if (!key || !KEY_PATTERN.test(key) || key.length > KEY_MAX_CHARS) {
          problems.push(`${rf}:${c.line} no valid key for "${c.text.slice(0, 40)}"`);
          skipped++;
          continue;
        }
        idKey.set(memo, key);
        claimed.set(key, c.id);
        reportKeys.set(c.id, key);
        usedIds.add(c.id);
        if (!gbOut.has(key)) {
          added++;
          const entryOut = { text: gbText, note: '', max: 0 };
          const vars = parsed.error ? undefined : varsFor(parsed.args);
          if (parsed.error) problems.push(`${key}: ${parsed.error}`);
          if (vars) entryOut.vars = vars;
          entryOut.note = noteFor(placeWords, ns, c.ctx);
          if (gbText !== c.text) reworded.push({ key, locale: 'en-GB', from: c.text, to: gbText });
          const us = toUS(gbText);
          const legacyUs = stringOf(legacy?.us, c.id);
          if (legacyUs !== undefined && legacyUs !== us) reworded.push({ key, locale: 'en-US', from: legacyUs, to: us });
          const legacyNl = stringOf(legacy?.nl, c.id);
          const nl = legacyNl === undefined ? undefined : reword(legacyNl);
          if (legacyNl !== undefined && nl !== legacyNl) reworded.push({ key, locale: 'nl', from: legacyNl, to: nl });
          const grown = Math.ceil(longest(gbText, !parsed.error) * MAX_GROWTH);
          entryOut.max = roundUp(Math.max(grown, longest(us, true), nl === undefined ? 0 : longest(nl, true)), MAX_STEP);
          gbOut.set(key, entryOut);
          const hash = keys.sourceHash(gbText);
          usOut.set(key, { text: us, hash });
          if (nl === undefined) missingNl.push(key);
          else nlOut.set(key, { text: nl, hash });
        }
      }
      count++;
      if (c.fn === 'tc') {
        const callee = /^[\w$]+/.exec(source.slice(c.callStart, c.callStart + 80))[0];
        const node = nodes.get(c.callStart);
        edits.push({ start: c.callStart, end: c.callStart + callee.length, text: tLocal });
        edits.push({ start: node.arguments[0].getStart(sf), end: c.end, text: quoteLike(source, c.start, key) });
        converted.set(callee, (converted.get(callee) ?? 0) + 1);
      } else edits.push({ start: c.start, end: c.end, text: quoteLike(source, c.start, key) });
    }
    if (hasTc) importEdits({ sf, imports, converted, tLocal, hasT: elements.some((e) => e.imported === 't'), edits });
    if (edits.length) writes.set(file, applyEdits(source, edits));
    fileReports.push({ file: rf, calls: count });
  }

  const blocked = skipped > 0;
  if (blocked) problems.push('nothing written: fix the files above and run again');
  if (added && !blocked) {
    writes.set(path.join(entry.dir, 'en-GB.json'), keys.canonicalJson('gb', gbOut));
    writes.set(path.join(entry.dir, 'en-US.json'), keys.canonicalJson('tr', usOut));
    writes.set(path.join(entry.dir, 'nl.json'), keys.canonicalJson('tr', nlOut));
  }
  const written = write && !blocked && writes.size > 0;
  if (written) applyWrites(writes);

  const orphan = (map) => (legacy && map ? [...map.keys()].filter((id) => !usedIds.has(id)).sort() : []);
  return {
    ns,
    keys: reportKeys,
    files: fileReports,
    reworded,
    missingNl: missingNl.sort(),
    orphans: { us: orphan(legacy?.us), nl: orphan(legacy?.nl) },
    problems,
    skipped,
    written,
  };
}

/** Key for one text: namespace, place, slug; a taken slug gets the tc context, then 2, 3 ... */
function allocate({ ns, place, text, ctx, claimed, gbOut, cat, KEY_MAX_CHARS }) {
  const slug = joinWords(kebabWords(flatten(text)), MAX_SLUG_CHARS) || 'text';
  const make = (suffix) => {
    const room = Math.max(1, KEY_MAX_CHARS - ns.length - place.length - 2 - suffix.length);
    const body = slug.slice(0, room).replace(/-+$/, '') || 'text';
    return `${ns}.${place}.${body}${suffix}`;
  };
  const suffixes = [''];
  const ctxWords = ctx ? joinWords(kebabWords(ctx), 20) : '';
  if (ctxWords) suffixes.push(`-${ctxWords}`);
  for (let n = 2; n < 1000; n++) suffixes.push(`-${n}`);
  for (const s of suffixes) {
    const candidate = make(s);
    if (claimed.has(candidate)) continue;
    if (!gbOut.has(candidate)) return candidate;
    if (cat.gb.has(candidate) && gbOut.get(candidate)?.text === text) return candidate;
  }
  return '';
}

const noteFor = (placeWords, ns, ctx) => `Shown in ${placeWords.join(' ') || 'the screen'} (${ns}).${ctx ? ` Context: ${ctx}.` : ''}`;

const varsFor = (args) => {
  if (!args.size) return undefined;
  const out = {};
  for (const [name, kind] of [...args.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) out[name] = kind === 'plural' ? 'The count the text is about.' : `The value that replaces ${name} in the text.`;
  return out;
};

/** Import edits for a file with tc calls: t is imported (when it was not) and tc leaves the import once nothing else uses it. */
function importEdits({ sf, imports, converted, tLocal, hasT, edits }) {
  let needT = !hasT;
  for (const imp of imports) {
    const tcEls = imp.elements.filter((e) => e.imported === 'tc');
    if (!tcEls.length) continue;
    const names = [];
    for (const el of imp.elements) {
      if (el.imported === 'tc') {
        const stays = countRefs(sf, el.local) > (converted.get(el.local) ?? 0);
        if (needT) {
          names.push(tLocal);
          needT = false;
        }
        if (stays) names.push(el.node.getText(sf));
      } else names.push(el.node.getText(sf));
    }
    edits.push({ start: imp.named.getStart(sf), end: imp.named.getEnd(), text: `{ ${names.join(', ')} }` });
  }
}

function printReport(r, write) {
  const out = [];
  out.push(`${write ? '' : 'dry run, nothing written: '}${r.ns}: ${r.keys.size} keys in ${r.files.length} files${r.written ? ' (written)' : ''}`);
  for (const f of r.files) out.push(`  ${f.file}: ${f.calls} calls`);
  if (r.reworded.length) out.push(`reworded (the snapshot compare needs these):\n${r.reworded.map((x) => `  ${x.key} ${x.locale}: ${JSON.stringify(x.from)} -> ${JSON.stringify(x.to)}`).join('\n')}`);
  if (r.missingNl.length) out.push(`no nl text yet (${r.missingNl.length}):\n${r.missingNl.map((k) => `  ${k}`).join('\n')}`);
  const orphans = [...r.orphans.nl.map((id) => `nl ${JSON.stringify(id)}`), ...r.orphans.us.map((id) => `en-US ${JSON.stringify(id)}`)];
  if (orphans.length) out.push(`catalogue entries no call uses (dropped):\n${orphans.slice(0, 20).map((x) => `  ${x}`).join('\n')}${orphans.length > 20 ? `\n  and ${orphans.length - 20} more` : ''}`);
  if (r.problems.length) out.push(`problems:\n${r.problems.map((p) => `  ${p}`).join('\n')}`);
  return out.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const rwOut = args.includes('--reworded-out') ? args[args.indexOf('--reworded-out') + 1] : undefined;
  const ns = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--reworded-out');
  if (!ns) {
    console.error('usage: node tools/i18n-codemod.mjs <namespace> [--write] [--reworded-out file]');
    process.exit(2);
  }
  try {
    const r = migrateNamespace({ ns, write });
    console.log(printReport(r, write));
    if (rwOut) fs.writeFileSync(rwOut, JSON.stringify(r.reworded, null, 2) + '\n');
    process.exit(r.problems.some((p) => !/not a string literal/.test(p)) || r.skipped ? 1 : 0);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
