import { SHAPE_CSS } from './shapes/css';
/*
 * Styles for the mc-flows shadow root (flow-look rules 2-4). A constant: no config value is ever
 * inside it. Classes: `an` marks every animation of this chunk (paused offscreen / page-hidden,
 * none under reduced motion), `zz` electric zigzag variants (steps of 120 ms), `el` the electric
 * flicker (2 dips a second), `fk-s` / `fk-t` neon flicker (subtle 1 dip a second, strong 2 per 2 s,
 * irregular). Travelling dots, bubbles and dashes reuse the .dot / .dash rules of flows-css.ts.
 */
export const FLOW_LOOK_CSS = `
.flow[data-line] path{transition:stroke .15s}
@keyframes mc-flow-zz{0%,33.3%{opacity:1}33.4%,100%{opacity:0}}
@keyframes mc-flow-el{0%,20%,30%,70%,80%,100%{opacity:1}25%,75%{opacity:.6}}
@keyframes mc-flow-fs{0%,88%,98%,100%{opacity:1}90%,96%{opacity:.85}}
@keyframes mc-flow-ft{0%,20%,28%,60%,64%,100%{opacity:1}22%,26%,62%{opacity:.4}}
.zz{animation:mc-flow-zz .36s linear infinite}
.el{animation:mc-flow-el 1s linear infinite}
.fk-s{animation:mc-flow-fs 1s linear infinite}
.fk-t{animation:mc-flow-ft 2s linear infinite}
svg[offscreen] .an,div.html[offscreen] .an,:host([page-hidden]) .an{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){.an{animation:none}.flow[data-line] path{transition:none}}
` + SHAPE_CSS;
