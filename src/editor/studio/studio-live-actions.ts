/** Marks the stand-in for a navigation action in the live card (see blockNavigation). */
export const BLOCKED_KEY = '__mc_studio_blocked';

const NAVIGATION = new Set(['navigate', 'url']);
const SKIP_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const MAX_DEPTH = 40;

function walk(value: unknown, depth: number): unknown {
  if (depth > MAX_DEPTH || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    let out: unknown[] | undefined;
    value.forEach((item, i) => {
      const next = walk(item, depth + 1);
      if (next !== item) {
        out ??= value.slice();
        out[i] = next;
      }
    });
    return out ?? value;
  }
  const obj = value as Record<string, unknown>;
  if (typeof obj.action === 'string' && NAVIGATION.has(obj.action)) {
    return { action: 'fire-dom-event', data: { [BLOCKED_KEY]: obj.action } };
  }
  let out: Record<string, unknown> | undefined;
  for (const key of Object.keys(obj)) {
    if (SKIP_KEYS.has(key)) continue;
    const next = walk(obj[key], depth + 1);
    if (next !== obj[key]) {
      out ??= { ...obj };
      out[key] = next;
    }
  }
  return out ?? obj;
}

/**
 * The card config for the live canvas: every `navigate` and `url` action becomes a `fire-dom-event`
 * that carries BLOCKED_KEY, so tapping it reaches the canvas as a notice instead of moving the browser
 * away from the editor (unsaved edits would be lost). The same object comes back when nothing changed.
 */
export function blockNavigation<T>(config: T): T {
  return walk(config, 0) as T;
}

/** An action request from an embedded HA card (`hass-action` detail) that would navigate. */
export function isNavigationRequest(detail: unknown): boolean {
  const d = detail as { action?: unknown; config?: Record<string, { action?: unknown } | undefined> } | undefined;
  if (!d || typeof d.action !== 'string' || !d.config) return false;
  const act = d.config[`${d.action}_action`]?.action;
  return typeof act === 'string' && NAVIGATION.has(act);
}

function findDeep(root: ParentNode, tag: string): Element | null {
  const hit = root.querySelector(tag);
  if (hit) return hit;
  for (const el of root.querySelectorAll('*')) {
    const shadow = (el as HTMLElement).shadowRoot;
    const found = shadow && findDeep(shadow, tag);
    if (found) return found;
  }
  return null;
}

/**
 * Re-dispatches an event the editor contains to where the dashboard would have received it: from the
 * dashboard view when HA has one (its listeners sit on `<home-assistant>`, window and above), else from
 * `<home-assistant>`, else the document.
 */
export function forwardToDashboard(type: string, detail: unknown): void {
  const ha = document.querySelector('home-assistant');
  const target: EventTarget = (ha && findDeep(ha.shadowRoot ?? ha, 'hui-view')) || ha || document;
  target.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
}
