import { LitElement, html, css, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { loadPathCanvas } from '../../path-canvas/loader';
import { PATH_CANVAS_OVERLAY_REVISION, PATH_CANVAS_TAG, type CanvasPlacement, type PathCanvasChunk } from '../../contracts/path-canvas';
import type { StageInfo } from '../slots';
import { t, m, type MessageId } from '../i18n';

/** Where the path canvas stands: not asked for yet, loading, ready, the chunk failed, or the page holds an older canvas element. */
export type CanvasState = 'idle' | 'loading' | 'ready' | 'failed' | 'old';

/** Whether the page's <mc-path-canvas> has overlay mode (an older Magic Card version defined it first, or not at all). */
export const overlayRevisionOk = (): boolean => {
  const ctor = typeof customElements === 'undefined' ? undefined : (customElements.get(PATH_CANVAS_TAG) as { contractRevision?: number } | undefined);
  return (ctor?.contractRevision ?? 0) >= PATH_CANVAS_OVERLAY_REVISION;
};

declare const __webpack_require__: { u: (id: unknown) => string } | undefined;
let attempts = Date.now();

/**
 * loadPathCanvas() for a second try. Chrome and Safari remember a failed import() per URL, so the chunk is asked for under a
 * number not used before on this page. webpack reads the chunk URL inside the import() call, so the number only needs to live
 * for that one synchronous call.
 */
function loadAgain(): ReturnType<typeof loadPathCanvas> {
  if (typeof __webpack_require__ === 'undefined') return loadPathCanvas();
  const w = __webpack_require__;
  const u = w.u;
  const n = ++attempts;
  w.u = (id) => {
    const url = u(id);
    return `${url}${url.includes('?') ? '&' : '?'}r=${n}`;
  };
  try {
    return loadPathCanvas();
  } finally {
    w.u = u;
  }
}

/** The canvas names its steps in English; they are looked up here so the undo list reads in the user's language. */
const STEPS: Record<string, MessageId> = {
  'Add point': m('Add point'),
  'Move point': m('Move point'),
  'Move points': m('Move points'),
  'Move path': m('Move path'),
  'Move handle': m('Move handle'),
  'Delete point': m('Delete point'),
  'Delete points': m('Delete points'),
  'Delete handle': m('Delete handle'),
  'Close path': m('Close path'),
  'Change point type': m('Change point type'),
};

/** A step name from the canvas in the user's language (an unknown one keeps its English text). */
export const stepLabel = (label: string): string => (STEPS[label] ? t(STEPS[label]) : label);

/** A box on screen from a box in the unscaled card (x, y, width, height from the card's top-left) and the stage geometry. */
export function placeBox(stage: StageInfo | undefined, box: { x: number; y: number; width: number; height: number }): CanvasPlacement | undefined {
  const s = stage?.screen;
  if (!stage || !s || !(stage.scale > 0)) return undefined;
  const k = stage.scale;
  return { left: s.left + box.x * k, top: s.top + box.y * k, width: box.width * k, height: box.height * k };
}

/**
 * Base of the two stage hosts of <mc-path-canvas> (motion path, Draw). It sits in the stage's `canvas` slot, outside the
 * scaled card, loads the canvas chunk when a subclass asks, and shows a notice with its action when that fails or when
 * the page's canvas element is too old. There is no fallback editor. While a canvas is active `touch-action: none` keeps
 * the browser from panning or zooming the page under a drag.
 */
export abstract class CanvasHost extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      --ch-accent: var(--primary-color, #03a9f4);
      --ch-action: color-mix(in srgb, var(--ch-accent) 70%, #000);
      --ch-ink: var(--primary-text-color, #212121);
      --ch-surface: var(--card-background-color, #fff);
    }
    :host([disabled]) {
      opacity: 0.55;
    }
    .layer,
    mc-path-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .layer {
      pointer-events: none;
      overflow: visible;
    }
    .host-notice {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: calc(100% - 24px);
      margin: 0;
      padding: 6px 6px 6px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 9999px;
      background: var(--ch-surface);
      color: var(--ch-ink);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.16),
        0 2px 6px rgba(0, 0, 0, 0.08);
      font-size: 0.8125rem;
      pointer-events: auto;
    }
    .host-notice button {
      min-height: 32px;
      padding: 0 12px;
      border: 0;
      border-radius: 9999px;
      background: var(--ch-action);
      color: var(--text-primary-color, #fff);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .host-notice button:focus-visible {
      outline: 2px solid var(--ch-ink);
      outline-offset: 2px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `;

  /** The chunk's path maths and drawing helpers, once it has loaded. */
  protected chunk?: PathCanvasChunk;
  @state() protected canvasState: CanvasState = 'idle';
  private _loading?: Promise<void>;
  private _again = false;

  /** Load the canvas chunk (once at a time) and check the page's element; a failure leaves a notice with a retry. */
  protected ensureCanvas(): void {
    if (this.canvasState !== 'idle' || this._loading) return;
    this.canvasState = 'loading';
    const again = this._again;
    this._again = false;
    this._loading = (again ? loadAgain() : loadPathCanvas()).then((chunk) => {
      this._loading = undefined;
      if (!chunk) this.canvasState = 'failed';
      else if (!overlayRevisionOk()) this.canvasState = 'old';
      else {
        this.chunk = chunk;
        this.canvasState = 'ready';
        if (again) void this.updateComplete.then(() => this.toolsReady());
      }
    });
  }

  protected retry(): void {
    this._again = true;
    this.canvasState = 'idle';
    this.ensureCanvas();
  }

  /** The tools came in after Try again: the button that had focus is gone, so a subclass moves focus and says so. */
  protected toolsReady(): void {}

  /** Reload the page once the user has agreed to lose what is not saved. */
  private _reload(): void {
    if (confirm(t('Reloading the page discards changes that are not saved. Reload anyway?'))) location.reload();
  }

  /** The notice for a failed load or an older canvas element; nothing while loading or ready. */
  protected renderNotice(): TemplateResult | typeof nothing {
    if (this.canvasState === 'failed')
      return html`<p class="host-notice" role="alert">${t("Couldn't load the drawing tools.")}<button type="button" @click=${() => this.retry()}>${t('Try again')}</button></p>`;
    if (this.canvasState === 'old')
      return html`<p class="host-notice" role="alert">
        ${t('The drawing tools on this page are from another Magic Card version. Reload the page to draw here.')}<button type="button" @click=${() => this._reload()}>${t('Reload page')}</button>
      </p>`;
    return nothing;
  }
}
