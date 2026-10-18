import type { PathCanvasChunk } from '../contracts/path-canvas';
import type { PathEdit, PathTidy } from '../contracts/path-model';

/*
 * The editor-only path-model parts (edit, tidy) come from the path canvas chunk's exports, not from
 * imports of src/path/edit.ts or tidy.ts (path-canvas 1.0.0, one copy rule). The editor binds them once
 * the chunk has loaded; nothing here runs before that.
 */

export let E: PathEdit;
export let T: PathTidy;

export function bind(c: Pick<PathCanvasChunk, 'pathEdit' | 'pathTidy'>): void {
  E = c.pathEdit;
  T = c.pathTidy;
}
