import { UI_MENU_TAG, UI_POPOVER_TAG, UI_WINDOW_TAG } from '../contracts/ui-kit';
import { defineKitElements } from '../ui-kit/define-parts';
import { UiMenu } from '../ui-kit/elements/menu';
import { UiPopover } from '../ui-kit/elements/popover';
import { UiWindow } from '../ui-kit/elements/window';

// The animation studio's own copy of the ui kit: defines the window, menu and popover elements once, guarded, so a tag
// defined first by another chunk is kept. Imported for effect by the entry and by files that render a kit element.
defineKitElements([
  [UI_WINDOW_TAG, UiWindow],
  [UI_MENU_TAG, UiMenu],
  [UI_POPOVER_TAG, UiPopover],
]);
