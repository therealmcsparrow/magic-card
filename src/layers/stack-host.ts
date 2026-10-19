import type { BackgroundLayerConfig, BgStackHost } from '../contracts/bg-stack';
import type { HomeAssistant } from '../types';
import type { RenderContext } from '../services/render-context';
import { withRenderContext } from '../services/render-context';
import { t } from '../card/i18n';
import { offscreenObserver, unwatchOffscreen } from '../icons/offscreen';
import { safeColor } from '../utils/animation';
import { entityStateColor, isEntityColor } from '../utils/entity-color';
import { mediaSrc } from '../utils/media';

/*
 * What the card hands <mc-bg-stack> (contract bg-stack 1.0.0 r2, `host`): the Core side of the card
 * backdrop. Part of magic-card.js; the stack itself lives in the lazy chunk and imports none of this.
 * It does not vet image URLs: the chunk's safeImageUrl does, for every URL it loads.
 */
export function createStackHost(card: { hass?: HomeAssistant; renderRoot: ParentNode }, ctx: () => RenderContext, lowPower: () => boolean): BgStackHost {
  return {
    // inside the card's render context, so browsed media is resolved (and kept fresh) by the card
    resolveImage: (hass, source) => withRenderContext(ctx(), () => mediaSrc(hass, source)) || undefined,
    cardEntity: () => ctx().cardEntity,
    cssColor: (value, entity) =>
      isEntityColor(value) ? (entity && entityStateColor(card.hass?.states[entity])) || 'currentColor' : safeColor(value) ?? 'transparent',
    observeOffscreen: (el) => {
      offscreenObserver()?.observe(el);
      return () => unwatchOffscreen(el);
    },
    badgeHost: () => card.renderRoot.querySelector<HTMLElement>('.mc-bg-badge') ?? undefined,
    lowPower,
    staleText: (seconds) => t('Not updated {n} min', { n: Math.max(1, Math.round(seconds / 60)) }),
  };
}

/** Some layer can go stale: a camera.* image layer (own entity, else the card's) that has not turned the badge off. */
export function canGoStale(layers: readonly BackgroundLayerConfig[], cardEntity: string | undefined): boolean {
  return layers.some((l) => l?.type === 'image' && !l.hidden && l.stale_badge !== false && !l.states && String(l.entity ?? cardEntity).startsWith('camera.'));
}
