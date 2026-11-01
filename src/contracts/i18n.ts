// Contract: i18n. Version 2.0.0.

export const I18N_CONTRACT_VERSION = '2.0.0';
export const I18N_CONTRACT_REVISION = 6;

export type Locale = 'en-GB' | 'en-US' | 'nl';
/** Table order inside messages.gen.ts. */
export const LOCALES: readonly Locale[] = ['en-GB', 'en-US', 'nl'];
export const BASE_LOCALE: Locale = 'en-GB';
/** English variants that read British spelling; every other en-* is American. */
export const BRITISH_ENGLISH: readonly string[] = ['en-gb', 'en-au', 'en-nz', 'en-ie', 'en-za', 'en-in'];
/** Joins the entries of one locale table. Forbidden inside messages (D6). */
export const TABLE_SEPARATOR = '|';

/** Id in shipped code: the message's index in the namespace tables, written by tools/i18n-loader.cjs in place of the key. */
export type MessageIndex = number;
export type MessageArgs = Record<string, string | number>;
export type RichArgs = Record<string, unknown>;
/** Three TABLE_SEPARATOR-joined strings in LOCALES order; entry i of each is message i. */
export type LocaleTables = readonly [enGB: string, enUS: string, nl: string];
/** tools/i18n/test-msg.ts (tests only): renders a key in the runtime's current locale. */
export type TestMsg = (key: string, args?: MessageArgs) => string;
/** tools/i18n/test-msg.ts (tests only): the table index the build turns a key into. */
export type TestMsgIndex = (key: string) => MessageIndex;

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
  t(id: MessageIndex, args?: MessageArgs): string;
  tx(id: MessageIndex, args: RichArgs): unknown[];
  /** Identity marker for data literals (the key becomes the index after the loader). */
  m(id: MessageIndex): MessageIndex;
}
export type I18nFor = (ns: I18nNamespace, tables: LocaleTables) => ModuleI18n;
/** A table-chunk namespace. */
export interface LazyModuleI18n extends ModuleI18n {
  /** Resolves true once the tables are usable, false when the table chunk failed to load. Never
   *  rejects. One shared promise per namespace per bundle; the first call starts the import(). */
  ready(): Promise<boolean>;
}
/** `load` is the namespace's import() of its messages.gen module (webpackChunkName "i18n-<ns>"). */
export type I18nForLazy = (ns: I18nNamespace, load: () => Promise<{ default: LocaleTables }>) => LazyModuleI18n;

export type NsStatus = 'pending' | 'complete';

export interface I18nModuleEntry {
  /** Bundle file(s) that carry the call sites. */
  bundle: string;
  /** Source folders or files whose call sites belong to this namespace (checked against stats.json). */
  folders: readonly string[];
  /** 'inline': tables in `bundle`; 'chunk': tables in `chunk`, import()ed by every bundle in `bundle`. */
  tables: 'inline' | 'chunk';
  /** Table chunk file, when tables is 'chunk'. */
  chunk?: string;
  /** 'complete' once en-US and nl are both complete. */
  status: NsStatus;
  /** Label of the extraction batch that owns this namespace. */
  slice: string;
  /** Downloaded when a dashboard renders (must stay about +0). */
  dashboard: boolean;
}

export const I18N_MODULES = {
  card: { bundle: 'magic-card.js (second copy in magic-card-animation-studio.js, accepted)', folders: ['src/card', 'src/modules (dashboard text only)', 'src/icons', 'src/utils (runtime files, dashboard text only)'], tables: 'inline', status: 'complete', slice: 'I1', dashboard: true },
  labels: {
    bundle: 'magic-card-editor.js, magic-card-animation-studio.js (lm() numbers also in magic-card.js)',
    folders: [
      'src/utils/css-properties.ts', 'src/utils/css-property-options.ts', 'src/utils/animation-presets.ts',
      'src/editor/components/font-picker.ts (group names; family names are not messages)', 'src/utils/seasonal-scenes.ts',
      'src/modules (module descriptions)',
      'files compiled into both magic-card-editor.js and the studio entry (I0b lists them from stats.json)',
    ],
    tables: 'chunk', chunk: 'magic-card-i18n-labels.js', status: 'complete', slice: 'I0b, I2c, I7, I10', dashboard: false,
  },
  'card-status': { bundle: 'magic-card-status.js', folders: ['src/card-status'], tables: 'inline', status: 'complete', slice: 'status', dashboard: true },
  'card-editor': { bundle: 'magic-card-editor.js', folders: ['src/editor (minus icon-animator and files the studio also compiles)'], tables: 'inline', status: 'complete', slice: 'I2', dashboard: false },
  'layer-editor': { bundle: 'magic-card-layer-editor.js', folders: ['src/editor/layers (the panels: layer-groups, layer-styles, tokens, controls, cost, looks, bg-layers, bg-layer-editor, bg-layers-ops, layers-sheet)', 'src/editor/components/mc-anchor-grid.ts'], tables: 'inline', status: 'complete', slice: 'T13', dashboard: false },
  'path-canvas': { bundle: 'magic-card-path-canvas.js', folders: ['src/path-canvas'], tables: 'inline', status: 'complete', slice: 'I3', dashboard: false },
  'svg-editor': { bundle: 'magic-card-svg-editor.js', folders: ['src/svg-editor'], tables: 'inline', status: 'complete', slice: 'I4', dashboard: false },
  'image-editor': { bundle: 'magic-card-image-editor.js', folders: ['src/image-editor'], tables: 'inline', status: 'complete', slice: 'image', dashboard: false },
  'path-tools': { bundle: 'magic-card-path-tools.js', folders: ['src/path-tools'], tables: 'inline', status: 'complete', slice: 'I4', dashboard: false },
  'shape-editor': { bundle: 'magic-card-shape-editor.js', folders: ['src/shape-editor'], tables: 'inline', status: 'complete', slice: 'I5', dashboard: false },
  transfer: { bundle: 'magic-card-transfer.js', folders: ['src/transfer'], tables: 'inline', status: 'complete', slice: 'I6', dashboard: false },
  'image-transfer': { bundle: 'magic-card-image-transfer.js', folders: ['src/image-transfer'], tables: 'inline', status: 'complete', slice: 'image', dashboard: false },
  'anim-studio': { bundle: 'magic-card-animation-studio.js', folders: ['src/anim-studio'], tables: 'inline', status: 'complete', slice: 'I7', dashboard: false },
  'icon-animator': { bundle: 'magic-card-icon-animator.js', folders: ['src/icon-anim (editor files)', 'src/editor/components/icon-animator'], tables: 'inline', status: 'complete', slice: 'I7', dashboard: false },
  'theme-editor': { bundle: 'magic-card-theme-editor.js', folders: ['src/theme-editor (minus presets)'], tables: 'inline', status: 'complete', slice: 'I8', dashboard: false },
  'mcu-panel': { bundle: 'magic-card-utils www/magic_card_utils_panel.js', folders: ['magic-card-utils/custom_components/magic_card_utils/www'], tables: 'inline', status: 'complete', slice: 'I9', dashboard: false },
  'icon-library': { bundle: 'magic-card-icon-library.js, magic-card-icon-animator.js', folders: ['src/icon-anim/library', 'src/icon-anim/library.ts'], tables: 'chunk', chunk: 'magic-card-i18n-icons.js', status: 'complete', slice: 'I10', dashboard: false },
  'preset-catalogue': { bundle: 'magic-card-preset-catalogue.js', folders: ['src/preset-catalogue'], tables: 'inline', status: 'complete', slice: 'I10', dashboard: false },
  'controls': { bundle: 'magic-card-controls.js', folders: ['src/modules/controls/dropdown-view.ts', 'src/modules/controls/light-view.ts', 'src/modules/controls/spinbox-view.ts'], tables: 'inline', status: 'complete', slice: 'I10', dashboard: true },
  'modules-extra': { bundle: 'magic-card-modules-extra.js', folders: ['src/modules/advanced/custom-card-view.ts', 'src/modules/advanced/forecast-view.ts', 'src/modules/content/camera-view.ts', 'src/modules/content/graphs-view.ts', 'src/modules/layout/tabs-view.ts'], tables: 'inline', status: 'complete', slice: 'I10', dashboard: true },
  'image-tools': { bundle: 'magic-card-image-tools.js', folders: ['src/image-tools'], tables: 'inline', status: 'complete', slice: 'image', dashboard: false },
  'look-editor': { bundle: 'magic-card-look-editor.js', folders: ['src/look-editor'], tables: 'inline', status: 'complete', slice: 'flow-slider-styles', dashboard: false },
  'theme-presets': { bundle: 'magic-card-theme-presets.js', folders: ['src/theme-editor/presets'], tables: 'inline', status: 'complete', slice: 'I10', dashboard: false },
} as const satisfies Record<string, I18nModuleEntry>;
export type I18nNamespace = keyof typeof I18N_MODULES;
// dashboard: false for icon-library and preset-catalogue: checked against the chunk graph, the
// import() sites and an 80-card Chromium run that loaded neither.

/** Minified bytes of src/i18n/runtime.ts per copy (magic-card.js, studio entry, theme-editor entry),
 *  tables excluded. Measured 1,257 before i18nForLazy. */
export const I18N_RUNTIME_MAX_BYTES = 2_048;
/** On: the release gate needs every namespace 'complete' and every baseline at 0. */
export const I18N_RELEASE_STRICT = true;

/** html`` attributes and lit properties whose letter strings must go through t (D5). */
export const SCANNED_ATTRIBUTES: readonly string[] = ['title', 'label', 'placeholder', 'aria-label', 'aria-description', 'alt', 'helper', '.label', '.title', '.helper', '.placeholder', '.closeLabel', '.moveLabel', '.resizeLabel', '.maximizeLabel', '.restoreLabel'];
/** Object properties whose letter strings must go through t or m (D5). */
export const SCANNED_PROPERTIES: readonly string[] = ['label', 'title', 'name', 'description', 'help', 'hint', 'placeholder', 'tooltip', 'message', 'text', 'closeLabel', 'resetLabel', 'valueText', 'numberLabel'];

/**
 * Input of tools/i18n-us.mjs (dev time only, never shipped): en-GB -> en-US, whole words, case kept per
 * word (Colour -> Color). Explicit list on purpose: no "-ise" rule (rise, precise, noise, promise,
 * otherwise). Anything the list cannot express goes in tools/i18n/en-US-exceptions.json.
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
  minimise: 'minimize', maximise: 'maximize', maximised: 'maximized', normalise: 'normalize', normalised: 'normalized',
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
