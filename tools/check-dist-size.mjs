// Fails when a built dist/*.js grows past its budget, or when an unlisted .js file appears.
// Budgets, set by the CEO on 2026-10-17 (sizes then in comments):
// - magic-card.js, which every dashboard loads: B2 + 8,192 B. B2 = 471,856 B, the magic-card.js measured on 2026-10-18 after
//   epic D (swiper, marked, the seasonal decorations and six rare modules moved into lazy chunks); CEO decision 2026-10-18.
//   B1 = 679,875 B was the 2026.10.04 baseline.
// - lazy chunks: the 2026.10.07 size + 5 %, rounded up to 1 KiB.
// Raise a budget only on purpose, in the same PR. A new chunk gets the same +5 % rule.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const B2 = 471_856;
const CAPS = {
  'magic-card.js': B2 + 8_192, // 480,048
  'magic-card-animation-studio.js': 902_144, // 858,558
  'magic-card-editor.js': 715_776, // 699 KiB, CEO 2026-10-18 (measured 681,033 + 5%)
  'magic-card-icon-animator.js': 233_472, // 222,240
  'magic-card-icon-library.js': 180_224, // 171,507
  'magic-card-particles.js': 38_912, // 38 KiB, CEO 2026-10-18 (multiple emitters + per-emitter placement, spike F-S1 36,804)
  'magic-card-preset-catalogue.js': 24_576, // 22,797
  'magic-card-theme-editor.js': 182_272, // 178 KiB, CEO 2026-10-18 (UI kit migration); // 175,781 (T19: 172,032 + CEO-approved raise, 22-architect epic C); was 163,837
  'magic-card-theme-presets.js': 21_504, // 19,878
  // shape: custom builder (T2, ADR 0021): 2,873 B measured + 5 %, rounded up to 1 KiB; hard ceiling 5,120 B (more means shape-path.ts was copied in)
  'magic-card-shape-custom.js': 3_072, // 2,873
  'magic-card-anim-runtime.js': 40_960, // 38,672
  // path canvas for the SVG and shape editors (T4): 47,935 B measured + 5 %. The architect's ceiling was 40 KiB;
  // draw.ts (6.2 KB) is in this chunk by contract and is the main reason it is over. The chunk is only emitted
  // once an editor chunk imports src/path-canvas/loader.ts; until then this entry reports "missing from dist".
  'magic-card-path-canvas.js': 68_608, // 67 KiB, CEO 2026-10-18 (measured 65,332 + 5%)
  // SVG editor (T10): the architect's ceiling of 96 KiB, ADR 0019. Like the canvas chunk it is only emitted once the card-editor
  // chunk imports src/svg-editor/loader.ts (T11); until then this entry reports "missing from dist".
  'magic-card-svg-editor.js': 147_456, // 144 KiB, CEO 2026-10-18 (headroom for review fixes after T38; was 140 KiB)
  // shape editor (T7): the architect's ceiling of 48 KiB, ADR 0019. OVER the ceiling with the whole design scope
  // (about 64 KB, see 20-frontend-engineer-t7.md): the CEO rules on the number. Emitted once the card-editor
  // chunk imports src/shape-editor/loader.ts (T8); until then this entry reports "missing from dist".
  'magic-card-shape-editor.js': 86_016, // 84 KiB, CEO 2026-10-18 (booleans + T32 handles/menu)
  // epic D lazy chunks (D1 stubs, empty install): placeholder caps; D6 sets measured + 5 %, rounded up to 1 KiB, under the ceilings in src/contracts/lazy-module.ts
  'magic-card-slider.js': 97_280, // 95 KiB (D4, measured 92,085 + 5 %); ceiling 120 KiB
  'magic-card-seasonal.js': 58_368, // 57 KiB (D5, measured 55,023 + 5 %); ceiling 80 KiB
  'magic-card-markdown.js': 55_296, // 54 KiB (D2, measured 52,185 + 5 %); above the 52 KiB sanity ceiling by the rounding only
  // preset transfer (T16, ADR 0022): codec + validators 17.2 KB, <mc-transfer-panel> 8.9 KB, <mc-library-view> 11 KB. OVER the CEO ceiling of 28,672 B (TRANSFER_CHUNK_CEILING): measured + 5 %, rounded up to 1 KiB, pending the CEO ruling (js-yaml, sanitizeSvg, model.ts and the validators are NOT in it, see 33-frontend-engineer-t16.md)
  'magic-card-transfer.js': 39_936, // 39 KiB (measured 37,126 + 5 %); ceiling 28 KiB
  'magic-card-modules-extra.js': 24_576, // 24 KiB (D3, measured 23,139 + 5 %); ceiling 44 KiB
  // path booleans (T23, ADR 0025): 7,884 B measured + 5 %, rounded up to 1 KiB; ceiling 16,384 B (PATH_BOOLEANS_CEILING_BYTES). Only emitted once an editor chunk imports src/path-booleans/loader.ts (T25/T27); until then this entry reports "missing from dist".
  'magic-card-svg-booleans.js': 9_216, // 9 KiB (7,884)
  // path tools (T37, ADR 0027): 17,784 B measured (production build under a parent that holds lit; webpack stats list only src/path-tools/* and the contract, no lit, core.ts or booleans code) + 5 %, rounded up to 1 KiB; ceiling 20,480 B (PATH_TOOLS_CEILING_BYTES). Only emitted once the SVG editor chunk imports src/path-tools/loader.ts (T38); until then this entry reports "missing from dist".
  'magic-card-path-tools.js': 19_456, // 19 KiB (17,784)
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
