import { describe, it, expect, vi } from 'vitest';
import { render } from 'lit';
import { slider, kitCss, kitSlider } from '../src/ui-kit';
import { KIT_CLASSES } from '../src/contracts/ui-kit';

const mount = (t: unknown): HTMLElement => {
  const host = document.createElement('div');
  document.body.append(host);
  render(t as never, host);
  return host;
};

const opts = (over = {}) => ({ id: 'ang', label: 'Angle', min: 0, max: 360, step: 1, value: 135, unit: 'deg', onInput: () => {}, onChange: () => {}, ...over });

describe('slider (.slider-row)', () => {
  it('label for the range, a number field and a decorative unit', () => {
    const h = mount(slider(opts()));
    const row = h.querySelector('.slider-row') as HTMLElement;
    expect(row).toBeTruthy();
    const label = row.querySelector('label') as HTMLLabelElement;
    expect(label.htmlFor).toBe('ang');
    const range = row.querySelector('input[type="range"]') as HTMLInputElement;
    expect(range.id).toBe('ang');
    expect([range.min, range.max, range.step, range.value]).toEqual(['0', '360', '1', '135']);
    const num = row.querySelector('input[type="number"]') as HTMLInputElement;
    expect(num.classList.contains('input')).toBe(true);
    expect(num.getAttribute('aria-label')).toBe('Angle');
    expect(num.value).toBe('135');
    expect(row.querySelector('[aria-hidden="true"]')?.textContent).toBe('deg');
  });

  it('no unit: no unit element', () => {
    const h = mount(slider(opts({ unit: undefined })));
    expect(h.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('input on the range calls onInput, change calls onChange; the number field calls onChange', () => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const h = mount(slider(opts({ onInput, onChange })));
    const range = h.querySelector('input[type="range"]') as HTMLInputElement;
    range.value = '200';
    range.dispatchEvent(new Event('input'));
    expect(onInput).toHaveBeenCalledWith(200);
    expect(onChange).not.toHaveBeenCalled();
    range.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenLastCalledWith(200);
    const num = h.querySelector('input[type="number"]') as HTMLInputElement;
    num.value = '45';
    num.dispatchEvent(new Event('change'));
    expect(onChange).toHaveBeenLastCalledWith(45);
  });

  it('valueText, numberLabel and disabled reach the controls', () => {
    const h = mount(slider(opts({ valueText: '135 degrees', numberLabel: 'Angle in degrees', disabled: true })));
    const range = h.querySelector('input[type="range"]') as HTMLInputElement;
    expect(range.getAttribute('aria-valuetext')).toBe('135 degrees');
    expect(range.disabled).toBe(true);
    const num = h.querySelector('input[type="number"]') as HTMLInputElement;
    expect(num.getAttribute('aria-label')).toBe('Angle in degrees');
    expect(num.disabled).toBe(true);
  });
});

describe('kitSlider css', () => {
  it('is part of kitCss and styles .slider-row', () => {
    expect(kitCss).toContain(kitSlider);
    expect(kitSlider.cssText).toContain('.slider-row');
    expect(KIT_CLASSES).toContain('slider-row');
  });
});

describe('slider: an emptied number field', () => {
  it('leaving it empty puts the held value back and reports nothing', () => {
    const onChange = vi.fn();
    const h = mount(slider(opts({ onChange })));
    const num = h.querySelector('input[type="number"]') as HTMLInputElement;
    num.value = '';
    num.dispatchEvent(new Event('change'));
    expect(num.value).toBe('135');
    expect(onChange).not.toHaveBeenCalled();
  });
});
