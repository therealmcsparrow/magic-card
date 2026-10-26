"use strict";export const __webpack_esm_ids__=[815];export const __webpack_esm_modules__={900(t,e,i){i.r(e),i.d(e,{BUILD:()=>K,api:()=>tt,install:()=>et});var s=i(6161),o=i(1299),n=i(7804),r=i(68);class a extends r.D{}a.directiveName="unsafeSVG",a.resultType=2;const c=(0,n.u$)(a);var l=i(8477),d=i(5171);const h="0 0 24 24",u=new Map,m=new Map,f=new Map,p=new Set;let g,y,v=0;const w=new Set;let $=!1;const _=t=>t.includes(":")?t.slice(0,t.indexOf(":")):"",b=new Set(["mdi","hass","hassio","hademo"]);function k(t){const e="undefined"==typeof window?{}:window,i=e.customIconsets?.[t];if("function"==typeof i)return i;const s=e.customIcons?.[t];return s&&"function"==typeof s.getIcon?t=>s.getIcon(t):void 0}function x(t,e){for(u.delete(t),u.set(t,{g:e,at:Date.now()});u.size>200;)u.delete(u.keys().next().value);e&&(p.delete(t),f.get(t)?.forEach(t=>{try{t()}catch{}}))}function M(t){const e=u.get(t);if(e?.g)return u.delete(t),u.set(t,e),e.g}function S(t,e){let i=f.get(t);return i||f.set(t,i=new Set),i.add(e),()=>{i.delete(e),i.size||f.delete(t)}}const C=new Map;let W=function(t){let e=2166136261;for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return(e>>>0).toString(36)+t.length.toString(36)};function T(t,e){e&&C.delete(e);const i=e??`svg:${W(t)}`;let s=i;for(let e=1;C.has(s)&&C.get(s).text!==t;e++)s=`${i}.${e}`;const o=function(t){const e=C.get(t);return e&&(C.delete(t),C.set(t,e)),e}(s);if(o)return o.geometry&&!u.get(s)?.g&&x(s,o.geometry),s;const n=function(t){try{return(0,d.OW)(t)}catch{return{markup:"",viewBox:"0 0 24 24",paths:[],accentPaths:[],strokes:[],error:d.kk}}}(t),r={text:t};if(n.error)r.error=n.error;else{const t={paths:n.paths,viewBox:n.viewBox};n.accentPaths.length&&(t.secondary=n.accentPaths),n.strokes.length&&(t.strokes=n.strokes),n.evenodd&&(t.evenodd=n.evenodd),r.markup=n.markup,r.geometry=t}for(C.set(s,r);C.size>50;){const t=C.keys().next().value;C.delete(t),u.delete(t)}return r.geometry&&x(s,r.geometry),s}function B(t){return C.get(t)?.markup}function j(t){return C.get(t)?.error}async function q(t){const e=k(_(t));if(!e)return;let i;try{i=await e((t=>t.slice(t.indexOf(":")+1))(t))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){T(i.mc_svg,t);const e=M(t);if(e)return e}const s="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||s.startsWith("<"))return"markup";if(!s)return;const o={paths:[s],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():h},n="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return n&&!n.startsWith("<")&&(o.secondary=[n]),o}function P(t,e){return new Promise(i=>{const s=document.createElement("ha-icon");s.setAttribute("icon",t);let o,n=!1;const r=setInterval(()=>{u(),l()},50),a=setTimeout(()=>c(void 0),e),c=t=>{n||(n=!0,w.delete(d),o?.disconnect(),clearInterval(r),clearTimeout(a),s.remove(),y&&!y.childElementCount&&(y.remove(),y=void 0),i(t))},l=()=>{if(n)return;const t=s.shadowRoot?.querySelector("ha-svg-icon"),e="string"==typeof t?.path?t.path.trim():"";if(!t||!e)return;const i={paths:[e],viewBox:"string"==typeof t.viewBox&&t.viewBox.trim()?t.viewBox.trim():h},o="string"==typeof t.secondaryPath?t.secondaryPath.trim():"";o&&(i.secondary=[o]),c(i)},d=()=>c(void 0);function u(){!o&&s.shadowRoot&&"undefined"!=typeof MutationObserver&&(o=new MutationObserver(l),o.observe(s.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}w.add(d),(y?.isConnected||(y=document.createElement("div"),y.setAttribute("aria-hidden","true"),y.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(y)),y).appendChild(s),u();const m=s;m.updateComplete?.then(()=>{u(),l()},()=>{}),l()})}function J(){for(const t of[...p]){if(!k(_(t))||m.has(t))continue;p.delete(t);const e=q(t).then(e=>(m.delete(t),x(t,e&&"markup"!==e?e:null),e&&"markup"!==e?e:void 0));m.set(t,e)}}function O(t){const e=t.detail;if("icons"===e?.kind)for(const t of e.ids?.length?e.ids.map(t=>`mcu:${t}`):[...u.keys(),...f.keys()].filter(t=>t.startsWith("mcu:")))u.delete(t),C.delete(t),f.get(t)?.forEach(t=>t())}function A(t,e={}){if(!t||!t.includes(":"))return Promise.resolve(void 0);if(t.startsWith("svg:"))return Promise.resolve(M(t));$||"undefined"==typeof window||($=!0,window.addEventListener("iconset-registered",J),window.addEventListener("mcu-library-changed",O));const i=u.get(t);if(i){if(i.g)return Promise.resolve(M(t));const e=Date.now()-i.at>6e4,s=p.has(t)&&!!k(_(t));if(!e&&!s)return Promise.resolve(void 0);s&&p.delete(t),u.delete(t)}if(t.startsWith("svg:"))return Promise.resolve(void 0);const s=m.get(t);if(s)return s;const o=(async()=>{const i=!!k(_(t)),s=await q(t);if("markup"===s)return void x(t,null);if(s)return x(t,s),s;const o=_(t);if(!b.has(o))return x(t,null),void(i||(p.add(t),function(){if(v=10,g||!p.size)return;const t=()=>{g=void 0,J(),p.size&&--v>0&&(g=setTimeout(t,500))};g=setTimeout(t,500)}()));const n=e.timeoutMs??3e3,r=function(t,e){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?P(t,e):new Promise(i=>{const s=Date.now();let o=!1;const n=()=>!o&&(o=!0,w.delete(r),clearTimeout(a),!0),r=()=>{n()&&i(void 0)},a=setTimeout(r,e);w.add(r),customElements.whenDefined("ha-icon").then(()=>{n()&&P(t,Math.max(0,e-(Date.now()-s))).then(i)},r)}):Promise.resolve(void 0)}(t,Math.max(n,e.probeMaxMs??15e3));r.then(e=>{e&&(x(t,e),J())});const a=await new Promise(t=>{const e=setTimeout(()=>t(void 0),n);r.then(i=>{clearTimeout(e),t(i)})});if(a)return a;M(t)||x(t,null)})().finally(()=>m.delete(t));return m.set(t,o),o}const E=s.AH`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: var(--mdc-icon-size, 24px);
    height: var(--mdc-icon-size, 24px);
    vertical-align: middle;
    line-height: 0;
  }
  svg[part='svg'] {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  /* Like ha-svg-icon: HA's icon colour variables first, then the module's colour. */
  .primary {
    fill: var(--icon-primary-color, currentColor);
  }
  .secondary {
    fill: var(--icon-secondary-color, currentColor);
    opacity: var(--icon-secondary-opactity, 0.5);
  }
  /* Fallback icons inherit the host's --mdc-icon-size (the host is sized by it too). */
  ha-icon,
  ha-state-icon {
    display: inline-flex;
  }
  ha-state-icon[hidden] {
    display: none;
  }
  .secondary.duo {
    opacity: 1;
  }
  /*
   * Own SVG: painted styles (gradient, value, duotone, empty colour) paint the filled shapes (mc-f) and
   * the strokes (mc-s) apart, so stroke icons keep their outline; mc-accent parts take the second
   * colour when one is set.
   */
  .own.painted .mc-f {
    fill: var(--mc-own-fill);
  }
  .own.painted .mc-s {
    stroke: var(--mc-own-stroke);
  }
  .own.accented .mc-accent.mc-f,
  .own.accented .mc-accent .mc-f {
    fill: var(--mc-icon-accent);
  }
  .own.accented .mc-accent.mc-s,
  .own.accented .mc-accent .mc-s {
    stroke: var(--mc-icon-accent);
  }
  .body.dim {
    opacity: 0.5;
  }
  /* Liquid fill: the level moves with a transform, the wave scrolls by one period per cycle. */
  .liquid {
    transition: transform 0.8s ease-in-out;
  }
  .wave {
    animation: mc-icon-wave 2.4s linear infinite;
  }
  @keyframes mc-icon-wave {
    to {
      transform: translateX(var(--mc-wave-dx, -24px));
    }
  }

  /*
   * Device animations. Spin / shake / pulse / drum move the whole <svg> (a compositable transform
   * around its box centre); the others animate a group around a pivot on the viewBox, set inline in
   * user units. Filters stay still: glow breathes the opacity of a blurred copy, flame's shadow sits
   * on a still wrapper.
   */
  .dev {
    transform-box: view-box;
    animation-duration: var(--mc-icon-speed, 1.5s);
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  .dev-spin {
    animation-name: mc-icon-spin;
    animation-timing-function: linear;
  }
  .glow-copy {
    fill: var(--mc-icon-glow-color, currentColor);
    opacity: calc(0.7 * var(--mc-icon-intensity, 1));
    animation: mc-icon-glow var(--mc-icon-speed, 2.4s) ease-in-out infinite;
  }
  .flame-glow {
    filter: drop-shadow(0 0 1px var(--mc-icon-glow-color, #ff6d00));
  }
  .dev-flame {
    animation-name: mc-icon-flame;
  }
  .dev-drum {
    animation-name: mc-icon-drum;
  }
  .dev-swing {
    animation-name: mc-icon-swing;
  }
  .dev-swing.dev-static {
    animation: none;
    transform: scaleX(calc(1 - 0.3 * var(--mc-icon-intensity, 1))) skewY(calc(-12deg * var(--mc-icon-intensity, 1)));
  }
  .dev-shake {
    animation-name: mc-icon-shake;
    animation-timing-function: linear;
  }
  .dev-pulse {
    animation-name: mc-icon-pulse;
  }
  .dev-eq {
    animation-name: mc-icon-eq;
  }
  .ring {
    fill: none;
    stroke: var(--mc-icon-glow-color, currentColor);
    transform-box: fill-box;
    transform-origin: center;
    opacity: 0.5;
    animation: mc-icon-ring var(--mc-icon-speed, 1.5s) ease-out infinite;
  }
  .snow circle {
    fill: var(--mc-icon-glow-color, var(--state-climate-cool-color, #2196f3));
    stroke: var(--card-background-color, #fff);
    stroke-width: 0.6px;
    opacity: 0.85;
    animation: mc-icon-snow var(--mc-icon-speed, 2.4s) linear infinite;
  }
  @keyframes mc-icon-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes mc-icon-glow {
    0%, 100% { opacity: calc(0.4 * var(--mc-icon-intensity, 1)); }
    50% { opacity: var(--mc-icon-intensity, 1); }
  }
  @keyframes mc-icon-flame {
    0%, 100% { transform: scale(1, 1); }
    20% { transform: scale(1.02, 0.94); }
    45% { transform: scale(0.98, 1.05); }
    70% { transform: scale(1.01, 0.97); }
    85% { transform: scale(0.99, 1.03); }
  }
  @keyframes mc-icon-drum {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-7deg) translateY(-1.7%); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(7deg) translateY(-1.7%); }
  }
  @keyframes mc-icon-swing {
    0%, 100% { transform: none; }
    50% { transform: scaleX(calc(1 - 0.35 * var(--mc-icon-intensity, 1))) skewY(calc(-12deg * var(--mc-icon-intensity, 1))); }
  }
  @keyframes mc-icon-shake {
    0%, 50%, 100% { transform: translateX(0); }
    10%, 30% { transform: translateX(-5.8%) rotate(-4deg); }
    20%, 40% { transform: translateX(5.8%) rotate(4deg); }
  }
  @keyframes mc-icon-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes mc-icon-eq {
    0%, 100% { transform: scale(1, 1); }
    20% { transform: scale(1.03, 1.1); }
    40% { transform: scale(1, 0.95); }
    60% { transform: scale(1.02, 1.07); }
    80% { transform: scale(1, 0.98); }
  }
  @keyframes mc-icon-ring {
    from { transform: scale(0.75); opacity: 0.9; }
    to { transform: scale(1.05); opacity: 0; }
  }
  @keyframes mc-icon-snow {
    from { transform: translateY(calc(var(--mc-snow-dy, 5px) * -1)); opacity: 0; }
    25% { opacity: 0.9; }
    to { transform: translateY(var(--mc-snow-dy, 5px)); opacity: 0; }
  }

  /*
   * Line-draw: the outline traced with a pathLength=1 dash, then the filled icon fades in under it
   * while the stroke fades out. Loop: draw, hold, erase (three durations per cycle).
   */
  .draw path {
    stroke: var(--icon-primary-color, currentColor);
    stroke-dasharray: 1 1;
  }
  .mc-draw .draw path {
    animation: mc-icon-draw var(--mc-draw-dur, 1.2s) ease-in-out both;
  }
  .mc-draw .body {
    animation: mc-icon-draw-fill var(--mc-draw-dur, 1.2s) ease-in both;
  }
  .mc-draw-loop .draw path {
    animation: mc-icon-draw-loop calc(var(--mc-draw-dur, 1.2s) * 3) ease-in-out infinite;
  }
  .mc-draw-loop .body {
    animation: mc-icon-draw-loop-fill calc(var(--mc-draw-dur, 1.2s) * 3) ease-in-out infinite;
  }
  @keyframes mc-icon-draw {
    0% { stroke-dashoffset: 1; opacity: 1; }
    60% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes mc-icon-draw-fill {
    0%, 50% { opacity: 0; }
  }
  @keyframes mc-icon-draw-loop {
    0% { stroke-dashoffset: 1; }
    33%, 67% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1; }
  }
  @keyframes mc-icon-draw-loop-fill {
    0%, 25%, 75%, 100% { opacity: 0; }
    35%, 62% { opacity: 1; }
  }
  /* Morph fallback (shapes that can't be matched): cross-fade, the new shape scales 0.85 -> 1. */
  .xfade-in {
    transform-box: view-box;
    transform-origin: center;
    animation: mc-icon-xfade-in 0.25s ease-out both;
  }
  .xfade-out {
    animation: mc-icon-xfade-out 0.25s ease-out both;
  }
  @keyframes mc-icon-xfade-in {
    from { opacity: 0; transform: scale(0.85); }
  }
  @keyframes mc-icon-xfade-out {
    to { opacity: 0; }
  }
  /* Morph: the target's secondary paths / own markup fade in over the 400 ms tween. */
  .morph-in {
    animation: mc-icon-fade-in 0.4s ease-in-out both;
  }
  @keyframes mc-icon-fade-in {
    from { opacity: 0; }
  }

  /* Off-screen (shared IntersectionObserver): looping animations pause. */
  :host([offscreen]) svg,
  :host([offscreen]) svg * {
    animation-play-state: paused;
  }

  /* Reduced motion: nothing moves; glow, the open-door pose, ring and flakes stay as a still frame. */
  @media (prefers-reduced-motion: reduce) {
    .liquid {
      transition: none;
    }
    .wave,
    .dev,
    .glow-copy,
    .ring,
    .snow circle,
    .draw path,
    .mc-draw .body,
    .mc-draw-loop .body,
    .xfade-in,
    .xfade-out,
    .morph-in {
      animation: none;
    }
    .draw {
      display: none;
    }
  }
`;var L=i(3852),F=i(4727),N=i(9136),U=i(1771);let D=0;const G=t=>String(+t.toFixed(3)),I=new Set(["spin","shake","pulse","drum"]),R=t=>[`--mc-icon-speed: ${G(t.speed>0?t.speed:1.5)}s`,`--mc-icon-intensity: ${G(t.intensity)}`,...t.color?[`--mc-icon-glow-color: ${t.color}`]:[]].join("; "),z=250,H=()=>"function"==typeof matchMedia&&!!matchMedia("(prefers-reduced-motion: reduce)")?.matches,V=(t,e,i,o)=>t.map(t=>s.JW`<path class=${o?.cls??s.s6} d=${t.d} pathLength=${o?.pathLength??s.s6} fill="none" stroke=${e}
    stroke-width=${G(t.width)} stroke-linecap=${t.cap??s.s6} stroke-linejoin=${t.join??s.s6} style=${i??s.s6}></path>`);function Y(t){const[e,i,s,o]=t.split(/[\s,]+/).map(Number);return[e,i,s,o].every(Number.isFinite)&&s>0&&o>0?{x:e,y:i,w:s,h:o}:{x:0,y:0,w:24,h:24}}const X={up:0,right:90,down:180,left:-90},Q=t=>"currentColor"===t?"var(--icon-primary-color, currentColor)":t;class Z extends s.WF{constructor(){super(...arguments),this.decorative=!1,this._stateTimers=[],this._readsPending=!1,this._rigOn=!1,this._holding=!1,this._animates=!1,this._observed=!1,this._uid="mc-icon-"+ ++D,this._outs=[],this._inSeq=0,this._drawing=!1,this._drawSeq=0,this._loaded=!1,this._reconnected=!1}connectedCallback(){super.connectedCallback(),this._ensure(),this.hasUpdated&&(this._reconnected=!0,this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,this._watched=void 0,this._stateTimers.forEach(clearTimeout),this._stateTimers=[],this._readsPending=!1,this._observe(!1),this._stopMorph(),clearTimeout(this._drawTimer),this._drawing=!1}_observe(t){if(t===this._observed)return;const e=(0,L.IH)();e&&(this._observed=t,t?e.observe(this):(e.unobserve(this),this.removeAttribute("offscreen")))}get _byState(){return(0,l.hZ)(this.hass,this.entity,this.iconOn,this.iconOff)}get _own(){const t=this.rig?.svg??("svg"===this.icon?this.svg:void 0);if(t)return t===this._ownText&&this._ownRef&&(M(this._ownRef)||j(this._ownRef))||(this._ownText=t,this._ownRef=T(t)),this._ownRef}get _rigRef(){return this.rig?this.rig.svg?this._own:this.rig.ref:void 0}get _useState(){return!(this._byState||this._own||!this.stateObj||"undefined"==typeof customElements||!customElements.get("ha-state-icon"))}get _want(){return this._rigRef??this._byState??this._own??(this._useState?this._stateRef:this.icon)}get _fb(){return(0,l.fq)(this.hass,this.entity)||this.fallback||"mdi:help"}get _ref(){const t=this._want;if(t?.startsWith("mcu:")){if(M(t))return t;const e=this.kept?.[t.slice(4)];if(!e)return this._fb;const i=this._copy,s=i?.text===e&&(M(i.ref)||j(i.ref))?i.ref:T(e);return i?.ref===s&&i.text===e||(this._copy={text:e,ref:s}),j(s)?this._fb:s}return t?.startsWith("svg:")&&j(t)?this._fb:t}willUpdate(t){this._ensure(),this._readPlan=this._statePlan(t);for(const t of[this.iconOn,this.iconOff])t&&this.isConnected&&!M(t)&&A(t);this._fx=(0,F.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"});const e=this._ref,i=this._rigRef,s=i?M(i):void 0;this._rigOn=!(!this.rig||i&&!s),this._geom=s??(this._useState&&this._stateGeom?this._stateGeom:e&&!i?M(e):void 0),this._holding=!this._geom&&this._useState&&!!this._shown&&("full"===this._readPlan||this._readsPending),this._holding?this._geom=this._shown:this._track(this._geom,this._fx,this._geom&&e?B(e):void 0)}_track(t,e,i){const s=this.entity?this.hass?.states?.[this.entity]:void 0,o=s?String((0,l.CU)(this.entity.split(".")[0],s.state,s.attributes)):void 0,n=void 0!==this._lastState&&void 0!==o&&o!==this._lastState;if(void 0!==o&&(this._lastState=o),!t)return;const r=(t=>`${t.viewBox}|${t.paths.join(" ")}|${(t.secondary??[]).join(" ")}|${(t.strokes??[]).map(t=>`${t.d}@${t.width}`).join(" ")}`)(t),a=!this._shown,c=!a&&r!==this._shownKey,d=H();c&&e.morph&&!this.rig&&(d?this._stopMorph():this._morph(this._shown,this._shownMarkup,t)),d||this.rig||!(a&&"load"===e.draw&&!this._loaded||"change"===e.draw&&(c||n))||this._draw(e),a&&"load"===e.draw&&(this._loaded=!0),this._shown=t,this._shownKey=r,this._shownMarkup=i}_morph(t,e,i){const s=Date.now(),o=void 0!==this._frame,n=this._frame??t.paths.join(" ");void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0;const r=void 0!==this._inStart?Math.min(1,(s-this._inStart)/z):1;clearTimeout(this._inTimer),this._inStart=void 0;const a=!o&&!!t.strokes?.length||!!i.strokes?.length,c=t.viewBox!==i.viewBox||a?void 0:(0,U.GO)(n,i.paths.join(" "));if(!c){const i=o?{paths:[n],secondary:t.secondary,viewBox:t.viewBox}:t;return this._fadeOut(i,o?void 0:e,z,r),this._inStart=s,this._inSeq++,void(this._inTimer=setTimeout(()=>{this._inStart=void 0,this.requestUpdate()},z))}(t.secondary?.length||e)&&this._fadeOut({paths:[],secondary:t.secondary,viewBox:t.viewBox},e,400,r);const l=s;this._frame=(0,U.GW)(c,0);const d=()=>{const t=Math.min(1,(Date.now()-l)/400);t>=1?(this._raf=void 0,this._frame=void 0):(this._frame=(0,U.GW)(c,(t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2)(t)),this._raf=requestAnimationFrame(d)),this.requestUpdate()};this._raf=requestAnimationFrame(d)}_fadeOut(t,e,i,s){const o=i*Math.max(0,Math.min(1,s));if(o<=0||!t.paths.length&&!t.secondary?.length&&!t.strokes?.length&&!e)return;const n={g:t,markup:e,ms:i,skip:i-o};for(n.timer=setTimeout(()=>{this._outs=this._outs.filter(t=>t!==n),this.requestUpdate()},o),this._outs=[...this._outs,n];this._outs.length>3;)clearTimeout(this._outs.shift().timer)}_stopMorph(){void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0,this._outs.forEach(t=>clearTimeout(t.timer)),this._outs=[],clearTimeout(this._inTimer),this._inStart=void 0}_draw(t){clearTimeout(this._drawTimer),this._drawing=!0,this._drawSeq++,this._drawTimer=setTimeout(()=>{this._drawing=!1,this.requestUpdate()},1e3*t.drawDuration)}_ensure(){const t=this._want;this.isConnected&&(t!==this._watched&&(this._unsub?.(),this._unsub=void 0,this._watched=t,t&&(this._unsub=S(t,()=>this.requestUpdate()))),t&&!M(t)&&A(t).then(e=>{e&&this._want===t&&this.requestUpdate()}))}_statePlan(t){const e=this._reconnected;if(this._reconnected=!1,!this._useState)return;const i=this.hass?.entities?.[this.stateObj.entity_id],s=i!==this._entry;return this._entry=i,t.has("stateObj")||s||e?"full":this._stateRef||this._stateGeom?void 0:"once"}updated(t){t.has("rig")&&(t.get("rig")?.sheet?.(this.renderRoot,!1),this.rig?.sheet?.(this.renderRoot,!0)),this._observe(this._animates&&this.isConnected);const e=this._readPlan;if(this._readPlan=void 0,!e||"once"===e&&this._readsPending)return;const i="full"===e?[0,50,300,1e3]:[0];this._stateTimers.forEach(clearTimeout),this._readsPending=!0,this._stateTimers=i.map((t,e)=>setTimeout(()=>{e===i.length-1&&(this._stateTimers=[],this._readsPending=!1),this._readStateIcon(),e===i.length-1&&this._holding&&this.requestUpdate()},t))}_readStateIcon(){const t=this.renderRoot.querySelector("ha-state-icon")?.shadowRoot;if(!t)return;const e=t.querySelector("ha-icon"),i="string"==typeof e?.icon&&e.icon||e?.getAttribute("icon")||void 0;let s;if(!i){const e=t.querySelector("ha-svg-icon"),i="string"==typeof e?.path?e.path.trim():"";i&&(s={paths:[i],viewBox:"string"==typeof e?.viewBox&&e.viewBox.trim()?e.viewBox.trim():"0 0 24 24"})}i===this._stateRef&&(s?.paths[0]??"")===(this._stateGeom?.paths[0]??"")||!i&&!s||(this._stateRef=i,this._stateGeom=s,this.requestUpdate())}render(){this._animates=!1;const t=this._geom,e="svg"===this.icon||this._want?.startsWith("mcu:")?this._fb:this.icon;return this._useState?s.qy`${t?this._svg(t):s.s6}<ha-state-icon
        ?hidden=${!!t}
        .hass=${this.hass}
        .stateObj=${this.stateObj}
        aria-hidden=${this.decorative?"true":s.s6}
      ></ha-state-icon>`:t?this._svg(t):s.qy`<ha-icon icon=${e||s.s6} aria-hidden=${this.decorative?"true":s.s6}></ha-icon>`}_svg(t){const e=this._fx??(0,F.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"}),i=this._rigOn?this.rig?.body?.(t):void 0,n=i?{...e,fill:void 0,draw:"off"}:e,r=!i&&void 0!==this._frame,a=r?{paths:[this._frame],secondary:t.secondary,viewBox:t.viewBox}:t,l=Y(a.viewBox),d=this._ref,h=d?B(d):void 0,u=!!n.fill||"duotone"===n.colors.style&&!a.secondary?.length,m=a.strokes??[],f=`url(#${this._uid}-clip)`,p="gradient"===n.colors.style?this._gradient(n,l):void 0,g=p?`url(#${this._uid}-grad)`:n.colors.valueColor??n.colors.primary,y=!n.fill&&!!n.colors.valueMissing,v=n.device,w=!!v&&v.speed>0&&I.has(v.anim),$="loop"===n.draw&&!H(),_=$||!i&&this._drawing;this._animates=!!v&&v.speed>0||$;const b=[w?`dev dev-${v.anim}`:"",$?"mc-draw-loop":_?"mc-draw":""].filter(Boolean).join(" "),k=[w?R(v):"",_?`--mc-draw-dur: ${G(n.drawDuration)}s`:""].filter(Boolean).join("; "),x=["body",y?"dim":""].filter(Boolean).join(" "),M=s.JW`<g class=${x}>
        ${i?s.JW`<g style=${g.startsWith("url(")?`--mc-rig-fill: ${g}`:"currentColor"!==g?`--mc-rig-paint: ${Q(g)}`:s.s6}>${c(i)}</g>`:r&&h?s.JW`${this._base(a,n,g,l)}<g class="morph-in">${this._ownSvg(h,t,n,g,l,!1)}</g>`:this._base(a,n,g,l,h)}
        ${n.fill?this._fill(n.fill,l,Q(n.fill.color===n.colors.primary?g:n.fill.color),m.length?{mask:f}:{clip:f}):s.s6}
      </g>`;return s.qy`${(0,o.D)(this._drawSeq,s.qy`<svg part="svg" viewBox=${a.viewBox} aria-hidden="true" focusable="false"
      class=${b||s.s6} style=${k||s.s6}>
      ${u||p?s.JW`<defs>
            ${u?this._clip(a,l):s.s6}
            ${p??s.s6}
          </defs>`:s.s6}
      ${this._device(n,a,l,w,s.JW`${this._outs.map(t=>this._outgoing(t,l,n,g))}${void 0!==this._inStart?(0,o.D)(this._inSeq,s.JW`<g class="xfade-in">${M}</g>`):M}${_?this._drawLayer(a,l,g):s.s6}`)}
    </svg>`)}`}_outgoing(t,e,i,o){const n=Y(t.g.viewBox),r=[t.ms!==z?`animation-duration: ${G(t.ms/1e3)}s`:"",t.skip>0?`animation-delay: ${G(-t.skip/1e3)}s`:""].filter(Boolean).join("; "),a="currentColor"!==o?`fill: ${Q(o)}`:void 0;return s.JW`<svg class="xfade-out" aria-hidden="true" x=${G(e.x)} y=${G(e.y)} width=${G(e.w)} height=${G(e.h)}
      viewBox=${t.g.viewBox} overflow="visible" style=${r||s.s6}>${t.markup?this._ownSvg(t.markup,t.g,i,o,n,!1):s.JW`${(t.g.secondary??[]).map(t=>s.JW`<path class="secondary" d=${t} fill="currentColor" style=${a??s.s6}></path>`)}${t.g.paths.map(t=>s.JW`<path class="old" d=${t} fill="currentColor" style=${`fill: ${Q(o)}`}></path>`)}${V(t.g.strokes??[],"currentColor",`stroke: ${Q(o)}`,{cls:"old"})}`}</svg>`}_drawLayer(t,e,i){const o=G(e.w/24*1.2),n="currentColor"!==i?`stroke: ${Q(i)}`:void 0;return s.JW`<g class="draw" aria-hidden="true">${[...t.secondary??[],...t.paths].map(t=>s.JW`<path d=${t} pathLength="1"
      fill="none" stroke="currentColor" stroke-width=${o} stroke-linecap="round" stroke-linejoin="round" style=${n??s.s6}></path>`)}${V(t.strokes??[],"currentColor",n,{pathLength:"1"})}</g>`}_clip(t,e){const i=`${this._uid}-clip`,o=[...t.paths,...t.secondary??[]];if(!t.strokes?.length)return s.JW`<clipPath id=${i}>${o.map(t=>s.JW`<path d=${t}></path>`)}</clipPath>`;const n=Math.max(...t.strokes.map(t=>t.width));return s.JW`<mask id=${i} maskUnits="userSpaceOnUse" x=${G(e.x-n)} y=${G(e.y-n)} width=${G(e.w+2*n)} height=${G(e.h+2*n)}>
      ${o.map(t=>s.JW`<path d=${t} fill="#fff"></path>`)}${V(t.strokes,"#fff")}
    </mask>`}_device(t,e,i,o,n){const r=t.device;if(!r)return n;const a=R(r),c=i.x+i.w/2,l=i.y+i.h/2,d=Math.min(i.w,i.h);let h=s.s6;if("snow"===r.anim){const t=[0,1,2,3,4,5].map(t=>{const e=i.x+i.w*(.14+.144*t),o=i.y+i.h*(.2+.37*t%.6);return s.JW`<circle cx=${G(e)} cy=${G(o)} r=${G(.05*d)} style=${`animation-delay: ${G(-t/6*(r.speed||1.5))}s`}></circle>`});h=s.JW`<g class="snow" style=${`${a}; --mc-snow-dy: ${G(.2*i.h)}px`}>${t}</g>`}else"pulse"===r.anim&&(h=s.JW`<circle class="ring" cx=${G(c)} cy=${G(l)} r=${G(.44*d)} style=${`${a}; stroke-width: ${G(.06*d)}`}></circle>`);if(o)return s.JW`${n}${h}`;const u=`dev dev-${r.anim}${r.speed>0?"":" dev-static"}`,[m,f]="swing"===r.anim?[i.x,l]:"flame"===r.anim||"eq"===r.anim?[c,i.y+i.h]:[c,l],p=`transform-box: view-box; transform-origin: ${G(m)}px ${G(f)}px`,g="glow"===r.anim?s.JW`<g class="glow-copy" aria-hidden="true" style=${`filter: blur(${G(.07*d)}px)`}>${[...e.secondary??[],...e.paths].map(t=>s.JW`<path d=${t}></path>`)}${V(e.strokes??[],"currentColor","stroke: var(--mc-icon-glow-color, currentColor)")}</g>`:s.s6,y=s.JW`<g class=${u} style=${`${a}; ${p}`}>${g}${n}</g>`;return"flame"===r.anim?s.JW`<g class="flame-glow" style=${a}>${y}</g>${h}`:s.JW`${y}${h}`}_base(t,e,i,o,n){const r=e.fill?.emptyColor;if(n)return this._ownSvg(n,t,e,i,o);if(r)return s.JW`${[...t.secondary??[],...t.paths].map((e,i)=>s.JW`<path class=${i<(t.secondary?.length??0)?"secondary duo":"primary"} d=${e}
        fill="currentColor" style=${`fill: ${r}`}></path>`)}`;const a=e.fill?G(e.fill.emptyOpacity):void 0,c="currentColor"!==i?`fill: ${i}`:void 0,l="duotone"===e.colors.style?e.colors.secondary:void 0;if(l&&!t.secondary?.length){const e=G(Math.min(o.w,o.h)/24*3);return s.JW`
        ${t.paths.map(t=>s.JW`<path class="primary duo-body" d=${t} fill="currentColor" fill-opacity=${a??s.s6} style=${`fill: ${l}`}></path>`)}
        ${t.paths.map(t=>s.JW`<path class="duo-line" d=${t} clip-path=${`url(#${this._uid}-clip)`} opacity=${a??s.s6}
          style=${`fill: none; stroke: ${Q(i)}; stroke-width: ${e}`}></path>`)}`}return s.JW`
      ${(t.secondary??[]).map(t=>s.JW`<path class=${`${l?"secondary duo":"secondary"}${void 0!==this._frame?" morph-in":""}`} d=${t} fill="currentColor"
        fill-opacity=${a??s.s6} style=${l?`fill: ${l}`:c??s.s6}></path>`)}
      ${t.paths.map(t=>s.JW`<path class="primary" d=${t} fill="currentColor" fill-opacity=${a??s.s6} style=${c??s.s6}></path>`)}`}_ownSvg(t,e,i,o,n,r=!0){const a=i.fill?.emptyColor,l=i.colors.style,d="duotone"===l&&!e.secondary?.length,h=!!a||"solid"!==l,u=a||d?void 0:i.colors.secondary,m=h||"currentColor"===o?void 0:Q(o),f=i.fill&&!a?G(i.fill.emptyOpacity):void 0,p=[m?`color: ${m}; fill: ${m}`:"",h?`--mc-own-fill: ${a??(d?i.colors.secondary:Q(o))}; --mc-own-stroke: ${a??Q(o)}`:"",u?`--mc-icon-accent: ${u}`:""].filter(Boolean).join("; "),g=["own",h?"painted":"",u?"accented":""].filter(Boolean).join(" "),y=G(Math.min(n.w,n.h)/24*3),v=r&&d&&!a&&!e.strokes?.length?e.paths.map(t=>s.JW`<path class="duo-line" d=${t} clip-path=${`url(#${this._uid}-clip)`} opacity=${f??s.s6}
          style=${`fill: none; stroke: ${Q(o)}; stroke-width: ${y}`}></path>`):s.s6;return s.JW`<g class=${g} fill="currentColor" opacity=${f??s.s6} style=${p||s.s6}>${c(t)}</g>${v}`}_gradient(t,e){return(0,N.os)(`${this._uid}-grad`,t.colors.angle,t.colors.stops??[],e)}_fill(t,e,i,o){if(void 0===t.level)return s.s6;const n=Math.max(0,t.level),r=X[t.direction],a=90===r||-90===r,c=a?e.h:e.w,l=a?e.w:e.h,d=e.x+e.w/2,h=e.y+e.h/2,u=d-c/2,m=h-l/2,f=t.wave&&n>0?.05*l*Math.min(1,Math.max(0,(.98-n)/.08)):0;f>0&&(this._animates=!0);const p=t=>s.JW`<g transform=${r?`rotate(${r} ${G(d)} ${G(h)})`:s.s6}>
        <g class="liquid" style=${`transform: translateY(${G((1-n)*l)}px)`}>
          <rect x=${G(u-c)} y=${G(m+f/2)} width=${G(3*c)} height=${G(2*l)} style=${`fill: ${t}`}></rect>
          ${f>0?(t=>{let e=`M${G(u)} ${G(m)}`;for(let t=0;t<4;t++){const i=u+t*c/2;e+=`Q${G(i+c/4)} ${G(m+(t%2?f:-f))} ${G(i+c/2)} ${G(m)}`}return e+=`V${G(m+f+.5)}H${G(u)}Z`,s.JW`<path class="wave" d=${e} style=${`fill: ${t}; --mc-wave-dx: ${G(-c)}px`}></path>`})(t):s.s6}
        </g>
      </g>`;return i.startsWith("url(")?s.JW`<g class="fill" clip-path=${o.clip??s.s6} mask=${o.mask??s.s6}>
      <mask id=${`${this._uid}-liquid`} maskUnits="userSpaceOnUse" x=${G(e.x)} y=${G(e.y)} width=${G(e.w)} height=${G(e.h)}>${p("#fff")}</mask>
      <rect class="paint" x=${G(e.x)} y=${G(e.y)} width=${G(e.w)} height=${G(e.h)} mask=${`url(#${this._uid}-liquid)`} style=${`fill: ${i}`}></rect>
    </g>`:s.JW`<g class="fill" clip-path=${o.clip??s.s6} mask=${o.mask??s.s6}>${p(i)}</g>`}}Z.properties={hass:{attribute:!1},icon:{attribute:!1},entity:{attribute:!1},fx:{attribute:!1},iconOn:{attribute:!1},iconOff:{attribute:!1},svg:{attribute:!1},fallback:{attribute:!1},kept:{attribute:!1},stateObj:{attribute:!1},decorative:{attribute:!1},rig:{attribute:!1}},Z.styles=E;const K="2026.10.12-beta.7",tt={resolveIconGeometry:A,onIconGeometry:S,setIconGeometry:function(t,e){x(t,e)},peekIconGeometry:M,registerSvgGeometry:T};function et(){customElements.get("mc-svg-icon")||customElements.define("mc-svg-icon",Z)}},3245(t,e,i){i.d(e,{Qt:()=>y,bb:()=>f,k8:()=>p});var s=i(3925),o=i(8983);const n=["spin","glow","flame","drum","swing","pulse","snow","shake","eq"],r={spin:1.5,glow:2.4,flame:1.2,drum:1.2,swing:1,pulse:1.5,snow:2.4,shake:1.2,eq:1.2},a="var(--error-color, #db4437)",c=new Set(["problem","smoke","gas","moisture","safety","carbon_monoxide","heat","tamper"]),l=new Set(["door","window","garage_door","opening"]),d=new Set(["run","running","washing","drying","spin","spinning","rinse","wash","dry"]),h=(t,e={})=>({anim:t,speed:r[t],intensity:1,...e}),u=t=>"number"==typeof t&&Number.isFinite(t)?t:void 0,m=t=>Math.min(1,Math.max(0,t));function f(t){if(!t||"string"!=typeof t.entity_id)return;const e=t.entity_id.split(".")[0],i=t.state,s=t.attributes||{},o="string"==typeof s.device_class?s.device_class:"";switch(e){case"fan":{if("on"!==i)return;const t=m((u(s.percentage)??100)/100);return h("spin",{speed:.6+2.4*(1-t)})}case"light":{if("on"!==i)return;const t=s.rgb_color,e=Array.isArray(t)&&t.length>=3&&t.slice(0,3).every(t=>void 0!==u(t))?`rgb(${t[0]}, ${t[1]}, ${t[2]})`:void 0,o=u(s.brightness);return h("glow",{intensity:void 0===o?1:.25+.75*m(o/255),...e?{color:e}:{}})}case"climate":return"heating"===s.hvac_action||"preheating"===s.hvac_action?h("flame"):"cooling"===s.hvac_action?h("snow"):"fan"===s.hvac_action?h("spin",{speed:1.5}):void 0;case"vacuum":return"cleaning"===i?h("drum",{speed:1.2}):void 0;case"sensor":return d.has(i)?h("drum",{speed:1.2}):void 0;case"binary_sensor":if("on"!==i)return;return"running"===o?h("drum",{speed:1.2}):l.has(o)?h("swing",{speed:0,intensity:.3}):c.has(o)?h("pulse",{color:a}):void 0;case"cover":return"opening"===i||"closing"===i?h("swing",{speed:1}):"open"===i?h("swing",{speed:0,intensity:.3}):void 0;case"lock":return"jammed"===i?h("shake"):"locking"===i||"unlocking"===i||"opening"===i?h("pulse"):void 0;case"media_player":return"playing"===i?h("eq"):void 0;case"alarm_control_panel":return"triggered"===i?h("pulse",{color:a}):void 0;case"siren":return"on"===i?h("pulse",{color:a}):void 0;default:return}}function p(t,e=t?.entity_id??""){const i=e.split(".")[0],s=String(t?.attributes?.device_class??"");switch(i){case"fan":return 447;case"light":return 224;case"climate":return 195;case"vacuum":return 166;case"sensor":return 168;case"binary_sensor":return"running"===s?167:l.has(s)?475:c.has(s)?370:void 0;case"cover":return 474;case"lock":return 419;case"media_player":return 182;case"alarm_control_panel":return 371;case"siren":return 370;default:return}}const g=new Set(["alarm_control_panel","automation","binary_sensor","camera","climate","cover","fan","humidifier","input_boolean","lawn_mower","light","lock","media_player","remote","script","siren","switch","timer","vacuum","valve","water_heater"]);function y(t,e){if("auto"===t)return f(e);if(!n.includes(t))return;if(function(t){if(!t||"string"!=typeof t.entity_id)return!1;if((0,o.Pd)(t))return!0;const e=t.entity_id.split(".")[0];return!!g.has(e)&&(!("climate"!==e||!["idle","off"].includes(String(t.attributes?.hvac_action)))||"media_player"===e&&"paused"===t.state||!(0,s.mu)(t))}(e))return;const i=t,r=f(e);return r?.anim===i?{...r,speed:r.speed>0?r.speed:1.5}:{anim:i,speed:1.5,intensity:1}}},4727(t,e,i){i.d(e,{Qh:()=>m});var s=i(7423),o=i(3245),n=i(3098);const r={...n.t8,emptyOpacity:.25,angle:90,drawDuration:1.2,secondaryPct:40,stops:["#2196f3","#f44336"]},a=["up","down","left","right"],c=["solid","duotone","gradient","value"],l=["off","load","change","loop"],d=(t,e,i)=>e.includes(t)?t:i;function h(t){const e=t.trim();let i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e);if(i){const t=3===i[1].length?[...i[1]].map(t=>t+t).join(""):i[1];return{r:parseInt(t.slice(0,2),16),g:parseInt(t.slice(2,4),16),b:parseInt(t.slice(4,6),16)}}return i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(e),i?{r:+i[1],g:+i[2],b:+i[3]}:void 0}const u=t=>`rgb(${Math.round(t.r)}, ${Math.round(t.g)}, ${Math.round(t.b)})`;function m(t,e){const i=t&&"object"==typeof t?t:{},s=e.entity?e.hass?.states?.[e.entity]:void 0,m=i.colors&&"object"==typeof i.colors?i.colors:{},p=d(m.style,c,"solid"),g=(0,n.dU)(m.primary,s)??e.baseColor,y=i.fill||"value"===p?function(t,e){const i=t.fill&&"object"==typeof t.fill?t.fill:{},s=i.entity||e.entity;return(0,n.EN)(s?e.hass?.states?.[s]:void 0,i.attribute||void 0,i.min,i.max)}(i,e):void 0,v={style:p,primary:g,angle:(0,n.bu)(m.angle)??r.angle},w="string"==typeof m.secondary&&/%\s*$/.test(m.secondary)?(0,n.uM)(m.secondary):void 0,$=void 0!==w?(0,n.jh)(g,Math.round(100*w)):(0,n.dU)(m.secondary,s);if("duotone"===p?v.secondary=$??(0,n.jh)(g,r.secondaryPct):$&&(v.secondary=$),"gradient"===p||"value"===p){const t=(Array.isArray(m.gradient)?m.gradient:[]).map(t=>(0,n.dU)(t,s)).filter(t=>!!t);v.stops=t.length>=2?t:1===t.length?[t[0],t[0]]:[...r.stops],"value"===p&&(v.valueColor=void 0===y?v.stops[0]:function(t,e){if(!t.length)return"currentColor";const i=(0,n.qE)(Number.isFinite(e)?e:0,0,1)*(t.length-1),s=Math.min(Math.floor(i),t.length-2);if(1===t.length||s<0)return h(t[0])?u(h(t[0])):t[0];const o=i-s,r=h(t[s]),a=h(t[s+1]);return r&&a?u({r:r.r+(a.r-r.r)*o,g:r.g+(a.g-r.g)*o,b:r.b+(a.b-r.b)*o}):o<.5?t[s]:t[s+1]}(v.stops,y),void 0===y&&(v.valueMissing=!0))}const _={colors:v,draw:d(i.draw,l,"off"),drawDuration:f(i.draw_duration)??r.drawDuration,morph:!0===i.morph},b=(0,o.Qt)(i.device,s);if(b&&(_.device=b),i.fill&&"object"==typeof i.fill){const t=i.fill,e=(0,n.uM)(t.empty_color),o=void 0===e?(0,n.dU)(t.empty_color,s):void 0;_.fill={level:y,color:(0,n.dU)(t.color,s)??v.valueColor??g,emptyOpacity:o?1:e??r.emptyOpacity,...o?{emptyColor:o}:{},wave:!1!==t.wave,direction:d(t.direction,a,"up")}}return _}function f(t){const e=(0,s.TD)(t);if(!e)return;const i=e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);return i>0?i:void 0}i.d(e,["_T",0,r])},5171(t,e,i){i.d(e,{OW:()=>B,ae:()=>k,j9:()=>x});var s=i(1771);const o="0 0 24 24",n=t=>new Map(t.map(t=>[t.toLowerCase(),t])),r=n(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),a=n(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"]),c=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),l=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]),d=/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,h=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),u=new Set(["matrix","translate","scale","rotate","skewx","skewy"]),m=new Set(["transform","gradientTransform"]);function f(t,e){const i=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length===i&&s.every(t=>e.has(t[1].toLowerCase()))}function p(t,e){const i=e.trim();if(!/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i.test(i)){if(m.has(t))return f(i,u)?e:void 0;if(f(i.replace(d,""),h)){if("id"===t)return/^[\w.:-]+$/.test(i)?i:void 0;if("class"===t){const t=i.split(/\s+/).filter(t=>/^[\w-]+$/.test(t));return t.length?t.join(" "):void 0}return e}}}const g=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),y=t=>"mc-accent"!==t&&(g.has(t)||/^(mc-|dev-|xfade-)/.test(t))?`u-${t}`:t,v=t=>t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),w=t=>String(+t.toFixed(3)),$=t=>{if(null==t||/%/.test(t))return;const e=parseFloat(t);return Number.isFinite(e)?e:void 0},_=[1,0,0,1,0,0],b=(t,e)=>[t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]];function k(t){let e=_;if(!t)return e;for(const[,i,s]of t.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const t=s.split(/[\s,]+/).filter(Boolean).map(Number);if(t.some(t=>!Number.isFinite(t)))continue;let o=_;switch(i){case"matrix":6===t.length&&(o=t);break;case"translate":o=[1,0,0,1,t[0]??0,t[1]??0];break;case"scale":o=[t[0]??1,0,0,t[1]??t[0]??1,0,0];break;case"rotate":{const e=(t[0]??0)*Math.PI/180,[i,s]=[t[1]??0,t[2]??0],n=[Math.cos(e),Math.sin(e),-Math.sin(e),Math.cos(e),0,0];o=b(b([1,0,0,1,i,s],n),[1,0,0,1,-i,-s]);break}case"skewX":o=[1,0,Math.tan((t[0]??0)*Math.PI/180),1,0,0];break;case"skewY":o=[1,Math.tan((t[0]??0)*Math.PI/180),0,1,0,0]}e=b(e,o)}return e}function x(t,e){const i=e=>$(t.getAttribute(e));switch(e){case"path":{const e=t.getAttribute("d")?.trim();return e||void 0}case"circle":case"ellipse":{const t=i("cx")??0,s=i("cy")??0,o="circle"===e?i("r"):i("rx")??i("ry"),n="circle"===e?o:i("ry")??i("rx");if(!o||!n||o<=0||n<=0)return;const r=`A${w(o)} ${w(n)} 0 1 0`;return`M${w(t-o)} ${w(s)}${r} ${w(t+o)} ${w(s)}${r} ${w(t-o)} ${w(s)}Z`}case"rect":{const t=i("x")??0,e=i("y")??0,s=i("width"),o=i("height");if(!s||!o||s<=0||o<=0)return;let n=i("rx")??i("ry")??0,r=i("ry")??i("rx")??0;if(n=Math.min(Math.max(n,0),s/2),r=Math.min(Math.max(r,0),o/2),!n||!r)return`M${w(t)} ${w(e)}H${w(t+s)}V${w(e+o)}H${w(t)}Z`;const a=`A${w(n)} ${w(r)} 0 0 1`;return`M${w(t+n)} ${w(e)}H${w(t+s-n)}${a} ${w(t+s)} ${w(e+r)}V${w(e+o-r)}${a} ${w(t+s-n)} ${w(e+o)}H${w(t+n)}${a} ${w(t)} ${w(e+o-r)}V${w(e+r)}${a} ${w(t+n)} ${w(e)}Z`}case"line":return`M${w(i("x1")??0)} ${w(i("y1")??0)}L${w(i("x2")??0)} ${w(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(t){const e=(t??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let t=0;t+1<e.length;t+=2)Number.isFinite(e[t])&&Number.isFinite(e[t+1])&&i.push([e[t],e[t+1]]);return i}(t.getAttribute("points"));if(i.length<2)return;return`M${i.map(([t,e])=>`${w(t)} ${w(e)}`).join("L")}${"polygon"===e?"Z":""}`}}}const M="The SVG is too complex.",S=t=>({markup:"",viewBox:o,paths:[],accentPaths:[],strokes:[],error:t}),C={fill:!0,stroke:!1,width:1},W=/^(none|transparent)$/i;function T(t,e){const i=e=>{const i=t.getAttribute(e);return null===i?void 0:p(e,i)?.trim()},s=i("fill"),o=i("stroke"),n=$(i("stroke-width")),r=i("stroke-linecap"),a=i("stroke-linejoin"),c=i("fill-rule");return{evenodd:void 0===c?e.evenodd:"evenodd"===c,fill:void 0===s?e.fill:!W.test(s),stroke:void 0===o?e.stroke:!W.test(o),width:void 0!==n&&n>=0?n:e.width,cap:r&&/^(butt|round|square)$/.test(r)?r:e.cap,join:a&&/^(miter|round|bevel|arcs|miter-clip)$/.test(a)?a:e.join}}function B(t){const e="string"==typeof t?t:"";if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length)>32768)return S("The SVG is larger than 32 KB.");const i=function(t){if("undefined"==typeof DOMParser)return;const e=new DOMParser;try{const i=e.parseFromString(t,"image/svg+xml"),s=i.documentElement;if(s&&"svg"===s.localName&&!i.getElementsByTagName("parsererror").length)return s}catch{}return[...e.parseFromString(t,"text/html").getElementsByTagName("*")].find(t=>"svg"===t.localName.toLowerCase())}(e);if(!i)return S("No <svg> element found.");const n=function(t){const e=(t.getAttribute("viewBox")??t.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===e.length&&e.every(Number.isFinite)&&e[2]>0&&e[3]>0)return e.map(w).join(" ");const i=$(t.getAttribute("width")),s=$(t.getAttribute("height"));return i&&s&&i>0&&s>0?`0 0 ${w(i)} ${w(s)}`:o}(i),d=[],h=[],u=[],m={},f=(t,e,i=[])=>{let s="",o="";for(const i of[...t.attributes]){const t=a.get(i.name.toLowerCase());if(!t||i.name.includes(":"))continue;if(e&&("viewBox"===t||"width"===t||"height"===t))continue;const n=p(t,i.value);void 0!==n&&("class"===t?o=n.split(" ").map(y).join(" "):s+=` ${t}="${v(n)}"`)}const n=[o,...i].filter(Boolean).join(" ");return n?` class="${v(n)}"${s}`:s};let g=!1;const W=(t,e,i,o,n,a)=>{if(a>64||g)return g=!0,"";const y=r.get(t.localName.toLowerCase());if(!y||"svg"===y)return"";if("title"===y)return`<title>${v=t.textContent??"",v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</title>`;var v;const w=b(e,k(p("transform",t.getAttribute("transform")??"")??null)),$=o||(t.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),M=i&&!l.has(y),S=T(t,n),C=[];if(M&&c.has(y)){const e=x(t,y);if(e){const t=function(t,e){if((t=>t.every((t,e)=>Math.abs(t-_[e])<1e-9))(e))return t;const i=t=>[e[0]*t[0]+e[2]*t[1]+e[4],e[1]*t[0]+e[3]*t[1]+e[5]];return(0,s.ER)((0,s.Mj)(t).map(t=>t.map(t=>t.map(i))))}(e,w);if(S.fill&&"line"!==y){const e=$?h:d;S.evenodd&&($?m.accent??=[]:m.paths??=[]).push(e.length),e.push(t),C.push("mc-f")}if(S.stroke&&S.width>0){const e=+(S.width*Math.sqrt(Math.abs(w[0]*w[3]-w[1]*w[2]))).toFixed(3);u.push({d:t,width:e,...S.cap?{cap:S.cap}:{},...S.join?{join:S.join}:{},...$?{accent:!0}:{}}),C.push("mc-s")}}}const B=[...t.children].map(t=>W(t,w,M,$,S,a+1)).join("");return`<${y}${f(t,!1,C)}>${B}</${y}>`},B=k(p("transform",i.getAttribute("transform")??"")??null),j=T(i,C),q=[...i.children].map(t=>W(t,B,!0,!1,j,1)).join("");return g?S(M):d.length||h.length||u.length?{markup:`<svg viewBox="${n}"${f(i,!0)}>${q}</svg>`,viewBox:n,paths:d,accentPaths:h,strokes:u,...m.paths||m.accent?{evenodd:m}:{}}:S("The SVG has no shapes to draw.")}i.d(e,["kk",0,M,"lw",0,b])},68(t,e,i){i.d(e,{D:()=>n});var s=i(6752),o=i(7804);class n extends o.WL{constructor(t){if(super(t),this.it=s.s6,t.type!==o.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===s.s6||null==t)return this._t=void 0,this.it=t;if(t===s.c0)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}n.directiveName="unsafeHTML",n.resultType=1;const r=(0,o.u$)(n);i.d(e,["_",0,r])}};