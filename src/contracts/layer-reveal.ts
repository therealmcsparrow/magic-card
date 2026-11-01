// Contract: layer reveal. Version 1.0.0. Particle layers (.mc-anim-fx, not tap layers) fade in once from opacity 0.
// Delivered only through the anim chunk's styles; reduced motion cuts, a pause never holds a layer at 0.
export const LAYER_REVEAL_CONTRACT = '1.0.0';
/** Length of the fade, equal to the crossfade of the animation runtime. */
export const LAYER_REVEAL_MS = 200;
/** Name of the keyframes the reveal plays. */
export const LAYER_REVEAL_ANIMATION = 'mc-layer-in';
