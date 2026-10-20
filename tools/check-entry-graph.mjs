// Entry-graph gate (proj.M11, AC8). Reads the webpack stats written by webpack.config.js
// (node_modules/.cache/magic-card/entry-graph.json, production build) and the rules in tools/entry-graph.json.
//
// The modules of the chunk that holds magic-card.js are the run-time graph of the card entry: ts-loader
// removes `import type`, and every import() makes its own chunk. Three failures:
//   1. a forbidden module is in the entry chunk and not in the `debt` list (a new forbidden import);
//   2. a `debt` entry is no longer in the entry chunk (fixed: delete it, so the list can only shrink and a
//      regression of a fixed entry is a new violation again);
//   3. the `debt` list holds an entry the base file (git show <base>:tools/entry-graph.json) did not (it grew).
// Removing an entry from `debt` without fixing the import is failure 1.
//
// Usage: node tools/check-entry-graph.mjs [stats.json]    check the last production build
//        node tools/check-entry-graph.mjs --self-test     run the rule against synthetic graphs
// Env:   ENTRY_GRAPH_BASE  git ref for the base debt list (default origin/main; no base file or ref = skip rule 3)
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RULES_REL = 'tools/entry-graph.json';
const STATS_DEFAULT = path.join(root, 'node_modules/.cache/magic-card/entry-graph.json');

const readJson = (file, what) => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`cannot read ${what} (${file}): ${e.message}`);
  }
};

// the forbidden modules of one module list, sorted
export const violations = (modules, rules) => {
  const dirs = rules.forbidden_dirs.map((d) => `./${d.replace(/\/?$/, '/')}`);
  const allowed = new Set(rules.contracts_allowed.map((c) => `./src/contracts/${c}.ts`));
  const contractDir = './src/contracts/';
  return [...new Set(modules)]
    .filter((m) => dirs.some((d) => m.startsWith(d)) || (m.startsWith(contractDir) && !allowed.has(m) && !m.endsWith('.needs.ts')))
    .sort();
};

// pure rule: returns the list of problems (empty = pass)
export const evaluate = ({ modules, rules, baseDebt = null }) => {
  const problems = [];
  const debt = rules.debt ?? [];
  if (new Set(debt).size !== debt.length) problems.push('debt list has duplicate entries');
  const found = violations(modules, rules);
  const inDebt = new Set(debt);
  for (const m of found) if (!inDebt.has(m)) problems.push(`new forbidden import in the entry graph: ${m} (fix the import; it may not be added to debt)`);
  for (const m of debt) {
    if (!found.includes(m)) problems.push(`debt entry no longer in the entry graph: ${m} (delete it from ${RULES_REL}, the list only shrinks)`);
  }
  if (baseDebt) for (const m of debt) if (!baseDebt.includes(m)) problems.push(`debt entry not in the base list: ${m} (the debt list may only shrink)`);
  return problems;
};

const entryModules = (stats, entryFile) => {
  const chunk = (stats.chunks ?? []).find((c) => c.entry && (c.files ?? []).includes(entryFile));
  if (!chunk) throw new Error(`no entry chunk with file ${entryFile} in the stats (run a production build: npm run build)`);
  if (!chunk.modules?.length) throw new Error(`entry chunk ${entryFile} lists no modules (stats written without chunkModules?)`);
  return chunk.modules;
};

const baseDebtList = () => {
  const ref = process.env.ENTRY_GRAPH_BASE || 'origin/main';
  try {
    const out = execFileSync('git', ['show', `${ref}:${RULES_REL}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return JSON.parse(out).debt ?? [];
  } catch {
    return null; // no base ref or no base file yet: no raises possible
  }
};

const selfTest = () => {
  const rules = {
    forbidden_dirs: ['src/editor', 'src/ui-kit', 'src/anim-studio', 'src/flow-look', 'src/look-editor'],
    contracts_allowed: ['entity-scope', 'entity-colour', 'i18n', 'mcu-templates'],
    debt: ['./src/anim-studio/compile.ts', './src/contracts/card-pause.ts'],
  };
  const clean = ['./src/index.ts', './src/card/magic-card.ts', './src/contracts/entity-scope.ts', './src/contracts/slider-look.needs.ts', './src/editor-loader-like.ts'];
  const withDebt = [...clean, './src/anim-studio/compile.ts', './src/contracts/card-pause.ts'];
  const cases = [
    ['today passes', { modules: withDebt, rules }, 0],
    ['new editor import fails', { modules: [...withDebt, './src/editor/card-editor.ts'], rules }, 1],
    ['new ui-kit import fails', { modules: [...withDebt, './src/ui-kit/button.ts'], rules }, 1],
    ['new non-allowed contract fails', { modules: [...withDebt, './src/contracts/bg-stack.ts'], rules }, 1],
    ['allowed contract and *.needs.ts pass', { modules: [...withDebt, './src/contracts/i18n.ts', './src/contracts/x.needs.ts'], rules }, 0],
    ['debt entry removed without a fix fails', { modules: withDebt, rules: { ...rules, debt: ['./src/anim-studio/compile.ts'] } }, 1],
    ['fixed entry left in debt fails', { modules: clean, rules }, 2],
    ['fixed entry deleted from debt passes', { modules: [...clean, './src/anim-studio/compile.ts'], rules: { ...rules, debt: ['./src/anim-studio/compile.ts'] } }, 0],
    ['debt grown past the base fails', { modules: withDebt, rules, baseDebt: ['./src/anim-studio/compile.ts'] }, 1],
    ['debt equal to the base passes', { modules: withDebt, rules, baseDebt: withDebt.slice(-2) }, 0],
    ['duplicate debt entry fails', { modules: withDebt, rules: { ...rules, debt: [...rules.debt, rules.debt[0]] } }, 1],
  ];
  let bad = 0;
  for (const [name, input, want] of cases) {
    const got = evaluate(input).length;
    if (got !== want) {
      bad++;
      console.error(`self-test FAIL: ${name} (expected ${want} problems, got ${got})`);
    }
  }
  if (bad) process.exit(1);
  console.log(`entry-graph self-test: ${cases.length} cases ok`);
};

const main = () => {
  const arg = process.argv[2];
  if (arg === '--self-test') return selfTest();
  const rules = readJson(path.join(root, RULES_REL), RULES_REL);
  const stats = readJson(arg ? path.resolve(arg) : STATS_DEFAULT, 'entry-graph stats');
  const modules = entryModules(stats, rules.entry);
  const baseDebt = baseDebtList();
  const problems = evaluate({ modules, rules, baseDebt });
  const n = violations(modules, rules).length;
  if (problems.length) {
    for (const p of problems) console.error(`entry-graph: ${p}`);
    console.error(`entry-graph: FAIL (${problems.length} problem${problems.length === 1 ? '' : 's'}, ${modules.length} modules in ${rules.entry})`);
    process.exit(1);
  }
  console.log(`entry-graph: ok, ${modules.length} modules in ${rules.entry}, ${n} known violations in debt${baseDebt ? '' : ' (no base list found: growth check skipped)'}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`entry-graph: ${e.message}`);
    process.exit(1);
  }
}
