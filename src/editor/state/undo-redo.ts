import { UNDO_STACK_LIMIT } from '../../utils/constants';
import { deepClone } from '../../utils/deep-merge';

export class UndoRedoStack<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private limit: number;

  constructor(limit = UNDO_STACK_LIMIT) {
    this.limit = limit;
  }

  push(state: T): void {
    this.undoStack.push(deepClone(state));
    if (this.undoStack.length > this.limit) {
      this.undoStack.shift();
    }
    this.redoStack = [];
  }

  undo(current: T): T | null {
    if (this.undoStack.length === 0) return null;
    this.redoStack.push(deepClone(current));
    return this.undoStack.pop()!;
  }

  redo(current: T): T | null {
    if (this.redoStack.length === 0) return null;
    this.undoStack.push(deepClone(current));
    return this.redoStack.pop()!;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  get undoCount(): number {
    return this.undoStack.length;
  }

  get redoCount(): number {
    return this.redoStack.length;
  }
}
