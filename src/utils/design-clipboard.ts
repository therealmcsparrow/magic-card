import type { AnimationConfig, ConditionalDesign, DesignConfig } from '../types';
import { animationsUpdate, readAnimations } from './animation';
import { deepClone } from './deep-merge';
import { generateId } from './id-generator';
import { toYaml } from './yaml-utils';

/**
 * Copy / paste of a whole design (module, row or column) between cards and dialogs: the editor
 * clipboard lives in localStorage; a copy also goes to the system clipboard as YAML.
 */
export const DESIGN_CLIPBOARD_KEY = 'magic-card:design-clipboard';

export type PasteMode = 'replace' | 'merge';

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** A deep copy without editor bookkeeping (not_synced, `_` markers) or empty values. */
function clean(design: DesignConfig | undefined): DesignConfig {
  const out = deepClone((design || {}) as Record<string, unknown>);
  for (const k of Object.keys(out)) {
    if (k === 'not_synced' || k.startsWith('_') || out[k] === undefined || out[k] === '') delete out[k];
  }
  return out as DesignConfig;
}

/** Copy: store the design (editor clipboard + system clipboard as YAML); returns what was stored. */
export function copyDesign(design: DesignConfig | undefined): DesignConfig {
  const copy = clean(design);
  try {
    localStorage.setItem(DESIGN_CLIPBOARD_KEY, JSON.stringify(copy));
  } catch {
    // storage full / disabled: the system clipboard below still has it
  }
  try {
    navigator.clipboard?.writeText(toYaml(copy))?.catch(() => undefined);
  } catch {
    // no clipboard permission: the editor clipboard is enough
  }
  return copy;
}

/** The copied design, or undefined when nothing (valid) was copied. */
export function readDesignClipboard(): DesignConfig | undefined {
  try {
    const raw = localStorage.getItem(DESIGN_CLIPBOARD_KEY);
    if (!raw) return undefined;
    const v = JSON.parse(raw);
    return isObject(v) ? (v as DesignConfig) : undefined;
  } catch {
    return undefined;
  }
}

const freshAnimations = (list: AnimationConfig[]): AnimationConfig[] => list.map((a) => ({ ...a, id: generateId('anim') }));

const freshRules = (rules: ConditionalDesign[] | undefined): ConditionalDesign[] =>
  (rules || []).map((r) => ({
    ...r,
    id: generateId('rule'),
    conditions: (r.conditions || []).map((c) => (c.id ? { ...c, id: generateId('cond') } : c)),
  }));

/**
 * The design after a paste. Replace: a deep copy of the clipboard. Merge: the clipboard's keys over
 * the current ones, its animations and conditional rules appended. Pasted animation, rule and
 * condition ids are new, so a design pasted twice never shares ids.
 */
export function pastedDesign(current: DesignConfig | undefined, clip: DesignConfig, mode: PasteMode): DesignConfig {
  const src = clean(clip);
  const pastedAnims = freshAnimations(readAnimations(src));
  const pastedRules = freshRules(src.conditional);
  const base = mode === 'replace' ? {} : clean(current);
  const out = { ...base, ...src } as Record<string, unknown>;

  const anims = mode === 'replace' ? pastedAnims : [...readAnimations(base), ...pastedAnims];
  for (const [k, v] of Object.entries(animationsUpdate(anims))) {
    if (v === undefined) delete out[k];
    else out[k] = v;
  }
  const rules = mode === 'replace' ? pastedRules : [...(base.conditional || []), ...pastedRules];
  if (rules.length) out.conditional = rules;
  else delete out.conditional;
  return out as DesignConfig;
}

/** onChange updates turning `current` into `next`: every key of next, removed keys as undefined. */
export function designUpdates(current: DesignConfig | undefined, next: DesignConfig): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(current || {})) if (!(k in next)) out[k] = undefined;
  return Object.assign(out, next);
}
