import type * as Model from '../svg-editor/model';
import type * as Import from '../svg-editor/import';
import type * as Views from '../svg-editor/views';
import type * as Library from '../svg-editor/library';

/*
 * The functions of the svg-editor chunk that the image editor uses. The shell hands them over when it creates the
 * image editor instead of the chunk importing those modules: a module another chunk imports can no longer be merged into
 * the editor's own, which costs the svg-editor chunk more than the functions weigh.
 */
export interface Kit {
  blankDoc: typeof Model.blankDoc;
  isOff: typeof Model.isOff;
  newShape: typeof Model.newShape;
  pointCount: typeof Model.pointCount;
  removeShapes: typeof Model.removeShapes;
  reserveIds: typeof Model.reserveIds;
  round2: typeof Model.round2;
  shapeBox: typeof Model.shapeBox;
  toSvg: typeof Model.toSvg;
  readMarkup: typeof Import.readMarkup;
  emptyNotes: typeof Import.emptyNotes;
  artLayer: typeof Views.artLayer;
  slug: typeof Library.slug;
  libraryCall: typeof Library.libraryCall;
}

export let K: Kit;
export const bindKit = (k: Kit): void => void (K = k);
