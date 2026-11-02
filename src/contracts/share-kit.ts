// Contract: share-kit, the child chunk of the transfer chunk that makes shared files safe. Version 1.0.0
// (SHARE_KIT_VERSION). Strict value types, entity placeholders, demo states, the card reader, the import notice,
// previews, the mapping step and the contrast check. It holds no HTML or SVG sink and makes no request.

import type { TemplateResult, nothing } from 'lit';
import type { MagicCardConfig } from '../types';
import type { ThemeDoc } from './theme-editor';
import type { ContrastReport } from './theme-safety';
import type { TransferDataByKind, TransferItem, TransferKind, TransferNote, TransferNoteCode } from './preset-transfer';

export const SHARE_KIT_VERSION = '1.0.0';
export const SHARE_KIT_CHUNK = 'share-kit';
export const SHARE_KIT_CHUNK_FILE = 'magic-card-share-kit.js';
/** The Wall tablet of the import preview: its own chunk, loaded when the toggle is pressed (in the same loader file as the kit). */
export const SHARE_TABLET_CHUNK = 'share-tablet';
export const SHARE_TABLET_CHUNK_FILE = 'magic-card-share-tablet.js';
/** Hard ceiling of the chunk's raw size; the enforced cap lives in tools/size-caps.json. Raising it changes this contract. */
export const SHARE_KIT_CHUNK_CEILING = 41 * 1024; // 41,984 B
/**
 * The one import() site of the share-kit chunk. It resolves undefined on a failed load, after LOAD_TIMEOUT_MS or for
 * another major version, and the transfer panel then offers neither import nor export.
 */
export const SHARE_KIT_LOADER = 'src/transfer/share-kit-loader.ts';

/**
 * Allow-list value grammars. Every type also takes var(--name) with an optional fallback of the same type, and
 * inherit, initial, unset. Colour and length follow src/utils/safe-css.ts (safeColor, cssLengths).
 */
export type StrictType = 'colour' | 'rgb' | 'gradient' | 'length' | 'number' | 'time' | 'shadow' | 'font' | 'keyword' | 'paint-image';

/** Rule ids named in notes and refusals; a note or refusal names the rule and the path, never the value. */
export type StrictRuleId =
  | `strict.${StrictType}`
  | 'strict.background'
  | 'strict.any'
  | 'strict.marker'
  | 'strict.host'
  | 'strict.card-mod'
  | 'strict.action-url'
  | 'strict.css';

/** How a theme key's value is typed: the first rule whose `match` fits the key name. */
export interface ThemeKeyRule {
  readonly id: StrictRuleId;
  readonly match: RegExp;
  readonly types: readonly StrictType[];
}

/** Theme key types by name, first match wins; a key no rule matches takes STRICT_ANY_TYPES. */
export const THEME_KEY_TYPES = [
  { id: 'strict.rgb', match: /^rgb-|-rgb$/i, types: ['rgb'] },
  { id: 'strict.colour', match: /(?:^|-)(?:color|colour|fill|stroke)$/i, types: ['colour'] },
  { id: 'strict.background', match: /(?:^|-)background$/i, types: ['colour', 'gradient', 'paint-image'] },
  { id: 'strict.shadow', match: /(?:^|-)shadow$/i, types: ['shadow'] },
  { id: 'strict.font', match: /(?:^|-)font(?:-family)?$/i, types: ['font'] },
  { id: 'strict.number', match: /(?:^|-)(?:font-weight|opacity|line-height|z-index|scale)$/i, types: ['number', 'keyword'] },
  { id: 'strict.time', match: /(?:^|-)(?:duration|delay)$/i, types: ['time'] },
  { id: 'strict.length', match: /(?:^|-)(?:radius|size|width|height|padding|margin|gap|spacing|offset)$/i, types: ['length'] },
] as const satisfies readonly ThemeKeyRule[];
/** Types of any other key THEME_VAR_RE accepts (rule strict.any): every type except paint image. */
export const STRICT_ANY_TYPES: readonly StrictType[] = ['colour', 'rgb', 'gradient', 'length', 'number', 'time', 'shadow', 'font', 'keyword'];

/** A paint image may use only these two URL forms; a `/local/` path never holds "..". */
export const PAINT_DATA_URL_RE = /^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
export const PAINT_LOCAL_PATH_RE = /^\/local\/(?!.*\.\.)[A-Za-z0-9._/-]+$/;
/** A device font name (quoted or bare), beside the picker families and the CSS generic families. */
export const FONT_NAME_RE = /^[A-Za-z0-9 _-]{1,64}$/;
/** One bare keyword; a keyword value holds 1 to 4 of them and no function. */
export const KEYWORD_RE = /^-?[a-z][a-z0-9-]{0,31}$/;

/**
 * Break-out and escape markers (matched without regard to case): any one refuses the whole file. Also a marker: a
 * `;` outside quotes and parentheses, and a control character (U+0000 to U+001F, U+007F).
 */
export const BREAKOUT_MARKERS: readonly string[] = ['{', '}', '<', '@', '\\', '/*', 'expression(', 'javascript:'];
/** Markers that refuse a file in free-form card css, where `;` separates declarations; other bad text fails the type check. */
export const CSS_BREAKOUT_MARKERS: readonly string[] = ['{', '}', '@', '\\', 'expression(', 'javascript:'];
/** A declaration name kept in free-form css; any other declaration is dropped and listed. */
export const CSS_PROPERTY_RE = /^(--[A-Za-z0-9_-]+|-?[a-z][a-z-]*)$/;
/** Declarations that may also hold a paint image; free-form css declarations always also take keyword. */
export const CSS_PAINT_PROPERTIES: readonly string[] = ['background', 'background-image', 'border-image', 'border-image-source', 'mask', 'mask-image', '-webkit-mask-image', 'list-style-image'];

/** Result of one value check: kept (with an info note), dropped (rest of the file kept) or refused (whole file). */
export type ValueVerdict =
  | { verdict: 'kept'; value: string | number; note?: Extract<TransferNoteCode, 'local_path' | 'card_mod'> }
  | { verdict: 'dropped'; rule: StrictRuleId; hosts?: string[] }
  | { verdict: 'refused'; rule: StrictRuleId };

/** Where a file was refused: item index (-1 the file), field path and rule. */
export interface ValueRefusal {
  item: number;
  path: string;
  rule: StrictRuleId;
}

/** Free-form css after its per-declaration check. */
export type CssCheck = { ok: true; css: string; notes: TransferNote[] } | { ok: false; refusal: ValueRefusal };

/** Home Assistant entity domains the free-text scan knows, beside any domain already seen in an entity field. */
export const ENTITY_DOMAINS = [
  'ai_task', 'air_quality', 'alarm_control_panel', 'assist_satellite', 'automation', 'binary_sensor', 'button', 'calendar',
  'camera', 'climate', 'conversation', 'counter', 'cover', 'date', 'datetime', 'device_tracker', 'event', 'fan', 'geo_location', 'group',
  'humidifier', 'image', 'image_processing', 'input_boolean', 'input_button', 'input_datetime', 'input_number',
  'input_select', 'input_text', 'lawn_mower', 'light', 'lock', 'media_player', 'notify', 'number', 'person', 'remote',
  'scene', 'schedule', 'script', 'select', 'sensor', 'siren', 'stt', 'sun', 'switch', 'text', 'time', 'timer', 'todo',
  'tts', 'update', 'vacuum', 'valve', 'wake_word', 'water_heater', 'weather', 'zone',
] as const;
/** Object ids the scan never treats as an entity (file extensions); ids starting PLACEHOLDER_PREFIX are skipped too. */
export const NOT_ENTITY_OBJECT_IDS: readonly string[] = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'js', 'css', 'json', 'yaml'];
export const PLACEHOLDER_PREFIX = 'mc_placeholder_';
/** A placeholder id: `<domain>.mc_placeholder_<n>`, n from 1 in first-occurrence order per export. */
export const PLACEHOLDER_ID_RE = /^([a-z][a-z0-9_]*)\.mc_placeholder_([1-9][0-9]*)$/;
/** An entity id a placeholder may be mapped to. */
export const ENTITY_ID_RE = /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/;

/** One entry of the envelope header `placeholders`. */
export interface EntityPlaceholder {
  id: string;
  domain: string;
}

/** Items with their entity ids replaced, and the header list. `originals` (placeholder to entity id) is never written. */
export interface PlaceholderExport<K extends TransferKind = TransferKind> {
  items: TransferItem<K>[];
  placeholders: EntityPlaceholder[];
  originals: Readonly<Record<string, string>>;
  /** Domain names of the absolute addresses that were taken out, for the export notice. */
  removedHosts: readonly string[];
}

/** A made-up state for the import preview only, never given to hass; it carries no entity_picture. */
export interface DemoState {
  entity_id: string;
  state: string;
  attributes: Readonly<Record<string, string | number>>;
}

/** The value of `type` a shared card must have. */
export const SHARED_CARD_TYPE = 'custom:magic-card';
export type SharedCardConfig = MagicCardConfig & { type: typeof SHARED_CARD_TYPE };

/**
 * Key lists the card editor host passes in, so share-kit carries no copy: the card's own keys, module keys per
 * type and the common module keys, and the strict types of each design key (src/utils/css-design-map.ts).
 */
export interface CardKeyLists {
  cardKeys: readonly string[];
  moduleKeys: Readonly<Record<string, readonly string[]>>;
  commonModuleKeys: readonly string[];
  designTypes: Readonly<Record<string, readonly StrictType[]>>;
}

/** One card item read from a file: the kept config and its notes, or no item (refused, with a file refusal or not). */
export type CardReadResult =
  | { ok: true; data: SharedCardConfig; notes: TransferNote[] }
  | { ok: false; notes: TransferNote[]; refusal?: ValueRefusal };

/** An action a shared card keeps, listed before Confirm. `host` only for a url action. */
export interface SharedAction {
  item: number;
  path: string;
  action: string;
  service?: string;
  targets: string[];
  host?: string;
}

/** A Jinja template a shared card keeps, shown as text before Confirm, never rendered. */
export interface SharedTemplate {
  item: number;
  path: string;
  text: string;
}

/** What the import notice lists for the items about to be saved. */
export interface ImportNotice {
  placeholders: EntityPlaceholder[];
  actions: SharedAction[];
  templates: SharedTemplate[];
}

/** Helpers the transfer chunk hands share-kit once; share-kit imports none of them. */
export interface ShareKitHelpers {
  note(code: TransferNoteCode, item: number, path: string, message: string, hosts?: string[]): TransferNote;
  droppedKey(item: number, path: string): TransferNote;
  /** The icon sanitiser of kind icon: cleaned markup (undefined when nothing is left) and its notes. */
  sanitizeIcon(item: number, path: string, svg: string): { svg?: string; notes: TransferNote[] };
}

/**
 * The views and texts the transfer panel shows, so it reaches the chunk through the kit alone. They render names and
 * values as text and make no request.
 */
export interface ShareKitViews {
  /** The line above the preview of every import. */
  untrustedNotice(): string;
  exportNotes(hasAuthor: boolean, replaced: boolean, removedHosts?: readonly string[]): TemplateResult;
  /** The actions and templates of a shared card. */
  runView(run: ImportNotice): TemplateResult;
  contrastHeading(): string;
  /** The warning lines of one theme's contrast report. */
  contrastWarnings(report: ContrastReport): string[];
  contrastView(heading: string, items: { name: string; lines: string[] }[]): TemplateResult | typeof nothing;
  /** The mapping step: one entity field per placeholder with its demo value, `entities` offered by domain, and Skip. */
  mappingView(placeholders: readonly EntityPlaceholder[], values: Readonly<Record<string, string>>, onChange: (id: string, value: string) => void, onSkip: () => void, entities?: readonly string[]): TemplateResult;
  /** The import preview of the items, from previewSafe copies and demo states; a theme gets the Wall tablet, an animation <mc-anim-preview>. The chunk defines <mc-anim-preview> and <mc-map-entities> when it loads. */
  importPreview(kind: TransferKind, items: readonly TransferItem[], placeholders: readonly EntityPlaceholder[], wallTablet: boolean, onWallTablet: () => void): TemplateResult;
}

/** What the share-kit chunk gives the transfer chunk. Pure and synchronous, except where an element is passed in. */
export interface ShareKit {
  version: typeof SHARE_KIT_VERSION | string;
  /** One value against the types allowed for it. */
  checkValue(value: unknown, types: readonly StrictType[]): ValueVerdict;
  /** One theme value, typed by its key (THEME_KEY_TYPES); a finite number is kept; card-mod-* keys keep the card_mod note. */
  themeValue(key: string, value: unknown): ValueVerdict;
  /** The first break-out or escape marker in any string of `value`, as a refusal at `path`. */
  scanMarkers(item: number, path: string, value: unknown): ValueRefusal | undefined;
  /** Free-form card css, split into declarations and checked one by one. */
  checkCss(item: number, path: string, css: string): CssCheck;
  /** One card item: type, keys, design values, css, actions, url hosts and inline SVG. */
  readCard(item: number, data: unknown, lists: CardKeyLists): CardReadResult;
  /** Entity ids of every string replaced by placeholders, whole ids only, longest first, one pass per string. */
  placeholderItems<K extends TransferKind>(kind: K, items: readonly TransferItem<K>[]): PlaceholderExport<K>;
  /** Placeholder ids in `value`, in first-occurrence order, each once. */
  findPlaceholders(value: unknown): EntityPlaceholder[];
  /** A copy of `value` with placeholder ids replaced by the mapped entity ids, with the same boundaries as above. */
  applyMapping<T>(value: T, map: Readonly<Record<string, string>>): T;
  /** A demo state per placeholder, by its domain. */
  demoStates(placeholders: readonly EntityPlaceholder[]): Record<string, DemoState>;
  importNotice<K extends TransferKind>(kind: K, items: readonly TransferItem<K>[]): ImportNotice;
  /** What the CSS resolver and the parser drop without a trace in the markup: a removed xml-stylesheet line in `input`; with `resolved`, in the style elements and attributes of `elements`, an @import, a url() to another file, expression() or behavior. `what` is worded for Removed {what}. */
  styleDrops(input: string, elements: readonly Element[], resolved: boolean): { what: string; count: number }[];
  /** A preview copy that makes no request: other images become a neutral pattern, picker fonts their fallback. */
  previewSafe<K extends TransferKind>(kind: K, data: TransferDataByKind[K]): TransferDataByKind[K];
  /** TEXT_PAIRS of a theme in light and dark, resolved on `probe` (a hidden element in the page). */
  checkContrast(doc: ThemeDoc, probe: HTMLElement): ContrastReport;
  /** What the panel renders and says. */
  views: ShareKitViews;
}

/** The share-kit chunk entry's export. */
export type CreateShareKit = (helpers: ShareKitHelpers) => ShareKit;
