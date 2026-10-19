import { html, nothing, TemplateResult } from 'lit';
import type { TrackOptionsLook } from '../contracts/slider-look';
import { pauseOffscreen } from '../icons/offscreen';
import { snapValue } from './entity-control';

/** Events of an interactive control that must not reach the module wrapper (its tap / hold actions). */
export const stopControlEvent = (e: Event): void => e.stopPropagation();

/** A touch moves this far along the track before the slider follows it (else it may be a scroll). */
const DRAG_INTENT_PX = 8;

/** (slider-look 1.0.0) The look hooks (parts, onInput, onRelease, snap, nextValue) are additive and optional. */
export interface TrackOptions extends TrackOptionsLook {
  /** Current value (undefined: nothing to show, the bar is empty). */
  value: number | undefined;
  min: number;
  max: number;
  step: number;
  vertical?: boolean;
  disabled?: boolean;
  /** Accessible name. */
  label: string;
  /** Accessible value text ("40%", "21.5 °C"). */
  valueText?: string;
  /** Inline style vars (--mc-slider-color, --mc-slider-background, ...). */
  style?: string;
  className?: string;
  /** A value was picked (pointer released, or a key pressed). */
  onCommit: (value: number) => void;
}

/**
 * The tile slider track shared by the slider and light modules: drag (pointer capture once a touch
 * moved along the track, the bar follows the pointer, the value is committed on release; the page
 * still scrolls across it), keyboard (arrows step, Page Up / Down
 * a tenth, Home / End), ARIA slider semantics. Its events never reach the module wrapper.
 */
export function renderTrack(o: TrackOptions): TemplateResult {
  const range = o.max - o.min;
  const fraction = o.value === undefined || range <= 0 ? 0 : Math.max(0, Math.min(1, (o.value - o.min) / range));

  const fromPointer = (el: HTMLElement, e: PointerEvent): number => {
    const rect = el.getBoundingClientRect();
    if (o.vertical) return rect.height ? Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)) : 0;
    return rect.width ? Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) : 0;
  };
  const clamp = (v: number) => Math.max(o.min, Math.min(o.max, v));
  const toValue = (f: number) => (o.snap ? clamp(o.snap(o.min + f * range)) : snapValue(o.min + f * range, o.min, o.max, o.step));

  const onPointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    if (o.disabled || (e.button !== undefined && e.button !== 0)) return;
    const el = e.currentTarget as HTMLElement;
    // the dragged value goes on the bar: a re-render mid-drag (a state update) rewrites the track's
    // style attribute, never the bar's, so the bar does not jump back to the entity value
    const bar = el.querySelector<HTMLElement>('.mc-tile-slider-bar');
    const show = (f: number) => {
      const v = toValue(f);
      bar?.style.setProperty('--slider-value', String((v - o.min) / range));
      o.onInput?.(v);
    };
    const start = { x: e.clientX, y: e.clientY };
    // touch / pen: the page may still scroll across the track (touch-action pan-y / pan-x; the
    // browser then sends pointercancel), so the bar only follows after a small move along it
    let dragging = false;
    const startDrag = (ev: PointerEvent) => {
      dragging = true;
      try {
        el.setPointerCapture?.(ev.pointerId);
      } catch {
        // the pointer is gone (or synthetic): the drag still follows moves over the track
      }
      el.classList.add('mc-dragging');
      show(fromPointer(el, ev));
    };
    if (e.pointerType === 'mouse') startDrag(e);
    const onMove = (ev: PointerEvent) => {
      if (!dragging) {
        const along = Math.abs(o.vertical ? ev.clientY - start.y : ev.clientX - start.x);
        const across = Math.abs(o.vertical ? ev.clientX - start.x : ev.clientY - start.y);
        if (along < DRAG_INTENT_PX || along < across) return;
        startDrag(ev);
        return;
      }
      show(fromPointer(el, ev));
    };
    const done = (ev: PointerEvent, commit: boolean) => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
      el.classList.remove('mc-dragging');
      bar?.style.removeProperty('--slider-value');
      // a release is a drag or a tap on the track; a cancelled pointer (the page scrolled) never calls.
      // The track shows the picked value until the new state renders it.
      if (commit) {
        const v = toValue(fromPointer(el, ev));
        el.style.setProperty('--slider-value', String((v - o.min) / range));
        o.onCommit(v);
      }
      o.onRelease?.();
    };
    const onUp = (ev: PointerEvent) => {
      ev.stopPropagation();
      done(ev, true);
    };
    const onCancel = (ev: PointerEvent) => done(ev, false);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (o.disabled) return;
    const current = o.value ?? o.min;
    const big = Math.max(o.step, range / 10);
    const next: Record<string, number> = {
      ArrowRight: current + o.step,
      ArrowUp: current + o.step,
      ArrowLeft: current - o.step,
      ArrowDown: current - o.step,
      PageUp: current + big,
      PageDown: current - big,
      Home: o.min,
      End: o.max,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    const custom = o.nextValue?.(current, e.key);
    const v = custom === undefined ? snapValue(next[e.key], o.min, o.max, o.step) : clamp(custom);
    if (v !== o.value) o.onCommit(v);
  };

  return html`
    <div
      class="mc-tile-slider ${o.vertical ? 'mc-tile-slider--vertical' : ''} ${o.className ?? ''}"
      role="slider"
      tabindex=${o.disabled ? -1 : 0}
      aria-label=${o.label}
      aria-valuemin=${o.min}
      aria-valuemax=${o.max}
      aria-valuenow=${o.value ?? nothing}
      aria-valuetext=${o.valueText || nothing}
      aria-orientation=${o.vertical ? 'vertical' : 'horizontal'}
      aria-disabled=${o.disabled ? 'true' : 'false'}
      style="--slider-value: ${fraction}; touch-action: ${o.vertical ? 'pan-x' : 'pan-y'}; ${o.style ?? ''}"
      @pointerdown=${onPointerDown}
      @pointerup=${stopControlEvent}
      @click=${stopControlEvent}
      @keydown=${onKeyDown}
      ${o.parts ? pauseOffscreen() : nothing}
    >
      <div class="mc-tile-slider-background"></div>
      <div class="mc-tile-slider-bar"></div>${o.parts ?? nothing}
    </div>
  `;
}
