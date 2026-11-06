import { LitElement, html, css, svg, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { entityColorCss } from '../../utils/entity-color';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import type { RigShape } from '../model-v2';
import { LayerRows, layerRowStyles } from './layer-row';
import { laneName, selectLane, trackRows, tracksOpen } from './lane-rows';
import { EMPTY_LAYER_VIEW, type LayerView, type LayersDensity } from '../../contracts/studio-layers';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import { hasDrawOn, isFilled, isStroked, moveShapeInLayer, removeShape } from './draw-utils';
import { selectedShapeId, sourceViewBox } from './draw-store';
import { t, m } from '../i18n';

// mc-anim-shapes-layers (place 'layers'): the rig's drawn shapes, top of the paint order first, with a
// thumbnail, the layer (over / under the icon) and whether they draw on or move along a path.
// Click selects the shape; the selected row offers move up / down and delete (no hover-only actions).

abstract class ShapesLayersBase extends LitElement {
  /** Which side of the icon this section lists. */
  protected abstract readonly side: 'over' | 'under';

  static styles = [
    editorSystem,
    layerRowStyles,
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
      .thumb {
        flex: none;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: var(--secondary-background-color, #f2f3f5);
        color: var(--state-icon-color, #44739e);
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
  @property({ attribute: false }) layerView?: LayerView;
  @property() density: LayersDensity = 'full';

  private readonly _list = new LayerRows(this, {
    select: (key, e) => (key.startsWith('lane:') ? !this.disabled && selectLane(this, this.doc!, key) : this._pick(key.slice(6), e)),
    move: (key, dir) => this._shift(key.slice(6), dir),
    open: (key, open) => this._list.setOpen(key, open),
    nameOf: (key) => (key.startsWith('lane:') ? laneName(key) : (this.doc?.rig?.shapes?.find((x) => x.id === key.slice(6))?.name ?? key)),
  });

  private _emit(doc: AnimationDoc, label: string): void {
    this.dispatchEvent(new CustomEvent('doc-change', { bubbles: true, composed: true, detail: { doc, label } }));
  }

  private _select(selection: StudioSelection): void {
    this.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
  }

  private _pick(id: string, _e: MouseEvent | KeyboardEvent): void {
    const target = `shape:${id}` as const;
    // with a draw tool picked, a shape is selected with the select tool (the drawing overlay stays)
    this._select(this.selection.kind === 'tool' ? { kind: 'tool', tool: 'select', target } : { kind: 'target', target });
  }

  private _shift(id: string, dir: 'up' | 'down'): void {
    const doc = this.doc;
    const s = doc?.rig?.shapes?.find((x) => x.id === id);
    if (!doc || !s) return;
    const next = moveShapeInLayer(doc, id, dir);
    if (next === doc) return;
    const under = this.side === 'under';
    const rows = doc.rig!.shapes!.filter((x) => (x.layer === 'under') === under);
    const edge = dir === 'up' ? under && rows[rows.length - 1].id === id : !under && rows[0].id === id;
    this._emit(next, dir === 'up' ? (edge ? t('anim-studio.draw-layers.bring-shape-over-the-icon') : t('anim-studio.draw-layers.bring-shape-forward')) : edge ? t('anim-studio.draw-layers.send-shape-under-the-icon') : t('anim-studio.draw-layers.send-shape-backward'));
    this._list.announce(t('anim-studio.draw-layers.name-moved-where', { name: s.name, where: edge ? (dir === 'up' ? t('anim-studio.draw-layers.over-the-icon') : t('anim-studio.draw-layers.under-the-icon')) : dir === 'up' ? t('anim-studio.draw-layers.up') : t('anim-studio.draw-layers.down') }));
  }

  private _delete(id: string): void {
    const doc = this.doc;
    const s = doc?.rig?.shapes?.find((x) => x.id === id);
    if (!doc || !s || this.disabled || this._list.refuseLocked(`shape:${id}`, s.name)) return;
    this._emit(removeShape(doc, id), 'Delete shape');
    if (selectedShapeId(this.selection) === id) this._select({ kind: 'none' });
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
    const vb = sourceViewBox(doc.rig);
    // the top of this side's paint order first: later before earlier
    const rows = shapes.map((s, i) => ({ s, i })).filter((r) => (r.s.layer === 'under') === under).reverse();
    const first = rows[0].s.id;
    const last = rows[rows.length - 1].s.id;
    return html`<ul aria-label=${under ? t('anim-studio.draw-layers.shapes-under-the-icon') : t('anim-studio.draw-layers.shapes-over-the-icon')}>
      ${rows.map(({ s }) => {
        const target = `shape:${s.id}` as const;
        const track = doc.tracks?.find((t) => t.target === target);
        const notes = [hasDrawOn(doc, target) ? t('anim-studio.draw-layers.draws-on') : '', track?.path ? 'moves' : ''].filter(Boolean).join(', ');
        const upEdge = under && first === s.id;
        const downEdge = !under && last === s.id;
        const open = tracksOpen(doc, this.layerView ?? EMPTY_LAYER_VIEW, target, target);
        const row = this._list.row({
          key: target,
          expanded: open,
          name: s.name,
          thumb: this._thumb(s, vb),
          note: notes,
          describe: notes,
          selected: s.id === sel && !(open && this.selection.kind === 'keys'),
          up: { ok: !this.disabled && moveShapeInLayer(doc, s.id, 'up') !== doc, label: upEdge ? t('anim-studio.draw-layers.bring-name-over-the-icon', { name: s.name }) : t('anim-studio.draw-layers.bring-name-forward', { name: s.name }), menu: upEdge ? t('anim-studio.draw-layers.bring-over-the-icon') : t('anim-studio.draw-layers.move-up-drawn-on-top') },
          down: { ok: !this.disabled && moveShapeInLayer(doc, s.id, 'down') !== doc, label: downEdge ? t('anim-studio.draw-layers.send-name-under-the-icon', { name: s.name }) : t('anim-studio.draw-layers.send-name-backward', { name: s.name }), menu: downEdge ? t('anim-studio.draw-layers.send-under-the-icon') : t('anim-studio.draw-layers.move-down') },
          extra:
            s.id !== sel
              ? undefined
              : html`<button type="button" class="icon-btn sm danger del" data-ctl="del" tabindex="-1" aria-label=${t('anim-studio.draw-layers.delete-name', { name: s.name })} title=${t('anim-studio.draw-layers.delete-shape')} aria-disabled=${this.disabled || this._list.locked(target) ? 'true' : nothing} @click=${() => this._delete(s.id)}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>`,
        });
        return open ? [row, ...trackRows(this._list, doc, this.selection, target, 2)] : [row];
      })}
    </ul>
    ${shapes.length >= 48 ? html`<p class="empty-note">${t('anim-studio.draw-layers.the-rig-holds-the-most-shapes-it-can-48')}</p>` : nothing}`;
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
registerPanel({ tag: 'mc-anim-shapes-layers', place: 'layers', when: (doc) => doc.kind === 'keyframes' && !!doc.rig?.shapes?.some((s) => s.layer !== 'under'), title: m('anim-studio.draw-layers.shapes-over-the-icon'), order: 5 });
registerPanel({ tag: 'mc-anim-shapes-under-layers', place: 'layers', when: (doc) => doc.kind === 'keyframes' && !!doc.rig?.shapes?.some((s) => s.layer === 'under'), title: m('anim-studio.draw-layers.shapes-under-the-icon'), order: 30 });

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-shapes-layers': AnimShapesLayers;
    'mc-anim-shapes-under-layers': AnimShapesUnderLayers;
  }
}
