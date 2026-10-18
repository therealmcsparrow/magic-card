import { UI_MENU_TAG, UI_POPOVER_TAG, UI_WINDOW_TAG } from '../contracts/ui-kit';
import { defineKitElements } from '../ui-kit/define-parts';
import { UiMenu } from '../ui-kit/elements/menu';
import { UiPopover } from '../ui-kit/elements/popover';
import { UiWindow } from '../ui-kit/elements/window';

/*
 * The animation studio's own copy of the ui kit (contract ui-kit 1.0.0, ADR 0030): this entry compiles the kit
 * elements itself and defines them once, guarded, so a card editor chunk or the theme editor on the same page that
 * defined a tag first keeps it. Only the three the studio renders (window, menu, popover): defineUiKit() would add the
 * toast. Imported for its effect by the entry and by every file that renders a kit element, so unit tests that mount
 * one editor on its own get the same elements. The studio entry is not a lazy chunk, so a define at module level is
 * allowed (lazy-module 1.0.0).
 */
defineKitElements([
  [UI_WINDOW_TAG, UiWindow],
  [UI_MENU_TAG, UiMenu],
  [UI_POPOVER_TAG, UiPopover],
]);
