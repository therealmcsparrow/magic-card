import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorSystem } from '../../css/editor-stack';
import type { AnimationDoc } from '../model';
import { registerPanel, type StageInfo, type StudioSelection } from '../slots';
import type { ExportPiece } from '../svg-export';
import { TOOL_INFO, activeTool, drawToolActive, drawStore, isDrawTool, isRigRef, rigPieces, sourceViewBox, type DrawTool } from './draw-store';
import './draw-svg-dialog';
// the other drawing panels register with the tools
import './draw-layers';
import './draw-host';
import './shape-inspector';
import type { AnimSvgDialog } from './draw-svg-dialog';
import { t, m } from '../i18n';

/*
 * Drawing on the icon (spec section C): mc-anim-draw-toolbar is the Draw button group on the stage (select, pen, line,
 * rectangle, ellipse, freehand, erase, motion path; import SVG and save as icon). Choosing a tool emits
 * selection-change { kind: 'tool', tool }. The tools themselves run in mc-anim-draw-host (draw-host.ts).
 */

const emitSelection = (el: HTMLElement, selection: StudioSelection): void => {
  el.dispatchEvent(new CustomEvent('selection-change', { bubbles: true, composed: true, detail: { selection } }));
};

// ── the toolbar ──

const TOOLBAR_TOOLS: DrawTool[] = ['select', 'pen', 'line', 'rect', 'ellipse', 'freehand', 'erase', 'motion'];

@customElement('mc-anim-draw-toolbar')
export class AnimDrawToolbar extends LitElement {
  static styles = [
    editorSystem,
    css`
      :host {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        pointer-events: none;
      }
      /* what to do next with the tool (the overlay's hint), under the bar and off the card */
      .hint {
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 4px 12px;
        border-radius: 9999px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        font-size: 0.75rem;
        font-weight: 500;
        text-align: center;
      }
      .bar {
        pointer-events: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 3px;
        border-radius: 10px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .bar .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 7px;
      }
      .bar .icon-btn[aria-pressed='true'] {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
        color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
      }
      .sep {
        width: 1px;
        align-self: stretch;
        margin: 4px 3px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      /* the dialog's window sits under this host, so it takes presses itself instead of passing them to the canvas */
      mc-anim-svg-dialog {
        pointer-events: auto;
      }
      .open {
        pointer-events: auto;
        height: 36px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
    `,
  ];

  @property({ attribute: false }) doc?: AnimationDoc;
  @property({ attribute: false }) selection: StudioSelection = { kind: 'none' };
  @property({ type: Boolean }) disabled = false;
  @property({ attribute: false }) tile?: string;
  @property({ type: Number }) time = 0;
  @property({ attribute: false }) hass?: unknown;
  @property({ attribute: false }) library?: unknown;
  @property({ attribute: false }) stage?: StageInfo;
  /** The icon's pieces for "Save as icon"; resolved from the rig / tile icon when not given. */
  @property({ attribute: false }) pieces?: ExportPiece[];

  @state() private _resolved?: { pieces: ExportPiece[]; viewBox: string };
  private _key = '';
  private _offHint?: () => void;

  connectedCallback(): void {
    super.connectedCallback();
    this._offHint = drawStore.onHint(() => this.requestUpdate());
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._offHint?.();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if ((changed.has('doc') || changed.has('tile')) && this.doc && !this.pieces) {
      const key = `${this.doc.rig?.svg ?? this.doc.rig?.icon ?? ''}|${this.tile ?? ''}`;
      if (key !== this._key) {
        this._key = key;
        void rigPieces(this.doc, this.tile).then((r) => {
          if (this._key === key) this._resolved = r;
        });
      }
    }
  }

  private get _dialog(): AnimSvgDialog | null {
    return this.renderRoot.querySelector('mc-anim-svg-dialog');
  }

  /** Open "Save as icon" (tests, shortcuts; `animated`: on the animated SVG). */
  openExport(animated = false): void {
    this._dialog?.openExport(animated);
  }

  /** Open "Import SVG" (tests, shortcuts). */
  openImport(text = '', name = ''): void {
    this._dialog?.openImport(text, name);
  }

  private _choose(tool: DrawTool): void {
    const sel = this.selection;
    const current = this.doc && drawToolActive(this.doc, sel) ? activeTool(sel) : undefined;
    if (current === tool && sel.kind === 'tool') {
      emitSelection(this, { kind: 'none' });
      return;
    }
    const target = isRigRef(sel.target) ? sel.target : undefined;
    emitSelection(this, { kind: 'tool', tool, ...(target ? { target } : {}) });
  }

  protected render(): TemplateResult {
    const doc = this.doc;
    if (!doc || doc.kind !== 'keyframes') return html``;
    const active = drawToolActive(doc, this.selection);
    const tool = active ? activeTool(this.selection) : undefined;
    const hint = active ? drawStore.hint : '';
    const pieces = this.pieces ?? this._resolved?.pieces ?? [];
    const dialog = html`<mc-anim-svg-dialog
      .doc=${doc}
      .pieces=${pieces}
      .viewBox=${sourceViewBox(this.doc?.rig, this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;
    if (!active) {
      return html`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${() => this._choose('select')}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>${t('Draw')}
        </button>
        ${dialog}`;
    }
    const canMotion = isRigRef(this.selection.target);
    return html`<div class="bar" role="toolbar" aria-label=${t('Drawing tools')}>
        ${TOOLBAR_TOOLS.map((id) => {
          const info = TOOL_INFO[id];
          const off = this.disabled || (id === 'motion' && !canMotion);
          return html`<button
            type="button"
            class="icon-btn tool"
            data-tool=${id}
            aria-pressed=${tool === id ? 'true' : 'false'}
            aria-label=${t(info.label)}
            title=${id === 'motion' && !canMotion ? t('Motion path: select a part or shape first') : t(info.label)}
            ?disabled=${off}
            @click=${() => this._choose(id)}
          >
            <ha-icon icon=${info.icon}></ha-icon>
          </button>`;
        })}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label=${t('Import SVG')} title=${t('Import SVG')} ?disabled=${this.disabled} @click=${() => this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label=${t('Save as icon')} title=${t('Save as icon')} ?disabled=${this.disabled} @click=${() => this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label=${t('Stop drawing')} title=${t('Stop drawing')} @click=${() => emitSelection(this, { kind: 'none' })}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${hint ? html`<p class="hint">${hint}</p>` : nothing}
      ${dialog}`;
  }
}

// ── panels ──

registerPanel({ tag: 'mc-anim-draw-toolbar', place: 'stage-tool', when: (doc) => doc.kind === 'keyframes', title: m('Draw'), order: 90, dock: 'top' });

export { isDrawTool };

declare global {
  interface HTMLElementTagNameMap {
    'mc-anim-draw-toolbar': AnimDrawToolbar;
  }
}
