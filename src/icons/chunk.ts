import { VERSION } from '../version';
import { McSvgIcon } from './mc-svg-icon';
// The sanitiser is a static import of the sink in this chunk (icon-source.ts, mc-svg-icon.ts) and is named here too, so
// the chunk never depends on another chunk for it (AC14; tools/check-svg-sinks.mjs reads the built graph).
import './svg-sanitize';
import { onIconGeometry, peekIconGeometry, registerSvgGeometry, resolveIconGeometry, setIconGeometry } from './icon-source';

/*
 * Chunk entry of dist/magic-card-svg-icon.js (contract lazy-module 1.4.0, icon-library, mcu-library). Evaluating this file
 * changes nothing global: everything happens in install(), which src/utils/lazy-chunk.ts calls only when BUILD matches the
 * magic-card.js that loaded it (AC13). Holds the icon source (icon packs, `mcu:` library icons, own SVG), <mc-svg-icon> and
 * the SVG sanitiser. A plain Material Design Icon never loads it: renderIcon keeps <ha-icon> (src/icons/render-icon.ts).
 */

declare const __MC_BUILD_VERSION__: string | undefined;

export const BUILD: string = typeof __MC_BUILD_VERSION__ === 'string' ? __MC_BUILD_VERSION__ : VERSION;

/**
 * The one copy of the icon source's state (geometry cache, listeners, `mcu:` client, own SVGs). The editor chunks reach it
 * through svgIconApi() (src/utils/svg-icon-loader.ts) and never hold a copy of icon-source.ts (ADR 0045 rule 3).
 */
export const api = { resolveIconGeometry, onIconGeometry, setIconGeometry, peekIconGeometry, registerSvgGeometry };

export function install(): void {
  if (!customElements.get('mc-svg-icon')) customElements.define('mc-svg-icon', McSvgIcon);
}
