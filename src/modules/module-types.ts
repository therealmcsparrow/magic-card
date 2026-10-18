import type { MessageId } from '../contracts/i18n';
import { TemplateResult } from 'lit';
import {
  CardModule,
  HomeAssistant,
  ModuleCategory,
  ModuleType,
} from '../types';
import type { DependencyContext, ModuleDependencies } from '../services/card-dependencies';

export interface MagicModuleMetadata {
  type: ModuleType;
  name: MessageId;
  description: MessageId;
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
