import { css, CSSResult, unsafeCSS } from 'lit';
import { editorPrimitives, editorTokens } from '../css/editor-system';

/** The stage and the timeline each keep at least this height (px); studio.ts SPLIT_MIN_PX. */
const SPLIT_MIN_PX = 160;

/** The animation studio's own layout, on the editor design system (DESIGN.md). */
export const studioStyles: CSSResult[] = [
  editorTokens,
  editorPrimitives,
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
      left: 0;
    }
    .shell {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100%;
      min-height: 0;
    }

    /* topbar (like the card studio) */
    .topbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      min-height: 56px;
      padding: 8px 16px;
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
      position: relative;
      z-index: 6;
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

    /* library */
    .lib {
      overflow: auto;
      min-height: 0;
      padding: 24px;
    }
    .lib-inner {
      max-width: 1040px;
      margin: 0 auto;
      display: grid;
      gap: 16px;
      align-content: start;
    }
    .lib-tools {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 16px;
    }
    .search {
      flex: 1 1 280px;
      max-width: 420px;
    }
    .search input::-webkit-search-cancel-button {
      cursor: pointer;
    }
    .lib-list {
      list-style: none;
      margin: 0;
      padding: 0;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      overflow: hidden;
    }
    .lib-row {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr) 120px auto;
      align-items: center;
      gap: 16px;
      padding: 10px 12px 10px 12px;
      transition: background-color 0.15s ease-out;
    }
    .has-usage .lib-row {
      grid-template-columns: 88px minmax(0, 1fr) 120px 130px auto;
    }
    .lib-row + .lib-row {
      border-top: 1px solid var(--mc-divider);
    }
    .lib-row:hover {
      background: var(--mc-surface-2);
    }
    .name-cell {
      display: grid;
      min-width: 0;
      gap: 2px;
    }
    .open {
      text-align: left;
      border: 0;
      background: transparent;
      padding: 6px 8px;
      margin: -6px -8px;
      border-radius: var(--mc-radius);
      color: inherit;
    }
    .open:focus-visible {
      outline-offset: 0;
    }
    .open .nm {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .open:hover .nm {
      color: var(--mc-accent-ink);
    }
    .open .id {
      font-size: 0.75rem;
      color: var(--mc-text-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lib-row .chip.kind {
      justify-self: start;
    }
    .used {
      font-size: 0.8125rem;
      color: var(--mc-text);
    }
    .used.none {
      color: var(--mc-text-2);
    }
    .acts {
      display: flex;
      gap: 2px;
      justify-content: flex-end;
    }
    .rename {
      min-height: 36px;
    }
    .no-results {
      text-align: center;
      padding: 32px 12px;
    }
    .lib-empty {
      padding: 48px 24px;
      gap: 12px;
    }
    .lib-empty > ha-icon {
      --mdc-icon-size: 40px;
    }
    .lib-empty p {
      max-width: 52ch;
    }
    .starters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      width: 100%;
      max-width: 640px;
      margin-top: 12px;
    }
    .starter {
      display: grid;
      justify-items: start;
      align-content: start;
      gap: 4px;
      padding: 14px;
      text-align: left;
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      background: var(--mc-surface);
      color: var(--mc-text);
      transition:
        border-color 0.15s ease-out,
        background-color 0.15s ease-out;
    }
    .starter:hover {
      border-color: var(--mc-field-border);
      background: var(--mc-surface-2);
    }
    .starter ha-icon {
      --mdc-icon-size: 22px;
      color: var(--mc-text-2);
      margin-bottom: 4px;
    }

    /* editor (layout v2): layers | centre (stage, splitter, timeline) | inspector, exactly the
       viewport; only the layers list, the timeline lanes and the inspector scroll */
    .workspace {
      --layers-w: 240px;
      --insp-w: 320px;
      position: relative;
      display: grid;
      grid-template-columns: var(--layers-w) minmax(0, 1fr) var(--insp-w);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    .workspace.compact {
      --layers-w: 224px;
      --insp-w: 288px;
    }
    .workspace.rail {
      --layers-w: 52px;
    }
    .workspace.slide {
      grid-template-columns: var(--layers-w) minmax(0, 1fr);
    }
    .layers {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      background: var(--mc-surface);
      border-right: 1px solid var(--mc-divider);
    }
    .layers-head {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 4px 6px 4px 16px;
      border-bottom: 1px solid var(--mc-divider);
    }
    .layers.rail .layers-head {
      justify-content: center;
      padding: 4px;
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
    .layers.rail .layers-body {
      padding: 6px;
    }
    .layers-note {
      padding: 4px 8px;
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
    /* the rail's buttons that open the column at a panel, under the targets */
    .rail-panels {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid var(--mc-divider);
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
      border: 0;
      border-radius: var(--mc-radius);
      background: transparent;
      color: var(--mc-text);
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: left;
      transition: background-color 0.15s ease-out;
    }
    .layers.rail .layer {
      justify-content: center;
      padding: 0;
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
      text-align: right;
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
      left: 50%;
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
      left: 0;
      right: 0;
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
    .inspector:focus {
      outline: none;
    }
    .inspector {
      /* the containing block of the panels' absolutely placed bits (sr-only text): they scroll with it */
      position: relative;
      background: var(--mc-surface);
      border-left: 1px solid var(--mc-divider);
      overflow-y: auto;
      overscroll-behavior: contain;
      min-height: 0;
      min-width: 0;
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
    }
    .workspace.slide .inspector {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(var(--insp-w), 100%);
      z-index: 8;
      transform: translateX(100%);
      visibility: hidden;
      transition:
        transform 0.2s ease-out,
        visibility 0s linear 0.2s;
    }
    .workspace.slide.insp-open .inspector {
      transform: none;
      visibility: visible;
      box-shadow: var(--mc-shadow-float);
      transition: transform 0.2s ease-out;
    }
    .insp-scrim {
      position: absolute;
      inset: 0;
      z-index: 7;
      background: rgba(0, 0, 0, 0.16);
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
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
    }
    .ctx-what {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }
    .ctx-note {
      padding-top: 16px;
    }
    /* collapsible inspector sections */
    .sec {
      border-bottom: 1px solid var(--mc-divider);
    }
    .sec:last-child {
      border-bottom: 0;
    }
    .sec-title {
      margin: 0;
      font: inherit;
    }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 48px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--mc-text);
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
    }
    .sec-head > ha-icon {
      --mdc-icon-size: 18px;
      color: var(--mc-text-2);
    }
    .sec-name {
      flex: 1;
      min-width: 0;
    }
    .sec-head .chev {
      transition: transform 0.15s ease-out;
    }
    .sec-head[aria-expanded='false'] .chev {
      transform: rotate(-90deg);
    }
    .sec-head:focus-visible {
      outline-offset: -2px;
    }
    .sec-err {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--error-color, #db4437);
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
      padding-right: 36px;
    }
    .suffix span {
      position: absolute;
      right: 12px;
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
      padding-left: 18px;
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
    .inspector > .panel + .panel {
      border-top: 1px solid var(--mc-divider);
    }

    /* dialogs */
    dialog.dlg {
      width: min(440px, calc(100vw - 32px));
      max-height: calc(100vh - 64px);
      padding: 20px;
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      background: var(--mc-surface);
      color: var(--mc-text);
      box-shadow: var(--mc-shadow-float);
      font-size: 0.875rem;
      line-height: 1.5;
      overflow: auto;
    }
    dialog.dlg.wide {
      width: min(640px, calc(100vw - 32px));
    }
    dialog.dlg[open] {
      display: grid;
      gap: 12px;
    }
    dialog.dlg::backdrop {
      background: rgba(0, 0, 0, 0.32);
    }
    dialog.dlg h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }
    dialog.dlg p {
      margin: 0;
      color: var(--mc-text-2);
    }
    .dlg-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 4px;
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
    .preset-list {
      display: grid;
      gap: 12px;
      max-height: min(52vh, 460px);
      overflow: auto;
      padding-right: 4px;
    }
    .pg h3 {
      margin: 0 0 6px;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--mc-text-2);
    }
    .pg-items {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .preset {
      min-height: 32px;
      padding: 0 12px;
      border: 1px solid var(--mc-divider);
      border-radius: 9999px;
      background: var(--mc-surface);
      color: var(--mc-text);
      font-size: 0.8125rem;
    }
    .preset:hover {
      background: var(--mc-accent-tint);
      border-color: transparent;
      color: var(--mc-accent-ink);
    }

    .toast {
      position: absolute;
      left: 50%;
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

    @media (max-width: 1180px) {
      .lib {
        padding: 16px;
      }
    }
    @media (max-width: 760px) {
      .lib-row,
      .has-usage .lib-row {
        grid-template-columns: 88px minmax(0, 1fr) auto;
      }
      .lib-row .chip.kind,
      .used {
        display: none;
      }
    }
  `,
];
