import type { MagicCardConfig } from '../../types';
import { modulePathAttr, type Selection } from '../studio/selection';
import { t } from '../i18n';
import type { Box } from './checks';
import { collectHitItems, layersHere, type HereEntry } from './layers-here';
import { cycleTarget } from './layers-at';
import type { SheetItem } from '../../contracts/layer-editor';

// The studio canvas side of layer selection: Alt-click cycling, layers under the pointer, step above / below,
// and the box measurer for the Layer group checks.

export interface CanvasLayersHost {
  /** The live card element (its shadow root holds the module wrappers). */
  card(): (HTMLElement & { shadowRoot: ShadowRoot | null }) | undefined;
  config(): MagicCardConfig | undefined;
  selection(): Selection;
  select(sel: Selection): void;
  /** Select the card and open one Card backdrop layer row. */
  openBackdrop(index: number): void;
  /** Polite announcement (status capsule). */
  announce(message: string): void;
}

const boxOf = (r: DOMRect): Box => ({ left: r.left, top: r.top, width: r.width, height: r.height });

export class CanvasLayers {
  constructor(private readonly host: CanvasLayersHost) {}

  /** Layers at a viewport point, front first. */
  here(x: number, y: number): HereEntry[] {
    const card = this.host.card();
    const config = this.host.config();
    if (!card || !config) return [];
    const items = collectHitItems(card.shadowRoot, config);
    const cr = card.getBoundingClientRect();
    return layersHere(items, config, cr.width || cr.height ? boxOf(cr) : undefined, { x, y });
  }

  private _currentKey(): string | undefined {
    const sel = this.host.selection();
    return sel.kind === 'module' ? modulePathAttr(sel) : undefined;
  }

  /** The selected module's box in viewport px. */
  selectionBox(): Box | undefined {
    const sel = this.host.selection();
    if (sel.kind !== 'module') return undefined;
    const el = this.host.card()?.shadowRoot?.querySelector<HTMLElement>(`[data-mc-path="${modulePathAttr(sel)}"]`);
    const r = el?.getBoundingClientRect();
    return r && (r.width || r.height) ? boxOf(r) : undefined;
  }

  /** Layers under the selected module's box (itself included), front first; empty without a selected module. */
  hereForSelection(): HereEntry[] {
    const box = this.selectionBox();
    const card = this.host.card();
    const config = this.host.config();
    if (!box || !card || !config) return [];
    const cr = card.getBoundingClientRect();
    return layersHere(collectHitItems(card.shadowRoot, config), config, cr.width || cr.height ? boxOf(cr) : undefined, box);
  }

  /** Select an entry: a module, or a card backdrop layer (the card is selected and its row opens). */
  pick(entry: HereEntry, list: readonly HereEntry[]): void {
    if (entry.kind === 'module' && entry.sel) this.host.select(entry.sel);
    else if (entry.kind === 'backdrop' && entry.index !== undefined) this.host.openBackdrop(entry.index);
    const n = list.indexOf(entry) + 1;
    this.host.announce(t('card-editor.canvas-layers.selected-name-n-from-the-front-here', { name: entry.name, n: Math.max(1, n) }));
  }

  /** Alt-click: the next layer beneath the selection at the pointer, wrapping. False when nothing is there. */
  altSelect(x: number, y: number): boolean {
    const list = this.here(x, y);
    const key = cycleTarget(list.map((e) => e.key), this._currentKey(), 1);
    const entry = list.find((e) => e.key === key);
    if (!entry) return false;
    this.pick(entry, list);
    return true;
  }

  /** Float bar: the layer above (-1, toward the front) or below (1) the selection, wrapping. */
  step(dir: 1 | -1): boolean {
    const list = this.hereForSelection();
    const key = cycleTarget(list.map((e) => e.key), this._currentKey(), dir);
    const entry = list.find((e) => e.key === key);
    if (!entry) return false;
    this.pick(entry, list);
    return true;
  }

  sheetItems(list: readonly HereEntry[]): SheetItem[] {
    const cur = this._currentKey();
    return list.map((e) => ({ key: e.key, name: e.name, detail: e.detail, current: e.key === cur }));
  }

  /** For the Layer group's checks: boxes of module wrappers by data-mc-path (viewport px). */
  measure = (paths: readonly string[]): Record<string, Box | undefined> => {
    const root = this.host.card()?.shadowRoot;
    const out: Record<string, Box | undefined> = {};
    for (const p of paths) {
      if (!/^[\d.]+(\/[\d.]+)*$/.test(p)) continue;
      const r = root?.querySelector<HTMLElement>(`[data-mc-path="${p}"]`)?.getBoundingClientRect();
      out[p] = r && (r.width || r.height) ? boxOf(r) : undefined;
    }
    return out;
  };
}
