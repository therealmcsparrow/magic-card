import { sanitizeSvg } from '../../icons/svg-sanitize';
import { ICON_MAX_BYTES } from '../../contracts/mcu-library';
import type { IconData, TransferNote } from '../../contracts/preset-transfer';
import { t } from '../i18n';
import { compactBytes, isObj, note } from '../types';
import type { KindResult } from '../types';

/** The mcu-library path pattern. */
export const ICON_PATH_RE = /^[MmZzLlHhVvCcSsQqTtAa0-9eE.,+\- \n]*$/;
export const PATH_MISSING = (): string => t("Open it in the SVG editor and save to show it in Home Assistant's own cards.");

const IGNORED_ATTRS = /^(xmlns|xml:|version$|width$|height$|viewbox$|baseprofile$|enable-background$)/i;

function parseSvg(input: string): Element[] {
  if (typeof DOMParser === 'undefined') return [];
  const parser = new DOMParser();
  let doc: Document | undefined;
  try {
    const xml = parser.parseFromString(input, 'image/svg+xml');
    if (xml.documentElement?.localName === 'svg' && !xml.getElementsByTagName('parsererror').length) doc = xml;
  } catch {
    /* lenient parser below */
  }
  doc ??= parser.parseFromString(input, 'text/html');
  return [...doc.getElementsByTagName('*')];
}

/** What the sanitiser took out: element and attribute names present in the input but not in its result. */
export function svgRemovals(input: string, markup: string, index: number): TransferNote[] {
  const before = parseSvg(input);
  const after = parseSvg(markup);
  const keptEls = new Set(after.map((e) => e.localName.toLowerCase()));
  const keptAttrs = new Set(after.flatMap((e) => [...e.attributes].map((a) => a.name.toLowerCase())));
  const els = new Map<string, number>();
  const attrs = new Map<string, number>();
  for (const el of before) {
    const n = el.localName.toLowerCase();
    if (n !== 'svg' && !keptEls.has(n)) els.set(n, (els.get(n) ?? 0) + 1);
    for (const a of el.attributes) {
      const an = a.name.toLowerCase();
      if (!IGNORED_ATTRS.test(an) && !keptAttrs.has(an)) attrs.set(an, (attrs.get(an) ?? 0) + 1);
    }
  }
  const notes: TransferNote[] = [];
  for (const [n, c] of els) {
    const what = n === 'script' ? t('a script') : n === 'use' ? t('a <use> reference') : `<${n}>`;
    notes.push(note('svg_removed', index, 'data.svg', t('{count, plural, one {Removed {what}.} other {Removed {what} ({count} times).}}', { count: c, what })));
  }
  for (const [n, c] of attrs) {
    const what = n.startsWith('on') ? t('the event handler {name}', { name: n }) : /(^|:)href$/.test(n) ? t('a link ({name})', { name: n }) : n === 'style' ? t('a style attribute') : t('the attribute {name}', { name: n });
    notes.push(note('svg_removed', index, 'data.svg', t('{count, plural, one {Removed {what}.} other {Removed {what} ({count} times).}}', { count: c, what })));
  }
  return notes;
}

/** Sanitise an icon's markup: the result and everything that was removed. */
export function cleanSvg(index: number, svg: string): { ok: true; markup: string; viewBox: string; notes: TransferNote[] } | { ok: false; notes: TransferNote[] } {
  // mc-f / mc-s are the sanitiser's own marks: strip them first so an exported icon re-imports unchanged
  const s = sanitizeSvg(svg.replace(/\bclass\s*=\s*(["'])([^"']*)\1/gi, (_m, q: string, v: string) => `class=${q}${v.split(/\s+/).filter((t) => t !== 'mc-f' && t !== 'mc-s').join(' ')}${q}`));
  if (s.error || !s.markup) return { ok: false, notes: [note('invalid_item', index, 'data.svg', s.error || t('The SVG could not be read.'))] };
  if (new TextEncoder().encode(s.markup).length > ICON_MAX_BYTES) {
    return { ok: false, notes: [note('invalid_item', index, 'data.svg', t('The icon is larger than {kb} KB.', { kb: ICON_MAX_BYTES / 1024 }))] };
  }
  return { ok: true, markup: s.markup, viewBox: s.viewBox, notes: svgRemovals(svg, s.markup, index) };
}

/** An icon item: svg sanitised (removals listed), path patterns and view box checked. */
export function readIcon(index: number, data: unknown): KindResult<IconData> {
  if (!isObj(data) || typeof data.svg !== 'string') return { ok: false, notes: [note('invalid_item', index, 'data.svg', t('The icon has no SVG.'))] };
  const c = cleanSvg(index, data.svg);
  if (!c.ok) return c;
  const notes = [...c.notes];
  const out: IconData = { svg: c.markup };

  const pathOf = (key: 'path' | 'secondary_path'): string | undefined => {
    const v = data[key];
    if (v === undefined) return undefined;
    if (typeof v === 'string' && ICON_PATH_RE.test(v) && v.length <= ICON_MAX_BYTES) return v;
    notes.push(note('dropped_value', index, `data.${key}`, t('"{key}" is not valid path data, so it was left out.', { key })));
    return undefined;
  };
  out.path = pathOf('path') ?? '';
  if (!out.path) notes.push(note('path_missing', index, 'data.path', PATH_MISSING()));
  const sec = pathOf('secondary_path');
  if (sec !== undefined) out.secondary_path = sec;

  const vb = typeof data.view_box === 'string' ? data.view_box.trim().split(/[\s,]+/).map(Number) : [];
  if (vb.length === 4 && vb.every(Number.isFinite)) out.view_box = vb.join(' ');
  else {
    if (data.view_box !== undefined) notes.push(note('dropped_value', index, 'data.view_box', t('The view box is not four numbers, so it was taken from the SVG.')));
    out.view_box = c.viewBox;
  }
  if (compactBytes(out) > 3 * ICON_MAX_BYTES) return { ok: false, notes: [note('invalid_item', index, 'data', t('The icon is too large.'))] };
  return { ok: true, data: out, notes };
}
