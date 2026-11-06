import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, nothing } from 'lit';
import '../src/index';
import { resolveRing } from '../src/utils/ring';
import { ringStroke, ringTimerTick } from '../src/card/ring-stroke';
import { formatCountdown, onTick, parseDuration, tickerState, timerCountdown, timerProgress } from '../src/utils/timer';
import { resolveBound } from '../src/utils/value-bound';
import { countdown } from '../src/utils/timer-countdown';
import { __resetOffscreenObserverForTests } from '../src/icons/offscreen';
import { collectDependencies } from '../src/services/card-dependencies';
import { ModuleRegistry } from '../src/modules/module-registry';
import type { CardModule, HassEntity, MagicCardConfig, RingConfig } from '../src/types';
import type { McRing } from '../src/card/mc-ring';
import type { RingEditor } from '../src/editor/components/ring-editor';
import { hassWith } from './helpers/content-hass';
import { editorFor } from './helpers/module-editor';

const NOW = Date.parse('2026-10-16T12:00:00Z');
const ent = (entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity =>
  ({ entity_id, state, attributes }) as HassEntity;
const iso = (ms: number) => new Date(ms).toISOString();

const states: Record<string, HassEntity> = {
  // 10 min timer, 2.5 min left
  'timer.active': ent('timer.active', 'active', { duration: '0:10:00', remaining: '0:10:00', finishes_at: iso(NOW + 150_000) }),
  'timer.nofinish': ent('timer.nofinish', 'active', { duration: '0:10:00', remaining: '0:05:00' }),
  'timer.paused': ent('timer.paused', 'paused', { duration: '1:00:00', remaining: '0:15:00' }),
  'timer.idle': ent('timer.idle', 'idle', { duration: '0:10:00', remaining: '0:10:00' }),
  'sensor.cap': ent('sensor.cap', '200', { limit: 50 }),
  'sensor.na': ent('sensor.na', 'unavailable'),
  'sensor.v': ent('sensor.v', '100'),
};

/** A controllable IntersectionObserver (the shared off-screen observer). */
const made: Array<{ cb: (e: Array<{ target: Element; isIntersecting: boolean }>) => void; els: Set<Element> }> = [];
let origIO: unknown;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  vi.setSystemTime(NOW);
  made.length = 0;
  origIO = (globalThis as Record<string, unknown>).IntersectionObserver;
  (globalThis as Record<string, unknown>).IntersectionObserver = class {
    cb: never;
    els = new Set<Element>();
    constructor(cb: never) {
      this.cb = cb;
      made.push(this as never);
    }
    observe(el: Element) { this.els.add(el); }
    unobserve(el: Element) { this.els.delete(el); }
    disconnect() { this.els.clear(); }
  };
  __resetOffscreenObserverForTests();
});
/** Containers rendered with lit's render(): cleared so their directives disconnect. */
const rendered: HTMLElement[] = [];
afterEach(() => {
  rendered.splice(0).forEach((el) => render(nothing, el));
  document.body.innerHTML = '';
  // nothing left ticking: every ring and countdown let go of the shared ticker
  expect(tickerState().running).toBe(false);
  vi.useRealTimers();
  (globalThis as Record<string, unknown>).IntersectionObserver = origIO;
});
const io = () => made[0];
const show = (el: Element, on = true) => io().cb([{ target: el, isIntersecting: on }]);

describe('timer progress', () => {
  it('parses H:MM:SS, days and seconds', () => {
    expect(parseDuration('0:10:00')).toBe(600_000);
    expect(parseDuration('1 day, 2:00:00')).toBe(26 * 3600_000);
    expect(parseDuration(90)).toBe(90_000);
    expect(parseDuration('soon')).toBeUndefined();
  });

  it('active from finishes_at against Date.now(), paused from remaining, idle empty', () => {
    expect(timerProgress(states['timer.active'])).toMatchObject({ state: 'active', remaining: 150_000, total: 600_000 });
    expect(timerProgress(states['timer.nofinish'])).toMatchObject({ state: 'active', remaining: 300_000, total: 600_000 });
    expect(timerProgress(states['timer.paused'])).toMatchObject({ state: 'paused', remaining: 900_000, total: 3600_000 });
    expect(timerProgress(states['timer.idle'])).toMatchObject({ state: 'idle', remaining: 0 });
    expect(timerProgress(states['sensor.v'])).toBeUndefined();
  });

  it('countdown text: M:SS under an hour, H:MM:SS above', () => {
    expect(formatCountdown(150_000)).toBe('2:30');
    expect(formatCountdown(3_723_000)).toBe('1:02:03');
    expect(formatCountdown(-5)).toBe('0:00');
    expect(timerCountdown(states['timer.active'])).toBe('2:30');
    expect(timerCountdown(states['timer.paused'])).toBe('15:00');
    expect(timerCountdown(states['timer.idle'])).toBeUndefined();
  });
});

describe('timer rings', () => {
  const ring = (c: RingConfig) => resolveRing({ mode: 'value', ...c }, { states })!;

  it('active: the remaining share of the duration, with a running timer to tick', () => {
    const r = ring({ entity: 'timer.active' });
    expect(r.fill).toBeCloseTo(0.25);
    expect(r.timer).toMatchObject({ end: NOW + 150_000, total: 600_000, elapsed: false });
    vi.setSystemTime(NOW + 90_000);
    expect(ringTimerTick(r.timer!).fill).toBeCloseTo(0.1);
  });

  it('active without finishes_at and without a usable last_updated: remaining, frozen', () => {
    const r = ring({ entity: 'timer.nofinish' });
    expect(r.fill).toBeCloseTo(0.5);
    expect(r.timer).toBeUndefined();
  });

  it('active without finishes_at counts down from last_updated + remaining', () => {
    // 5 min left 60 s ago: 4 min left now, ending 4 min from now
    const st = { 'timer.lu': { ...ent('timer.lu', 'active', { duration: '0:10:00', remaining: '0:05:00' }), last_updated: iso(NOW - 60_000) } as HassEntity };
    expect(timerProgress(st['timer.lu'])).toMatchObject({ state: 'active', remaining: 240_000, end: NOW + 240_000 });
    const r = resolveRing({ mode: 'value', entity: 'timer.lu' }, { states: st })!;
    expect(r.fill).toBeCloseTo(0.4);
    expect(r.timer).toMatchObject({ end: NOW + 240_000, total: 600_000 });
    expect(timerCountdown(st['timer.lu'])).toBe('4:00');
    vi.setSystemTime(NOW + 30_000);
    expect(ringTimerTick(r.timer!).fill).toBeCloseTo(0.35);
    expect(timerCountdown(st['timer.lu'])).toBe('3:30');
  });

  it('paused: remaining against duration; idle: empty, track still shown', () => {
    expect(ring({ entity: 'timer.paused' }).fill).toBeCloseTo(0.25);
    expect(ring({ entity: 'timer.paused' }).timer).toBeUndefined();
    const idle = ring({ entity: 'timer.idle', track_color: 'grey' });
    expect(idle.fill).toBe(0);
    expect(idle.track).toBe('grey');
  });

  it('timer_fill elapsed fills up instead', () => {
    expect(ring({ entity: 'timer.active', timer_fill: 'elapsed' }).fill).toBeCloseTo(0.75);
    expect(ring({ entity: 'timer.paused', timer_fill: 'elapsed' }).fill).toBeCloseTo(0.75);
    expect(ring({ entity: 'timer.idle', timer_fill: 'elapsed' }).fill).toBe(0);
  });

  it('min / max do not apply; an attribute reads the attribute as before', () => {
    expect(ring({ entity: 'timer.active', min: 50, max: 60 }).fill).toBeCloseTo(0.25);
    expect(ring({ entity: 'timer.active', attribute: 'nope' }).fill).toBe(0);
  });

  it('the module entity works too', () => {
    expect(resolveRing({ mode: 'value' }, { states, defaultEntity: 'timer.active' })!.fill).toBeCloseTo(0.25);
  });

  it('thresholds read the remaining percentage, also on each tick', () => {
    const thresholds = [{ from: 0, color: 'red' }, { from: 20, color: 'orange' }, { from: 50, color: 'green' }];
    const r = ring({ entity: 'timer.active', thresholds, timer_fill: 'elapsed' });
    expect(r.color).toBe('orange');
    vi.setSystemTime(NOW + 60_000);
    expect(ringTimerTick(r.timer!).color).toBe('red');
    expect(ring({ entity: 'timer.paused', thresholds }).color).toBe('orange');
  });

  it('the track follows the tick colour when it is the ring colour; a track_color stays', () => {
    const thresholds = [{ from: 0, color: 'red' }, { from: 20, color: 'orange' }];
    const r = ring({ entity: 'timer.active', thresholds, track_opacity: 30 });
    expect(r.track).toBe('color-mix(in srgb, orange 30%, transparent)');
    vi.setSystemTime(NOW + 60_000);
    expect(ringTimerTick(r.timer!)).toMatchObject({ color: 'red', track: 'color-mix(in srgb, red 30%, transparent)' });
    const own = ring({ entity: 'timer.active', thresholds, track_color: 'grey', track_opacity: 30 });
    expect(ringTimerTick(own.timer!).track).toBeUndefined();
    expect(own.track).toBe('color-mix(in srgb, grey 30%, transparent)');
    expect(ringTimerTick(ring({ entity: 'timer.active', thresholds }).timer!).track).toBeUndefined();
  });

  it('a running timer caps the fill transition at 1s; other rings keep theirs', () => {
    expect(ring({ entity: 'timer.active', transition: '3s' }).transition).toBe('1s');
    expect(ring({ entity: 'timer.active', transition: '1500ms' }).transition).toBe('1s');
    expect(ring({ entity: 'timer.active', transition: '400ms' }).transition).toBe('400ms');
    expect(ring({ entity: 'timer.paused', transition: '3s' }).transition).toBe('3s');
    expect(ring({ entity: 'sensor.v', transition: '3s' }).transition).toBe('3s');
  });

  it('a running timer moves linearly; reduced motion still has no transition', () => {
    const r = ring({ entity: 'timer.active' });
    expect(ringStroke(r, false).transition).toBe('stroke-dashoffset 1s linear, stroke 0.5s ease');
    expect(ringStroke(r, true).transition).toBe('none');
    expect(ringStroke(ring({ entity: 'sensor.v' }), false).transition).toContain('ease-in-out');
  });
});

describe('shared ticker', () => {
  it('one interval for every subscriber, stopped with the last', () => {
    const a = vi.fn();
    const b = vi.fn();
    const offA = onTick(a);
    const offB = onTick(b);
    expect(tickerState()).toEqual({ running: true, subscribers: 2 });
    vi.advanceTimersByTime(2000);
    expect(a).toHaveBeenCalledTimes(2);
    expect(b).toHaveBeenCalledTimes(2);
    offA();
    expect(tickerState().running).toBe(true);
    offB();
    expect(tickerState()).toEqual({ running: false, subscribers: 0 });
  });

  async function mountRing(r: ReturnType<typeof resolveRing>) {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    const el = document.createElement('mc-ring') as McRing;
    el.ring = r;
    parent.appendChild(el);
    await el.updateComplete;
    return el;
  }

  it('an active timer ring ticks only while on screen', async () => {
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.active' }, { states }));
    expect(tickerState().running).toBe(false);
    expect(io().els.has(el)).toBe(true);
    show(el);
    expect(tickerState()).toEqual({ running: true, subscribers: 1 });
    const spy = vi.spyOn(el, 'requestUpdate');
    vi.advanceTimersByTime(1000);
    expect(spy).toHaveBeenCalled();
    show(el, false);
    expect(tickerState().running).toBe(false);
    show(el);
    expect(tickerState().running).toBe(true);
    el.remove();
    expect(tickerState().running).toBe(false);
    expect(io().els.has(el)).toBe(false);
  });

  it('the stroke follows the clock between card renders', async () => {
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.active' }, { states }));
    el.measure = () => undefined;
    (el as unknown as { _box: unknown })._box = { w: 100, h: 100, top: 0, left: 0, radii: { tl: 0, tr: 0, br: 0, bl: 0 } };
    show(el);
    await el.updateComplete;
    const offset = () => el.shadowRoot!.querySelector('path')!.getAttribute('style')!.match(/stroke-dashoffset: ([\d.]+)/)![1];
    expect(offset()).toBe('75');
    vi.advanceTimersByTime(30_000);
    await el.updateComplete;
    expect(offset()).toBe('80');
  });

  it('mc-ring draws the per-tick track colour', async () => {
    const thresholds = [{ from: 0, color: 'red' }, { from: 20, color: 'orange' }];
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.active', thresholds, track_opacity: 30 }, { states }));
    (el as unknown as { _box: unknown })._box = { w: 100, h: 100, top: 0, left: 0, radii: { tl: 0, tr: 0, br: 0, bl: 0 } };
    show(el);
    await el.updateComplete;
    const track = () => el.shadowRoot!.querySelector('path')!.getAttribute('style')!;
    expect(track()).toContain('orange 30%');
    vi.advanceTimersByTime(60_000);
    await el.updateComplete;
    expect(track()).toContain('red 30%');
  });

  it('the track is an SVG path (it drew nothing as an HTML element)', async () => {
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.idle', track_opacity: 30 }, { states }));
    (el as unknown as { _box: unknown })._box = { w: 100, h: 100, top: 0, left: 0, radii: { tl: 0, tr: 0, br: 0, bl: 0 } };
    await el.updateComplete;
    const paths = [...el.shadowRoot!.querySelectorAll('path')];
    expect(paths.length).toBe(2);
    paths.forEach((p) => expect(p.namespaceURI).toBe('http://www.w3.org/2000/svg'));
  });

  it('stops once the timer has run out', async () => {
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.active' }, { states }));
    show(el);
    vi.advanceTimersByTime(151_000);
    expect(tickerState().running).toBe(false);
  });

  it('no ticker and no observer for other rings (or paused / idle timers)', async () => {
    for (const r of [
      resolveRing({ mode: 'value', entity: 'sensor.v' }, { states }),
      resolveRing({ mode: 'animated' }, { states }),
      resolveRing({ mode: 'value', entity: 'timer.paused' }, { states }),
      resolveRing({ mode: 'value', entity: 'timer.idle' }, { states }),
    ]) {
      const el = await mountRing(r);
      expect(made.length === 0 || !io().els.has(el)).toBe(true);
    }
    expect(tickerState().running).toBe(false);
  });

  it('a timer ring that turns idle stops ticking', async () => {
    const el = await mountRing(resolveRing({ mode: 'value', entity: 'timer.active' }, { states }));
    show(el);
    expect(tickerState().running).toBe(true);
    el.ring = resolveRing({ mode: 'value', entity: 'timer.idle' }, { states });
    await el.updateComplete;
    expect(tickerState().running).toBe(false);
  });
});

describe('min and max from an entity', () => {
  it('resolveBound: number, entity state, attribute, fallback', () => {
    expect(resolveBound(5, states, 0)).toBe(5);
    expect(resolveBound({ entity: 'sensor.cap' }, states, 100)).toBe(200);
    expect(resolveBound({ entity: 'sensor.cap', attribute: 'limit' }, states, 100)).toBe(50);
    expect(resolveBound({ entity: 'sensor.na' }, states, 100)).toBe(100);
    expect(resolveBound({ entity: 'sensor.gone' }, states, 0)).toBe(0);
    expect(resolveBound({ entity: 'sensor.cap', attribute: 'nope' }, states, 7)).toBe(7);
    expect(resolveBound(undefined, states, 100)).toBe(100);
  });

  it('the ring fills against them', () => {
    expect(resolveRing({ mode: 'value', entity: 'sensor.v', max: { entity: 'sensor.cap' } }, { states })!.fill).toBeCloseTo(0.5);
    expect(resolveRing({ mode: 'value', entity: 'sensor.v', min: { entity: 'sensor.cap', attribute: 'limit' }, max: { entity: 'sensor.cap' } }, { states })!.fill).toBeCloseTo(1 / 3);
    // unreadable max: back to 100
    expect(resolveRing({ mode: 'value', entity: 'sensor.v', min: 50, max: { entity: 'sensor.na' } }, { states })!.fill).toBe(1);
  });

  it('the card re-renders when the min / max entity changes', () => {
    const config = {
      type: 'custom:magic-card',
      rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'm', type: 'text', text: 'x', design: { ring: { mode: 'value', entity: 'sensor.v', min: { entity: 'sensor.lo' }, max: { entity: 'sensor.cap', attribute: 'limit' } } } }] }] }],
    } as unknown as MagicCardConfig;
    expect(collectDependencies(config).entities).toEqual(expect.arrayContaining(['sensor.v', 'sensor.lo', 'sensor.cap']));
  });
});

describe('ring editor: entity min / max and timers', () => {
  async function editor(ring: RingConfig | undefined, props: Partial<RingEditor> = {}) {
    const el = document.createElement('mc-ring-editor') as RingEditor;
    const out: Array<RingConfig | undefined> = [];
    Object.assign(el, { ring, hass: hassWith({ 'timer.t': { state: 'idle', attributes: { duration: '0:10:00' } }, 'sensor.cap': { state: '5', attributes: { limit: 3 } } }), onChange: (r: RingConfig | undefined) => { out.push(r); el.ring = r; }, ...props });
    document.body.appendChild(el);
    await el.updateComplete;
    const root = el.shadowRoot!;
    const labels = () => [...root.querySelectorAll('.field-head')].map((h) => h.textContent!.trim());
    const seg = (name: string) => root.querySelector<HTMLElement>(`[role="radiogroup"][aria-label="${name}"]`)!;
    const click = async (b: Element) => { (b as HTMLElement).click(); await el.updateComplete; };
    return { el, root, out, labels, seg, click };
  }

  it('Min and Max switch between Number and Entity', async () => {
    const { root, seg, out, click, el } = await editor({ mode: 'value', entity: 'sensor.cap', min: 2 });
    expect([...seg('Min source').querySelectorAll('button')].map((b) => b.textContent!.trim())).toEqual(['Number', 'Entity']);
    expect(seg('Min source').querySelector('[aria-checked="true"]')!.getAttribute('data-val')).toBe('number');
    expect(root.querySelector('#ring-min')).toBeTruthy();
    await click(seg('Min source').querySelector('[data-val="entity"]')!);
    expect(out.pop()).toEqual({ mode: 'value', entity: 'sensor.cap' });
    const picker = root.querySelector('mc-entity-picker[label="Min entity"], mc-entity-picker') as HTMLElement;
    const pickers = [...root.querySelectorAll('mc-entity-picker')] as Array<HTMLElement & { label: string }>;
    const minPicker = pickers.find((p) => p.label === 'Min entity')!;
    expect(picker && minPicker).toBeTruthy();
    minPicker.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'sensor.cap' } }));
    await el.updateComplete;
    expect(out.pop()).toMatchObject({ min: { entity: 'sensor.cap' } });
    const attr = [...root.querySelectorAll('mc-attribute-picker')].find((p) => p.previousElementSibling === minPicker)!;
    expect(attr).toBeTruthy();
    attr.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'limit' } }));
    await el.updateComplete;
    expect(out.pop()).toMatchObject({ min: { entity: 'sensor.cap', attribute: 'limit' } });
    // reset: back to Number, key removed
    await click(root.querySelector('button.field-reset[aria-label="Reset Min"]')!);
    expect(out.pop()).toEqual({ mode: 'value', entity: 'sensor.cap' });
    expect(seg('Min source').querySelector('[aria-checked="true"]')!.getAttribute('data-val')).toBe('number');
  });

  it('a stored entity bound opens in Entity mode; Number clears it', async () => {
    const { seg, out, click } = await editor({ mode: 'value', max: { entity: 'sensor.cap' } });
    expect(seg('Max source').querySelector('[aria-checked="true"]')!.getAttribute('data-val')).toBe('entity');
    await click(seg('Max source').querySelector('[data-val="number"]')!);
    expect(out.pop()).toEqual({ mode: 'value' });
  });

  it('a timer entity shows Timer fill and hides Min, Max and Attribute', async () => {
    const { labels, seg, out, click, root } = await editor({ mode: 'value', entity: 'timer.t' });
    expect(labels()).toContain('Timer fill');
    expect(labels()).not.toEqual(expect.arrayContaining(['Min']));
    expect(labels().some((l) => /^(Min|Max|Attribute)/.test(l))).toBe(false);
    expect(root.textContent).toMatch(/Min, Max and Attribute do not apply/);
    await click(seg('Timer fill').querySelector('[data-val="elapsed"]')!);
    expect(out.pop()).toEqual({ mode: 'value', entity: 'timer.t', timer_fill: 'elapsed' });
    await click(seg('Timer fill').querySelector('[data-val="remaining"]')!);
    expect(out.pop()).toEqual({ mode: 'value', entity: 'timer.t' });
  });

  it('Entity mode before a pick survives its own edits, and is dropped when another ring is loaded', async () => {
    const { seg, click, el } = await editor({ mode: 'value', entity: 'sensor.cap', min: 2 });
    await click(seg('Min source').querySelector('[data-val="entity"]')!);
    // the parent passes a copy of what the editor wrote: still Entity
    el.ring = { ...el.ring! };
    await el.updateComplete;
    expect(seg('Min source').querySelector('[aria-checked="true"]')!.getAttribute('data-val')).toBe('entity');
    el.ring = { mode: 'value', entity: 'sensor.cap' , max: 5 };
    await el.updateComplete;
    expect(seg('Min source').querySelector('[aria-checked="true"]')!.getAttribute('data-val')).toBe('number');
  });

  it('the module entity being a timer counts too', async () => {
    const { labels } = await editor({ mode: 'value' }, { defaultEntity: 'timer.t' });
    expect(labels()).toContain('Timer fill');
  });
});

describe('countdown text', () => {
  const timers = {
    'timer.a': { state: 'active', attributes: { friendly_name: 'Tea', duration: '0:10:00', finishes_at: iso(NOW + 3_725_000) } },
    'timer.p': { state: 'paused', attributes: { friendly_name: 'Tea', duration: '0:10:00', remaining: '0:04:00' } },
    'timer.i': { state: 'idle', attributes: { friendly_name: 'Tea', duration: '0:10:00' } },
  };
  const hass = hassWith(timers);
  const preview = (type: string, cfg: Record<string, unknown>) => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    rendered.push(el);
    render(ModuleRegistry.get(type as never)!.renderPreview({ id: 'x', type, ...cfg } as CardModule, hass), el);
    return el;
  };

  it('the directive counts down on the shared ticker while on screen', () => {
    const el = document.createElement('span');
    document.body.appendChild(el);
    render(countdown(hass.states['timer.a']), el);
    expect(el.textContent).toBe('1:02:05');
    show(el);
    vi.advanceTimersByTime(6000);
    expect(el.textContent).toBe('1:01:59');
    show(el, false);
    expect(tickerState().running).toBe(false);
    show(el);
    render(nothing, el);
    expect(tickerState().running).toBe(false);
  });

  it('info: live remaining for active, frozen for paused, the state for idle', () => {
    const a = preview('info', { entity: 'timer.a' });
    expect(a.querySelector('.mc-info-state')!.textContent!.trim()).toBe('1:02:05');
    show(a.querySelector('.mc-info-state')!);
    vi.advanceTimersByTime(5000);
    expect(a.querySelector('.mc-info-state')!.textContent!.trim()).toBe('1:02:00');
    expect(preview('info', { entity: 'timer.p' }).querySelector('.mc-info-state')!.textContent!.trim()).toBe('4:00');
    expect(preview('info', { entity: 'timer.i' }).querySelector('.mc-info-state')!.textContent!.trim()).toBe('Idle');
  });

  it('text: entity_display remaining', () => {
    const a = preview('text', { use_entity: true, entity: 'timer.a', entity_display: 'remaining' });
    expect(a.textContent!.trim()).toBe('1:02:05');
    show(a.querySelector('.mc-text-countdown')!);
    vi.advanceTimersByTime(65_000);
    expect(a.textContent!.trim()).toBe('1:01:00');
    expect(preview('text', { use_entity: true, entity: 'timer.p', entity_display: 'remaining' }).textContent!.trim()).toBe('4:00');
    expect(preview('text', { use_entity: true, entity: 'timer.i', entity_display: 'remaining' }).textContent!.trim()).toBe('Idle');
    expect(preview('text', { use_entity: true, entity: 'timer.a' }).textContent!.trim()).toBe('Active');
  });

  it('text editor offers Remaining for timer entities only', () => {
    const opts = (entity: string) => {
      const el = document.createElement('div');
      render(editorFor('text' as never).renderGeneralTab({ id: 'x', type: 'text', use_entity: true, entity } as CardModule, hass, () => undefined), el);
      return el.textContent!.includes('Remaining');
    };
    expect(opts('timer.a')).toBe(true);
    expect(opts('sensor.x')).toBe(false);
  });
});
