import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getImage, loadImage, watchImage, invalidateImages, __resetImageClientForTests } from '../src/svg-image/client';
import { IMAGE_MAX_GET_IDS, IMAGE_RETRY_MAX_MS, IMAGE_RETRY_MS } from '../src/contracts/svg-image';

const SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path id="a" d="M0 0L10 10" fill="#f00"/></svg>';
const saved = (id: string, updated = 't1', svg = SVG) => ({ id, name: id, view_box: '0 0 100 50', svg, created_at: 't0', updated_at: updated });

type Msg = { type: string; ids?: string[] };
interface Server {
  images: Map<string, ReturnType<typeof saved>>;
  calls: Msg[];
  fail?: { code: string } | Error;
  ws: (msg: Msg) => Promise<unknown>;
}
const server = (...ids: string[]): Server => {
  const s: Server = {
    images: new Map(ids.map((id) => [id, saved(id)])),
    calls: [],
    ws: async (msg) => {
      s.calls.push(msg);
      if (s.fail) throw s.fail;
      if (msg.type === 'magic_card_utils/images_list') return { images: [...s.images.values()].map((i) => ({ id: i.id, updated_at: i.updated_at })) };
      return { images: (msg.ids ?? []).flatMap((id) => (s.images.has(id) ? [s.images.get(id)!] : [])) };
    },
  };
  return s;
};
const gets = (s: Server) => s.calls.filter((c) => c.type === 'magic_card_utils/images_get');
const lists = (s: Server) => s.calls.filter((c) => c.type === 'magic_card_utils/images_list');
const settle = (ms = 100) => vi.advanceTimersByTimeAsync(ms);

beforeEach(() => {
  vi.useFakeTimers();
  __resetImageClientForTests();
});
afterEach(() => {
  __resetImageClientForTests();
  vi.useRealTimers();
});

describe('image client: reading', () => {
  it('batches every id asked for in one frame, at most IMAGE_MAX_GET_IDS per call', async () => {
    const ids = Array.from({ length: 10 }, (_, i) => `img-${i}`);
    const s = server(...ids);
    const all = ids.map((id) => loadImage(id, s.ws));
    await settle(2000);
    expect(gets(s)).toHaveLength(2);
    expect(gets(s)[0].ids).toHaveLength(IMAGE_MAX_GET_IDS);
    expect(gets(s)[1].ids).toHaveLength(2);
    for (const r of await Promise.all(all)) expect('entry' in r).toBe(true);
  });

  it('asks once for an id requested twice and serves later requests from memory', async () => {
    const s = server('a');
    const p1 = loadImage('a', s.ws);
    const p2 = loadImage('a', s.ws);
    await settle(500);
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe(r2);
    const again = await loadImage('a', s.ws);
    expect('entry' in again && again.entry).toBe('entry' in r1 && r1.entry);
    expect(gets(s)).toHaveLength(1);
  });

  it('sanitises after the frame, not in the response callback', async () => {
    const s = server('a');
    let done = false;
    void loadImage('a', s.ws).then(() => (done = true));
    await vi.advanceTimersByTimeAsync(0);
    expect(done).toBe(false);
    await settle(500);
    expect(done).toBe(true);
  });

  it('keeps an inert template, the viewBox and the ids of the drawing', async () => {
    const s = server('a');
    const p = loadImage('a', s.ws);
    await settle(500);
    const r = await p;
    if (!('entry' in r)) throw new Error('missing');
    expect(r.entry.template).toBeInstanceOf(HTMLTemplateElement);
    expect(r.entry.template.content.querySelector('path')).not.toBeNull();
    expect(r.entry.viewBox).toBe('0 0 100 50');
    expect(r.entry.ids).toEqual(['a']);
    expect(r.entry.updatedAt).toBe('t1');
  });

  it('getImage returns the saved item with its sanitised drawing, and undefined when missing', async () => {
    const s = server('a');
    const p = getImage('a', s.ws);
    const q = getImage('nope', s.ws);
    await settle(500);
    const got = await p;
    expect(got?.name).toBe('a');
    expect(got?.sanitized.markup).toContain('<path');
    expect(got?.sanitized.error).toBeUndefined();
    expect(await q).toBeUndefined();
  });

  it('refuses a stored drawing that does not pass the sanitiser, and does not retry it', async () => {
    const s = server();
    s.images.set('bad', saved('bad', 't1', '<!DOCTYPE svg [<!ENTITY a "b">]><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'));
    const p = loadImage('bad', s.ws);
    await settle(500);
    expect(await p).toEqual({ missing: 'refused' });
    await settle(IMAGE_RETRY_MAX_MS * 2);
    expect(gets(s)).toHaveLength(1);
    expect(lists(s)).toHaveLength(0);
  });
});

describe('image client: missing items', () => {
  it('reports an id the server leaves out as missing', async () => {
    const s = server();
    const p = loadImage('gone', s.ws);
    await settle(500);
    expect(await p).toEqual({ missing: 'unknown' });
  });

  it.each(['unknown_command', 'unauthorized'])('stops for %s: no retry, no list', async (code) => {
    const s = server('a');
    s.fail = { code };
    const p = loadImage('a', s.ws);
    await settle(500);
    expect(await p).toEqual({ missing: 'unavailable' });
    await settle(IMAGE_RETRY_MAX_MS * 3);
    expect(s.calls).toHaveLength(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('retries after IMAGE_RETRY_MS through images_list and reads the item once it is there', async () => {
    const s = server();
    const seen = vi.fn();
    const p = loadImage('late', s.ws);
    watchImage('late', seen);
    await settle(500);
    expect(await p).toEqual({ missing: 'unknown' });
    s.images.set('late', saved('late'));
    await settle(IMAGE_RETRY_MS);
    expect(lists(s)).toHaveLength(1);
    await settle(2000);
    expect(gets(s)).toHaveLength(2);
    expect(seen).toHaveBeenCalled();
    const r = await loadImage('late', s.ws);
    expect('entry' in r).toBe(true);
  });

  it('stops for good when a fresh images_list does not hold the id', async () => {
    const s = server();
    const p = loadImage('deleted', s.ws);
    watchImage('deleted', () => undefined);
    await settle(500);
    await p;
    await settle(IMAGE_RETRY_MS + 500);
    expect(lists(s)).toHaveLength(1);
    await settle(IMAGE_RETRY_MAX_MS * 3);
    expect(lists(s)).toHaveLength(1);
    expect(gets(s)).toHaveLength(1);
    expect(await loadImage('deleted', s.ws)).toEqual({ missing: 'deleted' });
  });

  it('doubles the wait up to IMAGE_RETRY_MAX_MS while the item is listed but cannot be read', async () => {
    const s = server();
    s.images.set('flaky', saved('flaky'));
    s.ws = async (msg) => {
      s.calls.push(msg);
      if (msg.type === 'magic_card_utils/images_list') return { images: [{ id: 'flaky', updated_at: 't1' }] };
      return { images: [] };
    };
    void loadImage('flaky', s.ws);
    watchImage('flaky', () => undefined);
    await settle(500);
    const waits: number[] = [];
    let last = 0;
    for (let t = 0; t < IMAGE_RETRY_MAX_MS * 4 && waits.length < 8; t += 1000) {
      await settle(1000);
      const n = lists(s).length;
      if (n > last) {
        waits.push(t);
        last = n;
      }
    }
    const gaps = waits.slice(1).map((w, i) => w - waits[i]);
    expect(gaps[0]).toBeGreaterThanOrEqual(IMAGE_RETRY_MS * 2 - 2000);
    expect(gaps[1]).toBeGreaterThanOrEqual(gaps[0] * 2 - 2000);
    expect(Math.max(...gaps)).toBeLessThanOrEqual(IMAGE_RETRY_MAX_MS + 2000);
  });

  it('clears the retry timer when the last watcher goes', async () => {
    const s = server();
    void loadImage('x', s.ws);
    const stop = watchImage('x', () => undefined);
    await settle(500);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    stop();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('treats a network error as missing and retries quietly', async () => {
    const s = server('a');
    s.fail = new Error('socket closed');
    const p = loadImage('a', s.ws);
    watchImage('a', () => undefined);
    await settle(500);
    expect(await p).toEqual({ missing: 'unknown' });
    s.fail = undefined;
    await settle(IMAGE_RETRY_MS + 3000);
    expect(lists(s).length + gets(s).length).toBeGreaterThan(1);
  });
});

describe('image client: freshness', () => {
  it('drops listed ids on a provider event, tells watchers and reads again', async () => {
    const s = server('a', 'b');
    const p = Promise.all([loadImage('a', s.ws), loadImage('b', s.ws)]);
    await settle(500);
    await p;
    const seenA = vi.fn();
    const seenB = vi.fn();
    watchImage('a', seenA);
    watchImage('b', seenB);
    s.images.set('a', saved('a', 't2'));
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'images', ids: ['a'] } }));
    expect(seenA).toHaveBeenCalledTimes(1);
    expect(seenB).not.toHaveBeenCalled();
    const again = loadImage('a', s.ws);
    await settle(500);
    const r = await again;
    expect('entry' in r && r.entry.updatedAt).toBe('t2');
  });

  it('ignores events for other kinds, and drops everything when no ids are listed', async () => {
    const s = server('a');
    const p = loadImage('a', s.ws);
    await settle(500);
    await p;
    const seen = vi.fn();
    watchImage('a', seen);
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'icons', ids: ['a'] } }));
    expect(seen).not.toHaveBeenCalled();
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'images', ids: [] } }));
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('a provider event wakes an id that stopped as deleted or unavailable', async () => {
    const s = server();
    s.fail = { code: 'unknown_command' };
    const p = loadImage('a', s.ws);
    await settle(500);
    await p;
    s.fail = undefined;
    s.images.set('a', saved('a'));
    window.dispatchEvent(new CustomEvent('mcu-library-changed', { detail: { kind: 'images', ids: ['a'] } }));
    const again = loadImage('a', s.ws);
    await settle(500);
    expect('entry' in (await again)).toBe(true);
  });

  it('on a reconnect lists once and refreshes only the ids whose updated_at changed', async () => {
    const s = server('a', 'b');
    const handlers: Record<string, () => void> = {};
    const conn = { addEventListener: (n: string, cb: () => void) => void (handlers[n] = cb), removeEventListener: vi.fn() };
    const p = Promise.all([loadImage('a', s.ws, conn), loadImage('b', s.ws, conn)]);
    await settle(500);
    await p;
    const seenA = vi.fn();
    const seenB = vi.fn();
    watchImage('a', seenA);
    watchImage('b', seenB);
    s.images.set('b', saved('b', 't9'));
    handlers.ready();
    await settle(500);
    expect(lists(s)).toHaveLength(1);
    expect(seenA).not.toHaveBeenCalled();
    expect(seenB).toHaveBeenCalledTimes(1);
    expect(gets(s)).toHaveLength(1);
  });

  it('binds one listener per connection', async () => {
    const s = server('a', 'b');
    const add = vi.fn();
    const conn = { addEventListener: add, removeEventListener: vi.fn() };
    void loadImage('a', s.ws, conn);
    void loadImage('b', s.ws, conn);
    await settle(500);
    expect(add).toHaveBeenCalledTimes(1);
  });

  it('invalidate forgets the ids without a provider', async () => {
    const s = server('a');
    const p = loadImage('a', s.ws);
    await settle(500);
    await p;
    invalidateImages(['a']);
    const again = loadImage('a', s.ws);
    await settle(500);
    await again;
    expect(gets(s)).toHaveLength(2);
  });
});
