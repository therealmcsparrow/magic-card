import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { CatalogueGroupId } from '../contracts/theme-catalogue';
import { CATALOGUE_GROUPS } from './catalogue';

/*
 * Real cards for the preview, and the "Preview not available" notice of a card group.
 *
 * Built-in cards (tile, entities, button) and Magic Card come from HA's card helpers, the way a
 * dashboard creates them. Another project's card is only created when its element is defined; the
 * user can ask the editor to load it from the dashboard resources (lovelace/resources) with one
 * button. Nothing here writes a CSS variable: the preview stage scopes those.
 */

export const PREVIEW_GROUP_TAG = 'mcte-group-preview';

type Hass = {
  states?: Record<string, { state: string }>;
  callWS?: <T>(msg: Record<string, unknown>) => Promise<T>;
} & Record<string, unknown>;

type CardHelpers = { createCardElement: (config: Record<string, unknown>) => HTMLElement | Promise<HTMLElement> };

/** Raised on `previewCardsEvents` ('change') when a card element became available. */
export const previewCardsEvents = new EventTarget();

// ── card helpers ──

let helpersPromise: Promise<CardHelpers> | null = null;

/** HA's card helpers, loaded once; undefined outside Home Assistant (or before it exposes them). */
export function getCardHelpers(): Promise<CardHelpers> | undefined {
  const load = (window as unknown as { loadCardHelpers?: () => Promise<CardHelpers> }).loadCardHelpers;
  if (typeof load !== 'function') return undefined;
  helpersPromise ??= Promise.resolve(load()).catch((err: unknown) => {
    helpersPromise = null; // try again next time
    throw err;
  });
  return helpersPromise;
}

/** Test hook: forget the cached helpers. */
export function resetCardHelpers(): void {
  helpersPromise = null;
}

// ── samples ──

export type SampleId = 'tile-on' | 'tile-off' | 'entities' | 'magic-card' | 'mushroom' | 'bubble-card' | 'button-card';

/** Third-party samples, by sample id: the element that must be defined and the group it belongs to. */
export const THIRD_PARTY_SAMPLES: ReadonlyArray<{ id: SampleId; group: CatalogueGroupId; tag: string; name: string }> = [
  { id: 'mushroom', group: 'mushroom', tag: 'mushroom-entity-card', name: 'Mushroom' },
  { id: 'bubble-card', group: 'bubble-card', tag: 'bubble-card', name: 'Bubble Card' },
  { id: 'button-card', group: 'button-card', tag: 'button-card', name: 'button-card' },
];

export interface Picks {
  on?: string;
  off?: string;
  numeric?: string;
  all: string[];
}

const ONOFF_DOMAINS = ['light', 'switch', 'fan', 'input_boolean'];

/** Entities to draw the samples with: one that is on, one that is off, one with a number. */
export function pickEntities(hass: Hass | undefined): Picks {
  const states = hass?.states ?? {};
  const ids = Object.keys(states).sort();
  const picks: Picks = { all: [] };
  for (const id of ids) {
    const domain = id.split('.')[0];
    const st = states[id].state;
    if (ONOFF_DOMAINS.includes(domain)) {
      if (st === 'on' && !picks.on) picks.on = id;
      else if (st === 'off' && !picks.off) picks.off = id;
    } else if (domain === 'sensor' && !picks.numeric && st.trim() !== '' && Number.isFinite(Number(st))) {
      picks.numeric = id;
    }
  }
  picks.all = [picks.on, picks.off].filter((v): v is string => !!v);
  for (const id of ids) {
    if (picks.all.length >= 3) break;
    if (!picks.all.includes(id) && ONOFF_DOMAINS.includes(id.split('.')[0])) picks.all.push(id);
  }
  return picks;
}

/** The card config of a sample, or null when Home Assistant has no entity to draw it with. */
export function sampleConfig(id: SampleId, picks: Picks): Record<string, unknown> | null {
  const any = picks.on ?? picks.off ?? picks.all[0];
  switch (id) {
    case 'tile-on':
      return picks.on ?? any ? { type: 'tile', entity: picks.on ?? any } : null;
    case 'tile-off':
      return picks.off ?? any ? { type: 'tile', entity: picks.off ?? any } : null;
    case 'entities':
      return picks.all.length ? { type: 'entities', title: 'Entities', entities: picks.all } : null;
    case 'magic-card':
      return {
        type: 'custom:magic-card',
        rows: [
          {
            id: 'preview-row',
            layout: '1',
            columns: [
              {
                id: 'preview-col',
                modules: [
                  { id: 'preview-text', type: 'text', text: 'Magic Card' },
                  { id: 'preview-button', type: 'button', label: 'Button' },
                  { id: 'preview-bar', type: 'bar', min: 0, max: 100, ...(picks.numeric ? { entity: picks.numeric } : {}) },
                ],
              },
            ],
          },
        ],
      };
    case 'mushroom':
      return any ? { type: 'custom:mushroom-entity-card', entity: any } : null;
    case 'bubble-card':
      return any ? { type: 'custom:bubble-card', card_type: 'button', entity: any } : null;
    case 'button-card':
      return any ? { type: 'custom:button-card', entity: any } : null;
  }
}

/** Creates a sample element through the card helpers; rejects when they are missing or the card fails. */
export async function createSample(config: Record<string, unknown>, hass: unknown): Promise<HTMLElement> {
  const helpers = getCardHelpers();
  let el: HTMLElement;
  if (helpers) {
    el = await (await helpers).createCardElement(config);
  } else {
    const type = String(config.type ?? '');
    if (!type.startsWith('custom:')) throw new Error('Home Assistant card helpers are not available');
    el = document.createElement(type.slice('custom:'.length));
    (el as HTMLElement & { setConfig?: (c: unknown) => void }).setConfig?.(config);
  }
  (el as HTMLElement & { hass?: unknown }).hass = hass;
  return el;
}

// ── group availability ──

export type GroupPreview =
  | { state: 'available' }
  | { state: 'unavailable'; label: string; canLoad: boolean };

/**
 * Whether a catalogue group can be previewed right now. HA groups and groups without a preview
 * element always can. A `hui-` card comes from HA's card helpers, so it counts as available when
 * they exist. Any other group needs its element defined.
 */
export function groupPreview(id: CatalogueGroupId): GroupPreview {
  const group = CATALOGUE_GROUPS.find((g) => g.id === id);
  if (!group?.previewTag) return { state: 'available' };
  if (customElements.get(group.previewTag)) return { state: 'available' };
  if (group.previewTag.startsWith('hui-') && typeof (window as unknown as { loadCardHelpers?: unknown }).loadCardHelpers === 'function') {
    return { state: 'available' };
  }
  return { state: 'unavailable', label: group.label, canLoad: !!group.resourcePattern };
}

interface Resource {
  url: string;
  type: string;
}

/** A resource URL the editor may load: same-origin path or http(s). */
export function isLoadableUrl(url: string): boolean {
  return /^\/(?!\/)/.test(url) || /^https?:\/\//i.test(url);
}

const LOAD_TIMEOUT_MS = 8000;

/** Loads a card group's dashboard resource and waits until its preview element is defined. */
export async function loadGroupCard(hass: Hass | undefined, id: CatalogueGroupId): Promise<void> {
  const group = CATALOGUE_GROUPS.find((g) => g.id === id);
  if (!group?.previewTag || !group.resourcePattern) throw new Error('This card cannot be loaded for the preview.');
  if (customElements.get(group.previewTag)) return;
  if (!hass?.callWS) throw new Error('Home Assistant is not connected.');
  const resources = await hass.callWS<Resource[]>({ type: 'lovelace/resources' });
  const pattern = group.resourcePattern;
  const found = (resources ?? []).find((r) => typeof r.url === 'string' && pattern.test(r.url));
  if (!found) throw new Error(`${group.label} is not in the dashboard resources.`);
  if (!isLoadableUrl(found.url)) throw new Error(`${group.label} has a resource address the editor will not load.`);
  const tag = group.previewTag;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const defined = customElements.whenDefined(tag);
  const script = document.createElement('script');
  script.type = found.type === 'module' ? 'module' : 'text/javascript';
  const failed = new Promise<never>((_, reject) => {
    script.onerror = () => reject(new Error(`${group.label} could not be loaded.`));
    timer = setTimeout(() => reject(new Error(`${group.label} did not start in time.`)), LOAD_TIMEOUT_MS);
  });
  script.src = found.url;
  document.head.appendChild(script);
  try {
    await Promise.race([defined, failed]);
  } finally {
    clearTimeout(timer);
  }
  previewCardsEvents.dispatchEvent(new Event('change'));
}

// ── <mcte-group-preview> ──

type LoadState = 'idle' | 'loading' | 'error';

/**
 * Sits at the top of a card group in the variables pane. Draws nothing while the group can be
 * previewed. Otherwise it says "Preview not available" and, for cards that live in the dashboard
 * resources, offers "Load {card} for preview". The group's fields stay editable either way.
 * Properties: `hass`, `group` (CatalogueGroupId).
 */
export class McteGroupPreview extends LitElement {
  @property({ attribute: false }) hass: unknown;
  @property() group: CatalogueGroupId = 'other';
  @state() private _load: LoadState = 'idle';
  @state() private _error = '';
  @state() private _version = 0;
  @state() private _announce = '';

  private readonly _onChange = (): void => {
    this._version++;
  };

  connectedCallback(): void {
    super.connectedCallback();
    previewCardsEvents.addEventListener('change', this._onChange);
  }

  disconnectedCallback(): void {
    previewCardsEvents.removeEventListener('change', this._onChange);
    super.disconnectedCallback();
  }

  private async _loadCard(): Promise<void> {
    this._load = 'loading';
    this._error = '';
    try {
      await loadGroupCard(this.hass as Hass | undefined, this.group);
      this._load = 'idle';
      this._announce = `${CATALOGUE_GROUPS.find((g) => g.id === this.group)?.label ?? 'The card'} is loaded for the preview.`;
    } catch (err) {
      this._load = 'error';
      this._error = err instanceof Error ? err.message : String(err);
    }
  }

  protected render(): TemplateResult | typeof nothing {
    void this._version;
    const status = groupPreview(this.group);
    if (status.state === 'available') {
      return this._announce ? html`<p class="help" role="status">${this._announce}</p>` : nothing;
    }
    const busy = this._load === 'loading';
    return html`<div class="notice" part="notice">
      <p class="title">Preview not available</p>
      <p class="help">
        ${status.label} is not loaded in this editor, so the preview cannot show it. The variables below can still be edited
        and saved.
      </p>
      ${status.canLoad
        ? html`<button type="button" class="btn" aria-disabled=${busy ? 'true' : 'false'} @click=${() => !busy && this._loadCard()}>
            ${busy ? 'Loading...' : `Load ${status.label} for preview`}
          </button>`
        : nothing}
      <p class="status" role="status">${busy ? `Loading ${status.label}...` : ''}</p>
      ${this._load === 'error' ? html`<p class="error" role="alert">Could not load ${status.label}. ${this._error}</p>` : nothing}
    </div>`;
  }

  static styles = css`
    :host {
      display: block;
    }
    .notice {
      border: 1px dashed var(--divider-color, #c9ced6);
      border-radius: 8px;
      padding: 8px 12px;
      margin: 8px 0;
      color: var(--primary-text-color);
    }
    .title {
      margin: 0 0 4px;
      font-weight: 600;
    }
    .help {
      margin: 0 0 8px;
      color: var(--secondary-text-color);
      font-size: 0.875rem;
    }
    .btn {
      min-height: 44px;
      padding: 0 16px;
      border-radius: 8px;
      border: 1px solid var(--primary-color, #1a73e8);
      background: transparent;
      color: var(--primary-color, #1a73e8);
      font: inherit;
      cursor: pointer;
    }
    .btn[aria-disabled='true'] {
      opacity: 0.6;
      cursor: progress;
    }
    .btn:focus-visible {
      outline: 3px solid var(--primary-color, #1a73e8);
      outline-offset: 2px;
    }
    .status:empty {
      display: none;
    }
    .status {
      margin: 8px 0 0;
      font-size: 0.875rem;
    }
    .error {
      margin: 8px 0 0;
      color: var(--error-color, #b3261e);
      font-size: 0.875rem;
    }
  `;
}

export const PREVIEW_CARD_ELEMENTS: Array<[string, CustomElementConstructor]> = [[PREVIEW_GROUP_TAG, McteGroupPreview]];

for (const [tag, ctor] of PREVIEW_CARD_ELEMENTS) if (!customElements.get(tag)) customElements.define(tag, ctor);

declare global {
  interface HTMLElementTagNameMap {
    'mcte-group-preview': McteGroupPreview;
  }
}
