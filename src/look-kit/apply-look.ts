// applyLook: a parsed look plus a card config to a new config and the summary of what Keep changes (contract look-grammar 2.1.0).
// Replaces at the targets (card keys, per-module-type keys, design key by key); never changes its input. Pure TS, no DOM.

import {
  LOOK_CARD_KEYS,
  LOOK_MODULE_COMMON_KEYS,
  LOOK_MODULE_KEYS,
  LOOK_MODULE_TYPES,
  type ApplyLook,
  type LookApplyArea,
  type LookDoc,
  type LookModuleType,
} from '../contracts/look-grammar';
import { LOOK_KEY_TABLES } from './grammar';

type Plain = Record<string, unknown>;

const has = (o: object, k: string): boolean => Object.prototype.hasOwnProperty.call(o, k);
const isPlain = (v: unknown): v is Plain => typeof v === 'object' && v !== null && !Array.isArray(v);
const present = (o: Plain, k: string): boolean => has(o, k) && o[k] !== undefined;

/** Plain data copied so the result shares nothing mutable with the input. */
const copy = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(copy);
  if (!isPlain(v)) return v;
  const out: Plain = {};
  for (const k of Object.keys(v)) if (k !== '__proto__') out[k] = copy(v[k]);
  return out;
};

/** A written value with `id: 'anim-<n>'` on every animation entry, at any depth. */
const withAnimationIds = (v: unknown, key?: string): unknown => {
  if (Array.isArray(v)) {
    const numbered = key === 'animations' || key === 'tab_animations';
    return v.map((x, i) => {
      const c = withAnimationIds(x);
      if (numbered && isPlain(c)) c.id = 'anim-' + (i + 1);
      return c;
    });
  }
  if (!isPlain(v)) return v;
  const out: Plain = {};
  for (const k of Object.keys(v)) out[k] = withAnimationIds(v[k], k);
  return out;
};

const DESIGN_STYLE_KEYS = Object.keys(LOOK_KEY_TABLES.DesignConfig).filter((k) => (LOOK_KEY_TABLES.DesignConfig as Record<string, unknown>)[k] !== 'drop');
const typeKeys = (t: LookModuleType): readonly string[] => (LOOK_MODULE_KEYS as Partial<Record<LookModuleType, readonly string[]>>)[t] ?? [];
const sorted = (set: Set<string>): string[] => Array.from(set).sort();

/** Calls fn for every module of a list, nested ones (modules, tabs, row-module columns) included. */
const eachModule = (list: unknown, fn: (m: Plain) => void): void => {
  if (!Array.isArray(list)) return;
  for (const m of list) {
    if (!isPlain(m)) continue;
    fn(m);
    eachModule(m.modules, fn);
    for (const slot of [m.tabs, m.columns]) if (Array.isArray(slot)) for (const s of slot) if (isPlain(s)) eachModule(s.modules, fn);
  }
};

export const applyLook: ApplyLook = <C extends object>(config: C, look: LookDoc) => {
  const next = copy(config) as Plain;
  const areas: LookApplyArea[] = [];

  if (look.card) {
    const card = look.card;
    const set = new Set<string>();
    const cleared = new Set<string>();
    for (const k of LOOK_CARD_KEYS) {
      if (present(next, k)) cleared.add(k);
      delete next[k];
    }
    for (const k of Object.keys(card)) {
      if ((LOOK_CARD_KEYS as readonly string[]).indexOf(k) < 0) continue;
      next[k] = withAnimationIds(copy(card[k]));
      set.add(k);
      cleared.delete(k);
    }
    areas.push({ target: 'card', modules: 1, set: sorted(set), cleared: sorted(cleared) });
  }

  const targets = look.modules;
  if (targets) {
    const byType = new Map<LookModuleType, { modules: number; set: Set<string>; cleared: Set<string> }>();
    const writtenNames = (t: Plain | undefined, allowed: readonly string[], into: Set<string>): void => {
      if (!t) return;
      for (const k of Object.keys(t)) {
        if (allowed.indexOf(k) < 0) continue;
        if (k === 'design' && isPlain(t.design)) for (const d of Object.keys(t.design)) into.add('design.' + d);
        else if (k !== 'design') into.add(k);
      }
    };
    eachModule(rowsModules(next), (m) => {
      const t = typeof m.type === 'string' ? (m.type as LookModuleType) : undefined;
      if (!t || (LOOK_MODULE_TYPES as readonly string[]).indexOf(t) < 0) return;
      const star = targets['*'];
      const own = targets[t];
      if (!star && !own) return;
      const allowedOwn = [...LOOK_MODULE_COMMON_KEYS, ...typeKeys(t)];
      const removable: readonly string[] = own ? allowedOwn : LOOK_MODULE_COMMON_KEYS;
      let area = byType.get(t);
      if (!area) {
        area = { modules: 0, set: new Set(), cleared: new Set() };
        writtenNames(star, LOOK_MODULE_COMMON_KEYS, area.set);
        writtenNames(own, allowedOwn, area.set);
        byType.set(t, area);
      }
      area.modules++;

      const removed = new Set<string>();
      for (const k of removable) {
        if (k === 'design') continue;
        if (present(m, k)) removed.add(k);
        delete m[k];
      }
      const design: Plain = isPlain(m.design) ? m.design : {};
      for (const k of DESIGN_STYLE_KEYS) {
        if (present(design, k)) removed.add('design.' + k);
        delete design[k];
      }
      const sources: Array<[Plain | undefined, readonly string[]]> = [[star, LOOK_MODULE_COMMON_KEYS], [own, allowedOwn]];
      for (const [src, allowed] of sources) {
        if (!src) continue;
        for (const k of Object.keys(src)) {
          if (allowed.indexOf(k) < 0) continue;
          if (k === 'design') {
            if (isPlain(src.design)) for (const d of Object.keys(src.design)) design[d] = withAnimationIds(copy(src.design[d]), d);
          } else m[k] = withAnimationIds(copy(src[k]), k);
        }
      }
      if (Object.keys(design).length > 0) m.design = design;
      else delete m.design;
      removed.forEach((n) => {
        if (area && !area.set.has(n)) area.cleared.add(n);
      });
    });
    for (const t of LOOK_MODULE_TYPES) {
      const a = byType.get(t);
      if (a) areas.push({ target: t, modules: a.modules, set: sorted(a.set), cleared: sorted(a.cleared) });
    }
  }

  const count = areas.reduce((n, a) => n + a.set.length + a.cleared.length, 0);
  return { config: next as C, summary: { count, areas } };
};

/** The modules of every column of every row of a card config. */
const rowsModules = (cfg: Plain): unknown[] => {
  const out: unknown[] = [];
  if (Array.isArray(cfg.rows)) {
    for (const r of cfg.rows) {
      if (isPlain(r) && Array.isArray(r.columns)) for (const c of r.columns) if (isPlain(c) && Array.isArray(c.modules)) out.push(...c.modules);
    }
  }
  return out;
};
