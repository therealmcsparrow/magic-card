import { UI_KIT_CONTRACT_REVISION, UI_KIT_CONTRACT_VERSION, type UiKitModule } from '../contracts/ui-kit';
import { defineUiKit } from './define';

/*
 * The ui-kit Module (contract ui-kit 1.0.0, ADR 0030): CSS parts, template helpers, controllers, glyphs and three
 * elements. magic-card-editor.js imports this file (the one copy for the editor family); the animation studio and the
 * theme editor entries compile their own. magic-card.js never reaches it (tests/ui-kit-boundary.test.ts).
 */
export * from './css';
export * from './templates';
export * from './controllers';
export * from './glyphs';
export { defineUiKit } from './define';
export { UiMenu } from './elements/menu';
export { UiWindow } from './elements/window';
export { UiPopover } from './elements/popover';
export { UiToast } from './elements/toast';

export const uiKit: UiKitModule = { version: UI_KIT_CONTRACT_VERSION, revision: UI_KIT_CONTRACT_REVISION, defineUiKit };
