import { html, nothing, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { safeColor } from '../utils/animation';
import { pauseOffscreen } from './offscreen';

/*
 * Animated weather icons: hand-drawn 64×64 SVGs for Home Assistant's weather conditions, used by the
 * Weather and Forecast modules with `animated_icons: true`. Motion is CSS only (transform / opacity,
 * the wind's dash offset), ≤ 8 particles per icon; reduced motion shows the still frame, and icons
 * off-screen (or scrolled out of the forecast row) pause.
 * Clouds follow the module colour (currentColor at 85% / 60%); sun, rain and lightning use HA's
 * weather state colours with fallbacks.
 */

export const WEATHER_CONDITIONS = [
  'clear-night', 'cloudy', 'exceptional', 'fog', 'hail', 'lightning', 'lightning-rainy', 'partlycloudy',
  'pouring', 'rainy', 'snowy', 'snowy-rainy', 'sunny', 'windy', 'windy-variant',
] as const;

const SUN = 'var(--state-weather-sunny-color, #fbc02d)';
const MOON = 'var(--state-weather-clear-night-color, #9fa8da)';
const RAIN = 'var(--state-weather-rainy-color, #4fc3f7)';
const BOLT = 'var(--state-weather-lightning-color, #ffb300)';
const ICE = 'var(--state-weather-snowy-color, #b3e5fc)';
const ALERT = 'var(--state-weather-exceptional-color, var(--warning-color, #ff9800))';

const delay = (s: number) => `animation-delay: ${s}s`;

/**
 * The module colour at `opacity` over the card background, opaque: a front cloud hides the cloud or
 * sun behind it instead of showing it through.
 */
const cloudFill = (opacity: number) =>
  `color-mix(in srgb, currentColor ${Math.round(opacity * 100)}%, var(--ha-card-background, var(--card-background-color, #fff)))`;

/** A cloud of three puffs on a flat base, centred on (x, y); the inner group drifts. */
const cloud = (x: number, y: number, scale: number, opacity: number, back = false): SVGTemplateResult => svg`
  <g transform=${`translate(${x} ${y}) scale(${scale})`}>
    <g class=${back ? 'wx-cloud wx-cloud-back' : 'wx-cloud'} fill="currentColor" style=${`fill: ${cloudFill(opacity)}`}>
      <circle cx="-8" cy="2" r="6"></circle>
      <circle cx="0" cy="-4" r="9"></circle>
      <circle cx="9" cy="1" r="7"></circle>
      <rect x="-8" y="0" width="17" height="8"></rect>
    </g>
  </g>`;

/** Sun: a disc and eight rays turning slowly, centred on (x, y). */
const sun = (x: number, y: number, scale: number): SVGTemplateResult => svg`
  <g class="wx-sun" transform=${`translate(${x} ${y}) scale(${scale})`} style=${`color: ${SUN}`}>
    <g class="wx-rays" stroke="currentColor" stroke-width="3" stroke-linecap="round">
      ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        const s = Math.sin(r);
        return svg`<line x1=${+(c * 15).toFixed(2)} y1=${+(s * 15).toFixed(2)} x2=${+(c * 20).toFixed(2)} y2=${+(s * 20).toFixed(2)}></line>`;
      })}
    </g>
    <circle r="10.5" fill="currentColor"></circle>
  </g>`;

/** Crescent moon (centre 32, 32 when unscaled), optionally with two twinkling stars. */
const moon = (x: number, y: number, scale: number, stars = false): SVGTemplateResult => svg`
  <g class="wx-moon" transform=${`translate(${x} ${y}) scale(${scale}) translate(-32 -32)`} style=${`color: ${MOON}`}>
    <path d="M32.65 18.02A14 14 0 1 0 45.44 35.92A11 11 0 1 1 32.65 18.02Z" fill="currentColor"></path>
    ${stars
      ? svg`<path class="wx-star" d="M49 14l1.2 2.8L53 18l-2.8 1.2L49 22l-1.2-2.8L45 18l2.8-1.2Z" fill="currentColor"></path>
          <path class="wx-star" d="M18 44l.9 2.1L21 47l-2.1.9L18 50l-.9-2.1L15 47l2.1-.9Z" fill="currentColor" style=${delay(-1.5)}></path>`
      : nothing}
  </g>`;

/** Falling particles below a cloud: rain lines, snow flakes or hail stones (x positions, stagger). */
const drops = (xs: number[], top = 44): SVGTemplateResult => svg`
  <g class="wx-rain" stroke-width="2.5" stroke-linecap="round" style=${`stroke: ${RAIN}`}>
    ${xs.map((x, i) => svg`<line class="wx-drop" x1=${x} y1=${top} x2=${x - 2} y2=${top + 7} style=${delay(-(i * 0.9) / xs.length)}></line>`)}
  </g>`;
const flakes = (xs: number[], top = 44): SVGTemplateResult => svg`
  <g class="wx-snow" style=${`fill: ${ICE}`}>
    ${xs.map((x, i) => svg`<circle class="wx-flake" cx=${x} cy=${top + (i % 2) * 5} r="2.4" style=${delay(-(i * 2.4) / xs.length)}></circle>`)}
  </g>`;
const hail = (xs: number[], top = 44): SVGTemplateResult => svg`
  <g class="wx-hail-group" style=${`fill: ${ICE}`}>
    ${xs.map((x, i) => svg`<circle class="wx-hail" cx=${x} cy=${top} r="2.6" style=${delay(-(i * 0.7) / xs.length)}></circle>`)}
  </g>`;
const bolt = (x: number, y: number): SVGTemplateResult => svg`
  <path class="wx-bolt" transform=${`translate(${x} ${y})`} d="M4 0h8l-4 8h6L4 22l3-10H1Z" style=${`fill: ${BOLT}`}></path>`;

const WIND = ['M8 26H38A6 6 0 1 0 32 20', 'M6 36H46A6 6 0 1 1 40 42', 'M14 46H32'];
const wind = (paths: string[]): SVGTemplateResult => svg`
  <g class="wx-winds" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.85">
    ${paths.map((d, i) => svg`<path class="wx-wind" d=${d} pathLength="100" style=${delay(-i * 0.6)}></path>`)}
  </g>`;

function body(condition: string, night: boolean): SVGTemplateResult | undefined {
  const sky = (x: number, y: number, s: number) => (night ? moon(x, y, s * 0.75) : sun(x, y, s));
  switch (condition) {
    case 'sunny':
      return night ? moon(32, 32, 1.25, true) : sun(32, 32, 1.05);
    case 'clear-night':
      return moon(32, 32, 1.25, true);
    case 'partlycloudy':
      return svg`${sky(23, 23, 0.72)}${cloud(37, 38, 1.05, 0.85)}`;
    case 'cloudy':
      return svg`${cloud(24, 27, 0.8, 0.6, true)}${cloud(36, 38, 1.1, 0.85)}`;
    case 'rainy':
      return svg`${cloud(32, 28, 1.15, 0.85)}${drops([24, 33, 42])}`;
    case 'pouring':
      return svg`${cloud(26, 22, 0.8, 0.6, true)}${cloud(34, 28, 1.15, 0.85)}${drops([20, 27, 34, 41, 48])}`;
    case 'snowy':
      return svg`${cloud(32, 28, 1.15, 0.85)}${flakes([22, 30, 38, 46])}`;
    case 'snowy-rainy':
      return svg`${cloud(32, 28, 1.15, 0.85)}${drops([24, 40])}${flakes([32, 48])}`;
    case 'hail':
      return svg`${cloud(32, 28, 1.15, 0.85)}${hail([23, 32, 41, 28])}`;
    case 'lightning':
      return svg`${cloud(32, 27, 1.15, 0.85)}${bolt(25, 36)}`;
    case 'lightning-rainy':
      return svg`${cloud(32, 27, 1.15, 0.85)}${bolt(27, 36)}${drops([20, 46])}`;
    case 'fog':
      return svg`${cloud(32, 24, 1.05, 0.85)}
        <g class="wx-fogs" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6">
          <line class="wx-fog" x1="12" y1="42" x2="44" y2="42"></line>
          <line class="wx-fog" x1="20" y1="49" x2="52" y2="49" style=${delay(-2)}></line>
          <line class="wx-fog" x1="14" y1="56" x2="40" y2="56" style=${delay(-1)}></line>
        </g>`;
    case 'windy':
      return wind(WIND);
    case 'windy-variant':
      return svg`${cloud(36, 22, 0.95, 0.85)}${wind(['M6 38H40A6 6 0 1 1 34 44', 'M12 30H26'])}`;
    case 'exceptional':
      return svg`<g class="wx-alert" style=${`color: ${ALERT}`}>
        <circle cx="32" cy="32" r="19" fill="none" stroke="currentColor" stroke-width="4"></circle>
        <line x1="32" y1="21" x2="32" y2="35" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"></line>
        <circle cx="32" cy="43" r="2.8" fill="currentColor"></circle>
      </g>`;
    default:
      return undefined;
  }
}

/**
 * The animated icon for a weather condition, or undefined when the condition isn't one HA defines
 * (the caller keeps its static icon). `label`: announced as an image; otherwise aria-hidden.
 */
export function weatherIconSvg(
  condition: string,
  opts: { night?: boolean; color?: string; className?: string; label?: string },
): TemplateResult | undefined {
  const inner = body(condition, !!opts.night);
  if (!inner) return undefined;
  const color = safeColor(opts.color);
  return html`<svg
    ${pauseOffscreen()}
    class=${opts.className ? `mc-wx ${opts.className}` : 'mc-wx'}
    viewBox="0 0 64 64"
    focusable="false"
    data-condition=${condition}
    style=${color ? `color: ${color}` : nothing}
    role=${opts.label ? 'img' : nothing}
    aria-label=${opts.label || nothing}
    aria-hidden=${opts.label ? nothing : 'true'}
  >${inner}</svg>`;
}
