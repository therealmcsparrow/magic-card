import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { IMAGE_ANIMATOR_SAVED_EVENT, type ImageAnimatorSaved } from '../contracts/image-animator';
import type { HomeAssistant } from '../types';
import { editorSystem } from '../css/editor-stack';
import { t } from './i18n';
import { loadImageTools } from './image-loader';
import { saveAnimation } from './save';
import { openSource, type FailReason, type Opened, type Source } from './source';
import { animatorStyles } from './styles';

// The image animator window: opens a library image or an upload, shows it playing, and saves it back to the library.
// Fires `mc-image-animator-saved` on `opener` after each confirmed save, and `close` when the window should go.

type Phase = 'opening' | 'ready' | 'failed';

export class McImageAnimator extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) source?: Source;
  /** The element that opened the window; it receives the saved event and the focus again on close. */
  opener?: HTMLElement;
  @state() private _phase: Phase = 'opening';
  @state() private _opened?: Opened;
  @state() private _reason?: FailReason;
  @state() private _saving = false;
  @state() private _note: '' | 'upload' | 'saved' = '';
  private _started?: Promise<void>;

  static styles = [editorSystem, animatorStyles];

  connectedCallback(): void {
    super.connectedCallback();
    this._started ??= this._open();
  }

  /** Memoised: every caller waits for the same open. */
  private async _open(): Promise<void> {
    const source = this.source;
    const hass = this.hass;
    if (!source || !hass) return this._fail('failed');
    const tools = await loadImageTools();
    if (!tools) return this._fail('failed');
    tools.install();
    const r = await openSource(hass, source);
    if (!r.ok) return this._fail(r.reason);
    this._opened = r;
    this._phase = 'ready';
    if (source.kind === 'upload') {
      this._note = 'upload';
      this._announce(r.id);
    }
  }

  private _fail(reason: FailReason): void {
    this._reason = reason;
    this._phase = 'failed';
  }

  private _announce(id: string): void {
    const detail: ImageAnimatorSaved = { id };
    (this.opener ?? this).dispatchEvent(new CustomEvent(IMAGE_ANIMATOR_SAVED_EVENT, { detail, bubbles: true, composed: true }));
  }

  private _close(): void {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private async _save(): Promise<void> {
    const o = this._opened;
    const hass = this.hass;
    if (!o || !hass || this._saving) return;
    this._saving = true;
    this._note = '';
    this._reason = undefined;
    const r = await saveAnimation(hass, { id: o.id, name: o.name, svg: o.svg, viewBox: o.viewBox, bindings: o.bindings, animation: o.animation, baseUpdatedAt: o.updatedAt });
    this._saving = false;
    if (!r.ok) {
      this._reason = r.reason;
      return;
    }
    this._opened = { ...o, updatedAt: r.summary?.updated_at ?? o.updatedAt };
    this._note = 'saved';
    this._announce(o.id);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_phase')) this.renderRoot.querySelector<HTMLElement>('h2')?.focus();
  }

  private _onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...this.renderRoot.querySelectorAll<HTMLElement>('button:not([disabled])')];
    if (!items.length) return;
    const active = this.shadowRoot?.activeElement;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private _problem(reason: FailReason): string {
    switch (reason) {
      case 'missing':
        return t('image-animator.mc-image-animator.this-image-is-not-in-the-library-any');
      case 'too_large':
        return t('image-animator.mc-image-animator.this-image-is-larger-than-the-library-accepts');
      case 'not_svg':
        return t('image-animator.mc-image-animator.this-file-is-not-an-svg-drawing');
      case 'unsafe_markup':
        return t('image-animator.mc-image-animator.this-drawing-contains-markup-that-cannot-be');
      case 'needs_utils':
        return t('image-animator.mc-image-animator.animating-needs-a-newer-magic-card-utils');
      case 'invalid_animation':
        return t('image-animator.mc-image-animator.the-saved-animation-of-this-image-is-not');
      case 'conflict':
        return t('image-animator.mc-image-animator.this-image-was-changed-somewhere-else-close-this');
      default:
        return t('image-animator.mc-image-animator.could-not-reach-magic-card-utils-your');
    }
  }

  private _body(): TemplateResult {
    const o = this._opened;
    if (this._phase === 'opening') return html`<p role="status">${t('image-animator.mc-image-animator.opening-the-image')}</p>`;
    if (this._phase === 'failed' || !o) return html`<p class="problem" role="alert">${this._problem(this._reason ?? 'failed')}</p>`;
    const clips = o.animation?.clips.length ?? 0;
    return html`<div class="preview">
        <mc-svg-image .hass=${this.hass} .ref=${`mcu-image:${o.id}`} .description=${o.name}></mc-svg-image>
      </div>
      <p>${clips ? t('image-animator.mc-image-animator.count-animations', { count: clips }) : t('image-animator.mc-image-animator.this-image-has-no-animations-yet')}</p>`;
  }

  private _status(): TemplateResult | typeof nothing {
    if (this._saving) return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saving')}</p>`;
    if (this._reason && this._phase === 'ready') return html`<p class="status problem" role="alert">${this._problem(this._reason)}</p>`;
    if (this._opened && !this._opened.canSave) return html`<p class="status" role="status">${this._problem('needs_utils')}</p>`;
    if (this._note === 'saved') return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saved')}</p>`;
    if (this._note === 'upload' && this._opened) {
      return html`<p class="status" role="status">${t('image-animator.mc-image-animator.saved-to-the-library-as-name', { name: this._opened.name })}</p>`;
    }
    return html`<p class="status" role="status"></p>`;
  }

  protected render(): TemplateResult {
    const o = this._opened;
    return html`<div class="backdrop" @click=${this._close} aria-hidden="true"></div>
      <div class="window" role="dialog" aria-modal="true" aria-labelledby="title" @keydown=${this._onKey}>
        <header>
          <h2 id="title" tabindex="-1">${o ? t('image-animator.mc-image-animator.animate-name', { name: o.name }) : t('image-animator.mc-image-animator.animate-image')}</h2>
          <button class="btn btn-secondary" type="button" @click=${this._close}>${t('image-animator.mc-image-animator.close')}</button>
        </header>
        <div class="body">${this._body()}</div>
        <footer>
          ${this._status()}
          <button class="btn btn-primary" type="button" ?disabled=${!o?.canSave || this._saving} @click=${this._save}>${t('image-animator.mc-image-animator.save')}</button>
        </footer>
      </div>`;
  }
}
