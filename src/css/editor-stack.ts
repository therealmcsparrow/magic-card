import type { CSSResult } from 'lit';
import { editorTokens } from './editor-system';
import { editorPrimitives } from '../ui-kit/css/primitives';
import { editorLegacy } from '../ui-kit/css/legacy';

/**
 * The card editor's stylesheet stack: Core's tokens, then the ui-kit primitives and the legacy mc-* sheet.
 * It lives outside src/ui-kit/ because the kit imports nothing of the app (the tokens are Core), and outside
 * editor-system.ts because Core holds the tokens only. Screens on the kit use kitCss instead of this stack.
 */
export const editorSystem: CSSResult[] = [editorTokens, editorPrimitives, editorLegacy];
