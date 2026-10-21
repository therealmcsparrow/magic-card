import { css, unsafeCSS } from 'lit';
import { mcVariables } from './tokens';
import { animationStyles } from './animations';
import { popupStyles } from './popup';
import { weatherIconStyles } from '../icons/weather-icons';
import { flowsCardStyles } from '../card/flows-css';
import { shapeCardStyles, valueBgCardStyles } from '../card/shape-css';
import { seasonalCardStyles } from '../card/seasonal-card-css';
import { LAYER_SYNC_CSS } from '../layers/layer-slot';
import { pauseCardStyles } from '../card/pause-css';

/** Module roots that are 100% wide (their own rules below); a layout gives their wrapper that width. */
const FULL_WIDTH_ROOTS = [
  '.mc-bar', '.mc-separator', '.mc-slider-container--horizontal', '.mc-image', '.mc-dropdown',
  '.mc-video-bg', '.mc-camera', '.mc-graphs', '.mc-nested-row', '.mc-slider-layout',
].join(', ');

/** Roots a row lets shrink below their min-content width: nested layouts and the gauge's drawing. */
const SHRINKING_ROOTS = ['.mc-horizontal', '.mc-vertical', '.mc-gauge'].join(', ');

/* ================================================================== */
/*  MAGIC CARD STYLES                                                  */
/* ================================================================== */
const magicCardLocalStyles = css`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    height: 100%;
  }

  .mc-card-content {
    display: flex;
    flex-direction: column;
    padding: var(--mc-padding);
    gap: var(--mc-gap);
  }

  /* A failure notice shows (host attribute mc-fail): ha-card is the scroll box, so the card keeps its grid cell. */
  :host([mc-fail]) {
    height: 100%;
  }
  :host([mc-fail]) ha-card {
    display: flex;
    flex-direction: column;
    overflow: hidden auto;
    scroll-padding-block: 8px;
  }
  :host([mc-fail]) .mc-card-content {
    flex: none;
  }

  /* Columns fill their grid cell (stretch): vertical_align then has room to work and the studio
     frames the cell, not just the column's modules. */
  .mc-row {
    display: grid;
    gap: var(--mc-gap);
    align-items: stretch;
  }

  .mc-column {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
    min-width: 0;
  }

  .mc-column[data-valign='center'] {
    justify-content: center;
  }
  .mc-column[data-valign='end'] {
    justify-content: flex-end;
  }
  .mc-column[data-valign='stretch'] {
    justify-content: stretch;
  }

  /* Module base styles */
  .mc-module {
    min-width: 0;
    overflow-wrap: break-word;
  }

  @supports (-webkit-background-clip:text){.mc-module-wrapper[style*=--mc-text-paint]>.mc-module{background-image:var(--mc-text-paint);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.mc-module-wrapper[style*=--mc-text-paint] .mc-module-wrapper{-webkit-text-fill-color:currentColor}}

  .mc-text {
    font-size: var(--mc-font-size, inherit);
  }

  /* "unavailable" after a missing entity's id */
  .mc-text-muted {
    color: var(--mc-design-color, var(--secondary-text-color));
  }

  .mc-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mc-icon ha-icon,
  .mc-icon ha-state-icon,
  .mc-icon mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size, 24px);
  }

  .mc-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-info--icon {
    flex-direction: row;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-info-icon {
    display: inline-flex;
    flex: none;
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-info-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .mc-info-name {
    font-weight: 500;
    font-size: var(--mc-font-size-md);
    color: var(--mc-design-color, var(--mc-text));
  }

  .mc-info-state {
    font-size: var(--mc-font-size-xl);
    font-weight: 600;
    color: var(--mc-design-color, var(--mc-text));
  }

  .mc-info-secondary {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-image {
    width: 100%;
    overflow: hidden;
    border-top-left-radius: var(--mc-design-radius-tl, 0);
    border-top-right-radius: var(--mc-design-radius-tr, 0);
    border-bottom-right-radius: var(--mc-design-radius-br, 0);
    border-bottom-left-radius: var(--mc-design-radius-bl, 0);
  }

  .mc-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  /* A broken image: the image-off placeholder instead. */
  .mc-image:not(.mc-image--broken) > .mc-image-error,
  .mc-image.mc-image--broken > img {
    display: none;
  }

  .mc-markdown {
    line-height: 1.5;
  }

  .mc-bar-container {
    width: 100%;
  }

  .mc-bar {
    width: 100%;
    height: var(--mc-bar-height);
    background: var(--mc-border);
    border-radius: var(--mc-bar-radius);
    overflow: hidden;
  }

  .mc-bar-fill {
    height: 100%;
    border-radius: var(--mc-bar-radius);
    transition: width var(--mc-bar-transition);
    background: var(--mc-primary);
  }

  .mc-bar-value {
    font-size: var(--mc-font-size-md);
    margin-top: var(--mc-gap-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
    white-space: nowrap;
  }

  /* No number to show (unavailable, unknown, text state): an empty, dimmed track */
  .mc-bar--unavailable .mc-bar-track {
    opacity: 0.5;
  }
  .mc-bar--unavailable .mc-bar-value {
    font-style: italic;
  }

  /* Bar horizontal layout */
  /* The root holds the track and the value: it is not the track itself (that clipped the value). */
  .mc-bar-horizontal,
  .mc-bar-vertical {
    height: auto;
    background: none;
    border-radius: 0;
    overflow: visible;
  }

  .mc-bar-horizontal {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  .mc-bar-horizontal .mc-bar-track {
    flex: 1;
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-bar-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-bar-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-bar-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-bar-radius));
    overflow: hidden;
  }

  .mc-bar-horizontal .mc-bar-track .mc-bar-fill {
    transition: width var(--mc-bar-transition);
  }

  /* Bar vertical layout */
  .mc-bar-vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--mc-gap-xs);
  }

  .mc-bar-vertical .mc-bar-track {
    min-height: 40px;
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-bar-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-bar-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-bar-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-bar-radius));
    position: relative;
    overflow: hidden;
  }

  .mc-bar-vertical .mc-bar-track .mc-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: var(--mc-bar-radius);
    transition: height var(--mc-bar-transition);
  }

  .mc-separator {
    width: 100%;
    border: none;
    border-top: 1px solid var(--mc-border);
    margin: var(--mc-gap-xs) 0;
  }

  .mc-separator-vertical {
    width: auto;
    height: 100%;
    border: none;
    border-left: 1px solid var(--mc-border);
    margin: 0 var(--mc-gap-xs);
  }

  /* Button module wrapper: layout only; the clickable .mc-button-inner carries the look */
  .mc-button {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    color: var(--mc-design-color, var(--mc-text));
    font-size: var(--mc-button-font-size);
  }

  /* Button inner element + variants */
  .mc-button-inner {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    padding: var(--mc-button-padding);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    border-width: var(--mc-design-bw, 0);
    border-style: var(--mc-design-bs, none);
    border-color: var(--mc-design-bc, currentColor);
    box-shadow: var(--mc-design-shadow, none);
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
    transition: opacity var(--mc-transition-duration);
  }

  .mc-button-inner:hover {
    opacity: 0.9;
  }

  .mc-button-inner ha-icon,
  .mc-button-inner ha-state-icon,
  .mc-button-inner mc-svg-icon {
    --mdc-icon-size: var(--mc-button-icon-size);
  }

  .mc-button-icon {
    display: inline-flex;
  }

  .mc-button-inner--default {
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
  }

  .mc-button-inner--outline {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border-width: var(--mc-design-bw, 1px);
    border-style: var(--mc-design-bs, solid);
    border-color: var(--mc-design-bc, var(--mc-button-color));
  }

  .mc-button-inner--flat {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
  }

  .mc-button-inner--icon-only {
    padding: var(--mc-button-padding-icon);
  }

  .mc-button-state {
    opacity: 0.8;
    font-size: var(--mc-font-size-xs);
    white-space: nowrap;
  }

  .mc-tile-slider {
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: var(--mc-slider-radius);
    overflow: hidden;
    cursor: pointer;
  }

  .mc-tile-slider--vertical {
    width: 40px;
    height: 100%;
  }

  .mc-tile-slider[aria-disabled='true'] {
    cursor: default;
    opacity: 0.5;
  }

  .mc-tile-slider.mc-dragging .mc-tile-slider-bar {
    transition: none;
  }

  .mc-tile-slider-background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: var(--mc-slider-background, var(--disabled-color, #9e9e9e));
    opacity: 0.2;
  }

  .mc-tile-slider-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--mc-slider-color, var(--primary-color, #03a9f4));
    border-radius: var(--mc-slider-radius);
    transform: translate3d(calc((var(--slider-value, 0) - 1) * 100%), 0, 0);
    transition: transform 180ms ease-in-out, background-color 180ms ease-in-out;
  }

  .mc-tile-slider-bar::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 5px;
    margin: auto;
    height: 50%;
    width: 4px;
    border-radius: var(--mc-radius-sm);
    background-color: var(--text-primary-color, #fff);
  }

  .mc-tile-slider--vertical .mc-tile-slider-bar {
    top: auto;
    bottom: 0;
    transform: translate3d(0, calc((1 - var(--slider-value, 0)) * 100%), 0);
  }

  .mc-tile-slider--vertical .mc-tile-slider-bar::after {
    top: 5px;
    right: 0;
    left: 0;
    bottom: auto;
    width: 50%;
    height: 4px;
  }

  .mc-slider-value {
    font-size: var(--mc-font-size-md);
    min-width: 36px;
    text-align: center;
    white-space: nowrap;
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Slider container layout */
  .mc-slider-container {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  /* the slider module's track takes the design radius (the light module's sliders keep theirs) */
  .mc-slider-container > .mc-tile-slider {
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-slider-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-slider-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-slider-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-slider-radius));
  }

  .mc-slider-container--vertical {
    flex-direction: column;
    width: auto;
    height: var(--mc-slider-vertical-height);
  }

  .mc-slider-container--horizontal {
    flex-direction: row;
    width: 100%;
  }

  /* Spinbox */
  .mc-spinbox {
    display: flex;
    align-items: center;
    gap: var(--mc-spinbox-gap);
  }

  .mc-spinbox-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--mc-spinbox-btn-size);
    height: var(--mc-spinbox-btn-size);
    border: none;
    border-radius: 50%;
    background: var(--mc-spinbox-btn-color);
    color: var(--mc-design-color, var(--mc-spinbox-btn-text-color));
    font-size: var(--mc-spinbox-btn-font-size);
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
  }

  .mc-spinbox-btn:disabled {
    cursor: default;
    opacity: 0.4;
  }

  .mc-spinbox-value {
    font-size: var(--mc-spinbox-value-font-size);
    font-weight: var(--mc-spinbox-value-font-weight);
    min-width: var(--mc-spinbox-value-min-width);
    text-align: center;
    white-space: nowrap;
  }

  /* a state instead of a number (Unavailable, Off) */
  .mc-spinbox-value--text {
    font-size: var(--mc-font-size-md);
    font-weight: 500;
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Dropdown */
  .mc-dropdown {
    width: 100%;
  }

  .mc-dropdown select:disabled {
    cursor: default;
    opacity: 0.6;
  }

  .mc-dropdown select {
    width: 100%;
    padding: var(--mc-dropdown-padding);
    border-width: var(--mc-design-bw, 1px);
    border-style: var(--mc-design-bs, solid);
    border-color: var(--mc-design-bc, var(--mc-border));
    box-shadow: var(--mc-design-shadow, none);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-dropdown-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-dropdown-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-dropdown-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-dropdown-radius));
    background: var(--mc-design-bg, var(--mc-bg));
    color: var(--mc-design-color, var(--mc-text));
    font-size: var(--mc-dropdown-font-size);
    font-family: inherit;
    cursor: pointer;
    appearance: auto;
  }

  .mc-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mc-gauge svg {
    overflow: visible;
    /* scales down in a narrow row instead of sticking out */
    max-width: 100%;
    height: auto;
  }

  .mc-gauge-name {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
    margin-top: 2px;
  }

  .mc-gauge--unavailable .mc-gauge-text {
    font-style: italic;
    opacity: 0.7;
  }

  .mc-gauge-value {
    font-size: var(--mc-font-size-2xl);
    font-weight: 600;
    margin-top: -20px;
  }

  /* Light module */
  .mc-light {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--mc-gap-sm);
  }

  .mc-light--compact {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  /* compact: the controls share the row after the name and wrap under it when there is no room */
  .mc-light--compact > .mc-light-header {
    flex: 1 1 auto;
  }

  .mc-light--compact > .mc-light-control {
    flex: 1 1 140px;
    min-width: 0;
  }

  .mc-light-header {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-header ha-icon,
  .mc-light-header ha-state-icon,
  .mc-light-header mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-light--compact .mc-light-header ha-icon,
  .mc-light--compact .mc-light-header ha-state-icon,
  .mc-light--compact .mc-light-header mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size-md);
  }

  /* the header icon is the on / off button */
  .mc-light-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    margin: -4px;
    border: none;
    border-radius: 50%;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .mc-light-toggle:disabled {
    cursor: default;
  }

  .mc-light-toggle:focus-visible,
  .mc-tile-slider:focus-visible,
  .mc-spinbox-btn:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .mc-light-effect-select {
    flex: 1;
    min-width: 0;
    padding: 4px 6px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-sm);
    background: var(--mc-bg);
    color: inherit;
    font: inherit;
  }

  .mc-light-name {
    font-weight: 500;
  }

  .mc-light-name--compact {
    font-weight: 500;
    flex: 1;
  }

  .mc-light-info {
    flex: 1;
  }

  .mc-light-secondary {
    font-size: var(--mc-font-size-xs);
    opacity: var(--mc-light-label-opacity);
  }

  .mc-light-control {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-control ha-icon {
    --mdc-icon-size: var(--mc-icon-size-sm);
    opacity: var(--mc-light-label-opacity);
  }

  .mc-light-control > .mc-tile-slider {
    flex: 1;
    min-width: 0;
  }

  .mc-light-value {
    font-size: var(--mc-font-size-xs);
    min-width: 32px;
    text-align: right;
    white-space: nowrap;
  }

  .mc-light-color-input {
    width: var(--mc-light-color-input-size);
    height: var(--mc-light-color-input-size);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  /* Slider layout: Swiper core styles, scoped to the card (swiper/css would land in document.head) */
  .mc-slider-layout {
    display: block;
    width: 100%;
    min-width: 0;
    position: relative;
  }
  .mc-slider-layout > .swiper {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .mc-slider-layout .swiper-horizontal {
    touch-action: pan-y;
  }
  .mc-slider-layout .swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
  .mc-slider-layout .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    min-width: 0;
    position: relative;
    transition-property: transform;
    box-sizing: border-box;
  }
  .mc-slider-layout .swiper-slide > * {
    min-width: 0;
  }
  /* Swiper A11y live region ("Next slide" ...): for screen readers only */
  .mc-slider-layout .swiper-notification {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  }
  .mc-slider-nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: color-mix(in srgb, var(--card-background-color, #fff) 80%, transparent);
    color: var(--mc-design-color, var(--mc-primary));
    cursor: pointer;
    --mdc-icon-size: 20px;
    -webkit-tap-highlight-color: transparent;
  }
  .mc-slider-prev {
    left: 4px;
  }
  .mc-slider-next {
    right: 4px;
  }
  .mc-slider-nav.swiper-button-disabled {
    opacity: 0.35;
    cursor: default;
  }
  .mc-slider-nav.swiper-button-lock,
  .mc-slider-pagination.swiper-pagination-lock {
    display: none;
  }
  .mc-slider-nav:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }
  .mc-slider-pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding-top: 8px;
  }
  .mc-slider-pagination .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mc-text-secondary, currentColor);
    opacity: 0.35;
    transition: opacity var(--mc-transition-duration, 0.2s), background-color var(--mc-transition-duration, 0.2s);
  }
  .mc-slider-pagination .swiper-pagination-bullet[role='button'] {
    cursor: pointer;
  }
  .mc-slider-pagination .swiper-pagination-bullet-active {
    background: var(--mc-primary);
    opacity: 1;
  }

  .mc-horizontal {
    display: flex;
    flex-direction: row;
    gap: var(--mc-gap);
    align-items: center;
  }

  .mc-vertical {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
  }

  /*
   * A layout child's flex item is its module wrapper, not the module root: size the wrapper the way
   * the root used to be sized (min-width 0 like .mc-module; full width for roots that are 100% wide),
   * so bars, separators, sliders ... keep their width in rows and centred columns.
   */
  .mc-module-wrapper[data-mc-needs]::after{content:attr(data-mc-needs);display:block;border:1px dashed;font-size:.75rem}
  .mc-horizontal > .mc-module-wrapper,
  .mc-vertical > .mc-module-wrapper {
    min-width: 0;
  }
  .mc-horizontal > .mc-shape-shadow,
  .mc-vertical > .mc-shape-shadow {
    min-width: 0;
  }
  /*
   * In a row, a child that is not full width (text, info, icon, button ...) keeps its min-content
   * width (its longest word) next to full-width siblings, instead of being squeezed to one letter
   * per line. The full-width siblings share the rest. Not for nested layouts (their min-content is
   * every child's put together) or gauges (a fixed-size drawing that scales down): those shrink
   * like before, so a narrow card does not overflow.
   */
  .mc-horizontal > .mc-module-wrapper:not(:has(> :is(${unsafeCSS(FULL_WIDTH_ROOTS)}, ${unsafeCSS(SHRINKING_ROOTS)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-module-wrapper:has(> :is(${unsafeCSS(FULL_WIDTH_ROOTS)})),
  .mc-vertical > .mc-module-wrapper:has(> :is(${unsafeCSS(FULL_WIDTH_ROOTS)})) {
    width: 100%;
    box-sizing: border-box;
  }
  /* the same for a shaped module with a shadow, whose flex item is its drop-shadow wrapper */
  .mc-horizontal > .mc-shape-shadow:not(:has(> .mc-module-wrapper > :is(${unsafeCSS(FULL_WIDTH_ROOTS)}, ${unsafeCSS(SHRINKING_ROOTS)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${unsafeCSS(FULL_WIDTH_ROOTS)})),
  .mc-vertical > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${unsafeCSS(FULL_WIDTH_ROOTS)})) {
    width: 100%;
    box-sizing: border-box;
  }

  .mc-tabs-header {
    display: flex;
    gap: var(--mc-gap-xs);
    border-bottom: 1px solid var(--mc-border);
    margin-bottom: var(--mc-gap-sm);
  }

  .mc-tab-button {
    padding: var(--mc-button-padding);
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
    border-bottom: 2px solid transparent;
    transition: all var(--mc-transition-duration);
  }

  /* the label follows the design colour; the underline / pill keeps the accent */
  .mc-tab-button.active {
    color: var(--mc-design-color, var(--mc-primary));
    border-bottom-color: var(--mc-primary);
  }

  .mc-tab-button ha-icon,
  .mc-tab-button mc-svg-icon {
    --mdc-icon-size: 16px;
  }

  /* Tab style: pills */
  .mc-tabs[data-style='pills'] .mc-tabs-header {
    border-bottom: none;
  }

  .mc-tabs[data-style='pills'] .mc-tab-button {
    border-bottom: none;
    border-radius: var(--mc-radius-md);
    background: transparent;
  }

  .mc-tabs[data-style='pills'] .mc-tab-button.active {
    background: var(--mc-primary);
    color: var(--mc-design-color, var(--text-primary-color, #fff));
  }

  /* Tab style: underline */
  .mc-tabs[data-style='underline'] .mc-tabs-header {
    border-bottom: 2px solid var(--mc-border);
  }

  .mc-tabs[data-style='underline'] .mc-tab-button {
    border-bottom-width: 3px;
    font-weight: 500;
  }

  .mc-tabs[data-style='underline'] .mc-tab-button.active {
    border-bottom-width: 3px;
    font-weight: 700;
  }

  .mc-clock {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mc-clock-time {
    font-size: 2rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .mc-clock-date {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Weather module */
  .mc-weather {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap-md);
  }

  .mc-weather-now {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-weather-now > ha-icon,
  .mc-weather-now > mc-svg-icon,
  .mc-weather-now > .mc-wx {
    --mdc-icon-size: var(--mc-icon-size-xl);
  }

  .mc-weather-temp {
    font-size: 2rem;
    font-weight: 600;
  }

  .mc-weather-condition {
    font-size: var(--mc-font-size-md);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Forecast module */
  .mc-forecast {
    display: flex;
    gap: var(--mc-gap-sm);
    overflow-x: auto;
  }

  .mc-forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--mc-gap-xs);
    padding: var(--mc-gap-sm) var(--mc-gap-xs);
    /* 60 px wide, shrinking to 44 px in a narrow column so five days fit 331 px; more than fit scroll */
    flex: 0 1 60px;
    min-width: 44px;
  }

  .mc-forecast-item ha-icon,
  .mc-forecast-item mc-svg-icon,
  .mc-forecast-item .mc-wx {
    --mdc-icon-size: var(--mc-forecast-icon-size);
  }

  .mc-forecast-label {
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-forecast-temp {
    font-size: var(--mc-font-size-md);
  }

  .mc-forecast-templow {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-forecast-label {
    text-align: center;
    white-space: nowrap;
  }

  .mc-forecast-empty {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-video-bg {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .mc-video-bg mc-bg-video {
    display: block;
    width: 100%;
    height: 100%;
  }

  .mc-video-bg-media {
    width: 100%;
    display: block;
  }

  /*
   * With other modules next to it, the video is a background layer of their container (column,
   * row column, tab, horizontal / vertical layout, slide): out of the flow, behind its siblings,
   * filling the container. On its own it keeps its own size. The containers are named: a bare
   * :has() would be checked against every element of the card on each change. Browsers without
   * :has() (older WebViews) show the video in the flow, above its siblings.
   */
  :is(.mc-column, .mc-horizontal, .mc-vertical, .mc-tabs-content, .swiper-slide):has(> .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media) {
    position: relative;
    isolation: isolate;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]):has(> .mc-video-bg--media),
  .mc-module-wrapper:not([data-mc-placement]):has(> .mc-video-bg--media):has(~ .mc-module-wrapper) {
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  /* studio canvas: the layer can still be clicked (where nothing covers it) to select it */
  .mc-module-wrapper[data-mc-path]:not([data-mc-placement]):has(> .mc-video-bg--media) {
    pointer-events: auto;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media,
  .mc-module-wrapper:not([data-mc-placement]):has(~ .mc-module-wrapper) > .mc-video-bg--media,
  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media .mc-video-bg-media,
  .mc-module-wrapper:not([data-mc-placement]):has(~ .mc-module-wrapper) > .mc-video-bg--media .mc-video-bg-media {
    height: 100%;
  }

  /* Video background placeholder */
  .mc-video-bg-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    background: var(--mc-border);
    border-radius: var(--mc-radius-md);
  }

  .mc-video-bg-placeholder ha-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
    color: var(--mc-text-secondary);
  }

  /* Camera module */
  .mc-camera {
    width: 100%;
    overflow: hidden;
    border-top-left-radius: var(--mc-design-radius-tl, 0);
    border-top-right-radius: var(--mc-design-radius-tr, 0);
    border-bottom-right-radius: var(--mc-design-radius-br, 0);
    border-bottom-left-radius: var(--mc-design-radius-bl, 0);
  }

  .mc-camera img,
  .mc-camera ha-camera-stream {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .mc-camera ha-camera-stream {
    --video-max-height: 100%;
  }

  .mc-camera-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: var(--mc-border);
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-md);
  }

  .mc-camera-fallback ha-icon {
    margin-right: var(--mc-gap-sm);
  }

  /* Graphs module */
  .mc-graphs {
    width: 100%;
  }

  .mc-graphs svg {
    width: 100%;
    height: auto;
  }

  .mc-graphs-label {
    display: flex;
    justify-content: space-between;
    gap: var(--mc-gap-sm);
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
    margin-top: var(--mc-gap-xs);
  }

  .mc-graphs-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-graphs-meta {
    flex: none;
    white-space: nowrap;
  }

  /* No line yet (loading, no entity, no numeric history): a quiet empty area, never a fake curve */
  .mc-graphs-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px dashed var(--mc-border);
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Image fallback */
  .mc-image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mc-border);
    color: var(--mc-text-secondary);
  }

  /* Custom card placeholder */
  .mc-custom-card-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--mc-gap-sm);
    min-height: 80px;
    background: var(--mc-border);
    border-radius: var(--mc-radius-md);
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-md);
  }

  .mc-custom-card-placeholder ha-icon {
    --mdc-icon-size: 28px;
  }

  .mc-custom-card-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    color: var(--mc-text-secondary);
  }

  /* Nested row module: a card row inside a column */
  .mc-nested-row {
    display: grid;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  /* Placeholder text (e.g. empty tabs) */
  .mc-placeholder-text {
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-xs);
  }

  /* Hover effect support */
  .mc-hoverable {
    transition: all var(--mc-transition-duration) ease;
  }

  /*
   * Design surface vars (--mc-design-radius-*, --mc-design-bg) apply to one module's own surface:
   * reset them on every module wrapper (its inline design style sets them again) and on modules
   * nested inside a layout module, so a row, column or parent module never restyles inner surfaces.
   */
  .mc-module-wrapper,
  :not(.mc-module-wrapper) > .mc-module {
    --mc-design-radius-tl: initial;
    --mc-design-radius-tr: initial;
    --mc-design-radius-br: initial;
    --mc-design-radius-bl: initial;
    --mc-design-bg: initial;
    --mc-design-shadow: initial;
    --mc-design-bw: initial;
    --mc-design-bs: initial;
    --mc-design-bc: initial;
    --mc-entity-color: initial;
    --mc-anim-color: initial;
    --mc-anim-m: initial;
    --mc-anim-i: initial;
    --mc-anim-mi: initial;
    --mc-anim-om: initial;
    --mc-anim-oi: initial;
  }

  /* the design background fills the button / dropdown itself, not a full-width band behind it */
  .mc-module-wrapper:has(> .mc-button, > .mc-dropdown) {
    background: none !important;
  }

  .mc-module-wrapper[role='button'],
  .mc-row[data-mc-row-actions] {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mc-module-wrapper[role='button']:focus-visible,
  .mc-row[data-mc-row-actions][tabindex]:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  /* a shaped element clips its outline: mc-shape draws the focus ring along the shape instead */
  .mc-module-wrapper[data-mc-shape]:focus-visible,
  [data-mc-shape]:focus-visible {
    outline: none;
    --mc-shape-focus: var(--mc-primary);
  }

  /* border_length: the wrapper's border stays (transparent, same width); this overlay covers the
     border box (same border-radius); each side is a layer with only that side's border, masked to
     the length, so it follows rounded corners (resolveBorderLength). */
  [data-mc-border-fx],
  [data-mc-ring] {
    position: relative;
  }
  .mc-border-fx {
    position: absolute;
    pointer-events: none;
  }
  .mc-border-fx > i {
    position: absolute;
    display: block;
    box-sizing: border-box;
  }

  /* Editor canvas: rows, columns, modules and tabs hidden (Hide or display conditions) stay selectable */
  [data-mc-hidden] {
    opacity: 0.45;
  }

  /* Editor canvas: an empty column keeps a selectable, visible cell */
  .mc-column[data-mc-empty] {
    min-height: 40px;
    border-radius: 8px;
    outline: 1px dashed color-mix(in srgb, currentColor 35%, transparent);
    outline-offset: -1px;
  }

  /* Hidden by display condition */
  .mc-hidden {
    display: none !important;
  }

  /* Error state */
  .mc-error {
    color: var(--error-color, #ef4444);
    padding: var(--mc-gap-sm);
    font-size: var(--mc-font-size-md);
  }

  /* One module's own error (invalid config, failed render or template): the rest of the card renders. */
  .mc-module-error,
  .mc-module-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
    line-height: 1.3;
  }
  .mc-module-hint {
    color: var(--secondary-text-color, #6b7280);
    font-style: italic;
  }
  .mc-module-error ha-icon,
  .mc-module-hint ha-icon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .mc-module-error span,
  .mc-module-hint span,
  .mc-template-error {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mc-template-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-button,
  .mc-button-inner,
  .mc-tab-button,
  .mc-spinbox-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-button:focus-visible,
  .mc-button-inner:focus-visible,
  .mc-tab-button:focus-visible,
  .mc-spinbox-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-button-inner:active,
  .mc-tab-button:active,
  .mc-spinbox-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Font-family inherit for interactive elements */
  .mc-tab-button,
  .mc-spinbox-btn {
    font-family: inherit;
  }
`;

export const magicCardStyles = [mcVariables, magicCardLocalStyles, animationStyles, popupStyles, weatherIconStyles, flowsCardStyles, shapeCardStyles, valueBgCardStyles, seasonalCardStyles, LAYER_SYNC_CSS, pauseCardStyles];
