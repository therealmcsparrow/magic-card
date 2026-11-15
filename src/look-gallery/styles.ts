import { css } from 'lit';
import { editorTokens } from '../css/editor-system';
import { editorPrimitives, kitCss } from '../ui-kit';

// Styles of the looks gallery, plus the contrast check that decides the selected-tile border.

type Rgb = [number, number, number];

/** An opaque colour from `rgb()`, `rgba()`, `color(srgb ...)` or `#rrggbb`; null for anything else (a keyword, a gradient, an unresolved variable). */
export function parseColour(value: string): Rgb | null {
  const v = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
  }
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(v);
  if (fn) return [Number(fn[1]), Number(fn[2]), Number(fn[3])];
  const srgb = /^color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(v);
  if (srgb) return [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255];
  return null;
}

const channel = (c: number): number => {
  const s = Math.min(255, Math.max(0, c)) / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: Rgb): number => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** WCAG contrast ratio of two colours. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Minimum contrast of a tile border against the surface and the tint (WCAG 1.4.11). */
export const BORDER_MIN_CONTRAST = 3;

/**
 * Which colour the selected tile's border takes: the accent ink when it holds 3:1 on both the surface and the tint, otherwise
 * the theme text colour. A colour that cannot be read gives 'text', which every theme keeps legible.
 */
export function selectedBorder(accentInk: string, surface: string, tint: string): 'accent' | 'text' {
  const ink = parseColour(accentInk);
  const s = parseColour(surface);
  const t = parseColour(tint);
  if (!ink || !s || !t) return 'text';
  return contrastRatio(ink, s) >= BORDER_MIN_CONTRAST && contrastRatio(ink, t) >= BORDER_MIN_CONTRAST ? 'accent' : 'text';
}

/** The colour a custom property resolves to for `el`, read through a probe so var() and colour-mix() chains are computed. */
export function resolvedColour(el: HTMLElement, property: string): string {
  const probe = document.createElement('span');
  probe.style.cssText = `position:absolute;visibility:hidden;color:var(${property})`;
  el.append(probe);
  const out = getComputedStyle(probe).color;
  probe.remove();
  return out;
}

export const galleryStyles = [
  editorTokens,
  editorPrimitives,
  ...kitCss,
  css`
    :host {
      display: block;
      color: var(--mc-text);
      font-family: var(--mc-font, inherit);
      padding-bottom: 8px;
    }
    [hidden] {
      display: none !important;
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      justify-content: space-between;
    }
    .intro {
      margin: 0 0 12px;
      font-size: 0.875rem;
      line-height: 1.4;
    }
    .live:empty {
      display: none;
    }
    .live {
      margin: 8px 0;
      font-size: 0.875rem;
    }
    .notices {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
    }
    .stage {
      display: grid;
      justify-items: center;
      margin-bottom: 12px;
      padding: 12px;
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg, 12px);
      background: var(--mc-canvas);
    }
    .card-wrap {
      width: min(100%, 420px);
      pointer-events: none;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(168px, 100%), 1fr));
      gap: 8px;
      padding: 4px;
      scroll-padding-bottom: var(--bar-h, 0px);
    }
    .lg-tile {
      position: relative;
      display: grid;
      align-content: start;
      gap: 4px;
      min-width: 0;
      padding: 8px;
      border: 2px solid var(--mc-divider);
      border-radius: var(--mc-radius);
      background: var(--mc-surface);
      color: var(--mc-text);
      font-size: 0.8125rem;
      text-align: start;
      cursor: pointer;
    }
    .lg-tile:hover {
      border-color: var(--mc-text);
    }
    .lg-tile[aria-checked='true'] {
      border: 2px solid var(--mc-accent-ink);
      background: var(--mc-accent-tint);
    }
    :host([data-ink='text']) .lg-tile[aria-checked='true'] {
      border-color: var(--mc-text);
    }
    .lg-tile:focus {
      outline: 2px solid var(--mc-text);
      outline-offset: 2px;
    }
    @supports selector(:focus-visible) {
      .lg-tile:focus:not(:focus-visible) {
        outline: none;
      }
      .lg-tile:focus-visible {
        outline: 2px solid var(--mc-text);
        outline-offset: 2px;
      }
    }
    .lg-check {
      position: absolute;
      top: 6px;
      right: 6px;
      inset-inline: auto 6px;
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--mc-accent-ink);
      color: var(--mc-surface);
    }
    :host([data-ink='text']) .lg-check {
      background: var(--mc-text);
    }
    .thumb {
      display: grid;
      place-items: center;
      width: 100%;
      height: 126px;
      border-radius: 6px;
      background: var(--mc-canvas);
      overflow: hidden;
    }
    @supports (aspect-ratio: 4 / 3) {
      .thumb {
        height: auto;
        aspect-ratio: 4 / 3;
      }
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .initial {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--mc-text);
    }
    .name {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      overflow-wrap: anywhere;
    }
    .meta {
      display: block;
      overflow-wrap: anywhere;
      font-size: 0.75rem;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--mc-accent-tint);
      color: var(--mc-accent-ink);
      font-size: 0.75rem;
      overflow-wrap: anywhere;
    }
    .pill.warn {
      background: var(--mc-warn-tint);
      color: var(--mc-warn-ink);
    }
    .skeleton {
      min-height: 156px;
      border-radius: var(--mc-radius);
      background: var(--mc-canvas);
      border: 1px solid var(--mc-divider);
    }
    .refused h3 {
      margin: 16px 0 8px;
      font-size: 0.9375rem;
    }
    .refused ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .refused li {
      display: grid;
      gap: 4px;
      padding: 8px;
      border: 1px dashed var(--mc-divider);
      border-radius: var(--mc-radius);
      background: var(--mc-surface);
      scroll-margin-bottom: calc(var(--bar-h, 0px) + 16px);
    }
    .reason {
      display: flex;
      gap: 6px;
      align-items: flex-start;
      color: var(--mc-error-ink);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
    .code {
      font-size: 0.75rem;
      color: var(--mc-text);
      opacity: 0.8;
    }
    a.report {
      scroll-margin-bottom: calc(var(--bar-h, 0px) + 16px);
      color: var(--mc-accent-ink);
      font-size: 0.8125rem;
      overflow-wrap: anywhere;
    }
    .bar {
      position: sticky;
      bottom: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 40vh;
      overflow: auto;
      margin-top: 12px;
      padding: 12px;
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg, 12px);
      background: var(--mc-surface);
    }
    .bar .status {
      margin: 0;
      font-size: 0.875rem;
      overflow-wrap: anywhere;
    }
    .bar .details {
      overflow: auto;
      min-height: 0;
      display: grid;
      gap: 8px;
      font-size: 0.8125rem;
    }
    .bar .details p,
    .bar .details h4,
    .bar .details ul {
      margin: 0;
    }
    .bar .details ul {
      padding: 0 0 0 18px;
      padding-inline: 18px 0;
    }
    .bar .buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }
    .bar > * {
      flex-shrink: 0;
    }
    .bar .buttons:last-child {
      position: sticky;
      bottom: 0;
      background: var(--mc-surface);
    }
    .bar .buttons .grow {
      margin-right: auto;
      margin-inline: 0 auto;
    }
    @media (max-width: 599px) {
      .bar .buttons .btn {
        flex: 1 1 auto;
      }
    }
  `,
];
