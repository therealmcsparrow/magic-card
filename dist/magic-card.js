(()=>{"use strict";var t={4460(t,e,i){const r=t=>{try{const e=t?.pause_button;return"auto"===e||"always"===e}catch{return!1}};i.d(e,["Mw",0,r,"ZJ",0,t=>{if(!r(t))return;const e=String(t.pause_button_corner);return["bottom-left","bottom-right","top-left","top-right"].includes(e)?e.split("-")[0]:"bottom"},"gO",0,"data-mc-paused","iK",0,"mc-paused:","kc",0,"mc-pause-change"])},6990(t,e,i){i.d(e,["cA",0,["slider_color","track_color","slider_color_to","thumb_border_color"],"z8",0,/^entity(?:\.([a-z0-9_]{1,64}))?(?:\s+(\d+(?:\.\d+)?)%)?$/])},5811(t,e,i){const r=["line_style","dash_length","dash_gap","rail_gap","amplitude","wavelength","electric","tube_tint","bubbles","bubble_count","tube_fill_value","flicker","neon_core","cable_color","twisted","color_mode","color_to","thresholds","start_cap","end_cap","cap_size","shape","shape_icon","shape_icon_rotate","shape_spin","shape_color","shape_alternate","size_variation","spacing_mode","spacing","motion","arrival","arrival_size"];i.d(e,["J_",0,["star","square","diamond","icon"],"_0",0,{lite:3,minimal:6},"aH",0,r,"cN",0,t=>!!t&&r.some(e=>void 0!==t[e])])},7388(t,e,i){i.d(e,["$M",0,["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"],"N$",0,["normal","multiply","screen","overlay","darken","lighten","soft-light"],"cT",0,["top-left","top","top-right"]])},8726(t,e,i){i.d(e,["S",0,"mcu-library-changed"])},6200(t,e,i){const r=["track_style","track_thickness","track_radius","segments","segment_gap","glass_blur","fill_mode","slider_color_to","use_entity_color","show_icon","icon","icon_position","live","thumb","thumb_size","thumb_border","thumb_border_color","thumb_glow","thumb_icon","value_position","ticks","tick_every","show_limits","track_shape","track_shape_options","stops","snap"];i.d(e,["F",0,t=>!!t&&r.some(e=>void 0!==t[e]),"h",0,r])},4753(t,e,i){var r=i(2016);const o=["en-GB","en-US","nl"];let n,s=0;const a={},c=t=>a[t]||=(console.debug("[i18n] "+t),1),d=t=>(0,r.ZV)(n,t),l=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,u=/\{((?:[^{}]|\{[^{}]*\})*)\}/,m=(t,e,i)=>t.split(l).flatMap((t,r)=>{if(!(1&r))return void 0===i?t:t.replace(/#/g,d(i));const n=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(t);if(!n)throw 0;const a=e[n[1]];if(void 0===a&&c("missing "+n[1]),!n[2])return"object"==typeof a?[a]:void 0===a?"":"number"==typeof a?d(a):a;const l=n[3].split(u),h="plural"==n[2],p=t=>l[l.findIndex((e,i)=>!(1&i)&&e.trim()==t)+1||-1],f=p("="+a)??p(h?new Intl.PluralRules(o[s]).select(+a):String(a))??p("other");if(void 0===f)throw 0;return m(f,e,h?+a:void 0)}).filter(String),h=(t,e)=>{const i=[],r=t=>i[t]||=e()[t].split("|");let n;const a=(i,o="",a=s)=>{if(!e())return c("not ready "+t),"";const d="number"==typeof i?i:(n||=new Map(r(0).map((t,e)=>[t,e]))).get(o?o+""+i:i)??-1;return d<0?(c("unknown "+i),String(i)):a&&r(a)[d]||(r(0)[d]??"").slice(o?o.length+1:0)},d=(t,e={},i)=>{try{return m(a(t,i),e)}catch{return c("malformed "+t),[a(t,i,0)]}};return{ns:t,locale:()=>o[s],t:(t,e)=>d(t,e).join(""),tc:(t,e,i)=>d(e,i,t).join(""),tx:(t,e)=>d(t,e),m:t=>t}};i.d(e,["Zc",0,t=>{n=t;const e=(t=>{const e=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((t||"").toLowerCase());return e?"nl"==e[1]?"nl":e[3]?"en-GB":"en-US":"en-GB"})(t?.locale?.language||t?.language||globalThis.navigator?.language);return s=o.indexOf(e),e},"_H",0,(t,e)=>{let i,r;return{...h(t,()=>i),ready:()=>r||=e().then(t=>(i=t.default,!0),()=>(r=void 0,!1))}},"my",0,(t,e)=>h(t,()=>e)])},3098(t,e,i){i.d(e,{EN:()=>m,dU:()=>u,uM:()=>l});var r=i(7423),o=i(3925),n=i(8983);const s={min:0,max:100},a=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},c=(t,e,i)=>Math.min(i,Math.max(e,t)),d=(t,e)=>e>=100?t:`color-mix(in srgb, ${t} ${c(e,0,100)}%, transparent)`;function l(t){if("string"==typeof t&&/^\s*\d*\.?\d+\s*%\s*$/.test(t))return c(parseFloat(t)/100,0,1);const e=a(t);return void 0!==e?c(e>1?e/100:e,0,1):void 0}function u(t,e){const i=(0,o.qB)(t);return i?d((0,o.id)(e)??`var(${o.MZ}, currentColor)`,i.opacity):(0,r.f8)(t)}function m(t,e,i,r){if((0,n.Pd)(t,e))return;const o=(0,n.f4)(t,e),d=a(i)??s.min,l=a(r)??s.max;return void 0!==o&&l!==d?c((o-d)/(l-d),0,1):void 0}i.d(e,["bu",0,a,"jh",0,d,"qE",0,c,"t8",0,s])},3852(t,e,i){i.d(e,{$6:()=>_,IH:()=>f,e5:()=>w,eF:()=>b,jR:()=>y});var r=i(2618),o=i(7804),n=i(7921);let s;const a=new WeakMap,c=new Set,d=new WeakMap,l=new WeakSet,u=new WeakSet,m=new WeakSet;function h(t,e){for(let i=t;i;i=i.parentNode instanceof ShadowRoot?i.parentNode.host:i.parentNode)if(e?i===e:m.has(i))return!0;return!1}function p(t,e){const i=e&&(l.has(t)||!h(t));t.toggleAttribute("offscreen",!i),a.get(t)?.(i)}function f(){if(!s&&"undefined"!=typeof IntersectionObserver){s=new IntersectionObserver(t=>{for(const e of t)d.set(e.target,e.isIntersecting),p(e.target,e.isIntersecting)});const[t,e]=[s.observe.bind(s),s.unobserve.bind(s)];s.observe=e=>{c.add(e),t(e)},s.unobserve=t=>{c.delete(t),d.delete(t),e(t)}}return s}function g(t,e=!0,i=!0){const r=f();return!!r&&(e?l.delete(t):l.add(t),i?u.delete(t):u.add(t),r.observe(t),!0)}function v(t){s?.unobserve(t),t.removeAttribute("offscreen")}function y(t,e,i){return a.set(t,e),g(t,!1!==i?.pausable,!1!==i?.counted)}function b(t){a.delete(t),v(t)}function _(t,e){if(m.has(t)!==e){e?m.add(t):m.delete(t);for(const i of c)!l.has(i)&&h(i,t)&&(e?p(i,!1):d.has(i)&&p(i,d.get(i)))}}function w(t){let e=0;for(const i of c)l.has(i)||u.has(i)||!h(i,t)||e++;return e}class $ extends n.Kq{constructor(t){if(super(t),this._counted=!0,t.type!==o.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(t){return r.s6}update(t,[e]){const i=!1!==e?.counted;var o;return t.element!==this._el?(this._unwatch(),this._el=t.element,this._counted=i,this.isConnected&&g(this._el,!0,i)&&(o=this._el,queueMicrotask(()=>h(o)&&p(o,!1)))):i!==this._counted&&(this._counted=i,this.isConnected&&g(this._el,!0,i)),r.s6}_unwatch(){this._el&&v(this._el)}disconnected(){this._unwatch()}reconnected(){this._el&&g(this._el,!0,this._counted)}}const x=(0,o.u$)($);i.d(e,["Sv",0,x])},7419(t,e,i){i.d(e,{K:()=>a,s:()=>c});var r=i(2618),o=i(8477),n=i(1535),s=i(9486);function a(t){return!!(t&&"object"==typeof t&&(t.fill&&"object"==typeof t.fill||t.device&&"off"!==t.device||t.draw&&"off"!==t.draw||!0===t.morph||t.colors&&"object"==typeof t.colors&&Object.keys(t.colors).length>0))}function c(t){const e="svg"!==t.icon||t.svg?t:{...t,icon:t.fallbackIcon||"mdi:help",useEntityIcon:t.useEntityIcon||!!t.entity},i=e.className??"",c=(0,o.hZ)(e.hass,e.entity,e.iconOn,e.iconOff),d=!c&&!!e.useEntityIcon&&!!e.entity,l=c??(d&&(0,o.fq)(e.hass,e.entity)||e.icon),u="svg"===e.icon&&!!e.svg||!!l?.startsWith("mcu:"),m=e.rig??("icon"===e.part?(0,n.VQ)()?.iconRig:void 0),h=e.part??r.s6,p=()=>c?r.qy`<ha-icon class=${i} data-mc-part=${h} .icon=${c}></ha-icon>`:d?(0,o.TO)(e.hass,e.entity,e.icon??"",i,e.part):r.qy`<ha-icon class=${i} data-mc-part=${h} .icon=${e.icon}></ha-icon>`;if(!a(e.fx)&&!u&&!m)return p();const f=(0,s.H7)();if(f&&!f.ready()){const t=(0,n.VQ)();return f.load(),t?.metChunk?.("svg-icon"),t&&f.whenReady(t.requestUpdate),u?r.qy`<ha-icon class=${i} data-mc-part=${h} .icon=${f.failed()?e.fallbackIcon||"mdi:help":void 0}></ha-icon>`:p()}const g=d&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?e.hass?.states?.[e.entity]:void 0;return r.qy`<mc-svg-icon
    class=${i}
    data-mc-part=${e.part??r.s6}
    style=${e.color?`color: ${e.color}`:r.s6}
    aria-hidden=${e.ariaHidden?"true":r.s6}
    aria-label=${e.ariaLabel||r.s6}
    role=${e.ariaLabel?"img":r.s6}
    .decorative=${!!e.ariaHidden||!!e.ariaLabel}
    .hass=${e.hass}
    .icon=${l}
    .entity=${e.entity}
    .fx=${e.fx}
    .iconOn=${e.iconOn}
    .iconOff=${e.iconOff}
    .svg=${e.svg}
    .fallback=${e.fallbackIcon}
    .kept=${(0,n.VQ)()?.customIcons}
    .stateObj=${g}
    .rig=${m}
  ></mc-svg-icon>`}},5748(t,e,i){i.d(e,{wL:()=>k,bP:()=>u,Ic:()=>m,kk:()=>x});var r=i(2618);const o=[".mc-column",".mc-row",".mc-horizontal",".mc-vertical",".mc-tabs-content",".mc-nested-row"],n=(t,e)=>o.map(i=>`${t}${i}${e}`).join(","),s=".mc-module-wrapper[data-mc-placement=background]",a=`\nha-card[data-mc-layers]{isolation:isolate;display:flex;flex-direction:column}\n.mc-card-content[data-mc-layers]{position:relative;isolation:isolate}\n${n("","[data-mc-layers]")}{position:relative;isolation:isolate}\n.mc-card-content[data-mc-layers]{flex:1 1 auto}\n${n(".mc-card-content[data-mc-flows] ","[data-mc-layers]")}{z-index:1}\nmc-bg-stack,${s},.mc-layer-scrim{position:absolute;top:0;right:0;bottom:0;left:0}\nmc-bg-stack,${s}{z-index:-1;overflow:hidden;border-radius:inherit}\nmc-bg-stack,.mc-layer-scrim{pointer-events:none}\n.mc-bg-badge{position:absolute;top:8px;right:8px;z-index:3;pointer-events:none}\n${s}{--mc-bleed:calc(-3 * var(--mc-layer-blur, 0px))}\n${s}>.mc-module,${s}>.mc-layer-media>.mc-module{height:100%}\n${s}:focus-visible{outline-offset:-2px}\n${s}>.mc-layer-media{position:absolute;top:var(--mc-bleed);right:var(--mc-bleed);bottom:var(--mc-bleed);left:var(--mc-bleed)}\n.mc-module-wrapper[data-mc-placement=overlay]{position:absolute}\n[data-mc-anchor^=top]{top:var(--mc-layer-y)}\n[data-mc-anchor^=bottom]{bottom:var(--mc-layer-y)}\n[data-mc-anchor^=top],[data-mc-anchor^=bottom]{max-height:calc(100% - var(--mc-layer-y))}\n[data-mc-anchor$=left]{left:var(--mc-layer-x)}\n[data-mc-anchor$=right]{right:var(--mc-layer-x)}\n[data-mc-anchor$=left],[data-mc-anchor$=right]{max-width:calc(100% - var(--mc-layer-x))}\n[data-mc-anchor=top],[data-mc-anchor=center],[data-mc-anchor=bottom]{left:var(--mc-layer-x);right:calc(0px - var(--mc-layer-x));margin-left:auto;margin-right:auto;width:-webkit-fit-content;width:fit-content}\n[data-mc-anchor=left],[data-mc-anchor=center],[data-mc-anchor=right]{top:var(--mc-layer-y);bottom:calc(0px - var(--mc-layer-y));margin-top:auto;margin-bottom:auto;height:-webkit-fit-content;height:fit-content}\n.mc-layer-media{position:relative}\n[data-mc-blur]>.mc-layer-media{filter:blur(var(--mc-layer-blur))}\n.mc-layer-scrim{background:var(--mc-scrim);opacity:var(--mc-scrim-opacity, 1)}\n[data-mc-pass]:not([data-mc-path]),[data-mc-pass]:not([data-mc-path]) *{pointer-events:none}\n[data-mc-layers]>.mc-module-wrapper:not([data-mc-placement=background]):focus-within{z-index:50!important}\n[data-mc-layers]>.mc-module-wrapper:not([data-mc-placement]):focus-within{position:relative}\n[data-mc-low-power] .mc-layer-media{filter:none}\n[data-mc-low-power] [data-mc-placement]{mix-blend-mode:normal!important}\n`;var c=i(5746);const d=t=>{const e=t?.placement;return"background"===e||"overlay"===e?e:void 0},l=t=>!!d(t);function u(t,e=new Set){return!(!Array.isArray(t)||e.size>2e3)&&t.some(t=>!e.has(t)&&(e.add(t),l(t)||((0,c.yZ)(t)??[]).some(t=>u(t,e))))}const m=t=>({front:t.map((t,e)=>({child:t,index:e})),backgrounds:[],hoisted:[],layered:!1});var h=i(7388),p=i(7423);const f=/^\s*(-?\d{1,6}(?:\.\d{1,3})?)(px|%)\s*$/,g=t=>t&&"object"==typeof t?t:{},v=(t,e,i,r)=>{const o="string"==typeof t&&t.trim()?+t:t;return"number"==typeof o&&isFinite(o)?Math.min(i,Math.max(e,o)):r},y=(t,e,i)=>t.includes(e)?e:i;function b(t,e){const i="string"==typeof t?f.exec(t):null;return`${+v(i?i[1]:t,e?-1e4:0,1e4,0).toFixed(3)}${i?i[2]:"px"}`}function _(t){const e=g(t),i=(t=>"card"===t.color?"var(--ha-card-background, var(--card-background-color, #fff))":(0,p.f8)(t.color)??"#000")(e),r=["to top","to bottom","to right","to left"][["bottom","top","left","right"].indexOf(e.style)];return r?`linear-gradient(${r}, ${i} 0%, ${i} 35%, transparent 100%)`:i}function w(t,e){const i=d(t);if(!i)return;const r=g(t.layer),o="overlay"===i,n=y(h.$M,o&&r.anchor,"top-left"),s=o||!e.canHoist||"row"!==r.fill&&"card"!==r.fill?"container":r.fill,a="boolean"==typeof r.click_through?r.click_through:!o||!e.hasActions,c=v(r.opacity,0,100,100),l=v(r.blur,0,24,0),u=y(h.N$,r.blend,"normal"),m=r.scrim&&"object"==typeof r.scrim&&!Array.isArray(r.scrim)?r.scrim:void 0,p=m&&_(m),f={"data-mc-placement":i},w=[];return o&&(f["data-mc-anchor"]=n,w.push(`--mc-layer-x:${b(r.offset_x,!/left|right/.test(n))}`,`--mc-layer-y:${b(r.offset_y,!/top|bottom/.test(n))}`)),a&&(f["data-mc-pass"]=""),l>0&&(f["data-mc-blur"]="",w.push(`--mc-layer-blur:${+l.toFixed(2)}px`)),c<100&&w.push("opacity:"+ +(c/100).toFixed(2)),"normal"!==u&&w.push(`mix-blend-mode:${u}`),o&&w.push(`z-index:${2+Math.trunc(v(e.overlayRank,0,40,0))}`),m&&w.push(`--mc-scrim:${p}`,`--mc-scrim-opacity:${(t=>+(v(g(t).strength,0,90,60)/100).toFixed(2))(m)}`),{placement:i,fill:s,anchor:n,clickThrough:a,attrs:f,style:w.join(";"),media:l>0||!!m,scrim:p}}let $={resolveLayer:w,arrange:function(t,e){if(!t.some(l))return{front:t.map((t,e)=>({child:t,index:e})),backgrounds:[],hoisted:[],layered:!1};let i=0;const r=t=>!!t&&!e.hidden(t),o=t.map((t,o)=>{const n="overlay"===d(t)?i++:0;let s=r(t)?w(t,{canHoist:e.canHoist,overlayRank:n,hasActions:e.hasActions(t)}):void 0;return("row"===s?.fill&&!1===e.rowHasFlow||"card"===s?.fill&&!1===e.cardHasFlow)&&(s=void 0),{child:t,index:o,layer:s}}),n=o.filter(t=>t.layer&&"container"!==t.layer.fill),s=o.filter(t=>t.layer&&"container"===t.layer.fill);if(!o.some(t=>!t.layer&&r(t.child)))for(const t of s)t.layer=void 0;const a=s.filter(t=>t.layer),c=t=>h.$M.indexOf(t.layer.anchor),u=a.filter(t=>"overlay"===t.layer.placement).sort((t,e)=>c(t)-c(e));return{front:[...u.filter(t=>h.cT.includes(t.layer.anchor)),...o.filter(t=>!t.layer),...u.filter(t=>!h.cT.includes(t.layer.anchor))],backgrounds:a.filter(t=>"background"===t.layer.placement),hoisted:n,layered:a.length>0}},scanFills:function(t,e){const i={flow:!1,row:!1,card:!1};for(const r of t)for(const t of Array.isArray(r)?r:[]){if(!t||e(t))continue;const r="background"===d(t)?g(t.layer).fill:void 0;d(t)?"row"!==r&&"card"!==r||(i[r]=!0):i.flow=!0}return i},scrimCss:_,css:a};const x={provide:t=>{$=t},get:()=>$},k=r.AH`
.mc-card-content[data-mc-clip]{position:relative}
`},6901(t,e,i){i.d(e,{JJ:()=>n});const r=new Set;let o;function n(t){o=t,t&&r.forEach(t=>t.fxOn())}i.d(e,["G6",0,()=>o,"wQ",0,r])},5280(t,e,i){i.d(e,{XJ:()=>l,dD:()=>b,eP:()=>o.e,ey:()=>m,hQ:()=>_,kz:()=>u,xc:()=>y,zN:()=>d});var r=i(9136),o=i(4445),n=i(7423),s=i(7388);const a=new Set(["__proto__","constructor","prototype"]),c=(t,e,i,r)=>{const o="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof o&&Number.isFinite(o)?Math.min(i,Math.max(e,o)):r};function d(t){return`url("${t.replace(/["\\\n\r]/g,encodeURIComponent)}")`}function l(t){const e=Object.create(null);if(!t||"object"!=typeof t||Array.isArray(t))return e;let i=0;for(const r in t){if(!Object.prototype.hasOwnProperty.call(t,r)||a.has(r))continue;if(++i>32)break;const o=t[r];"string"==typeof o&&(e[r]=o)}return e}function u(t){if("string"!=typeof t||t.length>600)return;const e=(0,r.wb)(t),i=(0,r.gO)(t);if(!e||!e.radial&&(void 0===i||!Number.isFinite(i)))return;const o=e.stops.join(",");return e.radial?`radial-gradient(circle,${o})`:`linear-gradient(${i}deg,${o})`}function m(t,e,i,r){const o=Math.round(c(e,4,64,16)),s=Math.round(c(i,1,8,"dots"===t||"checks"===t?2:1)),a=(0,n.f8)(r)??"rgba(128, 128, 128, 0.4)",d=`${o}px ${o}px`;switch(t){case"dots":return{image:`radial-gradient(circle at 50% 50%,${a} 0,${a} ${s}px,transparent ${s+1}px)`,size:d};case"grid":return{image:`linear-gradient(to right,${a} ${s}px,transparent ${s}px),linear-gradient(to bottom,${a} ${s}px,transparent ${s}px)`,size:d};case"lines":return{image:`linear-gradient(to bottom,${a} ${s}px,transparent ${s}px)`,size:d};case"diagonal":return{image:`repeating-linear-gradient(45deg,${a} 0,${a} ${s}px,transparent ${s}px,transparent ${o}px)`,size:d};default:return{image:`conic-gradient(${a} 25%,transparent 0 50%,${a} 0 75%,transparent 0)`,size:d}}}const h=t=>{const e=s.$M.indexOf(t);return[e%3-1,Math.floor(e/3)-1]},p=t=>"string"==typeof t&&s.$M.includes(t),f=["left","center","right"],g=["top","center","bottom"],v=/^\s*(-?\d{1,4}(?:\.\d{1,3})?)%\s+(-?\d{1,4}(?:\.\d{1,3})?)%\s*$/;function y(t){if(p(t)){const[e,i]=h(t);return 0===e&&0===i?"center":`${f[e+1]} ${g[i+1]}`}const e="string"==typeof t?v.exec(t):null;return e?`${c(e[1],0,100,50)}% ${c(e[2],0,100,50)}%`:"center"}function b(t){if("cover"===t||"contain"===t||"auto"===t)return t;if("number"==typeof t)return`${c(t,1,400,100)}%`;const e="string"==typeof t?/^\s*(\d{1,5}(?:\.\d{1,3})?)%\s*$/.exec(t):null;return e?`${c(e[1],1,400,100)}%`:"cover"}function _(t,e){return"cover"===e?"no-repeat":"repeat"===t||"repeat-x"===t||"repeat-y"===t?t:"no-repeat"}i.d(e,["Jl",0,h,"bu",0,c,"jQ",0,t=>c(t,0,100,100)/100,"m4",0,p,"zt",0,t=>c(t,0,24,0)])},765(t,e,i){i.d(e,{_:()=>l,p:()=>c});var r=i(7526),o=i(3686);const n=new Set(["entity","entity_id","entities","trigger_entity"]),s=/^[a-z0-9_]+\.[a-z0-9_]+$/;let a=new WeakMap;function c(){a=new WeakMap}function d(t,e){if("string"==typeof t)for(const i of t.split(",")){const t=i.trim();s.test(t)&&e.add(t)}else if(Array.isArray(t))for(const i of t)"string"==typeof i&&d(i,e)}function l(t,e={editMode:!1}){const i=e.editMode?"edit":"view",s=a.get(t)?.[i];if(s)return s;const c=new Set;let l,u=!1;const m=t=>{t&&t>0&&(l=void 0===l?t:Math.min(l,t))},h=new Set,p=(t,i=!1,s,a=!1)=>{if(!t||"object"!=typeof t||h.has(t))return;if(h.add(t),Array.isArray(t)){for(const e of t)p(e,i,s,a);return}const l=t,f=i||"string"!=typeof l.type?void 0:r.s.get(l.type),g=f||a?(0,o.Xu)(l,s):s;for(const[t,e]of Object.entries(l))n.has(t)&&d(e,c),e&&"object"==typeof e&&p(e,i||"card_config"===t,g,"rows"===t||"columns"===t);if("time"===l.type&&("after"in l||"before"in l)&&m(6e4),"daynight"===l.preset&&c.add("sun.sun"),f){const t=(0,o.hY)(l,s,f.metadata.inherit),i=f.getDependencies?.((l.entity||void 0)===t?l:{...l,entity:t},e);i&&(i.entities?.forEach(t=>c.add(t)),m(i.refreshInterval),i.forwardHass&&(u=!0))}};p(t,!1,(0,o.hY)(t,void 0));const f={entities:[...c],refreshInterval:l,forwardHass:u};return a.set(t,{...a.get(t),[i]:f}),f}},213(t,e,i){i.d(e,{g:()=>s});var r=i(1535),o=i(8816),n=i(3686);class s{static evaluate(t,e){if(!t?.conditions?.length)return!0;if(!e)return!0;const i=t.conditions.map(t=>s.evaluateCondition(t,e));return"any"===t.mode?i.some(Boolean):i.every(Boolean)}static isComplete(t){if(!t||"object"!=typeof t)return!1;switch(t.type){case"state":return!!t.entity?.trim();case"attribute":return!!t.entity?.trim()&&!!t.attribute?.trim();case"template":return!!t.template?.trim();case"time":return!!t.after?.trim()||!!t.before?.trim();default:return!1}}static ruleMatches(t,e){const i=t.conditions;return!!(Array.isArray(i)&&i.length&&i.every(t=>s.isComplete(t)))&&s.evaluate({conditions:i,mode:t.mode},e)}static evaluateCondition(t,e){switch(t.type){case"state":return s.evaluateStateCondition(t,e);case"attribute":return s.evaluateAttributeCondition(t,e);case"time":return s.evaluateTimeCondition(t);case"template":return s.evaluateTemplateCondition(t);default:return!0}}static evaluateTemplateCondition(t){if(!t.template?.trim())return!0;const e=(0,r.VQ)(),i=e?.template(t.template,(0,n.xw)(t.template,e.entity,e.cardEntity));return"ok"===i?.status&&(0,o.Ew)(i.result)}static evaluateStateCondition(t,e){if(!t.entity)return!0;const i=e.states[t.entity];if(!i)return!1;const r=i.state;if(void 0!==t.state&&""!==t.state)return r===t.state;if(void 0!==t.state_not&&""!==t.state_not)return r!==t.state_not;const o=Number(r);if(!isNaN(o)){if(void 0!==t.above&&o<=t.above)return!1;if(void 0!==t.below&&o>=t.below)return!1}return!0}static evaluateAttributeCondition(t,e){if(!t.entity||!t.attribute)return!0;const i=e.states[t.entity];if(!i)return!1;const r=String(i.attributes[t.attribute]??"");if(void 0!==t.state&&""!==t.state)return r===t.state;if(void 0!==t.state_not&&""!==t.state_not)return r!==t.state_not;const o=Number(r);if(!isNaN(o)){if(void 0!==t.above&&o<=t.above)return!1;if(void 0!==t.below&&o>=t.below)return!1}return!0}static evaluateTimeCondition(t){const e=new Date,i=60*e.getHours()+e.getMinutes();if(t.after){const e=t.after.split(":").map(Number);if(e.length>=2&&i<60*e[0]+e[1])return!1}if(t.before){const e=t.before.split(":").map(Number);if(e.length>=2&&i>=60*e[0]+e[1])return!1}return!0}}},4802(t,e,i){i.d(e,{JK:()=>u,Jd:()=>l,S5:()=>m,pz:()=>c});const r=new Map,o=new Map;function n(t,e){for(const[t,i]of r)e.timestamp-i.timestamp>6e5&&r.delete(t);r.set(t,e)}const s=(t,e,i)=>`${t}|${e}|${i||""}`;function a(t,e,i){const r=[];for(const o of t){const t=e?o.a?.[e]:o.s,n="number"==typeof t?t:"string"==typeof t&&t.trim()?Number(t):NaN;if(!Number.isFinite(n))continue;const s=o.lu??o.lc,a="number"==typeof s&&Number.isFinite(s)?Math.max(1e3*s,i):i;r.push({t:a,v:n})}return r.sort((t,e)=>t.t-e.t)}function c(t,e,i,r){return r>=1&&i>e&&t.length?d(t,e,i,(i-e)/Math.floor(r),Math.floor(r)):[]}function d(t,e,i,r,o){const n=[];let s,a=0;for(let c=0;c<o;c++){const d=e+c*r,l=c===o-1?1/0:d+r;let u=0,m=0;for(;a<t.length&&t[a].t<l;)t[a].t>=d&&(u+=t[a].v,m++),s=t[a].v,a++;const h=m?u/m:s;void 0!==h&&n.push({t:Math.min(d+r/2,i),v:h})}return n}function l(t,e,i,r){if(!(r>0)||i<=e||!t.length)return t;const o=36e5/r;return d(t,e,i,o,Math.max(1,Math.ceil((i-e)/o)))}function u(t,e,i,c,d){const l=s(e,i,c||void 0),u=r.get(l);return u&&Date.now()-u.timestamp<=3e5||function(t,e,i,s,c,d){const l=o.get(e);if(l)return void(d&&l.add(d));o.set(e,new Set(d?[d]:[]));const u=new Date,m=new Date(u.getTime()-36e5*s);Promise.resolve().then(()=>t.callWS(function(t,e,i,r){return{type:"history/history_during_period",start_time:e.toISOString(),end_time:i.toISOString(),entity_ids:[t],include_start_time_state:!0,minimal_response:!r,no_attributes:!r,significant_changes_only:!r}}(i,m,u,c))).then(t=>{const r=t&&t[i]||[];n(e,{samples:a(r,c,m.getTime()),timestamp:Date.now()})}).catch(t=>{console.warn("magic-card: failed to fetch history for",i,t),n(e,{samples:r.get(e)?.samples??[],timestamp:Date.now(),error:!0})}).finally(()=>{const t=o.get(e);o.delete(e),t?.forEach(t=>t())})}(t,l,e,i,c||void 0,d),u}function m(t,e,i){return r.get(s(t,e,i||void 0))}},7924(t,e,i){i.d(e,{By:()=>p,J2:()=>f,RW:()=>c,fk:()=>a,i$:()=>s,yl:()=>u});const r="media-source://",o=/^url\(\s*(['"]?)(.*?)\1\s*\)$/i,n=3e4;function s(t){const e=t.trim(),i=e.match(o);return i?i[2].trim():e}function a(t){if("string"!=typeof t)return;const e=s(t);if(e.startsWith(r))return e;if(!e.startsWith("/")||e.startsWith("//")||!/[?&]authSig=/.test(e))return;const i=e.split(/[?#]/)[0].match(/^\/media\/([^/]+)\/(.+)$/);if(i)try{const t=i[2].split("/").map(decodeURIComponent).join("/");return`${r}media_source/${decodeURIComponent(i[1])}/${t}`}catch{return}}function c(t,e){if(!/[?&]authSig=/.test(t)||!/[?&]authSig=/.test(e))return!1;const i=t=>t.replace(/([?&])authSig=[^&#]*&?/,"$1").replace(/[?&]$/,"");return i(t)===i(e)}const d=new Map,l=new Map;function u(t){const e=d.get(t);return e?.url&&Date.now()<e.validUntil?e.url:void 0}function m(t,e){void 0!==e.timer&&clearTimeout(e.timer),e.timer=void 0,e.url&&l.get(t)?.size&&(e.timer=setTimeout(()=>{e.timer=void 0,l.get(t)?.size&&e.callWS&&h(t,e.callWS)},Math.max(0,e.refreshAt-Date.now())))}function h(t,e){let i=d.get(t);if(i||(i={validUntil:0,refreshAt:0},d.set(t,i)),i.callWS=e,i.inflight)return;const o=i;o.inflight=Promise.resolve().then(()=>e({type:"media_source/resolve_media",media_content_id:t})).then(t=>{const e=t?.url;if("string"!=typeof e||!e||e.startsWith(r))throw new Error("no url");const i=Date.now(),s=function(t){const e=/[?&]authSig=([^&#]+)/.exec(t)?.[1],i=e?.split(".")[1];if(!i)return n;try{const t=JSON.parse(atob(i.replace(/-/g,"+").replace(/_/g,"/"))),e=Number(t.exp)-Number(t.iat);return Number.isFinite(e)&&e>0?1e3*e:n}catch{return n}}(e);o.url=e,o.validUntil=i+s,o.refreshAt=i+Math.max(5e3,s-5e3)}).catch(()=>{o.url=void 0,o.validUntil=0,o.refreshAt=Date.now()+6e4}).finally(()=>{o.inflight=void 0,m(t,o),function(t){for(const e of l.get(t)??[])e.changed()}(t)})}function p(t){const e=d.get(t);if(!e?.callWS||e.inflight)return;const i=Date.now();void 0!==e.lastErrorRetry&&i-e.lastErrorRetry<1e4||(e.lastErrorRetry=i,h(t,e.callWS))}class f{constructor(t,e){this._requestUpdate=t,this._hass=e,this._ids=new Set,this._wanted=null,this._connected=!1,this._onReady=()=>{const t=this._callWS();if(t)for(const e of this._ids)h(e,t)}}changed(){this._connected&&this._requestUpdate()}begin(){this._wanted=new Set}get(t){return this._wanted?.add(t),u(t)}end(){const t=this._wanted;if(this._wanted=null,t){for(const e of this._ids)t.has(e)||this._unwatch(e);this._ids=t,this._connected&&this._watchAll()}}hostConnected(){this._connected=!0,this._watchAll()}hostDisconnected(){this._connected=!1;for(const t of this._ids)this._unwatch(t);this._listenReady(void 0)}_callWS(){const t=this._hass();return t?.callWS?e=>t.callWS(e):void 0}_watchAll(){const t=this._callWS();this._listenReady(this._hass()?.connection);for(const e of this._ids){let i=l.get(e);i||l.set(e,i=new Set);const r=!i.has(this);i.add(this);const o=d.get(e);!o||!o.inflight&&Date.now()>=o.refreshAt?t&&h(e,t):r&&void 0===o.timer&&m(e,o)}}_unwatch(t){const e=l.get(t);if(e?.delete(this),e&&!e.size){l.delete(t);const e=d.get(t);void 0!==e?.timer&&clearTimeout(e.timer),e&&(e.timer=void 0)}}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}}},1535(t,e,i){let r,o;function n(t,e){const i=r,n=o;r=t,n||(o={});try{return e()}finally{r=i,o=n}}function s(){return o}function a(){return r}i.d(e,{J3:()=>s,VQ:()=>a,cb:()=>n})},8816(t,e,i){i.d(e,{C3:()=>n,Ew:()=>s,L3:()=>o,XM:()=>a});const r=new Map;function o(t){return/\{\{|\{%|\{#/.test(t)}function n(t){if(null==t)return"";if("string"==typeof t)return t;if("object"==typeof t)try{return JSON.stringify(t)}catch{return String(t)}return String(t)}function s(t){if("boolean"==typeof t)return t;if("number"==typeof t)return 0!==t&&!Number.isNaN(t);if("string"!=typeof t)return!1;const e=t.trim().toLowerCase();return!!["true","yes","on","enable"].includes(e)||""!==e&&!Number.isNaN(Number(e))&&0!==Number(e)}class a{constructor(t,e,i=50){this._requestUpdate=t,this._connection=e,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const t of this._subs.values())t.failed=!1;if(this._connected)for(const[t,e]of this._subs)this._subscribe(t,e)}}begin(){this._wanted=new Set,this._dirty=!1}get(t,e){const i=function(t,e){return e&&Object.keys(e).length?`${t}\0${JSON.stringify(e)}`:t}(t,e);this._wanted?.add(i);let o=this._subs.get(i);return o||(o={template:t,variables:e,state:r.get(i)??{status:"pending"}},this._connection()?.subscribeMessage||(o.state={status:"unavailable"}),this._subs.set(i,o)),o.state}end(){const t=this._wanted;if(this._wanted=null,t)for(const[e,i]of this._subs)t.has(e)?this._connected&&this._subscribe(e,i):(this._unsubscribe(i),this._subs.delete(e))}hostConnected(){this._connected=!0;for(const[t,e]of this._subs)e.failed=!1,this._subscribe(t,e);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const t of this._subs.values())this._unsubscribe(t);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(t=>t.active).length}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(t,e){if(e.active||e.failed)return;const i=this._connection();if(!i?.subscribeMessage)return void this._set(t,e,{status:"unavailable"});this._listenReady(i),"unavailable"===e.state.status&&(e.state=r.get(t)??{status:"pending"});const o={type:"render_template",template:e.template,report_errors:!0};e.variables&&(o.variables=e.variables);const n={};e.token=n;const s=()=>e.token===n,a=i.subscribeMessage(i=>{if(s())if(i&&"object"==typeof i&&"error"in i&&void 0!==i.error){if("WARNING"===i.level)return;this._set(t,e,{status:"error",error:String(i.error)})}else this._set(t,e,{status:"ok",result:i?.result})},o);e.active=Promise.resolve(a).then(t=>t).catch(i=>{if(s()){e.active=void 0,e.token=void 0,e.failed=!0;const r=String(i&&"object"==typeof i&&"message"in i?i.message:i);this._set(t,e,{status:"error",error:r})}})}_unsubscribe(t){const e=t.active;t.active=void 0,t.token=void 0,e&&e.then(t=>{try{t?.()}catch{}})}_set(t,e,i){var o,n;n=i,(o=e.state).status===n.status&&("ok"===o.status&&"ok"===n.status?o.result===n.result||"object"==typeof o.result&&JSON.stringify(o.result)===JSON.stringify(n.result):"error"!==o.status||"error"!==n.status||o.error===n.error)||(e.state=i,function(t,e){"ok"===e.status&&(r.delete(t),r.set(t,e),r.size>300&&r.delete(r.keys().next().value))}(t,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}},9777(t,e,i){function r(t,e){if(!t||"object"!=typeof t||!t.action||"none"===t.action)return!1;const i=t=>"string"==typeof t&&""!==t.trim();switch(t.action){case"navigate":return i(t.navigation_path);case"url":return i(t.url_path);case"perform-action":return i(t.service);case"toggle":case"more-info":return i(t.entity)||!1!==t.use_module_entity&&i(e);case"popup":return i(t.hash);default:return!0}}i.d(e,{Q:()=>r})},5556(t,e,i){i.d(e,{E0:()=>o,RM:()=>a,T_:()=>c,pg:()=>n,tz:()=>s});const r={epoch:0,failedSims:new Set};function o(t,e){r.particles=t,r.checkSim=e,r.epoch++}function n(t){r.v2=t}function s(t){r.simValidator=t}function a(t){r.library=t}function c(){const t=r.library;if(!t)throw new Error("the animation library has not loaded");return t}i.d(e,["CO",0,r,"ar",0,t=>{r.failedSims.add(t)}])},7050(t,e,i){let r,o;function n(){return r?o??=r.load().then(t=>(t||(o=void 0),t?r.module():void 0)):Promise.resolve(void 0)}i.d(e,{BR:()=>n}),i.d(e,["Hy",0,t=>{r=t},"PT",0,()=>r?.module()])},4634(t,e,i){i.d(e,{o:()=>a});const r="(\\d+(?:\\.\\d+)?|\\.\\d+)",o=new RegExp(`^${r}\\s*[:/x×]\\s*${r}$`,"i"),n=new RegExp(`^${r}$`),s=new RegExp(`^${r}\\s*%$`);function a(t,e="16 / 9"){if("number"==typeof t)return Number.isFinite(t)&&t>0?String(t):e;if("string"!=typeof t)return e;const i=t.trim();let r=o.exec(i);if(r){const t=Number(r[1]),i=Number(r[2]);return t>0&&i>0?`${t} / ${i}`:e}return r=n.exec(i),r?Number(r[1])>0?String(Number(r[1])):e:(r=s.exec(i),r&&Number(r[1])>0?`100 / ${Number(r[1])}`:e)}},1235(t,e,i){i.d(e,{t:()=>o});const r="2026.10.12-beta.11";function o(t,e){if(e?.BUILD===r)return e;console.warn(`Magic Card was updated, reload the page (magic-card.js ${r}, ${t} ${String(e?.BUILD)}).`)}i.d(e,["Q",0,r])},403(t,e,i){i.d(e,{N:()=>h});var r=i(2522),o=i(7423);const n="var(--mc-bi-gap,var(--mc-gap-sm))",s=new Map([["left",["2/1/4/2",3]],["right",["2/4/4/5",2]],["above",["1/2/2/4",1]],["below",["4/2/5/4",0]]]),a=new Set(["start","center","end"]),c=[["icon_gap","--mc-bi-gap"],["icon_size","--mc-button-icon-size"],["label_font_size","--mc-bl-fs",!0],["state_font_size","--mc-bs-fs",!0]],d=[["label_font_weight",/^(?:normal|bold|lighter|bolder|[1-9]00)$/,"--mc-bl-fw"],["label_text_transform",/^(?:none|uppercase|lowercase|capitalize)$/,"--mc-bl-tt"]],l=[["icon_color","--mc-bi-c"],["label_color","--mc-bl-c"],["state_color","--mc-bs-c"],["icon_background","--mc-bi-bg"]],u=/^(?:[\w -]+|"[\w -]+"|'[\w -]+')$/,m=t=>("number"==typeof t?String(t):(0,o.gx)(t))??"";function h(t){const e=[],i=s.get(m(t.icon_position)),r=m(t.content_align),h=m(t.content_vertical_align),p=m(t.state_position);if(i||a.has(r)||a.has(h)||"beside"===p||"below"===p){const[t,o]=i??s.get("left");e.push("--mc-bi-d:inline-grid","--mc-bi-g0:0","--mc-bl-a:2/2",`--mc-bi-ac:${a.has(h)?h:"center"}`,`--mc-bi-ji:${a.has(r)?r:"center"}`),a.has(r)&&e.push(`--mc-bi-jc:${r}`),e.push("--mc-bs-a:"+("below"===p?"3/2":"2/3"),"--mc-bs-mt:"+("below"===p?"2px":"0"),`--mc-bs-ms:${"below"===p?"0":n}`,`--mc-bi-ia:${t}`),["t","b","s","e"].forEach((t,i)=>e.push(`--mc-bi-m${t}:${i===o?n:"0"}`))}for(const[i,r,n]of c){const s=(0,o.VC)(t[i],1);!s||!n&&s.includes("%")||e.push(`${r}:${s}`)}const f=m(t.label_overflow);"truncate"===f?e.push("--mc-bl-ws:nowrap","--mc-bl-ov:hidden","--mc-bl-to:ellipsis","--mc-bi-mw:0","--mc-bl-mxw:100%","--mc-bi-fs:0"):"wrap"===f&&e.push("--mc-bl-ws:normal");for(const[i,r]of l){const n=(0,o.f8)(t[i]);n&&(e.push(`${r}:${n}`),"icon_color"===i&&e.push("--icon-primary-color:currentColor"),"icon_background"===i&&e.push("--mc-bi-pad:calc(var(--mc-button-icon-size) *.3)","--mc-bi-br:"+("rounded"===m(t.icon_background_shape)?"25%":"50%")))}for(const[i,r,o]of d){const n=m(t[i]);r.test(n)&&e.push(`${o}:${n}`)}const g=(0,o.gx)(t.label_font_family),v=g&&g.length<=128?g.split(",").map(t=>t.trim()):[];return v.length&&v.every(t=>u.test(t))&&e.push(`--mc-bl-ff:${v.join(", ")}`),e}i.d(e,["w",0,t=>(0,r.P)(t,t=>"truncate"===t.label_overflow)])},4334(t,e,i){i.d(e,{IC:()=>s,_Y:()=>a,cy:()=>n});var r=i(9851);let o=null;function n(){const t=window.loadCardHelpers;if("function"==typeof t)return o||(o=Promise.resolve(t()).catch(t=>{throw o=null,t})),o}function s(t){if(customElements.get(t))return Promise.resolve();let e;return Promise.race([customElements.whenDefined(t),new Promise((i,o)=>{e=setTimeout(()=>o(new Error((0,r.t)(57,{tag:t}))),5e3)})]).finally(()=>clearTimeout(e))}function a(t){const e=t=>Array.isArray(t)?t.map(e):t&&"object"==typeof t?Object.fromEntries(Object.keys(t).sort().map(i=>[i,e(t[i])])):t;return JSON.stringify(e(t))??""}i.d(e,["k2",0,(t,e)=>({...e||{},type:t})])},4240(t,e,i){function r(t,e){if(void 0===t||!Number.isFinite(t)||!Array.isArray(e))return;let i;for(const r of e){if(!r||"string"!=typeof r.color||!r.color)continue;const e=Number(r.from);!Number.isFinite(e)||t<e||void 0!==r.to&&null!==r.to&&Number.isFinite(Number(r.to))&&t>Number(r.to)||(!i||e>Number(i.from))&&(i=r)}return i?.color}i.d(e,{r:()=>r})},8590(t,e,i){i.d(e,{$t:()=>l,C6:()=>s,Hi:()=>h,JR:()=>u,M0:()=>c,SU:()=>a,U$:()=>m,W8:()=>n,gp:()=>d});var r=i(757);const o=/^((?:\d+\.?\d*|\.\d+))(fr|%|px)$/;function n(t){if("number"==typeof t)return Number.isFinite(t)&&t>0?`${t}fr`:null;if("string"!=typeof t)return null;const e=t.trim().toLowerCase();if("auto"===e)return"auto";const i=e.match(o);if(!i)return null;const r=Number(i[1]);return!Number.isFinite(r)||r<0||"fr"===i[2]&&0===r?null:`${r}${i[2]}`}function s(t){const e=n(t)??"1fr";if("auto"===e)return{value:0,unit:"auto"};const i=e.match(o);return{value:Number(i[1]),unit:i[2]}}function a(t){return Array.isArray(t?.column_widths)&&t.column_widths.length>0}function c(t,e){const i=Array.isArray(t)?t:[];return Array.from({length:Math.max(e,1)},(t,e)=>n(i[e])??"1fr")}function d(t,e){return c(t,e).join(" ")}function l(t,e){const i=t.columns?.length||1;return a(t)?d(t.column_widths,i):(0,r.aA)(t.layout||e,i)}function u(t){const e=t.columns?.length||1;return a(t)?c(t.column_widths,e):function(t,e){if(!t||/^\d+(?:-\d+)*$/.test(t))return null;const i=t.trim().split(/\s+/).map(n);return i.length===e&&i.every(t=>null!==t)?i:null}(t.layout,e)??function(t,e){if(t&&/^\d+(?:-\d+)*$/.test(t)){const i=t.split("-").map(t=>Math.max(Number(t)||1,1));if(i.length===e)return i}return Array.from({length:Math.max(e,1)},()=>1)}(t.layout,e).map(t=>`${t}fr`)}function m(t,e=360){const i=t.map(s);if(i.every(t=>"fr"===t.unit))return i.map(t=>t.value);let r=0,o=0;for(const t of i)"px"===t.unit?r+=t.value:"%"===t.unit?r+=t.value/100*e:o+="fr"===t.unit?t.value:1;const n=o>0?Math.max(e-r,.1*e*o)/o:0;return i.map(t=>{const i="px"===t.unit?t.value:"%"===t.unit?t.value/100*e:("fr"===t.unit?t.value:1)*n;return Math.max(i,.02*e)})}function h(t,e,i){const r=Math.max(e.split("-").length,1);for(;t.columns.length<r;)t.columns.push(i());for(;t.columns.length>r;){const e=t.columns.pop(),i=t.columns[t.columns.length-1];i.modules=[...i.modules||[],...e.modules||[]]}t.layout=e,delete t.column_widths}},2522(t,e,i){function r(t,e,i=[]){const r=new Set,o=t=>{if(!t||"object"!=typeof t||r.has(t))return!1;if(r.add(t),Array.isArray(t))return t.some(o);const n=t;return!!e(n)||Object.keys(n).some(t=>"card_config"!==t&&!i.includes(t)&&o("conditional_appearance"===t&&Array.isArray(n[t])?n[t].slice(0,32):n[t]))};try{return o(t)}catch{return!1}}i.d(e,{P:()=>r})},9095(t,e,i){i.d(e,["Kd",0,"var(--mc-gap)","Mp",0,"magic-card","cq",0,["content","controls","layout","advanced"],"d5",0,"Magic Card","uh",0,"A fully open-source multi-module card with advanced editor","z",0,"magic-card-editor"])},939(t,e,i){i.d(e,{$q:()=>c,I7:()=>s});const r=t=>t.replace(/_/g,"-"),o={margin:["top","right","bottom","left"].map(t=>({key:`margin_${t}`,cssProperty:`margin-${t}`})),padding:["top","right","bottom","left"].map(t=>({key:`padding_${t}`,cssProperty:`padding-${t}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(t=>({key:`border_${t}_radius`,cssProperty:`border-${t.replace("_","-")}-radius`}))},n={shape:["shape_options"],top:["right","bottom","left"]};function s(t){return[t,...(o[t]||[]).map(t=>t.key),...n[t]||[]]}const a="margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap background background_color:c background_image:i background_position background_size background_repeat background_attachment background_clip background_origin backdrop_filter flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction animation_fill_mode animation_play_state filter list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side".split(" ").map(t=>{const[e,i=""]=t.split(":");return{key:e,flag:i}});function c(){const t={};for(const{key:e}of a){t[e]=r(e);for(const i of o[e]||[])t[i.key]=i.cssProperty}return t}const d=[...a.filter(t=>"c"===t.flag).map(t=>t.key),"icon_color","icon_background","label_color","state_color"],l=new Set(a.filter(t=>"i"===t.flag).map(t=>t.key)),u=Object.fromEntries(a.filter(t=>"p"===t.flag||"s"===t.flag).flatMap(t=>{const e="s"===t.flag?"s":"px";return[[t.key,e],...(o[t.key]||[]).map(t=>[t.key,e])]}));i.d(e,["D$",0,d,"KS",0,u,"Xr",0,o,"jw",0,l])},757(t,e,i){i.d(e,{AT:()=>G,DA:()=>Y,ID:()=>f,Q6:()=>E,Rn:()=>q,VR:()=>N,a7:()=>X,aA:()=>O,eI:()=>Z,fV:()=>K,li:()=>z,nl:()=>w,th:()=>g,zg:()=>$});var r=i(939),o=i(213),n=i(3925),s=i(9136),a=i(7110),c=i(403),d=i(5792);const l=(0,r.$q)(),u=/(?<![\w-])entity(?: \d+(?:\.\d+)?%)?(?![\w-])/g;function m(t){const e="string"==typeof t&&t.length<=256?t.replace(u,t=>(0,n.a0)(t)??t):t;return e===t?void 0:e}const h={...r.KS,border_length:"%"};function p(t){if(!t)return t;const e=t;let i;for(const[t,r]of Object.entries(e))"number"==typeof r&&(i??={...e},Number.isFinite(r)?i[t]=`${r}${h[t]??""}`:delete i[t]);return i??t}function f(t){if(!t)return t;const e=t;let i;for(const t of r.D$){const r=m(e[t]);r&&((i??={...e})[t]=r)}return Array.isArray(e.animations)&&e.animations.some(t=>(0,n.ls)(t?.color))&&((i??={...e}).animations=e.animations.map(t=>(0,n.ls)(t?.color)?{...t,color:(0,n.a0)(t.color)}:t)),i??t}function g(t){if(!t)return!1;const e=t;if(r.D$.some(t=>m(e[t])))return!0;if(Array.isArray(e.animations)&&e.animations.some(t=>(0,n.ls)(t?.color)))return!0;const i=e.ring;return!(!i||!(0,n.ls)(i.color)&&!(0,n.ls)(i.track_color))||!(!e.hover||!g(e.hover))||Array.isArray(e.conditional)&&e.conditional.some(t=>g(t?.design))}const v=["border_width","border_style","border_color"],y=["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color"],b={w:"0",s:"none",c:"currentColor"},_=new Set([...y,"box_shadow"]);function w(t,e){return"dropdown"===t?{w:"1px",s:"solid",c:"var(--mc-border)"}:"button"===t?"outline"===e?{w:"1px",s:"solid",c:"var(--mc-button-color)"}:b:void 0}function $(t,e,i,o){if(!t)return"";const n=f(p(t)),d=[],u=n,m=(0,s.wb)(n.color)?.stops[0];for(const[t,i]of Object.entries(l)){if(e&&_.has(t)||o&&(C(t)||v.includes(t)))continue;let n=m&&"color"===t?m:u[t];"string"==typeof n&&r.jw.has(t)&&(n=(0,a.zi)(void 0,n)),void 0!==n&&"string"==typeof n&&""!==n&&d.push(`${i}: ${n}`)}const h=e||o?void 0:function(t){if(A(t.border_style))return;const e=B(t);if(!D.some(t=>e[t].widthSet&&!e[t].styleSet))return;const i=D.map(t=>e[t].style);return i.every(t=>t===i[0])?i[0]:i.join(" ")}(u);h&&d.push(`border-style: ${h}`),o||"string"!=typeof n.color||""===n.color||(d.push(`--mc-design-color: ${m??n.color}`),m&&d.push(`--mc-text-paint: ${n.color}`),d.push("--icon-primary-color: currentColor"));const g=function(t){const e={},i=A(t.border_radius);if(i){const t=i.indexOf("/"),r=M(t>=0?i.slice(0,t):i),o=t>=0?M(i.slice(t+1)):[];if(r.length){const t=S(r),i=o.length?S(o):void 0;x.forEach((r,o)=>e[r]=i?`${t[o]} ${i[o]}`:t[o])}}for(const i of x){const r=A(t[k[i]]);r&&(e[i]=r)}return e}(u);for(const t of x)g[t]&&d.push(`--mc-design-radius-${t}: ${g[t]}`);const b=A(u.background_color)??A(u.background);if(b&&d.push(`--mc-design-bg: ${b}`),e){d.push(...function(t,e){if(!y.some(e=>A(t[e])))return[];const i=e.base?{...f(p(e.base)),...t}:t,r=A(i.border),o=t=>{const e=Q(t);return{width:e.width,style:e.style,color:e.color}},n=Object.fromEntries(D.map(t=>[t,r?o(r):{}]));for(const t of D){const e=A(i[`border_${t}`]);e&&(n[t]=o(e))}const s=(t,e,r=t=>t)=>{const o=A(i[t]);o&&W(o).forEach((t,i)=>n[D[i]][e]=r(t))};s("border_width","width",H),s("border_style","style",t=>t.toLowerCase()),s("border_color","color");for(const t of D)void 0!==n[t].width&&void 0===n[t].style&&(n[t].style="solid");const a=(t,e)=>D.map(i=>n[i][t]??e).join(" ");return[`--mc-design-bw: ${a("width",e.w)}`,`--mc-design-bs: ${a("style",e.s)}`,`--mc-design-bc: ${a("color",e.c)}`]}(u,e));const t=A(u.box_shadow);t&&d.push(`--mc-design-shadow: ${t}`)}if(i){const e=(0,c.N)(u);d.push(...!0!==i&&(e.length||t.icon_background_shape)?(0,c.N)(f(p({...i,...t}))):e)}return n.css&&d.push(n.css),d.join("; ")}const x=["tl","tr","br","bl"],k={tl:"border_top_left_radius",tr:"border_top_right_radius",br:"border_bottom_right_radius",bl:"border_bottom_left_radius"};function A(t){return"string"==typeof t&&""!==t.trim()?t.trim():void 0}function M(t){const e=[];let i=0,r="";for(const o of t)"("===o?i++:")"===o&&(i=Math.max(0,i-1)),/\s/.test(o)&&0===i?(r&&e.push(r),r=""):r+=o;return r&&e.push(r),e}function S(t){const[e,i=e,r=e,o=i]=t;return[e,i,r,o]}const C=t=>/^(font_|text_|word_|line_|letter_|white_|overflow_w|color$)/.test(t);function z(t){const e=Object.fromEntries(Object.entries(t??{}).filter(([t])=>C(t)));return[$(e),e.font_weight&&`--mc-design-font-weight: ${e.font_weight}`].filter(Boolean).join("; ")}function E(t){const e=[];let i=0,r="",o="";for(const n of t){if(r)n===r&&(r="");else if('"'===n||"'"===n)r=n;else if("("===n)i++;else if(")"===n)i=Math.max(0,i-1);else if(";"===n&&0===i){o.trim()&&e.push(o.trim()),o="";continue}o+=n}return o.trim()&&e.push(o.trim()),e}const T=t=>/!important\s*$/i.test(t)?t:`${t} !important`,j=t=>t.replace(/[{}@]/g,"");function N(t,e,i={}){if(!e||"object"!=typeof e)return"";const r=t=>E(j(t)).filter(t=>t.includes(":")).map(T),o=r($(e,i.control,i.parts,i.tabs)),n=i.tabs?r(z(e)):[],s=f(p(e))||{},a=i.tabs?r((0,d.TC)(e)):[];if(!o.length&&!n.length&&!a.length)return"";const c=`[data-mc-hover="${t.replace(/["\\]/g,"\\$&")}"]:hover`,l=A(s.border_color)&&j(A(s.border_color).replace(/;/g,"")),u=[],{shape:m,borderLength:h}=i;if(m){const t={...m.design||{},...e};o.push(...E(Y(t,m.padding)).map(T)),l&&u.push(`${c} ${m.card?"~":">"} mc-shape { --mc-shape-stroke: ${l}; }`);const i=A(s.box_shadow);if(i){const t=j(X(i)??"none");u.push(`.mc-shape-shadow:has(> ${m.card?"ha-card > ":""}${c}) { filter: ${t} !important; }`)}}else h&&(o.push(...E(h.style).map(T)),l&&u.push(`${c} > .mc-border-fx > i { border-color: ${l} !important; }`));return a.length&&u.push(`${c}>.mc-tabs>.mc-tabs-header>.mc-tab-button { ${a.join("; ")}; }`),n.length&&u.push(`${c}>.mc-tabs>.mc-tabs-header { ${n.join("; ")}; }`),[o.length&&`${c} { ${o.join("; ")}; }`,...u].filter(Boolean).join(" ")}function q(t,e,i){if(!t?.conditional?.length||!e)return t;const{conditional:r,...n}=t,s={...n};for(const t of r){if(!t||!Array.isArray(t.conditions))continue;const r=t.conditions.map(t=>t&&!1!==t.use_module_entity&&i&&!t.entity?{...t,entity:i}:t);if(o.g.ruleMatches({conditions:r,mode:t.mode},e)){const e=t.design||{};for(const[t,i]of Object.entries(e))void 0!==i&&(s[t]=i)}}return s}function P(t){return Array.from({length:Math.max(t,1)},()=>"1fr").join(" ")}function R(t){return/^\d+(?:-\d+)*$/.test(t)?t.split("-").length:null}function O(t,e){const i="string"==typeof t||"number"==typeof t?String(t):void 0;if(!i)return P(e??1);const r={1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"};if(r[i])return e&&R(i)&&R(i)!==e?P(e):r[i];if(/^\d+(?:-\d+)+$/.test(i)){const t=i.split("-").length;return e&&t!==e?P(e):i.split("-").map(t=>`${Math.max(Number(t)||1,1)}fr`).join(" ")}return i}const D=["top","right","bottom","left"],L=new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]),U={thin:"1px",medium:"3px",thick:"5px"},I={start:"0",center:"0.5",end:"1"},F=t=>/^(-?[\d.]+[a-z%]*|thin|medium|thick|(calc|min|max|clamp)\(.*\))$/i.test(t),H=t=>U[t.toLowerCase()]??t;function W(t){const[e,i=e,r=e,o=i]=M(t);return[e,i,r,o]}function Q(t){const e={width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1},i=[];for(const r of M(t))L.has(r.toLowerCase())?(e.style=r.toLowerCase(),e.styleSet=!0):F(r)?(e.width=H(r),e.widthSet=!0):i.push(r);return i.length&&(e.color=i.join(" ")),e}function B(t){const e=A(t.border),i=Object.fromEntries(D.map(t=>[t,e?Q(e):{width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1}]));for(const e of D){const r=A(t[`border_${e}`]);r&&(i[e]=Q(r))}const r=(e,r,o=t=>t)=>{const n=A(t[e]);n&&W(n).forEach((t,e)=>{const n=i[D[e]];n[r]=o(t),"width"===r&&(n.widthSet=!0),"style"===r&&(n.styleSet=!0)})};r("border_width","width",H),r("border_style","style",t=>t.toLowerCase()),r("border_color","color");for(const t of D)i[t].widthSet&&!i[t].styleSet&&(i[t].style="solid");return i}const V=t=>"none"!==t.style&&"hidden"!==t.style&&!/^0+(\.0+)?[a-z%]*$/i.test(t.width);function J(t){const e=A(t.border_length);if(!e||"100%"===e)return;const i=B(t),r=A(t.border_length_sides),o=r&&D.includes(r)?[r]:D,n=t=>i[t].widthSet||i[t].styleSet,s=new Set(o.filter(t=>!n(t)&&(r||!D.some(n))));for(const t of s)Object.assign(i[t],{width:"2px",style:"solid"});const a=o.filter(t=>V(i[t]));return a.length?{length:e,sides:i,drawn:a,defaulted:s,hasBorder:n}:void 0}function K(t){const e=f(p(t))||{},i=J(e);if(!i)return;const{length:r,sides:o,drawn:n,defaulted:s,hasBorder:a}=i,c=I[A(e.border_length_align)??"center"]??"0.5",d=`min(${r}, 100%)`,l=`calc((100% - ${d}) * ${c})`,u=`calc((100% - ${d}) * ${c} + ${d})`,m=n.map(t=>{const e=o[t],i=`linear-gradient(${"top"===t||"bottom"===t?"to right":"to bottom"}, transparent ${l}, #000 ${l}, #000 ${u}, transparent ${u})`;return{side:t,style:`inset: 0; border-radius: inherit; border-${t}: ${e.width} ${e.style} ${e.color}; -webkit-mask-image: ${i}; mask-image: ${i}`}}),h=`${D.map(t=>`${t}: calc(-1 * ${(t=>(t=>s.has(t)||a(t)&&"none"!==o[t].style&&"hidden"!==o[t].style)(t)?o[t].width:"0px")(t)})`).join("; ")}; border-radius: inherit`,g=[...[...s].map(t=>`border-${t}-width: ${o[t].width}; border-${t}-style: solid`),"border-color: transparent"],v=[e.overflow,e.overflow_x,e.overflow_y].map(t=>A(t)).filter(Boolean);if(v.length&&v.every(t=>"hidden"===t||"clip"===t)){const t=[...new Set(n.map(t=>o[t].width))],e=t.every(t=>/^[\d.]+px$/.test(t))?`${Math.max(...t.map(t=>parseFloat(t)))}px`:1===t.length?t[0]:`max(${t.join(", ")})`;g.push("overflow: clip",`overflow-clip-margin: ${e}`)}return{style:g.join("; "),overlayStyle:h,lines:m}}function Z(t){const e=f(p(t))||{},i=J(e),r=i?.sides??B(e),o=i?.drawn??D.filter(t=>(r[t].widthSet||r[t].styleSet)&&V(r[t]));if(!o.length)return;const n=r[o[0]],s="dashed"===n.style||"dotted"===n.style?n.style:"solid",a={width:n.width,style:s,color:n.color},c=A(e.border_length_align);return(i||o.length<4)&&(a.length={value:i?.length??"100%",align:"start"===c||"end"===c?c:"center",sides:o}),a}function X(t){const e=A(t);if(!e)return;let i=0,r="";for(const t of e){if("("===t?i++:")"===t&&(i=Math.max(0,i-1)),","===t&&0===i)break;r+=t}const o=M(r.trim());if(!o.length||o.some(t=>/^(inset|none)$/i.test(t)))return;const n=t=>/^-?[\d.]+(px|em|rem|%)?$/i.test(t)||/^(calc|min|max|clamp)\(/i.test(t),s=o.filter(n),a=o.filter(t=>!n(t)).join(" ");if(s.length<2)return;const c=t=>/^-?[\d.]+$/.test(t)?`${t}px`:t;return`drop-shadow(${c(s[0])} ${c(s[1])} ${c(s[2]??"0")}${a?` ${a}`:""})`}function Y(t,e,i){return["border-color: transparent","box-shadow: none",G(t,e,{shape:!0,min:i})].join("; ")}function G(t,e,i){const r=t||{},o=t=>"number"==typeof t&&Number.isFinite(t)?String(t):A(t),n=W(o(r.padding)??A(e)??"0px");D.forEach((t,e)=>{n[e]=o(r[`padding_${t}`])??n[e]});for(const t of(A(r.css)??"").split(";")){const e=/^\s*(padding(?:-(top|right|bottom|left))?)\s*:\s*(.+?)\s*(?:!important)?\s*$/i.exec(t);e&&(e[2]?n[D.indexOf(e[2].toLowerCase())]=e[3]:W(e[3]).forEach((t,e)=>n[e]=t))}const s=["it","ir","ib","il"];return D.map((t,e)=>{const r=[(o=n[e],/^-?(\d+\.?\d*|\.\d+)$/.test(o)?`${o}px`:o)];var o;return i.shape&&r.push(`var(--mc-shape-${s[e]}, 0px)`),i.min?.[e]&&r.push(`${i.min[e]}px`),`padding-${t}: max(${r.join(", ")})`}).join("; ")}},3925(t,e,i){i.d(e,{Rw:()=>a,Wd:()=>f,a0:()=>h,id:()=>c,ls:()=>m,mu:()=>s,qB:()=>u});var r=i(6990);const o=new Set(["off","unavailable","unknown","idle","standby"]),n=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function s(t){if(!t)return!1;const e=t.entity_id.split(".")[0],i=t.state;if(o.has(i))return!1;switch(e){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function a(t,e){if(!t||!Object.prototype.hasOwnProperty.call(t,e))return;const i=t[e];if(!Array.isArray(i))return;const r=[i[0],i[1],i[2]];return"hs_color"===e&&r.slice(0,2).every(Number.isFinite)?function(t,e){const i=Math.max(0,Math.min(100,e))/100,r=e=>{const r=(e+t/60)%6;return 1-i*Math.max(0,Math.min(r,4-r,1))};return[r(5),r(3),r(1)].map(t=>Math.round(255*t))}((r[0]%360+360)%360,r[1]):r.every(Number.isFinite)?r.map(t=>Math.max(0,Math.min(255,Math.round(t)))):void 0}function c(t){if(!t)return;const e=t.entity_id.split(".")[0];if(!n.has(e))return;if(!s(t))return`var(--state-${e}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=function(t){const e=a(t,"rgb_color")||a(t,"hs_color");return e?`rgb(${e.join(", ")})`:void 0}(t.attributes||{});return i||`var(--state-${e}-${t.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${e}-active-color, var(--state-active-color, var(--primary-color))))`}const d="--mc-entity-color",l=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function u(t){if("string"!=typeof t)return;const e=t.trim().match(l);return e?{opacity:void 0===e[1]?100:Math.min(100,Number(e[1]))}:void 0}function m(t){return void 0!==u(t)}function h(t){const e=u(t);if(!e)return;const i=`var(${d}, currentColor)`;return e.opacity>=100?i:`color-mix(in srgb, ${i} ${e.opacity}%, transparent)`}let p;function f(t,e){const i="string"==typeof t?t.trim().match(r.z8):null;if(!i||!e)return;const o=void 0===i[2]?100:Math.min(100,Number(i[2])),n=i[1]?void 0:c(e),s=i[1]?a(e.attributes,i[1]):n?.match(/^rgb\((\d+), (\d+), (\d+)\)$/)?.slice(1);return s?o>=100?`rgb(${s.join(", ")})`:`rgba(${s.join(", ")}, ${+(o/100).toFixed(2)})`:!n||o>=100?n:(p??="undefined"!=typeof CSS&&!!CSS.supports?.("color","color-mix(in srgb, red 50%, red)"),p?`color-mix(in srgb, ${n} ${+o.toFixed(2)}%, transparent)`:n)}i.d(e,["MZ",0,d])},8003(t,e,i){i.d(e,{Aw:()=>m,Bw:()=>x,C8:()=>$,Ee:()=>_,H3:()=>A,Vb:()=>p,c9:()=>l,eI:()=>u,fR:()=>w,pR:()=>g,rD:()=>C,wu:()=>f});var r=i(8983),o=i(2917);const n=new Set(["unavailable","unknown"]),s=new Set(["brightness","color_temp","hs","xy","rgb","rgbw","rgbww","white"]),a=new Set(["hs","xy","rgb","rgbw","rgbww"]),c=t=>{if("number"==typeof t)return Number.isFinite(t)?t:void 0;if("string"==typeof t&&t.trim()){const e=Number(t);return Number.isFinite(e)?e:void 0}};function d(t){const e=t.attributes?.supported_color_modes;return Array.isArray(e)?e:void 0}function l(t){const e=d(t);return!e||e.some(t=>s.has(t))}function u(t){const e=d(t);return!e||e.includes("color_temp")}function m(t){const e=d(t);return!e||e.some(t=>a.has(t))}function h(t,e){const i=t.attributes?.supported_features;return null==i||0!==(Number(i)&e)}function p(t){const e=t.attributes||{},i=t=>{const e=c(t);return e&&e>0?Math.round(1e6/e):void 0};return{min:c(e.min_color_temp_kelvin)??i(e.max_mireds)??2e3,max:c(e.max_color_temp_kelvin)??i(e.min_mireds)??6500}}function f(t){const e=t.attributes||{},i=c(e.color_temp_kelvin);if(void 0!==i)return i;const r=c(e.color_temp);return r?Math.round(1e6/r):void 0}function g(t){if("off"===t.state)return 0;const e=c(t.attributes?.brightness);return void 0===e?void 0:Math.max(1,Math.round(e/255*100))}const v=(t,e,i,r={})=>({domain:t,service:e,data:{entity_id:i,...r}}),y=t=>"number"==typeof t&&Number.isFinite(t);function b(t){if(!y(t))return 0;for(let e=0;e<=6;e++){const i=t*10**e;if(Math.abs(i-Math.round(i))<1e-9*Math.max(1,Math.abs(i)))return e}}function _(t,e,i,r){const o=Math.max(b(r)??4,b(e)??4),n=r>0?e+Math.round((t-e)/r)*r:t,s=Math.min(i,Math.max(e,n));return Number(s.toFixed(o))}function w(t,e,i,s={}){const a=function(t,e,i){const n=e.entity_id,s=n.split(".")[0],a=e.attributes||{},d=String(t?.config?.unit_system?.temperature??a.temperature_unit??""),m=()=>({value:(0,r.f4)(e,i),unit:i?"":String(a.unit_of_measurement??"")});switch(s){case"input_number":case"number":return i?m():{value:(0,r.f4)(e),min:c(a.min),max:c(a.max),step:c(a.step),unit:String(a.unit_of_measurement??""),call:t=>v(s,"set_value",n,{value:t})};case"climate":{const t={min:c(a.min_temp),max:c(a.max_temp),step:c(a.target_temp_step)??("°F"===d?1:.5)};if(!i||"temperature"===i)return{value:c(a.temperature),...t,unit:d,call:t=>v("climate","set_temperature",n,{temperature:t})};if("target_temp_low"===i||"target_temp_high"===i){const e="target_temp_low"===i,r=e?"target_temp_high":"target_temp_low",s=(0,o.g7)(),l=c(a[r]);return{value:c(a[i]),...t,unit:d,call:void 0===c(a[i])||void 0===l?void 0:t=>{const i=(0,o.TR)(s,n,r)??l;return v("climate","set_temperature",n,{target_temp_low:e?t:i,target_temp_high:e?i:t})}}}return"humidity"===i?{value:c(a.humidity),min:c(a.min_humidity)??30,max:c(a.max_humidity)??99,step:1,unit:"%",call:t=>v("climate","set_humidity",n,{humidity:Math.round(t)})}:m()}case"water_heater":return i&&"temperature"!==i?m():{value:c(a.temperature),min:c(a.min_temp),max:c(a.max_temp),step:c(a.target_temp_step)??("°F"===d?1:.5),unit:d,call:t=>v("water_heater","set_temperature",n,{temperature:t})};case"humidifier":return i&&"humidity"!==i?m():{value:c(a.humidity),min:c(a.min_humidity)??0,max:c(a.max_humidity)??100,step:1,unit:"%",call:t=>v("humidifier","set_humidity",n,{humidity:Math.round(t)})};case"light":if(!i||"brightness"===i||"brightness_pct"===i)return l(e)?{value:g(e),min:0,max:100,step:1,unit:"%",call:t=>t<=0?v("light","turn_off",n):v("light","turn_on",n,{brightness_pct:Math.round(t)})}:{value:"on"===e.state?100:0,min:0,max:100,step:1,unit:"%"};if("color_temp_kelvin"===i||"color_temp"===i){const t=p(e);return{value:"on"===e.state?f(e):void 0,...t,step:50,unit:"K",call:u(e)?t=>v("light","turn_on",n,{color_temp_kelvin:Math.round(t)}):void 0}}return m();case"fan":return i&&"percentage"!==i?m():{value:"off"===e.state?0:c(a.percentage),min:0,max:100,step:c(a.percentage_step)??1,unit:"%",call:h(e,1)?t=>v("fan","set_percentage",n,{percentage:Math.round(t)}):void 0};case"cover":return"current_tilt_position"===i?{value:c(a.current_tilt_position),min:0,max:100,step:1,unit:"%",call:h(e,128)?t=>v("cover","set_cover_tilt_position",n,{tilt_position:Math.round(t)}):void 0}:i&&"current_position"!==i?m():{value:c(a.current_position),min:0,max:100,step:1,unit:"%",call:h(e,4)?t=>v("cover","set_cover_position",n,{position:Math.round(t)}):void 0};case"valve":return i&&"current_position"!==i?m():{value:c(a.current_position),min:0,max:100,step:1,unit:"%",call:h(e,4)?t=>v("valve","set_valve_position",n,{position:Math.round(t)}):void 0};case"media_player":{if(i&&"volume_level"!==i)return m();const t=c(a.volume_level);return{value:void 0===t?void 0:Math.round(100*t),min:0,max:100,step:1,unit:"%",call:void 0!==t&&h(e,4)?t=>v("media_player","volume_set",n,{volume_level:Math.round(t)/100}):void 0}}default:return m()}}(t,e,i||void 0);let d=y(a.min)?a.min:void 0,m=y(a.max)?a.max:void 0;y(s.min)&&(d=void 0===d?s.min:Math.max(d,s.min)),y(s.max)&&(m=void 0===m?s.max:Math.min(m,s.max)),d=d??0,m=m??100,m<=d&&(d=y(a.min)?a.min:0,m=y(a.max)&&a.max>d?a.max:d+100);const b=function(t,e){const i=y(e)&&e>0?e:void 0,r=y(t)&&t>0?t:void 0;if(void 0!==i&&void 0!==r){const t=i/r;return Math.abs(t-Math.round(t))<1e-6&&Math.round(t)>=1?i:r}return i??r??1}(a.step,s.step),_=n.has(e.state),w=_||void 0===a.value?void 0:a.value,$=_||!a.call;return{value:w,min:d,max:m,step:b,unit:a.unit,readOnly:$,call:$?void 0:a.call}}function $(t,e,i){const o=Math.max(b(e.step)??0,Math.min(2,b(i)??2));return(0,r.$g)((0,r.gn)(t,i,o),e.unit)}function x(t,e,i,r){Promise.resolve(t.callService(e.domain,e.service,e.data)).then(r,t=>{console.warn(`Magic Card: ${e.domain}.${e.service} failed`,t);try{i?.(t)}catch(t){console.warn("Magic Card: onError failed",t)}})}const k=new Set(["closed","locked","off"]);function A(t,e){const i=e.split(".")[0],r=t?.states?.[e]?.state,o=void 0!==r&&k.has(r),n="group"===i?"homeassistant":i;let s;switch(i){case"lock":s=o?"unlock":"lock";break;case"cover":s=o?"open_cover":"close_cover";break;case"valve":s=o?"open_valve":"close_valve";break;case"button":case"input_button":s="press";break;case"scene":s="turn_on";break;default:s=o?"turn_on":"turn_off"}return{domain:n,service:s,data:{entity_id:e}}}const M=new Set(["light","switch","fan","input_boolean","automation","humidifier"]),S=new Set(["script","scene"]);function C(t){const e=t.split(".")[0];return{tap_action:M.has(e)?{action:"toggle"}:S.has(e)?{action:"perform-action",service:`${e}.turn_on`,data:{entity_id:t}}:{action:"more-info"},hold_action:{action:"more-info"}}}i.d(e,["LE",0,M])},8477(t,e,i){i.d(e,{CU:()=>s,TO:()=>d,fq:()=>a,hZ:()=>c});var r=i(2618);const o={light:["mdi:lightbulb","mdi:lightbulb-outline"],switch:["mdi:toggle-switch-variant","mdi:toggle-switch-variant-off"],input_boolean:["mdi:check-circle-outline","mdi:close-circle-outline"],binary_sensor:["mdi:checkbox-marked-circle","mdi:radiobox-blank"],fan:["mdi:fan","mdi:fan-off"],automation:["mdi:robot","mdi:robot-off"],lock:["mdi:lock","mdi:lock-open-variant"],cover:["mdi:window-shutter-open","mdi:window-shutter"],valve:["mdi:valve-open","mdi:valve-closed"],media_player:["mdi:cast-connected","mdi:cast"],person:["mdi:account","mdi:account-arrow-right"],device_tracker:["mdi:account","mdi:account-arrow-right"],siren:["mdi:bullhorn","mdi:bullhorn-outline"],remote:["mdi:remote","mdi:remote-off"]},n={sensor:"mdi:eye",climate:"mdi:thermostat",camera:"mdi:video",script:"mdi:script-text",scene:"mdi:palette",input_number:"mdi:ray-vertex",number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",text:"mdi:form-textbox",input_datetime:"mdi:calendar-clock",input_button:"mdi:button-pointer",button:"mdi:button-pointer",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home",zone:"mdi:map-marker-radius",timer:"mdi:timer-outline",counter:"mdi:counter",update:"mdi:package-up",calendar:"mdi:calendar",todo:"mdi:clipboard-list",event:"mdi:eye-check",image:"mdi:image"};function s(t,e,i){if(!e||"unavailable"===e||"unknown"===e)return!1;switch(t){case"lock":return"locked"===e;case"cover":case"valve":return"closed"!==e;case"person":case"device_tracker":return"home"===e;case"media_player":return!["off","standby","idle"].includes(e);case"climate":{const t=i?.hvac_action;return"string"==typeof t&&t?"heating"===t||"cooling"===t:"heat"===e||"cool"===e||"heat_cool"===e}case"alarm_control_panel":return e.startsWith("armed_");case"vacuum":return"cleaning"===e;default:return"on"===e}}function a(t,e){if(!t||!e)return;const i=t.entities?.[e]?.icon;if(i)return i;const r=t.states?.[e],a=r?.attributes?.icon;return"string"==typeof a&&a?a:r?function(t,e){const i=o[t];return i?s(t,e??"")?i[0]:i[1]:n[t]}(e.split(".")[0],r.state):void 0}function c(t,e,i,r){if(!e||!i&&!r)return;const o=t?.states?.[e];return o&&(s(e.split(".")[0],o.state,o.attributes)?i:r)||void 0}function d(t,e,i,o="",n){const s=e?t?.states?.[e]:void 0;return s&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?r.qy`<ha-state-icon class=${o} data-mc-part=${n??r.s6} .hass=${t} .stateObj=${s}></ha-state-icon>`:r.qy`<ha-icon class=${o} data-mc-part=${n??r.s6} .icon=${a(t,e)||i}></ha-icon>`}},3686(t,e,i){function r(t){const e="string"==typeof t?t.trim():"";if(e&&"~"!==e)return"none"===e&&t===e?null:t}function o(t,e){const i=r(t.entity);if(null!==i)return i&&!0===t.share_entity?i:e}function n(t,e,i){const o=r(t.entity);return void 0!==o?o??void 0:!1===i||i&&!i.includes((e??"").split(".")[0])?void 0:e}function s(t,e,i){const r={};return/\bentity\b/.test(t)&&(r.entity=e??""),t.includes("card_entity")&&(r.card_entity=i??""),void 0===r.entity&&void 0===r.card_entity?void 0:r}i.d(e,{DH:()=>r,Xu:()=>o,hY:()=>n,xw:()=>s})},8983(t,e,i){i.d(e,{$g:()=>c,Ai:()=>d,Pd:()=>n,f4:()=>s,gn:()=>a,tX:()=>l});var r=i(2016);const o=new Set(["unavailable","unknown"]);function n(t,e){return!t||(e?void 0===t.attributes?.[e]||null===t.attributes[e]:o.has(t.state))}function s(t,e){if(!t)return;const i=e?t.attributes?.[e]:t.state;if("number"==typeof i)return Number.isFinite(i)?i:void 0;if("string"!=typeof i||!i.trim())return;const r=Number(i);return Number.isFinite(r)?r:void 0}function a(t,e,i){const o=Math.max(0,Math.min(10,Math.round(i))),n={minimumFractionDigits:o,maximumFractionDigits:o};"none"===t?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(t?(0,r.eN)(t):void 0,n).format(e)}catch{return e.toFixed(o)}}function c(t,e){return e?/^(%|°)$/.test(e)?`${t}${e}`:`${t} ${e}`:t}function d(t,e,i,r={}){const o=t;let n;try{const t=i?o?.formatEntityAttributeValueToParts?.(e,i):o?.formatEntityStateToParts?.(e);Array.isArray(t)&&t.length&&(n=function(t){const e=t.filter(t=>"unit"===t.type).map(t=>t.value).join("");return{value:t.filter(t=>"value"===t.type).map(t=>t.value).join("")||t.filter(t=>"unit"!==t.type).map(t=>t.value).join("").trim(),unit:e,text:t.map(t=>t.value).join("")}}(t))}catch{n=void 0}if(!n){const t=i?e.attributes?.[i]:e.state;let r;try{r=i?o?.formatEntityAttributeValue?.(e,i):o?.formatEntityState?.(e)}catch{r=void 0}const s=i?"":String(e.attributes?.unit_of_measurement??"");if(null==r){const e=null==t?"":"object"==typeof t?JSON.stringify(t):String(t);n={value:e,unit:s,text:c(e,s)}}else n=s&&r.endsWith(s)?{value:r.slice(0,-s.length).trimEnd(),unit:s,text:r}:{value:r,unit:"",text:r}}const d=void 0!==r.decimals&&null!==r.decimals&&Number.isFinite(Number(r.decimals))?s(e,i):void 0;if(void 0!==d){const e=a(t,d,Number(r.decimals));n={value:e,unit:n.unit,text:c(e,n.unit)}}return n}function l(t,e){const i=t?.formatEntityName;let r;try{r=i?.(e)}catch{r=void 0}return r=r||e.attributes?.friendly_name,"string"==typeof r&&r?r:e.entity_id}},5112(t,e,i){i.d(e,{E$:()=>g,Wb:()=>h});const r=[300,400,500,700],o=[300,400,700],n=[400,700],s=[400,500,700],a={Roboto:void 0,"Open Sans":void 0,Lato:o,Montserrat:void 0,Oswald:void 0,"Source Sans Pro":o,Raleway:void 0,"PT Sans":n,Merriweather:void 0,"Playfair Display":s,Lora:s,"PT Serif":n,"Noto Sans":void 0,Ubuntu:void 0,Poppins:void 0,Nunito:void 0,Inconsolata:void 0,"Fira Code":void 0,"Source Code Pro":void 0,"Dancing Script":s},c=new Map(Object.keys(a).map(t=>[t.toLowerCase(),t]));function d(t){const e=((Object.prototype.hasOwnProperty.call(a,t)?a[t]:void 0)??r).join(";");return`https://fonts.googleapis.com/css2?family=${encodeURIComponent(t).replace(/%20/g,"+")}:wght@${e}&display=swap`}function l(t){if("string"!=typeof t)return[];const e=[];for(const i of t.split(",")){const t=c.get(i.trim().replace(/^["']|["']$/g,"").trim().toLowerCase());t&&!e.includes(t)&&e.push(t)}return e}const u=/font-family\s*:\s*([^;]+)/gi,m=new WeakMap;function h(t){const e=m.get(t);if(e)return e;const i=new Set,r=new WeakSet,o=(t,e=!1)=>{if(!t||"object"!=typeof t||r.has(t))return;if(r.add(t),Array.isArray(t))return void t.forEach(t=>o(t,e));const n=e||"button"===t.type;for(const[e,r]of Object.entries(t))if("font_family"===e||"tab_font_family"===e||"label_font_family"===e&&n)l(r).forEach(t=>i.add(t));else if("css"===e&&"string"==typeof r)for(const t of r.matchAll(u))l(t[1]).forEach(t=>i.add(t));else r&&"object"==typeof r&&o(r,n)};o(t);const n=[...i];return m.set(t,n),n}const p=new Set(["Roboto"]);let f;function g(t){if("undefined"!=typeof document&&document.head&&(!f||!t.every(t=>f.has(t)||p.has(t)))){f??=new Set([...document.head.querySelectorAll("link[data-mc-font]")].map(t=>t.dataset.mcFont??""));for(const e of t){if(f.has(e)||p.has(e))continue;f.add(e);const t=document.createElement("link");t.rel="stylesheet",t.href=d(e),t.dataset.mcFont=e,document.head.appendChild(t)}}}},9136(t,e,i){i.d(e,{gO:()=>c,os:()=>l,wb:()=>s});var r=i(2618),o=i(7423);const n=/^\s*(to\s|circle|ellipse|at\s|closest|farthest|-?[\d.]+(deg|turn|rad|grad)$)[\w\s.%-]*$/i;function s(t){if("string"!=typeof t||t.length>600)return;const e=/^\s*(linear|radial)-gradient\((.*)\)\s*$/is.exec(t),i=e?.[2].match(/(?:[^(),]|\((?:[^()]|\([^()]*\))*\))+/g);if(!e||!i||i.join(",")!==e[2])return;const r=n.test(i[0])?i.shift():"",s=i.map(t=>(0,o.f8)(t.replace(/(\s+-?[\d.]+[a-z%]*)+\s*$/i,"")));return i.length<2||i.length>8||!s.every(Boolean)?void 0:{radial:"radial"===e[1],angle:/deg$/.test(r)?parseFloat(r):180,stops:s}}const a={top:0,right:90,bottom:180,left:270};function c(t){if("string"!=typeof t||t.length>600)return;const e=s(t);if(!e||e.radial)return;const i=/^\s*linear-gradient\(\s*to\s+([a-z]+)(?:\s+([a-z]+))?\s*,/i.exec(t);if(!i)return e.angle;const r=a[i[1].toLowerCase()];if(void 0===r)return;if(!i[2])return r;const o=a[i[2].toLowerCase()];if(void 0===o||r%180==o%180)return;const[n,c]=r%180==0?[r,o]:[o,r];return 0===n?90===c?45:315:90===c?135:225}const d=t=>+t.toFixed(3);function l(t,e,i,o){const n=e*Math.PI/180,s=Math.sin(n),a=Math.cos(n),c=(Math.abs(o.w*s)+Math.abs(o.h*a))/2,l=o.x+o.w/2,u=o.y+o.h/2;return r.JW`<linearGradient id=${t} gradientUnits="userSpaceOnUse" x1=${d(l-s*c)} y1=${d(u+a*c)} x2=${d(l+s*c)} y2=${d(u-a*c)}>${i.map((t,e)=>r.JW`<stop offset=${d(i.length>1?e/(i.length-1):0)} stop-color=${t}></stop>`)}</linearGradient>`}},7137(t,e,i){i.d(e,{$:()=>o});let r=0;function o(t="mc"){return r++,`${t}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${r}`}},9682(t,e,i){i.d(e,{Zz:()=>l,Ev:()=>A,QC:()=>d,bL:()=>c,oY:()=>x,Xe:()=>k});var r=i(2618),o=i(1235);const n={timeout:1e4,silent:2e3,background:[3e4,9e4,3e5]},s=new Set,a=new Set,c=t=>(s.add(t),()=>{s.delete(t)}),d=()=>s.forEach(t=>t()),l=()=>a;let u=Date.now(),m=!1,h=!1;const p=t=>new Promise(e=>setTimeout(e,t)),f=Date.now().toString(36)+Math.random().toString(36).slice(2,6),g=(t=f)=>{const e=new URL("magic-card-manifest.js",import.meta.url);return e.search="?r="+t,e.href};let v;const y=new Set;let b=[];const _=t=>Array.isArray(t)?t.flatMap(_):[t],w=t=>t instanceof CSSStyleSheet?t:t.styleSheet;function $(t){const e=t.constructor,i=b.filter(t=>!e.elementStyles.includes(t));i.length&&(e.elementStyles=[...e.elementStyles,...i]);const o=t.renderRoot;if(!o||!r.qM)return;const n=b.map(w).filter(t=>!o.adoptedStyleSheets.includes(t));n.length&&(o.adoptedStyleSheets=[...o.adoptedStyleSheets,...n])}function x(t){y.add(t),$(t)}const k=t=>{y.delete(t)};function A(t,e){const r=`magic-card-${t}.js`;let s,c,l,f,w,x=e,k="idle",A=new Set,M=0;const S=(e,i,r,o)=>(e!==M||(k="failed",s=i,a.add(t),console.warn(r,...void 0===o?[]:[o]),d()),!1),C=(t,e)=>S(t,"mismatch",`Magic Card was updated, reload the page (magic-card.js ${o.Q}, ${r} ${e}).`),z=(e,p)=>new Promise(f=>{const g=setTimeout(()=>f(!1),n.timeout);(function(t,e){if(e&&void 0!==i){if(!h){h=!0;const t=i.u;i.u=e=>{const i=t(e);return m?i+"?r="+ ++u:i}}m=!0}try{return t()}finally{m=!1}})(x,p).then(i=>(clearTimeout(g),f(((e,i)=>{if(e!==M)return!1;if("ready"===k)return!0;if(i?.BUILD!==o.Q)return C(e,String(i?.BUILD));try{i.install(),"styles"in i&&i.styles&&(n=i.styles,b=[...b,..._(n)],y.forEach($))}catch(t){return w=t,!1}var n;c=i,k="ready",s=void 0,l=Promise.resolve(!0);const u=[...A];A.clear();for(const t of u)try{t()}catch(t){console.warn(`Magic Card: a ${r} callback failed`,t)}return a.has(t)&&d(),!0})(e,i))),t=>(w=t,clearTimeout(g),f(!1)))}),E=()=>{const t=M;return f??=z(t,!0).then(e=>(f=void 0,t!==M||e||"failed"!==k||d(),e))},T=()=>k,j=()=>{return l||(k="loading",t=M,l=new Promise(e=>{(async()=>{let i=await z(t,!1);var a;!i&&t===M&&"loading"===T()&&await(v??=Promise.race([(a=g(),import(a)).then(t=>!!t?.default?.build&&t.default.build!==o.Q,()=>!1),p(n.timeout).then(()=>!1)]))&&C(t,"manifest");const c=[n.silent,...n.background];for(let o=0;!i&&t===M&&"ready"!==T()&&"mismatch"!==s&&o<c.length&&(await p(c[o]),t===M&&"ready"!==T());o++)i=await E(),i||"loading"!==T()||S(t,"load",`Magic Card: ${r} did not load`,w),e(i);e(i||"ready"===T())})()})),l;var t};return{name:t,load:j,ready:()=>"ready"===k,failed:()=>"failed"===k,failure:()=>"failed"===k?s:void 0,retry:()=>"idle"===k||"loading"===k?j():"failed"===k&&"load"===s?E():Promise.resolve("ready"===k),whenReady(t){"ready"===k?t():A.add(t)},module:()=>c,__reset(i){M++,x=i??e,l=f=c=s=void 0,k="idle",A=new Set,a.delete(t)}}}},8805(t,e,i){var r=i(7050),o=i(9682),n=i(1909),s=i(5767),a=i(9486),c=i(9434);const d={slider:(0,o.Ev)("slider",()=>i.e(436).then(()=>i(422))),seasonal:(0,o.Ev)("seasonal",()=>Promise.all([i.e(126),i.e(199)]).then(()=>i(3632))),markdown:(0,o.Ev)("markdown",()=>i.e(764).then(()=>i(409))),"modules-extra":(0,o.Ev)("modules-extra",()=>i.e(427).then(()=>i(870))),flows:(0,o.Ev)("flows",()=>i.e(302).then(()=>i(4337))),pause:(0,o.Ev)("pause",()=>i.e(831).then(()=>i(9825))),popup:(0,o.Ev)("popup",()=>i.e(887).then(()=>i(5133))),controls:(0,o.Ev)("controls",()=>i.e(693).then(()=>i(2637))),decor:(0,o.Ev)("decor",()=>Promise.all([i.e(126),i.e(446)]).then(()=>i(2218))),"flow-look":(l=(0,o.Ev)("flow-look",(u=t=>t.importFlowLook,()=>{const t=d.flows.module();return t?u(t)():Promise.reject(new Error("flows not installed"))})),{...l,load:()=>d.flows.load().then(t=>t&&l.load())}),"slider-look":(t=>({...t,load:()=>d.controls.load().then(e=>e&&t.load())}))((0,o.Ev)("slider-look",()=>{const t=d.controls.module();return t?(t=>t.importSliderLook)(t)():Promise.reject(new Error("controls not installed"))})),layers:(0,o.Ev)("layers",()=>i.e(853).then(()=>i(1012))),"svg-icon":(0,o.Ev)("svg-icon",()=>Promise.all([i.e(126),i.e(815)]).then(()=>i(900))),anim:(0,o.Ev)("anim",()=>Promise.all([i.e(126),i.e(168)]).then(()=>i(6754))),templates:(0,o.Ev)("templates",()=>i.e(624).then(()=>i(8670)))};var l,u;const m=t=>()=>{const e=d.anim.module();return e?t(e)():Promise.reject(new Error("anim not installed"))},h=t=>({...t,load:()=>d.anim.load().then(e=>e&&t.load())}),p={"anim-runtime":(0,o.Ev)("anim-runtime",m(t=>t.importRuntime)),particles:(0,o.Ev)("particles",m(t=>t.importParticles)),"shape-custom":(0,o.Ev)("shape-custom",()=>i.e(702).then(()=>i(2191))),"svg-image":(0,o.Ev)("svg-image",()=>i.e(771).then(()=>i(6876)))};(0,r.Hy)(h(p["anim-runtime"])),(0,n.W7)(h(p.particles)),(0,s.M3)(p["shape-custom"]),(0,a.qb)(d["svg-icon"]),(0,c.q)(p["svg-image"]),i.d(e,["DL",0,p,"X$",0,()=>d.seasonal.load(),"tQ",0,d])},2016(t,e,i){function r(t){return t?.locale?.language||t?.language||void 0}function o(t){const e=t?.locale?.time_format;if("12"===e)return!0;if("24"===e)return!1;const i="system"===e?void 0:r(t);try{return new Date("January 1, 2023 22:00:00").toLocaleString(i).includes("10")}catch{return!1}}function n(t){if("server"!==t?.locale?.time_zone)return;const e=t.config?.time_zone;if(e)try{return new Intl.DateTimeFormat("en",{timeZone:e}),e}catch{return}}function s(t){switch(t?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return r(t)}}function a(t,e,i=1){const r={maximumFractionDigits:i};"none"===t?.locale?.number_format&&(r.useGrouping=!1);try{return new Intl.NumberFormat(s(t),r).format(e)}catch{return String(e)}}function c(t,e){const i=n(t),o=i?{...e,timeZone:i}:e;try{return new Intl.DateTimeFormat(r(t),o)}catch{return new Intl.DateTimeFormat(void 0,o)}}i.d(e,{LE:()=>c,XN:()=>r,ZV:()=>a,cj:()=>n,eN:()=>s,oE:()=>o})},7110(t,e,i){i.d(e,{F9:()=>d,gu:()=>a,x2:()=>m,zi:()=>l});var r=i(4445),o=i(1535),n=i(7924);function s(t,e){if(!e)return e;const i=t?.hassUrl;if(e.startsWith("/")&&!e.startsWith("//")&&"function"==typeof i)try{return i.call(t,e)}catch{return e}return e}function a(t,e){if("string"==typeof e&&e)return(0,r.e)(s(t,e),location.href)}function c(t){return(0,o.VQ)()?.media?.(t)??(0,n.yl)(t)??""}function d(t,e){const i=(0,n.fk)(e);return s(t,i?c(i):"string"==typeof e?(0,n.i$)(e):"")}function l(t,e){const i=(0,n.fk)(e);if(!i){const i="string"==typeof e?e.trim():"";return/^(\/|https?:|data:)/i.test(i)?u(s(t,i)):e}const r=c(i);return r?u(s(t,r)):""}function u(t){return`url("${t.replace(/["\\\n\r]/g,encodeURIComponent)}")`}function m(t,e,i=Date.now()){if(!(t&&e>0))return t;const r=Math.floor(i/e);return`${t}${t.includes("?")?"&":"?"}mc_t=${r}`}},5746(t,e,i){function r(t){if(!t||"object"!=typeof t)return;const e=t;if("row"===t.type){const t=e.columns;return Array.isArray(t)?t.map(t=>Array.isArray(t?.modules)?t.modules:[]):[]}if("tabs"===t.type){const t=e.tabs;return Array.isArray(t)?t.map(t=>Array.isArray(t?.modules)?t.modules:[]):[]}return Array.isArray(e.modules)?[e.modules]:"horizontal"===t.type||"vertical"===t.type||"slider-layout"===t.type?[[]]:void 0}function o(t){if(n(t))return"row"===t.type?"columns":"tabs"===t.type?"tabs":"modules"}function n(t){return void 0!==r(t)}function s(t){return"row"===t?.type||"tabs"===t?.type}function a(t,e){return r(t)?.[e.slot]?.[e.index]}function c(t,e){let i=t;for(const t of e)if(i=a(i,t),!i)return;return i}function d(t,e){const i=t;if("row"===t.type||"tabs"===t.type){const r=i["row"===t.type?"columns":"tabs"],o=r?.[e];if(!o)return;return Array.isArray(o.modules)||(o.modules=[]),o.modules}if(0===e&&n(t))return Array.isArray(i.modules)||(i.modules=[]),i.modules}function l(t){return t.map(t=>`${t.slot}.${t.index}`).join("/")}function u(t){if(!t)return[];const e=[];for(const i of t.split("/")){const t=/^(?:(\d+)\.)?(\d+)$/.exec(i);if(!t)return;e.push({slot:void 0===t[1]?0:Number(t[1]),index:Number(t[2])})}return e}function m(t,e,i){if(!e.length)return i;const[r,...o]=e,n=a(t,r);if(!n)return t;const s=m(n,o,i),c=t,d=t=>(t||[]).map((t,e)=>e===r.index?s:t);if("row"===t.type||"tabs"===t.type){const e="row"===t.type?"columns":"tabs",i=c[e].map((t,e)=>e===r.slot?{...t,modules:d(t.modules)}:t);return{...t,[e]:i}}return{...t,modules:d(c.modules)}}i.d(e,{Nk:()=>l,O6:()=>m,QN:()=>n,Rv:()=>c,Tu:()=>u,WA:()=>s,rX:()=>d,us:()=>o,yZ:()=>r})},1909(t,e,i){i.d(e,{ii:()=>s});var r=i(5556);let o,n;function s(){return o?n??=o.load().then(t=>(t||(n=void 0),t?o.module().particles:void 0)):Promise.resolve(void 0)}i.d(e,["W7",0,t=>{o=t,o?.whenReady(()=>(0,r.E0)(o.module().compile,o.module().validateSim))},"WP",0,()=>o?.module()?.particles,"dm",0,t=>(0,r.ar)(t)])},2917(t,e,i){i.d(e,{TR:()=>a,g7:()=>n,gm:()=>u,jb:()=>d,n_:()=>l,vh:()=>s});var r=i(1535);let o=0;function n(){return(0,r.VQ)()?.instance??""}function s(t,e,i){return JSON.stringify([n(),t??"",e??"",i])}function a(t,e,i){let r;for(const o of c.values())o.scope===t&&o.entityId===e&&o.attribute===i&&(!r||o.seq>r.seq)&&(r=o);return r?.value}const c=new Map;function d(t,e){const i=c.get(t);if(i)return i.sent&&e!==i.base?(i.holdTimer&&clearTimeout(i.holdTimer),void c.delete(t)):i.value}function l(t,e,i,r,n,s=500){const a=c.get(t);a?.timer&&clearTimeout(a.timer),a?.holdTimer&&clearTimeout(a.holdTimer);let d=[];try{d=JSON.parse(t)}catch{}const[l,u,m]=Array.isArray(d)?d.map(String):["","",""],h={value:e,base:a?a.base:i,sent:!1,scope:l??"",entityId:u??"",attribute:m??"",seq:++o};h.timer=setTimeout(()=>{h.timer=void 0,h.sent=!0,r(h.value),h.holdTimer=setTimeout(()=>{c.get(t)===h&&c.delete(t),n?.()},5e3)},s),c.set(t,h),n?.()}function u(t){const e=c.get(t);e&&(e.timer&&clearTimeout(e.timer),e.holdTimer&&clearTimeout(e.holdTimer),c.delete(t))}},5832(t,e,i){i.d(e,{BI:()=>n,NG:()=>s,WV:()=>l,oi:()=>o,ok:()=>c,t8:()=>d,uT:()=>a});const r=/^[A-Za-z0-9][A-Za-z0-9_-]*$/;function o(t){return"string"==typeof t?t.trim().replace(/^#+/,""):""}function n(t){return"string"==typeof t&&r.test(t)}function s(t){const e=o(t);return!e||n(e)?"":"Use letters, digits, - and _ only (no spaces)."}function a(t){return!!t&&"object"==typeof t&&!0===t.enabled}function c(t){try{return a(t?.popup)}catch{return!1}}function d(t){const e=o(t?.hash);return n(e)?e:void 0}function l(t,e){const i=t.split("#")[0];return e?`${i}#${e}`:i}i.d(e,["Uh",0,{style:"sheet",width:"600px",max_height:"90vh",backdrop_blur:"8px",backdrop_opacity:.4,show_close:!0,auto_close:0}])},7555(t,e,i){i.d(e,["V",0,()=>"function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches])},170(t,e,i){i.d(e,{Y4:()=>u,JA:()=>w,cr:()=>x,nI:()=>A,dg:()=>$});var r=i(7423),o=i(1214),n=i(4240),s=i(3925),a=i(9136),c=i(8983),d=i(1476);function l(t,e,i){if(t&&"object"==typeof t){const r="string"==typeof t.entity?t.entity:"";return(0,c.f4)(r?e?.[r]:void 0,t.attribute||void 0)??i}const r="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof r&&Number.isFinite(r)?r:i}const u={width:3,transition:"1s",speed:"3s",length:25,start:"top",direction:"cw",linecap:"round",position:"inside",animation:"snake",min:0,max:100},m=["snake","pulse","full","dots","dashes"],h=["top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"],p=["inside","center","outside"],f="var(--primary-color, #03a9f4)",g=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},v=(t,e,i)=>Math.min(i,Math.max(e,t)),y=(t,e,i)=>e.includes(t)?t:i,b=t=>(0,s.a0)(t)??(0,r.f8)(t),_=(t,e)=>void 0===e||e>=100?t:`color-mix(in srgb, ${t} ${v(e,0,100)}%, transparent)`;function w(t,e){if(!t||"object"!=typeof t||"value"!==t.mode&&"animated"!==t.mode)return;const i=e.defaultEntity?e.states?.[e.defaultEntity]:void 0;if("tap"!==t.trigger&&!(0,o.p)(t,i,e.states))return;let s=1;const w=(0,a.wb)(t.color);let $,x=w?w.stops[0]:b(t.color);if("value"===t.mode){const i=t.entity||e.defaultEntity,r=i?e.states?.[i]:void 0,o=!t.attribute&&(0,d._7)(i)?(0,d.vt)(r):void 0;if(o){const e=(0,d.Yj)(o),i="elapsed"===t.timer_fill;s="idle"===o.state?0:i?1-e:e,void 0!==o.end&&o.total>0&&($={end:o.end,total:o.total,elapsed:i,color:x??f,...t.thresholds?{thresholds:t.thresholds}:{}}),x=b((0,n.r)(100*e,t.thresholds))??x}else{const i=(0,c.f4)(r,t.attribute||void 0),o=l(t.min,e.states,u.min),a=l(t.max,e.states,u.max);s=void 0===i||a===o?0:v((i-o)/(a-o),0,1),x=b((0,n.r)(i,t.thresholds))??x}}x??=f;const k=y(t.position,p,u.position),A=b(t.track_color),M=g(t.track_opacity),S=A||void 0!==M?_(A??x,M):void 0;$&&!A&&void 0!==M&&($.trackOpacity=M);const C=(0,r.TD)(t.transition)??u.transition;return{mode:t.mode,fill:s,..."animated"===t.mode?{animation:y(t.animation,m,u.animation)}:{},color:x,paint:w&&t.color,...S?{track:S}:{},width:v(g(t.width)??u.width,.5,40),linecap:"butt"===t.linecap?"butt":"round",glow:v(g(t.glow)??0,0,40),position:e.shaped||e.clipped&&"outside"===k?"inside":k,start:y(t.start,h,u.start),direction:"ccw"===t.direction?"ccw":"cw",length:v(g(t.length)??u.length,1,99),speed:(0,r.TD)(t.speed)??u.speed,transition:$?(z=C,(z.endsWith("ms")?parseFloat(z):1e3*parseFloat(z))>1e3?"1s":z):C,...$?{timer:$}:{}};var z}function $(t,e=Date.now()){const i=v((t.end-e)/t.total,0,1),r=b((0,n.r)(100*i,t.thresholds))??t.color;return{fill:t.elapsed?1-i:i,color:r,...void 0!==t.trackOpacity?{track:_(r,t.trackOpacity)}:{}}}function x(t,e){return"inside"===t?e/2:"outside"===t?-e/2:0}const k=t=>String(+t.toFixed(3));function A(t,e){const i=(t,i="none",r="none")=>({...t,animation:e?"none":i,transition:e?"none":r});if("value"===t.mode)return i({dasharray:"100 101",dashoffset:k(100-100*t.fill),linecap:t.linecap,opacity:t.fill>0?1:0},"none",`stroke-dashoffset ${t.transition} ${t.timer?"linear":"ease-in-out"}, stroke 0.5s ease`);const r=`mc-ring-run ${t.speed} ${t.timing??"linear infinite"}`;switch(t.animation){case"pulse":return i({dasharray:"none",dashoffset:"0",linecap:t.linecap,opacity:1},`mc-ring-pulse ${t.speed} ${t.timing??"ease-in-out infinite"}`);case"full":return i({dasharray:"none",dashoffset:"0",linecap:t.linecap,opacity:1});case"dots":return i({dasharray:`0 ${k(100/12)}`,dashoffset:"0",linecap:"round",opacity:1},r);case"dashes":return i({dasharray:"1.5 1.5",dashoffset:"0",linecap:t.linecap,opacity:1},r);default:return i({dasharray:`${k(t.length)} ${k(100-t.length)}`,dashoffset:"0",linecap:t.linecap,opacity:1},r)}}},7423(t,e,i){i.d(e,{M5:()=>d,Q7:()=>m,TD:()=>o,VC:()=>c,f8:()=>s});const r=t=>"string"==typeof t&&""!==t.trim()?t.trim():void 0;function o(t){if("number"==typeof t&&Number.isFinite(t)&&t>=0)return+t.toFixed(3)+"s";const e=r(t);if(!e)return;const i=e.length<=64?/^(?:\d+(?:\.\d+)?|\.\d+)(m?s)?$/.exec(e):null;return i?i[1]?e:+(+e).toFixed(3)+"s":void 0}const n=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function s(t){const e=r(t);if(!e||e.length>256||!/^[#\w\s(),.%+*/-]+$/.test(e)||e.includes("/*")||e.includes("*/"))return;let i=0;for(const t of e)if("("===t)i++;else if(")"===t&&--i<0)return;if(0!==i)return;const o=e.match(/\(/g)?.length??0,s=[...e.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==o||s.some(t=>!n.has(t[1].toLowerCase()))?void 0:e}const a=/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem|%|vw|vh)?$/;function c(t,e=4){const i="number"==typeof t?Number.isFinite(t)?String(t):"":r(t),o=i&&i.length<=64?i.split(/\s+/):void 0;if(!o||o.length>e)return;const n=[];for(const t of o){const e=a.exec(t);if(!e)return;n.push(e[1]+(e[2]??"px"))}return n.join(" ")}function d(t){const e=r(t),i="number"==typeof t?t:e&&e.length<=64&&/^(\d+(\.\d+)?|\.\d+)$/.test(e)?Number(e):NaN;return i>=0&&i<=1?i:void 0}const l=/^(\d+(?:\.\d+)?|\.\d+)(%)?$/,u=new Map([["blur",/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem)?$/],["hue-rotate",/^(-?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)$/],...["brightness","contrast","grayscale","invert","opacity","saturate","sepia"].map(t=>[t,l])]);function m(t){const e=c(t.border_width),i=function(t){const e=r(t)?.toLowerCase();return e&&/^(none|hidden|solid|dashed|dotted|double|groove|ridge|inset|outset)$/.test(e)?e:void 0}(t.border_style),o=s(t.border_color),n=d(t.opacity),a=function(t){const e=r(t)?.toLowerCase();if("none"===e)return e;if(!e||e.length>256)return;const i=[],o=/\s*([a-z-]+)\(\s*([^()\s]*)\s*\)(?=\s|$)\s*/y;let n=0;for(let t;n<e.length;n=o.lastIndex){t=o.exec(e);const r=t?.[1]??"",n=t&&u.get(r)?.exec(t[2]);if(!n||6===i.length)return;i.push(`${r}(${n[1]}${n[2]??("blur"===r?"px":"")})`)}return i.join(" ")}(t.backdrop_filter);return{css:[e&&!e.includes("%")&&`border-width: ${e}`,i&&`border-style: ${i}`,o&&`border-color: ${o}`,void 0!==n&&`opacity: ${n}`,a&&`backdrop-filter: ${a}; -webkit-backdrop-filter: ${a}`].filter(t=>!!t),style:i,color:o}}i.d(e,["gx",0,r])},4445(t,e,i){function r(t,e){if("string"!=typeof t)return;const i=t.trim();if(!i||i.length>(/^data:/i.test(i)?2e6:8192))return;if(/^[\\/]{2}/.test(i)||/[{}<>\\"`]/.test(i)||/\burl\s*\(/i.test(i))return;let r;try{r=new URL(i,e)}catch{return}return r.username||r.password?void 0:"http:"===r.protocol||"https:"===r.protocol||"data:"===r.protocol&&/^data:image\/(png|jpe?g|gif|webp|avif|bmp)[;,]/i.test(r.href)?r.href:void 0}i.d(e,{e:()=>r})},187(t,e,i){i.d(e,{j_:()=>d});const r={__proto__:null,winter:[20,0,0,0],spring:[0,0,18,20],christmas:[20,20,20,20],halloween:[0,0,30,0]},o=["christmas","halloween"],n=t=>"string"==typeof t&&""!==t.trim()?t.trim():void 0,s=t=>!1===t||"string"==typeof t&&"off"===t.trim().toLowerCase();function a(t,e){return t&&e?[Math.max(t[0],e[0]),Math.max(t[1],e[1]),Math.max(t[2],e[2]),Math.max(t[3],e[3])]:t??e}const c=t=>!!t&&"object"==typeof t&&!Array.isArray(t);function d(t,e){const i=a(function(t){if(!c(t))return;let e;if(Array.isArray(t.animations))for(const i of t.animations)c(i)&&!1!==i.decorations&&(e=a(e,r[n(i.preset)??""]));else e=r[n(t.animation_preset)??""];return e}(t),function(t){if(null==t||!1===t)return;const e=!0===t?{}:"string"==typeof t?{scene:t}:c(t)?t:void 0;if(!e||!1===e.decorations)return;const i=Array.isArray(e.combine)?e.combine:"string"==typeof e.combine?[e.combine]:[],n=c(e.calendar)?e.calendar:{};let d;for(const t of[void 0===e.scene?"auto":e.scene,...i])if("auto"===t){d=a(d,a(r.winter,r.spring));for(const t of o)s(n[t])||(d=a(d,r[t]))}else"string"==typeof t&&(d=a(d,r[t]));return d}(e));return i&&i.some(t=>t>0)?[...i]:void 0}i.d(e,["GN",0,r,"HT",0,"mc-seasonal-preview","Q9",0,["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight","snow","rain","storm","sun","clouds","fog","wind","night","dusk"]])},5767(t,e,i){var r=i(9639);let o;i.d(e,["En",0,()=>o?.load()??Promise.resolve(!1),"Lu",0,()=>!!o?.ready(),"M3",0,t=>{o=t,o?.whenReady(()=>(0,r.uD)(o.module().buildCustom))}])},9639(t,e,i){i.d(e,{TV:()=>R,aK:()=>Q,dC:()=>l,ie:()=>j,j9:()=>H,kz:()=>y,q8:()=>W,uD:()=>D});const r=new Set(["custom","squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]),o=.5522847498,n=(Math.SQRT1_2,1.5),s={smoothing:.6,corner:16,amplitude:8,waves:3,seed:7,wobble:.25},a=(t,e,i)=>Math.min(i,Math.max(e,t)),c=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},d=(t,e)=>({x:t,y:e});function l(t,e){let i;return i="string"==typeof t&&/^\s*-?\d*\.?\d+\s*%\s*$/.test(t)?parseFloat(t)/100*e:"string"==typeof t&&/^\s*-?\d*\.?\d+\s*(px)?\s*$/i.test(t)?parseFloat(t):c(t),void 0!==i&&Number.isFinite(i)&&i>=0?i:void 0}const u=(t,e,i)=>d(t.x+(e.x-t.x)*i,t.y+(e.y-t.y)*i),m=(t,e)=>Math.hypot(e.x-t.x,e.y-t.y);function h(t,e){if(e<=0)return{start:t[0],segs:[...t.slice(1),t[0]].map(t=>({to:t}))};const i=t.length,r=t.map((r,o)=>{const n=t[(o+i-1)%i],s=t[(o+1)%i],a=Math.min(e,m(n,r)/3),c=Math.min(e,m(r,s)/3);return{v:r,a:u(r,n,a/(m(n,r)||1)),b:u(r,s,c/(m(r,s)||1))}}),o=[];return r.forEach((t,e)=>{o.push({c1:u(t.a,t.v,2/3),c2:u(t.b,t.v,2/3),to:t.b}),o.push({to:r[(e+1)%i].a})}),{start:r[0].a,segs:o}}function p(t,e,i){const r=[];for(let o=0;o+1<t.length;o++){const n=t[o],s=t[o+1];r.push({c1:d(n.x+e[o].x*i/3,n.y+e[o].y*i/3),c2:d(s.x-e[o+1].x*i/3,s.y-e[o+1].y*i/3),to:s})}return r}function f(t,e){const i=t.length;return t.map((r,o)=>{const n=e?t[(o+i-1)%i]:t[Math.max(0,o-1)],s=e?t[(o+1)%i]:t[Math.min(i-1,o+1)],a=e||o>0&&o<i-1?.5:1;return d((s.x-n.x)*a,(s.y-n.y)*a)})}function g(t,e,i,r,o){const n=[],s=d(i,0);let a=s;for(const[s,c]of v(t,e,i)){const t=y(s,c,i,r,o);m(a,t.from)>1e-9&&n.push({to:t.from}),n.push(...t.segs),a=n[n.length-1].to}return m(a,s)>1e-9&&n.push({to:s}),{start:s,segs:n}}const v=(t,e,i)=>[[d(t-i,i),-90],[d(t-i,e-i),0],[d(i,e-i),90],[d(i,i),180]];function y(t,e,i,r,n){const s=e=>{const o=e*Math.PI/180,n=Math.cos(o),s=Math.sin(o),a=2/r;return d(t.x+i*Math.sign(n)*Math.abs(n)**a,t.y+i*Math.sign(s)*Math.abs(s)**a)},a=s(e),c=e*Math.PI/180,l=(e+90)*Math.PI/180;if(2===r){const t=s(e+90);return{from:a,segs:[{c1:d(a.x-Math.sin(c)*i*o,a.y+Math.cos(c)*i*o),c2:d(t.x+Math.sin(l)*i*o,t.y-Math.cos(l)*i*o),to:t}]}}const u=[];for(let t=0;t<=n;t++)u.push(s(e+90*t/n));const m=f(u,!1),h=Math.hypot(m[0].x,m[0].y),g=Math.hypot(m[n].x,m[n].y);return m[0]=d(-Math.sin(c)*h,Math.cos(c)*h),m[n]=d(-Math.sin(l)*g,Math.cos(l)*g),{from:a,segs:p(u,m,1)}}const b=t=>.6*(1-.5**(1/t)),_=b(2),w=(t,e)=>Math.max(t,Math.min(e.top,e.bottom)),$=(t,e)=>Math.max(t,Math.min(e.left,e.right)),x=t=>Math.max(0,(t-Math.min(70,.85*t))/2);function k(t,e,i,r){if(!(t>0))return{top:0,right:0,bottom:0,left:0};const o=2===e?.1:.25,n=Math.max(0,Math.min(t,x(r)-o)),s=t-Math.max(0,t**e-(t-n)**e)**(1/e),a=Math.min(Math.max(t*b(e),s),t*(1-.5**(1/e))),c=function(t,e,i){if(!(t>0)||i>=t)return 0;const r=t-Math.max(0,i);return t-Math.max(0,t**e-r**e)**(1/e)}(t,e,w(a,i))+o;return{top:a,right:c,bottom:a,left:c}}function A(t,e,i,r,o){const n=(t-Math.max(0,x(2*t)-.1))/(i*t),s=n<1?Math.sqrt(1-n*n):0,c=e-i*e*a(Math.min(1-_,s),o,1),d=a((e-w(c,r))/(i*e),0,1),l=t-i*t*Math.sqrt(1-d*d)+.1;return{top:c,right:l,bottom:c,left:l}}function M(t,e,i,r,u={top:0,right:0,bottom:0,left:0}){const v=Math.min(e,i),y=(t,e)=>a(l(r.corner,v)??t,0,e);switch(t){case"custom":return O?.(e,i,r);case"squircle":{const t=3+5*(1-a(c(r.smoothing)??s.smoothing,0,1)),o=y(v/2,v/2);return o<=0?{start:d(0,0),segs:[{to:d(e,0)},{to:d(e,i)},{to:d(0,i)}],inset:{top:0,right:0,bottom:0,left:0}}:{...g(e,i,o,t,16),inset:k(o,t,u,e)}}case"pill":{const t=v/2;return{...g(e,i,t,2,1),inset:k(t,2,u,e)}}case"circle":{const t=e/2,r=i/2,n=t*o,s=r*o,a=[{c1:d(t+n,0),c2:d(e,r-s),to:d(e,r)},{c1:d(e,r+s),c2:d(t+n,i),to:d(t,i)},{c1:d(t-n,i),c2:d(0,r+s),to:d(0,r)},{c1:d(0,r-s),c2:d(t-n,0),to:d(t,0)}];return{start:d(t,0),segs:a,inset:A(t,r,1,u,.5)}}case"notch":case"octagon":{const o=S(t,e,i,r),s=[d(o,0),d(e-o,0),d(e,o),d(e,i-o),d(e-o,i),d(o,i),d(0,i-o),d(0,o)],a="octagon"===t&&o>0?.2*n:0,c=o/4+a,l=Math.max(0,o-w(o/4,u))+2*a;return{...h(T(s),"octagon"===t?n:0),inset:{top:c,right:l,bottom:c,left:l}}}case"hexagon":{const{pts:t,c:o,wide:s}=z(e,i,r),a=o>0?.375:0,c=(t,e)=>Math.max(0,o*(1-2*t/e))+2*a,d=s?{top:a,right:c(w(a,u),i),bottom:a,left:c(w(a,u),i)}:{top:c($(a,u),e),right:a,bottom:c($(a,u),e),left:a};return{...h(T(t),n),inset:d}}case"ticket":{const t=y(s.corner,Math.min(i/2,e/4)),r=i/2,n=t*o,a=[{to:d(e,0)}];return t>0&&a.push({to:d(e,r-t)},{c1:d(e-n,r-t),c2:d(e-t,r-n),to:d(e-t,r)},{c1:d(e-t,r+n),c2:d(e-n,r+t),to:d(e,r+t)}),a.push({to:d(e,i)},{to:d(0,i)}),t>0&&a.push({to:d(0,r+t)},{c1:d(n,r+t),c2:d(t,r+n),to:d(t,r)},{c1:d(t,r-n),c2:d(n,r-t),to:d(0,r-t)}),a.push({to:d(0,0)}),{start:d(0,0),segs:j(d(0,0),a),inset:{top:0,right:t,bottom:0,left:t}}}case"wave":return function(t,e,i){const r=N.includes(i.edge)?i.edge:"bottom",n="all"===r,u=t=>n||r===t,h=Math.min(t,e),f="top"===r||"bottom"===r?e:t,g=a(l(i.amplitude,h)??s.amplitude,0,n?h/8:f/4),v=Math.round(c(i.waves)??s.waves),y=void 0!==c(i.phase),b=y?c(i.phase):0,_=[d(0,0),d(t,0),d(t,e),d(0,e)],w=[d(1,0),d(0,1),d(-1,0),d(0,-1)],$=[d(0,-1),d(1,0),d(0,1),d(-1,0)],x=n&&g>0?g:0,k=x*o,A=d(x,0),M=[];["top","right","bottom","left"].forEach((t,e)=>{const i=w[e],r=_[(e+1)%4],o=d(_[e].x+i.x*x,_[e].y+i.y*x),s=d(r.x-i.x*x,r.y-i.y*x);if(!u(t)||g<=0)M.push({to:s});else{const t=m(o,s),i=a(v,1,Math.max(1,Math.min(50,Math.floor(t/(2.5*g))))),r=$[e],c=8*i,l=n&&y,u=t=>{if(!l)return 1;const e=a(2*Math.min(t,1-t)*i,0,1);return e*e*(3-2*e)},h=t=>(g*Math.cos(2*Math.PI*(i*t+b))-g)*u(t),f=t=>{if(!l)return 2*-g*Math.PI*i*Math.sin(2*Math.PI*(i*t+b));const e=1e-5,r=Math.max(0,t-e),o=Math.min(1,t+e);return(h(o)-h(r))/(o-r)},_=[],w=[];for(let t=0;t<=c;t++){const e=t/c,i=h(e),n=f(e);_.push(d(o.x+(s.x-o.x)*e+r.x*i,o.y+(s.y-o.y)*e+r.y*i)),w.push(d(s.x-o.x+r.x*n,s.y-o.y+r.y*n))}y&&!n&&M.push({to:_[0]}),M.push(...p(_,w,1/c)),y&&!n&&M.push({to:s})}if(x>0){const t=w[(e+1)%4],o=d(r.x+t.x*x,r.y+t.y*x);M.push({c1:d(s.x+i.x*k,s.y+i.y*k),c2:d(o.x-t.x*k,o.y-t.y*k),to:o})}});const S=2*g;return{start:A,segs:M,inset:{top:u("top")?S:0,right:u("right")?S:0,bottom:u("bottom")?S:0,left:u("left")?S:0}}}(e,i,r);case"blob":return function(t,e,i,r){const o=a(c(i.wobble)??s.wobble,0,1),n=function(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,1|t),t^=t+Math.imul(t^t>>>7,61|t),((t^t>>>14)>>>0)/4294967296}}(function(t){const e=c(t);return void 0!==e?Math.round(e):"string"==typeof t&&t?[...t].reduce((t,e)=>Math.imul(t,31)+e.charCodeAt(0)|0,7):s.seed}(i.seed)),l=t/2,u=e/2,m=[];for(let t=0;t<12;t++){const e=1-.5*o*n(),i=2*Math.PI*t/12-Math.PI/2;m.push(d(l+l*e*Math.cos(i),u+u*e*Math.sin(i)))}const h=function(t){const e=f(t,!0);return{start:t[0],segs:p([...t,t[0]],[...e,e[0]],1)}}(m);let g=1,v=h.start;for(const t of h.segs){const e=t.c1??v,i=t.c2??t.to;for(let r=1;r<=32;r++){const o=r/32,n=1-o,s=n*n*n*v.x+3*n*n*o*e.x+3*n*o*o*i.x+o*o*o*t.to.x,a=n*n*n*v.y+3*n*n*o*e.y+3*n*o*o*i.y+o*o*o*t.to.y;g=Math.min(g,Math.hypot((s-l)/l,(a-u)/u))}v=t.to}return{...h,inset:A(l,u,.99*g,r,.65)}}(e,i,r,u);default:return}}function S(t,e,i,r){const o=Math.min(e,i),n="notch"===t?s.corner:o/(2+Math.SQRT2);return a(l(r.corner,o)??n,0,o/2)}function C(t,e,i){const r=Math.min(t,e);return a(l(i.corner,r)??r/2,0,r/2)}function z(t,e,i){const r=Math.min(t,e),o=a(l(i.corner,r)??r/2*Math.tan(Math.PI/6),0,r/2),n=t>=e;return{pts:n?[d(o,0),d(t-o,0),d(t,e/2),d(t-o,e),d(o,e),d(0,e/2)]:[d(t/2,0),d(t,o),d(t,e-o),d(t/2,e),d(0,e-o),d(0,o)],c:o,wide:n}}const E=(t,e)=>{const i=t=>d(t.x+e,t.y+e);return{start:i(t.start),segs:t.segs.map(t=>t.c1&&t.c2?{c1:i(t.c1),c2:i(t.c2),to:i(t.to)}:{to:i(t.to)}),inset:t.inset}};function T(t){const e=t.filter((e,i)=>m(e,t[(i+1)%t.length])>1e-9);return e.length>=3?e:t}function j(t,e){let i=t;return e.filter(t=>{const e=!!t.c1||m(i,t.to)>1e-9;return e&&(i=t.to),e})}const N=["top","right","bottom","left","all"],q=t=>{const e=Math.round(100*t)/100;return String(Object.is(e,-0)?0:e)};function P(t,e,i){const r=t=>`${q(a(t.x,0,e))} ${q(a(t.y,0,i))}`,o=[`M${r(t.start)}`];for(const e of t.segs)o.push(e.c1&&e.c2?`C${r(e.c1)} ${r(e.c2)} ${r(e.to)}`:`L${r(e.to)}`);return o.push("Z"),o.join(" ")}function R(t,e,i,r){if(t.length<2)return"";const o=r?function(t){const e=t.length,i=t.slice(1).map((e,i)=>e.x-t[i].x),r=t.slice(1).map((e,r)=>i[r]>0?(e.y-t[r].y)/i[r]:0),o=t.map((t,i)=>0===i?r[0]:i===e-1?r[e-2]:r[i-1]*r[i]<=0?0:(r[i-1]+r[i])/2);for(let t=0;t<e-1;t++){if(0===r[t]){o[t]=0,o[t+1]=0;continue}const e=o[t]/r[t],i=o[t+1]/r[t],n=e*e+i*i;if(n>9){const s=3/Math.sqrt(n);o[t]=s*e*r[t],o[t+1]=s*i*r[t]}}return t.slice(1).map((e,r)=>{const n=t[r],s=i[r]/3;return{c1:d(n.x+s,n.y+o[r]*s),c2:d(e.x-s,e.y-o[r+1]*s),to:e}})}(t):t.slice(1).map(t=>({to:t}));return P({start:t[0],segs:o,inset:{top:0,right:0,bottom:0,left:0}},e,i).replace(/ Z$/,"")}let O;function D(t){O=t,U.clear()}const L=new WeakMap,U=new Map;function I(t,e,i,o,s=0,a){if(!((t,e,i)=>r.has(t)&&Number.isFinite(e)&&Number.isFinite(i)&&e>0&&i>0)(t,e,i))return;if("custom"===t&&!O)return;const c=o&&"object"==typeof o?o:{},l=a&&"custom"!==t?F(a):{top:0,right:0,bottom:0,left:0},u=`${t}|${e}|${i}|${s}|${l.top},${l.right},${l.bottom},${l.left}|${(t=>{let e=L.get(t);return void 0===e&&L.set(t,e=JSON.stringify(t)),e})(c)}`;if(U.has(u)){const t=U.get(u);return U.delete(u),U.set(u,t),t}const p=s>0?function(t,e,i,r,o){if(!(o>0))return M(t,e,i,r);const s=e-2*o,a=i-2*o;if(!(s>0&&a>0))return;if("custom"===t)return O?.(e,i,r,o);let c=r;if("notch"===t||"octagon"===t)c={...r,corner:Math.max(0,S(t,e,i,r)-(2-Math.SQRT2)*o)};else if("squircle"===t)c={...r,corner:Math.max(0,C(e,i,r)-o)};else if("hexagon"===t){const t=function(t,e){const i=t.length,r=t.map((r,o)=>{const n=t[(o+1)%i],s=m(r,n)||1,a=d(n.x-r.x,n.y-r.y);return{at:d(r.x-a.y/s*e,r.y+a.x/s*e),dir:a}}),o=r.map((t,e)=>{const o=r[(e+i-1)%i],n=o.dir.x*t.dir.y-o.dir.y*t.dir.x;if(Math.abs(n)<1e-12)return t.at;const s=((t.at.x-o.at.x)*t.dir.y-(t.at.y-o.at.y)*t.dir.x)/n;return d(o.at.x+o.dir.x*s,o.at.y+o.dir.y*s)});for(let t=0;t<i;t++){const e=o[t],n=o[(t+1)%i];if((n.x-e.x)*r[t].dir.x+(n.y-e.y)*r[t].dir.y<=1e-9)return}return o}(z(e,i,r).pts,o);if(t)return{...h(T(t),n),inset:{top:0,right:0,bottom:0,left:0}}}const l=M(t,s,a,c);return l&&E(l,o)}(t,e,i,c,s):M(t,e,i,c,l),f=p?{d:P(p,e,i),inset:(g=p.inset,{top:Math.round(100*g.top)/100,right:Math.round(100*g.right)/100,bottom:Math.round(100*g.bottom)/100,left:Math.round(100*g.left)/100}),b:p,w:e,h:i}:void 0;var g;return U.set(u,f),U.size>256&&U.delete(U.keys().next().value),f}const F=t=>{const e=t=>"number"==typeof t&&Number.isFinite(t)&&t>0?Math.round(100*t)/100:0;return{top:e(t.top),right:e(t.right),bottom:e(t.bottom),left:e(t.left)}};function H(t,e,i,r={},o){const n=I(t,e,i,r,0,o);return n&&{d:n.d,inset:{...n.inset}}}function W(t,e,i,r,o){return I(t,e,i,r,Math.max(0,o))?.d}function Q(t,e,i,r,o,n=.5){const s=I(t,e,i,r);if(!s)return;const c=s.poly??=function(t,e,i){const r=t=>d(a(t.x,0,e),a(t.y,0,i)),o=[r(t.start)];let n=o[0];for(const e of t.segs){const t=r(e.to);if(e.c1&&e.c2){const i=r(e.c1),s=r(e.c2);for(let e=1;e<=16;e++){const r=e/16,a=1-r;o.push(d(a*a*a*n.x+3*a*a*r*i.x+3*a*r*r*s.x+r*r*r*t.x,a*a*a*n.y+3*a*a*r*i.y+3*a*r*r*s.y+r*r*r*t.y))}}else o.push(t);n=t}return o}(s.b,e,i),l="top"===o||"bottom"===o,u=a(Number.isFinite(n)?n:.5,0,1)*(l?e:i),m=[];for(let t=0;t+1<c.length;t++){const e=c[t],i=c[t+1],[r,o,n,s]=l?[e.x,i.x,e.y,i.y]:[e.y,i.y,e.x,i.x];u<Math.min(r,o)-1e-9||u>Math.max(r,o)+1e-9||(Math.abs(o-r)<1e-9?m.push(n,s):m.push(n+(u-r)/(o-r)*(s-n)))}if(!m.length)return;const h="top"===o||"left"===o?Math.min(...m):Math.max(...m),p=t=>{const e=Math.round(100*t)/100;return Object.is(e,-0)?0:e};return l?{x:p(u),y:p(h)}:{x:p(h),y:p(u)}}i.d(e,["JM",0,s,"KY",0,v,"Tl",0,E,"p",0,d,"qE",0,a])},4243(t,e,i){i.d(e,{S:()=>n,l:()=>o});const r=new WeakMap;function o(t,e){if(!t.ref)return t;const i=(e?.library(t.ref)??e?.inline(t.ref))||{},o=r.get(t);if(o?.[0]===i)return o[1];const s=n(i,t);return r.set(t,[i,s]),s}function n(t,e){const i={...t,...e};return delete i.ref,t.corners&&e.corners&&(i.corners={...t.corners,...e.corners}),i}},9486(t,e,i){let r;i.d(e,["H7",0,()=>r,"Si",0,()=>r?.module()?.api,"qb",0,t=>{r=t}])},9434(t,e,i){let r;i.d(e,["q",0,t=>{r=t},"s",0,t=>{r?.load(),t?.metChunk?.("svg-image")}])},5792(t,e,i){i.d(e,{Bw:()=>s,M8:()=>c,R7:()=>d,TC:()=>l,_p:()=>a,dU:()=>n});var r=i(7423);const o=/^(?:none|hidden|solid|dashed|dotted|double|groove|ridge|inset|outset)$/;function n(t){const e=(0,r.f8)(t);return e&&("undefined"==typeof CSS||"function"!=typeof CSS.supports||CSS.supports("color",e))?e:void 0}function s(t,e,i,o){const n=(0,r.VC)(t,e);return n&&n.split(" ").every(t=>parseFloat(t)<=i&&(o||!t.endsWith("%")))?n:void 0}function a(t,e){const i=[];let r=0,o=0;for(let n=0;n<=t.length;n++){const s=t[n];if("("===s?r++:")"===s&&r--,n===t.length||0===r&&(","===e?","===s:/\s/.test(s))){const e=t.slice(o,n).trim();e&&i.push(e),o=n+1}}return i}function c(t){const e=(0,r.gx)(t);if(!e||e.length>256)return;const i=a(e," ");if(1===i.length)return n(e);if(i.length>4)return;const o=i.map(n);return o.every(Boolean)?o.join(" "):void 0}function d(t){const e=(0,r.gx)(t)?.toLowerCase();if(!e||e.length>256)return;const i=e.split(/\s+/);return i.length<=4&&i.every(t=>o.test(t))?i.join(" "):void 0}function l(t){const e=t&&"object"==typeof t&&!Array.isArray(t)?t:{},i=s(e.border_width,4,32,!1),r=d(e.border_style)??(i?"solid":void 0),o=c(e.border_color);return[i&&`border-width: ${i}`,r&&`border-style: ${r}`,o&&`border-color: ${o}`].filter(Boolean).join("; ")}},9853(t,e,i){var r=i(7921),o=i(1476);const n=t=>{const e=(0,o.vt)(t);return"active"===e?.state&&void 0!==e.end&&e.end>Date.now()};class s extends r.Kq{render(t){return(0,o.HF)(t)??""}update(t,[e]){this._state=e;const i=t.parentNode,r=1===i?.nodeType?i:null;return r!==this._el&&(this._tick?.run(!1),this._el=r??void 0,this._tick=r?new o.bU(r,()=>{this.setValue(this.render(this._state)),n(this._state)||this._tick?.run(!1)}):void 0),this._tick?.run(this.isConnected&&n(e)),this.render(e)}disconnected(){this._tick?.run(!1)}reconnected(){this._tick?.run(n(this._state))}}const a=(0,r.u$)(s);i.d(e,["q",0,a])},1476(t,e,i){i.d(e,{HF:()=>a,bU:()=>l,vt:()=>s});var r=i(3852);const o=t=>!!t&&t.startsWith("timer.");function n(t){if("number"==typeof t)return Number.isFinite(t)&&t>=0?1e3*t:void 0;if("string"!=typeof t)return;const e=/^\s*(?:(\d+)\s+days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?\s*$/.exec(t);if(!e)return;const[,i,r,o,n]=e;return 1e3*(3600*(24*Number(i||0)+Number(r))+60*Number(o)+Number(n||0))}function s(t,e=Date.now()){if(!t||!o(t.entity_id))return;const i=t.attributes||{},r=n(i.duration),s=n(i.remaining),a=t.state;if("active"===a){const o="string"==typeof i.finishes_at?Date.parse(i.finishes_at):NaN;if(Number.isFinite(o))return{state:a,remaining:Math.max(0,o-e),total:r??s??0,end:o};if(void 0===s)return;const n="string"==typeof t.last_updated?Date.parse(t.last_updated):NaN;return Number.isFinite(n)?{state:a,remaining:Math.max(0,n+s-e),total:r??s,end:n+s}:{state:a,remaining:s,total:r??s}}return"paused"===a?void 0===s?void 0:{state:a,remaining:s,total:r??s}:{state:"idle",remaining:0,total:r??0}}function a(t,e=Date.now()){const i=s(t,e);if(i&&"idle"!==i.state)return function(t){const e=Math.max(0,Math.ceil(t/1e3)),i=Math.floor(e/3600),r=Math.floor(e%3600/60),o=String(e%60).padStart(2,"0");return i?`${i}:${String(r).padStart(2,"0")}:${o}`:`${r}:${o}`}(void 0!==i.end?i.end-e:i.remaining)}const c=new Set;let d;class l{constructor(t,e){this._el=t,this._cb=e,this._on=!1}run(t){t!==this._on&&(this._on=t,t?(0,r.jR)(this._el,t=>this._tick(t),{pausable:!1})||this._tick(!0):((0,r.eF)(this._el),this._tick(!1)))}_tick(t){var e;t&&!this._off?this._off=(e=this._cb,c.add(e),d??=setInterval(()=>c.forEach(t=>t()),1e3),()=>{c.delete(e),c.size||void 0===d||(clearInterval(d),d=void 0)}):!t&&this._off&&(this._off(),this._off=void 0)}}i.d(e,["Yj",0,(t,e=Date.now())=>{const i=void 0!==t.end?Math.max(0,t.end-e):t.remaining;return t.total>0?Math.min(1,i/t.total):0},"_7",0,o])},1214(t,e,i){i.d(e,{p:()=>n});var r=i(3925),o=i(7423);function n(t,e,i){const n=(0,o.gx)(t.trigger_entity);switch(n&&(e=i?.[n]),t.trigger){case"entity_on":return(0,r.mu)(e);case"state":{const i=(t.state||"").trim();return!!i&&!!e&&e.state===i}default:return!0}}},5520(t,e,i){i.d(e,{Ih:()=>u,dh:()=>m,mU:()=>h});var r=i(3098),o=i(9136),n=i(9639),s=i(4802);const a={color:"var(--mc-primary, var(--primary-color))",opacity:.25,areaOpacity:.18,lineOpacity:.45,hours:24,maxHours:168,lineWidth:1.5,maxPoints:60},c=["up","down","left","right"],d=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},l=(t,e)=>{const i=d(t);return void 0!==i&&i>0?i:e};function u(t,e){if(!t||"object"!=typeof t)return;if("fill"!==t.type&&"sparkline"!==t.type)return;const i=t.entity||e.entity;if(!i)return;const n=e.hass?.states?.[i],s=t.attribute||void 0,u=d(t.min),m=d(t.max),h="fill"===t.type,p=(0,o.wb)(t.color),f={type:t.type,color:p?.stops[0]??(0,r.dU)(t.color,n)??a.color,paint:p&&t.color,opacity:(0,r.uM)(t.opacity)??(h?a.opacity:a.areaOpacity),direction:c.includes(t.direction)?t.direction:"up",wave:!1!==t.wave,hours:Math.min(a.maxHours,l(t.hours,a.hours)),lineWidth:l(t.line_width,a.lineWidth),area:!1!==t.area,smoothing:!1!==t.smoothing,entity:i};return h&&(f.level=(0,r.EN)(n,s,u,m)),s&&(f.attribute=s),void 0!==u&&(f.min=u),void 0!==m&&(f.max=m),f}function m(t,e,i,r){const o=(Array.isArray(t)?t:[]).filter(t=>t&&Number.isFinite(t.t)&&Number.isFinite(t.v)).sort((t,e)=>t.t-e.t);if(!o.length||!(e>0&&i>0))return{line:""};const c=d(r.start)??o[0].t,l=d(r.end)??o[o.length-1].t;if(!(l>c))return{line:""};const u=o.filter(t=>t.t<=l).map(t=>({t:Math.max(t.t,c),v:t.v}));if(!u.length)return{line:""};const m=a.maxPoints-1;let h=u.length>m?(0,s.pz)(u,c,l,m):u;h!==u&&h.length&&(h[0]={t:Math.min(h[0].t,u[0].t),v:h[0].v}),h=h.filter((t,e)=>e===h.length-1||h[e+1].t>t.t);const p=d(r.hold)??u[u.length-1].v,f=h[h.length-1].t<l;if(f&&h.push({t:l,v:p}),h.length<2)return{line:""};let g=1/0,v=-1/0;for(const t of h)t.v<g&&(g=t.v),t.v>v&&(v=t.v);let y=d(r.min),b=d(r.max);void 0!==y&&void 0!==b&&y>b&&([y,b]=[b,y]);const _=y??Math.min(g,b??g),w=(b??Math.max(v,y??v))-_,$=void 0===y&&void 0===b?.5:void 0===b?0:void 0===y?1:.5,x=Math.min(Math.max(0,d(r.pad)??2),i/4),k=h.map(t=>{return{x:(t.t-c)/(l-c)*e,y:i-x-(r=t.v,(w>0?Math.min(1,Math.max(0,(r-_)/w)):$)*(i-2*x))};var r}),A=(0,n.TV)(k,e,i,r.smoothing);if(!A)return{line:""};const M=t=>String(Math.round(100*t)/100),S={line:A};if(r.splitHeld&&f){const t=k[k.length-2],o=k[k.length-1];S.line=k.length>2?(0,n.TV)(k.slice(0,-1),e,i,r.smoothing):"",S.tail=`M${M(t.x)} ${M(t.y)} L${M(o.x)} ${M(o.y)}`}return r.area&&(S.area=`${A} L${M(k[k.length-1].x)} ${M(i)} L${M(k[0].x)} ${M(i)} Z`),S}function h(t,e,i){const r=(Array.isArray(t)?t:[]).filter(t=>t&&Number.isFinite(t.t)&&Number.isFinite(t.v)&&t.t<=i).sort((t,e)=>t.t-e.t).map(t=>({t:Math.max(t.t,e),v:t.v}));if(!r.length)return{points:[]};const o=r[r.length-1].v,n=a.maxPoints-2;if(r.length<=n||!(i>e))return{points:r,last:o};const c=(0,s.pz)(r,e,i,n);return c.length&&(c[0]={t:Math.min(c[0].t,r[0].t),v:c[0].v}),{points:c,last:o}}i.d(e,["BJ",0,a])},8764(t,e,i){i.d(e,["x",0,"2026.10.12-beta.11"])},7935(t,e,i){i.d(e,{c:()=>l});var r=i(2618),o=i(9682),n=i(9851);const s=r.AH`.mc-n{display:flex;flex-wrap:wrap;align-items:center;gap:8px;box-sizing:border-box;width:100%;padding:8px;background:var(--mc-bg,#fff);color:var(--mc-text,#212121);border:1px solid var(--mc-border,currentColor);border-radius:var(--mc-radius,8px)}.mc-n ha-icon{--mdc-icon-size:18px;color:var(--error-color,#db4437)}.mc-n span{flex:1 1 12em}.mc-n button{min-height:44px;padding:var(--mc-button-padding,10px 16px);border:1px solid var(--mc-text,currentColor);border-radius:var(--mc-button-radius,8px);background:transparent;color:inherit;font:inherit;cursor:pointer}.mc-n button:focus{outline:2px solid var(--mc-text,#212121);outline-offset:2px}.mc-v{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}`,a=t=>{const e=(0,n.t)(49),i=(0,n.t)(55);return{anim:e,"anim-runtime":e,particles:e,"shape-custom":(0,n.t)(51),seasonal:(0,n.t)(54),layers:(0,n.t)(50),"flow-look":(0,n.t)(52),"slider-look":i,slider:i,markdown:(0,n.t)(56),"svg-icon":(0,n.t)(53)}[t]??(0,n.t)(28)},c=()=>location.reload(),d=new WeakMap;function l(t){let e=d.get(t);e||d.set(t,e={});const i="mismatch"===t.failure(),s="mc-m-"+t.name;return e.shown&&!t.failed()?(e.shown=e.busy=e.again=!1,e.done=(0,n.t)(69,{part:a(t.name)}),setTimeout(()=>(e.done="",(0,o.QC)()),1500)):t.failed()&&!e.shown&&requestAnimationFrame(()=>(e.shown=t.failed(),(0,o.QC)())),r.qy`<div role="status" aria-live="polite" aria-busy=${e.busy?"true":"false"}>${e.shown&&t.failed()?r.qy`<div class="mc-n"><ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon> <span id=${s} >${i?(0,n.t)(17):e.again?(0,n.t)(43):(0,n.t)(68,{part:a(t.name)})}</span > <button type="button" aria-describedby=${s} aria-disabled=${e.busy?"true":r.s6} @click=${i?c:i=>async function(t,e,i){if(e.busy)return;const r=i.currentTarget.closest("[role=status]"),n=r.contains(r.getRootNode().activeElement);e.busy=!0,(0,o.QC)();const s=await t.retry();e.busy=!1,e.again=!s,s&&n&&(r.tabIndex=-1,r.focus(),r.addEventListener("blur",()=>r.removeAttribute("tabindex"),{once:!0})),(0,o.QC)()}(t,e,i)}> ${i?(0,n.t)(32):(0,n.t)(58)} </button> ${e.again&&!i?r.qy`<button type="button" aria-describedby=${s} @click=${c}>${(0,n.t)(32)}</button>`:r.s6}</div>`:e.done?r.qy`<span class="mc-v">${e.done}</span>`:r.s6}</div>`}i.d(e,["V",0,s])},9851(t,e,i){i.d(e,{t:()=>o});var r=i(4753);const{t:o,tc:n,tx:s,m:a}=(0,r.my)("card",['Activate {name}|Activate {type} module|Button|Card config must be a mapping|Close|Config must be an object|Config must have a rows array|Config must have a type|Couldn\'t set {name}|Day {n}|Empty column|Empty row|Empty slider|Entity is required|Entity is required when using entity picture|Invalid configuration: {errors}|Loading card...|Magic Card was updated. Reload the page to see this part. The rest of this card works.|Magic Card: the visual editor could not be loaded.|Markdown content is required|Min must be less than max|Needs another device|Next slide|No card type set|No configuration|No configuration provided|No entity|Not updated {n} min|Part of this card|Pause motion|Pop-up|Previous slide|Reload page|Row {row} must have a columns array|Row {row}, Col {col}, Module {module} ({type}): {error}|Row {row}, Col {col}, Module {module}: layer must be an object|Row {row}, Col {col}, Module {module}: missing type|Row {row}, Col {col}, Module {module}: must be an object|Row {row}, Col {col}, Module {module}: unknown placement|Row {row}, Col {col}, Module {module}: unknown type "{type}"|Row {row}, Column {col} must have a modules array|Slider|Step must be greater than 0|Still not loading. Try again in a moment, or reload the page.|Template "{name}" couldn\'t be loaded. Showing this card\'s own settings.|Template "{name}" wasn\'t found. Showing this card\'s own settings.|Template error: {error}|Template is required|Text content is required|The animation|The background|The custom shape|The flow style|The icon|The seasonal effect|The slider|The text block|Timeout waiting for {tag}|Try again|Unavailable|Unknown module: {type}|background_layers must be a list|background_layers {index}: unknown layer type|background_layers: only the first {max} layers are used|layers_low_power must be true or false|pause_button must be auto, always or hidden|pause_button_corner is not a corner|unavailable|{part} did not load. The rest of this card works.|{part} loaded.','Activate {name}|Activate {type} module|Button|Card config must be a mapping|Close|Config must be an object|Config must have a rows array|Config must have a type|Couldn\'t set {name}|Day {n}|Empty column|Empty row|Empty slider|Entity is required|Entity is required when using entity picture|Invalid configuration: {errors}|Loading card...|Magic Card was updated. Reload the page to see this part. The rest of this card works.|Magic Card: the visual editor could not be loaded.|Markdown content is required|Min must be less than max|Needs another device|Next slide|No card type set|No configuration|No configuration provided|No entity|Not updated {n} min|Part of this card|Pause motion|Pop-up|Previous slide|Reload page|Row {row} must have a columns array|Row {row}, Col {col}, Module {module} ({type}): {error}|Row {row}, Col {col}, Module {module}: layer must be an object|Row {row}, Col {col}, Module {module}: missing type|Row {row}, Col {col}, Module {module}: must be an object|Row {row}, Col {col}, Module {module}: unknown placement|Row {row}, Col {col}, Module {module}: unknown type "{type}"|Row {row}, Column {col} must have a modules array|Slider|Step must be greater than 0|Still not loading. Try again in a moment, or reload the page.|Template "{name}" couldn\'t be loaded. Showing this card\'s own settings.|Template "{name}" wasn\'t found. Showing this card\'s own settings.|Template error: {error}|Template is required|Text content is required|The animation|The background|The custom shape|The flow style|The icon|The seasonal effect|The slider|The text block|Timeout waiting for {tag}|Try again|Unavailable|Unknown module: {type}|background_layers must be a list|background_layers {index}: unknown layer type|background_layers: only the first {max} layers are used|layers_low_power must be true or false|pause_button must be auto, always or hidden|pause_button_corner is not a corner|unavailable|{part} did not load. The rest of this card works.|{part} loaded.','{name} activeren|Module {type} activeren|Knop|De kaartconfiguratie moet een mapping zijn|Sluiten|De configuratie moet een object zijn|De configuratie moet een lijst met rijen (rows) bevatten|De configuratie moet een type bevatten|Kon {name} niet instellen|Dag {n}|Lege kolom|Lege rij|Lege schuifreeks|Een entiteit is verplicht|Een entiteit is verplicht bij een entiteitsafbeelding|Ongeldige configuratie: {errors}|Kaart laden...|Magic Card is bijgewerkt. Laad de pagina opnieuw om dit onderdeel te zien. De rest van deze kaart werkt.|Magic Card: de visuele editor kon niet worden geladen.|Markdown-inhoud is verplicht|Het minimum moet kleiner zijn dan het maximum|Heeft een ander apparaat nodig|Volgende dia|Geen kaarttype ingesteld|Geen configuratie|Geen configuratie opgegeven|Geen entiteit|{n} min niet bijgewerkt|Een onderdeel van deze kaart|Beweging pauzeren|Pop-up|Vorige dia|Pagina opnieuw laden|Rij {row} moet een lijst met kolommen (columns) bevatten|Rij {row}, kolom {col}, module {module} ({type}): {error}|Rij {row}, kolom {col}, module {module}: laag moet een object zijn|Rij {row}, kolom {col}, module {module}: type ontbreekt|Rij {row}, kolom {col}, module {module}: moet een object zijn|Rij {row}, kolom {col}, module {module}: onbekende plaatsing|Rij {row}, kolom {col}, module {module}: onbekend type "{type}"|Rij {row}, kolom {col} moet een lijst met modules (modules) bevatten|Schuifregelaar|De stapgrootte moet groter zijn dan 0|Laden lukt nog niet. Probeer het zo opnieuw, of laad de pagina opnieuw.|Sjabloon "{name}" kon niet worden geladen. De eigen instellingen van deze kaart worden getoond.|Sjabloon "{name}" is niet gevonden. De eigen instellingen van deze kaart worden getoond.|Templatefout: {error}|Een template is verplicht|Tekstinhoud is verplicht|De animatie|De achtergrond|De aangepaste vorm|De stroomstijl|Het pictogram|Het seizoenseffect|De schuifregelaar|Het tekstblok|Time-out bij het wachten op {tag}|Opnieuw proberen|Niet beschikbaar|Onbekende module: {type}|background_layers moet een lijst zijn|background_layers {index}: onbekend lagetype|background_layers: alleen de eerste {max} lagen worden gebruikt|layers_low_power moet true of false zijn|pause_button moet auto, always of hidden zijn|pause_button_corner is geen hoek|niet beschikbaar|{part} is niet geladen. De rest van deze kaart werkt.|{part} is geladen.'])},5181(t,e,i){i.d(e,{Rf:()=>o,vR:()=>a});var r=i(5832);function o(t){const e=(0,r.oi)(t);return!!(0,r.BI)(e)&&(window.location.hash===`#${e}`?(window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})),!0):(history.pushState(history.state,"",(0,r.WV)(window.location.href,e)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),!0))}const n={position:"absolute",width:"0",height:"0",margin:"0",padding:"0","min-height":"0",overflow:"visible"},s=new WeakMap;function a(t,e){const i=s.get(t);if(!e){for(const{el:t,saved:e}of i??[])for(const[i,r]of Object.entries(e))r?t.style.setProperty(i,r):t.style.removeProperty(i);return void s.delete(t)}if(i?.length)return;const r=[t],o=t.parentElement;if("hui-card"===o?.localName){r.push(o);const t=o.parentElement;"div"===t?.localName&&t.classList.contains("card")&&r.push(t)}s.set(t,r.map(t=>{const e={};for(const[i,r]of Object.entries(n))e[i]=t.style.getPropertyValue(i),t.style.setProperty(i,r);return{el:t,saved:e}}))}i.d(e,["XR",0,(t,e)=>(0,r.uT)(t)&&!e])},9948(t,e,i){var r=i(8805);i.d(e,["T",0,()=>r.tQ.popup.module()])},2770(t,e,i){i.d(e,{j:()=>n});var r=i(8805);const o=()=>r.tQ.seasonal.module()?.api;class n{constructor(t,e){this._host=t,this._opts=e,this._asked=!1}_controller(){if(this._ctl)return this._ctl;if(void 0===this._opts.config())return;const t=o();if(t)return this._ctl=new t.CardSeasonal(this._host,this._opts);this._asked||(this._asked=!0,(0,r.X$)().then(t=>t&&this._host.requestUpdate()))}resolve(){return this._controller()?.resolve()}changed(t){return this._ctl?.changed(t)??!1}seed(t){return o()?.seasonalSeed(t)??""}get timerPending(){return this._ctl?.timerPending??!1}}i.d(e,["n",0,o])},839(t,e,i){i.d(e,{E8:()=>l,WD:()=>c,a_:()=>a});var r=i(8726),o=i(4243),n=i(5767);const s=new Set(["custom","squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]);function a(t,e){const i=t?.shape;if(!i||!s.has(i))return;if("custom"===i&&!(0,n.Lu)())return void(0,n.En)();let r=t?.shape_options;return"custom"===i&&r&&"object"==typeof r&&(r=(0,o.l)(r,e)),r&&"object"==typeof r&&Object.keys(r).length?{kind:i,options:r}:{kind:i}}function c(t){const e=e=>"shapes"===e.detail?.kind&&t();return window.addEventListener(r.S,e),()=>window.removeEventListener(r.S,e)}let d;function l(){return void 0===d&&(d="undefined"==typeof CSS||"function"!=typeof CSS.supports||CSS.supports("clip-path",'path("M0 0")')),d}i.d(e,["p",0,t=>window.magicCardUtils?.shapes?.get(t)])},7608(t,e,i){function r(t){const e=t.offsetWidth,i=t.offsetHeight,r="function"==typeof t.getBoundingClientRect?t.getBoundingClientRect():void 0;return r&&Math.abs(r.width-e)<1&&Math.abs(r.height-i)<1?{w:r.width,h:r.height}:{w:e,h:i}}i.d(e,{Bi:()=>r,Ed:()=>a,vb:()=>s});const o=new Map;let n;function s(t,e){let i=o.get(t);i||(i=new Set,o.set(t,i),(n||"function"!=typeof ResizeObserver||(n=new ResizeObserver(t=>{for(const e of t)o.get(e.target)?.forEach(t=>t.measure())})),n)?.observe(t)),i.add(e)}function a(t,e){const i=o.get(t);i&&(i.delete(e),i.size||(o.delete(t),n?.unobserve(t)))}},5116(t,e,i){const r=i(2618).AH`:host{--mc-primary:var(--primary-color,#6366f1);--mc-bg:var(--card-background-color,#ffffff);--mc-text:var(--primary-text-color,#1a1a2e);--mc-text-secondary:var(--secondary-text-color,#6b7280);--mc-border:var(--divider-color,#e5e7eb);--mc-surface-recessed:color-mix(in srgb,var(--primary-text-color,#1a1a2e) 5%,transparent);--mc-primary-light:color-mix(in srgb,var(--mc-primary) 15%,transparent);--mc-gap:10px;--mc-gap-xs:4px;--mc-gap-sm:8px;--mc-gap-md:14px;--mc-padding:16px;--mc-radius:12px;--mc-radius-sm:4px;--mc-radius-md:8px;--mc-radius-lg:12px;--mc-font-size-xs:.75rem;--mc-font-size-sm:.875rem;--mc-font-size-md:1rem;--mc-font-size-lg:1.125rem;--mc-font-size-xl:1.25rem;--mc-font-size-2xl:1.5rem;--mc-transition-duration:.2s;--mc-icon-size-sm:18px;--mc-icon-size-md:24px;--mc-icon-size-lg:32px;--mc-icon-size-xl:36px;--mc-button-padding:10px 16px;--mc-button-padding-icon:8px;--mc-button-radius:var(--mc-radius-md);--mc-button-color:var(--primary-color,#03a9f4);--mc-button-text-color:var(--text-primary-color,#fff);--mc-button-font-size:var(--mc-font-size-md);--mc-button-icon-size:20px;--mc-slider-vertical-height:120px;--mc-slider-radius:var(--mc-radius-lg);--mc-light-color-temp:#ff9800;--mc-light-label-opacity:.7;--mc-light-color-input-size:32px;--mc-spinbox-gap:var(--mc-gap-md);--mc-spinbox-btn-size:32px;--mc-spinbox-btn-color:var(--primary-color,#03a9f4);--mc-spinbox-btn-text-color:var(--text-primary-color,#fff);--mc-spinbox-btn-font-size:18px;--mc-spinbox-value-font-size:20px;--mc-spinbox-value-font-weight:600;--mc-spinbox-value-min-width:40px;--mc-bar-height:8px;--mc-bar-radius:var(--mc-radius-sm);--mc-bar-transition:.3s ease;--mc-dropdown-padding:10px 14px;--mc-dropdown-radius:var(--mc-radius-md);--mc-dropdown-font-size:var(--mc-font-size-md);--mc-forecast-icon-size:20px;--mc-modal-radius:12px;--mc-modal-input-radius:6px;--mc-modal-overlay-bg:rgba(0,0,0,.5);--mc-modal-z-index:10000;--mc-modal-width:420px;--mc-modal-max-height:80vh;--mc-modal-shadow:0 20px 40px rgba(0,0,0,.3);--mc-modal-header-bg:var(--mc-bg);--mc-modal-item-gap:14px;--mc-modal-item-padding:14px 16px;--mc-modal-item-hover-bg:color-mix(in srgb,var(--mc-primary) 8%,transparent);--mc-modal-item-border:1px solid var(--mc-border);--mc-modal-item-icon-size:40px;--mc-modal-item-icon-bg:color-mix(in srgb,var(--mc-primary) 12%,transparent);--mc-modal-item-icon-radius:50%;--mc-modal-list-max-height:400px;--mc-modal-btn-bg:var(--mc-primary);--mc-modal-btn-color:var(--text-primary-color,#fff);--mc-modal-btn-radius:6px;--mc-modal-save-bg:var(--success-color,#4caf50);--mc-modal-save-color:var(--text-primary-color,#fff);--mc-modal-cancel-bg:var(--error-color,#f44336);--mc-modal-cancel-color:var(--text-primary-color,#fff)}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}}`;i.d(e,["A",0,r])},4862(t,e,i){i.d(e,{IC:()=>d.IC,_Y:()=>d._Y,cy:()=>d.cy,k2:()=>d.k2});var r=i(2618),o=i(6069),n=i(7526),s=i(7137),a=i(8805),c=i(9851),d=i(4334);const l=()=>r.qy`<div class="mc-module mc-custom-card mc-custom-card-placeholder"><ha-icon icon="mdi:card-plus-outline"></ha-icon> <span>${(0,c.t)(23)}</span></div>`;class u extends o.C{constructor(){super(...arguments),this.metadata={type:"custom-card",inherit:!1}}createDefault(){return{id:(0,s.$)("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}placeholder(t,e){return t.card_type?r.qy`<div class="mc-module mc-custom-card"><div style="display:flex;align-items:center;justify-content:center;min-height:60px;color:var(--secondary-text-color,#6b7280);font-size:0.875rem">${"pending"===e?(0,c.t)(16):""}</div></div>`:l()}getDependencies(){return{forwardHass:!0}}validate(t){const e=t;return void 0===e.card_config||"object"==typeof e.card_config&&null!==e.card_config&&!Array.isArray(e.card_config)?[]:[(0,c.t)(3)]}}n.s.registerLazy(new u,a.tQ["modules-extra"]),i.d(e,["Nq",0,l])},7317(t,e,i){i.d(e,{b:()=>l});var r=i(2618),o=i(6069),n=i(7526),s=i(7137),a=i(9851),c=i(8805),d=i(5259);function l(t,e){return r.qy`<div class="mc-module mc-forecast" style=${e?`min-height: ${(0,d.bc)(e)}px`:r.s6}> ${Array.from({length:t}).map((t,e)=>r.qy`<div class="mc-forecast-item"><span class="mc-forecast-label">${(0,a.t)(9,{n:e+1})}</span> <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon> <span class="mc-forecast-temp">--°</span></div>`)}</div>`}class u extends o.C{constructor(){super(...arguments),this.metadata={type:"forecast",inherit:["weather"]}}createDefault(){return{id:(0,s.$)("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1,animated_icons:!0}}placeholder(t){return l(Math.max(1,Math.round(t.num_forecasts||5)),t)}}n.s.registerLazy(new u,c.tQ["modules-extra"])},5298(t,e,i){var r=i(2618),o=i(6069),n=i(7526),s=i(7137),a=i(8805),c=i(5259);class d extends o.C{constructor(){super(...arguments),this.metadata={type:"weather",inherit:["weather"]}}createDefault(){return{id:(0,s.$)("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5,animated_icons:!0}}getDependencies(t){return t.entity?{entities:["sun.sun"]}:{}}placeholder(t){return r.qy`<div class="mc-module mc-weather" style="min-height: ${(0,c.qz)(t)}px"></div>`}}n.s.registerLazy(new d,a.tQ["modules-extra"]),i.d(e,["$",0,t=>"below_horizon"===t?.states?.["sun.sun"]?.state])},6069(t,e,i){i.d(e,{C:()=>r});class r{validate(t){return[]}}},1194(t,e,i){i.d(e,{l:()=>r});class r{validate(t){return[]}}},4362(t,e,i){var r=i(2618),o=i(6069),n=i(7526),s=i(7137),a=i(4634),c=i(8805);const d="ha-camera-stream",l=t=>1e3*(Number(t.refresh_interval)>0?Number(t.refresh_interval):10);class u extends o.C{constructor(){super(...arguments),this.metadata={type:"camera",inherit:["camera"]}}createDefault(){return{id:(0,s.$)("camera"),type:"camera",aspect_ratio:"16:9",camera_view:"live",show_controls:!0}}getDependencies(t,e){const i=t;return i.entity?"live"===i.camera_view&&!e?.editMode&&"undefined"!=typeof customElements&&customElements.get(d)?{}:{refreshInterval:l(i)}:{}}placeholder(t){const e=t;return r.qy`<div class="mc-module mc-camera" data-mc-flow-end style="aspect-ratio: ${(0,a.o)(e.aspect_ratio)}"></div>`}}n.s.registerLazy(new u,c.tQ["modules-extra"]),i.d(e,["G",0,d,"Q",0,l])},215(t,e,i){i.d(e,{S:()=>h});var r=i(2618),o=i(1194),n=i(7526),s=i(7137),a=i(8983),c=i(7419),d=i(3925),l=i(1476),u=i(9853),m=i(9851);function h(t){return void 0===t.show_name&&void 0===t.show_state?{name:!0,state:!0}:{name:!!t.show_name,state:!!t.show_state}}class p extends o.l{constructor(){super(...arguments),this.metadata={type:"info",name:252,description:150,category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:(0,s.$)("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(t,e){const i=t,o=i.entity&&e?e.states[i.entity]:void 0;let{name:n,state:s}=h(i);n||s||i.secondary_info||(s=!0),n||s||o||(n=!0);const p=o?(0,a.tX)(e,o):i.entity||(0,m.t)(26);let f="—";if(o&&!i.attribute&&void 0!==(0,l.HF)(o))f=(0,u.q)(o);else if(o){const t=(0,a.Ai)(e,o,i.attribute||void 0);f=!1===i.show_unit?t.value:t.text}const g=o&&i.secondary_info?(0,a.Ai)(e,o,i.secondary_info).text:"",v=r.qy` ${n?r.qy`<span class="mc-info-name" data-mc-part="name">${p}</span>`:r.s6} ${s?r.qy`<span class="mc-info-state" data-mc-part="state">${i.prefix||""}${f}${i.suffix||""}</span>`:r.s6} ${g?r.qy`<span class="mc-info-secondary">${g}</span>`:r.s6} `;if(!i.show_icon)return r.qy`<div class="mc-module mc-info">${v}</div>`;const y=(0,c.s)({icon:i.icon||"mdi:information-outline",entity:i.entity,hass:e,useEntityIcon:!i.icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:information-outline"}),b=o?(0,d.id)(o):void 0;return r.qy`<div class="mc-module mc-info mc-info--icon"><span class="mc-info-icon" style=${b?`color: var(--mc-design-color, ${b})`:r.s6}>${y}</span><div class="mc-info-text">${v}</div></div>`}}n.s.register(new p)},5259(t,e,i){i.d(e,{Ar:()=>d,bc:()=>c,m_:()=>l,qz:()=>a,z5:()=>s});const r=[[2,.67],[1.5,.83],[1.17,1],[1,1.33],[.83,1.67],[.67,2.33]],o=1.5,n=[39,36,41];function s(t){const e=String(t??"").split("\n");let i=0,n=0,s=-1,a="",c=!1,d=!1,l=0;const u=(t,e,r,o)=>{c&&o===a?i+=t:(s<0&&(s=e),i+=(i?Math.max(n,e):0)+t,a=o),n=r,c=!0};for(const t of e){const e=t.trim();if(e.startsWith("```")){d=!d,c=!1;continue}if(d){u(o,1,1,"code");continue}if(!e||/^\{%.*%\}$/.test(e)){c=!1;continue}const i=/^(#{1,6})\s/.exec(e);if(i){const[t,e]=r[i[1].length-1];u(o*t,e*t,e*t,"h"+ ++l),c=!1}else e.startsWith("|")?/^[|\s:-]+$/.test(e)?c=!0:u(1.83,0,0,"table"):u(o,1,1,/^([-*+]|\d+\.)\s/.test(e)?"list":"p")}return Math.max(o,Math.round(100*(i+Math.max(s,0)+n))/100)}function a(t){const e=!1!==t.show_temperature,i=!1!==t.show_condition,r=e&&i?67:e?40:36;return t.show_forecast?r+14+c({show_temperature:!0,show_precipitation:!1}):r}function c(t){const e=!1!==t.show_temperature;return 16+("twice_daily"===t.forecast_type?36:18)+29+(e?23:0)+(e&&!t.forecast_type?.match(/hourly|twice/)?22:0)+(!1!==t.show_precipitation?19:0)}function d(t){const e=t.design;return!e||void 0===e.height&&void 0===e.min_height?n["pills"===t.tab_style?1:"underline"===t.tab_style?2:0]:0}function l(t){const e=t.design;if(e&&(void 0!==e.height||void 0!==e.min_height))return"";const i=!1!==t.show_date,r=e?.line_height,o="string"==typeof r?r.trim():r,n=i?2:1,s="string"==typeof o?/^\d*\.?\d+(px|em|rem|%)$/.exec(o):null,a=parseFloat(o);if(s&&a>0)return"%"===s[1]?`calc(${a/100}em * ${n})`:`calc(${a}${s[1]} * ${n})`;const c="string"==typeof o&&/^\d*\.?\d+$/.test(o)?a:o;return`calc(${i?"2.875rem":"2rem"} * ${"number"==typeof c&&c>0&&Number.isFinite(c)?c:1.17})`}},7526(t,e,i){var r=i(2618),o=i(1535),n=i(7935);const s=new class{constructor(){this.modules=new Map,this.chunks=new Map,this.stubs=new Map,this.views=new Map}register(t){this.modules.set(t.metadata.type,t)}registerLazy(t,e){const i=t.metadata.type;this.chunks.set(i,e),this.stubs.set(i,t),this.views.delete(i);const r=Object.create(t,{renderPreview:{value:(i,r)=>this.renderLazy(t,e,i,r)}});this.modules.set(i,r)}provideView(t,e){this.views.set(t,e)}isReady(t){const e=this.chunks.get(t);return!e||this.views.has(t)||!!this.stubs.get(t)?.renderPreview&&e.ready()}renderLazy(t,e,i,s){const a=this.views.get(t.metadata.type);if(a)return a.renderPreview(i,s);const c=()=>(0,n.c)(e);if(t.renderPreview){e.load();const o=t.renderPreview(i,s);return e.failed()?r.qy`${o}${c()}`:o}e.load();const d=(0,o.VQ)()?.requestUpdate;return d&&e.whenReady(d),e.failed()?r.qy`${t.placeholder(i,"failed")}${c()}`:t.placeholder(i,"pending")}get(t){return this.modules.get(t)}getAll(){return Array.from(this.modules.values())}getByCategory(t){return this.getAll().filter(e=>e.metadata.category===t)}getMetadata(){return this.getAll().map(t=>t.metadata)}search(t,e=String){const i=t.toLowerCase();return this.getAll().filter(t=>e(t.metadata.name).toLowerCase().includes(i)||e(t.metadata.description).toLowerCase().includes(i)||t.metadata.type.toLowerCase().includes(i))}createDefault(t){const e=this.get(t);return e?e.createDefault():null}has(t){return this.modules.has(t)}get types(){return Array.from(this.modules.keys())}};i.d(e,["s",0,s])},9393(t,e,i){i.d(e,{CF:()=>d,Dh:()=>l,I0:()=>m,V_:()=>c,m$:()=>h,ms:()=>u});var r=i(2618),o=i(7526),n=i(1535),s=i(5748),a=i(9851);function c(t){const e=t.join(". ");return r.qy`<div class="mc-module mc-module-error" role="alert" title=${e}> <ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${e}</span></div>`}function d(t,e){const i=o.s.get(t?.type);if(!i)return c([(0,a.t)(60,{type:String(t?.type)})]);try{const o=i.validate(t);if(o.length)return c(o);const s=(0,n.VQ)();if(!s||s.editMode){const e=i.hints?.(t)??[];if(e.length)return function(t){const e=t.join(". ");return r.qy`<div class="mc-module mc-module-hint" title=${e}> <ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span></div>`}(e)}return i.renderPreview(t,e)}catch(e){return console.warn(`Magic Card: ${t.type} module failed to render`,e),c([e instanceof Error?e.message:String(e)])}}function l(t,e,i,r=0,o){const s=(0,n.VQ)();return s?.renderChild?s.renderChild(t,i,r,o):d(t,e)}function u(t,e,i=0){const o=(0,n.VQ)(),a=s.kk.get(),c=a?a.arrange(t,{hidden:t=>!!o?.childHidden?.(t),hasActions:t=>!!o?.childHasActions?.(t),canHoist:!1}):(0,s.Ic)(t),d=({child:t,index:r,layer:o})=>l(t,e,r,i,o);return{layered:c.layered,content:r.qy`${c.front.map(d)}${c.backgrounds.map(d)}`}}function m(t){const e=(0,n.VQ)();return t.map((t,e)=>({child:t,index:e})).filter(({child:t})=>!e?.childHidden?.(t))}function h(t){const e=(0,n.VQ)();return e&&!e.editMode?r.s6:r.qy`<span class="mc-placeholder-text">${t}</span>`}},842(t,e,i){i.d(e,{mN:()=>M,AH:()=>d,W3:()=>x,Ec:()=>k,qM:()=>o,iz:()=>c});const r=globalThis,o=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}}const c=t=>new a("string"==typeof t?t:t+"",void 0,n),d=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new a(i,t,n)},l=(t,e)=>{if(o)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=r.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}},u=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return c(e)})(t):t,{is:m,defineProperty:h,getOwnPropertyDescriptor:p,getOwnPropertyNames:f,getOwnPropertySymbols:g,getPrototypeOf:v}=Object,y=globalThis,b=y.trustedTypes,_=b?b.emptyScript:"",w=y.reactiveElementPolyfillSupport,$=(t,e)=>t,x={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},k=(t,e)=>!m(t,e),A={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;class M extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&h(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){const{get:r,set:o}=p(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const n=r?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=v(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...f(t),...g(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(u(t))}else void 0!==t&&e.push(u(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:x).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=i.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:x;this._$Em=r;const n=o.fromAttribute(e,t.type);this[r]=n??this._$Ej?.get(r)??n,this._$Em=null}}requestUpdate(t,e,i,r=!1,o){if(void 0!==t){const n=this.constructor;if(!1===r&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??k)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,i,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}M.elementStyles=[],M.shadowRootOptions={mode:"open"},M[$("elementProperties")]=new Map,M[$("finalized")]=new Map,w?.({ReactiveElement:M}),(y.reactiveElementVersions??=[]).push("2.1.2")},6201(t,e,i){i.d(e,{Kq:()=>u,OA:()=>o.OA,u$:()=>o.u$});var r=i(8504),o=i(7804);const n=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),n(t,e);return!0},s=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},a=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),l(e)}};function c(t){void 0!==this._$AN?(s(this),this._$AM=t,a(this)):this._$AM=t}function d(t,e=!1,i=0){const r=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(e)if(Array.isArray(r))for(let t=i;t<r.length;t++)n(r[t],!1),s(r[t]);else null!=r&&(n(r,!1),s(r));else n(this,t)}const l=t=>{t.type==o.OA.CHILD&&(t._$AP??=d,t._$AQ??=c)};class u extends o.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),a(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(n(this,t),s(this))}setValue(t){if((0,r.Rt)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}},8504(t,e,i){var r=i(6752);const{I:o}=r.ge,n=t=>t,s=()=>document.createComment(""),a={};i.d(e,["Dx",0,(t,e,i)=>{const r=t._$AA.parentNode,a=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=r.insertBefore(s(),a),n=r.insertBefore(s(),a);i=new o(e,n,t,t.options)}else{const e=i._$AB.nextSibling,o=i._$AM,s=o!==t;if(s){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==o._$AU&&i._$AP(e)}if(e!==a||s){let t=i._$AA;for(;t!==e;){const e=n(t).nextSibling;n(r).insertBefore(t,a),t=e}}}return i},"KO",0,t=>{t._$AR(),t._$AA.remove()},"Rt",0,t=>void 0===t.strings,"cN",0,t=>t._$AH,"lx",0,(t,e,i=t)=>(t._$AI(e,i),t),"mY",0,(t,e=a)=>t._$AH=e,"sO",0,t=>null===t||"object"!=typeof t&&"function"!=typeof t])},7804(t,e,i){i.d(e,{WL:()=>r});class r{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}i.d(e,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,t=>(...e)=>({_$litDirective$:t,values:e})])},6752(t,e,i){const r=globalThis,o=t=>t,n=r.trustedTypes,s=n?n.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",c=`lit$${Math.random().toFixed(9).slice(2)}$`,d="?"+c,l=`<${d}>`,u=document,m=()=>u.createComment(""),h=t=>null===t||"object"!=typeof t&&"function"!=typeof t,p=Array.isArray,f=t=>p(t)||"function"==typeof t?.[Symbol.iterator],g="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,y=/-->/g,b=/>/g,_=RegExp(`>|${g}(?:([^\\s"'>=/]+)(${g}*=${g}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),w=/'/g,$=/"/g,x=/^(?:script|style|textarea|title)$/i,k=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),A=k(1),M=k(2),S=(k(3),Symbol.for("lit-noChange")),C=Symbol.for("lit-nothing"),z=new WeakMap,E=u.createTreeWalker(u,129);function T(t,e){if(!p(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s?s.createHTML(e):e}const j=(t,e)=>{const i=t.length-1,r=[];let o,n=2===e?"<svg>":3===e?"<math>":"",s=v;for(let e=0;e<i;e++){const i=t[e];let d,u,m=-1,h=0;for(;h<i.length&&(s.lastIndex=h,u=s.exec(i),null!==u);)h=s.lastIndex,s===v?"!--"===u[1]?s=y:void 0!==u[1]?s=b:void 0!==u[2]?(x.test(u[2])&&(o=RegExp("</"+u[2],"g")),s=_):void 0!==u[3]&&(s=_):s===_?">"===u[0]?(s=o??v,m=-1):void 0===u[1]?m=-2:(m=s.lastIndex-u[2].length,d=u[1],s=void 0===u[3]?_:'"'===u[3]?$:w):s===$||s===w?s=_:s===y||s===b?s=v:(s=_,o=void 0);const p=s===_&&t[e+1].startsWith("/>")?" ":"";n+=s===v?i+l:m>=0?(r.push(d),i.slice(0,m)+a+i.slice(m)+c+p):i+c+(-2===m?e:p)}return[T(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class N{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let o=0,s=0;const l=t.length-1,u=this.parts,[h,p]=j(t,e);if(this.el=N.createElement(h,i),E.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=E.nextNode())&&u.length<l;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(a)){const e=p[s++],i=r.getAttribute(t).split(c),n=/([.?@])?(.*)/.exec(e);u.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?D:"?"===n[1]?L:"@"===n[1]?U:O}),r.removeAttribute(t)}else t.startsWith(c)&&(u.push({type:6,index:o}),r.removeAttribute(t));if(x.test(r.tagName)){const t=r.textContent.split(c),e=t.length-1;if(e>0){r.textContent=n?n.emptyScript:"";for(let i=0;i<e;i++)r.append(t[i],m()),E.nextNode(),u.push({type:2,index:++o});r.append(t[e],m())}}}else if(8===r.nodeType)if(r.data===d)u.push({type:2,index:o});else{let t=-1;for(;-1!==(t=r.data.indexOf(c,t+1));)u.push({type:7,index:o}),t+=c.length-1}o++}}static createElement(t,e){const i=u.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,r){if(e===S)return e;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const n=h(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(e=q(t,o._$AS(t,e.values),o,r)),e}class P{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??u).importNode(e,!0);E.currentNode=r;let o=E.nextNode(),n=0,s=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new R(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new I(o,this,t)),this._$AV.push(e),a=i[++s]}n!==a?.index&&(o=E.nextNode(),n++)}return E.currentNode=u,r}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),h(t)?t===C||null==t||""===t?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==S&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):f(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==C&&h(this._$AH)?this._$AA.nextSibling.data=t:this.T(u.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,r="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=N.createElement(T(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new P(r,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new N(t)),e}k(t){p(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,r=0;for(const o of t)r===e.length?e.push(i=new R(this.O(m()),this.O(m()),this,this.options)):i=e[r],i._$AI(o),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=o(t).nextSibling;o(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class O{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,o){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}_$AI(t,e=this,i,r){const o=this.strings;let n=!1;if(void 0===o)t=q(this,t,e,0),n=!h(t)||t!==this._$AH&&t!==S,n&&(this._$AH=t);else{const r=t;let s,a;for(t=o[0],s=0;s<o.length-1;s++)a=q(this,r[i+s],e,s),a===S&&(a=this._$AH[s]),n||=!h(a)||a!==this._$AH[s],a===C?t=C:t!==C&&(t+=(a??"")+o[s+1]),this._$AH[s]=a}n&&!r&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class D extends O{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}}class L extends O{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}}class U extends O{constructor(t,e,i,r,o){super(t,e,i,r,o),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??C)===S)return;const i=this._$AH,r=t===C&&i!==C||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==C&&(i===C||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class I{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const F={M:a,P:c,A:d,C:1,L:j,R:P,D:f,V:q,I:R,H:O,N:L,U,B:D,F:I},H=r.litHtmlPolyfillSupport;H?.(N,R),(r.litHtmlVersions??=[]).push("3.3.3"),i.d(e,["JW",0,M,"XX",0,(t,e,i)=>{const r=i?.renderBefore??e;let o=r._$litPart$;if(void 0===o){const t=i?.renderBefore??null;r._$litPart$=o=new R(e.insertBefore(m(),t),t,void 0,i??{})}return o._$AI(t),o},"c0",0,S,"ge",0,F,"qy",0,A,"s6",0,C])},7921(t,e,i){i.d(e,{Kq:()=>r.Kq,OA:()=>r.OA,u$:()=>r.u$});var r=i(6201)},1299(t,e,i){i.d(e,{D:()=>s});var r=i(6752),o=i(7804),n=i(8504);const s=(0,o.u$)(class extends o.WL{constructor(){super(...arguments),this.key=r.s6}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&((0,n.mY)(t),this.key=e),i}})},2618(t,e,i){i.d(e,{WF:()=>s,AH:()=>r.AH,qy:()=>o.qy,c0:()=>o.c0,s6:()=>o.s6,qM:()=>r.qM,JW:()=>o.JW,iz:()=>r.iz});var r=i(842),o=i(6752);const n=globalThis;class s extends r.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,o.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return o.c0}}s._$litElement$=!0,s.finalized=!0,n.litElementHydrateSupport?.({LitElement:s});const a=n.litElementPolyfillSupport;a?.({LitElement:s}),(n.litElementVersions??=[]).push("4.2.2")}};const e={};function i(r){const o=e[r];if(void 0!==o)return o.exports;const n=e[r]={exports:{}};return t[r](n,n.exports,i),n.exports}i.m=t,i.d=(t,e)=>{if(Array.isArray(e))for(var r=0;r<e.length;){var o=e[r++],n=e[r++],s=0===n?{enumerable:!0,value:e[r++]}:{enumerable:!0,get:n};i.o(t,o)||Object.defineProperty(t,o,s)}else for(var o in e)i.o(e,o)&&!i.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},i.f={},i.e=t=>{const e=[];return i.f.j(t,e),Promise.all(e)},i.u=t=>"magic-card-"+{8:"editor",32:"slider-look",126:"path-core",167:"svg-editor",168:"anim",195:"svg-booleans",199:"seasonal",234:"transfer",249:"i18n-labels",300:"particles",302:"flows",342:"i18n-icons",368:"path-tools",386:"image-transfer",417:"svg-css",427:"modules-extra",436:"slider",446:"decor",494:"preset-catalogue",497:"flow-look",575:"path-canvas",624:"templates",693:"controls",702:"shape-custom",708:"layer-editor",734:"icon-animator",764:"markdown",771:"svg-image",811:"anim-runtime",815:"svg-icon",820:"shape-editor",831:"pause",836:"look-editor",853:"layers",887:"popup",900:"image-tools",968:"image-editor"}[t]+"."+{8:"0dbe587e",32:"a9b0bbd3",126:"5b3ab1fa",167:"97156c1e",168:"1a47aad2",195:"9acbf439",199:"f326a47d",234:"bd93965f",249:"bd532f02",300:"f8ae5a9a",302:"7a3d824b",342:"af267976",368:"1aadd1e6",386:"a9c9d1c9",417:"9487454e",427:"37b7b649",436:"17a51953",446:"e48b16f3",494:"1a9bcedc",497:"e516e862",575:"1ebc4775",624:"d5e0d999",693:"aa557c5f",702:"c25c3000",708:"33da7ce9",734:"c83e97d8",764:"5f37e79f",771:"1d0b9fe9",811:"1c375329",815:"00359102",820:"0d647a4e",831:"57a1e8af",836:"0e4311ab",853:"c2b605b4",887:"bfc43cfc",900:"f6946cc1",968:"89c85f0b"}[t]+".js",i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.p="",(()=>{const t={143:0},e=e=>{let{__webpack_esm_ids__:r,__webpack_esm_modules__:o,__webpack_esm_runtime__:n}=e;var s,a,c=0;for(s in o)i.o(o,s)&&(i.m[s]=o[s]);for(n&&n(i);c<r.length;c++)a=r[c],i.o(t,a)&&t[a]&&t[a][0](),t[a]=0};i.f.j=(r,o)=>{let n=i.o(t,r)?t[r]:void 0;if(0!==n)if(n)o.push(n[1]);else{let s=import(i.p+i.u(r)).then(e,e=>{throw 0!==t[r]&&(t[r]=void 0),e});s=Promise.race([s,new Promise(e=>n=t[r]=[e])]),o.push(n[1]=s)}}})();var r=i(8764),o=i(9095),n=i(9851),s=i(2618),a=i(5116);const c=s.AH`:host([data-mc-popup-hidden]){display:block;position:absolute;width:0;height:0;overflow:visible}:host([data-mc-popup-editor]){position:relative}`,d=s.AH`[data-mc-shape]{position:relative; box-sizing:border-box;--mc-shape-it:0px;--mc-shape-ir:0px;--mc-shape-ib:0px;--mc-shape-il:0px}.mc-shape-shadow{display:flex;flex-direction:column;min-width:0}.mc-shape-shadow>*{flex:1 1 auto} .mc-shape-shadow.mc-card-shadow{height:100%}`,l=s.AH`[data-mc-value-bg]{position:relative;isolation:isolate}ha-card:has(>.mc-card-content[data-mc-value-bg]){display:flex;flex-direction:column}.mc-card-content[data-mc-value-bg]{flex:1 1 auto}`,u=s.AH`mc-ring:not(:defined),mc-shape:not(:defined){position:absolute;inset:0;pointer-events:none;overflow:visible}mc-value-bg:not(:defined){position:absolute;inset:0;z-index:-1;display:block;pointer-events:none}`,m=s.AH`
  [data-mc-seasonal] {
    position: relative;
    isolation: isolate;
  }
  /* the content fills the card (a sections cell, a card height), its corners follow the card's */
  ha-card:has(> .mc-card-content[data-mc-seasonal]) {
    display: flex;
    flex-direction: column;
  }
  .mc-card-content[data-mc-seasonal] {
    flex: 1 1 auto;
    border-radius: inherit;
  }
  .mc-popup-body > .mc-card-content[data-mc-seasonal] {
    border-radius: 0;
  }
  /* absolute from the first paint: before the chunk defines them they are empty flex items, and their gaps moved the content */
  mc-seasonal,
  mc-seasonal-deco {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  mc-seasonal[layer='front'] {
    z-index: auto;
  }
  ${(0,s.iz)("[data-mc-flash] [data-mc-flash] > mc-seasonal")},
  ${(0,s.iz)("mc-seasonal[flash] ~ mc-seasonal")} {
    --mc-sn-flash: none;
  }
`;var h=i(5748);const p=s.AH`ha-card[data-mc-paused],ha-card[data-mc-paused] *,ha-card[data-mc-paused] *::before,ha-card[data-mc-paused] *::after{animation-play-state:paused!important}.mc-card-content[data-mc-pause-gap]::before,.mc-card-content[data-mc-pause-gap]::after{content:'';flex:none;height:24px}.mc-card-content[data-mc-pause-gap=top]::after,.mc-card-content[data-mc-pause-gap=bottom]::before{display:none}`,f=[".mc-bar",".mc-separator",".mc-slider-container--horizontal",".mc-image",".mc-dropdown",".mc-video-bg",".mc-camera",".mc-graphs",".mc-nested-row",".mc-slider-layout"].join(", "),g=[".mc-horizontal",".mc-vertical",".mc-gauge"].join(", "),v=s.AH`
  :host {
    display: block;
    box-sizing: border-box;
  }

  ha-card {
    overflow: hidden;
    height: 100%;
  }

  .mc-card-content {
    display: flex;
    flex-direction: column;
    padding: var(--mc-padding);
    gap: var(--mc-gap);
  }

  /* Failure notice (mc-fail): ha-card scrolls, the card keeps its grid cell. */
  :host([mc-fail]) {
    height: 100%;
  }
  :host([mc-fail]) ha-card {
    display: flex;
    flex-direction: column;
    overflow: hidden auto;
    scroll-padding-block: 8px;
  }
  :host([mc-fail]) .mc-card-content {
    flex: none;
  }

  /* A shaped card waits for the decor chunk, which measures the content inset. */
  :host([data-mc-decor-wait]) ha-card {
    visibility: hidden;
  }

  /* Columns fill their grid cell (stretch): vertical_align then has room to work and the studio
     frames the cell, not just the column's modules. */
  .mc-row {
    display: grid;
    gap: var(--mc-gap);
    align-items: stretch;
  }

  .mc-column {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
    min-width: 0;
  }

  .mc-column[data-valign='center'] {
    justify-content: center;
  }
  .mc-column[data-valign='end'] {
    justify-content: flex-end;
  }
  .mc-column[data-valign='stretch'] {
    justify-content: stretch;
  }

  /* Module base styles */
  .mc-module {
    min-width: 0;
    overflow-wrap: break-word;
  }

  @supports (-webkit-background-clip:text){.mc-module-wrapper[style*=--mc-text-paint]>.mc-module{background-image:var(--mc-text-paint);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.mc-module-wrapper[style*=--mc-text-paint] .mc-module-wrapper{-webkit-text-fill-color:currentColor}}

  .mc-text {
    font-size: var(--mc-font-size, inherit);
  }

  /* "unavailable" after a missing entity's id */
  .mc-text-muted {
    color: var(--mc-design-color, var(--secondary-text-color));
  }

  .mc-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mc-icon ha-icon,
  .mc-icon ha-state-icon,
  .mc-icon mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size, 24px);
  }

  .mc-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-info--icon {
    flex-direction: row;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-info-icon {
    display: inline-flex;
    flex: none;
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-info-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .mc-info-name {
    font-weight: 500;
    font-size: var(--mc-font-size-md);
    color: var(--mc-design-color, var(--mc-text));
  }

  .mc-info-state {
    font-size: var(--mc-font-size-xl);
    font-weight: 600;
    color: var(--mc-design-color, var(--mc-text));
  }

  .mc-info-secondary {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-image {
    width: 100%;
    overflow: hidden;
    border-top-left-radius: var(--mc-design-radius-tl, 0);
    border-top-right-radius: var(--mc-design-radius-tr, 0);
    border-bottom-right-radius: var(--mc-design-radius-br, 0);
    border-bottom-left-radius: var(--mc-design-radius-bl, 0);
  }

  .mc-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  /* A broken image: the image-off placeholder instead. */
  .mc-image:not(.mc-image--broken) > .mc-image-error,
  .mc-image.mc-image--broken > img {
    display: none;
  }

  .mc-markdown {
    line-height: 1.5;
  }

  .mc-bar-container {
    width: 100%;
  }

  .mc-bar {
    width: 100%;
    height: var(--mc-bar-height);
    background: var(--mc-border);
    border-radius: var(--mc-bar-radius);
    overflow: hidden;
  }

  .mc-bar-fill {
    height: 100%;
    border-radius: var(--mc-bar-radius);
    transition: width var(--mc-bar-transition);
    background: var(--mc-primary);
  }

  .mc-bar-value {
    font-size: var(--mc-font-size-md);
    margin-top: var(--mc-gap-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
    white-space: nowrap;
  }

  /* No number to show (unavailable, unknown, text state): an empty, dimmed track */
  .mc-bar--unavailable .mc-bar-track {
    opacity: 0.5;
  }
  .mc-bar--unavailable .mc-bar-value {
    font-style: italic;
  }

  /* Bar horizontal layout */
  /* The root holds the track and the value: it is not the track itself (that clipped the value). */
  .mc-bar-horizontal,
  .mc-bar-vertical {
    height: auto;
    background: none;
    border-radius: 0;
    overflow: visible;
  }

  .mc-bar-horizontal {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  .mc-bar-horizontal .mc-bar-track {
    flex: 1;
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-bar-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-bar-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-bar-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-bar-radius));
    overflow: hidden;
  }

  .mc-bar-horizontal .mc-bar-track .mc-bar-fill {
    transition: width var(--mc-bar-transition);
  }

  /* Bar vertical layout */
  .mc-bar-vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--mc-gap-xs);
  }

  .mc-bar-vertical .mc-bar-track {
    min-height: 40px;
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-bar-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-bar-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-bar-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-bar-radius));
    position: relative;
    overflow: hidden;
  }

  .mc-bar-vertical .mc-bar-track .mc-bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: var(--mc-bar-radius);
    transition: height var(--mc-bar-transition);
  }

  .mc-separator {
    width: 100%;
    border: none;
    border-top: 1px solid var(--mc-border);
    margin: var(--mc-gap-xs) 0;
  }

  .mc-separator-vertical {
    width: auto;
    height: 100%;
    border: none;
    border-left: 1px solid var(--mc-border);
    margin: 0 var(--mc-gap-xs);
  }

  /* Button: layout only; .mc-button-inner carries the look */
  .mc-button {
    display: inline-flex;
    flex:1;
    gap: var(--mc-gap-sm);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    color: var(--mc-design-color, var(--mc-text));
    font-size: var(--mc-button-font-size);
  }

  .mc-button-inner {
    display: var(--mc-bi-d, inline-flex);
    align-items: center;
    justify-content: var(--mc-bi-jc, center);
    justify-items: var(--mc-bi-ji, normal);
    align-content: var(--mc-bi-ac, normal);
    text-align: var(--mc-bi-jc, center);
    min-width: var(--mc-bi-mw, auto);
    flex: 1;
    gap: var(--mc-bi-g0, var(--mc-bi-gap, var(--mc-gap-sm)));
    padding: var(--mc-button-padding);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    border-width: var(--mc-design-bw, 0);
    border-style: var(--mc-design-bs, none);
    border-color: var(--mc-design-bc, currentColor);
    box-shadow: var(--mc-design-shadow, none);
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
    transition: opacity var(--mc-transition-duration);
  }

  .mc-button-inner:hover {
    opacity: 0.9;
  }

  .mc-button-inner ha-icon,
  .mc-button-inner ha-state-icon,
  .mc-button-inner mc-svg-icon {
    --mdc-icon-size: var(--mc-button-icon-size);
  }

  .mc-button-inner > .mc-button-icon, .mc-button-inner > [data-mc-part='icon']{grid-area: var(--mc-bi-ia, auto); margin: var(--mc-bi-mt, 0) 0 var(--mc-bi-mb, 0); margin-inline-start: var(--mc-bi-ms, 0); margin-inline-end: var(--mc-bi-me, 0); color: var(--mc-bi-c, inherit); flex-shrink: var(--mc-bi-fs, 1)}

  .mc-button-inner--icon-only > .mc-button-icon, .mc-button-inner--icon-only > [data-mc-part='icon']{margin: 0}

  .mc-button-inner [data-mc-part='icon']{background: var(--mc-bi-bg, none); border-radius: var(--mc-bi-br, 0); padding: var(--mc-bi-pad, 0)}

  .mc-button-inner > [data-mc-part='name']{grid-area: var(--mc-bl-a, auto); max-width: var(--mc-bl-mxw, none); color: var(--mc-bl-c, inherit); font-family: var(--mc-bl-ff, inherit); font-size: var(--mc-bl-fs, inherit); font-weight: var(--mc-bl-fw, inherit); text-transform: var(--mc-bl-tt, inherit); white-space: var(--mc-bl-ws, inherit); overflow: var(--mc-bl-ov, visible); text-overflow: var(--mc-bl-to, clip)}

  .mc-button-icon {
    display: inline-flex;
  }

  .mc-button-inner--default {
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
  }

  .mc-button-inner--outline {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border-width: var(--mc-design-bw, 1px);
    border-style: var(--mc-design-bs, solid);
    border-color: var(--mc-design-bc, var(--mc-button-color));
  }

  .mc-button-inner--flat {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
  }

  .mc-button-inner--icon-only {
    padding: var(--mc-button-padding-icon);
  }

  .mc-button-state {
    opacity: 0.8;
    font-size: var(--mc-bs-fs, var(--mc-font-size-xs));
    white-space: nowrap;
    grid-area: var(--mc-bs-a, auto);
    margin-top: var(--mc-bs-mt, 0);
    margin-inline-start: var(--mc-bs-ms, 0);
    color: var(--mc-bs-c, inherit);
  }

  .mc-tile-slider {
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: var(--mc-slider-radius);
    overflow: hidden;
    cursor: pointer;
  }

  .mc-tile-slider--vertical {
    width: 40px;
    height: 100%;
  }

  .mc-tile-slider[aria-disabled='true'] {
    cursor: default;
    opacity: 0.5;
  }

  .mc-tile-slider.mc-dragging .mc-tile-slider-bar {
    transition: none;
  }

  .mc-tile-slider-background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: var(--mc-slider-background, var(--disabled-color, #9e9e9e));
    opacity: 0.2;
  }

  .mc-tile-slider-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--mc-slider-color, var(--primary-color, #03a9f4));
    border-radius: var(--mc-slider-radius);
    transform: translate3d(calc((var(--slider-value, 0) - 1) * 100%), 0, 0);
    transition: transform 180ms ease-in-out, background-color 180ms ease-in-out;
  }

  .mc-tile-slider-bar::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 5px;
    margin: auto;
    height: 50%;
    width: 4px;
    border-radius: var(--mc-radius-sm);
    background-color: var(--text-primary-color, #fff);
  }

  .mc-tile-slider--vertical .mc-tile-slider-bar {
    top: auto;
    bottom: 0;
    transform: translate3d(0, calc((1 - var(--slider-value, 0)) * 100%), 0);
  }

  .mc-tile-slider--vertical .mc-tile-slider-bar::after {
    top: 5px;
    right: 0;
    left: 0;
    bottom: auto;
    width: 50%;
    height: 4px;
  }

  .mc-slider-value {
    font-size: var(--mc-font-size-md);
    min-width: 36px;
    text-align: center;
    white-space: nowrap;
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Slider container layout */
  .mc-slider-container {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  /* the slider module's track takes the design radius (the light module's sliders keep theirs) */
  .mc-slider-container > .mc-tile-slider {
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-slider-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-slider-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-slider-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-slider-radius));
  }

  .mc-slider-container--vertical {
    flex-direction: column;
    width: auto;
    height: var(--mc-slider-vertical-height);
  }

  .mc-slider-container--horizontal {
    flex-direction: row;
    width: 100%;
  }

  /* Spinbox */
  .mc-spinbox {
    display: flex;
    align-items: center;
    gap: var(--mc-spinbox-gap);
  }

  .mc-spinbox-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--mc-spinbox-btn-size);
    height: var(--mc-spinbox-btn-size);
    border: none;
    border-radius: 50%;
    background: var(--mc-spinbox-btn-color);
    color: var(--mc-design-color, var(--mc-spinbox-btn-text-color));
    font-size: var(--mc-spinbox-btn-font-size);
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
  }

  .mc-spinbox-btn:disabled {
    cursor: default;
    opacity: 0.4;
  }

  .mc-spinbox-value {
    font-size: var(--mc-spinbox-value-font-size);
    font-weight: var(--mc-spinbox-value-font-weight);
    min-width: var(--mc-spinbox-value-min-width);
    text-align: center;
    white-space: nowrap;
  }

  /* a state instead of a number (Unavailable, Off) */
  .mc-spinbox-value--text {
    font-size: var(--mc-font-size-md);
    font-weight: 500;
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Dropdown */
  .mc-dropdown {
    width: 100%;
  }

  .mc-dropdown select:disabled {
    cursor: default;
    opacity: 0.6;
  }

  .mc-dropdown select {
    width: 100%;
    padding: var(--mc-dropdown-padding);
    border-width: var(--mc-design-bw, 1px);
    border-style: var(--mc-design-bs, solid);
    border-color: var(--mc-design-bc, var(--mc-border));
    box-shadow: var(--mc-design-shadow, none);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-dropdown-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-dropdown-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-dropdown-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-dropdown-radius));
    background: var(--mc-design-bg, var(--mc-bg));
    color: var(--mc-design-color, var(--mc-text));
    font-size: var(--mc-dropdown-font-size);
    font-family: inherit;
    cursor: pointer;
    appearance: auto;
  }

  .mc-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mc-gauge svg {
    overflow: visible;
    /* scales down in a narrow row instead of sticking out */
    max-width: 100%;
    height: auto;
  }

  .mc-gauge-name {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
    margin-top: 2px;
  }

  .mc-gauge--unavailable .mc-gauge-text {
    font-style: italic;
    opacity: 0.7;
  }

  .mc-gauge-value {
    font-size: var(--mc-font-size-2xl);
    font-weight: 600;
    margin-top: -20px;
  }

  /* Light module */
  .mc-light {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--mc-gap-sm);
  }

  .mc-light--compact {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  /* compact: the controls share the row after the name and wrap under it when there is no room */
  .mc-light--compact > .mc-light-header {
    flex: 1 1 auto;
  }

  .mc-light--compact > .mc-light-control {
    flex: 1 1 140px;
    min-width: 0;
  }

  .mc-light-header {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-header ha-icon,
  .mc-light-header ha-state-icon,
  .mc-light-header mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-light--compact .mc-light-header ha-icon,
  .mc-light--compact .mc-light-header ha-state-icon,
  .mc-light--compact .mc-light-header mc-svg-icon {
    --mdc-icon-size: var(--mc-icon-size-md);
  }

  /* the header icon is the on / off button */
  .mc-light-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    margin: -4px;
    border: none;
    border-radius: 50%;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .mc-light-toggle:disabled {
    cursor: default;
  }

  .mc-light-toggle:focus-visible,
  .mc-tile-slider:focus-visible,
  .mc-spinbox-btn:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  .mc-light-effect-select {
    flex: 1;
    min-width: 0;
    padding: 4px 6px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-sm);
    background: var(--mc-bg);
    color: inherit;
    font: inherit;
  }

  .mc-light-name {
    font-weight: 500;
  }

  .mc-light-name--compact {
    font-weight: 500;
    flex: 1;
  }

  .mc-light-info {
    flex: 1;
  }

  .mc-light-secondary {
    font-size: var(--mc-font-size-xs);
    opacity: var(--mc-light-label-opacity);
  }

  .mc-light-control {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-control ha-icon {
    --mdc-icon-size: var(--mc-icon-size-sm);
    opacity: var(--mc-light-label-opacity);
  }

  .mc-light-control > .mc-tile-slider {
    flex: 1;
    min-width: 0;
  }

  .mc-light-value {
    font-size: var(--mc-font-size-xs);
    min-width: 32px;
    text-align: right;
    white-space: nowrap;
  }

  .mc-light-color-input {
    width: var(--mc-light-color-input-size);
    height: var(--mc-light-color-input-size);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  /* Slider layout: Swiper core styles, scoped to the card (swiper/css would land in document.head) */
  .mc-slider-layout {
    display: block;
    width: 100%;
    min-width: 0;
    position: relative;
  }
  .mc-slider-layout > .swiper {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  .mc-slider-layout .swiper-horizontal {
    touch-action: pan-y;
  }
  .mc-slider-layout .swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
  }
  .mc-slider-layout .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    min-width: 0;
    position: relative;
    transition-property: transform;
    box-sizing: border-box;
  }
  .mc-slider-layout .swiper-slide > * {
    min-width: 0;
  }
  /* Swiper A11y live region ("Next slide" ...): for screen readers only */
  .mc-slider-layout .swiper-notification {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
    pointer-events: none;
  }
  .mc-slider-nav {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: color-mix(in srgb, var(--card-background-color, #fff) 80%, transparent);
    color: var(--mc-design-color, var(--mc-primary));
    cursor: pointer;
    --mdc-icon-size: 20px;
    -webkit-tap-highlight-color: transparent;
  }
  .mc-slider-prev {
    left: 4px;
  }
  .mc-slider-next {
    right: 4px;
  }
  .mc-slider-nav.swiper-button-disabled {
    opacity: 0.35;
    cursor: default;
  }
  .mc-slider-nav.swiper-button-lock,
  .mc-slider-pagination.swiper-pagination-lock {
    display: none;
  }
  .mc-slider-nav:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }
  .mc-slider-pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding-top: 8px;
  }
  .mc-slider-pagination .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--mc-text-secondary, currentColor);
    opacity: 0.35;
    transition: opacity var(--mc-transition-duration, 0.2s), background-color var(--mc-transition-duration, 0.2s);
  }
  .mc-slider-pagination .swiper-pagination-bullet[role='button'] {
    cursor: pointer;
  }
  .mc-slider-pagination .swiper-pagination-bullet-active {
    background: var(--mc-primary);
    opacity: 1;
  }

  .mc-horizontal {
    display: flex;
    flex-direction: row;
    gap: var(--mc-gap);
    align-items: center;
  }

  .mc-vertical {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
  }

  /*
   * A layout child's flex item is its module wrapper, not the module root: size the wrapper the way
   * the root used to be sized (min-width 0 like .mc-module; full width for roots that are 100% wide),
   * so bars, separators, sliders ... keep their width in rows and centred columns.
   */
  .mc-module-wrapper[data-mc-needs]::after{content:attr(data-mc-needs);display:block;border:1px dashed;font-size:.75rem}
  .mc-horizontal > .mc-module-wrapper,
  .mc-vertical > .mc-module-wrapper {
    min-width: 0;
  }
  .mc-horizontal > .mc-shape-shadow,
  .mc-vertical > .mc-shape-shadow {
    min-width: 0;
  }
  /*
   * In a row, a child that is not full width (text, info, icon, button ...) keeps its min-content
   * width (its longest word) next to full-width siblings, instead of being squeezed to one letter
   * per line. The full-width siblings share the rest. Not for nested layouts (their min-content is
   * every child's put together) or gauges (a fixed-size drawing that scales down): those shrink
   * like before, so a narrow card does not overflow.
   */
  .mc-horizontal > .mc-module-wrapper:not(:has(> :is(${(0,s.iz)(f)}, ${(0,s.iz)(g)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-module-wrapper:has(> :is(${(0,s.iz)(f)})),
  .mc-vertical > .mc-module-wrapper:has(> :is(${(0,s.iz)(f)})) {
    width: 100%;
    box-sizing: border-box;
  }
  /* the same for a shaped module with a shadow, whose flex item is its drop-shadow wrapper */
  .mc-horizontal > .mc-shape-shadow:not(:has(> .mc-module-wrapper > :is(${(0,s.iz)(f)}, ${(0,s.iz)(g)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,s.iz)(f)})),
  .mc-vertical > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,s.iz)(f)})) {
    width: 100%;
    box-sizing: border-box;
  }

  .mc-tabs-header {
    display: flex;
    gap: var(--mc-gap-xs);
    border-bottom: 1px solid var(--mc-border);
    margin-bottom: var(--mc-gap-sm);
  }

  .mc-tab-button {
    padding: var(--mc-button-padding);
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
    border-bottom: 2px solid transparent;
    transition: all var(--mc-transition-duration);
  }

  .mc-tab-button ha-icon,
  .mc-tab-button mc-svg-icon {
    --mdc-icon-size: 16px;
  }

  /* Tab style: pills */
  .mc-tabs[data-style='pills'] .mc-tabs-header {
    border-bottom: none;
  }

  .mc-tabs[data-style='pills'] .mc-tab-button {
    border-bottom: none;
    border-radius: var(--mc-radius-md);
  }

  /* Tab style: underline */
  .mc-tabs[data-style='underline'] .mc-tabs-header {
    border-bottom: 2px solid var(--mc-border);
  }

  .mc-tabs[data-style='underline'] .mc-tab-button {
    border-bottom-width: 3px;
    font-weight: 500;
  }

  .mc-clock {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mc-clock-time {
    font-size: 2rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .mc-clock-date {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Weather module */
  .mc-weather {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap-md);
  }

  .mc-weather-now {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-weather-now > ha-icon,
  .mc-weather-now > mc-svg-icon,
  .mc-weather-now > .mc-wx {
    --mdc-icon-size: var(--mc-icon-size-xl);
  }

  .mc-weather-temp {
    font-size: 2rem;
    font-weight: 600;
  }

  .mc-weather-condition {
    font-size: var(--mc-font-size-md);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Forecast module */
  .mc-forecast {
    display: flex;
    gap: var(--mc-gap-sm);
    overflow-x: auto;
  }

  .mc-forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--mc-gap-xs);
    padding: var(--mc-gap-sm) var(--mc-gap-xs);
    /* 60 px wide, 44 px in a narrow column; more days scroll */
    flex: 0 1 60px;
    min-width: 44px;
  }

  .mc-forecast-item ha-icon,
  .mc-forecast-item mc-svg-icon,
  .mc-forecast-item .mc-wx {
    --mdc-icon-size: var(--mc-forecast-icon-size);
  }

  .mc-forecast-label {
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-forecast-temp {
    font-size: var(--mc-font-size-md);
  }

  .mc-forecast-templow {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-forecast-label {
    text-align: center;
    white-space: nowrap;
  }

  .mc-forecast-empty {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  .mc-video-bg {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .mc-video-bg mc-bg-video {
    display: block;
    width: 100%;
    height: 100%;
  }

  .mc-video-bg-media {
    width: 100%;
    display: block;
  }

  /*
   * With other modules next to it, the video is a background layer of their container (column,
   * row column, tab, horizontal / vertical layout, slide): out of the flow, behind its siblings,
   * filling the container. On its own it keeps its own size. The containers are named: a bare
   * :has() would be checked against every element of the card on each change. Browsers without
   * :has() (older WebViews) show the video in the flow, above its siblings.
   */
  :is(.mc-column, .mc-horizontal, .mc-vertical, .mc-tabs-content, .swiper-slide):has(> .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media) {
    position: relative;
    isolation: isolate;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]):has(> .mc-video-bg--media),
  .mc-module-wrapper:not([data-mc-placement]):has(> .mc-video-bg--media):has(~ .mc-module-wrapper) {
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  /* studio canvas: the layer can still be clicked (where nothing covers it) to select it */
  .mc-module-wrapper[data-mc-path]:not([data-mc-placement]):has(> .mc-video-bg--media) {
    pointer-events: auto;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media,
  .mc-module-wrapper:not([data-mc-placement]):has(~ .mc-module-wrapper) > .mc-video-bg--media,
  .mc-module-wrapper ~ .mc-module-wrapper:not([data-mc-placement]) > .mc-video-bg--media .mc-video-bg-media,
  .mc-module-wrapper:not([data-mc-placement]):has(~ .mc-module-wrapper) > .mc-video-bg--media .mc-video-bg-media {
    height: 100%;
  }

  /* Video background placeholder */
  .mc-video-bg-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    background: var(--mc-border);
    border-radius: var(--mc-radius-md);
  }

  .mc-video-bg-placeholder ha-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
    color: var(--mc-text-secondary);
  }

  /* Camera module */
  .mc-camera {
    width: 100%;
    overflow: hidden;
    border-top-left-radius: var(--mc-design-radius-tl, 0);
    border-top-right-radius: var(--mc-design-radius-tr, 0);
    border-bottom-right-radius: var(--mc-design-radius-br, 0);
    border-bottom-left-radius: var(--mc-design-radius-bl, 0);
  }

  .mc-camera img,
  .mc-camera ha-camera-stream {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .mc-camera ha-camera-stream {
    --video-max-height: 100%;
  }

  .mc-camera-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: var(--mc-border);
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-md);
  }

  .mc-camera-fallback ha-icon {
    margin-right: var(--mc-gap-sm);
  }

  /* Graphs module */
  .mc-graphs {
    width: 100%;
  }

  .mc-graphs svg {
    width: 100%;
    height: auto;
  }

  .mc-graphs-label {
    display: flex;
    justify-content: space-between;
    gap: var(--mc-gap-sm);
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
    margin-top: var(--mc-gap-xs);
  }

  .mc-graphs-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .mc-graphs-meta {
    flex: none;
    white-space: nowrap;
  }

  /* No line yet (loading, no entity, no numeric history): a quiet empty area, never a fake curve */
  .mc-graphs-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px dashed var(--mc-border);
    font-size: var(--mc-font-size-xs);
    color: var(--mc-design-color, var(--mc-text-secondary));
  }

  /* Image fallback */
  .mc-image-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mc-border);
    color: var(--mc-text-secondary);
  }

  /* Custom card placeholder */
  .mc-custom-card-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--mc-gap-sm);
    min-height: 80px;
    background: var(--mc-border);
    border-radius: var(--mc-radius-md);
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-md);
  }

  .mc-custom-card-placeholder ha-icon {
    --mdc-icon-size: 28px;
  }

  .mc-custom-card-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    color: var(--mc-text-secondary);
  }

  /* Nested row module: a card row inside a column */
  .mc-nested-row {
    display: grid;
    align-items: stretch;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  /* Placeholder text (e.g. empty tabs) */
  .mc-placeholder-text {
    color: var(--mc-text-secondary);
    font-size: var(--mc-font-size-xs);
  }

  /* Hover effect support */
  .mc-hoverable {
    transition: all var(--mc-transition-duration) ease;
  }

  /*
   * Design surface vars (--mc-design-radius-*, --mc-design-bg) apply to one module's own surface:
   * reset them on every module wrapper (its inline design style sets them again) and on modules
   * nested inside a layout module, so a row, column or parent module never restyles inner surfaces.
   */
  .mc-module-wrapper,
  :not(.mc-module-wrapper) > .mc-module {
    --mc-design-radius-tl: initial;
    --mc-design-radius-tr: initial;
    --mc-design-radius-br: initial;
    --mc-design-radius-bl: initial;
    --mc-design-bg: initial;
    --mc-design-shadow: initial;
    --mc-design-bw: initial;
    --mc-design-bs: initial;
    --mc-design-bc: initial;
    --mc-entity-color: initial;
    --mc-anim-color: initial;
    --mc-anim-m: initial;
    --mc-anim-i: initial;
    --mc-anim-mi: initial;
    --mc-anim-om: initial;
    --mc-anim-oi: initial;
  }

  /* the design background fills the button / dropdown itself, not a full-width band behind it */
  .mc-module-wrapper:has(> .mc-button, > .mc-dropdown) {
    background: none !important;
  }

  .mc-module-wrapper>.mc-button{height:100%;min-height:inherit;max-height:inherit;min-width:inherit;max-width:var(--mc-bl-mxw,inherit)}
  .mc-module-wrapper[style^='width:']>.mc-button,.mc-module-wrapper[style*=' width:']>.mc-button{width:100%}

  .mc-module-wrapper[role='button'],
  .mc-row[data-mc-row-actions] {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mc-module-wrapper[role='button']:focus-visible,
  .mc-row[data-mc-row-actions][tabindex]:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  /* a shaped element clips its outline: mc-shape draws the focus ring along the shape instead */
  .mc-module-wrapper[data-mc-shape]:focus-visible,
  [data-mc-shape]:focus-visible {
    outline: none;
    --mc-shape-focus: var(--mc-primary);
  }

  /* border_length: the wrapper's border stays (transparent, same width); this overlay covers the
     border box (same border-radius); each side is a layer with only that side's border, masked to
     the length, so it follows rounded corners (resolveBorderLength). */
  [data-mc-border-fx],
  [data-mc-ring] {
    position: relative;
  }
  .mc-border-fx {
    position: absolute;
    pointer-events: none;
  }
  .mc-border-fx > i {
    position: absolute;
    display: block;
    box-sizing: border-box;
  }

  /* Editor canvas: hidden rows, columns, modules and tabs stay selectable */
  [data-mc-hidden] {
    opacity: 0.45;
  }

  /* Editor canvas: an empty column keeps a selectable, visible cell */
  .mc-column[data-mc-empty] {
    min-height: 40px;
    border-radius: 8px;
    outline: 1px dashed color-mix(in srgb, currentColor 35%, transparent);
    outline-offset: -1px;
  }

  /* Hidden by display condition */
  .mc-hidden {
    display: none !important;
  }

  /* Error state */
  .mc-error {
    color: var(--error-color, #ef4444);
    padding: var(--mc-gap-sm);
    font-size: var(--mc-font-size-md);
  }

  /* One module's own error: the rest of the card renders. */
  .mc-module-error,
  .mc-module-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
    line-height: 1.3;
  }
  .mc-module-hint {
    color: var(--secondary-text-color, #6b7280);
    font-style: italic;
  }
  .mc-module-error ha-icon,
  .mc-module-hint ha-icon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .mc-module-error span,
  .mc-module-hint span,
  .mc-template-error {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mc-template-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
  }

  /* Interactive feedback */
  .mc-button,
  .mc-button-inner,
  .mc-tab-button,
  .mc-spinbox-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-button:focus-visible,
  .mc-button-inner:focus-visible,
  .mc-tab-button:focus-visible,
  .mc-spinbox-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-button-inner:active,
  .mc-tab-button:active,
  .mc-spinbox-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Font-family inherit for interactive elements */
  .mc-tab-button,
  .mc-spinbox-btn {
    font-family: inherit;
  }
`,y=[a.A,v,c,d,l,u,m,h.wL,p];var b=i(757),_=i(7423),w=i(7137),$=i(8590),x=i(8805);const k=()=>x.tQ.anim.module(),A=t=>{const e=t;return!!e&&"object"==typeof e&&(Array.isArray(e.animations)&&e.animations.length>0||"string"==typeof e.animation_preset&&""!==e.animation_preset.trim())};var M=i(7555),S=i(7050),C=i(1909);const z=t=>t.failed()?t.retry():t.load();let E,T=()=>Promise.all([z(x.tQ.anim),z(x.tQ["svg-icon"])]).then(([t,e])=>{const i=x.tQ.anim.module();if(!t||!e||!i)throw new Error("editor parents");return i.importEditor()});const j=(t,e)=>(E=void 0,console.warn(t,...void 0===e?[]:[e]),!1);function N(){return E??=T().then(t=>t.EDITOR_VERSION!==r.x?j(`Magic Card was updated, reload the page (magic-card.js ${r.x}, magic-card-editor.js ${t.EDITOR_VERSION}).`):t.labelsReady().then(t=>!!t||j("Magic Card: the editor texts (magic-card-i18n-labels.js) could not be loaded, reload the page.")),t=>j("Magic Card: the editor (magic-card-editor.js) could not be loaded, reload the page.",t)),E}var q=i(5832),P=i(4460);const R=/^[a-z0-9_]+\.[a-z0-9_]+$/,O=t=>!!t&&"object"==typeof t&&!Array.isArray(t);function D(t){if(!O(t)||"image"!==t.type)return!1;if(O(t.pan_zoom))return!0;const e=t.entity;return"string"==typeof e&&R.test(e)&&e.startsWith("camera.")&&(void 0===t.states||null===t.states)}const L=t=>Array.isArray(t)&&t.slice(0,4).some(D),U=["border-snake","power-flow","marching-ants"],I=t=>{const e=t;return!(!e||"object"!=typeof e)&&(!!(e.ring&&"object"==typeof e.ring||"string"==typeof e.shape&&""!==e.shape||e.value_background&&"object"==typeof e.value_background)||!("string"!=typeof e.animation_preset||!U.includes(e.animation_preset.trim()))||Array.isArray(e.animations)&&e.animations.some(t=>"string"==typeof t?.preset&&U.includes(t.preset)))};var F=i(5811),H=i(6200);function W(t,e){const i=e??{},r=i.design;if(!r||void 0===r.height&&void 0===r.min_height)switch(t){case"slider":return"vertical"===i.direction?void 0:40;case"spinbox":return 32;case"dropdown":return 41;case"light":return i.compact?40:33+(!1===i.show_brightness?0:48)+(i.show_color_temp?48:0)+(i.show_color?40:0)+(i.show_effect?37:0);case"gauge":{const t=i.gauge_style;return("full"===t||"quarter"===t?120:!1===i.needle?100:109)+(i.entity&&!1!==i.show_name?18:0)}default:return}}const Q=t=>{const e=t;return!!e&&"object"==typeof e&&Array.isArray(e.flows)&&e.flows.some(t=>!!t&&"object"==typeof t)};var B=i(187),V=i(2522);const J=["icon","icon_on","icon_off"],K=/^mdi:[a-z0-9][a-z0-9-]*$/,Z=["custom_icons","icon_fx","svg"],X=t=>Z.some(e=>void 0!==t[e]&&null!==t[e])||J.some(e=>"string"==typeof t[e]&&""!==t[e]&&!K.test(t[e])),Y=(t,e)=>({chunk:t,needs:e}),G=(...t)=>e=>(0,V.P)(e,e=>"string"==typeof e.type&&t.includes(e.type)),tt={slider:Y("slider",G("slider-layout")),markdown:Y("markdown",G("markdown")),controls:Y("controls",G("slider","spinbox","dropdown","light","gauge")),"modules-extra":Y("modules-extra",t=>G("camera","video-bg","weather","forecast","graphs","custom-card","tabs")(t)||((...t)=>e=>(0,V.P)(e,e=>"string"==typeof e.type&&t.includes(e.type),["background_layers"]))("clock","image")(t)),seasonal:Y("seasonal",t=>(0,V.P)(t,t=>t.seasonal||"string"==typeof t.preset&&B.Q9.includes(t.preset))),flows:Y("flows",t=>(0,V.P)(t,Q)),pause:Y("pause",P.Mw),popup:Y("popup",q.ok),decor:Y("decor",t=>(0,V.P)(t,I)),"flow-look":Y("flow-look",t=>(0,V.P)(t,t=>Array.isArray(t.flows)&&t.flows.some(t=>!!t&&"object"==typeof t&&(0,F.cN)(t)))),"slider-look":Y("slider-look",t=>(0,V.P)(t,t=>"slider"===t.type&&(0,H.F)(t))),layers:Y("layers",function(t){try{if(!O(t))return!1;if(L(t.background_layers))return!0;const e=t.conditional_appearance;return Array.isArray(e)&&e.slice(0,32).some(t=>O(t)&&O(t.overrides)&&L(t.overrides.background_layers))}catch{return!1}}),"svg-icon":Y("svg-icon",t=>(0,V.P)(t,X)),anim:Y("anim",t=>(0,V.P)(t,A)),templates:Y("templates",t=>{try{const e=t.template;return"string"==typeof e&&""!==e}catch{return!1}})},et=new WeakSet;var it=i(9682),rt=i(7935),ot=i(2770);function nt(t){return t?s.qy`<span class="mc-border-fx" aria-hidden="true" style=${t.overlayStyle}>${t.lines.map(t=>s.qy`<i style=${t.style}></i>`)}</span>`:s.s6}function st(t){const e=(0,ot.n)();return!!e&&!!t?.fx.some(t=>t.seasonal&&e.sceneFlashes(t.seasonal.scenes))}function at(t,e,i="mc",r=!1,o){return t?.fx.length?s.qy`${t.fx.map(t=>{if(t.seasonal&&!(0,ot.n)())return(0,x.X$)(),s.s6;const n=t.seasonal&&o?.preset(t.seasonal.scenes,t.seasonal.intensity);return t.seasonal?s.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${t.preset} style=${t.style||s.s6} .scenes=${t.seasonal.scenes} .intensity=${n?.intensity??t.seasonal.intensity} ?noflash=${!!n?.noflash} .seed=${`${i}|${t.preset}`}></mc-seasonal>${t.seasonal.decorations?mt(t.seasonal.scenes,e,i,r):s.s6}`:t.ring?s.qy`<mc-ring class="mc-anim-ring" data-fx=${t.preset} ?data-tap=${!!t.tap} style=${t.style} .ring=${t.ring} .shape=${e}></mc-ring>`:s.qy`<span class="mc-anim-fx" data-fx=${t.preset} ?data-front=${t.front} ?data-tap=${!!t.tap} ?data-p=${!!t.sim} .mcSim=${t.sim} style=${t.style} aria-hidden="true">${t.particles.map(e=>{return s.qy`<i data-s=${e.shape??s.s6} style="--mc-anim-x: ${e.x}%; --mc-anim-phase: ${e.phase}; --mc-anim-k: ${e.k}${e.style?`; ${e.style}`:""}">${i=e.symbol??t.symbol,i?"icon"in i?s.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:s.s6}</i>`;var i})}</span>`})}`:s.s6}function ct(t,e){return t?s.qy`<mc-ring .ring=${t} .shape=${e}></mc-ring>`:s.s6}function dt(t,e,i){return t?s.qy`<mc-shape .shape=${t} .stroke=${e} .edge=${i}></mc-shape>`:s.s6}function lt(t,e,i=!1){return i?s.qy`<div class="mc-shape-shadow mc-card-shadow" style=${e?`filter: ${e}`:s.s6}>${t}</div>`:e?s.qy`<div class="mc-shape-shadow" style="filter: ${e}">${t}</div>`:t}function ut(t,e){return t?s.qy`<mc-value-bg .value=${t} .hass=${e}></mc-value-bg>`:s.s6}function mt(t,e,i,r){return(0,ot.n)()?.sceneDecorations(t).length?s.qy`<mc-seasonal-deco class="mc-seasonal-deco" .scenes=${t} .shape=${e} .seed=${i} ?dark=${r}></mc-seasonal-deco>`:s.s6}function ht(t,e,i){if(!t)return s.s6;const r=t.layer===e?s.qy`<mc-seasonal class="mc-card-seasonal" .scenes=${t.scenes} .intensity=${i.grant?.intensity??t.intensity} .layer=${t.layer} ?noflash=${!!i.grant?.noflash} .seed=${i.seed}></mc-seasonal>`:s.s6;return"front"===e?r:s.qy`${r}${t.decorations?mt(t.scenes,i.shape,i.seed,i.dark):s.s6}`}function pt(t,e){return(0,B.j_)(t,e)}i(7608);var ft=i(5520),gt=i(5767),vt=i(839);function yt(t,e){t.removeAttribute(e),t.offsetWidth,t.setAttribute(e,"")}var bt=i(170),_t=i(3686),wt=i(7526),$t=i(3925);const xt=()=>x.tQ.templates.module(),kt=["flow","background","overlay"],At=["image","gradient","pattern","color"],Mt=["auto","always","hidden"],St=["bottom-left","bottom-right","top-left","top-right"],Ct=t=>!!t&&"object"==typeof t&&!Array.isArray(t);class zt{static validate(t){const e=[],i=[];if(!t||"object"!=typeof t)return{valid:!1,errors:[(0,n.t)(5)],warnings:i};const r=t;return r.type&&"string"==typeof r.type||e.push((0,n.t)(7)),Array.isArray(r.rows)?(i.push(...function(t){const e=[],i=t.background_layers;return void 0!==i&&(Array.isArray(i)?(i.length>4&&e.push((0,n.t)(63,{max:4})),i.slice(0,4).forEach((t,i)=>{Ct(t)&&At.includes(String(t.type))||e.push((0,n.t)(62,{index:i}))})):e.push((0,n.t)(61))),void 0!==t.layers_low_power&&"boolean"!=typeof t.layers_low_power&&e.push((0,n.t)(64)),void 0===t.pause_button||Mt.includes(String(t.pause_button))||e.push((0,n.t)(65)),void 0===t.pause_button_corner||St.includes(String(t.pause_button_corner))||e.push((0,n.t)(66)),e}(r)),r.rows.forEach((t,r)=>{t.columns&&Array.isArray(t.columns)?t.columns.forEach((t,o)=>{t.modules&&Array.isArray(t.modules)?t.modules.forEach((t,s)=>{if(!t||"object"!=typeof t)return void e.push((0,n.t)(37,{row:r,col:o,module:s}));if(!t.type)return void i.push((0,n.t)(36,{row:r,col:o,module:s}));const a=t;if(void 0===a.placement||kt.includes(String(a.placement))||i.push((0,n.t)(38,{row:r,col:o,module:s})),void 0===a.layer||Ct(a.layer)||i.push((0,n.t)(35,{row:r,col:o,module:s})),wt.s.has(t.type)){const e=wt.s.get(t.type),a=e?e.validate(t):[];i.push(...a.map(e=>(0,n.t)(34,{row:r,col:o,module:s,type:String(t.type),error:e})))}else i.push((0,n.t)(39,{row:r,col:o,module:s,type:String(t.type)}))}):e.push((0,n.t)(40,{row:r,col:o}))}):e.push((0,n.t)(33,{row:r}))}),{valid:0===e.length,errors:e,warnings:i}):(e.push((0,n.t)(6)),{valid:!1,errors:e,warnings:i})}}var Et=i(213),Tt=i(765),jt=i(8816);const Nt=new Map;function qt(t){return JSON.stringify(Object.keys(t).sort().map(e=>[e,t[e]]))}function Pt(t){return String(t&&"object"==typeof t&&"message"in t?t.message:t)}class Rt{constructor(t,e,i=50){this._requestUpdate=t,this._connection=e,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const t of this._subs.values())t.failed=!1;if(this._connected)for(const t of this._subs.values())this._subscribe(t)}}begin(){this._wanted=new Set,this._dirty=!1}get(t){const e=qt(t);this._wanted?.add(e);let i=this._subs.get(e);return i||(i={msg:t,state:Nt.get(e)??{status:"pending"}},this._connection()?.subscribeMessage||(i.state={status:"unavailable"}),this._subs.set(e,i)),i.state}end(){const t=this._wanted;if(this._wanted=null,t)for(const[e,i]of this._subs)t.has(e)?this._connected&&this._subscribe(i):(this._unsubscribe(i),this._subs.delete(e))}hostConnected(){this._connected=!0;for(const t of this._subs.values())t.failed=!1,this._subscribe(t);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const t of this._subs.values())this._unsubscribe(t);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(t=>t.active).length}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(t){if(t.active||t.failed)return;const e=qt(t.msg),i=this._connection();if(!i?.subscribeMessage)return void this._set(e,t,{status:"unavailable"});this._listenReady(i),"unavailable"===t.state.status&&(t.state=Nt.get(e)??{status:"pending"});const r={};t.token=r;const o=()=>t.token===r;let n;try{n=i.subscribeMessage(i=>{o()&&this._set(e,t,{status:"ok",data:i})},{...t.msg})}catch(t){n=Promise.reject(t)}t.active=Promise.resolve(n).then(t=>t).catch(i=>{o()&&(t.active=void 0,t.token=void 0,t.failed=!0,this._set(e,t,{status:"error",error:Pt(i)}))})}_unsubscribe(t){const e=t.active;t.active=void 0,t.token=void 0,e&&e.then(t=>{try{t?.()}catch{}})}_set(t,e,i){e.state!==i&&(e.state.status!==i.status||"ok"===i.status||"error"===i.status&&e.state.error!==i.error)&&(e.state=i,function(t,e){"ok"===e.status&&(Nt.delete(t),Nt.set(t,e),Nt.size>100&&Nt.delete(Nt.keys().next().value))}(t,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}var Ot=i(7924),Dt=i(7110),Lt=i(5112),Ut=i(9777),It=i(1535),Ft=i(9393),Ht=i(8003),Wt=i(5746),Qt=i(4753),Bt=i(5181),Vt=i(9948),Jt=i(3852),Kt=i(9434),Zt=i(1299),Xt=i(7804),Yt=i(7388),Gt=i(5280),te=i(6901);const ee="mc-bg-stack",ie=/^[a-z0-9_]+\.[a-z0-9_]+$/,re=/^[A-Za-z0-9_]{1,64}$/,oe=["dots","grid","lines","diagonal","checks"],ne=Yt.N$;class se extends Xt.WL{constructor(t){if(super(t),this._keys=[],t.type!==Xt.OA.ELEMENT)throw new Error("sty() is an element directive")}render(t){return s.s6}update(t,[e]){const i=t.element.style;for(const t of this._keys)t in e||i.removeProperty(t);this._keys=Object.keys(e);for(const t of this._keys)i.setProperty(t,e[t]);return s.s6}}const ae=(0,Xt.u$)(se),ce=t=>t.startsWith("mcu-image:");class de extends s.WF{constructor(){super(...arguments),this.items=[],this._sig0=""}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),te.wQ.add(this),this.fxOn(),this._watch(),this.hasUpdated&&(this._sync(),this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),te.wQ.delete(this),this._stopObs?.(),this._stopObs=this._obsHost=void 0,this._run?.stop(),this._run=void 0;for(const t of this.items)clearTimeout(t.fadeTimer),t.fadeTimer=void 0,t.prev=void 0,t.loading&&(t.loading=!1,t.gen++,t.base=void 0)}fxOn(){const t=(0,te.G6)();if(t&&!this._run&&this.isConnected&&(this._run=t.attach(this),this.hasUpdated)){this._rebuild();for(const t of this.items)t.camera&&!t.shown&&(t.base=void 0),t.pz&&1!==t.pz.from&&t.shown&&!t.prev&&(t.prev=t.shown,this._fade(t));this._sync(),this.requestUpdate()}}_watch(){this.isConnected&&this.host&&this._obsHost!==this.host&&(this._stopObs?.(),this._obsHost=this.host,this._stopObs=this.host.observeOffscreen(this))}shouldUpdate(t){return!this.hasUpdated||1!==t.size||!t.has("hass")||this._signature()!==this._sig0||this.items.some(t=>t.shown&&ce(t.shown))}willUpdate(t){t.has("layers")&&this._rebuild(),(t.has("layers")||t.has("hass")||t.has("host"))&&this._sync()}updated(){this._watch(),this._run?.arm()}render(){if(!this.host)return s.s6;const t=this.items.filter(t=>!t.cfg.hidden).reverse();return s.qy`${t.map(t=>(0,Zt.D)(t.index,this._box(t)))}`}_rebuild(){const t=Array.isArray(this.layers)?this.layers.slice(0,4):[],e=this.items,i=[];t.forEach((t,r)=>{if(!t||"object"!=typeof t||Array.isArray(t))return;const o=e.find(e=>e.index===r&&"image"===e.cfg.type&&"image"===t.type)??{index:r,cfg:t,states:Object.create(null),hasStates:!1,camera:!1,gen:0,loading:!1,lastTry:0,since:Date.now(),stale:!1,evKey:""};o.cfg=t,o.states="image"===t.type?(0,Gt.XJ)(t.states):o.states,o.hasStates="image"===t.type&&void 0!==t.states&&null!==t.states,o.pz="image"===t.type?this._run?.pan(t.pan_zoom):void 0,i.push(o)});for(const t of e)i.includes(t)||(clearTimeout(t.timer),clearTimeout(t.fadeTimer));this.items=i}_color(t,e){if("string"==typeof t&&t&&!(t.length>200)&&this.host)return(0,_.f8)(this.host.cssColor(t,e))}_entityOf(t){const e=t.cfg.entity;return("string"==typeof e&&ie.test(e)?e:void 0)??(t.hasStates||"image"!==t.cfg.type?this.host?.cardEntity():void 0)}_source(t){const e=t.cfg,i=this.host;if(!i)return{pending:!0};const r="string"==typeof e.entity&&e.entity?e.entity:void 0;if(void 0!==r&&!ie.test(r))return{problem:"entity-missing",detail:r.slice(0,64)};const o=r??(t.hasStates?i.cardEntity():void 0);let n;if(void 0===o){if(t.hasStates)return{problem:"entity-missing"};n=e.image}else{if(!this.hass)return{pending:!0};const i=ie.test(o)?this.hass.states?.[o]:void 0;if(!i)return{problem:"entity-missing",detail:o};if(t.hasStates){if(n=t.states[i.state]??e.image,"string"!=typeof n||!n)return{problem:"no-state-image",detail:i.state}}else{const t="string"==typeof e.attribute&&re.test(e.attribute)?e.attribute:"entity_picture";n=i.attributes&&Object.prototype.hasOwnProperty.call(i.attributes,t)?i.attributes[t]:void 0}}if("string"!=typeof n||!n.trim())return{problem:"no-picture",detail:o};if(ce(n))return{url:n};const s=i.resolveImage(this.hass,n);if(void 0===s)return{pending:!0};const a=(0,Gt.eP)(s,location.href);return a?{url:a}:{problem:"load-failed"}}_signature(){return this.items.map(t=>{return"image"!==t.cfg.type||t.cfg.hidden?"":`${(e=this._source(t)).url??""}|${e.pending?1:0}|${e.problem??""}|${e.detail??""}`;var e}).join("\n")}_sync(){this._sig0=this._signature();for(const t of this.items){const e=t.cfg;if(e.hidden)this.status(t,"empty");else if("image"===e.type){const e=this._source(t);e.problem?(t.base=void 0,t.gen++,t.loading=!1,t.shown=t.prev=void 0,this.status(t,"load-failed"===e.problem?"error":"empty",e.problem,e.detail)):e.pending?t.shown||this.status(t,"loading"):e.url!==t.base&&(t.base=e.url,t.camera=!t.hasStates&&!!this._entityOf(t)?.startsWith("camera."),this.load(t,e.url))}else{const i="gradient"===e.type?!!(0,Gt.kz)(e.gradient):"color"===e.type?!!this._color(e.color,this._entityOf(t)):"pattern"===e.type&&oe.includes(e.pattern);this.status(t,i?"ok":"empty")}}}status(t,e,i,r){const o=`${e}|${i??""}`;if(o===t.evKey)return;t.evKey=o;const n={index:t.index,status:e,...i?{reason:i}:{},...void 0!==r?{detail:r}:{}};this.dispatchEvent(new CustomEvent("mc-bg-layer-status",{bubbles:!0,composed:!0,detail:n}))}async load(t,e,i=e){const r=++t.gen;if(ce(i))return t.loading=!1,this.host?.needImage(),this._swap(t,i),this.status(t,"ok"),void this.requestUpdate();t.loading=!0,t.lastTry=Date.now(),t.shown||this.status(t,"loading");const o=await function(t){return new Promise(e=>{const i=new Image;i.onerror=()=>e(!1),i.src=t,"function"==typeof i.decode?i.decode().then(()=>e(!0),()=>e(i.complete&&i.naturalWidth>0)):i.onload=()=>e(!0)})}(i).then(t=>t,()=>!1);r===t.gen&&this.isConnected&&this.items.includes(t)&&(t.loading=!1,o?(this._swap(t,i),this._run?.good(t),t.stale||this.status(t,"ok")):t.camera&&this._run?this._run.bad(t):(t.shown=t.prev=void 0,this.status(t,"error","load-failed")),this.requestUpdate(),this._run?.schedule(t))}_swap(t,e){t.shown!==e&&(t.prev=t.shown,t.shown=e,this._fade(t))}_fade(t){clearTimeout(t.fadeTimer),t.fadeTimer=void 0,t.prev&&(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.hasAttribute("offscreen")?t.prev=void 0:t.fadeTimer=setTimeout(()=>{t.fadeTimer=void 0,t.prev=void 0,this.requestUpdate()},300))}_box(t){const e=t.cfg,i=!!this.host?.lowPower(),r="image"!==e.type||i?0:(0,Gt.zt)(e.blur),o=r?-3*r+"px":"0",n=[r?`blur(${r}px)`:"",t.stale?"grayscale(1)":""].filter(Boolean).join(" "),a=!i&&"string"==typeof e.blend&&ne.includes(e.blend)?e.blend:"normal",c={top:o,right:o,bottom:o,left:o,opacity:String(+((0,Gt.jQ)(e.opacity)*(t.stale?.6:1)).toFixed(3)),"mix-blend-mode":a,filter:n||"none"};return s.qy`<div class="l" ${ae(c)}>${this._content(t)}</div>`}_content(t){const e=t.cfg;if("image"===e.type){const e=[t.prev,t.shown].filter(t=>!!t);return s.qy`${e.map((e,i)=>(0,Zt.D)(e,this._pic(t,e,!i&&t.prev===t.shown)))}`}const i=this._entityOf(t);if("color"===e.type){const t=this._color(e.color,i);return t?s.qy`<div class="fill" ${ae({"background-color":t})}></div>`:s.s6}if("gradient"===e.type){const t=(0,Gt.kz)(e.gradient);return t?s.qy`<div class="fill" ${ae({"background-image":t})}></div>`:s.s6}if("pattern"===e.type&&oe.includes(e.pattern)){const t=(0,Gt.ey)(e.pattern,e.size,e.thickness,this._color(e.color,i));return s.qy`<div class="fill" ${ae({"background-image":t.image,"background-size":t.size})}></div>`}return s.s6}_pic(t,e,i){const r=t.cfg,o=(0,Gt.dD)(r.size),n=ce(e),a=n?{}:{"background-image":(0,Gt.zN)(e),"background-position":(0,Gt.xc)(r.position),"background-size":o,"background-repeat":(0,Gt.hQ)(r.repeat,o)},c=i?void 0:t.pz;if(c){const t=t=>""+ +t.toFixed(2),e=(c.to-1)/2*100;Object.assign(a,{"--f":t(c.from),"--t":t(c.to),"--tx":`${t(-c.fx*e)}%`,"--ty":`${t(-c.fy*e)}%`,"--d":`${c.duration}s`,"--dir":c.alternate?"alternate":"normal"})}return s.qy`<div class="img"><div class=${c?"pic pz":"pic"} data-pz=${c?this._run?.motion(c)??s.s6:s.s6} ${ae(a)}>${n?s.qy`<mc-svg-image .ref=${e} .hass=${this.hass} .layer=${r} .at=${t.index}></mc-svg-image>`:s.s6}</div></div>`}}de.styles=s.AH`
    :host{display:block;position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1;overflow:hidden;border-radius:inherit;pointer-events:none}
    .l,.img,.fill,.pic{position:absolute;top:0;right:0;bottom:0;left:0}
    .img{animation:mcbg-in .3s ease-out}
    .pz{animation:mcbg-pz var(--d) ease-in-out infinite var(--dir);animation-play-state:paused}
    .pz[data-pz=play]{animation-play-state:running}
    .pz[data-pz=start],.pz[data-pz=end]{animation:none;transform:translate(var(--x0,0),var(--y0,0)) scale(var(--s0))}
    .pz[data-pz=end]{--x0:var(--tx);--y0:var(--ty);--s0:var(--t)}
    .pz[data-pz=start]{--s0:var(--f)}
    @keyframes mcbg-in{from{opacity:0}}
    @keyframes mcbg-pz{from{transform:scale(var(--f))}to{transform:translate(var(--tx),var(--ty)) scale(var(--t))}}
    @media (prefers-reduced-motion:reduce){.img{animation:none}}
  `,de.properties={layers:{attribute:!1},hass:{attribute:!1},host:{attribute:!1},preview:{attribute:!1}};function le(t,e){if(!t||"object"!=typeof t)return t;const i=t.id||e,r={...t,id:i};if(!(0,Wt.yZ)(t))return r;const o=r,n=(t,e)=>Array.isArray(t)?t.map((t,r)=>le(t,`${i}~${e}.${r}`)):t;if("row"===t.type||"tabs"===t.type){const e="row"===t.type?"columns":"tabs";Array.isArray(o[e])&&(o[e]=o[e].map((t,e)=>t&&"object"==typeof t?{...t,modules:n(t.modules,e)}:t))}else Array.isArray(o.modules)&&(o.modules=n(o.modules,0));return r}function ue(t,e){return[t?.tap_action,t?.hold_action,t?.double_tap_action].some(t=>(0,Ut.Q)(t,e))}const me='input, select, textarea, button, a[href], [role="button"], [role="slider"], [role="switch"], [role="tab"], [role="checkbox"], [contenteditable=""], [contenteditable="true"], ha-slider, ha-switch, ha-camera-stream, mc-embedded-card, .mc-slider-pagination',he=`${me}, [tabindex]:not([tabindex="-1"])`,pe=["slider","markdown","modules-extra","controls","templates"];let fe=0;const ge={width:"var(--ha-card-border-width, 1px)",style:"solid",color:"var(--ha-card-border-color, var(--divider-color, #e0e0e0))"};function ve(t,e,i,r){const o=(0,vt.a_)(t,r);return o?{shape:o,stroke:(0,b.eI)(t),shadow:(0,b.a7)(t?.box_shadow),style:(0,b.DA)(t,e,i),edge:i}:{border:(0,b.fV)(t),style:i?(0,b.AT)(t,e,{min:i}):void 0}}function ye(t){return{...t,rows:(t.rows||[]).map((t,e)=>{const i=t.id||`row~${e}`;return{...t,id:i,columns:(t.columns||[]).map((t,e)=>{const r=t.id||`${i}~col${e}`;return{...t,id:r,modules:(t.modules||[]).map((t,e)=>le(t,`${r}~${e}`))}})}})}}customElements.get(ee)||customElements.define(ee,de);class be extends s.WF{constructor(){var t,e;super(...arguments),this.editMode=!1,this.preview=!1,this._readThemeShadow=!1,this._lookWait=!1,this._customRendered=!1,this._animWait=!1,this._sequences=new Map,this._v2Render=[],this._v2Applied=new Set,this._v2Need=!1,this._v2Waiting=!1,this._pNeed=!1,this._pApplied=new Set,this._customLookup=t=>{this._customRendered=!0;const e=k();if(e)return e.animationLibrary.ensure(this.hass),!this._unsubLibrary&&this.isConnected&&(this._unsubLibrary=e.animationLibrary.subscribe(this._onLibrary)),e.animationLibrary.custom(t,this._resolvedConfig??this._config)},this._onLibrary=()=>{this._libDirty=!0,this.requestUpdate()},this._shapes={library:t=>(this._unsubShapes??=(0,vt.WD)(()=>{this._libDirty=!0,this.requestUpdate()}),(0,vt.p)(t)),inline:t=>(this._resolvedConfig??this._config)?.custom_shapes?.[t]},this._boundRequestUpdate=()=>this.requestUpdate(),this._onTapAnimations=t=>function(t,e){for(const i of t.composedPath()){if(i===e)break;if(i instanceof HTMLElement){i.hasAttribute("data-mc-tap")&&yt(i,"data-mc-tapped");for(const e of i.querySelectorAll(":scope > .mc-anim-fx[data-tap], :scope > .mc-anim-ring[data-tap]")){const r=i.getBoundingClientRect();e.style.setProperty("--mc-tap-x",`${Math.round(t.clientX-r.left)}px`),e.style.setProperty("--mc-tap-y",`${Math.round(t.clientY-r.top)}px`),yt(e,"data-tapped")}}}}(t,this),this._holdTimers=new WeakMap,this._downAt=new WeakMap,this._pendingTimers=new Set,this._claimed=new WeakSet,this._tapTimers=new WeakMap,this._templates=new jt.XM(()=>this.requestUpdate(),()=>this.hass?.connection),this._subscriptions=new Rt(()=>this.requestUpdate(),()=>this.hass?.connection),this._media=new Ot.J2(()=>this.requestUpdate(),()=>this.hass),this._pathStack=[],this._layerOn=!1,this._preview=!1,this._pauseKey="",this._remembered=!1,this._pauseWait=!1,this._pauseReady=()=>{this.isConnected&&this.requestUpdate()},this._frames=[],this._card={flow:!1,row:!1,out:[]},this._stackHost=(t=this,e=()=>this._renderContext,{resolveImage:(t,i)=>(0,It.cb)(e(),()=>(0,Dt.F9)(t,i))||void 0,cardEntity:()=>e().cardEntity,cssColor:(e,i)=>(0,$t.ls)(e)?i&&(0,$t.id)(t.hass?.states[i])||"currentColor":(0,_.f8)(e)??"transparent",observeOffscreen:t=>((0,Jt.jR)(t,()=>{},{counted:!1}),()=>(0,Jt.eF)(t)),badgeHost:()=>t.renderRoot.querySelector(".mc-bg-badge")??void 0,lowPower:()=>!!(this._resolvedConfig??this._config)?.layers_low_power,staleText:t=>(0,n.t)(27,{n:Math.max(1,Math.round(t/60))}),needImage:()=>(0,Kt.s)(e())}),this._uiState=new Map,this._renderContext={instance:"card-"+ ++fe,template:(t,e)=>this._templates.get(t,e),subscribe:t=>this._subscriptions.get(t),media:t=>this._media.get(t),requestUpdate:()=>this.requestUpdate(),metChunk:t=>{this._met.add(t)},renderChild:(t,e,i=0,r)=>{const o=this._pathStack[this._pathStack.length-1];return void 0===o?(0,Ft.CF)(t,this.hass):this._renderModule(t,`${o}/${i}.${e}`,r)},renderColumn:(t,e)=>{const i=this._pathStack[this._pathStack.length-1];return void 0===i?void 0:this._renderColumn(t,0,e,i)},childHidden:t=>this._hid(t),childHasActions:t=>ue(t.actions,this._entityOf(t)),nestedRow:()=>{const t=this._frames[this._frames.length-1];return t&&{layered:t.row&&t.flow,hoisted:()=>t.out}},uiState:t=>{const e=`${this._pathStack[this._pathStack.length-1]??""}#${t}`;return{get:()=>this._uiState.get(e),set:t=>{this._uiState.set(e,t)}}},selectedChild:()=>{const t=this._pathStack[this._pathStack.length-1],e=this.selectedPath;if(this.editMode&&void 0!==t&&e){if(e.startsWith(`${t}#`))return{slot:Number(e.slice(t.length+1)),index:-1};if(e.startsWith(`${t}/`))return(0,Wt.Tu)(e.slice(t.length+1).split("#")[0])?.[0]}},editMode:!1},this._hoverRules=new Map,this._popupWait=!1,this._popupReady=()=>{this.isConnected&&this.requestUpdate()},this._seasonal=new ot.j(this,{config:()=>this._seasonalSetting(),hass:()=>this.hass,editorPreview:()=>{const t=this._editorPlace();return"canvas"===t||"card-editor"===t},idle:()=>this._popupHidden&&!this._popupOpen}),this._seasonalReady=()=>{this.isConnected&&this.requestUpdate()},this._customShape=!1,this._met=new Set,this._paused=!1,this._remerge=()=>{const t=xt();t&&this._templateConfig&&this._config&&(this._resolvedConfig=ye(t.api.mergeTemplateWithOverrides(this._templateConfig,this._config)))},this._templateReady=()=>{const t=this._watchedTemplate,e=xt();t&&e&&this.hass&&!this._unwatchTemplate&&(this._templateNotice=void 0,this._unwatchTemplate=e.api.templateSource.watch(this.hass,t,e=>{if(this._config?.template===t){if(this._templateNotice="missing"===e.status||"unavailable"===e.status?e.status:void 0,"ready"===e.status)try{const t={type:"custom:magic-card",...e.config};if(!zt.validate(t).valid)throw new Error("invalid template config");this._templateConfig=t,this._remerge(),this._prefetch(this._resolvedConfig)}catch(e){console.warn("Magic Card: template config is invalid",t,e),this._templateNotice="unavailable",this._templateConfig=void 0,this._resolvedConfig=void 0}else"loading"!==e.status&&(this._templateConfig=void 0,this._resolvedConfig=void 0);this.requestUpdate()}}))},this._margin="",this._decorWait=!1,this._decorReady=()=>{this.isConnected&&this.requestUpdate()},this._flowsWait=!1,this._flowsReady=()=>{this.isConnected&&this.requestUpdate()},this._hid=t=>!this.editMode&&this._withEntity(this._entityOf(t),()=>this._isHidden(t))}get previewPaused(){return this._preview}set previewPaused(t){const e=this._preview;t!==e&&(this._preview=t,this._pause&&(this._pause.preview=t),this.requestUpdate("previewPaused",e))}_pauseFor(t){if(this._pause)return this._pause;if(!this._preview&&!(0,P.Mw)(t))return;const e=x.tQ.pause.module();if(!e)return this._met.add("pause"),void(this._pauseWait||(this._pauseWait=!0,x.tQ.pause.whenReady(this._pauseReady),x.tQ.pause.load()));const i=this._pause=e.api.create(this);return i.preview=this._preview,this._pauseKey||this._remember(t),i.config(this._pauseKey,this._remembered),i}_remember(t){var e;this._pauseKey=(e=t,P.iK+location.pathname+":"+function(t){let e=2166136261;for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return(e>>>0).toString(16).padStart(8,"0")}(JSON.stringify(e))),this._remembered=function(t){try{return"1"===localStorage.getItem(t)}catch{return!1}}(this._pauseKey)}_earlyPause(t){const e=this._remembered&&(0,P.Mw)(t);return this.toggleAttribute(P.gO,e),(0,Jt.$6)(this,e),e}get _popupHidden(){return(0,Bt.XR)((this._resolvedConfig??this._config)?.popup,this._editorPlace())&&!this._popupFailed}get _popupFailed(){return(0,it.Zz)().has("popup")&&!(0,Vt.T)()}get _popupOpen(){return!!this._popupCtl?.isOpen}_popupFor(t){if(this._popupCtl)return this._popupCtl;if(!(0,q.ok)(t))return;const e=(0,Vt.T)();return e?this._popupCtl=e.api.create(this,{config:()=>(this._resolvedConfig??this._config)?.popup,editorPlace:()=>this._editorPlace()}):(this._met.add("popup"),void(this._popupWait||(this._popupWait=!0,x.tQ.popup.whenReady(this._popupReady),x.tQ.popup.load())))}_seasonalSetting(){return(this._look??this._resolvedConfig??this._config)?.seasonal}get _seasonalBudget(){const t=(0,ot.n)();return this._budget??=t&&new t.SeasonalBudget}static async getConfigElement(){if(!await N())throw new Error((0,n.t)(18));return document.createElement(o.z)}static getStubConfig(){return{type:`custom:${o.Mp}`,rows:[{id:(0,w.$)("row"),share_entity:!0,layout:"1",columns:[{id:(0,w.$)("col"),share_entity:!0,modules:[{id:(0,w.$)("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(t){if(!t)throw new Error((0,n.t)(25));const e=zt.validate(t);if(!e.valid)throw new Error((0,n.t)(15,{errors:e.errors.join("; ")}));const i=this._config?.template;this._met.clear(),this._remember(t),this._pause?.config(this._pauseKey,this._remembered),this._config=ye({...t,rows:t.rows||[]}),t.template!==i&&(this._templateConfig=void 0,this._templateNotice=void 0,this._resolvedConfig=void 0),this._wantShapes(this._config),this._templateConfig&&x.tQ.templates.whenReady(this._remerge),this._prefetch(this._resolvedConfig??this._config)}_prefetch(t){!function(t){if(t&&"object"==typeof t&&!et.has(t)){et.add(t);for(const e of Object.values(tt))e.needs(t)&&x.tQ[e.chunk].load()}}(t),t!==this._prefetchedCfg&&tt.seasonal.needs(t)&&(this._prefetchedCfg=t,x.tQ.seasonal.whenReady(this._seasonalReady))}_wantShapes(t){t===this._shapeCfg||(0,gt.Lu)()||(this._shapeCfg=t,this._customShape=JSON.stringify(t).includes('"shape":"custom"'),this._customShape&&(0,gt.En)().then(t=>t&&this.isConnected&&this.requestUpdate()))}getCardSize(){return this._popupHidden?0:this._config?.rows?Math.max(this._config.rows.length,1):1}getGridOptions(){return this._popupHidden?{columns:"full",rows:"auto",min_rows:0}:{}}getLayoutOptions(){return this._popupHidden?{grid_columns:"full",grid_rows:"auto",grid_min_rows:0}:{}}connectedCallback(){super.connectedCallback(),(0,it.oY)(this),this._offChunks=(0,it.bL)(()=>this.requestUpdate()),this.addEventListener("mc-request-update",this._boundRequestUpdate),this.addEventListener("pointerdown",this._onTapAnimations),this._templates.hostConnected(),this._subscriptions.hostConnected(),this._media.hostConnected(),this.hasUpdated&&this._syncTicker(),this.hasUpdated&&this._syncTemplateWatch(),this.hasUpdated&&this._customRendered&&this._onLibrary()}_dependencies(){const t=this._resolvedConfig??this._config;return t?(0,Tt._)(t,{editMode:this.editMode}):{entities:[],forwardHass:!1}}_syncTicker(){const t=this._popupHidden&&!this._popupOpen,e=this.isConnected&&!t?this._dependencies().refreshInterval:void 0;if(e===this._tickInterval&&(void 0===e||void 0!==this._tickTimer))return;if(void 0!==this._tickTimer&&window.clearTimeout(this._tickTimer),this._tickTimer=void 0,this._tickInterval=e,!e)return;const i=()=>{const t=e-Date.now()%e+20;this._tickTimer=window.setTimeout(()=>{this.requestUpdate(),i()},t)};i()}shouldUpdate(t){if(t.has("hass")&&this.hass&&(0,Qt.Zc)(this.hass),t.has("hass")&&this._popupCtl?.hassChanged(t.get("hass"),this.hass),this._libDirty||t.has("_config")||t.has("_resolvedConfig"))return!0;if(t.has("preview")||t.has("editMode")||t.has("previewPaused"))return!0;if(t.has("hass")&&this.hass){const e=t.get("hass");if(!e)return!0;if(e.language!==this.hass.language)return!0;if(e.themes!==this.hass.themes||e.locale!==this.hass.locale||e.entities!==this.hass.entities)return!0;if(this._popupHidden&&!this._popupOpen)return!1;if(this._seasonal.changed(e))return!0;const i=this._dependencies();return!!i.entities.some(t=>e.states[t]!==this.hass.states[t])||(i.forwardHass&&this._forwardHass(),!1)}return!0}_forwardHass(){const t=this.hass;if(t)for(const e of this.renderRoot?.querySelectorAll("mc-embedded-card")??[])e.hass=t}willUpdate(){const t=this._resolvedConfig??this._config;if(!t)return;const e=(0,q.uT)(t.popup),i=this._popupFor(t),r=this._popupHidden;if(this.toggleAttribute("data-mc-popup-hidden",r),this.toggleAttribute("data-mc-popup-editor",e&&!r),e&&this._popupFailed||r&&!i?.isOpen)return;const o=this._pauseFor(t);this._paused=o?o.begin(t):this._earlyPause(t)}updated(t){super.updated(t),this._seasonalBudget?.settle()&&this.requestUpdate(),this._syncHoverStyles(),this._syncRowFocus(),this._libDirty=!1;const e=k();if(e&&this._customRendered&&e.adoptAnimationSheet(this.renderRoot),e&&(this._customRendered||this._sequences.size)&&e.syncSequences(this.renderRoot,this._sequences),(this._v2Need||this._v2Applied.size)&&this._syncRuntime(),(this._pNeed||this._pApplied.size)&&this._syncParticles(),this._readThemeShadow){const t=(0,b.a7)(getComputedStyle(this).getPropertyValue("--ha-card-box-shadow"));t!==this._themeShadow&&(this._themeShadow=t)}this._templates.end(),this._subscriptions.end(),this._media.end(),this._syncTicker(),(0,Bt.vR)(this,this._popupHidden&&this.isConnected),this.toggleAttribute("mc-fail",!!this.renderRoot?.querySelector(".mc-n")),this._syncDecor(),this.editMode||this._syncTemplateWatch()}_isEditorPreview(){return!!this.closest("hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor")}_editorPlace(){return this.editMode&&this.parentElement?.classList.contains("card-host")?"canvas":this._isEditorPreview()?"card-editor":this.preview||this.editMode?"dashboard-edit":void 0}_syncTemplateWatch(){const t=this.isConnected&&!this.editMode&&this.hass?this._config?.template:void 0,e=t?this.hass.connection:void 0;t===this._watchedTemplate&&e===this._watchedConn||(this._unwatchTemplate?.(),this._unwatchTemplate=void 0,this._watchedTemplate=t,this._watchedConn=e,t&&(x.tQ.templates.whenReady(this._templateReady),x.tQ.templates.load().then(()=>{x.tQ.templates.failed()&&this._watchedTemplate===t&&(this._templateNotice="unavailable",this.requestUpdate())})))}disconnectedCallback(){super.disconnectedCallback(),(0,it.Xe)(this),this._offChunks?.(),this.removeEventListener("mc-request-update",this._boundRequestUpdate),this.removeEventListener("pointerdown",this._onTapAnimations),this._templates.hostDisconnected(),this._subscriptions.hostDisconnected(),this._media.hostDisconnected(),(0,Bt.vR)(this,!1),this._syncTicker();for(const t of this._pendingTimers)window.clearTimeout(t);this._pendingTimers.clear(),this._holdTimers=new WeakMap,this._tapTimers=new WeakMap,this._downAt=new WeakMap,this._unwatchTemplate?.(),this._unwatchTemplate=void 0,this._watchedTemplate=void 0,this._watchedConn=void 0,this._unsubLibrary?.(),this._unsubLibrary=void 0,this._unsubShapes?.(),this._unsubShapes=void 0,this._pause?.disconnected(),k()?.stopSequences(this._sequences);const t=(0,S.PT)();for(const e of this._v2Applied)t?.release(e);this._v2Applied=new Set;for(const t of this._pApplied)(0,C.WP)()?.release(t);this._pApplied=new Set}render(){this._customRendered=!1,this._v2Render=[],this._v2Need=!1,this._pNeed=!1,this._templates.begin(),this._subscriptions.begin(),this._media.begin(),this._renderContext.editMode=this.editMode,this._renderContext.customIcons=(this._resolvedConfig??this._config)?.custom_icons,this._renderContext.preview=this.editMode||this.preview||this._isEditorPreview(),this._pathStack=[],this._hoverRules=new Map,this._margin="";const t=(0,It.cb)(this._renderContext,()=>this._renderCard());return this.style.padding!==this._margin&&(this.style.padding=this._margin),t}_renderTemplateNotice(){const t=this._config?.template;return t&&this._templateNotice?s.qy`<div class="mc-template-notice" role="status" style="padding-block: 4px; font-size: 0.85em; line-height: 1.3; color: var(--secondary-text-color)">${"missing"===this._templateNotice?(0,n.t)(45,{name:t}):(0,n.t)(44,{name:t})}</div>`:s.s6}_renderCard(){const t=this._resolvedConfig??this._config;if(!t)return s.qy`<ha-card><div class="mc-error">${(0,n.t)(24)}</div></ha-card>`;this._wantShapes(t),(0,Lt.E$)((0,Lt.Wb)(t));const e=(0,q.uT)(t.popup),i=this._popupCtl,r=this._popupHidden,o=`${this._renderContext.instance}-popup-title`;if(e&&this._popupFailed)return s.qy`<ha-card><div class="mc-card-content">${this._failNotices(t,s.s6)}</div></ha-card>`;if(r&&!i?.isOpen)return i?i.renderDialog(s.s6,"",o):s.qy``;const a=this._pause,c=this._paused,d=this._scope=this._renderContext.entity=this._renderContext.cardEntity=(0,_t.hY)(t,void 0);if(!this.editMode&&t.display?.conditions?.length&&!this._evaluateDisplay(t.display))return r&&i?i.renderDialog(s.s6,"",o):s.qy``;const l=d?this.hass?.states[d]:void 0,u=this._look=this._resolveCardAppearance(t),m=this._buildCardStyle(u),p=this._resolveAnim({animations:u.animations},l,{allowIcon:!1}),f=this._v2(p,l,d),g=this._buildThemeStyle(u),v=(0,vt.a_)(u,this._shapes),y=(0,bt.JA)(u.ring,{states:this.hass?.states,defaultEntity:d,clipped:!0,shaped:!!v}),w=v?u.box_shadow?(0,b.a7)(u.box_shadow):this._themeShadow:void 0;this._readThemeShadow=!!v&&!u.box_shadow;const $=(0,_.Q7)(u);r||(this._margin=(0,_.VC)(u.margin)??"");const x=$.style,k=v&&"none"!==x&&"hidden"!==x?{...ge,style:"dashed"===x||"dotted"===x?x:"solid",color:$.color||ge.color}:void 0,A=[g,...$.css,u.border_radius&&`border-radius: ${u.border_radius}`,p?.style,v&&"border-color: transparent; box-shadow: none",c&&"--mc-paused: 1"].filter(Boolean).join("; "),M=this._seasonal.resolve(),S=!!this.hass?.themes?.darkMode,C={shape:v,seed:this._seasonal.seed(t),dark:S},z=pt({animations:u.animations},this._seasonalSetting()),E=u.padding||"var(--mc-padding)",T=v?[m,(0,b.DA)(void 0,E,z)].filter(Boolean).join("; "):[m,z&&(0,b.AT)(void 0,E,{min:z})].filter(Boolean).join("; "),j=Q(u),N=j?this._resolveFlows(u):void 0,R=(0,ft.Ih)(u.value_background,{hass:this.hass,entity:d}),O=v?(0,bt.JA)(u.ring,{states:this.hass?.states,defaultEntity:d,clipped:!0,shaped:!1}):y,D=!!M&&!!(0,ot.n)()?.sceneFlashes(M.scenes)||st(p),L=Array.isArray(u.background_layers)&&u.background_layers.length?u.background_layers:void 0,U=this._beginLayers(t,!!L),I=U&&h.kk.get()?s.qy`<style data-mc-layer-css>${h.kk.get().css}</style>`:s.s6,F=U&&u.layers_low_power;var H;(M||N?.some(t=>t.visible&&t.active)||L&&(H=d,L.some(t=>"image"===t?.type&&!t.hidden&&(!!t.pan_zoom||!t.states&&String(t.entity??H).startsWith("camera.")))))&&a?.moving();const W=L?s.qy`<mc-bg-stack .layers=${L} .hass=${this.hass} .host=${this._stackHost}></mc-bg-stack>`:s.s6,B=L&&function(t,e){return t.some(t=>"image"===t?.type&&!t.hidden&&!1!==t.stale_badge&&!t.states&&String(t.entity??e).startsWith("camera."))}(L,d)?s.qy`<div class="mc-bg-badge" inert></div>`:s.s6,V=(e=v)=>{this._seasonalBudget?.begin();const i=M?this._seasonalBudget?.own(M.scenes,M.intensity):void 0,r={...C,grant:i};return s.qy`${ht(M,"back",{...r,shape:e})}${t.rows.map((t,e)=>this._renderRow(t,e))}${at(p,e,C.seed,S,this._seasonalBudget)}${ht(M,"front",r)}${N?s.qy`<mc-flows .flows=${N} .selected=${this.editMode?this.selectedFlow:void 0} ?dark=${S}></mc-flows>`:s.s6}`},J=r?s.s6:lt(s.qy` <ha-card style=${A||s.s6} data-mc-paused=${c?"":s.s6} data-mc-layers=${U?"":s.s6} data-mc-anim=${p?.targets??s.s6} data-mc-tap=${p?.tap?"":s.s6} data-mc-seq=${p?.seq??s.s6} data-mc-ring=${y?"":s.s6} data-mc-shape=${v?.kind??s.s6} data-mc-run=${p?.run??s.s6} data-mc-v2=${f??s.s6}> ${I}<div class="mc-card-content" style=${T} data-mc-anim-fx=${p?.fx.length?"":s.s6} data-mc-hover=${this._hover("card",u.hover,v?{shape:{padding:u.padding||"var(--mc-padding)",card:!0}}:void 0)} data-mc-pause-gap=${(0,P.ZJ)(t)??s.s6} data-mc-flows=${j?"":s.s6} data-mc-value-bg=${R?"":s.s6} data-mc-seasonal=${M?"":s.s6} data-mc-flash=${D?"":s.s6} data-mc-clip=${u.overflow?"":s.s6} data-mc-layers=${U?"":s.s6} data-mc-low-power=${F?"":s.s6}> ${W}${this._renderTemplateNotice()}${V()}${ut(R,this.hass)}${this._card.out.splice(0)}${this._failNotices(t,B)}</div>${dt(v,k,z)}${ct(y,v)}${a?.button(t,c)??s.s6} </ha-card> `,w,!!v);if(!e||!i)return J;const K=(0,b.Q6)(m),Z=t=>t.slice(0,t.indexOf(":")).trim().toLowerCase(),X=t=>/^(background(-[a-z-]+)?|box-shadow)$/.test(Z(t)),Y=[g,...$.css,p?.style,...K.filter(X),c&&"--mc-paused: 1"].filter(Boolean).join("; "),G=[...K.filter(t=>!X(t)&&"border-radius"!==Z(t)),z&&(0,b.AT)(void 0,E,{min:z})].filter(Boolean).join("; "),tt=i.isOpen?s.qy` <ha-card class="mc-popup-surface" tabindex="-1" style=${Y||s.s6} data-mc-paused=${c?"":s.s6} data-mc-layers=${U?"":s.s6} data-mc-anim=${p?.targets??s.s6} data-mc-tap=${p?.tap?"":s.s6} data-mc-seq=${p?.seq??s.s6} data-mc-ring=${O?"":s.s6} data-mc-run=${p?.run??s.s6} data-mc-v2=${f??s.s6}> ${I}${i.renderHead(o)}<div class="mc-popup-body"><div class="mc-card-content" style=${G} data-mc-anim-fx=${p?.fx.length?"":s.s6} data-mc-hover=${this._hover("popup",u.hover)} data-mc-pause-gap=${(0,P.ZJ)(t)??s.s6} data-mc-flows=${j?"":s.s6} data-mc-seasonal=${M?"":s.s6} data-mc-flash=${D?"":s.s6} data-mc-clip=${u.overflow?"":s.s6} data-mc-layers=${U?"":s.s6} data-mc-low-power=${F?"":s.s6}>${W}${V(void 0)}${this._card.out.splice(0)}${this._failNotices(t,B)}</div></div>${ct(O)}${a?.button(t,c)??s.s6} </ha-card> `:s.s6,et=t.popup?.title?.trim()||t.name||(0,n.t)(30),it=i.renderDialog(tt,et,o,u.border_radius);if(r)return it;const rt=i.popupId();return s.qy`<div class="mc-popup-badge" aria-hidden="true"><ha-icon icon="mdi:dock-window"></ha-icon>${(0,n.t)(30)}${rt?s.qy` · #${rt}`:s.s6}</div>${J}${it} `}_syncDecor(){const t=x.tQ.decor;let e=!1;!t.ready()&&this.renderRoot?.querySelector("mc-ring,mc-shape,mc-value-bg")&&(this._met.add("decor"),this._decorWait||(this._decorWait=!0,t.whenReady(this._decorReady),t.load()),e=!t.failed()&&!!this.renderRoot.querySelector("mc-shape")),this.toggleAttribute("data-mc-decor-wait",e)}_resolveFlows(t){const e=x.tQ.flows.module();return e?(this._lookWait||x.tQ["flow-look"].ready()||!t.flows.some(t=>(0,F.cN)(t))||(this._lookWait=!0,x.tQ["flow-look"].whenReady(()=>this.requestUpdate())),e.api.resolveCardFlows(t,this._resolvedConfig??this._config??t,this.hass,t=>(0,jt.L3)(t)?"ok"===this._templates.get(t).status?this._templateText(t):"":t)):(this._met.add("flows"),void(this._flowsWait||(this._flowsWait=!0,x.tQ.flows.whenReady(this._flowsReady),x.tQ.flows.load())))}_templateText(t){if(!(0,jt.L3)(t))return t;const e=this._templates.get(t);return"ok"===e.status?(0,jt.C3)(e.result):"unavailable"===e.status?t:""}_resolveCardAppearance(t){const e=t.conditional_appearance;if(!e?.length)return t;let i=t;for(const t of e){if(!t||!Et.g.ruleMatches(t,this.hass))continue;const e=t.overrides||{},r={};for(const[t,i]of Object.entries(e))void 0!==i&&""!==i&&null!==i&&(r[t]=i);i={...i,...r}}return i}_buildThemeStyle(t){if(!this.hass)return"";if(!1!==t.use_page_theme)return"";const e=t.theme||this.hass.themes?.default_theme;if(!e)return"";const i=this.hass.themes?.themes?.[e];return i?Object.entries(i).map(([t,e])=>`${t.startsWith("--")?t:`--${t}`}: ${String(e)}`).join("; "):""}_buildCardStyle(t){const e=[];t.padding&&e.push(`padding: ${t.padding}`);const i=[],r=t.background_image?(0,Dt.zi)(this.hass,t.background_image):"";r&&i.push(r),t.background&&i.push(t.background),i.length>0&&e.push(`background: ${i.join(", ")}`),r&&(e.push("background-size: cover"),e.push("background-position: center"),e.push("background-repeat: no-repeat")),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`);const o="string"==typeof t.css?t.css.trim().replace(/[;\s]+$/,""):"";return o&&e.push(o),e.join("; ")}_isHidden({hidden:t,display:e}){return!!t||!!e?.conditions?.length&&!this._evaluateDisplay(e)}_scoped(t,e){const i=this._scope,r=(0,_t.hY)(t,i);this._scope=(0,_t.Xu)(t,i);try{return this._withEntity(r,()=>e(r))}finally{this._scope=i}}_beginLayers(t,e){this._frames=[];const i=!!t.rows?.some(t=>t?.columns?.some(t=>(0,h.bP)(t?.modules)));this._layerOn=e||i,this._card={flow:!1,row:!1,out:[]};const r=h.kk.get();return i&&r&&(this._card.flow=r.scanFills(t.rows.flatMap(t=>(t?.columns??[]).map(t=>t?.modules)),this._hid).flow),this._layerOn}_pushFrame(t){const e=h.kk.get();if(!this._layerOn||!e)return;const{flow:i,row:r}=e.scanFills(t,this._hid),o={flow:i,row:r,out:[]};return this._frames.push(o),o}_popFrame(t){return this._frames.pop(),t.out}_arrangeKids(t){const e=h.kk.get();if(!e)return(0,h.Ic)(t);const i=this._frames[this._frames.length-1];return e.arrange(t,{hidden:this._hid,hasActions:t=>ue(t.actions,this._entityOf(t)),canHoist:!0,rowHasFlow:i?.flow,cardHasFlow:this._card.flow})}_front(t,e){for(const i of t.hoisted)(("row"===i.layer.fill?this._frames[this._frames.length-1]:void 0)??this._card).out.push(this._renderModule(i.child,e(i.index),i.layer));return this._renderKids(t.front,e)}_renderKids(t,e){return t.map(t=>this._renderModule(t.child,e(t.index),t.layer))}_renderRow(t,e){return this._scoped(t,i=>this._renderRowAt(t,e,i))}_renderRowAt(t,e,i){const r=this._isHidden(t);if(r&&!this.editMode)return s.qy``;const o=`grid-template-columns: ${(0,$.$t)(t,"1")}; gap: ${t.gap||"8px"}${t.padding?`; padding: ${t.padding}`:""}`,n=i?this.hass?.states[i]:void 0,a=(0,b.Rn)(t.design,this.hass,i),c=(0,b.zg)(a),d=this._resolveAnim(a,n,{allowIcon:!1}),{shape:l,border:u,stroke:m,shadow:h,style:p,edge:f}=ve(a,t.padding,pt(a),this._shapes),g=(0,bt.JA)(a?.ring,{states:this.hass?.states,defaultEntity:i,clipped:!!l,shaped:!!l}),v=(0,ft.Ih)(a?.value_background,{hass:this.hass,entity:i}),y=this._pushFrame(t.columns.map(t=>t?.modules)),_={actions:t.actions,entity:i,inherited:i!==t.entity},w=!this.editMode&&ue(t.actions,i),x=t=>!this._isRowControlEvent(t);return lt(s.qy`<div class="mc-row" data-mc-row-actions=${w?"":s.s6} @pointerdown=${w?t=>x(t)&&this._onPointerDown(t,_):s.s6} @pointerup=${w?t=>x(t)&&this._onPointerUp(t,_):s.s6} @pointermove=${w?t=>this._onPointerMove(t):s.s6} @pointercancel=${w?t=>this._onPointerCancel(t):s.s6} @pointerleave=${w?t=>this._onPointerCancel(t):s.s6} @keydown=${w?t=>t.composedPath()[0]===t.currentTarget&&this._onKeyDown(t,_):s.s6} data-mc-row=${this.editMode?e:s.s6} data-mc-layers=${y?.row&&y.flow?"":s.s6} data-mc-hover=${this._hover(`row-${e}`,a?.hover,{shape:l&&{design:a,padding:t.padding},borderLength:u})} data-mc-hidden=${this.editMode&&r?"":s.s6} data-mc-anim=${d?.targets??s.s6} data-mc-tap=${d?.tap?"":s.s6} data-mc-seq=${d?.seq??s.s6} data-mc-run=${d?.run??s.s6} data-mc-v2=${this._v2(d,n,i)??s.s6} data-mc-anim-fx=${d?.fx.length?"":s.s6} data-mc-flash=${st(d)?"":s.s6} data-mc-border-fx=${u?"":s.s6} data-mc-ring=${g?"":s.s6} data-mc-shape=${l?.kind??s.s6} data-mc-value-bg=${v?"":s.s6} style="${o}; ${c}${[d?.style,u?.style,p].filter(Boolean).map(t=>`; ${t}`).join("")}"> ${t.columns.map((t,i)=>this._renderColumn(t,e,i))}${ut(v,this.hass)}${at(d,l,t.id,this._dark,this._seasonalBudget)}${y&&this._popFrame(y)}${nt(u)}${dt(l,m,f)}${ct(g,l)}</div>`,h)}_renderColumn(t,e,i,r){return this._scoped(t,o=>this._renderColumnAt(t,e,i,r,o))}_renderColumnAt(t,e,i,r,n){const a=this._isHidden(t);if(a&&!this.editMode)return s.qy``;const c=`gap: ${t.gap||(void 0===r?"8px":o.Kd)}${t.padding?`; padding: ${t.padding}`:""}`,d=n?this.hass?.states[n]:void 0,l=(0,b.Rn)(t.design,this.hass,n),u=(0,b.zg)(l),m=this._resolveAnim(l,d,{allowIcon:!1}),{shape:h,border:p,stroke:f,shadow:g,style:v,edge:y}=ve(l,t.padding,pt(l),this._shapes),_=(0,bt.JA)(l?.ring,{states:this.hass?.states,defaultEntity:n,clipped:!!h,shaped:!!h}),w=(0,ft.Ih)(l?.value_background,{hass:this.hass,entity:n}),$=void 0===r?`${e}.${i}`:`${r}#${i}`,x=t=>void 0===r?`${$}.${t}`:`${r}/${i}.${t}`,k=this._arrangeKids(t.modules||[]);return lt(s.qy`<div class="mc-column" data-valign=${t.vertical_align||s.s6} data-mc-col=${this.editMode&&void 0===r?$:s.s6} data-mc-slot=${this.editMode&&void 0!==r?$:s.s6} data-mc-hover=${this._hover(`col-${$}`,l?.hover,{shape:h&&{design:l,padding:t.padding},borderLength:p})} data-mc-empty=${this.editMode&&!t.modules?.length?"":s.s6} data-mc-layers=${k.layered?"":s.s6} data-mc-hidden=${this.editMode&&a?"":s.s6} data-mc-anim=${m?.targets??s.s6} data-mc-tap=${m?.tap?"":s.s6} data-mc-seq=${m?.seq??s.s6} data-mc-run=${m?.run??s.s6} data-mc-v2=${this._v2(m,d,n)??s.s6} data-mc-anim-fx=${m?.fx.length?"":s.s6} data-mc-flash=${st(m)?"":s.s6} data-mc-border-fx=${p?"":s.s6} data-mc-ring=${_?"":s.s6} data-mc-shape=${h?.kind??s.s6} data-mc-value-bg=${w?"":s.s6} style="${c}; ${u}${[m?.style,p?.style,v].filter(Boolean).map(t=>`; ${t}`).join("")}"> ${this._front(k,x)}${ut(w,this.hass)}${at(m,h,t.id??$,this._dark,this._seasonalBudget)}${this._renderKids(k.backgrounds,x)}${nt(p)}${dt(h,f,y)}${ct(_,h)}</div>`,g)}_renderModule(t,e,i){const r=this._scope,o=this._entityOf(t),n=(t.entity||void 0)===o?t:{...t,entity:o};this._scope=(0,_t.Xu)(t,r);const s=this.editMode&&!o&&!!r&&!t.entity&&!!wt.s.get(t.type)?.metadata.inherit;try{return this._withEntity(o,()=>this._renderModuleAt(n,e,void 0!==o&&o!==t.entity,s,i))}finally{this._scope=r}}_entityOf(t){return(0,_t.hY)(t,this._scope,wt.s.get(t.type)?.metadata.inherit)}_withEntity(t,e){const i=this._renderContext,r=i.entity;i.entity=t;try{return e()}finally{i.entity=r}}_renderModuleAt(t,e,i,r,o){const a=this._isHidden(t);if(a&&!this.editMode)return s.qy``;const c=(0,b.Rn)(t.design,this.hass,t.entity),d=t.entity?this.hass?.states[t.entity]:void 0,l=this._resolveAnim(c,d),u=this._v2(l,d,t.entity),{shape:m,border:h,stroke:p,shadow:f,style:g,edge:v}=ve(c,void 0,pt(c),this._shapes),y=(0,bt.JA)(c?.ring,{states:this.hass?.states,defaultEntity:t.entity,clipped:!!m,shaped:!!m}),_=(0,ft.Ih)(c?.value_background,{hass:this.hass,entity:t.entity}),w=d&&(0,b.th)(c)?(0,$t.id)(d):void 0,$=m||h?void 0:(0,b.nl)(t.type,t.button_style),x=$&&{...$,base:c},k=wt.s.get(t.type)?.metadata.tabBar,A=[(0,b.zg)(c,x,"button"===t.type,k),l?.style,h?.style,g,w&&`--mc-entity-color: ${w}`].filter(Boolean).join("; "),M=t.actions,S={actions:t.actions,entity:t.entity,inherited:i},C=!this.editMode&&!o?.clickThrough&&ue(M,t.entity);this._pathStack.push(e);const z="row"===t.type?this._pushFrame((0,Wt.yZ)(t)??[]):void 0,E=this._renderContext,T=E.iconRig;let j;E.iconRig=l?.v2?.filter(t=>void 0!==t.hints.rig).pop()?.hints.rig;try{j=(0,Ft.CF)(t,this.hass)}finally{this._pathStack.pop(),z&&this._frames.pop(),E.iconRig=T}const N=o?.attrs,q=o?.media?s.qy`<div class="mc-layer-media">${j}</div>${o.scrim?s.qy`<div class="mc-layer-scrim"></div>`:s.s6}`:j;return lt(s.qy`<div class="mc-module-wrapper ${C?"mc-hoverable":""}" data-mc-placement=${N?.["data-mc-placement"]??("video-bg"===t.type&&"flow"===t.placement?"flow":s.s6)} data-mc-anchor=${N?.["data-mc-anchor"]??s.s6} data-mc-pass=${N?.["data-mc-pass"]??s.s6} data-mc-blur=${N?.["data-mc-blur"]??s.s6} ?inert=${!this.editMode&&"background"===o?.placement&&!C} role=${C?"button":s.s6} tabindex=${C?0:s.s6} aria-label=${C?this._getActionLabel(t):s.s6} data-mc-path=${this.editMode?e:s.s6} data-mc-hover=${this._hover(`mod-${e}`,c?.hover,{shape:m&&{design:c},borderLength:h,control:x,parts:"button"===t.type?c:void 0,tabs:k})} data-mc-id=${t.id||s.s6} data-mc-hidden=${this.editMode&&a?"":s.s6} data-mc-needs=${r?(0,n.t)(21):s.s6} data-mc-anim=${l?.targets??s.s6} data-mc-tap=${l?.tap?"":s.s6} data-mc-seq=${l?.seq??s.s6} data-mc-run=${l?.run??s.s6} data-mc-v2=${u??s.s6} data-mc-anim-fx=${l?.fx.length?"":s.s6} data-mc-flash=${st(l)?"":s.s6} data-mc-border-fx=${h?"":s.s6} data-mc-ring=${y?"":s.s6} data-mc-shape=${m?.kind??s.s6} data-mc-value-bg=${_?"":s.s6} style=${o?.style?[A,o.style].filter(Boolean).join("; "):A} @pointerdown=${C?t=>this._onPointerDown(t,S):s.s6} @pointerup=${C?t=>this._onPointerUp(t,S):s.s6} @pointermove=${C?t=>this._onPointerMove(t):s.s6} @pointercancel=${C?t=>this._onPointerCancel(t):s.s6} @pointerleave=${C?t=>this._onPointerCancel(t):s.s6} @contextmenu=${C?t=>t.preventDefault():s.s6} @keydown=${C?t=>this._onKeyDown(t,S):s.s6} > ${q}${ut(_,this.hass)}${at(l,m,t.id,this._dark,this._seasonalBudget)}${nt(h)}${dt(m,p,v)}${ct(y,m)}</div>`,o?void 0:f)}_resolveAnim(t,e,i={}){const r=k();if(r)return r.resolveAnimations(t,e,{...i,states:this.hass?.states,custom:this._customLookup});!this._animWait&&A(t)&&(this._animWait=!0,x.tQ.anim.whenReady(()=>{this._animWait=!1,this.requestUpdate()}),x.tQ.anim.load())}_v2(t,e,i){return t&&this._pause?.moving(),t?.needsRuntime&&(this._v2Need=!0),t?.needsParticles&&(this._pNeed=!0),t?.v2?this._v2Render.push({entries:t.v2,stateObj:e,entityId:i})-1:void 0}_syncRuntime(){const t=this._v2Render,e=(0,S.PT)();if(!e)return void(this._v2Need&&!this._v2Waiting&&(this._v2Waiting=!0,(0,S.BR)().then(t=>{this._v2Waiting=!1,t&&this.isConnected&&this.requestUpdate()})));const i=this.renderRoot,r="function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=t=>k()?.animationLibrary.custom(t,this._resolvedConfig??this._config),n=new Set;for(const s of i.querySelectorAll("[data-mc-v2]")){const a=t[Number(s.dataset.mcV2)];if(a){n.add(s);for(const t of a.entries){const n=void 0!==t.entityId;e.apply(s,t.v2,{hass:this.hass,stateObj:n?t.stateObj:a.stateObj,entityId:n?t.entityId:a.entityId,reducedMotion:r,shadowRoot:i,run:t.run,timing:t.timing,icon:t.icon,lookup:o})}e.commit(s,a.entries.map(t=>t.run))}}for(const t of this._v2Applied)n.has(t)||(t.isConnected&&this.renderRoot.contains(t)?e.commit(t,[]):e.release(t));this._v2Applied=n}_syncParticles(){const t=(0,C.WP)();if(!t)return void(0,C.ii)().then(t=>t&&this.isConnected&&this.requestUpdate());const e=(0,M.V)(),i=new Set;for(const r of this.renderRoot.querySelectorAll(".mc-anim-fx[data-p]")){const o=r.mcSim,n=r.parentElement;i.add(r),t.apply(r,{...o,reducedMotion:e,useCss:(t,e)=>k()?.useAnimationCss(t.startsWith("mcc-")?o.docId+(o.part?"o":"")+t.slice(t.lastIndexOf("-g")):t,t,e),content:()=>"icon"===o.spec.sim.colliders.content?[...n.querySelectorAll(".mc-anim-icon")].find(t=>t.closest(".mc-module-wrapper")===n):n.querySelector(":scope>:not([aria-hidden])")??void 0}),r.dataset.fx.endsWith("-g0")&&((0,C.dm)(o.docId),this.requestUpdate())}for(const e of this._pApplied)i.has(e)||t.release(e);this._pApplied=i}_failNotices(t,e){const i=[...(0,it.Zz)()].filter(e=>e in tt?!pe.includes(e)&&(tt[e].needs(t)||this._met.has(e)):"anim-runtime"===e?this._v2Need:"particles"===e?this._pNeed:"shape-custom"===e?this._customShape:this._met.has(e));return i.length?s.qy`${e}${i.map(t=>(0,rt.c)(t in x.tQ?x.tQ[t]:x.DL[t]))}`:e}get _dark(){return!!this.hass?.themes?.darkMode}_hover(t,e,i){if(!e)return s.s6;const r=(0,b.VR)(t,e,i);return r?(this._hoverRules.set(t,r),t):s.s6}_syncHoverStyles(){const t=this.renderRoot;if(!t)return;const e=this._hoverRules.size?[...this._hoverRules.values(),"@media (prefers-reduced-motion: reduce) { [data-mc-hover] { transition: none !important; } }"].join(" "):"";let i=this._hoverStyleEl;e?(i&&i.getRootNode()===t||(i=document.createElement("style"),i.setAttribute("data-mc-hover-styles",""),t.prepend(i),this._hoverStyleEl=i),i.textContent!==e&&(i.textContent=e)):i&&i.textContent&&(i.textContent="")}_syncRowFocus(){for(const t of this.renderRoot.querySelectorAll(".mc-row")){const e=t.hasAttribute("data-mc-row-actions")&&!t.querySelector(he);e&&"0"!==t.getAttribute("tabindex")?t.setAttribute("tabindex","0"):!e&&t.hasAttribute("tabindex")&&t.removeAttribute("tabindex")}}_isRowControlEvent(t){const e=t.currentTarget;for(const i of t.composedPath()){if(i===e)return!1;if(i instanceof Element&&i.matches(me))return!0}return!1}_getActionLabel(t){const e=t.label||t.name;return e?(0,n.t)(0,{name:e}):(0,n.t)(1,{type:t.type})}_onPointerDown(t,e){if(this._claimed.has(t))return;this._claimed.add(t);const i=t.currentTarget;this._downAt.set(i,{x:t.clientX,y:t.clientY});const r=this._timer(()=>{this._holdTimers.delete(i),this._handleAction(t,e,"hold")},500);this._holdTimers.set(i,r)}_onPointerMove(t){const e=t.currentTarget,i=this._downAt.get(e);i&&this._holdTimers.has(e)&&Math.hypot(t.clientX-i.x,t.clientY-i.y)>10&&this._onPointerCancel(t)}_onPointerUp(t,e){if(this._claimed.has(t))return;this._claimed.add(t);const i=t.currentTarget,r=this._downAt.get(i);if(this._downAt.delete(i),r&&Math.hypot(t.clientX-r.x,t.clientY-r.y)>10)return void this._onPointerCancel(t);const o=this._holdTimers.get(i);void 0!==o&&(this._clearTimer(o),this._holdTimers.delete(i),this._onTap(t,e,i))}_onTap(t,e,i){const r=e.actions?.double_tap_action;if(!r||"none"===r.action)return void this._handleAction(t,e,"tap");const o=this._tapTimers.get(i);if(void 0!==o)return this._clearTimer(o),this._tapTimers.delete(i),void this._handleAction(t,e,"double_tap");this._tapTimers.set(i,this._timer(()=>{this._tapTimers.delete(i),this._handleAction(t,e,"tap")},be._DOUBLE_TAP_MS))}_timer(t,e){const i=window.setTimeout(()=>{this._pendingTimers.delete(i),t()},e);return this._pendingTimers.add(i),i}_clearTimer(t){window.clearTimeout(t),this._pendingTimers.delete(t)}_onPointerCancel(t){const e=t.currentTarget,i=this._holdTimers.get(e);void 0!==i&&(this._clearTimer(i),this._holdTimers.delete(e)),this._downAt.delete(e)}_onKeyDown(t,e){if(!this._claimed.has(t)&&("Enter"===t.key||" "===t.key)){if(this._claimed.add(t),t.preventDefault(),t.ctrlKey||t.metaKey)return void this._handleAction(t,e,"double_tap");if(t.shiftKey)return void this._handleAction(t,e,"hold");this._handleAction(t,e,"tap")}}_evaluateDisplay(t){return Et.g.evaluate(t,this.hass)}_handleAction(t,e,i){const r=`${i}_action`,o=e.actions?.[r];if(!o||"none"===o.action)return;o.haptic&&this.dispatchEvent(new CustomEvent("haptic",{bubbles:!0,composed:!0,detail:o.haptic}));const n=!1!==o.use_module_entity?o.entity||e.entity:o.entity;switch("toggle"===o.action&&e.inherited&&!o.entity&&n&&!Ht.LE.has(n.split(".")[0])?"more-info":o.action){case"more-info":n&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:n}}));break;case"toggle":n&&this.hass&&(0,Ht.Bw)(this.hass,(0,Ht.H3)(this.hass,n));break;case"navigate":o.navigation_path&&(history.pushState(null,"",o.navigation_path),window.dispatchEvent(new Event("location-changed",{bubbles:!0,composed:!0})));break;case"url":if(o.url_path)try{const t=new URL(o.url_path,window.location.href);"http:"===t.protocol||"https:"===t.protocol?window.open(t.href,"_blank","noopener,noreferrer"):console.warn("Magic Card: Blocked unsafe URL protocol:",t.protocol)}catch{console.warn("Magic Card: Invalid URL:",o.url_path)}break;case"perform-action":if(o.service){const[t,e]=o.service.split(".");this.hass?.callService(t,e,{...o.data,...o.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}));break;case"popup":(0,Bt.Rf)(o.hash);break;case"close-popup":(0,Vt.T)()?.api.closeOpen();break;case"fire-dom-event":this.dispatchEvent(new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:o.data||{}}))}}}be.styles=[...y,rt.V],be.properties={hass:{attribute:!1},editMode:{attribute:!1},preview:{attribute:!1},selectedPath:{attribute:!1},selectedFlow:{attribute:!1},_config:{state:!0},_resolvedConfig:{state:!0},_themeShadow:{state:!0},_templateNotice:{state:!0}},be._DOUBLE_TAP_MS=250,customElements.get(o.Mp)||customElements.define(o.Mp,be);var _e=i(1194),we=i(1476),$e=i(9853);function xe(t,e){const i=t.formatEntityName,r=i?.(e)||e.attributes.friendly_name;return"string"==typeof r&&r?r:e.entity_id}class ke extends _e.l{constructor(){super(...arguments),this.metadata={type:"text",name:507,description:151,category:"content",icon:"mdi:format-text"}}createDefault(){return{id:(0,w.$)("text"),type:"text",text:"Hello World"}}renderPreview(t,e){const i=t;return i.use_entity&&i.entity?s.qy`<div class="mc-module mc-text" data-mc-part="name">${this._entityText(i,e)}</div>`:i.use_template?s.qy`<div class="mc-module mc-text" data-mc-part="name">${this._templateText(i)}</div>`:s.qy`<div class="mc-module mc-text" data-mc-part="name">${i.text||""}</div>`}_templateText(t){const e=void 0===t.text||null===t.text?"":String(t.text),i=(0,It.VQ)();if(!i||!(0,jt.L3)(e))return e;const r=i.template(e,(0,_t.xw)(e,t.entity,i.cardEntity));switch(r.status){case"ok":return(0,jt.C3)(r.result);case"pending":return"";case"error":return s.qy`<span class="mc-template-error" role="alert" title=${r.error}>${(0,n.t)(46,{error:r.error})}</span>`;default:return e}}_entityText(t,e){const i=t.entity,r=e?.states?.[i];if(!e||!r)return s.qy`${i} <span class="mc-text-muted">${(0,n.t)(67)}</span>`;const o=t.entity_display||"state";if("name"===o)return xe(e,r);if("remaining"===o&&!t.attribute&&void 0!==(0,we.HF)(r))return s.qy`<span class="mc-text-countdown">${(0,$e.q)(r)}</span>`;const a=function(t,e,i){if(i){const r=t.formatEntityAttributeValue?.(e,i);return r??String(e.attributes[i]??"")}const r=t.formatEntityState?.(e);if(void 0!==r)return r;const o=e.attributes.unit_of_measurement;return`${e.state}${o?` ${String(o)}`:""}`}(e,r,t.attribute);return"name_state"===o?`${xe(e,r)}: ${a}`:a}hints(t){const e=t;return e.use_entity?e.entity?[]:[(0,n.t)(13)]:e.text?[]:[e.use_template?(0,n.t)(47):(0,n.t)(48)]}}wt.s.register(new ke);var Ae=i(9136),Me=i(7419);class Se extends _e.l{constructor(){super(...arguments),this.metadata={type:"icon",name:242,description:147,category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:(0,w.$)("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(t,e){const i=t,r=i.icon||"mdi:help",o=i.use_entity_color&&i.entity?(0,$t.id)(e?.states[i.entity]):void 0,n=!o&&(0,Ae.wb)(i.icon_color),a=i.icon_fx?.colors,c=n&&!a?.style?{...i.icon_fx,colors:{...a,style:"gradient",gradient:n.stops,angle:n.angle}}:i.icon_fx,d=o||n&&n.stops[0]||i.icon_color||"inherit",l=(0,Me.s)({icon:r,entity:i.entity,hass:e,useEntityIcon:i.use_entity_icon,className:"mc-anim-icon",part:"icon",fx:c,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:help"});return s.qy`<div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${d}"> ${l}</div>`}}wt.s.register(new Se),i(215);var Ce=i(6069),ze=i(4634);class Ee extends Ce.C{constructor(){super(...arguments),this.metadata={type:"image"}}createDefault(){return{id:(0,w.$)("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}placeholder(t){const e=t;return s.qy`<div class="mc-module mc-image" data-mc-flow-end style="aspect-ratio: ${(0,ze.o)(e.aspect_ratio)};"></div>`}hints(t){const e=t;return e.entity_picture&&!e.entity?[(0,n.t)(14)]:[]}}wt.s.registerLazy(new Ee,x.tQ["modules-extra"]);var Te=i(5259);class je extends Ce.C{constructor(){super(...arguments),this.metadata={type:"markdown"}}createDefault(){return{id:(0,w.$)("markdown"),type:"markdown",content:"**Hello** _World_"}}placeholder(t){return s.qy`<div class="mc-module mc-markdown" style="min-height: ${(0,Te.z5)(t.content)}em"></div>`}hints(t){return t.content?[]:[(0,n.t)(19)]}}wt.s.registerLazy(new je,x.tQ.markdown);var Ne=i(8983),qe=i(4240);class Pe extends _e.l{constructor(){super(...arguments),this.metadata={type:"bar",name:53,description:145,category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:(0,w.$)("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(t,e){const i=t,r=Number.isFinite(Number(i.min))?Number(i.min):0,o=Number.isFinite(Number(i.max))?Number(i.max):100,a=i.entity&&e?e.states[i.entity]:void 0,c=i.attribute||void 0,d=a?(0,Ne.f4)(a,c):void 0,l=!!i.entity&&void 0===d,u=void 0===d?r:Math.min(Math.max(d,r),o),m=o>r?(u-r)/(o-r)*100:0,h=(0,qe.r)(void 0===d?void 0:u,i.severity)||i.bar_color||"var(--primary-color, #03a9f4)",p=i.bar_background||"var(--divider-color, #e0e0e0)",f=i.bar_height||"8px",g="vertical"===i.direction;let v="—";a&&l&&c&&void 0===a.attributes[c]?v=e.formatEntityState?.(a,"unavailable")||(0,n.t)(59):a&&(v=(0,Ne.Ai)(e,a,c,{decimals:i.decimals}).text);const y=!1!==i.show_value?s.qy`<span class="mc-bar-value" data-mc-part="state">${v}</span>`:s.s6,b=`mc-module mc-bar ${g?"mc-bar-vertical":"mc-bar-horizontal"}${l?" mc-bar--unavailable":""}`,_=g?`height: ${m}%`:`width: ${m}%`,w=g?`width: ${f}; height: 100%`:`height: ${f}`;return s.qy`<div class=${b} role="meter" aria-valuemin=${r} aria-valuemax=${o} aria-valuenow=${void 0===d?s.s6:u} aria-valuetext=${v} > ${g?y:s.s6}<div class="mc-bar-track" data-mc-part="background" style="${w}; background: ${p};"> <div class="mc-bar-fill" style="${_}; background: ${h};"></div></div>${g?s.s6:y}</div>`}validate(t){const e=[],i=t;return void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&e.push((0,n.t)(20)),e}}wt.s.register(new Pe),i(4802);class Re extends Ce.C{constructor(){super(...arguments),this.metadata={type:"graphs"}}createDefault(){return{id:(0,w.$)("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}getDependencies(t){return t.entity?{refreshInterval:6e4}:{}}placeholder(t){const e=t;return s.qy`<div class="mc-module mc-graphs"><div style="height: 60px"></div>${!1!==e.show_labels?s.qy`<div class="mc-graphs-label"><span class="mc-graphs-name">&nbsp;</span></div>`:s.s6}</div>`}}wt.s.registerLazy(new Re,x.tQ["modules-extra"]),i(4362);var Oe=i(8477),De=i(403);class Le extends _e.l{constructor(){super(...arguments),this.metadata={type:"button",name:98,description:261,category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:(0,w.$)("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(t,e){const i=t,r=i.entity&&e?e.states[i.entity]:void 0,o=r&&i.show_state?(0,Ne.Ai)(e,r,i.attribute||void 0).text:void 0,a=i.label||(0,n.t)(2),c="icon-only"===i.button_style,d=i.icon||"",l={hass:e,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:gesture-tap"},u=i.use_entity_icon&&i.entity?(0,Me.s)({...l,icon:d||"mdi:gesture-tap",entity:i.entity,useEntityIcon:!0}):d||(0,Oe.hZ)(e,i.entity,i.icon_on,i.icon_off)?(0,Me.s)({...l,icon:d,entity:i.entity}):s.s6,m=i.use_entity_color&&r?(0,$t.id)(r):void 0;return s.qy`<div class="mc-module mc-button mc-button--${i.button_style||"default"}"> <button type="button" tabindex="-1" class="mc-button-inner mc-button-inner--${i.button_style||"default"} ${c?"mc-button-inner--icon-only":""}" title=${c||(0,De.w)(i.design)?a:s.s6} > ${m&&u!==s.s6?s.qy`<span class="mc-button-icon" style="color: ${m}">${u}</span>`:u} ${c?s.s6:s.qy`<span data-mc-part="name">${a}</span>`} ${o?s.qy`<span class="mc-button-state" data-mc-part="state">${o}</span>`:s.s6} </button></div>`}}wt.s.register(new Le);class Ue extends Ce.C{constructor(){super(...arguments),this.metadata={type:"slider"}}createDefault(){return{id:(0,w.$)("slider"),type:"slider",show_value:!0,direction:"horizontal"}}placeholder(t){const e=t,i=W("slider",e);return s.qy`<div class="mc-module mc-slider mc-slider-container ${"vertical"===e.direction?"mc-slider-container--vertical":"mc-slider-container--horizontal"}" style=${i?`min-height: ${i}px`:s.s6}></div>`}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&e.min>=e.max?[(0,n.t)(20)]:void 0===e.step||e.step>0?[]:[(0,n.t)(42)]}}wt.s.registerLazy(new Ue,x.tQ.controls);class Ie extends Ce.C{constructor(){super(...arguments),this.metadata={type:"spinbox"}}createDefault(){return{id:(0,w.$)("spinbox"),type:"spinbox"}}placeholder(t){const e=W("spinbox",t);return s.qy`<div class="mc-module mc-spinbox" style=${e?`min-height: var(--mc-spinbox-btn-size, ${e}px)`:s.s6}></div>`}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&e.min>=e.max?[(0,n.t)(20)]:void 0===e.step||e.step>0?[]:[(0,n.t)(42)]}}wt.s.registerLazy(new Ie,x.tQ.controls);class Fe extends Ce.C{constructor(){super(...arguments),this.metadata={type:"dropdown",inherit:["input_select","select","input_text","text","climate","fan","light","media_player","water_heater","humidifier"]}}createDefault(){return{id:(0,w.$)("dropdown"),type:"dropdown"}}placeholder(t){const e=W("dropdown",t);return s.qy`<div class="mc-module mc-dropdown" style=${e?`min-height: ${e}px`:s.s6}></div>`}}wt.s.registerLazy(new Fe,x.tQ.controls);class He extends Ce.C{constructor(){super(...arguments),this.metadata={type:"light",inherit:["light"]}}createDefault(){return{id:(0,w.$)("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}placeholder(t){const e=t,i=W("light",e);return s.qy`<div class="mc-module mc-light ${e.compact?"mc-light--compact":""}" style=${i?`min-height: ${i}px`:s.s6}></div>`}}wt.s.registerLazy(new He,x.tQ.controls);class We extends Ce.C{constructor(){super(...arguments),this.metadata={type:"gauge"}}createDefault(){return{id:(0,w.$)("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half",show_name:!0}}placeholder(t){const e=W("gauge",t);return s.qy`<div class="mc-module mc-gauge" style=${e?`min-height: ${e}px`:s.s6}></div>`}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&Number(e.min)>=Number(e.max)?[(0,n.t)(20)]:[]}}wt.s.registerLazy(new We,x.tQ.controls);class Qe extends _e.l{constructor(){super(...arguments),this.metadata={type:"horizontal",name:240,description:32,category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:(0,w.$)("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(t,e){const i=t,r=i.modules||[],o=r.length>0?(0,Ft.ms)(r,e):void 0;return s.qy`<div class="mc-module mc-horizontal" data-mc-layers=${o?.layered?"":s.s6} style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}"> ${o?o.content:(0,Ft.m$)((0,n.t)(11))}</div>`}}wt.s.register(new Qe);class Be extends _e.l{constructor(){super(...arguments),this.metadata={type:"vertical",name:538,description:31,category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:(0,w.$)("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(t,e){const i=t,r=i.modules||[],o=r.length>0?(0,Ft.ms)(r,e):void 0;return s.qy`<div class="mc-module mc-vertical" data-mc-layers=${o?.layered?"":s.s6} style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}"> ${o?o.content:(0,Ft.m$)((0,n.t)(10))}</div>`}}wt.s.register(new Be);class Ve extends _e.l{constructor(){super(...arguments),this.metadata={type:"row",name:401,description:229,category:"layout",icon:"mdi:view-sequential-outline"}}createDefault(){return{id:(0,w.$)("row"),type:"row",columns:[{id:(0,w.$)("col"),modules:[]},{id:(0,w.$)("col"),modules:[]}],layout:"1-1",gap:"8px"}}renderPreview(t,e){const i=t,r=i.columns||[],n=(0,It.VQ)(),a=n?.nestedRow?.(),c=`grid-template-columns: ${(0,$.$t)(i)}; gap: ${i.gap||"8px"}${i.padding?`; padding: ${i.padding}`:""}`;return s.qy`<div class="mc-module mc-nested-row" data-mc-layers=${a?.layered?"":s.s6} style=${c}> ${r.map((t,i)=>t&&"object"==typeof t?n?.renderColumn?.(t,i)??s.qy`<div class="mc-column" data-valign=${t.vertical_align||s.s6} style=${`gap: ${t.gap||o.Kd}`}>${(t.modules||[]).map((t,r)=>(0,Ft.Dh)(t,e,r,i))}</div>`:s.s6)}${a?.hoisted()}</div>`}}wt.s.register(new Ve);class Je extends Ce.C{constructor(){super(...arguments),this.metadata={type:"tabs",tabBar:!0}}createDefault(){return{id:(0,w.$)("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}placeholder(t){return s.qy`<div class="mc-module mc-tabs" style="min-height: ${(0,Te.Ar)(t)}px"></div>`}}wt.s.registerLazy(new Je,x.tQ["modules-extra"]);class Ke extends _e.l{constructor(){super(...arguments),this.metadata={type:"separator",name:415,description:544,category:"layout",icon:"mdi:minus"}}createDefault(){return{id:(0,w.$)("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(t,e){const i=t;return"vertical"===i.direction?s.qy`<div class="mc-module mc-separator-vertical" style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}"> </div>`:s.qy` <hr class="mc-module mc-separator" style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" /> `}}wt.s.register(new Ke);class Ze extends _e.l{constructor(){super(...arguments),this.metadata={type:"slider-layout"}}createDefault(){return{id:(0,w.$)("slider-layout"),type:"slider-layout",modules:[],pagination:!0,navigation:!0}}placeholder(t){return this.renderPreview(t)}renderPreview(t,e){const i=t,r=i.modules||[];if(!r.length)return s.qy`<div class="mc-module mc-slider-layout">${(0,Ft.m$)((0,n.t)(12))}</div>`;const o=(0,It.VQ)(),a=function(t,e){const i=Number(t.slides_per_view),r=Number(t.space_between),o=Number(t.autoplay_delay);return{slidesPerView:Number.isFinite(i)&&i>0?i:1,spaceBetween:Number.isFinite(r)&&r>=0?r:8,rewind:!!t.loop,pagination:!1!==t.pagination,navigation:!1!==t.navigation,autoplay:t.autoplay?Number.isFinite(o)&&o>=1e3?o:5e3:0,editMode:e}}(i,!!o?.editMode),c=(0,Ft.I0)(r);if(!c.length)return s.qy``;const d=c.length>1,l={...a,navigation:a.navigation&&d,pagination:a.pagination&&d},u=o?.selectedChild?.()?.index,m=void 0===u?void 0:Math.max(0,c.findIndex(t=>t.index===u)),h=t=>t.stopPropagation();return s.qy` <mc-swiper class="mc-module mc-slider-layout" .options=${l} .activeIndex=${m}> <div class="swiper"><div class="swiper-wrapper">${c.map(({child:t,index:i})=>s.qy`<div class="swiper-slide">${(0,Ft.Dh)(t,e,i)}</div>`)}</div></div>${l.navigation?s.qy` <button type="button" class="mc-slider-nav mc-slider-prev" @pointerdown=${h} @pointerup=${h} @keydown=${h} aria-label=${(0,n.t)(31)}> <ha-icon icon="mdi:chevron-left"></ha-icon> </button> <button type="button" class="mc-slider-nav mc-slider-next" @pointerdown=${h} @pointerup=${h} @keydown=${h} aria-label=${(0,n.t)(22)}> <ha-icon icon="mdi:chevron-right"></ha-icon> </button>`:s.s6} ${l.pagination?s.qy`<div class="mc-slider-pagination" @pointerdown=${h} @pointerup=${h} @keydown=${h}></div>`:s.s6} </mc-swiper> `}}wt.s.registerLazy(new Ze,x.tQ.slider);class Xe extends Ce.C{constructor(){super(...arguments),this.metadata={type:"clock"}}createDefault(){return{id:(0,w.$)("clock"),type:"clock",show_seconds:!1,show_date:!0,date_format:"short"}}placeholder(t){const e=(0,Te.m_)(t);return s.qy`<div class="mc-module mc-clock" style=${e?`min-height: ${e}`:s.s6}></div>`}}wt.s.registerLazy(new Xe,x.tQ["modules-extra"]),i(5298),i(7317);class Ye extends Ce.C{constructor(){super(...arguments),this.metadata={type:"video-bg"}}createDefault(){return{id:(0,w.$)("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}placeholder(t){return s.qy`<div class="mc-module mc-video-bg"></div>`}}wt.s.registerLazy(new Ye,x.tQ["modules-extra"]),i(4862),i.p=new URL(".",import.meta.url).href,window.customCards=window.customCards||[],window.customCards.push({type:o.Mp,name:o.d5,description:o.uh,preview:!0,documentationURL:"https://github.com/therealmcsparrow/magic-card"}),function(t=window){t.MagicCard={...t.MagicCard,version:r.x,apiVersion:1,loadEditor:N,loadSeasonal:x.X$,setLocale:Qt.Zc}}(),console.info(`%c MAGIC-CARD %c v${r.x} `,"color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();