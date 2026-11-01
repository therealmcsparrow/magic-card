import { css, unsafeCSS } from 'lit';
import { LAYER_REVEAL_ANIMATION, LAYER_REVEAL_MS } from '../contracts/layer-reveal';
import { ALL_LAYER_STYLES } from '../css/animations';
import { PAUSE_ATTRIBUTE } from '../contracts/card-pause.needs';

/** True when a layer body declares `animation` or `animation-name` as a property of its own. */
export function setsOwnAnimation(body: string): boolean {
  return body
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(';')
    .some((declaration) => /^\s*(?:-webkit-)?animation(?:-name)?\s*:/.test(declaration));
}

/** Builds the reveal rules. Layers whose preset sets its own animation keep it: no fade, no cut, no pause exemption. */
export function buildLayerReveal(layerStyles: Record<string, string>) {
  const own = Object.entries(layerStyles)
    .filter(([, body]) => setsOwnAnimation(body))
    .map(([id]) => `:not([data-fx="${id}"])`)
    .join('');
  const layer = unsafeCSS(`.mc-anim-fx:not([data-tap])${own}`);
  return css`@keyframes ${unsafeCSS(LAYER_REVEAL_ANIMATION)}{from{opacity:0}}${layer}{animation:${unsafeCSS(LAYER_REVEAL_ANIMATION)} ${unsafeCSS(String(LAYER_REVEAL_MS))}ms linear backwards}ha-card[${unsafeCSS(PAUSE_ATTRIBUTE)}] ${layer}{animation-play-state:running!important}@media (prefers-reduced-motion:reduce){${layer}{animation:none}}`;
}

/** Fade-in of particle layers from opacity 0, a cut under reduced motion, and the pause exemption that lets it finish. */
export const layerRevealStyles = buildLayerReveal(ALL_LAYER_STYLES);
