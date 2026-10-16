import { TemplateResult } from 'lit';
import {
  CardModule,
  HomeAssistant,
  ModuleCategory,
  ModuleType,
  EditorTab,
} from '../types';
import type { DependencyContext, ModuleDependencies } from '../services/card-dependencies';

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
    template?: string,
  ): TemplateResult;

  renderActionsTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult;

  renderConditionsTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult;

  renderDesignTab?(
    config: CardModule,
    hass: HomeAssistant | undefined,
    onChange: (updated: CardModule) => void,
    template?: string,
  ): TemplateResult;

  getAvailableTabs(): EditorTab[];

  /** Configuration errors (contradictory or malformed options): shown inline in place of the module. */
  validate(config: CardModule): string[];

  /**
   * What an unfinished module still needs (no content, no entity picked). Only shown while
   * editing; on a live dashboard the module renders as it is (an empty text is a common spacer).
   */
  hints?(config: CardModule): string[];

  migrate?(config: CardModule, fromVersion: string): CardModule;

  /**
   * Dependencies beyond the entity ids in the config (those are collected automatically, nested
   * children included): extra entities, a periodic refresh, or forwarding every hass update.
   * `ctx.editMode`: the card is the studio canvas.
   */
  getDependencies?(config: CardModule, ctx: DependencyContext): ModuleDependencies;
}
