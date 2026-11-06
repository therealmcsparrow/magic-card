import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'lit';
import { lyrSlider } from '../src/editor/layers/controls';
import { slider as kitSlider } from '../src/ui-kit/templates/slider';
import '../src/editor/components/color-picker';

/*
 * A slider and its number field show one value. Dragging the slider moves the number as it goes, a number
 * outside min..max is pulled back into the field and the slider, and a value that comes back from outside
 * (reset, undo, YAML) wins over what was last typed or dragged, even when it equals the value rendered before.
 * Covers src/editor/layers/controls.ts (lyrSlider: bg layer Zoom from / to / Duration / Blur / Size /
 * Thickness / Opacity, layer-groups Blur / Strength / Opacity), src/ui-kit/templates/slider.ts (kit slider:
 * gradient angle, shape smoothing, path tools) and the H and A fields in src/editor/components/color-picker.ts.
 */
afterEach(() => {
  document.body.innerHTML = '';
});

const host = (): HTMLElement => document.body.appendChild(document.createElement('div'));
const range = (h: HTMLElement) => h.querySelector<HTMLInputElement>('input[type="range"]')!;
const num = (h: HTMLElement) => h.querySelector<HTMLInputElement>('input[type="number"]')!;
const fire = (i: HTMLInputElement, value: string, ...events: string[]) => {
  i.value = value;
  for (const e of events) i.dispatchEvent(new Event(e, { bubbles: true }));
};

/** A parent that keeps the value in a variable and renders again, like the editors do. */
function lyr(initial: number, min = 0, max = 100, unit = '%') {
  const h = host();
  const state = { value: initial, writes: [] as number[] };
  const draw = () =>
    render(
      lyrSlider('s', 'Opacity', state.value, min, max, unit, (v) => {
        state.writes.push(v);
        state.value = v;
        draw();
      }),
      h,
    );
  draw();
  return { h, state, draw };
}

describe('lyrSlider (layer sliders with a number field)', () => {
  it('number field follows the slider while it is dragged (input events)', () => {
    const { h } = lyr(30);
    fire(range(h), '64', 'input');
    expect(num(h).value).toBe('64');
  });

  it('aria-valuetext follows the slider while it is dragged', () => {
    const { h } = lyr(30);
    fire(range(h), '64', 'input');
    expect(range(h).getAttribute('aria-valuetext')).toBe('64%');
  });

  it('slider follows a committed number', () => {
    const { h, state } = lyr(30);
    fire(num(h), '55', 'change');
    expect(state.value).toBe(55);
    expect(range(h).value).toBe('55');
    expect(num(h).value).toBe('55');
  });

  it('slider follows the number field while it is typed (input events)', () => {
    const { h } = lyr(30);
    fire(num(h), '72', 'input');
    expect(range(h).value).toBe('72');
  });

  it('a number above max is shown clamped in the field and the slider, also when the value was already max', () => {
    const { h, state } = lyr(100);
    fire(num(h), '250', 'change');
    expect(state.value).toBe(100);
    expect(num(h).value).toBe('100');
    expect(range(h).value).toBe('100');
  });

  it('a number below min is shown clamped in the field, also when the value was already min', () => {
    const { h } = lyr(0);
    fire(num(h), '-5', 'change');
    expect(num(h).value).toBe('0');
    expect(range(h).value).toBe('0');
  });

  it('a decimal is shown rounded like the value that is written', () => {
    const { h, state } = lyr(30);
    fire(num(h), '41.6', 'change');
    expect(state.value).toBe(42);
    expect(num(h).value).toBe('42');
  });

  it('a value reset from outside to the value rendered before replaces a dragged value', () => {
    const { h, state, draw } = lyr(30);
    fire(range(h), '80', 'input'); // dragged, not committed (cancelled or rejected by the host)
    state.value = 30; // reset / undo gives back the value rendered before
    draw();
    expect(range(h).value).toBe('30');
    expect(num(h).value).toBe('30');
  });

  it('an outside change moves both controls', () => {
    const { h, state, draw } = lyr(30);
    state.value = 90;
    draw();
    expect(range(h).value).toBe('90');
    expect(num(h).value).toBe('90');
  });
});

function kit(initial: number, min = 0, max = 360) {
  const h = host();
  const state = { value: initial, changes: [] as number[] };
  const draw = () =>
    render(
      kitSlider({
        id: 'k',
        label: 'Angle',
        min,
        max,
        step: 1,
        value: state.value,
        unit: 'deg',
        onInput: () => {},
        onChange: (v) => {
          state.changes.push(v);
          state.value = v;
          draw();
        },
      }),
      h,
    );
  draw();
  return { h, state, draw };
}

describe('kit slider (gradient angle, shape smoothing, path tools)', () => {
  it('number field follows the slider while it is dragged, without the host re-rendering', () => {
    const { h } = kit(90);
    fire(range(h), '200', 'input');
    expect(num(h).value).toBe('200');
  });

  it('slider follows the number field while it is typed', () => {
    const { h } = kit(90);
    fire(num(h), '270', 'input');
    expect(range(h).value).toBe('270');
  });

  it('a number above max is shown clamped when committed, also when the value was already max', () => {
    const { h } = kit(360);
    fire(num(h), '999', 'change');
    expect(num(h).value).toBe('360');
    expect(range(h).value).toBe('360');
  });

  it('a value reset from outside to the value rendered before replaces a dragged value', () => {
    const { h, state, draw } = kit(90);
    fire(range(h), '200', 'input');
    state.value = 90;
    draw();
    expect(range(h).value).toBe('90');
    expect(num(h).value).toBe('90');
  });
});

describe('colour picker H and A number fields', () => {
  async function open(value: string) {
    const el = document.createElement('mc-color-picker') as HTMLElement & { value: string; updateComplete: Promise<unknown> };
    el.value = value;
    document.body.appendChild(el);
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('button.swatch')!.click();
    await el.updateComplete;
    return el;
  }
  const field = (el: HTMLElement, label: string) => el.shadowRoot!.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
  const thumb = (el: HTMLElement, track: string) => el.shadowRoot!.querySelector<HTMLElement>(`.${track} .mc-slider-thumb`)!;

  it('an opacity above 100 is shown as 100 in the field (the thumb is at the end)', async () => {
    const el = await open('#336699');
    const a = field(el, 'Opacity percent');
    fire(a, '250', 'input');
    await el.updateComplete;
    expect(thumb(el, 'mc-opacity-track').style.left).toBe('100%');
    expect(a.value).toBe('100');
  });

  it('a hue above 360 is shown as 360 in the field', async () => {
    const el = await open('hsl(360 80% 50%)');
    const h = field(el, 'Hue');
    fire(h, '999', 'input');
    await el.updateComplete;
    expect(h.value).toBe('360');
  });

  it('clearing the hue field to type a new number does not put a 0 back under the cursor', async () => {
    const el = await open('#336699');
    const h = field(el, 'Hue');
    fire(h, '', 'input');
    await el.updateComplete;
    expect(h.value).toBe('');
  });
});
