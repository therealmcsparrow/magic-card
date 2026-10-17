import { DesignConfig, DisplayCondition, HomeAssistant } from '../types';
import { BOX_LONGHANDS, buildDesignToCssMap, CSS_SECTORS } from './css-properties';
import { ConditionsService } from '../services/conditions-service';
import { entityColorCss, isEntityColor } from './entity-color';
import { parseGradient } from './gradient';
import { mediaCssImage } from './media';

const ALL_CSS_MAP = buildDesignToCssMap();

/** Design keys edited as a colour field: the ones that accept `entity` / `entity N%`. */
const COLOR_KEYS = CSS_SECTORS.flatMap((s) => s.properties).filter((p) => p.type === 'color').map((p) => p.key);
/** Design keys edited with the media picker (browsed media is a media-source id resolved at render). */
const IMAGE_KEYS = new Set(CSS_SECTORS.flatMap((s) => s.properties).filter((p) => p.type === 'image').map((p) => p.key));

/**
 * Unit a bare number gets per design key: lengths (unit and box fields, their sides) px, times s,
 * border length % (a share of the side, like its default). Keys not listed (opacity, z-index,
 * flex-grow, font-weight, line-height, ...) take the number as is.
 */
const NUMBER_UNITS: Record<string, string> = {
  ...Object.fromEntries(
    CSS_SECTORS.flatMap((s) => s.properties)
      .filter((p) => p.type === 'unit' || p.type === 'box')
      .flatMap((p) => {
        const unit = p.units?.includes('s') ? 's' : 'px';
        return [[p.key, unit], ...(BOX_LONGHANDS[p.key] || []).map((l) => [l.key, unit])];
      }),
  ),
  border_length: '%',
};

/**
 * The design with numeric values (YAML `opacity: 0.5`, `padding: 8`) written as CSS text: a finite
 * number becomes its string, with px / s for lengths and times. Non-finite numbers are dropped.
 * Same object when there are none.
 */
export function designNumbersToCss<T extends DesignConfig | undefined>(design: T): T {
  if (!design) return design;
  const rec = design as Record<string, unknown>;
  let out: Record<string, unknown> | undefined;
  for (const [key, value] of Object.entries(rec)) {
    if (typeof value !== 'number') continue;
    out ??= { ...rec };
    if (!Number.isFinite(value)) delete out[key];
    else out[key] = `${value}${NUMBER_UNITS[key] ?? ''}`;
  }
  return (out ?? design) as T;
}

/**
 * The design with `entity` / `entity N%` colour values (colour fields and animation colours) mapped
 * to CSS reading the wrapper's --mc-entity-color (currentColor without one). Same object when none.
 */
export function resolveEntityColors<T extends DesignConfig | undefined>(design: T): T {
  if (!design) return design;
  const rec = design as Record<string, unknown>;
  let out: Record<string, unknown> | undefined;
  for (const key of COLOR_KEYS) {
    const css = entityColorCss(rec[key]);
    if (css) (out ??= { ...rec })[key] = css;
  }
  if (Array.isArray(rec.animations) && rec.animations.some((a) => isEntityColor(a?.color))) {
    (out ??= { ...rec }).animations = rec.animations.map((a) => (isEntityColor(a?.color) ? { ...a, color: entityColorCss(a.color) } : a));
  }
  return (out ?? design) as T;
}

/** Whether any colour of the design (base, hover, conditional rules, animations) is an entity colour. */
export function designUsesEntityColor(design: DesignConfig | undefined): boolean {
  if (!design) return false;
  const rec = design as Record<string, unknown>;
  if (COLOR_KEYS.some((k) => isEntityColor(rec[k]))) return true;
  if (Array.isArray(rec.animations) && rec.animations.some((a) => isEntityColor(a?.color))) return true;
  const ring = rec.ring as Record<string, unknown> | undefined;
  if (ring && (isEntityColor(ring.color) || isEntityColor(ring.track_color))) return true;
  if (rec.hover && designUsesEntityColor(rec.hover as DesignConfig)) return true;
  return Array.isArray(rec.conditional) && rec.conditional.some((r) => designUsesEntityColor(r?.design));
}

export function designToStyle(input?: DesignConfig): string {
  if (!input) return '';
  const design = resolveEntityColors(designNumbersToCss(input));

  const parts: string[] = [];
  const rec = design as Record<string, unknown>;
  // a gradient colour: text paints it (--mc-text-paint), everything else reads its first stop
  const gradient = parseGradient(design.color)?.stops[0];

  for (const [key, cssProperty] of Object.entries(ALL_CSS_MAP)) {
    let value = gradient && key === 'color' ? gradient : rec[key];
    if (typeof value === 'string' && IMAGE_KEYS.has(key)) value = mediaCssImage(undefined, value);
    if (value !== undefined && typeof value === 'string' && value !== '') {
      parts.push(`${cssProperty}: ${value}`);
    }
  }

  const borderStyle = defaultBorderStyle(rec);
  if (borderStyle) parts.push(`border-style: ${borderStyle}`);

  // Module text that sets its own colour (button label, info value, ...) reads this, so the
  // design colour reaches it; descendants without a colour of their own inherit `color` as usual.
  if (typeof design.color === 'string' && design.color !== '') {
    parts.push(`--mc-design-color: ${gradient ?? design.color}`);
    if (gradient) parts.push(`--mc-text-paint: ${design.color}`);
    // HA's ha-icon fills with var(--icon-primary-color, currentcolor); a theme that sets that var would
    // keep icons off the design colour. currentColor resolves per icon, so an explicit icon colour
    // (icon_color, state colour rules using --mc-design-color) still decides what the icon paints.
    parts.push('--icon-primary-color: currentColor');
  }

  // Modules that draw their own rounded / filled surface (button, dropdown, slider, bar track, image)
  // read these, so the design radius and background reach the surface the user actually sees.
  const corners = radiusCorners(rec);
  for (const c of CORNERS) {
    if (corners[c]) parts.push(`--mc-design-radius-${c}: ${corners[c]}`);
  }
  const bg = nonEmpty(rec.background_color) ?? nonEmpty(rec.background);
  if (bg) parts.push(`--mc-design-bg: ${bg}`);

  if (design.css) {
    parts.push(design.css);
  }

  return parts.join('; ');
}

type Corner = 'tl' | 'tr' | 'br' | 'bl';
const CORNERS: Corner[] = ['tl', 'tr', 'br', 'bl'];
const CORNER_KEYS: Record<Corner, string> = {
  tl: 'border_top_left_radius',
  tr: 'border_top_right_radius',
  br: 'border_bottom_right_radius',
  bl: 'border_bottom_left_radius',
};

function nonEmpty(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;
}

/** Split on top-level whitespace, keeping calc() / var() arguments together. */
function splitTopLevel(value: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (/\s/.test(ch) && depth === 0) {
      if (cur) out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

/** CSS 1–4 value expansion in corner order tl, tr, br, bl. */
function expandCorners(values: string[]): string[] {
  const [a, b = a, c = a, d = b] = values;
  return [a, b, c, d];
}

/** Per-corner radius from `border_radius` (incl. elliptical `h / v`), overridden by corner longhands. */
function radiusCorners(rec: Record<string, unknown>): Partial<Record<Corner, string>> {
  const out: Partial<Record<Corner, string>> = {};
  const shorthand = nonEmpty(rec.border_radius);
  if (shorthand) {
    const slash = shorthand.indexOf('/');
    const h = splitTopLevel(slash >= 0 ? shorthand.slice(0, slash) : shorthand);
    const v = slash >= 0 ? splitTopLevel(shorthand.slice(slash + 1)) : [];
    if (h.length) {
      const hc = expandCorners(h);
      const vc = v.length ? expandCorners(v) : undefined;
      CORNERS.forEach((c, i) => (out[c] = vc ? `${hc[i]} ${vc[i]}` : hc[i]));
    }
  }
  for (const c of CORNERS) {
    const v = nonEmpty(rec[CORNER_KEYS[c]]);
    if (v) out[c] = v;
  }
  return out;
}

export function designToHoverStyle(design?: DesignConfig): string {
  if (!design?.hover) return '';
  return designToStyle(design.hover as DesignConfig);
}

/** Split a declaration list on `;` outside parentheses and quotes (a data: URL keeps its `;`). */
export function splitDeclarations(style: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let quote = '';
  let cur = '';
  for (const ch of style) {
    if (quote) {
      if (ch === quote) quote = '';
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === ';' && depth === 0) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** What the element a hover rule targets draws itself, so the hover keeps it intact. */
export interface HoverTarget {
  /**
   * A shaped element: its (resolved) design and padding fallback, as given to shapeElementStyle.
   * `card`: the card content (its mc-shape is a later sibling, its shadow wrapper around ha-card).
   */
  shape?: { design?: DesignConfig; padding?: string; card?: boolean };
  /** The border length overlay of an unshaped element (resolveBorderLength of its design). */
  borderLength?: ResolvedBorderLength;
}

const important = (d: string) => (/!important\s*$/i.test(d) ? d : `${d} !important`);
/** No way out of the declaration block: braces and at-rules are dropped. */
const hoverSafe = (t: string) => t.replace(/[{}@]/g, '');

/**
 * The scoped `:hover` rule of an element tagged `data-mc-hover="<id>"`, from its hover design
 * (same keys as the design, custom `css` included). Every declaration is `!important`: the design
 * itself is the element's inline style, which a stylesheet rule cannot otherwise override.
 * A shaped element / border length overlay keeps what draws its outline: the shape overrides
 * (transparent border, no box-shadow, padding at least the shape's inset) or the overlay's transparent
 * border come again after the hover declarations; a hover border colour goes to the shape's stroke
 * or the overlay's lines, a hover shadow to the shape's drop-shadow wrapper.
 * Empty when the hover design writes nothing.
 */
export function hoverRule(id: string, hover: Partial<DesignConfig> | undefined, target: HoverTarget = {}): string {
  if (!hover || typeof hover !== 'object') return '';
  const decls = splitDeclarations(hoverSafe(designToStyle(hover as DesignConfig)))
    .filter((d) => d.includes(':'))
    .map(important);
  if (!decls.length) return '';
  const sel = `[data-mc-hover="${id.replace(/["\\]/g, '\\$&')}"]:hover`;
  const h = (resolveEntityColors(designNumbersToCss(hover as DesignConfig)) || {}) as Record<string, unknown>;
  const color = nonEmpty(h.border_color) && hoverSafe(nonEmpty(h.border_color)!.replace(/;/g, ''));
  const extra: string[] = [];
  const { shape, borderLength } = target;
  if (shape) {
    const merged = { ...(shape.design || {}), ...hover } as DesignConfig;
    decls.push(...splitDeclarations(shapeElementStyle(merged, shape.padding)).map(important));
    if (color) extra.push(`${sel} ${shape.card ? '~' : '>'} mc-shape { --mc-shape-stroke: ${color}; }`);
    const shadow = nonEmpty(h.box_shadow);
    if (shadow) {
      const filter = hoverSafe(boxShadowToDropShadow(shadow) ?? 'none');
      extra.push(`.mc-shape-shadow:has(> ${shape.card ? 'ha-card > ' : ''}${sel}) { filter: ${filter} !important; }`);
    }
  } else if (borderLength) {
    decls.push(...splitDeclarations(borderLength.style).map(important));
    if (color) extra.push(`${sel} > .mc-border-fx > i { border-color: ${color} !important; }`);
  }
  return [`${sel} { ${decls.join('; ')}; }`, ...extra].join(' ');
}

export function resolveConditionalDesign(
  design: DesignConfig | undefined,
  hass: HomeAssistant | undefined,
  moduleEntity?: string,
): DesignConfig | undefined {
  if (!design?.conditional?.length || !hass) return design;

  const { conditional, ...base } = design;
  const merged = { ...base } as Record<string, unknown>;

  for (const rule of conditional) {
    if (!rule || !Array.isArray(rule.conditions)) continue;
    const resolved = rule.conditions.map((c: DisplayCondition) =>
      c && c.use_module_entity !== false && moduleEntity && !c.entity
        ? { ...c, entity: moduleEntity }
        : c,
    );
    // a rule without conditions, or with one not filled in yet, changes nothing
    if (ConditionsService.ruleMatches({ conditions: resolved, mode: rule.mode }, hass)) {
      const overrides = (rule.design || {}) as Record<string, unknown>;
      for (const [key, value] of Object.entries(overrides)) {
        if (value !== undefined) {
          merged[key] = value;
        }
      }
    }
  }

  return merged as DesignConfig;
}

function buildEqualTemplate(columnCount: number): string {
  return Array.from({ length: Math.max(columnCount, 1) }, () => '1fr').join(' ');
}

function countPresetColumns(layout: string): number | null {
  if (/^\d+(?:-\d+)*$/.test(layout)) {
    return layout.split('-').length;
  }
  return null;
}

export function layoutToGridTemplate(layout?: string, columnCount?: number): string {
  if (!layout) {
    return buildEqualTemplate(columnCount ?? 1);
  }

  const presets: Record<string, string> = {
    '1': '1fr',
    '1-1': '1fr 1fr',
    '1-2': '1fr 2fr',
    '2-1': '2fr 1fr',
    '1-1-1': '1fr 1fr 1fr',
    '1-2-1': '1fr 2fr 1fr',
  };

  if (presets[layout]) {
    if (columnCount && countPresetColumns(layout) && countPresetColumns(layout)! !== columnCount) {
      return buildEqualTemplate(columnCount);
    }
    return presets[layout];
  }

  if (/^\d+(?:-\d+)+$/.test(layout)) {
    const count = layout.split('-').length;
    if (columnCount && count !== columnCount) {
      return buildEqualTemplate(columnCount);
    }
    return layout
      .split('-')
      .map((segment) => `${Math.max(Number(segment) || 1, 1)}fr`)
      .join(' ');
  }

  return layout;
}

// ── Border length ──

type Side = 'top' | 'right' | 'bottom' | 'left';
const SIDES: Side[] = ['top', 'right', 'bottom', 'left'];
const BORDER_STYLES = new Set(['none', 'hidden', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']);
const WIDTH_KEYWORDS: Record<string, string> = { thin: '1px', medium: '3px', thick: '5px' };
const ALIGN_FACTOR: Record<string, string> = { start: '0', center: '0.5', end: '1' };

interface SideBorder {
  width: string;
  style: string;
  color: string;
  /** A width / style was written for this side (shorthand token or longhand), not the CSS initial. */
  widthSet: boolean;
  styleSet: boolean;
}

/** Width of a border-length line when no border width is set anywhere. */
export const DEFAULT_BORDER_LENGTH_WIDTH = '2px';

const isWidth = (t: string) => /^(-?[\d.]+[a-z%]*|thin|medium|thick|(calc|min|max|clamp)\(.*\))$/i.test(t);
const normWidth = (w: string) => WIDTH_KEYWORDS[w.toLowerCase()] ?? w;

/** CSS 1–4 value expansion in side order top, right, bottom, left. */
function expandSides(value: string): string[] {
  const [a, b = a, c = a, d = b] = splitTopLevel(value);
  return [a, b, c, d];
}

const initialSide = (): SideBorder => ({ width: '3px', style: 'none', color: 'currentColor', widthSet: false, styleSet: false });

/** A `border` / `border-<side>` shorthand: omitted parts reset to their initial values. */
function parseBorderShorthand(value: string): SideBorder {
  const out: SideBorder = initialSide();
  const color: string[] = [];
  for (const t of splitTopLevel(value)) {
    if (BORDER_STYLES.has(t.toLowerCase())) {
      out.style = t.toLowerCase();
      out.styleSet = true;
    } else if (isWidth(t)) {
      out.width = normWidth(t);
      out.widthSet = true;
    } else color.push(t);
  }
  if (color.length) out.color = color.join(' ');
  return out;
}

/** Each side's final border, in designToStyle's cascade order (shorthand, sides, then longhands). */
function resolveSideBorders(rec: Record<string, unknown>): Record<Side, SideBorder> {
  const all = nonEmpty(rec.border);
  const base = (): SideBorder => (all ? parseBorderShorthand(all) : initialSide());
  const sides = Object.fromEntries(SIDES.map((s) => [s, base()])) as Record<Side, SideBorder>;
  for (const s of SIDES) {
    const v = nonEmpty(rec[`border_${s}`]);
    if (v) sides[s] = parseBorderShorthand(v);
  }
  const longhand = (key: string, field: 'width' | 'style' | 'color', map: (v: string) => string = (v) => v) => {
    const v = nonEmpty(rec[key]);
    if (!v) return;
    expandSides(v).forEach((x, i) => {
      const side = sides[SIDES[i]];
      side[field] = map(x);
      if (field === 'width') side.widthSet = true;
      if (field === 'style') side.styleSet = true;
    });
  };
  longhand('border_width', 'width', normWidth);
  longhand('border_style', 'style', (v) => v.toLowerCase());
  longhand('border_color', 'color');
  // A width without a style draws solid: "Not set" in the editor means "solid when a width is set",
  // not the CSS initial `none` that made a border with only a width / colour invisible.
  for (const s of SIDES) if (sides[s].widthSet && !sides[s].styleSet) sides[s].style = 'solid';
  return sides;
}

/**
 * `border-style` for sides that have a width but no style (see resolveSideBorders), appended after
 * the border declarations; undefined when every side's style is already what CSS would draw.
 */
function defaultBorderStyle(rec: Record<string, unknown>): string | undefined {
  if (nonEmpty(rec.border_style)) return undefined;
  const sides = resolveSideBorders(rec);
  if (!SIDES.some((s) => sides[s].widthSet && !sides[s].styleSet)) return undefined;
  const v = SIDES.map((s) => sides[s].style);
  return v.every((x) => x === v[0]) ? v[0] : v.join(' ');
}

export interface BorderLengthLine {
  side: Side;
  /** Inline style of the side's layer inside the overlay (rounded, one border side, masked). */
  style: string;
}

export interface ResolvedBorderLength {
  /** Appended to the wrapper's style: hides the real border colour, keeps its width. */
  style: string;
  /** Inline style of the overlay: covers the wrapper's border box. */
  overlayStyle: string;
  lines: BorderLengthLine[];
}

interface BorderLengthPlan {
  length: string;
  sides: Record<Side, SideBorder>;
  /** Sides that draw a line (border length sides with a visible border, or defaulted). */
  drawn: Side[];
  /** Sides without a border that draw the 2px default line. */
  defaulted: Set<Side>;
  hasBorder: (s: Side) => boolean;
}

const visibleSide = (b: SideBorder) => b.style !== 'none' && b.style !== 'hidden' && !/^0+(\.0+)?[a-z%]*$/i.test(b.width);

/** Which sides a border length draws, default lines filled in; undefined when unset / 100% / nothing drawn. */
function borderLengthPlan(rec: Record<string, unknown>): BorderLengthPlan | undefined {
  const length = nonEmpty(rec.border_length);
  if (!length || length === '100%') return undefined;
  const sides = resolveSideBorders(rec);
  const only = nonEmpty(rec.border_length_sides) as Side | undefined;
  const pick = only && SIDES.includes(only) ? [only] : SIDES;
  const hasBorder = (s: Side) => sides[s].widthSet || sides[s].styleSet;
  // A length with no border anywhere (or none on the chosen side) is a line of its own.
  const defaulted = new Set(pick.filter((s) => !hasBorder(s) && (only || !SIDES.some(hasBorder))));
  for (const s of defaulted) Object.assign(sides[s], { width: DEFAULT_BORDER_LENGTH_WIDTH, style: 'solid' });
  const drawn = pick.filter((s) => visibleSide(sides[s]));
  return drawn.length ? { length, sides, drawn, defaulted, hasBorder } : undefined;
}

/**
 * `border_length` shortens every drawn side to a line of that length (e.g. 40%, 60px), placed by
 * `border_length_align` (start / center / end) along the full side, following rounded corners (even
 * a 50% radius). CSS cannot shorten a real border: the wrapper keeps its border (same width, so the
 * same layout) in a transparent colour; an overlay draws each side as a layer with the wrapper's
 * border-radius and only that side's border, masked to the length window.
 * Drawn sides: `border_length_sides` (one side) or all; of those, the sides with a border, or (no
 * border set at all) every one of them as a 2px solid line in the border / design colour. A width
 * without a style is solid. Undefined when unset, 100% or nothing would be drawn.
 */
export function resolveBorderLength(design?: DesignConfig): ResolvedBorderLength | undefined {
  const rec = (resolveEntityColors(designNumbersToCss(design)) || {}) as Record<string, unknown>;
  const plan = borderLengthPlan(rec);
  if (!plan) return undefined;
  const { length, sides, drawn, defaulted, hasBorder } = plan;

  const f = ALIGN_FACTOR[nonEmpty(rec.border_length_align) ?? 'center'] ?? '0.5';
  // The length window [a, b] along the full side (0–100% of the box width / height), by alignment.
  const size = `min(${length}, 100%)`;
  const a = `calc((100% - ${size}) * ${f})`;
  const b = `calc((100% - ${size}) * ${f} + ${size})`;

  // Each side is a layer over the border box with the wrapper's rounded shape and only that side's
  // border, so it follows the curve (a 50% radius has no straight part); a mask keeps the window.
  const lines = drawn.map((side): BorderLengthLine => {
    const s = sides[side];
    const dir = side === 'top' || side === 'bottom' ? 'to right' : 'to bottom';
    const mask = `linear-gradient(${dir}, transparent ${a}, #000 ${a}, #000 ${b}, transparent ${b})`;
    const style = `inset: 0; border-radius: inherit; border-${side}: ${s.width} ${s.style} ${s.color}; -webkit-mask-image: ${mask}; mask-image: ${mask}`;
    return { side, style };
  });

  // the overlay covers the border box: every side with a real (now transparent) border, drawn or not
  const real = (s: Side) => defaulted.has(s) || (hasBorder(s) && sides[s].style !== 'none' && sides[s].style !== 'hidden');
  const widthOf = (s: Side) => (real(s) ? sides[s].width : '0px');
  const overlayStyle = `${SIDES.map((s) => `${s}: calc(-1 * ${widthOf(s)})`).join('; ')}; border-radius: inherit`;

  // defaulted sides get a real border of the line's width, so the line sits on the border box
  const parts = [...[...defaulted].map((s) => `border-${s}-width: ${sides[s].width}; border-${s}-style: solid`), 'border-color: transparent'];
  // overflow: hidden clips at the padding box, which would cut the lines drawn over the border:
  // clip (same look) with a margin of the widest drawn border instead.
  const ov = [rec.overflow, rec.overflow_x, rec.overflow_y].map((v) => nonEmpty(v)).filter(Boolean);
  if (ov.length && ov.every((v) => v === 'hidden' || v === 'clip')) {
    const widths = [...new Set(drawn.map((s) => sides[s].width))];
    const margin = widths.every((w) => /^[\d.]+px$/.test(w))
      ? `${Math.max(...widths.map((w) => parseFloat(w)))}px`
      : widths.length === 1 ? widths[0] : `max(${widths.join(', ')})`;
    parts.push('overflow: clip', `overflow-clip-margin: ${margin}`);
  }
  return { style: parts.join('; '), overlayStyle, lines };
}

// ── Shapes ──

/** The border of a shaped element, drawn as an SVG stroke along the shape (src/card/mc-shape.ts). */
export interface ShapeStroke {
  /** CSS width ("2px"; the element's computed border width is used when it is not px). */
  width: string;
  /** solid | dashed | dotted (other CSS styles draw solid). */
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  /**
   * Only part of the outline: per drawn side (the part of the outline nearest that side), a window
   * of `length` (px or % of the side) placed by `align`. Unset: the whole outline.
   */
  length?: { value: string; align: 'start' | 'center' | 'end'; sides: Side[] };
}

/**
 * The stroke of a shaped element's border: the first drawn side's width / style / colour along the
 * whole outline, or (border length, or a border on some sides only) along the parts of the outline
 * nearest the drawn sides. Undefined when no border is drawn.
 */
export function resolveShapeStroke(design?: DesignConfig): ShapeStroke | undefined {
  const rec = (resolveEntityColors(designNumbersToCss(design)) || {}) as Record<string, unknown>;
  const plan = borderLengthPlan(rec);
  const sides = plan?.sides ?? resolveSideBorders(rec);
  const drawn = plan?.drawn ?? SIDES.filter((s) => (sides[s].widthSet || sides[s].styleSet) && visibleSide(sides[s]));
  if (!drawn.length) return undefined;
  const first = sides[drawn[0]];
  const style = first.style === 'dashed' || first.style === 'dotted' ? first.style : 'solid';
  const out: ShapeStroke = { width: first.width, style, color: first.color };
  const align = nonEmpty(rec.border_length_align);
  if (plan || drawn.length < 4) {
    out.length = {
      value: plan?.length ?? '100%',
      align: align === 'start' || align === 'end' ? align : 'center',
      sides: drawn,
    };
  }
  return out;
}

/**
 * The first shadow of a `box-shadow` as a `drop-shadow()` filter (clip-path clips a box-shadow; a
 * drop-shadow on a wrapper follows the shape). Spread is dropped; inset / none / unreadable: undefined.
 */
export function boxShadowToDropShadow(value: unknown): string | undefined {
  const v = nonEmpty(value);
  if (!v) return undefined;
  let depth = 0;
  let first = '';
  for (const ch of v) {
    if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) break;
    first += ch;
  }
  const tokens = splitTopLevel(first.trim());
  if (!tokens.length || tokens.some((t) => /^(inset|none)$/i.test(t))) return undefined;
  const isLen = (t: string) => /^-?[\d.]+(px|em|rem|%)?$/i.test(t) || /^(calc|min|max|clamp)\(/i.test(t);
  const lens = tokens.filter(isLen);
  const color = tokens.filter((t) => !isLen(t)).join(' ');
  if (lens.length < 2) return undefined;
  const px = (t: string) => (/^-?[\d.]+$/.test(t) ? `${t}px` : t);
  return `drop-shadow(${px(lens[0])} ${px(lens[1])} ${px(lens[2] ?? '0')}${color ? ` ${color}` : ''})`;
}

/**
 * Inline style of a shaped element (after its design style): the real border kept for layout but
 * transparent (the shape's stroke draws it), no box-shadow (a drop-shadow wrapper draws it), and
 * each padding side at least the shape's content inset (`--mc-shape-i*`, set by mc-shape).
 * `fallback`: the element's padding without a design padding (a row / column's own padding).
 */
export function shapeElementStyle(design: DesignConfig | undefined, fallback?: string, min?: readonly number[]): string {
  return ['border-color: transparent', 'box-shadow: none', insetPaddingStyle(design, fallback, { shape: true, min })].join('; ');
}

/**
 * Each padding side of the element at least an inset: the shape's (`shape`: `--mc-shape-i*`) and /
 * or `min` px per side (top, right, bottom, left; seasonal decorations).
 */
export function insetPaddingStyle(design: DesignConfig | undefined, fallback: string | undefined, opts: { shape?: boolean; min?: readonly number[] }): string {
  const rec = (design || {}) as Record<string, unknown>;
  const text = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? String(v) : nonEmpty(v));
  // a bare number is px (max() needs units); 0 too
  const unit = (t: string) => (/^-?(\d+\.?\d*|\.\d+)$/.test(t) ? `${t}px` : t);
  const pad = expandSides(text(rec.padding) ?? nonEmpty(fallback) ?? '0px');
  SIDES.forEach((s, i) => {
    pad[i] = text(rec[`padding_${s}`]) ?? pad[i];
  });
  // custom CSS comes after the design fields in the element's style: its padding wins there too
  for (const decl of (nonEmpty(rec.css) ?? '').split(';')) {
    const m = /^\s*(padding(?:-(top|right|bottom|left))?)\s*:\s*(.+?)\s*(?:!important)?\s*$/i.exec(decl);
    if (!m) continue;
    if (m[2]) pad[SIDES.indexOf(m[2].toLowerCase() as Side)] = m[3];
    else expandSides(m[3]).forEach((v, i) => (pad[i] = v));
  }
  const vars = ['it', 'ir', 'ib', 'il'];
  return SIDES.map((s, i) => {
    const parts = [unit(pad[i])];
    if (opts.shape) parts.push(`var(--mc-shape-${vars[i]}, 0px)`);
    if (opts.min?.[i]) parts.push(`${opts.min[i]}px`);
    return `padding-${s}: max(${parts.join(', ')})`;
  }).join('; ');
}
