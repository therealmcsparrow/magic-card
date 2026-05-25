import { LitElement, html, TemplateResult, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ActionConfig, ActionType } from '../../types';
import { actionConfigStyles, componentControlStyles } from '../../css/css';

@customElement('mc-action-config')
export class ActionConfigEditor extends LitElement {
  static styles = [componentControlStyles, actionConfigStyles];

  @property({ type: String }) label = 'Action';
  @property({ attribute: false }) action?: ActionConfig;
  @property({ attribute: false }) onChange?: (action: ActionConfig) => void;

  protected render(): TemplateResult {
    const a = this.action || { action: 'none' as ActionType };

    return html`
      <div class="mc-act">
        <div class="mc-act-header">${this.label}</div>

        <div class="mc-act-field">
          <label>Action</label>
          <select @change=${(e: Event) =>
            this.onChange?.({ ...a, action: (e.target as HTMLSelectElement).value as ActionType })}>
            ${(['none', 'more-info', 'toggle', 'navigate', 'url', 'perform-action', 'assist'] as ActionType[]).map(
              (t) => html`<option value=${t} ?selected=${a.action === t}>${t}</option>`,
            )}
          </select>
        </div>

        ${a.action === 'navigate' ? html`
          <div class="mc-act-field">
            <label>Navigation Path</label>
            <input type="text" .value=${a.navigation_path || ''} placeholder="/lovelace/0"
              @input=${(e: InputEvent) => this.onChange?.({ ...a, navigation_path: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}

        ${a.action === 'url' ? html`
          <div class="mc-act-field">
            <label>URL</label>
            <input type="text" .value=${a.url_path || ''} placeholder="https://..."
              @input=${(e: InputEvent) => this.onChange?.({ ...a, url_path: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}

        ${a.action === 'perform-action' ? html`
          <div class="mc-act-field">
            <label>Service</label>
            <input type="text" .value=${a.service || ''} placeholder="light.toggle"
              @input=${(e: InputEvent) => this.onChange?.({ ...a, service: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}

        ${a.action === 'more-info' || a.action === 'toggle' ? html`
          <div class="mc-act-field">
            <label>Entity (optional override)</label>
            <input type="text" .value=${a.entity || ''} placeholder="entity_id"
              @input=${(e: InputEvent) => this.onChange?.({ ...a, entity: (e.target as HTMLInputElement).value })} />
          </div>
        ` : nothing}
      </div>
    `;
  }
}
