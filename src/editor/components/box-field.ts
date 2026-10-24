import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DesignConfig } from '../../types';
import { editorSystem } from '../../css/editor-stack';
import './unit-field';
import './color-picker';
import { t, m, type MessageId } from '../i18n';

type Side = 'top' | 'right' | 'bottom' | 'left';

const SIDES: Side[] = ['top', 'right', 'bottom', 'left'];
/** Same units as mc-unit-field (auto, calc(…) and var(…) are its "Custom" values). */
const UNITS = ['px', 'em', 'rem', '%', 'vw', 'vh'];

const SIDE_META: Record<Side, { label: MessageId; icon: string }> = {
  top: { label: m('Top'), icon: 'mdi:border-top-variant' },
  right: { label: m('Right'), icon: 'mdi:border-right-variant' },
  bottom: { label: m('Bottom'), icon: 'mdi:border-bottom-variant' },
  left: { label: m('Left'), icon: 'mdi:border-left-variant' },
};

const CORNER_META: Record<Side, { label: MessageId; icon: string }> = {
  top: { label: m('Top left'), icon: 'mdi:border-top-variant' },
  right: { label: m('Top right'), icon: 'mdi:border-right-variant' },
  bottom: { label: m('Bottom right'), icon: 'mdi:border-bottom-variant' },
  left: { label: m('Bottom left'), icon: 'mdi:border-left-variant' },
};

/** What a side holds in shorthand mode: a length, a colour or a word from `options` (a border style). */
export type SideCell = 'length' | 'color' | 'style';

/** A CSS shorthand split at spaces outside parentheses (`rgb(1, 2, 3) red` is two values). */
function tokens(raw: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of raw.trim()) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (/\s/.test(ch) && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  // an entity colour with an opacity is one value
  return out.reduce<string[]>((all, v) => (/^\d+(?:\.\d+)?%$/.test(v) && all[all.length - 1] === 'entity' ? [...all.slice(0, -1), `entity ${v}`] : [...all, v]), []);
}

/** The four sides of a 1 to 4 value shorthand (top, right, bottom, left; corners in the same order). */
function expand(raw: string): Record<Side, string> | undefined {
  const [top, right = top, bottom = top, left = right] = tokens(raw).slice(0, 4);
  return top === undefined ? undefined : { top, right, bottom, left };
}

/** The shortest shorthand that gives these four sides. */
function collapse(s: Record<Side, string>): string {
  if (s.left === s.right) {
    if (s.top === s.bottom) return s.top === s.right ? s.top : `${s.top} ${s.right}`;
    return `${s.top} ${s.right} ${s.bottom}`;
  }
  return `${s.top} ${s.right} ${s.bottom} ${s.left}`;
}

/** What a side takes when it is left empty in an unlinked shorthand and the design below has no value for it. */
const EMPTY_SIDE: Record<SideCell, string> = { length: '0', style: 'none', color: 'currentcolor' };

/**
 * Four-side value (padding / margin / border radius): a 2x2 grid where every side is a compact
 * mc-unit-field (number + unit, written on commit; Custom for auto / calc(…)), and a
 * "Same on all sides" link toggle in the foot row.
 *
 * In `shorthand` mode (a tab's border and corners) the field holds one design key with a 1 to 4 value
 * CSS shorthand in `value`: one input while the sides are linked, four when they are not; the
 * cells hold lengths, colours or words (`cell`), and `inherited` is the shorthand an empty side falls
 * back to (shown as that side's hint).
 */
@customElement('mc-box-field')
export class BoxField extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      .box {
        display: grid;
        gap: 8px;
      }
      .box-grid.one-col {
        grid-template-columns: minmax(0, 1fr);
      }
      .box-foot .btn[aria-pressed='true'] {
        background: var(--mc-accent-tint);
      }
      /* the 2x2 holds down to ~200px of field width (studio inspector, 360px pane); one column only below */
      @container (max-width: 200px) {
        .box-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ];

  @property({ attribute: false }) design: DesignConfig = {};
  @property({ attribute: false }) onChange!: (updates: Record<string, unknown>) => void;
  @property({ type: String }) baseName: string = 'padding';
  /** One design key holding a 1 to 4 value shorthand (`baseName`), instead of one key per side. */
  @property({ type: Boolean }) shorthand = false;
  @property({ type: String }) value = '';
  /** Names the field for assistive tech while the sides are linked (shorthand mode). */
  @property({ type: String }) label = '';
  @property({ type: String }) cell: SideCell = 'length';
  /** The four sides are corners (Top left ... Bottom left). */
  @property({ type: Boolean }) corners = false;
  @property({ attribute: false }) units: string[] = UNITS;
  /** The words of a `style` cell. */
  @property({ attribute: false }) options: Array<{ value: string; label: string }> = [];
  /** Shorthand mode: what the empty sides take from the design below this one. */
  @property({ type: String }) inherited = '';
  /** A colour cell offers the entity's colour (`entity`, `entity N%`). */
  @property({ type: Boolean }) entity = false;
  @property({ type: String }) entityColor = '';

  @state() private _linked = false;
  /** Shorthand mode: the user chose Same on all sides (unset: linked until the sides differ). */
  @state() private _link?: boolean;

  private _getSuffixKey(baseName: string, suffix: string): string {
    // Handle border-radius special naming
    if (baseName === 'border_radius') {
      const suffixMap: Record<string, string> = {
        top: 'border_top_left_radius',
        right: 'border_top_right_radius',
        bottom: 'border_bottom_right_radius',
        left: 'border_bottom_left_radius',
      };
      return suffixMap[suffix] || `${baseName}_${suffix}`;
    }
    return `${baseName}_${suffix}`;
  }

  /** Sides from the CSS shorthand (1–4 values, mixed units allowed), or undefined when there is none. */
  private _shorthandSides(): Record<Side, string> | undefined {
    const raw = String((this.design as Record<string, unknown>)[this.baseName] ?? '').trim();
    if (!raw) return undefined;
    const [t, r = t, b = t, l = r] = raw.split(/\s+/);
    return { top: t, right: r, bottom: b, left: l };
  }

  private _getValue(side: Side): string {
    const sh = this._shorthandSides();
    if (sh) return sh[side];
    const v = (this.design as Record<string, unknown>)[this._getSuffixKey(this.baseName, side)];
    return v === undefined || v === null ? '' : String(v);
  }

  /**
   * Write sides as longhands and clear the shorthand. Untouched sides that came from a shorthand
   * are re-emitted (when non-empty) so clearing the shorthand never drops them.
   */
  private _emitSides(values: Partial<Record<Side, string>>): void {
    const updates: Record<string, unknown> = { [this.baseName]: undefined };
    const sh = this._shorthandSides();
    for (const side of SIDES) {
      if (values[side] !== undefined) updates[this._getSuffixKey(this.baseName, side)] = values[side];
      else if (sh?.[side]) updates[this._getSuffixKey(this.baseName, side)] = sh[side];
    }
    this.onChange(updates);
  }

  /** A side's committed value (number + unit, or a custom value; '' = cleared): every side when linked. */
  private _handleSideChange(position: Side, value: string): void {
    if (this._linked) this._emitSides({ top: value, right: value, bottom: value, left: value });
    else this._emitSides({ [position]: value });
  }

  // ── shorthand mode ──

  private get _sh(): Record<Side, string> | undefined {
    return expand(this.value);
  }

  /** Linked while the four sides agree, unless the user unlinked them. */
  private get _shLinked(): boolean {
    const s = this._sh;
    const equal = !s || (s.top === s.right && s.right === s.bottom && s.bottom === s.left);
    return equal && (this._link ?? true);
  }

  /**
   * Writes the sides as the shortest shorthand; none left removes the key. An empty side takes the
   * value of the design below this one (the hint it showed), else its CSS default.
   */
  private _shEmit(next: Record<Side, string>): void {
    if (SIDES.every((s) => !next[s])) {
      this.onChange({ [this.baseName]: undefined });
      return;
    }
    const below = expand(this.inherited);
    const fill = (s: Side) => next[s] || below?.[s] || EMPTY_SIDE[this.cell];
    this.onChange({ [this.baseName]: collapse({ top: fill('top'), right: fill('right'), bottom: fill('bottom'), left: fill('left') }) });
  }

  private _shSide(position: Side | 'all', value: string): void {
    if (position === 'all' || this._shLinked) this._shEmit({ top: value, right: value, bottom: value, left: value });
    else this._shEmit({ ...(this._sh ?? { top: '', right: '', bottom: '', left: '' }), [position]: value });
  }

  private _shToggle(): void {
    if (this._shLinked) {
      this._link = false;
      return;
    }
    this._link = true;
    const top = this._sh?.top ?? '';
    this._shEmit({ top, right: top, bottom: top, left: top });
  }

  /** One side's control (or the single control of the linked sides, `position` all). */
  private _renderCell(source: Side, position: Side | 'all', label: string): TemplateResult {
    const own = this._sh?.[source] ?? '';
    const hint = expand(this.inherited)?.[source] ?? '';
    const write = (v: string) => this._shSide(position, v);
    if (this.cell === 'color') {
      return html`<mc-color-picker data-side=${position} .value=${own} .label=${label} .placeholder=${own ? '' : hint} .allowEntity=${this.entity} .entityColor=${this.entityColor} @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        write(String(e.detail.value ?? ''));
      }}></mc-color-picker>`;
    }
    if (this.cell === 'style') {
      const shown = this.options.find((o) => o.value === hint)?.label ?? hint;
      // a stored word the list does not offer stays visible and selectable
      const extra = own && !this.options.some((o) => o.value === own) ? [{ value: own, label: own }] : [];
      return html`<div class="select">
        <select class="input side-select" data-side=${position} aria-label=${label} @change=${(e: Event) => write((e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${!own}>${hint ? t('Inherit ({value})', { value: shown }) : t('Not set')}</option>
          ${[...this.options, ...extra].map((o) => html`<option value=${o.value} ?selected=${o.value === own}>${o.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>`;
    }
    return html`<mc-unit-field
      compact
      data-side=${position}
      .inputId=${`side-${position}`}
      .label=${label}
      .units=${this.units}
      .value=${own}
      .placeholder=${hint.match(/^-?\d*\.?\d+/)?.[0] ?? '0'}
      @value-changed=${(e: CustomEvent) => {
        e.stopPropagation();
        write(String(e.detail.value ?? ''));
      }}
    ></mc-unit-field>`;
  }

  private _toggleLink(): void {
    if (this.shorthand) {
      this._shToggle();
      return;
    }
    this._linked = !this._linked;
    if (!this._linked) return;
    // Linking copies the top side (value and unit) to all sides.
    const master = this._getValue('top');
    if (master && SIDES.some((side) => this._getValue(side) !== master)) {
      this._emitSides({ top: master, right: master, bottom: master, left: master });
    }
  }

  private _renderSide(position: Side): TemplateResult {
    const meta = this.baseName === 'border_radius' || this.corners ? CORNER_META[position] : SIDE_META[position];
    const sideLabel = t(meta.label);
    const source: Side = this._linked ? 'top' : position;
    return html`
      <div class="box-side">
        <span class="box-side-label" @click=${() => this.renderRoot.querySelector<HTMLElement>(`[data-side="${position}"]`)?.focus()}>
          <ha-icon icon=${meta.icon}></ha-icon>${sideLabel}
        </span>
        ${this.shorthand
          ? this._renderCell(position, position, sideLabel)
          : html`<mc-unit-field
          compact
          data-side=${position}
          .inputId=${`side-${position}`}
          .label=${sideLabel}
          .units=${UNITS}
          .value=${this._getValue(source)}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this._handleSideChange(position, String(e.detail.value ?? ''));
          }}
        ></mc-unit-field>`}
      </div>
    `;
  }

  protected render(): TemplateResult {
    const linkedOne = this.shorthand && this._shLinked;
    return html`
      <div class="box">
        ${linkedOne
          ? this._renderCell('top', 'all', this.label)
          : html`<div class="box-grid ${this.shorthand && this.cell !== 'length' ? 'one-col' : ''}">${SIDES.map((side) => this._renderSide(side))}</div>`}
        <div class="box-foot">
          <button
            type="button"
            class="btn btn-text btn-sm"
            aria-pressed=${(this.shorthand ? this._shLinked : this._linked) ? 'true' : 'false'}
            @click=${this._toggleLink}
          >
            <ha-icon icon="mdi:link-variant"></ha-icon>${t('Same on all sides')}
          </button>
        </div>
      </div>
    `;
  }
}
