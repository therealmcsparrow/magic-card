/*
 * Contract: i18n. Version 1.0.0, revision 1 (Architect-owned, 2026-10-18, PROPOSED until the Plan Gate). ADR 0032.
 * CEO request 2026-10-18, verbatim: "add us english to the i18n". CEO decisions the same day: UI copy is
 * British (colour, customise, centre, grey); config keys stay as they are; locales en-GB (base), en-US
 * (overrides only) and nl (complete: every user-facing string, in this pre-release, a missing nl string
 * fails the drift check); the i18n slice of a screen runs right after its UI-kit slice, in the same lane.
 * Replaces src/localize/ (73 keys, en + nl JSON, both inlined in magic-card.js).
 *
 * ── Locales ──
 * en-GB  base and source text. Every message id IS its en-GB text (see "Message ids"). Always complete.
 * en-US  en-GB run through EN_US_WORDS (whole words, case kept) plus per-Module explicit exceptions
 *        (`enUS` table) for what the word list cannot express. Nothing else is stored for en-US.
 * nl     a full catalogue per Module, keyed by the en-GB text. Missing entry at run time -> en-GB.
 * Unsupported languages fall back to en-GB (the base). Never a raw key: the id is readable English.
 * Config keys and values never change (color, background_color, align: center stay as they are); only
 * the labels shown for them follow the locale.
 *
 * ── Picking the locale (resolveLocale, pure) ──
 * Input: hass.locale.language, else hass.language, else navigator.language. Lower-cased BCP 47.
 *   'en-gb', 'en-au', 'en-nz', 'en-ie', 'en-za', 'en-in'  -> 'en-GB'  (BRITISH_ENGLISH)
 *   'en' and any other 'en-*'                              -> 'en-US'  (HA's "English" is American)
 *   'nl', 'nl-*'                                           -> 'nl'
 *   anything else, empty or malformed                      -> 'en-GB'
 * Each bundle calls setI18nLocale(hass) when hass changes: the card (Core card element, replacing
 * setLanguage), the card-editor chunk, the studio entry, the theme-editor entry, the MCU panel.
 * Numbers, dates and times keep src/utils/locale-format.ts (hass.locale number_format, time_format,
 * time_zone); `#` and numeric args in messages use its formatNumber. Never toLocaleString() bare.
 * Every screen root sets lang="<locale>" (WCAG 3.1.2). HA-owned words (states, domains, attributes) keep
 * coming from hass.localize / hass.formatEntityState, never from our catalogues.
 *
 * ── Message ids (ADR 0032) ──
 * The id is the en-GB text itself: t('Background colour'). No key tables, no en-GB JSON. Reasons: the
 * caps (a keyed table costs about 15 B per string, about 20 KB in the card-editor chunk; t('...') costs
 * about 4 B) and one place for the source text. Changing the English text changes the id, so the drift
 * check flags the stale nl entry and the localizer re-translates: wanted.
 * Context, only when one English text needs two Dutch texts: tc('verb', 'Clear') -> catalogue key
 * 'verb|Clear'. Data catalogues (icon names, preset names, theme names, CSS option labels) mark their
 * en-GB literals with m('Flame') (identity at run time, a marker for extraction) and render t(item.name).
 * Search over such names matches the en-GB, en-US and current-locale forms.
 *
 * ── Message syntax (ICU subset, own parser, no dependency) ──
 *   {name}                                         argument; numbers through formatNumber
 *   {n, plural, =0 {...} one {# point} other {# points}}   Intl.PluralRules(locale); `other` required
 *   {kind, select, line {...} other {...}}         `other` required
 * Branches may hold {name} arguments, not another plural or select. No literal braces or apostrophe
 * quoting. Arguments are inserted as text after resolution (en-US words never touch user data: an
 * icon called "Grey lamp" stays "Grey lamp"). Never innerHTML. Rich text: tx(id, args) returns parts
 * (string | unknown) for lit to render, e.g. tx('Delete {name}? This cannot be undone.', { name: html`<strong>..</strong>` });
 * rich parts never cross a bundle boundary.
 *
 * ── Modules, delivery and sizes ──
 * src/i18n/runtime.ts (in magic-card.js, shared at 0 B by every chunk below it): resolveLocale,
 * setI18nLocale, i18nFor(), the ICU-subset formatter. Budget I18N_RUNTIME_MAX_BYTES minified.
 * The 'card' namespace (card runtime and the runtime lazy chunks: slider, seasonal, markdown,
 * modules-extra) keeps its nl catalogue inline in magic-card.js whatever its size: a dashboard never
 * waits for a second request. src/i18n/en-us.ts (the EN_US_WORDS transform) is NOT in magic-card.js:
 * the card-editor chunk, the studio entry, the theme-editor entry and MCU install it with
 * useAmericanizer(fn) (a hook like useV2Compiler). Without it, en-US uses the explicit `enUS` table only,
 * so the 'card' namespace lists all its en-US differences explicitly (drift rule D4).
 * Per Module: `export const i18n = i18nFor(ns, { enUS, nl: () => import(/* webpackChunkName: "i18n-nl-<ns>" *\/ './i18n/nl') })`
 * giving dist/magic-card-i18n-nl-<ns>.js; nl inline instead when its catalogue is under
 * NL_INLINE_MAX_BYTES (the `nl` column below is the plan; the slice measures and may switch it).
 * i18nFor creates closures only: no global side effect, so it is allowed at module top level of a lazy
 * chunk (lazy-module 1.0.0). The Module's loader (or install()) awaits i18n.ensure() before the first
 * render; the svg, shape and path loaders start it in parallel with the chunk import. ensure() is
 * idempotent and resolves at once for en-GB and en-US. Catalogue import fails or exceeds
 * CATALOGUE_TIMEOUT_MS: one console.warn, en-GB for this session, retried on the next ensure() after a
 * locale change.
 * ui-kit 1.0.0 holds no strings (its helpers and elements take every label from the caller), so the kit
 * has no namespace and its elements show the caller's locale even when defined by another bundle.
 *
 * ── Drift check (tools/check-i18n.mjs, `npm run i18n -- --check`, release.yml after the size step) ──
 * D1 Extraction: the first argument of t / tc / tx / m is a string literal (no variables, no ${}).
 * D2 nl: every extracted id of a Module whose nl status is 'complete' has an nl entry with the same
 *    argument names and valid plural/select branches; no stale nl entries. Release gate: every Module
 *    'complete' (I18N_RELEASE_STRICT, switched on in slice I11).
 * D3 British: no American form from EN_US_WORDS in any en-GB id (allowlist tools/i18n/allow.json, e.g.
 *    the CSS property name background-color shown as code); an en-GB word ending -ise / -isation / -our
 *    that is neither in EN_US_WORDS nor allowlisted fails, so new copy extends the list in the same PR.
 * D4 en-US: every `enUS` key is an extracted id and differs from americanize(id); tools/i18n/en-US.golden.txt
 *    (every id whose en-US form differs, generated) matches, so each override is reviewed in the PR.
 * D5 No hard-coded user strings: TS/JS AST scan of html`` text and the attributes and properties in
 *    SCANNED_ATTRIBUTES / SCANNED_PROPERTIES holding letters, outside t/tc/tx/m, src/i18n, src/contracts
 *    and the allowlist (brand and technical tokens: Magic Card, YAML, SVG, MDI, CSS, px). Per-Module
 *    baseline tools/i18n/baseline.json may only go down; 0 for a Module when its slice is done.
 * D6 Syntax: every id and nl entry parses with the subset; no literal braces.
 * Characterization (local vitest, tests/ is not committed): per screen, a text snapshot (text nodes,
 * aria-label, title, placeholder, alt) before extraction, unchanged after extraction, changed only by
 * the reviewed spelling list after the British pass; YAML of the 60 gallery cards unchanged throughout.
 *
 * ── Magic Card Utils ──
 * tools/export-i18n.mjs transpiles runtime.ts and en-us.ts to www/mc-i18n.js (ES module, recorded in
 * MCU VENDORED.md with the Magic Card version and SHA-256, same pattern as www/mc-ui-kit.js). The panel
 * uses namespace 'mcu-panel' with www/i18n/nl.js (lazy). check-i18n.mjs scans MCU with --root.
 * Config flow: HA rules apply there. translations/en.json (HA's base, American), en-GB.json and nl.json
 * next to strings.json (today there is no translations/ folder, so the flow has no runtime strings).
 *
 * ── Error cases ──
 * unknown locale -> en-GB | id missing in nl -> en-GB text | malformed message -> en-GB text, one
 * console.debug per id | missing argument -> empty string, console.debug | catalogue load failure or
 * timeout -> en-GB for the session, retry after a locale change | americanizer not installed -> explicit
 * enUS table only.
 */

export const I18N_CONTRACT_VERSION = '1.0.0';
export const I18N_CONTRACT_REVISION = 1;

export type Locale = 'en-GB' | 'en-US' | 'nl';
export const LOCALES: readonly Locale[] = ['en-GB', 'en-US', 'nl'];
export const BASE_LOCALE: Locale = 'en-GB';
/** English variants that read British spelling; every other en-* is American. */
export const BRITISH_ENGLISH: readonly string[] = ['en-gb', 'en-au', 'en-nz', 'en-ie', 'en-za', 'en-in'];

/** The en-GB text of a message; also its catalogue key. */
export type MessageId = string;
export type MessageArgs = Record<string, string | number>;
export type RichArgs = Record<string, unknown>;
/** nl catalogue: en-GB id (or 'context|id') -> Dutch message in the same ICU subset. */
export type Catalogue = Readonly<Record<MessageId, string>>;

export type ResolveLocale = (hassLanguage: string | undefined) => Locale;

export interface LocaleHassLike {
  language?: string;
  locale?: { language?: string; number_format?: string; time_format?: string; time_zone?: string };
}
export type SetI18nLocale = (hass: LocaleHassLike | undefined) => Locale;

export interface ModuleI18n {
  readonly ns: I18nNamespace;
  /** Current locale of this bundle. */
  locale(): Locale;
  t(id: MessageId, args?: MessageArgs): string;
  tc(context: string, id: MessageId, args?: MessageArgs): string;
  tx(id: MessageId, args: RichArgs): unknown[];
  /** Loads the current locale's catalogue; idempotent; never rejects. */
  ensure(): Promise<void>;
}

export interface ModuleI18nOptions {
  /** en-US exceptions the word list cannot express: en-GB id -> en-US text. Usually empty. */
  enUS?: Readonly<Record<MessageId, string>>;
  /** nl catalogue, inline or as a lazy chunk import. */
  nl: Catalogue | (() => Promise<{ default: Catalogue }>);
}
export type I18nFor = (ns: I18nNamespace, options: ModuleI18nOptions) => ModuleI18n;
/** Identity at run time; marks a data literal for extraction. */
export type MarkMessage = (id: MessageId) => MessageId;
/** Installs the EN_US_WORDS transform (card-editor chunk, studio, theme editor, MCU). */
export type UseAmericanizer = (fn: (enGb: string) => string) => void;

export type NlStatus = 'pending' | 'complete';
export type NlDelivery = 'inline' | 'lazy';

export interface I18nModuleEntry {
  /** Bundle file that carries the Module's call sites. */
  bundle: string;
  /** Source folders whose call sites belong to this namespace (I0 confirms them against stats.json). */
  folders: readonly string[];
  /** Planned delivery; the slice measures the catalogue and applies NL_INLINE_MAX_BYTES ('card' is always inline). */
  nl: NlDelivery;
  /** Flipped to 'complete' by the localizer step of the Module's slice. */
  nlStatus: NlStatus;
  /** Slice in the plan that owns the extraction. */
  slice: string;
}

export const I18N_MODULES = {
  card: { bundle: 'magic-card.js', folders: ['src/card', 'src/modules', 'src/icons', 'src/utils (runtime files)'], nl: 'inline', nlStatus: 'pending', slice: 'I1' },
  'card-editor': { bundle: 'magic-card-editor.js', folders: ['src/editor (minus icon-animator)', 'src/utils (editor-only files, e.g. css-property-options.ts)'], nl: 'lazy', nlStatus: 'pending', slice: 'I2' },
  'path-canvas': { bundle: 'magic-card-path-canvas.js', folders: ['src/path-canvas'], nl: 'lazy', nlStatus: 'pending', slice: 'I3' },
  'svg-editor': { bundle: 'magic-card-svg-editor.js', folders: ['src/svg-editor'], nl: 'lazy', nlStatus: 'pending', slice: 'I4' },
  'path-tools': { bundle: 'magic-card-path-tools.js', folders: ['src/path-tools'], nl: 'lazy', nlStatus: 'pending', slice: 'I4' },
  'shape-editor': { bundle: 'magic-card-shape-editor.js', folders: ['src/shape-editor'], nl: 'lazy', nlStatus: 'pending', slice: 'I5' },
  transfer: { bundle: 'magic-card-transfer.js', folders: ['src/transfer'], nl: 'lazy', nlStatus: 'pending', slice: 'I6' },
  'anim-studio': { bundle: 'magic-card-animation-studio.js', folders: ['src/anim-studio'], nl: 'lazy', nlStatus: 'pending', slice: 'I7' },
  'icon-animator': { bundle: 'magic-card-icon-animator.js', folders: ['src/icon-anim (editor files)', 'src/editor/components/icon-animator'], nl: 'lazy', nlStatus: 'pending', slice: 'I7' },
  'theme-editor': { bundle: 'magic-card-theme-editor.js', folders: ['src/theme-editor (minus presets)'], nl: 'lazy', nlStatus: 'pending', slice: 'I8' },
  'mcu-panel': { bundle: 'magic-card-utils www/magic_card_utils_panel.js', folders: ['magic-card-utils/custom_components/magic_card_utils/www'], nl: 'lazy', nlStatus: 'pending', slice: 'I9' },
  'icon-library': { bundle: 'magic-card-icon-library.js', folders: ['src/icon-anim/library'], nl: 'lazy', nlStatus: 'pending', slice: 'I10' },
  'preset-catalogue': { bundle: 'magic-card-preset-catalogue.js', folders: ['src/preset-catalogue'], nl: 'lazy', nlStatus: 'pending', slice: 'I10' },
  'theme-presets': { bundle: 'magic-card-theme-presets.js', folders: ['src/theme-editor/presets'], nl: 'lazy', nlStatus: 'pending', slice: 'I10' },
} as const satisfies Record<string, I18nModuleEntry>;
export type I18nNamespace = keyof typeof I18N_MODULES;

/** Minified bytes of src/i18n/runtime.ts in magic-card.js (nl card catalogue excluded). */
export const I18N_RUNTIME_MAX_BYTES = 1_536;
/** An nl catalogue below this many minified bytes ships inline in its Module's bundle ('card' always inline). */
export const NL_INLINE_MAX_BYTES = 1_024;
export const CATALOGUE_TIMEOUT_MS = 4_000;
/** Off until slice I11; then the release gate needs every Module 'complete' and every baseline at 0. */
export const I18N_RELEASE_STRICT = false;

/** html`` attributes and lit properties whose letter strings must go through t (D5). */
export const SCANNED_ATTRIBUTES: readonly string[] = ['title', 'label', 'placeholder', 'aria-label', 'aria-description', 'alt', 'helper', '.label', '.title', '.helper', '.placeholder', '.closeLabel'];
/** Object properties whose letter strings must go through t or m (D5). */
export const SCANNED_PROPERTIES: readonly string[] = ['label', 'title', 'name', 'description', 'help', 'hint', 'placeholder', 'tooltip', 'message', 'text', 'closeLabel', 'resetLabel'];

/**
 * en-GB -> en-US, whole words, applied to the resolved en-GB message before arguments are inserted.
 * Case is kept per word (Colour -> Color, COLOUR -> COLOR). Explicit list on purpose: no "-ise" rule
 * (rise, precise, noise, promise, otherwise). D3 keeps it complete.
 */
export const EN_US_WORDS: Readonly<Record<string, string>> = {
  colour: 'color', colours: 'colors', coloured: 'colored', colouring: 'coloring', colourful: 'colorful',
  centre: 'center', centres: 'centers', centred: 'centered', centring: 'centering',
  grey: 'gray', greys: 'grays', greyed: 'grayed', greyscale: 'grayscale',
  customise: 'customize', customised: 'customized', customises: 'customizes', customising: 'customizing', customisation: 'customization',
  favourite: 'favorite', favourites: 'favorites',
  behaviour: 'behavior', behaviours: 'behaviors',
  organise: 'organize', organised: 'organized', organising: 'organizing',
  optimise: 'optimize', optimised: 'optimized', optimising: 'optimizing',
  minimise: 'minimize', maximise: 'maximize', normalise: 'normalize', normalised: 'normalized',
  synchronise: 'synchronize', synchronised: 'synchronized', initialise: 'initialize',
  visualise: 'visualize', personalise: 'personalize', prioritise: 'prioritize', summarise: 'summarize',
  randomise: 'randomize', randomised: 'randomized', recognise: 'recognize', recognised: 'recognized',
  emphasise: 'emphasize', finalise: 'finalize', stabilise: 'stabilize',
  analyse: 'analyze', analysed: 'analyzed',
  cancelled: 'canceled', cancelling: 'canceling', labelled: 'labeled', labelling: 'labeling',
  modelled: 'modeled', levelled: 'leveled', travelled: 'traveled',
  catalogue: 'catalog', catalogues: 'catalogs', licence: 'license', artefact: 'artifact', artefacts: 'artifacts',
  metre: 'meter', metres: 'meters', litre: 'liter', litres: 'liters',
};
