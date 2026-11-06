// Contrast check of the flow and slider looks. Node only, no browser.
// Usage: node tools/check-look-contrast.mjs [--verbose]
//
// Checks, against four card surfaces (#ffffff and #f2f2f2 = light, #111111 and #1c1c1c = dark):
//  1. Theme-derived parts (FLOW_LOOK_THEME, the slider css opacities): text colour at its opacity, composited on the
//     surface, must reach 3:1 (non-text, WCAG 1.4.11). The neon core on a light card is the line colour plus a black
//     overlay, checked for every flow preset colour.
//  2. Every flow preset (src/look-editor/presets.ts) and every slider preset (src/look-editor/slider/presets.ts) with
//     its own colours: line colours 3:1 on the dark surfaces, slider handle face, ring and icon through
//     thumbColours(), text on a fill 4.5:1.
//  3. Text parts: the in-track value chip (surface colour on text colour) and big-fill text on the worst fill
//     sample, 4.5:1.
// A preset accent colour (yellow, orange, cyan) is made for dark cards; on a light card the renderers lift it (flows:
// src/flow-look/light-lift.ts, sliders: lift() and a black shade over the theme primary in src/slider-look/view.ts) and
// the lifted colour is judged here. Everything below 3:1 on any of the four surfaces is a FAIL. Exit code 1 when any "FAIL" line is printed.
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('./ui-kit-ts-hooks.mjs', import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => import(pathToFileURL(path.join(ROOT, p)).href);
const { FLOW_PRESETS } = await load('src/look-editor/presets.ts');
const { SLIDER_PRESETS } = await load('src/look-editor/slider/presets.ts');
const { FLOW_LOOK_THEME } = await load('src/contracts/flow-look.ts');
const { parseColour, ratio, lift, readableOn, thumbColours, LIGHT_CARD, PRIMARY_SHADE } = await load('src/slider-look/colour.ts');
const { liftColour } = await load('src/flow-look/light-lift.ts');

const verbose = process.argv.includes('--verbose');
const SURFACES = [
  { name: '#ffffff', rgb: [255, 255, 255], dark: false },
  { name: '#f2f2f2', rgb: [242, 242, 242], dark: false },
  { name: '#111111', rgb: [17, 17, 17], dark: true },
  { name: '#1c1c1c', rgb: [28, 28, 28], dark: true },
];
// Home Assistant's default text colours.
const TEXT = { light: [33, 33, 33], dark: [225, 225, 225] };
const PRIMARY = [3, 169, 244]; // HA default primary (the slider fill with no slider_color)

const over = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const textOn = (s) => (s.dark ? TEXT.dark : TEXT.light);

let fails = 0;
let notes = 0;
let checks = 0;
function check(label, value, min, level = 'FAIL') {
  checks++;
  const ok = value >= min;
  if (!ok) {
    if (level === 'FAIL') fails++;
    else notes++;
  }
  if (!ok || verbose) console.log(`${ok ? 'ok  ' : level} ${label}: ${value.toFixed(2)}:1 (needs ${min}:1)`);
}

// 1. Theme-derived parts -------------------------------------------------------------------------------------------
const themeParts = { 'tube wall and level mark': FLOW_LOOK_THEME.tubeWall, 'cable outline': FLOW_LOOK_THEME.cableOutline };
for (const s of SURFACES) {
  for (const [name, p] of Object.entries(themeParts)) {
    check(`${name} on ${s.name}`, ratio(over(textOn(s), s.rgb, p.opacity), s.rgb), 3);
  }
  // Slider: outline of standard / thin / pill / segmented / glass, ticks and the glass border are the text colour at .55.
  check(`slider outline, ticks and glass border on ${s.name}`, ratio(over(textOn(s), s.rgb, 0.55), s.rgb), 3);
  // The failed-call text chip (.mc-sl-m): white on #b3261e, on any card.
  check(`failed-call text (white on #b3261e) on ${s.name}`, ratio([255, 255, 255], [179, 38, 30]), 4.5);
  // Value chip: surface colour on the text colour, and its text.
  check(`value chip text on ${s.name}`, ratio(s.rgb, textOn(s)), 4.5);
  if (s.dark) check(`neon core (white ${FLOW_LOOK_THEME.neonCoreDark.opacity}) on ${s.name}`, ratio(over([255, 255, 255], s.rgb, FLOW_LOOK_THEME.neonCoreDark.opacity), s.rgb), 3);
}

// Neon core on a light card: the line colour with a black overlay at .45, for every colour a preset or a default uses.
const flowColours = (v) => [v.color, v.color_to, v.shape_color].filter((c) => typeof c === 'string' && parseColour(c));
const allFlowColours = new Set();
for (const p of FLOW_PRESETS) for (const c of flowColours(p.values)) allFlowColours.add(c);
for (const s of SURFACES.filter((x) => !x.dark)) {
  for (const c of allFlowColours) {
    const line = parseColour(liftColour(c));
    const core = over([0, 0, 0], line, FLOW_LOOK_THEME.neonCoreLightShade.opacity);
    check(`neon core (${c} + black ${FLOW_LOOK_THEME.neonCoreLightShade.opacity}) on ${s.name}`, ratio(core, s.rgb), 3);
  }
}

// 2. Flow presets ---------------------------------------------------------------------------------------------------
// On a light card the renderer lifts line and gradient-end colours (src/flow-look/light-lift.ts); shape colours keep
// their own card-coloured outline and are judged on the dark surfaces only. Every light line below 3:1 is a FAIL.
for (const p of FLOW_PRESETS) {
  const v = p.values;
  for (const c of flowColours(v)) {
    const rgb = parseColour(c);
    const line = c === v.shape_color && c !== v.color && c !== v.color_to ? undefined : parseColour(liftColour(c));
    for (const s of SURFACES) {
      if (s.dark) check(`flow preset ${p.id}: ${c} on ${s.name}`, ratio(rgb, s.rgb), 3);
      else if (line) check(`flow preset ${p.id}: ${c} lifted on ${s.name}`, ratio(line, s.rgb), 3);
    }
  }
}

// 3. Slider presets ---------------------------------------------------------------------------------------------------
for (const p of [{ id: '(default)', values: {} }, ...SLIDER_PRESETS]) {
  const own = parseColour(p.values.slider_color);
  const fill = own ?? PRIMARY;
  // the light-card fill the view draws: a readable colour lifted to 3:1 on #f2f2f2, the theme primary under a black shade
  const lightFill = own ? lift(own, LIGHT_CARD, 3) : over([0, 0, 0], PRIMARY, PRIMARY_SHADE);
  const trackStyle = p.values.track_style;
  for (const s of SURFACES) {
    const surface = s.rgb;
    // Handle: face 3:1 on the fill, ring 3:1 on the surface, icon 4.5:1 on the face.
    if (p.values.thumb !== 'none' && p.values.thumb !== 'line') {
      const t = thumbColours(lift(fill, surface, 3), surface);
      check(`slider preset ${p.id}: handle face on fill, ${s.name}`, ratio(t.face, lift(fill, surface, 3)), 3);
      check(`slider preset ${p.id}: handle ring on ${s.name}`, ratio(t.ring, surface), 3);
      check(`slider preset ${p.id}: handle icon on face, ${s.name}`, ratio(t.icon, t.face), 4.5);
    }
    // Fill extent: 3:1 on every surface (the view lifts it on a light card).
    check(`slider preset ${p.id}: fill ${p.values.slider_color ?? 'primary'} on ${s.name}`, ratio(s.dark ? fill : lightFill, surface), 3);
  }
  // Text on the big fill: white or black, 4.5:1 on the worst sample (solid, brightness ramp dark end, kelvin ends).
  if (trackStyle === 'big-fill') {
    const dark = fill.map((c) => Math.round(c * 0.25));
    for (const sample of [fill, dark, [0xff, 0xa9, 0x4d], [0xbf, 0xe0, 0xff]]) {
      check(`big fill text on sample rgb(${sample.join(',')})`, ratio(readableOn(sample), sample), 4.5);
    }
  }
}

console.log(`\ncheck-look-contrast: ${checks} checks on ${SURFACES.map((s) => s.name).join(', ')} | ${fails} FAIL, ${notes} note${notes === 1 ? '' : 's'}`);
process.exit(fails ? 1 : 0);
