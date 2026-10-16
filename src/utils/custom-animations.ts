import { CUSTOM_PREFIX, customRefId, isCustomRef, type AnimationDoc } from '../anim-studio/model';

/*
 * Card-editor helpers for animations from the library (`preset: custom:<id>`): the animation studio
 * link and the export that embeds the documents a card uses (`custom_animations`, the inline fallback
 * a card reads when the library lacks an id, so shared YAML keeps working on another install).
 */

/** The magic-card-utils sidebar panel (its `frontend_url_path`), which hosts the animation studio. */
export const ANIMATION_STUDIO_PATH = '/magic-card-utils';

/** The studio at one animation: `/magic-card-utils?animation=<id>`. */
export function animationStudioUrl(id: string): string {
  return `${ANIMATION_STUDIO_PATH}?animation=${encodeURIComponent(id)}`;
}

/** Whether the page is the magic-card-utils panel (its template editor mounts the card editor). */
export function inAnimationStudioPanel(path = typeof location !== 'undefined' ? location.pathname : ''): boolean {
  return path === ANIMATION_STUDIO_PATH || path.startsWith(`${ANIMATION_STUDIO_PATH}/`);
}

/**
 * Inside the panel: navigate in place the way HA does (history + `location-changed`), so the panel
 * switches to its Animations tab. Elsewhere the link's own `target="_blank"` opens a new tab.
 */
export function onAnimationStudioLink(e: MouseEvent, id: string): void {
  if (!inAnimationStudioPanel() || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  history.pushState(null, '', animationStudioUrl(id));
  window.dispatchEvent(new CustomEvent('location-changed', { detail: { replace: false } }));
}

/** Every `custom:<id>` a card config references (design animations at any level), in order. */
export function customAnimationIds(config: unknown): string[] {
  const out = new Set<string>();
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (!v || typeof v !== 'object') return;
    for (const [k, x] of Object.entries(v)) {
      if (k === 'custom_animations') continue;
      if (k === 'preset' && isCustomRef(x)) {
        const id = customRefId(x);
        if (id) out.add(id);
      } else if (x && typeof x === 'object') walk(x);
    }
  };
  walk(config);
  return [...out];
}

/**
 * A card's inline documents as a list (YAML may hold a list or an id-keyed map; a map entry without
 * an id takes its key).
 */
export function animationDocList(raw: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(raw)) return raw.filter((d): d is Record<string, unknown> => !!d && typeof d === 'object');
  if (raw && typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>)
      .filter(([, d]) => !!d && typeof d === 'object')
      .map(([id, d]) => ({ id, ...(d as Record<string, unknown>) }));
  }
  return [];
}

/**
 * The config with `custom_animations` holding every document it uses (and the custom steps of
 * those that are sequences): the library's current version, else the card's own inline copy.
 * `missing` lists ids found in neither. A config without custom references is returned as is.
 */
export function embedCustomAnimations<T extends object>(
  config: T,
  lookup: (id: string) => AnimationDoc | undefined,
): { config: T; embedded: string[]; missing: string[] } {
  const inline = new Map(animationDocList((config as { custom_animations?: unknown }).custom_animations).map((d) => [String(d.id), d]));
  const docs = new Map<string, unknown>();
  const missing: string[] = [];
  const queue = customAnimationIds(config);
  while (queue.length) {
    const id = queue.shift()!;
    if (docs.has(id) || missing.includes(id)) continue;
    const doc = lookup(id) ?? inline.get(id);
    if (!doc) {
      missing.push(id);
      continue;
    }
    docs.set(id, doc);
    const steps = (doc as { steps?: Array<{ animation?: unknown }> }).steps;
    for (const s of Array.isArray(steps) ? steps : []) {
      if (typeof s?.animation === 'string' && s.animation.startsWith(CUSTOM_PREFIX)) queue.push(customRefId(s.animation));
    }
  }
  if (!docs.size) return { config, embedded: [], missing };
  const embedded = [...docs.keys()];
  // inline documents the card does not use (any more) stay as they were
  for (const [id, d] of inline) if (!docs.has(id)) docs.set(id, d);
  return { config: { ...config, custom_animations: [...docs.values()] }, embedded, missing };
}
