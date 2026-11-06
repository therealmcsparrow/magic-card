import type { ReactiveController, ReactiveControllerHost } from 'lit';

// EscGuard: the three-layer Escape rule of svg-editor 1.0.0; ancestor <dialog> cancels are ignored while the host is connected.
export class EscGuard implements ReactiveController {
  private dialogs: Array<[HTMLDialogElement, EventListener]> = [];

  constructor(private readonly host: ReactiveControllerHost & HTMLElement) {
    host.addController(this);
  }

  hostConnected(): void {
    this.release();
    for (let n: Node | null = this.host.parentNode; n; n = n.parentNode ?? (n as ShadowRoot).host ?? null) {
      if (n instanceof HTMLDialogElement) {
        const f: EventListener = (e) => e.preventDefault();
        n.addEventListener('cancel', f);
        this.dialogs.push([n, f]);
      }
    }
  }

  hostDisconnected(): void {
    this.release();
  }

  /** Escape handled by the host: nothing above it sees the key. */
  static stop(e: KeyboardEvent): void {
    e.preventDefault();
    e.stopPropagation();
  }

  private release(): void {
    for (const [d, f] of this.dialogs) d.removeEventListener('cancel', f);
    this.dialogs = [];
  }
}
