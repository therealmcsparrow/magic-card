import { svg, html, nothing, SVGTemplateResult, TemplateResult } from 'lit';
import type { ParticleKind } from '../utils/seasonal-scenes';

/*
 * Seasonal particle artwork: one small SVG (or a styled box) per particle kind and variant. Fill is
 * currentColor (the particle's swatch), accents use var(--c2). Designed to read on light and dark
 * cards: pale shapes get a cool or dark edge, silhouettes mix with the text colour.
 */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const f = (n: number) => String(Math.round(n * 100) / 100);

// ── Snowflakes (6-fold, centred at 0 0) ──
const FLAKE_ARMS = [
  // dendrite: long arm, two pairs of branches
  'M0 0V-10.6M0-7.2l-3-2.8M0-7.2l3-2.8M0-3.9l-2.1-1.9M0-3.9l2.1-1.9',
  // plate: arm with a pair of side plates and a diamond tip
  'M0-2.6V-10M0-6.4l-2.5-1.6M0-6.4l2.5-1.6M0-9.6l1.2 1.4L0-7.6l-1.2-.9z',
  // star: arm with a fork at the end; short spikes in between come from SPIKES
  'M0 0V-10.4M0-7.6l-2-2M0-7.6l2-2',
];
const SPIKES = range(6)
  .map((i) => {
    const a = ((i * 60 + 30) * Math.PI) / 180;
    return `M0 0L${f(Math.sin(a) * 4.6)} ${f(-Math.cos(a) * 4.6)}`;
  })
  .join('');

function flake(variant: number): SVGTemplateResult {
  const arm = FLAKE_ARMS[variant % FLAKE_ARMS.length];
  const arms = range(6).map((i) => svg`<path d=${arm} transform="rotate(${i * 60})"></path>`);
  const extra = variant === 2 ? svg`<path d=${SPIKES}></path>` : variant === 1 ? svg`<path d="M0-2.6l2.25 1.3v2.6L0 2.6l-2.25-1.3v-2.6z"></path>` : nothing;
  return svg`<svg viewBox="-12 -12 24 24" class="flake">
    <g class="edge">${arms}${extra}</g>
    <g class="core">${arms}${extra}</g>
    <circle r="1.3" class="hub"></circle>
  </svg>`;
}

// ── Leaves (point up, stem at the bottom) ──
const MAPLE_R: Array<[number, number]> = [
  [13.3, 5.2], [15.7, 3.9], [15.1, 8.5], [17.7, 6.2], [18.4, 7.9], [21.6, 7.2], [20.5, 10.4], [22.2, 11.3],
  [17.8, 14.9], [18.6, 17], [13.5, 16], [12.5, 17.6],
];
const MAPLE = (() => {
  const right = MAPLE_R.map(([x, y]) => `${x} ${y}`).join('L');
  const left = [...MAPLE_R].reverse().map(([x, y]) => `${f(24 - x)} ${y}`).join('L');
  return `M12 1.4L${right}L${left}Z`;
})();
const OAK = (() => {
  // rounded lobes down each side
  const lobes: Array<[number, number]> = [[3.6, 5.2], [5.6, 8.6], [6.6, 12.2], [5.2, 15.6]];
  let d = 'M12 1.8';
  let side = '';
  lobes.forEach(([w, y], i) => {
    const next = lobes[i + 1];
    const valley = next ? [12 + Math.min(w, next[0]) * 0.5, (y + next[1]) / 2 + 0.2] : [13.2, 18.8];
    side += `Q${f(12 + w + 0.9)} ${f(y - 2)} ${f(12 + w)} ${f(y)}Q${f(12 + w + 0.3)} ${f(y + 1.8)} ${f(valley[0])} ${f(valley[1])}`;
  });
  d += side;
  // the left side mirrors the right, walked bottom-up
  let left = 'L10.8 18.8';
  for (let i = lobes.length - 1; i >= 0; i--) {
    const [w, y] = lobes[i];
    const prev = lobes[i - 1];
    const valley = prev ? [12 - Math.min(w, prev[0]) * 0.5, (y + prev[1]) / 2 + 0.2] : [12, 1.8];
    left += `Q${f(12 - w - 0.3)} ${f(y + 1.8)} ${f(12 - w)} ${f(y)}Q${f(12 - w - 0.9)} ${f(y - 2)} ${f(valley[0])} ${f(valley[1])}`;
  }
  return `${d}${left}Z`;
})();
const BEECH = 'M12 1.8C17.6 5.8 18.2 12.8 12 19.8 5.8 12.8 6.4 5.8 12 1.8Z';
const BEECH_HALF = 'M12 1.8C17.6 5.8 18.2 12.8 12 19.8Z';
const LEAF_VEINS = [
  'M12 17V4M12 9.2L18.6 8.2M12 9.2L5.4 8.2M12 13.2l4.6 2M12 13.2l-4.6 2',
  'M12 18.4V3.4M12 6.4l3.2 -.8M12 6.4l-3.2-.8M12 10l4.6-1.2M12 10l-4.6-1.2M12 13.6l4.4-.8M12 13.6l-4.4-.8',
  'M12 19.4V3.2M12 7.2l3-1.9M12 7.2l-3-1.9M12 10.8l3.8-2.1M12 10.8l-3.8-2.1M12 14.4l3.2-1.8M12 14.4l-3.2-1.8',
];

function leaf(variant: number): SVGTemplateResult {
  const v = variant % 3;
  const body = v === 0 ? MAPLE : v === 1 ? OAK : BEECH;
  return svg`<svg viewBox="0 0 24 24" class="leaf">
    <path d=${body} class="fill"></path>
    ${v === 2 ? svg`<path d=${BEECH_HALF} class="shade"></path>` : nothing}
    <path d=${LEAF_VEINS[v]} class="vein"></path>
    <path d="M12 17.4L12.5 22.6" class="stem"></path>
  </svg>`;
}

// ── Cherry blossom ──
const PETAL = 'M12 22C6.6 18.2 5.4 11.2 7.9 5.6 8.9 3.6 10.3 3 11 3.6L12 5.7 13 3.6C13.7 3 15.1 3.6 16.1 5.6 18.6 11.2 17.4 18.2 12 22Z';
const PETAL_LIGHT = 'M12 19.6C8.9 16.8 8.2 11.6 9.6 7.4 10.6 8 11.4 8.6 12 9.6Z';

function petal(): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 24" class="petal">
    <path d=${PETAL} class="fill"></path>
    <path d=${PETAL_LIGHT} class="light"></path>
    <ellipse cx="12" cy="19.2" rx="1.6" ry="2.2" class="blush"></ellipse>
  </svg>`;
}

/** A small petal around 0 0 pointing up (length ~10.5). */
const BLOSSOM_PETAL = 'M0-1.2C-3-3.2-4.2-7.4-2.6-10.2-1.9-11.2-1-11.4-.6-11L0-9.8.6-11C1-11.4 1.9-11.2 2.6-10.2 4.2-7.4 3-3.2 0-1.2Z';

function blossom(): SVGTemplateResult {
  return svg`<svg viewBox="-12 -12 24 24" class="blossom">
    ${range(5).map((i) => svg`<path d=${BLOSSOM_PETAL} transform="rotate(${i * 72})" class="fill"></path>`)}
    ${range(5).map((i) => svg`<path d="M0 0L0-5.4" transform="rotate(${i * 72 + 36})" class="stamen"></path>`)}
    ${range(5).map((i) => {
      const a = ((i * 72 + 36) * Math.PI) / 180;
      return svg`<circle cx=${f(Math.sin(a) * 5.6)} cy=${f(-Math.cos(a) * 5.6)} r=".85" class="pollen"></circle>`;
    })}
    <circle r="2" class="heart"></circle>
  </svg>`;
}

// ── Butterfly (wings fold with scaleX around the body) ──
const WING_UP = 'M16 13C17 6.2 22.6 1.6 27.8 2.8 31.6 4.2 30 10.4 24.4 12.8 21.4 14.2 18.2 13.8 16 13Z';
const WING_LOW = 'M16 14C19.6 13.9 24.6 15.4 25.2 19.4 25.6 23 21.6 24.6 19 22.1 17.4 20.6 16.3 17.2 16 14Z';
const WING_UP_IN = 'M16.6 12.6C18.4 8.4 22 5.4 25.4 5.6 24.6 8.8 21.2 11.6 16.6 12.6Z';
const WING_LOW_IN = 'M16.6 14.6C19.6 15 22.6 16.8 22.6 19.4 20.4 19.8 17.8 17.6 16.6 14.6Z';

function wingSide(): SVGTemplateResult {
  return svg`<path d=${WING_UP} class="wing"></path><path d=${WING_LOW} class="wing"></path>
    <path d=${WING_UP_IN} class="wing-in"></path><path d=${WING_LOW_IN} class="wing-in"></path>
    <circle cx="27.2" cy="4.4" r=".75" class="dot"></circle><circle cx="28.6" cy="7" r=".6" class="dot"></circle>
    <circle cx="22.8" cy="21.6" r=".6" class="dot"></circle>`;
}

function butterfly(): SVGTemplateResult {
  return svg`<svg viewBox="0 0 32 26" class="butterfly">
    <g class="wings">${wingSide()}<g transform="matrix(-1 0 0 1 32 0)">${wingSide()}</g></g>
    <path d="M15.4 8.2C14.6 5 13.2 3.6 11.8 3.2M16.6 8.2C17.4 5 18.8 3.6 20.2 3.2" class="feeler"></path>
    <ellipse cx="16" cy="14.6" rx="1.05" ry="5.6" class="body"></ellipse>
    <circle cx="16" cy="8.4" r="1.3" class="body"></circle>
  </svg>`;
}

// ── Bat (wings flap with scaleY around the body line) ──
const BAT_WING =
  'M20 9.4C22 6.8 25 5.2 28.2 4.6 31.2 4.1 34.6 4.6 38.4 6.8 36.4 7.5 35.2 8.9 35.1 10.8 33.6 9.9 31.9 10 30.8 11.3 29.8 10.3 28 10.3 27 11.7 26 10.9 24.2 11.1 23.2 12.3 22.4 11.3 21.2 10.8 20 11Z';

function bat(): SVGTemplateResult {
  return svg`<svg viewBox="0 0 40 20" class="bat">
    <g class="wings"><path d=${BAT_WING}></path><path d=${BAT_WING} transform="matrix(-1 0 0 1 40 0)"></path></g>
    <path d="M18.3 8L18.5 5.1 19.8 7.2 20.2 7.2 21.5 5.1 21.7 8C22.6 8.8 22.7 10.6 22.2 12.2 21.6 13.8 20.6 14.4 20 14.4 19.4 14.4 18.4 13.8 17.8 12.2 17.3 10.6 17.4 8.8 18.3 8Z"></path>
    <circle cx="19.2" cy="9.4" r=".5" class="eye"></circle><circle cx="20.8" cy="9.4" r=".5" class="eye"></circle>
  </svg>`;
}

// ── Heart ──
const HEART = 'M12 20.6C12 20.6 2.6 14.6 2.6 8.6 2.6 5.4 5 3.2 8 3.2 9.8 3.2 11.2 4.2 12 5.6 12.8 4.2 14.2 3.2 16 3.2 19 3.2 21.4 5.4 21.4 8.6 21.4 14.6 12 20.6 12 20.6Z';

function heart(variant: number): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 24" class="heart ${variant % 2 ? 'outline' : ''}">
    <path d=${HEART} class="fill"></path>
    <path d="M6.6 6.4C5.3 7 4.8 8.4 5.1 9.7" class="shine"></path>
  </svg>`;
}

// ── Easter egg (patterns clipped to the egg via the shared #mc-sn-egg clip) ──
const EGG = 'M12 1.6C6.9 1.6 3.2 10.4 3.2 17.4 3.2 23.4 7.2 28.4 12 28.4 16.8 28.4 20.8 23.4 20.8 17.4 20.8 10.4 17.1 1.6 12 1.6Z';
const ZIGZAG = `M1 16${range(9).map((i) => `L${f(3.4 + i * 2.6)} ${i % 2 ? 16 : 12.6}`).join('')}`;

function eggPattern(v: number): SVGTemplateResult {
  if (v === 0)
    return svg`<path d=${ZIGZAG} class="pat-line"></path><path d="M1 9.4H23M1 21.2H23" class="pat-thin"></path>`;
  if (v === 1)
    return svg`${[
      [8, 8, 1.4],
      [14.6, 10.4, 1.6],
      [9.4, 14.4, 1.8],
      [16, 16.8, 1.4],
      [6.4, 19.6, 1.3],
      [11.8, 21.4, 1.7],
      [17, 23.2, 1.1],
      [12.6, 4.8, 1],
    ].map(([cx, cy, r]) => svg`<circle cx=${cx} cy=${cy} r=${r} class="pat-dot"></circle>`)}`;
  return svg`<rect x="0" y="10" width="24" height="3.4" class="pat-band"></rect><rect x="0" y="17.6" width="24" height="3.4" class="pat-band2"></rect>
    <path d="M1 15.3H23" class="pat-thin"></path>`;
}

function egg(variant: number): SVGTemplateResult {
  return svg`<svg viewBox="0 0 24 30" class="egg">
    <path d=${EGG} class="fill"></path>
    <g clip-path="url(#mc-sn-egg)">${eggPattern(variant % 3)}<ellipse cx="17" cy="19" rx="6" ry="10" class="shade"></ellipse></g>
    <ellipse cx="8.6" cy="9.4" rx="1.6" ry="3" transform="rotate(18 8.6 9.4)" class="shine"></ellipse>
    <path d=${EGG} class="edge"></path>
  </svg>`;
}

// ── Firework burst (centred): tapered streaks with bright tips, an inner ring of sparks ──
const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${f(Math.sin(a) * r)} ${f(-Math.cos(a) * r)}`;
};

function firework(): SVGTemplateResult {
  const streaks = range(14)
    .map((i) => {
      const a = (i * 360) / 14;
      return `M${polar(6, a)}L${polar(19.5, a - 3.4)}L${polar(23, a)}L${polar(19.5, a + 3.4)}Z`;
    })
    .join('');
  const dot = (r: number, deg: number, radius: number, cls: string) => {
    const a = (deg * Math.PI) / 180;
    return svg`<circle cx=${f(Math.sin(a) * r)} cy=${f(-Math.cos(a) * r)} r=${radius} class=${cls}></circle>`;
  };
  const tips = range(14).map((i) => dot(25, (i * 360) / 14, 1.6, 'tip'));
  const sparks = range(14).map((i) => dot(13.5, (i * 360) / 14 + 360 / 28, 0.95, 'spark'));
  return svg`<svg viewBox="-30 -30 60 60" class="firework"><circle r="16" class="bloom"></circle><path d=${streaks} class="ray"></path>${tips}${sparks}<circle r="2.6" class="core"></circle></svg>`;
}

// ── Stars ──
const STAR5 = (() => {
  const pts = range(10).map((i) => {
    const r = i % 2 ? 4.6 : 11;
    const a = (i * 36 * Math.PI) / 180;
    return `${f(Math.sin(a) * r)} ${f(-Math.cos(a) * r + 0.8)}`;
  });
  return `M${pts.join('L')}Z`;
})();
const SPARKLE = 'M0-11C.7-3.6 3.6-.7 11 0 3.6.7.7 3.6 0 11-.7 3.6-3.6.7-11 0-3.6-.7-.7-3.6 0-11Z';

function star(): SVGTemplateResult {
  return svg`<svg viewBox="-12 -12 24 24" class="star">
    <circle r="7.5" class="glow"></circle>
    <path d=${STAR5} class="fill"></path>
    <path d="M-1.6-4.2L0-8.4" class="shine"></path>
  </svg>`;
}

function sparkle(): SVGTemplateResult {
  return svg`<svg viewBox="-12 -12 24 24" class="sparkle">
    <circle r="5" class="glow"></circle>
    <path d=${SPARKLE} class="fill"></path>
    <circle r="1.3" class="core"></circle>
  </svg>`;
}

// ── Clouds, wind ──
const CLOUD =
  'M14 32C6.6 32 2 27.6 2 22.2 2 16.8 6.4 12.6 12 13 13 6.6 18.6 2 25.2 2 31.6 2 36.6 6 38.2 11.6 40.2 9.9 42.8 9 45.6 9 52 9 56.6 13.6 56.6 19.6 60 20.6 62 23.6 62 26.6 62 29.8 59.6 32 56 32Z';

function cloud(): SVGTemplateResult {
  return svg`<svg viewBox="0 0 64 34" class="cloud">
    <path d=${CLOUD} class="fill"></path>
    <ellipse cx="24" cy="12" rx="7" ry="4.6" class="lit"></ellipse>
  </svg>`;
}

const WIND = [
  'M2 14C22 14 38 8.4 58 10.2S92 18 104 10C110 6 108.2 1.2 103.2 2.6 99.6 3.8 101 8.2 104.6 7.6',
  'M2 12C18 12 34 15.6 54 13.6S86 8.8 100 11.6',
];

function windline(variant: number): SVGTemplateResult {
  return svg`<svg viewBox="0 0 110 24" preserveAspectRatio="none" class="windline"><path d=${WIND[variant % 2]}></path></svg>`;
}

/** The artwork of one particle. Boxes (snow dots, rain, fireflies, fog, confetti) are styled in CSS. */
export function particleArt(kind: ParticleKind, variant: number): TemplateResult | SVGTemplateResult | typeof nothing {
  switch (kind) {
    case 'flake':
      return flake(variant);
    case 'leaf':
      return leaf(variant);
    case 'petal':
      return petal();
    case 'blossom':
      return blossom();
    case 'butterfly':
      return butterfly();
    case 'bat':
      return bat();
    case 'heart':
      return heart(variant);
    case 'egg':
      return egg(variant);
    case 'firework':
      return firework();
    case 'star':
      return star();
    case 'sparkle':
      return sparkle();
    case 'cloud':
      return cloud();
    case 'windline':
      return windline(variant);
    case 'confetti':
      return variant === 2
        ? svg`<svg viewBox="0 0 12 6" class="ribbon"><path d="M1 3.4C2.6 .8 3.6 .8 4.6 3s2 2.6 3.2.2S10.2 1 11 3"></path></svg>`
        : html`<b class="chip ${variant ? 'round' : ''}"></b>`;
    default:
      return html`<b></b>`;
  }
}

/** Shared SVG definitions of a layer (one per shadow root). */
export const SYMBOL_DEFS = svg`<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs><clipPath id="mc-sn-egg"><path d=${EGG}></path></clipPath></defs>
</svg>`;

/** Ambient pieces drawn in SVG (the moon). */
export const MOON = svg`<svg viewBox="0 0 40 40" class="moon">
  <circle cx="20" cy="20" r="17" class="halo"></circle>
  <path d="M25.6 6.4A14 14 0 1 0 33.6 26.4 11.2 11.2 0 1 1 25.6 6.4Z" class="fill"></path>
  <circle cx="15.2" cy="23.6" r="1.6" class="crater"></circle><circle cx="19" cy="29" r="1" class="crater"></circle>
</svg>`;
