import { BUILD_VERSION } from '../utils/build-version';
import { mergeTemplateWithOverrides } from './template-merge';
import { templateSource } from './template-source';

/*
 * Chunk entry of dist/magic-card-templates.js (lazy-module 1.5.0 chunk `templates`): the template source (one shared
 * subscription per connection and template name, mcu-templates 1.0.0) and the merge of a template with the card's own
 * overrides. The card reads it through src/card/templates-seam.ts and renders its own settings until the merged config
 * arrives. The editor keeps its own copy of template-merge.ts and never imports template-source.ts, so the page holds
 * one source.
 */

export const BUILD: string = BUILD_VERSION;

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { templateSource, mergeTemplateWithOverrides } as const;

export type TemplatesApi = typeof api;

export function install(): void {}
