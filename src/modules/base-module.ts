import { TemplateResult } from 'lit';
import { MagicModule, MagicModuleMetadata } from './module-types';
import { CardModule, HomeAssistant } from '../types';

/**
 * Dashboard side of a module: metadata, defaults, preview and validation. Its settings tabs are a
 * ModuleEditor in the editor chunk (src/editor/modules/**, module-editor 1.0.0).
 */
export abstract class BaseMagicModule implements MagicModule {
  abstract readonly metadata: MagicModuleMetadata;

  abstract createDefault(): CardModule;

  abstract renderPreview(config: CardModule, hass?: HomeAssistant): TemplateResult;

  validate(_config: CardModule): string[] {
    return [];
  }
}
