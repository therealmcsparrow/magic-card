/*
 * Contract: card pause (viewer-side "Pause motion" button, WCAG 2.2.2). Version 1.0.0
 * (Architect-owned). ADR 0038 (addendum). CEO Plan Gate 2026-10-19 (00-ceo-decisions.md): a pause
 * button per card ships in this beta and stops every moving thing on the card. Shared seam with
 * task flow-slider-styles (flows, slider looks).
 *
 * ── One mechanism: paused = off screen ──
 * Every motion subsystem already pauses off screen through the shared offscreen observer (Core item
 * "Shared offscreen observer", src/icons/offscreen.ts). This contract extends that Core item; no
 * new Core item. While a card is paused, the observer treats every element it watches inside that
 * card as off screen:
 * - offscreen.ts keeps a WeakSet of paused card hosts (the <magic-card> element) and a Set of the
 *   elements it observes (watchOffscreen and the pauseOffscreen directive both register through one
 *   helper). A report for an element inside a paused card (walk parentNode / ShadowRoot.host up to
 *   a paused host) sets `offscreen` and calls its listener with false; the real intersection is
 *   remembered per element (WeakMap).
 * - setCardPaused(host, paused): records the state and re-reports every observed element inside that
 *   host at once: paused -> `offscreen` set and listener(false); resumed -> the remembered real state.
 * - watchOffscreen gains an optional third argument `{ pausable: false }` for content that updates
 *   but does not move (src/utils/timer.ts clocks and countdowns keep ticking). Default pausable.
 * So: flows (svg / html layers, pauseOffscreen), seasonal scenes and decorations, value backgrounds,
 * icon effects, weather icons, particles (live.ts), the sequence player and bg-stack (through
 * host.observeOffscreen) stop with no code of their own beyond what they do off screen today.
 *
 * ── Subsystem rules (MUST) ──
 * 1. Any element that moves on its own (CSS animation, WAAPI, rAF, video, timer-driven image swap)
 *    is either watched through watchOffscreen / pauseOffscreen / bg-stack host.observeOffscreen, or
 *    sits in the card's own shadow tree under the CSS rule in 3. Own IntersectionObservers are not
 *    allowed for motion: video-bg-view.ts and the camera view move to watchOffscreen (task T10).
 * 2. On listener(false): CSS animations paused (animation-play-state, via the `offscreen` attribute
 *    or the element's own class), WAAPI Animation.pause(), rAF loops stopped, <video>.pause(), motion
 *    timers cleared (bg-stack: pan/zoom, crossfade completes instantly, camera refresh timer and idle
 *    timer cleared; the current frame stays). On listener(true): resume from where it stopped.
 * 3. Card shadow tree (light content of the card, not nested shadow roots):
 *    `ha-card[data-mc-paused], ha-card[data-mc-paused] *` get `animation-play-state: paused
 *    !important`. Nested shadow roots (mc-flows, mc-seasonal, mc-value-bg, mc-bg-stack, icons) rely
 *    on rule 2, not on this selector.
 * 4. The anim runtime (src/anim-runtime/**, WAAPI clips and bindings) watches each element it
 *    animates through watchOffscreen (it does not today) and pauses / resumes its Animation objects.
 * 5. User-driven motion is not paused: slider drag feedback, hover and press transitions, the
 *    editor's previews. A state change while paused applies its end state without animating.
 * 6. Reduced motion stays independent: `prefers-reduced-motion: reduce` keeps today's still look;
 *    the button shows the paused state only when the viewer pressed it.
 *
 * ── Exposed state ──
 * - <magic-card> host and its ha-card (pop-up surface too): attribute `data-mc-paused` while paused.
 * - CSS custom property `--mc-paused: 1` on ha-card while paused (unset otherwise), inherited into
 *   nested shadow roots, for styles that want a static paused look.
 * - Event `mc-pause-change` on the <magic-card> host, detail { paused: boolean }, bubbles, composed
 *   (studio, other cards' code); nothing in the card depends on it.
 *
 * ── The button ──
 * - A native <button> rendered by Core as the last child of ha-card (outside .mc-card-content), so it
 *   sits above every layer: position absolute, z-index 6 (over overlays, flows labels and the stale
 *   badge), 6 px from the chosen corner, 28 x 28 px visual and at least 24 x 24 px target (44 x 44 px
 *   hit area under `pointer: coarse` via a transparent outline box). Icon mdi:pause / mdi:play,
 *   white on rgba(0,0,0,.6) circle (>= 3:1 against both the icon and a white or black backdrop: the
 *   circle carries a 1 px rgba(255,255,255,.7) ring), aria-pressed, aria-label "Pause motion" /
 *   "Play motion" (card i18n namespace), visible focus ring (2 px, 2 px offset). Keyboard: in the
 *   tab order after the card content; Enter / Space toggle. pointerdown / click stop propagation so
 *   card, row and module actions never fire.
 * - Shown when `pause_button` is `auto` (default) and the card has motion, or `always`; never with
 *   `hidden`. Card has motion = the render saw a motion source (animations / fx / v2 runtime,
 *   seasonal scene, particles, flows with moving shapes or dashes, background_layers with pan_zoom,
 *   a video-bg or a camera rendering as background) OR the observer has a pausable watched element
 *   inside the card (count kept per host; the card re-renders when it changes between 0 and 1).
 *   Under `prefers-reduced-motion: reduce`, `auto` still shows it when a video or particles run.
 * - Studio canvas: shown and working (so authors see it), not selectable as a module.
 *
 * ── YAML (card level) ──
 *   pause_button: auto | always | hidden          default auto
 *   pause_button_corner: bottom-left | bottom-right | top-left | top-right   default bottom-left
 * Editor: card Design tab, Effects group: "Pause button" (Automatic / Always / Hidden) and "Corner".
 * Help for Hidden: "Viewers can no longer stop the motion on this card. Only hide it if nothing on
 * the card moves for more than 5 seconds."
 *
 * ── Remembered ──
 * localStorage key `mc-paused:<location.pathname>:<fnv1a32 of the card config JSON>` = "1" while
 * paused, removed on resume; read once on first render. A config edit gives a new key (starts
 * playing). No personal data; functional storage the viewer asked for (no consent banner needed;
 * GDPR / ePrivacy note for legal at docs time). localStorage unavailable: pause lasts the page visit.
 *
 * ── Size ──
 * magic-card.js: button template, storage, observer extension, CSS rule and three i18n strings
 * (en-GB ids, en-US and nl tables) about 1,024 B, beyond this run's 2,560 B allowance (Lead / CEO).
 */

export const CARD_PAUSE_CONTRACT = '1.0.0';

export type PauseButtonMode = 'auto' | 'always' | 'hidden';
export type PauseButtonCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

/** Card keys; MagicCardConfig gains them in src/types.ts. */
export interface CardPauseKeys {
  pause_button?: PauseButtonMode;
  pause_button_corner?: PauseButtonCorner;
}

export const PAUSE_ATTRIBUTE = 'data-mc-paused';
export const PAUSE_EVENT = 'mc-pause-change';
export const PAUSE_STORAGE_PREFIX = 'mc-paused:';

export interface PauseChangeDetail {
  paused: boolean;
}

/** src/icons/offscreen.ts additions (Core item "Shared offscreen observer"). */
export interface OffscreenPauseApi {
  /** Mark a <magic-card> host paused / playing and re-report its observed elements. */
  setCardPaused(host: Element, paused: boolean): void;
  isCardPaused(host: Element): boolean;
  /** Pausable observed elements inside host (for `auto`). */
  motionCount(host: Element): number;
  /** Existing signature plus options; pausable defaults to true. */
  watchOffscreen(el: Element, cb: (onScreen: boolean) => void, opts?: { pausable?: boolean }): boolean;
}
