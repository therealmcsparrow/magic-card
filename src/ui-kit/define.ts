import { UI_CHIP_GROUP_TAG, UI_DISCLOSURE_TAG, UI_MENU_TAG, UI_POPOVER_TAG, UI_TILE_GROUP_TAG, UI_TOAST_TAG, UI_WINDOW_TAG } from '../contracts/ui-kit';
import { defineKitElements, type KitElementClass } from './define-parts';
import { UiChipGroup } from './elements/chip-group';
import { UiDisclosure } from './elements/disclosure';
import { UiMenu } from './elements/menu';
import { UiPopover } from './elements/popover';
import { UiTileGroup } from './elements/tile-group';
import { UiToast } from './elements/toast';
import { UiWindow } from './elements/window';

/*
 * Guarded define of every kit element (contract ui-kit 1.0.0, "Define once"). The editor chunk, the studio entry and the
 * theme editor entry each carry a copy of the kit; whichever runs first defines a tag and the rest keep it (the guard is
 * in define-parts.ts). Call from install-style code, never at module top level of a lazy chunk (lazy-module 1.0.0).
 */
const ELEMENTS: Array<[string, KitElementClass]> = [
  [UI_MENU_TAG, UiMenu],
  [UI_WINDOW_TAG, UiWindow],
  [UI_POPOVER_TAG, UiPopover],
  [UI_TOAST_TAG, UiToast],
  [UI_DISCLOSURE_TAG, UiDisclosure],
  [UI_TILE_GROUP_TAG, UiTileGroup],
  [UI_CHIP_GROUP_TAG, UiChipGroup],
];

export function defineUiKit(): void {
  defineKitElements(ELEMENTS);
}
