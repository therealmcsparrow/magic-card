// Values a control has set but Home Assistant has not reported back yet. Rapid changes are
// collected and sent once after a short pause; the control keeps showing what was set until the
// entity changes or a few seconds pass. Keyed per card + entity + attribute + control kind.
import { currentRenderContext } from '../services/render-context';

interface Entry {
  value: number;
  /** The entity's value when the change started; a different value means HA answered. */
  base: number | undefined;
  timer?: ReturnType<typeof setTimeout>;
  holdTimer?: ReturnType<typeof setTimeout>;
  sent: boolean;
  /** Card scope, entity and attribute (read by a control that sends another attribute with it). */
  scope: string;
  entityId: string;
  attribute: string;
  /** Order of the changes. */
  seq: number;
}

let seq = 0;

/** The current card render's scope ('' outside a card). */
export function pendingScope(): string {
  return currentRenderContext()?.instance ?? '';
}

/** Key of a control's pending value, built while rendering: card, entity, attribute and control kind. */
export function controlKey(entityId: string | undefined, attribute: string | undefined, kind: string): string {
  return JSON.stringify([pendingScope(), entityId ?? '', attribute ?? '', kind]);
}

/**
 * The newest value set (sent or not) for an entity attribute by any control of the card that HA
 * has not confirmed yet, e.g. the high end of a climate range while the low end is sent.
 */
export function pendingAttributeValue(scope: string, entityId: string, attribute: string): number | undefined {
  let best: Entry | undefined;
  for (const e of entries.values()) {
    if (e.scope === scope && e.entityId === entityId && e.attribute === attribute && (!best || e.seq > best.seq)) best = e;
  }
  return best?.value;
}

/** Pause after the last change before the service call goes out. */
export const SEND_DELAY_MS = 500;
/** How long a sent value is shown while HA has not reported a change. */
export const HOLD_MS = 5000;

const entries = new Map<string, Entry>();

/** The value set for `key` that HA has not confirmed yet (undefined when there is none). */
export function pendingValue(key: string, current: number | undefined): number | undefined {
  const e = entries.get(key);
  if (!e) return undefined;
  if (e.sent && current !== e.base) {
    if (e.holdTimer) clearTimeout(e.holdTimer);
    entries.delete(key);
    return undefined;
  }
  return e.value;
}

/**
 * Set `value` for `key`: shown at once (`onChange` asks for a render), sent through `send` after
 * SEND_DELAY_MS without further changes.
 */
export function setPendingValue(
  key: string,
  value: number,
  current: number | undefined,
  send: (value: number) => void,
  onChange?: () => void,
  delay = SEND_DELAY_MS,
): void {
  const prev = entries.get(key);
  if (prev?.timer) clearTimeout(prev.timer);
  if (prev?.holdTimer) clearTimeout(prev.holdTimer);
  // a change while the previous one is unconfirmed keeps the original baseline
  let parts: unknown = [];
  try {
    parts = JSON.parse(key);
  } catch {
    // a plain key (tests, outside controlKey)
  }
  const [scope, entityId, attribute] = Array.isArray(parts) ? parts.map(String) : ['', '', ''];
  const entry: Entry = { value, base: prev ? prev.base : current, sent: false, scope: scope ?? '', entityId: entityId ?? '', attribute: attribute ?? '', seq: ++seq };
  entry.timer = setTimeout(() => {
    entry.timer = undefined;
    entry.sent = true;
    send(entry.value);
    entry.holdTimer = setTimeout(() => {
      if (entries.get(key) === entry) entries.delete(key);
      onChange?.();
    }, HOLD_MS);
  }, delay);
  entries.set(key, entry);
  onChange?.();
}

/** Forget the pending value of `key` (a failed call: the control shows the entity's value again). */
export function clearPendingValue(key: string): void {
  const e = entries.get(key);
  if (!e) return;
  if (e.timer) clearTimeout(e.timer);
  if (e.holdTimer) clearTimeout(e.holdTimer);
  entries.delete(key);
}

/** Tests: forget every pending value. */
export function clearPendingValues(): void {
  for (const e of entries.values()) {
    if (e.timer) clearTimeout(e.timer);
    if (e.holdTimer) clearTimeout(e.holdTimer);
  }
  entries.clear();
}
