import { css } from 'lit';

/*
 * Styles of the Pause motion button (pause chunk): above every layer, 6 px from its corner, 28 px
 * visible and 44 px to hit. A shaped card adds the shape's content inset (--mc-shape-i*). The strip
 * it sits in is pause-gap-css.ts. Written compact: css`` text goes into the bundle as is.
 */
export const pauseCardStyles = css`
.mc-pause{position:absolute;z-index:6;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:28px;height:28px;min-width:24px;min-height:24px;margin:0;padding:0;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
@media (hover:hover){.mc-pause:hover{background:rgba(0,0,0,.75)}}
.mc-pause:focus-visible{outline:2px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px rgba(0,0,0,.6)}
.mc-pause svg{display:block;width:18px;height:18px;fill:currentColor;pointer-events:none}
.mc-pause[data-corner=bottom-left]{bottom:calc(6px + var(--mc-shape-ib,0px));left:calc(6px + var(--mc-shape-il,0px))}
.mc-pause[data-corner=bottom-right]{bottom:calc(6px + var(--mc-shape-ib,0px));right:calc(6px + var(--mc-shape-ir,0px))}
.mc-pause[data-corner=top-left]{top:calc(6px + var(--mc-shape-it,0px));left:calc(6px + var(--mc-shape-il,0px))}
.mc-pause[data-corner=top-right]{top:calc(6px + var(--mc-shape-it,0px));right:calc(6px + var(--mc-shape-ir,0px))}
.mc-pause::after{content:'';position:absolute;top:-8px;right:-8px;bottom:-8px;left:-8px}
@media (pointer:coarse){.mc-pause{width:34px;height:34px}.mc-pause svg{width:20px;height:20px}.mc-pause::after{top:-5px;right:-5px;bottom:-5px;left:-5px}}
@media (forced-colors:active){.mc-pause{border-color:ButtonText;background:ButtonFace;color:ButtonText}}
`;
