import { TemplateResult } from 'lit';
import {
  CardModule,
  HomeAssistant,
  ModuleCategory,
  ModuleType,
  EditorTab,
} from '../types';

export interface MagicModuleMetadata {
  type: ModuleType;
  name: string;
  description: string;
  category: ModuleCategory;
  icon: string;
}

export interface MagicModule {
  readonly metadata: MagicModuleMetadata;

  createDefault(): CardModule;

  renderPreview(
    config: CardModule,
    hass?: HomeAssistant,
  ): TemplateResult;

  renderGeneralTab(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult;

  renderActionsTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult;

  renderConditionsTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult;

  renderDesignTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
  ): TemplateResult;

  getAvailableTabs(): EditorTab[];

  validate(config: CardModule): string[];

  migrate?(config: CardModule, fromVersion: string): CardModule;
}
