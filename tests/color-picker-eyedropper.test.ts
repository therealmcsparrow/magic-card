import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/editor/components/color-picker';

/*
 * CEO request: a pipette in the colour popup (src/editor/components/color-picker.ts) when the browser has the
 * EyeDropper API; hidden otherwise. A pick takes the same path as choosing a swatch (_selectPreset: the hex field,
 * saved by Save); a cancel (AbortError) changes nothing.
 */
type El = HTMLElement & Record<string, unknown> & { updateComplete: Promise<unknown> };
const w = window as unknown as { EyeDropper?: unknown };

afterEach(() => {
  document.body.innerHTML = '';
  delete w.EyeDropper;
});

async function open(value = '#336699'): Promise<El> {
  const el = document.createElement('mc-color-picker') as El;
  el.value = value;
  el.label = 'Fill';
  document.body.appendChild(el);
  await el.updateComplete;
  el.shadowRoot!.querySelector<HTMLButtonElement>('button.swatch')!.click();
  await el.updateComplete;
  return el;
}
const LABEL = 'Pick a colour from the screen';
const pipette = (el: El) => el.shadowRoot!.querySelector<HTMLButtonElement>(`button[aria-label="${LABEL}"]`);
const hex = (el: El) => el.shadowRoot!.querySelector<HTMLInputElement>('.mc-input-row input')!;
const stub = (impl: () => Promise<{ sRGBHex: string }>) => {
  const opened = vi.fn(impl);
  w.EyeDropper = class {
    open = opened;
  };
  return opened;
};
const flush = async (el: El) => {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

describe('colour picker pipette', () => {
  it('is hidden when the browser has no EyeDropper', async () => {
    expect('EyeDropper' in window).toBe(false);
    expect(pipette(await open())).toBeNull();
  });

  it('is shown when EyeDropper exists, with an accessible label and a tooltip', async () => {
    stub(async () => ({ sRGBHex: '#ff0000' }));
    const b = pipette(await open())!;
    expect(b).not.toBeNull();
    expect(b.type).toBe('button');
    expect(b.getAttribute('title')).toBeTruthy();
  });

  it('is not on the closed field, only in the popup', async () => {
    stub(async () => ({ sRGBHex: '#ff0000' }));
    const el = document.createElement('mc-color-picker') as El;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(pipette(el)).toBeNull();
  });

  it('a pick opens the dropper once and takes the colour like a swatch (hex field), saved by Save', async () => {
    const dropper = stub(async () => ({ sRGBHex: '#ff0000' }));
    const el = await open();
    const events: string[] = [];
    el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail.value));
    pipette(el)!.click();
    await flush(el);
    expect(dropper).toHaveBeenCalledTimes(1);
    expect(hex(el).value.toLowerCase()).toBe('#ff0000');
    el.shadowRoot!.querySelector<HTMLButtonElement>('.mc-picker-footer .btn:not(.btn-secondary)')!.click();
    await flush(el);
    expect(events.map((v) => v.toLowerCase())).toEqual(['#ff0000']);
  });

  it('a cancel (AbortError) changes nothing and throws nothing', async () => {
    const dropper = stub(async () => {
      throw new DOMException('The user aborted a request.', 'AbortError');
    });
    const el = await open('#336699');
    const before = hex(el).value;
    const events: string[] = [];
    el.addEventListener('value-changed', (e) => events.push((e as CustomEvent).detail.value));
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    pipette(el)!.click();
    await flush(el);
    process.off('unhandledRejection', unhandled);
    expect(dropper).toHaveBeenCalledTimes(1);
    expect(hex(el).value).toBe(before);
    expect(events).toEqual([]);
    expect(unhandled).not.toHaveBeenCalled();
    expect(pipette(el)).not.toBeNull();
  });
});
