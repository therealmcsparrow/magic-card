import { css, CSSResult } from 'lit';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { editorLegacy } from '../ui-kit/css/legacy';

/* ================================================================== */
/*  STUDIO EDITOR DESIGN SYSTEM                                        */
/*  One shared stylesheet for every editor component:                  */
/*    static styles = [editorSystem, css`...own small css...`]         */
/*  Colors come only from HA theme variables (with fallbacks).         */
/* ================================================================== */

export const editorTokens: CSSResult = css`
  :host {
    --mc-accent: var(--primary-color, #03a9f4);
    --mc-accent-ink: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
    /* filled accent surfaces (primary button, checked switch): darkened so white text/knob stays >= 4.5:1 in both themes */
    --mc-accent-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
    --mc-on-accent: #fff;
    --mc-accent-tint: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    --mc-surface: var(--card-background-color, #fff);
    --mc-surface-2: var(--secondary-background-color, #f2f3f5);
    --mc-ground: var(--primary-background-color, #fafafa);
    --mc-text: var(--primary-text-color, #212121);
    --mc-text-2: var(--secondary-text-color, #5f6368);
    --mc-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --mc-field-border: color-mix(in srgb, var(--primary-text-color, #212121) 50%, transparent);
    --mc-warn-ink: color-mix(in srgb, var(--warning-color, #ff9800) 45%, var(--primary-text-color, #212121));
    --mc-warn-tint: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    --mc-error-ink: color-mix(in srgb, var(--error-color, #db4437) 75%, var(--primary-text-color, #212121));
    --mc-success: var(--success-color, #43a047);
    /*
     * Selection colour per level (canvas frame, handles, name tag, hover; layers + inspector tile).
     * stroke: frame/hover border; fill: name tag behind white text (mixed toward black, >= 4.5:1);
     * ink: text/icons on Surface or on the 12% tint (>= 4.5:1 light + dark); tint: selected-row wash.
     */
    --mc-sel-module: var(--mc-accent);
    --mc-sel-module-fill: var(--mc-accent-fill);
    --mc-sel-module-ink: var(--mc-accent-ink);
    --mc-sel-module-tint: var(--mc-accent-tint);
    --mc-sel-col: color-mix(in srgb, var(--success-color, #43a047) 85%, var(--primary-text-color, #212121));
    --mc-sel-col-fill: color-mix(in srgb, var(--success-color, #43a047) 70%, #000);
    --mc-sel-col-ink: color-mix(in srgb, var(--success-color, #43a047) 60%, var(--primary-text-color, #212121));
    --mc-sel-col-tint: color-mix(in srgb, var(--success-color, #43a047) 12%, transparent);
    --mc-sel-row: color-mix(in srgb, var(--warning-color, #ff9800) 70%, var(--primary-text-color, #212121));
    --mc-sel-row-fill: color-mix(in srgb, var(--warning-color, #ff9800) 55%, #000);
    --mc-sel-row-ink: var(--mc-warn-ink);
    --mc-sel-row-tint: var(--mc-warn-tint);
    --mc-sel-card: var(--mc-text-2);
    --mc-sel-card-fill: color-mix(in srgb, var(--secondary-text-color, #5f6368) 70%, #000);
    --mc-sel-card-ink: color-mix(in srgb, var(--secondary-text-color, #5f6368) 60%, var(--primary-text-color, #212121));
    --mc-sel-card-tint: color-mix(in srgb, var(--secondary-text-color, #5f6368) 12%, transparent);
    --mc-canvas: color-mix(in srgb, var(--primary-text-color, #212121) 6%, var(--primary-background-color, #fafafa));
    --mc-canvas-dot: color-mix(in srgb, var(--primary-text-color, #212121) 16%, transparent);
    --mc-shadow-float: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
    --mc-mono: 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
    --mc-radius: 8px;
    --mc-radius-lg: 12px;
    /* ui-kit tokens (contract ui-kit 1.0.0, ADR 0030); the layers and the theme editor use the same names */
    --mc-hit: 40px;
    --mc-font: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, system-ui, sans-serif));
    --mc-focus: color-mix(in srgb, var(--mc-accent) 80%, var(--mc-text));
    --mc-error-tint: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
    --mc-error-fill: color-mix(in srgb, var(--error-color, #db4437) 75%, #000);
    --mc-success-ink: color-mix(in srgb, var(--success-color, #43a047) 55%, var(--primary-text-color, #212121));
    --mc-success-tint: color-mix(in srgb, var(--success-color, #43a047) 12%, transparent);
    --mc-scrim: rgba(0, 0, 0, 0.38);
    font-family: inherit;
    color: var(--mc-text);
    caret-color: var(--mc-accent);
  }
  @media (pointer: coarse) {
    :host {
      --mc-hit: 44px;
    }
  }
`;

/* editorPrimitives and editorLegacy moved to the ui-kit Module (ADR 0030); re-exported until UI10. */
export { editorPrimitives, editorLegacy };

export const editorSystem: CSSResult[] = [editorTokens, editorPrimitives, editorLegacy];
