import { svg, type SVGTemplateResult, type TemplateResult } from 'lit';
import type { FlowGeometry } from '../utils/flow-geometry';
import type { FlowLookQuality, FlowLookRenderOptions, FlowLookResolved, FlowWithLook } from '../contracts/flow-look';
import type { FlowConfig, HomeAssistant } from '../types';
import type { ResolvedFlow } from '../utils/flow';
import type { Sampled } from './sampler';
import { unmix, type Paint } from './paint';
import { defaultShapes } from './lines/dots';

// The registry of the flow-look chunk: the seams where the other parts plug in without editing the line modules.
// The lines fill the defaults; the shapes part replaces `shapes`, the colour and ends part replaces `stroke`, sets `ends`
// and may replace `colour`. A part registers itself from src/flow-look/parts.ts.

export { unmix, type Paint };

/** Everything a line, shape or end part needs for one flow, computed once per render. */
export interface LineCtx {
  f: FlowWithLook;
  l: FlowLookResolved;
  geo: FlowGeometry;
  o: FlowLookRenderOptions;
  /** The sampled centre line (cached per `geo.d`). */
  S: Sampled;
  /** `mc-flow-<index>`: prefix of every generated id (mask, filter, gradient, clip). */
  id: string;
  /** Flowing: the entity is above min and the direction is not 0. */
  active: boolean;
  /** Width after the style default and scale_width. */
  w: number;
  /** The line paint: the line colour while flowing, the idle colour otherwise (gradient ends: f.colorTo). */
  paint: Paint;
  /** The tier-capped counts this flow may draw (card budget applied). */
  nShapes: number;
  nBubbles: number;
  /** Liquid / progress 0..1 from the start end (0 while idle). */
  level: number;
  /** Animation direction for moving parts. */
  dir: 'normal' | 'reverse';
  /** Moving highlight / self-moving dashes allowed: flowing, not reduced, tier not minimal. */
  hl: boolean;
}

/** One stroked path. `color` unset = the flow's line paint (the part that may be a gradient). */
export interface StrokeSpec {
  d: string;
  w: number;
  color?: string;
  /** Opacity multiplied into the colour's own. */
  op?: number;
  dash?: string;
  dashOffset?: number;
  cap?: 'butt' | 'round';
  /** Class (default `ln`). */
  cls?: string;
  /** Extra constant style text, e.g. an animation. No config value. */
  style?: string;
}

const r2 = (v: number): string => String(Math.round(v * 100) / 100);

export function defaultStroke(c: LineCtx, s: StrokeSpec): SVGTemplateResult {
  const p = s.color === undefined ? c.paint : unmix(s.color);
  const op = (s.op ?? 1) * p.opacity;
  const style =
    `stroke: ${p.paint}; stroke-width: ${r2(s.w)}px` +
    (op < 1 ? `; stroke-opacity: ${r2(op)}` : '') +
    (s.dash ? `; stroke-dasharray: ${s.dash}` : '') +
    (s.dashOffset ? `; stroke-dashoffset: ${r2(s.dashOffset)}px` : '') +
    (s.cap ? `; stroke-linecap: ${s.cap}` : '') +
    (s.style ? `; ${s.style}` : '');
  return svg`<path class=${s.cls ?? 'ln'} d=${s.d} style=${style}></path>`;
}

export interface ShapeOut {
  svg?: SVGTemplateResult;
  html?: TemplateResult;
}

export interface FlowLookRegistry {
  /** Draws one stroked path in the flow's paint (gradient on straight and segmented routes). */
  stroke(c: LineCtx, s: StrokeSpec): SVGTemplateResult;
  shapes: {
    /** Travelling shapes this flow wants after the tier caps (0 when idle or reduced). */
    requested(f: FlowWithLook, geo: FlowGeometry, quality: FlowLookQuality): number;
    /** The shapes (nShapes of them) riding the centre line. */
    render(c: LineCtx): ShapeOut;
  };
  /** Caps, arrival effects: drawn over the line, inside the flow's group. */
  ends?: (c: LineCtx) => SVGTemplateResult | undefined;
  /** Colour modes: sets base.color (single / value) and returns the gradient end colour, if any. */
  colour?: (f: FlowConfig, base: ResolvedFlow, hass: HomeAssistant | undefined, colorEntity: string | undefined) => string | undefined;
}

export const flowLookRegistry: FlowLookRegistry = {
  stroke: defaultStroke,
  shapes: defaultShapes,
};
