import { TemplateResult } from 'lit';
import type { LazyModuleStub } from '../contracts/lazy-module';
import type { LazyStubMetadata } from './module-types';
import { CardModule } from '../types';

/**
 * Synchronous half of a module whose view lives in a lazy chunk (contract lazy-module 1.0.0):
 * metadata, defaults, validation and the placeholder shown until the view exists.
 */
export abstract class BaseLazyStub implements LazyModuleStub {
  abstract readonly metadata: LazyStubMetadata;

  abstract createDefault(): CardModule;

  abstract placeholder(config: CardModule, state: 'pending' | 'failed'): TemplateResult;

  validate(_config: CardModule): string[] {
    return [];
  }
}
