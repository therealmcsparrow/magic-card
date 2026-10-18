import { css, type CSSResult } from 'lit';

/*
 * Styles of <mc-path-canvas>. Colours are the editor tokens (src/css/editor-system, DESIGN.md): one
 * accent for the selection, the tool and live state; points are told apart by shape, never by colour
 * alone. The canvas does not import editor-system (it is 27 KB of CSS this chunk cannot afford): it
 * reads the --mc-* tokens its editor layer already sets on an ancestor (custom properties inherit
 * through the shadow root) and falls back to the same HA theme values when used alone.
 */
export const canvasStyles: CSSResult[] = [
  css`
    :host {
      --pc-accent: var(--mc-accent, var(--primary-color, #03a9f4));
      --pc-fill: var(--mc-accent-fill, #0277bd);
      --pc-tint: var(--mc-accent-tint, rgba(3, 169, 244, 0.12));
      --pc-on: var(--mc-on-accent, #fff);
      --pc-surface: var(--mc-surface, var(--card-background-color, #fff));
      --pc-border: var(--mc-field-border, #8c8c8c);
      --pc-divider: var(--mc-divider, var(--divider-color, #0002));
      --pc-text: var(--mc-text, var(--primary-text-color, #212121));
      --pc-text2: var(--mc-text-2, var(--secondary-text-color, #5f6368));
      --pc-shadow: var(--mc-shadow-float, 0 4px 16px #0003);
      --pc-mono: var(--mc-mono, monospace);
      --pc-ground: var(--mc-canvas, var(--primary-background-color, #f2f2f2));
      --pc-dot: var(--mc-canvas-dot, #0002);
      display: block;
      position: relative;
      min-height: 160px;
      overflow: hidden;
      overscroll-behavior: contain;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      background-color: var(--pc-ground);
      background-image: radial-gradient(var(--pc-dot) 1px, transparent 1px);
      background-size: 16px 16px;
      border-radius: 12px;
      outline: none;
    }
    :host([hidden]) {
      display: none;
    }
    /* The host draws the artwork and the ground underneath (SVG editor): the frame and the ground are see-through. */
    :host([underlay]) {
      background: none;
    }
    :host([underlay]) .frame {
      fill: transparent;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--pc-accent);
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
      fill: var(--pc-surface);
      stroke: var(--pc-border);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--pc-divider) 50%, transparent);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .safe {
      fill: none;
      stroke: var(--pc-border);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
    }
    .outline {
      fill: none;
      stroke: var(--pc-text);
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .outline.wash {
      fill: var(--pc-tint);
    }
    .outline.dim {
      stroke: var(--pc-text2);
    }
    .hline {
      stroke: var(--pc-accent);
      stroke-width: 1;
    }
    .pt {
      fill: var(--pc-surface);
      stroke: var(--pc-accent);
      stroke-width: 1.5;
    }
    .pt.sel {
      fill: var(--pc-fill);
      stroke: var(--pc-on);
    }
    .pt.h {
      stroke-width: 1;
    }
    .ring {
      fill: none;
      stroke: var(--pc-accent);
      stroke-width: 2;
    }
    .guide {
      stroke: var(--pc-accent);
      stroke-width: 1;
    }
    .marquee {
      fill: var(--pc-tint);
      stroke: var(--pc-accent);
      stroke-width: 1;
      stroke-dasharray: 3 2;
    }
    .tag rect {
      fill: var(--pc-fill);
    }
    .tag text {
      fill: var(--pc-on);
      font: 600 11px/1 system-ui, sans-serif;
    }
    .tb {
      fill: none;
      stroke: var(--pc-accent);
      stroke-width: 1;
      pointer-events: none;
    }
    .tbh {
      fill: var(--pc-surface);
      stroke: var(--pc-accent);
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
      font: 600 11px/1.3 var(--pc-mono);
      background: var(--pc-surface);
      color: var(--pc-text);
      box-shadow: var(--pc-shadow);
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
      outline: 2px solid var(--pc-accent);
      outline-offset: 2px;
    }
    .cross {
      stroke: var(--pc-accent);
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
      background: var(--pc-surface);
      box-shadow:
        0 0 0 1.5px var(--pc-text),
        var(--pc-shadow);
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
      font: 600 11px/1.3 var(--pc-mono);
      background: var(--pc-surface);
      color: var(--pc-text);
      box-shadow: var(--pc-shadow);
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
