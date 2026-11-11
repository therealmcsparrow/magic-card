import { css, CSSResult, unsafeCSS } from 'lit';
import { editorTokens } from '../css/editor-system';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { kitTopbar, kitButtonExtras, kitCheck } from '../ui-kit/css/extras';

/** The stage and the timeline each keep at least this height (px); studio.ts SPLIT_MIN_PX. */
const SPLIT_MIN_PX = 160;

/** The animation studio's own layout, on the editor design system (DESIGN.md). */
export const studioStyles: CSSResult[] = [
  editorTokens, editorPrimitives, kitTopbar, kitButtonExtras, kitCheck,
  css`
    :host {
      display: block;
      position: relative;
      height: 100%;
      min-height: 480px;
      overflow: hidden;
      background: var(--mc-ground);
      color: var(--mc-text);
      font-size: 0.875rem;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    /* the live region after the shell: at the top, not one px under it (the host would scroll by it) */
    .shell + .sr-only {
      top: 0;
      left: 0; /* physical */
    }
    .shell {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100%;
      min-height: 0;
    }

    .grp {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex-wrap: wrap;
    }
    .title h1,
    .title strong {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    .title-icon {
      --mdc-icon-size: 22px;
      color: var(--mc-text-2);
    }
    .vr {
      width: 1px;
      height: 24px;
      background: var(--mc-divider);
    }
    .spacer {
      flex: 1;
    }
    .chip.kind ha-icon {
      --mdc-icon-size: 14px;
    }
    .btn .chev {
      --mdc-icon-size: 16px;
      margin: 0 -4px 0 -2px;
      margin-inline: -2px -4px;
    }
    .btn-danger {
      background: var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 80%, #000);
      color: #fff;
    }
    .btn-danger:hover {
      box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
    }

    /* new animation menu */
    .menu-anchor {
      position: relative;
    }
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 29;
    }
    .new-menu {
      right: 0;
      inset-inline: auto 0;
      top: calc(100% + 6px);
      width: 300px;
    }
    .menu button {
      min-height: 52px;
      padding: 6px 12px;
      align-items: center;
    }
    .mi {
      display: grid;
      min-width: 0;
    }
    .mi-t {
      font-weight: 500;
    }
    .mi-s {
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }

    /* the studio frame: its palette maps onto the studio's tokens, so every field inherits the soft-blueprint look */
    mc-ui-studio-frame,
    mc-ui-studio-frame * {
      --mc-ground: var(--bp-bg);
      --mc-surface: var(--bp-sheet);
      --mc-surface-2: var(--bp-surf2);
      --mc-text: var(--bp-ink);
      --mc-text-2: var(--bp-mute);
      --mc-divider: var(--bp-line);
      --mc-field-border: var(--bp-edge);
      --mc-accent: var(--bp-acc);
      --mc-accent-tint: var(--bp-acc-soft);
      --mc-radius: var(--bp-r-s);
      --mc-font: var(--bp-font-ui);
      --mc-mono: var(--bp-font-mono);
    }
    .shell > mc-ui-studio-frame {
      min-block-size: 0;
    }
    .fr-bar {
      display: flex;
      flex: 1;
      align-items: center;
      gap: var(--bp-s-3);
      min-inline-size: 0;
      block-size: 100%;
    }
    .fr-bar .spacer {
      flex: 1;
    }
    .fr-bar .grp {
      flex: none;
    }
    .fr-bar .title {
      flex-wrap: nowrap;
    }
    .fr-bar .doc-name {
      white-space: nowrap;
      font-size: var(--bp-t-bar);
    }
    .fr-start {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-block-size: 0;
      background: var(--bp-sheet);
    }
    .layers-close {
      display: none;
    }
    .narrow .layers-close {
      display: inline-grid;
    }
    /* the stage and the timeline fill the frame's stage area (its bar, ruler and padding taken off) */
    .center {
      inline-size: 100%;
      block-size: max(360px, calc(100dvh - var(--bp-bar-h) - var(--bp-ruler) - 120px));
      background: var(--mc-surface);
      border: 1px solid var(--bp-line);
      border-radius: var(--bp-r-m);
      box-shadow: var(--bp-shadow-card);
    }
    .insp .ctx {
      margin-inline: -16px;
    }

    /* library */
    :host([editing]) {
      position: fixed;
      inset: 0;
      z-index: 1000;
      height: auto;
    }
    :host(:not([editing])) {
      background: transparent;
    }
    .shell[data-view='library'] {
      grid-template-rows: minmax(0, 1fr);
    }
    .lib {
      overflow: auto;
      min-height: 0;
      padding: 16px;
    }
    .lib-inner {
      display: grid;
      gap: 12px;
      align-content: start;
      min-width: 0;
    }
    .bar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .search input::-webkit-search-cancel-button {
      cursor: pointer;
    }
    .lib-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 2px;
      min-width: 0;
    }
    .lib-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px 8px;
      min-height: var(--mc-hit, 40px);
      padding: 2px 4px 2px 8px;
      border-radius: var(--mc-radius, 8px);
      font-size: 0.875rem;
    }
    .lib-row:hover {
      background: var(--mc-surface-2);
    }
    .lib-row.selected {
      background: var(--mc-accent-tint);
    }
    .name-cell {
      flex: 1 1 120px;
      min-width: 0;
    }
    .open {
      display: block;
      border: 0;
      background: transparent;
      padding: 0;
      font: inherit;
      color: inherit;
      text-align: start;
      cursor: pointer;
      border-radius: 4px;
    }
    .open:focus-visible {
      outline: 2px solid var(--mc-focus);
      outline-offset: 2px;
    }
    .open .nm,
    .open .id {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .open:hover .nm {
      text-decoration: underline;
    }
    .open .id {
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }
    .lib-row .chip.kind {
      flex: none;
    }
    .used {
      font-size: 0.8125rem;
      color: var(--mc-text-2);
      white-space: nowrap;
    }
    .acts {
      display: flex;
      gap: 2px;
      margin-inline-start: auto;
    }
    .rename {
      width: 100%;
    }
    .no-results {
      margin: 0;
      color: var(--mc-text-2);
    }
    .lib-empty {
      padding: 32px 16px;
      text-align: center;
    }
    .lib-empty > ha-icon {
      --mdc-icon-size: 32px;
      color: var(--mc-text-2);
    }
    .lib-empty p {
      margin: 8px 0 0;
    }

    /* editor (layout v2): layers | centre (stage, splitter, timeline) | inspector, exactly the
       viewport; only the layers list, the timeline lanes and the inspector scroll */
    .layers {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      flex: 1;
      min-block-size: 0;
    }
    .layers-head {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 4px 6px 4px 16px;
      padding-inline: 16px 6px;
      border-bottom: 1px solid var(--mc-divider);
    }
    .layers-head h2 {
      flex: 1;
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--mc-text-2);
    }
    .layers-body {
      position: relative;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 8px;
    }
    .layers-note,
    .layers-help {
      padding: 4px 8px;
    }
    .layers-help {
      margin: 8px 0 0;
    }
    /* registered layers panels (card parts, icon parts, shapes), each under a small heading */
    .layer-group + .layer-group {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--mc-divider);
    }
    .layer-head {
      margin: 0;
      padding: 4px 8px 6px;
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mc-text-2);
    }
    .layer-group:focus {
      outline: none;
    }
    .layer-group > .panel {
      display: block;
    }
    .layer-list {
      display: grid;
      gap: 2px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .layer {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 40px;
      padding: 0 8px 0 10px;
      padding-inline: 10px 8px;
      border: 0;
      border-radius: var(--mc-radius);
      background: transparent;
      color: var(--mc-text);
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: start;
      transition: background-color 0.15s ease-out;
    }
    .layer ha-icon {
      --mdc-icon-size: 18px;
      color: var(--mc-text-2);
      flex: none;
    }
    .layer:hover {
      background: var(--mc-surface-2);
    }
    .layer[aria-pressed='true'] {
      background: var(--mc-accent-tint);
      color: var(--mc-accent-ink);
    }
    .layer[aria-pressed='true'] ha-icon {
      color: var(--mc-accent-ink);
    }
    .layer.off {
      color: var(--mc-text-2);
    }
    .layer.off .layer-name {
      text-decoration: line-through;
      text-decoration-color: var(--mc-field-border);
    }
    .layer-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .layer-main {
      height: 20px;
      padding: 0 8px;
      font-size: 0.6875rem;
    }
    .layer-count {
      min-width: 20px;
      font-size: 0.75rem;
      font-weight: 400;
      text-align: end;
      color: var(--mc-text-2);
      font-variant-numeric: tabular-nums;
    }
    .center {
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    mcas-stage {
      direction: ltr;
    }
    :host([dir='rtl']) .back ha-icon,
    :host([dir='rtl']) .ctx-back ha-icon {
      transform: scaleX(-1);
    }
    .center.with-panel {
      grid-template-rows:
        minmax(${unsafeCSS(SPLIT_MIN_PX)}px, calc(var(--split, 0.4) * 100%))
        9px minmax(0, 1fr);
    }
    .splitter {
      position: relative;
      cursor: row-resize;
      touch-action: none;
      background: var(--mc-surface);
      border-top: 1px solid var(--mc-divider);
      border-bottom: 1px solid var(--mc-divider);
    }
    .splitter::before {
      content: '';
      position: absolute;
      left: 50%; /* physical */
      top: 50%;
      width: 40px;
      height: 3px;
      margin: -1.5px 0 0 -20px;
      border-radius: 2px;
      background: var(--mc-field-border);
      transition: background-color 0.15s ease-out;
    }
    /* a 24 px grab area over the 9 px bar (touch) */
    .splitter::after {
      content: '';
      position: absolute;
      left: 0; /* physical */
      right: 0; /* physical */
      top: -8px;
      bottom: -8px;
      z-index: 2;
    }
    .splitter:hover::before,
    .splitter:focus-visible::before {
      background: var(--mc-accent);
    }
    .splitter:focus-visible {
      outline: 2px solid var(--mc-accent);
      outline-offset: -2px;
    }
    .insp:focus {
      outline: none;
    }
    .insp {
      /* the containing block of the panels' absolutely placed bits (sr-only text): they scroll with it */
      position: relative;
      min-height: 0;
      min-width: 0;
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
    }
    .ctx {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      margin: 0 -16px;
      padding: 4px 16px 4px 8px;
      padding-inline: 8px 16px;
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
    }
    .ctx-what {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: end;
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }
    .ctx-note {
      padding-top: 16px;
    }
    .field-head:has(.reset-field) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .reset-field {
      inline-size: 28px;
      block-size: 28px;
      min-inline-size: 28px;
    }
    .mod-count {
      margin: 0;
      padding-block: 12px 4px;
      padding-inline: 16px;
    }
    .zoom-read {
      font-family: var(--mc-font-mono, ui-monospace, monospace);
      font-size: 0.75rem;
      padding-inline: 8px;
    }
    /* collapsible inspector sections: the kit's section head (h3 + .sector-btn) on the studio's flat rule between sections */
    .sec {
      position: relative;
      border-bottom: 1px solid var(--mc-divider);
    }
    .sec:last-child {
      border-bottom: 0;
    }
    .sec .sector-btn {
      width: calc(100% + 8px);
      margin: 0 -4px;
      padding: 8px 4px;
    }
    .sec-err {
      position: absolute;
      top: 20px;
      right: 36px;
      inset-inline: auto 36px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--mc-error-ink, var(--error-color, #db4437));
    }
    .sec-body {
      display: grid;
      gap: 16px;
      padding: 0 0 20px;
      min-width: 0;
    }
    .mono.ref {
      font-size: 0.75rem;
    }
    .suffix {
      position: relative;
    }
    .suffix .input {
      padding-inline-end: 36px;
    }
    .suffix span {
      position: absolute;
      right: 12px;
      inset-inline: auto 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--mc-text-2);
      pointer-events: none;
    }
    .errors {
      margin: 16px 0 0;
      padding: 10px 12px;
      border-radius: var(--mc-radius);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--mc-error-ink);
      font-size: 0.8125rem;
    }
    .errors strong {
      font-weight: 500;
    }
    .errors ul {
      margin: 4px 0 0;
      padding-inline-start: 18px;
    }
    .errors .mono {
      font-size: 0.75rem;
    }
    /* kind editors (editor-slots.ts): the timeline fills the panel under the stage, the others sit in the inspector */
    .kind-slot {
      display: grid;
      min-width: 0;
    }
    .kind-slot.place-panel {
      grid-auto-rows: minmax(0, 1fr) auto;
      min-height: 0;
      overflow: hidden;
      padding: 8px 12px 10px;
      background: var(--mc-surface);
    }
    .kind-slot.place-panel > .kind-editor {
      min-height: 0;
      height: 100%;
      overflow: auto;
    }
    .kind-editor,
    .panel {
      display: block;
      min-width: 0;
    }
    .insp > .panel + .panel {
      border-top: 1px solid var(--mc-divider);
    }

    /* what goes into an <mc-ui-window>: the body is a grid, the footer's buttons join the window's own footer row */
    .dlg {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .dlg p {
      margin: 0;
    }
    .dlg > p:not(.help) {
      color: var(--mc-text-2);
    }
    .foot {
      display: contents;
    }
    textarea.yaml {
      min-height: 260px;
      white-space: pre;
    }
    .file {
      position: relative;
      cursor: pointer;
    }
    .file input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .file:focus-within {
      outline: 2px solid var(--mc-accent);
      outline-offset: 2px;
    }
    .ok {
      color: var(--mc-text) !important;
    }
    mc-preset-grid.preset-list {
      min-height: 0;
    }

    .toast {
      position: absolute;
      left: 50%; /* physical */
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 40;
      max-width: min(520px, calc(100% - 32px));
      padding: 10px 16px;
      border-radius: var(--mc-radius);
      background: var(--mc-text);
      color: var(--mc-surface);
      box-shadow: var(--mc-shadow-float);
      font-size: 0.8125rem;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .splitter::before,
      .layer {
        transition: none;
      }
    }

    @media (max-width: 760px) {
      .lib-row .chip.kind,
      .used {
        display: none;
      }
    }
  `,
];
