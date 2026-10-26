import type { MessageId } from '../contracts/i18n';
import type { BooleanOp } from '../contracts/path-booleans';
import type { PrimitiveKind } from '../contracts/path-model';
import type { PathTool } from '../contracts/path-tools';
import type { SvgAlignEdge, SvgAlignTarget, SvgArrange } from '../contracts/svg-editor';
import { m } from './i18n';

/*
 * Names the editor shows for things it holds as data (shapes, tones, align edges, tools). Each is an id marked with m()
 * and rendered with t(), so the words live in the namespace's tables, never here.
 */

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

export const TONE: Record<'main' | 'accent' | 'both', MessageId> = {
  main: m('Main'),
  accent: m('Accent'),
  both: m('Main + Accent'),
};

export const ALIGN_TARGETS: Record<SvgAlignTarget, MessageId> = {
  selection: m('Selection'),
  canvas: m('Canvas'),
  safe: m('Safe area'),
};

export const ALIGN_EDGE: Record<SvgAlignEdge, MessageId> = {
  left: m('Align left'),
  centre: m('Align centre'),
  right: m('Align right'),
  top: m('Align top'),
  middle: m('Align middle'),
  bottom: m('Align bottom'),
};

export const ARRANGE: Record<SvgArrange, MessageId> = {
  front: m('Bring to front'),
  forward: m('Forward'),
  backward: m('Backward'),
  back: m('Send to back'),
};

export const BOOL_OPS: Record<BooleanOp, MessageId> = {
  union: m('Combine'),
  subtract: m('Subtract'),
  intersect: m('Intersect'),
  exclude: m('Exclude'),
};

export const BOOL_NAME: Record<BooleanOp, MessageId> = {
  union: m('Combined shape'),
  subtract: m('Subtracted shape'),
  intersect: m('Intersected shape'),
  exclude: m('Excluded shape'),
};

export const PT_NAME: Record<PathTool, MessageId> = {
  'outline-stroke': m('Outline stroke'),
  offset: m('Offset path'),
  simplify: m('Simplify'),
  join: m('Join'),
  split: m('Split at point'),
  knife: m('Knife'),
};

/** What a finished combine says; {c} shapes took part, {n} were taken away from the first one, named {from}. */
export const BOOL_DONE: Record<BooleanOp, MessageId> = {
  union: m('Combined {c} shapes.'),
  subtract: m('Subtracted {n, plural, one {# shape} other {# shapes}} from {from}.'),
  intersect: m('Intersected {c} shapes.'),
  exclude: m('Excluded {c} shapes.'),
};

export const MOVE_WHY = {
  self: m("A group can't go inside itself."),
  none: m("It can't go there."),
};

/** The lines of the Shortcuts popover. */
export const HELP_KEYS: MessageId[] = [
  m('Ctrl+Z undo, Ctrl+Shift+Z redo, Ctrl+Enter Done, Ctrl+S Save to library'),
  m('Tools: V select, A points, P pen, R rectangle, E ellipse, L line, G polygon, S shapes, B freehand'),
  m('Zoom: = and -, fit: 0, grid: Ctrl+\', snap: Ctrl+;'),
  m('Arrows move, Shift+arrows move far, Alt+arrows move 0.1'),
  m('[ and ] previous and next point, C corner or smooth, H handle, Delete removes'),
  m('Ctrl+D duplicate, Ctrl+G group, Shift+H and Shift+V flip'),
  m('Show or hide panels: Ctrl+\\ or ⌘\\'),
  m('In a number field Ctrl+Z undoes the field. Press Enter first to undo the editor.'),
  m('On a Mac, Tab reaches buttons only when full keyboard access is on.'),
];
