import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { entityColorCss } from '../../utils/entity-color';
import { editorSystem } from '../../css/editor-system';
import type { AnimationDoc } from '../model';
import type { RigShape } from '../model-v2';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { hasDrawOn, isFilled, isStroked, moveShapeInLayer, removeShape } from './draw-utils';
import { selectedShapeId, sourceViewBox } from './draw-store';

/*
 * mc-anim-shapes-layers (place 'layers'): the rig's drawn shapes, top of the paint order first, with
 * a thumbnail, the layer (over / under the icon) and whether they draw on or move along a path.
 * Click selects the shape (selection target shape:<id>); the selected row offers move up / down
 * and delete (no hover-only actions: they work by touch too).
 */

abstract class ShapesLayersBase extends LitElement {
  /** Which side of the icon this section lists. */
  protected abstract readonly side: 'over' | 'under';

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      li {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        min-height: 44px;
        align-items: center;
        border-radius: 8px;
      }
      li:hover {
        background: var(--secondary-background-color, #f2f3f5);
      }
      li.sel {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      }
      .pick {
        display: grid;
        grid-template-columns: 28px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 0 8px;
        border: 0;
        background: none;
        color: var(--primary-text-color, #212121);
        font: inherit;
        font-size: 0.875rem;
        text-align: left;
        cursor: pointer;
        border-radius: 8px;
        min-width: 0;
      }
      li.sel .pick {
        color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
      }
      .pick:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: -2px;
      }
      .thumb {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: var(--secondary-background-color, #f2f3f5);
        color: var(--state-icon-color, #44739e);
      }
      .nm {
        display: grid;
        min-width: 0;
      }
      .nm span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .nm small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
      .acts {
        display: flex;
        padding-right: 4px;
      }
      .empty-note {
        margin: 0;
        padding: 8px;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) tile?: string;
  @property({ attribute: false }) stage?: StageInfo;

  private _emit(doc: AnimationDoc, label: string): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  private _select(selection: StudioSelection): void {
    this.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
  }

  private _thumb(s: RigShape, vb: string): TemplateResult {
    const paint = (v: string | undefined) => (v ? (entityColorCss(v) ?? v) : 'currentColor');
    const style = {
      fill: isFilled(s) ? paint(s.fill) : 'none',
      stroke: isStroked(s) ? paint(s.stroke) : 'none',
      'stroke-width': String(Math.max(s.stroke_width ?? 1, 1)),
    };
    return html`<svg class="thumb" viewBox=${vb} aria-hidden="true">
      ${svg`<path d=${s.d} style=${styleMap(style)} stroke-linecap="round" stroke-linejoin="round"></path>`}
    </svg>`;
  }

  protected render(): TemplateResult {
    const doc = this.doc;
    const shapes = doc?.rig?.shapes ?? [];
    const under = this.side === 'under';
    if (!doc || !shapes.some((s) => (s.layer === 'under') === under)) return html``;
    const sel = selectedShapeId(this.selection);
    // with a draw tool picked, a shape is selected with the select tool (the drawing overlay stays)
    const drawing = this.selection.kind === 'tool';
    const vb = sourceViewBox(doc.rig);
    // the top of this side's paint order first: later before earlier
    const rows = shapes.map((s, i) => ({ s, i })).filter((r) => (r.s.layer === 'under') === under).reverse();
    return html`<ul aria-label=${under ? 'Shapes under the icon' : 'Shapes over the icon'}>
      ${rows.map(({ s }) => {
        const target = `shape:${s.id}` as const;
        const track = doc.tracks?.find((t) => t.target === target);
        const notes = [hasDrawOn(doc, target) ? 'draws on' : '', track?.path ? 'moves' : ''].filter(Boolean).join(', ');
        return html`<li class=${s.id === sel ? 'sel' : ''} data-id=${s.id}>
          <button
            type="button"
            class="pick"
            aria-current=${s.id === sel ? 'true' : 'false'}
            @click=${() => this._select(drawing ? { kind: 'tool', tool: 'select', target } : { kind: 'target', target })}
          >
            ${this._thumb(s, vb)}
            <span class="nm"><span>${s.name}</span><small>${notes}</small></span>
          </button>
          ${s.id !== sel
            ? nothing
            : html`<span class="acts">
            <button type="button" class="icon-btn sm up" aria-label=${under && rows[0].s.id === s.id ? `Bring ${s.name} over the icon` : `Bring ${s.name} forward`} title=${under && rows[0].s.id === s.id ? 'Bring over the icon' : 'Bring forward'} ?disabled=${this.disabled || moveShapeInLayer(doc, s.id, 'up') === doc} @click=${() => this._emit(moveShapeInLayer(doc, s.id, 'up'), s.layer === 'under' && rows[0].s.id === s.id ? 'Bring shape over the icon' : 'Bring shape forward')}>
              <ha-icon icon="mdi:chevron-up"></ha-icon>
            </button>
            <button type="button" class="icon-btn sm down" aria-label=${!under && rows[rows.length - 1].s.id === s.id ? `Send ${s.name} under the icon` : `Send ${s.name} backward`} title=${!under && rows[rows.length - 1].s.id === s.id ? 'Send under the icon' : 'Send backward'} ?disabled=${this.disabled || moveShapeInLayer(doc, s.id, 'down') === doc} @click=${() => this._emit(moveShapeInLayer(doc, s.id, 'down'), !under && rows[rows.length - 1].s.id === s.id ? 'Send shape under the icon' : 'Send shape backward')}>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            <button type="button" class="icon-btn sm danger del" aria-label=${`Delete ${s.name}`} title="Delete shape" ?disabled=${this.disabled} @click=${() => {
              this._emit(removeShape(doc, s.id), 'Delete shape');
              if (s.id === sel) this._select({ kind: 'none' });
            }}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </span>`}
        </li>`;
      })}
    </ul>
    ${shapes.length >= 48 ? html`<p class="empty-note">The rig holds the most shapes it can (48).</p>` : nothing}`;
  }
}

@customElement('mc-anim-shapes-layers')
export class AnimShapesLayers extends ShapesLayersBase {
  protected readonly side = 'over';
}

@customElement('mc-anim-shapes-under-layers')
export class AnimShapesUnderLayers extends ShapesLayersBase {
  protected readonly side = 'under';
}

// keyframes column, top to bottom: Shapes over the icon, Icon parts, Shapes under the icon, Card parts (LAYERS_ORDER)
registerPanel({ tag: 'mc-anim-shapes-layers', place: 'layers', when: (doc) => doc.kind === 'keyframes' && !!doc.rig?.shapes?.some((s) => s.layer !== 'under'), title: 'Shapes over the icon', order: 5 });
registerPanel({ tag: 'mc-anim-shapes-under-layers', place: 'layers', when: (doc) => doc.kind === 'keyframes' && !!doc.rig?.shapes?.some((s) => s.layer === 'under'), title: 'Shapes under the icon', order: 30 });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-shapes-layers': AnimShapesLayers;
    'mc-anim-shapes-under-layers': AnimShapesUnderLayers;
  }
}
