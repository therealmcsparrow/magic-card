import { LitElement, css, html } from 'lit';
import type { PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { WALL_TABLET_CARD_WIDTH, WALL_TABLET_SCALE, WALL_TABLET_VIEWPORT } from '../contracts/theme-safety';

// Wall tablet preview: a 1280x800 tablet with one sample card, drawn at 0.2 so text shows at its size from 3 m away.

export interface WallTabletLabels {
  frame: string;
  caption: string;
  title: string;
  text: string;
  value: string;
  button: string;
}

const NAME_RE = /^--[A-Za-z0-9_-]+$/;
const BREAK_OUT_RE = /url\(|image-set\(|expression\(|javascript:|[;{}<>@\\]|\/\*/i;
const hasControl = (v: string): boolean => Array.from(v).some((c) => c.charCodeAt(0) < 32);

/** The entries of `vars` that are a custom property name with a value free of addresses and break-out marks. */
export function wallTabletVarsOf(vars: Readonly<Record<string, string>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(vars)) {
    if (NAME_RE.test(name) && typeof value === 'string' && value.trim() !== '' && !BREAK_OUT_RE.test(value) && !hasControl(value)) out[name] = value;
  }
  return out;
}

/** The tablet frame. `vars` are custom properties set one by one on the tablet; `labels` come from the host's own i18n table. */
export class WallTablet extends LitElement {
  @property({ attribute: false }) vars: Readonly<Record<string, string>> = {};
  @property({ attribute: false }) labels: WallTabletLabels = { frame: '', caption: '', title: '', text: '', value: '', button: '' };
  private _applied = new Set<string>();

  static styles = css`
    :host {
      display: block;
    }
    [data-frame] {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--divider-color, #888);
      border-radius: 4px;
      box-sizing: content-box;
    }
    [data-frame]:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    [data-tablet] {
      transform-origin: 0 0;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      padding: 24px;
      box-sizing: border-box;
    }
    [data-card] {
      box-sizing: border-box;
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
    }
    h3 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 500;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      color: var(--secondary-text-color, #727272);
      font-size: 14px;
    }
    .value {
      color: var(--primary-text-color, #212121);
      font-size: 28px;
    }
    .btn {
      margin-top: 12px;
      padding: 8px 16px;
      border-radius: 18px;
      display: inline-block;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      font-size: 14px;
    }
    .caption {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
    }
  `;

  protected updated(changed: PropertyValues): void {
    if (!changed.has('vars')) return;
    const tablet = this.renderRoot.querySelector<HTMLElement>('[data-tablet]');
    if (!tablet) return;
    const next = wallTabletVarsOf(this.vars);
    for (const name of this._applied) if (!(name in next)) tablet.style.removeProperty(name);
    for (const [name, value] of Object.entries(next)) tablet.style.setProperty(name, value);
    this._applied = new Set(Object.keys(next));
  }

  protected render() {
    const { width, height } = WALL_TABLET_VIEWPORT;
    const l = this.labels;
    return html`
      <div data-frame role="group" tabindex="0" aria-label=${l.frame} style=${styleMap({ width: `${width * WALL_TABLET_SCALE}px`, height: `${height * WALL_TABLET_SCALE}px` })}>
        <div data-tablet style=${styleMap({ width: `${width}px`, height: `${height}px`, transform: `scale(${WALL_TABLET_SCALE})` })}>
          <div data-card style=${styleMap({ width: `${WALL_TABLET_CARD_WIDTH}px` })}>
            <h3>${l.title}</h3>
            <div class="row"><span>${l.text}</span><span class="value">${l.value}</span></div>
            <span class="btn">${l.button}</span>
          </div>
        </div>
      </div>
      <p class="caption">${l.caption}</p>
    `;
  }
}

if (!customElements.get('mc-wall-tablet')) customElements.define('mc-wall-tablet', WallTablet);
