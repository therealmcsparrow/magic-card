import { afterEach, describe, expect, it, vi } from 'vitest';
import cases from './fixtures/forum-shot-font-cases.json';
import { prepareFonts, type FontResponse, type FontSeams } from '../src/forum-shot/font-fetch';

const hex = (h: string) => new Uint8Array((h.match(/../g) ?? []).map((b) => parseInt(b, 16)));

interface Reply {
  type?: string | null;
  bytes?: Uint8Array;
  status?: number;
  responseType?: string;
  redirected?: boolean;
  contentLength?: number;
  stallMs?: number;
  rejects?: boolean;
}

function reply(r: Reply, signal?: AbortSignal): Promise<FontResponse> {
  const bytes = r.bytes ?? new Uint8Array(0);
  const build = (): FontResponse => {
    let at = 0;
    const headers = new Map<string, string>();
    if (r.type) headers.set('content-type', r.type);
    if (r.contentLength !== undefined) headers.set('content-length', String(r.contentLength));
    return {
      status: r.status ?? 200,
      type: r.responseType ?? 'cors',
      redirected: r.redirected ?? false,
      headers: { get: (n) => headers.get(n.toLowerCase()) ?? null },
      body: {
        getReader: () => ({
          read: async () => {
            if (at >= bytes.length) return { done: true };
            const value = bytes.subarray(at, at + 65536);
            at += value.length;
            return { done: false, value };
          },
          cancel: async () => undefined,
        }),
      },
      arrayBuffer: async () => bytes.buffer as ArrayBuffer,
    };
  };
  if (r.rejects) return Promise.reject(new TypeError('Failed to fetch'));
  if (!r.stallMs) return Promise.resolve(build());
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => resolve(build()), r.stallMs);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
}

interface Call {
  url: string;
  init: Record<string, unknown>;
}

function seams(route: (url: string) => Reply, loads = true, tally = { now: 0, max: 0 }) {
  const calls: Call[] = [];
  const s: FontSeams = {
    fetch: async (url, init) => {
      calls.push({ url, init });
      tally.now++;
      tally.max = Math.max(tally.max, tally.now);
      try {
        await new Promise((r) => setTimeout(r, 1));
        return await reply(route(url), init.signal);
      } finally {
        tally.now--;
      }
    },
    loadFace: async () => loads,
  };
  return { s, calls, tally };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Case = Record<string, any>;

const defaults = cases.stylesheetDefaults;
const woff2 = hex('774f4632');
const fontReply: Reply = { type: 'font/woff2', bytes: woff2 };

function assertEveryRequest(calls: Call[], hosts: string[]) {
  for (const { url, init } of calls) {
    const { signal, ...rest } = init;
    expect(rest).toEqual(cases.requestOptions);
    expect(signal).toBeInstanceOf(AbortSignal);
    const u = new URL(url);
    expect(u.protocol).toBe('https:');
    expect(hosts).toContain(u.hostname);
  }
}

afterEach(() => vi.useRealTimers());

describe('stylesheet cases', () => {
  for (const c of cases.stylesheetCases as Case[]) {
    it(c.id, async () => {
      const sheetUrl = c.stylesheetUrl ?? defaults.stylesheetUrl;
      const hosts: string[] = c.fontHosts ?? defaults.fontHosts;
      const css = c.generate ? c.generate.prefix + c.generate.repeat.repeat(c.generate.count) + c.generate.suffix : c.css;
      const { s, calls } = seams((url) =>
        url === sheetUrl ? { type: c.type, bytes: new TextEncoder().encode(css) } : fontReply,
      );
      const out = await prepareFonts({ fontHosts: hosts, sheets: [{ url: sheetUrl }] }, s);
      expect(out.ok).toBe(c.expect.result === 'ok');
      if (!out.ok) {
        expect(out.code).toBe('font_unavailable');
      } else {
        for (const want of c.expect.faces) expect(out.faces.find((f) => f.family === want.family)).toMatchObject(want);
        expect(out.faces).toHaveLength(c.expect.faces.length);
      }
      expect(calls.slice(1).map((x) => x.url).sort()).toEqual([...c.expect.fetches].sort());
      assertEveryRequest(calls, [...hosts, ...(hosts.includes('fonts.googleapis.com') ? ['fonts.gstatic.com'] : [])]);
    });
  }
});

describe('font cases', () => {
  for (const c of cases.fontCases as Case[]) {
    it(c.id, async () => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      const sheet = { type: 'text/css', bytes: new TextEncoder().encode('@font-face{font-family:Lora;src:url(lora.woff2);}') };
      const font: Reply = {
        type: c.type,
        bytes: c.bodyBytes ? new Uint8Array(c.bodyBytes).fill(0x77) : hex(c.hex ?? ''),
        status: c.status,
        responseType: c.responseType,
        redirected: c.redirected,
        contentLength: c.contentLength,
        stallMs: c.stallMs,
        rejects: c.rejects,
      };
      if (c.bodyBytes) font.bytes!.set(woff2);
      const { s, calls } = seams((url) => (url === defaults.stylesheetUrl ? sheet : font), c.fontFaceLoads !== false);
      const p = prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ url: defaults.stylesheetUrl }] }, s);
      await vi.advanceTimersByTimeAsync(9000);
      const out = await p;
      expect(out.ok).toBe(c.expect === 'ok');
      if (!out.ok) expect(out.code).toBe('font_unavailable');
      assertEveryRequest(calls, defaults.fontHosts);
    });
  }
});

describe('run cases', () => {
  for (const c of cases.runCases as Case[]) {
    it(c.id, async () => {
      const face = (i: number) => `@font-face{font-family:F${i};src:url(https://fonts.example.com/f${i}.woff2);}`;
      const css = Array.from({ length: c.fontFiles }, (_, i) => face(i)).join('');
      const body = new Uint8Array(c.bytesPerFile);
      body.set(woff2);
      const { s, calls, tally } = seams((url) =>
        url === defaults.stylesheetUrl ? { type: 'text/css', bytes: new TextEncoder().encode(css) } : { type: 'font/woff2', bytes: body },
      );
      const sheets = c.stylesheets ? [{ url: defaults.stylesheetUrl }] : [{ css }];
      const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets }, s);
      expect(out.ok).toBe(c.expect === 'ok');
      if (c.maxInFlight) {
        expect(tally.max).toBeLessThanOrEqual(c.maxInFlight);
        expect(tally.max).toBeGreaterThan(1);
      }
      expect(calls.length).toBeLessThanOrEqual(cases.limits.requests);
      assertEveryRequest(calls, defaults.fontHosts);
    });
  }
});

describe('plan edges', () => {
  it('a stylesheet address on an unnamed host stops before any request', async () => {
    const { s, calls } = seams(() => fontReply);
    const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ url: 'https://evil.example.net/a.css' }] }, s);
    expect(out.ok).toBe(false);
    expect(calls).toEqual([]);
  });

  it('a stylesheet address with a port or credentials stops before any request', async () => {
    for (const url of ['https://fonts.example.com:8443/a.css', 'https://u:p@fonts.example.com/a.css', 'http://fonts.example.com/a.css']) {
      const { s, calls } = seams(() => fontReply);
      expect((await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ url }] }, s)).ok).toBe(false);
      expect(calls).toEqual([]);
    }
  });

  it('a redirect that the browser reports as an error is a failed fetch', async () => {
    const { s } = seams(() => ({ rejects: true }));
    const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ url: defaults.stylesheetUrl }] }, s);
    expect(out).toMatchObject({ ok: false, code: 'font_unavailable' });
  });

  it('a stylesheet that yields no face stops the run even when another sheet has faces', async () => {
    const good = '@font-face{font-family:Lora;src:url(https://fonts.example.com/a.woff2);}';
    for (const empty of ['', '@font-face{font-family:Bad Name!;src:url(https://fonts.example.com/b.woff2);}']) {
      const { s } = seams(() => fontReply);
      const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ css: good }, { css: empty }] }, s);
      expect(out).toMatchObject({ ok: false, code: 'font_unavailable', reason: 'no font faces' });
    }
  });

  it('a descriptor named like an object member is read as a plain value', async () => {
    const css = '@font-face{__proto__:x;constructor:y;font-family:Lora;src:url(https://fonts.example.com/a.woff2);}';
    const { s } = seams(() => fontReply);
    const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ css }] }, s);
    expect(out.ok && out.faces[0].family).toBe('Lora');
  });

  it('faces that share one file fetch it once and count once toward the cap', async () => {
    const face = (i: number) =>
      `@font-face{font-family:Lora;font-weight:${100 + i};unicode-range:U+${(i + 1).toString(16)};src:url(https://fonts.example.com/same.woff2);}`;
    const css = Array.from({ length: 200 }, (_, i) => face(i)).join('');
    const { s, calls } = seams(() => fontReply);
    const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ css }] }, s);
    expect(calls).toHaveLength(1);
    expect(out.ok && out.faces).toHaveLength(200);
    expect(out.ok && out.faces[199].weight).toBe('299');
  });

  it('more than the cap of different files still stops the run', async () => {
    const css = Array.from({ length: 129 }, (_, i) => `@font-face{font-family:Lora;src:url(https://fonts.example.com/f${i}.woff2);}`).join('');
    const { s } = seams(() => fontReply);
    expect(await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ css }] }, s)).toMatchObject({ ok: false, reason: 'too many font faces' });
  });

  it('prepared faces carry a data address and the proven bytes', async () => {
    const { s } = seams((url) => (url === defaults.stylesheetUrl ? { type: 'text/css', bytes: new TextEncoder().encode('@font-face{font-family:Lora;src:url(lora.woff2);}') } : fontReply));
    const out = await prepareFonts({ fontHosts: defaults.fontHosts, sheets: [{ url: defaults.stylesheetUrl }] }, s);
    expect(out.ok && out.faces[0].dataUrl).toBe('data:font/woff2;base64,d09GMg==');
  });
});
