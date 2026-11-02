import { describe, it, expect } from 'vitest';
import { contactsOtherHost, externalHosts } from '../src/contracts/preset-transfer';
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

describe('payloads that fooled the host scan', () => {
  const B = String.fromCharCode(92);
  const T = 'trusted.example';
  const E = 'evil.example';
  const decoy = `url(https://${T}/y)`;
  const cases: Array<[string, string, string[], boolean]> = [
    ['tab inside the host', `url("https://${T}\t.${E}/x")`, [`${T}.${E}`], false],
    ['hex line feed inside the host', `url("https://${T}${B}A .${E}/x")`, [], true],
    ['hex tab inside the host, unquoted', `url(https://${T}${B}9 .${E}/x)`, [], true],
    ['line continuation inside the host', `url("https://${T}${B}\n.${E}/x")`, [], true],
    ['space before userinfo @', `url("https://${T} x@${E}/x")`, [E], false],
    ['comma before userinfo @', `url("https://${T},x@${E}/x")`, [E], false],
    ['semicolon before userinfo @', `url("https://${T};x@${E}/x")`, [E], false],
    ['apostrophe before userinfo @', `url("https://${T}'x@${E}/x")`, [E], false],
    ['bracket before userinfo @', `url("https://${T})x@${E}/x")`, [E], true],
    ['escaped bracket before userinfo @', `url(https://${T}${B})x@${E}/x)`, [], true],
    ['no-break space before userinfo @', `url("https://${T}\u00A0x@${E}/x")`, [E], false],
    ['image-set with a comma before @', `image-set("https://${T},x@${E}/x" 1x)`, [E], false],
    ['tab inside the slashes beside a decoy', `url("/\t/${E}/x"),${decoy}`, [E, T], false],
    ['tab inside the scheme beside a decoy', `url("ht\ttps://${E}/x"),${decoy}`, [E, T], false],
    ['hex line feed inside the scheme beside a decoy', `url("ht${B}A tps://${E}/x"),${decoy}`, [], true],
    ['hex control before // beside a decoy', `url("${B}1 //${E}/x"),${decoy}`, [], true],
    ['raw control before // beside a decoy', `url("\x01//${E}/x"),${decoy}`, [E, T], false],
    ['tab after the colon beside a decoy', `url("https:\t//${E}/x"),${decoy}`, [E, T], false],
    ['backslashes before the host beside a decoy', `url("/${B}${B}${E}/x"),${decoy}`, [], true],
    ['backslashes after the scheme', `url("https:${B}${B}${B}${B}${E}/x")`, [], true],
    ['backslash before @', `url("https://${T}${B}${B}@${E}/x")`, [], true],
    ['CSS-escaped scheme', `url(${B}68ttps://${E}/x)`, [], true],
    ['comment after url(', `url(/*c*/"https://${E}/x")`, [], true],
    ['comment before an image-set string', `image-set(/*c*/"//${E}/x" 1x)`, [], true],
    ['full-width dot', `url(https://${T}\uFF0E${E}/x)`, [`${T}.${E}`], false],
    ['ideographic full stop', `url(https://${T}\u3002${E}/x)`, [`${T}.${E}`], false],
    ['percent-encoded dot', `url(https://${T}%2e${E}/x)`, [`${T}.${E}`], false],
    ['full-width slash', `url("https://${T}\uFF0F.${E}/x")`, [], true],
    ['plain userinfo', `url(https://${T}@${E}/x)`, [E], false],
    ['scheme without slashes', `url(https:${E}/x)`, [E], false],
    ['upper-case scheme', `url(HTTPS://${E}/x)`, [E], false],
    ['image-set string', `image-set("https://${E}/x" 1x)`, [E], false],
    ['prefixed image-set url()', `-webkit-image-set(url(https://${E}/x) 1x)`, [E], false],
    ['@import string', `@import "https://${E}/x"`, [E], false],
    ['other scheme', `url(gopher://${E}/x)`, [], true],
    ['bare address outside any argument', `https://${E}/x`, [], true],
    ['named and unreadable together', `url(https://${T}/y) url("ht${B}tps://${E}/x")`, [], true],
    ['named and unreadable host together', `url(https://${T}/y) url("https://a\u202eb.example/x")`, [T], true],
    ['data: png contacts nothing', `url("data:image/png;base64,AAAA")`, [], false],
    ['data: svg may load files', `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>")`, [], true],
    ['newline inside a string', `@import url(https://${T}/a);#t{"x\n;background-image:url(https://${E}/x);"}`, [T], true],
    ['carriage return inside a string', `"a\r{}@import '//${E}/x';"`, [], true],
    ['form feed inside a string', `"a\f{}@import '//${E}/x';"`, [], true],
    ['broken url() swallowing the next one', `@import url(https://${T}/a);#t{url(x'y);background-image:url(https://${E}/x);url(z'w)}`, [T], true],
    ['bracket inside a bare argument', `url(a'b){}@import "//${E}/x";url(c'd){}`, [], true],
    ['data: css import', `@import url("data:text/css,@import 'https://${E}/x';");@import url(https://${T}/a);`, [T], true],
    ['data: css import, percent-encoded', `@import url("data:text/css,%40import%20%27https%3A%2F%2F${E}%2Fx%27%3B");`, [], true],
    ['data: css import, base64', `@import url("data:text/css;base64,QGltcG9ydCAnaHR0cHM6Ly9ldmlsLmV4YW1wbGUveCc7");`, [], true],
    ['data: css import, upper case', `@import url("DATA:text/css,@import 'https://${E}/x';");`, [], true],
  ];
  it.each(cases)('%s', (_n, value, hosts, unknown) => {
    const r = externalHosts(value);
    expect([...r.hosts].sort()).toEqual([...hosts].sort());
    expect(r.unknown).toBe(unknown);
  });
  it('never names the trusted host for a payload that goes elsewhere', () => {
    for (const [n, value] of cases) {
      if (/decoy|named and|data:|newline inside|swallowing/.test(n)) continue;
      expect(externalHosts(value).hosts, n).not.toContain(T);
    }
  });
});

describe('card-mod theme values get the generic warning', () => {
  const T = 'trusted.example';
  const E = 'evil.example';
  const rows: Array<[string, string, string]> = [
    ['J3 template that adds a second host', 'card-mod-root', `@import url(https://${T}/a);{{ '@import "https://${E}/x";' }}`],
    ['J4 template that decodes an import', 'card-mod-root', "{{ 'QGltcG9ydCAiaHR0cHM6Ly9ldmlsLmV4YW1wbGUveCI7' | base64_decode }}"],
    ['J7 yaml value', 'card-mod-root-yaml', `ha-card:\n  background: "{{ 'url(https://${E}/x)' }}"`],
    ['harmless plain value', 'card-mod-theme', 'ha-card { color: red; }'],
    ['mixed-case key', 'Card-Mod-Card', 'ha-card { color: red; }'],
  ];
  it.each(rows)('%s: import note is generic with no hosts', (_n, key, value) => {
    const r = readTheme(0, { 'primary-color': '#fff', [key]: value });
    expect(r.ok).toBe(true);
    const n = r.notes.filter((x) => x.code === 'external_ref');
    expect(n).toHaveLength(1);
    expect(n[0].unknown).toBe(true);
    expect(n[0].hosts ?? []).toEqual([]);
  });
  it.each(rows)('%s: theme editor warns without naming hosts', (_n, key, value) => {
    for (const doc of [{ [key]: value }, { modes: { light: { [key]: value }, dark: {} } }]) {
      const o = outsideOf(doc as never);
      expect(o).toEqual({ any: true, unknown: true, hosts: [] });
    }
  });
  it('a plain value control still names its hosts', () => {
    const v = `url(https://${T}/a.png) url(https://${E}/b.png)`;
    const o = outsideOf({ 'ha-card-background': v } as never);
    expect(o.any).toBe(true);
    expect(o.unknown).toBe(false);
    expect([...o.hosts].sort()).toEqual([E, T]);
    const n = readTheme(0, { 'primary-color': '#fff', 'ha-card-background': v }).notes.find((x) => x.code === 'external_ref');
    expect([...(n?.hosts ?? [])].sort()).toEqual([E, T]);
    expect(n?.unknown).toBeFalsy();
  });
  it('contactsOtherHost is true for card-mod keys only by key', () => {
    expect(contactsOtherHost('ha-card { color: red; }', 'card-mod-card-yaml')).toBe(true);
    expect(contactsOtherHost('ha-card { color: red; }', 'primary-color')).toBe(false);
    expect(contactsOtherHost('ha-card { color: red; }')).toBe(false);
  });
});
