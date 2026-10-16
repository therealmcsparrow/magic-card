import { LitElement, html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, MagicCardConfig } from '../../types';
import { editorSystem } from '../../css/editor-system';
import { collectNotSynced } from '../state/template-sync';
import { MenuPopover } from '../components/menu-popover';

/**
 * Template link status + actions.
 * Fires (bubbles, composed): template-create, template-load, template-resync, template-save, template-unlink.
 */
@customElement('mc-template-bar')
export class TemplateBar extends LitElement {
  @property({ attribute: false }) config?: MagicCardConfig;
  @property({ attribute: false }) hass?: HomeAssistant;
  /** Studio topbar: chips + Manage only, no surface; unlinked state collapses into a "No template" menu chip. */
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private _menuOpen = false;

  private _menu = new MenuPopover(this, {
    menu: () => this.shadowRoot?.querySelector<HTMLElement>('.menu'),
    onClose: () => {
      this._menuOpen = false;
    },
    align: 'start',
  });

  private _fire(name: string): void {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  private _closeMenu(refocus: boolean): void {
    this._menu.close(refocus);
  }

  private _act(name: string): void {
    this._closeMenu(true);
    this._fire(name);
  }

  private _toggleMenu = (e: Event): void => {
    this._menuOpen = true;
    this._menu.open(e.currentTarget as HTMLElement);
  };

  /**
   * Mockup: the template chip is the menu button (link · name · chevron), next to the override chip;
   * in the pane, a "Re-sync N overrides" text button sits on the right while anything is overridden.
   */
  protected render(): TemplateResult {
    const name = this.config?.template;
    if (!name) {
      return html`
        <div class="tpl-bar">
          <div class="tpl-text">
            ${this.compact ? nothing : html`<span class="tpl-label">Not linked to a template</span>`}
            <button
              type="button"
              class="chip manage"
              aria-haspopup="menu"
              aria-expanded=${this._menuOpen ? 'true' : 'false'}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant-off"></ha-icon>No template<ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>
          ${this._menuOpen
            ? html`
                <div class="menu" role="menu" aria-label="Template actions" @keydown=${this._menu.onKeydown}>
                  <button type="button" role="menuitem" @click=${() => this._act('template-load')}>
                    <ha-icon icon="mdi:folder-open-outline"></ha-icon>Load template…
                  </button>
                  <button type="button" role="menuitem" @click=${() => this._act('template-create')}>
                    <ha-icon icon="mdi:plus"></ha-icon>Create template from this card
                  </button>
                </div>
              `
            : nothing}
        </div>
      `;
    }
    const entries = this.config ? collectNotSynced(this.config) : [];
    const count = entries.reduce((n, e) => n + e.paths.length, 0);
    const overrides = `${count} ${count === 1 ? 'override' : 'overrides'}`;
    return html`
      <div class="tpl-bar linked">
        <div class="tpl-text">
          ${this.compact ? nothing : html`<span class="tpl-label">Template</span>`}
          <span class="chips">
            <button
              type="button"
              class="chip is-accent manage"
              title="Template actions"
              aria-haspopup="menu"
              aria-expanded=${this._menuOpen ? 'true' : 'false'}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant"></ha-icon><span class="nm">${name}</span><ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${count > 0 ? html`<span class="chip is-warn">${overrides}</span>` : html`<span class="chip">In sync</span>`}
          </span>
        </div>
        ${!this.compact && count > 0
          ? html`
              <div class="tpl-actions">
                <button type="button" class="btn btn-text btn-sm" @click=${() => this._fire('template-resync')}>
                  <ha-icon icon="mdi:sync"></ha-icon>Re-sync ${overrides}
                </button>
              </div>
            `
          : nothing}
        ${this._menuOpen ? this._renderMenu(name, entries, count) : nothing}
      </div>
    `;
  }

  private _renderMenu(name: string, entries: Array<{ location: string; paths: string[] }>, count: number): TemplateResult {
    return html`
      <div class="menu" role="menu" aria-label="Template actions" @keydown=${this._menu.onKeydown}>
        <p class="menu-note">
          Linked to template <span class="mono">${name}</span>.
          ${count ? `${count} field${count === 1 ? '' : 's'} differ locally.` : 'Fully in sync.'}
        </p>
        ${entries.length
          ? html`
              <ul class="ovr">
                ${entries.map(
                  (e) => html`<li><span class="loc">${e.location}</span><span class="paths mono">${e.paths.map((p) => p.replace('design.', '')).join(', ')}</span></li>`,
                )}
              </ul>
            `
          : nothing}
        <button type="button" role="menuitem" ?disabled=${count === 0} @click=${() => this._act('template-resync')}>
          <ha-icon icon="mdi:sync"></ha-icon>Re-sync ${count} ${count === 1 ? 'override' : 'overrides'}
        </button>
        <button type="button" role="menuitem" @click=${() => this._act('template-save')}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>Save to template
        </button>
        <hr />
        <button type="button" role="menuitem" class="danger" @click=${() => this._act('template-unlink')}>
          <ha-icon icon="mdi:link-variant-off"></ha-icon>Unlink from template
        </button>
      </div>
    `;
  }

  static styles = [
    editorSystem,
    css`
      :host {
        display: block;
      }
      .tpl-bar {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 12px;
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface-2);
      }
      .tpl-text {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        flex: 1 1 200px;
        min-width: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .tpl-text .chip .nm {
        overflow-wrap: anywhere;
        white-space: normal;
        line-height: 1.25;
      }
      /* A long template name wraps inside its chip: give the lines room instead of touching the border. */
      .tpl-text .chip:has(.nm) {
        padding-block: 3px;
      }
      .tpl-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-left: auto;
      }
      /* The chips stay together; when space runs out the "Template" label moves above them. */
      .chips {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .manage[aria-expanded='true'] {
        background: var(--mc-surface);
        color: var(--mc-text);
      }
      .manage ha-icon:last-child {
        transition: transform 0.15s ease-out;
      }
      .manage[aria-expanded='true'] ha-icon:last-child {
        transform: rotate(180deg);
      }
      .menu {
        top: calc(100% + 6px);
        left: 0;
        width: min(320px, 100%);
      }
      :host([compact]) .tpl-bar {
        padding: 0;
        background: none;
        border-radius: 0;
        gap: 8px;
      }
      :host([compact]) .tpl-text {
        flex: 0 1 auto;
      }
      :host([compact]) .tpl-actions {
        margin-left: 0;
      }
      :host([compact]) .menu {
        width: 320px;
        max-width: calc(100vw - 32px);
      }
      .menu-note {
        margin: 0;
      }
      .ovr {
        list-style: none;
        margin: 0 0 4px;
        padding: 0 12px 8px;
        display: grid;
        gap: 6px;
        font-size: 0.75rem;
        border-bottom: 1px solid var(--mc-divider);
      }
      .ovr li {
        display: grid;
        gap: 2px;
      }
      .ovr .loc {
        font-weight: 500;
        color: var(--mc-text);
      }
      .ovr .paths {
        font-size: 0.75rem;
        color: var(--mc-warn-ink);
        overflow-wrap: anywhere;
      }
      .menu button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .menu button.danger,
      .menu button.danger ha-icon {
        color: var(--mc-error-ink);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'mc-template-bar': TemplateBar;
  }
}
