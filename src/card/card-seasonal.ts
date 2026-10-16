import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { HomeAssistant, MagicCardConfig, SeasonalSetting } from '../types';
import { nextMidnight, normalizeSeasonal, resolveSeasonal, ResolvedSeasonal, seasonalEntities, seasonalSettings } from '../utils/seasonal';
import { seededRandom } from '../utils/seasonal-scenes';
import { SEASONAL_PREVIEW_EVENT, seasonalPreviewDate } from '../utils/seasonal-preview';

export interface CardSeasonalOptions {
  /** The card's `seasonal` config (after the template merge). */
  config: () => SeasonalSetting | undefined;
  hass: () => HomeAssistant | undefined;
  /** The card is an editor's preview (studio canvas, HA card editor): the editor's preview date applies. */
  editorPreview: () => boolean;
  /** Nothing of the card is on screen (a closed pop-up): no timer. */
  idle: () => boolean;
}

/** Compare resolutions without object identity. */
const keyOf = (r: ResolvedSeasonal | undefined): string => (r ? JSON.stringify(r) : '');

/**
 * The card side of seasonal scenes (src/utils/seasonal.ts): resolves the scene for the render,
 * tells whether a hass update changed it (only the scene's own entities are looked at), re-renders
 * at local midnight while the scene depends on the date (auto) and follows the editor's preview
 * date. A card without `seasonal` has no timer and no listener.
 */
export class CardSeasonal implements ReactiveController {
  private _timer?: number;
  private _listening = false;
  private _connected = false;
  /** Resolution of the last render. */
  private _key = '';
  private readonly _onPreview = () => this._host.requestUpdate();

  constructor(
    private readonly _host: ReactiveControllerHost,
    private readonly _opts: CardSeasonalOptions,
  ) {
    _host.addController(this);
  }

  /** The date the scene is resolved for: the editor's preview date in an editor preview, else now. */
  now(): Date {
    return this._preview() ?? new Date();
  }

  private _preview(): Date | undefined {
    const preview = this._opts.editorPreview() ? seasonalPreviewDate() : undefined;
    return preview ? new Date(preview.getTime()) : undefined;
  }

  /** Resolve for now (the server zone's day when the profile uses it) or the preview date (as is). */
  private _resolve(cfg: SeasonalSetting, hass: HomeAssistant | undefined): ResolvedSeasonal | undefined {
    const preview = this._preview();
    return resolveSeasonal(cfg, preview ?? new Date(), hass, { localDay: !!preview });
  }

  /** The scene to render now (remembered, see changed()). */
  resolve(): ResolvedSeasonal | undefined {
    const cfg = this._opts.config();
    const r = cfg === undefined ? undefined : this._resolve(cfg, this._opts.hass());
    this._key = keyOf(r);
    return r;
  }

  /** A hass update changed the scene (one of its entities changed and the resolution differs). */
  changed(oldHass: HomeAssistant | undefined): boolean {
    const cfg = this._opts.config();
    const hass = this._opts.hass();
    if (cfg === undefined || !hass) return false;
    const ids = seasonalEntities(cfg);
    if (!ids.some((id) => oldHass?.states?.[id] !== hass.states?.[id])) return false;
    return keyOf(this._resolve(cfg, hass)) !== this._key;
  }

  /**
   * Layout seed of the card's layer: stable for the card, different between cards. Name, first row
   * and module id, plus a short hash of the card's entity ids (cards built from one template differ).
   */
  seed(config: MagicCardConfig): string {
    const first = config.rows?.[0];
    const base = [config.name ?? '', first?.id ?? '', first?.columns?.[0]?.modules?.[0]?.id ?? ''].join('|');
    const ids = entityIds(config);
    const tag = ids.length ? Math.floor(seededRandom(ids.join(','))() * 0x100000000).toString(36) : '';
    return [base, tag].filter((x) => x && x !== '||').join('|') || 'card';
  }

  /** Whether a timer is waiting for midnight (tests). */
  get timerPending(): boolean {
    return this._timer !== undefined;
  }

  hostConnected(): void {
    this._connected = true;
    this._sync();
  }

  hostDisconnected(): void {
    this._connected = false;
    this._sync();
  }

  hostUpdated(): void {
    this._sync();
  }

  private _sync(): void {
    const cfg = normalizeSeasonal(this._opts.config());
    const active = this._connected && !!cfg;
    if (active && !this._listening) window.addEventListener(SEASONAL_PREVIEW_EVENT, this._onPreview);
    else if (!active && this._listening) window.removeEventListener(SEASONAL_PREVIEW_EVENT, this._onPreview);
    this._listening = active;
    // only auto depends on the date (the holiday or season changes at midnight)
    const settings = cfg ? seasonalSettings(cfg) : [];
    const dated = active && !this._opts.idle() && settings.includes('auto');
    if (dated && this._timer === undefined) this._schedule();
    else if (!dated && this._timer !== undefined) {
      window.clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  private _schedule(): void {
    const now = new Date();
    // a moment past midnight (the server zone's when the profile uses it), so the new date is certain
    const ms = nextMidnight(now, this._opts.hass()).getTime() - now.getTime() + 500;
    this._timer = window.setTimeout(() => {
      this._timer = undefined;
      this._host.requestUpdate();
      this._sync();
    }, ms);
  }
}

/** Entity ids anywhere in the config (`entity`, `entity_id`, `*_entity` strings), in order, once each. */
function entityIds(config: unknown): string[] {
  const out: string[] = [];
  const seen = new Set<unknown>();
  const walk = (v: unknown, depth: number) => {
    if (!v || typeof v !== 'object' || seen.has(v) || depth > 12) return;
    seen.add(v);
    if (Array.isArray(v)) {
      for (const x of v) walk(x, depth + 1);
      return;
    }
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (typeof x === 'string' && (k === 'entity' || k === 'entity_id' || k.endsWith('_entity')) && /^\w+\.\w+/.test(x) && !out.includes(x)) out.push(x);
      else walk(x, depth + 1);
    }
  };
  walk(config, 0);
  return out;
}
