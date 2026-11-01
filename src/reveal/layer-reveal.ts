import { css, unsafeCSS } from 'lit';
import { LAYER_REVEAL_ANIMATION, LAYER_REVEAL_MS } from '../contracts/layer-reveal';
import { ALL_LAYER_STYLES } from '../css/animations';
import { PAUSE_ATTRIBUTE } from '../contracts/card-pause.needs';

/** Layers whose preset sets its own `animation` keep it: they get no fade and no pause exemption. */
const OWN_ANIMATION = Object.entries(ALL_LAYER_STYLES)
  .filter(([, body]) => /animation/.test(body))
  .map(([id]) => `:not([data-fx="${id}"])`)
  .join('');

/** Fade-in of particle layers from opacity 0, a cut under reduced motion, and the pause exemption that lets it finish. */
export const layerRevealStyles = css`@keyframes ${unsafeCSS(LAYER_REVEAL_ANIMATION)}{from{opacity:0}}.mc-anim-fx:not([data-tap]){animation:${unsafeCSS(LAYER_REVEAL_ANIMATION)} ${unsafeCSS(String(LAYER_REVEAL_MS))}ms linear backwards}ha-card[${unsafeCSS(PAUSE_ATTRIBUTE)}] .mc-anim-fx:not([data-tap])${unsafeCSS(OWN_ANIMATION)}{animation-play-state:running!important}@media (prefers-reduced-motion:reduce){.mc-anim-fx:not([data-tap]){animation:none}}`;
