import { css, unsafeCSS } from 'lit';
import { mcVariables } from './tokens';
import { editorSystem } from './editor-system';
import { animationStyles } from './animations';
import { popupStyles } from './popup';
import { weatherIconStyles } from '../icons/weather-icons';
import { flowsCardStyles } from '../card/flows-css';
import { shapeCardStyles, valueBgCardStyles } from '../card/shape-css';
import { seasonalCardStyles } from '../card/seasonal-card-css';

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

  /* Button module wrapper */
  .mc-button {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    padding: var(--mc-button-padding);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    color: var(--mc-design-color, var(--mc-text));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    transition: background var(--mc-transition-duration);
  }

  .mc-button:hover {
    background: var(--mc-border);
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
    border: none;
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
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
    border: none;
  }

  .mc-button-inner--outline {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border: 1px solid var(--mc-button-color);
  }

  .mc-button-inner--flat {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border: none;
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
    border: 1px solid var(--mc-border);
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
    padding: var(--mc-gap-sm);
    min-width: 60px;
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
  :is(.mc-column, .mc-horizontal, .mc-vertical, .mc-tabs-content, .swiper-slide):has(> .mc-module-wrapper > .mc-video-bg--media) {
    position: relative;
    isolation: isolate;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:has(> .mc-video-bg--media),
  .mc-module-wrapper:has(> .mc-video-bg--media):has(~ .mc-module-wrapper) {
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  /* studio canvas: the layer can still be clicked (where nothing covers it) to select it */
  .mc-module-wrapper[data-mc-path]:has(> .mc-video-bg--media) {
    pointer-events: auto;
  }

  .mc-module-wrapper ~ .mc-module-wrapper > .mc-video-bg--media,
  .mc-module-wrapper:has(~ .mc-module-wrapper) > .mc-video-bg--media,
  .mc-module-wrapper ~ .mc-module-wrapper > .mc-video-bg--media .mc-video-bg-media,
  .mc-module-wrapper:has(~ .mc-module-wrapper) > .mc-video-bg--media .mc-video-bg-media {
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

  /* Editor canvas: modules/rows/columns hidden by display conditions stay selectable */
  .mc-module-wrapper[data-mc-hidden],
  .mc-row[data-mc-hidden],
  .mc-column[data-mc-hidden] {
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

  .mc-button:active,
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

export const magicCardStyles = [mcVariables, magicCardLocalStyles, animationStyles, popupStyles, weatherIconStyles, flowsCardStyles, shapeCardStyles, valueBgCardStyles, seasonalCardStyles];

export const componentControlStyles = css`
  :host {
    color: var(--primary-text-color, #1a1a2e);
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
  }

  input,
  select,
  textarea,
  button {
    font-family: inherit;
    color: inherit;
  }

  input[type='text'],
  input[type='number'],
  input[type='time'],
  select,
  textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 20%, transparent);
  }

  button {
    border-radius: 8px;
  }
`;

/* ================================================================== */
/*  EDITOR STYLES                                                      */
/* ================================================================== */
const editorLocalStyles = css`
  :host {
    display: block;
  }

  .mc-editor {
    padding: 20px;
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    color: var(--mc-text);
  }

  .mc-mode-help {
    margin: 0 0 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    line-height: 1.5;
    max-width: 60ch;
  }

  /* Toolbar */
  .mc-editor-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-toolbar-spacer {
    flex: 1;
  }

  .mc-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--mc-text-secondary);
    transition: all 0.15s;
  }

  .mc-toolbar-btn:hover:not(:disabled) {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-toolbar-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .mc-editor-toolbar .mc-btn {
    height: 32px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-linked-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    height: 32px;
    color: var(--mc-primary);
    background: var(--mc-primary-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-toolbar-template-name {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-linked-indicator:hover {
    filter: brightness(0.95);
  }

  .mc-linked-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 0 0 2px var(--mc-bg);
  }

  /* Linked template popup */
  .mc-linked-popup {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    min-width: 220px;
    z-index: 100;
  }

  .mc-linked-popup-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-linked-popup-sync-summary {
    padding: 8px 0;
    margin-bottom: 4px;
    border-top: 1px solid var(--mc-border);
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-sync-summary-header {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--warning-color, #ff9800);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .mc-sync-summary-header.synced {
    color: var(--success-color, #4caf50);
    margin-bottom: 0;
  }

  .mc-sync-summary-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 150px;
    overflow-y: auto;
  }

  .mc-sync-summary-item {
    display: flex;
    flex-direction: column;
    padding: 3px 0 3px 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-sync-summary-location {
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-sync-summary-paths {
    color: var(--secondary-text-color, #666);
  }

  .mc-linked-popup-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-linked-popup-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
    transition: background 0.15s;
    width: 100%;
    text-align: left;
  }

  .mc-linked-popup-btn:hover {
    background: var(--mc-border);
  }

  .mc-linked-popup-btn.danger {
    color: var(--error-color, #f44336);
  }

  .mc-linked-popup-btn.danger:hover {
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
  }

  /* Toolbar container for popup positioning */
  .mc-toolbar-linked-container {
    position: relative;
  }

  .mc-selected-context {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: none;
    border-left: 3px solid var(--mc-primary);
    border-radius: 6px;
    background: var(--mc-primary-light);
    margin-bottom: 12px;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
  }

  .mc-selected-context ha-icon {
    color: var(--mc-primary);
    flex-shrink: 0;
  }

  .mc-selected-context strong {
    font-weight: 600;
    color: var(--mc-primary);
  }

  /* Settings Panel */
  .mc-settings-panel {
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    overflow: hidden;
    margin-top: 12px;
  }

  .mc-settings-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: var(--mc-primary-light);
    border-bottom: 1px solid var(--mc-border);
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-settings-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-settings-tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    text-align: center;
  }

  .mc-settings-tab.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-settings-tab:hover:not(.active) {
    color: var(--mc-text);
  }

  .mc-settings-content {
    padding: 16px;
  }

  .mc-bp-xs,
  .mc-bp-sm {
    padding: 14px;
  }

  .mc-bp-xs .mc-editor-toolbar,
  .mc-bp-sm .mc-editor-toolbar {
    gap: 6px;
    margin-bottom: 10px;
  }

  .mc-bp-xs .mc-btn,
  .mc-bp-sm .mc-btn {
    padding: 8px 10px;
  }

  /* Shared Form Styles */
  .mc-tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mc-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-section-header {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--mc-border);
    margin-top: 12px;
  }

  .mc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-field-label {
    font-size: var(--mc-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mc-field input[type='text'],
  .mc-field input[type='number'],
  .mc-field select,
  .mc-field textarea {
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .mc-field input:focus,
  .mc-field select:focus,
  .mc-field textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-field-toggle {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mc-field-toggle input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: var(--mc-primary);
  }

  .mc-field-hint {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    font-style: italic;
  }

  .mc-field-hint-tight {
    margin-top: -4px;
    margin-bottom: 8px;
  }

  .mc-field-hint-with-margin {
    margin-bottom: 8px;
  }

  .mc-entity-field {
    position: relative;
  }

  .mc-entity-field input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-entity-field input:focus {
    border-color: var(--mc-primary);
  }

  /* Buttons */
  .mc-btn {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    transition: all 0.15s;
  }

  .mc-btn-primary {
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-btn-primary:hover {
    filter: brightness(1.1);
  }

  .mc-btn-secondary {
    background: var(--mc-surface-recessed);
    color: var(--mc-text);
  }

  .mc-btn-secondary:hover {
    background: color-mix(in srgb, var(--mc-text) 10%, transparent);
  }

  .mc-btn-compact {
    padding: 4px 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    font-size: 1rem;
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-option-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  .mc-option-row .mc-field {
    flex: 1;
  }

  .mc-card-editor-section {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-card-editor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
  }

  .mc-card-editor-icon {
    --mdc-icon-size: 16px;
  }

  .mc-card-editor-body {
    padding: 16px;
  }

  .mc-card-editor-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .mc-card-editor-toggle:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mc-yaml-fallback textarea {
    width: 100%;
    min-height: 200px;
    font-family: monospace;
    font-size: 0.8125rem;
    resize: vertical;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    box-sizing: border-box;
  }

  .mc-yaml-fallback textarea:focus {
    outline: none;
    border-color: var(--primary-color, #6366f1);
  }

  .mc-yaml-fallback-note {
    margin-bottom: 8px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-yaml-fallback-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
    margin-top: 4px;
  }

  .mc-yaml-fallback-help {
    margin-top: 4px;
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-editor-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: var(--secondary-text-color, #757575);
    font-size: 0.875rem;
  }

  /* Editor skeleton (loading state) */
  @keyframes mc-skel-shimmer {
    0%   { background-position: -240px 0; }
    100% { background-position: calc(240px + 100%) 0; }
  }

  .mc-skel {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 25%,
      color-mix(in srgb, var(--mc-text) 10%, transparent) 50%,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 75%
    );
    background-size: 240px 100%;
    background-repeat: no-repeat;
    background-color: var(--mc-surface-recessed);
    border-radius: 6px;
    animation: mc-skel-shimmer 1.4s ease-in-out infinite;
  }

  .mc-skel-switcher {
    height: 44px;
    border-radius: var(--mc-radius-md);
    margin-bottom: 8px;
  }

  .mc-skel-line {
    height: 12px;
    margin-bottom: 20px;
  }

  .mc-skel-line-short {
    width: 60%;
  }

  .mc-skel-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-skel-spacer {
    flex: 1;
  }

  .mc-skel-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  .mc-skel-pill {
    width: 100px;
    height: 32px;
    border-radius: 8px;
  }

  .mc-skel-card-header {
    height: 44px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .mc-skel-row {
    height: 96px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  /* Condition items */
  .mc-condition-item {
    padding: 16px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  .mc-condition-item .mc-btn-icon {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .mc-conditions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 8px 0;
  }

  /* Conditional Appearance section */
  .mc-cond-appearance-section {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-cond-appearance-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--mc-text, var(--primary-text-color));
  }

  .mc-cond-appearance-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--primary-color, #6366f1);
  }

  .mc-cond-appearance-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-cond-appearance-rule {
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 4%, transparent);
    overflow: hidden;
  }

  .mc-cond-appearance-rule.expanded {
    border-color: color-mix(in srgb, var(--primary-color, #6366f1) 30%, var(--mc-border, var(--divider-color, #e5e7eb)));
  }

  .mc-cond-appearance-rule-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
  }

  .mc-cond-appearance-rule-header:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-cond-appearance-rule-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary, var(--secondary-text-color));
  }

  .mc-cond-appearance-rule-name {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--mc-text, var(--primary-text-color));
    padding: 4px 6px;
    border-radius: 4px;
    min-width: 0;
  }

  .mc-cond-appearance-rule-name:hover,
  .mc-cond-appearance-rule-name:focus {
    background: var(--mc-bg, var(--card-background-color, #fff));
    outline: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-count {
    font-size: 0.7rem;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    padding: 2px 6px;
    background: var(--mc-bg, var(--card-background-color, #fff));
    border-radius: 10px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--mc-bg, var(--card-background-color, #fff));
  }

  .mc-cond-appearance-subhead {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    margin-top: 6px;
  }

  .mc-cond-appearance-subhead:first-child {
    margin-top: 0;
  }

  /* Action config */
  .mc-action-config {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    // border: 1px solid var(--mc-border);
    border-radius: 6px;
  }

  /* Card Settings Modal */
  .mc-modal {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 480px;
    max-width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .mc-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  .mc-modal-header ha-icon {
    color: var(--primary-color, #6366f1);
    --mdc-icon-size: 24px;
  }

  .mc-modal-title {
    flex: 1;
    font-size: var(--ha-font-size-l, 1.25rem);
    font-weight: 600;
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    border-radius: 6px;
    font-size: 1.5rem;
    line-height: 1;
  }

  .mc-modal-close:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .mc-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--divider-color, #e5e7eb);
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  /* Font-family inherit */
  /* Input focus ring enhancement */
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible,
  .mc-entity-field input:focus-visible,
  .mc-card-name-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`;

// editorSystem comes last so the Studio field look wins over the local rules.
export const editorStyles = [mcVariables, componentControlStyles, editorLocalStyles, ...editorSystem];

/* ================================================================== */
/*  PICKER STYLES                                                      */
/* ================================================================== */
const pickerLocalStyles = css`
  /* Shared picker field + picker modal shell. Use as [editorSystem, pickerStyles]. */
  :host {
    display: block;
    min-width: 0;
  }

  /* ── Closed field: value (or input) + select button ───────────── */
  .mc-picker-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
    min-width: 0;
  }

  .mc-picker-row > .input,
  .mc-picker-row > .mc-picker-value {
    flex: 1 1 auto;
    min-width: 0;
  }

  .mc-picker-row > .btn {
    flex: none;
  }

  .mc-picker-value {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
    padding: 6px 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    text-align: left;
    transition: border-color 0.15s ease-out;
  }

  .mc-picker-value:hover {
    border-color: var(--mc-text-2);
  }

  .mc-picker-value > ha-icon {
    flex: none;
    --mdc-icon-size: 20px;
    color: var(--mc-text-2);
  }

  .mc-picker-value-text {
    flex: 1;
    min-width: 0;
    display: grid;
    line-height: 1.35;
  }

  .mc-picker-value-name {
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }

  .mc-picker-value-id {
    font-family: var(--mc-mono);
    font-size: 0.75rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
  }

  .mc-picker-value .dot {
    background: var(--mc-success);
  }

  .mc-picker-value .dot.is-off {
    background: var(--mc-field-border);
  }

  .mc-picker-value .dot.is-unavailable {
    background: var(--mc-error-ink);
  }

  /* ── Overlay / backdrop ────────────────────────────────────────── */
  /* A <dialog> shown with showModal() (PickerDialogController): in the top layer it is fixed to the
     viewport even inside HA's transformed dialog. The UA dialog box (fit-content, auto margins,
     border, padding, max sizes) is reset so it covers the viewport like the old overlay did. */
  .mc-picker-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;
    margin: 0;
    border: 0;
    padding: 16px;
    overflow: hidden;
    color: inherit;
    background: rgba(0, 0, 0, 0.38);
    /* Scrolling past a list's end must not scroll the HA dialog / dashboard behind. */
    overscroll-behavior: contain;
  }

  .mc-picker-overlay:not([open]) {
    display: none;
  }

  .mc-picker-overlay::backdrop {
    background: transparent;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-picker-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--mc-picker-width, 440px);
    max-width: 100%;
    max-height: min(80vh, 720px);
    overflow: hidden;
    background: var(--mc-surface);
    color: var(--mc-text);
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* The window takes focus when it opens (role=dialog); its controls show their own focus rings. */
  .mc-picker-modal:focus {
    outline: none;
  }

  /* ── Header: title + icon buttons ──────────────────────────────── */
  .mc-picker-header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 12px 12px 20px;
    border-bottom: 1px solid var(--mc-divider);
    cursor: grab;
    user-select: none;
  }

  .mc-picker-header:active {
    cursor: grabbing;
  }

  .mc-picker-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.3;
  }

  /* ── Toolbar rows under the header (search, filters, breadcrumbs) ─ */
  .mc-picker-search {
    padding: 12px 16px;
    display: grid;
    gap: 12px;
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-picker-search .input {
    min-height: 40px;
  }

  /* ── Scrollable list ───────────────────────────────────────────── */
  .mc-picker-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 8px;
    display: grid;
    align-content: start;
    gap: 2px;
  }

  .mc-picker-category,
  .mc-picker-domain {
    padding: 12px 12px 4px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text-2);
  }

  .mc-picker-category:first-child,
  .mc-picker-domain:first-child {
    padding-top: 4px;
  }

  /* ── List row ──────────────────────────────────────────────────── */
  .mc-picker-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 6px 12px;
    border: 1px solid transparent;
    border-radius: var(--mc-radius);
    background: transparent;
    color: var(--mc-text);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.15s ease-out;
  }

  .mc-picker-item:hover {
    background: var(--mc-surface-2);
  }

  .mc-picker-item.selected,
  .mc-picker-item[aria-selected='true'] {
    background: var(--mc-accent-tint);
    border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
  }

  .mc-picker-item:focus-visible {
    outline-offset: -2px;
  }

  .mc-picker-item-icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    color: var(--mc-text-2);
    --mdc-icon-size: 20px;
  }

  .mc-picker-item.selected .mc-picker-item-icon,
  .mc-picker-item[aria-selected='true'] .mc-picker-item-icon {
    color: var(--mc-accent-ink);
  }

  .mc-picker-item-content {
    flex: 1;
    min-width: 0;
    display: grid;
    line-height: 1.35;
  }

  .mc-picker-item-name {
    font-size: 0.875rem;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .mc-picker-item-id {
    font-family: var(--mc-mono);
    font-size: 0.75rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
  }

  .mc-picker-item-desc,
  .mc-picker-item-meta {
    font-size: 0.75rem;
    color: var(--mc-text-2);
    margin-top: 2px;
  }

  .mc-picker-item-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mc-picker-item > .chip {
    flex: none;
    max-width: 40%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-thumb {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: var(--mc-radius);
    object-fit: cover;
    background: var(--mc-surface-2);
  }

  .mc-picker-item-actions {
    display: flex;
    gap: 2px;
    flex: none;
  }

  .mc-picker-item-chev {
    flex: none;
    --mdc-icon-size: 20px;
    color: var(--mc-text-2);
  }

  /* ── Breadcrumbs (media picker) ────────────────────────────────── */
  .mc-picker-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 12px;
    border-bottom: 1px solid var(--mc-divider);
    overflow-x: auto;
    white-space: nowrap;
    flex-shrink: 0;
    --mdc-icon-size: 16px;
  }

  .mc-picker-breadcrumbs > ha-icon {
    color: var(--mc-text-2);
    flex: none;
  }

  .mc-breadcrumb-current {
    padding: 0 8px;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  /* ── Empty / loading states ────────────────────────────────────── */
  .mc-picker-empty,
  .mc-picker-loading {
    padding: 32px 16px;
    text-align: center;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }

  /* ── Footer ────────────────────────────────────────────────────── */
  .mc-picker-footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--mc-divider);
  }

  /* ── Positioned modal (after first drag/resize) ─────────────── */
  .mc-modal--positioned {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
  }

  /* ── Maximized modal ────────────────────────────────────────── */
  .mc-modal--maximized {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
    transition: left 0.2s ease-out, top 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
    opacity: 0.35;
    border-radius: 0 0 16px 0;
    background: linear-gradient(135deg, transparent 50%, var(--mc-text-2) 50%);
  }

  .mc-modal-resize-handle:hover {
    opacity: 0.7;
  }
`;

export const pickerStyles = pickerLocalStyles;

/* ================================================================== */
/*  MODULE SELECTOR STYLES                                             */
/* ================================================================== */
export const moduleSelectorStyles = css`
  :host {
    --mc-picker-width: 480px;
  }

  .mc-picker-header {
    cursor: default;
  }
`;

/* ================================================================== */
/*  YAML EDITOR STYLES                                                 */
/* ================================================================== */
export const yamlEditorStyles = css`
  :host {
    display: block;
  }

  .mc-yaml-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 300px;
  }

  .mc-yaml-editor-wrapper {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .mc-yaml-textarea {
    width: 100%;
    min-height: 300px;
    padding: 12px;
    border: none;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: var(--ha-font-size-s, 0.875rem);
    line-height: 1.5;
    resize: vertical;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    tab-size: 2;
    box-sizing: border-box;
  }

  .mc-yaml-error {
    padding: 8px 12px;
    background: color-mix(in srgb, var(--error-color, #ef4444) 10%, transparent);
    color: var(--error-color, #ef4444);
    border-radius: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-yaml-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    padding: 4px 0;
  }

  .mc-yaml-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success-color, #22c55e);
  }

  .mc-yaml-status-dot.error {
    background: var(--error-color, #ef4444);
  }
`;

/* ================================================================== */
/*  TEMPLATE PICKER STYLES (with stale var fixes)                      */
/* ================================================================== */
export const templatePickerStyles = css`
  .mc-template-form {
    display: grid;
    gap: 16px;
    padding: 16px 20px;
  }

  .mc-template-error {
    font-size: 0.8125rem;
    color: var(--mc-error-ink);
  }

  .mc-template-overwrite {
    font-size: 0.8125rem;
    color: var(--mc-warn-ink);
  }

  .mc-template-confirm {
    display: grid;
    gap: 8px;
    padding: 12px 16px;
    background: var(--mc-surface-2);
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-template-confirm-text {
    font-size: 0.8125rem;
  }

  .mc-template-confirm-actions,
  .mc-template-edit-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .mc-template-edit-form {
    display: grid;
    gap: 12px;
    padding: 16px;
    background: var(--mc-surface-2);
    border-bottom: 1px solid var(--mc-divider);
  }

  .mc-template-edit-form textarea.input,
  .mc-template-form textarea.input {
    min-height: 64px;
    font-family: inherit;
    font-size: 0.875rem;
  }
`;

/* ================================================================== */
/*  ICON PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const iconPickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }

  /* Keyboard-highlighted row (arrow keys in the search field). */
  .mc-picker-item.is-active {
    background: var(--mc-surface-2);
    border-color: var(--mc-field-border);
  }

  .mc-picker-item.is-active[aria-selected='true'] {
    background: var(--mc-accent-tint);
    border-color: var(--mc-accent);
  }

  .mc-picker-more {
    padding: 8px 12px 4px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
    text-align: center;
  }

  .mc-picker-footer .spacer {
    flex: 1;
  }

  .mc-picker-footer .clear {
    margin-left: -8px;
  }
`;

/* ================================================================== */
/*  MEDIA PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const mediaPickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }
`;

/* ================================================================== */
/*  FONT PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const fontPickerStyles = css`
  :host {
    --mc-picker-width: 500px;
  }

  .mc-font-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 64px;
    margin: 12px 16px 0;
    padding: 12px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface-2);
    text-align: center;
  }

  .mc-font-preview-text {
    font-size: 1.5rem;
    line-height: 1.3;
    color: var(--mc-text);
    overflow-wrap: anywhere;
  }
`;

/* ================================================================== */
/*  SERVICE PICKER STYLES (with stale var fixes)                       */
/* ================================================================== */
export const servicePickerStyles = css`
  :host {
    --mc-picker-width: 480px;
  }
`;

/* ================================================================== */
/*  COLOR PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const colorPickerStyles = css`
  :host {
    --mc-picker-width: 340px;
  }

  /* ── Color field: swatch + text input ──────────────────────── */
  .swatch {
    position: relative;
    overflow: hidden;
    padding: 3px;
  }

  .swatch-fill {
    position: absolute;
    inset: 3px;
    border-radius: 5px;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .swatch-fill > span {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .swatch:disabled {
    cursor: default;
  }

  /* Entity colour toggle (design colour fields of a module with an entity) */
  .entity-toggle[aria-pressed='true'],
  .entity-toggle[aria-pressed='true']:hover {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }

  .entity-opacity {
    margin-top: 8px;
  }

  /* ── Popup body ────────────────────────────────────────────── */
  .mc-color-body {
    display: grid;
    gap: 16px;
    padding: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .mc-color-area {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: var(--mc-radius);
    cursor: crosshair;
    touch-action: none;
  }

  .mc-color-area-gradient {
    position: absolute;
    inset: 0;
    border-radius: var(--mc-radius);
    background: linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent);
  }

  .mc-color-area-pointer,
  .mc-slider-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .mc-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mc-slider-label {
    width: 16px;
    flex: none;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-text-2);
  }

  .mc-slider-track {
    position: relative;
    flex: 1;
    height: 12px;
    border-radius: 9999px;
    cursor: pointer;
    touch-action: none;
  }

  .mc-slider-thumb {
    top: 50%;
  }

  .mc-hue-track {
    background: linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
  }

  .mc-opacity-track {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  }

  .mc-opacity-gradient {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .mc-slider-row > .input {
    flex: none;
    width: 64px;
    min-height: 32px;
    padding: 4px 8px;
    text-align: center;
  }

  .mc-input-row {
    display: grid;
    grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .mc-input-row .field {
    gap: 4px;
  }

  .mc-input-row .lbl {
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }

  .mc-input-row .input {
    min-width: 0;
    padding: 8px;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }

  .mc-color-section {
    display: grid;
    gap: 8px;
  }

  .mc-color-section-header {
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .mc-color-grid {
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 4px;
  }

  .mc-color-swatch,
  .mc-saved-swatch {
    position: relative;
    padding: 0;
    border: 1px solid var(--mc-divider);
    border-radius: 6px;
  }

  .mc-color-swatch {
    aspect-ratio: 1;
  }

  .mc-color-swatch:hover,
  .mc-saved-swatch:hover {
    border-color: var(--mc-text-2);
  }

  .mc-color-swatch.var-color {
    display: grid;
    place-items: center;
    overflow: hidden;
    font-size: 0.625rem;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .mc-saved-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .mc-saved-swatch {
    width: 32px;
    height: 32px;
  }

  .mc-saved-pick {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 0;
    border-radius: inherit;
    background: transparent;
  }

  .mc-saved-pick:focus-visible {
    outline-offset: 1px;
  }

  .mc-saved-swatch .mc-remove-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    display: none;
    place-items: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid var(--mc-divider);
    border-radius: 50%;
    background: var(--mc-surface);
    color: var(--mc-text-2);
    --mdc-icon-size: 12px;
  }

  .mc-saved-swatch:hover .mc-remove-btn,
  .mc-saved-swatch:focus-within .mc-remove-btn {
    display: grid;
  }

  .mc-saved-swatch .mc-remove-btn:hover {
    color: var(--mc-error-ink);
  }
`;

