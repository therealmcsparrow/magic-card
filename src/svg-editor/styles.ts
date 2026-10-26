import { css, type CSSResult } from 'lit';
import { editorTokens } from '../css/editor-system';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { kitCss } from '../ui-kit/css/extras';
import { kitLip } from '../ui-kit/css/lip';

/*
 * Styles of <mc-svg-editor> (contract svg-editor 1.0.0, ui-kit 1.0.0). The look is the kit's: Core's tokens, the card
 * editor's primitives (buttons, fields, segmented control, chips, switch, menu rows) and the kit parts (topbar, rail,
 * float toolbar, notices, tiles, rows). They live in the card-editor chunk that loads this one, so they cost this chunk
 * nothing. What is left here is layout only: where things sit, the canvas stack, the tree row's drag states and the
 * layer's responsive rules. Layout follows the width of the layer, never the device (data-layout).
 */
export const editorStyles: CSSResult[] = [
  editorTokens,
  editorPrimitives,
  ...kitCss,
  kitLip,
  css`
    :host {
      --art-accent: #d9622b;
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: block;
      font-family: var(--mc-font);
      font-size: 0.875rem;
      line-height: 1.4;
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
      z-index: 20;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 4px;
    }
    .skips button:focus {
      background: var(--mc-surface);
      box-shadow: var(--mc-shadow-float);
    }
    .layer {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--mc-ground);
    }
    h1,
    h2,
    h3,
    h4,
    p,
    ul {
      margin: 0;
    }
    .sentinel {
      position: absolute;
    }
    .banners,
    .result {
      position: absolute;
      z-index: 4;
      left: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      pointer-events: none;
    }
    .banners {
      top: 12px;
    }
    .result {
      bottom: 12px;
    }
    .banners > *,
    .result > * {
      max-width: min(100%, 560px);
      pointer-events: auto;
      box-shadow: var(--mc-shadow-float);
    }
    /* the kit tints are see-through: back them with the surface so the drawing under a notice never shows through the text */
    .banners > .notice.notice,
    .result > .notice.notice {
      background: linear-gradient(var(--nt), var(--nt)) var(--mc-surface);
    }
    .notice.info {
      --nt: var(--mc-accent-tint);
    }
    .notice.success {
      --nt: var(--mc-success-tint);
    }
    .notice.warn {
      --nt: var(--mc-warn-tint);
    }
    .notice.error {
      --nt: var(--mc-error-tint);
    }
    .banners .notice > .icon-btn {
      align-self: flex-start;
      margin: -4px -6px -4px 0;
    }
    .banners details ul {
      padding-inline-start: 18px;
    }
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
    .topbar .nm-field {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .topbar .nm-field .name {
      flex: 0 1 180px;
      min-width: 96px;
      max-width: 40vw;
    }

    /* the start window and the confirmations */
    .start {
      display: grid;
      gap: 12px;
    }
    .start .tile {
      font: inherit;
      font-size: 0.8125rem;
    }
    .startform {
      display: grid;
      gap: 8px;
    }
    .acts {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .confirm,
    .dlg {
      display: grid;
      gap: 12px;
    }
    .foot {
      display: contents;
    }

    /* the working area */
    .work {
      --lw: 260px;
      --iw: 340px;
      --lx: 0px;
      --lg: 0px;
      --mc-lip-pull: var(--lg);
      position: relative;
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 56px var(--lt, var(--lw)) minmax(0, 1fr) var(--it, var(--iw));
      grid-template-areas: 'rail left center insp';
      overflow: hidden;
    }
    [data-layout='mid'] .work {
      --lw: 240px;
      --iw: 320px;
    }
    [data-layout='compact'] .work {
      --iw: 300px;
      grid-template-columns: 56px minmax(0, 1fr) var(--it, var(--iw));
      grid-template-areas: 'rail center insp';
    }
    /* touch: a lip's longer hit area stays off the stage, so a hidden lip is pulled 4 px to the edge and a shown one 20 px into its panel */
    @media (pointer: coarse) {
      .work {
        --lx: 20px;
        --lg: 4px;
      }
    }
    /*
     * A hidden panel gives its track to the stage, keeping a 40 px gutter for its lip, but keeps its own width,
     * so its content never reflows and a nested scroller keeps its place. It slides off its edge.
     */
    .no-side {
      --lt: calc(40px + var(--lg));
    }
    .no-insp {
      --it: calc(40px + var(--lg));
    }
    .left {
      --mc-lip-off: -100%;
    }
    .insp {
      --mc-lip-off: 100%;
    }
    .left[data-lip='hidden'] {
      width: var(--lw);
      justify-self: start;
    }
    .insp[data-lip='hidden'] {
      width: var(--iw);
      justify-self: end;
    }
    .left[data-lip='shown'],
    .left[data-lip='hidden'] {
      padding-inline-end: calc(28px + var(--lx));
    }
    .insp[data-lip='shown'],
    .insp[data-lip='hidden'] {
      padding-inline-start: calc(28px + var(--lx));
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
    }
    [data-layout='stacked'] .left {
      order: 5;
    }
    [data-layout='stacked'] .insp {
      order: 6;
    }
    [data-layout='stacked'] .stagebox {
      flex: none;
      min-height: max(320px, 70vh);
    }
    /* the kit turns the rail into a row under 800 px of viewport; here the layer's own width decides */
    .work > .rail {
      position: relative;
      z-index: 1;
      grid-area: rail;
      flex-direction: column;
      width: 56px;
      padding: 8px 0;
      border-inline-end: 1px solid var(--mc-divider);
      border-bottom: 0;
      overflow-x: visible;
    }
    [data-layout='stacked'] .work > .rail {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      width: auto;
      padding: 4px 8px;
      border-inline-end: 0;
      border-bottom: 1px solid var(--mc-divider);
    }
    .left,
    .insp {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-height: 0;
      overflow: auto;
      padding: 12px;
      background: var(--mc-surface);
    }
    .left {
      grid-area: left;
      border-inline-end: 1px solid var(--mc-divider);
    }
    .insp {
      grid-area: insp;
      padding: 12px 16px;
      border-inline-start: 1px solid var(--mc-divider);
    }
    .left.sheet {
      position: absolute;
      z-index: 10;
      top: 0;
      bottom: 0;
      inset-inline-start: 56px;
      width: min(80vw, 300px);
      box-shadow: var(--mc-shadow-float);
    }
    .sheet-head {
      display: flex;
      justify-content: flex-end;
    }
    .center {
      grid-area: center;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
      min-width: 0;
      min-height: 0;
      padding: 8px;
      overflow: auto;
    }
    .center > .toolbar {
      align-self: flex-start;
      max-width: 100%;
    }
    .toolbar .zoom {
      min-width: 4ch;
      text-align: center;
      font: 0.75rem var(--mc-mono);
    }
    .toolbar [aria-expanded='true'] {
      background: var(--mc-accent-tint);
      color: var(--mc-accent-ink);
    }
    /* the notices are siblings of the stage inside this box: the stage keeps its pointer and key capture to itself */
    .stagebox {
      position: relative;
      display: flex;
      flex: 1 1 auto;
      min-height: 320px;
    }
    .stage {
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      border-radius: var(--mc-radius-lg);
      background-color: var(--mc-canvas);
      background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1px);
      background-size: 16px 16px;
    }
    .stage.tool-hand {
      cursor: grab;
    }
    .stage.tool-hand:active {
      cursor: grabbing;
    }
    .stage:not(.tool-select, .tool-node, .tool-pen, .tool-hand) {
      cursor: crosshair;
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
    .stage > .hint {
      position: absolute;
      inset: auto 24px 24px;
      pointer-events: none;
    }
    .stage > .hint .empty {
      background: var(--mc-surface);
    }
    .opts,
    .pointbar,
    .pad {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 8px 12px;
    }
    .opts .field,
    .pointbar .field {
      width: 96px;
    }
    .grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .row-u {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .layers,
    .lib,
    .libmsg,
    .pt-panel {
      display: grid;
      gap: 12px;
    }
    .lib .rows .row .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lib .rows .row {
      flex-wrap: nowrap;
    }
    /* seven borderless icon buttons on one line at the panel's own width: they shrink from 28 to 24 px (never smaller) */
    .layers > .acts {
      flex-wrap: nowrap;
      gap: 2px;
    }
    .layers > .acts .icon-btn {
      flex: 0 1 28px;
      min-width: 24px;
      height: 28px;
      --mdc-icon-size: 18px;
    }

    /* the shape picker over the canvas */
    .picker {
      position: absolute;
      z-index: 11;
      top: 8px;
      inset-inline-start: 64px;
      width: 340px;
      max-width: calc(100% - 72px);
      max-height: calc(100% - 16px);
      overflow: auto;
      padding: 12px;
      display: grid;
      gap: 12px;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      box-shadow: var(--mc-shadow-float);
    }
    .picker.sheet {
      position: fixed;
      top: auto;
      inset-inline: 0;
      bottom: 0;
      width: auto;
      max-width: none;
      max-height: 60vh;
      border-radius: var(--mc-radius-xl, 16px) var(--mc-radius-xl, 16px) 0 0;
    }
    .pick-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .picker .tiles {
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
    }

    /* the layer tree: kit rows, nowrap, borderless 24 px buttons */
    .tree {
      display: grid;
      gap: 2px;
    }
    .tree .row {
      flex-wrap: nowrap;
      gap: 0;
      scroll-margin-block: 48px;
      -webkit-touch-callout: none;
      font-size: 0.8125rem;
      font-weight: 500;
    }
    .tree .row .icon-btn.xs {
      width: 24px;
      height: 24px;
    }
    .tree .row .icon-btn[aria-pressed='true'] {
      background: transparent;
    }
    .tree .row .icon-btn:focus-visible {
      outline-offset: -2px;
    }
    .tree .row .chip {
      flex: none;
      margin-inline-start: 4px;
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
    .rename {
      flex: 1;
      min-width: 0;
      min-height: 28px;
      padding: 2px 8px;
    }

    /* the preview popover */
    .pv {
      display: grid;
      gap: 12px;
      width: min(100%, 336px);
    }
    .pv-g {
      display: grid;
      gap: 6px;
    }
    .pv-row {
      display: flex;
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
      border-radius: var(--mc-radius);
    }
    .help-list {
      display: grid;
      gap: 6px;
      padding-inline-start: 18px;
      font-size: 0.8125rem;
    }
    .pop-body {
      display: grid;
      gap: 8px;
    }
    .pop-body:focus {
      outline: none;
    }
    .bool-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    @media (max-width: 300px) {
      .bool-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (forced-colors: active) {
      .row[aria-selected='true'] {
        outline: 3px solid Highlight;
      }
    }
  `,
];
