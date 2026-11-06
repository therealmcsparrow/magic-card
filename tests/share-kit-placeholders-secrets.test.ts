import { describe, expect, it } from 'vitest';
import type { TransferItem } from '../src/contracts/preset-transfer';
import { toPlaceholders } from '../src/share-kit/placeholders';

const item = (data: unknown): TransferItem => ({ id: 'a', name: 'A', data }) as never;
const run = (data: unknown) => toPlaceholders('card', [item(data)]);
const text = (v: unknown): string => JSON.stringify(v);

describe('scan cost', () => {
  it('is linear on a 1 MB lower-case run followed by a dot', () => {
    const t0 = performance.now();
    run({ text: 'a'.repeat(1_000_000) + '!.' });
    run({ text: 'a'.repeat(1_000_000) + '.' });
    expect(performance.now() - t0).toBeLessThan(1500);
  });

  it('still finds ids after a dotted prefix and ignores ids glued to a word', () => {
    const out = run({ text: 'states.light.kitchen and xlight.lamp' });
    expect(text(out.items)).not.toContain('light.kitchen');
    expect(text(out.items)).toContain('xlight.lamp');
  });
});

describe('secrets in URLs', () => {
  it('drops the values of token, access_token, signature, authSig and api_key', () => {
    const url = '/local/a.png?token=t1&access_token=t2&signature=t3&authSig=t4&api_key=t5&keep=1';
    const s = text(run({ image: url }).items);
    for (const v of ['t1', 't2', 't3', 't4', 't5']) expect(s).not.toContain(v);
    expect(s).toContain('keep=1');
    expect(s).toContain('/local/a.png');
  });

  it('replaces the camera entity and drops the token of a camera_proxy URL', () => {
    const out = run({ picture: '/api/camera_proxy/camera.front_door?token=abc123', stream: '/api/camera_proxy_stream/camera.yard?token=zz' });
    const s = text(out.items);
    for (const v of ['front_door', 'yard', 'abc123', 'zz']) expect(s).not.toContain(v);
    expect(s).toContain('/api/camera_proxy/camera.mc_placeholder_');
    expect(out.placeholders.map((p) => p.domain)).toEqual(['camera', 'camera']);
  });

  it('removes the host, port and credentials of an absolute URL and lists the host', () => {
    const out = run({ image: 'https://bob:pw@me.duckdns.org:8123/local/a.png?token=x', css: 'background: url(http://10.0.0.5/x.png)' });
    const s = text(out.items);
    for (const v of ['duckdns', 'bob', 'pw', '8123', '10.0.0.5', 'token=x']) expect(s).not.toContain(v);
    expect(s).toContain('/local/a.png');
    expect(out.removedHosts).toEqual(['me.duckdns.org:8123', '10.0.0.5']);
  });

  it('keeps XML namespaces in inline SVG', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    expect(text(run({ svg }).items)).toContain('http://www.w3.org/2000/svg');
  });

  it('scrubs secrets in keys and arrays too', () => {
    const s = text(run({ 'https://h.example/x?token=k1': ['/api/x?signature=s1'] }).items);
    expect(s).not.toMatch(/k1|s1|h\.example/);
  });
});

describe('object keys', () => {
  it('replaces entity ids used as keys, matching the same id in values', () => {
    const out = run({ colours: { 'light.kitchen': 'red' }, entity: 'light.kitchen' });
    const s = text(out.items);
    expect(s).not.toContain('light.kitchen');
    expect(out.placeholders).toHaveLength(1);
    expect(s).toContain('"light.mc_placeholder_1":"red"');
  });

  it('keeps colliding keys apart, in insertion order', () => {
    const data = { 'light.mc_placeholder_1': 'own', 'light.kitchen': 'a', 'light.hall': 'b' };
    const first = run(data).items[0].data as Record<string, string>;
    const second = run(data).items[0].data as Record<string, string>;
    expect(Object.keys(first)).toHaveLength(3);
    expect(Object.values(first).sort()).toEqual(['a', 'b', 'own']);
    expect(Object.keys(second)).toEqual(Object.keys(first));
  });
});
