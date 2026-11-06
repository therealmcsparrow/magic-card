import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from 'lit';
import '../src/index';
import { ModuleRegistry } from '../src/modules/module-registry';
import type { CardModule } from '../src/types';
import { cardConfig, settle } from './helpers/fake-hass';
import { STATES, hassWith, mount, sr } from './helpers/content-hass';
import { clearHistoryCache, downsample, historyRequest, parseHistory } from '../src/services/history-cache';
import { editorFor } from './helpers/module-editor';

afterEach(() => {
  document.body.innerHTML = '';
  clearHistoryCache();
});

describe('graphs module', () => {
  const H = 3600_000;
  it('downsamples to points per hour (average per period, gaps keep the last value)', () => {
    const samples = [{ t: 0, v: 10 }, { t: 0.25 * H, v: 20 }, { t: 2.5 * H, v: 30 }];
    expect(downsample(samples, 0, 3 * H, 1).map((p) => p.v)).toEqual([15, 20, 30]);
    expect(downsample(samples, 0, 3 * H, 2)).toHaveLength(6);
    expect(downsample(samples, 0, 3 * H, 0)).toBe(samples);
  });

  it('asks for attributes (full response) only for an attribute graph and reads them', () => {
    const s = new Date(0);
    const e = new Date(H);
    expect(historyRequest('sensor.t', s, e)).toMatchObject({ minimal_response: true, no_attributes: true });
    expect(historyRequest('climate.lr', s, e, 'current_temperature')).toMatchObject({ minimal_response: false, no_attributes: false, significant_changes_only: false });
    const parsed = parseHistory([
      { s: 'heat', a: { current_temperature: 20 }, lu: 1 },
      { s: 'heat', a: { current_temperature: '21.5' }, lu: 2 },
      { s: 'heat', a: {}, lu: 3 },
    ], 'current_temperature', 0);
    expect(parsed).toEqual([{ t: 1000, v: 20 }, { t: 2000, v: 21.5 }]);
    expect(parseHistory([{ s: 'unavailable', lu: 1 }, { s: '4', lu: 2 }], undefined, 0)).toEqual([{ t: 2000, v: 4 }]);
  });

  it('never draws a fake curve: loading, then the real line, downsampled', async () => {
    let resolve!: (v: unknown) => void;
    const callWS = vi.fn(() => new Promise((r) => { resolve = r; }));
    const now = Date.now() / 1000;
    const card = await mount([{ id: 'g', type: 'graphs', entity: 'climate.lr', attribute: 'current_temperature', points_per_hour: 1, hours_to_show: 4 }],
      hassWith(STATES, { callWS }));
    expect(sr(card).querySelector('path')).toBeNull();
    expect(sr(card).querySelector('.mc-graphs-empty')!.getAttribute('data-status')).toBe('loading');
    expect(callWS.mock.calls[0][0]).toMatchObject({ minimal_response: false, no_attributes: false });
    resolve({ 'climate.lr': [
      { s: 'heat', a: { current_temperature: 19 }, lu: now - 3.9 * 3600 },
      { s: 'heat', a: { current_temperature: 22 }, lu: now - 1.5 * 3600 },
    ] });
    await settle(card, 10);
    const d = sr(card).querySelector('.mc-graphs-line')!.getAttribute('d')!;
    expect(d.match(/[ML]/g)).toHaveLength(4); // 4 hours, 1 point per hour
  });

  it('a failed history request says so (no line)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const card = await mount([{ id: 'g2', type: 'graphs', entity: 'sensor.temp' }], hassWith(STATES, { callWS: vi.fn(async () => { throw new Error('nope'); }) }));
    await settle(card, 10);
    warn.mockRestore();
    expect(sr(card).querySelector('.mc-graphs-empty')!.getAttribute('data-status')).toBe('error');
    expect(sr(card).querySelector('path')).toBeNull();
  });

  it('refetches when the attribute changes', async () => {
    const callWS = vi.fn(async () => ({}));
    const card = await mount([{ id: 'g3', type: 'graphs', entity: 'climate.lr' }], hassWith(STATES, { callWS }));
    await settle(card, 10);
    card.setConfig(cardConfig([{ id: 'g3', type: 'graphs', entity: 'climate.lr', attribute: 'current_temperature' }]));
    await settle(card, 10);
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(callWS.mock.calls[1][0]).toMatchObject({ no_attributes: false });
  });

  it('history is shared by entity / hours / attribute, not module id: same-id graphs on two cards do not refetch each other', async () => {
    const callWS = vi.fn(async (msg: { entity_ids: string[] }) => ({ [msg.entity_ids[0]]: [{ s: '20', lu: Date.now() / 1000 - 3600 }] }));
    const hass = hassWith(STATES, { callWS });
    const a = await mount([{ id: 'g', type: 'graphs', entity: 'sensor.temp' }], hass);
    const b = await mount([{ id: 'g', type: 'graphs', entity: 'sensor.hum' }], hass);
    await settle(a, 10);
    await settle(b, 10);
    for (let i = 0; i < 3; i++) {
      a.requestUpdate();
      b.requestUpdate();
      await settle(a, 5);
      await settle(b, 5);
    }
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(sr(a).querySelector('.mc-graphs-line')).not.toBeNull();
    expect(sr(b).querySelector('.mc-graphs-line')).not.toBeNull();
    // A third graph of the same entity and window reuses the history.
    await mount([{ id: 'other', type: 'graphs', entity: 'sensor.temp', points_per_hour: 4 }], hass);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it('scales a long history without spreading it into Math.min / Math.max', async () => {
    const now = Date.now() / 1000;
    const states = Array.from({ length: 200_000 }, (_v, i) => ({ s: String(i % 50), lu: now - 3600 + i * 0.01 }));
    const card = await mount([{ id: 'big', type: 'graphs', entity: 'sensor.temp', points_per_hour: 0 }],
      hassWith(STATES, { callWS: vi.fn(async () => ({ 'sensor.temp': states })) }));
    await settle(card, 20);
    expect(sr(card).querySelector('.mc-graphs-line')).not.toBeNull();
  });

  it('editor: an attribute graph over more than 48 hours says it loads the full history', () => {
    const hint = (cfg: Record<string, unknown>) => {
      const el = document.createElement('div');
      render(editorFor('graphs').renderGeneralTab({ id: 'g', type: 'graphs', entity: 'climate.lr', ...cfg } as CardModule, hassWith(STATES), () => undefined), el);
      return [...el.querySelectorAll('.mc-field-hint')].some((h) => /every recorded state/.test(h.textContent!));
    };
    expect(hint({ attribute: 'current_temperature', hours_to_show: 72 })).toBe(true);
    expect(hint({ attribute: 'current_temperature', hours_to_show: 24 })).toBe(false);
    expect(hint({ hours_to_show: 168 })).toBe(false);
  });
});
