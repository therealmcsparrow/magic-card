import { css, type CSSResult } from 'lit';

/*
 * Styles of <mc-svg-editor>. The tokens (--mc-*) are the card editor's: the layer sets the same values
 * with the same HA theme fallbacks, so it also works on its own (it does not import src/css/editor-system,
 * 27 KB this chunk cannot afford). Layout follows the width of the layer, never the device (data-layout).
 */
export const editorStyles: CSSResult[] = [
  css`
    :host {
      --mc-accent: var(--primary-color, #03a9f4);
      --mc-accent-ink: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
      --mc-accent-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      --mc-accent-tint: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      --mc-surface: var(--card-background-color, #fff);
      --mc-surface-2: var(--secondary-background-color, #f2f3f5);
      --mc-ground: var(--primary-background-color, #fafafa);
      --mc-text: var(--primary-text-color, #212121);
      --mc-text-2: var(--secondary-text-color, #5f6368);
      --mc-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
      --mc-field-border: color-mix(in srgb, var(--primary-text-color, #212121) 40%, transparent);
      --mc-warn-ink: color-mix(in srgb, var(--warning-color, #ff9800) 45%, var(--primary-text-color, #212121));
      --mc-warn-tint: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      --mc-error-ink: color-mix(in srgb, var(--error-color, #db4437) 75%, var(--primary-text-color, #212121));
      --mc-canvas: color-mix(in srgb, var(--primary-text-color, #212121) 6%, var(--primary-background-color, #fafafa));
      --mc-canvas-dot: color-mix(in srgb, var(--primary-text-color, #212121) 16%, transparent);
      --mc-shadow-float: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      --art-accent: #d9622b;
      --hit: 40px;
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: block;
      color: var(--mc-text);
      font: 14px/1.4 system-ui, sans-serif;
    }
    @media (pointer: coarse) {
      :host {
        --hit: 44px;
      }
    }
    *,
    ::before,
    ::after {
      box-sizing: border-box;
    }
    :focus-visible {
      outline: 2px solid var(--mc-accent);
      outline-offset: 2px;
    }
    [hidden] {
      display: none !important;
    }
    .sr,
    .skips button:not(:focus) {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .skips {
      position: absolute;
      z-index: 5;
      display: flex;
      gap: 4px;
    }
    .layer {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--mc-ground);
    }
    h2,
    h3,
    h4,
    p,
    ul {
      margin: 0;
    }
    h2,
    h3 {
      font-size: 1rem;
    }
    h4,
    .help,
    .pt-help,
    .pt-outcome,
    .lbl,
    .f > span {
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }
    .warn,
    .error {
      color: var(--mc-error-ink);
    }
    .error:empty {
      display: none;
    }
    .b {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: var(--hit);
      min-width: var(--hit);
      padding: 0 10px;
      color: inherit;
      background: var(--mc-surface);
      border: 1px solid var(--mc-field-border);
      border-radius: 8px;
      font: inherit;
      text-decoration: none;
      cursor: pointer;
    }
    .b[aria-pressed='true'],
    .tool.on,
    .row.on,
    .seg [aria-checked='true'] {
      color: var(--mc-accent-ink);
      background: var(--mc-accent-tint);
    }
    .b[aria-pressed='true'] {
      border-color: var(--mc-accent);
    }
    .b.icon,
    .b.ghost,
    .float .b {
      background: none;
      border-color: transparent;
    }
    .b.icon,
    .float .b {
      min-height: 32px;
      min-width: 32px;
      padding: 0 4px;
    }
    .b.primary {
      color: #fff;
      background: var(--mc-accent-fill);
    }
    .b[aria-disabled='true'] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .top,
    .row,
    .banner,
    .toast,
    .opts,
    .pointbar,
    .pad,
    .acts,
    .pt-actions,
    .libs li,
    .pv-row,
    .float {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .top {
      flex-wrap: wrap;
      min-height: 52px;
      padding: 6px 12px;
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
    }
    .grow {
      flex: 1;
    }
    .name {
      width: 180px;
      max-width: 40vw;
    }
    .mark {
      color: var(--mc-text-2);
    }
    .chip {
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.75rem;
      background: var(--mc-surface-2);
    }
    .is-warn {
      background: var(--mc-warn-tint);
      color: var(--mc-warn-ink);
    }
    .is-error {
      background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent);
      color: var(--mc-error-ink);
    }
    input[type='text'],
    input[type='number'],
    input[type='search'],
    select,
    textarea {
      width: 100%;
      min-height: var(--hit);
      padding: 0 10px;
      color: inherit;
      background: var(--mc-surface);
      border: 1px solid var(--mc-field-border);
      border-radius: 8px;
      font: inherit;
    }
    textarea {
      padding: 8px 10px;
    }
    .f {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .switch {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 32px;
    }
    .switch input {
      accent-color: var(--mc-accent-fill);
    }
    .seg {
      display: flex;
      padding: 2px;
      gap: 2px;
      background: var(--mc-surface-2);
      border-radius: 8px;
    }
    .seg > button {
      flex: 1 1 auto;
      padding: 0 8px;
      white-space: nowrap;
      min-height: calc(var(--hit) - 8px);
      border: 0;
      border-radius: 6px;
      color: inherit;
      background: none;
      font: inherit;
      cursor: pointer;
    }
    .banners {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 12px 0;
    }
    .banner {
      flex-wrap: wrap;
      padding: 6px 10px;
      border-radius: 8px;
      background: var(--mc-surface-2);
      font-size: 0.8125rem;
    }
    .banner.warn {
      background: var(--mc-warn-tint);
      color: var(--mc-warn-ink);
    }
    .banner.error {
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    }
    .txt {
      flex: 1;
      min-width: 12ch;
    }
    .xfer {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: grid;
      place-items: start center;
      overflow: auto;
      padding: 24px 12px;
      background: color-mix(in srgb, var(--mc-surface) 70%, transparent);
    }
    .xfer > mc-transfer-panel {
      width: min(100%, 560px);
      padding: 16px;
      box-sizing: border-box;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: 12px;
      box-shadow: var(--mc-shadow-float);
    }
    .toast,
    .pop {
      position: absolute;
      z-index: 20;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: 12px;
      box-shadow: var(--mc-shadow-float);
    }
    .toast {
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      padding: 8px 12px;
      max-width: 90vw;
    }
    .pop {
      top: 60px;
      right: 16px;
      width: min(92vw, 380px);
      max-height: calc(100% - 80px);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
    }
    .pop.leave {
      top: 50%;
      left: 50%;
      right: auto;
      transform: translate(-50%, -50%);
    }
    .acts {
      flex-wrap: wrap;
    }
    .acts.col {
      flex-direction: column;
      align-items: stretch;
    }
    .acts.end {
      justify-content: flex-end;
    }
    .start,
    .center-msg {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      overflow: auto;
    }
    /* The start dialog uses the picker windows' tokens (editor-css .mc-picker-overlay / -modal / -header). */
    .start-dlg {
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
      overscroll-behavior: contain;
    }
    .start-dlg:not([open]) {
      display: none;
    }
    .start-dlg::backdrop {
      background: transparent;
    }
    .start-win {
      display: flex;
      flex-direction: column;
      width: 440px;
      max-width: 100%;
      max-height: min(80vh, 720px);
      overflow: hidden;
      background: var(--mc-surface);
      color: var(--mc-text);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .start-head {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 12px 12px 20px;
      border-bottom: 1px solid var(--mc-divider);
    }
    .start-head h3 {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.3;
    }
    .start-win .start {
      justify-content: flex-start;
      padding: 16px 20px 20px;
    }
    .start-win .tiles {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      width: 100%;
    }
    .start-win .tile {
      width: auto;
      padding: 8px;
      text-align: center;
    }
    .tiles {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 132px;
      height: 96px;
      color: inherit;
      background: var(--mc-surface);
      border: 1px dashed var(--mc-field-border);
      border-radius: 12px;
      font: inherit;
      cursor: pointer;
    }
    .tile[aria-pressed='true'] {
      border: 1px solid var(--mc-accent);
      background: var(--mc-accent-tint);
    }
    .startform {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: min(100%, 480px);
    }
    .work {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 56px 240px minmax(0, 1fr) 340px;
      grid-template-areas: 'rail left center insp';
    }
    [data-layout='mid'] .work {
      grid-template-columns: 56px 220px minmax(0, 1fr) 320px;
    }
    [data-layout='compact'] .work {
      grid-template-columns: 56px minmax(0, 1fr) 300px;
      grid-template-areas: 'rail center insp';
    }
    [data-layout='stacked'] .work {
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
    [data-layout='stacked'] .work > * {
      flex: none;
      overflow: visible;
    }
    [data-layout='stacked'] .center {
      order: 1;
    }
    [data-layout='stacked'] .rail {
      order: 2;
      flex-direction: row;
      justify-content: center;
    }
    [data-layout='stacked'] .left {
      order: 5;
    }
    [data-layout='stacked'] .insp {
      order: 6;
    }
    [data-layout='stacked'] .stage {
      flex: none;
      min-height: max(320px, 70vh);
    }
    .rail {
      grid-area: rail;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 8px 0;
      background: var(--mc-surface);
      border-right: 1px solid var(--mc-divider);
    }
    .tool {
      width: var(--hit);
      height: var(--hit);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      background: none;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
    }
    .left,
    .insp {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
      overflow: auto;
      padding: 8px;
      background: var(--mc-surface);
    }
    .left {
      grid-area: left;
      border-right: 1px solid var(--mc-divider);
    }
    .insp {
      grid-area: insp;
      padding: 8px 12px;
      border-left: 1px solid var(--mc-divider);
    }
    .work {
      position: relative;
    }
    .seg.chips {
      flex-wrap: wrap;
    }
    .seg.chips > button {
      min-width: 40px;
      min-height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    @media (pointer: coarse) {
      .seg.chips > button {
        min-height: 44px;
      }
    }
    .grid-size {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .row-u {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .picker {
      position: absolute;
      z-index: 11;
      top: 8px;
      left: 60px;
      width: 340px;
      max-width: calc(100% - 68px);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: 12px;
      box-shadow: var(--mc-shadow-float);
    }
    .picker.sheet {
      position: fixed;
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;
      width: auto;
      max-width: none;
      max-height: 60vh;
      overflow: auto;
      border-radius: 12px 12px 0 0;
    }
    .pick-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .pick-head h3 {
      margin: 0;
      font-size: 1rem;
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
      gap: 4px;
    }
    .tile {
      min-height: 64px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font: inherit;
      font-size: 0.75rem;
      line-height: 1.2;
      text-align: center;
      color: inherit;
      background: none;
      border: 1px solid transparent;
      border-radius: 8px;
      cursor: pointer;
    }
    .tile[aria-checked='true'] {
      color: var(--mc-accent-ink);
      background: var(--mc-accent-tint);
      border-color: var(--mc-accent);
    }
    .picker.sheet .tile {
      min-height: 72px;
    }
    .left.sheet {
      position: absolute;
      z-index: 10;
      top: 0;
      bottom: 0;
      left: 56px;
      width: min(80vw, 280px);
      box-shadow: var(--mc-shadow-float);
    }
    .center {
      grid-area: center;
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;
      min-width: 0;
      min-height: 0;
      padding: 8px;
      overflow: auto;
    }
    .float {
      align-self: flex-start;
      flex-wrap: wrap;
      max-width: 100%;
      gap: 2px;
      padding: 2px;
      background: var(--mc-surface);
      border-radius: 10px;
      box-shadow: var(--mc-shadow-float);
    }
    .vsep {
      align-self: stretch;
      width: 1px;
      margin: 4px 4px;
      background: var(--mc-divider);
    }
    .float .tb-menu {
      padding: 0 8px;
    }
    .zoom {
      min-width: 4ch;
      text-align: center;
      font: 0.75rem monospace;
    }
    .stage {
      position: relative;
      flex: 1 1 auto;
      min-height: 320px;
      overflow: hidden;
      border-radius: 12px;
      background-color: var(--mc-canvas);
      background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1px);
      background-size: 16px 16px;
    }
    .stage.tool-hand {
      cursor: grab;
    }
    .stage > svg,
    .stage > mc-path-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .stage > svg {
      pointer-events: none;
    }
    .stage > mc-path-canvas {
      border-radius: 0;
    }
    .board {
      fill: var(--mc-surface);
    }
    .ghost {
      opacity: 0.7;
    }
    .selbox,
    .rubber,
    .trail,
    .pvw path {
      fill: none;
      stroke: var(--mc-accent);
      stroke-width: 1.5;
      stroke-dasharray: 5 3;
    }
    .rubber,
    .pvw path {
      fill: var(--mc-accent-tint);
    }
    .trail {
      stroke-dasharray: none;
    }
    .pvw path {
      vector-effect: non-scaling-stroke;
    }
    .cross {
      stroke: var(--mc-accent);
      stroke-width: 1.5;
    }
    .empty {
      position: absolute;
      inset: auto 24px 24px;
      padding: 12px;
      text-align: center;
      color: var(--mc-text-2);
      background: var(--mc-surface);
      border: 1px dashed var(--mc-field-border);
      border-radius: 12px;
      pointer-events: none;
    }
    .opts,
    .pointbar,
    .pad {
      flex-wrap: wrap;
      align-items: flex-end;
    }
    .opts .f,
    .pointbar .f {
      width: 90px;
    }
    .tree,
    .layers,
    .lib,
    .libmsg,
    .libs,
    .grp-s,
    .pt-panel,
    .pv {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .libs {
      padding: 0;
      list-style: none;
    }
    .row {
      gap: 2px;
      min-height: var(--hit);
      padding: 0 4px;
      border-radius: 8px;
      -webkit-touch-callout: none;
    }
    .tree .row {
      padding-left: calc(4px + (var(--lv, 1) - 1) * 14px);
      scroll-margin-block: 48px;
    }
    .tree .row {
      flex-wrap: nowrap;
      gap: 0;
    }
    .tree .row .b {
      flex: none;
      width: 24px;
      min-width: 24px;
      height: 24px;
      min-height: 24px;
      padding: 0;
      border: 0;
      border-radius: 6px;
      background: transparent;
    }
    .tree .row .b:hover {
      background: color-mix(in srgb, var(--mc-text, #212121) 10%, transparent);
    }
    .tree .row .b[aria-pressed='true'] {
      background: transparent;
    }
    .tree .row .b:focus-visible {
      outline-offset: -2px;
    }
    .tree .row .chip {
      flex: none;
    }
    .grip {
      touch-action: none;
      cursor: grab;
    }
    .row.off .nm {
      opacity: 0.55;
    }
    .row.dragging {
      opacity: 0.5;
    }
    .tree.dragging {
      user-select: none;
      cursor: grabbing;
    }
    .row.drop-before {
      box-shadow: inset 0 2px 0 var(--mc-accent);
    }
    .row.drop-after {
      box-shadow: inset 0 -2px 0 var(--mc-accent);
    }
    .row.drop-into {
      outline: 2px solid var(--mc-accent);
      outline-offset: -2px;
    }
    .row.drop-no {
      outline: 2px dashed currentColor;
      outline-offset: -2px;
      cursor: not-allowed;
    }
    .dstat {
      min-height: 1.4em;
      margin: 0;
    }
    .dstat.is-no {
      font-weight: 600;
    }
    .nm {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .snack {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: var(--mc-surface-2);
      border-radius: 8px;
    }
    .grp-s,
    .pt-panel {
      padding: 8px 0 12px;
      border-bottom: 1px solid var(--mc-divider);
    }
    .pv {
      position: absolute;
      z-index: 15;
      right: 16px;
      bottom: 16px;
      box-sizing: border-box;
      width: min(calc(100% - 32px), 340px);
      max-height: calc(100% - 32px);
      padding: 12px;
      overflow: auto;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: 12px;
      box-shadow: var(--mc-shadow-float);
    }
    .pv .seg {
      align-self: flex-start;
    }
    .pv-g {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pv-row {
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 12px;
    }
    .pv-tile {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      min-height: 40px;
      padding: 8px;
      border: 1px solid var(--mc-divider);
      border-radius: 8px;
    }
    .sentinel {
      position: absolute;
    }
    .bool-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .bool-grid .b {
      gap: 6px;
      justify-content: flex-start;
      min-height: 36px;
      padding: 0 10px;
    }
    .bool-grid .b[aria-disabled='true'] {
      opacity: 0.75;
    }
    @media (max-width: 300px) {
      .bool-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (pointer: coarse) {
      .bool-grid .b {
        min-height: 44px;
      }
    }
    .result-note {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 6px 10px;
      border: 1px solid var(--mc-divider);
      border-radius: 10px;
      background: var(--mc-surface);
      font-size: 0.8125rem;
    }
    .result-note p {
      margin: 0;
    }
    .result-note .tx {
      flex: 1;
      min-width: 0;
    }
    .result-note .mk {
      font-weight: 700;
      width: 1.2em;
      text-align: center;
    }
    .result-note.is-warn {
      background: var(--mc-warn-tint);
      color: var(--mc-warn-ink);
    }
    .result-note.is-error {
      color: var(--mc-error-ink);
    }
    @media (forced-colors: active) {
      .tool.on,
      .row.on,
      .seg [aria-checked='true'] {
        outline: 3px solid Highlight;
      }
    }
  `,
];
