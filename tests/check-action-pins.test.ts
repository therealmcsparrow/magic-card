import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
// @ts-expect-error plain ESM tool without type declarations
import { checkPins, scan } from '../tools/check-action-pins.mjs';

const sha = '3d3c42e5aac5ba805825da76410c181273ba90b1';
const root = path.resolve(__dirname, '..');

describe('pinned-action check', () => {
  it('accepts a full SHA with a v-prefixed version comment', () => {
    expect(checkPins(`- uses: actions/checkout@${sha} # v7.0.1`)).toEqual([]);
  });
  it('accepts a full SHA with a bare version or a branch comment', () => {
    expect(checkPins(`- uses: hacs/action@${sha} # 22.5.0`)).toEqual([]);
    expect(checkPins(`  uses: owner/repo@${sha} # main`)).toEqual([]);
  });
  it('fails a version tag', () => {
    const out = checkPins('- uses: actions/checkout@v4', 'a.yml');
    expect(out).toHaveLength(1);
    expect(out[0]).toContain('a.yml:1');
  });
  it('fails a branch ref, a short SHA and an upper-case SHA', () => {
    expect(checkPins('- uses: actions/checkout@main')).toHaveLength(1);
    expect(checkPins('- uses: actions/checkout@3d3c42e # v7')).toHaveLength(1);
    expect(checkPins(`- uses: actions/checkout@${sha.toUpperCase()} # v7`)).toHaveLength(1);
  });
  it('fails a SHA without a comment', () => {
    expect(checkPins(`- uses: actions/checkout@${sha}`)).toHaveLength(1);
    expect(checkPins(`- uses: actions/checkout@${sha} #`)).toHaveLength(1);
  });
  it('skips local actions and commented-out lines', () => {
    expect(checkPins('- uses: ./.github/actions/setup\n# - uses: actions/checkout@v4')).toEqual([]);
  });
  it('needs a sha256 digest on docker images', () => {
    expect(checkPins(`- uses: docker://alpine@sha256:${'b'.repeat(64)}`)).toEqual([]);
    expect(checkPins('- uses: docker://alpine:3.20')).toHaveLength(1);
  });
  it('fails closed on a uses key in a form it cannot read', () => {
    for (const line of [
      '- uses : a/b@v4',
      `- uses : a/b@${sha} # v1`,
      '- "uses": a/b@v4',
      "- 'uses': a/b@v4",
      '- { uses: a/b@v4 }',
      `- {uses: a/b@${sha}}`,
      '- { name: x, uses: a/b@v4 }',
      '  "uses": a/b@v4',
      "  'uses' : a/b@v4",
    ]) {
      const out = checkPins(line, 'a.yml');
      expect(out, line).toHaveLength(1);
      expect(out[0]).toContain('cannot read');
    }
  });
  it('fails closed on every other form that holds the word uses', () => {
    for (const text of [
      '- { name: "a #b", uses: a/b@v4 }',
      `- { name: "a #b", uses: a/b@${sha} # v1 }`,
      '- ? uses\n  : a/b@v4',
      '- &k uses: a/b@v4',
      '- !!str uses: a/b@v4',
      '- name: x\ruses: a/b@v4',
      '- name: x\r\n  uses: a/b@v4\r- run: y',
      '- uses:\n    a/b@v4',
      '- uses: >\n    a/b@v4',
      '- uses: *x',
      '- {\n    uses: a/b@v4\n  }',
      '- [{ uses: a/b@v4 }]',
      '- name: this uses a cache',
      `- uses: a/b@${sha} # v1 uses x`,
      '- run: |\n    echo hi\n  uses: a/b@v4',
      `- uses: "a/b@${sha}" # v1`,
    ]) expect(checkPins(text, 'a.yml'), JSON.stringify(text)).not.toHaveLength(0);
  });
  it('reports a bare CR on the same line number as a line feed', () => {
    expect(checkPins('a: 1\rb: 2\r- uses: a/b@v4', 'a.yml')[0]).toContain('a.yml:3');
  });
  it('does not read uses inside a run line, a run block or a whole-line comment', () => {
    expect(checkPins('run: echo uses: a/b@v4\n# { uses: a/b@v4 }\n- run: |\n    echo uses: a/b@v4\n\n    uses: x\n- name: x')).toEqual([]);
  });
  it('refuses a comment with extra words after the version', () => {
    expect(checkPins(`- uses: a/b@${sha} # v1 and more`)).toHaveLength(1);
    expect(checkPins(`- uses: a/b@${sha} # v1+2`)).toHaveLength(1);
  });
  it('reports the line of each unpinned action', () => {
    const out = checkPins(`a: 1\n- uses: x/y@v1\n- uses: x/z@${sha} # v2\n- uses: x/w@v3`);
    expect(out.map((m: string) => m.split(':')[1])).toEqual(['2', '4']);
  });
  it('scans workflows and nested action files', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pins-'));
    try {
      mkdirSync(path.join(dir, '.github/workflows'), { recursive: true });
      mkdirSync(path.join(dir, '.github/actions/setup/deep'), { recursive: true });
      writeFileSync(path.join(dir, '.github/workflows/ok.yaml'), `- uses: a/b@${sha} # v1\n`);
      writeFileSync(path.join(dir, '.github/actions/setup/deep/action.yml'), '- uses: a/c@v2\n');
      const res = scan(dir);
      expect(res.files).toBe(2);
      expect(res.problems).toHaveLength(1);
      expect(res.problems[0]).toContain('.github/actions/setup/deep/action.yml:1');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
  it('passes on the workflows of this repository', () => {
    expect(scan(root).problems).toEqual([]);
  });
  it('runs its own self-test from the command line', () => {
    const out = execFileSync(process.execPath, [path.join(root, 'tools/check-action-pins.mjs'), '--selftest'], { encoding: 'utf8' });
    expect(out).toContain('cases ok');
  });
});
