// One copy of module state. A src module that holds module-level state may sit in at most one chunk of the card bundle:
// the entry chunk that holds magic-card.js plus every chunk reachable from it through `parents`. A second copy is a second
// module record, so it gets its own variables, its own Map and its own custom element class (or skips the define silently).
// The other entries (the animation studio, the theme editor) are separate bundles and are not counted.
//
// Module-level state is found by parsing each duplicated module with the TypeScript compiler API and walking its top-level
// statements only:
//   - a top-level `let` or `var`, exported or not (`declare let` is ambient and does not count);
//   - a top-level `const` that the module mutates: a mutating call (add, set, delete, clear, push, splice, sort ...), an
//     assignment, `++` / `--` or `delete` on a member of it, anywhere in the file;
//   - a class field or static block of a top-level class that is assigned at run time (a write to ClassName.x or this.x in a
//     static member);
//   - a top-level customElements.define or @customElement, or a write to window / globalThis.
// Every module under src/anim-studio/ and src/icons/icon-source.ts counts as stateful (STATEFUL below), and so does a module
// whose exported const another module mutates: the checker reads one file at a time, so such a module is added to STATEFUL.
// False positives go in tools/chunk-dups.json `stateless` as { module, reason } where the reason is a technical fact about the
// module. An entry that matches no duplicated stateful module is stale and fails.
//
// Usage: node tools/check-chunk-dups.mjs [stats.json]    check the last production build
//        node tools/check-chunk-dups.mjs --self-test      the rule against synthetic graphs and sources
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATS_DEFAULT = path.join(root, 'node_modules/.cache/magic-card/entry-graph.json');
const RULES_REL = 'tools/chunk-dups.json';
const ENTRY = 'magic-card.js';
export const STATEFUL = { dirs: ['./src/anim-studio/'], modules: ['./src/icons/icon-source.ts'] };

const MUTATING = new Set(['add', 'set', 'delete', 'clear', 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill', 'copyWithin', 'append']);
const OBJECT_MUTATORS = new Set(['assign', 'defineProperty', 'defineProperties', 'setPrototypeOf']);
const REFLECT_MUTATORS = new Set(['set', 'defineProperty', 'deleteProperty', 'setPrototypeOf']);
const GLOBALS = new Set(['window', 'globalThis']);

const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`cannot read ${what} (${file}): ${e.message}`);
  }
};

// ── source analysis ──────────────────────────────────────────────────────────

const isFunctionLike = (n) => ts.isFunctionDeclaration(n) || ts.isFunctionExpression(n) || ts.isArrowFunction(n) || ts.isMethodDeclaration(n) || ts.isGetAccessorDeclaration(n) || ts.isSetAccessorDeclaration(n) || ts.isConstructorDeclaration(n);
const isClassLike = (n) => ts.isClassDeclaration(n) || ts.isClassExpression(n);
const hasModifier = (n, kind) => !!ts.canHaveModifiers(n) && !!ts.getModifiers(n)?.some((m) => m.kind === kind);

const unwrap = (e) => {
  while (ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e) || ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isTypeAssertionExpression(e)) e = e.expression;
  return e;
};
const isMember = (e) => ts.isPropertyAccessExpression(unwrap(e)) || ts.isElementAccessExpression(unwrap(e));
/** The expression a chain of member accesses starts from: `a.b[c].d` -> `a`. */
const rootOf = (e) => {
  e = unwrap(e);
  while (ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e)) e = unwrap(e.expression);
  return e;
};

/** If `n` writes to a member (assignment, ++/--, delete, a mutating call), the expression the written member starts from. */
const writeRoot = (n) => {
  if (ts.isBinaryExpression(n) && n.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && n.operatorToken.kind <= ts.SyntaxKind.LastAssignment && isMember(n.left)) return rootOf(n.left);
  if ((ts.isPrefixUnaryExpression(n) || ts.isPostfixUnaryExpression(n)) && (n.operator === ts.SyntaxKind.PlusPlusToken || n.operator === ts.SyntaxKind.MinusMinusToken) && isMember(n.operand)) return rootOf(n.operand);
  if (ts.isDeleteExpression(n) && isMember(n.expression)) return rootOf(n.expression);
  if (ts.isCallExpression(n)) {
    const callee = unwrap(n.expression);
    if (ts.isPropertyAccessExpression(callee)) {
      const target = unwrap(callee.expression);
      const name = callee.name.text;
      if (ts.isIdentifier(target) && ((target.text === 'Object' && OBJECT_MUTATORS.has(name)) || (target.text === 'Reflect' && REFLECT_MUTATORS.has(name))) && n.arguments[0]) return rootOf(n.arguments[0]);
      if (MUTATING.has(name)) return rootOf(target);
    }
  }
  return undefined;
};

const isCustomElementsDefine = (n) => {
  if (!ts.isCallExpression(n)) return false;
  const callee = unwrap(n.expression);
  if (!ts.isPropertyAccessExpression(callee) || callee.name.text !== 'define') return false;
  const t = unwrap(callee.expression);
  return (ts.isIdentifier(t) && t.text === 'customElements') || (ts.isPropertyAccessExpression(t) && t.name.text === 'customElements' && ts.isIdentifier(unwrap(t.expression)) && GLOBALS.has(unwrap(t.expression).text));
};

const bindingNames = (name, out = []) => {
  if (ts.isIdentifier(name)) out.push(name.text);
  else for (const el of name.elements) if (ts.isBindingElement(el)) bindingNames(el.name, out);
  return out;
};

/** Names declared by a function: parameters and every variable or function declared in its body, outside nested functions. */
const localNames = (fn) => {
  const names = new Set();
  for (const p of fn.parameters ?? []) bindingNames(p.name).forEach((x) => names.add(x));
  if (fn.name && ts.isIdentifier(fn.name) && ts.isFunctionExpression(fn)) names.add(fn.name.text);
  const visit = (n) => {
    if (ts.isVariableDeclaration(n)) bindingNames(n.name).forEach((x) => names.add(x));
    else if (ts.isFunctionDeclaration(n) && n.name) {
      names.add(n.name.text);
      return;
    }
    if (isFunctionLike(n)) return;
    ts.forEachChild(n, visit);
  };
  if (fn.body) ts.forEachChild(fn.body, visit);
  return names;
};

/** Visits every node below `node`; `scopes` is the stack of enclosing functions' local names. */
const walkAll = (node, visit, scopes = []) => {
  visit(node, scopes);
  const next = isFunctionLike(node) ? [...scopes, localNames(node)] : scopes;
  ts.forEachChild(node, (c) => walkAll(c, visit, next));
};

/** Visits the code that runs when the module is evaluated: not function bodies (except an immediately called one), only the static parts of a class. */
const walkTop = (node, visit) => {
  visit(node);
  if (isClassLike(node)) {
    for (const m of node.members) {
      if (ts.isClassStaticBlockDeclaration(m)) walkTop(m.body, visit);
      else if (ts.isPropertyDeclaration(m) && hasModifier(m, ts.SyntaxKind.StaticKeyword) && m.initializer) walkTop(m.initializer, visit);
    }
    return;
  }
  if (isFunctionLike(node)) return;
  if (ts.isCallExpression(node)) {
    const callee = unwrap(node.expression);
    if (isFunctionLike(callee) && callee.body) {
      walkTop(callee.body, visit);
      node.arguments.forEach((a) => walkTop(a, visit));
      return;
    }
  }
  ts.forEachChild(node, (c) => walkTop(c, visit));
};

/** The reasons a module holds module-level state: [{ what, line }]. Empty for a stateless module. */
export const analyse = (name, text) => {
  const sf = ts.createSourceFile(name, text, ts.ScriptTarget.ES2022, true, ts.ScriptKind.TS);
  const reasons = [];
  const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const add = (what, n) => reasons.push({ what, line: line(n) });
  const consts = new Set();
  const classes = new Map();

  for (const st of sf.statements) {
    if (ts.isVariableStatement(st)) {
      if (hasModifier(st, ts.SyntaxKind.DeclareKeyword)) continue;
      const flags = st.declarationList.flags;
      for (const d of st.declarationList.declarations) {
        for (const n of bindingNames(d.name)) {
          if (flags & ts.NodeFlags.Const) consts.add(n);
          else if (flags & ts.NodeFlags.Let) add(`top-level let ${n}`, d);
          else if (!(flags & (ts.NodeFlags.Using | ts.NodeFlags.AwaitUsing))) add(`top-level var ${n}`, d);
        }
      }
    } else if (ts.isClassDeclaration(st) && st.name && !hasModifier(st, ts.SyntaxKind.DeclareKeyword)) {
      classes.set(st.name.text, st);
      if ((ts.getDecorators(st) ?? []).some((d) => { const e = ts.isCallExpression(d.expression) ? d.expression.expression : d.expression; return ts.isIdentifier(e) && e.text === 'customElement'; })) add(`@customElement on ${st.name.text}`, st);
    }
    if (!ts.isFunctionDeclaration(st) && !ts.isInterfaceDeclaration(st) && !ts.isTypeAliasDeclaration(st)) {
      walkTop(st, (n) => {
        if (isCustomElementsDefine(n)) add('top-level customElements.define', n);
        const r = writeRoot(n);
        if (r && ts.isIdentifier(r) && GLOBALS.has(r.text)) add(`top-level write to ${r.text}`, n);
      });
    }
  }

  const statics = new Map();
  for (const [cname, c] of classes) {
    const own = c.members.filter((m) => hasModifier(m, ts.SyntaxKind.StaticKeyword) || ts.isClassStaticBlockDeclaration(m));
    statics.set(cname, own);
  }
  walkAll(sf, (n, scopes) => {
    const r = writeRoot(n);
    if (!r) return;
    if (ts.isIdentifier(r)) {
      if (scopes.some((s) => s.has(r.text))) return;
      if (consts.has(r.text)) add(`top-level const ${r.text} is mutated`, n);
      else if (statics.has(r.text)) add(`static field of ${r.text} is assigned`, n);
    } else if (r.kind === ts.SyntaxKind.ThisKeyword) {
      for (const [cname, own] of statics) {
        // `this` in a static method, static block or static initialiser is the class itself
        if (own.some((m) => m.pos <= n.pos && n.end <= m.end)) {
          add(`static field of ${cname} is assigned through this`, n);
          break;
        }
      }
    }
  });

  const seen = new Set();
  return reasons.filter((r) => !seen.has(r.what + r.line) && seen.add(r.what + r.line));
};

// ── the rule (pure) ──────────────────────────────────────────────────────────

const label = (c) => (c.files ?? []).find((f) => f.endsWith('.js')) ?? (c.names ?? []).join('+') ?? String(c.id);

/** The chunks of the card bundle: the magic-card.js entry chunk and every chunk whose parents lead to it. */
export const cardBundle = (chunks) => {
  const entry = chunks.find((c) => c.entry && (c.files ?? []).includes(ENTRY));
  if (!entry) return { entry: undefined, bundle: [] };
  const inBundle = new Set([entry.id]);
  for (let grew = true; grew; ) {
    grew = false;
    for (const c of chunks) if (!inBundle.has(c.id) && (c.parents ?? []).some((p) => inBundle.has(p))) inBundle.add(c.id), (grew = true);
  }
  return { entry, bundle: chunks.filter((c) => inBundle.has(c.id)) };
};

const fixedState = (m) => (STATEFUL.modules.includes(m) || STATEFUL.dirs.some((d) => m.startsWith(d)) ? [{ what: 'listed as stateful by the checker', line: 0 }] : []);

/**
 * Returns { problems, notes }. `chunks`: the entry graph; `stateless`: [{ module, reason }]; `sourceOf(module)`: the source text.
 * Every module found in more than one chunk of the card bundle is reported with its chunks and bytes; it is a problem when it
 * holds state and is not in `stateless`.
 */
export const evaluate = ({ chunks, stateless = [], sourceOf }) => {
  const problems = [];
  const notes = [];
  const { entry, bundle } = cardBundle(chunks);
  if (!entry) return { problems: [`no entry chunk holds ${ENTRY}`], notes };
  const where = new Map();
  for (const c of bundle) for (const m of new Set(c.modules ?? [])) where.set(m, [...(where.get(m) ?? []), c]);
  const allowed = new Map();
  for (const s of stateless) {
    if (!s || typeof s.module !== 'string' || typeof s.reason !== 'string' || !s.reason.trim()) problems.push(`chunk-dups.json: ${JSON.stringify(s)} needs a module and a non-empty reason`);
    else if (allowed.has(s.module)) problems.push(`chunk-dups.json: ${s.module} is listed twice`);
    else allowed.set(s.module, s.reason);
  }
  const flaggedStateful = new Set();
  let stateless_bytes = 0;
  let stateless_n = 0;
  for (const [m, copies] of [...where].filter(([, cs]) => cs.length > 1).sort(([a], [b]) => (a < b ? -1 : 1))) {
    const bytes = (c) => c.size?.[m];
    const list = copies.map((c) => `${label(c)}${bytes(c) === undefined ? '' : ` ${bytes(c)} B`}`).join(', ');
    let reasons = fixedState(m);
    if (!reasons.length && m.endsWith('.ts')) {
      let text;
      try {
        text = sourceOf(m);
      } catch (e) {
        problems.push(`${m} is in ${copies.length} chunks (${list}) and its source cannot be read: ${e.message}`);
        continue;
      }
      reasons = analyse(m, text);
    }
    if (reasons.length) flaggedStateful.add(m);
    const why = reasons.map((r) => (r.line ? `${r.what} (line ${r.line})` : r.what)).join('; ');
    if (!reasons.length) {
      stateless_n++;
      stateless_bytes += copies.slice(1).reduce((s, c) => s + (bytes(c) ?? 0), 0);
      notes.push(`${m} is copied in ${copies.length} chunks (${list}); no module-level state`);
    } else if (allowed.has(m)) notes.push(`${m} is copied in ${copies.length} chunks (${list}); listed as stateless: ${allowed.get(m)}`);
    else problems.push(`${m} is in ${copies.length} chunks of ${ENTRY}'s bundle (${list}) and holds state: ${why}`);
  }
  for (const m of allowed.keys()) if (!flaggedStateful.has(m)) problems.push(`chunk-dups.json: ${m} is stale (not a stateful module copied in several chunks)`);
  notes.push(`${stateless_n} stateless modules copied, ${stateless_bytes} B in extra copies (before minification)`);
  return { problems, notes };
};

// ── self test ────────────────────────────────────────────────────────────────

const selfTest = () => {
  const chunk = (id, file, modules, extra = {}) => ({ id, files: [file], names: [file.replace(/\.js$/, '')], modules, size: Object.fromEntries(modules.map((m) => [m, 100])), ...extra });
  const entry = chunk(0, 'magic-card.js', ['./src/index.ts'], { entry: true, parents: [] });
  const seasonal = chunk(1, 'magic-card-seasonal.js', ['./src/seasonal/seasonal-preview.ts'], { parents: [0] });
  const editor = chunk(2, 'magic-card-editor.js', ['./src/seasonal/seasonal-preview.ts'], { parents: [0] });
  const studio = chunk(9, 'animation-studio.js', ['./src/seasonal/seasonal-preview.ts'], { entry: true, parents: [] });
  const P = './src/seasonal/seasonal-preview.ts';
  const src = {
    let: 'let previewDate: string | undefined;\nexport const get = () => previewDate;',
    exportLet: 'export let previewDate = 0;',
    var: 'var previewDate = 0;',
    map: 'const cache = new Map<string, number>();\nexport const put = (k: string) => { cache.set(k, 1); };',
    constLeaf: "const FIELDS = ['a', 'b'];\nexport const first = () => FIELDS[0];",
    local: 'export const f = () => { let n = 0; n++; return n; };',
    declare: 'declare let __DEV__: boolean;\nexport const f = () => __DEV__;',
    define: "class A extends HTMLElement {}\ncustomElements.define('mc-a', A);",
    hooks: 'let epoch = 0;\nexport const bump = () => ++epoch;',
    anim: 'export const x = 1;',
  };
  const sourceOf = (m) => {
    const key = m.startsWith('./src/anim-studio/') ? 'anim' : m.endsWith('/anim-hooks.ts') ? 'hooks' : m.endsWith('/map.ts') ? 'map' : m.endsWith('/leaf.ts') ? 'constLeaf' : m.endsWith('/define.ts') ? 'define' : m.endsWith('/local.ts') ? 'local' : m.endsWith('/declare.ts') ? 'declare' : m.endsWith('/exportlet.ts') ? 'exportLet' : m.endsWith('/var.ts') ? 'var' : 'let';
    return src[key];
  };
  const two = (mod) => [entry, chunk(1, 'magic-card-a.js', [mod], { parents: [0] }), chunk(2, 'magic-card-b.js', [mod], { parents: [0] })];
  const cases = [
    ['a let module in the seasonal and editor chunks fails', { chunks: [entry, seasonal, editor] }, 1],
    ['a const Map that is mutated, in two sibling chunks, fails', { chunks: two('./src/x/map.ts') }, 1],
    ['export let in two chunks fails', { chunks: two('./src/x/exportlet.ts') }, 1],
    ['var in two chunks fails', { chunks: two('./src/x/var.ts') }, 1],
    ['an anim-studio module in two chunks fails', { chunks: two('./src/anim-studio/helper.ts') }, 1],
    ['a stale stateless entry fails', { chunks: [entry, seasonal], stateless: [{ module: P, reason: 'stale' }] }, 1],
    ['customElements.define in two chunks fails', { chunks: two('./src/x/define.ts') }, 1],
    ['an unmutated const leaf in two chunks passes', { chunks: two('./src/x/leaf.ts') }, 0],
    ['state in the entry chunk only passes', { chunks: [chunk(0, 'magic-card.js', [P], { entry: true, parents: [] }), chunk(1, 'magic-card-a.js', ['./src/x/leaf.ts'], { parents: [0] })] }, 0],
    ['a let inside a function in two chunks passes', { chunks: two('./src/x/local.ts') }, 0],
    ['a stateless entry with a reason passes', { chunks: [entry, seasonal, editor], stateless: [{ module: P, reason: 'a test reason' }] }, 0],
    ['a stateful module in the card bundle and in another entry passes', { chunks: [entry, seasonal, studio] }, 0],
    ['declare let in two chunks passes', { chunks: two('./src/x/declare.ts') }, 0],
    ['anim-hooks.ts in the entry chunk only passes', { chunks: [chunk(0, 'magic-card.js', ['./src/utils/anim-hooks.ts'], { entry: true, parents: [] }), chunk(1, 'magic-card-a.js', ['./src/x/leaf.ts'], { parents: [0] })] }, 0],
    ['a child of a child counts as part of the bundle', { chunks: [entry, chunk(1, 'magic-card-a.js', [], { parents: [0] }), chunk(2, 'magic-card-b.js', [P], { parents: [1] }), chunk(3, 'magic-card-c.js', [P], { parents: [0] })] }, 1],
    ['a stateless entry without a reason fails', { chunks: [entry, seasonal, editor], stateless: [{ module: P, reason: ' ' }] }, 2],
    ['a stateless module listed twice fails', { chunks: [entry, seasonal, editor], stateless: [{ module: P, reason: 'a' }, { module: P, reason: 'b' }] }, 1],
    ['no magic-card.js entry fails', { chunks: [seasonal, editor] }, 1],
  ];
  let bad = 0;
  for (const [name, input, want] of cases) {
    const got = evaluate({ sourceOf, ...input }).problems.length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  const sources = [
    ['const m = new Map();\nm.set(1, 2);', 1],
    ['const m = new Map();\nexport const f = () => m.get(1);', 0],
    ['const o = { n: 0 };\nexport const f = () => { o.n++; };', 1],
    ['const o: Record<string, number> = {};\nexport const f = (k: string) => { delete o[k]; };', 1],
    ['const a: number[] = [];\nexport const f = () => { const a = [1]; a.push(2); return a; };', 0],
    ['const a: number[] = [];\nexport const f = (a: number[]) => a.sort();', 0],
    ['class K { static n = 0; static bump() { this.n++; } }\nexport { K };', 1],
    ['class K { static n = 0; }\nK.n = 2;', 1],
    ['class K { n = 0; bump() { this.n++; } }\nexport { K };', 0],
    ['class K { static { this.n = 1; } static n: number; }', 1],
    ["@customElement('mc-a')\nclass A extends HTMLElement {}", 1],
    ["class A extends HTMLElement {}\nif (!customElements.get('mc-a')) customElements.define('mc-a', A);", 1],
    ["export const f = () => customElements.define('mc-a', class extends HTMLElement {});", 0],
    ["(window as any).__mc = 1;", 1],
    ['globalThis.mc = 1;', 1],
    ['export const f = () => { window.mc = 1; };', 0],
    ['(() => { window.mc = 1; })();', 1],
    ['const { a, b } = { a: [1], b: [2] };\nexport const f = () => { b.push(3); };', 1],
    ['export const f = () => { for (let i = 0; i < 2; i++) { void i; } };', 0],
    ['for (let i = 0; i < 2; i++) { void i; }', 0],
  ];
  for (const [text, want] of sources) {
    const got = analyse('x.ts', text).length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: source ${JSON.stringify(text)} (expected ${want} reasons, got ${got})`);
    }
  }
  if (bad) process.exit(1);
  console.log(`chunk-dups self-test: ${cases.length} graph cases and ${sources.length} source cases ok`);
};

const main = () => {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();
  const file = args.find((a) => !a.startsWith('--'));
  const rules = readJson(path.join(root, RULES_REL), RULES_REL);
  const stats = readJson(file ? path.resolve(file) : STATS_DEFAULT, 'entry-graph stats');
  if (!stats.chunks?.length || !stats.chunks.some((c) => 'parents' in c)) throw new Error('the stats have no chunk parents (run a production build: npm run build)');
  if (!Array.isArray(rules.stateless)) throw new Error(`${RULES_REL} needs a "stateless" array`);
  const sourceOf = (m) => readFileSync(path.join(root, m.replace(/^\.\//, '')), 'utf8');
  const { problems, notes } = evaluate({ chunks: stats.chunks, stateless: rules.stateless, sourceOf });
  for (const n of notes) console.log(`chunk-dups: ${n}`);
  const n = cardBundle(stats.chunks).bundle.length;
  if (problems.length) {
    for (const p of problems) console.error(`chunk-dups: ${p}`);
    console.error(`chunk-dups: FAIL (${problems.length} problem${problems.length === 1 ? '' : 's'}, ${n} chunks in the card bundle)`);
    process.exit(1);
  }
  console.log(`chunk-dups: ok, no module with state sits in more than one of the ${n} card bundle chunks, ${rules.stateless.length} stateless entries`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`chunk-dups: ${e.message}`);
    process.exit(1);
  }
}
