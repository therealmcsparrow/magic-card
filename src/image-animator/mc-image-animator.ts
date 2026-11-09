import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { ImageAnimation } from '../contracts/image-animation';
import { IMAGE_ANIMATOR_SAVED_EVENT, type ImageAnimatorSaved } from '../contracts/image-animator';
import type { HomeAssistant } from '../types';
import { editorSystem } from '../css/editor-stack';
import { presetChoices, renderEffects, renderTargetList, effectLabel, targetName, type PanelProps } from './effects-panel';
import { t } from './i18n';
import { loadImageTools } from './image-loader';
import { startPreview, type Preview } from './preview';
import { saveAnimation } from './save';
import { openSource, type FailReason, type Opened, type Source } from './source';
import { animatorStyles } from './styles';
import { commitTargetId, listTargets, pickTarget, type ImageTarget } from './targets';
import { addEffect, effectAvailability, type EffectKind } from './tracks';

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
  @state() private _target: ImageTarget = { ref: 'element', kind: 'image', generated: false };
  @state() private _targets: ImageTarget[] = [];
  @state() private _presetId = '';
  @state() private _path = '';
  @state() private _message = '';
  private _started?: Promise<void>;
  private _svg?: SVGSVGElement;
  private _preview?: Preview;

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
    this._presetId = presetChoices()[0]?.id ?? '';
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

  disconnectedCallback(): void {
    this._preview?.release();
    this._preview = undefined;
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has('_phase')) this.renderRoot.querySelector<HTMLElement>('h2')?.focus();
    if (this._phase === 'ready' && !this._svg) this._mountCanvas();
  }

  /** Puts the working drawing on the canvas. Its markup was sanitised when the image was opened. */
  private _mountCanvas(): void {
    const stage = this.renderRoot.querySelector<HTMLElement>('.stage');
    const o = this._opened;
    if (!stage || !o) return;
    stage.innerHTML = o.svg;
    const svg = stage.querySelector('svg');
    if (!svg) return;
    this._svg = svg as unknown as SVGSVGElement;
    this._targets = listTargets(this._svg);
    this._replay();
  }

  /** Plays the first clip on the canvas; reduced motion, pause and off-screen are held by the player. */
  private _replay(): void {
    this._preview?.release();
    this._preview = undefined;
    const anim = this._opened?.animation;
    if (this._svg && anim?.clips.length) this._preview = startPreview(this._svg, anim, anim.clips[0].id);
  }

  private _mark(target: ImageTarget): void {
    this._svg?.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
    if (target.element) target.element.setAttribute('data-mc-picked', '');
  }

  private _pick(target: ImageTarget | undefined): void {
    if (!target) return;
    this._target = target;
    this._mark(target);
    this._message = '';
  }

  private _onStageClick(e: Event): void {
    if (!this._svg) return;
    this._pick(pickTarget(this._svg, e.target instanceof Element ? e.target : null));
  }

  private _pickRef(ref: ImageTarget['ref']): void {
    this._pick(this._targets.find((x) => x.ref === ref));
  }

  /** Adds an effect to the picked target. A new id is written into the drawing, the playing styles stay out of the saved markup. */
  private _add(kind: EffectKind): void {
    const o = this._opened;
    const svg = this._svg;
    if (!o || !svg) return;
    const target = this._target;
    let anim: ImageAnimation;
    try {
      anim = addEffect(o.animation, target, kind, { presetId: this._presetId, path: this._path });
    } catch {
      this._message = kind === 'motion-path' ? t('image-animator.mc-image-animator.enter-path-data-for-example-m0-0') : t('image-animator.mc-image-animator.this-effect-could-not-be-added');
      return;
    }
    this._preview?.release();
    this._preview = undefined;
    this._svg?.querySelector('[data-mc-picked]')?.removeAttribute('data-mc-picked');
    if (commitTargetId(target)) {
      this._targets = listTargets(svg);
      this._target = this._targets.find((x) => x.ref === target.ref) ?? target;
    }
    this._opened = { ...o, animation: anim, svg: svg.outerHTML };
    this._mark(this._target);
    this._note = '';
    this._message = t('image-animator.mc-image-animator.added-effect-to-name', { effect: effectLabel(kind), name: targetName(target) });
    this._replay();
  }

  private _panel(): PanelProps | undefined {
    const svg = this._svg;
    if (!svg) return undefined;
    return {
      targets: this._targets,
      target: this._target,
      availability: effectAvailability(svg, this._target),
      presets: presetChoices(),
      presetId: this._presetId,
      path: this._path,
      message: this._message,
      pick: (ref) => this._pickRef(ref),
      add: (kind) => this._add(kind),
      setPreset: (id) => (this._presetId = id),
      setPath: (d) => (this._path = d),
    };
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
    const panel = this._panel();
    return html`<div class="work">
        <div class="canvas">
          <div class="stage" role="img" aria-label=${o.name} @click=${this._onStageClick}></div>
          <div class="saved">
            <span>${t('image-animator.mc-image-animator.as-saved')}</span>
            <mc-svg-image .hass=${this.hass} .ref=${`mcu-image:${o.id}`} .description=${o.name}></mc-svg-image>
          </div>
        </div>
        <div class="side">${panel ? html`${renderTargetList(panel)}${renderEffects(panel)}` : nothing}</div>
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
