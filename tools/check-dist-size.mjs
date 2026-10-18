// Fails when a built dist/*.js grows past its budget, or when an unlisted .js file appears.
// Budgets, set by the CEO on 2026-10-17 (sizes then in comments):
// - magic-card.js, which every dashboard loads: B2 + 8,192 B. B2 = 471,856 B, the magic-card.js measured on 2026-10-18 after
//   epic D (swiper, marked, the seasonal decorations and six rare modules moved into lazy chunks); CEO decision 2026-10-18.
//   B1 = 679,875 B was the 2026.10.04 baseline.
// - lazy chunks: the 2026.10.07 size + 5 %, rounded up to 1 KiB.
// I11 (2026-10-18) ratcheted every lazy-chunk cap to the measured size of a clean git archive build + 5 %, never above the cap it had.
// Raise a budget only on purpose, in the same PR. A new chunk gets the same +5 % rule.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const B2 = 471_856;
const CAPS = {
  'magic-card.js': B2 + 8_192, // 480,048
  'magic-card-animation-studio.js': 995_328, // 972 KiB, held at the CEO-approved cap: measured 995,262 + 5 % would round to 1,045,504, which is higher (I11)
  'magic-card-editor.js': 805_888, // 787 KiB, held at the CEO-approved cap: measured 790,605 + 5 % would round to 830,464, which is higher (I11)
  'magic-card-icon-animator.js': 231_424, // 226 KiB, measured 219,499 + 5 %, rounded up to 1 KiB (I11); was 233,472
  'magic-card-icon-library.js': 175_104, // 171 KiB, measured 166,118 + 5 %, rounded up to 1 KiB (I11); was 188,416
  'magic-card-particles.js': 38_912, // 38 KiB, held at the CEO-approved cap: measured 37,422 + 5 % would round to 39,936, which is higher (I11)
  'magic-card-preset-catalogue.js': 26_624, // 26 KiB, measured 24,406 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-theme-editor.js': 277_504, // 271 KiB, measured 263,917 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-theme-presets.js': 31_744, // 31 KiB, measured 29,584 + 5 %, rounded up to 1 KiB (I11)
  // shape: custom builder (T2, ADR 0021): 2,873 B measured + 5 %, rounded up to 1 KiB; hard ceiling 5,120 B (more means shape-path.ts was copied in)
  'magic-card-shape-custom.js': 3_072, // 3 KiB, measured 2,873 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-anim-runtime.js': 40_960, // 40 KiB, measured 38,670 + 5 %, rounded up to 1 KiB (I11)
  // path canvas for the SVG and shape editors (T4): 47,935 B measured + 5 %. The architect's ceiling was 40 KiB;
  // draw.ts (6.2 KB) is in this chunk by contract and is the main reason it is over. The chunk is only emitted
  // once an editor chunk imports src/path-canvas/loader.ts; until then this entry reports "missing from dist".
  'magic-card-path-canvas.js': 67_584, // 66 KiB, measured 63,552 + 5 %, rounded up to 1 KiB (I11); was 68,608
  // SVG editor (T10): the architect's ceiling of 96 KiB, ADR 0019. Like the canvas chunk it is only emitted once the card-editor
  // chunk imports src/svg-editor/loader.ts (T11); until then this entry reports "missing from dist".
  'magic-card-svg-editor.js': 158_720, // 155 KiB, held at the CEO-approved cap: measured 152,791 + 5 % would round to 160,768, which is higher (I11)
  // shape editor (T7): the architect's ceiling of 48 KiB, ADR 0019. OVER the ceiling with the whole design scope
  // (about 64 KB, see 20-frontend-engineer-t7.md): the CEO rules on the number. Emitted once the card-editor
  // chunk imports src/shape-editor/loader.ts (T8); until then this entry reports "missing from dist".
  'magic-card-shape-editor.js': 101_376, // 99 KiB, held at the CEO-approved cap: measured 99,967 + 5 % would round to 105,472, which is higher (I11)
  // epic D lazy chunks (D1 stubs, empty install): placeholder caps; D6 sets measured + 5 %, rounded up to 1 KiB, under the ceilings in src/contracts/lazy-module.ts
  'magic-card-slider.js': 97_280, // 95 KiB, measured 92,092 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-seasonal.js': 58_368, // 57 KiB, measured 55,031 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-markdown.js': 55_296, // 54 KiB, measured 52,191 + 5 %, rounded up to 1 KiB (I11)
  // preset transfer (T16, ADR 0022): codec + validators 17.2 KB, <mc-transfer-panel> 8.9 KB, <mc-library-view> 11 KB. OVER the CEO ceiling of 28,672 B (TRANSFER_CHUNK_CEILING): measured + 5 %, rounded up to 1 KiB, pending the CEO ruling (js-yaml, sanitizeSvg, model.ts and the validators are NOT in it, see 33-frontend-engineer-t16.md)
  'magic-card-transfer.js': 59_392, // 58 KiB, measured 56,455 + 5 %, rounded up to 1 KiB (I11)
  'magic-card-modules-extra.js': 24_576, // 24 KiB, measured 23,013 + 5 %, rounded up to 1 KiB (I11)
  // path booleans (T23, ADR 0025): 7,884 B measured + 5 %, rounded up to 1 KiB; ceiling 16,384 B (PATH_BOOLEANS_CEILING_BYTES). Only emitted once an editor chunk imports src/path-booleans/loader.ts (T25/T27); until then this entry reports "missing from dist".
  'magic-card-svg-booleans.js': 8_192, // 8 KiB, measured 7,723 + 5 %, rounded up to 1 KiB (I11); was 9,216
  // path tools (T37, ADR 0027): 17,784 B measured (production build under a parent that holds lit; webpack stats list only src/path-tools/* and the contract, no lit, core.ts or booleans code) + 5 %, rounded up to 1 KiB; ceiling 20,480 B (PATH_TOOLS_CEILING_BYTES). Only emitted once the SVG editor chunk imports src/path-tools/loader.ts (T38); until then this entry reports "missing from dist".
  'magic-card-path-tools.js': 20_480, // 20 KiB, measured 19,447 + 5 %, rounded up to 1 KiB (I11); was 22,528
  // i18n table chunks (contract i18n 1.0.0 r3, Handoff 108): the lazy tables of namespace 'labels' (editor and studio, editor-only labels that magic-card.js carries as numbers) and of 'icon-library' (the icon library and icon animator chunks). Caps are measured + 5 %, rounded up to 1 KiB (ratcheted in I11).
  'magic-card-i18n-labels.js': 22_528, // 22 KiB, measured 21,416 + 5 %, rounded up to 1 KiB (I11); was 26,624
  'magic-card-i18n-icons.js': 17_408, // 17 KiB, measured 16,482 + 5 %, rounded up to 1 KiB (I11); was 23,552
};

const dir = fileURLToPath(new URL('../dist/', import.meta.url));
const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
let failed = false;

for (const f of files) {
  const size = statSync(join(dir, f)).size;
  const cap = CAPS[f];
  if (cap === undefined) {
    console.error(`FAIL ${f}: ${size} B, new file with no size cap. Add an entry for it to CAPS in tools/check-dist-size.mjs (its production size + 5 %, rounded up to 1 KiB) in the same PR`);
    failed = true;
  } else if (size > cap) {
    console.error(`FAIL ${f}: ${size} B > cap ${cap} B (+${size - cap} B)`);
    failed = true;
  } else {
    console.log(`ok   ${f}: ${size} B <= ${cap} B (headroom ${cap - size} B)`);
  }
}
for (const f of Object.keys(CAPS)) {
  if (!files.includes(f)) {
    console.error(`FAIL ${f}: missing from dist/`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
