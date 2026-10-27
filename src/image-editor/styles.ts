import { css } from 'lit';

/* Layout of the image-only parts: the size meter row, the canvas-size window and the view-only workspace. Look and tokens are the kit's. */
export const imageStyles = css`
  .img-meter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    padding: 6px 12px;
    background: var(--mc-surface);
    border-bottom: 1px solid var(--mc-divider, rgba(127, 127, 127, 0.25));
  }
  .img-meter .bar {
    flex: 0 0 160px;
    height: 8px;
    border-radius: 4px;
    background: var(--mc-ground);
    overflow: hidden;
  }
  .img-meter .bar > span {
    display: block;
    height: 100%;
    background: var(--mc-text, #212121);
  }
  .img-meter.is-big .bar > span {
    background: var(--mc-accent, #03a9f4);
  }
  .img-meter.is-full .bar > span {
    background: var(--mc-warn, #b26a00);
  }
  .img-meter.is-over .bar > span {
    background: var(--mc-error-ink, #b3261e);
  }
  .img-meter .sentence {
    flex: 1 1 240px;
    min-width: 0;
  }
  .img-meter.is-over .sentence {
    color: var(--mc-error-ink, #b3261e);
    font-weight: 600;
  }
  .img-meter .kib {
    flex: 1 1 100%;
  }
  .img-notice {
    padding: 6px 12px;
    background: var(--mc-surface);
  }
  .presets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 8px;
  }
  .presets .tile .ratio {
    display: block;
    border: 2px solid currentColor;
    border-radius: 3px;
    margin-inline: auto;
  }
  .presets .tile .size {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  .sizes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
    align-items: start;
  }
  .open-file {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
  }
  .open-error {
    flex: 1 0 100%;
    margin: 0;
    color: var(--mc-error-ink, #b3261e);
  }
  .id-line {
    color: var(--mc-text-secondary, inherit);
    opacity: 0.85;
  }
  .more summary {
    cursor: pointer;
    padding-block: 6px;
  }
  .paint {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .grad {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .grad-strip {
    height: 14px;
    border-radius: 4px;
    border: 1px solid var(--mc-divider, rgba(127, 127, 127, 0.4));
  }
  .stops {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .stop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 8px;
    align-items: end;
    padding: 6px 8px;
    border: 1px solid var(--mc-divider, rgba(127, 127, 127, 0.3));
    border-radius: 6px;
  }
  .stop > :nth-child(n + 2) {
    grid-column: 1 / -1;
  }
  .stop > .icon-btn {
    grid-column: 2;
    grid-row: 1;
  }
  .gh {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .txf {
    position: absolute;
    z-index: 3;
    box-sizing: border-box;
    width: 248px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border-radius: 8px;
    background: var(--mc-surface);
    box-shadow: var(--mc-shadow-float);
    pointer-events: auto;
  }
  .txf textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }
  .txf .help {
    margin: 0;
  }
  .txf .btn {
    min-height: 44px;
  }
  .txf .actions {
    display: flex;
    gap: 8px;
  }
  .gh-pt {
    position: absolute;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin: -12px 0 0 -12px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid #1f2933;
    background: #fff;
    box-shadow: 0 0 0 2px #fff;
    pointer-events: auto;
    touch-action: none;
    cursor: grab;
  }
  .gh-pt::after {
    content: '';
    position: absolute;
    inset: -14px;
  }
  .gh-pt:focus-visible {
    outline: 3px solid var(--mc-focus, #03a9f4);
    outline-offset: 3px;
  }
  .vw {
    position: relative;
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) 300px;
  }
  [data-layout='compact'] .vw,
  [data-layout='stacked'] .vw {
    grid-template-columns: minmax(0, 1fr);
    overflow: auto;
  }
  .vw > aside {
    overflow: auto;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vw .layer-btns {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .vw .layer-btns .btn {
    justify-content: flex-start;
  }
  .vw .center {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 240px;
  }
  .vw .stagebox {
    position: relative;
    flex: 1;
    display: flex;
    min-height: 0;
    padding: 8px;
  }
  .vw .view-note {
    padding: 8px 12px;
  }
  .stage.has-ref .board {
    fill: none;
    stroke: var(--mc-divider, rgba(127, 127, 127, 0.5));
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .ref {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .ref-pic {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
  }
  .ref-pic canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  .ref-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 12px;
    background: var(--mc-surface);
  }
  /* the panel floats over the workspace: opening it never changes the size of the canvas, so Fit to view keeps working */
  .ref-dock {
    position: relative;
    z-index: 12;
    height: 0;
  }
  .ref-panel {
    position: absolute;
    top: 4px;
    inset-inline-end: 12px;
    box-sizing: border-box;
    width: min(440px, calc(100% - 24px));
    display: grid;
    gap: 8px;
    padding: 8px 12px;
    max-height: min(60vh, 520px);
    overflow: auto;
    background: var(--mc-surface);
    border: 1px solid var(--mc-divider, rgba(127, 127, 127, 0.25));
    border-radius: 8px;
    box-shadow: var(--mc-shadow-float);
  }
  .ref-panel h2 {
    margin: 0;
    font-size: 1rem;
  }
  .ref-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .ref-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 8px;
  }
  .ref-op {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ref-op input {
    flex: 1 1 auto;
    min-width: 0;
  }
  @media (pointer: coarse) {
    .ref-panel .btn,
    .ref-pill .btn {
      min-height: 44px;
    }
  }
  /* the editor's own panels name grid areas of the full workspace; the view-only grid has none */
  .vw > .left,
  .vw > .center,
  .vw > .insp {
    grid-area: auto;
  }
  .topbar .nm-label {
    font-size: 0.8125rem;
    white-space: nowrap;
  }
  .left .layers {
    min-width: 0;
  }
  .left .layers .help {
    white-space: normal;
    overflow-wrap: anywhere;
  }
  @media (forced-colors: active) {
    [aria-pressed='true'],
    [aria-checked='true'],
    [aria-selected='true'] {
      outline: 3px solid Highlight;
      outline-offset: -3px;
    }
  }
`;
