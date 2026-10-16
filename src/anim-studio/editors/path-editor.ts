import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-system';
import { ANIMATION_CAPS, type AnimationDoc, type PathSpec } from '../model';
import {
  PATH_TEMPLATES,
  parsePath,
  pathBounds,
  reversePath,
  serializePath,
  setClosed,
  smoothAll,
  straightenAll,
  templateCenter,
  templatePath,
  translatePath,
  type EditPath,
  type PathTemplateId,
} from './path-utils';

/*
 * mc-unit-field and mc-color-picker are used by tag only: the card bundle defines them and is
 * always loaded before the studio bundle (editor contract), so this file must not import them.
 */

type Look = NonNullable<PathSpec['particles']>;
type Subject = PathSpec['subject'];

const SUBJECTS: Array<{ value: Subject; label: string; icon: string }> = [
  { value: 'element', label: 'Element', icon: 'mdi:square-rounded-outline' },
  { value: 'icon', label: 'Icon', icon: 'mdi:star-outline' },
  { value: 'particles', label: 'Particles', icon: 'mdi:scatter-plot-outline' },
];

const UNITS: Array<{ value: PathSpec['units']; label: string }> = [
  { value: 'percent', label: '% of size' },
  { value: 'px', label: 'Pixels' },
];

const DEFAULT_LOOK: Look = { count: 3, size: [6, 12], colors: [] };
const DEFAULT_SPEC: PathSpec = { d: '', units: 'percent', follow_rotation: false, subject: 'element' };

const PREVIEW_W = 44;
const PREVIEW_H = 30;
const previews = new Map<string, { d: string; box: string }>();

/** A template's tile preview: its path in a viewBox fitted around it. */
function preview(id: PathTemplateId): { d: string; box: string } {
  let p = previews.get(id);
  if (!p) {
    const d = templatePath(id);
    const b = pathBounds(parsePath(d)) ?? { x: -40, y: -40, w: 80, h: 80 };
    // fit the box to the tile's aspect so every template keeps its own proportions
    const pad = 6;
    let w = b.w + pad * 2;
    let h = b.h + pad * 2;
    const want = PREVIEW_W / PREVIEW_H;
    if (w / h < want) w = h * want;
    else h = w / want;
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    p = { d, box: `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}` };
    previews.set(id, p);
  }
  return p;
}

/**
 * The path motion editor's inspector fields (the drawing happens on the stage, in
 * mc-anim-path-overlay): path templates, smooth / straighten / reverse / close / clear, what moves
 * (element, icon or particles, with the particles' count, size and colours), units and follow
 * rotation. Editor contract: `.doc` is never changed, every edit is one `doc-change` { doc, label }.
 */
@customElement('mc-anim-path-editor')
export class AnimPathEditor extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .ed {
        display: grid;
        gap: 16px;
      }
      .sec {
        display: grid;
        gap: 12px;
      }
      .sec + .sec {
        padding-top: 16px;
        border-top: 1px solid var(--mc-divider);
      }
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
        gap: 8px;
      }
      .tile {
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 4px;
        min-height: 64px;
        padding: 8px 4px 6px;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font: inherit;
        font-size: 0.75rem;
        line-height: 1.3;
        cursor: pointer;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .tile:hover:not(:disabled) {
        background: var(--mc-surface-2);
        border-color: var(--mc-text-2);
        color: var(--mc-text);
      }
      .tile:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .tile:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .tile svg {
        width: ${PREVIEW_W}px;
        height: ${PREVIEW_H}px;
        overflow: visible;
      }
      .tile path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }
      .tile circle {
        fill: currentColor;
      }
      .stats {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .actions .btn {
        flex: 1 1 auto;
      }
      .tips {
        margin: 0;
        padding: 0 0 0 18px;
        display: grid;
        gap: 2px;
      }
      kbd {
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        padding: 0 4px;
        border-radius: 3px;
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .colors {
        display: grid;
        gap: 8px;
      }
      .color-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .color-row mc-color-picker {
        flex: 1;
        min-width: 0;
      }
      .foot {
        display: flex;
        justify-content: flex-end;
      }
      .btn-danger {
        color: var(--mc-error-ink);
      }
      .btn-danger:hover:not(:disabled) {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      @media (prefers-reduced-motion: reduce) {
        .tile {
          transition: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: Record<string, AnimationDoc>;
  @property({ type: Number }) time = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private get _spec(): PathSpec {
    return this.doc?.path ?? DEFAULT_SPEC;
  }

  private _emit(path: PathSpec, label: string): void {
    if (!this.doc || this.disabled) return;
    const doc: AnimationDoc = { ...this.doc, path };
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  private _set(patch: Partial<PathSpec>, label: string): void {
    this._emit({ ...this._spec, ...patch }, label);
  }

  private _edit(fn: (p: EditPath) => EditPath, label: string): void {
    this._set({ d: serializePath(fn(parsePath(this._spec.d))) }, label);
  }

  private _template(id: PathTemplateId, label: string): void {
    const spec = this._spec;
    this._set({ d: templatePath(id, templateCenter({ subject: spec.subject, units: 'percent' })), units: 'percent' }, `Use ${label.toLowerCase()} path`);
  }

  /** What moves; in % units the path shifts with the origin (the centre vs the particle layer's corner). */
  private _subject(value: Subject): void {
    const spec = this._spec;
    if (value === spec.subject) return;
    const patch: Partial<PathSpec> = { subject: value };
    const wasCorner = spec.subject === 'particles';
    const isCorner = value === 'particles';
    if (spec.units === 'percent' && wasCorner !== isCorner && spec.d) {
      const k = isCorner ? 50 : -50;
      patch.d = serializePath(translatePath(parsePath(spec.d), k, k));
    }
    if (isCorner && !spec.particles) patch.particles = { ...DEFAULT_LOOK, size: [...DEFAULT_LOOK.size], colors: [] };
    this._set(patch, 'What moves');
  }

  private _look(patch: Partial<Look>, label: string): void {
    const cur = this._spec.particles ?? DEFAULT_LOOK;
    this._set({ particles: { ...cur, size: [...cur.size], colors: [...cur.colors], ...patch } }, label);
  }

  // ── pieces ──

  private _seg<T extends string>(label: string, options: Array<{ value: T; label: string; icon?: string }>, value: T, pick: (v: T) => void): TemplateResult {
    const onKey = (e: KeyboardEvent) => {
      const i = options.findIndex((o) => o.value === value);
      const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in step)) return;
      e.preventDefault();
      const next = options[(i + step[e.key] + options.length) % options.length].value;
      const group = e.currentTarget as HTMLElement;
      pick(next);
      requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
    };
    return html`<div class="seg full" role="radiogroup" aria-label=${label} @keydown=${onKey}>
      ${options.map((o) => {
        const on = o.value === value;
        return html`<button
          type="button"
          role="radio"
          data-val=${o.value}
          aria-checked=${on ? 'true' : 'false'}
          tabindex=${on ? '0' : '-1'}
          ?disabled=${this.disabled}
          @click=${() => pick(o.value)}
        >
          ${o.icon ? html`<ha-icon icon=${o.icon}></ha-icon>` : nothing}${o.label}
        </button>`;
      })}
    </div>`;
  }

  private _switch(label: string, help: string, on: boolean, toggle: () => void, cls: string, off = false): TemplateResult {
    return html`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${label}</span>
        <p class="help">${help}</p>
      </div>
      <button
        type="button"
        class="switch ${cls}"
        role="switch"
        aria-checked=${on ? 'true' : 'false'}
        aria-label=${label}
        ?disabled=${this.disabled || off}
        @click=${toggle}
      ></button>
    </div>`;
  }

  private _templates(): TemplateResult {
    return html`<div class="tiles">
      ${PATH_TEMPLATES.map((t) => {
        const p = preview(t.id);
        const start = parsePath(p.d).anchors[0];
        return html`<button
          type="button"
          class="tile"
          data-template=${t.id}
          title="Replace the path with a ${t.label.toLowerCase()}"
          ?disabled=${this.disabled}
          @click=${() => this._template(t.id, t.label)}
        >
          <svg viewBox=${p.box} aria-hidden="true">
            <path d=${p.d}></path>
            ${start ? svg`<circle cx=${start.x} cy=${start.y} r=${p.box.split(' ').map(Number)[2] / 18}></circle>` : nothing}
          </svg>
          <span>${t.label}</span>
        </button>`;
      })}
    </div>`;
  }

  private _pathSection(edit: EditPath): TemplateResult {
    const n = edit.anchors.length;
    const curved = edit.anchors.filter((a) => a.in || a.out).length;
    const canEdit = n > 1 && !this.disabled;
    return html`<section class="sec" aria-label="Path">
      <div class="field">
        <div class="field-head"><span class="lbl">Start from a template</span></div>
        ${this._templates()}
      </div>
      <div class="stats" aria-live="polite">
        <span class="chip">${n === 1 ? '1 point' : `${n} points`}</span>
        <span class="chip">${edit.closed ? 'Closed' : 'Open'}</span>
        ${n > 1 ? html`<span class="chip">${curved === 0 ? 'Straight' : curved === n ? 'Curved' : 'Mixed'}</span>` : nothing}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary btn-sm smooth-all" ?disabled=${!canEdit} @click=${() => this._edit(smoothAll, 'Smooth all points')}>
          <ha-icon icon="mdi:vector-curve"></ha-icon>Smooth all
        </button>
        <button type="button" class="btn btn-secondary btn-sm straighten-all" ?disabled=${!canEdit} @click=${() => this._edit(straightenAll, 'Straighten all points')}>
          <ha-icon icon="mdi:vector-polyline"></ha-icon>Straighten all
        </button>
        <button type="button" class="btn btn-secondary btn-sm reverse" ?disabled=${!canEdit} @click=${() => this._edit(reversePath, 'Reverse direction')}>
          <ha-icon icon="mdi:swap-horizontal"></ha-icon>Reverse direction
        </button>
      </div>
      ${this._switch(
        'Closed path',
        'The motion runs back to the start along the path.',
        edit.closed,
        () => {
          if (n > 1) this._edit((p) => setClosed(p, !edit.closed), edit.closed ? 'Open path' : 'Close path');
        },
        'closed-switch',
        n < 2,
      )}
      <ul class="tips help">
        <li>Click the stage to add a point, click the line to insert one.</li>
        <li>Drag points and handles. <kbd>Alt</kbd> moves one handle alone.</li>
        <li>Double-click a point to make it smooth or a corner. <kbd>Delete</kbd> removes it.</li>
        <li>Points snap to a ${this._spec.units === 'px' ? '10 px' : '5%'} grid. Hold <kbd>Shift</kbd> to place freely.</li>
      </ul>
      <div class="foot">
        <button type="button" class="btn btn-text btn-sm btn-danger clear" ?disabled=${n === 0 || this.disabled} @click=${() => this._set({ d: '' }, 'Clear path')}>
          <ha-icon icon="mdi:eraser"></ha-icon>Clear path
        </button>
      </div>
    </section>`;
  }

  private _motionSection(): TemplateResult {
    const spec = this._spec;
    return html`<section class="sec" aria-labelledby="pe-motion">
      <h3 id="pe-motion">Motion</h3>
      <div class="field">
        <div class="field-head"><span class="lbl">What moves</span></div>
        ${this._seg('What moves', SUBJECTS, spec.subject, (v) => this._subject(v))}
        <p class="help">
          ${spec.subject === 'particles'
            ? 'Particles travel the path one after another, over the whole element.'
            : spec.subject === 'icon'
              ? "The module's icon moves along the path."
              : 'The whole element moves along the path from where it rests.'}
        </p>
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">Units</span></div>
        ${this._seg('Units', UNITS, spec.units, (v) => this._set({ units: v }, 'Units'))}
        <p class="help">${spec.units === 'percent' ? 'Points are in % of the moving element, so the path scales with it.' : 'Points are in pixels, the same at every size.'}</p>
      </div>
      ${this._switch('Follow rotation', 'Turn the subject to face the direction of travel.', spec.follow_rotation, () => this._set({ follow_rotation: !spec.follow_rotation }, 'Follow rotation'), 'follow-switch')}
    </section>`;
  }

  private _particlesSection(): TemplateResult {
    const look = this._spec.particles ?? DEFAULT_LOOK;
    const [min, max] = look.size;
    const sizeField = (which: 0 | 1, label: string, id: string): TemplateResult => html`<div class="field">
      <div class="field-head"><span class="lbl">${label}</span></div>
      <mc-unit-field
        .value=${`${look.size[which]}px`}
        .label=${label}
        .units=${['px']}
        .noCustom=${true}
        .inputId=${id}
        .disabled=${this.disabled}
        @value-changed=${(e: CustomEvent) => {
          e.stopPropagation();
          const n = parseFloat(String(e.detail.value));
          if (!Number.isFinite(n)) return;
          const v = Math.min(200, Math.max(1, Math.round(n)));
          const size: [number, number] = which === 0 ? [v, Math.max(v, max)] : [Math.min(min, v), v];
          this._look({ size }, 'Particle size');
        }}
      ></mc-unit-field>
    </div>`;
    return html`<section class="sec particles" aria-labelledby="pe-particles">
      <h3 id="pe-particles">Particles</h3>
      <div class="field">
        <div class="field-head"><label for="pe-count">Count</label></div>
        <input
          class="input"
          id="pe-count"
          type="number"
          min="1"
          max=${ANIMATION_CAPS.particles}
          step="1"
          inputmode="numeric"
          .value=${String(look.count)}
          ?disabled=${this.disabled}
          @input=${(e: InputEvent) => {
            const s = (e.target as HTMLInputElement).value;
            const n = Number(s);
            if (s.trim() !== '' && Number.isInteger(n) && n >= 1 && n <= ANIMATION_CAPS.particles) this._look({ count: n }, 'Particle count');
          }}
        />
        <p class="help">Spaced evenly along the path, 1 to ${ANIMATION_CAPS.particles}.</p>
      </div>
      <div class="pair">${sizeField(0, 'Smallest', 'pe-size-min')} ${sizeField(1, 'Largest', 'pe-size-max')}</div>
      <div class="field">
        <div class="field-head"><span class="lbl">Colours</span></div>
        <div class="colors">
          ${look.colors.map(
            (c, i) => html`<div class="color-row">
              <mc-color-picker
                .value=${c}
                .label=${`Colour ${i + 1}`}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  const v = String(e.detail.value ?? '').trim();
                  if (!v) return;
                  const colors = [...look.colors];
                  colors[i] = v;
                  this._look({ colors }, 'Particle colour');
                }}
              ></mc-color-picker>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${`Remove colour ${i + 1}`}
                title="Remove colour"
                ?disabled=${this.disabled}
                @click=${() => this._look({ colors: look.colors.filter((_, j) => j !== i) }, 'Remove particle colour')}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`,
          )}
        </div>
        ${look.colors.length ? nothing : html`<p class="help">None set: the particles take the animation colour.</p>`}
        ${look.colors.length < ANIMATION_CAPS.colors
          ? html`<div>
              <button
                type="button"
                class="btn btn-text btn-sm add-color"
                ?disabled=${this.disabled}
                @click=${() => this._look({ colors: [...look.colors, look.colors[look.colors.length - 1] ?? '#ffc107'] }, 'Add particle colour')}
              >
                <ha-icon icon="mdi:plus"></ha-icon>Add colour
              </button>
            </div>`
          : nothing}
      </div>
    </section>`;
  }

  protected render(): TemplateResult {
    const edit = parsePath(this._spec.d);
    return html`<div class="ed">
      ${this._pathSection(edit)} ${this._motionSection()} ${this._spec.subject === 'particles' ? this._particlesSection() : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-path-editor': AnimPathEditor;
  }
}
