import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DesignConfig } from '../../types';
import { editorSystem } from '../../css/editor-system';
import './unit-field';
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

/**
 * Four-side value (padding / margin / border radius): a 2x2 grid where every side is a compact
 * mc-unit-field (number + unit, written on commit; Custom for auto / calc(…)), and a
 * "Same on all sides" link toggle in the foot row.
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
  @property({ type: String }) baseName: 'padding' | 'margin' | 'border_radius' = 'padding';

  @state() private _linked = false;

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
    const raw = String(this.design[this.baseName] ?? '').trim();
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

  private _toggleLink(): void {
    this._linked = !this._linked;
    if (!this._linked) return;
    // Linking copies the top side (value and unit) to all sides.
    const master = this._getValue('top');
    if (master && SIDES.some((side) => this._getValue(side) !== master)) {
      this._emitSides({ top: master, right: master, bottom: master, left: master });
    }
  }

  private _renderSide(position: Side): TemplateResult {
    const meta = this.baseName === 'border_radius' ? CORNER_META[position] : SIDE_META[position];
    const sideLabel = t(meta.label);
    const source: Side = this._linked ? 'top' : position;
    return html`
      <div class="box-side">
        <span class="box-side-label" @click=${() => this.renderRoot.querySelector<HTMLElement>(`mc-unit-field[data-side="${position}"]`)?.focus()}>
          <ha-icon icon=${meta.icon}></ha-icon>${sideLabel}
        </span>
        <mc-unit-field
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
        ></mc-unit-field>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="box">
        <div class="box-grid">${SIDES.map((side) => this._renderSide(side))}</div>
        <div class="box-foot">
          <button
            type="button"
            class="btn btn-text btn-sm"
            aria-pressed=${this._linked ? 'true' : 'false'}
            @click=${this._toggleLink}
          >
            <ha-icon icon="mdi:link-variant"></ha-icon>${t('Same on all sides')}
          </button>
        </div>
      </div>
    `;
  }
}
