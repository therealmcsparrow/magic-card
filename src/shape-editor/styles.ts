import { css, type CSSResult } from 'lit';

/*
 * Styles of <mc-shape-studio>, written compact on purpose (lit keeps this text in the chunk). The tokens
 * (--mc-*) are the card editor's, set here with the same HA theme fallbacks so the layer also works on its
 * own (src/css/editor-system is 27 KB this chunk cannot afford). Layout follows the width of the layer,
 * never the device (data-layout, design 02 section 5).
 */
// prettier-ignore
export const studioStyles: CSSResult = css`
:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121));--mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12));--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 40%,transparent);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--hit:40px;position:fixed;inset:0;z-index:1000;display:block;color:var(--mc-text);font:14px/1.4 system-ui,sans-serif}
@media(pointer:coarse){:host{--hit:44px}}
*,::before,::after{box-sizing:border-box}
:focus-visible{outline:2px solid var(--mc-accent);outline-offset:2px}
[hidden]{display:none!important}
.sr,.skips button:not(:focus){position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.skips{position:absolute;z-index:5;display:flex;gap:4px}
.layer{position:relative;display:flex;flex-direction:column;height:100%;background:var(--mc-ground)}
.layer:focus{outline:none}
h2,h3,h4,p,ul{margin:0}
h2,h3{font-size:1rem}
h4,.help,.f>span{font-size:.75rem;color:var(--mc-text-2)}
ul{padding:0;list-style:none}
.warn{color:var(--mc-error-ink)}
.b{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:var(--hit);min-width:var(--hit);padding:0 10px;color:inherit;background:var(--mc-surface);border:1px solid var(--mc-field-border);border-radius:8px;font:inherit;cursor:pointer}
.b[aria-pressed=true],.row.on,.seg [aria-checked=true],.seg [aria-selected=true],.tiles [aria-checked=true],.mini [aria-checked=true]{color:var(--mc-accent-ink);background:var(--mc-accent-tint)}
.b.ghost,.b.icon{background:none;border-color:transparent}
.b.primary{color:#fff;background:var(--mc-accent-fill)}
.b[aria-disabled=true],.b:disabled{opacity:.5;cursor:not-allowed}
.top,.row,.banner,.toast,.acts,.pointbar,.pv-head{display:flex;align-items:center;gap:6px}
.top{flex-wrap:wrap;min-height:52px;padding:6px 12px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider)}
.grow{flex:1}
.name{width:180px;max-width:40vw}
.mark{color:var(--mc-text-2)}
.chip{padding:2px 8px;border-radius:9999px;font-size:.75rem;background:var(--mc-warn-tint);color:var(--mc-warn-ink)}
input[type=text],input[type=number],input[type=search],select,textarea{width:100%;min-height:var(--hit);padding:0 10px;color:inherit;background:var(--mc-surface);border:1px solid var(--mc-field-border);border-radius:8px;font:inherit}
textarea{padding:8px 10px;font:.8125rem ui-monospace,Consolas,monospace}
.f{display:flex;flex-direction:column;gap:4px;min-width:0}
.grid2,.grid4{display:grid;gap:6px;grid-template-columns:1fr 1fr}
.grid4{grid-template-columns:repeat(4,minmax(0,1fr))}
.bare-set{border:0;padding:0;margin:0;min-width:0}
.unit{display:flex}
.unit input{border-radius:8px 0 0 8px}
.unit select{width:72px;margin-left:-1px;border-radius:0 8px 8px 0}
.switch{display:flex;align-items:center;gap:8px;min-height:32px}
.switch input{accent-color:var(--mc-accent-fill)}
.seg{display:flex;flex-wrap:wrap;padding:2px;gap:2px;background:var(--mc-surface-2);border-radius:8px}
.seg>button{flex:1;white-space:nowrap;min-height:calc(var(--hit) - 8px);padding:0 8px;border:0;border-radius:6px;color:inherit;background:none;font:inherit;cursor:pointer}
.banners{display:flex;flex-direction:column;gap:4px;padding:4px 12px 0}
.banner{flex-wrap:wrap;padding:6px 10px;border-radius:8px;background:var(--mc-surface-2);font-size:.8125rem}
.banner.warn{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}
.toast,.pop{position:absolute;z-index:20;background:var(--mc-surface);border:1px solid var(--mc-divider);border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.16)}
.toast{left:50%;bottom:16px;transform:translateX(-50%);padding:8px 12px;max-width:90vw}
.pop{top:60px;right:16px;width:min(92vw,380px);padding:16px;display:flex;flex-direction:column;gap:8px}
.acts{flex-wrap:wrap}
.acts.end{justify-content:flex-end}
.work{flex:1;min-height:0;display:grid;grid-template-columns:240px minmax(0,1fr) 340px;grid-template-areas:'left center insp'}
[data-layout=mid] .work{grid-template-columns:220px minmax(0,1fr) 320px}
[data-layout=compact] .work{grid-template-columns:minmax(0,1fr) 300px;grid-template-areas:'center insp'}
[data-layout=stacked] .work{display:flex;flex-direction:column;overflow:auto}
[data-layout=stacked] .center{order:1;overflow:visible}
[data-layout=stacked] .left{order:2}
[data-layout=stacked] .insp{order:3}
.left,.insp{display:flex;flex-direction:column;gap:10px;min-height:0;overflow:auto;padding:10px;background:var(--mc-surface)}
.left{grid-area:left;border-right:1px solid var(--mc-divider)}
[data-layout=compact] .left{display:none}
[data-layout=compact] .left.sheet{display:flex;position:absolute;z-index:10;top:52px;bottom:0;left:0;width:min(80vw,280px);box-shadow:0 8px 24px rgba(0,0,0,.16)}
.insp{grid-area:insp;border-left:1px solid var(--mc-divider)}
.center{grid-area:center;display:flex;flex-direction:column;gap:8px;min-width:0;min-height:0;padding:8px;overflow:auto}
.editbar{display:flex;flex-wrap:wrap;align-items:end;gap:8px}
.editbar .f:not(:first-child),.pointbar .f{width:84px}
.stage{position:relative;flex:1 1 auto;min-height:260px;overflow:hidden;border-radius:12px;background:var(--mc-canvas)}
[data-layout=stacked] .stage{flex:none;min-height:max(320px,45vh)}
.stage>svg,.stage>mc-path-canvas{position:absolute;inset:0;width:100%;height:100%}
.stage text,.pv text{font:14px system-ui,sans-serif;fill:var(--mc-text);pointer-events:none}
.pv text{font-size:12px}
.scale{position:absolute;left:8px;bottom:6px;z-index:1;font-size:.75rem;color:var(--mc-text-2)}
.shape{fill:var(--mc-surface);stroke:var(--mc-text-2);stroke-width:1.5}
.shape.bare{fill:none}
.textarea{fill:none;stroke:var(--mc-accent);stroke-dasharray:4 3}
.handle{fill:var(--mc-surface);stroke:var(--mc-accent);stroke-width:2}
.handle.on{fill:var(--mc-accent)}
.hit{fill:transparent;cursor:nwse-resize;touch-action:none}
.pointbar,.pv-head{flex-wrap:wrap}
.pointbar .seg{flex:none}
.previews{display:flex;flex-direction:column;gap:6px}
.pv-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}
.pv{display:flex;flex-direction:column;gap:2px;padding:4px;color:inherit;background:none;border:2px solid transparent;border-radius:10px;font:inherit;text-align:left;cursor:pointer}
.pv[aria-pressed=true]{border-color:var(--mc-accent)}
.pv.cut{outline:1px solid var(--mc-error-ink)}
.pv svg{display:block;min-width:96px;background:var(--mc-canvas);border-radius:6px}
.pv.card .shape{filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}
.tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.tiles button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;padding:4px;color:inherit;background:var(--mc-surface);border:1px solid var(--mc-field-border);border-radius:8px;font:.6875rem system-ui,sans-serif;cursor:pointer}
.tiles [aria-checked=true]{border-color:var(--mc-accent);box-shadow:0 0 0 1px var(--mc-accent)}
.glyph{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5}
.mini{align-self:flex-start;display:grid;grid-template:44px 44px/44px 44px;gap:2px;width:96px;padding:2px;border:1px solid var(--mc-field-border);border-radius:8px;background:var(--mc-surface-2)}
.mini button{border:0;border-radius:6px;color:inherit;background:var(--mc-surface);cursor:pointer}
.corner-form{display:flex;flex-wrap:wrap;gap:10px}
.corner-form>.f{flex:1 1 200px}
.rows .row{justify-content:space-between;min-height:var(--hit);padding:0 8px;border-radius:8px}
.rows .row button{flex:1;min-height:var(--hit);padding:0;color:inherit;background:none;border:0;font:inherit;text-align:left;cursor:pointer}
.mono{font:.8125rem ui-monospace,Consolas,monospace}
summary{min-height:32px;cursor:pointer}
.libs li{display:flex;align-items:center;gap:6px;min-height:48px}
.libs svg{flex:none;width:48px;height:32px;background:var(--mc-surface-2);border-radius:6px}
.nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.empty{padding:12px;border:1px dashed var(--mc-divider);border-radius:12px;color:var(--mc-text-2)}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media(forced-colors:active){.tiles [aria-checked=true],.mini [aria-checked=true],.row.on{outline:2px solid Highlight}.handle{stroke:Highlight}}
`;
