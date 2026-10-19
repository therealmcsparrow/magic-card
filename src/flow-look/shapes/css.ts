/*
 * Constant styles of the travelling shapes (appended to the flow-look css). A shape reads its colour
 * from two custom properties set on its group: --mc-sc (colour) and --mc-so (opacity), so no config
 * value is ever inside this text. Classes: sf filled, ss stroked, so outline under a stroked shape,
 * ol outline on a filled one (tube and cable: the shape would vanish in the line's own colour), gl glow
 * halo, bb hollow bubble, hl its highlight, sp spin (svg), spi spin (html), pl pulse (svg or html),
 * ic icon box on the HTML layer. Every animation also carries `an` (paused offscreen / page-hidden).
 */
export const SHAPE_CSS = `
.sf{fill:var(--mc-sc);fill-opacity:var(--mc-so,1)}
.ss{fill:none;stroke:var(--mc-sc);stroke-opacity:var(--mc-so,1);stroke-linecap:round;stroke-linejoin:round}
.so{fill:none;stroke:var(--primary-text-color,#212121);stroke-opacity:.7;stroke-linecap:round;stroke-linejoin:round}
.ol{stroke:var(--primary-text-color,#212121);stroke-opacity:.7;stroke-width:1;stroke-linejoin:round}
.gl{fill:var(--mc-sc);opacity:.3}
.bb{fill:var(--mc-sc);fill-opacity:.2;stroke:var(--mc-sc);stroke-width:1.5}
.hl{fill:none;stroke:#fff;stroke-opacity:.8;stroke-width:2;stroke-linecap:round}
.ic{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;color:var(--mc-sc);opacity:var(--mc-so,1)}
.ic>div{display:flex}
@keyframes mc-flow-sp{to{transform:rotate(360deg)}}
@keyframes mc-flow-pl{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:.8}}
.sp,.spi{animation:mc-flow-sp 3s linear infinite}
.sp{transform-origin:0 0}
.pl{animation:mc-flow-pl 1s ease-in-out infinite}
svg .pl{transform-origin:0 0}
@media (prefers-reduced-motion:reduce){.sp,.spi,.pl{animation:none}}
`;
