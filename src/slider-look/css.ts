/*
 * The slider-look styles: one constant string (no config value is ever inside it; per-slider values
 * arrive as custom properties on the track, lit.M-SEC2). Selectors start with .mc-tile-slider.mc-sl so
 * they beat the card's own sheet, which an adopted sheet orders after a <style> in the shadow root.
 * Floor-safe (Chromium 85): no inset property, no color-mix, no individual transforms; separate
 * opacity for every tint. Nothing animates while idle; the [offscreen] rule is the pause hook.
 */
export const SLIDER_LOOK_CSS = `
.mc-tile-slider.mc-sl{overflow:visible;height:var(--sl-hit,40px);border-radius:0}
.mc-tile-slider.mc-sl.mc-tile-slider--vertical{width:var(--sl-hit,40px);height:100%}
.mc-tile-slider.mc-sl .mc-tile-slider-background,.mc-tile-slider.mc-sl .mc-tile-slider-bar{display:none}
.mc-tile-slider.mc-sl:focus-visible{outline:2px solid var(--primary-color,#03a9f4);outline-offset:3px;box-shadow:0 0 0 2px var(--primary-text-color,#212121)}
.mc-tile-slider.mc-sl.mc-sl--ticks{margin-bottom:.75rem}
.mc-tile-slider.mc-sl.mc-sl--labels{margin-bottom:1.75rem}
.mc-tile-slider.mc-sl.mc-sl--bubble{margin-top:2rem}
.mc-tile-slider.mc-sl.mc-tile-slider--vertical.mc-sl--ticks{margin:0 .75rem 0 0}
.mc-tile-slider.mc-sl.mc-tile-slider--vertical.mc-sl--labels{margin:0 3rem 0 0}
.mc-tile-slider.mc-sl.mc-tile-slider--vertical.mc-sl--bubble{margin:0 0 0 2.5rem}
.mc-sl .mc-sl-p{position:absolute;top:0;right:0;bottom:0;left:0}
.mc-sl-box{position:absolute;left:0;right:0;top:calc(50% - var(--sl-t) / 2);height:var(--sl-t);overflow:hidden;border-radius:var(--sl-r)}
.mc-tile-slider--vertical .mc-sl-box{left:calc(50% - var(--sl-t) / 2);right:auto;top:0;bottom:0;width:var(--sl-t);height:auto}
.mc-sl--segmented .mc-sl-box{overflow:visible;border-radius:0}
.mc-sl-t,.mc-sl-f,.mc-sl-o,.mc-sl-f::before,.mc-sl-f::after{position:absolute;top:0;right:0;bottom:0;left:0}
.mc-sl-t{background:var(--mc-slider-background,var(--disabled-color,#9e9e9e));opacity:.2}
.mc-sl-f{background:var(--sl-grad,var(--mc-slider-color));clip-path:inset(0 calc((1 - var(--v)) * 100%) 0 0 round var(--sl-r));transition:clip-path 180ms ease-in-out}
.mc-tile-slider--vertical .mc-sl-f{clip-path:inset(calc((1 - var(--v)) * 100%) 0 0 0 round var(--sl-r))}
.mc-tile-slider.mc-dragging .mc-sl-f{transition:none}
.mc-sl-o{box-sizing:border-box;border:1px solid var(--primary-text-color,#212121);border-radius:var(--sl-r);opacity:.55;pointer-events:none}
.mc-sl-g{position:absolute;top:0;bottom:0;margin:auto 0;height:50%;width:4px;left:calc(var(--v) * 100% - 9px);border-radius:var(--mc-radius-sm,4px);background:var(--sl-face,var(--text-primary-color,#fff))}
.mc-tile-slider--vertical .mc-sl-g{left:0;right:0;margin:0 auto;top:calc((1 - var(--v)) * 100% + 5px);bottom:auto;width:50%;height:4px}
.mc-sl--glass .mc-sl-t{background:var(--primary-text-color,#212121);opacity:.08}
.mc-sl--glass .mc-sl-f,.mc-tile-slider--vertical.mc-sl--glass .mc-sl-f{background:none}
.mc-sl--glass .mc-sl-f::before{content:'';background:var(--sl-grad,var(--mc-slider-color));opacity:.7}
.mc-sl--glass .mc-sl-f::after{content:'';bottom:auto;height:40%;background:var(--card-background-color,#fff);opacity:.25}
.mc-tile-slider--vertical.mc-sl--glass .mc-sl-f::after{bottom:0;right:auto;height:auto;width:40%}
.mc-sl--blur .mc-sl-box{-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.mc-sl-segs{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;gap:var(--sl-gap)}
.mc-tile-slider--vertical .mc-sl-segs{flex-direction:column-reverse}
.mc-sl-s{--f:clamp(0, calc(var(--v) * var(--n) - var(--i)), 1);position:relative;flex:1;border-radius:var(--sl-r);overflow:hidden}
.mc-sl-s::before,.mc-sl-s::after{content:'';position:absolute;top:0;right:0;bottom:0;left:0;border-radius:var(--sl-r)}
.mc-sl-s::before{background:var(--mc-slider-background,var(--disabled-color,#9e9e9e));opacity:.2}
.mc-sl-s::after{box-sizing:border-box;border:1px solid var(--primary-text-color,#212121);opacity:.55;pointer-events:none}
.mc-sl-s b{position:absolute;top:0;right:0;bottom:0;left:0;background-image:var(--sl-grad,linear-gradient(var(--mc-slider-color),var(--mc-slider-color)));background-size:calc(var(--n) * 100%) 100%;background-position:var(--p) 0;clip-path:inset(0 calc((1 - var(--f)) * 100%) 0 0)}
.mc-tile-slider--vertical .mc-sl-s b{background-size:100% calc(var(--n) * 100%);background-position:0 var(--p);clip-path:inset(calc((1 - var(--f)) * 100%) 0 0 0)}
.mc-sl-th{position:absolute;box-sizing:border-box;left:calc(var(--v) * 100%);top:50%;width:var(--tw);height:var(--th);border-radius:var(--tr);background:var(--sl-face);border:var(--sl-tb) solid var(--sl-tbc);box-shadow:0 0 0 2px var(--sl-ring),0 0 var(--sl-glow) var(--mc-slider-color);transform:translate(-50%,-50%) scale(var(--sc,1));transition:transform 120ms;display:flex;align-items:center;justify-content:center;color:var(--sl-icon);--mdc-icon-size:calc(var(--th) * .6)}
.mc-tile-slider--vertical .mc-sl-th{left:50%;top:calc((1 - var(--v)) * 100%)}
.mc-tile-slider.mc-dragging .mc-sl-th{--sc:1.15}
.mc-sl-k{position:absolute;left:calc(var(--k) * 100%);top:calc(50% + var(--sl-t) / 2 + 3px);width:1px;height:6px;margin-left:-.5px;background:var(--primary-text-color,#212121);opacity:.55}
.mc-sl-k--l{height:10px}
.mc-tile-slider--vertical .mc-sl-k{left:calc(50% + var(--sl-t) / 2 + 3px);top:calc((1 - var(--k)) * 100%);width:6px;height:1px;margin:-.5px 0 0}
.mc-tile-slider--vertical .mc-sl-k--l{width:10px;height:1px}
.mc-sl-l{position:absolute;left:calc(var(--k) * 100%);top:calc(50% + var(--sl-t) / 2 + 12px);transform:translateX(-50%);font-size:.75rem;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% / var(--nl,1));color:var(--secondary-text-color,#727272)}
.mc-sl-l[data-edge='0']{transform:none}
.mc-sl-l[data-edge='1']{transform:translateX(-100%)}
.mc-sl-l[data-on]{color:var(--primary-text-color,#212121);font-weight:600}
.mc-tile-slider--vertical .mc-sl-l,.mc-tile-slider--vertical .mc-sl-l[data-edge]{left:calc(50% + var(--sl-t) / 2 + 14px);top:calc((1 - var(--k)) * 100%);transform:translateY(-50%);max-width:3rem}
.mc-sl-b,.mc-sl-v{box-sizing:border-box;min-width:36px;height:24px;padding:0 6px;border-radius:8px;font-size:.75rem;line-height:24px;text-align:center;white-space:nowrap;background:var(--primary-text-color,#212121);color:var(--card-background-color,#fff);pointer-events:none}
.mc-sl-b{position:absolute;left:calc(var(--v) * 100%);bottom:calc(50% + var(--sl-bo));transform:translateX(-50%);opacity:0;transition:opacity 120ms}
.mc-sl-b::after{content:'';position:absolute;left:50%;top:100%;margin-left:-4px;border:4px solid transparent;border-top-color:var(--primary-text-color,#212121)}
.mc-tile-slider--vertical .mc-sl-b{left:calc(50% + var(--sl-bo));bottom:auto;top:calc((1 - var(--v)) * 100%);transform:translateY(-50%)}
.mc-tile-slider--vertical .mc-sl-b::after{left:auto;right:100%;top:50%;margin:-4px 0 0;border-top-color:transparent;border-right-color:var(--primary-text-color,#212121)}
.mc-tile-slider.mc-dragging .mc-sl-b,.mc-tile-slider:hover .mc-sl-b,.mc-tile-slider:focus-visible .mc-sl-b,.mc-sl-p[data-linger] .mc-sl-b{opacity:1}
.mc-sl-v{position:absolute;right:8px;top:50%;transform:translateY(-50%)}
.mc-tile-slider--vertical .mc-sl-v{right:auto;left:50%;top:8px;transform:translateX(-50%)}
.mc-sl-e{position:absolute;right:6px;top:50%;width:20px;height:20px;margin-top:-10px;border-radius:50%;box-sizing:border-box;border:2px solid var(--card-background-color,#fff);background:var(--error-color,#db4437);color:#fff;display:flex;align-items:center;justify-content:center;pointer-events:none}
.mc-tile-slider--vertical .mc-sl-e{right:auto;left:50%;top:6px;margin:0 0 0 -10px}
.mc-sl-e svg,.mc-sl-ev svg{width:16px;height:16px;fill:currentColor}
.mc-sl-ev{display:inline-flex;align-items:center;justify-content:center;min-width:36px;color:var(--error-color,#db4437)}
.mc-sl-p[data-error] .mc-sl-box{box-shadow:0 0 0 2px var(--error-color,#db4437)}
.mc-sl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mc-tile-slider[offscreen] .mc-sl-p *{transition:none;animation:none}
@media (prefers-reduced-motion:reduce){.mc-sl-f,.mc-sl-th,.mc-sl-b{transition:none}.mc-tile-slider.mc-dragging .mc-sl-th{--sc:1}}
`.replace(/\n/g, '');
