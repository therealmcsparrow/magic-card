import { describe, it, expect, afterEach } from 'vitest';
import '../src/editor/components/color-picker';

/*
 * A format switch in the colour popup (src/editor/components/color-picker.ts): HEXA | RGBA | HSLA | OKLCH.
 * The text input shows and accepts the colour in the chosen format; Save writes that format. The switch is a group of
 * four buttons labelled exactly like that; the chosen one carries aria-checked="true" or aria-pressed="true".
 * The text field is the first input of `.mc-input-row`.
 */
type El = HTMLElement & Record<string, unknown> & { updateComplete: Promise<unknown> };
type Format = 'HEXA' | 'RGBA' | 'HSLA' | 'OKLCH';
const FORMATS: Format[] = ['HEXA', 'RGBA', 'HSLA', 'OKLCH'];

afterEach(() => {
  document.body.innerHTML = '';
});

async function open(value: string): Promise<{ el: El; events: string[] }> {
  const el = document.createElement('mc-color-picker') as El;
  el.value = value;
  el.label = 'Fill';
  document.body.appendChild(el);
  await el.updateComplete;
  const events: string[] = [];
  el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail.value));
  el.shadowRoot!.querySelector<HTMLButtonElement>('button.swatch')!.click();
  await el.updateComplete;
  return { el, events };
}
const options = (el: El) =>
  [...el.shadowRoot!.querySelectorAll<HTMLElement>('button, [role="radio"]')].filter((b) => FORMATS.includes(b.textContent!.trim() as Format));
const option = (el: El, f: Format) => options(el).find((b) => b.textContent!.trim() === f)!;
const isOn = (b: HTMLElement) => b.getAttribute('aria-checked') === 'true' || b.getAttribute('aria-pressed') === 'true';
const active = (el: El) => options(el).filter(isOn).map((b) => b.textContent!.trim());
const field = (el: El) => el.shadowRoot!.querySelector<HTMLInputElement>('.mc-input-row input')!;
const settle = async (el: El) => {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};
async function choose(el: El, f: Format): Promise<void> {
  option(el, f).click();
  await settle(el);
}
async function type(el: El, text: string): Promise<void> {
  const input = field(el);
  input.value = text;
  input.dispatchEvent(new Event('input'));
  await settle(el);
}
async function save(el: El): Promise<void> {
  el.shadowRoot!.querySelector<HTMLButtonElement>('.mc-picker-footer .btn:not(.btn-secondary)')!.click();
  await settle(el);
}

// ── an independent reference for the colour maths (sRGB, 0..255 and alpha) ──
type RGBA = [number, number, number, number];
const num = String.raw`(\d+(?:\.\d+)?|\.\d+)`;
function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return lin.map((c) => 255 * Math.min(1, Math.max(0, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))) as [number, number, number];
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  return [0, 8, 4].map((n) => 255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))) as [number, number, number];
}
/** The colour of a string written by the picker (any of the four canonical forms). */
function read(text: string): RGBA {
  let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(text);
  if (m) return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), m[2] ? parseInt(m[2], 16) / 255 : 1];
  m = new RegExp(`^rgba?\\(${num}, ${num}, ${num}(?:, ${num})?\\)$`).exec(text);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  m = new RegExp(`^hsla?\\(${num}, ${num}%, ${num}%(?:, ${num})?\\)$`).exec(text);
  if (m) return [...hslToRgb(+m[1], +m[2] / 100, +m[3] / 100), m[4] === undefined ? 1 : +m[4]] as RGBA;
  m = new RegExp(`^oklch\\(${num}% ${num} ${num}(?: / ${num})?\\)$`).exec(text);
  if (m) return [...oklchToRgb(+m[1] / 100, +m[2], +m[3]), m[4] === undefined ? 1 : +m[4]] as RGBA;
  throw new Error(`not a colour the picker writes: ${text}`);
}
const near = (got: string, want: RGBA, tol = 1.5) => {
  const g = read(got);
  for (let i = 0; i < 3; i++) expect(Math.abs(g[i] - want[i]), `${got} channel ${i}`).toBeLessThanOrEqual(tol);
  expect(Math.abs(g[3] - want[3]), `${got} alpha`).toBeLessThanOrEqual(0.01);
};

describe('colour popup: the format switch', () => {
  it('offers HEXA, RGBA, HSLA and OKLCH, exactly one chosen', async () => {
    const { el } = await open('#336699');
    expect(options(el).map((b) => b.textContent!.trim())).toEqual(FORMATS);
    expect(active(el)).toHaveLength(1);
  });
  it('the buttons are real buttons with type=button (they must not submit)', async () => {
    const { el } = await open('#336699');
    for (const b of options(el)) expect(b.tagName === 'BUTTON' ? (b as HTMLButtonElement).type : 'button').toBe('button');
  });
});

describe('colour popup: it starts on the format of the current value', () => {
  const CASES: Array<[string, Format]> = [
    ['#336699', 'HEXA'],
    ['#336699cc', 'HEXA'],
    ['#369', 'HEXA'],
    ['rgb(51, 102, 153)', 'RGBA'],
    ['rgba(51, 102, 153, 0.8)', 'RGBA'],
    ['rgb(51 102 153 / 0.8)', 'RGBA'],
    ['hsl(210, 50%, 40%)', 'HSLA'],
    ['hsla(210, 50%, 40%, 0.8)', 'HSLA'],
    ['hsl(210 50% 40% / 80%)', 'HSLA'],
    ['oklch(50% 0.1 250)', 'OKLCH'],
    ['oklch(0.5 0.1 250 / 0.5)', 'OKLCH'],
    ['var(--primary-color)', 'HEXA'],
    ['red', 'HEXA'],
  ];
  for (const [value, format] of CASES) {
    it(`${value} starts on ${format}`, async () => {
      const { el } = await open(value);
      expect(active(el)).toEqual([format]);
    });
  }
  it('a var() value stays as written in the field', async () => {
    const { el } = await open('var(--primary-color)');
    expect(field(el).value).toBe('var(--primary-color)');
  });
  it('a colour name stays as written in the field', async () => {
    const { el } = await open('red');
    expect(field(el).value).toBe('red');
  });
});

describe('colour popup: the field shows the colour in the chosen format', () => {
  const WANT: RGBA = [51, 102, 153, 0.8];
  it('HEXA is #rrggbbaa', async () => {
    const { el } = await open('rgba(51, 102, 153, 0.8)');
    await choose(el, 'HEXA');
    expect(field(el).value.toLowerCase()).toBe('#336699cc');
  });
  it('RGBA is rgba(r, g, b, a)', async () => {
    const { el } = await open('#336699cc');
    await choose(el, 'RGBA');
    expect(field(el).value).toMatch(/^rgba\(51, 102, 153, 0\.8\d*\)$/);
  });
  it('HSLA is hsla(h, s%, l%, a)', async () => {
    const { el } = await open('#336699cc');
    await choose(el, 'HSLA');
    expect(field(el).value).toMatch(/^hsla\(210(\.\d+)?, 50(\.\d+)?%, 40(\.\d+)?%, 0\.8\d*\)$/);
  });
  it('OKLCH is oklch(L% C H / a) and is the same colour', async () => {
    const { el } = await open('#336699cc');
    await choose(el, 'OKLCH');
    expect(field(el).value).toMatch(/^oklch\(\d+(\.\d+)?% \d*\.?\d+ \d+(\.\d+)? \/ 0\.8\d*\)$/);
    near(field(el).value, WANT, 2);
  });
  it('an opaque colour needs no alpha part in any format', async () => {
    const { el } = await open('#336699');
    await choose(el, 'HEXA');
    expect(field(el).value.toLowerCase()).toMatch(/^#336699(ff)?$/);
    await choose(el, 'RGBA');
    expect(field(el).value).toMatch(/^rgba?\(51, 102, 153(, 1)?\)$/);
    await choose(el, 'HSLA');
    expect(field(el).value).toMatch(/^hsla?\(210(\.\d+)?, 50(\.\d+)?%, 40(\.\d+)?%(, 1)?\)$/);
    await choose(el, 'OKLCH');
    expect(field(el).value).toMatch(/^oklch\([^/]+( \/ 1)?\)$/);
  });
});

describe('colour popup: switching converts and does not change the colour', () => {
  it('goes round all four formats and back within rounding, writing nothing until Save', async () => {
    const { el, events } = await open('#c0392bb3');
    const want: RGBA = [0xc0, 0x39, 0x2b, 0xb3 / 255];
    for (const f of [...FORMATS, 'HEXA', 'OKLCH', 'RGBA', 'HSLA', 'HEXA'] as Format[]) {
      await choose(el, f);
      expect(active(el)).toEqual([f]);
      near(field(el).value, want, 2);
    }
    expect(events).toEqual([]);
  });
  it('a var() value is not converted by a switch', async () => {
    const { el } = await open('var(--primary-color)');
    await choose(el, 'RGBA');
    expect(field(el).value).toBe('var(--primary-color)');
  });
});

describe('colour popup: Save writes the chosen format', () => {
  const OPEN = '#336699cc';
  it('HEXA writes #rrggbbaa', async () => {
    const { el, events } = await open(OPEN);
    await choose(el, 'HEXA');
    await save(el);
    expect(events.map((e) => e.toLowerCase())).toEqual(['#336699cc']);
  });
  it('RGBA writes rgba(r, g, b, a)', async () => {
    const { el, events } = await open(OPEN);
    await choose(el, 'RGBA');
    await save(el);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatch(/^rgba\(51, 102, 153, 0\.8\d*\)$/);
  });
  it('HSLA writes hsla(h, s%, l%, a)', async () => {
    const { el, events } = await open(OPEN);
    await choose(el, 'HSLA');
    await save(el);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatch(/^hsla\(210(\.\d+)?, 50(\.\d+)?%, 40(\.\d+)?%, 0\.8\d*\)$/);
  });
  it('OKLCH writes oklch(L% C H / a)', async () => {
    const { el, events } = await open(OPEN);
    await choose(el, 'OKLCH');
    await save(el);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatch(/^oklch\(\d+(\.\d+)?% \d*\.?\d+ \d+(\.\d+)? \/ 0\.8\d*\)$/);
    near(events[0], [51, 102, 153, 0.8], 2);
  });
  it('the format also applies to a colour typed in another syntax', async () => {
    const { el, events } = await open('#000000');
    await choose(el, 'RGBA');
    await type(el, 'hsl(120 100% 50% / 50%)');
    await save(el);
    expect(events).toHaveLength(1);
    near(events[0], [0, 255, 0, 0.5]);
    expect(events[0]).toMatch(/^rgba\(/);
  });
});

describe('colour popup: the field accepts every syntax', () => {
  const INPUTS: Array<[string, RGBA]> = [
    ['#ff0000', [255, 0, 0, 1]],
    ['#f00', [255, 0, 0, 1]],
    ['#ff000080', [255, 0, 0, 128 / 255]],
    ['rgb(255, 0, 0)', [255, 0, 0, 1]],
    ['rgba(255, 0, 0, 0.5)', [255, 0, 0, 0.5]],
    ['rgba(255,0,0,.5)', [255, 0, 0, 0.5]],
    ['rgb(1 2 3 / .5)', [1, 2, 3, 0.5]],
    ['rgb(1 2 3 / 50%)', [1, 2, 3, 0.5]],
    ['rgb(100% 0% 0%)', [255, 0, 0, 1]],
    ['rgb(100%, 50%, 0%, 0.5)', [255, 128, 0, 0.5]],
    ['hsl(120, 100%, 50%)', [0, 255, 0, 1]],
    ['hsla(120, 100%, 50%, 0.5)', [0, 255, 0, 0.5]],
    ['hsl(120 100% 50% / .5)', [0, 255, 0, 0.5]],
    ['hsl(120deg 100% 50%)', [0, 255, 0, 1]],
    ['oklch(62.8% 0.2577 29.23)', [255, 0, 0, 1]],
    ['oklch(0.628 0.2577 29.23)', [255, 0, 0, 1]],
    ['oklch(0.628 0.2577 29.23 / 0.5)', [255, 0, 0, 0.5]],
    ['oklch(62.8% 0.2577 29.23 / 50%)', [255, 0, 0, 0.5]],
  ];
  for (const [text, want] of INPUTS) {
    it(`reads ${text}`, async () => {
      const { el, events } = await open('#000000');
      await choose(el, 'RGBA');
      await type(el, text);
      await save(el);
      expect(events).toHaveLength(1);
      near(events[0], want, 3);
    });
  }
  it('text that is not a colour is not written as a converted colour', async () => {
    const { el, events } = await open('#336699');
    await choose(el, 'RGBA');
    await type(el, 'rgb(1 2');
    await save(el);
    for (const e of events) expect(e).not.toMatch(/^rgba\(\s*1,\s*2/);
  });
  it('a long hostile string is answered at once (no backtracking, length capped before any pattern)', async () => {
    const { el } = await open('#336699');
    for (const hostile of ['rgb(' + '1 '.repeat(60000), 'hsl(' + '1'.repeat(200000), 'oklch(' + '0.'.repeat(60000) + 'x', '#' + 'f'.repeat(100000)]) {
      const t0 = performance.now();
      await type(el, hostile);
      expect(performance.now() - t0, hostile.slice(0, 12)).toBeLessThan(500);
    }
  });
});

describe('colour popup: oklch outside sRGB', () => {
  const WIDE = 'oklch(70% 0.4 150)';
  it('opens on OKLCH, shows the value as written and Save without an edit keeps it', async () => {
    const { el, events } = await open(WIDE);
    expect(active(el)).toEqual(['OKLCH']);
    expect(field(el).value).toBe(WIDE);
    await save(el);
    expect(events.length === 0 || events.every((e) => e === WIDE)).toBe(true);
  });
  it('the picker area works from the clamped colour without an error', async () => {
    const { el } = await open(WIDE);
    expect(el.shadowRoot!.querySelector('.mc-color-area')).not.toBeNull();
    await choose(el, 'RGBA');
    near(field(el).value, [0, 0, 0, 1], 255);
  });
  it('an edit replaces it by the converted colour', async () => {
    const { el, events } = await open(WIDE);
    await type(el, 'oklch(70% 0.1 150)');
    await save(el);
    expect(events).toHaveLength(1);
    expect(events[0]).not.toBe(WIDE);
  });
});

describe('the text field of the picker', () => {
  it('selects its text on focus, so typing replaces the value', async () => {
    const el = document.createElement('mc-color-picker') as El;
    el.value = 'currentcolor';
    el.label = 'Fill';
    document.body.appendChild(el);
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input.input.mono')!;
    input.dispatchEvent(new FocusEvent('focus'));
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 'currentcolor'.length]);
  });
});
