// AC2: an unknown key, or a missing or extra ICU {var}, fails tsc (generated key types, npm run typecheck).
// Contract: src/contracts/i18n-keys.ts "Types". The generated keys.gen.ts is written beside the namespace by the
// build; the namespace's index.ts exports t / tx / m typed over its Keys interface (KeyedI18n).
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { cleanupProjects, keyedProject, Project, REPO, type RunResult } from './harness';

afterAll(cleanupProjects);

const ENTRIES = [
  { key: 'demo.panel.title', text: 'Hello', nl: 'Hallo', max: 20 },
  { key: 'demo.panel.hi', text: 'Hi {name}', nl: 'Hoi {name}', max: 30, vars: { name: 'Name of the person' } },
  { key: 'demo.panel.count', text: '{n, plural, one {# item} other {# items}}', nl: '{n, plural, one {# item} other {# items}}', max: 30, vars: { n: 'Number of items' } },
  { key: 'demo.panel.kind', text: '{kind, select, line {A line} other {Something else}}', nl: '{kind, select, line {Een lijn} other {Iets anders}}', max: 30, vars: { kind: 'Kind of shape' } },
];

function typedProject(): Project {
  const p = keyedProject(ENTRIES, []);
  expect(p.build().code).toBe(0);
  // the typed index of a namespace: t / tx / m over the generated Keys
  p.write(
    'src/demo/i18n/index.ts',
    `import type { KeyedI18n } from '../../contracts/i18n-keys';
import type { Keys } from './keys.gen';
declare const impl: KeyedI18n<Keys>;
export const t = impl.t;
export const tx = impl.tx;
export const m = impl.m;
`,
  );
  return p;
}

function tsc(p: Project, usage: string): RunResult {
  p.write('src/demo/usage.ts', `import { t, tx, m } from './i18n';\n${usage}\n`);
  p.writeJson('tsconfig.json', {
    compilerOptions: { strict: true, noEmit: true, target: 'ES2021', module: 'ESNext', moduleResolution: 'bundler', skipLibCheck: true, types: [], lib: ['ES2021', 'DOM'] },
    files: ['src/demo/usage.ts'],
  });
  const r = spawnSync(process.execPath, [path.join(REPO, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], { cwd: p.root, encoding: 'utf8', timeout: 120_000 });
  return { code: r.status ?? -1, out: r.stdout ?? '', err: r.stderr ?? '', all: `${r.stdout}\n${r.stderr}` };
}

let shared: Project | undefined;
const project = () => (shared ??= typedProject());

describe('AC2 generated key types', () => {
  it('writes src/<folder>/i18n/keys.gen.ts with one entry per key and the English as its doc comment', () => {
    const p = project();
    expect(p.exists('src/demo/i18n/keys.gen.ts')).toBe(true);
    const src = p.read('src/demo/i18n/keys.gen.ts');
    for (const e of ENTRIES) {
      expect(src).toContain(`"${e.key}"`);
      // the English sits in a doc comment (the dev preview, AC9)
      expect(src).toContain('/** ' + e.text + ' */');
    }
  });

  it('compiles correct calls: no argument, a plain argument, a plural argument, a select argument, tx and m', () => {
    const r = tsc(
      project(),
      `export const a = t('demo.panel.title');
export const b = t('demo.panel.hi', { name: 'Ada' });
export const b2 = t('demo.panel.hi', { name: 5 });
export const c = t('demo.panel.count', { n: 3 });
export const d = t('demo.panel.kind', { kind: 'line' });
export const e = tx('demo.panel.hi', { name: { html: true } });
export const f = m('demo.panel.title');`,
    );
    expect(r.all).not.toMatch(/error TS/);
    expect(r.code).toBe(0);
  });

  it.each([
    ['an unknown key', "t('demo.panel.nope');"],
    ['a key of another namespace', "t('other.panel.title');"],
    ['British text instead of a key', "t('Hello');"],
    ['a missing argument', "t('demo.panel.hi');"],
    ['a missing plural argument', "t('demo.panel.count');"],
    ['an argument with the wrong name', "t('demo.panel.hi', { who: 'Ada' });"],
    ['an extra argument', "t('demo.panel.hi', { name: 'Ada', extra: 1 });"],
    ['an argument on a message that has none', "t('demo.panel.title', { n: 1 });"],
    ['a text for a plural argument', "t('demo.panel.count', { n: 'three' });"],
    ['an unknown key in m()', "m('demo.panel.nope');"],
  ])('fails tsc for %s', (_why, call) => {
    const r = tsc(project(), call);
    expect(r.code).not.toBe(0);
    expect(r.all).toMatch(/error TS\d+/);
    expect(r.all).toContain('usage.ts');
  });
});
