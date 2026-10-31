import type { SliderModuleConfig } from '../types';
import { shapeClip } from '../card/shape-clip';
import { resolveShape, type ResolvedShape } from '../card/shape-resolve';
import { customShapesReady, loadCustomShapes } from '../utils/shape-custom-loader';
import { shapePath } from '../utils/shape-path';

// track_shape: the track box (.mc-sl-box) is clipped to the shape from the card shape system, on the inner box only so the
// focus ring stays whole. The outline is a 2 px stroke in the track colour at 40 %. The box size is measured on mount,
// resize and after each render; a ResizeObserver exists only while the box does.

/** The configured shape, or undefined for none / unknown. A custom shape starts its builder load and asks for a re-render when it lands. */
export function trackShape(c: Partial<SliderModuleConfig>, onReady?: () => void): ResolvedShape | undefined {
  if (c.track_shape === 'custom' && !customShapesReady()) void loadCustomShapes().then(() => onReady?.());
  return resolveShape({ shape: c.track_shape, shape_options: c.track_shape_options });
}

/** One per slider: knows the box element and keeps its clip and outline current. */
export class ShapeBox {
  shape?: ResolvedShape;
  private box?: Element;
  private watcher?: ResizeObserver;

  /** Stable `ref()` callback for the box: Lit calls it with the element, and with undefined when it goes. */
  readonly ref = (el?: Element): void => {
    this.watcher?.disconnect();
    this.watcher = undefined;
    // the box can outlive the directive (the shape was removed): leave it unclipped
    if (!el) (this.box as HTMLElement | undefined)?.style.removeProperty('clip-path');
    this.box = el;
    if (!el) return;
    if (typeof ResizeObserver !== 'undefined') {
      this.watcher = new ResizeObserver(() => this.paint());
      this.watcher.observe(el);
    }
    this.paint();
    // the outline path is committed after the box: draw it once the render is done
    queueMicrotask(() => this.paint());
  };

  /** The shape of this render; the clip follows after the render has committed. */
  set(shape: ResolvedShape | undefined): void {
    this.shape = shape;
    if (this.box) queueMicrotask(() => this.paint());
  }

  paint(): void {
    const box = this.box as HTMLElement | undefined;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const w = Math.round(r.width * 100) / 100;
    const h = Math.round(r.height * 100) / 100;
    const s = this.shape;
    const res = s && w > 0 && h > 0 ? shapePath(s.kind, w, h, s.options) : undefined;
    if (res) box.style.setProperty('clip-path', shapeClip(res.d));
    else box.style.removeProperty('clip-path');
    box.querySelector('.mc-sl-sh path')?.setAttribute('d', res?.d ?? '');
  }
}
