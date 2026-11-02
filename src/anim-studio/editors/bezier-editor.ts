import { LitElement, html, css, svg, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { t as tl } from '../../i18n/labels';
import { editorSystem } from '../../css/editor-stack';
import { validEasing } from '../model';
import { BEZIER_PRESETS, bezierOf, clampBezier, easingFromBezier, easingLabel, type Bezier } from './keyframes-utils';
import { t, m, type MessageId } from '../i18n';

/** The plot: x 0-1 across, y from Y_MAX (top) to Y_MIN (bottom) so overshoot stays visible. */
const SIZE = 168;
const PAD = 14;
const Y_MAX = 1.5;
const Y_MIN = -0.5;
const W = SIZE - PAD * 2;
const px = (x: number): number => PAD + x * W;
const py = (y: number): number => PAD + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * W;

const curvePath = (b: Bezier, x0 = px, y0 = py): string => `M${x0(0)} ${y0(0)} C${x0(b[0])} ${y0(b[1])} ${x0(b[2])} ${y0(b[3])} ${x0(1)} ${y0(1)}`;

/** Tile labels that would not fit (the full name is the tile's title). */
const SHORT: Record<string, MessageId> = { 'ease-in-out': m('anim-studio.bezier-editor.in-out') };

/** A small glyph of a curve (preset tiles). */
function glyph(b: Bezier | undefined): TemplateResult {
  const s = 22;
  const gx = (x: number) => 3 + x * (s - 6);
  const gy = (y: number) => s - 3 - y * (s - 6) * 0.82 - 2;
  return html`<svg class="glyph" viewBox="0 0 ${s} ${s}" aria-hidden="true">
    ${b ? svg`<path d=${curvePath(b, gx, gy)}></path>` : svg`<path d="M3 ${s - 5} H${s - 3}" stroke-dasharray="2 2.5"></path>`}
  </svg>`;
}

/**
 * Cubic-bezier easing editor: preset tiles, a curve with two draggable handles (arrows 0.01, Shift 0.1), four numbers and
 * a text field that takes any easing. Empty means Default. Emits `easing-change` { value, transient? }: transient while
 * dragging, one final event on release.
 */
@customElement('mc-anim-bezier-editor')
export class AnimBezierEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .presets {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 6px;
      }
      .preset {
        display: flex;
        align-items: center;
        gap: 5px;
        min-height: 32px;
        padding: 0 6px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.75rem;
        font-weight: 500;
        text-align: start;
        min-width: 0;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .preset span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preset:hover {
        border-color: var(--mc-field-border);
        color: var(--mc-text);
      }
      .preset[aria-checked='true'] {
        border-color: color-mix(in srgb, var(--mc-accent) 55%, transparent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .glyph {
        width: 18px;
        height: 18px;
        flex: none;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.6;
        stroke-linecap: round;
      }
      .body {
        display: grid;
        grid-template-columns: ${SIZE}px minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }
      @container (max-width: 340px) {
        .body {
          grid-template-columns: minmax(0, 1fr);
        }
        .plot {
          width: 100%;
          max-width: 260px;
          justify-self: center;
        }
        .nums {
          width: 100%;
        }
      }
      .wrap {
        container-type: inline-size;
      }
      .plot {
        position: relative;
        width: ${SIZE}px;
        aspect-ratio: 1;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
        direction: ltr; /* x is time, y is progress */
        touch-action: none;
        user-select: none;
      }
      .plot svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .grid line {
        stroke: var(--mc-divider);
        stroke-width: 1;
      }
      .grid rect {
        fill: var(--mc-surface);
        stroke: var(--mc-divider);
      }
      .diag {
        stroke: var(--mc-field-border);
        stroke-dasharray: 3 3;
        fill: none;
      }
      .arm {
        stroke: var(--mc-text-2);
        stroke-width: 1.25;
      }
      .curve {
        fill: none;
        stroke: var(--mc-text);
        stroke-width: 2.5;
        stroke-linecap: round;
      }
      .end {
        fill: var(--mc-text-2);
      }
      .knob {
        position: absolute;
        width: 32px;
        height: 32px;
        margin: -16px 0 0 -16px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        cursor: grab;
        touch-action: none;
      }
      .knob::before {
        content: '';
        position: absolute;
        inset: 9px;
        border-radius: 50%;
        background: var(--mc-surface);
        border: 2.5px solid var(--mc-text);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out;
      }
      .knob:hover::before,
      .knob.dragging::before {
        transform: scale(1.15);
      }
      .knob:focus-visible {
        outline: none;
      }
      .knob:focus-visible::before,
      .knob.dragging::before {
        border-color: var(--mc-accent);
        background: var(--mc-accent-fill);
      }
      .knob.dragging {
        cursor: grabbing;
      }
      .plot[aria-disabled='true'] {
        opacity: 0.55;
      }
      .steps-note {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 16px;
        text-align: center;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .nums {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .num {
        display: grid;
        gap: 4px;
        min-width: 0;
      }
      .num label {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .num .input {
        min-height: 32px;
        padding: 4px 8px;
      }
      .text {
        grid-column: 1 / -1;
      }
      .preview {
        grid-column: 1 / -1;
        position: relative;
        height: 24px;
        border-radius: 9999px;
        background: var(--mc-surface-2);
        direction: ltr; /* the run goes from start to end of time */
        overflow: hidden;
      }
      .preview i {
        position: absolute;
        top: 4px;
        left: 4px; /* physical */
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mc-text-2);
        animation: mc-ease-run 1.6s var(--ease, ease) infinite alternate;
      }
      @keyframes mc-ease-run {
        to {
          left: calc(100% - 20px); /* physical */
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .preview i {
          animation: none;
        }
      }
    `,
  ];

  /** The keyframe's easing (EASINGS id, cubic-bezier() or steps()); empty: the animation's easing. */
  @property({ type: String }) value?: string;
  /** The animation's own easing (what "Default" plays). */
  @property({ type: String }) inherited = 'ease';
  @property({ type: Boolean }) disabled = false;
  /** Visible label prefix for ids / aria. */
  @property({ type: String }) label = '';

  /** The curve while dragging (the value prop catches up through the host). */
  @state() private _drag?: { handle: 0 | 1; bezier: Bezier };
  @state() private _textError = '';

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('value')) this._textError = '';
  }

  /** The curve shown: the value's, else the inherited easing's. */
  private get _bezier(): Bezier | undefined {
    return this._drag?.bezier ?? bezierOf(this.value || this.inherited);
  }

  private _emit(value: string | undefined, transient = false): void {
    this.dispatchEvent(new CustomEvent('easing-change', { bubbles: true, composed: true, detail: transient ? { value, transient } : { value } }));
  }

  private _fromPointer(e: PointerEvent): [number, number] {
    const r = this.renderRoot.querySelector('.plot')!.getBoundingClientRect();
    const scale = r.width / SIZE || 1;
    const x = ((e.clientX - r.left) / scale - PAD) / W;
    const y = Y_MAX - (((e.clientY - r.top) / scale - PAD) / W) * (Y_MAX - Y_MIN);
    return [x, y];
  }

  private _down(e: PointerEvent, handle: 0 | 1): void {
    if (this.disabled || e.button !== 0) return;
    const b = this._bezier ?? [0, 0, 1, 1];
    e.preventDefault();
    (e.currentTarget as HTMLElement).focus();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    this._drag = { handle, bezier: [...b] as Bezier };
  }

  private _move(e: PointerEvent): void {
    if (!this._drag) return;
    const [x, y] = this._fromPointer(e);
    const b = [...this._drag.bezier] as Bezier;
    b[this._drag.handle * 2] = x;
    b[this._drag.handle * 2 + 1] = y;
    this._drag = { ...this._drag, bezier: clampBezier(b) };
    this._emit(easingFromBezier(this._drag.bezier), true);
  }

  private _up(): void {
    if (!this._drag) return;
    const v = easingFromBezier(this._drag.bezier);
    this._drag = undefined;
    this._emit(v);
  }

  private _key(e: KeyboardEvent, handle: 0 | 1): void {
    const dirs: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    const d = dirs[e.key];
    if (!d || this.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const step = e.shiftKey ? 0.1 : 0.01;
    const b = [...(this._bezier ?? [0, 0, 1, 1])] as Bezier;
    b[handle * 2] += d[0] * step;
    b[handle * 2 + 1] += d[1] * step;
    this._emit(easingFromBezier(clampBezier(b)));
  }

  private _num(i: number, raw: string): void {
    const n = Number(raw);
    const b = [...(this._bezier ?? [0, 0, 1, 1])] as Bezier;
    if (raw.trim() === '' || !Number.isFinite(n)) return void this.requestUpdate();
    b[i] = n;
    this._emit(easingFromBezier(clampBezier(b)));
  }

  private _text(input: HTMLInputElement): void {
    const s = input.value.trim();
    if (!s) {
      if (this.value) this._emit(undefined);
      return;
    }
    if (s === (this.value ?? '')) return;
    if (!validEasing(s)) {
      this._textError = t('anim-studio.bezier-editor.use-a-preset-name-cubic-bezier-x1-y1-x2');
      return;
    }
    this._textError = '';
    const b = bezierOf(s);
    this._emit(b && s.startsWith('cubic-bezier') ? easingFromBezier(b) : s);
  }

  protected render(): TemplateResult {
    const b = this._bezier;
    const current = this._drag ? easingFromBezier(this._drag.bezier) : this.value;
    const presetIds = BEZIER_PRESETS.map((p) => p.id);
    const checked = current ? (presetIds.includes(current) ? current : 'custom') : '';
    const curveCss = current ? (bezierOf(current) ? `cubic-bezier(${bezierOf(current)!.join(',')})` : current) : b ? `cubic-bezier(${b.join(',')})` : 'linear';
    return html`
      <div class="presets" role="radiogroup" aria-label=${t('anim-studio.bezier-editor.label-preset', { label: this.label || t('anim-studio.bezier-editor.easing') })}>
        ${[{ id: '', label: t('anim-studio.bezier-editor.default'), bezier: bezierOf(this.inherited) }, ...BEZIER_PRESETS.map((q) => ({ ...q, label: tl(q.label) }))].map(
          (p) => html`<button
            type="button"
            class="preset"
            role="radio"
            data-easing=${p.id || 'default'}
            aria-checked=${checked === p.id ? 'true' : 'false'}
            title=${p.id ? p.label : t("anim-studio.bezier-editor.the-animation-s-easing-easinglabel", { easingLabel: easingLabel(this.inherited).toLowerCase() })}
            ?disabled=${this.disabled}
            @click=${() => this._emit(p.id || undefined)}
          >
            ${glyph(p.bezier)}<span>${SHORT[p.id] !== undefined ? t(SHORT[p.id]) : p.label}</span>
          </button>`,
        )}
      </div>
      <div class="wrap">
        <div class="body">
          <div
            class="plot"
            aria-disabled=${this.disabled ? 'true' : 'false'}
            @pointermove=${this._move}
            @pointerup=${this._up}
            @pointercancel=${this._up}
            @lostpointercapture=${this._up}
          >
            <svg viewBox="0 0 ${SIZE} ${SIZE}" aria-hidden="true">
              <g class="grid">
                <rect x=${px(0)} y=${py(1)} width=${W} height=${py(0) - py(1)} rx="2"></rect>
                ${[0.25, 0.5, 0.75].map((t) => svg`<line x1=${px(t)} x2=${px(t)} y1=${py(1)} y2=${py(0)}></line><line x1=${px(0)} x2=${px(1)} y1=${py(t)} y2=${py(t)}></line>`)}
              </g>
              <path class="diag" d="M${px(0)} ${py(0)} L${px(1)} ${py(1)}"></path>
              ${b
                ? svg`<line class="arm" x1=${px(0)} y1=${py(0)} x2=${px(b[0])} y2=${py(b[1])}></line>
                  <line class="arm" x1=${px(1)} y1=${py(1)} x2=${px(b[2])} y2=${py(b[3])}></line>
                  <path class="curve" d=${curvePath(b)}></path>`
                : nothing}
              <circle class="end" cx=${px(0)} cy=${py(0)} r="3.5"></circle>
              <circle class="end" cx=${px(1)} cy=${py(1)} r="3.5"></circle>
            </svg>
            ${b
              ? ([0, 1] as const).map(
                  (h) => html`<button
                    type="button"
                    class="knob ${this._drag?.handle === h ? 'dragging' : ''}"
                    data-handle=${h}
                    style="left: ${(px(b[h * 2]) / SIZE) * 100}%; top: ${(py(b[h * 2 + 1]) / SIZE) * 100}%"
                    role="slider"
                    aria-label=${h === 0 ? t('anim-studio.bezier-editor.start-handle') : t('anim-studio.bezier-editor.end-handle')}
                    aria-valuemin="-1"
                    aria-valuemax="2"
                    aria-valuenow=${b[h * 2 + 1]}
                    aria-valuetext=${`x ${b[h * 2]}, y ${b[h * 2 + 1]}`}
                    ?disabled=${this.disabled}
                    @pointerdown=${(e: PointerEvent) => this._down(e, h)}
                    @keydown=${(e: KeyboardEvent) => this._key(e, h)}
                  ></button>`,
                )
              : html`<p class="steps-note">${current?.startsWith('steps') ? t('anim-studio.bezier-editor.steps-jump-between-values-there-is-no') : ''}</p>`}
          </div>
          <div class="nums">
            ${(['x1', 'y1', 'x2', 'y2'] as const).map(
              (n, i) => html`<div class="num">
                <label for=${`bz-${n}`}>${n.toUpperCase()}</label>
                <input
                  class="input mono"
                  id=${`bz-${n}`}
                  type="number"
                  step="0.01"
                  min=${i % 2 ? -1 : 0}
                  max=${i % 2 ? 2 : 1}
                  inputmode="decimal"
                  .value=${b ? String(b[i]) : ''}
                  ?disabled=${this.disabled || !b}
                  @change=${(e: Event) => this._num(i, (e.target as HTMLInputElement).value)}
                />
              </div>`,
            )}
            <div class="num text">
              <label for="bz-text">${t('anim-studio.bezier-editor.easing-value')}</label>
              <input
                class="input mono"
                id="bz-text"
                type="text"
                spellcheck="false"
                autocomplete="off"
                placeholder=${t('anim-studio.bezier-editor.default-inherited', { inherited: this.inherited })}
                aria-invalid=${this._textError ? 'true' : 'false'}
                aria-describedby=${this._textError ? 'bz-err' : nothing}
                .value=${current ?? ''}
                ?disabled=${this.disabled}
                @change=${(e: Event) => this._text(e.target as HTMLInputElement)}
                @keydown=${(e: KeyboardEvent) => e.key === 'Enter' && this._text(e.target as HTMLInputElement)}
              />
              ${this._textError ? html`<p class="help error" id="bz-err">${this._textError}</p>` : nothing}
            </div>
            <div class="preview" aria-hidden="true" style="--ease: ${curveCss}"><i></i></div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-bezier-editor': AnimBezierEditor;
  }
}
