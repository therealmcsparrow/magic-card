import { t } from './i18n';

/*
 * Field errors come from the document validators in English: the animation model and the particles module sit in
 * magic-card.js and the particles chunk, which carry no studio text (contract i18n 1.0.0). The studio
 * shows them through this table: a message it knows reads in the current language (formatted ones by their shape),
 * anything else stays as the validator wrote it. A new validator message needs a line here, or it shows in English.
 */

const EXACT: Record<string, () => string> = {
  'A clip cannot play its own document (use self).': () => t('A clip cannot play its own document (use self).'),
  'A sequence cannot play itself.': () => t('A sequence cannot play itself.'),
  'Another track already animates this target.': () => t('Another track already animates this target.'),
  'Children cannot have children of their own.': () => t('Children cannot have children of their own.'),
  'color_mix needs two colours.': () => t('color_mix needs two colours.'),
  'Draw-on is only for icon parts and shapes.': () => t('Draw-on is only for icon parts and shapes.'),
  'Min must not be above max.': () => t('Min must not be above max.'),
  'Must be [min, max] px between 1 and 200, min ≤ max.': () => t('Must be [min, max] px between 1 and 200, min ≤ max.'),
  'Must be [min, max].': () => t('Must be [min, max].'),
  'Must be 1-16 of a-z, 0-9 and -, and unique.': () => t('Must be 1-16 of a-z, 0-9 and -, and unique.'),
  'Must be a list.': () => t('Must be a list.'),
  'Must be a motion preset or a custom keyframes / path animation.': () => t('Must be a motion preset or a custom keyframes / path animation.'),
  'Must be a number.': () => t('Must be a number.'),
  'Must be a pair [from, to].': () => t('Must be a pair [from, to].'),
  'Must be a particle, ring or scene preset.': () => t('Must be a particle, ring or scene preset.'),
  'Must be a state (text).': () => t('Must be a state (text).'),
  'Must be a subpath index (a whole number from 0).': () => t('Must be a subpath index (a whole number from 0).'),
  'Must be a whole number.': () => t('Must be a whole number.'),
  'Must be an attribute name.': () => t('Must be an attribute name.'),
  'Must be an icon id like mdi:bell.': () => t('Must be an icon id like mdi:bell.'),
  'Must be an icon id like mdi:star.': () => t('Must be an icon id like mdi:star.'),
  'Must be an object.': () => t('Must be an object.'),
  'Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.': () => t('Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.'),
  'Must be self, none, a preset or custom:<id>.': () => t('Must be self, none, a preset or custom:<id>.'),
  'Must be SVG markup.': () => t('Must be SVG markup.'),
  'Must be text of at most 40 characters.': () => t('Must be text of at most 40 characters.'),
  'Must be text.': () => t('Must be text.'),
  'Must be three numbers [x, y, z], not all 0.': () => t('Must be three numbers [x, y, z], not all 0.'),
  'Must be true or false.': () => t('Must be true or false.'),
  'Must be two numbers (colours only for color_mix).': () => t('Must be two numbers (colours only for color_mix).'),
  'Must be two numbers [x, y].': () => t('Must be two numbers [x, y].'),
  'Must be up to 8 characters (an emoji or a symbol).': () => t('Must be up to 8 characters (an emoji or a symbol).'),
  'Must differ from min.': () => t('Must differ from min.'),
  'Needs at least one entry.': () => t('Needs at least one entry.'),
  'No <svg> element found.': () => t('No <svg> element found.'),
  'Not a part of this rig.': () => t('Not a part of this rig.'),
  'Not a timeline lane.': () => t('Not a timeline lane.'),
  'Not a valid animation id.': () => t('Not a valid animation id.'),
  'Not a valid colour.': () => t('Not a valid colour.'),
  'Not a valid easing.': () => t('Not a valid easing.'),
  'Not serialisable.': () => t('Not serialisable.'),
  'Not valid path data (it must start with M).': () => t('Not valid path data (it must start with M).'),
  'Only for the trigger time.': () => t('Only for the trigger time.'),
  'Required.': () => t('Required.'),
  'Set icon or svg, not both.': () => t('Set icon or svg, not both.'),
  'Set one of builtin, icon, emoji or svg.': () => t('Set one of builtin, icon, emoji or svg.'),
  'Set one of from or svg.': () => t('Set one of from or svg.'),
  'Set one of icon, emoji or svg.': () => t('Set one of icon, emoji or svg.'),
  'Set one of state, state_not, entity_on, above or below.': () => t('Set one of state, state_not, entity_on, above or below.'),
  'The path draws nothing.': () => t('The path draws nothing.'),
  'The SVG draws nothing.': () => t('The SVG draws nothing.'),
  'The SVG has no shapes to draw.': () => t('The SVG has no shapes to draw.'),
  'The SVG is larger than 32 KB.': () => t('The SVG is larger than 32 KB.'),
  'The SVG is too complex.': () => t('The SVG is too complex.'),
  'Unsupported version (expected 1).': () => t('Unsupported version (expected 1).'),
  'Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).': () => t('Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).'),
  'Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).': () => t('Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).'),
  'Use keywords, lengths or percentages, e.g. "50% 100%".': () => t('Use keywords, lengths or percentages, e.g. "50% 100%".'),
};

/** Messages with a number or a name in them, by their shape. */
const SHAPED: Array<[RegExp, (m: RegExpExecArray) => string]> = [
  [/^At most (\d+) animations\.$/, (m) => t('At most {max} animations.', { max: +m[1] })],
  [/^At most (\d+) characters\.$/, (m) => t('At most {max} characters.', { max: +m[1] })],
  [/^At most (\d+) entries\.$/, (m) => t('At most {max} entries.', { max: +m[1] })],
  [/^At most (\d+) particles over all emitters\.$/, (m) => t('At most {max} particles over all emitters.', { max: +m[1] })],
  [/^Duplicate id "(.*)"\.$/, (m) => t('Duplicate id "{id}".', { id: m[1] })],
  [/^Must be between (\S+) and (\S+)\.$/, (m) => t('Must be between {min} and {max}.', { min: m[1], max: m[2] })],
  [/^Must be one of: (.+)\.$/, (m) => t('Must be one of: {options}.', { options: m[1] })],
  [/^Needs at least (\d+) entries\.$/, (m) => t('Needs at least {min} entries.', { min: +m[1] })],
  [/^No (\w+) "(.*)" in the rig\.$/, (m) => t('No {kind} "{id}" in the rig.', { kind: m[1], id: m[2] })],
  [/^Not an allowed (\w+) value\.$/, (m) => t('Not an allowed {kind} value.', { kind: m[1] })],
  [/^The animation is larger than (\d+) KB\.$/, (m) => t('The animation is larger than {size} KB.', { size: +m[1] })],
  [/^This card plays engine (\d+); update Magic Card to play this animation\.$/, (m) => t('This card plays engine {engine}; update Magic Card to play this animation.', { engine: +m[1] })],
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
