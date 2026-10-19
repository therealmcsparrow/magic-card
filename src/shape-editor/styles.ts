import { css, type CSSResult } from 'lit';
import { editorTokens } from '../css/editor-system';
import { editorPrimitives, kitCss } from '../ui-kit';

/*
 * Styles of <mc-shape-studio>: the card editor's tokens and primitives plus the kit parts (contract ui-kit 1.0.0,
 * ADR 0030), then this layer's own layout only. No rule here targets a kit class. Layout follows the width of the
 * layer, never the device (data-layout, design 02 section 5); the tool rail turns into a row under 800 px of viewport,
 * the same media query as the kit's rail.
 */
// prettier-ignore
const layout: CSSResult = css`
:host{position:fixed;inset:0;z-index:1000;display:block;color:var(--mc-text);font:.875rem/1.4 var(--mc-font)}
*,::before,::after{box-sizing:border-box}
.skips{position:absolute;z-index:20;top:8px;left:8px;display:flex;gap:4px}
.skips button:focus{background:var(--mc-surface);box-shadow:var(--mc-shadow-float)}
.sentinel{position:absolute}
.skips button:not(:focus){position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.layer{position:relative;display:flex;flex-direction:column;height:100%;background:var(--mc-ground)}
.layer:focus{outline:none}
h2,h3,h4,p,ul{margin:0}
.msg{display:grid;justify-items:center;gap:8px;padding:24px;text-align:center}
.banners{top:56px;pointer-events:none}
.work{flex:1;min-height:0;display:grid;grid-template-columns:240px minmax(0,1fr) 340px;grid-template-areas:'left center insp'}
[data-layout=mid] .work{grid-template-columns:220px minmax(0,1fr) 320px}
[data-layout=compact] .work{grid-template-columns:minmax(0,1fr) 300px;grid-template-areas:'center insp'}
[data-layout=stacked] .work{display:flex;flex-direction:column;overflow:auto}
[data-layout=stacked] .center{order:1;overflow:visible}
[data-layout=stacked] .left{order:2}
[data-layout=stacked] .insp{order:3}
.left,.insp{display:flex;flex-direction:column;gap:12px;min-height:0;overflow:auto;padding:12px;background:var(--mc-surface)}
.left{grid-area:left;border-right:1px solid var(--mc-divider)}
[data-layout=compact] .left{display:none}
[data-layout=compact] .topbar .title,[data-layout=stacked] .topbar .title{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
[data-layout=compact] .left.sheet{display:flex;position:absolute;z-index:10;top:56px;bottom:0;left:0;width:min(80vw,280px);box-shadow:var(--mc-shadow-float)}
.insp{grid-area:insp;border-left:1px solid var(--mc-divider)}
.center{grid-area:center;display:flex;flex-direction:column;min-width:0;min-height:0}
.stagewrap{flex:1;min-height:0;display:flex}
@media(max-width:799px){.stagewrap{flex-direction:column}}
.stage{position:relative;flex:1 1 auto;min-width:0;min-height:260px;overflow:hidden;background:var(--mc-canvas)}
[data-layout=stacked] .stage{flex:none;min-height:max(320px,45vh)}
.stage>svg,.stage>mc-path-canvas{position:absolute;inset:52px 0 0;width:100%;height:calc(100% - 52px)}
.stage>.empty-stage{position:absolute;inset:52px 0 0;display:grid;place-items:center;padding:16px;text-align:center}
.float{position:absolute;z-index:3;top:10px;left:10px;right:10px;pointer-events:none}
.float>*{pointer-events:auto}
.dock,.banners{position:absolute;z-index:3;left:12px;right:12px;display:grid;gap:8px;justify-items:start}
.dock{bottom:12px}
.dock>*,.banners>*{max-width:min(100%,520px);pointer-events:auto}
.banners>*{backdrop-filter:blur(8px)}
.pen{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 12px;background:var(--mc-surface);border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);box-shadow:var(--mc-shadow-float)}
.pen .why{flex:1 1 200px}
.scale{position:absolute;left:12px;bottom:8px;z-index:1;font-size:.75rem;color:var(--mc-text-2)}
.stage text,.pv text{font:14px var(--mc-font);fill:var(--mc-text);pointer-events:none}
.pv text{font-size:12px}
.shape{fill:var(--mc-surface);stroke:var(--mc-text-2);stroke-width:1.5}
.shape.bare{fill:none}
.textarea{fill:none;stroke:var(--mc-accent);stroke-dasharray:4 3}
.handle{fill:var(--mc-surface);stroke:var(--mc-accent);stroke-width:2}
.handle.on{fill:var(--mc-accent)}
.hit{fill:transparent;cursor:nwse-resize;touch-action:none}
.sec{display:grid;gap:10px;min-width:0}
.sec+.sec{padding-top:12px;border-top:1px solid var(--mc-divider)}
.sec-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.acts{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.acts.end{justify-content:flex-end}
.grid2,.grid4{display:grid;gap:8px;grid-template-columns:1fr 1fr}
.grid4{grid-template-columns:repeat(4,minmax(0,1fr))}
.bare-set{display:grid;gap:6px;border:0;padding:0;margin:0;min-width:0}
.bare-set legend{padding:0;font-size:.75rem;color:var(--mc-text-2)}
.fl{font-size:.8125rem;font-weight:500}
.sub-label{font-size:.75rem;font-weight:500;color:var(--mc-text-2)}
.pv-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.pv-head .grow,.grow{flex:1}
.pv-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start}
.pv{display:flex;flex-direction:column;gap:2px;padding:4px;color:inherit;background:none;border:2px solid transparent;border-radius:10px;font:inherit;text-align:left;cursor:pointer}
.pv:hover{background:var(--mc-surface-2)}
.pv[aria-pressed=true]{border-color:var(--mc-accent)}
.pv.cut{outline:1px solid var(--mc-error-ink)}
.pv svg{display:block;min-width:96px;background:var(--mc-canvas);border-radius:6px}
.pv.card .shape{filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}
.pop-body{display:grid;gap:8px;min-width:min(320px,70vw)}
.keys{display:grid;gap:6px;padding-left:18px;font-size:.8125rem}
.ctiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.ctiles button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:56px;padding:4px;color:var(--mc-text);background:var(--mc-surface);border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);font:inherit;font-size:.75rem;cursor:pointer;transition:border-color var(--mc-ease,.15s ease-out),background-color var(--mc-ease,.15s ease-out)}
.ctiles button:hover{border-color:var(--mc-accent)}
.ctiles [aria-checked=true]{color:var(--mc-accent-ink);background:var(--mc-accent-tint);border-color:var(--mc-accent)}
.glyph{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5}
.cmini{align-self:flex-start;display:grid;grid-template:44px 44px/44px 44px;gap:2px;width:96px;padding:2px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface-2)}
.cmini button{border:0;border-radius:6px;color:var(--mc-text);background:var(--mc-surface);cursor:pointer}
.cmini button:hover{background:var(--mc-accent-tint)}
.cmini [aria-checked=true]{color:var(--mc-accent-ink);background:var(--mc-accent-tint)}
.corner-form{display:flex;flex-wrap:wrap;gap:12px}
.corner-form>.cf{display:grid;gap:8px;flex:1 1 200px;min-width:0}
.thumb-li{display:flex;align-items:center;gap:8px;min-width:0;flex:1;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:start;cursor:pointer}
.thumb-li svg{flex:none;width:48px;height:32px;background:var(--mc-surface-2);border-radius:6px}
.thumb-li span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dlg{display:grid;gap:12px}
.foot{display:contents}
.pgroup{display:grid;gap:8px}
.pgroup-head{display:flex;align-items:center;gap:8px}
.pgroup-head h3{font-size:.875rem;font-weight:500}
.pk svg{width:40px;height:40px;fill:currentColor;fill-opacity:.15;stroke:currentColor}
.pk svg.glyph{fill:none;stroke-width:1.5}
.libhead{display:grid;gap:8px}
.notes{display:grid;gap:4px}
details>summary{min-height:32px;cursor:pointer;font-size:.8125rem}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media(forced-colors:active){.ctiles [aria-checked=true],.cmini [aria-checked=true],.pv[aria-pressed=true]{outline:2px solid Highlight}.handle{stroke:Highlight}}
`;

export const studioStyles: CSSResult[] = [editorTokens, editorPrimitives, ...kitCss, layout];
