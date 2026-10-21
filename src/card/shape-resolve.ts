import type { DesignConfig, ShapeKind, ShapeOptions } from '../types';
import type { CustomShapeOptions, ShapeLookup } from '../contracts/custom-shape';
import { LIBRARY_CHANGED_EVENT } from '../contracts/mcu-library.needs';
import type { LibraryChangedDetail, MagicCardUtilsWindow } from '../contracts/mcu-library';
import { resolveCustomShape } from '../utils/shape-ref';
import { customShapesReady, loadCustomShapes } from '../utils/shape-custom-loader';

/*
 * The resolve side of outline shapes (design `shape`): which shape a design asks for, the provider's shape library and
 * the clip-path value of a shape path. The <mc-shape> element that draws it is src/card/mc-shape.ts.
 */

const KINDS = new Set<ShapeKind>(['custom', 'squircle', 'hexagon', 'octagon', 'blob', 'wave', 'notch', 'ticket', 'pill', 'circle']);

export interface ResolvedShape {
  kind: ShapeKind;
  options?: ShapeOptions;
}

/**
 * The design's shape, or undefined for none / unknown (the element is not shaped at all). A custom
 * shape's `ref` is resolved here (library, then the card's inline copy), so everything downstream
 * (clip, stroke, rings, flows, decorations) reads the finished options. A custom shape whose builder
 * chunk is not loaded yet starts the load and is undefined (unshaped) meanwhile.
 */
export function resolveShape(design: Pick<DesignConfig, 'shape' | 'shape_options'> | undefined, lookup?: ShapeLookup): ResolvedShape | undefined {
  const kind = design?.shape;
  if (!kind || !KINDS.has(kind)) return undefined;
  // until the builder chunk is in, a custom shape renders as `none` (the card re-renders when it lands)
  if (kind === 'custom' && !customShapesReady()) {
    void loadCustomShapes();
    return undefined;
  }
  let o = design?.shape_options;
  if (kind === 'custom' && o && typeof o === 'object') o = resolveCustomShape(o, lookup);
  return o && typeof o === 'object' && Object.keys(o).length ? { kind, options: o } : { kind };
}

/** A saved shape of the provider's library (Magic Card Utils); undefined until it is ready and for unknown ids. */
export const libraryShape = (id: string): CustomShapeOptions | undefined =>
  (window as unknown as { magicCardUtils?: Partial<MagicCardUtilsWindow> }).magicCardUtils?.shapes?.get(id);

/** Call `cb` when the library's shapes change; returns the stop function. */
export function watchShapes(cb: () => void): () => void {
  const on = (e: Event) => (e as CustomEvent<LibraryChangedDetail>).detail?.kind === 'shapes' && cb();
  window.addEventListener(LIBRARY_CHANGED_EVENT, on);
  return () => window.removeEventListener(LIBRARY_CHANGED_EVENT, on);
}

let pathSupport: boolean | undefined;
/** `clip-path: path()` support (checked once). */
export function clipPathSupported(): boolean {
  if (pathSupport === undefined) {
    pathSupport = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ? CSS.supports('clip-path', 'path("M0 0")') : true;
  }
  return pathSupport;
}

/** Test hook: forget the clip-path path() support check. */
export function __resetClipPathSupport(value?: boolean): void {
  pathSupport = value;
}
