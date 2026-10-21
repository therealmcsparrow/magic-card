import type { ReactiveControllerHost } from 'lit';
import type { HomeAssistant, MagicCardConfig } from '../types';
import type { ResolvedSeasonal } from '../utils/seasonal';
import type { CardSeasonal, CardSeasonalOptions } from './card-seasonal';
import type { SeasonalApi } from './seasonal-chunk';
import { lazyChunks, loadSeasonal } from '../utils/lazy-chunks';

/*
 * The entry's side of the seasonal chunk. Scene resolution, the midnight timer, the particle budget and the
 * scene tables are in dist/magic-card-seasonal.js; the entry reaches them through `seasonalApi()` once the chunk is
 * ready and renders without a scene before that (a card without `seasonal` never starts the chunk). Layout does not
 * wait for the chunk: the band the decorations keep clear comes from the config (src/utils/seasonal.needs.ts).
 */

/** The chunk's API, or undefined until the chunk has loaded (never starts a load). */
export const seasonalApi = (): SeasonalApi | undefined => (lazyChunks.seasonal.module() as { api?: SeasonalApi } | undefined)?.api;

/** The card's seasonal scene: the chunk's CardSeasonal controller, created when the card has a `seasonal` setting and the chunk is there. */
export class SeasonalSeam {
  private _ctl?: CardSeasonal;
  private _asked = false;

  constructor(
    private readonly _host: ReactiveControllerHost,
    private readonly _opts: CardSeasonalOptions,
  ) {}

  private _controller(): CardSeasonal | undefined {
    if (this._ctl) return this._ctl;
    if (this._opts.config() === undefined) return undefined;
    const api = seasonalApi();
    if (api) return (this._ctl = new api.CardSeasonal(this._host, this._opts));
    // the chunk is not here yet (a config that reached the card after setConfig, an editor look): one render when it lands
    if (!this._asked) {
      this._asked = true;
      void loadSeasonal().then((ok) => ok && this._host.requestUpdate());
    }
    return undefined;
  }

  /** The scene to render now; undefined without a setting or before the chunk has loaded. */
  resolve(): ResolvedSeasonal | undefined {
    return this._controller()?.resolve();
  }

  /** A hass update changed the scene. */
  changed(oldHass: HomeAssistant | undefined): boolean {
    return this._ctl?.changed(oldHass) ?? false;
  }

  /** Layout seed of the card's layers ('' before the chunk has loaded; nothing seasonal is drawn then). */
  seed(config: MagicCardConfig): string {
    return seasonalApi()?.seasonalSeed(config) ?? '';
  }

  /** Whether a timer is waiting for midnight (tests). */
  get timerPending(): boolean {
    return this._ctl?.timerPending ?? false;
  }
}
