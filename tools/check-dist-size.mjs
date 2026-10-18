// Fails when a built dist/*.js grows past its budget, or when an unlisted .js file appears.
// Budgets, set by the CEO on 2026-10-17 (sizes then in comments):
// - magic-card.js, which every dashboard loads: B1 + 8,192 B (B1 = 679,875 B, the 2026.10.04 baseline).
// - lazy chunks: the 2026.10.07 size + 5 %, rounded up to 1 KiB.
// Raise a budget only on purpose, in the same PR. A new chunk gets the same +5 % rule.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const B1 = 679_875;
const CAPS = {
  'magic-card.js': B1 + 8_192, // 683,958
  'magic-card-animation-studio.js': 902_144, // 858,558
  'magic-card-editor.js': 680_960, // 647,655
  'magic-card-icon-animator.js': 233_472, // 222,240
  'magic-card-icon-library.js': 180_224, // 171,507
  'magic-card-particles.js': 34_816, // 33,080
  'magic-card-preset-catalogue.js': 24_576, // 22,797
  'magic-card-theme-editor.js': 172_032, // 163,837
  'magic-card-theme-presets.js': 21_504, // 19,878
  // shape: custom builder (T2, ADR 0021): 2,873 B measured + 5 %, rounded up to 1 KiB; hard ceiling 5,120 B (more means shape-path.ts was copied in)
  'magic-card-shape-custom.js': 3_072, // 2,873
  'magic-card-anim-runtime.js': 40_960, // 38,672
  // path canvas for the SVG and shape editors (T4): 47,935 B measured + 5 %. The architect's ceiling was 40 KiB;
  // draw.ts (6.2 KB) is in this chunk by contract and is the main reason it is over. The chunk is only emitted
  // once an editor chunk imports src/path-canvas/loader.ts; until then this entry reports "missing from dist".
  'magic-card-path-canvas.js': 45_056, // 44 KiB by CEO decision (ADR 0019); measured below
  // SVG editor (T10): the architect's ceiling of 96 KiB, ADR 0019. Like the canvas chunk it is only emitted once the card-editor
  // chunk imports src/svg-editor/loader.ts (T11); until then this entry reports "missing from dist".
  'magic-card-svg-editor.js': 112_640, // 110 KiB, CEO 2026-10-18 (measured 106,748 + 5%)
  // shape editor (T7): the architect's ceiling of 48 KiB, ADR 0019. OVER the ceiling with the whole design scope
  // (about 64 KB, see 20-frontend-engineer-t7.md): the CEO rules on the number. Emitted once the card-editor
  // chunk imports src/shape-editor/loader.ts (T8); until then this entry reports "missing from dist".
  'magic-card-shape-editor.js': 69_632, // 68 KiB, CEO 2026-10-18 (measured 64,435 + 5%)
  // epic D lazy chunks (D1 stubs, empty install): placeholder caps; D6 sets measured + 5 %, rounded up to 1 KiB, under the ceilings in src/contracts/lazy-module.ts
  'magic-card-slider.js': 97_280, // 95 KiB (D4, measured 92,085 + 5 %); ceiling 120 KiB
  'magic-card-seasonal.js': 58_368, // 57 KiB (D5, measured 55,023 + 5 %); ceiling 80 KiB
  'magic-card-markdown.js': 55_296, // 54 KiB (D2, measured 52,185 + 5 %); above the 52 KiB sanity ceiling by the rounding only
  'magic-card-modules-extra.js': 24_576, // 24 KiB (D3, measured 23,139 + 5 %); ceiling 44 KiB
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
