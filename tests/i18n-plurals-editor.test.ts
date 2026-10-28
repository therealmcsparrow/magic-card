import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { setI18nLocale } from '../src/i18n/runtime';
import { t as anim, m as animM } from '../src/anim-studio/i18n';
import { t as shape, m as shapeM } from '../src/shape-editor/i18n';
import { t as editor, m as editorM } from '../src/editor/i18n';
import { t as layer, m as layerM } from '../src/editor/layers/i18n';
import { t as canvas, m as canvasM } from '../src/path-canvas/i18n';
import { t as look, m as lookM } from '../src/look-editor/i18n';
import { t as theme, m as themeM } from '../src/theme-editor/i18n';
import { msg } from '../tools/i18n/test-msg';

/* Counts shown with words are one plural message per place (icu.M1): en-GB and en-US take one/other, Dutch one/other. */

type Fn = (key: never, args?: Record<string, string | number>) => string;
type Row = [
  fn: Fn,
  id: unknown,
  key: string,
  args: Record<string, string | number>,
  gb: string,
  nl: string,
];
const row = (
  fn: unknown,
  id: unknown,
  key: string,
  args: Record<string, string | number>,
  gb: string,
  nl: string,
): Row => [fn as Fn, id, key, args, gb, nl];

const ONE_MANY: Row[][] = [
  [
    row(
      anim,
      animM('anim-studio.draw-host.erase-shapes'),
      'anim-studio.draw-host.erase-shapes',
      { count: 1 },
      'Erase shape',
      'Vorm wissen',
    ),
    row(
      anim,
      animM('anim-studio.draw-host.erase-shapes'),
      'anim-studio.draw-host.erase-shapes',
      { count: 3 },
      'Erase shapes',
      'Vormen wissen',
    ),
  ],
  [
    row(
      anim,
      animM('anim-studio.draw-svg-dialog.import-shapes'),
      'anim-studio.draw-svg-dialog.import-shapes',
      { count: 1 },
      'Import shape',
      'Vorm importeren',
    ),
    row(
      anim,
      animM('anim-studio.draw-svg-dialog.import-shapes'),
      'anim-studio.draw-svg-dialog.import-shapes',
      { count: 2 },
      'Import shapes',
      'Vormen importeren',
    ),
  ],
  [
    row(
      anim,
      animM('anim-studio.draw-svg-dialog.parts-shapes'),
      'anim-studio.draw-svg-dialog.parts-shapes',
      { parts: 1, shapes: 1 },
      '1 part, 1 shape',
      '1 onderdeel, 1 vorm',
    ),
    row(
      anim,
      animM('anim-studio.draw-svg-dialog.parts-shapes'),
      'anim-studio.draw-svg-dialog.parts-shapes',
      { parts: 2, shapes: 5 },
      '2 parts, 5 shapes',
      '2 onderdelen, 5 vormen',
    ),
    row(
      anim,
      animM('anim-studio.draw-svg-dialog.parts-shapes-no-icon'),
      'anim-studio.draw-svg-dialog.parts-shapes-no-icon',
      { parts: 1, shapes: 3 },
      '1 part, 3 shapes, no icon',
      '1 onderdeel, 3 vormen, geen pictogram',
    ),
  ],
  [
    row(
      anim,
      animM('anim-studio.parts-layers.groups-removed'),
      'anim-studio.parts-layers.groups-removed',
      { count: 1 },
      'Group removed',
      'Groep verwijderd',
    ),
    row(
      anim,
      animM('anim-studio.parts-layers.groups-removed'),
      'anim-studio.parts-layers.groups-removed',
      { count: 2 },
      'Groups removed',
      'Groepen verwijderd',
    ),
  ],
  [
    row(
      editor,
      editorM('card-editor.icon-fx-editor.this-svg-contains-list-remove-it-and-try'),
      'card-editor.icon-fx-editor.this-svg-contains-list-remove-it-and-try',
      { count: 1, list: 'a script' },
      'This SVG contains a script. Remove it and try again.',
      'Deze SVG bevat a script. Verwijder het en probeer het opnieuw.',
    ),
    row(
      editor,
      editorM('card-editor.icon-fx-editor.this-svg-contains-list-remove-it-and-try'),
      'card-editor.icon-fx-editor.this-svg-contains-list-remove-it-and-try',
      { count: 2, list: 'a and b' },
      'This SVG contains a and b. Remove them and try again.',
      'Deze SVG bevat a and b. Verwijder ze en probeer het opnieuw.',
    ),
  ],
  [
    row(
      canvas,
      canvasM('path-canvas.mc-path-canvas.point-deleted-points'),
      'path-canvas.mc-path-canvas.point-deleted-points',
      { deleted: 1, points: 3 },
      'Point deleted, 3 points.',
      'Punt verwijderd, 3 punten.',
    ),
    row(
      canvas,
      canvasM('path-canvas.mc-path-canvas.point-deleted-points'),
      'path-canvas.mc-path-canvas.point-deleted-points',
      { deleted: 2, points: 1 },
      'Points deleted, 1 point.',
      'Punten verwijderd, 1 punt.',
    ),
    row(
      canvas,
      canvasM('path-canvas.geometry.n-degrees'),
      'path-canvas.geometry.n-degrees',
      { n: 1 },
      '1 degree',
      '1 graad',
    ),
    row(
      canvas,
      canvasM('path-canvas.geometry.n-degrees'),
      'path-canvas.geometry.n-degrees',
      { n: 0 },
      '0 degrees',
      '0 graden',
    ),
    row(
      canvas,
      canvasM('path-canvas.geometry.n-degrees'),
      'path-canvas.geometry.n-degrees',
      { n: 1.5 },
      '1.5 degrees',
      '1,5 graden',
    ),
  ],
  [
    row(
      look,
      lookM('look-editor.mc-slider-look-editor.look-reset-count'),
      'look-editor.mc-slider-look-editor.look-reset-count',
      { count: 1 },
      'Look reset. 1 setting removed.',
      'Uiterlijk hersteld. 1 instelling verwijderd.',
    ),
    row(
      look,
      lookM('look-editor.mc-slider-look-editor.look-reset-count'),
      'look-editor.mc-slider-look-editor.look-reset-count',
      { count: 3 },
      'Look reset. 3 settings removed.',
      'Uiterlijk hersteld. 3 instellingen verwijderd.',
    ),
    row(
      look,
      lookM('look-editor.mc-slider-look-editor.name-look-applied-count'),
      'look-editor.mc-slider-look-editor.name-look-applied-count',
      { name: 'Soft', count: 1 },
      'Soft look applied. 1 setting changed.',
      'Uiterlijk Soft toegepast. 1 instelling gewijzigd.',
    ),
    row(
      look,
      lookM('look-editor.mc-slider-look-editor.name-look-applied-count'),
      'look-editor.mc-slider-look-editor.name-look-applied-count',
      { name: 'Soft', count: 4 },
      'Soft look applied. 4 settings changed.',
      'Uiterlijk Soft toegepast. 4 instellingen gewijzigd.',
    ),
  ],
  [
    row(
      theme,
      themeM('theme-editor.preset-dialog.these-are-presets-not-themes-on-your'),
      'theme-editor.preset-dialog.these-are-presets-not-themes-on-your',
      { count: 1 },
      'This is a preset, not a theme on your dashboard yet. Open it as a new theme to try it and to save it.',
      'Dit is een voorinstelling, nog geen thema op je dashboard. Open het als nieuw thema om het te proberen en op te slaan.',
    ),
    row(
      theme,
      themeM('theme-editor.preset-dialog.these-are-presets-not-themes-on-your'),
      'theme-editor.preset-dialog.these-are-presets-not-themes-on-your',
      { count: 2 },
      'These are presets, not themes on your dashboard yet. Choose New theme and pick one under My presets.',
      "Dit zijn voorinstellingen, nog geen thema's op je dashboard. Kies Nieuw thema en kies er een onder Mijn voorinstellingen.",
    ),
  ],
  [
    row(
      anim,
      animM('anim-studio.key-inspector.count-keyframes'),
      'anim-studio.key-inspector.count-keyframes',
      { count: 1 },
      '1 keyframe',
      '1 keyframe',
    ),
    row(
      anim,
      animM('anim-studio.key-inspector.count-keyframes'),
      'anim-studio.key-inspector.count-keyframes',
      { count: 4 },
      '4 keyframes',
      '4 keyframes',
    ),
    row(
      anim,
      animM('anim-studio.key-inspector.count-targets'),
      'anim-studio.key-inspector.count-targets',
      { count: 1 },
      '1 target',
      '1 doel',
    ),
    row(
      anim,
      animM('anim-studio.key-inspector.count-targets'),
      'anim-studio.key-inspector.count-targets',
      { count: 2 },
      '2 targets',
      '2 doelen',
    ),
    row(
      anim,
      animM('anim-studio.key-inspector.delete-count-keyframes'),
      'anim-studio.key-inspector.delete-count-keyframes',
      { count: 1 },
      'Delete 1 keyframe',
      '1 keyframe verwijderen',
    ),
    row(
      anim,
      animM('anim-studio.key-inspector.delete-count-keyframes'),
      'anim-studio.key-inspector.delete-count-keyframes',
      { count: 3 },
      'Delete 3 keyframes',
      '3 keyframes verwijderen',
    ),
    row(
      anim,
      animM('anim-studio.part-inspector.part-of-pieces-shapes'),
      'anim-studio.part-inspector.part-of-pieces-shapes',
      { pieces: 1 },
      'Part of 1 shape',
      'Deel van 1 vorm',
    ),
    row(
      anim,
      animM('anim-studio.part-inspector.part-of-pieces-shapes'),
      'anim-studio.part-inspector.part-of-pieces-shapes',
      { pieces: 3 },
      'Part of 3 shapes',
      'Deel van 3 vormen',
    ),
    row(
      anim,
      animM('anim-studio.part-presets-panel.count-parts'),
      'anim-studio.part-presets-panel.count-parts',
      { count: 3 },
      '3 parts',
      '3 onderdelen',
    ),
    row(
      anim,
      animM('anim-studio.part-presets-panel.count-targets-selected-a-preset-plays-on'),
      'anim-studio.part-presets-panel.count-targets-selected-a-preset-plays-on',
      { count: 1 },
      '1 target selected: a preset plays on each (Wave: one after another).',
      '1 doel geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).',
    ),
    row(
      anim,
      animM('anim-studio.part-presets-panel.count-targets-selected-a-preset-plays-on'),
      'anim-studio.part-presets-panel.count-targets-selected-a-preset-plays-on',
      { count: 2 },
      '2 targets selected: a preset plays on each (Wave: one after another).',
      '2 doelen geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).',
    ),
    row(
      anim,
      animM('anim-studio.parts-layers.count-shapes'),
      'anim-studio.parts-layers.count-shapes',
      { count: 1 },
      '1 shape',
      '1 vorm',
    ),
    row(
      anim,
      animM('anim-studio.parts-layers.count-shapes'),
      'anim-studio.parts-layers.count-shapes',
      { count: 2 },
      '2 shapes',
      '2 vormen',
    ),
    row(
      shape,
      shapeM('shape-editor.mc-shape-studio.only-the-first-of-c-shapes-in-the-file'),
      'shape-editor.mc-shape-studio.only-the-first-of-c-shapes-in-the-file',
      { c: 2 },
      'Only the first of 2 shapes in the file was used.',
      'Alleen de eerste van de 2 vormen in het bestand is gebruikt.',
    ),
    row(
      shape,
      shapeM('shape-editor.mc-shape-studio.the-result-needs-c-points-a-card-shape'),
      'shape-editor.mc-shape-studio.the-result-needs-c-points-a-card-shape',
      { c: 1, max: 64 },
      'The result needs 1 point. A card shape can have 64. Nothing was changed. Try a smaller or simpler shape.',
      'Het resultaat heeft 1 punt nodig. Een kaartvorm kan er 64 hebben. Er is niets gewijzigd. Probeer een kleinere of eenvoudigere vorm.',
    ),
    row(
      shape,
      shapeM('shape-editor.mc-shape-studio.the-result-needs-c-points-a-card-shape'),
      'shape-editor.mc-shape-studio.the-result-needs-c-points-a-card-shape',
      { c: 70, max: 64 },
      'The result needs 70 points. A card shape can have 64. Nothing was changed. Try a smaller or simpler shape.',
      'Het resultaat heeft 70 punten nodig. Een kaartvorm kan er 64 hebben. Er is niets gewijzigd. Probeer een kleinere of eenvoudigere vorm.',
    ),
    row(
      layer,
      layerM('layer-editor.bg-layers.needs-n-free-layers'),
      'layer-editor.bg-layers.needs-n-free-layers',
      { n: 1 },
      'Needs 1 free layer.',
      'Heeft 1 vrije laag nodig.',
    ),
    row(
      layer,
      layerM('layer-editor.bg-layers.needs-n-free-layers'),
      'layer-editor.bg-layers.needs-n-free-layers',
      { n: 3 },
      'Needs 3 free layers.',
      'Heeft 3 vrije lagen nodig.',
    ),
  ],
];

const ROWS = ONE_MANY.flat();

afterEach(() => setI18nLocale({ language: 'en-GB' }));

describe('plural messages of the editor namespaces', () => {
  for (const [lang, pick] of [
    ['en-GB', (r: Row) => r[4]],
    ['en-US', (r: Row) => r[4].replace('colour', 'color')],
    ['nl', (r: Row) => r[5]],
  ] as const) {
    it(`${lang}: every row renders its one/other form`, () => {
      setI18nLocale({ language: lang });
      for (const r of ROWS)
        expect(r[0](r[1] as never, r[3]), `${r[2]} ${JSON.stringify(r[3])}`).toBe(pick(r));
    });
  }
});

describe('no count is built by joining or picking strings', () => {
  const read = (f: string): string => readFileSync(f, 'utf8');
  const FILES: Record<string, RegExp[]> = {
    'src/anim-studio/editors/draw-host.ts': [/length === 1 \? t\(/],
    'src/anim-studio/editors/draw-svg-dialog.ts': [
      /length === 1 \? t\(/,
      /\$\{parts\} \$\{/,
      /parts === 1 \?/,
      /shapes === 1 \?/,
    ],
    'src/anim-studio/editors/parts-layers.ts': [/groups\.length > 1 \? t\(/],
    'src/path-canvas/mc-path-canvas.ts': [/anchors\.length > 1 \? t\(/],
    'src/path-canvas/geometry.ts': [/v === 1 \?/],
    'src/editor/components/icon-fx-editor.ts': [/remove-them-and/],
    'src/look-editor/slider/mc-slider-look-editor.ts': [/_countText/],
    'src/theme-editor/preset-dialog.ts': [/\bone \? t\(/],
  };
  for (const [file, patterns] of Object.entries(FILES)) {
    it(file, () => {
      const src = read(file);
      for (const p of patterns) expect(src, String(p)).not.toMatch(p);
    });
  }
});

/* Counts stated with a noun (limits, selections, announcements) are one plural message per place (icu.M1, icu.M5):
   the code passes the number, each branch is a full sentence. */
type Pair = [key: string, args: Record<string, string | number>, gb: string, nl: string];
const COUNTS: Pair[] = [
  ['svg-editor.names.combined-c-shapes', { c: 1 }, 'Combined 1 shape.', '1 vorm samengevoegd.'],
  ['svg-editor.names.combined-c-shapes', { c: 3 }, 'Combined 3 shapes.', '3 vormen samengevoegd.'],
  ['svg-editor.names.excluded-c-shapes', { c: 1 }, 'Excluded 1 shape.', '1 vorm uitgesloten.'],
  ['svg-editor.names.excluded-c-shapes', { c: 3 }, 'Excluded 3 shapes.', '3 vormen uitgesloten.'],
  ['svg-editor.names.intersected-c-shapes', { c: 1 }, 'Intersected 1 shape.', 'Doorsnede van 1 vorm gemaakt.'],
  ['svg-editor.names.intersected-c-shapes', { c: 3 }, 'Intersected 3 shapes.', 'Doorsnede van 3 vormen gemaakt.'],
  ['svg-editor.mc-svg-editor.c-shapes-selected', { c: 1 }, '1 shape selected', '1 vorm geselecteerd'],
  ['svg-editor.mc-svg-editor.c-shapes-selected', { c: 3 }, '3 shapes selected', '3 vormen geselecteerd'],
  ['svg-editor.views.c-shapes-selected', { c: 1 }, '1 shape selected', '1 vorm geselecteerd'],
  ['svg-editor.views.c-shapes-selected', { c: 3 }, '3 shapes selected', '3 vormen geselecteerd'],
  ['svg-editor.mc-svg-editor.spaced-c-shapes-evenly', { c: 1 }, 'Spaced 1 shape evenly.', '1 vorm gelijkmatig verdeeld.'],
  ['svg-editor.mc-svg-editor.spaced-c-shapes-evenly', { c: 3 }, 'Spaced 3 shapes evenly.', '3 vormen gelijkmatig verdeeld.'],
  ['svg-editor.combine.merged-c-parts-into-one-path', { c: 1 }, 'Merged 1 part into one path.', '1 deel samengevoegd tot één pad.'],
  ['svg-editor.combine.merged-c-parts-into-one-path', { c: 3 }, 'Merged 3 parts into one path.', '3 delen samengevoegd tot één pad.'],
  ['svg-editor.mc-svg-editor.this-icon-has-c-points-you-can-edit-and', { c: 1 }, 'This icon has 1 point. You can edit and move it, but not add points until it has fewer than 100.', 'Dit pictogram heeft 1 punt. Je kunt het bewerken en verplaatsen, maar pas punten toevoegen als het er minder dan 100 heeft.'],
  ['svg-editor.mc-svg-editor.this-icon-has-c-points-you-can-edit-and', { c: 120 }, 'This icon has 120 points. You can edit and move them, but not add points until it has fewer than 100.', 'Dit pictogram heeft 120 punten. Je kunt ze bewerken en verplaatsen, maar pas punten toevoegen als het er minder dan 100 heeft.'],
  ['svg-editor.mc-svg-editor.opened-name-the-first-of-count-icons-in', { name: 'Sun', count: 1 }, 'Opened Sun, the first of 1 icon in the file. The other was not used.', 'Sun is geopend, het eerste van 1 pictogram in het bestand. Het andere is niet gebruikt.'],
  ['svg-editor.mc-svg-editor.opened-name-the-first-of-count-icons-in', { name: 'Sun', count: 4 }, 'Opened Sun, the first of 4 icons in the file. The others were not used.', 'Sun is geopend, het eerste van 4 pictogrammen in het bestand. De andere zijn niet gebruikt.'],
  ['card-editor.layout-glyph.n-columns-ratio', { n: 1, ratio: '1:1' }, '1 column, 1:1', '1 kolom, 1:1'],
  ['card-editor.layout-glyph.n-columns-ratio', { n: 3, ratio: '1:1' }, '3 columns, 1:1', '3 kolommen, 1:1'],
  ['card-editor.magic-card-editor.replaced-old-with-new-the-modules-of-all', { old: 'A', new: 'B', n: 1 }, 'Replaced A with B. The modules of the only tab are kept in tab order.', 'A vervangen door B. De modules van het enige tabblad blijven in tabbladvolgorde staan.'],
  ['card-editor.magic-card-editor.replaced-old-with-new-the-modules-of-all', { old: 'A', new: 'B', n: 3 }, 'Replaced A with B. The modules of all 3 tabs are kept in tab order.', 'A vervangen door B. De modules van alle 3 tabbladen blijven in tabbladvolgorde staan.'],
  ['card-editor.yaml-editor.uses-n-of-your-animations', { n: 1 }, 'Uses 1 of your animations.', 'Gebruikt 1 van je animaties.'],
  ['card-editor.yaml-editor.uses-n-of-your-animations', { n: 3 }, 'Uses 3 of your animations.', 'Gebruikt 3 van je animaties.'],
  ['card-editor.gradient-editor.up-to-max-stops', { max: 1 }, 'Up to 1 stop', 'Tot 1 kleurpunt'],
  ['card-editor.gradient-editor.up-to-max-stops', { max: 8 }, 'Up to 8 stops', 'Tot 8 kleurpunten'],
  ['layer-editor.bg-layers-ops.limit-of-max-layers-reached-more-layers', { max: 1 }, 'Limit of 1 layer reached. More layers slow down older wall tablets. Remove it to add another.', 'Limiet van 1 laag bereikt. Meer lagen vertragen oudere wandtablets. Verwijder de laag om een andere toe te voegen.'],
  ['layer-editor.bg-layers-ops.limit-of-max-layers-reached-more-layers', { max: 6 }, 'Limit of 6 layers reached. More layers slow down older wall tablets. Remove one to add another.', 'Limiet van 6 lagen bereikt. Meer lagen vertragen oudere wandtablets. Verwijder een laag om een andere toe te voegen.'],
  ['path-canvas.mc-path-canvas.all-points-selected', { points: 1 }, 'All 1 point selected.', 'Alle 1 punt geselecteerd.'],
  ['path-canvas.mc-path-canvas.all-points-selected', { points: 4 }, 'All 4 points selected.', 'Alle 4 punten geselecteerd.'],
  ['path-canvas.mc-path-canvas.n-points-selected', { n: 1 }, '1 point selected.', '1 punt geselecteerd.'],
  ['path-canvas.mc-path-canvas.n-points-selected', { n: 3 }, '3 points selected.', '3 punten geselecteerd.'],
  ['path-canvas.mc-path-canvas.path-points-closed', { points: 1 }, 'Path, 1 point, closed.', 'Pad, 1 punt, gesloten.'],
  ['path-canvas.mc-path-canvas.path-points-closed', { points: 4 }, 'Path, 4 points, closed.', 'Pad, 4 punten, gesloten.'],
  ['path-canvas.mc-path-canvas.path-points-open', { points: 1 }, 'Path, 1 point, open.', 'Pad, 1 punt, open.'],
  ['path-canvas.mc-path-canvas.path-points-open', { points: 4 }, 'Path, 4 points, open.', 'Pad, 4 punten, open.'],
  ['path-canvas.mc-path-canvas.point-added-points', { points: 1 }, 'Point added, 1 point.', 'Punt toegevoegd, 1 punt.'],
  ['path-canvas.mc-path-canvas.point-added-points', { points: 5 }, 'Point added, 5 points.', 'Punt toegevoegd, 5 punten.'],
  ['path-canvas.mc-path-canvas.point-deleted-points', { deleted: 1, points: 3 }, 'Point deleted, 3 points.', 'Punt verwijderd, 3 punten.'],
  ['path-canvas.mc-path-canvas.point-deleted-points', { deleted: 2, points: 1 }, 'Points deleted, 1 point.', 'Punten verwijderd, 1 punt.'],
  ['path-canvas.mc-path-canvas.this-path-has-max-points-the-most-you', { max: 1 }, 'This path has 1 point, the most you can add. Move, delete or change it instead.', 'Dit pad heeft 1 punt, het maximum. Verplaats, verwijder of wijzig het in plaats daarvan.'],
  ['path-canvas.mc-path-canvas.this-path-has-max-points-the-most-you', { max: 100 }, 'This path has 100 points, the most you can add. Move, delete or change them instead.', 'Dit pad heeft 100 punten, het maximum. Verplaats, verwijder of wijzig ze in plaats daarvan.'],
  ['shape-editor.mc-shape-studio.a-shape-holds-up-to-max-points', { max: 1 }, 'A shape holds up to 1 point.', 'Een vorm kan maximaal 1 punt hebben.'],
  ['shape-editor.mc-shape-studio.a-shape-holds-up-to-max-points', { max: 64 }, 'A shape holds up to 64 points.', 'Een vorm kan maximaal 64 punten hebben.'],
  ['shape-editor.mc-shape-studio.c-of-max-points', { c: 1, max: 1 }, '1 of 1 point', '1 van 1 punt'],
  ['shape-editor.mc-shape-studio.c-of-max-points', { c: 3, max: 64 }, '3 of 64 points', '3 van 64 punten'],
  ['transfer.shape.a-shape-holds-at-most-max-points-this', { max: 1, n: 2 }, 'A shape holds at most 1 point (this one has 2).', 'Een vorm bevat maximaal 1 punt (deze heeft er 2).'],
  ['transfer.shape.a-shape-holds-at-most-max-points-this', { max: 64, n: 70 }, 'A shape holds at most 64 points (this one has 70).', 'Een vorm bevat maximaal 64 punten (deze heeft er 70).'],
  ['transfer.envelope.the-author-must-be-1-max-characters-so', { max: 1 }, 'The author must be 1 character, so it was left out.', 'De auteur moet 1 teken lang zijn, dus is weggelaten.'],
  ['transfer.envelope.the-author-must-be-1-max-characters-so', { max: 80 }, 'The author must be 1-80 characters, so it was left out.', 'De auteur moet 1-80 tekens lang zijn, dus is weggelaten.'],
  ['transfer.envelope.the-description-must-be-1-max-characters', { max: 1 }, 'The description must be 1 character, so it was left out.', 'De beschrijving moet 1 teken lang zijn, dus is weggelaten.'],
  ['transfer.envelope.the-description-must-be-1-max-characters', { max: 400 }, 'The description must be 1-400 characters, so it was left out.', 'De beschrijving moet 1-400 tekens lang zijn, dus is weggelaten.'],
  ['transfer.envelope.this-file-holds-more-than-max-items-so', { max: 1 }, 'This file holds more than 1 item, so it was not read.', 'Dit bestand bevat meer dan 1 item, dus het is niet gelezen.'],
  ['transfer.envelope.this-file-holds-more-than-max-items-so', { max: 200 }, 'This file holds more than 200 items, so it was not read.', 'Dit bestand bevat meer dan 200 items, dus het is niet gelezen.'],
  ['transfer.theme.the-value-of-key-is-longer-than-max', { key: '--a', max: 1 }, 'The value of "--a" is longer than 1 character, so it was left out.', 'De waarde van "--a" is langer dan 1 teken, dus is weggelaten.'],
  ['transfer.theme.the-value-of-key-is-longer-than-max', { key: '--a', max: 500 }, 'The value of "--a" is longer than 500 characters, so it was left out.', 'De waarde van "--a" is langer dan 500 tekens, dus is weggelaten.'],
  ['image-transfer.reader.only-the-first-max-connections-were-kept', { max: 1 }, 'Only the first 1 connection was kept.', 'Alleen de eerste 1 koppeling is bewaard.'],
  ['image-transfer.reader.only-the-first-max-connections-were-kept', { max: 40 }, 'Only the first 40 connections were kept.', 'Alleen de eerste 40 koppelingen zijn bewaard.'],
  ['theme-editor.model.this-value-is-longer-than-max-characters', { max: 1 }, 'This value is longer than 1 character.', 'Deze waarde is langer dan 1 teken.'],
  ['theme-editor.model.this-value-is-longer-than-max-characters', { max: 500 }, 'This value is longer than 500 characters.', 'Deze waarde is langer dan 500 tekens.'],
  ['theme-editor.preview.preview-of-count-sample-cards-dark', { count: 1 }, 'Preview of 1 sample card using the dark variables. The sample is not interactive.', 'Voorbeeld van 1 voorbeeldkaart met de donkere variabelen. Het voorbeeld is niet interactief.'],
  ['theme-editor.preview.preview-of-count-sample-cards-dark', { count: 3 }, 'Preview of 3 sample cards using the dark variables. The samples are not interactive.', 'Voorbeeld van 3 voorbeeldkaarten met de donkere variabelen. De voorbeelden zijn niet interactief.'],
  ['theme-editor.preview.preview-of-count-sample-cards-light', { count: 1 }, 'Preview of 1 sample card using the light variables. The sample is not interactive.', 'Voorbeeld van 1 voorbeeldkaart met de lichte variabelen. Het voorbeeld is niet interactief.'],
  ['theme-editor.preview.preview-of-count-sample-cards-light', { count: 3 }, 'Preview of 3 sample cards using the light variables. The samples are not interactive.', 'Voorbeeld van 3 voorbeeldkaarten met de lichte variabelen. De voorbeelden zijn niet interactief.'],
  ['look-editor.mc-slider-look-editor.n-stops-is-the-most', { n: 1 }, '1 stop is the most.', 'Meer dan 1 stop kan niet.'],
  ['look-editor.mc-slider-look-editor.n-stops-is-the-most', { n: 8 }, '8 stops are the most.', 'Meer dan 8 stops kan niet.'],
  ['look-editor.mc-slider-look-editor.n-characters-of-each-label-show-on-the', { n: 1 }, '1 character of each label shows on the card. Screen readers get the full label.', '1 teken van elk label staat op de kaart. Schermlezers krijgen het volledige label.'],
  ['look-editor.mc-slider-look-editor.n-characters-of-each-label-show-on-the', { n: 5 }, '5 characters of each label show on the card. Screen readers get the full label.', '5 tekens van elk label staan op de kaart. Schermlezers krijgen het volledige label.'],
  ['anim-studio.parts-layers.grouped-count-parts', { count: 1 }, 'Grouped 1 part', '1 onderdeel gegroepeerd'],
  ['anim-studio.parts-layers.grouped-count-parts', { count: 3 }, 'Grouped 3 parts', '3 onderdelen gegroepeerd'],
  ['anim-studio.parts-layers.replace-count-parts', { count: 1 }, 'Replace 1 part', '1 onderdeel vervangen'],
  ['anim-studio.parts-layers.replace-count-parts', { count: 3 }, 'Replace 3 parts', '3 onderdelen vervangen'],
  ['anim-studio.parts-layers.split-into-count-parts', { count: 1 }, 'Split into 1 part', 'Gesplitst in 1 onderdeel'],
  ['anim-studio.parts-layers.split-into-count-parts', { count: 3 }, 'Split into 3 parts', 'Gesplitst in 3 onderdelen'],
  ['anim-studio.parts-layers.split-into-count', { count: 1 }, 'Split into 1 part', 'Splitsen in 1 onderdeel'],
  ['anim-studio.parts-layers.split-into-count', { count: 3 }, 'Split into 3 parts', 'Splitsen in 3 onderdelen'],
  ['anim-studio.part-inspector.group-of-count', { count: 1 }, 'Group of 1 part', 'Groep van 1 onderdeel'],
  ['anim-studio.part-inspector.group-of-count', { count: 3 }, 'Group of 3 parts', 'Groep van 3 onderdelen'],
  ['anim-studio.parts-layers.the-icon-has-count-shapes-the-first', { count: 9, parts: 1 }, 'The icon has 9 shapes: the first 1 became a part (the most a rig holds), the rest stay at rest.', 'Het pictogram heeft 9 vormen: de eerste 1 werd een onderdeel (het meeste wat een rig aankan), de rest blijft in rust.'],
  ['anim-studio.parts-layers.the-icon-has-count-shapes-the-first', { count: 90, parts: 64 }, 'The icon has 90 shapes: the first 64 became parts (the most a rig holds), the rest stay at rest.', 'Het pictogram heeft 90 vormen: de eerste 64 werden onderdelen (het meeste wat een rig aankan), de rest blijft in rust.'],
  ['anim-studio.studio.count-targets', { count: 1 }, '1 target', '1 doel'],
  ['anim-studio.studio.count-targets', { count: 3 }, '3 targets', '3 doelen'],
  ['anim-studio.draw-host.at-most-count-shapes-fit-in-a-rig', { count: 1 }, 'At most 1 shape fits in a rig.', 'Hooguit 1 vorm past in een rig.'],
  ['anim-studio.draw-host.at-most-count-shapes-fit-in-a-rig', { count: 64 }, 'At most 64 shapes fit in a rig.', 'Hooguit 64 vormen passen in een rig.'],
  ['anim-studio.draw-svg-dialog.at-most-shapes-shapes-fit-in-a-rig', { shapes: 1 }, 'At most 1 shape fits in a rig.', 'Hooguit 1 vorm past in een rig.'],
  ['anim-studio.draw-svg-dialog.at-most-shapes-shapes-fit-in-a-rig', { shapes: 64 }, 'At most 64 shapes fit in a rig.', 'Hooguit 64 vormen passen in een rig.'],
  ['anim-studio.draw-host.at-most-tracks-animated-targets', { tracks: 1 }, 'At most 1 animated target.', 'Hooguit 1 geanimeerd doel.'],
  ['anim-studio.draw-host.at-most-tracks-animated-targets', { tracks: 40 }, 'At most 40 animated targets.', 'Hooguit 40 geanimeerde doelen.'],
  ['anim-studio.sequence-editor.at-most-steps-steps', { steps: 1 }, 'At most 1 step', 'Hooguit 1 stap'],
  ['anim-studio.sequence-editor.at-most-steps-steps', { steps: 32 }, 'At most 32 steps', 'Hooguit 32 stappen'],
  ['anim-studio.sequence-editor.a-sequence-has-at-most-steps-steps', { steps: 1 }, 'A sequence has at most 1 step.', 'Een reeks heeft hooguit 1 stap.'],
  ['anim-studio.sequence-editor.a-sequence-has-at-most-steps-steps', { steps: 32 }, 'A sequence has at most 32 steps.', 'Een reeks heeft hooguit 32 stappen.'],
  ['anim-studio.particles-editor.at-most-colours-colours', { colours: 1 }, 'At most 1 colour', 'Hooguit 1 kleur'],
  ['anim-studio.particles-editor.at-most-colours-colours', { colours: 6 }, 'At most 6 colours', 'Hooguit 6 kleuren'],
  ['anim-studio.particles-editor.at-most-emitters-emitters', { emitters: 1 }, 'At most 1 emitter.', 'Hooguit 1 emitter.'],
  ['anim-studio.particles-editor.at-most-emitters-emitters', { emitters: 4 }, 'At most 4 emitters.', 'Hooguit 4 emitters.'],
  ['anim-studio.particles-editor.at-most-max-shapes-shapes', { mAX_SHAPES: 1 }, 'At most 1 shape', 'Hooguit 1 vorm'],
  ['anim-studio.particles-editor.at-most-max-shapes-shapes', { mAX_SHAPES: 8 }, 'At most 8 shapes', 'Hooguit 8 vormen'],
  ['anim-studio.bindings-panel.at-most-max-bindings-per-animation', { max: 1 }, 'At most 1 binding per animation.', 'Hooguit 1 koppeling per animatie.'],
  ['anim-studio.bindings-panel.at-most-max-bindings-per-animation', { max: 8 }, 'At most 8 bindings per animation.', 'Hooguit 8 koppelingen per animatie.'],
  ['anim-studio.parts-model.a-rig-has-at-most-groups-groups', { groups: 1 }, 'A rig has at most 1 group.', 'Een rig heeft hooguit 1 groep.'],
  ['anim-studio.parts-model.a-rig-has-at-most-groups-groups', { groups: 32 }, 'A rig has at most 32 groups.', 'Een rig heeft hooguit 32 groepen.'],
  ['anim-studio.parts-model.this-animation-has-tracks-animated', { tracks: 1 }, 'This animation has 1 animated target, the most it can hold. Remove it to animate this part.', 'Deze animatie heeft 1 geanimeerd doel, het maximum. Verwijder het om dit onderdeel te animeren.'],
  ['anim-studio.parts-model.this-animation-has-tracks-animated', { tracks: 40 }, 'This animation has 40 animated targets, the most it can hold. Remove one to animate this part.', 'Deze animatie heeft 40 geanimeerde doelen, het maximum. Verwijder er een om dit onderdeel te animeren.'],
  ['anim-studio.states-panel.at-most-clips-max-states', { cLIPS_MAX: 1 }, 'At most 1 state.', 'Hooguit 1 status.'],
  ['anim-studio.states-panel.at-most-clips-max-states', { cLIPS_MAX: 12 }, 'At most 12 states.', 'Hooguit 12 statussen.'],
  ['anim-studio.validation-text.at-most-max-animations', { max: 1 }, 'At most 1 animation.', 'Hooguit 1 animatie.'],
  ['anim-studio.validation-text.at-most-max-animations', { max: 50 }, 'At most 50 animations.', 'Hooguit 50 animaties.'],
  ['anim-studio.validation-text.at-most-max-characters', { max: 1 }, 'At most 1 character.', 'Hooguit 1 teken.'],
  ['anim-studio.validation-text.at-most-max-characters', { max: 40 }, 'At most 40 characters.', 'Hooguit 40 tekens.'],
  ['anim-studio.validation-text.at-most-max-entries', { max: 1 }, 'At most 1 entry.', 'Hooguit 1 item.'],
  ['anim-studio.validation-text.at-most-max-entries', { max: 20 }, 'At most 20 entries.', 'Hooguit 20 items.'],
  ['anim-studio.validation-text.at-most-max-particles-over-all-emitters', { max: 1 }, 'At most 1 particle over all emitters.', 'Hooguit 1 deeltje over alle emitters.'],
  ['anim-studio.validation-text.at-most-max-particles-over-all-emitters', { max: 500 }, 'At most 500 particles over all emitters.', 'Hooguit 500 deeltjes over alle emitters.'],
  ['anim-studio.validation-text.the-svg-has-too-many-shapes-at-most-room', { room: 1 }, 'The SVG has too many shapes; at most 1 fits.', 'De SVG heeft te veel vormen; er past er maximaal 1.'],
  ['anim-studio.validation-text.the-svg-has-too-many-shapes-at-most-room', { room: 9 }, 'The SVG has too many shapes; at most 9 fit.', 'De SVG heeft te veel vormen; er passen er maximaal 9.'],
  ['anim-studio.studio-model.the-library-holds-at-most-cap-animations', { cap: 1, fit: 1, skipped: 1 }, 'The library holds at most 1 animation: only 1 more fits, 1 was not imported.', 'De bibliotheek bevat hooguit 1 animatie: er past nog maar 1, 1 is niet geïmporteerd.'],
  ['anim-studio.studio-model.the-library-holds-at-most-cap-animations', { cap: 200, fit: 2, skipped: 3 }, 'The library holds at most 200 animations: only 2 more fit, 3 were not imported.', 'De bibliotheek bevat hooguit 200 animaties: er passen nog maar 2, 3 zijn niet geïmporteerd.'],
  ['anim-studio.studio-model.the-library-is-full-cap-animations', { cap: 1 }, 'The library is full (1 animation): nothing was imported.', 'De bibliotheek is vol (1 animatie): er is niets geïmporteerd.'],
  ['anim-studio.studio-model.the-library-is-full-cap-animations', { cap: 200 }, 'The library is full (200 animations): nothing was imported.', 'De bibliotheek is vol (200 animaties): er is niets geïmporteerd.'],
  ['anim-studio.draw-host.name-added-count-points', { name: 'Star', count: 1 }, 'Star added, 1 point.', 'Star toegevoegd, 1 punt.'],
  ['anim-studio.draw-host.name-added-count-points', { name: 'Star', count: 5 }, 'Star added, 5 points.', 'Star toegevoegd, 5 punten.'],
  ['anim-studio.particles-editor.particles-particles-emitters-emitters', { particles: 1, emitters: 1 }, '1 particle · 1 emitter', '1 deeltje · 1 emitter'],
  ['anim-studio.particles-editor.particles-particles-emitters-emitters', { particles: 40, emitters: 3 }, '40 particles · 3 emitters', '40 deeltjes · 3 emitters'],
  ['transfer.panel.export-animations', { n: 1 }, 'Export 1 animation', '1 animatie exporteren'],
  ['transfer.panel.export-animations', { n: 3 }, 'Export 3 animations', '3 animaties exporteren'],
  ['transfer.panel.export-themes', { n: 1 }, 'Export 1 theme', '1 thema exporteren'],
  ['transfer.panel.export-themes', { n: 3 }, 'Export 3 themes', "3 thema's exporteren"],
  ['transfer.panel.export-shapes', { n: 3 }, 'Export 3 shapes', '3 vormen exporteren'],
  ['transfer.panel.export-images', { n: 3 }, 'Export 3 images', '3 afbeeldingen exporteren'],
  ['transfer.panel.export-icons', { n: 1 }, 'Export 1 icon', '1 pictogram exporteren'],
  ['transfer.panel.import-animations', { n: 3 }, 'Import 3 animations', '3 animaties importeren'],
  ['transfer.panel.import-themes', { n: 3 }, 'Import 3 themes', "3 thema's importeren"],
  ['transfer.panel.import-shapes', { n: 1 }, 'Import 1 shape', '1 vorm importeren'],
  ['transfer.panel.import-images', { n: 3 }, 'Import 3 images', '3 afbeeldingen importeren'],
  ['transfer.panel.import-icons', { n: 3 }, 'Import 3 icons', '3 pictogrammen importeren'],
  ['transfer.panel.source-holds-animations', { source: 'a.yaml', n: 1 }, 'a.yaml holds 1 animation.', 'a.yaml bevat 1 animatie.'],
  ['transfer.panel.source-holds-animations', { source: 'a.yaml', n: 3 }, 'a.yaml holds 3 animations.', 'a.yaml bevat 3 animaties.'],
  ['transfer.panel.source-holds-themes', { source: 'a.yaml', n: 3 }, 'a.yaml holds 3 themes.', "a.yaml bevat 3 thema's."],
  ['transfer.panel.source-holds-shapes', { source: 'a.yaml', n: 3 }, 'a.yaml holds 3 shapes.', 'a.yaml bevat 3 vormen.'],
  ['transfer.panel.source-holds-images', { source: 'a.yaml', n: 1 }, 'a.yaml holds 1 image.', 'a.yaml bevat 1 afbeelding.'],
  ['transfer.panel.source-holds-icons', { source: 'a.yaml', n: 3 }, 'a.yaml holds 3 icons.', 'a.yaml bevat 3 pictogrammen.'],
];

describe('count messages with a noun: plural per place', () => {
  for (const [lang, pick] of [
    ['en-GB', (p: Pair) => p[2]],
    ['en-US', (p: Pair) => p[2].replace('colour', 'color')],
    ['nl', (p: Pair) => p[3]],
  ] as const) {
    it(`${lang}: one and many`, () => {
      setI18nLocale({ language: lang });
      for (const p of COUNTS) expect(msg(p[0], p[1]), `${p[0]} ${JSON.stringify(p[1])}`).toBe(pick(p));
    });
  }
});

describe('no count phrase is formatted by another message', () => {
  const src = (f: string): string => readFileSync(f, 'utf8');
  it('path-canvas passes numbers, not a points phrase', () => {
    expect(src('src/path-canvas/mc-path-canvas.ts')).not.toMatch(/pointsWord/);
    expect(src('src/path-canvas/geometry.ts')).not.toMatch(/pointsWord/);
  });
  it('the animation list shows the preset name, never its message index', () => {
    expect(src('src/editor/components/animation-list.ts')).not.toContain('p?.name ?? a.preset');
  });
});
