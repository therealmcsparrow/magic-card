import { css } from 'lit';
import { mcVariables } from './tokens';

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

  .mc-row {
    display: grid;
    gap: var(--mc-gap);
    align-items: start;
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
    word-break: break-word;
  }

  .mc-text {
    font-size: var(--mc-font-size, inherit);
  }

  .mc-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mc-icon ha-icon {
    --mdc-icon-size: var(--mc-icon-size, 24px);
  }

  .mc-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-info-name {
    font-weight: 500;
    font-size: var(--mc-font-size-md);
    color: var(--mc-text);
  }

  .mc-info-state {
    font-size: var(--mc-font-size-xl);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-info-secondary {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-text-secondary);
  }

  .mc-image {
    width: 100%;
    overflow: hidden;
  }

  .mc-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
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
    color: var(--mc-text-secondary);
    white-space: nowrap;
  }

  /* Bar horizontal layout */
  .mc-bar-horizontal {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  .mc-bar-horizontal .mc-bar-track {
    flex: 1;
    border-radius: var(--mc-bar-radius);
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
    border-radius: var(--mc-bar-radius);
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
    border-radius: var(--mc-button-radius);
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    color: var(--mc-text);
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
    border-radius: var(--mc-button-radius);
    border: none;
    background: var(--mc-button-color);
    color: var(--mc-button-text-color);
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
  }

  .mc-button-inner ha-icon {
    --mdc-icon-size: var(--mc-button-icon-size);
  }

  .mc-button-inner--default {
    background: var(--mc-button-color);
    color: var(--mc-button-text-color);
    border: none;
  }

  .mc-button-inner--outline {
    background: transparent;
    color: var(--mc-button-color);
    border: 1px solid var(--mc-button-color);
  }

  .mc-button-inner--flat {
    background: transparent;
    color: var(--mc-button-color);
    border: none;
  }

  .mc-button-inner--icon-only {
    padding: var(--mc-button-padding-icon);
  }

  .mc-button-state {
    opacity: 0.8;
    font-size: var(--mc-font-size-xs);
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
    color: var(--mc-text-secondary);
  }

  /* Slider container layout */
  .mc-slider-container {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
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
    color: var(--mc-spinbox-btn-text-color);
    font-size: var(--mc-spinbox-btn-font-size);
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
  }

  .mc-spinbox-value {
    font-size: var(--mc-spinbox-value-font-size);
    font-weight: var(--mc-spinbox-value-font-weight);
    min-width: var(--mc-spinbox-value-min-width);
    text-align: center;
  }

  /* Dropdown */
  .mc-dropdown {
    width: 100%;
  }

  .mc-dropdown select {
    width: 100%;
    padding: var(--mc-dropdown-padding);
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-dropdown-radius);
    background: var(--mc-bg);
    color: var(--mc-text);
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
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-light-header {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-header ha-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-light--compact .mc-light-header ha-icon {
    --mdc-icon-size: var(--mc-icon-size-md);
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

  .mc-light-value {
    font-size: var(--mc-font-size-xs);
    min-width: 32px;
    text-align: right;
  }

  .mc-light-color-input {
    width: var(--mc-light-color-input-size);
    height: var(--mc-light-color-input-size);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .mc-slider {
    width: 100%;
    position: relative;
  }

  .mc-slider .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-slider .swiper-button-prev,
  .mc-slider .swiper-button-next {
    color: var(--mc-primary);
    --swiper-navigation-size: 24px;
  }

  .mc-slider .swiper-pagination-bullet-active {
    background: var(--mc-primary);
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
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all var(--mc-transition-duration);
  }

  .mc-tab-button.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-tab-button ha-icon {
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
    color: var(--text-primary-color, #fff);
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
    color: var(--mc-text-secondary);
  }

  /* Weather module */
  .mc-weather {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-weather > ha-icon {
    --mdc-icon-size: var(--mc-icon-size-xl);
  }

  .mc-weather-temp {
    font-size: 2rem;
    font-weight: 600;
  }

  .mc-weather-condition {
    font-size: var(--mc-font-size-md);
    color: var(--mc-text-secondary);
    text-transform: capitalize;
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

  .mc-forecast-item ha-icon {
    --mdc-icon-size: var(--mc-forecast-icon-size);
  }

  .mc-forecast-label {
    font-size: var(--mc-font-size-xs);
    color: var(--mc-text-secondary);
  }

  .mc-forecast-temp {
    font-size: var(--mc-font-size-md);
  }

  .mc-video-bg {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .mc-video-bg video {
    width: 100%;
    display: block;
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
  }

  .mc-camera img {
    width: 100%;
    display: block;
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
    font-size: var(--mc-font-size-xs);
    color: var(--mc-text-secondary);
    margin-top: var(--mc-gap-xs);
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

  /* Nested row module */
  .mc-nested-row {
    width: 100%;
    min-width: 0;
  }

  .mc-nested-col {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
    min-width: 0;
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

  .mc-module-wrapper[role='button'] {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mc-module-wrapper[role='button']:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
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

export const magicCardStyles = [mcVariables, magicCardLocalStyles];

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

  /* Mode Switcher */
  .mc-mode-switcher {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
    background: var(--mc-surface-recessed);
    border-radius: var(--mc-radius-md);
    padding: 4px;
  }

  .mc-mode-btn {
    flex: 1;
    padding: 8px 14px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    transition: background 150ms ease, color 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .mc-mode-btn.active {
    background: var(--mc-bg);
    color: var(--mc-primary);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 0 0 1px color-mix(in srgb, var(--mc-primary) 10%, transparent);
  }

  .mc-mode-btn:hover:not(.active) {
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
    justify-content: center;
    position: relative;
    width: 32px;
    height: 32px;
    color: var(--mc-primary);
    background: var(--mc-primary-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
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
    right: 0;
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

  /* Sync confirmation dialog */
  .mc-sync-dialog {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 16px;
  }

  .mc-sync-dialog-content {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 360px;
    max-width: 100%;
    padding: 20px;
  }

  .mc-sync-dialog-title {
    font-size: var(--ha-font-size-m, 1rem);
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-sync-dialog-text {
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--secondary-text-color);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .mc-sync-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
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

  .mc-bp-xs .mc-mode-switcher,
  .mc-bp-sm .mc-mode-switcher {
    margin-bottom: 14px;
  }

  .mc-bp-xs .mc-mode-btn,
  .mc-bp-sm .mc-mode-btn {
    font-size: var(--ha-font-size-xs, 0.75rem);
    padding: 8px 10px;
    gap: 5px;
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

  .mc-section-header-split {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mc-section-header-actions {
    display: flex;
    gap: 4px;
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

  .mc-inline-field-row {
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .mc-editor-tab-switcher {
    margin-bottom: 8px;
  }

  .mc-child-module-item {
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    margin-bottom: 4px;
    overflow: hidden;
  }

  .mc-child-module-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    cursor: pointer;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .mc-child-module-title {
    flex: 1;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-child-module-body {
    padding: 8px;
    border-top: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-child-module-add-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }

  .mc-child-module-select {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    font-size: var(--ha-font-size-s, 0.875rem);
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
  .mc-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

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
  .mc-btn,
  .mc-btn-primary,
  .mc-btn-secondary,
  .mc-btn-icon,
  .mc-toolbar-btn,
  .mc-mode-btn,
  .mc-settings-tab,
  .mc-linked-popup-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-btn:focus-visible,
  .mc-btn-primary:focus-visible,
  .mc-btn-secondary:focus-visible,
  .mc-btn-icon:focus-visible,
  .mc-toolbar-btn:focus-visible,
  .mc-linked-indicator:focus-visible,
  .mc-mode-btn:focus-visible,
  .mc-settings-tab:focus-visible,
  .mc-linked-popup-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-btn:active,
  .mc-btn-primary:active,
  .mc-btn-secondary:active,
  .mc-btn-icon:active,
  .mc-toolbar-btn:active,
  .mc-mode-btn:active,
  .mc-settings-tab:active,
  .mc-linked-popup-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Font-family inherit */
  .mc-mode-btn {
    font-family: inherit;
  }

  /* Input focus ring enhancement */
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible,
  .mc-entity-field input:focus-visible,
  .mc-card-name-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }

  /* Modal backdrop blur */
  .mc-modal-overlay {
    backdrop-filter: blur(4px);
  }
`;

export const editorStyles = [mcVariables, componentControlStyles, editorLocalStyles];

/* ================================================================== */
/*  PICKER STYLES                                                      */
/* ================================================================== */
const pickerLocalStyles = css`
  :host {
    display: block;
  }

  /* ── Inline row (input + select button) ────────────────────────── */
  .mc-picker-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .mc-picker-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    min-width: 0;
    box-sizing: border-box;
  }

  .mc-picker-input:focus {
    border-color: var(--mc-primary);
  }

  .mc-picker-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border: 1px solid var(--mc-modal-btn-bg);
    border-radius: var(--mc-modal-btn-radius);
    background: var(--mc-modal-btn-bg);
    color: var(--mc-modal-btn-color);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    gap: 6px;
  }

  .mc-picker-btn:hover {
    filter: brightness(1.1);
  }

  .mc-picker-btn ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Overlay / backdrop ────────────────────────────────────────── */
  .mc-picker-overlay {
    position: fixed;
    inset: 0;
    background: var(--mc-modal-overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--mc-modal-z-index);
    padding: 16px;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-picker-modal {
    background: var(--mc-bg);
    border-radius: var(--mc-modal-radius);
    box-shadow: var(--mc-modal-shadow);
    width: var(--mc-modal-width);
    max-width: 100%;
    max-height: var(--mc-modal-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .mc-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-modal-header-bg);
    cursor: grab;
    user-select: none;
  }

  .mc-picker-header:active { cursor: grabbing; }
  .mc-picker-header button { cursor: pointer; }

  .mc-picker-header-start {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .mc-picker-header ha-icon {
    color: var(--mc-primary);
    --mdc-icon-size: 24px;
  }

  .mc-picker-title {
    flex: 1;
    font-size: var(--ha-font-size-m, 1rem);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-picker-close,
  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    font-size: 1.25rem;
    line-height: 1;
    font-family: inherit;
    flex-shrink: 0;
  }

  .mc-picker-close:hover,
  .mc-modal-close:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-picker-header-end {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  /* ── Search bar ────────────────────────────────────────────────── */
  .mc-picker-search {
    padding: 14px 16px;
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-picker-search input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: var(--ha-font-size-s, 0.875rem);
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
  }

  .mc-picker-search input:focus {
    border-color: var(--mc-primary);
  }

  /* ── Scrollable list ───────────────────────────────────────────── */
  .mc-picker-list {
    flex: 1;
    overflow-y: auto;
    max-height: var(--mc-modal-list-max-height);
  }

  /* ── Category / domain sticky header ───────────────────────────── */
  .mc-picker-category,
  .mc-picker-domain {
    padding: 10px 16px 6px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc-text-secondary);
    background: var(--mc-bg);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  /* ── List item ─────────────────────────────────────────────────── */
  .mc-picker-item {
    display: flex;
    align-items: center;
    gap: var(--mc-modal-item-gap);
    padding: var(--mc-modal-item-padding);
    cursor: pointer;
    transition: background 0.1s;
    border-bottom: var(--mc-modal-item-border);
  }

  .mc-picker-item:last-child {
    border-bottom: none;
  }

  .mc-picker-item:hover {
    background: var(--mc-modal-item-hover-bg);
  }

  .mc-picker-item.selected {
    background: color-mix(in srgb, var(--mc-primary) 15%, transparent);
  }

  /* ── Item icon ─────────────────────────────────────────────────── */
  .mc-picker-item-icon {
    width: var(--mc-modal-item-icon-size);
    height: var(--mc-modal-item-icon-size);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mc-modal-item-icon-bg);
    border-radius: var(--mc-modal-item-icon-radius);
    color: var(--mc-primary);
    --mdc-icon-size: 20px;
    flex-shrink: 0;
  }

  /* ── Item content ──────────────────────────────────────────────── */
  .mc-picker-item-content {
    flex: 1;
    min-width: 0;
  }

  .mc-picker-item-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-id {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-desc {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    margin-top: 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mc-picker-item-meta {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
  }

  /* ── Badges / state chips ──────────────────────────────────────── */
  .mc-picker-item-badge,
  .mc-picker-item-state {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--mc-text-secondary);
    background: var(--mc-border);
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }

  /* ── Thumbnails (media picker) ─────────────────────────────────── */
  .mc-picker-item-thumb {
    width: var(--mc-modal-item-icon-size);
    height: var(--mc-modal-item-icon-size);
    border-radius: var(--mc-modal-input-radius);
    object-fit: cover;
    background: var(--mc-border);
    flex-shrink: 0;
  }

  /* ── Breadcrumbs (media picker) ────────────────────────────────── */
  .mc-picker-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--mc-border);
    font-size: var(--ha-font-size-s, 0.875rem);
    overflow-x: auto;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mc-breadcrumb {
    color: var(--mc-primary);
    cursor: pointer;
    border: none;
    background: none;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: var(--ha-font-size-s, 0.875rem);
    white-space: nowrap;
  }

  .mc-breadcrumb:hover {
    background: color-mix(in srgb, var(--mc-primary) 12%, transparent);
  }

  .mc-breadcrumb-sep {
    color: var(--mc-text-secondary);
  }

  .mc-breadcrumb-current {
    color: var(--mc-text);
    font-weight: 500;
    padding: 2px 4px;
    white-space: nowrap;
  }

  /* ── Empty / loading states ────────────────────────────────────── */
  .mc-picker-empty,
  .mc-picker-loading {
    padding: 32px;
    text-align: center;
    color: var(--mc-text-secondary);
  }

  /* ── Entity info row (entity picker inline preview) ────────────── */
  .mc-picker-entity-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    background: var(--mc-bg);
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .mc-picker-entity-info:hover {
    border-color: var(--mc-primary);
  }

  .mc-picker-entity-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--mc-modal-item-icon-bg);
    color: var(--mc-primary);
    flex-shrink: 0;
    --mdc-icon-size: 16px;
  }

  .mc-picker-entity-details {
    flex: 1;
    min-width: 0;
  }

  .mc-picker-entity-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .mc-picker-entity-id {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--mc-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  /* ── Icon preview (icon picker inline) ─────────────────────────── */
  .mc-picker-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    flex-shrink: 0;
    border: 1px solid var(--mc-border);
    border-right: none;
    border-radius: var(--mc-modal-input-radius) 0 0 var(--mc-modal-input-radius);
    color: var(--mc-primary);
    --mdc-icon-size: 22px;
  }

  /* ── Footer (buttons at bottom) ───────────────────────────────── */
  .mc-picker-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 16px;
    border-top: 1px solid var(--mc-border);
  }

  /* ── Action buttons (save / cancel) ────────────────────────────── */
  .action-btn {
    border-radius: var(--mc-modal-btn-radius);
    padding: 10px 14px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--ha-font-size-s, 0.875rem);
    transition: all 0.15s;
  }

  .save-btn {
    background-color: var(--mc-modal-save-bg);
    color: var(--mc-modal-save-color);
  }

  .save-btn:hover {
    filter: brightness(1.1);
  }

  .save-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .cancel-btn {
    background-color: var(--mc-modal-cancel-bg);
    color: var(--mc-modal-cancel-color);
  }

  .cancel-btn:hover {
    filter: brightness(1.1);
  }

  /* ── Item action buttons ───────────────────────────────────────── */
  .mc-picker-item-actions {
    display: flex;
    gap: 4px;
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
    transition: all 0.2s ease;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    z-index: 10;
    opacity: 0.3;
    border-radius: 0 0 12px 0;
    background: linear-gradient(135deg, transparent 50%, currentColor 50%);
  }

  .mc-modal-resize-handle:hover { opacity: 0.6; }

  /* ── Maximize button ────────────────────────────────────────── */
  .mc-modal-maximize-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mc-text-secondary, var(--secondary-text-color, #757575));
  }

  .mc-modal-maximize-btn:hover {
    background: var(--mc-border, var(--divider-color, #e0e0e0));
  }

  .mc-modal-maximize-btn ha-icon { --mdc-icon-size: 18px; }

  /* Scrollbar styling */
  .mc-picker-list {
    scrollbar-width: thin;
    scrollbar-color: var(--mc-border) transparent;
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-picker-btn,
  .action-btn {
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }

  .mc-picker-btn:focus-visible,
  .action-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-picker-btn:active,
  .action-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Input focus ring enhancement */
  .mc-picker-input:focus-visible,
  .mc-picker-search input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }

  /* Backdrop blur */
  .mc-picker-overlay {
    backdrop-filter: blur(4px);
  }
`;

export const pickerStyles = [mcVariables, componentControlStyles, pickerLocalStyles];

/* ================================================================== */
/*  MODAL STYLES                                                       */
/* ================================================================== */
const modalLocalStyles = css`
  :host {
    display: block;
  }

  /* ── Overlay ───────────────────────────────────────────────────── */
  .mc-modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--mc-modal-overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--mc-modal-z-index);
    padding: 16px;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-modal {
    background: var(--mc-bg);
    border-radius: var(--mc-modal-radius);
    box-shadow: var(--mc-modal-shadow);
    width: var(--mc-modal-width);
    max-width: 100%;
    max-height: var(--mc-modal-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .mc-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-modal-header-bg);
    cursor: grab;
    user-select: none;
  }

  .mc-modal-header:active { cursor: grabbing; }
  .mc-modal-header button { cursor: pointer; }

  .mc-modal-header ha-icon {
    color: var(--mc-primary);
    --mdc-icon-size: 24px;
  }

  .mc-modal-title {
    flex: 1;
    font-size: var(--ha-font-size-l, 1.25rem);
    font-weight: 600;
    color: var(--mc-text);
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
    color: var(--mc-text-secondary);
    border-radius: 6px;
    font-size: 1.5rem;
    line-height: 1;
  }

  .mc-modal-close:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  /* ── Body ──────────────────────────────────────────────────────── */
  .mc-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  /* ── Footer ────────────────────────────────────────────────────── */
  .mc-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--mc-border);
  }

  /* ── Tabs (inside modal) ───────────────────────────────────────── */
  .mc-modal-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-bg);
  }

  .mc-modal-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
  }

  .mc-modal-tab:hover {
    color: var(--mc-text);
    background: color-mix(in srgb, var(--mc-primary) 5%, transparent);
  }

  .mc-modal-tab.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-modal-tab ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Action buttons (reusable inside modals) ───────────────────── */
  .action-btn {
    border-radius: 6px;
    padding: 10px 14px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--ha-font-size-s, 0.875rem);
    transition: all 0.15s;
  }

  .save-btn {
    background-color: var(--success-color, #4caf50);
    color: var(--text-primary-color, #fff);
  }

  .save-btn:hover {
    filter: brightness(1.1);
  }

  .cancel-btn {
    background-color: var(--error-color, #f44336);
    color: var(--text-primary-color, #fff);
  }

  .cancel-btn:hover {
    filter: brightness(1.1);
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
    transition: all 0.2s ease;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    z-index: 10;
    opacity: 0.3;
    border-radius: 0 0 12px 0;
    background: linear-gradient(135deg, transparent 50%, currentColor 50%);
  }

  .mc-modal-resize-handle:hover { opacity: 0.6; }

  /* ── Maximize button ────────────────────────────────────────── */
  .mc-modal-maximize-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mc-text-secondary, var(--secondary-text-color, #757575));
  }

  .mc-modal-maximize-btn:hover {
    background: var(--mc-border, var(--divider-color, #e0e0e0));
  }

  .mc-modal-maximize-btn ha-icon { --mdc-icon-size: 18px; }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-modal-tab,
  .action-btn {
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }

  .mc-modal-tab:focus-visible,
  .action-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-modal-tab:active,
  .action-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Backdrop blur */
  .mc-modal-overlay {
    backdrop-filter: blur(4px);
  }
`;

export const modalStyles = [mcVariables, componentControlStyles, modalLocalStyles];

/* ================================================================== */
/*  DESIGN PANEL STYLES                                                */
/* ================================================================== */
const designPanelLocalStyles = css`
  :host {
    display: block;
  }

  .mc-design-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Search */
  .mc-design-search {
    position: relative;
    margin-bottom: 4px;
  }

  .mc-design-search ha-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mc-text-secondary);
    --mdc-icon-size: 18px;
    pointer-events: none;
  }

  .mc-design-search input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-design-search input:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-search input::placeholder {
    color: var(--mc-text-secondary);
  }

  /* Sectors */
  .mc-design-sector {
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    overflow: hidden;
  }

  .mc-design-sector-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    cursor: pointer;
    user-select: none;
    background: none;
    border: none;
    width: 100%;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    transition: background 0.15s;
  }

  .mc-design-sector-header:hover {
    background: var(--mc-primary-light);
  }

  .mc-design-sector-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary);
  }

  .mc-design-sector-header .sector-name {
    flex: 1;
    text-align: left;
  }

  .mc-design-sector-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    line-height: 1;
  }

  .mc-design-sector-chevron {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary);
    transition: transform 0.2s ease;
  }

  .mc-design-sector.open .mc-design-sector-chevron {
    transform: rotate(180deg);
  }

  .mc-design-sector-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
  }

  .mc-design-sector.open .mc-design-sector-body {
    max-height: 2000px;
  }

  .mc-design-sector-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-top: 1px solid var(--mc-border);
  }

  /* Property fields - inherit .mc-field patterns */
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

  /* Custom CSS section at bottom */
  .mc-design-custom-css {
    margin-top: 4px;
  }

  .mc-design-custom-css textarea {
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-family: 'Roboto Mono', 'Courier New', monospace;
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }

  .mc-design-custom-css textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-custom-css label {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    margin-bottom: 6px;
    display: block;
  }

  /* Empty state when search yields no results */
  .mc-design-empty {
    text-align: center;
    padding: 24px 16px;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  /* Conditional design views */
  .mc-design-views {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 4px;
    scrollbar-width: thin;
  }

  .mc-design-views::-webkit-scrollbar {
    height: 4px;
  }

  .mc-design-views::-webkit-scrollbar-thumb {
    background: var(--mc-border);
    border-radius: 2px;
  }

  .mc-design-view-tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 16px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .mc-design-view-tab:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-view-tab.active {
    background: var(--mc-primary);
    border-color: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-design-view-tab .tab-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: inherit;
    font-size: 10px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .mc-design-view-tab .tab-remove:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .mc-design-add-rule-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px dashed var(--mc-border);
    border-radius: 16px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .mc-design-add-rule-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-rule-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    margin-bottom: 8px;
  }

  .mc-design-rule-header .rule-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-design-rule-header .rule-name-row input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    box-sizing: border-box;
  }

  .mc-design-rule-header .rule-name-row input:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-rule-header .rule-mode-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
  }

  .mc-design-rule-header .rule-mode-row select {
    padding: 4px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
  }

  .mc-design-rule-conditions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }

  .mc-design-rule-conditions .conditions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-design-rule-conditions .add-condition-btn {
    padding: 4px 10px;
    border: 1px dashed var(--mc-border);
    border-radius: 6px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    cursor: pointer;
    transition: all 0.15s;
  }

  .mc-design-rule-conditions .add-condition-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-remove-rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    margin-top: 8px;
    border: 1px solid var(--error-color, #ef4444);
    border-radius: 6px;
    background: none;
    color: var(--error-color, #ef4444);
    font-size: var(--ha-font-size-s, 0.875rem);
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.15s;
  }

  .mc-design-remove-rule:hover {
    background: color-mix(in srgb, var(--error-color, #ef4444) 10%, transparent);
  }

  /* Smooth rotation for chevron */
  .mc-design-sector-chevron {
    will-change: transform;
  }

  /* Input focus ring enhancement */
  .mc-design-search input:focus-visible,
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`;

export const designPanelStyles = [mcVariables, componentControlStyles, designPanelLocalStyles];

/* ================================================================== */
/*  MODULE SELECTOR STYLES                                             */
/* ================================================================== */
export const moduleSelectorStyles = css`
  :host {
    display: block;
  }

  .mc-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-selector-dialog {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .mc-selector-header {
    display: flex;
    align-items: center;
    padding: 18px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    gap: 14px;
  }

  .mc-selector-header h3 {
    margin: 0;
    font-size: var(--ha-font-size-m, 1rem);
    flex: 1;
  }

  .mc-selector-search-wrap {
    padding: 8px 16px;
  }

  .mc-selector-search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    outline: none;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-selector-search:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-selector-body {
    overflow-y: auto;
    padding: 10px;
    flex: 1;
  }

  .mc-selector-category {
    padding: 4px 12px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color, #6b7280);
    margin-top: 8px;
  }

  .mc-selector-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    font-family: inherit;
  }

  .mc-selector-item:hover {
    background: var(--divider-color, #e5e7eb);
  }

  .mc-selector-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
    color: var(--primary-color, #6366f1);
  }

  .mc-selector-item-icon ha-icon {
    --mdc-icon-size: 20px;
  }

  .mc-selector-item-info {
    flex: 1;
    min-width: 0;
  }

  .mc-selector-item-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-selector-item-desc {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-selector-empty {
    padding: 16px;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-s, 0.875rem);
    text-align: center;
  }

  /* Scrollbar styling */
  .mc-selector-body {
    scrollbar-width: thin;
    scrollbar-color: var(--divider-color, #e5e7eb) transparent;
  }

  /* Search font-family */
  .mc-selector-search {
    font-family: inherit;
  }

  /* Focus ring for search */
  .mc-selector-search:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 25%, transparent);
  }

  /* Interactive feedback */
  .mc-selector-item {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-selector-item:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  /* Hover lift for selector items */
  .mc-selector-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Backdrop blur */
  .mc-selector-overlay {
    backdrop-filter: blur(4px);
  }
`;

/* ================================================================== */
/*  TREE EDITOR STYLES                                                 */
/* ================================================================== */
export const treeEditorStyles = css`
  :host {
    display: block;
  }

  .mc-tree {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-kbd-hint {
    margin-bottom: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-kbd-hint kbd {
    font-family: inherit;
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  .mc-tree-node {
    display: flex;
    flex-direction: column;
  }

  .mc-tree-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
  }

  .mc-tree-row:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  .mc-tree-row.selected {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
  }

  .mc-tree-row:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-tree-row.drop-target {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-tree-indent {
    display: inline-block;
    width: 20px;
    flex-shrink: 0;
  }

  .mc-tree-toggle {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    font-size: 0.625rem;
    flex-shrink: 0;
    transition: transform 0.15s;
  }

  .mc-tree-toggle.open {
    transform: rotate(90deg);
  }

  .mc-tree-icon {
    color: var(--primary-color, #6366f1);
    flex-shrink: 0;
  }

  .mc-tree-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }

  .mc-tree-type {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 1px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .mc-tree-badge {
    font-size: 0.625rem;
    padding: 1px 5px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .mc-tree-badge.condition {
    background: color-mix(in srgb, var(--warning-color, #f59e0b) 15%, transparent);
    color: var(--warning-color, #f59e0b);
  }

  .mc-tree-badge.action {
    background: color-mix(in srgb, var(--info-color, #3b82f6) 15%, transparent);
    color: var(--info-color, #3b82f6);
  }

  .mc-tree-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-tree-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .mc-tree-row:hover .mc-tree-actions {
    opacity: 1;
  }

  .mc-tree-action-btn {
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-tree-action-btn:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color);
  }

  .mc-tree-empty {
    padding: 16px;
    text-align: center;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  /* Drag handle */
  .mc-drag-handle {
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    opacity: 0;
    transition: opacity 0.1s;
  }

  .mc-tree-row:hover .mc-drag-handle {
    opacity: 0.5;
  }

  .mc-drag-handle:hover {
    opacity: 1 !important;
  }

  /* Smooth rotation for tree toggle */
  .mc-tree-toggle {
    will-change: transform;
  }

  /* Interactive feedback */
  .mc-tree-action-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-tree-action-btn:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
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
/*  FORM EDITOR STYLES                                                 */
/* ================================================================== */
export const formEditorStyles = css`
  :host {
    display: block;
  }

  .mc-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-rows-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-kbd-hint {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-kbd-hint kbd {
    font-family: inherit;
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  /* Card header with name + settings button */
  .mc-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--mc-bg);
  }

  .mc-card-name-input {
    flex: 1;
    border: none;
    background: none;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    padding: 4px 0;
  }

  .mc-card-name-input::placeholder {
    color: var(--secondary-text-color, #6b7280);
    font-weight: 400;
  }

  /* Row */
  .mc-row-item {
    border: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 25%, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-row-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-row-header.selected {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
  }

  .mc-row-header:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-row-header .mc-label {
    min-width: 50px;
  }

  /* Row collapse toggle */
  .mc-row-header-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    flex: 1;
  }

  .mc-row-header-toggle:hover {
    color: var(--primary-color, #6366f1);
  }

  /* Collapse button far right */
  .mc-row-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.15s;
  }

  .mc-row-collapse-btn:hover {
    background: var(--divider-color, #e5e7eb);
  }

  .mc-row-collapse-btn .mc-chevron {
    font-size: 0.625rem;
    transition: transform 0.2s;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-row-collapse-btn .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-row-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 8px;
  }

  .mc-layout-grid-option {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    padding: 9px 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: inherit;
  }

  .mc-layout-grid-option:hover {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.09);
  }

  .mc-layout-grid-option.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, var(--card-background-color, #fff));
  }

  .mc-layout-grid-option:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  .mc-layout-grid-preview {
    height: 16px;
    display: flex;
    gap: 3px;
    align-items: stretch;
  }

  .mc-layout-grid-preview > span {
    border-radius: 4px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 65%, #ffffff);
  }

  .mc-layout-grid-label {
    font-size: 0.68rem;
    text-align: center;
    color: var(--secondary-text-color, #6b7280);
    line-height: 1.1;
  }

  /* Drag handles */
  .mc-drag-handle,
  .mc-module-drag {
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
  }

  .mc-drag-handle:hover,
  .mc-module-drag:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-drag-handle:active,
  .mc-module-drag:active {
    cursor: grabbing;
  }

  /* Drag and drop states */
  .mc-row-item.dragging,
  .mc-module-item.dragging {
    opacity: 0.5;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-row-item.drag-over {
    border-color: var(--primary-color, #6366f1);
    border-style: dashed;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
  }

  .mc-modules-container {
    min-height: 40px;
    transition: background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-drop-slot {
    height: 10px;
    border-radius: 6px;
    border: 1px dashed transparent;
    transition: all 0.12s;
  }

  .mc-drop-slot.empty {
    height: 34px;
    border-color: var(--divider-color, #e5e7eb);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 3%, transparent);
  }

  .mc-drop-slot.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 16%, transparent);
  }

  /* Column — different color from row */
  .mc-col-item {
    flex: 1;
    border: 1px dashed color-mix(in srgb, var(--success-color, #22c55e) 40%, var(--divider-color, #e5e7eb));
    border-radius: 6px;
    padding: 10px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: color-mix(in srgb, var(--success-color, #22c55e) 3%, transparent);
  }

  .mc-col-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    color: color-mix(in srgb, var(--success-color, #22c55e) 70%, var(--secondary-text-color, #6b7280));
  }

  /* Column collapse toggle */
  .mc-col-header-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    flex: 1;
    min-width: 0;
  }

  .mc-col-header-toggle:hover {
    color: color-mix(in srgb, var(--success-color, #22c55e) 90%, var(--primary-text-color));
  }

  .mc-col-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    transition: background 0.15s;
    color: color-mix(in srgb, var(--success-color, #22c55e) 70%, var(--secondary-text-color, #6b7280));
  }

  .mc-col-collapse-btn:hover {
    background: color-mix(in srgb, var(--success-color, #22c55e) 15%, transparent);
  }

  .mc-col-collapse-btn .mc-chevron {
    font-size: 0.625rem;
    transition: transform 0.2s;
  }

  .mc-col-collapse-btn .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-col-item.collapsed .mc-modules-container,
  .mc-col-item.collapsed .mc-add-module-btn {
    display: none;
  }

  .mc-col-header .mc-label {
    flex: 1;
  }

  .mc-col-header .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-col-item:hover .mc-col-header .mc-btn-small {
    opacity: 1;
  }

  /* Module item */
  .mc-module-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
  }

  .mc-module-item:hover {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  .mc-module-item.selected {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-module-item-icon {
    color: var(--primary-color, #6366f1);
  }

  .mc-module-item-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-module-item-type {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .mc-module-item .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-module-item:hover .mc-btn-small {
    opacity: 1;
  }

  .mc-add-module-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
    width: 100%;
  }

  .mc-add-module-btn:hover {
    border-color: var(--primary-color, #6366f1);
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  /* Button variants */
  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-btn-small {
    width: 22px;
    height: 22px;
  }

  .mc-btn-add-col {
    color: var(--success-color, #22c55e);
  }

  .mc-btn-add-col:hover {
    background: color-mix(in srgb, var(--success-color, #22c55e) 15%, transparent);
    color: var(--success-color, #22c55e);
  }

  .mc-btn-delete {
    color: var(--error-color, #ef4444);
  }

  .mc-btn-delete:hover {
    background: color-mix(in srgb, var(--error-color, #ef4444) 15%, transparent);
    color: var(--error-color, #ef4444);
  }

  /* Row settings modal — smaller variant */
  .mc-modal-sm {
    max-width: 500px;
    width: 90%;
  }

  /* Interactive feedback */
  .mc-add-module-btn,
  .mc-module-item {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-add-module-btn:focus-visible,
  .mc-module-item:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  .mc-add-module-btn:active,
  .mc-module-item:active {
    opacity: 0.85;
  }

  /* Hover lift for module items */
  .mc-module-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Empty state */
  .mc-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    border: 1px dashed var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--mc-surface-recessed);
  }

  .mc-empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--mc-primary-light);
    color: var(--mc-primary);
    margin-bottom: 16px;
    --mdc-icon-size: 28px;
  }

  .mc-empty-state-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-empty-state-desc {
    margin: 6px 0 20px;
    max-width: 320px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color, #6b7280);
    line-height: 1.5;
  }

  .mc-empty-state-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

/* ================================================================== */
/*  CONDITION ROW STYLES                                               */
/* ================================================================== */
export const conditionRowStyles = css`
  :host {
    display: block;
  }

  .mc-cond {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    position: relative;
  }

  .mc-cond-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-cond-type {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .mc-cond-remove {
    margin-left: auto;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-cond-remove:hover {
    background: var(--divider-color);
    color: var(--error-color, #ef4444);
  }

  .mc-cond-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mc-cond-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-cond-field label {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-cond-field input,
  .mc-cond-field select,
  .mc-cond-field textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 4px;
    font-size: 0.8125rem;
    font-family: inherit;
    outline: none;
  }

  .mc-cond-template {
    resize: vertical;
    min-height: 72px;
  }

  .mc-cond-field input[type='time'] {
    padding: 5px 8px;
  }

  .mc-cond-field.full {
    grid-column: 1 / -1;
  }

  .mc-cond-entity-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
    grid-column: 1 / -1;
  }

  .mc-cond-entity-toggle label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-cond-entity-toggle input[type='checkbox'] {
    margin: 0;
    cursor: pointer;
  }
`;

/* ================================================================== */
/*  TEMPLATE PICKER STYLES (with stale var fixes)                      */
/* ================================================================== */
export const templatePickerStyles = css`
  /* ── Template-specific styles ────────────────────────────────── */

  /* Create mode form */
  .mc-template-form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mc-template-form input,
  .mc-template-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
    font-family: inherit;
  }

  .mc-template-form textarea {
    resize: vertical;
    min-height: 60px;
  }

  .mc-template-form input:focus,
  .mc-template-form textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-template-error {
    font-size: 0.8125rem;
    color: var(--error-color, #f44336);
  }

  /* Delete button */
  .mc-template-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    transition: all 0.15s;
    --mdc-icon-size: 18px;
  }

  .mc-template-delete-btn:hover {
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
    color: var(--error-color, #f44336);
  }

  /* Confirm bar */
  .mc-template-confirm {
    padding: 12px 16px;
    background: var(--mc-modal-item-hover-bg);
    border-bottom: 1px solid var(--mc-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-template-confirm-text {
    font-size: 0.8125rem;
    color: var(--mc-text);
  }

  .mc-template-confirm-actions {
    display: flex;
    gap: 8px;
  }

  /* Overwrite confirmation */
  .mc-template-overwrite {
    font-size: 0.8125rem;
    color: var(--warning-color, #ff9800);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-template-overwrite-actions {
    display: flex;
    gap: 8px;
  }

  .overwrite-btn {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color, #fff);
  }

  /* Edit button */
  .mc-template-edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    transition: all 0.15s;
    --mdc-icon-size: 18px;
  }

  .mc-template-edit-btn:hover {
    background: color-mix(in srgb, var(--mc-primary) 15%, transparent);
    color: var(--mc-primary);
  }

  /* Edit form inline */
  .mc-template-edit-form {
    padding: 16px;
    border-bottom: 1px solid var(--mc-border);
    background: color-mix(in srgb, var(--mc-primary) 5%, transparent);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-template-edit-form input,
  .mc-template-edit-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
    font-family: inherit;
  }

  .mc-template-edit-form textarea {
    resize: vertical;
    min-height: 50px;
  }

  .mc-template-edit-form input:focus,
  .mc-template-edit-form textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-template-edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`;

/* ================================================================== */
/*  ICON PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const iconPickerStyles = css`
  :host {
    --mc-modal-width: 800px;
  }
`;

/* ================================================================== */
/*  MEDIA PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const mediaPickerStyles = css`
  :host {
    --mc-modal-width: 480px;
    --mc-modal-item-icon-radius: var(--mc-modal-input-radius);
  }
`;

/* ================================================================== */
/*  SETTINGS MODAL STYLES (with stale var fixes)                       */
/* ================================================================== */
export const settingsModalStyles = css`
  .mc-btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
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
`;

/* ================================================================== */
/*  SYNC INDICATOR STYLES                                              */
/* ================================================================== */
export const syncIndicatorStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mc-sync-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    gap: 4px;
  }

  .mc-sync-btn.synced {
    background: color-mix(in srgb, var(--success-color, #4caf50) 12%, transparent);
    color: var(--success-color, #4caf50);
  }

  .mc-sync-btn.synced:hover {
    background: color-mix(in srgb, var(--success-color, #4caf50) 20%, transparent);
  }

  .mc-sync-btn.not-synced {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    color: var(--warning-color, #ff9800);
  }

  .mc-sync-btn.not-synced:hover {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 20%, transparent);
  }

  .mc-sync-btn ha-icon {
    --mdc-icon-size: 14px;
  }

  .mc-sync-btn:active {
    transform: scale(0.95);
  }
`;

/* ================================================================== */
/*  FONT PICKER STYLES (with stale var fixes)                          */
/* ================================================================== */
export const fontPickerStyles = css`
  :host {
    --mc-modal-width: 500px;
  }
  .mc-font-preview {
    padding: 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    margin-top: 8px;
    text-align: center;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mc-font-preview-text {
    font-size: 24px;
    color: var(--mc-text);
  }
  .mc-picker-item-name {
    flex: 1;
  }
`;

/* ================================================================== */
/*  UNIT FIELD STYLES                                                  */
/* ================================================================== */
export const unitFieldStyles = css`
  :host {
    display: block;
  }

  .mc-unit-field {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mc-unit-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px 0 0 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    min-width: 0;
    border-right: none;
  }

  .mc-unit-input:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-unit-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--divider-color, #e5e7eb);
  }

  .mc-unit-select {
    padding: 8px 8px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 0 6px 6px 0;
    font-size: var(--ha-font-size-xs, 0.75rem);
    background: var(--card-background-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    cursor: pointer;
    min-width: 55px;
  }

  .mc-unit-select:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-unit-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Input focus ring enhancement */
  .mc-unit-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 25%, transparent);
  }
`;

/* ================================================================== */
/*  BOX FIELD STYLES (with stale var fixes)                            */
/* ================================================================== */
export const boxFieldStyles = css`
  .mc-box-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-box-toolbar {
    display: flex;
    justify-content: flex-end;
  }

  .mc-box-inputs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--mc-modal-input-radius, 6px);
    padding: 8px;
  }

  .mc-box-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-box-input mc-unit-field {
    width: 100%;
  }

  .mc-box-input.disabled mc-unit-field {
    opacity: 0.55;
    pointer-events: none;
  }

  .mc-box-input label {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--secondary-text-color);
  }

  .mc-box-link-btn {
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s;
    min-height: 32px;
  }

  .mc-box-link-btn span {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
  }

  .mc-box-link-btn ha-icon {
    --mdc-icon-size: 14px;
  }

  .mc-box-link-btn:hover {
    background: var(--divider-color);
    color: var(--primary-text-color);
  }
  .mc-box-link-btn.linked {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
    border-color: var(--primary-color, #6366f1);
    color: var(--primary-color, #6366f1);
  }

  @media (max-width: 640px) {
    .mc-box-inputs {
      grid-template-columns: 1fr;
    }
  }
`;

/* ================================================================== */
/*  SERVICE PICKER STYLES (with stale var fixes)                       */
/* ================================================================== */
export const servicePickerStyles = css`
  :host {
    --mc-modal-width: 480px;
  }
`;

/* ================================================================== */
/*  COLOR PICKER STYLES (with stale var fixes)                         */
/* ================================================================== */
export const colorPickerStyles = css`
  :host {
    --mc-modal-width: 320px;
    --mc-modal-max-height: 90vh;
  }

  /* ── Color field (inline row) ──────────────────────────────── */
  .mc-color-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-color-preview {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 2px solid var(--mc-border);
    cursor: pointer;
    flex-shrink: 0;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    position: relative;
    overflow: hidden;
  }

  .mc-color-preview-inner {
    position: absolute;
    inset: 0;
  }

  .mc-color-text {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: 0.875rem;
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    min-width: 0;
  }

  .mc-color-text:focus {
    border-color: var(--mc-primary);
  }

  .mc-color-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--mc-primary);
    border-radius: 6px;
    background: color-mix(in srgb, var(--mc-primary) 10%, var(--mc-bg));
    cursor: pointer;
    color: var(--mc-primary);
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .mc-color-btn:hover {
    background: var(--mc-primary);
    color: white;
  }

  /* ── Modal overrides ───────────────────────────────────────── */
  .mc-modal {
    overflow: auto;
  }

  .mc-modal-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .mc-modal-header {
    padding: 16px;
  }

  /* ── Color Area ────────────────────────────────────────────── */
  .mc-color-area {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 8px;
    cursor: crosshair;
    touch-action: none;
  }

  .mc-color-area-gradient {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: linear-gradient(to right, #fff, transparent),
      linear-gradient(to top, #000, transparent);
  }

  .mc-color-area-pointer {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* ── Sliders ───────────────────────────────────────────────── */
  .mc-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mc-slider-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-text-secondary);
    width: 20px;
    flex-shrink: 0;
  }

  .mc-slider-track {
    flex: 1;
    height: 12px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    touch-action: none;
  }

  .mc-hue-track {
    background: linear-gradient(
      to right,
      #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
    );
  }

  .mc-opacity-track {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  }

  .mc-opacity-gradient {
    position: absolute;
    inset: 0;
    border-radius: 6px;
  }

  .mc-slider-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    top: 50%;
    pointer-events: none;
  }

  .mc-slider-value {
    width: 48px;
    padding: 4px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 4px;
    font-size: 0.75rem;
    text-align: center;
    background: var(--mc-bg);
    color: var(--mc-text);
  }

  /* ── Input Row ─────────────────────────────────────────────── */
  .mc-input-row {
    display: flex;
    gap: 8px;
  }

  .mc-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-input-label {
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
  }

  .mc-input-field {
    padding: 6px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 4px;
    font-size: 0.75rem;
    background: var(--mc-bg);
    color: var(--mc-text);
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Color Sections ────────────────────────────────────────── */
  .mc-color-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-color-section-header {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-color-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  }

  .mc-color-swatch {
    aspect-ratio: 1;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
    position: relative;
  }

  .mc-color-swatch:hover {
    transform: scale(1.1);
    z-index: 1;
  }

  .mc-color-swatch.selected {
    border-color: var(--mc-primary);
  }

  .mc-color-swatch.var-color {
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .mc-saved-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .mc-saved-swatch {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
  }

  .mc-saved-swatch:hover {
    border-color: var(--mc-primary);
  }

  .mc-saved-swatch .mc-remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #ef4444);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    display: none;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .mc-saved-swatch:hover .mc-remove-btn {
    display: flex;
  }

  .mc-add-saved-btn {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 2px dashed var(--mc-border);
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .mc-add-saved-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  /* ── Footer ────────────────────────────────────────────────── */
  .mc-modal-footer {
    padding: 16px;
  }

  /* Input focus ring enhancement */
  .mc-color-text:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`;

/* ================================================================== */
/*  PREVIEW PANEL STYLES                                               */
/* ================================================================== */
export const previewPanelStyles = css`
  :host {
    display: block;
  }

  .mc-preview {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    padding: 16px;
    background: var(--card-background-color, #fff);
    min-height: 60px;
  }

  .mc-preview-muted {
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-preview-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color, #6b7280);
    margin-bottom: 8px;
  }
`;

/* ================================================================== */
/*  LAYOUT MANAGER STYLES                                              */
/* ================================================================== */
export const layoutManagerStyles = css`
  :host {
    display: block;
  }

  .mc-layout-presets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 8px 0;
  }

  .mc-layout-preset {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.75rem;
  }

  .mc-layout-preset:hover {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-layout-preset.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
  }

  .mc-layout-preview {
    display: flex;
    gap: 2px;
    height: 20px;
    width: 100%;
  }

  .mc-layout-col {
    background: var(--primary-color, #6366f1);
    opacity: 0.3;
    border-radius: 2px;
    flex: 1;
  }

  /* Interactive feedback */
  .mc-layout-preset {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-layout-preset:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }
`;

/* ================================================================== */
/*  ACTION CONFIG STYLES                                               */
/* ================================================================== */
export const actionConfigStyles = css`
  :host {
    display: block;
  }

  .mc-act {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
  }

  .mc-act-header {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .mc-act-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-act-field label {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-act-field input,
  .mc-act-field select {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 4px;
    font-size: 0.8125rem;
    font-family: inherit;
    outline: none;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
  }
`;

/* ================================================================== */
/*  DRAG HANDLE STYLES                                                 */
/* ================================================================== */
export const dragHandleStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    opacity: 0.5;
    transition: opacity 0.15s;
    padding: 2px;
  }

  :host(:hover) {
    opacity: 1;
  }

  :host(:active) {
    cursor: grabbing;
  }
`;
