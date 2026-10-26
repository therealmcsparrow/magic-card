/*
 * Contract: SVG value rules shared by the two sanitisers. Version 1.0.0.
 * One set of value rules behind src/icons/svg-sanitize.ts (own icons) and src/svg-image/sanitize.ts (library images).
 * The allow-lists stay two (ADR 0054): each sanitiser passes its own policy, and the rules only read it. A rule fixed
 * here is fixed for both sanitisers at once, and one hostile corpus covers both.
 *
 * ── Module ──
 * Folder src/svg-safety/ (entry src/svg-safety/index.ts). Value-imported only by the two sanitisers and by other
 * src/svg-safety/ modules (proj.M11, checked by tools/check-svg-sinks.mjs on the sources and on the built graph).
 * src/svg-safety/ value-imports nothing outside itself except constants from src/contracts/**. It is pure:
 *   - no module-level `let`, no mutated `const`; policies and sets are frozen (Object.freeze, ReadonlySet built once
 *     and never written), so the copies webpack places in several chunks hold no state (proj.M16);
 *   - no DOM or window access at load; DOMParser is reached only inside parseLenient, at call time;
 *   - no element definitions, no templates, no unsafeSVG, no Blob of any type: it is never an SVG sink;
 *   - no regular expression with the g or y flag in a policy or at module level (lastIndex is state).
 * This file holds types and the version only: no function and no rule data, so importing it (value or type) gives
 * nobody a rule to call on its own.
 *
 * ── What the module exports (SvgSafety) ──
 *   denied(value, policy)            true when the value holds a policy deny token (backslash, `<`, `>`, `//`, `/*`,
 *                                    javascript:, vbscript:, data:, expression(, @import, and the policy's extras).
 *                                    Case-insensitive. Checked before any other rule.
 *   onlyFunctions(value, allowed)    true when every "(" in the value opens a function named in `allowed` (lower-case
 *                                    names). A CSS comment or escape cannot hide one: `denied` refuses both first.
 *   cleanValue(kind, value, policy)  the value to keep, or undefined to drop it and list it. Pure, bounded by the
 *                                    policy's length caps, checked before any pattern runs.
 *   withinLimits(root, limits)       'ok' or 'too_complex': element count and nesting depth of the parsed tree, walked
 *                                    with an explicit stack; stops at the first limit hit (the caps bound the walk
 *                                    itself). A sanitiser's own walk may keep its in-walk checks; both use the same
 *                                    numbers.
 *   parseLenient(text)               the root <svg> element, or undefined: XML first (image/svg+xml; a parsererror or a
 *                                    root that is not svg falls through), then an inert text/html document (nothing in
 *                                    it loads or runs) and its first svg element. Returns which parse gave the root and
 *                                    the document, so the image sanitiser can list elements the HTML parser moved out.
 *   byteLength(text)                 UTF-8 length (TextEncoder; text.length where it is missing).
 *   escapeText(s), escapeAttr(s)     & < > (and " for attributes) as entities, for the serialisers.
 * Errors: no rule throws. Booleans, undefined or 'too_complex' only; each sanitiser keeps its own error codes and
 * messages (svg-image SanitizedImage.error, svg-sanitize's error text).
 *
 * ── Policies ──
 * Two frozen SvgPolicy objects in src/svg-safety/policy.ts: ICON_POLICY (the lists, value rules and caps
 * src/icons/svg-sanitize.ts applies) and IMAGE_POLICY (svg-image IMAGE_ELEMENTS, IMAGE_ATTRIBUTES, IMAGE_FONT_FAMILIES,
 * IMAGE_ID_RE, THEME_VAR_NAME_RE and the image caps). Neither is a default: every call names its policy. A policy is
 * data only, never a function. Allow-lists only: an attribute with no kind in the policy, and no `fallback`, is
 * dropped.
 * Output rule: with its policy, each sanitiser gives byte-identical output to the golden corpus captured before the
 * rules moved (markup, stripped list, error code), for both the XML parse and the text/html fallback, with and
 * without xmlns. A changed corpus line is a security change and goes through security review.
 *
 * ── What stays in each sanitiser ──
 * The walk, the serialiser, the prolog scan of file mode, the image text-deny scan, viewBox rules, the icon's paint
 * inheritance and path output, the image's namespace rebuild and its `stripped` names. Geometry (matrices, transform
 * parsing, shape outlines) is not a value rule and is not here (svg-reader 1.0.0, "Geometry").
 */

export const SVG_SAFETY_CONTRACT = '1.0.0';

/** How an attribute value is checked. `value` is the icon rule for any other drawing attribute. */
export type SvgValueKind =
  | 'paint'
  | 'transform'
  | 'reference'
  | 'id'
  | 'class'
  | 'length'
  | 'numbers'
  | 'path'
  | 'points'
  | 'keyword'
  | 'font'
  | 'data-name'
  | 'value';

export interface SvgWalkLimits {
  maxNodes: number;
  maxDepth: number;
}

export interface SvgPolicy {
  readonly name: 'icon' | 'image';
  /** Element local names kept (canonical case). */
  readonly elements: readonly string[];
  /** Attribute name -> how its value is checked; a name not listed is dropped unless `fallback` is set. */
  readonly kinds: Readonly<Record<string, SvgValueKind>>;
  /** The kind of a listed element attribute without an entry in `kinds` (icon: 'value'; image: none). */
  readonly fallback?: SvgValueKind;
  /** Function names a paint (and, for the icon, any `value`) may call, lower-case. */
  readonly colourFunctions: readonly string[];
  /** Function names a transform list may hold, lower-case. */
  readonly transformFunctions: readonly string[];
  /** Paint may be var(--name) or var(--name, #hex) with the name per THEME_VAR_NAME_RE (image only). */
  readonly paintVar: boolean;
  /** Most functions in one transform list; undefined = no cap of its own. */
  readonly maxTransformFunctions?: number;
  /** Longest value checked, and longest paint; longer is dropped. */
  readonly maxValueChars?: number;
  readonly maxPaintChars?: number;
  /** Deny tokens on top of the shared set, lower-case. */
  readonly denyExtra: readonly string[];
  readonly limits: SvgWalkLimits;
}

export type SvgParse = { root: Element; via: 'xml' | 'html'; doc: Document } | undefined;

/** What src/svg-safety/index.ts exports. */
export interface SvgSafety {
  denied(value: string, policy: SvgPolicy): boolean;
  onlyFunctions(value: string, allowed: readonly string[]): boolean;
  cleanValue(kind: SvgValueKind, value: string, policy: SvgPolicy): string | undefined;
  withinLimits(root: Element, limits: SvgWalkLimits): 'ok' | 'too_complex';
  parseLenient(text: string): SvgParse;
  byteLength(text: string): number;
  escapeText(s: string): string;
  escapeAttr(s: string): string;
}
