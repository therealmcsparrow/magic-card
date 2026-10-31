// Constant styles of the travelling shapes. A shape reads colour and opacity from --mc-sc and --mc-so on its group.
// Classes: sf filled, ss stroked, so / ol outlines, gl glow, bb bubble, hl highlight, sp / spi spin, pl pulse, ic icon
// box. Every animation also carries `an`.
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
