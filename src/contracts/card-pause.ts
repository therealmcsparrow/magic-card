/*
 * Contract: card pause (viewer-side "Pause motion" button, WCAG 2.2.2). Version 2.0.0
 * (Architect-owned). ADR 0038 (addendum). CEO Plan Gate 2026-10-19 (00-ceo-decisions.md): a pause
 * button per card ships in this beta and stops every moving thing on the card. Shared seam with
 * task flow-slider-styles (flows, slider looks).
 * r2 2026-10-20 (fix round B4, additive, still unreleased, so 1.0.0 in place): the `counted` option
 * on watchOffscreen and the pauseOffscreen directive.
 * r3 2.0.0 2026-10-20 (task flow-anchors-polish, CEO 2026-10-20; breaking because 1.0.0 shipped in
 * 2026.10.11-beta.3 with default `auto`): `pause_button` default is `hidden`; the editor shows the
 * setting in its own "Motion" group, open by default; the editor preview pause (MagicCard
 * `previewPaused`, additive) freezes motion while editing without the storage key. The TypeScript
 * shapes below are unchanged apart from the new PreviewPauseApi; no code consumer to migrate.
 * Deviation recorded by the builder: `deviates: hacard.S11 — CEO 2026-10-20 default hidden; the
 * viewer pause is no longer on by default; proj.M10 and proj.S4 still hold`. The offscreen and
 * reduced-motion pauses never depend on the button.
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
 *   but does not move (src/utils/timer.ts clocks and countdowns keep ticking; mc-value-bg's
 *   sparkline background). Default pausable. A non-pausable element is never counted either.
 * - (r2) `{ counted: false }` (watchOffscreen third argument, and the pauseOffscreen directive as
 *   `pauseOffscreen({ counted: false })`) for an element that pauses with the card but is no sign
 *   of motion on its own: it is left out of motionCount(host), so it never makes `auto` show the
 *   button. Default counted. Users: the slider track parts (src/utils/slider-track.ts; the slider
 *   look has no animation of its own, only transitions while the user drags) and the background
 *   stack's host.observeOffscreen (src/layers/stack-host.ts; whether a layer moves, pan_zoom or a
 *   refreshing camera, is the card's own motion-source check). Anything that does move on its own
 *   must stay counted (rule 1).
 * So: flows (svg / html layers, pauseOffscreen), seasonal scenes and decorations, value backgrounds,
 * icon effects, weather icons, particles (live.ts), the sequence player and bg-stack (through
 * host.observeOffscreen) stop with no code of their own beyond what they do off screen today.
 *
 * ── Subsystem rules (MUST) ──
 * 1. Any element that moves on its own (CSS animation, WAAPI, rAF, video, timer-driven image swap)
 *    is either watched through watchOffscreen / pauseOffscreen / bg-stack host.observeOffscreen, or
 *    sits in the card's own shadow tree under the CSS rule in 3. Own IntersectionObservers are not
 *    allowed for motion: video-bg-view.ts and the camera view move to watchOffscreen (task T10).
 *    (r2) Such an element is counted (the default) unless the card's render already reports its
 *    motion source (as for background layers).
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
 *   (studio, other cards' code); nothing in the card depends on it. Fired for the viewer state only
 *   (not for previewPaused).
 *
 * ── The button ──
 * - A native <button> rendered by Core as the last child of ha-card (outside .mc-card-content), so it
 *   sits above every layer: position absolute, z-index 6 (over overlays, flows labels and the stale
 *   badge), 6 px from the chosen corner, 28 x 28 px visual and at least 24 x 24 px target (44 x 44 px
 *   hit area on every pointer via a transparent ::after box). Icon mdi:pause / mdi:play,
 *   white on rgba(0,0,0,.6) circle (>= 3:1 against both the icon and a white or black backdrop: the
 *   circle carries a 1 px rgba(255,255,255,.7) ring), aria-pressed, one fixed aria-label "Pause motion" in both
 *   states (WCAG 4.1.2; card i18n namespace), visible focus ring (2 px, 2 px offset). Keyboard: in the
 *   tab order after the card content; Enter / Space toggle. pointerdown / click stop propagation so
 *   card, row and module actions never fire.
 * - Shown when `pause_button` is `auto` and the card has motion, or `always`; never with
 *   `hidden`, which is the default (r3, CEO 2026-10-20: an author turns the button on). Card has
 *   motion = the render saw a motion source (animations / fx / v2 runtime,
 *   seasonal scene, particles, flows with moving shapes or dashes, background_layers with pan_zoom,
 *   a video-bg or a camera rendering as background) OR the observer has a pausable, counted watched
 *   element inside the card (motionCount, kept per host; the card re-renders when it changes
 *   between 0 and 1).
 *   Under `prefers-reduced-motion: reduce`, `auto` still shows it when a video or particles run.
 * - Studio canvas: shown and working when the config shows it (so authors see it), not selectable
 *   as a module. (r3) In editMode its click never writes the storage key (the saved dashboard card
 *   would otherwise start paused).
 *
 * ── Editor preview pause (r3, additive) ──
 * - MagicCard gains a public property `previewPaused: boolean` (attribute: false, default false;
 *   PreviewPauseApi). The card is paused while `viewer paused && mode !== 'hidden'` OR
 *   `previewPaused`, whatever `pause_button` says. previewPaused sets the same attribute, custom
 *   property and setCardPaused() as a viewer pause, never reads or writes localStorage, fires no
 *   mc-pause-change, and survives setConfig: CardPause.begin() re-applies it on every render, so a
 *   config edit (new storage key) keeps the preview frozen.
 * - Studio canvas (src/editor/studio/studio-canvas.ts, card-editor chunk): one toggle button in the
 *   canvas toolbar area (not the module float-bar), native <button>, aria-pressed, aria-label
 *   "Pause preview motion", "Resume preview motion" while paused (Fix round 1: the name states the action; card-editor namespace, en-US / nl tables), icon mdi:pause / mdi:play,
 *   24 x 24 px target at least, kit focus ring, Enter / Space. State lives in the canvas (session
 *   only, starts playing) and is written to its live card as `card.previewPaused`; a new card
 *   element (frame or device change) gets the current state on creation. Shown whatever
 *   pause_button is. Reduced motion: the button still works (it only adds the pause).
 * - The dashboard edit-mode preview HA draws in its own dialog is not ours: no control there.
 *
 * ── YAML (card level) ──
 *   pause_button: auto | always | hidden          default hidden (r3; was auto)
 *   pause_button_corner: bottom-left | bottom-right | top-left | top-right   default bottom-left
 * Editor (r3): card Design tab, its own group "Motion" (id `motion`) right after Layout, open by
 * default, holding "Pause button" (Automatic / Always / Hidden) and "Corner"; removed from Effects.
 * Hidden (the default) removes the key; Automatic writes `auto`. Corner shows only while the
 * resolved mode is auto or always (unset counts as hidden). Inside a design rule the group is empty
 * and not rendered (card-level keys). Help for Hidden: "Viewers can't pause the motion on this card.
 * Turn the button on if anything moves for more than 5 seconds."
 *
 * ── Remembered ──
 * localStorage key `mc-paused:<location.pathname>:<fnv1a32 of the card config JSON>` = "1" while
 * paused, removed on resume; read once on first render. A config edit gives a new key (starts
 * playing). No personal data; functional storage the viewer asked for (no consent banner needed;
 * GDPR / ePrivacy note for legal at docs time). localStorage unavailable: pause lasts the page visit.
 * (r3) Never written while the card is in editMode or by previewPaused.
 *
 * ── Size ──
 * magic-card.js: button template, storage, observer extension, CSS rule and three i18n strings
 * (en-GB ids, en-US and nl tables) about 1,024 B, beyond this run's 2,560 B allowance (Lead / CEO).
 * (r3) previewPaused plus the editMode storage guard: about 80-150 B in magic-card.js; the canvas
 * toggle and the Motion group are in magic-card-editor.js.
 */

export const CARD_PAUSE_CONTRACT = '2.0.0';
export const CARD_PAUSE_CONTRACT_REVISION = 3;

export type PauseButtonMode = 'auto' | 'always' | 'hidden';
export type PauseButtonCorner = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

/** (r3) Default of `pause_button` (was 'auto' in 1.0.0). */
export const PAUSE_BUTTON_DEFAULT: PauseButtonMode = 'hidden';

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

/** (r3) The editor preview pause on <magic-card> (Core card element, additive public property). */
export interface PreviewPauseApi {
  /** Freeze the card's motion while editing; never remembered, survives setConfig. Default false. */
  previewPaused: boolean;
}

/** (r2) Options of watchOffscreen and (counted only) the pauseOffscreen directive. */
export interface OffscreenWatchOptions {
  /** false: keeps running in a paused card (updates, does not move); never counted. Default true. */
  pausable?: boolean;
  /** false: pauses with the card but is left out of motionCount (no sign of motion on its own). Default true. */
  counted?: boolean;
}

/** src/icons/offscreen.ts additions (Core item "Shared offscreen observer"). */
export interface OffscreenPauseApi {
  /** Mark a <magic-card> host paused / playing and re-report its observed elements. */
  setCardPaused(host: Element, paused: boolean): void;
  isCardPaused(host: Element): boolean;
  /** Pausable, counted observed elements inside host (for `auto`). */
  motionCount(host: Element): number;
  /** Existing signature plus options; pausable and counted default to true. */
  watchOffscreen(el: Element, cb: (onScreen: boolean) => void, opts?: OffscreenWatchOptions): boolean;
}
