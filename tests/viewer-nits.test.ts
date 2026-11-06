// Acceptance checks for the small follow-ups of the key and kernel run that have no suite of their own:
// the tools lint with node globals, the svg-sink check reading the contract, the clock line height guard,
// the i18n contract row slice and the CI workflow without bootstrap branches.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { I18N_MODULES } from '../src/contracts/i18n';
import { LAZY_SHARED_CHUNK_FILES } from '../src/contracts/lazy-module';
import { clockMinHeight } from '../src/modules/lazy-heights';

const root = path.resolve(__dirname, '..');
const read = (rel: string) => readFileSync(path.join(root, rel), 'utf8');
const run = (args: string[]) => spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

describe('tools are linted with node globals', () => {
  it('has no lint error in tools/*.mjs and tools/*.cjs', () => {
    const eslint = path.join(root, 'node_modules', 'eslint', 'bin', 'eslint.js');
    const r = run([eslint, 'tools/**/*.{mjs,cjs}']);
    expect(r.status, r.stdout + r.stderr).toBe(0);
  }, 120_000);

  it('lints the tools in the lint script and in lint:fix', () => {
    const scripts = JSON.parse(read('package.json')).scripts as Record<string, string>;
    expect(scripts.lint).toContain('tools/**/*.{mjs,cjs}');
    expect(scripts['lint:fix']).toContain('tools/**/*.{mjs,cjs}');
  });

  it('gives .mjs and .cjs tools the node globals in the eslint config', () => {
    const cfg = read('eslint.config.mjs');
    expect(cfg).toMatch(/files: \['tools\/\*\*\/\*\.mjs'\][\s\S]{0,200}globals\.node/);
    expect(cfg).toMatch(/files: \['tools\/\*\*\/\*\.cjs'\][\s\S]{0,200}globals\.node/);
  });
});

describe('svg sink check and the shared chunk list', () => {
  it('passes its own self-test', () => {
    const r = run(['tools/check-svg-sinks.mjs', '--self-test']);
    expect(r.status, r.stdout + r.stderr).toBe(0);
    expect(r.stdout).toMatch(/self-test: \d+ cases ok/);
  });

  it('keeps no copy of the shared module list: the contract is the only place', () => {
    const src = read('tools/check-svg-sinks.mjs');
    expect(src).not.toMatch(/SHARED_CHUNK_MODULES\s*=\s*\{/);
    expect(src).toContain('LAZY_SHARED_CHUNK_CEILINGS');
  });

  it('names a module line in the contract for every shared chunk the build knows', () => {
    const contract = read('src/contracts/lazy-module.ts');
    const ceilings = /export const LAZY_SHARED_CHUNK_CEILINGS[^=]*=\s*\{([^}]*)\}/.exec(contract)![1];
    for (const key of Object.keys(LAZY_SHARED_CHUNK_FILES)) {
      expect(ceilings, key).toMatch(new RegExp(`/\\*\\*[^*]*src/[^*]*\\.ts[^*]*only[^*]*\\*/\\s*['"]?${key}['"]?\\s*:`));
    }
  });
});

describe('clock line height guard', () => {
  const fallback = 'calc(2.875rem * 1.17)';

  it('falls back to the default for a value that is not a finite number', () => {
    for (const lh of [NaN, Infinity, -Infinity, -0.5, 0, 'NaN', 'Infinity', '1e999', '', ' ', undefined]) {
      expect(clockMinHeight({ design: { line_height: lh } }), String(lh)).toBe(fallback);
    }
  });

  it('keeps a finite number and a length', () => {
    expect(clockMinHeight({ design: { line_height: 1.4 } })).toBe('calc(2.875rem * 1.4)');
    expect(clockMinHeight({ design: { line_height: '30px' } })).toBe('calc(30px * 2)');
  });

  it('rejects a long digit string in linear time', () => {
    const started = performance.now();
    for (const tail of ['x', '.', 'px;', '%%']) clockMinHeight({ design: { line_height: `${'9'.repeat(100_000)}${tail}` } });
    expect(performance.now() - started).toBeLessThan(500);
  });
});

describe('i18n contract rows', () => {
  it('lists the card namespace under one single-digit extraction slice', () => {
    expect(I18N_MODULES.card.slice).toMatch(/^I\d$/);
  });

  it('gives every namespace a non-empty slice label', () => {
    for (const [ns, row] of Object.entries(I18N_MODULES)) expect(row.slice.trim(), ns).not.toBe('');
  });
});

describe('CI workflow', () => {
  const yml = read('.github/workflows/validate.yml');

  it('has no bootstrap branch', () => {
    expect(yml.toLowerCase()).not.toContain('bootstrap');
    expect(yml).not.toMatch(/git cat-file -e "\$base:tools\//);
  });

  it('runs the key check and the typecheck', () => {
    expect(yml).toContain('npm run typecheck');
    expect(yml).toMatch(/node tools\/check-i18n\.mjs --ci/);
  });

  it('compares the entry graph and the emitted syntax against the base with --require-base', () => {
    expect(yml).toContain('check-entry-graph.mjs --require-base');
    expect(yml).toContain('check-es-syntax.mjs --require-base');
  });
});
