import type { CardModule } from '../../types';
import { ModuleRegistry } from '../../modules/module-registry';
import { toYaml } from '../../utils/yaml-utils';
import { childSlots } from '../../utils/module-path';
import { CUSTOM_PREFIX, customRefId, isCustomRef } from '../../anim-studio/model';
import { animationDocList, customAnimationIds } from '../../utils/custom-animations';

// Copy / paste of a whole module (with layout children) through localStorage and the system clipboard as YAML.
export const MODULE_CLIPBOARD_KEY = 'magic-card:module-clipboard';

type Doc = Record<string, unknown>;

/** What a paste gets: the module and the inline documents it uses. */
export interface ModuleClip {
  module: CardModule;
  docs: Doc[];
}

/** Keys never copied: editor bookkeeping and prototype-changing names. */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * A deep copy without editor bookkeeping: `not_synced` and `_` keys at every level, undefined values,
 * and `__proto__` / `constructor` / `prototype` keys. Used for Copy module, paste and Copy YAML.
 */
export function cleanItem<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => cleanItem(v)) as unknown as T;
  if (!value || typeof value !== 'object') return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === 'not_synced' || k.startsWith('_') || v === undefined || UNSAFE_KEYS.has(k)) continue;
    out[k] = cleanItem(v);
  }
  return out as T;
}

/**
 * A module the editor can paste: a plain object of a known type that passes that module's own
 * checks (validate), and so do all its layout children.
 */
export function isPasteableModule(mod: unknown, depth = 0): mod is CardModule {
  if (!mod || typeof mod !== 'object' || Array.isArray(mod) || depth > 32) return false;
  const m = mod as CardModule;
  const impl = typeof m.type === 'string' ? ModuleRegistry.get(m.type) : undefined;
  if (!impl) return false;
  try {
    if (impl.validate(m).length) return false;
  } catch {
    return false;
  }
  return (childSlots(m) ?? []).every((slot) => slot.every((child) => isPasteableModule(child, depth + 1)));
}

/**
 * The inline documents (from `pool`, by id) the value references with `custom:<id>`, and the ones
 * those reference in their sequence steps. Ids not in the pool (the animation library's) are left out.
 */
export function referencedDocs(value: unknown, pool: Map<string, Doc>): Doc[] {
  const out = new Map<string, Doc>();
  const queue = customAnimationIds(value);
  while (queue.length) {
    const id = queue.shift()!;
    const doc = pool.get(id);
    if (!doc || out.has(id)) continue;
    out.set(id, doc);
    const steps = (doc as { steps?: Array<{ animation?: unknown }> }).steps;
    for (const s of Array.isArray(steps) ? steps : []) {
      if (isCustomRef(s?.animation)) queue.push(customRefId(s.animation));
    }
  }
  return [...out.values()];
}

/** Id -> document of a card's own `custom_animations` over the template's (the card's own win). */
export function docPool(...sources: unknown[]): Map<string, Doc> {
  const pool = new Map<string, Doc>();
  for (const src of sources) for (const d of animationDocList(src)) if (typeof d.id === 'string') pool.set(d.id, d);
  return pool;
}

/** Store a module and the documents it uses on the editor clipboard (the module also as YAML); returns the stored module. */
export function copyModuleToClipboard(mod: CardModule, docs: Doc[] = []): CardModule {
  const copy = cleanItem(mod);
  try {
    localStorage.setItem(MODULE_CLIPBOARD_KEY, JSON.stringify({ module: copy, custom_animations: cleanItem(docs) }));
  } catch {
    // storage full / disabled: the system clipboard below still has it
  }
  try {
    navigator.clipboard?.writeText(toYaml(copy))?.catch(() => undefined);
  } catch {
    // no clipboard permission (plain http): the editor clipboard is enough
  }
  return copy;
}

/** The copied module with its documents, cleaned; undefined when nothing (pasteable) was copied. */
export function readModuleClip(): ModuleClip | undefined {
  try {
    const raw = localStorage.getItem(MODULE_CLIPBOARD_KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw) as Record<string, unknown>;
    if (!v || typeof v !== 'object') return undefined;
    // an entry from before the documents came along is the module itself
    const module = cleanItem((v.module && typeof v.module === 'object' ? v.module : v) as CardModule);
    if (!isPasteableModule(module)) return undefined;
    const docs = animationDocList(cleanItem(v.module ? v.custom_animations : undefined)).filter((d) => typeof d.id === 'string');
    return { module, docs };
  } catch {
    return undefined;
  }
}

/** The copied module, or undefined when nothing (pasteable) was copied. */
export function readModuleClipboard(): CardModule | undefined {
  return readModuleClip()?.module;
}

const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/**
 * A new document id like `id`, not in `taken`: a quick id keeps its prefix ("quick-icon-1a2b3c" ->
 * "quick-icon-9z8y7x"); any other id gets a 6-character word appended ("my-button-9z8y7x").
 */
function freshDocId(id: string, taken: Set<string>): string {
  const base = (id.startsWith('quick-') ? id.replace(/-[a-z0-9]{6}$/, '') : id).slice(0, 56);
  for (;;) {
    const next = `${base}-${Math.floor(Math.random() * 36 ** 6).toString(36).padStart(6, '0')}`;
    if (!taken.has(next)) return next;
  }
}

/** Every `preset` / sequence `animation` that is `custom:<from>` becomes `custom:<to>` (mutates a copy). */
function rewriteRefs(value: unknown, rename: Map<string, string>): void {
  if (Array.isArray(value)) return value.forEach((v) => rewriteRefs(v, rename));
  if (!value || typeof value !== 'object') return;
  const rec = value as Record<string, unknown>;
  for (const [k, v] of Object.entries(rec)) {
    if ((k === 'preset' || k === 'animation') && isCustomRef(v)) {
      const to = rename.get(customRefId(v));
      if (to) rec[k] = `${CUSTOM_PREFIX}${to}`;
    } else if (v && typeof v === 'object') rewriteRefs(v, rename);
  }
}

/**
 * The documents a pasted module brings into the target card. A document the target already has
 * (its own or its template's) with the same content is not added again. A different document under
 * the same id: a catalogue copy (`cat-*`) uses the target's (same catalogue preset); any other id is
 * added under a new id and the module's (and the documents') references follow. Mutates `module`.
 */
export function pasteAnimations(module: CardModule, docs: Doc[], target: Map<string, Doc>, taken: Iterable<string>): Doc[] {
  const used = new Set([...taken, ...target.keys(), ...docs.map((d) => String(d.id))]);
  const rename = new Map<string, string>();
  const add: Doc[] = [];
  for (const doc of docs) {
    const id = String(doc.id);
    const have = target.get(id);
    if (have && (same(have, doc) || id.startsWith('cat-'))) continue;
    const copy = { ...doc };
    if (have) {
      copy.id = freshDocId(id, used);
      used.add(copy.id as string);
      rename.set(id, copy.id as string);
    }
    add.push(copy);
  }
  if (rename.size) {
    rewriteRefs(module, rename);
    rewriteRefs(add, rename);
  }
  return add;
}
