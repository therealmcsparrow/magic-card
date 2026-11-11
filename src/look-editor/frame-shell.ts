import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { FRAME_WIDE_MIN_PX, type FrameMeasure, type FrameModifiedChange, type StudioFrameElement } from '../contracts/ui-kit';

// Wiring both look editors share with <mc-ui-studio-frame>: the width class, the drawer at a wide frame, Modified only and stage work.

type Host = ReactiveControllerHost & HTMLElement & { renderRoot: HTMLElement | DocumentFragment };

/** Ruler size of the preview stage in stage units; the tiles scale themselves, so the numbers are fixed. */
export const LOOK_STAGE_MEASURE: FrameMeasure = { width: 320, height: 160, grid: 20, selection: null, zoom: 1 };

export class FrameShell implements ReactiveController {
  /** True below FRAME_WIDE_MIN_PX; the bar then carries a Settings button that opens the sheet. */
  narrow = false;
  /** Mirrors the frame's "Modified only" switch; the editor renders only the groups that hold a changed key. */
  modifiedOnly = false;
  private _observer: ResizeObserver | null = null;
  private _width = 0;
  private _sync = false;

  constructor(private readonly _host: Host) {
    _host.addController(this);
  }

  hostConnected(): void {
    this._observer = new ResizeObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) this._measure(last.contentRect.width);
    });
    this._observer.observe(this._host);
    this._measure(this._host.getBoundingClientRect().width);
  }

  hostDisconnected(): void {
    this._observer?.disconnect();
    this._observer = null;
  }

  hostUpdated(): void {
    if (!this._sync) return;
    const frame = this.frame();
    if (!frame) return;
    this._sync = false;
    if (this.narrow) frame.closeDrawer('selection');
    else frame.openDrawer(null, 'selection');
  }

  frame(): StudioFrameElement | null {
    return this._host.renderRoot.querySelector<StudioFrameElement>('mc-ui-studio-frame');
  }

  /** A frame wider than the push breakpoint shows its drawer from the start; a narrower one starts on the preview. */
  private _measure(width: number): void {
    if (width <= 0) return;
    const narrow = width < FRAME_WIDE_MIN_PX;
    const first = this._width === 0;
    this._width = width;
    if (!first && narrow === this.narrow) return;
    this.narrow = narrow;
    this._sync = true;
    this._host.requestUpdate();
  }

  readonly onModified = (e: Event): void => {
    this.modifiedOnly = (e as CustomEvent<FrameModifiedChange>).detail.on;
    this._host.requestUpdate();
  };

  /** The Settings button follows the drawer, so it re-renders when the drawer opens or closes. */
  readonly onDrawer = (): void => this._host.requestUpdate();

  /** Choosing a look in the tiles is configuring, so only work on the stage itself closes an unpinned drawer. */
  readonly onStage = (e: Event): void => {
    if (e.composedPath().some((n) => n instanceof HTMLElement && n.localName === 'mc-ui-tile-group')) return;
    this.frame()?.stageWork();
  };

  /** Settings button: opens the sheet at a narrow frame, toggles the push column at a wide one. */
  readonly onSettings = (e: Event): void => {
    const frame = this.frame();
    if (!frame) return;
    if (frame.drawerOpen && !frame.narrow) frame.closeDrawer('user');
    else frame.openDrawer(e.currentTarget as HTMLElement, 'user');
  };
}
