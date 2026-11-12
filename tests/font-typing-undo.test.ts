// @vitest-environment-options {"settings":{"handleDisabledFileLoadingAsSuccess":true}}
// A font typed by name is one undo step, from the first key to the tidied value written on commit.
import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/modules/index';
import { EditorStateManager } from '../src/editor/state/editor-state';
import '../src/editor/components/font-picker';
import type { FontPicker } from '../src/editor/components/font-picker';
import { defineUiKit } from '../src/ui-kit';

defineUiKit();
import type { MagicCardConfig } from '../src/types';

const config = (font: string): MagicCardConfig => ({ type: 'custom:magic-card', font_family: font, rows: [] } as unknown as MagicCardConfig);
const make = () => {
  const sm = new EditorStateManager(vi.fn());
  sm.setConfig(config(''));
  return sm;
};
const font = (sm: EditorStateManager) => (sm.getState().config as unknown as { font_family: string }).font_family;

describe('typing folds into one undo step', () => {
  it('every write between start and end is one step, and the next edit is a step of its own', () => {
    const sm = make();
    sm.typing(true);
    for (const v of ['l', 'la', 'lat', 'lato']) sm.updateConfig(config(v));
    sm.updateConfig(config('"Lato", sans-serif'));
    sm.typing(false);
    sm.updateConfig(config('serif'));
    sm.undo();
    expect(font(sm)).toBe('"Lato", sans-serif');
    sm.undo();
    expect(font(sm)).toBe('');
    sm.undo();
    expect(font(sm)).toBe('');
  });

  it('a write after Undo in the middle of typing is a step again', () => {
    const sm = make();
    sm.typing(true);
    sm.updateConfig(config('a'));
    sm.updateConfig(config('ab'));
    sm.undo();
    expect(font(sm)).toBe('');
    sm.updateConfig(config('x'));
    sm.typing(false);
    sm.undo();
    expect(font(sm)).toBe('');
    sm.redo();
    expect(font(sm)).toBe('x');
  });
});

describe('<mc-font-picker> marks the typing edit', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  const mount = async () => {
    const el = document.createElement('mc-font-picker') as FontPicker;
    document.body.appendChild(el);
    await el.updateComplete;
    const seen: string[] = [];
    el.addEventListener('mc-typing', (e) => seen.push(`typing:${(e as CustomEvent<boolean>).detail}`));
    el.addEventListener('value-changed', (e) => seen.push(`value:${(e as CustomEvent<{ value: string }>).detail.value}`));
    const input = el.shadowRoot!.querySelector<HTMLInputElement>('.mc-picker-row input')!;
    return { el, seen, input };
  };

  it('starts on a key, then ends after the tidied value on commit, and the blur that follows adds nothing', async () => {
    const { seen, input } = await mount();
    input.value = 'serif';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('blur'));
    await vi.waitFor(() => expect(seen.at(-1)).toBe('typing:false'));
    expect(seen).toEqual(['typing:true', 'value:serif', 'typing:false']);
  });

  it('a blur without a change ends the edit', async () => {
    const { seen, input } = await mount();
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    expect(seen).toEqual(['typing:true', 'value:a', 'typing:false']);
  });
});
