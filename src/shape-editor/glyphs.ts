import type { SVGTemplateResult } from 'lit';
import type { CornerType } from '../contracts/custom-shape';
import { cornerGlyph } from '../ui-kit/glyphs';

/* The corner type glyphs now live in the ui-kit glyph set; this keeps the shape editor's call sites. */
export const glyph = (t: CornerType, turn = 0): SVGTemplateResult => cornerGlyph(t, turn);
