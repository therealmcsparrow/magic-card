import { describe, it, expect } from 'vitest';
import { externalHosts } from '../src/contracts/preset-transfer';
import { hostsOf, readTheme } from '../src/transfer/kinds/theme';
import { hostsIn, outsideOf } from '../src/theme-editor/outside';

const FAKE = 'url(https://a\u2069\u202eb.example/x.png) url(https://real.example/y.png)';
const CONTROLS = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/;

describe('host names from an imported theme', () => {
  it.each([
    ['hostsOf', hostsOf],
    ['hostsIn', hostsIn],
  ])('%s keeps bidi control characters out of the host list', (_n, fn) => {
    const hosts = fn(FAKE);
    expect(hosts.join(' ')).not.toMatch(CONTROLS);
    expect(hosts).toContain('real.example');
  });
  it.each([
    ['hostsOf', hostsOf],
    ['hostsIn', hostsIn],
  ])('%s still reads ordinary, internationalised and bracketed hosts', (_n, fn) => {
    expect(fn('url(https://cdn.example.com/a.png)')).toEqual(['cdn.example.com']);
    expect(fn('url(//bücher.example/a.png)')).toEqual(['xn--bcher-kva.example']);
    expect(fn('url(http://[::1]/a.png)')).toEqual(['[::1]']);
  });
});

describe('hosts as the browser resolves them', () => {
  const cases: Array<[string, string, string[], boolean]> = [
    ['ideographic full stop', 'url(https://evil.example\u3002attacker.com/x)', ['evil.example.attacker.com'], false],
    ['plus sign in host', 'url(//a+x.evil.com/x)', ['a+x.evil.com'], false],
    ['soft hyphen in host', 'url(https://ev\u00ADil.com/x)', ['evil.com'], false],
    ['leading soft hyphen', 'url(//\u00ADevil.com/x)', ['evil.com'], false],
    ['exclamation mark', 'url(https://!x.evil.com/x)', ['!x.evil.com'], false],
    ['plain host', 'url(https://cdn.example.com/a.png)', ['cdn.example.com'], false],
    ['internationalised host', 'url(//bücher.example/a.png)', ['xn--bcher-kva.example'], false],
    ['relative url', 'url(/local/a.png)', [], false],
  ];
  it.each(cases)('%s', (_n, value, hosts, unknown) => {
    expect(externalHosts(value)).toEqual({ hosts, unknown });
    expect(hostsOf(value)).toEqual(hosts);
    expect(hostsIn(value)).toEqual(hosts);
  });
  it.each(['\u202e', '\u2066', '\u2067', '\u2068', '\u2069'])('a bidi control %# in a host is never listed, not even in part', (c) => {
    for (const value of [`url(https://a${c}b.example/x)`, `url(//a${c}b.example/x)`]) {
      const r = externalHosts(value);
      expect(r.hosts.join(' ')).not.toMatch(CONTROLS);
      expect(r.hosts.join(' ')).not.toMatch(/example/);
      expect(r.unknown).toBe(true);
    }
  });
  it('keeps the warning when only part of the value can be named', () => {
    const doc = { a: 'url(https://real.example/a.png) url(https://x\u202ey.example/b.png)' };
    const o = outsideOf(doc as never);
    expect(o).toEqual({ any: true, unknown: true, hosts: ['real.example'] });
    const lone = outsideOf({ a: 'url(//\u2067evil.com/x)' } as never);
    expect(lone.any).toBe(true);
    expect(lone.unknown).toBe(true);
  });
  it('an address that cannot be read gives the generic warning in the transfer note', () => {
    const r = readTheme(0, { a: 'url(https://a\u202eb.example/x)' });
    const n = (r.notes as Array<{ code: string; hosts?: string[] }>).find((x) => x.code === 'external_ref');
    expect(n).toBeDefined();
    expect(n?.hosts ?? []).toEqual([]);
  });
});
