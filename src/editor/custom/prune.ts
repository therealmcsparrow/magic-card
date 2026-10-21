import type { MagicCardConfig } from '../../types';
import { animationDocList, customAnimationIds } from '../../utils/custom-animations';
import { CUSTOM_PREFIX, customRefId } from '../../anim-studio/model';

/*
 * Kept copies of saved items (mcu-library 1.0.0 "Pruning"): an entry of the card's `custom_icons`
 * or `custom_shapes` goes only when no module uses it AND its id is in the loaded library (so it is a
 * copy of a saved item). Entries the library does not know are the card's own (hand-written YAML,
 * imports made without Magic Card Utils) and stay. A library that is not loaded or not installed
 * (`undefined`) prunes nothing. A template-linked card keeps all copies: the template's modules may
 * use them and the card editor does not see those.
 */

export interface KnownLibrary {
  /** Ids of the saved icons; undefined while the list is not loaded. */
  icons?: ReadonlySet<string>;
  shapes?: ReadonlySet<string>;
  /** The animation library once it answered (undefined: not loaded, nothing is pruned). */
  animations?: { has(id: string): boolean };
}

const MCU = /^mcu:([a-z0-9][a-z0-9_-]{0,63})$/;

/** The saved ids a card's modules use: `mcu:<id>` icons and `shape_options.ref` (copies excluded). */
export function usedLibraryIds(config: unknown): { icons: Set<string>; shapes: Set<string> } {
  const icons = new Set<string>();
  const shapes = new Set<string>();
  const walk = (node: unknown, key: string): void => {
    if (typeof node === 'string') {
      const m = MCU.exec(node);
      if (m) icons.add(m[1]);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const x of node) walk(x, key);
      return;
    }
    const o = node as Record<string, unknown>;
    if (key === 'shape_options' && typeof o.ref === 'string') shapes.add(o.ref);
    for (const [k, v] of Object.entries(o)) if (k !== 'custom_icons' && k !== 'custom_shapes') walk(v, k);
  };
  walk(config, '');
  return { icons, shapes };
}

/**
 * `custom_animations` without the unused copies of library animations: unused means no module plays
 * it and no step of a kept animation does (followed until nothing changes). Its form (list or map)
 * stays; the same object when nothing goes.
 */
function pruneAnimations(config: MagicCardConfig, lib: { has(id: string): boolean }): MagicCardConfig {
  const docs = animationDocList(config.custom_animations);
  if (!docs.length) return config;
  const keep = new Set(customAnimationIds(config));
  for (let grew = true; grew; ) {
    grew = false;
    for (const d of docs) {
      if (!keep.has(String(d.id))) continue;
      const steps = Array.isArray(d.steps) ? (d.steps as Array<{ animation?: unknown }>) : [];
      for (const s of steps) {
        const ref = typeof s?.animation === 'string' && s.animation.startsWith(CUSTOM_PREFIX) ? customRefId(s.animation) : '';
        if (ref && !keep.has(ref)) grew = !!keep.add(ref);
      }
    }
  }
  const gone = (d: Record<string, unknown>): boolean => !keep.has(String(d.id)) && lib.has(String(d.id));
  if (!docs.some(gone)) return config;
  const raw = config.custom_animations as unknown;
  const out = { ...config } as Record<string, unknown>;
  const rest = Array.isArray(raw)
    ? raw.filter((d) => !(d && typeof d === 'object' && gone(d as Record<string, unknown>)))
    : Object.fromEntries(Object.entries(raw as Record<string, unknown>).filter(([id, d]) => !(d && typeof d === 'object' && gone({ id, ...(d as object) }))));
  if (Object.keys(rest).length) out.custom_animations = rest;
  else delete out.custom_animations;
  return out as unknown as MagicCardConfig;
}

/** `config` without the unused library copies; the same object when nothing goes. */
export function pruneLibraryCopies(config: MagicCardConfig, known: KnownLibrary): MagicCardConfig {
  if (config.template) return config;
  if (known.animations) config = pruneAnimations(config, known.animations);
  const hasIcons = !!config.custom_icons && typeof config.custom_icons === 'object';
  const hasShapes = !!config.custom_shapes && typeof config.custom_shapes === 'object';
  if ((!hasIcons || !known.icons) && (!hasShapes || !known.shapes)) return config;
  const used = usedLibraryIds(config);
  const drop = (copies: Record<string, unknown>, lib: ReadonlySet<string>, inUse: Set<string>): Record<string, unknown> | undefined => {
    const keep = Object.entries(copies).filter(([id]) => inUse.has(id) || !lib.has(id));
    return keep.length === Object.keys(copies).length ? undefined : Object.fromEntries(keep);
  };
  let out = config;
  const icons = hasIcons && known.icons ? drop(config.custom_icons as Record<string, unknown>, known.icons, used.icons) : undefined;
  const shapes = hasShapes && known.shapes ? drop(config.custom_shapes as Record<string, unknown>, known.shapes, used.shapes) : undefined;
  if (icons) {
    out = { ...out };
    if (Object.keys(icons).length) out.custom_icons = icons as Record<string, string>;
    else delete out.custom_icons;
  }
  if (shapes) {
    out = { ...out };
    if (Object.keys(shapes).length) out.custom_shapes = shapes as MagicCardConfig['custom_shapes'];
    else delete out.custom_shapes;
  }
  return out;
}
