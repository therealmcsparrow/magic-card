import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import '../src/index';
import { STATES, hassWith, mount, sr } from './helpers/content-hass';
import { __setLazyImporterForTests, onDemandChunks } from '../src/utils/lazy-chunks';
import { TIMING } from '../src/utils/lazy-chunk';
import { provideSvgImageChunk } from '../src/utils/svg-image-loader';
import { __resetImageClientForTests } from '../src/svg-image/client';
import { __resetFramesForTests } from '../src/svg-image/frames';
import { IMAGE_REF_RE } from '../src/contracts/svg-image';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as imageChunk from '../src/svg-image/chunk';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"><path id="p" d="M0 0L10 10" fill="var(--mc-image-main)"/></svg>';
const item = (id: string) => ({ id, name: id, view_box: '0 0 200 100', svg: SVG, created_at: 't0', updated_at: 't1' });

const libraryHass = (ids: string[], seen: Array<{ type: string; ids?: string[] }> = []) =>
  hassWith(STATES, {
    callWS: async (m: { type: string; ids?: string[] }) => {
      seen.push(m);
      return { images: (m.ids ?? []).filter((i) => ids.includes(i)).map(item) };
    },
  });

const wait = async (done: () => boolean, ms = 3000) => {
  const end = Date.now() + ms;
  while (!done() && Date.now() < end) await new Promise((r) => setTimeout(r, 20));
};
const box = (card: HTMLElement) => sr(card as never).querySelector<HTMLElement>('.mc-image')!;
const el = (card: HTMLElement) => box(card).querySelector<HTMLElement & { status: string }>('mc-svg-image');

beforeEach(() => {
  provideSvgImageChunk(onDemandChunks['svg-image']);
  __resetImageClientForTests();
  __resetFramesForTests();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  TIMING.silent = 0;
  TIMING.background = [];
});
afterEach(() => {
  document.body.innerHTML = '';
  __setLazyImporterForTests('svg-image', undefined);
  __resetImageClientForTests();
  __resetFramesForTests();
  vi.restoreAllMocks();
});

describe('image module with a library image', () => {
  it('draws the picture through <mc-svg-image> in a box that keeps the aspect ratio', async () => {
    const card = await mount([{ id: 'a', type: 'image', image: 'mcu-image:plan', aspect_ratio: '2:1', fit: 'contain' }], libraryHass(['plan']));
    expect(box(card).getAttribute('style')).toContain('aspect-ratio: 2 / 1;');
    expect(box(card).querySelector('img')).toBeNull();
    const image = el(card)!;
    expect((image as never as { ref: string }).ref).toBe('mcu-image:plan');
    expect((image as never as { fit: string }).fit).toBe('contain');
    await wait(() => image.status === 'ready');
    expect(image.status).toBe('ready');
    expect(image.shadowRoot!.querySelector('.stage > svg path')).not.toBeNull();
    expect(box(card).classList.contains('mc-image--broken')).toBe(false);
  });

  it('passes the description as the drawing name and leaves it decorative without one', async () => {
    const card = await mount(
      [
        { id: 'a', type: 'image', image: 'mcu-image:plan', description: 'Floor plan, ground floor' },
        { id: 'b', type: 'image', image: 'mcu-image:plan' },
      ],
      libraryHass(['plan']),
    );
    const [a, b] = [...sr(card).querySelectorAll<HTMLElement & { status: string }>('mc-svg-image')];
    await wait(() => a.status === 'ready' && b.status === 'ready');
    const svgA = a.shadowRoot!.querySelector('.stage > svg')!;
    expect(svgA.getAttribute('role')).toBe('img');
    expect(svgA.getAttribute('aria-label')).toBe('Floor plan, ground floor');
    expect(b.shadowRoot!.querySelector('.stage > svg')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('passes state_summary, colours and the effective entity to the element', async () => {
    const card = await mount(
      [{ id: 'a', type: 'image', image: 'mcu-image:plan', entity: 'sensor.temp', state_summary: true, colors: { main: 'red', accent: 'blue' } }],
      libraryHass(['plan']),
    );
    const image = el(card) as never as { stateSummary: boolean; colors: unknown; entity: string };
    expect(image.stateSummary).toBe(true);
    expect(image.colors).toEqual({ main: 'red', accent: 'blue' });
    expect(image.entity).toBe('sensor.temp');
  });

  it('shows the missing state for a deleted item, with no id in it', async () => {
    const card = await mount([{ id: 'a', type: 'image', image: 'mcu-image:gone', aspect_ratio: '2:1' }], libraryHass([]));
    await wait(() => box(card).classList.contains('mc-image--broken'));
    const b = box(card);
    expect(b.classList.contains('mc-image--broken')).toBe(true);
    expect(b.getAttribute('style')).toContain('aspect-ratio: 2 / 1;');
    const fallback = b.querySelector<HTMLElement>('.mc-image-error')!;
    expect(fallback.querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:image-off');
    expect(fallback.textContent).toContain('Picture not available');
    expect(fallback.textContent).not.toContain('gone');
    // the words sit on their own backing, so any card background behind the box leaves them readable
    const chip = fallback.querySelector<HTMLElement>('.mc-image-missing')!;
    expect(chip.getAttribute('style')).toMatch(/background: var\(--card-background-color, #fff\)/);
    expect(chip.getAttribute('style')).toMatch(/[^-]color: var\(--primary-text-color, #212121\)/);
    expect(chip.textContent).toContain('Picture not available');
    expect(getComputedStyle(el(card)!).display).toBe('none');
  });

  it('shows the picture again when the item comes back', async () => {
    const ids: string[] = [];
    const hass = libraryHass(ids);
    const card = await mount([{ id: 'a', type: 'image', image: 'mcu-image:late' }], hass);
    await wait(() => box(card).classList.contains('mc-image--broken'));
    ids.push('late');
    el(card)!.dispatchEvent(new CustomEvent('mc-svg-image-status', { detail: { status: 'ready' } }));
    expect(box(card).classList.contains('mc-image--broken')).toBe(false);
    expect(getComputedStyle(el(card)!).display).not.toBe('none');
  });

  it('a chunk that fails to load shows the chunk notice, not the missing picture', async () => {
    __setLazyImporterForTests('svg-image', () => Promise.reject(new Error('404')));
    const card = await mount([{ id: 'a', type: 'image', image: 'mcu-image:plan' }], libraryHass(['plan']));
    await wait(() => onDemandChunks['svg-image'].failed());
    await new Promise((r) => setTimeout(r, 60));
    expect(onDemandChunks['svg-image'].failed()).toBe(true);
    expect(box(card).classList.contains('mc-image--broken')).toBe(false);
    expect(sr(card).querySelector('.mc-card-content .mc-n')).not.toBeNull();
  });

  it('starts the chunk for a library reference only', async () => {
    const importer = vi.fn(async () => imageChunk);
    __setLazyImporterForTests('svg-image', importer);
    await mount([{ id: 'a', type: 'image', image: 'https://x/y.png' }, { id: 'b', type: 'image', image: 'mcu-image:Bad/../id' }]);
    expect(importer).not.toHaveBeenCalled();
    await mount([{ id: 'c', type: 'image', image: 'mcu-image:plan' }], libraryHass(['plan']));
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it('a malformed reference is a plain image source, never an element', async () => {
    const card = await mount([{ id: 'a', type: 'image', image: 'mcu-image:Bad/../id' }]);
    expect(sr(card).querySelector('mc-svg-image')).toBeNull();
    expect(box(card).querySelector('img')).toBeNull();
    expect(box(card).querySelector('.mc-image-fallback')).not.toBeNull();
  });
});

describe('image module with a picture file', () => {
  it('uses the description as the alt text, empty without one', async () => {
    const card = await mount([
      { id: 'a', type: 'image', image: 'https://x/y.png', description: 'Front door' },
      { id: 'b', type: 'image', image: 'https://x/y.png' },
    ]);
    const imgs = [...sr(card).querySelectorAll('.mc-image > img')];
    expect(imgs[0].getAttribute('alt')).toBe('Front door');
    expect(imgs[1].getAttribute('alt')).toBe('');
  });
});

describe('the reference check in the image view', () => {
  it('is the contract expression', () => {
    const src = readFileSync(resolve(__dirname, '../src/modules/content/image-view.ts'), 'utf8');
    expect(src).toContain(IMAGE_REF_RE.source);
    expect(src).not.toMatch(/from '[./]*\/contracts\/svg-image'/);
  });
});
