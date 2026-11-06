import { describe, it, expect } from 'vitest';
import { sanitizeImage } from '../src/svg-image/sanitize';
import { IMAGE_MAX_BYTES, IMAGE_MAX_DEPTH, IMAGE_MAX_NODES, IMAGE_MAX_TEXT_CHARS } from '../src/contracts/svg-image';

const wrap = (inner: string, attrs = 'viewBox="0 0 100 50"') => `<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${inner}</svg>`;

const FORBIDDEN = ['script', 'onload', 'onerror', 'onclick', 'javascript:', 'foreignobject', 'href', 'http://evil', '<style', '<use', '<image', '<animate', '<set', '<a ', '@import', 'expression('];

describe('sanitizeImage: hostile input', () => {
  const HOSTILE: Array<[string, string]> = [
    ['script element', wrap('<script>alert(1)</script><path d="M0 0L5 5"/>')],
    ['event attribute', wrap('<path d="M0 0L5 5" onclick="alert(1)" ONMOUSEOVER="alert(2)"/>')],
    ['event attribute on root', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><path d="M0 0L5 5"/></svg>'],
    ['javascript href', wrap('<a href="javascript:alert(1)"><path d="M0 0L5 5"/></a><path d="M1 1L2 2"/>')],
    ['xlink href', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><use xlink:href="http://evil/x.svg#a"/><path d="M1 1L2 2"/></svg>'],
    ['foreignObject', wrap('<foreignObject><img src=x onerror=alert(1)></foreignObject><path d="M0 0L5 5"/>')],
    ['style element and attribute', wrap('<style>@import url(http://evil/x.css)</style><path d="M0 0L5 5" style="fill:url(http://evil/x)"/>')],
    ['external url paint', wrap('<path d="M0 0L5 5" fill="url(http://evil/x#g)"/>')],
    ['javascript paint', wrap('<path d="M0 0L5 5" fill="javascript:alert(1)"/>')],
    ['image element', wrap('<image href="http://evil/y.png"/><path d="M0 0L5 5"/>')],
    ['animate and set', wrap('<path d="M0 0L5 5"><set attributeName="onclick" to="alert(1)"/><animate attributeName="href" to="javascript:alert(1)"/></path>')],
    ['css escape in a paint', wrap('<path d="M0 0L5 5" fill="\\75rl(http://evil)"/>')],
    ['comment inside a paint', wrap('<path d="M0 0L5 5" fill="u/**/rl(#a)"/>')],
    ['expression in a value', wrap('<path d="M0 0L5 5" stroke="expression(alert(1))"/>')],
    ['namespaced element', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:h="http://www.w3.org/1999/xhtml" viewBox="0 0 10 10"><h:script>alert(1)</h:script><path d="M0 0L5 5"/></svg>'],
    ['mixed case tags in the html fallback', '<svg viewBox="0 0 10 10"><SCRIPT>alert(1)</SCRIPT><ScRiPt>alert(2)</ScRiPt><path d="M0 0L5 5" OnClick="x"></svg>'],
    ['unclosed tags (html fallback)', '<svg viewBox="0 0 10 10"><g><script>alert(1)</script><path d="M0 0L5 5" onerror=alert(1)'],
    ['html fallback with an img', '<svg viewBox="0 0 10 10"><path d="M0 0L5 5"/><img src=x onerror=alert(1)>'],
    ['data url in a paint', wrap('<path d="M0 0L5 5" fill="url(data:image/svg+xml,x)"/>')],
    ['pattern and filter', wrap('<pattern id="p"><path d="M0 0"/></pattern><filter id="f"/><path d="M0 0L5 5" filter="url(#f)"/>')],
    ['text with markup', wrap('<text x="1" y="2">a<script>alert(1)</script>b</text>')],
  ];

  it.each(HOSTILE)('removes everything active: %s', (_name, input) => {
    const out = sanitizeImage(input);
    const m = out.markup.toLowerCase();
    for (const bad of FORBIDDEN) expect(m).not.toContain(bad);
    expect(m).not.toMatch(/\son[a-z]+=/);
    expect(m).not.toContain('url(http');
    expect(m).not.toContain('\\');
  });

  it('lists what it dropped', () => {
    const out = sanitizeImage(wrap('<script>x</script><path d="M0 0L5 5" onclick="x" fill="url(http://evil/x)"/>'));
    expect(out.error).toBeUndefined();
    expect(out.stripped).toEqual(expect.arrayContaining(['script', 'path@onclick', 'path@fill']));
  });

  it.each([
    ['DOCTYPE', '<!DOCTYPE svg><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'],
    ['lower-case doctype', '<!doctype svg><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'],
    ['ENTITY (billion laughs)', '<!DOCTYPE svg [<!ENTITY a "aaaa"><!ENTITY b "&a;&a;&a;&a;">]><svg viewBox="0 0 1 1"><text>&b;</text></svg>'],
    ['bare ENTITY', '<svg viewBox="0 0 1 1"><!ENTITY x "y"><path d="M0 0"/></svg>'],
    ['processing instruction', '<?xml-stylesheet href="http://evil/x.css"?><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'],
    ['xml declaration', '<?xml version="1.0"?><svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'],
    ['CDATA', '<svg viewBox="0 0 1 1"><text><![CDATA[<script>]]></text></svg>'],
    ['mixed case CDATA', '<svg viewBox="0 0 1 1"><text><![cdata[x]]></text></svg>'],
  ])('refuses %s before parsing', (_n, input) => {
    const out = sanitizeImage(input);
    expect(out.error).toBe('unsafe_markup');
    expect(out.markup).toBe('');
  });

  it('never parses a refused text', () => {
    const proto = DOMParser.prototype as unknown as { parseFromString: (...a: unknown[]) => unknown };
    const original = proto.parseFromString;
    let calls = 0;
    proto.parseFromString = function (this: unknown, ...a: unknown[]) {
      calls++;
      return original.apply(this, a);
    };
    try {
      sanitizeImage('<!DOCTYPE svg [<!ENTITY a "b">]><svg viewBox="0 0 1 1"/>');
      expect(calls).toBe(0);
    } finally {
      proto.parseFromString = original;
    }
  });

  it('refuses text over the byte cap before any other work', () => {
    const big = wrap(`<path d="M0 0${'L1 1'.repeat(IMAGE_MAX_BYTES)}"/>`);
    const out = sanitizeImage(big);
    expect(out.error).toBe('too_large');
    expect(out.bytes).toBeGreaterThan(IMAGE_MAX_BYTES);
  });

  it('counts UTF-8 bytes, not characters', () => {
    const text = '€'.repeat(Math.floor(IMAGE_MAX_BYTES / 3) + 10);
    expect(text.length).toBeLessThan(IMAGE_MAX_BYTES);
    expect(sanitizeImage(wrap(`<text>${text}</text>`)).error).toBe('too_large');
  });

  it('refuses nesting deeper than the cap', () => {
    const deep = '<g>'.repeat(IMAGE_MAX_DEPTH + 5) + '<path d="M0 0L1 1"/>' + '</g>'.repeat(IMAGE_MAX_DEPTH + 5);
    expect(sanitizeImage(wrap(deep)).error).toBe('too_complex');
  });

  it('refuses more elements than the cap', () => {
    const many = '<g/>'.repeat(IMAGE_MAX_NODES + 1);
    expect(many.length).toBeLessThan(IMAGE_MAX_BYTES);
    expect(sanitizeImage(wrap(many + '<path d="M0 0L1 1"/>')).error).toBe('too_complex');
  });

  it('handles long adversarial values in linear time', () => {
    const evil = [
      wrap(`<path d="M0 0" transform="${'rotate(1) '.repeat(20000)}"/>`),
      wrap(`<path d="M0 0" fill="${'('.repeat(50000)}"/>`),
      wrap(`<path d="M0 0" fill="${'a'.repeat(100000)}"/>`),
      wrap(`<path d="M0 0" transform="translate(${' '.repeat(100000)}1)"/>`),
      wrap(`<path d="${'M 1 1 '.repeat(30000)}"/>`),
      wrap(`<path d="M0 0" fill="var(--${'a'.repeat(100000)})"/>`),
    ];
    for (const e of evil) {
      const t = performance.now();
      sanitizeImage(e);
      expect(performance.now() - t).toBeLessThan(1500);
    }
  });

  it('truncates text content to the cap', () => {
    const out = sanitizeImage(wrap(`<text x="1" y="1">${'a'.repeat(IMAGE_MAX_TEXT_CHARS + 500)}</text>`));
    expect(out.error).toBeUndefined();
    expect(out.markup).toContain('a'.repeat(IMAGE_MAX_TEXT_CHARS));
    expect(out.markup).not.toContain('a'.repeat(IMAGE_MAX_TEXT_CHARS + 1));
  });

  it('escapes text so it can never become markup', () => {
    const out = sanitizeImage(wrap('<text x="1" y="1">&lt;script&gt;alert(1)&lt;/script&gt;</text>'));
    expect(out.markup).toContain('&lt;script&gt;');
    expect(out.markup).not.toContain('<script');
  });

  it('keeps text only inside text, tspan and title', () => {
    const out = sanitizeImage(wrap('loose<g>more<path d="M0 0L1 1"/></g><text x="1" y="2">kept</text>'));
    expect(out.markup).not.toContain('loose');
    expect(out.markup).not.toContain('more');
    expect(out.markup).toContain('>kept<');
  });

  it('refuses a missing, wrong or oversized viewBox', () => {
    expect(sanitizeImage('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>').error).toBe('bad_viewbox');
    expect(sanitizeImage(wrap('<path d="M0 0L1 1"/>', 'viewBox="0 0 0 10"')).error).toBe('bad_viewbox');
    expect(sanitizeImage(wrap('<path d="M0 0L1 1"/>', 'viewBox="0 0 5000 10"')).error).toBe('bad_viewbox');
    expect(sanitizeImage(wrap('<path d="M0 0L1 1"/>', 'viewBox="a b c d"')).error).toBe('bad_viewbox');
  });

  it('refuses non-svg input and a drawing with nothing drawable', () => {
    expect(sanitizeImage('hello').error).toBe('not_svg');
    expect(sanitizeImage('<html><body>x</body></html>').error).toBe('not_svg');
    expect(sanitizeImage(wrap('<script>x</script>')).error).toBe('empty');
    expect(sanitizeImage(wrap('<g/>')).error).toBe('empty');
  });
});

describe('sanitizeImage: file option', () => {
  const body = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M0 0L5 5"/></svg>';
  it('is off by default: a prolog is refused', () => {
    expect(sanitizeImage(`<?xml version="1.0" encoding="UTF-8"?>${body}`).error).toBe('unsafe_markup');
  });
  it('removes a BOM, the xml declaration, comments and a plain DOCTYPE', () => {
    const text = `\uFEFF<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!-- made by a tool -->\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n${body}`;
    const out = sanitizeImage(text, { file: true });
    expect(out.error).toBeUndefined();
    expect(out.markup).toContain('<path');
    expect(out.markup).not.toContain('DOCTYPE');
  });
  it('still refuses a DOCTYPE with an internal subset', () => {
    expect(sanitizeImage(`<!DOCTYPE svg [<!ENTITY a "b">]>${body}`, { file: true }).error).toBe('unsafe_markup');
  });
  it('still refuses a processing instruction after the first declaration', () => {
    expect(sanitizeImage(`<?xml version="1.0"?><?xml-stylesheet href="x"?>${body}`, { file: true }).error).toBe('unsafe_markup');
  });
  it('still refuses an ENTITY or a second DOCTYPE', () => {
    expect(sanitizeImage(`<!DOCTYPE svg><!DOCTYPE svg>${body}`, { file: true }).error).toBe('unsafe_markup');
    expect(sanitizeImage(body.replace('<path', '<!ENTITY a "b"><path'), { file: true }).error).toBe('unsafe_markup');
  });
  it('handles an unterminated prolog in one pass', () => {
    expect(sanitizeImage(`<!-- ${'x'.repeat(100000)}`, { file: true }).error).toBeDefined();
    expect(sanitizeImage(`<?xml ${'x'.repeat(100000)}`, { file: true }).error).toBeDefined();
  });
});

describe('sanitizeImage: what is kept', () => {
  it('keeps shapes, gradients, text, theme variables and internal references', () => {
    const out = sanitizeImage(
      wrap(`<defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="var(--primary-color, #0f0)"/></linearGradient><clipPath id="c1"><rect width="10" height="10"/></clipPath></defs>
<g id="room.1" data-name="Living room" transform="translate(5 5) rotate(10)" clip-path="url(#c1)"><path id="wall" d="M1 1L9 9Z" fill="url(#g1)" stroke="var(--mc-image-main)" stroke-width="2" fill-rule="evenodd"/></g>
<text x="3" y="4" font-family="monospace" font-size="12" text-anchor="middle">Pump</text><title>Plan</title>`),
    );
    expect(out.error).toBeUndefined();
    expect(out.viewBox).toBe('0 0 100 50');
    expect(out.ids).toEqual(expect.arrayContaining(['g1', 'c1', 'room.1', 'wall']));
    expect(out.markup).toContain('fill="url(#g1)"');
    expect(out.markup).toContain('stop-color="var(--primary-color, #0f0)"');
    expect(out.markup).toContain('transform="translate(5 5) rotate(10)"');
    expect(out.markup).toContain('font-family="monospace"');
    expect(out.markup).toContain('>Pump<');
    expect(out.markup).toContain('<linearGradient');
    expect(out.stripped).toEqual([]);
    expect(out.bytes).toBeGreaterThan(0);
  });

  it('drops root width and height and keeps the viewBox', () => {
    const out = sanitizeImage(wrap('<path d="M0 0L1 1"/>', 'viewBox="0 0 40 20" width="4000" height="2000"'));
    expect(out.markup).toContain('viewBox="0 0 40 20"');
    expect(out.markup).not.toMatch(/<svg[^>]*\swidth=/);
  });

  it('turns an unknown font family into sans-serif', () => {
    const out = sanitizeImage(wrap('<text x="1" y="1" font-family="Comic Sans MS, cursive">x</text>'));
    expect(out.markup).toContain('font-family="sans-serif"');
  });

  it('drops a bad id and a repeated id, and keeps colour functions', () => {
    const out = sanitizeImage(wrap('<path id="1bad" d="M0 0L1 1" fill="rgb(1 2 3 / 50%)"/><path id="ok" d="M0 0L1 1"/><path id="ok" d="M2 2L3 3"/>'));
    expect(out.ids).toEqual(['ok']);
    expect(out.markup).not.toContain('1bad');
    expect(out.markup).toContain('rgb(1 2 3 / 50%)');
  });

  it('parses markup without xmlns through the html fallback', () => {
    const out = sanitizeImage('<svg viewBox="0 0 10 10"><linearGradient id="g"><stop offset="0" stop-color="red"/></linearGradient><path d="M0 0L5 5" fill="url(#g)"/></svg>');
    expect(out.error).toBeUndefined();
    expect(out.markup).toContain('<linearGradient id="g">');
  });

  it('is idempotent', () => {
    const once = sanitizeImage(wrap('<g id="a"><path d="M0 0L5 5" fill="#abc"/></g><text x="1" y="2">t &amp; u</text>'));
    const twice = sanitizeImage(once.markup);
    expect(twice.markup).toBe(once.markup);
    expect(twice.stripped).toEqual([]);
  });
});

describe('sanitizeImage: with and without xmlns', () => {
  const NS = ' xmlns="http://www.w3.org/2000/svg"';
  const bare = (text: string): string => text.replace(NS, '');
  const names = (r: { stripped: string[] }): string[] => [...r.stripped].sort();

  const PAIRS: Array<[string, string]> = [
    ['script element', wrap('<script>alert(1)</script><path d="M0 0L5 5"/>')],
    ['script only', wrap('<script>alert(1)</script>')],
    ['script after a shape', wrap('<path d="M0 0L5 5"/><script>alert(1)</script><path d="M1 1L2 2"/>')],
    ['script inside text', wrap('<text x="1" y="2">a<script>alert(1)</script>b</text>')],
    ['event attributes', wrap('<path d="M0 0L5 5" onclick="alert(1)" ONMOUSEOVER="alert(2)"/>')],
    ['event attribute on root', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" onload="alert(1)"><path d="M0 0L5 5"/></svg>'],
    ['javascript href', wrap('<a href="javascript:alert(1)"><path d="M0 0L5 5"/></a><path d="M1 1L2 2"/>')],
    ['foreignObject', wrap('<foreignObject><img src=x onerror=alert(1)></foreignObject><path d="M0 0L5 5"/>')],
    ['style element and attribute', wrap('<style>@import url(http://evil/x.css)</style><path d="M0 0L5 5" style="fill:url(http://evil/x)"/>')],
    ['external url paint', wrap('<path d="M0 0L5 5" fill="url(http://evil/x#g)"/>')],
    ['image element', wrap('<image href="http://evil/y.png"/><path d="M0 0L5 5"/>')],
    ['animate and set', wrap('<path d="M0 0L5 5"><set attributeName="onclick" to="alert(1)"/><animate attributeName="href" to="javascript:alert(1)"/></path>')],
    ['pattern and filter', wrap('<pattern id="p"><path d="M0 0"/></pattern><filter id="f"/><path d="M0 0L5 5" filter="url(#f)"/>')],
    ['unknown element', wrap('<p>x</p><path d="M0 0L5 5"/>')],
    ['nothing drawable', wrap('<g/>')],
    ['namespaced element', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:h="http://www.w3.org/1999/xhtml" viewBox="0 0 10 10"><h:script>alert(1)</h:script><path d="M0 0L5 5"/></svg>'],
    ['xlink href', '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><use xlink:href="http://evil/x.svg#a"/><path d="M1 1L2 2"/></svg>'],
    ['bad viewBox', wrap('<path d="M0 0L5 5"/>', 'viewBox="0 0 0 10"')],
    ['deep nesting', wrap('<g>'.repeat(IMAGE_MAX_DEPTH + 5) + '<path d="M0 0L1 1"/>' + '</g>'.repeat(IMAGE_MAX_DEPTH + 5))],
  ];

  it.each(PAIRS)('gives one result for both parses: %s', (_n, input) => {
    expect(input).toContain(NS);
    const a = sanitizeImage(input);
    const b = sanitizeImage(bare(input));
    expect(b.error).toBe(a.error);
    expect(names(b)).toEqual(names(a));
    expect(b.markup).toBe(a.markup);
    expect(b.viewBox).toBe(a.viewBox);
    expect(b.ids).toEqual(a.ids);
  });

  it('removes a script and names it, with or without xmlns', () => {
    for (const input of [wrap('<script>alert(1)</script><path d="M0 0L5 5"/>'), bare(wrap('<script>alert(1)</script><path d="M0 0L5 5"/>'))]) {
      const out = sanitizeImage(input);
      expect(out.error).toBeUndefined();
      expect(out.stripped).toContain('script');
      expect(out.markup).toContain('<path');
      expect(out.markup.toLowerCase()).not.toContain('script');
    }
  });

  it('is empty only when nothing drawable is left, and still lists the removals', () => {
    for (const input of [wrap('<script>alert(1)</script>'), bare(wrap('<script>alert(1)</script>')), wrap('<style>x</style><foreignObject/>'), bare(wrap('<style>x</style><foreignObject/>'))]) {
      const out = sanitizeImage(input);
      expect(out.error).toBe('empty');
      expect(out.markup).toBe('');
      expect(out.stripped.length).toBeGreaterThan(0);
    }
    expect(sanitizeImage(bare(wrap('<script>x</script>'))).stripped).toEqual(['script']);
  });

  it('names elements the html parser moves out of the drawing, and keeps nothing extra', () => {
    const out = sanitizeImage('<svg viewBox="0 0 10 10"><path d="M0 0L5 5"/><p>x<img src=x onerror=alert(1)>');
    expect(out.error).toBeUndefined();
    expect(out.stripped).toEqual(expect.arrayContaining(['p']));
    expect(out.markup.toLowerCase()).not.toMatch(/<p[ >]|<img|onerror/);
  });

  it('runs every malformed hostile fixture without active content and with a named script', () => {
    const malformed = [
      '<svg viewBox="0 0 10 10"><SCRIPT>alert(1)</SCRIPT><ScRiPt>alert(2)</ScRiPt><path d="M0 0L5 5" OnClick="x"></svg>',
      '<svg viewBox="0 0 10 10"><g><script>alert(1)</script><path d="M0 0L5 5" onerror=alert(1)',
      '<svg viewBox="0 0 10 10"><path d="M0 0L5 5"/><img src=x onerror=alert(1)>',
    ];
    for (const input of malformed) {
      const out = sanitizeImage(input);
      expect(out.markup.toLowerCase()).not.toMatch(/script|onerror|onclick|<img/);
      expect(out.error === undefined || out.error === 'empty').toBe(true);
      if (/script/i.test(input)) expect(out.stripped.length).toBeGreaterThan(0);
    }
  });
});

describe('sanitizeImage: var() fallbacks are hex only', () => {
  const paint = (v: string, ns = true) => {
    const inner = `<path d="M0 0L5 5" fill="${v}"/><path d="M1 1L9 9" stroke="#000"/>`;
    return ns ? wrap(inner) : `<svg viewBox="0 0 10 10">${inner}</svg>`;
  };
  it.each([true, false])('keeps a hex fallback (xmlns %s)', (ns) => {
    for (const v of ['var(--x, #f00)', 'var(--x,#ff0000)', 'var(--x, #ff000080)', 'var(--x)']) {
      const out = sanitizeImage(paint(v, ns));
      expect(out.markup).toContain(`fill="${v}"`);
      expect(out.stripped).toEqual([]);
    }
  });
  it.each([true, false])('drops and lists a keyword, function or nested fallback (xmlns %s)', (ns) => {
    const bad = ['var(--x, red)', 'var(--x, rgb(1,2,3))', 'var(--x, var(--y))', 'var(--x, #ff)', 'var(--x, #fffffffff)', 'var(--x, #f00 red)', 'var(--x, url(#a))', 'var(--x, #f00', 'var(--x, red) red', 'VAR(--x, red)', 'var(--x,)', 'var(--x, transparent)'];
    for (const v of bad) {
      const out = sanitizeImage(paint(v, ns));
      expect(out.markup, v).not.toMatch(/fill=/);
      expect(out.stripped, v).toContain('path@fill');
    }
  });
});

describe('sanitizeImage: the root namespace', () => {
  const body = '<path d="M0 0L5 5"/><g><path d="M1 1L2 2"/></g>';
  it('writes xmlns once, lower-case, on the root only, and keeps it stable', () => {
    for (const input of [wrap(body), `<svg viewBox="0 0 10 10">${body}</svg>`]) {
      const out = sanitizeImage(input);
      expect(out.markup.match(/xmlns/g)).toHaveLength(1);
      expect(out.markup.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
      expect(sanitizeImage(out.markup).markup).toBe(out.markup);
    }
  });
  it('removes xmlns from a child, a prefixed declaration and another value', () => {
    const out = sanitizeImage('<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://evil/x" viewBox="0 0 10 10"><g xmlns="http://www.w3.org/2000/svg"><path d="M0 0L5 5" XMLNS="x"/></g></svg>');
    expect(out.markup.match(/xmlns/gi)).toHaveLength(1);
    expect(out.markup).not.toContain('xmlns:');
    expect(out.markup).not.toContain('evil');
    const other = sanitizeImage('<svg xmlns="http://evil/ns" viewBox="0 0 10 10"><path d="M0 0L5 5"/></svg>');
    expect(other.markup).not.toContain('evil');
  });
});

describe('sanitizeImage: names listed as removed', () => {
  it('cuts a very long element or attribute name', () => {
    const long = 'a'.repeat(5000);
    const out = sanitizeImage(wrap(`<${long}/><path d="M0 0L5 5" ${long}="1"/>`));
    expect(out.stripped.length).toBeGreaterThan(0);
    for (const name of out.stripped) for (const part of name.split('@')) expect(part.length).toBeLessThanOrEqual(40);
  });
  it('cuts a long name the html parser moved out', () => {
    const long = 'b'.repeat(5000);
    const out = sanitizeImage(`<svg viewBox="0 0 10 10"><path d="M0 0L5 5"/><p>x<${long}>`);
    for (const name of out.stripped) expect(name.length).toBeLessThanOrEqual(40);
  });
});
