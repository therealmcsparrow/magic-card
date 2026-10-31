import type { PathCanvasChunk } from '../contracts/path-canvas';
import type { PathDraw, PathEdit, PathTidy } from '../contracts/path-model';

// Binds the editor-only path-model parts (edit, tidy, draw) from the path canvas chunk exports once it has loaded (path-canvas 1.0.0).

export let E: PathEdit;
export let T: PathTidy;
export let D: PathDraw;

export function bind(c: Pick<PathCanvasChunk, 'pathEdit' | 'pathTidy' | 'pathDraw'>): void {
  E = c.pathEdit;
  T = c.pathTidy;
  D = c.pathDraw;
}
