import { UI_KIT_CONTRACT_REVISION, UI_KIT_CONTRACT_VERSION, type UiKitModule } from '../contracts/ui-kit';
import { defineUiKit } from './define';

// The ui-kit Module (contract ui-kit 1.0.0): CSS parts, template helpers, controllers, glyphs and three elements.
export * from './css';
export * from './templates';
export * from './controllers';
export * from './glyphs';
export { defineUiKit } from './define';
export { UiMenu } from './elements/menu';
export { UiWindow } from './elements/window';
export { UiPopover } from './elements/popover';
export { UiToast } from './elements/toast';
export { UiDisclosure } from './elements/disclosure';
export { UiTileGroup } from './elements/tile-group';
export { UiChipGroup } from './elements/chip-group';

export const uiKit: UiKitModule = { version: UI_KIT_CONTRACT_VERSION, revision: UI_KIT_CONTRACT_REVISION, defineUiKit };
