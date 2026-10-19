(()=>{"use strict";var t={3664(t,e,i){i.d(e,{E0:()=>W,K6:()=>_,Nb:()=>k,UC:()=>O,YZ:()=>l,_T:()=>A,pg:()=>F});var n=i(1771),o=i(5171),r=i(2641),s=i(4802),a=i(3920);const c=t=>+t.toFixed(4);function l(t){let e=5381;for(let i=0;i<t.length;i++)e=(e<<5)+e+t.charCodeAt(i)|0;return(e>>>0).toString(36)}const d=t=>`mcc-${t.id}-${l(JSON.stringify(t))}`,u=(t,e)=>`--mcc-${t}-${e}`;function h(t){return r.Z4.find(e=>e.id===t)?.css??t??"ease"}const m=(t,e)=>e?t.replace(/var\(\s*--mc-anim-c\s*\)/g,(t=>`color-mix(in srgb, var(${u(t,"c")}, var(--mc-anim-c)) calc(var(${u(t,"s")}, 1) * 100%), transparent)`)(e)):t,p=t=>({len:(e,i)=>0===e?`0${i}`:`calc(${c(e)}${i} * var(${u(t,"i")}, 1))`,scale:e=>1===e?"1":`calc(1 + ${c(e-1)} * var(${u(t,"i")}, 1))`,color:e=>m(e,t)}),f=(t=1)=>({len:(e,i)=>`${c(e*t)}${i}`,scale:e=>String(c(1+(e-1)*t)),color:t=>t});function g(t,e){const i=[],n=t.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${e.len(n.x??0,"px")} ${e.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const t=n.scale??1,o=t*(n.scale_x??1),r=t*(n.scale_y??1);i.push(["scale",o===r?e.scale(o):`${e.scale(o)} ${e.scale(r)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${e.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${e.len(n.skew_x??0,"deg")}, ${e.len(n.skew_y??0,"deg")})`])}if(void 0!==t.opacity&&i.push(["opacity",String(t.opacity)]),t.color&&i.push(["color",e.color(t.color)]),t.background&&i.push(["background",e.color(t.background)]),t.shadow&&i.push(["box-shadow",e.color(t.shadow)]),void 0!==t.filter||void 0!==t.blur){const n=[t.filter&&"none"!==t.filter?e.color(t.filter):"",void 0!==t.blur?`blur(${e.len(t.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==t.radius&&i.push(["border-radius",`${t.radius}px`]),void 0!==t.draw&&i.push(["stroke-dashoffset",String(c(1-t.draw))]),t.stroke&&i.push(["stroke",e.color(t.stroke)]),t.easing&&i.push(["animation-timing-function",h(t.easing)]),i}const y=(t,e)=>`  ${t} { ${e.map(([t,e])=>`${t}: ${e};`).join(" ")} }`,v=(t,e)=>`@keyframes ${t} {\n${e.join("\n")}\n}`,b={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function _(t,e,i){const n=e.map(t=>g(t,i)),o=Object.keys(b).filter(t=>e.some(e=>b[t].some(t=>void 0!==e.easings?.[t]))),r=v(t,e.map((t,e)=>y(`${c(t.at)}%`,n[e].filter(([t])=>!o.includes(t)))));if(!o.length)return{css:r,lanes:[]};const s=[],a=[r];for(const i of o){const o=`${t}-l${b[i][0]}`,r=[];e.forEach((t,e)=>{const o=n[e].filter(([t])=>t===i);if(!o.length)return;const s=b[i].map(e=>t.easings?.[e]).find(t=>void 0!==t)??t.easing;r.push(y(`${c(t.at)}%`,s?[...o,["animation-timing-function",h(s)]]:o))}),r.length&&(s.push(o),a.push(v(o,r)))}return{css:a.join("\n"),lanes:s}}const w=t=>"animation-timing-function"===t?"easing":t.replace(/-([a-z])/g,(t,e)=>e.toUpperCase());function x(t,e=1){if("path"===t.kind&&t.path)return i=t.path,n=f(e),k(i,n,"px"===i.units?["px","px"]:["%","%"]).map(([t,e])=>({...Object.fromEntries(e.map(([t,e])=>[w(t),e])),offset:c(t/100)}));var i,n;if("keyframes"!==t.kind||!t.keyframes)return[];const o=new Map;for(const i of t.keyframes){const t=o.get(i.at)??{};for(const[n,o]of g(i,f(e)))t[w(n)]=o;o.set(i.at,t)}return[...o.entries()].sort((t,e)=>t[0]-e[0]).map(([t,e])=>({...e,offset:c(t/100)}))}const $=(t,e)=>{const i=1-e,n=i*i*i,o=3*i*i*e,r=3*i*e*e,s=e*e*e;return[n*t[0][0]+o*t[1][0]+r*t[2][0]+s*t[3][0],n*t[0][1]+o*t[1][1]+r*t[2][1]+s*t[3][1]]};function k(t,e,i){return function(t,e=48){const i=(0,n.Mj)(t).flat();if(!i.length)return[];const o=[i[0][0]];for(const t of i)for(let e=1;e<=16;e++)o.push($(t,e/16));const r=[0];for(let t=1;t<o.length;t++)r.push(r[t-1]+Math.hypot(o[t][0]-o[t-1][0],o[t][1]-o[t-1][1]));const s=r[r.length-1],a=t=>{if(0===s)return o[0];let e=1;for(;e<r.length-1&&r[e]<t;)e++;const i=r[e]-r[e-1]||1,n=Math.min(1,Math.max(0,(t-r[e-1])/i));return[o[e-1][0]+(o[e][0]-o[e-1][0])*n,o[e-1][1]+(o[e][1]-o[e-1][1])*n]},c=[];let l;const d=s/(4*e)||.001;for(let t=0;t<=e;t++){const i=s*t/e,n=a(i),o=a(Math.max(0,i-d)),r=a(Math.min(s,i+d));let u=180*Math.atan2(r[1]-o[1],r[0]-o[0])/Math.PI;if(void 0!==l){for(;u-l>180;)u-=360;for(;u-l<-180;)u+=360}l=u,c.push({t:t/e,x:n[0],y:n[1],angle:u})}return c}(t.d).map(n=>{const o=[["translate",`${e.len(c(n.x),i[0])} ${e.len(c(n.y),i[1])}`]];return t.follow_rotation&&o.push(["rotate",`${c(n.angle)}deg`]),[c(100*n.t),o]})}const M=.618034,S=t=>t-Math.floor(t);function A(t){const e=t.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(e)}")`}function C(t,e){if(!t)return"border-radius: 50%; background: currentColor;";if("svg"in t){const i=e(t.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=A(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const z=t=>t&&"icon"in t?{icon:t.icon}:t&&"emoji"in t?{text:t.emoji}:void 0;function q(t,e=100){const i=t.count;return Array.from({length:i},(n,o)=>{const r=(S(o*M)-.5)*(60/i),s=Math.min(96,Math.max(4,(o+.5)/i*100+r)),a=50+e/100*(s-50),l=t.size[0]+(t.size[1]-t.size[0])*S(.381966*o+.25),d=t.colors.length?t.colors[o%t.colors.length]:"",u=[`--mcc-sz: ${c(l)}px`,"--mcc-sp: "+(o%2?-1:1),`--mcc-dx: ${c(16*(2*S(.7548*o)-1))}`,d&&`--mcc-pc: ${d}`].filter(Boolean).join("; ");return{x:c(a),phase:c(S(o*M)),k:i>1?c(o/i):0,style:u}})}const j=(t,e)=>`.mc-anim-fx[data-fx="${t}"] { opacity: var(${u(e,"s")}, 1); }\n.mc-anim-fx[data-fx="${t}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${u(e,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function E(t,e,i,n){const o=i.fade?0:1,r=`calc(var(--mcc-sp, 1) * ${c(i.spin)}deg)`,s=i.gravity,a=`${c(i.spread/2)}cqmin`,l=s>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":s<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let d,u;switch(i.direction){case"fall":case"rise":{const t="fall"===i.direction?"":"-";d="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",u=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${o};${l} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${t}100cqh ${t?"-":"+"} var(--mcc-sz) * 2); rotate: ${r}; opacity: ${o}; }`];break}case"drift":d="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",u=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${o}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${c(15*s)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${c(30*s)}cqh; rotate: ${r}; opacity: ${o}; }`];break;case"burst":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",u=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${a} * -1)) rotate(${r}); translate: 0 ${c(30*s)}cqh; opacity: ${o}; }`];break;case"orbit":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",u=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${a} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${a} * -1)) rotate(${r}); opacity: 1; }`].filter(Boolean);break;case"spiral":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",u=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${o}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${a} * -1)) rotate(${r}); opacity: ${o}; }`]}return`${j(t,e)} ${d} ${C(i.shape,n)} }\n${v(t,u)}`}function T(t,e,i,n,o){const r=p(e),s=i.follow_rotation?"auto":"0deg",a=t=>v(t,k(i,r,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([t,e])=>y(`${t}%`,[...e,["opacity","1"]]))),c=`${j(t,e)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${C(n.shape,o)} }`;if("px"!==i.units)return`${c}\n${a(t)}`;const l='offset-path: path("M0 0 L1 1")';return[c,`@supports (${l}) {`,`  .mc-anim-fx[data-fx="${t}"] > i { offset-path: path("${i.d}"); offset-rotate: ${s}; offset-anchor: center; margin: 0; }`,`  @keyframes ${t} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${l}) {`,a(t),"}"].join("\n")}function P(t,e){const i=[],n=[];let o=0;const l="icon"===t.target;return(t.steps??[]).forEach((t,d)=>{let u,m,p,f=t.duration;if((0,a.Bl)(t.animation)){const i=e?.((0,a._R)(t.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(u=x(i),f??=i.duration,m=h(i.easing),p=i.origin)}else{const e=(0,r.e2)(t.animation);u=e&&!e.channels.includes("fx")?(0,s.Wk)(e.id,{icon:l}):void 0,e&&(f??=parseFloat(e.defaults.duration),m=h(e.defaults.easing),p=e.origin)}if(!u?.length||!f)return void n.push(d);const g=o+t.delay;i.push({start:c(g),duration:f,iterations:t.repeat,easing:m??"ease",frames:u,...p&&"center"!==p?{origin:p}:{}}),o=g+f*t.repeat}),{steps:i,total:c(o),loop:!1!==t.loop,target:t.target,...t.stagger?.children?{stagger:t.stagger.delay}:{},skipped:n}}const N=new WeakMap;function O(t,e={}){const i=!e.reducedMotion&&(0,a.xS)(t);let n=i&&function(t){if(I.has(t.id))return;let e=D.get(t);const i=t.particles;try{const n=R&&!e&&L?.(i.sim,"lenient",{count:i.count,layer:i.layer}).sim;if(n){const o={...i,sim:n},r=t.duration/i.speed,s=R(t.id,o,r,{aspect:0}),a=s.other;D.set(t,e={kind:"particles",name:s.name,css:a?`${s.css}\n${a.css}`:s.css,layer:{front:s.front,particles:s.slots,speed:i.speed},sim:{docId:t.id,spec:o,period:r},...a?{split:{name:a.name,layer:{front:a.front,particles:a.slots,speed:i.speed},sim:{docId:t.id,spec:o,period:r,part:1}}}:{}})}}catch{I.add(t.id)}return e}(t)||function(t,e){if(e.reducedMotion)return{kind:t.kind,name:"",css:"",reduced:!0,..."sequence"===t.kind?{schedule:{steps:[],total:0,loop:!1,target:t.target,skipped:[]}}:{}};if("sequence"===t.kind)return{kind:"sequence",name:d(t),css:"",schedule:P(t,e.lookup)};const i=N.get(t);if(i)return i;const n=d(t),r=t=>(0,o.OW)(t).markup;let s;switch(t.kind){case"keyframes":{const{css:e,lanes:i}=_(n,t.keyframes??[],p(t.id));s={kind:"keyframes",name:n,css:e,motion:{target:t.target,origin:t.origin},...i.length?{lanes:i}:{}};break}case"particles":{const e=t.particles;if(e.preset){s={kind:"particles",name:"",css:"",preset:{id:e.preset,...void 0!==e.intensity?{intensity:e.intensity}:{}}};break}s={kind:"particles",name:n,css:E(n,t.id,e,r),layer:{front:"front"===e.layer,particles:q(e,e.spread),speed:e.speed,...z(e.shape)?{symbol:z(e.shape)}:{}}};break}case"path":{const e=t.path;if("particles"===e.subject){const i=e.particles??{count:3,size:[8,8],colors:[]};s={kind:"path",name:n,css:T(n,t.id,e,i,r),layer:{front:!1,particles:q(i),speed:1,...z(i.shape)?{symbol:z(i.shape)}:{}}};break}const i=k(e,p(t.id),"px"===e.units?["px","px"]:["%","%"]).map(([t,e])=>y(`${t}%`,e));s={kind:"path",name:n,css:v(n,i),motion:{target:"icon"===e.subject?"icon":"element",origin:t.origin}};break}}return N.set(t,s),s}(t,e);return i&&!R&&(n={...n,needsParticles:!0}),B&&(0,a.oC)(t)?{...n,v2:B(t,e)}:n}let R,L,D=new WeakMap;function W(t,e){R=t,L=e,D=new WeakMap}const I=new Set;let B;function F(t){B=t}i.d(e,["JR",0,p,"KE",0,v,"dm",0,t=>{I.add(t)},"er",0,u,"iZ",0,d,"om",0,y])},4802(t,e,i){i.d(e,{Wk:()=>c});var n=i(5514),o=i(6370),r=i(7097),s=i(2641);const a=t=>"animation-timing-function"===t?"easing":t.replace(/-([a-z])/g,(t,e)=>e.toUpperCase());function c(t,e={}){const i=(0,s.e2)(t);if(!i)return;const c=function(t,e){const i=n.S[t]??o.Tb[t]??r.H[t];if(void 0===i)return;const a=(0,s.e2)(t.replace(/-icon$/,"")),c=e??a?.defaults.intensity??1;return i.replace(/\$i/g,String(c)).replace(/\$c/g,"var(--mc-anim-c)")}(e.icon&&i.iconKeyframes?`${t}-icon`:t,e.intensity);return void 0===c?void 0:function(t){const e=new Map;for(const i of t)for(const t of i.offsets){const n=e.get(t)??{};for(const[t,e]of i.decls)n[a(t)]=e;e.set(t,n)}return[...e.entries()].sort((t,e)=>t[0]-e[0]).map(([t,e])=>({...e,offset:+(t/100).toFixed(4)}))}(function(t){const e=[];for(const i of t.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const t=i[1].split(",").map(t=>t.trim().toLowerCase()).map(t=>"from"===t?0:"to"===t?100:parseFloat(t)).filter(t=>Number.isFinite(t)),n=[];for(const t of i[2].split(";")){const e=t.indexOf(":");if(e<0)continue;const i=t.slice(0,e).trim().toLowerCase(),o=t.slice(e+1).trim().replace(/\s+/g," ");i&&o&&n.push([i,o])}t.length&&n.length&&e.push({offsets:t,decls:n})}return e}(c))}},1505(t,e,i){i.d(e,{oC:()=>o});const n=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function o(t){const e=t=>Array.isArray(t)&&t.length>0,i=t.rig;return e(t.tracks)||e(t.clips)||e(t.bindings)||!!i&&"object"==typeof i&&(e(i.parts)||e(i.shapes))}i.d(e,["G1",0,n])},3920(t,e,i){i.d(e,{A$:()=>S,H2:()=>P,SW:()=>y,W9:()=>T,d$:()=>A,oC:()=>s.oC,sO:()=>N,tz:()=>q});var n=i(1771),o=i(5171),r=i(2641),s=i(1505);const a=["keyframes","particles","path","sequence"],c=["fall","rise","drift","burst","orbit","spiral"],l={docs:200,bytes:65536,keyframes:40,particles:60,steps:20,colors:12,pathLength:8192,name:80,css:600},d=/^[a-z0-9][a-z0-9_-]{0,63}$/,u="custom:",h=t=>"string"==typeof t&&t.startsWith(u),m=t=>t.slice(7).trim(),p={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"};const f=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],g={color:new Set(f),background:new Set([...f,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(f),filter:new Set([...f,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function y(t,e){if("string"!=typeof t)return;const i=t.trim();if(!i||i.length>l.css||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const t of i)if("("===t)n++;else if(")"===t&&--n<0)return;if(0!==n)return;const o=i.match(/\(/g)?.length??0,r=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return r.length!==o||r.some(t=>!g[e].has(t[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(t=>!/^--[\w-]+$/.test(t[1]))?void 0:i}const v=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,b=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,_=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,w=["normal","reverse","alternate","alternate-reverse"];function x(t){if("string"!=typeof t)return!1;const e=t.trim();return r.Z4.some(t=>t.id===e)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(e)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(e)}const $=new Set(r.u7.filter(t=>!t.channels.includes("fx")).map(t=>t.id)),k=new Set(r.u7.filter(t=>t.channels.includes("fx")).map(t=>t.id)),M=t=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length;class S{constructor(){this.errors=[]}err(t,e){this.errors.push({path:t,message:e})}num(t,e,i,n,o,r,s=!1){const a=t[e];if(null==a||""===a)return void 0===r?void 0:r;const c="string"==typeof a?Number(a):a;return"number"==typeof c&&Number.isFinite(c)?s&&!Number.isInteger(c)?this.err(i,"Must be a whole number."):c<n||c>o?this.err(i,`Must be between ${n} and ${o}.`):c:this.err(i,"Must be a number.")}bool(t,e,i,n){const o=t[e];return null==o?n:"boolean"!=typeof o?this.err(i,"Must be true or false.")??n:o}oneOf(t,e,i,n,o){const r=t[e];return null==r||""===r?o:n.includes(r)?r:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(t,e,i,n){const o=t[e];if(null!=o&&""!==o)return y(o,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(t,e){return!t||"object"!=typeof t||Array.isArray(t)?this.err(e,"Must be an object."):t}list(t,e,i,n=0){return Array.isArray(t)?t.length<n?this.err(e,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):t.length>i?this.err(e,`At most ${i} entries.`):t:this.err(e,"Must be a list.")}}function A(t,e,i,n=!1,o=!1){const r=t.obj(e,i);if(!r)return;const a=t.num(r,"at",`${i}.at`,0,100);void 0===r.at&&t.err(`${i}.at`,"Required.");const c={at:a??0};if(void 0!==r.transform){const e=function(t,e,i){const n=t.obj(e,i);if(!n)return;const o={},r=(e,r,s)=>{const a=t.num(n,e,`${i}.${e}`,r,s);void 0!==a&&(o[e]=a)};if(r("x",-1e4,1e4),r("y",-1e4,1e4),r("scale",0,100),r("scale_x",-100,100),r("scale_y",-100,100),r("rotate",-36e3,36e3),r("skew_x",-89,89),r("skew_y",-89,89),void 0!==n.axis){const e=n.axis;!Array.isArray(e)||3!==e.length||e.some(t=>"number"!=typeof t||!Number.isFinite(t))||e.every(t=>0===t)?t.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):o.axis=[e[0],e[1],e[2]]}return o}(t,r.transform,`${i}.transform`);e&&Object.keys(e).length&&(c.transform=e)}const l=t.num(r,"opacity",`${i}.opacity`,0,1);void 0!==l&&(c.opacity=l);const d=t.css(r,"color",`${i}.color`,"color");d&&(c.color=d);const u=t.css(r,"background",`${i}.background`,"background");u&&(c.background=u);const h=t.css(r,"shadow",`${i}.shadow`,"shadow");h&&(c.shadow=h);const m=t.css(r,"filter",`${i}.filter`,"filter");m&&(c.filter=m);const p=t.num(r,"blur",`${i}.blur`,0,200);void 0!==p&&(c.blur=p);const f=t.num(r,"radius",`${i}.radius`,0,1e3);void 0!==f&&(c.radius=f),void 0!==r.easing&&""!==r.easing&&(x(r.easing)?c.easing=r.easing.trim():t.err(`${i}.easing`,"Not a valid easing."));const g=o?new S:t,y=g.css(r,"stroke",`${i}.stroke`,"color");if(y&&(c.stroke=y),void 0!==r.draw&&null!==r.draw&&""!==r.draw)if(n){const t=g.num(r,"draw",`${i}.draw`,0,1);void 0!==t&&(c.draw=t)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==r.easings&&null!==r.easings){const t=g.obj(r.easings,`${i}.easings`),e={};for(const[n,o]of Object.entries(t??{}))s.G1.includes(n)?x(o)?e[n]=o.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(e).length&&(c.easings=e)}return c}function C(t,e,i,n){const r=t.num(e,"count",`${i}.count`,1,l.particles,n.count,!0)??n.count;let s=[...n.size];if(void 0!==e.size){const n=e.size;"number"==typeof n&&n>0&&n<=200?s=[n,n]:Array.isArray(n)&&2===n.length&&n.every(t=>"number"==typeof t&&t>0&&t<=200)&&n[0]<=n[1]?s=[n[0],n[1]]:t.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const a=[];if(void 0!==e.colors){const n=t.list(e.colors,`${i}.colors`,l.colors);n?.forEach((e,n)=>{const o=y(e,"color");o?a.push(o):t.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const c=void 0!==e.shape&&null!==e.shape?function(t,e,i){const n=t.obj(e,i);if(!n)return;const r=["icon","emoji","svg"].filter(t=>void 0!==n[t]&&""!==n[t]);if(1!==r.length)return t.err(i,"Set one of icon, emoji or svg.");const s=r[0],a=n[s];if("string"!=typeof a)return t.err(`${i}.${s}`,"Must be text.");if("icon"===s)return _.test(a.trim())?{icon:a.trim()}:t.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===s){const e=a.trim();return e&&[...e].length<=8&&!/[<>&"'\\{};]/.test(e)?{emoji:e}:t.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(M(a)>32768)return t.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(a))return t.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const e=(0,o.OW)(a);if(e.error)return t.err(`${i}.svg`,e.error)}return{svg:a}}(t,e.shape,`${i}.shape`):void 0;return{...c?{shape:c}:{},count:r,size:s,colors:a}}let z;function q(t){z=t}const j=["rig","tracks","clips","bindings"];let E;function T(t){E=t}function P(t,e={}){const i=new S,o=i.obj(t,"");if(!o)return{ok:!1,errors:i.errors};let r;try{r=JSON.stringify(o)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(M(r)>l.bytes)return{ok:!1,errors:[{path:"",message:`The animation is larger than ${l.bytes/1024} KB.`}]};const s="string"==typeof o.id?o.id.trim():"";d.test(s)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const u="string"==typeof o.name?o.name.trim():"";u?u.length>l.name&&i.err("name",`At most ${l.name} characters.`):i.err("name","Required."),void 0!==o.version&&1!==o.version&&i.err("version","Unsupported version (expected 1).");const f=i.oneOf(o,"kind","kind",a);o.kind||i.err("kind","Required.");const g={id:s,name:u,kind:f??"keyframes",duration:i.num(o,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(o,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==o.easing&&""!==o.easing&&(x(o.easing)?g.easing=o.easing.trim():i.err("easing","Not a valid easing.")),void 0!==o.iterations&&"infinite"!==o.iterations){const t=i.num(o,"iterations","iterations",.01,1e3);void 0!==t&&(g.iterations=t)}const y=i.oneOf(o,"direction","direction",w);switch(y&&"normal"!==y&&(g.direction=y),void 0!==o.origin&&""!==o.origin&&("string"==typeof o.origin&&v.test(o.origin.trim())?g.origin=o.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),f){case"keyframes":{const t=Array.isArray(o.tracks)&&o.tracks.length>0,n=void 0===o.keyframes?t?[]:i.err("keyframes","Required."):i.list(o.keyframes,"keyframes",l.keyframes,t?0:1),r="lenient"===e.v2,s=(n??[]).map((t,e)=>A(i,t,`keyframes[${e}]`,!1,r)).filter(t=>!!t);g.keyframes=s.sort((t,e)=>t.at-e.at);break}case"particles":void 0===o.particles?i.err("particles","Required."):g.particles=function(t,e,i,n){const o=t.obj(e,i);if(!o)return;const r=p,s={...C(t,o,i,r),direction:t.oneOf(o,"direction",`${i}.direction`,c,r.direction)??r.direction,speed:t.num(o,"speed",`${i}.speed`,.1,10,r.speed)??r.speed,spin:t.num(o,"spin",`${i}.spin`,-3600,3600,r.spin)??r.spin,fade:t.bool(o,"fade",`${i}.fade`,r.fade),spread:t.num(o,"spread",`${i}.spread`,0,100,r.spread)??r.spread,gravity:t.num(o,"gravity",`${i}.gravity`,-1,1,r.gravity)??r.gravity,layer:t.oneOf(o,"layer",`${i}.layer`,["back","front"],r.layer)??r.layer};if(void 0!==o.preset&&""!==o.preset){"string"==typeof o.preset&&k.has(o.preset)?s.preset=o.preset:t.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const e=t.num(o,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==e&&(s.intensity=e)}if(void 0!==o.sim&&null!==o.sim&&(n?new S:t).obj(o.sim,`${i}.sim`))if(z){const e=z(o.sim,n?"lenient":"strict",{count:s.count,layer:s.layer});n||t.errors.push(...e.errors),!e.sim||!n&&e.errors.length||(s.sim=e.sim)}else s.sim=o.sim;return s}(i,o.particles,"particles","lenient"===e.v2);break;case"path":void 0===o.path?i.err("path","Required."):g.path=function(t,e,i){const o=t.obj(e,i);if(!o)return;let r="";"string"==typeof o.d&&o.d.trim()?o.d.length>l.pathLength?t.err(`${i}.d`,`At most ${l.pathLength} characters.`):b.test(o.d)&&/^\s*[Mm]/.test(o.d)?(0,n.Mj)(o.d).some(t=>t.length)?r=o.d.trim().replace(/\s+/g," "):t.err(`${i}.d`,"The path draws nothing."):t.err(`${i}.d`,"Not valid path data (it must start with M)."):t.err(`${i}.d`,"Required.");const s={d:r,units:t.oneOf(o,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:t.bool(o,"follow_rotation",`${i}.follow_rotation`,!1),subject:t.oneOf(o,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==o.particles&&null!==o.particles){const e=t.obj(o.particles,`${i}.particles`);e&&(s.particles=C(t,e,`${i}.particles`,{...p,count:3}))}return s}(i,o.path,"path");break;case"sequence":{g.steps=void 0===o.steps?(i.err("steps","Required."),[]):function(t,e,i,n){const o=t.list(e,i,l.steps,1);if(!o)return[];const r=[];return o.forEach((e,o)=>{const s=`${i}[${o}]`,a=t.obj(e,s);if(!a)return;const c="string"==typeof a.animation?a.animation.trim():"";c?h(c)?m(c)===n?t.err(`${s}.animation`,"A sequence cannot play itself."):d.test(m(c))||t.err(`${s}.animation`,"Not a valid animation id."):$.has(c)||t.err(`${s}.animation`,"Must be a motion preset or a custom keyframes / path animation."):t.err(`${s}.animation`,"Required.");const l={animation:c,delay:t.num(a,"delay",`${s}.delay`,0,600,0)??0,repeat:t.num(a,"repeat",`${s}.repeat`,1,100,1,!0)??1},u=t.num(a,"duration",`${s}.duration`,.05,600);void 0!==u&&(l.duration=u),r.push(l)}),r}(i,o.steps,"steps",s),g.loop=i.bool(o,"loop","loop",!0);const t=void 0===o.stagger||null===o.stagger?{}:i.obj(o.stagger,"stagger");t&&(g.stagger={children:i.bool(t,"children","stagger.children",!1),delay:i.num(t,"delay","stagger.delay",0,10,.1)??.1});break}}if(f)if(E)"lenient"===e.v2?Object.assign(g,E(o,new S)):Object.assign(g,E(o,i));else for(const t of j)void 0===o[t]||null===o[t]||"clips"!==t&&"keyframes"!==f||(g[t]=o[t]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:g,errors:[]}}function N(t,e={}){const i=new Map,n=[];return(Array.isArray(t)?t:t&&"object"==typeof t?Object.entries(t).map(([t,e])=>e&&"object"==typeof e&&!("id"in e)&&d.test(t)?{id:t,...e}:e):[]).forEach((t,o)=>{if(i.size>=l.docs)return void(i.size===l.docs&&o===l.docs&&n.push({path:`[${o}]`,message:`At most ${l.docs} animations.`}));const r=P(t,e);r.ok?i.has(r.doc.id)?n.push({path:`[${o}].id`,message:`Duplicate id "${r.doc.id}".`}):i.set(r.doc.id,r.doc):n.push(...r.errors.map(t=>({path:`[${o}]${t.path?`.${t.path}`:""}`,message:t.message})))}),{docs:i,errors:n}}i.d(e,["$L",0,a,"A1",0,_,"Ae",0,c,"Bl",0,h,"Bp",0,l,"D8",0,u,"_R",0,m,"cA",0,b,"pQ",0,v,"t_",0,d,"xS",0,t=>"particles"===t.kind&&!!t.particles?.sim&&!t.particles.preset])},4722(t,e,i){i.d(e,{XF:()=>a,ag:()=>c});const n=new Map;let o;const r=new Set,s=()=>[...n.values()].map(t=>t.css).join("\n");function a(t,e,i){e&&i&&n.get(t)?.name!==e&&(n.set(t,{name:e,css:i}),function(){const t=s();o?.replaceSync(t);for(const e of r)e.isConnected?e.textContent=t:r.delete(e)}())}function c(t){if(!t||!n.size)return;if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype)return o||(o=new CSSStyleSheet,o.replaceSync(s())),void(t.adoptedStyleSheets.includes(o)||(t.adoptedStyleSheets=[...t.adoptedStyleSheets,o]));let e=t.querySelector(":scope > style[data-mc-custom-anim]");e||(e=document.createElement("style"),e.setAttribute("data-mc-custom-anim",""),t.prepend(e)),e.textContent=s(),r.add(e)}},2675(t,e,i){i.d(e,{t:()=>r});var n=i(4753);const o=['Activate {name}|Activate {type} module|Button|Card config must be a mapping|Close|Config must be an object|Config must have a rows array|Config must have a type|Day|Day {n}|Decrease {name}|Dropdown|Effect|Empty column|Empty row|Empty slider|Empty tab|Entity is required|Entity is required when using entity picture|Failed to load "{type}": {error}|Forecast not available: {error}|History unavailable|Home Assistant card helpers are not available|Increase {name}|Invalid configuration: {errors}|Light|Loading card...|Loading history…|Magic Card: the visual editor could not be loaded.|Markdown content is required|Min must be less than max|Needs another device|Next slide|Night|No camera|No card type set|No configuration|No configuration provided|No entity|No forecast data|No numeric history|No options|Pop-up|Previous slide|Row {row} must have a columns array|Row {row}, Col {col}, Module {module} ({type}): {error}|Row {row}, Col {col}, Module {module}: missing type|Row {row}, Col {col}, Module {module}: must be an object|Row {row}, Col {col}, Module {module}: unknown type "{type}"|Row {row}, Column {col} must have a modules array|Slider|Spinbox|Step must be greater than 0|Template "{name}" couldn\'t be loaded. Showing this card\'s own settings.|Template "{name}" wasn\'t found. Showing this card\'s own settings.|Template error: {error}|Template is required|Text content is required|This entity has no forecast|Timeout waiting for {tag}|Toggle {name}|Unavailable|Unknown module: {type}|unavailable|{name} colour|{name} effect|{name}: last {hours, plural, one {# hour} other {# hours}}','Activate {name}|Activate {type} module|Button|Card config must be a mapping|Close|Config must be an object|Config must have a rows array|Config must have a type|Day|Day {n}|Decrease {name}|Dropdown|Effect|Empty column|Empty row|Empty slider|Empty tab|Entity is required|Entity is required when using entity picture|Failed to load "{type}": {error}|Forecast not available: {error}|History unavailable|Home Assistant card helpers are not available|Increase {name}|Invalid configuration: {errors}|Light|Loading card...|Loading history…|Magic Card: the visual editor could not be loaded.|Markdown content is required|Min must be less than max|Needs another device|Next slide|Night|No camera|No card type set|No configuration|No configuration provided|No entity|No forecast data|No numeric history|No options|Pop-up|Previous slide|Row {row} must have a columns array|Row {row}, Col {col}, Module {module} ({type}): {error}|Row {row}, Col {col}, Module {module}: missing type|Row {row}, Col {col}, Module {module}: must be an object|Row {row}, Col {col}, Module {module}: unknown type "{type}"|Row {row}, Column {col} must have a modules array|Slider|Spinbox|Step must be greater than 0|Template "{name}" couldn\'t be loaded. Showing this card\'s own settings.|Template "{name}" wasn\'t found. Showing this card\'s own settings.|Template error: {error}|Template is required|Text content is required|This entity has no forecast|Timeout waiting for {tag}|Toggle {name}|Unavailable|Unknown module: {type}|unavailable|{name} color|{name} effect|{name}: last {hours, plural, one {# hour} other {# hours}}','{name} activeren|Module {type} activeren|Knop|De kaartconfiguratie moet een mapping zijn|Sluiten|De configuratie moet een object zijn|De configuratie moet een lijst met rijen (rows) bevatten|De configuratie moet een type bevatten|Dag|Dag {n}|{name} verlagen|Keuzelijst|Effect|Lege kolom|Lege rij|Lege schuifreeks|Leeg tabblad|Een entiteit is verplicht|Een entiteit is verplicht bij een entiteitsafbeelding|Laden van "{type}" mislukt: {error}|Weersverwachting niet beschikbaar: {error}|Geschiedenis niet beschikbaar|De kaarthulpfuncties van Home Assistant zijn niet beschikbaar|{name} verhogen|Ongeldige configuratie: {errors}|Licht|Kaart laden...|Geschiedenis laden…|Magic Card: de visuele editor kon niet worden geladen.|Markdown-inhoud is verplicht|Het minimum moet kleiner zijn dan het maximum|Heeft een ander apparaat nodig|Volgende dia|Nacht|Geen camera|Geen kaarttype ingesteld|Geen configuratie|Geen configuratie opgegeven|Geen entiteit|Geen weersverwachting|Geen numerieke geschiedenis|Geen opties|Pop-up|Vorige dia|Rij {row} moet een lijst met kolommen (columns) bevatten|Rij {row}, kolom {col}, module {module} ({type}): {error}|Rij {row}, kolom {col}, module {module}: type ontbreekt|Rij {row}, kolom {col}, module {module}: moet een object zijn|Rij {row}, kolom {col}, module {module}: onbekend type "{type}"|Rij {row}, kolom {col} moet een lijst met modules (modules) bevatten|Schuifregelaar|Getalkiezer|De stapgrootte moet groter zijn dan 0|Sjabloon "{name}" kon niet worden geladen. De eigen instellingen van deze kaart worden getoond.|Sjabloon "{name}" is niet gevonden. De eigen instellingen van deze kaart worden getoond.|Templatefout: {error}|Een template is verplicht|Tekstinhoud is verplicht|Deze entiteit heeft geen weersverwachting|Time-out bij het wachten op {tag}|{name} aan- of uitzetten|Niet beschikbaar|Onbekende module: {type}|niet beschikbaar|{name} kleur|{name} effect|{name}: afgelopen {hours, plural, one {# uur} other {# uur}}'],{t:r,tc:s,tx:a,m:c}=(0,n.my)("card",o)},3518(t,e,i){i.d(e,{Bi:()=>d,Ed:()=>p,vb:()=>m});var n=i(6161),o=i(5707),r=i(8668),s=i(9136),a=i(170),c=i(1476),l=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};function d(t){const e=t.offsetWidth,i=t.offsetHeight,n="function"==typeof t.getBoundingClientRect?t.getBoundingClientRect():void 0;return n&&Math.abs(n.width-e)<1&&Math.abs(n.height-i)<1?{w:n.width,h:n.height}:{w:e,h:i}}const u=new Map;let h;function m(t,e){let i=u.get(t);i||(i=new Set,u.set(t,i),(h||"function"!=typeof ResizeObserver||(h=new ResizeObserver(t=>{for(const e of t)u.get(e.target)?.forEach(t=>t.measure())})),h)?.observe(t)),i.add(e)}function p(t,e){const i=u.get(t);i&&(i.delete(e),i.size||(u.delete(t),h?.unobserve(t)))}let f=class extends n.WF{constructor(){super(...arguments),this._onMedia=()=>this.requestUpdate(),this._onEnd=()=>{this.hasAttribute("data-tap")&&this.removeAttribute("data-tapped")}}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._observe(),this._timer()}disconnectedCallback(){super.disconnectedCallback(),this._tick?.run(!1),this._unobserve(),this._media?.removeEventListener?.("change",this._onMedia)}_unobserve(){this._observed&&p(this._observed,this),this._mutations?.disconnect(),this._mutations=void 0,this._observed=void 0}_observe(){const t=this.parentElement;t&&t!==this._observed&&(this._unobserve(),this._observed=t,m(t,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this.measure()),this._mutations.observe(t,{attributes:!0,attributeFilter:["style","class"]})),this.measure())}measure(){const t=this.parentElement;if(!t)return;const e=getComputedStyle(t),{w:i,h:n}=this.shape?d(t):{w:t.offsetWidth,h:t.offsetHeight},o={w:i,h:n,top:parseFloat(e.borderTopWidth)||0,left:parseFloat(e.borderLeftWidth)||0,radii:(0,r.G3)(e,i,n)};JSON.stringify(o)!==JSON.stringify(this._box)&&(this._box=o)}updated(t){super.updated(t),this._observe(),t.has("ring")&&this._timer()}_timer(){const t=this.ring?.timer,e=!!t&&this.isConnected&&t.end>Date.now();e&&(this._tick??=new c.bU(this,()=>{this.requestUpdate(),this.ring?.timer&&this.ring.timer.end>Date.now()||this._tick?.run(!1)})),this._tick?.run(e)}render(){const t=this.ring?.timer?{...this.ring,...(0,a.dg)(this.ring.timer)}:this.ring,e=this._box;if(!t||!e)return n.s6;const i={inset:(0,a.cr)(t.position,t.width),start:t.start,direction:t.direction},o=this.shape?(0,r.fI)(this.shape.kind,e.w,e.h,this.shape.options,i):(0,r.C8)(e.w,e.h,e.radii,i),c=(0,a.nI)(t,!!this._media?.matches);if(!o)return n.s6;const l=(0,s.w)(t.paint),d=l?.stops[0]===t.color?l:void 0,u=t.glow>0?`; filter: drop-shadow(0 0 ${t.glow}px ${t.color})`:"",h=[`--mc-ring-w: ${t.width}px`,`stroke: ${d?"url(#g)":t.color}`,`stroke-width: ${t.width}px`,`stroke-linecap: ${c.linecap}`,`stroke-dasharray: ${c.dasharray}`,`stroke-dashoffset: ${c.dashoffset}`,`opacity: ${c.opacity}`,`animation: ${c.animation}`,`transition: ${c.transition}`].join("; "),m=`top: ${-e.top}px; left: ${-e.left}px; width: ${e.w}px; height: ${e.h}px${void 0!==t.opacity?`; opacity: ${t.opacity}`:""}`;return n.qy`<svg style=${m} viewBox="0 0 ${e.w} ${e.h}" preserveAspectRatio="none" focusable="false">
      ${d?(0,s.o)("g",d.angle,d.stops,{x:0,y:0,w:e.w,h:e.h}):n.s6}
      ${t.track?n.JW`<path d=${o} pathLength="100" style="stroke: ${t.track}; stroke-width: ${t.width}px"></path>`:n.s6}
      <path d=${o} pathLength="100" style="${h}${u}" @animationend=${this._onEnd}></path>
    </svg>`}};f.styles=n.AH`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
      z-index: 1;
    }
    svg {
      position: absolute;
      overflow: visible;
    }
    path {
      fill: none;
    }
    @keyframes mc-ring-run {
      from {
        stroke-dashoffset: 0;
      }
      to {
        stroke-dashoffset: -100;
      }
    }
    @keyframes mc-ring-pulse {
      0%,
      100% {
        opacity: 1;
        stroke-width: var(--mc-ring-w);
      }
      50% {
        opacity: 0.35;
        stroke-width: calc(var(--mc-ring-w) * 0.5);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      path {
        animation: none !important;
        transition: none !important;
      }
    }
  `,l([(0,o.MZ)({attribute:!1,hasChanged:(t,e)=>!function(t,e){if(t===e)return!0;if(!t||!e)return!1;const i=Object.keys(t);return i.length===Object.keys(e).length&&i.every(i=>t[i]===e[i]||"timer"===i&&JSON.stringify(t[i])===JSON.stringify(e[i]))}(t,e)})],f.prototype,"ring",void 0),l([(0,o.MZ)({attribute:!1,hasChanged:(t,e)=>JSON.stringify(t)!==JSON.stringify(e)})],f.prototype,"shape",void 0),l([(0,o.wk)()],f.prototype,"_box",void 0),f=l([(0,o.EM)("mc-ring")],f)},9186(t,e,i){i.d(e,{R:()=>r});var n=i(5832);const o=new class{constructor(){this._handles=new Set,this._onHashChange=()=>this._notify("push"),this._onPopState=()=>this._notify("pop"),this._onLocationChanged=t=>{const e=!!t.detail?.replace;this._notify(e?"replace":"push")}}register(t){this._handles.size||this._listen(!0),this._handles.add(t)}unregister(t){this._handles.delete(t),this._open===t&&(this._open=void 0),this._handles.size||this._listen(!1)}willOpen(t){const e=this._open;this._open=t,e&&e!==t&&e.closeForOther()}didClose(t){this._open===t&&(this._open=void 0)}get openHandle(){return this._open}closeOpen(){const t=this._open;return!!t&&(t.closeByAction(),!0)}knownIds(){const t=new Set;for(const e of this._handles){const i=e.popupId();i&&t.add(i)}return[...t].sort((t,e)=>t.localeCompare(e))}preview(t){const e=[...this._handles].filter(t=>t.isPopup()&&t.editorPlace()),i=(t?["canvas","card-editor","dashboard-edit"]:["card-editor","canvas","dashboard-edit"]).map(t=>e.find(e=>e.editorPlace()===t)).find(Boolean);return!!i&&(i.openPreview(),!0)}_listen(t){if("undefined"==typeof window)return;const e=t?"addEventListener":"removeEventListener";window[e]("hashchange",this._onHashChange),window[e]("popstate",this._onPopState),window[e]("location-changed",this._onLocationChanged)}_notify(t){for(const e of[...this._handles])e.locationChanged(t)}};function r(t){const e=(0,n.oi)(t);return!!(0,n.BI)(e)&&(window.location.hash===`#${e}`?(window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})),!0):(history.pushState(history.state,"",(0,n.WV)(window.location.href,e)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),!0))}i.d(e,["P",0,o])},9486(t,e,i){i.d(e,{$d:()=>s,D5:()=>u,kj:()=>d});var n=i(3664),o=i(3852);const r=new Map;function s(t){const e=`s${(0,n.YZ)(JSON.stringify(t))}`;return r.set(e,t),r.size>64&&r.delete(r.keys().next().value),e}const a=()=>"function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;class c{constructor(t,e){this._el=t,this._run=e,this._anims=[],this._cycle=0,this._stopped=!1,this._on=!0}_targets(){return(void 0!==this._run.stagger?[...this._el.children].filter(t=>"true"!==t.getAttribute("aria-hidden")&&!t.localName.startsWith("mc-")&&"style"!==t.localName):[this._el]).map(t=>"icon"===this._run.target?t.querySelector(".mc-anim-icon")??t:t)}_start(){if(this._stopped||a()||!this._run.steps.length)return;const{steps:t,scale:e}=this._run,i=[];if(this._targets().forEach((n,o)=>{if("function"!=typeof n.animate)return;const r=(0===this._cycle?this._run.delay:0)+o*(this._run.stagger??0);for(const o of t){const t=o.origin?o.frames.map(t=>({...t,transformOrigin:o.origin})):o.frames;i.push(n.animate(t,{duration:o.duration*e*1e3,delay:1e3*(r+o.start*e),iterations:o.iterations,easing:o.easing,fill:"none"}))}}),this._anims=i,i.length){if(!this._on)for(const t of i)t.pause();Promise.all(i.map(t=>t.finished)).then(()=>{if(this._stopped||this._anims!==i)return;this._cycle++;const t=void 0!==this._run.cycles?this._cycle<this._run.cycles:this._run.loop;this._anims=[],t&&this._start()},()=>{})}}visible(t){if(!this._stopped)if(this._on=t,t)if(this._anims.length)for(const t of this._anims)t.play();else 0===this._cycle&&this._start();else for(const t of this._anims)t.pause()}get playing(){return this._anims.some(t=>"running"===t.playState)}stop(){this._stopped=!0;for(const t of this._anims)t.cancel();this._anims=[]}}class l{constructor(t,e){this.el=t,this.key=e,this._runs=e.split(" ").map(t=>r.get(t)).filter(t=>!!t).map(e=>new c(t,e)),(0,o.jR)(t,t=>this._runs.forEach(e=>e.visible(t)))||this._runs.forEach(t=>t.visible(!0))}get playing(){return this._runs.some(t=>t.playing)}visible(t){this._runs.forEach(e=>e.visible(t))}stop(){(0,o.eF)(this.el),this._runs.forEach(t=>t.stop())}}function d(t,e){const i=new Set;for(const n of t?.querySelectorAll("[data-mc-seq]")??[]){const t=n.getAttribute("data-mc-seq")??"";i.add(n);const o=e.get(n);o?.key!==t&&(o?.stop(),e.set(n,new l(n,t)))}for(const[t,n]of e)i.has(t)||(n.stop(),e.delete(t))}function u(t){for(const e of t.values())e.stop();t.clear()}i.d(e,["VN",0,a])},2061(t,e,i){Object.freeze({path:"",viewBox:"0 0 24 24"});i.d(e,["S8",0,"mcu-library-changed","dD",0,{iconsList:"magic_card_utils/icons_list",iconsGet:"magic_card_utils/icons_get",iconsSave:"magic_card_utils/icons_save",iconsDelete:"magic_card_utils/icons_delete",shapesList:"magic_card_utils/shapes_list",shapesSave:"magic_card_utils/shapes_save",shapesDelete:"magic_card_utils/shapes_delete",themePresetsList:"magic_card_utils/theme_presets_list",themePresetsSave:"magic_card_utils/theme_presets_save",themePresetsDelete:"magic_card_utils/theme_presets_delete",subscribe:"magic_card_utils/subscribe_library"},"yK",0,/^[a-z0-9][a-z0-9_-]{0,63}$/])},7097(t,e,i){const n={pendulum:"\n    from { rotate: calc($i * -1deg); }\n    to { rotate: calc($i * 1deg); }",orbit:"\n    0%, 100% { translate: calc($i * 1px) 0; }\n    12.5% { translate: calc($i * 0.707px) calc($i * 0.707px); }\n    25% { translate: 0 calc($i * 1px); }\n    37.5% { translate: calc($i * -0.707px) calc($i * 0.707px); }\n    50% { translate: calc($i * -1px) 0; }\n    62.5% { translate: calc($i * -0.707px) calc($i * -0.707px); }\n    75% { translate: 0 calc($i * -1px); }\n    87.5% { translate: calc($i * 0.707px) calc($i * -0.707px); }","coin-spin":"\n    from { rotate: y 0deg; }\n    to { rotate: y calc($i * 1deg); }","rotate-3d":"\n    from { rotate: 1 1 0 calc($i * -1deg); }\n    to { rotate: 1 1 0 calc($i * 1deg); }","squash-stretch":"\n    0%, 100% { scale: 1 1; translate: 0 0; }\n    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); translate: 0 0; }\n    45% { scale: calc(1 - $i / 200) calc(1 + $i / 150); translate: 0 calc($i * -0.8px); }\n    70% { scale: 1 1; translate: 0 calc($i * -0.4px); }\n    85% { scale: calc(1 + $i / 160) calc(1 - $i / 160); translate: 0 0; }",wiggle:"\n    0%, 40%, 100% { rotate: 0deg; }\n    5% { rotate: calc($i * 1deg); }\n    10% { rotate: calc($i * -1deg); }\n    15% { rotate: calc($i * 0.8deg); }\n    20% { rotate: calc($i * -0.6deg); }\n    25% { rotate: calc($i * 0.4deg); }\n    30% { rotate: calc($i * -0.2deg); }","shadow-lift":"\n    0%, 100% { translate: 0 0; box-shadow: 0 1px 2px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2)); }\n    50% { translate: 0 calc($i * -1px); box-shadow: 0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3)); }","shadow-lift-icon":"\n    0%, 100% { translate: 0 0; filter: drop-shadow(0 1px 1px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2))); }\n    50% { translate: 0 calc($i * -1px); filter: drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3))); }","holographic-shimmer":"\n    from { translate: 0 0; filter: hue-rotate(0deg); }\n    to { translate: -50% 0; filter: hue-rotate(360deg); }",scanline:"\n    from { translate: 0 -100%; }\n    to { translate: 0 100cqh; }",twinkle:"\n    0%, 100% { scale: 0; rotate: 0deg; opacity: 0; }\n    50% { scale: 1; rotate: 90deg; opacity: 1; }",spotlight:"\n    0%, 100% { translate: -30cqw -10cqh; }\n    33% { translate: 25cqw 15cqh; }\n    66% { translate: 10cqw -20cqh; }","neon-border":"\n    0%, 100% {\n      box-shadow: 0 0 0 1px $c, 0 0 calc($i * 0.6px) color-mix(in srgb, $c 70%, transparent),\n        inset 0 0 calc($i * 0.5px) color-mix(in srgb, $c 45%, transparent);\n    }\n    50% {\n      box-shadow: 0 0 0 1.5px $c, 0 0 calc($i * 1.4px) $c,\n        inset 0 0 calc($i * 0.9px) color-mix(in srgb, $c 60%, transparent);\n    }","neon-border-icon":"\n    0%, 100% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.3px) color-mix(in srgb, $c 70%, transparent)); }\n    50% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.7px) $c); }","color-cycle-bg":"\n    from { filter: hue-rotate(0deg); }\n    to { filter: hue-rotate(360deg); }",aurora:"\n    0%, 100% { translate: -12% 0; rotate: -8deg; scale: 1 1; opacity: calc($i / 100); }\n    50% { translate: 12% 6%; rotate: 6deg; scale: 1.15 0.85; opacity: calc($i / 160); }","lava-lamp":"\n    0% { translate: 0 0; scale: 1 1; opacity: 0.9; }\n    50% { translate: 6px -45cqh; scale: 1.25 0.85; }\n    100% { translate: -4px -85cqh; scale: 0.85 1.15; opacity: 0.9; }","plasma-gradient":"\n    0% { rotate: 0deg; scale: 1; }\n    50% { rotate: 180deg; scale: 1.25; }\n    100% { rotate: 360deg; scale: 1; }","gradient-flow":"\n    from { translate: 0 0; }\n    to { translate: -66.667% 0; }",starfield:"\n    0%, 100% { opacity: 0.15; scale: 0.6; }\n    50% { opacity: 1; scale: 1; }","meteor-shower":"\n    0% { translate: 0 0; opacity: 0; }\n    6% { opacity: 1; }\n    40%, 100% { translate: -60cqw 60cqh; opacity: 0; }",bokeh:"\n    0% { translate: 0 0; scale: 0.8; opacity: 0.15; }\n    50% { opacity: 0.55; }\n    100% { translate: 10px -16px; scale: 1.15; opacity: 0.25; }","matrix-rain":"\n    0% { translate: 0 -100%; opacity: 0; }\n    10% { opacity: 1; }\n    100% { translate: 0 calc(100cqh + 100%); opacity: 0.6; }",smoke:"\n    0% { translate: 0 0; scale: 0.4; opacity: 0; }\n    20% { opacity: 0.5; }\n    100% { translate: 18px -90cqh; scale: 2.6; opacity: 0; }","clouds-drift":"\n    from { translate: 0 0; opacity: 0.9; }\n    to { translate: calc(100cqw + 100%) 0; opacity: 0.9; }","water-ripple":"\n    0% { scale: 0.05; opacity: 0.9; }\n    100% { scale: 1; opacity: 0; }",fireworks:"\n    0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1); opacity: 1; }\n    70% { opacity: 1; }\n    100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(0.3); opacity: 0; }","tap-ripple":"\n    0% { scale: 0; opacity: calc($i / 100); }\n    100% { scale: 1; opacity: 0; }",press:"\n    0%, 100% { scale: 1; }\n    40% { scale: calc(1 - $i / 100); }"},o={"holographic-shimmer":"\n    left: 0; top: 0; width: 400%; height: 100%; opacity: calc($i / 100);\n    background: linear-gradient(115deg, transparent 20%, color-mix(in srgb, $c 55%, #ff80ab) 35%,\n      color-mix(in srgb, $c 55%, #80d8ff) 50%, color-mix(in srgb, $c 55%, #ccff90) 65%, transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"\n    left: 0; top: 0; width: 100%; height: 14%; opacity: calc($i / 100);\n    background: linear-gradient(transparent, color-mix(in srgb, $c 45%, transparent) 70%, $c 96%, transparent);",twinkle:"\n    top: calc(8% + var(--mc-anim-phase) * 80%); width: 10px; height: 10px; margin: -5px 0 0 -5px; background: $c;\n    clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);",spotlight:"\n    left: 50%; top: 50%; width: 70cqmin; aspect-ratio: 1; margin: -35cqmin 0 0 -35cqmin; opacity: calc($i / 100);\n    border-radius: 50%; background: radial-gradient(circle, $c, transparent 65%);","color-cycle-bg":"left: 0; top: 0; width: 100%; height: 100%; opacity: calc($i / 100); background: $c;",aurora:"\n    left: -25%; top: calc(-10% + var(--mc-anim-k) * 40%); width: 150%; height: 55%;\n    background: radial-gradient(ellipse 30% 50% at 32% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent),\n      radial-gradient(ellipse 30% 50% at 62% 50%, color-mix(in srgb, $c 50%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 50%, #00e5ff) 45%, transparent) 45%, transparent);","aurora|:nth-child(2)":"\n    animation-duration: calc(var(--mc-fx-dur) * 1.4); animation-direction: reverse;\n    background: radial-gradient(ellipse 30% 50% at 37% 50%, color-mix(in srgb, $c 50%, #76ff03), color-mix(in srgb, color-mix(in srgb, $c 50%, #76ff03) 45%, transparent) 45%, transparent),\n      radial-gradient(ellipse 30% 50% at 68% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent);","aurora|:nth-child(3)":"\n    animation-duration: calc(var(--mc-fx-dur) * 0.8);\n    background: radial-gradient(ellipse 38% 50% at 42% 50%, color-mix(in srgb, $c 50%, #e040fb), color-mix(in srgb, color-mix(in srgb, $c 50%, #e040fb) 45%, transparent) 45%, transparent);","lava-lamp":"\n    bottom: -12%; width: calc(14cqmin + var(--mc-anim-phase) * 16cqmin); aspect-ratio: 1; margin-left: -10cqmin; border-radius: 50%;\n    background: radial-gradient(circle at 35% 35%, color-mix(in srgb, $c 55%, #fff), $c 70%); filter: blur(2px);","plasma-gradient":"\n    left: 50%; top: 50%; width: 160cqmax; aspect-ratio: 1; margin: -80cqmax 0 0 -80cqmax; opacity: calc($i / 100);\n    background: radial-gradient(circle at 30% 30%, $c, color-mix(in srgb, $c 55%, transparent) 22%, color-mix(in srgb, $c 15%, transparent) 38%, transparent 52%),\n      radial-gradient(circle at 70% 40%, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 15%, transparent) 38%, transparent 52%),\n      radial-gradient(circle at 45% 75%, color-mix(in srgb, $c 40%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 15%, transparent) 38%, transparent 52%);","gradient-flow":"\n    left: 0; top: 0; width: 300%; height: 100%; opacity: calc($i / 100);\n    background: linear-gradient(110deg, $c, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, $c 40%, #00e5ff), $c);",starfield:"\n    top: calc(6% + var(--mc-anim-phase) * 86%); width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 4px 1px color-mix(in srgb, $c 60%, transparent);","starfield|:nth-child(3n)":"width: 2px; height: 2px;","meteor-shower":"\n    top: calc(-10% + var(--mc-anim-phase) * 30%); left: calc(30% + var(--mc-anim-x) * 0.8); width: 22%; height: 2px;\n    rotate: -45deg; transform-origin: 0 50%; border-radius: 2px; background: linear-gradient(90deg, $c, transparent);",bokeh:"\n    top: calc(10% + var(--mc-anim-phase) * 75%); width: calc(10cqmin + var(--mc-anim-k) * 18cqmin); aspect-ratio: 1;\n    margin: -10cqmin 0 0 -10cqmin; border-radius: 50%; filter: blur(1px);\n    background: radial-gradient(circle, color-mix(in srgb, $c 70%, transparent), color-mix(in srgb, $c 25%, transparent) 60%, transparent 72%);","matrix-rain":"\n    top: 0; width: 2px; height: calc(20% + var(--mc-anim-phase) * 25%); border-radius: 1px;\n    background: linear-gradient(transparent, color-mix(in srgb, $c 60%, transparent) 70%, $c);","matrix-rain|:nth-child(odd)":"\n    width: 3px; background: repeating-linear-gradient(transparent 0 3px, $c 3px 6px);\n    -webkit-mask: linear-gradient(transparent, #000); mask: linear-gradient(transparent, #000);",smoke:"\n    bottom: -20px; width: 26px; height: 26px; margin-left: -13px; border-radius: 50%;\n    background: color-mix(in srgb, $c 70%, #9e9e9e); filter: blur(8px);","clouds-drift":"\n    left: -40%; top: calc(5% + var(--mc-anim-phase) * 55%); width: 38%; aspect-ratio: 2.4; filter: blur(1.5px);\n    background: radial-gradient(ellipse 35% 45% at 30% 60%, $c 60%, transparent 62%),\n      radial-gradient(ellipse 30% 55% at 55% 45%, $c 60%, transparent 62%),\n      radial-gradient(ellipse 28% 40% at 75% 62%, $c 60%, transparent 62%);","water-ripple":"\n    top: calc(25% + var(--mc-anim-phase) * 50%); width: 60cqmin; aspect-ratio: 2.2; margin: -13.6cqmin 0 0 -30cqmin;\n    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;\n    box-shadow: 0 0 0 3px color-mix(in srgb, $c 25%, transparent);",fireworks:"\n    left: 50%; top: 45%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 6px 1px $c; animation-delay: var(--mc-fx-delay, 0s);","fireworks|:nth-child(even)":"background: color-mix(in srgb, $c 50%, #ffeb3b); box-shadow: 0 0 6px 1px color-mix(in srgb, $c 50%, #ffeb3b);","tap-ripple":"\n    left: var(--mc-tap-x, 50%); top: var(--mc-tap-y, 50%); width: 290cqmax; aspect-ratio: 1; margin: -145cqmax 0 0 -145cqmax;\n    border-radius: 50%; background: radial-gradient(circle, $c 0, color-mix(in srgb, $c 55%, transparent) 40%, transparent 70%);"};i.d(e,["D",0,o,"H",0,n])},5514(t,e,i){const n={breathe:"\n    0%, 100% { scale: 1; opacity: 1; }\n    50% { scale: calc(1 + $i / 100); opacity: 0.78; }","glow-pulse":"\n    0%, 100% { box-shadow: 0 0 0 0 transparent; }\n    50% { box-shadow: 0 0 calc($i * 1px) calc($i * 0.19px) $c; }","glow-pulse-icon":"\n    0%, 100% { filter: drop-shadow(0 0 0 transparent); }\n    50% { filter: drop-shadow(0 0 calc($i * 0.375px) $c); }","halo-ripple":"\n    0% { box-shadow: 0 0 0 0 $c; }\n    100% { box-shadow: 0 0 0 calc($i * 1px) transparent; }","halo-ripple-icon":"\n    0% { filter: drop-shadow(0 0 0 $c); }\n    100% { filter: drop-shadow(0 0 calc($i * 0.7px) transparent); }",aura:"\n    0%, 100% {\n      box-shadow: 0 0 calc($i * 0.42px) calc($i * 0.04px) color-mix(in srgb, $c 60%, transparent),\n        inset 0 0 calc($i * 0.42px) color-mix(in srgb, $c 24%, transparent);\n    }\n    50% {\n      box-shadow: 0 0 calc($i * 1px) calc($i * 0.25px) $c,\n        inset 0 0 calc($i * 0.75px) color-mix(in srgb, $c 48%, transparent);\n    }","aura-icon":"\n    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.125px) color-mix(in srgb, $c 50%, transparent)); }\n    50% { filter: drop-shadow(0 0 calc($i * 0.42px) $c); }",heartbeat:"\n    0%, 70%, 100% { scale: 1; }\n    14% { scale: calc(1 + $i / 100); }\n    28% { scale: 1; }\n    42% { scale: calc(1 + $i / 150); }",spin:"\n    from { rotate: 0deg; }\n    to { rotate: calc($i * 1deg); }","fast-spin":"\n    from { rotate: 0deg; }\n    to { rotate: calc($i * 1deg); }",sway:"\n    0%, 100% { rotate: calc($i * -1deg); }\n    50% { rotate: calc($i * 1deg); }",wobble:"\n    0%, 100% { translate: 0 0; rotate: 0deg; }\n    15% { translate: calc($i * -1px) 0; rotate: calc($i * -0.66deg); }\n    30% { translate: calc($i * 0.83px) 0; rotate: calc($i * 0.5deg); }\n    45% { translate: calc($i * -0.66px) 0; rotate: calc($i * -0.33deg); }\n    60% { translate: calc($i * 0.33px) 0; rotate: calc($i * 0.17deg); }\n    75% { translate: calc($i * -0.17px) 0; rotate: calc($i * -0.08deg); }","shake-alert":"\n    0%, 50%, 100% { translate: 0 0; }\n    5%, 15%, 25%, 35%, 45% { translate: calc($i * -1px) 0; }\n    10%, 20%, 30%, 40% { translate: calc($i * 1px) 0; }",rumble:"\n    0%, 100% { translate: 0 0; }\n    25% { translate: calc($i * 1px) calc($i * -1px); }\n    50% { translate: calc($i * -1px) calc($i * 1px); }\n    75% { translate: calc($i * 1px) calc($i * 1px); }",float:"\n    0%, 100% { translate: 0 0; }\n    50% { translate: 0 calc($i * -1px); }","flame-flicker":"\n    0%, 100% { scale: 1 1; rotate: 0deg; filter: drop-shadow(0 0 2px $c) brightness(1); }\n    25% { scale: calc(1 - $i * 0.004) calc(1 + $i / 100); rotate: calc($i * 0.3deg); filter: drop-shadow(0 -1px 6px $c) brightness(1.15); }\n    50% { scale: calc(1 + $i * 0.004) calc(1 - $i * 0.006); rotate: calc($i * -0.2deg); filter: drop-shadow(0 0 3px $c) brightness(0.95); }\n    75% { scale: calc(1 - $i * 0.002) calc(1 + $i * 0.008); rotate: calc($i * -0.4deg); filter: drop-shadow(0 -1px 5px $c) brightness(1.1); }","steam-rise":"\n    0% { translate: 0 0; scale: 0.5; opacity: 0; }\n    25% { opacity: 1; }\n    100% { translate: 0 -100cqh; scale: 1.7; opacity: 0; }",bubbles:"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    50% { translate: 4px -55cqh; }\n    90% { opacity: 0.8; }\n    100% { translate: -3px calc(-100cqh - 12px); opacity: 0; }","snow-fall":"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    50% { translate: 6px 50cqh; }\n    100% { translate: -2px calc(100cqh + 12px); opacity: 0.7; }","rain-fall":"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    100% { translate: 0 calc(100cqh + 24px); opacity: 0.6; }","liquid-wave":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","storm-flash":"\n    0%, 88%, 100% { opacity: 0; }\n    90% { opacity: calc($i / 100); }\n    91.5% { opacity: 0.1; }\n    93.5% { opacity: calc($i / 125); }\n    96% { opacity: 0; }","shine-sweep":"\n    0% { translate: -100% 0; }\n    60%, 100% { translate: 100cqw 0; }",blink:"\n    0%, 45%, 100% { opacity: 1; }\n    50%, 95% { opacity: calc(1 - $i / 100); }","neon-flicker":"\n    0%, 17%, 23%, 26%, 52%, 58%, 100% { opacity: 1; filter: drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1); }\n    20%, 25%, 55% { opacity: 0.45; filter: drop-shadow(0 0 0 transparent) brightness(0.8); }\n    24% { opacity: 0.8; filter: drop-shadow(0 0 calc($i * 0.4px) $c) brightness(1); }","rainbow-hue":"\n    from { filter: hue-rotate(0deg); }\n    to { filter: hue-rotate(calc($i * 1deg)); }",glitch:"\n    0%, 86%, 100% { translate: 0 0; filter: none; }\n    88% { translate: calc($i * -1px) 0; filter: drop-shadow(calc($i * 0.7px) 0 0 $c) drop-shadow(calc($i * -0.7px) 0 0 color-mix(in srgb, $c 35%, #00e5ff)); }\n    90% { translate: calc($i * 1px) calc($i * 0.3px); filter: drop-shadow(calc($i * -0.7px) 0 0 $c) hue-rotate(40deg); }\n    92% { translate: calc($i * -0.5px) 0; filter: drop-shadow(calc($i * 0.4px) 0 0 color-mix(in srgb, $c 35%, #ff1744)); }\n    94% { translate: 0 0; filter: none; }","fade-pulse":"\n    0%, 100% { opacity: 1; }\n    50% { opacity: calc(1 - $i / 100); }",bounce:"\n    0%, 20%, 53%, 100% { translate: 0 0; scale: 1 1; }\n    40%, 43% { translate: 0 calc($i * -1px); scale: 0.96 1.06; }\n    70% { translate: 0 calc($i * -0.5px); scale: 0.98 1.03; }\n    80% { translate: 0 0; scale: 1.04 0.96; }\n    90% { translate: 0 calc($i * -0.12px); scale: 1 1; }",jello:"\n    0%, 10%, 60%, 100% { scale: 1 1; }\n    18% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }\n    26% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }\n    34% { scale: calc(1 + $i / 200) calc(1 - $i / 200); }\n    42% { scale: calc(1 - $i / 400) calc(1 + $i / 400); }\n    50% { scale: calc(1 + $i / 800) calc(1 - $i / 800); }","rubber-band":"\n    0%, 55%, 100% { scale: 1 1; }\n    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }\n    20% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }\n    25% { scale: calc(1 + $i / 160) calc(1 - $i / 160); }\n    33% { scale: calc(1 - $i / 500) calc(1 + $i / 500); }\n    42% { scale: calc(1 + $i / 500) calc(1 - $i / 500); }",tada:"\n    0%, 50%, 100% { scale: 1; rotate: 0deg; }\n    5%, 10% { scale: 0.9; rotate: calc($i * -1deg); }\n    15%, 25%, 35%, 45% { scale: 1.1; rotate: calc($i * 1deg); }\n    20%, 30%, 40% { scale: 1.1; rotate: calc($i * -1deg); }",swing:"\n    0%, 60%, 100% { rotate: 0deg; }\n    12% { rotate: calc($i * 1deg); }\n    24% { rotate: calc($i * -0.66deg); }\n    36% { rotate: calc($i * 0.33deg); }\n    48% { rotate: calc($i * -0.2deg); }",flip:"\n    0%, 10% { rotate: y 0deg; }\n    60%, 100% { rotate: y calc($i * 1deg); }",pop:"\n    0%, 40%, 100% { scale: 1; }\n    10% { scale: calc(1 + $i / 100); }\n    20% { scale: calc(1 - $i / 400); }\n    30% { scale: calc(1 + $i / 600); }","head-shake":"\n    0%, 50%, 100% { translate: 0 0; rotate: 0deg; }\n    6.5% { translate: calc($i * -1px) 0; rotate: calc($i * -1deg); }\n    18.5% { translate: calc($i * 0.8px) 0; rotate: calc($i * 0.8deg); }\n    31.5% { translate: calc($i * -0.5px) 0; rotate: calc($i * -0.5deg); }\n    43.5% { translate: calc($i * 0.3px) 0; rotate: calc($i * 0.3deg); }"},o={"steam-rise":"\n    bottom: -12px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%;\n    background: $c; filter: blur(5px);",bubbles:"\n    bottom: -10px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%;\n    border: 1.5px solid $c;\n    background: color-mix(in srgb, $c 22%, transparent);","bubbles|:nth-child(even)":"width: 5px; height: 5px;","snow-fall":"\n    top: -8px; width: 5px; height: 5px; border-radius: 50%;\n    background: $c;","rain-fall":"\n    top: -18px; width: 2px; height: 14px; border-radius: 1px;\n    background: linear-gradient(transparent, $c);","liquid-wave":"\n    left: -50%; top: calc(100% - $i * 1%); width: 200%; aspect-ratio: 1; border-radius: 42%;\n    background: color-mix(in srgb, $c 50%, transparent); opacity: 1;","liquid-wave|:nth-child(2)":"\n    top: calc(100% - $i * 0.9%); border-radius: 38%;\n    background: $c; animation-direction: reverse;","storm-flash":"inset: 0; background: color-mix(in srgb, $c 35%, rgba(255, 255, 255, 0.55));","shine-sweep":"\n    top: 0; bottom: 0; left: 0; width: 45%; opacity: 1;\n    background: linear-gradient(100deg, transparent 0%,\n      color-mix(in srgb, var(--mca-shine-sweep-c, #fff) calc($i * 1%), transparent) 50%, transparent 100%);"};i.d(e,["S",0,n,"_",0,o])},6370(t,e,i){const n="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",o={ping:"\n    0% { scale: 0.15; opacity: 1; }\n    80%, 100% { scale: 1; opacity: 0; }","ripple-rings":"\n    0% { scale: 0.1; opacity: 1; }\n    100% { scale: 1; opacity: 0; }","radar-sweep":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","conic-border-spin":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","breathing-border":"\n    0%, 100% { box-shadow: inset 0 0 0 calc($i * 1px) color-mix(in srgb, $c 30%, transparent), 0 0 0 0 transparent; }\n    50% { box-shadow: inset 0 0 0 calc($i * 1px) $c, 0 0 calc($i * 4px) color-mix(in srgb, $c 35%, transparent); }","breathing-border-icon":"\n    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.5px) color-mix(in srgb, $c 40%, transparent)); }\n    50% { filter: drop-shadow(0 0 calc($i * 1.5px) $c); }",fireflies:"\n    0% { translate: 0 0; opacity: 0; }\n    20% { opacity: 1; }\n    40% { translate: 10px -8px; }\n    60% { opacity: 0.3; }\n    75% { translate: -6px -14px; opacity: 1; }\n    100% { translate: 4px -22px; opacity: 0; }",confetti:"\n    0% { translate: 0 0; rotate: 0deg; opacity: 1; }\n    25% { translate: 8px 25cqh; rotate: 160deg; }\n    50% { translate: -6px 50cqh; rotate: 300deg; }\n    75% { translate: 6px 75cqh; rotate: 420deg; }\n    100% { translate: 0 calc(100cqh + 14px); rotate: 540deg; opacity: 1; }","falling-leaves":"\n    0% { translate: 0 0; rotate: 0deg; opacity: 0; }\n    10% { opacity: 1; }\n    30% { translate: 14px 30cqh; rotate: 60deg; }\n    55% { translate: -8px 55cqh; rotate: -20deg; }\n    80% { translate: 12px 80cqh; rotate: 80deg; }\n    100% { translate: 0 calc(100cqh + 16px); rotate: 20deg; opacity: 0.8; }",lightning:"\n    0%, 89%, 100% { opacity: 0; }\n    90% { opacity: calc($i / 100); }\n    91.5% { opacity: 0.15; }\n    93% { opacity: calc($i / 100); }\n    96% { opacity: 0; }","ocean-waves":"\n    from { translate: 0 0; }\n    to { translate: -40px 0; }","sun-rays":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","heat-shimmer":"\n    0%, 100% { translate: 0 0; filter: blur(0); }\n    25% { translate: calc($i * 0.5px) calc($i * -0.5px); filter: blur(calc($i * 0.3px)); }\n    50% { translate: calc($i * -0.5px) 0; filter: blur(0); }\n    75% { translate: 0 calc($i * 0.5px); filter: blur(calc($i * 0.2px)); }","wind-lines":"\n    0% { translate: 0 0; opacity: 0; }\n    15% { opacity: 1; }\n    85% { opacity: 0.8; }\n    100% { translate: calc(100cqw + 100%) 0; opacity: 0; }",drip:"\n    0% { translate: 0 0; scale: 0.4 0.2; opacity: 0; }\n    15% { scale: 1 1; opacity: 1; }\n    35% { translate: 0 2px; scale: 0.9 1.25; }\n    45% { translate: 0 4px; scale: 1 1; }\n    100% { translate: 0 calc(100cqh + 12px); scale: 0.9 1.3; opacity: 0.7; }","equalizer-bars":"\n    0% { scale: 1 0.15; }\n    30% { scale: 1 0.8; }\n    60% { scale: 1 0.35; }\n    100% { scale: 1 1; }","charging-stripes":"\n    from { translate: 0 0; }\n    to { translate: 28.2843px 0; }","orbit-dots":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","typing-dots":"\n    0%, 60%, 100% { translate: 0 0; opacity: 0.35; }\n    30% { translate: 0 calc($i * -1px); opacity: 1; }"},r={ping:"\n    left: 50%; top: 50%; width: calc($i * 1cqmin); aspect-ratio: 1; translate: -50% -50%;\n    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;","ripple-rings":`\n    left: 50%; top: 50%; width: 110cqmin; aspect-ratio: 1; translate: -50% -50%;\n    border: 1.5px solid $c; border-radius: 50%; box-sizing: border-box; ${n}`,"radar-sweep":"\n    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; opacity: 1;\n    background: conic-gradient(from 0deg, transparent 0deg calc(360deg - $i * 1deg),\n      $c 360deg);","conic-border-spin":"\n    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;\n    background: conic-gradient(from 0deg, transparent 0% 55%, $c 80%, transparent 100%);",fireflies:"\n    top: calc(12% + var(--mc-anim-phase) * 72%); width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 6px 2px $c;",confetti:"top: -10px; width: 6px; height: 10px; border-radius: 1px; background: $c;","confetti|:nth-child(3n + 2)":"background: color-mix(in srgb, $c 40%, #ffeb3b);","confetti|:nth-child(3n)":"width: 8px; height: 6px; background: color-mix(in srgb, $c 40%, #e91e63);","falling-leaves":"\n    top: -14px; width: 10px; height: 10px; border-radius: 0 80% 0 80%;\n    background: $c;","falling-leaves|:nth-child(even)":"background: color-mix(in srgb, $c 75%, #7cb342);",lightning:"\n    left: 50%; top: 0; width: 32cqmin; height: 100%; translate: -50% 0;\n    background: color-mix(in srgb, $c 40%, #fff);\n    clip-path: polygon(58% 0, 22% 56%, 46% 56%, 32% 100%, 80% 40%, 56% 40%, 72% 0);","ocean-waves":"\n    left: 0; bottom: 0; width: calc(100% + 40px); height: calc($i * 1%); opacity: 1;\n    background: radial-gradient(22px 12px at 20px 0, transparent 98%, color-mix(in srgb, $c 45%, transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"\n    height: calc($i * 0.75%); animation-direction: reverse; animation-duration: calc(var(--mc-fx-dur) * 1.5);\n    background: radial-gradient(22px 10px at 20px 0, transparent 98%, color-mix(in srgb, $c 70%, transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"\n    height: calc($i * 0.5%); animation-duration: calc(var(--mc-fx-dur) * 0.7);\n    background: radial-gradient(22px 8px at 20px 0, transparent 98%, $c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"\n    left: 50%; top: 50%; width: 170cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;\n    background: repeating-conic-gradient(from 0deg, $c 0deg calc($i * 1deg),\n      transparent calc($i * 1deg) calc($i * 3deg));\n    mask: radial-gradient(closest-side, #000 15%, transparent 70%);","wind-lines":"\n    left: -35%; top: calc(10% + var(--mc-anim-phase) * 80%); width: 35%; height: 2px; border-radius: 2px;\n    background: linear-gradient(90deg, transparent, $c);",drip:"\n    top: -4px; width: 6px; height: 9px; margin-left: -3px; transform-origin: 50% 0;\n    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; background: $c;","equalizer-bars":"\n    left: calc(10% + var(--mc-anim-k) * 80%); bottom: 0; width: max(3px, 5%); height: 70%; opacity: 1;\n    border-radius: 2px 2px 0 0; transform-origin: 50% 100%; background: $c;","charging-stripes":"\n    top: 0; bottom: 0; left: -28.2843px; width: calc(100% + 28.2843px); opacity: 1;\n    background: repeating-linear-gradient(-45deg, color-mix(in srgb, $c calc($i * 1%), transparent) 0 10px, transparent 10px 20px);","orbit-dots":`\n    left: 50%; top: calc(50% - 38cqmin); width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; opacity: 1;\n    background: $c; transform-origin: 3px calc(3px + 38cqmin); ${n}`,"typing-dots":"\n    left: calc(50% - 12px + var(--mc-anim-k) * 36px); top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px;\n    border-radius: 50%; background: $c;\n    animation-delay: calc(var(--mc-fx-delay, 0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur, 1s) * 0.5);"},s={"conic-border-spin":"\n    padding: calc($i * 1px); box-sizing: border-box;\n    background: color-mix(in srgb, $c 18%, transparent);\n    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n    -webkit-mask-composite: xor;\n    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);"};i.d(e,["I3",0,s,"Tb",0,o,"bh",0,r])},8904(t,e,i){const n=i(6161).AH`
  :host {
    --mc-primary: var(--primary-color, #6366f1);
    --mc-bg: var(--card-background-color, #ffffff);
    --mc-text: var(--primary-text-color, #1a1a2e);
    --mc-text-secondary: var(--secondary-text-color, #6b7280);
    --mc-border: var(--divider-color, #e5e7eb);
    --mc-surface-recessed: color-mix(in srgb, var(--primary-text-color, #1a1a2e) 5%, transparent);
    --mc-primary-light: color-mix(in srgb, var(--mc-primary) 15%, transparent);
    --mc-gap: 10px;
    --mc-gap-xs: 4px;
    --mc-gap-sm: 8px;
    --mc-gap-md: 14px;
    --mc-padding: 16px;
    --mc-radius: 12px;
    --mc-radius-sm: 4px;
    --mc-radius-md: 8px;
    --mc-radius-lg: 12px;
    --mc-font-size-xs: 0.75rem;
    --mc-font-size-sm: 0.875rem;
    --mc-font-size-md: 1rem;
    --mc-font-size-lg: 1.125rem;
    --mc-font-size-xl: 1.25rem;
    --mc-font-size-2xl: 1.5rem;
    --mc-transition-duration: 0.2s;
    --mc-icon-size-sm: 18px;
    --mc-icon-size-md: 24px;
    --mc-icon-size-lg: 32px;
    --mc-icon-size-xl: 36px;
    --mc-button-padding: 10px 16px;
    --mc-button-padding-icon: 8px;
    --mc-button-radius: var(--mc-radius-md);
    --mc-button-color: var(--primary-color, #03a9f4);
    --mc-button-text-color: var(--text-primary-color, #fff);
    --mc-button-font-size: var(--mc-font-size-md);
    --mc-button-icon-size: 20px;
    --mc-slider-vertical-height: 120px;
    --mc-slider-radius: var(--mc-radius-lg);
    --mc-light-color-temp: #ff9800;
    --mc-light-label-opacity: 0.7;
    --mc-light-color-input-size: 32px;
    --mc-spinbox-gap: var(--mc-gap-md);
    --mc-spinbox-btn-size: 32px;
    --mc-spinbox-btn-color: var(--primary-color, #03a9f4);
    --mc-spinbox-btn-text-color: var(--text-primary-color, #fff);
    --mc-spinbox-btn-font-size: 18px;
    --mc-spinbox-value-font-size: 20px;
    --mc-spinbox-value-font-weight: 600;
    --mc-spinbox-value-min-width: 40px;
    --mc-bar-height: 8px;
    --mc-bar-radius: var(--mc-radius-sm);
    --mc-bar-transition: 0.3s ease;
    --mc-dropdown-padding: 10px 14px;
    --mc-dropdown-radius: var(--mc-radius-md);
    --mc-dropdown-font-size: var(--mc-font-size-md);
    --mc-forecast-icon-size: 20px;
    --mc-modal-radius: 12px;
    --mc-modal-input-radius: 6px;
    --mc-modal-overlay-bg: rgba(0, 0, 0, 0.5);
    --mc-modal-z-index: 10000;
    --mc-modal-width: 420px;
    --mc-modal-max-height: 80vh;
    --mc-modal-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    --mc-modal-header-bg: var(--mc-bg);
    --mc-modal-item-gap: 14px;
    --mc-modal-item-padding: 14px 16px;
    --mc-modal-item-hover-bg: color-mix(in srgb, var(--mc-primary) 8%, transparent);
    --mc-modal-item-border: 1px solid var(--mc-border);
    --mc-modal-item-icon-size: 40px;
    --mc-modal-item-icon-bg: color-mix(in srgb, var(--mc-primary) 12%, transparent);
    --mc-modal-item-icon-radius: 50%;
    --mc-modal-list-max-height: 400px;
    --mc-modal-btn-bg: var(--mc-primary);
    --mc-modal-btn-color: var(--text-primary-color, #fff);
    --mc-modal-btn-radius: 6px;
    --mc-modal-save-bg: var(--success-color, #4caf50);
    --mc-modal-save-color: var(--text-primary-color, #fff);
    --mc-modal-cancel-bg: var(--error-color, #f44336);
    --mc-modal-cancel-color: var(--text-primary-color, #fff);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;i.d(e,["A",0,n])},4753(t,e,i){var n=i(2016);const o=["en-GB","en-US","nl"];let r,s=0;const a={},c=t=>a[t]||=(console.debug("[i18n] "+t),1),l=t=>(0,n.ZV)(r,t),d=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,u=/\{((?:[^{}]|\{[^{}]*\})*)\}/,h=(t,e,i)=>t.split(d).flatMap((t,n)=>{if(!(1&n))return void 0===i?t:t.replace(/#/g,l(i));const r=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(t);if(!r)throw 0;const a=e[r[1]];if(void 0===a&&c("missing "+r[1]),!r[2])return"object"==typeof a?[a]:void 0===a?"":"number"==typeof a?l(a):a;const d=r[3].split(u),m="plural"==r[2],p=t=>d[d.findIndex((e,i)=>!(1&i)&&e.trim()==t)+1||-1],f=p("="+a)??p(m?new Intl.PluralRules(o[s]).select(+a):String(a))??p("other");if(void 0===f)throw 0;return h(f,e,m?+a:void 0)}).filter(String),m=(t,e)=>{const i=[],n=t=>i[t]||=e()[t].split("|");let r;const a=(i,o="",a=s)=>{if(!e())return c("not ready "+t),"";const l="number"==typeof i?i:(r||=new Map(n(0).map((t,e)=>[t,e]))).get(o?o+""+i:i)??-1;return l<0?(c("unknown "+i),String(i)):a&&n(a)[l]||(n(0)[l]??"").slice(o?o.length+1:0)},l=(t,e={},i)=>{try{return h(a(t,i),e)}catch{return c("malformed "+t),[a(t,i,0)]}};return{ns:t,locale:()=>o[s],t:(t,e)=>l(t,e).join(""),tc:(t,e,i)=>l(e,i,t).join(""),tx:(t,e)=>l(t,e),m:t=>t}};i.d(e,["Zc",0,t=>{r=t;const e=(t=>{const e=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((t||"").toLowerCase());return e?"nl"==e[1]?"nl":e[3]?"en-GB":"en-US":"en-GB"})(t?.locale?.language||t?.language||globalThis.navigator?.language);return s=o.indexOf(e),e},"_H",0,(t,e)=>{let i,n;return{...m(t,()=>i),ready:()=>n||=e().then(t=>(i=t.default,!0),()=>(n=void 0,!1))}},"my",0,(t,e)=>m(t,()=>e)])},3245(t,e,i){i.d(e,{Qt:()=>y,bb:()=>p,k8:()=>f});var n=i(3925),o=i(8983);const r=["spin","glow","flame","drum","swing","pulse","snow","shake","eq"],s={spin:1.5,glow:2.4,flame:1.2,drum:1.2,swing:1,pulse:1.5,snow:2.4,shake:1.2,eq:1.2},a="var(--error-color, #db4437)",c=new Set(["problem","smoke","gas","moisture","safety","carbon_monoxide","heat","tamper"]),l=new Set(["door","window","garage_door","opening"]),d=new Set(["run","running","washing","drying","spin","spinning","rinse","wash","dry"]),u=(t,e={})=>({anim:t,speed:s[t],intensity:1,...e}),h=t=>"number"==typeof t&&Number.isFinite(t)?t:void 0,m=t=>Math.min(1,Math.max(0,t));function p(t){if(!t||"string"!=typeof t.entity_id)return;const e=t.entity_id.split(".")[0],i=t.state,n=t.attributes||{},o="string"==typeof n.device_class?n.device_class:"";switch(e){case"fan":{if("on"!==i)return;const t=m((h(n.percentage)??100)/100);return u("spin",{speed:.6+2.4*(1-t)})}case"light":{if("on"!==i)return;const t=n.rgb_color,e=Array.isArray(t)&&t.length>=3&&t.slice(0,3).every(t=>void 0!==h(t))?`rgb(${t[0]}, ${t[1]}, ${t[2]})`:void 0,o=h(n.brightness);return u("glow",{intensity:void 0===o?1:.25+.75*m(o/255),...e?{color:e}:{}})}case"climate":return"heating"===n.hvac_action||"preheating"===n.hvac_action?u("flame"):"cooling"===n.hvac_action?u("snow"):"fan"===n.hvac_action?u("spin",{speed:1.5}):void 0;case"vacuum":return"cleaning"===i?u("drum",{speed:1.2}):void 0;case"sensor":return d.has(i)?u("drum",{speed:1.2}):void 0;case"binary_sensor":if("on"!==i)return;return"running"===o?u("drum",{speed:1.2}):l.has(o)?u("swing",{speed:0,intensity:.3}):c.has(o)?u("pulse",{color:a}):void 0;case"cover":return"opening"===i||"closing"===i?u("swing",{speed:1}):"open"===i?u("swing",{speed:0,intensity:.3}):void 0;case"lock":return"jammed"===i?u("shake"):"locking"===i||"unlocking"===i||"opening"===i?u("pulse"):void 0;case"media_player":return"playing"===i?u("eq"):void 0;case"alarm_control_panel":return"triggered"===i?u("pulse",{color:a}):void 0;case"siren":return"on"===i?u("pulse",{color:a}):void 0;default:return}}function f(t,e=t?.entity_id??""){const i=e.split(".")[0],n=String(t?.attributes?.device_class??"");switch(i){case"fan":return 415;case"light":return 211;case"climate":return 183;case"vacuum":return 154;case"sensor":return 156;case"binary_sensor":return"running"===n?155:l.has(n)?440:c.has(n)?339:void 0;case"cover":return 439;case"lock":return 387;case"media_player":return 170;case"alarm_control_panel":return 340;case"siren":return 339;default:return}}const g=new Set(["alarm_control_panel","automation","binary_sensor","camera","climate","cover","fan","humidifier","input_boolean","lawn_mower","light","lock","media_player","remote","script","siren","switch","timer","vacuum","valve","water_heater"]);function y(t,e){if("auto"===t)return p(e);if(!r.includes(t))return;if(function(t){if(!t||"string"!=typeof t.entity_id)return!1;if((0,o.Pd)(t))return!0;const e=t.entity_id.split(".")[0];return!!g.has(e)&&(!("climate"!==e||!["idle","off"].includes(String(t.attributes?.hvac_action)))||"media_player"===e&&"paused"===t.state||!(0,n.mu)(t))}(e))return;const i=t,s=p(e);return s?.anim===i?{...s,speed:s.speed>0?s.speed:1.5}:{anim:i,speed:1.5,intensity:1}}},4727(t,e,i){i.d(e,{EN:()=>b,Qh:()=>_,dU:()=>g,uM:()=>f});var n=i(9424),o=i(3925),r=i(8983),s=i(3245);const a={min:0,max:100,emptyOpacity:.25,angle:90,drawDuration:1.2,secondaryPct:40,stops:["#2196f3","#f44336"]},c=["up","down","left","right"],l=["solid","duotone","gradient","value"],d=["off","load","change","loop"],u=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},h=(t,e,i)=>Math.min(i,Math.max(e,t)),m=(t,e,i)=>e.includes(t)?t:i,p=(t,e)=>e>=100?t:`color-mix(in srgb, ${t} ${h(e,0,100)}%, transparent)`;function f(t){if("string"==typeof t&&/^\s*\d*\.?\d+\s*%\s*$/.test(t))return h(parseFloat(t)/100,0,1);const e=u(t);return void 0!==e?h(e>1?e/100:e,0,1):void 0}function g(t,e){const i=(0,o.qB)(t);return i?p((0,o.id)(e)??`var(${o.MZ}, currentColor)`,i.opacity):(0,n.f8)(t)}function y(t){const e=t.trim();let i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e);if(i){const t=3===i[1].length?[...i[1]].map(t=>t+t).join(""):i[1];return{r:parseInt(t.slice(0,2),16),g:parseInt(t.slice(2,4),16),b:parseInt(t.slice(4,6),16)}}return i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(e),i?{r:+i[1],g:+i[2],b:+i[3]}:void 0}const v=t=>`rgb(${Math.round(t.r)}, ${Math.round(t.g)}, ${Math.round(t.b)})`;function b(t,e,i,n){if((0,r.Pd)(t,e))return;const o=(0,r.f4)(t,e),s=u(i)??a.min,c=u(n)??a.max;return void 0!==o&&c!==s?h((o-s)/(c-s),0,1):void 0}function _(t,e){const i=t&&"object"==typeof t?t:{},n=e.entity?e.hass?.states?.[e.entity]:void 0,o=i.colors&&"object"==typeof i.colors?i.colors:{},r=m(o.style,l,"solid"),_=g(o.primary,n)??e.baseColor,x=i.fill||"value"===r?function(t,e){const i=t.fill&&"object"==typeof t.fill?t.fill:{},n=i.entity||e.entity;return b(n?e.hass?.states?.[n]:void 0,i.attribute||void 0,i.min,i.max)}(i,e):void 0,$={style:r,primary:_,angle:u(o.angle)??a.angle},k="string"==typeof o.secondary&&/%\s*$/.test(o.secondary)?f(o.secondary):void 0,M=void 0!==k?p(_,Math.round(100*k)):g(o.secondary,n);if("duotone"===r?$.secondary=M??p(_,a.secondaryPct):M&&($.secondary=M),"gradient"===r||"value"===r){const t=(Array.isArray(o.gradient)?o.gradient:[]).map(t=>g(t,n)).filter(t=>!!t);$.stops=t.length>=2?t:1===t.length?[t[0],t[0]]:[...a.stops],"value"===r&&($.valueColor=void 0===x?$.stops[0]:function(t,e){if(!t.length)return"currentColor";const i=h(Number.isFinite(e)?e:0,0,1)*(t.length-1),n=Math.min(Math.floor(i),t.length-2);if(1===t.length||n<0)return y(t[0])?v(y(t[0])):t[0];const o=i-n,r=y(t[n]),s=y(t[n+1]);return r&&s?v({r:r.r+(s.r-r.r)*o,g:r.g+(s.g-r.g)*o,b:r.b+(s.b-r.b)*o}):o<.5?t[n]:t[n+1]}($.stops,x),void 0===x&&($.valueMissing=!0))}const S={colors:$,draw:m(i.draw,d,"off"),drawDuration:w(i.draw_duration)??a.drawDuration,morph:!0===i.morph},A=(0,s.Qt)(i.device,n);if(A&&(S.device=A),i.fill&&"object"==typeof i.fill){const t=i.fill,e=f(t.empty_color),o=void 0===e?g(t.empty_color,n):void 0;S.fill={level:x,color:g(t.color,n)??$.valueColor??_,emptyOpacity:o?1:e??a.emptyOpacity,...o?{emptyColor:o}:{},wave:!1!==t.wave,direction:m(t.direction,c,"up")}}return S}function w(t){const e=(0,n.TD)(t);if(!e)return;const i=e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);return i>0?i:void 0}i.d(e,["_T",0,a])},3612(t,e,i){i.d(e,{PO:()=>v,Qk:()=>k,WZ:()=>j,ZE:()=>b,ZQ:()=>S,oM:()=>_,wV:()=>M});var n=i(5171);const o="0 0 24 24",r=new Map,s=new Map,a=new Map,c=new Set;let l,d,u=0;const h=new Set;let m=!1;const p=t=>t.includes(":")?t.slice(0,t.indexOf(":")):"",f=new Set(["mdi","hass","hassio","hademo"]);function g(t){const e="undefined"==typeof window?{}:window,i=e.customIconsets?.[t];if("function"==typeof i)return i;const n=e.customIcons?.[t];return n&&"function"==typeof n.getIcon?t=>n.getIcon(t):void 0}function y(t,e){for(r.delete(t),r.set(t,{g:e,at:Date.now()});r.size>200;)r.delete(r.keys().next().value);e&&(c.delete(t),a.get(t)?.forEach(t=>{try{t()}catch{}}))}function v(t){const e=r.get(t);if(e?.g)return r.delete(t),r.set(t,e),e.g}function b(t,e){let i=a.get(t);return i||a.set(t,i=new Set),i.add(e),()=>{i.delete(e),i.size||a.delete(t)}}function _(t,e){y(t,e)}const w=new Map;function x(t){let e=2166136261;for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return(e>>>0).toString(36)+t.length.toString(36)}let $=x;function k(t,e){e&&w.delete(e);const i=e??`svg:${$(t)}`;let o=i;for(let e=1;w.has(o)&&w.get(o).text!==t;e++)o=`${i}.${e}`;const s=function(t){const e=w.get(t);return e&&(w.delete(t),w.set(t,e)),e}(o);if(s)return s.geometry&&!r.get(o)?.g&&y(o,s.geometry),o;const a=function(t){try{return(0,n.OW)(t)}catch{return{markup:"",viewBox:"0 0 24 24",paths:[],accentPaths:[],strokes:[],error:n.kk}}}(t),c={text:t};if(a.error)c.error=a.error;else{const t={paths:a.paths,viewBox:a.viewBox};a.accentPaths.length&&(t.secondary=a.accentPaths),a.strokes.length&&(t.strokes=a.strokes),a.evenodd&&(t.evenodd=a.evenodd),c.markup=a.markup,c.geometry=t}for(w.set(o,c);w.size>50;){const t=w.keys().next().value;w.delete(t),r.delete(t)}return c.geometry&&y(o,c.geometry),o}function M(t){return w.get(t)?.markup}function S(t){return w.get(t)?.error}async function A(t){const e=g(p(t));if(!e)return;let i;try{i=await e((t=>t.slice(t.indexOf(":")+1))(t))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){k(i.mc_svg,t);const e=v(t);if(e)return e}const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const r={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():o},s="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return s&&!s.startsWith("<")&&(r.secondary=[s]),r}function C(t,e){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",t);let r,s=!1;const a=setInterval(()=>{p(),u()},50),c=setTimeout(()=>l(void 0),e),l=t=>{s||(s=!0,h.delete(m),r?.disconnect(),clearInterval(a),clearTimeout(c),n.remove(),d&&!d.childElementCount&&(d.remove(),d=void 0),i(t))},u=()=>{if(s)return;const t=n.shadowRoot?.querySelector("ha-svg-icon"),e="string"==typeof t?.path?t.path.trim():"";if(!t||!e)return;const i={paths:[e],viewBox:"string"==typeof t.viewBox&&t.viewBox.trim()?t.viewBox.trim():o},r="string"==typeof t.secondaryPath?t.secondaryPath.trim():"";r&&(i.secondary=[r]),l(i)},m=()=>l(void 0);function p(){!r&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(r=new MutationObserver(u),r.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}h.add(m),(d?.isConnected||(d=document.createElement("div"),d.setAttribute("aria-hidden","true"),d.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(d)),d).appendChild(n),p();const f=n;f.updateComplete?.then(()=>{p(),u()},()=>{}),u()})}function z(){for(const t of[...c]){if(!g(p(t))||s.has(t))continue;c.delete(t);const e=A(t).then(e=>(s.delete(t),y(t,e&&"markup"!==e?e:null),e&&"markup"!==e?e:void 0));s.set(t,e)}}function q(t){const e=t.detail;if("icons"===e?.kind)for(const t of e.ids?.length?e.ids.map(t=>`mcu:${t}`):[...r.keys(),...a.keys()].filter(t=>t.startsWith("mcu:")))r.delete(t),w.delete(t),a.get(t)?.forEach(t=>t())}function j(t,e={}){if(!t||!t.includes(":"))return Promise.resolve(void 0);if(t.startsWith("svg:"))return Promise.resolve(v(t));m||"undefined"==typeof window||(m=!0,window.addEventListener("iconset-registered",z),window.addEventListener("mcu-library-changed",q));const i=r.get(t);if(i){if(i.g)return Promise.resolve(v(t));const e=Date.now()-i.at>6e4,n=c.has(t)&&!!g(p(t));if(!e&&!n)return Promise.resolve(void 0);n&&c.delete(t),r.delete(t)}if(t.startsWith("svg:"))return Promise.resolve(void 0);const n=s.get(t);if(n)return n;const o=(async()=>{const i=!!g(p(t)),n=await A(t);if("markup"===n)return void y(t,null);if(n)return y(t,n),n;const o=p(t);if(!f.has(o))return y(t,null),void(i||(c.add(t),function(){if(u=10,l||!c.size)return;const t=()=>{l=void 0,z(),c.size&&--u>0&&(l=setTimeout(t,500))};l=setTimeout(t,500)}()));const r=e.timeoutMs??3e3,s=function(t,e){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?C(t,e):new Promise(i=>{const n=Date.now();let o=!1;const r=()=>!o&&(o=!0,h.delete(s),clearTimeout(a),!0),s=()=>{r()&&i(void 0)},a=setTimeout(s,e);h.add(s),customElements.whenDefined("ha-icon").then(()=>{r()&&C(t,Math.max(0,e-(Date.now()-n))).then(i)},s)}):Promise.resolve(void 0)}(t,Math.max(r,e.probeMaxMs??15e3));s.then(e=>{e&&(y(t,e),z())});const a=await new Promise(t=>{const e=setTimeout(()=>t(void 0),r);s.then(i=>{clearTimeout(e),t(i)})});if(a)return a;v(t)||y(t,null)})().finally(()=>s.delete(t));return s.set(t,o),o}},3852(t,e,i){i.d(e,{IH:()=>c,eF:()=>d,jR:()=>l});var n=i(6161),o=i(7804),r=i(7921);let s;const a=new WeakMap;function c(){return s||"undefined"==typeof IntersectionObserver||(s=new IntersectionObserver(t=>{for(const e of t)e.target.toggleAttribute("offscreen",!e.isIntersecting),a.get(e.target)?.(e.isIntersecting)})),s}function l(t,e){const i=c();return!!i&&(a.set(t,e),i.observe(t),!0)}function d(t){a.delete(t),s?.unobserve(t),t.removeAttribute("offscreen")}class u extends r.Kq{constructor(t){if(super(t),t.type!==o.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(){return n.s6}update(t){return t.element!==this._el&&(this._unwatch(),this._el=t.element,this.isConnected&&c()?.observe(this._el)),n.s6}_unwatch(){this._el&&(s?.unobserve(this._el),this._el.removeAttribute("offscreen"))}disconnected(){this._unwatch()}reconnected(){this._el&&c()?.observe(this._el)}}const h=(0,o.u$)(u);i.d(e,["Sv",0,h])},4719(t,e,i){i.d(e,{K:()=>E,s:()=>T});var n=i(6161),o=i(8477),r=i(1535),s=i(5707),a=i(6752),c=i(7804),l=i(8504);const d=(0,c.u$)(class extends c.WL{constructor(){super(...arguments),this.key=a.s6}render(t,e){return this.key=t,e}update(t,[e,i]){return e!==this.key&&((0,l.mY)(t),this.key=e),i}});var u=i(68);class h extends u.D{}h.directiveName="unsafeSVG",h.resultType=2;const m=(0,c.u$)(h);var p=i(3612);const f=n.AH`
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
`;var g=i(3852),y=i(4727),v=i(9136),b=i(1771),_=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};let w=0;const x=t=>String(+t.toFixed(3)),$=new Set(["spin","shake","pulse","drum"]),k=t=>[`--mc-icon-speed: ${x(t.speed>0?t.speed:1.5)}s`,`--mc-icon-intensity: ${x(t.intensity)}`,...t.color?[`--mc-icon-glow-color: ${t.color}`]:[]].join("; "),M=250,S=()=>"function"==typeof matchMedia&&!!matchMedia("(prefers-reduced-motion: reduce)")?.matches,A=(t,e,i,o)=>t.map(t=>n.JW`<path class=${o?.cls??n.s6} d=${t.d} pathLength=${o?.pathLength??n.s6} fill="none" stroke=${e}
    stroke-width=${x(t.width)} stroke-linecap=${t.cap??n.s6} stroke-linejoin=${t.join??n.s6} style=${i??n.s6}></path>`);function C(t){const[e,i,n,o]=t.split(/[\s,]+/).map(Number);return[e,i,n,o].every(Number.isFinite)&&n>0&&o>0?{x:e,y:i,w:n,h:o}:{x:0,y:0,w:24,h:24}}const z={up:0,right:90,down:180,left:-90},q=t=>"currentColor"===t?"var(--icon-primary-color, currentColor)":t;let j=class extends n.WF{constructor(){super(...arguments),this.decorative=!1,this._stateTimers=[],this._readsPending=!1,this._rigOn=!1,this._holding=!1,this._animates=!1,this._observed=!1,this._uid="mc-icon-"+ ++w,this._outs=[],this._inSeq=0,this._drawing=!1,this._drawSeq=0,this._loaded=!1,this._reconnected=!1}connectedCallback(){super.connectedCallback(),this._ensure(),this.hasUpdated&&(this._reconnected=!0,this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,this._watched=void 0,this._stateTimers.forEach(clearTimeout),this._stateTimers=[],this._readsPending=!1,this._observe(!1),this._stopMorph(),clearTimeout(this._drawTimer),this._drawing=!1}_observe(t){if(t===this._observed)return;const e=(0,g.IH)();e&&(this._observed=t,t?e.observe(this):(e.unobserve(this),this.removeAttribute("offscreen")))}get _byState(){return(0,o.hZ)(this.hass,this.entity,this.iconOn,this.iconOff)}get _own(){const t=this.rig?.svg??("svg"===this.icon?this.svg:void 0);if(t)return t===this._ownText&&this._ownRef&&((0,p.PO)(this._ownRef)||(0,p.ZQ)(this._ownRef))||(this._ownText=t,this._ownRef=(0,p.Qk)(t)),this._ownRef}get _rigRef(){return this.rig?this.rig.svg?this._own:this.rig.ref:void 0}get _useState(){return!(this._byState||this._own||!this.stateObj||"undefined"==typeof customElements||!customElements.get("ha-state-icon"))}get _want(){return this._rigRef??this._byState??this._own??(this._useState?this._stateRef:this.icon)}get _fb(){return(0,o.fq)(this.hass,this.entity)||this.fallback||"mdi:help"}get _ref(){const t=this._want;if(t?.startsWith("mcu:")){if((0,p.PO)(t))return t;const e=this.kept?.[t.slice(4)];if(!e)return this._fb;const i=this._copy,n=i?.text===e&&((0,p.PO)(i.ref)||(0,p.ZQ)(i.ref))?i.ref:(0,p.Qk)(e);return i?.ref===n&&i.text===e||(this._copy={text:e,ref:n}),(0,p.ZQ)(n)?this._fb:n}return t?.startsWith("svg:")&&(0,p.ZQ)(t)?this._fb:t}willUpdate(t){this._ensure(),this._readPlan=this._statePlan(t);for(const t of[this.iconOn,this.iconOff])t&&this.isConnected&&!(0,p.PO)(t)&&(0,p.WZ)(t);this._fx=(0,y.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"});const e=this._ref,i=this._rigRef,n=i?(0,p.PO)(i):void 0;this._rigOn=!(!this.rig||i&&!n),this._geom=n??(this._useState&&this._stateGeom?this._stateGeom:e&&!i?(0,p.PO)(e):void 0),this._holding=!this._geom&&this._useState&&!!this._shown&&("full"===this._readPlan||this._readsPending),this._holding?this._geom=this._shown:this._track(this._geom,this._fx,this._geom&&e?(0,p.wV)(e):void 0)}_track(t,e,i){const n=this.entity?this.hass?.states?.[this.entity]:void 0,r=n?String((0,o.CU)(this.entity.split(".")[0],n.state,n.attributes)):void 0,s=void 0!==this._lastState&&void 0!==r&&r!==this._lastState;if(void 0!==r&&(this._lastState=r),!t)return;const a=(t=>`${t.viewBox}|${t.paths.join(" ")}|${(t.secondary??[]).join(" ")}|${(t.strokes??[]).map(t=>`${t.d}@${t.width}`).join(" ")}`)(t),c=!this._shown,l=!c&&a!==this._shownKey,d=S();l&&e.morph&&!this.rig&&(d?this._stopMorph():this._morph(this._shown,this._shownMarkup,t)),d||this.rig||!(c&&"load"===e.draw&&!this._loaded||"change"===e.draw&&(l||s))||this._draw(e),c&&"load"===e.draw&&(this._loaded=!0),this._shown=t,this._shownKey=a,this._shownMarkup=i}_morph(t,e,i){const n=Date.now(),o=void 0!==this._frame,r=this._frame??t.paths.join(" ");void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0;const s=void 0!==this._inStart?Math.min(1,(n-this._inStart)/M):1;clearTimeout(this._inTimer),this._inStart=void 0;const a=!o&&!!t.strokes?.length||!!i.strokes?.length,c=t.viewBox!==i.viewBox||a?void 0:(0,b.GO)(r,i.paths.join(" "));if(!c){const i=o?{paths:[r],secondary:t.secondary,viewBox:t.viewBox}:t;return this._fadeOut(i,o?void 0:e,M,s),this._inStart=n,this._inSeq++,void(this._inTimer=setTimeout(()=>{this._inStart=void 0,this.requestUpdate()},M))}(t.secondary?.length||e)&&this._fadeOut({paths:[],secondary:t.secondary,viewBox:t.viewBox},e,400,s);const l=n;this._frame=(0,b.GW)(c,0);const d=()=>{const t=Math.min(1,(Date.now()-l)/400);t>=1?(this._raf=void 0,this._frame=void 0):(this._frame=(0,b.GW)(c,(t=>t<.5?4*t*t*t:1-(-2*t+2)**3/2)(t)),this._raf=requestAnimationFrame(d)),this.requestUpdate()};this._raf=requestAnimationFrame(d)}_fadeOut(t,e,i,n){const o=i*Math.max(0,Math.min(1,n));if(o<=0||!t.paths.length&&!t.secondary?.length&&!t.strokes?.length&&!e)return;const r={g:t,markup:e,ms:i,skip:i-o};for(r.timer=setTimeout(()=>{this._outs=this._outs.filter(t=>t!==r),this.requestUpdate()},o),this._outs=[...this._outs,r];this._outs.length>3;)clearTimeout(this._outs.shift().timer)}_stopMorph(){void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0,this._outs.forEach(t=>clearTimeout(t.timer)),this._outs=[],clearTimeout(this._inTimer),this._inStart=void 0}_draw(t){clearTimeout(this._drawTimer),this._drawing=!0,this._drawSeq++,this._drawTimer=setTimeout(()=>{this._drawing=!1,this.requestUpdate()},1e3*t.drawDuration)}_ensure(){const t=this._want;this.isConnected&&(t!==this._watched&&(this._unsub?.(),this._unsub=void 0,this._watched=t,t&&(this._unsub=(0,p.ZE)(t,()=>this.requestUpdate()))),t&&!(0,p.PO)(t)&&(0,p.WZ)(t).then(e=>{e&&this._want===t&&this.requestUpdate()}))}_statePlan(t){const e=this._reconnected;if(this._reconnected=!1,!this._useState)return;const i=this.hass?.entities?.[this.stateObj.entity_id],n=i!==this._entry;return this._entry=i,t.has("stateObj")||n||e?"full":this._stateRef||this._stateGeom?void 0:"once"}updated(t){t.has("rig")&&(t.get("rig")?.sheet?.(this.renderRoot,!1),this.rig?.sheet?.(this.renderRoot,!0)),this._observe(this._animates&&this.isConnected);const e=this._readPlan;if(this._readPlan=void 0,!e||"once"===e&&this._readsPending)return;const i="full"===e?[0,50,300,1e3]:[0];this._stateTimers.forEach(clearTimeout),this._readsPending=!0,this._stateTimers=i.map((t,e)=>setTimeout(()=>{e===i.length-1&&(this._stateTimers=[],this._readsPending=!1),this._readStateIcon(),e===i.length-1&&this._holding&&this.requestUpdate()},t))}_readStateIcon(){const t=this.renderRoot.querySelector("ha-state-icon")?.shadowRoot;if(!t)return;const e=t.querySelector("ha-icon"),i="string"==typeof e?.icon&&e.icon||e?.getAttribute("icon")||void 0;let n;if(!i){const e=t.querySelector("ha-svg-icon"),i="string"==typeof e?.path?e.path.trim():"";i&&(n={paths:[i],viewBox:"string"==typeof e?.viewBox&&e.viewBox.trim()?e.viewBox.trim():"0 0 24 24"})}i===this._stateRef&&(n?.paths[0]??"")===(this._stateGeom?.paths[0]??"")||!i&&!n||(this._stateRef=i,this._stateGeom=n,this.requestUpdate())}render(){this._animates=!1;const t=this._geom,e="svg"===this.icon||this._want?.startsWith("mcu:")?this._fb:this.icon;return this._useState?n.qy`${t?this._svg(t):n.s6}<ha-state-icon
        ?hidden=${!!t}
        .hass=${this.hass}
        .stateObj=${this.stateObj}
        aria-hidden=${this.decorative?"true":n.s6}
      ></ha-state-icon>`:t?this._svg(t):n.qy`<ha-icon icon=${e||n.s6} aria-hidden=${this.decorative?"true":n.s6}></ha-icon>`}_svg(t){const e=this._fx??(0,y.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"}),i=this._rigOn?this.rig?.body?.(t):void 0,o=i?{...e,fill:void 0,draw:"off"}:e,r=!i&&void 0!==this._frame,s=r?{paths:[this._frame],secondary:t.secondary,viewBox:t.viewBox}:t,a=C(s.viewBox),c=this._ref,l=c?(0,p.wV)(c):void 0,u=!!o.fill||"duotone"===o.colors.style&&!s.secondary?.length,h=s.strokes??[],f=`url(#${this._uid}-clip)`,g="gradient"===o.colors.style?this._gradient(o,a):void 0,v=g?`url(#${this._uid}-grad)`:o.colors.valueColor??o.colors.primary,b=!o.fill&&!!o.colors.valueMissing,_=o.device,w=!!_&&_.speed>0&&$.has(_.anim),M="loop"===o.draw&&!S(),A=M||!i&&this._drawing;this._animates=!!_&&_.speed>0||M;const z=[w?`dev dev-${_.anim}`:"",M?"mc-draw-loop":A?"mc-draw":""].filter(Boolean).join(" "),j=[w?k(_):"",A?`--mc-draw-dur: ${x(o.drawDuration)}s`:""].filter(Boolean).join("; "),E=["body",b?"dim":""].filter(Boolean).join(" "),T=n.JW`<g class=${E}>
        ${i?n.JW`<g style=${v.startsWith("url(")?`--mc-rig-fill: ${v}`:"currentColor"!==v?`--mc-rig-paint: ${q(v)}`:n.s6}>${m(i)}</g>`:r&&l?n.JW`${this._base(s,o,v,a)}<g class="morph-in">${this._ownSvg(l,t,o,v,a,!1)}</g>`:this._base(s,o,v,a,l)}
        ${o.fill?this._fill(o.fill,a,q(o.fill.color===o.colors.primary?v:o.fill.color),h.length?{mask:f}:{clip:f}):n.s6}
      </g>`;return n.qy`${d(this._drawSeq,n.qy`<svg part="svg" viewBox=${s.viewBox} aria-hidden="true" focusable="false"
      class=${z||n.s6} style=${j||n.s6}>
      ${u||g?n.JW`<defs>
            ${u?this._clip(s,a):n.s6}
            ${g??n.s6}
          </defs>`:n.s6}
      ${this._device(o,s,a,w,n.JW`${this._outs.map(t=>this._outgoing(t,a,o,v))}${void 0!==this._inStart?d(this._inSeq,n.JW`<g class="xfade-in">${T}</g>`):T}${A?this._drawLayer(s,a,v):n.s6}`)}
    </svg>`)}`}_outgoing(t,e,i,o){const r=C(t.g.viewBox),s=[t.ms!==M?`animation-duration: ${x(t.ms/1e3)}s`:"",t.skip>0?`animation-delay: ${x(-t.skip/1e3)}s`:""].filter(Boolean).join("; "),a="currentColor"!==o?`fill: ${q(o)}`:void 0;return n.JW`<svg class="xfade-out" aria-hidden="true" x=${x(e.x)} y=${x(e.y)} width=${x(e.w)} height=${x(e.h)}
      viewBox=${t.g.viewBox} overflow="visible" style=${s||n.s6}>${t.markup?this._ownSvg(t.markup,t.g,i,o,r,!1):n.JW`${(t.g.secondary??[]).map(t=>n.JW`<path class="secondary" d=${t} fill="currentColor" style=${a??n.s6}></path>`)}${t.g.paths.map(t=>n.JW`<path class="old" d=${t} fill="currentColor" style=${`fill: ${q(o)}`}></path>`)}${A(t.g.strokes??[],"currentColor",`stroke: ${q(o)}`,{cls:"old"})}`}</svg>`}_drawLayer(t,e,i){const o=x(e.w/24*1.2),r="currentColor"!==i?`stroke: ${q(i)}`:void 0;return n.JW`<g class="draw" aria-hidden="true">${[...t.secondary??[],...t.paths].map(t=>n.JW`<path d=${t} pathLength="1"
      fill="none" stroke="currentColor" stroke-width=${o} stroke-linecap="round" stroke-linejoin="round" style=${r??n.s6}></path>`)}${A(t.strokes??[],"currentColor",r,{pathLength:"1"})}</g>`}_clip(t,e){const i=`${this._uid}-clip`,o=[...t.paths,...t.secondary??[]];if(!t.strokes?.length)return n.JW`<clipPath id=${i}>${o.map(t=>n.JW`<path d=${t}></path>`)}</clipPath>`;const r=Math.max(...t.strokes.map(t=>t.width));return n.JW`<mask id=${i} maskUnits="userSpaceOnUse" x=${x(e.x-r)} y=${x(e.y-r)} width=${x(e.w+2*r)} height=${x(e.h+2*r)}>
      ${o.map(t=>n.JW`<path d=${t} fill="#fff"></path>`)}${A(t.strokes,"#fff")}
    </mask>`}_device(t,e,i,o,r){const s=t.device;if(!s)return r;const a=k(s),c=i.x+i.w/2,l=i.y+i.h/2,d=Math.min(i.w,i.h);let u=n.s6;if("snow"===s.anim){const t=[0,1,2,3,4,5].map(t=>{const e=i.x+i.w*(.14+.144*t),o=i.y+i.h*(.2+.37*t%.6);return n.JW`<circle cx=${x(e)} cy=${x(o)} r=${x(.05*d)} style=${`animation-delay: ${x(-t/6*(s.speed||1.5))}s`}></circle>`});u=n.JW`<g class="snow" style=${`${a}; --mc-snow-dy: ${x(.2*i.h)}px`}>${t}</g>`}else"pulse"===s.anim&&(u=n.JW`<circle class="ring" cx=${x(c)} cy=${x(l)} r=${x(.44*d)} style=${`${a}; stroke-width: ${x(.06*d)}`}></circle>`);if(o)return n.JW`${r}${u}`;const h=`dev dev-${s.anim}${s.speed>0?"":" dev-static"}`,[m,p]="swing"===s.anim?[i.x,l]:"flame"===s.anim||"eq"===s.anim?[c,i.y+i.h]:[c,l],f=`transform-box: view-box; transform-origin: ${x(m)}px ${x(p)}px`,g="glow"===s.anim?n.JW`<g class="glow-copy" aria-hidden="true" style=${`filter: blur(${x(.07*d)}px)`}>${[...e.secondary??[],...e.paths].map(t=>n.JW`<path d=${t}></path>`)}${A(e.strokes??[],"currentColor","stroke: var(--mc-icon-glow-color, currentColor)")}</g>`:n.s6,y=n.JW`<g class=${h} style=${`${a}; ${f}`}>${g}${r}</g>`;return"flame"===s.anim?n.JW`<g class="flame-glow" style=${a}>${y}</g>${u}`:n.JW`${y}${u}`}_base(t,e,i,o,r){const s=e.fill?.emptyColor;if(r)return this._ownSvg(r,t,e,i,o);if(s)return n.JW`${[...t.secondary??[],...t.paths].map((e,i)=>n.JW`<path class=${i<(t.secondary?.length??0)?"secondary duo":"primary"} d=${e}
        fill="currentColor" style=${`fill: ${s}`}></path>`)}`;const a=e.fill?x(e.fill.emptyOpacity):void 0,c="currentColor"!==i?`fill: ${i}`:void 0,l="duotone"===e.colors.style?e.colors.secondary:void 0;if(l&&!t.secondary?.length){const e=x(Math.min(o.w,o.h)/24*3);return n.JW`
        ${t.paths.map(t=>n.JW`<path class="primary duo-body" d=${t} fill="currentColor" fill-opacity=${a??n.s6} style=${`fill: ${l}`}></path>`)}
        ${t.paths.map(t=>n.JW`<path class="duo-line" d=${t} clip-path=${`url(#${this._uid}-clip)`} opacity=${a??n.s6}
          style=${`fill: none; stroke: ${q(i)}; stroke-width: ${e}`}></path>`)}`}return n.JW`
      ${(t.secondary??[]).map(t=>n.JW`<path class=${`${l?"secondary duo":"secondary"}${void 0!==this._frame?" morph-in":""}`} d=${t} fill="currentColor"
        fill-opacity=${a??n.s6} style=${l?`fill: ${l}`:c??n.s6}></path>`)}
      ${t.paths.map(t=>n.JW`<path class="primary" d=${t} fill="currentColor" fill-opacity=${a??n.s6} style=${c??n.s6}></path>`)}`}_ownSvg(t,e,i,o,r,s=!0){const a=i.fill?.emptyColor,c=i.colors.style,l="duotone"===c&&!e.secondary?.length,d=!!a||"solid"!==c,u=a||l?void 0:i.colors.secondary,h=d||"currentColor"===o?void 0:q(o),p=i.fill&&!a?x(i.fill.emptyOpacity):void 0,f=[h?`color: ${h}; fill: ${h}`:"",d?`--mc-own-fill: ${a??(l?i.colors.secondary:q(o))}; --mc-own-stroke: ${a??q(o)}`:"",u?`--mc-icon-accent: ${u}`:""].filter(Boolean).join("; "),g=["own",d?"painted":"",u?"accented":""].filter(Boolean).join(" "),y=x(Math.min(r.w,r.h)/24*3),v=s&&l&&!a&&!e.strokes?.length?e.paths.map(t=>n.JW`<path class="duo-line" d=${t} clip-path=${`url(#${this._uid}-clip)`} opacity=${p??n.s6}
          style=${`fill: none; stroke: ${q(o)}; stroke-width: ${y}`}></path>`):n.s6;return n.JW`<g class=${g} fill="currentColor" opacity=${p??n.s6} style=${f||n.s6}>${m(t)}</g>${v}`}_gradient(t,e){return(0,v.o)(`${this._uid}-grad`,t.colors.angle,t.colors.stops??[],e)}_fill(t,e,i,o){if(void 0===t.level)return n.s6;const r=Math.max(0,t.level),s=z[t.direction],a=90===s||-90===s,c=a?e.h:e.w,l=a?e.w:e.h,d=e.x+e.w/2,u=e.y+e.h/2,h=d-c/2,m=u-l/2,p=t.wave&&r>0?.05*l*Math.min(1,Math.max(0,(.98-r)/.08)):0;p>0&&(this._animates=!0);const f=t=>n.JW`<g transform=${s?`rotate(${s} ${x(d)} ${x(u)})`:n.s6}>
        <g class="liquid" style=${`transform: translateY(${x((1-r)*l)}px)`}>
          <rect x=${x(h-c)} y=${x(m+p/2)} width=${x(3*c)} height=${x(2*l)} style=${`fill: ${t}`}></rect>
          ${p>0?(t=>{let e=`M${x(h)} ${x(m)}`;for(let t=0;t<4;t++){const i=h+t*c/2;e+=`Q${x(i+c/4)} ${x(m+(t%2?p:-p))} ${x(i+c/2)} ${x(m)}`}return e+=`V${x(m+p+.5)}H${x(h)}Z`,n.JW`<path class="wave" d=${e} style=${`fill: ${t}; --mc-wave-dx: ${x(-c)}px`}></path>`})(t):n.s6}
        </g>
      </g>`;return i.startsWith("url(")?n.JW`<g class="fill" clip-path=${o.clip??n.s6} mask=${o.mask??n.s6}>
      <mask id=${`${this._uid}-liquid`} maskUnits="userSpaceOnUse" x=${x(e.x)} y=${x(e.y)} width=${x(e.w)} height=${x(e.h)}>${f("#fff")}</mask>
      <rect class="paint" x=${x(e.x)} y=${x(e.y)} width=${x(e.w)} height=${x(e.h)} mask=${`url(#${this._uid}-liquid)`} style=${`fill: ${i}`}></rect>
    </g>`:n.JW`<g class="fill" clip-path=${o.clip??n.s6} mask=${o.mask??n.s6}>${f(i)}</g>`}};function E(t){return!(!t||"object"!=typeof t)&&(!(!t.fill||"object"!=typeof t.fill)||(!(!t.device||"off"===t.device)||(!(!t.draw||"off"===t.draw)||(!0===t.morph||!!t.colors&&"object"==typeof t.colors&&Object.keys(t.colors).length>0))))}function T(t){const e="svg"!==t.icon||t.svg?t:{...t,icon:t.fallbackIcon||"mdi:help",useEntityIcon:t.useEntityIcon||!!t.entity},i=e.className??"",s=(0,o.hZ)(e.hass,e.entity,e.iconOn,e.iconOff),a=!s&&!!e.useEntityIcon&&!!e.entity,c=s??(a&&(0,o.fq)(e.hass,e.entity)||e.icon),l="svg"===e.icon&&!!e.svg||!!c?.startsWith("mcu:"),d=e.rig??("icon"===e.part?(0,r.V)()?.iconRig:void 0);if(!E(e.fx)&&!l&&!d){const t=e.part??n.s6;return s?n.qy`<ha-icon class=${i} data-mc-part=${t} .icon=${s}></ha-icon>`:a?(0,o.TO)(e.hass,e.entity,e.icon??"",i,e.part):n.qy`<ha-icon class=${i} data-mc-part=${t} .icon=${e.icon}></ha-icon>`}const u=a&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?e.hass?.states?.[e.entity]:void 0;return n.qy`<mc-svg-icon
    class=${i}
    data-mc-part=${e.part??n.s6}
    style=${e.color?`color: ${e.color}`:n.s6}
    aria-hidden=${e.ariaHidden?"true":n.s6}
    aria-label=${e.ariaLabel||n.s6}
    role=${e.ariaLabel?"img":n.s6}
    .decorative=${!!e.ariaHidden||!!e.ariaLabel}
    .hass=${e.hass}
    .icon=${c}
    .entity=${e.entity}
    .fx=${e.fx}
    .iconOn=${e.iconOn}
    .iconOff=${e.iconOff}
    .svg=${e.svg}
    .fallback=${e.fallbackIcon}
    .kept=${(0,r.V)()?.customIcons}
    .stateObj=${u}
    .rig=${d}
  ></mc-svg-icon>`}j.styles=f,_([(0,s.MZ)({attribute:!1})],j.prototype,"hass",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"icon",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"entity",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"fx",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"iconOn",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"iconOff",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"svg",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"fallback",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"kept",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"stateObj",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"decorative",void 0),_([(0,s.MZ)({attribute:!1})],j.prototype,"rig",void 0),j=_([(0,s.EM)("mc-svg-icon")],j)},5171(t,e,i){i.d(e,{OW:()=>j,ae:()=>$,j9:()=>M});var n=i(1771);const o="0 0 24 24",r=t=>new Map(t.map(t=>[t.toLowerCase(),t])),s=r(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),a=r(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"]),c=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),l=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]),d=/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,u=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),h=new Set(["matrix","translate","scale","rotate","skewx","skewy"]),m=new Set(["transform","gradientTransform"]);function p(t,e){const i=t.match(/\(/g)?.length??0,n=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return n.length===i&&n.every(t=>e.has(t[1].toLowerCase()))}function f(t,e){const i=e.trim();if(!/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i.test(i)){if(m.has(t))return p(i,h)?e:void 0;if(p(i.replace(d,""),u)){if("id"===t)return/^[\w.:-]+$/.test(i)?i:void 0;if("class"===t){const t=i.split(/\s+/).filter(t=>/^[\w-]+$/.test(t));return t.length?t.join(" "):void 0}return e}}}const g=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),y=t=>"mc-accent"!==t&&(g.has(t)||/^(mc-|dev-|xfade-)/.test(t))?`u-${t}`:t,v=t=>t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),b=t=>String(+t.toFixed(3)),_=t=>{if(null==t||/%/.test(t))return;const e=parseFloat(t);return Number.isFinite(e)?e:void 0},w=[1,0,0,1,0,0],x=(t,e)=>[t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]];function $(t){let e=w;if(!t)return e;for(const[,i,n]of t.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const t=n.split(/[\s,]+/).filter(Boolean).map(Number);if(t.some(t=>!Number.isFinite(t)))continue;let o=w;switch(i){case"matrix":6===t.length&&(o=t);break;case"translate":o=[1,0,0,1,t[0]??0,t[1]??0];break;case"scale":o=[t[0]??1,0,0,t[1]??t[0]??1,0,0];break;case"rotate":{const e=(t[0]??0)*Math.PI/180,[i,n]=[t[1]??0,t[2]??0],r=[Math.cos(e),Math.sin(e),-Math.sin(e),Math.cos(e),0,0];o=x(x([1,0,0,1,i,n],r),[1,0,0,1,-i,-n]);break}case"skewX":o=[1,0,Math.tan((t[0]??0)*Math.PI/180),1,0,0];break;case"skewY":o=[1,Math.tan((t[0]??0)*Math.PI/180),0,1,0,0]}e=x(e,o)}return e}function k(t,e){if((t=>t.every((t,e)=>Math.abs(t-w[e])<1e-9))(e))return t;const i=t=>[e[0]*t[0]+e[2]*t[1]+e[4],e[1]*t[0]+e[3]*t[1]+e[5]];return(0,n.ER)((0,n.Mj)(t).map(t=>t.map(t=>t.map(i))))}function M(t,e){const i=e=>_(t.getAttribute(e));switch(e){case"path":{const e=t.getAttribute("d")?.trim();return e||void 0}case"circle":case"ellipse":{const t=i("cx")??0,n=i("cy")??0,o="circle"===e?i("r"):i("rx")??i("ry"),r="circle"===e?o:i("ry")??i("rx");if(!o||!r||o<=0||r<=0)return;const s=`A${b(o)} ${b(r)} 0 1 0`;return`M${b(t-o)} ${b(n)}${s} ${b(t+o)} ${b(n)}${s} ${b(t-o)} ${b(n)}Z`}case"rect":{const t=i("x")??0,e=i("y")??0,n=i("width"),o=i("height");if(!n||!o||n<=0||o<=0)return;let r=i("rx")??i("ry")??0,s=i("ry")??i("rx")??0;if(r=Math.min(Math.max(r,0),n/2),s=Math.min(Math.max(s,0),o/2),!r||!s)return`M${b(t)} ${b(e)}H${b(t+n)}V${b(e+o)}H${b(t)}Z`;const a=`A${b(r)} ${b(s)} 0 0 1`;return`M${b(t+r)} ${b(e)}H${b(t+n-r)}${a} ${b(t+n)} ${b(e+s)}V${b(e+o-s)}${a} ${b(t+n-r)} ${b(e+o)}H${b(t+r)}${a} ${b(t)} ${b(e+o-s)}V${b(e+s)}${a} ${b(t+r)} ${b(e)}Z`}case"line":return`M${b(i("x1")??0)} ${b(i("y1")??0)}L${b(i("x2")??0)} ${b(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(t){const e=(t??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let t=0;t+1<e.length;t+=2)Number.isFinite(e[t])&&Number.isFinite(e[t+1])&&i.push([e[t],e[t+1]]);return i}(t.getAttribute("points"));if(i.length<2)return;return`M${i.map(([t,e])=>`${b(t)} ${b(e)}`).join("L")}${"polygon"===e?"Z":""}`}}}const S="The SVG is too complex.",A=t=>({markup:"",viewBox:o,paths:[],accentPaths:[],strokes:[],error:t}),C={fill:!0,stroke:!1,width:1},z=/^(none|transparent)$/i;function q(t,e){const i=e=>{const i=t.getAttribute(e);return null===i?void 0:f(e,i)?.trim()},n=i("fill"),o=i("stroke"),r=_(i("stroke-width")),s=i("stroke-linecap"),a=i("stroke-linejoin"),c=i("fill-rule");return{evenodd:void 0===c?e.evenodd:"evenodd"===c,fill:void 0===n?e.fill:!z.test(n),stroke:void 0===o?e.stroke:!z.test(o),width:void 0!==r&&r>=0?r:e.width,cap:s&&/^(butt|round|square)$/.test(s)?s:e.cap,join:a&&/^(miter|round|bevel|arcs|miter-clip)$/.test(a)?a:e.join}}function j(t){const e="string"==typeof t?t:"";if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length)>32768)return A("The SVG is larger than 32 KB.");const i=function(t){if("undefined"==typeof DOMParser)return;const e=new DOMParser;try{const i=e.parseFromString(t,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return n}catch{}return[...e.parseFromString(t,"text/html").getElementsByTagName("*")].find(t=>"svg"===t.localName.toLowerCase())}(e);if(!i)return A("No <svg> element found.");const n=function(t){const e=(t.getAttribute("viewBox")??t.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===e.length&&e.every(Number.isFinite)&&e[2]>0&&e[3]>0)return e.map(b).join(" ");const i=_(t.getAttribute("width")),n=_(t.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${b(i)} ${b(n)}`:o}(i),r=[],d=[],u=[],h={},m=(t,e,i=[])=>{let n="",o="";for(const i of[...t.attributes]){const t=a.get(i.name.toLowerCase());if(!t||i.name.includes(":"))continue;if(e&&("viewBox"===t||"width"===t||"height"===t))continue;const r=f(t,i.value);void 0!==r&&("class"===t?o=r.split(" ").map(y).join(" "):n+=` ${t}="${v(r)}"`)}const r=[o,...i].filter(Boolean).join(" ");return r?` class="${v(r)}"${n}`:n};let p=!1;const g=(t,e,i,n,o,a)=>{if(a>64||p)return p=!0,"";const y=s.get(t.localName.toLowerCase());if(!y||"svg"===y)return"";if("title"===y)return`<title>${v=t.textContent??"",v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</title>`;var v;const b=x(e,$(f("transform",t.getAttribute("transform")??"")??null)),_=n||(t.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),w=i&&!l.has(y),S=q(t,o),A=[];if(w&&c.has(y)){const e=M(t,y);if(e){const t=k(e,b);if(S.fill&&"line"!==y){const e=_?d:r;S.evenodd&&(_?h.accent??=[]:h.paths??=[]).push(e.length),e.push(t),A.push("mc-f")}if(S.stroke&&S.width>0){const e=+(S.width*Math.sqrt(Math.abs(b[0]*b[3]-b[1]*b[2]))).toFixed(3);u.push({d:t,width:e,...S.cap?{cap:S.cap}:{},...S.join?{join:S.join}:{},..._?{accent:!0}:{}}),A.push("mc-s")}}}const C=[...t.children].map(t=>g(t,b,w,_,S,a+1)).join("");return`<${y}${m(t,!1,A)}>${C}</${y}>`},w=$(f("transform",i.getAttribute("transform")??"")??null),z=q(i,C),j=[...i.children].map(t=>g(t,w,!0,!1,z,1)).join("");return p?A(S):r.length||d.length||u.length?{markup:`<svg viewBox="${n}"${m(i,!0)}>${j}</svg>`,viewBox:n,paths:r,accentPaths:d,strokes:u,...h.paths||h.accent?{evenodd:h}:{}}:A("The SVG has no shapes to draw.")}i.d(e,["kk",0,S,"lw",0,x])},8446(t,e,i){i.d(e,{bE:()=>g,GC:()=>y,S1:()=>h});var n=i(6161),o=i(4446),r=i(7850),s=i(7137),a=i(2016),c=i(7921);class l extends c.Kq{constructor(t){if(super(t),this._ms=6e4,t.type!==c.OA.CHILD)throw new Error("tickingText: child position only")}render(t,e){return t()}update(t,[e,i]){this._text=e,i===this._ms&&void 0!==this._timer||(this._ms=i,this._schedule());const o=e();return o===this._shown?n.c0:(this._shown=o,o)}_clear(){void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}_schedule(){if(this._clear(),!(this.isConnected&&this._ms>0))return;const t=this._ms-Date.now()%this._ms+20;this._timer=setTimeout(()=>{this._timer=void 0,this._tick(),this._schedule()},t)}_tick(){const t=this._text?.();void 0!==t&&t!==this._shown&&(this._shown=t,this.setValue(t))}disconnected(){this._clear()}reconnected(){this._tick(),this._schedule()}}const d=(0,c.u$)(l),u={short:{weekday:"short",month:"short",day:"numeric"},medium:{month:"short",day:"numeric",year:"numeric"},long:{weekday:"long",month:"long",day:"numeric",year:"numeric"},numeric:{year:"numeric",month:"numeric",day:"numeric"}},h=t=>Object.prototype.hasOwnProperty.call(u,t);function m(t,e,i){const n=(0,a.cj)(t),o=n?{...i,timeZone:n}:i,r=(0,a.XN)(t)??(new Intl.DateTimeFormat).resolvedOptions().locale;try{return new Intl.DateTimeFormat(`${r.split("-u-")[0]}-u-${e}`,o)}catch{return new Intl.DateTimeFormat(`en-u-${e}`,o)}}function p(t,e,i){const n=function(t,e){const i={},n=m(e,"ca-gregory-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});for(const e of n.formatToParts(t))i[e.type]=e.value;const o=i=>m(e,"ca-gregory",i).format(t),r=t=>String(Number(t)||0);return{year:r(i.year),month:r(i.month),day:r(i.day),weekdayLong:()=>o({weekday:"long"}),weekdayShort:()=>o({weekday:"short"}),monthLong:()=>o({month:"long"}),monthShort:()=>o({month:"short"})}}(t,i),o=t=>t.padStart(2,"0");return e.replace(f,(t,e)=>{if(void 0!==e)return e;switch(t){case"YYYY":return n.year;case"YY":return n.year.slice(-2);case"MMMM":return n.monthLong();case"MMM":return n.monthShort();case"MM":return o(n.month);case"M":return n.month;case"dddd":return n.weekdayLong();case"ddd":return n.weekdayShort();case"DD":return o(n.day);default:return n.day}})}const f=/\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g;function g(t){const e=(t??"").trim();return"full"===e?"long":h(e)||"iso"===e?e:-1===e.search(f)?"short":e}function y(t,e,i){const n=g(e);return h(n)?(0,a.LE)(i,u[n]).format(t):p(t,"iso"===n?"YYYY-MM-DD":n,i)}class v extends o.l{constructor(){super(...arguments),this.metadata={type:"clock",name:99,description:136,category:"advanced",icon:"mdi:clock-outline"}}createDefault(){return{id:(0,s.$)("clock"),type:"clock",show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(t,e){const i=t,o=i.show_seconds?1e3:6e4;return n.qy`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${d(()=>function(t,e,i){const n=e.format_12h??(0,a.oE)(i),o={hour:n?"numeric":"2-digit",minute:"2-digit",hourCycle:n?"h12":"h23"};return e.show_seconds&&(o.second="2-digit"),(0,a.LE)(i,o).format(t)}(new Date,i,e),o)}</span>
        ${!1!==i.show_date?n.qy`<span class="mc-clock-date">${d(()=>y(new Date,i.date_format,e),6e4)}</span>`:n.s6}
      </div>
    `}}r.s.register(new v)},5274(t,e,i){i.d(e,{IC:()=>l.IC,_Y:()=>l._Y,cy:()=>l.cy,k2:()=>l.k2});var n=i(6161),o=i(7249),r=i(7850),s=i(7137),a=i(5809),c=i(2675),l=i(4334);const d=()=>n.qy`
  <div class="mc-module mc-custom-card mc-custom-card-placeholder">
    <ha-icon icon="mdi:card-plus-outline"></ha-icon>
    <span>${(0,c.t)(35)}</span>
  </div>
`;class u extends o.C{constructor(){super(...arguments),this.metadata={type:"custom-card",name:119,description:167,category:"advanced",icon:"mdi:card-plus-outline",inherit:!1}}createDefault(){return{id:(0,s.$)("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}placeholder(t,e){return t.card_type?n.qy`<div class="mc-module mc-custom-card"><div
      style="display:flex;align-items:center;justify-content:center;min-height:60px;color:var(--secondary-text-color,#6b7280);font-size:0.875rem"
    >${"pending"===e?(0,c.t)(26):""}</div></div>`:d()}getDependencies(){return{forwardHass:!0}}validate(t){const e=t;return void 0===e.card_config||"object"==typeof e.card_config&&null!==e.card_config&&!Array.isArray(e.card_config)?[]:[(0,c.t)(3)]}}r.s.registerLazy(new u,a.tQ["modules-extra"]),i.d(e,["Nq",0,d])},3225(t,e,i){i.d(e,{b:()=>d});var n=i(6161),o=i(7249),r=i(7850),s=i(7137),a=i(2675),c=i(5809),l=i(8751);function d(t,e){return n.qy`
    <div class="mc-module mc-forecast" style=${e?`min-height: ${(0,l.bc)(e)}px`:n.s6}>
      ${Array.from({length:t}).map((t,e)=>n.qy`
          <div class="mc-forecast-item">
            <span class="mc-forecast-label">${(0,a.t)(9,{n:e+1})}</span>
            <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
            <span class="mc-forecast-temp">--°</span>
          </div>
        `)}
    </div>
  `}class u extends o.C{constructor(){super(...arguments),this.metadata={type:"forecast",name:202,description:141,category:"advanced",icon:"mdi:calendar-week-outline",inherit:["weather"]}}createDefault(){return{id:(0,s.$)("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1,animated_icons:!0}}placeholder(t){return d(Math.max(1,Math.round(t.num_forecasts||5)),t)}}r.s.registerLazy(new u,c.tQ["modules-extra"])},7838(t,e,i){var n=i(6161),o=i(7249),r=i(7850),s=i(7137),a=i(5809),c=i(8751);class l extends o.C{constructor(){super(...arguments),this.metadata={type:"weather",name:489,description:140,category:"advanced",icon:"mdi:weather-partly-cloudy",inherit:["weather"]}}createDefault(){return{id:(0,s.$)("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5,animated_icons:!0}}getDependencies(t){return t.entity?{entities:["sun.sun"]}:{}}placeholder(t){return n.qy`<div class="mc-module mc-weather" style="min-height: ${(0,c.qz)(t)}px"></div>`}}r.s.registerLazy(new l,a.tQ["modules-extra"]),i.d(e,["$",0,t=>"below_horizon"===t?.states?.["sun.sun"]?.state])},7249(t,e,i){i.d(e,{C:()=>n});class n{validate(t){return[]}}},4446(t,e,i){i.d(e,{l:()=>n});class n{validate(t){return[]}}},1870(t,e,i){var n=i(6161),o=i(7249),r=i(7850),s=i(7137),a=i(7110),c=i(5809);const l="ha-camera-stream",d=t=>1e3*(Number(t.refresh_interval)>0?Number(t.refresh_interval):10);class u extends o.C{constructor(){super(...arguments),this.metadata={type:"camera",name:90,description:132,category:"content",icon:"mdi:camera-outline",inherit:["camera"]}}createDefault(){return{id:(0,s.$)("camera"),type:"camera",aspect_ratio:"16:9",camera_view:"live",show_controls:!0}}getDependencies(t,e){const i=t;if(!i.entity)return{};return"live"===i.camera_view&&!e?.editMode&&"undefined"!=typeof customElements&&!!customElements.get(l)?{}:{refreshInterval:d(i)}}placeholder(t){const e=t;return n.qy`<div class="mc-module mc-camera" style="aspect-ratio: ${(0,a.XK)(e.aspect_ratio)}"></div>`}}r.s.registerLazy(new u,c.tQ["modules-extra"]),i.d(e,["G",0,l,"Q",0,d])},4371(t,e,i){i.d(e,{S:()=>m});var n=i(6161),o=i(4446),r=i(7850),s=i(7137),a=i(8983),c=i(4719),l=i(3925),d=i(1476),u=i(9853),h=i(2675);function m(t){return void 0===t.show_name&&void 0===t.show_state?{name:!0,state:!0}:{name:!!t.show_name,state:!!t.show_state}}class p extends o.l{constructor(){super(...arguments),this.metadata={type:"info",name:231,description:138,category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:(0,s.$)("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(t,e){const i=t,o=i.entity&&e?e.states[i.entity]:void 0;let{name:r,state:s}=m(i);r||s||i.secondary_info||(s=!0),r||s||o||(r=!0);const p=o?(0,a.tX)(e,o):i.entity||(0,h.t)(38);let f="—";if(o&&!i.attribute&&void 0!==(0,d.HF)(o))f=(0,u.q)(o);else if(o){const t=(0,a.Ai)(e,o,i.attribute||void 0);f=!1===i.show_unit?t.value:t.text}const g=o&&i.secondary_info?(0,a.Ai)(e,o,i.secondary_info).text:"",y=n.qy`
      ${r?n.qy`<span class="mc-info-name" data-mc-part="name">${p}</span>`:n.s6}
      ${s?n.qy`<span class="mc-info-state" data-mc-part="state">${i.prefix||""}${f}${i.suffix||""}</span>`:n.s6}
      ${g?n.qy`<span class="mc-info-secondary">${g}</span>`:n.s6}
    `;if(!i.show_icon)return n.qy`<div class="mc-module mc-info">${y}</div>`;const v=(0,c.s)({icon:i.icon||"mdi:information-outline",entity:i.entity,hass:e,useEntityIcon:!i.icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:information-outline"}),b=o?(0,l.id)(o):void 0;return n.qy`
      <div class="mc-module mc-info mc-info--icon">
        <span class="mc-info-icon" style=${b?`color: var(--mc-design-color, ${b})`:n.s6}>${v}</span>
        <div class="mc-info-text">${y}</div>
      </div>
    `}}r.s.register(new p)},1293(t,e,i){i.d(e,{P7:()=>g,XZ:()=>f,a5:()=>y,fA:()=>p});var n=i(6161),o=i(4446),r=i(7850),s=i(7137),a=i(8003),c=i(188),l=i(8911),d=i(8983),u=i(2675);const h={input_select:{"":{list:"options",service:"select_option",field:"option"}},select:{"":{list:"options",service:"select_option",field:"option"}},input_text:{"":{list:"",service:"set_value",field:"value"}},text:{"":{list:"",service:"set_value",field:"value"}},climate:{"":{list:"hvac_modes",service:"set_hvac_mode",field:"hvac_mode"},preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"},fan_mode:{current:"fan_mode",list:"fan_modes",service:"set_fan_mode",field:"fan_mode"},swing_mode:{current:"swing_mode",list:"swing_modes",service:"set_swing_mode",field:"swing_mode"}},fan:{preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"}},light:{effect:{current:"effect",list:"effect_list",service:"turn_on",field:"effect"}},media_player:{source:{current:"source",list:"source_list",service:"select_source",field:"source"},sound_mode:{current:"sound_mode",list:"sound_mode_list",service:"select_sound_mode",field:"sound_mode"}},water_heater:{operation_mode:{current:"operation_mode",list:"operation_list",service:"set_operation_mode",field:"operation_mode"}},humidifier:{mode:{current:"mode",list:"available_modes",service:"set_mode",field:"mode"}}},m={fan:"preset_mode",light:"effect",media_player:"source",water_heater:"operation_mode",humidifier:"mode"};function p(t,e){const i=h[t.entity_id.split(".")[0]];if(i)return e?i[e]:i[""]??i[m[t.entity_id.split(".")[0]]]}function f(t){return t?Object.keys(h[t.split(".")[0]]??{}).filter(Boolean):[]}function g(t,e,i){if(!t||!e)return[];if(!e.list)return i.map(t=>t.value);const n=t.attributes?.[e.list];return Array.isArray(n)?n.map(String):[]}function y(t){if(!Array.isArray(t))return[];const e=t.map(t=>"string"==typeof t||"number"==typeof t?{label:String(t),value:String(t)}:t&&"object"==typeof t?{label:String(t.label??t.value??""),value:String(t.value??t.label??"")}:void 0).filter(t=>!!t&&""!==t.value);return(t=>3===t.length&&t.every((t,e)=>t.label===`Option ${e+1}`&&t.value===`option_${e+1}`))(e)?[]:e}class v extends o.l{constructor(){super(...arguments),this.metadata={type:"dropdown",name:153,description:381,category:"controls",icon:"mdi:form-dropdown",inherit:Object.keys(h)}}createDefault(){return{id:(0,s.$)("dropdown"),type:"dropdown"}}_optionLabel(t,e,i,n){try{return(i.current?t?.formatEntityAttributeValue?.(e,i.current,n):t?.formatEntityState?.(e,n))||n}catch{return n}}renderPreview(t,e){const i=t,o=i.entity&&e?e.states[i.entity]:void 0,r=o?p(o,i.attribute):void 0,s=y(i.options),h=g(o,r,s),m=!!o&&("unavailable"===o.state||"unknown"===o.state);let f;f=s.length?s.map(t=>({...t,disabled:!(!o||r&&h.includes(t.value))})):o&&r?h.map(t=>({label:this._optionLabel(e,o,r,t),value:t})):[];const v=o?r?.current?String(o.attributes?.[r.current]??""):i.attribute?String(o.attributes?.[i.attribute]??""):o.state:void 0,b=void 0!==v&&f.some(t=>t.value===v),_=o&&v?r?this._optionLabel(e,o,r,v):v:"",w=!(!o||!r||m||!e),x=o?(0,d.tX)(e,o):(0,u.t)(11);return n.qy`
      <div class="mc-module mc-dropdown">
        <select
          aria-label=${x}
          ?disabled=${!w}
          @change=${t=>{t.stopPropagation();const i=t.target,n=i.value;if(!(w&&o&&r&&e&&h.includes(n)))return void(i.value=b?v:"");const s={domain:o.entity_id.split(".")[0],service:r.service,data:{entity_id:o.entity_id,[r.field]:n}};(0,a.Bw)(e,s)}}
          @click=${l.i}
          @pointerdown=${l.i}
          @pointerup=${l.i}
          @keydown=${l.i}
        >
          ${!b&&o?n.qy`<option value="" disabled selected hidden>${m?e?.formatEntityState?.(o)??o.state:_}</option>`:n.s6}
          ${f.length>0?f.map(t=>n.qy`<option value=${t.value} ?disabled=${t.disabled} ?selected=${v===t.value}>${t.label}</option>`):n.qy`<option disabled ?selected=${!o}>${(0,u.t)(41)}</option>`}
          ${o&&f.length?(0,c.m)(b?v:""):n.s6}
        </select>
      </div>
    `}}r.s.register(new v)},7106(t,e,i){i.d(e,{Q:()=>y});var n=i(6161),o=i(4446),r=i(7850),s=i(7137),a=i(8003),c=i(3925),l=i(4719),d=i(8983),u=i(2917),h=i(8911),m=i(188),p=i(1535),f=i(2675);const g=t=>Math.max(0,Math.min(255,Math.round(t))).toString(16).padStart(2,"0");function y(t){const e=t.attributes?.effect_list;return Array.isArray(e)&&e.length>0&&!!(4&Number(t.attributes?.supported_features??4))}class v extends o.l{constructor(){super(...arguments),this.metadata={type:"light",name:252,description:254,category:"controls",icon:"mdi:lightbulb-outline",inherit:["light"]}}createDefault(){return{id:(0,s.$)("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(t,e){const i=t,o=i.entity&&e?e.states[i.entity]:void 0,r=(0,p.V)(),s=!o||"unavailable"===o.state||"unknown"===o.state,v=!!o&&!!e&&!s,b="on"===o?.state,_=o?(0,d.tX)(e,o):i.entity||(0,f.t)(25),w=()=>r?.requestUpdate(),x=(0,u.vh)(i.entity,"brightness","light"),$=o?(0,u.jb)(x,(0,a.pR)(o))??(0,a.pR)(o):void 0,k=(0,u.vh)(i.entity,"color_temp_kelvin","light"),M=o&&b?(0,a.wu)(o):void 0,S=o?(0,u.jb)(k,M)??M:void 0,A=o?(0,a.Vb)(o):{min:2e3,max:6500};let C;C=o?b&&void 0!==$&&(0,a.c9)(o)?`${(0,d.gn)(e,$,0)}%`:e?.formatEntityState?.(o)??o.state:"Off";const z=`var(--mc-design-color, ${o&&(0,c.id)(o)||"var(--state-icon-color, #9e9e9e)"})`,q=!1!==i.show_brightness&&(!o||(0,a.c9)(o)),j=i.show_color_temp&&(!o||(0,a.eI)(o)),E=i.show_color&&(!o||(0,a.Aw)(o)),T=i.show_effect&&!!o&&y(o),P=T?o.attributes.effect_list.map(String):[],N=o?.attributes?.effect,O=(0,l.s)({icon:i.icon&&"svg"!==i.icon?i.icon:"mdi:lightbulb",entity:i.entity,hass:e,useEntityIcon:!i.icon||"svg"===i.icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg});return n.qy`
      <div class="mc-module mc-light ${i.compact?"mc-light--compact":""}">
        <div class="mc-light-header">
          <button
            type="button"
            class="mc-light-toggle"
            style="color: ${z};"
            aria-label=${(0,f.t)(60,{name:_})}
            aria-pressed=${b?"true":"false"}
            ?disabled=${!v}
            @click=${t=>{t.stopPropagation(),v&&i.entity&&(0,a.Bw)(e,(0,a.H3)(e,i.entity))}}
            @pointerdown=${h.i}
            @pointerup=${h.i}
            @keydown=${h.i}
          >${O}</button>
          ${i.compact?n.qy`<span class="mc-light-name--compact" data-mc-part="name">${_}</span>`:n.qy`
                <div class="mc-light-info">
                  <div class="mc-light-name" data-mc-part="name">${_}</div>
                  <div class="mc-light-secondary" data-mc-part="state">${C}</div>
                </div>
              `}
        </div>

        ${q?n.qy`
              <div class="mc-light-control mc-light-brightness">
                <ha-icon .icon=${"mdi:brightness-6"}></ha-icon>
                ${(0,h.E)({value:$??0,min:0,max:100,step:1,disabled:!v,label:`${_} brightness`,valueText:`${$??0}%`,style:"--mc-slider-color: var(--state-light-active-color, #fdd835);",onCommit:t=>{v&&(0,u.n_)(x,t,(0,a.pR)(o),t=>(0,a.Bw)(e,t<=0?{domain:"light",service:"turn_off",data:{entity_id:i.entity}}:{domain:"light",service:"turn_on",data:{entity_id:i.entity,brightness_pct:Math.round(t)}}),w,300)}})}
                <span class="mc-light-value">${$??0}%</span>
              </div>
            `:n.s6}

        ${j?n.qy`
              <div class="mc-light-control mc-light-color-temp">
                <ha-icon .icon=${"mdi:thermometer"}></ha-icon>
                ${(0,h.E)({value:S,min:A.min,max:A.max,step:50,disabled:!v,label:`${_} color temperature`,valueText:void 0!==S?`${(0,d.gn)(e,S,0)} K`:void 0,style:"--mc-slider-color: var(--mc-light-color-temp);",onCommit:t=>{v&&(0,u.n_)(k,t,M,t=>(0,a.Bw)(e,{domain:"light",service:"turn_on",data:{entity_id:i.entity,color_temp_kelvin:Math.round(t)}}),w,300)}})}
                <span class="mc-light-value">${void 0!==S?`${(0,d.gn)(e,S,0)} K`:""}</span>
              </div>
            `:n.s6}

        ${E?n.qy`
              <div class="mc-light-control mc-light-color">
                <ha-icon .icon=${"mdi:palette"}></ha-icon>
                <input
                  type="color"
                  class="mc-light-color-input"
                  aria-label=${(0,f.t)(64,{name:_})}
                  .value=${function(t){const e=t?.attributes?.rgb_color;if(Array.isArray(e)&&e.length>=3&&e.every(t=>"number"==typeof t))return`#${g(e[0])}${g(e[1])}${g(e[2])}`;const i=t?(0,c.id)(t):void 0,n=i?.match(/^rgb\((\d+), (\d+), (\d+)\)$/);return n?`#${g(+n[1])}${g(+n[2])}${g(+n[3])}`:"#ffffff"}(o)}
                  ?disabled=${!v}
                  @change=${t=>{if(t.stopPropagation(),!v)return;const n=t.target.value;(0,a.Bw)(e,{domain:"light",service:"turn_on",data:{entity_id:i.entity,rgb_color:[1,3,5].map(t=>parseInt(n.slice(t,t+2),16))}})}}
                  @click=${h.i}
                  @pointerdown=${h.i}
                  @pointerup=${h.i}
                  @keydown=${h.i}
                />
              </div>
            `:n.s6}

        ${T?n.qy`
              <div class="mc-light-control mc-light-effect">
                <ha-icon .icon=${"mdi:creation"}></ha-icon>
                <select
                  class="mc-light-effect-select"
                  aria-label=${(0,f.t)(65,{name:_})}
                  ?disabled=${!v}
                  @change=${t=>{t.stopPropagation();const n=t.target.value;v&&P.includes(n)&&(0,a.Bw)(e,{domain:"light",service:"turn_on",data:{entity_id:i.entity,effect:n}})}}
                  @click=${h.i}
                  @pointerdown=${h.i}
                  @pointerup=${h.i}
                  @keydown=${h.i}
                >
                  ${N&&P.includes(N)?n.s6:n.qy`<option value="" selected disabled hidden>${(0,f.t)(12)}</option>`}
                  ${P.map(t=>n.qy`<option value=${t} ?selected=${t===N}>${this._effectLabel(e,o,t)}</option>`)}
                  ${(0,m.m)(N&&P.includes(N)?N:"")}
                </select>
              </div>
            `:n.s6}
      </div>
    `}_effectLabel(t,e,i){try{return t?.formatEntityAttributeValue?.(e,"effect",i)||i}catch{return i}}validate(t){return[]}}r.s.register(new v)},9113(t,e,i){i.d(e,{H:()=>m});var n=i(6161),o=i(4446),r=i(7850),s=i(7137),a=i(8003),c=i(2917),l=i(8911),d=i(1535),u=i(8983),h=i(2675);function m(t,e){if(!t?.entity_id.startsWith("climate.")||e&&"temperature"!==e)return;const i=t.attributes||{},n="number"==typeof i.target_temp_low?i.target_temp_low:void 0,o="number"==typeof i.target_temp_high?i.target_temp_high:void 0;return void 0!==n&&void 0!==o&&"number"!=typeof i.temperature?[n,o]:void 0}class p extends o.l{constructor(){super(...arguments),this.metadata={type:"spinbox",name:416,description:296,category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:(0,s.$)("spinbox"),type:"spinbox"}}renderPreview(t,e){const i=t,o=i.entity&&e?e.states[i.entity]:void 0,r=o?(0,a.fR)(e,o,i.attribute,{min:i.min,max:i.max,step:i.step}):void 0,s=(0,c.vh)(i.entity,i.attribute,"spinbox"),p=r?(0,c.jb)(s,r.value)??r.value:void 0,f=(0,d.V)(),g=r&&void 0===p?m(o,i.attribute):void 0;let y;y=r&&void 0!==p?(0,a.C8)(e,r,p):r&&g?`${(0,a.C8)(e,{...r,unit:""},g[0])} – ${(0,a.C8)(e,r,g[1])}`:o?(0,u.Ai)(e,o).text:"–";const v=!r||r.readOnly||!e||void 0===p,b=t=>i=>{if(i.stopPropagation(),!r?.call||!e||v||void 0===p)return;const n=r.call,o=(0,a.Ee)(p+t*r.step,r.min,r.max,r.step);o!==p&&(0,c.n_)(s,o,r.value,t=>(0,a.Bw)(e,n(t)),()=>f?.requestUpdate())},_=o?(0,u.tX)(e,o):(0,h.t)(51),w=void 0!==p&&void 0!==r&&p<=r.min,x=void 0!==p&&void 0!==r&&p>=r.max;return n.qy`
      <div class="mc-module mc-spinbox" role="group" aria-label=${_}>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-decrement"
          aria-label=${(0,h.t)(10,{name:_})}
          ?disabled=${v||w}
          @click=${b(-1)}
          @pointerdown=${l.i}
          @pointerup=${l.i}
          @keydown=${l.i}
        >&minus;</button>
        <span class="mc-spinbox-value ${r&&void 0!==p?"":"mc-spinbox-value--text"}" aria-live="polite">${y}</span>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-increment"
          aria-label=${(0,h.t)(23,{name:_})}
          ?disabled=${v||x}
          @click=${b(1)}
          @pointerdown=${l.i}
          @pointerup=${l.i}
          @keydown=${l.i}
        >+</button>
      </div>
    `}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&e.min>=e.max?[(0,h.t)(30)]:void 0===e.step||e.step>0?[]:[(0,h.t)(52)]}}r.s.register(new p)},8751(t,e,i){i.d(e,{bc:()=>a,qz:()=>s,z5:()=>r});const n=[[2,.67],[1.5,.83],[1.17,1],[1,1.33],[.83,1.67],[.67,2.33]],o=1.5;function r(t){const e=String(t??"").split("\n");let i=0,r=0,s=-1,a="",c=!1,l=!1,d=0;const u=(t,e,n,o)=>{c&&o===a?i+=t:(s<0&&(s=e),i+=(i?Math.max(r,e):0)+t,a=o),r=n,c=!0};for(const t of e){const e=t.trim();if(e.startsWith("```")){l=!l,c=!1;continue}if(l){u(o,1,1,"code");continue}if(!e||/^\{%.*%\}$/.test(e)){c=!1;continue}const i=/^(#{1,6})\s/.exec(e);if(i){const[t,e]=n[i[1].length-1];u(o*t,e*t,e*t,"h"+ ++d),c=!1}else e.startsWith("|")?/^[|\s:-]+$/.test(e)?c=!0:u(1.83,0,0,"table"):u(o,1,1,/^([-*+]|\d+\.)\s/.test(e)?"list":"p")}return Math.max(o,Math.round(100*(i+Math.max(s,0)+r))/100)}function s(t){const e=!1!==t.show_temperature,i=!1!==t.show_condition,n=e&&i?67:e?40:36;return t.show_forecast?n+14+a({show_temperature:!0,show_precipitation:!1}):n}function a(t){const e=!1!==t.show_temperature;return 16+("twice_daily"===t.forecast_type?36:18)+29+(e?23:0)+(e&&!t.forecast_type?.match(/hourly|twice/)?22:0)+(!1!==t.show_precipitation?19:0)}},7850(t,e,i){var n=i(1535);const o=new class{constructor(){this.modules=new Map,this.chunks=new Map,this.stubs=new Map,this.views=new Map}register(t){this.modules.set(t.metadata.type,t)}registerLazy(t,e){const i=t.metadata.type;this.chunks.set(i,e),this.stubs.set(i,t),this.views.delete(i);const n=Object.create(t,{renderPreview:{value:(i,n)=>this.renderLazy(t,e,i,n)}});this.modules.set(i,n)}provideView(t,e){this.views.set(t,e)}isReady(t){const e=this.chunks.get(t);return!e||(this.views.has(t)||!!this.stubs.get(t)?.renderPreview&&e.ready())}prefetch(t){if(!this.chunks.size)return;const e=new Set,i=new Set,n=t=>{if(!t||"object"!=typeof t||i.has(t))return;if(i.add(t),Array.isArray(t))return void t.forEach(n);const o=t;if("string"==typeof o.type){const t=this.chunks.get(o.type);t&&e.add(t)}for(const[t,e]of Object.entries(o))"card_config"!==t&&n(e)};n(t);for(const t of e)t.load()}renderLazy(t,e,i,o){const r=this.views.get(t.metadata.type);if(r)return r.renderPreview(i,o);if(t.renderPreview)return e.load(),t.renderPreview(i,o);if(e.failed())return t.placeholder(i,"failed");e.load();const s=(0,n.V)()?.requestUpdate;return s&&e.whenReady(s),t.placeholder(i,"pending")}get(t){return this.modules.get(t)}getAll(){return Array.from(this.modules.values())}getByCategory(t){return this.getAll().filter(e=>e.metadata.category===t)}getMetadata(){return this.getAll().map(t=>t.metadata)}search(t,e=String){const i=t.toLowerCase();return this.getAll().filter(t=>e(t.metadata.name).toLowerCase().includes(i)||e(t.metadata.description).toLowerCase().includes(i)||t.metadata.type.toLowerCase().includes(i))}createDefault(t){const e=this.get(t);return e?e.createDefault():null}has(t){return this.modules.has(t)}get types(){return Array.from(this.modules.keys())}};i.d(e,["s",0,o])},4413(t,e,i){i.d(e,{CF:()=>c,Dh:()=>l,I0:()=>d,V_:()=>a,m$:()=>u});var n=i(6161),o=i(7850),r=i(1535),s=i(2675);function a(t){const e=t.join(". ");return n.qy`<div class="mc-module mc-module-error" role="alert" title=${e}>
    <ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${e}</span>
  </div>`}function c(t,e){const i=o.s.get(t?.type);if(!i)return a([(0,s.t)(62,{type:String(t?.type)})]);try{const o=i.validate(t);if(o.length)return a(o);const s=(0,r.V)();if(!s||s.editMode){const e=i.hints?.(t)??[];if(e.length)return function(t){const e=t.join(". ");return n.qy`<div class="mc-module mc-module-hint" title=${e}>
    <ha-icon icon="mdi:information-outline"></ha-icon><span>${e}</span>
  </div>`}(e)}return i.renderPreview(t,e)}catch(e){return console.warn(`Magic Card: ${t.type} module failed to render`,e),a([e instanceof Error?e.message:String(e)])}}function l(t,e,i,n=0){const o=(0,r.V)();return o?.renderChild?o.renderChild(t,i,n):c(t,e)}function d(t){const e=(0,r.V)();return t.map((t,e)=>({child:t,index:e})).filter(({child:t})=>!e?.childHidden?.(t))}function u(t){const e=(0,r.V)();return e&&!e.editMode?n.s6:n.qy`<span class="mc-placeholder-text">${t}</span>`}},1771(t,e,i){i.d(e,{BE:()=>x,Bq:()=>M,ER:()=>P,GO:()=>E,GW:()=>N,G_:()=>S,O:()=>A,Rr:()=>h,Tl:()=>w,aM:()=>m,dm:()=>k,fs:()=>_,uD:()=>g});const n=1e-6,o=(t,e)=>Math.abs(t[0]-e[0])<n&&Math.abs(t[1]-e[1])<n,r=(t,e,i)=>t+(e-t)*i,s=(t,e,i)=>[r(t[0],e[0],i),r(t[1],e[1],i)],a=(t,e,i)=>({c1:[t[0]+2/3*(e[0]-t[0]),t[1]+2/3*(e[1]-t[1])],c2:[i[0]+2/3*(e[0]-i[0]),i[1]+2/3*(e[1]-i[1])],to:i}),c=(t,e)=>{return e.c1&&e.c2?[t,e.c1,e.c2,e.to]:(i=t,n=e.to,[i,s(i,n,1/3),s(i,n,2/3),n]);var i,n},l=/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;class d{constructor(t){this.d=t,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const t=this.d[this.i];if(t&&/[MmLlHhVvCcSsQqTtAaZz]/.test(t))return this.i++,t}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip(),l.lastIndex=this.i;const t=l.exec(this.d);if(!t)throw new Error(`Bad path number at ${this.i}`);return this.i+=t[0].length,Number(t[0])}flag(){this.skip();const t=this.d[this.i];if("0"!==t&&"1"!==t)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===t?1:0}}function u(t,e,i,r,s,a,c){if(o(t,c))return[];if(e=Math.abs(e),i=Math.abs(i),e<n||i<n)return[{to:c}];const l=r*Math.PI/180,d=Math.cos(l),u=Math.sin(l),h=(t[0]-c[0])/2,m=(t[1]-c[1])/2,p=d*h+u*m,f=-u*h+d*m,g=p*p/(e*e)+f*f/(i*i);if(g>1){const t=Math.sqrt(g);e*=t,i*=t}const y=e*e*i*i-e*e*f*f-i*i*p*p,v=e*e*f*f+i*i*p*p;let b=Math.sqrt(Math.max(0,y/v));s===a&&(b=-b);const _=b*e*f/i,w=-b*i*p/e,x=d*_-u*w+(t[0]+c[0])/2,$=u*_+d*w+(t[1]+c[1])/2,k=(t,e,i,n)=>Math.atan2(t*n-e*i,t*i+e*n),M=(p-_)/e,S=(f-w)/i,A=(-p-_)/e,C=(-f-w)/i,z=k(1,0,M,S);let q=k(M,S,A,C);!a&&q>0?q-=2*Math.PI:a&&q<0&&(q+=2*Math.PI);const j=Math.max(1,Math.ceil(Math.abs(q)/(Math.PI/2)-1e-9)),E=q/j,T=4/3*Math.tan(E/4),P=t=>[x+e*Math.cos(t)*d-i*Math.sin(t)*u,$+e*Math.cos(t)*u+i*Math.sin(t)*d],N=t=>[-e*Math.sin(t)*d-i*Math.cos(t)*u,-e*Math.sin(t)*u+i*Math.cos(t)*d],O=[];let R=t;for(let t=0;t<j;t++){const e=z+t*E,i=e+E,n=t===j-1?c:P(i),o=N(e),r=N(i);O.push({c1:[R[0]+T*o[0],R[1]+T*o[1]],c2:[n[0]-T*r[0],n[1]-T*r[1]],to:n}),R=n}return O}function h(t){const e=new d(t),i=[];let n,r,s,c,l=[0,0],h=[0,0];const m=t=>{n||(n={start:l,segs:[],closed:!1},i.push(n),h=l),n.segs.push(t)};try{for(;!e.done();){const t=e.command();if(t)c=t;else{if(!c||!e.hasNumber())break;"M"===c?c="L":"m"===c&&(c="l")}const i=c===c.toLowerCase(),d=i?l[0]:0,p=i?l[1]:0,f=()=>[e.number()+d,e.number()+p];let g,y,v;switch(c.toUpperCase()){case"M":l=f(),h=l,n=void 0;break;case"L":m({to:v=f()});break;case"H":m({to:v=[e.number()+d,l[1]]});break;case"V":m({to:v=[l[0],e.number()+p]});break;case"C":{const t=f();g=f(),m({c1:t,c2:g,to:v=f()});break}case"S":{const t=r?[2*l[0]-r[0],2*l[1]-r[1]]:l;g=f(),m({c1:t,c2:g,to:v=f()});break}case"Q":y=f(),m(a(l,y,v=f()));break;case"T":y=s?[2*l[0]-s[0],2*l[1]-s[1]]:l,m(a(l,y,v=f()));break;case"A":{const t=e.number(),i=e.number(),n=e.number(),o=e.flag(),r=e.flag();v=f(),u(l,t,i,n,o,r,v).forEach(m);break}case"Z":n&&n.segs.length&&(o(l,h)||n.segs.push({to:h}),n.closed=!0),l=h,n=void 0,c=void 0}v&&(l=v),r=g,s=y}}catch{}return i.filter(t=>t.segs.length>0)}function m(t){const e=h(t)[0];if(!e)return;const i=e.segs[e.segs.length-1].to;return{start:e.start,segs:o(i,e.start)?e.segs:[...e.segs,{to:e.start}],closed:!0}}const p=t=>{const e=Math.round(100*t)/100;return String(Object.is(e,-0)?0:e)},f=t=>`${p(t[0])} ${p(t[1])}`;function g(t){return t.map(t=>{const e=t.segs.slice(),i=e[e.length-1];return t.closed&&i&&!i.c1&&o(i.to,t.start)&&e.length>1&&e.pop(),[`M${f(t.start)}`,...e.map(t=>t.c1&&t.c2?`C${f(t.c1)} ${f(t.c2)} ${f(t.to)}`:`L${f(t.to)}`),...t.closed?["Z"]:[]].join(" ")}).join(" ")}const y=t=>t.length>1&&o(t[0][0],t[t.length-1][3]);const v=t=>h(t).map(t=>{let e=t.start;return t.segs.map(t=>{const i=c(e,t);return e=t.to,i})});function b(t,e,i){const n=1-i;return e.c1&&e.c2?[n*n*n*t[0]+3*n*n*i*e.c1[0]+3*n*i*i*e.c2[0]+i*i*i*e.to[0],n*n*n*t[1]+3*n*n*i*e.c1[1]+3*n*i*i*e.c2[1]+i*i*i*e.to[1]]:[t[0]+(e.to[0]-t[0])*i,t[1]+(e.to[1]-t[1])*i]}function _(t,e){const[i,n,o,r]=t,a=s(i,n,e),c=s(n,o,e),l=s(o,r,e),d=s(a,c,e),u=s(c,l,e),h=s(d,u,e);return[[i,a,d,h],[h,u,l,r]]}function w(t,e,i){const n=t=>[t[0]+e,t[1]+i];return{start:n(t.start),segs:t.segs.map(t=>t.c1&&t.c2?{c1:n(t.c1),c2:n(t.c2),to:n(t.to)}:{to:n(t.to)}),closed:t.closed}}function x(t){const e=[t.start,...t.segs.map(t=>t.to)],i=[];for(let n=t.segs.length-1;n>=0;n--){const o=t.segs[n];i.push(o.c1&&o.c2?{c1:o.c2,c2:o.c1,to:e[n]}:{to:e[n]})}return{start:t.start,segs:i,closed:t.closed}}const $=(t,e)=>0===e?t:{start:t.segs[e-1].to,segs:[...t.segs.slice(e),...t.segs.slice(0,e)],closed:t.closed};function k(t,e){const{seg:i,t:n}=function(t,e){const i={seg:0,t:0,d:1/0};let n=t.start;t.segs.forEach((t,o)=>{const r=r=>{const s=b(n,t,r),a=(s[0]-e[0])**2+(s[1]-e[1])**2;a<i.d&&(i.seg=o,i.t=r,i.d=a)};if(t.c1)for(let t=0;t<=48;t++)r(t/48);else{const i=t.to[0]-n[0],o=t.to[1]-n[1],s=i*i+o*o;r(s>0?Math.min(1,Math.max(0,((e[0]-n[0])*i+(e[1]-n[1])*o)/s)):0)}n=t.to});const o=t.segs[i.seg],r=i.seg?t.segs[i.seg-1].to:t.start;if(o.c1){const t=t=>{const i=b(r,o,t);return(i[0]-e[0])**2+(i[1]-e[1])**2};let n=Math.max(0,i.t-1/48),s=Math.min(1,i.t+1/48);for(let e=0;e<30;e++){const e=n+(s-n)/3,i=s-(s-n)/3;t(e)<t(i)?s=i:n=e}i.t=(n+s)/2}const s=b(r,o,i.t);return{seg:i.seg,t:i.t,point:s,dist:Math.hypot(s[0]-e[0],s[1]-e[1])}}(t,e);if(n<1e-6&&0===i)return t;if(n>.999999)return $(t,(i+1)%t.segs.length);if(n<1e-6)return $(t,i);const[o,r]=function(t,e,i){const n=b(t,e,i);if(!e.c1||!e.c2)return[{to:n},{to:e.to}];const[o,r]=_([t,e.c1,e.c2,e.to],i);return[{c1:o[1],c2:o[2],to:n},{c1:r[1],c2:r[2],to:e.to}]}(i?t.segs[i-1].to:t.start,t.segs[i],n);return{start:o.to,segs:[r,...t.segs.slice(i+1),...t.segs.slice(0,i),o],closed:t.closed}}function M(t,e=12){const i=[t.start];let n=t.start;for(const o of t.segs){if(o.c1)for(let t=1;t<e;t++)i.push(b(n,o,t/e));i.push(o.to),n=o.to}return i.length>1&&o(i[i.length-1],t.start)&&i.pop(),i}function S(t,e=8){return`polygon(${M(t,e).map(t=>`${p(t[0])}px ${p(t[1])}px`).join(", ")})`}function A(t){const e=t.flatMap(t=>M(t,24));if(!e.length)return;const i=e.map(t=>t[0]),n=e.map(t=>t[1]),o=Math.min(...i),r=Math.min(...n);return{x:o,y:r,w:Math.max(...i)-o,h:Math.max(...n)-r}}const C=(t,e)=>Math.hypot(t[0]-e[0],t[1]-e[1]),z=t=>(C(t[0],t[3])+C(t[0],t[1])+C(t[1],t[2])+C(t[2],t[3]))/2;function q(t,e){const i=t.map(t=>t.map(t=>[t[0],t[1]]));if(!i.length)return i;for(;i.length<e;){let t=0,e=-1;i.forEach((i,n)=>{const o=z(i);o>e&&(e=o,t=n)}),i.splice(t,1,..._(i[t],.5))}return i}function j(t){let e=0;for(const i of t)for(let t=0;t<3;t++)e+=i[t][0]*i[t+1][1]-i[t+1][0]*i[t][1];return e/2}function E(t,e){const i=v(t),n=v(e);if(!i.length||i.length!==n.length)return;const o=[],r=[],s=i.map((t,e)=>y(t)&&y(n[e])),a=i.map((t,e)=>s[e]?j(t)*j(n[e]):0),c=a.some(t=>t<0)&&a.every((t,e)=>!s[e]||t<0);return i.forEach((t,e)=>{const i=c&&s[e]?n[e].map(t=>[t[3],t[2],t[1],t[0]]).reverse():n[e];const a=Math.max(t.length,i.length),l=q(t,a);let d=q(i,a);y(l)&&y(d)&&(d=function(t,e){let i=e,n=1/0;for(let o=0;o<e.length;o++){const r=[...e.slice(o),...e.slice(0,o)];let s=0;for(let e=0;e<r.length&&s<n;e++)for(let i=0;i<4;i++)s+=(r[e][i][0]-t[e][i][0])**2+(r[e][i][1]-t[e][i][1])**2;s<n&&(n=s,i=r)}return i}(l,d)),o.push(l),r.push(d)}),{from:o,to:r}}const T=t=>{const e=Math.round(1e3*t)/1e3;return String(Object.is(e,-0)?0:e)};function P(t){return t.map(t=>{if(!t.length)return"";const e=t=>`${T(t[0])} ${T(t[1])}`,i=t.map(t=>`C${e(t[1])} ${e(t[2])} ${e(t[3])}`).join("");return`M${e(t[0][0])}${i}${y(t)?"Z":""}`}).join("")}function N(t,e){return P(t.from.map((i,n)=>i.map((i,o)=>i.map((i,r)=>s(i,t.to[n][o][r],e)))))}i.d(e,["Mj",0,v])},2093(t,e,i){i.d(e,{n6:()=>c});var n=i(3920);const o=[5e3,15e3,6e4],r="magic_card_utils/get_animations";const s=new class{constructor(){this.status="idle",this.version=0,this._docs=new Map,this._listeners=new Set,this._onReady=()=>{"ready"===this.status?this._refetch():this._tries<9&&(this._tries=0,this._retry())},this._retry=()=>{"unavailable"===this.status&&this._start(this._hass,this._conn)}}ensure(t){const e=t?.connection;t&&e&&(e!==this._conn&&!0===this._conn?.connected||(this._hass=t,e!==this._conn&&(this._teardown(),this._conn=e,e.addEventListener?.("ready",this._onReady),this._start(t,e))))}get(t){return this._docs.get(t)}list(){return[...this._docs.values()].sort((t,e)=>t.name.localeCompare(e.name))}subscribe(t){return this._listeners.add(t),()=>this._listeners.delete(t)}async _start(t,e){this._setStatus("loading");let i=[];try{const n=await e.subscribeMessage(t=>i?i.push(t):this._apply(t),{type:"magic_card_utils/subscribe_animations"});if(e!==this._conn)return void n();this._unsub=n;const o=await t.callWS({type:r});if(e!==this._conn)return;this._replace(o?.animations);const s=i;i=void 0;for(const t of s)this._apply(t,!1);this._setStatus("ready")}catch(t){if(e!==this._conn)return;if(i=void 0,this._unsub?.(),this._unsub=void 0,"unknown_command"===t?.code)this._tries=9;else{this._tries||console.warn("Magic Card: animation library unavailable",t);const e=o[this._tries++];e&&(this._timer=setTimeout(this._retry,e))}this._setStatus("unavailable")}}async _refetch(){const t=this._hass,e=this._conn;if(t&&e&&"ready"===this.status)try{const i=await t.callWS({type:r});e===this._conn&&(this._replace(i?.animations),this._emit())}catch{}}_replace(t){const{docs:e,errors:i}=(0,n.sO)(t??{},{v2:"lenient"});i.length&&console.warn("Magic Card: invalid animations in the library",i);for(const[t,i]of e){const n=this._docs.get(t);n&&JSON.stringify(n)===JSON.stringify(i)&&e.set(t,n)}this._docs=e,this.version++}_apply(t,e=!0){if(t&&"object"==typeof t){if("deleted"===t.action){if(!this._docs.delete(t.id))return}else if("saved"===t.action){const e=(0,n.H2)(t.animation,{v2:"lenient"});if(!e.ok)return void console.warn("Magic Card: invalid animation from the library",e.errors);this._docs.set(e.doc.id,e.doc)}else{if(!("animations"in t))return;this._replace(t.animations)}this.version++,e&&this._emit()}}_setStatus(t){this.status=t,this.version++,this._emit()}_emit(){for(const t of[...this._listeners])t()}_teardown(){clearTimeout(this._timer),this._tries=0,this._unsub?.(),this._unsub=void 0,this._conn?.removeEventListener?.("ready",this._onReady),this._conn=void 0,this._docs=new Map,this.status="idle"}reset(){this._teardown(),this._hass=void 0,this._listeners.clear(),this.version=0}},a=new WeakMap;function c(t){const e=t?.custom_animations;if(!e||"object"!=typeof e)return;let i=a.get(e);if(!i){const t=(0,n.sO)(e,{v2:"lenient"});t.errors.length&&console.warn("Magic Card: invalid custom_animations",t.errors),i=t.docs,a.set(e,i)}return i}i.d(e,["iG",0,s])},765(t,e,i){i.d(e,{_:()=>d,p:()=>c});var n=i(7850),o=i(3686);const r=new Set(["entity","entity_id","entities","trigger_entity"]),s=/^[a-z0-9_]+\.[a-z0-9_]+$/;let a=new WeakMap;function c(){a=new WeakMap}function l(t,e){if("string"==typeof t)for(const i of t.split(",")){const t=i.trim();s.test(t)&&e.add(t)}else if(Array.isArray(t))for(const i of t)"string"==typeof i&&l(i,e)}function d(t,e={editMode:!1}){const i=e.editMode?"edit":"view",s=a.get(t)?.[i];if(s)return s;const c=new Set;let d,u=!1;const h=t=>{t&&t>0&&(d=void 0===d?t:Math.min(d,t))},m=new Set,p=(t,i=!1,s,a=!1)=>{if(!t||"object"!=typeof t||m.has(t))return;if(m.add(t),Array.isArray(t)){for(const e of t)p(e,i,s,a);return}const d=t,f=i||"string"!=typeof d.type?void 0:n.s.get(d.type),g=f||a?(0,o.Xu)(d,s):s;for(const[t,e]of Object.entries(d))r.has(t)&&l(e,c),e&&"object"==typeof e&&p(e,i||"card_config"===t,g,"rows"===t||"columns"===t);if("time"===d.type&&("after"in d||"before"in d)&&h(6e4),"daynight"===d.preset&&c.add("sun.sun"),f){const t=(0,o.hY)(d,s,f.metadata.inherit),i=f.getDependencies?.((d.entity||void 0)===t?d:{...d,entity:t},e);i&&(i.entities?.forEach(t=>c.add(t)),h(i.refreshInterval),i.forwardHass&&(u=!0))}};p(t,!1,(0,o.hY)(t,void 0));const f={entities:[...c],refreshInterval:d,forwardHass:u};return a.set(t,{...a.get(t),[i]:f}),f}},213(t,e,i){i.d(e,{g:()=>s});var n=i(1535),o=i(8816),r=i(3686);class s{static evaluate(t,e){if(!t?.conditions?.length)return!0;if(!e)return!0;const i=t.conditions.map(t=>s.evaluateCondition(t,e));return"any"===t.mode?i.some(Boolean):i.every(Boolean)}static isComplete(t){if(!t||"object"!=typeof t)return!1;switch(t.type){case"state":return!!t.entity?.trim();case"attribute":return!!t.entity?.trim()&&!!t.attribute?.trim();case"template":return!!t.template?.trim();case"time":return!!t.after?.trim()||!!t.before?.trim();default:return!1}}static ruleMatches(t,e){const i=t.conditions;return!!(Array.isArray(i)&&i.length&&i.every(t=>s.isComplete(t)))&&s.evaluate({conditions:i,mode:t.mode},e)}static evaluateCondition(t,e){switch(t.type){case"state":return s.evaluateStateCondition(t,e);case"attribute":return s.evaluateAttributeCondition(t,e);case"time":return s.evaluateTimeCondition(t);case"template":return s.evaluateTemplateCondition(t);default:return!0}}static evaluateTemplateCondition(t){if(!t.template?.trim())return!0;const e=(0,n.V)(),i=e?.template(t.template,(0,r.xw)(t.template,e.entity,e.cardEntity));return"ok"===i?.status&&(0,o.Ew)(i.result)}static evaluateStateCondition(t,e){if(!t.entity)return!0;const i=e.states[t.entity];if(!i)return!1;const n=i.state;if(void 0!==t.state&&""!==t.state)return n===t.state;if(void 0!==t.state_not&&""!==t.state_not)return n!==t.state_not;const o=Number(n);if(!isNaN(o)){if(void 0!==t.above&&o<=t.above)return!1;if(void 0!==t.below&&o>=t.below)return!1}return!0}static evaluateAttributeCondition(t,e){if(!t.entity||!t.attribute)return!0;const i=e.states[t.entity];if(!i)return!1;const n=String(i.attributes[t.attribute]??"");if(void 0!==t.state&&""!==t.state)return n===t.state;if(void 0!==t.state_not&&""!==t.state_not)return n!==t.state_not;const o=Number(n);if(!isNaN(o)){if(void 0!==t.above&&o<=t.above)return!1;if(void 0!==t.below&&o>=t.below)return!1}return!0}static evaluateTimeCondition(t){const e=new Date,i=60*e.getHours()+e.getMinutes();if(t.after){const e=t.after.split(":").map(Number);if(e.length>=2){if(i<60*e[0]+e[1])return!1}}if(t.before){const e=t.before.split(":").map(Number);if(e.length>=2){if(i>=60*e[0]+e[1])return!1}}return!0}}},2421(t,e,i){i.d(e,{JK:()=>h,Jd:()=>u,S5:()=>m,pz:()=>l});const n=new Map,o=new Map,r=3e5;function s(t,e){for(const[t,i]of n)e.timestamp-i.timestamp>6e5&&n.delete(t);n.set(t,e)}const a=(t,e,i)=>`${t}|${e}|${i||""}`;function c(t,e,i){const n=[];for(const o of t){const t=e?o.a?.[e]:o.s,r="number"==typeof t?t:"string"==typeof t&&t.trim()?Number(t):NaN;if(!Number.isFinite(r))continue;const s=o.lu??o.lc,a="number"==typeof s&&Number.isFinite(s)?Math.max(1e3*s,i):i;n.push({t:a,v:r})}return n.sort((t,e)=>t.t-e.t)}function l(t,e,i,n){return n>=1&&i>e&&t.length?d(t,e,i,(i-e)/Math.floor(n),Math.floor(n)):[]}function d(t,e,i,n,o){const r=[];let s,a=0;for(let c=0;c<o;c++){const l=e+c*n,d=c===o-1?1/0:l+n;let u=0,h=0;for(;a<t.length&&t[a].t<d;)t[a].t>=l&&(u+=t[a].v,h++),s=t[a].v,a++;const m=h?u/h:s;void 0!==m&&r.push({t:Math.min(l+n/2,i),v:m})}return r}function u(t,e,i,n){if(!(n>0)||i<=e||!t.length)return t;const o=36e5/n;return d(t,e,i,o,Math.max(1,Math.ceil((i-e)/o)))}function h(t,e,i,l,d){const u=a(e,i,l||void 0),h=n.get(u);return h&&Date.now()-h.timestamp<=r||function(t,e,i,r,a,l){const d=o.get(e);if(d)return void(l&&d.add(l));o.set(e,new Set(l?[l]:[]));const u=new Date,h=new Date(u.getTime()-36e5*r);Promise.resolve().then(()=>t.callWS(function(t,e,i,n){return{type:"history/history_during_period",start_time:e.toISOString(),end_time:i.toISOString(),entity_ids:[t],include_start_time_state:!0,minimal_response:!n,no_attributes:!n,significant_changes_only:!n}}(i,h,u,a))).then(t=>{const n=t&&t[i]||[];s(e,{samples:c(n,a,h.getTime()),timestamp:Date.now()})}).catch(t=>{console.warn("magic-card: failed to fetch history for",i,t),s(e,{samples:n.get(e)?.samples??[],timestamp:Date.now(),error:!0})}).finally(()=>{const t=o.get(e);o.delete(e),t?.forEach(t=>t())})}(t,u,e,i,l||void 0,d),h}function m(t,e,i){return n.get(a(t,e,i||void 0))}},7924(t,e,i){i.d(e,{By:()=>p,J2:()=>f,RW:()=>c,fk:()=>a,i$:()=>s,yl:()=>u});const n="media-source://",o=/^url\(\s*(['"]?)(.*?)\1\s*\)$/i,r=3e4;function s(t){const e=t.trim(),i=e.match(o);return i?i[2].trim():e}function a(t){if("string"!=typeof t)return;const e=s(t);if(e.startsWith(n))return e;if(!e.startsWith("/")||e.startsWith("//")||!/[?&]authSig=/.test(e))return;const i=e.split(/[?#]/)[0].match(/^\/media\/([^/]+)\/(.+)$/);if(i)try{const t=i[2].split("/").map(decodeURIComponent).join("/");return`${n}media_source/${decodeURIComponent(i[1])}/${t}`}catch{return}}function c(t,e){if(!/[?&]authSig=/.test(t)||!/[?&]authSig=/.test(e))return!1;const i=t=>t.replace(/([?&])authSig=[^&#]*&?/,"$1").replace(/[?&]$/,"");return i(t)===i(e)}const l=new Map,d=new Map;function u(t){const e=l.get(t);return e?.url&&Date.now()<e.validUntil?e.url:void 0}function h(t,e){void 0!==e.timer&&clearTimeout(e.timer),e.timer=void 0,e.url&&d.get(t)?.size&&(e.timer=setTimeout(()=>{e.timer=void 0,d.get(t)?.size&&e.callWS&&m(t,e.callWS)},Math.max(0,e.refreshAt-Date.now())))}function m(t,e){let i=l.get(t);if(i||(i={validUntil:0,refreshAt:0},l.set(t,i)),i.callWS=e,i.inflight)return;const o=i;o.inflight=Promise.resolve().then(()=>e({type:"media_source/resolve_media",media_content_id:t})).then(t=>{const e=t?.url;if("string"!=typeof e||!e||e.startsWith(n))throw new Error("no url");const i=Date.now(),s=function(t){const e=/[?&]authSig=([^&#]+)/.exec(t)?.[1],i=e?.split(".")[1];if(!i)return r;try{const t=JSON.parse(atob(i.replace(/-/g,"+").replace(/_/g,"/"))),e=Number(t.exp)-Number(t.iat);return Number.isFinite(e)&&e>0?1e3*e:r}catch{return r}}(e);o.url=e,o.validUntil=i+s,o.refreshAt=i+Math.max(5e3,s-5e3)}).catch(()=>{o.url=void 0,o.validUntil=0,o.refreshAt=Date.now()+6e4}).finally(()=>{o.inflight=void 0,h(t,o),function(t){for(const e of d.get(t)??[])e.changed()}(t)})}function p(t){const e=l.get(t);if(!e?.callWS||e.inflight)return;const i=Date.now();void 0!==e.lastErrorRetry&&i-e.lastErrorRetry<1e4||(e.lastErrorRetry=i,m(t,e.callWS))}class f{constructor(t,e){this._requestUpdate=t,this._hass=e,this._ids=new Set,this._wanted=null,this._connected=!1,this._onReady=()=>{const t=this._callWS();if(t)for(const e of this._ids)m(e,t)}}changed(){this._connected&&this._requestUpdate()}begin(){this._wanted=new Set}get(t){return this._wanted?.add(t),u(t)}end(){const t=this._wanted;if(this._wanted=null,t){for(const e of this._ids)t.has(e)||this._unwatch(e);this._ids=t,this._connected&&this._watchAll()}}hostConnected(){this._connected=!0,this._watchAll()}hostDisconnected(){this._connected=!1;for(const t of this._ids)this._unwatch(t);this._listenReady(void 0)}_callWS(){const t=this._hass();return t?.callWS?e=>t.callWS(e):void 0}_watchAll(){const t=this._callWS();this._listenReady(this._hass()?.connection);for(const e of this._ids){let i=d.get(e);i||d.set(e,i=new Set);const n=!i.has(this);i.add(this);const o=l.get(e);!o||!o.inflight&&Date.now()>=o.refreshAt?t&&m(e,t):n&&void 0===o.timer&&h(e,o)}}_unwatch(t){const e=d.get(t);if(e?.delete(this),e&&!e.size){d.delete(t);const e=l.get(t);void 0!==e?.timer&&clearTimeout(e.timer),e&&(e.timer=void 0)}}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}}},1535(t,e,i){let n;function o(t,e){const i=n;n=t;try{return e()}finally{n=i}}function r(){return n}i.d(e,{V:()=>r,c:()=>o})},8816(t,e,i){i.d(e,{C3:()=>r,Ew:()=>s,L3:()=>o,XM:()=>a});const n=new Map;function o(t){return/\{\{|\{%|\{#/.test(t)}function r(t){if(null==t)return"";if("string"==typeof t)return t;if("object"==typeof t)try{return JSON.stringify(t)}catch{return String(t)}return String(t)}function s(t){if("boolean"==typeof t)return t;if("number"==typeof t)return 0!==t&&!Number.isNaN(t);if("string"!=typeof t)return!1;const e=t.trim().toLowerCase();return!!["true","yes","on","enable"].includes(e)||""!==e&&!Number.isNaN(Number(e))&&0!==Number(e)}class a{constructor(t,e,i=50){this._requestUpdate=t,this._connection=e,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const t of this._subs.values())t.failed=!1;if(this._connected)for(const[t,e]of this._subs)this._subscribe(t,e)}}begin(){this._wanted=new Set,this._dirty=!1}get(t,e){const i=function(t,e){return e&&Object.keys(e).length?`${t}\0${JSON.stringify(e)}`:t}(t,e);this._wanted?.add(i);let o=this._subs.get(i);return o||(o={template:t,variables:e,state:n.get(i)??{status:"pending"}},this._connection()?.subscribeMessage||(o.state={status:"unavailable"}),this._subs.set(i,o)),o.state}end(){const t=this._wanted;if(this._wanted=null,t)for(const[e,i]of this._subs)t.has(e)?this._connected&&this._subscribe(e,i):(this._unsubscribe(i),this._subs.delete(e))}hostConnected(){this._connected=!0;for(const[t,e]of this._subs)e.failed=!1,this._subscribe(t,e);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const t of this._subs.values())this._unsubscribe(t);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(t=>t.active).length}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(t,e){if(e.active||e.failed)return;const i=this._connection();if(!i?.subscribeMessage)return void this._set(t,e,{status:"unavailable"});this._listenReady(i),"unavailable"===e.state.status&&(e.state=n.get(t)??{status:"pending"});const o={type:"render_template",template:e.template,report_errors:!0};e.variables&&(o.variables=e.variables);const r={};e.token=r;const s=()=>e.token===r,a=i.subscribeMessage(i=>{if(s())if(i&&"object"==typeof i&&"error"in i&&void 0!==i.error){if("WARNING"===i.level)return;this._set(t,e,{status:"error",error:String(i.error)})}else this._set(t,e,{status:"ok",result:i?.result})},o);e.active=Promise.resolve(a).then(t=>t).catch(i=>{if(s()){e.active=void 0,e.token=void 0,e.failed=!0;const n=String(i&&"object"==typeof i&&"message"in i?i.message:i);this._set(t,e,{status:"error",error:n})}})}_unsubscribe(t){const e=t.active;t.active=void 0,t.token=void 0,e&&e.then(t=>{try{t?.()}catch{}})}_set(t,e,i){var o,r;(o=e.state,r=i,o.status===r.status&&("ok"===o.status&&"ok"===r.status?o.result===r.result||"object"==typeof o.result&&JSON.stringify(o.result)===JSON.stringify(r.result):"error"!==o.status||"error"!==r.status||o.error===r.error))||(e.state=i,function(t,e){"ok"===e.status&&(n.delete(t),n.set(t,e),n.size>300&&n.delete(n.keys().next().value))}(t,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}},598(t,e,i){i.d(e,{e5:()=>v,uU:()=>m,wL:()=>y});var n=i(5499),o=i(2699),r=i(5746),s=i(3251),a=i(4243);const c=new Set(["icon_fx","icon_on","icon_off","svg","entity"]);function l(t,e,i){for(const n of["hidden","editor_name","entity","share_entity"]){if(!i.has(n))continue;const o=e[n];void 0===o?delete t[n]:t[n]=o}}const d=["use_page_theme","theme","background","background_image","border_radius","padding","box_shadow","card_height","overflow","css","animations","ring","popup","flows","shape","value_background","seasonal","hover"],u={shape:["shape_options"]},h=new Set(["type","template","not_synced","name","rows","display","conditional_appearance",...d,"custom_animations","custom_shapes","custom_icons",...Object.values(u).flat()]);function m(t){const e={};for(const[i,o]of Object.entries(t))h.has(i)||void 0===o||(e[i]=(0,n.G)(o));return e}function p(t,e){return"custom"===t.shape&&"custom"===e?.shape&&e.shape_options&&t.shape_options&&t.shape_options!==e.shape_options&&(t.shape_options=(0,a.S)(e.shape_options,t.shape_options)),t}const f=(t,e)=>p({...t,...e},t);function g(t,e,i=!0){const n=new Map,o=(t,e)=>{const i=new Set;for(const o of t){const t=String(o.id);i.has(t)||Array.isArray(e)&&e.includes(t)||n.set(t,o),i.add(t)}};return e.not_synced?.includes("custom_animations")||o((0,s.B)(t),i&&e.hidden_animations),o((0,s.B)(e.custom_animations)),n.size?[...n.values()]:void 0}function y(t,e,i=!0){if(!t.template||!e)return t;const n={...t,custom_animations:g(e,t,i)};return n.custom_animations||delete n.custom_animations,n}function v(t,e,i=!1){const s=(0,n.G)(t);delete s.entity,s.type=e.type,s.template=e.template;const a=new Set(e.not_synced||[]);a.size>0&&(s.not_synced=[...a]),Object.assign(s,m(e));for(const t of["custom_shapes","custom_icons"]){const o={...!i&&!a.has(t)&&s[t],...e[t]};Object.keys(o).length?Object.assign(s,{[t]:(0,n.G)(o)}):delete s[t]}const h=i?e.custom_animations:g(s.custom_animations,e);h?s.custom_animations=(0,n.G)(h):delete s.custom_animations;for(const i of d){const o=u[i];if(o){const r=[i,...o],c=e,l=s;if(!a.has(i)||!r.some(t=>void 0!==c[t]))continue;for(const t of r)void 0===c[t]?delete l[t]:l[t]=(0,n.G)(c[t]);p(l,t);continue}a.has(i)&&void 0!==e[i]&&(s[i]=(0,n.G)(e[i]))}const y=new Map,v=new Map,b=new Map;for(const t of e.rows||[]){t.id&&y.set(t.id,t);for(const e of t.columns||[]){e.id&&v.set(e.id,e);for(const t of e.modules||[])t.id&&b.set(t.id,t)}}const _=new Set((s.rows||[]).map(t=>t.id).filter(Boolean));s.rows=(s.rows||[]).map(t=>{const e=t.id?y.get(t.id):void 0;if(e){const i=new Set(e.not_synced||[]);i.size>0&&(t.not_synced=[...i]),i.has("layout")&&void 0!==e.layout&&(t.layout=e.layout),i.has("column_widths")&&(void 0!==e.column_widths?t.column_widths=[...e.column_widths]:delete t.column_widths),i.has("design")&&e.design&&(t.design=f(t.design,e.design)),i.has("actions")&&(e.actions?t.actions=e.actions:delete t.actions),i.has("gap")&&void 0!==e.gap&&(t.gap=e.gap),i.has("padding")&&void 0!==e.padding&&(t.padding=e.padding),l(t,e,i)}const i=new Set((t.columns||[]).map(t=>t.id).filter(Boolean));if(t.columns=(t.columns||[]).map(t=>{const e=t.id?v.get(t.id):void 0;if(e){const i=new Set(e.not_synced||[]);if(i.size>0&&(t.not_synced=[...i]),i.has("design")&&e.design&&(t.design=f(t.design,e.design)),i.has("gap")&&void 0!==e.gap&&(t.gap=e.gap),i.has("padding")&&void 0!==e.padding&&(t.padding=e.padding),i.has("vertical_align")&&void 0!==e.vertical_align&&(t.vertical_align=e.vertical_align),l(t,e,i),i.has("modules")&&Array.isArray(e.modules))return{...t,modules:(0,n.G)(e.modules)}}const i=new Set((t.modules||[]).map(t=>t.id).filter(Boolean));if(t.modules=(t.modules||[]).map(t=>{const e=t.id?b.get(t.id):void 0;if(e){const i=new Set(e.not_synced||[]);i.size>0&&(t.not_synced=[...i]),l(t,e,i);const s=["text","icon","entity","image","content","label","attribute","prefix","suffix","url","service","service_data","data","use_entity","entity_display","use_entity_icon","use_entity_color","icon_color","size","icon_fx","icon_on","icon_off","svg","animated_icons"];for(const o of s)i.has(o)&&void 0!==e[o]?t[o]=(0,n.G)(e[o]):i.has(o)&&c.has(o)&&delete t[o];const a=(0,r.us)(t);if(a&&i.has(a)&&void 0!==e[a]&&(t[a]=(0,n.G)(e[a])),e.design&&i.has("design"))t.design=f(t.design,e.design);else if(e.design){const n=e.design,r={...t.design||{}};let s=!1;for(const t of i){if(!t.startsWith("design."))continue;const e=(0,o.I7)(t.slice(7));if(!(e.length>1)||e.some(t=>void 0!==n[t]))for(const t of e)e.length>1&&delete r[t],void 0!==n[t]&&(r[t]=n[t]),s=!0}s&&(t.design=p(r,t.design))}e.actions&&(i.has("actions")||[...i].some(t=>t.startsWith("actions.")))&&(t.actions={...t.actions,...e.actions})}return t}),e)for(const o of e.modules||[])o.id&&!i.has(o.id)&&t.modules.push((0,n.G)(o));return t}),e)for(const o of e.columns||[])o.id&&!i.has(o.id)&&t.columns.push((0,n.G)(o));return t});for(const t of e.rows||[])t.id&&!_.has(t.id)&&s.rows.push((0,n.G)(t));return s}i.d(e,["lC",0,["grid_options","layout_options","visibility","view_layout"]])},7050(t,e,i){i.d(e,{BR:()=>s,PT:()=>a});var n=i(1235);i(3920);let o,r;function s(){return o??=i.e(811).then(()=>i(2686)).then(t=>r=(0,n.t)("magic-card-anim-runtime.js",t),t=>{console.warn("Magic Card: the animation runtime (magic-card-anim-runtime.js) could not be loaded; animations play without parts, clips and bindings.",t)}),o}function a(){return r}},2641(t,e,i){const n=(t,e=1080)=>({label:t,unit:"deg",min:0,max:e}),o=(t,e=100)=>({label:t,unit:"%",min:0,max:e}),r=(t,e=60)=>({label:t,unit:"px",min:0,max:e}),s=(t=320,e=12)=>({label:t,unit:"",min:1,max:e}),a=s();function c(t,e,i){const{direction:n="normal",iterations:o="infinite",...r}=i.extra||{};return{id:t,name:e,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:o,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...r}}const l={iconKeyframes:!0},d=[c("breathe",84,{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[o(376,50),4]}),c("glow-pulse",209,{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[r(210),16],extra:l}),c("halo-ripple",220,{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[r(360),14],extra:l}),c("aura",32,{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[r(210),24],extra:l}),c("heartbeat",222,{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[o(376,50),12]}),c("spin",414,{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[n(367),360]}),c("fast-spin",175,{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[n(367),360]}),c("sway",437,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[n(19,90),6]}),c("wobble",497,{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[r(142),6]}),c("shake-alert",386,{group:"Motion",channels:["translate"],duration:2,intensity:[r(142),4]}),c("rumble",374,{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[r(142,10),1]}),c("float",194,{group:"Motion",channels:["translate"],duration:3,intensity:[r(142),6]}),c("flame-flicker",182,{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[o(191,30),5],extra:{origin:"50% 100%",colour:!0}}),c("steam-rise",426,{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[a,4],extra:{particles:"count"}}),c("bubbles",87,{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[a,6],extra:{particles:"count"}}),c("snow-fall",404,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[a,6],extra:{particles:"count"}}),c("rain-fall",344,{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[a,6],extra:{particles:"count"}}),c("liquid-wave",260,{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[o(176),40],extra:{particles:2}}),c("storm-flash",428,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[o(86),75],extra:{particles:1,front:!0}}),c("shine-sweep",391,{group:"Light & colour",channels:["fx"],duration:3,intensity:[o(390),45],extra:{particles:1,front:!0}}),c("bounce",78,{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[r(224),10],extra:{origin:"50% 100%"}}),c("jello",243,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[o(420,50),12]}),c("rubber-band",373,{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[o(431,50),25]}),c("tada",445,{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[n(19,45),3]}),c("swing",438,{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[n(19,90),15],extra:{origin:"50% 0"}}),c("flip",193,{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[n(367),360]}),c("pop",329,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[o(376,50),18]}),c("head-shake",221,{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[r(142,30),6]}),c("blink",55,{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[o(128),85]}),c("neon-flicker",287,{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[r(210,30),8],extra:{colour:!0}}),c("rainbow-hue",345,{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[n(228,720),360]}),c("glitch",206,{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[r(299,20),3],extra:{colour:!0}}),c("fade-pulse",172,{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[o(171),60]}),c("ping",323,{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[o(360,200),90],extra:{particles:1}}),c("ripple-rings",364,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[s(361,6),3],extra:{particles:"count"}}),c("radar-sweep",341,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[n(54,180),70],extra:{particles:1}}),c("conic-border-spin",112,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[r(72,12),2],extra:{particles:1}}),c("breathing-border",85,{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[r(72,12),2],extra:l}),c("fireflies",179,{group:"Scenes",channels:["fx"],duration:6,intensity:[a,8],extra:{particles:"count"}}),c("confetti",111,{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[a,10],extra:{particles:"count"}}),c("falling-leaves",174,{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[a,5],extra:{particles:"count"}}),c("lightning",255,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[o(86),90],extra:{particles:1,front:!0}}),c("ocean-waves",298,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[o(488),35],extra:{particles:3}}),c("sun-rays",435,{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[n(348,30),6],extra:{particles:1}}),c("heat-shimmer",223,{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[r(430,10),2]}),c("wind-lines",494,{group:"Scenes",channels:["fx"],duration:2.2,intensity:[a,5],extra:{particles:"count"}}),c("drip",152,{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[a,3],extra:{particles:"count"}}),c("equalizer-bars",169,{group:"Scenes",channels:["fx"],duration:.9,intensity:[s(52),5],extra:{particles:"count",direction:"alternate"}}),c("charging-stripes",94,{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[o(432),100],extra:{particles:1}}),c("orbit-dots",302,{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[s(144,8),3],extra:{particles:"count"}}),c("typing-dots",471,{group:"Scenes",channels:["fx"],duration:1.2,intensity:[r(78,20),4],extra:{particles:3}}),c("pendulum",322,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[n(19,90),20],extra:{origin:"50% 0",direction:"alternate"}}),c("orbit",301,{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[r(342,40),6]}),c("coin-spin",103,{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[n(367),360]}),c("rotate-3d",3,{group:"Motion",channels:["rotate"],duration:3,intensity:[n(458,180),25],extra:{direction:"alternate"}}),c("squash-stretch",421,{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[o(420,50),14],extra:{origin:"50% 100%"}}),c("wiggle",493,{group:"Motion",channels:["rotate"],duration:2.5,intensity:[n(19,45),8]}),c("shadow-lift",384,{group:"Motion",channels:["translate","glow"],duration:3,intensity:[r(251,20),4],extra:l}),c("holographic-shimmer",226,{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[o(430),35],extra:{particles:1,front:!0}}),c("scanline",377,{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[o(86),50],extra:{particles:1,front:!0}}),c("twinkle",470,{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[a,6],extra:{particles:"count",front:!0}}),c("spotlight",417,{group:"Light & colour",channels:["fx"],duration:7,intensity:[o(86),45],extra:{particles:1}}),c("border-snake",68,{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[r(492,12),3],extra:{ring:"snake"}}),c("neon-border",286,{group:"Borders",channels:["glow"],duration:2.4,intensity:[r(210,30),10],extra:l}),c("power-flow",333,{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[r(143,12),5],extra:{ring:"dots"}}),c("marching-ants",271,{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[r(492,12),2],extra:{ring:"dashes"}}),c("aurora",33,{group:"Backgrounds",channels:["fx"],duration:12,intensity:[o(207),55],extra:{particles:3}}),c("lava-lamp",247,{group:"Backgrounds",channels:["fx"],duration:9,intensity:[a,5],extra:{particles:"count",direction:"alternate"}}),c("plasma-gradient",324,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[o(430),70],extra:{particles:1}}),c("gradient-flow",213,{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[o(430),60],extra:{particles:1,direction:"alternate"}}),c("color-cycle-bg",106,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[o(430),35],extra:{particles:1}}),c("starfield",423,{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[a,12],extra:{particles:"count"}}),c("meteor-shower",277,{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[a,4],extra:{particles:"count"}}),c("bokeh",58,{group:"Backgrounds",channels:["fx"],duration:8,intensity:[a,7],extra:{particles:"count",direction:"alternate"}}),c("matrix-rain",274,{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[s(429),10],extra:{particles:"count"}}),c("smoke",400,{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[a,5],extra:{particles:"count"}}),c("clouds-drift",101,{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[s(100,6),3],extra:{particles:"count"}}),c("water-ripple",486,{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[s(365,8),3],extra:{particles:"count"}}),c("fireworks",180,{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[s(413),10],extra:{particles:"count"}}),...[["winter",496,"winter"],["spring",418,"spring"],["summer",434,"summer"],["autumn",38,"autumn"],["christmas",95,"christmas"],["new_year",288,"new_year"],["valentine",477,"valentine"],["easter",164,"easter"],["halloween",219,"halloween"],["weather",266,"weather"],["daynight",121,"daynight"],["snow",405,"snow"],["rain",346,"rain"],["storm",457,"storm"],["sun",436,"sun"],["clouds",102,"clouds"],["fog",196,"fog"],["wind",495,"wind"],["night",290,"night"],["dusk",159,"dusk"]].map(([t,e,i])=>c(t,e,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[o(126),50],extra:{seasonal:i}})),c("tap-ripple",446,{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[o(86),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),c("press",337,{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[o(127,30),6],extra:{trigger:"tap",iterations:1}})],u=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(t=>d.some(e=>e.group===t)),h=new Map(d.map(t=>[t.id,t]));i.d(e,["Au",0,{"Glow & pulse":208,Motion:280,Playful:326,"Light & colour":253,"Rings & sweeps":362,Borders:74,"Weather & device":490,Scenes:378,Backgrounds:49,Seasonal:380,Interaction:239},"Z4",0,[{id:"linear",label:259,css:"linear"},{id:"ease",label:160,css:"ease"},{id:"ease-in",label:161,css:"ease-in"},{id:"ease-out",label:163,css:"ease-out"},{id:"ease-in-out",label:162,css:"ease-in-out"},{id:"spring",label:418,css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:401,css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:402,css:"cubic-bezier(0.7, 0, 0.3, 1)"}],"cq",0,t=>t.channels.includes("glow")||t.channels.includes("fx")||!!t.colour,"e2",0,t=>t?h.get(t):void 0,"id",0,u,"sf",0,(t,e)=>t.intensity.unit?`${e(t.intensity.label)} (${t.intensity.unit})`:e(t.intensity.label),"u7",0,d])},9424(t,e,i){i.d(e,{J2:()=>h,Q2:()=>z,Sd:()=>q,TD:()=>y,Tk:()=>j,Ur:()=>A,WC:()=>W,f8:()=>w,p4:()=>E,uO:()=>O,x_:()=>S});var n=i(3925),o=i(757),r=i(5816),s=i(2641),a=i(3664),c=i(7050),l=i(3920),d=i(4722),u=i(9486);const h=["icon","button","light","weather"],m=["animation_preset","animation_target","animation_speed","animation_trigger","animation_state","animation_color"],p={slow:1.6,normal:1,fast:.6},f=["normal","reverse","alternate","alternate-reverse"],g=t=>"string"==typeof t&&""!==t.trim()?t.trim():void 0;function y(t){if("number"==typeof t&&Number.isFinite(t)&&t>=0)return+t.toFixed(3)+"s";const e=g(t);return e?/^\d*\.?\d+$/.test(e)?+(+e).toFixed(3)+"s":/^\d*\.?\d+m?s$/.test(e)?e:void 0:void 0}const v=t=>t.endsWith("ms")?parseFloat(t)/1e3:parseFloat(t);function b(t){const e=g(t);if(!e)return;const i=s.Z4.find(t=>t.id===e);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(e)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(e)?e:void 0}const _=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function w(t){const e=g(t);if(!e||!/^[#\w\s(),.%+*/-]+$/.test(e)||e.includes("/*")||e.includes("*/"))return;let i=0;for(const t of e)if("("===t)i++;else if(")"===t&&--i<0)return;if(0!==i)return;const n=e.match(/\(/g)?.length??0,o=[...e.matchAll(/([a-z-]+)\s*\(/gi)];return o.length!==n||o.some(t=>!_.has(t[1].toLowerCase()))?void 0:e}function x(t){if("infinite"===t)return"infinite";const e="string"==typeof t?Number(t):t;return"number"==typeof e&&Number.isFinite(e)&&e>0?String(+e.toFixed(2)):void 0}function $(t,e){const i="string"==typeof e?Number(e):e;return"number"==typeof i&&Number.isFinite(i)?Math.min(t.intensity.max,Math.max(t.intensity.min,i)):t.defaults.intensity}function k(t){const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?Math.min(100,Math.max(0,e)):void 0}function M(t){if(t.seasonal)return{intensity:t.defaults.intensity};const{duration:e,delay:i,easing:n,iterations:o,direction:r,intensity:a}=t.defaults;return{duration:e,delay:i,easing:n,iterations:o,direction:r,intensity:a,...(0,s.cq)(t)?{strength:100}:{}}}function S(t,e){const i=(0,s.e2)(t)??s.u7[0];return{id:e,preset:i.id,target:"module",trigger:i.trigger??"always",...M(i)}}function A(t,e){if((0,l.Bl)(e))return function(t,e){const i={...t,preset:e};for(const t of C)delete i[t];"tap"===i.trigger&&"tap"===(0,s.e2)(t.preset)?.trigger&&(i.trigger="always");return i}(t,e);const i=(0,s.e2)(e);if(!i)return{...t,preset:e};const{strength:n,...o}=t;if(i.seasonal)for(const t of["duration","delay","easing","iterations","direction"])delete o[t];else delete o.decorations;return{...o,preset:i.id,...M(i),...i.trigger?{trigger:i.trigger}:{}}}const C=["duration","delay","easing","iterations","direction","intensity","strength","decorations","target"];const z=t=>A(t,t.preset);function q(t){if(!t)return[];if(Array.isArray(t.animations))return t.animations.filter(t=>!!t&&"object"==typeof t&&!!g(t.preset)).map((t,e)=>g(t.id)?t:{...t,id:`anim-${e}`});const e=g(t.animation_preset);if(!e)return[];const i=(0,s.e2)(e),n={id:"legacy",preset:e};if(t.animation_target&&(n.target=t.animation_target),t.animation_trigger&&(n.trigger=t.animation_trigger),t.animation_state&&(n.state=t.animation_state),t.animation_color&&(n.color=t.animation_color),!i)return[n];const o=M(i),r=p[t.animation_speed||"normal"]??1;return[{...n,...o,duration:+(v(o.duration)*r).toFixed(3)+"s"}]}function j(t){const e={animations:t.length?t:void 0};for(const t of m)e[t]=void 0;return e}function E(t,e,i){const o=g(t.trigger_entity);switch(o&&(e=i?.[o]),t.trigger){case"entity_on":return(0,n.mu)(e);case"state":{const i=(t.state||"").trim();return!!i&&!!e&&e.state===i}default:return!0}}const T={rotate:507,translate:506,scale:508,opacity:505,filter:503,"box-shadow":504};function P(t,e){return t.flatMap(t=>"fx"===t?[]:"glow"===t?[e?"filter":"box-shadow"]:[t])}const N=(t,e)=>e&&"icon"===t.target;function O(t,e={}){const i=!1!==e.allowIcon;return t.map((e,n)=>{const o=(0,s.e2)(e.preset);if(!o)return;const r=P(o.channels,N(e,i));for(let a=n-1;a>=0;a--){const n=(0,s.e2)(t[a].preset);if(!n||N(t[a],i)!==N(e,i))continue;const c=P(n.channels,N(t[a],i)).find(t=>r.includes(t));if(!c)continue;const l=o.channels.includes("glow")||n.channels.includes("glow"),d="filter"===c&&l?T["box-shadow"]:T[c];return{name:n.name,what:d}}})}function R(t,e,i,n){if("weather"===t.seasonal){const t=g(e.trigger_entity),o=t?.startsWith("weather.")?n?.[t]:i;return o?.entity_id?.startsWith("weather.")?(0,r.J4)(o.state):void 0}if("daynight"===t.seasonal){const t=n?.["sun.sun"],e=t?.attributes?.elevation;return(0,r.p5)(t?.state,"number"==typeof e?e:"string"==typeof e&&""!==e.trim()?Number(e):void 0)}return t.seasonal}const L=.618034;function D(t){return Array.from({length:t},(e,i)=>{const n=60/t*(i*L%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/t*100+n)).toFixed(1),phase:+(i*L%1).toFixed(3),k:t>1?+(i/t).toFixed(3):0}})}function W(t,e,i={}){t=(0,o.ID)(t);const r=!1!==i.allowIcon,a={m:[],i:[],mi:[],t:[]},c=[],d={},u=[],h=[],m=[],p={need:!1,p:!1};for(let n of q(t)){if((0,l.Bl)(n.preset)){const t=i.custom?.((0,l._R)(n.preset));if(!t||!E(n,e,i.states))continue;const o=I(t,n,{lists:a,vars:c,origins:d,fx:u,seq:h,v2:m,allowIcon:r,runtime:p,custom:i.custom,stateObj:e,states:i.states});if(!o)continue;n=o}const t=(0,s.e2)(n.preset);if(!t||!E(n,e,i.states))continue;const o=t.defaults,g=y(n.duration)??o.duration,v=y(n.delay)??o.delay,_="tap"===n.trigger;let M=x(n.iterations)??x(o.iterations);_&&"infinite"===M&&(M="1");const S=`${b(n.easing)??b(o.easing)} ${v} ${M} ${f.includes(n.direction)?n.direction:o.direction}`,A=`${g} ${S}`,C=[`--mca-${t.id}-i: ${$(t,n.intensity)}`],z=w(n.color);z&&C.push(`--mca-${t.id}-c: ${z}`);const q=(0,s.cq)(t)?k(n.strength):void 0;if(void 0!==q&&100!==q&&C.push(`--mca-${t.id}-s: ${+(q/100).toFixed(3)}`),t.seasonal){const o=R(t,n,e,i.states);if(!o)continue;u.push({preset:t.id,front:!1,style:void 0!==q&&100!==q?"opacity: "+ +(q/100).toFixed(3):"",particles:[],seasonal:{scenes:[o],intensity:$(t,n.intensity)/100,decorations:!1!==n.decorations}});continue}if(t.ring){u.push({preset:t.id,front:!0,style:C.join("; "),particles:[],..._?{tap:_}:{},ring:B(t,n,g,S,q)});continue}if(void 0!==t.particles){const e="count"===t.particles?Math.min(12,Math.round($(t,n.intensity))):t.particles;u.push({preset:t.id,front:!!t.front,style:[`--mc-fx-anim: mc-anim-${t.id} ${A}`,`--mc-fx-dur: ${g}`,`--mc-fx-delay: ${v}`,...C].join("; "),particles:D(Math.max(1,e)),..._?{tap:_}:{}});continue}if(c.push(...C),_){a.t.push(`mc-anim-${t.id} ${A}`),t.origin&&!d.m&&(d.m=t.origin);continue}const j=N(n,r);a.mi.push(`mc-anim-${t.id} ${A}`),j?(a.i.push(`mc-anim-${t.id}${t.iconKeyframes?"-icon":""} ${A}`),t.origin&&!d.i&&(d.i=t.origin)):(a.m.push(`mc-anim-${t.id} ${A}`),t.origin&&!d.m&&(d.m=t.origin))}if(!(a.mi.length||a.t.length||u.length||h.length||p.need))return;const g=[];a.m.length&&g.push(`--mc-anim-m: ${a.m.join(", ")}`),a.t.length&&g.push(`--mc-anim-t: ${a.t.join(", ")}`),a.i.length&&g.push(`--mc-anim-i: ${a.i.join(", ")}`,`--mc-anim-mi: ${a.mi.join(", ")}`),d.m&&g.push(`--mc-anim-om: ${d.m}`),d.i&&g.push(`--mc-anim-oi: ${d.i}`),g.push(...function(t){const e=new Map;for(const i of t){const t=i.slice(0,i.indexOf(":"));e.delete(t),e.set(t,i)}return[...e.values()]}(c));const v=w(t?.color)??w((0,n.id)(e));v&&g.push(`--mc-anim-color: ${v}`);const _=[a.m.length?"module":"",a.i.length?"icon":""].filter(Boolean).join(" ");return{..._?{targets:_}:{},style:g.join("; "),fx:u,...a.t.length?{tap:!0}:{},...h.length?{seq:h.join(" ")}:{},...p.need?{needsRuntime:!0}:{},...p.p?{needsParticles:!0}:{},...m.length?{v2:m,run:[...new Set(m.map(t=>t.run))].join(" ")}:{}}}function I(t,e,i){const o=(0,a.UC)(t,{lookup:i.custom}),r=x(t.iterations)??"infinite",s="tap"===e.trigger,h=y(e.duration)??`${t.duration}s`,m=y(e.delay)??"0s";let p=x(e.iterations)??r;s&&"infinite"===p&&(p="1");const g=f.includes(e.direction)?e.direction:t.direction??"normal",_=`${b(e.easing)??b(t.easing)??"ease"} ${m} ${p} ${g}`,$=i.allowIcon&&("icon"===e.target||!e.target&&"icon"===o.motion?.target);let M;if((0,l.oC)(t)&&(i.runtime.need=!0,o.v2)){const r="string"==typeof e.entity&&e.entity?e.entity:void 0,s=r?i.states?.[r]:i.stateObj,l=r??i.stateObj?.entity_id,d=o.name||(0,a.iZ)(t),u=(0,c.PT)()?.resolveHints(o.v2,{stateObj:s,states:i.states,run:d,timing:`${h} ${_}`,icon:i.allowIcon&&"module"!==e.target,active:(0,n.mu)(s)})??{};M=u.clip?.animation,i.v2.push({run:d,docId:t.id,v2:M?{...o.v2,tracks:[]}:o.v2,timing:`${h} ${_}`,icon:$,...l?{entityId:l}:{},...s?{stateObj:s}:{},hints:u})}if(M){if("none"===M)return;const n={...e,preset:M,target:$?"icon":e.target};for(const t of["duration","delay","easing","iterations","direction"])delete n[t];if(!(0,l.Bl)(M))return n;const o=i.custom?.((0,l._R)(M));return o&&o!==t?I(o,n,i):void 0}if(o.preset)return{...e,preset:o.preset.id,intensity:e.intensity??o.preset.intensity,duration:e.duration??`${t.duration}s`,easing:e.easing??t.easing,iterations:e.iterations??("infinite"===r?"infinite":Number(r)),direction:e.direction??t.direction};if(o.schedule){const t=o.schedule,n=y(e.duration),r=n&&t.total>0?v(n)/t.total:1,s="number"==typeof e.iterations&&e.iterations>0?Math.round(e.iterations):void 0;return void(t.steps.length&&i.seq.push((0,u.$d)({...t,delay:v(m),scale:r,...s?{cycles:s}:{}})))}const S=[],A="number"==typeof e.intensity&&Number.isFinite(e.intensity)?e.intensity:void 0;void 0!==A&&100!==A&&S.push(`${(0,a.er)(t.id,"i")}: ${+(A/100).toFixed(3)}`);const C=w(e.color);C&&S.push(`${(0,a.er)(t.id,"c")}: ${C}`);const z=k(e.strength);if(void 0!==z&&100!==z&&S.push(`${(0,a.er)(t.id,"s")}: ${+(z/100).toFixed(3)}`),(0,d.XF)(t.id,o.name,o.css),o.layer){(o.sim||o.needsParticles)&&(i.runtime.p=!0);const t=+(v(h)/o.layer.speed).toFixed(3)+"s";for(const[e,n,r]of[[o.name,o.layer,o.sim],...o.split?[[o.split.name,o.split.layer,o.split.sim]]:[]])i.fx.push({preset:e,front:n.front,style:[`--mc-fx-anim: ${e} ${t} ${_}`,`--mc-fx-dur: ${t}`,`--mc-fx-delay: ${m}`,...S].join("; "),particles:n.particles,...n.symbol?{symbol:n.symbol}:{},sim:r,...s?{tap:s}:{}});return}if(!o.motion)return;const q=[o.name,...o.lanes??[]].map(t=>`${t} ${h} ${_}`).join(", "),j="center"!==o.motion.origin?o.motion.origin:void 0;if(i.vars.push(...S),s)return i.lists.t.push(q),void(j&&!i.origins.m&&(i.origins.m=j));i.lists.mi.push(q),$?(i.lists.i.push(q),j&&!i.origins.i&&(i.origins.i=j)):(i.lists.m.push(q),j&&!i.origins.m&&(i.origins.m=j))}function B(t,e,i,n,o){return{mode:"animated",fill:1,animation:t.ring,color:w(e.color)??"var(--mc-anim-c)",width:$(t,e.intensity),linecap:"dashes"===t.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==o&&100!==o?{opacity:+(o/100).toFixed(3)}:{}}}},1235(t,e,i){i.d(e,{t:()=>o});const n="2026.10.11-beta.2";function o(t,e){if(e?.BUILD===n)return e;console.warn(`Magic Card was updated, reload the page (magic-card.js ${n}, ${t} ${String(e?.BUILD)}).`)}i.d(e,["Q",0,n])},4334(t,e,i){i.d(e,{IC:()=>s,_Y:()=>a,cy:()=>r});var n=i(2675);let o=null;function r(){const t=window.loadCardHelpers;if("function"==typeof t)return o||(o=Promise.resolve(t()).catch(t=>{throw o=null,t})),o}function s(t){if(customElements.get(t))return Promise.resolve();let e;return Promise.race([customElements.whenDefined(t),new Promise((i,o)=>{e=setTimeout(()=>o(new Error((0,n.t)(59,{tag:t}))),5e3)})]).finally(()=>clearTimeout(e))}function a(t){const e=t=>Array.isArray(t)?t.map(e):t&&"object"==typeof t?Object.fromEntries(Object.keys(t).sort().map(i=>[i,e(t[i])])):t;return JSON.stringify(e(t))??""}i.d(e,["k2",0,(t,e)=>({...e||{},type:t})])},4240(t,e,i){function n(t,e){if(void 0===t||!Number.isFinite(t)||!Array.isArray(e))return;let i;for(const n of e){if(!n||"string"!=typeof n.color||!n.color)continue;const e=Number(n.from);!Number.isFinite(e)||t<e||(void 0!==n.to&&null!==n.to&&Number.isFinite(Number(n.to))&&t>Number(n.to)||(!i||e>Number(i.from))&&(i=n))}return i?.color}i.d(e,{r:()=>n})},8590(t,e,i){i.d(e,{$t:()=>d,C6:()=>s,Hi:()=>m,JR:()=>u,M0:()=>c,SU:()=>a,U$:()=>h,W8:()=>r,gp:()=>l});var n=i(757);const o=/^((?:\d+\.?\d*|\.\d+))(fr|%|px)$/;function r(t){if("number"==typeof t)return Number.isFinite(t)&&t>0?`${t}fr`:null;if("string"!=typeof t)return null;const e=t.trim().toLowerCase();if("auto"===e)return"auto";const i=e.match(o);if(!i)return null;const n=Number(i[1]);return!Number.isFinite(n)||n<0||"fr"===i[2]&&0===n?null:`${n}${i[2]}`}function s(t){const e=r(t)??"1fr";if("auto"===e)return{value:0,unit:"auto"};const i=e.match(o);return{value:Number(i[1]),unit:i[2]}}function a(t){return Array.isArray(t?.column_widths)&&t.column_widths.length>0}function c(t,e){const i=Array.isArray(t)?t:[];return Array.from({length:Math.max(e,1)},(t,e)=>r(i[e])??"1fr")}function l(t,e){return c(t,e).join(" ")}function d(t,e){const i=t.columns?.length||1;return a(t)?l(t.column_widths,i):(0,n.aA)(t.layout||e,i)}function u(t){const e=t.columns?.length||1;return a(t)?c(t.column_widths,e):function(t,e){if(!t||/^\d+(?:-\d+)*$/.test(t))return null;const i=t.trim().split(/\s+/).map(r);return i.length===e&&i.every(t=>null!==t)?i:null}(t.layout,e)??function(t,e){if(t&&/^\d+(?:-\d+)*$/.test(t)){const i=t.split("-").map(t=>Math.max(Number(t)||1,1));if(i.length===e)return i}return Array.from({length:Math.max(e,1)},()=>1)}(t.layout,e).map(t=>`${t}fr`)}function h(t,e=360){const i=t.map(s);if(i.every(t=>"fr"===t.unit))return i.map(t=>t.value);let n=0,o=0;for(const t of i)"px"===t.unit?n+=t.value:"%"===t.unit?n+=t.value/100*e:o+="fr"===t.unit?t.value:1;const r=o>0?Math.max(e-n,.1*e*o)/o:0;return i.map(t=>{const i="px"===t.unit?t.value:"%"===t.unit?t.value/100*e:("fr"===t.unit?t.value:1)*r;return Math.max(i,.02*e)})}function m(t,e,i){const n=Math.max(e.split("-").length,1);for(;t.columns.length<n;)t.columns.push(i());for(;t.columns.length>n;){const e=t.columns.pop(),i=t.columns[t.columns.length-1];i.modules=[...i.modules||[],...e.modules||[]]}t.layout=e,delete t.column_widths}},9095(t,e,i){i.d(e,["Kd",0,"var(--mc-gap)","Mp",0,"magic-card","cq",0,["content","controls","layout","advanced"],"d5",0,"Magic Card","uh",0,"A fully open-source multi-module card with advanced editor","z",0,"magic-card-editor"])},2699(t,e,i){i.d(e,{$q:()=>m,I7:()=>h,iI:()=>l});var n=i(1380);function o(t,e,i,n,o){return{key:t,cssProperty:e,label:i,type:n,...o?{options:o}:{}}}function r(t,e,i,n={}){return{key:t,cssProperty:"",label:e,type:i,virtual:!0,...n}}const s=[{id:"spacing",name:412,icon:"mdi:arrow-expand-all",leading:["padding","margin","width","min_height"],properties:[o("margin","margin",272,"box"),o("padding","padding",317,"box"),o("width","width",492,"unit"),o("height","height",224,"unit"),o("min_width","min-width",279,"unit"),o("min_height","min-height",278,"unit"),o("max_width","max-width",276,"unit"),o("max_height","max-height",275,"unit"),o("box_sizing","box-sizing",80,"select",n.ai)]},{id:"borders",name:75,icon:"mdi:border-all",leading:["border_radius","border_width","border_style","border_color","border_length","border_length_align","border_length_sides","box_shadow"],properties:[o("border","border",60,"text"),o("border_top","border-top",71,"text"),o("border_right","border-right",67,"text"),o("border_bottom","border-bottom",61,"text"),o("border_left","border-left",64,"text"),o("border_width","border-width",72,"unit"),{...o("border_style","border-style",70,"select",n.cx),emptyLabel:407},o("border_color","border-color",63,"color"),r("border_length",65,"unit",{units:["%","px"],help:392}),r("border_length_align",15,"segmented",{defaultValue:"center",options:[{label:424,value:"start"},{label:93,value:"center"},{label:168,value:"end"}]}),r("border_length_sides",393,"select",{emptyLabel:16,options:[{label:459,value:"top"},{label:358,value:"right"},{label:77,value:"bottom"},{label:249,value:"left"}]}),o("border_radius","border-radius",66,"box"),o("outline","outline",304,"text"),o("outline_width","outline-width",308,"unit"),o("outline_style","outline-style",307,"select",n.KV),o("outline_color","outline-color",305,"color"),o("outline_offset","outline-offset",306,"unit"),o("box_shadow","box-shadow",79,"text")]},{id:"shape",name:389,icon:"mdi:hexagon-outline",properties:[r("shape",389,"shape")]},{id:"value-background",name:478,icon:"mdi:chart-areaspline-variant",properties:[r("value_background",478,"value_bg")]},{id:"positioning",name:332,icon:"mdi:page-layout-body",properties:[o("position","position",331,"select",n.lQ),o("top","top",459,"unit"),o("right","right",358,"unit"),o("bottom","bottom",77,"unit"),o("left","left",249,"unit"),o("inset","inset",236,"unit"),o("display","display",131,"select",n.iQ),o("visibility","visibility",482,"select",n.GE),o("opacity","opacity",300,"text"),o("z_index","z-index",502,"number"),o("overflow","overflow",311,"select",n.Oz),o("overflow_x","overflow-x",312,"select",n.Oz),o("overflow_y","overflow-y",313,"select",n.Oz),o("float","float",194,"select",[{label:292,value:"none"},{label:249,value:"left"},{label:358,value:"right"}]),o("clear","clear",97,"select",[{label:292,value:"none"},{label:249,value:"left"},{label:358,value:"right"},{label:76,value:"both"}]),o("cursor","cursor",118,"select",n.il),o("pointer_events","pointer-events",328,"select",[{label:34,value:"auto"},{label:292,value:"none"}])]},{id:"typography",name:472,icon:"mdi:format-font",leading:["color","font_family","font_weight","font_size","text_transform"],properties:[o("font_family","font-family",197,"font"),o("font_size","font-size",198,"unit"),o("font_weight","font-weight",201,"select",n.uE),o("font_style","font-style",199,"select",n.zp),o("font_variant","font-variant",200,"text"),o("color","color",105,"color"),o("text_align","text-align",451,"select",n.hx),o("text_decoration","text-decoration",452,"select",n.Ad),o("text_transform","text-transform",456,"select",n.Yd),o("text_indent","text-indent",453,"unit"),o("text_overflow","text-overflow",454,"select",n.wR),o("text_shadow","text-shadow",455,"text"),o("line_height","line-height",257,"text"),o("letter_spacing","letter-spacing",250,"unit"),o("word_spacing","word-spacing",499,"unit"),o("white_space","white-space",491,"select",n.i3),o("word_break","word-break",498,"select",n.gj),o("overflow_wrap","overflow-wrap",314,"select",n.DE)]},{id:"backgrounds",name:49,icon:"mdi:image-area",properties:[o("background","background",40,"text"),o("background_color","background-color",43,"color"),o("background_image","background-image",44,"image"),o("background_position","background-position",46,"text"),o("background_size","background-size",48,"select",n.VC),o("background_repeat","background-repeat",47,"select",n.PU),o("background_attachment","background-attachment",41,"select",n.x2),o("background_clip","background-clip",42,"select",n.em),o("background_origin","background-origin",45,"select",n.em),o("backdrop_filter","backdrop-filter",39,"text")]},{id:"flexbox",name:190,icon:"mdi:view-column",properties:[o("flex_direction","flex-direction",129,"select",n.px),o("flex_wrap","flex-wrap",500,"select",n.g2),o("justify_content","justify-content",245,"select",n.or),o("align_items","align-items",13,"select",n.qw),o("align_content","align-content",12,"select",n.tl),o("gap","gap",204,"unit"),o("row_gap","row-gap",371,"unit"),o("column_gap","column-gap",109,"unit"),o("flex","flex",184,"text"),o("flex_grow","flex-grow",186,"number"),o("flex_shrink","flex-shrink",187,"number"),o("flex_basis","flex-basis",185,"unit"),o("align_self","align-self",14,"select",n.Un),o("order","order",303,"number")]},{id:"grid",name:89,icon:"mdi:grid",properties:[o("grid_template_columns","grid-template-columns",448,"text"),o("grid_template_rows","grid-template-rows",449,"text"),o("grid_template_areas","grid-template-areas",447,"text"),o("grid_auto_columns","grid-auto-columns",35,"text"),o("grid_auto_rows","grid-auto-rows",37,"text"),o("grid_auto_flow","grid-auto-flow",36,"select",n.DN),o("grid_column","grid-column",107,"text"),o("grid_row","grid-row",369,"text"),o("grid_area","grid-area",28,"text")]},{id:"transitions",name:467,icon:"mdi:animation",leading:["animations"],properties:[r("animations",25,"animations"),o("transition","transition",462,"text"),o("transition_property","transition-property",465,"text"),{...o("transition_duration","transition-duration",464,"unit"),units:["s","ms"]},o("transition_timing_function","transition-timing-function",466,"text"),{...o("transition_delay","transition-delay",463,"unit"),units:["s","ms"]},o("transform","transform",460,"text"),o("transform_origin","transform-origin",461,"text"),o("animation_name","animation-name",23,"text"),{...o("animation_duration","animation-duration",22,"unit"),units:["s","ms"]},o("animation_timing_function","animation-timing-function",24,"text"),{...o("animation_delay","animation-delay",20,"unit"),units:["s","ms"]},o("animation_iteration_count","animation-iteration-count",242,"text"),o("animation_direction","animation-direction",21,"select",n.Ct),o("animation_fill_mode","animation-fill-mode",177,"select",n.yb),o("animation_play_state","animation-play-state",325,"select",n.xF),o("filter","filter",178,"text")]},{id:"ring",name:359,icon:"mdi:circle-double",properties:[r("ring",359,"ring")]},{id:"lists-tables",name:265,icon:"mdi:format-list-bulleted",properties:[o("list_style","list-style",261,"text"),o("list_style_type","list-style-type",264,"select",n.VB),o("list_style_position","list-style-position",263,"select",n.yD),o("list_style_image","list-style-image",262,"text"),o("border_collapse","border-collapse",62,"select",n.ce),o("border_spacing","border-spacing",69,"unit"),o("table_layout","table-layout",443,"select",n.V6),o("caption_side","caption-side",92,"select",n._0)]}],a="custom-css",c=[{id:"layout",name:248,entries:["spacing","positioning","flexbox","grid"],defaultOpen:!0},{id:"style",name:433,entries:["backgrounds","borders","typography","shape","value-background"],defaultOpen:!0},{id:"effects",name:165,entries:["ring","transitions"],defaultOpen:!1},{id:"advanced",name:11,entries:["lists-tables",a],defaultOpen:!1}];function l(t){const e=t.leading||[];return[...e.map(e=>t.properties.find(t=>t.key===e)).filter(t=>!!t),...t.properties.filter(t=>!e.includes(t.key))]}const d={margin:["top","right","bottom","left"].map(t=>({key:`margin_${t}`,cssProperty:`margin-${t}`})),padding:["top","right","bottom","left"].map(t=>({key:`padding_${t}`,cssProperty:`padding-${t}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(t=>({key:`border_${t}_radius`,cssProperty:`border-${t.replace("_","-")}-radius`}))},u={shape:["shape_options"]};function h(t){return[t,...(d[t]||[]).map(t=>t.key),...u[t]||[]]}function m(){const t={};for(const e of s)for(const i of e.properties)if(!i.virtual){t[i.key]=i.cssProperty;for(const e of d[i.key]||[])t[e.key]=e.cssProperty}return t}i.d(e,["IZ",0,s,"Qz",0,c,"Xb",0,{border_length_align:"border_length",border_length_sides:"border_length"},"Xr",0,d,"zn",0,a])},1380(t,e,i){const n=[{label:292,value:"none"},{label:406,value:"solid"},{label:120,value:"dashed"},{label:145,value:"dotted"},{label:146,value:"double"},{label:217,value:"groove"},{label:357,value:"ridge"},{label:236,value:"inset"},{label:309,value:"outset"}],o=n;i.d(e,["Ad",0,[{label:292,value:"none"},{label:473,value:"underline"},{label:315,value:"overline"},{label:258,value:"line-through"}],"Ct",0,[{label:293,value:"normal"},{label:356,value:"reverse"},{label:17,value:"alternate"},{label:18,value:"alternate-reverse"}],"DE",0,[{label:293,value:"normal"},{label:83,value:"break-word"},{label:26,value:"anywhere"}],"DN",0,[{label:369,value:"row"},{label:107,value:"column"},{label:125,value:"dense"},{label:370,value:"row dense"},{label:108,value:"column dense"}],"GE",0,[{label:483,value:"visible"},{label:225,value:"hidden"},{label:104,value:"collapse"}],"KV",0,o,"Oz",0,[{label:483,value:"visible"},{label:225,value:"hidden"},{label:379,value:"scroll"},{label:34,value:"auto"}],"PU",0,[{label:351,value:"repeat"},{label:291,value:"no-repeat"},{label:352,value:"repeat-x"},{label:353,value:"repeat-y"},{label:408,value:"space"},{label:368,value:"round"}],"Un",0,[{label:34,value:"auto"},{label:431,value:"stretch"},{label:189,value:"flex-start"},{label:188,value:"flex-end"},{label:93,value:"center"},{label:53,value:"baseline"}],"V6",0,[{label:34,value:"auto"},{label:181,value:"fixed"}],"VB",0,[{label:292,value:"none"},{label:130,value:"disc"},{label:96,value:"circle"},{label:419,value:"square"},{label:122,value:"decimal"},{label:268,value:"lower-alpha"},{label:474,value:"upper-alpha"},{label:269,value:"lower-roman"},{label:475,value:"upper-roman"}],"VC",0,[{label:34,value:"auto"},{label:116,value:"cover"},{label:113,value:"contain"}],"Yd",0,[{label:292,value:"none"},{label:476,value:"uppercase"},{label:270,value:"lowercase"},{label:91,value:"capitalize"}],"_0",0,[{label:459,value:"top"},{label:77,value:"bottom"}],"ai",0,[{label:114,value:"content-box"},{label:73,value:"border-box"}],"ce",0,[{label:382,value:"separate"},{label:104,value:"collapse"}],"cx",0,n,"em",0,[{label:73,value:"border-box"},{label:318,value:"padding-box"},{label:114,value:"content-box"}],"g2",0,[{label:295,value:"nowrap"},{label:500,value:"wrap"},{label:501,value:"wrap-reverse"}],"gj",0,[{label:293,value:"normal"},{label:81,value:"break-all"},{label:246,value:"keep-all"},{label:83,value:"break-word"}],"hx",0,[{label:249,value:"left"},{label:93,value:"center"},{label:358,value:"right"},{label:244,value:"justify"}],"i3",0,[{label:293,value:"normal"},{label:295,value:"nowrap"},{label:334,value:"pre"},{label:336,value:"pre-wrap"},{label:335,value:"pre-line"},{label:82,value:"break-spaces"}],"iQ",0,[{label:57,value:"block"},{label:232,value:"inline"},{label:233,value:"inline-block"},{label:184,value:"flex"},{label:234,value:"inline-flex"},{label:215,value:"grid"},{label:235,value:"inline-grid"},{label:292,value:"none"},{label:115,value:"contents"}],"il",0,[{label:34,value:"auto"},{label:123,value:"default"},{label:327,value:"pointer"},{label:281,value:"move"},{label:450,value:"text"},{label:485,value:"wait"},{label:117,value:"crosshair"},{label:294,value:"not-allowed"},{label:212,value:"grab"},{label:292,value:"none"}],"lQ",0,[{label:425,value:"static"},{label:349,value:"relative"},{label:10,value:"absolute"},{label:181,value:"fixed"},{label:427,value:"sticky"}],"or",0,[{label:189,value:"flex-start"},{label:188,value:"flex-end"},{label:93,value:"center"},{label:410,value:"space-between"},{label:409,value:"space-around"},{label:411,value:"space-evenly"}],"px",0,[{label:369,value:"row"},{label:372,value:"row-reverse"},{label:107,value:"column"},{label:110,value:"column-reverse"}],"qw",0,[{label:431,value:"stretch"},{label:189,value:"flex-start"},{label:188,value:"flex-end"},{label:93,value:"center"},{label:53,value:"baseline"}],"tl",0,[{label:431,value:"stretch"},{label:189,value:"flex-start"},{label:188,value:"flex-end"},{label:93,value:"center"},{label:410,value:"space-between"},{label:409,value:"space-around"}],"uE",0,[{label:293,value:"normal"},{label:59,value:"bold"},{label:0,value:"100"},{label:1,value:"200"},{label:2,value:"300"},{label:4,value:"400"},{label:5,value:"500"},{label:6,value:"600"},{label:7,value:"700"},{label:8,value:"800"},{label:9,value:"900"}],"wR",0,[{label:98,value:"clip"},{label:166,value:"ellipsis"}],"x2",0,[{label:379,value:"scroll"},{label:181,value:"fixed"},{label:267,value:"local"}],"xF",0,[{label:375,value:"running"},{label:321,value:"paused"}],"yD",0,[{label:310,value:"outside"},{label:237,value:"inside"}],"yb",0,[{label:292,value:"none"},{label:203,value:"forwards"},{label:50,value:"backwards"},{label:76,value:"both"}],"zp",0,[{label:293,value:"normal"},{label:241,value:"italic"},{label:297,value:"oblique"}]])},757(t,e,i){i.d(e,{AT:()=>Z,DA:()=>G,ID:()=>m,Q6:()=>M,Rn:()=>z,VR:()=>C,a7:()=>V,aA:()=>E,bt:()=>R,eI:()=>J,fV:()=>H,nl:()=>v,th:()=>p,zg:()=>b});var n=i(2699),o=i(213),r=i(3925),s=i(9136),a=i(7110);const c=(0,n.$q)(),l=n.IZ.flatMap(t=>t.properties).filter(t=>"color"===t.type).map(t=>t.key),d=new Set(n.IZ.flatMap(t=>t.properties).filter(t=>"image"===t.type).map(t=>t.key)),u={...Object.fromEntries(n.IZ.flatMap(t=>t.properties).filter(t=>"unit"===t.type||"box"===t.type).flatMap(t=>{const e=t.units?.includes("s")?"s":"px";return[[t.key,e],...(n.Xr[t.key]||[]).map(t=>[t.key,e])]})),border_length:"%"};function h(t){if(!t)return t;const e=t;let i;for(const[t,n]of Object.entries(e))"number"==typeof n&&(i??={...e},Number.isFinite(n)?i[t]=`${n}${u[t]??""}`:delete i[t]);return i??t}function m(t){if(!t)return t;const e=t;let i;for(const t of l){const n=(0,r.a0)(e[t]);n&&((i??={...e})[t]=n)}return Array.isArray(e.animations)&&e.animations.some(t=>(0,r.ls)(t?.color))&&((i??={...e}).animations=e.animations.map(t=>(0,r.ls)(t?.color)?{...t,color:(0,r.a0)(t.color)}:t)),i??t}function p(t){if(!t)return!1;const e=t;if(l.some(t=>(0,r.ls)(e[t])))return!0;if(Array.isArray(e.animations)&&e.animations.some(t=>(0,r.ls)(t?.color)))return!0;const i=e.ring;return!(!i||!(0,r.ls)(i.color)&&!(0,r.ls)(i.track_color))||(!(!e.hover||!p(e.hover))||Array.isArray(e.conditional)&&e.conditional.some(t=>p(t?.design)))}const f=["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color"],g={w:"0",s:"none",c:"currentColor"},y=new Set([...f,"box_shadow"]);function v(t,e){return"dropdown"===t?{w:"1px",s:"solid",c:"var(--mc-border)"}:"button"===t?"outline"===e?{w:"1px",s:"solid",c:"var(--mc-button-color)"}:g:void 0}function b(t,e){if(!t)return"";const i=m(h(t)),n=[],o=i,r=(0,s.w)(i.color)?.stops[0];for(const[t,i]of Object.entries(c)){if(e&&y.has(t))continue;let s=r&&"color"===t?r:o[t];"string"==typeof s&&d.has(t)&&(s=(0,a.zi)(void 0,s)),void 0!==s&&"string"==typeof s&&""!==s&&n.push(`${i}: ${s}`)}const l=e?void 0:function(t){if(x(t.border_style))return;const e=B(t);if(!T.some(t=>e[t].widthSet&&!e[t].styleSet))return;const i=T.map(t=>e[t].style);return i.every(t=>t===i[0])?i[0]:i.join(" ")}(o);l&&n.push(`border-style: ${l}`),"string"==typeof i.color&&""!==i.color&&(n.push(`--mc-design-color: ${r??i.color}`),r&&n.push(`--mc-text-paint: ${i.color}`),n.push("--icon-primary-color: currentColor"));const u=function(t){const e={},i=x(t.border_radius);if(i){const t=i.indexOf("/"),n=$(t>=0?i.slice(0,t):i),o=t>=0?$(i.slice(t+1)):[];if(n.length){const t=k(n),i=o.length?k(o):void 0;_.forEach((n,o)=>e[n]=i?`${t[o]} ${i[o]}`:t[o])}}for(const i of _){const n=x(t[w[i]]);n&&(e[i]=n)}return e}(o);for(const t of _)u[t]&&n.push(`--mc-design-radius-${t}: ${u[t]}`);const p=x(o.background_color)??x(o.background);if(p&&n.push(`--mc-design-bg: ${p}`),e){n.push(...function(t,e){if(!f.some(e=>x(t[e])))return[];const i=e.base?{...m(h(e.base)),...t}:t,n=x(i.border),o=t=>{const e=I(t);return{width:e.width,style:e.style,color:e.color}},r=Object.fromEntries(T.map(t=>[t,n?o(n):{}]));for(const t of T){const e=x(i[`border_${t}`]);e&&(r[t]=o(e))}const s=(t,e,n=t=>t)=>{const o=x(i[t]);o&&W(o).forEach((t,i)=>r[T[i]][e]=n(t))};s("border_width","width",D),s("border_style","style",t=>t.toLowerCase()),s("border_color","color");for(const t of T)void 0!==r[t].width&&void 0===r[t].style&&(r[t].style="solid");const a=(t,e)=>T.map(i=>r[i][t]??e).join(" ");return[`--mc-design-bw: ${a("width",e.w)}`,`--mc-design-bs: ${a("style",e.s)}`,`--mc-design-bc: ${a("color",e.c)}`]}(o,e));const t=x(o.box_shadow);t&&n.push(`--mc-design-shadow: ${t}`)}return i.css&&n.push(i.css),n.join("; ")}const _=["tl","tr","br","bl"],w={tl:"border_top_left_radius",tr:"border_top_right_radius",br:"border_bottom_right_radius",bl:"border_bottom_left_radius"};function x(t){return"string"==typeof t&&""!==t.trim()?t.trim():void 0}function $(t){const e=[];let i=0,n="";for(const o of t)"("===o?i++:")"===o&&(i=Math.max(0,i-1)),/\s/.test(o)&&0===i?(n&&e.push(n),n=""):n+=o;return n&&e.push(n),e}function k(t){const[e,i=e,n=e,o=i]=t;return[e,i,n,o]}function M(t){const e=[];let i=0,n="",o="";for(const r of t){if(n)r===n&&(n="");else if('"'===r||"'"===r)n=r;else if("("===r)i++;else if(")"===r)i=Math.max(0,i-1);else if(";"===r&&0===i){o.trim()&&e.push(o.trim()),o="";continue}o+=r}return o.trim()&&e.push(o.trim()),e}const S=t=>/!important\s*$/i.test(t)?t:`${t} !important`,A=t=>t.replace(/[{}@]/g,"");function C(t,e,i={}){if(!e||"object"!=typeof e)return"";const n=M(A(b(e,i.control))).filter(t=>t.includes(":")).map(S);if(!n.length)return"";const o=`[data-mc-hover="${t.replace(/["\\]/g,"\\$&")}"]:hover`,r=m(h(e))||{},s=x(r.border_color)&&A(x(r.border_color).replace(/;/g,"")),a=[],{shape:c,borderLength:l}=i;if(c){const t={...c.design||{},...e};n.push(...M(G(t,c.padding)).map(S)),s&&a.push(`${o} ${c.card?"~":">"} mc-shape { --mc-shape-stroke: ${s}; }`);const i=x(r.box_shadow);if(i){const t=A(V(i)??"none");a.push(`.mc-shape-shadow:has(> ${c.card?"ha-card > ":""}${o}) { filter: ${t} !important; }`)}}else l&&(n.push(...M(l.style).map(S)),s&&a.push(`${o} > .mc-border-fx > i { border-color: ${s} !important; }`));return[`${o} { ${n.join("; ")}; }`,...a].join(" ")}function z(t,e,i){if(!t?.conditional?.length||!e)return t;const{conditional:n,...r}=t,s={...r};for(const t of n){if(!t||!Array.isArray(t.conditions))continue;const n=t.conditions.map(t=>t&&!1!==t.use_module_entity&&i&&!t.entity?{...t,entity:i}:t);if(o.g.ruleMatches({conditions:n,mode:t.mode},e)){const e=t.design||{};for(const[t,i]of Object.entries(e))void 0!==i&&(s[t]=i)}}return s}function q(t){return Array.from({length:Math.max(t,1)},()=>"1fr").join(" ")}function j(t){return/^\d+(?:-\d+)*$/.test(t)?t.split("-").length:null}function E(t,e){if(!t)return q(e??1);const i={1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"};if(i[t])return e&&j(t)&&j(t)!==e?q(e):i[t];if(/^\d+(?:-\d+)+$/.test(t)){const i=t.split("-").length;return e&&i!==e?q(e):t.split("-").map(t=>`${Math.max(Number(t)||1,1)}fr`).join(" ")}return t}const T=["top","right","bottom","left"],P=new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]),N={thin:"1px",medium:"3px",thick:"5px"},O={start:"0",center:"0.5",end:"1"},R="2px",L=t=>/^(-?[\d.]+[a-z%]*|thin|medium|thick|(calc|min|max|clamp)\(.*\))$/i.test(t),D=t=>N[t.toLowerCase()]??t;function W(t){const[e,i=e,n=e,o=i]=$(t);return[e,i,n,o]}function I(t){const e={width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1},i=[];for(const n of $(t))P.has(n.toLowerCase())?(e.style=n.toLowerCase(),e.styleSet=!0):L(n)?(e.width=D(n),e.widthSet=!0):i.push(n);return i.length&&(e.color=i.join(" ")),e}function B(t){const e=x(t.border),i=Object.fromEntries(T.map(t=>[t,e?I(e):{width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1}]));for(const e of T){const n=x(t[`border_${e}`]);n&&(i[e]=I(n))}const n=(e,n,o=t=>t)=>{const r=x(t[e]);r&&W(r).forEach((t,e)=>{const r=i[T[e]];r[n]=o(t),"width"===n&&(r.widthSet=!0),"style"===n&&(r.styleSet=!0)})};n("border_width","width",D),n("border_style","style",t=>t.toLowerCase()),n("border_color","color");for(const t of T)i[t].widthSet&&!i[t].styleSet&&(i[t].style="solid");return i}const F=t=>"none"!==t.style&&"hidden"!==t.style&&!/^0+(\.0+)?[a-z%]*$/i.test(t.width);function U(t){const e=x(t.border_length);if(!e||"100%"===e)return;const i=B(t),n=x(t.border_length_sides),o=n&&T.includes(n)?[n]:T,r=t=>i[t].widthSet||i[t].styleSet,s=new Set(o.filter(t=>!r(t)&&(n||!T.some(r))));for(const t of s)Object.assign(i[t],{width:R,style:"solid"});const a=o.filter(t=>F(i[t]));return a.length?{length:e,sides:i,drawn:a,defaulted:s,hasBorder:r}:void 0}function H(t){const e=m(h(t))||{},i=U(e);if(!i)return;const{length:n,sides:o,drawn:r,defaulted:s,hasBorder:a}=i,c=O[x(e.border_length_align)??"center"]??"0.5",l=`min(${n}, 100%)`,d=`calc((100% - ${l}) * ${c})`,u=`calc((100% - ${l}) * ${c} + ${l})`,p=r.map(t=>{const e=o[t],i=`linear-gradient(${"top"===t||"bottom"===t?"to right":"to bottom"}, transparent ${d}, #000 ${d}, #000 ${u}, transparent ${u})`;return{side:t,style:`inset: 0; border-radius: inherit; border-${t}: ${e.width} ${e.style} ${e.color}; -webkit-mask-image: ${i}; mask-image: ${i}`}}),f=t=>(t=>s.has(t)||a(t)&&"none"!==o[t].style&&"hidden"!==o[t].style)(t)?o[t].width:"0px",g=`${T.map(t=>`${t}: calc(-1 * ${f(t)})`).join("; ")}; border-radius: inherit`,y=[...[...s].map(t=>`border-${t}-width: ${o[t].width}; border-${t}-style: solid`),"border-color: transparent"],v=[e.overflow,e.overflow_x,e.overflow_y].map(t=>x(t)).filter(Boolean);if(v.length&&v.every(t=>"hidden"===t||"clip"===t)){const t=[...new Set(r.map(t=>o[t].width))],e=t.every(t=>/^[\d.]+px$/.test(t))?`${Math.max(...t.map(t=>parseFloat(t)))}px`:1===t.length?t[0]:`max(${t.join(", ")})`;y.push("overflow: clip",`overflow-clip-margin: ${e}`)}return{style:y.join("; "),overlayStyle:g,lines:p}}function J(t){const e=m(h(t))||{},i=U(e),n=i?.sides??B(e),o=i?.drawn??T.filter(t=>(n[t].widthSet||n[t].styleSet)&&F(n[t]));if(!o.length)return;const r=n[o[0]],s="dashed"===r.style||"dotted"===r.style?r.style:"solid",a={width:r.width,style:s,color:r.color},c=x(e.border_length_align);return(i||o.length<4)&&(a.length={value:i?.length??"100%",align:"start"===c||"end"===c?c:"center",sides:o}),a}function V(t){const e=x(t);if(!e)return;let i=0,n="";for(const t of e){if("("===t?i++:")"===t&&(i=Math.max(0,i-1)),","===t&&0===i)break;n+=t}const o=$(n.trim());if(!o.length||o.some(t=>/^(inset|none)$/i.test(t)))return;const r=t=>/^-?[\d.]+(px|em|rem|%)?$/i.test(t)||/^(calc|min|max|clamp)\(/i.test(t),s=o.filter(r),a=o.filter(t=>!r(t)).join(" ");if(s.length<2)return;const c=t=>/^-?[\d.]+$/.test(t)?`${t}px`:t;return`drop-shadow(${c(s[0])} ${c(s[1])} ${c(s[2]??"0")}${a?` ${a}`:""})`}function G(t,e,i){return["border-color: transparent","box-shadow: none",Z(t,e,{shape:!0,min:i})].join("; ")}function Z(t,e,i){const n=t||{},o=t=>"number"==typeof t&&Number.isFinite(t)?String(t):x(t),r=W(o(n.padding)??x(e)??"0px");T.forEach((t,e)=>{r[e]=o(n[`padding_${t}`])??r[e]});for(const t of(x(n.css)??"").split(";")){const e=/^\s*(padding(?:-(top|right|bottom|left))?)\s*:\s*(.+?)\s*(?:!important)?\s*$/i.exec(t);e&&(e[2]?r[T.indexOf(e[2].toLowerCase())]=e[3]:W(e[3]).forEach((t,e)=>r[e]=t))}const s=["it","ir","ib","il"];return T.map((t,e)=>{const n=[(o=r[e],/^-?(\d+\.?\d*|\.\d+)$/.test(o)?`${o}px`:o)];var o;return i.shape&&n.push(`var(--mc-shape-${s[e]}, 0px)`),i.min?.[e]&&n.push(`${i.min[e]}px`),`padding-${t}: max(${n.join(", ")})`}).join("; ")}},3251(t,e,i){i.d(e,{B:()=>r,Gd:()=>o,ux:()=>s});var n=i(3920);function o(t){const e=new Set,i=t=>{if(Array.isArray(t))t.forEach(i);else if(t&&"object"==typeof t)for(const[o,r]of Object.entries(t))if("custom_animations"!==o)if("preset"===o&&(0,n.Bl)(r)){const t=(0,n._R)(r);t&&e.add(t)}else r&&"object"==typeof r&&i(r)};return i(t),[...e]}function r(t){return Array.isArray(t)?t.filter(t=>!!t&&"object"==typeof t):t&&"object"==typeof t?Object.entries(t).filter(([,t])=>!!t&&"object"==typeof t).map(([t,e])=>({id:t,...e})):[]}function s(t,e){const i=new Map(r(t.custom_animations).map(t=>[String(t.id),t])),s=new Map,a=[],c=o(t);for(;c.length;){const t=c.shift();if(s.has(t)||a.includes(t))continue;const o=e(t)??i.get(t);if(!o){a.push(t);continue}s.set(t,o);const r=o.steps;for(const t of Array.isArray(r)?r:[])"string"==typeof t?.animation&&t.animation.startsWith(n.D8)&&c.push((0,n._R)(t.animation))}if(!s.size)return{config:t,embedded:[],missing:a};const l=[...s.keys()];for(const[t,e]of i)s.has(t)||s.set(t,e);return{config:{...t,custom_animations:[...s.values()]},embedded:l,missing:a}}},5499(t,e,i){function n(t){if(null===t||"object"!=typeof t)return t;if(Array.isArray(t))return t.map(t=>n(t));const e={};for(const i of Object.keys(t))e[i]=n(t[i]);return e}i.d(e,{G:()=>n})},3925(t,e,i){i.d(e,{a0:()=>h,id:()=>a,ls:()=>u,mu:()=>r,qB:()=>d});const n=new Set(["off","unavailable","unknown","idle","standby"]),o=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function r(t){if(!t)return!1;const e=t.entity_id.split(".")[0],i=t.state;if(n.has(i))return!1;switch(e){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function s(t){const e=t.rgb_color;if(Array.isArray(e)&&e.length>=3&&e.every(t=>"number"==typeof t))return`rgb(${e[0]}, ${e[1]}, ${e[2]})`;const i=t.hs_color;if(Array.isArray(i)&&i.length>=2&&"number"==typeof i[0]&&"number"==typeof i[1]){const[t,e,n]=function(t,e){const i=Math.max(0,Math.min(100,e))/100,n=e=>{const n=(e+t/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(t=>Math.round(255*t))}(i[0],i[1]);return`rgb(${t}, ${e}, ${n})`}}function a(t){if(!t)return;const e=t.entity_id.split(".")[0];if(!o.has(e))return;if(!r(t))return`var(--state-${e}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=s(t.attributes||{});if(i)return i;return`var(--state-${e}-${t.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${e}-active-color, var(--state-active-color, var(--primary-color))))`}const c="--mc-entity-color",l=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function d(t){if("string"!=typeof t)return;const e=t.trim().match(l);return e?{opacity:void 0===e[1]?100:Math.min(100,Number(e[1]))}:void 0}function u(t){return void 0!==d(t)}function h(t){const e=d(t);if(!e)return;const i=`var(${c}, currentColor)`;return e.opacity>=100?i:`color-mix(in srgb, ${i} ${e.opacity}%, transparent)`}i.d(e,["MZ",0,c])},8003(t,e,i){i.d(e,{Aw:()=>h,Bw:()=>$,C8:()=>x,Ee:()=>_,H3:()=>M,Vb:()=>p,c9:()=>d,eI:()=>u,fR:()=>w,pR:()=>g,rD:()=>C,wu:()=>f});var n=i(8983),o=i(2917);const r=new Set(["unavailable","unknown"]),s=new Set(["brightness","color_temp","hs","xy","rgb","rgbw","rgbww","white"]),a=new Set(["hs","xy","rgb","rgbw","rgbww"]),c=t=>{if("number"==typeof t)return Number.isFinite(t)?t:void 0;if("string"==typeof t&&t.trim()){const e=Number(t);return Number.isFinite(e)?e:void 0}};function l(t){const e=t.attributes?.supported_color_modes;return Array.isArray(e)?e:void 0}function d(t){const e=l(t);return!e||e.some(t=>s.has(t))}function u(t){const e=l(t);return!e||e.includes("color_temp")}function h(t){const e=l(t);return!e||e.some(t=>a.has(t))}function m(t,e){const i=t.attributes?.supported_features;return null==i||0!==(Number(i)&e)}function p(t){const e=t.attributes||{},i=t=>{const e=c(t);return e&&e>0?Math.round(1e6/e):void 0};return{min:c(e.min_color_temp_kelvin)??i(e.max_mireds)??2e3,max:c(e.max_color_temp_kelvin)??i(e.min_mireds)??6500}}function f(t){const e=t.attributes||{},i=c(e.color_temp_kelvin);if(void 0!==i)return i;const n=c(e.color_temp);return n?Math.round(1e6/n):void 0}function g(t){if("off"===t.state)return 0;const e=c(t.attributes?.brightness);return void 0===e?void 0:Math.max(1,Math.round(e/255*100))}const y=(t,e,i,n={})=>({domain:t,service:e,data:{entity_id:i,...n}});const v=t=>"number"==typeof t&&Number.isFinite(t);function b(t){if(!v(t))return 0;for(let e=0;e<=6;e++){const i=t*10**e;if(Math.abs(i-Math.round(i))<1e-9*Math.max(1,Math.abs(i)))return e}}function _(t,e,i,n){const o=Math.max(b(n)??4,b(e)??4),r=n>0?e+Math.round((t-e)/n)*n:t,s=Math.min(i,Math.max(e,r));return Number(s.toFixed(o))}function w(t,e,i,s={}){const a=function(t,e,i){const r=e.entity_id,s=r.split(".")[0],a=e.attributes||{},l=String(t?.config?.unit_system?.temperature??a.temperature_unit??""),h=()=>({value:(0,n.f4)(e,i),unit:i?"":String(a.unit_of_measurement??"")});switch(s){case"input_number":case"number":return i?h():{value:(0,n.f4)(e),min:c(a.min),max:c(a.max),step:c(a.step),unit:String(a.unit_of_measurement??""),call:t=>y(s,"set_value",r,{value:t})};case"climate":{const t={min:c(a.min_temp),max:c(a.max_temp),step:c(a.target_temp_step)??("°F"===l?1:.5)};if(!i||"temperature"===i)return{value:c(a.temperature),...t,unit:l,call:t=>y("climate","set_temperature",r,{temperature:t})};if("target_temp_low"===i||"target_temp_high"===i){const e="target_temp_low"===i,n=e?"target_temp_high":"target_temp_low",s=(0,o.g7)(),d=c(a[n]);return{value:c(a[i]),...t,unit:l,call:void 0===c(a[i])||void 0===d?void 0:t=>{const i=(0,o.TR)(s,r,n)??d;return y("climate","set_temperature",r,{target_temp_low:e?t:i,target_temp_high:e?i:t})}}}return"humidity"===i?{value:c(a.humidity),min:c(a.min_humidity)??30,max:c(a.max_humidity)??99,step:1,unit:"%",call:t=>y("climate","set_humidity",r,{humidity:Math.round(t)})}:h()}case"water_heater":return i&&"temperature"!==i?h():{value:c(a.temperature),min:c(a.min_temp),max:c(a.max_temp),step:c(a.target_temp_step)??("°F"===l?1:.5),unit:l,call:t=>y("water_heater","set_temperature",r,{temperature:t})};case"humidifier":return i&&"humidity"!==i?h():{value:c(a.humidity),min:c(a.min_humidity)??0,max:c(a.max_humidity)??100,step:1,unit:"%",call:t=>y("humidifier","set_humidity",r,{humidity:Math.round(t)})};case"light":if(!i||"brightness"===i||"brightness_pct"===i)return d(e)?{value:g(e),min:0,max:100,step:1,unit:"%",call:t=>t<=0?y("light","turn_off",r):y("light","turn_on",r,{brightness_pct:Math.round(t)})}:{value:"on"===e.state?100:0,min:0,max:100,step:1,unit:"%"};if("color_temp_kelvin"===i||"color_temp"===i){const t=p(e);return{value:"on"===e.state?f(e):void 0,...t,step:50,unit:"K",call:u(e)?t=>y("light","turn_on",r,{color_temp_kelvin:Math.round(t)}):void 0}}return h();case"fan":return i&&"percentage"!==i?h():{value:"off"===e.state?0:c(a.percentage),min:0,max:100,step:c(a.percentage_step)??1,unit:"%",call:m(e,1)?t=>y("fan","set_percentage",r,{percentage:Math.round(t)}):void 0};case"cover":return"current_tilt_position"===i?{value:c(a.current_tilt_position),min:0,max:100,step:1,unit:"%",call:m(e,128)?t=>y("cover","set_cover_tilt_position",r,{tilt_position:Math.round(t)}):void 0}:i&&"current_position"!==i?h():{value:c(a.current_position),min:0,max:100,step:1,unit:"%",call:m(e,4)?t=>y("cover","set_cover_position",r,{position:Math.round(t)}):void 0};case"valve":return i&&"current_position"!==i?h():{value:c(a.current_position),min:0,max:100,step:1,unit:"%",call:m(e,4)?t=>y("valve","set_valve_position",r,{position:Math.round(t)}):void 0};case"media_player":{if(i&&"volume_level"!==i)return h();const t=c(a.volume_level);return{value:void 0===t?void 0:Math.round(100*t),min:0,max:100,step:1,unit:"%",call:void 0!==t&&m(e,4)?t=>y("media_player","volume_set",r,{volume_level:Math.round(t)/100}):void 0}}default:return h()}}(t,e,i||void 0);let l=v(a.min)?a.min:void 0,h=v(a.max)?a.max:void 0;v(s.min)&&(l=void 0===l?s.min:Math.max(l,s.min)),v(s.max)&&(h=void 0===h?s.max:Math.min(h,s.max)),l=l??0,h=h??100,h<=l&&(l=v(a.min)?a.min:0,h=v(a.max)&&a.max>l?a.max:l+100);const b=function(t,e){const i=v(e)&&e>0?e:void 0,n=v(t)&&t>0?t:void 0;if(void 0!==i&&void 0!==n){const t=i/n;return Math.abs(t-Math.round(t))<1e-6&&Math.round(t)>=1?i:n}return i??n??1}(a.step,s.step),_=r.has(e.state),w=_||void 0===a.value?void 0:a.value,x=_||!a.call;return{value:w,min:l,max:h,step:b,unit:a.unit,readOnly:x,call:x?void 0:a.call}}function x(t,e,i){const o=Math.max(b(e.step)??0,Math.min(2,b(i)??2));return(0,n.$g)((0,n.gn)(t,i,o),e.unit)}function $(t,e){Promise.resolve(t.callService(e.domain,e.service,e.data)).catch(t=>{console.warn(`Magic Card: ${e.domain}.${e.service} failed`,t)})}const k=new Set(["closed","locked","off"]);function M(t,e){const i=e.split(".")[0],n=t?.states?.[e]?.state,o=void 0!==n&&k.has(n),r="group"===i?"homeassistant":i;let s;switch(i){case"lock":s=o?"unlock":"lock";break;case"cover":s=o?"open_cover":"close_cover";break;case"valve":s=o?"open_valve":"close_valve";break;case"button":case"input_button":s="press";break;case"scene":s="turn_on";break;default:s=o?"turn_on":"turn_off"}return{domain:r,service:s,data:{entity_id:e}}}const S=new Set(["light","switch","fan","input_boolean","automation","humidifier"]),A=new Set(["script","scene"]);function C(t){const e=t.split(".")[0];return{tap_action:S.has(e)?{action:"toggle"}:A.has(e)?{action:"perform-action",service:`${e}.turn_on`,data:{entity_id:t}}:{action:"more-info"},hold_action:{action:"more-info"}}}i.d(e,["LE",0,S])},8477(t,e,i){i.d(e,{CU:()=>s,TO:()=>l,fq:()=>a,hZ:()=>c});var n=i(6161);const o={light:["mdi:lightbulb","mdi:lightbulb-outline"],switch:["mdi:toggle-switch-variant","mdi:toggle-switch-variant-off"],input_boolean:["mdi:check-circle-outline","mdi:close-circle-outline"],binary_sensor:["mdi:checkbox-marked-circle","mdi:radiobox-blank"],fan:["mdi:fan","mdi:fan-off"],automation:["mdi:robot","mdi:robot-off"],lock:["mdi:lock","mdi:lock-open-variant"],cover:["mdi:window-shutter-open","mdi:window-shutter"],valve:["mdi:valve-open","mdi:valve-closed"],media_player:["mdi:cast-connected","mdi:cast"],person:["mdi:account","mdi:account-arrow-right"],device_tracker:["mdi:account","mdi:account-arrow-right"],siren:["mdi:bullhorn","mdi:bullhorn-outline"],remote:["mdi:remote","mdi:remote-off"]},r={sensor:"mdi:eye",climate:"mdi:thermostat",camera:"mdi:video",script:"mdi:script-text",scene:"mdi:palette",input_number:"mdi:ray-vertex",number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",text:"mdi:form-textbox",input_datetime:"mdi:calendar-clock",input_button:"mdi:button-pointer",button:"mdi:button-pointer",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home",zone:"mdi:map-marker-radius",timer:"mdi:timer-outline",counter:"mdi:counter",update:"mdi:package-up",calendar:"mdi:calendar",todo:"mdi:clipboard-list",event:"mdi:eye-check",image:"mdi:image"};function s(t,e,i){if(!e||"unavailable"===e||"unknown"===e)return!1;switch(t){case"lock":return"locked"===e;case"cover":case"valve":return"closed"!==e;case"person":case"device_tracker":return"home"===e;case"media_player":return!["off","standby","idle"].includes(e);case"climate":{const t=i?.hvac_action;return"string"==typeof t&&t?"heating"===t||"cooling"===t:"heat"===e||"cool"===e||"heat_cool"===e}case"alarm_control_panel":return e.startsWith("armed_");case"vacuum":return"cleaning"===e;default:return"on"===e}}function a(t,e){if(!t||!e)return;const i=t.entities?.[e]?.icon;if(i)return i;const n=t.states?.[e],a=n?.attributes?.icon;return"string"==typeof a&&a?a:n?function(t,e){const i=o[t];return i?s(t,e??"")?i[0]:i[1]:r[t]}(e.split(".")[0],n.state):void 0}function c(t,e,i,n){if(!e||!i&&!n)return;const o=t?.states?.[e];return o&&(s(e.split(".")[0],o.state,o.attributes)?i:n)||void 0}function l(t,e,i,o="",r){const s=e?t?.states?.[e]:void 0;return s&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?n.qy`<ha-state-icon class=${o} data-mc-part=${r??n.s6} .hass=${t} .stateObj=${s}></ha-state-icon>`:n.qy`<ha-icon class=${o} data-mc-part=${r??n.s6} .icon=${a(t,e)||i}></ha-icon>`}},3686(t,e,i){function n(t){const e="string"==typeof t?t.trim():"";if(e&&"~"!==e)return"none"===e&&t===e?null:t}function o(t,e){const i=n(t.entity);if(null!==i)return i&&!0===t.share_entity?i:e}function r(t,e,i){const o=n(t.entity);return void 0!==o?o??void 0:!1===i||i&&!i.includes((e??"").split(".")[0])?void 0:e}function s(t,e,i){const n={};return/\bentity\b/.test(t)&&(n.entity=e??""),t.includes("card_entity")&&(n.card_entity=i??""),void 0===n.entity&&void 0===n.card_entity?void 0:n}i.d(e,{DH:()=>n,Xu:()=>o,hY:()=>r,xw:()=>s})},8983(t,e,i){i.d(e,{$g:()=>c,Ai:()=>l,Pd:()=>r,f4:()=>s,gn:()=>a,tX:()=>d});var n=i(2016);const o=new Set(["unavailable","unknown"]);function r(t,e){return!t||(e?void 0===t.attributes?.[e]||null===t.attributes[e]:o.has(t.state))}function s(t,e){if(!t)return;const i=e?t.attributes?.[e]:t.state;if("number"==typeof i)return Number.isFinite(i)?i:void 0;if("string"!=typeof i||!i.trim())return;const n=Number(i);return Number.isFinite(n)?n:void 0}function a(t,e,i){const o=Math.max(0,Math.min(10,Math.round(i))),r={minimumFractionDigits:o,maximumFractionDigits:o};"none"===t?.locale?.number_format&&(r.useGrouping=!1);try{return new Intl.NumberFormat(t?(0,n.eN)(t):void 0,r).format(e)}catch{return e.toFixed(o)}}function c(t,e){return e?/^(%|°)$/.test(e)?`${t}${e}`:`${t} ${e}`:t}function l(t,e,i,n={}){const o=t;let r;try{const t=i?o?.formatEntityAttributeValueToParts?.(e,i):o?.formatEntityStateToParts?.(e);Array.isArray(t)&&t.length&&(r=function(t){const e=t.filter(t=>"unit"===t.type).map(t=>t.value).join("");return{value:t.filter(t=>"value"===t.type).map(t=>t.value).join("")||t.filter(t=>"unit"!==t.type).map(t=>t.value).join("").trim(),unit:e,text:t.map(t=>t.value).join("")}}(t))}catch{r=void 0}if(!r){const t=i?e.attributes?.[i]:e.state;let n;try{n=i?o?.formatEntityAttributeValue?.(e,i):o?.formatEntityState?.(e)}catch{n=void 0}const s=i?"":String(e.attributes?.unit_of_measurement??"");if(null==n){const e=null==t?"":"object"==typeof t?JSON.stringify(t):String(t);r={value:e,unit:s,text:c(e,s)}}else r=s&&n.endsWith(s)?{value:n.slice(0,-s.length).trimEnd(),unit:s,text:n}:{value:n,unit:"",text:n}}const l=void 0!==n.decimals&&null!==n.decimals&&Number.isFinite(Number(n.decimals))?s(e,i):void 0;if(void 0!==l){const e=a(t,l,Number(n.decimals));r={value:e,unit:r.unit,text:c(e,r.unit)}}return r}function d(t,e){const i=t?.formatEntityName;let n;try{n=i?.(e)}catch{n=void 0}return n=n||e.attributes?.friendly_name,"string"==typeof n&&n?n:e.entity_id}},7624(t,e,i){i.d(e,{kc:()=>b,pv:()=>g,rP:()=>y});var n=i(9424),o=i(3925),r=i(8983);const s={route:"curve",min:0,max:1e3,reverse_negative:!0,color:"var(--primary-color)",idle_color:"color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)",width:3,scale_width:!0,dots:3,dot_size:6,speed:2,min_speed:8,glow:0,label:"none",label_position:"auto",show_when:"always",layer:"back"},a=new Set(["top","right","bottom","left"]),c=new Set(["curve","straight","elbow"]),l=new Set(["auto","line","side","hidden"]),d=/^(\d+(?:\.\d+)?)\s*%$/;function u(t){const e="string"==typeof t&&t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0}function h(t,e){const i=u(t);return void 0!==i&&i>0?i:e}function m(t){return"string"==typeof t&&a.has(t)?t:"auto"}function p(t,e){return e>=100?t:`color-mix(in srgb, ${t} ${e}%, transparent)`}function f(t,e,i,r){const s=(0,o.qB)(t);if(s){return p((i?(0,o.id)(e?.states?.[i]):void 0)??r,s.opacity)}return(0,n.f8)(t)??r}function g(t,e,i,n=0){const o=Math.max(0,u(t.min)??s.min),a=u(t.max)??s.max,g=Math.max(.2,h(t.speed,s.speed)),y=Math.max(.2,h(t.min_speed,s.min_speed)),v=Math.min(40,h(t.width,s.width)),b=t.scale_width??s.scale_width,_=t.reverse_negative??s.reverse_negative;let w=!0,x=1,$=g,k=v;const M=t.entity?e?.states?.[t.entity]:void 0;if(t.entity){const e=(0,r.f4)(M,t.attribute||void 0),i=void 0===e?void 0:Math.abs(e);if(void 0===i||i<=o)w=!1,x=0,$=y;else{const t=a>o?Math.min(1,Math.max(0,Math.log1p(i-o)/Math.log1p(a-o))):1;$=y+(g-y)*t,b&&(k=v*(1+t)),x=e<0&&_?-1:1}}const S=t.entity||i,A=f(t.color??s.color,e,S,s.color),C="string"==typeof t.idle_color&&t.idle_color.trim()?t.idle_color.trim():"",z=C.match(d),q=z?p(A,Math.min(100,Number(z[1]))):C?f(C,e,S,s.idle_color):s.idle_color,j=u(t.dots),E=void 0===j?s.dots:Math.min(8,Math.max(0,Math.round(j))),T=u(t.glow),P=t.label??s.label;let N,O;"value"===P&&M?N=(0,r.Ai)(e,M,t.attribute||void 0).text:"template"===P&&"string"==typeof t.label_template&&t.label_template&&(O=t.label_template);const R="string"==typeof t.from?t.from:"",L="string"==typeof t.to?t.to:"",D=t.show_when??s.show_when,W=!!R&&!!L&&R!==L&&("flowing"!==D||w),I={id:"string"==typeof t.id&&t.id?t.id:R&&L?`${R}>${L}`:`flow~${n}`,from:R,to:L,fromSide:m(t.from_side),toSide:m(t.to_side),route:"string"==typeof t.route&&c.has(t.route)?t.route:s.route,active:w,direction:x,speedS:$,width:k,color:A,idleColor:q,dots:E,dotSize:Math.min(40,h(t.dot_size,s.dot_size)),glow:void 0!==T&&T>0?Math.min(30,T):s.glow,visible:W,layer:"front"===t.layer?"front":"back",labelPosition:"string"==typeof t.label_position&&l.has(t.label_position)?t.label_position:s.label_position};return void 0!==N&&(I.label=N),void 0!==O&&(I.labelTemplate=O),I}function y(t){const e=new Set;return(t??[]).map((t,i)=>{const n=t&&"object"==typeof t?t:{},o="string"==typeof n.from?n.from:"",r="string"==typeof n.to?n.to:"";let s="string"==typeof n.id&&n.id?n.id:o&&r?`${o}>${r}`:`flow~${i}`;return e.has(s)&&(s=`${s}~${i}`),e.add(s),s})}const v=new WeakMap;function b(t){let e=v.get(t);if(e)return e;const i=new Map,n=t=>{if(!t||"object"!=typeof t)return;if(Array.isArray(t))return void t.forEach(n);const e=t;"string"!=typeof e.id||"string"!=typeof e.type||i.has(e.id)||i.set(e.id,"string"==typeof e.entity&&"none"!==e.entity?e.entity:void 0);for(const t of["columns","modules","tabs"])n(e[t])};return n(t.rows),e=i,v.set(t,e),e}i.d(e,["Y1",0,s])},5112(t,e,i){i.d(e,{E$:()=>p,Wb:()=>u});const n=[300,400,500,700],o=[{name:"Roboto",family:"Roboto, sans-serif",category:"Sans-serif"},{name:"Open Sans",family:'"Open Sans", sans-serif',category:"Sans-serif"},{name:"Lato",family:"Lato, sans-serif",category:"Sans-serif",weights:[300,400,700]},{name:"Montserrat",family:"Montserrat, sans-serif",category:"Sans-serif"},{name:"Oswald",family:"Oswald, sans-serif",category:"Sans-serif"},{name:"Source Sans Pro",family:'"Source Sans Pro", sans-serif',category:"Sans-serif",weights:[300,400,700]},{name:"Raleway",family:"Raleway, sans-serif",category:"Sans-serif"},{name:"PT Sans",family:'"PT Sans", sans-serif',category:"Sans-serif",weights:[400,700]},{name:"Merriweather",family:"Merriweather, serif",category:"Serif"},{name:"Playfair Display",family:'"Playfair Display", serif',category:"Serif",weights:[400,500,700]},{name:"Lora",family:"Lora, serif",category:"Serif",weights:[400,500,700]},{name:"PT Serif",family:'"PT Serif", serif',category:"Serif",weights:[400,700]},{name:"Noto Sans",family:'"Noto Sans", sans-serif',category:"Sans-serif"},{name:"Ubuntu",family:"Ubuntu, sans-serif",category:"Sans-serif"},{name:"Poppins",family:"Poppins, sans-serif",category:"Sans-serif"},{name:"Nunito",family:"Nunito, sans-serif",category:"Sans-serif"},{name:"Inconsolata",family:"Inconsolata, monospace",category:"Monospace"},{name:"Fira Code",family:'"Fira Code", monospace',category:"Monospace"},{name:"Source Code Pro",family:'"Source Code Pro", monospace',category:"Monospace"},{name:"Dancing Script",family:'"Dancing Script", cursive',category:"Cursive",weights:[400,500,700]}],r=new Map(o.map(t=>[t.name.toLowerCase(),t.name])),s=new Map(o.map(t=>[t.name,t.weights??n]));function a(t){const e=(s.get(t)??n).join(";");return`https://fonts.googleapis.com/css2?family=${encodeURIComponent(t).replace(/%20/g,"+")}:wght@${e}&display=swap`}function c(t){if("string"!=typeof t)return[];const e=[];for(const i of t.split(",")){const t=r.get(i.trim().replace(/^["']|["']$/g,"").trim().toLowerCase());t&&!e.includes(t)&&e.push(t)}return e}const l=/font-family\s*:\s*([^;]+)/gi,d=new WeakMap;function u(t){const e=d.get(t);if(e)return e;const i=new Set,n=new WeakSet,o=t=>{if(t&&"object"==typeof t&&!n.has(t))if(n.add(t),Array.isArray(t))t.forEach(o);else for(const[e,n]of Object.entries(t))if("font_family"===e)c(n).forEach(t=>i.add(t));else if("css"===e&&"string"==typeof n)for(const t of n.matchAll(l))c(t[1]).forEach(t=>i.add(t));else n&&"object"==typeof n&&o(n)};o(t);const r=[...i];return d.set(t,r),r}const h=new Set(["Roboto"]);let m;function p(t){if("undefined"!=typeof document&&document.head&&(!m||!t.every(t=>m.has(t)||h.has(t)))){m??=new Set([...document.head.querySelectorAll("link[data-mc-font]")].map(t=>t.dataset.mcFont??""));for(const e of t){if(m.has(e)||h.has(e))continue;m.add(e);const t=document.createElement("link");t.rel="stylesheet",t.href=a(e),t.dataset.mcFont=e,document.head.appendChild(t)}}}i.d(e,["rK",0,o])},9136(t,e,i){i.d(e,{o:()=>c,w:()=>s});var n=i(6161),o=i(9424);const r=/^\s*(to\s|circle|ellipse|at\s|closest|farthest|-?[\d.]+(deg|turn|rad|grad)$)[\w\s.%-]*$/i;function s(t){const e=/^\s*(linear|radial)-gradient\((.*)\)\s*$/is.exec(t),i=e?.[2].match(/(?:[^(),]|\((?:[^()]|\([^()]*\))*\))+/g);if(!e||!i||i.join(",")!==e[2])return;const n=r.test(i[0])?i.shift():"",s=i.map(t=>(0,o.f8)(t.replace(/(\s+-?[\d.]+[a-z%]*)+\s*$/i,"")));return i.length<2||i.length>8||!s.every(Boolean)?void 0:{radial:"radial"===e[1],angle:/deg$/.test(n)?parseFloat(n):180,stops:s}}const a=t=>+t.toFixed(3);function c(t,e,i,o){const r=e*Math.PI/180,s=Math.sin(r),c=Math.cos(r),l=(Math.abs(o.w*s)+Math.abs(o.h*c))/2,d=o.x+o.w/2,u=o.y+o.h/2;return n.JW`<linearGradient id=${t} gradientUnits="userSpaceOnUse" x1=${a(d-s*l)} y1=${a(u+c*l)} x2=${a(d+s*l)} y2=${a(u-c*l)}>${i.map((t,e)=>n.JW`<stop offset=${a(i.length>1?e/(i.length-1):0)} stop-color=${t}></stop>`)}</linearGradient>`}},7137(t,e,i){i.d(e,{$:()=>o});let n=0;function o(t="mc"){n++;return`${t}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${n}`}},5809(t,e,i){i.d(e,{tQ:()=>c,X$:()=>l,ER:()=>h});var n=i(7850),o=i(2641),r=i(1235);const s={slider:"magic-card-slider.js",seasonal:"magic-card-seasonal.js",markdown:"magic-card-markdown.js","modules-extra":"magic-card-modules-extra.js"};function a(t,e){const i=s[t];let n,o=e,a="idle",c=new Set,l=0;const d=(t,e,i)=>(t!==l||(a="failed",c.clear(),console.warn(e,...void 0===i?[]:[i])),!1);return{name:t,load:()=>(n||(a="loading",n=(async t=>{let e;try{e=await o()}catch(e){return d(t,`Magic Card: ${i} did not load`,e)}if(t!==l)return!1;if(e?.BUILD!==r.Q)return d(t,`Magic Card was updated, reload the page (magic-card.js ${r.Q}, ${i} ${String(e?.BUILD)}).`);try{e.install()}catch(e){return d(t,`Magic Card: ${i} did not load`,e)}a="ready";const n=[...c];c.clear();for(const t of n)try{t()}catch(t){console.warn(`Magic Card: a ${i} callback failed`,t)}return!0})(l)),n),ready:()=>"ready"===a,failed:()=>"failed"===a,whenReady(t){"ready"===a?t():"failed"!==a&&c.add(t)},__reset(t){l++,o=t??e,n=void 0,a="idle",c=new Set}}}const c={slider:a("slider",()=>i.e(436).then(()=>i(8250))),seasonal:a("seasonal",()=>i.e(199).then(()=>i(6803))),markdown:a("markdown",()=>i.e(764).then(()=>i(7707))),"modules-extra":a("modules-extra",()=>i.e(427).then(()=>i(2694)))},l=()=>c.seasonal.load(),d=new WeakSet,u=(t,e=new Set)=>{if(!t||"object"!=typeof t||e.has(t))return!1;if(e.add(t),Array.isArray(t))return t.some(t=>u(t,e));for(const[i,n]of Object.entries(t))if("card_config"!==i){if("seasonal"===i&&n)return!0;if("preset"===i&&"string"==typeof n&&(0,o.e2)(n)?.seasonal)return!0;if(n&&"object"==typeof n&&u(n,e))return!0}return!1};function h(t){t&&"object"==typeof t&&!d.has(t)&&(d.add(t),n.s.prefetch(t),u(t)&&c.seasonal.load())}},2016(t,e,i){function n(t){return t?.locale?.language||t?.language||void 0}function o(t){const e=t?.locale?.time_format;if("12"===e)return!0;if("24"===e)return!1;const i="system"===e?void 0:n(t);try{return new Date("January 1, 2023 22:00:00").toLocaleString(i).includes("10")}catch{return!1}}function r(t){if("server"!==t?.locale?.time_zone)return;const e=t.config?.time_zone;if(e)try{return new Intl.DateTimeFormat("en",{timeZone:e}),e}catch{return}}function s(t){switch(t?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return n(t)}}function a(t,e,i=1){const n={maximumFractionDigits:i};"none"===t?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(s(t),n).format(e)}catch{return String(e)}}function c(t,e){const i=r(t),o=i?{...e,timeZone:i}:e;try{return new Intl.DateTimeFormat(n(t),o)}catch{return new Intl.DateTimeFormat(void 0,o)}}i.d(e,{LE:()=>c,XN:()=>n,ZV:()=>a,cj:()=>r,eN:()=>s,oE:()=>o})},7110(t,e,i){i.d(e,{F9:()=>h,XK:()=>l,aN:()=>d,x2:()=>f,zi:()=>m});var n=i(1535),o=i(7924);const r="(\\d+(?:\\.\\d+)?|\\.\\d+)",s=new RegExp(`^${r}\\s*[:/x×]\\s*${r}$`,"i"),a=new RegExp(`^${r}$`),c=new RegExp(`^${r}\\s*%$`);function l(t,e="16 / 9"){if("number"==typeof t)return Number.isFinite(t)&&t>0?String(t):e;if("string"!=typeof t)return e;const i=t.trim();let n=s.exec(i);if(n){const t=Number(n[1]),i=Number(n[2]);return t>0&&i>0?`${t} / ${i}`:e}return n=a.exec(i),n?Number(n[1])>0?String(Number(n[1])):e:(n=c.exec(i),n&&Number(n[1])>0?`100 / ${Number(n[1])}`:e)}function d(t,e){if(!e)return e;const i=t?.hassUrl;if(e.startsWith("/")&&!e.startsWith("//")&&"function"==typeof i)try{return i.call(t,e)}catch{return e}return e}function u(t){return(0,n.V)()?.media?.(t)??(0,o.yl)(t)??""}function h(t,e){const i=(0,o.fk)(e);return d(t,i?u(i):"string"==typeof e?(0,o.i$)(e):"")}function m(t,e){const i=(0,o.fk)(e);if(!i){const i="string"==typeof e?e.trim():"";return/^(\/|https?:|data:)/i.test(i)?p(d(t,i)):e}const n=u(i);return n?p(d(t,n)):""}function p(t){return`url("${t.replace(/["\\\n\r]/g,encodeURIComponent)}")`}function f(t,e,i=Date.now()){if(!(t&&e>0))return t;const n=Math.floor(i/e);return`${t}${t.includes("?")?"&":"?"}mc_t=${n}`}},5746(t,e,i){function n(t){if(!t||"object"!=typeof t)return;const e=t;if("row"===t.type){const t=e.columns;return Array.isArray(t)?t.map(t=>Array.isArray(t?.modules)?t.modules:[]):[]}if("tabs"===t.type){const t=e.tabs;return Array.isArray(t)?t.map(t=>Array.isArray(t?.modules)?t.modules:[]):[]}return Array.isArray(e.modules)?[e.modules]:"horizontal"===t.type||"vertical"===t.type||"slider-layout"===t.type?[[]]:void 0}function o(t){if(r(t))return"row"===t.type?"columns":"tabs"===t.type?"tabs":"modules"}function r(t){return void 0!==n(t)}function s(t){return"row"===t?.type||"tabs"===t?.type}function a(t,e){if("row"===t.type)return`Column ${e+1}`;if("tabs"===t.type){const i=t.tabs?.[e];return i?.label?.trim()||`Tab ${e+1}`}}function c(t,e){return n(t)?.[e.slot]?.[e.index]}function l(t,e){let i=t;for(const t of e)if(i=c(i,t),!i)return;return i}function d(t,e){const i=t;if("row"===t.type||"tabs"===t.type){const n=i["row"===t.type?"columns":"tabs"],o=n?.[e];if(!o)return;return Array.isArray(o.modules)||(o.modules=[]),o.modules}if(0===e&&r(t))return Array.isArray(i.modules)||(i.modules=[]),i.modules}function u(t){return t.map(t=>`${t.slot}.${t.index}`).join("/")}function h(t){if(!t)return[];const e=[];for(const i of t.split("/")){const t=/^(?:(\d+)\.)?(\d+)$/.exec(i);if(!t)return;e.push({slot:void 0===t[1]?0:Number(t[1]),index:Number(t[2])})}return e}function m(t,e,i){if(!e.length)return i;const[n,...o]=e,r=c(t,n);if(!r)return t;const s=m(r,o,i),a=t,l=t=>(t||[]).map((t,e)=>e===n.index?s:t);if("row"===t.type||"tabs"===t.type){const e="row"===t.type?"columns":"tabs",i=a[e].map((t,e)=>e===n.slot?{...t,modules:l(t.modules)}:t);return{...t,[e]:i}}return{...t,modules:l(a.modules)}}i.d(e,{Df:()=>a,Nk:()=>u,O6:()=>m,QN:()=>r,Rv:()=>l,Tu:()=>h,WA:()=>s,rX:()=>d,us:()=>o,yZ:()=>n})},1909(t,e,i){i.d(e,{ii:()=>a});var n=i(3664),o=i(1235);let r,s;function a(){return r??=i.e(300).then(()=>i(7556)).then(t=>{if((0,o.t)("magic-card-particles.js",t))return(0,n.E0)(t.compile,t.validateSim),s=t.particles},t=>{console.warn("Magic Card: magic-card-particles.js did not load",t)}),r}i.d(e,["WP",0,()=>s])},2917(t,e,i){i.d(e,{TR:()=>a,g7:()=>r,jb:()=>l,n_:()=>d,vh:()=>s});var n=i(1535);let o=0;function r(){return(0,n.V)()?.instance??""}function s(t,e,i){return JSON.stringify([r(),t??"",e??"",i])}function a(t,e,i){let n;for(const o of c.values())o.scope===t&&o.entityId===e&&o.attribute===i&&(!n||o.seq>n.seq)&&(n=o);return n?.value}const c=new Map;function l(t,e){const i=c.get(t);if(i)return i.sent&&e!==i.base?(i.holdTimer&&clearTimeout(i.holdTimer),void c.delete(t)):i.value}function d(t,e,i,n,r,s=500){const a=c.get(t);a?.timer&&clearTimeout(a.timer),a?.holdTimer&&clearTimeout(a.holdTimer);let l=[];try{l=JSON.parse(t)}catch{}const[d,u,h]=Array.isArray(l)?l.map(String):["","",""],m={value:e,base:a?a.base:i,sent:!1,scope:d??"",entityId:u??"",attribute:h??"",seq:++o};m.timer=setTimeout(()=>{m.timer=void 0,m.sent=!0,n(m.value),m.holdTimer=setTimeout(()=>{c.get(t)===m&&c.delete(t),r?.()},5e3)},s),c.set(t,m),r?.()}},5832(t,e,i){i.d(e,{BI:()=>s,CR:()=>d,GD:()=>f,Ho:()=>v,NG:()=>a,WV:()=>u,b7:()=>h,gt:()=>y,oi:()=>r,t8:()=>l,uT:()=>c,yB:()=>g});const n=/^[A-Za-z0-9][A-Za-z0-9_-]*$/,o={style:"sheet",width:"600px",max_height:"90vh",backdrop_blur:"8px",backdrop_opacity:.4,show_close:!0,auto_close:0};function r(t){return"string"==typeof t?t.trim().replace(/^#+/,""):""}function s(t){return"string"==typeof t&&n.test(t)}function a(t){const e=r(t);return!e||s(e)?"":"Use letters, digits, - and _ only (no spaces)."}function c(t){return!!t&&"object"==typeof t&&!0===t.enabled}function l(t){const e=r(t?.hash);return s(e)?e:void 0}function d(t,e){if(!e||!t||t.length<2)return!1;let i=t.slice(1);try{i=decodeURIComponent(i)}catch{}return i===e}function u(t,e){const i=t.split("#")[0];return e?`${i}#${e}`:i}function h(t,e,i){const n=t?.entity?.trim();if(!n||!e||!i)return!1;const o=e[n]?.state,r=i[n]?.state;if(void 0===o||void 0===r||o===r)return!1;const s=t?.state?.trim();return!s||r===s}function m(t){if("number"==typeof t&&Number.isFinite(t))return`${t}px`;if("string"!=typeof t)return;const e=t.trim();return e&&!/[;{}<>]/.test(e)?/^-?\d+(\.\d+)?$/.test(e)?`${e}px`:e:void 0}function p(t){const e="string"==typeof t?Number(t):t;if("number"!=typeof e||!Number.isFinite(e))return o.backdrop_opacity;const i=e>1?e/100:e;return Math.min(1,Math.max(0,i))}function f(t){const e="string"==typeof t?Number(t):t;return"number"==typeof e&&Number.isFinite(e)&&e>0?Math.round(1e3*e):0}function g(t){return"dialog"===t?.style?"dialog":"sheet"}function y(t,e){const i=[`--mc-popup-width: ${m(t?.width)??o.width}`,`--mc-popup-max-height: ${m(t?.max_height)??o.max_height}`,`--mc-popup-blur: ${m(t?.backdrop_blur)??o.backdrop_blur}`,`--mc-popup-backdrop-opacity: ${p(t?.backdrop_opacity)}`],n=m(e);return n&&!/\s/.test(n)&&i.push(`--mc-popup-radius: ${n}`),i.join("; ")}class v{constructor(){this._startY=0,this._startT=0,this._active=!1,this.offset=0}get active(){return this._active}start(t,e){this._active=!0,this._startY=t,this._startT=e,this.offset=0}move(t){return this._active?(this.offset=Math.max(0,t-this._startY),this.offset):0}end(t,e,i){if(!this._active)return!1;const n=this.move(t);this._active=!1,this.offset=0;const o=n/Math.max(1,e-this._startT);return n>=(i>0?Math.min(80,.25*i):80)||n>=24&&o>=.6}cancel(){this._active=!1,this.offset=0}}i.d(e,["Uh",0,o])},8668(t,e,i){i.d(e,{C8:()=>y,G3:()=>c,XB:()=>d,fI:()=>v,zu:()=>u});var n=i(9639),o=i(1771);function r(t,e){const i=t.match(/-?\d*\.?\d+(?:e[+-]?\d+)?(?:px|%)?|[a-z-]+\(|[()+\-*/,]/gi)??[];if(i.join("").replace(/\s+/g,"")!==t.replace(/\s+/g,""))return NaN;let n=0;const o=()=>i[n],r=()=>i[n++],s=()=>{const t=r();if(void 0===t)return NaN;if("("===t){const t=c();return")"===r()?t:NaN}if("-"===t)return-s();const i=/^([a-z-]+)\($/i.exec(t)?.[1].toLowerCase();if(i){const t=(()=>{const t=[c()];for(;","===o();)r(),t.push(c());return")"!==r()?[NaN]:t})();return"calc"===i&&1===t.length?t[0]:"min"===i?Math.min(...t):"max"===i?Math.max(...t):"clamp"===i&&3===t.length?Math.max(t[0],Math.min(t[1],t[2])):NaN}const n=parseFloat(t);return t.endsWith("%")?n/100*e:n},a=()=>{let t=s();for(;"*"===o()||"/"===o();)t="*"===r()?t*s():t/s();return t},c=()=>{let t=a();for(;;){const e=o();if("+"===e||"-"===e)r(),t="+"===e?t+a():t-a();else{if(void 0===e||!/^-\d|^-\./.test(e))return t;t+=a()}}},l=c();return n===i.length?l:NaN}function s(t,e){if(!t)return 0;const i=/^[a-z-]+\(/i.test(t.trim())?r(t.trim(),e):t.trim().endsWith("%")?parseFloat(t)/100*e:parseFloat(t);return Number.isFinite(i)&&i>0?i:0}function a(t,e,i){const[n,o=n]=function(t){const e=[];let i=0,n="";for(const o of t.trim())"("===o&&i++,")"===o&&i--,/\s/.test(o)&&0===i?(n&&e.push(n),n=""):n+=o;return n&&e.push(n),e}(t||"");return{x:s(n,e),y:s(o,i)}}function c(t,e,i){return{tl:a(t.borderTopLeftRadius,e,i),tr:a(t.borderTopRightRadius,e,i),br:a(t.borderBottomRightRadius,e,i),bl:a(t.borderBottomLeftRadius,e,i)}}const l=(t,e)=>({x:t.x*e,y:t.y*e});function d(t,e,i){const n=(t,e)=>e>t?t/e:1,o=Math.min(n(e,t.tl.x+t.tr.x),n(i,t.tr.y+t.br.y),n(e,t.br.x+t.bl.x),n(i,t.tl.y+t.bl.y));return o>=1?t:{tl:l(t.tl,o),tr:l(t.tr,o),br:l(t.br,o),bl:l(t.bl,o)}}function u(t,e){const i=t=>e>=0?{x:Math.max(0,t.x-e),y:Math.max(0,t.y-e)}:{x:t.x>0?t.x-e:0,y:t.y>0?t.y-e:0};return{tl:i(t.tl),tr:i(t.tr),br:i(t.br),bl:i(t.bl)}}const h=t=>{const e=Math.round(100*t)/100;return String(Object.is(e,-0)?0:e)},m=(t,e)=>Math.abs(t.x-e.x)<1e-6&&Math.abs(t.y-e.y)<1e-6;function p(t,e,i,n){const o=t=>{const n=t*Math.PI/180;return{x:e.x+i.x*Math.cos(n),y:e.y+i.y*Math.sin(n)}},[r,s,a]=[o(n),o(n+45),o(n+90)];return[{kind:"A",group:t,from:r,to:s,rx:i.x,ry:i.y},{kind:"A",group:t,from:s,to:a,rx:i.x,ry:i.y}]}function f(t,e,i){const n={x:(e.x+i.x)/2,y:(e.y+i.y)/2};return[{kind:"L",group:t,from:e,to:n,rx:0,ry:0},{kind:"L",group:t,from:n,to:i,rx:0,ry:0}]}const g=["top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"];function y(t,e,i,n={}){const o=n.inset??0,r=o,s=o,a=t-o,c=e-o;if(!(t>0&&e>0)||a<=r||c<=s)return"";const l=d(u(d(i,t,e),o),a-r,c-s),y=f("top",{x:r+l.tl.x,y:s},{x:a-l.tr.x,y:s}),v=[y[1],...p("tr",{x:a-l.tr.x,y:s+l.tr.y},l.tr,-90),...f("right",{x:a,y:s+l.tr.y},{x:a,y:c-l.br.y}),...p("br",{x:a-l.br.x,y:c-l.br.y},l.br,0),...f("bottom",{x:a-l.br.x,y:c},{x:r+l.bl.x,y:c}),...p("bl",{x:r+l.bl.x,y:c-l.bl.y},l.bl,90),...f("left",{x:r,y:c-l.bl.y},{x:r,y:s+l.tl.y}),...p("tl",{x:r+l.tl.x,y:s+l.tl.y},l.tl,180),y[0]],b=2*Math.max(0,g.indexOf(n.start??"top"));let _=[...v.slice(b),...v.slice(0,b)];const w="ccw"===n.direction;w&&(_=_.reverse().map(t=>({...t,from:t.to,to:t.from})));const x=[];for(const t of _){if(m(t.from,t.to))continue;const e=x[x.length-1];e&&e.group===t.group&&m(e.to,t.from)?e.to=t.to:x.push({...t})}if(!x.length)return"";const $=x[0].from,k=x[x.length-1];"L"===k.kind&&m(k.to,$)&&x.length>1&&x.pop();const M=w?0:1,S=[`M${h($.x)} ${h($.y)}`];for(const t of x)S.push("L"===t.kind?`L${h(t.to.x)} ${h(t.to.y)}`:`A${h(t.rx)} ${h(t.ry)} 0 0 ${M} ${h(t.to.x)} ${h(t.to.y)}`);return S.push("Z"),S.join(" ")}function v(t,e,i,r,s={}){const a=s.inset??0;let c;if(a>=0){const s=(0,n.q8)(t,e,i,r,a);c=s?(0,o.aM)(s):void 0}else{const s=e-2*a>0&&i-2*a>0?(0,n.j9)(t,e-2*a,i-2*a,r):void 0,l=s&&(0,o.aM)(s.d);c=l&&(0,o.Tl)(l,a,a)}if(!c)return"";const l=Math.max(0,g.indexOf(s.start??"top"))*Math.PI/4;let d=(0,o.dm)(c,[e*(1+Math.round(Math.sin(l)))/2,i*(1-Math.round(Math.cos(l)))/2]);return"ccw"===s.direction&&(d=(0,o.BE)(d)),(0,o.uD)([d])}},170(t,e,i){i.d(e,{Y4:()=>d,JA:()=>_,cr:()=>x,nI:()=>k,dg:()=>w});var n=i(9424),o=i(4240),r=i(3925),s=i(9136),a=i(8983),c=i(1476);function l(t,e,i){if(t&&"object"==typeof t){const n="string"==typeof t.entity?t.entity:"";return(0,a.f4)(n?e?.[n]:void 0,t.attribute||void 0)??i}const n="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof n&&Number.isFinite(n)?n:i}const d={width:3,transition:"1s",speed:"3s",length:25,start:"top",direction:"cw",linecap:"round",position:"inside",animation:"snake",min:0,max:100},u=["snake","pulse","full","dots","dashes"],h=["top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"],m=["inside","center","outside"],p="var(--primary-color, #03a9f4)";const f=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},g=(t,e,i)=>Math.min(i,Math.max(e,t)),y=(t,e,i)=>e.includes(t)?t:i,v=t=>(0,r.a0)(t)??(0,n.f8)(t),b=(t,e)=>void 0===e||e>=100?t:`color-mix(in srgb, ${t} ${g(e,0,100)}%, transparent)`;function _(t,e){if(!t||"object"!=typeof t||"value"!==t.mode&&"animated"!==t.mode)return;const i=e.defaultEntity?e.states?.[e.defaultEntity]:void 0;if("tap"!==t.trigger&&!(0,n.p4)(t,i,e.states))return;let r=1;const _=(0,s.w)(t.color);let w,x=_?_.stops[0]:v(t.color);if("value"===t.mode){const i=t.entity||e.defaultEntity,n=i?e.states?.[i]:void 0,s=!t.attribute&&(0,c._7)(i)?(0,c.vt)(n):void 0;if(s){const e=(0,c.Yj)(s),i="elapsed"===t.timer_fill;r="idle"===s.state?0:i?1-e:e,void 0!==s.end&&s.total>0&&(w={end:s.end,total:s.total,elapsed:i,color:x??p,...t.thresholds?{thresholds:t.thresholds}:{}}),x=v((0,o.r)(100*e,t.thresholds))??x}else{const i=(0,a.f4)(n,t.attribute||void 0),s=l(t.min,e.states,d.min),c=l(t.max,e.states,d.max);r=void 0===i||c===s?0:g((i-s)/(c-s),0,1),x=v((0,o.r)(i,t.thresholds))??x}}x??=p;const $=y(t.position,m,d.position),k=v(t.track_color),M=f(t.track_opacity),S=k||void 0!==M?b(k??x,M):void 0;w&&!k&&void 0!==M&&(w.trackOpacity=M);const A=(0,n.TD)(t.transition)??d.transition;return{mode:t.mode,fill:r,..."animated"===t.mode?{animation:y(t.animation,u,d.animation)}:{},color:x,paint:_&&t.color,...S?{track:S}:{},width:g(f(t.width)??d.width,.5,40),linecap:"butt"===t.linecap?"butt":"round",glow:g(f(t.glow)??0,0,40),position:e.shaped||e.clipped&&"outside"===$?"inside":$,start:y(t.start,h,d.start),direction:"ccw"===t.direction?"ccw":"cw",length:g(f(t.length)??d.length,1,99),speed:(0,n.TD)(t.speed)??d.speed,transition:w?(C=A,(C.endsWith("ms")?parseFloat(C):1e3*parseFloat(C))>1e3?"1s":C):A,...w?{timer:w}:{}};var C}function w(t,e=Date.now()){const i=g((t.end-e)/t.total,0,1),n=v((0,o.r)(100*i,t.thresholds))??t.color;return{fill:t.elapsed?1-i:i,color:n,...void 0!==t.trackOpacity?{track:b(n,t.trackOpacity)}:{}}}function x(t,e){return"inside"===t?e/2:"outside"===t?-e/2:0}const $=t=>String(+t.toFixed(3));function k(t,e){const i=(t,i="none",n="none")=>({...t,animation:e?"none":i,transition:e?"none":n});if("value"===t.mode)return i({dasharray:"100 101",dashoffset:$(100-100*t.fill),linecap:t.linecap,opacity:t.fill>0?1:0},"none",`stroke-dashoffset ${t.transition} ${t.timer?"linear":"ease-in-out"}, stroke 0.5s ease`);const n=`mc-ring-run ${t.speed} ${t.timing??"linear infinite"}`;switch(t.animation){case"pulse":return i({dasharray:"none",dashoffset:"0",linecap:t.linecap,opacity:1},`mc-ring-pulse ${t.speed} ${t.timing??"ease-in-out infinite"}`);case"full":return i({dasharray:"none",dashoffset:"0",linecap:t.linecap,opacity:1});case"dots":return i({dasharray:`0 ${$(100/12)}`,dashoffset:"0",linecap:"round",opacity:1},n);case"dashes":return i({dasharray:"1.5 1.5",dashoffset:"0",linecap:t.linecap,opacity:1},n);default:return i({dasharray:`${$(t.length)} ${$(100-t.length)}`,dashoffset:"0",linecap:t.linecap,opacity:1},n)}}},2065(t,e,i){i.d(e,{Nd:()=>r,xY:()=>s});const n="mc-seasonal-preview";let o;function r(){return o}function s(t){const e=t&&Number.isFinite(t.getTime())?new Date(t.getTime()):void 0;(e?.getTime()??null)!==(o?.getTime()??null)&&(o=e,window.dispatchEvent(new CustomEvent(n)))}i.d(e,["HT",0,n])},4036(t,e,i){i.d(e,{As:()=>v,Gx:()=>f,Is:()=>y,W8:()=>w,bO:()=>b,ir:()=>g});const n={sun:3,dusk:2,flash:5,moon:2},o=["snow"],r=["#e8590c","#f08c00","#d9480f","#c92a2a","#b35a1f","#e0a526","#a8761b"],s=["#ffc9de","#fcc2d7","#f9a8c9","#ffdeeb","#f7a1c4"],a=["#ffd43b","#fcc419","#ffe066"],c=["#fff9db","#e7f5ff","#ffec99","#ffffff"],l=["#5c9ce6","#74a9e6","#4a8bd6"],d=t=>({kind:"snowdot",motion:"fall",weight:t,dur:[9,17],size:[4,8],opacity:[.55,1],palette:o,drift:26}),u=(t,e)=>({kind:"flake",motion:"fall",weight:t,max:e,dur:[11,19],size:[12,22],opacity:[.7,1],palette:o,variants:3,drift:34}),h=t=>({kind:"petal",motion:"tumble",weight:t,dur:[9,15],size:[13,19],opacity:[.8,1],palette:s,drift:60}),m=(t,e="rain")=>({kind:"raindrop",motion:e,weight:t,dur:"rain"===e?[.6,1]:[7,11],size:[18,30],opacity:"rain"===e?[.45,.85]:[.35,.6],palette:l}),p={winter:{id:"winter",label:496,particles:[d(6),u(3,8)],decorations:["frost","icicles"]},spring:{id:"spring",label:418,particles:[h(5),{kind:"blossom",motion:"tumble",weight:1.6,max:4,dur:[11,16],size:[17,24],opacity:[.85,1],palette:s,drift:50}],decorations:["vine"]},summer:{id:"summer",label:434,ambient:["sun"],particles:[{kind:"butterfly",motion:"flutter",weight:1,max:4,dur:[9,15],size:[28,38],palette:[["#f59f00","#ffd43b"],["#339af0","#a5d8ff"],["#fab005","#fff3bf"],["#e64980","#ffdeeb"],["#7950f2","#d0bfff"]],band:[18,78]},{kind:"mote",motion:"flutter",weight:1.4,max:7,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:a,band:[10,90]}]},autumn:{id:"autumn",label:38,particles:[{kind:"leaf",motion:"tumble",weight:6,dur:[8,14],size:[20,32],opacity:[.85,1],palette:r,variants:3,drift:70},m(1.4,"drizzle")]},christmas:{id:"christmas",label:95,particles:[d(4),u(1.4,4),{kind:"star",motion:"twinkle",weight:2.4,max:6,dur:[2.2,3.8],size:[13,21],opacity:[.8,1],palette:a,band:[6,62],variants:1}],decorations:["lights"]},new_year:{id:"new_year",label:288,particles:[{kind:"firework",motion:"burst",weight:2.4,max:5,dur:[2.6,4],size:[64,100],opacity:[.8,.95],palette:[["#ff6b6b","#ffe066"],["#4dabf7","#d0ebff"],["#ffd43b","#fff9db"],["#da77f2","#ffdeeb"],["#51cf66","#ebfbee"],["#ff922b","#fff4e6"]],band:[14,52]},{kind:"confetti",motion:"tumble",weight:5,dur:[5,8],size:[8,13],palette:["#ff6b6b","#ffd43b","#4dabf7","#69db7c","#da77f2","#ff922b","#f783ac","#e9c46a"],variants:3,drift:40}]},valentine:{id:"valentine",label:477,particles:[{kind:"heart",motion:"rise",weight:1,dur:[8,13],size:[12,24],opacity:[.6,.95],palette:["#e03131","#f03e3e","#e64980","#f06595","#ff6b81","#c2255c"],variants:2,drift:30}]},easter:{id:"easter",label:164,particles:[h(3),{kind:"egg",motion:"bob",weight:1.6,max:6,dur:[2.4,3.6],size:[22,30],palette:[["#ffd8a8","#f76707"],["#b2f2bb","#2b8a3e"],["#a5d8ff","#1864ab"],["#fcc2d7","#c2255c"],["#d0bfff","#5f3dc4"],["#ffec99","#e67700"]],band:[80,92],variants:3}]},halloween:{id:"halloween",label:219,particles:[{kind:"bat",motion:"fly",weight:1,max:7,dur:[7,12],size:[24,36],opacity:[.8,1],palette:["bat"],band:[8,55]},{kind:"fogband",motion:"drift",weight:.5,max:3,dur:[16,26],size:[260,380],opacity:[.55,.85],palette:["ghost-violet","mist","ghost-green"],band:[70,100]}],decorations:["cobweb","pumpkin"]},snow:{id:"snow",label:403,particles:[d(7),u(3,8)]},rain:{id:"rain",label:343,particles:[m(1)]},storm:{id:"storm",label:457,ambient:["flash"],particles:[m(1)]},sun:{id:"sun",label:436,ambient:["sun"],particles:[{kind:"mote",motion:"flutter",weight:1,max:8,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:a,band:[10,90]}]},clouds:{id:"clouds",label:102,particles:[{kind:"cloud",motion:"across",weight:1,max:5,dur:[50,90],size:[64,120],opacity:[.55,.95],palette:["cloud"],band:[6,46]}]},fog:{id:"fog",label:195,particles:[{kind:"fogband",motion:"drift",weight:1,max:4,dur:[16,28],size:[280,420],opacity:[.4,.75],palette:["mist"],band:[25,100]}]},wind:{id:"wind",label:495,particles:[{kind:"windline",motion:"gust",weight:2,max:6,dur:[2.4,5],size:[90,160],opacity:[.55,.95],palette:["wind"],band:[12,88],variants:2},{kind:"leaf",motion:"blow",weight:1,max:4,dur:[4,6.5],size:[16,22],palette:r,band:[20,80],variants:3}]},night:{id:"night",label:289,ambient:["moon"],particles:[{kind:"sparkle",motion:"twinkle",weight:3,max:10,dur:[2.4,4.6],size:[7,14],opacity:[.6,1],palette:c,band:[4,58]},{kind:"firefly",motion:"firefly",weight:2,max:6,dur:[9,15],size:[10,15],palette:["#d8f5a2","#ffec99","#c0eb75"],band:[45,92]}]},dusk:{id:"dusk",label:158,ambient:["dusk"],particles:[{kind:"sparkle",motion:"twinkle",weight:1,max:3,dur:[3,5],size:[6,10],opacity:[.45,.8],palette:c,band:[4,30]}]}};function f(t){return"string"==typeof t&&Object.prototype.hasOwnProperty.call(p,t)}function g(t){const e=[];for(const i of t)for(const t of f(i)&&p[i].decorations||[])e.includes(t)||e.push(t);return e}function y(t){let e=function(t){let e=2166136261;for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}(t);return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function v(t,e=0){const i=Number.isFinite(t)?Math.min(1,Math.max(0,t)):.5;return Math.max(0,Math.min(24-e,Math.round(24*i)))}function b(t){return t.some(t=>f(t)&&!!p[t].ambient?.includes("flash"))}function _(t,e){const i=new Set;for(const e of t)if(f(e))for(const t of p[e].ambient??[])i.add(t);let o=0;for(const t of i)o+=n[t];return v(e,o)}class w{constructor(t=60){this._cap=t,this._left=60,this._flashes=0,this._demand=0,this._known=0}begin(){this._left=this._cap,this._flashes=0,this._demand=0,this._scale=void 0}own(t,e){return this._grant(t,e,1)}preset(t,e){const i=_(t,e);return this._demand+=i,void 0===this._scale&&(this._scale=this._known>this._left?Math.max(0,this._left)/this._known:1),this._grant(t,e,this._scale,i)}settle(){return this._demand!==this._known&&(this._known=this._demand,!0)}_grant(t,e,i,n=_(t,e)){const o=Math.max(0,Math.min(this._left,Math.round(n*i)));this._left-=o;const r=b(t);return r&&this._flashes++,{intensity:o===n?e:o/24,noflash:r&&this._flashes>5}}}i.d(e,["IL",0,p,"zc",0,n])},5816(t,e,i){i.d(e,{GR:()=>g,J4:()=>v,Oo:()=>k,RC:()=>l,Z:()=>w,a0:()=>q,aD:()=>z,ot:()=>f,p5:()=>b,rG:()=>C,s$:()=>x,ws:()=>M});var n=i(2016);const o=["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight"],r={christmas:"12-01..12-26",new_year:"12-31..01-01",valentine:"02-14..02-14",easter:"auto",halloween:"10-24..10-31"},s=["new_year","christmas","valentine","easter","halloween"],a=[31,29,31,30,31,30,31,31,30,31,30,31];function c(t){const e=/^(\d\d)-(\d\d)$/.exec(t.trim());if(!e)return;const i=Number(e[1]),n=Number(e[2]);return i<1||i>12||n<1||n>a[i-1]?void 0:{month:i,day:n}}function l(t){if("string"!=typeof t)return;const e=t.split("..");if(e.length>2)return;const i=c(e[0]),n=2===e.length?c(e[1]):i;return i&&n?{start:i,end:n}:void 0}const d=t=>100*t.month+t.day;function u(t,e){const i=d({month:t.getMonth()+1,day:t.getDate()}),n=d(e.start),o=d(e.end);return n<=o?i>=n&&i<=o:i>=n||i<=o}function h(t){const e=function(t){const e=t%19,i=Math.floor(t/100),n=t%100,o=Math.floor(i/4),r=i%4,s=Math.floor((i+8)/25),a=(19*e+i-o-Math.floor((i-s+1)/3)+15)%30,c=(32+2*r+2*Math.floor(n/4)-a-n%4)%7,l=Math.floor((e+11*a+22*c)/451),d=Math.floor((a+c-7*l+114)/31);return new Date(t,d-1,(a+c-7*l+114)%31+1)}(t),i=t=>{const i=new Date(e.getFullYear(),e.getMonth(),e.getDate()+t);return{month:i.getMonth()+1,day:i.getDate()}};return{start:i(-7),end:i(1)}}const m=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"],p={winter:"summer",summer:"winter",spring:"autumn",autumn:"spring"};function f(t){return"string"==typeof t&&"south"===t.trim().toLowerCase()?"south":"north"}function g(t,e={}){return function(t,e){for(const i of s){const n=e?.[i];if(!1===n||"string"==typeof n&&"off"===n.trim().toLowerCase())continue;const o="string"==typeof n&&"auto"!==n.trim().toLowerCase()&&l(n)?n:r[i],s="auto"===o?"easter"===i?h(t.getFullYear()):void 0:l(o);if(s&&u(t,s))return i}}(t,e.calendar)??function(t,e="north"){const i=m[t.getMonth()];return"south"===e?p[i]:i}(t,f(e.hemisphere))}const y={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"};function v(t){return t?y[t]:void 0}function b(t,e){if("below_horizon"===t||"above_horizon"===t)return"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=6?"dusk":"below_horizon"===t?"night":void 0}function _(t,e){try{const i=new Intl.DateTimeFormat("en-US",{timeZone:e,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(t),n=t=>Number(i.find(e=>e.type===t)?.value),o={y:n("year"),mo:n("month"),d:n("day"),h:n("hour")%24,mi:n("minute"),s:n("second")};return Object.values(o).every(Number.isFinite)?o:void 0}catch{return}}function w(t,e){const i=(0,n.cj)(e),o=i?_(t,i):void 0;return o?new Date(o.y,o.mo-1,o.d,o.h,o.mi,o.s,t.getMilliseconds()):t}function x(t,e){const i=(0,n.cj)(e),o=i?_(t,i):void 0;if(!o)return new Date(t.getFullYear(),t.getMonth(),t.getDate()+1,0,0,0,0);const r=1e3*(60*(60*o.h+o.mi)+o.s)+t.getMilliseconds();return new Date(t.getTime()+864e5-r)}const $=new Set(o);function k(t){if(null!=t&&!1!==t)return!0===t?{}:"string"==typeof t?{scene:t}:"object"!=typeof t||Array.isArray(t)?void 0:t}function M(t){const e=t?.combine;return(Array.isArray(e)?e:"string"==typeof e?[e]:[]).filter(t=>"string"==typeof t&&""!==t.trim())}function S(t,e,i,n){const o=void 0===t?"auto":t;return"auto"===o?g(i,e):"string"==typeof o&&$.has(o)?"weather"===o?function(t,e){return t.weather_entity?v(e?.states?.[t.weather_entity]?.state):void 0}(e,n):"daynight"===o?function(t){const e=t?.states?.["sun.sun"],i=e?.attributes?.elevation;return b(e?.state,"number"==typeof i?i:"string"==typeof i&&""!==i.trim()?Number(i):void 0)}(n):o:void 0}function A(t){const e="string"==typeof t&&t.includes("%");let i="number"==typeof t?t:"string"==typeof t&&/^\s*-?\d*\.?\d+\s*%?\s*$/.test(t)?parseFloat(t):NaN;return Number.isFinite(i)?(!e&&i>0&&i<=1&&(i*=100),Math.round(Math.min(100,Math.max(0,i)))/100):.5}function C(t,e,i,n={}){const o=k(t);if(n.localDay||(e=w(e,i)),!o)return;if(o.entity&&"off"===i?.states?.[o.entity]?.state)return;const r=[],s=t=>{t&&!r.includes(t)&&r.push(t)};s(S(o.scene,o,e,i));for(const t of M(o))s(S(t,o,e,i));return r.length?{scenes:r,layer:"front"===o.layer?"front":"back",intensity:A(o.intensity),decorations:!1!==o.decorations}:void 0}function z(t){const e=k(t);if(!e)return[];const i=q(e),n=[];return e.entity&&n.push(e.entity),e.weather_entity&&i.includes("weather")&&n.push(e.weather_entity),i.includes("daynight")&&n.push("sun.sun"),n}function q(t){return[t.scene??"auto",...M(t)]}i.d(e,["MX",0,o,"jF",0,r])},188(t,e,i){var n=i(6161),o=i(7804);class r extends o.WL{constructor(t){if(super(t),t.type!==o.OA.CHILD)throw new Error("selectValue goes inside a <select>")}render(t){return n.s6}update(t,[e]){const i=t.parentNode;return i&&"SELECT"===i.tagName&&i.value!==e&&(i.value=e),n.s6}}const s=(0,o.u$)(r);i.d(e,["m",0,s])},5767(t,e,i){i.d(e,{En:()=>a});var n=i(9639),o=i(1235);let r,s=!1;function a(){return r??=i.e(702).then(()=>i(2191)).then(t=>!!(0,o.t)("magic-card-shape-custom.js",t)&&((0,n.uD)(t.buildCustom),s=!0),t=>(console.warn("Magic Card: magic-card-shape-custom.js did not load",t),!1)),r}i.d(e,["Lu",0,()=>s])},9639(t,e,i){i.d(e,{TV:()=>R,aK:()=>J,dC:()=>d,ie:()=>T,j9:()=>U,kz:()=>v,q8:()=>H,uD:()=>D});const n=new Set(["custom","squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]),o=.5522847498,r=(Math.SQRT1_2,1.5),s={smoothing:.6,corner:16,amplitude:8,waves:3,seed:7,wobble:.25},a=(t,e,i)=>Math.min(i,Math.max(e,t)),c=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},l=(t,e)=>({x:t,y:e});function d(t,e){let i;return i="string"==typeof t&&/^\s*-?\d*\.?\d+\s*%\s*$/.test(t)?parseFloat(t)/100*e:"string"==typeof t&&/^\s*-?\d*\.?\d+\s*(px)?\s*$/i.test(t)?parseFloat(t):c(t),void 0!==i&&Number.isFinite(i)&&i>=0?i:void 0}const u=(t,e,i)=>l(t.x+(e.x-t.x)*i,t.y+(e.y-t.y)*i),h=(t,e)=>Math.hypot(e.x-t.x,e.y-t.y);function m(t,e){if(e<=0)return{start:t[0],segs:[...t.slice(1),t[0]].map(t=>({to:t}))};const i=t.length,n=t.map((n,o)=>{const r=t[(o+i-1)%i],s=t[(o+1)%i],a=Math.min(e,h(r,n)/3),c=Math.min(e,h(n,s)/3);return{v:n,a:u(n,r,a/(h(r,n)||1)),b:u(n,s,c/(h(n,s)||1))}}),o=[];return n.forEach((t,e)=>{o.push({c1:u(t.a,t.v,2/3),c2:u(t.b,t.v,2/3),to:t.b}),o.push({to:n[(e+1)%i].a})}),{start:n[0].a,segs:o}}function p(t,e,i){const n=[];for(let o=0;o+1<t.length;o++){const r=t[o],s=t[o+1];n.push({c1:l(r.x+e[o].x*i/3,r.y+e[o].y*i/3),c2:l(s.x-e[o+1].x*i/3,s.y-e[o+1].y*i/3),to:s})}return n}function f(t,e){const i=t.length;return t.map((n,o)=>{const r=e?t[(o+i-1)%i]:t[Math.max(0,o-1)],s=e?t[(o+1)%i]:t[Math.min(i-1,o+1)],a=e||o>0&&o<i-1?.5:1;return l((s.x-r.x)*a,(s.y-r.y)*a)})}function g(t,e,i,n,o){const r=[],s=l(i,0);let a=s;for(const[s,c]of y(t,e,i)){const t=v(s,c,i,n,o);h(a,t.from)>1e-9&&r.push({to:t.from}),r.push(...t.segs),a=r[r.length-1].to}return h(a,s)>1e-9&&r.push({to:s}),{start:s,segs:r}}const y=(t,e,i)=>[[l(t-i,i),-90],[l(t-i,e-i),0],[l(i,e-i),90],[l(i,i),180]];function v(t,e,i,n,r){const s=e=>{const o=e*Math.PI/180,r=Math.cos(o),s=Math.sin(o),a=2/n;return l(t.x+i*Math.sign(r)*Math.abs(r)**a,t.y+i*Math.sign(s)*Math.abs(s)**a)},a=s(e),c=e*Math.PI/180,d=(e+90)*Math.PI/180;if(2===n){const t=s(e+90);return{from:a,segs:[{c1:l(a.x-Math.sin(c)*i*o,a.y+Math.cos(c)*i*o),c2:l(t.x+Math.sin(d)*i*o,t.y-Math.cos(d)*i*o),to:t}]}}const u=[];for(let t=0;t<=r;t++)u.push(s(e+90*t/r));const h=f(u,!1),m=Math.hypot(h[0].x,h[0].y),g=Math.hypot(h[r].x,h[r].y);return h[0]=l(-Math.sin(c)*m,Math.cos(c)*m),h[r]=l(-Math.sin(d)*g,Math.cos(d)*g),{from:a,segs:p(u,h,1)}}const b=t=>.6*(1-.5**(1/t)),_=b(2);const w=(t,e)=>Math.max(t,Math.min(e.top,e.bottom)),x=(t,e)=>Math.max(t,Math.min(e.left,e.right)),$=t=>Math.max(0,(t-Math.min(70,.85*t))/2);function k(t,e,i,n){if(!(t>0))return{top:0,right:0,bottom:0,left:0};const o=2===e?.1:.25,r=Math.max(0,Math.min(t,$(n)-o)),s=t-Math.max(0,t**e-(t-r)**e)**(1/e),a=Math.min(Math.max(t*b(e),s),t*(1-.5**(1/e))),c=function(t,e,i){if(!(t>0)||i>=t)return 0;const n=t-Math.max(0,i);return t-Math.max(0,t**e-n**e)**(1/e)}(t,e,w(a,i))+o;return{top:a,right:c,bottom:a,left:c}}function M(t,e,i,n,o){const r=(t-Math.max(0,$(2*t)-.1))/(i*t),s=r<1?Math.sqrt(1-r*r):0,c=e-i*e*a(Math.min(1-_,s),o,1),l=a((e-w(c,n))/(i*e),0,1),d=t-i*t*Math.sqrt(1-l*l)+.1;return{top:c,right:d,bottom:c,left:d}}function S(t,e,i,n,u={top:0,right:0,bottom:0,left:0}){const y=Math.min(e,i),v=(t,e)=>a(d(n.corner,y)??t,0,e);switch(t){case"custom":return L?.(e,i,n);case"squircle":{const t=3+5*(1-a(c(n.smoothing)??s.smoothing,0,1)),o=v(y/2,y/2);return o<=0?{start:l(0,0),segs:[{to:l(e,0)},{to:l(e,i)},{to:l(0,i)}],inset:{top:0,right:0,bottom:0,left:0}}:{...g(e,i,o,t,16),inset:k(o,t,u,e)}}case"pill":{const t=y/2;return{...g(e,i,t,2,1),inset:k(t,2,u,e)}}case"circle":{const t=e/2,n=i/2,r=t*o,s=n*o,a=[{c1:l(t+r,0),c2:l(e,n-s),to:l(e,n)},{c1:l(e,n+s),c2:l(t+r,i),to:l(t,i)},{c1:l(t-r,i),c2:l(0,n+s),to:l(0,n)},{c1:l(0,n-s),c2:l(t-r,0),to:l(t,0)}];return{start:l(t,0),segs:a,inset:M(t,n,1,u,.5)}}case"notch":case"octagon":{const o=A(t,e,i,n),s=[l(o,0),l(e-o,0),l(e,o),l(e,i-o),l(e-o,i),l(o,i),l(0,i-o),l(0,o)],a="octagon"===t&&o>0?.2*r:0,c=o/4+a,d=Math.max(0,o-w(o/4,u))+2*a;return{...m(E(s),"octagon"===t?r:0),inset:{top:c,right:d,bottom:c,left:d}}}case"hexagon":{const{pts:t,c:o,wide:s}=z(e,i,n),a=o>0?.375:0,c=(t,e)=>Math.max(0,o*(1-2*t/e))+2*a,l=s?{top:a,right:c(w(a,u),i),bottom:a,left:c(w(a,u),i)}:{top:c(x(a,u),e),right:a,bottom:c(x(a,u),e),left:a};return{...m(E(t),r),inset:l}}case"ticket":{const t=v(s.corner,Math.min(i/2,e/4)),n=i/2,r=t*o,a=[{to:l(e,0)}];return t>0&&a.push({to:l(e,n-t)},{c1:l(e-r,n-t),c2:l(e-t,n-r),to:l(e-t,n)},{c1:l(e-t,n+r),c2:l(e-r,n+t),to:l(e,n+t)}),a.push({to:l(e,i)},{to:l(0,i)}),t>0&&a.push({to:l(0,n+t)},{c1:l(r,n+t),c2:l(t,n+r),to:l(t,n)},{c1:l(t,n-r),c2:l(r,n-t),to:l(0,n-t)}),a.push({to:l(0,0)}),{start:l(0,0),segs:T(l(0,0),a),inset:{top:0,right:t,bottom:0,left:t}}}case"wave":return function(t,e,i){const n=P.includes(i.edge)?i.edge:"bottom",r="all"===n,u=t=>r||n===t,m=Math.min(t,e),f="top"===n||"bottom"===n?e:t,g=a(d(i.amplitude,m)??s.amplitude,0,r?m/8:f/4),y=Math.round(c(i.waves)??s.waves),v=void 0!==c(i.phase),b=v?c(i.phase):0,_=[l(0,0),l(t,0),l(t,e),l(0,e)],w=[l(1,0),l(0,1),l(-1,0),l(0,-1)],x=[l(0,-1),l(1,0),l(0,1),l(-1,0)],$=["top","right","bottom","left"],k=r&&g>0?g:0,M=k*o,S=l(k,0),A=[];$.forEach((t,e)=>{const i=w[e],n=_[(e+1)%4],o=l(_[e].x+i.x*k,_[e].y+i.y*k),s=l(n.x-i.x*k,n.y-i.y*k);if(!u(t)||g<=0)A.push({to:s});else{const t=h(o,s),i=a(y,1,Math.max(1,Math.min(50,Math.floor(t/(2.5*g))))),n=x[e],c=8*i,d=r&&v,u=t=>{if(!d)return 1;const e=a(2*Math.min(t,1-t)*i,0,1);return e*e*(3-2*e)},m=t=>(g*Math.cos(2*Math.PI*(i*t+b))-g)*u(t),f=t=>{if(!d)return 2*-g*Math.PI*i*Math.sin(2*Math.PI*(i*t+b));const e=1e-5,n=Math.max(0,t-e),o=Math.min(1,t+e);return(m(o)-m(n))/(o-n)},_=[],w=[];for(let t=0;t<=c;t++){const e=t/c,i=m(e),r=f(e);_.push(l(o.x+(s.x-o.x)*e+n.x*i,o.y+(s.y-o.y)*e+n.y*i)),w.push(l(s.x-o.x+n.x*r,s.y-o.y+n.y*r))}v&&!r&&A.push({to:_[0]}),A.push(...p(_,w,1/c)),v&&!r&&A.push({to:s})}if(k>0){const t=w[(e+1)%4],o=l(n.x+t.x*k,n.y+t.y*k);A.push({c1:l(s.x+i.x*M,s.y+i.y*M),c2:l(o.x-t.x*M,o.y-t.y*M),to:o})}});const C=2*g;return{start:S,segs:A,inset:{top:u("top")?C:0,right:u("right")?C:0,bottom:u("bottom")?C:0,left:u("left")?C:0}}}(e,i,n);case"blob":return function(t,e,i,n){const o=a(c(i.wobble)??s.wobble,0,1),r=function(t){let e=t>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,1|t),t^=t+Math.imul(t^t>>>7,61|t),((t^t>>>14)>>>0)/4294967296}}(function(t){const e=c(t);return void 0!==e?Math.round(e):"string"==typeof t&&t?[...t].reduce((t,e)=>Math.imul(t,31)+e.charCodeAt(0)|0,7):s.seed}(i.seed)),d=t/2,u=e/2,h=[];for(let t=0;t<12;t++){const e=1-.5*o*r(),i=2*Math.PI*t/12-Math.PI/2;h.push(l(d+d*e*Math.cos(i),u+u*e*Math.sin(i)))}const m=function(t){const e=f(t,!0);return{start:t[0],segs:p([...t,t[0]],[...e,e[0]],1)}}(h);let g=1,y=m.start;for(const t of m.segs){const e=t.c1??y,i=t.c2??t.to;for(let n=1;n<=32;n++){const o=n/32,r=1-o,s=r*r*r*y.x+3*r*r*o*e.x+3*r*o*o*i.x+o*o*o*t.to.x,a=r*r*r*y.y+3*r*r*o*e.y+3*r*o*o*i.y+o*o*o*t.to.y;g=Math.min(g,Math.hypot((s-d)/d,(a-u)/u))}y=t.to}return{...m,inset:M(d,u,.99*g,n,.65)}}(e,i,n,u);default:return}}function A(t,e,i,n){const o=Math.min(e,i),r="notch"===t?s.corner:o/(2+Math.SQRT2);return a(d(n.corner,o)??r,0,o/2)}function C(t,e,i){const n=Math.min(t,e);return a(d(i.corner,n)??n/2,0,n/2)}function z(t,e,i){const n=Math.min(t,e),o=a(d(i.corner,n)??n/2*Math.tan(Math.PI/6),0,n/2),r=t>=e;return{pts:r?[l(o,0),l(t-o,0),l(t,e/2),l(t-o,e),l(o,e),l(0,e/2)]:[l(t/2,0),l(t,o),l(t,e-o),l(t/2,e),l(0,e-o),l(0,o)],c:o,wide:r}}const q=(t,e)=>{const i=t=>l(t.x+e,t.y+e);return{start:i(t.start),segs:t.segs.map(t=>t.c1&&t.c2?{c1:i(t.c1),c2:i(t.c2),to:i(t.to)}:{to:i(t.to)}),inset:t.inset}};function j(t,e,i,n,o){if(!(o>0))return S(t,e,i,n);const s=e-2*o,a=i-2*o;if(!(s>0&&a>0))return;if("custom"===t)return L?.(e,i,n,o);let c=n;if("notch"===t||"octagon"===t)c={...n,corner:Math.max(0,A(t,e,i,n)-(2-Math.SQRT2)*o)};else if("squircle"===t)c={...n,corner:Math.max(0,C(e,i,n)-o)};else if("hexagon"===t){const t=function(t,e){const i=t.length,n=t.map((n,o)=>{const r=t[(o+1)%i],s=h(n,r)||1,a=l(r.x-n.x,r.y-n.y);return{at:l(n.x-a.y/s*e,n.y+a.x/s*e),dir:a}}),o=n.map((t,e)=>{const o=n[(e+i-1)%i],r=o.dir.x*t.dir.y-o.dir.y*t.dir.x;if(Math.abs(r)<1e-12)return t.at;const s=((t.at.x-o.at.x)*t.dir.y-(t.at.y-o.at.y)*t.dir.x)/r;return l(o.at.x+o.dir.x*s,o.at.y+o.dir.y*s)});for(let t=0;t<i;t++){const e=o[t],r=o[(t+1)%i];if((r.x-e.x)*n[t].dir.x+(r.y-e.y)*n[t].dir.y<=1e-9)return}return o}(z(e,i,n).pts,o);if(t)return{...m(E(t),r),inset:{top:0,right:0,bottom:0,left:0}}}const d=S(t,s,a,c);return d&&q(d,o)}function E(t){const e=t.filter((e,i)=>h(e,t[(i+1)%t.length])>1e-9);return e.length>=3?e:t}function T(t,e){let i=t;return e.filter(t=>{const e=!!t.c1||h(i,t.to)>1e-9;return e&&(i=t.to),e})}const P=["top","right","bottom","left","all"];const N=t=>{const e=Math.round(100*t)/100;return String(Object.is(e,-0)?0:e)};function O(t,e,i){const n=t=>`${N(a(t.x,0,e))} ${N(a(t.y,0,i))}`,o=[`M${n(t.start)}`];for(const e of t.segs)o.push(e.c1&&e.c2?`C${n(e.c1)} ${n(e.c2)} ${n(e.to)}`:`L${n(e.to)}`);return o.push("Z"),o.join(" ")}function R(t,e,i,n){if(t.length<2)return"";const o=n?function(t){const e=t.length,i=t.slice(1).map((e,i)=>e.x-t[i].x),n=t.slice(1).map((e,n)=>i[n]>0?(e.y-t[n].y)/i[n]:0),o=t.map((t,i)=>0===i?n[0]:i===e-1?n[e-2]:n[i-1]*n[i]<=0?0:(n[i-1]+n[i])/2);for(let t=0;t<e-1;t++){if(0===n[t]){o[t]=0,o[t+1]=0;continue}const e=o[t]/n[t],i=o[t+1]/n[t],r=e*e+i*i;if(r>9){const s=3/Math.sqrt(r);o[t]=s*e*n[t],o[t+1]=s*i*n[t]}}return t.slice(1).map((e,n)=>{const r=t[n],s=i[n]/3;return{c1:l(r.x+s,r.y+o[n]*s),c2:l(e.x-s,e.y-o[n+1]*s),to:e}})}(t):t.slice(1).map(t=>({to:t}));return O({start:t[0],segs:o,inset:{top:0,right:0,bottom:0,left:0}},e,i).replace(/ Z$/,"")}let L;function D(t){L=t,I.clear()}const W=new WeakMap,I=new Map;function B(t,e,i,o,r=0,s){if(!((t,e,i)=>n.has(t)&&Number.isFinite(e)&&Number.isFinite(i)&&e>0&&i>0)(t,e,i))return;if("custom"===t&&!L)return;const a=o&&"object"==typeof o?o:{},c=s&&"custom"!==t?F(s):{top:0,right:0,bottom:0,left:0},l=`${t}|${e}|${i}|${r}|${c.top},${c.right},${c.bottom},${c.left}|${(t=>{let e=W.get(t);return void 0===e&&W.set(t,e=JSON.stringify(t)),e})(a)}`;if(I.has(l)){const t=I.get(l);return I.delete(l),I.set(l,t),t}const d=r>0?j(t,e,i,a,r):S(t,e,i,a,c),u=d?{d:O(d,e,i),inset:(h=d.inset,{top:Math.round(100*h.top)/100,right:Math.round(100*h.right)/100,bottom:Math.round(100*h.bottom)/100,left:Math.round(100*h.left)/100}),b:d,w:e,h:i}:void 0;var h;return I.set(l,u),I.size>256&&I.delete(I.keys().next().value),u}const F=t=>{const e=t=>"number"==typeof t&&Number.isFinite(t)&&t>0?Math.round(100*t)/100:0;return{top:e(t.top),right:e(t.right),bottom:e(t.bottom),left:e(t.left)}};function U(t,e,i,n={},o){const r=B(t,e,i,n,0,o);return r&&{d:r.d,inset:{...r.inset}}}function H(t,e,i,n,o){return B(t,e,i,n,Math.max(0,o))?.d}function J(t,e,i,n,o,r=.5){const s=B(t,e,i,n);if(!s)return;const c=s.poly??=function(t,e,i){const n=t=>l(a(t.x,0,e),a(t.y,0,i)),o=[n(t.start)];let r=o[0];for(const e of t.segs){const t=n(e.to);if(e.c1&&e.c2){const i=n(e.c1),s=n(e.c2);for(let e=1;e<=16;e++){const n=e/16,a=1-n;o.push(l(a*a*a*r.x+3*a*a*n*i.x+3*a*n*n*s.x+n*n*n*t.x,a*a*a*r.y+3*a*a*n*i.y+3*a*n*n*s.y+n*n*n*t.y))}}else o.push(t);r=t}return o}(s.b,e,i),d="top"===o||"bottom"===o,u=a(Number.isFinite(r)?r:.5,0,1)*(d?e:i),h=[];for(let t=0;t+1<c.length;t++){const e=c[t],i=c[t+1],[n,o,r,s]=d?[e.x,i.x,e.y,i.y]:[e.y,i.y,e.x,i.x];u<Math.min(n,o)-1e-9||u>Math.max(n,o)+1e-9||(Math.abs(o-n)<1e-9?h.push(r,s):h.push(r+(u-n)/(o-n)*(s-r)))}if(!h.length)return;const m="top"===o||"left"===o?Math.min(...h):Math.max(...h),p=t=>{const e=Math.round(100*t)/100;return Object.is(e,-0)?0:e};return d?{x:p(u),y:p(m)}:{x:p(m),y:p(u)}}i.d(e,["JM",0,s,"KY",0,y,"Tl",0,q,"p",0,l,"qE",0,a])},4243(t,e,i){i.d(e,{S:()=>r,l:()=>o});const n=new WeakMap;function o(t,e){if(!t.ref)return t;const i=(e?.library(t.ref)??e?.inline(t.ref))||{},o=n.get(t);if(o?.[0]===i)return o[1];const s=r(i,t);return n.set(t,[i,s]),s}function r(t,e){const i={...t,...e};return delete i.ref,t.corners&&e.corners&&(i.corners={...t.corners,...e.corners}),i}},8911(t,e,i){i.d(e,{E:()=>s});var n=i(6161),o=i(8003);const r=t=>t.stopPropagation();function s(t){const e=t.max-t.min,i=void 0===t.value||e<=0?0:Math.max(0,Math.min(1,(t.value-t.min)/e)),s=(e,i)=>{const n=e.getBoundingClientRect();return t.vertical?n.height?Math.max(0,Math.min(1,1-(i.clientY-n.top)/n.height)):0:n.width?Math.max(0,Math.min(1,(i.clientX-n.left)/n.width)):0},a=i=>(0,o.Ee)(t.min+i*e,t.min,t.max,t.step);return n.qy`
    <div
      class="mc-tile-slider ${t.vertical?"mc-tile-slider--vertical":""} ${t.className??""}"
      role="slider"
      tabindex=${t.disabled?-1:0}
      aria-label=${t.label}
      aria-valuemin=${t.min}
      aria-valuemax=${t.max}
      aria-valuenow=${t.value??n.s6}
      aria-valuetext=${t.valueText||n.s6}
      aria-orientation=${t.vertical?"vertical":"horizontal"}
      aria-disabled=${t.disabled?"true":"false"}
      style="--slider-value: ${i}; touch-action: ${t.vertical?"pan-x":"pan-y"}; ${t.style??""}"
      @pointerdown=${i=>{if(i.stopPropagation(),t.disabled||void 0!==i.button&&0!==i.button)return;const n=i.currentTarget,o=n.querySelector(".mc-tile-slider-bar"),r=i=>o?.style.setProperty("--slider-value",String((a(i)-t.min)/e)),c=i.clientX,l=i.clientY;let d=!1;const u=t=>{d=!0;try{n.setPointerCapture?.(t.pointerId)}catch{}n.classList.add("mc-dragging"),r(s(n,t))};"mouse"===i.pointerType&&u(i);const h=e=>{if(!d){const i=Math.abs(t.vertical?e.clientY-l:e.clientX-c),n=Math.abs(t.vertical?e.clientX-c:e.clientY-l);if(i<8||i<n)return;return void u(e)}r(s(n,e))},m=(i,r)=>{if(n.removeEventListener("pointermove",h),n.removeEventListener("pointerup",p),n.removeEventListener("pointercancel",f),n.classList.remove("mc-dragging"),o?.style.removeProperty("--slider-value"),!r)return;const c=a(s(n,i));n.style.setProperty("--slider-value",String((c-t.min)/e)),t.onCommit(c)},p=t=>{t.stopPropagation(),m(t,!0)},f=t=>m(t,!1);n.addEventListener("pointermove",h),n.addEventListener("pointerup",p),n.addEventListener("pointercancel",f)}}
      @pointerup=${r}
      @click=${r}
      @keydown=${i=>{if(i.stopPropagation(),t.disabled)return;const n=t.value??t.min,r=Math.max(t.step,e/10),s={ArrowRight:n+t.step,ArrowUp:n+t.step,ArrowLeft:n-t.step,ArrowDown:n-t.step,PageUp:n+r,PageDown:n-r,Home:t.min,End:t.max};if(!(i.key in s))return;i.preventDefault();const a=(0,o.Ee)(s[i.key],t.min,t.max,t.step);a!==t.value&&t.onCommit(a)}}
    >
      <div class="mc-tile-slider-background"></div>
      <div class="mc-tile-slider-bar"></div>
    </div>
  `}i.d(e,["i",0,r])},5888(t,e,i){var n=i(6161),o=i(7804),r=i(7924);class s extends o.WL{constructor(t){if(super(t),t.type!==o.OA.ATTRIBUTE)throw new Error("stableSrc is an attribute directive")}render(t){return t}update(t,[e]){const i=t.element.getAttribute(t.name);return i&&e&&i!==e&&(0,r.RW)(i,e)&&((o=t.element)instanceof HTMLImageElement?o.complete&&o.naturalWidth>0:o instanceof HTMLMediaElement&&o.readyState>0&&!o.error)?n.c0:e;var o}}const a=(0,o.u$)(s);i.d(e,["U",0,a])},9853(t,e,i){var n=i(7921),o=i(1476);const r=t=>{const e=(0,o.vt)(t);return"active"===e?.state&&void 0!==e.end&&e.end>Date.now()};class s extends n.Kq{render(t){return(0,o.HF)(t)??""}update(t,[e]){this._state=e;const i=t.parentNode,n=1===i?.nodeType?i:null;return n!==this._el&&(this._tick?.run(!1),this._el=n??void 0,this._tick=n?new o.bU(n,()=>{this.setValue(this.render(this._state)),r(this._state)||this._tick?.run(!1)}):void 0),this._tick?.run(this.isConnected&&r(e)),this.render(e)}disconnected(){this._tick?.run(!1)}reconnected(){this._tick?.run(r(this._state))}}const a=(0,n.u$)(s);i.d(e,["q",0,a])},1476(t,e,i){i.d(e,{HF:()=>a,bU:()=>d,vt:()=>s});var n=i(3852);const o=t=>!!t&&t.startsWith("timer.");function r(t){if("number"==typeof t)return Number.isFinite(t)&&t>=0?1e3*t:void 0;if("string"!=typeof t)return;const e=/^\s*(?:(\d+)\s+days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?\s*$/.exec(t);if(!e)return;const[,i,n,o,r]=e;return 1e3*(3600*(24*Number(i||0)+Number(n))+60*Number(o)+Number(r||0))}function s(t,e=Date.now()){if(!t||!o(t.entity_id))return;const i=t.attributes||{},n=r(i.duration),s=r(i.remaining),a=t.state;if("active"===a){const o="string"==typeof i.finishes_at?Date.parse(i.finishes_at):NaN;if(Number.isFinite(o))return{state:a,remaining:Math.max(0,o-e),total:n??s??0,end:o};if(void 0===s)return;const r="string"==typeof t.last_updated?Date.parse(t.last_updated):NaN;return Number.isFinite(r)?{state:a,remaining:Math.max(0,r+s-e),total:n??s,end:r+s}:{state:a,remaining:s,total:n??s}}return"paused"===a?void 0===s?void 0:{state:a,remaining:s,total:n??s}:{state:"idle",remaining:0,total:n??0}}function a(t,e=Date.now()){const i=s(t,e);if(i&&"idle"!==i.state)return function(t){const e=Math.max(0,Math.ceil(t/1e3)),i=Math.floor(e/3600),n=Math.floor(e%3600/60),o=String(e%60).padStart(2,"0");return i?`${i}:${String(n).padStart(2,"0")}:${o}`:`${n}:${o}`}(void 0!==i.end?i.end-e:i.remaining)}const c=new Set;let l;class d{constructor(t,e){this._el=t,this._cb=e,this._on=!1}run(t){t!==this._on&&(this._on=t,t?(0,n.jR)(this._el,t=>this._tick(t))||this._tick(!0):((0,n.eF)(this._el),this._tick(!1)))}_tick(t){var e;t&&!this._off?this._off=(e=this._cb,c.add(e),l??=setInterval(()=>c.forEach(t=>t()),1e3),()=>{c.delete(e),c.size||void 0===l||(clearInterval(l),l=void 0)}):!t&&this._off&&(this._off(),this._off=void 0)}}i.d(e,["Yj",0,(t,e=Date.now())=>{const i=void 0!==t.end?Math.max(0,t.end-e):t.remaining;return t.total>0?Math.min(1,i/t.total):0},"_7",0,o])},5520(t,e,i){i.d(e,{Ih:()=>u,dh:()=>h,mU:()=>m});var n=i(4727),o=i(9136),r=i(9639),s=i(2421);const a={color:"var(--mc-primary, var(--primary-color))",opacity:.25,areaOpacity:.18,lineOpacity:.45,hours:24,maxHours:168,lineWidth:1.5,maxPoints:60},c=["up","down","left","right"],l=t=>{const e="string"==typeof t&&""!==t.trim()?Number(t):t;return"number"==typeof e&&Number.isFinite(e)?e:void 0},d=(t,e)=>{const i=l(t);return void 0!==i&&i>0?i:e};function u(t,e){if(!t||"object"!=typeof t)return;if("fill"!==t.type&&"sparkline"!==t.type)return;const i=t.entity||e.entity;if(!i)return;const r=e.hass?.states?.[i],s=t.attribute||void 0,u=l(t.min),h=l(t.max),m="fill"===t.type,p=(0,o.w)(t.color),f={type:t.type,color:p?.stops[0]??(0,n.dU)(t.color,r)??a.color,paint:p&&t.color,opacity:(0,n.uM)(t.opacity)??(m?a.opacity:a.areaOpacity),direction:c.includes(t.direction)?t.direction:"up",wave:!1!==t.wave,hours:Math.min(a.maxHours,d(t.hours,a.hours)),lineWidth:d(t.line_width,a.lineWidth),area:!1!==t.area,smoothing:!1!==t.smoothing,entity:i};return m&&(f.level=(0,n.EN)(r,s,u,h)),s&&(f.attribute=s),void 0!==u&&(f.min=u),void 0!==h&&(f.max=h),f}function h(t,e,i,n){const o=(Array.isArray(t)?t:[]).filter(t=>t&&Number.isFinite(t.t)&&Number.isFinite(t.v)).sort((t,e)=>t.t-e.t);if(!o.length||!(e>0&&i>0))return{line:""};const c=l(n.start)??o[0].t,d=l(n.end)??o[o.length-1].t;if(!(d>c))return{line:""};const u=o.filter(t=>t.t<=d).map(t=>({t:Math.max(t.t,c),v:t.v}));if(!u.length)return{line:""};const h=a.maxPoints-1;let m=u.length>h?(0,s.pz)(u,c,d,h):u;m!==u&&m.length&&(m[0]={t:Math.min(m[0].t,u[0].t),v:m[0].v}),m=m.filter((t,e)=>e===m.length-1||m[e+1].t>t.t);const p=l(n.hold)??u[u.length-1].v,f=m[m.length-1].t<d;if(f&&m.push({t:d,v:p}),m.length<2)return{line:""};let g=1/0,y=-1/0;for(const t of m)t.v<g&&(g=t.v),t.v>y&&(y=t.v);let v=l(n.min),b=l(n.max);void 0!==v&&void 0!==b&&v>b&&([v,b]=[b,v]);const _=v??Math.min(g,b??g),w=(b??Math.max(y,v??y))-_,x=void 0===v&&void 0===b?.5:void 0===b?0:void 0===v?1:.5,$=Math.min(Math.max(0,l(n.pad)??2),i/4),k=m.map(t=>{return{x:(t.t-c)/(d-c)*e,y:i-$-(n=t.v,(w>0?Math.min(1,Math.max(0,(n-_)/w)):x)*(i-2*$))};var n}),M=(0,r.TV)(k,e,i,n.smoothing);if(!M)return{line:""};const S=t=>String(Math.round(100*t)/100),A={line:M};if(n.splitHeld&&f){const t=k[k.length-2],o=k[k.length-1];A.line=k.length>2?(0,r.TV)(k.slice(0,-1),e,i,n.smoothing):"",A.tail=`M${S(t.x)} ${S(t.y)} L${S(o.x)} ${S(o.y)}`}return n.area&&(A.area=`${M} L${S(k[k.length-1].x)} ${S(i)} L${S(k[0].x)} ${S(i)} Z`),A}function m(t,e,i){const n=(Array.isArray(t)?t:[]).filter(t=>t&&Number.isFinite(t.t)&&Number.isFinite(t.v)&&t.t<=i).sort((t,e)=>t.t-e.t).map(t=>({t:Math.max(t.t,e),v:t.v}));if(!n.length)return{points:[]};const o=n[n.length-1].v,r=a.maxPoints-2;if(n.length<=r||!(i>e))return{points:n,last:o};const c=(0,s.pz)(n,e,i,r);return c.length&&(c[0]={t:Math.min(c[0].t,n[0].t),v:c[0].v}),{points:c,last:o}}i.d(e,["BJ",0,a])},8764(t,e,i){i.d(e,["x",0,"2026.10.11-beta.2"])},3826(t,e,i){const n=globalThis,o=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;class a{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}}const c=t=>new a("string"==typeof t?t:t+"",void 0,r),l=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return c(e)})(t):t;i.d(e,["AH",0,(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new a(i,t,r)},"Rf",0,(t,e)=>{if(o)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=n.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}},"iz",0,c,"sk",0,l])},6505(t,e,i){i.d(e,["E",0,t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)}])},5694(t,e,i){i.d(e,{M:()=>s});var n=i(8760);const o={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},r=(t=o,e,i)=>{const{kind:n,metadata:r}=i;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,o,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const o=this[n];e.call(this,i),this.requestUpdate(n,o,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function s(t){return(e,i)=>"object"==typeof i?r(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}},4290(t,e,i){i.d(e,{w:()=>o});var n=i(5694);function o(t){return(0,n.M)({...t,state:!0,attribute:!1})}},8760(t,e,i){i.d(e,{AH:()=>n.AH,iz:()=>n.iz,mN:()=>v});var n=i(3826);const{is:o,defineProperty:r,getOwnPropertyDescriptor:s,getOwnPropertyNames:a,getOwnPropertySymbols:c,getPrototypeOf:l}=Object,d=globalThis,u=d.trustedTypes,h=u?u.emptyScript:"",m=d.reactiveElementPolyfillSupport,p=(t,e)=>t,f={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},g=(t,e)=>!o(t,e),y={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;class v extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&r(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:o}=s(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const r=n?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(p("elementProperties")))return;const t=l(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(p("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(p("properties"))){const t=this.properties,e=[...a(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift((0,n.sk)(t))}else void 0!==t&&e.push((0,n.sk)(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return(0,n.Rf)(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:f;this._$Em=n;const r=o.fromAttribute(e,t.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(t,e,i,n=!1,o){if(void 0!==t){const r=this.constructor;if(!1===n&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??g)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}}v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[p("elementProperties")]=new Map,v[p("finalized")]=new Map,m?.({ReactiveElement:v}),(d.reactiveElementVersions??=[]).push("2.1.2"),i.d(e,["Ec",0,g,"W3",0,f])},5228(t,e,i){i.d(e,{AH:()=>n.AH,JW:()=>o.JW,WF:()=>s,c0:()=>o.c0,iz:()=>n.iz,qy:()=>o.qy,s6:()=>o.s6});var n=i(8760),o=i(6752);const r=globalThis;class s extends n.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=(0,o.XX)(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return o.c0}}s._$litElement$=!0,s.finalized=!0,r.litElementHydrateSupport?.({LitElement:s});const a=r.litElementPolyfillSupport;a?.({LitElement:s});(r.litElementVersions??=[]).push("4.2.2")},6201(t,e,i){i.d(e,{Kq:()=>u,OA:()=>o.OA,u$:()=>o.u$});var n=i(8504),o=i(7804);const r=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),r(t,e);return!0},s=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},a=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),d(e)}};function c(t){void 0!==this._$AN?(s(this),this._$AM=t,a(this)):this._$AM=t}function l(t,e=!1,i=0){const n=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(e)if(Array.isArray(n))for(let t=i;t<n.length;t++)r(n[t],!1),s(n[t]);else null!=n&&(r(n,!1),s(n));else r(this,t)}const d=t=>{t.type==o.OA.CHILD&&(t._$AP??=l,t._$AQ??=c)};class u extends o.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),a(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(r(this,t),s(this))}setValue(t){if((0,n.Rt)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}},8504(t,e,i){var n=i(6752);const{I:o}=n.ge,r=t=>t,s=()=>document.createComment(""),a={};i.d(e,["Dx",0,(t,e,i)=>{const n=t._$AA.parentNode,a=void 0===e?t._$AB:e._$AA;if(void 0===i){const e=n.insertBefore(s(),a),r=n.insertBefore(s(),a);i=new o(e,r,t,t.options)}else{const e=i._$AB.nextSibling,o=i._$AM,s=o!==t;if(s){let e;i._$AQ?.(t),i._$AM=t,void 0!==i._$AP&&(e=t._$AU)!==o._$AU&&i._$AP(e)}if(e!==a||s){let t=i._$AA;for(;t!==e;){const e=r(t).nextSibling;r(n).insertBefore(t,a),t=e}}}return i},"KO",0,t=>{t._$AR(),t._$AA.remove()},"Rt",0,t=>void 0===t.strings,"cN",0,t=>t._$AH,"lx",0,(t,e,i=t)=>(t._$AI(e,i),t),"mY",0,(t,e=a)=>t._$AH=e])},7804(t,e,i){i.d(e,{WL:()=>n});class n{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}i.d(e,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,t=>(...e)=>({_$litDirective$:t,values:e})])},68(t,e,i){i.d(e,{D:()=>r});var n=i(6752),o=i(7804);class r extends o.WL{constructor(t){if(super(t),this.it=n.s6,t.type!==o.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===n.s6||null==t)return this._t=void 0,this.it=t;if(t===n.c0)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;const s=(0,o.u$)(r);i.d(e,["_",0,s])},6752(t,e,i){const n=globalThis,o=t=>t,r=n.trustedTypes,s=r?r.createPolicy("lit-html",{createHTML:t=>t}):void 0,a="$lit$",c=`lit$${Math.random().toFixed(9).slice(2)}$`,l="?"+c,d=`<${l}>`,u=document,h=()=>u.createComment(""),m=t=>null===t||"object"!=typeof t&&"function"!=typeof t,p=Array.isArray,f=t=>p(t)||"function"==typeof t?.[Symbol.iterator],g="[ \t\n\f\r]",y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,b=/>/g,_=RegExp(`>|${g}(?:([^\\s"'>=/]+)(${g}*=${g}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),w=/'/g,x=/"/g,$=/^(?:script|style|textarea|title)$/i,k=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),M=k(1),S=k(2),A=(k(3),Symbol.for("lit-noChange")),C=Symbol.for("lit-nothing"),z=new WeakMap,q=u.createTreeWalker(u,129);function j(t,e){if(!p(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s?s.createHTML(e):e}const E=(t,e)=>{const i=t.length-1,n=[];let o,r=2===e?"<svg>":3===e?"<math>":"",s=y;for(let e=0;e<i;e++){const i=t[e];let l,u,h=-1,m=0;for(;m<i.length&&(s.lastIndex=m,u=s.exec(i),null!==u);)m=s.lastIndex,s===y?"!--"===u[1]?s=v:void 0!==u[1]?s=b:void 0!==u[2]?($.test(u[2])&&(o=RegExp("</"+u[2],"g")),s=_):void 0!==u[3]&&(s=_):s===_?">"===u[0]?(s=o??y,h=-1):void 0===u[1]?h=-2:(h=s.lastIndex-u[2].length,l=u[1],s=void 0===u[3]?_:'"'===u[3]?x:w):s===x||s===w?s=_:s===v||s===b?s=y:(s=_,o=void 0);const p=s===_&&t[e+1].startsWith("/>")?" ":"";r+=s===y?i+d:h>=0?(n.push(l),i.slice(0,h)+a+i.slice(h)+c+p):i+c+(-2===h?e:p)}return[j(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class T{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let o=0,s=0;const d=t.length-1,u=this.parts,[m,p]=E(t,e);if(this.el=T.createElement(m,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=q.nextNode())&&u.length<d;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(a)){const e=p[s++],i=n.getAttribute(t).split(c),r=/([.?@])?(.*)/.exec(e);u.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?L:"?"===r[1]?D:"@"===r[1]?W:R}),n.removeAttribute(t)}else t.startsWith(c)&&(u.push({type:6,index:o}),n.removeAttribute(t));if($.test(n.tagName)){const t=n.textContent.split(c),e=t.length-1;if(e>0){n.textContent=r?r.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],h()),q.nextNode(),u.push({type:2,index:++o});n.append(t[e],h())}}}else if(8===n.nodeType)if(n.data===l)u.push({type:2,index:o});else{let t=-1;for(;-1!==(t=n.data.indexOf(c,t+1));)u.push({type:7,index:o}),t+=c.length-1}o++}}static createElement(t,e){const i=u.createElement("template");return i.innerHTML=t,i}}function P(t,e,i=t,n){if(e===A)return e;let o=void 0!==n?i._$Co?.[n]:i._$Cl;const r=m(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=o:i._$Cl=o),void 0!==o&&(e=P(t,o._$AS(t,e.values),o,n)),e}class N{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??u).importNode(e,!0);q.currentNode=n;let o=q.nextNode(),r=0,s=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new O(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new I(o,this,t)),this._$AV.push(e),a=i[++s]}r!==a?.index&&(o=q.nextNode(),r++)}return q.currentNode=u,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class O{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),m(t)?t===C||null==t||""===t?(this._$AH!==C&&this._$AR(),this._$AH=C):t!==this._$AH&&t!==A&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):f(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==C&&m(this._$AH)?this._$AA.nextSibling.data=t:this.T(u.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=T.createElement(j(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new N(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=z.get(t.strings);return void 0===e&&z.set(t.strings,e=new T(t)),e}k(t){p(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const o of t)n===e.length?e.push(i=new O(this.O(h()),this.O(h()),this,this.options)):i=e[n],i._$AI(o),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=o(t).nextSibling;o(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,o){this.type=1,this._$AH=C,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=C}_$AI(t,e=this,i,n){const o=this.strings;let r=!1;if(void 0===o)t=P(this,t,e,0),r=!m(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{const n=t;let s,a;for(t=o[0],s=0;s<o.length-1;s++)a=P(this,n[i+s],e,s),a===A&&(a=this._$AH[s]),r||=!m(a)||a!==this._$AH[s],a===C?t=C:t!==C&&(t+=(a??"")+o[s+1]),this._$AH[s]=a}r&&!n&&this.j(t)}j(t){t===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class L extends R{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===C?void 0:t}}class D extends R{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==C)}}class W extends R{constructor(t,e,i,n,o){super(t,e,i,n,o),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??C)===A)return;const i=this._$AH,n=t===C&&i!==C||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==C&&(i===C||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class I{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}}const B={M:a,P:c,A:l,C:1,L:E,R:N,D:f,V:P,I:O,H:R,N:D,U:W,B:L,F:I},F=n.litHtmlPolyfillSupport;F?.(T,O),(n.litHtmlVersions??=[]).push("3.3.3");i.d(e,["JW",0,S,"XX",0,(t,e,i)=>{const n=i?.renderBefore??e;let o=n._$litPart$;if(void 0===o){const t=i?.renderBefore??null;n._$litPart$=o=new O(e.insertBefore(h(),t),t,void 0,i??{})}return o._$AI(t),o},"c0",0,A,"ge",0,B,"qy",0,M,"s6",0,C])},7921(t,e,i){i.d(e,{Kq:()=>n.Kq,OA:()=>n.OA,u$:()=>n.u$});var n=i(6201)},5707(t,e,i){i.d(e,{EM:()=>n.E,MZ:()=>o.M,wk:()=>r.w});var n=i(6505),o=i(5694),r=i(4290)},6161(t,e,i){i.d(e,{AH:()=>n.AH,JW:()=>n.JW,WF:()=>n.WF,c0:()=>n.c0,iz:()=>n.iz,qy:()=>n.qy,s6:()=>n.s6});i(8760),i(6752);var n=i(5228)}};const e={};function i(n){const o=e[n];if(void 0!==o)return o.exports;const r=e[n]={exports:{}};return t[n](r,r.exports,i),r.exports}i.m=t,i.d=(t,e)=>{if(Array.isArray(e))for(var n=0;n<e.length;){var o=e[n++],r=e[n++],s=0===r?{enumerable:!0,value:e[n++]}:{enumerable:!0,get:r};i.o(t,o)||Object.defineProperty(t,o,s)}else for(var o in e)i.o(e,o)&&!i.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},i.f={},i.e=t=>{const e=[];return i.f.j(t,e),Promise.all(e)},i.u=t=>"magic-card-"+{8:"editor",167:"svg-editor",195:"svg-booleans",199:"seasonal",234:"transfer",249:"i18n-labels",300:"particles",342:"i18n-icons",368:"path-tools",427:"modules-extra",436:"slider",494:"preset-catalogue",575:"path-canvas",702:"shape-custom",734:"icon-animator",764:"markdown",811:"anim-runtime",820:"shape-editor"}[t]+".js?v="+{8:"e12befa5",167:"ab6737f8",195:"9dbdf434",199:"101d1ac2",234:"6fdd7b13",249:"1ec182c6",300:"65ab1498",342:"8df0047c",368:"34137fea",427:"d579284d",436:"b691b25f",494:"2c113c47",575:"934ccac2",702:"03cba250",734:"5e4c7a03",764:"a587d90a",811:"daa99d66",820:"d36d6a53"}[t],i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),i.r=t=>{Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.p="",(()=>{const t={143:0},e=e=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:o,__webpack_esm_runtime__:r}=e;var s,a,c=0;for(s in o)i.o(o,s)&&(i.m[s]=o[s]);for(r&&r(i);c<n.length;c++)a=n[c],i.o(t,a)&&t[a]&&t[a][0](),t[a]=0};i.f.j=(n,o)=>{let r=i.o(t,n)?t[n]:void 0;if(0!==r)if(r)o.push(r[1]);else{let s=import(i.p+i.u(n)).then(e,e=>{throw 0!==t[n]&&(t[n]=void 0),e});s=Promise.race([s,new Promise(e=>r=t[n]=[e])]),o.push(r[1]=s)}}})();var n=i(8764),o=i(9095),r=i(2675),s=i(6161),a=i(5707),c=i(8904),l=i(2641),d=i(5514),u=i(6370),h=i(7097);const m={...d.S,...u.Tb,...h.H},p={...d._,...u.bh,...h.D},f={...u.I3};function g(t,e,i=!1){const n=(0,l.e2)(e),o=`var(--mca-${e}-c, var(--mc-anim-c))`;return t.replace(/\$i/g,`var(--mca-${e}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${o} calc(var(--mca-${e}-s, 1) * 100%), transparent)`:o)}const y=s.AH`
  [data-mc-anim],
  [data-mc-anim-fx] {
    --mc-anim-c: var(--mc-anim-color, var(--mc-design-color, var(--primary-color, #03a9f4)));
  }

  [data-mc-anim~='module'] {
    animation: var(--mc-anim-m);
    transform-origin: var(--mc-anim-om, center);
  }

  /* Transforms need a box (ha-icon is inline). inline-block, not inline-flex: a flex container's
     baseline is synthesized from its bottom edge (ha-svg-icon has no text baseline), which drops the
     module's baseline to the icon's bottom and adds the line's descent under it (+4px stretch).
     As a flex item it blockifies to block, the same box an unanimated ha-icon gets. */
  [data-mc-anim~='icon'] .mc-anim-icon {
    display: inline-block;
    animation: var(--mc-anim-i);
    transform-origin: var(--mc-anim-oi, center);
  }

  /* a module without its icon (a button with no icon set) animates itself with both lists */
  [data-mc-anim~='icon']:not(:has(.mc-anim-icon)) {
    animation: var(--mc-anim-mi);
    transform-origin: var(--mc-anim-om, var(--mc-anim-oi, center));
  }

  /* particle layers: decorative, behind the content (front: above), clipped to the wrapper's shape */
  [data-mc-anim-fx] {
    position: relative;
    isolation: isolate;
  }
  .mc-anim-fx {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;
    container-type: size;
  }
  .mc-anim-fx[data-front] {
    z-index: auto;
  }
  .mc-anim-fx > i {
    position: absolute;
    display: block;
    left: var(--mc-anim-x, 50%);
    opacity: 0;
    will-change: translate, scale, rotate, opacity;
    animation: var(--mc-fx-anim);
    animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-phase, 0) * var(--mc-fx-dur, 1s));
  }

  /* On tap: the element plays its tap list (after its own) once per tap, from data-mc-tapped */
  [data-mc-tap][data-mc-tapped] {
    animation: var(--mc-anim-m, none), var(--mc-anim-t);
    transform-origin: var(--mc-anim-om, center);
  }
  /* tap layers stay hidden until a tap starts them (at the pointer: --mc-tap-x / -y) */
  .mc-anim-fx[data-tap]:not([data-tapped]),
  .mc-anim-ring[data-tap]:not([data-tapped]) {
    display: none;
  }

  ${(0,s.iz)([...Object.entries(m).map(([t,e])=>`@keyframes mc-anim-${t} {${g(e,t.replace(/-icon$/,""),!0)}\n}`),...l.u7.filter(t=>void 0!==t.particles).map(t=>`.mc-anim-fx[data-fx="${t.id}"] {\n  opacity: var(--mca-${t.id}-s, 1);\n}`),...Object.entries(f).map(([t,e])=>`.mc-anim-fx[data-fx="${t}"] {${g(e,t)}\n}`),...Object.entries(p).map(([t,e])=>{const[i,n=""]=t.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${g(e,i)}\n}`})].join("\n"))}

  @media (prefers-reduced-motion: reduce) {
    [data-mc-anim],
    [data-mc-anim] .mc-anim-icon,
    [data-mc-tap],
    .mc-anim-fx > i {
      animation: none !important;
    }
    .mc-anim-fx:not([data-p]),
    .mc-anim-ring {
      display: none;
    }
  }
`,v=s.AH`
  /* live dashboard: the card itself is out of the flow, zero size (the dialog is in the top layer) */
  :host([data-mc-popup-hidden]) {
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    overflow: visible;
  }

  /* editor: inline card, marked as a pop-up */
  :host([data-mc-popup-editor]) {
    position: relative;
  }
  /* on the card's top edge, so it covers as little of the content as possible */
  .mc-popup-badge {
    position: absolute;
    top: -12px;
    right: 12px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 10px;
    border-radius: 9999px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: color-mix(in srgb, var(--card-background-color, #fff) 92%, transparent);
    color: var(--secondary-text-color, #5f6368);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    --mdc-icon-size: 14px;
  }

  dialog.mc-popup {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--primary-text-color);
    overflow: hidden;
    outline: none;
  }
  dialog.mc-popup:not([open]) {
    display: none;
  }
  dialog.mc-popup::backdrop {
    background: transparent;
  }

  .mc-popup-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, var(--mc-popup-backdrop-opacity, 0.4));
    -webkit-backdrop-filter: blur(var(--mc-popup-blur, 8px));
    backdrop-filter: blur(var(--mc-popup-blur, 8px));
    opacity: 1;
    transition: opacity 0.28s ease-out;
  }
  dialog.mc-popup[data-phase='closing'] .mc-popup-backdrop {
    opacity: 0;
  }

  .mc-popup-frame {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
    box-sizing: border-box;
  }
  dialog.mc-popup[data-style='sheet'] .mc-popup-frame {
    align-items: flex-end;
    padding-top: max(16px, env(safe-area-inset-top));
  }
  dialog.mc-popup[data-style='dialog'] .mc-popup-frame {
    align-items: center;
    padding: 16px;
  }

  ha-card.mc-popup-surface {
    pointer-events: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--mc-popup-width, 600px);
    max-height: min(var(--mc-popup-max-height, 90vh), 100%);
    height: auto;
    overflow: hidden;
    outline: none;
    border-radius: var(--mc-popup-radius, var(--ha-card-border-radius, 12px));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
  }
  dialog.mc-popup[data-style='sheet'] ha-card.mc-popup-surface {
    border-radius: var(--mc-popup-radius, 24px) var(--mc-popup-radius, 24px) 0 0;
    border-bottom-width: 0;
    padding-bottom: env(safe-area-inset-bottom);
    transform: translateY(var(--mc-popup-drag, 0px));
    transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  dialog.mc-popup[data-style='sheet'][data-phase='closing'] ha-card.mc-popup-surface {
    transform: translateY(100%);
    transition-duration: 0.28s;
    transition-timing-function: ease-in;
  }
  dialog.mc-popup[data-style='dialog'] ha-card.mc-popup-surface {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }
  dialog.mc-popup[data-style='dialog'][data-phase='closing'] ha-card.mc-popup-surface {
    opacity: 0;
    transform: scale(0.96);
  }
  ha-card.mc-popup-surface[data-dragging] {
    transition: none;
  }
  @starting-style {
    dialog.mc-popup[data-style='sheet'][data-phase='open'] ha-card.mc-popup-surface {
      transform: translateY(100%);
    }
    dialog.mc-popup[data-style='dialog'][data-phase='open'] ha-card.mc-popup-surface {
      opacity: 0;
      transform: scale(0.96);
    }
    dialog.mc-popup[data-phase='open'] .mc-popup-backdrop {
      opacity: 0;
    }
  }

  .mc-popup-head {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 8px 0 16px;
    box-sizing: border-box;
  }
  dialog.mc-popup[data-style='sheet'] .mc-popup-head {
    padding-top: 16px;
    touch-action: none;
    cursor: grab;
  }
  dialog.mc-popup[data-style='sheet'] ha-card[data-dragging] .mc-popup-head {
    cursor: grabbing;
  }
  .mc-popup-handle {
    position: absolute;
    top: 6px;
    left: 50%;
    width: 36px;
    height: 4px;
    margin-left: -18px;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--primary-text-color, #212121) 28%, transparent);
  }
  .mc-popup-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: var(--ha-card-header-font-size, 1.125rem);
    font-weight: 500;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }
  .mc-popup-close {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    color: var(--secondary-text-color, #5f6368);
    cursor: pointer;
    transition: background-color 0.15s ease-out;
  }
  .mc-popup-close:hover {
    background: color-mix(in srgb, var(--primary-text-color, #212121) 8%, transparent);
  }
  .mc-popup-close:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .mc-popup-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  @media (prefers-reduced-motion: reduce) {
    .mc-popup-backdrop,
    dialog.mc-popup ha-card.mc-popup-surface,
    dialog.mc-popup[data-phase='closing'] ha-card.mc-popup-surface {
      transition: none;
    }
  }
`,b=s.AH`
  svg.mc-wx {
    display: inline-block;
    flex: none;
    width: var(--mdc-icon-size, 24px);
    height: var(--mdc-icon-size, 24px);
    overflow: visible;
    vertical-align: middle;
  }
  .mc-wx .wx-rays {
    transform-box: fill-box;
    transform-origin: center;
    animation: mc-wx-spin 20s linear infinite;
  }
  .mc-wx .wx-cloud {
    animation: mc-wx-drift 6s ease-in-out infinite alternate;
  }
  .mc-wx .wx-cloud-back {
    animation-delay: -3s;
    animation-direction: alternate-reverse;
  }
  .mc-wx .wx-drop {
    animation: mc-wx-rain 0.9s linear infinite;
  }
  .mc-wx .wx-flake {
    animation: mc-wx-snow 2.4s linear infinite;
  }
  .mc-wx .wx-hail {
    animation: mc-wx-hail 0.7s cubic-bezier(0.5, 0, 1, 1) infinite;
  }
  .mc-wx .wx-bolt {
    animation: mc-wx-flash 4s linear infinite;
  }
  .mc-wx .wx-fog {
    animation: mc-wx-fog 4s ease-in-out infinite alternate;
  }
  .mc-wx .wx-wind {
    stroke-dasharray: 82 18;
    animation: mc-wx-wind 2.4s linear infinite;
  }
  .mc-wx .wx-star {
    transform-box: fill-box;
    transform-origin: center;
    animation: mc-wx-twinkle 3s ease-in-out infinite;
  }
  .mc-wx .wx-alert {
    animation: mc-wx-alert 2s ease-in-out infinite;
  }
  @keyframes mc-wx-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes mc-wx-drift {
    from { transform: translateX(-2px); }
    to { transform: translateX(2px); }
  }
  @keyframes mc-wx-rain {
    from { transform: translateY(-5px); opacity: 0; }
    30% { opacity: 1; }
    to { transform: translateY(9px); opacity: 0; }
  }
  @keyframes mc-wx-snow {
    0% { transform: translate(0, -5px); opacity: 0; }
    25% { transform: translate(1.5px, -1px); opacity: 1; }
    50% { transform: translate(-1.5px, 3px); }
    75% { transform: translate(1.5px, 7px); opacity: 1; }
    100% { transform: translate(0, 11px); opacity: 0; }
  }
  @keyframes mc-wx-hail {
    from { transform: translateY(-4px); opacity: 0; }
    20% { opacity: 1; }
    to { transform: translateY(12px); opacity: 0.2; }
  }
  @keyframes mc-wx-flash {
    0%, 84%, 90%, 100% { opacity: 1; }
    86%, 92% { opacity: 0.15; }
  }
  @keyframes mc-wx-fog {
    from { transform: translateX(-3px); }
    to { transform: translateX(3px); }
  }
  @keyframes mc-wx-wind {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes mc-wx-twinkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.6); }
  }
  @keyframes mc-wx-alert {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
  /* Off-screen (shared IntersectionObserver): every animation pauses. */
  .mc-wx[offscreen] * {
    animation-play-state: paused;
  }
  /* Reduced motion: the still frame (drops, flakes and lines where they are drawn). */
  @media (prefers-reduced-motion: reduce) {
    .mc-wx * {
      animation: none !important;
    }
  }
`,_=(0,s.iz)(["filter:","backdrop-filter:","-webkit-backdrop-filter:","opacity:","transform:","translate:","scale:","rotate:","isolation:","mix-blend-mode:","clip-path:","-webkit-clip-path:","mask","-webkit-mask","will-change:","contain:","perspective:"].flatMap(t=>[`[style^='${t}']`,`[style*='; ${t}']`,`[style*=';${t}']`]).join(", ")),w=s.AH`
  .mc-card-content[data-mc-flows] {
    position: relative;
    isolation: isolate;
  }
  .mc-card-content[data-mc-flows]
    :is(.mc-row, .mc-column):is(
      [data-mc-anim],
      [data-mc-anim-fx],
      [data-mc-value-bg],
      ${_},
      :has(> .mc-module-wrapper > .mc-video-bg--media)
    ) {
    position: relative;
    z-index: 1;
  }
  /* no specificity: the video-bg wrapper's own position / z-index (css.ts) still win */
  :where(.mc-card-content[data-mc-flows]) .mc-module-wrapper {
    position: relative;
    z-index: 1;
  }
  /* a shaped element's shadow wrapper is a stacking context (filter): lifted like a wrapper; a
     shaped row / column (clip-path) like the containers above */
  :where(.mc-card-content[data-mc-flows]) .mc-shape-shadow,
  .mc-card-content[data-mc-flows] :is(.mc-row, .mc-column)[data-mc-shape] {
    position: relative;
    z-index: 1;
  }
`,x=s.AH`
  :host {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
  }
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  svg.back {
    z-index: 0;
  }
  svg.front,
  .labels {
    z-index: 2;
  }
  .labels {
    position: absolute;
    inset: 0;
  }
  path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  /* while dots move the line is their track (same colour, lighter): the dots stay visible on it */
  .flow[data-dots] .line {
    stroke-opacity: var(--mc-flow-track-opacity, 0.55);
  }
  :host([dark]) .flow[data-dots] .line {
    stroke-opacity: var(--mc-flow-track-opacity, 0.4);
  }
  .dot,
  .glow {
    offset-rotate: 0deg;
    animation-name: mc-flow-dot;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  .dash {
    stroke-linecap: butt;
    animation-name: mc-flow-dash;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
  @keyframes mc-flow-dot {
    from {
      offset-distance: 0%;
    }
    to {
      offset-distance: 100%;
    }
  }
  @keyframes mc-flow-dash {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: var(--mc-flow-shift);
    }
  }
  .glow {
    opacity: 0.3;
  }
  /* studio canvas: the selected flow (editor accent halo under its line) */
  .sel {
    stroke: var(--primary-color, #03a9f4);
    stroke-opacity: 0.35;
  }
  /* off-screen (shared IntersectionObserver, src/icons/offscreen.ts): nothing moves */
  svg[offscreen] .dot,
  svg[offscreen] .glow,
  svg[offscreen] .dash {
    animation-play-state: paused;
  }
  .label {
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 1px 8px;
    border-radius: 999px;
    border: 1px solid var(--mc-flow-color);
    background: var(--mc-flow-label-bg, var(--ha-card-background, var(--card-background-color, #fff)));
    color: var(--primary-text-color);
    font: inherit;
    font-size: var(--ha-font-size-xs, 11px);
    line-height: 16px;
    font-weight: 500;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  @media (prefers-reduced-motion: reduce) {
    .dot,
    .glow,
    .dash {
      animation: none;
    }
  }
`,$=s.AH`
  [data-mc-shape] {
    position: relative;
    /* sizes (width, min-height ...) are the shape's own: the inset padding grows inward, not the box
       (the inset scales with the box; outward it would feed back into a taller, wider-cut shape) */
    box-sizing: border-box;
    --mc-shape-it: 0px;
    --mc-shape-ir: 0px;
    --mc-shape-ib: 0px;
    --mc-shape-il: 0px;
  }
  .mc-shape-shadow {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .mc-shape-shadow > * {
    flex: 1 1 auto;
  }
  /* the card: the wrapper takes ha-card's place (full height in a grid / sections cell) */
  .mc-shape-shadow.mc-card-shadow {
    height: 100%;
  }
`,k=s.AH`
  :host {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: visible;
  }
  svg {
    position: absolute;
    overflow: visible;
  }
  path {
    fill: none;
  }
`,M=s.AH`
  [data-mc-value-bg] {
    position: relative;
    isolation: isolate;
  }
  ha-card:has(> .mc-card-content[data-mc-value-bg]) {
    display: flex;
    flex-direction: column;
  }
  .mc-card-content[data-mc-value-bg] {
    flex: 1 1 auto;
  }
`,S=s.AH`
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
`,A=[".mc-bar",".mc-separator",".mc-slider-container--horizontal",".mc-image",".mc-dropdown",".mc-video-bg",".mc-camera",".mc-graphs",".mc-nested-row",".mc-slider-layout"].join(", "),C=[".mc-horizontal",".mc-vertical",".mc-gauge"].join(", "),z=s.AH`
  :host {
    display: block;
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

  /* Button module wrapper: layout only; the clickable .mc-button-inner carries the look */
  .mc-button {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    color: var(--mc-design-color, var(--mc-text));
    font-size: var(--mc-button-font-size);
  }

  /* Button inner element + variants */
  .mc-button-inner {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
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
    font-size: var(--mc-font-size-xs);
    white-space: nowrap;
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
  .mc-horizontal > .mc-module-wrapper:not(:has(> :is(${(0,s.iz)(A)}, ${(0,s.iz)(C)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-module-wrapper:has(> :is(${(0,s.iz)(A)})),
  .mc-vertical > .mc-module-wrapper:has(> :is(${(0,s.iz)(A)})) {
    width: 100%;
    box-sizing: border-box;
  }
  /* the same for a shaped module with a shadow, whose flex item is its drop-shadow wrapper */
  .mc-horizontal > .mc-shape-shadow:not(:has(> .mc-module-wrapper > :is(${(0,s.iz)(A)}, ${(0,s.iz)(C)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,s.iz)(A)})),
  .mc-vertical > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,s.iz)(A)})) {
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

  /* the label follows the design colour; the underline / pill keeps the accent */
  .mc-tab-button.active {
    color: var(--mc-design-color, var(--mc-primary));
    border-bottom-color: var(--mc-primary);
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
    background: transparent;
  }

  .mc-tabs[data-style='pills'] .mc-tab-button.active {
    background: var(--mc-primary);
    color: var(--mc-design-color, var(--text-primary-color, #fff));
  }

  /* Tab style: underline */
  .mc-tabs[data-style='underline'] .mc-tabs-header {
    border-bottom: 2px solid var(--mc-border);
  }

  .mc-tabs[data-style='underline'] .mc-tab-button {
    border-bottom-width: 3px;
    font-weight: 500;
  }

  .mc-tabs[data-style='underline'] .mc-tab-button.active {
    border-bottom-width: 3px;
    font-weight: 700;
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
    /* 60 px wide, shrinking to 44 px in a narrow column so five days fit 331 px; more than fit scroll */
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
  :is(.mc-column, .mc-horizontal, .mc-vertical, .mc-tabs-content, .swiper-slide):has(> .mc-module-wrapper > .mc-video-bg--media) {
    position: relative;
    isolation: isolate;
  }

  .mc-module-wrapper ~ .mc-module-wrapper:has(> .mc-video-bg--media),
  .mc-module-wrapper:has(> .mc-video-bg--media):has(~ .mc-module-wrapper) {
    position: absolute;
    inset: 0;
    z-index: -1;
    margin: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  /* studio canvas: the layer can still be clicked (where nothing covers it) to select it */
  .mc-module-wrapper[data-mc-path]:has(> .mc-video-bg--media) {
    pointer-events: auto;
  }

  .mc-module-wrapper ~ .mc-module-wrapper > .mc-video-bg--media,
  .mc-module-wrapper:has(~ .mc-module-wrapper) > .mc-video-bg--media,
  .mc-module-wrapper ~ .mc-module-wrapper > .mc-video-bg--media .mc-video-bg-media,
  .mc-module-wrapper:has(~ .mc-module-wrapper) > .mc-video-bg--media .mc-video-bg-media {
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

  /* Editor canvas: rows, columns, modules and tabs hidden (Hide or display conditions) stay selectable */
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

  /* One module's own error (invalid config, failed render or template): the rest of the card renders. */
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

  /* Interactive feedback — focus-visible, active, tap highlight */
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
`,q=[c.A,z,y,v,b,w,$,M,S];var j=i(757),E=i(7137),T=i(8590),P=i(9424),N=i(7050),O=i(1909),R=i(3664);const L=()=>i.e(8).then(()=>i(1096));let D,W=L;const I=(t,e)=>(D=void 0,console.warn(t,...void 0===e?[]:[e]),!1);function B(){return D??=W().then(t=>t.EDITOR_VERSION!==n.x?I(`Magic Card was updated, reload the page (magic-card.js ${n.x}, magic-card-editor.js ${t.EDITOR_VERSION}).`):t.labelsReady().then(t=>!!t||I("Magic Card: the editor texts (magic-card-i18n-labels.js) could not be loaded, reload the page.")),t=>I("Magic Card: the editor (magic-card-editor.js) could not be loaded, reload the page.",t)),D}var F=i(5809),U=i(4036);var H=i(3518),J=i(2061),V=i(9639),G=i(4243),Z=i(5767),Y=i(1771),K=i(8668),X=i(3852),Q=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};const tt=new Set(["custom","squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]),et=["--mc-shape-it","--mc-shape-ir","--mc-shape-ib","--mc-shape-il"];function it(t,e){const i=t?.shape;if(!i||!tt.has(i))return;if("custom"===i&&!(0,Z.Lu)())return void(0,Z.En)();let n=t?.shape_options;return"custom"===i&&n&&"object"==typeof n&&(n=(0,G.l)(n,e)),n&&"object"==typeof n&&Object.keys(n).length?{kind:i,options:n}:{kind:i}}let nt;function ot(t){if(void 0===nt&&(nt="undefined"==typeof CSS||"function"!=typeof CSS.supports||CSS.supports("clip-path",'path("M0 0")')),nt)return`path('${t}')`;const e=(0,Y.aM)(t);return e?(0,Y.G_)(e):"none"}function rt(t,e){const i=[];for(let n=0;n<t.length;n++){const o=t[n],r=t[(n+1)%t.length],s=e(o),a=e(r);if(s>=0&&i.push(o),s>=0!=a>=0){const t=s/(s-a);i.push({x:o.x+(r.x-o.x)*t,y:o.y+(r.y-o.y)*t})}}return i}const st=t=>Math.round(100*t)/100;let at=0;let ct=class extends s.WF{constructor(){super(...arguments),this.offscreen=!1,this._onMedia=()=>this.requestUpdate(),this._clip="",this._insets=[],this._raf=0,this._animKey="",this._watching=!1,this._clipSource="",this._maskId="mc-shape-mask-"+ ++at}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._observe()}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._unobserve()}_observe(){const t=this.parentElement??void 0;t&&t!==this._parent&&(this._unobserve(),this._parent=t,(0,H.vb)(t,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this._restore()),this._mutations.observe(t,{attributes:!0,attributeFilter:["style","class","tabindex"]})),this.measure())}_unobserve(){const t=this._parent;if(this._stopAnimation(),this._raf&&cancelAnimationFrame(this._raf),this._raf=0,this._mutations?.disconnect(),this._mutations=void 0,t){(0,H.Ed)(t,this),this._clip&&t.style.getPropertyValue("clip-path")===this._clip&&t.style.removeProperty("clip-path");for(const e of et)t.style.removeProperty(e);this._clip="",this._insets=[],this._parent=void 0,this._box=void 0}}measure(){const t=this.parentElement;if(!t||!this.shape)return;const e=getComputedStyle(t),i=/^\s*([\d.]+)px\s*$/.exec(this.stroke?.width??""),{w:n,h:o}=(0,H.Bi)(t),r=parseFloat(e.borderTopWidth)||0,s=parseFloat(e.borderLeftWidth)||0,a=parseFloat(e.borderRightWidth)||0,c=parseFloat(e.borderBottomWidth)||0,l=(t=>"HA-CARD"===t.tagName?t.querySelector(":scope > .mc-card-content")??t:t)(t),d=function(t,e){const i=getComputedStyle(e),n=[i.paddingTop,i.paddingRight,i.paddingBottom,i.paddingLeft].map(t=>parseFloat(t)||0);return et.map((e,i)=>n[i]>(parseFloat(t.style.getPropertyValue(e))||0)+.01?n[i]:0)}(t,l),u=function(t){if("border-box"!==getComputedStyle(t).boxSizing)return;let e=1/0,i=-1/0;for(const n of t.children){if(!(n instanceof HTMLElement&&"MC-SHAPE"!==n.tagName&&n.offsetHeight))continue;const o=getComputedStyle(n).position;if("absolute"===o||"fixed"===o)continue;if(n.offsetParent!==t&&n.offsetParent!==t.offsetParent)return;const r=n.offsetParent===t?n.offsetTop:n.offsetTop-t.offsetTop;e=Math.min(e,r),i=Math.max(i,r+n.offsetHeight)}return i>e?i-e:void 0}(l),h=void 0===u?0:Math.max(0,Math.min(o/4,(o-u)/2-1)),m={w:n,h:o,top:r,left:s,right:a,bottom:c,bw:this.stroke?i?parseFloat(i[1]):r:0,focus:t.hasAttribute("tabindex"),pad:[r+d[0],a+d[1],c+d[2],s+d[3]],free:h};JSON.stringify(m)!==JSON.stringify(this._box)&&(this._box=m),this._apply(!1)}_restore(){const t=this._parent;if(!t)return;(t.style.getPropertyValue("clip-path")!==this._clip||et.some((e,i)=>t.style.getPropertyValue(e)!==(this._insets[i]??"")))&&this._apply(!0),this.measure(),this._mutations?.takeRecords()}_apply(t){const e=this._parent,i=this._box;if(!e||!i||!this.shape)return;const{kind:n,options:o}=this.shape,r=[0,1,2,3].map(t=>Math.max(0,Number(this.edge?.[t])||0)),s=(t,e,s,a)=>{const c=(0,V.j9)(n,i.w,i.h,o,{top:t-r[0],right:e-r[1],bottom:s-r[2],left:a-r[3]});return c&&{d:c.d,inset:{top:c.inset.top+r[0],right:c.inset.right+r[1],bottom:c.inset.bottom+r[2],left:c.inset.left+r[3]}}},[a,c,l,d]=i.pad,u=s(a,c,l,d),h=i.free>Math.min(a,l)?s(Math.max(a,i.free),c,Math.max(l,i.free),d):void 0,m=t=>t?Math.ceil(t.inset.left)+Math.ceil(t.inset.right):1/0,p=!!h&&m(h)<m(u),f=p?h:u;if(!f)return;const g=p?i.free:0,y=ot(f.d);e.style.getPropertyValue("clip-path")===this._clip&&this._clipSource===y||(e.style.setProperty("clip-path",y),this._clip=e.style.getPropertyValue("clip-path"),this._clipSource=y);const v=[i.top,i.right,i.bottom,i.left],b=[Math.max(f.inset.top,g),f.inset.right,Math.max(f.inset.bottom,g),f.inset.left].map((t,e)=>`${Math.max(0,Math.ceil(t-v[e]-1e-6))}px`),_=()=>{this._raf=0;const t=this._parent;t&&(et.forEach((e,i)=>{t.style.getPropertyValue(e)!==b[i]&&t.style.setProperty(e,b[i])}),this._insets=et.map(e=>t.style.getPropertyValue(e)),this._mutations?.takeRecords(),this.measure())};et.some((t,i)=>e.style.getPropertyValue(t)!==b[i])&&(t||"function"!=typeof requestAnimationFrame?_():this._raf?(cancelAnimationFrame(this._raf),this._raf=requestAnimationFrame(_)):this._raf=requestAnimationFrame(_),this._mutations?.takeRecords())}_frames(t,e=0){const i=this.shape;if(!i?.options?.animate||"blob"!==i.kind&&"wave"!==i.kind||this._media?.matches)return;const n=t.w-2*e,o=t.h-2*e;if(!(n>0&&o>0))return;const r=i.options;if("wave"===i.kind)return Array.from({length:9},(t,e)=>(0,V.j9)("wave",n,o,{...r,phase:e/8})?.d??"");const s=Number(r.seed??7),a=t=>Number.isFinite(s)?s+t:t?`${r.seed}-${t}`:r.seed;return[0,1,2,0].map(t=>(0,V.j9)("blob",n,o,{...r,seed:a(t)})?.d??"")}_duration(){return 1e3*("wave"===this.shape?.kind?3:12)}_stopAnimation(){this._anim?.cancel(),this._anim=void 0,this._animKey="",this._watching&&(0,X.IH)()?.unobserve(this),this._watching=!1}_syncAnimation(){const t=this._parent,e=this._box,i=e?this._frames(e):void 0;if(!t||!i||"function"!=typeof t.animate)return void this._stopAnimation();const n=i.join("|");n!==this._animKey&&(this._anim?.cancel(),this._animKey=n,this._anim=t.animate(i.map(t=>({clipPath:ot(t)})),{duration:this._duration(),iterations:1/0,easing:"blob"===this.shape?.kind?"ease-in-out":"linear"})),this._watching||((0,X.IH)()?.observe(this),this._watching=!0),this.offscreen?this._anim?.pause():this._anim?.play()}updated(t){super.updated(t),this._observe(),(t.has("shape")||t.has("stroke")||t.has("edge"))&&this.measure(),this._syncAnimation();const e=this.renderRoot.querySelector("svg");e&&"function"==typeof e.pauseAnimations&&(this.offscreen?e.pauseAnimations():e.unpauseAnimations())}render(){const t=this._box,e=this.shape;if(!t||!e)return s.s6;const i=this._renderStroke(t,e),n=t.focus?(0,K.fI)(e.kind,t.w,t.h,e.options,{inset:1}):"";if(!i&&!n)return s.s6;const o=`top: ${-t.top}px; left: ${-t.left}px; width: ${t.w}px; height: ${t.h}px`;return s.qy`<svg style=${o} viewBox="0 0 ${t.w} ${t.h}" preserveAspectRatio="none" focusable="false">
      ${i??s.s6}${n?s.JW`<path class="focus" d=${n} style="stroke: var(--mc-shape-focus, transparent); stroke-width: 2px"></path>`:s.s6}
    </svg>`}_renderStroke(t,e){const i=this.stroke;if(!(i&&t.bw>0))return;const n=t.bw,o=(0,K.fI)(e.kind,t.w,t.h,e.options,{inset:n/2});if(!o)return;const r="dashed"===i.style?`${st(3*n)} ${st(2*n)}`:"dotted"===i.style?`0 ${st(2*n)}`:"none",a=`stroke: var(--mc-shape-stroke, ${i.color}); stroke-width: ${n}px; stroke-dasharray: ${r}; stroke-linecap: ${"dotted"===i.style?"round":"butt"}`,c=i.length?function(t,e,i){const n=Math.min(t,e)/2,o={top:[{x:0,y:0},{x:t,y:0},{x:t-n,y:n},{x:n,y:n}],right:[{x:t,y:0},{x:t,y:e},{x:t-n,y:e-n},{x:t-n,y:n}],bottom:[{x:t,y:e},{x:0,y:e},{x:n,y:e-n},{x:t-n,y:e-n}],left:[{x:0,y:e},{x:0,y:0},{x:n,y:n},{x:n,y:e-n}]},r="start"===i.align?0:"end"===i.align?1:.5;return i.sides.flatMap(n=>{const s="top"===n||"bottom"===n,a=s?t:e,c=Math.min(a,(0,V.dC)(i.value,a)??a),l=(a-c)*r,d=l+c,u=t=>s?t.x:t.y,h=rt(rt(o[n],t=>u(t)-l),t=>d-u(t));return h.length>=3?[h]:[]})}(t.w,t.h,i.length):void 0,l=this._frames(t,n/2);return s.JW`${c?s.JW`<mask id=${this._maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${t.w} height=${t.h}>${c.map(t=>s.JW`<polygon points=${t.map(t=>`${st(t.x)},${st(t.y)}`).join(" ")} fill="#fff"></polygon>`)}</mask>`:s.s6}
      ${l?s.JW`<g mask=${c?`url(#${this._maskId})`:s.s6}><g transform="translate(${st(n/2)} ${st(n/2)})">
            <path class="stroke" d=${l[0]} style=${a}><animate attributeName="d" values=${l.join(";")}
              dur="${this._duration()/1e3}s" repeatCount="indefinite" calcMode=${"blob"===e.kind?"spline":"linear"}
              keySplines=${"blob"===e.kind?l.slice(1).map(()=>"0.42 0 0.58 1").join(";"):s.s6}></animate></path>
          </g></g>`:s.JW`<path class="stroke" d=${o} style=${a} mask=${c?`url(#${this._maskId})`:s.s6}></path>`}`}};ct.styles=k,Q([(0,a.MZ)({attribute:!1,hasChanged:(t,e)=>JSON.stringify(t)!==JSON.stringify(e)})],ct.prototype,"shape",void 0),Q([(0,a.MZ)({attribute:!1,hasChanged:(t,e)=>JSON.stringify(t)!==JSON.stringify(e)})],ct.prototype,"stroke",void 0),Q([(0,a.MZ)({attribute:!1,hasChanged:(t,e)=>JSON.stringify(t)!==JSON.stringify(e)})],ct.prototype,"edge",void 0),Q([(0,a.MZ)({type:Boolean,reflect:!1})],ct.prototype,"offscreen",void 0),Q([(0,a.wk)()],ct.prototype,"_box",void 0),ct=Q([(0,a.EM)("mc-shape")],ct);var lt=i(5520),dt=i(8983),ut=i(2421),ht=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};const mt=t=>Math.round(100*t)/100;let pt=class extends s.WF{constructor(){super(...arguments),this.offscreen=!1,this._onMedia=()=>this.requestUpdate(),this._onFetched=()=>this.requestUpdate(),this._watchingSize=!1,this._watchingScreen=!1,this._onReport=t=>{const e=this._onScreen;this._onScreen=t;const i=this.value;if(!t||!0===e||!this.isConnected||"sparkline"!==i?.type)return;const n=this._peek(i);(!n||Date.now()-n.timestamp>3e5)&&this.requestUpdate()}}get hass(){return this._hass}set hass(t){const e=this._hass;this._hass=t;const i="sparkline"===this.value?.type?this.value.entity:void 0;i&&(e&&t&&e.states?.[i]===t.states?.[i]||this.requestUpdate())}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this.hasUpdated&&this._sync()}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._media=void 0,this._unwatchSize(),this._unwatchScreen(),this._clearTimer()}measure(){const{w:t,h:e}=(0,H.Bi)(this);(!this._size||Math.abs(this._size.w-t)>.5||Math.abs(this._size.h-e)>.5)&&(this._size={w:t,h:e})}_reduced(){return!!this._media?.matches}_waveMoves(){const t=this.value;return!!t&&"fill"===t.type&&t.wave&&this._level()>0&&this._level()<.99&&!this._reduced()}_level(){const t=this.value?.level;return void 0!==t&&Number.isFinite(t)?Math.min(1,Math.max(0,t)):0}_unwatchSize(){this._watchingSize&&(0,H.Ed)(this,this),this._watchingSize=!1}_unwatchScreen(){this._watchingScreen&&(0,X.eF)(this),this._watchingScreen=!1,this._onScreen=void 0}_clearTimer(){void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0,this._timerAt=void 0}_peek(t){return t.entity?(0,ut.S5)(t.entity,t.hours,t.attribute):void 0}_sync(){if(!this.isConnected)return;const t=this.value,e="sparkline"===t?.type;e&&!this._watchingSize?((0,H.vb)(this,this),this._watchingSize=!0,this.measure()):e||this._unwatchSize();const i=e||this._waveMoves();i&&!this._watchingScreen?(this._watchingScreen=!0,this._onScreen=void 0,(0,X.jR)(this,this._onReport)||(this._onScreen=!0)):i||this._unwatchScreen();const n=e&&t?this._peek(t):void 0,o=n?n.timestamp+3e5+1e3:void 0;void 0===o||o<=Date.now()?this._clearTimer():this._timerAt!==o&&(this._clearTimer(),this._timerAt=o,this._timer=setTimeout(()=>{this._timer=void 0,this._timerAt=void 0,this.isConnected&&this._onScreen&&this.requestUpdate()},o-Date.now()))}updated(t){super.updated(t),this._sync()}willUpdate(t){super.willUpdate(t);const e=this.value;this.toggleAttribute("data-empty",!!e&&"fill"===e.type&&void 0===e.level)}render(){const t=this.value;return t?"fill"===t.type?this._renderFill(t):this._renderSparkline(t):s.s6}_renderFill(t){const e=this._level(),i=t.wave&&e>0&&e<.99,n=void 0===t.level;return s.qy`${n?s.qy`<div class="hatch" style="--mc-vb-color: ${t.color}"></div>`:s.s6}
      <div class="fill" data-dir=${t.direction} style="--mc-vb-color: ${t.color}; --mc-vb-paint: ${t.paint??t.color}">
        ${!n&&e<=0?s.qy`<div class="floor"></div>`:s.s6}
        <div class="liquid" style="opacity: ${t.opacity}; transform: translateY(${mt(100*(1-e))}%)">
          ${i?s.qy`<svg class="wave" ?data-animate=${this._waveMoves()} viewBox="0 0 200 10" preserveAspectRatio="none" focusable="false">
                <path d=${"M0 5Q12.5 0 25 5T50 5T75 5T100 5T125 5T150 5T175 5T200 5V10H0Z"}></path>
              </svg>`:s.s6}
        </div>
      </div>`}_history(t){const e=this._hass;if(t.entity)return this._onScreen&&this.isConnected&&e&&"function"==typeof e.callWS?(0,ut.JK)(e,t.entity,t.hours,t.attribute,this._onFetched):this._peek(t)}_historyPoints(t,e){const i=this._memo;if(i&&i.hist===t&&i.hours===e)return i;const n=t.timestamp;return this._memo={hist:t,hours:e,...(0,lt.mU)(t.samples,n-36e5*e,n)},this._memo}_renderSparkline(t){const e=this._history(t),i=this._size;if(!(e&&e.samples.length&&i&&i.w>0&&i.h>0))return s.s6;const n=Date.now(),o=n-36e5*t.hours,{points:r,last:a}=this._historyPoints(e,t.hours),c=r.slice(),l=t.entity?this._hass?.states?.[t.entity]:void 0,d=(0,dt.Pd)(l,t.attribute)?void 0:(0,dt.f4)(l,t.attribute);void 0!==d&&(!c.length||c[c.length-1].t<n)&&c.push({t:n,v:d});const u=Math.round(.35*i.h),{line:h,area:m,tail:p}=(0,lt.dh)(c,i.w,i.h-u,{min:t.min,max:t.max,smoothing:t.smoothing,area:t.area,pad:t.lineWidth/2+1,start:o,end:n,hold:void 0===d?a:void 0,splitHeld:void 0===d});if(!h&&!p)return s.s6;const f=`stroke: ${t.color}; stroke-width: ${t.lineWidth}px`;return s.qy`<svg class="spark" viewBox="0 0 ${mt(i.w)} ${mt(i.h)}" preserveAspectRatio="none" focusable="false">
      ${m?s.JW`<defs>
            <linearGradient id="mc-vb-area" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" style="stop-color: ${t.color}; stop-opacity: ${t.opacity}"></stop>
              <stop offset="1" style="stop-color: ${t.color}; stop-opacity: 0"></stop>
            </linearGradient>
          </defs>`:s.s6}
      <g transform="translate(0 ${u})">
        ${m?s.JW`<path class="area" d=${m} fill="url(#mc-vb-area)"></path>`:s.s6}
        ${h?s.JW`<path class="line" d=${h} style=${f}></path>`:s.s6}
        ${p?s.JW`<path class="line tail" d=${p} style=${f} stroke-dasharray="3 3"></path>`:s.s6}
      </g>
    </svg>`}};function ft(t){return t?s.qy`<span class="mc-border-fx" aria-hidden="true" style=${t.overlayStyle}>${t.lines.map(t=>s.qy`<i style=${t.style}></i>`)}</span>`:s.s6}function gt(t){return!!t?.fx.some(t=>t.seasonal&&(0,U.bO)(t.seasonal.scenes))}function yt(t,e,i="mc",n=!1,o){return t?.fx.length?s.qy`${t.fx.map(t=>{t.seasonal&&(0,F.X$)();const r=t.seasonal&&o?.preset(t.seasonal.scenes,t.seasonal.intensity);return t.seasonal?s.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${t.preset} style=${t.style||s.s6} .scenes=${t.seasonal.scenes}
            .intensity=${r?.intensity??t.seasonal.intensity} ?noflash=${!!r?.noflash} .seed=${`${i}|${t.preset}`}></mc-seasonal>${t.seasonal.decorations?xt(t.seasonal.scenes,e,i,n):s.s6}`:t.ring?s.qy`<mc-ring class="mc-anim-ring" data-fx=${t.preset} ?data-tap=${!!t.tap} style=${t.style} .ring=${t.ring} .shape=${e}></mc-ring>`:s.qy`<span class="mc-anim-fx" data-fx=${t.preset} ?data-front=${t.front} ?data-tap=${!!t.tap} ?data-p=${!!t.sim} .mcSim=${t.sim} style=${t.style} aria-hidden="true">${t.particles.map(e=>{return s.qy`<i data-s=${e.shape??s.s6} style="--mc-anim-x: ${e.x}%; --mc-anim-phase: ${e.phase}; --mc-anim-k: ${e.k}${e.style?`; ${e.style}`:""}">${i=e.symbol??t.symbol,i?"icon"in i?s.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:s.s6}</i>`;var i})}</span>`})}`:s.s6}function vt(t,e){return t?s.qy`<mc-ring .ring=${t} .shape=${e}></mc-ring>`:s.s6}function bt(t,e,i){return t?s.qy`<mc-shape .shape=${t} .stroke=${e} .edge=${i}></mc-shape>`:s.s6}function _t(t,e,i=!1){return i?s.qy`<div class="mc-shape-shadow mc-card-shadow" style=${e?`filter: ${e}`:s.s6}>${t}</div>`:e?s.qy`<div class="mc-shape-shadow" style="filter: ${e}">${t}</div>`:t}function wt(t,e){return t?s.qy`<mc-value-bg .value=${t} .hass=${e}></mc-value-bg>`:s.s6}function xt(t,e,i,n){return(0,U.ir)(t).length?s.qy`<mc-seasonal-deco class="mc-seasonal-deco" .scenes=${t} .shape=${e} .seed=${i} ?dark=${n}></mc-seasonal-deco>`:s.s6}function $t(t,e,i){if(!t)return s.s6;(0,F.X$)();const n=t.layer===e?s.qy`<mc-seasonal class="mc-card-seasonal" .scenes=${t.scenes} .intensity=${i.grant?.intensity??t.intensity}
          .layer=${t.layer} ?noflash=${!!i.grant?.noflash} .seed=${i.seed}></mc-seasonal>`:s.s6;return"front"===e?n:s.qy`${n}${t.decorations?xt(t.scenes,i.shape,i.seed,i.dark):s.s6}`}function kt(t,e){const i=[...t?.fx.flatMap(t=>t.seasonal?.decorations?t.seasonal.scenes:[])??[],...e?.decorations?e.scenes:[]];return i.length?function(t){const e=[0,0,0,0],i=(t,i)=>e[t]=Math.max(e[t],i);for(const e of t)if("lights"===e)for(let t=0;t<4;t++)i(t,20);else"icicles"===e?i(0,20):"pumpkin"===e?i(2,30):"vine"===e&&(i(2,18),i(3,20));return e.some(t=>t>0)?e:void 0}((0,U.ir)(i)):void 0}pt.styles=s.AH`
    :host {
      position: absolute;
      inset: 0;
      z-index: -1;
      display: block;
      overflow: hidden;
      pointer-events: none;
      border-radius: inherit;
      container-type: size;
    }
    /* no value: a faint hatch (a real 0 is an empty tank with a floor line) */
    .hatch {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        135deg,
        color-mix(in srgb, var(--mc-vb-color) 35%, transparent) 0 2px,
        transparent 2px 8px
      );
    }
    .floor {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: color-mix(in srgb, var(--mc-vb-color) 60%, transparent);
    }
    .fill {
      position: absolute;
      inset: 0;
    }
    /* other directions turn the layer (left / right: its sides swapped) */
    .fill[data-dir='down'] {
      transform: rotate(180deg);
    }
    .fill[data-dir='left'],
    .fill[data-dir='right'] {
      inset: auto;
      left: 50%;
      top: 50%;
      width: 100cqh;
      height: 100cqw;
      transform: translate(-50%, -50%) rotate(90deg);
    }
    .fill[data-dir='left'] {
      transform: translate(-50%, -50%) rotate(-90deg);
    }
    .liquid {
      position: absolute;
      inset: 0;
      background: var(--mc-vb-paint);
      transition: transform 600ms ease-in-out;
    }
    .wave {
      position: absolute;
      left: 0;
      bottom: calc(100% - 1px);
      width: 200%;
      height: 8px;
      fill: var(--mc-vb-color);
    }
    .wave[data-animate] {
      animation: mc-vb-wave 3s linear infinite;
    }
    :host([offscreen]) .wave {
      animation-play-state: paused;
    }
    @keyframes mc-vb-wave {
      to {
        transform: translateX(-50%);
      }
    }
    svg.spark {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    /* behind text: the line stays faint (the theme can turn it up) */
    .line {
      fill: none;
      opacity: var(--mc-value-bg-line-opacity, 0.45);
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    @media (prefers-reduced-motion: reduce) {
      .liquid {
        transition: none;
      }
      .wave {
        animation: none !important;
      }
    }
  `,ht([(0,a.MZ)({attribute:!1,hasChanged:(t,e)=>!((t,e)=>JSON.stringify(t)===JSON.stringify(e))(t,e)})],pt.prototype,"value",void 0),ht([(0,a.MZ)({type:Boolean})],pt.prototype,"offscreen",void 0),ht([(0,a.wk)()],pt.prototype,"_size",void 0),pt=ht([(0,a.EM)("mc-value-bg")],pt);var Mt=i(5816),St=i(2065);const At=t=>t?JSON.stringify(t):"";class Ct{constructor(t,e){this._host=t,this._opts=e,this._listening=!1,this._connected=!1,this._key="",this._onPreview=()=>this._host.requestUpdate(),t.addController(this)}now(){return this._preview()??new Date}_preview(){const t=this._opts.editorPreview()?(0,St.Nd)():void 0;return t?new Date(t.getTime()):void 0}_resolve(t,e){const i=this._preview();return(0,Mt.rG)(t,i??new Date,e,{localDay:!!i})}resolve(){const t=this._opts.config(),e=void 0===t?void 0:this._resolve(t,this._opts.hass());return this._key=At(e),e}changed(t){const e=this._opts.config(),i=this._opts.hass();if(void 0===e||!i)return!1;return!!(0,Mt.aD)(e).some(e=>t?.states?.[e]!==i.states?.[e])&&At(this._resolve(e,i))!==this._key}seed(t){const e=t.rows?.[0],i=[t.name??"",e?.id??"",e?.columns?.[0]?.modules?.[0]?.id??""].join("|"),n=function(t){const e=[],i=new Set,n=(t,o)=>{if(!(!t||"object"!=typeof t||i.has(t)||o>12))if(i.add(t),Array.isArray(t))for(const e of t)n(e,o+1);else for(const[i,r]of Object.entries(t))"string"!=typeof r||"entity"!==i&&"entity_id"!==i&&!i.endsWith("_entity")||!/^\w+\.\w+/.test(r)||e.includes(r)?n(r,o+1):e.push(r)};return n(t,0),e}(t);return[i,n.length?Math.floor(4294967296*(0,U.Is)(n.join(","))()).toString(36):""].filter(t=>t&&"||"!==t).join("|")||"card"}get timerPending(){return void 0!==this._timer}hostConnected(){this._connected=!0,this._sync()}hostDisconnected(){this._connected=!1,this._sync()}hostUpdated(){this._sync()}_sync(){const t=(0,Mt.Oo)(this._opts.config()),e=this._connected&&!!t;e&&!this._listening?window.addEventListener(St.HT,this._onPreview):!e&&this._listening&&window.removeEventListener(St.HT,this._onPreview),this._listening=e;const i=t?(0,Mt.a0)(t):[],n=e&&!this._opts.idle()&&i.includes("auto");n&&void 0===this._timer?this._schedule():n||void 0===this._timer||(window.clearTimeout(this._timer),this._timer=void 0)}_schedule(){const t=new Date,e=(0,Mt.s$)(t,this._opts.hass()).getTime()-t.getTime()+500;this._timer=window.setTimeout(()=>{this._timer=void 0,this._host.requestUpdate(),this._sync()},e)}}const zt=["top","right","bottom","left"],qt=t=>"left"===t||"right"===t,jt={top:{x:0,y:-1},right:{x:1,y:0},bottom:{x:0,y:1},left:{x:-1,y:0}};function Et(t,e,i=.5,n=0){const o=jt[e],r=4+n,s=t.shape?(0,V.aK)(t.shape.kind,t.w,t.h,t.shape.options,e,i):void 0;return s?{x:t.x+s.x+o.x*r,y:t.y+s.y+o.y*r}:{x:o.x?t.x+t.w/2+o.x*t.w/2+o.x*r:t.x+t.w*i,y:o.y?t.y+t.h/2+o.y*t.h/2+o.y*r:t.y+t.h*i}}const Tt=(t,e)=>Math.hypot(e.x-t.x,e.y-t.y);function Pt(t,e,i,n){const o=Et(t,i),r=Et(e,n),s=jt[i],a=jt[n];return s.x*(r.x-o.x)+s.y*(r.y-o.y)>=0&&a.x*(o.x-r.x)+a.y*(o.y-r.y)>=0}function Nt(t,e,i,n){if("auto"!==i&&"auto"!==n)return[i,n];if("auto"===i&&"auto"===n){const i=t.y<e.y+e.h&&e.y<t.y+t.h,n=t.x<e.x+e.w&&e.x<t.x+t.w;if(i&&!n)return t.x<e.x?["right","left"]:["left","right"];if(n&&!i)return t.y<e.y?["bottom","top"]:["top","bottom"]}const o="auto"===i?zt:[i],r="auto"===n?zt:[n];let s,a=1/0;for(const i of o)for(const n of r){const o=Tt(Et(t,i),Et(e,n))+(Pt(t,e,i,n)?0:1e6);o<a&&(a=o,s=[i,n])}return s}function Ot(t){const e=Math.round(100*t)/100;return String(0===e?0:e)}function Rt(t,e,i,n){return e<=i?(e+i)/2:n<=t?(n+t)/2:Math.max(e,n)+16}function Lt(t,e){const i=Tt(t,e)||1;return{x:(e.x-t.x)/i,y:(e.y-t.y)/i}}function Dt(t,e,i,n,o,r){const s=function(t,e,i,n,o,r){const s=[t],a=jt[i],c=jt[n],l=i!==n&&qt(i)===qt(n)&&a.x*(e.x-t.x)+a.y*(e.y-t.y)<0;if(l&&qt(i)){const i=t.x+16*a.x,n=e.x+16*c.x,l=Rt(o.y,o.y+o.h,r.y,r.y+r.h);s.push({x:i,y:t.y},{x:i,y:l},{x:n,y:l},{x:n,y:e.y})}else if(l){const i=t.y+16*a.y,n=e.y+16*c.y,l=Rt(o.x,o.x+o.w,r.x,r.x+r.w);s.push({x:t.x,y:i},{x:l,y:i},{x:l,y:n},{x:e.x,y:n})}else if(qt(i)&&qt(n)){let o=(t.x+e.x)/2;i===n&&(o="right"===i?Math.max(t.x,e.x)+16:Math.min(t.x,e.x)-16),s.push({x:o,y:t.y},{x:o,y:e.y})}else if(qt(i)||qt(n))qt(i)?s.push({x:e.x,y:t.y}):s.push({x:t.x,y:e.y});else{let o=(t.y+e.y)/2;i===n&&(o="bottom"===i?Math.max(t.y,e.y)+16:Math.min(t.y,e.y)-16),s.push({x:t.x,y:o},{x:e.x,y:o})}s.push(e);const d=[];for(const t of s){const e=d[d.length-1];if(e&&Tt(e,t)<.01)continue;const i=d[d.length-2];i&&e&&(i.x===e.x&&e.x===t.x||i.y===e.y&&e.y===t.y)&&d.pop(),d.push(t)}return d}(t,e,i,n,o,r),a=[],c=[`M ${Ot(t.x)} ${Ot(t.y)}`];let l=t;const d=t=>{Tt(l,t)<.01||(c.push(Math.abs(t.y-l.y)<.01?`H ${Ot(t.x)}`:`V ${Ot(t.y)}`),a.push({kind:"line",a:l,b:t}),l=t)};for(let t=1;t<s.length-1;t++){const e=s[t-1],i=s[t],n=s[t+1],o=Math.min(8,Tt(e,i)/2,Tt(i,n)/2),r=Lt(e,i),u=Lt(i,n),h={x:i.x-r.x*o,y:i.y-r.y*o},m={x:i.x+u.x*o,y:i.y+u.y*o};if(d(h),o>.01){const t=r.x*u.y-r.y*u.x>0?1:0;c.push(`A ${Ot(o)} ${Ot(o)} 0 0 ${t} ${Ot(m.x)} ${Ot(m.y)}`);const e={x:h.x+u.x*o,y:h.y+u.y*o};a.push({kind:"arc",c:e,u:{x:-u.x*o,y:-u.y*o},v:{x:r.x*o,y:r.y*o},r:o}),l=m}}d(e);const u=a.reduce((t,e)=>t+(t=>"line"===t.kind?Tt(t.a,t.b):Math.PI*t.r/2)(e),0);let h;for(const t of a)"line"===t.kind&&(!h||Tt(t.a,t.b)>Tt(h.a,h.b))&&(h=t);return h?{d:c.join(" "),mid:{x:(h.a.x+h.b.x)/2,y:(h.a.y+h.b.y)/2},tangent:Lt(h.a,h.b),run:Tt(h.a,h.b),length:u}:{d:c.join(" "),mid:t,tangent:Lt(t,e),run:0,length:u}}function Wt(t,e,i,n,o={}){const[r,s]=i,a=Et(t,r,o.t?.[0],o.trim?.[0]),c=Et(e,s,o.t?.[1],o.trim?.[1]);return"curve"===n?function(t,e,i,n){const o=Math.min(120,Tt(t,e)/2),r={x:t.x+jt[i].x*o,y:t.y+jt[i].y*o},s={x:e.x+jt[n].x*o,y:e.y+jt[n].y*o},a=i=>{const n=1-i;return{x:n*n*n*t.x+3*n*n*i*r.x+3*n*i*i*s.x+i*i*i*e.x,y:n*n*n*t.y+3*n*n*i*r.y+3*n*i*i*s.y+i*i*i*e.y}};let c=0,l=t;for(let t=1;t<=32;t++){const e=a(t/32);c+=Tt(l,e),l=e}const d=.75*(r.x-t.x)+1.5*(s.x-r.x)+.75*(e.x-s.x),u=.75*(r.y-t.y)+1.5*(s.y-r.y)+.75*(e.y-s.y);return{d:`M ${Ot(t.x)} ${Ot(t.y)} C ${Ot(r.x)} ${Ot(r.y)} ${Ot(s.x)} ${Ot(s.y)} ${Ot(e.x)} ${Ot(e.y)}`,mid:a(.5),tangent:Math.hypot(d,u)>1e-6?Lt({x:0,y:0},{x:d,y:u}):Lt(t,e),run:c,length:c}}(a,c,r,s):"elbow"===n?Dt(a,c,r,s,t,e):{d:`M ${Ot(a.x)} ${Ot(a.y)} L ${Ot(c.x)} ${Ot(c.y)}`,mid:{x:(a.x+c.x)/2,y:(a.y+c.y)/2},tangent:Lt(a,c),run:Tt(a,c),length:Tt(a,c)}}var It=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};const Bt=t=>t.replace(/\d/g,"0"),Ft=t=>Math.round(10*t)/10,Ut=["scroll","transitionend","animationend"];function Ht(t){const e=t.parentElement??t.getRootNode().host??null;return e instanceof HTMLElement?e:null}const Jt=t=>Math.max(8,3*t);function Vt(t,e,i){const{position:n,width:o,arrow:r,obstacles:s,bounds:a}=i;if("hidden"===n)return;const{mid:c,tangent:l}=t;if("line"===n)return c;const d=[],u=Math.abs(l.x)*e.w+Math.abs(l.y)*e.h;"auto"===n&&t.run-2*(r+6)>=u+16&&d.push(c);let h={x:-l.y,y:l.x};(Math.abs(l.x)>=Math.abs(l.y)?h.y>0:h.x<0)&&(h={x:-h.x,y:-h.y});const m=(Math.abs(h.x)*e.w+Math.abs(h.y)*e.h)/2+o/2+4,p={x:c.x+h.x*m,y:c.y+h.y*m};d.push(p,{x:c.x-h.x*m,y:c.y-h.y*m});return d.find(t=>{const i=(t=>({x:t.x-e.w/2-2,y:t.y-e.h/2-2,w:e.w+4,h:e.h+4}))(t);return(!a||!(i.x<0||i.y<0||i.x+i.w>a.w||i.y+i.h>a.h))&&!s.some(t=>Gt(i,t))})??("side"===n?p:void 0)}function Gt(t,e){const i=Math.max(t.x,e.x),n=Math.max(t.y,e.y),o=Math.min(t.x+t.w,e.x+e.w)-i,r=Math.min(t.y+t.h,e.y+e.h)-n;return o>0&&r>0?{x:i,y:n,w:o,h:r}:void 0}function Zt(t,e,i,n){const o=t.offsetParent,r=t.parentElement;if(o&&r&&(t.offsetWidth>0||t.offsetHeight>0)){let s,a;r===o?(s=r.clientLeft+t.offsetLeft,a=r.clientTop+t.offsetTop):r.offsetParent===o&&(s=t.offsetLeft-r.offsetLeft,a=t.offsetTop-r.offsetTop);const c=r.getBoundingClientRect();if(void 0!==s&&void 0!==a&&r.offsetWidth>0&&r.offsetHeight>0){const o=c.width/r.offsetWidth/i,l=c.height/r.offsetHeight/n,d=e(c);return{x:d.x+(s-r.scrollLeft)*o,y:d.y+(a-r.scrollTop)*l,w:t.offsetWidth*o,h:t.offsetHeight*l}}}return e(t.getBoundingClientRect())}let Yt=class extends s.WF{constructor(){super(...arguments),this.flows=[],this.dark=!1,this._rects=new Map,this._rectKey="",this._endsKey="",this._labelSizes=new Map,this._onFonts=()=>{this._labelSizes.clear(),this.requestUpdate(),this._schedule()},this._observed=new Set,this._raf=0,this._onMedia=()=>this.requestUpdate(),this._schedule=()=>{!this._raf&&this.isConnected&&(this._raf=requestAnimationFrame(()=>{this._raf=0,this.measure()}))}}flowAt(t,e,i=8){let n;for(const o of this.renderRoot.querySelectorAll("g.flow")){const r=o.querySelector("path.line"),s=r?.getScreenCTM?.();if(!r||!s||"function"!=typeof r.getTotalLength)continue;const a=new DOMPoint(t,e).matrixTransform(s.inverse()),c=Math.hypot(s.a,s.b)||1,l=r.getTotalLength();for(let t=0;t<=l;t+=2){const e=r.getPointAtLength(t),s=Math.hypot(e.x-a.x,e.y-a.y)*c;s<=i&&(!n||s<n.d)&&(n={key:o.dataset.flow??"",d:s})}}return n?.key||void 0}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._watch(),document.fonts?.addEventListener?.("loadingdone",this._onFonts),document.fonts?.ready?.then(this._onFonts,()=>{})}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),document.fonts?.removeEventListener?.("loadingdone",this._onFonts),this._unwatch(),this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_watch(){const t=this.parentElement??void 0;if(!t||t===this._content)return!1;this._unwatch(),this._content=t,"function"==typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this.measure()),this._ro.observe(t));for(const e of Ut)t.addEventListener(e,this._schedule,{capture:!0,passive:!0});return"function"==typeof MutationObserver&&(this._mo=new MutationObserver(this._schedule),this._mo.observe(t,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["style","class","hidden","data-mc-hidden"]})),!0}_unwatch(){for(const t of Ut)this._content?.removeEventListener(t,this._schedule,{capture:!0});this._ro?.disconnect(),this._mo?.disconnect(),this._ro=void 0,this._mo=void 0,this._observed.clear(),this._content=void 0,this._endsKey=""}_probeOffsetPath(){if(void 0!==this._offsetPathWorks)return;const t=this.renderRoot.querySelector("svg.back");if(!t||!this.renderRoot.querySelector("circle.dot"))return;const e=document.createElementNS("http://www.w3.org/2000/svg","circle");e.setAttribute("class","probe"),e.setAttribute("r","1"),e.setAttribute("style","offset-path: path('M 0 0 L 100 0'); offset-distance: 100%; offset-rotate: 0deg; visibility: hidden"),t.append(e);const i=e.getBoundingClientRect(),n=t.getBoundingClientRect();if(e.remove(),!(i.width>0&&n.width>0))return;const o=t instanceof SVGSVGElement&&t.clientWidth>0?n.width/t.clientWidth:1;this._offsetPathWorks=i.left+i.width/2-n.left>50*o,this._offsetPathWorks||this.requestUpdate()}updated(){this._probeOffsetPath();const t=this._watch(),e=JSON.stringify((this.flows??[]).filter(t=>t.visible).map(t=>[t.from,t.to]));(t||e!==this._endsKey)&&(this._endsKey=e,this.measure());let i=!1;for(const t of this.renderRoot.querySelectorAll(".label[data-measure]")){const e=Bt(t.dataset.measure??"");this._labelSizes.has(e)||(this._labelSizes.size>=200&&this._labelSizes.delete(this._labelSizes.keys().next().value),this._labelSizes.set(e,{w:t.offsetWidth,h:t.offsetHeight}),i=!0)}i&&this.requestUpdate()}measure(){const t=this._content;if(!t)return;const e=new Set;for(const t of this.flows??[])t.visible&&e.add(t.from).add(t.to);const i=new Map,n=new Set;if(e.size)for(const o of t.querySelectorAll("[data-mc-id], .mc-column")){n.add(o);const t=o.dataset.mcId;t&&e.has(t)&&!i.has(t)&&i.set(t,o)}for(const t of[...this._observed])n.has(t)||(this._ro?.unobserve(t),this._observed.delete(t));for(const t of n)this._observed.has(t)||(this._ro?.observe(t),this._observed.add(t));const o=t.getBoundingClientRect(),r=t.offsetWidth>0&&o.width>0?o.width/t.offsetWidth:1,s=t.offsetHeight>0&&o.height>0?o.height/t.offsetHeight:1,a=t.offsetWidth||o.width,c=t.offsetHeight||o.height,l=e=>({x:(e.left-o.left)/r-t.clientLeft,y:(e.top-o.top)/s-t.clientTop,w:e.width/r,h:e.height/s}),d=new Map,u=t=>{let e=d.get(t);if(void 0!==e)return e;const i=getComputedStyle(t);if(e=null,[i.overflowX,i.overflowY,i.overflow].some(t=>t&&"visible"!==t)){const i=l(t.getBoundingClientRect()),n=t.offsetWidth>0?i.w/t.offsetWidth:1,o=t.offsetHeight>0?i.h/t.offsetHeight:1;e={x:i.x+t.clientLeft*n,y:i.y+t.clientTop*o,w:t.clientWidth>0?t.clientWidth*n:i.w,h:t.clientHeight>0?t.clientHeight*o:i.h}}return d.set(t,e),e},h=new Map;for(const[e,n]of i){if("function"==typeof n.checkVisibility&&!n.checkVisibility())continue;let i=Zt(n,l,r,s);for(let e=Ht(n);i&&e&&e!==t;e=Ht(e)){const t=u(e);t&&(i=Gt(i,t))}if(!i||i.w<=0||i.h<=0)continue;const o={x:Ft(i.x),y:Ft(i.y),w:Ft(i.w),h:Ft(i.h)},d=n.querySelector(":scope > mc-shape")?.shape;d&&(o.shape=d),a&&c&&(o.x>=a||o.y>=c||o.x+o.w<=0||o.y+o.h<=0)||h.set(e,o)}const m=JSON.stringify([a,c,...h]);m!==this._rectKey&&(this._rectKey=m,this._rects=h,this._bounds=a&&c?{w:a,h:c}:void 0,this.requestUpdate())}render(){const t=!!this._media?.matches,e=!1!==this._offsetPathWorks&&"undefined"!=typeof CSS&&"function"==typeof CSS.supports&&CSS.supports("offset-path",'path("M0 0")'),i=[],n=[],o=[],r=(this.flows??[]).flatMap((t,e)=>{const i=this._rects.get(t.from),n=this._rects.get(t.to);return t.visible&&i&&n?[{f:t,i:e,a:i,b:n,from:t.from,to:t.to,sides:Nt(i,n,t.fromSide,t.toSide)}]:[]}),a=function(t,e){const i=t.map(()=>[.5,.5]),n=new Map;t.forEach((t,i)=>{const o=e.get(t.from),r=e.get(t.to);o&&r&&[0,1].forEach(e=>{const[s,a,c,l]=0===e?[t.from,t.sides[0],r,t.sides[1]]:[t.to,t.sides[1],o,t.sides[0]],d=Et(c,l),u=`${s}|${a}`,h=n.get(u)??[];h.push({flow:i,end:e,key:qt(a)?d.y:d.x}),n.set(u,h)})});for(const[t,o]of n){const n=o.length;if(n<2)continue;const[r,s]=t.split("|"),a=e.get(r),c=qt(s)?a.h:a.w;if(c<=0)continue;const l=Math.min(16,.6*c/(n-1));o.sort((t,e)=>t.key-e.key||t.flow-e.flow),o.forEach((t,e)=>{i[t.flow][t.end]=.5+(e-(n-1)/2)*l/c})}return i}(r,this._rects),c=[...this._rects.values()],l=r.reduce((i,{f:n})=>i+((i=>i.active&&0!==i.direction&&!t&&e&&i.dots>0)(n)?n.dots:0),0);return r.forEach(({f:r,i:d,a:u,b:h,sides:m},p)=>{const f=t&&r.active&&0!==r.direction?Jt(r.width):0,g=r.direction<0?[f,0]:[0,f],y=Wt(u,h,m,r.route,{t:a[p],trim:g});("front"===r.layer?n:i).push(this._flow(r,y,d,t,e,(t=>l>40?Math.max(1,Math.floor(40*t.dots/l)):t.dots)(r)));const v=r.label;if(!v||"hidden"===r.labelPosition)return;const b=r.active?r.color:r.idleColor,_=this._labelSizes.get(Bt(v));if(!_)return void o.push(s.qy`<div class="label" data-measure=${v} style="left: 0; top: 0; visibility: hidden">${v}</div>`);const w=Vt(y,_,{position:r.labelPosition,width:r.width,arrow:f,obstacles:c,bounds:this._bounds});w&&(c.push({x:w.x-_.w/2,y:w.y-_.h/2,w:_.w,h:_.h}),o.push(s.qy`<div class="label" style="left: ${Ft(w.x)}px; top: ${Ft(w.y)}px; --mc-flow-color: ${b}">${v}</div>`))}),s.qy`
      <svg class="back" ${(0,X.Sv)()} focusable="false">${i}</svg>
      <svg class="front" ${(0,X.Sv)()} focusable="false">${n}</svg>
      <div class="labels">${o}</div>
    `}_flow(t,e,i,n,o,r){const a=t.color,c=t.active&&0!==t.direction,l=t.direction<0?"reverse":"normal",d=c&&!n&&t.dots>0&&o,u=c&&!n&&!d,h=c&&n,m=`mc-flow-arrow-${i}`,p=Jt(t.width),f=c&&!u?a:t.idleColor,g=Math.max(4,2*t.width),y=2.5*g,v=e.length>0?t.speedS*y/e.length:t.speedS,b=!!this.selected&&this.selected===t.id;return s.JW`<g class="flow" data-flow=${t.id} data-dots=${d?"":s.s6} data-selected=${b?"":s.s6}>
      ${b?s.JW`<path class="sel" d=${e.d} style="stroke-width: ${Ft(t.width+10)}px"></path>`:s.s6}
      ${h?s.JW`<marker id=${m} viewBox="0 0 10 10" refX="0" refY="5" markerWidth=${p} markerHeight=${p}
            markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" style="fill: ${a}; stroke: none"></path></marker>`:s.s6}
      <path class="line" d=${e.d} pathLength="100" style="stroke: ${f}; stroke-width: ${Ft(t.width)}px"
        marker-end=${h&&t.direction>0?`url(#${m})`:s.s6}
        marker-start=${h&&t.direction<0?`url(#${m})`:s.s6}></path>
      ${u?s.JW`<path class="dash" d=${e.d} style="stroke: ${a}; stroke-width: ${Ft(t.width)}px; stroke-dasharray: ${Ft(g)} ${Ft(y-g)}; --mc-flow-shift: ${-Ft(y)}px; animation-duration: ${v.toFixed(3)}s; animation-direction: ${l}"></path>`:s.s6}
      ${d?s.JW`<g class="dots" style="fill: ${a}">${Array.from({length:r},(i,n)=>{const o=`offset-path: path('${e.d}'); animation-duration: ${t.speedS.toFixed(3)}s; animation-delay: ${+(-t.speedS*n/r).toFixed(3)||0}s; animation-direction: ${l}`;return s.JW`${t.glow>0?s.JW`<circle class="glow" r=${Ft(t.dotSize/2+t.glow)} style=${o}></circle>`:s.s6}<circle
              class="dot" r=${t.dotSize/2} style=${o}></circle>`})}</g>`:s.s6}
    </g>`}};Yt.styles=x,It([(0,a.MZ)({attribute:!1,hasChanged:(t,e)=>!function(t,e){return t===e||!!t&&!!e&&JSON.stringify(t)===JSON.stringify(e)}(t,e)})],Yt.prototype,"flows",void 0),It([(0,a.MZ)({type:Boolean,reflect:!0})],Yt.prototype,"dark",void 0),It([(0,a.MZ)({attribute:!1})],Yt.prototype,"selected",void 0),Yt=It([(0,a.EM)("mc-flows")],Yt);var Kt=i(7624);function Xt(t,e){t.removeAttribute(e),t.offsetWidth,t.setAttribute(e,"")}var Qt=i(170),te=i(3686),ee=i(7850),ie=i(3925),ne=i(598);const oe="magic_card_utils/get_templates",re="magic_card_utils/subscribe_template",se=t=>!!t&&"object"==typeof t&&!Array.isArray(t),ae=t=>String(t?.code??""),ce=new Map,le=new Set;function de(t,e){t.state=e,t.retry=!1;for(const i of[...t.listeners])i(e)}function ue(t,e,i,n,o){((t,e)=>{le.has(t)||(le.add(t),console.warn("Magic Card: template unavailable",t,e))})(ae(n)||"error",n),de(e,{status:"unavailable"}),e.retry=o,o&&!e.dead&&(e.timer=setTimeout(()=>fe(t,e,i),15e3))}function he(t){return se(t)&&se(t.config)?{status:"ready",config:t.config}:void 0}function me(t,e,i){t.all??=t.hass.callWS({type:oe}),t.all.then(t=>{if(e.dead)return;const n=se(t)&&se(t.templates)?t.templates:{};var o,r;de(e,(o=n,r=i,Object.prototype.hasOwnProperty.call(o,r)?he(n[i])??{status:"missing"}:{status:"missing"}))},n=>{t.all=void 0,e.dead||ue(t,e,i,n,!["unauthorized","unknown_command"].includes(ae(n)))})}function pe(t){if(t.probeTimer||!t.legacy)return;const e=Math.min(5e3*2**t.probes++,3e4);t.probeTimer=setTimeout(()=>{t.probeTimer=void 0;const e=t.entries.entries().next().value;t.legacy&&e&&fe(t,e[1],e[0],!0)},e)}function fe(t,e,i,n=!1){if(e.dead||e.busy||e.unsub)return;if(clearTimeout(e.timer),t.legacy&&!n)return me(t,e,i);e.busy=!0;const o=e.gen=(e.gen??0)+1,r=()=>e.gen===o,s=()=>{t.legacy=!1,t.all=void 0,t.probes=0;for(const[i,n]of t.entries)n!==e&&fe(t,n,i)},a=o=>{if(!r())return;e.busy=!1;const a="unknown_command"===ae(o);if(n){if(a)return pe(t);if(s(),e.dead)return}e.dead||(a?(t.legacy=!0,me(t,e,i),pe(t)):ue(t,e,i,o,!0))};try{Promise.resolve(t.hass.connection.subscribeMessage(n=>r()&&!e.dead&&function(t,e,i,n){if(!se(n)||n.name!==i)return;if("deleted"===n.action)return de(e,{status:"missing"});const o="saved"===n.action?he(n.template):void 0;o?de(e,o):ue(t,e,i,new Error("unexpected template event"),!1)}(t,e,i,n),{type:re,name:i},{resubscribe:!1})).then(t=>{r()&&(e.busy=!1,"function"==typeof t&&(n&&s(),e.dead?t():e.unsub=t))},a)}catch(t){a(t)}}function ge(t,e){t.removeEventListener?.("ready",e.onReady),clearTimeout(e.probeTimer),ce.delete(t)}const ye={watch(t,e,i){const n=t.connection;if(!n)return i({status:"unavailable"}),()=>{};const o=function(t,e){let i=ce.get(e);if(!i){const n={hass:t,entries:new Map,probes:0,onReady:()=>{n.legacy=!1,n.all=void 0,n.probes=0,clearTimeout(n.probeTimer),n.probeTimer=void 0;for(const[t,e]of n.entries)e.unsub=void 0,e.busy=!1,fe(n,e,t)}};e.addEventListener?.("ready",n.onReady),ce.set(e,i=n)}return i}(t,n);let r=o.entries.get(e);const s=!r;r||o.entries.set(e,r={listeners:new Set});const a=r;return a.listeners.add(i),a.state&&i(a.state),s&&fe(o,a,e),()=>{a.listeners.delete(i)&&!a.listeners.size&&(a.dead=!0,clearTimeout(a.timer),a.unsub?.(),o.entries.delete(e),o.entries.size||ge(n,o))}},reset(){for(const[t,e]of ce){for(const t of e.entries.values())t.dead=!0,clearTimeout(t.timer),t.unsub?.();ge(t,e)}le.clear()}};class ve{static validate(t){const e=[],i=[];if(!t||"object"!=typeof t)return{valid:!1,errors:[(0,r.t)(5)],warnings:i};const n=t;return n.type&&"string"==typeof n.type||e.push((0,r.t)(7)),Array.isArray(n.rows)?(n.rows.forEach((t,n)=>{t.columns&&Array.isArray(t.columns)?t.columns.forEach((t,o)=>{t.modules&&Array.isArray(t.modules)?t.modules.forEach((t,s)=>{if(t&&"object"==typeof t)if(t.type)if(ee.s.has(t.type)){const e=ee.s.get(t.type),a=e?e.validate(t):[];i.push(...a.map(e=>(0,r.t)(45,{row:n,col:o,module:s,type:String(t.type),error:e})))}else i.push((0,r.t)(48,{row:n,col:o,module:s,type:String(t.type)}));else i.push((0,r.t)(46,{row:n,col:o,module:s}));else e.push((0,r.t)(47,{row:n,col:o,module:s}))}):e.push((0,r.t)(49,{row:n,col:o}))}):e.push((0,r.t)(44,{row:n}))}),{valid:0===e.length,errors:e,warnings:i}):(e.push((0,r.t)(6)),{valid:!1,errors:e,warnings:i})}}var be=i(213),_e=i(765),we=i(8816);const xe=new Map;function $e(t){return JSON.stringify(Object.keys(t).sort().map(e=>[e,t[e]]))}function ke(t){return String(t&&"object"==typeof t&&"message"in t?t.message:t)}class Me{constructor(t,e,i=50){this._requestUpdate=t,this._connection=e,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const t of this._subs.values())t.failed=!1;if(this._connected)for(const t of this._subs.values())this._subscribe(t)}}begin(){this._wanted=new Set,this._dirty=!1}get(t){const e=$e(t);this._wanted?.add(e);let i=this._subs.get(e);return i||(i={msg:t,state:xe.get(e)??{status:"pending"}},this._connection()?.subscribeMessage||(i.state={status:"unavailable"}),this._subs.set(e,i)),i.state}end(){const t=this._wanted;if(this._wanted=null,t)for(const[e,i]of this._subs)t.has(e)?this._connected&&this._subscribe(i):(this._unsubscribe(i),this._subs.delete(e))}hostConnected(){this._connected=!0;for(const t of this._subs.values())t.failed=!1,this._subscribe(t);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const t of this._subs.values())this._unsubscribe(t);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(t=>t.active).length}_listenReady(t){this._readyOn!==t&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=t?.addEventListener?t:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(t){if(t.active||t.failed)return;const e=$e(t.msg),i=this._connection();if(!i?.subscribeMessage)return void this._set(e,t,{status:"unavailable"});this._listenReady(i),"unavailable"===t.state.status&&(t.state=xe.get(e)??{status:"pending"});const n={};t.token=n;const o=()=>t.token===n;let r;try{r=i.subscribeMessage(i=>{o()&&this._set(e,t,{status:"ok",data:i})},{...t.msg})}catch(t){r=Promise.reject(t)}t.active=Promise.resolve(r).then(t=>t).catch(i=>{o()&&(t.active=void 0,t.token=void 0,t.failed=!0,this._set(e,t,{status:"error",error:ke(i)}))})}_unsubscribe(t){const e=t.active;t.active=void 0,t.token=void 0,e&&e.then(t=>{try{t?.()}catch{}})}_set(t,e,i){e.state!==i&&(e.state.status!==i.status||"ok"===i.status||"error"===i.status&&e.state.error!==i.error)&&(e.state=i,function(t,e){"ok"===e.status&&(xe.delete(t),xe.set(t,e),xe.size>100&&xe.delete(xe.keys().next().value))}(t,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}var Se=i(7924),Ae=i(7110),Ce=i(5112);var ze=i(1535),qe=i(4413),je=i(8003),Ee=i(5746),Te=i(4753),Pe=i(5832),Ne=i(9186);const Oe={position:"absolute",width:"0",height:"0",margin:"0",padding:"0","min-height":"0",overflow:"visible"};class Re{constructor(t,e){this.host=t,this.opts=e,this.phase="closed",this._source="hash",this._pushed=!1,this._awaitPop=!1,this._initialChecked=!1,this._returnFocus=null,this._placeholders=[],this._swipe=new Pe.Ho,this._onKeydown=t=>{this._restartAutoClose(),"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this._close("user"))},this._onCancel=t=>{t.preventDefault(),this._close("user")},this._onNativeClose=()=>{"open"===this.phase&&this._close("user")},this._onActivity=()=>this._restartAutoClose(),this._onBackdrop=t=>{t.stopPropagation(),this._close("user")},this._onCloseClick=t=>{t.stopPropagation(),this._close("user")},this._onHandleDown=t=>{!t.isPrimary||t.button>0||"open"!==this.phase||t.target?.closest?.(".mc-popup-close")||(this._swipe.start(t.clientY,t.timeStamp),t.currentTarget.setPointerCapture?.(t.pointerId),this._surface()?.setAttribute("data-dragging",""))},this._onHandleMove=t=>{if(!this._swipe.active)return;const e=this._swipe.move(t.clientY);this._surface()?.style.setProperty("--mc-popup-drag",`${e}px`)},this._onHandleUp=t=>{if(!this._swipe.active)return;const e=this._surface(),i=this._swipe.end(t.clientY,t.timeStamp,e?.getBoundingClientRect().height??0);e?.removeAttribute("data-dragging"),i?this._close("user"):e?.style.removeProperty("--mc-popup-drag")},this._onHandleCancel=()=>{if(!this._swipe.active)return;this._swipe.cancel();const t=this._surface();t?.removeAttribute("data-dragging"),t?.style.removeProperty("--mc-popup-drag")},t.addController(this)}isPopup(){return(0,Pe.uT)(this.opts.config())}popupId(){return this.isPopup()?(0,Pe.t8)(this.opts.config()):void 0}editorPlace(){return this.opts.editorPlace()}get hidden(){return this.isPopup()&&!this.editorPlace()}get isOpen(){return"closed"!==this.phase}_listening(){return this.host.isConnected&&this.hidden}hostConnected(){Ne.P.register(this),this._initialChecked=!1}hostDisconnected(){Ne.P.unregister(this),this._finish(!1),this._restorePlaceholders(),window.clearTimeout(this._awaitPopTimer),this._awaitPop=!1}hostUpdated(){this._syncPlaceholders(),this._listening()?this._initialChecked||(this._initialChecked=!0,(0,Pe.CR)(window.location.hash,this.popupId())&&this._open("hash",!1)):(this._initialChecked=!1,"open"===this.phase&&"preview"!==this._source&&this._close("silent")),this._syncDialog()}get _dialog(){return this.host.shadowRoot?.querySelector("dialog.mc-popup")??null}_syncDialog(){const t=this._dialog;if(t)if("closed"===this.phase||t.open)"closed"===this.phase&&t.open&&t.close();else{try{t.showModal()}catch{t.setAttribute("open","")}this._focusInside(t)}}_focusInside(t){const e=t.querySelector(".mc-popup-close")??t.querySelector(".mc-popup-surface");e?.focus({preventScroll:!0})}_syncPlaceholders(){if(!(this.hidden&&this.host.isConnected))return void this._restorePlaceholders();if(this._placeholders.length)return;const t=[this.host],e=this.host.parentElement;if("hui-card"===e?.localName){t.push(e);const i=e.parentElement;"div"===i?.localName&&i.classList.contains("card")&&t.push(i)}this._placeholders=t.map(t=>{const e={};for(const[i,n]of Object.entries(Oe))e[i]=t.style.getPropertyValue(i),t.style.setProperty(i,n);return{el:t,saved:e}})}_restorePlaceholders(){for(const{el:t,saved:e}of this._placeholders)for(const[i,n]of Object.entries(e))n?t.style.setProperty(i,n):t.style.removeProperty(i);this._placeholders=[]}locationChanged(t){if(!this._listening())return;if("pop"===t)this._awaitPop=!1,window.clearTimeout(this._awaitPopTimer);else if(this._awaitPop)return;const e=(0,Pe.CR)(window.location.hash,this.popupId());e&&"open"!==this.phase?this._open("hash","replace"!==t):e||"open"!==this.phase||"hash"!==this._source||this._close("location")}hassChanged(t,e){if(!this._listening()||!t||!e)return;const i=this.opts.config();"open"!==this.phase&&(0,Pe.b7)(i?.open_on,t.states,e.states)?(0,Ne.R)(this.popupId())||this._open("trigger",!1):"open"===this.phase&&(0,Pe.b7)(i?.close_on,t.states,e.states)&&this._close("user")}openPreview(){this._open("preview",!1)}closeForOther(){this._close("other")}closeByAction(){this._close("user")}close(){this._close("user")}_open(t,e){if(window.clearTimeout(this._closeTimer),this._closeTimer=void 0,this._source=t,this._pushed=e,"open"===this.phase)return;const i="closing"===this.phase;Ne.P.willOpen(this),i||(this._returnFocus=function(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}()),this.phase="open",this._restartAutoClose(),this.host.requestUpdate()}_close(t){if("open"!==this.phase)return;window.clearTimeout(this._autoTimer),"hash"===this._source&&"location"!==t&&"silent"!==t&&this._leaveHash("other"===t),this.phase="closing",this.host.requestUpdate();const e="silent"===t||"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:280;this._closeTimer=window.setTimeout(()=>this._finish(!0),e)}_leaveHash(t){if((0,Pe.CR)(window.location.hash,this.popupId())){if(this._pushed&&!t)return this._awaitPop=!0,window.clearTimeout(this._awaitPopTimer),this._awaitPopTimer=window.setTimeout(()=>{this._awaitPop=!1},1e3),void history.back();history.replaceState(history.state,"",(0,Pe.WV)(window.location.href)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}}))}}_finish(t){if(window.clearTimeout(this._closeTimer),window.clearTimeout(this._autoTimer),this._closeTimer=void 0,this._swipe.cancel(),"closed"===this.phase)return;this.phase="closed",Ne.P.didClose(this);const e=this._dialog;e?.open&&e.close(),this.host.requestUpdate();const i=this._returnFocus;this._returnFocus=null,t&&i?.isConnected&&i.focus({preventScroll:!0})}_restartAutoClose(){window.clearTimeout(this._autoTimer);const t=(0,Pe.GD)(this.opts.config()?.auto_close);t&&"open"===this.phase&&(this._autoTimer=window.setTimeout(()=>this._close("user"),t))}_surface(){return this._dialog?.querySelector(".mc-popup-surface")??null}renderHead(t){const e=this.opts.config(),i="sheet"===(0,Pe.yB)(e),n=e?.title?.trim(),o=!1!==e?.show_close;return i||n||o?s.qy`
      <div
        class="mc-popup-head"
        @pointerdown=${i?this._onHandleDown:s.s6}
        @pointermove=${i?this._onHandleMove:s.s6}
        @pointerup=${i?this._onHandleUp:s.s6}
        @pointercancel=${i?this._onHandleCancel:s.s6}
      >
        ${i?s.qy`<div class="mc-popup-handle" aria-hidden="true"></div>`:s.s6}
        ${n?s.qy`<h2 class="mc-popup-title" id=${t}>${n}</h2>`:s.qy`<span class="mc-popup-title"></span>`}
        ${o?s.qy`<button type="button" class="mc-popup-close" aria-label=${(0,r.t)(4)} title=${(0,r.t)(4)} @click=${this._onCloseClick}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`:s.s6}
      </div>
    `:s.qy``}renderDialog(t,e,i,n){const o=this.opts.config(),r=!!o?.title?.trim();return s.qy`
      <dialog
        class="mc-popup"
        data-mc-popup=""
        data-style=${(0,Pe.yB)(o)}
        data-phase=${this.phase}
        aria-modal="true"
        aria-labelledby=${r?i:s.s6}
        aria-label=${r?s.s6:e}
        style=${(0,Pe.gt)(o,n)}
        @keydown=${this._onKeydown}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @pointerdown=${this._onActivity}
        @wheel=${this._onActivity}
        @touchstart=${this._onActivity}
      >
        ${"closed"===this.phase?s.s6:s.qy`<div class="mc-popup-backdrop" @click=${this._onBackdrop}></div>
              <div class="mc-popup-frame">${t}</div>`}
      </dialog>
    `}}var Le,De=i(2093),We=i(4722),Ie=i(9486),Be=function(t,e,i,n){var o,r=arguments.length,s=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(s=(r<3?o(s):r>3?o(e,i,s):o(e,i))||s);return r>3&&s&&Object.defineProperty(e,i,s),s};function Fe(t,e){if(!t||"object"!=typeof t)return t;const i=t.id||e,n={...t,id:i};if(!(0,Ee.yZ)(t))return n;const o=n,r=(t,e)=>Array.isArray(t)?t.map((t,n)=>Fe(t,`${i}~${e}.${n}`)):t;if("row"===t.type||"tabs"===t.type){const e="row"===t.type?"columns":"tabs";Array.isArray(o[e])&&(o[e]=o[e].map((t,e)=>t&&"object"==typeof t?{...t,modules:r(t.modules,e)}:t))}else Array.isArray(o.modules)&&(o.modules=r(o.modules,0));return n}function Ue(t,e){return[t?.tap_action,t?.hold_action,t?.double_tap_action].some(t=>function(t,e){if(!t||"object"!=typeof t||!t.action||"none"===t.action)return!1;const i=t=>"string"==typeof t&&""!==t.trim();switch(t.action){case"navigate":return i(t.navigation_path);case"url":return i(t.url_path);case"perform-action":return i(t.service);case"toggle":case"more-info":return i(t.entity)||!1!==t.use_module_entity&&i(e);case"popup":return i(t.hash);default:return!0}}(t,e))}const He='input, select, textarea, button, a[href], [role="button"], [role="slider"], [role="switch"], [role="tab"], [role="checkbox"], [contenteditable=""], [contenteditable="true"], ha-slider, ha-switch, ha-camera-stream, mc-embedded-card, .mc-slider-pagination',Je=`${He}, [tabindex]:not([tabindex="-1"])`;let Ve=0;const Ge={width:"var(--ha-card-border-width, 1px)",style:"solid",color:"var(--ha-card-border-color, var(--divider-color, #e0e0e0))"};function Ze(t,e,i,n){const o=it(t,n);return o?{shape:o,stroke:(0,j.eI)(t),shadow:(0,j.a7)(t?.box_shadow),style:(0,j.DA)(t,e,i),edge:i}:{border:(0,j.fV)(t),style:i?(0,j.AT)(t,e,{min:i}):void 0}}function Ye(t){return{...t,rows:(t.rows||[]).map((t,e)=>{const i=t.id||`row~${e}`;return{...t,id:i,columns:(t.columns||[]).map((t,e)=>{const n=t.id||`${i}~col${e}`;return{...t,id:n,modules:(t.modules||[]).map((t,e)=>Fe(t,`${n}~${e}`))}})}})}}let Ke=Le=class extends s.WF{constructor(){super(...arguments),this.editMode=!1,this.preview=!1,this._readThemeShadow=!1,this._customRendered=!1,this._sequences=new Map,this._v2Render=[],this._v2Applied=new Set,this._v2Need=!1,this._v2Waiting=!1,this._pNeed=!1,this._pApplied=new Set,this._customLookup=t=>(this._customRendered=!0,De.iG.ensure(this.hass),!this._unsubLibrary&&this.isConnected&&(this._unsubLibrary=De.iG.subscribe(this._onLibrary)),De.iG.get(t)??(0,De.n6)(this._resolvedConfig??this._config)?.get(t)),this._onLibrary=()=>{this._libDirty=!0,this.requestUpdate()},this._shapes={library:t=>(this._unsubShapes??=function(t){const e=e=>"shapes"===e.detail?.kind&&t();return window.addEventListener(J.S8,e),()=>window.removeEventListener(J.S8,e)}(()=>{this._libDirty=!0,this.requestUpdate()}),(t=>window.magicCardUtils?.shapes?.get(t))(t)),inline:t=>(this._resolvedConfig??this._config)?.custom_shapes?.[t]},this._boundRequestUpdate=()=>this.requestUpdate(),this._onTapAnimations=t=>function(t,e){for(const i of t.composedPath()){if(i===e)break;if(i instanceof HTMLElement){i.hasAttribute("data-mc-tap")&&Xt(i,"data-mc-tapped");for(const e of i.querySelectorAll(":scope > .mc-anim-fx[data-tap], :scope > .mc-anim-ring[data-tap]")){const n=i.getBoundingClientRect();e.style.setProperty("--mc-tap-x",`${Math.round(t.clientX-n.left)}px`),e.style.setProperty("--mc-tap-y",`${Math.round(t.clientY-n.top)}px`),Xt(e,"data-tapped")}}}}(t,this),this._holdTimers=new WeakMap,this._downAt=new WeakMap,this._pendingTimers=new Set,this._claimed=new WeakSet,this._tapTimers=new WeakMap,this._templates=new we.XM(()=>this.requestUpdate(),()=>this.hass?.connection),this._subscriptions=new Me(()=>this.requestUpdate(),()=>this.hass?.connection),this._media=new Se.J2(()=>this.requestUpdate(),()=>this.hass),this._pathStack=[],this._uiState=new Map,this._renderContext={instance:"card-"+ ++Ve,template:(t,e)=>this._templates.get(t,e),subscribe:t=>this._subscriptions.get(t),media:t=>this._media.get(t),requestUpdate:()=>this.requestUpdate(),renderChild:(t,e,i=0)=>{const n=this._pathStack[this._pathStack.length-1];return void 0===n?(0,qe.CF)(t,this.hass):this._renderModule(t,`${n}/${i}.${e}`)},renderColumn:(t,e)=>{const i=this._pathStack[this._pathStack.length-1];return void 0===i?void 0:this._renderColumn(t,0,e,i)},childHidden:t=>!this.editMode&&this._withEntity(this._entityOf(t),()=>this._isHidden(t)),uiState:t=>{const e=`${this._pathStack[this._pathStack.length-1]??""}#${t}`;return{get:()=>this._uiState.get(e),set:t=>{this._uiState.set(e,t)}}},selectedChild:()=>{const t=this._pathStack[this._pathStack.length-1],e=this.selectedPath;if(this.editMode&&void 0!==t&&e){if(e.startsWith(`${t}#`))return{slot:Number(e.slice(t.length+1)),index:-1};if(e.startsWith(`${t}/`))return(0,Ee.Tu)(e.slice(t.length+1).split("#")[0])?.[0]}},editMode:!1},this._hoverRules=new Map,this._popup=new Re(this,{config:()=>(this._resolvedConfig??this._config)?.popup,editorPlace:()=>this._editorPlace()}),this._seasonalBudget=new U.W8,this._seasonal=new Ct(this,{config:()=>(this._look??this._resolvedConfig??this._config)?.seasonal,hass:()=>this.hass,editorPreview:()=>{const t=this._editorPlace();return"canvas"===t||"card-editor"===t},idle:()=>this._popup.hidden&&!this._popup.isOpen})}static async getConfigElement(){if(!await B())throw new Error((0,r.t)(28));return document.createElement(o.z)}static getStubConfig(){return{type:`custom:${o.Mp}`,rows:[{id:(0,E.$)("row"),share_entity:!0,layout:"1",columns:[{id:(0,E.$)("col"),share_entity:!0,modules:[{id:(0,E.$)("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(t){if(!t)throw new Error((0,r.t)(37));const e=ve.validate(t);if(!e.valid)throw new Error((0,r.t)(24,{errors:e.errors.join("; ")}));const i=this._config?.template;this._config=Ye({...t,rows:t.rows||[]}),t.template!==i&&(this._templateConfig=void 0,this._templateNotice=void 0,this._resolvedConfig=void 0),this._wantShapes(this._config),this._templateConfig&&(this._resolvedConfig=Ye((0,ne.e5)(this._templateConfig,this._config))),(0,F.ER)(this._resolvedConfig??this._config)}_wantShapes(t){t===this._shapeCfg||(0,Z.Lu)()||(this._shapeCfg=t,JSON.stringify(t).includes('"shape":"custom"')&&(0,Z.En)().then(t=>t&&this.isConnected&&this.requestUpdate()))}getCardSize(){return this._popup.hidden?0:this._config?.rows?Math.max(this._config.rows.length,1):1}getGridOptions(){return this._popup.hidden?{columns:"full",rows:"auto",min_rows:0}:{}}getLayoutOptions(){return this._popup.hidden?{grid_columns:"full",grid_rows:"auto",grid_min_rows:0}:{}}connectedCallback(){super.connectedCallback(),this.addEventListener("mc-request-update",this._boundRequestUpdate),this.addEventListener("pointerdown",this._onTapAnimations),this._templates.hostConnected(),this._subscriptions.hostConnected(),this._media.hostConnected(),this.hasUpdated&&this._syncTicker(),this.hasUpdated&&this._syncTemplateWatch(),this.hasUpdated&&this._customRendered&&this._onLibrary()}_dependencies(){const t=this._resolvedConfig??this._config;return t?(0,_e._)(t,{editMode:this.editMode}):{entities:[],forwardHass:!1}}_syncTicker(){const t=this._popup.hidden&&!this._popup.isOpen,e=this.isConnected&&!t?this._dependencies().refreshInterval:void 0;if(e===this._tickInterval&&(void 0===e||void 0!==this._tickTimer))return;if(void 0!==this._tickTimer&&window.clearTimeout(this._tickTimer),this._tickTimer=void 0,this._tickInterval=e,!e)return;const i=()=>{const t=e-Date.now()%e+20;this._tickTimer=window.setTimeout(()=>{this.requestUpdate(),i()},t)};i()}shouldUpdate(t){if(t.has("hass")&&this.hass&&(0,Te.Zc)(this.hass),t.has("hass")&&this._popup.hassChanged(t.get("hass"),this.hass),this._libDirty||t.has("_config")||t.has("_resolvedConfig"))return!0;if(t.has("preview")||t.has("editMode"))return!0;if(t.has("hass")&&this.hass){const e=t.get("hass");if(!e)return!0;if(e.language!==this.hass.language)return!0;if(e.themes!==this.hass.themes||e.locale!==this.hass.locale||e.entities!==this.hass.entities)return!0;if(this._popup.hidden&&!this._popup.isOpen)return!1;if(this._seasonal.changed(e))return!0;const i=this._dependencies();return!!i.entities.some(t=>e.states[t]!==this.hass.states[t])||(i.forwardHass&&this._forwardHass(),!1)}return!0}_forwardHass(){const t=this.hass;if(t)for(const e of this.renderRoot?.querySelectorAll("mc-embedded-card")??[])e.hass=t}updated(t){if(super.updated(t),this._seasonalBudget.settle()&&this.requestUpdate(),this._syncHoverStyles(),this._syncRowFocus(),this._libDirty=!1,this._customRendered&&(0,We.ag)(this.renderRoot),(this._customRendered||this._sequences.size)&&(0,Ie.kj)(this.renderRoot,this._sequences),(this._v2Need||this._v2Applied.size)&&this._syncRuntime(),(this._pNeed||this._pApplied.size)&&this._syncParticles(),this._readThemeShadow){const t=(0,j.a7)(getComputedStyle(this).getPropertyValue("--ha-card-box-shadow"));t!==this._themeShadow&&(this._themeShadow=t)}this._templates.end(),this._subscriptions.end(),this._media.end(),this._syncTicker(),this.editMode||this._syncTemplateWatch()}_isEditorPreview(){return!!this.closest("hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor")}_editorPlace(){return this.editMode&&this.parentElement?.classList.contains("card-host")?"canvas":this._isEditorPreview()?"card-editor":this.preview||this.editMode?"dashboard-edit":void 0}_syncTemplateWatch(){const t=this.isConnected&&!this.editMode&&this.hass?this._config?.template:void 0,e=t?this.hass.connection:void 0;t===this._watchedTemplate&&e===this._watchedConn||(this._unwatchTemplate?.(),this._unwatchTemplate=void 0,this._watchedTemplate=t,this._watchedConn=e,t&&(this._unwatchTemplate=ye.watch(this.hass,t,e=>{if(this._config?.template===t){if(this._templateNotice="missing"===e.status||"unavailable"===e.status?e.status:void 0,"ready"===e.status)try{const t={type:"custom:magic-card",...e.config};if(!ve.validate(t).valid)throw new Error("invalid template config");this._templateConfig=t,this._resolvedConfig=Ye((0,ne.e5)(this._templateConfig,this._config)),(0,F.ER)(this._resolvedConfig)}catch(e){console.warn("Magic Card: template config is invalid",t,e),this._templateNotice="unavailable",this._templateConfig=void 0,this._resolvedConfig=void 0}else"loading"!==e.status&&(this._templateConfig=void 0,this._resolvedConfig=void 0);this.requestUpdate()}})))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mc-request-update",this._boundRequestUpdate),this.removeEventListener("pointerdown",this._onTapAnimations),this._templates.hostDisconnected(),this._subscriptions.hostDisconnected(),this._media.hostDisconnected(),this._syncTicker();for(const t of this._pendingTimers)window.clearTimeout(t);this._pendingTimers.clear(),this._holdTimers=new WeakMap,this._tapTimers=new WeakMap,this._downAt=new WeakMap,this._unwatchTemplate?.(),this._unwatchTemplate=void 0,this._watchedTemplate=void 0,this._watchedConn=void 0,this._unsubLibrary?.(),this._unsubLibrary=void 0,this._unsubShapes?.(),this._unsubShapes=void 0,(0,Ie.D5)(this._sequences);const t=(0,N.PT)();for(const e of this._v2Applied)t?.release(e);this._v2Applied=new Set;for(const t of this._pApplied)(0,O.WP)()?.release(t);this._pApplied=new Set}render(){return this._customRendered=!1,this._v2Render=[],this._v2Need=!1,this._pNeed=!1,this._templates.begin(),this._subscriptions.begin(),this._media.begin(),this._renderContext.editMode=this.editMode,this._renderContext.customIcons=(this._resolvedConfig??this._config)?.custom_icons,this._renderContext.preview=this.editMode||this.preview||this._isEditorPreview(),this._pathStack=[],this._hoverRules=new Map,(0,ze.c)(this._renderContext,()=>this._renderCard())}_renderTemplateNotice(){const t=this._config?.template;return t&&this._templateNotice?s.qy`<div class="mc-template-notice" role="status" style="padding-block: 4px; font-size: 0.85em; line-height: 1.3; color: var(--secondary-text-color)">${"missing"===this._templateNotice?(0,r.t)(54,{name:t}):(0,r.t)(53,{name:t})}</div>`:s.s6}_renderCard(){const t=this._resolvedConfig??this._config;if(!t)return s.qy`<ha-card><div class="mc-error">${(0,r.t)(36)}</div></ha-card>`;this._wantShapes(t),(0,Ce.E$)((0,Ce.Wb)(t));const e=this._popup.isPopup();this.toggleAttribute("data-mc-popup-hidden",this._popup.hidden),this.toggleAttribute("data-mc-popup-editor",e&&!this._popup.hidden);const i=`${this._renderContext.instance}-popup-title`;if(this._popup.hidden&&!this._popup.isOpen)return this._popup.renderDialog(s.s6,"",i);const n=this._scope=this._renderContext.entity=this._renderContext.cardEntity=(0,te.hY)(t,void 0);if(!this.editMode&&t.display?.conditions?.length&&!this._evaluateDisplay(t.display))return this._popup.hidden?this._popup.renderDialog(s.s6,"",i):s.qy``;const o=n?this.hass?.states[n]:void 0,a=this._look=this._resolveCardAppearance(t),c=this._buildCardStyle(a),l=(0,P.WC)({animations:a.animations},o,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),d=this._v2(l,o,n),u=this._buildThemeStyle(a),h=it(a,this._shapes),m=(0,Qt.JA)(a.ring,{states:this.hass?.states,defaultEntity:n,clipped:!0,shaped:!!h}),p=h?a.box_shadow?(0,j.a7)(a.box_shadow):this._themeShadow:void 0;this._readThemeShadow=!!h&&!a.box_shadow;const f=[u,a.border_radius&&`border-radius: ${a.border_radius}`,l?.style,h&&"border-color: transparent; box-shadow: none"].filter(Boolean).join("; "),g=this._seasonal.resolve(),y=!!this.hass?.themes?.darkMode,v={shape:h,seed:this._seasonal.seed(t),dark:y},b=kt(l,g),_=a.padding||"var(--mc-padding)",w=h?[c,(0,j.DA)(void 0,_,b)].filter(Boolean).join("; "):[c,b&&(0,j.AT)(void 0,_,{min:b})].filter(Boolean).join("; "),x=this._resolveFlows(a),$=(0,lt.Ih)(a.value_background,{hass:this.hass,entity:n}),k=h?(0,Qt.JA)(a.ring,{states:this.hass?.states,defaultEntity:n,clipped:!0,shaped:!1}):m,M=!!g&&(0,U.bO)(g.scenes)||gt(l),S=(e=h)=>{this._seasonalBudget.begin();const i=g?this._seasonalBudget.own(g.scenes,g.intensity):void 0,n={...v,grant:i};return s.qy`${$t(g,"back",{...n,shape:e})}${t.rows.map((t,e)=>this._renderRow(t,e))}${yt(l,e,v.seed,y,this._seasonalBudget)}${$t(g,"front",n)}${x?s.qy`<mc-flows .flows=${x} .selected=${this.editMode?this.selectedFlow:void 0}
            ?dark=${y}></mc-flows>`:s.s6}`},A=this._popup.hidden?s.s6:_t(s.qy`
          <ha-card style=${f||s.s6} data-mc-anim=${l?.targets??s.s6}
            data-mc-tap=${l?.tap?"":s.s6} data-mc-seq=${l?.seq??s.s6} data-mc-ring=${m?"":s.s6} data-mc-shape=${h?.kind??s.s6} data-mc-run=${l?.run??s.s6} data-mc-v2=${d??s.s6}>
            <div class="mc-card-content" style=${w} data-mc-anim-fx=${l?.fx.length?"":s.s6}
              data-mc-hover=${this._hover("card",a.hover,h?{shape:{padding:a.padding||"var(--mc-padding)",card:!0}}:void 0)}
              data-mc-flows=${x?"":s.s6} data-mc-value-bg=${$?"":s.s6} data-mc-seasonal=${g?"":s.s6} data-mc-flash=${M?"":s.s6}>
              ${this._renderTemplateNotice()}${S()}${wt($,this.hass)}
            </div>${bt(h,h?Ge:void 0,b)}${vt(m,h)}
          </ha-card>
        `,p,!!h);if(!e)return A;const C=(0,j.Q6)(c),z=t=>t.slice(0,t.indexOf(":")).trim().toLowerCase(),q=t=>/^(background(-[a-z-]+)?|box-shadow)$/.test(z(t)),E=[u,l?.style,...C.filter(q)].filter(Boolean).join("; "),T=[...C.filter(t=>!q(t)&&"border-radius"!==z(t)),b&&(0,j.AT)(void 0,_,{min:b})].filter(Boolean).join("; "),N=this._popup.isOpen?s.qy`
          <ha-card class="mc-popup-surface" tabindex="-1" style=${E||s.s6}
            data-mc-anim=${l?.targets??s.s6} data-mc-tap=${l?.tap?"":s.s6} data-mc-seq=${l?.seq??s.s6} data-mc-ring=${k?"":s.s6} data-mc-run=${l?.run??s.s6} data-mc-v2=${d??s.s6}>
            ${this._popup.renderHead(i)}
            <div class="mc-popup-body">
              <div class="mc-card-content" style=${T} data-mc-anim-fx=${l?.fx.length?"":s.s6}
                data-mc-hover=${this._hover("popup",a.hover)}
                data-mc-flows=${x?"":s.s6} data-mc-seasonal=${g?"":s.s6}
                data-mc-flash=${M?"":s.s6}>${S(void 0)}</div>
            </div>${vt(k)}
          </ha-card>
        `:s.s6,O=t.popup?.title?.trim()||t.name||(0,r.t)(42),R=this._popup.renderDialog(N,O,i,a.border_radius);if(this._popup.hidden)return R;const L=this._popup.popupId();return s.qy`
      <div class="mc-popup-badge" aria-hidden="true">
        <ha-icon icon="mdi:dock-window"></ha-icon>${(0,r.t)(42)}${L?s.qy` · #${L}`:s.s6}
      </div>
      ${A}${R}
    `}_resolveFlows(t){if(!Array.isArray(t.flows)||!t.flows.length)return;const e=(0,Kt.kc)(this._resolvedConfig??this._config??t),i=(0,Kt.rP)(t.flows),n=t.flows.map((t,e)=>[t,e]).filter(([t])=>t&&"object"==typeof t).map(([t,n])=>{const o=(0,Kt.pv)(t,this.hass,e.get(t.from),n);if(o.id=i[n],o.labelTemplate){const t=(0,we.L3)(o.labelTemplate)?"ok"===this._templates.get(o.labelTemplate).status?this._templateText(o.labelTemplate):"":o.labelTemplate;t&&(o.label=t)}return o});return n.length?n:void 0}_templateText(t){if(!(0,we.L3)(t))return t;const e=this._templates.get(t);return"ok"===e.status?(0,we.C3)(e.result):"unavailable"===e.status?t:""}_resolveCardAppearance(t){const e=t.conditional_appearance;if(!e?.length)return t;let i=t;for(const t of e){if(!t||!be.g.ruleMatches(t,this.hass))continue;const e=t.overrides||{},n={};for(const[t,i]of Object.entries(e))void 0!==i&&""!==i&&null!==i&&(n[t]=i);i={...i,...n}}return i}_buildThemeStyle(t){if(!this.hass)return"";if(!1!==t.use_page_theme)return"";const e=t.theme||this.hass.themes?.default_theme;if(!e)return"";const i=this.hass.themes?.themes?.[e];return i?Object.entries(i).map(([t,e])=>`${t.startsWith("--")?t:`--${t}`}: ${String(e)}`).join("; "):""}_buildCardStyle(t){const e=[];t.padding&&e.push(`padding: ${t.padding}`);const i=[],n=t.background_image?(0,Ae.zi)(this.hass,t.background_image):"";n&&i.push(n),t.background&&i.push(t.background),i.length>0&&e.push(`background: ${i.join(", ")}`),n&&(e.push("background-size: cover"),e.push("background-position: center"),e.push("background-repeat: no-repeat")),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`);const o="string"==typeof t.css?t.css.trim().replace(/[;\s]+$/,""):"";return o&&e.push(o),e.join("; ")}_isHidden({hidden:t,display:e}){return!!t||!!e?.conditions?.length&&!this._evaluateDisplay(e)}_scoped(t,e){const i=this._scope,n=(0,te.hY)(t,i);this._scope=(0,te.Xu)(t,i);try{return this._withEntity(n,()=>e(n))}finally{this._scope=i}}_renderRow(t,e){return this._scoped(t,i=>this._renderRowAt(t,e,i))}_renderRowAt(t,e,i){const n=this._isHidden(t);if(n&&!this.editMode)return s.qy``;const o=`grid-template-columns: ${(0,T.$t)(t,"1")}; gap: ${t.gap||"8px"}${t.padding?`; padding: ${t.padding}`:""}`,r=i?this.hass?.states[i]:void 0,a=(0,j.Rn)(t.design,this.hass,i),c=(0,j.zg)(a),l=(0,P.WC)(a,r,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),{shape:d,border:u,stroke:h,shadow:m,style:p,edge:f}=Ze(a,t.padding,kt(l),this._shapes),g=(0,Qt.JA)(a?.ring,{states:this.hass?.states,defaultEntity:i,clipped:!!d,shaped:!!d}),y=(0,lt.Ih)(a?.value_background,{hass:this.hass,entity:i}),v={actions:t.actions,entity:i,inherited:i!==t.entity},b=!this.editMode&&Ue(t.actions,i),_=t=>!this._isRowControlEvent(t);return _t(s.qy`
      <div
        class="mc-row"
        data-mc-row-actions=${b?"":s.s6}
        @pointerdown=${b?t=>_(t)&&this._onPointerDown(t,v):s.s6}
        @pointerup=${b?t=>_(t)&&this._onPointerUp(t,v):s.s6}
        @pointermove=${b?t=>this._onPointerMove(t):s.s6}
        @pointercancel=${b?t=>this._onPointerCancel(t):s.s6}
        @pointerleave=${b?t=>this._onPointerCancel(t):s.s6}
        @keydown=${b?t=>t.composedPath()[0]===t.currentTarget&&this._onKeyDown(t,v):s.s6}
        data-mc-row=${this.editMode?e:s.s6}
        data-mc-hover=${this._hover(`row-${e}`,a?.hover,{shape:d&&{design:a,padding:t.padding},borderLength:u})}
        data-mc-hidden=${this.editMode&&n?"":s.s6}
        data-mc-anim=${l?.targets??s.s6}
        data-mc-tap=${l?.tap?"":s.s6} data-mc-seq=${l?.seq??s.s6} data-mc-run=${l?.run??s.s6} data-mc-v2=${this._v2(l,r,i)??s.s6}
        data-mc-anim-fx=${l?.fx.length?"":s.s6}
        data-mc-flash=${gt(l)?"":s.s6}
        data-mc-border-fx=${u?"":s.s6}
        data-mc-ring=${g?"":s.s6}
        data-mc-shape=${d?.kind??s.s6}
        data-mc-value-bg=${y?"":s.s6}
        style="${o}; ${c}${[l?.style,u?.style,p].filter(Boolean).map(t=>`; ${t}`).join("")}"
      >
        ${t.columns.map((t,i)=>this._renderColumn(t,e,i))}${wt(y,this.hass)}${yt(l,d,t.id,this._dark,this._seasonalBudget)}${ft(u)}${bt(d,h,f)}${vt(g,d)}
      </div>
    `,m)}_renderColumn(t,e,i,n){return this._scoped(t,o=>this._renderColumnAt(t,e,i,n,o))}_renderColumnAt(t,e,i,n,r){const a=this._isHidden(t);if(a&&!this.editMode)return s.qy``;const c=`gap: ${t.gap||(void 0===n?"8px":o.Kd)}${t.padding?`; padding: ${t.padding}`:""}`,l=r?this.hass?.states[r]:void 0,d=(0,j.Rn)(t.design,this.hass,r),u=(0,j.zg)(d),h=(0,P.WC)(d,l,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),{shape:m,border:p,stroke:f,shadow:g,style:y,edge:v}=Ze(d,t.padding,kt(h),this._shapes),b=(0,Qt.JA)(d?.ring,{states:this.hass?.states,defaultEntity:r,clipped:!!m,shaped:!!m}),_=(0,lt.Ih)(d?.value_background,{hass:this.hass,entity:r}),w=void 0===n?`${e}.${i}`:`${n}#${i}`;return _t(s.qy`
      <div
        class="mc-column"
        data-valign=${t.vertical_align||s.s6}
        data-mc-col=${this.editMode&&void 0===n?w:s.s6}
        data-mc-slot=${this.editMode&&void 0!==n?w:s.s6}
        data-mc-hover=${this._hover(`col-${w}`,d?.hover,{shape:m&&{design:d,padding:t.padding},borderLength:p})}
        data-mc-empty=${this.editMode&&!t.modules?.length?"":s.s6}
        data-mc-hidden=${this.editMode&&a?"":s.s6}
        data-mc-anim=${h?.targets??s.s6}
        data-mc-tap=${h?.tap?"":s.s6} data-mc-seq=${h?.seq??s.s6} data-mc-run=${h?.run??s.s6} data-mc-v2=${this._v2(h,l,r)??s.s6}
        data-mc-anim-fx=${h?.fx.length?"":s.s6}
        data-mc-flash=${gt(h)?"":s.s6}
        data-mc-border-fx=${p?"":s.s6}
        data-mc-ring=${b?"":s.s6}
        data-mc-shape=${m?.kind??s.s6}
        data-mc-value-bg=${_?"":s.s6}
        style="${c}; ${u}${[h?.style,p?.style,y].filter(Boolean).map(t=>`; ${t}`).join("")}"
      >
        ${(t.modules||[]).map((t,e)=>this._renderModule(t,void 0===n?`${w}.${e}`:`${n}/${i}.${e}`))}${wt(_,this.hass)}${yt(h,m,t.id??w,this._dark,this._seasonalBudget)}${ft(p)}${bt(m,f,v)}${vt(b,m)}
      </div>
    `,g)}_renderModule(t,e){const i=this._scope,n=this._entityOf(t),o=(t.entity||void 0)===n?t:{...t,entity:n};this._scope=(0,te.Xu)(t,i);const r=this.editMode&&!n&&!!i&&!t.entity&&!!ee.s.get(t.type)?.metadata.inherit;try{return this._withEntity(n,()=>this._renderModuleAt(o,e,void 0!==n&&n!==t.entity,r))}finally{this._scope=i}}_entityOf(t){return(0,te.hY)(t,this._scope,ee.s.get(t.type)?.metadata.inherit)}_withEntity(t,e){const i=this._renderContext,n=i.entity;i.entity=t;try{return e()}finally{i.entity=n}}_renderModuleAt(t,e,i,n){const o=this._isHidden(t);if(o&&!this.editMode)return s.qy``;const a=(0,j.Rn)(t.design,this.hass,t.entity),c=t.entity?this.hass?.states[t.entity]:void 0,l=(0,P.WC)(a,c,{states:this.hass?.states,custom:this._customLookup}),d=this._v2(l,c,t.entity),{shape:u,border:h,stroke:m,shadow:p,style:f,edge:g}=Ze(a,void 0,kt(l),this._shapes),y=(0,Qt.JA)(a?.ring,{states:this.hass?.states,defaultEntity:t.entity,clipped:!!u,shaped:!!u}),v=(0,lt.Ih)(a?.value_background,{hass:this.hass,entity:t.entity}),b=c&&(0,j.th)(a)?(0,ie.id)(c):void 0,_=u||h?void 0:(0,j.nl)(t.type,t.button_style),w=_&&{..._,base:a},x=[(0,j.zg)(a,w),l?.style,h?.style,f,b&&`--mc-entity-color: ${b}`].filter(Boolean).join("; "),$=t.actions,k={actions:t.actions,entity:t.entity,inherited:i},M=!this.editMode&&Ue($,t.entity);this._pathStack.push(e);const S=this._renderContext,A=S.iconRig;let C;S.iconRig=l?.v2?.filter(t=>void 0!==t.hints.rig).pop()?.hints.rig;try{C=(0,qe.CF)(t,this.hass)}finally{this._pathStack.pop(),S.iconRig=A}return _t(s.qy`
      <div
        class="mc-module-wrapper ${M?"mc-hoverable":""}"
        role=${M?"button":s.s6}
        tabindex=${M?0:s.s6}
        aria-label=${M?this._getActionLabel(t):s.s6}
        data-mc-path=${this.editMode?e:s.s6}
        data-mc-hover=${this._hover(`mod-${e}`,a?.hover,{shape:u&&{design:a},borderLength:h,control:w})}
        data-mc-id=${t.id||s.s6}
        data-mc-hidden=${this.editMode&&o?"":s.s6}
        data-mc-needs=${n?(0,r.t)(31):s.s6}
        data-mc-anim=${l?.targets??s.s6}
        data-mc-tap=${l?.tap?"":s.s6} data-mc-seq=${l?.seq??s.s6}
        data-mc-run=${l?.run??s.s6} data-mc-v2=${d??s.s6}
        data-mc-anim-fx=${l?.fx.length?"":s.s6}
        data-mc-flash=${gt(l)?"":s.s6}
        data-mc-border-fx=${h?"":s.s6}
        data-mc-ring=${y?"":s.s6}
        data-mc-shape=${u?.kind??s.s6}
        data-mc-value-bg=${v?"":s.s6}
        style=${x}
        @pointerdown=${M?t=>this._onPointerDown(t,k):s.s6}
        @pointerup=${M?t=>this._onPointerUp(t,k):s.s6}
        @pointermove=${M?t=>this._onPointerMove(t):s.s6}
        @pointercancel=${M?t=>this._onPointerCancel(t):s.s6}
        @pointerleave=${M?t=>this._onPointerCancel(t):s.s6}
        @contextmenu=${M?t=>t.preventDefault():s.s6}
        @keydown=${M?t=>this._onKeyDown(t,k):s.s6}
      >
        ${C}${wt(v,this.hass)}${yt(l,u,t.id,this._dark,this._seasonalBudget)}${ft(h)}${bt(u,m,g)}${vt(y,u)}
      </div>
    `,p)}_v2(t,e,i){return t?.needsRuntime&&(this._v2Need=!0),t?.needsParticles&&(this._pNeed=!0),t?.v2?this._v2Render.push({entries:t.v2,stateObj:e,entityId:i})-1:void 0}_syncRuntime(){const t=this._v2Render,e=(0,N.PT)();if(!e)return void(this._v2Need&&!this._v2Waiting&&(this._v2Waiting=!0,(0,N.BR)().then(t=>{this._v2Waiting=!1,t&&this.isConnected&&this.requestUpdate()})));const i=this.renderRoot,n="function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=t=>De.iG.get(t)??(0,De.n6)(this._resolvedConfig??this._config)?.get(t),r=new Set;for(const s of i.querySelectorAll("[data-mc-v2]")){const a=t[Number(s.dataset.mcV2)];if(a){r.add(s);for(const t of a.entries){const r=void 0!==t.entityId;e.apply(s,t.v2,{hass:this.hass,stateObj:r?t.stateObj:a.stateObj,entityId:r?t.entityId:a.entityId,reducedMotion:n,shadowRoot:i,run:t.run,timing:t.timing,icon:t.icon,lookup:o})}e.commit(s,a.entries.map(t=>t.run))}}for(const t of this._v2Applied)r.has(t)||(t.isConnected&&this.renderRoot.contains(t)?e.commit(t,[]):e.release(t));this._v2Applied=r}_syncParticles(){const t=(0,O.WP)();if(!t)return void(0,O.ii)().then(t=>t&&this.isConnected&&this.requestUpdate());const e=(0,Ie.VN)(),i=new Set;for(const n of this.renderRoot.querySelectorAll(".mc-anim-fx[data-p]")){const o=n.mcSim,r=n.parentElement;i.add(n),t.apply(n,{...o,reducedMotion:e,useCss:(t,e)=>(0,We.XF)(t.startsWith("mcc-")?o.docId+(o.part?"o":"")+t.slice(t.lastIndexOf("-g")):t,t,e),content:()=>"icon"===o.spec.sim.colliders.content?[...r.querySelectorAll(".mc-anim-icon")].find(t=>t.closest(".mc-module-wrapper")===r):r.querySelector(":scope>:not([aria-hidden])")??void 0}),n.dataset.fx.endsWith("-g0")&&((0,R.dm)(o.docId),this.requestUpdate())}for(const e of this._pApplied)i.has(e)||t.release(e);this._pApplied=i}get _dark(){return!!this.hass?.themes?.darkMode}_hover(t,e,i){if(!e)return s.s6;const n=(0,j.VR)(t,e,i);return n?(this._hoverRules.set(t,n),t):s.s6}_syncHoverStyles(){const t=this.renderRoot;if(!t)return;const e=this._hoverRules.size?[...this._hoverRules.values(),"@media (prefers-reduced-motion: reduce) { [data-mc-hover] { transition: none !important; } }"].join(" "):"";let i=this._hoverStyleEl;e?(i&&i.getRootNode()===t||(i=document.createElement("style"),i.setAttribute("data-mc-hover-styles",""),t.prepend(i),this._hoverStyleEl=i),i.textContent!==e&&(i.textContent=e)):i&&i.textContent&&(i.textContent="")}_syncRowFocus(){for(const t of this.renderRoot.querySelectorAll(".mc-row")){const e=t.hasAttribute("data-mc-row-actions")&&!t.querySelector(Je);e&&"0"!==t.getAttribute("tabindex")?t.setAttribute("tabindex","0"):!e&&t.hasAttribute("tabindex")&&t.removeAttribute("tabindex")}}_isRowControlEvent(t){const e=t.currentTarget;for(const i of t.composedPath()){if(i===e)return!1;if(i instanceof Element&&i.matches(He))return!0}return!1}_getActionLabel(t){const e=t.label||t.name;return e?(0,r.t)(0,{name:e}):(0,r.t)(1,{type:t.type})}_onPointerDown(t,e){if(this._claimed.has(t))return;this._claimed.add(t);const i=t.currentTarget;this._downAt.set(i,{x:t.clientX,y:t.clientY});const n=this._timer(()=>{this._holdTimers.delete(i),this._handleAction(t,e,"hold")},500);this._holdTimers.set(i,n)}_onPointerMove(t){const e=t.currentTarget,i=this._downAt.get(e);i&&this._holdTimers.has(e)&&Math.hypot(t.clientX-i.x,t.clientY-i.y)>10&&this._onPointerCancel(t)}_onPointerUp(t,e){if(this._claimed.has(t))return;this._claimed.add(t);const i=t.currentTarget,n=this._downAt.get(i);if(this._downAt.delete(i),n&&Math.hypot(t.clientX-n.x,t.clientY-n.y)>10)return void this._onPointerCancel(t);const o=this._holdTimers.get(i);void 0!==o&&(this._clearTimer(o),this._holdTimers.delete(i),this._onTap(t,e,i))}_onTap(t,e,i){const n=e.actions?.double_tap_action;if(!n||"none"===n.action)return void this._handleAction(t,e,"tap");const o=this._tapTimers.get(i);if(void 0!==o)return this._clearTimer(o),this._tapTimers.delete(i),void this._handleAction(t,e,"double_tap");this._tapTimers.set(i,this._timer(()=>{this._tapTimers.delete(i),this._handleAction(t,e,"tap")},Le._DOUBLE_TAP_MS))}_timer(t,e){const i=window.setTimeout(()=>{this._pendingTimers.delete(i),t()},e);return this._pendingTimers.add(i),i}_clearTimer(t){window.clearTimeout(t),this._pendingTimers.delete(t)}_onPointerCancel(t){const e=t.currentTarget,i=this._holdTimers.get(e);void 0!==i&&(this._clearTimer(i),this._holdTimers.delete(e)),this._downAt.delete(e)}_onKeyDown(t,e){if(!this._claimed.has(t)&&("Enter"===t.key||" "===t.key)){if(this._claimed.add(t),t.preventDefault(),t.ctrlKey||t.metaKey)return void this._handleAction(t,e,"double_tap");if(t.shiftKey)return void this._handleAction(t,e,"hold");this._handleAction(t,e,"tap")}}_evaluateDisplay(t){return be.g.evaluate(t,this.hass)}_handleAction(t,e,i){const n=`${i}_action`,o=e.actions?.[n];if(!o||"none"===o.action)return;o.haptic&&this.dispatchEvent(new CustomEvent("haptic",{bubbles:!0,composed:!0,detail:o.haptic}));const r=!1!==o.use_module_entity?o.entity||e.entity:o.entity;switch("toggle"===o.action&&e.inherited&&!o.entity&&r&&!je.LE.has(r.split(".")[0])?"more-info":o.action){case"more-info":r&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:r}}));break;case"toggle":r&&this.hass&&(0,je.Bw)(this.hass,(0,je.H3)(this.hass,r));break;case"navigate":o.navigation_path&&(history.pushState(null,"",o.navigation_path),window.dispatchEvent(new Event("location-changed",{bubbles:!0,composed:!0})));break;case"url":if(o.url_path)try{const t=new URL(o.url_path,window.location.href);"http:"===t.protocol||"https:"===t.protocol?window.open(t.href,"_blank","noopener,noreferrer"):console.warn("Magic Card: Blocked unsafe URL protocol:",t.protocol)}catch{console.warn("Magic Card: Invalid URL:",o.url_path)}break;case"perform-action":if(o.service){const[t,e]=o.service.split(".");this.hass?.callService(t,e,{...o.data,...o.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}));break;case"popup":(0,Ne.R)(o.hash);break;case"close-popup":Ne.P.closeOpen();break;case"fire-dom-event":this.dispatchEvent(new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:o.data||{}}))}}};Ke.styles=q,Ke._DOUBLE_TAP_MS=250,Be([(0,a.MZ)({attribute:!1})],Ke.prototype,"hass",void 0),Be([(0,a.MZ)({attribute:!1})],Ke.prototype,"editMode",void 0),Be([(0,a.MZ)({attribute:!1})],Ke.prototype,"preview",void 0),Be([(0,a.MZ)({attribute:!1})],Ke.prototype,"selectedPath",void 0),Be([(0,a.MZ)({attribute:!1})],Ke.prototype,"selectedFlow",void 0),Be([(0,a.wk)()],Ke.prototype,"_config",void 0),Be([(0,a.wk)()],Ke.prototype,"_resolvedConfig",void 0),Be([(0,a.wk)()],Ke.prototype,"_themeShadow",void 0),Be([(0,a.wk)()],Ke.prototype,"_templateNotice",void 0),Ke=Le=Be([(0,a.EM)(o.Mp)],Ke);var Xe=i(4446),Qe=i(1476),ti=i(9853);function ei(t,e){const i=t.formatEntityName,n=i?.(e)||e.attributes.friendly_name;return"string"==typeof n&&n?n:e.entity_id}class ii extends Xe.l{constructor(){super(...arguments),this.metadata={type:"text",name:450,description:139,category:"content",icon:"mdi:format-text"}}createDefault(){return{id:(0,E.$)("text"),type:"text",text:"Hello World"}}renderPreview(t,e){const i=t;return i.use_entity&&i.entity?s.qy`<div class="mc-module mc-text" data-mc-part="name">${this._entityText(i,e)}</div>`:i.use_template?s.qy`<div class="mc-module mc-text" data-mc-part="name">${this._templateText(i)}</div>`:s.qy`<div class="mc-module mc-text" data-mc-part="name">${i.text||""}</div>`}_templateText(t){const e=void 0===t.text||null===t.text?"":String(t.text),i=(0,ze.V)();if(!i||!(0,we.L3)(e))return e;const n=i.template(e,(0,te.xw)(e,t.entity,i.cardEntity));switch(n.status){case"ok":return(0,we.C3)(n.result);case"pending":return"";case"error":return s.qy`<span class="mc-template-error" role="alert" title=${n.error}>${(0,r.t)(55,{error:n.error})}</span>`;default:return e}}_entityText(t,e){const i=t.entity,n=e?.states?.[i];if(!e||!n)return s.qy`${i} <span class="mc-text-muted">${(0,r.t)(63)}</span>`;const o=t.entity_display||"state";if("name"===o)return ei(e,n);if("remaining"===o&&!t.attribute&&void 0!==(0,Qe.HF)(n))return s.qy`<span class="mc-text-countdown">${(0,ti.q)(n)}</span>`;const a=function(t,e,i){if(i){const n=t.formatEntityAttributeValue?.(e,i);return n??String(e.attributes[i]??"")}const n=t.formatEntityState?.(e);if(void 0!==n)return n;const o=e.attributes.unit_of_measurement;return`${e.state}${o?` ${String(o)}`:""}`}(e,n,t.attribute);return"name_state"===o?`${ei(e,n)}: ${a}`:a}hints(t){const e=t;return e.use_entity?e.entity?[]:[(0,r.t)(17)]:e.text?[]:[e.use_template?(0,r.t)(56):(0,r.t)(57)]}}ee.s.register(new ii);var ni=i(9136),oi=i(4719);class ri extends Xe.l{constructor(){super(...arguments),this.metadata={type:"icon",name:229,description:135,category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:(0,E.$)("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(t,e){const i=t,n=i.icon||"mdi:help",o=i.use_entity_color&&i.entity?(0,ie.id)(e?.states[i.entity]):void 0,r=!o&&(0,ni.w)(i.icon_color),a=i.icon_fx?.colors,c=r&&!a?.style?{...i.icon_fx,colors:{...a,style:"gradient",gradient:r.stops,angle:r.angle}}:i.icon_fx,l=o||r&&r.stops[0]||i.icon_color||"inherit",d=(0,oi.s)({icon:n,entity:i.entity,hass:e,useEntityIcon:i.use_entity_icon,className:"mc-anim-icon",part:"icon",fx:c,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:help"});return s.qy`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${l}">
        ${d}
      </div>
    `}}ee.s.register(new ri);i(4371);var si=i(5888);const ai=/^(?:\/|https?:\/\/|data:image\/)/i,ci=t=>{const e=t.target;e.parentElement?.classList.add("mc-image--broken");const i=e.dataset.mcMedia;i&&(0,Se.By)(i)},li=t=>t.target.parentElement?.classList.remove("mc-image--broken");class di extends Xe.l{constructor(){super(...arguments),this.metadata={type:"image",name:230,description:134,category:"content",icon:"mdi:image-outline"}}createDefault(){return{id:(0,E.$)("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}imageSource(t,e){const i=t.entity&&e?e.states[t.entity]:void 0;let n="";if(i&&t.attribute){const e=i.attributes[t.attribute];"string"==typeof e&&ai.test(e.trim())&&(n=e.trim())}if(!n&&t.entity_picture){const t=i?.attributes.entity_picture;"string"==typeof t&&(n=t)}else if(!n)return(0,Ae.F9)(e,t.image);return(0,Ae.aN)(e,n)}renderPreview(t,e){const i=t,n=this.imageSource(i,e),o=n&&n===(0,Ae.F9)(e,i.image)?(0,Se.fk)(i.image):void 0,r=["contain","cover","fill","none"].includes(i.fit)?i.fit:"cover";return s.qy`
      <div class="mc-module mc-image" style="aspect-ratio: ${(0,Ae.XK)(i.aspect_ratio)};">
        ${n?s.qy`<img src=${(0,si.U)(n)} data-mc-media=${o??s.s6} style="object-fit: ${r};" alt="" @error=${ci} @load=${li} /><div
                class="mc-image-fallback mc-image-error"><ha-icon icon="mdi:image-off"></ha-icon></div>`:s.qy`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}hints(t){const e=t;return e.entity_picture&&!e.entity?[(0,r.t)(18)]:[]}}ee.s.register(new di);var ui=i(7249),hi=i(8751);class mi extends ui.C{constructor(){super(...arguments),this.metadata={type:"markdown",name:273,description:350,category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:(0,E.$)("markdown"),type:"markdown",content:"**Hello** _World_"}}placeholder(t){return s.qy`<div class="mc-module mc-markdown" style="min-height: ${(0,hi.z5)(t.content)}em"></div>`}hints(t){return t.content?[]:[(0,r.t)(29)]}}ee.s.registerLazy(new mi,F.tQ.markdown);var pi=i(4240);class fi extends Xe.l{constructor(){super(...arguments),this.metadata={type:"bar",name:51,description:133,category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:(0,E.$)("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(t,e){const i=t,n=Number.isFinite(Number(i.min))?Number(i.min):0,o=Number.isFinite(Number(i.max))?Number(i.max):100,a=i.entity&&e?e.states[i.entity]:void 0,c=i.attribute||void 0,l=a?(0,dt.f4)(a,c):void 0,d=!!i.entity&&void 0===l,u=void 0===l?n:Math.min(Math.max(l,n),o),h=o>n?(u-n)/(o-n)*100:0,m=(0,pi.r)(void 0===l?void 0:u,i.severity)||i.bar_color||"var(--primary-color, #03a9f4)",p=i.bar_background||"var(--divider-color, #e0e0e0)",f=i.bar_height||"8px",g="vertical"===i.direction;let y="—";a&&d&&c&&void 0===a.attributes[c]?y=e.formatEntityState?.(a,"unavailable")||(0,r.t)(61):a&&(y=(0,dt.Ai)(e,a,c,{decimals:i.decimals}).text);const v=!1!==i.show_value?s.qy`<span class="mc-bar-value" data-mc-part="state">${y}</span>`:s.s6,b=`mc-module mc-bar ${g?"mc-bar-vertical":"mc-bar-horizontal"}${d?" mc-bar--unavailable":""}`,_=g?`height: ${h}%`:`width: ${h}%`,w=g?`width: ${f}; height: 100%`:`height: ${f}`;return s.qy`
      <div
        class=${b}
        role="meter"
        aria-valuemin=${n}
        aria-valuemax=${o}
        aria-valuenow=${void 0===l?s.s6:u}
        aria-valuetext=${y}
      >
        ${g?v:s.s6}
        <div class="mc-bar-track" data-mc-part="background" style="${w}; background: ${p};">
          <div class="mc-bar-fill" style="${_}; background: ${m};"></div>
        </div>
        ${g?s.s6:v}
      </div>
    `}validate(t){const e=[],i=t;return void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&e.push((0,r.t)(30)),e}}ee.s.register(new fi);class gi extends ui.C{constructor(){super(...arguments),this.metadata={type:"graphs",name:214,description:137,category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:(0,E.$)("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}getDependencies(t){return t.entity?{refreshInterval:6e4}:{}}placeholder(t){const e=t;return s.qy`<div class="mc-module mc-graphs"><div style="height: 60px"></div>${!1!==e.show_labels?s.qy`<div class="mc-graphs-label"><span class="mc-graphs-name">&nbsp;</span></div>`:s.s6}</div>`}}ee.s.registerLazy(new gi,F.tQ["modules-extra"]);i(1870);var yi=i(8477);class vi extends Xe.l{constructor(){super(...arguments),this.metadata={type:"button",name:88,description:240,category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:(0,E.$)("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(t,e){const i=t,n=i.entity&&e?e.states[i.entity]:void 0,o=n&&i.show_state?(0,dt.Ai)(e,n,i.attribute||void 0).text:void 0,a=i.label||(0,r.t)(2),c="icon-only"===i.button_style,l=i.icon||"",d={hass:e,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:gesture-tap"},u=i.use_entity_icon&&i.entity?(0,oi.s)({...d,icon:l||"mdi:gesture-tap",entity:i.entity,useEntityIcon:!0}):l||(0,yi.hZ)(e,i.entity,i.icon_on,i.icon_off)?(0,oi.s)({...d,icon:l,entity:i.entity}):s.s6,h=i.use_entity_color&&n?(0,ie.id)(n):void 0;return s.qy`
      <div class="mc-module mc-button mc-button--${i.button_style||"default"}">
        <button
          type="button"
          tabindex="-1"
          class="mc-button-inner mc-button-inner--${i.button_style||"default"} ${c?"mc-button-inner--icon-only":""}"
          title=${c?a:s.s6}
        >
          ${h&&u!==s.s6?s.qy`<span class="mc-button-icon" style="color: ${h}">${u}</span>`:u}
          ${c?s.s6:s.qy`<span data-mc-part="name">${a}</span>`}
          ${o?s.qy`<span class="mc-button-state" data-mc-part="state">${o}</span>`:s.s6}
        </button>
      </div>
    `}}ee.s.register(new vi);var bi=i(2917),_i=i(8911);class wi extends Xe.l{constructor(){super(...arguments),this.metadata={type:"slider",name:398,description:347,category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:(0,E.$)("slider"),type:"slider",show_value:!0,direction:"horizontal"}}renderPreview(t,e){const i=t,n=i.entity&&e?e.states[i.entity]:void 0,o="vertical"===i.direction,a=i.design||{},c=i.slider_color||a.color||"var(--primary-color, #03a9f4)",l=i.track_color||a.background,d=`--mc-slider-color: ${c}; ${l?`--mc-slider-background: ${l};`:""}`,u=n?(0,je.fR)(e,n,i.attribute,{min:i.min,max:i.max,step:i.step}):void 0,h=(0,bi.vh)(i.entity,i.attribute,"slider"),m=u?(0,bi.jb)(h,u.value)??u.value:void 0,p=(0,ze.V)(),f=u&&void 0!==m?(0,je.C8)(e,u,m):n?(0,dt.Ai)(e,n).text:"",g=n?(0,dt.tX)(e,n):(0,r.t)(50),y=(0,_i.E)({value:m,min:u?.min??i.min??0,max:u?.max??i.max??100,step:u?.step??i.step??1,vertical:o,disabled:!u||u.readOnly||!e,label:g,valueText:f,style:d,onCommit:t=>{if(!u?.call||!e)return;const i=u.call;(0,bi.n_)(h,t,u.value,t=>(0,je.Bw)(e,i(t)),()=>p?.requestUpdate(),300)}});return s.qy`
      <div
        class="mc-module mc-slider mc-slider-container ${o?"mc-slider-container--vertical":"mc-slider-container--horizontal"}"
      >
        ${y}
        ${!1!==i.show_value&&n?s.qy`<span class="mc-slider-value">${f}</span>`:s.s6}
      </div>
    `}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&e.min>=e.max?[(0,r.t)(30)]:void 0===e.step||e.step>0?[]:[(0,r.t)(52)]}}ee.s.register(new wi);i(9113),i(1293),i(7106);class xi extends Xe.l{constructor(){super(...arguments),this.metadata={type:"gauge",name:205,description:27,category:"controls",icon:"mdi:speedometer"}}createDefault(){return{id:(0,E.$)("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half",show_name:!0}}renderPreview(t,e){const i=t,n=i.entity&&e?e.states[i.entity]:void 0,o=Number.isFinite(Number(i.min))?Number(i.min):0,a=Number.isFinite(Number(i.max))?Number(i.max):100,c=i.attribute||void 0;let l,d,u="";if(i.entity)if(n)if(l=(0,dt.f4)(n,c),void 0===l&&c&&void 0===n.attributes[c])d=e.formatEntityState?.(n,"unavailable")||(0,r.t)(61);else{const t=(0,dt.Ai)(e,n,c,{decimals:i.decimals});d=void 0===l?t.text:t.value,u=void 0===l||!1===i.show_unit?"":t.unit}else l=void 0,d="—";else l=Math.round((o+a)/2),d=String(l);const h=void 0===l,m=h?o:Math.max(o,Math.min(a,l)),p=a>o?(m-o)/(a-o)*100:0,f=(0,pi.r)(h?void 0:m,i.severity)||"var(--primary-color, #03a9f4)",g=!1===i.show_name?"":n?(0,dt.tX)(e,n):i.entity||"",y=`${g?`${g}: `:""}${d}${u?` ${u}`:""}`,v=(t,e,i,n="middle")=>s.JW`
      <text class="mc-gauge-text" data-mc-part="state" x=${t} y=${e} text-anchor=${n} font-size=${h?Math.min(i,10):i} font-weight="600" fill="currentColor">
        ${d}${u?s.JW`<tspan class="mc-gauge-unit" font-size=${Math.round(.55*i)} font-weight="400" dx="1">${u}</tspan>`:s.s6}
      </text>`,b=(t,e,n,o)=>!1===i.needle||h?s.s6:s.JW`<line x1=${t} y1=${e} x2=${n} y2=${o} stroke=${f} stroke-width="2" stroke-linecap="round" />
            <circle cx=${t} cy=${e} r="3" fill=${f} />`,_=(t,e)=>s.qy`
      <div
        class="mc-module mc-gauge mc-gauge--${t}${h&&i.entity?" mc-gauge--unavailable":""}"
        style="text-align: center;"
        role="meter"
        aria-valuemin=${o}
        aria-valuemax=${a}
        aria-valuenow=${h?s.s6:m}
        aria-valuetext=${y}
      >
        ${e}
        ${g?s.qy`<div class="mc-gauge-name" data-mc-part="name">${g}</div>`:s.s6}
      </div>
    `;if("full"===i.gauge_style){const t=Math.min(p/100*360,359.99),e=(t-90)*(Math.PI/180),n=50+40*Math.cos(e),o=50+40*Math.sin(e),r=t>180?1:0;return _("full",s.qy`
        <svg viewBox="0 0 100 100" width="120" height="120">
          <circle data-mc-part="background" cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${p>0?s.JW`<path d="M 50 10 A 40 40 0 ${r} 1 ${n} ${o}" fill="none" stroke=${f} stroke-width="8" stroke-linecap="round" />`:s.s6}
          ${b(50,50,50+30*Math.cos(e),50+30*Math.sin(e))}
          ${v(50,!1===i.needle||h?54:74,16)}
        </svg>
      `)}if("quarter"===i.gauge_style){const t=p/100*90,e=Math.PI/180*-90,n=(-90+t)*(Math.PI/180),o=44,r=10,a=90,c=r+o*Math.cos(e),l=a+o*Math.sin(e),d=r+o*Math.cos(n),u=a+o*Math.sin(n);return _("quarter",s.qy`
        <svg viewBox="0 0 100 100" width="120" height="120">
          <path data-mc-part="background" d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${p>0?s.JW`<path d="M ${c} ${l} A ${o} ${o} 0 0 1 ${d} ${u}" fill="none" stroke=${f} stroke-width="8" stroke-linecap="round" />`:s.s6}
          ${b(r,a,r+34*Math.cos(n),a+34*Math.sin(n))}
          ${v(!1===i.needle||h?20:60,!1===i.needle||h?80:40,18,"start")}
        </svg>
      `)}const w=!1!==i.needle&&!h,x=(180+p/100*180)*(Math.PI/180),$=50+40*Math.cos(x),k=55+40*Math.sin(x);return _("half",s.qy`
      <svg viewBox="0 0 100 ${w?76:70}" width="140" height=${w?109:100}>
        <path data-mc-part="background" d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" stroke-linecap="round" />
        ${p>0?s.JW`<path d="M 10 55 A 40 40 0 0 1 ${$} ${k}" fill="none" stroke=${f} stroke-width="8" stroke-linecap="round" />`:s.s6}
        ${b(50,55,$,k)}
        ${v(50,w?75:50,14)}
        <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${o}</text>
        <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${a}</text>
      </svg>
    `)}validate(t){const e=t;return void 0!==e.min&&void 0!==e.max&&Number(e.min)>=Number(e.max)?[(0,r.t)(30)]:[]}}ee.s.register(new xi);class $i extends Xe.l{constructor(){super(...arguments),this.metadata={type:"horizontal",name:227,description:30,category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:(0,E.$)("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(t,e){const i=t,n=i.modules||[];return s.qy`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${n.length>0?n.map((t,i)=>(0,qe.Dh)(t,e,i)):(0,qe.m$)((0,r.t)(14))}
      </div>
    `}}ee.s.register(new $i);class ki extends Xe.l{constructor(){super(...arguments),this.metadata={type:"vertical",name:479,description:29,category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:(0,E.$)("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(t,e){const i=t,n=i.modules||[];return s.qy`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${n.length>0?n.map((t,i)=>(0,qe.Dh)(t,e,i)):(0,qe.m$)((0,r.t)(13))}
      </div>
    `}}ee.s.register(new ki);class Mi extends Xe.l{constructor(){super(...arguments),this.metadata={type:"row",name:369,description:216,category:"layout",icon:"mdi:view-sequential-outline"}}createDefault(){return{id:(0,E.$)("row"),type:"row",columns:[{id:(0,E.$)("col"),modules:[]},{id:(0,E.$)("col"),modules:[]}],layout:"1-1",gap:"8px"}}renderPreview(t,e){const i=t,n=i.columns||[],r=(0,ze.V)(),a=`grid-template-columns: ${(0,T.$t)(i)}; gap: ${i.gap||"8px"}${i.padding?`; padding: ${i.padding}`:""}`;return s.qy`
      <div class="mc-module mc-nested-row" style=${a}>
        ${n.map((t,i)=>t&&"object"==typeof t?r?.renderColumn?.(t,i)??s.qy`<div class="mc-column" data-valign=${t.vertical_align||s.s6} style=${`gap: ${t.gap||o.Kd}`}>${(t.modules||[]).map((t,n)=>(0,qe.Dh)(t,e,n,i))}</div>`:s.s6)}
      </div>
    `}}ee.s.register(new Mi);class Si extends Xe.l{constructor(){super(...arguments),this.metadata={type:"tabs",name:444,description:442,category:"layout",icon:"mdi:tab"}}createDefault(){return{id:(0,E.$)("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(t,e){const i=t,n=(0,ze.V)(),o=i.tabs||[],a=o.flatMap((t,e)=>n?.editMode||!t?.hidden?[e]:[]),c=n?.uiState?.("active-tab"),l=Math.trunc(Number(n?.selectedChild?.()?.slot??c?.get()??i.active_tab??0)),d=a.includes(l)?l:a[0]??0,u=a.length?o[d]:void 0,h=t=>e=>{e.stopPropagation(),c&&n&&t!==d&&(c.set(t),n.requestUpdate())},m=t=>t.stopPropagation(),p=t=>{t.stopPropagation();const e=a.length,i=a.indexOf(d),n={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:e-1}[t.key];if(void 0===n||!e)return;t.preventDefault();const o=(n+e)%e;h(a[o])(t);const r=t.currentTarget.parentElement;queueMicrotask(()=>r?.querySelectorAll('[role="tab"]')[o]?.focus())};return s.qy`
      <div class="mc-module mc-tabs" data-style=${i.tab_style||"default"}>
        <div class="mc-tabs-header" role="tablist">
          ${a.map(t=>{const n=o[t];return s.qy`
              <button type="button" role="tab" class="mc-tab-button ${t===d?"active":""}" data-mc-hidden=${n?.hidden?"":s.s6}
                aria-selected=${t===d?"true":"false"}
                tabindex=${t===d?0:-1}
                @click=${h(t)} @pointerdown=${m} @pointerup=${m} @keydown=${p}>
                ${n?.icon?(0,oi.K)(i.icon_fx)?(0,oi.s)({icon:n.icon,hass:e,fx:i.icon_fx,svg:i.svg}):s.qy`<ha-icon icon=${n.icon}></ha-icon>`:s.s6}
                ${n?.label??""}
              </button>
            `})}
        </div>
        <div class="mc-tabs-content" role="tabpanel">
          ${u?.modules?.length?u.modules.map((t,i)=>(0,qe.Dh)(t,e,i,d)):(0,qe.m$)((0,r.t)(16))}
        </div>
      </div>
    `}}ee.s.register(new Si);class Ai extends Xe.l{constructor(){super(...arguments),this.metadata={type:"separator",name:383,description:484,category:"layout",icon:"mdi:minus"}}createDefault(){return{id:(0,E.$)("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(t,e){const i=t;return"vertical"===i.direction?s.qy`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:s.qy`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}}ee.s.register(new Ai);class Ci extends Xe.l{constructor(){super(...arguments),this.metadata={type:"slider-layout",name:399,description:31,category:"layout",icon:"mdi:view-carousel-outline"}}createDefault(){return{id:(0,E.$)("slider-layout"),type:"slider-layout",modules:[],pagination:!0,navigation:!0}}placeholder(t){return this.renderPreview(t)}renderPreview(t,e){const i=t,n=i.modules||[];if(!n.length)return s.qy`<div class="mc-module mc-slider-layout">${(0,qe.m$)((0,r.t)(15))}</div>`;const o=(0,ze.V)(),a=function(t,e){const i=Number(t.slides_per_view),n=Number(t.space_between),o=Number(t.autoplay_delay);return{slidesPerView:Number.isFinite(i)&&i>0?i:1,spaceBetween:Number.isFinite(n)&&n>=0?n:8,rewind:!!t.loop,pagination:!1!==t.pagination,navigation:!1!==t.navigation,autoplay:t.autoplay?Number.isFinite(o)&&o>=1e3?o:5e3:0,editMode:e}}(i,!!o?.editMode),c=(0,qe.I0)(n);if(!c.length)return s.qy``;const l=c.length>1,d={...a,navigation:a.navigation&&l,pagination:a.pagination&&l},u=o?.selectedChild?.()?.index,h=void 0===u?void 0:Math.max(0,c.findIndex(t=>t.index===u)),m=t=>t.stopPropagation();return s.qy`
      <mc-swiper class="mc-module mc-slider-layout" .options=${d} .activeIndex=${h}>
        <div class="swiper">
          <div class="swiper-wrapper">
            ${c.map(({child:t,index:i})=>s.qy`
              <div class="swiper-slide">${(0,qe.Dh)(t,e,i)}</div>
            `)}
          </div>
        </div>
        ${d.navigation?s.qy`
            <button type="button" class="mc-slider-nav mc-slider-prev" @pointerdown=${m} @pointerup=${m} @keydown=${m} aria-label=${(0,r.t)(43)}>
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <button type="button" class="mc-slider-nav mc-slider-next" @pointerdown=${m} @pointerup=${m} @keydown=${m} aria-label=${(0,r.t)(32)}>
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>`:s.s6}
        ${d.pagination?s.qy`<div class="mc-slider-pagination" @pointerdown=${m} @pointerup=${m} @keydown=${m}></div>`:s.s6}
      </mc-swiper>
    `}}ee.s.registerLazy(new Ci,F.tQ.slider);i(8446),i(7838),i(3225);class zi extends ui.C{constructor(){super(...arguments),this.metadata={type:"video-bg",name:480,description:481,category:"advanced",icon:"mdi:video-outline"}}createDefault(){return{id:(0,E.$)("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}placeholder(t){return s.qy`<div class="mc-module mc-video-bg"></div>`}}ee.s.registerLazy(new zi,F.tQ["modules-extra"]);i(5274);i.p=new URL(".",import.meta.url).href,window.customCards=window.customCards||[],window.customCards.push({type:o.Mp,name:o.d5,description:o.uh,preview:!0,documentationURL:"https://github.com/therealmcsparrow/magic-card"}),function(t=window){t.MagicCard={...t.MagicCard,version:n.x,apiVersion:1,loadEditor:B,loadSeasonal:F.X$,setLocale:Te.Zc}}(),console.info(`%c MAGIC-CARD %c v${n.x} `,"color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();