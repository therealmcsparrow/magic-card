import { html, nothing } from 'lit';
import type { LitElement, TemplateResult } from 'lit';
import { t } from './i18n';
import { motionCount, setCardPaused } from '../icons/offscreen';
import { reducedMotion } from './sequence-player';
import { PAUSE_ATTRIBUTE, PAUSE_EVENT, PAUSE_STORAGE_PREFIX } from '../contracts/card-pause';
import type { CardPauseKeys, PauseButtonCorner, PauseButtonMode } from '../contracts/card-pause';

/*
 * The viewer's "Pause motion" button of one card (contract card-pause 1.0.0). The motion itself is
 * stopped by the shared offscreen observer (setCardPaused) and one CSS rule; this class holds the
 * state, remembers it per page and card, and renders the button.
 */
const MODES: readonly string[] = ['auto', 'always', 'hidden'];
const CORNERS: readonly string[] = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
/** mdi:pause, mdi:play */
const PAUSE_PATH = 'M14,19H18V5H14M6,19H10V5H6V19Z';
const PLAY_PATH = 'M8,5.14V19.14L19,12.14L8,5.14Z';

/** FNV-1a (32 bit) as 8 hex digits. */
function fnv(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/** localStorage can be missing, full or blocked: the pause then lasts the page visit. */
function storage(fn: (s: Storage) => void): void {
  try {
    fn(localStorage);
  } catch {
    /* not remembered */
  }
}

export class CardPause {
  paused = false;
  private _key = '';
  private _mode: PauseButtonMode = 'auto';
  private _moves = false;
  private _shown = false;
  private _timer?: number;

  constructor(private readonly _host: LitElement) {}

  /** A card config arrived: the same config keeps its state, an edited one starts as remembered (playing). */
  config(config: object): void {
    const key = PAUSE_STORAGE_PREFIX + location.pathname + ':' + fnv(JSON.stringify(config));
    if (key === this._key) return;
    this._key = key;
    let on = false;
    storage((s) => (on = s.getItem(key) === '1'));
    this._set(on);
  }

  private _set(on: boolean): void {
    if (on === this.paused) return;
    this.paused = on;
    this._apply();
    this._host.requestUpdate();
    this._host.dispatchEvent(new CustomEvent(PAUSE_EVENT, { detail: { paused: on }, bubbles: true, composed: true }));
  }

  /** Start of a render: read the keys, apply the state to the host and the observer. True while paused. */
  begin(c: CardPauseKeys): boolean {
    this._mode = MODES.includes(String(c.pause_button)) ? (c.pause_button as PauseButtonMode) : 'auto';
    this._moves = false;
    return this._apply();
  }

  /** Host attribute and observer; hidden means the card plays (nobody could resume it). */
  private _apply(): boolean {
    const on = this.paused && this._mode !== 'hidden';
    this._host.toggleAttribute(PAUSE_ATTRIBUTE, on);
    setCardPaused(this._host, on);
    return on;
  }

  /** The render met something that moves (reduced motion keeps animations and scenes still). */
  moving(): void {
    if (!reducedMotion()) this._moves = true;
  }

  private _toggle = (e: Event): void => {
    e.stopPropagation();
    const on = !this.paused;
    this._set(on);
    storage((s) => (on ? s.setItem(this._key, '1') : s.removeItem(this._key)));
  };

  private _stop = (e: Event): void => e.stopPropagation();

  /** Last child of ha-card. Under `auto` the observer count has no change event: look again after the render. */
  button(c: CardPauseKeys, on: boolean): TemplateResult | typeof nothing {
    const auto = this._mode === 'auto';
    const show = this._mode === 'always' || (auto && this._wants(on));
    this._shown = show;
    if (auto) this._recheck();
    if (!show) return nothing;
    const corner = CORNERS.includes(String(c.pause_button_corner)) ? (c.pause_button_corner as PauseButtonCorner) : 'bottom-left';
    const label = t('Pause motion');
    return html`<button type="button" class="mc-pause" data-corner=${corner} ?data-auto=${auto} aria-pressed=${on ? 'true' : 'false'}
      aria-label=${label} title=${label} @pointerdown=${this._stop} @click=${this._toggle}
      ><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d=${on ? PLAY_PATH : PAUSE_PATH}></path></svg></button>`;
  }

  private _wants(on: boolean): boolean {
    return on || this._moves || motionCount(this._host) > 0;
  }

  private _recheck(): void {
    if (this._timer !== undefined) return;
    this._timer = window.setTimeout(() => {
      this._timer = undefined;
      if (this._host.isConnected && this._wants(this.paused && this._mode !== 'hidden') !== this._shown) this._host.requestUpdate();
    }, 0);
  }

  disconnected(): void {
    window.clearTimeout(this._timer);
    this._timer = undefined;
  }
}
