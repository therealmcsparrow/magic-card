import { t } from '../card/i18n';
import type { HomeAssistant } from '../types';

/* Home Assistant card helpers and small helpers shared by the camera and custom-card views (modules-extra) and the card editor. No module state, so each chunk that imports this file carries its own copy. */

export interface CardHelpers {
  createCardElement(config: Record<string, unknown>): HTMLElement;
}

export type ConfigurableElement = HTMLElement & {
  hass?: HomeAssistant;
  preview?: boolean;
  editMode?: boolean;
  setConfig?: (c: Record<string, unknown>) => void;
};

const WAIT_MS = 5000;

/**
 * HA's card helpers (window.loadCardHelpers); undefined outside Home Assistant. HA keeps the loaded helpers itself, so
 * asking again is cheap and a failed load is tried again on the next call.
 */
export function getCardHelpers(): Promise<CardHelpers> | undefined {
  const load = (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers;
  return typeof load === 'function' ? Promise.resolve(load()) : undefined;
}

export function whenDefined(tag: string): Promise<unknown> {
  if (customElements.get(tag)) return Promise.resolve();
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    customElements.whenDefined(tag),
    new Promise<void>((_, reject) => {
      timer = setTimeout(() => reject(new Error(t('card.card-helpers.timeout-waiting-for-tag', { tag }))), WAIT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

/** JSON with object keys sorted: the same config in another key order gives the same string. */
export function stableJson(value: unknown): string {
  const sort = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === 'object') {
      return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sort((v as Record<string, unknown>)[k])]));
    }
    return v;
  };
  return JSON.stringify(sort(value)) ?? '';
}

export const fullConfig = (cardType: string, cardConfig: Record<string, unknown> | undefined) => ({ ...(cardConfig || {}), type: cardType });
