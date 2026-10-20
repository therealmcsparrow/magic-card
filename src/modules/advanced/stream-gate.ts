import { unwatchOffscreen, watchOffscreen } from '../../icons/offscreen';

/*
 * Streaming backgrounds (layer-placement 1.0.0 "Streaming backgrounds", card-pause 1.0.0 rule 1).
 * A camera or video-bg that renders as a background decodes no frames while it is off screen, the page
 * is hidden or its card is paused (shared offscreen observer), and resumes on return. In flow it
 * behaves as before: the gate is always open, except for `pauseInFlow` (a video-bg): there it follows
 * the shared observer too (off screen, card paused) but not the page-hidden rule. Chunk-only (magic-card-modules-extra.js).
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
  /** _start ran (also true when there is no IntersectionObserver and nothing is watched). */
  private _watchAsked = false;
  private _listening = false;

  /** What the observer watches: the module wrapper (always a box); the host may be display:contents, which never reports on screen. */
  private _watched: HTMLElement;

  constructor(
    private readonly _host: HTMLElement,
    private readonly _kind: StreamKind,
    private readonly _onChange: () => void,
    private readonly _pauseInFlow = false,
  ) {
    this._watched = _host;
  }

  get active(): boolean {
    if (!this._watching && !this.background) return true;
    return this._onScreen && (!this.background || !document.hidden);
  }

  /** Re-read the placement (the wrapper attributes may land after connect) and follow it. */
  refresh(): void {
    const before = this.active;
    const bg = rendersAsBackground(this._host, this._kind);
    this.background = bg;
    if (bg || this._pauseInFlow) {
      if (!this._watchAsked) this._start();
      if (bg && !this._listening) this._listen();
      if (!bg && this._listening) this._unlisten();
    } else if (this._watchAsked) {
      this._stop();
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
    this._watched = (this._host.closest('.mc-module-wrapper') as HTMLElement | null) ?? this._host;
    if (!watchOffscreen(this._watched, this._report)) this._onScreen = true;
    else this._watching = true;
    this._watchAsked = true;
  }

  private _listen(): void {
    document.addEventListener('visibilitychange', this._visibility);
    this._listening = true;
  }

  private _unlisten(): void {
    document.removeEventListener('visibilitychange', this._visibility);
    this._listening = false;
  }

  private _stop(): void {
    if (this._watching) unwatchOffscreen(this._watched);
    this._watching = false;
    this._watchAsked = false;
    if (this._listening) this._unlisten();
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
