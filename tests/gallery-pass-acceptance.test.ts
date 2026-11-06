import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

// Acceptance checks for the gallery pass (AC15, AC16) and the forum-shot legal quote (AC6, AC23).
// They read tracked and local files; the two-run byte comparison of stills and recordings is in
// gallery-stills.test.ts and gallery-recordings.test.ts, which run named cards twice.

const ROOT = path.resolve(__dirname, '..');
const BASE = 'c30df8a5fe45ed7967ed30c05937e7886b8082dd';
const RUN = path.join(ROOT, '.company/work/2026-11-01 18.35 - Feature Draft');
const CARDS = path.join(ROOT, '.results/cards');
const G = path.join(ROOT, 'documentation/gallery');
const read = (f: string): string => readFileSync(f, 'utf8').split('\r\n').join('\n');
const slugs = readdirSync(path.join(G, 'cards')).filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, '')).sort();
const images = readdirSync(path.join(G, 'images'));

describe('AC15: refresh and retire', () => {
  it('retired.json is a list of card names whose YAML is kept', () => {
    const f = path.join(CARDS, '_render/retired.json');
    if (!existsSync(f)) return;
    const retired = JSON.parse(read(f)) as unknown;
    expect(Array.isArray(retired)).toBe(true);
    for (const r of retired as string[]) {
      expect(typeof r).toBe('string');
      expect(slugs, `${r} keeps its YAML`).toContain(r);
    }
  });

  it('keeps one diff picture per refreshed card, each a PNG of a real card', () => {
    const dir = path.join(CARDS, 'diffs');
    if (!existsSync(dir)) return;
    const diffs = readdirSync(dir).filter((f) => f.endsWith('.png'));
    expect(diffs.length).toBeGreaterThan(0);
    for (const d of diffs) {
      const slug = d.replace(/-diff\.png$/, '');
      expect(d, d).toMatch(/-diff\.png$/);
      expect(slugs, `${d} names a card`).toContain(slug);
      expect(readFileSync(path.join(dir, d)).subarray(1, 4).toString('latin1'), d).toBe('PNG');
    }
  });

  it('lists every changed gallery YAML in some Handoff files-touched', () => {
    if (!existsSync(RUN)) return;
    const changed = execFileSync('git', ['diff', '--name-only', BASE, 'HEAD', '--', 'documentation/gallery/cards'], { encoding: 'utf8', cwd: ROOT })
      .split('\n')
      .filter(Boolean)
      .map((f) => path.basename(f));
    const touched = readdirSync(RUN)
      .filter((f) => /^\d\d-.*\.md$/.test(f))
      .map((f) => read(path.join(RUN, f)).split('\n').find((l) => l.startsWith('files-touched:')) ?? '')
      .join('\n');
    expect(changed.length).toBeGreaterThan(0);
    const missing = changed.filter((f) => !touched.includes(f) && !touched.includes(f.replace(/\.yaml$/, '')));
    expect(missing, 'changed YAML not named in any files-touched').toEqual([]);
  });
});

describe('AC16: regenerated gallery files', () => {
  it('gives every card a picture, and every animated card a WebP with a PNG still beside it', () => {
    for (const s of slugs) {
      // a tablet card has open, closed, paused and dimmed pictures named <card>-<variant>.png
      const png = images.includes(`${s}.png`) || images.some((i) => i.startsWith(`${s}-`) && i.endsWith('.png'));
      const webp = images.includes(`${s}.webp`);
      expect(png || webp, `${s} has a picture`).toBe(true);
      if (webp) expect(png, `${s} has a settled still beside the WebP`).toBe(true);
    }
  });

  it('has a family picture folder and the tablet page', () => {
    expect(existsSync(path.join(G, 'images/families'))).toBe(true);
    expect(existsSync(path.join(G, 'tablet.md'))).toBe(true);
  });

  it('counts the cards in the README the same as the card files', () => {
    const words: Record<number, string> = { 138: 'One hundred and thirty-eight' };
    expect(words[slugs.length], `${slugs.length} cards`).toBeDefined();
    expect(read(path.join(G, 'README.md'))).toContain(`${words[slugs.length]} complete cards`);
  });
});

describe('AC6 and AC23: forum-shot privacy hint quoted word for word', () => {
  const legalFile = path.join(RUN, 'legal-forum-shot.md');
  const hint = (): string => {
    const section = read(legalFile).split(/\n(?=## )/).find((s) => s.startsWith('## 1.'))!;
    return /^> (.+)$/m.exec(section)![1];
  };
  it.each(['README.md', 'CHANGELOG.md', 'documentation/magic-card-utils/README.md'])('%s carries the full hint', (f) => {
    if (!existsSync(legalFile)) return;
    expect(read(path.join(ROOT, f))).toContain(hint());
  });
});
