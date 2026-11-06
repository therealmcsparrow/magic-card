import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/index';
import { resolveValueBackground } from '../src/utils/value-background';
import { sparklineHistory, sparklinePath } from '../src/card/value-bg-sparkline';
import { clearHistoryCache, getHistory, HISTORY_TTL_MS, peekHistory } from '../src/services/history-cache';
import type { HassEntity, HomeAssistant } from '../src/types';
import { settle } from './helpers/fake-hass';
import { STATES, hassWith, mount } from './helpers/content-hass';

const ent = (entity_id: string, state: string, attributes: Record<string, unknown> = {}): HassEntity =>
  ({ entity_id, state, attributes, last_changed: '', last_updated: '' }) as unknown as HassEntity;
const hassOf = (...states: HassEntity[]) =>
  ({ states: Object.fromEntries(states.map((s) => [s.entity_id, s])) }) as unknown as HomeAssistant;

afterEach(() => {
  document.body.innerHTML = '';
  clearHistoryCache();
});

describe('resolveValueBackground', () => {
  const hass = hassOf(
    ent('sensor.tank', '63'),
    ent('sensor.temp', '21', { level: 40 }),
    ent('sensor.off', 'unavailable'),
    ent('sensor.text', 'full'),
    ent('light.desk', 'on', { rgb_color: [255, 0, 0] }),
  );

  it('fill level from the state (0..100 by default)', () => {
    const r = resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.tank' })!;
    expect(r.type).toBe('fill');
    expect(r.level).toBeCloseTo(0.63);
    expect(r.entity).toBe('sensor.tank');
    expect(r).toMatchObject({ opacity: 0.25, direction: 'up', wave: true });
  });

  it('own entity, attribute and min / max', () => {
    expect(resolveValueBackground({ type: 'fill', entity: 'sensor.temp', attribute: 'level' }, { hass, entity: 'sensor.tank' })!.level).toBeCloseTo(0.4);
    const r = resolveValueBackground({ type: 'fill', entity: 'sensor.temp', min: 10, max: '30' }, { hass })!;
    expect(r.level).toBeCloseTo(0.55);
    expect(r).toMatchObject({ min: 10, max: 30 });
    expect(resolveValueBackground({ type: 'fill', entity: 'sensor.temp', min: 30, max: 40 }, { hass })!.level).toBe(0);
    expect(resolveValueBackground({ type: 'fill', entity: 'sensor.temp', min: 0, max: 10 }, { hass })!.level).toBe(1);
  });

  it('unavailable / non-numeric / missing / empty range → no level (never NaN)', () => {
    expect(resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.off' })!.level).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.text' })!.level).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.gone' })!.level).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill', min: 5, max: 5 }, { hass, entity: 'sensor.tank' })!.level).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill', attribute: 'nope' }, { hass, entity: 'sensor.tank' })!.level).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill' }, { entity: 'sensor.tank' })!.level).toBeUndefined();
  });

  it('off / unknown type / no entity → nothing', () => {
    expect(resolveValueBackground(undefined, { hass, entity: 'sensor.tank' })).toBeUndefined();
    expect(resolveValueBackground({ type: 'off' as never }, { hass, entity: 'sensor.tank' })).toBeUndefined();
    expect(resolveValueBackground({ type: 'fill' }, { hass })).toBeUndefined();
  });

  it('colours: safe CSS colour, entity colour, default; unsafe dropped', () => {
    expect(resolveValueBackground({ type: 'fill', color: '#4fc3f7' }, { hass, entity: 'sensor.tank' })!.color).toBe('#4fc3f7');
    expect(resolveValueBackground({ type: 'fill', color: 'entity' }, { hass, entity: 'light.desk' })!.color).toBe('rgb(255, 0, 0)');
    expect(resolveValueBackground({ type: 'fill', color: 'entity 50%' }, { hass, entity: 'light.desk' })!.color)
      .toBe('color-mix(in srgb, rgb(255, 0, 0) 50%, transparent)');
    // a sensor has no state colour: the wrapper's entity colour var
    expect(resolveValueBackground({ type: 'fill', color: 'entity' }, { hass, entity: 'sensor.tank' })!.color).toContain('var(--mc-entity-color');
    const def = resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.tank' })!.color;
    expect(def).toContain('--mc-primary');
    expect(resolveValueBackground({ type: 'fill', color: 'red;}body{x:url(a)' }, { hass, entity: 'sensor.tank' })!.color).toBe(def);
  });

  it('opacity, direction and sparkline options', () => {
    expect(resolveValueBackground({ type: 'fill', opacity: '40%', direction: 'left', wave: false }, { hass, entity: 'sensor.tank' }))
      .toMatchObject({ opacity: 0.4, direction: 'left', wave: false });
    expect(resolveValueBackground({ type: 'fill', direction: 'sideways' as never, opacity: 0.6 }, { hass, entity: 'sensor.tank' }))
      .toMatchObject({ opacity: 0.6, direction: 'up' });
    const s = resolveValueBackground({ type: 'sparkline' }, { hass, entity: 'sensor.temp' })!;
    // quieter sparkline defaults (the fill keeps 25%); no level for a sparkline (it draws the history)
    expect(s).toMatchObject({ type: 'sparkline', hours: 24, lineWidth: 1.5, opacity: 0.18, area: true, smoothing: true });
    expect(s.min).toBeUndefined();
    expect('level' in s).toBe(false);
    expect(resolveValueBackground({ type: 'fill' }, { hass, entity: 'sensor.tank' })!.opacity).toBe(0.25);
    expect(resolveValueBackground({ type: 'none' }, { hass, entity: 'sensor.tank' })).toBeUndefined();
    expect(resolveValueBackground({ type: 'sparkline', hours: '6', line_width: 3, area: false, smoothing: false }, { hass, entity: 'sensor.temp' }))
      .toMatchObject({ hours: 6, lineWidth: 3, area: false, smoothing: false });
    expect(resolveValueBackground({ type: 'sparkline', hours: -2 }, { hass, entity: 'sensor.temp' })!.hours).toBe(24);
  });
});

/** Every number pair of an absolute M / L / C path. */
function points(d: string): Array<{ x: number; y: number }> {
  const nums = (d.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? []).map(Number);
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i + 1 < nums.length; i += 2) out.push({ x: nums[i], y: nums[i + 1] });
  return out;
}
const commands = (d: string) => d.match(/[MLC]/g)?.length ?? 0;

describe('sparklinePath', () => {
  const series = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => ({ t: i * 60_000, v: f(i) }));

  it('500 points → ≤60 points, inside the box, closed area', () => {
    const res = sparklinePath(series(500, (i) => Math.sin(i / 20) * 10 + 20), 300, 80, { smoothing: true, area: true });
    expect(commands(res.line)).toBeLessThanOrEqual(60);
    expect(commands(res.line)).toBeGreaterThan(30);
    for (const p of points(res.line)) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(300);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(80);
    }
    expect(res.line).not.toMatch(/NaN|Z/);
    expect(res.area).toMatch(/^M.*Z$/);
    expect(res.area!.startsWith(res.line)).toBe(true);
  });

  it('spans the width; min / max scale the values (clamped)', () => {
    const res = sparklinePath(series(3, (i) => [0, 50, 200][i]), 100, 100, { min: 0, max: 100, smoothing: false, area: false });
    const pts = points(res.line);
    expect(pts[0].x).toBe(0);
    expect(pts[pts.length - 1].x).toBe(100);
    expect(pts[1].y).toBeCloseTo(50, 0);
    expect(pts[2].y).toBeLessThan(pts[1].y); // above max: at the top
    expect(res.area).toBeUndefined();
  });

  it('flat data → a horizontal line in the middle', () => {
    const res = sparklinePath(series(10, () => 5), 200, 60, { smoothing: true, area: false });
    for (const p of points(res.line)) expect(p.y).toBeCloseTo(30, 5);
  });

  it('a single point / no points / bad numbers → no path', () => {
    expect(sparklinePath([{ t: 0, v: 3 }], 100, 50, { smoothing: true, area: true })).toEqual({ line: '' });
    expect(sparklinePath([], 100, 50, { smoothing: true, area: true })).toEqual({ line: '' });
    expect(sparklinePath([{ t: 0, v: NaN }, { t: 1, v: 4 }], 100, 50, { smoothing: true, area: true })).toEqual({ line: '' });
    expect(sparklinePath(series(5, (i) => i), 0, 50, { smoothing: true, area: true })).toEqual({ line: '' });
  });
});

describe('sparklinePath over a time window', () => {
  const H = 3600_000;
  /** Every control and end point of an M / C path, in order. */
  const ctrl = (d: string) => points(d);

  it('a step: no backtracking, no overshoot (monotone cubic), within the padding', () => {
    // flat at 0 for hours, a jump to 100 with samples clustered right after it, then flat
    const samples = [
      { t: 0, v: 0 }, { t: 1 * H, v: 0 }, { t: 2 * H, v: 0 }, { t: 9 * H, v: 0 },
      { t: 10 * H, v: 100 }, { t: 10 * H + 60_000, v: 100 }, { t: 10 * H + 120_000, v: 100 }, { t: 23 * H, v: 100 },
    ];
    const res = sparklinePath(samples, 300, 80, { smoothing: true, area: false, pad: 4, start: 0, end: 24 * H });
    const pts = ctrl(res.line);
    expect(pts.length).toBeGreaterThan(4);
    for (let i = 1; i < pts.length; i++) expect(pts[i].x).toBeGreaterThanOrEqual(pts[i - 1].x - 1e-9);
    for (const p of pts) {
      expect(p.y).toBeGreaterThanOrEqual(4 - 1e-6);
      expect(p.y).toBeLessThanOrEqual(76 + 1e-6);
    }
    // held to the end of the window
    expect(pts[pts.length - 1].x).toBeCloseTo(300, 5);
    expect(pts[pts.length - 1].y).toBeCloseTo(4, 5);
  });

  it('many samples: a fixed number of buckets over the window, gaps keep the last value', () => {
    const samples = Array.from({ length: 2000 }, (_, i) => ({ t: (i / 2000) * 6 * H, v: i % 7 }));
    const res = sparklinePath(samples, 300, 80, { smoothing: true, area: true, start: 0, end: 24 * H });
    expect(commands(res.line)).toBeLessThanOrEqual(60);
    const pts = ctrl(res.line);
    // the last 18 hours have no samples: the line holds the last value to the right edge
    expect(pts[pts.length - 1].x).toBeCloseTo(300, 5);
    expect(pts.filter((p) => p.x > 100).every((p, _, a) => Math.abs(p.y - a[0].y) < 1e-6)).toBe(true);
  });

  it('one unchanged sample over 24 h: a flat line across the window', () => {
    const res = sparklinePath([{ t: 0, v: 42 }], 200, 60, { smoothing: true, area: true, start: 0, end: 24 * H });
    const pts = ctrl(res.line);
    expect(pts[0].x).toBe(0);
    expect(pts[pts.length - 1].x).toBe(200);
    for (const p of pts) expect(p.y).toBeCloseTo(30, 5);
    expect(res.area).toMatch(/Z$/);
  });

  it('samples before the window start at its left edge; after its end are dropped', () => {
    const res = sparklinePath([{ t: -5 * H, v: 1 }, { t: 2 * H, v: 3 }, { t: 30 * H, v: 99 }], 100, 50, { smoothing: false, area: false, start: 0, end: 10 * H });
    const pts = ctrl(res.line);
    expect(pts[0].x).toBe(0);
    expect(Math.max(...pts.map((p) => p.x))).toBe(100);
    expect(pts[pts.length - 1].y).toBeCloseTo(2, 5); // 3 is the max of the window: top
  });

  it('reversed min / max are swapped; one-sided ranges and a bad pad never give NaN', () => {
    const s = [{ t: 0, v: 0 }, { t: H, v: 50 }, { t: 2 * H, v: 100 }];
    const a = sparklinePath(s, 100, 100, { min: 0, max: 100, smoothing: false, area: false });
    expect(sparklinePath(s, 100, 100, { min: 100, max: 0, smoothing: false, area: false }).line).toBe(a.line);
    // min above every value: the line lies on the bottom
    const low = sparklinePath(s, 100, 100, { min: 200, smoothing: false, area: false });
    for (const p of ctrl(low.line)) expect(p.y).toBeCloseTo(98, 5);
    // max below every value: on the top
    const high = sparklinePath(s, 100, 100, { max: -5, smoothing: false, area: false });
    for (const p of ctrl(high.line)) expect(p.y).toBeCloseTo(2, 5);
    const nanPad = sparklinePath(s, 100, 100, { smoothing: true, area: true, pad: NaN });
    expect(nanPad.line).not.toMatch(/NaN/);
    expect(nanPad.line).toBe(sparklinePath(s, 100, 100, { smoothing: true, area: true }).line);
  });

  it('hours are capped at a week', () => {
    const hass = hassOf(ent('sensor.t', '1'));
    expect(resolveValueBackground({ type: 'sparkline', hours: 1000 }, { hass, entity: 'sensor.t' })!.hours).toBe(168);
  });
});

describe('sparklineHistory and the held end', () => {
  const t0 = 1_000_000_000_000;
  const H = 3600_000;

  it('buckets a long history to leave room for the live value and the held end (no second bucketing)', () => {
    const samples = Array.from({ length: 500 }, (_, i) => ({ t: t0 + (i * 24 * H) / 500, v: i % 7 }));
    const { points, last } = sparklineHistory(samples, t0, t0 + 24 * H);
    expect(points.length).toBeLessThanOrEqual(58);
    expect(points[0].t).toBe(t0);
    expect(last).toBe(499 % 7);
    // a short history unchanged (clamped to the window start, later samples dropped)
    const short = sparklineHistory([{ t: t0 - H, v: 1 }, { t: t0 + H, v: 2 }, { t: t0 + 30 * H, v: 3 }], t0, t0 + 24 * H);
    expect(short).toEqual({ points: [{ t: t0, v: 1 }, { t: t0 + H, v: 2 }], last: 2 });
    expect(sparklineHistory([], t0, t0 + H)).toEqual({ points: [] });
  });

  it('splitHeld: the held end as its own tail, at the held value', () => {
    const pts = [{ t: t0, v: 0 }, { t: t0 + H, v: 10 }, { t: t0 + 2 * H, v: 5 }];
    const opts = { smoothing: false, area: true, pad: 0, start: t0, end: t0 + 4 * H, min: 0, max: 10 };
    const whole = sparklinePath(pts, 400, 100, opts);
    expect(whole.tail).toBeUndefined();
    const split = sparklinePath(pts, 400, 100, { ...opts, splitHeld: true });
    expect(split.tail).toBe('M200 50 L400 50');
    expect(points(split.line).pop()).toEqual({ x: 200, y: 50 });
    // the area still runs under the held end
    expect(split.area).toBe(whole.area);
    // hold: another held value (the raw last sample of a bucketed history): the tail runs to it
    expect(sparklinePath(pts, 400, 100, { ...opts, splitHeld: true, hold: 10 }).tail).toBe('M200 50 L400 0');
    // nothing held (the last point at the window end): no tail
    expect(sparklinePath([...pts, { t: t0 + 4 * H, v: 5 }], 400, 100, { ...opts, splitHeld: true }).tail).toBeUndefined();
  });
});

describe('shared history cache', () => {
  it('peekHistory reads the cache without fetching', async () => {
    const callWS = vi.fn(async () => ({ 'sensor.p': [{ s: '4', lu: Date.now() / 1000 }] }));
    const hass = { states: {}, callWS } as unknown as HomeAssistant;
    expect(peekHistory('sensor.p', 6)).toBeUndefined();
    expect(callWS).not.toHaveBeenCalled();
    getHistory(hass, 'sensor.p', 6);
    await new Promise((r) => setTimeout(r, 0));
    expect(peekHistory('sensor.p', 6)?.samples.map((s) => s.v)).toEqual([4]);
    expect(callWS).toHaveBeenCalledTimes(1);
  });

  it('a failed refetch keeps the samples fetched before, with the error', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    let fail = false;
    const callWS = vi.fn(async () => {
      if (fail) throw new Error('down');
      return { 'sensor.r': [{ s: '7', lu: Date.now() / 1000 }] };
    });
    const hass = { states: {}, callWS } as unknown as HomeAssistant;
    getHistory(hass, 'sensor.r', 6);
    await new Promise((r) => setTimeout(r, 0));
    const now = Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(now + HISTORY_TTL_MS + 1);
    fail = true;
    getHistory(hass, 'sensor.r', 6);
    await new Promise((r) => setTimeout(r, 0));
    expect(callWS).toHaveBeenCalledTimes(2);
    const entry = peekHistory('sensor.r', 6)!;
    expect(entry.error).toBe(true);
    expect(entry.samples.map((s) => s.v)).toEqual([7]);
    vi.restoreAllMocks();
  });

  it('a value background reads the history a graph fetched (same key: no second fetch)', async () => {
    const callWS = vi.fn(async (msg: { entity_ids: string[] }) => ({ [msg.entity_ids[0]]: [{ s: '20', lu: Date.now() / 1000 - 3600 }, { s: '22', lu: Date.now() / 1000 - 60 }] }));
    const hass = hassWith(STATES, { callWS });
    const card = await mount([{ id: 'g', type: 'graphs', entity: 'sensor.temp', hours_to_show: 24 }], hass);
    await settle(card, 10);
    expect(callWS).toHaveBeenCalledTimes(1);
    const entry = getHistory(hass, 'sensor.temp', 24);
    expect(entry?.samples.map((s) => s.v)).toEqual([20, 22]);
    expect(callWS).toHaveBeenCalledTimes(1);
  });

  it('fetches once for many readers and notifies each', async () => {
    let resolve!: (v: unknown) => void;
    const callWS = vi.fn(() => new Promise((r) => { resolve = r; }));
    const hass = { states: {}, callWS } as unknown as HomeAssistant;
    const a = vi.fn();
    const b = vi.fn();
    expect(getHistory(hass, 'sensor.x', 6, undefined, a)).toBeUndefined();
    expect(getHistory(hass, 'sensor.x', 6, undefined, b)).toBeUndefined();
    await Promise.resolve();
    expect(callWS).toHaveBeenCalledTimes(1);
    resolve({ 'sensor.x': [{ s: '1', lu: Date.now() / 1000 }] });
    await new Promise((r) => setTimeout(r, 0));
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    expect(getHistory(hass, 'sensor.x', 6)?.samples).toHaveLength(1);
    expect(callWS).toHaveBeenCalledTimes(1);
  });
});
