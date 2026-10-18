/*
 * Every word the path tool panel shows (aico:i18n): one table, no concatenated sentences. English only for now;
 * a translation replaces `T` as a whole. The refusal messages are the contract's, word for word.
 */
import type { PathTool, ToolRefusal } from '../contracts/path-tools';

const n = (count: number, one: string, many: string): string => `${count.toLocaleString()} ${count === 1 ? one : many}`;

export const REFUSALS: Record<ToolRefusal, string> = {
  'too-complex': 'This shape has too many points for this tool.',
  empty: 'Nothing would be left of this shape.',
  'no-stroke': 'This shape has no stroke to outline.',
  'no-area': 'Select a closed shape. Open lines have no area.',
  'no-change': 'This shape is already as simple as this setting allows.',
  'not-open': 'Join works on open paths. Use Split first to open a closed one.',
  'at-end': 'Pick a point between the ends to split here.',
  'no-line': 'Draw a longer cut line.',
};

export const T = {
  title: {
    'outline-stroke': 'Outline stroke',
    offset: 'Offset path',
    simplify: 'Simplify',
    join: 'Join',
    split: 'Split',
    knife: 'Knife',
  } as Record<PathTool, string>,
  help: {
    'outline-stroke': 'Turns the stroke into a filled shape you can edit point by point.',
    offset: 'Grows or shrinks the shape by the amount you set.',
    simplify: 'Fits the shape again with fewer points.',
    join: 'Joins the two nearest ends of the selected open paths. With one path selected, it closes it.',
    split: 'Splits the path at the selected point.',
    knife: 'Draw a line across the shapes to cut them in two.',
  } as Record<PathTool, string>,
  amount: 'Amount',
  amountHelp: 'Positive grows the shape, negative shrinks it.',
  joins: 'Corners',
  round: 'Round',
  miter: 'Sharp',
  tolerance: 'Detail kept',
  toleranceHelp: 'A higher value drops more points.',
  smooth: 'Smooth corners',
  points: (c: number): string => n(c, 'point', 'points'),
  outcome: (before: number, after: number): string => `${n(before, 'point', 'points')} now, ${n(after, 'point', 'points')} after`,
  working: 'Working on it',
  noPreview: 'Nothing to preview yet.',
  apply: 'Apply',
  cancel: 'Cancel',
  loadFail: "Couldn't load the path tools. Try again.",
};
