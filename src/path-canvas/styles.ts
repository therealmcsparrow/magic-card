import { css, type CSSResult } from 'lit';

/*
 * Styles of <mc-path-canvas> (path-canvas). Colours are the ui-kit tokens (Core editorTokens, DESIGN.md): one accent for
 * the selection, the tool and live state; points are told apart by shape, never by colour alone. The canvas imports no
 * token CSS (27 KB this chunk cannot afford): it reads the --mc-* tokens its editor layer sets on an ancestor (custom
 * properties inherit through the shadow root). No local alias block.
 */
export const canvasStyles: CSSResult[] = [
  css`
    :host {
      display: block;
      position: relative;
      min-height: 160px;
      overflow: hidden;
      overscroll-behavior: contain;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      background-color: var(--mc-canvas);
      background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1px);
      background-size: 16px 16px;
      border-radius: 12px;
      outline: none;
    }
    :host([hidden]) {
      display: none;
    }
    /* The host draws the artwork and the ground underneath (SVG editor): the frame and the ground are see-through. */
    :host([underlay]),
    :host([overlay]) {
      background: none;
    }
    /* Overlay mode: the host's picture lies under the canvas and takes every press the canvas does not; the canvas listens on the page instead. */
    :host([overlay]) {
      pointer-events: none;
      min-height: 0;
      border-radius: 0;
    }
    :host([overlay]) .rot {
      pointer-events: auto;
    }
    :host([underlay]) .frame {
      fill: transparent;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--mc-accent);
      outline-offset: 2px;
    }
    svg.surface {
      display: block;
      width: 100%;
      height: 100%;
      min-height: inherit;
      touch-action: none;
      -webkit-touch-callout: none;
      user-select: none;
    }
    .frame {
      fill: var(--mc-surface);
      stroke: var(--mc-field-border);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--mc-divider) 50%, transparent);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .safe {
      fill: none;
      stroke: var(--mc-field-border);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
    }
    .outline {
      fill: none;
      stroke: var(--mc-text);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .outline.wash {
      fill: var(--mc-accent-tint);
    }
    .outline.dim {
      stroke: var(--mc-text-2);
    }
    .hline {
      stroke: var(--mc-accent);
      stroke-width: 1;
    }
    .pt {
      fill: var(--mc-surface);
      stroke: var(--mc-accent);
      stroke-width: 1.5;
    }
    .pt.sel {
      fill: var(--mc-accent-fill);
      stroke: var(--mc-on-accent, #fff);
    }
    .pt.h {
      stroke-width: 1;
    }
    .ring {
      fill: none;
      stroke: var(--mc-accent);
      stroke-width: 2;
    }
    .guide {
      stroke: var(--mc-accent);
      stroke-width: 1;
    }
    .marquee {
      fill: var(--mc-accent-tint);
      stroke: var(--mc-accent);
      stroke-width: 1;
      stroke-dasharray: 3 2;
    }
    .tag rect {
      fill: var(--mc-accent-fill);
    }
    .tag text {
      fill: var(--mc-on-accent, #fff);
      font: 600 11px/1 system-ui, sans-serif;
    }
    .tb {
      fill: none;
      stroke: var(--mc-accent);
      stroke-width: 1;
      pointer-events: none;
    }
    .tbh {
      fill: var(--mc-surface);
      stroke: var(--mc-accent);
      stroke-width: 1.5;
      pointer-events: none;
    }
    .read {
      position: absolute;
      z-index: 2;
      pointer-events: none;
      width: max-content;
      padding: 1px 6px;
      border-radius: 4px;
      font: 600 11px/1.3 var(--mc-mono, monospace);
      background: var(--mc-surface);
      color: var(--mc-text);
      box-shadow: var(--mc-shadow-float);
    }
    .read.up {
      transform: translateX(-50%);
    }
    .rot {
      position: absolute;
      box-sizing: border-box;
      border-radius: 50%;
      pointer-events: none;
      outline: none;
    }
    .rot:focus-visible {
      outline: 2px solid var(--mc-accent);
      outline-offset: 2px;
    }
    .cross {
      stroke: var(--mc-accent);
      stroke-width: 1.5;
    }
    .loupe {
      position: absolute;
      width: 72px;
      pointer-events: none;
      z-index: 2;
    }
    .loupe .lens {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--mc-surface);
      box-shadow:
        0 0 0 1.5px var(--mc-text),
        var(--mc-shadow-float);
    }
    .loupe svg {
      display: block;
      width: 72px;
      height: 72px;
    }
    .loupe .lbl {
      display: block;
      margin-top: 4px;
      transform: translateX(-50%);
      margin-left: 36px;
      width: max-content;
      max-width: 200px;
      padding: 1px 6px;
      border-radius: 4px;
      font: 600 11px/1.3 var(--mc-mono, monospace);
      background: var(--mc-surface);
      color: var(--mc-text);
      box-shadow: var(--mc-shadow-float);
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
      list-style: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .loupe {
        animation: mc-loupe-in 90ms ease-out;
      }
    }
    @keyframes mc-loupe-in {
      from {
        opacity: 0;
      }
    }
  `,
];
