import { css, unsafeCSS, type CSSResult } from 'lit';

/*
 * Layer editor tokens: control edges use --mc-ed-ctl-line (>= 3:1, WCAG 1.4.11), derived from the kit field border.
 * LAYER_TOKENS are the fixed fallback for browsers without color-mix.
 */

/** Share of the text colour in the control line (theme mix). */
export const CTL_LINE_STRENGTH = 0.5;

export interface LayerTokenSet {
  panel: string;
  page: string;
  ctlLine: string;
  accent: string;
  onAccent: string;
  helpText: string;
}

export const LAYER_TOKENS: { dark: LayerTokenSet; light: LayerTokenSet } = {
  dark: { panel: '#26262a', page: '#1c1c1e', ctlLine: '#7b7b87', accent: '#4aa3ff', onAccent: '#001018', helpText: '#a9a9b3' },
  light: { panel: '#ffffff', page: '#f4f4f6', ctlLine: '#85858f', accent: '#0b57d0', onAccent: '#ffffff', helpText: '#5b5b66' },
};

type Rgb = [number, number, number];

export function parseHex(hex: string): Rgb {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}

/** WCAG relative luminance of an sRGB colour. */
export function luminance([r, g, b]: Rgb): number {
  const lin = (v: number): number => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio of two hex colours (1 to 21). */
export function contrast(a: string, b: string): number {
  const la = luminance(parseHex(a));
  const lb = luminance(parseHex(b));
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** The theme mix the stylesheet computes with color-mix(in srgb): text over panel at `strength`. */
export function mixLine(text: string, panel: string, strength = CTL_LINE_STRENGTH): string {
  const t = parseHex(text);
  const p = parseHex(panel);
  const ch = (i: number): string => Math.round(t[i] * strength + p[i] * (1 - strength)).toString(16).padStart(2, '0');
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

/**
 * Layer editor controls on the ui-kit look. Buttons, inputs and chips take the kit classes (btn, input, chip) in the
 * markup; this sheet only holds what the kit has no class for: the pressed segment and tile, the switch with its
 * On / Off word, the range, the coarse-pointer sizes. Every control edge is --mc-ed-ctl-line (the kit field border,
 * >= 3:1); containers (rows, boxes) use the kit divider.
 */
export const layerControlCss: CSSResult = css`
  :host {
    --mc-ed-ctl-line: ${unsafeCSS(LAYER_TOKENS.light.ctlLine)};
    --mc-ed-divider: var(--mc-divider, var(--divider-color, rgba(0, 0, 0, 0.12)));
    --lyr-hit: 32px;
    --lyr-gap: 4px;
  }
  @supports (color: color-mix(in srgb, red, blue)) {
    :host {
      --mc-ed-ctl-line: var(--mc-field-border, color-mix(in srgb, var(--primary-text-color, #212121) ${Math.round(CTL_LINE_STRENGTH * 100)}%, var(--card-background-color, #fff)));
    }
  }
  @media (pointer: coarse) {
    :host {
      --lyr-hit: 44px;
      --lyr-gap: 8px;
    }
  }
  /* the kit secondary button's edge, for hosts that do not load the kit stylesheet (the position grid); the layer
     groups also put the kit classes btn btn-secondary btn-sm on it, which draw the same thing */
  .lyr-btn {
    box-sizing: border-box;
    min-height: var(--lyr-hit);
    border: 1px solid var(--mc-ed-ctl-line);
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface, var(--card-background-color, #fff));
    color: var(--mc-text, var(--primary-text-color, #212121));
    font: inherit;
    font-size: 0.8125rem;
  }
  .lyr-input {
    min-height: var(--mc-hit, 40px);
    min-width: 0;
  }
  .lseg > button,
  .lyr-order button {
    box-sizing: border-box;
    min-height: var(--lyr-hit);
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--mc-text-2, #5f6368);
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .lyr-tile {
    box-sizing: border-box;
    min-height: var(--lyr-hit);
    border: 1px solid var(--mc-ed-ctl-line);
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface, var(--card-background-color, #fff));
    color: var(--mc-text, var(--primary-text-color, #212121));
    font: inherit;
    font-size: 0.8125rem;
  }
  @media (hover: hover) {
    .lseg > button:hover,
    .lyr-order button:hover {
      background: var(--mc-surface, var(--card-background-color, #fff));
      color: var(--mc-text, var(--primary-text-color, #212121));
    }
    .lyr-tile:hover {
      background: var(--mc-surface-2, #f2f3f5);
    }
  }
  button:focus-visible,
  select:focus-visible,
  input:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-text, #212121));
    outline-offset: 2px;
  }
  /* the kit segmented control: a tray with the 3:1 edge; the pressed segment lifts, is bold, underlined and ticked */
  .lseg {
    padding: 3px;
    border: 1px solid var(--mc-ed-ctl-line);
    border-radius: 10px;
    background: var(--mc-surface-2, #f2f3f5);
    gap: 2px;
  }
  .lseg > button[aria-pressed='true'],
  .lyr-order button[aria-pressed='true'] {
    background: var(--mc-surface, var(--card-background-color, #fff));
    color: var(--mc-accent-ink, var(--mc-text, #212121));
    box-shadow: 0 0 0 1px var(--mc-divider, rgba(0, 0, 0, 0.12)), inset 0 -3px 0 var(--mc-accent-ink, currentColor);
    font-weight: 700;
  }
  /* the kit tile: pressed = accent ring doubled to 2 px, tint, bold label and the tick in the label */
  .lyr-tile[aria-pressed='true'] {
    border-color: var(--mc-accent-ink, var(--mc-text, #212121));
    box-shadow: inset 0 0 0 1px var(--mc-accent-ink, var(--mc-text, #212121));
    background: var(--mc-accent-tint, rgba(3, 169, 244, 0.12));
    font-weight: 700;
  }
  /* the kit switch pill, with the On / Off word beside it (the word and the thumb position carry the state) */
  .lyr-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: var(--lyr-hit);
    min-width: var(--lyr-hit);
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
  }
  .lyr-switch .track {
    position: relative;
    flex: none;
    width: 40px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 9999px;
    border: 0;
    background: var(--mc-ed-ctl-line);
    transition: background-color 0.15s ease-out;
    padding: 0;
  }
  .lyr-switch .track::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--mc-on-accent, var(--mc-surface, var(--card-background-color, #fff)));
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s ease-out;
  }
  .lyr-switch[aria-checked='true'] .track {
    background: var(--mc-accent-fill, #0277bd);
  }
  .lyr-switch[aria-checked='true'] .track::after {
    transform: translateX(16px);
  }
  .lyr-switch .state {
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 2.2em;
  }
  .lyr-range {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    min-height: var(--lyr-hit);
    margin: 0;
    background: transparent;
  }
  ha-slider.lyr-range::part(label) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .lyr-range::-webkit-slider-runnable-track {
    height: 8px;
    border-radius: 4px;
    border: 1px solid var(--mc-ed-ctl-line);
    background: var(--mc-surface, var(--card-background-color, #fff));
  }
  .lyr-range::-moz-range-track {
    height: 6px;
    border-radius: 4px;
    border: 1px solid var(--mc-ed-ctl-line);
    background: var(--mc-surface, var(--card-background-color, #fff));
  }
  .lyr-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    margin-top: -8px;
    border-radius: 50%;
    border: 2px solid var(--mc-surface, var(--card-background-color, #fff));
    background: var(--mc-accent-fill, var(--mc-text, #212121));
    box-shadow: 0 0 0 1px var(--mc-ed-ctl-line);
  }
  .lyr-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--mc-surface, var(--card-background-color, #fff));
    background: var(--mc-accent-fill, var(--mc-text, #212121));
    box-shadow: 0 0 0 1px var(--mc-ed-ctl-line);
  }
  @media (forced-colors: active) {
    .lseg > button[aria-pressed='true'],
    .lyr-tile[aria-pressed='true'] {
      background: Highlight;
      color: HighlightText;
      border-color: CanvasText;
    }
    .lyr-tile,
    .lseg,
    .lyr-input {
      border-color: CanvasText;
    }
    .lyr-switch .track {
      border: 2px solid CanvasText;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`;
