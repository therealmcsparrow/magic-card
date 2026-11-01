import { LitElement, html, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { t } from './i18n';
import { applyMapping, findPlaceholders, isMappable, mappingView } from './mapping';

// <mc-map-entities>: the mapping step on an item that is already saved. Fires mc-map-apply { data } or mc-map-cancel; saves nothing itself.

@customElement('mc-map-entities')
export class MapEntities extends LitElement {
  /** The saved item's data; read again from storage, so only whole placeholder ids in it are ever replaced. */
  @property({ attribute: false }) value: unknown;
  @state() private _map: Record<string, string> = {};

  protected createRenderRoot(): HTMLElement {
    return this;
  }

  firstUpdated(): void {
    this.querySelector<HTMLElement>('input, button')?.focus();
  }

  private _cancel = (): void => void this.dispatchEvent(new CustomEvent('mc-map-cancel', { bubbles: true, composed: true }));

  render(): TemplateResult {
    const found = findPlaceholders(this.value);
    const chosen = Object.values(this._map).some((v) => v !== '');
    const ok = chosen && Object.values(this._map).every(isMappable);
    const apply = (): void => void this.dispatchEvent(new CustomEvent('mc-map-apply', { bubbles: true, composed: true, detail: { data: applyMapping(this.value, this._map) } }));
    return html`<div @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && (e.stopPropagation(), this._cancel())}>
      ${found.length ? mappingView(found, this._map, (id, v) => (this._map = { ...this._map, [id]: v }), () => (this._map = {})) : html`<p class="help">${t('share-kit.mapping.nothing-here-needs-mapping')}</p>`}
      <div class="bar">
        ${found.length ? html`<button type="button" class="btn btn-primary btn-sm" ?disabled=${!ok} @click=${apply}>${t('share-kit.mapping.save-mapping')}</button>` : nothing}
        <button type="button" class="btn btn-text btn-sm" @click=${this._cancel}>${t('share-kit.mapping.cancel')}</button>
      </div>
    </div>`;
  }
}
