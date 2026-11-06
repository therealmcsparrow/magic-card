import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const GALLERY = path.join(ROOT, 'documentation/gallery');
const read = (rel: string) => readFileSync(path.join(ROOT, rel), 'utf8');

const FAMILIES = ['Home', 'Climate', 'Power', 'Guard', 'Sound', 'Machines', 'Garden', 'Worlds'];
const MOVING = /\.(webp|gif|apng)(?=[)"'\s?#]|$)/i;
const PAUSED_LINE = 'The first picture of each card is paused. Tap it or press Enter to watch it move.';

const galleryPages = readdirSync(GALLERY).filter((f) => f.endsWith('.md'));
const docFiles = [
  'README.md',
  'documentation/troubleshooting/README.md',
  ...galleryPages.map((f) => `documentation/gallery/${f}`),
];

const NUMBER_WORDS: Record<number, string> = { 138: 'One hundred and thirty-eight' };

describe('gallery and README pictures do not play on their own', () => {
  for (const rel of docFiles) {
    it(`${rel} embeds no moving image directly`, () => {
      const text = read(rel);
      // An image written as ![alt](x.webp) is only allowed inside a link: [![alt](still.png)](x.webp).
      const direct = [...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]).filter((u) => MOVING.test(u));
      expect(direct).toEqual([]);
      const tags = [...text.matchAll(/<(img|source|video|picture)\b[^>]*>/gi)].map((m) => m[0]);
      const movingTags = tags.filter((t) => MOVING.test(t) || /<video/i.test(t));
      expect(movingTags).toEqual([]);
      expect(/<[a-z][^>]*\bautoplay\b/i.test(text)).toBe(false);
    });
  }

  it('every animated card links its recording from a settled still', () => {
    let links = 0;
    for (const f of galleryPages) {
      const text = read(`documentation/gallery/${f}`);
      for (const m of text.matchAll(/\[!\[[^\]]*\]\(([^)]+)\)\]\(([^)]+)\)/g)) {
        if (!MOVING.test(m[2])) continue;
        links++;
        expect(m[1]).toMatch(/\.png$/);
        expect(existsSync(path.join(GALLERY, m[1]))).toBe(true);
        expect(existsSync(path.join(GALLERY, m[2]))).toBe(true);
      }
    }
    expect(links).toBeGreaterThan(0);
  });
});

describe('gallery alt text reads card name, then family', () => {
  for (const f of galleryPages.filter((p) => p !== 'README.md' && p !== 'still-true.md')) {
    it(`${f} pictures are named "<card name>, <family>"`, () => {
      const alts = [...read(`documentation/gallery/${f}`).matchAll(/!\[([^\]]*)\]\(images\//g)].map((m) => m[1]);
      expect(alts.length).toBeGreaterThan(0);
      const family = FAMILIES.join('|');
      const shape = new RegExp(`^(.+?), (${family})(, .+)?$`);
      const bad = alts.filter((a) => {
        const m = shape.exec(a);
        return !m || m[1].trim() === '';
      });
      expect(bad).toEqual([]);
    });
  }

  it('the families picture and the README header image have alt text', () => {
    const readme = read('README.md');
    const m = /<img src="documentation\/gallery\/images\/families\/set\.svg"[^>]*alt="([^"]+)"/.exec(readme);
    expect(m).not.toBeNull();
    for (const fam of FAMILIES) expect(m![1].toLowerCase()).toContain(fam.toLowerCase());
    expect(existsSync(path.join(GALLERY, 'images/families/set.svg'))).toBe(true);
  });
});

describe('gallery README states the paused first picture and counts the cards', () => {
  const readme = read('documentation/gallery/README.md');

  it('carries the paused-picture line word for word', () => {
    expect(readme).toContain(PAUSED_LINE);
  });

  it('the card count matches the card files', () => {
    const files = readdirSync(path.join(GALLERY, 'cards')).filter((f) => f.endsWith('.yaml'));
    const words = NUMBER_WORDS[files.length];
    expect(words, `no number word for ${files.length} cards`).toBeDefined();
    expect(readme).toContain(`${words} complete cards`);
  });

  it('links the tablet page and the target exists', () => {
    expect(readme).toMatch(/\]\(tablet\.md\)/);
    expect(existsSync(path.join(GALLERY, 'tablet.md'))).toBe(true);
    for (const name of ['Front door', 'Kitchen door', 'Hallway lights', 'Alarm']) {
      expect(readme).toContain(name);
    }
  });

  it('keeps the still-true page and its pictures', () => {
    expect(readme).toMatch(/\]\(still-true\.md\)/);
    expect(existsSync(path.join(GALLERY, 'still-true.md'))).toBe(true);
    const imgs = readdirSync(path.join(GALLERY, 'images'));
    for (const n of ['138', '139', '140']) expect(imgs.some((i) => i.startsWith(`${n}-`))).toBe(true);
  });
});

describe('the old-tablet entry is present and linked', () => {
  const trouble = read('documentation/troubleshooting/README.md');
  const readme = read('README.md');

  it('troubleshooting has the blank-card heading with the WebView 85 step', () => {
    expect(trouble).toMatch(/^## A card is blank on an old tablet$/m);
    expect(trouble).toMatch(/WebView/);
    expect(trouble).toMatch(/\b85\b/);
  });

  it('says the engine check was made on a desktop, not a tablet', () => {
    expect(trouble).toMatch(/desktop/i);
    expect(trouble).toMatch(/not on a real tablet/i);
  });

  it('README links the troubleshooting anchor and that anchor exists', () => {
    expect(readme).toContain('documentation/troubleshooting/README.md#a-card-is-blank-on-an-old-tablet');
    expect(existsSync(path.join(ROOT, 'documentation/troubleshooting/README.md'))).toBe(true);
  });

  it('every relative link in the troubleshooting page resolves', () => {
    const links = [...trouble.matchAll(/\]\((?!https?:|#)([^)#\s]+)/g)].map((m) => m[1]);
    for (const l of links) {
      expect(existsSync(path.resolve(ROOT, 'documentation/troubleshooting', l)), l).toBe(true);
    }
  });
});
