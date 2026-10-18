import { toYaml } from '../utils/yaml-utils';
import { CUSTOM_PREFIX } from '../anim-studio/model';
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
  ParseResult,
  TransferFormat,
  TransferItem,
  TransferKind,
  TransferNote,
  TransferRefusal,
  TransferSource,
} from '../contracts/preset-transfer';
import type { ThemeDoc } from '../contracts/theme-editor';
import { VERSION } from '../version';
import { detectOther, looksLikeSvg, svgItem } from './detect';
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

const KINDS: readonly TransferKind[] = ['animation', 'theme', 'shape', 'icon'];
const ITEM_KEYS = ['id', 'name', 'author', 'description', 'keywords', 'data'];
const HEADER_KEYS = [TRANSFER_MARKER_KEY, 'kind', 'generator', 'items', 'item'];

const WHERE = (kind: TransferKind): string =>
  kind === 'animation'
    ? t('Animation files are imported in the card editor (My animations) or the animation studio.')
    : kind === 'theme'
      ? t('Theme files are imported in Magic Card Utils > Themes.')
      : kind === 'shape'
        ? t('Shape files are imported in the card editor (My shapes) or the shape editor.')
        : t('Icon files are imported in the card editor (My icons) or the SVG editor.');

const refuse = (refusal: TransferRefusal, message: string): ParseResult => ({ ok: false, refusal, message });

/** Reads "1.0", 1 (YAML turns 1.0 into a number) or "1.2". */
function formatOf(v: unknown): { major: number; minor: number } | undefined {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(String(v).trim());
  return m ? { major: +m[1], minor: +(m[2] ?? 0) } : undefined;
}

function readKind(kind: TransferKind, index: number, id: string, name: string, data: unknown): KindResult {
  switch (kind) {
    case 'animation':
      return readAnimation(index, id, name, data);
    case 'theme':
      return readTheme(index, data);
    case 'shape':
      return readShape(index, data);
    default:
      return readIcon(index, data);
  }
}

function buildItems(found: Detected): { items: TransferItem[]; notes: TransferNote[] } {
  const { kind } = found;
  const items: TransferItem[] = [];
  const notes: TransferNote[] = [];
  const ids = new Set<string>();
  found.items.forEach((raw, i) => {
    if (!isObj(raw)) {
      notes.push(note('invalid_item', i, '', t('This entry is not an object.')));
      return;
    }
    const id = typeof raw.id === 'string' ? raw.id.trim() : '';
    if (!LIBRARY_ID_RE.test(id)) {
      notes.push(note('invalid_item', i, 'id', t('The id must be 1-64 lowercase letters, digits, - or _.')));
      return;
    }
    const name = typeof raw.name === 'string' ? raw.name.trim() : '';
    if (!name || name.length > 80) {
      notes.push(note('invalid_item', i, 'name', t('The name must be 1-80 characters.')));
      return;
    }
    if (ids.has(id)) {
      notes.push(note('invalid_item', i, 'id', t('The id "{id}" appears twice in this file; the first one was used.', { id })));
      return;
    }
    const itemNotes: TransferNote[] = [];
    for (const k of Object.keys(raw)) if (!ITEM_KEYS.includes(k)) itemNotes.push(note('dropped_key', i, k, t('"{key}" is not a preset field, so it was left out.', { key: k })));

    const item: TransferItem = { id, name, data: undefined as never };
    const text = (key: 'author' | 'description', max: number) => {
      const v = raw[key];
      if (v === undefined) return;
      if (kind === 'animation') {
        itemNotes.push(note('not_stored', i, key, key === 'author' ? t('Animations do not store an author, so it was not kept.') : t('Animations do not store a description, so it was not kept.')));
        return;
      }
      const val = typeof v === 'string' ? v.trim() : '';
      if (val && val.length <= max) item[key] = val;
      else itemNotes.push(note('dropped_value', i, key, key === 'author' ? t('The author must be 1-{max} characters, so it was left out.', { max }) : t('The description must be 1-{max} characters, so it was left out.', { max })));
    };
    text('author', AUTHOR_MAX_CHARS);
    text('description', DESCRIPTION_MAX_CHARS);
    if (raw.keywords !== undefined) {
      if (kind !== 'icon') itemNotes.push(note('dropped_key', i, 'keywords', t('Only icons have keywords, so they were left out.')));
      else {
        const list = Array.isArray(raw.keywords) ? raw.keywords : [];
        const keep = list.filter((w): w is string => typeof w === 'string' && w.trim().length >= 1 && w.trim().length <= 32).map((w) => w.trim()).slice(0, 10);
        if (keep.length !== list.length || !Array.isArray(raw.keywords)) itemNotes.push(note('dropped_value', i, 'keywords', t('Some keywords were not valid (at most 10 words of 1-32 characters), so they were left out.')));
        if (keep.length) item.keywords = keep;
      }
    }
    const r = readKind(kind, i, id, name, raw.data);
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
        out.push(note('missing_step_ref', i, `data.steps[${n}].animation`, t('Step {n} plays "{name}", which is not in this file. It works if you already have it.', { n: n + 1, name: s.animation })));
      }
    });
  });
  return out;
}

/** Steps 1-5 of "Safe parsing" plus per-kind validation. Pure and synchronous. */
export function parseTransfer(text: string, opts: { accept: readonly TransferKind[]; fileName?: string }): ParseResult {
  if (typeof text === 'string' && text.length > MAX_IMPORT_CHARS) return refuse('too_large', t('This text is larger than 1 MB, so it was not read.'));
  const notes: TransferNote[] = [];
  let found: Detected | undefined;
  let marker: Raw | undefined;

  if (typeof text === 'string' && looksLikeSvg(text, opts.fileName)) found = svgItem(text, opts.fileName);
  else {
    const p = safeParse(text);
    if (!p.ok) return refuse(p.refusal, p.message);
    if (isObj(p.value) && TRANSFER_MARKER_KEY in p.value) marker = p.value;
    else found = detectOther(p.value);
  }

  if (marker) {
    const fmt = formatOf(marker[TRANSFER_MARKER_KEY]);
    if (!fmt) return refuse('not_a_preset_file', t('This is not a Magic Card preset file.'));
    if (fmt.major > TRANSFER_MAJOR) return refuse('newer_format', t('This file needs a newer Magic Card (format {major}.x).', { major: fmt.major }));
    const kind = marker.kind;
    if (typeof kind !== 'string' || !(KINDS as readonly string[]).includes(kind)) {
      return refuse('unknown_kind', t('This file holds "{kind}" presets, which this version of Magic Card does not know.', { kind: String(kind) }));
    }
    const list = Array.isArray(marker.items) ? marker.items : isObj(marker.item) ? [marker.item] : undefined;
    if (!list) return refuse('not_a_preset_file', t('This is not a Magic Card preset file.'));
    for (const k of Object.keys(marker)) if (!HEADER_KEYS.includes(k)) notes.push(note('dropped_key', -1, k, t('"{key}" is not a preset field, so it was left out.', { key: k })));
    found = { kind: kind as TransferKind, source: 'envelope', items: list };
  }
  if (!found) return refuse('not_a_preset_file', t('This is not a Magic Card preset file.'));

  if (!opts.accept.includes(found.kind)) return refuse('wrong_kind', WHERE(found.kind));
  if (found.items.length > MAX_IMPORT_ITEMS) return refuse('too_many_items', t('This file holds more than {max} items, so it was not read.', { max: MAX_IMPORT_ITEMS }));

  const built = buildItems(found);
  notes.push(...built.notes);
  if (!built.items.length) {
    const why = notes.filter((n) => n.code === 'invalid_item').slice(0, 3).map((n) => n.message).join(' ');
    return refuse('no_valid_items', `${t('Nothing in this file could be imported.')} ${why}`.trim());
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

/** Ids after the clash choice; sequence steps follow renamed animation ids. */
export function resolveClashes<K extends TransferKind>(items: TransferItem<K>[], taken: (id: string) => boolean, choice: ClashChoice): TransferItem<K>[] {
  if (choice === 'replace') return items;
  const used = new Set<string>();
  const map = new Map<string, string>();
  for (const it of items) {
    const to = uniqueId(it.id, (x) => taken(x) || used.has(x));
    used.add(to);
    map.set(it.id, to);
  }
  return items.map((it) => {
    const next: TransferItem<K> = { ...it, id: map.get(it.id)! };
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
