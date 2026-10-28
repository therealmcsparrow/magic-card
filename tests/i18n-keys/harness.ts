// Shared helpers of the tests/i18n-keys suites (not a test file). Every tool test runs the real tools from this
// repository on a throw-away project in the OS temp folder, so nothing in the working tree (src/, dist/, i18n/)
// is read, written or rebuilt. The project is a copy of tools/ and src/contracts/ with a fixture config: two
// namespaces, 'demo' (src/demo/i18n) and 'other' (src/other/i18n), and a contract whose I18N_MODULES lists only
// those two with I18N_RELEASE_STRICT off (a run is strict only with --strict).
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Reference implementation of the contract's sourceHash (src/contracts/i18n-keys.ts, "Source hash"). */
export const sourceHash = (text: string): string => crypto.createHash('sha256').update(text.normalize('NFC'), 'utf8').digest('hex').slice(0, 8);

export const NAMESPACES = { demo: 'src/demo/i18n', other: 'src/other/i18n' } as const;
export type Ns = keyof typeof NAMESPACES;

export interface RunResult {
  code: number;
  out: string;
  err: string;
  all: string;
}

const MODULE_ENTRY = "{ bundle: 'fixture.js', folders: [], tables: 'inline', status: 'complete', slice: 'fixture', dashboard: false }";

let templateDir: string | undefined;

function copyDir(from: string, to: string, skip: (rel: string) => boolean = () => false): void {
  fs.cpSync(from, to, { recursive: true, filter: (src) => !skip(path.relative(from, src).split(path.sep).join('/')) });
}

/** One shared template per test process; the tools are copied once, projects are copied from it. */
function template(): string {
  if (templateDir) return templateDir;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-i18n-keys-tpl-'));
  copyDir(path.join(REPO, 'tools'), path.join(dir, 'tools'), (r) => r.startsWith('node_modules'));
  // QA self-check only: MC_QA_TOOLS_OVERLAY=<dir> lays reference tools over the copy to prove the tests themselves
  if (process.env.MC_QA_TOOLS_OVERLAY) copyDir(process.env.MC_QA_TOOLS_OVERLAY, path.join(dir, 'tools'));
  fs.mkdirSync(path.join(dir, 'src/i18n'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'src/utils'), { recursive: true });
  copyDir(path.join(REPO, 'src/contracts'), path.join(dir, 'src/contracts'));
  fs.copyFileSync(path.join(REPO, 'src/i18n/runtime.ts'), path.join(dir, 'src/i18n/runtime.ts'));
  fs.copyFileSync(path.join(REPO, 'src/utils/locale-format.ts'), path.join(dir, 'src/utils/locale-format.ts'));
  fs.copyFileSync(path.join(REPO, 'package.json'), path.join(dir, 'package.json'));
  // the fixture contract: two namespaces, strict off by default
  const cf = path.join(dir, 'src/contracts/i18n.ts');
  let c = fs.readFileSync(cf, 'utf8');
  c = c.replace(/export const I18N_MODULES = \{[\s\S]*?\n\} as const satisfies Record<string, I18nModuleEntry>;/, `export const I18N_MODULES = {\n  demo: ${MODULE_ENTRY},\n  other: ${MODULE_ENTRY},\n} as const satisfies Record<string, I18nModuleEntry>;`);
  c = c.replace(/export const I18N_RELEASE_STRICT = true;/, 'export const I18N_RELEASE_STRICT = false;');
  fs.writeFileSync(cf, c);
  const cfg = { namespaces: { demo: { dir: NAMESPACES.demo, roots: ['src/demo'] }, other: { dir: NAMESPACES.other, roots: ['src/other'] } } };
  fs.writeFileSync(path.join(dir, 'tools/i18n/config.json'), JSON.stringify(cfg, null, 2) + '\n');
  fs.writeFileSync(path.join(dir, 'tools/i18n/baseline.json'), '{\n  "demo": 0,\n  "other": 0\n}\n');
  fs.writeFileSync(path.join(dir, 'tools/i18n/en-US-exceptions.json'), '{}\n');
  fs.rmSync(path.join(dir, 'tools/i18n/legacy-count.json'), { force: true });
  templateDir = dir;
  return dir;
}

const created: string[] = [];
export function cleanupProjects(): void {
  for (const d of created.splice(0)) fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  if (templateDir) fs.rmSync(templateDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  templateDir = undefined;
}

/** How a fixture source file in src/<ns>/ imports its own namespace's i18n module. */
export const importLine = (_ns: Ns, names = 't'): string => `import { ${names} } from './i18n';\n`;

export class Project {
  readonly root: string;
  constructor() {
    this.root = fs.mkdtempSync(path.join(os.tmpdir(), 'mc-i18n-keys-'));
    created.push(this.root);
    fs.cpSync(template(), this.root, { recursive: true });
    for (const ns of Object.keys(NAMESPACES) as Ns[]) {
      // a plain index.ts marks the namespace active; the typed index of the keyed phase is written by the type tests
      this.write(`${NAMESPACES[ns]}/index.ts`, `export const t = (id: string, args?: Record<string, unknown>): string => id + JSON.stringify(args ?? {});\nexport const tc = t as unknown as (c: string, id: string) => string;\nexport const tx = t;\nexport const m = (id: string): string => id;\n`);
    }
  }

  abs(rel: string): string {
    return path.join(this.root, rel);
  }
  write(rel: string, content: string): void {
    fs.mkdirSync(path.dirname(this.abs(rel)), { recursive: true });
    fs.writeFileSync(this.abs(rel), content);
  }
  writeJson(rel: string, value: unknown): void {
    this.write(rel, JSON.stringify(value, null, 2) + '\n');
  }
  read(rel: string): string {
    return fs.readFileSync(this.abs(rel), 'utf8');
  }
  json<T = any>(rel: string): T {
    return JSON.parse(this.read(rel)) as T;
  }
  exists(rel: string): boolean {
    return fs.existsSync(this.abs(rel));
  }

  /** Runs `node <script> ...args` in the project. */
  run(script: string, ...args: string[]): RunResult {
    const r = spawnSync(process.execPath, ['--max-old-space-size=768', path.join(this.root, script), ...args], {
      cwd: this.root,
      encoding: 'utf8',
      timeout: 90_000,
      env: { ...process.env, NODE_PATH: path.join(REPO, 'node_modules'), CI: '', I18N_RELEASE_STRICT: '' },
    });
    return { code: r.status ?? -1, out: r.stdout ?? '', err: r.stderr ?? '', all: `${r.stdout ?? ''}\n${r.stderr ?? ''}` };
  }
  check(...flags: string[]): RunResult {
    return this.run('tools/check-i18n.mjs', ...flags);
  }
  build(): RunResult {
    return this.run('tools/i18n-build.mjs');
  }
  rename(from: string, to: string): RunResult {
    return this.run('tools/i18n-rename.mjs', from, to);
  }
  flat(...args: string[]): RunResult {
    return this.run('tools/i18n-flat.mjs', ...args);
  }

  /** Runs the project's webpack pre-loader on a source (in a child process, with the repository's node_modules). */
  loader(rel: string, source: string): { out: string; errors: string[] } {
    const script = `const loader = require(${JSON.stringify(path.join(this.root, 'tools/i18n-loader.cjs'))});
const errors = [];
const input = JSON.parse(process.argv[1]);
const out = loader.call({ resourcePath: input.file, addDependency() {}, emitError(e) { errors.push(e.message); } }, input.source);
process.stdout.write(JSON.stringify({ out, errors }));`;
    const r = spawnSync(process.execPath, ['-e', script, JSON.stringify({ file: this.abs(rel), source })], {
      cwd: this.root,
      encoding: 'utf8',
      env: { ...process.env, NODE_PATH: path.join(REPO, 'node_modules') },
    });
    if (r.status !== 0) throw new Error('loader crashed: ' + r.stderr);
    return JSON.parse(r.stdout);
  }

  /** Every file under the project except tools/, as relative path -> bytes (for "nothing was written" checks). */
  snapshot(): Record<string, string> {
    const out: Record<string, string> = {};
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        const r = path.relative(this.root, p).split(path.sep).join('/');
        if (r === 'tools' || r === 'package.json') continue;
        if (e.isDirectory()) walk(p);
        else out[r] = fs.readFileSync(p).toString('base64');
      }
    };
    walk(this.root);
    return out;
  }

  /** The three tables of a namespace's messages.gen.ts as arrays of entries (en-GB, en-US, nl). */
  tables(ns: Ns): [string[], string[], string[]] {
    const src = this.read(`${NAMESPACES[ns]}/messages.gen.ts`);
    const arr = src.slice(src.indexOf('= [') + 2, src.lastIndexOf(']') + 1);
    const cells = JSON.parse(arr.replace(/,\s*\]$/, ']')) as string[];
    return cells.map((c) => c.split('|')) as [string[], string[], string[]];
  }
}

// ── fixture catalogue builders ──

export interface KeyedEntry {
  key: string;
  text: string;
  note?: string;
  max?: number;
  vars?: Record<string, string>;
  nl?: string;
  /** nl hash; default: the hash of `text` (a confirmed translation). */
  nlHash?: string;
}

/** Writes en-GB.json (source), nl.json (translations) of a keyed namespace. en-US.json comes from the build. */
export function writeKeyed(p: Project, ns: Ns, entries: KeyedEntry[]): void {
  const dir = NAMESPACES[ns];
  const sorted = [...entries].sort((a, b) => (a.key < b.key ? -1 : 1));
  const en: Record<string, unknown> = {};
  const nl: Record<string, unknown> = {};
  for (const e of sorted) {
    const entry: Record<string, unknown> = { text: e.text, note: e.note ?? 'Shown in the demo panel for the tests.', max: e.max ?? 60 };
    if (e.vars) entry.vars = e.vars;
    en[e.key] = entry;
    nl[e.key] = { text: e.nl ?? e.text, hash: e.nlHash ?? sourceHash(e.text) };
  }
  p.writeJson(`${dir}/en-GB.json`, en);
  p.writeJson(`${dir}/nl.json`, nl);
}

/** Legacy (text id) catalogues: nl.json is text -> Dutch. */
export function writeLegacy(p: Project, ns: Ns, nl: Record<string, string>): void {
  p.writeJson(`${NAMESPACES[ns]}/nl.json`, nl);
}

/** A source file that calls t() once per id, importing the namespace's i18n module. */
export function callerSource(ns: Ns, ids: string[], fn = 't'): string {
  const lit = (id: string) => "'" + id.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  return importLine(ns, fn) + ids.map((id, i) => `export const c${i} = ${fn}(${lit(id)});\n`).join('');
}

/** A demo project with one keyed namespace, built once (en-US generated, tables written). */
export function keyedProject(entries: KeyedEntry[], calls: string[] = entries.map((e) => e.key)): Project {
  const p = new Project();
  writeKeyed(p, 'demo', entries);
  p.write('src/demo/panel.ts', callerSource('demo', calls));
  return p;
}

export const messages = (r: RunResult): string => r.all;
