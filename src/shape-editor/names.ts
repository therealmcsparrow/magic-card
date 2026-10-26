import type { CornerKey, CornerType } from '../contracts/custom-shape';
import type { MessageId } from '../contracts/i18n';
import type { PrimitiveKind } from '../contracts/path-model';
import { m } from './i18n';

/*
 * Names the shape editor shows for things it holds as data (corners, sizes, corner types, shapes, library problems).
 * Each is an id marked with m() and rendered with t(), so the words live in the namespace's tables, never here.
 */

export const CORNER: Record<CornerKey, MessageId> = {
  tl: m('Top left corner'),
  tr: m('Top right corner'),
  br: m('Bottom right corner'),
  bl: m('Bottom left corner'),
};

/** The Edit at choices, in order. */
export const EDIT_AT: Array<[string, MessageId]> = [
  ['tile', m('Tile')],
  ['row', m('Row')],
  ['wide', m('Wide')],
  ['custom', m('Custom')],
];

export const SIZE: Record<string, MessageId> = {
  tile: m('Tile, square 120 x 120'),
  row: m('Row, wide 360 x 120'),
  wide: m('Wide banner 720 x 200'),
  custom: m('Custom size'),
};

export const SHORT: Record<string, MessageId> = {
  tile: m('Tile'),
  row: m('Row'),
  wide: m('Wide banner'),
  custom: m('Custom size'),
};

export const STARTER: Record<string, MessageId> = {
  rounded: m('Rounded'),
  cut: m('Cut corners'),
  scooped: m('Scooped'),
  notched: m('Notched'),
  two: m('Two notched corners'),
};

export const TYPE: Record<CornerType, MessageId> = {
  round: m('Round'),
  squircle: m('Squircle'),
  bevel: m('Bevel'),
  scoop: m('Scoop'),
  notch: m('Notch'),
  square: m('Square'),
};

export const TYPE_HELP: Record<CornerType, MessageId> = {
  round: m('A quarter circle.'),
  squircle: m('A softer round, between a circle and a square.'),
  bevel: m('A straight diagonal cut.'),
  scoop: m('A quarter circle cut into the card.'),
  notch: m('A square step cut into the corner.'),
  square: m('No change, a sharp corner.'),
};

export const SIDE: Record<'top' | 'right' | 'bottom' | 'left', MessageId> = {
  top: m('Top'),
  right: m('Right'),
  bottom: m('Bottom'),
  left: m('Left'),
};

export const HANDLE: Record<'in' | 'out', MessageId> = { in: m('In handle'), out: m('Out handle') };

export const BOX: Record<'x' | 'y' | 'w' | 'h', MessageId> = { x: m('X'), y: m('Y'), w: m('W'), h: m('H') };

export const PRIM: Record<PrimitiveKind, MessageId> = {
  'rounded-rect': m('Rounded rectangle'),
  triangle: m('Triangle'),
  arrow: m('Arrow'),
  chevron: m('Chevron'),
  plus: m('Plus'),
  heart: m('Heart'),
  'speech-bubble': m('Speech bubble'),
  drop: m('Drop'),
  leaf: m('Leaf'),
  shield: m('Shield'),
  cloud: m('Cloud'),
  ticket: m('Ticket'),
  tab: m('Tab'),
  tag: m('Tag'),
  circle: m('Circle'),
  ellipse: m('Ellipse'),
  semicircle: m('Semicircle'),
  star: m('Star'),
  hexagon: m('Hexagon'),
};

/** What an anchored axis measures, by anchor and axis (xl: from the left edge, yr: from the bottom edge ...). */
export const DIST: Record<string, MessageId> = {
  xl: m('Distance from the left edge'),
  xr: m('Distance from the right edge'),
  yl: m('Distance from the top edge'),
  yr: m('Distance from the bottom edge'),
};

/** The shape's own names for the presets "Edit as custom" starts from (model.ts keeps them as English keys). */
export const PRESET: Record<string, MessageId> = {
  Squircle: m('Squircle'),
  Notch: m('Notch'),
  Octagon: m('Octagon'),
  Pill: m('Pill'),
  Circle: m('Circle'),
  Hexagon: m('Hexagon'),
};

/** Combine, Subtract, Intersect: the id is the path-booleans operation. */
export const OPS: Array<[string, MessageId]> = [
  ['union', m('Combine')],
  ['subtract', m('Subtract')],
  ['intersect', m('Intersect')],
];

/** The two sample lines drawn in the text area. */
export const SAMPLE: MessageId[] = [m('Living room'), m('Lamp on')];

/** Why the library said no, by problem. */
export const FAIL: Record<string, MessageId> = {
  readonly: m('Your account can use the library but not change it. Ask an admin, or keep this shape in the card only.'),
  conflict: m('This shape changed while you were editing. Save as new, or reload it.'),
  full: m('The library is full. Delete a shape first.'),
  missing: m('Keep your own shapes for every dashboard with the free Magic Card Utils add-on.'),
  invalid: m('This shape is too big for the library (8 KB).'),
};

/** The lines of the Shortcuts popover. */
export const SHORTCUTS: MessageId[] = [
  m('Tab into the canvas, then [ and ] choose a point.'),
  m('Arrow keys move the point. Shift moves it further, Alt moves it less.'),
  m('Delete removes the point.'),
  m('V is Select. P is Pen.'),
  m('Ctrl+Z undoes, Ctrl+Shift+Z redoes, Ctrl+S saves.'),
  m('Right-click, long-press, the Menu key or Shift+F10 opens Outline actions.'),
  m('Show or hide panels: Ctrl+\\ or ⌘\\'),
  m('Esc closes a window, then ends a drawing.'),
];

/** The id for a preset's name; one that is not listed shows as it is. */
export const presetName = (from: string): MessageId => PRESET[from] ?? from;
