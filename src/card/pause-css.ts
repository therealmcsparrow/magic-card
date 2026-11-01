import { css } from 'lit';

/** Styles of the Pause motion button and its Paused label (pause chunk). */
export const pauseCardStyles = css`
.mc-pause{position:absolute;z-index:6;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:28px;height:28px;min-width:24px;min-height:24px;margin:0;padding:0;border:1px solid rgba(255,255,255,.7);border-radius:50%;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
@media (hover:hover){.mc-pause:hover{background:rgba(0,0,0,.75)}}
.mc-pause:focus-visible{outline:2px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px rgba(0,0,0,.6)}
.mc-pause svg{display:block;width:18px;height:18px;fill:currentColor;pointer-events:none}
.mc-pause[data-corner=bottom-left]{bottom:calc(6px + var(--mc-shape-ib,0px));left:calc(6px + var(--mc-shape-il,0px))}
.mc-pause[data-corner=bottom-right]{bottom:calc(6px + var(--mc-shape-ib,0px));right:calc(6px + var(--mc-shape-ir,0px))}
.mc-pause[data-corner=top-left]{top:calc(6px + var(--mc-shape-it,0px));left:calc(6px + var(--mc-shape-il,0px))}
.mc-pause[data-corner=top-right]{top:calc(6px + var(--mc-shape-it,0px));right:calc(6px + var(--mc-shape-ir,0px))}
.mc-pause::after{content:'';position:absolute;top:-9px;right:-9px;bottom:-9px;left:-9px}
.mc-pause-label{--s:28px;position:absolute;z-index:6;box-sizing:border-box;display:flex;align-items:center;min-height:var(--s);max-width:calc(100% - 2 * (var(--s) + 10px));padding:2px 10px;border:1px solid rgba(255,255,255,.7);border-radius:calc(var(--s) / 2);background:rgba(0,0,0,.6);color:#fff;font-size:.75rem;font-weight:500;line-height:1.25;letter-spacing:0;text-transform:none;min-width:0;overflow:hidden;overflow-wrap:normal;word-break:normal;hyphens:manual;pointer-events:none}
.mc-pause-label[data-corner=bottom-left]{bottom:calc(6px + var(--mc-shape-ib,0px));left:calc(6px + var(--mc-shape-il,0px) + var(--s) + 4px)}
.mc-pause-label[data-corner=bottom-right]{bottom:calc(6px + var(--mc-shape-ib,0px));right:calc(6px + var(--mc-shape-ir,0px) + var(--s) + 4px)}
.mc-pause-label[data-corner=top-left]{top:calc(6px + var(--mc-shape-it,0px));left:calc(6px + var(--mc-shape-il,0px) + var(--s) + 4px)}
.mc-pause-label[data-corner=top-right]{top:calc(6px + var(--mc-shape-it,0px));right:calc(6px + var(--mc-shape-ir,0px) + var(--s) + 4px)}
@media (pointer:coarse){.mc-pause{width:34px;height:34px}.mc-pause svg{width:20px;height:20px}.mc-pause::after{top:-6px;right:-6px;bottom:-6px;left:-6px}}
@media (pointer:coarse){.mc-pause-label{--s:34px}}
@media (forced-colors:active){.mc-pause{border-color:ButtonText;background:ButtonFace;color:ButtonText}.mc-pause-label{border-color:CanvasText;background:Canvas;color:CanvasText}.mc-pause:focus-visible{outline:2px solid Highlight;outline-offset:2px;box-shadow:none}}
ha-card[data-mc-paused] > .mc-pause{display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;pointer-events:auto!important;z-index:6!important}
ha-card[data-mc-paused] > .mc-pause-label{display:flex!important;visibility:visible!important;opacity:1!important;position:absolute!important;pointer-events:none!important;z-index:6!important}
`;
