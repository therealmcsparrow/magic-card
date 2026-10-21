import type { EditorPlace, LocationChange, PopupHandle } from './popup-nav';

/**
 * The one coordinator of every Magic Card pop-up on the page: one set of window listeners for the
 * URL (hashchange, popstate and HA's `location-changed`, fired by its navigate action after
 * pushState), and at most one open pop-up (opening another closes the first). It lives in the `popup` chunk and nowhere
 * else: a second copy would be a second, empty coordinator.
 */
class PopupCoordinator {
  private readonly _handles = new Set<PopupHandle>();
  private _open?: PopupHandle;

  register(handle: PopupHandle): void {
    if (!this._handles.size) this._listen(true);
    this._handles.add(handle);
  }

  unregister(handle: PopupHandle): void {
    this._handles.delete(handle);
    if (this._open === handle) this._open = undefined;
    if (!this._handles.size) this._listen(false);
  }

  /** `handle` opens: the pop-up open so far closes. */
  willOpen(handle: PopupHandle): void {
    const other = this._open;
    this._open = handle;
    if (other && other !== handle) other.closeForOther();
  }

  didClose(handle: PopupHandle): void {
    if (this._open === handle) this._open = undefined;
  }

  get openHandle(): PopupHandle | undefined {
    return this._open;
  }

  /** "Close pop-up" action: closes the open pop-up; false when none is open. */
  closeOpen(): boolean {
    const open = this._open;
    if (!open) return false;
    open.closeByAction();
    return true;
  }

  /** Pop-up IDs of the Magic Cards on the page (action editor suggestions). */
  knownIds(): string[] {
    const ids = new Set<string>();
    for (const h of this._handles) {
      const id = h.popupId();
      if (id) ids.add(id);
    }
    return [...ids].sort((a, b) => a.localeCompare(b));
  }

  /**
   * "Preview pop-up" in the editor: opens the pop-up of the card previewed by that editor, the
   * studio canvas card when `canvas`, else HA's preview card. False when there is none.
   */
  preview(canvas: boolean): boolean {
    const editors = [...this._handles].filter((h) => h.isPopup() && h.editorPlace());
    const order: EditorPlace[] = canvas ? ['canvas', 'card-editor', 'dashboard-edit'] : ['card-editor', 'canvas', 'dashboard-edit'];
    const pick = order.map((place) => editors.find((h) => h.editorPlace() === place)).find(Boolean);
    if (!pick) return false;
    pick.openPreview();
    return true;
  }

  private _listen(on: boolean): void {
    if (typeof window === 'undefined') return;
    const method = on ? 'addEventListener' : 'removeEventListener';
    window[method]('hashchange', this._onHashChange);
    window[method]('popstate', this._onPopState);
    window[method]('location-changed', this._onLocationChanged);
  }

  private _notify(change: LocationChange): void {
    for (const h of [...this._handles]) h.locationChanged(change);
  }

  private _onHashChange = (): void => this._notify('push');
  private _onPopState = (): void => this._notify('pop');
  private _onLocationChanged = (e: Event): void => {
    const replace = !!(e as CustomEvent<{ replace?: boolean } | null>).detail?.replace;
    this._notify(replace ? 'replace' : 'push');
  };
}

export const popupCoordinator = new PopupCoordinator();
