import { css, unsafeCSS, type CSSResult } from 'lit';

/*
 * Layer editor tokens (designer 11 section A; Marco 12 N1). Every control edge in the Placement, Layer and
 * Card backdrop groups uses --mc-ed-ctl-line (>= 3:1 against its panel, WCAG 1.4.11); selected and on / off
 * states carry a non-colour cue as well (check mark, bold label, 2 px border, "On" / "Off" text).
 *
 * The line is the theme's text colour mixed into the panel colour. LAYER_TOKENS are the fixed fallback for
 * a browser without color-mix and the values the sampler test measures; the test also samples the theme
 * mix on the HA default light and dark themes and on one custom theme.
 */

/** Share of the text colour in the control line (theme mix). */
export const CTL_LINE_STRENGTH = 0.65;

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

/** Control edges, selected cues, focus ring and the coarse-pointer sizes shared by the layer editor components. */
export const layerControlCss: CSSResult = css`
  :host {
    --mc-ed-ctl-line: ${unsafeCSS(LAYER_TOKENS.light.ctlLine)};
    --mc-ed-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --lyr-hit: 32px;
    --lyr-gap: 4px;
  }
  @supports (color: color-mix(in srgb, red, blue)) {
    :host {
      --mc-ed-ctl-line: color-mix(in srgb, var(--primary-text-color, #212121) ${Math.round(CTL_LINE_STRENGTH * 100)}%, var(--card-background-color, #fff));
    }
  }
  @media (pointer: coarse) {
    :host {
      --lyr-hit: 44px;
      --lyr-gap: 8px;
    }
  }
  .lyr-btn,
  .lseg > button,
  .lyr-order button,
  .lyr-tile,
  .lyr-input,
  select.lyr-input {
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
    padding: 0 10px;
    min-width: 0;
  }
  button:focus-visible,
  select:focus-visible,
  input:focus-visible,
  [tabindex]:focus-visible {
    outline: 2px solid var(--mc-text, var(--primary-text-color, #212121));
    outline-offset: 2px;
    box-shadow: 0 0 0 1px var(--mc-surface, var(--card-background-color, #fff));
  }
  /* selected = fill + check mark + 2 px border in the text colour + bold label (never a hue alone) */
  .lseg > button[aria-pressed='true'],
  .lyr-tile[aria-pressed='true'],
  .lyr-order button[aria-pressed='true'] {
    border: 2px solid var(--mc-text, var(--primary-text-color, #212121));
    background: var(--mc-accent-tint, rgba(3, 169, 244, 0.12));
    font-weight: 700;
  }
  /* off-state edge of a switch and a slider track: the same 3:1 line, plus the On / Off words */
  .lyr-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: var(--lyr-hit);
    min-width: var(--lyr-hit);
  }
  .lyr-switch .track {
    position: relative;
    flex: none;
    width: 44px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 9999px;
    border: 2px solid var(--mc-ed-ctl-line);
    background: transparent;
    padding: 0;
  }
  .lyr-switch .track::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--mc-ed-ctl-line);
  }
  .lyr-switch[aria-checked='true'] .track {
    border-color: var(--mc-text, var(--primary-text-color, #212121));
    background: var(--mc-accent-fill, #0277bd);
  }
  .lyr-switch[aria-checked='true'] .track::after {
    transform: translateX(20px);
    background: #fff;
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
    background: var(--mc-text, var(--primary-text-color, #212121));
    box-shadow: 0 0 0 1px var(--mc-ed-ctl-line);
  }
  .lyr-range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid var(--mc-surface, var(--card-background-color, #fff));
    background: var(--mc-text, var(--primary-text-color, #212121));
    box-shadow: 0 0 0 1px var(--mc-ed-ctl-line);
  }
  @media (forced-colors: active) {
    .lseg > button[aria-pressed='true'],
    .lyr-tile[aria-pressed='true'] {
      background: Highlight;
      color: HighlightText;
      border-color: CanvasText;
    }
    .lyr-btn,
    .lseg > button,
    .lyr-input {
      border-color: CanvasText;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`;
