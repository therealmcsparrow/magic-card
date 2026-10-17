(()=>{"use strict";var e={508(e,t,i){i.d(t,{E0:()=>D,K6:()=>w,Nb:()=>k,UC:()=>R,YZ:()=>c,_T:()=>C,pg:()=>F});var n=i(4205),s=i(1887),r=i(5845),a=i(8854),o=i(7428);const l=e=>+e.toFixed(4);function c(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}const d=e=>`mcc-${e.id}-${c(JSON.stringify(e))}`,u=(e,t)=>`--mcc-${e}-${t}`;function p(e){return r.Z4.find(t=>t.id===e)?.css??e??"ease"}const h=(e,t)=>t?e.replace(/var\(\s*--mc-anim-c\s*\)/g,(e=>`color-mix(in srgb, var(${u(e,"c")}, var(--mc-anim-c)) calc(var(${u(e,"s")}, 1) * 100%), transparent)`)(t)):e,m=e=>({len:(t,i)=>0===t?`0${i}`:`calc(${l(t)}${i} * var(${u(e,"i")}, 1))`,scale:t=>1===t?"1":`calc(1 + ${l(t-1)} * var(${u(e,"i")}, 1))`,color:t=>h(t,e)}),f=(e=1)=>({len:(t,i)=>`${l(t*e)}${i}`,scale:t=>String(l(1+(t-1)*e)),color:e=>e});function g(e,t){const i=[],n=e.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${t.len(n.x??0,"px")} ${t.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const e=n.scale??1,s=e*(n.scale_x??1),r=e*(n.scale_y??1);i.push(["scale",s===r?t.scale(s):`${t.scale(s)} ${t.scale(r)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${t.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${t.len(n.skew_x??0,"deg")}, ${t.len(n.skew_y??0,"deg")})`])}if(void 0!==e.opacity&&i.push(["opacity",String(e.opacity)]),e.color&&i.push(["color",t.color(e.color)]),e.background&&i.push(["background",t.color(e.background)]),e.shadow&&i.push(["box-shadow",t.color(e.shadow)]),void 0!==e.filter||void 0!==e.blur){const n=[e.filter&&"none"!==e.filter?t.color(e.filter):"",void 0!==e.blur?`blur(${t.len(e.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==e.radius&&i.push(["border-radius",`${e.radius}px`]),void 0!==e.draw&&i.push(["stroke-dashoffset",String(l(1-e.draw))]),e.stroke&&i.push(["stroke",t.color(e.stroke)]),e.easing&&i.push(["animation-timing-function",p(e.easing)]),i}const y=(e,t)=>`  ${e} { ${t.map(([e,t])=>`${e}: ${t};`).join(" ")} }`,v=(e,t)=>`@keyframes ${e} {\n${t.join("\n")}\n}`,b={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function w(e,t,i){const n=t.map(e=>g(e,i)),s=Object.keys(b).filter(e=>t.some(t=>b[e].some(e=>void 0!==t.easings?.[e]))),r=v(e,t.map((e,t)=>y(`${l(e.at)}%`,n[t].filter(([e])=>!s.includes(e)))));if(!s.length)return{css:r,lanes:[]};const a=[],o=[r];for(const i of s){const s=`${e}-l${b[i][0]}`,r=[];t.forEach((e,t)=>{const s=n[t].filter(([e])=>e===i);if(!s.length)return;const a=b[i].map(t=>e.easings?.[t]).find(e=>void 0!==e)??e.easing;r.push(y(`${l(e.at)}%`,a?[...s,["animation-timing-function",p(a)]]:s))}),r.length&&(a.push(s),o.push(v(s,r)))}return{css:o.join("\n"),lanes:a}}const x=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());function _(e,t=1){if("path"===e.kind&&e.path)return function(e,t){return k(e,t,"px"===e.units?["px","px"]:["%","%"]).map(([e,t])=>({...Object.fromEntries(t.map(([e,t])=>[x(e),t])),offset:l(e/100)}))}(e.path,f(t));if("keyframes"!==e.kind||!e.keyframes)return[];const i=new Map;for(const n of e.keyframes){const e=i.get(n.at)??{};for(const[i,s]of g(n,f(t)))e[x(i)]=s;i.set(n.at,e)}return[...i.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:l(e/100)}))}const $=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,r=3*i*t*t,a=t*t*t;return[n*e[0][0]+s*e[1][0]+r*e[2][0]+a*e[3][0],n*e[0][1]+s*e[1][1]+r*e[2][1]+a*e[3][1]]};function k(e,t,i){return function(e,t=48){const i=(0,n.Mj)(e).flat();if(!i.length)return[];const s=[i[0][0]];for(const e of i)for(let t=1;t<=16;t++)s.push($(e,t/16));const r=[0];for(let e=1;e<s.length;e++)r.push(r[e-1]+Math.hypot(s[e][0]-s[e-1][0],s[e][1]-s[e-1][1]));const a=r[r.length-1],o=e=>{if(0===a)return s[0];let t=1;for(;t<r.length-1&&r[t]<e;)t++;const i=r[t]-r[t-1]||1,n=Math.min(1,Math.max(0,(e-r[t-1])/i));return[s[t-1][0]+(s[t][0]-s[t-1][0])*n,s[t-1][1]+(s[t][1]-s[t-1][1])*n]},l=[];let c;const d=a/(4*t)||.001;for(let e=0;e<=t;e++){const i=a*e/t,n=o(i),s=o(Math.max(0,i-d)),r=o(Math.min(a,i+d));let u=180*Math.atan2(r[1]-s[1],r[0]-s[0])/Math.PI;if(void 0!==c){for(;u-c>180;)u-=360;for(;u-c<-180;)u+=360}c=u,l.push({t:e/t,x:n[0],y:n[1],angle:u})}return l}(e.d).map(n=>{const s=[["translate",`${t.len(l(n.x),i[0])} ${t.len(l(n.y),i[1])}`]];return e.follow_rotation&&s.push(["rotate",`${l(n.angle)}deg`]),[l(100*n.t),s]})}const M=.618034,S=e=>e-Math.floor(e);function C(e){const t=e.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(t)}")`}function T(e,t){if(!e)return"border-radius: 50%; background: currentColor;";if("svg"in e){const i=t(e.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=C(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const A=e=>e&&"icon"in e?{icon:e.icon}:e&&"emoji"in e?{text:e.emoji}:void 0;function E(e,t=100){const i=e.count;return Array.from({length:i},(n,s)=>{const r=(S(s*M)-.5)*(60/i),a=Math.min(96,Math.max(4,(s+.5)/i*100+r)),o=50+t/100*(a-50),c=e.size[0]+(e.size[1]-e.size[0])*S(.381966*s+.25),d=e.colors.length?e.colors[s%e.colors.length]:"",u=[`--mcc-sz: ${l(c)}px`,"--mcc-sp: "+(s%2?-1:1),`--mcc-dx: ${l(16*(2*S(.7548*s)-1))}`,d&&`--mcc-pc: ${d}`].filter(Boolean).join("; ");return{x:l(o),phase:l(S(s*M)),k:i>1?l(s/i):0,style:u}})}const P=(e,t)=>`.mc-anim-fx[data-fx="${e}"] { opacity: var(${u(t,"s")}, 1); }\n.mc-anim-fx[data-fx="${e}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${u(t,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function z(e,t,i,n){const s=i.fade?0:1,r=`calc(var(--mcc-sp, 1) * ${l(i.spin)}deg)`,a=i.gravity,o=`${l(i.spread/2)}cqmin`,c=a>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":a<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let d,u;switch(i.direction){case"fall":case"rise":{const e="fall"===i.direction?"":"-";d="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",u=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s};${c} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${e}100cqh ${e?"-":"+"} var(--mcc-sz) * 2); rotate: ${r}; opacity: ${s}; }`];break}case"drift":d="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",u=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${l(15*a)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${l(30*a)}cqh; rotate: ${r}; opacity: ${s}; }`];break;case"burst":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",u=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(${r}); translate: 0 ${l(30*a)}cqh; opacity: ${s}; }`];break;case"orbit":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",u=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: 1; }`].filter(Boolean);break;case"spiral":d="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",u=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${s}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: ${s}; }`]}return`${P(e,t)} ${d} ${T(i.shape,n)} }\n${v(e,u)}`}function L(e,t,i,n,s){const r=m(t),a=i.follow_rotation?"auto":"0deg",o=e=>v(e,k(i,r,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([e,t])=>y(`${e}%`,[...t,["opacity","1"]]))),l=`${P(e,t)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${T(n.shape,s)} }`;if("px"!==i.units)return`${l}\n${o(e)}`;const c='offset-path: path("M0 0 L1 1")';return[l,`@supports (${c}) {`,`  .mc-anim-fx[data-fx="${e}"] > i { offset-path: path("${i.d}"); offset-rotate: ${a}; offset-anchor: center; margin: 0; }`,`  @keyframes ${e} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${c}) {`,o(e),"}"].join("\n")}function O(e,t){const i=[],n=[];let s=0;const c="icon"===e.target;return(e.steps??[]).forEach((e,d)=>{let u,h,m,f=e.duration;if((0,o.Bl)(e.animation)){const i=t?.((0,o._R)(e.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(u=_(i),f??=i.duration,h=p(i.easing),m=i.origin)}else{const t=(0,r.e2)(e.animation);u=t&&!t.channels.includes("fx")?(0,a.Wk)(t.id,{icon:c}):void 0,t&&(f??=parseFloat(t.defaults.duration),h=p(t.defaults.easing),m=t.origin)}if(!u?.length||!f)return void n.push(d);const g=s+e.delay;i.push({start:l(g),duration:f,iterations:e.repeat,easing:h??"ease",frames:u,...m&&"center"!==m?{origin:m}:{}}),s=g+f*e.repeat}),{steps:i,total:l(s),loop:!1!==e.loop,target:e.target,...e.stagger?.children?{stagger:e.stagger.delay}:{},skipped:n}}const q=new WeakMap;function R(e,t={}){const i=!t.reducedMotion&&(0,o.xS)(e);let n=i&&function(e){if(B.has(e.id))return;let t=j.get(e);const i=e.particles;try{const n=N&&!t&&I?.(i.sim,"lenient").sim;if(n){const s={...i,sim:n},r=e.duration/i.speed,a=N(e.id,s,r,{aspect:0});j.set(e,t={kind:"particles",name:a.name,css:a.css,layer:{front:a.front,particles:a.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:r}})}}catch{B.add(e.id)}return t}(e)||function(e,t){if(t.reducedMotion)return{kind:e.kind,name:"",css:"",reduced:!0,..."sequence"===e.kind?{schedule:{steps:[],total:0,loop:!1,target:e.target,skipped:[]}}:{}};if("sequence"===e.kind)return{kind:"sequence",name:d(e),css:"",schedule:O(e,t.lookup)};const i=q.get(e);if(i)return i;const n=d(e),r=e=>(0,s.OW)(e).markup;let a;switch(e.kind){case"keyframes":{const{css:t,lanes:i}=w(n,e.keyframes??[],m(e.id));a={kind:"keyframes",name:n,css:t,motion:{target:e.target,origin:e.origin},...i.length?{lanes:i}:{}};break}case"particles":{const t=e.particles;if(t.preset){a={kind:"particles",name:"",css:"",preset:{id:t.preset,...void 0!==t.intensity?{intensity:t.intensity}:{}}};break}a={kind:"particles",name:n,css:z(n,e.id,t,r),layer:{front:"front"===t.layer,particles:E(t,t.spread),speed:t.speed,...A(t.shape)?{symbol:A(t.shape)}:{}}};break}case"path":{const t=e.path;if("particles"===t.subject){const i=t.particles??{count:3,size:[8,8],colors:[]};a={kind:"path",name:n,css:L(n,e.id,t,i,r),layer:{front:!1,particles:E(i),speed:1,...A(i.shape)?{symbol:A(i.shape)}:{}}};break}const i=k(t,m(e.id),"px"===t.units?["px","px"]:["%","%"]).map(([e,t])=>y(`${e}%`,t));a={kind:"path",name:n,css:v(n,i),motion:{target:"icon"===t.subject?"icon":"element",origin:e.origin}};break}}return q.set(e,a),a}(e,t);return i&&!N&&(n={...n,needsParticles:!0}),W&&(0,o.oC)(e)?{...n,v2:W(e,t)}:n}let N,I,j=new WeakMap;function D(e,t){N=e,I=t,j=new WeakMap}const B=new Set;let W;function F(e){W=e}i.d(t,["JR",0,m,"KE",0,v,"dm",0,e=>{B.add(e)},"er",0,u,"iZ",0,d,"om",0,y])},8854(e,t,i){i.d(t,{Wk:()=>l});var n=i(1182),s=i(6838),r=i(7757),a=i(5845);const o=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());function l(e,t={}){const i=(0,a.e2)(e);if(!i)return;const l=function(e,t){const i=n.S[e]??s.Tb[e]??r.H[e];if(void 0===i)return;const o=(0,a.e2)(e.replace(/-icon$/,"")),l=t??o?.defaults.intensity??1;return i.replace(/\$i/g,String(l)).replace(/\$c/g,"var(--mc-anim-c)")}(t.icon&&i.iconKeyframes?`${e}-icon`:e,t.intensity);return void 0===l?void 0:function(e){const t=new Map;for(const i of e)for(const e of i.offsets){const n=t.get(e)??{};for(const[e,t]of i.decls)n[o(e)]=t;t.set(e,n)}return[...t.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:+(e/100).toFixed(4)}))}(function(e){const t=[];for(const i of e.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const e=i[1].split(",").map(e=>e.trim().toLowerCase()).map(e=>"from"===e?0:"to"===e?100:parseFloat(e)).filter(e=>Number.isFinite(e)),n=[];for(const e of i[2].split(";")){const t=e.indexOf(":");if(t<0)continue;const i=e.slice(0,t).trim().toLowerCase(),s=e.slice(t+1).trim().replace(/\s+/g," ");i&&s&&n.push([i,s])}e.length&&n.length&&t.push({offsets:e,decls:n})}return t}(l))}},8061(e,t,i){i.d(t,{oC:()=>s});const n=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function s(e){const t=e=>Array.isArray(e)&&e.length>0,i=e.rig;return t(e.tracks)||t(e.clips)||t(e.bindings)||!!i&&"object"==typeof i&&(t(i.parts)||t(i.shapes))}i.d(t,["G1",0,n])},7428(e,t,i){i.d(t,{A$:()=>S,H2:()=>O,SW:()=>y,W9:()=>L,d$:()=>C,oC:()=>a.oC,sO:()=>q,tz:()=>E});var n=i(4205),s=i(1887),r=i(5845),a=i(8061);const o=["keyframes","particles","path","sequence"],l=["fall","rise","drift","burst","orbit","spiral"],c={docs:200,bytes:65536,keyframes:40,particles:60,steps:20,colors:12,pathLength:8192,name:80,css:600},d=/^[a-z0-9][a-z0-9_-]{0,63}$/,u="custom:",p=e=>"string"==typeof e&&e.startsWith(u),h=e=>e.slice(7).trim(),m={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"};const f=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],g={color:new Set(f),background:new Set([...f,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(f),filter:new Set([...f,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function y(e,t){if("string"!=typeof e)return;const i=e.trim();if(!i||i.length>c.css||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const e of i)if("("===e)n++;else if(")"===e&&--n<0)return;if(0!==n)return;const s=i.match(/\(/g)?.length??0,r=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return r.length!==s||r.some(e=>!g[t].has(e[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(e=>!/^--[\w-]+$/.test(e[1]))?void 0:i}const v=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,b=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,w=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,x=["normal","reverse","alternate","alternate-reverse"];function _(e){if("string"!=typeof e)return!1;const t=e.trim();return r.Z4.some(e=>e.id===t)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)}const $=new Set(r.u7.filter(e=>!e.channels.includes("fx")).map(e=>e.id)),k=new Set(r.u7.filter(e=>e.channels.includes("fx")).map(e=>e.id)),M=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;class S{constructor(){this.errors=[]}err(e,t){this.errors.push({path:e,message:t})}num(e,t,i,n,s,r,a=!1){const o=e[t];if(null==o||""===o)return void 0===r?void 0:r;const l="string"==typeof o?Number(o):o;return"number"==typeof l&&Number.isFinite(l)?a&&!Number.isInteger(l)?this.err(i,"Must be a whole number."):l<n||l>s?this.err(i,`Must be between ${n} and ${s}.`):l:this.err(i,"Must be a number.")}bool(e,t,i,n){const s=e[t];return null==s?n:"boolean"!=typeof s?this.err(i,"Must be true or false.")??n:s}oneOf(e,t,i,n,s){const r=e[t];return null==r||""===r?s:n.includes(r)?r:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(e,t,i,n){const s=e[t];if(null!=s&&""!==s)return y(s,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(e,t){return!e||"object"!=typeof e||Array.isArray(e)?this.err(t,"Must be an object."):e}list(e,t,i,n=0){return Array.isArray(e)?e.length<n?this.err(t,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):e.length>i?this.err(t,`At most ${i} entries.`):e:this.err(t,"Must be a list.")}}function C(e,t,i,n=!1,s=!1){const r=e.obj(t,i);if(!r)return;const o=e.num(r,"at",`${i}.at`,0,100);void 0===r.at&&e.err(`${i}.at`,"Required.");const l={at:o??0};if(void 0!==r.transform){const t=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={},r=(t,r,a)=>{const o=e.num(n,t,`${i}.${t}`,r,a);void 0!==o&&(s[t]=o)};if(r("x",-1e4,1e4),r("y",-1e4,1e4),r("scale",0,100),r("scale_x",-100,100),r("scale_y",-100,100),r("rotate",-36e3,36e3),r("skew_x",-89,89),r("skew_y",-89,89),void 0!==n.axis){const t=n.axis;!Array.isArray(t)||3!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e))||t.every(e=>0===e)?e.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):s.axis=[t[0],t[1],t[2]]}return s}(e,r.transform,`${i}.transform`);t&&Object.keys(t).length&&(l.transform=t)}const c=e.num(r,"opacity",`${i}.opacity`,0,1);void 0!==c&&(l.opacity=c);const d=e.css(r,"color",`${i}.color`,"color");d&&(l.color=d);const u=e.css(r,"background",`${i}.background`,"background");u&&(l.background=u);const p=e.css(r,"shadow",`${i}.shadow`,"shadow");p&&(l.shadow=p);const h=e.css(r,"filter",`${i}.filter`,"filter");h&&(l.filter=h);const m=e.num(r,"blur",`${i}.blur`,0,200);void 0!==m&&(l.blur=m);const f=e.num(r,"radius",`${i}.radius`,0,1e3);void 0!==f&&(l.radius=f),void 0!==r.easing&&""!==r.easing&&(_(r.easing)?l.easing=r.easing.trim():e.err(`${i}.easing`,"Not a valid easing."));const g=s?new S:e,y=g.css(r,"stroke",`${i}.stroke`,"color");if(y&&(l.stroke=y),void 0!==r.draw&&null!==r.draw&&""!==r.draw)if(n){const e=g.num(r,"draw",`${i}.draw`,0,1);void 0!==e&&(l.draw=e)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==r.easings&&null!==r.easings){const e=g.obj(r.easings,`${i}.easings`),t={};for(const[n,s]of Object.entries(e??{}))a.G1.includes(n)?_(s)?t[n]=s.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(t).length&&(l.easings=t)}return l}function T(e,t,i,n){const r=e.num(t,"count",`${i}.count`,1,c.particles,n.count,!0)??n.count;let a=[...n.size];if(void 0!==t.size){const n=t.size;"number"==typeof n&&n>0&&n<=200?a=[n,n]:Array.isArray(n)&&2===n.length&&n.every(e=>"number"==typeof e&&e>0&&e<=200)&&n[0]<=n[1]?a=[n[0],n[1]]:e.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const o=[];if(void 0!==t.colors){const n=e.list(t.colors,`${i}.colors`,c.colors);n?.forEach((t,n)=>{const s=y(t,"color");s?o.push(s):e.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const l=void 0!==t.shape&&null!==t.shape?function(e,t,i){const n=e.obj(t,i);if(!n)return;const r=["icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==r.length)return e.err(i,"Set one of icon, emoji or svg.");const a=r[0],o=n[a];if("string"!=typeof o)return e.err(`${i}.${a}`,"Must be text.");if("icon"===a)return w.test(o.trim())?{icon:o.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===a){const t=o.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(M(o)>32768)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(o))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=(0,s.OW)(o);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:o}}(e,t.shape,`${i}.shape`):void 0;return{...l?{shape:l}:{},count:r,size:a,colors:o}}let A;function E(e){A=e}const P=["rig","tracks","clips","bindings"];let z;function L(e){z=e}function O(e,t={}){const i=new S,s=i.obj(e,"");if(!s)return{ok:!1,errors:i.errors};let r;try{r=JSON.stringify(s)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(M(r)>c.bytes)return{ok:!1,errors:[{path:"",message:`The animation is larger than ${c.bytes/1024} KB.`}]};const a="string"==typeof s.id?s.id.trim():"";d.test(a)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const u="string"==typeof s.name?s.name.trim():"";u?u.length>c.name&&i.err("name",`At most ${c.name} characters.`):i.err("name","Required."),void 0!==s.version&&1!==s.version&&i.err("version","Unsupported version (expected 1).");const f=i.oneOf(s,"kind","kind",o);s.kind||i.err("kind","Required.");const g={id:a,name:u,kind:f??"keyframes",duration:i.num(s,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(s,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==s.easing&&""!==s.easing&&(_(s.easing)?g.easing=s.easing.trim():i.err("easing","Not a valid easing.")),void 0!==s.iterations&&"infinite"!==s.iterations){const e=i.num(s,"iterations","iterations",.01,1e3);void 0!==e&&(g.iterations=e)}const y=i.oneOf(s,"direction","direction",x);switch(y&&"normal"!==y&&(g.direction=y),void 0!==s.origin&&""!==s.origin&&("string"==typeof s.origin&&v.test(s.origin.trim())?g.origin=s.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),f){case"keyframes":{const e=Array.isArray(s.tracks)&&s.tracks.length>0,n=void 0===s.keyframes?e?[]:i.err("keyframes","Required."):i.list(s.keyframes,"keyframes",c.keyframes,e?0:1),r="lenient"===t.v2,a=(n??[]).map((e,t)=>C(i,e,`keyframes[${t}]`,!1,r)).filter(e=>!!e);g.keyframes=a.sort((e,t)=>e.at-t.at);break}case"particles":void 0===s.particles?i.err("particles","Required."):g.particles=function(e,t,i,n){const s=e.obj(t,i);if(!s)return;const r=m,a={...T(e,s,i,r),direction:e.oneOf(s,"direction",`${i}.direction`,l,r.direction)??r.direction,speed:e.num(s,"speed",`${i}.speed`,.1,10,r.speed)??r.speed,spin:e.num(s,"spin",`${i}.spin`,-3600,3600,r.spin)??r.spin,fade:e.bool(s,"fade",`${i}.fade`,r.fade),spread:e.num(s,"spread",`${i}.spread`,0,100,r.spread)??r.spread,gravity:e.num(s,"gravity",`${i}.gravity`,-1,1,r.gravity)??r.gravity,layer:e.oneOf(s,"layer",`${i}.layer`,["back","front"],r.layer)??r.layer};if(void 0!==s.preset&&""!==s.preset){"string"==typeof s.preset&&k.has(s.preset)?a.preset=s.preset:e.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const t=e.num(s,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==t&&(a.intensity=t)}if(void 0!==s.sim&&null!==s.sim&&(n?new S:e).obj(s.sim,`${i}.sim`))if(A){const t=A(s.sim,n?"lenient":"strict");n||e.errors.push(...t.errors),!t.sim||!n&&t.errors.length||(a.sim=t.sim)}else a.sim=s.sim;return a}(i,s.particles,"particles","lenient"===t.v2);break;case"path":void 0===s.path?i.err("path","Required."):g.path=function(e,t,i){const s=e.obj(t,i);if(!s)return;let r="";"string"==typeof s.d&&s.d.trim()?s.d.length>c.pathLength?e.err(`${i}.d`,`At most ${c.pathLength} characters.`):b.test(s.d)&&/^\s*[Mm]/.test(s.d)?(0,n.Mj)(s.d).some(e=>e.length)?r=s.d.trim().replace(/\s+/g," "):e.err(`${i}.d`,"The path draws nothing."):e.err(`${i}.d`,"Not valid path data (it must start with M)."):e.err(`${i}.d`,"Required.");const a={d:r,units:e.oneOf(s,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:e.bool(s,"follow_rotation",`${i}.follow_rotation`,!1),subject:e.oneOf(s,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==s.particles&&null!==s.particles){const t=e.obj(s.particles,`${i}.particles`);t&&(a.particles=T(e,t,`${i}.particles`,{...m,count:3}))}return a}(i,s.path,"path");break;case"sequence":{g.steps=void 0===s.steps?(i.err("steps","Required."),[]):function(e,t,i,n){const s=e.list(t,i,c.steps,1);if(!s)return[];const r=[];return s.forEach((t,s)=>{const a=`${i}[${s}]`,o=e.obj(t,a);if(!o)return;const l="string"==typeof o.animation?o.animation.trim():"";l?p(l)?h(l)===n?e.err(`${a}.animation`,"A sequence cannot play itself."):d.test(h(l))||e.err(`${a}.animation`,"Not a valid animation id."):$.has(l)||e.err(`${a}.animation`,"Must be a motion preset or a custom keyframes / path animation."):e.err(`${a}.animation`,"Required.");const c={animation:l,delay:e.num(o,"delay",`${a}.delay`,0,600,0)??0,repeat:e.num(o,"repeat",`${a}.repeat`,1,100,1,!0)??1},u=e.num(o,"duration",`${a}.duration`,.05,600);void 0!==u&&(c.duration=u),r.push(c)}),r}(i,s.steps,"steps",a),g.loop=i.bool(s,"loop","loop",!0);const e=void 0===s.stagger||null===s.stagger?{}:i.obj(s.stagger,"stagger");e&&(g.stagger={children:i.bool(e,"children","stagger.children",!1),delay:i.num(e,"delay","stagger.delay",0,10,.1)??.1});break}}if(f)if(z)"lenient"===t.v2?Object.assign(g,z(s,new S)):Object.assign(g,z(s,i));else for(const e of P)void 0===s[e]||null===s[e]||"clips"!==e&&"keyframes"!==f||(g[e]=s[e]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:g,errors:[]}}function q(e,t={}){const i=new Map,n=[];return(Array.isArray(e)?e:e&&"object"==typeof e?Object.entries(e).map(([e,t])=>t&&"object"==typeof t&&!("id"in t)&&d.test(e)?{id:e,...t}:t):[]).forEach((e,s)=>{if(i.size>=c.docs)return void(i.size===c.docs&&s===c.docs&&n.push({path:`[${s}]`,message:`At most ${c.docs} animations.`}));const r=O(e,t);r.ok?i.has(r.doc.id)?n.push({path:`[${s}].id`,message:`Duplicate id "${r.doc.id}".`}):i.set(r.doc.id,r.doc):n.push(...r.errors.map(e=>({path:`[${s}]${e.path?`.${e.path}`:""}`,message:e.message})))}),{docs:i,errors:n}}i.d(t,["A1",0,w,"Ae",0,l,"Bl",0,p,"Bp",0,c,"D8",0,u,"_R",0,h,"cA",0,b,"pQ",0,v,"t_",0,d,"xS",0,e=>"particles"===e.kind&&!!e.particles?.sim&&!e.particles.preset])},2142(e,t,i){i.d(t,{XF:()=>o,ag:()=>l});const n=new Map;let s;const r=new Set,a=()=>[...n.values()].map(e=>e.css).join("\n");function o(e,t,i){t&&i&&n.get(e)?.name!==t&&(n.set(e,{name:t,css:i}),function(){const e=a();s?.replaceSync(e);for(const t of r)t.isConnected?t.textContent=e:r.delete(t)}())}function l(e){if(!e||!n.size)return;if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype)return s||(s=new CSSStyleSheet,s.replaceSync(a())),void(e.adoptedStyleSheets.includes(s)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]));let t=e.querySelector(":scope > style[data-mc-custom-anim]");t||(t=document.createElement("style"),t.setAttribute("data-mc-custom-anim",""),e.prepend(t)),t.textContent=a(),r.add(t)}},2014(e,t,i){i.d(t,{R:()=>r});var n=i(1268);const s=new class{constructor(){this._handles=new Set,this._onHashChange=()=>this._notify("push"),this._onPopState=()=>this._notify("pop"),this._onLocationChanged=e=>{const t=!!e.detail?.replace;this._notify(t?"replace":"push")}}register(e){this._handles.size||this._listen(!0),this._handles.add(e)}unregister(e){this._handles.delete(e),this._open===e&&(this._open=void 0),this._handles.size||this._listen(!1)}willOpen(e){const t=this._open;this._open=e,t&&t!==e&&t.closeForOther()}didClose(e){this._open===e&&(this._open=void 0)}get openHandle(){return this._open}closeOpen(){const e=this._open;return!!e&&(e.closeByAction(),!0)}knownIds(){const e=new Set;for(const t of this._handles){const i=t.popupId();i&&e.add(i)}return[...e].sort((e,t)=>e.localeCompare(t))}preview(e){const t=[...this._handles].filter(e=>e.isPopup()&&e.editorPlace()),i=(e?["canvas","card-editor","dashboard-edit"]:["card-editor","canvas","dashboard-edit"]).map(e=>t.find(t=>t.editorPlace()===e)).find(Boolean);return!!i&&(i.openPreview(),!0)}_listen(e){if("undefined"==typeof window)return;const t=e?"addEventListener":"removeEventListener";window[t]("hashchange",this._onHashChange),window[t]("popstate",this._onPopState),window[t]("location-changed",this._onLocationChanged)}_notify(e){for(const t of[...this._handles])t.locationChanged(e)}};function r(e){const t=(0,n.oi)(e);return!!(0,n.BI)(t)&&(window.location.hash===`#${t}`?(window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}})),!0):(history.pushState(history.state,"",(0,n.WV)(window.location.href,t)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})),!0))}i.d(t,["P",0,s])},2146(e,t,i){i.d(t,{$d:()=>a,D5:()=>u,kj:()=>d});var n=i(508),s=i(9040);const r=new Map;function a(e){const t=`s${(0,n.YZ)(JSON.stringify(e))}`;return r.set(t,e),r.size>64&&r.delete(r.keys().next().value),t}const o=()=>"function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;class l{constructor(e,t){this._el=e,this._run=t,this._anims=[],this._cycle=0,this._stopped=!1,this._on=!0}_targets(){return(void 0!==this._run.stagger?[...this._el.children].filter(e=>"true"!==e.getAttribute("aria-hidden")&&!e.localName.startsWith("mc-")&&"style"!==e.localName):[this._el]).map(e=>"icon"===this._run.target?e.querySelector(".mc-anim-icon")??e:e)}_start(){if(this._stopped||o()||!this._run.steps.length)return;const{steps:e,scale:t}=this._run,i=[];if(this._targets().forEach((n,s)=>{if("function"!=typeof n.animate)return;const r=(0===this._cycle?this._run.delay:0)+s*(this._run.stagger??0);for(const s of e){const e=s.origin?s.frames.map(e=>({...e,transformOrigin:s.origin})):s.frames;i.push(n.animate(e,{duration:s.duration*t*1e3,delay:1e3*(r+s.start*t),iterations:s.iterations,easing:s.easing,fill:"none"}))}}),this._anims=i,i.length){if(!this._on)for(const e of i)e.pause();Promise.all(i.map(e=>e.finished)).then(()=>{if(this._stopped||this._anims!==i)return;this._cycle++;const e=void 0!==this._run.cycles?this._cycle<this._run.cycles:this._run.loop;this._anims=[],e&&this._start()},()=>{})}}visible(e){if(!this._stopped)if(this._on=e,e)if(this._anims.length)for(const e of this._anims)e.play();else 0===this._cycle&&this._start();else for(const e of this._anims)e.pause()}get playing(){return this._anims.some(e=>"running"===e.playState)}stop(){this._stopped=!0;for(const e of this._anims)e.cancel();this._anims=[]}}class c{constructor(e,t){this.el=e,this.key=t,this._runs=t.split(" ").map(e=>r.get(e)).filter(e=>!!e).map(t=>new l(e,t)),(0,s.jR)(e,e=>this._runs.forEach(t=>t.visible(e)))||this._runs.forEach(e=>e.visible(!0))}get playing(){return this._runs.some(e=>e.playing)}visible(e){this._runs.forEach(t=>t.visible(e))}stop(){(0,s.eF)(this.el),this._runs.forEach(e=>e.stop())}}function d(e,t){const i=new Set;for(const n of e?.querySelectorAll("[data-mc-seq]")??[]){const e=n.getAttribute("data-mc-seq")??"";i.add(n);const s=t.get(n);s?.key!==e&&(s?.stop(),t.set(n,new c(n,e)))}for(const[e,n]of t)i.has(e)||(n.stop(),t.delete(e))}function u(e){for(const t of e.values())t.stop();e.clear()}i.d(t,["VN",0,o])},7757(e,t,i){const n={pendulum:"\n    from { rotate: calc($i * -1deg); }\n    to { rotate: calc($i * 1deg); }",orbit:"\n    0%, 100% { translate: calc($i * 1px) 0; }\n    12.5% { translate: calc($i * 0.707px) calc($i * 0.707px); }\n    25% { translate: 0 calc($i * 1px); }\n    37.5% { translate: calc($i * -0.707px) calc($i * 0.707px); }\n    50% { translate: calc($i * -1px) 0; }\n    62.5% { translate: calc($i * -0.707px) calc($i * -0.707px); }\n    75% { translate: 0 calc($i * -1px); }\n    87.5% { translate: calc($i * 0.707px) calc($i * -0.707px); }","coin-spin":"\n    from { rotate: y 0deg; }\n    to { rotate: y calc($i * 1deg); }","rotate-3d":"\n    from { rotate: 1 1 0 calc($i * -1deg); }\n    to { rotate: 1 1 0 calc($i * 1deg); }","squash-stretch":"\n    0%, 100% { scale: 1 1; translate: 0 0; }\n    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); translate: 0 0; }\n    45% { scale: calc(1 - $i / 200) calc(1 + $i / 150); translate: 0 calc($i * -0.8px); }\n    70% { scale: 1 1; translate: 0 calc($i * -0.4px); }\n    85% { scale: calc(1 + $i / 160) calc(1 - $i / 160); translate: 0 0; }",wiggle:"\n    0%, 40%, 100% { rotate: 0deg; }\n    5% { rotate: calc($i * 1deg); }\n    10% { rotate: calc($i * -1deg); }\n    15% { rotate: calc($i * 0.8deg); }\n    20% { rotate: calc($i * -0.6deg); }\n    25% { rotate: calc($i * 0.4deg); }\n    30% { rotate: calc($i * -0.2deg); }","shadow-lift":"\n    0%, 100% { translate: 0 0; box-shadow: 0 1px 2px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2)); }\n    50% { translate: 0 calc($i * -1px); box-shadow: 0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3)); }","shadow-lift-icon":"\n    0%, 100% { translate: 0 0; filter: drop-shadow(0 1px 1px color-mix(in srgb, $c 20%, rgba(0, 0, 0, 0.2))); }\n    50% { translate: 0 calc($i * -1px); filter: drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb, $c 25%, rgba(0, 0, 0, 0.3))); }","holographic-shimmer":"\n    from { translate: 0 0; filter: hue-rotate(0deg); }\n    to { translate: -50% 0; filter: hue-rotate(360deg); }",scanline:"\n    from { translate: 0 -100%; }\n    to { translate: 0 100cqh; }",twinkle:"\n    0%, 100% { scale: 0; rotate: 0deg; opacity: 0; }\n    50% { scale: 1; rotate: 90deg; opacity: 1; }",spotlight:"\n    0%, 100% { translate: -30cqw -10cqh; }\n    33% { translate: 25cqw 15cqh; }\n    66% { translate: 10cqw -20cqh; }","neon-border":"\n    0%, 100% {\n      box-shadow: 0 0 0 1px $c, 0 0 calc($i * 0.6px) color-mix(in srgb, $c 70%, transparent),\n        inset 0 0 calc($i * 0.5px) color-mix(in srgb, $c 45%, transparent);\n    }\n    50% {\n      box-shadow: 0 0 0 1.5px $c, 0 0 calc($i * 1.4px) $c,\n        inset 0 0 calc($i * 0.9px) color-mix(in srgb, $c 60%, transparent);\n    }","neon-border-icon":"\n    0%, 100% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.3px) color-mix(in srgb, $c 70%, transparent)); }\n    50% { filter: drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * 0.7px) $c); }","color-cycle-bg":"\n    from { filter: hue-rotate(0deg); }\n    to { filter: hue-rotate(360deg); }",aurora:"\n    0%, 100% { translate: -12% 0; rotate: -8deg; scale: 1 1; opacity: calc($i / 100); }\n    50% { translate: 12% 6%; rotate: 6deg; scale: 1.15 0.85; opacity: calc($i / 160); }","lava-lamp":"\n    0% { translate: 0 0; scale: 1 1; opacity: 0.9; }\n    50% { translate: 6px -45cqh; scale: 1.25 0.85; }\n    100% { translate: -4px -85cqh; scale: 0.85 1.15; opacity: 0.9; }","plasma-gradient":"\n    0% { rotate: 0deg; scale: 1; }\n    50% { rotate: 180deg; scale: 1.25; }\n    100% { rotate: 360deg; scale: 1; }","gradient-flow":"\n    from { translate: 0 0; }\n    to { translate: -66.667% 0; }",starfield:"\n    0%, 100% { opacity: 0.15; scale: 0.6; }\n    50% { opacity: 1; scale: 1; }","meteor-shower":"\n    0% { translate: 0 0; opacity: 0; }\n    6% { opacity: 1; }\n    40%, 100% { translate: -60cqw 60cqh; opacity: 0; }",bokeh:"\n    0% { translate: 0 0; scale: 0.8; opacity: 0.15; }\n    50% { opacity: 0.55; }\n    100% { translate: 10px -16px; scale: 1.15; opacity: 0.25; }","matrix-rain":"\n    0% { translate: 0 -100%; opacity: 0; }\n    10% { opacity: 1; }\n    100% { translate: 0 calc(100cqh + 100%); opacity: 0.6; }",smoke:"\n    0% { translate: 0 0; scale: 0.4; opacity: 0; }\n    20% { opacity: 0.5; }\n    100% { translate: 18px -90cqh; scale: 2.6; opacity: 0; }","clouds-drift":"\n    from { translate: 0 0; opacity: 0.9; }\n    to { translate: calc(100cqw + 100%) 0; opacity: 0.9; }","water-ripple":"\n    0% { scale: 0.05; opacity: 0.9; }\n    100% { scale: 1; opacity: 0; }",fireworks:"\n    0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1); opacity: 1; }\n    70% { opacity: 1; }\n    100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(0.3); opacity: 0; }","tap-ripple":"\n    0% { scale: 0; opacity: calc($i / 100); }\n    100% { scale: 1; opacity: 0; }",press:"\n    0%, 100% { scale: 1; }\n    40% { scale: calc(1 - $i / 100); }"},s={"holographic-shimmer":"\n    left: 0; top: 0; width: 400%; height: 100%; opacity: calc($i / 100);\n    background: linear-gradient(115deg, transparent 20%, color-mix(in srgb, $c 55%, #ff80ab) 35%,\n      color-mix(in srgb, $c 55%, #80d8ff) 50%, color-mix(in srgb, $c 55%, #ccff90) 65%, transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"\n    left: 0; top: 0; width: 100%; height: 14%; opacity: calc($i / 100);\n    background: linear-gradient(transparent, color-mix(in srgb, $c 45%, transparent) 70%, $c 96%, transparent);",twinkle:"\n    top: calc(8% + var(--mc-anim-phase) * 80%); width: 10px; height: 10px; margin: -5px 0 0 -5px; background: $c;\n    clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);",spotlight:"\n    left: 50%; top: 50%; width: 70cqmin; aspect-ratio: 1; margin: -35cqmin 0 0 -35cqmin; opacity: calc($i / 100);\n    border-radius: 50%; background: radial-gradient(circle, $c, transparent 65%);","color-cycle-bg":"left: 0; top: 0; width: 100%; height: 100%; opacity: calc($i / 100); background: $c;",aurora:"\n    left: -25%; top: calc(-10% + var(--mc-anim-k) * 40%); width: 150%; height: 55%;\n    background: radial-gradient(ellipse 30% 50% at 32% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent),\n      radial-gradient(ellipse 30% 50% at 62% 50%, color-mix(in srgb, $c 50%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 50%, #00e5ff) 45%, transparent) 45%, transparent);","aurora|:nth-child(2)":"\n    animation-duration: calc(var(--mc-fx-dur) * 1.4); animation-direction: reverse;\n    background: radial-gradient(ellipse 30% 50% at 37% 50%, color-mix(in srgb, $c 50%, #76ff03), color-mix(in srgb, color-mix(in srgb, $c 50%, #76ff03) 45%, transparent) 45%, transparent),\n      radial-gradient(ellipse 30% 50% at 68% 50%, $c, color-mix(in srgb, $c 45%, transparent) 45%, transparent);","aurora|:nth-child(3)":"\n    animation-duration: calc(var(--mc-fx-dur) * 0.8);\n    background: radial-gradient(ellipse 38% 50% at 42% 50%, color-mix(in srgb, $c 50%, #e040fb), color-mix(in srgb, color-mix(in srgb, $c 50%, #e040fb) 45%, transparent) 45%, transparent);","lava-lamp":"\n    bottom: -12%; width: calc(14cqmin + var(--mc-anim-phase) * 16cqmin); aspect-ratio: 1; margin-left: -10cqmin; border-radius: 50%;\n    background: radial-gradient(circle at 35% 35%, color-mix(in srgb, $c 55%, #fff), $c 70%); filter: blur(2px);","plasma-gradient":"\n    left: 50%; top: 50%; width: 160cqmax; aspect-ratio: 1; margin: -80cqmax 0 0 -80cqmax; opacity: calc($i / 100);\n    background: radial-gradient(circle at 30% 30%, $c, color-mix(in srgb, $c 55%, transparent) 22%, color-mix(in srgb, $c 15%, transparent) 38%, transparent 52%),\n      radial-gradient(circle at 70% 40%, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #ff4081) 15%, transparent) 38%, transparent 52%),\n      radial-gradient(circle at 45% 75%, color-mix(in srgb, $c 40%, #00e5ff), color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 55%, transparent) 22%, color-mix(in srgb, color-mix(in srgb, $c 40%, #00e5ff) 15%, transparent) 38%, transparent 52%);","gradient-flow":"\n    left: 0; top: 0; width: 300%; height: 100%; opacity: calc($i / 100);\n    background: linear-gradient(110deg, $c, color-mix(in srgb, $c 40%, #ff4081), color-mix(in srgb, $c 40%, #00e5ff), $c);",starfield:"\n    top: calc(6% + var(--mc-anim-phase) * 86%); width: 3px; height: 3px; margin: -1.5px 0 0 -1.5px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 4px 1px color-mix(in srgb, $c 60%, transparent);","starfield|:nth-child(3n)":"width: 2px; height: 2px;","meteor-shower":"\n    top: calc(-10% + var(--mc-anim-phase) * 30%); left: calc(30% + var(--mc-anim-x) * 0.8); width: 22%; height: 2px;\n    rotate: -45deg; transform-origin: 0 50%; border-radius: 2px; background: linear-gradient(90deg, $c, transparent);",bokeh:"\n    top: calc(10% + var(--mc-anim-phase) * 75%); width: calc(10cqmin + var(--mc-anim-k) * 18cqmin); aspect-ratio: 1;\n    margin: -10cqmin 0 0 -10cqmin; border-radius: 50%; filter: blur(1px);\n    background: radial-gradient(circle, color-mix(in srgb, $c 70%, transparent), color-mix(in srgb, $c 25%, transparent) 60%, transparent 72%);","matrix-rain":"\n    top: 0; width: 2px; height: calc(20% + var(--mc-anim-phase) * 25%); border-radius: 1px;\n    background: linear-gradient(transparent, color-mix(in srgb, $c 60%, transparent) 70%, $c);","matrix-rain|:nth-child(odd)":"\n    width: 3px; background: repeating-linear-gradient(transparent 0 3px, $c 3px 6px);\n    -webkit-mask: linear-gradient(transparent, #000); mask: linear-gradient(transparent, #000);",smoke:"\n    bottom: -20px; width: 26px; height: 26px; margin-left: -13px; border-radius: 50%;\n    background: color-mix(in srgb, $c 70%, #9e9e9e); filter: blur(8px);","clouds-drift":"\n    left: -40%; top: calc(5% + var(--mc-anim-phase) * 55%); width: 38%; aspect-ratio: 2.4; filter: blur(1.5px);\n    background: radial-gradient(ellipse 35% 45% at 30% 60%, $c 60%, transparent 62%),\n      radial-gradient(ellipse 30% 55% at 55% 45%, $c 60%, transparent 62%),\n      radial-gradient(ellipse 28% 40% at 75% 62%, $c 60%, transparent 62%);","water-ripple":"\n    top: calc(25% + var(--mc-anim-phase) * 50%); width: 60cqmin; aspect-ratio: 2.2; margin: -13.6cqmin 0 0 -30cqmin;\n    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;\n    box-shadow: 0 0 0 3px color-mix(in srgb, $c 25%, transparent);",fireworks:"\n    left: 50%; top: 45%; width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 6px 1px $c; animation-delay: var(--mc-fx-delay, 0s);","fireworks|:nth-child(even)":"background: color-mix(in srgb, $c 50%, #ffeb3b); box-shadow: 0 0 6px 1px color-mix(in srgb, $c 50%, #ffeb3b);","tap-ripple":"\n    left: var(--mc-tap-x, 50%); top: var(--mc-tap-y, 50%); width: 290cqmax; aspect-ratio: 1; margin: -145cqmax 0 0 -145cqmax;\n    border-radius: 50%; background: radial-gradient(circle, $c 0, color-mix(in srgb, $c 55%, transparent) 40%, transparent 70%);"};i.d(t,["D",0,s,"H",0,n])},1182(e,t,i){const n={breathe:"\n    0%, 100% { scale: 1; opacity: 1; }\n    50% { scale: calc(1 + $i / 100); opacity: 0.78; }","glow-pulse":"\n    0%, 100% { box-shadow: 0 0 0 0 transparent; }\n    50% { box-shadow: 0 0 calc($i * 1px) calc($i * 0.19px) $c; }","glow-pulse-icon":"\n    0%, 100% { filter: drop-shadow(0 0 0 transparent); }\n    50% { filter: drop-shadow(0 0 calc($i * 0.375px) $c); }","halo-ripple":"\n    0% { box-shadow: 0 0 0 0 $c; }\n    100% { box-shadow: 0 0 0 calc($i * 1px) transparent; }","halo-ripple-icon":"\n    0% { filter: drop-shadow(0 0 0 $c); }\n    100% { filter: drop-shadow(0 0 calc($i * 0.7px) transparent); }",aura:"\n    0%, 100% {\n      box-shadow: 0 0 calc($i * 0.42px) calc($i * 0.04px) color-mix(in srgb, $c 60%, transparent),\n        inset 0 0 calc($i * 0.42px) color-mix(in srgb, $c 24%, transparent);\n    }\n    50% {\n      box-shadow: 0 0 calc($i * 1px) calc($i * 0.25px) $c,\n        inset 0 0 calc($i * 0.75px) color-mix(in srgb, $c 48%, transparent);\n    }","aura-icon":"\n    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.125px) color-mix(in srgb, $c 50%, transparent)); }\n    50% { filter: drop-shadow(0 0 calc($i * 0.42px) $c); }",heartbeat:"\n    0%, 70%, 100% { scale: 1; }\n    14% { scale: calc(1 + $i / 100); }\n    28% { scale: 1; }\n    42% { scale: calc(1 + $i / 150); }",spin:"\n    from { rotate: 0deg; }\n    to { rotate: calc($i * 1deg); }","fast-spin":"\n    from { rotate: 0deg; }\n    to { rotate: calc($i * 1deg); }",sway:"\n    0%, 100% { rotate: calc($i * -1deg); }\n    50% { rotate: calc($i * 1deg); }",wobble:"\n    0%, 100% { translate: 0 0; rotate: 0deg; }\n    15% { translate: calc($i * -1px) 0; rotate: calc($i * -0.66deg); }\n    30% { translate: calc($i * 0.83px) 0; rotate: calc($i * 0.5deg); }\n    45% { translate: calc($i * -0.66px) 0; rotate: calc($i * -0.33deg); }\n    60% { translate: calc($i * 0.33px) 0; rotate: calc($i * 0.17deg); }\n    75% { translate: calc($i * -0.17px) 0; rotate: calc($i * -0.08deg); }","shake-alert":"\n    0%, 50%, 100% { translate: 0 0; }\n    5%, 15%, 25%, 35%, 45% { translate: calc($i * -1px) 0; }\n    10%, 20%, 30%, 40% { translate: calc($i * 1px) 0; }",rumble:"\n    0%, 100% { translate: 0 0; }\n    25% { translate: calc($i * 1px) calc($i * -1px); }\n    50% { translate: calc($i * -1px) calc($i * 1px); }\n    75% { translate: calc($i * 1px) calc($i * 1px); }",float:"\n    0%, 100% { translate: 0 0; }\n    50% { translate: 0 calc($i * -1px); }","flame-flicker":"\n    0%, 100% { scale: 1 1; rotate: 0deg; filter: drop-shadow(0 0 2px $c) brightness(1); }\n    25% { scale: calc(1 - $i * 0.004) calc(1 + $i / 100); rotate: calc($i * 0.3deg); filter: drop-shadow(0 -1px 6px $c) brightness(1.15); }\n    50% { scale: calc(1 + $i * 0.004) calc(1 - $i * 0.006); rotate: calc($i * -0.2deg); filter: drop-shadow(0 0 3px $c) brightness(0.95); }\n    75% { scale: calc(1 - $i * 0.002) calc(1 + $i * 0.008); rotate: calc($i * -0.4deg); filter: drop-shadow(0 -1px 5px $c) brightness(1.1); }","steam-rise":"\n    0% { translate: 0 0; scale: 0.5; opacity: 0; }\n    25% { opacity: 1; }\n    100% { translate: 0 -100cqh; scale: 1.7; opacity: 0; }",bubbles:"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    50% { translate: 4px -55cqh; }\n    90% { opacity: 0.8; }\n    100% { translate: -3px calc(-100cqh - 12px); opacity: 0; }","snow-fall":"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    50% { translate: 6px 50cqh; }\n    100% { translate: -2px calc(100cqh + 12px); opacity: 0.7; }","rain-fall":"\n    0% { translate: 0 0; opacity: 0; }\n    10% { opacity: 1; }\n    100% { translate: 0 calc(100cqh + 24px); opacity: 0.6; }","liquid-wave":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","storm-flash":"\n    0%, 88%, 100% { opacity: 0; }\n    90% { opacity: calc($i / 100); }\n    91.5% { opacity: 0.1; }\n    93.5% { opacity: calc($i / 125); }\n    96% { opacity: 0; }","shine-sweep":"\n    0% { translate: -100% 0; }\n    60%, 100% { translate: 100cqw 0; }",blink:"\n    0%, 45%, 100% { opacity: 1; }\n    50%, 95% { opacity: calc(1 - $i / 100); }","neon-flicker":"\n    0%, 17%, 23%, 26%, 52%, 58%, 100% { opacity: 1; filter: drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1); }\n    20%, 25%, 55% { opacity: 0.45; filter: drop-shadow(0 0 0 transparent) brightness(0.8); }\n    24% { opacity: 0.8; filter: drop-shadow(0 0 calc($i * 0.4px) $c) brightness(1); }","rainbow-hue":"\n    from { filter: hue-rotate(0deg); }\n    to { filter: hue-rotate(calc($i * 1deg)); }",glitch:"\n    0%, 86%, 100% { translate: 0 0; filter: none; }\n    88% { translate: calc($i * -1px) 0; filter: drop-shadow(calc($i * 0.7px) 0 0 $c) drop-shadow(calc($i * -0.7px) 0 0 color-mix(in srgb, $c 35%, #00e5ff)); }\n    90% { translate: calc($i * 1px) calc($i * 0.3px); filter: drop-shadow(calc($i * -0.7px) 0 0 $c) hue-rotate(40deg); }\n    92% { translate: calc($i * -0.5px) 0; filter: drop-shadow(calc($i * 0.4px) 0 0 color-mix(in srgb, $c 35%, #ff1744)); }\n    94% { translate: 0 0; filter: none; }","fade-pulse":"\n    0%, 100% { opacity: 1; }\n    50% { opacity: calc(1 - $i / 100); }",bounce:"\n    0%, 20%, 53%, 100% { translate: 0 0; scale: 1 1; }\n    40%, 43% { translate: 0 calc($i * -1px); scale: 0.96 1.06; }\n    70% { translate: 0 calc($i * -0.5px); scale: 0.98 1.03; }\n    80% { translate: 0 0; scale: 1.04 0.96; }\n    90% { translate: 0 calc($i * -0.12px); scale: 1 1; }",jello:"\n    0%, 10%, 60%, 100% { scale: 1 1; }\n    18% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }\n    26% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }\n    34% { scale: calc(1 + $i / 200) calc(1 - $i / 200); }\n    42% { scale: calc(1 - $i / 400) calc(1 + $i / 400); }\n    50% { scale: calc(1 + $i / 800) calc(1 - $i / 800); }","rubber-band":"\n    0%, 55%, 100% { scale: 1 1; }\n    15% { scale: calc(1 + $i / 100) calc(1 - $i / 100); }\n    20% { scale: calc(1 - $i / 100) calc(1 + $i / 100); }\n    25% { scale: calc(1 + $i / 160) calc(1 - $i / 160); }\n    33% { scale: calc(1 - $i / 500) calc(1 + $i / 500); }\n    42% { scale: calc(1 + $i / 500) calc(1 - $i / 500); }",tada:"\n    0%, 50%, 100% { scale: 1; rotate: 0deg; }\n    5%, 10% { scale: 0.9; rotate: calc($i * -1deg); }\n    15%, 25%, 35%, 45% { scale: 1.1; rotate: calc($i * 1deg); }\n    20%, 30%, 40% { scale: 1.1; rotate: calc($i * -1deg); }",swing:"\n    0%, 60%, 100% { rotate: 0deg; }\n    12% { rotate: calc($i * 1deg); }\n    24% { rotate: calc($i * -0.66deg); }\n    36% { rotate: calc($i * 0.33deg); }\n    48% { rotate: calc($i * -0.2deg); }",flip:"\n    0%, 10% { rotate: y 0deg; }\n    60%, 100% { rotate: y calc($i * 1deg); }",pop:"\n    0%, 40%, 100% { scale: 1; }\n    10% { scale: calc(1 + $i / 100); }\n    20% { scale: calc(1 - $i / 400); }\n    30% { scale: calc(1 + $i / 600); }","head-shake":"\n    0%, 50%, 100% { translate: 0 0; rotate: 0deg; }\n    6.5% { translate: calc($i * -1px) 0; rotate: calc($i * -1deg); }\n    18.5% { translate: calc($i * 0.8px) 0; rotate: calc($i * 0.8deg); }\n    31.5% { translate: calc($i * -0.5px) 0; rotate: calc($i * -0.5deg); }\n    43.5% { translate: calc($i * 0.3px) 0; rotate: calc($i * 0.3deg); }"},s={"steam-rise":"\n    bottom: -12px; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%;\n    background: $c; filter: blur(5px);",bubbles:"\n    bottom: -10px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%;\n    border: 1.5px solid $c;\n    background: color-mix(in srgb, $c 22%, transparent);","bubbles|:nth-child(even)":"width: 5px; height: 5px;","snow-fall":"\n    top: -8px; width: 5px; height: 5px; border-radius: 50%;\n    background: $c;","rain-fall":"\n    top: -18px; width: 2px; height: 14px; border-radius: 1px;\n    background: linear-gradient(transparent, $c);","liquid-wave":"\n    left: -50%; top: calc(100% - $i * 1%); width: 200%; aspect-ratio: 1; border-radius: 42%;\n    background: color-mix(in srgb, $c 50%, transparent); opacity: 1;","liquid-wave|:nth-child(2)":"\n    top: calc(100% - $i * 0.9%); border-radius: 38%;\n    background: $c; animation-direction: reverse;","storm-flash":"inset: 0; background: color-mix(in srgb, $c 35%, rgba(255, 255, 255, 0.55));","shine-sweep":"\n    top: 0; bottom: 0; left: 0; width: 45%; opacity: 1;\n    background: linear-gradient(100deg, transparent 0%,\n      color-mix(in srgb, var(--mca-shine-sweep-c, #fff) calc($i * 1%), transparent) 50%, transparent 100%);"};i.d(t,["S",0,n,"_",0,s])},6838(e,t,i){const n="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",s={ping:"\n    0% { scale: 0.15; opacity: 1; }\n    80%, 100% { scale: 1; opacity: 0; }","ripple-rings":"\n    0% { scale: 0.1; opacity: 1; }\n    100% { scale: 1; opacity: 0; }","radar-sweep":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","conic-border-spin":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","breathing-border":"\n    0%, 100% { box-shadow: inset 0 0 0 calc($i * 1px) color-mix(in srgb, $c 30%, transparent), 0 0 0 0 transparent; }\n    50% { box-shadow: inset 0 0 0 calc($i * 1px) $c, 0 0 calc($i * 4px) color-mix(in srgb, $c 35%, transparent); }","breathing-border-icon":"\n    0%, 100% { filter: drop-shadow(0 0 calc($i * 0.5px) color-mix(in srgb, $c 40%, transparent)); }\n    50% { filter: drop-shadow(0 0 calc($i * 1.5px) $c); }",fireflies:"\n    0% { translate: 0 0; opacity: 0; }\n    20% { opacity: 1; }\n    40% { translate: 10px -8px; }\n    60% { opacity: 0.3; }\n    75% { translate: -6px -14px; opacity: 1; }\n    100% { translate: 4px -22px; opacity: 0; }",confetti:"\n    0% { translate: 0 0; rotate: 0deg; opacity: 1; }\n    25% { translate: 8px 25cqh; rotate: 160deg; }\n    50% { translate: -6px 50cqh; rotate: 300deg; }\n    75% { translate: 6px 75cqh; rotate: 420deg; }\n    100% { translate: 0 calc(100cqh + 14px); rotate: 540deg; opacity: 1; }","falling-leaves":"\n    0% { translate: 0 0; rotate: 0deg; opacity: 0; }\n    10% { opacity: 1; }\n    30% { translate: 14px 30cqh; rotate: 60deg; }\n    55% { translate: -8px 55cqh; rotate: -20deg; }\n    80% { translate: 12px 80cqh; rotate: 80deg; }\n    100% { translate: 0 calc(100cqh + 16px); rotate: 20deg; opacity: 0.8; }",lightning:"\n    0%, 89%, 100% { opacity: 0; }\n    90% { opacity: calc($i / 100); }\n    91.5% { opacity: 0.15; }\n    93% { opacity: calc($i / 100); }\n    96% { opacity: 0; }","ocean-waves":"\n    from { translate: 0 0; }\n    to { translate: -40px 0; }","sun-rays":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","heat-shimmer":"\n    0%, 100% { translate: 0 0; filter: blur(0); }\n    25% { translate: calc($i * 0.5px) calc($i * -0.5px); filter: blur(calc($i * 0.3px)); }\n    50% { translate: calc($i * -0.5px) 0; filter: blur(0); }\n    75% { translate: 0 calc($i * 0.5px); filter: blur(calc($i * 0.2px)); }","wind-lines":"\n    0% { translate: 0 0; opacity: 0; }\n    15% { opacity: 1; }\n    85% { opacity: 0.8; }\n    100% { translate: calc(100cqw + 100%) 0; opacity: 0; }",drip:"\n    0% { translate: 0 0; scale: 0.4 0.2; opacity: 0; }\n    15% { scale: 1 1; opacity: 1; }\n    35% { translate: 0 2px; scale: 0.9 1.25; }\n    45% { translate: 0 4px; scale: 1 1; }\n    100% { translate: 0 calc(100cqh + 12px); scale: 0.9 1.3; opacity: 0.7; }","equalizer-bars":"\n    0% { scale: 1 0.15; }\n    30% { scale: 1 0.8; }\n    60% { scale: 1 0.35; }\n    100% { scale: 1 1; }","charging-stripes":"\n    from { translate: 0 0; }\n    to { translate: 28.2843px 0; }","orbit-dots":"\n    from { rotate: 0deg; }\n    to { rotate: 360deg; }","typing-dots":"\n    0%, 60%, 100% { translate: 0 0; opacity: 0.35; }\n    30% { translate: 0 calc($i * -1px); opacity: 1; }"},r={ping:"\n    left: 50%; top: 50%; width: calc($i * 1cqmin); aspect-ratio: 1; translate: -50% -50%;\n    border: 2px solid $c; border-radius: 50%; box-sizing: border-box;","ripple-rings":`\n    left: 50%; top: 50%; width: 110cqmin; aspect-ratio: 1; translate: -50% -50%;\n    border: 1.5px solid $c; border-radius: 50%; box-sizing: border-box; ${n}`,"radar-sweep":"\n    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; border-radius: 50%; opacity: 1;\n    background: conic-gradient(from 0deg, transparent 0deg calc(360deg - $i * 1deg),\n      $c 360deg);","conic-border-spin":"\n    left: 50%; top: 50%; width: 150cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;\n    background: conic-gradient(from 0deg, transparent 0% 55%, $c 80%, transparent 100%);",fireflies:"\n    top: calc(12% + var(--mc-anim-phase) * 72%); width: 4px; height: 4px; margin: -2px 0 0 -2px; border-radius: 50%;\n    background: $c; box-shadow: 0 0 6px 2px $c;",confetti:"top: -10px; width: 6px; height: 10px; border-radius: 1px; background: $c;","confetti|:nth-child(3n + 2)":"background: color-mix(in srgb, $c 40%, #ffeb3b);","confetti|:nth-child(3n)":"width: 8px; height: 6px; background: color-mix(in srgb, $c 40%, #e91e63);","falling-leaves":"\n    top: -14px; width: 10px; height: 10px; border-radius: 0 80% 0 80%;\n    background: $c;","falling-leaves|:nth-child(even)":"background: color-mix(in srgb, $c 75%, #7cb342);",lightning:"\n    left: 50%; top: 0; width: 32cqmin; height: 100%; translate: -50% 0;\n    background: color-mix(in srgb, $c 40%, #fff);\n    clip-path: polygon(58% 0, 22% 56%, 46% 56%, 32% 100%, 80% 40%, 56% 40%, 72% 0);","ocean-waves":"\n    left: 0; bottom: 0; width: calc(100% + 40px); height: calc($i * 1%); opacity: 1;\n    background: radial-gradient(22px 12px at 20px 0, transparent 98%, color-mix(in srgb, $c 45%, transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"\n    height: calc($i * 0.75%); animation-direction: reverse; animation-duration: calc(var(--mc-fx-dur) * 1.5);\n    background: radial-gradient(22px 10px at 20px 0, transparent 98%, color-mix(in srgb, $c 70%, transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"\n    height: calc($i * 0.5%); animation-duration: calc(var(--mc-fx-dur) * 0.7);\n    background: radial-gradient(22px 8px at 20px 0, transparent 98%, $c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"\n    left: 50%; top: 50%; width: 170cqmax; aspect-ratio: 1; translate: -50% -50%; opacity: 1;\n    background: repeating-conic-gradient(from 0deg, $c 0deg calc($i * 1deg),\n      transparent calc($i * 1deg) calc($i * 3deg));\n    mask: radial-gradient(closest-side, #000 15%, transparent 70%);","wind-lines":"\n    left: -35%; top: calc(10% + var(--mc-anim-phase) * 80%); width: 35%; height: 2px; border-radius: 2px;\n    background: linear-gradient(90deg, transparent, $c);",drip:"\n    top: -4px; width: 6px; height: 9px; margin-left: -3px; transform-origin: 50% 0;\n    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; background: $c;","equalizer-bars":"\n    left: calc(10% + var(--mc-anim-k) * 80%); bottom: 0; width: max(3px, 5%); height: 70%; opacity: 1;\n    border-radius: 2px 2px 0 0; transform-origin: 50% 100%; background: $c;","charging-stripes":"\n    top: 0; bottom: 0; left: -28.2843px; width: calc(100% + 28.2843px); opacity: 1;\n    background: repeating-linear-gradient(-45deg, color-mix(in srgb, $c calc($i * 1%), transparent) 0 10px, transparent 10px 20px);","orbit-dots":`\n    left: 50%; top: calc(50% - 38cqmin); width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 50%; opacity: 1;\n    background: $c; transform-origin: 3px calc(3px + 38cqmin); ${n}`,"typing-dots":"\n    left: calc(50% - 12px + var(--mc-anim-k) * 36px); top: 50%; width: 6px; height: 6px; margin: -3px 0 0 -3px;\n    border-radius: 50%; background: $c;\n    animation-delay: calc(var(--mc-fx-delay, 0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur, 1s) * 0.5);"},a={"conic-border-spin":"\n    padding: calc($i * 1px); box-sizing: border-box;\n    background: color-mix(in srgb, $c 18%, transparent);\n    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);\n    -webkit-mask-composite: xor;\n    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);"};i.d(t,["I3",0,a,"Tb",0,s,"bh",0,r])},9460(e,t,i){const n=i(6161).AH`
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
`;i.d(t,["A",0,n])},3737(e,t,i){i.d(t,{Qt:()=>y,bb:()=>m,k8:()=>f});var n=i(8521),s=i(4099);const r=["spin","glow","flame","drum","swing","pulse","snow","shake","eq"],a={spin:1.5,glow:2.4,flame:1.2,drum:1.2,swing:1,pulse:1.5,snow:2.4,shake:1.2,eq:1.2},o="var(--error-color, #db4437)",l=new Set(["problem","smoke","gas","moisture","safety","carbon_monoxide","heat","tamper"]),c=new Set(["door","window","garage_door","opening"]),d=new Set(["run","running","washing","drying","spin","spinning","rinse","wash","dry"]),u=(e,t={})=>({anim:e,speed:a[e],intensity:1,...t}),p=e=>"number"==typeof e&&Number.isFinite(e)?e:void 0,h=e=>Math.min(1,Math.max(0,e));function m(e){if(!e||"string"!=typeof e.entity_id)return;const t=e.entity_id.split(".")[0],i=e.state,n=e.attributes||{},s="string"==typeof n.device_class?n.device_class:"";switch(t){case"fan":{if("on"!==i)return;const e=h((p(n.percentage)??100)/100);return u("spin",{speed:.6+2.4*(1-e)})}case"light":{if("on"!==i)return;const e=n.rgb_color,t=Array.isArray(e)&&e.length>=3&&e.slice(0,3).every(e=>void 0!==p(e))?`rgb(${e[0]}, ${e[1]}, ${e[2]})`:void 0,s=p(n.brightness);return u("glow",{intensity:void 0===s?1:.25+.75*h(s/255),...t?{color:t}:{}})}case"climate":return"heating"===n.hvac_action||"preheating"===n.hvac_action?u("flame"):"cooling"===n.hvac_action?u("snow"):"fan"===n.hvac_action?u("spin",{speed:1.5}):void 0;case"vacuum":return"cleaning"===i?u("drum",{speed:1.2}):void 0;case"sensor":return d.has(i)?u("drum",{speed:1.2}):void 0;case"binary_sensor":if("on"!==i)return;return"running"===s?u("drum",{speed:1.2}):c.has(s)?u("swing",{speed:0,intensity:.3}):l.has(s)?u("pulse",{color:o}):void 0;case"cover":return"opening"===i||"closing"===i?u("swing",{speed:1}):"open"===i?u("swing",{speed:0,intensity:.3}):void 0;case"lock":return"jammed"===i?u("shake"):"locking"===i||"unlocking"===i||"opening"===i?u("pulse"):void 0;case"media_player":return"playing"===i?u("eq"):void 0;case"alarm_control_panel":return"triggered"===i?u("pulse",{color:o}):void 0;case"siren":return"on"===i?u("pulse",{color:o}):void 0;default:return}}function f(e,t=e?.entity_id??""){const i=t.split(".")[0],n=String(e?.attributes?.device_class??"");switch(i){case"fan":return"Spin while on, faster at a higher speed";case"light":return"Glow while on, in the light's color and brightness";case"climate":return"Flame while heating, Snow while cooling, Spin while only the fan runs";case"vacuum":return"Drum while cleaning";case"sensor":return"Drum while the state is running, washing or drying";case"binary_sensor":return"running"===n?"Drum while running":c.has(n)?"Swing: a slightly opened pose while open":l.has(n)?"Pulse in the alert color while on":void 0;case"cover":return"Swing while opening or closing, a slightly opened pose while open";case"lock":return"Shake while jammed, Pulse while locking or unlocking";case"media_player":return"Equalizer while playing";case"alarm_control_panel":return"Pulse in the alert color while triggered";case"siren":return"Pulse in the alert color while on";default:return}}const g=new Set(["alarm_control_panel","automation","binary_sensor","camera","climate","cover","fan","humidifier","input_boolean","lawn_mower","light","lock","media_player","remote","script","siren","switch","timer","vacuum","valve","water_heater"]);function y(e,t){if("auto"===e)return m(t);if(!r.includes(e))return;if(function(e){if(!e||"string"!=typeof e.entity_id)return!1;if((0,s.Pd)(e))return!0;const t=e.entity_id.split(".")[0];return!!g.has(t)&&(!("climate"!==t||!["idle","off"].includes(String(e.attributes?.hvac_action)))||"media_player"===t&&"paused"===e.state||!(0,n.mu)(e))}(t))return;const i=e,a=m(t);return a?.anim===i?{...a,speed:a.speed>0?a.speed:1.5}:{anim:i,speed:1.5,intensity:1}}},5931(e,t,i){i.d(t,{EN:()=>b,Qh:()=>w,dU:()=>g,uM:()=>f});var n=i(340),s=i(8521),r=i(4099),a=i(3737);const o={min:0,max:100,emptyOpacity:.25,angle:90,drawDuration:1.2,secondaryPct:40,stops:["#2196f3","#f44336"]},l=["up","down","left","right"],c=["solid","duotone","gradient","value"],d=["off","load","change","loop"],u=e=>{const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0},p=(e,t,i)=>Math.min(i,Math.max(t,e)),h=(e,t,i)=>t.includes(e)?e:i,m=(e,t)=>t>=100?e:`color-mix(in srgb, ${e} ${p(t,0,100)}%, transparent)`;function f(e){if("string"==typeof e&&/^\s*\d*\.?\d+\s*%\s*$/.test(e))return p(parseFloat(e)/100,0,1);const t=u(e);return void 0!==t?p(t>1?t/100:t,0,1):void 0}function g(e,t){const i=(0,s.qB)(e);return i?m((0,s.id)(t)??`var(${s.MZ}, currentColor)`,i.opacity):(0,n.f8)(e)}function y(e){const t=e.trim();let i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(i){const e=3===i[1].length?[...i[1]].map(e=>e+e).join(""):i[1];return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}}return i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t),i?{r:+i[1],g:+i[2],b:+i[3]}:void 0}const v=e=>`rgb(${Math.round(e.r)}, ${Math.round(e.g)}, ${Math.round(e.b)})`;function b(e,t,i,n){if((0,r.Pd)(e,t))return;const s=(0,r.f4)(e,t),a=u(i)??o.min,l=u(n)??o.max;return void 0!==s&&l!==a?p((s-a)/(l-a),0,1):void 0}function w(e,t){const i=e&&"object"==typeof e?e:{},n=t.entity?t.hass?.states?.[t.entity]:void 0,s=i.colors&&"object"==typeof i.colors?i.colors:{},r=h(s.style,c,"solid"),w=g(s.primary,n)??t.baseColor,_=i.fill||"value"===r?function(e,t){const i=e.fill&&"object"==typeof e.fill?e.fill:{},n=i.entity||t.entity;return b(n?t.hass?.states?.[n]:void 0,i.attribute||void 0,i.min,i.max)}(i,t):void 0,$={style:r,primary:w,angle:u(s.angle)??o.angle},k="string"==typeof s.secondary&&/%\s*$/.test(s.secondary)?f(s.secondary):void 0,M=void 0!==k?m(w,Math.round(100*k)):g(s.secondary,n);if("duotone"===r?$.secondary=M??m(w,o.secondaryPct):M&&($.secondary=M),"gradient"===r||"value"===r){const e=(Array.isArray(s.gradient)?s.gradient:[]).map(e=>g(e,n)).filter(e=>!!e);$.stops=e.length>=2?e:1===e.length?[e[0],e[0]]:[...o.stops],"value"===r&&($.valueColor=void 0===_?$.stops[0]:function(e,t){if(!e.length)return"currentColor";const i=p(Number.isFinite(t)?t:0,0,1)*(e.length-1),n=Math.min(Math.floor(i),e.length-2);if(1===e.length||n<0)return y(e[0])?v(y(e[0])):e[0];const s=i-n,r=y(e[n]),a=y(e[n+1]);return r&&a?v({r:r.r+(a.r-r.r)*s,g:r.g+(a.g-r.g)*s,b:r.b+(a.b-r.b)*s}):s<.5?e[n]:e[n+1]}($.stops,_),void 0===_&&($.valueMissing=!0))}const S={colors:$,draw:h(i.draw,d,"off"),drawDuration:x(i.draw_duration)??o.drawDuration,morph:!0===i.morph},C=(0,a.Qt)(i.device,n);if(C&&(S.device=C),i.fill&&"object"==typeof i.fill){const e=i.fill,t=f(e.empty_color),s=void 0===t?g(e.empty_color,n):void 0;S.fill={level:_,color:g(e.color,n)??$.valueColor??w,emptyOpacity:s?1:t??o.emptyOpacity,...s?{emptyColor:s}:{},wave:!1!==e.wave,direction:h(e.direction,l,"up")}}return S}function x(e){const t=(0,n.TD)(e);if(!t)return;const i=t.endsWith("ms")?parseFloat(t)/1e3:parseFloat(t);return i>0?i:void 0}i.d(t,["_T",0,o])},3584(e,t,i){i.d(t,{PO:()=>v,Qk:()=>k,WZ:()=>E,ZE:()=>b,ZQ:()=>S,oM:()=>w,wV:()=>M});var n=i(1887);const s="0 0 24 24",r=new Map,a=new Map,o=new Map,l=new Set;let c,d,u=0;const p=new Set;let h=!1;const m=e=>e.includes(":")?e.slice(0,e.indexOf(":")):"",f=new Set(["mdi","hass","hassio","hademo"]);function g(e){const t="undefined"==typeof window?{}:window,i=t.customIconsets?.[e];if("function"==typeof i)return i;const n=t.customIcons?.[e];return n&&"function"==typeof n.getIcon?e=>n.getIcon(e):void 0}function y(e,t){for(r.delete(e),r.set(e,{g:t,at:Date.now()});r.size>200;)r.delete(r.keys().next().value);t&&(l.delete(e),o.get(e)?.forEach(e=>{try{e()}catch{}}))}function v(e){const t=r.get(e);if(t?.g)return r.delete(e),r.set(e,t),t.g}function b(e,t){let i=o.get(e);return i||o.set(e,i=new Set),i.add(t),()=>{i.delete(t),i.size||o.delete(e)}}function w(e,t){y(e,t)}const x=new Map;function _(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return(t>>>0).toString(36)+e.length.toString(36)}let $=_;function k(e){const t=`svg:${$(e)}`;let i=t;for(let n=1;x.has(i)&&x.get(i).text!==e;n++)i=`${t}.${n}`;const s=function(e){const t=x.get(e);return t&&(x.delete(e),x.set(e,t)),t}(i);if(s)return s.geometry&&!r.get(i)?.g&&y(i,s.geometry),i;const a=function(e){try{return(0,n.OW)(e)}catch{return{markup:"",viewBox:"0 0 24 24",paths:[],accentPaths:[],strokes:[],error:n.kk}}}(e),o={text:e};if(a.error)o.error=a.error;else{const e={paths:a.paths,viewBox:a.viewBox};a.accentPaths.length&&(e.secondary=a.accentPaths),a.strokes.length&&(e.strokes=a.strokes),a.evenodd&&(e.evenodd=a.evenodd),o.markup=a.markup,o.geometry=e}for(x.set(i,o);x.size>50;){const e=x.keys().next().value;x.delete(e),r.delete(e)}return o.geometry&&y(i,o.geometry),i}function M(e){return x.get(e)?.markup}function S(e){return x.get(e)?.error}async function C(e){const t=g(m(e));if(!t)return;let i;try{i=await t((e=>e.slice(e.indexOf(":")+1))(e))}catch{return}if(!i||"object"!=typeof i)return;const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const r={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():s},a="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return a&&!a.startsWith("<")&&(r.secondary=[a]),r}function T(e,t){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",e);let r,a=!1;const o=setInterval(()=>{m(),u()},50),l=setTimeout(()=>c(void 0),t),c=e=>{a||(a=!0,p.delete(h),r?.disconnect(),clearInterval(o),clearTimeout(l),n.remove(),d&&!d.childElementCount&&(d.remove(),d=void 0),i(e))},u=()=>{if(a)return;const e=n.shadowRoot?.querySelector("ha-svg-icon"),t="string"==typeof e?.path?e.path.trim():"";if(!e||!t)return;const i={paths:[t],viewBox:"string"==typeof e.viewBox&&e.viewBox.trim()?e.viewBox.trim():s},r="string"==typeof e.secondaryPath?e.secondaryPath.trim():"";r&&(i.secondary=[r]),c(i)},h=()=>c(void 0);function m(){!r&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(r=new MutationObserver(u),r.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}p.add(h),(d?.isConnected||(d=document.createElement("div"),d.setAttribute("aria-hidden","true"),d.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(d)),d).appendChild(n),m();const f=n;f.updateComplete?.then(()=>{m(),u()},()=>{}),u()})}function A(){for(const e of[...l]){if(!g(m(e))||a.has(e))continue;l.delete(e);const t=C(e).then(t=>(a.delete(e),y(e,t&&"markup"!==t?t:null),t&&"markup"!==t?t:void 0));a.set(e,t)}}function E(e,t={}){if(!e||!e.includes(":"))return Promise.resolve(void 0);if(e.startsWith("svg:"))return Promise.resolve(v(e));h||"undefined"==typeof window||(h=!0,window.addEventListener("iconset-registered",A));const i=r.get(e);if(i){if(i.g)return Promise.resolve(v(e));const t=Date.now()-i.at>6e4,n=l.has(e)&&!!g(m(e));if(!t&&!n)return Promise.resolve(void 0);n&&l.delete(e),r.delete(e)}if(e.startsWith("svg:"))return Promise.resolve(void 0);const n=a.get(e);if(n)return n;const s=(async()=>{const i=!!g(m(e)),n=await C(e);if("markup"===n)return void y(e,null);if(n)return y(e,n),n;const s=m(e);if(!f.has(s))return y(e,null),void(i||(l.add(e),function(){if(u=10,c||!l.size)return;const e=()=>{c=void 0,A(),l.size&&--u>0&&(c=setTimeout(e,500))};c=setTimeout(e,500)}()));const r=t.timeoutMs??3e3,a=function(e,t){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?T(e,t):new Promise(i=>{const n=Date.now();let s=!1;const r=()=>!s&&(s=!0,p.delete(a),clearTimeout(o),!0),a=()=>{r()&&i(void 0)},o=setTimeout(a,t);p.add(a),customElements.whenDefined("ha-icon").then(()=>{r()&&T(e,Math.max(0,t-(Date.now()-n))).then(i)},a)}):Promise.resolve(void 0)}(e,Math.max(r,t.probeMaxMs??15e3));a.then(t=>{t&&(y(e,t),A())});const o=await new Promise(e=>{const t=setTimeout(()=>e(void 0),r);a.then(i=>{clearTimeout(t),e(i)})});if(o)return o;v(e)||y(e,null)})().finally(()=>a.delete(e));return a.set(e,s),s}},9040(e,t,i){i.d(t,{IH:()=>l,eF:()=>d,jR:()=>c});var n=i(6161),s=i(7804),r=i(7921);let a;const o=new WeakMap;function l(){return a||"undefined"==typeof IntersectionObserver||(a=new IntersectionObserver(e=>{for(const t of e)t.target.toggleAttribute("offscreen",!t.isIntersecting),o.get(t.target)?.(t.isIntersecting)})),a}function c(e,t){const i=l();return!!i&&(o.set(e,t),i.observe(e),!0)}function d(e){o.delete(e),a?.unobserve(e),e.removeAttribute("offscreen")}class u extends r.Kq{constructor(e){if(super(e),e.type!==s.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(){return n.s6}update(e){return e.element!==this._el&&(this._unwatch(),this._el=e.element,this.isConnected&&l()?.observe(this._el)),n.s6}_unwatch(){this._el&&(a?.unobserve(this._el),this._el.removeAttribute("offscreen"))}disconnected(){this._unwatch()}reconnected(){this._el&&l()?.observe(this._el)}}const p=(0,s.u$)(u);i.d(t,["Sv",0,p])},4205(e,t,i){i.d(t,{ER:()=>w,GO:()=>v,GW:()=>x,Mj:()=>u});const n=1e-6,s=(e,t)=>Math.abs(e[0]-t[0])<n&&Math.abs(e[1]-t[1])<n,r=(e,t,i)=>e+(t-e)*i,a=(e,t,i)=>[r(e[0],t[0],i),r(e[1],t[1],i)],o=(e,t)=>[e,a(e,t,1/3),a(e,t,2/3),t],l=(e,t,i)=>[e,[e[0]+2/3*(t[0]-e[0]),e[1]+2/3*(t[1]-e[1])],[i[0]+2/3*(t[0]-i[0]),i[1]+2/3*(t[1]-i[1])],i];class c{constructor(e){this.d=e,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const e=this.d[this.i];if(e&&/[MmLlHhVvCcSsQqTtAaZz]/.test(e))return this.i++,e}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip();const e=/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/.exec(this.d.slice(this.i));if(!e)throw new Error(`Bad path number at ${this.i}`);return this.i+=e[0].length,Number(e[0])}flag(){this.skip();const e=this.d[this.i];if("0"!==e&&"1"!==e)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===e?1:0}}function d(e,t,i,r,a,l,c){if(s(e,c))return[];if(t=Math.abs(t),i=Math.abs(i),t<n||i<n)return[o(e,c)];const d=r*Math.PI/180,u=Math.cos(d),p=Math.sin(d),h=(e[0]-c[0])/2,m=(e[1]-c[1])/2,f=u*h+p*m,g=-p*h+u*m,y=f*f/(t*t)+g*g/(i*i);if(y>1){const e=Math.sqrt(y);t*=e,i*=e}const v=t*t*i*i-t*t*g*g-i*i*f*f,b=t*t*g*g+i*i*f*f;let w=Math.sqrt(Math.max(0,v/b));a===l&&(w=-w);const x=w*t*g/i,_=-w*i*f/t,$=u*x-p*_+(e[0]+c[0])/2,k=p*x+u*_+(e[1]+c[1])/2,M=(e,t,i,n)=>Math.atan2(e*n-t*i,e*i+t*n),S=(f-x)/t,C=(g-_)/i,T=(-f-x)/t,A=(-g-_)/i,E=M(1,0,S,C);let P=M(S,C,T,A);!l&&P>0?P-=2*Math.PI:l&&P<0&&(P+=2*Math.PI);const z=Math.max(1,Math.ceil(Math.abs(P)/(Math.PI/2)-1e-9)),L=P/z,O=4/3*Math.tan(L/4),q=e=>[$+t*Math.cos(e)*u-i*Math.sin(e)*p,k+t*Math.cos(e)*p+i*Math.sin(e)*u],R=e=>[-t*Math.sin(e)*u-i*Math.cos(e)*p,-t*Math.sin(e)*p+i*Math.cos(e)*u],N=[];let I=e;for(let e=0;e<z;e++){const t=E+e*L,i=t+L,n=e===z-1?c:q(i),s=R(t),r=R(i);N.push([I,[I[0]+O*s[0],I[1]+O*s[1]],[n[0]-O*r[0],n[1]-O*r[1]],n]),I=n}return N}function u(e){const t=new c(e),i=[];let n,r,a,u,p=[0,0],h=[0,0];const m=e=>{n||(n=[],i.push(n),h=e[0]),n.push(e)};try{for(;!t.done();){const e=t.command();if(e)u=e;else{if(!u||!t.hasNumber())break;"M"===u?u="L":"m"===u&&(u="l")}const i=u===u.toLowerCase(),c=i?p[0]:0,f=i?p[1]:0,g=()=>[t.number()+c,t.number()+f];let y,v;switch(u.toUpperCase()){case"M":p=g(),h=p,n=void 0;break;case"L":{const e=g();m(o(p,e)),p=e;break}case"H":{const e=[t.number()+c,p[1]];m(o(p,e)),p=e;break}case"V":{const e=[p[0],t.number()+f];m(o(p,e)),p=e;break}case"C":{const e=g(),t=g(),i=g();m([p,e,t,i]),y=t,p=i;break}case"S":{const e=r?[2*p[0]-r[0],2*p[1]-r[1]]:p,t=g(),i=g();m([p,e,t,i]),y=t,p=i;break}case"Q":{const e=g(),t=g();m(l(p,e,t)),v=e,p=t;break}case"T":{const e=a?[2*p[0]-a[0],2*p[1]-a[1]]:p,t=g();m(l(p,e,t)),v=e,p=t;break}case"A":{const e=t.number(),i=t.number(),n=t.number(),s=t.flag(),r=t.flag(),a=g();d(p,e,i,n,s,r,a).forEach(m),p=a;break}case"Z":n&&n.length&&!s(p,h)&&n.push(o(p,h)),p=h,n=void 0,u=void 0}r=y,a=v}}catch{}return i.filter(e=>e.length>0)}function p(e,t){const[i,n,s,r]=e,o=a(i,n,t),l=a(n,s,t),c=a(s,r,t),d=a(o,l,t),u=a(l,c,t),p=a(d,u,t);return[[i,o,d,p],[p,u,c,r]]}const h=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1]),m=e=>(h(e[0],e[3])+h(e[0],e[1])+h(e[1],e[2])+h(e[2],e[3]))/2;function f(e,t){const i=e.map(e=>e.map(e=>[e[0],e[1]]));if(!i.length)return i;for(;i.length<t;){let e=0,t=-1;i.forEach((i,n)=>{const s=m(i);s>t&&(t=s,e=n)}),i.splice(e,1,...p(i[e],.5))}return i}const g=e=>e.length>1&&s(e[0][0],e[e.length-1][3]);function y(e){let t=0;for(const i of e)for(let e=0;e<3;e++)t+=i[e][0]*i[e+1][1]-i[e+1][0]*i[e][1];return t/2}function v(e,t){const i=u(e),n=u(t);if(!i.length||i.length!==n.length)return;const s=[],r=[],a=i.map((e,t)=>g(e)&&g(n[t])),o=i.map((e,t)=>a[t]?y(e)*y(n[t]):0),l=o.some(e=>e<0)&&o.every((e,t)=>!a[t]||e<0);return i.forEach((e,t)=>{const i=l&&a[t]?n[t].map(e=>[e[3],e[2],e[1],e[0]]).reverse():n[t];const o=Math.max(e.length,i.length),c=f(e,o);let d=f(i,o);g(c)&&g(d)&&(d=function(e,t){let i=t,n=1/0;for(let s=0;s<t.length;s++){const r=[...t.slice(s),...t.slice(0,s)];let a=0;for(let t=0;t<r.length&&a<n;t++)for(let i=0;i<4;i++)a+=(r[t][i][0]-e[t][i][0])**2+(r[t][i][1]-e[t][i][1])**2;a<n&&(n=a,i=r)}return i}(c,d)),s.push(c),r.push(d)}),{from:s,to:r}}const b=e=>{const t=Math.round(1e3*e)/1e3;return String(Object.is(t,-0)?0:t)};function w(e){return e.map(e=>{if(!e.length)return"";const t=e=>`${b(e[0])} ${b(e[1])}`,i=e.map(e=>`C${t(e[1])} ${t(e[2])} ${t(e[3])}`).join("");return`M${t(e[0][0])}${i}${g(e)?"Z":""}`}).join("")}function x(e,t){const i=e.from.map((i,n)=>i.map((i,s)=>i.map((i,r)=>a(i,e.to[n][s][r],t))));return w(i)}},3884(e,t,i){i.d(t,{K:()=>P,s:()=>z});var n=i(6161),s=i(8497),r=i(9307),a=i(5707),o=i(6752),l=i(7804),c=i(8504);const d=(0,l.u$)(class extends l.WL{constructor(){super(...arguments),this.key=o.s6}render(e,t){return this.key=e,t}update(e,[t,i]){return t!==this.key&&((0,c.mY)(e),this.key=t),i}});var u=i(68);class p extends u.D{}p.directiveName="unsafeSVG",p.resultType=2;const h=(0,l.u$)(p);var m=i(3584);const f=n.AH`
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
`;var g=i(9040),y=i(5931),v=i(4205),b=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let w=0;const x=e=>String(+e.toFixed(3)),_=new Set(["spin","shake","pulse","drum"]),$=e=>[`--mc-icon-speed: ${x(e.speed>0?e.speed:1.5)}s`,`--mc-icon-intensity: ${x(e.intensity)}`,...e.color?[`--mc-icon-glow-color: ${e.color}`]:[]].join("; "),k=250,M=()=>"function"==typeof matchMedia&&!!matchMedia("(prefers-reduced-motion: reduce)")?.matches,S=(e,t,i,s)=>e.map(e=>n.JW`<path class=${s?.cls??n.s6} d=${e.d} pathLength=${s?.pathLength??n.s6} fill="none" stroke=${t}
    stroke-width=${x(e.width)} stroke-linecap=${e.cap??n.s6} stroke-linejoin=${e.join??n.s6} style=${i??n.s6}></path>`);function C(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?{x:t,y:i,w:n,h:s}:{x:0,y:0,w:24,h:24}}const T={up:0,right:90,down:180,left:-90},A=e=>"currentColor"===e?"var(--icon-primary-color, currentColor)":e;let E=class extends n.WF{constructor(){super(...arguments),this.decorative=!1,this._stateTimers=[],this._readsPending=!1,this._rigOn=!1,this._holding=!1,this._animates=!1,this._observed=!1,this._uid="mc-icon-"+ ++w,this._outs=[],this._inSeq=0,this._drawing=!1,this._drawSeq=0,this._loaded=!1,this._reconnected=!1}connectedCallback(){super.connectedCallback(),this._ensure(),this.hasUpdated&&(this._reconnected=!0,this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._unsub=void 0,this._watched=void 0,this._stateTimers.forEach(clearTimeout),this._stateTimers=[],this._readsPending=!1,this._observe(!1),this._stopMorph(),clearTimeout(this._drawTimer),this._drawing=!1}_observe(e){if(e===this._observed)return;const t=(0,g.IH)();t&&(this._observed=e,e?t.observe(this):(t.unobserve(this),this.removeAttribute("offscreen")))}get _byState(){return(0,s.hZ)(this.hass,this.entity,this.iconOn,this.iconOff)}get _own(){const e=this.rig?.svg??("svg"===this.icon?this.svg:void 0);if(e)return e===this._ownText&&this._ownRef&&((0,m.PO)(this._ownRef)||(0,m.ZQ)(this._ownRef))||(this._ownText=e,this._ownRef=(0,m.Qk)(e)),this._ownRef}get _rigRef(){return this.rig?this.rig.svg?this._own:this.rig.ref:void 0}get _useState(){return!(this._byState||this._own||!this.stateObj||"undefined"==typeof customElements||!customElements.get("ha-state-icon"))}get _ref(){return this._rigRef??this._byState??this._own??(this._useState?this._stateRef:this.icon)}willUpdate(e){this._ensure(),this._readPlan=this._statePlan(e);for(const e of[this.iconOn,this.iconOff])e&&this.isConnected&&!(0,m.PO)(e)&&(0,m.WZ)(e);this._fx=(0,y.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"});const t=this._ref,i=this._rigRef,n=i?(0,m.PO)(i):void 0;this._rigOn=!(!this.rig||i&&!n),this._geom=n??(this._useState&&this._stateGeom?this._stateGeom:t&&!i?(0,m.PO)(t):void 0),this._holding=!this._geom&&this._useState&&!!this._shown&&("full"===this._readPlan||this._readsPending),this._holding?this._geom=this._shown:this._track(this._geom,this._fx,this._geom&&t?.startsWith("svg:")?(0,m.wV)(t):void 0)}_track(e,t,i){const n=this.entity?this.hass?.states?.[this.entity]:void 0,r=n?String((0,s.CU)(this.entity.split(".")[0],n.state,n.attributes)):void 0,a=void 0!==this._lastState&&void 0!==r&&r!==this._lastState;if(void 0!==r&&(this._lastState=r),!e)return;const o=(e=>`${e.viewBox}|${e.paths.join(" ")}|${(e.secondary??[]).join(" ")}|${(e.strokes??[]).map(e=>`${e.d}@${e.width}`).join(" ")}`)(e),l=!this._shown,c=!l&&o!==this._shownKey,d=M();c&&t.morph&&!this.rig&&(d?this._stopMorph():this._morph(this._shown,this._shownMarkup,e)),d||this.rig||!(l&&"load"===t.draw&&!this._loaded||"change"===t.draw&&(c||a))||this._draw(t),l&&"load"===t.draw&&(this._loaded=!0),this._shown=e,this._shownKey=o,this._shownMarkup=i}_morph(e,t,i){const n=Date.now(),s=void 0!==this._frame,r=this._frame??e.paths.join(" ");void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0;const a=void 0!==this._inStart?Math.min(1,(n-this._inStart)/k):1;clearTimeout(this._inTimer),this._inStart=void 0;const o=!s&&!!e.strokes?.length||!!i.strokes?.length,l=e.viewBox!==i.viewBox||o?void 0:(0,v.GO)(r,i.paths.join(" "));if(!l){const i=s?{paths:[r],secondary:e.secondary,viewBox:e.viewBox}:e;return this._fadeOut(i,s?void 0:t,k,a),this._inStart=n,this._inSeq++,void(this._inTimer=setTimeout(()=>{this._inStart=void 0,this.requestUpdate()},k))}(e.secondary?.length||t)&&this._fadeOut({paths:[],secondary:e.secondary,viewBox:e.viewBox},t,400,a);const c=n;this._frame=(0,v.GW)(l,0);const d=()=>{const e=Math.min(1,(Date.now()-c)/400);e>=1?(this._raf=void 0,this._frame=void 0):(this._frame=(0,v.GW)(l,(e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2)(e)),this._raf=requestAnimationFrame(d)),this.requestUpdate()};this._raf=requestAnimationFrame(d)}_fadeOut(e,t,i,n){const s=i*Math.max(0,Math.min(1,n));if(s<=0||!e.paths.length&&!e.secondary?.length&&!e.strokes?.length&&!t)return;const r={g:e,markup:t,ms:i,skip:i-s};for(r.timer=setTimeout(()=>{this._outs=this._outs.filter(e=>e!==r),this.requestUpdate()},s),this._outs=[...this._outs,r];this._outs.length>3;)clearTimeout(this._outs.shift().timer)}_stopMorph(){void 0!==this._raf&&cancelAnimationFrame(this._raf),this._raf=void 0,this._frame=void 0,this._outs.forEach(e=>clearTimeout(e.timer)),this._outs=[],clearTimeout(this._inTimer),this._inStart=void 0}_draw(e){clearTimeout(this._drawTimer),this._drawing=!0,this._drawSeq++,this._drawTimer=setTimeout(()=>{this._drawing=!1,this.requestUpdate()},1e3*e.drawDuration)}_ensure(){const e=this._ref;this.isConnected&&(e!==this._watched&&(this._unsub?.(),this._unsub=void 0,this._watched=e,e&&(this._unsub=(0,m.ZE)(e,()=>this.requestUpdate()))),e&&!(0,m.PO)(e)&&(0,m.WZ)(e).then(t=>{t&&this._ref===e&&this.requestUpdate()}))}_statePlan(e){const t=this._reconnected;if(this._reconnected=!1,!this._useState)return;const i=this.hass?.entities?.[this.stateObj.entity_id],n=i!==this._entry;return this._entry=i,e.has("stateObj")||n||t?"full":this._stateRef||this._stateGeom?void 0:"once"}updated(e){e.has("rig")&&(e.get("rig")?.sheet?.(this.renderRoot,!1),this.rig?.sheet?.(this.renderRoot,!0)),this._observe(this._animates&&this.isConnected);const t=this._readPlan;if(this._readPlan=void 0,!t||"once"===t&&this._readsPending)return;const i="full"===t?[0,50,300,1e3]:[0];this._stateTimers.forEach(clearTimeout),this._readsPending=!0,this._stateTimers=i.map((e,t)=>setTimeout(()=>{t===i.length-1&&(this._stateTimers=[],this._readsPending=!1),this._readStateIcon(),t===i.length-1&&this._holding&&this.requestUpdate()},e))}_readStateIcon(){const e=this.renderRoot.querySelector("ha-state-icon")?.shadowRoot;if(!e)return;const t=e.querySelector("ha-icon"),i="string"==typeof t?.icon&&t.icon||t?.getAttribute("icon")||void 0;let n;if(!i){const t=e.querySelector("ha-svg-icon"),i="string"==typeof t?.path?t.path.trim():"";i&&(n={paths:[i],viewBox:"string"==typeof t?.viewBox&&t.viewBox.trim()?t.viewBox.trim():"0 0 24 24"})}i===this._stateRef&&(n?.paths[0]??"")===(this._stateGeom?.paths[0]??"")||!i&&!n||(this._stateRef=i,this._stateGeom=n,this.requestUpdate())}render(){this._animates=!1;const e=this._geom,t="svg"===this.icon?"mdi:image-broken-variant":this.icon;return this._useState?n.qy`${e?this._svg(e):n.s6}<ha-state-icon
        ?hidden=${!!e}
        .hass=${this.hass}
        .stateObj=${this.stateObj}
        aria-hidden=${this.decorative?"true":n.s6}
      ></ha-state-icon>`:e?this._svg(e):n.qy`<ha-icon icon=${t||n.s6} aria-hidden=${this.decorative?"true":n.s6}></ha-icon>`}_svg(e){const t=this._fx??(0,y.Qh)(this.fx,{hass:this.hass,entity:this.entity,baseColor:"currentColor"}),i=this._rigOn?this.rig?.body?.(e):void 0,s=i?{...t,fill:void 0,draw:"off"}:t,r=!i&&void 0!==this._frame,a=r?{paths:[this._frame],secondary:e.secondary,viewBox:e.viewBox}:e,o=C(a.viewBox),l=this._ref,c=l?.startsWith("svg:")?(0,m.wV)(l):void 0,u=!!s.fill||"duotone"===s.colors.style&&!a.secondary?.length,p=a.strokes??[],f=`url(#${this._uid}-clip)`,g="gradient"===s.colors.style?this._gradient(s,o):void 0,v=g?`url(#${this._uid}-grad)`:s.colors.valueColor??s.colors.primary,b=!s.fill&&!!s.colors.valueMissing,w=s.device,k=!!w&&w.speed>0&&_.has(w.anim),S="loop"===s.draw&&!M(),T=S||!i&&this._drawing;this._animates=!!w&&w.speed>0||S;const E=[k?`dev dev-${w.anim}`:"",S?"mc-draw-loop":T?"mc-draw":""].filter(Boolean).join(" "),P=[k?$(w):"",T?`--mc-draw-dur: ${x(s.drawDuration)}s`:""].filter(Boolean).join("; "),z=["body",b?"dim":""].filter(Boolean).join(" "),L=n.JW`<g class=${z}>
        ${i?n.JW`<g style=${v.startsWith("url(")?`--mc-rig-fill: ${v}`:"currentColor"!==v?`--mc-rig-paint: ${A(v)}`:n.s6}>${h(i)}</g>`:r&&c?n.JW`${this._base(a,s,v,o)}<g class="morph-in">${this._ownSvg(c,e,s,v,o,!1)}</g>`:this._base(a,s,v,o,c)}
        ${s.fill?this._fill(s.fill,o,A(s.fill.color===s.colors.primary?v:s.fill.color),p.length?{mask:f}:{clip:f}):n.s6}
      </g>`;return n.qy`${d(this._drawSeq,n.qy`<svg part="svg" viewBox=${a.viewBox} aria-hidden="true" focusable="false"
      class=${E||n.s6} style=${P||n.s6}>
      ${u||g?n.JW`<defs>
            ${u?this._clip(a,o):n.s6}
            ${g??n.s6}
          </defs>`:n.s6}
      ${this._device(s,a,o,k,n.JW`${this._outs.map(e=>this._outgoing(e,o,s,v))}${void 0!==this._inStart?d(this._inSeq,n.JW`<g class="xfade-in">${L}</g>`):L}${T?this._drawLayer(a,o,v):n.s6}`)}
    </svg>`)}`}_outgoing(e,t,i,s){const r=C(e.g.viewBox),a=[e.ms!==k?`animation-duration: ${x(e.ms/1e3)}s`:"",e.skip>0?`animation-delay: ${x(-e.skip/1e3)}s`:""].filter(Boolean).join("; "),o="currentColor"!==s?`fill: ${A(s)}`:void 0;return n.JW`<svg class="xfade-out" aria-hidden="true" x=${x(t.x)} y=${x(t.y)} width=${x(t.w)} height=${x(t.h)}
      viewBox=${e.g.viewBox} overflow="visible" style=${a||n.s6}>${e.markup?this._ownSvg(e.markup,e.g,i,s,r,!1):n.JW`${(e.g.secondary??[]).map(e=>n.JW`<path class="secondary" d=${e} fill="currentColor" style=${o??n.s6}></path>`)}${e.g.paths.map(e=>n.JW`<path class="old" d=${e} fill="currentColor" style=${`fill: ${A(s)}`}></path>`)}${S(e.g.strokes??[],"currentColor",`stroke: ${A(s)}`,{cls:"old"})}`}</svg>`}_drawLayer(e,t,i){const s=x(t.w/24*1.2),r="currentColor"!==i?`stroke: ${A(i)}`:void 0;return n.JW`<g class="draw" aria-hidden="true">${[...e.secondary??[],...e.paths].map(e=>n.JW`<path d=${e} pathLength="1"
      fill="none" stroke="currentColor" stroke-width=${s} stroke-linecap="round" stroke-linejoin="round" style=${r??n.s6}></path>`)}${S(e.strokes??[],"currentColor",r,{pathLength:"1"})}</g>`}_clip(e,t){const i=`${this._uid}-clip`,s=[...e.paths,...e.secondary??[]];if(!e.strokes?.length)return n.JW`<clipPath id=${i}>${s.map(e=>n.JW`<path d=${e}></path>`)}</clipPath>`;const r=Math.max(...e.strokes.map(e=>e.width));return n.JW`<mask id=${i} maskUnits="userSpaceOnUse" x=${x(t.x-r)} y=${x(t.y-r)} width=${x(t.w+2*r)} height=${x(t.h+2*r)}>
      ${s.map(e=>n.JW`<path d=${e} fill="#fff"></path>`)}${S(e.strokes,"#fff")}
    </mask>`}_device(e,t,i,s,r){const a=e.device;if(!a)return r;const o=$(a),l=i.x+i.w/2,c=i.y+i.h/2,d=Math.min(i.w,i.h);let u=n.s6;if("snow"===a.anim){const e=[0,1,2,3,4,5].map(e=>{const t=i.x+i.w*(.14+.144*e),s=i.y+i.h*(.2+.37*e%.6);return n.JW`<circle cx=${x(t)} cy=${x(s)} r=${x(.05*d)} style=${`animation-delay: ${x(-e/6*(a.speed||1.5))}s`}></circle>`});u=n.JW`<g class="snow" style=${`${o}; --mc-snow-dy: ${x(.2*i.h)}px`}>${e}</g>`}else"pulse"===a.anim&&(u=n.JW`<circle class="ring" cx=${x(l)} cy=${x(c)} r=${x(.44*d)} style=${`${o}; stroke-width: ${x(.06*d)}`}></circle>`);if(s)return n.JW`${r}${u}`;const p=`dev dev-${a.anim}${a.speed>0?"":" dev-static"}`,[h,m]="swing"===a.anim?[i.x,c]:"flame"===a.anim||"eq"===a.anim?[l,i.y+i.h]:[l,c],f=`transform-box: view-box; transform-origin: ${x(h)}px ${x(m)}px`,g="glow"===a.anim?n.JW`<g class="glow-copy" aria-hidden="true" style=${`filter: blur(${x(.07*d)}px)`}>${[...t.secondary??[],...t.paths].map(e=>n.JW`<path d=${e}></path>`)}${S(t.strokes??[],"currentColor","stroke: var(--mc-icon-glow-color, currentColor)")}</g>`:n.s6,y=n.JW`<g class=${p} style=${`${o}; ${f}`}>${g}${r}</g>`;return"flame"===a.anim?n.JW`<g class="flame-glow" style=${o}>${y}</g>${u}`:n.JW`${y}${u}`}_base(e,t,i,s,r){const a=t.fill?.emptyColor;if(r)return this._ownSvg(r,e,t,i,s);if(a)return n.JW`${[...e.secondary??[],...e.paths].map((t,i)=>n.JW`<path class=${i<(e.secondary?.length??0)?"secondary duo":"primary"} d=${t}
        fill="currentColor" style=${`fill: ${a}`}></path>`)}`;const o=t.fill?x(t.fill.emptyOpacity):void 0,l="currentColor"!==i?`fill: ${i}`:void 0,c="duotone"===t.colors.style?t.colors.secondary:void 0;if(c&&!e.secondary?.length){const t=x(Math.min(s.w,s.h)/24*3);return n.JW`
        ${e.paths.map(e=>n.JW`<path class="primary duo-body" d=${e} fill="currentColor" fill-opacity=${o??n.s6} style=${`fill: ${c}`}></path>`)}
        ${e.paths.map(e=>n.JW`<path class="duo-line" d=${e} clip-path=${`url(#${this._uid}-clip)`} opacity=${o??n.s6}
          style=${`fill: none; stroke: ${A(i)}; stroke-width: ${t}`}></path>`)}`}return n.JW`
      ${(e.secondary??[]).map(e=>n.JW`<path class=${`${c?"secondary duo":"secondary"}${void 0!==this._frame?" morph-in":""}`} d=${e} fill="currentColor"
        fill-opacity=${o??n.s6} style=${c?`fill: ${c}`:l??n.s6}></path>`)}
      ${e.paths.map(e=>n.JW`<path class="primary" d=${e} fill="currentColor" fill-opacity=${o??n.s6} style=${l??n.s6}></path>`)}`}_ownSvg(e,t,i,s,r,a=!0){const o=i.fill?.emptyColor,l=i.colors.style,c="duotone"===l&&!t.secondary?.length,d=!!o||"solid"!==l,u=o||c?void 0:i.colors.secondary,p=d||"currentColor"===s?void 0:A(s),m=i.fill&&!o?x(i.fill.emptyOpacity):void 0,f=[p?`color: ${p}; fill: ${p}`:"",d?`--mc-own-fill: ${o??(c?i.colors.secondary:A(s))}; --mc-own-stroke: ${o??A(s)}`:"",u?`--mc-icon-accent: ${u}`:""].filter(Boolean).join("; "),g=["own",d?"painted":"",u?"accented":""].filter(Boolean).join(" "),y=x(Math.min(r.w,r.h)/24*3),v=a&&c&&!o&&!t.strokes?.length?t.paths.map(e=>n.JW`<path class="duo-line" d=${e} clip-path=${`url(#${this._uid}-clip)`} opacity=${m??n.s6}
          style=${`fill: none; stroke: ${A(s)}; stroke-width: ${y}`}></path>`):n.s6;return n.JW`<g class=${g} fill="currentColor" opacity=${m??n.s6} style=${f||n.s6}>${h(e)}</g>${v}`}_gradient(e,t){const i=e.colors.stops??[],s=e.colors.angle*Math.PI/180,r=Math.sin(s),a=Math.cos(s),o=(Math.abs(t.w*r)+Math.abs(t.h*a))/2,l=t.x+t.w/2,c=t.y+t.h/2;return n.JW`<linearGradient id=${`${this._uid}-grad`} gradientUnits="userSpaceOnUse"
      x1=${x(l-r*o)} y1=${x(c+a*o)} x2=${x(l+r*o)} y2=${x(c-a*o)}>
      ${i.map((e,t)=>n.JW`<stop offset=${x(i.length>1?t/(i.length-1):0)} stop-color=${e}></stop>`)}
    </linearGradient>`}_fill(e,t,i,s){if(void 0===e.level)return n.s6;const r=Math.max(0,e.level),a=T[e.direction],o=90===a||-90===a,l=o?t.h:t.w,c=o?t.w:t.h,d=t.x+t.w/2,u=t.y+t.h/2,p=d-l/2,h=u-c/2,m=e.wave&&r>0?.05*c*Math.min(1,Math.max(0,(.98-r)/.08)):0;m>0&&(this._animates=!0);const f=e=>n.JW`<g transform=${a?`rotate(${a} ${x(d)} ${x(u)})`:n.s6}>
        <g class="liquid" style=${`transform: translateY(${x((1-r)*c)}px)`}>
          <rect x=${x(p-l)} y=${x(h+m/2)} width=${x(3*l)} height=${x(2*c)} style=${`fill: ${e}`}></rect>
          ${m>0?(e=>{let t=`M${x(p)} ${x(h)}`;for(let e=0;e<4;e++){const i=p+e*l/2;t+=`Q${x(i+l/4)} ${x(h+(e%2?m:-m))} ${x(i+l/2)} ${x(h)}`}return t+=`V${x(h+m+.5)}H${x(p)}Z`,n.JW`<path class="wave" d=${t} style=${`fill: ${e}; --mc-wave-dx: ${x(-l)}px`}></path>`})(e):n.s6}
        </g>
      </g>`;return i.startsWith("url(")?n.JW`<g class="fill" clip-path=${s.clip??n.s6} mask=${s.mask??n.s6}>
      <mask id=${`${this._uid}-liquid`} maskUnits="userSpaceOnUse" x=${x(t.x)} y=${x(t.y)} width=${x(t.w)} height=${x(t.h)}>${f("#fff")}</mask>
      <rect class="paint" x=${x(t.x)} y=${x(t.y)} width=${x(t.w)} height=${x(t.h)} mask=${`url(#${this._uid}-liquid)`} style=${`fill: ${i}`}></rect>
    </g>`:n.JW`<g class="fill" clip-path=${s.clip??n.s6} mask=${s.mask??n.s6}>${f(i)}</g>`}};function P(e){return!(!e||"object"!=typeof e)&&(!(!e.fill||"object"!=typeof e.fill)||(!(!e.device||"off"===e.device)||(!(!e.draw||"off"===e.draw)||(!0===e.morph||!!e.colors&&"object"==typeof e.colors&&Object.keys(e.colors).length>0))))}function z(e){const t="svg"!==e.icon||e.svg?e:{...e,icon:e.fallbackIcon||"mdi:help",useEntityIcon:e.useEntityIcon||!!e.entity},i=t.className??"",a=(0,s.hZ)(t.hass,t.entity,t.iconOn,t.iconOff),o=!a&&!!t.useEntityIcon&&!!t.entity,l="svg"===t.icon&&!!t.svg,c=t.rig??("icon"===t.part?(0,r.V)()?.iconRig:void 0);if(!P(t.fx)&&!l&&!c){const e=t.part??n.s6;return a?n.qy`<ha-icon class=${i} data-mc-part=${e} .icon=${a}></ha-icon>`:o?(0,s.TO)(t.hass,t.entity,t.icon??"",i,t.part):n.qy`<ha-icon class=${i} data-mc-part=${e} .icon=${t.icon}></ha-icon>`}const d=a??(o&&(0,s.fq)(t.hass,t.entity)||t.icon),u=o&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?t.hass?.states?.[t.entity]:void 0;return n.qy`<mc-svg-icon
    class=${i}
    data-mc-part=${t.part??n.s6}
    style=${t.color?`color: ${t.color}`:n.s6}
    aria-hidden=${t.ariaHidden?"true":n.s6}
    aria-label=${t.ariaLabel||n.s6}
    role=${t.ariaLabel?"img":n.s6}
    .decorative=${!!t.ariaHidden||!!t.ariaLabel}
    .hass=${t.hass}
    .icon=${d}
    .entity=${t.entity}
    .fx=${t.fx}
    .iconOn=${t.iconOn}
    .iconOff=${t.iconOff}
    .svg=${t.svg}
    .stateObj=${u}
    .rig=${c}
  ></mc-svg-icon>`}E.styles=f,b([(0,a.MZ)({attribute:!1})],E.prototype,"hass",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"icon",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"entity",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"fx",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"iconOn",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"iconOff",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"svg",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"stateObj",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"decorative",void 0),b([(0,a.MZ)({attribute:!1})],E.prototype,"rig",void 0),E=b([(0,a.EM)("mc-svg-icon")],E)},1887(e,t,i){i.d(t,{OW:()=>P});var n=i(4205);const s="0 0 24 24",r=e=>new Map(e.map(e=>[e.toLowerCase(),e])),a=r(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),o=r(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"]),l=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),c=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]),d=/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,u=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),p=new Set(["matrix","translate","scale","rotate","skewx","skewy"]),h=new Set(["transform","gradientTransform"]);function m(e,t){const i=e.match(/\(/g)?.length??0,n=[...e.matchAll(/([a-z-]+)\s*\(/gi)];return n.length===i&&n.every(e=>t.has(e[1].toLowerCase()))}function f(e,t){const i=t.trim();if(!/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i.test(i)){if(h.has(e))return m(i,p)?t:void 0;if(m(i.replace(d,""),u)){if("id"===e)return/^[\w.:-]+$/.test(i)?i:void 0;if("class"===e){const e=i.split(/\s+/).filter(e=>/^[\w-]+$/.test(e));return e.length?e.join(" "):void 0}return t}}}const g=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),y=e=>"mc-accent"!==e&&(g.has(e)||/^(mc-|dev-|xfade-)/.test(e))?`u-${e}`:e,v=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),b=e=>String(+e.toFixed(3)),w=e=>{if(null==e||/%/.test(e))return;const t=parseFloat(e);return Number.isFinite(t)?t:void 0},x=[1,0,0,1,0,0],_=(e,t)=>[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]];function $(e){let t=x;if(!e)return t;for(const[,i,n]of e.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const e=n.split(/[\s,]+/).filter(Boolean).map(Number);if(e.some(e=>!Number.isFinite(e)))continue;let s=x;switch(i){case"matrix":6===e.length&&(s=e);break;case"translate":s=[1,0,0,1,e[0]??0,e[1]??0];break;case"scale":s=[e[0]??1,0,0,e[1]??e[0]??1,0,0];break;case"rotate":{const t=(e[0]??0)*Math.PI/180,[i,n]=[e[1]??0,e[2]??0],r=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];s=_(_([1,0,0,1,i,n],r),[1,0,0,1,-i,-n]);break}case"skewX":s=[1,0,Math.tan((e[0]??0)*Math.PI/180),1,0,0];break;case"skewY":s=[1,Math.tan((e[0]??0)*Math.PI/180),0,1,0,0]}t=_(t,s)}return t}function k(e,t){if((e=>e.every((e,t)=>Math.abs(e-x[t])<1e-9))(t))return e;const i=e=>[t[0]*e[0]+t[2]*e[1]+t[4],t[1]*e[0]+t[3]*e[1]+t[5]];return(0,n.ER)((0,n.Mj)(e).map(e=>e.map(e=>e.map(i))))}function M(e,t){const i=t=>w(e.getAttribute(t));switch(t){case"path":{const t=e.getAttribute("d")?.trim();return t||void 0}case"circle":case"ellipse":{const e=i("cx")??0,n=i("cy")??0,s="circle"===t?i("r"):i("rx")??i("ry"),r="circle"===t?s:i("ry")??i("rx");if(!s||!r||s<=0||r<=0)return;const a=`A${b(s)} ${b(r)} 0 1 0`;return`M${b(e-s)} ${b(n)}${a} ${b(e+s)} ${b(n)}${a} ${b(e-s)} ${b(n)}Z`}case"rect":{const e=i("x")??0,t=i("y")??0,n=i("width"),s=i("height");if(!n||!s||n<=0||s<=0)return;let r=i("rx")??i("ry")??0,a=i("ry")??i("rx")??0;if(r=Math.min(Math.max(r,0),n/2),a=Math.min(Math.max(a,0),s/2),!r||!a)return`M${b(e)} ${b(t)}H${b(e+n)}V${b(t+s)}H${b(e)}Z`;const o=`A${b(r)} ${b(a)} 0 0 1`;return`M${b(e+r)} ${b(t)}H${b(e+n-r)}${o} ${b(e+n)} ${b(t+a)}V${b(t+s-a)}${o} ${b(e+n-r)} ${b(t+s)}H${b(e+r)}${o} ${b(e)} ${b(t+s-a)}V${b(t+a)}${o} ${b(e+r)} ${b(t)}Z`}case"line":return`M${b(i("x1")??0)} ${b(i("y1")??0)}L${b(i("x2")??0)} ${b(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(e){const t=(e??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let e=0;e+1<t.length;e+=2)Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&i.push([t[e],t[e+1]]);return i}(e.getAttribute("points"));if(i.length<2)return;return`M${i.map(([e,t])=>`${b(e)} ${b(t)}`).join("L")}${"polygon"===t?"Z":""}`}}}const S="The SVG is too complex.",C=e=>({markup:"",viewBox:s,paths:[],accentPaths:[],strokes:[],error:e}),T={fill:!0,stroke:!1,width:1},A=/^(none|transparent)$/i;function E(e,t){const i=t=>{const i=e.getAttribute(t);return null===i?void 0:f(t,i)?.trim()},n=i("fill"),s=i("stroke"),r=w(i("stroke-width")),a=i("stroke-linecap"),o=i("stroke-linejoin"),l=i("fill-rule");return{evenodd:void 0===l?t.evenodd:"evenodd"===l,fill:void 0===n?t.fill:!A.test(n),stroke:void 0===s?t.stroke:!A.test(s),width:void 0!==r&&r>=0?r:t.width,cap:a&&/^(butt|round|square)$/.test(a)?a:t.cap,join:o&&/^(miter|round|bevel|arcs|miter-clip)$/.test(o)?o:t.join}}function P(e){const t="string"==typeof e?e:"";if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>32768)return C("The SVG is larger than 32 KB.");const i=function(e){if("undefined"==typeof DOMParser)return;const t=new DOMParser;try{const i=t.parseFromString(e,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return n}catch{}return[...t.parseFromString(e,"text/html").getElementsByTagName("*")].find(e=>"svg"===e.localName.toLowerCase())}(t);if(!i)return C("No <svg> element found.");const n=function(e){const t=(e.getAttribute("viewBox")??e.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0)return t.map(b).join(" ");const i=w(e.getAttribute("width")),n=w(e.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${b(i)} ${b(n)}`:s}(i),r=[],d=[],u=[],p={},h=(e,t,i=[])=>{let n="",s="";for(const i of[...e.attributes]){const e=o.get(i.name.toLowerCase());if(!e||i.name.includes(":"))continue;if(t&&("viewBox"===e||"width"===e||"height"===e))continue;const r=f(e,i.value);void 0!==r&&("class"===e?s=r.split(" ").map(y).join(" "):n+=` ${e}="${v(r)}"`)}const r=[s,...i].filter(Boolean).join(" ");return r?` class="${v(r)}"${n}`:n};let m=!1;const g=(e,t,i,n,s,o)=>{if(o>64||m)return m=!0,"";const y=a.get(e.localName.toLowerCase());if(!y||"svg"===y)return"";if("title"===y)return`<title>${v=e.textContent??"",v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</title>`;var v;const b=_(t,$(f("transform",e.getAttribute("transform")??"")??null)),w=n||(e.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),x=i&&!c.has(y),S=E(e,s),C=[];if(x&&l.has(y)){const t=M(e,y);if(t){const e=k(t,b);if(S.fill&&"line"!==y){const t=w?d:r;S.evenodd&&(w?p.accent??=[]:p.paths??=[]).push(t.length),t.push(e),C.push("mc-f")}if(S.stroke&&S.width>0){const t=+(S.width*Math.sqrt(Math.abs(b[0]*b[3]-b[1]*b[2]))).toFixed(3);u.push({d:e,width:t,...S.cap?{cap:S.cap}:{},...S.join?{join:S.join}:{},...w?{accent:!0}:{}}),C.push("mc-s")}}}const T=[...e.children].map(e=>g(e,b,x,w,S,o+1)).join("");return`<${y}${h(e,!1,C)}>${T}</${y}>`},x=$(f("transform",i.getAttribute("transform")??"")??null),A=E(i,T),P=[...i.children].map(e=>g(e,x,!0,!1,A,1)).join("");return m?C(S):r.length||d.length||u.length?{markup:`<svg viewBox="${n}"${h(i,!0)}>${P}</svg>`,viewBox:n,paths:r,accentPaths:d,strokes:u,...p.paths||p.accent?{evenodd:p}:{}}:C("The SVG has no shapes to draw.")}i.d(t,["kk",0,S])},1775(e,t,i){i.d(t,{bE:()=>g,GC:()=>y,S1:()=>p});var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(7812),l=i(7921);class c extends l.Kq{constructor(e){if(super(e),this._ms=6e4,e.type!==l.OA.CHILD)throw new Error("tickingText: child position only")}render(e,t){return e()}update(e,[t,i]){this._text=t,i===this._ms&&void 0!==this._timer||(this._ms=i,this._schedule());const s=t();return s===this._shown?n.c0:(this._shown=s,s)}_clear(){void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}_schedule(){if(this._clear(),!(this.isConnected&&this._ms>0))return;const e=this._ms-Date.now()%this._ms+20;this._timer=setTimeout(()=>{this._timer=void 0,this._tick(),this._schedule()},e)}_tick(){const e=this._text?.();void 0!==e&&e!==this._shown&&(this._shown=e,this.setValue(e))}disconnected(){this._clear()}reconnected(){this._tick(),this._schedule()}}const d=(0,l.u$)(c),u={short:{weekday:"short",month:"short",day:"numeric"},medium:{month:"short",day:"numeric",year:"numeric"},long:{weekday:"long",month:"long",day:"numeric",year:"numeric"},numeric:{year:"numeric",month:"numeric",day:"numeric"}},p=e=>Object.prototype.hasOwnProperty.call(u,e);function h(e,t,i){const n=(0,o.cj)(e),s=n?{...i,timeZone:n}:i,r=(0,o.XN)(e)??(new Intl.DateTimeFormat).resolvedOptions().locale;try{return new Intl.DateTimeFormat(`${r.split("-u-")[0]}-u-${t}`,s)}catch{return new Intl.DateTimeFormat(`en-u-${t}`,s)}}function m(e,t,i){const n=function(e,t){const i={},n=h(t,"ca-gregory-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});for(const t of n.formatToParts(e))i[t.type]=t.value;const s=i=>h(t,"ca-gregory",i).format(e),r=e=>String(Number(e)||0);return{year:r(i.year),month:r(i.month),day:r(i.day),weekdayLong:()=>s({weekday:"long"}),weekdayShort:()=>s({weekday:"short"}),monthLong:()=>s({month:"long"}),monthShort:()=>s({month:"short"})}}(e,i),s=e=>e.padStart(2,"0");return t.replace(f,(e,t)=>{if(void 0!==t)return t;switch(e){case"YYYY":return n.year;case"YY":return n.year.slice(-2);case"MMMM":return n.monthLong();case"MMM":return n.monthShort();case"MM":return s(n.month);case"M":return n.month;case"dddd":return n.weekdayLong();case"ddd":return n.weekdayShort();case"DD":return s(n.day);default:return n.day}})}const f=/\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g;function g(e){const t=(e??"").trim();return"full"===t?"long":p(t)||"iso"===t?t:-1===t.search(f)?"short":t}function y(e,t,i){const n=g(t);return p(n)?(0,o.LE)(i,u[n]).format(e):m(e,"iso"===n?"YYYY-MM-DD":n,i)}class v extends s.l{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}createDefault(){return{id:(0,a.$)("clock"),type:"clock",show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const i=e,s=i.show_seconds?1e3:6e4;return n.qy`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${d(()=>function(e,t,i){const n=t.format_12h??(0,o.oE)(i),s={hour:n?"numeric":"2-digit",minute:"2-digit",hourCycle:n?"h12":"h23"};return t.show_seconds&&(s.second="2-digit"),(0,o.LE)(i,s).format(e)}(new Date,i,t),s)}</span>
        ${!1!==i.show_date?n.qy`<span class="mc-clock-date">${d(()=>y(new Date,i.date_format,t),6e4)}</span>`:n.s6}
      </div>
    `}}r.s.register(new v)},22(e,t,i){i.d(t,{IC:()=>p,_Y:()=>m,cy:()=>u});var n=i(6161),s=i(5707),r=i(866),a=i(5486),o=i(5173),l=i(9307),c=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let d=null;function u(){const e=window.loadCardHelpers;if("function"==typeof e)return d||(d=Promise.resolve(e()).catch(e=>{throw d=null,e})),d}function p(e){if(customElements.get(e))return Promise.resolve();let t;return Promise.race([customElements.whenDefined(e),new Promise((i,n)=>{t=setTimeout(()=>n(new Error(`Timeout waiting for ${e}`)),5e3)})]).finally(()=>clearTimeout(t))}const h=e=>"hui-error-card"===e.localName||e.classList.contains("mc-embedded-error");function m(e){const t=e=>Array.isArray(e)?e.map(t):e&&"object"==typeof e?Object.fromEntries(Object.keys(e).sort().map(i=>[i,t(e[i])])):e;return JSON.stringify(t(e))??""}const f=(e,t)=>({...t||{},type:e});let g=class extends n.WF{constructor(){super(...arguments),this.preview=!1,this.editMode=!1,this._generation=0}updated(e){if(e.has("cardType")&&this.cardType!==this._currentCardType)this._createElement();else{if(e.has("cardConfig")&&this._element&&this.cardType){const e=f(this.cardType,this.cardConfig),t=JSON.stringify(e);if(t!==this._configHash){this._configHash=t;const i=this._element;if("function"!=typeof i.setConfig||h(i))return void this._createElement();try{i.setConfig(e)}catch{return void this._createElement()}}}this._element&&this.hass&&(this._element.hass=this.hass),this._element&&(e.has("preview")||e.has("editMode"))&&this._applyModes(this._element)}}_applyModes(e){const t=e;t.preview=this.preview,t.editMode=this.editMode}async _createElement(){const e=++this._generation,t=this.renderRoot.querySelector(".mc-embedded-container");if(!t)return;if(this._currentCardType=this.cardType,!this.cardType)return this._element=void 0,this._configHash=void 0,void t.replaceChildren();let i,n=f(this.cardType,this.cardConfig);try{i=await async function(e){const t=u();if(t)return(await t).createCardElement(e);const i=String(e.type??"");if(!i.startsWith("custom:"))throw new Error("Home Assistant card helpers are not available");const n=i.slice(7);await p(n);const s=document.createElement(n);return s.setConfig?.(e),s}(n)}catch(e){i=function(e,t){if(customElements.get("hui-error-card")){const i=document.createElement("hui-error-card");try{return i.setConfig?.({type:"error",error:e,origConfig:t}),i}catch{}}const i=document.createElement("div");return i.className="mc-embedded-error",i.setAttribute("role","alert"),i.textContent=e,i}(`Failed to load "${this.cardType}": ${e instanceof Error?e.message:String(e)}`,n)}if(e!==this._generation)return;const s=f(this.cardType??"",this.cardConfig);if(JSON.stringify(s)!==JSON.stringify(n)){if(h(i))return void this._createElement();n=s;try{i.setConfig?.(n)}catch{}}this.hass&&(i.hass=this.hass),this._applyModes(i),this._configHash=JSON.stringify(n),i.addEventListener("ll-rebuild",e=>{e.stopPropagation(),this._element===i&&this._createElement()}),t.replaceChildren(i),this._element=i}firstUpdated(){this.cardType&&this._createElement()}render(){return n.qy`${!this._element&&this.cardType?n.qy`<div class="mc-embedded-loading">Loading card...</div>`:n.s6}<div class="mc-embedded-container"></div>`}};g.styles=n.AH`
    :host { display: block; }
    .mc-embedded-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 60px;
      color: var(--secondary-text-color, #6b7280);
      font-size: 0.875rem;
    }
    .mc-embedded-error {
      color: var(--error-color, #ef4444);
      padding: 8px;
      font-size: 0.875rem;
    }
  `,c([(0,s.MZ)({attribute:!1})],g.prototype,"hass",void 0),c([(0,s.MZ)({type:String,attribute:"card-type"})],g.prototype,"cardType",void 0),c([(0,s.MZ)({attribute:!1})],g.prototype,"cardConfig",void 0),c([(0,s.MZ)({attribute:!1})],g.prototype,"preview",void 0),c([(0,s.MZ)({attribute:!1})],g.prototype,"editMode",void 0),c([(0,s.wk)()],g.prototype,"_element",void 0),g=c([(0,s.EM)("mc-embedded-card")],g);class y extends r.l{constructor(){super(...arguments),this.metadata={type:"custom-card",name:"Custom card",description:"Embed any 3rd party Lovelace card",category:"advanced",icon:"mdi:card-plus-outline"}}createDefault(){return{id:(0,o.$)("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}renderPreview(e,t){const i=e,s=(0,l.V)();return i.card_type?n.qy`
      <div class="mc-module mc-custom-card">
        <mc-embedded-card
          card-type=${i.card_type}
          .cardConfig=${i.card_config||{}}
          .hass=${t}
          .preview=${!!s?.preview}
          .editMode=${!!s?.editMode}
        ></mc-embedded-card>
      </div>
    `:n.qy`
        <div class="mc-module mc-custom-card mc-custom-card-placeholder">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span>No card type set</span>
        </div>
      `}getDependencies(){return{forwardHass:!0}}validate(e){const t=e;return void 0===t.card_config||"object"==typeof t.card_config&&null!==t.card_config&&!Array.isArray(t.card_config)?[]:["Card config must be a mapping"]}}a.s.register(new y),i.d(t,["k2",0,f])},866(e,t,i){i.d(t,{l:()=>n});class n{validate(e){return[]}}},9842(e,t,i){var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(5217),l=i(9307),c=i(3722),d=i(4099),u=i(22);const p="ha-camera-stream";let h;const m=new Set;const f=e=>1e3*(Number(e.refresh_interval)>0?Number(e.refresh_interval):10);class g extends s.l{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:camera-outline"}}createDefault(){return{id:(0,a.$)("camera"),type:"camera",aspect_ratio:"16:9",camera_view:"live",show_controls:!0}}getDependencies(e,t){const i=e;if(!i.entity)return{};return"live"===i.camera_view&&!t?.editMode&&"undefined"!=typeof customElements&&!!customElements.get(p)?{}:{refreshInterval:f(i)}}_snapshot(e,t,i,s){const r=i.attributes.entity_picture;if("string"!=typeof r||!r)return this._fallback(s,"mdi:cctv-off");const a=(0,c.x2)((0,c.aN)(t,r),f(e));return n.qy`<img class="mc-camera-snapshot" src=${a} alt=${s} />`}_fallback(e,t="mdi:cctv"){return n.qy`<div class="mc-camera-fallback"><ha-icon icon=${t}></ha-icon>${e}</div>`}renderPreview(e,t){const i=e,s=i.entity&&t?t.states[i.entity]:void 0,r=s?(0,d.tX)(t,s):i.entity||"No camera",a=(0,l.V)();let f;var g,y;return f=s?(0,d.Pd)(s)?this._fallback(`${r}: ${t.formatEntityState?.(s)||s.state}`,"mdi:cctv-off"):"live"!==i.camera_view||a?.editMode||(g=s.entity_id,y=a?.requestUpdate,"undefined"==typeof customElements||!customElements.get(p)&&(y&&m.add(y),h||(h=(async()=>{const e=(0,u.cy)();if(!e)return;let t;(await e).createCardElement({type:"picture-glance",entities:[],camera_image:g}),await Promise.race([customElements.whenDefined(p),new Promise(e=>{t=setTimeout(e,1e4)})]).finally(()=>clearTimeout(t))})().catch(()=>{}).then(()=>{if(!customElements.get(p))return;(0,o.p)();const e=[...m];m.clear(),e.forEach(e=>e())})),1))?this._snapshot(i,t,s,r):n.qy`<ha-camera-stream
        class="mc-camera-stream"
        .hass=${t}
        .stateObj=${s}
        .controls=${!1!==i.show_controls}
        .muted=${!0}
        .fitMode=${"cover"}
        allow-exoplayer
      ></ha-camera-stream>`:this._fallback(r),n.qy`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(0,c.XK)(i.aspect_ratio)}">${f}</div>
    `}}r.s.register(new g)},1103(e,t,i){i.d(t,{S:()=>p});var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(4099),l=i(3884),c=i(8521),d=i(7643),u=i(7945);function p(e){return void 0===e.show_name&&void 0===e.show_state?{name:!0,state:!0}:{name:!!e.show_name,state:!!e.show_state}}class h extends s.l{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:(0,a.$)("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const i=e,s=i.entity&&t?t.states[i.entity]:void 0;let{name:r,state:a}=p(i);r||a||i.secondary_info||(a=!0),r||a||s||(r=!0);const h=s?(0,o.tX)(t,s):i.entity||"No entity";let m="—";if(s&&!i.attribute&&void 0!==(0,d.HF)(s))m=(0,u.q)(s);else if(s){const e=(0,o.Ai)(t,s,i.attribute||void 0);m=!1===i.show_unit?e.value:e.text}const f=s&&i.secondary_info?(0,o.Ai)(t,s,i.secondary_info).text:"",g=n.qy`
      ${r?n.qy`<span class="mc-info-name" data-mc-part="name">${h}</span>`:n.s6}
      ${a?n.qy`<span class="mc-info-state" data-mc-part="state">${i.prefix||""}${m}${i.suffix||""}</span>`:n.s6}
      ${f?n.qy`<span class="mc-info-secondary">${f}</span>`:n.s6}
    `;if(!i.show_icon)return n.qy`<div class="mc-module mc-info">${g}</div>`;const y=(0,l.s)({icon:i.icon||"mdi:information-outline",entity:i.entity,hass:t,useEntityIcon:!i.icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:information-outline"}),v=s?(0,c.id)(s):void 0;return n.qy`
      <div class="mc-module mc-info mc-info--icon">
        <span class="mc-info-icon" style=${v?`color: var(--mc-design-color, ${v})`:n.s6}>${y}</span>
        <div class="mc-info-text">${g}</div>
      </div>
    `}}r.s.register(new h)},8465(e,t,i){i.d(t,{P7:()=>f,XZ:()=>m,a5:()=>g,fA:()=>h});var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(1831),l=i(4824),c=i(5963),d=i(4099);const u={input_select:{"":{list:"options",service:"select_option",field:"option"}},select:{"":{list:"options",service:"select_option",field:"option"}},input_text:{"":{list:"",service:"set_value",field:"value"}},text:{"":{list:"",service:"set_value",field:"value"}},climate:{"":{list:"hvac_modes",service:"set_hvac_mode",field:"hvac_mode"},preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"},fan_mode:{current:"fan_mode",list:"fan_modes",service:"set_fan_mode",field:"fan_mode"},swing_mode:{current:"swing_mode",list:"swing_modes",service:"set_swing_mode",field:"swing_mode"}},fan:{preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"}},light:{effect:{current:"effect",list:"effect_list",service:"turn_on",field:"effect"}},media_player:{source:{current:"source",list:"source_list",service:"select_source",field:"source"},sound_mode:{current:"sound_mode",list:"sound_mode_list",service:"select_sound_mode",field:"sound_mode"}},water_heater:{operation_mode:{current:"operation_mode",list:"operation_list",service:"set_operation_mode",field:"operation_mode"}},humidifier:{mode:{current:"mode",list:"available_modes",service:"set_mode",field:"mode"}}},p={fan:"preset_mode",light:"effect",media_player:"source",water_heater:"operation_mode",humidifier:"mode"};function h(e,t){const i=u[e.entity_id.split(".")[0]];if(i)return t?i[t]:i[""]??i[p[e.entity_id.split(".")[0]]]}function m(e){return e?Object.keys(u[e.split(".")[0]]??{}).filter(Boolean):[]}function f(e,t,i){if(!e||!t)return[];if(!t.list)return i.map(e=>e.value);const n=e.attributes?.[t.list];return Array.isArray(n)?n.map(String):[]}function g(e){if(!Array.isArray(e))return[];const t=e.map(e=>"string"==typeof e||"number"==typeof e?{label:String(e),value:String(e)}:e&&"object"==typeof e?{label:String(e.label??e.value??""),value:String(e.value??e.label??"")}:void 0).filter(e=>!!e&&""!==e.value);return(e=>3===e.length&&e.every((e,t)=>e.label===`Option ${t+1}`&&e.value===`option_${t+1}`))(t)?[]:t}class y extends s.l{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:(0,a.$)("dropdown"),type:"dropdown"}}_optionLabel(e,t,i,n){try{return(i.current?e?.formatEntityAttributeValue?.(t,i.current,n):e?.formatEntityState?.(t,n))||n}catch{return n}}renderPreview(e,t){const i=e,s=i.entity&&t?t.states[i.entity]:void 0,r=s?h(s,i.attribute):void 0,a=g(i.options),u=f(s,r,a),p=!!s&&("unavailable"===s.state||"unknown"===s.state);let m;m=a.length?a.map(e=>({...e,disabled:!(!s||r&&u.includes(e.value))})):s&&r?u.map(e=>({label:this._optionLabel(t,s,r,e),value:e})):[];const y=s?r?.current?String(s.attributes?.[r.current]??""):i.attribute?String(s.attributes?.[i.attribute]??""):s.state:void 0,v=void 0!==y&&m.some(e=>e.value===y),b=s&&y?r?this._optionLabel(t,s,r,y):y:"",w=!(!s||!r||p||!t),x=s?(0,d.tX)(t,s):"Dropdown";return n.qy`
      <div class="mc-module mc-dropdown">
        <select
          aria-label=${x}
          ?disabled=${!w}
          @change=${e=>{e.stopPropagation();const i=e.target,n=i.value;if(!(w&&s&&r&&t&&u.includes(n)))return void(i.value=v?y:"");const a={domain:s.entity_id.split(".")[0],service:r.service,data:{entity_id:s.entity_id,[r.field]:n}};(0,o.Bw)(t,a)}}
          @click=${c.i}
          @pointerdown=${c.i}
          @pointerup=${c.i}
          @keydown=${c.i}
        >
          ${!v&&s?n.qy`<option value="" disabled selected hidden>${p?t?.formatEntityState?.(s)??s.state:b}</option>`:n.s6}
          ${m.length>0?m.map(e=>n.qy`<option value=${e.value} ?disabled=${e.disabled} ?selected=${y===e.value}>${e.label}</option>`):n.qy`<option disabled ?selected=${!s}>No options</option>`}
          ${s&&m.length?(0,l.m)(v?y:""):n.s6}
        </select>
      </div>
    `}}r.s.register(new y)},2134(e,t,i){i.d(t,{Q:()=>g});var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(1831),l=i(8521),c=i(3884),d=i(4099),u=i(5441),p=i(5963),h=i(4824),m=i(9307);const f=e=>Math.max(0,Math.min(255,Math.round(e))).toString(16).padStart(2,"0");function g(e){const t=e.attributes?.effect_list;return Array.isArray(t)&&t.length>0&&!!(4&Number(e.attributes?.supported_features??4))}class y extends s.l{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb-outline"}}createDefault(){return{id:(0,a.$)("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(e,t){const i=e,s=i.entity&&t?t.states[i.entity]:void 0,r=(0,m.V)(),a=!s||"unavailable"===s.state||"unknown"===s.state,y=!!s&&!!t&&!a,v="on"===s?.state,b=s?(0,d.tX)(t,s):i.entity||"Light",w=()=>r?.requestUpdate(),x=(0,u.vh)(i.entity,"brightness","light"),_=s?(0,u.jb)(x,(0,o.pR)(s))??(0,o.pR)(s):void 0,$=(0,u.vh)(i.entity,"color_temp_kelvin","light"),k=s&&v?(0,o.wu)(s):void 0,M=s?(0,u.jb)($,k)??k:void 0,S=s?(0,o.Vb)(s):{min:2e3,max:6500};let C;C=s?v&&void 0!==_&&(0,o.c9)(s)?`${(0,d.gn)(t,_,0)}%`:t?.formatEntityState?.(s)??s.state:"Off";const T=`var(--mc-design-color, ${s&&(0,l.id)(s)||"var(--state-icon-color, #9e9e9e)"})`,A=!1!==i.show_brightness&&(!s||(0,o.c9)(s)),E=i.show_color_temp&&(!s||(0,o.eI)(s)),P=i.show_color&&(!s||(0,o.Aw)(s)),z=i.show_effect&&!!s&&g(s),L=z?s.attributes.effect_list.map(String):[],O=s?.attributes?.effect,q=(0,c.s)({icon:i.icon&&"svg"!==i.icon?i.icon:"mdi:lightbulb",entity:i.entity,hass:t,useEntityIcon:!i.icon||"svg"===i.icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg});return n.qy`
      <div class="mc-module mc-light ${i.compact?"mc-light--compact":""}">
        <div class="mc-light-header">
          <button
            type="button"
            class="mc-light-toggle"
            style="color: ${T};"
            aria-label=${`Toggle ${b}`}
            aria-pressed=${v?"true":"false"}
            ?disabled=${!y}
            @click=${e=>{e.stopPropagation(),y&&i.entity&&(0,o.Bw)(t,(0,o.H3)(t,i.entity))}}
            @pointerdown=${p.i}
            @pointerup=${p.i}
            @keydown=${p.i}
          >${q}</button>
          ${i.compact?n.qy`<span class="mc-light-name--compact" data-mc-part="name">${b}</span>`:n.qy`
                <div class="mc-light-info">
                  <div class="mc-light-name" data-mc-part="name">${b}</div>
                  <div class="mc-light-secondary" data-mc-part="state">${C}</div>
                </div>
              `}
        </div>

        ${A?n.qy`
              <div class="mc-light-control mc-light-brightness">
                <ha-icon .icon=${"mdi:brightness-6"}></ha-icon>
                ${(0,p.E)({value:_??0,min:0,max:100,step:1,disabled:!y,label:`${b} brightness`,valueText:`${_??0}%`,style:"--mc-slider-color: var(--state-light-active-color, #fdd835);",onCommit:e=>{y&&(0,u.n_)(x,e,(0,o.pR)(s),e=>(0,o.Bw)(t,e<=0?{domain:"light",service:"turn_off",data:{entity_id:i.entity}}:{domain:"light",service:"turn_on",data:{entity_id:i.entity,brightness_pct:Math.round(e)}}),w,300)}})}
                <span class="mc-light-value">${_??0}%</span>
              </div>
            `:n.s6}

        ${E?n.qy`
              <div class="mc-light-control mc-light-color-temp">
                <ha-icon .icon=${"mdi:thermometer"}></ha-icon>
                ${(0,p.E)({value:M,min:S.min,max:S.max,step:50,disabled:!y,label:`${b} color temperature`,valueText:void 0!==M?`${(0,d.gn)(t,M,0)} K`:void 0,style:"--mc-slider-color: var(--mc-light-color-temp);",onCommit:e=>{y&&(0,u.n_)($,e,k,e=>(0,o.Bw)(t,{domain:"light",service:"turn_on",data:{entity_id:i.entity,color_temp_kelvin:Math.round(e)}}),w,300)}})}
                <span class="mc-light-value">${void 0!==M?`${(0,d.gn)(t,M,0)} K`:""}</span>
              </div>
            `:n.s6}

        ${P?n.qy`
              <div class="mc-light-control mc-light-color">
                <ha-icon .icon=${"mdi:palette"}></ha-icon>
                <input
                  type="color"
                  class="mc-light-color-input"
                  aria-label=${`${b} color`}
                  .value=${function(e){const t=e?.attributes?.rgb_color;if(Array.isArray(t)&&t.length>=3&&t.every(e=>"number"==typeof e))return`#${f(t[0])}${f(t[1])}${f(t[2])}`;const i=e?(0,l.id)(e):void 0,n=i?.match(/^rgb\((\d+), (\d+), (\d+)\)$/);return n?`#${f(+n[1])}${f(+n[2])}${f(+n[3])}`:"#ffffff"}(s)}
                  ?disabled=${!y}
                  @change=${e=>{if(e.stopPropagation(),!y)return;const n=e.target.value;(0,o.Bw)(t,{domain:"light",service:"turn_on",data:{entity_id:i.entity,rgb_color:[1,3,5].map(e=>parseInt(n.slice(e,e+2),16))}})}}
                  @click=${p.i}
                  @pointerdown=${p.i}
                  @pointerup=${p.i}
                  @keydown=${p.i}
                />
              </div>
            `:n.s6}

        ${z?n.qy`
              <div class="mc-light-control mc-light-effect">
                <ha-icon .icon=${"mdi:creation"}></ha-icon>
                <select
                  class="mc-light-effect-select"
                  aria-label=${`${b} effect`}
                  ?disabled=${!y}
                  @change=${e=>{e.stopPropagation();const n=e.target.value;y&&L.includes(n)&&(0,o.Bw)(t,{domain:"light",service:"turn_on",data:{entity_id:i.entity,effect:n}})}}
                  @click=${p.i}
                  @pointerdown=${p.i}
                  @pointerup=${p.i}
                  @keydown=${p.i}
                >
                  ${O&&L.includes(O)?n.s6:n.qy`<option value="" selected disabled hidden>Effect</option>`}
                  ${L.map(e=>n.qy`<option value=${e} ?selected=${e===O}>${this._effectLabel(t,s,e)}</option>`)}
                  ${(0,h.m)(O&&L.includes(O)?O:"")}
                </select>
              </div>
            `:n.s6}
      </div>
    `}_effectLabel(e,t,i){try{return e?.formatEntityAttributeValue?.(t,"effect",i)||i}catch{return i}}validate(e){return[]}}r.s.register(new y)},2805(e,t,i){i.d(t,{H:()=>p});var n=i(6161),s=i(866),r=i(5486),a=i(5173),o=i(1831),l=i(5441),c=i(5963),d=i(9307),u=i(4099);function p(e,t){if(!e?.entity_id.startsWith("climate.")||t&&"temperature"!==t)return;const i=e.attributes||{},n="number"==typeof i.target_temp_low?i.target_temp_low:void 0,s="number"==typeof i.target_temp_high?i.target_temp_high:void 0;return void 0!==n&&void 0!==s&&"number"!=typeof i.temperature?[n,s]:void 0}class h extends s.l{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:(0,a.$)("spinbox"),type:"spinbox"}}renderPreview(e,t){const i=e,s=i.entity&&t?t.states[i.entity]:void 0,r=s?(0,o.fR)(t,s,i.attribute,{min:i.min,max:i.max,step:i.step}):void 0,a=(0,l.vh)(i.entity,i.attribute,"spinbox"),h=r?(0,l.jb)(a,r.value)??r.value:void 0,m=(0,d.V)(),f=r&&void 0===h?p(s,i.attribute):void 0;let g;g=r&&void 0!==h?(0,o.C8)(t,r,h):r&&f?`${(0,o.C8)(t,{...r,unit:""},f[0])} – ${(0,o.C8)(t,r,f[1])}`:s?(0,u.Ai)(t,s).text:"–";const y=!r||r.readOnly||!t||void 0===h,v=e=>i=>{if(i.stopPropagation(),!r?.call||!t||y||void 0===h)return;const n=r.call,s=(0,o.Ee)(h+e*r.step,r.min,r.max,r.step);s!==h&&(0,l.n_)(a,s,r.value,e=>(0,o.Bw)(t,n(e)),()=>m?.requestUpdate())},b=s?(0,u.tX)(t,s):"Spinbox",w=void 0!==h&&void 0!==r&&h<=r.min,x=void 0!==h&&void 0!==r&&h>=r.max;return n.qy`
      <div class="mc-module mc-spinbox" role="group" aria-label=${b}>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-decrement"
          aria-label=${`Decrease ${b}`}
          ?disabled=${y||w}
          @click=${v(-1)}
          @pointerdown=${c.i}
          @pointerup=${c.i}
          @keydown=${c.i}
        >&minus;</button>
        <span class="mc-spinbox-value ${r&&void 0!==h?"":"mc-spinbox-value--text"}" aria-live="polite">${g}</span>
        <button
          type="button"
          class="mc-spinbox-btn mc-spinbox-increment"
          aria-label=${`Increase ${b}`}
          ?disabled=${y||x}
          @click=${v(1)}
          @pointerdown=${c.i}
          @pointerup=${c.i}
          @keydown=${c.i}
        >+</button>
      </div>
    `}validate(e){const t=e;return void 0!==t.min&&void 0!==t.max&&t.min>=t.max?["Min must be less than max"]:void 0===t.step||t.step>0?[]:["Step must be greater than 0"]}}r.s.register(new h)},5486(e,t,i){const n=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}};i.d(t,["s",0,n])},5993(e,t,i){i.d(t,{n6:()=>l});var n=i(7428);const s=[5e3,15e3,6e4],r="magic_card_utils/get_animations";const a=new class{constructor(){this.status="idle",this.version=0,this._docs=new Map,this._listeners=new Set,this._onReady=()=>{"ready"===this.status?this._refetch():this._tries<9&&(this._tries=0,this._retry())},this._retry=()=>{"unavailable"===this.status&&this._start(this._hass,this._conn)}}ensure(e){const t=e?.connection;e&&t&&(t!==this._conn&&!0===this._conn?.connected||(this._hass=e,t!==this._conn&&(this._teardown(),this._conn=t,t.addEventListener?.("ready",this._onReady),this._start(e,t))))}get(e){return this._docs.get(e)}list(){return[...this._docs.values()].sort((e,t)=>e.name.localeCompare(t.name))}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}async _start(e,t){this._setStatus("loading");let i=[];try{const n=await t.subscribeMessage(e=>i?i.push(e):this._apply(e),{type:"magic_card_utils/subscribe_animations"});if(t!==this._conn)return void n();this._unsub=n;const s=await e.callWS({type:r});if(t!==this._conn)return;this._replace(s?.animations);const a=i;i=void 0;for(const e of a)this._apply(e,!1);this._setStatus("ready")}catch(e){if(t!==this._conn)return;if(i=void 0,this._unsub?.(),this._unsub=void 0,"unknown_command"===e?.code)this._tries=9;else{this._tries||console.warn("Magic Card: animation library unavailable",e);const t=s[this._tries++];t&&(this._timer=setTimeout(this._retry,t))}this._setStatus("unavailable")}}async _refetch(){const e=this._hass,t=this._conn;if(e&&t&&"ready"===this.status)try{const i=await e.callWS({type:r});t===this._conn&&(this._replace(i?.animations),this._emit())}catch{}}_replace(e){const{docs:t,errors:i}=(0,n.sO)(e??{},{v2:"lenient"});i.length&&console.warn("Magic Card: invalid animations in the library",i);for(const[e,i]of t){const n=this._docs.get(e);n&&JSON.stringify(n)===JSON.stringify(i)&&t.set(e,n)}this._docs=t,this.version++}_apply(e,t=!0){if(e&&"object"==typeof e){if("deleted"===e.action){if(!this._docs.delete(e.id))return}else if("saved"===e.action){const t=(0,n.H2)(e.animation,{v2:"lenient"});if(!t.ok)return void console.warn("Magic Card: invalid animation from the library",t.errors);this._docs.set(t.doc.id,t.doc)}else{if(!("animations"in e))return;this._replace(e.animations)}this.version++,t&&this._emit()}}_setStatus(e){this.status=e,this.version++,this._emit()}_emit(){for(const e of[...this._listeners])e()}_teardown(){clearTimeout(this._timer),this._tries=0,this._unsub?.(),this._unsub=void 0,this._conn?.removeEventListener?.("ready",this._onReady),this._conn=void 0,this._docs=new Map,this.status="idle"}reset(){this._teardown(),this._hass=void 0,this._listeners.clear(),this.version=0}},o=new WeakMap;function l(e){const t=e?.custom_animations;if(!t||"object"!=typeof t)return;let i=o.get(t);if(!i){const e=(0,n.sO)(t,{v2:"lenient"});e.errors.length&&console.warn("Magic Card: invalid custom_animations",e.errors),i=e.docs,o.set(t,i)}return i}i.d(t,["iG",0,a])},5217(e,t,i){i.d(t,{_:()=>c,p:()=>o});var n=i(5486);const s=new Set(["entity","entity_id","entities","trigger_entity"]),r=/^[a-z0-9_]+\.[a-z0-9_]+$/;let a=new WeakMap;function o(){a=new WeakMap}function l(e,t){if("string"==typeof e)for(const i of e.split(",")){const e=i.trim();r.test(e)&&t.add(e)}else if(Array.isArray(e))for(const i of e)"string"==typeof i&&l(i,t)}function c(e,t={editMode:!1}){const i=t.editMode?"edit":"view",r=a.get(e)?.[i];if(r)return r;const o=new Set;let c,d=!1;const u=e=>{e&&e>0&&(c=void 0===c?e:Math.min(c,e))},p=new Set,h=(e,i=!1)=>{if(!e||"object"!=typeof e||p.has(e))return;if(p.add(e),Array.isArray(e)){for(const t of e)h(t,i);return}const r=e;for(const[e,t]of Object.entries(r))s.has(e)&&l(t,o),t&&"object"==typeof t&&h(t,i||"card_config"===e);if("time"===r.type&&("after"in r||"before"in r)&&u(6e4),"daynight"===r.preset&&o.add("sun.sun"),!i&&"string"==typeof r.type){const e=n.s.get(r.type)?.getDependencies?.(r,t);e&&(e.entities?.forEach(e=>o.add(e)),u(e.refreshInterval),e.forwardHass&&(d=!0))}};h(e);const m={entities:[...o],refreshInterval:c,forwardHass:d};return a.set(e,{...a.get(e),[i]:m}),m}},209(e,t,i){i.d(t,{g:()=>r});var n=i(9307),s=i(7508);class r{static evaluate(e,t){if(!e?.conditions?.length)return!0;if(!t)return!0;const i=e.conditions.map(e=>r.evaluateCondition(e,t));return"any"===e.mode?i.some(Boolean):i.every(Boolean)}static isComplete(e){if(!e||"object"!=typeof e)return!1;switch(e.type){case"state":return!!e.entity?.trim();case"attribute":return!!e.entity?.trim()&&!!e.attribute?.trim();case"template":return!!e.template?.trim();case"time":return!!e.after?.trim()||!!e.before?.trim();default:return!1}}static ruleMatches(e,t){const i=e.conditions;return!!(Array.isArray(i)&&i.length&&i.every(e=>r.isComplete(e)))&&r.evaluate({conditions:i,mode:e.mode},t)}static evaluateCondition(e,t){switch(e.type){case"state":return r.evaluateStateCondition(e,t);case"attribute":return r.evaluateAttributeCondition(e,t);case"time":return r.evaluateTimeCondition(e);case"template":return r.evaluateTemplateCondition(e);default:return!0}}static evaluateTemplateCondition(e){if(!e.template?.trim())return!0;const t=(0,n.V)()?.template(e.template);return"ok"===t?.status&&(0,s.Ew)(t.result)}static evaluateStateCondition(e,t){if(!e.entity)return!0;const i=t.states[e.entity];if(!i)return!1;const n=i.state;if(void 0!==e.state&&""!==e.state)return n===e.state;if(void 0!==e.state_not&&""!==e.state_not)return n!==e.state_not;const s=Number(n);if(!isNaN(s)){if(void 0!==e.above&&s<=e.above)return!1;if(void 0!==e.below&&s>=e.below)return!1}return!0}static evaluateAttributeCondition(e,t){if(!e.entity||!e.attribute)return!0;const i=t.states[e.entity];if(!i)return!1;const n=String(i.attributes[e.attribute]??"");if(void 0!==e.state&&""!==e.state)return n===e.state;if(void 0!==e.state_not&&""!==e.state_not)return n!==e.state_not;const s=Number(n);if(!isNaN(s)){if(void 0!==e.above&&s<=e.above)return!1;if(void 0!==e.below&&s>=e.below)return!1}return!0}static evaluateTimeCondition(e){const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const t=e.after.split(":").map(Number);if(t.length>=2){if(i<60*t[0]+t[1])return!1}}if(e.before){const t=e.before.split(":").map(Number);if(t.length>=2){if(i>=60*t[0]+t[1])return!1}}return!0}}},1702(e,t,i){i.d(t,{JK:()=>p,Jd:()=>u,S5:()=>h,pz:()=>c});const n=new Map,s=new Map,r=3e5;function a(e,t){for(const[e,i]of n)t.timestamp-i.timestamp>6e5&&n.delete(e);n.set(e,t)}const o=(e,t,i)=>`${e}|${t}|${i||""}`;function l(e,t,i){const n=[];for(const s of e){const e=t?s.a?.[t]:s.s,r="number"==typeof e?e:"string"==typeof e&&e.trim()?Number(e):NaN;if(!Number.isFinite(r))continue;const a=s.lu??s.lc,o="number"==typeof a&&Number.isFinite(a)?Math.max(1e3*a,i):i;n.push({t:o,v:r})}return n.sort((e,t)=>e.t-t.t)}function c(e,t,i,n){return n>=1&&i>t&&e.length?d(e,t,i,(i-t)/Math.floor(n),Math.floor(n)):[]}function d(e,t,i,n,s){const r=[];let a,o=0;for(let l=0;l<s;l++){const c=t+l*n,d=l===s-1?1/0:c+n;let u=0,p=0;for(;o<e.length&&e[o].t<d;)e[o].t>=c&&(u+=e[o].v,p++),a=e[o].v,o++;const h=p?u/p:a;void 0!==h&&r.push({t:Math.min(c+n/2,i),v:h})}return r}function u(e,t,i,n){if(!(n>0)||i<=t||!e.length)return e;const s=36e5/n;return d(e,t,i,s,Math.max(1,Math.ceil((i-t)/s)))}function p(e,t,i,c,d){const u=o(t,i,c||void 0),p=n.get(u);return p&&Date.now()-p.timestamp<=r||function(e,t,i,r,o,c){const d=s.get(t);if(d)return void(c&&d.add(c));s.set(t,new Set(c?[c]:[]));const u=new Date,p=new Date(u.getTime()-36e5*r);Promise.resolve().then(()=>e.callWS(function(e,t,i,n){return{type:"history/history_during_period",start_time:t.toISOString(),end_time:i.toISOString(),entity_ids:[e],include_start_time_state:!0,minimal_response:!n,no_attributes:!n,significant_changes_only:!n}}(i,p,u,o))).then(e=>{const n=e&&e[i]||[];a(t,{samples:l(n,o,p.getTime()),timestamp:Date.now()})}).catch(e=>{console.warn("magic-card: failed to fetch history for",i,e),a(t,{samples:n.get(t)?.samples??[],timestamp:Date.now(),error:!0})}).finally(()=>{const e=s.get(t);s.delete(t),e?.forEach(e=>e())})}(e,u,t,i,c||void 0,d),p}function h(e,t,i){return n.get(o(e,t,i||void 0))}},1912(e,t,i){i.d(t,{By:()=>m,J2:()=>f,RW:()=>l,fk:()=>o,i$:()=>a,yl:()=>u});const n="media-source://",s=/^url\(\s*(['"]?)(.*?)\1\s*\)$/i,r=3e4;function a(e){const t=e.trim(),i=t.match(s);return i?i[2].trim():t}function o(e){if("string"!=typeof e)return;const t=a(e);if(t.startsWith(n))return t;if(!t.startsWith("/")||t.startsWith("//")||!/[?&]authSig=/.test(t))return;const i=t.split(/[?#]/)[0].match(/^\/media\/([^/]+)\/(.+)$/);if(i)try{const e=i[2].split("/").map(decodeURIComponent).join("/");return`${n}media_source/${decodeURIComponent(i[1])}/${e}`}catch{return}}function l(e,t){if(!/[?&]authSig=/.test(e)||!/[?&]authSig=/.test(t))return!1;const i=e=>e.replace(/([?&])authSig=[^&#]*&?/,"$1").replace(/[?&]$/,"");return i(e)===i(t)}const c=new Map,d=new Map;function u(e){const t=c.get(e);return t?.url&&Date.now()<t.validUntil?t.url:void 0}function p(e,t){void 0!==t.timer&&clearTimeout(t.timer),t.timer=void 0,t.url&&d.get(e)?.size&&(t.timer=setTimeout(()=>{t.timer=void 0,d.get(e)?.size&&t.callWS&&h(e,t.callWS)},Math.max(0,t.refreshAt-Date.now())))}function h(e,t){let i=c.get(e);if(i||(i={validUntil:0,refreshAt:0},c.set(e,i)),i.callWS=t,i.inflight)return;const s=i;s.inflight=Promise.resolve().then(()=>t({type:"media_source/resolve_media",media_content_id:e})).then(e=>{const t=e?.url;if("string"!=typeof t||!t||t.startsWith(n))throw new Error("no url");const i=Date.now(),a=function(e){const t=/[?&]authSig=([^&#]+)/.exec(e)?.[1],i=t?.split(".")[1];if(!i)return r;try{const e=JSON.parse(atob(i.replace(/-/g,"+").replace(/_/g,"/"))),t=Number(e.exp)-Number(e.iat);return Number.isFinite(t)&&t>0?1e3*t:r}catch{return r}}(t);s.url=t,s.validUntil=i+a,s.refreshAt=i+Math.max(5e3,a-5e3)}).catch(()=>{s.url=void 0,s.validUntil=0,s.refreshAt=Date.now()+6e4}).finally(()=>{s.inflight=void 0,p(e,s),function(e){for(const t of d.get(e)??[])t.changed()}(e)})}function m(e){const t=c.get(e);if(!t?.callWS||t.inflight)return;const i=Date.now();void 0!==t.lastErrorRetry&&i-t.lastErrorRetry<1e4||(t.lastErrorRetry=i,h(e,t.callWS))}class f{constructor(e,t){this._requestUpdate=e,this._hass=t,this._ids=new Set,this._wanted=null,this._connected=!1,this._onReady=()=>{const e=this._callWS();if(e)for(const t of this._ids)h(t,e)}}changed(){this._connected&&this._requestUpdate()}begin(){this._wanted=new Set}get(e){return this._wanted?.add(e),u(e)}end(){const e=this._wanted;if(this._wanted=null,e){for(const t of this._ids)e.has(t)||this._unwatch(t);this._ids=e,this._connected&&this._watchAll()}}hostConnected(){this._connected=!0,this._watchAll()}hostDisconnected(){this._connected=!1;for(const e of this._ids)this._unwatch(e);this._listenReady(void 0)}_callWS(){const e=this._hass();return e?.callWS?t=>e.callWS(t):void 0}_watchAll(){const e=this._callWS();this._listenReady(this._hass()?.connection);for(const t of this._ids){let i=d.get(t);i||d.set(t,i=new Set);const n=!i.has(this);i.add(this);const s=c.get(t);!s||!s.inflight&&Date.now()>=s.refreshAt?e&&h(t,e):n&&void 0===s.timer&&p(t,s)}}_unwatch(e){const t=d.get(e);if(t?.delete(this),t&&!t.size){d.delete(e);const t=c.get(e);void 0!==t?.timer&&clearTimeout(t.timer),t&&(t.timer=void 0)}}_listenReady(e){this._readyOn!==e&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=e?.addEventListener?e:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}}},9307(e,t,i){let n;function s(e,t){const i=n;n=e;try{return t()}finally{n=i}}function r(){return n}i.d(t,{V:()=>r,c:()=>s})},7508(e,t,i){i.d(t,{C3:()=>r,Ew:()=>a,L3:()=>s,XM:()=>o});const n=new Map;function s(e){return/\{\{|\{%|\{#/.test(e)}function r(e){if(null==e)return"";if("string"==typeof e)return e;if("object"==typeof e)try{return JSON.stringify(e)}catch{return String(e)}return String(e)}function a(e){if("boolean"==typeof e)return e;if("number"==typeof e)return 0!==e&&!Number.isNaN(e);if("string"!=typeof e)return!1;const t=e.trim().toLowerCase();return!!["true","yes","on","enable"].includes(t)||""!==t&&!Number.isNaN(Number(t))&&0!==Number(t)}class o{constructor(e,t,i=50){this._requestUpdate=e,this._connection=t,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const e of this._subs.values())e.failed=!1;if(this._connected)for(const[e,t]of this._subs)this._subscribe(e,t)}}begin(){this._wanted=new Set,this._dirty=!1}get(e,t){const i=function(e,t){return t&&Object.keys(t).length?`${e}\0${JSON.stringify(t)}`:e}(e,t);this._wanted?.add(i);let s=this._subs.get(i);return s||(s={template:e,variables:t,state:n.get(i)??{status:"pending"}},this._connection()?.subscribeMessage||(s.state={status:"unavailable"}),this._subs.set(i,s)),s.state}end(){const e=this._wanted;if(this._wanted=null,e)for(const[t,i]of this._subs)e.has(t)?this._connected&&this._subscribe(t,i):(this._unsubscribe(i),this._subs.delete(t))}hostConnected(){this._connected=!0;for(const[e,t]of this._subs)t.failed=!1,this._subscribe(e,t);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const e of this._subs.values())this._unsubscribe(e);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(e=>e.active).length}_listenReady(e){this._readyOn!==e&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=e?.addEventListener?e:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(e,t){if(t.active||t.failed)return;const i=this._connection();if(!i?.subscribeMessage)return void this._set(e,t,{status:"unavailable"});this._listenReady(i),"unavailable"===t.state.status&&(t.state=n.get(e)??{status:"pending"});const s={type:"render_template",template:t.template,report_errors:!0};t.variables&&(s.variables=t.variables);const r={};t.token=r;const a=()=>t.token===r,o=i.subscribeMessage(i=>{if(a())if(i&&"object"==typeof i&&"error"in i&&void 0!==i.error){if("WARNING"===i.level)return;this._set(e,t,{status:"error",error:String(i.error)})}else this._set(e,t,{status:"ok",result:i?.result})},s);t.active=Promise.resolve(o).then(e=>e).catch(i=>{if(a()){t.active=void 0,t.token=void 0,t.failed=!0;const n=String(i&&"object"==typeof i&&"message"in i?i.message:i);this._set(e,t,{status:"error",error:n})}})}_unsubscribe(e){const t=e.active;e.active=void 0,e.token=void 0,t&&t.then(e=>{try{e?.()}catch{}})}_set(e,t,i){var s,r;(s=t.state,r=i,s.status===r.status&&("ok"===s.status&&"ok"===r.status?s.result===r.result||"object"==typeof s.result&&JSON.stringify(s.result)===JSON.stringify(r.result):"error"!==s.status||"error"!==r.status||s.error===r.error))||(t.state=i,function(e,t){"ok"===t.status&&(n.delete(e),n.set(e,t),n.size>300&&n.delete(n.keys().next().value))}(e,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}},9162(e,t,i){i.d(t,{e5:()=>f,uU:()=>p,wL:()=>m});var n=i(5183),s=i(4839),r=i(4318),a=i(5743);const o=new Set(["icon_fx","icon_on","icon_off","svg"]);function l(e,t,i){for(const n of["hidden","editor_name"]){if(!i.has(n))continue;const s=t[n];void 0===s?delete e[n]:e[n]=s}}const c=["use_page_theme","theme","background","background_image","border_radius","padding","box_shadow","card_height","overflow","css","animations","ring","popup","flows","shape","value_background","seasonal","hover"],d={shape:["shape_options"]},u=new Set(["type","template","not_synced","name","rows","display","conditional_appearance",...c,"custom_animations",...Object.values(d).flat()]);function p(e){const t={};for(const[i,s]of Object.entries(e))u.has(i)||void 0===s||(t[i]=(0,n.G)(s));return t}function h(e,t,i=!0){const n=new Map,s=(e,t)=>{const i=new Set;for(const s of e){const e=String(s.id);i.has(e)||Array.isArray(t)&&t.includes(e)||n.set(e,s),i.add(e)}};return t.not_synced?.includes("custom_animations")||s((0,a.B)(e),i&&t.hidden_animations),s((0,a.B)(t.custom_animations)),n.size?[...n.values()]:void 0}function m(e,t,i=!0){if(!e.template||!t)return e;const n={...e,custom_animations:h(t,e,i)};return n.custom_animations||delete n.custom_animations,n}function f(e,t,i=!1){const a=(0,n.G)(e);a.type=t.type,a.template=t.template;const u=new Set(t.not_synced||[]);u.size>0&&(a.not_synced=[...u]),Object.assign(a,p(t));const m=i?t.custom_animations:h(a.custom_animations,t);m?a.custom_animations=(0,n.G)(m):delete a.custom_animations;for(const e of c){const i=d[e];if(i){const s=[e,...i],r=t,o=a;if(!u.has(e)||!s.some(e=>void 0!==r[e]))continue;for(const e of s)void 0===r[e]?delete o[e]:o[e]=(0,n.G)(r[e]);continue}u.has(e)&&void 0!==t[e]&&(a[e]=(0,n.G)(t[e]))}const f=new Map,g=new Map,y=new Map;for(const e of t.rows||[]){e.id&&f.set(e.id,e);for(const t of e.columns||[]){t.id&&g.set(t.id,t);for(const e of t.modules||[])e.id&&y.set(e.id,e)}}const v=new Set((a.rows||[]).map(e=>e.id).filter(Boolean));a.rows=(a.rows||[]).map(e=>{const t=e.id?f.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),i.has("layout")&&void 0!==t.layout&&(e.layout=t.layout),i.has("column_widths")&&(void 0!==t.column_widths?e.column_widths=[...t.column_widths]:delete e.column_widths),i.has("design")&&t.design&&(e.design={...e.design,...t.design}),i.has("actions")&&(t.actions?e.actions=t.actions:delete e.actions),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),l(e,t,i)}const i=new Set((e.columns||[]).map(e=>e.id).filter(Boolean));if(e.columns=(e.columns||[]).map(e=>{const t=e.id?g.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);if(i.size>0&&(e.not_synced=[...i]),i.has("design")&&t.design&&(e.design={...e.design,...t.design}),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),i.has("vertical_align")&&void 0!==t.vertical_align&&(e.vertical_align=t.vertical_align),l(e,t,i),i.has("modules")&&Array.isArray(t.modules))return{...e,modules:(0,n.G)(t.modules)}}const i=new Set((e.modules||[]).map(e=>e.id).filter(Boolean));if(e.modules=(e.modules||[]).map(e=>{const t=e.id?y.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),l(e,t,i);const a=["text","icon","entity","image","content","label","attribute","prefix","suffix","url","service","service_data","data","use_entity","entity_display","use_entity_icon","use_entity_color","icon_color","size","icon_fx","icon_on","icon_off","svg","animated_icons"];for(const s of a)i.has(s)&&void 0!==t[s]?e[s]=(0,n.G)(t[s]):i.has(s)&&o.has(s)&&delete e[s];const c=(0,r.us)(e);if(c&&i.has(c)&&void 0!==t[c]&&(e[c]=(0,n.G)(t[c])),t.design&&i.has("design"))e.design={...e.design,...t.design};else if(t.design){const n=t.design,r={...e.design||{}};let a=!1;for(const e of i){if(!e.startsWith("design."))continue;const t=(0,s.I7)(e.slice(7));if(!(t.length>1)||t.some(e=>void 0!==n[e]))for(const e of t)t.length>1&&delete r[e],void 0!==n[e]&&(r[e]=n[e]),a=!0}a&&(e.design=r)}t.actions&&(i.has("actions")||[...i].some(e=>e.startsWith("actions.")))&&(e.actions={...e.actions,...t.actions})}return e}),t)for(const s of t.modules||[])s.id&&!i.has(s.id)&&e.modules.push((0,n.G)(s));return e}),t)for(const s of t.columns||[])s.id&&!i.has(s.id)&&e.columns.push((0,n.G)(s));return e});for(const e of t.rows||[])e.id&&!v.has(e.id)&&a.rows.push((0,n.G)(e));return a}i.d(t,["lC",0,["grid_options","layout_options","visibility","view_layout"]])},3166(e,t,i){i.d(t,{BR:()=>r,PT:()=>a});i(7428);let n,s;function r(){return n??=i.e(811).then(()=>i(7114)).then(e=>s=e,e=>{console.warn("Magic Card: the animation runtime (magic-card-anim-runtime.js) could not be loaded; animations play without parts, clips and bindings.",e)}),n}function a(){return s}},5845(e,t,i){const n=(e,t=1080)=>({label:e,unit:"deg",min:0,max:t}),s=(e,t=100)=>({label:e,unit:"%",min:0,max:t}),r=(e,t=60)=>({label:e,unit:"px",min:0,max:t}),a=(e="Particles",t=12)=>({label:e,unit:"",min:1,max:t}),o=a();function l(e,t,i){const{direction:n="normal",iterations:s="infinite",...r}=i.extra||{};return{id:e,name:t,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:s,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...r}}const c={iconKeyframes:!0},d=[l("breathe","Breathe",{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[s("Scale",50),4]}),l("glow-pulse","Glow pulse",{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[r("Glow size"),16],extra:c}),l("halo-ripple","Halo ripple",{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[r("Ring size"),14],extra:c}),l("aura","Aura",{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[r("Glow size"),24],extra:c}),l("heartbeat","Heartbeat",{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[s("Scale",50),12]}),l("spin","Spin",{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[n("Rotation"),360]}),l("fast-spin","Fast spin",{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[n("Rotation"),360]}),l("sway","Sway",{group:"Motion",channels:["rotate"],duration:2.4,intensity:[n("Angle",90),6]}),l("wobble","Wobble",{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[r("Distance"),6]}),l("shake-alert","Shake alert",{group:"Motion",channels:["translate"],duration:2,intensity:[r("Distance"),4]}),l("rumble","Rumble",{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[r("Distance",10),1]}),l("float","Float",{group:"Motion",channels:["translate"],duration:3,intensity:[r("Distance"),6]}),l("flame-flicker","Flame flicker",{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[s("Flicker",30),5],extra:{origin:"50% 100%",colour:!0}}),l("steam-rise","Steam rise",{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[o,4],extra:{particles:"count"}}),l("bubbles","Bubbles",{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[o,6],extra:{particles:"count"}}),l("snow-fall","Snow fall",{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[o,6],extra:{particles:"count"}}),l("rain-fall","Rain fall",{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[o,6],extra:{particles:"count"}}),l("liquid-wave","Liquid wave",{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[s("Fill level"),40],extra:{particles:2}}),l("storm-flash","Storm flash",{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[s("Brightness"),75],extra:{particles:1,front:!0}}),l("shine-sweep","Shine sweep",{group:"Light & colour",channels:["fx"],duration:3,intensity:[s("Shine"),45],extra:{particles:1,front:!0}}),l("bounce","Bounce",{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[r("Height"),10],extra:{origin:"50% 100%"}}),l("jello","Jello",{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[s("Squash",50),12]}),l("rubber-band","Rubber band",{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[s("Stretch",50),25]}),l("tada","Tada",{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[n("Angle",45),3]}),l("swing","Swing",{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[n("Angle",90),15],extra:{origin:"50% 0"}}),l("flip","Flip",{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[n("Rotation"),360]}),l("pop","Pop",{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[s("Scale",50),18]}),l("head-shake","Head shake",{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[r("Distance",30),6]}),l("blink","Blink",{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[s("Dim"),85]}),l("neon-flicker","Neon flicker",{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[r("Glow size",30),8],extra:{colour:!0}}),l("rainbow-hue","Rainbow hue",{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[n("Hue range",720),360]}),l("glitch","Glitch",{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[r("Offset",20),3],extra:{colour:!0}}),l("fade-pulse","Fade pulse",{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[s("Fade"),60]}),l("ping","Ping",{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[s("Ring size",200),90],extra:{particles:1}}),l("ripple-rings","Ripple rings",{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[a("Rings",6),3],extra:{particles:"count"}}),l("radar-sweep","Radar sweep",{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[n("Beam width",180),70],extra:{particles:1}}),l("conic-border-spin","Conic border spin",{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[r("Border width",12),2],extra:{particles:1}}),l("breathing-border","Breathing border",{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[r("Border width",12),2],extra:c}),l("fireflies","Fireflies",{group:"Scenes",channels:["fx"],duration:6,intensity:[o,8],extra:{particles:"count"}}),l("confetti","Confetti",{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[o,10],extra:{particles:"count"}}),l("falling-leaves","Falling leaves",{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[o,5],extra:{particles:"count"}}),l("lightning","Lightning",{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[s("Brightness"),90],extra:{particles:1,front:!0}}),l("ocean-waves","Ocean waves",{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[s("Wave height"),35],extra:{particles:3}}),l("sun-rays","Sun rays",{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[n("Ray width",30),6],extra:{particles:1}}),l("heat-shimmer","Heat shimmer",{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[r("Strength",10),2]}),l("wind-lines","Wind lines",{group:"Scenes",channels:["fx"],duration:2.2,intensity:[o,5],extra:{particles:"count"}}),l("drip","Drip",{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[o,3],extra:{particles:"count"}}),l("equalizer-bars","Equalizer bars",{group:"Scenes",channels:["fx"],duration:.9,intensity:[a("Bars"),5],extra:{particles:"count",direction:"alternate"}}),l("charging-stripes","Charging stripes",{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[s("Stripe strength"),100],extra:{particles:1}}),l("orbit-dots","Orbit dots",{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[a("Dots",8),3],extra:{particles:"count"}}),l("typing-dots","Typing dots",{group:"Scenes",channels:["fx"],duration:1.2,intensity:[r("Bounce",20),4],extra:{particles:3}}),l("pendulum","Pendulum",{group:"Motion",channels:["rotate"],duration:2.4,intensity:[n("Angle",90),20],extra:{origin:"50% 0",direction:"alternate"}}),l("orbit","Orbit",{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[r("Radius",40),6]}),l("coin-spin","Coin spin",{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[n("Rotation"),360]}),l("rotate-3d","3D rotate",{group:"Motion",channels:["rotate"],duration:3,intensity:[n("Tilt",180),25],extra:{direction:"alternate"}}),l("squash-stretch","Squash & stretch",{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[s("Squash",50),14],extra:{origin:"50% 100%"}}),l("wiggle","Wiggle",{group:"Motion",channels:["rotate"],duration:2.5,intensity:[n("Angle",45),8]}),l("shadow-lift","Shadow lift",{group:"Motion",channels:["translate","glow"],duration:3,intensity:[r("Lift",20),4],extra:c}),l("holographic-shimmer","Holographic shimmer",{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[s("Strength"),35],extra:{particles:1,front:!0}}),l("scanline","Scanline",{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[s("Brightness"),50],extra:{particles:1,front:!0}}),l("twinkle","Twinkle",{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[o,6],extra:{particles:"count",front:!0}}),l("spotlight","Spotlight",{group:"Light & colour",channels:["fx"],duration:7,intensity:[s("Brightness"),45],extra:{particles:1}}),l("border-snake","Border snake",{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[r("Width",12),3],extra:{ring:"snake"}}),l("neon-border","Neon border",{group:"Borders",channels:["glow"],duration:2.4,intensity:[r("Glow size",30),10],extra:c}),l("power-flow","Power flow dots",{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[r("Dot size",12),5],extra:{ring:"dots"}}),l("marching-ants","Marching ants",{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[r("Width",12),2],extra:{ring:"dashes"}}),l("aurora","Aurora",{group:"Backgrounds",channels:["fx"],duration:12,intensity:[s("Glow"),55],extra:{particles:3}}),l("lava-lamp","Lava lamp",{group:"Backgrounds",channels:["fx"],duration:9,intensity:[o,5],extra:{particles:"count",direction:"alternate"}}),l("plasma-gradient","Plasma gradient",{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[s("Strength"),70],extra:{particles:1}}),l("gradient-flow","Gradient flow",{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[s("Strength"),60],extra:{particles:1,direction:"alternate"}}),l("color-cycle-bg","Color cycle background",{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[s("Strength"),35],extra:{particles:1}}),l("starfield","Starfield",{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[o,12],extra:{particles:"count"}}),l("meteor-shower","Meteor shower",{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[o,4],extra:{particles:"count"}}),l("bokeh","Bokeh",{group:"Backgrounds",channels:["fx"],duration:8,intensity:[o,7],extra:{particles:"count",direction:"alternate"}}),l("matrix-rain","Matrix rain",{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[a("Streams"),10],extra:{particles:"count"}}),l("smoke","Smoke",{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[o,5],extra:{particles:"count"}}),l("clouds-drift","Clouds drift",{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[a("Clouds",6),3],extra:{particles:"count"}}),l("water-ripple","Water ripple",{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[a("Ripples",8),3],extra:{particles:"count"}}),l("fireworks","Fireworks",{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[a("Sparks"),10],extra:{particles:"count"}}),...[["winter","Winter","winter"],["spring","Spring","spring"],["summer","Summer","summer"],["autumn","Autumn","autumn"],["christmas","Christmas","christmas"],["new_year","New Year","new_year"],["valentine","Valentine","valentine"],["easter","Easter","easter"],["halloween","Halloween","halloween"],["weather","Live weather","weather"],["daynight","Day and night","daynight"],["snow","Snowy","snow"],["rain","Rainy","rain"],["storm","Thunderstorm","storm"],["sun","Sunny","sun"],["clouds","Cloudy","clouds"],["fog","Foggy","fog"],["wind","Windy","wind"],["night","Night sky","night"],["dusk","Dusk glow","dusk"]].map(([e,t,i])=>l(e,t,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[s("Density"),50],extra:{seasonal:i}})),l("tap-ripple","Tap ripple",{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[s("Brightness"),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),l("press","Press",{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[s("Depth",30),6],extra:{trigger:"tap",iterations:1}})],u=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(e=>d.some(t=>t.group===e)),p=new Map(d.map(e=>[e.id,e]));i.d(t,["Z4",0,[{id:"linear",label:"Linear",css:"linear"},{id:"ease",label:"Ease",css:"ease"},{id:"ease-in",label:"Ease in",css:"ease-in"},{id:"ease-out",label:"Ease out",css:"ease-out"},{id:"ease-in-out",label:"Ease in-out",css:"ease-in-out"},{id:"spring",label:"Spring",css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:"Smooth",css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:"Snap",css:"cubic-bezier(0.7, 0, 0.3, 1)"}],"cq",0,e=>e.channels.includes("glow")||e.channels.includes("fx")||!!e.colour,"e2",0,e=>e?p.get(e):void 0,"id",0,u,"sf",0,e=>e.intensity.unit?`${e.intensity.label} (${e.intensity.unit})`:e.intensity.label,"u7",0,d])},340(e,t,i){i.d(t,{Sd:()=>T,TD:()=>g,Tk:()=>A,Ur:()=>S,WC:()=>I,f8:()=>w,p4:()=>E,uO:()=>O,x_:()=>M});var n=i(8521),s=i(3041),r=i(2668),a=i(5845),o=i(508),l=i(3166),c=i(7428),d=i(2142),u=i(2146);const p=["animation_preset","animation_target","animation_speed","animation_trigger","animation_state","animation_color"],h={slow:1.6,normal:1,fast:.6},m=["normal","reverse","alternate","alternate-reverse"],f=e=>"string"==typeof e&&""!==e.trim()?e.trim():void 0;function g(e){if("number"==typeof e&&Number.isFinite(e)&&e>=0)return+e.toFixed(3)+"s";const t=f(e);return t?/^\d*\.?\d+$/.test(t)?+(+t).toFixed(3)+"s":/^\d*\.?\d+m?s$/.test(t)?t:void 0:void 0}const y=e=>e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);function v(e){const t=f(e);if(!t)return;const i=a.Z4.find(e=>e.id===t);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)?t:void 0}const b=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function w(e){const t=f(e);if(!t||!/^[#\w\s(),.%+*/-]+$/.test(t)||t.includes("/*")||t.includes("*/"))return;let i=0;for(const e of t)if("("===e)i++;else if(")"===e&&--i<0)return;if(0!==i)return;const n=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==n||s.some(e=>!b.has(e[1].toLowerCase()))?void 0:t}function x(e){if("infinite"===e)return"infinite";const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?String(+t.toFixed(2)):void 0}function _(e,t){const i="string"==typeof t?Number(t):t;return"number"==typeof i&&Number.isFinite(i)?Math.min(e.intensity.max,Math.max(e.intensity.min,i)):e.defaults.intensity}function $(e){const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?Math.min(100,Math.max(0,t)):void 0}function k(e){if(e.seasonal)return{intensity:e.defaults.intensity};const{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:o}=e.defaults;return{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:o,...(0,a.cq)(e)?{strength:100}:{}}}function M(e,t){const i=(0,a.e2)(e)??a.u7[0];return{id:t,preset:i.id,target:"module",trigger:i.trigger??"always",...k(i)}}function S(e,t){if((0,c.Bl)(t))return function(e,t){const i={...e,preset:t};for(const e of C)delete i[e];"tap"===i.trigger&&"tap"===(0,a.e2)(e.preset)?.trigger&&(i.trigger="always");return i}(e,t);const i=(0,a.e2)(t);if(!i)return{...e,preset:t};const{strength:n,...s}=e;if(i.seasonal)for(const e of["duration","delay","easing","iterations","direction"])delete s[e];else delete s.decorations;return{...s,preset:i.id,...k(i),...i.trigger?{trigger:i.trigger}:{}}}const C=["duration","delay","easing","iterations","direction","intensity","strength","decorations","target"];function T(e){if(!e)return[];if(Array.isArray(e.animations))return e.animations.filter(e=>!!e&&"object"==typeof e&&!!f(e.preset)).map((e,t)=>f(e.id)?e:{...e,id:`anim-${t}`});const t=f(e.animation_preset);if(!t)return[];const i=(0,a.e2)(t),n={id:"legacy",preset:t};if(e.animation_target&&(n.target=e.animation_target),e.animation_trigger&&(n.trigger=e.animation_trigger),e.animation_state&&(n.state=e.animation_state),e.animation_color&&(n.color=e.animation_color),!i)return[n];const s=k(i),r=h[e.animation_speed||"normal"]??1;return[{...n,...s,duration:+(y(s.duration)*r).toFixed(3)+"s"}]}function A(e){const t={animations:e.length?e:void 0};for(const e of p)t[e]=void 0;return t}function E(e,t,i){const s=f(e.trigger_entity);switch(s&&(t=i?.[s]),e.trigger){case"entity_on":return(0,n.mu)(t);case"state":{const i=(e.state||"").trim();return!!i&&!!t&&t.state===i}default:return!0}}const P={rotate:"rotation",translate:"position",scale:"scale",opacity:"opacity",filter:"filter","box-shadow":"glow"};function z(e,t){return e.flatMap(e=>"fx"===e?[]:"glow"===e?[t?"filter":"box-shadow"]:[e])}const L=(e,t)=>t&&"icon"===e.target;function O(e,t={}){const i=!1!==t.allowIcon;return e.map((t,n)=>{const s=(0,a.e2)(t.preset);if(!s)return;const r=z(s.channels,L(t,i));for(let o=n-1;o>=0;o--){const n=(0,a.e2)(e[o].preset);if(!n||L(e[o],i)!==L(t,i))continue;const l=z(n.channels,L(e[o],i)).find(e=>r.includes(e));if(!l)continue;const c=s.channels.includes("glow")||n.channels.includes("glow"),d="filter"===l&&c?"glow":P[l];return`Overrides ${n.name}: both animate the ${d}`}})}function q(e,t,i,n){if("weather"===e.seasonal){const e=f(t.trigger_entity),s=e?.startsWith("weather.")?n?.[e]:i;return s?.entity_id?.startsWith("weather.")?(0,r.J4)(s.state):void 0}if("daynight"===e.seasonal){const e=n?.["sun.sun"],t=e?.attributes?.elevation;return(0,r.p5)(e?.state,"number"==typeof t?t:"string"==typeof t&&""!==t.trim()?Number(t):void 0)}return e.seasonal}const R=.618034;function N(e){return Array.from({length:e},(t,i)=>{const n=60/e*(i*R%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/e*100+n)).toFixed(1),phase:+(i*R%1).toFixed(3),k:e>1?+(i/e).toFixed(3):0}})}function I(e,t,i={}){e=(0,s.ID)(e);const r=!1!==i.allowIcon,o={m:[],i:[],mi:[],t:[]},l=[],d={},u=[],p=[],h=[],f={need:!1,p:!1};for(let n of T(e)){if((0,c.Bl)(n.preset)){const e=i.custom?.((0,c._R)(n.preset));if(!e||!E(n,t,i.states))continue;const s=j(e,n,{lists:o,vars:l,origins:d,fx:u,seq:p,v2:h,allowIcon:r,runtime:f,custom:i.custom,stateObj:t,states:i.states});if(!s)continue;n=s}const e=(0,a.e2)(n.preset);if(!e||!E(n,t,i.states))continue;const s=e.defaults,y=g(n.duration)??s.duration,b=g(n.delay)??s.delay,k="tap"===n.trigger;let M=x(n.iterations)??x(s.iterations);k&&"infinite"===M&&(M="1");const S=`${v(n.easing)??v(s.easing)} ${b} ${M} ${m.includes(n.direction)?n.direction:s.direction}`,C=`${y} ${S}`,T=[`--mca-${e.id}-i: ${_(e,n.intensity)}`],A=w(n.color);A&&T.push(`--mca-${e.id}-c: ${A}`);const P=(0,a.cq)(e)?$(n.strength):void 0;if(void 0!==P&&100!==P&&T.push(`--mca-${e.id}-s: ${+(P/100).toFixed(3)}`),e.seasonal){const s=q(e,n,t,i.states);if(!s)continue;u.push({preset:e.id,front:!1,style:void 0!==P&&100!==P?"opacity: "+ +(P/100).toFixed(3):"",particles:[],seasonal:{scenes:[s],intensity:_(e,n.intensity)/100,decorations:!1!==n.decorations}});continue}if(e.ring){u.push({preset:e.id,front:!0,style:T.join("; "),particles:[],...k?{tap:k}:{},ring:D(e,n,y,S,P)});continue}if(void 0!==e.particles){const t="count"===e.particles?Math.min(12,Math.round(_(e,n.intensity))):e.particles;u.push({preset:e.id,front:!!e.front,style:[`--mc-fx-anim: mc-anim-${e.id} ${C}`,`--mc-fx-dur: ${y}`,`--mc-fx-delay: ${b}`,...T].join("; "),particles:N(Math.max(1,t)),...k?{tap:k}:{}});continue}if(l.push(...T),k){o.t.push(`mc-anim-${e.id} ${C}`),e.origin&&!d.m&&(d.m=e.origin);continue}const z=L(n,r);o.mi.push(`mc-anim-${e.id} ${C}`),z?(o.i.push(`mc-anim-${e.id}${e.iconKeyframes?"-icon":""} ${C}`),e.origin&&!d.i&&(d.i=e.origin)):(o.m.push(`mc-anim-${e.id} ${C}`),e.origin&&!d.m&&(d.m=e.origin))}if(!(o.mi.length||o.t.length||u.length||p.length||f.need))return;const y=[];o.m.length&&y.push(`--mc-anim-m: ${o.m.join(", ")}`),o.t.length&&y.push(`--mc-anim-t: ${o.t.join(", ")}`),o.i.length&&y.push(`--mc-anim-i: ${o.i.join(", ")}`,`--mc-anim-mi: ${o.mi.join(", ")}`),d.m&&y.push(`--mc-anim-om: ${d.m}`),d.i&&y.push(`--mc-anim-oi: ${d.i}`),y.push(...function(e){const t=new Map;for(const i of e){const e=i.slice(0,i.indexOf(":"));t.delete(e),t.set(e,i)}return[...t.values()]}(l));const b=w(e?.color)??w((0,n.id)(t));b&&y.push(`--mc-anim-color: ${b}`);const k=[o.m.length?"module":"",o.i.length?"icon":""].filter(Boolean).join(" ");return{...k?{targets:k}:{},style:y.join("; "),fx:u,...o.t.length?{tap:!0}:{},...p.length?{seq:p.join(" ")}:{},...f.need?{needsRuntime:!0}:{},...f.p?{needsParticles:!0}:{},...h.length?{v2:h,run:[...new Set(h.map(e=>e.run))].join(" ")}:{}}}function j(e,t,i){const s=(0,o.UC)(e,{lookup:i.custom}),r=x(e.iterations)??"infinite",a="tap"===t.trigger,p=g(t.duration)??`${e.duration}s`,h=g(t.delay)??"0s";let f=x(t.iterations)??r;a&&"infinite"===f&&(f="1");const b=m.includes(t.direction)?t.direction:e.direction??"normal",_=`${v(t.easing)??v(e.easing)??"ease"} ${h} ${f} ${b}`,k=i.allowIcon&&("icon"===t.target||!t.target&&"icon"===s.motion?.target);let M;if((0,c.oC)(e)&&(i.runtime.need=!0,s.v2)){const r="string"==typeof t.entity&&t.entity?t.entity:void 0,a=r?i.states?.[r]:i.stateObj,c=r??i.stateObj?.entity_id,d=s.name||(0,o.iZ)(e),u=(0,l.PT)()?.resolveHints(s.v2,{stateObj:a,states:i.states,run:d,timing:`${p} ${_}`,icon:i.allowIcon&&"module"!==t.target,active:(0,n.mu)(a)})??{};M=u.clip?.animation,i.v2.push({run:d,docId:e.id,v2:M?{...s.v2,tracks:[]}:s.v2,timing:`${p} ${_}`,icon:k,...c?{entityId:c}:{},...a?{stateObj:a}:{},hints:u})}if(M){if("none"===M)return;const n={...t,preset:M,target:k?"icon":t.target};for(const e of["duration","delay","easing","iterations","direction"])delete n[e];if(!(0,c.Bl)(M))return n;const s=i.custom?.((0,c._R)(M));return s&&s!==e?j(s,n,i):void 0}if(s.preset)return{...t,preset:s.preset.id,intensity:t.intensity??s.preset.intensity,duration:t.duration??`${e.duration}s`,easing:t.easing??e.easing,iterations:t.iterations??("infinite"===r?"infinite":Number(r)),direction:t.direction??e.direction};if(s.schedule){const e=s.schedule,n=g(t.duration),r=n&&e.total>0?y(n)/e.total:1,a="number"==typeof t.iterations&&t.iterations>0?Math.round(t.iterations):void 0;return void(e.steps.length&&i.seq.push((0,u.$d)({...e,delay:y(h),scale:r,...a?{cycles:a}:{}})))}const S=[],C="number"==typeof t.intensity&&Number.isFinite(t.intensity)?t.intensity:void 0;void 0!==C&&100!==C&&S.push(`${(0,o.er)(e.id,"i")}: ${+(C/100).toFixed(3)}`);const T=w(t.color);T&&S.push(`${(0,o.er)(e.id,"c")}: ${T}`);const A=$(t.strength);if(void 0!==A&&100!==A&&S.push(`${(0,o.er)(e.id,"s")}: ${+(A/100).toFixed(3)}`),(0,d.XF)(e.id,s.name,s.css),s.layer){(s.sim||s.needsParticles)&&(i.runtime.p=!0);const e=+(y(p)/s.layer.speed).toFixed(3)+"s";return void i.fx.push({preset:s.name,front:s.layer.front,style:[`--mc-fx-anim: ${s.name} ${e} ${_}`,`--mc-fx-dur: ${e}`,`--mc-fx-delay: ${h}`,...S].join("; "),particles:s.layer.particles,...s.layer.symbol?{symbol:s.layer.symbol}:{},sim:s.sim,...a?{tap:a}:{}})}if(!s.motion)return;const E=[s.name,...s.lanes??[]].map(e=>`${e} ${p} ${_}`).join(", "),P="center"!==s.motion.origin?s.motion.origin:void 0;if(i.vars.push(...S),a)return i.lists.t.push(E),void(P&&!i.origins.m&&(i.origins.m=P));i.lists.mi.push(E),k?(i.lists.i.push(E),P&&!i.origins.i&&(i.origins.i=P)):(i.lists.m.push(E),P&&!i.origins.m&&(i.origins.m=P))}function D(e,t,i,n,s){return{mode:"animated",fill:1,animation:e.ring,color:w(t.color)??"var(--mc-anim-c)",width:_(e,t.intensity),linecap:"dashes"===e.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==s&&100!==s?{opacity:+(s/100).toFixed(3)}:{}}}i.d(t,["J2",0,["icon","button","light","weather"],"Q2",0,e=>S(e,e.preset)])},8764(e,t,i){function n(e,t){if(void 0===e||!Number.isFinite(e)||!Array.isArray(t))return;let i;for(const n of t){if(!n||"string"!=typeof n.color||!n.color)continue;const t=Number(n.from);!Number.isFinite(t)||e<t||(void 0!==n.to&&null!==n.to&&Number.isFinite(Number(n.to))&&e>Number(n.to)||(!i||t>Number(i.from))&&(i=n))}return i?.color}i.d(t,{r:()=>n})},1874(e,t,i){i.d(t,{$t:()=>d,C6:()=>a,Hi:()=>h,JR:()=>u,M0:()=>l,SU:()=>o,U$:()=>p,W8:()=>r,gp:()=>c});var n=i(3041);const s=/^((?:\d+\.?\d*|\.\d+))(fr|%|px)$/;function r(e){if("number"==typeof e)return Number.isFinite(e)&&e>0?`${e}fr`:null;if("string"!=typeof e)return null;const t=e.trim().toLowerCase();if("auto"===t)return"auto";const i=t.match(s);if(!i)return null;const n=Number(i[1]);return!Number.isFinite(n)||n<0||"fr"===i[2]&&0===n?null:`${n}${i[2]}`}function a(e){const t=r(e)??"1fr";if("auto"===t)return{value:0,unit:"auto"};const i=t.match(s);return{value:Number(i[1]),unit:i[2]}}function o(e){return Array.isArray(e?.column_widths)&&e.column_widths.length>0}function l(e,t){const i=Array.isArray(e)?e:[];return Array.from({length:Math.max(t,1)},(e,t)=>r(i[t])??"1fr")}function c(e,t){return l(e,t).join(" ")}function d(e,t){const i=e.columns?.length||1;return o(e)?c(e.column_widths,i):(0,n.aA)(e.layout||t,i)}function u(e){const t=e.columns?.length||1;return o(e)?l(e.column_widths,t):function(e,t){if(!e||/^\d+(?:-\d+)*$/.test(e))return null;const i=e.trim().split(/\s+/).map(r);return i.length===t&&i.every(e=>null!==e)?i:null}(e.layout,t)??function(e,t){if(e&&/^\d+(?:-\d+)*$/.test(e)){const i=e.split("-").map(e=>Math.max(Number(e)||1,1));if(i.length===t)return i}return Array.from({length:Math.max(t,1)},()=>1)}(e.layout,t).map(e=>`${e}fr`)}function p(e,t=360){const i=e.map(a);if(i.every(e=>"fr"===e.unit))return i.map(e=>e.value);let n=0,s=0;for(const e of i)"px"===e.unit?n+=e.value:"%"===e.unit?n+=e.value/100*t:s+="fr"===e.unit?e.value:1;const r=s>0?Math.max(t-n,.1*t*s)/s:0;return i.map(e=>{const i="px"===e.unit?e.value:"%"===e.unit?e.value/100*t:("fr"===e.unit?e.value:1)*r;return Math.max(i,.02*t)})}function h(e,t,i){const n=Math.max(t.split("-").length,1);for(;e.columns.length<n;)e.columns.push(i());for(;e.columns.length>n;){const t=e.columns.pop(),i=e.columns[e.columns.length-1];i.modules=[...i.modules||[],...t.modules||[]]}e.layout=t,delete e.column_widths}},4139(e,t,i){i.d(t,["Kd",0,"var(--mc-gap)","Mp",0,"magic-card","cq",0,["content","controls","layout","advanced"],"d5",0,"Magic Card","uh",0,"A fully open-source multi-module card with advanced editor","z",0,"magic-card-editor"])},4839(e,t,i){i.d(t,{$q:()=>h,I7:()=>p,iI:()=>c});var n=i(4032);function s(e,t,i,n,s){return{key:e,cssProperty:t,label:i,type:n,...s?{options:s}:{}}}function r(e,t,i,n={}){return{key:e,cssProperty:"",label:t,type:i,virtual:!0,...n}}const a=[{id:"spacing",name:"Spacing & box model",icon:"mdi:arrow-expand-all",leading:["padding","margin","width","min_height"],properties:[s("margin","margin","Margin","box"),s("padding","padding","Padding","box"),s("width","width","Width","unit"),s("height","height","Height","unit"),s("min_width","min-width","Min width","unit"),s("min_height","min-height","Min height","unit"),s("max_width","max-width","Max width","unit"),s("max_height","max-height","Max height","unit"),s("box_sizing","box-sizing","Box sizing","select",n.ai)]},{id:"borders",name:"Borders & outlines",icon:"mdi:border-all",leading:["border_radius","border_width","border_style","border_color","border_length","border_length_align","border_length_sides","box_shadow"],properties:[s("border","border","Border","text"),s("border_top","border-top","Border top","text"),s("border_right","border-right","Border right","text"),s("border_bottom","border-bottom","Border bottom","text"),s("border_left","border-left","Border left","text"),s("border_width","border-width","Border width","unit"),{...s("border_style","border-style","Border style","select",n.cx),emptyLabel:"Solid when width is set"},s("border_color","border-color","Border color","color"),r("border_length","Border length","unit",{units:["%","px"],help:"Shorten the border line, e.g. 40% for a short accent line."}),r("border_length_align","Alignment","segmented",{defaultValue:"center",options:[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"}]}),r("border_length_sides","Sides","select",{emptyLabel:"All",options:[{label:"Top",value:"top"},{label:"Right",value:"right"},{label:"Bottom",value:"bottom"},{label:"Left",value:"left"}]}),s("border_radius","border-radius","Border radius","box"),s("outline","outline","Outline","text"),s("outline_width","outline-width","Outline width","unit"),s("outline_style","outline-style","Outline style","select",n.KV),s("outline_color","outline-color","Outline color","color"),s("outline_offset","outline-offset","Outline offset","unit"),s("box_shadow","box-shadow","Box shadow","text")]},{id:"shape",name:"Shape",icon:"mdi:hexagon-outline",properties:[r("shape","Shape","shape")]},{id:"value-background",name:"Value background",icon:"mdi:chart-areaspline-variant",properties:[r("value_background","Value background","value_bg")]},{id:"positioning",name:"Positioning & layout",icon:"mdi:page-layout-body",properties:[s("position","position","Position","select",n.lQ),s("top","top","Top","unit"),s("right","right","Right","unit"),s("bottom","bottom","Bottom","unit"),s("left","left","Left","unit"),s("inset","inset","Inset","unit"),s("display","display","Display","select",n.iQ),s("visibility","visibility","Visibility","select",n.GE),s("opacity","opacity","Opacity","text"),s("z_index","z-index","Z-index","number"),s("overflow","overflow","Overflow","select",n.Oz),s("overflow_x","overflow-x","Overflow X","select",n.Oz),s("overflow_y","overflow-y","Overflow Y","select",n.Oz),s("float","float","Float","select",[{label:"None",value:"none"},{label:"Left",value:"left"},{label:"Right",value:"right"}]),s("clear","clear","Clear","select",[{label:"None",value:"none"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Both",value:"both"}]),s("cursor","cursor","Cursor","select",n.il),s("pointer_events","pointer-events","Pointer events","select",[{label:"Auto",value:"auto"},{label:"None",value:"none"}])]},{id:"typography",name:"Typography",icon:"mdi:format-font",leading:["color","font_family","font_weight","font_size","text_transform"],properties:[s("font_family","font-family","Font family","font"),s("font_size","font-size","Font size","unit"),s("font_weight","font-weight","Font weight","select",n.uE),s("font_style","font-style","Font style","select",n.zp),s("font_variant","font-variant","Font variant","text"),s("color","color","Color","color"),s("text_align","text-align","Text align","select",n.hx),s("text_decoration","text-decoration","Text decoration","select",n.Ad),s("text_transform","text-transform","Text transform","select",n.Yd),s("text_indent","text-indent","Text indent","unit"),s("text_overflow","text-overflow","Text overflow","select",n.wR),s("text_shadow","text-shadow","Text shadow","text"),s("line_height","line-height","Line height","text"),s("letter_spacing","letter-spacing","Letter spacing","unit"),s("word_spacing","word-spacing","Word spacing","unit"),s("white_space","white-space","White space","select",n.i3),s("word_break","word-break","Word break","select",n.gj),s("overflow_wrap","overflow-wrap","Overflow wrap","select",n.DE)]},{id:"backgrounds",name:"Backgrounds",icon:"mdi:image-area",properties:[s("background","background","Background","text"),s("background_color","background-color","Background color","color"),s("background_image","background-image","Background image","image"),s("background_position","background-position","Background position","text"),s("background_size","background-size","Background size","select",n.VC),s("background_repeat","background-repeat","Background repeat","select",n.PU),s("background_attachment","background-attachment","Background attachment","select",n.x2),s("background_clip","background-clip","Background clip","select",n.em),s("background_origin","background-origin","Background origin","select",n.em),s("backdrop_filter","backdrop-filter","Backdrop filter","text")]},{id:"flexbox",name:"Flexbox",icon:"mdi:view-column",properties:[s("flex_direction","flex-direction","Direction","select",n.px),s("flex_wrap","flex-wrap","Wrap","select",n.g2),s("justify_content","justify-content","Justify content","select",n.or),s("align_items","align-items","Align items","select",n.qw),s("align_content","align-content","Align content","select",n.tl),s("gap","gap","Gap","unit"),s("row_gap","row-gap","Row gap","unit"),s("column_gap","column-gap","Column gap","unit"),s("flex","flex","Flex","text"),s("flex_grow","flex-grow","Flex grow","number"),s("flex_shrink","flex-shrink","Flex shrink","number"),s("flex_basis","flex-basis","Flex basis","unit"),s("align_self","align-self","Align self","select",n.Un),s("order","order","Order","number")]},{id:"grid",name:"CSS grid",icon:"mdi:grid",properties:[s("grid_template_columns","grid-template-columns","Template columns","text"),s("grid_template_rows","grid-template-rows","Template rows","text"),s("grid_template_areas","grid-template-areas","Template areas","text"),s("grid_auto_columns","grid-auto-columns","Auto columns","text"),s("grid_auto_rows","grid-auto-rows","Auto rows","text"),s("grid_auto_flow","grid-auto-flow","Auto flow","select",n.DN),s("grid_column","grid-column","Column","text"),s("grid_row","grid-row","Row","text"),s("grid_area","grid-area","Area","text")]},{id:"transitions",name:"Transitions & animations",icon:"mdi:animation",leading:["animations"],properties:[r("animations","Animations","animations"),s("transition","transition","Transition","text"),s("transition_property","transition-property","Transition property","text"),{...s("transition_duration","transition-duration","Transition duration","unit"),units:["s","ms"]},s("transition_timing_function","transition-timing-function","Transition timing","text"),{...s("transition_delay","transition-delay","Transition delay","unit"),units:["s","ms"]},s("transform","transform","Transform","text"),s("transform_origin","transform-origin","Transform origin","text"),s("animation_name","animation-name","Animation name","text"),{...s("animation_duration","animation-duration","Animation duration","unit"),units:["s","ms"]},s("animation_timing_function","animation-timing-function","Animation timing","text"),{...s("animation_delay","animation-delay","Animation delay","unit"),units:["s","ms"]},s("animation_iteration_count","animation-iteration-count","Iteration count","text"),s("animation_direction","animation-direction","Animation direction","select",n.Ct),s("animation_fill_mode","animation-fill-mode","Fill mode","select",n.yb),s("animation_play_state","animation-play-state","Play state","select",n.xF),s("filter","filter","Filter","text")]},{id:"ring",name:"Ring",icon:"mdi:circle-double",properties:[r("ring","Ring","ring")]},{id:"lists-tables",name:"Lists & tables",icon:"mdi:format-list-bulleted",properties:[s("list_style","list-style","List style","text"),s("list_style_type","list-style-type","List style type","select",n.VB),s("list_style_position","list-style-position","List style position","select",n.yD),s("list_style_image","list-style-image","List style image","text"),s("border_collapse","border-collapse","Border collapse","select",n.ce),s("border_spacing","border-spacing","Border spacing","unit"),s("table_layout","table-layout","Table layout","select",n.V6),s("caption_side","caption-side","Caption side","select",n._0)]}],o="custom-css",l=[{id:"layout",name:"Layout",entries:["spacing","positioning","flexbox","grid"],defaultOpen:!0},{id:"style",name:"Style",entries:["backgrounds","borders","typography","shape","value-background"],defaultOpen:!0},{id:"effects",name:"Effects",entries:["ring","transitions"],defaultOpen:!1},{id:"advanced",name:"Advanced",entries:["lists-tables",o],defaultOpen:!1}];function c(e){const t=e.leading||[];return[...t.map(t=>e.properties.find(e=>e.key===t)).filter(e=>!!e),...e.properties.filter(e=>!t.includes(e.key))]}const d={margin:["top","right","bottom","left"].map(e=>({key:`margin_${e}`,cssProperty:`margin-${e}`})),padding:["top","right","bottom","left"].map(e=>({key:`padding_${e}`,cssProperty:`padding-${e}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(e=>({key:`border_${e}_radius`,cssProperty:`border-${e.replace("_","-")}-radius`}))},u={shape:["shape_options"]};function p(e){return[e,...(d[e]||[]).map(e=>e.key),...u[e]||[]]}function h(){const e={};for(const t of a)for(const i of t.properties)if(!i.virtual){e[i.key]=i.cssProperty;for(const t of d[i.key]||[])e[t.key]=t.cssProperty}return e}i.d(t,["IZ",0,a,"Qz",0,l,"Xb",0,{border_length_align:"border_length",border_length_sides:"border_length"},"Xr",0,d,"zn",0,o])},4032(e,t,i){const n=[{label:"None",value:"none"},{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"Double",value:"double"},{label:"Groove",value:"groove"},{label:"Ridge",value:"ridge"},{label:"Inset",value:"inset"},{label:"Outset",value:"outset"}],s=n;i.d(t,["Ad",0,[{label:"None",value:"none"},{label:"Underline",value:"underline"},{label:"Overline",value:"overline"},{label:"Line-through",value:"line-through"}],"Ct",0,[{label:"Normal",value:"normal"},{label:"Reverse",value:"reverse"},{label:"Alternate",value:"alternate"},{label:"Alternate-reverse",value:"alternate-reverse"}],"DE",0,[{label:"Normal",value:"normal"},{label:"Break-word",value:"break-word"},{label:"Anywhere",value:"anywhere"}],"DN",0,[{label:"Row",value:"row"},{label:"Column",value:"column"},{label:"Dense",value:"dense"},{label:"Row dense",value:"row dense"},{label:"Column dense",value:"column dense"}],"GE",0,[{label:"Visible",value:"visible"},{label:"Hidden",value:"hidden"},{label:"Collapse",value:"collapse"}],"KV",0,s,"Oz",0,[{label:"Visible",value:"visible"},{label:"Hidden",value:"hidden"},{label:"Scroll",value:"scroll"},{label:"Auto",value:"auto"}],"PU",0,[{label:"Repeat",value:"repeat"},{label:"No-repeat",value:"no-repeat"},{label:"Repeat-x",value:"repeat-x"},{label:"Repeat-y",value:"repeat-y"},{label:"Space",value:"space"},{label:"Round",value:"round"}],"Un",0,[{label:"Auto",value:"auto"},{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Baseline",value:"baseline"}],"V6",0,[{label:"Auto",value:"auto"},{label:"Fixed",value:"fixed"}],"VB",0,[{label:"None",value:"none"},{label:"Disc",value:"disc"},{label:"Circle",value:"circle"},{label:"Square",value:"square"},{label:"Decimal",value:"decimal"},{label:"Lower-alpha",value:"lower-alpha"},{label:"Upper-alpha",value:"upper-alpha"},{label:"Lower-roman",value:"lower-roman"},{label:"Upper-roman",value:"upper-roman"}],"VC",0,[{label:"Auto",value:"auto"},{label:"Cover",value:"cover"},{label:"Contain",value:"contain"}],"Yd",0,[{label:"None",value:"none"},{label:"Uppercase",value:"uppercase"},{label:"Lowercase",value:"lowercase"},{label:"Capitalize",value:"capitalize"}],"_0",0,[{label:"Top",value:"top"},{label:"Bottom",value:"bottom"}],"ai",0,[{label:"Content-box",value:"content-box"},{label:"Border-box",value:"border-box"}],"ce",0,[{label:"Separate",value:"separate"},{label:"Collapse",value:"collapse"}],"cx",0,n,"em",0,[{label:"Border-box",value:"border-box"},{label:"Padding-box",value:"padding-box"},{label:"Content-box",value:"content-box"}],"g2",0,[{label:"Nowrap",value:"nowrap"},{label:"Wrap",value:"wrap"},{label:"Wrap-reverse",value:"wrap-reverse"}],"gj",0,[{label:"Normal",value:"normal"},{label:"Break-all",value:"break-all"},{label:"Keep-all",value:"keep-all"},{label:"Break-word",value:"break-word"}],"hx",0,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"},{label:"Justify",value:"justify"}],"i3",0,[{label:"Normal",value:"normal"},{label:"Nowrap",value:"nowrap"},{label:"Pre",value:"pre"},{label:"Pre-wrap",value:"pre-wrap"},{label:"Pre-line",value:"pre-line"},{label:"Break-spaces",value:"break-spaces"}],"iQ",0,[{label:"Block",value:"block"},{label:"Inline",value:"inline"},{label:"Inline-block",value:"inline-block"},{label:"Flex",value:"flex"},{label:"Inline-flex",value:"inline-flex"},{label:"Grid",value:"grid"},{label:"Inline-grid",value:"inline-grid"},{label:"None",value:"none"},{label:"Contents",value:"contents"}],"il",0,[{label:"Auto",value:"auto"},{label:"Default",value:"default"},{label:"Pointer",value:"pointer"},{label:"Move",value:"move"},{label:"Text",value:"text"},{label:"Wait",value:"wait"},{label:"Crosshair",value:"crosshair"},{label:"Not-allowed",value:"not-allowed"},{label:"Grab",value:"grab"},{label:"None",value:"none"}],"lQ",0,[{label:"Static",value:"static"},{label:"Relative",value:"relative"},{label:"Absolute",value:"absolute"},{label:"Fixed",value:"fixed"},{label:"Sticky",value:"sticky"}],"or",0,[{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Space-between",value:"space-between"},{label:"Space-around",value:"space-around"},{label:"Space-evenly",value:"space-evenly"}],"px",0,[{label:"Row",value:"row"},{label:"Row-reverse",value:"row-reverse"},{label:"Column",value:"column"},{label:"Column-reverse",value:"column-reverse"}],"qw",0,[{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Baseline",value:"baseline"}],"tl",0,[{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Space-between",value:"space-between"},{label:"Space-around",value:"space-around"}],"uE",0,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"100",value:"100"},{label:"200",value:"200"},{label:"300",value:"300"},{label:"400",value:"400"},{label:"500",value:"500"},{label:"600",value:"600"},{label:"700",value:"700"},{label:"800",value:"800"},{label:"900",value:"900"}],"wR",0,[{label:"Clip",value:"clip"},{label:"Ellipsis",value:"ellipsis"}],"x2",0,[{label:"Scroll",value:"scroll"},{label:"Fixed",value:"fixed"},{label:"Local",value:"local"}],"xF",0,[{label:"Running",value:"running"},{label:"Paused",value:"paused"}],"yD",0,[{label:"Outside",value:"outside"},{label:"Inside",value:"inside"}],"yb",0,[{label:"None",value:"none"},{label:"Forwards",value:"forwards"},{label:"Backwards",value:"backwards"},{label:"Both",value:"both"}],"zp",0,[{label:"Normal",value:"normal"},{label:"Italic",value:"italic"},{label:"Oblique",value:"oblique"}]])},3041(e,t,i){i.d(t,{AT:()=>F,DA:()=>W,ID:()=>p,Q6:()=>w,Rn:()=>k,VR:()=>$,a7:()=>B,aA:()=>C,eI:()=>D,fV:()=>j,th:()=>h,zg:()=>m});var n=i(4839),s=i(209),r=i(8521),a=i(3722);const o=(0,n.$q)(),l=n.IZ.flatMap(e=>e.properties).filter(e=>"color"===e.type).map(e=>e.key),c=new Set(n.IZ.flatMap(e=>e.properties).filter(e=>"image"===e.type).map(e=>e.key)),d={...Object.fromEntries(n.IZ.flatMap(e=>e.properties).filter(e=>"unit"===e.type||"box"===e.type).flatMap(e=>{const t=e.units?.includes("s")?"s":"px";return[[e.key,t],...(n.Xr[e.key]||[]).map(e=>[e.key,t])]})),border_length:"%"};function u(e){if(!e)return e;const t=e;let i;for(const[e,n]of Object.entries(t))"number"==typeof n&&(i??={...t},Number.isFinite(n)?i[e]=`${n}${d[e]??""}`:delete i[e]);return i??e}function p(e){if(!e)return e;const t=e;let i;for(const e of l){const n=(0,r.a0)(t[e]);n&&((i??={...t})[e]=n)}return Array.isArray(t.animations)&&t.animations.some(e=>(0,r.ls)(e?.color))&&((i??={...t}).animations=t.animations.map(e=>(0,r.ls)(e?.color)?{...e,color:(0,r.a0)(e.color)}:e)),i??e}function h(e){if(!e)return!1;const t=e;if(l.some(e=>(0,r.ls)(t[e])))return!0;if(Array.isArray(t.animations)&&t.animations.some(e=>(0,r.ls)(e?.color)))return!0;const i=t.ring;return!(!i||!(0,r.ls)(i.color)&&!(0,r.ls)(i.track_color))||(!(!t.hover||!h(t.hover))||Array.isArray(t.conditional)&&t.conditional.some(e=>h(e?.design)))}function m(e){if(!e)return"";const t=p(u(e)),i=[],n=t;for(const[e,t]of Object.entries(o)){let s=n[e];"string"==typeof s&&c.has(e)&&(s=(0,a.zi)(void 0,s)),void 0!==s&&"string"==typeof s&&""!==s&&i.push(`${t}: ${s}`)}const s=function(e){if(y(e.border_style))return;const t=R(e);if(!T.some(e=>t[e].widthSet&&!t[e].styleSet))return;const i=T.map(e=>t[e].style);return i.every(e=>e===i[0])?i[0]:i.join(" ")}(n);s&&i.push(`border-style: ${s}`),"string"==typeof t.color&&""!==t.color&&(i.push(`--mc-design-color: ${t.color}`),i.push("--icon-primary-color: currentColor"));const r=function(e){const t={},i=y(e.border_radius);if(i){const e=i.indexOf("/"),n=v(e>=0?i.slice(0,e):i),s=e>=0?v(i.slice(e+1)):[];if(n.length){const e=b(n),i=s.length?b(s):void 0;f.forEach((n,s)=>t[n]=i?`${e[s]} ${i[s]}`:e[s])}}for(const i of f){const n=y(e[g[i]]);n&&(t[i]=n)}return t}(n);for(const e of f)r[e]&&i.push(`--mc-design-radius-${e}: ${r[e]}`);const l=y(n.background_color)??y(n.background);return l&&i.push(`--mc-design-bg: ${l}`),t.css&&i.push(t.css),i.join("; ")}const f=["tl","tr","br","bl"],g={tl:"border_top_left_radius",tr:"border_top_right_radius",br:"border_bottom_right_radius",bl:"border_bottom_left_radius"};function y(e){return"string"==typeof e&&""!==e.trim()?e.trim():void 0}function v(e){const t=[];let i=0,n="";for(const s of e)"("===s?i++:")"===s&&(i=Math.max(0,i-1)),/\s/.test(s)&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}function b(e){const[t,i=t,n=t,s=i]=e;return[t,i,n,s]}function w(e){const t=[];let i=0,n="",s="";for(const r of e){if(n)r===n&&(n="");else if('"'===r||"'"===r)n=r;else if("("===r)i++;else if(")"===r)i=Math.max(0,i-1);else if(";"===r&&0===i){s.trim()&&t.push(s.trim()),s="";continue}s+=r}return s.trim()&&t.push(s.trim()),t}const x=e=>/!important\s*$/i.test(e)?e:`${e} !important`,_=e=>e.replace(/[{}@]/g,"");function $(e,t,i={}){if(!t||"object"!=typeof t)return"";const n=w(_(m(t))).filter(e=>e.includes(":")).map(x);if(!n.length)return"";const s=`[data-mc-hover="${e.replace(/["\\]/g,"\\$&")}"]:hover`,r=p(u(t))||{},a=y(r.border_color)&&_(y(r.border_color).replace(/;/g,"")),o=[],{shape:l,borderLength:c}=i;if(l){const e={...l.design||{},...t};n.push(...w(W(e,l.padding)).map(x)),a&&o.push(`${s} ${l.card?"~":">"} mc-shape { --mc-shape-stroke: ${a}; }`);const i=y(r.box_shadow);if(i){const e=_(B(i)??"none");o.push(`.mc-shape-shadow:has(> ${l.card?"ha-card > ":""}${s}) { filter: ${e} !important; }`)}}else c&&(n.push(...w(c.style).map(x)),a&&o.push(`${s} > .mc-border-fx > i { border-color: ${a} !important; }`));return[`${s} { ${n.join("; ")}; }`,...o].join(" ")}function k(e,t,i){if(!e?.conditional?.length||!t)return e;const{conditional:n,...r}=e,a={...r};for(const e of n){if(!e||!Array.isArray(e.conditions))continue;const n=e.conditions.map(e=>e&&!1!==e.use_module_entity&&i&&!e.entity?{...e,entity:i}:e);if(s.g.ruleMatches({conditions:n,mode:e.mode},t)){const t=e.design||{};for(const[e,i]of Object.entries(t))void 0!==i&&(a[e]=i)}}return a}function M(e){return Array.from({length:Math.max(e,1)},()=>"1fr").join(" ")}function S(e){return/^\d+(?:-\d+)*$/.test(e)?e.split("-").length:null}function C(e,t){if(!e)return M(t??1);const i={1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"};if(i[e])return t&&S(e)&&S(e)!==t?M(t):i[e];if(/^\d+(?:-\d+)+$/.test(e)){const i=e.split("-").length;return t&&i!==t?M(t):e.split("-").map(e=>`${Math.max(Number(e)||1,1)}fr`).join(" ")}return e}const T=["top","right","bottom","left"],A=new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]),E={thin:"1px",medium:"3px",thick:"5px"},P={start:"0",center:"0.5",end:"1"},z=e=>/^(-?[\d.]+[a-z%]*|thin|medium|thick|(calc|min|max|clamp)\(.*\))$/i.test(e),L=e=>E[e.toLowerCase()]??e;function O(e){const[t,i=t,n=t,s=i]=v(e);return[t,i,n,s]}function q(e){const t={width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1},i=[];for(const n of v(e))A.has(n.toLowerCase())?(t.style=n.toLowerCase(),t.styleSet=!0):z(n)?(t.width=L(n),t.widthSet=!0):i.push(n);return i.length&&(t.color=i.join(" ")),t}function R(e){const t=y(e.border),i=Object.fromEntries(T.map(e=>[e,t?q(t):{width:"3px",style:"none",color:"currentColor",widthSet:!1,styleSet:!1}]));for(const t of T){const n=y(e[`border_${t}`]);n&&(i[t]=q(n))}const n=(t,n,s=e=>e)=>{const r=y(e[t]);r&&O(r).forEach((e,t)=>{const r=i[T[t]];r[n]=s(e),"width"===n&&(r.widthSet=!0),"style"===n&&(r.styleSet=!0)})};n("border_width","width",L),n("border_style","style",e=>e.toLowerCase()),n("border_color","color");for(const e of T)i[e].widthSet&&!i[e].styleSet&&(i[e].style="solid");return i}const N=e=>"none"!==e.style&&"hidden"!==e.style&&!/^0+(\.0+)?[a-z%]*$/i.test(e.width);function I(e){const t=y(e.border_length);if(!t||"100%"===t)return;const i=R(e),n=y(e.border_length_sides),s=n&&T.includes(n)?[n]:T,r=e=>i[e].widthSet||i[e].styleSet,a=new Set(s.filter(e=>!r(e)&&(n||!T.some(r))));for(const e of a)Object.assign(i[e],{width:"2px",style:"solid"});const o=s.filter(e=>N(i[e]));return o.length?{length:t,sides:i,drawn:o,defaulted:a,hasBorder:r}:void 0}function j(e){const t=p(u(e))||{},i=I(t);if(!i)return;const{length:n,sides:s,drawn:r,defaulted:a,hasBorder:o}=i,l=P[y(t.border_length_align)??"center"]??"0.5",c=`min(${n}, 100%)`,d=`calc((100% - ${c}) * ${l})`,h=`calc((100% - ${c}) * ${l} + ${c})`,m=r.map(e=>{const t=s[e],i=`linear-gradient(${"top"===e||"bottom"===e?"to right":"to bottom"}, transparent ${d}, #000 ${d}, #000 ${h}, transparent ${h})`;return{side:e,style:`inset: 0; border-radius: inherit; border-${e}: ${t.width} ${t.style} ${t.color}; -webkit-mask-image: ${i}; mask-image: ${i}`}}),f=e=>(e=>a.has(e)||o(e)&&"none"!==s[e].style&&"hidden"!==s[e].style)(e)?s[e].width:"0px",g=`${T.map(e=>`${e}: calc(-1 * ${f(e)})`).join("; ")}; border-radius: inherit`,v=[...[...a].map(e=>`border-${e}-width: ${s[e].width}; border-${e}-style: solid`),"border-color: transparent"],b=[t.overflow,t.overflow_x,t.overflow_y].map(e=>y(e)).filter(Boolean);if(b.length&&b.every(e=>"hidden"===e||"clip"===e)){const e=[...new Set(r.map(e=>s[e].width))],t=e.every(e=>/^[\d.]+px$/.test(e))?`${Math.max(...e.map(e=>parseFloat(e)))}px`:1===e.length?e[0]:`max(${e.join(", ")})`;v.push("overflow: clip",`overflow-clip-margin: ${t}`)}return{style:v.join("; "),overlayStyle:g,lines:m}}function D(e){const t=p(u(e))||{},i=I(t),n=i?.sides??R(t),s=i?.drawn??T.filter(e=>(n[e].widthSet||n[e].styleSet)&&N(n[e]));if(!s.length)return;const r=n[s[0]],a="dashed"===r.style||"dotted"===r.style?r.style:"solid",o={width:r.width,style:a,color:r.color},l=y(t.border_length_align);return(i||s.length<4)&&(o.length={value:i?.length??"100%",align:"start"===l||"end"===l?l:"center",sides:s}),o}function B(e){const t=y(e);if(!t)return;let i=0,n="";for(const e of t){if("("===e?i++:")"===e&&(i=Math.max(0,i-1)),","===e&&0===i)break;n+=e}const s=v(n.trim());if(!s.length||s.some(e=>/^(inset|none)$/i.test(e)))return;const r=e=>/^-?[\d.]+(px|em|rem|%)?$/i.test(e)||/^(calc|min|max|clamp)\(/i.test(e),a=s.filter(r),o=s.filter(e=>!r(e)).join(" ");if(a.length<2)return;const l=e=>/^-?[\d.]+$/.test(e)?`${e}px`:e;return`drop-shadow(${l(a[0])} ${l(a[1])} ${l(a[2]??"0")}${o?` ${o}`:""})`}function W(e,t,i){return["border-color: transparent","box-shadow: none",F(e,t,{shape:!0,min:i})].join("; ")}function F(e,t,i){const n=e||{},s=e=>"number"==typeof e&&Number.isFinite(e)?String(e):y(e),r=O(s(n.padding)??y(t)??"0px");T.forEach((e,t)=>{r[t]=s(n[`padding_${e}`])??r[t]});for(const e of(y(n.css)??"").split(";")){const t=/^\s*(padding(?:-(top|right|bottom|left))?)\s*:\s*(.+?)\s*(?:!important)?\s*$/i.exec(e);t&&(t[2]?r[T.indexOf(t[2].toLowerCase())]=t[3]:O(t[3]).forEach((e,t)=>r[t]=e))}const a=["it","ir","ib","il"];return T.map((e,t)=>{const n=[(s=r[t],/^-?(\d+\.?\d*|\.\d+)$/.test(s)?`${s}px`:s)];var s;return i.shape&&n.push(`var(--mc-shape-${a[t]}, 0px)`),i.min?.[t]&&n.push(`${i.min[t]}px`),`padding-${e}: max(${n.join(", ")})`}).join("; ")}},5743(e,t,i){i.d(t,{B:()=>r,Gd:()=>s,ux:()=>a});var n=i(7428);function s(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[s,r]of Object.entries(e))if("custom_animations"!==s)if("preset"===s&&(0,n.Bl)(r)){const e=(0,n._R)(r);e&&t.add(e)}else r&&"object"==typeof r&&i(r)};return i(e),[...t]}function r(e){return Array.isArray(e)?e.filter(e=>!!e&&"object"==typeof e):e&&"object"==typeof e?Object.entries(e).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]}function a(e,t){const i=new Map(r(e.custom_animations).map(e=>[String(e.id),e])),a=new Map,o=[],l=s(e);for(;l.length;){const e=l.shift();if(a.has(e)||o.includes(e))continue;const s=t(e)??i.get(e);if(!s){o.push(e);continue}a.set(e,s);const r=s.steps;for(const e of Array.isArray(r)?r:[])"string"==typeof e?.animation&&e.animation.startsWith(n.D8)&&l.push((0,n._R)(e.animation))}if(!a.size)return{config:e,embedded:[],missing:o};const c=[...a.keys()];for(const[e,t]of i)a.has(e)||a.set(e,t);return{config:{...e,custom_animations:[...a.values()]},embedded:c,missing:o}}},5183(e,t,i){function n(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>n(e));const t={};for(const i of Object.keys(e))t[i]=n(e[i]);return t}i.d(t,{G:()=>n})},8521(e,t,i){i.d(t,{a0:()=>p,id:()=>o,ls:()=>u,mu:()=>r,qB:()=>d});const n=new Set(["off","unavailable","unknown","idle","standby"]),s=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function r(e){if(!e)return!1;const t=e.entity_id.split(".")[0],i=e.state;if(n.has(i))return!1;switch(t){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function a(e){const t=e.rgb_color;if(Array.isArray(t)&&t.length>=3&&t.every(e=>"number"==typeof e))return`rgb(${t[0]}, ${t[1]}, ${t[2]})`;const i=e.hs_color;if(Array.isArray(i)&&i.length>=2&&"number"==typeof i[0]&&"number"==typeof i[1]){const[e,t,n]=function(e,t){const i=Math.max(0,Math.min(100,t))/100,n=t=>{const n=(t+e/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(e=>Math.round(255*e))}(i[0],i[1]);return`rgb(${e}, ${t}, ${n})`}}function o(e){if(!e)return;const t=e.entity_id.split(".")[0];if(!s.has(t))return;if(!r(e))return`var(--state-${t}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=a(e.attributes||{});if(i)return i;return`var(--state-${t}-${e.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${t}-active-color, var(--state-active-color, var(--primary-color))))`}const l="--mc-entity-color",c=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function d(e){if("string"!=typeof e)return;const t=e.trim().match(c);return t?{opacity:void 0===t[1]?100:Math.min(100,Number(t[1]))}:void 0}function u(e){return void 0!==d(e)}function p(e){const t=d(e);if(!t)return;const i=`var(${l}, currentColor)`;return t.opacity>=100?i:`color-mix(in srgb, ${i} ${t.opacity}%, transparent)`}i.d(t,["MZ",0,l])},1831(e,t,i){i.d(t,{Aw:()=>p,Bw:()=>$,C8:()=>_,Ee:()=>w,H3:()=>M,Vb:()=>m,c9:()=>d,eI:()=>u,fR:()=>x,pR:()=>g,rD:()=>T,wu:()=>f});var n=i(4099),s=i(5441);const r=new Set(["unavailable","unknown"]),a=new Set(["brightness","color_temp","hs","xy","rgb","rgbw","rgbww","white"]),o=new Set(["hs","xy","rgb","rgbw","rgbww"]),l=e=>{if("number"==typeof e)return Number.isFinite(e)?e:void 0;if("string"==typeof e&&e.trim()){const t=Number(e);return Number.isFinite(t)?t:void 0}};function c(e){const t=e.attributes?.supported_color_modes;return Array.isArray(t)?t:void 0}function d(e){const t=c(e);return!t||t.some(e=>a.has(e))}function u(e){const t=c(e);return!t||t.includes("color_temp")}function p(e){const t=c(e);return!t||t.some(e=>o.has(e))}function h(e,t){const i=e.attributes?.supported_features;return null==i||0!==(Number(i)&t)}function m(e){const t=e.attributes||{},i=e=>{const t=l(e);return t&&t>0?Math.round(1e6/t):void 0};return{min:l(t.min_color_temp_kelvin)??i(t.max_mireds)??2e3,max:l(t.max_color_temp_kelvin)??i(t.min_mireds)??6500}}function f(e){const t=e.attributes||{},i=l(t.color_temp_kelvin);if(void 0!==i)return i;const n=l(t.color_temp);return n?Math.round(1e6/n):void 0}function g(e){if("off"===e.state)return 0;const t=l(e.attributes?.brightness);return void 0===t?void 0:Math.max(1,Math.round(t/255*100))}const y=(e,t,i,n={})=>({domain:e,service:t,data:{entity_id:i,...n}});const v=e=>"number"==typeof e&&Number.isFinite(e);function b(e){if(!v(e))return 0;for(let t=0;t<=6;t++){const i=e*10**t;if(Math.abs(i-Math.round(i))<1e-9*Math.max(1,Math.abs(i)))return t}}function w(e,t,i,n){const s=Math.max(b(n)??4,b(t)??4),r=n>0?t+Math.round((e-t)/n)*n:e,a=Math.min(i,Math.max(t,r));return Number(a.toFixed(s))}function x(e,t,i,a={}){const o=function(e,t,i){const r=t.entity_id,a=r.split(".")[0],o=t.attributes||{},c=String(e?.config?.unit_system?.temperature??o.temperature_unit??""),p=()=>({value:(0,n.f4)(t,i),unit:i?"":String(o.unit_of_measurement??"")});switch(a){case"input_number":case"number":return i?p():{value:(0,n.f4)(t),min:l(o.min),max:l(o.max),step:l(o.step),unit:String(o.unit_of_measurement??""),call:e=>y(a,"set_value",r,{value:e})};case"climate":{const e={min:l(o.min_temp),max:l(o.max_temp),step:l(o.target_temp_step)??("°F"===c?1:.5)};if(!i||"temperature"===i)return{value:l(o.temperature),...e,unit:c,call:e=>y("climate","set_temperature",r,{temperature:e})};if("target_temp_low"===i||"target_temp_high"===i){const t="target_temp_low"===i,n=t?"target_temp_high":"target_temp_low",a=(0,s.g7)(),d=l(o[n]);return{value:l(o[i]),...e,unit:c,call:void 0===l(o[i])||void 0===d?void 0:e=>{const i=(0,s.TR)(a,r,n)??d;return y("climate","set_temperature",r,{target_temp_low:t?e:i,target_temp_high:t?i:e})}}}return"humidity"===i?{value:l(o.humidity),min:l(o.min_humidity)??30,max:l(o.max_humidity)??99,step:1,unit:"%",call:e=>y("climate","set_humidity",r,{humidity:Math.round(e)})}:p()}case"water_heater":return i&&"temperature"!==i?p():{value:l(o.temperature),min:l(o.min_temp),max:l(o.max_temp),step:l(o.target_temp_step)??("°F"===c?1:.5),unit:c,call:e=>y("water_heater","set_temperature",r,{temperature:e})};case"humidifier":return i&&"humidity"!==i?p():{value:l(o.humidity),min:l(o.min_humidity)??0,max:l(o.max_humidity)??100,step:1,unit:"%",call:e=>y("humidifier","set_humidity",r,{humidity:Math.round(e)})};case"light":if(!i||"brightness"===i||"brightness_pct"===i)return d(t)?{value:g(t),min:0,max:100,step:1,unit:"%",call:e=>e<=0?y("light","turn_off",r):y("light","turn_on",r,{brightness_pct:Math.round(e)})}:{value:"on"===t.state?100:0,min:0,max:100,step:1,unit:"%"};if("color_temp_kelvin"===i||"color_temp"===i){const e=m(t);return{value:"on"===t.state?f(t):void 0,...e,step:50,unit:"K",call:u(t)?e=>y("light","turn_on",r,{color_temp_kelvin:Math.round(e)}):void 0}}return p();case"fan":return i&&"percentage"!==i?p():{value:"off"===t.state?0:l(o.percentage),min:0,max:100,step:l(o.percentage_step)??1,unit:"%",call:h(t,1)?e=>y("fan","set_percentage",r,{percentage:Math.round(e)}):void 0};case"cover":return"current_tilt_position"===i?{value:l(o.current_tilt_position),min:0,max:100,step:1,unit:"%",call:h(t,128)?e=>y("cover","set_cover_tilt_position",r,{tilt_position:Math.round(e)}):void 0}:i&&"current_position"!==i?p():{value:l(o.current_position),min:0,max:100,step:1,unit:"%",call:h(t,4)?e=>y("cover","set_cover_position",r,{position:Math.round(e)}):void 0};case"valve":return i&&"current_position"!==i?p():{value:l(o.current_position),min:0,max:100,step:1,unit:"%",call:h(t,4)?e=>y("valve","set_valve_position",r,{position:Math.round(e)}):void 0};case"media_player":{if(i&&"volume_level"!==i)return p();const e=l(o.volume_level);return{value:void 0===e?void 0:Math.round(100*e),min:0,max:100,step:1,unit:"%",call:void 0!==e&&h(t,4)?e=>y("media_player","volume_set",r,{volume_level:Math.round(e)/100}):void 0}}default:return p()}}(e,t,i||void 0);let c=v(o.min)?o.min:void 0,p=v(o.max)?o.max:void 0;v(a.min)&&(c=void 0===c?a.min:Math.max(c,a.min)),v(a.max)&&(p=void 0===p?a.max:Math.min(p,a.max)),c=c??0,p=p??100,p<=c&&(c=v(o.min)?o.min:0,p=v(o.max)&&o.max>c?o.max:c+100);const b=function(e,t){const i=v(t)&&t>0?t:void 0,n=v(e)&&e>0?e:void 0;if(void 0!==i&&void 0!==n){const e=i/n;return Math.abs(e-Math.round(e))<1e-6&&Math.round(e)>=1?i:n}return i??n??1}(o.step,a.step),w=r.has(t.state),x=w||void 0===o.value?void 0:o.value,_=w||!o.call;return{value:x,min:c,max:p,step:b,unit:o.unit,readOnly:_,call:_?void 0:o.call}}function _(e,t,i){const s=Math.max(b(t.step)??0,Math.min(2,b(i)??2));return(0,n.$g)((0,n.gn)(e,i,s),t.unit)}function $(e,t){Promise.resolve(e.callService(t.domain,t.service,t.data)).catch(e=>{console.warn(`Magic Card: ${t.domain}.${t.service} failed`,e)})}const k=new Set(["closed","locked","off"]);function M(e,t){const i=t.split(".")[0],n=e?.states?.[t]?.state,s=void 0!==n&&k.has(n),r="group"===i?"homeassistant":i;let a;switch(i){case"lock":a=s?"unlock":"lock";break;case"cover":a=s?"open_cover":"close_cover";break;case"valve":a=s?"open_valve":"close_valve";break;case"button":case"input_button":a="press";break;case"scene":a="turn_on";break;default:a=s?"turn_on":"turn_off"}return{domain:r,service:a,data:{entity_id:t}}}const S=new Set(["light","switch","fan","input_boolean","automation","humidifier"]),C=new Set(["script","scene"]);function T(e){const t=e.split(".")[0];return{tap_action:S.has(t)?{action:"toggle"}:C.has(t)?{action:"perform-action",service:`${t}.turn_on`,data:{entity_id:e}}:{action:"more-info"},hold_action:{action:"more-info"}}}},8497(e,t,i){i.d(t,{CU:()=>a,TO:()=>c,fq:()=>o,hZ:()=>l});var n=i(6161);const s={light:["mdi:lightbulb","mdi:lightbulb-outline"],switch:["mdi:toggle-switch-variant","mdi:toggle-switch-variant-off"],input_boolean:["mdi:check-circle-outline","mdi:close-circle-outline"],binary_sensor:["mdi:checkbox-marked-circle","mdi:radiobox-blank"],fan:["mdi:fan","mdi:fan-off"],automation:["mdi:robot","mdi:robot-off"],lock:["mdi:lock","mdi:lock-open-variant"],cover:["mdi:window-shutter-open","mdi:window-shutter"],valve:["mdi:valve-open","mdi:valve-closed"],media_player:["mdi:cast-connected","mdi:cast"],person:["mdi:account","mdi:account-arrow-right"],device_tracker:["mdi:account","mdi:account-arrow-right"],siren:["mdi:bullhorn","mdi:bullhorn-outline"],remote:["mdi:remote","mdi:remote-off"]},r={sensor:"mdi:eye",climate:"mdi:thermostat",camera:"mdi:video",script:"mdi:script-text",scene:"mdi:palette",input_number:"mdi:ray-vertex",number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",text:"mdi:form-textbox",input_datetime:"mdi:calendar-clock",input_button:"mdi:button-pointer",button:"mdi:button-pointer",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home",zone:"mdi:map-marker-radius",timer:"mdi:timer-outline",counter:"mdi:counter",update:"mdi:package-up",calendar:"mdi:calendar",todo:"mdi:clipboard-list",event:"mdi:eye-check",image:"mdi:image"};function a(e,t,i){if(!t||"unavailable"===t||"unknown"===t)return!1;switch(e){case"lock":return"locked"===t;case"cover":case"valve":return"closed"!==t;case"person":case"device_tracker":return"home"===t;case"media_player":return!["off","standby","idle"].includes(t);case"climate":{const e=i?.hvac_action;return"string"==typeof e&&e?"heating"===e||"cooling"===e:"heat"===t||"cool"===t||"heat_cool"===t}case"alarm_control_panel":return t.startsWith("armed_");case"vacuum":return"cleaning"===t;default:return"on"===t}}function o(e,t){if(!e||!t)return;const i=e.entities?.[t]?.icon;if(i)return i;const n=e.states?.[t],o=n?.attributes?.icon;return"string"==typeof o&&o?o:n?function(e,t){const i=s[e];return i?a(e,t??"")?i[0]:i[1]:r[e]}(t.split(".")[0],n.state):void 0}function l(e,t,i,n){if(!t||!i&&!n)return;const s=e?.states?.[t];return s&&(a(t.split(".")[0],s.state,s.attributes)?i:n)||void 0}function c(e,t,i,s="",r){const a=t?e?.states?.[t]:void 0;return a&&"undefined"!=typeof customElements&&customElements.get("ha-state-icon")?n.qy`<ha-state-icon class=${s} data-mc-part=${r??n.s6} .hass=${e} .stateObj=${a}></ha-state-icon>`:n.qy`<ha-icon class=${s} data-mc-part=${r??n.s6} .icon=${o(e,t)||i}></ha-icon>`}},4099(e,t,i){i.d(t,{$g:()=>l,Ai:()=>c,Pd:()=>r,f4:()=>a,gn:()=>o,tX:()=>d});var n=i(7812);const s=new Set(["unavailable","unknown"]);function r(e,t){return!e||(t?void 0===e.attributes?.[t]||null===e.attributes[t]:s.has(e.state))}function a(e,t){if(!e)return;const i=t?e.attributes?.[t]:e.state;if("number"==typeof i)return Number.isFinite(i)?i:void 0;if("string"!=typeof i||!i.trim())return;const n=Number(i);return Number.isFinite(n)?n:void 0}function o(e,t,i){const s=Math.max(0,Math.min(10,Math.round(i))),r={minimumFractionDigits:s,maximumFractionDigits:s};"none"===e?.locale?.number_format&&(r.useGrouping=!1);try{return new Intl.NumberFormat(e?(0,n.eN)(e):void 0,r).format(t)}catch{return t.toFixed(s)}}function l(e,t){return t?/^(%|°)$/.test(t)?`${e}${t}`:`${e} ${t}`:e}function c(e,t,i,n={}){const s=e;let r;try{const e=i?s?.formatEntityAttributeValueToParts?.(t,i):s?.formatEntityStateToParts?.(t);Array.isArray(e)&&e.length&&(r=function(e){const t=e.filter(e=>"unit"===e.type).map(e=>e.value).join("");return{value:e.filter(e=>"value"===e.type).map(e=>e.value).join("")||e.filter(e=>"unit"!==e.type).map(e=>e.value).join("").trim(),unit:t,text:e.map(e=>e.value).join("")}}(e))}catch{r=void 0}if(!r){const e=i?t.attributes?.[i]:t.state;let n;try{n=i?s?.formatEntityAttributeValue?.(t,i):s?.formatEntityState?.(t)}catch{n=void 0}const a=i?"":String(t.attributes?.unit_of_measurement??"");if(null==n){const t=null==e?"":"object"==typeof e?JSON.stringify(e):String(e);r={value:t,unit:a,text:l(t,a)}}else r=a&&n.endsWith(a)?{value:n.slice(0,-a.length).trimEnd(),unit:a,text:n}:{value:n,unit:"",text:n}}const c=void 0!==n.decimals&&null!==n.decimals&&Number.isFinite(Number(n.decimals))?a(t,i):void 0;if(void 0!==c){const t=o(e,c,Number(n.decimals));r={value:t,unit:r.unit,text:l(t,r.unit)}}return r}function d(e,t){const i=e?.formatEntityName;let n;try{n=i?.(t)}catch{n=void 0}return n=n||t.attributes?.friendly_name,"string"==typeof n&&n?n:t.entity_id}},2908(e,t,i){i.d(t,{kc:()=>b,pv:()=>g,rP:()=>y});var n=i(340),s=i(8521),r=i(4099);const a={route:"curve",min:0,max:1e3,reverse_negative:!0,color:"var(--primary-color)",idle_color:"color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)",width:3,scale_width:!0,dots:3,dot_size:6,speed:2,min_speed:8,glow:0,label:"none",label_position:"auto",show_when:"always",layer:"back"},o=new Set(["top","right","bottom","left"]),l=new Set(["curve","straight","elbow"]),c=new Set(["auto","line","side","hidden"]),d=/^(\d+(?:\.\d+)?)\s*%$/;function u(e){const t="string"==typeof e&&e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0}function p(e,t){const i=u(e);return void 0!==i&&i>0?i:t}function h(e){return"string"==typeof e&&o.has(e)?e:"auto"}function m(e,t){return t>=100?e:`color-mix(in srgb, ${e} ${t}%, transparent)`}function f(e,t,i,r){const a=(0,s.qB)(e);if(a){return m((i?(0,s.id)(t?.states?.[i]):void 0)??r,a.opacity)}return(0,n.f8)(e)??r}function g(e,t,i,n=0){const s=Math.max(0,u(e.min)??a.min),o=u(e.max)??a.max,g=Math.max(.2,p(e.speed,a.speed)),y=Math.max(.2,p(e.min_speed,a.min_speed)),v=Math.min(40,p(e.width,a.width)),b=e.scale_width??a.scale_width,w=e.reverse_negative??a.reverse_negative;let x=!0,_=1,$=g,k=v;const M=e.entity?t?.states?.[e.entity]:void 0;if(e.entity){const t=(0,r.f4)(M,e.attribute||void 0),i=void 0===t?void 0:Math.abs(t);if(void 0===i||i<=s)x=!1,_=0,$=y;else{const e=o>s?Math.min(1,Math.max(0,Math.log1p(i-s)/Math.log1p(o-s))):1;$=y+(g-y)*e,b&&(k=v*(1+e)),_=t<0&&w?-1:1}}const S=e.entity||i,C=f(e.color??a.color,t,S,a.color),T="string"==typeof e.idle_color&&e.idle_color.trim()?e.idle_color.trim():"",A=T.match(d),E=A?m(C,Math.min(100,Number(A[1]))):T?f(T,t,S,a.idle_color):a.idle_color,P=u(e.dots),z=void 0===P?a.dots:Math.min(8,Math.max(0,Math.round(P))),L=u(e.glow),O=e.label??a.label;let q,R;"value"===O&&M?q=(0,r.Ai)(t,M,e.attribute||void 0).text:"template"===O&&"string"==typeof e.label_template&&e.label_template&&(R=e.label_template);const N="string"==typeof e.from?e.from:"",I="string"==typeof e.to?e.to:"",j=e.show_when??a.show_when,D=!!N&&!!I&&N!==I&&("flowing"!==j||x),B={id:"string"==typeof e.id&&e.id?e.id:N&&I?`${N}>${I}`:`flow~${n}`,from:N,to:I,fromSide:h(e.from_side),toSide:h(e.to_side),route:"string"==typeof e.route&&l.has(e.route)?e.route:a.route,active:x,direction:_,speedS:$,width:k,color:C,idleColor:E,dots:z,dotSize:Math.min(40,p(e.dot_size,a.dot_size)),glow:void 0!==L&&L>0?Math.min(30,L):a.glow,visible:D,layer:"front"===e.layer?"front":"back",labelPosition:"string"==typeof e.label_position&&c.has(e.label_position)?e.label_position:a.label_position};return void 0!==q&&(B.label=q),void 0!==R&&(B.labelTemplate=R),B}function y(e){const t=new Set;return(e??[]).map((e,i)=>{const n=e&&"object"==typeof e?e:{},s="string"==typeof n.from?n.from:"",r="string"==typeof n.to?n.to:"";let a="string"==typeof n.id&&n.id?n.id:s&&r?`${s}>${r}`:`flow~${i}`;return t.has(a)&&(a=`${a}~${i}`),t.add(a),a})}const v=new WeakMap;function b(e){let t=v.get(e);if(t)return t;const i=new Map,n=e=>{if(!e||"object"!=typeof e)return;if(Array.isArray(e))return void e.forEach(n);const t=e;"string"!=typeof t.id||"string"!=typeof t.type||i.has(t.id)||i.set(t.id,"string"==typeof t.entity?t.entity:void 0);for(const e of["columns","modules","tabs"])n(t[e])};return n(e.rows),t=i,v.set(e,t),t}i.d(t,["Y1",0,a])},9620(e,t,i){i.d(t,{E$:()=>m,Wb:()=>u});const n=[300,400,500,700],s=[{name:"Roboto",family:"Roboto, sans-serif",category:"Sans-serif"},{name:"Open Sans",family:'"Open Sans", sans-serif',category:"Sans-serif"},{name:"Lato",family:"Lato, sans-serif",category:"Sans-serif",weights:[300,400,700]},{name:"Montserrat",family:"Montserrat, sans-serif",category:"Sans-serif"},{name:"Oswald",family:"Oswald, sans-serif",category:"Sans-serif"},{name:"Source Sans Pro",family:'"Source Sans Pro", sans-serif',category:"Sans-serif",weights:[300,400,700]},{name:"Raleway",family:"Raleway, sans-serif",category:"Sans-serif"},{name:"PT Sans",family:'"PT Sans", sans-serif',category:"Sans-serif",weights:[400,700]},{name:"Merriweather",family:"Merriweather, serif",category:"Serif"},{name:"Playfair Display",family:'"Playfair Display", serif',category:"Serif",weights:[400,500,700]},{name:"Lora",family:"Lora, serif",category:"Serif",weights:[400,500,700]},{name:"PT Serif",family:'"PT Serif", serif',category:"Serif",weights:[400,700]},{name:"Noto Sans",family:'"Noto Sans", sans-serif',category:"Sans-serif"},{name:"Ubuntu",family:"Ubuntu, sans-serif",category:"Sans-serif"},{name:"Poppins",family:"Poppins, sans-serif",category:"Sans-serif"},{name:"Nunito",family:"Nunito, sans-serif",category:"Sans-serif"},{name:"Inconsolata",family:"Inconsolata, monospace",category:"Monospace"},{name:"Fira Code",family:'"Fira Code", monospace',category:"Monospace"},{name:"Source Code Pro",family:'"Source Code Pro", monospace',category:"Monospace"},{name:"Dancing Script",family:'"Dancing Script", cursive',category:"Cursive",weights:[400,500,700]}],r=new Map(s.map(e=>[e.name.toLowerCase(),e.name])),a=new Map(s.map(e=>[e.name,e.weights??n]));function o(e){const t=(a.get(e)??n).join(";");return`https://fonts.googleapis.com/css2?family=${encodeURIComponent(e).replace(/%20/g,"+")}:wght@${t}&display=swap`}function l(e){if("string"!=typeof e)return[];const t=[];for(const i of e.split(",")){const e=r.get(i.trim().replace(/^["']|["']$/g,"").trim().toLowerCase());e&&!t.includes(e)&&t.push(e)}return t}const c=/font-family\s*:\s*([^;]+)/gi,d=new WeakMap;function u(e){const t=d.get(e);if(t)return t;const i=new Set,n=new WeakSet,s=e=>{if(e&&"object"==typeof e&&!n.has(e))if(n.add(e),Array.isArray(e))e.forEach(s);else for(const[t,n]of Object.entries(e))if("font_family"===t)l(n).forEach(e=>i.add(e));else if("css"===t&&"string"==typeof n)for(const e of n.matchAll(c))l(e[1]).forEach(e=>i.add(e));else n&&"object"==typeof n&&s(n)};s(e);const r=[...i];return d.set(e,r),r}const p=new Set(["Roboto"]);let h;function m(e){if("undefined"!=typeof document&&document.head&&(!h||!e.every(e=>h.has(e)||p.has(e)))){h??=new Set([...document.head.querySelectorAll("link[data-mc-font]")].map(e=>e.dataset.mcFont??""));for(const t of e){if(h.has(t)||p.has(t))continue;h.add(t);const e=document.createElement("link");e.rel="stylesheet",e.href=o(t),e.dataset.mcFont=t,document.head.appendChild(e)}}}i.d(t,["rK",0,s])},5173(e,t,i){i.d(t,{$:()=>s});let n=0;function s(e="mc"){n++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${n}`}},7812(e,t,i){function n(e){return e?.locale?.language||e?.language||void 0}function s(e){const t=e?.locale?.time_format;if("12"===t)return!0;if("24"===t)return!1;const i="system"===t?void 0:n(e);try{return new Date("January 1, 2023 22:00:00").toLocaleString(i).includes("10")}catch{return!1}}function r(e){if("server"!==e?.locale?.time_zone)return;const t=e.config?.time_zone;if(t)try{return new Intl.DateTimeFormat("en",{timeZone:t}),t}catch{return}}function a(e){switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return n(e)}}function o(e,t,i=1){const n={maximumFractionDigits:i};"none"===e?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(a(e),n).format(t)}catch{return String(t)}}function l(e,t){const i=r(e),s=i?{...t,timeZone:i}:t;try{return new Intl.DateTimeFormat(n(e),s)}catch{return new Intl.DateTimeFormat(void 0,s)}}i.d(t,{LE:()=>l,XN:()=>n,ZV:()=>o,cj:()=>r,eN:()=>a,oE:()=>s})},3722(e,t,i){i.d(t,{F9:()=>p,XK:()=>c,aN:()=>d,x2:()=>f,zi:()=>h});var n=i(9307),s=i(1912);const r="(\\d+(?:\\.\\d+)?|\\.\\d+)",a=new RegExp(`^${r}\\s*[:/x×]\\s*${r}$`,"i"),o=new RegExp(`^${r}$`),l=new RegExp(`^${r}\\s*%$`);function c(e,t="16 / 9"){if("number"==typeof e)return Number.isFinite(e)&&e>0?String(e):t;if("string"!=typeof e)return t;const i=e.trim();let n=a.exec(i);if(n){const e=Number(n[1]),i=Number(n[2]);return e>0&&i>0?`${e} / ${i}`:t}return n=o.exec(i),n?Number(n[1])>0?String(Number(n[1])):t:(n=l.exec(i),n&&Number(n[1])>0?`100 / ${Number(n[1])}`:t)}function d(e,t){if(!t)return t;const i=e?.hassUrl;if(t.startsWith("/")&&!t.startsWith("//")&&"function"==typeof i)try{return i.call(e,t)}catch{return t}return t}function u(e){return(0,n.V)()?.media?.(e)??(0,s.yl)(e)??""}function p(e,t){const i=(0,s.fk)(t);return d(e,i?u(i):"string"==typeof t?(0,s.i$)(t):"")}function h(e,t){const i=(0,s.fk)(t);if(!i){const i="string"==typeof t?t.trim():"";return/^(\/|https?:|data:)/i.test(i)?m(d(e,i)):t}const n=u(i);return n?m(d(e,n)):""}function m(e){return`url("${e.replace(/["\\\n\r]/g,encodeURIComponent)}")`}function f(e,t,i=Date.now()){if(!(e&&t>0))return e;const n=Math.floor(i/t);return`${e}${e.includes("?")?"&":"?"}mc_t=${n}`}},4318(e,t,i){function n(e){if(!e||"object"!=typeof e)return;const t=e;if("row"===e.type){const e=t.columns;return Array.isArray(e)?e.map(e=>Array.isArray(e?.modules)?e.modules:[]):[]}if("tabs"===e.type){const e=t.tabs;return Array.isArray(e)?e.map(e=>Array.isArray(e?.modules)?e.modules:[]):[]}return Array.isArray(t.modules)?[t.modules]:"horizontal"===e.type||"vertical"===e.type||"slider-layout"===e.type?[[]]:void 0}function s(e){if(r(e))return"row"===e.type?"columns":"tabs"===e.type?"tabs":"modules"}function r(e){return void 0!==n(e)}function a(e){return"row"===e?.type||"tabs"===e?.type}function o(e,t){if("row"===e.type)return`Column ${t+1}`;if("tabs"===e.type){const i=e.tabs?.[t];return i?.label?.trim()||`Tab ${t+1}`}}function l(e,t){return n(e)?.[t.slot]?.[t.index]}function c(e,t){let i=e;for(const e of t)if(i=l(i,e),!i)return;return i}function d(e,t){const i=e;if("row"===e.type||"tabs"===e.type){const n=i["row"===e.type?"columns":"tabs"],s=n?.[t];if(!s)return;return Array.isArray(s.modules)||(s.modules=[]),s.modules}if(0===t&&r(e))return Array.isArray(i.modules)||(i.modules=[]),i.modules}function u(e){return e.map(e=>`${e.slot}.${e.index}`).join("/")}function p(e){if(!e)return[];const t=[];for(const i of e.split("/")){const e=/^(?:(\d+)\.)?(\d+)$/.exec(i);if(!e)return;t.push({slot:void 0===e[1]?0:Number(e[1]),index:Number(e[2])})}return t}function h(e,t,i){if(!t.length)return i;const[n,...s]=t,r=l(e,n);if(!r)return e;const a=h(r,s,i),o=e,c=e=>(e||[]).map((e,t)=>t===n.index?a:e);if("row"===e.type||"tabs"===e.type){const t="row"===e.type?"columns":"tabs",i=o[t].map((e,t)=>t===n.slot?{...e,modules:c(e.modules)}:e);return{...e,[t]:i}}return{...e,modules:c(o.modules)}}i.d(t,{Df:()=>o,Nk:()=>u,O6:()=>h,Rv:()=>c,Tu:()=>p,WA:()=>a,rX:()=>d,us:()=>s,yZ:()=>n})},5441(e,t,i){i.d(t,{TR:()=>o,g7:()=>r,jb:()=>c,n_:()=>d,vh:()=>a});var n=i(9307);let s=0;function r(){return(0,n.V)()?.instance??""}function a(e,t,i){return JSON.stringify([r(),e??"",t??"",i])}function o(e,t,i){let n;for(const s of l.values())s.scope===e&&s.entityId===t&&s.attribute===i&&(!n||s.seq>n.seq)&&(n=s);return n?.value}const l=new Map;function c(e,t){const i=l.get(e);if(i)return i.sent&&t!==i.base?(i.holdTimer&&clearTimeout(i.holdTimer),void l.delete(e)):i.value}function d(e,t,i,n,r,a=500){const o=l.get(e);o?.timer&&clearTimeout(o.timer),o?.holdTimer&&clearTimeout(o.holdTimer);let c=[];try{c=JSON.parse(e)}catch{}const[d,u,p]=Array.isArray(c)?c.map(String):["","",""],h={value:t,base:o?o.base:i,sent:!1,scope:d??"",entityId:u??"",attribute:p??"",seq:++s};h.timer=setTimeout(()=>{h.timer=void 0,h.sent=!0,n(h.value),h.holdTimer=setTimeout(()=>{l.get(e)===h&&l.delete(e),r?.()},5e3)},a),l.set(e,h),r?.()}},1268(e,t,i){i.d(t,{BI:()=>a,CR:()=>d,GD:()=>f,Ho:()=>v,NG:()=>o,WV:()=>u,b7:()=>p,gt:()=>y,oi:()=>r,t8:()=>c,uT:()=>l,yB:()=>g});const n=/^[A-Za-z0-9][A-Za-z0-9_-]*$/,s={style:"sheet",width:"600px",max_height:"90vh",backdrop_blur:"8px",backdrop_opacity:.4,show_close:!0,auto_close:0};function r(e){return"string"==typeof e?e.trim().replace(/^#+/,""):""}function a(e){return"string"==typeof e&&n.test(e)}function o(e){const t=r(e);return!t||a(t)?"":"Use letters, digits, - and _ only (no spaces)."}function l(e){return!!e&&"object"==typeof e&&!0===e.enabled}function c(e){const t=r(e?.hash);return a(t)?t:void 0}function d(e,t){if(!t||!e||e.length<2)return!1;let i=e.slice(1);try{i=decodeURIComponent(i)}catch{}return i===t}function u(e,t){const i=e.split("#")[0];return t?`${i}#${t}`:i}function p(e,t,i){const n=e?.entity?.trim();if(!n||!t||!i)return!1;const s=t[n]?.state,r=i[n]?.state;if(void 0===s||void 0===r||s===r)return!1;const a=e?.state?.trim();return!a||r===a}function h(e){if("number"==typeof e&&Number.isFinite(e))return`${e}px`;if("string"!=typeof e)return;const t=e.trim();return t&&!/[;{}<>]/.test(t)?/^-?\d+(\.\d+)?$/.test(t)?`${t}px`:t:void 0}function m(e){const t="string"==typeof e?Number(e):e;if("number"!=typeof t||!Number.isFinite(t))return s.backdrop_opacity;const i=t>1?t/100:t;return Math.min(1,Math.max(0,i))}function f(e){const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?Math.round(1e3*t):0}function g(e){return"dialog"===e?.style?"dialog":"sheet"}function y(e,t){const i=[`--mc-popup-width: ${h(e?.width)??s.width}`,`--mc-popup-max-height: ${h(e?.max_height)??s.max_height}`,`--mc-popup-blur: ${h(e?.backdrop_blur)??s.backdrop_blur}`,`--mc-popup-backdrop-opacity: ${m(e?.backdrop_opacity)}`],n=h(t);return n&&!/\s/.test(n)&&i.push(`--mc-popup-radius: ${n}`),i.join("; ")}class v{constructor(){this._startY=0,this._startT=0,this._active=!1,this.offset=0}get active(){return this._active}start(e,t){this._active=!0,this._startY=e,this._startT=t,this.offset=0}move(e){return this._active?(this.offset=Math.max(0,e-this._startY),this.offset):0}end(e,t,i){if(!this._active)return!1;const n=this.move(e);this._active=!1,this.offset=0;const s=n/Math.max(1,t-this._startT);return n>=(i>0?Math.min(80,.25*i):80)||n>=24&&s>=.6}cancel(){this._active=!1,this.offset=0}}i.d(t,["Uh",0,s])},4628(e,t,i){i.d(t,{Y4:()=>c,JA:()=>b,cr:()=>x,nI:()=>$,dg:()=>w});var n=i(340),s=i(8764),r=i(8521),a=i(4099),o=i(7643);function l(e,t,i){if(e&&"object"==typeof e){const n="string"==typeof e.entity?e.entity:"";return(0,a.f4)(n?t?.[n]:void 0,e.attribute||void 0)??i}const n="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof n&&Number.isFinite(n)?n:i}const c={width:3,transition:"1s",speed:"3s",length:25,start:"top",direction:"cw",linecap:"round",position:"inside",animation:"snake",min:0,max:100},d=["snake","pulse","full","dots","dashes"],u=["top","top-left","right","bottom","left"],p=["inside","center","outside"],h="var(--primary-color, #03a9f4)";const m=e=>{const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0},f=(e,t,i)=>Math.min(i,Math.max(t,e)),g=(e,t,i)=>t.includes(e)?e:i,y=e=>(0,r.a0)(e)??(0,n.f8)(e),v=(e,t)=>void 0===t||t>=100?e:`color-mix(in srgb, ${e} ${f(t,0,100)}%, transparent)`;function b(e,t){if(!e||"object"!=typeof e||"value"!==e.mode&&"animated"!==e.mode)return;const i=t.defaultEntity?t.states?.[t.defaultEntity]:void 0;if("tap"!==e.trigger&&!(0,n.p4)(e,i,t.states))return;let r,b=1,w=y(e.color);if("value"===e.mode){const i=e.entity||t.defaultEntity,n=i?t.states?.[i]:void 0,d=!e.attribute&&(0,o._7)(i)?(0,o.vt)(n):void 0;if(d){const t=(0,o.Yj)(d),i="elapsed"===e.timer_fill;b="idle"===d.state?0:i?1-t:t,void 0!==d.end&&d.total>0&&(r={end:d.end,total:d.total,elapsed:i,color:w??h,...e.thresholds?{thresholds:e.thresholds}:{}}),w=y((0,s.r)(100*t,e.thresholds))??w}else{const i=(0,a.f4)(n,e.attribute||void 0),r=l(e.min,t.states,c.min),o=l(e.max,t.states,c.max);b=void 0===i||o===r?0:f((i-r)/(o-r),0,1),w=y((0,s.r)(i,e.thresholds))??w}}w??=h;const x=g(e.position,p,c.position),_=y(e.track_color),$=m(e.track_opacity),k=_||void 0!==$?v(_??w,$):void 0;r&&!_&&void 0!==$&&(r.trackOpacity=$);const M=(0,n.TD)(e.transition)??c.transition;return{mode:e.mode,fill:b,..."animated"===e.mode?{animation:g(e.animation,d,c.animation)}:{},color:w,...k?{track:k}:{},width:f(m(e.width)??c.width,.5,40),linecap:"butt"===e.linecap?"butt":"round",glow:f(m(e.glow)??0,0,40),position:t.shaped||t.clipped&&"outside"===x?"inside":x,start:g(e.start,u,c.start),direction:"ccw"===e.direction?"ccw":"cw",length:f(m(e.length)??c.length,1,99),speed:(0,n.TD)(e.speed)??c.speed,transition:r?(S=M,(S.endsWith("ms")?parseFloat(S):1e3*parseFloat(S))>1e3?"1s":S):M,...r?{timer:r}:{}};var S}function w(e,t=Date.now()){const i=f((e.end-t)/e.total,0,1),n=y((0,s.r)(100*i,e.thresholds))??e.color;return{fill:e.elapsed?1-i:i,color:n,...void 0!==e.trackOpacity?{track:v(n,e.trackOpacity)}:{}}}function x(e,t){return"inside"===e?t/2:"outside"===e?-t/2:0}const _=e=>String(+e.toFixed(3));function $(e,t){const i=(e,i="none",n="none")=>({...e,animation:t?"none":i,transition:t?"none":n});if("value"===e.mode)return i({dasharray:"100 101",dashoffset:_(100-100*e.fill),linecap:e.linecap,opacity:e.fill>0?1:0},"none",`stroke-dashoffset ${e.transition} ${e.timer?"linear":"ease-in-out"}, stroke 0.5s ease`);const n=`mc-ring-run ${e.speed} ${e.timing??"linear infinite"}`;switch(e.animation){case"pulse":return i({dasharray:"none",dashoffset:"0",linecap:e.linecap,opacity:1},`mc-ring-pulse ${e.speed} ${e.timing??"ease-in-out infinite"}`);case"full":return i({dasharray:"none",dashoffset:"0",linecap:e.linecap,opacity:1});case"dots":return i({dasharray:`0 ${_(100/12)}`,dashoffset:"0",linecap:"round",opacity:1},n);case"dashes":return i({dasharray:"1.5 1.5",dashoffset:"0",linecap:e.linecap,opacity:1},n);default:return i({dasharray:`${_(e.length)} ${_(100-e.length)}`,dashoffset:"0",linecap:e.linecap,opacity:1},n)}}},9677(e,t,i){i.d(t,{Nd:()=>r,xY:()=>a});const n="mc-seasonal-preview";let s;function r(){return s}function a(e){const t=e&&Number.isFinite(e.getTime())?new Date(e.getTime()):void 0;(t?.getTime()??null)!==(s?.getTime()??null)&&(s=t,window.dispatchEvent(new CustomEvent(n)))}i.d(t,["HT",0,n])},5312(e,t,i){i.d(t,{Gx:()=>f,Is:()=>y,W8:()=>k,bO:()=>_,iP:()=>x,ir:()=>g});const n={sun:3,dusk:2,flash:5,moon:2},s=["snow"],r=["#e8590c","#f08c00","#d9480f","#c92a2a","#b35a1f","#e0a526","#a8761b"],a=["#ffc9de","#fcc2d7","#f9a8c9","#ffdeeb","#f7a1c4"],o=["#ffd43b","#fcc419","#ffe066"],l=["#fff9db","#e7f5ff","#ffec99","#ffffff"],c=["#5c9ce6","#74a9e6","#4a8bd6"],d=e=>({kind:"snowdot",motion:"fall",weight:e,dur:[9,17],size:[4,8],opacity:[.55,1],palette:s,drift:26}),u=(e,t)=>({kind:"flake",motion:"fall",weight:e,max:t,dur:[11,19],size:[12,22],opacity:[.7,1],palette:s,variants:3,drift:34}),p=e=>({kind:"petal",motion:"tumble",weight:e,dur:[9,15],size:[13,19],opacity:[.8,1],palette:a,drift:60}),h=(e,t="rain")=>({kind:"raindrop",motion:t,weight:e,dur:"rain"===t?[.6,1]:[7,11],size:[18,30],opacity:"rain"===t?[.45,.85]:[.35,.6],palette:c}),m={winter:{id:"winter",label:"Winter",particles:[d(6),u(3,8)],decorations:["frost","icicles"]},spring:{id:"spring",label:"Spring",particles:[p(5),{kind:"blossom",motion:"tumble",weight:1.6,max:4,dur:[11,16],size:[17,24],opacity:[.85,1],palette:a,drift:50}],decorations:["vine"]},summer:{id:"summer",label:"Summer",ambient:["sun"],particles:[{kind:"butterfly",motion:"flutter",weight:1,max:4,dur:[9,15],size:[28,38],palette:[["#f59f00","#ffd43b"],["#339af0","#a5d8ff"],["#fab005","#fff3bf"],["#e64980","#ffdeeb"],["#7950f2","#d0bfff"]],band:[18,78]},{kind:"mote",motion:"flutter",weight:1.4,max:7,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:o,band:[10,90]}]},autumn:{id:"autumn",label:"Autumn",particles:[{kind:"leaf",motion:"tumble",weight:6,dur:[8,14],size:[20,32],opacity:[.85,1],palette:r,variants:3,drift:70},h(1.4,"drizzle")]},christmas:{id:"christmas",label:"Christmas",particles:[d(4),u(1.4,4),{kind:"star",motion:"twinkle",weight:2.4,max:6,dur:[2.2,3.8],size:[13,21],opacity:[.8,1],palette:o,band:[6,62],variants:1}],decorations:["lights"]},new_year:{id:"new_year",label:"New Year",particles:[{kind:"firework",motion:"burst",weight:2.4,max:5,dur:[2.6,4],size:[64,100],opacity:[.8,.95],palette:[["#ff6b6b","#ffe066"],["#4dabf7","#d0ebff"],["#ffd43b","#fff9db"],["#da77f2","#ffdeeb"],["#51cf66","#ebfbee"],["#ff922b","#fff4e6"]],band:[14,52]},{kind:"confetti",motion:"tumble",weight:5,dur:[5,8],size:[8,13],palette:["#ff6b6b","#ffd43b","#4dabf7","#69db7c","#da77f2","#ff922b","#f783ac","#e9c46a"],variants:3,drift:40}]},valentine:{id:"valentine",label:"Valentine",particles:[{kind:"heart",motion:"rise",weight:1,dur:[8,13],size:[12,24],opacity:[.6,.95],palette:["#e03131","#f03e3e","#e64980","#f06595","#ff6b81","#c2255c"],variants:2,drift:30}]},easter:{id:"easter",label:"Easter",particles:[p(3),{kind:"egg",motion:"bob",weight:1.6,max:6,dur:[2.4,3.6],size:[22,30],palette:[["#ffd8a8","#f76707"],["#b2f2bb","#2b8a3e"],["#a5d8ff","#1864ab"],["#fcc2d7","#c2255c"],["#d0bfff","#5f3dc4"],["#ffec99","#e67700"]],band:[80,92],variants:3}]},halloween:{id:"halloween",label:"Halloween",particles:[{kind:"bat",motion:"fly",weight:1,max:7,dur:[7,12],size:[24,36],opacity:[.8,1],palette:["bat"],band:[8,55]},{kind:"fogband",motion:"drift",weight:.5,max:3,dur:[16,26],size:[260,380],opacity:[.55,.85],palette:["ghost-violet","mist","ghost-green"],band:[70,100]}],decorations:["cobweb","pumpkin"]},snow:{id:"snow",label:"Snow",particles:[d(7),u(3,8)]},rain:{id:"rain",label:"Rain",particles:[h(1)]},storm:{id:"storm",label:"Thunderstorm",ambient:["flash"],particles:[h(1)]},sun:{id:"sun",label:"Sunny",ambient:["sun"],particles:[{kind:"mote",motion:"flutter",weight:1,max:8,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:o,band:[10,90]}]},clouds:{id:"clouds",label:"Cloudy",particles:[{kind:"cloud",motion:"across",weight:1,max:5,dur:[50,90],size:[64,120],opacity:[.55,.95],palette:["cloud"],band:[6,46]}]},fog:{id:"fog",label:"Fog",particles:[{kind:"fogband",motion:"drift",weight:1,max:4,dur:[16,28],size:[280,420],opacity:[.4,.75],palette:["mist"],band:[25,100]}]},wind:{id:"wind",label:"Windy",particles:[{kind:"windline",motion:"gust",weight:2,max:6,dur:[2.4,5],size:[90,160],opacity:[.55,.95],palette:["wind"],band:[12,88],variants:2},{kind:"leaf",motion:"blow",weight:1,max:4,dur:[4,6.5],size:[16,22],palette:r,band:[20,80],variants:3}]},night:{id:"night",label:"Night",ambient:["moon"],particles:[{kind:"sparkle",motion:"twinkle",weight:3,max:10,dur:[2.4,4.6],size:[7,14],opacity:[.6,1],palette:l,band:[4,58]},{kind:"firefly",motion:"firefly",weight:2,max:6,dur:[9,15],size:[10,15],palette:["#d8f5a2","#ffec99","#c0eb75"],band:[45,92]}]},dusk:{id:"dusk",label:"Dusk",ambient:["dusk"],particles:[{kind:"sparkle",motion:"twinkle",weight:1,max:3,dur:[3,5],size:[6,10],opacity:[.45,.8],palette:l,band:[4,30]}]}};function f(e){return"string"==typeof e&&Object.prototype.hasOwnProperty.call(m,e)}function g(e){const t=[];for(const i of e)for(const e of f(i)&&m[i].decorations||[])t.includes(e)||t.push(e);return t}function y(e){let t=function(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return t>>>0}(e);return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}const v=e=>Math.round(100*e)/100,b=(e,t,i)=>e+(t-e)*i;function w(e,t=0){const i=Number.isFinite(e)?Math.min(1,Math.max(0,e)):.5;return Math.max(0,Math.min(24-t,Math.round(24*i)))}function x(e,t,i="mc"){const s=e.filter(f).filter((e,t,i)=>i.indexOf(e)===t).map(e=>m[e]),r=[];for(const e of s)for(const t of e.ambient??[])r.some(e=>e.kind===t)||r.push({key:`a-${t}`,kind:t});const a=s.flatMap(e=>{const t=e.particles.reduce((e,t)=>e+t.weight,0)||1;return e.particles.map((i,n)=>({scene:e.id,spec:i,index:n,share:i.weight/t/s.length}))}),o=function(e,t){const i=e.map(()=>0);let n=t;for(let t=0;t<4&&n>0;t++){const t=e.map((e,t)=>({e,i:t})).filter(({e,i:t})=>i[t]<(e.spec.max??1/0)),s=t.reduce((e,{e:t})=>e+t.share,0);if(!s)break;const r=t.map(({e,i:t})=>({i:t,want:n*e.share/s,room:(e.spec.max??1/0)-i[t]}));let a=0;for(const e of r){const t=Math.min(Math.floor(e.want),e.room);i[e.i]+=t,a+=t}const o=r.filter(t=>i[t.i]<(e[t.i].spec.max??1/0)).sort((e,t)=>t.want-Math.floor(t.want)-(e.want-Math.floor(e.want))||e.i-t.i);for(const e of o){if(a>=n)break;i[e.i]++,a++}n-=a}return i}(a,w(t,r.reduce((e,t)=>e+n[t.kind],0))),l=[];return a.forEach(({scene:e,spec:t,index:n},s)=>{const r=o[s],a=y(`${i}|${e}|${n}`)();for(let s=0;s<r;s++){const o=y(`${i}|${e}|${t.kind}|${n}|${s}`),c=o(),d=t.band??[4,96],u=t.palette[(s+Math.floor(a*t.palette.length))%t.palette.length],[p,h]="string"==typeof u?[u,void 0]:u,m="burst"===t.motion||"gust"===t.motion,f=m?b(t.dur[0],t.dur[1],.5):b(t.dur[1],t.dur[0],c),g=m?(s+.5+.3*(o()-.5))/r:0,[w,x]=t.opacity??[1,1];l.push({key:`${e}-${n}-${s}`,scene:e,kind:t.kind,motion:t.motion,variant:s%(t.variants??1),x:v(((s+.15+.7*o())/r+a)%1*100*.94+3),y:v(b(d[0],d[1],o())),size:v(b(t.size[0],t.size[1],c)),dur:v(f),delay:v(-(m?g:o())*f),color:p,accent:h,opacity:v(b(w,x,c)),drift:v((2*o()-1)*(t.drift??20)),rotate:Math.round(360*o()),flip:o()<.5})}}),{particles:l,ambient:r}}function _(e){return e.some(e=>f(e)&&!!m[e].ambient?.includes("flash"))}function $(e,t){const i=new Set;for(const t of e)if(f(t))for(const e of m[t].ambient??[])i.add(e);let s=0;for(const e of i)s+=n[e];return w(t,s)}class k{constructor(e=60){this._cap=e,this._left=60,this._flashes=0,this._demand=0,this._known=0}begin(){this._left=this._cap,this._flashes=0,this._demand=0,this._scale=void 0}own(e,t){return this._grant(e,t,1)}preset(e,t){const i=$(e,t);return this._demand+=i,void 0===this._scale&&(this._scale=this._known>this._left?Math.max(0,this._left)/this._known:1),this._grant(e,t,this._scale,i)}settle(){return this._demand!==this._known&&(this._known=this._demand,!0)}_grant(e,t,i,n=$(e,t)){const s=Math.max(0,Math.min(this._left,Math.round(n*i)));this._left-=s;const r=_(e);return r&&this._flashes++,{intensity:s===n?t:s/24,noflash:r&&this._flashes>5}}}i.d(t,["IL",0,m])},2668(e,t,i){i.d(t,{GR:()=>g,J4:()=>v,Oo:()=>k,RC:()=>c,Z:()=>x,a0:()=>E,aD:()=>A,ot:()=>f,p5:()=>b,rG:()=>T,s$:()=>_,ws:()=>M});var n=i(7812);const s=["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight"],r={christmas:"12-01..12-26",new_year:"12-31..01-01",valentine:"02-14..02-14",easter:"auto",halloween:"10-24..10-31"},a=["new_year","christmas","valentine","easter","halloween"],o=[31,29,31,30,31,30,31,31,30,31,30,31];function l(e){const t=/^(\d\d)-(\d\d)$/.exec(e.trim());if(!t)return;const i=Number(t[1]),n=Number(t[2]);return i<1||i>12||n<1||n>o[i-1]?void 0:{month:i,day:n}}function c(e){if("string"!=typeof e)return;const t=e.split("..");if(t.length>2)return;const i=l(t[0]),n=2===t.length?l(t[1]):i;return i&&n?{start:i,end:n}:void 0}const d=e=>100*e.month+e.day;function u(e,t){const i=d({month:e.getMonth()+1,day:e.getDate()}),n=d(t.start),s=d(t.end);return n<=s?i>=n&&i<=s:i>=n||i<=s}function p(e){const t=function(e){const t=e%19,i=Math.floor(e/100),n=e%100,s=Math.floor(i/4),r=i%4,a=Math.floor((i+8)/25),o=(19*t+i-s-Math.floor((i-a+1)/3)+15)%30,l=(32+2*r+2*Math.floor(n/4)-o-n%4)%7,c=Math.floor((t+11*o+22*l)/451),d=Math.floor((o+l-7*c+114)/31);return new Date(e,d-1,(o+l-7*c+114)%31+1)}(e),i=e=>{const i=new Date(t.getFullYear(),t.getMonth(),t.getDate()+e);return{month:i.getMonth()+1,day:i.getDate()}};return{start:i(-7),end:i(1)}}const h=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"],m={winter:"summer",summer:"winter",spring:"autumn",autumn:"spring"};function f(e){return"string"==typeof e&&"south"===e.trim().toLowerCase()?"south":"north"}function g(e,t={}){return function(e,t){for(const i of a){const n=t?.[i];if(!1===n||"string"==typeof n&&"off"===n.trim().toLowerCase())continue;const s="string"==typeof n&&"auto"!==n.trim().toLowerCase()&&c(n)?n:r[i],a="auto"===s?"easter"===i?p(e.getFullYear()):void 0:c(s);if(a&&u(e,a))return i}}(e,t.calendar)??function(e,t="north"){const i=h[e.getMonth()];return"south"===t?m[i]:i}(e,f(t.hemisphere))}const y={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"};function v(e){return e?y[e]:void 0}function b(e,t){if("below_horizon"===e||"above_horizon"===e)return"number"==typeof t&&Number.isFinite(t)&&Math.abs(t)<=6?"dusk":"below_horizon"===e?"night":void 0}function w(e,t){try{const i=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(e),n=e=>Number(i.find(t=>t.type===e)?.value),s={y:n("year"),mo:n("month"),d:n("day"),h:n("hour")%24,mi:n("minute"),s:n("second")};return Object.values(s).every(Number.isFinite)?s:void 0}catch{return}}function x(e,t){const i=(0,n.cj)(t),s=i?w(e,i):void 0;return s?new Date(s.y,s.mo-1,s.d,s.h,s.mi,s.s,e.getMilliseconds()):e}function _(e,t){const i=(0,n.cj)(t),s=i?w(e,i):void 0;if(!s)return new Date(e.getFullYear(),e.getMonth(),e.getDate()+1,0,0,0,0);const r=1e3*(60*(60*s.h+s.mi)+s.s)+e.getMilliseconds();return new Date(e.getTime()+864e5-r)}const $=new Set(s);function k(e){if(null!=e&&!1!==e)return!0===e?{}:"string"==typeof e?{scene:e}:"object"!=typeof e||Array.isArray(e)?void 0:e}function M(e){const t=e?.combine;return(Array.isArray(t)?t:"string"==typeof t?[t]:[]).filter(e=>"string"==typeof e&&""!==e.trim())}function S(e,t,i,n){const s=void 0===e?"auto":e;return"auto"===s?g(i,t):"string"==typeof s&&$.has(s)?"weather"===s?function(e,t){return e.weather_entity?v(t?.states?.[e.weather_entity]?.state):void 0}(t,n):"daynight"===s?function(e){const t=e?.states?.["sun.sun"],i=t?.attributes?.elevation;return b(t?.state,"number"==typeof i?i:"string"==typeof i&&""!==i.trim()?Number(i):void 0)}(n):s:void 0}function C(e){const t="string"==typeof e&&e.includes("%");let i="number"==typeof e?e:"string"==typeof e&&/^\s*-?\d*\.?\d+\s*%?\s*$/.test(e)?parseFloat(e):NaN;return Number.isFinite(i)?(!t&&i>0&&i<=1&&(i*=100),Math.round(Math.min(100,Math.max(0,i)))/100):.5}function T(e,t,i,n={}){const s=k(e);if(n.localDay||(t=x(t,i)),!s)return;if(s.entity&&"off"===i?.states?.[s.entity]?.state)return;const r=[],a=e=>{e&&!r.includes(e)&&r.push(e)};a(S(s.scene,s,t,i));for(const e of M(s))a(S(e,s,t,i));return r.length?{scenes:r,layer:"front"===s.layer?"front":"back",intensity:C(s.intensity),decorations:!1!==s.decorations}:void 0}function A(e){const t=k(e);if(!t)return[];const i=E(t),n=[];return t.entity&&n.push(t.entity),t.weather_entity&&i.includes("weather")&&n.push(t.weather_entity),i.includes("daynight")&&n.push("sun.sun"),n}function E(e){return[e.scene??"auto",...M(e)]}i.d(t,["MX",0,s,"jF",0,r])},4824(e,t,i){var n=i(6161),s=i(7804);class r extends s.WL{constructor(e){if(super(e),e.type!==s.OA.CHILD)throw new Error("selectValue goes inside a <select>")}render(e){return n.s6}update(e,[t]){const i=e.parentNode;return i&&"SELECT"===i.tagName&&i.value!==t&&(i.value=t),n.s6}}const a=(0,s.u$)(r);i.d(t,["m",0,a])},2515(e,t,i){i.d(t,{TV:()=>O,aK:()=>B,dC:()=>d,j9:()=>I,q8:()=>j});const n=new Set(["squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]),s=.5522847498,r=(Math.SQRT1_2,1.5),a={smoothing:.6,corner:16,amplitude:8,waves:3,seed:7,wobble:.25},o=(e,t,i)=>Math.min(i,Math.max(t,e)),l=e=>{const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0},c=(e,t)=>({x:e,y:t});function d(e,t){let i;return i="string"==typeof e&&/^\s*-?\d*\.?\d+\s*%\s*$/.test(e)?parseFloat(e)/100*t:"string"==typeof e&&/^\s*-?\d*\.?\d+\s*(px)?\s*$/i.test(e)?parseFloat(e):l(e),void 0!==i&&Number.isFinite(i)&&i>=0?i:void 0}const u=(e,t,i)=>c(e.x+(t.x-e.x)*i,e.y+(t.y-e.y)*i),p=(e,t)=>Math.hypot(t.x-e.x,t.y-e.y);function h(e,t){if(t<=0)return{start:e[0],segs:[...e.slice(1),e[0]].map(e=>({to:e}))};const i=e.length,n=e.map((n,s)=>{const r=e[(s+i-1)%i],a=e[(s+1)%i],o=Math.min(t,p(r,n)/3),l=Math.min(t,p(n,a)/3);return{v:n,a:u(n,r,o/(p(r,n)||1)),b:u(n,a,l/(p(n,a)||1))}}),s=[];return n.forEach((e,t)=>{s.push({c1:u(e.a,e.v,2/3),c2:u(e.b,e.v,2/3),to:e.b}),s.push({to:n[(t+1)%i].a})}),{start:n[0].a,segs:s}}function m(e,t,i){const n=[];for(let s=0;s+1<e.length;s++){const r=e[s],a=e[s+1];n.push({c1:c(r.x+t[s].x*i/3,r.y+t[s].y*i/3),c2:c(a.x-t[s+1].x*i/3,a.y-t[s+1].y*i/3),to:a})}return n}function f(e,t){const i=e.length;return e.map((n,s)=>{const r=t?e[(s+i-1)%i]:e[Math.max(0,s-1)],a=t?e[(s+1)%i]:e[Math.min(i-1,s+1)],o=t||s>0&&s<i-1?.5:1;return c((a.x-r.x)*o,(a.y-r.y)*o)})}function g(e,t,i,n,r){const a=[],o=[[c(e-i,i),-90],[c(e-i,t-i),0],[c(i,t-i),90],[c(i,i),180]],l=c(i,0);let d=l;for(const[e,t]of o){const o=t=>{const s=t*Math.PI/180,r=Math.cos(s),a=Math.sin(s),o=2/n;return c(e.x+i*Math.sign(r)*Math.abs(r)**o,e.y+i*Math.sign(a)*Math.abs(a)**o)},l=o(t);if(p(d,l)>1e-9&&a.push({to:l}),2===n){const e=o(t+90),n=t*Math.PI/180,r=(t+90)*Math.PI/180;a.push({c1:c(l.x-Math.sin(n)*i*s,l.y+Math.cos(n)*i*s),c2:c(e.x+Math.sin(r)*i*s,e.y-Math.cos(r)*i*s),to:e}),d=e;continue}const u=[];for(let e=0;e<=r;e++)u.push(o(t+90*e/r));const h=f(u,!1),g=t*Math.PI/180,y=(t+90)*Math.PI/180,v=Math.hypot(h[0].x,h[0].y),b=Math.hypot(h[r].x,h[r].y);h[0]=c(-Math.sin(g)*v,Math.cos(g)*v),h[r]=c(-Math.sin(y)*b,Math.cos(y)*b),a.push(...m(u,h,1)),d=u[r]}return p(d,l)>1e-9&&a.push({to:l}),{start:l,segs:a}}const y=e=>.6*(1-.5**(1/e)),v=y(2);const b=(e,t)=>Math.max(e,Math.min(t.top,t.bottom)),w=(e,t)=>Math.max(e,Math.min(t.left,t.right)),x=e=>Math.max(0,(e-Math.min(70,.85*e))/2);function _(e,t,i,n){if(!(e>0))return{top:0,right:0,bottom:0,left:0};const s=2===t?.1:.25,r=Math.max(0,Math.min(e,x(n)-s)),a=e-Math.max(0,e**t-(e-r)**t)**(1/t),o=Math.min(Math.max(e*y(t),a),e*(1-.5**(1/t))),l=function(e,t,i){if(!(e>0)||i>=e)return 0;const n=e-Math.max(0,i);return e-Math.max(0,e**t-n**t)**(1/t)}(e,t,b(o,i))+s;return{top:o,right:l,bottom:o,left:l}}function $(e,t,i,n,s){const r=(e-Math.max(0,x(2*e)-.1))/(i*e),a=r<1?Math.sqrt(1-r*r):0,l=t-i*t*o(Math.min(1-v,a),s,1),c=o((t-b(l,n))/(i*t),0,1),d=e-i*e*Math.sqrt(1-c*c)+.1;return{top:l,right:d,bottom:l,left:d}}function k(e,t,i,n,u={top:0,right:0,bottom:0,left:0}){const y=Math.min(t,i),v=(e,t)=>o(d(n.corner,y)??e,0,t);switch(e){case"squircle":{const e=3+5*(1-o(l(n.smoothing)??a.smoothing,0,1)),s=v(y/2,y/2);return s<=0?{start:c(0,0),segs:[{to:c(t,0)},{to:c(t,i)},{to:c(0,i)}],inset:{top:0,right:0,bottom:0,left:0}}:{...g(t,i,s,e,16),inset:_(s,e,u,t)}}case"pill":{const e=y/2;return{...g(t,i,e,2,1),inset:_(e,2,u,t)}}case"circle":{const e=t/2,n=i/2,r=e*s,a=n*s,o=[{c1:c(e+r,0),c2:c(t,n-a),to:c(t,n)},{c1:c(t,n+a),c2:c(e+r,i),to:c(e,i)},{c1:c(e-r,i),c2:c(0,n+a),to:c(0,n)},{c1:c(0,n-a),c2:c(e-r,0),to:c(e,0)}];return{start:c(e,0),segs:o,inset:$(e,n,1,u,.5)}}case"notch":case"octagon":{const s=M(e,t,i,n),a=[c(s,0),c(t-s,0),c(t,s),c(t,i-s),c(t-s,i),c(s,i),c(0,i-s),c(0,s)],o="octagon"===e&&s>0?.2*r:0,l=s/4+o,d=Math.max(0,s-b(s/4,u))+2*o;return{...h(A(a),"octagon"===e?r:0),inset:{top:l,right:d,bottom:l,left:d}}}case"hexagon":{const{pts:e,c:s,wide:a}=C(t,i,n),o=s>0?.375:0,l=(e,t)=>Math.max(0,s*(1-2*e/t))+2*o,c=a?{top:o,right:l(b(o,u),i),bottom:o,left:l(b(o,u),i)}:{top:l(w(o,u),t),right:o,bottom:l(w(o,u),t),left:o};return{...h(A(e),r),inset:c}}case"ticket":{const e=v(a.corner,Math.min(i/2,t/4)),n=i/2,r=e*s,o=[{to:c(t,0)}];return e>0&&o.push({to:c(t,n-e)},{c1:c(t-r,n-e),c2:c(t-e,n-r),to:c(t-e,n)},{c1:c(t-e,n+r),c2:c(t-r,n+e),to:c(t,n+e)}),o.push({to:c(t,i)},{to:c(0,i)}),e>0&&o.push({to:c(0,n+e)},{c1:c(r,n+e),c2:c(e,n+r),to:c(e,n)},{c1:c(e,n-r),c2:c(r,n-e),to:c(0,n-e)}),o.push({to:c(0,0)}),{start:c(0,0),segs:E(c(0,0),o),inset:{top:0,right:e,bottom:0,left:e}}}case"wave":return function(e,t,i){const n=P.includes(i.edge)?i.edge:"bottom",r="all"===n,u=e=>r||n===e,h=Math.min(e,t),f="top"===n||"bottom"===n?t:e,g=o(d(i.amplitude,h)??a.amplitude,0,r?h/8:f/4),y=Math.round(l(i.waves)??a.waves),v=void 0!==l(i.phase),b=v?l(i.phase):0,w=[c(0,0),c(e,0),c(e,t),c(0,t)],x=[c(1,0),c(0,1),c(-1,0),c(0,-1)],_=[c(0,-1),c(1,0),c(0,1),c(-1,0)],$=["top","right","bottom","left"],k=r&&g>0?g:0,M=k*s,S=c(k,0),C=[];$.forEach((e,t)=>{const i=x[t],n=w[(t+1)%4],s=c(w[t].x+i.x*k,w[t].y+i.y*k),a=c(n.x-i.x*k,n.y-i.y*k);if(!u(e)||g<=0)C.push({to:a});else{const e=p(s,a),i=o(y,1,Math.max(1,Math.min(50,Math.floor(e/(2.5*g))))),n=_[t],l=8*i,d=r&&v,u=e=>{if(!d)return 1;const t=o(2*Math.min(e,1-e)*i,0,1);return t*t*(3-2*t)},h=e=>(g*Math.cos(2*Math.PI*(i*e+b))-g)*u(e),f=e=>{if(!d)return 2*-g*Math.PI*i*Math.sin(2*Math.PI*(i*e+b));const t=1e-5,n=Math.max(0,e-t),s=Math.min(1,e+t);return(h(s)-h(n))/(s-n)},w=[],x=[];for(let e=0;e<=l;e++){const t=e/l,i=h(t),r=f(t);w.push(c(s.x+(a.x-s.x)*t+n.x*i,s.y+(a.y-s.y)*t+n.y*i)),x.push(c(a.x-s.x+n.x*r,a.y-s.y+n.y*r))}v&&!r&&C.push({to:w[0]}),C.push(...m(w,x,1/l)),v&&!r&&C.push({to:a})}if(k>0){const e=x[(t+1)%4],s=c(n.x+e.x*k,n.y+e.y*k);C.push({c1:c(a.x+i.x*M,a.y+i.y*M),c2:c(s.x-e.x*M,s.y-e.y*M),to:s})}});const T=2*g;return{start:S,segs:C,inset:{top:u("top")?T:0,right:u("right")?T:0,bottom:u("bottom")?T:0,left:u("left")?T:0}}}(t,i,n);case"blob":return function(e,t,i,n){const s=o(l(i.wobble)??a.wobble,0,1),r=function(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}(function(e){const t=l(e);return void 0!==t?Math.round(t):"string"==typeof e&&e?[...e].reduce((e,t)=>Math.imul(e,31)+t.charCodeAt(0)|0,7):a.seed}(i.seed)),d=e/2,u=t/2,p=[];for(let e=0;e<12;e++){const t=1-.5*s*r(),i=2*Math.PI*e/12-Math.PI/2;p.push(c(d+d*t*Math.cos(i),u+u*t*Math.sin(i)))}const h=function(e){const t=f(e,!0);return{start:e[0],segs:m([...e,e[0]],[...t,t[0]],1)}}(p);let g=1,y=h.start;for(const e of h.segs){const t=e.c1??y,i=e.c2??e.to;for(let n=1;n<=32;n++){const s=n/32,r=1-s,a=r*r*r*y.x+3*r*r*s*t.x+3*r*s*s*i.x+s*s*s*e.to.x,o=r*r*r*y.y+3*r*r*s*t.y+3*r*s*s*i.y+s*s*s*e.to.y;g=Math.min(g,Math.hypot((a-d)/d,(o-u)/u))}y=e.to}return{...h,inset:$(d,u,.99*g,n,.65)}}(t,i,n,u);default:return}}function M(e,t,i,n){const s=Math.min(t,i),r="notch"===e?a.corner:s/(2+Math.SQRT2);return o(d(n.corner,s)??r,0,s/2)}function S(e,t,i){const n=Math.min(e,t);return o(d(i.corner,n)??n/2,0,n/2)}function C(e,t,i){const n=Math.min(e,t),s=o(d(i.corner,n)??n/2*Math.tan(Math.PI/6),0,n/2),r=e>=t;return{pts:r?[c(s,0),c(e-s,0),c(e,t/2),c(e-s,t),c(s,t),c(0,t/2)]:[c(e/2,0),c(e,s),c(e,t-s),c(e/2,t),c(0,t-s),c(0,s)],c:s,wide:r}}function T(e,t,i,n,s){if(!(s>0))return k(e,t,i,n);const a=t-2*s,o=i-2*s;if(!(a>0&&o>0))return;let l=n;if("notch"===e||"octagon"===e)l={...n,corner:Math.max(0,M(e,t,i,n)-(2-Math.SQRT2)*s)};else if("squircle"===e)l={...n,corner:Math.max(0,S(t,i,n)-s)};else if("hexagon"===e){const e=function(e,t){const i=e.length,n=e.map((n,s)=>{const r=e[(s+1)%i],a=p(n,r)||1,o=c(r.x-n.x,r.y-n.y);return{at:c(n.x-o.y/a*t,n.y+o.x/a*t),dir:o}}),s=n.map((e,t)=>{const s=n[(t+i-1)%i],r=s.dir.x*e.dir.y-s.dir.y*e.dir.x;if(Math.abs(r)<1e-12)return e.at;const a=((e.at.x-s.at.x)*e.dir.y-(e.at.y-s.at.y)*e.dir.x)/r;return c(s.at.x+s.dir.x*a,s.at.y+s.dir.y*a)});for(let e=0;e<i;e++){const t=s[e],r=s[(e+1)%i];if((r.x-t.x)*n[e].dir.x+(r.y-t.y)*n[e].dir.y<=1e-9)return}return s}(C(t,i,n).pts,s);if(e)return{...h(A(e),r),inset:{top:0,right:0,bottom:0,left:0}}}const d=k(e,a,o,l);return d&&((e,t)=>{const i=e=>c(e.x+t,e.y+t);return{start:i(e.start),segs:e.segs.map(e=>e.c1&&e.c2?{c1:i(e.c1),c2:i(e.c2),to:i(e.to)}:{to:i(e.to)}),inset:e.inset}})(d,s)}function A(e){const t=e.filter((t,i)=>p(t,e[(i+1)%e.length])>1e-9);return t.length>=3?t:e}function E(e,t){let i=e;return t.filter(e=>{const t=!!e.c1||p(i,e.to)>1e-9;return t&&(i=e.to),t})}const P=["top","right","bottom","left","all"];const z=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)};function L(e,t,i){const n=e=>`${z(o(e.x,0,t))} ${z(o(e.y,0,i))}`,s=[`M${n(e.start)}`];for(const t of e.segs)s.push(t.c1&&t.c2?`C${n(t.c1)} ${n(t.c2)} ${n(t.to)}`:`L${n(t.to)}`);return s.push("Z"),s.join(" ")}function O(e,t,i,n){if(e.length<2)return"";const s=n?function(e){const t=e.length,i=e.slice(1).map((t,i)=>t.x-e[i].x),n=e.slice(1).map((t,n)=>i[n]>0?(t.y-e[n].y)/i[n]:0),s=e.map((e,i)=>0===i?n[0]:i===t-1?n[t-2]:n[i-1]*n[i]<=0?0:(n[i-1]+n[i])/2);for(let e=0;e<t-1;e++){if(0===n[e]){s[e]=0,s[e+1]=0;continue}const t=s[e]/n[e],i=s[e+1]/n[e],r=t*t+i*i;if(r>9){const a=3/Math.sqrt(r);s[e]=a*t*n[e],s[e+1]=a*i*n[e]}}return e.slice(1).map((t,n)=>{const r=e[n],a=i[n]/3;return{c1:c(r.x+a,r.y+s[n]*a),c2:c(t.x-a,t.y-s[n+1]*a),to:t}})}(e):e.slice(1).map(e=>({to:e}));return L({start:e[0],segs:s,inset:{top:0,right:0,bottom:0,left:0}},t,i).replace(/ Z$/,"")}const q=new Map;function R(e,t,i,s,r=0,a){if(!((e,t,i)=>n.has(e)&&Number.isFinite(t)&&Number.isFinite(i)&&t>0&&i>0)(e,t,i))return;const o=s&&"object"==typeof s?s:{},l=a?N(a):{top:0,right:0,bottom:0,left:0},c=`${e}|${t}|${i}|${r}|${l.top},${l.right},${l.bottom},${l.left}|${JSON.stringify(o)}`;if(q.has(c)){const e=q.get(c);return q.delete(c),q.set(c,e),e}const d=r>0?T(e,t,i,o,r):k(e,t,i,o,l),u=d?{d:L(d,t,i),inset:(p=d.inset,{top:Math.round(100*p.top)/100,right:Math.round(100*p.right)/100,bottom:Math.round(100*p.bottom)/100,left:Math.round(100*p.left)/100}),poly:D(d,t,i)}:void 0;var p;return q.set(c,u),q.size>64&&q.delete(q.keys().next().value),u}const N=e=>{const t=e=>"number"==typeof e&&Number.isFinite(e)&&e>0?Math.round(100*e)/100:0;return{top:t(e.top),right:t(e.right),bottom:t(e.bottom),left:t(e.left)}};function I(e,t,i,n={},s){const r=R(e,t,i,n,0,s);return r&&{d:r.d,inset:{...r.inset}}}function j(e,t,i,n,s){return R(e,t,i,n,Math.max(0,s))?.d}function D(e,t,i){const n=e=>c(o(e.x,0,t),o(e.y,0,i)),s=[n(e.start)];let r=s[0];for(const t of e.segs){const e=n(t.to);if(t.c1&&t.c2){const i=n(t.c1),a=n(t.c2);for(let t=1;t<=16;t++){const n=t/16,o=1-n;s.push(c(o*o*o*r.x+3*o*o*n*i.x+3*o*n*n*a.x+n*n*n*e.x,o*o*o*r.y+3*o*o*n*i.y+3*o*n*n*a.y+n*n*n*e.y))}}else s.push(e);r=e}return s}function B(e,t,i,n,s,r=.5){const a=R(e,t,i,n)?.poly;if(!a)return;const l="top"===s||"bottom"===s,c=o(Number.isFinite(r)?r:.5,0,1)*(l?t:i),d=[];for(let e=0;e+1<a.length;e++){const t=a[e],i=a[e+1],[n,s,r,o]=l?[t.x,i.x,t.y,i.y]:[t.y,i.y,t.x,i.x];c<Math.min(n,s)-1e-9||c>Math.max(n,s)+1e-9||(Math.abs(s-n)<1e-9?d.push(r,o):d.push(r+(c-n)/(s-n)*(o-r)))}if(!d.length)return;const u="top"===s||"left"===s?Math.min(...d):Math.max(...d),p=e=>{const t=Math.round(100*e)/100;return Object.is(t,-0)?0:t};return l?{x:p(c),y:p(u)}:{x:p(u),y:p(c)}}i.d(t,["JM",0,a])},5963(e,t,i){i.d(t,{E:()=>a});var n=i(6161),s=i(1831);const r=e=>e.stopPropagation();function a(e){const t=e.max-e.min,i=void 0===e.value||t<=0?0:Math.max(0,Math.min(1,(e.value-e.min)/t)),a=(t,i)=>{const n=t.getBoundingClientRect();return e.vertical?n.height?Math.max(0,Math.min(1,1-(i.clientY-n.top)/n.height)):0:n.width?Math.max(0,Math.min(1,(i.clientX-n.left)/n.width)):0},o=i=>(0,s.Ee)(e.min+i*t,e.min,e.max,e.step);return n.qy`
    <div
      class="mc-tile-slider ${e.vertical?"mc-tile-slider--vertical":""} ${e.className??""}"
      role="slider"
      tabindex=${e.disabled?-1:0}
      aria-label=${e.label}
      aria-valuemin=${e.min}
      aria-valuemax=${e.max}
      aria-valuenow=${e.value??n.s6}
      aria-valuetext=${e.valueText||n.s6}
      aria-orientation=${e.vertical?"vertical":"horizontal"}
      aria-disabled=${e.disabled?"true":"false"}
      style="--slider-value: ${i}; touch-action: ${e.vertical?"pan-x":"pan-y"}; ${e.style??""}"
      @pointerdown=${i=>{if(i.stopPropagation(),e.disabled||void 0!==i.button&&0!==i.button)return;const n=i.currentTarget,s=n.querySelector(".mc-tile-slider-bar"),r=i=>s?.style.setProperty("--slider-value",String((o(i)-e.min)/t)),l=i.clientX,c=i.clientY;let d=!1;const u=e=>{d=!0;try{n.setPointerCapture?.(e.pointerId)}catch{}n.classList.add("mc-dragging"),r(a(n,e))};"mouse"===i.pointerType&&u(i);const p=t=>{if(!d){const i=Math.abs(e.vertical?t.clientY-c:t.clientX-l),n=Math.abs(e.vertical?t.clientX-l:t.clientY-c);if(i<8||i<n)return;return void u(t)}r(a(n,t))},h=(i,r)=>{if(n.removeEventListener("pointermove",p),n.removeEventListener("pointerup",m),n.removeEventListener("pointercancel",f),n.classList.remove("mc-dragging"),s?.style.removeProperty("--slider-value"),!r)return;const l=o(a(n,i));n.style.setProperty("--slider-value",String((l-e.min)/t)),e.onCommit(l)},m=e=>{e.stopPropagation(),h(e,!0)},f=e=>h(e,!1);n.addEventListener("pointermove",p),n.addEventListener("pointerup",m),n.addEventListener("pointercancel",f)}}
      @pointerup=${r}
      @click=${r}
      @keydown=${i=>{if(i.stopPropagation(),e.disabled)return;const n=e.value??e.min,r=Math.max(e.step,t/10),a={ArrowRight:n+e.step,ArrowUp:n+e.step,ArrowLeft:n-e.step,ArrowDown:n-e.step,PageUp:n+r,PageDown:n-r,Home:e.min,End:e.max};if(!(i.key in a))return;i.preventDefault();const o=(0,s.Ee)(a[i.key],e.min,e.max,e.step);o!==e.value&&e.onCommit(o)}}
    >
      <div class="mc-tile-slider-background"></div>
      <div class="mc-tile-slider-bar"></div>
    </div>
  `}i.d(t,["i",0,r])},7945(e,t,i){var n=i(7921),s=i(7643);const r=e=>{const t=(0,s.vt)(e);return"active"===t?.state&&void 0!==t.end&&t.end>Date.now()};class a extends n.Kq{render(e){return(0,s.HF)(e)??""}update(e,[t]){this._state=t;const i=e.parentNode,n=1===i?.nodeType?i:null;return n!==this._el&&(this._tick?.run(!1),this._el=n??void 0,this._tick=n?new s.bU(n,()=>{this.setValue(this.render(this._state)),r(this._state)||this._tick?.run(!1)}):void 0),this._tick?.run(this.isConnected&&r(t)),this.render(t)}disconnected(){this._tick?.run(!1)}reconnected(){this._tick?.run(r(this._state))}}const o=(0,n.u$)(a);i.d(t,["q",0,o])},7643(e,t,i){i.d(t,{HF:()=>o,bU:()=>d,vt:()=>a});var n=i(9040);const s=e=>!!e&&e.startsWith("timer.");function r(e){if("number"==typeof e)return Number.isFinite(e)&&e>=0?1e3*e:void 0;if("string"!=typeof e)return;const t=/^\s*(?:(\d+)\s+days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2}(?:\.\d+)?))?\s*$/.exec(e);if(!t)return;const[,i,n,s,r]=t;return 1e3*(3600*(24*Number(i||0)+Number(n))+60*Number(s)+Number(r||0))}function a(e,t=Date.now()){if(!e||!s(e.entity_id))return;const i=e.attributes||{},n=r(i.duration),a=r(i.remaining),o=e.state;if("active"===o){const s="string"==typeof i.finishes_at?Date.parse(i.finishes_at):NaN;if(Number.isFinite(s))return{state:o,remaining:Math.max(0,s-t),total:n??a??0,end:s};if(void 0===a)return;const r="string"==typeof e.last_updated?Date.parse(e.last_updated):NaN;return Number.isFinite(r)?{state:o,remaining:Math.max(0,r+a-t),total:n??a,end:r+a}:{state:o,remaining:a,total:n??a}}return"paused"===o?void 0===a?void 0:{state:o,remaining:a,total:n??a}:{state:"idle",remaining:0,total:n??0}}function o(e,t=Date.now()){const i=a(e,t);if(i&&"idle"!==i.state)return function(e){const t=Math.max(0,Math.ceil(e/1e3)),i=Math.floor(t/3600),n=Math.floor(t%3600/60),s=String(t%60).padStart(2,"0");return i?`${i}:${String(n).padStart(2,"0")}:${s}`:`${n}:${s}`}(void 0!==i.end?i.end-t:i.remaining)}const l=new Set;let c;class d{constructor(e,t){this._el=e,this._cb=t,this._on=!1}run(e){e!==this._on&&(this._on=e,e?(0,n.jR)(this._el,e=>this._tick(e))||this._tick(!0):((0,n.eF)(this._el),this._tick(!1)))}_tick(e){var t;e&&!this._off?this._off=(t=this._cb,l.add(t),c??=setInterval(()=>l.forEach(e=>e()),1e3),()=>{l.delete(t),l.size||void 0===c||(clearInterval(c),c=void 0)}):!e&&this._off&&(this._off(),this._off=void 0)}}i.d(t,["Yj",0,(e,t=Date.now())=>{const i=void 0!==e.end?Math.max(0,e.end-t):e.remaining;return e.total>0?Math.min(1,i/e.total):0},"_7",0,s])},9556(e,t,i){i.d(t,{Ih:()=>d,dh:()=>u,mU:()=>p});var n=i(5931),s=i(2515),r=i(1702);const a={color:"var(--mc-primary, var(--primary-color))",opacity:.25,areaOpacity:.18,lineOpacity:.45,hours:24,maxHours:168,lineWidth:1.5,maxPoints:60},o=["up","down","left","right"],l=e=>{const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0},c=(e,t)=>{const i=l(e);return void 0!==i&&i>0?i:t};function d(e,t){if(!e||"object"!=typeof e)return;if("fill"!==e.type&&"sparkline"!==e.type)return;const i=e.entity||t.entity;if(!i)return;const s=t.hass?.states?.[i],r=e.attribute||void 0,d=l(e.min),u=l(e.max),p="fill"===e.type,h={type:e.type,color:(0,n.dU)(e.color,s)??a.color,opacity:(0,n.uM)(e.opacity)??(p?a.opacity:a.areaOpacity),direction:o.includes(e.direction)?e.direction:"up",wave:!1!==e.wave,hours:Math.min(a.maxHours,c(e.hours,a.hours)),lineWidth:c(e.line_width,a.lineWidth),area:!1!==e.area,smoothing:!1!==e.smoothing,entity:i};return p&&(h.level=(0,n.EN)(s,r,d,u)),r&&(h.attribute=r),void 0!==d&&(h.min=d),void 0!==u&&(h.max=u),h}function u(e,t,i,n){const o=(Array.isArray(e)?e:[]).filter(e=>e&&Number.isFinite(e.t)&&Number.isFinite(e.v)).sort((e,t)=>e.t-t.t);if(!o.length||!(t>0&&i>0))return{line:""};const c=l(n.start)??o[0].t,d=l(n.end)??o[o.length-1].t;if(!(d>c))return{line:""};const u=o.filter(e=>e.t<=d).map(e=>({t:Math.max(e.t,c),v:e.v}));if(!u.length)return{line:""};const p=a.maxPoints-1;let h=u.length>p?(0,r.pz)(u,c,d,p):u;h!==u&&h.length&&(h[0]={t:Math.min(h[0].t,u[0].t),v:h[0].v}),h=h.filter((e,t)=>t===h.length-1||h[t+1].t>e.t);const m=l(n.hold)??u[u.length-1].v,f=h[h.length-1].t<d;if(f&&h.push({t:d,v:m}),h.length<2)return{line:""};let g=1/0,y=-1/0;for(const e of h)e.v<g&&(g=e.v),e.v>y&&(y=e.v);let v=l(n.min),b=l(n.max);void 0!==v&&void 0!==b&&v>b&&([v,b]=[b,v]);const w=v??Math.min(g,b??g),x=(b??Math.max(y,v??y))-w,_=void 0===v&&void 0===b?.5:void 0===b?0:void 0===v?1:.5,$=e=>x>0?Math.min(1,Math.max(0,(e-w)/x)):_,k=Math.min(Math.max(0,l(n.pad)??2),i/4),M=h.map(e=>({x:(e.t-c)/(d-c)*t,y:i-k-$(e.v)*(i-2*k)})),S=(0,s.TV)(M,t,i,n.smoothing);if(!S)return{line:""};const C=e=>String(Math.round(100*e)/100),T={line:S};if(n.splitHeld&&f){const e=M[M.length-2],r=M[M.length-1];T.line=M.length>2?(0,s.TV)(M.slice(0,-1),t,i,n.smoothing):"",T.tail=`M${C(e.x)} ${C(e.y)} L${C(r.x)} ${C(r.y)}`}return n.area&&(T.area=`${S} L${C(M[M.length-1].x)} ${C(i)} L${C(M[0].x)} ${C(i)} Z`),T}function p(e,t,i){const n=(Array.isArray(e)?e:[]).filter(e=>e&&Number.isFinite(e.t)&&Number.isFinite(e.v)&&e.t<=i).sort((e,t)=>e.t-t.t).map(e=>({t:Math.max(e.t,t),v:e.v}));if(!n.length)return{points:[]};const s=n[n.length-1].v,o=a.maxPoints-2;if(n.length<=o||!(i>t))return{points:n,last:s};const l=(0,r.pz)(n,t,i,o);return l.length&&(l[0]={t:Math.min(l[0].t,n[0].t),v:l[0].v}),{points:l,last:s}}i.d(t,["BJ",0,a])},6698(e,t,i){i.d(t,{G:()=>u,cY:()=>c,lA:()=>l,u7:()=>o});const n={daily:1,hourly:2,twice_daily:4},s=["daily","hourly","twice_daily"],r={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"},a={sunny:"mdi:weather-night",partlycloudy:"mdi:weather-night-partly-cloudy"};function o(e,t=!1){const i=e??"";return t&&a[i]||r[i]||"mdi:weather-partly-cloudy"}function l(e){const t=Number(e?.attributes.supported_features)||0;return s.filter(e=>t&n[e])}function c(e,t,i){if("unavailable"===e.state||"unknown"===e.state)return{status:"unavailable"};const n=l(e),s=function(e){const t=e.attributes.forecast;return Array.isArray(t)?t:void 0}(e),r=t??"daily";if(!n.length)return s?{status:"ok",type:r,forecast:s}:{status:"none"};const a=t&&n.includes(t)?t:n[0],o=i?.subscribe?.({type:"weather/subscribe_forecast",entity_id:e.entity_id,forecast_type:a});return"ok"===o?.status?{status:"ok",type:a,forecast:o.data?.forecast??[]}:s?{status:"ok",type:a,forecast:s}:o&&"unavailable"!==o.status?o:{status:"pending"}}const d=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];function u(e){if(null==e||""===e)return"";const t=Number(e);return Number.isNaN(t)?String(e):d[Math.round((t%360+360)%360/22.5)%16]}},3826(e,t,i){const n=globalThis,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),a=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new o("string"==typeof e?e:e+"",void 0,r),c=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return l(t)})(e):e;i.d(t,["AH",0,(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,r)},"Rf",0,(e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=n.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}},"iz",0,l,"sk",0,c])},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>a});var n=i(8760);const s={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},r=(e=s,t,i)=>{const{kind:n,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function a(e){return(t,i)=>"object"==typeof i?r(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>s});var n=i(5694);function s(e){return(0,n.M)({...e,state:!0,attribute:!1})}},8760(e,t,i){i.d(t,{AH:()=>n.AH,iz:()=>n.iz,mN:()=>v});var n=i(3826);const{is:s,defineProperty:r,getOwnPropertyDescriptor:a,getOwnPropertyNames:o,getOwnPropertySymbols:l,getPrototypeOf:c}=Object,d=globalThis,u=d.trustedTypes,p=u?u.emptyScript:"",h=d.reactiveElementPolyfillSupport,m=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?p:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},g=(e,t)=>!s(e,t),y={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;class v extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=y){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&r(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=a(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const r=n?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??y}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const e=c(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const e=this.properties,t=[...o(e),...l(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift((0,n.sk)(e))}else void 0!==e&&t.push((0,n.sk)(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return(0,n.Rf)(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=n;const r=s.fromAttribute(t,e.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const r=this.constructor;if(!1===n&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??g)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[m("elementProperties")]=new Map,v[m("finalized")]=new Map,h?.({ReactiveElement:v}),(d.reactiveElementVersions??=[]).push("2.1.2"),i.d(t,["Ec",0,g,"W3",0,f])},5228(e,t,i){i.d(t,{AH:()=>n.AH,JW:()=>s.JW,WF:()=>a,c0:()=>s.c0,iz:()=>n.iz,qy:()=>s.qy,s6:()=>s.s6});var n=i(8760),s=i(6752);const r=globalThis;class a extends n.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,s.XX)(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return s.c0}}a._$litElement$=!0,a.finalized=!0,r.litElementHydrateSupport?.({LitElement:a});const o=r.litElementPolyfillSupport;o?.({LitElement:a});(r.litElementVersions??=[]).push("4.2.2")},6201(e,t,i){i.d(t,{Kq:()=>u,OA:()=>s.OA,u$:()=>s.u$});var n=i(8504),s=i(7804);const r=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),r(e,t);return!0},a=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},o=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),d(t)}};function l(e){void 0!==this._$AN?(a(this),this._$AM=e,o(this)):this._$AM=e}function c(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)r(n[e],!1),a(n[e]);else null!=n&&(r(n,!1),a(n));else r(this,e)}const d=e=>{e.type==s.OA.CHILD&&(e._$AP??=c,e._$AQ??=l)};class u extends s.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),o(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(r(this,e),a(this))}setValue(e){if((0,n.Rt)(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}},8504(e,t,i){var n=i(6752);const{I:s}=n.ge,r={};i.d(t,["Rt",0,e=>void 0===e.strings,"mY",0,(e,t=r)=>e._$AH=t])},7804(e,t,i){i.d(t,{WL:()=>n});class n{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}i.d(t,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,e=>(...t)=>({_$litDirective$:e,values:t})])},68(e,t,i){i.d(t,{D:()=>r});var n=i(6752),s=i(7804);class r extends s.WL{constructor(e){if(super(e),this.it=n.s6,e.type!==s.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===n.s6||null==e)return this._t=void 0,this.it=e;if(e===n.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}r.directiveName="unsafeHTML",r.resultType=1;const a=(0,s.u$)(r);i.d(t,["_",0,a])},6752(e,t,i){const n=globalThis,s=e=>e,r=n.trustedTypes,a=r?r.createPolicy("lit-html",{createHTML:e=>e}):void 0,o="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,c="?"+l,d=`<${c}>`,u=document,p=()=>u.createComment(""),h=e=>null===e||"object"!=typeof e&&"function"!=typeof e,m=Array.isArray,f=e=>m(e)||"function"==typeof e?.[Symbol.iterator],g="[ \t\n\f\r]",y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,b=/>/g,w=RegExp(`>|${g}(?:([^\\s"'>=/]+)(${g}*=${g}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),x=/'/g,_=/"/g,$=/^(?:script|style|textarea|title)$/i,k=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),M=k(1),S=k(2),C=(k(3),Symbol.for("lit-noChange")),T=Symbol.for("lit-nothing"),A=new WeakMap,E=u.createTreeWalker(u,129);function P(e,t){if(!m(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==a?a.createHTML(t):t}const z=(e,t)=>{const i=e.length-1,n=[];let s,r=2===t?"<svg>":3===t?"<math>":"",a=y;for(let t=0;t<i;t++){const i=e[t];let c,u,p=-1,h=0;for(;h<i.length&&(a.lastIndex=h,u=a.exec(i),null!==u);)h=a.lastIndex,a===y?"!--"===u[1]?a=v:void 0!==u[1]?a=b:void 0!==u[2]?($.test(u[2])&&(s=RegExp("</"+u[2],"g")),a=w):void 0!==u[3]&&(a=w):a===w?">"===u[0]?(a=s??y,p=-1):void 0===u[1]?p=-2:(p=a.lastIndex-u[2].length,c=u[1],a=void 0===u[3]?w:'"'===u[3]?_:x):a===_||a===x?a=w:a===v||a===b?a=y:(a=w,s=void 0);const m=a===w&&e[t+1].startsWith("/>")?" ":"";r+=a===y?i+d:p>=0?(n.push(c),i.slice(0,p)+o+i.slice(p)+l+m):i+l+(-2===p?t:m)}return[P(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class L{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,a=0;const d=e.length-1,u=this.parts,[h,m]=z(e,t);if(this.el=L.createElement(h,i),E.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=E.nextNode())&&u.length<d;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(o)){const t=m[a++],i=n.getAttribute(e).split(l),r=/([.?@])?(.*)/.exec(t);u.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?I:"?"===r[1]?j:"@"===r[1]?D:N}),n.removeAttribute(e)}else e.startsWith(l)&&(u.push({type:6,index:s}),n.removeAttribute(e));if($.test(n.tagName)){const e=n.textContent.split(l),t=e.length-1;if(t>0){n.textContent=r?r.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],p()),E.nextNode(),u.push({type:2,index:++s});n.append(e[t],p())}}}else if(8===n.nodeType)if(n.data===c)u.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(l,e+1));)u.push({type:7,index:s}),e+=l.length-1}s++}}static createElement(e,t){const i=u.createElement("template");return i.innerHTML=e,i}}function O(e,t,i=e,n){if(t===C)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=h(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=O(e,s._$AS(e,t.values),s,n)),t}class q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??u).importNode(t,!0);E.currentNode=n;let s=E.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new R(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new B(s,this,e)),this._$AV.push(t),o=i[++a]}r!==o?.index&&(s=E.nextNode(),r++)}return E.currentNode=u,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=O(this,e,t),h(e)?e===T||null==e||""===e?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==C&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):f(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&h(this._$AH)?this._$AA.nextSibling.data=e:this.T(u.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=L.createElement(P(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new q(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=A.get(e.strings);return void 0===t&&A.set(e.strings,t=new L(e)),t}k(e){m(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new R(this.O(p()),this.O(p()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=s(e).nextSibling;s(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class N{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=T}_$AI(e,t=this,i,n){const s=this.strings;let r=!1;if(void 0===s)e=O(this,e,t,0),r=!h(e)||e!==this._$AH&&e!==C,r&&(this._$AH=e);else{const n=e;let a,o;for(e=s[0],a=0;a<s.length-1;a++)o=O(this,n[i+a],t,a),o===C&&(o=this._$AH[a]),r||=!h(o)||o!==this._$AH[a],o===T?e=T:e!==T&&(e+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class I extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}}class j extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}}class D extends N{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=O(this,e,t,0)??T)===C)return;const i=this._$AH,n=e===T&&i!==T||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==T&&(i===T||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class B{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){O(this,e)}}const W={M:o,P:l,A:c,C:1,L:z,R:q,D:f,V:O,I:R,H:N,N:j,U:D,B:I,F:B},F=n.litHtmlPolyfillSupport;F?.(L,R),(n.litHtmlVersions??=[]).push("3.3.3");i.d(t,["JW",0,S,"XX",0,(e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new R(t.insertBefore(p(),e),e,void 0,i??{})}return s._$AI(e),s},"c0",0,C,"ge",0,W,"qy",0,M,"s6",0,T])},7921(e,t,i){i.d(t,{Kq:()=>n.Kq,OA:()=>n.OA,u$:()=>n.u$});var n=i(6201)},5707(e,t,i){i.d(t,{EM:()=>n.E,MZ:()=>s.M,wk:()=>r.w});var n=i(6505),s=i(5694),r=i(4290)},6161(e,t,i){i.d(t,{AH:()=>n.AH,JW:()=>n.JW,WF:()=>n.WF,c0:()=>n.c0,iz:()=>n.iz,qy:()=>n.qy,s6:()=>n.s6});i(8760),i(6752);var n=i(5228)}};const t={};function i(n){const s=t[n];if(void 0!==s)return s.exports;const r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}i.m=e,i.d=(e,t)=>{if(Array.isArray(t))for(var n=0;n<t.length;){var s=t[n++],r=t[n++],a=0===r?{enumerable:!0,value:t[n++]}:{enumerable:!0,get:r};i.o(e,s)||Object.defineProperty(e,s,a)}else for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.f={},i.e=e=>{const t=[];return i.f.j(e,t),Promise.all(t)},i.u=e=>"magic-card-"+{8:"editor",300:"particles",494:"preset-catalogue",734:"icon-animator",811:"anim-runtime"}[e]+".js?v="+{8:"d7456d8d",300:"b2574533",494:"7f148e60",734:"9e87af3b",811:"dcb51f38"}[e],i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="",(()=>{const e={143:0},t=t=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:s,__webpack_esm_runtime__:r}=t;var a,o,l=0;for(a in s)i.o(s,a)&&(i.m[a]=s[a]);for(r&&r(i);l<n.length;l++)o=n[l],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0};i.f.j=(n,s)=>{let r=i.o(e,n)?e[n]:void 0;if(0!==r)if(r)s.push(r[1]);else{let a=import(i.p+i.u(n)).then(t,t=>{throw 0!==e[n]&&(e[n]=void 0),t});a=Promise.race([a,new Promise(t=>r=e[n]=[t])]),s.push(r[1]=a)}}})();const n="2026.10.04";var s=i(4139),r=i(6161),a=i(5707),o=i(9460),l=i(5845),c=i(1182),d=i(6838),u=i(7757);const p={...c.S,...d.Tb,...u.H},h={...c._,...d.bh,...u.D},m={...d.I3};function f(e,t,i=!1){const n=(0,l.e2)(t),s=`var(--mca-${t}-c, var(--mc-anim-c))`;return e.replace(/\$i/g,`var(--mca-${t}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${s} calc(var(--mca-${t}-s, 1) * 100%), transparent)`:s)}const g=r.AH`
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

  ${(0,r.iz)(function(){const e=Object.entries(p).map(([e,t])=>`@keyframes mc-anim-${e} {${f(t,e.replace(/-icon$/,""),!0)}\n}`),t=l.u7.filter(e=>void 0!==e.particles).map(e=>`.mc-anim-fx[data-fx="${e.id}"] {\n  opacity: var(--mca-${e.id}-s, 1);\n}`),i=Object.entries(m).map(([e,t])=>`.mc-anim-fx[data-fx="${e}"] {${f(t,e)}\n}`),n=Object.entries(h).map(([e,t])=>{const[i,n=""]=e.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${f(t,i)}\n}`});return[...e,...t,...i,...n].join("\n")}())}

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
`,y=r.AH`
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
`;var v=i(340),b=i(9040);const w="var(--state-weather-snowy-color, #b3e5fc)",x=e=>`animation-delay: ${e}s`,_=(e,t,i,n,s=!1)=>r.JW`
  <g transform=${`translate(${e} ${t}) scale(${i})`}>
    <g class=${s?"wx-cloud wx-cloud-back":"wx-cloud"} fill="currentColor" style=${`fill: ${(e=>`color-mix(in srgb, currentColor ${Math.round(100*e)}%, var(--ha-card-background, var(--card-background-color, #fff)))`)(n)}`}>
      <circle cx="-8" cy="2" r="6"></circle>
      <circle cx="0" cy="-4" r="9"></circle>
      <circle cx="9" cy="1" r="7"></circle>
      <rect x="-8" y="0" width="17" height="8"></rect>
    </g>
  </g>`,$=(e,t,i)=>r.JW`
  <g class="wx-sun" transform=${`translate(${e} ${t}) scale(${i})`} style=${"color: var(--state-weather-sunny-color, #fbc02d)"}>
    <g class="wx-rays" stroke="currentColor" stroke-width="3" stroke-linecap="round">
      ${[0,45,90,135,180,225,270,315].map(e=>{const t=e*Math.PI/180,i=Math.cos(t),n=Math.sin(t);return r.JW`<line x1=${+(15*i).toFixed(2)} y1=${+(15*n).toFixed(2)} x2=${+(20*i).toFixed(2)} y2=${+(20*n).toFixed(2)}></line>`})}
    </g>
    <circle r="10.5" fill="currentColor"></circle>
  </g>`,k=(e,t,i,n=!1)=>r.JW`
  <g class="wx-moon" transform=${`translate(${e} ${t}) scale(${i}) translate(-32 -32)`} style=${"color: var(--state-weather-clear-night-color, #9fa8da)"}>
    <path d="M32.65 18.02A14 14 0 1 0 45.44 35.92A11 11 0 1 1 32.65 18.02Z" fill="currentColor"></path>
    ${n?r.JW`<path class="wx-star" d="M49 14l1.2 2.8L53 18l-2.8 1.2L49 22l-1.2-2.8L45 18l2.8-1.2Z" fill="currentColor"></path>
          <path class="wx-star" d="M18 44l.9 2.1L21 47l-2.1.9L18 50l-.9-2.1L15 47l2.1-.9Z" fill="currentColor" style=${x(-1.5)}></path>`:r.s6}
  </g>`,M=(e,t=44)=>r.JW`
  <g class="wx-rain" stroke-width="2.5" stroke-linecap="round" style=${"stroke: var(--state-weather-rainy-color, #4fc3f7)"}>
    ${e.map((i,n)=>r.JW`<line class="wx-drop" x1=${i} y1=${t} x2=${i-2} y2=${t+7} style=${x(-.9*n/e.length)}></line>`)}
  </g>`,S=(e,t=44)=>r.JW`
  <g class="wx-snow" style=${`fill: ${w}`}>
    ${e.map((i,n)=>r.JW`<circle class="wx-flake" cx=${i} cy=${t+n%2*5} r="2.4" style=${x(-2.4*n/e.length)}></circle>`)}
  </g>`,C=(e,t)=>r.JW`
  <path class="wx-bolt" transform=${`translate(${e} ${t})`} d="M4 0h8l-4 8h6L4 22l3-10H1Z" style=${"fill: var(--state-weather-lightning-color, #ffb300)"}></path>`,T=["M8 26H38A6 6 0 1 0 32 20","M6 36H46A6 6 0 1 1 40 42","M14 46H32"],A=e=>r.JW`
  <g class="wx-winds" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.85">
    ${e.map((e,t)=>r.JW`<path class="wx-wind" d=${e} pathLength="100" style=${x(.6*-t)}></path>`)}
  </g>`;function E(e,t){switch(e){case"sunny":return t?k(32,32,1.25,!0):$(32,32,1.05);case"clear-night":return k(32,32,1.25,!0);case"partlycloudy":return r.JW`${((e,i,n)=>t?k(e,i,.75*n):$(e,i,n))(23,23,.72)}${_(37,38,1.05,.85)}`;case"cloudy":return r.JW`${_(24,27,.8,.6,!0)}${_(36,38,1.1,.85)}`;case"rainy":return r.JW`${_(32,28,1.15,.85)}${M([24,33,42])}`;case"pouring":return r.JW`${_(26,22,.8,.6,!0)}${_(34,28,1.15,.85)}${M([20,27,34,41,48])}`;case"snowy":return r.JW`${_(32,28,1.15,.85)}${S([22,30,38,46])}`;case"snowy-rainy":return r.JW`${_(32,28,1.15,.85)}${M([24,40])}${S([32,48])}`;case"hail":return r.JW`${_(32,28,1.15,.85)}${((e,t=44)=>r.JW`
  <g class="wx-hail-group" style=${`fill: ${w}`}>
    ${e.map((i,n)=>r.JW`<circle class="wx-hail" cx=${i} cy=${t} r="2.6" style=${x(-.7*n/e.length)}></circle>`)}
  </g>`)([23,32,41,28])}`;case"lightning":return r.JW`${_(32,27,1.15,.85)}${C(25,36)}`;case"lightning-rainy":return r.JW`${_(32,27,1.15,.85)}${C(27,36)}${M([20,46])}`;case"fog":return r.JW`${_(32,24,1.05,.85)}
        <g class="wx-fogs" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.6">
          <line class="wx-fog" x1="12" y1="42" x2="44" y2="42"></line>
          <line class="wx-fog" x1="20" y1="49" x2="52" y2="49" style=${x(-2)}></line>
          <line class="wx-fog" x1="14" y1="56" x2="40" y2="56" style=${x(-1)}></line>
        </g>`;case"windy":return A(T);case"windy-variant":return r.JW`${_(36,22,.95,.85)}${A(["M6 38H40A6 6 0 1 1 34 44","M12 30H26"])}`;case"exceptional":return r.JW`<g class="wx-alert" style=${"color: var(--state-weather-exceptional-color, var(--warning-color, #ff9800))"}>
        <circle cx="32" cy="32" r="19" fill="none" stroke="currentColor" stroke-width="4"></circle>
        <line x1="32" y1="21" x2="32" y2="35" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"></line>
        <circle cx="32" cy="43" r="2.8" fill="currentColor"></circle>
      </g>`;default:return}}function P(e,t){const i=E(e,!!t.night);if(!i)return;const n=(0,v.f8)(t.color);return r.qy`<svg
    ${(0,b.Sv)()}
    class=${t.className?`mc-wx ${t.className}`:"mc-wx"}
    viewBox="0 0 64 64"
    focusable="false"
    data-condition=${e}
    style=${n?`color: ${n}`:r.s6}
    role=${t.label?"img":r.s6}
    aria-label=${t.label||r.s6}
    aria-hidden=${t.label?r.s6:"true"}
  >${i}</svg>`}const z=r.AH`
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
`,L=(0,r.iz)(["filter:","backdrop-filter:","-webkit-backdrop-filter:","opacity:","transform:","translate:","scale:","rotate:","isolation:","mix-blend-mode:","clip-path:","-webkit-clip-path:","mask","-webkit-mask","will-change:","contain:","perspective:"].flatMap(e=>[`[style^='${e}']`,`[style*='; ${e}']`,`[style*=';${e}']`]).join(", ")),O=r.AH`
  .mc-card-content[data-mc-flows] {
    position: relative;
    isolation: isolate;
  }
  .mc-card-content[data-mc-flows]
    :is(.mc-row, .mc-column):is(
      [data-mc-anim],
      [data-mc-anim-fx],
      [data-mc-value-bg],
      ${L},
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
`,q=r.AH`
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
`,R=r.AH`
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
`,N=r.AH`
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
`,I=r.AH`
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
`,j=r.AH`
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
  mc-seasonal,
  mc-seasonal-deco {
    z-index: -1;
    pointer-events: none;
  }
  mc-seasonal[layer='front'] {
    z-index: auto;
  }
  ${(0,r.iz)("[data-mc-flash] [data-mc-flash] > mc-seasonal")},
  ${(0,r.iz)("mc-seasonal[flash] ~ mc-seasonal")} {
    --mc-sn-flash: none;
  }
`,D=[".mc-bar",".mc-separator",".mc-slider-container--horizontal",".mc-image",".mc-dropdown",".mc-video-bg",".mc-camera",".mc-graphs",".mc-nested-row",".mc-slider-layout"].join(", "),B=[".mc-horizontal",".mc-vertical",".mc-gauge"].join(", "),W=r.AH`
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

  /* Button module wrapper */
  .mc-button {
    display: inline-flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    padding: var(--mc-button-padding);
    border-top-left-radius: var(--mc-design-radius-tl, var(--mc-button-radius));
    border-top-right-radius: var(--mc-design-radius-tr, var(--mc-button-radius));
    border-bottom-right-radius: var(--mc-design-radius-br, var(--mc-button-radius));
    border-bottom-left-radius: var(--mc-design-radius-bl, var(--mc-button-radius));
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    color: var(--mc-design-color, var(--mc-text));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    transition: background var(--mc-transition-duration);
  }

  .mc-button:hover {
    background: var(--mc-border);
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
    border: none;
    background: var(--mc-design-bg, var(--mc-button-color));
    color: var(--mc-design-color, var(--mc-button-text-color));
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
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
    border: none;
  }

  .mc-button-inner--outline {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border: 1px solid var(--mc-button-color);
  }

  .mc-button-inner--flat {
    background: var(--mc-design-bg, transparent);
    color: var(--mc-design-color, var(--mc-button-color));
    border: none;
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
    border: 1px solid var(--mc-border);
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
  .mc-horizontal > .mc-module-wrapper:not(:has(> :is(${(0,r.iz)(D)}, ${(0,r.iz)(B)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-module-wrapper:has(> :is(${(0,r.iz)(D)})),
  .mc-vertical > .mc-module-wrapper:has(> :is(${(0,r.iz)(D)})) {
    width: 100%;
    box-sizing: border-box;
  }
  /* the same for a shaped module with a shadow, whose flex item is its drop-shadow wrapper */
  .mc-horizontal > .mc-shape-shadow:not(:has(> .mc-module-wrapper > :is(${(0,r.iz)(D)}, ${(0,r.iz)(B)}))) {
    min-width: min-content;
  }
  .mc-horizontal > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,r.iz)(D)})),
  .mc-vertical > .mc-shape-shadow:has(> .mc-module-wrapper > :is(${(0,r.iz)(D)})) {
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
    padding: var(--mc-gap-sm);
    min-width: 60px;
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

  .mc-button:active,
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
`,F=[o.A,W,g,y,z,O,R,I,j];var H=i(3041),G=i(5173),J=i(1874),U=i(3166),V=i(508);let Z,Y;const X=()=>Y;const K=()=>i.e(8).then(()=>i(2417));let Q,ee=K;const te=(e,t)=>(Q=void 0,console.warn(e,...void 0===t?[]:[t]),!1);function ie(){return Q??=ee().then(e=>e.EDITOR_VERSION===n||te(`Magic Card was updated, reload the page (magic-card.js ${n}, magic-card-editor.js ${e.EDITOR_VERSION}).`),e=>te("Magic Card: the editor (magic-card-editor.js) could not be loaded, reload the page.",e)),Q}var ne=i(5312),se=i(2515);const re=(e,t)=>({x:e,y:t}),ae=(e,t)=>Math.abs(e.x-t.x)<1e-6&&Math.abs(e.y-t.y)<1e-6;function oe(e){const t=[...(e||"").matchAll(/([MLCZ])([^MLCZ]*)/gi)];if(!t.length||"M"!==t[0][1])return;let i,n;const s=[];for(const[,e,r]of t){const t=(r.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi)??[]).map(Number);if("M"===e){if(i||2!==t.length)return;i=n=re(t[0],t[1])}else if("L"===e){if(t.length%2)return;for(let e=0;e<t.length;e+=2)s.push({to:n=re(t[e],t[e+1])})}else if("C"===e){if(t.length%6)return;for(let e=0;e<t.length;e+=6)s.push({c1:re(t[e],t[e+1]),c2:re(t[e+2],t[e+3]),to:n=re(t[e+4],t[e+5])})}else if("Z"===e&&i&&n&&!ae(n,i))s.push({to:n=i});else if("Z"!==e)return}return i&&s.length?(n&&!ae(n,i)&&s.push({to:i}),{start:i,segs:s}):void 0}const le=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},ce=e=>`${le(e.x)} ${le(e.y)}`;function de(e,t,i){const n=1-i;return t.c1&&t.c2?re(n*n*n*e.x+3*n*n*i*t.c1.x+3*n*i*i*t.c2.x+i*i*i*t.to.x,n*n*n*e.y+3*n*n*i*t.c1.y+3*n*i*i*t.c2.y+i*i*i*t.to.y):re(e.x+(t.to.x-e.x)*i,e.y+(t.to.y-e.y)*i)}function ue(e,t){let i={i:0,t:0,d:1/0},n=e.start;if(e.segs.forEach((e,s)=>{const r=e.c1?48:1,a=r=>{const a=de(n,e,r),o=(a.x-t.x)**2+(a.y-t.y)**2;o<i.d&&(i={i:s,t:r,d:o})};if(e.c1)for(let e=0;e<=r;e++)a(e/r);else{const i=e.to.x-n.x,s=e.to.y-n.y,r=i*i+s*s;a(r>0?Math.min(1,Math.max(0,((t.x-n.x)*i+(t.y-n.y)*s)/r)):0)}n=e.to}),e.segs[i.i].c1){const n=e.segs[i.i],s=i.i?e.segs[i.i-1].to:e.start;let r=Math.max(0,i.t-1/48),a=Math.min(1,i.t+1/48);for(let e=0;e<30;e++){const e=r+(a-r)/3,i=a-(a-r)/3;(de(s,n,e).x-t.x)**2+(de(s,n,e).y-t.y)**2<(de(s,n,i).x-t.x)**2+(de(s,n,i).y-t.y)**2?a=i:r=e}i.t=(r+a)/2}return i}function pe(e,t){const{i,t:n}=ue(e,t),s=i?e.segs[i-1].to:e.start;if(n<1e-6&&0===i)return e;const r=e.segs[i];if(n>.999999)return he(e,(i+1)%e.segs.length);if(n<1e-6)return he(e,i);const[a,o]=function(e,t,i){const n=de(e,t,i);if(!t.c1||!t.c2)return[{to:n},{to:t.to}];const s=(e,t)=>re(e.x+(t.x-e.x)*i,e.y+(t.y-e.y)*i),r=s(e,t.c1),a=s(t.c1,t.c2),o=s(t.c2,t.to);return[{c1:r,c2:s(r,a),to:n},{c1:s(a,o),c2:o,to:t.to}]}(s,r,n);return{start:a.to,segs:[o,...e.segs.slice(i+1),...e.segs.slice(0,i),a]}}function he(e,t){return 0===t?e:{start:e.segs[t-1].to,segs:[...e.segs.slice(t),...e.segs.slice(0,t)]}}function me(e,t=12){const i=[e.start];let n=e.start;for(const s of e.segs){if(s.c1)for(let e=1;e<t;e++)i.push(de(n,s,e/t));i.push(s.to),n=s.to}return i.length>1&&ae(i[i.length-1],e.start)&&i.pop(),i}function fe(e,t){const i=e.match(/-?\d*\.?\d+(?:e[+-]?\d+)?(?:px|%)?|[a-z-]+\(|[()+\-*/,]/gi)??[];if(i.join("").replace(/\s+/g,"")!==e.replace(/\s+/g,""))return NaN;let n=0;const s=()=>i[n],r=()=>i[n++],a=()=>{const e=r();if(void 0===e)return NaN;if("("===e){const e=l();return")"===r()?e:NaN}if("-"===e)return-a();const i=/^([a-z-]+)\($/i.exec(e)?.[1].toLowerCase();if(i){const e=(()=>{const e=[l()];for(;","===s();)r(),e.push(l());return")"!==r()?[NaN]:e})();return"calc"===i&&1===e.length?e[0]:"min"===i?Math.min(...e):"max"===i?Math.max(...e):"clamp"===i&&3===e.length?Math.max(e[0],Math.min(e[1],e[2])):NaN}const n=parseFloat(e);return e.endsWith("%")?n/100*t:n},o=()=>{let e=a();for(;"*"===s()||"/"===s();)e="*"===r()?e*a():e/a();return e},l=()=>{let e=o();for(;;){const t=s();if("+"===t||"-"===t)r(),e="+"===t?e+o():e-o();else{if(void 0===t||!/^-\d|^-\./.test(t))return e;e+=o()}}},c=l();return n===i.length?c:NaN}function ge(e,t){if(!e)return 0;const i=/^[a-z-]+\(/i.test(e.trim())?fe(e.trim(),t):e.trim().endsWith("%")?parseFloat(e)/100*t:parseFloat(e);return Number.isFinite(i)&&i>0?i:0}function ye(e,t,i){const[n,s=n]=function(e){const t=[];let i=0,n="";for(const s of e.trim())"("===s&&i++,")"===s&&i--,/\s/.test(s)&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}(e||"");return{x:ge(n,t),y:ge(s,i)}}function ve(e,t,i){return{tl:ye(e.borderTopLeftRadius,t,i),tr:ye(e.borderTopRightRadius,t,i),br:ye(e.borderBottomRightRadius,t,i),bl:ye(e.borderBottomLeftRadius,t,i)}}const be=(e,t)=>({x:e.x*t,y:e.y*t});function we(e,t,i){const n=(e,t)=>t>e?e/t:1,s=Math.min(n(t,e.tl.x+e.tr.x),n(i,e.tr.y+e.br.y),n(t,e.br.x+e.bl.x),n(i,e.tl.y+e.bl.y));return s>=1?e:{tl:be(e.tl,s),tr:be(e.tr,s),br:be(e.br,s),bl:be(e.bl,s)}}function xe(e,t){const i=e=>t>=0?{x:Math.max(0,e.x-t),y:Math.max(0,e.y-t)}:{x:e.x>0?e.x-t:0,y:e.y>0?e.y-t:0};return{tl:i(e.tl),tr:i(e.tr),br:i(e.br),bl:i(e.bl)}}const _e=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},$e=(e,t)=>Math.abs(e.x-t.x)<1e-6&&Math.abs(e.y-t.y)<1e-6;function ke(e,t,i,n){const s=e=>{const n=e*Math.PI/180;return{x:t.x+i.x*Math.cos(n),y:t.y+i.y*Math.sin(n)}},[r,a,o]=[s(n),s(n+45),s(n+90)];return[{kind:"A",group:e,from:r,to:a,rx:i.x,ry:i.y},{kind:"A",group:e,from:a,to:o,rx:i.x,ry:i.y}]}function Me(e,t,i){const n={x:(t.x+i.x)/2,y:(t.y+i.y)/2};return[{kind:"L",group:e,from:t,to:n,rx:0,ry:0},{kind:"L",group:e,from:n,to:i,rx:0,ry:0}]}const Se={top:0,right:4,bottom:8,left:12,"top-left":14};function Ce(e,t,i,n,s={}){const r=s.inset??0;let a;if(r>=0){const s=(0,se.q8)(e,t,i,n,r);a=s?oe(s):void 0}else{const s=t-2*r>0&&i-2*r>0?(0,se.j9)(e,t-2*r,i-2*r,n):void 0,o=s&&oe(s.d);a=o&&function(e,t,i){const n=e=>re(e.x+t,e.y+i);return{start:n(e.start),segs:e.segs.map(e=>e.c1&&e.c2?{c1:n(e.c1),c2:n(e.c2),to:n(e.to)}:{to:n(e.to)})}}(o,r,r)}if(!a)return"";let o=pe(a,function(e,t,i){switch(e){case"right":return{x:t,y:i/2};case"bottom":return{x:t/2,y:i};case"left":return{x:0,y:i/2};case"top-left":return{x:0,y:0};default:return{x:t/2,y:0}}}(s.start,t,i));return"ccw"===s.direction&&(o=function(e){const t=[e.start,...e.segs.map(e=>e.to)],i=[];for(let n=e.segs.length-1;n>=0;n--){const s=e.segs[n],r=t[n];i.push(s.c1&&s.c2?{c1:s.c2,c2:s.c1,to:r}:{to:r})}return{start:e.start,segs:i}}(o)),function(e){const t=e.segs.slice(),i=t[t.length-1];return i&&!i.c1&&ae(i.to,e.start)&&t.length>1&&t.pop(),[`M${ce(e.start)}`,...t.map(e=>e.c1&&e.c2?`C${ce(e.c1)} ${ce(e.c2)} ${ce(e.to)}`:`L${ce(e.to)}`),"Z"].join(" ")}(o)}const Te=e=>Math.round(100*e)/100,Ae=(e,t,i)=>Math.min(i,Math.max(t,e)),Ee=(e,t)=>({x:e,y:t}),Pe=e=>`${Te(e.x)} ${Te(e.y)}`,ze=(e,t)=>Math.hypot(t.x-e.x,t.y-e.y);function Le(e,t=0){let i;if(e.shape){const n=oe(Ce(e.shape.kind,e.w,e.h,e.shape.options,{inset:t}));i=n?me(n,24):[]}else i=function(e,t,i,n){const s=n,r=n,a=e-n,o=t-n;if(!(a>s&&o>r))return[];const l=we(xe(we(i,e,t),n),a-s,o-r),c=[],d=(e,t,i,n,s)=>{const r=Math.max(1,Math.ceil(Math.max(i,n)*Math.PI/2/1.5));for(let a=0;a<=r;a++){const o=(s+90*a/r)*Math.PI/180;c.push(Ee(e+i*Math.cos(o),t+n*Math.sin(o)))}};return d(a-l.tr.x,r+l.tr.y,l.tr.x,l.tr.y,-90),d(a-l.br.x,o-l.br.y,l.br.x,l.br.y,0),d(s+l.bl.x,o-l.bl.y,l.bl.x,l.bl.y,90),d(s+l.tl.x,r+l.tl.y,l.tl.x,l.tl.y,180),c.filter((e,t)=>0===t||ze(e,c[t-1])>1e-6).filter((e,t,i)=>t<i.length-1||ze(e,i[0])>1e-6)}(e.w,e.h,e.radii,t);return i.length>2&&function(e){let t=0;for(let i=0;i<e.length;i++){const n=e[i],s=e[(i+1)%e.length];t+=n.x*s.y-s.x*n.y}return t/2}(i)<0?i.reverse():i}function Oe(e,t=!0){let i=0;const n=t?e.length:e.length-1;for(let t=0;t<n;t++)i+=ze(e[t],e[(t+1)%e.length]);return i}function qe(e){const t=[0];for(let i=0;i<e.length;i++)t.push(t[i]+ze(e[i],e[(i+1)%e.length]));const i=t[t.length-1];return{length:i,at:n=>{const s=(n%i+i)%i;let r=0,a=e.length-1;for(;r<a;){const e=r+a+1>>1;t[e]<=s?r=e:a=e-1}const o=e[r],l=e[(r+1)%e.length],c=t[r+1]-t[r]||1,d=(s-t[r])/c,u=(l.x-o.x)/c,p=(l.y-o.y)/c;return{x:o.x+(l.x-o.x)*d,y:o.y+(l.y-o.y)*d,tx:u,ty:p,nx:-p,ny:u}}}}function Re(e,t,i=.5){if(e.length<2||t<=0)return[];const n=qe(e);return Array.from({length:t},(e,s)=>n.at((s+i)*n.length/t))}function Ne(e,t){const i=qe(e);let n={s:0,d:1/0},s=0;for(let i=0;i<e.length;i++){const r=e[i],a=e[(i+1)%e.length],o=ze(r,a),l=o?Ae(((t.x-r.x)*(a.x-r.x)+(t.y-r.y)*(a.y-r.y))/(o*o),0,1):0,c=Math.hypot(r.x+(a.x-r.x)*l-t.x,r.y+(a.y-r.y)*l-t.y);c<n.d&&(n={s:s+l*o,d:c}),s+=o}return{s:n.s,sample:i.at(n.s)}}const Ie=(e,t=!0)=>e.length?`M${e.map(Pe).join("L")}${t?"Z":""}`:"";function je(e){if(e.length<2)return"";let t=`M${Pe(e[0])}`;for(let i=0;i+1<e.length;i++){const n=e[Math.max(0,i-1)],s=e[i],r=e[i+1],a=e[Math.min(e.length-1,i+2)],o=Ee(s.x+(r.x-n.x)/6,s.y+(r.y-n.y)/6),l=Ee(r.x-(a.x-s.x)/6,r.y-(a.y-s.y)/6);t+=`C${Pe(o)} ${Pe(l)} ${Pe(r)}`}return t}const De={lights:36,icicles:40,frost:32,cobweb:72,pumpkin:72,vine:72};const Be=(e,t)=>{let i=0;return e.replace(/-?\d*\.?\d+(?:e-?\d+)?/g,e=>i++%2==0?String(Te(t-Number(e))):e)};function We(e,t,i="mc"){const n=function(e,t,i){const n=Math.min(t,i);return e.filter(e=>n>=De[e]&&("lights"!==e||2*(t+i)>=160)&&("icicles"!==e||t>=60))}(e,t.w,t.h),s={clip:Ie(Le(t,0))};return n.includes("lights")&&(s.lights=function(e){const t=Le(e,5);if(t.length<3)return;const i=Oe(t),n=Ae(Math.round(i/30),6,40),s=Re(t,n),r=Ae(i/n*.14,1.5,4.5),a=Te(Ae(Math.min(e.w,e.h)/110,.6,.9));let o=`M${Pe(s[0])}`;s.forEach((e,t)=>{const i=s[(t+1)%n],a=(i.x-e.x)/(ze(e,i)||1),l=(i.y-e.y)/(ze(e,i)||1),c=-l,d=a,u=Ee((e.x+i.x)/2+c*r*1.2*Math.abs(l),(e.y+i.y)/2+2*r*Math.abs(a)+d*r*1.2*Math.abs(l));o+=`Q${Pe(u)} ${Pe(i)}`});const l=s.map((e,t)=>{const i=e.nx,n=e.ny+.8,s=Math.hypot(i,n),r=180*(s<.3?Math.atan2(e.ny,e.nx):Math.atan2(n/s,i/s))/Math.PI-90+(t%2?14:-14);return{x:Te(e.x),y:Te(e.y),angle:Math.round(r),index:t}});return{wire:o,bulbs:l,scale:a,inset:5}}(t)),n.includes("icicles")&&(s.icicles=function(e,t){const i=Le(e,.5);if(i.length<3)return;const n=Oe(i),s=Re(i,Math.max(8,Math.round(n/2))),r=(0,ne.Is)(`${t}|icicles`),a=Ae(.2*e.h,6,18),o=s.filter(e=>e.ny>.82);if(!o.length)return;const l=[];let c=-1/0;for(const e of o.sort((e,t)=>e.x-t.x)){if(e.x-c<6.5)continue;c=e.x+2*r();const t=r()<.3,i=Te(a*(t?.7+.3*r():.25+.4*r())),n=Te(Ae(.38*i,2.4,5.4)),s=e.x,o=e.y-.5,d=Ee(s+1.2*(r()-.5),o+i),u=`M${Te(s-n/2)} ${Te(o)}C${Te(s-n/2)} ${Te(o+.35*i)} ${Te(d.x-.12*n)} ${Te(o+.75*i)} ${Pe(d)}C${Te(d.x+.12*n)} ${Te(o+.75*i)} ${Te(s+n/2)} ${Te(o+.35*i)} ${Te(s+n/2)} ${Te(o)}Z`;l.push({d:u,x:Te(s),y:Te(o),length:i})}return{cap:je(o.sort((e,t)=>e.x-t.x).filter((e,t)=>t%3==0).map((e,t)=>Ee(e.x,e.y+1+(t%2?.8:-.2)*(.6+.6*r())))),icicles:l}}(t,i)),n.includes("frost")&&(s.frost=function(e,t){const i=Le(e,0);if(i.length<3)return;const n=(0,ne.Is)(`${t}|frost`),s=Ae(.32*Math.min(e.w,e.h),14,46),r=Ee(e.w/2,e.h/2),a=[Ee(0,0),Ee(e.w,0),Ee(e.w,e.h),Ee(0,e.h)].map(e=>{const{sample:t}=Ne(i,e),a=Ee(r.x-t.x,r.y-t.y),o=Math.hypot(a.x,a.y)||1,l=Math.atan2(a.y/o,a.x/o);let c="";for(const e of[-.55,0,.55]){const i=l+e+.25*(n()-.5),r=s*(0===e?.85:.6)*(.8+.3*n()),a=Ee(t.x+1.5*Math.cos(l),t.y+1.5*Math.sin(l)),o=Ee(a.x+Math.cos(i)*r,a.y+Math.sin(i)*r);c+=`M${Pe(a)}L${Pe(o)}`;for(const e of[.35,.6,.82]){const t=Ee(a.x+Math.cos(i)*r*e,a.y+Math.sin(i)*r*e),n=r*(1-e)*.55;for(const e of[-1,1]){const s=i+.9*e;c+=`M${Pe(t)}L${Pe(Ee(t.x+Math.cos(s)*n,t.y+Math.sin(s)*n))}`}}}return{x:Te(t.x),y:Te(t.y),radius:Te(1.25*s),crystals:c}});return{outline:Ie(i),corners:a}}(t,i)),n.includes("cobweb")&&(s.cobweb=function(e,t){if(!e)return;const i=e.spider;return{threads:Be(e.threads,t),spiral:Be(e.spiral,t),spider:{...i,x:Te(t-i.x),thread:Be(i.thread,t)}}}(function(e){const t=Le(e,0);if(t.length<3)return;const{sample:i}=Ne(t,Ee(0,0)),n=Math.max(e.radii.tl.x,e.radii.tl.y),s=Ae(Math.max(46,2.2*n),30,.45*Math.min(e.w,e.h)),r=Math.min(ze(i,Ee(0,0)),.3*s),a=Math.atan2(i.ny,i.nx),o=Math.hypot(i.x,i.y)>1e-6?Math.atan2(i.y,i.x)+Math.PI:a+Math.PI,l=Ee(i.x+Math.cos(o)*r,i.y+Math.sin(o)*r),c=Array.from({length:6},(e,t)=>a-Math.PI/4-.1+(Math.PI/2+.2)*t/5);let d="";for(const e of c)d+=`M${Pe(l)}L${Pe(Ee(l.x+Math.cos(e)*s*1.15,l.y+Math.sin(e)*s*1.15))}`;let u="";for(const e of[.2,.36,.53,.7,.86,1]){const t=s*e;for(let e=0;e+1<c.length;e++){const i=c[e],n=c[e+1],s=Ee(l.x+Math.cos(i)*t,l.y+Math.sin(i)*t),r=Ee(l.x+Math.cos(n)*t,l.y+Math.sin(n)*t),a=(i+n)/2,o=Ee(l.x+Math.cos(a)*t*.82,l.y+Math.sin(a)*t*.82);u+=`${0===e?`M${Pe(s)}`:""}Q${Pe(o)} ${Pe(r)}`}}const p=c[Math.floor(3)],h=Ee(l.x+Math.cos(p)*s*.62,l.y+Math.sin(p)*s*.62),m=Te(Ae(.16*s,5,8)),f=Ee(h.x,h.y+.42*s);return{threads:d,spiral:u,spider:{x:Te(f.x),y:Te(f.y),size:m,thread:`M${Pe(h)}L${Pe(f)}`}}}(function(e){const t=e.radii;return{...e,radii:{tl:t.tr,tr:t.tl,br:t.bl,bl:t.br}}}(t)),t.w)),n.includes("pumpkin")&&(s.pumpkin=function(e){const t=Le(e,1);if(t.length<3)return;const i=Te(Ae(.3*Math.min(e.w,e.h),20,36)),n=Re(t,Math.max(8,Math.round(Oe(t)/2))).filter(e=>e.ny<-.9);if(!n.length)return;const s=Math.max(...n.map(e=>e.x))-.75*i,r=n.reduce((e,t)=>Math.abs(t.x-s)<Math.abs(e.x-s)?t:e);return{x:Te(r.x),y:Te(r.y),size:i}}(t)),n.includes("vine")&&(s.vine=function(e,t){const i=Le(e,4);if(i.length<3)return;const n=qe(i),s=(0,ne.Is)(`${t}|vine`),{s:r}=Ne(i,Ee(0,e.h)),a=Ae(.55*e.h,28,100),o=Ae(.36*e.w,40,150),l=Math.max(8,Math.round((a+o)/6)),c=[];for(let e=0;e<=l;e++)c.push(n.at(r+a-(a+o)*e/l));const d=c.map((e,t)=>{const i=1.6*Math.sin(t/l*(a+o)/3.5);return Ee(e.x+e.nx*i,e.y+e.ny*i)}),u=[],p=[],h=Math.max(2,Math.round(l/14));c.forEach((e,t)=>{if(0===t||t===l||t%h)return;const i=180*Math.atan2(-e.ty,-e.tx)/Math.PI,n=t/h%2?1:-1;u.push({x:Te(d[t].x),y:Te(d[t].y),angle:Math.round(i+55*n),size:Te(7+3*s())})});for(const e of[.12,.38,.62,.88]){const t=Math.round(e*l),i=d[t],n=c[t];p.push({x:Te(i.x+3*n.nx),y:Te(i.y+3*n.ny),size:Te(.38===e?10:7.5+2*s()),rotate:Math.round(72*s())})}const m=(e,t,i)=>{const n=-t.tx*i,s=-t.ty*i,r=Ee(e.x+4*n+2*t.nx,e.y+4*s+2*t.ny),a=Ee(r.x+3*t.nx,r.y+3*t.ny),o=Ee(a.x-2.5*n,a.y-2.5*s);return`M${Pe(e)}Q${Pe(r)} ${Pe(a)}Q${Pe(o)} ${Pe(Ee(o.x-1.4*t.nx,o.y-1.4*t.ny))}`};return{stem:je(d),tendrils:m(d[0],c[0],-1)+m(d[l],c[l],1),leaves:u,flowers:p}}(t,i)),s}var Fe=i(4628),He=i(7643),Ge=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function Je(e){const t=e.offsetWidth,i=e.offsetHeight,n="function"==typeof e.getBoundingClientRect?e.getBoundingClientRect():void 0;return n&&Math.abs(n.width-t)<1&&Math.abs(n.height-i)<1?{w:n.width,h:n.height}:{w:t,h:i}}const Ue=new Map;let Ve;function Ze(e,t){let i=Ue.get(e);i||(i=new Set,Ue.set(e,i),(Ve||"function"!=typeof ResizeObserver||(Ve=new ResizeObserver(e=>{for(const t of e)Ue.get(t.target)?.forEach(e=>e.measure())})),Ve)?.observe(e)),i.add(t)}function Ye(e,t){const i=Ue.get(e);i&&(i.delete(t),i.size||(Ue.delete(e),Ve?.unobserve(e)))}let Xe=class extends r.WF{constructor(){super(...arguments),this._onMedia=()=>this.requestUpdate(),this._onEnd=()=>{this.hasAttribute("data-tap")&&this.removeAttribute("data-tapped")}}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._observe(),this._timer()}disconnectedCallback(){super.disconnectedCallback(),this._tick?.run(!1),this._unobserve(),this._media?.removeEventListener?.("change",this._onMedia)}_unobserve(){this._observed&&Ye(this._observed,this),this._mutations?.disconnect(),this._mutations=void 0,this._observed=void 0}_observe(){const e=this.parentElement;e&&e!==this._observed&&(this._unobserve(),this._observed=e,Ze(e,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this.measure()),this._mutations.observe(e,{attributes:!0,attributeFilter:["style","class"]})),this.measure())}measure(){const e=this.parentElement;if(!e)return;const t=getComputedStyle(e),{w:i,h:n}=this.shape?Je(e):{w:e.offsetWidth,h:e.offsetHeight},s={w:i,h:n,top:parseFloat(t.borderTopWidth)||0,left:parseFloat(t.borderLeftWidth)||0,radii:ve(t,i,n)};JSON.stringify(s)!==JSON.stringify(this._box)&&(this._box=s)}updated(e){super.updated(e),this._observe(),e.has("ring")&&this._timer()}_timer(){const e=this.ring?.timer,t=!!e&&this.isConnected&&e.end>Date.now();t&&(this._tick??=new He.bU(this,()=>{this.requestUpdate(),this.ring?.timer&&this.ring.timer.end>Date.now()||this._tick?.run(!1)})),this._tick?.run(t)}render(){const e=this.ring?.timer?{...this.ring,...(0,Fe.dg)(this.ring.timer)}:this.ring,t=this._box;if(!e||!t)return r.s6;const i={inset:(0,Fe.cr)(e.position,e.width),start:e.start,direction:e.direction},n=this.shape?Ce(this.shape.kind,t.w,t.h,this.shape.options,i):function(e,t,i,n={}){const s=n.inset??0,r=s,a=s,o=e-s,l=t-s;if(!(e>0&&t>0)||o<=r||l<=a)return"";const c=we(xe(we(i,e,t),s),o-r,l-a),d=Me("top",{x:r+c.tl.x,y:a},{x:o-c.tr.x,y:a}),u=[d[1],...ke("tr",{x:o-c.tr.x,y:a+c.tr.y},c.tr,-90),...Me("right",{x:o,y:a+c.tr.y},{x:o,y:l-c.br.y}),...ke("br",{x:o-c.br.x,y:l-c.br.y},c.br,0),...Me("bottom",{x:o-c.br.x,y:l},{x:r+c.bl.x,y:l}),...ke("bl",{x:r+c.bl.x,y:l-c.bl.y},c.bl,90),...Me("left",{x:r,y:l-c.bl.y},{x:r,y:a+c.tl.y}),...ke("tl",{x:r+c.tl.x,y:a+c.tl.y},c.tl,180),d[0]],p=Se[n.start??"top"]??0;let h=[...u.slice(p),...u.slice(0,p)];const m="ccw"===n.direction;m&&(h=h.reverse().map(e=>({...e,from:e.to,to:e.from})));const f=[];for(const e of h){if($e(e.from,e.to))continue;const t=f[f.length-1];t&&t.group===e.group&&$e(t.to,e.from)?t.to=e.to:f.push({...e})}if(!f.length)return"";const g=f[0].from,y=f[f.length-1];"L"===y.kind&&$e(y.to,g)&&f.length>1&&f.pop();const v=m?0:1,b=[`M${_e(g.x)} ${_e(g.y)}`];for(const e of f)b.push("L"===e.kind?`L${_e(e.to.x)} ${_e(e.to.y)}`:`A${_e(e.rx)} ${_e(e.ry)} 0 0 ${v} ${_e(e.to.x)} ${_e(e.to.y)}`);return b.push("Z"),b.join(" ")}(t.w,t.h,t.radii,i),s=(0,Fe.nI)(e,!!this._media?.matches);if(!n)return r.s6;const a=e.glow>0?`; filter: drop-shadow(0 0 ${e.glow}px ${e.color})`:"",o=[`--mc-ring-w: ${e.width}px`,`stroke: ${e.color}`,`stroke-width: ${e.width}px`,`stroke-linecap: ${s.linecap}`,`stroke-dasharray: ${s.dasharray}`,`stroke-dashoffset: ${s.dashoffset}`,`opacity: ${s.opacity}`,`animation: ${s.animation}`,`transition: ${s.transition}`].join("; "),l=`top: ${-t.top}px; left: ${-t.left}px; width: ${t.w}px; height: ${t.h}px${void 0!==e.opacity?`; opacity: ${e.opacity}`:""}`;return r.qy`<svg style=${l} viewBox="0 0 ${t.w} ${t.h}" preserveAspectRatio="none" focusable="false">
      ${e.track?r.JW`<path d=${n} pathLength="100" style="stroke: ${e.track}; stroke-width: ${e.width}px"></path>`:r.s6}
      <path d=${n} pathLength="100" style="${o}${a}" @animationend=${this._onEnd}></path>
    </svg>`}};Xe.styles=r.AH`
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
  `,Ge([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!function(e,t){if(e===t)return!0;if(!e||!t)return!1;const i=Object.keys(e);return i.length===Object.keys(t).length&&i.every(i=>e[i]===t[i]||"timer"===i&&JSON.stringify(e[i])===JSON.stringify(t[i]))}(e,t)})],Xe.prototype,"ring",void 0),Ge([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>JSON.stringify(e)!==JSON.stringify(t)})],Xe.prototype,"shape",void 0),Ge([(0,a.wk)()],Xe.prototype,"_box",void 0),Xe=Ge([(0,a.EM)("mc-ring")],Xe);var Ke=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Qe=new Set(["squircle","hexagon","octagon","blob","wave","notch","ticket","pill","circle"]),et=["--mc-shape-it","--mc-shape-ir","--mc-shape-ib","--mc-shape-il"];function tt(e){const t=e?.shape;if(!t||!Qe.has(t))return;const i=e?.shape_options;return i&&"object"==typeof i&&Object.keys(i).length?{kind:t,options:i}:{kind:t}}let it;function nt(e){if(void 0===it&&(it="undefined"==typeof CSS||"function"!=typeof CSS.supports||CSS.supports("clip-path",'path("M0 0")')),it)return`path('${e}')`;const t=oe(e);return t?function(e,t=8){return`polygon(${me(e,t).map(e=>`${le(e.x)}px ${le(e.y)}px`).join(", ")})`}(t):"none"}function st(e,t){const i=[];for(let n=0;n<e.length;n++){const s=e[n],r=e[(n+1)%e.length],a=t(s),o=t(r);if(a>=0&&i.push(s),a>=0!=o>=0){const e=a/(a-o);i.push({x:s.x+(r.x-s.x)*e,y:s.y+(r.y-s.y)*e})}}return i}const rt=e=>Math.round(100*e)/100;let at=0;let ot=class extends r.WF{constructor(){super(...arguments),this.offscreen=!1,this._onMedia=()=>this.requestUpdate(),this._clip="",this._insets=[],this._raf=0,this._animKey="",this._watching=!1,this._clipSource="",this._maskId="mc-shape-mask-"+ ++at}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._observe()}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._unobserve()}_observe(){const e=this.parentElement??void 0;e&&e!==this._parent&&(this._unobserve(),this._parent=e,Ze(e,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this._restore()),this._mutations.observe(e,{attributes:!0,attributeFilter:["style","class","tabindex"]})),this.measure())}_unobserve(){const e=this._parent;if(this._stopAnimation(),this._raf&&cancelAnimationFrame(this._raf),this._raf=0,this._mutations?.disconnect(),this._mutations=void 0,e){Ye(e,this),this._clip&&e.style.getPropertyValue("clip-path")===this._clip&&e.style.removeProperty("clip-path");for(const t of et)e.style.removeProperty(t);this._clip="",this._insets=[],this._parent=void 0,this._box=void 0}}measure(){const e=this.parentElement;if(!e||!this.shape)return;const t=getComputedStyle(e),i=/^\s*([\d.]+)px\s*$/.exec(this.stroke?.width??""),{w:n,h:s}=Je(e),r=parseFloat(t.borderTopWidth)||0,a=parseFloat(t.borderLeftWidth)||0,o=parseFloat(t.borderRightWidth)||0,l=parseFloat(t.borderBottomWidth)||0,c=(e=>"HA-CARD"===e.tagName?e.querySelector(":scope > .mc-card-content")??e:e)(e),d=function(e,t){const i=getComputedStyle(t),n=[i.paddingTop,i.paddingRight,i.paddingBottom,i.paddingLeft].map(e=>parseFloat(e)||0);return et.map((t,i)=>n[i]>(parseFloat(e.style.getPropertyValue(t))||0)+.01?n[i]:0)}(e,c),u=function(e){if("border-box"!==getComputedStyle(e).boxSizing)return;let t=1/0,i=-1/0;for(const n of e.children){if(!(n instanceof HTMLElement&&"MC-SHAPE"!==n.tagName&&n.offsetHeight))continue;const s=getComputedStyle(n).position;if("absolute"===s||"fixed"===s)continue;if(n.offsetParent!==e&&n.offsetParent!==e.offsetParent)return;const r=n.offsetParent===e?n.offsetTop:n.offsetTop-e.offsetTop;t=Math.min(t,r),i=Math.max(i,r+n.offsetHeight)}return i>t?i-t:void 0}(c),p=void 0===u?0:Math.max(0,Math.min(s/4,(s-u)/2-1)),h={w:n,h:s,top:r,left:a,right:o,bottom:l,bw:this.stroke?i?parseFloat(i[1]):r:0,focus:e.hasAttribute("tabindex"),pad:[r+d[0],o+d[1],l+d[2],a+d[3]],free:p};JSON.stringify(h)!==JSON.stringify(this._box)&&(this._box=h),this._apply(!1)}_restore(){const e=this._parent;if(!e)return;const t=e.style.getPropertyValue("clip-path")!==this._clip||et.some((t,i)=>e.style.getPropertyValue(t)!==(this._insets[i]??""));t&&this._apply(!0),this.measure(),this._mutations?.takeRecords()}_apply(e){const t=this._parent,i=this._box;if(!t||!i||!this.shape)return;const{kind:n,options:s}=this.shape,r=[0,1,2,3].map(e=>Math.max(0,Number(this.edge?.[e])||0)),a=(e,t,a,o)=>{const l=(0,se.j9)(n,i.w,i.h,s,{top:e-r[0],right:t-r[1],bottom:a-r[2],left:o-r[3]});return l&&{d:l.d,inset:{top:l.inset.top+r[0],right:l.inset.right+r[1],bottom:l.inset.bottom+r[2],left:l.inset.left+r[3]}}},[o,l,c,d]=i.pad,u=a(o,l,c,d),p=i.free>Math.min(o,c)?a(Math.max(o,i.free),l,Math.max(c,i.free),d):void 0,h=e=>e?Math.ceil(e.inset.left)+Math.ceil(e.inset.right):1/0,m=!!p&&h(p)<h(u),f=m?p:u;if(!f)return;const g=m?i.free:0,y=nt(f.d);t.style.getPropertyValue("clip-path")===this._clip&&this._clipSource===y||(t.style.setProperty("clip-path",y),this._clip=t.style.getPropertyValue("clip-path"),this._clipSource=y);const v=[i.top,i.right,i.bottom,i.left],b=[Math.max(f.inset.top,g),f.inset.right,Math.max(f.inset.bottom,g),f.inset.left].map((e,t)=>`${Math.max(0,Math.ceil(e-v[t]-1e-6))}px`),w=()=>{this._raf=0;const e=this._parent;e&&(et.forEach((t,i)=>{e.style.getPropertyValue(t)!==b[i]&&e.style.setProperty(t,b[i])}),this._insets=et.map(t=>e.style.getPropertyValue(t)),this._mutations?.takeRecords(),this.measure())},x=et.some((e,i)=>t.style.getPropertyValue(e)!==b[i]);x&&(e||"function"!=typeof requestAnimationFrame?w():this._raf?(cancelAnimationFrame(this._raf),this._raf=requestAnimationFrame(w)):this._raf=requestAnimationFrame(w),this._mutations?.takeRecords())}_frames(e,t=0){const i=this.shape;if(!i?.options?.animate||"blob"!==i.kind&&"wave"!==i.kind||this._media?.matches)return;const n=e.w-2*t,s=e.h-2*t;if(!(n>0&&s>0))return;const r=i.options;if("wave"===i.kind)return Array.from({length:9},(e,t)=>(0,se.j9)("wave",n,s,{...r,phase:t/8})?.d??"");const a=Number(r.seed??7),o=e=>Number.isFinite(a)?a+e:e?`${r.seed}-${e}`:r.seed;return[0,1,2,0].map(e=>(0,se.j9)("blob",n,s,{...r,seed:o(e)})?.d??"")}_duration(){return 1e3*("wave"===this.shape?.kind?3:12)}_stopAnimation(){this._anim?.cancel(),this._anim=void 0,this._animKey="",this._watching&&(0,b.IH)()?.unobserve(this),this._watching=!1}_syncAnimation(){const e=this._parent,t=this._box,i=t?this._frames(t):void 0;if(!e||!i||"function"!=typeof e.animate)return void this._stopAnimation();const n=i.join("|");n!==this._animKey&&(this._anim?.cancel(),this._animKey=n,this._anim=e.animate(i.map(e=>({clipPath:nt(e)})),{duration:this._duration(),iterations:1/0,easing:"blob"===this.shape?.kind?"ease-in-out":"linear"})),this._watching||((0,b.IH)()?.observe(this),this._watching=!0),this.offscreen?this._anim?.pause():this._anim?.play()}updated(e){super.updated(e),this._observe(),(e.has("shape")||e.has("stroke")||e.has("edge"))&&this.measure(),this._syncAnimation();const t=this.renderRoot.querySelector("svg");t&&"function"==typeof t.pauseAnimations&&(this.offscreen?t.pauseAnimations():t.unpauseAnimations())}render(){const e=this._box,t=this.shape;if(!e||!t)return r.s6;const i=this._renderStroke(e,t),n=e.focus?Ce(t.kind,e.w,e.h,t.options,{inset:1}):"";if(!i&&!n)return r.s6;const s=`top: ${-e.top}px; left: ${-e.left}px; width: ${e.w}px; height: ${e.h}px`;return r.qy`<svg style=${s} viewBox="0 0 ${e.w} ${e.h}" preserveAspectRatio="none" focusable="false">
      ${i??r.s6}${n?r.JW`<path class="focus" d=${n} style="stroke: var(--mc-shape-focus, transparent); stroke-width: 2px"></path>`:r.s6}
    </svg>`}_renderStroke(e,t){const i=this.stroke;if(!(i&&e.bw>0))return;const n=e.bw,s=Ce(t.kind,e.w,e.h,t.options,{inset:n/2});if(!s)return;const a="dashed"===i.style?`${rt(3*n)} ${rt(2*n)}`:"dotted"===i.style?`0 ${rt(2*n)}`:"none",o=`stroke: var(--mc-shape-stroke, ${i.color}); stroke-width: ${n}px; stroke-dasharray: ${a}; stroke-linecap: ${"dotted"===i.style?"round":"butt"}`,l=i.length?function(e,t,i){const n=Math.min(e,t)/2,s={top:[{x:0,y:0},{x:e,y:0},{x:e-n,y:n},{x:n,y:n}],right:[{x:e,y:0},{x:e,y:t},{x:e-n,y:t-n},{x:e-n,y:n}],bottom:[{x:e,y:t},{x:0,y:t},{x:n,y:t-n},{x:e-n,y:t-n}],left:[{x:0,y:t},{x:0,y:0},{x:n,y:n},{x:n,y:t-n}]},r="start"===i.align?0:"end"===i.align?1:.5;return i.sides.flatMap(n=>{const a="top"===n||"bottom"===n,o=a?e:t,l=Math.min(o,(0,se.dC)(i.value,o)??o),c=(o-l)*r,d=c+l,u=e=>a?e.x:e.y,p=st(st(s[n],e=>u(e)-c),e=>d-u(e));return p.length>=3?[p]:[]})}(e.w,e.h,i.length):void 0,c=this._frames(e,n/2);return r.JW`${l?r.JW`<mask id=${this._maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${e.w} height=${e.h}>${l.map(e=>r.JW`<polygon points=${e.map(e=>`${rt(e.x)},${rt(e.y)}`).join(" ")} fill="#fff"></polygon>`)}</mask>`:r.s6}
      ${c?r.JW`<g mask=${l?`url(#${this._maskId})`:r.s6}><g transform="translate(${rt(n/2)} ${rt(n/2)})">
            <path class="stroke" d=${c[0]} style=${o}><animate attributeName="d" values=${c.join(";")}
              dur="${this._duration()/1e3}s" repeatCount="indefinite" calcMode=${"blob"===t.kind?"spline":"linear"}
              keySplines=${"blob"===t.kind?c.slice(1).map(()=>"0.42 0 0.58 1").join(";"):r.s6}></animate></path>
          </g></g>`:r.JW`<path class="stroke" d=${s} style=${o} mask=${l?`url(#${this._maskId})`:r.s6}></path>`}`}};ot.styles=N,Ke([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>JSON.stringify(e)!==JSON.stringify(t)})],ot.prototype,"shape",void 0),Ke([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>JSON.stringify(e)!==JSON.stringify(t)})],ot.prototype,"stroke",void 0),Ke([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>JSON.stringify(e)!==JSON.stringify(t)})],ot.prototype,"edge",void 0),Ke([(0,a.MZ)({type:Boolean,reflect:!1})],ot.prototype,"offscreen",void 0),Ke([(0,a.wk)()],ot.prototype,"_box",void 0),ot=Ke([(0,a.EM)("mc-shape")],ot);var lt=i(9556),ct=i(4099),dt=i(1702),ut=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const pt=e=>Math.round(100*e)/100;let ht=class extends r.WF{constructor(){super(...arguments),this.offscreen=!1,this._onMedia=()=>this.requestUpdate(),this._onFetched=()=>this.requestUpdate(),this._watchingSize=!1,this._watchingScreen=!1,this._onReport=e=>{const t=this._onScreen;this._onScreen=e;const i=this.value;if(!e||!0===t||!this.isConnected||"sparkline"!==i?.type)return;const n=this._peek(i);(!n||Date.now()-n.timestamp>3e5)&&this.requestUpdate()}}get hass(){return this._hass}set hass(e){const t=this._hass;this._hass=e;const i="sparkline"===this.value?.type?this.value.entity:void 0;i&&(t&&e&&t.states?.[i]===e.states?.[i]||this.requestUpdate())}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this.hasUpdated&&this._sync()}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._media=void 0,this._unwatchSize(),this._unwatchScreen(),this._clearTimer()}measure(){const{w:e,h:t}=Je(this);(!this._size||Math.abs(this._size.w-e)>.5||Math.abs(this._size.h-t)>.5)&&(this._size={w:e,h:t})}_reduced(){return!!this._media?.matches}_waveMoves(){const e=this.value;return!!e&&"fill"===e.type&&e.wave&&this._level()>0&&this._level()<.99&&!this._reduced()}_level(){const e=this.value?.level;return void 0!==e&&Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}_unwatchSize(){this._watchingSize&&Ye(this,this),this._watchingSize=!1}_unwatchScreen(){this._watchingScreen&&(0,b.eF)(this),this._watchingScreen=!1,this._onScreen=void 0}_clearTimer(){void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0,this._timerAt=void 0}_peek(e){return e.entity?(0,dt.S5)(e.entity,e.hours,e.attribute):void 0}_sync(){if(!this.isConnected)return;const e=this.value,t="sparkline"===e?.type;t&&!this._watchingSize?(Ze(this,this),this._watchingSize=!0,this.measure()):t||this._unwatchSize();const i=t||this._waveMoves();i&&!this._watchingScreen?(this._watchingScreen=!0,this._onScreen=void 0,(0,b.jR)(this,this._onReport)||(this._onScreen=!0)):i||this._unwatchScreen();const n=t&&e?this._peek(e):void 0,s=n?n.timestamp+3e5+1e3:void 0;void 0===s||s<=Date.now()?this._clearTimer():this._timerAt!==s&&(this._clearTimer(),this._timerAt=s,this._timer=setTimeout(()=>{this._timer=void 0,this._timerAt=void 0,this.isConnected&&this._onScreen&&this.requestUpdate()},s-Date.now()))}updated(e){super.updated(e),this._sync()}willUpdate(e){super.willUpdate(e);const t=this.value;this.toggleAttribute("data-empty",!!t&&"fill"===t.type&&void 0===t.level)}render(){const e=this.value;return e?"fill"===e.type?this._renderFill(e):this._renderSparkline(e):r.s6}_renderFill(e){const t=this._level(),i=e.wave&&t>0&&t<.99,n=void 0===e.level;return r.qy`${n?r.qy`<div class="hatch" style="--mc-vb-color: ${e.color}"></div>`:r.s6}
      <div class="fill" data-dir=${e.direction} style="--mc-vb-color: ${e.color}">
        ${!n&&t<=0?r.qy`<div class="floor"></div>`:r.s6}
        <div class="liquid" style="opacity: ${e.opacity}; transform: translateY(${pt(100*(1-t))}%)">
          ${i?r.qy`<svg class="wave" ?data-animate=${this._waveMoves()} viewBox="0 0 200 10" preserveAspectRatio="none" focusable="false">
                <path d=${"M0 5Q12.5 0 25 5T50 5T75 5T100 5T125 5T150 5T175 5T200 5V10H0Z"}></path>
              </svg>`:r.s6}
        </div>
      </div>`}_history(e){const t=this._hass;if(e.entity)return this._onScreen&&this.isConnected&&t&&"function"==typeof t.callWS?(0,dt.JK)(t,e.entity,e.hours,e.attribute,this._onFetched):this._peek(e)}_historyPoints(e,t){const i=this._memo;if(i&&i.hist===e&&i.hours===t)return i;const n=e.timestamp;return this._memo={hist:e,hours:t,...(0,lt.mU)(e.samples,n-36e5*t,n)},this._memo}_renderSparkline(e){const t=this._history(e),i=this._size;if(!(t&&t.samples.length&&i&&i.w>0&&i.h>0))return r.s6;const n=Date.now(),s=n-36e5*e.hours,{points:a,last:o}=this._historyPoints(t,e.hours),l=a.slice(),c=e.entity?this._hass?.states?.[e.entity]:void 0,d=(0,ct.Pd)(c,e.attribute)?void 0:(0,ct.f4)(c,e.attribute);void 0!==d&&(!l.length||l[l.length-1].t<n)&&l.push({t:n,v:d});const u=Math.round(.35*i.h),{line:p,area:h,tail:m}=(0,lt.dh)(l,i.w,i.h-u,{min:e.min,max:e.max,smoothing:e.smoothing,area:e.area,pad:e.lineWidth/2+1,start:s,end:n,hold:void 0===d?o:void 0,splitHeld:void 0===d});if(!p&&!m)return r.s6;const f=`stroke: ${e.color}; stroke-width: ${e.lineWidth}px`;return r.qy`<svg class="spark" viewBox="0 0 ${pt(i.w)} ${pt(i.h)}" preserveAspectRatio="none" focusable="false">
      ${h?r.JW`<defs>
            <linearGradient id="mc-vb-area" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" style="stop-color: ${e.color}; stop-opacity: ${e.opacity}"></stop>
              <stop offset="1" style="stop-color: ${e.color}; stop-opacity: 0"></stop>
            </linearGradient>
          </defs>`:r.s6}
      <g transform="translate(0 ${u})">
        ${h?r.JW`<path class="area" d=${h} fill="url(#mc-vb-area)"></path>`:r.s6}
        ${p?r.JW`<path class="line" d=${p} style=${f}></path>`:r.s6}
        ${m?r.JW`<path class="line tail" d=${m} style=${f} stroke-dasharray="3 3"></path>`:r.s6}
      </g>
    </svg>`}};ht.styles=r.AH`
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
      background: var(--mc-vb-color);
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
  `,ut([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!((e,t)=>JSON.stringify(e)===JSON.stringify(t))(e,t)})],ht.prototype,"value",void 0),ut([(0,a.MZ)({type:Boolean})],ht.prototype,"offscreen",void 0),ut([(0,a.wk)()],ht.prototype,"_size",void 0),ht=ut([(0,a.EM)("mc-value-bg")],ht);const mt=(e,t,i)=>`@keyframes ${e} {${d.Tb[t].replace(/\$i/g,String(i))}}`,ft=e=>`\n  ${e}.p, ${e}.p *, ${e}.a { animation: none !important; }\n  ${e}.p { top: var(--y) !important; left: var(--x) !important; translate: none !important; }\n  ${e}.m-fall > *, ${e}.m-tumble > *, ${e}.m-blow > * { rotate: var(--r); }\n  ${e}.a-shimmer, ${e}.a-flash, ${e}.a-bolt { display: none; }\n  ${e}.m-burst { opacity: calc(var(--o) * 0.7); }\n`,gt=r.AH`
  :host {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
    overflow: hidden;
    border-radius: inherit;
    contain: layout paint style;
    --mc-sn-mist: color-mix(in srgb, var(--primary-text-color, #3c4043) 22%, transparent);
    --mc-sn-wind: color-mix(in srgb, var(--primary-text-color, #3c4043) 42%, transparent);
    --mc-sn-bat: color-mix(in srgb, var(--primary-text-color, #212121) 58%, #3d2457);
    /* pale blue on light cards, near white on dark ones */
    --mc-sn-snow: color-mix(in srgb, var(--primary-text-color, #212121) 18%, #bcd6f5);
    --mc-sn-snow-edge: color-mix(in srgb, var(--mc-sn-snow) 70%, #4f86c9);
    --mc-sn-cloud: color-mix(in srgb, var(--primary-text-color, #3c4043) 15%, transparent);
    --mc-sn-ghost-violet: color-mix(in srgb, #8466d8 26%, transparent);
    --mc-sn-ghost-green: color-mix(in srgb, #5fbf72 18%, transparent);
  }
  .layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    container-type: size;
  }
  .defs {
    position: absolute;
    width: 0;
    height: 0;
  }

  /* ── Particles ── */
  .p {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: var(--s);
    height: var(--s);
    margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
    color: var(--c);
    opacity: var(--o);
    animation-duration: var(--d);
    animation-delay: var(--dl);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  .p > svg,
  .p > b {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* fall / tumble: from just above the layer to just below it */
  .m-fall,
  .m-tumble,
  .m-rain,
  .m-drizzle {
    top: 0;
    margin-top: calc(var(--s) * -1);
    animation-name: mc-sn-fall;
  }
  @keyframes mc-sn-fall {
    from {
      translate: 0 0;
    }
    to {
      translate: var(--dx) calc(100cqh + var(--s) * 2);
    }
  }
  .m-fall > * {
    animation: mc-sn-sway calc(var(--d) * 0.32) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-sway {
    from {
      transform: translateX(calc(var(--sw) * -1)) rotate(calc(var(--r) - 25deg));
    }
    to {
      transform: translateX(var(--sw)) rotate(calc(var(--r) + 25deg));
    }
  }
  .m-tumble > * {
    animation: mc-sn-tumble calc(var(--d) * 0.42) ease-in-out var(--dl) infinite alternate;
  }
  .k-confetti > * {
    animation-duration: calc(var(--d) * 0.16);
  }
  @keyframes mc-sn-tumble {
    from {
      transform: translateX(calc(var(--sw) * -1)) rotate(var(--r)) rotateX(0deg) rotateY(0deg);
    }
    to {
      transform: translateX(var(--sw)) rotate(calc(var(--r) + 140deg)) rotateX(150deg) rotateY(50deg);
    }
  }

  /* rain: fast slanted streaks; drizzle: a streak now and then */
  .m-rain,
  .m-drizzle {
    width: 2px;
    margin-left: -1px;
    rotate: 12deg;
    animation-name: mc-sn-rain;
  }
  .m-drizzle {
    animation-name: mc-sn-drizzle;
  }
  /* each drop element carries three streaks (density without more elements) */
  .m-rain {
    width: 40px;
    height: calc(var(--s) * 2.2);
    margin-left: -20px;
  }
  .k-raindrop > b {
    --streak: linear-gradient(to bottom, transparent, var(--c));
    background:
      var(--streak) 2px 0 / 1.6px 46% no-repeat,
      var(--streak) 19px 100% / 1.4px 40% no-repeat,
      var(--streak) 35px 38% / 1.8px 48% no-repeat;
  }
  .m-drizzle > b {
    border-radius: 1px;
    background: linear-gradient(to bottom, transparent, var(--c));
  }
  @keyframes mc-sn-rain {
    from {
      translate: 0 0;
    }
    to {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
    }
  }
  @keyframes mc-sn-drizzle {
    0% {
      translate: 0 0;
      opacity: 0;
    }
    1% {
      opacity: var(--o);
    }
    10% {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
      opacity: var(--o);
    }
    10.01%,
    100% {
      translate: calc((100cqh + var(--s) * 2) * -0.21) calc(100cqh + var(--s) * 2);
      opacity: 0;
    }
  }

  /* rise: from below up through the layer, fading at both ends */
  .m-rise {
    top: 100%;
    margin-top: 0;
    animation-name: mc-sn-rise;
  }
  .m-rise > * {
    animation: mc-sn-sway calc(var(--d) * 0.3) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-rise {
    0% {
      translate: 0 0;
      opacity: 0;
    }
    12%,
    72% {
      opacity: var(--o);
    }
    100% {
      translate: var(--dx) calc(-100cqh - var(--s) * 2);
      opacity: 0;
    }
  }

  /* flutter / firefly: wander around a spot */
  .m-flutter,
  .m-firefly {
    animation-name: mc-sn-wander;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  @keyframes mc-sn-wander {
    0% {
      translate: 0 0;
    }
    25% {
      translate: var(--wx) calc(var(--wy) * -0.6);
    }
    50% {
      translate: calc(var(--wx) * -0.4) calc(var(--wy) * -1);
    }
    75% {
      translate: calc(var(--wx) * -1) calc(var(--wy) * 0.3);
    }
    100% {
      translate: calc(var(--wx) * 0.3) var(--wy);
    }
  }
  .k-butterfly > svg {
    rotate: var(--r);
  }
  .k-butterfly .wings {
    transform-box: fill-box;
    transform-origin: 50% 50%;
    animation: mc-sn-flap 0.3s ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-flap {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0.16);
    }
  }
  .k-mote > b,
  .k-firefly > b {
    border-radius: 50%;
    animation: mc-sn-blink calc(var(--d) * 0.22) ease-in-out var(--dl) infinite alternate;
  }
  .k-mote > b {
    background: radial-gradient(circle, #fffbe6 0 22%, var(--c) 42%, transparent 72%);
  }
  .k-firefly > b {
    background: radial-gradient(
      circle,
      #fffff0 0 13%,
      var(--c) 24%,
      color-mix(in srgb, var(--c) 40%, transparent) 40%,
      transparent 70%
    );
  }
  @keyframes mc-sn-blink {
    from {
      opacity: 0.12;
    }
    to {
      opacity: 1;
    }
  }

  /* fly: bats across the layer (rev: the other way) with a swoop */
  .m-fly {
    left: 0;
    height: calc(var(--s) / 2);
    margin: calc(var(--s) / -4) 0 0 calc(var(--s) * -1);
    animation-name: mc-sn-across;
  }
  .m-fly.rev {
    animation-direction: reverse;
  }
  .m-fly > svg {
    animation: mc-sn-swoop calc(var(--d) * 0.25) ease-in-out var(--dl) infinite alternate;
  }
  .m-fly.rev > svg {
    scale: -1 1;
  }
  @keyframes mc-sn-swoop {
    from {
      transform: translateY(calc(var(--sw) * -1)) rotate(-6deg);
    }
    to {
      transform: translateY(var(--sw)) rotate(6deg);
    }
  }
  .k-bat .wings {
    transform-box: fill-box;
    transform-origin: 50% 72%;
    animation: mc-sn-batflap 0.22s ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-batflap {
    from {
      transform: scaleY(1);
    }
    to {
      transform: scaleY(-0.45);
    }
  }

  /* across: slow crossing (clouds); blow: leaves on the wind */
  .m-across {
    left: 0;
    height: calc(var(--s) * 0.53);
    margin: calc(var(--s) * -0.265) 0 0 calc(var(--s) * -1);
    animation-name: mc-sn-across;
  }
  @keyframes mc-sn-across {
    from {
      translate: 0 0;
    }
    to {
      translate: calc(100cqw + var(--s) * 2) 0;
    }
  }
  .m-blow {
    left: 0;
    margin-left: calc(var(--s) * -1);
    animation-name: mc-sn-blow;
    animation-timing-function: cubic-bezier(0.4, 0.1, 0.7, 0.9);
  }
  .m-blow > * {
    animation: mc-sn-tumble calc(var(--d) * 0.2) ease-in-out var(--dl) infinite alternate;
  }
  @keyframes mc-sn-blow {
    0% {
      translate: 0 0;
    }
    35% {
      translate: 34cqw -14px;
    }
    65% {
      translate: 66cqw 12px;
    }
    100% {
      translate: calc(100cqw + var(--s) * 2) -8px;
    }
  }

  /* gust: wind lines (the Scenes preset's keyframes) */
  .m-gust {
    left: 0;
    height: calc(var(--s) * 0.2);
    margin: calc(var(--s) * -0.1) 0 0 calc(var(--s) * -1);
    opacity: 1;
    animation-name: mc-sn-gust;
  }
  .m-gust > svg {
    opacity: var(--o);
  }
  ${(0,r.iz)(mt("mc-sn-gust","wind-lines",0))}

  /* twinkle: in place */
  .m-twinkle {
    animation-name: mc-sn-twinkle;
    animation-timing-function: ease-in-out;
  }
  .m-twinkle > svg {
    rotate: var(--r);
  }
  @keyframes mc-sn-twinkle {
    0%,
    100% {
      opacity: calc(var(--o) * 0.25);
      scale: 0.55;
    }
    50% {
      opacity: var(--o);
      scale: 1;
    }
  }

  /* burst: fireworks open, hang, fade */
  .m-burst {
    animation-name: mc-sn-burst;
    animation-timing-function: cubic-bezier(0.15, 0.75, 0.35, 1);
  }
  .m-burst > svg {
    filter: drop-shadow(0 0 2.5px color-mix(in srgb, var(--c) 70%, transparent));
  }
  @keyframes mc-sn-burst {
    0% {
      scale: 0.06;
      opacity: 0;
      translate: 0 0;
    }
    4% {
      opacity: 1;
    }
    36% {
      scale: 1;
      opacity: 1;
    }
    56%,
    100% {
      scale: 1.07;
      opacity: 0;
      translate: 0 8px;
    }
  }

  /* bob: eggs rocking in place */
  .m-bob {
    width: calc(var(--s) * 0.8);
    margin-left: calc(var(--s) * -0.4);
    transform-origin: 50% 100%;
    animation-name: mc-sn-bob;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  @keyframes mc-sn-bob {
    from {
      translate: 0 0;
      rotate: calc(var(--r) - 8deg);
    }
    to {
      translate: 0 -5px;
      rotate: calc(var(--r) + 8deg);
    }
  }

  /* drift: fog banks swaying side to side */
  .m-drift {
    height: calc(var(--s) * 0.34);
    margin: calc(var(--s) * -0.17) 0 0 calc(var(--s) * -0.5);
    animation-name: mc-sn-drift;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }
  .k-fogband > b {
    border-radius: 50%;
    background: radial-gradient(closest-side, var(--c) 0, color-mix(in srgb, var(--c) 55%, transparent) 50%, transparent 100%);
  }
  @keyframes mc-sn-drift {
    from {
      translate: calc(var(--wx) * -1) 0;
    }
    to {
      translate: var(--wx) calc(var(--wy) * -0.3);
    }
  }

  /* ── Artwork ── */
  .k-snowdot > b {
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--mc-sn-snow) 55%, #fff) 0 30%,
      var(--mc-sn-snow) 48%,
      color-mix(in srgb, var(--mc-sn-snow) 35%, transparent) 62%,
      transparent 72%
    );
  }
  .flake path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .flake .edge {
    stroke: var(--mc-sn-snow-edge);
    stroke-width: 2.7;
    fill: var(--mc-sn-snow-edge);
    opacity: 0.35;
  }
  .flake .core {
    stroke: currentColor;
    stroke-width: 1.2;
    fill: currentColor;
  }
  .flake .hub {
    fill: currentColor;
  }

  .leaf .fill {
    fill: currentColor;
  }
  .leaf .shade {
    fill: #000;
    opacity: 0.13;
  }
  .leaf .vein {
    fill: none;
    stroke: rgba(70, 24, 0, 0.42);
    stroke-width: 0.7;
    stroke-linecap: round;
  }
  .leaf .stem {
    stroke: color-mix(in srgb, currentColor 55%, #4a2a10);
    stroke-width: 1.2;
    stroke-linecap: round;
  }

  .petal .fill,
  .blossom .fill {
    fill: currentColor;
    stroke: #e0789f;
    stroke-width: 0.6;
    stroke-opacity: 0.75;
  }
  .petal .light {
    fill: #fff;
    opacity: 0.45;
  }
  .petal .blush {
    fill: #e64980;
    opacity: 0.3;
  }
  .blossom .stamen {
    stroke: #d6336c;
    stroke-width: 0.6;
    opacity: 0.7;
  }
  .blossom .pollen {
    fill: #fcc419;
  }
  .blossom .heart {
    fill: #f06595;
  }

  .butterfly .wing {
    fill: currentColor;
    stroke: #2b2118;
    stroke-width: 0.9;
    stroke-linejoin: round;
  }
  .butterfly .wing-in {
    fill: var(--c2);
    opacity: 0.85;
  }
  .butterfly .dot {
    fill: #fff;
  }
  .butterfly .body {
    fill: #2b2118;
  }
  .butterfly .feeler {
    fill: none;
    stroke: #2b2118;
    stroke-width: 0.7;
    stroke-linecap: round;
  }

  .bat {
    fill: currentColor;
  }
  .bat .eye {
    fill: #ffd43b;
  }

  .heart .fill {
    fill: currentColor;
  }
  .heart.outline .fill {
    fill: color-mix(in srgb, currentColor 18%, transparent);
    stroke: currentColor;
    stroke-width: 2;
  }
  .heart .shine {
    fill: none;
    stroke: #fff;
    stroke-width: 1.2;
    stroke-linecap: round;
    opacity: 0.75;
  }
  .heart.outline .shine {
    display: none;
  }

  .egg .fill {
    fill: currentColor;
  }
  .egg .pat-line {
    fill: none;
    stroke: var(--c2);
    stroke-width: 1.8;
    stroke-linejoin: round;
  }
  .egg .pat-thin {
    fill: none;
    stroke: var(--c2);
    stroke-width: 0.9;
    opacity: 0.7;
  }
  .egg .pat-dot,
  .egg .pat-band {
    fill: var(--c2);
    opacity: 0.85;
  }
  .egg .pat-band2 {
    fill: #fff;
    opacity: 0.75;
  }
  .egg .shade {
    fill: #000;
    opacity: 0.07;
  }
  .egg .shine {
    fill: #fff;
    opacity: 0.6;
  }
  .egg .edge {
    fill: none;
    stroke: rgba(0, 0, 0, 0.2);
    stroke-width: 0.7;
  }

  .firework .bloom {
    fill: currentColor;
    opacity: 0.12;
  }
  .firework .ray {
    fill: currentColor;
  }
  .firework .spark {
    fill: var(--c2);
    stroke: currentColor;
    stroke-width: 0.4;
  }
  .firework .tip {
    fill: var(--c2);
    stroke: currentColor;
    stroke-width: 0.7;
  }
  .firework .core {
    fill: #fff;
    opacity: 0.9;
  }

  .k-confetti > b {
    height: 48%;
    margin-top: 26%;
    border-radius: 1px;
    background: currentColor;
  }
  .k-confetti > b.round {
    width: 66%;
    height: 66%;
    margin: 17%;
    border-radius: 50%;
  }
  .ribbon path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
  }

  .star .glow,
  .sparkle .glow {
    fill: currentColor;
    opacity: 0.22;
  }
  .star .fill {
    fill: currentColor;
    stroke: color-mix(in srgb, currentColor 50%, #8a5a00);
    stroke-width: 0.8;
    stroke-linejoin: round;
  }
  .star .shine {
    stroke: #fff;
    stroke-width: 1;
    stroke-linecap: round;
    opacity: 0.8;
  }
  .sparkle .fill {
    fill: currentColor;
    stroke: color-mix(in srgb, currentColor 55%, #6b5d1f);
    stroke-width: 0.5;
  }
  .sparkle .core {
    fill: #fff;
  }

  .cloud .fill {
    fill: currentColor;
  }
  .cloud .lit {
    fill: #fff;
    opacity: 0.1;
  }
  .windline path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  /* ── Ambient layers ── */
  .a {
    position: absolute;
    pointer-events: none;
  }
  .a-sun {
    top: -110px;
    right: -110px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 228, 140, 0.8) 0,
      rgba(255, 204, 92, 0.42) 20%,
      rgba(255, 183, 77, 0.16) 44%,
      transparent 68%
    );
    animation: mc-sn-breathe 7s ease-in-out infinite alternate;
  }
  .a-rays {
    top: -280px;
    right: -280px;
    width: 680px;
    height: 680px;
    border-radius: 50%;
    background: repeating-conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255, 206, 96, 0.16) 4deg,
      transparent 9deg 16deg
    );
    -webkit-mask: radial-gradient(closest-side, #000 10%, rgba(0, 0, 0, 0.45) 34%, transparent 66%);
    mask: radial-gradient(closest-side, #000 10%, rgba(0, 0, 0, 0.45) 34%, transparent 66%);
    animation: mc-sn-spin 120s linear infinite;
  }
  .a-shimmer {
    top: 0;
    bottom: 0;
    left: 0;
    width: 40%;
    margin-left: -40%;
    background: linear-gradient(105deg, transparent 15%, rgba(255, 214, 120, 0.12) 50%, transparent 85%);
    animation: mc-sn-sweep 11s ease-in-out infinite;
  }
  .a-dusk {
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(255, 112, 67, 0.4) 0,
      rgba(255, 167, 38, 0.24) 24%,
      rgba(236, 64, 122, 0.12) 50%,
      rgba(126, 87, 194, 0.07) 72%,
      transparent 92%
    );
    animation: mc-sn-glow 12s ease-in-out infinite alternate;
  }
  .a-dusk-sun {
    left: 14%;
    bottom: -70px;
    width: 220px;
    height: 140px;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 214, 140, 0.85), rgba(255, 138, 101, 0.38) 52%, transparent);
    animation: mc-sn-breathe 9s ease-in-out infinite alternate;
  }
  .a-gloom {
    inset: 0;
    background: linear-gradient(to bottom, rgba(38, 50, 72, 0.22), rgba(38, 50, 72, 0.06) 55%, transparent 85%);
  }
  .a-sky {
    inset: 0;
    background: linear-gradient(to bottom, rgba(30, 42, 100, 0.16), rgba(30, 42, 100, 0.04) 60%, transparent 90%);
  }
  /* --mc-sn-flash: none (set by the card on a nested / sibling layer) or [noflash] skip the lightning */
  .a-flash,
  .a-bolt {
    display: var(--mc-sn-flash, block);
  }
  :host([noflash]) .a-flash,
  :host([noflash]) .a-bolt {
    display: none;
  }
  .a-flash {
    inset: 0;
    background: #eef6ff;
    opacity: 0;
    animation: mc-sn-lightning 7s linear infinite;
  }
  .a-bolt {
    left: 64%;
    top: 0;
    width: max(40px, 26cqmin);
    height: 100%;
    translate: -50% 0;
    opacity: 0;
    background: linear-gradient(#fff, #cfe3ff);
    clip-path: polygon(58% 0, 22% 56%, 46% 56%, 32% 100%, 80% 40%, 56% 40%, 72% 0);
    animation: mc-sn-lightning 7s linear infinite;
    animation-delay: -0.02s;
  }
  .a-flash.f2 {
    animation-delay: -3.5s;
  }
  .a-bolt.b2 {
    left: 24%;
    width: max(30px, 18cqmin);
    height: 80%;
    scale: -1 1;
    animation-delay: -3.52s;
  }
  ${(0,r.iz)(mt("mc-sn-lightning","lightning",60))}
  .a-moon {
    top: 12%;
    right: 7%;
    width: 38px;
    height: 38px;
    animation: mc-sn-breathe 8s ease-in-out infinite alternate;
  }
  .a-moon > svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .moon .halo {
    fill: #fff3bf;
    opacity: 0.16;
  }
  .moon .fill {
    fill: #fff4c8;
    stroke: rgba(150, 120, 30, 0.45);
    stroke-width: 0.8;
  }
  .moon .crater {
    fill: rgba(170, 140, 60, 0.25);
  }
  @keyframes mc-sn-breathe {
    from {
      opacity: 0.72;
      scale: 0.96;
    }
    to {
      opacity: 1;
      scale: 1.04;
    }
  }
  @keyframes mc-sn-glow {
    from {
      opacity: 0.75;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes mc-sn-spin {
    to {
      rotate: 360deg;
    }
  }
  @keyframes mc-sn-sweep {
    0% {
      translate: 0 0;
    }
    55%,
    100% {
      translate: calc(100cqw + 100%) 0;
    }
  }

  /* off-screen (shared IntersectionObserver, src/icons/offscreen.ts): nothing moves */
  :host([offscreen]) .p,
  :host([offscreen]) .p *,
  :host([offscreen]) .a {
    animation-play-state: paused !important;
  }
  /* reduced motion: a still composition */
  ${(0,r.iz)(ft(":host([static]) "))}
  @media (prefers-reduced-motion: reduce) {
    ${(0,r.iz)(ft(""))}
  }
`,yt=e=>Array.from({length:e},(e,t)=>t),vt=e=>String(Math.round(100*e)/100),bt=["M0 0V-10.6M0-7.2l-3-2.8M0-7.2l3-2.8M0-3.9l-2.1-1.9M0-3.9l2.1-1.9","M0-2.6V-10M0-6.4l-2.5-1.6M0-6.4l2.5-1.6M0-9.6l1.2 1.4L0-7.6l-1.2-.9z","M0 0V-10.4M0-7.6l-2-2M0-7.6l2-2"],wt=yt(6).map(e=>{const t=(60*e+30)*Math.PI/180;return`M0 0L${vt(4.6*Math.sin(t))} ${vt(4.6*-Math.cos(t))}`}).join("");const xt=[[13.3,5.2],[15.7,3.9],[15.1,8.5],[17.7,6.2],[18.4,7.9],[21.6,7.2],[20.5,10.4],[22.2,11.3],[17.8,14.9],[18.6,17],[13.5,16],[12.5,17.6]],_t=(()=>{const e=xt.map(([e,t])=>`${e} ${t}`).join("L"),t=[...xt].reverse().map(([e,t])=>`${vt(24-e)} ${t}`).join("L");return`M12 1.4L${e}L${t}Z`})(),$t=(()=>{const e=[[3.6,5.2],[5.6,8.6],[6.6,12.2],[5.2,15.6]];let t="M12 1.8",i="";e.forEach(([t,n],s)=>{const r=e[s+1],a=r?[12+.5*Math.min(t,r[0]),(n+r[1])/2+.2]:[13.2,18.8];i+=`Q${vt(12+t+.9)} ${vt(n-2)} ${vt(12+t)} ${vt(n)}Q${vt(12+t+.3)} ${vt(n+1.8)} ${vt(a[0])} ${vt(a[1])}`}),t+=i;let n="L10.8 18.8";for(let t=e.length-1;t>=0;t--){const[i,s]=e[t],r=e[t-1],a=r?[12-.5*Math.min(i,r[0]),(s+r[1])/2+.2]:[12,1.8];n+=`Q${vt(12-i-.3)} ${vt(s+1.8)} ${vt(12-i)} ${vt(s)}Q${vt(12-i-.9)} ${vt(s-2)} ${vt(a[0])} ${vt(a[1])}`}return`${t}${n}Z`})(),kt=["M12 17V4M12 9.2L18.6 8.2M12 9.2L5.4 8.2M12 13.2l4.6 2M12 13.2l-4.6 2","M12 18.4V3.4M12 6.4l3.2 -.8M12 6.4l-3.2-.8M12 10l4.6-1.2M12 10l-4.6-1.2M12 13.6l4.4-.8M12 13.6l-4.4-.8","M12 19.4V3.2M12 7.2l3-1.9M12 7.2l-3-1.9M12 10.8l3.8-2.1M12 10.8l-3.8-2.1M12 14.4l3.2-1.8M12 14.4l-3.2-1.8"];function Mt(){return r.JW`<path d=${"M16 13C17 6.2 22.6 1.6 27.8 2.8 31.6 4.2 30 10.4 24.4 12.8 21.4 14.2 18.2 13.8 16 13Z"} class="wing"></path><path d=${"M16 14C19.6 13.9 24.6 15.4 25.2 19.4 25.6 23 21.6 24.6 19 22.1 17.4 20.6 16.3 17.2 16 14Z"} class="wing"></path>
    <path d=${"M16.6 12.6C18.4 8.4 22 5.4 25.4 5.6 24.6 8.8 21.2 11.6 16.6 12.6Z"} class="wing-in"></path><path d=${"M16.6 14.6C19.6 15 22.6 16.8 22.6 19.4 20.4 19.8 17.8 17.6 16.6 14.6Z"} class="wing-in"></path>
    <circle cx="27.2" cy="4.4" r=".75" class="dot"></circle><circle cx="28.6" cy="7" r=".6" class="dot"></circle>
    <circle cx="22.8" cy="21.6" r=".6" class="dot"></circle>`}const St="M20 9.4C22 6.8 25 5.2 28.2 4.6 31.2 4.1 34.6 4.6 38.4 6.8 36.4 7.5 35.2 8.9 35.1 10.8 33.6 9.9 31.9 10 30.8 11.3 29.8 10.3 28 10.3 27 11.7 26 10.9 24.2 11.1 23.2 12.3 22.4 11.3 21.2 10.8 20 11Z";const Ct="M12 1.6C6.9 1.6 3.2 10.4 3.2 17.4 3.2 23.4 7.2 28.4 12 28.4 16.8 28.4 20.8 23.4 20.8 17.4 20.8 10.4 17.1 1.6 12 1.6Z",Tt=`M1 16${yt(9).map(e=>`L${vt(3.4+2.6*e)} ${e%2?16:12.6}`).join("")}`;function At(e){return r.JW`<svg viewBox="0 0 24 30" class="egg">
    <path d=${Ct} class="fill"></path>
    <g clip-path="url(#mc-sn-egg)">${function(e){return 0===e?r.JW`<path d=${Tt} class="pat-line"></path><path d="M1 9.4H23M1 21.2H23" class="pat-thin"></path>`:1===e?r.JW`${[[8,8,1.4],[14.6,10.4,1.6],[9.4,14.4,1.8],[16,16.8,1.4],[6.4,19.6,1.3],[11.8,21.4,1.7],[17,23.2,1.1],[12.6,4.8,1]].map(([e,t,i])=>r.JW`<circle cx=${e} cy=${t} r=${i} class="pat-dot"></circle>`)}`:r.JW`<rect x="0" y="10" width="24" height="3.4" class="pat-band"></rect><rect x="0" y="17.6" width="24" height="3.4" class="pat-band2"></rect>
    <path d="M1 15.3H23" class="pat-thin"></path>`}(e%3)}<ellipse cx="17" cy="19" rx="6" ry="10" class="shade"></ellipse></g>
    <ellipse cx="8.6" cy="9.4" rx="1.6" ry="3" transform="rotate(18 8.6 9.4)" class="shine"></ellipse>
    <path d=${Ct} class="edge"></path>
  </svg>`}const Et=(e,t)=>{const i=t*Math.PI/180;return`${vt(Math.sin(i)*e)} ${vt(-Math.cos(i)*e)}`};const Pt=`M${yt(10).map(e=>{const t=e%2?4.6:11,i=36*e*Math.PI/180;return`${vt(Math.sin(i)*t)} ${vt(-Math.cos(i)*t+.8)}`}).join("L")}Z`;const zt=["M2 14C22 14 38 8.4 58 10.2S92 18 104 10C110 6 108.2 1.2 103.2 2.6 99.6 3.8 101 8.2 104.6 7.6","M2 12C18 12 34 15.6 54 13.6S86 8.8 100 11.6"];function Lt(e,t){switch(e){case"flake":return function(e){const t=bt[e%bt.length],i=yt(6).map(e=>r.JW`<path d=${t} transform="rotate(${60*e})"></path>`),n=2===e?r.JW`<path d=${wt}></path>`:1===e?r.JW`<path d="M0-2.6l2.25 1.3v2.6L0 2.6l-2.25-1.3v-2.6z"></path>`:r.s6;return r.JW`<svg viewBox="-12 -12 24 24" class="flake">
    <g class="edge">${i}${n}</g>
    <g class="core">${i}${n}</g>
    <circle r="1.3" class="hub"></circle>
  </svg>`}(t);case"leaf":return function(e){const t=e%3,i=0===t?_t:1===t?$t:"M12 1.8C17.6 5.8 18.2 12.8 12 19.8 5.8 12.8 6.4 5.8 12 1.8Z";return r.JW`<svg viewBox="0 0 24 24" class="leaf">
    <path d=${i} class="fill"></path>
    ${2===t?r.JW`<path d=${"M12 1.8C17.6 5.8 18.2 12.8 12 19.8Z"} class="shade"></path>`:r.s6}
    <path d=${kt[t]} class="vein"></path>
    <path d="M12 17.4L12.5 22.6" class="stem"></path>
  </svg>`}(t);case"petal":return r.JW`<svg viewBox="0 0 24 24" class="petal">
    <path d=${"M12 22C6.6 18.2 5.4 11.2 7.9 5.6 8.9 3.6 10.3 3 11 3.6L12 5.7 13 3.6C13.7 3 15.1 3.6 16.1 5.6 18.6 11.2 17.4 18.2 12 22Z"} class="fill"></path>
    <path d=${"M12 19.6C8.9 16.8 8.2 11.6 9.6 7.4 10.6 8 11.4 8.6 12 9.6Z"} class="light"></path>
    <ellipse cx="12" cy="19.2" rx="1.6" ry="2.2" class="blush"></ellipse>
  </svg>`;case"blossom":return r.JW`<svg viewBox="-12 -12 24 24" class="blossom">
    ${yt(5).map(e=>r.JW`<path d=${"M0-1.2C-3-3.2-4.2-7.4-2.6-10.2-1.9-11.2-1-11.4-.6-11L0-9.8.6-11C1-11.4 1.9-11.2 2.6-10.2 4.2-7.4 3-3.2 0-1.2Z"} transform="rotate(${72*e})" class="fill"></path>`)}
    ${yt(5).map(e=>r.JW`<path d="M0 0L0-5.4" transform="rotate(${72*e+36})" class="stamen"></path>`)}
    ${yt(5).map(e=>{const t=(72*e+36)*Math.PI/180;return r.JW`<circle cx=${vt(5.6*Math.sin(t))} cy=${vt(5.6*-Math.cos(t))} r=".85" class="pollen"></circle>`})}
    <circle r="2" class="heart"></circle>
  </svg>`;case"butterfly":return r.JW`<svg viewBox="0 0 32 26" class="butterfly">
    <g class="wings">${Mt()}<g transform="matrix(-1 0 0 1 32 0)">${Mt()}</g></g>
    <path d="M15.4 8.2C14.6 5 13.2 3.6 11.8 3.2M16.6 8.2C17.4 5 18.8 3.6 20.2 3.2" class="feeler"></path>
    <ellipse cx="16" cy="14.6" rx="1.05" ry="5.6" class="body"></ellipse>
    <circle cx="16" cy="8.4" r="1.3" class="body"></circle>
  </svg>`;case"bat":return r.JW`<svg viewBox="0 0 40 20" class="bat">
    <g class="wings"><path d=${St}></path><path d=${St} transform="matrix(-1 0 0 1 40 0)"></path></g>
    <path d="M18.3 8L18.5 5.1 19.8 7.2 20.2 7.2 21.5 5.1 21.7 8C22.6 8.8 22.7 10.6 22.2 12.2 21.6 13.8 20.6 14.4 20 14.4 19.4 14.4 18.4 13.8 17.8 12.2 17.3 10.6 17.4 8.8 18.3 8Z"></path>
    <circle cx="19.2" cy="9.4" r=".5" class="eye"></circle><circle cx="20.8" cy="9.4" r=".5" class="eye"></circle>
  </svg>`;case"heart":return function(e){return r.JW`<svg viewBox="0 0 24 24" class="heart ${e%2?"outline":""}">
    <path d=${"M12 20.6C12 20.6 2.6 14.6 2.6 8.6 2.6 5.4 5 3.2 8 3.2 9.8 3.2 11.2 4.2 12 5.6 12.8 4.2 14.2 3.2 16 3.2 19 3.2 21.4 5.4 21.4 8.6 21.4 14.6 12 20.6 12 20.6Z"} class="fill"></path>
    <path d="M6.6 6.4C5.3 7 4.8 8.4 5.1 9.7" class="shine"></path>
  </svg>`}(t);case"egg":return At(t);case"firework":return function(){const e=yt(14).map(e=>{const t=360*e/14;return`M${Et(6,t)}L${Et(19.5,t-3.4)}L${Et(23,t)}L${Et(19.5,t+3.4)}Z`}).join(""),t=(e,t,i,n)=>{const s=t*Math.PI/180;return r.JW`<circle cx=${vt(Math.sin(s)*e)} cy=${vt(-Math.cos(s)*e)} r=${i} class=${n}></circle>`},i=yt(14).map(e=>t(25,360*e/14,1.6,"tip")),n=yt(14).map(e=>t(13.5,360*e/14+360/28,.95,"spark"));return r.JW`<svg viewBox="-30 -30 60 60" class="firework"><circle r="16" class="bloom"></circle><path d=${e} class="ray"></path>${i}${n}<circle r="2.6" class="core"></circle></svg>`}();case"star":return r.JW`<svg viewBox="-12 -12 24 24" class="star">
    <circle r="7.5" class="glow"></circle>
    <path d=${Pt} class="fill"></path>
    <path d="M-1.6-4.2L0-8.4" class="shine"></path>
  </svg>`;case"sparkle":return r.JW`<svg viewBox="-12 -12 24 24" class="sparkle">
    <circle r="5" class="glow"></circle>
    <path d=${"M0-11C.7-3.6 3.6-.7 11 0 3.6.7.7 3.6 0 11-.7 3.6-3.6.7-11 0-3.6-.7-.7-3.6 0-11Z"} class="fill"></path>
    <circle r="1.3" class="core"></circle>
  </svg>`;case"cloud":return r.JW`<svg viewBox="0 0 64 34" class="cloud">
    <path d=${"M14 32C6.6 32 2 27.6 2 22.2 2 16.8 6.4 12.6 12 13 13 6.6 18.6 2 25.2 2 31.6 2 36.6 6 38.2 11.6 40.2 9.9 42.8 9 45.6 9 52 9 56.6 13.6 56.6 19.6 60 20.6 62 23.6 62 26.6 62 29.8 59.6 32 56 32Z"} class="fill"></path>
    <ellipse cx="24" cy="12" rx="7" ry="4.6" class="lit"></ellipse>
  </svg>`;case"windline":return function(e){return r.JW`<svg viewBox="0 0 110 24" preserveAspectRatio="none" class="windline"><path d=${zt[e%2]}></path></svg>`}(t);case"confetti":return 2===t?r.JW`<svg viewBox="0 0 12 6" class="ribbon"><path d="M1 3.4C2.6 .8 3.6 .8 4.6 3s2 2.6 3.2.2S10.2 1 11 3"></path></svg>`:r.qy`<b class="chip ${t?"round":""}"></b>`;default:return r.qy`<b></b>`}}const Ot=r.JW`<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs><clipPath id="mc-sn-egg"><path d=${Ct}></path></clipPath></defs>
</svg>`,qt=r.JW`<svg viewBox="0 0 40 40" class="moon">
  <circle cx="20" cy="20" r="17" class="halo"></circle>
  <path d="M25.6 6.4A14 14 0 1 0 33.6 26.4 11.2 11.2 0 1 1 25.6 6.4Z" class="fill"></path>
  <circle cx="15.2" cy="23.6" r="1.6" class="crater"></circle><circle cx="19" cy="29" r="1" class="crater"></circle>
</svg>`;var Rt=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Nt={mist:"var(--mc-sn-mist)",wind:"var(--mc-sn-wind)",bat:"var(--mc-sn-bat)",cloud:"var(--mc-sn-cloud)",snow:"var(--mc-sn-snow)","ghost-violet":"var(--mc-sn-ghost-violet)","ghost-green":"var(--mc-sn-ghost-green)"},It=e=>Nt[e]??e;let jt=class extends r.WF{constructor(){super(...arguments),this.scenes=[],this.intensity=.5,this.layer="back",this.seed="mc",this.noflash=!1,this._static=!1,this._watching=!1,this._onMedia=()=>{this._static=!!this._media?.matches}}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._static=!!this._media?.matches}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._unwatch()}get layout(){const e=`${this.scenes.join(",")}|${this.intensity}|${this.seed}`;return this._layout?.key!==e&&(this._layout={key:e,value:(0,ne.iP)(this.scenes,this.intensity,this.seed)}),this._layout.value}_unwatch(){this._watching&&(this._watching=!1,(0,b.eF)(this))}willUpdate(e){super.willUpdate(e),this.toggleAttribute("static",this._static),this.toggleAttribute("flash",!this.noflash&&this.layout.ambient.some(e=>"flash"===e.kind))}updated(e){super.updated(e);const t=this.layout,i=!this._static&&(t.particles.length>0||t.ambient.length>0);i&&!this._watching&&this.isConnected?this._watching=(0,b.jR)(this,()=>{}):i||this._unwatch()}render(){const e=this.layout;if(!e.particles.length&&!e.ambient.length)return r.s6;const t="front"===this.layer,i=e.particles.some(e=>"egg"===e.kind);return r.qy`<div class="layer ${this._static?"still":""}" style=${t?"opacity:0.55":""}>
      ${i?Ot:r.s6}
      ${e.ambient.map(e=>function(e){switch(e){case"sun":return r.qy`<i class="a a-rays"></i><i class="a a-sun"></i><i class="a a-shimmer"></i>`;case"dusk":return r.qy`<i class="a a-dusk"></i><i class="a a-dusk-sun"></i>`;case"flash":return r.qy`<i class="a a-gloom"></i><i class="a a-flash"></i><i class="a a-bolt"></i><i class="a a-flash f2"></i><i class="a a-bolt b2"></i>`;case"moon":return r.qy`<i class="a a-sky"></i><i class="a a-moon">${qt}</i>`;default:return r.qy``}}(e.kind))}
      ${e.particles.map(e=>r.qy`<i
            class="p m-${e.motion} k-${e.kind}${e.flip&&"fly"===e.motion?" rev":""}"
            data-scene=${e.scene}
            style=${function(e){const t=Math.max(4,Math.abs(e.drift)/3);let i=e.rotate;"rise"!==e.motion&&"flutter"!==e.motion&&"bob"!==e.motion||(i=e.rotate%30-15),"star"===e.kind&&(i=e.rotate%24-12);const n="butterfly"===e.kind?3.4:"firefly"===e.kind?2.4:"drift"===e.motion?2.2:1.4,s=[`--x:${e.x}%`,`--y:${e.y}%`,`--s:${e.size}px`,`--d:${e.dur}s`,`--dl:${e.delay}s`,`--c:${It(e.color)}`,`--o:${e.opacity}`,`--dx:${e.drift}px`,`--sw:${Math.round(10*t)/10}px`,`--r:${i}deg`,`--wx:${Math.round(e.drift*n)}px`,`--wy:${Math.round(Math.abs(e.drift)*n/2.5+8)}px`];return e.accent&&s.push(`--c2:${It(e.accent)}`),s.join(";")}(e)}
            >${Lt(e.kind,e.variant)}</i
          >`)}
    </div>`}};jt.styles=gt,Rt([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!((e,t)=>e===t||!!e&&!!t&&e.length===t.length&&e.every((e,i)=>e===t[i]))(e,t)})],jt.prototype,"scenes",void 0),Rt([(0,a.MZ)({type:Number})],jt.prototype,"intensity",void 0),Rt([(0,a.MZ)({reflect:!0})],jt.prototype,"layer",void 0),Rt([(0,a.MZ)()],jt.prototype,"seed",void 0),Rt([(0,a.MZ)({type:Boolean,reflect:!0})],jt.prototype,"noflash",void 0),Rt([(0,a.wk)()],jt.prototype,"_static",void 0),jt=Rt([(0,a.EM)("mc-seasonal")],jt);var Dt=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Bt=["#ff4040","#ffc61a","#2fbf4f","#2f8cff","#ff5cc8"],Wt=(e,t)=>e===t||!!e&&!!t&&e.length===t.length&&e.every((e,i)=>e===t[i]);let Ft=class extends r.WF{constructor(){super(...arguments),this.seed="mc",this.dark=!1,this._static=!1,this._watchingScreen=!1,this._onMedia=()=>{this._static=!!this._media?.matches}}get activeMotifs(){return this.motifs??(0,ne.ir)(this.scenes??[])}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._static=!!this._media?.matches,this._sync()}disconnectedCallback(){super.disconnectedCallback(),this._unobserve(),this._media?.removeEventListener?.("change",this._onMedia)}_unobserve(){this._observed&&Ye(this._observed,this),this._mutations?.disconnect(),this._mutations=void 0,void 0!==this._frame&&cancelAnimationFrame(this._frame),this._frame=void 0,this._observed=void 0,this._watchingScreen&&(0,b.eF)(this),this._watchingScreen=!1}_sync(){const e=this.parentElement,t=this.activeMotifs;if(!this.isConnected||!e||!t.length)return this._unobserve(),void(this._box=void 0);e!==this._observed&&(this._unobserve(),this._observed=e,Ze(e,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this._measureSoon()),this._mutations.observe(e,{attributes:!0,attributeFilter:["style","class"]})),this.measure());const i=t.includes("lights")&&!this._static;i&&!this._watchingScreen?this._watchingScreen=(0,b.jR)(this,()=>{}):!i&&this._watchingScreen&&((0,b.eF)(this),this._watchingScreen=!1)}_measureSoon(){void 0===this._frame&&(this._frame=requestAnimationFrame(()=>{this._frame=void 0,this._mutations&&this.measure()}))}measure(){const e=this.parentElement;if(!e)return;const t=getComputedStyle(e),{w:i,h:n}=Je(e),s={w:i,h:n,top:parseFloat(t.borderTopWidth)||0,left:parseFloat(t.borderLeftWidth)||0,radii:ve(t,i,n),shape:this.shape};JSON.stringify(s)!==JSON.stringify(this._box)&&(this._box=s)}willUpdate(e){super.willUpdate(e),this.toggleAttribute("static",this._static),e.has("shape")&&this._box&&JSON.stringify(this._box.shape)!==JSON.stringify(this.shape)&&(this._box={...this._box,shape:this.shape})}updated(e){super.updated(e),this._sync()}get layout(){const e=this._box,t=this.activeMotifs;if(e&&t.length&&e.w>0&&e.h>0)return We(t,e,this.seed)}render(){const e=this.layout,t=this._box;if(!e||!t||!(e.lights||e.icicles||e.frost||e.cobweb||e.pumpkin||e.vine))return r.s6;const i=`top: ${-t.top}px; left: ${-t.left}px; width: ${t.w}px; height: ${t.h}px`;return r.qy`<svg style=${i} viewBox="0 0 ${t.w} ${t.h}" focusable="false">
      <defs>
        <clipPath id="mc-deco-clip"><path d=${e.clip}></path></clipPath>
        ${e.icicles?r.JW`<linearGradient id="mc-deco-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ice-top"></stop><stop offset="1" class="ice-tip"></stop></linearGradient>`:r.s6}
        ${e.frost?r.JW`<radialGradient id="mc-deco-frost"><stop offset="0" class="frost-in"></stop><stop offset="1" class="frost-out"></stop></radialGradient>
            <filter id="mc-deco-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>`:r.s6}
      </defs>
      ${e.frost?function(e){return r.JW`<g class="frost" clip-path="url(#mc-deco-clip)">
    <path d=${e.outline} class="frost-edge"></path>
    ${e.corners.map(e=>r.JW`<circle cx=${e.x} cy=${e.y} r=${e.radius} fill="url(#mc-deco-frost)"></circle>`)}
    <path d=${e.corners.map(e=>e.crystals).join("")} class="crystal"></path>
  </g>`}(e.frost):r.s6} ${e.vine?function(e){return r.JW`<g class="vine">
    <path d=${e.stem} class="vstem"></path>
    <path d=${e.tendrils} class="tendril"></path>
    ${e.leaves.map((e,t)=>r.JW`<g transform="translate(${e.x} ${e.y}) rotate(${e.angle}) scale(${Math.round(e.size/8*100)/100})">
        <path d="M0 0C2-2.6 6-2.9 8.4 0 6 2.9 2 2.6 0 0Z" class="vleaf v${t%3}"></path><path d="M.6 0H7" class="vrib"></path>
      </g>`)}
    ${e.flowers.map(e=>r.JW`<g transform="translate(${e.x} ${e.y}) rotate(${e.rotate}) scale(${Math.round(e.size/10*100)/100})">
        ${[0,72,144,216,288].map(e=>r.JW`<ellipse cx="0" cy="-3.3" rx="2.3" ry="3.4" transform="rotate(${e})" class="vpetal"></ellipse>`)}
        <circle r="1.7" class="vheart"></circle>
      </g>`)}
  </g>`}(e.vine):r.s6} ${e.cobweb?function(e){const t=e.spider,i=[-1,1].flatMap(e=>[-.5,-.15,.2,.5].map((i,n)=>{const s=t.y+i*t.size*.6,r=t.x+e*t.size*.95,a=`${t.x+e*t.size*.7} ${s-t.size*(.35-.12*n)}`;return`M${t.x} ${s}Q${a} ${r} ${s+t.size*(n-1)*.28}`})).join("");return r.JW`<g class="cobweb">
    <g clip-path="url(#mc-deco-clip)"><path d=${e.threads} class="web"></path><path d=${e.spiral} class="web web-ring"></path></g>
    <path d=${t.thread} class="web"></path>
    <path d=${i} class="leg"></path>
    <circle cx=${t.x} cy=${t.y+.2*t.size} r=${.42*t.size} class="spider"></circle>
    <circle cx=${t.x} cy=${t.y-.32*t.size} r=${.26*t.size} class="spider"></circle>
    <circle cx=${t.x-.1*t.size} cy=${t.y-.36*t.size} r=${.06*t.size} class="eye"></circle>
    <circle cx=${t.x+.1*t.size} cy=${t.y-.36*t.size} r=${.06*t.size} class="eye"></circle>
  </g>`}(e.cobweb):r.s6}
      ${e.icicles?function(e){return r.JW`<g class="icicles">
    ${e.icicles.map(e=>r.JW`<path d=${e.d} class="ice"></path>`)}
    ${e.icicles.map(e=>r.JW`<path d="M${e.x-.6} ${e.y+1}L${e.x-.3} ${e.y+.6*e.length}" class="ice-hi"></path>`)}
    <path d=${e.cap} class="cap-shade"></path>
    <path d=${e.cap} class="cap"></path>
  </g>`}(e.icicles):r.s6} ${e.pumpkin?function(e){return r.JW`<g class="pumpkin" transform="translate(${e.x} ${e.y}) scale(${Math.round(e.size/32*1e3)/1e3})">
    <ellipse cx="0" cy="-.4" rx="15" ry="2.2" class="shadow"></ellipse>
    <ellipse cx="-8.2" cy="-11" rx="8" ry="10.8" class="rib back"></ellipse>
    <ellipse cx="8.2" cy="-11" rx="8" ry="10.8" class="rib back"></ellipse>
    <ellipse cx="-4.6" cy="-11.2" rx="7.4" ry="11.4" class="rib mid"></ellipse>
    <ellipse cx="4.6" cy="-11.2" rx="7.4" ry="11.4" class="rib mid"></ellipse>
    <ellipse cx="0" cy="-11.4" rx="6.4" ry="11.7" class="rib front"></ellipse>
    <path d="M-1.4-21.4C-1.6-25-.8-27.6 1.6-29.2L3.1-27.7C1.7-26.4 1.3-24.4 1.5-21.5Z" class="stem"></path>
    <path d="M-.8-21.8C-4.6-26-8.8-24.4-10-21.2-6.4-19.8-3.2-20.2-.8-21.8Z" class="pleaf"></path>
    <path d="M1.4-22.6C4.2-25.6 8.2-24.6 7.6-22 7.2-20.6 5.6-21 6-22.2" class="curl"></path>
    <g class="face">
      <path d="M-6.8-13.6H-3L-4.9-17.4ZM3-13.6H6.8L4.9-17.4ZM-1.1-11.2H1.1L0-13.2ZM-7.8-8.4Q0-2.6 7.8-8.4 6-5.4 3.8-5L3.2-6.6 1.6-4.9 0-6.6-1.6-4.9-3.2-6.6-3.8-5Q-6-5.4-7.8-8.4Z"></path>
    </g>
  </g>`}(e.pumpkin):r.s6} ${e.lights?function(e){return r.JW`<g class="lights">
    <path d=${e.wire} class="wire"></path>
    ${e.bulbs.map(t=>r.JW`<g class="bulb" style="--i:${t.index};color:${Bt[t.index%Bt.length]}"
        transform="translate(${t.x} ${t.y}) rotate(${t.angle}) scale(${e.scale})">
        <circle cy="7" r="8.5" class="halo"></circle>
        <circle cy="7" r="5.2" class="halo"></circle>
        <path d=${"M0 2.2C2.6 2.6 3.5 5.3 3.1 7.4 2.7 9.6 1.3 11.1 0 11.1-1.3 11.1-2.7 9.6-3.1 7.4-3.5 5.3-2.6 2.6 0 2.2Z"} class="glass"></path>
        <ellipse cx="-1.15" cy="5.8" rx=".75" ry="1.8" class="hi"></ellipse>
        <rect x="-1.8" y="-.8" width="3.6" height="3.4" rx=".9" class="socket"></rect>
      </g>`)}
  </g>`}(e.lights):r.s6}
    </svg>`}};function Ht(e){return e?r.qy`<span class="mc-border-fx" aria-hidden="true" style=${e.overlayStyle}>${e.lines.map(e=>r.qy`<i style=${e.style}></i>`)}</span>`:r.s6}function Gt(e){return!!e?.fx.some(e=>e.seasonal&&(0,ne.bO)(e.seasonal.scenes))}function Jt(e,t,i="mc",n=!1,s){return e?.fx.length?r.qy`${e.fx.map(e=>{const a=e.seasonal&&s?.preset(e.seasonal.scenes,e.seasonal.intensity);return e.seasonal?r.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${e.preset} style=${e.style||r.s6} .scenes=${e.seasonal.scenes}
            .intensity=${a?.intensity??e.seasonal.intensity} ?noflash=${!!a?.noflash} .seed=${`${i}|${e.preset}`}></mc-seasonal>${e.seasonal.decorations?Xt(e.seasonal.scenes,t,i,n):r.s6}`:e.ring?r.qy`<mc-ring class="mc-anim-ring" data-fx=${e.preset} ?data-tap=${!!e.tap} style=${e.style} .ring=${e.ring} .shape=${t}></mc-ring>`:r.qy`<span class="mc-anim-fx" data-fx=${e.preset} ?data-front=${e.front} ?data-tap=${!!e.tap} ?data-p=${!!e.sim} .mcSim=${e.sim} style=${e.style} aria-hidden="true">${e.particles.map(t=>{return r.qy`<i data-s=${t.shape??r.s6} style="--mc-anim-x: ${t.x}%; --mc-anim-phase: ${t.phase}; --mc-anim-k: ${t.k}${t.style?`; ${t.style}`:""}">${i=t.symbol??e.symbol,i?"icon"in i?r.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:r.s6}</i>`;var i})}</span>`})}`:r.s6}function Ut(e,t){return e?r.qy`<mc-ring .ring=${e} .shape=${t}></mc-ring>`:r.s6}function Vt(e,t,i){return e?r.qy`<mc-shape .shape=${e} .stroke=${t} .edge=${i}></mc-shape>`:r.s6}function Zt(e,t,i=!1){return i?r.qy`<div class="mc-shape-shadow mc-card-shadow" style=${t?`filter: ${t}`:r.s6}>${e}</div>`:t?r.qy`<div class="mc-shape-shadow" style="filter: ${t}">${e}</div>`:e}function Yt(e,t){return e?r.qy`<mc-value-bg .value=${e} .hass=${t}></mc-value-bg>`:r.s6}function Xt(e,t,i,n){return(0,ne.ir)(e).length?r.qy`<mc-seasonal-deco class="mc-seasonal-deco" .scenes=${e} .shape=${t} .seed=${i} ?dark=${n}></mc-seasonal-deco>`:r.s6}function Kt(e,t,i){if(!e)return r.s6;const n=e.layer===t?r.qy`<mc-seasonal class="mc-card-seasonal" .scenes=${e.scenes} .intensity=${i.grant?.intensity??e.intensity}
          .layer=${e.layer} ?noflash=${!!i.grant?.noflash} .seed=${i.seed}></mc-seasonal>`:r.s6;return"front"===t?n:r.qy`${n}${e.decorations?Xt(e.scenes,i.shape,i.seed,i.dark):r.s6}`}function Qt(e,t){const i=[...e?.fx.flatMap(e=>e.seasonal?.decorations?e.seasonal.scenes:[])??[],...t?.decorations?t.scenes:[]];return i.length?function(e){const t=[0,0,0,0],i=(e,i)=>t[e]=Math.max(t[e],i);for(const t of e)if("lights"===t)for(let e=0;e<4;e++)i(e,20);else"icicles"===t?i(0,20):"pumpkin"===t?i(2,30):"vine"===t&&(i(2,18),i(3,20));return t.some(e=>e>0)?t:void 0}((0,ne.ir)(i)):void 0}Ft.styles=r.AH`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: visible;
      --mc-deco-wire: color-mix(in srgb, var(--primary-text-color, #212121) 30%, #2b4a2e);
      --mc-deco-frost: #c9e2fc;
      --mc-deco-crystal: color-mix(in srgb, var(--primary-text-color, #212121) 22%, #b4d4f6);
      --mc-deco-web: color-mix(in srgb, var(--primary-text-color, #212121) 48%, transparent);
      --mc-deco-spider: color-mix(in srgb, var(--primary-text-color, #212121) 55%, #1d1426);
    }
    /* a dark theme (the card passes hass.themes.darkMode): pale frost stands out much more there */
    :host([dark]) {
      --mc-deco-frost: rgba(205, 228, 252, 0.3);
    }
    svg {
      position: absolute;
      overflow: visible;
    }
    .wire {
      fill: none;
      stroke: var(--mc-deco-wire);
      stroke-width: 1.2;
      stroke-linecap: round;
    }
    .bulb {
      animation: mc-deco-cycle ${2.4*Bt.length}s steps(1, end) infinite;
      animation-delay: calc(var(--i) * -${2.4}s);
    }
    .halo {
      fill: currentColor;
      opacity: 0.16;
      animation: mc-deco-twinkle 1.8s steps(1, end) infinite;
      animation-delay: calc(var(--i) * -0.7s);
    }
    .glass {
      fill: currentColor;
      stroke: color-mix(in srgb, currentColor 60%, #000);
      stroke-width: 0.5;
    }
    .hi {
      fill: #fff;
      opacity: 0.7;
    }
    .socket {
      fill: #3d5a40;
      stroke: #23362a;
      stroke-width: 0.4;
    }
    @keyframes mc-deco-cycle {
      ${(0,r.iz)(Bt.map((e,t)=>`${100*t/Bt.length}% { color: ${e}; }`).join(" "))}
    }
    @keyframes mc-deco-twinkle {
      0% {
        opacity: 0.16;
      }
      40% {
        opacity: 0.04;
      }
      70% {
        opacity: 0.22;
      }
    }

    .ice {
      fill: url(#mc-deco-ice);
      stroke: rgba(74, 134, 196, 0.5);
      stroke-width: 0.6;
    }
    .ice-hi {
      stroke: #fff;
      stroke-width: 0.7;
      stroke-linecap: round;
      opacity: 0.8;
    }
    .cap {
      fill: none;
      stroke: #fff;
      stroke-width: 3.6;
      stroke-linecap: round;
    }
    .cap-shade {
      fill: none;
      stroke: rgba(120, 165, 215, 0.55);
      stroke-width: 4.6;
      stroke-linecap: round;
      translate: 0 0.9px;
    }
    .ice-top {
      stop-color: #fff;
      stop-opacity: 0.95;
    }
    .ice-tip {
      stop-color: #a5d8ff;
      stop-opacity: 0.6;
    }

    .frost-edge {
      fill: none;
      stroke: var(--mc-deco-frost);
      stroke-width: 10;
      opacity: 0.4;
      filter: url(#mc-deco-blur);
    }
    .frost-in {
      stop-color: var(--mc-deco-frost);
      stop-opacity: 0.6;
    }
    .frost-out {
      stop-color: var(--mc-deco-frost);
      stop-opacity: 0;
    }
    .crystal {
      fill: none;
      stroke: var(--mc-deco-crystal);
      stroke-width: 0.8;
      stroke-linecap: round;
      opacity: 0.85;
    }

    .web {
      fill: none;
      stroke: var(--mc-deco-web);
      stroke-width: 0.8;
    }
    .web-ring {
      stroke-width: 0.6;
    }
    .spider {
      fill: var(--mc-deco-spider);
    }
    .leg {
      fill: none;
      stroke: var(--mc-deco-spider);
      stroke-width: 0.7;
      stroke-linecap: round;
    }
    .eye {
      fill: #ff6b6b;
    }

    .pumpkin .shadow {
      fill: rgba(0, 0, 0, 0.18);
    }
    .rib {
      stroke: #a63c06;
      stroke-width: 0.7;
    }
    .rib.back {
      fill: #d9480f;
    }
    .rib.mid {
      fill: #f76707;
    }
    .rib.front {
      fill: #fd8c2c;
    }
    .stem {
      fill: #5f7f2a;
      stroke: #3f5a1a;
      stroke-width: 0.5;
    }
    .pleaf {
      fill: #74b816;
    }
    .curl {
      fill: none;
      stroke: #6b8e23;
      stroke-width: 0.9;
      stroke-linecap: round;
    }
    .face path {
      fill: #ffd43b;
      stroke: #ffa94d;
      stroke-width: 0.6;
      stroke-linejoin: round;
    }
    .face {
      filter: drop-shadow(0 0 1.6px rgba(255, 196, 0, 0.9));
    }

    .vstem {
      fill: none;
      stroke: #5c940d;
      stroke-width: 1.5;
      stroke-linecap: round;
    }
    .tendril {
      fill: none;
      stroke: #74b816;
      stroke-width: 0.9;
      stroke-linecap: round;
    }
    .vleaf.v0 {
      fill: #51cf66;
    }
    .vleaf.v1 {
      fill: #40c057;
    }
    .vleaf.v2 {
      fill: #2f9e44;
    }
    .vrib {
      stroke: rgba(0, 0, 0, 0.22);
      stroke-width: 0.5;
    }
    .vpetal {
      fill: #ffdeeb;
      stroke: #e64980;
      stroke-width: 0.45;
      stroke-opacity: 0.7;
    }
    .vheart {
      fill: #fcc419;
      stroke: #e67700;
      stroke-width: 0.4;
    }

    :host([offscreen]) *,
    :host([static]) * {
      animation-play-state: paused !important;
    }
    :host([static]) * {
      animation: none !important;
    }
    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
      }
    }
  `,Dt([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!Wt(e,t)})],Ft.prototype,"motifs",void 0),Dt([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!Wt(e,t)})],Ft.prototype,"scenes",void 0),Dt([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>JSON.stringify(e)!==JSON.stringify(t)})],Ft.prototype,"shape",void 0),Dt([(0,a.MZ)()],Ft.prototype,"seed",void 0),Dt([(0,a.MZ)({type:Boolean,reflect:!0})],Ft.prototype,"dark",void 0),Dt([(0,a.wk)()],Ft.prototype,"_box",void 0),Dt([(0,a.wk)()],Ft.prototype,"_static",void 0),Ft=Dt([(0,a.EM)("mc-seasonal-deco")],Ft);var ei=i(2668),ti=i(9677);const ii=e=>e?JSON.stringify(e):"";class ni{constructor(e,t){this._host=e,this._opts=t,this._listening=!1,this._connected=!1,this._key="",this._onPreview=()=>this._host.requestUpdate(),e.addController(this)}now(){return this._preview()??new Date}_preview(){const e=this._opts.editorPreview()?(0,ti.Nd)():void 0;return e?new Date(e.getTime()):void 0}_resolve(e,t){const i=this._preview();return(0,ei.rG)(e,i??new Date,t,{localDay:!!i})}resolve(){const e=this._opts.config(),t=void 0===e?void 0:this._resolve(e,this._opts.hass());return this._key=ii(t),t}changed(e){const t=this._opts.config(),i=this._opts.hass();if(void 0===t||!i)return!1;return!!(0,ei.aD)(t).some(t=>e?.states?.[t]!==i.states?.[t])&&ii(this._resolve(t,i))!==this._key}seed(e){const t=e.rows?.[0],i=[e.name??"",t?.id??"",t?.columns?.[0]?.modules?.[0]?.id??""].join("|"),n=function(e){const t=[],i=new Set,n=(e,s)=>{if(!(!e||"object"!=typeof e||i.has(e)||s>12))if(i.add(e),Array.isArray(e))for(const t of e)n(t,s+1);else for(const[i,r]of Object.entries(e))"string"!=typeof r||"entity"!==i&&"entity_id"!==i&&!i.endsWith("_entity")||!/^\w+\.\w+/.test(r)||t.includes(r)?n(r,s+1):t.push(r)};return n(e,0),t}(e);return[i,n.length?Math.floor(4294967296*(0,ne.Is)(n.join(","))()).toString(36):""].filter(e=>e&&"||"!==e).join("|")||"card"}get timerPending(){return void 0!==this._timer}hostConnected(){this._connected=!0,this._sync()}hostDisconnected(){this._connected=!1,this._sync()}hostUpdated(){this._sync()}_sync(){const e=(0,ei.Oo)(this._opts.config()),t=this._connected&&!!e;t&&!this._listening?window.addEventListener(ti.HT,this._onPreview):!t&&this._listening&&window.removeEventListener(ti.HT,this._onPreview),this._listening=t;const i=e?(0,ei.a0)(e):[],n=t&&!this._opts.idle()&&i.includes("auto");n&&void 0===this._timer?this._schedule():n||void 0===this._timer||(window.clearTimeout(this._timer),this._timer=void 0)}_schedule(){const e=new Date,t=(0,ei.s$)(e,this._opts.hass()).getTime()-e.getTime()+500;this._timer=window.setTimeout(()=>{this._timer=void 0,this._host.requestUpdate(),this._sync()},t)}}const si=["top","right","bottom","left"],ri=e=>"left"===e||"right"===e,ai={top:{x:0,y:-1},right:{x:1,y:0},bottom:{x:0,y:1},left:{x:-1,y:0}};function oi(e,t,i=.5,n=0){const s=ai[t],r=4+n,a=e.shape?(0,se.aK)(e.shape.kind,e.w,e.h,e.shape.options,t,i):void 0;return a?{x:e.x+a.x+s.x*r,y:e.y+a.y+s.y*r}:{x:s.x?e.x+e.w/2+s.x*e.w/2+s.x*r:e.x+e.w*i,y:s.y?e.y+e.h/2+s.y*e.h/2+s.y*r:e.y+e.h*i}}const li=(e,t)=>Math.hypot(t.x-e.x,t.y-e.y);function ci(e,t,i,n){const s=oi(e,i),r=oi(t,n),a=ai[i],o=ai[n];return a.x*(r.x-s.x)+a.y*(r.y-s.y)>=0&&o.x*(s.x-r.x)+o.y*(s.y-r.y)>=0}function di(e,t,i,n){if("auto"!==i&&"auto"!==n)return[i,n];if("auto"===i&&"auto"===n){const i=e.y<t.y+t.h&&t.y<e.y+e.h,n=e.x<t.x+t.w&&t.x<e.x+e.w;if(i&&!n)return e.x<t.x?["right","left"]:["left","right"];if(n&&!i)return e.y<t.y?["bottom","top"]:["top","bottom"]}const s="auto"===i?si:[i],r="auto"===n?si:[n];let a,o=1/0;for(const i of s)for(const n of r){const s=li(oi(e,i),oi(t,n))+(ci(e,t,i,n)?0:1e6);s<o&&(o=s,a=[i,n])}return a}function ui(e){const t=Math.round(100*e)/100;return String(0===t?0:t)}function pi(e,t,i,n){return t<=i?(t+i)/2:n<=e?(n+e)/2:Math.max(t,n)+16}function hi(e,t){const i=li(e,t)||1;return{x:(t.x-e.x)/i,y:(t.y-e.y)/i}}function mi(e,t,i,n,s,r){const a=function(e,t,i,n,s,r){const a=[e],o=ai[i],l=ai[n],c=i!==n&&ri(i)===ri(n)&&o.x*(t.x-e.x)+o.y*(t.y-e.y)<0;if(c&&ri(i)){const i=e.x+16*o.x,n=t.x+16*l.x,c=pi(s.y,s.y+s.h,r.y,r.y+r.h);a.push({x:i,y:e.y},{x:i,y:c},{x:n,y:c},{x:n,y:t.y})}else if(c){const i=e.y+16*o.y,n=t.y+16*l.y,c=pi(s.x,s.x+s.w,r.x,r.x+r.w);a.push({x:e.x,y:i},{x:c,y:i},{x:c,y:n},{x:t.x,y:n})}else if(ri(i)&&ri(n)){let s=(e.x+t.x)/2;i===n&&(s="right"===i?Math.max(e.x,t.x)+16:Math.min(e.x,t.x)-16),a.push({x:s,y:e.y},{x:s,y:t.y})}else if(ri(i)||ri(n))ri(i)?a.push({x:t.x,y:e.y}):a.push({x:e.x,y:t.y});else{let s=(e.y+t.y)/2;i===n&&(s="bottom"===i?Math.max(e.y,t.y)+16:Math.min(e.y,t.y)-16),a.push({x:e.x,y:s},{x:t.x,y:s})}a.push(t);const d=[];for(const e of a){const t=d[d.length-1];if(t&&li(t,e)<.01)continue;const i=d[d.length-2];i&&t&&(i.x===t.x&&t.x===e.x||i.y===t.y&&t.y===e.y)&&d.pop(),d.push(e)}return d}(e,t,i,n,s,r),o=[],l=[`M ${ui(e.x)} ${ui(e.y)}`];let c=e;const d=e=>{li(c,e)<.01||(l.push(Math.abs(e.y-c.y)<.01?`H ${ui(e.x)}`:`V ${ui(e.y)}`),o.push({kind:"line",a:c,b:e}),c=e)};for(let e=1;e<a.length-1;e++){const t=a[e-1],i=a[e],n=a[e+1],s=Math.min(8,li(t,i)/2,li(i,n)/2),r=hi(t,i),u=hi(i,n),p={x:i.x-r.x*s,y:i.y-r.y*s},h={x:i.x+u.x*s,y:i.y+u.y*s};if(d(p),s>.01){const e=r.x*u.y-r.y*u.x>0?1:0;l.push(`A ${ui(s)} ${ui(s)} 0 0 ${e} ${ui(h.x)} ${ui(h.y)}`);const t={x:p.x+u.x*s,y:p.y+u.y*s};o.push({kind:"arc",c:t,u:{x:-u.x*s,y:-u.y*s},v:{x:r.x*s,y:r.y*s},r:s}),c=h}}d(t);const u=o.reduce((e,t)=>e+(e=>"line"===e.kind?li(e.a,e.b):Math.PI*e.r/2)(t),0);let p;for(const e of o)"line"===e.kind&&(!p||li(e.a,e.b)>li(p.a,p.b))&&(p=e);return p?{d:l.join(" "),mid:{x:(p.a.x+p.b.x)/2,y:(p.a.y+p.b.y)/2},tangent:hi(p.a,p.b),run:li(p.a,p.b),length:u}:{d:l.join(" "),mid:e,tangent:hi(e,t),run:0,length:u}}function fi(e,t,i,n,s={}){const[r,a]=i,o=oi(e,r,s.t?.[0],s.trim?.[0]),l=oi(t,a,s.t?.[1],s.trim?.[1]);return"curve"===n?function(e,t,i,n){const s=Math.min(120,li(e,t)/2),r={x:e.x+ai[i].x*s,y:e.y+ai[i].y*s},a={x:t.x+ai[n].x*s,y:t.y+ai[n].y*s},o=i=>{const n=1-i;return{x:n*n*n*e.x+3*n*n*i*r.x+3*n*i*i*a.x+i*i*i*t.x,y:n*n*n*e.y+3*n*n*i*r.y+3*n*i*i*a.y+i*i*i*t.y}};let l=0,c=e;for(let e=1;e<=32;e++){const t=o(e/32);l+=li(c,t),c=t}const d=.75*(r.x-e.x)+1.5*(a.x-r.x)+.75*(t.x-a.x),u=.75*(r.y-e.y)+1.5*(a.y-r.y)+.75*(t.y-a.y);return{d:`M ${ui(e.x)} ${ui(e.y)} C ${ui(r.x)} ${ui(r.y)} ${ui(a.x)} ${ui(a.y)} ${ui(t.x)} ${ui(t.y)}`,mid:o(.5),tangent:Math.hypot(d,u)>1e-6?hi({x:0,y:0},{x:d,y:u}):hi(e,t),run:l,length:l}}(o,l,r,a):"elbow"===n?mi(o,l,r,a,e,t):{d:`M ${ui(o.x)} ${ui(o.y)} L ${ui(l.x)} ${ui(l.y)}`,mid:{x:(o.x+l.x)/2,y:(o.y+l.y)/2},tangent:hi(o,l),run:li(o,l),length:li(o,l)}}var gi=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const yi=e=>e.replace(/\d/g,"0"),vi=e=>Math.round(10*e)/10,bi=["scroll","transitionend","animationend"];function wi(e){const t=e.parentElement??e.getRootNode().host??null;return t instanceof HTMLElement?t:null}const xi=e=>Math.max(8,3*e);function _i(e,t,i){const{position:n,width:s,arrow:r,obstacles:a,bounds:o}=i;if("hidden"===n)return;const{mid:l,tangent:c}=e;if("line"===n)return l;const d=[],u=Math.abs(c.x)*t.w+Math.abs(c.y)*t.h;"auto"===n&&e.run-2*(r+6)>=u+16&&d.push(l);let p={x:-c.y,y:c.x};(Math.abs(c.x)>=Math.abs(c.y)?p.y>0:p.x<0)&&(p={x:-p.x,y:-p.y});const h=(Math.abs(p.x)*t.w+Math.abs(p.y)*t.h)/2+s/2+4,m={x:l.x+p.x*h,y:l.y+p.y*h};d.push(m,{x:l.x-p.x*h,y:l.y-p.y*h});return d.find(e=>{const i=(e=>({x:e.x-t.w/2-2,y:e.y-t.h/2-2,w:t.w+4,h:t.h+4}))(e);return(!o||!(i.x<0||i.y<0||i.x+i.w>o.w||i.y+i.h>o.h))&&!a.some(e=>$i(i,e))})??("side"===n?m:void 0)}function $i(e,t){const i=Math.max(e.x,t.x),n=Math.max(e.y,t.y),s=Math.min(e.x+e.w,t.x+t.w)-i,r=Math.min(e.y+e.h,t.y+t.h)-n;return s>0&&r>0?{x:i,y:n,w:s,h:r}:void 0}function ki(e,t,i,n){const s=e.offsetParent,r=e.parentElement;if(s&&r&&(e.offsetWidth>0||e.offsetHeight>0)){let a,o;r===s?(a=r.clientLeft+e.offsetLeft,o=r.clientTop+e.offsetTop):r.offsetParent===s&&(a=e.offsetLeft-r.offsetLeft,o=e.offsetTop-r.offsetTop);const l=r.getBoundingClientRect();if(void 0!==a&&void 0!==o&&r.offsetWidth>0&&r.offsetHeight>0){const s=l.width/r.offsetWidth/i,c=l.height/r.offsetHeight/n,d=t(l);return{x:d.x+(a-r.scrollLeft)*s,y:d.y+(o-r.scrollTop)*c,w:e.offsetWidth*s,h:e.offsetHeight*c}}}return t(e.getBoundingClientRect())}let Mi=class extends r.WF{constructor(){super(...arguments),this.flows=[],this.dark=!1,this._rects=new Map,this._rectKey="",this._endsKey="",this._labelSizes=new Map,this._onFonts=()=>{this._labelSizes.clear(),this.requestUpdate(),this._schedule()},this._observed=new Set,this._raf=0,this._onMedia=()=>this.requestUpdate(),this._schedule=()=>{!this._raf&&this.isConnected&&(this._raf=requestAnimationFrame(()=>{this._raf=0,this.measure()}))}}flowAt(e,t,i=8){let n;for(const s of this.renderRoot.querySelectorAll("g.flow")){const r=s.querySelector("path.line"),a=r?.getScreenCTM?.();if(!r||!a||"function"!=typeof r.getTotalLength)continue;const o=new DOMPoint(e,t).matrixTransform(a.inverse()),l=Math.hypot(a.a,a.b)||1,c=r.getTotalLength();for(let e=0;e<=c;e+=2){const t=r.getPointAtLength(e),a=Math.hypot(t.x-o.x,t.y-o.y)*l;a<=i&&(!n||a<n.d)&&(n={key:s.dataset.flow??"",d:a})}}return n?.key||void 0}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._watch(),document.fonts?.addEventListener?.("loadingdone",this._onFonts),document.fonts?.ready?.then(this._onFonts,()=>{})}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),document.fonts?.removeEventListener?.("loadingdone",this._onFonts),this._unwatch(),this._raf&&cancelAnimationFrame(this._raf),this._raf=0}_watch(){const e=this.parentElement??void 0;if(!e||e===this._content)return!1;this._unwatch(),this._content=e,"function"==typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this.measure()),this._ro.observe(e));for(const t of bi)e.addEventListener(t,this._schedule,{capture:!0,passive:!0});return"function"==typeof MutationObserver&&(this._mo=new MutationObserver(this._schedule),this._mo.observe(e,{subtree:!0,childList:!0,characterData:!0,attributes:!0,attributeFilter:["style","class","hidden","data-mc-hidden"]})),!0}_unwatch(){for(const e of bi)this._content?.removeEventListener(e,this._schedule,{capture:!0});this._ro?.disconnect(),this._mo?.disconnect(),this._ro=void 0,this._mo=void 0,this._observed.clear(),this._content=void 0,this._endsKey=""}_probeOffsetPath(){if(void 0!==this._offsetPathWorks)return;const e=this.renderRoot.querySelector("svg.back");if(!e||!this.renderRoot.querySelector("circle.dot"))return;const t=document.createElementNS("http://www.w3.org/2000/svg","circle");t.setAttribute("class","probe"),t.setAttribute("r","1"),t.setAttribute("style","offset-path: path('M 0 0 L 100 0'); offset-distance: 100%; offset-rotate: 0deg; visibility: hidden"),e.append(t);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect();if(t.remove(),!(i.width>0&&n.width>0))return;const s=e instanceof SVGSVGElement&&e.clientWidth>0?n.width/e.clientWidth:1;this._offsetPathWorks=i.left+i.width/2-n.left>50*s,this._offsetPathWorks||this.requestUpdate()}updated(){this._probeOffsetPath();const e=this._watch(),t=JSON.stringify((this.flows??[]).filter(e=>e.visible).map(e=>[e.from,e.to]));(e||t!==this._endsKey)&&(this._endsKey=t,this.measure());let i=!1;for(const e of this.renderRoot.querySelectorAll(".label[data-measure]")){const t=yi(e.dataset.measure??"");this._labelSizes.has(t)||(this._labelSizes.size>=200&&this._labelSizes.delete(this._labelSizes.keys().next().value),this._labelSizes.set(t,{w:e.offsetWidth,h:e.offsetHeight}),i=!0)}i&&this.requestUpdate()}measure(){const e=this._content;if(!e)return;const t=new Set;for(const e of this.flows??[])e.visible&&t.add(e.from).add(e.to);const i=new Map,n=new Set;if(t.size)for(const s of e.querySelectorAll("[data-mc-id], .mc-column")){n.add(s);const e=s.dataset.mcId;e&&t.has(e)&&!i.has(e)&&i.set(e,s)}for(const e of[...this._observed])n.has(e)||(this._ro?.unobserve(e),this._observed.delete(e));for(const e of n)this._observed.has(e)||(this._ro?.observe(e),this._observed.add(e));const s=e.getBoundingClientRect(),r=e.offsetWidth>0&&s.width>0?s.width/e.offsetWidth:1,a=e.offsetHeight>0&&s.height>0?s.height/e.offsetHeight:1,o=e.offsetWidth||s.width,l=e.offsetHeight||s.height,c=t=>({x:(t.left-s.left)/r-e.clientLeft,y:(t.top-s.top)/a-e.clientTop,w:t.width/r,h:t.height/a}),d=new Map,u=e=>{let t=d.get(e);if(void 0!==t)return t;const i=getComputedStyle(e);if(t=null,[i.overflowX,i.overflowY,i.overflow].some(e=>e&&"visible"!==e)){const i=c(e.getBoundingClientRect()),n=e.offsetWidth>0?i.w/e.offsetWidth:1,s=e.offsetHeight>0?i.h/e.offsetHeight:1;t={x:i.x+e.clientLeft*n,y:i.y+e.clientTop*s,w:e.clientWidth>0?e.clientWidth*n:i.w,h:e.clientHeight>0?e.clientHeight*s:i.h}}return d.set(e,t),t},p=new Map;for(const[t,n]of i){if("function"==typeof n.checkVisibility&&!n.checkVisibility())continue;let i=ki(n,c,r,a);for(let t=wi(n);i&&t&&t!==e;t=wi(t)){const e=u(t);e&&(i=$i(i,e))}if(!i||i.w<=0||i.h<=0)continue;const s={x:vi(i.x),y:vi(i.y),w:vi(i.w),h:vi(i.h)},d=n.querySelector(":scope > mc-shape")?.shape;d&&(s.shape=d),o&&l&&(s.x>=o||s.y>=l||s.x+s.w<=0||s.y+s.h<=0)||p.set(t,s)}const h=JSON.stringify([o,l,...p]);h!==this._rectKey&&(this._rectKey=h,this._rects=p,this._bounds=o&&l?{w:o,h:l}:void 0,this.requestUpdate())}render(){const e=!!this._media?.matches,t=!1!==this._offsetPathWorks&&"undefined"!=typeof CSS&&"function"==typeof CSS.supports&&CSS.supports("offset-path",'path("M0 0")'),i=[],n=[],s=[],a=(this.flows??[]).flatMap((e,t)=>{const i=this._rects.get(e.from),n=this._rects.get(e.to);return e.visible&&i&&n?[{f:e,i:t,a:i,b:n,from:e.from,to:e.to,sides:di(i,n,e.fromSide,e.toSide)}]:[]}),o=function(e,t){const i=e.map(()=>[.5,.5]),n=new Map;e.forEach((e,i)=>{const s=t.get(e.from),r=t.get(e.to);s&&r&&[0,1].forEach(t=>{const[a,o,l,c]=0===t?[e.from,e.sides[0],r,e.sides[1]]:[e.to,e.sides[1],s,e.sides[0]],d=oi(l,c),u=`${a}|${o}`,p=n.get(u)??[];p.push({flow:i,end:t,key:ri(o)?d.y:d.x}),n.set(u,p)})});for(const[e,s]of n){const n=s.length;if(n<2)continue;const[r,a]=e.split("|"),o=t.get(r),l=ri(a)?o.h:o.w;if(l<=0)continue;const c=Math.min(16,.6*l/(n-1));s.sort((e,t)=>e.key-t.key||e.flow-t.flow),s.forEach((e,t)=>{i[e.flow][e.end]=.5+(t-(n-1)/2)*c/l})}return i}(a,this._rects),l=[...this._rects.values()],c=a.reduce((i,{f:n})=>i+((i=>i.active&&0!==i.direction&&!e&&t&&i.dots>0)(n)?n.dots:0),0);return a.forEach(({f:a,i:d,a:u,b:p,sides:h},m)=>{const f=e&&a.active&&0!==a.direction?xi(a.width):0,g=a.direction<0?[f,0]:[0,f],y=fi(u,p,h,a.route,{t:o[m],trim:g});("front"===a.layer?n:i).push(this._flow(a,y,d,e,t,(e=>c>40?Math.max(1,Math.floor(40*e.dots/c)):e.dots)(a)));const v=a.label;if(!v||"hidden"===a.labelPosition)return;const b=a.active?a.color:a.idleColor,w=this._labelSizes.get(yi(v));if(!w)return void s.push(r.qy`<div class="label" data-measure=${v} style="left: 0; top: 0; visibility: hidden">${v}</div>`);const x=_i(y,w,{position:a.labelPosition,width:a.width,arrow:f,obstacles:l,bounds:this._bounds});x&&(l.push({x:x.x-w.w/2,y:x.y-w.h/2,w:w.w,h:w.h}),s.push(r.qy`<div class="label" style="left: ${vi(x.x)}px; top: ${vi(x.y)}px; --mc-flow-color: ${b}">${v}</div>`))}),r.qy`
      <svg class="back" ${(0,b.Sv)()} focusable="false">${i}</svg>
      <svg class="front" ${(0,b.Sv)()} focusable="false">${n}</svg>
      <div class="labels">${s}</div>
    `}_flow(e,t,i,n,s,a){const o=e.color,l=e.active&&0!==e.direction,c=e.direction<0?"reverse":"normal",d=l&&!n&&e.dots>0&&s,u=l&&!n&&!d,p=l&&n,h=`mc-flow-arrow-${i}`,m=xi(e.width),f=l&&!u?o:e.idleColor,g=Math.max(4,2*e.width),y=2.5*g,v=t.length>0?e.speedS*y/t.length:e.speedS,b=!!this.selected&&this.selected===e.id;return r.JW`<g class="flow" data-flow=${e.id} data-dots=${d?"":r.s6} data-selected=${b?"":r.s6}>
      ${b?r.JW`<path class="sel" d=${t.d} style="stroke-width: ${vi(e.width+10)}px"></path>`:r.s6}
      ${p?r.JW`<marker id=${h} viewBox="0 0 10 10" refX="0" refY="5" markerWidth=${m} markerHeight=${m}
            markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" style="fill: ${o}; stroke: none"></path></marker>`:r.s6}
      <path class="line" d=${t.d} pathLength="100" style="stroke: ${f}; stroke-width: ${vi(e.width)}px"
        marker-end=${p&&e.direction>0?`url(#${h})`:r.s6}
        marker-start=${p&&e.direction<0?`url(#${h})`:r.s6}></path>
      ${u?r.JW`<path class="dash" d=${t.d} style="stroke: ${o}; stroke-width: ${vi(e.width)}px; stroke-dasharray: ${vi(g)} ${vi(y-g)}; --mc-flow-shift: ${-vi(y)}px; animation-duration: ${v.toFixed(3)}s; animation-direction: ${c}"></path>`:r.s6}
      ${d?r.JW`<g class="dots" style="fill: ${o}">${Array.from({length:a},(i,n)=>{const s=`offset-path: path('${t.d}'); animation-duration: ${e.speedS.toFixed(3)}s; animation-delay: ${+(-e.speedS*n/a).toFixed(3)||0}s; animation-direction: ${c}`;return r.JW`${e.glow>0?r.JW`<circle class="glow" r=${vi(e.dotSize/2+e.glow)} style=${s}></circle>`:r.s6}<circle
              class="dot" r=${e.dotSize/2} style=${s}></circle>`})}</g>`:r.s6}
    </g>`}};Mi.styles=q,gi([(0,a.MZ)({attribute:!1,hasChanged:(e,t)=>!function(e,t){return e===t||!!e&&!!t&&JSON.stringify(e)===JSON.stringify(t)}(e,t)})],Mi.prototype,"flows",void 0),gi([(0,a.MZ)({type:Boolean,reflect:!0})],Mi.prototype,"dark",void 0),gi([(0,a.MZ)({attribute:!1})],Mi.prototype,"selected",void 0),Mi=gi([(0,a.EM)("mc-flows")],Mi);var Si=i(2908);function Ci(e,t){e.removeAttribute(t),e.offsetWidth,e.setAttribute(t,"")}var Ti=i(8521),Ai=i(9162),Ei=i(5486);class Pi{static validate(e){const t=[],i=[];if(!e||"object"!=typeof e)return{valid:!1,errors:["Config must be an object"],warnings:i};const n=e;return n.type&&"string"==typeof n.type||t.push("Config must have a type"),Array.isArray(n.rows)?(n.rows.forEach((e,n)=>{e.columns&&Array.isArray(e.columns)?e.columns.forEach((e,s)=>{e.modules&&Array.isArray(e.modules)?e.modules.forEach((e,r)=>{if(e&&"object"==typeof e)if(e.type)if(Ei.s.has(e.type)){const t=Ei.s.get(e.type),a=t?t.validate(e):[];i.push(...a.map(t=>`Row ${n}, Col ${s}, Module ${r} (${e.type}): ${t}`))}else i.push(`Row ${n}, Col ${s}, Module ${r}: unknown type "${e.type}"`);else i.push(`Row ${n}, Col ${s}, Module ${r}: missing type`);else t.push(`Row ${n}, Col ${s}, Module ${r}: must be an object`)}):t.push(`Row ${n}, Column ${s} must have a modules array`)}):t.push(`Row ${n} must have a columns array`)}),{valid:0===t.length,errors:t,warnings:i}):(t.push("Config must have a rows array"),{valid:!1,errors:t,warnings:i})}}var zi=i(209),Li=i(5217),Oi=i(7508);const qi=new Map;function Ri(e){return JSON.stringify(Object.keys(e).sort().map(t=>[t,e[t]]))}function Ni(e){return String(e&&"object"==typeof e&&"message"in e?e.message:e)}class Ii{constructor(e,t,i=50){this._requestUpdate=e,this._connection=t,this._debounceMs=i,this._subs=new Map,this._wanted=null,this._connected=!1,this._dirty=!1,this._onReady=()=>{for(const e of this._subs.values())e.failed=!1;if(this._connected)for(const e of this._subs.values())this._subscribe(e)}}begin(){this._wanted=new Set,this._dirty=!1}get(e){const t=Ri(e);this._wanted?.add(t);let i=this._subs.get(t);return i||(i={msg:e,state:qi.get(t)??{status:"pending"}},this._connection()?.subscribeMessage||(i.state={status:"unavailable"}),this._subs.set(t,i)),i.state}end(){const e=this._wanted;if(this._wanted=null,e)for(const[t,i]of this._subs)e.has(t)?this._connected&&this._subscribe(i):(this._unsubscribe(i),this._subs.delete(t))}hostConnected(){this._connected=!0;for(const e of this._subs.values())e.failed=!1,this._subscribe(e);this._dirty&&this._schedule()}hostDisconnected(){this._connected=!1;for(const e of this._subs.values())this._unsubscribe(e);this._listenReady(void 0),void 0!==this._timer&&clearTimeout(this._timer),this._timer=void 0}get size(){return[...this._subs.values()].filter(e=>e.active).length}_listenReady(e){this._readyOn!==e&&(this._readyOn?.removeEventListener?.("ready",this._onReady),this._readyOn=e?.addEventListener?e:void 0,this._readyOn?.addEventListener?.("ready",this._onReady))}_subscribe(e){if(e.active||e.failed)return;const t=Ri(e.msg),i=this._connection();if(!i?.subscribeMessage)return void this._set(t,e,{status:"unavailable"});this._listenReady(i),"unavailable"===e.state.status&&(e.state=qi.get(t)??{status:"pending"});const n={};e.token=n;const s=()=>e.token===n;let r;try{r=i.subscribeMessage(i=>{s()&&this._set(t,e,{status:"ok",data:i})},{...e.msg})}catch(e){r=Promise.reject(e)}e.active=Promise.resolve(r).then(e=>e).catch(i=>{s()&&(e.active=void 0,e.token=void 0,e.failed=!0,this._set(t,e,{status:"error",error:Ni(i)}))})}_unsubscribe(e){const t=e.active;e.active=void 0,e.token=void 0,t&&t.then(e=>{try{e?.()}catch{}})}_set(e,t,i){t.state!==i&&(t.state.status!==i.status||"ok"===i.status||"error"===i.status&&t.state.error!==i.error)&&(t.state=i,function(e,t){"ok"===t.status&&(qi.delete(e),qi.set(e,t),qi.size>100&&qi.delete(qi.keys().next().value))}(e,i),this._dirty=!0,this._connected&&this._schedule())}_schedule(){void 0===this._timer&&(this._timer=setTimeout(()=>{this._timer=void 0,this._requestUpdate()},this._debounceMs))}}var ji=i(1912),Di=i(3722),Bi=i(9620);var Wi=i(9307);function Fi(e){const t=e.join(". ");return r.qy`<div class="mc-module mc-module-error" role="alert" title=${t}>
    <ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${t}</span>
  </div>`}function Hi(e,t){const i=Ei.s.get(e?.type);if(!i)return Fi([`Unknown module: ${String(e?.type)}`]);try{const n=i.validate(e);if(n.length)return Fi(n);const s=(0,Wi.V)();if(!s||s.editMode){const t=i.hints?.(e)??[];if(t.length)return function(e){const t=e.join(". ");return r.qy`<div class="mc-module mc-module-hint" title=${t}>
    <ha-icon icon="mdi:information-outline"></ha-icon><span>${t}</span>
  </div>`}(t)}return i.renderPreview(e,t)}catch(t){return console.warn(`Magic Card: ${e.type} module failed to render`,t),Fi([t instanceof Error?t.message:String(t)])}}function Gi(e,t,i,n=0){const s=(0,Wi.V)();return s?.renderChild?s.renderChild(e,i,n):Hi(e,t)}function Ji(e){const t=(0,Wi.V)();return t&&!t.editMode?r.s6:r.qy`<span class="mc-placeholder-text">${e}</span>`}var Ui=i(1831),Vi=i(4318);const Zi={en:JSON.parse('{"card":{"name":"Magic Card","description":"A fully open-source multi-module card"},"editor":{"mode_form":"Form","mode_yaml":"YAML","add_row":"Add row","add_module":"Add module","delete":"Delete","undo":"Undo","redo":"Redo"},"tabs":{"general":"General","actions":"Actions","conditions":"Conditions","design":"Design"},"modules":{"text":"Text","icon":"Icon","info":"Info","image":"Image","markdown":"Markdown","bar":"Bar","graphs":"Graph","camera":"Camera","button":"Button","slider":"Slider","spinbox":"Spinbox","dropdown":"Dropdown","light":"Light","gauge":"Gauge","horizontal":"Horizontal","vertical":"Vertical","tabs":"Tabs","separator":"Separator","clock":"Clock","weather":"Weather","forecast":"Forecast","video-bg":"Video background"},"actions_config":{"tap_action":"Tap action","hold_action":"Hold action","double_tap_action":"Double tap action","action_none":"None","action_more_info":"More info","action_toggle":"Toggle","action_navigate":"Navigate","action_url":"URL","action_perform_action":"Perform action","action_assist":"Assist"},"conditions":{"mode_every":"All conditions (AND)","mode_any":"Any condition (OR)","type_state":"State","type_attribute":"Attribute","type_time":"Time","type_template":"Template","add_condition":"Add condition"},"forecast":{"day":"Day {n}","no_forecast":"This entity has no forecast","not_available":"Forecast not available: {error}","no_data":"No forecast data","unavailable":"Unavailable"}}'),nl:JSON.parse('{"card":{"name":"Magic Card","description":"Een volledig open-source multi-module kaart"},"editor":{"mode_form":"Formulier","mode_yaml":"YAML","add_row":"Rij toevoegen","add_module":"Module toevoegen","delete":"Verwijderen","undo":"Ongedaan maken","redo":"Opnieuw"},"tabs":{"general":"Algemeen","actions":"Acties","conditions":"Condities","design":"Ontwerp"},"modules":{"text":"Tekst","icon":"Icoon","info":"Info","image":"Afbeelding","markdown":"Markdown","bar":"Balk","graphs":"Grafiek","camera":"Camera","button":"Knop","slider":"Schuifregelaar","spinbox":"Spinbox","dropdown":"Dropdown","light":"Lamp","gauge":"Meter","horizontal":"Horizontaal","vertical":"Verticaal","tabs":"Tabbladen","separator":"Scheidingslijn","clock":"Klok","weather":"Weer","forecast":"Weersvoorspelling","video-bg":"Video achtergrond"},"actions_config":{"tap_action":"Tik actie","hold_action":"Vasthoud actie","double_tap_action":"Dubbeltik actie","action_none":"Geen","action_more_info":"Meer info","action_toggle":"Schakel","action_navigate":"Navigeer","action_url":"URL","action_perform_action":"Actie uitvoeren","action_assist":"Assistent"},"conditions":{"mode_every":"Alle condities (EN)","mode_any":"Elke conditie (OF)","type_state":"Status","type_attribute":"Attribuut","type_time":"Tijd","type_template":"Template","add_condition":"Conditie toevoegen"},"forecast":{"day":"Dag {n}","no_forecast":"Deze entiteit heeft geen weersverwachting","not_available":"Weersverwachting niet beschikbaar: {error}","no_data":"Geen weersverwachting","unavailable":"Niet beschikbaar"}}')};let Yi="en";function Xi(e){const t=e.split(".");let i=Zi[Yi]||Zi.en;for(const n of t){if(!i||"object"!=typeof i||!(n in i)){i=Zi.en;for(const n of t){if(!i||"object"!=typeof i||!(n in i))return e;i=i[n]}break}i=i[n]}return"string"==typeof i?i:e}var Ki=i(1268),Qi=i(2014);const en={position:"absolute",width:"0",height:"0",margin:"0",padding:"0","min-height":"0",overflow:"visible"};class tn{constructor(e,t){this.host=e,this.opts=t,this.phase="closed",this._source="hash",this._pushed=!1,this._awaitPop=!1,this._initialChecked=!1,this._returnFocus=null,this._placeholders=[],this._swipe=new Ki.Ho,this._onKeydown=e=>{this._restartAutoClose(),"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._close("user"))},this._onCancel=e=>{e.preventDefault(),this._close("user")},this._onNativeClose=()=>{"open"===this.phase&&this._close("user")},this._onActivity=()=>this._restartAutoClose(),this._onBackdrop=e=>{e.stopPropagation(),this._close("user")},this._onCloseClick=e=>{e.stopPropagation(),this._close("user")},this._onHandleDown=e=>{!e.isPrimary||e.button>0||"open"!==this.phase||e.target?.closest?.(".mc-popup-close")||(this._swipe.start(e.clientY,e.timeStamp),e.currentTarget.setPointerCapture?.(e.pointerId),this._surface()?.setAttribute("data-dragging",""))},this._onHandleMove=e=>{if(!this._swipe.active)return;const t=this._swipe.move(e.clientY);this._surface()?.style.setProperty("--mc-popup-drag",`${t}px`)},this._onHandleUp=e=>{if(!this._swipe.active)return;const t=this._surface(),i=this._swipe.end(e.clientY,e.timeStamp,t?.getBoundingClientRect().height??0);t?.removeAttribute("data-dragging"),i?this._close("user"):t?.style.removeProperty("--mc-popup-drag")},this._onHandleCancel=()=>{if(!this._swipe.active)return;this._swipe.cancel();const e=this._surface();e?.removeAttribute("data-dragging"),e?.style.removeProperty("--mc-popup-drag")},e.addController(this)}isPopup(){return(0,Ki.uT)(this.opts.config())}popupId(){return this.isPopup()?(0,Ki.t8)(this.opts.config()):void 0}editorPlace(){return this.opts.editorPlace()}get hidden(){return this.isPopup()&&!this.editorPlace()}get isOpen(){return"closed"!==this.phase}_listening(){return this.host.isConnected&&this.hidden}hostConnected(){Qi.P.register(this),this._initialChecked=!1}hostDisconnected(){Qi.P.unregister(this),this._finish(!1),this._restorePlaceholders(),window.clearTimeout(this._awaitPopTimer),this._awaitPop=!1}hostUpdated(){this._syncPlaceholders(),this._listening()?this._initialChecked||(this._initialChecked=!0,(0,Ki.CR)(window.location.hash,this.popupId())&&this._open("hash",!1)):(this._initialChecked=!1,"open"===this.phase&&"preview"!==this._source&&this._close("silent")),this._syncDialog()}get _dialog(){return this.host.shadowRoot?.querySelector("dialog.mc-popup")??null}_syncDialog(){const e=this._dialog;if(e)if("closed"===this.phase||e.open)"closed"===this.phase&&e.open&&e.close();else{try{e.showModal()}catch{e.setAttribute("open","")}this._focusInside(e)}}_focusInside(e){const t=e.querySelector(".mc-popup-close")??e.querySelector(".mc-popup-surface");t?.focus({preventScroll:!0})}_syncPlaceholders(){if(!(this.hidden&&this.host.isConnected))return void this._restorePlaceholders();if(this._placeholders.length)return;const e=[this.host],t=this.host.parentElement;if("hui-card"===t?.localName){e.push(t);const i=t.parentElement;"div"===i?.localName&&i.classList.contains("card")&&e.push(i)}this._placeholders=e.map(e=>{const t={};for(const[i,n]of Object.entries(en))t[i]=e.style.getPropertyValue(i),e.style.setProperty(i,n);return{el:e,saved:t}})}_restorePlaceholders(){for(const{el:e,saved:t}of this._placeholders)for(const[i,n]of Object.entries(t))n?e.style.setProperty(i,n):e.style.removeProperty(i);this._placeholders=[]}locationChanged(e){if(!this._listening())return;if("pop"===e)this._awaitPop=!1,window.clearTimeout(this._awaitPopTimer);else if(this._awaitPop)return;const t=(0,Ki.CR)(window.location.hash,this.popupId());t&&"open"!==this.phase?this._open("hash","replace"!==e):t||"open"!==this.phase||"hash"!==this._source||this._close("location")}hassChanged(e,t){if(!this._listening()||!e||!t)return;const i=this.opts.config();"open"!==this.phase&&(0,Ki.b7)(i?.open_on,e.states,t.states)?(0,Qi.R)(this.popupId())||this._open("trigger",!1):"open"===this.phase&&(0,Ki.b7)(i?.close_on,e.states,t.states)&&this._close("user")}openPreview(){this._open("preview",!1)}closeForOther(){this._close("other")}closeByAction(){this._close("user")}close(){this._close("user")}_open(e,t){if(window.clearTimeout(this._closeTimer),this._closeTimer=void 0,this._source=e,this._pushed=t,"open"===this.phase)return;const i="closing"===this.phase;Qi.P.willOpen(this),i||(this._returnFocus=function(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}()),this.phase="open",this._restartAutoClose(),this.host.requestUpdate()}_close(e){if("open"!==this.phase)return;window.clearTimeout(this._autoTimer),"hash"===this._source&&"location"!==e&&"silent"!==e&&this._leaveHash("other"===e),this.phase="closing",this.host.requestUpdate();const t="silent"===e||"function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:280;this._closeTimer=window.setTimeout(()=>this._finish(!0),t)}_leaveHash(e){if((0,Ki.CR)(window.location.hash,this.popupId())){if(this._pushed&&!e)return this._awaitPop=!0,window.clearTimeout(this._awaitPopTimer),this._awaitPopTimer=window.setTimeout(()=>{this._awaitPop=!1},1e3),void history.back();history.replaceState(history.state,"",(0,Ki.WV)(window.location.href)),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!0}}))}}_finish(e){if(window.clearTimeout(this._closeTimer),window.clearTimeout(this._autoTimer),this._closeTimer=void 0,this._swipe.cancel(),"closed"===this.phase)return;this.phase="closed",Qi.P.didClose(this);const t=this._dialog;t?.open&&t.close(),this.host.requestUpdate();const i=this._returnFocus;this._returnFocus=null,e&&i?.isConnected&&i.focus({preventScroll:!0})}_restartAutoClose(){window.clearTimeout(this._autoTimer);const e=(0,Ki.GD)(this.opts.config()?.auto_close);e&&"open"===this.phase&&(this._autoTimer=window.setTimeout(()=>this._close("user"),e))}_surface(){return this._dialog?.querySelector(".mc-popup-surface")??null}renderHead(e){const t=this.opts.config(),i="sheet"===(0,Ki.yB)(t),n=t?.title?.trim(),s=!1!==t?.show_close;return i||n||s?r.qy`
      <div
        class="mc-popup-head"
        @pointerdown=${i?this._onHandleDown:r.s6}
        @pointermove=${i?this._onHandleMove:r.s6}
        @pointerup=${i?this._onHandleUp:r.s6}
        @pointercancel=${i?this._onHandleCancel:r.s6}
      >
        ${i?r.qy`<div class="mc-popup-handle" aria-hidden="true"></div>`:r.s6}
        ${n?r.qy`<h2 class="mc-popup-title" id=${e}>${n}</h2>`:r.qy`<span class="mc-popup-title"></span>`}
        ${s?r.qy`<button type="button" class="mc-popup-close" aria-label="Close" title="Close" @click=${this._onCloseClick}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`:r.s6}
      </div>
    `:r.qy``}renderDialog(e,t,i,n){const s=this.opts.config(),a=!!s?.title?.trim();return r.qy`
      <dialog
        class="mc-popup"
        data-mc-popup=""
        data-style=${(0,Ki.yB)(s)}
        data-phase=${this.phase}
        aria-modal="true"
        aria-labelledby=${a?i:r.s6}
        aria-label=${a?r.s6:t}
        style=${(0,Ki.gt)(s,n)}
        @keydown=${this._onKeydown}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @pointerdown=${this._onActivity}
        @wheel=${this._onActivity}
        @touchstart=${this._onActivity}
      >
        ${"closed"===this.phase?r.s6:r.qy`<div class="mc-popup-backdrop" @click=${this._onBackdrop}></div>
              <div class="mc-popup-frame">${e}</div>`}
      </dialog>
    `}}var nn,sn=i(5993),rn=i(2142),an=i(2146),on=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function ln(e,t){if(!e||"object"!=typeof e)return e;const i=e.id||t,n={...e,id:i};if(!(0,Vi.yZ)(e))return n;const s=n,r=(e,t)=>Array.isArray(e)?e.map((e,n)=>ln(e,`${i}~${t}.${n}`)):e;if("row"===e.type||"tabs"===e.type){const t="row"===e.type?"columns":"tabs";Array.isArray(s[t])&&(s[t]=s[t].map((e,t)=>e&&"object"==typeof e?{...e,modules:r(e.modules,t)}:e))}else Array.isArray(s.modules)&&(s.modules=r(s.modules,0));return n}function cn(e,t){return[e?.tap_action,e?.hold_action,e?.double_tap_action].some(e=>function(e,t){if(!e||"object"!=typeof e||!e.action||"none"===e.action)return!1;const i=e=>"string"==typeof e&&""!==e.trim();switch(e.action){case"navigate":return i(e.navigation_path);case"url":return i(e.url_path);case"perform-action":return i(e.service);case"toggle":case"more-info":return i(e.entity)||!1!==e.use_module_entity&&i(t);case"popup":return i(e.hash);default:return!0}}(e,t))}const dn='input, select, textarea, button, a[href], [role="button"], [role="slider"], [role="switch"], [role="tab"], [role="checkbox"], [contenteditable=""], [contenteditable="true"], ha-slider, ha-switch, ha-camera-stream, mc-embedded-card, .mc-slider-pagination',un=`${dn}, [tabindex]:not([tabindex="-1"])`;let pn=0;const hn={width:"var(--ha-card-border-width, 1px)",style:"solid",color:"var(--ha-card-border-color, var(--divider-color, #e0e0e0))"};function mn(e,t,i){const n=tt(e);return n?{shape:n,stroke:(0,H.eI)(e),shadow:(0,H.a7)(e?.box_shadow),style:(0,H.DA)(e,t,i),edge:i}:{border:(0,H.fV)(e),style:i?(0,H.AT)(e,t,{min:i}):void 0}}function fn(e){return{...e,rows:(e.rows||[]).map((e,t)=>{const i=e.id||`row~${t}`;return{...e,id:i,columns:(e.columns||[]).map((e,t)=>{const n=e.id||`${i}~col${t}`;return{...e,id:n,modules:(e.modules||[]).map((e,t)=>ln(e,`${n}~${t}`))}})}})}}let gn=nn=class extends r.WF{constructor(){super(...arguments),this.editMode=!1,this.preview=!1,this._readThemeShadow=!1,this._customRendered=!1,this._sequences=new Map,this._v2Render=[],this._v2Applied=new Set,this._v2Need=!1,this._v2Waiting=!1,this._pNeed=!1,this._pApplied=new Set,this._customLookup=e=>(this._customRendered=!0,sn.iG.ensure(this.hass),!this._unsubLibrary&&this.isConnected&&(this._unsubLibrary=sn.iG.subscribe(this._onLibrary)),sn.iG.get(e)??(0,sn.n6)(this._resolvedConfig??this._config)?.get(e)),this._onLibrary=()=>{this._libDirty=!0,this.requestUpdate()},this._templateFetched=!1,this._boundRequestUpdate=()=>this.requestUpdate(),this._onTapAnimations=e=>function(e,t){for(const i of e.composedPath()){if(i===t)break;if(i instanceof HTMLElement){i.hasAttribute("data-mc-tap")&&Ci(i,"data-mc-tapped");for(const t of i.querySelectorAll(":scope > .mc-anim-fx[data-tap], :scope > .mc-anim-ring[data-tap]")){const n=i.getBoundingClientRect();t.style.setProperty("--mc-tap-x",`${Math.round(e.clientX-n.left)}px`),t.style.setProperty("--mc-tap-y",`${Math.round(e.clientY-n.top)}px`),Ci(t,"data-tapped")}}}}(e,this),this._holdTimers=new WeakMap,this._downAt=new WeakMap,this._pendingTimers=new Set,this._claimed=new WeakSet,this._tapTimers=new WeakMap,this._templates=new Oi.XM(()=>this.requestUpdate(),()=>this.hass?.connection),this._subscriptions=new Ii(()=>this.requestUpdate(),()=>this.hass?.connection),this._media=new ji.J2(()=>this.requestUpdate(),()=>this.hass),this._pathStack=[],this._uiState=new Map,this._renderContext={instance:"card-"+ ++pn,template:(e,t)=>this._templates.get(e,t),subscribe:e=>this._subscriptions.get(e),media:e=>this._media.get(e),requestUpdate:()=>this.requestUpdate(),renderChild:(e,t,i=0)=>{const n=this._pathStack[this._pathStack.length-1];return void 0===n?Hi(e,this.hass):this._renderModule(e,`${n}/${i}.${t}`)},renderColumn:(e,t)=>{const i=this._pathStack[this._pathStack.length-1];return void 0===i?void 0:this._renderColumn(e,0,t,i)},childHidden:e=>!this.editMode&&this._isHidden(e),uiState:e=>{const t=`${this._pathStack[this._pathStack.length-1]??""}#${e}`;return{get:()=>this._uiState.get(t),set:e=>{this._uiState.set(t,e)}}},selectedChild:()=>{const e=this._pathStack[this._pathStack.length-1],t=this.selectedPath;if(this.editMode&&void 0!==e&&t){if(t.startsWith(`${e}#`))return{slot:Number(t.slice(e.length+1)),index:-1};if(t.startsWith(`${e}/`))return(0,Vi.Tu)(t.slice(e.length+1).split("#")[0])?.[0]}},editMode:!1},this._hoverRules=new Map,this._cardInstanceId=(0,G.$)("cardinst"),this._popup=new tn(this,{config:()=>(this._resolvedConfig??this._config)?.popup,editorPlace:()=>this._editorPlace()}),this._seasonalBudget=new ne.W8,this._seasonal=new ni(this,{config:()=>(this._resolvedConfig??this._config)?.seasonal,hass:()=>this.hass,editorPreview:()=>{const e=this._editorPlace();return"canvas"===e||"card-editor"===e},idle:()=>this._popup.hidden&&!this._popup.isOpen})}static async getConfigElement(){if(!await ie())throw new Error("Magic Card: the visual editor could not be loaded.");return document.createElement(s.z)}static getStubConfig(){return{type:`custom:${s.Mp}`,rows:[{id:(0,G.$)("row"),layout:"1",columns:[{id:(0,G.$)("col"),modules:[{id:(0,G.$)("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");const t=Pi.validate(e);if(!t.valid)throw new Error(`Invalid configuration: ${t.errors.join("; ")}`);const i=this._config?.template;this._config=fn({...e,rows:e.rows||[]}),e.template!==i&&(this._templateFetched=!1,this._templateConfig=void 0,this._resolvedConfig=void 0),this._templateConfig&&(this._resolvedConfig=fn((0,Ai.e5)(this._templateConfig,this._config)))}getCardSize(){return this._popup.hidden?0:this._config?.rows?Math.max(this._config.rows.length,1):1}getGridOptions(){return this._popup.hidden?{columns:"full",rows:"auto",min_rows:0}:{}}getLayoutOptions(){return this._popup.hidden?{grid_columns:"full",grid_rows:"auto",grid_min_rows:0}:{}}connectedCallback(){super.connectedCallback(),this.addEventListener("mc-request-update",this._boundRequestUpdate),this.addEventListener("pointerdown",this._onTapAnimations),this._templates.hostConnected(),this._subscriptions.hostConnected(),this._media.hostConnected(),this.hasUpdated&&this._syncTicker(),this.hasUpdated&&this._customRendered&&this._onLibrary()}_dependencies(){const e=this._resolvedConfig??this._config;return e?(0,Li._)(e,{editMode:this.editMode}):{entities:[],forwardHass:!1}}_syncTicker(){const e=this._popup.hidden&&!this._popup.isOpen,t=this.isConnected&&!e?this._dependencies().refreshInterval:void 0;if(t===this._tickInterval&&(void 0===t||void 0!==this._tickTimer))return;if(void 0!==this._tickTimer&&window.clearTimeout(this._tickTimer),this._tickTimer=void 0,this._tickInterval=t,!t)return;const i=()=>{const e=t-Date.now()%t+20;this._tickTimer=window.setTimeout(()=>{this.requestUpdate(),i()},e)};i()}shouldUpdate(e){var t;if(e.has("hass")&&this.hass&&(t=this.hass.language,Yi=Zi[t]?t:"en"),e.has("hass")&&this._popup.hassChanged(e.get("hass"),this.hass),this._libDirty||e.has("_config")||e.has("_resolvedConfig"))return!0;if(e.has("preview")||e.has("editMode"))return!0;if(e.has("hass")&&this.hass){const t=e.get("hass");if(!t)return!0;if(t.language!==this.hass.language)return!0;if(t.themes!==this.hass.themes||t.locale!==this.hass.locale||t.entities!==this.hass.entities)return!0;if(this._popup.hidden&&!this._popup.isOpen)return!1;if(this._seasonal.changed(t))return!0;const i=this._dependencies();return!!i.entities.some(e=>t.states[e]!==this.hass.states[e])||(i.forwardHass&&this._forwardHass(),!1)}return!0}_forwardHass(){const e=this.hass;if(e)for(const t of this.renderRoot?.querySelectorAll("mc-embedded-card")??[])t.hass=e}updated(e){if(super.updated(e),this._seasonalBudget.settle()&&this.requestUpdate(),this._syncHoverStyles(),this._syncRowFocus(),this._libDirty=!1,this._customRendered&&(0,rn.ag)(this.renderRoot),(this._customRendered||this._sequences.size)&&(0,an.kj)(this.renderRoot,this._sequences),(this._v2Need||this._v2Applied.size)&&this._syncRuntime(),(this._pNeed||this._pApplied.size)&&this._syncParticles(),this._readThemeShadow){const e=(0,H.a7)(getComputedStyle(this).getPropertyValue("--ha-card-box-shadow"));e!==this._themeShadow&&(this._themeShadow=e)}this._templates.end(),this._subscriptions.end(),this._media.end(),this._syncTicker(),this.editMode||(this._reconcileInstanceRegistration(),this.hass&&this._config?.template&&(this._templateFetched||(this._templateFetched=!0,this._fetchTemplate(this._config.template),this._subscribeTemplateEvents())))}_isEditorPreview(){return!!this.closest("hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor")}_editorPlace(){return this.editMode&&this.parentElement?.classList.contains("card-host")?"canvas":this._isEditorPreview()?"card-editor":this.preview||this.editMode?"dashboard-edit":void 0}_cancelPendingRegister(){void 0!==this._pendingRegisterTimer&&(window.clearTimeout(this._pendingRegisterTimer),this._pendingRegisterTimer=void 0)}_reconcileInstanceRegistration(){if(!this.hass||this.editMode)return;const e=this.isConnected&&!!this._config?.template&&!this._isEditorPreview()?this._config.template:void 0;if(e!==this._registeredTemplate||void 0!==this._pendingRegisterTimer){if(this._cancelPendingRegister(),this._registeredTemplate&&this._registeredTemplate!==e){const e=this._registeredTemplate;this._registeredTemplate=void 0,this.hass.callWS({type:"magic_card_utils/unregister_card_instance",name:e,card_id:this._cardInstanceId}).catch(()=>{})}e&&this._registeredTemplate!==e&&(this._pendingRegisterTimer=window.setTimeout(()=>{if(this._pendingRegisterTimer=void 0,!this.hass)return;if(!this.isConnected)return;if(this._isEditorPreview())return;(this._config?.template||void 0)===e&&this._registeredTemplate!==e&&(this._registeredTemplate=e,this.hass.callWS({type:"magic_card_utils/register_card_instance",name:e,card_id:this._cardInstanceId}).catch(()=>{}))},nn._REGISTER_DEBOUNCE_MS))}}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mc-request-update",this._boundRequestUpdate),this.removeEventListener("pointerdown",this._onTapAnimations),this._templates.hostDisconnected(),this._subscriptions.hostDisconnected(),this._media.hostDisconnected(),this._syncTicker();for(const e of this._pendingTimers)window.clearTimeout(e);this._pendingTimers.clear(),this._holdTimers=new WeakMap,this._tapTimers=new WeakMap,this._downAt=new WeakMap,this._unsubTemplateEvents?.(),this._unsubTemplateEvents=void 0,this._unsubLibrary?.(),this._unsubLibrary=void 0,(0,an.D5)(this._sequences);const e=(0,U.PT)();for(const t of this._v2Applied)e?.release(t);this._v2Applied=new Set;for(const e of this._pApplied)X()?.release(e);this._pApplied=new Set,this._cancelPendingRegister(),this._reconcileInstanceRegistration()}async _fetchTemplate(e){if(this.hass&&this._config)try{const t=await this.hass.callWS({type:"magic_card_utils/get_templates"}),i=t.templates?.[e];i&&this._config?.template===e&&(this._templateConfig=i.config,this._resolvedConfig=fn((0,Ai.e5)(this._templateConfig,this._config)))}catch(t){console.warn("Magic Card: Failed to fetch template",e,t)}}_subscribeTemplateEvents(){!this._unsubTemplateEvents&&this.hass&&this.hass.connection.subscribeEvents(e=>{this._config?.template&&e.data.name===this._config.template&&this._fetchTemplate(this._config.template)},"magic_card_utils_template_updated").then(e=>{this._unsubTemplateEvents=e})}render(){return this._customRendered=!1,this._v2Render=[],this._v2Need=!1,this._pNeed=!1,this._templates.begin(),this._subscriptions.begin(),this._media.begin(),this._renderContext.editMode=this.editMode,this._renderContext.preview=this.editMode||this.preview||this._isEditorPreview(),this._pathStack=[],this._hoverRules=new Map,(0,Wi.c)(this._renderContext,()=>this._renderCard())}_renderCard(){const e=this._resolvedConfig??this._config;if(!e)return r.qy`<ha-card><div class="mc-error">No configuration</div></ha-card>`;(0,Bi.E$)((0,Bi.Wb)(e));const t=this._popup.isPopup();this.toggleAttribute("data-mc-popup-hidden",this._popup.hidden),this.toggleAttribute("data-mc-popup-editor",t&&!this._popup.hidden);const i=`${this._renderContext.instance}-popup-title`;if(this._popup.hidden&&!this._popup.isOpen)return this._popup.renderDialog(r.s6,"",i);if(!this.editMode&&e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return this._popup.hidden?this._popup.renderDialog(r.s6,"",i):r.qy``;const n=this._resolveCardAppearance(e),s=this._buildCardStyle(n),a=(0,v.WC)({animations:n.animations},void 0,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),o=this._v2(a),l=this._buildThemeStyle(n),c=tt(n),d=(0,Fe.JA)(n.ring,{states:this.hass?.states,clipped:!0,shaped:!!c}),u=c?n.box_shadow?(0,H.a7)(n.box_shadow):this._themeShadow:void 0;this._readThemeShadow=!!c&&!n.box_shadow;const p=[l,n.border_radius&&`border-radius: ${n.border_radius}`,a?.style,c&&"border-color: transparent; box-shadow: none"].filter(Boolean).join("; "),h=this._seasonal.resolve(),m=!!this.hass?.themes?.darkMode,f={shape:c,seed:this._seasonal.seed(e),dark:m},g=Qt(a,h),y=n.padding||"var(--mc-padding)",b=c?[s,(0,H.DA)(void 0,y,g)].filter(Boolean).join("; "):[s,g&&(0,H.AT)(void 0,y,{min:g})].filter(Boolean).join("; "),w=this._resolveFlows(n),x=(0,lt.Ih)(n.value_background,{hass:this.hass}),_=c?(0,Fe.JA)(n.ring,{states:this.hass?.states,clipped:!0,shaped:!1}):d,$=!!h&&(0,ne.bO)(h.scenes)||Gt(a),k=(t=c)=>{this._seasonalBudget.begin();const i=h?this._seasonalBudget.own(h.scenes,h.intensity):void 0,n={...f,grant:i};return r.qy`${Kt(h,"back",{...n,shape:t})}${e.rows.map((e,t)=>this._renderRow(e,t))}${Jt(a,t,f.seed,m,this._seasonalBudget)}${Kt(h,"front",n)}${w?r.qy`<mc-flows .flows=${w} .selected=${this.editMode?this.selectedFlow:void 0}
            ?dark=${m}></mc-flows>`:r.s6}`},M=this._popup.hidden?r.s6:Zt(r.qy`
          <ha-card style=${p||r.s6} data-mc-anim=${a?.targets??r.s6}
            data-mc-tap=${a?.tap?"":r.s6} data-mc-seq=${a?.seq??r.s6} data-mc-ring=${d?"":r.s6} data-mc-shape=${c?.kind??r.s6} data-mc-run=${a?.run??r.s6} data-mc-v2=${o??r.s6}>
            <div class="mc-card-content" style=${b} data-mc-anim-fx=${a?.fx.length?"":r.s6}
              data-mc-hover=${this._hover("card",n.hover,c?{shape:{padding:n.padding||"var(--mc-padding)",card:!0}}:void 0)}
              data-mc-flows=${w?"":r.s6} data-mc-value-bg=${x?"":r.s6} data-mc-seasonal=${h?"":r.s6} data-mc-flash=${$?"":r.s6}>
              ${k()}${Yt(x,this.hass)}
            </div>${Vt(c,c?hn:void 0,g)}${Ut(d,c)}
          </ha-card>
        `,u,!!c);if(!t)return M;const S=(0,H.Q6)(s),C=e=>e.slice(0,e.indexOf(":")).trim().toLowerCase(),T=e=>/^(background(-[a-z-]+)?|box-shadow)$/.test(C(e)),A=[l,a?.style,...S.filter(T)].filter(Boolean).join("; "),E=[...S.filter(e=>!T(e)&&"border-radius"!==C(e)),g&&(0,H.AT)(void 0,y,{min:g})].filter(Boolean).join("; "),P=this._popup.isOpen?r.qy`
          <ha-card class="mc-popup-surface" tabindex="-1" style=${A||r.s6}
            data-mc-anim=${a?.targets??r.s6} data-mc-tap=${a?.tap?"":r.s6} data-mc-seq=${a?.seq??r.s6} data-mc-ring=${_?"":r.s6} data-mc-run=${a?.run??r.s6} data-mc-v2=${o??r.s6}>
            ${this._popup.renderHead(i)}
            <div class="mc-popup-body">
              <div class="mc-card-content" style=${E} data-mc-anim-fx=${a?.fx.length?"":r.s6}
                data-mc-hover=${this._hover("popup",n.hover)}
                data-mc-flows=${w?"":r.s6} data-mc-seasonal=${h?"":r.s6}
                data-mc-flash=${$?"":r.s6}>${k(void 0)}</div>
            </div>${Ut(_)}
          </ha-card>
        `:r.s6,z=e.popup?.title?.trim()||e.name||"Pop-up",L=this._popup.renderDialog(P,z,i,n.border_radius);if(this._popup.hidden)return L;const O=this._popup.popupId();return r.qy`
      <div class="mc-popup-badge" aria-hidden="true">
        <ha-icon icon="mdi:dock-window"></ha-icon>Pop-up${O?r.qy` · #${O}`:r.s6}
      </div>
      ${M}${L}
    `}_resolveFlows(e){if(!Array.isArray(e.flows)||!e.flows.length)return;const t=(0,Si.kc)(this._resolvedConfig??this._config??e),i=(0,Si.rP)(e.flows),n=e.flows.map((e,t)=>[e,t]).filter(([e])=>e&&"object"==typeof e).map(([e,n])=>{const s=(0,Si.pv)(e,this.hass,t.get(e.from),n);if(s.id=i[n],s.labelTemplate){const e=(0,Oi.L3)(s.labelTemplate)?"ok"===this._templates.get(s.labelTemplate).status?this._templateText(s.labelTemplate):"":s.labelTemplate;e&&(s.label=e)}return s});return n.length?n:void 0}_templateText(e){if(!(0,Oi.L3)(e))return e;const t=this._templates.get(e);return"ok"===t.status?(0,Oi.C3)(t.result):"unavailable"===t.status?e:""}_resolveCardAppearance(e){const t=e.conditional_appearance;if(!t?.length)return e;let i=e;for(const e of t){if(!e||!zi.g.ruleMatches(e,this.hass))continue;const t=e.overrides||{},n={};for(const[e,i]of Object.entries(t))void 0!==i&&""!==i&&null!==i&&(n[e]=i);i={...i,...n}}return i}_buildThemeStyle(e){if(!this.hass)return"";if(!1!==e.use_page_theme)return"";const t=e.theme||this.hass.themes?.default_theme;if(!t)return"";const i=this.hass.themes?.themes?.[t];return i?Object.entries(i).map(([e,t])=>`${e.startsWith("--")?e:`--${e}`}: ${String(t)}`).join("; "):""}_buildCardStyle(e){const t=[];e.padding&&t.push(`padding: ${e.padding}`);const i=[],n=e.background_image?(0,Di.zi)(this.hass,e.background_image):"";n&&i.push(n),e.background&&i.push(e.background),i.length>0&&t.push(`background: ${i.join(" ")}`),n&&(t.push("background-size: cover"),t.push("background-position: center"),t.push("background-repeat: no-repeat")),e.border_radius&&t.push(`border-radius: ${e.border_radius}`),e.box_shadow&&t.push(`box-shadow: ${e.box_shadow}`),e.card_height&&t.push(`min-height: ${e.card_height}`),e.overflow&&t.push(`overflow: ${e.overflow}`);const s="string"==typeof e.css?e.css.trim().replace(/[;\s]+$/,""):"";return s&&t.push(s),t.join("; ")}_isHidden({hidden:e,display:t}){return!!e||!!t?.conditions?.length&&!this._evaluateDisplay(t)}_renderRow(e,t){const i=this._isHidden(e);if(i&&!this.editMode)return r.qy``;const n=`grid-template-columns: ${(0,J.$t)(e,"1")}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,s=(0,H.Rn)(e.design,this.hass),a=(0,H.zg)(s),o=(0,v.WC)(s,void 0,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),{shape:l,border:c,stroke:d,shadow:u,style:p,edge:h}=mn(s,e.padding,Qt(o)),m=(0,Fe.JA)(s?.ring,{states:this.hass?.states,clipped:!!l,shaped:!!l}),f=(0,lt.Ih)(s?.value_background,{hass:this.hass}),g={actions:e.actions},y=!this.editMode&&cn(e.actions),b=e=>!this._isRowControlEvent(e);return Zt(r.qy`
      <div
        class="mc-row"
        data-mc-row-actions=${y?"":r.s6}
        @pointerdown=${y?e=>b(e)&&this._onPointerDown(e,g):r.s6}
        @pointerup=${y?e=>b(e)&&this._onPointerUp(e,g):r.s6}
        @pointermove=${y?e=>this._onPointerMove(e):r.s6}
        @pointercancel=${y?e=>this._onPointerCancel(e):r.s6}
        @pointerleave=${y?e=>this._onPointerCancel(e):r.s6}
        @keydown=${y?e=>e.composedPath()[0]===e.currentTarget&&this._onKeyDown(e,g):r.s6}
        data-mc-row=${this.editMode?t:r.s6}
        data-mc-hover=${this._hover(`row-${t}`,s?.hover,{shape:l&&{design:s,padding:e.padding},borderLength:c})}
        data-mc-hidden=${this.editMode&&i?"":r.s6}
        data-mc-anim=${o?.targets??r.s6}
        data-mc-tap=${o?.tap?"":r.s6} data-mc-seq=${o?.seq??r.s6} data-mc-run=${o?.run??r.s6} data-mc-v2=${this._v2(o)??r.s6}
        data-mc-anim-fx=${o?.fx.length?"":r.s6}
        data-mc-flash=${Gt(o)?"":r.s6}
        data-mc-border-fx=${c?"":r.s6}
        data-mc-ring=${m?"":r.s6}
        data-mc-shape=${l?.kind??r.s6}
        data-mc-value-bg=${f?"":r.s6}
        style="${n}; ${a}${[o?.style,c?.style,p].filter(Boolean).map(e=>`; ${e}`).join("")}"
      >
        ${e.columns.map((e,i)=>this._renderColumn(e,t,i))}${Yt(f,this.hass)}${Jt(o,l,e.id,this._dark,this._seasonalBudget)}${Ht(c)}${Vt(l,d,h)}${Ut(m,l)}
      </div>
    `,u)}_renderColumn(e,t,i,n){const a=this._isHidden(e);if(a&&!this.editMode)return r.qy``;const o=`gap: ${e.gap||(void 0===n?"8px":s.Kd)}${e.padding?`; padding: ${e.padding}`:""}`,l=(0,H.Rn)(e.design,this.hass),c=(0,H.zg)(l),d=(0,v.WC)(l,void 0,{allowIcon:!1,states:this.hass?.states,custom:this._customLookup}),{shape:u,border:p,stroke:h,shadow:m,style:f,edge:g}=mn(l,e.padding,Qt(d)),y=(0,Fe.JA)(l?.ring,{states:this.hass?.states,clipped:!!u,shaped:!!u}),b=(0,lt.Ih)(l?.value_background,{hass:this.hass}),w=void 0===n?`${t}.${i}`:`${n}#${i}`;return Zt(r.qy`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||r.s6}
        data-mc-col=${this.editMode&&void 0===n?w:r.s6}
        data-mc-slot=${this.editMode&&void 0!==n?w:r.s6}
        data-mc-hover=${this._hover(`col-${w}`,l?.hover,{shape:u&&{design:l,padding:e.padding},borderLength:p})}
        data-mc-empty=${this.editMode&&!e.modules?.length?"":r.s6}
        data-mc-hidden=${this.editMode&&a?"":r.s6}
        data-mc-anim=${d?.targets??r.s6}
        data-mc-tap=${d?.tap?"":r.s6} data-mc-seq=${d?.seq??r.s6} data-mc-run=${d?.run??r.s6} data-mc-v2=${this._v2(d)??r.s6}
        data-mc-anim-fx=${d?.fx.length?"":r.s6}
        data-mc-flash=${Gt(d)?"":r.s6}
        data-mc-border-fx=${p?"":r.s6}
        data-mc-ring=${y?"":r.s6}
        data-mc-shape=${u?.kind??r.s6}
        data-mc-value-bg=${b?"":r.s6}
        style="${o}; ${c}${[d?.style,p?.style,f].filter(Boolean).map(e=>`; ${e}`).join("")}"
      >
        ${(e.modules||[]).map((e,t)=>this._renderModule(e,void 0===n?`${w}.${t}`:`${n}/${i}.${t}`))}${Yt(b,this.hass)}${Jt(d,u,e.id??w,this._dark,this._seasonalBudget)}${Ht(p)}${Vt(u,h,g)}${Ut(y,u)}
      </div>
    `,m)}_renderModule(e,t){const i=this._isHidden(e);if(i&&!this.editMode)return r.qy``;const n=(0,H.Rn)(e.design,this.hass,e.entity),s=e.entity?this.hass?.states[e.entity]:void 0,a=(0,v.WC)(n,s,{states:this.hass?.states,custom:this._customLookup}),o=this._v2(a,s,e.entity),{shape:l,border:c,stroke:d,shadow:u,style:p,edge:h}=mn(n,void 0,Qt(a)),m=(0,Fe.JA)(n?.ring,{states:this.hass?.states,defaultEntity:e.entity,clipped:!!l,shaped:!!l}),f=(0,lt.Ih)(n?.value_background,{hass:this.hass,entity:e.entity}),g=s&&(0,H.th)(n)?(0,Ti.id)(s):void 0,y=[(0,H.zg)(n),a?.style,c?.style,p,g&&`--mc-entity-color: ${g}`].filter(Boolean).join("; "),b=e.actions,w=e,x=!this.editMode&&cn(b,e.entity);this._pathStack.push(t);const _=this._renderContext,$=_.iconRig;let k;_.iconRig=a?.v2?.filter(e=>void 0!==e.hints.rig).pop()?.hints.rig;try{k=Hi(e,this.hass)}finally{this._pathStack.pop(),_.iconRig=$}return Zt(r.qy`
      <div
        class="mc-module-wrapper ${x?"mc-hoverable":""}"
        role=${x?"button":r.s6}
        tabindex=${x?0:r.s6}
        aria-label=${x?this._getActionLabel(w):r.s6}
        data-mc-path=${this.editMode?t:r.s6}
        data-mc-hover=${this._hover(`mod-${t}`,n?.hover,{shape:l&&{design:n},borderLength:c})}
        data-mc-id=${e.id||r.s6}
        data-mc-hidden=${this.editMode&&i?"":r.s6}
        data-mc-anim=${a?.targets??r.s6}
        data-mc-tap=${a?.tap?"":r.s6} data-mc-seq=${a?.seq??r.s6}
        data-mc-run=${a?.run??r.s6} data-mc-v2=${o??r.s6}
        data-mc-anim-fx=${a?.fx.length?"":r.s6}
        data-mc-flash=${Gt(a)?"":r.s6}
        data-mc-border-fx=${c?"":r.s6}
        data-mc-ring=${m?"":r.s6}
        data-mc-shape=${l?.kind??r.s6}
        data-mc-value-bg=${f?"":r.s6}
        style=${y}
        @pointerdown=${x?e=>this._onPointerDown(e,w):r.s6}
        @pointerup=${x?e=>this._onPointerUp(e,w):r.s6}
        @pointermove=${x?e=>this._onPointerMove(e):r.s6}
        @pointercancel=${x?e=>this._onPointerCancel(e):r.s6}
        @pointerleave=${x?e=>this._onPointerCancel(e):r.s6}
        @contextmenu=${x?e=>e.preventDefault():r.s6}
        @keydown=${x?e=>this._onKeyDown(e,w):r.s6}
      >
        ${k}${Yt(f,this.hass)}${Jt(a,l,e.id,this._dark,this._seasonalBudget)}${Ht(c)}${Vt(l,d,h)}${Ut(m,l)}
      </div>
    `,u)}_v2(e,t,i){return e?.needsRuntime&&(this._v2Need=!0),e?.needsParticles&&(this._pNeed=!0),e?.v2?this._v2Render.push({entries:e.v2,stateObj:t,entityId:i})-1:void 0}_syncRuntime(){const e=this._v2Render,t=(0,U.PT)();if(!t)return void(this._v2Need&&!this._v2Waiting&&(this._v2Waiting=!0,(0,U.BR)().then(e=>{this._v2Waiting=!1,e&&this.isConnected&&this.requestUpdate()})));const i=this.renderRoot,n="function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=e=>sn.iG.get(e)??(0,sn.n6)(this._resolvedConfig??this._config)?.get(e),r=new Set;for(const a of i.querySelectorAll("[data-mc-v2]")){const o=e[Number(a.dataset.mcV2)];if(o){r.add(a);for(const e of o.entries){const r=void 0!==e.entityId;t.apply(a,e.v2,{hass:this.hass,stateObj:r?e.stateObj:o.stateObj,entityId:r?e.entityId:o.entityId,reducedMotion:n,shadowRoot:i,run:e.run,timing:e.timing,icon:e.icon,lookup:s})}t.commit(a,o.entries.map(e=>e.run))}}for(const e of this._v2Applied)r.has(e)||(e.isConnected&&this.renderRoot.contains(e)?t.commit(e,[]):t.release(e));this._v2Applied=r}_syncParticles(){const e=X();if(!e)return void(Z??=i.e(300).then(()=>i(2952)).then(e=>((0,V.E0)(e.compile,e.validateSim),Y=e.particles),e=>{console.warn("Magic Card: magic-card-particles.js did not load",e)}),Z).then(e=>e&&this.isConnected&&this.requestUpdate());const t=(0,an.VN)(),n=new Set;for(const i of this.renderRoot.querySelectorAll(".mc-anim-fx[data-p]")){const s=i.mcSim,r=i.parentElement;n.add(i),e.apply(i,{...s,reducedMotion:t,useCss:(e,t)=>(0,rn.XF)(e.startsWith("mcc-")?s.docId+e.slice(e.lastIndexOf("-g")):e,e,t),content:()=>"icon"===s.spec.sim.colliders.content?[...r.querySelectorAll(".mc-anim-icon")].find(e=>e.closest(".mc-module-wrapper")===r):r.querySelector(":scope>:not([aria-hidden])")??void 0}),i.dataset.fx.endsWith("-g0")&&((0,V.dm)(s.docId),this.requestUpdate())}for(const t of this._pApplied)n.has(t)||e.release(t);this._pApplied=n}get _dark(){return!!this.hass?.themes?.darkMode}_hover(e,t,i){if(!t)return r.s6;const n=(0,H.VR)(e,t,i);return n?(this._hoverRules.set(e,n),e):r.s6}_syncHoverStyles(){const e=this.renderRoot;if(!e)return;const t=this._hoverRules.size?[...this._hoverRules.values(),"@media (prefers-reduced-motion: reduce) { [data-mc-hover] { transition: none !important; } }"].join(" "):"";let i=this._hoverStyleEl;t?(i&&i.getRootNode()===e||(i=document.createElement("style"),i.setAttribute("data-mc-hover-styles",""),e.prepend(i),this._hoverStyleEl=i),i.textContent!==t&&(i.textContent=t)):i&&i.textContent&&(i.textContent="")}_syncRowFocus(){for(const e of this.renderRoot.querySelectorAll(".mc-row")){const t=e.hasAttribute("data-mc-row-actions")&&!e.querySelector(un);t&&"0"!==e.getAttribute("tabindex")?e.setAttribute("tabindex","0"):!t&&e.hasAttribute("tabindex")&&e.removeAttribute("tabindex")}}_isRowControlEvent(e){const t=e.currentTarget;for(const i of e.composedPath()){if(i===t)return!1;if(i instanceof Element&&i.matches(dn))return!0}return!1}_getActionLabel(e){const t=e.label||e.name;return t?`Activate ${t}`:`Activate ${e.type} module`}_onPointerDown(e,t){if(this._claimed.has(e))return;this._claimed.add(e);const i=e.currentTarget;this._downAt.set(i,{x:e.clientX,y:e.clientY});const n=this._timer(()=>{this._holdTimers.delete(i),this._handleAction(e,t,"hold")},500);this._holdTimers.set(i,n)}_onPointerMove(e){const t=e.currentTarget,i=this._downAt.get(t);i&&this._holdTimers.has(t)&&Math.hypot(e.clientX-i.x,e.clientY-i.y)>10&&this._onPointerCancel(e)}_onPointerUp(e,t){if(this._claimed.has(e))return;this._claimed.add(e);const i=e.currentTarget,n=this._downAt.get(i);if(this._downAt.delete(i),n&&Math.hypot(e.clientX-n.x,e.clientY-n.y)>10)return void this._onPointerCancel(e);const s=this._holdTimers.get(i);void 0!==s&&(this._clearTimer(s),this._holdTimers.delete(i),this._onTap(e,t,i))}_onTap(e,t,i){const n=t.actions?.double_tap_action;if(!n||"none"===n.action)return void this._handleAction(e,t,"tap");const s=this._tapTimers.get(i);if(void 0!==s)return this._clearTimer(s),this._tapTimers.delete(i),void this._handleAction(e,t,"double_tap");this._tapTimers.set(i,this._timer(()=>{this._tapTimers.delete(i),this._handleAction(e,t,"tap")},nn._DOUBLE_TAP_MS))}_timer(e,t){const i=window.setTimeout(()=>{this._pendingTimers.delete(i),e()},t);return this._pendingTimers.add(i),i}_clearTimer(e){window.clearTimeout(e),this._pendingTimers.delete(e)}_onPointerCancel(e){const t=e.currentTarget,i=this._holdTimers.get(t);void 0!==i&&(this._clearTimer(i),this._holdTimers.delete(t)),this._downAt.delete(t)}_onKeyDown(e,t){if(!this._claimed.has(e)&&("Enter"===e.key||" "===e.key)){if(this._claimed.add(e),e.preventDefault(),e.ctrlKey||e.metaKey)return void this._handleAction(e,t,"double_tap");if(e.shiftKey)return void this._handleAction(e,t,"hold");this._handleAction(e,t,"tap")}}_evaluateDisplay(e){return zi.g.evaluate(e,this.hass)}_handleAction(e,t,i){const n=`${i}_action`,s=t.actions?.[n];if(!s||"none"===s.action)return;s.haptic&&this.dispatchEvent(new CustomEvent("haptic",{bubbles:!0,composed:!0,detail:s.haptic}));const r=!1!==s.use_module_entity?s.entity||t.entity:s.entity;switch(s.action){case"more-info":r&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:r}}));break;case"toggle":r&&this.hass&&(0,Ui.Bw)(this.hass,(0,Ui.H3)(this.hass,r));break;case"navigate":s.navigation_path&&(history.pushState(null,"",s.navigation_path),window.dispatchEvent(new Event("location-changed",{bubbles:!0,composed:!0})));break;case"url":if(s.url_path)try{const e=new URL(s.url_path,window.location.href);"http:"===e.protocol||"https:"===e.protocol?window.open(e.href,"_blank","noopener,noreferrer"):console.warn("Magic Card: Blocked unsafe URL protocol:",e.protocol)}catch{console.warn("Magic Card: Invalid URL:",s.url_path)}break;case"perform-action":if(s.service){const[e,t]=s.service.split(".");this.hass?.callService(e,t,{...s.data,...s.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}));break;case"popup":(0,Qi.R)(s.hash);break;case"close-popup":Qi.P.closeOpen();break;case"fire-dom-event":this.dispatchEvent(new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:s.data||{}}))}}};gn.styles=F,gn._DOUBLE_TAP_MS=250,gn._REGISTER_DEBOUNCE_MS=1500,on([(0,a.MZ)({attribute:!1})],gn.prototype,"hass",void 0),on([(0,a.MZ)({attribute:!1})],gn.prototype,"editMode",void 0),on([(0,a.MZ)({attribute:!1})],gn.prototype,"preview",void 0),on([(0,a.MZ)({attribute:!1})],gn.prototype,"selectedPath",void 0),on([(0,a.MZ)({attribute:!1})],gn.prototype,"selectedFlow",void 0),on([(0,a.wk)()],gn.prototype,"_config",void 0),on([(0,a.wk)()],gn.prototype,"_resolvedConfig",void 0),on([(0,a.wk)()],gn.prototype,"_themeShadow",void 0),gn=nn=on([(0,a.EM)(s.Mp)],gn);var yn=i(866),vn=i(7945);function bn(e,t){const i=e.formatEntityName,n=i?.(t)||t.attributes.friendly_name;return"string"==typeof n&&n?n:t.entity_id}class wn extends yn.l{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:(0,G.$)("text"),type:"text",text:"Hello World"}}renderPreview(e,t){const i=e;return i.use_entity&&i.entity?r.qy`<div class="mc-module mc-text" data-mc-part="name">${this._entityText(i,t)}</div>`:i.use_template?r.qy`<div class="mc-module mc-text" data-mc-part="name">${this._templateText(i)}</div>`:r.qy`<div class="mc-module mc-text" data-mc-part="name">${i.text||""}</div>`}_templateText(e){const t=void 0===e.text||null===e.text?"":String(e.text),i=(0,Wi.V)();if(!i||!(0,Oi.L3)(t))return t;const n=i.template(t);switch(n.status){case"ok":return(0,Oi.C3)(n.result);case"pending":return"";case"error":return r.qy`<span class="mc-template-error" role="alert" title=${n.error}>Template error: ${n.error}</span>`;default:return t}}_entityText(e,t){const i=e.entity,n=t?.states?.[i];if(!t||!n)return r.qy`${i} <span class="mc-text-muted">unavailable</span>`;const s=e.entity_display||"state";if("name"===s)return bn(t,n);if("remaining"===s&&!e.attribute&&void 0!==(0,He.HF)(n))return r.qy`<span class="mc-text-countdown">${(0,vn.q)(n)}</span>`;const a=function(e,t,i){if(i){const n=e.formatEntityAttributeValue?.(t,i);return n??String(t.attributes[i]??"")}const n=e.formatEntityState?.(t);if(void 0!==n)return n;const s=t.attributes.unit_of_measurement;return`${t.state}${s?` ${String(s)}`:""}`}(t,n,e.attribute);return"name_state"===s?`${bn(t,n)}: ${a}`:a}hints(e){const t=e;return t.use_entity?t.entity?[]:["Entity is required"]:t.text?[]:[t.use_template?"Template is required":"Text content is required"]}}Ei.s.register(new wn);var xn=i(3884);class _n extends yn.l{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:(0,G.$)("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const i=e,n=i.icon||"mdi:help",s=(0,xn.s)({icon:n,entity:i.entity,hass:t,useEntityIcon:i.use_entity_icon,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:help"}),a=(i.use_entity_color&&i.entity?(0,Ti.id)(t?.states[i.entity]):void 0)||i.icon_color||"inherit";return r.qy`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${a}">
        ${s}
      </div>
    `}}Ei.s.register(new _n);i(1103);var $n=i(7804);class kn extends $n.WL{constructor(e){if(super(e),e.type!==$n.OA.ATTRIBUTE)throw new Error("stableSrc is an attribute directive")}render(e){return e}update(e,[t]){const i=e.element.getAttribute(e.name);return i&&t&&i!==t&&(0,ji.RW)(i,t)&&((n=e.element)instanceof HTMLImageElement?n.complete&&n.naturalWidth>0:n instanceof HTMLMediaElement&&n.readyState>0&&!n.error)?r.c0:t;var n}}const Mn=(0,$n.u$)(kn),Sn=/^(?:\/|https?:\/\/|data:image\/)/i,Cn=e=>{const t=e.target;t.parentElement?.classList.add("mc-image--broken");const i=t.dataset.mcMedia;i&&(0,ji.By)(i)},Tn=e=>e.target.parentElement?.classList.remove("mc-image--broken");class An extends yn.l{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image-outline"}}createDefault(){return{id:(0,G.$)("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}imageSource(e,t){const i=e.entity&&t?t.states[e.entity]:void 0;let n="";if(i&&e.attribute){const t=i.attributes[e.attribute];"string"==typeof t&&Sn.test(t.trim())&&(n=t.trim())}if(!n&&e.entity_picture){const e=i?.attributes.entity_picture;"string"==typeof e&&(n=e)}else if(!n)return(0,Di.F9)(t,e.image);return(0,Di.aN)(t,n)}renderPreview(e,t){const i=e,n=this.imageSource(i,t),s=n&&n===(0,Di.F9)(t,i.image)?(0,ji.fk)(i.image):void 0,a=["contain","cover","fill","none"].includes(i.fit)?i.fit:"cover";return r.qy`
      <div class="mc-module mc-image" style="aspect-ratio: ${(0,Di.XK)(i.aspect_ratio)};">
        ${n?r.qy`<img src=${Mn(n)} data-mc-media=${s??r.s6} style="object-fit: ${a};" alt="" @error=${Cn} @load=${Tn} /><div
                class="mc-image-fallback mc-image-error"><ha-icon icon="mdi:image-off"></ha-icon></div>`:r.qy`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}hints(e){const t=e;return t.entity_picture&&!t.entity?["Entity is required when using entity picture"]:[]}}Ei.s.register(new An);var En=i(68);function Pn(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var zn={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};function Ln(e){zn=e}var On={exec:()=>null};function qn(e){let t=[];return i=>{let n=Math.max(0,Math.min(3,i-1)),s=t[n];return s||(s=e(n),t[n]=s),s}}function Rn(e,t=""){let i="string"==typeof e?e:e.source,n={replace:(e,t)=>{let s="string"==typeof t?t:t.source;return s=s.replace(In.caret,"$1"),i=i.replace(e,s),n},getRegex:()=>new RegExp(i,t)};return n}var Nn=((e="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+e)}catch{return!1}})(),In={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/,numericCharacterReferenceOrAmpersand:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:e=>new RegExp(`^( {0,3}${e})((?:[\t ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:qn(e=>new RegExp(`^ {0,${e}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`)),hrRegex:qn(e=>new RegExp(`^ {0,${e}}((?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\\*[ \t]*){3,})(?:\\n+|$)`)),fencesBeginRegex:qn(e=>new RegExp(`^ {0,${e}}(?:\`\`\`|~~~)`)),headingBeginRegex:qn(e=>new RegExp(`^ {0,${e}}#`)),htmlBeginRegex:qn(e=>new RegExp(`^ {0,${e}}(?:</?(?:${Vn})(?: +|$|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)`,"i")),blockquoteBeginRegex:qn(e=>new RegExp(`^ {0,${e}}>`))},jn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Dn=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Bn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,Wn=Rn(Bn).replace(/bull/g,Dn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Fn=Rn(Bn).replace(/bull/g,Dn).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Hn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Gn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Jn=Rn(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Gn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Un=Rn(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Dn).getRegex(),Vn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Zn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Yn=Rn("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!(?:script|pre|style|textarea)(?![a-z0-9-]))([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$))","i").replace("comment",Zn).replace("tag",Vn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Xn=e=>Rn(Hn).replace("hr",jn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",e).replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Vn).getRegex(),Kn=Xn(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Qn=Xn(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),es={blockquote:Rn(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Qn).getRegex(),code:/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,def:Jn,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,hr:jn,html:Yn,lheading:Wn,list:Un,newline:/^(?:[ \t]*(?:\n|$))+/,paragraph:Kn,table:On,text:/^[^\n]+/},ts=Rn("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",jn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}\t)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Vn).getRegex(),is={...es,lheading:Fn,table:ts,paragraph:Rn(Hn).replace("hr",jn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",ts).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html"," {0,3}(?:</?(?:tag)(?: +|\\n|/?>)|<(?:(?:script|pre|style|textarea)(?:[\\s>]|$)|!--)|<\\?|<![A-Za-z]|<!\\[CDATA\\[)").replace("tag",Vn).getRegex()},ns={...es,html:Rn("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",Zn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:On,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Rn(Hn).replace("hr",jn).replace("heading"," *#{1,6} *[^\n]").replace("lheading",Wn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ss=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,rs=/[\p{P}\p{S}]/u,as=/[\s\p{P}\p{S}]/u,os=/[^\s\p{P}\p{S}]/u,ls=Rn(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,as).getRegex(),cs=/(?!~)[\p{P}\p{S}]/u,ds=Rn(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Nn?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),us=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,ps=Rn(us,"u").replace(/punct/g,rs).getRegex(),hs=Rn(us,"u").replace(/punct/g,cs).getRegex(),ms=Rn(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,"u").replace(/openQuote/g,/[\p{Pi}\p{Ps}"']/u).replace(/punct/g,rs).getRegex(),fs="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",gs=Rn(fs,"gu").replace(/notPunctSpace/g,os).replace(/punctSpace/g,as).replace(/punct/g,rs).getRegex(),ys=Rn(fs,"gu").replace(/notPunctSpace/g,/(?:[^\s\p{P}\p{S}]|~)/u).replace(/punctSpace/g,/(?!~)[\s\p{P}\p{S}]/u).replace(/punct/g,cs).getRegex(),vs=Rn("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,os).replace(/punctSpace/g,as).replace(/punct/g,rs).getRegex(),bs=Rn("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,os).replace(/punctSpace/g,as).replace(/punct/g,rs).getRegex(),ws=Rn("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,os).replace(/punctSpace/g,as).replace(/punct/g,rs).getRegex(),xs=Rn(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,rs).getRegex(),_s=Rn("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,os).replace(/punctSpace/g,as).replace(/punct/g,rs).getRegex(),$s=Rn(/\\(punct)/,"gu").replace(/punct/g,rs).getRegex(),ks=Rn(/(`+)(?:[^`]|[^`][\s\S]*?[^`])\1(?!`)|`+|\\(punct)/,"gu").replace(/punct/g,rs).getRegex(),Ms=Rn(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ss=Rn(Zn).replace("(?:--\x3e|$)","--\x3e").getRegex(),Cs=Rn("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ss).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),Ts=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,As=Rn(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",Ts).getRegex(),Es=Rn(/^!?\[(label)\]\([ \t\n]*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?[ \t\n]*\)/).replace("label",As).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ps=Rn(/^!?\[(label)\]\[(ref)\]/).replace("label",As).replace("ref",Gn).getRegex(),zs=Rn(/^!?\[(ref)\](?:\[\])?/).replace("ref",Gn).getRegex(),Ls=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,Os=Rn(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",Ts).getRegex(),qs=Rn("reflink|nolink(?!\\()","g").replace("reflink",Rn(/^!?\[(label)\]\[(ref)\]/).replace("label",Os).replace("ref",Ls).getRegex()).replace("nolink",Rn(/^!?\[(ref)\](?:\[\])?/).replace("ref",Ls).getRegex()).getRegex(),Rs=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Ns=Rn(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),Is={_backpedal:On,anyPunctuation:$s,anyPunctuationOutsideCode:ks,autolink:Ms,blockSkip:ds,br:ss,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,del:On,delLDelim:On,delRDelim:On,emStrongLDelim:ps,emStrongRDelimAst:gs,emStrongRDelimUnd:bs,escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,link:Es,nolink:zs,punctuation:ls,reflink:Ps,reflinkSearch:qs,tag:Cs,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,url:On},js={...Is,emStrongLDelim:ms,emStrongRDelimAst:vs,emStrongRDelimUnd:ws,link:Rn(/^!?\[(label)\]\((.*?)\)/).replace("label",As).getRegex(),reflink:Rn(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",As).getRegex()},Ds={...Is,emStrongRDelimAst:ys,emStrongLDelim:hs,delLDelim:xs,delRDelim:_s,url:Rn(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",Ns).replace("protocol",Rs).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Rn(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",Rs).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},Bs={...Ds,br:Rn(ss).replace("{2,}","*").getRegex(),text:Rn(Ds.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Ws={normal:es,gfm:is,pedantic:ns},Fs={normal:Is,gfm:Ds,breaks:Bs,pedantic:js},Hs={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Gs=e=>Hs[e];function Js(e,t){if(t){if(In.escapeTest.test(e))return e.replace(In.escapeReplace,Gs)}else if(In.escapeTestNoEncode.test(e))return e.replace(In.escapeReplaceNoEncode,Gs);return e}function Us(e){try{e=encodeURI(e).replace(In.percentDecode,"%")}catch{return null}return e}function Vs(e,t){let i=e.replace(In.findPipe,(e,t,i)=>{let n=!1,s=t;for(;--s>=0&&"\\"===i[s];)n=!n;return n?"|":" |"}).split(In.splitPipe),n=0;if(i[0].trim()||i.shift(),i.length>0&&!i.at(-1)?.trim()&&i.pop(),t)if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;n<i.length;n++)i[n]=i[n].trim().replace(In.slashPipe,"|");return i}function Zs(e,t,i){let n=e.length;if(0===n)return"";let s=0;for(;s<n;){let r=e.charAt(n-s-1);if(r!==t||i){if(r===t||!i)break;s++}else s++}return e.slice(0,n-s)}function Ys(e){let t=e.split("\n"),i=t.length-1;for(;i>=0&&In.blankLine.test(t[i]);)i--;return t.length-i<=2?e:t.slice(0,i+1).join("\n")}function Xs(e){return e.trim().toLowerCase().toUpperCase().toLowerCase()}function Ks(e,t){if(-1===e.indexOf(t[0])&&-1===e.indexOf(t[1]))return-1;let i=0;for(let n=0;n<e.length;n++)if("\\"===e[n])n++;else if(e[n]===t[0])i++;else if(e[n]===t[1]&&(i--,i<0))return n;return i>0?-2:-1}function Qs(e,t=0){let i=t,n="";for(let t of e)if("\t"===t){let e=4-i%4;n+=" ".repeat(e),i+=e}else n+=t,i++;return n}function er(e,t,i,n,s){let r=t.href,a=t.title||null,o=e[1].replace(s.other.outputLinkReplace,"$1"),l="!"===e[0].charAt(0),c=n.state.inLink,d=n.state.linkEmitted,u=n.state.inRawBlock;n.state.inLink=!0,n.state.linkEmitted=!1;let p=n.inlineTokens(o),h=n.state.linkEmitted;if(n.state.linkEmitted=d,n.state.inLink=c,!l){if(h)return void(n.state.inRawBlock=u);n.state.linkEmitted=!0}return{type:l?"image":"link",raw:i,href:r,title:a,text:o,tokens:p}}function tr(e,t,i,n){if(!t.includes("<"))return!1;for(let s=0;s<t.length;s++){if("\\"===t[s]){s++;continue}if("`"===t[s]){let e=n.inline.code.exec(t.slice(s));if(e){s+=e[0].length-1;continue}}if("<"!==t[s])continue;let r=e.slice(i+s),a=n.inline.tag.exec(r)||n.inline.autolink.exec(r);if(a){if(a[0].length>t.length-s)return!0;s+=a[0].length-1}}return!1}var ir=class{options;rules;lexer;constructor(e){this.options=e||zn}space(e){let t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){let t=this.rules.block.code.exec(e);if(t){let e=this.options.pedantic?t[0]:Ys(t[0]),i=e.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e,codeBlockStyle:"indented",text:i}}}fences(e){let t=this.rules.block.fences.exec(e);if(t){let e=t[0],i=function(e,t,i){let n=e.match(i.other.indentCodeCompensation);if(null===n)return t;let s=n[1];return t.split("\n").map(e=>{let t=e.match(i.other.beginningSpace);if(null===t)return e;let[n]=t;return e.slice(Math.min(n.length,s.length))}).join("\n")}(e,t[3]||"",this.rules);return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){let t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(this.rules.other.endingHash.test(e)){let t=Zs(e,"#");(this.options.pedantic||!t||this.rules.other.endingSpaceTabChar.test(t))&&(e=t.trim())}return{type:"heading",raw:Zs(t[0],"\n"),depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){let t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:Zs(t[0],"\n")}}blockquote(e){let t=this.rules.block.blockquote.exec(e);if(t){let e=Zs(t[0],"\n").split("\n"),i="",n="",s=[];for(;e.length>0;){let t,r=!1,a=[];for(t=0;t<e.length;t++)if(this.rules.other.blockquoteStart.test(e[t]))a.push(e[t]),r=!0;else{if(r)break;a.push(e[t])}e=e.slice(t);let o=a.join("\n"),l=o.replace(this.rules.other.blockquoteSetextReplace,"\n    $1").replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}\n${o}`:o,n=n?`${n}\n${l}`:l;let c=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(l,s,!0),this.lexer.state.top=c,0===e.length)break;let d=s.at(-1);if("code"===d?.type||"heading"===d?.type||"hr"===d?.type||"html"===d?.type)break;if("blockquote"===d?.type){let t=d,r=e.join("\n"),a=t.raw+"\n"+r.replace(this.rules.other.blockquoteSetextReplace2,""),o=this.blockquote(a);s[s.length-1]=o;let l=a.substring(o.raw.length).replace(/^\n/,""),c=l?l.split("\n").length:0,u=c?e.slice(0,-c):e;u.length>0&&(i=`${i}\n${u.join("\n")}`),n=n.substring(0,n.length-t.text.length)+o.text;break}if("list"===d?.type){let t=d,r=t.raw+"\n"+e.join("\n"),a=this.list(r);s[s.length-1]=a,i=i.substring(0,i.length-d.raw.length)+a.raw,n=n.substring(0,n.length-t.raw.length)+a.raw,e=r.substring(s.at(-1).raw.length).split("\n");continue}}return{type:"blockquote",raw:i,tokens:s,text:n}}}list(e){let t=this.rules.block.list.exec(e);if(t){let i=e,n=()=>i.length-e.length,s=t[1].trim(),r=s.length>1,a={type:"list",raw:"",ordered:r,start:r?+s.slice(0,-1):"",loose:!1,items:[]};s=r?`\\d{1,9}\\${s.slice(-1)}`:`\\${s}`,this.options.pedantic&&(s=r?s:"[*+-]");let o=this.rules.other.listItemRegex(s),l=!1;for(;e;){let s=!1,r="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;let c=n();e=e.substring(t[0].length);let d=t[2].split("\n",1)[0],u=t[1].length,p=this.options.pedantic?Qs(d,u):d.replace(this.rules.other.leadingSpaceTab,e=>Qs(e,u)),h=e.split("\n",1)[0],m=!p.trim(),f=0;if(this.options.pedantic?(f=2,r=p.trimStart()):m?f=u+1:(f=p.search(this.rules.other.nonSpaceChar),f=f>4?1:f,r=p.slice(f),f+=u),m&&this.rules.other.blankLine.test(h)&&(e=e.substring(h.length+1),s=!0),!s){let t=this.rules.other.nextBulletRegex(f),i=this.rules.other.hrRegex(f),n=this.rules.other.fencesBeginRegex(f),s=this.rules.other.headingBeginRegex(f),a=this.rules.other.htmlBeginRegex(f),o=this.rules.other.blockquoteBeginRegex(f);for(;e;){let l,c=e.split("\n",1)[0];if(h=c,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),l=h):l=h.replace(this.rules.other.leadingSpaceTab,e=>Qs(e)),n.test(h)||s.test(h)||a.test(h)||o.test(h)||t.test(h)||i.test(h))break;if(l.search(this.rules.other.nonSpaceChar)>=f||!h.trim())r+="\n"+l.slice(f);else{if(m||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||n.test(p)||s.test(p)||i.test(p))break;r+="\n"+h}m=!h.trim(),e=e.substring(c.length+1),p=l.slice(f)}}let g=i.slice(c,n());a.loose||(l?a.loose=!0:this.rules.other.doubleBlankLine.test(g)&&(l=!0)),a.items.push({type:"list_item",raw:g,task:!!this.options.gfm&&this.rules.other.listIsTask.test(r),loose:!1,text:r,tokens:[]})}let c=a.items.at(-1);if(!c)return;c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd(),a.raw=i.slice(0,n()).trimEnd();for(let e of a.items)if(this.lexer.state.top=!1,e.tokens=this.lexer.blockTokens(e.text,[]),!a.loose){let t=e.tokens.filter(e=>"space"===e.type),i=t.length>0&&t.some(e=>this.rules.other.anyLine.test(e.raw));a.loose=i}for(let e of a.items){let t=e.tokens[0];if(!e.task||"text"!==t?.type&&"paragraph"!==t?.type)e.task&&(e.task=!1);else{e.text=e.text.replace(this.rules.other.listReplaceTask,""),t.raw=t.raw.replace(this.rules.other.listReplaceTask,""),t.text=t.text.replace(this.rules.other.listReplaceTask,"");for(let e=this.lexer.inlineQueue.length-1;e>=0;e--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[e].src)){this.lexer.inlineQueue[e].src=this.lexer.inlineQueue[e].src.replace(this.rules.other.listReplaceTask,"");break}let i=this.rules.other.listTaskCheckbox.exec(e.raw);if(i){let t={type:"checkbox",raw:i[0]+" ",checked:"[ ]"!==i[0]};e.checked=t.checked,a.loose?e.tokens[0]&&["paragraph","text"].includes(e.tokens[0].type)&&"tokens"in e.tokens[0]&&e.tokens[0].tokens?(e.tokens[0].raw=t.raw+e.tokens[0].raw,e.tokens[0].text=t.raw+e.tokens[0].text,e.tokens[0].tokens.unshift(t)):e.tokens.unshift({type:"paragraph",raw:t.raw,text:t.raw,tokens:[t]}):e.tokens.unshift(t)}}}if(a.loose)for(let e of a.items){e.loose=!0;for(let t of e.tokens)"text"===t.type&&(t.type="paragraph")}return a}}html(e){let t=this.rules.block.html.exec(e);if(t){let e=Ys(t[0]);return{type:"html",block:!0,raw:e,pre:"pre"===t[1]||"script"===t[1]||"style"===t[1],text:e}}}def(e){let t=this.rules.block.def.exec(e);if(t){if(!this.rules.other.startAngleBracket.test(t[2])&&-1!==Ks(t[2],"()"))return;let e=Xs(t[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:e,raw:Zs(t[0],"\n"),href:i,title:n}}}table(e){let t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;let i=Vs(t[1]),n=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=t[3]?.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split("\n"):[],r={type:"table",raw:Zs(t[0],"\n"),header:[],align:[],rows:[]};if(i.length===n.length){for(let e of n)this.rules.other.tableAlignRight.test(e)?r.align.push("right"):this.rules.other.tableAlignCenter.test(e)?r.align.push("center"):this.rules.other.tableAlignLeft.test(e)?r.align.push("left"):r.align.push(null);for(let e=0;e<i.length;e++)r.header.push({text:i[e],tokens:this.lexer.inline(i[e]),header:!0,align:r.align[e]});for(let e of s)r.rows.push(Vs(e,r.header.length).map((e,t)=>({text:e,tokens:this.lexer.inline(e),header:!1,align:r.align[t]})));return r}}lheading(e){let t=this.rules.block.lheading.exec(e);if(t){let e=t[1].trim();return{type:"heading",raw:Zs(t[0],"\n"),depth:"="===t[2].charAt(0)?1:2,text:e,tokens:this.lexer.inline(e)}}}paragraph(e){let t=this.rules.block.paragraph.exec(e);if(t){let e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){let t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){let t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){let t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){if(!1===this.lexer.state.linkParenPossible)return;let t=this.rules.inline.link.exec(e);if(t){let i="!"===t[0].charAt(0)?2:1;if(!this.options.pedantic&&tr(e,t[1],i,this.rules))return;let n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;let e=Zs(n.slice(0,-1),"\\");if((n.length-e.length)%2==0)return}else{let e=Ks(t[2],"()");if(-2===e)return;if(e>-1){let i=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,i).trim(),t[3]=""}}let s=t[2],r="";if(this.options.pedantic){let e=this.rules.other.pedanticHrefTitle.exec(s);e&&(s=e[1],r=e[3])}else r=t[3]?t[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(s=this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?s.slice(1):s.slice(1,-1)),er(t,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let i;if((i=this.rules.inline.reflink.exec(e))||(i=this.rules.inline.nolink.exec(e))){let n="!"===i[0].charAt(0)?2:1;if(!this.options.pedantic&&tr(e,i[1],n,this.rules))return;let s=t[Xs((i[2]||i[1]).replace(this.rules.other.multipleSpaceGlobal," "))];if(!s){let e=i[0].charAt(0);return{type:"text",raw:e,text:e}}return er(i,s,i[0],this.lexer,this.rules)}}emStrong(e,t,i=""){let n=this.rules.inline.emStrongLDelim.exec(e);if(n&&(n[1]||n[2]||n[3]||n[4])&&(!n[4]||!i.match(this.rules.other.unicodeAlphaNumeric))&&(!n[1]&&!n[3]||!i||this.rules.inline.punctuation.exec(i))){let s,r,a=[...n[0]].length-1,o=a,l=0,c=n[0][0],d=i===c,u="*"===c?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+a);null!==(n=u.exec(t));){if(s=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!s)continue;if(r=[...s].length,n[3]||n[4]){o+=r;continue}if(n[5]||n[6]){if(a%3&&!((a+r)%3)){l+=r;continue}if(d)break}if(o-=r,o>0)continue;r=Math.min(r,r+o+l);let t=[...n[0]][0].length,i=e.slice(0,a+n.index+t+r);if(Math.min(a,r)%2){let e=i.slice(1,-1);return{type:"em",raw:i,text:e,tokens:this.lexer.inlineTokens(e)}}let c=i.slice(2,-2);return{type:"strong",raw:i,text:c,tokens:this.lexer.inlineTokens(c)}}}}codespan(e){let t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(e),n=this.rules.other.startingSpaceChar.test(e)&&this.rules.other.endingSpaceChar.test(e);return i&&n&&(e=e.substring(1,e.length-1)),{type:"codespan",raw:t[0],text:e}}}br(e){let t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e,t,i=""){let n=this.rules.inline.delLDelim.exec(e);if(n&&(!n[1]||!i||this.rules.inline.punctuation.exec(i))){let i,s,r=[...n[0]].length-1,a=r,o=this.rules.inline.delRDelim;for(o.lastIndex=0,t=t.slice(-1*e.length+r);null!==(n=o.exec(t));){if(i=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!i||(s=[...i].length,s!==r))continue;if(n[3]||n[4]){a+=s;continue}if(a-=s,a>0)continue;s=Math.min(s,s+a);let t=[...n[0]][0].length,o=e.slice(0,r+n.index+t+s),l=o.slice(r,-r);return{type:"del",raw:o,text:l,tokens:this.lexer.inlineTokens(l)}}}}autolink(e){let t=this.rules.inline.autolink.exec(e);if(t){let e,i;return"@"===t[2]?(e=t[1],i="mailto:"+e):(e=t[1],i=e),{type:"link",raw:t[0],text:e,href:i,autolink:!0,tokens:[{type:"text",raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,i;if("@"===t[2])e=t[0],i="mailto:"+e;else{let n;do{n=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??""}while(n!==t[0]);e=t[0],i="www."===t[1]?"http://"+t[0]:t[0]}return{type:"link",raw:t[0],text:e,href:i,autolink:!0,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e){let t=this.rules.inline.text.exec(e);if(t){let e=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:e?t[0]:(i=t[0],In.numericCharacterReference.test(i)?i.replace(In.numericCharacterReferenceOrAmpersand,(e,t,i)=>{if(void 0===t&&void 0===i)return"&amp;";let n=void 0===t?Number.parseInt(i,16):Number.parseInt(t,10);return 0===n||n>1114111||n>=55296&&n<=57343?"�":38===n?"&amp;":String.fromCodePoint(n)}):i),escaped:e}}var i}},nr=class e{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||zn,this.options.tokenizer=this.options.tokenizer||new ir,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,linkParenPossible:!0,top:!0};let t={other:In,block:Ws.normal,inline:Fs.normal};this.options.pedantic?(t.block=Ws.pedantic,t.inline=Fs.pedantic):this.options.gfm&&(t.block=Ws.gfm,this.options.breaks?t.inline=Fs.breaks:t.inline=Fs.gfm),this.tokenizer.rules=t}static get rules(){return{block:Ws,inline:Fs}}static lex(t,i){return new e(i).lex(t)}static lexInline(t,i){return new e(i).inlineTokens(t)}lex(e){e=e.replace(In.carriageReturn,"\n"),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){let t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],i=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(In.tabCharGlobal,"    ").replace(In.spaceLine,""));let n=1/0;for(;e;){if(!(e.length<n)){this.infiniteLoopError(e.charCodeAt(0));break}let s;if(n=e.length,this.options.extensions?.block?.some(i=>!!(s=i.call({lexer:this},e,t))&&(e=e.substring(s.raw.length),t.push(s),!0)))continue;if(s=this.tokenizer.space(e)){e=e.substring(s.raw.length);let i=t.at(-1);1===s.raw.length&&void 0!==i?i.raw+="\n":t.push(s);continue}if(s=this.tokenizer.code(e)){e=e.substring(s.raw.length);let i=t.at(-1);"paragraph"===i?.type||"text"===i?.type?(i.raw+=(i.raw.endsWith("\n")?"":"\n")+s.raw,i.text+="\n"+s.text,this.inlineQueue.at(-1).src=i.text):t.push(s);continue}if(s=this.tokenizer.fences(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.heading(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.hr(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.blockquote(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.list(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.html(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.def(e)){e=e.substring(s.raw.length);let i=t.at(-1);"paragraph"===i?.type||"text"===i?.type?(i.raw+=(i.raw.endsWith("\n")?"":"\n")+s.raw,i.text+="\n"+s.raw,this.inlineQueue.at(-1).src=i.text):this.tokens.links[s.tag]||(this.tokens.links[s.tag]={href:s.href,title:s.title},t.push(s));continue}if(s=this.tokenizer.table(e)){e=e.substring(s.raw.length),t.push(s);continue}if(s=this.tokenizer.lheading(e)){e=e.substring(s.raw.length),t.push(s);continue}let r=e;if(this.options.extensions?.startBlock){let t,i=1/0,n=e.slice(1);this.options.extensions.startBlock.forEach(e=>{t=e.call({lexer:this},n),"number"==typeof t&&t>=0&&(i=Math.min(i,t))}),i<1/0&&i>=0&&(r=e.substring(0,i+1))}if(this.state.top&&(s=this.tokenizer.paragraph(r))){let n=t.at(-1);i&&"paragraph"===n?.type?(n.raw+=(n.raw.endsWith("\n")?"":"\n")+s.raw,n.text+="\n"+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=n.text):t.push(s),i=r.length!==e.length,e=e.substring(s.raw.length);continue}if(s=this.tokenizer.text(e)){e=e.substring(s.raw.length);let i=t.at(-1);"text"===i?.type?(i.raw+=(i.raw.endsWith("\n")?"":"\n")+s.raw,i.text+="\n"+s.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=i.text):t.push(s);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}linkInText(e){if(!e.includes("["))return!1;let t=this.tokenizer.rules.inline.link;for(let i of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(t.test(i[0])&&"!"!==e.charAt(i.index-1))return!0;for(let t of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let e=t[0],i=e.lastIndexOf("[");if("!"!==e.charAt(0)&&Object.hasOwn(this.tokens.links,Xs(e.slice(i+1,-1)))&&!(i>1&&this.linkInText(e.slice(1,i-1))))return!0}return!1}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let i=this.state.linkParenPossible;this.state.linkParenPossible=i&&e.includes(")");try{return this.#e(e,t)}finally{this.state.linkParenPossible=i}}#e(e,t){let i=e;if(this.tokens.links&&e.includes("[")){let e=this.tokenizer.rules.inline.reflinkSearch,t=i=>{let n=i.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,Xs(i.slice(n+1,-1))))return i;if(n>1&&"!"!==i.charAt(0)){let s=i.slice(1,n-1);if(this.linkInText(s))return"["+s.replace(e,t)+"]["+"a".repeat(i.length-n-2)+"]"}return"["+"a".repeat(i.length-2)+"]"};i=i.replace(e,t)}i=i.replace(this.tokenizer.rules.inline.anyPunctuationOutsideCode,(e,t,i)=>i?"+".repeat(e.length):t?t+e.slice(t.length,-t.length).replace(/`/g,"+")+t:e),i=i.replace(this.tokenizer.rules.inline.blockSkip,(e,t,i)=>{let n=i?i.length:0;return e.slice(0,n)+"["+"a".repeat(e.length-n-2)+"]"}),i=this.options.hooks?.emStrongMask?.call({lexer:this},i)??i;let n=!1,s="",r=1/0;for(;e;){if(!(e.length<r)){this.infiniteLoopError(e.charCodeAt(0));break}let a;if(r=e.length,n||(s=""),n=!1,this.options.extensions?.inline?.some(i=>!!(a=i.call({lexer:this},e,t))&&(e=e.substring(a.raw.length),t.push(a),!0)))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let i=t.at(-1);"text"===a.type&&"text"===i?.type?(i.raw+=a.raw,i.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,i,s)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e,i,s)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let o=e;if(this.options.extensions?.startInline){let t,i=1/0,n=e.slice(1);this.options.extensions.startInline.forEach(e=>{t=e.call({lexer:this},n),"number"==typeof t&&t>=0&&(i=Math.min(i,t))}),i<1/0&&i>=0&&(o=e.substring(0,i+1))}if(a=this.tokenizer.inlineText(o)){e=e.substring(a.raw.length),"_"!==a.raw.slice(-1)&&(s=a.raw.slice(-1)),n=!0;let i=t.at(-1);"text"===i?.type?(i.raw+=a.raw,i.text+=a.text):t.push(a);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t="Infinite loop on byte: "+e;if(!this.options.silent)throw new Error(t);console.error(t)}},sr=class{options;parser;constructor(e){this.options=e||zn}space(e){return""}code({text:e,lang:t,escaped:i}){let n=(t||"").match(In.notSpaceStart)?.[0],s=e?e.replace(In.endingNewline,"")+"\n":"";return n?'<pre><code class="language-'+Js(n)+'">'+(i?s:Js(s,!0))+"</code></pre>\n":"<pre><code>"+(i?s:Js(s,!0))+"</code></pre>\n"}blockquote({tokens:e}){return`<blockquote>\n${this.parser.parse(e)}</blockquote>\n`}html({text:e}){return e}def(e){return""}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>\n`}hr(e){return"<hr>\n"}list(e){let t=e.ordered,i=e.start,n="";for(let t=0;t<e.items.length;t++){let i=e.items[t];n+=this.listitem(i)}let s=t?"ol":"ul";return"<"+s+(t&&1!==i?' start="'+i+'"':"")+">\n"+n+"</"+s+">\n"}listitem(e){return`<li>${this.parser.parse(e.tokens)}</li>\n`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>\n`}table(e){let t="",i="";for(let t=0;t<e.header.length;t++)i+=this.tablecell(e.header[t]);t+=this.tablerow({text:i});let n="";for(let t=0;t<e.rows.length;t++){let s=e.rows[t];i="";for(let e=0;e<s.length;e++)i+=this.tablecell(s[e]);n+=this.tablerow({text:i})}return n&&(n=`<tbody>${n}</tbody>`),"<table>\n<thead>\n"+t+"</thead>\n"+n+"</table>\n"}tablerow({text:e}){return`<tr>\n${e}</tr>\n`}tablecell(e){let t=this.parser.parseInline(e.tokens),i=e.header?"th":"td";return(e.align?`<${i} align="${e.align}">`:`<${i}>`)+t+`</${i}>\n`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${Js(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,text:i,tokens:n,autolink:s}){let r=s?Js(i,!0):this.parser.parseInline(n),a=Us(e);if(null===a)return r;let o='<a href="'+(e=Js(a,s))+'"';return t&&(o+=' title="'+Js(t)+'"'),o+=">"+r+"</a>",o}image({href:e,title:t,text:i,tokens:n}){n&&(i=this.parser.parseInline(n,this.parser.textRenderer));let s=Us(e);if(null===s)return Js(i);let r=`<img src="${Js(e=s)}" alt="${Js(i)}"`;return t&&(r+=` title="${Js(t)}"`),r+=">",r}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:Js(e.text)}},rr=class{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}checkbox({raw:e}){return e}},ar=class e{options;renderer;textRenderer;constructor(e){this.options=e||zn,this.options.renderer=this.options.renderer||new sr,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new rr}static parse(t,i){return new e(i).parse(t)}static parseInline(t,i){return new e(i).parseInline(t)}parse(e){this.renderer.parser=this;let t="";for(let i=0;i<e.length;i++){let n=e[i];if(this.options.extensions?.renderers?.[n.type]){let e=n,i=this.options.extensions.renderers[e.type].call({parser:this},e);if(!1!==i||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(e.type)){t+=i||"";continue}}let s=n;switch(s.type){case"space":t+=this.renderer.space(s);break;case"hr":t+=this.renderer.hr(s);break;case"heading":t+=this.renderer.heading(s);break;case"code":t+=this.renderer.code(s);break;case"table":t+=this.renderer.table(s);break;case"blockquote":t+=this.renderer.blockquote(s);break;case"list":t+=this.renderer.list(s);break;case"checkbox":t+=this.renderer.checkbox(s);break;case"html":t+=this.renderer.html(s);break;case"def":t+=this.renderer.def(s);break;case"paragraph":t+=this.renderer.paragraph(s);break;case"text":t+=this.renderer.text(s);break;default:{let e='Token with "'+s.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let i="";for(let n=0;n<e.length;n++){let s=e[n];if(this.options.extensions?.renderers?.[s.type]){let e=this.options.extensions.renderers[s.type].call({parser:this},s);if(!1!==e||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(s.type)){i+=e||"";continue}}let r=s;switch(r.type){case"escape":case"text":i+=t.text(r);break;case"html":i+=t.html(r);break;case"link":i+=t.link(r);break;case"image":i+=t.image(r);break;case"checkbox":i+=t.checkbox(r);break;case"strong":i+=t.strong(r);break;case"em":i+=t.em(r);break;case"codespan":i+=t.codespan(r);break;case"br":i+=t.br(r);break;case"del":i+=t.del(r);break;default:{let e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return i}},or=class{options;block;constructor(e){this.options=e||zn}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}emStrongMask(e){return e}provideLexer(e=this.block){return e?nr.lex:nr.lexInline}provideParser(e=this.block){return e?ar.parse:ar.parseInline}};function lr(e,t){if(Array.isArray(t))for(let i=0;i<t.length;i++)e.push(t[i]);else e.push(t)}var cr=new class{defaults={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=ar;Renderer=sr;TextRenderer=rr;Lexer=nr;Tokenizer=ir;Hooks=or;constructor(...e){this.use(...e)}walkTokens(e,t){let i=[];for(let n of e)switch(lr(i,t.call(this,n)),n.type){case"table":{let e=n;for(let n of e.header)lr(i,this.walkTokens(n.tokens,t));for(let n of e.rows)for(let e of n)lr(i,this.walkTokens(e.tokens,t));break}case"list":{let e=n;lr(i,this.walkTokens(e.items,t));break}default:{let e=n;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(n=>{let s=e[n].flat(1/0);lr(i,this.walkTokens(s,t))}):e.tokens&&lr(i,this.walkTokens(e.tokens,t))}}return i}use(...e){let t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{let i={...e};if(i.async=this.defaults.async||i.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw new Error("extension name required");if("renderer"in e){let i=t.renderers[e.name];t.renderers[e.name]=i?function(...t){let n=e.renderer.apply(this,t);return!1===n&&(n=i.apply(this,t)),n}:e.renderer}if("tokenizer"in e){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");let i=t[e.level];i?i.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}"childTokens"in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),i.extensions=t),e.renderer){let t=this.defaults.renderer||new sr(this.defaults);for(let i in e.renderer){if(!(i in t))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let n=i,s=e.renderer[n],r=t[n];t[n]=(...e)=>{let i=s.apply(t,e);return!1===i&&(i=r.apply(t,e)),i||""}}i.renderer=t}if(e.tokenizer){let t=this.defaults.tokenizer||new ir(this.defaults);for(let i in e.tokenizer){if(!(i in t))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let n=i,s=e.tokenizer[n],r=t[n];t[n]=(...e)=>{let i=s.apply(t,e);return!1===i&&(i=r.apply(t,e)),i}}i.tokenizer=t}if(e.hooks){let t=this.defaults.hooks||new or;for(let i in e.hooks){if(!(i in t))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let n=i,s=e.hooks[n],r=t[n];or.passThroughHooks.has(i)?t[n]=e=>{if(this.defaults.async&&or.passThroughHooksRespectAsync.has(i))return(async()=>{let i=await s.call(t,e);return r.call(t,i)})();let n=s.call(t,e);return r.call(t,n)}:t[n]=(...e)=>{if(this.defaults.async)return(async()=>{let i=await s.apply(t,e);return!1===i&&(i=await r.apply(t,e)),i})();let i=s.apply(t,e);return!1===i&&(i=r.apply(t,e)),i}}i.hooks=t}if(e.walkTokens){let t=this.defaults.walkTokens,n=e.walkTokens;i.walkTokens=function(e){let i=[];return i.push(n.call(this,e)),t&&lr(i,t.call(this,e)),i}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return nr.lex(e,t??this.defaults)}parser(e,t){return ar.parse(e,t??this.defaults)}parseMarkdown(e){return(t,i)=>{let n={...i},s={...this.defaults,...n},r=this.onError(!!s.silent,!!s.async);if(!0===this.defaults.async&&!1===n.async)return r(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof t>"u"||null===t)return r(new Error("marked(): input parameter is undefined or null"));if("string"!=typeof t)return r(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(t)+", string expected"));if(s.hooks&&(s.hooks.options=s,s.hooks.block=e),s.async)return(async()=>{let i=s.hooks?await s.hooks.preprocess(t):t,n=await(s.hooks?await s.hooks.provideLexer(e):e?nr.lex:nr.lexInline)(i,s),r=s.hooks?await s.hooks.processAllTokens(n):n;s.walkTokens&&await Promise.all(this.walkTokens(r,s.walkTokens));let a=await(s.hooks?await s.hooks.provideParser(e):e?ar.parse:ar.parseInline)(r,s);return s.hooks?await s.hooks.postprocess(a):a})().catch(r);try{s.hooks&&(t=s.hooks.preprocess(t));let i=(s.hooks?s.hooks.provideLexer(e):e?nr.lex:nr.lexInline)(t,s);s.hooks&&(i=s.hooks.processAllTokens(i)),s.walkTokens&&this.walkTokens(i,s.walkTokens);let n=(s.hooks?s.hooks.provideParser(e):e?ar.parse:ar.parseInline)(i,s);return s.hooks&&(n=s.hooks.postprocess(n)),n}catch(e){return r(e)}}}onError(e,t){return i=>{if(i.message+="\nPlease report this to https://github.com/markedjs/marked.",e){let e="<p>An error occurred:</p><pre>"+Js(i.message+"",!0)+"</pre>";return t?Promise.resolve(e):e}if(t)return Promise.reject(i);throw i}}};function dr(e,t){return cr.parse(e,t)}dr.options=dr.setOptions=function(e){return cr.setOptions(e),dr.defaults=cr.defaults,Ln(dr.defaults),dr},dr.getDefaults=Pn,dr.defaults=zn,dr.use=function(...e){return cr.use(...e),dr.defaults=cr.defaults,Ln(dr.defaults),dr},dr.walkTokens=function(e,t){return cr.walkTokens(e,t)},dr.parseInline=cr.parseInline,dr.Parser=ar,dr.parser=ar.parse,dr.Renderer=sr,dr.TextRenderer=rr,dr.Lexer=nr,dr.lexer=nr.lex,dr.Tokenizer=ir,dr.Hooks=or,dr.parse=dr;dr.options,dr.setOptions,dr.walkTokens,dr.parseInline,ar.parse,nr.lex;const ur=new Set(["a","abbr","b","blockquote","br","caption","center","code","col","colgroup","dd","del","details","div","dl","dt","em","figcaption","figure","h1","h2","h3","h4","h5","h6","hr","i","img","input","ins","kbd","li","mark","ol","p","pre","q","s","samp","small","span","strike","strong","sub","summary","sup","table","tbody","td","tfoot","th","thead","tr","u","ul","var","ha-icon","ha-alert","ha-svg-icon","font"]),pr=new Set(["script","style","iframe","frame","frameset","object","embed","applet","noscript","noembed","noframes","template","svg","math","link","meta","base","form","textarea","select","option","button","title","head","xmp","plaintext","audio","video","source","track","canvas","portal","dialog","slot"]),hr=new Set(["title","class","dir","lang","align","style"]),mr={a:new Set(["href","target","rel"]),img:new Set(["src","alt","width","height"]),td:new Set(["colspan","rowspan"]),th:new Set(["colspan","rowspan","scope"]),col:new Set(["span"]),colgroup:new Set(["span"]),ol:new Set(["start","type","reversed"]),li:new Set(["value"]),details:new Set(["open"]),input:new Set(["type","checked","disabled"]),"ha-icon":new Set(["icon"]),"ha-alert":new Set(["alert-type","title"]),"ha-svg-icon":new Set(["path"]),font:new Set(["color","size","face"])},fr=new Set(["href","src"]),gr=new Set(["http","https","mailto","tel"]),yr=/^data:image\/(png|gif|jpe?g|webp|avif|bmp);/i,vr=/url\s*\(|expression\s*\(|javascript:|vbscript:|@import|behavior\s*:|-moz-binding|\\|\/\*|[<>]/i,br=new RegExp("^("+["color","background","background-color","opacity","display","vertical-align","white-space","word-break","overflow-wrap","line-height","letter-spacing","word-spacing","list-style-type","gap","border-collapse","border-spacing","font","font-(family|size|style|weight|variant)","text-(align|decoration|decoration-[a-z]+|transform|indent|shadow)","(margin|padding)(-(top|right|bottom|left))?","(min-|max-)?(width|height)","border(-(top|right|bottom|left))?(-(width|style|color))?","border(-(top|bottom)-(left|right))?-radius"].join("|")+")$"),wr=/(image|image-set|cross-fade|element|paint|src)\s*\(/i,xr=/\d\s*(vw|vh|vmin|vmax|[sld]v[wh])\b/i,_r=/(^|[\s(,])-\s*[\d.]/,$r=new Set(["none","inline","block","inline-block"]);function kr(e,t){if(!t||!br.test(e)||wr.test(t))return!1;if((t.split('"').length-1)%2||(t.split("'").length-1)%2)return!1;if(xr.test(t)||e.startsWith("margin")&&_r.test(t))return!1;if("display"===e)return $r.has(t.toLowerCase());if("opacity"===e){const e=t.endsWith("%")?parseFloat(t)/100:parseFloat(t);return Number.isFinite(e)&&e>=.3}return!0}function Mr(e){if(vr.test(e))return"";const t=[];for(const i of e.split(";")){const e=i.indexOf(":");if(e<0)continue;const n=i.slice(0,e).trim().toLowerCase(),s=i.slice(e+1).trim();kr(n,s)&&t.push(`${n}: ${s}`)}return t.join("; ")}const Sr=/^language-[\w-]+$/;function Cr(e,t){const i=[...e].filter(e=>{const t=e.charCodeAt(0);return t>32&&(t<127||t>159)}).join(""),n=/^([a-z][a-z0-9+.-]*):/i.exec(i);return!n||(!!gr.has(n[1].toLowerCase())||"src"===t&&yr.test(i))}function Tr(e){const t=e.localName,i=mr[t];for(const t of[...e.attributes]){const n=t.name.toLowerCase();if((hr.has(n)||!!i?.has(n))&&!(fr.has(n)&&!Cr(t.value,n))){if("style"===n){const i=Mr(t.value);i?e.setAttribute("style",i):e.removeAttribute(t.name)}else if("class"===n){const i=t.value.split(/\s+/).filter(e=>Sr.test(e));i.length?e.setAttribute("class",i.join(" ")):e.removeAttribute(t.name)}}else e.removeAttribute(t.name)}"input"!==t||"checkbox"===(e.getAttribute("type")||"").toLowerCase()?("input"===t&&e.setAttribute("disabled",""),"a"===t&&e.hasAttribute("target")&&e.setAttribute("rel","noopener noreferrer")):e.remove()}function Ar(e){for(const t of[...e.childNodes]){if(3===t.nodeType)continue;if(1!==t.nodeType){t.parentNode?.removeChild(t);continue}const e=t,i=e.localName;pr.has(i)?e.remove():(Ar(e),ur.has(i)?Tr(e):e.replaceWith(...e.childNodes))}}function Er(e){const t=document.createElement("template");return t.innerHTML=e,Ar(t.content),t.innerHTML}const Pr={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};dr.setOptions({breaks:!0,gfm:!0});const zr=new Map;const Lr=/\{\{\s*(state|attribute|entity)\s*\}\}/g;function Or(e,t,i,n){if(!t||!i)return e;const s=t.states[i];if(!s)return e;const r={state:s.state,attribute:n?String(s.attributes[n]??""):"",entity:i};return e.replace(Lr,(e,t)=>r[t].replace(/[&<>"']/g,e=>Pr[e]))}class qr extends yn.l{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:(0,G.$)("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const i=e,n=this._source(i,t);if("string"!=typeof n)return n;const s=function(e){let t=zr.get(e);return void 0!==t?zr.delete(e):(t=Er(dr.parse(e,{async:!1})),zr.size>=50&&zr.delete(zr.keys().next().value)),zr.set(e,t),t}(n);return r.qy`<div class="mc-module mc-markdown">${(0,En._)(s)}</div>`}_source(e,t){const i=void 0===e.content||null===e.content?"":String(e.content),n=!(0,Oi.L3)(i.replace(Lr,"")),s=(0,Wi.V)();if(n||!s)return Or(i,t,e.entity,e.attribute);const{template:r,variables:a}=function(e,t,i){return t?{template:e.replace(/\{\{\s*state\s*\}\}/g,"{{ states(entity) }}").replace(/\{\{\s*attribute\s*\}\}/g,i?"{{ state_attr(entity, attribute_name) }}":""),variables:i?{entity:t,attribute_name:i}:{entity:t}}:{template:e}}(i,e.entity,e.attribute),o=s.template(r,a);switch(o.status){case"ok":return(0,Oi.C3)(o.result);case"pending":return"";case"error":return Fi([`Template error: ${o.error}`]);default:return Or(i,t,e.entity,e.attribute)}}hints(e){return e.content?[]:["Markdown content is required"]}}Ei.s.register(new qr);var Rr=i(8764);class Nr extends yn.l{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:(0,G.$)("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,n=Number.isFinite(Number(i.min))?Number(i.min):0,s=Number.isFinite(Number(i.max))?Number(i.max):100,a=i.entity&&t?t.states[i.entity]:void 0,o=i.attribute||void 0,l=a?(0,ct.f4)(a,o):void 0,c=!!i.entity&&void 0===l,d=void 0===l?n:Math.min(Math.max(l,n),s),u=s>n?(d-n)/(s-n)*100:0,p=(0,Rr.r)(void 0===l?void 0:d,i.severity)||i.bar_color||"var(--primary-color, #03a9f4)",h=i.bar_background||"var(--divider-color, #e0e0e0)",m=i.bar_height||"8px",f="vertical"===i.direction;let g="—";a&&c&&o&&void 0===a.attributes[o]?g=t.formatEntityState?.(a,"unavailable")||"Unavailable":a&&(g=(0,ct.Ai)(t,a,o,{decimals:i.decimals}).text);const y=!1!==i.show_value?r.qy`<span class="mc-bar-value" data-mc-part="state">${g}</span>`:r.s6,v=`mc-module mc-bar ${f?"mc-bar-vertical":"mc-bar-horizontal"}${c?" mc-bar--unavailable":""}`,b=f?`height: ${u}%`:`width: ${u}%`,w=f?`width: ${m}; height: 100%`:`height: ${m}`;return r.qy`
      <div
        class=${v}
        role="meter"
        aria-valuemin=${n}
        aria-valuemax=${s}
        aria-valuenow=${void 0===l?r.s6:d}
        aria-valuetext=${g}
      >
        ${f?y:r.s6}
        <div class="mc-bar-track" data-mc-part="background" style="${w}; background: ${h};">
          <div class="mc-bar-fill" style="${b}; background: ${p};"></div>
        </div>
        ${f?r.s6:y}
      </div>
    `}validate(e){const t=[],i=e;return void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&t.push("Min must be less than max"),t}}Ei.s.register(new Nr);class Ir extends yn.l{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:(0,G.$)("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}getDependencies(e){return e.entity?{refreshInterval:6e4}:{}}_series(e,t,i){if(!e.entity)return{status:"none"};if(!t)return{status:"loading"};const n=e.attribute||void 0,s=(0,dt.JK)(t,e.entity,i,n,(0,Wi.V)()?.requestUpdate);if(!s)return{status:"loading"};if(s.error&&!s.samples.length)return{status:"error"};const r=Date.now(),a=r-36e5*i,o=s.samples.map(e=>({t:Math.max(e.t,a),v:e.v})).filter(e=>e.t<=r),l=(0,ct.f4)(t.states[e.entity],n);void 0!==l&&o.push({t:r,v:l});const c=Number(e.points_per_hour),d=c>0?(0,dt.Jd)(o,a,r,c):o;return 1===d.length&&o.length>1&&d.push({t:r,v:d[0].v}),d.length>1?{status:"ok",points:d,start:a,end:r}:{status:"empty"}}_coords(e,t,i){let n=1/0,s=-1/0;for(const t of e)t.v<n&&(n=t.v),t.v>s&&(s=t.v);const r=s-n,a=i-t||1;return e.map(e=>({x:(e.t-t)/a*200,y:r?56-(e.v-n)/r*52:30}))}renderPreview(e,t){const i=e,n=i.line_color||"var(--mc-primary)",s=i.fill_color||"var(--mc-primary)",a=Number(i.hours_to_show)>0?Number(i.hours_to_show):24,o=this._series(i,t,a),l=i.entity?t?.states[i.entity]:void 0;let c;if("ok"===o.status){const e=this._coords(o.points,o.start,o.end),d=e.map((e,t)=>`${t?"L":"M"}${e.x.toFixed(1)},${e.y.toFixed(1)}`).join(" "),u=e[0],p=`${d} L${e[e.length-1].x.toFixed(1)},60 L${u.x.toFixed(1)},60 Z`;c=r.qy`<svg viewBox="0 0 ${200} ${60}" preserveAspectRatio="none" style="height: 60px" role="img"
        aria-label=${`${l?(0,ct.tX)(t,l):i.entity}: last ${a} hours`}>
        ${!1!==i.fill?r.JW`<path class="mc-graphs-fill" d=${p} fill=${s} opacity="0.15" />`:r.s6}
        <path class="mc-graphs-line" d=${d} fill="none" stroke=${n} stroke-width=${i.line_width||2}
          vector-effect="non-scaling-stroke" stroke-linejoin="round" />
        ${i.show_points?e.map(e=>r.JW`<circle cx=${e.x} cy=${e.y} r="3" fill=${n} />`):r.s6}
      </svg>`}else{const e={none:"No entity",loading:"Loading history…",error:"History unavailable",empty:"No numeric history"}[o.status];c=r.qy`<div class="mc-graphs-empty" data-status=${o.status} style="height: 60px">${e}</div>`}let d="";return l&&(d=(0,ct.Ai)(t,l,i.attribute||void 0).text),r.qy`
      <div class="mc-module mc-graphs">
        ${c}
        ${!1!==i.show_labels?r.qy`<div class="mc-graphs-label">
              <span class="mc-graphs-name">${l?(0,ct.tX)(t,l):i.entity||"No entity"}${i.attribute?` · ${l&&t?.formatEntityAttributeName?.(l,i.attribute)||i.attribute}`:""}</span>
              <span class="mc-graphs-meta">${d?`${d} · `:""}${a}h</span>
            </div>`:r.s6}
      </div>
    `}}Ei.s.register(new Ir);i(9842);var jr=i(8497);class Dr extends yn.l{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:(0,G.$)("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,s=n&&i.show_state?(0,ct.Ai)(t,n,i.attribute||void 0).text:void 0,a=i.label||"Button",o="icon-only"===i.button_style,l=i.icon||"",c={hass:t,className:"mc-anim-icon",part:"icon",fx:i.icon_fx,iconOn:i.icon_on,iconOff:i.icon_off,svg:i.svg,fallbackIcon:"mdi:gesture-tap"},d=i.use_entity_icon&&i.entity?(0,xn.s)({...c,icon:l||"mdi:gesture-tap",entity:i.entity,useEntityIcon:!0}):l||(0,jr.hZ)(t,i.entity,i.icon_on,i.icon_off)?(0,xn.s)({...c,icon:l,entity:i.entity}):r.s6,u=i.use_entity_color&&n?(0,Ti.id)(n):void 0;return r.qy`
      <div class="mc-module mc-button mc-button--${i.button_style||"default"}">
        <button
          type="button"
          tabindex="-1"
          class="mc-button-inner mc-button-inner--${i.button_style||"default"} ${o?"mc-button-inner--icon-only":""}"
          title=${o?a:r.s6}
        >
          ${u&&d!==r.s6?r.qy`<span class="mc-button-icon" style="color: ${u}">${d}</span>`:d}
          ${o?r.s6:r.qy`<span data-mc-part="name">${a}</span>`}
          ${s?r.qy`<span class="mc-button-state" data-mc-part="state">${s}</span>`:r.s6}
        </button>
      </div>
    `}}Ei.s.register(new Dr);var Br=i(5441),Wr=i(5963);class Fr extends yn.l{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:(0,G.$)("slider"),type:"slider",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,s="vertical"===i.direction,a=i.design||{},o=i.slider_color||a.color||"var(--primary-color, #03a9f4)",l=i.track_color||a.background,c=`--mc-slider-color: ${o}; ${l?`--mc-slider-background: ${l};`:""}`,d=n?(0,Ui.fR)(t,n,i.attribute,{min:i.min,max:i.max,step:i.step}):void 0,u=(0,Br.vh)(i.entity,i.attribute,"slider"),p=d?(0,Br.jb)(u,d.value)??d.value:void 0,h=(0,Wi.V)(),m=d&&void 0!==p?(0,Ui.C8)(t,d,p):n?(0,ct.Ai)(t,n).text:"",f=n?(0,ct.tX)(t,n):"Slider",g=(0,Wr.E)({value:p,min:d?.min??i.min??0,max:d?.max??i.max??100,step:d?.step??i.step??1,vertical:s,disabled:!d||d.readOnly||!t,label:f,valueText:m,style:c,onCommit:e=>{if(!d?.call||!t)return;const i=d.call;(0,Br.n_)(u,e,d.value,e=>(0,Ui.Bw)(t,i(e)),()=>h?.requestUpdate(),300)}});return r.qy`
      <div
        class="mc-module mc-slider mc-slider-container ${s?"mc-slider-container--vertical":"mc-slider-container--horizontal"}"
      >
        ${g}
        ${!1!==i.show_value&&n?r.qy`<span class="mc-slider-value">${m}</span>`:r.s6}
      </div>
    `}validate(e){const t=e;return void 0!==t.min&&void 0!==t.max&&t.min>=t.max?["Min must be less than max"]:void 0===t.step||t.step>0?[]:["Step must be greater than 0"]}}Ei.s.register(new Fr);i(2805),i(8465),i(2134);class Hr extends yn.l{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:speedometer"}}createDefault(){return{id:(0,G.$)("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half",show_name:!0}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,s=Number.isFinite(Number(i.min))?Number(i.min):0,a=Number.isFinite(Number(i.max))?Number(i.max):100,o=i.attribute||void 0;let l,c,d="";if(i.entity)if(n)if(l=(0,ct.f4)(n,o),void 0===l&&o&&void 0===n.attributes[o])c=t.formatEntityState?.(n,"unavailable")||"Unavailable";else{const e=(0,ct.Ai)(t,n,o,{decimals:i.decimals});c=void 0===l?e.text:e.value,d=void 0===l||!1===i.show_unit?"":e.unit}else l=void 0,c="—";else l=Math.round((s+a)/2),c=String(l);const u=void 0===l,p=u?s:Math.max(s,Math.min(a,l)),h=a>s?(p-s)/(a-s)*100:0,m=(0,Rr.r)(u?void 0:p,i.severity)||"var(--primary-color, #03a9f4)",f=!1===i.show_name?"":n?(0,ct.tX)(t,n):i.entity||"",g=`${f?`${f}: `:""}${c}${d?` ${d}`:""}`,y=(e,t,i,n="middle")=>r.JW`
      <text class="mc-gauge-text" data-mc-part="state" x=${e} y=${t} text-anchor=${n} font-size=${u?Math.min(i,10):i} font-weight="600" fill="currentColor">
        ${c}${d?r.JW`<tspan class="mc-gauge-unit" font-size=${Math.round(.55*i)} font-weight="400" dx="1">${d}</tspan>`:r.s6}
      </text>`,v=(e,t,n,s)=>!1===i.needle||u?r.s6:r.JW`<line x1=${e} y1=${t} x2=${n} y2=${s} stroke=${m} stroke-width="2" stroke-linecap="round" />
            <circle cx=${e} cy=${t} r="3" fill=${m} />`,b=(e,t)=>r.qy`
      <div
        class="mc-module mc-gauge mc-gauge--${e}${u&&i.entity?" mc-gauge--unavailable":""}"
        style="text-align: center;"
        role="meter"
        aria-valuemin=${s}
        aria-valuemax=${a}
        aria-valuenow=${u?r.s6:p}
        aria-valuetext=${g}
      >
        ${t}
        ${f?r.qy`<div class="mc-gauge-name" data-mc-part="name">${f}</div>`:r.s6}
      </div>
    `;if("full"===i.gauge_style){const e=Math.min(h/100*360,359.99),t=(e-90)*(Math.PI/180),n=50+40*Math.cos(t),s=50+40*Math.sin(t),a=e>180?1:0;return b("full",r.qy`
        <svg viewBox="0 0 100 100" width="120" height="120">
          <circle data-mc-part="background" cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${h>0?r.JW`<path d="M 50 10 A 40 40 0 ${a} 1 ${n} ${s}" fill="none" stroke=${m} stroke-width="8" stroke-linecap="round" />`:r.s6}
          ${v(50,50,50+30*Math.cos(t),50+30*Math.sin(t))}
          ${y(50,!1===i.needle||u?54:74,16)}
        </svg>
      `)}if("quarter"===i.gauge_style){const e=h/100*90,t=Math.PI/180*-90,n=(-90+e)*(Math.PI/180),s=44,a=10,o=90,l=a+s*Math.cos(t),c=o+s*Math.sin(t),d=a+s*Math.cos(n),p=o+s*Math.sin(n);return b("quarter",r.qy`
        <svg viewBox="0 0 100 100" width="120" height="120">
          <path data-mc-part="background" d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
          ${h>0?r.JW`<path d="M ${l} ${c} A ${s} ${s} 0 0 1 ${d} ${p}" fill="none" stroke=${m} stroke-width="8" stroke-linecap="round" />`:r.s6}
          ${v(a,o,a+34*Math.cos(n),o+34*Math.sin(n))}
          ${y(!1===i.needle||u?20:60,!1===i.needle||u?80:40,18,"start")}
        </svg>
      `)}const w=!1!==i.needle&&!u,x=(180+h/100*180)*(Math.PI/180),_=50+40*Math.cos(x),$=55+40*Math.sin(x);return b("half",r.qy`
      <svg viewBox="0 0 100 ${w?76:70}" width="140" height=${w?109:100}>
        <path data-mc-part="background" d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" stroke-linecap="round" />
        ${h>0?r.JW`<path d="M 10 55 A 40 40 0 0 1 ${_} ${$}" fill="none" stroke=${m} stroke-width="8" stroke-linecap="round" />`:r.s6}
        ${v(50,55,_,$)}
        ${y(50,w?75:50,14)}
        <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${s}</text>
        <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${a}</text>
      </svg>
    `)}validate(e){const t=e;return void 0!==t.min&&void 0!==t.max&&Number(t.min)>=Number(t.max)?["Min must be less than max"]:[]}}Ei.s.register(new Hr);class Gr extends yn.l{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:(0,G.$)("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const i=e,n=i.modules||[];return r.qy`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${n.length>0?n.map((e,i)=>Gi(e,t,i)):Ji("Empty row")}
      </div>
    `}}Ei.s.register(new Gr);class Jr extends yn.l{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:(0,G.$)("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const i=e,n=i.modules||[];return r.qy`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${n.length>0?n.map((e,i)=>Gi(e,t,i)):Ji("Empty column")}
      </div>
    `}}Ei.s.register(new Jr);class Ur extends yn.l{constructor(){super(...arguments),this.metadata={type:"row",name:"Row",description:"Grid row with columns, nestable inside any column",category:"layout",icon:"mdi:view-sequential-outline"}}createDefault(){return{id:(0,G.$)("row"),type:"row",columns:[{id:(0,G.$)("col"),modules:[]},{id:(0,G.$)("col"),modules:[]}],layout:"1-1",gap:"8px"}}renderPreview(e,t){const i=e,n=i.columns||[],a=(0,Wi.V)(),o=`grid-template-columns: ${(0,J.$t)(i)}; gap: ${i.gap||"8px"}${i.padding?`; padding: ${i.padding}`:""}`;return r.qy`
      <div class="mc-module mc-nested-row" style=${o}>
        ${n.map((e,i)=>e&&"object"==typeof e?a?.renderColumn?.(e,i)??r.qy`<div class="mc-column" data-valign=${e.vertical_align||r.s6} style=${`gap: ${e.gap||s.Kd}`}>${(e.modules||[]).map((e,n)=>Gi(e,t,n,i))}</div>`:r.s6)}
      </div>
    `}}Ei.s.register(new Ur);class Vr extends yn.l{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:(0,G.$)("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const i=e,n=(0,Wi.V)(),s=i.tabs||[],a=s.flatMap((e,t)=>n?.editMode||!e?.hidden?[t]:[]),o=n?.uiState?.("active-tab"),l=Math.trunc(Number(n?.selectedChild?.()?.slot??o?.get()??i.active_tab??0)),c=a.includes(l)?l:a[0]??0,d=a.length?s[c]:void 0,u=e=>t=>{t.stopPropagation(),o&&n&&e!==c&&(o.set(e),n.requestUpdate())},p=e=>e.stopPropagation(),h=e=>{e.stopPropagation();const t=a.length,i=a.indexOf(c),n={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:t-1}[e.key];if(void 0===n||!t)return;e.preventDefault();const s=(n+t)%t;u(a[s])(e);const r=e.currentTarget.parentElement;queueMicrotask(()=>r?.querySelectorAll('[role="tab"]')[s]?.focus())};return r.qy`
      <div class="mc-module mc-tabs" data-style=${i.tab_style||"default"}>
        <div class="mc-tabs-header" role="tablist">
          ${a.map(e=>{const n=s[e];return r.qy`
              <button type="button" role="tab" class="mc-tab-button ${e===c?"active":""}" data-mc-hidden=${n?.hidden?"":r.s6}
                aria-selected=${e===c?"true":"false"}
                tabindex=${e===c?0:-1}
                @click=${u(e)} @pointerdown=${p} @pointerup=${p} @keydown=${h}>
                ${n?.icon?(0,xn.K)(i.icon_fx)?(0,xn.s)({icon:n.icon,hass:t,fx:i.icon_fx,svg:i.svg}):r.qy`<ha-icon icon=${n.icon}></ha-icon>`:r.s6}
                ${n?.label??""}
              </button>
            `})}
        </div>
        <div class="mc-tabs-content" role="tabpanel">
          ${d?.modules?.length?d.modules.map((e,i)=>Gi(e,t,i,c)):Ji("Empty tab")}
        </div>
      </div>
    `}}Ei.s.register(new Vr);class Zr extends yn.l{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}createDefault(){return{id:(0,G.$)("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const i=e;return"vertical"===i.direction?r.qy`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:r.qy`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}}function Yr(e,t=0){return setTimeout(e,t)}function Xr(){return Date.now()}function Kr(e,t="x"){const i=function(e){return window.getComputedStyle(e,null)}(e),n=i.transform||i.webkitTransform;if(!n||"none"===n)return 0;const s=new DOMMatrixReadOnly(n);return"x"===t?s.m41:s.m42}function Qr(e){return"object"==typeof e&&null!==e&&!!e.constructor&&"Object"===Object.prototype.toString.call(e).slice(8,-1)}function ea(e){return"undefined"!=typeof HTMLElement&&e instanceof HTMLElement||!!e&&"object"==typeof e&&(1===e.nodeType||11===e.nodeType)}function ta(e,...t){const i=Object(e);for(let e=0;e<t.length;e+=1){const n=t[e];if(null==n||ea(n))continue;const s=n,r=Object.keys(Object(s));for(let e=0,t=r.length;e<t;e+=1){const t=r[e];if("__proto__"===t||"constructor"===t||"prototype"===t)continue;const n=Object.getOwnPropertyDescriptor(s,t);if(!n||!n.enumerable)continue;const a=s[t];Qr(i[t])&&Qr(a)?a.__swiper__?i[t]=a:ta(i[t],a):!Qr(i[t])&&Qr(a)?(i[t]={},a.__swiper__?i[t]=a:ta(i[t],a)):i[t]=a}}return i}function ia(e,t,i){e.style.setProperty(t,i)}function na(e,t=""){const i=[...e.children];return e instanceof HTMLSlotElement&&i.push(...e.assignedElements()),t?i.filter(e=>e.matches(t)):i}function sa(e){try{console.warn(e)}catch{}}function ra(e,t=[]){const i=document.createElement(e);return i.classList.add(...Array.isArray(t)?t:function(e=""){return e.trim().split(" ").filter(e=>!!e.trim())}(t)),i}function aa(e,t){return window.getComputedStyle(e,null).getPropertyValue(t)}function oa(e){if(e&&e.parentNode)return[...e.parentNode.children].indexOf(e)}function la(e,t){const i=[];let n=e.parentElement;for(;n;)t&&!n.matches(t)||i.push(n),n=n.parentElement;return i}function ca(e,t,i){{const i=window.getComputedStyle(e,null);return e["width"===t?"offsetWidth":"offsetHeight"]+parseFloat(i.getPropertyValue("width"===t?"margin-right":"margin-top"))+parseFloat(i.getPropertyValue("width"===t?"margin-left":"margin-bottom"))}}function da(e){return(Array.isArray(e)?e:[e]).filter(e=>!!e)}function ua(e,t=""){const i=globalThis.trustedTypes;e.innerHTML=void 0!==i?i.createPolicy("html",{createHTML:e=>e}).createHTML(t):t}let pa,ha,ma;function fa(){return pa||(pa="undefined"==typeof window?{touch:!1}:{touch:"ontouchstart"in window||navigator.maxTouchPoints>0}),pa}function ga(e={}){return ha||(ha=function({userAgent:e}={}){if("undefined"==typeof window)return{ios:!1,android:!1};const t=fa(),i=navigator.platform,n=e||navigator.userAgent,s={ios:!1,android:!1},r=/(Android);?[\s/]+([\d.]+)?/.test(n),a=/(iPhone\sOS|iOS|iPod)/.test(n),o=/iPad/.test(n),l="MacIntel"===i&&t.touch&&navigator.maxTouchPoints>1,c=o||l;return r&&!("Win32"===i)&&(s.os="android",s.android=!0),(c||a)&&(s.os="ios",s.ios=!0),s}(e)),ha}function ya(){return ma||(ma=function(){if("undefined"==typeof window)return{isSafari:!1,isWebView:!1,need3dFix:!1};const e=ga(),t=navigator.userAgent,i=t.toLowerCase(),n=i.includes("safari")&&!i.includes("chrome")&&!i.includes("android"),s=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t);return{isSafari:n,isWebView:s,need3dFix:n||s&&e.ios}}()),ma}Ei.s.register(new Zr);const va=(e,t)=>{if(!e||e.destroyed||!e.params||!e.params.lazyPreload)return;const i=t.closest(e.isElement?"swiper-slide":`.${e.params.slideClass}`);if(i){let t=i.querySelector(`.${e.params.lazyPreloaderClass}`);!t&&e.isElement&&(i.shadowRoot?t=i.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{if(i.shadowRoot){const t=i.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`);t&&!t.lazyPreloaderManaged&&t.remove()}})),t&&!t.lazyPreloaderManaged&&t.remove()}},ba=(e,t)=>{if(!e.slides[t])return;const i=e.slides[t].querySelector('[loading="lazy"]');i&&i.removeAttribute("loading")},wa=e=>{if(!e||e.destroyed||!e.params||!e.params.lazyPreload)return;let t=e.params.lazyPreloadPrevNext;const i=e.slides.length;if(!i||!t||t<0)return;t=Math.min(t,i);const n="auto"===e.params.slidesPerView?e.slidesPerViewDynamic():Math.ceil(e.params.slidesPerView),s=e.activeIndex;if(e.params.grid&&(e.params.grid.rows??1)>1){const i=s,r=[i-t];return r.push(...Array.from({length:t}).map((e,t)=>i+n+t)),void e.slides.forEach((t,i)=>{void 0!==t.column&&r.includes(t.column)&&ba(e,i)})}const r=s+n-1;if(e.params.rewind||e.params.loop)for(let n=s-t;n<=r+t;n+=1){const t=(n%i+i)%i;(t<s||t>r)&&ba(e,t)}else for(let n=Math.max(s-t,0);n<=Math.min(r+t,i-1);n+=1)n!==s&&(n>r||n<s)&&ba(e,n)};const xa=(e,t)=>!!(e.grid&&t.grid&&t.grid.rows>1);var _a={setBreakpoint:function(){const e=this,{realIndex:t,initialized:i,params:n,el:s}=e,r=n.breakpoints;if(!r||r&&0===Object.keys(r).length)return;const a="window"!==n.breakpointsBase&&n.breakpointsBase?"container":n.breakpointsBase,o=["window","container"].includes(n.breakpointsBase)||!n.breakpointsBase?e.el:document.querySelector(n.breakpointsBase),l=e.getBreakpoint(r,a,o);if(!l||e.currentBreakpoint===l)return;const c=(l in r?r[l]:void 0)||e.originalParams,d=xa(e,n),u=xa(e,c),p=e.params.grabCursor,h=c.grabCursor,m=n.enabled;d&&!u?(s.classList.remove(`${n.containerModifierClass}grid`,`${n.containerModifierClass}grid-column`),e.emitContainerClasses()):!d&&u&&(s.classList.add(`${n.containerModifierClass}grid`),(c.grid.fill&&"column"===c.grid.fill||!c.grid.fill&&"column"===n.grid.fill)&&s.classList.add(`${n.containerModifierClass}grid-column`),e.emitContainerClasses()),p&&!h?e.unsetGrabCursor():!p&&h&&e.setGrabCursor();const f=(e,t)=>e[t];["navigation","pagination","scrollbar"].forEach(t=>{const i=f(c,t);if(void 0===i)return;const s=f(n,t),r="object"==typeof s&&null!==s&&s.enabled,a="object"==typeof i&&null!==i&&i.enabled,o=e[t];r&&!a&&o?.disable?.(),!r&&a&&o?.enable?.()});const g=c.direction&&c.direction!==n.direction,y=n.loop&&(c.slidesPerView!==n.slidesPerView||g),v=n.loop;g&&i&&e.changeDirection(),ta(e.params,c);const b=e.params.enabled,w=e.params.loop;Object.assign(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),m&&!b?e.disable():!m&&b&&e.enable(),e.currentBreakpoint=l,e.emit("_beforeBreakpoint",c),i&&(y?(e.loopDestroy(),e.updateSlides(),e.loopCreate(t)):!v&&w?(e.updateSlides(),e.loopCreate(t)):v&&!w&&e.loopDestroy()),e.emit("breakpoint",c)},getBreakpoint:function(e,t="window",i){if(!e||"container"===t&&!i)return;let n=!1;const s="window"===t?window.innerHeight:i.clientHeight,r=Object.keys(e).map(e=>{if("string"==typeof e&&0===e.indexOf("@")){const t=parseFloat(e.substr(1));return{value:s*t,point:e}}return{value:e,point:e}});r.sort((e,t)=>parseInt(String(e.value),10)-parseInt(String(t.value),10));for(let e=0;e<r.length;e+=1){const{point:s,value:a}=r[e];"window"===t?window.matchMedia(`(min-width: ${a}px)`).matches&&(n=s):a<=i.clientWidth&&(n=s)}return n||"max"}};var $a={checkOverflow:function(){const e=this,{isLocked:t,params:i}=e,{slidesOffsetBefore:n}=i;if(n){const t=e.slides.length-1,i=e.slidesGrid[t]+e.slidesSizesGrid[t]+2*n;e.isLocked=e.size>i}else e.isLocked=1===e.snapGrid.length;!0===i.allowSlideNext&&(e.allowSlideNext=!e.isLocked),!0===i.allowSlidePrev&&(e.allowSlidePrev=!e.isLocked),t&&t!==e.isLocked&&(e.isEnd=!1),t!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock")}};var ka={addClasses:function(){const e=this,{classNames:t,params:i,rtl:n,el:s,device:r}=e,a=function(e,t){const i=[];return e.forEach(e=>{"object"==typeof e?Object.keys(e).forEach(n=>{e[n]&&i.push(t+n)}):"string"==typeof e&&i.push(t+e)}),i}(["initialized",i.direction,{"free-mode":e.params.freeMode&&i.freeMode.enabled},{autoheight:i.autoHeight},{rtl:n},{grid:i.grid&&i.grid.rows>1},{"grid-column":i.grid&&i.grid.rows>1&&"column"===i.grid.fill},{android:r.android},{ios:r.ios},{"css-mode":i.cssMode},{centered:i.cssMode&&i.centeredSlides},{"watch-progress":i.watchSlidesProgress}],i.containerModifierClass);t.push(...a),s.classList.add(...t),e.emitContainerClasses()},removeClasses:function(){const{el:e,classNames:t}=this;e&&"string"!=typeof e&&(e.classList.remove(...t),this.emitContainerClasses())}};const Ma={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,snapToSlideEdge:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreload:!0,lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};var Sa={on(e,t,i){const n=this;if(!n.eventsListeners||n.destroyed)return n;if("function"!=typeof t)return n;const s=i?"unshift":"push";return e.split(" ").forEach(e=>{n.eventsListeners[e]||(n.eventsListeners[e]=[]),n.eventsListeners[e][s](t)}),n},once(e,t,i){const n=this;if(!n.eventsListeners||n.destroyed)return n;if("function"!=typeof t)return n;const s=function(...i){n.off(e,s),s.__emitterProxy&&delete s.__emitterProxy,t.apply(n,i)};return s.__emitterProxy=t,n.on(e,s,i)},onAny(e,t){const i=this;if(!i.eventsListeners||i.destroyed)return i;if("function"!=typeof e)return i;const n=t?"unshift":"push";return i.eventsAnyListeners.indexOf(e)<0&&i.eventsAnyListeners[n](e),i},offAny(e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsAnyListeners)return t;const i=t.eventsAnyListeners.indexOf(e);return i>=0&&t.eventsAnyListeners.splice(i,1),t},off(e,t){const i=this;return!i.eventsListeners||i.destroyed?i:i.eventsListeners?(e.split(" ").forEach(e=>{void 0===t?i.eventsListeners[e]=[]:i.eventsListeners[e]&&i.eventsListeners[e].forEach((n,s)=>{(n===t||n.__emitterProxy&&n.__emitterProxy===t)&&i.eventsListeners[e].splice(s,1)})}),i):i},emit(...e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsListeners)return t;let i,n,s;if("string"==typeof e[0]||Array.isArray(e[0]))i=e[0],n=e.slice(1,e.length),s=t;else{const r=e[0];i=r.events,n=r.data??[],s=r.context||t}n.unshift(s);return(Array.isArray(i)?i:i.split(" ")).forEach(e=>{t.eventsAnyListeners&&t.eventsAnyListeners.length&&t.eventsAnyListeners.forEach(t=>{t.apply(s,[e,...n])}),t.eventsListeners&&t.eventsListeners[e]&&t.eventsListeners[e].forEach(e=>{e.apply(s,n)})}),t}};function Ca(e){const t=this;t.destroyed||t.enabled&&(t.allowClick||(t.params.preventClicks&&e.preventDefault(),t.params.preventClicksPropagation&&t.animating&&(e.stopPropagation(),e.stopImmediatePropagation())))}function Ta(){const e=this;e.destroyed||e.documentTouchHandlerProceeded||(e.documentTouchHandlerProceeded=!0,e.params.touchReleaseOnEdges&&(e.el.style.touchAction="auto"))}function Aa(e){const t=this;t.destroyed||(va(t,e.target),"error"===e.type||t.params.cssMode||"auto"!==t.params.slidesPerView&&!t.params.autoHeight||t.update())}function Ea(){const e=this,{params:t,el:i}=e;if(i&&0===i.offsetWidth)return;t.breakpoints&&e.setBreakpoint();const{allowSlideNext:n,allowSlidePrev:s,snapGrid:r}=e,a=e.virtual&&e.params.virtual?.enabled;e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),e.updateSlidesClasses();const o=a&&t.loop;if(!("auto"===t.slidesPerView||t.slidesPerView>1)||!e.isEnd||e.isBeginning||e.params.centeredSlides||o)e.params.loop&&!a?e.slideToLoop(e.realIndex,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0);else{const t=a?e.virtual.slides.length:e.slides.length;e.slideTo(t-1,0,!1,!0)}if(e.autoplay&&e.autoplay.running&&e.autoplay.paused){const t=e.autoplay;clearTimeout(t.resizeTimeout),t.resizeTimeout=setTimeout(()=>{e.autoplay&&e.autoplay.running&&e.autoplay.paused&&e.autoplay.resume()},500)}e.allowSlidePrev=s,e.allowSlideNext=n,e.params.watchOverflow&&r!==e.snapGrid&&e.checkOverflow()}function Pa(){const e=this;if(e.destroyed)return;const{wrapperEl:t,rtlTranslate:i,enabled:n}=e;if(!n)return;let s;e.previousTranslate=e.translate,e.isHorizontal()?e.translate=-t.scrollLeft:e.translate=-t.scrollTop,0===e.translate&&(e.translate=0),e.updateActiveIndex(),e.updateSlidesClasses();const r=e.maxTranslate()-e.minTranslate();s=0===r?0:(e.translate-e.minTranslate())/r,s!==e.progress&&e.updateProgress(i?-e.translate:e.translate),e.emit("setTranslate",e.translate,!1)}function za(e){const t=this;if(t.destroyed)return;const i=t.touchEventsData;let n=e.originalEvent??e;if("touchend"===n.type||"touchcancel"===n.type){const e=[...n.changedTouches].find(e=>e.identifier===i.touchId);if(!e||e.identifier!==i.touchId)return}else{if(null!==i.touchId)return;if(n.pointerId!==i.pointerId)return}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(n.type)){if(!(["pointercancel","contextmenu"].includes(n.type)&&(t.browser.isSafari||t.browser.isWebView)))return}i.pointerId=null,i.touchId=null,i.startEventPath=void 0,i.lastMoveEvent=void 0;const{params:s,touches:r,rtlTranslate:a,slidesGrid:o,enabled:l}=t;if(!l)return;if(!s.simulateTouch&&"mouse"===n.pointerType)return;if(i.allowTouchCallbacks&&t.emit("touchEnd",n),i.allowTouchCallbacks=!1,!i.isTouched)return i.isMoved&&s.grabCursor&&t.setGrabCursor(!1),i.isMoved=!1,void(i.startMoving=!1);s.grabCursor&&i.isMoved&&i.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);const c=Xr(),d=c-i.touchStartTime;if(t.allowClick){const e=n.path??(n.composedPath&&n.composedPath());t.updateClickedSlide(e&&e[0],e),t.emit("tap click",n),d<300&&c-i.lastClickTime<300&&t.emit("doubleTap doubleClick",n)}if(i.lastClickTime=Xr(),Yr(()=>{t.destroyed||(t.allowClick=!0)}),!i.isTouched||!i.isMoved||!t.swipeDirection||0===r.diff&&!i.loopSwapReset||i.currentTranslate===i.startTranslate&&!i.loopSwapReset)return i.isTouched=!1,i.isMoved=!1,void(i.startMoving=!1);let u;if(i.isTouched=!1,i.isMoved=!1,i.startMoving=!1,u=s.followFinger?a?t.translate:-t.translate:-(i.currentTranslate??0),s.cssMode)return;if(s.freeMode&&s.freeMode.enabled)return void t.freeMode.onTouchEnd({currentPos:u});const p=u>=-t.maxTranslate()&&!t.params.loop;let h=0,m=t.slidesSizesGrid[0];for(let e=0;e<o.length;e+=e<s.slidesPerGroupSkip?1:s.slidesPerGroup){const t=e<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;void 0!==o[e+t]?(p||u>=o[e]&&u<o[e+t])&&(h=e,m=o[e+t]-o[e]):(p||u>=o[e])&&(h=e,m=o[o.length-1]-o[o.length-2])}let f=null,g=null;s.rewind&&(t.isBeginning?g=s.virtual?.enabled&&t.virtual?t.virtual.slides.length-1:t.slides.length-1:t.isEnd&&(f=0));const y=(u-o[h])/m,v=h<s.slidesPerGroupSkip-1?1:s.slidesPerGroup;if(d>s.longSwipesMs){if(!s.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(y>=s.longSwipesRatio?t.slideTo(s.rewind&&t.isEnd?f:h+v):t.slideTo(h)),"prev"===t.swipeDirection&&(y>1-s.longSwipesRatio?t.slideTo(h+v):null!==g&&y<0&&Math.abs(y)>s.longSwipesRatio?t.slideTo(g):t.slideTo(h))}else{if(!s.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(n.target===t.navigation.nextEl||n.target===t.navigation.prevEl)?n.target===t.navigation.nextEl?t.slideTo(h+v):t.slideTo(h):("next"===t.swipeDirection&&t.slideTo(null!==f?f:h+v),"prev"===t.swipeDirection&&t.slideTo(null!==g?g:h))}}function La(e){const t=this;if(t.destroyed)return;const i=t.touchEventsData,{params:n,touches:s,rtlTranslate:r,enabled:a}=t;if(!a)return;if(!n.simulateTouch&&"mouse"===e.pointerType)return;const o=e,l=o.originalEvent??o;if("pointermove"===l.type){if(null!==i.touchId)return;if(l.pointerId!==i.pointerId)return}let c;if("touchmove"===l.type){const e=[...l.changedTouches].find(e=>e.identifier===i.touchId);if(!e||e.identifier!==i.touchId)return;c=e}else c=l;if(!i.isTouched)return void(i.startMoving&&i.isScrolling&&t.emit("touchMoveOpposite",l));if(i.lastMoveEvent===l)return;i.lastMoveEvent=l;for(const n of i.startEventPath??[]){if(n===t.el)break;const i=n.swiper;i&&i!==t&&!i.destroyed&&i.params.nested&&i.touchEventsData.isTouched&&i.onTouchMove(e)}const d=c.pageX,u=c.pageY;if(l.preventedByNestedSwiper)return s.startX=d,void(s.startY=u);if(!t.allowTouchMove)return l.target.matches(i.focusableElements)||(t.allowClick=!1),void(i.isTouched&&(Object.assign(s,{startX:d,startY:u,currentX:d,currentY:u}),i.touchStartTime=Xr()));if(n.touchReleaseOnEdges&&!n.loop)if(t.isVertical()){if(u<s.startY&&t.translate<=t.maxTranslate()||u>s.startY&&t.translate>=t.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else{if(r&&(d>s.startX&&-t.translate<=t.maxTranslate()||d<s.startX&&-t.translate>=t.minTranslate()))return;if(!r&&(d<s.startX&&t.translate<=t.maxTranslate()||d>s.startX&&t.translate>=t.minTranslate()))return}if(document.activeElement&&document.activeElement.matches(i.focusableElements)&&document.activeElement!==l.target&&"mouse"!==l.pointerType&&document.activeElement.blur(),document.activeElement&&l.target===document.activeElement&&l.target.matches(i.focusableElements))return i.isMoved=!0,void(t.allowClick=!1);i.allowTouchCallbacks&&t.emit("touchMove",l),s.previousX=s.currentX,s.previousY=s.currentY,s.currentX=d,s.currentY=u;const p=s.currentX-s.startX,h=s.currentY-s.startY;if(t.params.threshold&&Math.sqrt(p**2+h**2)<t.params.threshold)return;if(void 0===i.isScrolling){let e;t.isHorizontal()&&s.currentY===s.startY||t.isVertical()&&s.currentX===s.startX?i.isScrolling=!1:p*p+h*h>=25&&(e=180*Math.atan2(Math.abs(h),Math.abs(p))/Math.PI,i.isScrolling=t.isHorizontal()?e>n.touchAngle:90-e>n.touchAngle)}if(i.isScrolling&&t.emit("touchMoveOpposite",l),void 0===i.startMoving&&(s.currentX===s.startX&&s.currentY===s.startY||(i.startMoving=!0)),i.isScrolling||"touchmove"===l.type&&i.preventTouchMoveFromPointerMove)return void(i.isTouched=!1);if(!i.startMoving)return;t.allowClick=!1,!n.cssMode&&l.cancelable&&l.preventDefault(),n.touchMoveStopPropagation&&!n.nested&&l.stopPropagation();let m=t.isHorizontal()?p:h,f=t.isHorizontal()?s.currentX-s.previousX:s.currentY-s.previousY;n.oneWayMovement&&(m=Math.abs(m)*(r?1:-1),f=Math.abs(f)*(r?1:-1)),s.diff=m,m*=n.touchRatio,r&&(m=-m,f=-f);const g=t.touchesDirection;t.swipeDirection=m>0?"prev":"next",t.touchesDirection=f>0?"prev":"next";const y=t.params.loop&&!n.cssMode,v="next"===t.touchesDirection&&t.allowSlideNext||"prev"===t.touchesDirection&&t.allowSlidePrev;if(!i.isMoved){if(y&&v&&t.loopFix({direction:t.swipeDirection}),i.startTranslate=t.getTranslate(),t.setTransition(0),t.animating){const e=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});t.wrapperEl.dispatchEvent(e)}i.allowMomentumBounce=!1,!n.grabCursor||!0!==t.allowSlideNext&&!0!==t.allowSlidePrev||t.setGrabCursor(!0),t.emit("sliderFirstMove",l)}if((new Date).getTime(),!1!==n._loopSwapReset&&i.isMoved&&i.allowThresholdMove&&g!==t.touchesDirection&&y&&v&&Math.abs(m)>=1)return Object.assign(s,{startX:d,startY:u,currentX:d,currentY:u,startTranslate:i.currentTranslate}),i.loopSwapReset=!0,void(i.startTranslate=i.currentTranslate);t.emit("sliderMove",l),i.isMoved=!0;const b=i.startTranslate??0;i.currentTranslate=m+b;let w=!0,x=n.resistanceRatio;if(n.touchReleaseOnEdges&&(x=0),m>0?(y&&v&&i.allowThresholdMove&&i.currentTranslate>(n.centeredSlides?t.minTranslate()-t.slidesSizesGrid[t.activeIndex+1]-("auto"!==n.slidesPerView&&t.slides.length-n.slidesPerView>=2?t.slidesSizesGrid[t.activeIndex+1]+t.params.spaceBetween:0)-t.params.spaceBetween:t.minTranslate())&&t.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),i.currentTranslate>t.minTranslate()&&(w=!1,n.resistance&&(i.currentTranslate=t.minTranslate()-1+(-t.minTranslate()+b+m)**x))):m<0&&(y&&v&&i.allowThresholdMove&&i.currentTranslate<(n.centeredSlides?t.maxTranslate()+t.slidesSizesGrid[t.slidesSizesGrid.length-1]+t.params.spaceBetween+("auto"!==n.slidesPerView&&t.slides.length-n.slidesPerView>=2?t.slidesSizesGrid[t.slidesSizesGrid.length-1]+t.params.spaceBetween:0):t.maxTranslate())&&t.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:t.slides.length-("auto"===n.slidesPerView?t.slidesPerViewDynamic():Math.ceil(parseFloat(String(n.slidesPerView))))}),i.currentTranslate<t.maxTranslate()&&(w=!1,n.resistance&&(i.currentTranslate=t.maxTranslate()+1-(t.maxTranslate()-b-m)**x))),w&&(l.preventedByNestedSwiper=!0),!t.allowSlideNext&&"next"===t.swipeDirection&&(i.currentTranslate??0)<b&&(i.currentTranslate=b),!t.allowSlidePrev&&"prev"===t.swipeDirection&&(i.currentTranslate??0)>b&&(i.currentTranslate=b),t.allowSlidePrev||t.allowSlideNext||(i.currentTranslate=b),n.threshold>0){if(!(Math.abs(m)>n.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,s.startX=s.currentX,s.startY=s.currentY,i.currentTranslate=i.startTranslate,void(s.diff=t.isHorizontal()?s.currentX-s.startX:s.currentY-s.startY)}n.followFinger&&!n.cssMode&&((n.freeMode&&n.freeMode.enabled&&t.freeMode||n.watchSlidesProgress)&&(t.updateActiveIndex(),t.updateSlidesClasses()),n.freeMode&&n.freeMode.enabled&&t.freeMode&&t.freeMode.onTouchMove(),t.updateProgress(i.currentTranslate),t.setTranslate(i.currentTranslate??0))}function Oa(e,t,i){const{params:n}=e,s=n.edgeSwipeDetection,r=n.edgeSwipeThreshold;return!s||!(i<=r||i>=window.innerWidth-r)||"prevent"===s&&(t.preventDefault(),!0)}function qa(e){const t=this;if(t.destroyed)return;const i=e.originalEvent??e,n=t.touchEventsData;if("pointerdown"===i.type){const e=i;if(null!==n.pointerId&&n.pointerId!==e.pointerId)return;n.pointerId=e.pointerId}else"touchstart"===i.type&&1===i.targetTouches.length&&(n.touchId=i.targetTouches[0].identifier);if("touchstart"===i.type)return void Oa(t,i,i.targetTouches[0].pageX);const{params:s,touches:r,enabled:a}=t;if(!a)return;if(!s.simulateTouch&&"mouse"===i.pointerType)return;if(t.animating&&s.preventInteractionOnTransition)return;!t.animating&&s.cssMode&&s.loop&&t.loopFix();let o=i.target;if("wrapper"===s.touchEventsTarget&&!function(e,t){let i=t.contains(e);!i&&t instanceof HTMLSlotElement&&(i=[...t.assignedElements()].includes(e),i||(i=function(e,t){const i=[t];for(;i.length>0;){const t=i.shift();if(e===t)return!0;i.push(...t.children,...t.shadowRoot?t.shadowRoot.children:[],...t.assignedElements?t.assignedElements():[])}return!1}(e,t)));return i}(o,t.wrapperEl))return;const l=i;if("number"==typeof l.which&&3===l.which)return;if("number"==typeof l.button&&l.button>0)return;if(n.isTouched&&n.isMoved)return;const c=!!s.noSwipingClass&&""!==s.noSwipingClass,d=i.composedPath?i.composedPath():i.path;c&&i.target&&i.target.shadowRoot&&d&&(o=d[0]);const u=s.noSwipingSelector?s.noSwipingSelector:`.${s.noSwipingClass}`,p=!(!i.target||!i.target.shadowRoot);if(s.noSwiping&&(p?(h=u,function e(t){if(!t||t===document||t===window)return null;let i=t;i.assignedSlot&&(i=i.assignedSlot);const n=i.closest(h);if(!n&&!i.getRootNode)return null;const s=i.getRootNode();return n||e(s.host)}(o)):o.closest(u)))return void(t.allowClick=!0);var h;if(s.swipeHandler&&"string"==typeof s.swipeHandler&&!o.closest(s.swipeHandler))return;const m=i;r.currentX=m.pageX,r.currentY=m.pageY;const f=r.currentX,g=r.currentY;if(!Oa(t,i,f))return;Object.assign(n,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),r.startX=f,r.startY=g,n.touchStartTime=Xr(),n.startEventPath=d,t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,s.threshold>0&&(n.allowThresholdMove=!1);let y=!0;o.matches(n.focusableElements)&&(y=!1,"SELECT"===o.nodeName&&(n.isTouched=!1)),document.activeElement&&document.activeElement.matches(n.focusableElements)&&document.activeElement!==o&&("mouse"===m.pointerType||"mouse"!==m.pointerType&&!o.matches(n.focusableElements))&&document.activeElement.blur();const v=y&&t.allowTouchMove&&s.touchStartPreventDefault;!s.touchStartForcePreventDefault&&!v||o.isContentEditable||i.preventDefault(),s.freeMode&&s.freeMode.enabled&&t.freeMode&&t.animating&&!s.cssMode&&t.freeMode.onTouchStart(),t.emit("touchStart",i)}const Ra=(e,t)=>{const{params:i,el:n,wrapperEl:s,device:r}=e,a=!!i.nested,o="on"===t?"addEventListener":"removeEventListener",l=t;if(!n||"string"==typeof n)return;document[o]("touchstart",e.onDocumentTouchStart,{passive:!1,capture:a}),n[o]("touchstart",e.onTouchStart,{passive:!1}),n[o]("pointerdown",e.onTouchStart,{passive:!1}),document[o]("touchmove",e.onTouchMove,{passive:!1,capture:a}),document[o]("pointermove",e.onTouchMove,{passive:!1,capture:a}),document[o]("touchend",e.onTouchEnd,{passive:!0}),document[o]("pointerup",e.onTouchEnd,{passive:!0}),document[o]("pointercancel",e.onTouchEnd,{passive:!0}),document[o]("touchcancel",e.onTouchEnd,{passive:!0}),document[o]("pointerout",e.onTouchEnd,{passive:!0}),document[o]("pointerleave",e.onTouchEnd,{passive:!0}),document[o]("contextmenu",e.onTouchEnd,{passive:!0}),(i.preventClicks||i.preventClicksPropagation)&&n[o]("click",e.onClick,!0),i.cssMode&&s[o]("scroll",e.onScroll);const c=t=>{e[l](t,Ea,!0)};i.updateOnWindowResize?c(r.ios||r.android?"resize orientationchange observerUpdate":"resize observerUpdate"):c("observerUpdate"),i.lazyPreload&&(n[o]("load",e.onLoad,{capture:!0}),n[o]("error",e.onLoad,{capture:!0}))};var Na={loopCreate:function(e,t){const i=this,{params:n,slidesEl:s}=i;if(!n.loop||i.virtual&&i.params.virtual?.enabled)return;const r=()=>{na(s,`.${n.slideClass}, swiper-slide`).forEach((e,t)=>{e.setAttribute("data-swiper-slide-index",String(t))})},a=i.grid&&n.grid&&n.grid.rows>1;n.loopAddBlankSlides&&(n.slidesPerGroup>1||a)&&(()=>{const e=na(s,`.${n.slideBlankClass}`);e.forEach(e=>{e.remove()}),e.length>0&&(i.recalcSlides(),i.updateSlides())})();const o=n.slidesPerGroup*(a?n.grid.rows:1),l=i.slides.length%o!==0,c=a&&i.slides.length%n.grid.rows!==0,d=e=>{for(let t=0;t<e;t+=1){const e=i.isElement?ra("swiper-slide",[n.slideBlankClass]):ra("div",[n.slideClass,n.slideBlankClass]);i.slidesEl.append(e)}};if(l){if(n.loopAddBlankSlides){d(o-i.slides.length%o),i.recalcSlides(),i.updateSlides()}else sa("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");r()}else if(c){if(n.loopAddBlankSlides){d(n.grid.rows-i.slides.length%n.grid.rows),i.recalcSlides(),i.updateSlides()}else sa("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");r()}else r();const u=n.centeredSlides||!!n.slidesOffsetBefore||!!n.slidesOffsetAfter;i.loopFix({slideRealIndex:e,direction:u?void 0:"next",initial:t})},loopFix:function(e={}){const{slideRealIndex:t,slideTo:i=!0,direction:n,setTranslate:s,activeSlideIndex:r,initial:a,byController:o,byMousewheel:l}=e;let c=r;const d=this;if(!d.params.loop)return;if(d.params.watchOverflow&&d.isLocked)return;d.emit("beforeLoopFix"),d.__loopFixInProgress__=!0;const{slides:u,allowSlidePrev:p,allowSlideNext:h,slidesEl:m,params:f}=d,{centeredSlides:g,slidesOffsetBefore:y,slidesOffsetAfter:v,initialSlide:b}=f,w=g||!!y||!!v;if(d.allowSlidePrev=!0,d.allowSlideNext=!0,d.virtual&&f.virtual?.enabled){if(i){const e=d.virtual.slides.length,t=d.virtual.slidesBefore??0;w||0!==d.snapIndex?w&&d.snapIndex<f.slidesPerView?d.slideTo(e+d.snapIndex,0,!1,!0):d.snapIndex===d.snapGrid.length-1&&d.slideTo(t,0,!1,!0):d.slideTo(e,0,!1,!0)}return d.allowSlidePrev=p,d.allowSlideNext=h,d.__loopFixInProgress__=!1,void d.emit("loopFix")}let x=f.slidesPerView;"auto"===x?x=d.slidesPerViewDynamic():(x=Math.ceil(parseFloat(String(f.slidesPerView))),w&&x%2==0&&(x+=1));const _=f.slidesPerGroupAuto?x:f.slidesPerGroup,$=e=>("function"==typeof e?e.call(d):e)||0,k=d.slidesGrid.length>1?(d.slidesGrid[d.slidesGrid.length-1]-d.slidesGrid[0])/(d.slidesGrid.length-1):d.size,M=k>0?$(y)/k:0,S=k>0?$(v)/k:0;let C=w?Math.max(_,(g?Math.ceil(x/2):0)+Math.ceil(Math.max(M,S))):_;C%_!==0&&(C+=_-C%_),C+=f.loopAdditionalSlides,d.loopedSlides=C;const T=d.grid&&f.grid&&f.grid.rows>1;u.length<x+C||"cards"===d.params.effect&&u.length<x+2*C?sa("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):T&&"row"===f.grid.fill&&sa("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const A=[],E=[],P=T?Math.ceil(u.length/f.grid.rows):u.length,z=a&&P-b<x&&!w;let L=z?b:d.activeIndex;void 0===c?c=d.getSlideIndex(u.find(e=>e.classList.contains(f.slideActiveClass))):L=c;const O="next"===n||!n,q="prev"===n||!n;let R=0,N=0;const I=(T?u[c].column??0:c)+(w&&void 0===s?(g?-x/2+.5:0)-M:0);if(I<C){R=Math.max(C-I,_);for(let e=0;e<C-I;e+=1){const t=e-Math.floor(e/P)*P;if(T){const e=P-t-1;for(let t=u.length-1;t>=0;t-=1)u[t].column===e&&A.push(t)}else A.push(P-t-1)}}else if(I+x>P-C){N=Math.max(I-(P-2*C),_),z&&(N=Math.max(N,x-P+b+1));for(let e=0;e<N;e+=1){const t=e-Math.floor(e/P)*P;T?u.forEach((e,i)=>{e.column===t&&E.push(i)}):E.push(t)}}if(d.__preventObserver__=!0,requestAnimationFrame(()=>{d.__preventObserver__=!1}),"cards"===d.params.effect&&u.length<x+2*C&&(E.includes(c)&&E.splice(E.indexOf(c),1),A.includes(c)&&A.splice(A.indexOf(c),1)),q&&A.forEach(e=>{const t=u[e];t.swiperLoopMoveDOM=!0,m.prepend(t),t.swiperLoopMoveDOM=!1}),O&&E.forEach(e=>{const t=u[e];t.swiperLoopMoveDOM=!0,m.append(t),t.swiperLoopMoveDOM=!1}),d.recalcSlides(),"auto"===f.slidesPerView?d.updateSlides():T&&(A.length>0&&q||E.length>0&&O)&&d.slides.forEach((e,t)=>{d.grid.updateSlide(t,e,d.slides)}),f.watchSlidesProgress&&d.updateSlidesOffset(),i)if(A.length>0&&q){if(void 0===t){const e=d.slidesGrid[L],t=d.slidesGrid[L+R]-e;l?d.setTranslate(d.translate-t):(d.slideTo(L+Math.ceil(R),0,!1,!0),s&&(d.touchEventsData.startTranslate=d.touchEventsData.startTranslate-t,d.touchEventsData.currentTranslate=d.touchEventsData.currentTranslate-t))}else if(s){const e=T?A.length/f.grid.rows:A.length;d.slideTo(d.activeIndex+e,0,!1,!0),d.touchEventsData.currentTranslate=d.translate}}else if(E.length>0&&O)if(void 0===t){const e=d.slidesGrid[L],t=d.slidesGrid[L-N]-e;l?d.setTranslate(d.translate-t):(d.slideTo(L-N,0,!1,!0),s&&(d.touchEventsData.startTranslate=d.touchEventsData.startTranslate-t,d.touchEventsData.currentTranslate=d.touchEventsData.currentTranslate-t))}else{const e=T?E.length/f.grid.rows:E.length;d.slideTo(d.activeIndex-e,0,!1,!0)}d.allowSlidePrev=p,d.allowSlideNext=h;const j=d.controller?.control;if(j&&!o){const e={slideRealIndex:t,direction:n,setTranslate:s,activeSlideIndex:c,byController:!0};Array.isArray(j)?j.forEach(t=>{!t.destroyed&&t.params.loop&&t.loopFix({...e,slideTo:t.params.slidesPerView===f.slidesPerView&&i})}):j instanceof d.constructor&&j.params.loop&&j.loopFix({...e,slideTo:j.params.slidesPerView===f.slidesPerView&&i})}d.__loopFixInProgress__=!1,d.emit("loopFix")},loopDestroy:function(){const e=this,{params:t,slidesEl:i}=e;if(!t.loop||!i||e.virtual&&e.params.virtual?.enabled)return;e.recalcSlides();const n=[];e.slides.forEach(e=>{const t=e,i=void 0===t.swiperSlideIndex?Number(e.getAttribute("data-swiper-slide-index")):t.swiperSlideIndex;n[i]=e}),e.slides.forEach(e=>{e.removeAttribute("data-swiper-slide-index")}),n.forEach(e=>{i.append(e)}),e.recalcSlides(),e.slideTo(e.realIndex,0)}};function Ia(e,t){return function(i={}){const n=Object.keys(i)[0],s=i[n];"object"==typeof s&&null!==s?(!0===e[n]&&(e[n]={enabled:!0}),"navigation"===n&&e[n]&&e[n].enabled&&!e[n].prevEl&&!e[n].nextEl&&(e[n].auto=!0),["pagination","scrollbar"].indexOf(n)>=0&&e[n]&&e[n].enabled&&!e[n].el&&(e[n].auto=!0),n in e&&"enabled"in s?("object"!=typeof e[n]||"enabled"in e[n]||(e[n].enabled=!0),e[n]||(e[n]={enabled:!1}),ta(t,i)):ta(t,i)):ta(t,i)}}var ja={slideTo:function(e=0,t,i=!0,n,s){"string"==typeof e&&(e=parseInt(e,10));const r=this;let a=e;a<0&&(a=0);const{params:o,snapGrid:l,slidesGrid:c,previousIndex:d,activeIndex:u,rtlTranslate:p,wrapperEl:h,enabled:m}=r;if(!m&&!n&&!s||r.destroyed||r.animating&&o.preventInteractionOnTransition)return!1;void 0===t&&(t=r.params.speed);const f=Math.min(r.params.slidesPerGroupSkip,a);let g=f+Math.floor((a-f)/r.params.slidesPerGroup);g>=l.length&&(g=l.length-1);const y=-l[g];if(o.normalizeSlideIndex)for(let e=0;e<c.length;e+=1){const t=-Math.floor(100*y),i=Math.floor(100*c[e]),n=Math.floor(100*c[e+1]);void 0!==c[e+1]?t>=i&&t<n-(n-i)/2?a=e:t>=i&&t<n&&(a=e+1):t>=i&&(a=e)}if(r.initialized&&a!==u){if(!r.allowSlideNext&&(p?y>r.translate&&y>r.minTranslate():y<r.translate&&y<r.minTranslate()))return!1;if(!r.allowSlidePrev&&y>r.translate&&y>r.maxTranslate()&&(u||0)!==a)return!1}let v;a!==(d||0)&&i&&r.emit("beforeSlideChangeStart"),r.updateProgress(y),v=a>u?"next":a<u?"prev":"reset";const b=r.virtual&&r.params.virtual?.enabled;if(!(b&&s)&&(p&&-y===r.translate||!p&&y===r.translate))return r.updateActiveIndex(a),o.autoHeight&&r.updateAutoHeight(),r.updateSlidesClasses(),"slide"!==o.effect&&r.setTranslate(y),"reset"!==v&&(r.transitionStart(i,v),r.transitionEnd(i,v)),!1;if(o.cssMode){const e=r.isHorizontal(),i=p?y:-y;return 0===t?(b&&(r.wrapperEl.style.scrollSnapType="none",r._immediateVirtual=!0),b&&!r._cssModeVirtualInitialSet&&(r.params.initialSlide??0)>0?(r._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{h[e?"scrollLeft":"scrollTop"]=i})):h[e?"scrollLeft":"scrollTop"]=i,b&&requestAnimationFrame(()=>{r.wrapperEl.style.scrollSnapType="",r._immediateVirtual=!1})):h.scrollTo({[e?"left":"top"]:i,behavior:"smooth"}),!0}const w=ya().isSafari;return b&&!s&&w&&r.isElement&&r.virtual.update(!1,!1,a),r.setTransition(t),r.setTranslate(y),r.updateActiveIndex(a),r.updateSlidesClasses(),r.emit("beforeTransitionStart",t,n),r.transitionStart(i,v),0===t?r.transitionEnd(i,v):r.animating||(r.animating=!0,r.onSlideToWrapperTransitionEnd||(r.onSlideToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.wrapperEl.removeEventListener("transitionend",r.onSlideToWrapperTransitionEnd),r.onSlideToWrapperTransitionEnd=null,delete r.onSlideToWrapperTransitionEnd,r.transitionEnd(i,v))}),r.wrapperEl.addEventListener("transitionend",r.onSlideToWrapperTransitionEnd)),!0},slideToLoop:function(e=0,t,i=!0,n){if("string"==typeof e){e=parseInt(e,10)}const s=this;if(s.destroyed)return;void 0===t&&(t=s.params.speed);const r=s.grid&&s.params.grid&&s.params.grid.rows>1;let a=e;if(s.params.loop)if(s.virtual&&s.params.virtual?.enabled)a+=s.virtual.slidesBefore??0;else{let e;if(r){const t=a*s.params.grid.rows,i=s.slides.find(e=>Number(e.getAttribute("data-swiper-slide-index"))===t);e=i?.column??0}else e=s.getSlideIndexByData(a);const t=r?Math.ceil(s.slides.length/s.params.grid.rows):s.slides.length,{centeredSlides:i,slidesOffsetBefore:o,slidesOffsetAfter:l}=s.params,c=i||!!o||!!l;let d;"auto"===s.params.slidesPerView?d=s.slidesPerViewDynamic():(d=Math.ceil(parseFloat(String(s.params.slidesPerView))),c&&d%2==0&&(d+=1));let u=t-e<d;if(c&&(u=u||e<Math.ceil(d/2)),n&&c&&"auto"!==s.params.slidesPerView&&!r&&(u=!1),u){const i=c?e<s.activeIndex?"prev":"next":e-s.activeIndex-1<s.params.slidesPerView?"next":"prev";s.loopFix({direction:i,slideTo:!0,activeSlideIndex:"next"===i?e+1:e-t+1,slideRealIndex:"next"===i?s.realIndex:void 0})}if(r){const e=a*s.params.grid.rows,t=s.slides.find(t=>Number(t.getAttribute("data-swiper-slide-index"))===e);a=t?.column??0}else a=s.getSlideIndexByData(a)}return requestAnimationFrame(()=>{s.slideTo(a,t,i,n)}),s},slideNext:function(e,t=!0,i){const n=this,{enabled:s,params:r,animating:a}=n;if(!s||n.destroyed)return n;void 0===e&&(e=n.params.speed);let o=r.slidesPerGroup;"auto"===r.slidesPerView&&1===r.slidesPerGroup&&r.slidesPerGroupAuto&&(o=Math.max(n.slidesPerViewDynamic("current",!0),1));const l=n.activeIndex<r.slidesPerGroupSkip?1:o,c=n.virtual&&r.virtual?.enabled;if(r.loop){if(a&&!c&&r.loopPreventsSliding)return!1;if(n.loopFix({direction:"next"}),n._clientLeft=n.wrapperEl.clientLeft,n.activeIndex===n.slides.length-1&&r.cssMode)return requestAnimationFrame(()=>{n.slideTo(n.activeIndex+l,e,t,i)}),!0}return r.rewind&&n.isEnd?n.slideTo(0,e,t,i):n.slideTo(n.activeIndex+l,e,t,i)},slidePrev:function(e,t=!0,i){const n=this,{params:s,snapGrid:r,slidesGrid:a,rtlTranslate:o,enabled:l,animating:c}=n;if(!l||n.destroyed)return n;void 0===e&&(e=n.params.speed);const d=n.virtual&&s.virtual?.enabled;if(s.loop){if(c&&!d&&s.loopPreventsSliding)return!1;n.loopFix({direction:"prev"}),n._clientLeft=n.wrapperEl.clientLeft}function u(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}const p=u(o?n.translate:-n.translate),h=r.map(e=>u(e)),m=s.freeMode&&s.freeMode.enabled;let f=r[h.indexOf(p)-1];if(void 0===f&&(s.cssMode||m)){let e;r.forEach((t,i)=>{p>=t&&(e=i)}),void 0!==e&&(f=m?r[e]:r[e>0?e-1:e])}let g=0;if(void 0!==f&&(g=a.indexOf(f),g<0&&(g=n.activeIndex-1),"auto"===s.slidesPerView&&1===s.slidesPerGroup&&s.slidesPerGroupAuto&&(g=g-n.slidesPerViewDynamic("previous",!0)+1,g=Math.max(g,0))),s.rewind&&n.isBeginning){const s=n.params.virtual?.enabled&&n.virtual?n.virtual.slides.length-1:n.slides.length-1;return n.slideTo(s,e,t,i)}return s.loop&&0===n.activeIndex&&s.cssMode?(requestAnimationFrame(()=>{n.slideTo(g,e,t,i)}),!0):n.slideTo(g,e,t,i)},slideReset:function(e,t=!0,i){const n=this;if(!n.destroyed)return void 0===e&&(e=n.params.speed),n.slideTo(n.activeIndex,e,t,i)},slideToClosest:function(e,t=!0,i,n=.5){const s=this;if(s.destroyed)return;void 0===e&&(e=s.params.speed);let r=s.activeIndex;const a=Math.min(s.params.slidesPerGroupSkip,r),o=a+Math.floor((r-a)/s.params.slidesPerGroup),l=s.rtlTranslate?s.translate:-s.translate;if(l>=s.snapGrid[o]){const e=s.snapGrid[o];l-e>(s.snapGrid[o+1]-e)*n&&(r+=s.params.slidesPerGroup)}else{const e=s.snapGrid[o-1];l-e<=(s.snapGrid[o]-e)*n&&(r-=s.params.slidesPerGroup)}return r=Math.max(r,0),r=Math.min(r,s.slidesGrid.length-1),s.slideTo(r,e,t,i)},slideToClickedSlide:function(){const e=this;if(e.destroyed)return;const{params:t,slidesEl:i,clickedSlide:n,clickedIndex:s}=e;if(void 0===n||void 0===s)return;const r="auto"===t.slidesPerView?e.slidesPerViewDynamic():t.slidesPerView;let a,o=e.getSlideIndexWhenGrid(s);const l=e.isElement?"swiper-slide":`.${t.slideClass}`,c=e.grid&&e.params.grid&&e.params.grid.rows>1;if(t.loop){if(e.animating)return;a=parseInt(n.getAttribute("data-swiper-slide-index"),10),t.centeredSlides?e.slideToLoop(a):o>(c?(e.slides.length-r)/2-(e.params.grid.rows-1):e.slides.length-r)?(e.loopFix(),o=e.getSlideIndex(na(i,`${l}[data-swiper-slide-index="${a}"]`)[0]),Yr(()=>{e.slideTo(o)})):e.slideTo(o)}else e.slideTo(o)}};function Da({swiper:e,runCallbacks:t,direction:i,step:n}){const{activeIndex:s,previousIndex:r}=e;let a=i;a||(a=s>r?"next":s<r?"prev":"reset"),e.emit(`transition${n}`),t&&"reset"===a?e.emit(`slideResetTransition${n}`):t&&s!==r&&(e.emit(`slideChangeTransition${n}`),"next"===a?e.emit(`slideNextTransition${n}`):e.emit(`slidePrevTransition${n}`))}var Ba={getTranslate:function(e=(this.isHorizontal()?"x":"y")){const{params:t,rtlTranslate:i,translate:n,wrapperEl:s}=this;if(t.virtualTranslate)return i?-n:n;if(t.cssMode)return n;let r=Kr(s,e);return r+=this.cssOverflowAdjustment(),i&&(r=-r),r||0},setTranslate:function(e,t){const i=this,{rtlTranslate:n,params:s,wrapperEl:r,progress:a}=i;let o,l=0,c=0;i.isHorizontal()?l=n?-e:e:c=e,s.roundLengths&&(l=Math.floor(l),c=Math.floor(c)),i.previousTranslate=i.translate,i.translate=i.isHorizontal()?l:c,s.cssMode?r[i.isHorizontal()?"scrollLeft":"scrollTop"]=i.isHorizontal()?-l:-c:s.virtualTranslate||(i.isHorizontal()?l-=i.cssOverflowAdjustment():c-=i.cssOverflowAdjustment(),r.style.transform=`translate3d(${l}px, ${c}px, 0px)`);const d=i.maxTranslate()-i.minTranslate();o=0===d?0:(e-i.minTranslate())/d,o!==a&&i.updateProgress(e),i.emit("setTranslate",i.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e=0,t=this.params.speed,i=!0,n=!0,s){const r=this,{params:a,wrapperEl:o}=r;if(r.animating&&a.preventInteractionOnTransition)return!1;const l=r.minTranslate(),c=r.maxTranslate();let d;if(d=n&&e>l?l:n&&e<c?c:e,r.updateProgress(d),a.cssMode){const e=r.isHorizontal();return 0===t?o[e?"scrollLeft":"scrollTop"]=-d:o.scrollTo({[e?"left":"top"]:-d,behavior:"smooth"}),!0}return 0===t?(r.setTransition(0),r.setTranslate(d),i&&(r.emit("beforeTransitionStart",t,s),r.emit("transitionEnd"))):(r.setTransition(t),r.setTranslate(d),i&&(r.emit("beforeTransitionStart",t,s),r.emit("transitionStart")),r.animating||(r.animating=!0,r.onTranslateToWrapperTransitionEnd||(r.onTranslateToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.wrapperEl.removeEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.onTranslateToWrapperTransitionEnd=null,delete r.onTranslateToWrapperTransitionEnd,r.animating=!1,i&&r.emit("transitionEnd"))}),r.wrapperEl.addEventListener("transitionend",r.onTranslateToWrapperTransitionEnd))),!0}};const Wa=(e,t,i)=>{t&&!e.classList.contains(i)?e.classList.add(i):!t&&e.classList.contains(i)&&e.classList.remove(i)};const Fa=(e,t,i)=>{t&&!e.classList.contains(i)?e.classList.add(i):!t&&e.classList.contains(i)&&e.classList.remove(i)};var Ha={updateSize:function(){const e=this;let t,i;const n=e.el;t=void 0!==e.params.width&&null!==e.params.width?e.params.width:n.clientWidth,i=void 0!==e.params.height&&null!==e.params.height?e.params.height:n.clientHeight,0===t&&e.isHorizontal()||0===i&&e.isVertical()||(t=t-parseInt(aa(n,"padding-left")||"0",10)-parseInt(aa(n,"padding-right")||"0",10),i=i-parseInt(aa(n,"padding-top")||"0",10)-parseInt(aa(n,"padding-bottom")||"0",10),Number.isNaN(t)&&(t=0),Number.isNaN(i)&&(i=0),Object.assign(e,{width:t,height:i,size:e.isHorizontal()?t:i}))},updateSlides:function(){const e=this;function t(t,i){return parseFloat(t.getPropertyValue(e.getDirectionLabel(i))||"0")}const i=e.params,{wrapperEl:n,slidesEl:s,rtlTranslate:r,wrongRTL:a}=e,o=!(!e.virtual||!i.virtual?.enabled),l=o?e.virtual.slides.length:e.slides.length,c=na(s,`.${e.params.slideClass}, swiper-slide`),d=o?e.virtual.slides.length:c.length;let u=[];const p=[],h=[],m=t=>"function"==typeof t?t.call(e):t,f=m(i.slidesOffsetBefore),g=m(i.slidesOffsetAfter),y=e.snapGrid.length,v=e.slidesGrid.length,b=e.size-f-g;let w=i.spaceBetween,x=-f,_=0,$=0;if(void 0===b)return;"string"==typeof w&&w.indexOf("%")>=0?w=parseFloat(w.replace("%",""))/100*b:"string"==typeof w&&(w=parseFloat(w)),e.virtualSize=-w-f-g,c.forEach(e=>{r?e.style.marginLeft="":e.style.marginRight="",e.style.marginBottom="",e.style.marginTop=""}),i.centeredSlides&&i.cssMode&&(ia(n,"--swiper-centered-offset-before",""),ia(n,"--swiper-centered-offset-after","")),i.cssMode&&(ia(n,"--swiper-slides-offset-before",`${f}px`),ia(n,"--swiper-slides-offset-after",`${g}px`));const k=i.grid&&i.grid.rows>1&&e.grid;k?e.grid.initSlides(c):e.grid&&e.grid.unsetSlides();let M=0;const S="auto"===i.slidesPerView&&i.breakpoints&&Object.keys(i.breakpoints).filter(e=>{const t=i.breakpoints[e];return void 0!==t?.slidesPerView}).length>0;for(let n=0;n<d;n+=1){M=0;const s=c[n];if(!s||(k&&e.grid.updateSlide(n,s,c),"none"!==aa(s,"display"))){if(o&&"auto"===i.slidesPerView)i.virtual?.slidesPerViewAutoSlideSize&&(M=i.virtual.slidesPerViewAutoSlideSize),M&&s&&(i.roundLengths&&(M=Math.floor(M)),s.style[e.getDirectionLabel("width")]=`${M}px`);else if("auto"===i.slidesPerView){S&&(s.style[e.getDirectionLabel("width")]="");const n=getComputedStyle(s),r=s.style.transform,a=s.style.webkitTransform;if(r&&(s.style.transform="none"),a&&(s.style.webkitTransform="none"),i.roundLengths)M=e.isHorizontal()?ca(s,"width"):ca(s,"height");else{const e=t(n,"width"),i=t(n,"padding-left"),r=t(n,"padding-right"),a=t(n,"margin-left"),o=t(n,"margin-right"),l=n.getPropertyValue("box-sizing");if(l&&"border-box"===l)M=e+a+o;else{const{clientWidth:t,offsetWidth:n}=s;M=e+i+r+a+o+(n-t)}}r&&(s.style.transform=r),a&&(s.style.webkitTransform=a),i.roundLengths&&(M=Math.floor(M))}else M=(b-(i.slidesPerView-1)*w)/i.slidesPerView,i.roundLengths&&(M=Math.floor(M)),s&&(s.style[e.getDirectionLabel("width")]=`${M}px`);s&&(s.swiperSlideSize=M),h.push(M),i.centeredSlides?(x=x+M/2+_/2+w,0===_&&0!==n&&(x=x-b/2-w),0===n&&(x=x-b/2-w),Math.abs(x)<.001&&(x=0),i.roundLengths&&(x=Math.floor(x)),$%i.slidesPerGroup===0&&u.push(x),p.push(x)):(i.roundLengths&&(x=Math.floor(x)),($-Math.min(e.params.slidesPerGroupSkip,$))%e.params.slidesPerGroup===0&&u.push(x),p.push(x),x=x+M+w),e.virtualSize+=M+w,_=M,$+=1}}if(e.virtualSize=Math.max(e.virtualSize,b)+g,r&&a&&("slide"===i.effect||"coverflow"===i.effect)&&(n.style.width=`${e.virtualSize+w}px`),i.setWrapperSize&&(n.style[e.getDirectionLabel("width")]=`${e.virtualSize+w}px`),k&&e.grid.updateWrapperSize(M,u),!i.centeredSlides){const t="auto"!==i.slidesPerView&&i.slidesPerView%1!=0,n=i.snapToSlideEdge&&!i.loop&&("auto"===i.slidesPerView||t);let s=u.length;if(n){let e;if("auto"===i.slidesPerView){e=1;let t=0;for(let i=h.length-1;i>=0&&(t+=h[i]+(i<h.length-1?w:0),t<=b);i-=1)e=h.length-i}else e=Math.floor(i.slidesPerView);s=Math.max(d-e,0)}const r=[];for(let t=0;t<u.length;t+=1){let a=u[t];i.roundLengths&&(a=Math.floor(a)),n?t<=s&&r.push(a):u[t]<=e.virtualSize-b&&r.push(a)}u=r,Math.floor(e.virtualSize-b)-Math.floor(u[u.length-1])>1&&(n||u.push(e.virtualSize-b))}if(o&&i.loop){const t=h[0]+w,n=(e.virtual.slidesBefore??0)+(e.virtual.slidesAfter??0);if(i.slidesPerGroup>1){const e=Math.ceil(n/i.slidesPerGroup),s=t*i.slidesPerGroup;for(let t=0;t<e;t+=1)u.push(u[u.length-1]+s)}for(let s=0;s<n;s+=1)1===i.slidesPerGroup&&u.push(u[u.length-1]+t),p.push(p[p.length-1]+t),e.virtualSize+=t}if(0===u.length&&(u=[0]),0!==w){const t=e.isHorizontal()&&r?"marginLeft":e.getDirectionLabel("marginRight");c.filter((e,t)=>!(i.cssMode&&!i.loop)||t!==c.length-1).forEach(e=>{e.style[t]=`${w}px`})}if(i.centeredSlides&&i.centeredSlidesBounds){let e=0;h.forEach(t=>{e+=t+(w||0)}),e-=w;const t=e>b?e-b:0;u=u.map(e=>e<=0?-f:e>t?t+g:e)}if(i.centerInsufficientSlides){let e=0;if(h.forEach(t=>{e+=t+(w||0)}),e-=w,e<b){const t=(b-e)/2;u.forEach((e,i)=>{u[i]=e-t}),p.forEach((e,i)=>{p[i]=e+t})}}if(Object.assign(e,{slides:c,snapGrid:u,slidesGrid:p,slidesSizesGrid:h}),i.centeredSlides&&i.cssMode&&!i.centeredSlidesBounds){ia(n,"--swiper-centered-offset-before",-u[0]+"px"),ia(n,"--swiper-centered-offset-after",e.size/2-h[h.length-1]/2+"px");const t=-e.snapGrid[0],i=-e.slidesGrid[0];e.snapGrid=e.snapGrid.map(e=>e+t),e.slidesGrid=e.slidesGrid.map(e=>e+i)}if(d!==l&&e.emit("slidesLengthChange"),u.length!==y&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),p.length!==v&&e.emit("slidesGridLengthChange"),i.watchSlidesProgress&&e.updateSlidesOffset(),e.emit("slidesUpdated"),!(o||i.cssMode||"slide"!==i.effect&&"fade"!==i.effect)){const t=`${i.containerModifierClass}backface-hidden`,n=e.el.classList.contains(t);d<=i.maxBackfaceHiddenSlides?n||e.el.classList.add(t):n&&e.el.classList.remove(t)}},updateAutoHeight:function(e){const t=this,i=[],n=t.virtual&&t.params.virtual?.enabled;let s,r=0;"number"==typeof e?t.setTransition(e):!0===e&&t.setTransition(t.params.speed);const a=e=>n?t.slides[t.getSlideIndexByData(e)]:t.slides[e];if("auto"!==t.params.slidesPerView&&t.params.slidesPerView>1)if(t.params.centeredSlides)(t.visibleSlides||[]).forEach(e=>{i.push(e)});else for(s=0;s<Math.ceil(t.params.slidesPerView);s+=1){const e=t.activeIndex+s;if(e>t.slides.length&&!n)break;const r=a(e);r&&i.push(r)}else{const e=a(t.activeIndex);e&&i.push(e)}for(s=0;s<i.length;s+=1)if(void 0!==i[s]){const e=i[s].offsetHeight;r=e>r?e:r}(r||0===r)&&(t.wrapperEl.style.height=`${r}px`)},updateSlidesOffset:function(){const e=this,t=e.slides,i=e.isElement?e.isHorizontal()?e.wrapperEl.offsetLeft:e.wrapperEl.offsetTop:0;for(let n=0;n<t.length;n+=1)t[n].swiperSlideOffset=(e.isHorizontal()?t[n].offsetLeft:t[n].offsetTop)-i-e.cssOverflowAdjustment()},updateSlidesProgress:function(e=this&&this.translate||0){const t=this,i=t.params,{slides:n,rtlTranslate:s,snapGrid:r}=t;if(0===n.length)return;void 0===n[0].swiperSlideOffset&&t.updateSlidesOffset();let a=-e;s&&(a=e),t.visibleSlidesIndexes=[],t.visibleSlides=[];let o=i.spaceBetween;"string"==typeof o&&o.indexOf("%")>=0?o=parseFloat(o.replace("%",""))/100*t.size:"string"==typeof o&&(o=parseFloat(o));for(let e=0;e<n.length;e+=1){const l=n[e];let c=l.swiperSlideOffset??0;i.cssMode&&i.centeredSlides&&(c-=n[0].swiperSlideOffset??0);const d=l.swiperSlideSize??0,u=(a+(i.centeredSlides?t.minTranslate():0)-c)/(d+o),p=(a-r[0]+(i.centeredSlides?t.minTranslate():0)-c)/(d+o),h=-(a-c),m=h+t.slidesSizesGrid[e],f=h>=0&&h<=t.size-t.slidesSizesGrid[e],g=h>=0&&h<t.size-1||m>1&&m<=t.size||h<=0&&m>=t.size;g&&(t.visibleSlides.push(l),t.visibleSlidesIndexes.push(e)),Fa(l,g,i.slideVisibleClass),Fa(l,f,i.slideFullyVisibleClass),l.progress=s?-u:u,l.originalProgress=s?-p:p}},updateProgress:function(e){const t=this;if(void 0===e){const i=t.rtlTranslate?-1:1;e=t&&t.translate&&t.translate*i||0}const i=t.params,n=t.maxTranslate()-t.minTranslate();let{progress:s,isBeginning:r,isEnd:a}=t,o=t.progressLoop;const l=r,c=a;if(0===n)s=0,r=!0,a=!0;else{s=(e-t.minTranslate())/n;const i=Math.abs(e-t.minTranslate())<1,o=Math.abs(e-t.maxTranslate())<1;r=i||s<=0,a=o||s>=1,i&&(s=0),o&&(s=1)}if(i.loop){const i=t.getSlideIndexByData(0),n=t.getSlideIndexByData(t.slides.length-1),s=t.slidesGrid[i],r=t.slidesGrid[n],a=t.slidesGrid[t.slidesGrid.length-1],l=Math.abs(e);o=l>=s?(l-s)/a:(l+a-r)/a,o>1&&(o-=1)}Object.assign(t,{progress:s,progressLoop:o,isBeginning:r,isEnd:a}),(i.watchSlidesProgress||i.centeredSlides&&i.autoHeight)&&t.updateSlidesProgress(e),r&&!l&&t.emit("reachBeginning toEdge"),a&&!c&&t.emit("reachEnd toEdge"),(l&&!r||c&&!a)&&t.emit("fromEdge"),t.emit("progress",s)},updateSlidesClasses:function(){const e=this,{slides:t,params:i,slidesEl:n,activeIndex:s}=e,r=!(!e.virtual||!i.virtual?.enabled),a=e.grid&&i.grid&&i.grid.rows>1,o=e=>na(n,`.${i.slideClass}${e}, swiper-slide${e}`)[0];let l,c,d;if(r)if(i.loop){const t=e.virtual.slides;let i=s-(e.virtual.slidesBefore??0);i<0&&(i=t.length+i),i>=t.length&&(i-=t.length),l=o(`[data-swiper-slide-index="${i}"]`)}else l=o(`[data-swiper-slide-index="${s}"]`);else a?(l=t.find(e=>e.column===s),d=t.find(e=>e.column===s+1),c=t.find(e=>e.column===s-1)):l=t[s];l&&(a||(d=function(e,t){const i=[];let n=e.nextElementSibling;for(;n;)t&&!n.matches(t)||i.push(n),n=n.nextElementSibling;return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&!d&&(d=t[0]),c=function(e,t){const i=[];let n=e.previousElementSibling;for(;n;)t&&!n.matches(t)||i.push(n),n=n.previousElementSibling;return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&0===!c&&(c=t[t.length-1]))),t.forEach(e=>{Wa(e,e===l,i.slideActiveClass),Wa(e,e===d,i.slideNextClass),Wa(e,e===c,i.slidePrevClass)}),e.emitSlidesClasses()},updateActiveIndex:function(e){const t=this,i=t.rtlTranslate?t.translate:-t.translate,{snapGrid:n,params:s,activeIndex:r,realIndex:a,snapIndex:o}=t;let l,c=e;const d=e=>{const i=t.virtual.slides;let n=e-(t.virtual.slidesBefore??0);return n<0&&(n=i.length+n),n>=i.length&&(n-=i.length),n};if(void 0===c&&(c=function(e){const{slidesGrid:t,params:i}=e,n=e.rtlTranslate?e.translate:-e.translate;let s;for(let e=0;e<t.length;e+=1)void 0!==t[e+1]?n>=t[e]&&n<t[e+1]-(t[e+1]-t[e])/2?s=e:n>=t[e]&&n<t[e+1]&&(s=e+1):n>=t[e]&&(s=e);return i.normalizeSlideIndex&&(s<0||void 0===s)&&(s=0),s}(t)),n.indexOf(i)>=0)l=n.indexOf(i);else{const e=Math.min(s.slidesPerGroupSkip,c);l=e+Math.floor((c-e)/s.slidesPerGroup)}if(l>=n.length&&(l=n.length-1),c===r&&!t.params.loop)return void(l!==o&&(t.snapIndex=l,t.emit("snapIndexChange")));if(c===r&&t.params.loop&&t.virtual&&t.params.virtual?.enabled)return void(t.realIndex=d(c));const u=t.grid&&s.grid&&s.grid.rows>1;let p;if(t.virtual&&s.virtual?.enabled)p=s.loop?d(c):c;else if(u){const e=t.slides.find(e=>e.column===c);let i=parseInt(e.getAttribute("data-swiper-slide-index"),10);Number.isNaN(i)&&(i=Math.max(t.slides.indexOf(e),0)),p=Math.floor(i/s.grid.rows)}else if(t.slides[c]){const e=t.slides[c].getAttribute("data-swiper-slide-index");p=e?parseInt(e,10):c}else p=c;Object.assign(t,{previousSnapIndex:o,snapIndex:l,previousRealIndex:a,realIndex:p,previousIndex:r,activeIndex:c}),t.initialized&&wa(t),t.__loopFixInProgress__||(t.emit("activeIndexChange"),t.emit("snapIndexChange"),(t.initialized||t.params.runCallbacksOnInit)&&((t.__lastEmittedRealIndex__??a)!==p&&t.emit("realIndexChange"),t.emit("slideChange")),t.__lastEmittedRealIndex__=p)},updateClickedSlide:function(e,t){const i=this,n=i.params;let s=e.closest(`.${n.slideClass}, swiper-slide`);!s&&i.isElement&&t&&t.length>1&&t.includes(e)&&[...t.slice(t.indexOf(e)+1,t.length)].forEach(e=>{!s&&e.matches&&e.matches(`.${n.slideClass}, swiper-slide`)&&(s=e)});let r,a=!1;if(s)for(let e=0;e<i.slides.length;e+=1)if(i.slides[e]===s){a=!0,r=e;break}if(!s||!a)return i.clickedSlide=void 0,void(i.clickedIndex=void 0);i.clickedSlide=s,i.virtual&&i.params.virtual?.enabled?i.clickedIndex=parseInt(s.getAttribute("data-swiper-slide-index"),10):i.clickedIndex=r,n.slideToClickedSlide&&void 0!==i.clickedIndex&&i.clickedIndex!==i.activeIndex&&i.slideToClickedSlide()}};const Ga={eventsEmitter:Sa,update:Ha,translate:Ba,transition:{setTransition:function(e,t){const i=this;i.params.cssMode||(i.wrapperEl.style.transitionDuration=`${e}ms`,i.wrapperEl.style.transitionDelay=0===e?"0ms":""),i.emit("setTransition",e,t)},transitionStart:function(e=!0,t){const i=this,{params:n}=i;n.cssMode||(n.autoHeight&&i.updateAutoHeight(),Da({swiper:i,runCallbacks:e,direction:t,step:"Start"}))},transitionEnd:function(e=!0,t){const i=this,{params:n}=i;i.animating=!1,n.cssMode||(i.setTransition(0),Da({swiper:i,runCallbacks:e,direction:t,step:"End"}))}},slide:ja,loop:Na,grabCursor:{setGrabCursor:function(e){const t=this;if(!t.params.simulateTouch||t.params.watchOverflow&&t.isLocked||t.params.cssMode)return;const i="container"===t.params.touchEventsTarget?t.el:t.wrapperEl;t.isElement&&(t.__preventObserver__=!0),i.style.cursor="move",i.style.cursor=e?"grabbing":"grab",t.isElement&&requestAnimationFrame(()=>{t.__preventObserver__=!1})},unsetGrabCursor:function(){const e=this;e.params.watchOverflow&&e.isLocked||e.params.cssMode||(e.isElement&&(e.__preventObserver__=!0),e["container"===e.params.touchEventsTarget?"el":"wrapperEl"].style.cursor="",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1}))}},events:{attachEvents:function(){const e=this,{params:t}=e;e.onTouchStart=qa.bind(e),e.onTouchMove=La.bind(e),e.onTouchEnd=za.bind(e),e.onDocumentTouchStart=Ta.bind(e),t.cssMode&&(e.onScroll=Pa.bind(e)),e.onClick=Ca.bind(e),e.onLoad=Aa.bind(e),Ra(e,"on")},detachEvents:function(){Ra(this,"off")}},breakpoints:_a,checkOverflow:$a,classes:ka},Ja={};class Ua{static extendedDefaults;static defaults;constructor(...e){let t,i;if(1===e.length&&null!==e[0]&&"object"==typeof e[0]&&"Object"===Object.prototype.toString.call(e[0]).slice(8,-1)?i=e[0]:[t,i]=e,i||(i={}),i=ta({},i),t&&!i.el&&(i.el=t),i.el&&"string"==typeof i.el&&"undefined"!=typeof document&&document.querySelectorAll(i.el).length>1){const e=[];return document.querySelectorAll(i.el).forEach(t=>{const n=ta({},i,{el:t});e.push(new Ua(n))}),e}const n=this;n.__swiper__=!0,n.support=fa(),n.device=ga({userAgent:i.userAgent??void 0}),n.browser=ya(),n.eventsListeners={},n.eventsAnyListeners=[],n.modules=[...n.__modules__||[]],i.modules&&Array.isArray(i.modules)&&i.modules.forEach(e=>{const t=e;"function"==typeof t&&n.modules.indexOf(t)<0&&n.modules.push(t)});const s={};n.modules.forEach(e=>{e({params:i,swiper:n,extendParams:Ia(i,s),on:n.on.bind(n),once:n.once.bind(n),off:n.off.bind(n),emit:n.emit.bind(n)})});const r=ta({},Ma,s);if(n.params=ta({},r,Ja,i),n.originalParams=ta({},n.params),n.passedParams=ta({},i),n.params&&n.params.on){const e=n.params.on;Object.keys(e).forEach(t=>{const i=e[t];i&&n.on(t,i)})}return n.params&&n.params.onAny&&n.onAny(n.params.onAny),Object.assign(n,{enabled:n.params.enabled,el:t,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:()=>"horizontal"===n.params.direction,isVertical:()=>"vertical"===n.params.direction,activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:n.params.allowSlideNext,allowSlidePrev:n.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:n.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:n.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),n.emit("_swiper"),n.params.init&&n.init(),n}getDirectionLabel(e){return this.isHorizontal()?e:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[e]}isHorizontal(){return"horizontal"===this.params.direction}isVertical(){return"vertical"===this.params.direction}cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23}getSlideIndex(e){const{slidesEl:t,params:i}=this,n=oa(na(t,`.${i.slideClass}, swiper-slide`)[0]);return oa(e)-(n??0)}getSlideIndexByData(e){return this.getSlideIndex(this.slides.find(t=>Number(t.getAttribute("data-swiper-slide-index"))===e))}getSlideIndexWhenGrid(e){return this.grid&&this.params.grid&&this.params.grid.rows>1&&("column"===this.params.grid.fill?e=Math.floor(e/this.params.grid.rows):"row"===this.params.grid.fill&&(e%=Math.ceil(this.slides.length/this.params.grid.rows))),e}recalcSlides(){const{slidesEl:e,params:t}=this;this.slides=na(e,`.${t.slideClass}, swiper-slide`)}enable(){this.enabled||(this.enabled=!0,this.params.grabCursor&&this.setGrabCursor(),this.emit("enable"))}disable(){this.enabled&&(this.enabled=!1,this.params.grabCursor&&this.unsetGrabCursor(),this.emit("disable"))}setProgress(e,t){e=Math.min(Math.max(e,0),1);const i=this.minTranslate(),n=(this.maxTranslate()-i)*e+i;this.translateTo(n,void 0===t?0:t),this.updateActiveIndex(),this.updateSlidesClasses()}emitContainerClasses(){if(!this.params._emitClasses||!this.el)return;const e=this.el.className.split(" ").filter(e=>0===e.indexOf("swiper")||0===e.indexOf(this.params.containerModifierClass));this.emit("_containerClasses",e.join(" "))}getSlideClasses(e){return this.destroyed?"":e.className.split(" ").filter(e=>0===e.indexOf("swiper-slide")||0===e.indexOf(this.params.slideClass)).join(" ")}emitSlidesClasses(){if(!this.params._emitClasses||!this.el)return;const e=[];this.slides.forEach(t=>{const i=this.getSlideClasses(t);e.push({slideEl:t,classNames:i}),this.emit("_slideClass",t,i)}),this.emit("_slideClasses",e)}slidesPerViewDynamic(e="current",t=!1){const{params:i,slides:n,slidesGrid:s,slidesSizesGrid:r,size:a,activeIndex:o}=this;let l=1;if("number"==typeof i.slidesPerView)return i.slidesPerView;if(!a)return l;if(i.centeredSlides){let e=n[o]?Math.ceil(n[o].swiperSlideSize??0):0,t=!1;for(let i=o+1;i<n.length;i+=1)n[i]&&!t&&(e+=Math.ceil(n[i].swiperSlideSize??0),l+=1,e>a&&(t=!0));for(let i=o-1;i>=0;i-=1)n[i]&&!t&&(e+=n[i].swiperSlideSize??0,l+=1,e>a&&(t=!0))}else if("current"===e)for(let e=o+1;e<n.length;e+=1){(t?s[e]+r[e]-s[o]<a:s[e]-s[o]<a)&&(l+=1)}else for(let e=o-1;e>=0;e-=1){s[o]-s[e]<a&&(l+=1)}return l}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:t,params:i}=e;function n(){const t=e.rtlTranslate?-1*e.translate:e.translate,i=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(i),e.updateActiveIndex(),e.updateSlidesClasses()}let s;if(i.breakpoints&&e.setBreakpoint(),i.lazyPreload&&[...e.el.querySelectorAll('[loading="lazy"]')].forEach(t=>{t.complete&&va(e,t)}),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),i.freeMode?.enabled&&!i.cssMode)n(),i.autoHeight&&e.updateAutoHeight();else{if(("auto"===i.slidesPerView||i.slidesPerView>1)&&e.isEnd&&!i.centeredSlides){const t=e.virtual&&i.virtual?.enabled?e.virtual.slides.length:e.slides.length;s=e.slideTo(t-1,0,!1,!0)}else s=e.slideTo(e.activeIndex,0,!1,!0);s||n()}i.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,t=!0){const i=this,n=i.params.direction;return e||(e="horizontal"===n?"vertical":"horizontal"),e===n||"horizontal"!==e&&"vertical"!==e||(i.el.classList.remove(`${i.params.containerModifierClass}${n}`),i.el.classList.add(`${i.params.containerModifierClass}${e}`),i.emitContainerClasses(),i.params.direction=e,i.rtlTranslate="horizontal"===e&&i.rtl,i.slides.forEach(t=>{"vertical"===e?t.style.width="":t.style.height=""}),i.emit("changeDirection"),t&&i.update()),i}changeLanguageDirection(e){const t=this;t.rtl&&"rtl"===e||!t.rtl&&"ltr"===e||(t.rtl="rtl"===e,t.rtlTranslate="horizontal"===t.params.direction&&t.rtl,t.rtl?(t.el.classList.add(`${t.params.containerModifierClass}rtl`),t.el.dir="rtl"):(t.el.classList.remove(`${t.params.containerModifierClass}rtl`),t.el.dir="ltr"),t.update())}mount(e){const t=this;if(t.mounted)return!0;if("undefined"==typeof document)return!1;const i=e??t.params.el;let n=null;if("string"==typeof i?n=document.querySelector(i):i instanceof HTMLElement&&(n=i),!n)return!1;n.swiper=t;const s=n.parentNode;s&&s.host&&s.host.nodeName===t.params.swiperElementNodeName.toUpperCase()&&(t.isElement=!0);const r=()=>`.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;let a=(()=>{if(n&&n.shadowRoot){return n.shadowRoot.querySelector(r())}return na(n,r())[0]})();!a&&t.params.createElements&&(a=ra("div",t.params.wrapperClass),n.append(a),na(n,`.${t.params.slideClass}`).forEach(e=>{a.append(e)}));const o=t.isElement?n.parentNode.host:null;return Object.assign(t,{el:n,wrapperEl:a,slidesEl:t.isElement&&!o.slideSlots?o:a,hostEl:t.isElement?o:n,mounted:!0,rtl:"rtl"===n.dir.toLowerCase()||"rtl"===aa(n,"direction"),rtlTranslate:"horizontal"===t.params.direction&&("rtl"===n.dir.toLowerCase()||"rtl"===aa(n,"direction")),wrongRTL:"-webkit-box"===aa(a,"display")}),!0}init(e){const t=this;if(t.initialized)return t;if(!1===t.mount(e))return t;if(t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.loop&&t.virtual&&t.params.virtual?.enabled?t.slideTo((t.params.initialSlide??0)+(t.virtual.slidesBefore??0),0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.params.loop&&t.loopCreate(void 0,!0),t.attachEvents(),t.params.lazyPreload){const e=[...t.el.querySelectorAll('[loading="lazy"]')];t.isElement&&e.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),e.forEach(e=>{e.complete&&va(t,e)})}return t.initialized=!0,wa(t),t.emit("init"),t.emit("afterInit"),t}destroy(e=!0,t=!0){const i=this,{params:n,el:s,wrapperEl:r,slides:a}=i;return void 0===i.params||i.destroyed||(i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),n.loop&&i.loopDestroy(),t&&(i.removeClasses(),s&&"string"!=typeof s&&s.removeAttribute("style"),r&&r.removeAttribute("style"),a&&a.length&&a.forEach(e=>{e.classList.remove(n.slideVisibleClass,n.slideFullyVisibleClass,n.slideActiveClass,n.slideNextClass,n.slidePrevClass),e.removeAttribute("style"),e.removeAttribute("data-swiper-slide-index")})),i.emit("destroy"),Object.keys(i.eventsListeners).forEach(e=>{i.off(e)}),!1!==e&&(i.el&&"string"!=typeof i.el&&(i.el.swiper=null),o=i,Object.keys(o).forEach(e=>{try{o[e]=null}catch{}try{delete o[e]}catch{}})),i.destroyed=!0),null;var o}static extendDefaults(e){ta(Ja,e)}static installModule(e){Ua.prototype.__modules__||(Ua.prototype.__modules__=[]);const t=Ua.prototype.__modules__;"function"==typeof e&&t.indexOf(e)<0&&t.push(e)}static use(e){return Array.isArray(e)?(e.forEach(e=>Ua.installModule(e)),Ua):(Ua.installModule(e),Ua)}}Object.defineProperty(Ua,"extendedDefaults",{get:()=>Ja}),Object.defineProperty(Ua,"defaults",{get:()=>Ma});const Va=Ga,Za=Ua.prototype;function Ya(e,t,i,n){const s=i??{},r=t??{};return e.params.createElements&&Object.keys(n).forEach(t=>{if(!s[t]&&!0===s.auto){let i=na(e.el,`.${n[t]}`)[0];i||(i=ra("div",n[t]),i.className=n[t],e.el.append(i)),s[t]=i,r[t]=i}}),s}Object.keys(Va).forEach(e=>{const t=Va[e];Object.keys(t).forEach(e=>{Za[e]=t[e]})}),Ua.use([({swiper:e,on:t,emit:i})=>{let n=null,s=null;const r=()=>{e&&!e.destroyed&&e.initialized&&(i("beforeResize"),i("resize"))},a=()=>{e&&!e.destroyed&&e.initialized&&i("orientationchange")};t("init",()=>{e.params.resizeObserver&&void 0!==window.ResizeObserver?(()=>{if(!e||e.destroyed||!e.initialized)return;let t=e.width,i=e.height;n=new ResizeObserver(n=>{s=window.requestAnimationFrame(()=>{let s=t,a=i;n.forEach(({contentBoxSize:t,contentRect:i,target:n})=>{if(n&&n!==e.el)return;const r=Array.isArray(t)?t[0]:t;s=i?i.width:r.inlineSize,a=i?i.height:r.blockSize}),s===t&&a===i||(t=s,i=a,r())})}),n.observe(e.el)})():(window.addEventListener("resize",r),window.addEventListener("orientationchange",a))}),t("destroy",()=>{s&&window.cancelAnimationFrame(s),n&&n.unobserve&&e.el&&(n.unobserve(e.el),n=null),window.removeEventListener("resize",r),window.removeEventListener("orientationchange",a)})},({swiper:e,extendParams:t,on:i})=>{const n=[],s=(t,i={})=>{const s=window.MutationObserver||window.WebkitMutationObserver;if(!s)return;const r=new s(t=>{if(e.__preventObserver__)return;if(1===t.length)return void e.emit("observerUpdate",t[0]);const i=function(){e.emit("observerUpdate",t[0])};window.requestAnimationFrame?window.requestAnimationFrame(i):window.setTimeout(i,0)});r.observe(t,{attributes:void 0===i.attributes||i.attributes,childList:e.isElement||void 0===i.childList||i.childList,characterData:void 0===i.characterData||i.characterData}),n.push(r)};t({observer:!1,observeParents:!1,observeSlideChildren:!1}),i("init",()=>{if(e.params.observer){if(e.params.observeParents){const t=la(e.hostEl);for(let e=0;e<t.length;e+=1)s(t[e])}s(e.hostEl,{childList:e.params.observeSlideChildren}),s(e.wrapperEl,{attributes:!1})}}),i("destroy",()=>{n.forEach(e=>{e.disconnect()}),n.splice(0,n.length)})}]);const Xa='<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>',Ka=({swiper:e,extendParams:t,on:i,emit:n})=>{function s(){return e.params.navigation}function r(t){let i;return t&&"string"==typeof t&&e.isElement&&(i=e.el.querySelector(t)||e.hostEl.querySelector(t),i)?i:(t&&("string"==typeof t&&(i=[...document.querySelectorAll(t)]),e.params.uniqueNavElements&&"string"==typeof t&&i&&i.length>1&&1===e.el.querySelectorAll(t).length?i=e.el.querySelector(t):i&&1===i.length&&(i=i[0])),t&&!i?t:i)}function a(t,i){const n=s();da(t).forEach(t=>{t&&(t.classList[i?"add":"remove"](...n.disabledClass.split(" ")),"BUTTON"===t.tagName&&(t.disabled=i),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](n.lockClass))})}function o(){const{nextEl:t,prevEl:i}=e.navigation;if(e.params.loop)return a(i,!1),void a(t,!1);a(i,e.isBeginning&&!e.params.rewind),a(t,e.isEnd&&!e.params.rewind)}function l(t){t.preventDefault(),(!e.isBeginning||e.params.loop||e.params.rewind)&&(e.slidePrev(),n("navigationPrev"))}function c(t){t.preventDefault(),(!e.isEnd||e.params.loop||e.params.rewind)&&(e.slideNext(),n("navigationNext"))}function d(){e.params.navigation=Ya(e,e.originalParams.navigation,e.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"});const t=s();if(!t.nextEl&&!t.prevEl)return;const i=r(t.nextEl),n=r(t.prevEl);Object.assign(e.navigation,{nextEl:i,prevEl:n});const a=da(i),o=da(n),d=(i,n)=>{if(i){if(t.addIcons&&i.matches(".swiper-button-next,.swiper-button-prev")&&!i.querySelector("svg")){const e=document.createElement("div");ua(e,Xa);const t=e.querySelector("svg");t&&i.appendChild(t),e.remove()}i.addEventListener("click","next"===n?c:l)}!e.enabled&&i&&i.classList.add(...t.lockClass.split(" "))};a.forEach(e=>d(e,"next")),o.forEach(e=>d(e,"prev"))}function u(){const t=s(),{nextEl:i,prevEl:n}=e.navigation,r=da(i),a=da(n),o=(e,i)=>{e.removeEventListener("click","next"===i?c:l),e.classList.remove(...t.disabledClass.split(" "))};r.forEach(e=>o(e,"next")),a.forEach(e=>o(e,"prev"))}t({navigation:{nextEl:null,prevEl:null,addIcons:!0,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),e.navigation={nextEl:null,prevEl:null,arrowSvg:Xa},i("init",()=>{!1===s().enabled?p():(d(),o())}),i("toEdge fromEdge lock unlock",()=>{o()}),i("destroy",()=>{u()}),i("enable disable",()=>{const t=s(),{nextEl:i,prevEl:n}=e.navigation,r=da(i),a=da(n);e.enabled?o():[...r,...a].filter(e=>!!e).forEach(e=>e.classList.add(t.lockClass))}),i("click",(t,i)=>{const r=s(),{nextEl:a,prevEl:o}=e.navigation,l=da(a),c=da(o),d=i.target;let u=c.includes(d)||l.includes(d);if(e.isElement&&!u){const e=i.composedPath?i.composedPath():[];e.length&&(u=e.find(e=>l.includes(e)||c.includes(e)))}if(r.hideOnClick&&!u){if(e.pagination&&e.params.pagination&&e.params.pagination.clickable&&(e.pagination.el===d||e.pagination.el.contains(d)))return;let t;l.length?t=l[0].classList.contains(r.hiddenClass):c.length&&(t=c[0].classList.contains(r.hiddenClass)),n(!0===t?"navigationShow":"navigationHide"),[...l,...c].filter(e=>!!e).forEach(e=>e.classList.toggle(r.hiddenClass))}});const p=()=>{const t=s();e.el.classList.add(...t.navigationDisabledClass.split(" ")),u()};Object.assign(e.navigation,{enable:()=>{const t=s();e.el.classList.remove(...t.navigationDisabledClass.split(" ")),d(),o()},disable:p,update:o,init:d,destroy:u})};function Qa(e=""){return`.${e.trim().replace(/([.:!+/()[\]#>~*^$|=,'"@{}\\])/g,"\\$1").replace(/ /g,".")}`}const eo=e=>{if((e=>!!e.virtual&&!!e.params.virtual?.enabled)(e))return e.virtual.slides.length;const t=e.params.grid?.rows;return e.grid&&t&&t>1?e.slides.length/Math.ceil(t):e.slides.length},to=({swiper:e,extendParams:t,on:i,emit:n})=>{const s="swiper-pagination";let r;t({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:e=>e,formatFractionTotal:e=>e,bulletClass:`${s}-bullet`,bulletActiveClass:`${s}-bullet-active`,modifierClass:`${s}-`,currentClass:`${s}-current`,totalClass:`${s}-total`,hiddenClass:`${s}-hidden`,progressbarFillClass:`${s}-progressbar-fill`,progressbarOppositeClass:`${s}-progressbar-opposite`,clickableClass:`${s}-clickable`,lockClass:`${s}-lock`,horizontalClass:`${s}-horizontal`,verticalClass:`${s}-vertical`,paginationDisabledClass:`${s}-disabled`}}),e.pagination={el:null,bullets:[]};let a=0;function o(){return e.params.pagination}function l(){return!o().el||!e.pagination.el||Array.isArray(e.pagination.el)&&0===e.pagination.el.length}function c(e,t){const{bulletActiveClass:i}=o();if(!e)return;let n=e[("prev"===t?"previous":"next")+"ElementSibling"];n&&(n.classList.add(`${i}-${t}`),n=n[("prev"===t?"previous":"next")+"ElementSibling"],n&&n.classList.add(`${i}-${t}-${t}`))}function d(t){const i=t.target.closest(Qa(o().bulletClass));if(!i)return;t.preventDefault();const n=(oa(i)??0)*(e.params.slidesPerGroup??1);if(e.params.loop){if(e.realIndex===n)return;const t=(s=e.realIndex,r=n,a=e.slides.length,(r%=a)===1+(s%=a)?"next":r===s-1?"previous":void 0);"next"===t?e.slideNext():"previous"===t?e.slidePrev():e.slideToLoop(n)}else e.slideTo(n);var s,r,a}function u(){const t=e.rtl,i=o();if(l())return;const s=da(e.pagination.el);let d,u;const p=eo(e),h=e.params.loop?Math.ceil(p/(e.params.slidesPerGroup??1)):e.snapGrid.length;if(e.params.loop?(u=e.previousRealIndex||0,d=(e.params.slidesPerGroup??1)>1?Math.floor(e.realIndex/(e.params.slidesPerGroup??1)):e.realIndex):void 0!==e.snapIndex?(d=e.snapIndex,u=e.previousSnapIndex):(u=e.previousIndex||0,d=e.activeIndex||0),"bullets"===i.type&&e.pagination.bullets&&e.pagination.bullets.length>0){const n=e.pagination.bullets;let o=0,l=0,p=0;if(i.dynamicBullets){r=ca(n[0],e.isHorizontal()?"width":"height");const t=e.isHorizontal()?"width":"height";s.forEach(e=>{e.style[t]=(r??0)*(i.dynamicMainBullets+4)+"px"}),i.dynamicMainBullets>1&&void 0!==u&&(a+=d-(u||0),a>i.dynamicMainBullets-1?a=i.dynamicMainBullets-1:a<0&&(a=0)),o=Math.max(d-a,0),l=o+(Math.min(n.length,i.dynamicMainBullets)-1),p=(l+o)/2}if(n.forEach(e=>{const t=["","-next","-next-next","-prev","-prev-prev","-main"].map(e=>`${i.bulletActiveClass}${e}`).flatMap(e=>"string"==typeof e&&e.includes(" ")?e.split(" "):[e]);e.classList.remove(...t)}),s.length>1)n.forEach(t=>{const n=oa(t);n===d?t.classList.add(...i.bulletActiveClass.split(" ")):e.isElement&&t.setAttribute("part","bullet"),i.dynamicBullets&&void 0!==n&&(n>=o&&n<=l&&t.classList.add(...`${i.bulletActiveClass}-main`.split(" ")),n===o&&c(t,"prev"),n===l&&c(t,"next"))});else{const t=n[d];if(t&&t.classList.add(...i.bulletActiveClass.split(" ")),e.isElement&&n.forEach((e,t)=>{e.setAttribute("part",t===d?"bullet-active":"bullet")}),i.dynamicBullets){const e=n[o],t=n[l];for(let e=o;e<=l;e+=1)n[e]&&n[e].classList.add(...`${i.bulletActiveClass}-main`.split(" "));c(e,"prev"),c(t,"next")}}if(i.dynamicBullets){const s=Math.min(n.length,i.dynamicMainBullets+4),a=((r??0)*s-(r??0))/2-p*(r??0),o=t?"right":"left",l=e.isHorizontal()?o:"top";n.forEach(e=>{e.style[l]=`${a}px`})}}s.forEach((t,s)=>{if("fraction"===i.type&&(t.querySelectorAll(Qa(i.currentClass)).forEach(e=>{e.textContent=String(i.formatFractionCurrent(d+1))}),t.querySelectorAll(Qa(i.totalClass)).forEach(e=>{e.textContent=String(i.formatFractionTotal(h))})),"progressbar"===i.type){let n;n=i.progressbarOpposite?e.isHorizontal()?"vertical":"horizontal":e.isHorizontal()?"horizontal":"vertical";const s=(d+1)/h;let r=1,a=1;"horizontal"===n?r=s:a=s,t.querySelectorAll(Qa(i.progressbarFillClass)).forEach(t=>{t.style.transform=`translate3d(0,0,0) scaleX(${r}) scaleY(${a})`,t.style.transitionDuration=`${e.params.speed}ms`})}"custom"===i.type&&i.renderCustom?(ua(t,i.renderCustom(e,d+1,h)),0===s&&n("paginationRender",t)):(0===s&&n("paginationRender",t),n("paginationUpdate",t)),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](i.lockClass)})}function p(){const t=o();if(l())return;const i=eo(e),s=da(e.pagination.el);let r="";if("bullets"===t.type){let n=e.params.loop?Math.ceil(i/(e.params.slidesPerGroup??1)):e.snapGrid.length;e.params.freeMode&&(e=>!!e.params.freeMode?.enabled)(e)&&n>i&&(n=i);for(let i=0;i<n;i+=1)t.renderBullet?r+=t.renderBullet.call(e,i,t.bulletClass):r+=`<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`}"fraction"===t.type&&(r=t.renderFraction?t.renderFraction.call(e,t.currentClass,t.totalClass):`<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`),"progressbar"===t.type&&(r=t.renderProgressbar?t.renderProgressbar.call(e,t.progressbarFillClass):`<span class="${t.progressbarFillClass}"></span>`),e.pagination.bullets=[],s.forEach(i=>{"custom"!==t.type&&ua(i,r||""),"bullets"===t.type&&e.pagination.bullets.push(...Array.from(i.querySelectorAll(Qa(t.bulletClass))))}),"custom"!==t.type&&n("paginationRender",s[0])}function h(){e.params.pagination=Ya(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const t=o();if(!t.el)return;let i;if("string"==typeof t.el&&e.isElement&&(i=e.el.querySelector(t.el)),i||"string"!=typeof t.el||(i=[...document.querySelectorAll(t.el)]),i||(i=t.el),!i||Array.isArray(i)&&0===i.length)return;if(e.params.uniqueNavElements&&"string"==typeof t.el&&Array.isArray(i)&&i.length>1&&(i=[...e.el.querySelectorAll(t.el)],i.length>1)){const t=i.find(t=>la(t,".swiper")[0]===e.el);t&&(i=t)}Array.isArray(i)&&1===i.length&&(i=i[0]),Object.assign(e.pagination,{el:i});da(i).forEach(i=>{"bullets"===t.type&&t.clickable&&i.classList.add(...(t.clickableClass||"").split(" ")),i.classList.add(t.modifierClass+t.type),i.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass),"bullets"===t.type&&t.dynamicBullets&&(i.classList.add(`${t.modifierClass}${t.type}-dynamic`),a=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&i.classList.add(t.progressbarOppositeClass),t.clickable&&i.addEventListener("click",d),e.enabled||i.classList.add(t.lockClass)})}function m(){const t=o();if(l())return;const i=e.pagination.el;if(i){da(i).forEach(i=>{i.classList.remove(t.hiddenClass),i.classList.remove(t.modifierClass+t.type),i.classList.remove(e.isHorizontal()?t.horizontalClass:t.verticalClass),t.clickable&&(i.classList.remove(...(t.clickableClass||"").split(" ")),i.removeEventListener("click",d))})}e.pagination.bullets&&e.pagination.bullets.forEach(e=>e.classList.remove(...t.bulletActiveClass.split(" ")))}i("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const t=o();da(e.pagination.el).forEach(i=>{i.classList.remove(t.horizontalClass,t.verticalClass),i.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass)})}),i("init",()=>{!1===o().enabled?f():(h(),p(),u())}),i("activeIndexChange",()=>{void 0===e.snapIndex&&u()}),i("snapIndexChange",()=>{u()}),i("snapGridLengthChange",()=>{p(),u()}),i("destroy",()=>{m()}),i("enable disable",()=>{const{el:t}=e.pagination;if(t){const i=o();da(t).forEach(t=>t.classList[e.enabled?"remove":"add"](i.lockClass))}}),i("lock unlock",()=>{u()}),i("click",(t,i)=>{const s=i.target,r=da(e.pagination.el),a=o();if(a.el&&a.hideOnClick&&r&&r.length>0&&!s.classList.contains(a.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&s===e.navigation.nextEl||e.navigation.prevEl&&s===e.navigation.prevEl))return;const t=r[0].classList.contains(a.hiddenClass);n(!0===t?"paginationShow":"paginationHide"),r.forEach(e=>e.classList.toggle(a.hiddenClass))}});const f=()=>{const t=o();e.el.classList.add(t.paginationDisabledClass);const{el:i}=e.pagination;if(i){da(i).forEach(e=>e.classList.add(t.paginationDisabledClass))}m()};Object.assign(e.pagination,{enable:()=>{const t=o();e.el.classList.remove(t.paginationDisabledClass);const{el:i}=e.pagination;if(i){da(i).forEach(e=>e.classList.remove(t.paginationDisabledClass))}h(),p(),u()},disable:f,render:p,update:u,init:h,destroy:m})},io=({swiper:e,extendParams:t,on:i,emit:n,params:s})=>{function r(){return e.params.autoplay}e.autoplay={running:!1,paused:!1,timeLeft:0},t({autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!1,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}});const a="object"==typeof s.autoplay&&s.autoplay&&"number"==typeof s.autoplay.delay?s.autoplay.delay:3e3;let o,l,c,d=a,u=a,p=0,h=(new Date).getTime(),m=!1,f=!1,g=!1,y=!1,v=!1;function b(t){if(!e||e.destroyed||!e.wrapperEl)return;if(t.target!==e.wrapperEl)return;e.wrapperEl.removeEventListener("transitionend",b);const i=t.detail;v||i&&i.bySwiperTouchMove||S()}const w=()=>{if(e.destroyed||!e.autoplay.running)return;e.autoplay.paused?m=!0:m&&(u=p,m=!1);const t=e.autoplay.paused?p:h+u-(new Date).getTime();e.autoplay.timeLeft=t,n("autoplayTimeLeft",t,t/d),l=requestAnimationFrame(()=>{w()})},x=()=>{let t=r().delay;const i=(()=>{let t;const i=!!e.params.virtual?.enabled;if(t=e.virtual&&i?e.slides.find(e=>e.classList.contains("swiper-slide-active")):e.slides[e.activeIndex],!t)return;const n=t.getAttribute("data-swiper-autoplay");return null!=n?parseInt(n,10):void 0})();return"number"==typeof i&&!Number.isNaN(i)&&i>0&&(t=i),t},_=t=>{if(e.destroyed||!e.autoplay.running)return 0;void 0!==l&&cancelAnimationFrame(l),w();let i=t;void 0===i&&(i=x(),d=i,u=i),p=i;const s=e.params.speed,a=()=>{if(!e||e.destroyed)return;const t=r();t.reverseDirection?!e.isBeginning||e.params.loop||e.params.rewind?(e.slidePrev(s,!0,!0),n("autoplay")):t.stopOnLastSlide||(e.slideTo(e.slides.length-1,s,!0,!0),n("autoplay")):!e.isEnd||e.params.loop||e.params.rewind?(e.slideNext(s,!0,!0),n("autoplay")):t.stopOnLastSlide||(e.slideTo(0,s,!0,!0),n("autoplay")),e.params.cssMode&&(h=(new Date).getTime(),requestAnimationFrame(()=>{_()}))};return i>0?(void 0!==o&&clearTimeout(o),o=setTimeout(()=>{a()},i)):requestAnimationFrame(()=>{a()}),i},$=()=>(h=(new Date).getTime(),e.autoplay.running=!0,_(),n("autoplayStart"),!0),k=()=>(e.autoplay.running=!1,void 0!==o&&clearTimeout(o),void 0!==l&&cancelAnimationFrame(l),n("autoplayStop"),!0),M=(t,i)=>{if(e.destroyed||!e.autoplay.running)return;void 0!==o&&clearTimeout(o),t||(y=!0);const s=()=>{n("autoplayPause"),r().waitForTransition?e.wrapperEl.addEventListener("transitionend",b):S()};if(e.autoplay.paused=!0,i)return void s();const a=p||r().delay;p=a-((new Date).getTime()-h),e.isEnd&&p<0&&!e.params.loop||(p<0&&(p=0),s())},S=()=>{e.isEnd&&p<0&&!e.params.loop||e.destroyed||!e.autoplay.running||(h=(new Date).getTime(),y?(y=!1,_(p)):_(),e.autoplay.paused=!1,n("autoplayResume"))},C=()=>{!e.destroyed&&e.autoplay.running&&("hidden"===document.visibilityState&&(y=!0,M(!0)),"visible"===document.visibilityState&&S())},T=t=>{"mouse"===t.pointerType&&(y=!0,v=!0,e.animating||e.autoplay.paused||M(!0))},A=t=>{"mouse"===t.pointerType&&(v=!1,e.autoplay.paused&&S())};i("init",()=>{r().enabled&&(r().pauseOnMouseEnter&&(e.el.addEventListener("pointerenter",T),e.el.addEventListener("pointerleave",A)),document.addEventListener("visibilitychange",C),$())}),i("destroy",()=>{e.el&&"string"!=typeof e.el&&(e.el.removeEventListener("pointerenter",T),e.el.removeEventListener("pointerleave",A)),document.removeEventListener("visibilitychange",C),e.autoplay.running&&k()}),i("_freeModeStaticRelease",()=>{(g||y)&&S()}),i("_freeModeNoMomentumRelease",()=>{r().disableOnInteraction?k():M(!0,!0)}),i("beforeTransitionStart",(t,i,n)=>{!e.destroyed&&e.autoplay.running&&(n||!r().disableOnInteraction?M(!0,!0):k())}),i("sliderFirstMove",()=>{!e.destroyed&&e.autoplay.running&&(r().disableOnInteraction?k():(f=!0,g=!1,y=!1,c=setTimeout(()=>{y=!0,g=!0,M(!0)},200)))}),i("touchEnd",()=>{if(!e.destroyed&&e.autoplay.running&&f){if(void 0!==c&&clearTimeout(c),void 0!==o&&clearTimeout(o),r().disableOnInteraction)return g=!1,void(f=!1);g&&e.params.cssMode&&S(),g=!1,f=!1}}),i("slideChange",()=>{!e.destroyed&&e.autoplay.running&&e.autoplay.paused&&(p=x(),d=x())}),Object.assign(e.autoplay,{start:$,stop:k,pause:M,resume:S})},no=e=>!!e.virtual&&!!e.params.virtual?.enabled,so=({swiper:e,extendParams:t,on:i})=>{t({a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",slideLabelMessage:"{{index}} / {{slidesLength}}",containerMessage:null,containerRoleDescriptionMessage:null,containerRole:null,itemRoleDescriptionMessage:null,slideRole:"group",id:null,scrollOnFocus:!0,wrapperLiveRegion:!0}}),e.a11y={clicked:!1};let n,s=null,r=!1,a=(new Date).getTime();function o(){return e.params.a11y}function l(e){s&&e&&ua(s,e)}function c(e){da(e).forEach(e=>{e.setAttribute("tabIndex","0")})}function d(e){da(e).forEach(e=>{e.setAttribute("tabIndex","-1")})}function u(e,t){da(e).forEach(e=>{e.setAttribute("role",t)})}function p(e,t){da(e).forEach(e=>{e.setAttribute("aria-roledescription",t)})}function h(e,t){da(e).forEach(e=>{e.setAttribute("aria-label",t)})}function m(e){da(e).forEach(e=>{e.setAttribute("aria-disabled","true")})}function f(e){da(e).forEach(e=>{e.removeAttribute("aria-disabled")})}function g(t){if(13!==t.keyCode&&32!==t.keyCode)return;const i=o(),n=e.params.pagination,s=t.target;if(!e.pagination||!e.pagination.el||s!==e.pagination.el&&!e.pagination.el.contains(s)||s.matches(Qa(n?.bulletClass))){if(e.navigation&&e.navigation.prevEl&&e.navigation.nextEl){const t=da(e.navigation.prevEl);da(e.navigation.nextEl).includes(s)&&(e.isEnd&&!e.params.loop||e.slideNext(),e.isEnd?l(i.lastSlideMessage):l(i.nextSlideMessage)),t.includes(s)&&(e.isBeginning&&!e.params.loop||e.slidePrev(),e.isBeginning?l(i.firstSlideMessage):l(i.prevSlideMessage))}e.pagination&&s.matches(Qa(n?.bulletClass))&&s.click()}}function y(){return!!(e.pagination&&e.pagination.bullets&&e.pagination.bullets.length)}function v(){const t=e.params.pagination;return y()&&!!t?.clickable}const b=(e,t,i)=>{c(e),"BUTTON"!==e.tagName&&(u(e,"button"),e.addEventListener("keydown",g)),h(e,i)},w=t=>{n&&n!==t.target&&!n.contains(t.target)&&(r=!0),e.a11y.clicked=!0},x=()=>{r=!1,requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.destroyed||(e.a11y.clicked=!1)})})},_=e=>{a=(new Date).getTime()};let $=[];const k=()=>{$.forEach(e=>e.removeAttribute("inert")),$=[]},M=t=>{if("Tab"!==t.key||!e.params.loop||e.destroyed)return;const i=t.target,n=i?.closest?.(`.${e.params.slideClass}, swiper-slide`);if(!n||!e.slides.includes(n))return;const s=parseInt(n.getAttribute("data-swiper-slide-index")||"",10);if(Number.isNaN(s))return;const r=no(e)?e.virtual.slides.length:e.slides.length;(t.shiftKey?0===s:s===r-1)&&(k(),e.slides.forEach(e=>{e===n||e.hasAttribute("inert")||(e.setAttribute("inert",""),$.push(e))}),setTimeout(k,0))},S=t=>{const i=o();if(e.a11y.clicked||!i.scrollOnFocus)return;if((new Date).getTime()-a<100)return;const s=t.target.closest(`.${e.params.slideClass}, swiper-slide`);if(!s||!e.slides.includes(s))return;n=s;const l=no(e),c=(l?parseInt(s.getAttribute("data-swiper-slide-index")||"0",10):e.slides.indexOf(s))===e.activeIndex,d=e.params.watchSlidesProgress&&e.visibleSlides&&e.visibleSlides.includes(s);if(c||d)return;const u=t.sourceCapabilities;u&&u.firesTouchEvents||(e.isHorizontal()?e.el.scrollLeft=0:e.el.scrollTop=0,requestAnimationFrame(()=>{r||(e.params.loop?e.slideToLoop(e.getSlideIndexWhenGrid(parseInt(s.getAttribute("data-swiper-slide-index")||"0",10)),0):l?e.slideTo(e.getSlideIndexWhenGrid(parseInt(s.getAttribute("data-swiper-slide-index")||"0",10)),0):e.slideTo(e.getSlideIndexWhenGrid(e.slides.indexOf(s)),0),r=!1)}))},C=()=>{const t=o();t.itemRoleDescriptionMessage&&p(e.slides,t.itemRoleDescriptionMessage),t.slideRole&&u(e.slides,t.slideRole);const i=e.slides.length,n=t.slideLabelMessage;n&&e.slides.forEach((t,s)=>{const r=e.params.loop?parseInt(t.getAttribute("data-swiper-slide-index")||"0",10):s;h(t,n.replace(/\{\{index\}\}/,String(r+1)).replace(/\{\{slidesLength\}\}/,String(i)))})},T=()=>{const t=o();s&&e.el.append(s);const i=e.el;t.containerRoleDescriptionMessage&&p(i,t.containerRoleDescriptionMessage),t.containerMessage&&h(i,t.containerMessage),t.containerRole&&u(i,t.containerRole);const n=e.wrapperEl,r=String(t.id||n.getAttribute("id")||`swiper-wrapper-${function(e=16){return"x".repeat(e).replace(/x/g,()=>Math.round(16*Math.random()).toString(16))}(16)}`);var a;if(a=r,da(n).forEach(e=>{e.setAttribute("id",a)}),t.wrapperLiveRegion){const t=e.params.autoplay;!function(e,t){da(e).forEach(e=>{e.setAttribute("aria-live",t)})}(n,e.params.autoplay&&t?.enabled?"off":"polite")}C();const l=e.navigation?e.navigation:{nextEl:void 0,prevEl:void 0},c=da(l.nextEl),d=da(l.prevEl);if(c&&c.forEach(e=>b(e,0,t.nextSlideMessage)),d&&d.forEach(e=>b(e,0,t.prevSlideMessage)),v()){da(e.pagination.el).forEach(e=>{e.addEventListener("keydown",g)})}document.addEventListener("visibilitychange",_),e.el.addEventListener("focus",S,!0),e.el.addEventListener("keydown",M,!0),e.el.addEventListener("pointerdown",w,!0),e.el.addEventListener("pointerup",x,!0)};i("beforeInit",()=>{s=ra("span",o().notificationClass),s.setAttribute("aria-live","assertive"),s.setAttribute("aria-atomic","true")}),i("afterInit",()=>{o().enabled&&T()}),i("slidesLengthChange snapGridLengthChange slidesGridLengthChange",()=>{o().enabled&&C()}),i("fromEdge toEdge afterInit lock unlock",()=>{o().enabled&&function(){if(e.params.loop||e.params.rewind||!e.navigation)return;const{nextEl:t,prevEl:i}=e.navigation;i&&(e.isBeginning?(m(i),d(i)):(f(i),c(i))),t&&(e.isEnd?(m(t),d(t)):(f(t),c(t)))}()}),i("paginationUpdate",()=>{o().enabled&&function(){const t=o();if(!y())return;const i=e.params.pagination;e.pagination.bullets.forEach(e=>{i.clickable&&(c(e),i.renderBullet||(u(e,"button"),h(e,t.paginationBulletMessage.replace(/\{\{index\}\}/,String((oa(e)??0)+1))))),e.matches(Qa(i.bulletActiveClass))?e.setAttribute("aria-current","true"):e.removeAttribute("aria-current")})}()}),i("destroy",()=>{o().enabled&&function(){s&&s.remove();const t=e.navigation?e.navigation:{nextEl:void 0,prevEl:void 0},i=da(t.nextEl),n=da(t.prevEl);i&&i.forEach(e=>e.removeEventListener("keydown",g)),n&&n.forEach(e=>e.removeEventListener("keydown",g)),v()&&da(e.pagination.el).forEach(e=>{e.removeEventListener("keydown",g)});document.removeEventListener("visibilitychange",_),e.el&&"string"!=typeof e.el&&(e.el.removeEventListener("focus",S,!0),e.el.removeEventListener("keydown",M,!0),e.el.removeEventListener("pointerdown",w,!0),e.el.removeEventListener("pointerup",x,!0)),k()}()})};class ro extends HTMLElement{constructor(){super(...arguments),this._initQueued=!1}get options(){return this._options}set options(e){const t=JSON.stringify(e)!==JSON.stringify(this._options);this._options=e,t&&(this._destroy(),this._queueInit())}get activeIndex(){return this._activeIndex}set activeIndex(e){this._activeIndex=e,void 0!==e&&this._swiper&&this._swiper.activeIndex!==e&&this._swiper.slideTo(e,0)}get swiper(){return this._swiper}connectedCallback(){this._queueInit()}disconnectedCallback(){this._destroy()}_queueInit(){!this._initQueued&&this.isConnected&&(this._initQueued=!0,queueMicrotask(()=>{this._initQueued=!1,this._init()}))}_init(){const e=this._options,t=this.querySelector(":scope > .swiper");if(!e||!t||this._swiper||!this.isConnected)return;const i=e.pagination?this.querySelector(":scope > .mc-slider-pagination"):null,n=e.navigation?this.querySelector(":scope > .mc-slider-next"):null,s=e.navigation?this.querySelector(":scope > .mc-slider-prev"):null,r={modules:[Ka,to,io,so],slidesPerView:e.slidesPerView,spaceBetween:e.spaceBetween,rewind:e.rewind,loop:!1,observer:!0,observeSlideChildren:!0,allowTouchMove:!e.editMode,threshold:10,initialSlide:this._activeIndex??0,pagination:!!i&&{el:i,clickable:!e.editMode},navigation:!(!n||!s)&&{nextEl:n,prevEl:s},autoplay:e.autoplay>0&&!e.editMode&&{delay:e.autoplay,disableOnInteraction:!1,pauseOnMouseEnter:!0},a11y:{enabled:!0}};try{this._swiper=new Ua(t,r)}catch(e){console.warn("Magic Card: slider failed to start",e)}}_destroy(){if(this._swiper){try{this._swiper.destroy(!0,!0)}catch{}this._swiper=void 0}}}customElements.get("mc-swiper")||customElements.define("mc-swiper",ro);class ao extends yn.l{constructor(){super(...arguments),this.metadata={type:"slider-layout",name:"Slider layout",description:"Arrange child modules in a slider",category:"layout",icon:"mdi:view-carousel-outline"}}createDefault(){return{id:(0,G.$)("slider-layout"),type:"slider-layout",modules:[],pagination:!0,navigation:!0}}renderPreview(e,t){const i=e,n=i.modules||[];if(!n.length)return r.qy`<div class="mc-module mc-slider-layout">${Ji("Empty slider")}</div>`;const s=(0,Wi.V)(),a=function(e,t){const i=Number(e.slides_per_view),n=Number(e.space_between),s=Number(e.autoplay_delay);return{slidesPerView:Number.isFinite(i)&&i>0?i:1,spaceBetween:Number.isFinite(n)&&n>=0?n:8,rewind:!!e.loop,pagination:!1!==e.pagination,navigation:!1!==e.navigation,autoplay:e.autoplay?Number.isFinite(s)&&s>=1e3?s:5e3:0,editMode:t}}(i,!!s?.editMode),o=function(e){const t=(0,Wi.V)();return e.map((e,t)=>({child:e,index:t})).filter(({child:e})=>!t?.childHidden?.(e))}(n);if(!o.length)return r.qy``;const l=o.length>1,c={...a,navigation:a.navigation&&l,pagination:a.pagination&&l},d=s?.selectedChild?.()?.index,u=void 0===d?void 0:Math.max(0,o.findIndex(e=>e.index===d)),p=e=>e.stopPropagation();return r.qy`
      <mc-swiper class="mc-module mc-slider-layout" .options=${c} .activeIndex=${u}>
        <div class="swiper">
          <div class="swiper-wrapper">
            ${o.map(({child:e,index:i})=>r.qy`
              <div class="swiper-slide">${Gi(e,t,i)}</div>
            `)}
          </div>
        </div>
        ${c.navigation?r.qy`
            <button type="button" class="mc-slider-nav mc-slider-prev" @pointerdown=${p} @pointerup=${p} @keydown=${p} aria-label="Previous slide">
              <ha-icon icon="mdi:chevron-left"></ha-icon>
            </button>
            <button type="button" class="mc-slider-nav mc-slider-next" @pointerdown=${p} @pointerup=${p} @keydown=${p} aria-label="Next slide">
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>`:r.s6}
        ${c.pagination?r.qy`<div class="mc-slider-pagination" @pointerdown=${p} @pointerup=${p} @keydown=${p}></div>`:r.s6}
      </mc-swiper>
    `}}Ei.s.register(new ao);i(1775);var oo=i(6698),lo=i(7812);const co=e=>"below_horizon"===e?.states?.["sun.sun"]?.state;class uo extends yn.l{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:(0,G.$)("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5,animated_icons:!0}}_condition(e,t){try{return e?.formatEntityState?.(t)||t.state}catch{return t.state}}getDependencies(e){return e.entity?{entities:["sun.sun"]}:{}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,s=!n||"unavailable"===n.state||"unknown"===n.state,a=n&&!s&&"number"==typeof n.attributes.temperature?n.attributes.temperature:void 0,o=String(n?.attributes.temperature_unit??t?.config?.unit_system?.temperature??"°"),l=n&&!s?(0,oo.u7)(n.state,co(t)):"mdi:weather-cloudy-alert",c=!1!==i.animated_icons&&n&&!s?P(n.state,{night:co(t),className:"mc-anim-icon"}):void 0,d=n?this._condition(t,n):"",u=i.show_forecast&&n?Ei.s.get("forecast")?.renderPreview({id:`${i.id}~forecast`,type:"forecast",entity:i.entity,forecast_type:"daily",animated_icons:!1!==i.animated_icons,num_forecasts:Math.max(1,Math.min(14,Math.round(Number(i.forecast_days)||5))),show_temperature:!0,show_precipitation:!1,show_wind:!1},t):void 0;return r.qy`
      <div class="mc-module mc-weather ${u?"mc-weather--forecast":""}">
        <div class="mc-weather-now">
          ${c??((0,xn.K)(i.icon_fx)?(0,xn.s)({icon:l,entity:i.entity,hass:t,className:"mc-anim-icon",fx:i.icon_fx,svg:i.svg,ariaHidden:!0}):r.qy`<ha-icon class="mc-anim-icon" icon=${l} aria-hidden="true"></ha-icon>`)}
          <div>
            ${!1!==i.show_temperature&&void 0!==a?r.qy`<div class="mc-weather-temp">${(0,lo.ZV)(t,a)}${o}</div>`:r.s6}
            ${!1!==i.show_condition&&d?r.qy`<div class="mc-weather-condition">${d}</div>`:r.s6}
          </div>
        </div>
        ${u??r.s6}
      </div>
    `}}function po(e){return"number"==typeof e&&Number.isFinite(e)?e:void 0}Ei.s.register(new uo);class ho extends yn.l{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week-outline"}}createDefault(){return{id:(0,G.$)("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1,animated_icons:!0}}_placeholder(e){return r.qy`
      <div class="mc-module mc-forecast">
        ${Array.from({length:e}).map((e,t)=>r.qy`
            <div class="mc-forecast-item">
              <span class="mc-forecast-label">${Xi("forecast.day").replace("{n}",String(t+1))}</span>
              <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
              <span class="mc-forecast-temp">--°</span>
            </div>
          `)}
      </div>
    `}_message(e,t="mc-forecast-empty"){return r.qy`<div class="mc-module mc-forecast ${t}">${e}</div>`}_label(e,t,i){const n=new Date(e.datetime);if(Number.isNaN(n.getTime()))return"";if("hourly"===t){const e=(0,lo.oE)(i);return(0,lo.LE)(i,{hour:"numeric",...e?{hourCycle:"h12"}:{hourCycle:"h23",minute:"2-digit"}}).format(n)}const s=(0,lo.LE)(i,{weekday:"short"}).format(n);if("twice_daily"!==t||void 0===e.is_daytime)return s;const a=i?.localize,o=e.is_daytime?a?.("ui.card.weather.day")||"Day":a?.("ui.card.weather.night")||"Night";return r.qy`${s}<br />${o}`}_conditionName(e,t,i){if(!t)return"";try{return i?.formatEntityState?.(e,t)||t}catch{return t}}renderPreview(e,t){const i=e,n=Math.max(1,Math.round(i.num_forecasts||5)),s=i.entity&&t?t.states[i.entity]:void 0;if(!s)return this._placeholder(n);const a=(0,oo.cY)(s,i.forecast_type,(0,Wi.V)());if("pending"===a.status)return this._placeholder(n);if("unavailable"===a.status){let e="";try{e=t?.formatEntityState?.(s)??""}catch{}return this._message(e||Xi("forecast.unavailable"),"mc-forecast-empty mc-forecast-unavailable")}if("none"===a.status)return this._message(Xi("forecast.no_forecast"));if("error"===a.status)return this._message(Xi("forecast.not_available").replace("{error}",a.error));const o=a.forecast.slice(0,n);if(!o.length)return this._message(Xi("forecast.no_data"));const l=s.attributes,c=t?.config?.unit_system,d=String(l.temperature_unit??c?.temperature??"°"),u=String(l.precipitation_unit??c?.accumulated_precipitation??"mm"),p=String(l.wind_speed_unit??c?.wind_speed??""),h=e=>`${(0,lo.ZV)(t,e)}${d}`;return r.qy`
      <div class="mc-module mc-forecast" data-forecast-type=${a.type}>
        ${o.map(e=>{const n=!1===e.is_daytime,o=this._conditionName(s,e.condition,t),l=po(e.temperature),c=po(e.templow),d=po(e.precipitation),m=po(e.precipitation_probability),f=po(e.wind_speed),g=!1!==i.animated_icons&&e.condition?P(e.condition,{night:n,label:o||void 0}):void 0;return r.qy`
            <div class="mc-forecast-item" title=${o||r.s6}>
              <span class="mc-forecast-label">${this._label(e,a.type,t)}</span>
              ${g??((0,xn.K)(i.icon_fx)?(0,xn.s)({icon:(0,oo.u7)(e.condition,n),entity:i.entity,hass:t,fx:i.icon_fx,svg:i.svg,ariaLabel:o||void 0}):r.qy`<ha-icon icon=${(0,oo.u7)(e.condition,n)} aria-label=${o||r.s6} role=${o?"img":r.s6}></ha-icon>`)}
              ${!1!==i.show_temperature?r.qy`<span class="mc-forecast-temp">${void 0!==l?h(l):"--°"}</span>
                    ${void 0!==c?r.qy`<span class="mc-forecast-templow">${h(c)}</span>`:r.s6}`:r.s6}
              ${!1!==i.show_precipitation&&void 0!==d?r.qy`<span class="mc-forecast-label mc-forecast-precip">${(0,lo.ZV)(t,d)} ${u}</span>`:!1!==i.show_precipitation&&void 0!==m?r.qy`<span class="mc-forecast-label mc-forecast-precip">${(0,lo.ZV)(t,m,0)} %</span>`:r.s6}
              ${i.show_wind&&void 0!==f?r.qy`<span class="mc-forecast-label mc-forecast-wind">${(0,lo.ZV)(t,f)}${p?` ${p}`:""}${void 0!==e.wind_bearing&&null!==e.wind_bearing?` ${(0,oo.G)(e.wind_bearing)}`:""}</span>`:r.s6}
            </div>
          `})}
      </div>
    `}}Ei.s.register(new ho);var mo=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class fo extends r.WF{constructor(){super(...arguments),this.src="",this.poster="",this.autoplay=!0,this.loop=!0,this.muted=!0,this.fit="cover",this._failed=!1,this._visible=!1}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver?(this._observer=new IntersectionObserver(e=>{this._visible=e.some(e=>e.isIntersecting),this._sync()}),this._observer.observe(this)):this._visible=!0}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=void 0,this._video?.pause()}get _video(){return this.querySelector("video")}willUpdate(e){e.has("src")&&(this._failed=!1)}updated(){this._sync()}_sync(){const e=this._video;e&&(e.muted=this.muted,e.defaultMuted=this.muted,e.playsInline=!0,e.loop=this.loop,!this.autoplay||!this._visible||"undefined"!=typeof window&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?e.paused||e.pause():e.paused&&e.play()?.catch(()=>{}))}render(){return this._failed||!this.src?this.poster?r.qy`<img class="mc-video-bg-media" src=${Mn(this.poster)} alt="" style="object-fit: ${this.fit}"
            @error=${()=>this.posterId&&(0,ji.By)(this.posterId)} />`:r.qy``:r.qy`<video
      class="mc-video-bg-media"
      src=${Mn(this.src)}
      poster=${this.poster?Mn(this.poster):r.s6}
      preload="metadata"
      playsinline
      disablepictureinpicture
      aria-hidden="true"
      tabindex="-1"
      style="object-fit: ${this.fit}"
      @error=${()=>{this._failed=!0,this.srcId&&(0,ji.By)(this.srcId)}}
      @loadeddata=${()=>this._sync()}
    ></video>`}}mo([(0,a.MZ)({attribute:!1})],fo.prototype,"src",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"poster",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"autoplay",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"loop",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"muted",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"fit",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"srcId",void 0),mo([(0,a.MZ)({attribute:!1})],fo.prototype,"posterId",void 0),mo([(0,a.wk)()],fo.prototype,"_failed",void 0),customElements.get("mc-bg-video")||customElements.define("mc-bg-video",fo);class go extends yn.l{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video background",description:"Video playing behind the other modules of its column or layout",category:"advanced",icon:"mdi:video-outline"}}createDefault(){return{id:(0,G.$)("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const i=e,n=(0,Di.F9)(t,i.url),s=(0,Di.F9)(t,i.poster);return n||s?r.qy`
      <div class="mc-module mc-video-bg mc-video-bg--media" aria-hidden="true">
        <mc-bg-video
          .src=${n}
          .poster=${s}
          .autoplay=${!1!==i.autoplay}
          .loop=${!1!==i.loop}
          .muted=${!1!==i.muted}
          .fit=${"contain"===i.fit?"contain":"cover"}
          .srcId=${(0,ji.fk)(i.url)}
          .posterId=${(0,ji.fk)(i.poster)}
        ></mc-bg-video>
      </div>
    `:r.qy`
        <div class="mc-module mc-video-bg mc-video-bg-placeholder">
          <ha-icon icon="mdi:video-off-outline"></ha-icon>
        </div>
      `}}Ei.s.register(new go);i(22);i.p=new URL(".",import.meta.url).href,window.customCards=window.customCards||[],window.customCards.push({type:s.Mp,name:s.d5,description:s.uh,preview:!0,documentationURL:"https://github.com/therealmcsparrow/magic-card"}),function(e=window){e.MagicCard={...e.MagicCard,version:n,apiVersion:1,loadEditor:ie}}(),console.info(`%c MAGIC-CARD %c v${n} `,"color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();