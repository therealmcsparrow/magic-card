import { AsyncDirective, directive } from 'lit/async-directive.js';
import type { ChildPart } from 'lit/directive.js';
import type { HassEntity } from '../types';
import { TimerTick, timerCountdown, timerProgress } from './timer';

const running = (s: HassEntity | undefined) => {
  const p = timerProgress(s);
  return p?.state === 'active' && p.end !== undefined && p.end > Date.now();
};

/**
 * `${countdown(stateObj)}`: a timer's remaining time (H:MM:SS / M:SS), counting down every second
 * while it is active and its parent element is on screen (the shared ticker); paused shows the
 * frozen remaining time. '' for an idle timer or another entity. Put it inside an element of the
 * template (`<span>${countdown(s)}</span>`): that element is what is watched for being on screen.
 */
class Countdown extends AsyncDirective {
  private _state?: HassEntity;
  private _el?: Element;
  private _tick?: TimerTick;

  render(stateObj: HassEntity | undefined): string {
    return timerCountdown(stateObj) ?? '';
  }

  update(part: ChildPart, [stateObj]: [HassEntity | undefined]): string {
    this._state = stateObj;
    const parent = part.parentNode;
    const el = parent?.nodeType === 1 ? (parent as Element) : null;
    if (el !== this._el) {
      this._tick?.run(false);
      this._el = el ?? undefined;
      this._tick = el
        ? new TimerTick(el, () => {
            this.setValue(this.render(this._state));
            if (!running(this._state)) this._tick?.run(false);
          })
        : undefined;
    }
    this._tick?.run(this.isConnected && running(stateObj));
    return this.render(stateObj);
  }

  protected disconnected(): void {
    this._tick?.run(false);
  }

  protected reconnected(): void {
    this._tick?.run(running(this._state));
  }
}

export const countdown = directive(Countdown);
