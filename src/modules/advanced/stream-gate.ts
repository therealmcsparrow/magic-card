import { unwatchOffscreen, watchOffscreen } from '../../icons/offscreen';

/*
 * Streaming backgrounds (layer-placement 1.0.0 "Streaming backgrounds", card-pause 1.0.0 rule 1).
 * A camera or video-bg that renders as a background decodes no frames while it is off screen, the page
 * is hidden or its card is paused (shared offscreen observer), and resumes on return. In flow it
 * behaves as before: the gate is always open. Chunk-only (magic-card-modules-extra.js).
 */

export type StreamKind = 'camera' | 'video-bg';

/**
 * Does the module around `el` render as a background layer? Explicit `data-mc-placement=background`
 * on its wrapper; a video-bg without placement is one too while the wrapper has sibling modules (the
 * legacy implicit background, same condition as the CSS). Flow, overlay and foreground are not.
 */
export function rendersAsBackground(el: Element, kind: StreamKind): boolean {
  const wrapper = el.closest('.mc-module-wrapper');
  if (!wrapper) return false;
  const placement = wrapper.getAttribute('data-mc-placement');
  if (placement) return placement === 'background';
  return kind === 'video-bg' && (!!wrapper.previousElementSibling || !!wrapper.nextElementSibling);
}

/** Open while the host may decode frames. `onChange` runs after `active` changed. */
export class StreamGate {
  /** The host renders as a background (the gate can close). */
  background = false;
  private _onScreen = false;
  private _watching = false;
  private _listening = false;

  constructor(
    private readonly _host: HTMLElement,
    private readonly _kind: StreamKind,
    private readonly _onChange: () => void,
  ) {}

  get active(): boolean {
    return !this.background || (this._onScreen && !document.hidden);
  }

  /** Re-read the placement (the wrapper attributes may land after connect) and follow it. */
  refresh(): void {
    const before = this.active;
    const bg = rendersAsBackground(this._host, this._kind);
    if (bg !== this.background) {
      this.background = bg;
      if (bg) this._start();
      else this._stop();
    }
    if (this.active !== before) this._onChange();
  }

  stop(): void {
    this._stop();
    this.background = false;
  }

  private _start(): void {
    this._onScreen = false;
    // no IntersectionObserver: nothing will report, the page-hidden rule still applies
    if (!watchOffscreen(this._host, this._report)) this._onScreen = true;
    else this._watching = true;
    document.addEventListener('visibilitychange', this._visibility);
    this._listening = true;
  }

  private _stop(): void {
    if (this._watching) unwatchOffscreen(this._host);
    this._watching = false;
    if (this._listening) document.removeEventListener('visibilitychange', this._visibility);
    this._listening = false;
  }

  private readonly _report = (on: boolean): void => {
    const before = this.active;
    this._onScreen = on;
    if (this.active !== before) this._onChange();
  };

  private readonly _visibility = (): void => {
    this._onChange();
  };
}
