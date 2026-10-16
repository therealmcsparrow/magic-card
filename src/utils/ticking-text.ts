import { noChange } from 'lit';
import { AsyncDirective, directive, PartInfo, PartType } from 'lit/async-directive.js';

/**
 * Text that updates itself on a timer aligned to the interval (every second / minute), without
 * re-rendering the template it is in: the clock's time and date. The timer stops while the part is
 * disconnected and restarts (with the current text) when it is reconnected.
 */
class TickingText extends AsyncDirective {
  private _text?: () => string;
  private _ms = 60_000;
  private _timer?: ReturnType<typeof setTimeout>;
  private _shown?: string;

  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.CHILD) throw new Error('tickingText: child position only');
  }

  render(text: () => string, _ms: number): string {
    return text();
  }

  update(_part: unknown, [text, ms]: [() => string, number]): string | typeof noChange {
    this._text = text;
    if (ms !== this._ms || this._timer === undefined) {
      this._ms = ms;
      this._schedule();
    }
    const next = text();
    if (next === this._shown) return noChange;
    this._shown = next;
    return next;
  }

  private _clear(): void {
    if (this._timer !== undefined) clearTimeout(this._timer);
    this._timer = undefined;
  }

  private _schedule(): void {
    this._clear();
    if (!this.isConnected || !(this._ms > 0)) return;
    const delay = this._ms - (Date.now() % this._ms) + 20;
    this._timer = setTimeout(() => {
      this._timer = undefined;
      this._tick();
      this._schedule();
    }, delay);
  }

  private _tick(): void {
    const next = this._text?.();
    if (next === undefined || next === this._shown) return;
    this._shown = next;
    this.setValue(next);
  }

  protected disconnected(): void {
    this._clear();
  }

  protected reconnected(): void {
    this._tick();
    this._schedule();
  }
}

/** `text()` now, then again every `ms` (aligned to the clock) while connected. */
export const tickingText = directive(TickingText);
