import { html, nothing, TemplateResult } from 'lit';
import type {
  ActionConfig,
  ActionsConfig,
  ColumnConfig,
  DesignConfig,
  DisplayCondition,
  DisplayConfig,
  HomeAssistant,
  NestedColumnConfig,
  RowConfig,
  RowModuleConfig,
  TabsModuleConfig,
} from '../../types';
import type { SyncContext } from '../../utils/sync-path';
import type { ChildStep } from '../../utils/module-path';
import { generateId } from '../../utils/id-generator';
import type { EditorStateManager } from '../state/editor-state';
import { renderBoxField, renderIconField, renderSelectField, renderSyncMark, renderTextField, renderUnitField } from '../../utils/form-utils';
import { renderConditionsList } from './conditions-list';
import '../components/design-panel';
import { layoutName, presetWeights, renderLayoutGlyph } from '../components/layout-glyph';
import '../components/unit-field';
import type { UnitField } from '../components/unit-field';
import '../components/sync-indicator';
import { fieldReset } from '../components/field-reset';
import { GridRowLike, applyRowLayout, effectiveWidths, hasColumnWidths, normalizeWidth, widthWeights } from '../../utils/column-widths';
import { toggleNotSynced } from '../state/template-sync';
import { renderActionGroups } from '../components/action-editor';

const equalLayout = (n: number) => Array.from({ length: Math.max(n, 1) }, () => '1').join('-');

/** Mockup presets: picking one with another column count adds empty columns or merges removed ones left. */
const LAYOUT_PRESETS = ['1', '1-1', '2-1', '1-2', '1-1-1'];

/** The picker's option for a row with its own column widths (checked; picking a preset replaces them). */
const CUSTOM_WIDTHS = 'custom';

/** What the layout picker and the widths fields edit: a card row or a row module. */
export interface RowGrid {
  row: GridRowLike & { columns: readonly unknown[] };
  setLayout(layout: string): void;
  setWidths(widths: string[] | undefined, layout?: string): void;
  /** Sync indicator of the widths (template-linked card). */
  sync?: TemplateResult | typeof nothing;
}

/** The layout module owning a tab / row-module column. */
export interface SlotOwner {
  row: number;
  col: number;
  module: number;
  child?: ChildStep[];
}

const cardRowGrid = (ri: number, row: RowConfig, sm: EditorStateManager): RowGrid => ({
  row,
  setLayout: (layout) => sm.setRowLayout(ri, layout),
  setWidths: (widths, layout) => sm.setColumnWidths(ri, widths, layout),
  sync: widthsSync(ri, row, sm),
});

/** A row module (at row/col/module/child) as a RowGrid, edited through the editor state. */
function nestedRowGrid(at: SlotOwner, mod: RowModuleConfig, sm: EditorStateManager): RowGrid {
  // a nested row module's columns follow its top layout's child list instead (no indicator)
  const synced = !mod.not_synced?.includes('column_widths');
  const sync = sm.getConfig().template && !at.child?.length
    ? html`<mc-sync-indicator
        .synced=${synced}
        .hasTemplate=${true}
        .hideIfNoTemplate=${true}
        .propertyPath=${'column_widths'}
        @sync-toggle=${(e: Event) => {
          e.stopPropagation();
          sm.updateModule(at.row, at.col, at.module, { not_synced: toggleNotSynced(mod.not_synced as string[] | undefined, 'column_widths', synced) });
        }}
      ></mc-sync-indicator>`
    : nothing;
  return {
    sync,
    row: { ...mod, columns: mod.columns || [] },
    setLayout: (layout) => sm.setNestedRowLayout(at.row, at.col, at.module, at.child, layout),
    setWidths: (widths, layout) => sm.setNestedColumnWidths(at.row, at.col, at.module, at.child, widths, layout),
  };
}

export function renderLayoutPicker(g: RowGrid): TemplateResult {
  const row = g.row;
  const colCount = row.columns.length;
  const custom = hasColumnWidths(row);
  const layout = row.layout || equalLayout(colCount);
  const current = custom ? CUSTOM_WIDTHS : layout;
  // A custom / wider layout stays selectable as itself so it is never silently replaced.
  const presets = LAYOUT_PRESETS.includes(layout) ? LAYOUT_PRESETS : [...LAYOUT_PRESETS, layout];
  const all = custom ? [...presets, CUSTOM_WIDTHS] : presets;
  const choose = (value: string) => {
    if (value !== current && value !== CUSTOM_WIDTHS) g.setLayout(value);
  };
  const onKey = (e: KeyboardEvent) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const idx = all.indexOf(current);
    const delta = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1;
    const nextIdx = e.key === 'Home' ? 0 : e.key === 'End' ? all.length - 1 : (idx + delta + all.length) % all.length;
    const next = all[nextIdx];
    choose(next);
    const group = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => group.querySelector<HTMLElement>(`[data-val="${next}"]`)?.focus());
  };
  return html`
    <div class="field">
      <div class="field-head"><span class="lbl" id="row-layout-lbl">Column layout</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="row-layout-lbl" @keydown=${onKey}>
        ${all.map((value) => {
          const on = value === current;
          const weights = value === CUSTOM_WIDTHS ? widthWeights(effectiveWidths(row)) : presetWeights(value);
          const name = value === CUSTOM_WIDTHS ? `${colCount} column${colCount === 1 ? '' : 's'}, custom widths` : layoutName(weights);
          return html`
            <button
              type="button"
              role="radio"
              class="layout-opt"
              data-val=${value}
              aria-checked=${on ? 'true' : 'false'}
              aria-label=${name}
              title=${name}
              tabindex=${on ? '0' : '-1'}
              @click=${() => choose(value)}
            >${renderLayoutGlyph(weights)}</button>
          `;
        })}
      </div>
      <p class="help">Removing a column moves its modules into the column to its left.</p>
    </div>
  `;
}

const WIDTH_UNITS = ['fr', '%', 'px'];

/** A typed width: '' is 1fr, a valid width normalised, anything else null (not written). */
function widthInput(value: string): string | null {
  return value.trim() === '' ? '1fr' : normalizeWidth(value);
}

/** Sync indicator of a row's column widths (row and column tabs both flip the row's not_synced). */
function widthsSync(ri: number, row: RowConfig, sm: EditorStateManager): TemplateResult | typeof nothing {
  if (!sm.getConfig().template) return nothing;
  const synced = !row.not_synced?.includes('column_widths');
  return html`<mc-sync-indicator
    .synced=${synced}
    .hasTemplate=${true}
    .hideIfNoTemplate=${true}
    .propertyPath=${'column_widths'}
    @sync-toggle=${(e: Event) => {
      e.stopPropagation();
      sm.updateRow(ri, { not_synced: toggleNotSynced(row.not_synced, 'column_widths', synced) });
    }}
  ></mc-sync-indicator>`;
}

/**
 * Write column `ci`'s width (all columns' widths become explicit). Text that isn't a width (or
 * changes nothing) is not written and `field` shows the stored width again.
 */
function writeWidth(g: RowGrid, ci: number, value: string, field?: EventTarget | null): void {
  const width = widthInput(value);
  const widths = effectiveWidths(g.row);
  if (!width || (hasColumnWidths(g.row) && widths[ci] === width)) {
    (field as UnitField | null | undefined)?.revert?.();
    return;
  }
  widths[ci] = width;
  g.setWidths(widths);
}

export function renderColumnWidths(g: RowGrid): TemplateResult {
  const widths = effectiveWidths(g.row);
  const custom = hasColumnWidths(g.row);
  return html`
    <div class="field col-widths">
      <div class="field-head">
        <span class="lbl" id="row-widths-lbl">Column widths</span>
        ${g.sync ?? nothing}
        ${fieldReset('Column widths', custom, () => g.setWidths(undefined))}
      </div>
      <div class="col-width-list" role="group" aria-labelledby="row-widths-lbl">
        ${widths.map((w, ci) => html`
          <div class="col-width">
            <span class="col-width-lbl" aria-hidden="true">Column ${ci + 1}</span>
            <mc-unit-field
              .value=${w}
              .label=${`Column ${ci + 1} width`}
              .units=${WIDTH_UNITS}
              @value-changed=${(e: CustomEvent<{ value: string }>) => writeWidth(g, ci, e.detail.value, e.target)}
            ></mc-unit-field>
          </div>
        `)}
      </div>
      <div class="col-widths-foot">
        <button
          type="button"
          class="btn btn-text btn-sm"
          @click=${() => g.setWidths(undefined, equalLayout(g.row.columns.length))}
        ><ha-icon icon="mdi:arrow-split-vertical"></ha-icon>Equal widths</button>
      </div>
      <p class="help">fr shares the free space. Use Custom for auto (as wide as the content). % widths plus gap can overflow the row.</p>
    </div>
  `;
}

const ALIGN_OPTIONS = [
  { label: 'Top', value: 'start' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom', value: 'end' },
  { label: 'Stretch', value: 'stretch' },
];

export function renderRowGeneral(ri: number, row: RowConfig, sm: EditorStateManager): TemplateResult {
  // Row-level vertical alignment writes every column's vertical_align (the shared value, else the first column's).
  const aligns = row.columns.map((c) => c.vertical_align || 'start');
  const setAlign = (v: string) => {
    const config = sm.getConfig();
    const next = config.rows[ri].columns.map((c) => ({ ...c, vertical_align: v as ColumnConfig['vertical_align'] }));
    sm.updateRow(ri, { columns: next });
  };
  const grid = cardRowGrid(ri, row, sm);
  return html`
    <div class="group">
      ${renderLayoutPicker(grid)}
      ${row.columns.length > 1 ? renderColumnWidths(grid) : nothing}
      ${renderUnitField('Gap between columns', row.gap, (v) => sm.updateRow(ri, { gap: v }), undefined, undefined, '12')}
      ${renderSelectField('Vertical alignment', aligns[0] || 'start', ALIGN_OPTIONS, setAlign)}
      ${renderBoxField('Padding', row.padding, (v) => sm.updateRow(ri, { padding: v }), 'padding')}
    </div>
  `;
}

type ColumnFields = Pick<ColumnConfig, 'gap' | 'padding' | 'vertical_align'>;

/** A column's General fields: its width in the row, vertical alignment, gap, padding. */
function renderColumnFields(col: ColumnFields, ci: number, update: (patch: Partial<ColumnConfig>) => void, grid?: RowGrid): TemplateResult {
  const width = grid && grid.row.columns.length > 1
    ? html`
        <div class="field">
          <div class="field-head">
            <label for="col-width">Width</label>
            ${grid.sync ?? nothing}
            ${fieldReset('Width', hasColumnWidths(grid.row) && effectiveWidths(grid.row)[ci] !== '1fr', () => writeWidth(grid, ci, '1fr'))}
          </div>
          <mc-unit-field
            data-col-width
            inputId="col-width"
            .value=${effectiveWidths(grid.row)[ci]}
            .label=${'Width'}
            .units=${WIDTH_UNITS}
            @value-changed=${(e: CustomEvent<{ value: string }>) => writeWidth(grid, ci, e.detail.value, e.target)}
          ></mc-unit-field>
          <p class="help">One of the row's column widths.</p>
        </div>
      `
    : nothing;
  return html`
    <div class="group">
      ${width}
      ${renderSelectField(
        'Vertical alignment',
        col.vertical_align || 'start',
        ALIGN_OPTIONS,
        (v) => update({ vertical_align: v as ColumnConfig['vertical_align'] }),
      )}
      ${renderUnitField('Gap', col.gap, (v) => update({ gap: v || undefined }))}
      ${renderBoxField('Padding', col.padding, (v) => update({ padding: v }), 'padding')}
    </div>
  `;
}

export function renderColumnGeneral(ri: number, ci: number, col: ColumnConfig, sm: EditorStateManager): TemplateResult {
  const row = sm.getConfig().rows[ri];
  return renderColumnFields(col, ci, (patch) => sm.updateColumn(ri, ci, patch), row ? cardRowGrid(ri, row, sm) : undefined);
}

/** A row module's own General settings: layout picker, column widths, gap, padding (module keys). */
export function renderRowModuleGeneral(
  c: RowModuleConfig,
  onChange: (updated: RowModuleConfig) => void,
  syncCtx?: SyncContext,
): TemplateResult {
  const columns = c.columns || [];
  /*
   * Template-linked card (syncCtx): the module's onChange marks keys whose value changed by reference,
   * so `columns` stays the same array unless the column count changes. Removing the widths does not
   * show up there: it is marked here (a local "no widths" override), except the field's reset, which
   * syncs the widths with the template again (like setNestedColumnWidths).
   */
  const write = (fn: (next: RowModuleConfig) => void, widths: 'mark' | 'reset' | 'keep' = 'keep') => {
    const next: RowModuleConfig = { ...c };
    fn(next);
    if (syncCtx && widths !== 'keep') {
      const marks = ((c.not_synced || []) as string[]).filter((k) => k !== 'column_widths');
      next.not_synced = widths === 'mark' ? [...marks, 'column_widths'] : marks;
    }
    onChange(next);
  };
  const grid: RowGrid = {
    row: { ...c, columns },
    setLayout: (layout) => write((next) => {
      const cols = columns.map((col) => (col && typeof col === 'object' ? { ...col } : { id: generateId('col'), modules: [] }));
      const shaped = { columns: cols } as { layout?: string; column_widths?: string[]; columns: NestedColumnConfig[] };
      applyRowLayout(shaped, layout, () => ({ id: generateId('col'), modules: [] }));
      if (cols.length !== columns.length) next.columns = cols;
      next.layout = layout;
      delete next.column_widths;
    }, 'mark'),
    setWidths: (widths, layout) => write((next) => {
      if (widths?.length) next.column_widths = [...widths];
      else delete next.column_widths;
      if (layout) next.layout = layout;
    }, widths?.length ? 'keep' : layout ? 'mark' : 'reset'),
    sync: syncCtx ? renderSyncMark('column_widths', syncCtx) : nothing,
  };
  return html`
    <div class="group">
      ${renderLayoutPicker(grid)}
      ${columns.length > 1 ? renderColumnWidths(grid) : nothing}
      ${renderUnitField('Gap between columns', c.gap, (v) => onChange({ ...c, gap: v || undefined }), 'gap', syncCtx, '8')}
      ${renderBoxField('Padding', c.padding, (v) => onChange({ ...c, padding: v }), 'padding', 'padding', syncCtx)}
    </div>
  `;
}

/** A row module's column (slot view): General like a card column. */
export function renderNestedColumnGeneral(at: SlotOwner, slot: number, mod: RowModuleConfig, sm: EditorStateManager): TemplateResult {
  const col = mod.columns?.[slot] ?? { modules: [] };
  return renderColumnFields(col, slot, (patch) => sm.updateNestedColumn(at.row, at.col, at.module, at.child, slot, patch), nestedRowGrid(at, mod, sm));
}

export function renderNestedColumnDesign(at: SlotOwner, slot: number, mod: RowModuleConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  const col = (mod.columns?.[slot] ?? { modules: [] }) as ColumnConfig;
  return renderDesign('column', col.design || {}, hass, (updates) => {
    // the row module's column list is the template override, not the column's own not_synced
    const { design } = designEdit({ ...col, not_synced: ['design'] }, updates, sm);
    sm.updateNestedColumn(at.row, at.col, at.module, at.child, slot, { design });
  });
}

export function renderNestedColumnConditions(at: SlotOwner, slot: number, mod: RowModuleConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  const col = mod.columns?.[slot];
  return renderDisplayConditions('column', col?.display || {}, (display) =>
    sm.updateNestedColumn(at.row, at.col, at.module, at.child, slot, { display: display.conditions?.length || display.mode ? display : undefined }), hass);
}

/** A tab (slot view): its label and icon. */
export function renderTabGeneral(at: SlotOwner, slot: number, mod: TabsModuleConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  const tab = mod.tabs?.[slot];
  const update = (patch: { label?: string; icon?: string }) => sm.updateTab(at.row, at.col, at.module, at.child, slot, patch);
  // A blank label is not stored; leaving the field blank shows the tab's label again.
  const restore = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input instanceof HTMLInputElement && !input.value.trim()) input.value = tab?.label ?? '';
  };
  return html`
    <div class="group">
      <div style="display: contents" @change=${restore}>
        ${renderTextField('Label', tab?.label, (v) => { if (v.trim()) update({ label: v }); })}
      </div>
      ${renderIconField('Icon', tab?.icon, (v) => update({ icon: v || undefined }), hass)}
    </div>
  `;
}

function renderDesign(
  target: 'row' | 'column',
  design: DesignConfig,
  hass: HomeAssistant | undefined,
  onChange: (u: Record<string, unknown>) => void,
): TemplateResult {
  return html`<mc-design-panel .design=${design} .hass=${hass} .target=${target} .onChange=${onChange}></mc-design-panel>`;
}

/**
 * A row / column design edit. On a template-linked card the whole design becomes not synced: the
 * template merge only keeps a row's / column's local design under `not_synced: [design]`, so
 * without it every design edit vanished from the real card (the studio canvas showed it).
 */
function designEdit<T extends RowConfig | ColumnConfig>(item: T, updates: Record<string, unknown>, sm: EditorStateManager): Partial<T> {
  const linked = !!sm.getConfig().template;
  const design = { ...item.design, ...updates } as Record<string, unknown>;
  for (const k of Object.keys(design)) if (design[k] === undefined || design[k] === '') delete design[k];
  // the merge lays the local design over the template's: a value background turned off here stays off
  if (linked && 'value_background' in updates && updates.value_background === undefined) design.value_background = { type: 'none' };
  // the same for the shape: None stays none, and a local shape without options does not take the template's
  if (linked && 'shape' in updates) {
    if (updates.shape === undefined) design.shape = 'none';
    if (updates.shape_options === undefined) design.shape_options = {};
  }
  const out: Partial<RowConfig | ColumnConfig> = { design: design as DesignConfig };
  if (linked && !item.not_synced?.includes('design')) out.not_synced = [...(item.not_synced || []), 'design'];
  return out as Partial<T>;
}

export function renderRowDesign(ri: number, row: RowConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  return renderDesign('row', row.design || {}, hass, (updates) => sm.updateRow(ri, designEdit(row, updates, sm)));
}

export function renderColumnDesign(ri: number, ci: number, col: ColumnConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  return renderDesign('column', col.design || {}, hass, (updates) => sm.updateColumn(ri, ci, designEdit(col, updates, sm)));
}

function renderDisplayConditions(
  what: 'row' | 'column',
  display: DisplayConfig,
  write: (next: DisplayConfig) => void,
  hass?: HomeAssistant,
): TemplateResult {
  const conditions = display.conditions || [];
  return html`
      ${renderConditionsList(
        conditions,
        display.mode || 'every',
        {
          onAdd: () =>
            write({ ...display, conditions: [...conditions, { id: `cond-${Date.now()}`, type: 'state', entity: '', state: '' } as DisplayCondition] }),
          onUpdate: (i, patch) =>
            write({ ...display, conditions: conditions.map((c, j) => (j === i ? { ...c, ...patch } : c)) }),
          onRemove: (i) => {
            const next = conditions.filter((_c, j) => j !== i);
            write({ ...display, conditions: next.length ? next : undefined });
          },
          onMode: (mode) => write({ ...display, mode }),
        },
        hass,
        undefined,
        what,
      )}
  `;
}

export function renderRowConditions(ri: number, row: RowConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  return renderDisplayConditions('row', row.display || {}, (display) => sm.updateRow(ri, { display }), hass);
}

export function renderColumnConditions(ri: number, ci: number, col: ColumnConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  return renderDisplayConditions('column', col.display || {}, (display) => sm.updateColumn(ri, ci, { display }), hass);
}

/**
 * A row's Actions tab: the module action editor (tap, hold, double tap with every action type and
 * its fields). A row has no entity of its own, so toggle / more-info ask for one. None removes the
 * gesture. On a template-linked card the row's actions become a local override (`not_synced`).
 */
export function renderRowActions(ri: number, row: RowConfig, sm: EditorStateManager, hass?: HomeAssistant): TemplateResult {
  const update = (key: keyof ActionsConfig, action: ActionConfig) => {
    const current = sm.getConfig().rows[ri] ?? row;
    const next = { ...current.actions } as Record<string, ActionConfig | undefined>;
    if (!action || action.action === 'none') delete next[key];
    else next[key] = action;
    const patch: Partial<RowConfig> = { actions: Object.keys(next).length ? (next as ActionsConfig) : undefined };
    if (sm.getConfig().template && !current.not_synced?.includes('actions')) patch.not_synced = [...(current.not_synced || []), 'actions'];
    sm.updateRow(ri, patch);
  };
  return html`
    ${renderActionGroups(row.actions, update, hass)}
    <p class="help">Runs when the row is tapped outside a module with its own action or control.</p>
  `;
}
