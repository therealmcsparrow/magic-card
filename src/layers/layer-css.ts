// Layer CSS: handed to the card as text and injected once per shadow root as <style data-mc-layer-css>.
// Every rule hangs on a data attribute set only for layered cards. Chromium 85 floor: no `inset`
// shorthand, no color-mix(). Nothing here animates.
const BOX_LIST = ['.mc-column', '.mc-row', '.mc-horizontal', '.mc-vertical', '.mc-tabs-content', '.mc-nested-row'];
/** The layered containers, spelled out per selector (no :is(), Chromium 85 floor). */
const boxes = (prefix: string, suffix: string) => BOX_LIST.map((b) => `${prefix}${b}${suffix}`).join(',');
const BG = '.mc-module-wrapper[data-mc-placement=background]';

export const LAYER_CSS = `
ha-card[data-mc-layers]{isolation:isolate;display:flex;flex-direction:column}
.mc-card-content[data-mc-layers]{position:relative;isolation:isolate}
${boxes('', '[data-mc-layers]')}{position:relative;isolation:isolate}
.mc-card-content[data-mc-layers]{flex:1 1 auto}
${boxes('.mc-card-content[data-mc-flows] ', '[data-mc-layers]')}{z-index:1}
mc-bg-stack,${BG},.mc-layer-scrim{position:absolute;top:0;right:0;bottom:0;left:0}
mc-bg-stack,${BG}{z-index:-1;overflow:hidden;border-radius:inherit}
mc-bg-stack,.mc-layer-scrim{pointer-events:none}
.mc-bg-badge{position:absolute;top:8px;right:8px;z-index:3;pointer-events:none}
${BG}{--mc-bleed:calc(-3 * var(--mc-layer-blur, 0px))}
${BG}>.mc-module,${BG}>.mc-layer-media>.mc-module{height:100%}
${BG}:focus-visible{outline-offset:-2px}
${BG}>.mc-layer-media{position:absolute;top:var(--mc-bleed);right:var(--mc-bleed);bottom:var(--mc-bleed);left:var(--mc-bleed)}
.mc-module-wrapper[data-mc-placement=overlay]{position:absolute}
[data-mc-anchor^=top]{top:var(--mc-layer-y)}
[data-mc-anchor^=bottom]{bottom:var(--mc-layer-y)}
[data-mc-anchor^=top],[data-mc-anchor^=bottom]{max-height:calc(100% - var(--mc-layer-y))}
[data-mc-anchor$=left]{left:var(--mc-layer-x)}
[data-mc-anchor$=right]{right:var(--mc-layer-x)}
[data-mc-anchor$=left],[data-mc-anchor$=right]{max-width:calc(100% - var(--mc-layer-x))}
[data-mc-anchor=top],[data-mc-anchor=center],[data-mc-anchor=bottom]{left:var(--mc-layer-x);right:calc(0px - var(--mc-layer-x));margin-left:auto;margin-right:auto;width:-webkit-fit-content;width:fit-content}
[data-mc-anchor=left],[data-mc-anchor=center],[data-mc-anchor=right]{top:var(--mc-layer-y);bottom:calc(0px - var(--mc-layer-y));margin-top:auto;margin-bottom:auto;height:-webkit-fit-content;height:fit-content}
.mc-layer-media{position:relative}
[data-mc-blur]>.mc-layer-media{filter:blur(var(--mc-layer-blur))}
.mc-layer-scrim{background:var(--mc-scrim);opacity:var(--mc-scrim-opacity, 1)}
[data-mc-pass]:not([data-mc-path]),[data-mc-pass]:not([data-mc-path]) *{pointer-events:none}
[data-mc-layers]>.mc-module-wrapper:not([data-mc-placement=background]):focus-within{z-index:50!important}
[data-mc-layers]>.mc-module-wrapper:not([data-mc-placement]):focus-within{position:relative}
[data-mc-low-power] .mc-layer-media{filter:none}
[data-mc-low-power] [data-mc-placement]{mix-blend-mode:normal!important}
`;
