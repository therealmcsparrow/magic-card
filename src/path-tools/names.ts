import type { MessageId } from '../contracts/i18n';
import type { PathTool, ToolRefusal } from '../contracts/path-tools';
import { m } from './i18n';

/*
 * What the panel says about each tool, as ids marked with m() and rendered with t(). The refusal messages are the
 * contract's, word for word (path-tools 1.0.0).
 */

export const REFUSALS: Record<ToolRefusal, MessageId> = {
  'too-complex': m('This shape has too many points for this tool.'),
  empty: m('Nothing would be left of this shape.'),
  'no-stroke': m('This shape has no stroke to outline.'),
  'no-area': m('Select a closed shape. Open lines have no area.'),
  'no-change': m('This shape is already as simple as this setting allows.'),
  'not-open': m('Join works on open paths. Use Split first to open a closed one.'),
  'at-end': m('Pick a point between the ends to split here.'),
  'no-line': m('Draw a longer cut line.'),
};

export const TITLE: Record<PathTool, MessageId> = {
  'outline-stroke': m('Outline stroke'),
  offset: m('Offset path'),
  simplify: m('Simplify'),
  join: m('Join'),
  split: m('Split'),
  knife: m('Knife'),
};

export const HELP: Record<PathTool, MessageId> = {
  'outline-stroke': m('Turns the stroke into a filled shape you can edit point by point.'),
  offset: m('Grows or shrinks the shape by the amount you set.'),
  simplify: m('Fits the shape again with fewer points.'),
  join: m('Joins the two nearest ends of the selected open paths. With one path selected, it closes it.'),
  split: m('Splits the path at the selected point.'),
  knife: m('Draw a line across the shapes to cut them in two.'),
};
