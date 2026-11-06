import { html, nothing, type TemplateResult } from 'lit';
import type { KitButtonOptions } from '../contracts/ui-kit';
import { button, seg as kitSeg } from '../ui-kit';

// Small template helpers of the shape editor panels on the ui kit (ui-kit 1.0.0): a button, the segmented control and the number field.

/** A small kit button (secondary unless `o.variant` says otherwise). */
export const btn = (label: string, onClick: (e: MouseEvent) => void, o: Partial<KitButtonOptions> = {}): TemplateResult => button({ label, onClick, size: 'sm', ...o });

/** A segmented control: radios (`radiogroup`, one choice) or tabs (`tablist`). */
export const seg = <K extends string>(label: string, items: Array<[K, string]>, cur: K, pick: (k: K) => void, tab = false, full = true): TemplateResult =>
  kitSeg<K>({ role: tab ? 'tablist' : 'radiogroup', label, items: items.map(([value, text]) => ({ value, label: text })), value: cur, full, onChange: pick });

export const r1 = (v: number): number => Math.round(v * 10) / 10;

export interface NumOpts {
  id?: string;
  step?: number;
  min?: number;
  max?: number;
}

/** A labelled number field: the label wraps the input, so the pair is one control for a screen reader. */
export const num = (label: string, v: number, set: (n: number) => void, o: NumOpts = {}): TemplateResult =>
  html`<label class="field"><span class="fl">${label}</span><input class="input" id=${o.id ?? nothing} type="number" inputmode="decimal" step=${o.step ?? 1} min=${o.min ?? nothing} max=${o.max ?? nothing} .value=${String(r1(v))} @change=${(e: Event) => set(+(e.target as HTMLInputElement).value)} /></label>`;
