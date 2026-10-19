import { html, nothing, type TemplateResult } from 'lit';
import { LAYER_BLENDS, type LayerBlend } from '../../contracts/layer-placement';
import { m, t } from '../i18n';

/*
 * Small controls shared by the Layer group and the Card backdrop group. Each one carries the Marco N1 cues:
 * a 3:1 edge (layerControlCss), On / Off words beside a switch, and a check mark on a pressed button.
 */

/** A switch with its On / Off word. */
export function lyrSwitch(id: string, label: string, checked: boolean, on: (v: boolean) => void, help?: string): TemplateResult {
  return html`<div class="sw-row">
    <div class="txt">
      <label for=${id}>${label}</label>
      ${help ? html`<p class="help" id=${`${id}-h`}>${help}</p>` : nothing}
    </div>
    <button type="button" class="lyr-switch" id=${id} role="switch" aria-checked=${checked ? 'true' : 'false'} aria-describedby=${help ? `${id}-h` : nothing} @click=${() => on(!checked)}>
      <span class="track" aria-hidden="true"></span><span class="state">${checked ? t('On') : t('Off')}</span>
    </button>
  </div>`;
}

/** A range with a number field beside it, clamped to min..max. */
export function lyrSlider(id: string, label: string, value: number, min: number, max: number, unit: string, on: (v: number) => void): TemplateResult {
  const set = (e: Event): void => {
    const n = Number((e.target as HTMLInputElement).value);
    if (Number.isFinite(n)) on(Math.max(min, Math.min(max, Math.round(n))));
  };
  return html`<div>
    <label for=${id}>${label}</label>
    <div class="inline">
      <input class="lyr-range" id=${id} type="range" min=${min} max=${max} step="1" .value=${String(value)} aria-valuetext=${`${value}${unit}`} @change=${set} />
      <input class="lyr-input" type="number" min=${min} max=${max} step="1" aria-label=${t('{label} value', { label })} .value=${String(value)} @change=${set} />
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
  { value: 'normal', label: m('Normal'), hint: m('No blending'), swatch: 'linear-gradient(90deg, #ef5350 50%, #42a5f5 50%)' },
  { value: 'multiply', label: m('Multiply'), hint: m('Darker where layers overlap'), swatch: 'linear-gradient(90deg, #8d2f2c 50%, #1e5fa0 50%)' },
  { value: 'screen', label: m('Screen'), hint: m('Lighter, like projected light'), swatch: 'linear-gradient(90deg, #ffb4b1 50%, #b6dcff 50%)' },
  { value: 'overlay', label: m('Overlay'), hint: m('More contrast'), swatch: 'linear-gradient(90deg, #d32f2f 50%, #1976d2 50%)' },
  { value: 'darken', label: m('Darken'), hint: m('Keeps the darker colour'), swatch: 'linear-gradient(90deg, #7b2c2a 50%, #2a5a8c 50%)' },
  { value: 'lighten', label: m('Lighten'), hint: m('Keeps the lighter colour'), swatch: 'linear-gradient(90deg, #ff8a86 50%, #8cc8ff 50%)' },
  { value: 'soft-light', label: m('Soft light'), hint: m('Gentle contrast'), swatch: 'linear-gradient(90deg, #e0605c 50%, #5aa6ea 50%)' },
];

/** The seven blend names with a 24 px preview swatch and a plain description; "Normal" removes the key. */
export function blendTiles(id: string, value: string | undefined, on: (v: LayerBlend | undefined) => void): TemplateResult {
  const cur = LAYER_BLENDS.includes(value as LayerBlend) ? (value as LayerBlend) : 'normal';
  return html`<div>
    <span class="lbl" id=${id}>${t('Blend')}</span>
    <div class="tiles2" role="group" aria-labelledby=${id}>
      ${BLEND_ITEMS.map(
        (b) => html`<button type="button" class="lyr-tile" data-blend=${b.value} aria-pressed=${cur === b.value ? 'true' : 'false'} @click=${() => on(b.value === 'normal' ? undefined : b.value)}>
          <span class="pv" style=${`background:${b.swatch};height:24px`}></span><span class="nm">${cur === b.value ? '✓ ' : ''}${t(b.label)}</span><span class="sub">${t(b.hint)}</span>
        </button>`,
      )}
    </div>
    <p class="help">${t('If this browser cannot blend, the layer shows normally.')}${cur !== 'normal' ? ` ${t('Add a colour at the back to blend with.')}` : ''}</p>
  </div>`;
}
