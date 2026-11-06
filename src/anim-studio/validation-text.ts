import { t } from './i18n';

// Field errors come from the document validators in English, since the animation model and the particles module carry no studio text.
// The studio shows them through this table in the current language; anything unknown stays as the validator wrote it.
// A new validator message needs a line here, or it shows in English.

const EXACT: Record<string, () => string> = {
  'A clip cannot play its own document (use self).': () => t('anim-studio.validation-text.a-clip-cannot-play-its-own-document-use'),
  'A sequence cannot play itself.': () => t('anim-studio.validation-text.a-sequence-cannot-play-itself'),
  'Another track already animates this target.': () => t('anim-studio.validation-text.another-track-already-animates-this'),
  'Children cannot have children of their own.': () => t('anim-studio.validation-text.children-cannot-have-children-of-their'),
  'color_mix needs two colours.': () => t('anim-studio.validation-text.color-mix-needs-two-colours'),
  'Draw-on is only for icon parts and shapes.': () => t('anim-studio.validation-text.draw-on-is-only-for-icon-parts-and'),
  'Min must not be above max.': () => t('anim-studio.validation-text.min-must-not-be-above-max'),
  'Must be [min, max] px between 1 and 200, min ≤ max.': () => t('anim-studio.validation-text.must-be-min-max-px-between-1-and-200-min'),
  'Must be [min, max].': () => t('anim-studio.validation-text.must-be-min-max'),
  'Must be 1-16 of a-z, 0-9 and -, and unique.': () => t('anim-studio.validation-text.must-be-1-16-of-a-z-0-9-and-and-unique'),
  'Must be a list.': () => t('anim-studio.validation-text.must-be-a-list'),
  'Must be a motion preset or a custom keyframes / path animation.': () => t('anim-studio.validation-text.must-be-a-motion-preset-or-a-custom'),
  'Must be a number.': () => t('anim-studio.validation-text.must-be-a-number'),
  'Must be a pair [from, to].': () => t('anim-studio.validation-text.must-be-a-pair-from-to'),
  'Must be a particle, ring or scene preset.': () => t('anim-studio.validation-text.must-be-a-particle-ring-or-scene-preset'),
  'Must be a state (text).': () => t('anim-studio.validation-text.must-be-a-state-text'),
  'Must be a subpath index (a whole number from 0).': () => t('anim-studio.validation-text.must-be-a-subpath-index-a-whole-number'),
  'Must be a whole number.': () => t('anim-studio.validation-text.must-be-a-whole-number'),
  'Must be an attribute name.': () => t('anim-studio.validation-text.must-be-an-attribute-name'),
  'Must be an icon id like mdi:bell.': () => t('anim-studio.validation-text.must-be-an-icon-id-like-mdi-bell'),
  'Must be an icon id like mdi:star.': () => t('anim-studio.validation-text.must-be-an-icon-id-like-mdi-star'),
  'Must be an object.': () => t('anim-studio.validation-text.must-be-an-object'),
  'Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.': () => t('anim-studio.validation-text.must-be-element-icon-name-state'),
  'Must be self, none, a preset or custom:<id>.': () => t('anim-studio.validation-text.must-be-self-none-a-preset-or-custom-id'),
  'Must be SVG markup.': () => t('anim-studio.validation-text.must-be-svg-markup'),
  'Must be text of at most 40 characters.': () => t('anim-studio.validation-text.must-be-text-of-at-most-40-characters'),
  'Must be text.': () => t('anim-studio.validation-text.must-be-text'),
  'Must be three numbers [x, y, z], not all 0.': () => t('anim-studio.validation-text.must-be-three-numbers-x-y-z-not-all-0'),
  'Must be true or false.': () => t('anim-studio.validation-text.must-be-true-or-false'),
  'Must be two numbers (colours only for color_mix).': () => t('anim-studio.validation-text.must-be-two-numbers-colours-only-for'),
  'Must be two numbers [x, y].': () => t('anim-studio.validation-text.must-be-two-numbers-x-y'),
  'Must be up to 8 characters (an emoji or a symbol).': () => t('anim-studio.validation-text.must-be-up-to-8-characters-an-emoji-or-a'),
  'Must differ from min.': () => t('anim-studio.validation-text.must-differ-from-min'),
  'Needs at least one entry.': () => t('anim-studio.validation-text.needs-at-least-one-entry'),
  'No <svg> element found.': () => t('anim-studio.validation-text.no-svg-element-found'),
  'Not a part of this rig.': () => t('anim-studio.validation-text.not-a-part-of-this-rig'),
  'Not a timeline lane.': () => t('anim-studio.validation-text.not-a-timeline-lane'),
  'Not a valid animation id.': () => t('anim-studio.validation-text.not-a-valid-animation-id'),
  'Not a valid colour.': () => t('anim-studio.validation-text.not-a-valid-colour'),
  'Not a valid easing.': () => t('anim-studio.validation-text.not-a-valid-easing'),
  'Not serialisable.': () => t('anim-studio.validation-text.not-serialisable'),
  'Not valid path data (it must start with M).': () => t('anim-studio.validation-text.not-valid-path-data-it-must-start-with-m'),
  'Only for the trigger time.': () => t('anim-studio.validation-text.only-for-the-trigger-time'),
  'Required.': () => t('anim-studio.validation-text.required'),
  'Set icon or svg, not both.': () => t('anim-studio.validation-text.set-icon-or-svg-not-both'),
  'Set one of builtin, icon, emoji or svg.': () => t('anim-studio.validation-text.set-one-of-builtin-icon-emoji-or-svg'),
  'Set one of from or svg.': () => t('anim-studio.validation-text.set-one-of-from-or-svg'),
  'Set one of icon, emoji or svg.': () => t('anim-studio.validation-text.set-one-of-icon-emoji-or-svg'),
  'Set one of state, state_not, entity_on, above or below.': () => t('anim-studio.validation-text.set-one-of-state-state-not-entity-on'),
  'The path draws nothing.': () => t('anim-studio.validation-text.the-path-draws-nothing'),
  'The SVG draws nothing.': () => t('anim-studio.validation-text.the-svg-draws-nothing'),
  'The SVG has no shapes to draw.': () => t('anim-studio.validation-text.the-svg-has-no-shapes-to-draw'),
  'The SVG is larger than 32 KB.': () => t('anim-studio.validation-text.the-svg-is-larger-than-32-kb'),
  'The SVG is too complex.': () => t('anim-studio.validation-text.the-svg-is-too-complex'),
  'Unsupported version (expected 1).': () => t('anim-studio.validation-text.unsupported-version-expected-1'),
  'Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).': () => t('anim-studio.validation-text.use-1-32-lowercase-letters-digits-or'),
  'Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).': () => t('anim-studio.validation-text.use-1-64-lowercase-letters-digits-or'),
  'Use keywords, lengths or percentages, e.g. "50% 100%".': () => t('anim-studio.validation-text.use-keywords-lengths-or-percentages-e-g'),
};

/** Messages with a number or a name in them, by their shape. */
const SHAPED: Array<[RegExp, (m: RegExpExecArray) => string]> = [
  [/^At most (\d+) animations\.$/, (m) => t('anim-studio.validation-text.at-most-max-animations', { max: +m[1] })],
  [/^At most (\d+) characters\.$/, (m) => t('anim-studio.validation-text.at-most-max-characters', { max: +m[1] })],
  [/^At most (\d+) entries\.$/, (m) => t('anim-studio.validation-text.at-most-max-entries', { max: +m[1] })],
  [/^At most (\d+) particles over all emitters\.$/, (m) => t('anim-studio.validation-text.at-most-max-particles-over-all-emitters', { max: +m[1] })],
  [/^Duplicate id "(.*)"\.$/, (m) => t('anim-studio.validation-text.duplicate-id-id', { id: m[1] })],
  [/^Must be between (\S+) and (\S+)\.$/, (m) => t('anim-studio.validation-text.must-be-between-min-and-max', { min: m[1], max: m[2] })],
  [/^Must be one of: (.+)\.$/, (m) => t('anim-studio.validation-text.must-be-one-of-options', { options: m[1] })],
  [/^Needs at least (\d+) entries\.$/, (m) => t('anim-studio.validation-text.needs-at-least-min-entries', { min: +m[1] })],
  [/^No (\w+) "(.*)" in the rig\.$/, (m) => t('anim-studio.validation-text.no-kind-id-in-the-rig', { kind: m[1], id: m[2] })],
  [/^Not an allowed (\w+) value\.$/, (m) => t('anim-studio.validation-text.not-an-allowed-kind-value', { kind: m[1] })],
  [/^The animation is larger than (\d+) KB\.$/, (m) => t('anim-studio.validation-text.the-animation-is-larger-than-size-kb', { size: +m[1] })],
  [/^The SVG has too many shapes; at most (\d+) fit\.$/, (m) => t('anim-studio.validation-text.the-svg-has-too-many-shapes-at-most-room', { room: +m[1] })],
  [/^This card plays engine (\d+); update Magic Card to play this animation\.$/, (m) => t('anim-studio.validation-text.this-card-plays-engine-engine-update', { engine: +m[1] })],
];

/** A validator message in the current language (unknown messages unchanged). */
export function validationText(message: string): string {
  const exact = EXACT[message];
  if (exact) return exact();
  for (const [re, fn] of SHAPED) {
    const m = re.exec(message);
    if (m) return fn(m);
  }
  return message;
}
