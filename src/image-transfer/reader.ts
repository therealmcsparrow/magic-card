import { BINDING_COLOUR_RE, IMAGE_MAX_BYTES } from '../contracts/mcu-library-images';
import type { BindingRule, ImageBinding } from '../contracts/mcu-library-images';
import type { ImageData, ImageKindResult, ImageTransferKit, TransferNote } from '../contracts/preset-transfer';
import { MAX_BINDING_RULES, MAX_IMAGE_BINDINGS } from '../contracts/svg-image';
import type { SvgImageApi } from '../contracts/svg-image';
import { t } from './i18n';

type Raw = Record<string, unknown>;

const DATA_KEYS = ['svg', 'view_box', 'bindings'];
const SETS: readonly string[] = ['fill', 'stroke', 'opacity', 'visible'];
const ENTITY_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;
const TEXT_MAX = 255;

const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.length >= 1 && v.length <= TEXT_MAX;
const sizeOf = (v: unknown): number => new TextEncoder().encode(typeof v === 'string' ? v : JSON.stringify(v)).length;

/** One connection with only the fields it may hold, or undefined when it cannot be kept. */
function bindingOf(raw: unknown, ids: ReadonlySet<string>): ImageBinding | undefined {
  if (!isObj(raw)) return undefined;
  const { target, entity, set, rules, attribute } = raw;
  const fits = (v: unknown): boolean => (set === 'visible' ? typeof v === 'boolean' : set === 'opacity' ? num(v) && v >= 0 && v <= 100 : typeof v === 'string' && BINDING_COLOUR_RE.test(v));
  if (!text(target) || !ids.has(target) || !text(entity) || !ENTITY_RE.test(entity) || !SETS.includes(set as string) || !Array.isArray(rules) || rules.length > MAX_BINDING_RULES) return undefined;
  if ((attribute !== undefined && !text(attribute)) || (raw.default !== undefined && !fits(raw.default))) return undefined;
  const kept: BindingRule[] = [];
  for (const r of rules) {
    if (!isObj(r) || !fits(r.value) || (r.state !== undefined && !text(r.state)) || [r.above, r.below].some((v) => v !== undefined && !num(v))) return undefined;
    if (r.state === undefined && r.above === undefined && r.below === undefined) return undefined;
    kept.push(Object.fromEntries(['state', 'above', 'below', 'value'].filter((k) => r[k] !== undefined).map((k) => [k, r[k]])) as unknown as BindingRule);
  }
  return Object.fromEntries(Object.entries({ target, entity, attribute, set, rules: kept, default: raw.default }).filter(([, v]) => v !== undefined)) as unknown as ImageBinding;
}

function bindingsOf(kit: ImageTransferKit, index: number, raw: unknown, ids: ReadonlySet<string>, notes: TransferNote[]): ImageBinding[] {
  const out: ImageBinding[] = [];
  const seen = new Set<string>();
  const list = Array.isArray(raw) ? raw : [undefined];
  // every entry is looked at once; only the first few left-out entries get a note of their own, the rest are counted
  let named = 0;
  let unnamed = 0;
  let over = false;
  for (let i = 0; i < list.length; i++) {
    const b = bindingOf(list[i], ids);
    if (b && !seen.has(`${b.target} ${b.set}`)) {
      if (out.length >= MAX_IMAGE_BINDINGS) {
        over = true;
        continue;
      }
      seen.add(`${b.target} ${b.set}`);
      out.push(b);
    } else if (named < MAX_IMAGE_BINDINGS) {
      named++;
      notes.push(kit.note('dropped_value', index, `data.bindings[${i}]`, t('Connection {n} is not valid, so it was left out.', { n: i + 1 })));
    } else unnamed++;
  }
  if (unnamed) notes.push(kit.note('dropped_value', index, 'data.bindings', t('{n, plural, one {# more connection is not valid, so it was left out.} other {# more connections are not valid, so they were left out.}}', { n: unnamed })));
  if (over) notes.push(kit.note('over_cap', index, 'data.bindings', t('Only the first {max} connections were kept.', { max: MAX_IMAGE_BINDINGS })));
  return out;
}

/** An image item: the drawing is sanitised by the svg-image api (what it removes is listed), connections are checked. */
export function readImage(api: Pick<SvgImageApi, 'sanitizeImage'>, kit: ImageTransferKit, index: number, data: unknown): ImageKindResult {
  const bad = (message: string): ImageKindResult => ({ ok: false, notes: [kit.note('invalid_item', index, 'data.svg', message)] });
  if (!isObj(data) || typeof data.svg !== 'string') return bad(t('The image could not be read.'));
  const notes: TransferNote[] = [];
  for (const k of Object.keys(data)) if (!DATA_KEYS.includes(k)) notes.push(kit.droppedKey(index, `data.${k}`));

  const s = api.sanitizeImage(data.svg);
  if (s.error || !s.markup) return bad(s.error === 'too_large' ? t('The image is larger than {kb} KB.', { kb: IMAGE_MAX_BYTES / 1024 }) : s.error === 'unsafe_markup' ? t('The image holds markup that is not allowed.') : t('The image could not be read.'));
  const gone = new Map<string, number>();
  for (const x of s.stripped) gone.set(x, (gone.get(x) ?? 0) + 1);
  for (const [name, count] of gone) {
    const [el, attr] = name.split('@');
    notes.push(kit.removedNote(index, count, attr ? kit.attributeWhat(attr) : kit.elementWhat(el)));
  }

  const out: ImageData = { svg: s.markup, view_box: s.viewBox };
  if (data.bindings !== undefined) {
    const list = bindingsOf(kit, index, data.bindings, new Set(s.ids), notes);
    if (list.length) out.bindings = list;
  }
  if (sizeOf(out.svg) + (out.bindings ? sizeOf(out.bindings) : 0) > IMAGE_MAX_BYTES) return bad(t('The image is larger than {kb} KB.', { kb: IMAGE_MAX_BYTES / 1024 }));
  return { ok: true, data: out, notes };
}
