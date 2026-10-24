import type { Kit } from '../image-editor/kit';
import { emptyNotes, readMarkup } from './import';
import { slug } from './library';
import { blankDoc, isOff, newShape, pointCount, removeShapes, reserveIds, round2, shapeBox, toSvg } from './model';
import { artLayer } from './views';

/** What the shell hands the image editor (see image-editor/kit.ts). */
export const imageKit: Kit = { blankDoc, isOff, newShape, pointCount, removeShapes, reserveIds, round2, shapeBox, toSvg, readMarkup, emptyNotes, artLayer, slug };
