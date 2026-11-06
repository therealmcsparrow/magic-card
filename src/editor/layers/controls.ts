import { html, nothing, svg, type TemplateResult } from 'lit';
import { shownValue } from '../../ui-kit/templates/shown-value';
import { LAYER_BLENDS, type LayerBlend } from '../../contracts/layer-placement';
import { m, t } from './i18n';

// Small controls shared by the Layer group and the Card backdrop group.

/** The kit disclosure chevron (same path as <mc-ui-disclosure>); the sheet rotates it when the button is expanded. */
export function chevron(): TemplateResult {
  return html`<svg class="chev" viewBox="0 0 24 24" aria-hidden="true">${svg`<path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>`}</svg>`;
}

/** A switch with its On / Off word. */
export function lyrSwitch(id: string, label: string, checked: boolean, on: (v: boolean) => void, help?: string): TemplateResult {
  return html`<div class="sw-row">
    <div class="txt">
      <label for=${id}>${label}</label>
      ${help ? html`<p class="help" id=${`${id}-h`}>${help}</p>` : nothing}
    </div>
    <button type="button" class="lyr-switch" id=${id} role="switch" aria-checked=${checked ? 'true' : 'false'} aria-describedby=${help ? `${id}-h` : nothing} @click=${() => on(!checked)}>
      <span class="track" aria-hidden="true"></span><span class="state">${checked ? t('layer-editor.controls.on') : t('layer-editor.controls.off')}</span>
    </button>
  </div>`;
}

/** Slider writes waiting for the next animation frame, by slider; the latest value wins. */
const pending = new Map<Element, { frame: number; v: number; on: (v: number) => void }>();

/** The value a slider last wrote while it moved, until its release; the release skips a write that repeats it. */
const written = new WeakMap<Element, number>();

/** Drops every frame still waiting for a slider inside `root`; a host calls this when it leaves the page. */
export function cancelSliderFrames(root: ParentNode | null | undefined): void {
  for (const [slider, p] of pending) {
    if (!root?.contains(slider)) continue;
    cancelAnimationFrame(p.frame);
    pending.delete(slider);
  }
}

/** A range with a number field beside it, clamped to min..max. Home Assistant's slider when the page has defined it, else the browser range; moving the thumb writes at most once per frame. */
export function lyrSlider(id: string, label: string, value: number, min: number, max: number, unit: string, on: (v: number) => void): TemplateResult {
  /** Shows the value of the control that fired in the range, its spoken text and the number field; undefined when it holds no number. */
  const show = (e: Event, typing = false): number | undefined => {
    const target = e.target as HTMLInputElement;
    const n = Number(target.value);
    if (target.value === '' || !Number.isFinite(n)) return undefined;
    const v = Math.max(min, Math.min(max, Math.round(n)));
    const row = target.closest('.inline');
    const r = row?.querySelector<HTMLInputElement>('.lyr-range');
    const f = row?.querySelector<HTMLInputElement>('input[type="number"]');
    if (r) (r as { value: unknown }).value = r.localName === 'ha-slider' ? v : String(v);
    if (f && !typing) f.value = String(v);
    r?.setAttribute('aria-valuetext', `${v}${unit}`);
    return v;
  };
  const preview = (e: Event): void => void show(e, (e.target as HTMLInputElement).type === 'number');
  /** The thumb moved: write on the next frame. */
  const move = (e: Event): void => {
    const v = show(e);
    if (v === undefined) return;
    const slider = e.target as Element;
    const p = pending.get(slider);
    if (p) {
      p.v = v;
      p.on = on;
      return;
    }
    const w = { v, on, frame: requestAnimationFrame(() => (pending.delete(slider), written.set(slider, w.v), w.on(w.v))) };
    pending.set(slider, w);
  };
  /** Release or a typed number: write the final value once, in place of a pending frame; nothing when the last frame already wrote it. */
  const set = (e: Event): void => {
    const v = show(e);
    if (v === undefined) return;
    const slider = e.target as Element;
    const p = pending.get(slider);
    if (p) cancelAnimationFrame(p.frame);
    pending.delete(slider);
    const again = !p && written.get(slider) === v;
    written.delete(slider);
    if (!again) on(v);
  };
  const slider = customElements.get('ha-slider')
    ? html`<ha-slider class="lyr-range" id=${id} label=${label} min=${min} max=${max} step="1" .value=${value} aria-label=${label} aria-valuetext=${shownValue(`${value}${unit}`)} @input=${move} @change=${set}></ha-slider>`
    : html`<input class="lyr-range" id=${id} type="range" min=${min} max=${max} step="1" .value=${shownValue(String(value))} aria-label=${label} aria-valuetext=${shownValue(`${value}${unit}`)} @input=${move} @change=${set} />`;
  return html`<div>
    <label for=${id}>${label}</label>
    <div class="inline">
      ${slider}
      <input class="lyr-input input" type="number" min=${min} max=${max} step="1" aria-label=${t('layer-editor.controls.label-value', { label })} .value=${shownValue(String(value))} @input=${preview} @change=${set} />
      <span aria-hidden="true">${unit}</span>
    </div>
  </div>`;
}

/** A button group where one is pressed: aria-pressed, a check mark and a 2 px border on the pressed one. */
export function lyrSeg<V extends string>(label: string, value: V | undefined, items: ReadonlyArray<{ value: V; label: string }>, on: (v: V) => void, key = 'v'): TemplateResult {
  return html`<div class="lseg" role="group" aria-label=${label} data-seg=${key}>
    ${items.map(
      (it) => html`<button type="button" data-val=${it.value} aria-pressed=${value === it.value ? 'true' : 'false'} @click=${() => on(it.value)}>${value === it.value ? html`<span class="tick" aria-hidden="true">✓</span>` : nothing}${it.label}</button>`,
    )}
  </div>`;
}

export const BLEND_ITEMS: ReadonlyArray<{ value: LayerBlend; label: ReturnType<typeof m>; hint: ReturnType<typeof m>; swatch: string }> = [
  { value: 'normal', label: m('layer-editor.controls.normal'), hint: m('layer-editor.controls.no-blending'), swatch: 'linear-gradient(90deg, #ef5350 50%, #42a5f5 50%)' },
  { value: 'multiply', label: m('layer-editor.controls.multiply'), hint: m('layer-editor.controls.darker-where-layers-overlap'), swatch: 'linear-gradient(90deg, #8d2f2c 50%, #1e5fa0 50%)' },
  { value: 'screen', label: m('layer-editor.controls.screen'), hint: m('layer-editor.controls.lighter-like-projected-light'), swatch: 'linear-gradient(90deg, #ffb4b1 50%, #b6dcff 50%)' },
  { value: 'overlay', label: m('layer-editor.controls.overlay'), hint: m('layer-editor.controls.more-contrast'), swatch: 'linear-gradient(90deg, #d32f2f 50%, #1976d2 50%)' },
  { value: 'darken', label: m('layer-editor.controls.darken'), hint: m('layer-editor.controls.keeps-the-darker-colour'), swatch: 'linear-gradient(90deg, #7b2c2a 50%, #2a5a8c 50%)' },
  { value: 'lighten', label: m('layer-editor.controls.lighten'), hint: m('layer-editor.controls.keeps-the-lighter-colour'), swatch: 'linear-gradient(90deg, #ff8a86 50%, #8cc8ff 50%)' },
  { value: 'soft-light', label: m('layer-editor.controls.soft-light'), hint: m('layer-editor.controls.gentle-contrast'), swatch: 'linear-gradient(90deg, #e0605c 50%, #5aa6ea 50%)' },
];

/** The seven blend names with a 24 px preview swatch and a plain description; "Normal" removes the key. */
export function blendTiles(id: string, value: string | undefined, on: (v: LayerBlend | undefined) => void): TemplateResult {
  const cur = LAYER_BLENDS.includes(value as LayerBlend) ? (value as LayerBlend) : 'normal';
  return html`<div>
    <span class="lbl" id=${id}>${t('layer-editor.controls.blend')}</span>
    <div class="tiles2" role="group" aria-labelledby=${id}>
      ${BLEND_ITEMS.map(
        (b) => html`<button type="button" class="lyr-tile" data-blend=${b.value} aria-pressed=${cur === b.value ? 'true' : 'false'} @click=${() => on(b.value === 'normal' ? undefined : b.value)}>
          <span class="pv" style=${`background:${b.swatch};height:24px`}></span><span class="nm">${cur === b.value ? '✓ ' : ''}${t(b.label)}</span><span class="sub">${t(b.hint)}</span>
        </button>`,
      )}
    </div>
    <p class="help">${t('layer-editor.controls.if-this-browser-cannot-blend-the-layer')}${cur !== 'normal' ? ` ${t('layer-editor.controls.add-a-colour-at-the-back-to-blend-with')}` : ''}</p>
  </div>`;
}
