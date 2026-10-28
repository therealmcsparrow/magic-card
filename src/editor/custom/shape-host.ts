import type { CustomShapeOptions } from '../../contracts/custom-shape';
import type { ShapeChangeDetail, ShapeEditorPreset, ShapeEditorValue } from '../../contracts/svg-editor';
import { SHAPE_EDITOR_TAG } from '../../contracts/svg-editor';
import type { HomeAssistant, MagicCardConfig } from '../../types';
import type { ShapePatch } from '../components/shape-editor';
import { cardStateOf as cardState, type CardState } from './bridge';
import { listShapes } from './library';
import { openLayer } from './layer';
import { loadShapeEditor } from './loaders';
import { t } from '../i18n';

/*
 * The card editor's side of the shape editor (svg-editor 1.0.0, shape part): "Custom", "Edit as custom"
 * and "Edit shape" open <mc-shape-studio> in the top layer. Every committed change is written as a
 * ShapePatch (`shape`, `shape_options`, and the inline copies for `custom_shapes`), one undo step per
 * commit; the card behind the layer is live, so Back needs no prompt.
 */

/** A ShapePatch plus inline copies for the card's `custom_shapes` (written with it, in the same undo step). */
export type ShapeWrite = ShapePatch & { custom_shapes?: Record<string, CustomShapeOptions> };

export interface ShapeEditorOpen {
  /** Any element of the card editor: finds the card's state manager, and is where focus returns. */
  from: HTMLElement;
  hass?: HomeAssistant;
  /** The target ("Living room tile", "this card"); the shape editor writes "Shape for {label}" in its title. */
  label: string;
  /** The card's current custom shape; none: a blank one (or `preset`). */
  value?: ShapeEditorValue;
  preset?: ShapeEditorPreset;
  /** Writes a patch (the design panel's own handler). */
  apply(patch: ShapePatch): void;
}

/**
 * Write a ShapePatch: `shape` and `shape_options` through `writeKeys` (the design edit, its own undo
 * step), then the inline copies into the card's `custom_shapes`, folded into that step. Entries merge
 * per id; the card's other copies stay.
 */
export function applyShapePatch(sm: CardState | undefined, patch: ShapeWrite, writeKeys: (keys: ShapePatch) => void): void {
  const { custom_shapes: copies, ...keys } = patch;
  writeKeys(keys);
  if (copies && Object.keys(copies).length && sm && sm.attached !== false) {
    const c = sm.getConfig();
    sm.updateConfig({ ...c, custom_shapes: { ...(c.custom_shapes ?? {}), ...copies } }, false);
  }
}

/** The card's copies with the library's current version of every saved shape the card keeps (copy refresh on open). */
export function refreshedCopies(copies: MagicCardConfig['custom_shapes'], library: ReadonlyArray<{ id: string; shape: CustomShapeOptions }>): { copies: Record<string, CustomShapeOptions>; changed: boolean } {
  const out: Record<string, CustomShapeOptions> = { ...(copies ?? {}) };
  let changed = false;
  for (const item of library) {
    const mine = out[item.id];
    if (mine !== undefined && JSON.stringify(mine) !== JSON.stringify(item.shape)) {
      out[item.id] = item.shape;
      changed = true;
    }
  }
  return { copies: out, changed };
}

const toast = (message: string): void =>
  void document.querySelector('home-assistant')?.dispatchEvent(new CustomEvent('hass-notification', { detail: { message } }));

/**
 * Open the shape editor. Resolves 'opened', or 'failed' when the chunk did not load (nothing changed;
 * the caller shows the E1 message with a retry).
 */
export async function openShapeEditor(o: ShapeEditorOpen): Promise<'opened' | 'failed'> {
  if (!(await loadShapeEditor())) return 'failed';
  const sm = cardState(o.from);
  const lib = await listShapes(o.hass);
  let copies = sm?.getConfig().custom_shapes;
  if (lib.state === 'ok') {
    const r = refreshedCopies(copies, lib.items);
    if (r.changed && sm && sm.attached !== false) sm.updateConfig({ ...sm.getConfig(), custom_shapes: r.copies }, false);
    copies = r.changed ? r.copies : copies;
  }
  const el = document.createElement(SHAPE_EDITOR_TAG) as HTMLElement & {
    hass?: unknown;
    value?: ShapeEditorValue;
    customShapes?: Record<string, CustomShapeOptions>;
    libraryAvailable: boolean;
    preset?: ShapeEditorPreset;
    label: string;
  };
  el.hass = o.hass;
  el.value = o.value;
  el.customShapes = copies;
  el.libraryAvailable = lib.state === 'ok';
  el.preset = o.preset;
  el.label = o.label;
  let close = (): void => undefined;
  el.addEventListener('mc-shape-change', (e) => {
    const d = (e as CustomEvent<ShapeChangeDetail>).detail;
    // a drag is not a step: the card behind the layer is hidden anyway
    if (!d.commit) return;
    applyShapePatch(sm, { shape: 'custom', shape_options: d.value.shape_options, ...(d.customShapes ? { custom_shapes: d.customShapes } : {}) }, (keys) => o.apply(keys));
  });
  el.addEventListener('mc-shape-close', (e) => {
    close();
    if ((e as CustomEvent<{ done: boolean }>).detail?.done) toast(t('card-editor.shape-host.shape-applied'));
  });
  close = openLayer(el, { from: o.from, key: 'shape-entry' });
  return 'opened';
}
