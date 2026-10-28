import { toYaml } from '../utils/yaml-utils';
import { CUSTOM_PREFIX } from '../anim-studio/model';
import { MAX_IMAGE_IMPORT_BYTES } from '../contracts/image-editor';
import { LIBRARY_ID_RE } from '../contracts/mcu-library';
import {
  AUTHOR_MAX_CHARS,
  DESCRIPTION_MAX_CHARS,
  HOST_KINDS,
  MAX_IMPORT_CHARS,
  MAX_IMPORT_ITEMS,
  TRANSFER_CONTRACT_VERSION,
  TRANSFER_FORMAT,
  TRANSFER_MAJOR,
  TRANSFER_MARKER_KEY,
} from '../contracts/preset-transfer';
import type {
  ClashChoice,
  ImageReader,
  ParseResult,
  TransferFormat,
  TransferItem,
  TransferKind,
  TransferNote,
  TransferRefusal,
  TransferSource,
} from '../contracts/preset-transfer';
import type { SvgCssResolve } from '../contracts/svg-safety';
import type { ThemeDoc } from '../contracts/theme-editor';
import { VERSION } from '../version';
import { looksLikeSvg } from '../svg-io/looks-like-svg';
import { detectOther, svgItem } from './detect';
import type { Detected } from './detect';
import { uniqueId } from './ids';
import { t } from './i18n';
import { readAnimation } from './kinds/animation';
import { readIcon } from './kinds/icon';
import { readShape } from './kinds/shape';
import { readTheme } from './kinds/theme';
import { safeParse } from './safe-parse';
import { isObj, note } from './types';
import type { KindResult, Raw } from './types';

export { checkFileSize } from './safe-parse';

const KINDS: readonly TransferKind[] = ['animation', 'theme', 'shape', 'icon', 'image'];
const ITEM_KEYS = ['id', 'name', 'author', 'description', 'keywords', 'data'];
const HEADER_KEYS = [TRANSFER_MARKER_KEY, 'kind', 'generator', 'items', 'item'];

const WHERE = (kind: TransferKind): string =>
  kind === 'animation'
    ? t('transfer.envelope.animation-files-are-imported-in-the-card')
    : kind === 'theme'
      ? t('transfer.envelope.theme-files-are-imported-in-magic-card')
      : kind === 'shape'
        ? t('transfer.envelope.shape-files-are-imported-in-the-card')
        : kind === 'image'
          ? t('transfer.envelope.image-files-are-imported-in-magic-card')
          : t('transfer.envelope.icon-files-are-imported-in-the-card');

const refuse = (refusal: TransferRefusal, message: string): ParseResult => ({ ok: false, refusal, message });

/** Reads "1.0", 1 (YAML turns 1.0 into a number) or "1.2". */
function formatOf(v: unknown): { major: number; minor: number } | undefined {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(String(v).trim());
  return m ? { major: +m[1], minor: +(m[2] ?? 0) } : undefined;
}

function readKind(kind: TransferKind, index: number, id: string, name: string, data: unknown, images?: ImageReader, file = false, css?: SvgCssResolve): KindResult {
  switch (kind) {
    case 'animation':
      return readAnimation(index, id, name, data);
    case 'theme':
      return readTheme(index, data);
    case 'shape':
      return readShape(index, data);
    case 'image':
      return images ? images.readImage(index, data, file ? { file: true, css } : undefined) : { ok: false, notes: [note('invalid_item', index, 'data.svg', t('transfer.envelope.the-checker-for-images-did-not-load-so'))] };
    default:
      return readIcon(index, data, css);
  }
}

function buildItems(found: Detected, images?: ImageReader, css?: SvgCssResolve): { items: TransferItem[]; notes: TransferNote[] } {
  const { kind } = found;
  const items: TransferItem[] = [];
  const notes: TransferNote[] = [];
  const ids = new Set<string>();
  found.items.forEach((raw, i) => {
    if (!isObj(raw)) {
      notes.push(note('invalid_item', i, '', t('transfer.envelope.this-entry-is-not-an-object')));
      return;
    }
    const id = typeof raw.id === 'string' ? raw.id.trim() : '';
    if (!LIBRARY_ID_RE.test(id)) {
      notes.push(note('invalid_item', i, 'id', t('transfer.envelope.the-id-must-be-1-64-lowercase-letters')));
      return;
    }
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    if (!name || name.length > 80) {
      notes.push(note('invalid_item', i, 'name', t('transfer.envelope.the-name-must-be-1-80-characters')));
      return;
    }
    if (ids.has(id)) {
      notes.push(note('invalid_item', i, 'id', t('transfer.envelope.the-id-id-appears-twice-in-this-file-the', { id })));
      return;
    }
    const itemNotes: TransferNote[] = [];
    for (const k of Object.keys(raw)) if (!ITEM_KEYS.includes(k)) itemNotes.push(note('dropped_key', i, k, t('transfer.envelope.key-is-not-a-preset-field-so-it-was-left', { key: k })));

    const item: TransferItem = { id, name, data: undefined as never };
    const text = (key: 'author' | 'description', max: number) => {
      const v = raw[key];
      if (v === undefined) return;
      if (kind === 'animation') {
        itemNotes.push(note('not_stored', i, key, key === 'author' ? t('transfer.envelope.animations-do-not-store-an-author-so-it') : t('transfer.envelope.animations-do-not-store-a-description-so')));
        return;
      }
      const val = typeof v === 'string' ? v.trim() : '';
      if (val && val.length <= max) item[key] = val;
      else itemNotes.push(note('dropped_value', i, key, key === 'author' ? t('transfer.envelope.the-author-must-be-1-max-characters-so', { max }) : t('transfer.envelope.the-description-must-be-1-max-characters', { max })));
    };
    text('author', AUTHOR_MAX_CHARS);
    text('description', DESCRIPTION_MAX_CHARS);
    if (raw.keywords !== undefined) {
      if (kind !== 'icon' && kind !== 'image') itemNotes.push(note('dropped_key', i, 'keywords', t('transfer.envelope.only-icons-and-images-have-keywords-so')));
      else {
        const list = Array.isArray(raw.keywords) ? raw.keywords : [];
        const keep = list.filter((w): w is string => typeof w === 'string' && w.trim().length >= 1 && w.trim().length <= 32).map((w) => w.trim()).slice(0, 10);
        if (keep.length !== list.length || !Array.isArray(raw.keywords)) itemNotes.push(note('dropped_value', i, 'keywords', t('transfer.envelope.some-keywords-were-not-valid-at-most-10')));
        if (keep.length) item.keywords = keep;
      }
    }
    const r = readKind(kind, i, id, name, raw.data, images, found.source === 'svg', found.source === 'svg' ? css : undefined);
    if (!r.ok) {
      notes.push(...itemNotes, ...r.notes);
      return;
    }
    item.data = r.data as never;
    ids.add(id);
    items.push(item);
    notes.push(...itemNotes, ...r.notes);
  });
  return { items, notes };
}

/** Sequence steps naming a custom animation that is not in the file (the target may have it). */
function missingStepRefs(items: TransferItem[]): TransferNote[] {
  const have = new Set(items.map((it) => it.id));
  const out: TransferNote[] = [];
  items.forEach((it, i) => {
    const steps = (it.data as { steps?: { animation: string }[] }).steps;
    steps?.forEach((s, n) => {
      if (s.animation.startsWith(CUSTOM_PREFIX) && !have.has(s.animation.slice(CUSTOM_PREFIX.length))) {
        out.push(note('missing_step_ref', i, `data.steps[${n}].animation`, t('transfer.envelope.step-n-plays-name-which-is-not-in-this', { n: n + 1, name: s.animation })));
      }
    });
  });
  return out;
}

/** Steps 1-5 of "Safe parsing" plus per-kind validation. Pure and synchronous. */
export function parseTransfer(text: string, opts: { accept: readonly TransferKind[]; fileName?: string; images?: ImageReader; css?: SvgCssResolve }): ParseResult {
  // images only (the Images tab): an svg text is one image, read by the image checker in file mode
  const imagesOnly = opts.accept.length === 1 && opts.accept[0] === 'image';
  if (typeof text === 'string' && imagesOnly && text.length > MAX_IMAGE_IMPORT_BYTES) return refuse('too_large', t('transfer.envelope.this-file-is-larger-than-8-mb-so-it-was'));
  // the file name decides: .svg holds SVG and .json holds JSON; pasted text has no name, so its content decides
  const name = opts.fileName ?? '';
  const svgName = /\.svg$/i.test(name);
  if (svgName ? /^\s*[{[]/.test(text) : /\.json$/i.test(name) && looksLikeSvg(text)) {
    const want = svgName ? 'SVG' : 'JSON';
    return refuse('not_a_preset_file', t('transfer.envelope.the-name-says-want-but-the-file-holds', { found: svgName ? 'JSON' : 'SVG', want }));
  }
  const asImage = imagesOnly && typeof text === 'string' && looksLikeSvg(text, opts.fileName);
  // over 1 MB only a JSON text (an image envelope) or an svg image is looked at; safeParse decides the rest
  if (typeof text === 'string' && text.length > MAX_IMPORT_CHARS && !asImage && !/^\s*\{/.test(text)) return refuse('too_large', t('transfer.envelope.this-text-is-larger-than-1-mb-so-it-was'));
  const notes: TransferNote[] = [];
  let found: Detected | undefined;
  let marker: Raw | undefined;

  if (asImage) found = svgItem(text, opts.fileName, 'image');
  else if (!imagesOnly && typeof text === 'string' && looksLikeSvg(text, opts.fileName)) found = svgItem(text, opts.fileName);
  else {
    const p = safeParse(text);
    if (!p.ok) return refuse(p.refusal, p.message);
    if (isObj(p.value) && TRANSFER_MARKER_KEY in p.value) marker = p.value;
    else found = detectOther(p.value);
  }

  if (marker) {
    const fmt = formatOf(marker[TRANSFER_MARKER_KEY]);
    if (!fmt) return refuse('not_a_preset_file', t('transfer.envelope.this-is-not-a-magic-card-preset-file'));
    if (fmt.major > TRANSFER_MAJOR) return refuse('newer_format', t('transfer.envelope.this-file-needs-a-newer-magic-card', { major: fmt.major }));
    const kind = marker.kind;
    if (typeof kind !== 'string' || !(KINDS as readonly string[]).includes(kind)) {
      return refuse('unknown_kind', t('transfer.envelope.this-file-holds-kind-presets-which-this', { kind: String(kind) }));
    }
    const list = Array.isArray(marker.items) ? marker.items : isObj(marker.item) ? [marker.item] : undefined;
    if (!list) return refuse('not_a_preset_file', t('transfer.envelope.this-is-not-a-magic-card-preset-file'));
    for (const k of Object.keys(marker)) if (!HEADER_KEYS.includes(k)) notes.push(note('dropped_key', -1, k, t('transfer.envelope.key-is-not-a-preset-field-so-it-was-left', { key: k })));
    found = { kind: kind as TransferKind, source: 'envelope', items: list };
  }
  if (!found) return refuse('not_a_preset_file', t('transfer.envelope.this-is-not-a-magic-card-preset-file'));

  if (!opts.accept.includes(found.kind)) return refuse('wrong_kind', WHERE(found.kind));
  if (found.items.length > MAX_IMPORT_ITEMS) return refuse('too_many_items', t('transfer.envelope.this-file-holds-more-than-max-items-so', { max: MAX_IMPORT_ITEMS }));

  const built = buildItems(found, opts.images, opts.css);
  notes.push(...built.notes);
  if (!built.items.length) {
    const why = notes.filter((n) => n.code === 'invalid_item').slice(0, 3).map((n) => n.message).join(' ');
    return refuse('no_valid_items', `${t('transfer.envelope.nothing-in-this-file-could-be-imported')} ${why}`.trim());
  }
  if (found.kind === 'animation') notes.push(...missingStepRefs(built.items));
  return { ok: true, kind: found.kind, source: found.source as TransferSource, items: built.items, notes };
}

const plain = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/** Writing: always `items`, keys in contract order, no aliases, JSON with 2-space indent. */
export function serialiseTransfer<K extends TransferKind>(kind: K, items: TransferItem<K>[], format: TransferFormat): string {
  const out = {
    [TRANSFER_MARKER_KEY]: TRANSFER_FORMAT,
    kind,
    generator: `Magic Card ${VERSION}`,
    items: items.map((it) => {
      const data: unknown = kind === 'animation' ? omitIdName(it.data as unknown as Raw) : it.data;
      return {
        id: it.id,
        name: it.name,
        ...(it.author ? { author: it.author } : {}),
        ...(it.description ? { description: it.description } : {}),
        ...(it.keywords?.length ? { keywords: it.keywords } : {}),
        data,
      };
    }),
  };
  return format === 'json' ? JSON.stringify(out, null, 2) : toYaml(plain(out));
}

function omitIdName(d: Raw): Raw {
  const { id: _i, name: _n, ...rest } = d;
  void _i;
  void _n;
  return rest;
}

/** "Copy as HA theme": `<name>:` and the ThemeDoc as YAML, nothing else. */
export function haThemeYaml(name: string, doc: ThemeDoc): string {
  return toYaml(plain({ [name]: doc }));
}

/**
 * Ids after the clash choice; sequence steps follow renamed animation ids. `taken` is what the import lands in (the
 * clash the user chooses about). Optional: `reserved` ids another library holds (renamed whatever the choice, so a
 * card copy never shares an id with a saved item) and `takenName` (a name the target already shows gets a number).
 */
export function resolveClashes<K extends TransferKind>(
  items: TransferItem<K>[],
  taken: (id: string) => boolean,
  choice: ClashChoice,
  opts: { reserved?: (id: string) => boolean; takenName?: (name: string) => boolean } = {},
): TransferItem<K>[] {
  const used = new Set<string>();
  const names = new Set<string>();
  const map = new Map<string, string>();
  const reserved = opts.reserved ?? (() => false);
  for (const it of items) {
    const keep = choice === 'replace' && taken(it.id);
    const to = keep ? it.id : uniqueId(it.id, (x) => taken(x) || reserved(x) || used.has(x));
    used.add(to);
    map.set(it.id, to);
  }
  return items.map((it) => {
    const next: TransferItem<K> = { ...it, id: map.get(it.id)! };
    // a replaced item keeps its name; every other one must not repeat a name the target or this file already shows
    if (opts.takenName && !(choice === 'replace' && taken(it.id))) {
      next.name = uniqueId(it.name, (n) => opts.takenName!(n) || names.has(n), ' ');
      names.add(next.name);
    }
    const steps = (it.data as { steps?: { animation: string }[] }).steps;
    if (steps) {
      const fixed = steps.map((s) => {
        const ref = s.animation.startsWith(CUSTOM_PREFIX) ? s.animation.slice(CUSTOM_PREFIX.length) : undefined;
        return ref && map.has(ref) ? { ...s, animation: CUSTOM_PREFIX + map.get(ref) } : s;
      });
      next.data = { ...it.data, steps: fixed };
    }
    return next;
  });
}

export { HOST_KINDS, TRANSFER_CONTRACT_VERSION };
