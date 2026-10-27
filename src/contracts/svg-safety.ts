/*
 * Contract: SVG value rules shared by the two sanitisers. Version 1.0.0 (SVG_SAFETY_CONTRACT).
 * One set of value rules behind src/icons/svg-sanitize.ts (own icons) and src/svg-image/sanitize.ts (library images).
 * The allow-lists stay two: each sanitiser passes its own policy, and the rules only read it. A rule fixed here is
 * fixed for both sanitisers at once, and one hostile corpus covers both.
 *
 * ── Module ──
 * Folder src/svg-safety/ (entry src/svg-safety/index.ts). Value-imported only by the two sanitisers and by other
 * src/svg-safety/ modules (checked by tools/check-svg-sinks.mjs on the sources and on the built graph).
 * src/svg-safety/ value-imports nothing outside itself except constants from src/contracts/**. It is pure:
 *   - no module-level `let`, no mutated `const`; policies and sets are frozen (Object.freeze, ReadonlySet built once
 *     and never written), so the copies webpack places in several chunks hold no state;
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
 *   resolveCss(root, policy)         pending (section "CSS paint resolver"): turns allowed paint declarations of style
 *                                    attributes and style elements into presentation attributes, in place.
 *   byteLength(text)                 UTF-8 length (TextEncoder; text.length where it is missing).
 *   escapeText(s), escapeAttr(s)     & < > (and " for attributes) as entities, for the serialisers.
 * Errors: no rule throws. Booleans, undefined, 'too_complex' or an SvgCssOutcome only; each sanitiser keeps its own
 * error codes and messages (svg-image SanitizedImage.error, svg-sanitize's error text).
 *
 * ── Policies ──
 * Two frozen SvgPolicy objects in src/svg-safety/policy.ts: ICON_POLICY (the lists, value rules and caps
 * src/icons/svg-sanitize.ts applies) and IMAGE_POLICY (svg-image IMAGE_ELEMENTS, IMAGE_ATTRIBUTES, IMAGE_FONT_FAMILIES,
 * IMAGE_ID_RE, THEME_VAR_NAME_RE and the image caps). Neither is a default: every call names its policy. A policy is
 * data only, never a function. Allow-lists only: an attribute with no kind in the policy, and no `fallback`, is
 * dropped.
 * Output rule: with its policy, each sanitiser gives byte-identical output to the golden corpus captured before the
 * rules moved (markup, stripped list, error code), for both the XML parse and the text/html fallback, with and
 * without xmlns. A changed corpus line is a security change and goes through security review. When the CSS paint
 * resolver lands, the lines whose input holds a style attribute, a style element, CDATA in a style element (image file
 * mode) or a gradient href change from "dropped" to "resolved or listed"; each such line is named in that change and
 * reviewed one by one. No other line changes.
 *
 * ── What stays in each sanitiser ──
 * The walk, the serialiser, the prolog scan of file mode, the image text-deny scan, viewBox rules, the icon's paint
 * inheritance and path output, the image's namespace rebuild and its `stripped` names. Geometry (matrices, transform
 * parsing, shape outlines) is not a value rule and is not here (svg-reader 1.0.0, "Geometry").
 *
 * ── CSS paint resolver (pending) ──
 * Status: target behaviour, in force from the change that adds its code; this contract's version moves with that
 * code. Until then both sanitisers drop style attributes, style elements and gradient href as before.
 * Purpose: drawings from Illustrator, Inkscape and Figma keep their colours. Allowed paint declarations become plain
 * presentation attributes; all other CSS is dropped. The resolver never emits CSS text, and never adds an element or
 * attribute the policy does not keep.
 * When and where:
 *   - resolveCss(root, policy) runs on the parsed tree after parse and viewBox and before the sanitiser's walk, on
 *     every call, the same way for the XML parse and the text/html fallback, with and without xmlns. No style
 *     attribute and no style element: no work.
 *   - It only (a) sets presentation attributes from SvgCssProperty on elements already in the tree, (b) adds shallow
 *     stop clones (gradient href, below) and (c) removes style attributes, style elements and gradient href. The
 *     sanitiser's walk then checks every value it wrote again with cleanValue, before serialising.
 *   - Scope: elements the walk would keep (a policy element; SVG namespace for the image). Subtrees of dropped
 *     elements (foreignObject, script, HTML moved out by the parser) are skipped; a style in them is never read.
 *     Explicit stack, policy.limits depth and nodes; over them is too_complex.
 * Inputs and caps (SvgCssLimits; each checked before any tokenising or pattern):
 *   - style attribute: unprefixed `style` only. Over maxStyleAttrChars, or holding `\`, `<` or `>`: dropped whole,
 *     unparsed.
 *   - style element: SVG `style` (lower case) in the drawing. Its CSS is its direct Text and CDATA children joined
 *     (comments add nothing). An element child, a `type` other than absent or text/css, a `media` other than absent,
 *     empty, all or screen, or a `\` or `<` in the CSS: block dropped.
 *   - per document at most maxStyleBlocks blocks and maxCssChars of CSS (over: every block dropped), maxRules rules;
 *     per rule or attribute maxDeclarations; per selector list maxSelectors; per element maxClassTokens class tokens
 *     read. A rule past a cap is dropped.
 *   - amplification: the bytes it writes (name + value + 4 per attribute, plus the serialised size of every clone)
 *     are summed; over css.maxWrittenBytes is too_complex.
 * Tokeniser: one linear pass (indexOf based), a CSS Syntax subset.
 *   - `/*` to the first `*\/` is one space; comments do not nest; an unterminated comment drops the whole attribute or
 *     block.
 *   - a string runs to the next quote of its kind; a newline (LF, CR, FF) first, or no closing quote, drops the whole
 *     attribute or block. A declaration holding a string is dropped; the declarations around it still apply.
 *   - `(`, `[` and `{` nest on a matching stack of at most maxBracketDepth; a wrong or missing closer drops the whole
 *     attribute or block. `;` ends a declaration only at the top level of the attribute or rule.
 *   - a prelude starting with `@` is an at-rule: a statement at-rule is skipped to its `;`, a block at-rule with its
 *     whole `{}`. Nothing inside an at-rule applies; later rules still do.
 *   - a rule body holding `{` (nesting) drops the rule.
 * Selectors: the prelude splits at `,`, items trimmed. Each item fully matches one of: a type
 * `^[A-Za-z][A-Za-z0-9]{0,31}$` that is a policy element (case-sensitive, canonical name); a class
 * `^\.-?[A-Za-z_][\w-]{0,63}$`; an id `^#-?[A-Za-z_][\w-]{0,63}$`. One failing item drops the whole rule.
 * Combinators, `*`, pseudo-classes and pseudo-elements, attribute selectors, `|`, `&` and compounds never match.
 * Class tokens come from the element's own class attribute before the icon's `u-` prefix, split on ASCII whitespace,
 * case-sensitive. An id rule matches every element with that id.
 * Declarations:
 *   - split at the first top-level `:`. The name, ASCII lower-cased, matches `^[a-z-]{1,32}$` and is a key of
 *     css.properties, else the declaration is dropped (custom properties, vendor prefixes, behavior, transform,
 *     clip-path, mask, display, font-* and color included).
 *   - the value is trimmed; a trailing `!important` (ASCII, any case, optional whitespace after `!`) sets the important
 *     flag and is removed; any other `!` drops the declaration.
 *   - at most maxPaintChars for a paint kind, maxValueChars for the rest. ASCII whitespace runs collapse to one space.
 *     Charset `^[A-Za-z0-9 #%.,()_+/-]+$` and no `//`, else dropped. CSS-wide keywords (inherit, initial, unset,
 *     revert, revert-layer) and var(, attr(, env(, calc(, image-set(, element(, paint(, expression( (any case):
 *     dropped. CSS paint never takes var(), even where the policy's attribute paint does.
 *   - the value kind (SvgCssValueKind) of the property then decides:
 *       paint       none | currentColor | transparent | a hex colour | a keyword `^[A-Za-z]{3,20}$` | a colour
 *                   function from policy.colourFunctions (onlyFunctions; at most maxColourFunctionDepth deep) |
 *                   exactly `url(#<IMAGE_ID_RE>)`: lower-case url, no quotes, no spaces, no fallback
 *       stop-paint  paint without none and url()
 *       alpha       a number or a percentage
 *       width       a number >= 0, optional px, or a percentage
 *       miterlimit  a number >= 1
 *       offset      a signed number, optional px, or a percentage
 *       dasharray   none, or 1 to maxDashValues non-negative lengths split by commas and/or spaces
 *       keyword     one of the rule's keywords
 *       paint-order normal, or 1 to 3 of fill, stroke, markers
 *     Numbers: `^[+-]?(?:\d{1,10}(?:\.\d{1,10})?|\.\d{1,10})(?:[eE][+-]?\d{1,3})?(?:px|%)?$`; a sign only for offset, a
 *     unit only where the kind allows it.
 *   - a value that fails is ignored like an invalid CSS declaration: it overrides neither the attribute nor an earlier
 *     valid declaration.
 * Precedence, per element and property, highest first: style attribute !important, rule !important, style attribute,
 * rule, presentation attribute. Between rules: id over class over type, then the later rule (blocks in document order).
 * Several matching classes resolve by rule order, not token order. Rules are merged per selector key (type, class, id)
 * at parse time, so the work per element is at most (1 + maxClassTokens + 1) keys times the property count. The winner
 * is written as the attribute (normalised, without !important), replacing the old one; inheritance then works through
 * the attribute.
 * Listing (image `stripped`; the icon counts them with its other dropped parts): `<element>@style` only when at least
 * one of its declarations was dropped; `style` only when a block, rule, at-rule or declaration in a style element was
 * dropped. Fully resolved parts are not listed.
 * Gradient href (stop inheritance), on linearGradient and radialGradient only: `href`, else xlink:href (XLink
 * namespace). After an ASCII trim it is exactly `#` + IMAGE_ID_RE. A gradient with no stop children of its own
 * follows the chain (at most maxHrefHops, a visited set; a cycle gives no stops) to the first gradient with stops,
 * taking the first element with that id, and copies its direct stop children as shallow clones without `id`, after
 * CSS resolution. At most maxStopsPerGradient per gradient and maxStopClones per document; past that nothing is
 * copied and the href is listed. Clones count toward the walk's node limits. The href is then removed, and listed
 * when it did not resolve. An external, javascript:, relative or `#a#b` href, or one pointing at a non-gradient: no
 * copy, dropped and listed.
 * Output never holds CDATA, comments, a style attribute or a style element.
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

/** The CSS properties the resolver may turn into the presentation attribute of the same name. */
export type SvgCssProperty =
  | 'fill'
  | 'stroke'
  | 'stop-color'
  | 'opacity'
  | 'fill-opacity'
  | 'stroke-opacity'
  | 'stop-opacity'
  | 'stroke-width'
  | 'stroke-miterlimit'
  | 'stroke-dashoffset'
  | 'stroke-dasharray'
  | 'stroke-linecap'
  | 'stroke-linejoin'
  | 'fill-rule'
  | 'clip-rule'
  | 'paint-order'
  | 'vector-effect';

/** How a CSS declaration value is checked (section "CSS paint resolver", Declarations). */
export type SvgCssValueKind =
  | 'paint'
  | 'stop-paint'
  | 'alpha'
  | 'width'
  | 'miterlimit'
  | 'offset'
  | 'dasharray'
  | 'keyword'
  | 'paint-order';

export interface SvgCssPropertyRule {
  readonly kind: SvgCssValueKind;
  /** For kind `keyword`: the allowed values, lower-case except where CSS spells them otherwise. */
  readonly keywords?: readonly string[];
}

/**
 * The property table, one frozen object shared by both policies:
 *   fill, stroke: paint | stop-color: stop-paint | opacity, fill-opacity, stroke-opacity, stop-opacity: alpha |
 *   stroke-width: width | stroke-miterlimit: miterlimit | stroke-dashoffset: offset | stroke-dasharray: dasharray |
 *   stroke-linecap: keyword butt, round, square | stroke-linejoin: keyword miter, round, bevel, arcs, miter-clip |
 *   fill-rule, clip-rule: keyword nonzero, evenodd | paint-order: paint-order |
 *   vector-effect: keyword none, non-scaling-stroke.
 * A written attribute the policy does not keep on that element is dropped by the walk and listed.
 */
export type SvgCssTable = Readonly<Record<SvgCssProperty, SvgCssPropertyRule>>;

/** Resolver caps; the numbers are part of the contract. */
export interface SvgCssLimits {
  readonly maxStyleAttrChars: 2000;
  readonly maxStyleBlocks: 16;
  readonly maxCssChars: 32768;
  readonly maxRules: 512;
  readonly maxDeclarations: 64;
  readonly maxSelectors: 32;
  readonly maxClassTokens: 32;
  readonly maxBracketDepth: 8;
  readonly maxPaintChars: 200;
  readonly maxValueChars: 64;
  readonly maxDashValues: 32;
  readonly maxColourFunctionDepth: 2;
  readonly maxHrefHops: 8;
  readonly maxStopsPerGradient: 256;
  readonly maxStopClones: 1024;
}

export interface SvgCssPolicy {
  readonly properties: SvgCssTable;
  readonly limits: SvgCssLimits;
  /** Most bytes the resolver may write (icon: svg-sanitize SVG_MAX_BYTES; image: svg-image IMAGE_MAX_BYTES). */
  readonly maxWrittenBytes: number;
}

/** What resolveCss reports. `dropped` holds the listing names (`style`, `<element>@style`, a gradient's href name). */
export type SvgCssOutcome = { status: 'ok'; dropped: readonly string[] } | { status: 'too_complex' };

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
  /** CSS paint resolver data (pending; see that section). */
  readonly css: SvgCssPolicy;
}

export type SvgParse = { root: Element; via: 'xml' | 'html'; doc: Document } | undefined;

/** What src/svg-safety/index.ts exports. */
export interface SvgSafety {
  denied(value: string, policy: SvgPolicy): boolean;
  onlyFunctions(value: string, allowed: readonly string[]): boolean;
  cleanValue(kind: SvgValueKind, value: string, policy: SvgPolicy): string | undefined;
  withinLimits(root: Element, limits: SvgWalkLimits): 'ok' | 'too_complex';
  parseLenient(text: string): SvgParse;
  /** Pending (section "CSS paint resolver"): changes `root` in place. */
  resolveCss(root: Element, policy: SvgPolicy): SvgCssOutcome;
  byteLength(text: string): number;
  escapeText(s: string): string;
  escapeAttr(s: string): string;
}
