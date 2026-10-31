import type { MessageIndex } from '../contracts/i18n';
import type { PathTool, ToolRefusal } from '../contracts/path-tools';
import { m } from './i18n';

// What the panel says about each tool, as ids marked with m() and rendered with t(); refusal messages are the contract text (path-tools 1.0.0).

export const REFUSALS: Record<ToolRefusal, MessageIndex> = {
  'too-complex': m('path-tools.names.this-shape-has-too-many-points-for-this'),
  empty: m('path-tools.names.nothing-would-be-left-of-this-shape'),
  'no-stroke': m('path-tools.names.this-shape-has-no-stroke-to-outline'),
  'no-area': m('path-tools.names.select-a-closed-shape-open-lines-have-no'),
  'no-change': m('path-tools.names.this-shape-is-already-as-simple-as-this'),
  'not-open': m('path-tools.names.join-works-on-open-paths-use-split-first'),
  'at-end': m('path-tools.names.pick-a-point-between-the-ends-to-split'),
  'no-line': m('path-tools.names.draw-a-longer-cut-line'),
};

export const TITLE: Record<PathTool, MessageIndex> = {
  'outline-stroke': m('path-tools.names.outline-stroke'),
  offset: m('path-tools.names.offset-path'),
  simplify: m('path-tools.names.simplify'),
  join: m('path-tools.names.join'),
  split: m('path-tools.names.split'),
  knife: m('path-tools.names.knife'),
};

export const HELP: Record<PathTool, MessageIndex> = {
  'outline-stroke': m('path-tools.names.turns-the-stroke-into-a-filled-shape-you'),
  offset: m('path-tools.names.grows-or-shrinks-the-shape-by-the-amount'),
  simplify: m('path-tools.names.fits-the-shape-again-with-fewer-points'),
  join: m('path-tools.names.joins-the-two-nearest-ends-of-the'),
  split: m('path-tools.names.splits-the-path-at-the-selected-point'),
  knife: m('path-tools.names.draw-a-line-across-the-shapes-to-cut'),
};
