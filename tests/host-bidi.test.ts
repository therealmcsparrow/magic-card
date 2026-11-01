import { describe, it, expect } from 'vitest';
import { hostsOf } from '../src/transfer/kinds/theme';
import { hostsIn } from '../src/theme-editor/outside';

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
    expect(fn('url(//bücher.example/a.png)')).toEqual(['bücher.example']);
    expect(fn('url(http://[::1]/a.png)')).toEqual(['[::1]']);
  });
});
