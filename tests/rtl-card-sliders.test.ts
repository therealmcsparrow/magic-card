import { describe, it, expect, afterEach, vi } from 'vitest';
import { render } from 'lit';
import { writeFileSync, readFileSync } from 'node:fs';
import { sliderLookView } from '../src/slider-look/view';
import { renderTrack } from '../src/utils/slider-track';
import { SLIDER_LOOK_RTL_CSS } from '../src/slider-look/css';
import { controlsViewStyles } from '../src/css/controls-styles';
import { ShapeBox } from '../src/slider-look/shape';
import { resolveShape } from '../src/card/shape-resolve';
import type { CardModule } from '../src/types';
import { DIR_CHANGE_EVENT } from '../src/contracts/ui-kit';

const hass = {
  states: {
    'light.x': { entity_id: 'light.x', state: 'on', attributes: { brightness: 128, color_temp_kelvin: 3000, min_color_temp_kelvin: 2000, max_color_temp_kelvin: 6500, supported_color_modes: ['brightness', 'color_temp'], friendly_name: 'Lamp' } },
    'input_number.n': { entity_id: 'input_number.n', state: '30', attributes: { min: 0, max: 100, step: 5, mode: 'slider', friendly_name: 'Level' } },
  },
  entities: {}, devices: {}, areas: {}, config: { unit_system: {} }, locale: { language: 'en' }, themes: { darkMode: false },
  callService: () => Promise.resolve(),
} as never;

const base = { id: 's', type: 'slider', entity: 'input_number.n' };
const CASES: Record<string, Record<string, unknown>> = {
  standard: { track_style: 'standard', thumb: 'line' },
  thin: { track_style: 'thin', thumb: 'circle' },
  pill: { track_style: 'pill', thumb: 'pill', thumb_icon: 'mdi:led-on' },
  segmented: { track_style: 'segmented', segments: 6, thumb: 'none' },
  glass: { track_style: 'glass', thumb: 'square', glass_blur: true, slider_color: '#e91e63' },
  bigFill: { track_style: 'big-fill', value_position: 'track', thumb: 'none' },
  gradient: { fill_mode: 'gradient', slider_color: '#ff0000', slider_color_to: '#0000ff', thumb: 'circle' },
  ticksLabels: { ticks: true, show_limits: true, stops: [{ value: 30, label: 'Low' }, { value: 70, label: 'High' }], snap: true, thumb: 'circle' },
  bubble: { value_position: 'bubble', thumb: 'pill', track_style: 'thin' },
  shape: { track_shape: 'wave', track_style: 'standard' },
  brightness: { entity: 'light.x', fill_mode: 'auto', thumb: 'circle' },
  kelvin: { entity: 'light.x', attribute: 'color_temp_kelvin', fill_mode: 'auto', thumb: 'line' },
  plain: { slider_color: '#f00', track_color: '#222' },
};

const hosts: HTMLElement[] = [];
const norm = (s: string) => s.replace(/<!--[^>]*-->/g, '').replace(/\s+/g, ' ').replace(/> </g, '><').trim();
const draw = (c: Record<string, unknown>) => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(sliderLookView.renderPreview({ ...base, ...c } as unknown as CardModule, hass), host);
  return host;
};
const record = (): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [k, c] of Object.entries(CASES)) {
    const host = draw(c);
    out[k] = norm(host.querySelector('.mc-slider-container')!.outerHTML);
    render(null, host);
    document.body.innerHTML = '';
  }
  return out;
};

afterEach(() => {
  for (const h of hosts.splice(0)) render(null, h);
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('dir');
  vi.restoreAllMocks();
});

describe('card sliders: ltr output', () => {
  it('RECORD', () => {
    if (!process.env.RECORD_GOLDEN) return;
    writeFileSync('tests/fixtures/rtl-card-sliders-ltr-golden.json', JSON.stringify(record(), null, 1) + '\n');
  });
  it('matches the golden recorded before the mirror', () => {
    if (process.env.RECORD_GOLDEN) return;
    const golden = JSON.parse(readFileSync('tests/fixtures/rtl-card-sliders-ltr-golden.json', 'utf8'));
    expect(record()).toEqual(golden);
  });
});

const RECT = { left: 0, top: 0, width: 200, height: 40, right: 200, bottom: 40, x: 0, y: 0, toJSON: () => ({}) };
function track(opts: { direction?: string; vertical?: boolean; nextValue?: (c: number, k: string) => number | undefined; inner?: string } = {}) {
  const onCommit = vi.fn();
  const outer = document.createElement('div');
  if (opts.direction) outer.style.direction = opts.direction;
  let host = outer;
  if (opts.inner) {
    host = document.createElement('div');
    host.style.direction = opts.inner;
    outer.appendChild(host);
  }
  document.body.appendChild(outer);
  render(renderTrack({ value: 50, min: 0, max: 100, step: 5, vertical: opts.vertical, label: 'L', onCommit, nextValue: opts.nextValue }), host);
  hosts.push(host);
  const el = host.querySelector('.mc-tile-slider') as HTMLElement;
  el.getBoundingClientRect = () => RECT as DOMRect;
  el.setPointerCapture = vi.fn();
  return { el, outer, host, onCommit };
}
const ptr = (el: HTMLElement, type: string, x: number, y = 20) =>
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, composed: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', button: 0 }));
const key = (el: HTMLElement, k: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('card sliders under right-to-left', () => {
  it('marks only a horizontal rtl track', async () => {
    const a = track({ direction: 'rtl' });
    const b = track({ direction: 'ltr' });
    const c = track({ direction: 'rtl', vertical: true });
    await tick();
    expect(a.el.hasAttribute('data-mc-rtl')).toBe(true);
    expect(b.el.hasAttribute('data-mc-rtl')).toBe(false);
    expect(c.el.hasAttribute('data-mc-rtl')).toBe(false);
  });

  it('measures the pointer from the right edge', () => {
    const { el, onCommit } = track({ direction: 'rtl' });
    ptr(el, 'pointerdown', 150);
    ptr(el, 'pointerup', 150);
    expect(onCommit).toHaveBeenCalledWith(25);
    const ltr = track({ direction: 'ltr' });
    ptr(ltr.el, 'pointerdown', 150);
    ptr(ltr.el, 'pointerup', 150);
    expect(ltr.onCommit).toHaveBeenCalledWith(75);
  });

  it('swaps ArrowLeft and ArrowRight, leaves the other keys and the aria values alone', () => {
    const { el, onCommit } = track({ direction: 'rtl' });
    key(el, 'ArrowLeft');
    expect(onCommit).toHaveBeenLastCalledWith(55);
    key(el, 'ArrowRight');
    expect(onCommit).toHaveBeenLastCalledWith(45);
    key(el, 'ArrowUp');
    expect(onCommit).toHaveBeenLastCalledWith(55);
    key(el, 'Home');
    expect(onCommit).toHaveBeenLastCalledWith(0);
    expect(el.getAttribute('aria-valuenow')).toBe('50');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('100');
  });

  it('hands the swapped key to the stop lookup', () => {
    const nextValue = vi.fn(() => 70);
    const { el, onCommit } = track({ direction: 'rtl', nextValue });
    key(el, 'ArrowLeft');
    expect(nextValue).toHaveBeenCalledWith(50, 'ArrowRight');
    expect(onCommit).toHaveBeenCalledWith(70);
  });

  it('leaves a vertical slider unchanged', () => {
    const { el, onCommit } = track({ direction: 'rtl', vertical: true });
    key(el, 'ArrowLeft');
    expect(onCommit).toHaveBeenLastCalledWith(45);
    el.getBoundingClientRect = () => ({ ...RECT, width: 40, height: 200, right: 40, bottom: 200 }) as DOMRect;
    ptr(el, 'pointerdown', 20, 20);
    ptr(el, 'pointerup', 20, 20);
    expect(onCommit).toHaveBeenLastCalledWith(90);
  });

  it('follows the computed direction: an ltr canvas inside an rtl page stays ltr', async () => {
    const { el, onCommit } = track({ direction: 'rtl', inner: 'ltr' });
    await tick();
    expect(el.hasAttribute('data-mc-rtl')).toBe(false);
    key(el, 'ArrowLeft');
    expect(onCommit).toHaveBeenLastCalledWith(45);
  });

  it('re-reads on mc-dir-change and on a dir change of the page', async () => {
    const { el, outer } = track({ direction: 'ltr' });
    outer.style.direction = 'rtl';
    window.dispatchEvent(new Event('mc-dir-change'));
    expect(el.hasAttribute('data-mc-rtl')).toBe(true);
    outer.style.direction = 'ltr';
    document.documentElement.setAttribute('dir', 'ltr');
    await tick();
    await tick();
    expect(el.hasAttribute('data-mc-rtl')).toBe(false);
  });

  it('listens to the shared direction event', () => {
    expect(DIR_CHANGE_EVENT).toBe('mc-dir-change');
    const add = vi.spyOn(window, 'addEventListener');
    track({ direction: 'ltr' });
    expect(add.mock.calls.some((c) => c[0] === DIR_CHANGE_EVENT)).toBe(true);
  });

  it('clears the mark when a horizontal rtl track becomes vertical', async () => {
    const host = document.createElement('div');
    host.style.direction = 'rtl';
    document.body.appendChild(host);
    hosts.push(host);
    const draw = (vertical: boolean) => render(renderTrack({ value: 50, min: 0, max: 100, step: 5, vertical, label: 'L', onCommit: vi.fn() }), host);
    draw(false);
    await tick();
    const el = host.querySelector('.mc-tile-slider')!;
    expect(el.hasAttribute('data-mc-rtl')).toBe(true);
    draw(true);
    await tick();
    expect(host.querySelector('.mc-tile-slider')).toBe(el);
    expect(el.hasAttribute('data-mc-rtl')).toBe(false);
    draw(false);
    await tick();
    expect(el.hasAttribute('data-mc-rtl')).toBe(true);
  });

  it('drops its listener when the track goes', () => {
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { host, el, outer } = track({ direction: 'ltr' });
    expect(add.mock.calls.filter((c) => c[0] === 'mc-dir-change')).toHaveLength(1);
    render(null, host);
    expect(remove.mock.calls.filter((c) => c[0] === 'mc-dir-change')).toHaveLength(1);
    outer.style.direction = 'rtl';
    window.dispatchEvent(new Event('mc-dir-change'));
    expect(el.hasAttribute('data-mc-rtl')).toBe(false);
  });

  it('re-reads when the track box is measured', () => {
    const outer = document.createElement('div');
    outer.style.direction = 'ltr';
    outer.innerHTML = '<div class="mc-tile-slider"><div class="box"></div></div>';
    document.body.appendChild(outer);
    const box = new ShapeBox();
    box.set(resolveShape({ shape: 'wave' }));
    box.ref(outer.querySelector('.box')!);
    outer.style.direction = 'rtl';
    box.paint();
    expect(outer.querySelector('.mc-tile-slider')!.hasAttribute('data-mc-rtl')).toBe(true);
    box.ref(undefined);
  });

  it('the sheets mirror on the attribute: fill, gradient, parts and the base bar', () => {
    expect(SLIDER_LOOK_RTL_CSS).toContain('.mc-tile-slider[data-mc-rtl] .mc-sl-f{transform:scaleX(-1)}');
    expect(SLIDER_LOOK_RTL_CSS).toContain('.mc-tile-slider[data-mc-rtl] .mc-sl-segs{direction:ltr;transform:scaleX(-1)}');
    expect(SLIDER_LOOK_RTL_CSS).toContain('.mc-tile-slider[data-mc-rtl] .mc-sl-th{left:auto;right:calc(var(--v) * 100%)');
    expect(String(controlsViewStyles)).toContain('.mc-tile-slider[data-mc-rtl] .mc-tile-slider-bar');
  });
});
