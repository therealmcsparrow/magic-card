import { css, CSSResult } from 'lit';

// Layout, rulers, grid, zoom pill, push drawer and sheet of <mc-ui-studio-frame>; colours and sizes come from kitBlueprint.
export const frameStyles: CSSResult = /* @__PURE__ */ css`
  :host {
    display: block;
    position: relative;
    block-size: 100%;
    min-block-size: 0;
    overflow-x: clip;
    background: var(--bp-bg);
    color: var(--bp-ink);
    font: var(--bp-t-body) / var(--bp-lh) var(--bp-font-ui);
  }
  :host([data-bp-w="mid"]) {
    --bp-drawer-w: 320px;
    --bp-layers-w: 220px;
  }
  :host([data-bp-w="narrow"]),
  :host([data-bp-w="tiny"]) {
    --bp-ruler: 16px;
  }
  :host([dir="rtl"]) {
    --bp-slide-from: -100%;
  }
  [hidden] {
    display: none !important;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  :focus-visible {
    outline: var(--bp-focus-w) solid var(--bp-acc);
    outline-offset: var(--bp-focus-off);
  }
  @media (forced-colors: active) {
    :focus-visible {
      outline-color: Highlight;
    }
  }

  .shell {
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    min-width: 0;
    scroll-padding: var(--bp-bar-h) var(--bp-s-6) var(--bp-s-9);
  }
  [data-bp="bar"] {
    flex: none;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--bp-s-3);
    min-block-size: var(--bp-bar-h);
    padding: 0 var(--bp-s-5);
    border-block-end: 1px solid var(--bp-line);
    background: var(--bp-sheet);
    overflow-x: auto;
    scrollbar-width: none;
  }
  [data-bp="bar"]::-webkit-scrollbar {
    display: none;
  }
  [data-bp="bar"] slot {
    display: contents;
  }

  .work {
    flex: 1;
    min-width: 0;
    min-block-size: 0;
    display: grid;
    grid-template-columns: var(--lw, 0px) minmax(0, 1fr) var(--dw, 0px);
    transition: grid-template-columns var(--bp-dur-sheet) ease;
  }
  .work[data-start] {
    --lw: var(--bp-layers-w);
  }
  .work[data-open] {
    --dw: var(--bp-drawer-w);
  }
  .work[data-narrow] {
    --lw: 0px;
    --dw: 0px;
  }
  .work[data-start][data-narrow][data-rail] {
    --lw: var(--bp-rail-w, 72px);
  }

  [data-bp="start"] {
    grid-column: 1;
    grid-row: 1;
    display: none;
    min-width: 0;
    min-inline-size: 0;
    overflow: hidden;
    background: var(--bp-sheet);
    border-inline-end: 1px solid var(--bp-line);
  }
  .work[data-start] [data-bp="start"] {
    display: flex;
    flex-direction: column;
  }
  .work[data-start][data-narrow]:not([data-rail]) [data-bp="start"] {
    position: fixed;
    inset: 0;
    z-index: 20;
    border: 0;
  }

  [data-bp="stage"] {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    min-width: 0;
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    grid-template-columns: var(--bp-ruler) minmax(0, 1fr);
    grid-template-rows: var(--bp-ruler) minmax(0, 1fr);
    background: var(--bp-bg);
  }
  [data-bp="stage"][data-rulers="off"] {
    grid-template-columns: 0 minmax(0, 1fr);
    grid-template-rows: 0 minmax(0, 1fr);
  }
  .corner {
    display: grid;
    place-items: center;
    overflow: hidden;
    font: var(--bp-t-ruler) var(--bp-font-mono);
    color: var(--bp-mute);
    border-inline-end: 1px solid var(--bp-hair2);
    border-block-end: 1px solid var(--bp-hair2);
  }
  [data-bp="ruler"] {
    position: relative;
    overflow: hidden;
    direction: ltr;
    color: var(--bp-mute);
    font: var(--bp-t-ruler) var(--bp-font-mono);
    pointer-events: none;
    user-select: none;
  }
  [data-bp="ruler"][data-axis="x"] {
    border-block-end: 1px solid var(--bp-hair2);
    background: repeating-linear-gradient(90deg, var(--bp-hair2) 0 1px, transparent 1px var(--bp-tick, 10px)) bottom / 100% 5px no-repeat;
  }
  [data-bp="ruler"][data-axis="y"] {
    border-inline-end: 1px solid var(--bp-hair2);
    background: repeating-linear-gradient(180deg, var(--bp-hair2) 0 1px, transparent 1px var(--bp-tick, 10px)) right / 5px 100% no-repeat; /* physical */
  }
  [data-bp="ruler"] span {
    position: absolute;
  }
  [data-bp="ruler"][data-axis="x"] span {
    top: 2px;
    margin-inline-start: 3px;
  }
  [data-bp="ruler"][data-axis="y"] span {
    margin-top: 2px;
    margin-inline-start: 2px;
  }
  :host([data-bp-w="tiny"]) [data-bp="ruler"] span,
  :host([data-bp-w="narrow"]) [data-bp="ruler"] span {
    display: none;
  }

  [data-bp="grid"] {
    grid-column: 2;
    grid-row: 2;
    pointer-events: none;
    background-image: linear-gradient(var(--bp-hair) 1px, transparent 1px), linear-gradient(90deg, var(--bp-hair) 1px, transparent 1px);
    background-size: var(--bp-grid-step, var(--bp-grid)) var(--bp-grid-step, var(--bp-grid));
  }
  [data-bp="grid"][data-lines="off"] {
    background-image: none;
  }
  [data-bp="stage"][data-rulers="off"] [data-bp="grid"],
  [data-bp="stage"][data-rulers="off"] .field {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }
  .field {
    grid-column: 2;
    grid-row: 2;
    position: relative;
    min-width: 0;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    scroll-padding: var(--bp-s-9) var(--bp-s-6) 96px;
    padding: 56px var(--bp-s-10) 64px;
  }
  :host([data-bp-w="narrow"]) .field,
  :host([data-bp-w="tiny"]) .field {
    padding: 48px var(--bp-s-6) 64px;
  }
  .content {
    position: relative;
    display: grid;
    justify-items: start;
    align-content: start;
    margin: auto;
    max-inline-size: 100%;
  }
  [data-bp="callout"] {
    position: absolute;
    pointer-events: none;
    border: 1px solid var(--bp-acc);
    border-radius: var(--bp-r-xs);
  }
  [data-bp="callout"] output {
    position: absolute;
    inset-block-start: -20px;
    padding: 0 var(--bp-s-3);
    border-radius: 4px;
    background: var(--bp-acc);
    color: var(--bp-acc-ink);
    font: var(--bp-t-meta) var(--bp-font-mono);
    white-space: nowrap;
  }
  [data-bp="width-callout"] {
    position: absolute;
    inset: -28px 0 auto;
    display: flex;
    align-items: center;
    gap: var(--bp-s-3);
    color: var(--bp-mute);
    font: var(--bp-t-meta) var(--bp-font-mono);
    pointer-events: none;
  }
  [data-bp="width-callout"]::before,
  [data-bp="width-callout"]::after {
    content: "";
    flex: 1;
    block-size: 1px;
    background: var(--bp-line);
  }

  .zoomrow {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0 14px 12px;
    pointer-events: none;
  }
  [data-bp="zoom"] {
    display: flex;
    align-items: center;
    gap: var(--bp-s-1);
    padding: 3px;
    border: 1px solid var(--bp-line);
    border-radius: var(--bp-r-pill);
    background: var(--bp-sheet);
    box-shadow: var(--bp-shadow-pill);
    pointer-events: auto;
  }
  [data-bp="zoom"][data-empty] {
    display: none;
  }
  [data-bp="zoom"] slot {
    display: contents;
  }

  [data-bp="drawer"] {
    grid-column: 3;
    grid-row: 1;
    min-width: 0;
    min-inline-size: 0;
    overflow: hidden;
    border-inline-start: 1px solid var(--bp-line);
  }
  .panel {
    display: flex;
    flex-direction: column;
    background: var(--bp-sheet);
    color: var(--bp-ink);
  }
  .head {
    flex: none;
    display: flex;
    align-items: center;
    gap: var(--bp-s-3);
    min-block-size: var(--bp-bar-h);
    padding: var(--bp-s-4) var(--bp-s-6);
    border-block-end: 1px solid var(--bp-line);
  }
  .head h2 {
    flex: 1;
    min-inline-size: 0;
    margin: 0;
    overflow: hidden;
    font: 600 var(--bp-t-head) var(--bp-font-ui);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ib {
    flex: none;
    display: grid;
    place-items: center;
    inline-size: var(--bp-hit);
    block-size: var(--bp-hit);
    padding: 0;
    border: 0;
    border-radius: var(--bp-r-s);
    background: none;
    color: inherit;
    cursor: pointer;
  }
  .ib:hover {
    background: var(--bp-surf2);
  }
  .ib[aria-pressed="true"] {
    background: var(--bp-acc-soft);
    color: var(--bp-acc);
    box-shadow: inset 0 0 0 2px var(--bp-acc);
  }
  svg {
    display: block;
    flex: none;
  }
  :host([dir="rtl"]) svg[data-dir="mirror"] {
    transform: scaleX(-1);
  }
  .filt {
    flex: none;
    display: flex;
    align-items: center;
    gap: var(--bp-s-4);
    padding: var(--bp-s-4) var(--bp-s-6);
    border-block-end: 1px solid var(--bp-line);
    font-size: var(--bp-t-label);
  }
  .filt slot {
    display: contents;
  }
  [data-bp="modified-only"] {
    display: inline-flex;
    align-items: center;
    gap: var(--bp-s-4);
    min-block-size: var(--bp-hit);
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .track {
    position: relative;
    flex: none;
    inline-size: 38px;
    block-size: 22px;
    border: 1px solid var(--bp-edge);
    border-radius: var(--bp-r-pill);
    background: var(--bp-surf2);
  }
  .track::after {
    content: "";
    position: absolute;
    inset-block-start: 2px;
    inset-inline-start: 2px;
    inline-size: 16px;
    block-size: 16px;
    border-radius: 50%;
    background: var(--bp-mute);
    transition: transform var(--bp-dur);
  }
  [aria-checked="true"] .track {
    border-color: var(--bp-acc);
    background: var(--bp-acc);
  }
  [aria-checked="true"] .track::after {
    background: var(--bp-acc-ink);
    transform: translateX(16px);
  }
  :host([dir="rtl"]) [aria-checked="true"] .track::after {
    transform: translateX(-16px);
  }
  .body {
    flex: 1;
    min-block-size: 0;
    min-width: 0;
    overflow: auto;
    scroll-padding: var(--bp-s-9) 0;
    padding: var(--bp-s-2) var(--bp-s-6) var(--bp-s-9);
  }
  .none {
    padding: var(--bp-s-7) 0;
    color: var(--bp-mute);
    font-size: var(--bp-t-label);
  }
  .none:empty {
    display: none;
  }

  [data-bp="sheet"] {
    position: fixed;
    inset: 0;
    z-index: 20;
    block-size: 100vh;
    block-size: 100dvh;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    animation: bp-sheet-in var(--bp-dur-sheet) ease-out;
  }
  @keyframes bp-sheet-in {
    from {
      transform: translateX(var(--bp-slide-from, 100%));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      scroll-behavior: auto;
    }
  }
`;
