import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import { animationStyles } from '../../css/animations';
import { resolveAnimations, type FxLayer, type ResolvedAnimations } from '../../utils/animation';
import { intensityLabel } from '../../utils/animation-presets';
import type { DesignConfig, HomeAssistant } from '../../types';
import { compileAnimationDoc, easingCss } from '../compile';
import { ANIMATION_CAPS, PARTICLE_DIRECTIONS, type AnimationDoc, type ParticleDirection, type ParticleShape, type ParticlesSpec } from '../model';
import {
  COMMON_EMOJI,
  DIRECTION_LABELS,
  LIMITS,
  SHAPE_DEFAULTS,
  SHAPE_SOURCES,
  basePreset,
  convertPresetParticles,
  emojiError,
  fromDocColor,
  isEntityDocColor,
  limitNumber,
  patchParticles,
  presetIntensity,
  presetKind,
  shapeSource,
  sizeRange,
  spreadLabel,
  svgError,
  toDocColor,
  validIcon,
  withPresetIntensity,
  withShape,
  type ShapeSource,
} from './particles-utils';

/**
 * The particle layers of `anim`, as the card renders them (card-decorations.ts renderAnimFx). The
 * studio bundle must not define the card's elements: mc-ring / mc-seasonal are used by tag only
 * (the card bundle, loaded first, defines them).
 */
function renderFx(anim: ResolvedAnimations): TemplateResult {
  const symbol = (s: FxLayer['symbol']) => (!s ? nothing : 'icon' in s ? html`<ha-icon .icon=${s.icon}></ha-icon>` : s.text);
  return html`${anim.fx.map((l) =>
    l.seasonal
      ? html`<mc-seasonal class="mc-anim-seasonal" data-fx=${l.preset} .scenes=${l.seasonal.scenes} .intensity=${l.seasonal.intensity} .seed=${`pv|${l.preset}`}></mc-seasonal>`
      : l.ring
        ? html`<mc-ring class="mc-anim-ring" data-fx=${l.preset} style=${l.style} .ring=${l.ring}></mc-ring>`
        : html`<span class="mc-anim-fx" data-fx=${l.preset} ?data-front=${l.front} style=${l.style} aria-hidden="true">${l.particles.map(
            (p) => html`<i style="--mc-anim-x: ${p.x}%; --mc-anim-phase: ${p.phase}; --mc-anim-k: ${p.k}${p.style ? `; ${p.style}` : ''}">${symbol(l.symbol)}</i>`,
          )}</span>`,
  )}`;
}

/** Colours offered by "Add colour", in turn (one not in the list yet). */
const NEW_COLORS = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ec4899', '#ffffff', '#f97316', '#8b5cf6'];

export interface DocChangeDetail {
  doc: AnimationDoc;
  label: string;
  transient?: boolean;
}

/**
 * The particle designer of the animation studio (contract: .superpowers/sdd/anim-studio/
 * editor-contract.md): what each particle is (a dot, an icon, an emoji or an own SVG), how many and
 * how they move (direction, speed, spread, gravity, spin), their size range, colours, fade and
 * layer, with a live mini preview on the card's own particle layer. A document based on a built-in
 * preset (particles.preset) shows that preset and its parameter, and can be converted to custom
 * particles. Never mutates `.doc`: every edit is one `doc-change` { doc, label } (text and the
 * gravity slider send transient changes while editing, then one final change).
 */
@customElement('mc-anim-particles-editor')
export class AnimParticlesEditor extends LitElement {
  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;
  /** 0-1 scrub position (unused: particles loop on their own). */
  @property({ attribute: false }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The last shape of each source, so switching back restores it. */
  @state() private _shapes: Partial<Record<ShapeSource, ParticleShape>> = {};
  /** Text being edited that the model does not accept yet (with its error). */
  @state() private _svgDraft?: string;
  @state() private _emojiDraft?: string;
  /** Selected colour chip (its picker is open under the chips). */
  @state() private _color = -1;
  @state() private _paused = false;

  /** A transient edit is open (text, slider): its final change still has to be sent. */
  private _open?: { doc: AnimationDoc; label: string };

  static styles = [
    editorSystem,
    animationStyles,
    css`
      :host {
        display: block;
        container-type: inline-size;
        color: var(--mc-text);
      }
      :host([disabled]) .form {
        opacity: 0.55;
      }
      .wrap {
        display: grid;
        gap: 20px;
      }
      .form {
        display: grid;
        gap: 0;
        min-width: 0;
        container: form / inline-size;
      }
      .form > .group {
        padding-bottom: 20px;
      }
      .form > .group:last-child {
        padding-bottom: 0;
      }
      .group-head h3 {
        color: var(--mc-text);
      }

      /* ── preview ── */
      .preview {
        display: grid;
        gap: 6px;
      }
      .stage {
        position: relative;
        height: 128px;
        border-radius: var(--mc-radius-lg);
        border: 1px solid var(--mc-divider);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 14px 14px;
        display: grid;
        place-items: center;
        overflow: hidden;
      }
      .stage-module {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 8px 10px;
        border-radius: 12px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
        --mdc-icon-size: 20px;
      }
      .stage-module ha-icon {
        color: var(--mc-text-2);
      }
      .stage mc-seasonal {
        z-index: -1;
        pointer-events: none;
      }
      .stage[data-paused] .mc-anim-fx > i {
        animation-play-state: paused;
      }
      .preview-foot {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        min-width: 0;
      }
      .preview-foot .sum {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .reduced-note {
        display: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .reduced-note {
          display: block;
        }
      }

      /* ── shape ── */
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 4px;
      }
      .emoji-grid button {
        height: 36px;
        min-width: 0;
        padding: 0;
        border: 1px solid transparent;
        border-radius: var(--mc-radius);
        background: transparent;
        font-size: 1.15rem;
        line-height: 1;
        transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
      }
      .emoji-grid button:hover {
        background: var(--mc-surface-2);
      }
      .emoji-grid button[aria-pressed='true'] {
        border-color: color-mix(in srgb, var(--mc-accent) 55%, transparent);
        background: var(--mc-accent-tint);
      }
      .emoji-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .emoji-row .input {
        flex: 1;
        min-width: 0;
        font-size: 1rem;
      }
      .emoji-big {
        flex: none;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        font-size: 1.35rem;
      }
      .svg-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 56px;
        gap: 8px;
        align-items: start;
      }
      .svg-thumb {
        width: 56px;
        height: 56px;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        display: grid;
        place-items: center;
      }
      .svg-thumb > span {
        width: 32px;
        height: 32px;
        background: var(--mc-text);
      }
      textarea.input[aria-invalid='true'],
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }

      /* ── direction tiles ── */
      .dirs {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .dir {
        display: grid;
        gap: 4px;
        justify-items: center;
        padding: 6px 4px 6px;
        min-width: 0;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.75rem;
        font-weight: 500;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .dir:hover {
        border-color: var(--mc-field-border);
        color: var(--mc-text);
      }
      .dir[aria-checked='true'] {
        border-color: var(--mc-accent);
        box-shadow: inset 0 0 0 1px var(--mc-accent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .dir-pv {
        position: relative;
        width: 100%;
        height: 34px;
        overflow: hidden;
        border-radius: 6px;
        background: var(--mc-surface-2);
      }
      .dir[aria-checked='true'] .dir-pv {
        background: color-mix(in srgb, var(--mc-surface) 70%, transparent);
      }
      .dir-pv i {
        position: absolute;
        width: 5px;
        height: 5px;
        margin: -2.5px 0 0 -2.5px;
        border-radius: 50%;
        background: currentColor;
        animation: var(--a) 1.8s linear infinite;
        animation-delay: calc(var(--n) * -0.6s);
      }
      .dir-pv i:nth-child(1) { --n: 0; }
      .dir-pv i:nth-child(2) { --n: 1; }
      .dir-pv i:nth-child(3) { --n: 2; }
      .dir-pv.fall i, .dir-pv.rise i { left: calc(25% + var(--n) * 25%); }
      .dir-pv.fall i { --a: pv-fall; top: 0; }
      .dir-pv.rise i { --a: pv-rise; top: 0; }
      .dir-pv.drift i { --a: pv-drift; left: 0; top: calc(30% + var(--n) * 20%); animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.burst i, .dir-pv.orbit i, .dir-pv.spiral i { left: 50%; top: 50%; }
      .dir-pv.burst i { --a: pv-burst; animation-delay: calc(var(--n) * -0.15s); animation-timing-function: ease-out; }
      .dir-pv.orbit i { --a: pv-orbit; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.spiral i { --a: pv-spiral; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      @keyframes pv-fall {
        from { translate: 0 -4px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 38px; opacity: 0; }
      }
      @keyframes pv-rise {
        from { translate: 0 38px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 -4px; opacity: 0; }
      }
      @keyframes pv-drift {
        from { translate: -4px 0; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 80px 0; opacity: 0; }
      }
      @keyframes pv-burst {
        from { transform: rotate(calc(var(--n) * 120deg)) translateY(0); opacity: 0; }
        10%, 60% { opacity: 1; }
        to { transform: rotate(calc(var(--n) * 120deg)) translateY(-15px); opacity: 0; }
      }
      @keyframes pv-orbit {
        from { transform: rotate(0deg) translateY(-11px); }
        to { transform: rotate(360deg) translateY(-11px); }
      }
      @keyframes pv-spiral {
        from { transform: rotate(0deg) translateY(0); opacity: 0; }
        25%, 75% { opacity: 1; }
        to { transform: rotate(540deg) translateY(-15px); opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        .dir-pv i {
          animation-play-state: paused;
        }
      }

      /* ── numbers ── */
      .pair {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .sub-lbl {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        margin-bottom: 4px;
      }
      .slider {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        min-height: 32px;
      }
      .slider input[type='range'] {
        width: 100%;
        margin: 0;
        accent-color: var(--mc-accent-fill);
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }

      /* ── colours ── */
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .cchip {
        position: relative;
        width: 32px;
        height: 32px;
        padding: 3px;
        border-radius: 50%;
        border: 1px solid var(--mc-field-border);
        background: var(--mc-surface);
        display: grid;
        place-items: center;
      }
      .cchip > span {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc-text) 18%, transparent);
      }
      .cchip > ha-icon.ent {
        position: absolute;
        --mdc-icon-size: 14px;
        color: var(--mc-surface);
      }
      .cchip[aria-pressed='true'] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .cchip.add {
        border-style: dashed;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .cchip.add:hover:not(:disabled) {
        color: var(--mc-text);
        border-color: var(--mc-text-2);
      }
      .cchip.add:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .color-edit {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .color-edit-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .color-edit-head > span {
        flex: 1;
      }
      .color-edit-head .icon-btn {
        margin: -4px -6px -4px 0;
      }

      /* ── preset-based ── */
      .preset-card {
        display: grid;
        gap: 12px;
      }
      .preset-name {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .preset-name .tile {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: var(--mc-radius);
        display: grid;
        place-items: center;
        background: var(--mc-surface-2);
        color: var(--mc-text-2);
        --mdc-icon-size: 20px;
      }
      .preset-name .txt {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .preset-name strong {
        font-size: 0.875rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preset-name .kind {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .convert {
        justify-self: start;
      }

      /* the wide panel: preview beside the fields */
      @container (min-width: 640px) {
        .wrap {
          grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
          align-items: start;
          gap: 24px;
        }
        .preview {
          position: sticky;
          top: 0;
        }
        .stage {
          height: 180px;
        }
      }
      /* a wide form (the bottom panel): the direction tiles in one row */
      @container form (min-width: 480px) {
        .dirs {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
      }
    `,
  ];

  // ── events ──

  private _emit(doc: AnimationDoc, label: string, transient = false): void {
    if (this.disabled) return;
    if (transient) this._open = { doc, label };
    else this._open = undefined;
    const detail: DocChangeDetail = transient ? { doc, label, transient: true } : { doc, label };
    this.dispatchEvent(new CustomEvent<DocChangeDetail>('doc-change', { detail, bubbles: true, composed: true }));
  }

  /** Close an open transient edit with its final change (the last accepted document). */
  private _settle(): void {
    if (this._open) this._emit(this._open.doc, this._open.label);
  }

  private get _p(): ParticlesSpec | undefined {
    return this.doc?.kind === 'particles' ? this.doc.particles : undefined;
  }

  private _patch(patch: Partial<ParticlesSpec>, label: string, transient = false): void {
    if (!this.doc) return;
    this._emit(patchParticles(this.doc, patch), label, transient);
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('doc')) {
      const shape = this._p?.shape;
      if (shape) this._shapes = { ...this._shapes, [shapeSource(shape)]: shape };
      const n = this._p?.colors.length ?? 0;
      if (this._color >= n) this._color = n - 1;
      // a document from outside (undo, another document): drop drafts of the old one
      const prev = changed.get('doc') as AnimationDoc | undefined;
      if (prev && prev.id !== this.doc?.id) {
        this._svgDraft = undefined;
        this._emojiDraft = undefined;
        this._shapes = shape ? { [shapeSource(shape)]: shape } : {};
        this._color = -1;
      }
    }
  }

  // ── preview ──

  /** The particle layer the card would render for this document (always looping here). */
  private _preview(): { anim?: ResolvedAnimations; css: string } {
    const doc = this.doc;
    const p = this._p;
    if (!doc || !p) return { css: '' };
    if (p.preset) {
      const design = {
        animations: [{ id: 'pv', preset: p.preset, intensity: p.intensity, duration: `${doc.duration}s`, easing: doc.easing, iterations: 'infinite', direction: doc.direction }],
      } as unknown as DesignConfig;
      return { anim: resolveAnimations(design), css: '' };
    }
    const c = compileAnimationDoc(doc);
    if (!c.layer || !c.name) return { css: '' };
    const cycle = +(doc.duration / c.layer.speed).toFixed(3);
    const timing = `${c.name} ${cycle}s ${easingCss(doc.easing)} 0s infinite ${doc.direction ?? 'normal'}`;
    return {
      css: c.css,
      anim: {
        style: '',
        fx: [
          {
            preset: c.name,
            front: c.layer.front,
            style: `--mc-fx-anim: ${timing}; --mc-fx-dur: ${cycle}s; --mc-fx-delay: 0s`,
            particles: c.layer.particles,
            ...(c.layer.symbol ? { symbol: c.layer.symbol } : {}),
          },
        ],
      },
    };
  }

  private _previewCss = '';

  protected updated(): void {
    // the compiled rules live in this shadow root only (no shared sheet: the editor has no global state)
    const el = this.renderRoot.querySelector<HTMLStyleElement>('style[data-pv]');
    if (el && el.textContent !== this._previewCss) el.textContent = this._previewCss;
  }

  private _renderPreview(): TemplateResult {
    const { anim, css: rules } = this._preview();
    this._previewCss = rules;
    const p = this._p!;
    const preset = basePreset(this.doc!);
    const sum = p.preset
      ? `${preset?.name ?? p.preset} · ${this.doc!.duration} s`
      : `${p.count} ${p.count === 1 ? 'particle' : 'particles'} · ${DIRECTION_LABELS[p.direction].toLowerCase()} · ${+(this.doc!.duration / p.speed).toFixed(2)} s per cycle`;
    return html`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>Living room</span></div>
        ${anim ? renderFx(anim) : nothing}
      </div>
      <div class="preview-foot">
        <span class="sum">${sum}</span>
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused ? 'true' : 'false'}
          aria-label="Pause preview"
          title=${this._paused ? 'Play preview' : 'Pause preview'}
          @click=${() => (this._paused = !this._paused)}
        >
          <ha-icon icon=${this._paused ? 'mdi:play' : 'mdi:pause'}></ha-icon>
        </button>
      </div>
      <p class="help reduced-note">Reduced motion is on, so the preview stays still.</p>
    </div>`;
  }

  // ── shape ──

  private _pickSource(src: ShapeSource): void {
    const p = this._p;
    if (!p || shapeSource(p.shape) === src) return;
    this._svgDraft = undefined;
    this._emojiDraft = undefined;
    const shape = src === 'dot' ? undefined : (this._shapes[src] ?? SHAPE_DEFAULTS[src]);
    this._emit(withShape(this.doc!, shape), src === 'dot' ? 'Use dots' : `Use ${src === 'svg' ? 'an own SVG' : `an ${src}`}`);
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>(`.shape-seg [data-src="${src}"]`)?.focus());
  }

  private _radioKeys(e: KeyboardEvent, ids: readonly string[], current: string, pick: (id: string) => void, grid = 0): void {
    const i = ids.indexOf(current);
    let j: number;
    if (e.key === 'ArrowRight') j = i + 1;
    else if (e.key === 'ArrowLeft') j = i - 1;
    else if (e.key === 'ArrowDown') j = i + (grid || 1);
    else if (e.key === 'ArrowUp') j = i - (grid || 1);
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = ids.length - 1;
    else return;
    e.preventDefault();
    j = (j + ids.length) % ids.length;
    pick(ids[j]);
  }

  private _renderShape(p: ParticlesSpec): TemplateResult {
    const src = shapeSource(p.shape);
    return html`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">Shape</h3></div>
      <div
        class="seg full shape-seg"
        role="radiogroup"
        aria-label="Particle shape"
        @keydown=${(e: KeyboardEvent) => this._radioKeys(e, SHAPE_SOURCES.map((s) => s.id), src, (id) => this._pickSource(id as ShapeSource))}
      >
        ${SHAPE_SOURCES.map(
          (s) => html`<button
            type="button"
            role="radio"
            data-src=${s.id}
            aria-checked=${s.id === src ? 'true' : 'false'}
            tabindex=${s.id === src ? 0 : -1}
            @click=${() => this._pickSource(s.id)}
          >
            <ha-icon icon=${s.icon}></ha-icon>${s.label}
          </button>`,
        )}
      </div>
      ${src === 'icon' ? this._renderIcon(p) : src === 'emoji' ? this._renderEmoji(p) : src === 'svg' ? this._renderSvg(p) : html`<p class="help">Round dots in the particle colours.</p>`}
    </section>`;
  }

  private _renderIcon(p: ParticlesSpec): TemplateResult {
    const value = p.shape && 'icon' in p.shape ? p.shape.icon : '';
    return html`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">Icon</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${value}
        label="Particle icon"
        aria-labelledby="l-icon"
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          const v = String(e.detail.value ?? '').trim();
          if (validIcon(v) && v !== value) this._emit(withShape(this.doc!, { icon: v }), 'Change icon');
        }}
      ></mc-icon-picker>
    </div>`;
  }

  private _renderEmoji(p: ParticlesSpec): TemplateResult {
    const value = p.shape && 'emoji' in p.shape ? p.shape.emoji : '';
    const text = this._emojiDraft ?? value;
    const err = this._emojiDraft !== undefined ? emojiError(this._emojiDraft) : undefined;
    const set = (v: string, label: string, transient: boolean) => {
      if (!emojiError(v) && v.trim() !== this._lastEmoji()) this._emit(withShape(this.doc!, { emoji: v.trim() }), label, transient);
    };
    return html`<div class="field">
      <div class="field-head"><label for="f-emoji">Emoji or symbol</label></div>
      <div class="emoji-row">
        <span class="emoji-big" aria-hidden="true">${value}</span>
        <input
          id="f-emoji"
          class="input"
          type="text"
          maxlength="24"
          autocomplete="off"
          .value=${text}
          aria-invalid=${err ? 'true' : 'false'}
          aria-describedby=${err ? 'e-emoji' : nothing}
          @input=${(e: InputEvent) => {
            const v = (e.target as HTMLInputElement).value;
            this._emojiDraft = v;
            set(v, 'Change emoji', true);
          }}
          @change=${() => {
            if (this._emojiDraft !== undefined && !emojiError(this._emojiDraft)) this._emojiDraft = undefined;
            this._settle();
          }}
        />
      </div>
      ${err ? html`<p class="help error" id="e-emoji" role="alert">${err}</p>` : nothing}
      <div class="emoji-grid" role="group" aria-label="Common emoji">
        ${COMMON_EMOJI.map(
          (em) => html`<button
            type="button"
            aria-pressed=${em === value ? 'true' : 'false'}
            aria-label=${`Use ${em}`}
            @click=${() => {
              this._emojiDraft = undefined;
              if (em !== value) this._emit(withShape(this.doc!, { emoji: em }), 'Change emoji');
            }}
          >
            ${em}
          </button>`,
        )}
      </div>
    </div>`;
  }

  private _lastEmoji(): string {
    const s = this._p?.shape;
    return s && 'emoji' in s ? s.emoji : '';
  }

  private _renderSvg(p: ParticlesSpec): TemplateResult {
    const value = p.shape && 'svg' in p.shape ? p.shape.svg : '';
    const text = this._svgDraft ?? value;
    const err = this._svgDraft !== undefined ? svgError(this._svgDraft) : undefined;
    const c = compileAnimationDoc(this.doc!);
    const mask = /mask: (url\("[^"]*"\))/.exec(c.css)?.[1];
    return html`<div class="field">
      <div class="field-head"><label for="f-svg">Own SVG</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${text}
          aria-invalid=${err ? 'true' : 'false'}
          aria-describedby=${err ? 'e-svg h-svg' : 'h-svg'}
          @input=${(e: InputEvent) => {
            const v = (e.target as HTMLTextAreaElement).value;
            this._svgDraft = v;
            if (!svgError(v) && v !== value) this._emit(withShape(this.doc!, { svg: v }), 'Edit SVG', true);
          }}
          @change=${() => {
            if (this._svgDraft !== undefined && !svgError(this._svgDraft)) this._svgDraft = undefined;
            this._settle();
          }}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title="The shape as a mask">
          ${mask ? html`<span style=${`-webkit-mask: ${mask} center / contain no-repeat; mask: ${mask} center / contain no-repeat;`}></span>` : nothing}
        </span>
      </div>
      ${err ? html`<p class="help error" id="e-svg" role="alert">${err}</p>` : nothing}
      <p class="help" id="h-svg">Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.</p>
    </div>`;
  }

  // ── movement ──

  private _pickDirection(d: ParticleDirection, focus = false): void {
    if (this._p?.direction !== d) this._patch({ direction: d }, 'Change direction');
    if (focus) void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>(`.dir[data-dir="${d}"]`)?.focus());
  }

  private _number(key: 'count' | 'speed', id: string, value: number, label: string): TemplateResult {
    const l = LIMITS[key];
    return html`<input
      id=${id}
      class="input"
      type="number"
      inputmode="decimal"
      min=${l.min}
      max=${l.max}
      step=${key === 'speed' ? 0.1 : 1}
      .value=${String(value)}
      @change=${(e: Event) => {
        const input = e.target as HTMLInputElement;
        const n = limitNumber(key, input.value);
        if (n === undefined || n === value) {
          input.value = String(value);
          return;
        }
        input.value = String(n);
        this._patch({ [key]: n }, label);
      }}
    />`;
  }

  private _unit(key: 'spin' | 'spread', id: string, value: number, unit: string, label: string, def: number): TemplateResult {
    return html`<mc-unit-field
      .inputId=${id}
      .value=${`${value}${unit}`}
      .units=${[unit]}
      noCustom
      .label=${label}
      ?disabled=${this.disabled}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        const raw = String(e.detail.value ?? '');
        const n = raw === '' ? def : limitNumber(key, raw);
        if (n === undefined) {
          (e.target as { revert?: () => void }).revert?.();
          return;
        }
        if (n !== value) this._patch({ [key]: n }, label);
        else (e.target as { revert?: () => void }).revert?.();
      }}
    ></mc-unit-field>`;
  }

  private _renderMovement(p: ParticlesSpec): TemplateResult {
    const g = p.gravity;
    const gText = g === 0 ? 'None' : `${Math.abs(g).toFixed(1)} ${g > 0 ? 'down' : 'up'}`;
    return html`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">Movement</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">Direction</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${(e: KeyboardEvent) => this._radioKeys(e, PARTICLE_DIRECTIONS, p.direction, (id) => this._pickDirection(id as ParticleDirection, true), 3)}
        >
          ${PARTICLE_DIRECTIONS.map(
            (d) => html`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${d}
              aria-checked=${d === p.direction ? 'true' : 'false'}
              tabindex=${d === p.direction ? 0 : -1}
              @click=${() => this._pickDirection(d)}
            >
              <span class="dir-pv ${d}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${DIRECTION_LABELS[d]}</span>
            </button>`,
          )}
        </div>
      </div>
      <div class="pair">
        <div class="field">
          <div class="field-head"><label for="f-speed">Speed (×)</label></div>
          ${this._number('speed', 'f-speed', p.speed, 'Change speed')}
        </div>
        <div class="field">
          <div class="field-head"><label for="f-spread">${spreadLabel(p.direction)}</label></div>
          ${this._unit('spread', 'f-spread', p.spread, '%', 'Change spread', 100)}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gravity">Gravity</label><span class="val">${gText}</span></div>
        <div class="slider">
          <span aria-hidden="true">Up</span>
          <input
            id="f-gravity"
            type="range"
            min=${LIMITS.gravity.min}
            max=${LIMITS.gravity.max}
            step=${LIMITS.gravity.step}
            .value=${String(g)}
            aria-valuetext=${gText}
            @input=${(e: Event) => {
              const n = limitNumber('gravity', (e.target as HTMLInputElement).value);
              if (n !== undefined && n !== this._p?.gravity) this._patch({ gravity: n }, 'Change gravity', true);
            }}
            @change=${() => this._settle()}
          />
          <span aria-hidden="true">Down</span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-spin">Spin per cycle</label></div>
        ${this._unit('spin', 'f-spin', p.spin, 'deg', 'Change spin', 0)}
        <p class="help">Every other particle turns the other way.</p>
      </div>
    </section>`;
  }

  // ── look ──

  private _setSize(end: 0 | 1, raw: string, el: HTMLElement): void {
    const p = this._p!;
    const n = raw === '' ? undefined : parseFloat(raw);
    if (n === undefined || !Number.isFinite(n)) {
      (el as unknown as { revert?: () => void }).revert?.();
      return;
    }
    const size = sizeRange(p.size, end, n);
    if (size[0] === p.size[0] && size[1] === p.size[1]) (el as unknown as { revert?: () => void }).revert?.();
    else this._patch({ size }, 'Change size');
  }

  private _renderLook(p: ParticlesSpec): TemplateResult {
    return html`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">Look</h3></div>
      <div class="pair">
        <div class="field">
          <div class="field-head"><label for="f-count">Count</label></div>
          ${this._number('count', 'f-count', p.count, 'Change count')}
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">Layer</span></div>
          <div
            class="seg full layer-seg"
            role="radiogroup"
            aria-label="Layer"
            @keydown=${(e: KeyboardEvent) => this._radioKeys(e, ['back', 'front'], p.layer, (id) => this._pickLayer(id as ParticlesSpec['layer'], true))}
          >
            ${(['back', 'front'] as const).map(
              (l) => html`<button
                type="button"
                role="radio"
                data-layer=${l}
                aria-checked=${p.layer === l ? 'true' : 'false'}
                tabindex=${p.layer === l ? 0 : -1}
                title=${l === 'back' ? 'Behind the content' : 'Over the content'}
                @click=${() => this._pickLayer(l)}
              >
                ${l === 'back' ? 'Back' : 'Front'}
              </button>`,
            )}
          </div>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">Size</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${([0, 1] as const).map(
            (end) => html`<div>
              <label class="sub-lbl" for=${`f-size-${end}`}>${end === 0 ? 'Smallest' : 'Largest'}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${end}`}
                .value=${`${p.size[end]}px`}
                .units=${['px']}
                noCustom
                .label=${end === 0 ? 'Smallest size' : 'Largest size'}
                ?disabled=${this.disabled}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._setSize(end, String(e.detail.value ?? ''), e.target as HTMLElement);
                }}
              ></mc-unit-field>
            </div>`,
          )}
        </div>
      </div>
      ${this._renderColors(p)}
      <div class="switch-row">
        <span class="txt" id="l-fade">Fade in and out<p class="help">Particles appear and vanish softly.</p></span>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${p.fade ? 'true' : 'false'}
          @click=${() => this._patch({ fade: !p.fade }, p.fade ? 'Turn fade off' : 'Turn fade on')}
        ></button>
      </div>
    </section>`;
  }

  private _pickLayer(l: ParticlesSpec['layer'], focus = false): void {
    if (this._p?.layer !== l) this._patch({ layer: l }, l === 'front' ? 'Particles in front' : 'Particles behind');
    if (focus) void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>(`.layer-seg [data-layer="${l}"]`)?.focus());
  }

  private _addColor(): void {
    const p = this._p!;
    if (p.colors.length >= ANIMATION_CAPS.colors) return;
    const next = NEW_COLORS.find((c) => !p.colors.includes(c)) ?? NEW_COLORS[p.colors.length % NEW_COLORS.length];
    this._color = p.colors.length;
    this._patch({ colors: [...p.colors, next] }, 'Add colour');
  }

  private _removeColor(i: number): void {
    const p = this._p!;
    const colors = p.colors.filter((_, j) => j !== i);
    this._color = colors.length ? Math.min(i, colors.length - 1) : -1;
    this._patch({ colors }, 'Remove colour');
    void this.updateComplete.then(() =>
      (this.renderRoot.querySelector<HTMLButtonElement>(`.cchip[data-i="${this._color}"]`) ?? this.renderRoot.querySelector<HTMLButtonElement>('.cchip.add'))?.focus(),
    );
  }

  private _renderColors(p: ParticlesSpec): TemplateResult {
    const sel = this._color >= 0 && this._color < p.colors.length ? this._color : -1;
    const full = p.colors.length >= ANIMATION_CAPS.colors;
    return html`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">Colours</span>
        ${p.colors.length ? html`<span class="val">${p.colors.length} of ${ANIMATION_CAPS.colors}</span>` : nothing}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${p.colors.map((c, i) => {
          const entity = isEntityDocColor(c);
          return html`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i === sel ? 'true' : 'false'}
            aria-label=${`Colour ${i + 1}: ${entity ? 'entity color' : c}`}
            title=${entity ? 'Entity color' : c}
            @click=${() => (this._color = i === sel ? -1 : i)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this._removeColor(i);
              }
            }}
          >
            <span style=${`background: ${entity ? 'var(--mc-text-2)' : c}`}></span>
            ${entity ? html`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>` : nothing}
          </button>`;
        })}
        <button type="button" class="cchip add" aria-label="Add colour" title=${full ? `At most ${ANIMATION_CAPS.colors} colours` : 'Add colour'} ?disabled=${full} @click=${() => this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${sel >= 0
        ? html`<div class="color-edit">
            <div class="color-edit-head">
              <span>Colour ${sel + 1}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${`Remove colour ${sel + 1}`}
                title="Remove colour"
                @click=${() => this._removeColor(sel)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${`Colour ${sel + 1}`}
              .value=${fromDocColor(p.colors[sel])}
              @value-changed=${(e: CustomEvent) => {
                e.stopPropagation();
                const v = toDocColor(String(e.detail.value ?? ''));
                if (!v || v === p.colors[sel]) return;
                const colors = [...p.colors];
                colors[sel] = v;
                this._patch({ colors }, 'Change colour');
              }}
            ></mc-color-picker>
          </div>`
        : html`<p class="help">${p.colors.length ? 'Particles take the colours in turn. Pick one to change it.' : 'No colours: particles use the animation colour.'}</p>`}
    </div>`;
  }

  // ── preset-based ──

  private _renderPreset(p: ParticlesSpec): TemplateResult {
    const preset = basePreset(this.doc!);
    const value = preset ? presetIntensity(this.doc!, preset) : undefined;
    return html`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${preset?.name ?? p.preset}</strong>
          <span class="kind">${preset ? `Based on a built-in ${presetKind(preset).toLowerCase()}` : 'Unknown preset'}</span>
        </span>
      </div>
      ${preset
        ? html`<div class="field">
            <div class="field-head"><label for="f-intensity">${intensityLabel(preset)}</label></div>
            <input
              id="f-intensity"
              class="input"
              type="number"
              inputmode="decimal"
              min=${preset.intensity.min}
              max=${preset.intensity.max}
              step=${preset.intensity.step ?? 1}
              placeholder=${String(preset.defaults.intensity)}
              .value=${p.intensity === undefined ? '' : String(value)}
              @change=${(e: Event) => {
                const raw = (e.target as HTMLInputElement).value;
                const next = withPresetIntensity(this.doc!, preset, raw === '' ? undefined : Number(raw));
                if (next.particles!.intensity !== p.intensity) this._emit(next, `Change ${preset.intensity.label.toLowerCase()}`);
                else (e.target as HTMLInputElement).value = p.intensity === undefined ? '' : String(p.intensity);
              }}
            />
            <p class="help">Between ${preset.intensity.min} and ${preset.intensity.max}; empty uses ${preset.defaults.intensity}. Timing and colour come from the animation settings.</p>
          </div>`
        : html`<p class="help error">This preset is not available in this version of Magic Card.</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>Convert to custom particles
      </button>
      <p class="help">
        Swaps the preset for your own particles: shape, direction, size and colours become editable.
        ${preset && preset.particles === 'count' && !preset.ring && !preset.seasonal ? 'The look changes a little.' : "They replace the preset's look."}
      </p>
    </section>`;
  }

  private _convert = (): void => {
    if (!this.doc) return;
    this._emit(convertPresetParticles(this.doc), 'Convert to custom particles');
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>('.shape-seg [aria-checked="true"]')?.focus());
  };

  // ── render ──

  protected render(): TemplateResult {
    const p = this._p;
    if (!this.doc || !p) {
      return html`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>Open a particles animation to design its particles.</p></div>`;
    }
    return html`<style data-pv></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${p.preset ? this._renderPreset(p) : html`${this._renderShape(p)}${this._renderMovement(p)}${this._renderLook(p)}`}
        </div>
      </div>`;
  }

  /** Leaving a text field without a change event (Escape, a re-render) still closes its edit. */
  private _onFocusOut = (e: FocusEvent): void => {
    const t = e.target as HTMLElement;
    if (this._open && (t.id === 'f-svg' || t.id === 'f-emoji' || t.id === 'f-gravity')) this._settle();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-particles-editor': AnimParticlesEditor;
  }
}
