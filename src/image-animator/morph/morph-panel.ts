import { html, nothing, type TemplateResult } from 'lit';
import { t } from '../i18n';
import type { ImageTarget } from '../targets';

// The morph controls of the animator: choose the shape that changes and the shape it changes into, from lists, by keyboard or pointer.

export interface MorphPanelProps {
  /** The `<path>` elements of the drawing. */
  paths: readonly ImageTarget[];
  from: string;
  into: string;
  back: boolean;
  /** The last thing that went wrong or worked, shown in a live region. */
  message: string;
  setFrom(ref: string): void;
  setInto(ref: string): void;
  setBack(on: boolean): void;
  add(): void;
}

const pathName = (p: ImageTarget): string => t('image-animator.morph-panel.shape-id', { id: p.id ?? '' });

function choices(paths: readonly ImageTarget[], value: string): TemplateResult[] {
  return paths.map((p) => html`<option value=${p.ref} ?selected=${p.ref === value}>${pathName(p)}</option>`);
}

export function renderMorph(p: MorphPanelProps): TemplateResult {
  const ready = p.paths.length >= 2 && p.from !== p.into;
  return html`<section aria-labelledby="morph-title">
    <h3 id="morph-title">${t('image-animator.morph-panel.morph-one-shape-into-another')}</h3>
    <p class="hint" id="morph-hint">${t('image-animator.morph-panel.the-first-shape-changes-into-the-second')}</p>
    <div class="ia-row">
      <label for="morph-from">${t('image-animator.morph-panel.shape-that-changes')}</label>
      <select id="morph-from" .value=${p.from} @change=${(e: Event) => p.setFrom((e.target as HTMLSelectElement).value)}>
        ${choices(p.paths, p.from)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-into">${t('image-animator.morph-panel.changes-into')}</label>
      <select id="morph-into" .value=${p.into} @change=${(e: Event) => p.setInto((e.target as HTMLSelectElement).value)}>
        ${choices(p.paths, p.into)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-back">${t('image-animator.morph-panel.go-back-to-the-first-shape')}</label>
      <input id="morph-back" type="checkbox" .checked=${p.back} @change=${(e: Event) => p.setBack((e.target as HTMLInputElement).checked)} />
    </div>
    <div class="ia-row">
      <button type="button" class="btn btn-secondary" aria-disabled=${ready ? 'false' : 'true'} aria-describedby=${ready ? 'morph-hint' : 'morph-need'} @click=${() => ready && p.add()}>
        ${t('image-animator.morph-panel.add-morph')}
      </button>
    </div>
    ${ready ? nothing : html`<p class="hint" id="morph-need">${t('image-animator.morph-panel.choose-two-different-shapes-to-morph')}</p>`}
    <p class="status" role="status">${p.message}</p>
  </section>`;
}
