import {
  MagicCardConfig,
  EditorState,
  EditorMode,
  EditorTab,
  EditorPath,
  CardModule,
  RowConfig,
  ColumnConfig,
  ModuleType,
} from '../../types';
import { UndoRedoStack } from './undo-redo';
import { deepClone } from '../../utils/deep-merge';
import { generateId } from '../../utils/id-generator';
import { ModuleRegistry } from '../../modules/module-registry';
import { debounce } from '../../utils/debounce';
import { EDITOR_DEBOUNCE_MS } from '../../utils/constants';

type StateListener = (state: EditorState) => void;

export class EditorStateManager {
  private state: EditorState;
  private undoRedo = new UndoRedoStack<MagicCardConfig>();
  private listeners: Set<StateListener> = new Set();
  private dispatchConfigChanged: ((config: MagicCardConfig) => void) & { cancel: () => void };

  constructor(private fireEvent: (config: MagicCardConfig) => void) {
    this.state = {
      config: { type: 'custom:magic-card', rows: [] },
      selectedPath: null,
      activeTab: 'general',
      editorMode: 'form',
      isDirty: false,
    };

    this.dispatchConfigChanged = debounce((config: MagicCardConfig) => {
      this.fireEvent(config);
    }, EDITOR_DEBOUNCE_MS);
  }

  // ── Subscription ──

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }

  // ── Getters ──

  getState(): EditorState {
    return this.state;
  }

  getConfig(): MagicCardConfig {
    return this.state.config;
  }

  getSelectedModule(): CardModule | null {
    const path = this.state.selectedPath;
    if (
      path?.rowIndex === undefined ||
      path?.columnIndex === undefined ||
      path?.moduleIndex === undefined
    )
      return null;

    return (
      this.state.config.rows[path.rowIndex]?.columns[path.columnIndex]?.modules[
        path.moduleIndex
      ] ?? null
    );
  }

  // ── Config Management ──

  setConfig(config: MagicCardConfig): void {
    this.state = { ...this.state, config: deepClone(config), isDirty: false };
    this.notify();
  }

  updateConfig(config: MagicCardConfig, recordUndo = true): void {
    if (recordUndo) {
      this.undoRedo.push(this.state.config);
    }
    this.state = { ...this.state, config: deepClone(config), isDirty: true };
    this.notify();
    this.dispatchConfigChanged(this.state.config);
  }

  // ── Editor State ──

  setEditorMode(mode: EditorMode): void {
    this.state = { ...this.state, editorMode: mode };
    this.notify();
  }

  setSelectedPath(path: EditorPath | null): void {
    this.state = { ...this.state, selectedPath: path };
    this.notify();
  }

  setActiveTab(tab: EditorTab): void {
    this.state = { ...this.state, activeTab: tab };
    this.notify();
  }

  private _equalLayout(colCount: number): string {
    return Array.from({ length: Math.max(colCount, 1) }, () => '1').join('-');
  }

  // ── Row Operations ──

  addRow(layout = '1'): void {
    const config = deepClone(this.state.config);
    const colCount = layout.split('-').length;
    const columns: ColumnConfig[] = Array.from({ length: colCount }, () => ({
      id: generateId('col'),
      modules: [],
    }));

    config.rows.push({
      id: generateId('row'),
      layout,
      columns,
    });

    this.updateConfig(config);
  }

  deleteRow(rowIndex: number): void {
    const config = deepClone(this.state.config);
    config.rows.splice(rowIndex, 1);
    this.state.selectedPath = null;
    this.updateConfig(config);
  }

  moveRow(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    const config = deepClone(this.state.config);
    const [row] = config.rows.splice(fromIndex, 1);
    config.rows.splice(toIndex, 0, row);
    this.updateConfig(config);
  }

  updateRow(rowIndex: number, updates: Partial<RowConfig>): void {
    const config = deepClone(this.state.config);
    config.rows[rowIndex] = { ...config.rows[rowIndex], ...updates };
    this.updateConfig(config);
  }

  // ── Column Operations ──

  addColumn(rowIndex: number): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    row.columns.push({
      id: generateId('col'),
      modules: [],
    });
    row.layout = this._equalLayout(row.columns.length);
    this.updateConfig(config);
  }

  deleteColumn(rowIndex: number, colIndex: number): void {
    const config = deepClone(this.state.config);
    const row = config.rows[rowIndex];
    row.columns.splice(colIndex, 1);
    if (row.columns.length === 0) {
      config.rows.splice(rowIndex, 1);
    } else {
      row.layout = this._equalLayout(row.columns.length);
    }
    this.state.selectedPath = null;
    this.updateConfig(config);
  }

  // ── Module Operations ──

  addModule(rowIndex: number, colIndex: number, type: ModuleType): void {
    const config = deepClone(this.state.config);
    const newModule = ModuleRegistry.createDefault(type);
    if (!newModule) return;

    config.rows[rowIndex].columns[colIndex].modules.push(newModule);
    const moduleIndex = config.rows[rowIndex].columns[colIndex].modules.length - 1;

    this.updateConfig(config);
    this.setSelectedPath({ rowIndex, columnIndex: colIndex, moduleIndex });
  }

  deleteModule(rowIndex: number, colIndex: number, moduleIndex: number): void {
    const config = deepClone(this.state.config);
    config.rows[rowIndex].columns[colIndex].modules.splice(moduleIndex, 1);
    this.state.selectedPath = null;
    this.updateConfig(config);
  }

  updateModule(
    rowIndex: number,
    colIndex: number,
    moduleIndex: number,
    updates: Partial<CardModule>,
  ): void {
    const config = deepClone(this.state.config);
    const mod = config.rows[rowIndex].columns[colIndex].modules[moduleIndex];
    config.rows[rowIndex].columns[colIndex].modules[moduleIndex] = { ...mod, ...updates };
    this.updateConfig(config);
  }

  moveModule(
    fromRow: number,
    fromCol: number,
    fromIdx: number,
    toRow: number,
    toCol: number,
    toIdx: number,
  ): void {
    const config = deepClone(this.state.config);
    const [mod] = config.rows[fromRow].columns[fromCol].modules.splice(fromIdx, 1);
    config.rows[toRow].columns[toCol].modules.splice(toIdx, 0, mod);
    this.updateConfig(config);
  }

  // ── Undo / Redo ──

  undo(): void {
    const prev = this.undoRedo.undo(this.state.config);
    if (prev) {
      this.state = { ...this.state, config: prev, isDirty: true };
      this.notify();
      this.dispatchConfigChanged(prev);
    }
  }

  redo(): void {
    const next = this.undoRedo.redo(this.state.config);
    if (next) {
      this.state = { ...this.state, config: next, isDirty: true };
      this.notify();
      this.dispatchConfigChanged(next);
    }
  }

  canUndo(): boolean {
    return this.undoRedo.canUndo();
  }

  canRedo(): boolean {
    return this.undoRedo.canRedo();
  }

  // ── Cleanup ──

  destroy(): void {
    this.dispatchConfigChanged.cancel();
    this.listeners.clear();
    this.undoRedo.clear();
  }
}
