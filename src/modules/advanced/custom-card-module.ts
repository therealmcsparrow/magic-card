import { html, TemplateResult } from 'lit';
import { BaseLazyStub } from '../base-lazy-stub';
import { MagicModuleMetadata } from '../module-types';
import { CardModule, CustomCardModuleConfig } from '../../types';
import { ModuleRegistry } from '../module-registry';
import { generateId } from '../../utils/id-generator';
import type { ModuleDependencies } from '../../services/card-dependencies';
import { lazyChunks } from '../../utils/lazy-chunks';
import { t } from '../../card/i18n';
import { lm } from '../../i18n/labels/mark';

// Shared card helpers live in a sync util (the camera view and the editor use them too).
export { getCardHelpers, whenDefined, stableJson, fullConfig } from '../../utils/card-helpers';
export type { CardHelpers, ConfigurableElement } from '../../utils/card-helpers';

/** The module with no card type set (sync: the stub and the view render the same box). */
export const customCardEmpty = (): TemplateResult => html`
  <div class="mc-module mc-custom-card mc-custom-card-placeholder">
    <ha-icon icon="mdi:card-plus-outline"></ha-icon>
    <span>${t('No card type set')}</span>
  </div>
`;

class CustomCardModule extends BaseLazyStub {
  readonly metadata: MagicModuleMetadata = {
    type: 'custom-card',
    name: lm('Custom card'),
    description: lm('Embed any 3rd party Lovelace card'),
    category: 'advanced',
    icon: 'mdi:card-plus-outline',
    inherit: false,
  };

  createDefault(): CustomCardModuleConfig {
    return {
      id: generateId('custom-card'),
      type: 'custom-card',
      name: '',
      card_type: '',
      card_config: {},
    };
  }

  /** Same outer box as the embedded card's "Loading card..." line (min-height 60 px); failed: no text. */
  placeholder(config: CardModule, state: 'pending' | 'failed'): TemplateResult {
    if (!(config as CustomCardModuleConfig).card_type) return customCardEmpty();
    return html`<div class="mc-module mc-custom-card"><div
      style="display:flex;align-items:center;justify-content:center;min-height:60px;color:var(--secondary-text-color,#6b7280);font-size:0.875rem"
    >${state === 'pending' ? t('Loading card...') : ''}</div></div>`;
  }

  /** The embedded card tracks its own entities: it gets every hass update. */
  getDependencies(): ModuleDependencies {
    return { forwardHass: true };
  }

  // No card type yet is not an error: the preview shows a "No card type set" placeholder.
  validate(config: CardModule): string[] {
    const c = config as CustomCardModuleConfig;
    if (c.card_config !== undefined && (typeof c.card_config !== 'object' || c.card_config === null || Array.isArray(c.card_config))) {
      return [t('Card config must be a mapping')];
    }
    return [];
  }
}

ModuleRegistry.registerLazy(new CustomCardModule(), lazyChunks['modules-extra']);
