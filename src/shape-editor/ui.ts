import { html, type TemplateResult } from 'lit';

/*
 * Small template helpers shared by the shape editor's panels (one place for the radio groups, tabs and
 * number fields, so the markup is written once).
 */

export const btn = (text: unknown, run: (e: MouseEvent) => void, cls = ''): TemplateResult => html`<button class="b ${cls}" @click=${run}>${text}</button>`;

/** A segmented control: radios (`role` radio, one choice) or tabs. */
export const seg = <K extends string>(label: string, items: Array<[K, string]>, cur: K, pick: (k: K) => void, tab = false): TemplateResult =>
  html`<div class="seg" role=${tab ? 'tablist' : 'radiogroup'} aria-label=${label}>${items.map(
    ([k, t]) => html`<button role=${tab ? 'tab' : 'radio'} aria-checked=${tab ? undefined : k === cur} aria-selected=${tab ? k === cur : undefined} @click=${() => pick(k)}>${t}</button>`,
  )}</div>`;

export const r1 = (v: number): number => Math.round(v * 10) / 10;

export interface NumOpts {
  id?: string;
  step?: number;
  min?: number;
  max?: number;
}

export const num = (label: string, v: number, set: (n: number) => void, o: NumOpts = {}): TemplateResult =>
  html`<label class="f"><span>${label}</span><input id=${o.id ?? ''} type="number" inputmode="decimal" step=${o.step ?? 1} min=${o.min ?? ''} max=${o.max ?? ''} .value=${String(r1(v))} @change=${(e: Event) => set(+(e.target as HTMLInputElement).value)} /></label>`;

export const check = (label: string, on: boolean, set: (b: boolean) => void): TemplateResult =>
  html`<label class="switch"><input type="checkbox" .checked=${on} @change=${(e: Event) => set((e.target as HTMLInputElement).checked)} />${label}</label>`;
