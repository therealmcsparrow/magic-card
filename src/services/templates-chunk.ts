import { BUILD_VERSION } from '../utils/build-version';
import { mergeTemplateWithOverrides } from './template-merge';
import { templateSource } from './template-source';

/*
 * Chunk entry of dist/magic-card-templates.js: the shared template source and the merge of a
 * template with the card's overrides. The card reads it through src/card/templates-seam.ts.
 */

export const BUILD: string = BUILD_VERSION;

/** What the card calls into (a plain object, so the entry never imports this file at run time). */
export const api = { templateSource, mergeTemplateWithOverrides } as const;

export type TemplatesApi = typeof api;

export function install(): void {}
