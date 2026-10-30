(()=>{"use strict";var e={3706(e,t,i){i.d(t,["eo",0,"mc-path-canvas"])},3682(e,t,i){const n={colour:"color",centre:"center",grey:"gray",metre:"meter",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"};i.d(t,["A",0,e=>e.toLowerCase().replace(/colour|centre|grey|metre|customis|behaviour|favourite|maximis|minimis|organis/g,e=>n[e])])},201(e,t,i){var n=i(4753);const{t:s,tx:r,m:a,locale:o,ready:l}=(0,n._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,l,"H",0,o,"t",0,s])},4753(e,t,i){var n=i(796);const s=["en-GB","en-US","nl"];let r,a=0;const o={},l=e=>o[e]||=(console.debug("[i18n] "+e),1),c=e=>(0,n.ZV)(r,e),d=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,p=/\{((?:[^{}]|\{[^{}]*\})*)\}/,h=(e,t,i)=>e.split(d).flatMap((e,n)=>{if(!(1&n))return void 0===i?e:e.replace(/#/g,c(i));const r=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(e);if(!r)throw 0;const o=t[r[1]];if(void 0===o&&l("missing "+r[1]),!r[2])return"object"==typeof o?[o]:void 0===o?"":"number"==typeof o?c(o):o;const d=r[3].split(p),u="plural"==r[2],m=u?Math.round(10*+o)/10:o,g=e=>d[d.findIndex((t,i)=>!(1&i)&&t.trim()==e)+1||-1],f=g("="+m)??g(u?new Intl.PluralRules(s[a]).select(m):String(o))??g("other");if(void 0===f)throw 0;return h(f,t,u?m:void 0)}).filter(String),u=(e,t)=>{const i=[],n=e=>i[e]||=t()[e].split("|"),r=(i,s=a)=>t()?(n(s)[i]||n(0)[i])??"":(l("not ready "+e),""),o=(e,t={})=>{try{return h(r(e),t)}catch{return l("malformed "+e),[r(e,0)]}};return{ns:e,locale:()=>s[a],t:(e,t)=>o(e,t).join(""),tx:(e,t)=>o(e,t),m:e=>e}};i.d(t,["Zc",0,e=>{r=e;const t=(e=>{const t=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((e||"").toLowerCase());return t?"nl"==t[1]?"nl":t[3]?"en-GB":"en-US":"en-GB"})(e?.locale?.language||e?.language||globalThis.navigator?.language);return a=s.indexOf(t),t},"_H",0,(e,t)=>{let i,n;return{...u(e,()=>i),ready:()=>n||=t().then(e=>(i=e.default,!0),()=>(n=void 0,!1))}},"my",0,(e,t)=>u(e,()=>t)])},1474(e,t,i){i.d(t,{a:()=>r,dI:()=>o});var n=i(2637),s=i(201);function r(e,t,i,r,o={}){const l=(0,n.WP)(t).slice(0,64).map((e,t)=>({id:`part-${t+1}`,name:(0,s.t)(349,{n:t+1}),from:[e.index]})),c=o.embed?function(e){const t=(t,i)=>e.evenodd?.[t]?.includes(i)?' fill-rule="evenodd"':"",i=[...(e.secondary??[]).map((e,i)=>`<path class="mc-accent" d="${a(e)}"${t("accent",i)}/>`),...e.paths.map((e,i)=>`<path d="${a(e)}"${t("paths",i)}/>`),...(e.strokes??[]).map(e=>`<path${e.accent?' class="mc-accent"':""} d="${a(e.d)}" fill="none" stroke="currentColor" stroke-width="${e.width}"${e.cap?` stroke-linecap="${a(e.cap)}"`:""}${e.join?` stroke-linejoin="${a(e.join)}"`:""}/>`)],n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a(e.viewBox||"0 0 24 24")}">${i.join("")}</svg>`;return("undefined"!=typeof TextEncoder?(new TextEncoder).encode(n).length:n.length)>32768?void 0:n}(t):void 0;return{id:i,name:r,kind:"keyframes",duration:2,easing:"ease-in-out",iterations:"infinite",target:"icon",origin:"center",version:1,keyframes:[{at:0,opacity:1}],rig:c?{svg:c,parts:l}:{icon:e,parts:l}}}const a=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function o(e,t="center"){const[i,n,s,r]=e,a=/left/.test(t)?0:/right/.test(t)?1:.5,o=/top/.test(t)?0:/bottom/.test(t)?1:.5,l=e=>Math.round(100*e)/100;return[l(i+s*a),l(n+r*o)]}i.d(t,["jo",0,(e,t)=>(0,n.Zg)(t.map(t=>e[t]?.bbox).filter(e=>!!e))])},5084(e,t,i){i.d(t,{Cq:()=>b,Z3:()=>x,ar:()=>C,di:()=>A});var n=i(2637),s=i(1474);const r=(e,t,i,n,s,r)=>({id:e,label:t,min:i,max:n,step:s,default:r}),a=(e=100)=>({...r("share",169,10,100,5,e),unit:"%"}),o=()=>({...r("delay",135,0,90,5,0),unit:"%"}),l=()=>r("intensity",259,.25,3,.25,1),c=()=>r("direction",140,-1,1,2,1),d=(e=100)=>[a(e),o(),l(),c()],p=e=>Math.round(1e3*e)/1e3||0,h=(e,t,i="ease-in-out")=>({t:e,k:{transform:{rotate:p(t)},easing:i}}),u=(e,t,i={},n="ease-in-out")=>{const s={};for(const[e,i]of Object.entries(t))s[e]=p(i);return{t:e,k:{transform:s,...i,easing:n}}},m=(e,t)=>e.map(([e,i])=>h(e,t*i)),g=[{id:"swing",name:473,icon:"mdi:metronome",pivot:"top",help:476,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,1],[.4,-.8],[.6,.5],[.8,-.25],[1,0]],14*e*t)},{id:"ring",name:390,icon:"mdi:bell-ring-outline",pivot:"top",help:394,params:d(70),gen:({intensity:e,direction:t})=>m([[0,0],[.08,1],[.18,-.95],[.28,.85],[.38,-.72],[.48,.58],[.58,-.44],[.68,.3],[.78,-.16],[.88,.06],[1,0]],16*e*t)},{id:"spin",name:446,icon:"mdi:rotate-right",pivot:"center",help:528,params:[a(),o(),r("intensity",527,1,5,1,1),c()],gen:({intensity:e,direction:t})=>[h(0,0,"linear"),h(1,360*Math.max(1,Math.round(e))*t,"linear")]},{id:"pulse",name:369,icon:"mdi:heart-pulse",pivot:"center",help:231,params:d(),gen:({intensity:e,direction:t})=>[u(0,{scale:1}),u(.5,{scale:1+.15*e*t}),u(1,{scale:1})]},{id:"bounce",name:88,icon:"mdi:debug-step-over",pivot:"bottom",help:454,params:d(),gen:({intensity:e,direction:t})=>{const i=-3*e*t;return[u(0,{y:0,scale_x:1,scale_y:1},{},"ease-out"),u(.12,{y:0,scale_x:1.08,scale_y:.9},{},"ease-out"),u(.45,{y:i,scale_x:.96,scale_y:1.06},{},"ease-in"),u(.75,{y:0,scale_x:1.06,scale_y:.92},{},"ease-out"),u(.88,{y:0,scale_x:.98,scale_y:1.02}),u(1,{y:0,scale_x:1,scale_y:1})]}},{id:"shake",name:417,icon:"mdi:vibrate",help:420,params:d(60),gen:({intensity:e,direction:t})=>{const i=1.2*e*t;return[0,-1,1,-1,1,-.6,.6,-.3,.3,0].map((e,t,n)=>u(t/(n.length-1),{x:i*e}))}},{id:"wobble",name:557,icon:"mdi:rotate-3d-variant",pivot:"bottom",help:397,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,-1],[.3,.75],[.45,-.5],[.6,.3],[.75,-.15],[1,0]],8*e*t)},{id:"blink",name:65,icon:"mdi:eye-outline",help:66,params:[a(),o(),l()],gen:({intensity:e})=>{const t=p(Math.max(0,1-.9*e));return[1,t,1,t,1,1].map((e,t)=>({t:[0,.1,.2,.3,.4,1][t],k:{opacity:e,easing:"linear"}}))}},{id:"fade",name:183,icon:"mdi:circle-opacity",help:185,params:[a(),o(),l()],gen:({intensity:e})=>[{t:0,k:{opacity:1,easing:"ease-in-out"}},{t:.5,k:{opacity:p(Math.max(0,1-.8*e)),easing:"ease-in-out"}},{t:1,k:{opacity:1,easing:"ease-in-out"}}]},...[["slide-up",430,313,"mdi:arrow-up","y",-1],["slide-down",427,310,"mdi:arrow-down","y",1],["slide-left",428,311,"mdi:arrow-left","x",-1],["slide-right",429,312,"mdi:arrow-right","x",1]].map(([e,t,i,n,s,r])=>({id:e,name:t,icon:n,help:i,params:d(),gen:({intensity:e,direction:t})=>{const i=3*e*t*r;return[u(0,{[s]:0}),u(.4,{[s]:i}),u(.6,{[s]:i}),u(1,{[s]:0})]}})),{id:"draw-on",name:160,icon:"mdi:draw",draws:!0,help:161,params:[a(60),o(),c()],gen:({direction:e})=>[{t:0,k:{draw:e>0?0:1,easing:"ease-in-out"}},{t:1,k:{draw:e>0?1:0,easing:"ease-in-out"}}]},{id:"draw-loop",name:159,icon:"mdi:draw-pen",draws:!0,help:162,params:[a(),o()],gen:()=>[{t:0,k:{draw:0,easing:"ease-in-out"}},{t:.45,k:{draw:1,easing:"ease-in-out"}},{t:.7,k:{draw:1,easing:"ease-in-out"}},{t:1,k:{draw:0,easing:"ease-in-out"}}]},{id:"pop",name:360,icon:"mdi:star-four-points-outline",pivot:"center",help:361,params:[a(50),o(),l()],gen:({intensity:e})=>[u(0,{scale:0},{opacity:0},"ease-out"),u(.6,{scale:1+.2*e},{opacity:1},"ease-in-out"),u(1,{scale:1},{opacity:1})]},{id:"float",name:206,icon:"mdi:waves-arrow-up",help:163,params:d(),gen:({intensity:e,direction:t})=>[u(0,{y:0}),u(.5,{y:-1.5*e*t}),u(1,{y:0})]},{id:"flicker",name:203,icon:"mdi:fire",pivot:"bottom",help:204,params:[a(),o(),l()],gen:({intensity:e})=>[[0,1,1,0],[.12,1.08,.85,2],[.25,.96,1,-1.5],[.4,1.1,.9,1],[.55,.97,1,-2],[.7,1.06,.85,1.5],[.85,.98,1,-.5],[1,1,1,0]].map(([t,i,n,s])=>u(t,{scale_y:1+(i-1)*e,skew_x:s*e},{opacity:p(1-(1-n)*Math.min(e,1))}))},{id:"wave",name:547,icon:"mdi:wifi",pivot:"center",help:284,params:d(),gen:({intensity:e})=>{const t=p(Math.max(0,1-.7*Math.min(e,1.4))),i=p(1-.08*e);return[u(0,{scale:i},{opacity:t}),u(.35,{scale:1+.04*e},{opacity:1}),u(.7,{scale:i},{opacity:t}),u(1,{scale:i},{opacity:t})]}}],f=g.map(({gen:e,...t})=>t),v=new Map(g.map(e=>[e.id,e]));function b(e,t={}){const i=v.get(e),n={};for(const e of i?.params??[]){const i=t[e.id];n[e.id]="number"==typeof i&&Number.isFinite(i)?Math.min(e.max,Math.max(e.min,i)):e.default}return n}const y=e=>Math.round(100*e)/100;function x(e,t={}){const i=b(e,t),n=i.delay??0;return _(e,i,n,Math.min(100,n+(i.share??100)))}function _(e,t,i,n){const s=v.get(e);return s?function(e,t,i){const n=i-t,s=e=>{const t={...e};return delete t.easing,t},r=[],a=e=>{const t=r.findIndex(t=>t.at===e.at);t>=0?r[t]={...r[t],...e}:r.push(e)};t>0&&a({at:0,...s(e[0].k)});for(const i of e)a({at:y(t+i.t*n),...i.k});return i<100&&a({at:100,...s(e[e.length-1].k)}),r.sort((e,t)=>e.at-t.at)}(s.gen({intensity:t.intensity??1,direction:(t.direction??1)<0?-1:1}),i,Math.max(n,i+1)):[]}const $=e=>/^(part|group|shape):/.test(e),w=e=>e.slice(e.indexOf(":")+1);function k(e,t){const i=w(t);return t.startsWith("part:")?!!e?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e?.groups?.some(e=>e.id===i):t.startsWith("shape:")?!!e?.shapes?.some(e=>e.id===i):["element","icon","name","state","background"].includes(t)}function M(e,t,i){const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s<0&&n.length>=24)return;const r=s>=0?{...n[s],keyframes:i}:{target:t,keyframes:i};return s>=0?n[s]=r:n.push(r),{...e,tracks:n}}function S(e,t,i,r){if(!(i&&r&&e.rig&&$(t)))return e;const a=function(e,t,i){const r=e.rig,a=w(t);if(t.startsWith("shape:")){const e=r?.shapes?.find(e=>e.id===a);return e?(0,n.hd)(e.d):void 0}const o=t.startsWith("group:")?r?.groups?.find(e=>e.id===a)?.parts??[]:[a];return(0,s.jo)(i,o.flatMap(e=>r?.parts.find(t=>t.id===e)?.from??[]))}(e,t,r);if(!a)return e;const[o,l]=(0,s.dI)(a,i),c=`${o}px ${l}px`;return{...e,tracks:(e.tracks??[]).map(e=>e.target===t?{...e,origin:c}:e)}}function j(e,t,i,n){const s=v.get("wave").pivot;return function(e,t){const i=b("wave",e),n=i.delay,s=Math.max(1,Math.min(i.share,100-n)),r=t>1?.6*s:s,a=t>1?(s-r)/(t-1):0;return Array.from({length:t},(e,t)=>[n+t*a,n+t*a+r])}(i,t.length).reduce((e,[r,a],o)=>{const l=M(e,t[o],_("wave",i,r,a));return l?S(l,t[o],s,n.pieces):e},e)}function C(e,t,i,n,s={}){if(t.length<2||"wave"!==i)return t.reduce((e,t)=>function(e,t,i,n,s={}){const r=v.get(i);if(!r||"keyframes"!==e.kind||!k(e.rig,t))return e;if(r.draws&&!$(t))return e;const a=b(i,n);if("wave"===i&&t.startsWith("group:")){let i=e.rig?.groups?.find(e=>e.id===w(t))?.parts??[];a.direction<0&&(i=[...i].reverse());const n={...e,tracks:(e.tracks??[]).filter(e=>e.target!==t)};return n.tracks.length||delete n.tracks,j(n,i.map(e=>`part:${e}`),a,s)}const o=M(e,t,x(i,a));return o?S(o,t,r.pivot,s.pieces):e}(e,t,i,n,s),e);const r=b(i,n),a=(r.direction<0?[...t].reverse():t).filter(t=>k(e.rig,t));return j(e,a,r,s)}function A(e,t){const i=(e.tracks??[]).flatMap(e=>e.target!==t?[e]:e.path?[{...e,keyframes:[]}]:[]),n={...e,tracks:i};return i.length||delete n.tracks,n}i.d(t,["tP",0,f])},1771(e,t,i){i.d(t,{Bq:()=>v,ER:()=>x,Rr:()=>p,fs:()=>f,uD:()=>m});const n=1e-6,s=(e,t)=>Math.abs(e[0]-t[0])<n&&Math.abs(e[1]-t[1])<n,r=(e,t,i)=>e+(t-e)*i,a=(e,t,i)=>[r(e[0],t[0],i),r(e[1],t[1],i)],o=(e,t,i)=>({c1:[e[0]+2/3*(t[0]-e[0]),e[1]+2/3*(t[1]-e[1])],c2:[i[0]+2/3*(t[0]-i[0]),i[1]+2/3*(t[1]-i[1])],to:i}),l=/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;class c{constructor(e){this.d=e,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const e=this.d[this.i];if(e&&/[MmLlHhVvCcSsQqTtAaZz]/.test(e))return this.i++,e}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip(),l.lastIndex=this.i;const e=l.exec(this.d);if(!e)throw new Error(`Bad path number at ${this.i}`);return this.i+=e[0].length,Number(e[0])}flag(){this.skip();const e=this.d[this.i];if("0"!==e&&"1"!==e)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===e?1:0}}function d(e,t,i,r,a,o,l){if(s(e,l))return[];if(t=Math.abs(t),i=Math.abs(i),t<n||i<n)return[{to:l}];const c=r*Math.PI/180,d=Math.cos(c),p=Math.sin(c),h=(e[0]-l[0])/2,u=(e[1]-l[1])/2,m=d*h+p*u,g=-p*h+d*u,f=m*m/(t*t)+g*g/(i*i);if(f>1){const e=Math.sqrt(f);t*=e,i*=e}const v=t*t*i*i-t*t*g*g-i*i*m*m,b=t*t*g*g+i*i*m*m;let y=Math.sqrt(Math.max(0,v/b));a===o&&(y=-y);const x=y*t*g/i,_=-y*i*m/t,$=d*x-p*_+(e[0]+l[0])/2,w=p*x+d*_+(e[1]+l[1])/2,k=(e,t,i,n)=>Math.atan2(e*n-t*i,e*i+t*n),M=(m-x)/t,S=(g-_)/i,j=(-m-x)/t,C=(-g-_)/i,A=k(1,0,M,S);let z=k(M,S,j,C);!o&&z>0?z-=2*Math.PI:o&&z<0&&(z+=2*Math.PI);const q=Math.max(1,Math.ceil(Math.abs(z)/(Math.PI/2)-1e-9)),E=z/q,H=4/3*Math.tan(E/4),L=e=>[$+t*Math.cos(e)*d-i*Math.sin(e)*p,w+t*Math.cos(e)*p+i*Math.sin(e)*d],V=e=>[-t*Math.sin(e)*d-i*Math.cos(e)*p,-t*Math.sin(e)*p+i*Math.cos(e)*d],O=[];let P=e;for(let e=0;e<q;e++){const t=A+e*E,i=t+E,n=e===q-1?l:L(i),s=V(t),r=V(i);O.push({c1:[P[0]+H*s[0],P[1]+H*s[1]],c2:[n[0]-H*r[0],n[1]-H*r[1]],to:n}),P=n}return O}function p(e){const t=new c(e),i=[];let n,r,a,l,p=[0,0],h=[0,0];const u=e=>{n||(n={start:p,segs:[],closed:!1},i.push(n),h=p),n.segs.push(e)};try{for(;!t.done();){const e=t.command();if(e)l=e;else{if(!l||!t.hasNumber())break;"M"===l?l="L":"m"===l&&(l="l")}const i=l===l.toLowerCase(),c=i?p[0]:0,m=i?p[1]:0,g=()=>[t.number()+c,t.number()+m];let f,v,b;switch(l.toUpperCase()){case"M":p=g(),h=p,n=void 0;break;case"L":u({to:b=g()});break;case"H":u({to:b=[t.number()+c,p[1]]});break;case"V":u({to:b=[p[0],t.number()+m]});break;case"C":{const e=g();f=g(),u({c1:e,c2:f,to:b=g()});break}case"S":{const e=r?[2*p[0]-r[0],2*p[1]-r[1]]:p;f=g(),u({c1:e,c2:f,to:b=g()});break}case"Q":v=g(),u(o(p,v,b=g()));break;case"T":v=a?[2*p[0]-a[0],2*p[1]-a[1]]:p,u(o(p,v,b=g()));break;case"A":{const e=t.number(),i=t.number(),n=t.number(),s=t.flag(),r=t.flag();b=g(),d(p,e,i,n,s,r,b).forEach(u);break}case"Z":n&&n.segs.length&&(s(p,h)||n.segs.push({to:h}),n.closed=!0),p=h,n=void 0,l=void 0}b&&(p=b),r=f,a=v}}catch{}return i.filter(e=>e.segs.length>0)}const h=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},u=e=>`${h(e[0])} ${h(e[1])}`;function m(e){return e.map(e=>{const t=e.segs.slice(),i=t[t.length-1];return e.closed&&i&&!i.c1&&s(i.to,e.start)&&t.length>1&&t.pop(),[`M${u(e.start)}`,...t.map(e=>e.c1&&e.c2?`C${u(e.c1)} ${u(e.c2)} ${u(e.to)}`:`L${u(e.to)}`),...e.closed?["Z"]:[]].join(" ")}).join(" ")}function g(e,t,i){const n=1-i;return t.c1&&t.c2?[n*n*n*e[0]+3*n*n*i*t.c1[0]+3*n*i*i*t.c2[0]+i*i*i*t.to[0],n*n*n*e[1]+3*n*n*i*t.c1[1]+3*n*i*i*t.c2[1]+i*i*i*t.to[1]]:[e[0]+(t.to[0]-e[0])*i,e[1]+(t.to[1]-e[1])*i]}function f(e,t){const[i,n,s,r]=e,o=a(i,n,t),l=a(n,s,t),c=a(s,r,t),d=a(o,l,t),p=a(l,c,t),h=a(d,p,t);return[[i,o,d,h],[h,p,c,r]]}function v(e,t=12){const i=[e.start];let n=e.start;for(const s of e.segs){if(s.c1)for(let e=1;e<t;e++)i.push(g(n,s,e/t));i.push(s.to),n=s.to}return i.length>1&&s(i[i.length-1],e.start)&&i.pop(),i}const b=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1]),y=e=>{const t=Math.round(1e3*e)/1e3;return String(Object.is(t,-0)?0:t)};function x(e){return e.map(e=>{if(!e.length)return"";const t=e=>`${y(e[0])} ${y(e[1])}`,i=e.map(e=>`C${t(e[1])} ${t(e[2])} ${t(e[3])}`).join("");return`M${t(e[0][0])}${i}${(e=>e.length>1&&s(e[0][0],e[e.length-1][3]))(e)?"Z":""}`}).join("")}i.d(t,["Mj",0,e=>p(e).map(e=>{let t=e.start;return e.segs.map(e=>{const i=((e,t)=>t.c1&&t.c2?[e,t.c1,t.c2,t.to]:((e,t)=>[e,a(e,t,1/3),a(e,t,2/3),t])(e,t.to))(t,e);return t=e.to,i})}),"Mo",0,(e,t)=>{const i=1-t;return[i*i*i*e[0][0]+3*i*i*t*e[1][0]+3*i*t*t*e[2][0]+t*t*t*e[3][0],i*i*i*e[0][1]+3*i*i*t*e[1][1]+3*i*t*t*e[2][1]+t*t*t*e[3][1]]},"Wv",0,(e,t,i)=>{const n=i[0]-t[0],s=i[1]-t[1],r=n*n+s*s;if(r<1e-9)return b(e,t);const a=Math.max(0,Math.min(1,((e[0]-t[0])*n+(e[1]-t[1])*s)/r));return b(e,[t[0]+n*a,t[1]+s*a])},"xg",0,b])},8164(e,t,i){i.r(t),i.d(t,{append:()=>$,bounds:()=>H,fmtNum:()=>p,fromEdit:()=>f,insertAt:()=>_,isSmooth:()=>v,moveAnchor:()=>k,nearestOnPath:()=>y,remove:()=>w,reverse:()=>z,segment:()=>g,segmentCount:()=>m,setClosed:()=>q,setHandle:()=>M,setKind:()=>S,smoothAll:()=>C,toEdit:()=>u,toggleSmooth:()=>A,transform:()=>E});var n=i(1771);const s=1e-4,r=(e,t,i=s)=>Math.abs(e[0]-t[0])<i&&Math.abs(e[1]-t[1])<i,a=(e,t,i)=>[e[0]+(t[0]-e[0])*i,e[1]+(t[1]-e[1])*i],o=e=>[e.x,e.y],l=e=>e?[e[0],e[1]]:void 0,c=e=>{const t={x:e.x,y:e.y,in:l(e.in),out:l(e.out)};return e.kind&&(t.kind=e.kind),t},d=e=>({anchors:e.anchors.map(c),closed:e.closed});function p(e){const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)}const h=e=>{const t=Math.max(s,.001*Math.hypot(e[3][0]-e[0][0],e[3][1]-e[0][1]));return r(e[1],a(e[0],e[3],1/3),t)&&r(e[2],a(e[0],e[3],2/3),t)};function u(e){const t=[{x:e.start[0],y:e.start[1]}];let i=e.start;for(const n of e.segs){const e=t[t.length-1],s={x:n.to[0],y:n.to[1]};n.c1&&n.c2&&!h([i,n.c1,n.c2,n.to])&&(r(n.c1,i)||(e.out=[n.c1[0],n.c1[1]]),r(n.c2,n.to)||(s.in=[n.c2[0],n.c2[1]])),t.push(s),i=n.to}const n=e.closed&&e.segs.length>0;if(n&&t.length>1){const e=t.pop();t[0].in=e.in}return{anchors:t,closed:n&&t.length>1}}function m(e){const t=e.anchors.length;return t<2?0:e.closed?t:t-1}function g(e,t){const i=e.anchors[t],n=e.anchors[(t+1)%e.anchors.length];return[o(i),i.out??o(i),n.in??o(n),o(n)]}function f(e){const t=e.anchors[0],i=Array.from({length:m(e)},(t,i)=>{const n=g(e,i);return((e,t)=>!e.anchors[t].out&&!e.anchors[(t+1)%e.anchors.length].in)(e,i)?{to:n[3]}:{c1:n[1],c2:n[2],to:n[3]}});return{start:t?o(t):[0,0],segs:i,closed:e.closed&&e.anchors.length>1}}function v(e){if(!e.in||!e.out)return!1;const t=e.in[0]-e.x,i=e.in[1]-e.y,n=e.out[0]-e.x,r=e.out[1]-e.y,a=Math.hypot(t,i),o=Math.hypot(n,r);return!(a<s||o<s)&&-(t*n+i*r)/(a*o)>.9995}const b=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,r=3*i*t*t,a=t*t*t;return[n*e[0][0]+s*e[1][0]+r*e[2][0]+a*e[3][0],n*e[0][1]+s*e[1][1]+r*e[2][1]+a*e[3][1]]};function y(e,t,i=[1,1]){const n=m(e);if(!n)return;const s=e=>Math.hypot((e[0]-t[0])*i[0],(e[1]-t[1])*i[1]);let r;for(let t=0;t<n;t++){const i=g(e,t),n=32;let a=0,o=1/0;for(let e=0;e<=n;e++){const t=s(b(i,e/n));t<o&&(o=t,a=e/n)}let l=1/n;for(let e=0;e<12;e++){l/=2;for(const e of[a-l,a+l]){if(e<0||e>1)continue;const t=s(b(i,e));t<o&&(o=t,a=e)}}(!r||o<r.dist)&&(r={seg:t,t:a,point:b(i,a),dist:o})}return r}const x=e=>e.anchors.length<100;function _(e,t,i){const s=d(e),l=s.anchors.length;if(t<0||t>=m(s)||!x(s))return{path:s,index:-1};const c=s.anchors[t],p=s.anchors[(t+1)%l],h=Math.min(1,Math.max(0,i));if(!c.out&&!p.in){const e=a(o(c),o(p),h);return s.anchors.splice(t+1,0,{x:e[0],y:e[1]}),{path:s,index:t+1}}const[u,f]=(0,n.fs)(g(s,t),h);c.out=r(u[1],u[0])?void 0:u[1],p.in=r(f[2],f[3])?void 0:f[2];const v={x:u[3][0],y:u[3][1],in:r(u[2],u[3])?void 0:u[2],out:r(f[1],f[0])?void 0:f[1]};return s.anchors.splice(t+1,0,v),{path:s,index:t+1}}function $(e,t,i=!1){const n=d(e);if(!x(n))return{path:n,index:-1};const s={x:t[0],y:t[1]};return i?(n.anchors.unshift(s),{path:n,index:0}):(n.anchors.push(s),{path:n,index:n.anchors.length-1})}function w(e,t){const i=d(e);return t<0||t>=i.anchors.length||(i.anchors.splice(t,1),i.anchors.length<2&&(i.closed=!1)),i}function k(e,t,i,n){const s=d(e),r=s.anchors[t];if(!r)return s;const a=i-r.x,o=n-r.y;return r.x=i,r.y=n,r.in&&(r.in=[r.in[0]+a,r.in[1]+o]),r.out&&(r.out=[r.out[0]+a,r.out[1]+o]),s}function M(e,t,i,n,s){const a=d(e),l=a.anchors[t];if(!l)return a;const c=s??(e=>e.kind??(v(e)?"smooth":"corner"))(l),p=r(n,o(l))?void 0:[n[0],n[1]];l[i]=p;const h="in"===i?"out":"in";if("symmetric"===c)l[h]=p?[2*l.x-p[0],2*l.y-p[1]]:void 0;else if("smooth"===c&&p&&l[h]){const e=Math.hypot(l[h][0]-l.x,l[h][1]-l.y),t=Math.hypot(l.x-p[0],l.y-p[1]);l[h]=[l.x+(l.x-p[0])/t*e,l.y+(l.y-p[1])/t*e]}return a}function S(e,t,i){const n=d(e),s=n.anchors[t];return s?(s.kind=i,"corner"!==i&&s.in&&s.out?M(n,t,"in",s.in,i):n):n}function j(e,t,i){const n=t.anchors[i],r=function(e,t){const i=e.anchors.length;if(i<2)return;const n=e.anchors[t],r=t>0?e.anchors[t-1]:e.closed?e.anchors[i-1]:n,a=t<i-1?e.anchors[t+1]:e.closed?e.anchors[0]:n,o=(a.x-r.x)/6,l=(a.y-r.y)/6;return Math.hypot(o,l)<s?void 0:[o,l]}(e,i);r&&(n.in=e.closed||i>0?[n.x-r[0],n.y-r[1]]:void 0,n.out=e.closed||i<e.anchors.length-1?[n.x+r[0],n.y+r[1]]:void 0)}function C(e){const t=d(e);for(let i=0;i<t.anchors.length;i++)j(e,t,i);return t}function A(e,t){const i=d(e),n=i.anchors[t];return n?(n.in||n.out?(n.in=void 0,n.out=void 0):j(e,i,t),i):i}function z(e){const t=e.anchors.map(e=>{const t={x:e.x,y:e.y,in:l(e.out),out:l(e.in)};return e.kind&&(t.kind=e.kind),t}).reverse();return e.closed&&t.length&&t.unshift(t.pop()),{anchors:t,closed:e.closed}}function q(e,t){const i=d(e);return i.closed=t&&i.anchors.length>1,!i.closed&&i.anchors.length&&(i.anchors[0].in=void 0,i.anchors[i.anchors.length-1].out=void 0),i}function E(e,t){const i=(e,i)=>[t[0]*e+t[2]*i+t[4],t[1]*e+t[3]*i+t[5]],n=e=>e?i(e[0],e[1]):void 0;return{anchors:e.anchors.map(e=>{const[t,s]=i(e.x,e.y),r={x:t,y:s,in:n(e.in),out:n(e.out)};return e.kind&&(r.kind=e.kind),r}),closed:e.closed}}function H(e){const t=[];for(const i of e.anchors)t.push(o(i)),i.in&&t.push(i.in),i.out&&t.push(i.out);if(!t.length)return;const i=t.map(e=>e[0]),n=t.map(e=>e[1]),s=Math.min(...i),r=Math.min(...n);return{x:s,y:r,w:Math.max(...i)-s,h:Math.max(...n)-r}}i.d(t,["MAX_ANCHORS",0,100,"canAdd",0,x,"copyAnchor",0,c,"copyPath",0,d,"serialize",0,e=>e.anchors.length?(0,n.uD)([f(e)]):"","snap",0,(e,t)=>t>0?Math.round(e/t)*t:e,"straightenAll",0,e=>({anchors:e.anchors.map(e=>({x:e.x,y:e.y})),closed:e.closed}),"translate",0,(e,t,i)=>E(e,[1,0,0,1,t,i])])},3910(e,t,i){i.d(t,{I:()=>o,M7:()=>l,dp:()=>c,wn:()=>a});const n=/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i,s=e=>32===e||e>=9&&e<=13||160===e||5760===e||e>=8192&&e<=8202||8232===e||8233===e||8239===e||8287===e||12288===e||65279===e,r=e=>e>=65&&e<=90||e>=97&&e<=122;function a(e,t){for(let i=e.indexOf("(");i>=0;i=e.indexOf("(",i+1)){let n=i;for(;n>0&&s(e.charCodeAt(n-1));)n--;let a=n;for(;a>0&&(r(e.charCodeAt(a-1))||45===e.charCodeAt(a-1));)a--;if(a===n||!t.includes(e.slice(a,n).toLowerCase()))return!1}return!0}function o(e,t){return Object.prototype.hasOwnProperty.call(e.kinds,t)?e.kinds[t]:e.fallback}function l(e,t,i){if(void 0!==i.maxValueChars&&t.length>i.maxValueChars)return;const s=t.trim();if(!function(e,t){if(n.test(e))return!0;if(!t.denyExtra.length)return!1;const i=e.toLowerCase();return t.denyExtra.some(e=>i.includes(e))}(s,i)){if("transform"===e)return a(s,i.transformFunctions)?t:void 0;if(a(s.replace(/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,""),i.colourFunctions))return"id"===e?/^[\w.:-]+$/.test(s)?s:void 0:"class"===e?function(e,t){const i=e.split(/\s+/).filter(e=>t.test(e));return i.length?i.join(" "):void 0}(s,/^[\w-]+$/):t}}function c(e){return"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length}const d=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");i.d(t,["X1",0,d,"dc",0,e=>d(e).replace(/"/g,"&quot;")])},2637(e,t,i){i.d(t,{WP:()=>p,Zg:()=>h,hd:()=>u});var n=i(1771);function s(e){const t=e.length?[e[0][0]]:[];for(const[i,n,s,r]of e)for(let e=1;e<=8;e++){const a=e/8,o=1-a,l=o*o*o,c=3*o*o*a,d=3*o*a*a,p=a*a*a;t.push([l*i[0]+c*n[0]+d*s[0]+p*r[0],l*i[1]+c*n[1]+d*s[1]+p*r[1]])}return t}function r(e){let t=0;for(let i=0;i<e.length;i++){const[n,s]=e[i],[r,a]=e[(i+1)%e.length];t+=n*a-r*s}return t/2}function a(e){if(!e.length)return[0,0,0,0];let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const[r,a]of e)r<t&&(t=r),a<i&&(i=a),r>n&&(n=r),a>s&&(s=a);const r=e=>+e.toFixed(3);return[r(t),r(i),r(n-t),r(s-i)]}function o(e,t){let i=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const[r,a]=t[n],[o,l]=t[s];a>e[1]!=l>e[1]&&e[0]<(o-r)*(e[1]-a)/(l-a)+r&&(i=!i)}return i}function l(e,t){if(!((e,t,i=.001)=>e[0]>=t[0]-i&&e[1]>=t[1]-i&&e[0]+e[2]<=t[0]+t[2]+i&&e[1]+e[3]<=t[1]+t[3]+i)(t.box,e.box))return!1;const i=t.poly,n=Math.max(1,Math.floor(i.length/16));let s=0,r=0;for(let t=0;t<i.length;t+=n)s++,o(i[t],e.poly)&&r++;return s>0&&r/s>=.6}const c=1e-6,d=(e,t)=>({index:e,d:(0,n.ER)(t),bbox:a(t.flatMap(s))});function p(e){const t=[],i=e=>t.push({...e,index:t.length}),o=(t,i)=>!!e.evenodd?.[t]?.includes(i),p=e=>e?{evenodd:!0}:{},h=e=>(0,n.Mj)(e).filter(e=>Math.abs(r(s(e)))>c);if((e.secondary??[]).forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),secondary:!0,...p(o("accent",t))})}),1===e.paths.length){const t=o("paths",0);for(const o of function(e,t=!1){const i=(0,n.Mj)(e).map(e=>{const t=s(e);return{cubics:e,poly:t,area:r(t),box:a(t)}}).filter(e=>Math.abs(e.area)>c),o=i.map((e,t)=>t),d=i.map((e,t)=>t).sort((e,t)=>Math.abs(i[t].area)-Math.abs(i[e].area)||e-t);d.forEach((e,n)=>{let s=-1,r=0,a=0;for(let t=0;t<n;t++){const n=d[t];Math.abs(i[n].area)<=Math.abs(i[e].area)||l(i[n],i[e])&&(r+=Math.sign(i[n].area),a++,(s<0||Math.abs(i[n].area)<Math.abs(i[s].area))&&(s=n))}const c=t?a%2==1:0!==r&&r+Math.sign(i[e].area)===0;s>=0&&c&&(o[e]=o[s])});const p=new Map;return o.forEach((e,t)=>{const i=p.get(e);i?i.push(t):p.set(e,[t])}),[...p.values()].sort((e,t)=>e[0]-t[0]).map(e=>e.map(e=>i[e].cubics))}(e.paths[0],t))i({...d(0,o),...p(t)})}else e.paths.forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),...p(o("paths",t))})});for(const t of e.strokes??[]){const e=(0,n.Mj)(t.d);e.length&&i({...d(0,e),stroke:{width:t.width,...t.cap?{cap:t.cap}:{},...t.join?{join:t.join}:{}},...t.accent?{secondary:!0}:{}})}return t}function h(e){if(!e.length)return;const t=Math.min(...e.map(e=>e[0])),i=Math.min(...e.map(e=>e[1])),n=Math.max(...e.map(e=>e[0]+e[2])),s=Math.max(...e.map(e=>e[1]+e[3])),r=e=>+e.toFixed(3);return[r(t),r(i),r(n-t),r(s-i)]}function u(e){return a((0,n.Mj)(e).flatMap(s))}},2231(e,t,i){i.d(t,{t:()=>s});const n="2026.10.12-beta.13";function s(e,t){if(t?.BUILD===n)return t;console.warn(`Magic Card was updated, reload the page (magic-card.js ${n}, ${e} ${String(t?.BUILD)}).`)}i.d(t,["Q",0,n])},796(e,t,i){function n(e,t,i=1){const n={maximumFractionDigits:i};"none"===e?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(function(e){switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return function(e){return e?.locale?.language||e?.language||void 0}(e)}}(e),n).format(t)}catch{return String(t)}}i.d(t,{ZV:()=>n})},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>a});var n=i(842);const s={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},r=(e=s,t,i)=>{const{kind:n,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function a(e){return(t,i)=>"object"==typeof i?r(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>s});var n=i(5694);function s(e){return(0,n.M)({...e,state:!0,attribute:!1})}},842(e,t,i){i.d(t,{mN:()=>M,AH:()=>c,W3:()=>$,Ec:()=>w,iz:()=>l});const n=globalThis,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),a=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new o("string"==typeof e?e:e+"",void 0,r),c=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,r)},d=(e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=n.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}},p=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return l(t)})(e):e,{is:h,defineProperty:u,getOwnPropertyDescriptor:m,getOwnPropertyNames:g,getOwnPropertySymbols:f,getPrototypeOf:v}=Object,b=globalThis,y=b.trustedTypes,x=y?y.emptyScript:"",_=b.reactiveElementPolyfillSupport,$={toAttribute(e,t){switch(t){case Boolean:e=e?x:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!h(e,t),k={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class M extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&u(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const r=n?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty("elementProperties"))return;const e=v(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty("finalized"))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty("properties")){const e=this.properties,t=[...g(e),...f(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:$;this._$Em=n;const r=s.fromAttribute(t,e.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const r=this.constructor;if(!1===n&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??w)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}M.elementStyles=[],M.shadowRootOptions={mode:"open"},M.elementProperties=new Map,M.finalized=new Map,_?.({ReactiveElement:M}),(b.reactiveElementVersions??=[]).push("2.1.2")},7804(e,t,i){i.d(t,{WL:()=>n});class n{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}i.d(t,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,e=>(...t)=>({_$litDirective$:e,values:t})])},6752(e,t,i){const n=globalThis,s=e=>e,r=n.trustedTypes,a=r?r.createPolicy("lit-html",{createHTML:e=>e}):void 0,o="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,c="?"+l,d=`<${c}>`,p=document,h=()=>p.createComment(""),u=e=>null===e||"object"!=typeof e&&"function"!=typeof e,m=Array.isArray,g=e=>m(e)||"function"==typeof e?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,b=/-->/g,y=/>/g,x=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),_=/'/g,$=/"/g,w=/^(?:script|style|textarea|title)$/i,k=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),M=k(1),S=k(2),j=k(3),C=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),z=new WeakMap,q=p.createTreeWalker(p,129);function E(e,t){if(!m(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==a?a.createHTML(t):t}const H=(e,t)=>{const i=e.length-1,n=[];let s,r=2===t?"<svg>":3===t?"<math>":"",a=v;for(let t=0;t<i;t++){const i=e[t];let c,p,h=-1,u=0;for(;u<i.length&&(a.lastIndex=u,p=a.exec(i),null!==p);)u=a.lastIndex,a===v?"!--"===p[1]?a=b:void 0!==p[1]?a=y:void 0!==p[2]?(w.test(p[2])&&(s=RegExp("</"+p[2],"g")),a=x):void 0!==p[3]&&(a=x):a===x?">"===p[0]?(a=s??v,h=-1):void 0===p[1]?h=-2:(h=a.lastIndex-p[2].length,c=p[1],a=void 0===p[3]?x:'"'===p[3]?$:_):a===$||a===_?a=x:a===b||a===y?a=v:(a=x,s=void 0);const m=a===x&&e[t+1].startsWith("/>")?" ":"";r+=a===v?i+d:h>=0?(n.push(c),i.slice(0,h)+o+i.slice(h)+l+m):i+l+(-2===h?t:m)}return[E(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class L{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,a=0;const d=e.length-1,p=this.parts,[u,m]=H(e,t);if(this.el=L.createElement(u,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=q.nextNode())&&p.length<d;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(o)){const t=m[a++],i=n.getAttribute(e).split(l),r=/([.?@])?(.*)/.exec(t);p.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?D:"?"===r[1]?N:"@"===r[1]?T:R}),n.removeAttribute(e)}else e.startsWith(l)&&(p.push({type:6,index:s}),n.removeAttribute(e));if(w.test(n.tagName)){const e=n.textContent.split(l),t=e.length-1;if(t>0){n.textContent=r?r.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],h()),q.nextNode(),p.push({type:2,index:++s});n.append(e[t],h())}}}else if(8===n.nodeType)if(n.data===c)p.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(l,e+1));)p.push({type:7,index:s}),e+=l.length-1}s++}}static createElement(e,t){const i=p.createElement("template");return i.innerHTML=e,i}}function V(e,t,i=e,n){if(t===C)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=u(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=V(e,s._$AS(e,t.values),s,n)),t}class O{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??p).importNode(t,!0);q.currentNode=n;let s=q.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new P(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new F(s,this,e)),this._$AV.push(t),o=i[++a]}r!==o?.index&&(s=q.nextNode(),r++)}return q.currentNode=p,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class P{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),u(e)?e===A||null==e||""===e?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==C&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):g(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&u(this._$AH)?this._$AA.nextSibling.data=e:this.T(p.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=L.createElement(E(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new O(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=z.get(e.strings);return void 0===t&&z.set(e.strings,t=new L(e)),t}k(e){m(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new P(this.O(h()),this.O(h()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=s(e).nextSibling;s(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}_$AI(e,t=this,i,n){const s=this.strings;let r=!1;if(void 0===s)e=V(this,e,t,0),r=!u(e)||e!==this._$AH&&e!==C,r&&(this._$AH=e);else{const n=e;let a,o;for(e=s[0],a=0;a<s.length-1;a++)o=V(this,n[i+a],t,a),o===C&&(o=this._$AH[a]),r||=!u(o)||o!==this._$AH[a],o===A?e=A:e!==A&&(e+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class D extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}}class N extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}}class T extends R{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=V(this,e,t,0)??A)===C)return;const i=this._$AH,n=e===A&&i!==A||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==A&&(i===A||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class F{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}}const I={M:o,P:l,A:c,C:1,L:H,R:O,D:g,V,I:P,H:R,N,U:T,B:D,F},B=n.litHtmlPolyfillSupport;B?.(L,P),(n.litHtmlVersions??=[]).push("3.3.3"),i.d(t,["JW",0,S,"XX",0,(e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new P(t.insertBefore(h(),e),e,void 0,i??{})}return s._$AI(e),s},"c0",0,C,"ej",0,j,"ge",0,I,"qy",0,M,"s6",0,A])},5707(e,t,i){i.d(t,{EM:()=>n.E,MZ:()=>s.M,wk:()=>r.w});var n=i(6505),s=i(5694),r=i(4290)},2618(e,t,i){i.d(t,{WF:()=>a,AH:()=>n.AH,qy:()=>s.qy,s6:()=>s.s6,JW:()=>s.JW,iz:()=>n.iz});var n=i(842),s=i(6752);const r=globalThis;class a extends n.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,s.XX)(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return s.c0}}a._$litElement$=!0,a.finalized=!0,r.litElementHydrateSupport?.({LitElement:a});const o=r.litElementPolyfillSupport;o?.({LitElement:a}),(r.litElementVersions??=[]).push("4.2.2")}};const t={};function i(n){const s=t[n];if(void 0!==s)return s.exports;const r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}if(i.m=e,i.d=(e,t)=>{if(Array.isArray(t))for(var n=0;n<t.length;){var s=t[n++],r=t[n++],a=0===r?{enumerable:!0,value:t[n++]}:{enumerable:!0,get:r};i.o(e,s)||Object.defineProperty(e,s,a)}else for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.f={},i.e=e=>{const t=[];return i.f.j(e,t),Promise.all(t)},i.u=e=>"magic-card-"+{249:"i18n-labels",334:"icon-library",342:"i18n-icons",417:"svg-css",494:"preset-catalogue",575:"path-canvas"}[e]+"."+{249:"2fdda151",334:"3a74b360",342:"9aef7ed8",417:"1900535b",494:"a488cdf7",575:"07c04c7f"}[e]+".js",i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="",(()=>{const e={126:0,885:0},t=t=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:s,__webpack_esm_runtime__:r}=t;var a,o,l=0;for(a in s)i.o(s,a)&&(i.m[a]=s[a]);for(r&&r(i);l<n.length;l++)o=n[l],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0};i.f.j=(n,s)=>{let r=i.o(e,n)?e[n]:void 0;if(0!==r)if(r)s.push(r[1]);else{let a=import(i.p+i.u(n)).then(t,t=>{throw 0!==e[n]&&(e[n]=void 0),t});a=Promise.race([a,new Promise(t=>r=e[n]=[t])]),s.push(r[1]=a)}}})(),"undefined"!=typeof location){const e=function(e,t){try{const i=new URL(e);return i.protocol===t.protocol&&i.host===t.host?new URL(".",i).href:""}catch{return""}}(import.meta.url,location);e&&(i.p=e)}var n=i(2618),s=i(5707);const r=n.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,a=n.AH`${r} .menu{position:fixed;inset:auto;z-index:30;margin:0;min-width:240px;max-width:calc(100vw - 16px);padding:4px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2));font-size:.875rem;line-height:1.3}.item{display:flex;flex-wrap:wrap;align-items:center;gap:2px 12px;min-height:var(--mc-hit,40px);padding:0 12px;border-radius:var(--mc-radius,8px);cursor:pointer;outline:none}.item:hover{background:var(--mc-surface-2,#f2f3f5)}.item:focus-visible{background:var(--mc-surface-2,#f2f3f5);outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:-2px}.item.danger{color:var(--mc-error-ink,#b3261e)}.item[aria-disabled='true']{opacity:.6;cursor:default}.item[aria-disabled='true']:hover{background:transparent}.glyph{display:inline-flex;color:var(--mc-text-2,#5f6368)}.label{flex:1}.item:has(.sub-line){padding-block:6px}.sub-line{flex-basis:100%;font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys,.why{font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys{font-family:var(--mc-mono,ui-monospace,monospace)}.why{display:none;flex-basis:100%}.item:focus .why{display:block}.sep{height:1px;margin:4px 0;background:var(--mc-divider,rgba(0,0,0,.12))}@media (pointer:coarse){.item{min-height:var(--mc-hit,44px)}.keys{display:none}}`,o=n.AH`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`,l=n.AH`${r}${o}`,c=n.AH`${r} .panel{position:fixed;inset:auto;z-index:30;margin:0;max-width:min(360px,calc(100vw - 16px));padding:12px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2))}`,d={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},p={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},h=e=>Object.prototype.hasOwnProperty.call(p,e),u=(e,t=20)=>h(e)?n.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${p[e]} fill="currentColor"></path></svg>`:n.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${d[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,m=e=>Object.prototype.hasOwnProperty.call(d,e)||h(e);function g(e,t,i="start"){const n=window.innerWidth||document.documentElement.clientWidth||0,s=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const r=e.offsetWidth,a=e.offsetHeight,o=s-t.bottom-4-8,l=t.top-4-8,c=s>0&&a>o&&l>o,d=c?l:o;s>0&&a>d&&(e.style.maxHeight=`${Math.max(120,d)}px`);const p=Math.min(a,s>0?Math.max(120,d):a),h=c?Math.max(8,t.top-4-p):t.bottom+4;let u="end"===i?t.right-r:t.left;return n>0&&(u=Math.min(u,n-r-8)),u=Math.max(8,u),Object.assign(e.style,{top:`${Math.round(h)}px`,left:`${Math.round(u)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=c?"top":"bottom",c?"top":"bottom"}function f(e,t,i=0){const n=e.getBoundingClientRect(),s=(e,t,n)=>{let s=e+i;return s+t>n-8&&(s=e-i-t),Math.max(8,Math.min(s,n-8-t))},r=[s(t[0],n.width,window.innerWidth),s(t[1],n.height,window.innerHeight)];return Object.assign(e.style,{left:`${r[0]}px`,top:`${r[1]}px`,right:"auto",bottom:"auto"}),r}function v(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}var b=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class y extends n.WF{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],n=i.indexOf(e.composedPath()[0]),s=this.entries(),r=i.length,a=e=>i[(e+r)%r]?.focus(),o=e.key;let l=!0;if("ArrowDown"===o)a(n+1);else if("ArrowUp"===o)a(n<0?r-1:n-1);else if("Home"===o)a(0);else if("End"===o)a(r-1);else if("Enter"===o||" "===o)this.pick(n,i[n]);else if("ArrowRight"===o)this._sub<0&&s[n]?.items&&this.openSub(n,i[n]);else if("ArrowLeft"===o||"Escape"===o)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===o&&this.close("escape");else if("Tab"===o)l=!1,this.close("tab");else if(1!==o.length||e.ctrlKey||e.metaKey||e.altKey)l=!1;else{const e=s.map((e,t)=>(n+1+t)%r).find(e=>s[e].label.toLowerCase().startsWith(o.toLowerCase()));void 0!==e&&a(e)}l&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))v(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&(v(e),this.anchor?g(e,this.anchor.getBoundingClientRect(),this.align):f(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){v(e);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect().width;f(e,[i.right+n+8<=window.innerWidth?i.right:Math.max(8,i.left-n),i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&m(e.glyph)?n.qy`<span class="glyph">${u(e.glyph,18)}</span>`:e.icon?n.qy`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:n.s6}row(e,t){const i=!!e.items,s=void 0===e.checked?"menuitem":"menuitemcheckbox";return n.qy`${e.separatorBefore?n.qy`<div class="sep" role="separator"></div>`:n.s6}<div class="item ${e.danger?"danger":""}" role=${s} tabindex="-1" aria-checked=${void 0===e.checked?n.s6:String(e.checked)} aria-disabled=${e.reason?"true":n.s6} aria-description=${e.reason??e.sub??n.s6} aria-keyshortcuts=${e.keys??n.s6} aria-haspopup=${i?"menu":n.s6} aria-expanded=${i?String(this._sub===t):n.s6} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?n.qy`<span class="keys">${e.keys}</span>`:n.s6}${i?"›":n.s6}${e.reason?n.qy`<span class="why">${e.reason}</span>`:n.s6}${e.sub?n.qy`<span class="sub-line">${e.sub}</span>`:n.s6}</div>`}render(){if(!this._open)return n.s6;const e=this.items[this._sub];return n.qy`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?n.qy`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:n.s6}`}}y.uiKitRevision=5,y.styles=a,b([(0,s.MZ)({attribute:!1})],y.prototype,"items",void 0),b([(0,s.MZ)()],y.prototype,"label",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"at",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"anchor",void 0),b([(0,s.MZ)()],y.prototype,"align",void 0),b([(0,s.MZ)({type:Boolean})],y.prototype,"touch",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"opener",void 0),b([(0,s.wk)()],y.prototype,"_open",void 0),b([(0,s.wk)()],y.prototype,"_sub",void 0);var x=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class _ extends n.WF{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&(v(e),this.anchor&&g(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?n.qy`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:n.s6}}_.uiKitRevision=5,_.styles=c,x([(0,s.MZ)({attribute:!1})],_.prototype,"anchor",void 0),x([(0,s.MZ)()],_.prototype,"label",void 0),x([(0,s.MZ)()],_.prototype,"align",void 0),x([(0,s.wk)()],_.prototype,"_open",void 0);const $=[420,480,640,880];function w(e,t,i){const n=Math.min(Math.max(e.w,320),t-32);return{w:n,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-n),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const k=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});var M=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const S=["centre","end","start"],j='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';class C extends n.WF{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._rtl=!1,this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=w(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{if("Tab"===e.key)return this._tab(e);"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,n=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,n)<4)return;t.moved=!0,this._dock=0;const s=t.r0;if("move"===t.mode)return this._set({...s,x:s.x+i,y:s.y+n});const r=this._rtl,a=w({...s,w:s.w+(r?-i:i),h:s.h+n},this._vw(),this._vh());this._set({...a,x:r?s.x+s.w-a.w:s.x})},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),this._rtl="rtl"===getComputedStyle(this).direction,window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector(j);(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=w(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_tab(e){if(e.defaultPrevented)return;const t=[],i=e=>{if(e instanceof HTMLElement&&!e.hasAttribute("hidden")){if(e instanceof HTMLSlotElement)return e.assignedNodes({flatten:!0}).forEach(i);e.matches(j)&&t.push(e),(e.shadowRoot??e).childNodes.forEach(i)}};this.renderRoot.childNodes.forEach(i);const n=t.indexOf(e.composedPath()[0]),s=e.shiftKey?0===n?t[t.length-1]:void 0:n===t.length-1?t[0]:void 0;s&&(e.preventDefault(),s.focus({preventScroll:!0}))}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%S.length,this._set(function(e,t,i,n,s){if("centre"===t)return k(e,n,s);const r="end"===t!==i;return{...e,x:r?n-e.w-16:16}}(this._now(),S[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=$.find(t=>t>e.w+1)??$[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=this._now();if(this._dock=0,!i){if("move"===e)return this._set(k(n,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const s=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...n,w:s.w,h:s.h})}if("move"===e)return this._set({...n,x:n.x+i[0],y:n.y+i[1]});const s=this._rtl,r=w({...n,w:n.w+(s?-i[0]:i[0]),h:n.h+i[1]},this._vw(),this._vh());this._set({...r,x:s?n.x+n.w-r.w:n.x})}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return n.s6;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,s=t&&this.resizable&&!this.maximized,r=t&&this.maximizable;return n.qy`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${s?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?n.qy`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${u("grip",20)}</button>`:n.s6}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${r?n.qy`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${u(this.maximized?"restore":"maximize",20)}</button>`:n.s6} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${u("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${s?n.qy`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${u("resizeCorner",20)}</button>`:n.s6}</dialog>`}}C.uiKitRevision=5,C.styles=l,M([(0,s.MZ)()],C.prototype,"heading",void 0),M([(0,s.MZ)()],C.prototype,"closeLabel",void 0),M([(0,s.MZ)()],C.prototype,"variant",void 0),M([(0,s.MZ)({reflect:!0})],C.prototype,"size",void 0),M([(0,s.MZ)()],C.prototype,"initialFocus",void 0),M([(0,s.MZ)({attribute:!1})],C.prototype,"opener",void 0),M([(0,s.MZ)({type:Boolean})],C.prototype,"dismissible",void 0),M([(0,s.MZ)({type:Boolean})],C.prototype,"movable",void 0),M([(0,s.MZ)({type:Boolean})],C.prototype,"resizable",void 0),M([(0,s.MZ)({type:Boolean})],C.prototype,"maximizable",void 0),M([(0,s.MZ)({type:Boolean,reflect:!0})],C.prototype,"maximized",void 0),M([(0,s.MZ)()],C.prototype,"moveLabel",void 0),M([(0,s.MZ)()],C.prototype,"resizeLabel",void 0),M([(0,s.MZ)()],C.prototype,"maximizeLabel",void 0),M([(0,s.MZ)()],C.prototype,"restoreLabel",void 0),M([(0,s.wk)()],C.prototype,"_open",void 0),M([(0,s.wk)()],C.prototype,"_hasFooter",void 0),M([(0,s.wk)()],C.prototype,"_r",void 0),M([(0,s.wk)()],C.prototype,"_compact",void 0),M([(0,s.wk)()],C.prototype,"_rtl",void 0),function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<5&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}([["mc-ui-window",C],["mc-ui-menu",y],["mc-ui-popover",_]]);var A=i(6752),z=i(7804);const{I:q}=A.ge,E=e=>void 0===e.strings,H={},L=(0,z.u$)(class extends z.WL{constructor(e){if(super(e),e.type!==z.OA.PROPERTY&&e.type!==z.OA.ATTRIBUTE&&e.type!==z.OA.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!E(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===A.c0||t===A.s6)return t;const i=e.element,n=e.name;if(e.type===z.OA.PROPERTY){if(t===i[n])return A.c0}else if(e.type===z.OA.BOOLEAN_ATTRIBUTE){if(!!t===i.hasAttribute(n))return A.c0}else if(e.type===z.OA.ATTRIBUTE&&i.getAttribute(n)===t+"")return A.c0;return((e,t=H)=>{e._$AH=t})(e),t}}),V=Symbol.for(""),O=e=>{if(e?.r===V)return e?._$litStatic$},P=new Map,R=e=>(t,...i)=>{const n=i.length;let s,r;const a=[],o=[];let l,c=0,d=!1;for(;c<n;){for(l=t[c];c<n&&void 0!==(r=i[c],s=O(r));)l+=s+t[++c],d=!0;c!==n&&o.push(r),a.push(l),c++}if(c===n&&a.push(t[n]),d){const e=a.join("$$lit$$");void 0===(t=P.get(e))&&(a.raw=a,P.set(e,t=a)),i=o}return e(t,...i)},D=R(A.qy);R(A.JW),R(A.ej);var N=i(4753),T=i(201);const F=e=>e.channels.includes("glow")||e.channels.includes("fx")||!!e.colour,I=[{id:"linear",label:287,css:"linear"},{id:"ease",label:172,css:"ease"},{id:"ease-in",label:173,css:"ease-in"},{id:"ease-out",label:175,css:"ease-out"},{id:"ease-in-out",label:174,css:"ease-in-out"},{id:"spring",label:450,css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:434,css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:435,css:"cubic-bezier(0.7, 0, 0.3, 1)"}],B=(e,t=1080)=>({label:e,unit:"deg",min:0,max:t}),Z=(e,t=100)=>({label:e,unit:"%",min:0,max:t}),K=(e,t=60)=>({label:e,unit:"px",min:0,max:t}),W=(e=350,t=12)=>({label:e,unit:"",min:1,max:t}),U=W();function G(e,t,i){const{direction:n="normal",iterations:s="infinite",...r}=i.extra||{};return{id:e,name:t,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:s,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...r}}const Y={iconKeyframes:!0},J=[G("breathe",94,{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[Z(408,50),4]}),G("glow-pulse",222,{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[K(223),16],extra:Y}),G("halo-ripple",233,{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[K(391),14],extra:Y}),G("aura",34,{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[K(223),24],extra:Y}),G("heartbeat",235,{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[Z(408,50),12]}),G("spin",446,{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[B(398),360]}),G("fast-spin",187,{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[B(398),360]}),G("sway",472,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[B(21,90),6]}),G("wobble",557,{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[K(154),6]}),G("shake-alert",418,{group:"Motion",channels:["translate"],duration:2,intensity:[K(154),4]}),G("rumble",406,{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[K(154,10),1]}),G("float",206,{group:"Motion",channels:["translate"],duration:3,intensity:[K(154),6]}),G("flame-flicker",194,{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[Z(203,30),5],extra:{origin:"50% 100%",colour:!0}}),G("steam-rise",461,{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[U,4],extra:{particles:"count"}}),G("bubbles",97,{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[U,6],extra:{particles:"count"}}),G("snow-fall",437,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[U,6],extra:{particles:"count"}}),G("rain-fall",375,{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[U,6],extra:{particles:"count"}}),G("liquid-wave",288,{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[Z(188),40],extra:{particles:2}}),G("storm-flash",463,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[Z(96),75],extra:{particles:1,front:!0}}),G("shine-sweep",423,{group:"Light & colour",channels:["fx"],duration:3,intensity:[Z(422),45],extra:{particles:1,front:!0}}),G("bounce",88,{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[K(237),10],extra:{origin:"50% 100%"}}),G("jello",264,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[Z(452,50),12]}),G("rubber-band",405,{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[Z(466,50),25]}),G("tada",502,{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[B(21,45),3]}),G("swing",473,{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[B(21,90),15],extra:{origin:"50% 0"}}),G("flip",205,{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[B(398),360]}),G("pop",360,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[Z(408,50),18]}),G("head-shake",234,{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[K(154,30),6]}),G("blink",65,{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[Z(139),85]}),G("neon-flicker",315,{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[K(223,30),8],extra:{colour:!0}}),G("rainbow-hue",376,{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[B(241,720),360]}),G("glitch",219,{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[K(327,20),3],extra:{colour:!0}}),G("fade-pulse",184,{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[Z(183),60]}),G("ping",353,{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[Z(391,200),90],extra:{particles:1}}),G("ripple-rings",395,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[W(392,6),3],extra:{particles:"count"}}),G("radar-sweep",372,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[B(62,180),70],extra:{particles:1}}),G("conic-border-spin",122,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[K(82,12),2],extra:{particles:1}}),G("breathing-border",95,{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[K(82,12),2],extra:Y}),G("fireflies",191,{group:"Scenes",channels:["fx"],duration:6,intensity:[U,8],extra:{particles:"count"}}),G("confetti",121,{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[U,10],extra:{particles:"count"}}),G("falling-leaves",186,{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[U,5],extra:{particles:"count"}}),G("lightning",283,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[Z(96),90],extra:{particles:1,front:!0}}),G("ocean-waves",326,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[Z(548),35],extra:{particles:3}}),G("sun-rays",470,{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[B(379,30),6],extra:{particles:1}}),G("heat-shimmer",236,{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[K(465,10),2]}),G("wind-lines",554,{group:"Scenes",channels:["fx"],duration:2.2,intensity:[U,5],extra:{particles:"count"}}),G("drip",164,{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[U,3],extra:{particles:"count"}}),G("equalizer-bars",181,{group:"Scenes",channels:["fx"],duration:.9,intensity:[W(60),5],extra:{particles:"count",direction:"alternate"}}),G("charging-stripes",104,{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[Z(467),100],extra:{particles:1}}),G("orbit-dots",332,{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[W(156,8),3],extra:{particles:"count"}}),G("typing-dots",530,{group:"Scenes",channels:["fx"],duration:1.2,intensity:[K(88,20),4],extra:{particles:3}}),G("pendulum",352,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[B(21,90),20],extra:{origin:"50% 0",direction:"alternate"}}),G("orbit",331,{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[K(373,40),6]}),G("coin-spin",113,{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[B(398),360]}),G("rotate-3d",3,{group:"Motion",channels:["rotate"],duration:3,intensity:[B(516,180),25],extra:{direction:"alternate"}}),G("squash-stretch",453,{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[Z(452,50),14],extra:{origin:"50% 100%"}}),G("wiggle",553,{group:"Motion",channels:["rotate"],duration:2.5,intensity:[B(21,45),8]}),G("shadow-lift",416,{group:"Motion",channels:["translate","glow"],duration:3,intensity:[K(279,20),4],extra:Y}),G("holographic-shimmer",239,{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[Z(465),35],extra:{particles:1,front:!0}}),G("scanline",409,{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[Z(96),50],extra:{particles:1,front:!0}}),G("twinkle",529,{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[U,6],extra:{particles:"count",front:!0}}),G("spotlight",449,{group:"Light & colour",channels:["fx"],duration:7,intensity:[Z(96),45],extra:{particles:1}}),G("border-snake",78,{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[K(552,12),3],extra:{ring:"snake"}}),G("neon-border",314,{group:"Borders",channels:["glow"],duration:2.4,intensity:[K(223,30),10],extra:Y}),G("power-flow",364,{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[K(155,12),5],extra:{ring:"dots"}}),G("marching-ants",299,{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[K(552,12),2],extra:{ring:"dashes"}}),G("aurora",35,{group:"Backgrounds",channels:["fx"],duration:12,intensity:[Z(220),55],extra:{particles:3}}),G("lava-lamp",274,{group:"Backgrounds",channels:["fx"],duration:9,intensity:[U,5],extra:{particles:"count",direction:"alternate"}}),G("plasma-gradient",354,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[Z(465),70],extra:{particles:1}}),G("gradient-flow",226,{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[Z(465),60],extra:{particles:1,direction:"alternate"}}),G("color-cycle-bg",116,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[Z(465),35],extra:{particles:1}}),G("starfield",455,{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[U,12],extra:{particles:"count"}}),G("meteor-shower",305,{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[U,4],extra:{particles:"count"}}),G("bokeh",68,{group:"Backgrounds",channels:["fx"],duration:8,intensity:[U,7],extra:{particles:"count",direction:"alternate"}}),G("matrix-rain",302,{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[W(464),10],extra:{particles:"count"}}),G("smoke",433,{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[U,5],extra:{particles:"count"}}),G("clouds-drift",111,{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[W(110,6),3],extra:{particles:"count"}}),G("water-ripple",546,{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[W(396,8),3],extra:{particles:"count"}}),G("fireworks",192,{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[W(445),10],extra:{particles:"count"}}),...[["winter",556,"winter"],["spring",450,"spring"],["summer",469,"summer"],["autumn",40,"autumn"],["christmas",105,"christmas"],["new_year",316,"new_year"],["valentine",536,"valentine"],["easter",176,"easter"],["halloween",232,"halloween"],["weather",294,"weather"],["daynight",132,"daynight"],["snow",438,"snow"],["rain",377,"rain"],["storm",514,"storm"],["sun",471,"sun"],["clouds",112,"clouds"],["fog",208,"fog"],["wind",555,"wind"],["night",318,"night"],["dusk",171,"dusk"]].map(([e,t,i])=>G(e,t,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[Z(137),50],extra:{seasonal:i}})),G("tap-ripple",503,{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[Z(96),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),G("press",368,{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[Z(138,30),6],extra:{trigger:"tap",iterations:1}})],X=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(e=>J.some(t=>t.group===e)),Q={"Glow & pulse":221,Motion:308,Playful:356,"Light & colour":281,"Rings & sweeps":393,Borders:84,"Weather & device":550,Scenes:410,Backgrounds:51,Seasonal:412,Interaction:260},ee=new Map(J.map(e=>[e.id,e])),te=e=>e?ee.get(e):void 0,ie={breathe:"0%,100%{scale:1;opacity:1}50%{scale:calc(1 + $i / 100);opacity:.78}","glow-pulse":"0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 calc($i * 1px) calc($i * .19px) $c}","glow-pulse-icon":"0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 calc($i * .375px) $c)}","halo-ripple":"0%{box-shadow:0 0 0 0 $c}100%{box-shadow:0 0 0 calc($i * 1px) transparent}","halo-ripple-icon":"0%{filter:drop-shadow(0 0 0 $c)}100%{filter:drop-shadow(0 0 calc($i * .7px) transparent)}",aura:"0%,100%{box-shadow:0 0 calc($i * .42px) calc($i * .04px) color-mix(in srgb,$c 60%,transparent),inset 0 0 calc($i * .42px) color-mix(in srgb,$c 24%,transparent)}50%{box-shadow:0 0 calc($i * 1px) calc($i * .25px) $c,inset 0 0 calc($i * .75px) color-mix(in srgb,$c 48%,transparent)}","aura-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .125px) color-mix(in srgb,$c 50%,transparent))}50%{filter:drop-shadow(0 0 calc($i * .42px) $c)}",heartbeat:"0%,70%,100%{scale:1}14%{scale:calc(1 + $i / 100)}28%{scale:1}42%{scale:calc(1 + $i / 150)}",spin:"from{rotate:0deg}to{rotate:calc($i * 1deg)}","fast-spin":"from{rotate:0deg}to{rotate:calc($i * 1deg)}",sway:"0%,100%{rotate:calc($i * -1deg)}50%{rotate:calc($i * 1deg)}",wobble:"0%,100%{translate:0 0;rotate:0deg}15%{translate:calc($i * -1px) 0;rotate:calc($i * -.66deg)}30%{translate:calc($i * .83px) 0;rotate:calc($i * .5deg)}45%{translate:calc($i * -.66px) 0;rotate:calc($i * -.33deg)}60%{translate:calc($i * .33px) 0;rotate:calc($i * .17deg)}75%{translate:calc($i * -.17px) 0;rotate:calc($i * -.08deg)}","shake-alert":"0%,50%,100%{translate:0 0}5%,15%,25%,35%,45%{translate:calc($i * -1px) 0}10%,20%,30%,40%{translate:calc($i * 1px) 0}",rumble:"0%,100%{translate:0 0}25%{translate:calc($i * 1px) calc($i * -1px)}50%{translate:calc($i * -1px) calc($i * 1px)}75%{translate:calc($i * 1px) calc($i * 1px)}",float:"0%,100%{translate:0 0}50%{translate:0 calc($i * -1px)}","flame-flicker":"0%,100%{scale:1 1;rotate:0deg;filter:drop-shadow(0 0 2px $c) brightness(1)}25%{scale:calc(1 - $i * .004) calc(1 + $i / 100);rotate:calc($i * .3deg);filter:drop-shadow(0 -1px 6px $c) brightness(1.15)}50%{scale:calc(1 + $i * .004) calc(1 - $i * .006);rotate:calc($i * -.2deg);filter:drop-shadow(0 0 3px $c) brightness(.95)}75%{scale:calc(1 - $i * .002) calc(1 + $i * .008);rotate:calc($i * -.4deg);filter:drop-shadow(0 -1px 5px $c) brightness(1.1)}","steam-rise":"0%{translate:0 0;scale:.5;opacity:0}25%{opacity:1}100%{translate:0 -100cqh;scale:1.7;opacity:0}",bubbles:"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:4px -55cqh}90%{opacity:.8}100%{translate:-3px calc(-100cqh - 12px);opacity:0}","snow-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:6px 50cqh}100%{translate:-2px calc(100cqh + 12px);opacity:.7}","rain-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 24px);opacity:.6}","liquid-wave":"from{rotate:0deg}to{rotate:360deg}","storm-flash":"0%,88%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.1}93.5%{opacity:calc($i / 125)}96%{opacity:0}","shine-sweep":"0%{translate:-100% 0}60%,100%{translate:100cqw 0}",blink:"0%,45%,100%{opacity:1}50%,95%{opacity:calc(1 - $i / 100)}","neon-flicker":"0%,17%,23%,26%,52%,58%,100%{opacity:1;filter:drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1)}20%,25%,55%{opacity:.45;filter:drop-shadow(0 0 0 transparent) brightness(.8)}24%{opacity:.8;filter:drop-shadow(0 0 calc($i * .4px) $c) brightness(1)}","rainbow-hue":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(calc($i * 1deg))}",glitch:"0%,86%,100%{translate:0 0;filter:none}88%{translate:calc($i * -1px) 0;filter:drop-shadow(calc($i * .7px) 0 0 $c) drop-shadow(calc($i * -.7px) 0 0 color-mix(in srgb,$c 35%,#00e5ff))}90%{translate:calc($i * 1px) calc($i * .3px);filter:drop-shadow(calc($i * -.7px) 0 0 $c) hue-rotate(40deg)}92%{translate:calc($i * -.5px) 0;filter:drop-shadow(calc($i * .4px) 0 0 color-mix(in srgb,$c 35%,#ff1744))}94%{translate:0 0;filter:none}","fade-pulse":"0%,100%{opacity:1}50%{opacity:calc(1 - $i / 100)}",bounce:"0%,20%,53%,100%{translate:0 0;scale:1 1}40%,43%{translate:0 calc($i * -1px);scale:.96 1.06}70%{translate:0 calc($i * -.5px);scale:.98 1.03}80%{translate:0 0;scale:1.04 .96}90%{translate:0 calc($i * -.12px);scale:1 1}",jello:"0%,10%,60%,100%{scale:1 1}18%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}26%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}34%{scale:calc(1 + $i / 200) calc(1 - $i / 200)}42%{scale:calc(1 - $i / 400) calc(1 + $i / 400)}50%{scale:calc(1 + $i / 800) calc(1 - $i / 800)}","rubber-band":"0%,55%,100%{scale:1 1}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}20%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}25%{scale:calc(1 + $i / 160) calc(1 - $i / 160)}33%{scale:calc(1 - $i / 500) calc(1 + $i / 500)}42%{scale:calc(1 + $i / 500) calc(1 - $i / 500)}",tada:"0%,50%,100%{scale:1;rotate:0deg}5%,10%{scale:.9;rotate:calc($i * -1deg)}15%,25%,35%,45%{scale:1.1;rotate:calc($i * 1deg)}20%,30%,40%{scale:1.1;rotate:calc($i * -1deg)}",swing:"0%,60%,100%{rotate:0deg}12%{rotate:calc($i * 1deg)}24%{rotate:calc($i * -.66deg)}36%{rotate:calc($i * .33deg)}48%{rotate:calc($i * -.2deg)}",flip:"0%,10%{rotate:y 0deg}60%,100%{rotate:y calc($i * 1deg)}",pop:"0%,40%,100%{scale:1}10%{scale:calc(1 + $i / 100)}20%{scale:calc(1 - $i / 400)}30%{scale:calc(1 + $i / 600)}","head-shake":"0%,50%,100%{translate:0 0;rotate:0deg}6.5%{translate:calc($i * -1px) 0;rotate:calc($i * -1deg)}18.5%{translate:calc($i * .8px) 0;rotate:calc($i * .8deg)}31.5%{translate:calc($i * -.5px) 0;rotate:calc($i * -.5deg)}43.5%{translate:calc($i * .3px) 0;rotate:calc($i * .3deg)}"},ne="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",se={ping:"0%{scale:.15;opacity:1}80%,100%{scale:1;opacity:0}","ripple-rings":"0%{scale:.1;opacity:1}100%{scale:1;opacity:0}","radar-sweep":"from{rotate:0deg}to{rotate:360deg}","conic-border-spin":"from{rotate:0deg}to{rotate:360deg}","breathing-border":"0%,100%{box-shadow:inset 0 0 0 calc($i * 1px) color-mix(in srgb,$c 30%,transparent),0 0 0 0 transparent}50%{box-shadow:inset 0 0 0 calc($i * 1px) $c,0 0 calc($i * 4px) color-mix(in srgb,$c 35%,transparent)}","breathing-border-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .5px) color-mix(in srgb,$c 40%,transparent))}50%{filter:drop-shadow(0 0 calc($i * 1.5px) $c)}",fireflies:"0%{translate:0 0;opacity:0}20%{opacity:1}40%{translate:10px -8px}60%{opacity:.3}75%{translate:-6px -14px;opacity:1}100%{translate:4px -22px;opacity:0}",confetti:"0%{translate:0 0;rotate:0deg;opacity:1}25%{translate:8px 25cqh;rotate:160deg}50%{translate:-6px 50cqh;rotate:300deg}75%{translate:6px 75cqh;rotate:420deg}100%{translate:0 calc(100cqh + 14px);rotate:540deg;opacity:1}","falling-leaves":"0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:1}30%{translate:14px 30cqh;rotate:60deg}55%{translate:-8px 55cqh;rotate:-20deg}80%{translate:12px 80cqh;rotate:80deg}100%{translate:0 calc(100cqh + 16px);rotate:20deg;opacity:.8}",lightning:"0%,89%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.15}93%{opacity:calc($i / 100)}96%{opacity:0}","ocean-waves":"from{translate:0 0}to{translate:-40px 0}","sun-rays":"from{rotate:0deg}to{rotate:360deg}","heat-shimmer":"0%,100%{translate:0 0;filter:blur(0)}25%{translate:calc($i * .5px) calc($i * -.5px);filter:blur(calc($i * .3px))}50%{translate:calc($i * -.5px) 0;filter:blur(0)}75%{translate:0 calc($i * .5px);filter:blur(calc($i * .2px))}","wind-lines":"0%{translate:0 0;opacity:0}15%{opacity:1}85%{opacity:.8}100%{translate:calc(100cqw + 100%) 0;opacity:0}",drip:"0%{translate:0 0;scale:.4 .2;opacity:0}15%{scale:1 1;opacity:1}35%{translate:0 2px;scale:.9 1.25}45%{translate:0 4px;scale:1 1}100%{translate:0 calc(100cqh + 12px);scale:.9 1.3;opacity:.7}","equalizer-bars":"0%{scale:1 .15}30%{scale:1 .8}60%{scale:1 .35}100%{scale:1 1}","charging-stripes":"from{translate:0 0}to{translate:28.2843px 0}","orbit-dots":"from{rotate:0deg}to{rotate:360deg}","typing-dots":"0%,60%,100%{translate:0 0;opacity:.35}30%{translate:0 calc($i * -1px);opacity:1}"},re={ping:"left:50%;top:50%;width:calc($i * 1cqmin);aspect-ratio:1;translate:-50% -50%;border:2px solid $c;border-radius:50%;box-sizing:border-box;","ripple-rings":` left:50%;top:50%;width:110cqmin;aspect-ratio:1;translate:-50% -50%;border:1.5px solid $c;border-radius:50%;box-sizing:border-box;${ne}`,"radar-sweep":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:1;background:conic-gradient(from 0deg,transparent 0deg calc(360deg - $i * 1deg),$c 360deg);","conic-border-spin":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:conic-gradient(from 0deg,transparent 0% 55%,$c 80%,transparent 100%);",fireflies:"top:calc(12% + var(--mc-anim-phase) * 72%);width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 2px $c;",confetti:"top:-10px;width:6px;height:10px;border-radius:1px;background:$c;","confetti|:nth-child(3n + 2)":"background:color-mix(in srgb,$c 40%,#ffeb3b);","confetti|:nth-child(3n)":"width:8px;height:6px;background:color-mix(in srgb,$c 40%,#e91e63);","falling-leaves":"top:-14px;width:10px;height:10px;border-radius:0 80% 0 80%;background:$c;","falling-leaves|:nth-child(even)":"background:color-mix(in srgb,$c 75%,#7cb342);",lightning:"left:50%;top:0;width:32cqmin;height:100%;translate:-50% 0;background:color-mix(in srgb,$c 40%,#fff);clip-path:polygon(58% 0,22% 56%,46% 56%,32% 100%,80% 40%,56% 40%,72% 0);","ocean-waves":"left:0;bottom:0;width:calc(100% + 40px);height:calc($i * 1%);opacity:1;background:radial-gradient(22px 12px at 20px 0,transparent 98%,color-mix(in srgb,$c 45%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"height:calc($i * .75%);animation-direction:reverse;animation-duration:calc(var(--mc-fx-dur) * 1.5);background:radial-gradient(22px 10px at 20px 0,transparent 98%,color-mix(in srgb,$c 70%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"height:calc($i * .5%);animation-duration:calc(var(--mc-fx-dur) * .7);background:radial-gradient(22px 8px at 20px 0,transparent 98%,$c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"left:50%;top:50%;width:170cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:repeating-conic-gradient(from 0deg,$c 0deg calc($i * 1deg),transparent calc($i * 1deg) calc($i * 3deg));mask:radial-gradient(closest-side,#000 15%,transparent 70%);","wind-lines":"left:-35%;top:calc(10% + var(--mc-anim-phase) * 80%);width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,$c);",drip:"top:-4px;width:6px;height:9px;margin-left:-3px;transform-origin:50% 0;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;background:$c;","equalizer-bars":"left:calc(10% + var(--mc-anim-k) * 80%);bottom:0;width:max(3px,5%);height:70%;opacity:1;border-radius:2px 2px 0 0;transform-origin:50% 100%;background:$c;","charging-stripes":"top:0;bottom:0;left:-28.2843px;width:calc(100% + 28.2843px);opacity:1;background:repeating-linear-gradient(-45deg,color-mix(in srgb,$c calc($i * 1%),transparent) 0 10px,transparent 10px 20px);","orbit-dots":` left:50%;top:calc(50% - 38cqmin);width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;opacity:1;background:$c;transform-origin:3px calc(3px + 38cqmin);${ne}`,"typing-dots":"left:calc(50% - 12px + var(--mc-anim-k) * 36px);top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:$c;animation-delay:calc(var(--mc-fx-delay,0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur,1s) * .5);"},ae={pendulum:"from{rotate:calc($i * -1deg)}to{rotate:calc($i * 1deg)}",orbit:"0%,100%{translate:calc($i * 1px) 0}12.5%{translate:calc($i * .707px) calc($i * .707px)}25%{translate:0 calc($i * 1px)}37.5%{translate:calc($i * -.707px) calc($i * .707px)}50%{translate:calc($i * -1px) 0}62.5%{translate:calc($i * -.707px) calc($i * -.707px)}75%{translate:0 calc($i * -1px)}87.5%{translate:calc($i * .707px) calc($i * -.707px)}","coin-spin":"from{rotate:y 0deg}to{rotate:y calc($i * 1deg)}","rotate-3d":"from{rotate:1 1 0 calc($i * -1deg)}to{rotate:1 1 0 calc($i * 1deg)}","squash-stretch":"0%,100%{scale:1 1;translate:0 0}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100);translate:0 0}45%{scale:calc(1 - $i / 200) calc(1 + $i / 150);translate:0 calc($i * -.8px)}70%{scale:1 1;translate:0 calc($i * -.4px)}85%{scale:calc(1 + $i / 160) calc(1 - $i / 160);translate:0 0}",wiggle:"0%,40%,100%{rotate:0deg}5%{rotate:calc($i * 1deg)}10%{rotate:calc($i * -1deg)}15%{rotate:calc($i * .8deg)}20%{rotate:calc($i * -.6deg)}25%{rotate:calc($i * .4deg)}30%{rotate:calc($i * -.2deg)}","shadow-lift":"0%,100%{translate:0 0;box-shadow:0 1px 2px color-mix(in srgb,$c 20%,rgba(0,0,0,.2))}50%{translate:0 calc($i * -1px);box-shadow:0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3))}","shadow-lift-icon":"0%,100%{translate:0 0;filter:drop-shadow(0 1px 1px color-mix(in srgb,$c 20%,rgba(0,0,0,.2)))}50%{translate:0 calc($i * -1px);filter:drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3)))}","holographic-shimmer":"from{translate:0 0;filter:hue-rotate(0deg)}to{translate:-50% 0;filter:hue-rotate(360deg)}",scanline:"from{translate:0 -100%}to{translate:0 100cqh}",twinkle:"0%,100%{scale:0;rotate:0deg;opacity:0}50%{scale:1;rotate:90deg;opacity:1}",spotlight:"0%,100%{translate:-30cqw -10cqh}33%{translate:25cqw 15cqh}66%{translate:10cqw -20cqh}","neon-border":"0%,100%{box-shadow:0 0 0 1px $c,0 0 calc($i * .6px) color-mix(in srgb,$c 70%,transparent),inset 0 0 calc($i * .5px) color-mix(in srgb,$c 45%,transparent)}50%{box-shadow:0 0 0 1.5px $c,0 0 calc($i * 1.4px) $c,inset 0 0 calc($i * .9px) color-mix(in srgb,$c 60%,transparent)}","neon-border-icon":"0%,100%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .3px) color-mix(in srgb,$c 70%,transparent))}50%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .7px) $c)}","color-cycle-bg":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}",aurora:"0%,100%{translate:-12% 0;rotate:-8deg;scale:1 1;opacity:calc($i / 100)}50%{translate:12% 6%;rotate:6deg;scale:1.15 .85;opacity:calc($i / 160)}","lava-lamp":"0%{translate:0 0;scale:1 1;opacity:.9}50%{translate:6px -45cqh;scale:1.25 .85}100%{translate:-4px -85cqh;scale:.85 1.15;opacity:.9}","plasma-gradient":"0%{rotate:0deg;scale:1}50%{rotate:180deg;scale:1.25}100%{rotate:360deg;scale:1}","gradient-flow":"from{translate:0 0}to{translate:-66.667% 0}",starfield:"0%,100%{opacity:.15;scale:.6}50%{opacity:1;scale:1}","meteor-shower":"0%{translate:0 0;opacity:0}6%{opacity:1}40%,100%{translate:-60cqw 60cqh;opacity:0}",bokeh:"0%{translate:0 0;scale:.8;opacity:.15}50%{opacity:.55}100%{translate:10px -16px;scale:1.15;opacity:.25}","matrix-rain":"0%{translate:0 -100%;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 100%);opacity:.6}",smoke:"0%{translate:0 0;scale:.4;opacity:0}20%{opacity:.5}100%{translate:18px -90cqh;scale:2.6;opacity:0}","clouds-drift":"from{translate:0 0;opacity:.9}to{translate:calc(100cqw + 100%) 0;opacity:.9}","water-ripple":"0%{scale:.05;opacity:.9}100%{scale:1;opacity:0}",fireworks:"0%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1);opacity:1}70%{opacity:1}100%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(.3);opacity:0}","tap-ripple":"0%{scale:0;opacity:calc($i / 100)}100%{scale:1;opacity:0}",press:"0%,100%{scale:1}40%{scale:calc(1 - $i / 100)}"};function oe(e,t){const i=ie[e]??se[e]??ae[e];if(void 0===i)return;const n=te(e.replace(/-icon$/,"")),s=t??n?.defaults.intensity??1;return i.replace(/\$i/g,String(s)).replace(/\$c/g,"var(--mc-anim-c)")}function le(e){const t=[];for(const i of e.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const e=i[1].split(",").map(e=>e.trim().toLowerCase()).map(e=>"from"===e?0:"to"===e?100:parseFloat(e)).filter(e=>Number.isFinite(e)),n=[];for(const e of i[2].split(";")){const t=e.indexOf(":");if(t<0)continue;const i=e.slice(0,t).trim().toLowerCase(),s=e.slice(t+1).trim().replace(/\s+/g," ");i&&s&&n.push([i,s])}e.length&&n.length&&t.push({offsets:e,decls:n})}return t}const ce=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());var de=i(1771);const pe=e=>{if(e&&"object"==typeof e){for(const t of Object.values(e))pe(t);Object.freeze(e)}return e},he=pe(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),ue=pe(["matrix","translate","scale","rotate","skewx","skewy"]),me=pe({maxStyleAttrChars:2e3,maxStyleBlocks:16,maxCssChars:32768,maxRules:512,maxDeclarations:64,maxSelectors:32,maxClassTokens:32,maxBracketDepth:8,maxPaintChars:200,maxValueChars:64,maxDashValues:32,maxColourFunctionDepth:2,maxHrefHops:8,maxStopsPerGradient:256,maxStopClones:1024}),ge=(...e)=>({kind:"keyword",keywords:pe(e)}),fe=pe({fill:{kind:"paint"},stroke:{kind:"paint"},"stop-color":{kind:"stop-paint"},opacity:{kind:"alpha"},"fill-opacity":{kind:"alpha"},"stroke-opacity":{kind:"alpha"},"stop-opacity":{kind:"alpha"},"stroke-width":{kind:"width"},"stroke-miterlimit":{kind:"miterlimit"},"stroke-dashoffset":{kind:"offset"},"stroke-dasharray":{kind:"dasharray"},"stroke-linecap":ge("butt","round","square"),"stroke-linejoin":ge("miter","round","bevel","arcs","miter-clip"),"fill-rule":ge("nonzero","evenodd"),"clip-rule":ge("nonzero","evenodd"),"paint-order":{kind:"paint-order"},"vector-effect":ge("none","non-scaling-stroke")}),ve=pe({name:"icon",elements:pe(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),kinds:pe(Object.fromEntries(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"].map(e=>{return[e,(t=e,"transform"===t||"gradientTransform"===t?"transform":"id"===t?"id":"class"===t?"class":"value")];var t}))),colourFunctions:he,transformFunctions:ue,paintVar:!1,maxValueChars:32768,denyExtra:pe([]),limits:pe({maxNodes:32768,maxDepth:64}),css:pe({properties:fe,limits:me,maxWrittenBytes:32768})});var be=i(3910);const ye=e=>String(+e.toFixed(3)),xe=e=>{if(null==e||/%/.test(e))return;const t=parseFloat(e);return Number.isFinite(t)?t:void 0},_e=[1,0,0,1,0,0],$e=(e,t)=>[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]];function we(e){let t=_e;if(!e)return t;for(const[,i,n]of e.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const e=n.split(/[\s,]+/).filter(Boolean).map(Number);if(e.some(e=>!Number.isFinite(e)))continue;let s=_e;switch(i){case"matrix":6===e.length&&(s=e);break;case"translate":s=[1,0,0,1,e[0]??0,e[1]??0];break;case"scale":s=[e[0]??1,0,0,e[1]??e[0]??1,0,0];break;case"rotate":{const t=(e[0]??0)*Math.PI/180,[i,n]=[e[1]??0,e[2]??0],r=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];s=$e($e([1,0,0,1,i,n],r),[1,0,0,1,-i,-n]);break}case"skewX":s=[1,0,Math.tan((e[0]??0)*Math.PI/180),1,0,0];break;case"skewY":s=[1,Math.tan((e[0]??0)*Math.PI/180),0,1,0,0]}t=$e(t,s)}return t}function ke(e,t){const i=t=>xe(e.getAttribute(t));switch(t){case"path":{const t=e.getAttribute("d")?.trim();return t||void 0}case"circle":case"ellipse":{const e=i("cx")??0,n=i("cy")??0,s="circle"===t?i("r"):i("rx")??i("ry"),r="circle"===t?s:i("ry")??i("rx");if(!s||!r||s<=0||r<=0)return;const a=`A${ye(s)} ${ye(r)} 0 1 0`;return`M${ye(e-s)} ${ye(n)}${a} ${ye(e+s)} ${ye(n)}${a} ${ye(e-s)} ${ye(n)}Z`}case"rect":{const e=i("x")??0,t=i("y")??0,n=i("width"),s=i("height");if(!n||!s||n<=0||s<=0)return;let r=i("rx")??i("ry")??0,a=i("ry")??i("rx")??0;if(r=Math.min(Math.max(r,0),n/2),a=Math.min(Math.max(a,0),s/2),!r||!a)return`M${ye(e)} ${ye(t)}H${ye(e+n)}V${ye(t+s)}H${ye(e)}Z`;const o=`A${ye(r)} ${ye(a)} 0 0 1`;return`M${ye(e+r)} ${ye(t)}H${ye(e+n-r)}${o} ${ye(e+n)} ${ye(t+a)}V${ye(t+s-a)}${o} ${ye(e+n-r)} ${ye(t+s)}H${ye(e+r)}${o} ${ye(e)} ${ye(t+s-a)}V${ye(t+a)}${o} ${ye(e+r)} ${ye(t)}Z`}case"line":return`M${ye(i("x1")??0)} ${ye(i("y1")??0)}L${ye(i("x2")??0)} ${ye(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(e){const t=(e??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let e=0;e+1<t.length;e+=2)Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&i.push([t[e],t[e+1]]);return i}(e.getAttribute("points"));if(i.length<2)return;return`M${i.map(([e,t])=>`${ye(e)} ${ye(t)}`).join("L")}${"polygon"===t?"Z":""}`}}}const Me=32768,Se="0 0 24 24",je=e=>new Map(e.map(e=>[e.toLowerCase(),e])),Ce=je(ve.elements),Ae=je(Object.keys(ve.kinds)),ze=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),qe=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]);function Ee(e,t){const i=(0,be.I)(ve,e);return i?(0,be.M7)(i,t,ve):void 0}const He=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),Le=e=>"mc-accent"!==e&&(He.has(e)||/^(mc-|dev-|xfade-)/.test(e))?`u-${e}`:e,Ve="The SVG is too complex.",Oe=e=>({markup:"",viewBox:Se,paths:[],accentPaths:[],strokes:[],error:e}),Pe={fill:!0,stroke:!1,width:1},Re=/^(none|transparent)$/i;function De(e,t){const i=t=>{const i=e.getAttribute(t);return null===i?void 0:Ee(t,i)?.trim()},n=i("fill"),s=i("stroke"),r=xe(i("stroke-width")),a=i("stroke-linecap"),o=i("stroke-linejoin"),l=i("fill-rule");return{evenodd:void 0===l?t.evenodd:"evenodd"===l,fill:void 0===n?t.fill:!Re.test(n),stroke:void 0===s?t.stroke:!Re.test(s),width:void 0!==r&&r>=0?r:t.width,cap:a&&/^(butt|round|square)$/.test(a)?a:t.cap,join:o&&/^(miter|round|bevel|arcs|miter-clip)$/.test(o)?o:t.join}}function Ne(e,t={}){const i="string"==typeof e?e:"";if((0,be.dp)(i)>Me)return Oe("The SVG is larger than 32 KB.");const n=function(e){if("undefined"==typeof DOMParser)return;const t=new DOMParser;try{const i=t.parseFromString(e,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return{root:n,via:"xml",doc:i}}catch{}try{const i=t.parseFromString(e,"text/html"),n=i.getElementsByTagName("*");for(let e=0;e<n.length;e++)if("svg"===n[e].localName.toLowerCase())return{root:n[e],via:"html",doc:i}}catch{}}(i)?.root;if(!n)return Oe("No <svg> element found.");const s=function(e){const t=(e.getAttribute("viewBox")??e.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0)return t.map(ye).join(" ");const i=xe(e.getAttribute("width")),n=xe(e.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${ye(i)} ${ye(n)}`:Se}(n);if(t.css)try{if("ok"!==t.css(n,ve).status)return Oe(Ve)}catch{return Oe(Ve)}const r=[],a=[],o=[],l={},c=(e,t,i=[])=>{let n="",s="";for(const i of[...e.attributes]){const e=Ae.get(i.name.toLowerCase());if(!e||i.name.includes(":"))continue;if(t&&("viewBox"===e||"width"===e||"height"===e))continue;const r=Ee(e,i.value);void 0!==r&&("class"===e?s=r.split(" ").map(Le).join(" "):n+=` ${e}="${(0,be.dc)(r)}"`)}const r=[s,...i].filter(Boolean).join(" ");return r?` class="${(0,be.dc)(r)}"${n}`:n};let d=!1;const p=(e,t,i,n,s,h)=>{if(h>64||d)return d=!0,"";const u=Ce.get(e.localName.toLowerCase());if(!u||"svg"===u)return"";if("title"===u)return`<title>${(0,be.X1)(e.textContent??"")}</title>`;const m=$e(t,we(Ee("transform",e.getAttribute("transform")??"")??null)),g=n||(e.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),f=i&&!qe.has(u),v=De(e,s),b=[];if(f&&ze.has(u)){const t=ke(e,u);if(t){const e=function(e,t){if((e=>e.every((e,t)=>Math.abs(e-_e[t])<1e-9))(t))return e;const i=e=>[t[0]*e[0]+t[2]*e[1]+t[4],t[1]*e[0]+t[3]*e[1]+t[5]];return(0,de.ER)((0,de.Mj)(e).map(e=>e.map(e=>e.map(i))))}(t,m);if(v.fill&&"line"!==u){const t=g?a:r;v.evenodd&&(g?l.accent??=[]:l.paths??=[]).push(t.length),t.push(e),b.push("mc-f")}if(v.stroke&&v.width>0){const t=+(v.width*Math.sqrt(Math.abs(m[0]*m[3]-m[1]*m[2]))).toFixed(3);o.push({d:e,width:t,...v.cap?{cap:v.cap}:{},...v.join?{join:v.join}:{},...g?{accent:!0}:{}}),b.push("mc-s")}}}const y=[...e.children].map(e=>p(e,m,f,g,v,h+1)).join("");return`<${u}${c(e,!1,b)}>${y}</${u}>`},h=we(Ee("transform",n.getAttribute("transform")??"")??null),u=De(n,Pe),m=[...n.children].map(e=>p(e,h,!0,!1,u,1)).join("");return d?Oe(Ve):r.length||a.length||o.length?{markup:`<svg viewBox="${s}"${c(n,!0)}>${m}</svg>`,viewBox:s,paths:r,accentPaths:a,strokes:o,...l.paths||l.accent?{evenodd:l}:{}}:Oe("The SVG has no shapes to draw.")}const Te=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function Fe(e){const t=e=>Array.isArray(e)&&e.length>0,i=e.rig;return t(e.tracks)||t(e.clips)||t(e.bindings)||!!i&&"object"==typeof i&&(t(i.parts)||t(i.shapes))}const Ie={epoch:0,failedSims:new Set},Be="custom:",Ze=e=>"string"==typeof e&&e.startsWith(Be),Ke=e=>e.slice(7).trim(),We=["keyframes","particles","path","sequence"],Ue=["fall","rise","drift","burst","orbit","spiral"],Ge=60,Ye=12,Je=8192,Xe=/^[a-z0-9][a-z0-9_-]{0,63}$/,Qe={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"},et=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],tt={color:new Set(et),background:new Set([...et,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(et),filter:new Set([...et,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function it(e,t){if("string"!=typeof e)return;const i=e.trim();if(!i||i.length>600||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const e of i)if("("===e)n++;else if(")"===e&&--n<0)return;if(0!==n)return;const s=i.match(/\(/g)?.length??0,r=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return r.length!==s||r.some(e=>!tt[t].has(e[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(e=>!/^--[\w-]+$/.test(e[1]))?void 0:i}const nt=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,st=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,rt=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,at=["normal","reverse","alternate","alternate-reverse"];function ot(e){if("string"!=typeof e)return!1;const t=e.trim();return I.some(e=>e.id===t)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)}const lt=new Set(J.filter(e=>!e.channels.includes("fx")).map(e=>e.id)),ct=new Set(J.filter(e=>e.channels.includes("fx")).map(e=>e.id)),dt=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;class pt{constructor(){this.errors=[]}err(e,t){this.errors.push({path:e,message:t})}num(e,t,i,n,s,r,a=!1){const o=e[t];if(null==o||""===o)return void 0===r?void 0:r;const l="string"==typeof o?Number(o):o;return"number"==typeof l&&Number.isFinite(l)?a&&!Number.isInteger(l)?this.err(i,"Must be a whole number."):l<n||l>s?this.err(i,`Must be between ${n} and ${s}.`):l:this.err(i,"Must be a number.")}bool(e,t,i,n){const s=e[t];return null==s?n:"boolean"!=typeof s?this.err(i,"Must be true or false.")??n:s}oneOf(e,t,i,n,s){const r=e[t];return null==r||""===r?s:n.includes(r)?r:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(e,t,i,n){const s=e[t];if(null!=s&&""!==s)return it(s,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(e,t){return!e||"object"!=typeof e||Array.isArray(e)?this.err(t,"Must be an object."):e}list(e,t,i,n=0){return Array.isArray(e)?e.length<n?this.err(t,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):e.length>i?this.err(t,`At most ${i} entries.`):e:this.err(t,"Must be a list.")}}function ht(e,t,i,n=!1,s=!1){const r=e.obj(t,i);if(!r)return;const a=e.num(r,"at",`${i}.at`,0,100);void 0===r.at&&e.err(`${i}.at`,"Required.");const o={at:a??0};if(void 0!==r.transform){const t=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={},r=(t,r,a)=>{const o=e.num(n,t,`${i}.${t}`,r,a);void 0!==o&&(s[t]=o)};if(r("x",-1e4,1e4),r("y",-1e4,1e4),r("scale",0,100),r("scale_x",-100,100),r("scale_y",-100,100),r("rotate",-36e3,36e3),r("skew_x",-89,89),r("skew_y",-89,89),void 0!==n.axis){const t=n.axis;!Array.isArray(t)||3!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e))||t.every(e=>0===e)?e.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):s.axis=[t[0],t[1],t[2]]}return s}(e,r.transform,`${i}.transform`);t&&Object.keys(t).length&&(o.transform=t)}const l=e.num(r,"opacity",`${i}.opacity`,0,1);void 0!==l&&(o.opacity=l);const c=e.css(r,"color",`${i}.color`,"color");c&&(o.color=c);const d=e.css(r,"background",`${i}.background`,"background");d&&(o.background=d);const p=e.css(r,"shadow",`${i}.shadow`,"shadow");p&&(o.shadow=p);const h=e.css(r,"filter",`${i}.filter`,"filter");h&&(o.filter=h);const u=e.num(r,"blur",`${i}.blur`,0,200);void 0!==u&&(o.blur=u);const m=e.num(r,"radius",`${i}.radius`,0,1e3);void 0!==m&&(o.radius=m),void 0!==r.easing&&""!==r.easing&&(ot(r.easing)?o.easing=r.easing.trim():e.err(`${i}.easing`,"Not a valid easing."));const g=s?new pt:e,f=g.css(r,"stroke",`${i}.stroke`,"color");if(f&&(o.stroke=f),void 0!==r.draw&&null!==r.draw&&""!==r.draw)if(n){const e=g.num(r,"draw",`${i}.draw`,0,1);void 0!==e&&(o.draw=e)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==r.easings&&null!==r.easings){const e=g.obj(r.easings,`${i}.easings`),t={};for(const[n,s]of Object.entries(e??{}))Te.includes(n)?ot(s)?t[n]=s.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(t).length&&(o.easings=t)}return o}function ut(e,t,i,n){const s=e.num(t,"count",`${i}.count`,1,Ge,n.count,!0)??n.count;let r=[...n.size];if(void 0!==t.size){const n=t.size;"number"==typeof n&&n>0&&n<=200?r=[n,n]:Array.isArray(n)&&2===n.length&&n.every(e=>"number"==typeof e&&e>0&&e<=200)&&n[0]<=n[1]?r=[n[0],n[1]]:e.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const a=[];if(void 0!==t.colors){const n=e.list(t.colors,`${i}.colors`,Ye);n?.forEach((t,n)=>{const s=it(t,"color");s?a.push(s):e.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const o=void 0!==t.shape&&null!==t.shape?function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of icon, emoji or svg.");const r=s[0],a=n[r];if("string"!=typeof a)return e.err(`${i}.${r}`,"Must be text.");if("icon"===r)return rt.test(a.trim())?{icon:a.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===r){const t=a.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(dt(a)>Me)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(a))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(a);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:a}}(e,t.shape,`${i}.shape`):void 0;return{...o?{shape:o}:{},count:s,size:r,colors:a}}const mt=["rig","tracks","clips","bindings"];let gt;function ft(e,t={}){const i=new pt,n=i.obj(e,"");if(!n)return{ok:!1,errors:i.errors};let s;try{s=JSON.stringify(n)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(dt(s)>65536)return{ok:!1,errors:[{path:"",message:"The animation is larger than 64 KB."}]};const r="string"==typeof n.id?n.id.trim():"";Xe.test(r)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const a="string"==typeof n.name?n.name.trim():"";a?a.length>80&&i.err("name","At most 80 characters."):i.err("name","Required."),void 0!==n.version&&1!==n.version&&i.err("version","Unsupported version (expected 1).");const o=i.oneOf(n,"kind","kind",We);n.kind||i.err("kind","Required.");const l={id:r,name:a,kind:o??"keyframes",duration:i.num(n,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(n,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==n.easing&&""!==n.easing&&(ot(n.easing)?l.easing=n.easing.trim():i.err("easing","Not a valid easing.")),void 0!==n.iterations&&"infinite"!==n.iterations){const e=i.num(n,"iterations","iterations",.01,1e3);void 0!==e&&(l.iterations=e)}const c=i.oneOf(n,"direction","direction",at);switch(c&&"normal"!==c&&(l.direction=c),void 0!==n.origin&&""!==n.origin&&("string"==typeof n.origin&&nt.test(n.origin.trim())?l.origin=n.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),o){case"keyframes":{const e=Array.isArray(n.tracks)&&n.tracks.length>0,s=void 0===n.keyframes?e?[]:i.err("keyframes","Required."):i.list(n.keyframes,"keyframes",40,e?0:1),r="lenient"===t.v2,a=(s??[]).map((e,t)=>ht(i,e,`keyframes[${t}]`,!1,r)).filter(e=>!!e);l.keyframes=a.sort((e,t)=>e.at-t.at);break}case"particles":void 0===n.particles?i.err("particles","Required."):l.particles=function(e,t,i,n){const s=e.obj(t,i);if(!s)return;const r=Qe,a={...ut(e,s,i,r),direction:e.oneOf(s,"direction",`${i}.direction`,Ue,r.direction)??r.direction,speed:e.num(s,"speed",`${i}.speed`,.1,10,r.speed)??r.speed,spin:e.num(s,"spin",`${i}.spin`,-3600,3600,r.spin)??r.spin,fade:e.bool(s,"fade",`${i}.fade`,r.fade),spread:e.num(s,"spread",`${i}.spread`,0,100,r.spread)??r.spread,gravity:e.num(s,"gravity",`${i}.gravity`,-1,1,r.gravity)??r.gravity,layer:e.oneOf(s,"layer",`${i}.layer`,["back","front"],r.layer)??r.layer};if(void 0!==s.preset&&""!==s.preset){"string"==typeof s.preset&&ct.has(s.preset)?a.preset=s.preset:e.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const t=e.num(s,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==t&&(a.intensity=t)}if(void 0!==s.sim&&null!==s.sim&&(n?new pt:e).obj(s.sim,`${i}.sim`))if(Ie.simValidator){const t=Ie.simValidator(s.sim,n?"lenient":"strict",{count:a.count,layer:a.layer});n||e.errors.push(...t.errors),!t.sim||!n&&t.errors.length||(a.sim=t.sim)}else a.sim=s.sim;return a}(i,n.particles,"particles","lenient"===t.v2);break;case"path":void 0===n.path?i.err("path","Required."):l.path=function(e,t,i){const n=e.obj(t,i);if(!n)return;let s="";"string"==typeof n.d&&n.d.trim()?n.d.length>Je?e.err(`${i}.d`,"At most 8192 characters."):st.test(n.d)&&/^\s*[Mm]/.test(n.d)?(0,de.Mj)(n.d).some(e=>e.length)?s=n.d.trim().replace(/\s+/g," "):e.err(`${i}.d`,"The path draws nothing."):e.err(`${i}.d`,"Not valid path data (it must start with M)."):e.err(`${i}.d`,"Required.");const r={d:s,units:e.oneOf(n,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:e.bool(n,"follow_rotation",`${i}.follow_rotation`,!1),subject:e.oneOf(n,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==n.particles&&null!==n.particles){const t=e.obj(n.particles,`${i}.particles`);t&&(r.particles=ut(e,t,`${i}.particles`,{...Qe,count:3}))}return r}(i,n.path,"path");break;case"sequence":{l.steps=void 0===n.steps?(i.err("steps","Required."),[]):function(e,t,i,n){const s=e.list(t,i,20,1);if(!s)return[];const r=[];return s.forEach((t,s)=>{const a=`${i}[${s}]`,o=e.obj(t,a);if(!o)return;const l="string"==typeof o.animation?o.animation.trim():"";l?Ze(l)?Ke(l)===n?e.err(`${a}.animation`,"A sequence cannot play itself."):Xe.test(Ke(l))||e.err(`${a}.animation`,"Not a valid animation id."):lt.has(l)||e.err(`${a}.animation`,"Must be a motion preset or a custom keyframes / path animation."):e.err(`${a}.animation`,"Required.");const c={animation:l,delay:e.num(o,"delay",`${a}.delay`,0,600,0)??0,repeat:e.num(o,"repeat",`${a}.repeat`,1,100,1,!0)??1},d=e.num(o,"duration",`${a}.duration`,.05,600);void 0!==d&&(c.duration=d),r.push(c)}),r}(i,n.steps,"steps",r),l.loop=i.bool(n,"loop","loop",!0);const e=void 0===n.stagger||null===n.stagger?{}:i.obj(n.stagger,"stagger");e&&(l.stagger={children:i.bool(e,"children","stagger.children",!1),delay:i.num(e,"delay","stagger.delay",0,10,.1)??.1});break}}if(o)if(gt)"lenient"===t.v2?Object.assign(l,gt(n,new pt)):Object.assign(l,gt(n,i));else for(const e of mt)void 0===n[e]||null===n[e]||"clips"!==e&&"keyframes"!==o||(l[e]=n[e]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:l,errors:[]}}function vt(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},s=()=>{const r=n();if("("===r){i++;const t=a();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===r||"+"===r){i++;const e=s();return"-"===r?-e:e}const o=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!o)throw new Error(`Not a number in "${e}"`);return i+=o[0].length,Number(o[0])},r=()=>{let e=s();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=s();e="*"===t?e*n:e/n}return e},a=()=>{let e=r();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=r();e="+"===t?e+n:e-n}return e},o=a();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+o.toFixed(4)}function bt(e){const t=[];let i=0,n="";for(const s of e.trim())"("===s&&i++,")"===s&&i--," "===s&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}const yt={x:[1,0,0],y:[0,1,0]};function xt(e,t,i,n){const s=e.transform??={};switch(t){case"translate":{const[e,t="0"]=bt(i);return s.x=vt(e),void(s.y=vt(t))}case"scale":{const e=bt(i).map(vt);return void(1===e.length?s.scale=e[0]:(s.scale_x=e[0],s.scale_y=e[1]))}case"rotate":{const e=bt(i);return s.rotate=vt(e[e.length-1]),void(2===e.length&&yt[e[0]]?s.axis=yt[e[0]]:4===e.length&&(s.axis=[vt(e[0]),vt(e[1]),vt(e[2])]))}case"opacity":return void(e.opacity=vt(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function _t(e){const t=oe(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of le(t))for(const t of n.offsets){const s=i.get(t)??{at:t};for(const[t,i]of n.decls)xt(s,t,i,e);i.set(t,s)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}const $t=e=>`${e.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}-custom`.slice(0,64);function wt(e,t=$t(e),i){const n=te(e);if(!n)return;const s=n.defaults,r={id:t,name:i??(0,T.t)(n.name),kind:"keyframes",duration:parseFloat(s.duration),easing:s.easing,iterations:s.iterations,..."normal"!==s.direction?{direction:s.direction}:{},target:"element",origin:n.origin??"center",version:1};return n.channels.includes("fx")?{...r,kind:"particles",particles:{...Qe,size:[...Qe.size],colors:[],..."count"===n.particles?{count:Math.max(1,Math.round(s.intensity))}:{},layer:n.front?"front":"back",preset:n.id,intensity:s.intensity}}:{...r,keyframes:_t(n.id)}}var kt=i(3682),Mt=Symbol("NOT_RESOLVED");function St(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function jt(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Ct(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var At=St("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),zt=["","~","null","Null","NULL"],qt=St("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==zt.indexOf(e)?null:Mt,identify:e=>null===e,represent:()=>"null"}),Et=St("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:Mt,identify:e=>null===e,represent:()=>"null"}),Ht=["","~","null","Null","NULL"],Lt=St("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Ht.indexOf(e)?null:Mt,identify:e=>null===e,represent:()=>"null"}),Vt=["true","True","TRUE"],Ot=["false","False","FALSE"],Pt=St("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Vt.indexOf(e)||-1===Ot.indexOf(e)&&Mt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Rt=["true"],Dt=["false"],Nt=St("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Rt.indexOf(e)||-1===Dt.indexOf(e)&&Mt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Tt=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Ft=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],It=St("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==Tt.indexOf(e)||-1===Ft.indexOf(e)&&Mt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Bt=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Zt=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Kt=St("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!Zt.test(e))return Mt}else if(!Bt.test(e))return Mt;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Mt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Wt=new RegExp("^-?(?:0|[1-9][0-9]*)$"),Ut=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Gt=St("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Ut.test(e))return Mt}else if(!Wt.test(e))return Mt;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Mt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Yt=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),Jt=St("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!Yt.test(e))return Mt;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:Mt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Xt=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),Qt=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ei=St("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!Xt.test(e))return Mt;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)||Qt.test(e)?n:Mt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ti=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),ii=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ni=St("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!ii.test(e))return Mt;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)?n:Mt}if(!ti.test(e))return Mt;const i=Number(e);return Number.isFinite(i)?i:Mt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),si=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ri=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ai=St("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!si.test(e))return Mt;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let n=0;if(t.includes(":")){for(const e of t.split(":"))n=60*n+Number(e);n*=i}else n=i*parseFloat(t);return Number.isFinite(n)||ri.test(e)?n:Mt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),oi=St("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":Mt,identify:()=>!1}),li=/^[A-Za-z0-9+/]*={0,2}$/,ci=St("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!li.test(t))return Mt;const i=atob(t),n=new Uint8Array(i.length);for(let e=0;e<i.length;e++)n[e]=i.charCodeAt(e);return n},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),di=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),pi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function hi(e,t,i,n=0,s=0,r=0,a=0){const o=new Date(Date.UTC(e,t,i,n,s,r,a));return o.setUTCFullYear(e,t,i),o}var ui=St("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=di.exec(e);if(null===t&&(t=pi.exec(e)),null===t)return Mt;const i=+t[1],n=+t[2]-1,s=+t[3];if(!t[4]){const e=hi(i,n,s);return e.getUTCFullYear()!==i||e.getUTCMonth()!==n||e.getUTCDate()!==s?Mt:e}const r=+t[4],a=+t[5],o=+t[6];let l=0;if(r>23||a>59||o>59)return Mt;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=hi(i,n,s,r,a,o,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==n||c.getUTCDate()!==s)return Mt;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return Mt;const n=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-n:n))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),mi=jt("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function gi(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var fi=jt("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!gi(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),vi=jt("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,n=Object.keys(i);return 1!==n.length?"cannot resolve a pairs item":(e.push([n[0],i[n[0]]]),"")},identify:()=>!1}),bi=Ct("tag:yaml.org,2002:map",{create:()=>({}),identify:gi,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const n=String(t);return"__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),yi=Ct("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),xi=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let n=0;n<t.length;n++){const s=t[n];if(s.nodeKind===i.nodeKind&&s.tagName===i.tagName&&s.matchByTagPrefix===i.matchByTagPrefix){e=n;break}}t[e]=i}return t}(e),i=[],n={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},s={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?s.scalar.push(e):n.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?s.sequence.push(e):n.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?s.mapping.push(e):n.mapping[e.tagName]=e}}const r=i.filter(e=>null===e.implicitFirstChars),a=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)a.add(t);const o=new Map;for(const e of a)o.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=n.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=o,this.implicitScalarAnyFirstChar=r,this.defaultScalarTag=l,this.defaultSequenceTag=n.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=n.mapping["tag:yaml.org,2002:map"],this.exact=n,this.prefix=s}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==Mt)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},_i=new xi([At,mi,bi]),$i=(new xi([..._i.tags,Et,Nt,Gt,ni]),new xi([..._i.tags,qt,Pt,Kt,ei]));function wi(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}function ki(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}new xi([..._i.tags,Lt,It,Jt,ai,ui,oi,ci,fi,vi,yi]).withTags({...Jt,resolve:(e,t,i)=>{const n=Jt.resolve(e,t,i);return n===Mt?Kt.resolve(e,t,i):n}},{...ai,resolve:(e,t,i)=>{const n=ai.resolve(e,t,i);return n===Mt?ei.resolve(e,t,i):n}}),Ct("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||gi(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),Ct("tag:yaml.org,2002:map",{create:()=>({}),identify:gi,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const n=wi(t);return null===n?"nested arrays are not supported inside keys":("__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,"")},has:(e,t)=>{const i=wi(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Error;var Mi=new Array(256),Si=new Array(256);for(let e=0;e<256;e++)Mi[e]=ki(e)?1:0,Si[e]=ki(e);Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"}),Object.prototype.hasOwnProperty;var ji=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Ci=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;function Ai(e,t){return!!(e&1<<t)}new RegExp(`^(?:${ji})*$`),new RegExp(`^(?:${Ci})+$`),new RegExp(`^(?:!(?:${ji})*|${Ci}(?:${ji})*)$`),Symbol("INVALID"),Symbol("visit:break"),Symbol("visit:skip");var zi={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:qi(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Ai(e.allowedStylesMask,4))return void(i&&(e.style=3));const n=e.presenterOptions.lineWidth;if(-1===n)return void(i&&(e.style=4));const s=Math.max(Math.min(n,40),n-e.shiftOfContent);let r=0,a=!1;for(;r<=t.length;){let e=t.length;const i=t.indexOf("\n",r);-1!==i&&(e=i);const n=t.slice(r,e);if(n.length>s&&" "!==n[0]&&/ [^ \t]/.test(n)&&(a=!0),-1===i)break;r=i+1}a?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||Ai(e.allowedStylesMask,1)||(e.style=qi(e))},fallbackToDoubleQuoted:function(e){Ai(e.allowedStylesMask,e.style)||(e.style=3)}};function qi(e){return"single"===e.presenterOptions.quoteStyle&&Ai(e.allowedStylesMask,2)?2:3}var Ei="[ \\t]",Hi="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Li=`(?:(?!${Ei})${Hi})`,Vi="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Oi="[-?:,\\[\\]{}#&*!|>'\"%@`]",Pi=`(?:(?![,\\[\\]{}])${Li})`,Ri=`(?:(?:(?![:#])${Li})|:(?=${Li}))#*`,Di=`(?:(?:(?![:#])${Pi})|:(?=${Pi}))#*`,Ni=`(?:${Ei}*${Ri})*`,Ti=`(?:${Ei}*${Di})*`,Fi=`(?:(?:(?!${Oi})${Li})|[?:-](?=${Li}))#*${Ni}`,Ii=`(?:(?:(?!${Oi})${Li})|[?:-](?=${Pi}))#*${Ti}`,Bi=Fi,Zi=Ii,Ki=`${Ii}(?:\\n+${Di}${Ti})*`;new RegExp(`^(?:${Fi}(?:\\n+${Ri}${Ni})*)$`,"u"),new RegExp(`^(?:${Ki})$`,"u"),new RegExp(`^(?:${Bi})$`,"u"),new RegExp(`^(?:${Zi})$`,"u"),new RegExp(`^(?:${Vi})*$`,"u"),new RegExp(`^(?:${Vi}|\\n)*$`,"u"),new RegExp(`^(?:${Hi}|\\n)*$`,"u"),Object.keys(zi).map(e=>Reflect.get(zi,e)),$i.withTags(oi);const Wi=64,Ui=48,Gi=/^[a-z0-9][a-z0-9_-]{0,31}$/,Yi=["element","icon","name","state","background"],Ji=["rotate","x","y","scale","opacity","draw","color_mix","speed","rotate_speed"],Xi=["cut","crossfade","finish"],Qi=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;function en(e,t,i,n){return Array.isArray(t)?t.length>n?e.err(`${i}[${n}]`,`At most ${n} entries.`):t:e.err(i,"Must be a list.")}function tn(e,t,i,n){const s="string"==typeof t.id?t.id.trim():"";return Gi.test(s)?n.has(s)?e.err(`${i}.id`,`Duplicate id "${s}".`):(n.add(s),s):e.err(`${i}.id`,"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).")}function nn(e,t,i,n){if(void 0===t.name||null===t.name||""===t.name)return n;if("string"!=typeof t.name||!t.name.trim())return e.err(`${i}.name`,"Must be text.")??n;const s=t.name.trim();return s.length>80?e.err(`${i}.name`,"At most 80 characters.")??n:s}function sn(e,t,i){if(null!=t)return!Array.isArray(t)||2!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e)||Math.abs(e)>1e4)?e.err(i,"Must be two numbers [x, y]."):[t[0],t[1]]}function rn(e,t,i){return"string"==typeof t&&t.trim()?t.length>Je?e.err(i,"At most 8192 characters."):st.test(t)&&/^\s*[Mm]/.test(t)?(0,de.Mj)(t).some(e=>e.length)?t.trim().replace(/\s+/g," "):e.err(i,"The path draws nothing."):e.err(i,"Not valid path data (it must start with M)."):e.err(i,"Required.")}function an(e,t,i,n){if("string"!=typeof t||!t.trim())return e.err(i,"Must be SVG markup.");if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>Me)return e.err(i,"The SVG is larger than 32 KB.");const s=n&&!/^\s*<svg[\s>]/i.test(t)?`<svg viewBox="0 0 24 24">${t}</svg>`:t;if(!/<svg[\s>]/i.test(s))return e.err(i,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(s);if(t.error)return e.err(i,t.error)}return t}function on(e,t,i,n){const s=function(e){if("string"!=typeof e)return;if(Yi.includes(e))return{kind:e};const t=/^(part|group|shape):(.+)$/.exec(e);return t&&Gi.test(t[2])?{kind:t[1],id:t[2]}:void 0}(t);if(!s)return e.err(i,"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.");if(void 0!==s.id){const t="part"===s.kind?n?.parts:"group"===s.kind?n?.groups:n?.shapes;if(!t?.some(e=>e.id===s.id))return e.err(i,`No ${s.kind} "${s.id}" in the rig.`)}return t}function ln(e,t){const i={},n=t=>void 0!==e[t]&&null!==e[t],s="keyframes"===e.kind;let r;return s&&n("rig")&&(r=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={parts:[]},r=void 0!==n.icon&&null!==n.icon&&""!==n.icon,a=void 0!==n.svg&&null!==n.svg&&""!==n.svg;if(r&&a&&e.err(i,"Set icon or svg, not both."),r&&("string"==typeof n.icon&&rt.test(n.icon.trim())?s.icon=n.icon.trim():e.err(`${i}.icon`,"Must be an icon id like mdi:bell.")),a){const t=an(e,n.svg,`${i}.svg`,!1);t&&(s.svg=t)}const o=new Set,l=void 0===n.parts?[]:en(e,n.parts,`${i}.parts`,Wi);if(l?.forEach((t,n)=>{const r=`${i}.parts[${n}]`,a=e.obj(t,r);if(!a)return;const l=tn(e,a,r,o);if(!l)return;const c={id:l,name:nn(e,a,r,l)},d=void 0!==a.from&&null!==a.from;if(d===(void 0!==a.svg&&null!==a.svg&&""!==a.svg))return void e.err(r,"Set one of from or svg.");if(d){const t=e.list(a.from,`${r}.from`,256,1),i=[];t?.forEach((t,n)=>{"number"==typeof t&&Number.isInteger(t)&&t>=0&&t<=4095?i.push(t):e.err(`${r}.from[${n}]`,"Must be a subpath index (a whole number from 0).")}),c.from=i}else{const t=an(e,a.svg,`${r}.svg`,!0);t&&(c.svg=t)}const p=sn(e,a.origin,`${r}.origin`);p&&(c.origin=p),s.parts.push(c)}),void 0!==n.groups&&null!==n.groups){const t=new Set(s.parts.map(e=>e.id)),r=[];en(e,n.groups,`${i}.groups`,16)?.forEach((n,s)=>{const a=`${i}.groups[${s}]`,l=e.obj(n,a);if(!l)return;const c=tn(e,l,a,o);if(!c)return;const d=[];e.list(l.parts,`${a}.parts`,Wi,1)?.forEach((i,n)=>{"string"==typeof i&&t.has(i)?d.includes(i)||d.push(i):e.err(`${a}.parts[${n}]`,"Not a part of this rig.")});const p={id:c,name:nn(e,l,a,c),parts:d},h=sn(e,l.origin,`${a}.origin`);h&&(p.origin=h),d.length&&r.push(p)}),s.groups=r}if(void 0!==n.shapes&&null!==n.shapes){const t=[];en(e,n.shapes,`${i}.shapes`,Ui)?.forEach((n,s)=>{const r=`${i}.shapes[${s}]`,a=e.obj(n,r);if(!a)return;const l=tn(e,a,r,o);if(!l)return;const c=rn(e,a.d,`${r}.d`),d={id:l,name:nn(e,a,r,l),d:c??"",layer:"over"},p=e.css(a,"fill",`${r}.fill`,"color");p&&(d.fill=p);const h=e.css(a,"stroke",`${r}.stroke`,"color");h&&(d.stroke=h);const u=e.num(a,"stroke_width",`${r}.stroke_width`,0,100);void 0!==u&&(d.stroke_width=u);const m=e.oneOf(a,"linecap",`${r}.linecap`,["round","butt","square"]);m&&(d.linecap=m),d.layer=e.oneOf(a,"layer",`${r}.layer`,["over","under"],"over")??"over";const g=sn(e,a.origin,`${r}.origin`);g&&(d.origin=g),c&&t.push(d)}),s.shapes=t}return s}(t,e.rig,"rig"),r&&(i.rig=r)),s&&n("tracks")&&(i.tracks=function(e,t,i){const n=[],s=new Set;return en(e,t,"tracks",24)?.forEach((t,r)=>{const a=`tracks[${r}]`,o=e.obj(t,a);if(!o)return;let l=on(e,o.target,`${a}.target`,i);l&&s.has(l)&&(l=e.err(`${a}.target`,"Another track already animates this target.")),l&&s.add(l);const c=!!l&&/^(part|group|shape):/.test(l),d=((void 0===o.keyframes?[]:en(e,o.keyframes,`${a}.keyframes`,40))??[]).map((t,i)=>ht(e,t,`${a}.keyframes[${i}]`,c)).filter(e=>!!e).sort((e,t)=>e.at-t.at),p={target:l??"element",keyframes:d};if(void 0!==o.origin&&""!==o.origin&&("string"==typeof o.origin&&nt.test(o.origin.trim())?p.origin=o.origin.trim():e.err(`${a}.origin`,'Use keywords, lengths or percentages, e.g. "50% 100%".')),void 0!==o.path&&null!==o.path){const t=e.obj(o.path,`${a}.path`);if(t){const i=rn(e,t.d,`${a}.path.d`);i&&(p.path={d:i,...void 0!==t.follow_rotation?{follow_rotation:e.bool(t,"follow_rotation",`${a}.path.follow_rotation`,!1)}:{}})}}l&&n.push(p)}),n}(t,e.tracks,r)),n("clips")&&(i.clips=function(e,t,i){const n=[],s=new Set(J.map(e=>e.id));return en(e,t,"clips",12)?.forEach((t,r)=>{const a=`clips[${r}]`,o=e.obj(t,a);if(!o)return;const l=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["state","state_not","entity_on","above","below"].filter(e=>void 0!==n[e]&&null!==n[e]);if(1!==s.length)return e.err(i,"Set one of state, state_not, entity_on, above or below.");const r=s[0],a=n[r];if("state"===r||"state_not"===r){const t="boolean"==typeof a?a?"on":"off":"string"==typeof a||"number"==typeof a?String(a).trim():"";return!t||t.length>255?e.err(`${i}.${r}`,"Must be a state (text)."):"state"===r?{state:t}:{state_not:t}}if("entity_on"===r)return"boolean"==typeof a?{entity_on:a}:e.err(`${i}.entity_on`,"Must be true or false.");const o=e.num(n,r,`${i}.${r}`,-1e9,1e9);return void 0===o?void 0:"above"===r?{above:o}:{below:o}}(e,o.when,`${a}.when`),c="string"==typeof o.animation?o.animation.trim():"";let d=!0;if(c)if(Ze(c)){const t=Ke(c);t===i?d=!!e.err(`${a}.animation`,"A clip cannot play its own document (use self)."):Xe.test(t)||(d=!!e.err(`${a}.animation`,"Not a valid animation id."))}else"self"===c||"none"===c||s.has(c)||(d=!!e.err(`${a}.animation`,"Must be self, none, a preset or custom:<id>."));else d=!!e.err(`${a}.animation`,"Required.");const p=e.oneOf(o,"transition",`${a}.transition`,Xi);l&&d&&n.push({when:l,animation:c,...p?{transition:p}:{}})}),n}(t,e.clips,"string"==typeof e.id?e.id.trim():"")),s&&n("bindings")&&(i.bindings=function(e,t,i){const n=[];return en(e,t,"bindings",8)?.forEach((t,s)=>{const r=`bindings[${s}]`,a=e.obj(t,r);if(!a)return;const o=on(e,a.target,`${r}.target`,i),l=e.oneOf(a,"property",`${r}.property`,Ji);void 0===a.property&&e.err(`${r}.property`,"Required.");const c=e.obj(a.input,`${r}.input`);let d,p;if(c){const t=e.num(c,"min",`${r}.input.min`,-1e9,1e9,0),i=e.num(c,"max",`${r}.input.max`,-1e9,1e9,100);void 0!==t&&void 0!==i&&t===i?e.err(`${r}.input.max`,"Must differ from min."):void 0!==t&&void 0!==i&&(d={min:t,max:i}),void 0!==c.attribute&&null!==c.attribute&&""!==c.attribute&&("string"==typeof c.attribute&&Qi.test(c.attribute.trim())?d=d&&{attribute:c.attribute.trim(),...d}:(e.err(`${r}.input.attribute`,"Must be an attribute name."),d=void 0))}const h=a.output;if(Array.isArray(h)&&2===h.length)if("color_mix"===l){const t=it(h[0],"color"),i=it(h[1],"color");t&&i?p=[t,i]:e.err(`${r}.output`,"color_mix needs two colours.")}else h.every(e=>"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=1e6)?p=[h[0],h[1]]:e.err(`${r}.output`,"Must be two numbers (colours only for color_mix).");else e.err(`${r}.output`,"Must be a pair [from, to].");const u=e.num(a,"smoothing",`${r}.smoothing`,0,10);o&&l&&d&&p&&n.push({target:o,property:l,input:d,output:p,...void 0!==u?{smoothing:u}:{}})}),n}(t,e.bindings,r)),i}gt=ln;const cn=e=>+e.toFixed(4);function dn(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}const pn=e=>`mcc-${e.id}-${dn(JSON.stringify(e))}`,hn=(e,t)=>`--mcc-${e}-${t}`;function un(e){return I.find(t=>t.id===e)?.css??e??"ease"}const mn=e=>({len:(t,i)=>0===t?`0${i}`:`calc(${cn(t)}${i} * var(${hn(e,"i")}, 1))`,scale:t=>1===t?"1":`calc(1 + ${cn(t-1)} * var(${hn(e,"i")}, 1))`,color:t=>((e,t)=>t?e.replace(/var\(\s*--mc-anim-c\s*\)/g,(e=>`color-mix(in srgb, var(${hn(e,"c")}, var(--mc-anim-c)) calc(var(${hn(e,"s")}, 1) * 100%), transparent)`)(t)):e)(t,e)}),gn=(e=1)=>({len:(t,i)=>`${cn(t*e)}${i}`,scale:t=>String(cn(1+(t-1)*e)),color:e=>e});function fn(e,t){const i=[],n=e.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${t.len(n.x??0,"px")} ${t.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const e=n.scale??1,s=e*(n.scale_x??1),r=e*(n.scale_y??1);i.push(["scale",s===r?t.scale(s):`${t.scale(s)} ${t.scale(r)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${t.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${t.len(n.skew_x??0,"deg")}, ${t.len(n.skew_y??0,"deg")})`])}if(void 0!==e.opacity&&i.push(["opacity",String(e.opacity)]),e.color&&i.push(["color",t.color(e.color)]),e.background&&i.push(["background",t.color(e.background)]),e.shadow&&i.push(["box-shadow",t.color(e.shadow)]),void 0!==e.filter||void 0!==e.blur){const n=[e.filter&&"none"!==e.filter?t.color(e.filter):"",void 0!==e.blur?`blur(${t.len(e.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==e.radius&&i.push(["border-radius",`${e.radius}px`]),void 0!==e.draw&&i.push(["stroke-dashoffset",String(cn(1-e.draw))]),e.stroke&&i.push(["stroke",t.color(e.stroke)]),e.easing&&i.push(["animation-timing-function",un(e.easing)]),i}const vn=(e,t)=>`  ${e} { ${t.map(([e,t])=>`${e}: ${t};`).join(" ")} }`,bn=(e,t)=>`@keyframes ${e} {\n${t.join("\n")}\n}`,yn={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function xn(e,t,i){const n=t.map(e=>fn(e,i)),s=Object.keys(yn).filter(e=>t.some(t=>yn[e].some(e=>void 0!==t.easings?.[e]))),r=bn(e,t.map((e,t)=>vn(`${cn(e.at)}%`,n[t].filter(([e])=>!s.includes(e)))));if(!s.length)return{css:r,lanes:[]};const a=[],o=[r];for(const i of s){const s=`${e}-l${yn[i][0]}`,r=[];t.forEach((e,t)=>{const s=n[t].filter(([e])=>e===i);if(!s.length)return;const a=yn[i].map(t=>e.easings?.[t]).find(e=>void 0!==e)??e.easing;r.push(vn(`${cn(e.at)}%`,a?[...s,["animation-timing-function",un(a)]]:s))}),r.length&&(a.push(s),o.push(bn(s,r)))}return{css:o.join("\n"),lanes:a}}const _n=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase()),$n=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,r=3*i*t*t,a=t*t*t;return[n*e[0][0]+s*e[1][0]+r*e[2][0]+a*e[3][0],n*e[0][1]+s*e[1][1]+r*e[2][1]+a*e[3][1]]};function wn(e,t=48){const i=(0,de.Mj)(e).flat();if(!i.length)return[];const n=[i[0][0]];for(const e of i)for(let t=1;t<=16;t++)n.push($n(e,t/16));const s=[0];for(let e=1;e<n.length;e++)s.push(s[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const r=s[s.length-1],a=e=>{if(0===r)return n[0];let t=1;for(;t<s.length-1&&s[t]<e;)t++;const i=s[t]-s[t-1]||1,a=Math.min(1,Math.max(0,(e-s[t-1])/i));return[n[t-1][0]+(n[t][0]-n[t-1][0])*a,n[t-1][1]+(n[t][1]-n[t-1][1])*a]},o=[];let l;const c=r/(4*t)||.001;for(let e=0;e<=t;e++){const i=r*e/t,n=a(i),s=a(Math.max(0,i-c)),d=a(Math.min(r,i+c));let p=180*Math.atan2(d[1]-s[1],d[0]-s[0])/Math.PI;if(void 0!==l){for(;p-l>180;)p-=360;for(;p-l<-180;)p+=360}l=p,o.push({t:e/t,x:n[0],y:n[1],angle:p})}return o}function kn(e,t,i){return wn(e.d).map(n=>{const s=[["translate",`${t.len(cn(n.x),i[0])} ${t.len(cn(n.y),i[1])}`]];return e.follow_rotation&&s.push(["rotate",`${cn(n.angle)}deg`]),[cn(100*n.t),s]})}const Mn=.618034,Sn=e=>e-Math.floor(e);function jn(e){const t=e.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(t)}")`}function Cn(e,t){if(!e)return"border-radius: 50%; background: currentColor;";if("svg"in e){const i=t(e.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=jn(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const An=e=>e&&"icon"in e?{icon:e.icon}:e&&"emoji"in e?{text:e.emoji}:void 0;function zn(e,t=100){const i=e.count;return Array.from({length:i},(n,s)=>{const r=(Sn(s*Mn)-.5)*(60/i),a=Math.min(96,Math.max(4,(s+.5)/i*100+r)),o=50+t/100*(a-50),l=e.size[0]+(e.size[1]-e.size[0])*Sn(.381966*s+.25),c=e.colors.length?e.colors[s%e.colors.length]:"",d=[`--mcc-sz: ${cn(l)}px`,"--mcc-sp: "+(s%2?-1:1),`--mcc-dx: ${cn(16*(2*Sn(.7548*s)-1))}`,c&&`--mcc-pc: ${c}`].filter(Boolean).join("; ");return{x:cn(o),phase:cn(Sn(s*Mn)),k:i>1?cn(s/i):0,style:d}})}const qn=(e,t)=>`.mc-anim-fx[data-fx="${e}"] { opacity: var(${hn(t,"s")}, 1); }\n.mc-anim-fx[data-fx="${e}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${hn(t,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function En(e,t,i,n){const s=i.fade?0:1,r=`calc(var(--mcc-sp, 1) * ${cn(i.spin)}deg)`,a=i.gravity,o=`${cn(i.spread/2)}cqmin`,l=a>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":a<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let c,d;switch(i.direction){case"fall":case"rise":{const e="fall"===i.direction?"":"-";c="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s};${l} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${e}100cqh ${e?"-":"+"} var(--mcc-sz) * 2); rotate: ${r}; opacity: ${s}; }`];break}case"drift":c="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${cn(15*a)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${cn(30*a)}cqh; rotate: ${r}; opacity: ${s}; }`];break;case"burst":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(${r}); translate: 0 ${cn(30*a)}cqh; opacity: ${s}; }`];break;case"orbit":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: 1; }`].filter(Boolean);break;case"spiral":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${s}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: ${s}; }`]}return`${qn(e,t)} ${c} ${Cn(i.shape,n)} }\n${bn(e,d)}`}function Hn(e,t,i,n,s){const r=mn(t),a=i.follow_rotation?"auto":"0deg",o=e=>bn(e,kn(i,r,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([e,t])=>vn(`${e}%`,[...t,["opacity","1"]]))),l=`${qn(e,t)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${Cn(n.shape,s)} }`;if("px"!==i.units)return`${l}\n${o(e)}`;const c='offset-path: path("M0 0 L1 1")';return[l,`@supports (${c}) {`,`  .mc-anim-fx[data-fx="${e}"] > i { offset-path: path("${i.d}"); offset-rotate: ${a}; offset-anchor: center; margin: 0; }`,`  @keyframes ${e} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${c}) {`,o(e),"}"].join("\n")}function Ln(e,t){const i=[],n=[];let s=0;const r="icon"===e.target;return(e.steps??[]).forEach((e,a)=>{let o,l,c,d=e.duration;if(Ze(e.animation)){const i=t?.(Ke(e.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(o=function(e,t=1){if("path"===e.kind&&e.path)return kn(i=e.path,gn(t),"px"===i.units?["px","px"]:["%","%"]).map(([e,t])=>({...Object.fromEntries(t.map(([e,t])=>[_n(e),t])),offset:cn(e/100)}));var i;if("keyframes"!==e.kind||!e.keyframes)return[];const n=new Map;for(const i of e.keyframes){const e=n.get(i.at)??{};for(const[n,s]of fn(i,gn(t)))e[_n(n)]=s;n.set(i.at,e)}return[...n.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:cn(e/100)}))}(i),d??=i.duration,l=un(i.easing),c=i.origin)}else{const t=te(e.animation);o=t&&!t.channels.includes("fx")?function(e,t={}){const i=te(e);if(!i)return;const n=oe(t.icon&&i.iconKeyframes?`${e}-icon`:e,t.intensity);return void 0===n?void 0:function(e){const t=new Map;for(const i of e)for(const e of i.offsets){const n=t.get(e)??{};for(const[e,t]of i.decls)n[ce(e)]=t;t.set(e,n)}return[...t.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:+(e/100).toFixed(4)}))}(le(n))}(t.id,{icon:r}):void 0,t&&(d??=parseFloat(t.defaults.duration),l=un(t.defaults.easing),c=t.origin)}if(!o?.length||!d)return void n.push(a);const p=s+e.delay;i.push({start:cn(p),duration:d,iterations:e.repeat,easing:l??"ease",frames:o,...c&&"center"!==c?{origin:c}:{}}),s=p+d*e.repeat}),{steps:i,total:cn(s),loop:!1!==e.loop,target:e.target,...e.stagger?.children?{stagger:e.stagger.delay}:{},skipped:n}}const Vn=new WeakMap;function On(e,t={}){const i=!t.reducedMotion&&(e=>"particles"===e.kind&&!!e.particles?.sim&&!e.particles.preset)(e);let n=i&&function(e){if(Ie.failedSims.has(e.id))return;Rn!==Ie.epoch&&(Pn=new WeakMap,Rn=Ie.epoch);let t=Pn.get(e);const i=e.particles;try{const n=Ie.particles&&!t&&Ie.checkSim?.(i.sim,"lenient",{count:i.count,layer:i.layer}).sim;if(n){const s={...i,sim:n},r=e.duration/i.speed,a=Ie.particles(e.id,s,r,{aspect:0}),o=a.other;Pn.set(e,t={kind:"particles",name:a.name,css:o?`${a.css}\n${o.css}`:a.css,layer:{front:a.front,particles:a.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:r},...o?{split:{name:o.name,layer:{front:o.front,particles:o.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:r,part:1}}}:{}})}}catch{Ie.failedSims.add(e.id)}return t}(e)||function(e,t){if(t.reducedMotion)return{kind:e.kind,name:"",css:"",reduced:!0,..."sequence"===e.kind?{schedule:{steps:[],total:0,loop:!1,target:e.target,skipped:[]}}:{}};if("sequence"===e.kind)return{kind:"sequence",name:pn(e),css:"",schedule:Ln(e,t.lookup)};const i=Vn.get(e);if(i)return i;const n=pn(e),s=e=>Ne(e).markup;let r;switch(e.kind){case"keyframes":{const{css:t,lanes:i}=xn(n,e.keyframes??[],mn(e.id));r={kind:"keyframes",name:n,css:t,motion:{target:e.target,origin:e.origin},...i.length?{lanes:i}:{}};break}case"particles":{const t=e.particles;if(t.preset){r={kind:"particles",name:"",css:"",preset:{id:t.preset,...void 0!==t.intensity?{intensity:t.intensity}:{}}};break}r={kind:"particles",name:n,css:En(n,e.id,t,s),layer:{front:"front"===t.layer,particles:zn(t,t.spread),speed:t.speed,...An(t.shape)?{symbol:An(t.shape)}:{}}};break}case"path":{const t=e.path;if("particles"===t.subject){const i=t.particles??{count:3,size:[8,8],colors:[]};r={kind:"path",name:n,css:Hn(n,e.id,t,i,s),layer:{front:!1,particles:zn(i),speed:1,...An(i.shape)?{symbol:An(i.shape)}:{}}};break}const i=kn(t,mn(e.id),"px"===t.units?["px","px"]:["%","%"]).map(([e,t])=>vn(`${e}%`,t));r={kind:"path",name:n,css:bn(n,i),motion:{target:"icon"===t.subject?"icon":"element",origin:e.origin}};break}}return Vn.set(e,r),r}(e,t);return i&&!Ie.particles&&(n={...n,needsParticles:!0}),Ie.v2&&Fe(e)?{...n,v2:Ie.v2(e,t)}:n}let Pn=new WeakMap,Rn=0;const Dn=new WeakMap,Nn=new WeakMap;function Tn(e){let t=Nn.get(e);if(!t){const i={...e};delete i.rig,delete i.tracks,delete i.clips,delete i.bindings,t={...i,...ln(e,new pt)},Nn.set(e,t)}return t}function Fn(e,t={}){if(t.reducedMotion||!Array.isArray(e.tracks)||!e.tracks.length)return[];let i=Dn.get(e);return i||Dn.set(e,i=function(e,t){const i=mn(e.id);return(e.tracks??[]).map((e,n)=>{const s=`${t}-t${n}`,r=[],a=[];if(e.keyframes.length){const t=xn(s,e.keyframes,i);r.push(t.css),a.push(...t.lanes)}if(e.path){const t=e.keyframes.length?`${s}-path`:s,n={d:e.path.d,units:"px",follow_rotation:!!e.path.follow_rotation,subject:"element"};r.push(bn(t,kn(n,i,["px","px"]).map(([e,t])=>vn(`${e}%`,t)))),t!==s&&a.push(t)}return{target:e.target,name:s,css:r.join("\n"),...e.origin?{origin:e.origin}:{},...a.length?{lanes:a}:{}}})}(Tn(e),pn(e))),i}Ie.v2=function(e,t={}){const i=Tn(e),n=Fn(e,t),s=[],r=i.clips?.filter((i,n)=>{if(!Ze(i.animation))return!0;const r=t.lookup?.(Ke(i.animation));return!(r===e||r&&Array.isArray(r.clips)&&r.clips.length)||(s.push(n),!1)});return{tracks:n,...i.rig?{rig:i.rig}:{},...r?{clips:r}:{},...i.bindings?{bindings:i.bindings}:{},...s.length?{skipped:s}:{}}};const{t:In,tx:Bn,m:Zn,locale:Kn}=(0,N.my)("anim-studio",["\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|0.1 s|1%|30 fps|5%|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A sequence cannot play itself.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add colour|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation colour|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrow keys move the cursor, Enter places points, Escape cancels.|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and colour come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text colour inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first colour to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customise one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Centre|Change count|Change fill|Change point type|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child colour|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, or choose Finish path.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse {name}|Collide with|Collisions|Colour|Colour mix|Colour {i}|Colour {n}|Colour {n}: entity colour|Colour {n}: {colour}|Colour: currentColor|Colours|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner radius|Corner radius (icon units)|Couldn't load the drawing tools.|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Cursor at x {x}, y {y}. Press Enter to add a point.|Cursor at x {x}, y {y}. Press Enter to finish.|Cursor at x {x}, y {y}. Press Enter to start.|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customise a preset|Customise a preset…|Customise one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete handle|Delete keyframe|Delete keyframes|Delete point|Delete points|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the centre.|Drag to draw. Shift: square, Alt: from the centre.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing cancelled.|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity colour|Entity is off|Entity is on|Entity value|Erase|Event|Expand|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill colour|Filter|Filter presets|Finish cycle|Finish path|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From colour|From{unit}|Front door|Glow|Got it|Gravity|Gravity direction|Gravity {strength} {direction}|Greyscale|Grid|Group|Group pivot|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide {noun} ({keys})|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|Inspector panel|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Layers panel|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximise|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move away from the start first.|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path|Move path point|Move pivot|Move point|Move points|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and colour on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colours only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colours: particles use the animation colour.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or colour this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation colour.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid colour.|Not a valid easing.|Not an allowed shadow: x y blur spread colour.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open path|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child colour|Own timeline|Paint|Part|Part actions|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colours in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.|Pause (Space)|Pause preview|Pen|Pen. Click to add points, click the first point to close.|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {count} placed. Enter again on the same spot finishes the stroke.|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Reload page|Reloading the page discards changes that are not saved. Reload anyway?|Remove|Remove colour|Remove colour {i}|Remove colour {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow colour|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape points. Drag a point to move it.|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes over the icon|Shapes under the icon|Shortcut: {keys}|Show all|Show all hidden layers|Show in preview|Show {noun} ({keys})|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Some panels are hidden, as you left them. Use the arrows on the edges to show them.|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Started at x {x}, y {y}. Move the cursor and press Enter to finish. Escape cancels.|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke colour|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colours become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon colour|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The colour is not a valid CSS colour: the file uses currentColor.|The drawing tools are not loaded yet.|The drawing tools are ready.|The drawing tools on this page are from another Magic Card version. Reload the page to draw here.|The entity colour button uses the animation colour (the card entry's colour, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count, plural, one {# shape} other {# shapes}}: {parts, plural, one {the first # became a part} other {the first # became parts}} (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The layers panel is hidden, as you collapsed it before. Use the arrow on the edge to show it.|The library holds at most {cap, plural, one {# animation} other {# animations}}: only {fit, plural, one {# more fits} other {# more fit}}, {skipped, plural, one {# was} other {# were}} not imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this colour: while it plays, its colour wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To colour|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a colour or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colours|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colours.|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|inspector|keyframe|keyframe track|keyframe tracks of {name}|layers|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{cLIPS_MAX, plural, one {At most # state.} other {At most # states.}}|{cap, plural, one {The library is full (# animation): nothing was imported.} other {The library is full (# animations): nothing was imported.}}|{colours, plural, one {At most # colour} other {At most # colours}}|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and colour this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# part} other {# parts}}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# target selected: a preset plays on each (Wave: one after another).} other {# targets selected: a preset plays on each (Wave: one after another).}}|{count, plural, one {# target} other {# targets}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {At most # shape fits in a rig.} other {At most # shapes fit in a rig.}}|{count, plural, one {Delete # keyframe} other {Delete # keyframes}}|{count, plural, one {Erase shape} other {Erase shapes}}|{count, plural, one {Group of # part} other {Group of # parts}}|{count, plural, one {Group removed} other {Groups removed}}|{count, plural, one {Grouped # part} other {Grouped # parts}}|{count, plural, one {Import shape} other {Import shapes}}|{count, plural, one {Replace # part} other {Replace # parts}}|{count, plural, one {Split into # part} other {Split into # parts}}|{count, plural, one {Split into # part} other {Split into # parts}} (the first {parts})|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count, plural, one {{name} added, # point.} other {{name} added, # points.}}|{count} of {colours}|{emitters, plural, one {At most # emitter.} other {At most # emitters.}}|{from} to {to}{unit}|{groups, plural, one {A rig has at most # group.} other {A rig has at most # groups.}}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{mAX_SHAPES, plural, one {At most # shape} other {At most # shapes}}|{max, plural, one {At most # animation.} other {At most # animations.}}|{max, plural, one {At most # binding per animation.} other {At most # bindings per animation.}}|{max, plural, one {At most # character.} other {At most # characters.}}|{max, plural, one {At most # entry.} other {At most # entries.}}|{max, plural, one {At most # particle over all emitters.} other {At most # particles over all emitters.}}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} added.|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{panels} hidden|{panels} shown|{particles, plural, one {# particle} other {# particles}} · {emitters, plural, one {# emitter} other {# emitters}}|{parts, plural, one {# part} other {# parts}}, {shapes, plural, one {# shape} other {# shapes}}|{parts, plural, one {# part} other {# parts}}, {shapes, plural, one {# shape} other {# shapes}}, no icon|{pct} % of the input range|{pct}, {seconds} seconds|{pieces, plural, one {Part of # shape} other {Part of # shapes}}|{preset} on {targets}|{room, plural, one {The SVG has too many shapes; at most # fits.} other {The SVG has too many shapes; at most # fit.}}|{seconds} s loop|{shapes, plural, one {At most # shape fits in a rig.} other {At most # shapes fit in a rig.}}|{size} KB|{size} icon units|{steps, plural, one {A sequence has at most # step.} other {A sequence has at most # steps.}}|{steps, plural, one {At most # step} other {At most # steps}}|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{tracks, plural, one {At most # animated target.} other {At most # animated targets.}}|{tracks, plural, one {This animation has # animated target, the most it can hold. Remove it to animate this part.} other {This animation has # animated targets, the most it can hold. Remove one to animate this part.}}|{where} · {from} to {to}","|||||||||||||||||||||||||||Add color|||||||||||||||||||||||||||||||||||||||Animation color|||||||||||||||||||Between {min} and {max}; empty uses {intensity}. Timing and color come from the animation settings.|||||Black in an <img>, the text color inline.|||||Blends from the first color to the second.||||||||||||||||Build one from scratch or customize one of the presets. Saved animations appear in every card's animation picker, under My animations.|||||||||||||||||Center|||||||||Child color|||||||||||||||||||||||||||||Color|Color mix|Color {i}|Color {n}|Color {n}: entity color|Color {n}: {colour}|Color: currentColor|Colors|||||||||||||||||||||||||||||||||||Customize a preset|Customize a preset…|Customize one of {count}||||||||||||||||||||||||||||||||||||||||||Drag to draw. Shift: circle, Alt: from the center.|Drag to draw. Shift: square, Alt: from the center.||||||||||||||Drawing canceled.||||||||||||||||||||||||||||||||||||Entity color||||||||||||||||||||Fill color||||||||||||||||||||||||From color||||||||Grayscale|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Maximize|||||||||||||||||||||||||||||||||||||||||||||||||||Move, scale, turn and color on a timeline||||||||||||||||||||||||||||||||||||Must be two numbers (colors only for color_mix).|||||||||||||||||||||||||No colors: particles use the animation color.|||||No keys yet. Add keys on the timeline to rotate, move, scale, fade or color this part.|||||||||None set: the particles take the animation color.|||||Not a valid color.||Not an allowed shadow: x y blur spread color.|||||||||||||||||||||||||||||||||||||||||||Own child color||||||||||||||||||Particles take the colors in turn. Pick one to change it.|||||||||||Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle color.||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Remove color|Remove color {i}|Remove color {n}||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Shadow color||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Stroke color|||Swaps the preset for your own particles: shape, movement, size and colors become editable.|||||||Text and icon color|||||||||||||||||||The color is not a valid CSS color: the file uses currentColor.||||The entity color button uses the animation color (the card entry's color, else the entity's).||||||||||||||||||||||||||||||||||||||||||The timeline also animates this color: while it plays, its color wins over this binding.|||||||||||||||||||||||||To color||||||||||||||||||||||||||||||||||||||||Use a color or a gradient.||||||||||Use the parent's colors||||||||||||||||||||||||||||||||||||||||color_mix needs two colors.|||||||||||||||||||||||||||||||||||||||||||||||||||||||||{colours, plural, one {At most # color} other {At most # colors}}|||||||||{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and color this part there.|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||",'"{name}" heeft wijzigingen die nog niet zijn opgeslagen.|"{name}" had de vorige keer wijzigingen die niet zijn opgeslagen.|% van de grootte||, groot|, {count} overgeslagen|. Tekst, pictogrammen en achtergrond van de kaart.|0 trekt omlaag, 90 naar links, 180 omhoog, 270 naar rechts.|0 stopt bij de botsing, 1 kaatst terug op volle snelheid.|0,1 s||||; {skipped} overgeslagen (niet voor dit doel of deze baan)|Een ingebakken lus houdt levensduren binnen één lus.|Een clip kan zijn eigen document niet afspelen (gebruik self).|Een SVG-bestand van de animatie dat zich herhaalt|Een SVG-bestand van de ingebakken deeltjes dat zich herhaalt|Een reeks kan zichzelf niet afspelen.|Een reeks duurt zo lang als haar stappen. Kaarten kunnen haar nog schalen met hun Duur.|Een reeks heeft minstens één stap nodig|Ongeveer {percent}% van de deeltjes|Een keyframe toevoegen op de afspeelkop|Een eigenschap toevoegen aan {target}|Voeg een vorm toe om vormen te mengen. Elke vorm krijgt een gewicht.|Een {name}-keyframe toevoegen op de afspeelkop|Toevoegen als vormen|Kleur toevoegen|Emitter toevoegen|Keyframe toevoegen|Bewegingspad toevoegen|Punt toevoegen|Eigenschap toevoegen|Eigenschap toevoegen aan {target} op de afspeelkop ({at})|Vorm toevoegen|Status toevoegen|Stap toevoegen|Voeg de animaties toe die na elkaar worden afgespeeld.|Voeg de tekening toe als vormen over het pictogram, of gebruik haar als het pictogram zelf.|Waardekoppeling toevoegen|{lane}-keyframe toevoegen|{name}-keyframe toevoegen op de afspeelkop|Voegt willekeurige wervelingen toe aan de beweging.|Alarmpaneel|Alle|Alle domeinen|Alle lagen getoond|Alle lagen getoond. Vergrendelingen blijven behouden.|Alle deeltjes|Staat al onderaan|Staat al bovenaan|Ook op {at}|Alt+pijl-omlaag|Alt+pijl-omhoog|Alt+omlaag|Alt+omhoog|Afwisselend|Afwisselend omgekeerd|Een open lijn wordt getekend met haar lijn.|Ankerpunten|Hoek|Hoek (gr.)|De onderdelen van een pictogram animeren|Geanimeerde SVG|Geanimeerde SVG gekopieerd|Animatie|Animatiekleur|Animatie-instellingen (Esc)|Animatiestudio|Een andere track animeert dit doel al.|Boog|Met de pijltjestoetsen verplaats je de cursor, Enter zet punten, Escape annuleert.|Pijltjes verplaatsen het keyframe, Alt en pijltjes gaan naar het volgende, Delete verwijdert het.|Aan het einde van de levensduur|Op de afspeelkop: {filter}|Op de afspeelkop: {text}|Op {at} · {secs} s|Attribuut|Attribuutnamen gebruiken letters, cijfers, _ . en - (geen spaties).|Attribuutnamen gebruiken letters, cijfers, _ . en -.|Achtergrond|Ingebakken lus|Bezig met inbakken…|Gebaseerd op een ingebouwde {kind}|Achter de inhoud|Tussen {min} en {max}; leeg gebruikt {intensity}. Timing en kleur komen uit de animatie-instellingen.|Binaire sensor|Koppeling toegevoegd: {property}.|Koppeling verwijderd.|Koppeling {n}|Zwart in een <img>, de tekstkleur inline.|Lege keyframes|Lege deeltjes|Leeg pad|Lege reeks|Vloeit van de eerste kleur naar de tweede.|Vervagen|Vervaging heeft een eigen baan en wordt aan deze lijst toegevoegd.|Onder|Linksonder|Rechtsonder|Stuiteren|Verhelderen|Naar voren halen|Over het pictogram halen|Vorm naar voren halen|Vorm over het pictogram halen|{name} naar voren halen|{name} over het pictogram halen|Browsers spelen de CSS-keyframes af.|Browsers spelen de CSS-keyframes af; de SMIL-kopie speelt waar CSS-animatie ontbreekt.|Bouw er een vanaf nul of pas een van de voorinstellingen aan. Opgeslagen animaties staan in de animatiekiezer van elke kaart, onder Mijn animaties.|Uitbarsting|Knop|Agenda||Annuleren|Kan niet afspelen|Kaart|Kaart-YAML gekopieerd: plak hem in een module|Kaart-YAML om te kopiëren|Kaartinhoud|Kaartinhoud. Tekst, pictogrammen en achtergrond van de kaart.|Kaartonderdelen|Kaartthema|Kaarten die hem gebruiken, spelen hem niet meer af, tenzij ze een kopie insluiten.|Kaarten gebruiken hem als|Plafond|Midden|Aantal wijzigen|Vulling wijzigen|Puntsoort wijzigen|Snelheid wijzigen|Spreiding wijzigen|Lijn wijzigen|Gewicht wijzigen|Wijzigt ook de laatste lijn. De stippellijn is wat je tekende.|Kleur van kind|Kinddeeltjes|Kinddeeltjes van {name}|Kindvorm|Kinderen barsten uit vanaf het punt waar ze ontstaan.|Kinderen kunnen geen eigen kinderen hebben.|Kies een voorinstelling|Kies een .svg-bestand.|Kies een andere|Bestand kiezen|Cirkel|Pad wissen|Zoekopdracht wissen|Klik op een onderdeel om het op de tijdlijn te animeren. Shift of Ctrl voegt toe aan de selectie; dubbelklik of F2 hernoemt. H verbergt, S solo, L vergrendelt (alleen voorbeeld).|Klik op een vorm om hem te selecteren, sleep om hem te verplaatsen.|Klik of sleep over vormen om ze te verwijderen.|Klik op het canvas om een punt toe te voegen, klik op de lijn om er een in te voegen.|Klik om punten toe te voegen, sleep voor bochten. Klik op het eerste punt om te sluiten, of kies Pad afronden.|Klik om het volgende punt toe te voegen|Klik om het eerste punt te plaatsen|Klimaat|Sluiten|Pad sluiten|Gesloten|Gesloten pad|Samenvoegen|{name} inklappen|Botsen met|Botsingen|Kleur|Kleurmenging|Kleur {i}|Kleur {n}|Kleur {n}: entiteitskleur|Kleur {n}: {colour}|Kleur: currentColor|Kleuren|Veelgebruikte emoji|Klaar op|Bevat een link.|Bevat een element dat iets uitvoert of ophaalt.|Bevat een gebeurtenis-handler.|Bevat een externe verwijzing.|Inhoudsvak|Zet het voorinstel om naar eigen deeltjes om het te exporteren.|Omzetten naar eigen deeltjes|Kopieert pictogram: svg en de SVG als kaart-YAML|Kopiëren|Kopiëren (Ctrl+C)|SVG kopiëren|Kopiëren mislukt: selecteer de tekst hieronder en kopieer hem|Keyframes kopiëren|Kopieer eerst keyframes|Hoekstraal|Hoekradius (pictogrameenheden)|De tekengereedschappen konden niet worden geladen.|Aantal|Aantal per keer|Bedekkend|Overvloeien|Ctrl + scrollwiel zoomt|||Cursor op x {x}, y {y}. Druk op Enter om een punt toe te voegen.|Cursor op x {x}, y {y}. Druk op Enter om af te ronden.|Cursor op x {x}, y {y}. Druk op Enter om te beginnen.|Gebogen|Aangepast|Eigen as ({axis})|Eigen curve|Eigen status|Een voorinstelling aanpassen|Een voorinstelling aanpassen…|Een van de {count} aanpassen|Knippen|Cyclus|Donkere kaart|Standaard|Standaard ({inherited})|Vertraging|Vertraging tussen kinderen|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf ({seconds} s).|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf.|Verwijderen|"{name}" verwijderen?|Verwijderen (Del)|Koppeling verwijderen|Koppeling {n} verwijderen|Handvat verwijderen|Keyframe verwijderen|Keyframes verwijderen|Punt verwijderen|Punten verwijderen|Vorm verwijderen|Status verwijderen|Status {i} verwijderen|Stap verwijderen|Stap {i} verwijderen|{name} verwijderen|"{name}" verwijderd.|Verwijderen mislukt: {message}||Apparaattracker|Richting|Verwerpen|Domein|Deurbel|Stip|Dubbelklik op een punt om het glad of een hoekpunt te maken.|.svg downloaden|Download gestart|Slepen|Sleep een ervan op de tijdlijn, of gebruik de pijltjestoetsen, om ze samen te verplaatsen.|Sleep punten en handvatten.|Sleep om een lijn te tekenen.|Sleep om te tekenen. Shift: cirkel, Alt: vanuit het midden.|Sleep om te tekenen. Shift: vierkant, Alt: vanuit het midden.|Sleep om te verplaatsen (klikt vast; Shift: vrij, Alt: dupliceren). Ctrl-klik voegt een key toe, Shift-klik selecteert een bereik. Pijltjes verplaatsen, Alt en pijltjes gaan naar de volgende key, Delete verwijdert.|Sleep om te herschikken (Alt+omhoog / Alt+omlaag)|Sleep om het canvas te vergroten of verkleinen (dubbelklik: herstellen)|Sleep, of druk op Alt+omhoog of Alt+omlaag, om de stap te verplaatsen.|Tekenen|Teken vrij; de lijn wordt gladgestreken als je loslaat.|Bewegingspad tekenen|Tekenen uit|Tekenen aan|Teken op het canvas waar de vorm langs gaat, beginnend waar hij rust.|Teken het pad dat het geselecteerde onderdeel volgt, beginnend waar het rust.|Tekenen is alleen voor pictogramonderdelen en vormen.|Tekening|Tekenen geannuleerd.|Tekengereedschap|Getekend|Tekent de lijn bij (een batterij of niveau).||Stuur {name} aan met de waarde van de entiteit: draaisnelheid vanuit het percentage van een ventilator, een vulling vanuit een batterijniveau.|Zet hier een .svg-bestand neer|Slagschaduw|Laat de .svg los om te importeren|Dupliceren|Emitter dupliceren|Dubbele id "{id}".|{count, plural, one {Keyframe} other {Keyframes}} dupliceren|{name} dupliceren|Gedupliceerd als "{name}".|Dupliceren mislukt: {message}|Duur|Elk deeltje kiest een snelheid in dit bereik, gemeten in % van de kortste zijde van de kaart per seconde. Bij 100 steekt een deeltje een vierkante kaart in één seconde over.|Elk deeltje draait de kant die het kiest, naar links of rechts.|Versnelling|Versoepeling naar het volgende keyframe|Versoepelingswaarde|De versoepeling van het keyframe bewerken|Effectvoorinstellingen kunnen niet als status afspelen: speelt niets.|Effecten met een eigen laag kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.||Ellips|Naam van emitter|||Emoji of symbool|Leeg keyframe|Leeg leest de status. Bijvoorbeeld percentage (ventilator) of helderheid (lamp).|Eindhandvat|Solo beëindigen|Voer een emoji of symbool in.|Entiteitskleur|Entiteit is uit|Entiteit is aan|Entiteitswaarde|Wissen|Gebeurtenis|Uitvouwen|{name} uitklappen|Ontploffen en vallen|Exporteren|Alles exporteren|Animaties exporteren|{name} exporteren|In- en uitfaden|Uitfaden en weer infaden (0,2 s)|Fadet in met de waarde.|Vallen|Ventilator|Acht|Vullen|Vulkleur||Voorinstellingen filteren|Cyclus afmaken|Pad afronden|Vuurvliegjes|Cyclus passend maken|De hele cyclus passend maken|Herstel eerst de gemarkeerde velden.|Plat|Plat (Z)|Omslaan (X)|Zijwaarts kantelen (Y)|Vloer|Stroom|Een getekend pad volgen|Een pad volgen|Rotatie volgen|Het pad volgen|Eén naar voren|Fontein|Uit de vrije hand|Van|Van een voorinstelling|Van kleur|Van{unit}|Voordeur|Gloed|Begrepen|Zwaartekracht|Richting van de zwaartekracht|Zwaartekracht {strength} {direction}|Grijstinten|Raster|Groep|Draaipunt van groep|Groeit met de waarde.|Bevat fouten|Hart|Verbergen en solo zijn niet beschikbaar: het deeltjesvoorbeeld kon niet worden opgebouwd.|Verbergen in voorbeeld|Verbergen in voorbeeld (niet opgeslagen)|Verbergen in voorbeeld: de laag blijft op zijn normale waarde|Verberg {noun} ({keys})|Verbergen, solo en vergrendelen werken alleen in dit voorbeeld.|Hoogste {noun}|Tintverschuiving|Luchtbevochtiger|Pictogram|Pictogram- en emoji-deeltjes worden als stippen geëxporteerd.|Pictogramanimatie|Pictogramanimatie…|Pictogram beweegt alleen het pictogram van de module. Kaarten kunnen het overschrijven.|Pictogramonderdelen|Pictogramonderdelen op het canvas|Pictogram om te splitsen|Pictogram {percent}%|Pictogrammen, emoji of vormen die vallen, stijgen of uitbarsten|Importeren|SVG importeren|Animaties importeren|{count, plural, one {# animatie} other {# animaties}} geïmporteerd.|Voor de inhoud|Ervoor: deeltjes worden over tekst en pictogrammen getekend. Ze blokkeren nooit klikken.|In-uit|Oneindig|Inspecteur|Inspectorpaneel|Wordt gebruikt door {count, plural, one {# kaart} other {# kaarten}}; die spelen hem niet meer af, tenzij ze een kopie insluiten.|Draait mee met de richting waarin het beweegt.|Verder bewerken||Keyframe-inspecteur|Keyframe-tijdlijn|Keyframe-gereedschap|||Soort|Grootste|Grootste afmeting|Grasmaaier|Laag|Laagacties|Laagacties, {name}|Laagnaam|Lagen|Lagen verborgen in het voorbeeld|Lagenpaneel|Links|Linkerrand|Laat eerst de huidige cyclus eindigen|Bibliotheek|Levensduur (s)|Optillen|Licht|Lichte kaart|Lijn|Lijneinden|Live simulatie|Live simulatie wordt als zijn ingebakken lus geëxporteerd.|Live simulatie draait op elk dashboard dat deze kaart toont en gebruikt meer processor, vooral op wandtablets. De export als geanimeerde SVG speelt in plaats daarvan de ingebakken lus af.|Woonkamer|Pictogrambibliotheek laden…|De {kind}-editor laden…|Laden…|Vergrendelen|Vergrendeld|Vergrendeld. Ontgrendel om te bewerken.|Uiterlijk|Herhalen|Lus uit|Lus aan|Lussnelheid (×)|Lussen|Laagste {noun}|Magic Card is niet geladen op deze pagina||Maximaliseren|Mediaspeler|Onderdelen samenvoegen||Min en max moeten verschillen.|Min mag niet boven max liggen.|Gemengd|Modus|Meer voorinstellingen konden niet laden. De ingebouwde voorinstellingen werken nog.|Meer afvlakken: minder punten en een rustiger lijn.|Meer afvlakken: minder punten en een rustiger lijn. De stippellijn is wat je tekende.|Beweging|Bewegingspad|Bewegingspad. Klik om punten toe te voegen, sleep om ze te verplaatsen.|Bewegingspad: selecteer eerst een onderdeel of vorm|Beweging verwijderd|X verplaatsen|Y verplaatsen|Ga eerst weg van het beginpunt.|Omlaag|Omlaag verplaatsen (eronder getekend)|Omlaag verplaatsen (speelt later)|Emitter achter de inhoud zetten|Emitter omlaag verplaatsen|Emitter voor de inhoud zetten|Emitter omhoog verplaatsen|Handvat verplaatsen|Keyframe verplaatsen|Pad verplaatsen|Padpunt verplaatsen|Draaipunt verplaatsen|Punt verplaatsen|Punten verplaatsen|Status {i} omlaag verplaatsen|Status {i} omhoog verplaatsen|Stap verplaatsen|Stap {i} verplaatsen|Verplaats in plaats daarvan het element|Verplaats in plaats daarvan het pictogram|Omhoog|Omhoog verplaatsen (bovenop getekend)|Omhoog verplaatsen (speelt eerder)|Venster verplaatsen|{count, plural, one {Keyframe} other {Keyframes}} verplaatsen|{name} omlaag verplaatsen|{name} omlaag verplaatsen (eronder getekend)|{name} omlaag verplaatsen (speelt later)|{name} omhoog verplaatsen (bovenop getekend)|{name} omhoog verplaatsen (speelt eerder)|{name} {where} verplaatsen|{where} verplaatsen|Verplaats, schaal, draai en kleur op een tijdlijn|Omlaag verplaatst: eronder getekend|Omhoog verplaatst: bovenop getekend|Beweging|Bewegingen|Beweegt mee met: {subject}|Beweegt zijwaarts.|Beweegt het onderdeel langs een curve, vanaf zijn rustpositie. Sleep de punten op het canvas.|Beweegt omhoog of omlaag.|{target} verplaatsen.|Moet 1-16 tekens uit a-z, 0-9 en - zijn, en uniek.|Moet SVG-opmaak zijn.|Moet [min, max] px zijn tussen 1 en 200, min ≤ max.|Moet [min, max] zijn.|Moet een lijst zijn.|Moet een bewegingsvoorinstelling of een eigen keyframes- of padanimatie zijn.|Moet een getal zijn.|Moet een paar [van, naar] zijn.|Moet een deeltjes-, ring- of scènevoorinstelling zijn.|Moet een status (tekst) zijn.|Moet een subpad-index zijn (een geheel getal vanaf 0).|Moet een geheel getal zijn.|Moet een attribuutnaam zijn.|Moet een pictogram-id zijn zoals mdi:bell.|Moet een pictogram-id zijn zoals mdi:star.|Moet een object zijn.|Moet tussen 0 en 100% liggen.|Moet tussen {min} en {max} {unit} liggen.|Moet tussen {min} en {max} liggen.|Moet element, icon, name, state, background, part:<id>, group:<id> of shape:<id> zijn.|Moet een van deze zijn: {options}.|Moet self, none, een voorinstelling of custom:<id> zijn.|Moet tekst van hooguit 40 tekens zijn.|Moet tekst zijn.|Moet drie getallen [x, y, z] zijn, niet allemaal 0.|Moet waar of onwaar zijn.|Moet twee getallen zijn (kleuren alleen voor color_mix).|Moet twee getallen [x, y] zijn.|Moet hooguit 8 tekens zijn (een emoji of een symbool).|Moet afwijken van min.|Mijn animaties|Naam|Naam van {name}|Heeft minstens één item nodig.|Heeft minstens {min} items nodig.|Negatief blaast de regen naar links, positief naar rechts. Het bepaalt de richting van de zwaartekracht.|Nieuw|Nieuwe animatie|Nieuwe keyframes|Nieuwe deeltjes|Nieuw pad|Nieuwe reeks|Nieuwe vormen|Volgend keyframe|Geen <svg>-element gevonden.|Geen animatie|Geen animatie komt overeen met “{query}”.|Geen animaties gevonden.|Geen animaties komen overeen met "{query}".|Geen animaties komen overeen.|Nog geen animaties|Geen kleuren: deeltjes gebruiken de animatiekleur.|Geen vrije deeltjes meer. Verlaag een aantal om een emitter toe te voegen.|Geen zwaartekracht|Geen pictogramanimaties komen overeen met "{query}".|Nog geen keyframes: gebruik Eigenschap toevoegen, of dubbelklik op de baan.|Nog geen keys. Voeg keys toe op de tijdlijn om dit onderdeel te draaien, verplaatsen, schalen, te laten vervagen of te kleuren.|Nog geen bewegingspad. Teken er een op het canvas.|Geen voorinstellingen komen overeen met "{query}".|Nog geen eigenschappen geanimeerd. Gebruik Eigenschap toevoegen, of dubbelklik op een baan.|Nog geen vormen: kies een tekengereedschap.|Nog geen stappen|Nog geen stappen. Voeg een clip toe om de reeks te beginnen.|Geen {kind} "{id}" in de rig.|Geen|Niet ingesteld: de deeltjes nemen de animatiekleur.|Normaal|Geen onderdeel van deze rig.|Geen tijdlijnbaan.|Geen geldige animatie-id.|Geen geldige kleur.|Geen geldige versoepeling.|Geen toegestane schaduw: x y vervaging spreiding kleur.|Geen toegestane {kind}-waarde.|Niet gewijzigd: {big}|Niet gevonden|Niet gevonden in Mijn animaties. Deze stap wordt overgeslagen.|Niet geïmporteerd: {list}.|Niet in je animaties: speelt niets tot hij daar is opgeslagen.|Niet op deze tegel|Niet hernoemd: {message}|Niet te serialiseren.|Niet gebruikt|Geen geldige YAML.|Geen geldige paddata (moet met M beginnen).|Niets|Niets (stoppen)|Er wordt niets getekend.|Niets geplakt: die eigenschappen passen hier niet|Er speelt nog niets.|Er is nog niets om te exporteren.|Hier valt nog niets in te stellen.|Getal|Uit|Aan|Bij botsing|Aan betekent actief voor het domein (open, thuis, speelt...).|Eén klik animeert de selectie; stem de keys af op de tijdlijn.||Onion skin: markeer de keyframes rond de afspeelkop|Alleen voor het activeringsmoment.|Alleen keyframe-animaties exporteren als geanimeerde SVG.|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe (de animatieversoepeling).|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe.|Dekking|Dekking (%)|Openen|Open een deeltjesanimatie om de deeltjes te ontwerpen.|Pad openen|Of begin met de pictogrambibliotheek|Baan|Oorsprong|Uitvoer|Over het pictogram|Eigen SVG|Eigen kinderkleur|Eigen tijdlijn|Verf|Onderdeel|Onderdeelacties|Draaipunt van onderdeel|Onderdeelvoorinstellingen|Onderdeel {i}|Onderdeel {n}|Deeltjes- en reeksanimaties kunnen niet als status afspelen.|Deeltjespictogram|Deeltjeslagen|Deeltjesvoorinstelling|Deeltjessnelheid (% van korte zijde/s)|Deeltjes|Deeltjes langs een pad kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Deeltjes verschijnen en verdwijnen zacht.|Deeltjes spelen op het hele element.|Deeltjes nemen om beurten de kleuren. Kies er een om hem te wijzigen.|Deeltjes volgen het pad na elkaar, over het hele element.|Deeltjes {n}|Onderdelen samengevoegd|Plakken op de afspeelkop in {target} (Ctrl+V)|Keyframes plakken op de afspeelkop|Plak eerst YAML of laad het.|Plak de opmaak van een <svg>.|Pad|Padlagen|Padlagen (geen stapelvolgorde)|Alleen paden en vormen: scripts, stijlen en links worden verwijderd. De vorm wordt gevuld met de deeltjeskleur.|Pauzeren (spatie)|Voorbeeld pauzeren||Pen. Klik om punten toe te voegen, klik op het eerste punt om te sluiten.|Persoon|Fysica|Kies een animatie voor deze stap.|Kies een pictogram, of typ een id zoals mdi:bell-ring.|Draaipunt|Draaipunt van {name}|Draaipunt op het vak van de groep|Draaipunt op het vak van het onderdeel|Draaipunt: {position}||Plaatsing||Afspelen|Afspelen (spatie)|Animaties na elkaar afspelen|Speel de kolommen van een rij of de modules van een kolom na elkaar af.|Afspeelvolgorde|Voorbeeld afspelen|Speel per status van de entiteit iets anders af: een lamp die gloeit als hij aan is en rust als hij uit is. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Afspelen|Afspeelsnelheid|Afspeelkop|Speelt|Speelt bij tikken|Speelt deze animatie sneller of langzamer af.|Punt {count} geplaatst. Nogmaals Enter op dezelfde plek rondt de lijn af.|Punten staan in % van het bewegende element, dus het pad schaalt mee.|Punten staan in pixels, bij elke grootte hetzelfde.|Punten springen naar nabije punten van het pictogram en andere vormen.|Punten komen op hele pictogrameenheden. Houd Shift ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 10 px. Houd {key} ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 5%. Houd {key} ingedrukt om vrij te plaatsen.|Positie|Positie in de cyclus|Voorinstelling|Draaipunt van voorinstelling|Draaipunt van voorinstelling van {name}|Voorbeeld|Voorbeeldentiteit|Voorbeeld verbergt {count, plural, one {# laag} other {# lagen}}|Voorbeeldstatus|Voorbeeldtegel|Voorbeeldwaarde|Voorbeeld met verminderde beweging|Vorig keyframe|Eigenschap|Eigenschapskeys krijgen hun eigen versoepeling; hele keyframes bepalen de versoepeling van het keyframe.|Straal|Regen|Rechthoek|Opnieuw (Ctrl+Y)|Opnieuw tekenen|Verminderde beweging|Verminderde beweging staat aan, dus het voorbeeld blijft stil.|Pagina opnieuw laden|Door de pagina te herladen gaan wijzigingen verloren die niet zijn opgeslagen. Toch herladen?|Verwijderen|Kleur verwijderen|Kleur {i} verwijderen|Kleur {n} verwijderen|Intekenen verwijderen|Emitter verwijderen|Vulling verwijderen|Uit dit keyframe verwijderen|Beweging verwijderen|Bewegingspad verwijderen|Vorm verwijderen|Vorm {n} verwijderen|Lijn verwijderen|De animatie van dit onderdeel verwijderen|{name} uit dit keyframe verwijderen|Hernoemen|Groep hernoemen|Onderdeel hernoemen|{name} hernoemen|Hernoemd|Hernoemd naar "{clean}".|Hernoemen mislukt: {message}|Herhalen|Aantal herhalingen|Het pad vervangen door een {name}|Vervangen door…|Verplicht.|Draaipunt herstellen|Herstellen naar draaipunt van groep|Herstellen naar draaipunt van onderdeel|Venstergrootte wijzigen|Oorspronkelijke grootte|Niet-opgeslagen wijzigingen herstellen|Niet-opgeslagen wijzigingen herstellen?|Omgekeerd|Richting omkeren|Rechts|Rechterrand||Ringvoorinstelling|Stijgen|Draaien|Rotatie|Draaisnelheid|Rond|Liniaal in procenten van de cyclus of in seconden|Liniaal in procenten; toon seconden|Liniaal in seconden; toon procenten|SMIL-terugval||SVG gekopieerd|SVG-vorm|SVG om te kopiëren|Opslaan|Opslaan (Ctrl+S)|Opslaan als geanimeerde SVG|Opslaan als pictogram|Je wijzigingen opslaan?|"{name}" opgeslagen.|Opslaan mislukt.|Opslaan…|Schaal|Schaal X|Schaal Y|Scènevoorinstelling|Schema|Animaties zoeken|Pictogrammen zoeken|Voorinstellingen zoeken|De pictogrambibliotheek doorzoeken|Seizoensscène|Seconden|Startwaarde|Seed {seed} · draai {span}|Kiezen|Selecteer eerst een onderdeel of vorm.|Selecteer een onderdeel of vorm en teken dan zijn bewegingspad.|Alle {name}-keyframes selecteren (Shift voegt toe)|Selecteer twee of meer onderdelen om ze te groeperen.|Naar achteren sturen|Vorm naar achteren sturen|Vorm onder het pictogram sturen|Onder het pictogram sturen|{name} naar achteren sturen|{name} onder het pictogram sturen||Reeks|Reeksstappen|Reeksstappen (speelt van eerste naar laatste)|Reeksen die hem afspelen, slaan die stap over: {names}.|Stel icon of svg in, niet beide.|Stel een van builtin, icon, emoji of svg in.|Stel een van from of svg in.|Stel een van icon, emoji of svg in.|Stel een van state, state_not, entity_on, above of below in.|Schaduw|Schaduw en gloed|Schaduwkleur|Schaduwvoorinstellingen|Schaduw {name}|Vorm|Vormmix|Vorm over het pictogram|Punten van de vorm. Sleep een punt om het te verplaatsen.|Vorm onder het pictogram|Vorm {n}|Vorm {n}: {shape}|Vorm {n}: {shape}, gewicht {weight}|Vormen over het pictogram|Vormen onder het pictogram|Sneltoets: {keys}|Alles tonen|Alle verborgen lagen tonen|Tonen in voorbeeld|Toon {noun} ({keys})|Willekeurig|Willekeurig: nieuwe willekeurige paden|Simulatie|Sirene|Grootte|Grootte (px)|Scheeftrekken|Scheeftrekken X|Scheeftrekken Y|Vertraagt deeltjes in de loop van de tijd.|Kleinste|Kleinste afmeting|Vloeiend|Alles afvlakken|Afvlakking|Afvlakking (s)|Magnetisch raster|Vastklikken op keyframes, de afspeelkop en het raster (houd Shift ingedrukt om vrij te slepen)|Vastklikken|Solo in voorbeeld|Solo in voorbeeld (verbergt de rest, niet opgeslagen)|Solo aan|Een paar panelen zijn verborgen, zoals je ze had achtergelaten. Gebruik de pijlen aan de randen om ze te tonen.|Gelijkmatig verdeeld langs het pad, 1 tot {particles}.|Vonk|Ontstaan|Kinddeeltjes laten ontstaan|Ontstaat {seconds} s na de geboorte (in te stellen in YAML).|Snelheid|Snelheid (% van korte zijde/s)|Draaiing per lus (gr.)|Draait continu, sneller naarmate de waarde stijgt (een ventilator).|Spiraal|Opnieuw splitsen|Splitsen en beginnen|Terug splitsen in vormen|Pictogram splitsen|Splits het pictogram om zijn vormen een voor een te animeren: de klepel van een bel, de bladen van een ventilator.|Opnieuw splitsen vervangt de onderdelen, hun groepen en hun keys.|Bezig met splitsen…|Spreiding|Verspreid over|Verspreid omlaag|Vierkant|Hoogte van het canvas|Kinderen gespreid|Spreiding uit|Spreiding aan|Ster|Begin|Begin opnieuw na de laatste stap.|Startvertraging (s)|Beginnen met een sjabloon|Beginnen met een pictogram|Beginhandvat|Begonnen bij x {x}, y {y}. Verplaats de cursor en druk op Enter om af te ronden. Escape annuleert.|Begint op|Status|Status is|Status is niet|Status is niet {state_not}|Status is {state}|Status verplaatst naar positie {to}.|Status {count} toegevoegd: {when}.|Status {i}|Status {i} verwijderd.|Statussen|Statussen (clips) worden niet geëxporteerd: het bestand speelt de eigen tijdlijn van de animatie.|Stapanimatie|Stap verplaatst naar positie {to} van {count}.|Stap verplaatst naar positie {to} van {n}.|Stap {count} toegevoegd: {name}.|Stap {index} verwijderd.|Stap {index} wordt overgeslagen|Stap {index}: {from} tot {to}|Stap {i}|Stap {i} is vergrendeld. Ontgrendel hem in Lagen.|Stappen|Stappen springen tussen waarden; er is geen curve om te bewerken.|Stoppen met tekenen|Recht|Alles recht maken|Streep|Lijn|Lijnkleur|Lijndikte (pictogrameenheden)|Zon|Vervangt het voorinstel door je eigen deeltjes: vorm, beweging, grootte en kleuren worden bewerkbaar.|Wervel|Schakelaar|Direct wisselen|Tikken|Doel|Tekst|Tekst- en pictogramkleur|Die animatie heeft eigen statussen: de kaart slaat deze status over.|Die laag is vergrendeld. Ontgrendel hem in Lagen.|De SMIL-terugval speelt de animatie alleen vooruit af.|De SVG tekent niets.|De SVG heeft geen vormen om te tekenen.|De SVG is groter dan 32 KB.|De SVG is te complex.|De YAML is te groot om te importeren (meer dan 1 MB).|De animatie is groter dan {size} KB.|De animatie is niet geldig: {message}|De animatiebibliotheek is niet verbonden.|De animatie zou groter worden dan {max} KB ({size} KB).|De versoepeling van de animatie ({easingLabel})|De keyframes van de animatie verplaatsen het element.|De keyframes van de animatie verplaatsen het pictogram.|De keyframes van de animatie verplaatsen het pictogram van de module.|De keyframes van de animatie verplaatsen het hele element.|Het vak van het pictogram of van de tekst van de kaart.|De kleur is geen geldige CSS-kleur: het bestand gebruikt currentColor.|De tekengereedschappen zijn nog niet geladen.|De tekengereedschappen zijn klaar.|De tekengereedschappen op deze pagina komen uit een andere versie van Magic Card. Laad de pagina opnieuw om hier te tekenen.|De entiteitskleurknop gebruikt de animatiekleur (de kleur van het kaartitem, anders die van de entiteit).|De waarde van de entiteit stuurt {name} aan. Bekijk het met de waardeschuif op het canvas.|Het bestand kon niet worden gelezen.|Het bestand is {size} KB, groter dan 256 KB.|Het bestand loopt in een lus: het aantal herhalingen wordt niet geëxporteerd.|De eerste status die past, speelt; zonder match (of bij een niet-beschikbare entiteit) speelt de eigen tijdlijn. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Het pictogram in rust, zonder animatie. Id\'s blijven op elk onderdeel en elke vorm staan.|Het pictogram heeft geen vormen om te exporteren.|Het pictogram heeft {count, plural, one {# vorm} other {# vormen}}: {parts, plural, one {het eerste werd een onderdeel} other {de eerste # werden onderdelen}} (het meeste wat een rig aankan), de rest blijft in rust.|Het pictogram is gesplitst in zijn onderdelen. Selecteer een onderdeel en geef het een voorinstelling: slingeren, draaien, intekenen en meer.|De pictogrambibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|Het import- en exportgereedschap kon niet worden geladen. Laad de pagina opnieuw en probeer het nog eens.|Het paneel lagen is verborgen, zoals je het eerder had ingeklapt. Gebruik de pijl aan de rand om het te tonen.|De bibliotheek bevat hooguit {cap, plural, one {# animatie} other {# animaties}}: {fit, plural, one {er past nog maar #} other {er passen nog maar #}}, {skipped, plural, one {# is} other {# zijn}} niet geïmporteerd.|De lijn wordt in de loop van de cyclus ingetekend.|Het uiterlijk verandert een beetje.|De lus haalde de groottelimiet, dus het bestand toont minder deeltjes.|Het pictogram van de module beweegt langs het pad.|De beweging loopt langs het pad terug naar het begin.|De nieuwe animatie "{name}" is de vorige keer niet opgeslagen.|De omtrek wordt in de loop van de cyclus ingetekend, daarna wordt de vorm gevuld.|De omtrek wordt gevolgd, daarna wordt het onderdeel gevuld.|De deeltjesengine is nog niet geladen.|De onderdelen komen uit de eigen SVG van het document, een onderdeel per vorm.|Het pad tekent niets.|Het pad heeft het maximale aantal punten.|Het punt waaromheen het schaalt en draait.|Het punt waaromheen de groep draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het onderdeel draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het voorinstel deze groep draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van de groep. Sleep het op het canvas.|Het punt waaromheen het voorinstel dit onderdeel draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van het onderdeel. Sleep het op het canvas.|Het voorinstel wordt je eigen animatie om te bewerken: bewegingsvoorinstellingen als keyframes, deeltjes- en ringvoorinstellingen met hun instellingen.|Het voorbeeld is geschaald om op het canvas te passen|Het voorbeeld speelt op een echte magic-card. Laad magic-card.js (je dashboardbron) vóór de animatiestudio.|De rig bevat het maximale aantal vormen (48).|Dezelfde seed geeft elke keer dezelfde lus.|De geselecteerde keyframes gebruiken verschillende versoepelingen; een keuze hier stelt ze allemaal in.|De vorm als masker|De vorm draait mee met de richting waarin hij beweegt.|De studio berekent het pad van elk deeltje eenmaal en speelt het af als lus. Licht voor dashboards.|De tijdlijn animeert hier ook het intekenen: terwijl hij speelt, gaat hij voor deze koppeling.|De tijdlijn animeert hier ook de dekking: terwijl hij speelt, gaat zijn dekking voor deze koppeling.|De tijdlijn animeert deze kleur ook: terwijl hij speelt, gaat zijn kleur voor deze koppeling.|De tijdlijn trekt dit doel scheef: terwijl hij speelt, vervangt het scheeftrekken de beweging van deze koppeling.|Het hele element beweegt langs het pad vanaf waar het rust.|Het paneel {noun} is verborgen, zoals je het had achtergelaten. Gebruik de pijl aan de rand om het te tonen.|Deze gelden voor elke emitter. Plaatsing wordt per emitter ingesteld.|Ze vervangen het uiterlijk van het voorinstel.|Deze animatie|Deze animatie heeft al 24 geanimeerde doelen: verwijder er een om een voorinstelling toe te voegen.|Deze kaart speelt engine {engine}; werk Magic Card bij om deze animatie af te spelen.|Dit pictogram kon niet worden geladen. Controleer de pictogram-id, of probeer het opnieuw als Home Assistant bereikbaar is.|Dit pictogram heeft geen vormen om te animeren.|Dit pictogram heeft geen vormen om te splitsen.|Dit is de laatste key van de baan: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit is het laatste keyframe: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit keyframe stelt geen eigenschap in. Voeg er een toe met Eigenschap toevoegen.|Deze lus haalde de groottelimiet, dus hij toont minder deeltjes. Verlaag het aantal of de kinddeeltjes.|Deze lus is groot en laadt daarom trager op wandtablets. Verlaag het aantal of de kinddeeltjes.|Dit onderdeel heeft eigen intekenkeys op de tijdlijn.|Deze voorinstelling kon niet worden geopend: {message}|Deze voorinstelling is niet beschikbaar in deze versie van Magic Card.|Tijdlijn|Tijdlijnweergave|||Tot|Naar kleur|Gereedschap: {tool}|Boven|Linksboven|Rechtsboven|Naar{unit}|Tracks (gecombineerd, geen volgorde)|Tracks van kaartonderdelen (naam, status, achtergrond) worden niet geëxporteerd.|Overgang|Driehoek|Bijgesneden|Opnieuw proberen|Turbulentie|Draaien|Botser uitzetten|Botser aanzetten|Vervagen uitzetten|Vervagen aanzetten|Zet eerst een botser aan.|Draai het onderwerp in de reisrichting.|Meedraaien met het pad|Draait naar een hoek (een naald of een wijzerplaat).|Niet beschikbaar|Onder het pictogram|Ongedaan maken (Ctrl+Z)|Onverwacht element <{element}>.|Groep opheffen|Eenheden|Onbekende voorinstelling|Onbekende voorinstelling. Deze stap wordt overgeslagen.|Onbekende voorinstelling: speelt niets.|Ontgrendelen|Ontgrendeld|Niet-opgeslagen wijzigingen|Niet-ondersteunde versie (verwacht 1).|Naamloze animatie|Tot {parentsLeft} voor deze emitter. Alle emitters delen {parents} deeltjes.|Gebruik 1-32 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik 1-64 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik Eigen tijdlijn om deze animatie af te spelen.|Gebruik een kleur of een kleurverloop.|Gebruik een voorinstellingsnaam, cubic-bezier(x1, y1, x2, y2) of steps(n).|Gebruik een pictogram-id zoals mdi:bell-ring.|Gebruiken als pictogram|Ingebakken lus gebruiken|currentColor gebruiken|Gebruik filterfuncties zoals brightness(1.2) hue-rotate(30deg); url() is niet toegestaan.|Gebruiken in kaart|Gebruik trefwoorden, lengtes of percentages, bijv. "50% 100%".|Live simulatie gebruiken|De kleuren van de ouder gebruiken|Gebruik hooguit 8 tekens.|{emoji} gebruiken|Gebruikt door {count, plural, one {# kaart} other {# kaarten}}|Stofzuiger|Waarde|Waarde boven|Waarde boven {above}|Waarde onder|Waarde onder {below}|Waardekoppelingen|Waardekoppelingen worden niet geëxporteerd: het bestand speelt af op de getekende waarden.|Klep|Variatie|Golf|Weer|Gewicht|Wat beweegt|Wat opslaan|Wanneer|Heel keyframe|Windhoek (gr.)|Bij verminderde beweging toont de kaart zijn stilstaande staat: deze animatie speelt niet.|||||Inzoomen|Inzoomen (Ctrl +)|Uitzoomen|Uitzoomen (Ctrl -)|Ingezoomd op het pictogram terwijl je zijn onderdelen bewerkt of tekent|na {seconds}|na {seconds} s|geanimeerd|aan het einde van de levensduur|op {angle}°|achter de inhoud|kindgrootte|kindsnelheid|color_mix heeft twee kleuren nodig.||omlaag|linksonder|rechtsonder|sleep {value}|tekengebied|tekent in||verborgen omdat een andere laag solo staat|verborgen omdat {name} verborgen is|verborgen in het voorbeeld|voor de inhoud|||keyframe-track|keyframe-tracks van {name}|lagen|links|levensduur||vergrendeld|vergrendeld omdat de laag waartoe hij behoort vergrendeld is|lussen|mijn animaties|niet op de tegel {tile}|ongeldig|aan|bij botsing|dekking|over het pictogram|speelt eenmaal|rechts|geselecteerd|snelheid|draaiing|startvertraging|status|stap {i} van {count}|stap {i} van {count}, {problem}|de achtergrond|het element|het pictogram|de naam|de status|turbulentie {value}|onder het pictogram|eenheden|onbekende fout|omhoog|linksboven|rechtsboven|{animation} (onbekend)|{below} verborgen|{below} hieronder verborgen|{cLIPS_MAX, plural, one {Hooguit # status.} other {Hooguit # statussen.}}|{cap, plural, one {De bibliotheek is vol (# animatie): er is niets geïmporteerd.} other {De bibliotheek is vol (# animaties): er is niets geïmporteerd.}}|{colours, plural, one {Hooguit # kleur} other {Hooguit # kleuren}}|{count, plural, one {# stip} other {# stippen}}|{count, plural, one {# pictogram} other {# pictogrammen}}||{count, plural, one {# keyframe} other {# keyframes}} gekopieerd|{count, plural, one {# keyframe} other {# keyframes}} verwijderd|{count, plural, one {# keyframe} other {# keyframes}} geplakt op {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} geselecteerd.||{count, plural, one {# key} other {# keys}} op de tijdlijn. Draai, verplaats, schaal, fade en kleur dit onderdeel daar.|{count, plural, one {# deeltje} other {# deeltjes}} · {flow}|{count, plural, one {# onderdeel} other {# onderdelen}}|{count, plural, one {# punt} other {# punten}}|{count, plural, one {# vorm} other {# vormen}}|{count, plural, one {# vorm} other {# vormen}}, geschaald in het pictogram|{count, plural, one {# stap} other {# stappen}}|{count, plural, one {# doel geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).} other {# doelen geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).}}|{count, plural, one {# doel} other {# doelen}}|{count, plural, one {# {shape}} other {# {shape}}} {trigger}|{count, plural, one {Hooguit # vorm past in een rig.} other {Hooguit # vormen passen in een rig.}}|{count, plural, one {# keyframe verwijderen} other {# keyframes verwijderen}}|{count, plural, one {Vorm wissen} other {Vormen wissen}}|{count, plural, one {Groep van # onderdeel} other {Groep van # onderdelen}}|{count, plural, one {Groep verwijderd} other {Groepen verwijderd}}|{count, plural, one {# onderdeel gegroepeerd} other {# onderdelen gegroepeerd}}|{count, plural, one {Vorm importeren} other {Vormen importeren}}|{count, plural, one {Vervang # onderdeel} other {Vervang # onderdelen}}|{count, plural, one {Splitsen in # onderdeel} other {Splitsen in # onderdelen}}|{count, plural, one {Splitsen in # onderdeel} other {Splitsen in # onderdelen}} (de eerste {parts})|{count, plural, one {{names} staat niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om het te zien.} other {{names} staan niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om ze te zien.}}|{count, plural, one {{name} toegevoegd, # punt.} other {{name} toegevoegd, # punten.}}|{count} van {colours}|{emitters, plural, one {Hooguit # emitter.} other {Hooguit # emitters.}}|{from} tot {to}{unit}|{groups, plural, one {Een rig heeft hooguit # groep.} other {Een rig heeft hooguit # groepen.}}|{id} (niet gevonden)|{id}: de bibliotheek is vol|{kb} van 32 KB|{key} verplaatst één handvat afzonderlijk.|{key} verwijdert het.|{kind} kan niet in een reeks afspelen. Deze stap wordt overgeslagen.|{label} (de animatie beweegt het)|{label} (de animatie beweegt het) · niet op de tegel {tile}|{label} op {at}|{label} op {at} · {value}|{label} versoepeling naar de volgende key|{label} staat niet op de tegel {tile}|Baan {label}|Voorinstelling {label}|Gereedschap {label}. {hint}|{label} · niet op de tegel {tile}|{lane}-keyframe|{list}, stuiter {bounce}|{mAX_SHAPES, plural, one {Hooguit # vorm} other {Hooguit # vormen}}|{max, plural, one {Hooguit # animatie.} other {Hooguit # animaties.}}|{max, plural, one {Hooguit # koppeling per animatie.} other {Hooguit # koppelingen per animatie.}}|{max, plural, one {Hooguit # teken.} other {Hooguit # tekens.}}|{max, plural, one {Hooguit # item.} other {Hooguit # items.}}|{max, plural, one {Hooguit # deeltje over alle emitters.} other {Hooguit # deeltjes over alle emitters.}}||{names} delen deze curve.|{name} (kopie {n})|{name} (kopie)|{name} toegevoegd.|Animatie {name}|{name} kopie|{name} verborgen in het voorbeeld|{name} is vergrendeld. Ontgrendel hem in Lagen.|{name} is nu stap {to} van {count}|{name} staat nu {where}.|Keyframes van {name}|{name} vergrendeld|{name} achter de inhoud gezet|{name} voor de inhoud gezet|{name} {direction} verplaatst|{name} {direction} verplaatst, positie {position} van {count}|{name} {where} verplaatst|{name} staat niet meer solo|Instellingen van {name}|{name} getoond in het voorbeeld|{name} solo in het voorbeeld|{name} ontgrendeld|{name}, achter de inhoud|{name}, voor de inhoud||{now} van {total} seconden|{panels} verborgen|{panels} getoond|{particles, plural, one {# deeltje} other {# deeltjes}} · {emitters, plural, one {# emitter} other {# emitters}}|{parts, plural, one {# onderdeel} other {# onderdelen}}, {shapes, plural, one {# vorm} other {# vormen}}|{parts, plural, one {# onderdeel} other {# onderdelen}}, {shapes, plural, one {# vorm} other {# vormen}}, geen pictogram|{pct} % van het invoerbereik|{pct}, {seconds} seconden|{pieces, plural, one {Deel van # vorm} other {Deel van # vormen}}|{preset} op {targets}|{room, plural, one {De SVG heeft te veel vormen; er past nog maar #.} other {De SVG heeft te veel vormen; er passen nog maar #.}}|Lus van {seconds} s|{shapes, plural, one {Hooguit # vorm past in een rig.} other {Hooguit # vormen passen in een rig.}}||{size} pictogrameenheden|{steps, plural, one {Een reeks heeft hooguit # stap.} other {Een reeks heeft hooguit # stappen.}}|{steps, plural, one {Hooguit # stap} other {Hooguit # stappen}}|{steps}, {total} per cyclus, {loop}{skipped}.|{target}-keyframe|{target} {lane}-keyframe|{target} · op {at} · {secs} s|{tracks, plural, one {Hooguit # geanimeerd doel.} other {Hooguit # geanimeerde doelen.}}|{tracks, plural, one {Deze animatie heeft # geanimeerd doel, het maximum. Verwijder het om dit onderdeel te animeren.} other {Deze animatie heeft # geanimeerde doelen, het maximum. Verwijder er een om dit onderdeel te animeren.}}|{where} · {from} tot {to}']),Wn=e=>e.length<2?e[0]??"":new Intl.ListFormat(Kn(),{style:"long",type:"conjunction"}).format(e),Un="sensor.mc_studio_living_room",Gn=[{id:"icon",label:371,icon:"mdi:bell-ring-outline",targets:["element","icon"]},{id:"button",label:113,icon:"mdi:gesture-tap-button",targets:["element","icon","name"]},{id:"text",label:914,icon:"mdi:format-text",targets:["element","name"]},{id:"card",label:118,icon:"mdi:card-text-outline",targets:["element","icon","name","state","background"],entities:{[Un]:{state:"21.5",name:424,attributes:{unit_of_measurement:"°C",device_class:"temperature",state_class:"measurement"}}}}],Yn=e=>Gn.find(t=>t.id===e)??Gn[0];function Jn(e,t,i,n){const s={text_align:"center",...n?{animations:n}:{}};switch(e){case"icon":return{id:t,type:"icon",icon:"mdi:bell-ring",size:i?"36px":"64px",design:s};case"button":return{id:t,type:"button",label:In(243),icon:"mdi:bell",design:s};case"text":return{id:t,type:"text",text:In(349),design:{...s,font_size:i?"18px":"28px",font_weight:"500"}};case"card":return{id:t,type:"info",entity:Un,icon:"mdi:thermometer",show_icon:!0,show_name:!0,show_state:!0,design:{...s,text_align:"left",background_color:"var(--secondary-background-color, #f2f3f5)",border_radius:"12px",padding:i?"8px 10px":"14px 18px"}}}}function Xn(e,t){const i=Yn(e).entities;if(!i)return t;let n=Qn.get(t);n||Qn.set(t,n=new Map);const s=n.get(e);if(s)return s;const r={};for(const[e,t]of Object.entries(i))r[e]={entity_id:e,state:t.state,attributes:{...t.attributes,friendly_name:In(t.name)},last_changed:"",last_updated:"",context:{id:""}};const a={...t,states:{...r,...t.states??{}}};return n.set(e,a),a}const Qn=new WeakMap,es={"A clip cannot play its own document (use self).":()=>In(15),"A sequence cannot play itself.":()=>In(18),"Another track already animates this target.":()=>In(69),"Children cannot have children of their own.":()=>In(142),"color_mix needs two colours.":()=>In(1095),"Draw-on is only for icon parts and shapes.":()=>In(265),"Min must not be above max.":()=>In(445),"Must be [min, max] px between 1 and 200, min ≤ max.":()=>In(503),"Must be [min, max].":()=>In(504),"Must be 1-16 of a-z, 0-9 and -, and unique.":()=>In(501),"Must be a list.":()=>In(505),"Must be a motion preset or a custom keyframes / path animation.":()=>In(506),"Must be a number.":()=>In(507),"Must be a pair [from, to].":()=>In(508),"Must be a particle, ring or scene preset.":()=>In(509),"Must be a state (text).":()=>In(510),"Must be a subpath index (a whole number from 0).":()=>In(511),"Must be a whole number.":()=>In(512),"Must be an attribute name.":()=>In(513),"Must be an icon id like mdi:bell.":()=>In(514),"Must be an icon id like mdi:star.":()=>In(515),"Must be an object.":()=>In(516),"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.":()=>In(520),"Must be self, none, a preset or custom:<id>.":()=>In(522),"Must be SVG markup.":()=>In(502),"Must be text of at most 40 characters.":()=>In(523),"Must be text.":()=>In(524),"Must be three numbers [x, y, z], not all 0.":()=>In(525),"Must be true or false.":()=>In(526),"Must be two numbers (colours only for color_mix).":()=>In(527),"Must be two numbers [x, y].":()=>In(528),"Must be up to 8 characters (an emoji or a symbol).":()=>In(529),"Must differ from min.":()=>In(530),"Needs at least one entry.":()=>In(534),"No <svg> element found.":()=>In(545),"Not a part of this rig.":()=>In(568),"Not a timeline lane.":()=>In(569),"Not a valid animation id.":()=>In(570),"Not a valid colour.":()=>In(571),"Not a valid easing.":()=>In(572),"Not serialisable.":()=>In(582),"Not valid path data (it must start with M).":()=>In(585),"Only for the trigger time.":()=>In(601),"Required.":()=>In(732),"Set icon or svg, not both.":()=>In(796),"Set one of builtin, icon, emoji or svg.":()=>In(797),"Set one of from or svg.":()=>In(798),"Set one of icon, emoji or svg.":()=>In(799),"Set one of state, state_not, entity_on, above or below.":()=>In(800),"The path draws nothing.":()=>In(962),"The SVG draws nothing.":()=>In(919),"The SVG has no shapes to draw.":()=>In(920),"The SVG is larger than 32 KB.":()=>In(921),"The SVG is too complex.":()=>In(922),"Unsupported version (expected 1).":()=>In(1039),"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>In(1042),"Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>In(1043),'Use keywords, lengths or percentages, e.g. "50% 100%".':()=>In(1053)},ts=[[/^At most (\d+) animations\.$/,e=>In(1206,{max:+e[1]})],[/^At most (\d+) characters\.$/,e=>In(1208,{max:+e[1]})],[/^At most (\d+) entries\.$/,e=>In(1209,{max:+e[1]})],[/^At most (\d+) particles over all emitters\.$/,e=>In(1210,{max:+e[1]})],[/^Duplicate id "(.*)"\.$/,e=>In(278,{id:e[1]})],[/^Must be between (\S+) and (\S+)\.$/,e=>In(519,{min:e[1],max:e[2]})],[/^Must be one of: (.+)\.$/,e=>In(521,{options:e[1]})],[/^Needs at least (\d+) entries\.$/,e=>In(535,{min:+e[1]})],[/^No (\w+) "(.*)" in the rig\.$/,e=>In(564,{kind:e[1],id:e[2]})],[/^Not an allowed (\w+) value\.$/,e=>In(574,{kind:e[1]})],[/^The animation is larger than (\d+) KB\.$/,e=>In(924,{size:+e[1]})],[/^The SVG has too many shapes; at most (\d+) fit\.$/,e=>In(1247,{room:+e[1]})],[/^This card plays engine (\d+); update Magic Card to play this animation\.$/,e=>In(988,{engine:+e[1]})]];function is(e){const t=es[e];if(t)return t();for(const[t,i]of ts){const n=t.exec(e);if(n)return i(n)}return e}const ns={keyframes:398,particles:630,path:642,sequence:792},ss={keyframes:"mdi:vector-polyline",particles:"mdi:shimmer",path:"mdi:vector-curve",sequence:"mdi:format-list-numbered"};class rs{constructor(e,t=600,i=100){this.current=e,this._mergeMs=t,this._limit=i,this._past=[],this._future=[],this._lastAt=0}push(e,t,i=Date.now()){void 0!==t&&t===this._lastKey&&i-this._lastAt<this._mergeMs&&this._past.length>0||(this._past.push(this.current),this._past.length>this._limit&&this._past.shift()),this.current=e,this._future=[],this._lastKey=t,this._lastAt=i}replace(e){this.current=e,this._future=[]}revert(){const e=this._past.pop();void 0!==e&&(this.current=e,this._lastKey=void 0)}canUndo(){return this._past.length>0}canRedo(){return this._future.length>0}undo(){const e=this._past.pop();if(void 0!==e)return this._future.push(this.current),this.current=e,this._lastKey=void 0,e}redo(){const e=this._future.pop();if(void 0!==e)return this._past.push(this.current),this.current=e,this._lastKey=void 0,e}reset(e){this.current=e,this._past=[],this._future=[],this._lastKey=void 0}}function as(e,t){const i=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"animation";if(!t(i))return i;for(let e=2;;e++){const n=`${i.slice(0,60)}-${e}`;if(!t(n))return n}}function os(e,t){const i=In(1214,{name:e});if(!t.has(i))return i.slice(0,80);for(let i=2;;i++){const n=In(1213,{name:e,n:i});if(!t.has(n))return n.slice(0,80)}}function ls(e){return(e.steps??[]).filter(e=>e.animation.startsWith(Be)).map(e=>e.animation.slice(7))}function cs(e,t,i){const n=i.as??"studio-preview",s={...e,id:n},r=i.still?[]:[{id:"preview",preset:Be+n,...i.entity?{entity:i.entity}:{}}],a=(e=>"particles"===e.kind||"path"===e.kind&&"particles"===e.path?.subject||"sequence"===e.kind&&!!e.stagger?.children)(e),o="sequence"===e.kind&&!!e.stagger?.children,l=!a&&r.length?r:void 0,c={type:"custom:magic-card",rows:[{id:"r",layout:o?"1-1-1":"1",columns:(o?["a","b","c"]:["a"]).map(e=>({id:`c${e}`,vertical_align:"center",modules:[Jn(i.tile,`m${e}`,!!i.thumb,l)]})),design:{min_height:i.thumb?"112px":"icon"!==i.tile||a?"240px":"144px",border_radius:"12px",...a&&r.length?{animations:r}:{}}}]},d=new Map([[n,s]]);return function(e,t){const i=new Map((n=e.custom_animations,Array.isArray(n)?n.filter(e=>!!e&&"object"==typeof e):n&&"object"==typeof n?Object.entries(n).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]).map(e=>[String(e.id),e]));var n;const s=new Map,r=[],a=function(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[n,s]of Object.entries(e))if("custom_animations"!==n)if("preset"===n&&Ze(s)){const e=Ke(s);e&&t.add(e)}else s&&"object"==typeof s&&i(s)};return i(e),[...t]}(e);for(;a.length;){const e=a.shift();if(s.has(e)||r.includes(e))continue;const n=t(e)??i.get(e);if(!n){r.push(e);continue}s.set(e,n);const o=n.steps;for(const e of Array.isArray(o)?o:[])"string"==typeof e?.animation&&e.animation.startsWith(Be)&&a.push(Ke(e.animation))}if(!s.size)return{config:e,embedded:[],missing:r};const o=[...s.keys()];for(const[e,t]of i)s.has(e)||s.set(e,t);return{config:{...e,custom_animations:[...s.values()]},embedded:o,missing:r}}(c,e=>d.get(e)??t(e)).config}function ds(e,t){const i=new Map,n=e=>{if(!i.has(e.id)){i.set(e.id,e);for(const i of ls(e)){const e=t.get(i);e&&n(e)}}};return e.forEach(n),[...i.values()].map(e=>{const{id:t,name:i,...n}=JSON.parse(JSON.stringify(e));return{id:t,name:i,data:n}})}const ps=n.AH`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`,hs=n.AH`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px} .with-action>.input{padding-right:44px}.with-icon>.field-action{position:absolute;right:4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;padding-left:10px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{transform:translateX(16px)}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:left}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:left}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`,us=n.AH`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,ms=n.AH`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,gs=[ps,hs,n.AH`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,n.AH`
    :host {
      display: block;
      position: relative;
      height: 100%;
      min-height: 480px;
      overflow: hidden;
      background: var(--mc-ground);
      color: var(--mc-text);
      font-size: 0.875rem;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    /* the live region after the shell: at the top, not one px under it (the host would scroll by it) */
    .shell + .sr-only {
      top: 0;
      left: 0;
    }
    .shell {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      height: 100%;
      min-height: 0;
    }

    .grp {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      flex-wrap: wrap;
    }
    .title h1,
    .title strong {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      overflow-wrap: anywhere;
    }
    .title-icon {
      --mdc-icon-size: 22px;
      color: var(--mc-text-2);
    }
    .vr {
      width: 1px;
      height: 24px;
      background: var(--mc-divider);
    }
    .spacer {
      flex: 1;
    }
    .chip.kind ha-icon {
      --mdc-icon-size: 14px;
    }
    .btn .chev {
      --mdc-icon-size: 16px;
      margin: 0 -4px 0 -2px;
    }
    .btn-danger {
      background: var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 80%, #000);
      color: #fff;
    }
    .btn-danger:hover {
      box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
    }

    /* new animation menu */
    .menu-anchor {
      position: relative;
    }
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 29;
    }
    .new-menu {
      right: 0;
      top: calc(100% + 6px);
      width: 300px;
    }
    .menu button {
      min-height: 52px;
      padding: 6px 12px;
      align-items: center;
    }
    .mi {
      display: grid;
      min-width: 0;
    }
    .mi-t {
      font-weight: 500;
    }
    .mi-s {
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }

    /* library */
    .lib {
      overflow: auto;
      min-height: 0;
      padding: 24px;
    }
    .lib-inner {
      max-width: 1040px;
      margin: 0 auto;
      display: grid;
      gap: 16px;
      align-content: start;
    }
    .lib-tools {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px 16px;
    }
    .search {
      flex: 1 1 280px;
      max-width: 420px;
    }
    .search input::-webkit-search-cancel-button {
      cursor: pointer;
    }
    .lib-list {
      list-style: none;
      margin: 0;
      padding: 0;
      background: var(--mc-surface);
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      overflow: hidden;
    }
    .lib-row {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr) 120px auto;
      align-items: center;
      gap: 16px;
      padding: 10px 12px 10px 12px;
      transition: background-color 0.15s ease-out;
    }
    .has-usage .lib-row {
      grid-template-columns: 88px minmax(0, 1fr) 120px 130px auto;
    }
    .lib-row + .lib-row {
      border-top: 1px solid var(--mc-divider);
    }
    .lib-row:hover {
      background: var(--mc-surface-2);
    }
    .name-cell {
      display: grid;
      min-width: 0;
      gap: 2px;
    }
    .open {
      text-align: left;
      border: 0;
      background: transparent;
      padding: 6px 8px;
      margin: -6px -8px;
      border-radius: var(--mc-radius);
      color: inherit;
    }
    .open:focus-visible {
      outline-offset: 0;
    }
    .open .nm {
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .open:hover .nm {
      color: var(--mc-accent-ink);
    }
    .open .id {
      font-size: 0.75rem;
      color: var(--mc-text-2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .lib-row .chip.kind {
      justify-self: start;
    }
    .used {
      font-size: 0.8125rem;
      color: var(--mc-text);
    }
    .used.none {
      color: var(--mc-text-2);
    }
    .acts {
      display: flex;
      gap: 2px;
      justify-content: flex-end;
    }
    .rename {
      min-height: 36px;
    }
    .no-results {
      text-align: center;
      padding: 32px 12px;
    }
    .lib-empty {
      padding: 48px 24px;
      gap: 12px;
    }
    .lib-empty > ha-icon {
      --mdc-icon-size: 40px;
    }
    .lib-empty p {
      max-width: 52ch;
    }
    .starters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      width: 100%;
      max-width: 640px;
      margin-top: 12px;
    }
    .starter {
      display: grid;
      justify-items: start;
      align-content: start;
      gap: 4px;
      padding: 14px;
      text-align: left;
      border: 1px solid var(--mc-divider);
      border-radius: var(--mc-radius-lg);
      background: var(--mc-surface);
      color: var(--mc-text);
      transition:
        border-color 0.15s ease-out,
        background-color 0.15s ease-out;
    }
    .starter:hover {
      border-color: var(--mc-field-border);
      background: var(--mc-surface-2);
    }
    .starter ha-icon {
      --mdc-icon-size: 22px;
      color: var(--mc-text-2);
      margin-bottom: 4px;
    }

    /* editor (layout v2): layers | centre (stage, splitter, timeline) | inspector, exactly the
       viewport; only the layers list, the timeline lanes and the inspector scroll */
    .workspace {
      --layers-w: 240px;
      --insp-w: 320px;
      position: relative;
      display: grid;
      grid-template-columns: var(--lw, var(--layers-w)) minmax(0, 1fr) var(--iw, var(--insp-w));
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    .workspace.compact {
      --layers-w: 224px;
      --insp-w: 288px;
    }
    .workspace.dense {
      --layers-w: 208px;
    }
    .workspace.slide {
      grid-template-columns: var(--lw, var(--layers-w)) minmax(0, 1fr);
    }
    /*
     * A hidden panel gives its track to the stage but keeps its own width, so its content never reflows and a
     * nested scroller keeps its place (WebKit loses it in a 0 px item). It slides off its edge.
     */
    .no-layers {
      --lw: 0px;
    }
    .no-inspector {
      --iw: 0px;
    }
    .layers {
      --mc-lip-off: -100%;
    }
    .inspector {
      --mc-lip-off: 100%;
    }
    .layers[data-lip='hidden'] {
      width: var(--layers-w);
    }
    .inspector[data-lip='hidden'] {
      width: var(--insp-w);
      justify-self: end;
    }
    .layers {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      background: var(--mc-surface);
      border-right: 1px solid var(--mc-divider);
    }
    .layers-head {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 4px 6px 4px 16px;
      border-bottom: 1px solid var(--mc-divider);
    }
    .layers-head h2 {
      flex: 1;
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--mc-text-2);
    }
    .layers-body {
      position: relative;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: 8px;
    }
    .layers-note,
    .layers-help {
      padding: 4px 8px;
    }
    .layers-help {
      margin: 8px 0 0;
    }
    /* registered layers panels (card parts, icon parts, shapes), each under a small heading */
    .layer-group + .layer-group {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid var(--mc-divider);
    }
    .layer-head {
      margin: 0;
      padding: 4px 8px 6px;
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mc-text-2);
    }
    .layer-group:focus {
      outline: none;
    }
    .layer-group > .panel {
      display: block;
    }
    .layer-list {
      display: grid;
      gap: 2px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .layer {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 40px;
      padding: 0 8px 0 10px;
      border: 0;
      border-radius: var(--mc-radius);
      background: transparent;
      color: var(--mc-text);
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: left;
      transition: background-color 0.15s ease-out;
    }
    .layer ha-icon {
      --mdc-icon-size: 18px;
      color: var(--mc-text-2);
      flex: none;
    }
    .layer:hover {
      background: var(--mc-surface-2);
    }
    .layer[aria-pressed='true'] {
      background: var(--mc-accent-tint);
      color: var(--mc-accent-ink);
    }
    .layer[aria-pressed='true'] ha-icon {
      color: var(--mc-accent-ink);
    }
    .layer.off {
      color: var(--mc-text-2);
    }
    .layer.off .layer-name {
      text-decoration: line-through;
      text-decoration-color: var(--mc-field-border);
    }
    .layer-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .layer-main {
      height: 20px;
      padding: 0 8px;
      font-size: 0.6875rem;
    }
    .layer-count {
      min-width: 20px;
      font-size: 0.75rem;
      font-weight: 400;
      text-align: right;
      color: var(--mc-text-2);
      font-variant-numeric: tabular-nums;
    }
    .center {
      display: grid;
      grid-template-rows: minmax(0, 1fr);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    .center.with-panel {
      grid-template-rows:
        minmax(${(0,n.iz)(160)}px, calc(var(--split, 0.4) * 100%))
        9px minmax(0, 1fr);
    }
    .splitter {
      position: relative;
      cursor: row-resize;
      touch-action: none;
      background: var(--mc-surface);
      border-top: 1px solid var(--mc-divider);
      border-bottom: 1px solid var(--mc-divider);
    }
    .splitter::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 40px;
      height: 3px;
      margin: -1.5px 0 0 -20px;
      border-radius: 2px;
      background: var(--mc-field-border);
      transition: background-color 0.15s ease-out;
    }
    /* a 24 px grab area over the 9 px bar (touch) */
    .splitter::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -8px;
      bottom: -8px;
      z-index: 2;
    }
    .splitter:hover::before,
    .splitter:focus-visible::before {
      background: var(--mc-accent);
    }
    .splitter:focus-visible {
      outline: 2px solid var(--mc-accent);
      outline-offset: -2px;
    }
    .inspector:focus {
      outline: none;
    }
    .inspector {
      /* the containing block of the panels' absolutely placed bits (sr-only text): they scroll with it */
      position: relative;
      background: var(--mc-surface);
      border-left: 1px solid var(--mc-divider);
      overflow-y: auto;
      overscroll-behavior: contain;
      min-height: 0;
      min-width: 0;
      padding: 0 16px 16px;
      display: flex;
      flex-direction: column;
    }
    .workspace.slide .inspector {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(var(--insp-w), 100%);
      z-index: 8;
      transform: translateX(100%);
      visibility: hidden;
      transition:
        transform 0.2s ease-out,
        visibility 0s linear 0.2s;
    }
    .workspace.slide.insp-open .inspector {
      transform: none;
      visibility: visible;
      box-shadow: var(--mc-shadow-float);
      transition: transform 0.2s ease-out;
    }
    .insp-scrim {
      position: absolute;
      inset: 0;
      z-index: 7;
      background: rgba(0, 0, 0, 0.16);
    }
    .ctx {
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      margin: 0 -16px;
      padding: 4px 16px 4px 8px;
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
    }
    .ctx-what {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
      font-size: 0.75rem;
      color: var(--mc-text-2);
    }
    .ctx-note {
      padding-top: 16px;
    }
    /* collapsible inspector sections: the kit's section head (h3 + .sector-btn) on the studio's flat rule between sections */
    .sec {
      position: relative;
      border-bottom: 1px solid var(--mc-divider);
    }
    .sec:last-child {
      border-bottom: 0;
    }
    .sec .sector-btn {
      width: calc(100% + 8px);
      margin: 0 -4px;
      padding: 8px 4px;
    }
    .sec-err {
      position: absolute;
      top: 20px;
      right: 36px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--mc-error-ink, var(--error-color, #db4437));
    }
    .sec-body {
      display: grid;
      gap: 16px;
      padding: 0 0 20px;
      min-width: 0;
    }
    .mono.ref {
      font-size: 0.75rem;
    }
    .suffix {
      position: relative;
    }
    .suffix .input {
      padding-right: 36px;
    }
    .suffix span {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--mc-text-2);
      pointer-events: none;
    }
    .errors {
      margin: 16px 0 0;
      padding: 10px 12px;
      border-radius: var(--mc-radius);
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      color: var(--mc-error-ink);
      font-size: 0.8125rem;
    }
    .errors strong {
      font-weight: 500;
    }
    .errors ul {
      margin: 4px 0 0;
      padding-left: 18px;
    }
    .errors .mono {
      font-size: 0.75rem;
    }
    /* kind editors (editor-slots.ts): the timeline fills the panel under the stage, the others sit in the inspector */
    .kind-slot {
      display: grid;
      min-width: 0;
    }
    .kind-slot.place-panel {
      grid-auto-rows: minmax(0, 1fr) auto;
      min-height: 0;
      overflow: hidden;
      padding: 8px 12px 10px;
      background: var(--mc-surface);
    }
    .kind-slot.place-panel > .kind-editor {
      min-height: 0;
      height: 100%;
      overflow: auto;
    }
    .kind-editor,
    .panel {
      display: block;
      min-width: 0;
    }
    .inspector > .panel + .panel {
      border-top: 1px solid var(--mc-divider);
    }

    /* what goes into an <mc-ui-window>: the body is a grid, the footer's buttons join the window's own footer row */
    .dlg {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .dlg p {
      margin: 0;
    }
    .dlg > p:not(.help) {
      color: var(--mc-text-2);
    }
    .foot {
      display: contents;
    }
    textarea.yaml {
      min-height: 260px;
      white-space: pre;
    }
    .file {
      position: relative;
      cursor: pointer;
    }
    .file input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .file:focus-within {
      outline: 2px solid var(--mc-accent);
      outline-offset: 2px;
    }
    .ok {
      color: var(--mc-text) !important;
    }
    mc-preset-grid.preset-list {
      min-height: 0;
    }

    .toast {
      position: absolute;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 40;
      max-width: min(520px, calc(100% - 32px));
      padding: 10px 16px;
      border-radius: var(--mc-radius);
      background: var(--mc-text);
      color: var(--mc-surface);
      box-shadow: var(--mc-shadow-float);
      font-size: 0.8125rem;
      pointer-events: none;
    }

    @media (max-width: 1180px) {
      .lib {
        padding: 16px;
      }
    }
    @media (max-width: 760px) {
      .lib-row,
      .has-usage .lib-row {
        grid-template-columns: 88px minmax(0, 1fr) auto;
      }
      .lib-row .chip.kind,
      .used {
        display: none;
      }
    }
  `],fs={keyframes:{tag:"mc-anim-keyframes-editor",place:"panel",title:1e3},particles:{tag:"mc-anim-particles-editor",place:"inspector",title:630},path:{tag:"mc-anim-path-editor",place:"inspector",title:642},sequence:{tag:"mc-anim-sequence-editor",place:"inspector",title:898}},vs="mc-anim-path-host",bs=e=>"undefined"!=typeof customElements&&!!customElements.get(e),ys={kind:"none"},xs=[];function _s(e){const t=xs.findIndex(t=>t.tag===e.tag&&t.place===e.place);t>=0?xs[t]=e:xs.push(e)}function $s(e,t,i){return xs.map((e,t)=>({p:e,i:t})).filter(({p:n})=>{if(n.place!==e)return!1;try{return n.when(t,i)}catch{return!1}}).sort((e,t)=>e.p.order-t.p.order||e.i-t.i).map(({p:e})=>e)}const ws="var(--mc-anim-c)",ks=[{id:"x",label:456,group:"Transform",icon:"mdi:arrow-left-right",kind:"number",def:{transform:{x:0}}},{id:"y",label:457,group:"Transform",icon:"mdi:arrow-up-down",kind:"number",def:{transform:{y:0}}},{id:"scale",label:767,group:"Transform",icon:"mdi:resize",kind:"number",def:{transform:{scale:1}}},{id:"scale_x",label:768,group:"Transform",icon:"mdi:arrow-expand-horizontal",kind:"number",def:{transform:{scale_x:1}}},{id:"scale_y",label:769,group:"Transform",icon:"mdi:arrow-expand-vertical",kind:"number",def:{transform:{scale_y:1}}},{id:"rotate",label:747,group:"Transform",icon:"mdi:rotate-right",kind:"number",def:{transform:{rotate:0}}},{id:"skew",label:827,group:"Transform",icon:"mdi:vector-polygon",kind:"number",def:{transform:{skew_x:0,skew_y:0}}},{id:"opacity",label:605,group:"Appearance",icon:"mdi:circle-opacity",kind:"number",def:{opacity:1}},{id:"color",label:166,group:"Appearance",icon:"mdi:format-color-text",kind:"css",def:{color:ws}},{id:"background",label:80,group:"Appearance",icon:"mdi:format-color-fill",kind:"css",def:{background:`color-mix(in srgb, ${ws} 20%, transparent)`}},{id:"shadow",label:802,group:"Appearance",icon:"mdi:box-shadow",kind:"css",def:{shadow:`0 0 16px 2px ${ws}`}},{id:"blur",label:96,group:"Appearance",icon:"mdi:blur",kind:"number",def:{blur:0}},{id:"radius",label:190,group:"Appearance",icon:"mdi:rounded-corner",kind:"number",def:{radius:0}},{id:"filter",label:324,group:"Appearance",icon:"mdi:auto-fix",kind:"css",def:{filter:"brightness(1.2)"}}],Ms=[{id:"draw",label:262,group:"Appearance",icon:"mdi:draw",kind:"number",def:{draw:1},rig:!0},{id:"stroke",label:905,group:"Appearance",icon:"mdi:border-color",kind:"css",def:{stroke:ws},rig:!0}],Ss=[...ks,...Ms],js=Object.fromEntries(Ss.map(e=>[e.id,e])),Cs=e=>!!e&&/^(part|group|shape):/.test(e),As=e=>In(js[e].label),zs=e=>Cs(e)?Ss:ks,qs=[["x","y"],["scale","scale_x","scale_y"],["filter","blur"]],Es=e=>qs.find(t=>t.includes(e))??[e],Hs={x:["x"],y:["y"],scale:["scale"],scale_x:["scale_x"],scale_y:["scale_y"],rotate:["rotate","axis"],skew:["skew_x","skew_y"]};function Ls(e,t){if("*"===t)return!0;const i=Hs[t];return i?"rotate"===t?void 0!==e.transform?.rotate:i.some(t=>void 0!==e.transform?.[t]):void 0!==e[t]}const Vs=e=>Ss.every(t=>!Ls(e,t.id));function Os(e,t){const i=Hs[t];if(i){const t={};for(const n of i){const i=e.transform?.[n];void 0!==i&&(t[n]=Array.isArray(i)?[...i]:i)}return{transform:t}}const n=e[t];return void 0===n?{}:{[t]:n}}function Ps(e,t){const i={...e};for(const[n,s]of Object.entries(t))"transform"===n?i.transform={...e.transform??{},...s}:i[n]=s;return i.transform&&!Object.keys(i.transform).length&&delete i.transform,i}function Rs(e,t){const i={...e};if(i.easings&&void 0!==i.easings[t]){const e={...i.easings};delete e[t],Object.keys(e).length?i.easings=e:delete i.easings}const n=Hs[t];if(n){if(i.transform){const e={...i.transform};for(const t of n)delete e[t];Object.keys(e).length?i.transform=e:delete i.transform}}else delete i[t];return i}const Ds=e=>Ss.filter(t=>e.some(e=>Ls(e,t.id))).map(e=>e.id),Ns=e=>`${e.lane}@${e.at}`;function Ts(e){const t=e.lastIndexOf("@");return{lane:e.slice(0,t),at:Number(e.slice(t+1))}}function Fs(e,t){return[...new Set(e.filter(e=>Ls(e,t)).map(e=>e.at))].sort((e,t)=>e-t)}const Is=(e,t)=>e.some(e=>e.at===t.at&&Ls(e,t.lane));function Bs(e,t,i){return e.filter(e=>e.at===i&&Ls(e,t)).reduce((e,i)=>Ps(e,Os(i,t)),{})}function Zs(e,t){let i;for(const n of e)n.at===t&&n.easing&&(i=n.easing);return i}function Ks(e,t,i){let n;for(const s of e)s.at===i&&s.easings?.[t]&&(n=s.easings[t]);return n}function Ws(e,t,i,n){const s=Es(t),r=e.map((e,t)=>e.at===i&&s.some(t=>Ls(e,t))?t:-1).filter(e=>e>=0);return r.length?e.map((e,t)=>{if(e.at!==i)return e;const a={...e.easings??{}};for(const e of s)delete a[e];if(n&&r.includes(t))for(const t of s)Ls(e,t)&&(a[t]=n);const o={...e};return Object.keys(a).length?o.easings=a:delete o.easings,o}):e}const Us=e=>e.map((e,t)=>[e,t]).sort((e,t)=>e[0].at-t[0].at||e[1]-t[1]).map(([e])=>e),Gs=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));function Ys(e,t,i,n,s){const r=s&&Object.keys(s).length?{...s}:void 0,a=e.map(e=>e.at).lastIndexOf(t);if(a<0)return[...e,{at:t,...Ps({},i),...n?{easing:n}:{},...r?{easings:r}:{}}];const o=[...e];return o[a]=Ps(o[a],i),n&&!o[a].easing&&(o[a]={...o[a],easing:n}),r&&(o[a]={...o[a],easings:{...o[a].easings??{},...r}}),o}function Js(e,t){if("*"===t.lane)return e.filter(e=>e.at!==t.at);const i=t.lane;return e.flatMap(e=>{if(e.at!==t.at||!Ls(e,i))return[e];const n=Rs(e,i);return Vs(n)?[]:[n]})}function Xs(e,t,i){const n={};for(const s of e)if(s.at===t&&s.easings)for(const[e,t]of Object.entries(s.easings))void 0===t||i&&!i.includes(e)||(n[e]=t);return Object.keys(n).length?n:void 0}function Qs(e,t){if(!Is(e,t))return;if("*"===t.lane){const i=e.filter(e=>e.at===t.at);return{key:t,frag:i.reduce((e,t)=>Ps(e,function(e){return Ss.reduce((t,i)=>Ls(e,i.id)?Ps(t,Os(e,i.id)):t,{})}(t)),{}),easing:Zs(e,t.at),easings:Xs(e,t.at)}}const i=e.filter(e=>e.at===t.at).every(e=>Ss.every(i=>i.id===t.lane||!Ls(e,i.id)));return{key:t,frag:Bs(e,t.lane,t.at),easing:i?Zs(e,t.at):void 0,easings:Xs(e,t.at,[t.lane])}}function er(e){const t=new Set(e.filter(e=>"*"===e.lane).map(e=>e.at)),i=new Set;return e.filter(e=>{const n=Ns(e);return!(i.has(n)||"*"!==e.lane&&t.has(e.at)||(i.add(n),0))})}function tr(e,t){if(!e.length)return 0;const i=Math.min(...e.map(e=>e.at)),n=Math.max(...e.map(e=>e.at));return Math.min(100-n,Math.max(-i,t))}function ir(e,t,i,n=!1){const s=er(t).filter(t=>Is(e,t)),r=tr(s,i);if(!s.length||0===r&&!n)return{keyframes:e,selection:s};const a=s.map(t=>Qs(e,t)).filter(Boolean);let o=e;if(!n)for(const e of a)o=Js(o,e.key);const l=[];for(const e of[...a].sort((e,t)=>("*"===e.key.lane?0:1)-("*"===t.key.lane?0:1))){const t=Gs(e.key.at+r);o=Ys(o,t,e.frag,e.easing,e.easings),l.push({lane:e.key.lane,at:t})}return{keyframes:Us(o),selection:l}}function nr(e,t){let i=e;for(const e of er(t))i=Js(i,e);return i}const sr=(e,t,i)=>e+(t-e)*i,rr=(e,t=4)=>Math.round(e*10**t)/10**t;function ar(e,t,i,n="ease"){const s=Fs(e,t);if(!s.length)return;if(s.includes(i))return Bs(e,t,i);const r=s.find(e=>e>i),a=[...s].reverse().find(e=>e<i);if(void 0===a)return Bs(e,t,r);if(void 0===r)return Bs(e,t,a);const o=(i-a)/(r-a),l=function(e,t){const i=e?.match(/^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+)\s*)?\)$/);if(i){const e=Math.max(1,Number(i[1])),n="start"===i[2]||"jump-start"===i[2];return Math.min(1,(n?Math.ceil(t*e):Math.floor(t*e))/e)}return function([e,t,i,n],s){if(s<=0)return 0;if(s>=1)return 1;const r=t=>3*e*t*(1-t)**2+3*i*t**2*(1-t)+t**3,a=e=>3*t*e*(1-e)**2+3*n*e**2*(1-e)+e**3,o=t=>3*e*(1-t)**2+6*(i-e)*t*(1-t)+3*(1-i)*t**2;let l=s;for(let e=0;e<8;e++){const e=r(l)-s;if(Math.abs(e)<1e-6)return a(l);const t=o(l);if(Math.abs(t)<1e-6)break;l-=e/t}let c=0,d=1;l=s;for(let e=0;e<40;e++){const e=r(l);if(Math.abs(e-s)<1e-6)break;e<s?c=l:d=l,l=(c+d)/2}return a(l)}(Dr(e)??[0,0,1,1],t)}(((e,t,i)=>Ks(e,t,i)??Zs(e,i))(e,t,a)??n,o);return function(e){const t={...e};for(const e of["opacity","blur","radius","draw"])void 0!==t[e]&&(t[e]=rr(t[e],"opacity"===e||"draw"===e?3:2));if(t.transform){const e={...t.transform};for(const[t,i]of Object.entries(e))"number"==typeof i&&(e[t]=rr(i,t.startsWith("scale")?3:2));t.transform=e}return t}(function(e,t,i){const n={},s=["opacity","blur","radius","draw"];for(const r of s){const s=e[r],a=t[r];void 0===s&&void 0===a||(n[r]=sr(s??a,a??s,i))}if(e.transform||t.transform){const s=e.transform??{},r=t.transform??{},a={};for(const e of["x","y","scale","scale_x","scale_y","rotate","skew_x","skew_y"]){const t=s[e],n=r[e];void 0===t&&void 0===n||(a[e]=sr(t??n,n??t,i))}const o=s.axis??r.axis;o&&(a.axis=[...o]),n.transform=a}for(const s of["color","background","shadow","filter","stroke"]){const r=i<1?e[s]??t[s]:t[s]??e[s];void 0!==r&&(n[s]=r)}return n}(Bs(e,t,a),Bs(e,t,r),l))}function or(e,t,i){return e.map(e=>{if(e.at!==t)return e;const n={...e};return i?n.easing=i:delete n.easing,n})}function lr(e,t){const i=er(t).filter(t=>Is(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at));return{items:i.map(t=>{const i=Qs(e,t);return{lane:t.lane,dt:t.at-n,frag:cr(i.frag),easing:i.easing,...i.easings?{easings:{...i.easings}}:{}}})}}const cr=e=>JSON.parse(JSON.stringify(e));function dr(e,t,i){let n=e;const s=[],r=[...t.items].sort((e,t)=>("*"===e.lane?0:1)-("*"===t.lane?0:1));for(const e of r){const t=Gs(i+e.dt);n=Ys(n,t,cr(e.frag),e.easing,e.easings),s.push({lane:e.lane,at:t})}return{keyframes:Us(n),selection:s}}let pr;const hr=new Set,ur=()=>pr;function mr(e){pr=e;for(const e of hr)e()}const gr={x:e=>({transform:{x:e}}),y:e=>({transform:{y:e}}),scale:e=>({transform:{scale:e}}),scale_x:e=>({transform:{scale_x:e}}),scale_y:e=>({transform:{scale_y:e}}),rotate:e=>({transform:{rotate:e}}),skew:e=>({transform:{skew_x:e,skew_y:0}}),opacity:e=>({opacity:Math.min(1,Math.max(0,e))}),blur:e=>({blur:Math.max(0,e)}),radius:e=>({radius:Math.max(0,e)}),draw:e=>({draw:Math.min(1,Math.max(0,e))})},fr=["color","background","stroke"];function vr(e,t,i){if(e===t)return cr(i);const n=e=>["x","y"].includes(e)?"move":["scale","scale_x","scale_y"].includes(e)?"scale":["opacity","draw"].includes(e)?"unit":["blur","radius"].includes(e)?"px":e;if(gr[e]&&gr[t]&&n(e)===n(t)){const n=function(e,t){const i=t.transform??{};switch(e){case"x":case"y":case"scale":case"scale_x":case"scale_y":case"rotate":return i[e];case"skew":return i.skew_x;default:{const i=t[e];return"number"==typeof i?i:void 0}}}(e,i);return void 0===n?void 0:gr[t](n)}if(fr.includes(e)&&fr.includes(t)){const n=i[e];return"string"==typeof n?{[t]:n}:void 0}}const br={element:{label:292,icon:"mdi:card-outline"},icon:{label:371,icon:"mdi:emoticon-outline"},name:{label:532,icon:"mdi:format-text"},state:{label:878,icon:"mdi:information-outline"},background:{label:80,icon:"mdi:texture-box"}};function yr(e,t){if(br[t])return In(br[t].label);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return n?.find(e=>e.id===i[2])?.name??i[2]}const xr=e=>br[e]?.icon??(e.startsWith("group:")?"mdi:group":e.startsWith("shape:")?"mdi:vector-square":"mdi:puzzle-outline"),_r=e=>"icon"===e.target?"icon":"element";function $r(e){const t=[{target:_r(e),keyframes:e.keyframes??[],main:!0}];for(const i of e.tracks??[])t.some(e=>e.target===i.target)||t.push({target:i.target,keyframes:i.keyframes??[],main:!1});return t}function wr(e,t){return t===_r(e)?e.keyframes??[]:e.tracks?.find(e=>e.target===t)?.keyframes??[]}function kr(e,t,i){if(t===_r(e))return{...e,keyframes:i};const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s>=0){const e={...n[s],keyframes:i};i.length||e.path||e.origin?n[s]=e:n.splice(s,1)}else i.length&&n.push({target:t,keyframes:i});const r={...e};return n.length?r.tracks=n:delete r.tracks,r}const Mr=(e,t)=>e.target===t?Ns(e):`${e.target}/${Ns(e)}`;function Sr(e,t){const i=e.indexOf("/");return{target:i>=0?e.slice(0,i):t,...Ts(i>=0?e.slice(i+1):e)}}const jr=(e,t)=>Is(wr(e,t.target),t);function Cr(e){const t=new Map;for(const i of e){const e=t.get(i.target)??[];e.push({lane:i.lane,at:i.at}),t.set(i.target,e)}return t}function Ar(e,t,i,n=!1){const s=t.filter(t=>jr(e,t)),r=tr(s,i);if(!s.length||0===r&&!n)return{doc:e,selection:s};let a=e;const o=[];for(const[e,t]of Cr(s)){const i=ir(wr(a,e),t,r,n);a=kr(a,e,i.keyframes),o.push(...i.selection.map(t=>({...t,target:e})))}return{doc:a,selection:o}}function zr(e,t){let i=e;for(const[e,n]of Cr(t))i=kr(i,e,nr(wr(i,e),n));return i}function qr(e,t){const i=t.filter(t=>jr(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at)),s=[];for(const[t,r]of Cr(i)){const i=lr(wr(e,t),r),a=Math.min(...r.map(e=>e.at));for(const e of i?.items??[])s.push({...e,dt:e.dt+a-n,target:t})}return{items:s}}const Er=[{id:"pct1",label:10},{id:"pct5",label:12},{id:"s01",label:9},{id:"fps30",label:11}],Hr=[1,1.5,2,3,4,6,8,10],Lr=e=>Math.min(10,Math.max(1,Math.round(100*e)/100));function Vr(e,t){return t>0?Hr.find(t=>t>e+.001)??10:[...Hr].reverse().find(t=>t<e-.001)??1}const Or=[1,2,2.5,5];function Pr(e){const t=10**Math.floor(Math.log10(e));for(const i of[...Or,10])if(i*t>=e-1e-9)return i*t;return 10*t}const Rr={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function Dr(e){if(!e)return;const t=e.trim(),i=I.find(e=>e.id===t)?.css??t;if(Rr[i])return[...Rr[i]];const n=i.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);if(!n)return;const s=n.slice(1).map(Number);return s.every(Number.isFinite)?s:void 0}const Nr=I.map(e=>({id:e.id,label:e.label,bezier:Dr(e.id)})),Tr=e=>Math.round(100*e)/100;function Fr(e){const t=e=>Tr(Math.min(1,Math.max(0,e))),i=e=>Tr(Math.min(2,Math.max(-1,e)));return[t(e[0]),i(e[1]),t(e[2]),i(e[3])]}function Ir(e){const t=Fr(e),i=Nr.find(e=>e.bezier.every((e,i)=>Math.abs(e-t[i])<.005));return i?i.id:`cubic-bezier(${t.join(", ")})`}const Br=/^color-mix\(in srgb, var\(--mc-anim-c\) (\d+(?:\.\d+)?)%, transparent\)$/;function Zr(e){if(!e)return"";const t=e.trim();if(/^var\(\s*--mc-anim-c\s*\)$/.test(t))return"entity";const i=t.match(Br);return i?`entity ${i[1]}%`:t}function Kr(e){const t=e.trim().match(/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/i);return t?void 0===t[1]||Number(t[1])>=100?ws:`color-mix(in srgb, ${ws} ${Number(t[1])}%, transparent)`:e.trim()}const Wr=e=>`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`,Ur=[{id:"glow",label:350,value:`0px 0px 16px 2px ${ws}`},{id:"drop",label:274,value:"0px 6px 16px 0px rgba(0, 0, 0, 0.3)"},{id:"lift",label:416,value:"0px 14px 28px -6px rgba(0, 0, 0, 0.35)"},{id:"none",label:565,value:"none"}],Gr=[{id:"bright",label:102,value:"brightness(1.3)"},{id:"hue",label:369,value:"hue-rotate(90deg)"},{id:"gray",label:355,value:"grayscale(1)"},{id:"glow",label:350,value:`drop-shadow(0 0 6px ${ws})`},{id:"none",label:565,value:"none"}],Yr=(e,t)=>"none"===e.trim()?"shadow"===t||"filter"===t:void 0!==it(e,t),Jr=["top left","top","top right","left","center","right","bottom left","bottom","bottom right"],Xr=[1008,1007,1009,411,128,742,99,98,100],Qr=(e,t=2)=>String(rr(e,t));function ea(e,t){if(!t)return"";const i=t.transform??{};switch(e){case"x":return void 0===i.x?"":`${Qr(i.x,1)} px`;case"y":return void 0===i.y?"":`${Qr(i.y,1)} px`;case"scale":case"scale_x":case"scale_y":{const t=i[e];return void 0===t?"":`${Qr(100*t,1)}%`}case"rotate":return void 0===i.rotate?"":`${Qr(i.rotate,1)}°`;case"skew":return`${Qr(i.skew_x??0,1)}° ${Qr(i.skew_y??0,1)}°`;case"opacity":return void 0===t.opacity?"":`${Qr(100*t.opacity,0)}%`;case"blur":return void 0===t.blur?"":`${Qr(t.blur,1)} px`;case"radius":return void 0===t.radius?"":`${Qr(t.radius,1)} px`;case"draw":return void 0===t.draw?"":`${Qr(100*t.draw,0)}%`;default:{const i=t[e];return void 0===i?"":Zr(i).startsWith("entity")?In(66):i}}}const ta=e=>{const t=e?I.find(t=>t.id===e)?.label:void 0;return void 0!==t?(0,T.t)(t):e?e.startsWith("steps")?In(898):In(206):In(214)};var ia=i(8164);function na(e){const t=e?(0,de.Rr)(e)[0]:void 0;if(t)return(0,ia.toEdit)(t);const i=String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`,n=new RegExp(String.raw`^\s*[Mm]\s*${i}[\s,]*${i}`).exec(e||"");return{anchors:n?[{x:Number(n[1]),y:Number(n[2])}]:[],closed:!1}}const sa=ia.serialize,ra=ia.bounds,aa=ia.reverse,oa=ia.translate,la=new Map;function ca(e,t){let i=la.get(e);if(i||(i=e?wn(e,200):[],la.size>32&&la.clear(),la.set(e,i)),!i.length)return;const n=Math.min(1,Math.max(0,Number.isFinite(t)?t:0))*(i.length-1),s=Math.min(i.length-2,Math.floor(n));if(s<0)return i[0];const r=i[s],a=i[s+1],o=n-s;return{t:r.t+(a.t-r.t)*o,x:r.x+(a.x-r.x)*o,y:r.y+(a.y-r.y)*o,angle:r.angle+(a.angle-r.angle)*o}}const da=[{id:"circle",label:147},{id:"figure-8",label:321},{id:"wave",label:1069},{id:"bounce",label:101},{id:"zigzag",label:1080},{id:"spiral",label:853}];function pa(e,t,i,n,s,r){const a=(n-i)/s,o=[],l=r?s:s+1;for(let n=0;n<l;n++){const s=i+n*a,[c,d]=e(s),[p,h]=t(s),u=[p*a/3,h*a/3];o.push({x:c,y:d,in:r||n>0?[c-u[0],d-u[1]]:void 0,out:r||n<l-1?[c+u[0],d+u[1]]:void 0})}return{anchors:o,closed:r}}function ha(e,t=[0,0],i=40){const[n,s]=t,r=i/40,a=2*Math.PI;let o;switch(e){case"circle":{const e=30*r;o=pa(t=>[n+e*Math.cos(t),s+e*Math.sin(t)],t=>[-e*Math.sin(t),e*Math.cos(t)],0,a,8,!0);break}case"figure-8":{const e=36*r,t=56*r;o=pa(i=>[n+e*Math.sin(i),s+t*Math.sin(i)*Math.cos(i)],i=>[e*Math.cos(i),t*Math.cos(2*i)],0,a,8,!0);break}case"wave":{const e=80*r,t=20*r,i=2,l=a*i/e;o=pa(i=>[n-e/2+i,s-t*Math.sin(l*i)],e=>[1,-t*l*Math.cos(l*e)],0,e,4*i,!1);break}case"bounce":{const e=s+20*r,t=[40,25,12].map(e=>e*r),i=[34,26,20].map(e=>e*r);let a=n-40*r;const l=[{x:a,y:e}];t.forEach((t,n)=>{const s=a+i[n],r=[a+i[n]/2,e-2*t];l[l.length-1].out=[a+2/3*(r[0]-a),e+2/3*(r[1]-e)],l.push({x:s,y:e,in:[s+2/3*(r[0]-s),e+2/3*(r[1]-e)]}),a=s}),o={anchors:l,closed:!1};break}case"zigzag":{const e=[],t=6;for(let i=0;i<=t;i++)e.push({x:n-40*r+80*r*i/t,y:s+(i%2?-15:15)*r});o={anchors:e,closed:!1};break}case"spiral":{const e=2.5,t=a*e,i=40*r/t;o=pa(e=>[n+i*e*Math.cos(e),s+i*e*Math.sin(e)],e=>[i*(Math.cos(e)-e*Math.sin(e)),i*(Math.sin(e)+e*Math.cos(e))],0,t,4*e,!1);break}}return sa(o)}const ua=e=>"particles"===e.subject&&"percent"===e.units?[50,50]:[0,0],ma=e=>Math.round(100*e)/100,ga=e=>`${(0,ia.fmtNum)(e[0])} ${(0,ia.fmtNum)(e[1])}`,fa=e=>e.length>1&&(0,de.xg)(e[0][0],e[e.length-1][3])<1e-6;function va(e,t){return function(e){const t=[];for(const i of e){if(!i.length)continue;const e=fa(i);t.push(`M${ga(i[0][0])}`),i.forEach((n,s)=>{(0,de.Wv)(n[1],n[0],n[3])<1e-4&&(0,de.Wv)(n[2],n[0],n[3])<1e-4?e&&s===i.length-1||t.push(`L${ga(n[3])}`):t.push(`C${ga(n[1])} ${ga(n[2])} ${ga(n[3])}`)}),e&&t.push("Z")}return t.join(" ")}((0,de.Mj)(e).map(e=>e.map(e=>e.map(t))))}const ba=(e,t,i)=>va(e,e=>[e[0]+t,e[1]+i]);function ya(e){const t=[];for(const i of(0,de.Mj)(e))i.length&&(t.push([i[0][0][0],i[0][0][1]]),i.forEach((e,n)=>{n===i.length-1&&fa(i)||t.push([e[3][0],e[3][1]])}));return t.map(e=>[ma(e[0]),ma(e[1])])}function xa(e,t=12){return(0,de.Mj)(e).map(e=>{const i=e.length?[e[0][0]]:[];for(const n of e)for(let e=1;e<=t;e++)i.push((0,de.Mo)(n,e/t));return i})}function _a(e){let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const r of xa(e,16))for(const e of r)t=Math.min(t,e[0]),i=Math.min(i,e[1]),n=Math.max(n,e[0]),s=Math.max(s,e[1]);return Number.isFinite(t)?{x:t,y:i,w:n-t,h:s-i}:void 0}function $a(e){const t=(e??"").trim().split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:[0,0,24,24]}function wa(e,t){const[i,n,s,r]=$a(e),[a,o,l,c]=$a(t),d=Math.min(l/s,c/r);return{k:d,dx:a+(l-s*d)/2-i*d,dy:o+(c-r*d)/2-n*d}}const ka=/^(none|transparent)$/i,Ma=e=>e.fill?!ka.test(e.fill):!e.stroke,Sa=e=>!!e.stroke&&!ka.test(e.stroke);function ja(e,t){let i=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){const[r,a]=e[n],[o,l]=e[s];a>t[1]!=l>t[1]&&t[0]<(o-r)*(t[1]-a)/(l-a||1e-9)+r&&(i=!i)}return i}const Ca=e=>[...e.filter(e=>"under"===e.layer),...e.filter(e=>"under"!==e.layer)];function Aa(e,t){let i=1/0;for(const n of xa(e))for(let e=1;e<n.length;e++)i=Math.min(i,(0,de.Wv)(t,n[e-1],n[e]));return i}function za(e,t,i){const n=Ca(e);for(let e=n.length-1;e>=0;e--){const s=n[e],r=xa(s.d);if(Ma(s)){let e=!1;for(const i of r)ja(i,t)&&(e=!e);if(e)return s.id}const a=(Sa(s)?(s.stroke_width??1)/2:0)+i;if(Aa(s.d,t)<=a)return s.id}}const qa=/^[a-z0-9][a-z0-9_-]{0,24}$/;function Ea(e,t="shape"){const i=new Set(e.map(e=>"string"==typeof e?e:e.id)),n=qa.test(t)?t:"shape";let s=1;for(;i.has(`${n}-${s}`);)s++;return`${n}-${s}`}function Ha(e){const t=JSON.stringify(e),i="undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length;return i>65536?In(927,{max:Math.round(64),size:Math.ceil(i/1024)}):void 0}const La=e=>e.rig?.shapes??[],Va=e=>[...(e.rig?.parts??[]).map(e=>e.id),...(e.rig?.groups??[]).map(e=>e.id),...La(e).map(e=>e.id)];function Oa(e,t){const i=La(e);if(i.length>=Ui||Va(e).includes(t.id))return;const n=e.rig??{parts:[]};return{...e,rig:{...n,parts:n.parts??[],shapes:[...i,t]}}}function Pa(e,t,i){if(!e.rig?.shapes)return e;const n=e.rig.shapes.map(e=>{if(e.id!==t)return e;const n={...e,...i};for(const e of Object.keys(n))void 0===n[e]&&delete n[e];return n});return{...e,rig:{...e.rig,shapes:n}}}function Ra(e,t,i){const n=[...La(e)],s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const[r]=n.splice(s,1);return n.splice(Math.max(0,Math.min(n.length,i)),0,r),{...e,rig:{...e.rig,shapes:n}}}function Da(e,t,i){const n=La(e),s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const r="under"===n[s].layer?"under":"over",a=e=>("under"===e.layer?"under":"over")===r,o=[...n],[l]=o.splice(s,1);let c=-1;if("up"===i)c=n.findIndex((e,t)=>t>s&&a(e));else for(let e=s-1;e>=0;e--)if(a(n[e])){c=e;break}if(c>=0)return o.splice(c,0,l),{...e,rig:{...e.rig,shapes:o}};if("over"===r==("up"===i))return e;const d={...l,layer:"over"===r?"under":"over"};if("over"===d.layer){const e=o.findIndex(e=>"under"!==e.layer);o.splice(e<0?s:e,0,d)}else{let e=-1;o.forEach((t,i)=>{"under"===t.layer&&(e=i)}),o.splice(e<0?s:e+1,0,d)}return{...e,rig:{...e.rig,shapes:o}}}function Na(e,t){if(!e.rig?.shapes)return e;const i=`shape:${t}`,n={...e,rig:{...e.rig,shapes:e.rig.shapes.filter(e=>e.id!==t)}};return e.tracks&&(n.tracks=e.tracks.filter(e=>e.target!==i)),e.bindings&&(n.bindings=e.bindings.filter(e=>e.target!==i)),n}const Ta=(e,t)=>e.tracks?.find(e=>e.target===t);function Fa(e,t,i){const n=e.tracks??[],s=n.findIndex(e=>e.target===i);return t?s<0?n.length>=24?void 0:{...e,tracks:[...n,t]}:{...e,tracks:n.map((e,i)=>i===s?t:e)}:s<0?e:{...e,tracks:n.filter((e,t)=>t!==s)}}const Ia=(e,t)=>!!Ta(e,t)?.keyframes.some(e=>void 0!==e.draw);function Ba(e,t,i,n){const s=Ta(e,t);if(!i){if(!s?.path)return e;const i={...s};return delete i.path,Fa(e,i.keyframes.length?i:void 0,t)}const r=(0,de.Mj)(i)[0]?.[0]?.[0];return r?Fa(e,{...s??{target:t,keyframes:[]},target:t,path:{d:ba(i,-r[0],-r[1]),...n?{follow_rotation:!0}:{}}},t):e}const Za={target:["hide","solo","lock"],part:["hide","solo","lock"],group:["hide","solo","lock"],shape:["hide","solo","lock"],lane:["hide","solo","lock"],emitter:["hide","solo","lock"],children:["hide","solo","lock"],pshape:[],content:[],path:["lock"],subject:["lock"],step:["hide","solo","lock"]},Ka={hidden:[],solo:[],locked:[],open:[]},Wa=["icon","name","state","background"];function Ua(e){const t="particles"===e.kind?e.particles?.sim:void 0;if(!t)return[];const i=t.emitters??[];return[t.id??"main",...i.map((e,t)=>e.id??`e${t+1}`)]}function Ga(e){const t=[];"keyframes"===e.kind&&t.push([_r(e),e.keyframes??[]]);for(const i of e.tracks??[])t.push([i.target,i.keyframes]);return t}function Ya(e,t){return Ds(Ga(e).filter(([e])=>e===t).flatMap(([,e])=>e))}function Ja(e,t,i){return Fs(Ga(e).filter(([e])=>e===t).flatMap(([,e])=>e),i)}function Xa(e){const t=new Map;if("keyframes"===e.kind){for(const e of Wa)t.set(`target:${e}`,"targets");for(const i of e.rig?.parts??[])t.set(`part:${i.id}`,"parts");for(const i of e.rig?.groups??[])t.set(`group:${i.id}`,"parts");for(const i of e.rig?.shapes??[])t.set(`shape:${i.id}`,"under"===i.layer?"under":"over");for(const[i,n]of Ga(e))for(const e of Ds(n))t.set(`lane:${i}|${e}`,"lanes")}const i="particles"===e.kind?e.particles?.sim:void 0;if(i){const n=Ua(e),s=[i.children,...(i.emitters??[]).map(e=>e.children)];n.forEach((e,i)=>{t.set(`emitter:${e}`,"emitters"),s[i]&&t.set(`children:${e}`,"emitters")})}else"particles"===e.kind&&e.particles&&t.set("emitter:main","emitters");return"sequence"===e.kind&&(e.steps??[]).forEach((e,i)=>t.set(`step:${i}`,"steps")),t}const Qa="parents:";function eo(e,t){const i=Xa(e),n=new Set(t.hidden.filter(e=>i.has(e))),s=new Set(t.solo.filter(e=>i.has(e)));if(!s.size)return n;const r=new Set([...s].map(e=>i.get(e))),a=new Map;for(const t of e.rig?.groups??[])for(const e of t.parts)a.has(e)||a.set(e,t.id);for(const[e,t]of i){if(!r.has(t)||s.has(e))continue;const[i,...o]=e.split(":"),l=o.join(":");if("parts"===t){if("group"===i||s.has(`group:${a.get(l)}`))continue}else if("emitters"===t){const t=l;if("children"===i){if(s.has(`emitter:${t}`))continue}else if(s.has(`children:${t}`)&&!n.has(e)){n.add(`${Qa}${t}`);continue}}n.add(e)}return n}function to(e,t){const[i,...n]=t.split(":"),s=n.join(":");if("part"===i){const t=e.rig?.groups?.find(e=>e.parts.includes(s));return t?`group:${t.id}`:void 0}if("children"===i)return`emitter:${s}`;if("lane"===i){const e=t.slice(5,t.lastIndexOf("|"));return/^(part|group|shape):/.test(e)?e:`target:${e}`}}const io={hide:"hidden",solo:"solo",lock:"locked"},no=(e,t,i)=>{for(let n=i,s=0;n&&s<4;n=to(e,n),s++)if(t.locked.includes(n))return!0;return!1},so={rotate:"rotate",rotate_speed:"rotate",x:"x",y:"y",scale:"scale",opacity:"opacity",draw:"draw",color_mix:"color"};function ro(e,t){return e.map(e=>t.reduce(Rs,e)).filter(e=>!Vs(e))}function ao(e){const t=e=>/^(part|group|shape):/.test(e)?e:`target:${e}`;return"keys"===e.kind?(e.keys??[]).map(e=>"*"===e.lane?t(e.target):`lane:${e.target}|${e.lane}`):(e.targets?.length?e.targets:e.target?[e.target]:[]).map(t)}function oo(e,t,i){return t.locked.length>0&&ao(i).some(i=>no(e,t,i))}function lo(e,t,i){return co(e,e=>e===t?i:t<i?e>t&&e<=i?e-1:e:e>=i&&e<t?e+1:e)}function co(e,t){const i=e=>{let i=!1;const n=[];for(const s of e){const e=/^step:(\d+)$/.exec(s);if(!e){n.push(s);continue}const r=t(Number(e[1]));r!==Number(e[1])&&(i=!0),r>=0&&n.push(`step:${r}`)}return i?n:e},n={hidden:i(e.hidden),solo:i(e.solo),locked:i(e.locked),open:i(e.open)};return n.hidden===e.hidden&&n.solo===e.solo&&n.locked===e.locked&&n.open===e.open?e:n}const po=n.AH`
  .lock-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
    padding: 6px 8px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-sm, 6px);
    font-size: 0.8125rem;
    color: var(--mc-text);
  }
  .lock-banner ha-icon {
    --mdc-icon-size: 16px;
    flex: none;
  }
  .lock-banner .txt {
    flex: 1;
    min-width: 0;
  }
`;function ho(e,t,i){return n.qy`<div class="lock-banner" role="status"><ha-icon icon="mdi:lock-outline"></ha-icon><span class="txt">${In(430)}</span><button type="button" class="btn btn-text btn-sm unlock" @click=${n=>{const s=function(e,t,i){const n=new Set;for(const s of i)for(let i=s,r=0;i&&r<4;i=to(e,i),r++)t.locked.includes(i)&&n.add(i);return n.size?{...t,locked:t.locked.filter(e=>!n.has(e))}:t}(e,t,i);n.currentTarget.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:s,announce:In(1037)},bubbles:!0,composed:!0}))}}>${In(1036)}</button></div>`}const uo={fall:"fall",rise:"rise",drift:"drift",burst:"burst",orbit:"orbit",spiral:"spiral",fountain:"rise",explode:"burst",wave:"drift",vortex:"spiral",zigzag:"fall",rain:"fall",wander:"drift"},mo=["circle","square","triangle","star","heart","ring","line","spark"],go={parents:60,childrenPerParent:8,elements:160,shapes:6,emitters:4,parts:2,stopsPerElement:32,warnBytes:65536,maxBytes:131072,dt:1/60,geometryVariants:4},fo={aspect:2};function vo(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const bo=(e,t)=>{let i=Math.imul(e>>>0^Math.imul(t,2654435761),2246822507);return i^=i>>>13,i=Math.imul(i,3266489909),(i^i>>>16)>>>0};function yo(e,[t,i]){const n=Math.min(t,i),s=Math.max(t,i),r=e();return s===n?n:n+r*(s-n)}const xo=Math.PI/180;function _o(e){const t=e.angle*xo;return{x:-Math.sin(t)*e.strength,y:Math.cos(t)*e.strength}}const $o=e=>e*e*(3-2*e),wo=(e,t,i)=>e+(t-e)*i;function ko(e,t,i,n){const s=Math.floor(t),r=Math.floor(i),a=Math.floor(n),o=$o(t-s),l=$o(i-r),c=$o(n-a),d=(t,i,n)=>function(e,t,i,n){let s=e^Math.imul(t,668265261)^Math.imul(i,374761393)^Math.imul(n,2654435761);return s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),((s^s>>>16)>>>0)/4294967296}(e,s+t,r+i,a+n),p=wo(wo(d(0,0,0),d(1,0,0),o),wo(d(0,1,0),d(1,1,0),o),l),h=wo(wo(d(0,0,1),d(1,0,1),o),wo(d(0,1,1),d(1,1,1),o),l);return 2*wo(p,h,c)-1}const Mo=2*Math.PI,So=Math.PI/180,jo=(e,t,i)=>t/2+(e()-.5)*t*(Math.max(0,i)/100),Co=e=>Math.max(5,e.spread/2),Ao=(e,t)=>{e.x=t.W/2,e.y=t.H/2},zo=(e,t,i,n)=>{n.x+=3*(t-e.vx),n.y+=3*(i-e.vy)},qo=(e,t)=>{const i=e.x-t.W/2,n=e.y-t.H/2,s=Math.hypot(i,n)||1e-6,r=i/s,a=n/s;return{r:s,ux:r,uy:a,tx:-a*e.dir,ty:r*e.dir}},Eo=(e,t)=>{const i=t*So;e.vx=Math.sin(i)*e.speed,e.vy=-Math.cos(i)*e.speed},Ho=e=>Math.max(.1,e.lifeMean/4),Lo={persistent:!1,spawn(e,t,i,n){e.x=jo(t,i.W,i.spread),e.y=-n,e.vx=0,e.vy=e.speed}},Vo={fall:Lo,rise:{persistent:!1,spawn(e,t,i,n){e.x=jo(t,i.W,i.spread),e.y=i.H+n,e.vx=0,e.vy=-e.speed}},drift:{persistent:!1,spawn(e,t,i,n){e.x=-n,e.y=jo(t,i.H,i.spread),e.vx=e.speed,e.vy=0}},burst:{persistent:!1,spawn(e,t,i){Ao(e,i),Eo(e,360*t())}},orbit:{persistent:!0,spawn(e,t,i){const n=t()*Mo,s=Co(i);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const r=qo(e,i);e.vx=r.tx*e.speed,e.vy=r.ty*e.speed},accel(e,t,i){const n=qo(e,t),s=2*(Co(t)-n.r);zo(e,n.tx*e.speed+n.ux*s,n.ty*e.speed+n.uy*s,i)}},spiral:{persistent:!1,spawn(e,t,i){const n=t()*Mo;e.x=i.W/2+Math.cos(n),e.y=i.H/2+Math.sin(n);const s=qo(e,i);e.vx=(.6*s.ux+s.tx)*e.speed,e.vy=(.6*s.uy+s.ty)*e.speed},accel(e,t,i){const n=qo(e,t);zo(e,(.6*n.ux+n.tx)*e.speed,(.6*n.uy+n.ty)*e.speed,i)}},fountain:{persistent:!1,spawn(e,t,i,n){e.x=i.W/2+(t()-.5)*i.W*(Math.max(0,i.spread)/100)*.25,e.y=i.H+n,Eo(e,40*(t()-.5))},fall:e=>2*e.vMean/Math.max(.1,e.lifeMean)},explode:{persistent:!1,spawn(e,t,i){Ao(e,i),Eo(e,150*(t()-.5))},fall:e=>1.5*e.vMean/Math.max(.1,e.lifeMean)},wave:{persistent:!1,spawn(e,t,i,n){const s=t()*Mo,r=2*Mo/Math.max(.2,i.lifeMean);e.baseY=jo(t,i.H,i.spread),e.x=-n,e.y=e.baseY+8*Math.sin(s),e.vx=e.speed,e.vy=8*r*Math.cos(s)},accel(e,t,i){const n=2*Mo/Math.max(.2,t.lifeMean);i.y+=-n*n*(e.y-e.baseY)}},vortex:{persistent:!1,spawn(e,t,i){const n=t()*Mo,s=Math.max(10,i.spread/2);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const r=qo(e,i);e.vx=r.tx*e.speed,e.vy=r.ty*e.speed},accel(e,t,i){const n=qo(e,t),s=n.r>2?.4:0;zo(e,(n.tx-n.ux*s)*e.speed,(n.ty-n.uy*s)*e.speed,i)}},zigzag:{persistent:!1,spawn(e,t,i,n){Lo.spawn(e,t,i,n);const s=Ho(i);e.baseX=e.x,e.vx=24*-e.dir/s},accel(e,t,i){const n=Ho(t),s=Math.floor(e.age/n)%2==0?1:-1;i.x+=s*e.dir*48/(n*n)}},rain:{persistent:!1,align:!0,spawn(e,t,i,n){e.x=t()*i.W*(.2+Math.max(0,i.spread)/100)-.1*i.W,e.y=-n,e.vx=0,e.vy=e.speed}},wander:{persistent:!0,spawn(e,t,i){e.x=jo(t,i.W,i.spread),e.y=jo(t,i.H,i.spread),e.baseX=e.x,e.baseY=e.y,Eo(e,360*t())},accel(e,t,i){const n=ko(625341585^t.noiseSeed,e.x/20,e.y/20,.4*e.age)*Mo;zo(e,Math.cos(n)*e.speed+.8*(e.baseX-e.x),Math.sin(n)*e.speed+.8*(e.baseY-e.y),i)}}},Oo=go.dt,Po=2*Oo,Ro={builtin:"circle"},Do=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy}),No=([e,t])=>(e+t)/2,To=(e,t)=>Math.min(Math.max(e,Po),Math.max(Po,Math.min(20,t-Po)));function Fo(e,t,i){const n=e.sim,s=i.aspect>0?i.aspect:2,r=s>=1?100*s:100,a=s>=1?100:100/s,o=Vo[n.flow]??Vo.fall,l=bo(n.seed,3),c={W:r,H:a,spread:e.spread,vMean:Math.abs(No(n.ranges.speed)),lifeMean:To(No(n.ranges.lifetime),t),noiseSeed:l},d=function(e,t,i,n){const s=t.content,r="none"!==e.content&&s&&s.w>0&&s.h>0?{x0:s.x/100*i,y0:s.y/100*n,x1:(s.x+s.w)/100*i,y1:(s.y+s.h)/100*n}:void 0;return{floor:e.floor,ceiling:e.ceiling,left:e.left,right:e.right,...r?{content:r}:{}}}(n.colliders,i,r,a),p=((e,t)=>({x:e.x+t.x,y:e.y+t.y}))(_o(n.physics.gravity),{x:0,y:o.fall?.(c)??0});return{spec:e,sim:n,period:t,W:r,H:a,flow:o,ctx:c,physics:n.physics,colliders:d,...d.content?{content:d.content}:{},gravity:p,rest:(h=p,2+2*Math.hypot(h.x,h.y)*Oo),noiseSeed:l};var h}const Io=(e,t)=>{const i=function(e,t){const i=e();let n=0;for(const e of t)n+=e>0?e:0;if(!(n>0))return 0;let s=0;const r=i*n;for(let e=0;e<t.length;e++)if(s+=t[e]>0?t[e]:0,r<s)return e;for(let e=t.length-1;e>=0;e--)if(t[e]>0)return e;return 0}(e,t.map(e=>e.weight));return t.length?t[i].shape:Ro},Bo=e=>e/2/120*100;function Zo(e,t,i){const{sim:n,spec:s,period:r}=e,a=Io(t,n.shapes),o=yo(t,s.size),l=yo(t,n.ranges.speed),c=yo(t,n.ranges.spin),d=t()<.5?-c:c,p=yo(t,n.ranges.delay),h=yo(t,n.ranges.lifetime),u=yo(t,n.ranges.opacity),m=t()<.5?-1:1,g=Bo(o),f=e.flow.persistent&&r<=20,v={index:i,x:0,y:0,vx:0,vy:0,age:0,speed:l,dir:m,baseX:0,baseY:0,birth:r>0?(Math.max(0,p)%r+r)%r:0,life:f?r:To(h,r),spin:d,peak:u,size:o,radius:g,shape:a,...s.colors.length?{color:s.colors[i%s.colors.length]}:{},persistent:f,physics:e.physics,gravity:e.gravity,flow:e.flow};return e.flow.spawn(v,t,e.ctx,g),v}function Ko(e,t,i,n){if(e.persistent)return i?.675+.325*Math.cos(t/n*Math.PI*2):1;const s=i?.1*e.life:Oo;return Math.max(0,Math.min(1,t/s,(e.life-t)/s))}function Wo(e,t){let i=t.spin*t.age;return t.flow?.align&&(t.vx||t.vy)&&(i+=180*Math.atan2(-t.vx,t.vy)/Math.PI),{age:t.age,x:t.x,y:t.y,rotate:i,opacity:t.peak*Ko(t,t.age,e.spec.fade,e.period),scale:1}}function Uo(e,t,i){const n={x:t.gravity.x,y:t.gravity.y},s=function(e,t,i,n){if(!(t.strength>0))return{x:0,y:0};const s=Math.max(1,t.scale),r=.6*n;return{x:ko(e,i.x/s,i.y/s,r)*t.strength,y:ko(1540483477^e,i.x/s,i.y/s,r+17)*t.strength}}(e.noiseSeed,t.physics.turbulence,t,t.age);n.x+=s.x,n.y+=s.y,t.flow?.accel?.(t,e.ctx,n);const r=((e,t)=>e>0?Math.exp(-e*t):1)(t.physics.drag,i);return t.vx=(t.vx+n.x*i)*r,t.vy=(t.vy+n.y*i)*r,t.x+=t.vx*i,t.y+=t.vy*i,t.age+=i,function(e,t,i,n,s,r,a,o){let l;const c=(t,i,n,s)=>{e.x=n,e.y=s;const c=e.vx*t+e.vy*i;if(c>=0)return;const d=e.vx-c*t,p=e.vy-c*i,h=Math.sqrt(Math.max(0,r));let u=-c*r;u<a&&(u=0),e.vx=d*h+u*t,e.vy=p*h+u*i,-c>=a&&!l&&(l={age:o,x:n,y:s,nx:t,ny:i,speed:-c})};s.floor&&e.y>n-t&&c(0,-1,e.x,n-t),s.ceiling&&e.y<t&&c(0,1,e.x,t),s.left&&e.x<t&&c(1,0,t,e.y),s.right&&e.x>i-t&&c(-1,0,i-t,e.y);const d=s.content;if(d&&e.x>d.x0-t&&e.x<d.x1+t&&e.y>d.y0-t&&e.y<d.y1+t){const i=e.x-(d.x0-t),n=d.x1+t-e.x,s=e.y-(d.y0-t),r=d.y1+t-e.y,a=Math.min(i,n,s,r);a===s?c(0,-1,e.x,d.y0-t):a===r?c(0,1,e.x,d.y1+t):a===i?c(-1,0,d.x0-t,e.y):c(1,0,d.x1+t,e.y)}return l}(t,t.radius,e.W,e.H,e.colliders,t.physics.bounce,e.rest,t.age)}function Go(e,t,i){const n=[Wo(e,t)],s=[];let r=void 0!==i&&i<=0?Do(t):void 0;const a=t.x,o=t.y,l=Math.ceil(t.life/Oo-1e-9);for(let c=0;c<l;c++){const d=Math.min(Oo,t.life-t.age);if(d<=1e-12)break;const p=Uo(e,t,d);c===l-1&&(t.age=t.life),p&&s.push({...p,vx:t.vx,vy:t.vy}),void 0!==i&&!r&&t.age>=i-1e-9&&(r=Do(t));const h=Wo(e,t);if(t.persistent){const e=Math.max(0,Math.min(1,(t.age-.85*t.life)/(.15*t.life))),i=e*e*(3-2*e);h.x+=(a-h.x)*i,h.y+=(o-h.y)*i}n.push(h)}const c=n[n.length-1];return{samples:n,hits:s,...r?{at:r}:{},end:{...Do(t),x:c.x,y:c.y}}}const Yo=Math.PI/180,Jo=e=>e?Math.max(0,Math.min(go.childrenPerParent,Math.floor(e.count))):0;function Xo(e,t){return"collision"===e.trigger?t.hits[0]:"time"===e.trigger?t.at:t.end}function Qo(e,t,i,n,s,r){const a=Jo(t),{physics:o,gravity:l}=function(e,t){const i=t.physics??{},n={...e.physics,...i},s=e.gravity.y-_o(e.physics.gravity).y,r=_o(n.gravity);return{physics:n,gravity:{x:r.x,y:r.y+s}}}(e,t),c=Math.hypot(n.vx,n.vy),d=void 0!==n.nx&&void 0!==n.ny?Math.atan2(n.nx,-n.ny):c>1e-9?Math.atan2(n.vx,-n.vy):0,p=Math.max(0,Math.min(360,t.cone))*Yo,h=[];for(let c=0;c<a;c++){const a=Io(s,t.shapes),u=yo(s,t.size),m=yo(s,t.ranges.speed),g=yo(s,t.ranges.spin),f=s()<.5?-g:g,v=To(yo(s,t.ranges.lifetime),e.period),b=yo(s,t.ranges.opacity),y=d+(s()-.5)*p;if(c>=r)continue;const x=t.colors.length?t.colors[c%t.colors.length]:i.color;h.push({index:c,x:n.x,y:n.y,vx:Math.sin(y)*m+n.vx*t.inherit,vy:-Math.cos(y)*m+n.vy*t.inherit,age:0,speed:m,dir:1,baseX:n.x,baseY:n.y,birth:((i.birth+n.age)%e.period+e.period)%e.period,life:v,spin:f,peak:b,size:u,radius:Bo(u),shape:a,...void 0!==x?{color:x}:{},persistent:!1,physics:o,gravity:l})}return h}function el(e,t,i){const n=t.t-e.t,s=n>0?(i.t-e.t)/n:0,r=i=>e[i]+(t[i]-e[i])*s;return Math.max(Math.abs(i.x-r("x")),Math.abs(i.y-r("y")),Math.abs(i.rotate-r("rotate"))/3.6,100*Math.abs(i.opacity-r("opacity")),100*Math.abs(i.scale-r("scale")))}function tl(e){const t=e.length,i=new Float64Array(t);if(!t)return i;i[0]=1/0,i[t-1]=1/0;for(let n=1;n<t-1;n++)e[n].keep&&(i[n]=1/0);const n=[];for(let e=0;e<t;e++)i[e]===1/0&&n.push(e);const s=[];for(let e=0;e+1<n.length;e++)s.push([n[e],n[e+1],1/0]);for(;s.length;){const[t,n,r]=s.pop();if(n-t<2)continue;let a=-1,o=t+1;for(let i=t+1;i<n;i++){const s=el(e[t],e[n],e[i]);s>a&&(a=s,o=i)}const l=Math.min(a,r);i[o]=l,s.push([t,o,l],[o,n,l])}return i}function il(e,t,i,n){let s=0;for(let e=0;e<t.length;e++)t[e]>i&&s++;let r=i;if(s>n){const s=Array.from(t).sort((e,t)=>t-e);if(r=Math.max(i,s[n-1]===1/0?1/0:s[n]),r===1/0)return e.filter((e,i)=>t[i]===1/0).slice(0,n)}return e.filter((e,i)=>t[i]>r)}const nl=e=>e.reduce((e,t)=>e+t,0);function sl(e){const t=[e,...(e.sim.emitters??[]).slice(0,go.emitters-1).map(t=>((e,t)=>({...e,count:t.count,size:t.size,colors:t.colors,fade:t.fade,spread:t.spread,layer:t.layer??e.layer,sim:{...e.sim,seed:t.seed,flow:t.flow,shapes:t.shapes,ranges:t.ranges,physics:t.physics,children:t.children}}))(e,t))];let i=go.parents;const n=t.map(e=>{const t=Math.min(Math.max(0,Math.floor(e.count)),i);return i-=t,t}),s=t.map((e,t)=>n[t]*Jo(e.sim.children)),r=go.elements-nl(n);let a=s;if(nl(s)>r){const e=nl(n.filter((e,t)=>s[t]));a=s.map((t,i)=>t&&Math.min(t,Math.floor(r*n[i]/e)));let t=r-nl(a);a=a.map((e,i)=>e<s[i]&&t-- >0?e+1:e)}const o="front"!==e.layer,l=t.map((e,t)=>({spec:e,n:n[t],m:a[t],at:0,front:"front"===e.layer,index:t})),c=e=>e.front===o,d=[...l.filter(e=>!c(e)),...l.filter(c)];let p=0;d.forEach(e=>{e.at=p,p+=e.n+e.m});const h=d.findIndex(c);return{plans:d,cut:h<0?d.length:h,pool:p}}const rl=e=>e.cut<e.plans.length?e.plans[e.cut].at:e.pool,al=go,ol=[.5,1,2,4,8,16,32],ll=(e,t)=>{const i=10**t,n=Math.round(e*i)/i;return 0===n?0:n},cl=(e,t,i)=>Math.min(i,Math.max(t,e));function dl(e){const t=Number.isFinite(e.aspect)&&e.aspect>0?e.aspect:2,i=cl(Math.round(4*t)/4,.25,8),n=e.content;if(!n||![n.x,n.y,n.w,n.h].every(Number.isFinite))return{aspect:i};const s=e=>cl(5*Math.round(e/5),0,100);return{aspect:i,content:{x:s(n.x),y:s(n.y),w:s(n.w),h:s(n.h)}}}function pl(e){return`${(e=>ll(100*e,3))(e.t)}%{translate:${e.x}cqw ${e.y}cqh;rotate:${e.rotate}deg;opacity:${e.opacity}${1!==e.scale?`;scale:${e.scale}`:""}}`}const hl=e=>e.reduce((e,t)=>e+pl(t).length,160);function ul(e,t,i){const n=e.period,s=i.map(e=>({...e,tau:t.birth+e.age}));let r;if(t.persistent?s[s.length-1]={...s[0],tau:t.birth+n}:(s[0].keep=!0,s[s.length-1].keep=!0,s.push({...s[0],tau:t.birth+n,keep:!0})),t.birth<=0)r=s;else{let e=s.findIndex(e=>e.tau>=n);e<1&&(e=1);const t=s[e].tau===n?{...s[e],keep:!0}:((e,t,i)=>{const n=t.tau>e.tau?(i-e.tau)/(t.tau-e.tau):0,s=i=>e[i]+(t[i]-e[i])*n;return{tau:i,age:s("age"),x:s("x"),y:s("y"),rotate:s("rotate"),opacity:s("opacity"),scale:s("scale"),keep:!0}})(s[e-1],s[e],n),i=s.slice(0,e),a=s.slice(s[e].tau===n?e+1:e,-1).map(e=>({...e,tau:e.tau-n}));r=[{...t,tau:0},...a,...i,{...t,tau:n}]}const a=t.persistent?360*Math.round(t.spin*n/360):0,o=r.map(i=>({t:i.tau/n,x:i.x/e.W*100,y:i.y/e.H*100,rotate:t.persistent?a*i.tau/n:i.rotate,opacity:i.opacity,scale:i.scale,...i.keep?{keep:!0}:{}}));return o[0].t=0,o[o.length-1].t=1,o}function ml(e){const t=[];return e.forEach((i,n)=>{const s=n===e.length-1?1:ll(i.t,5),r={t:s,x:ll(i.x,2),y:ll(i.y,2),rotate:ll(i.rotate,1),opacity:ll(cl(i.opacity,0,1),3),scale:ll(i.scale,3)},a=t[t.length-1];a&&a.t>=s?(n===e.length-1||i.keep)&&(t[t.length-1]=r):t.push(r)}),t}function gl(e){const t=e.period>0&&Number.isFinite(e.period)?e.period:1,i=dl(e.geometry),n=sl(e.spec),s=[],r={elements:0,stops:0,bytes:0,capped:!1,warn:!1};let a=0;n.plans.forEach((e,o)=>{o===n.cut&&(a=s.length);const l=function(e,t,i,n){const s=e.spec,r=s.sim,a=Fo(s,t,i),o=e.n;let l=Math.floor(s.count)>o;const c=r.children,d=Jo(c),p=vo(r.seed),h=[],u=[];for(let e=0;e<o;e++){const t=Zo(a,p,e),i=Go(a,t,"time"===c?.trigger?c.at??0:void 0);u.push(i);const n=ul(a,t,i.samples);h.push({p:t,raw:n,rank:tl(n)})}const m=[];if(c&&d>0){const t=h.map((e,t)=>Xo(c,u[t])?t:-1).filter(e=>e>=0),i=e.m,n=t.length?Math.floor(i/t.length):0,s=t.length?i%t.length:0;t.length*d>i&&(l=!0);const o=vo(bo(r.seed,2));t.forEach((e,t)=>{const i=Math.min(d,n+(t<s?1:0)),r=Xo(c,u[e]);for(const t of Qo(a,c,h[e].p,r,o,i)){const i=ul(a,t,Go(a,t).samples);m.push({p:t,raw:i,rank:tl(i),parent:e})}})}let g=d,f=[],v=0;for(;;){const e=[...h,...m.filter(e=>e.p.index<g)];for(const t of ol){f=[],v=0;const i=new Map;if(e.forEach((e,n)=>{void 0===e.parent&&i.set(e.p.index,n);const s=ml(il(e.raw,e.rank,t,al.stopsPerElement));v+=hl(s),f.push({slot:n,...void 0!==e.parent?{parent:i.get(e.parent)}:{},shape:{...e.p.shape},size:ll(e.p.size,2),...void 0!==e.p.color?{color:e.p.color}:{},stops:s})}),v<=n)break;l=!0}if(v<=n||0===g)break;g=Math.floor(g/2)}for(;v>n&&f.length;){const e=f.pop();v-=hl(e.stops),l=!0}const b=f.reduce((e,t)=>e+t.stops.length,0);return{engine:1,period:t,geometry:i,elements:f,stats:{elements:f.length,stops:b,bytes:v,capped:l,warn:v>al.warnBytes}}}(e,t,i,n.plans[1]?Math.floor(al.maxBytes*(e.n+e.m)/n.pool):al.maxBytes);l.elements.forEach(t=>s.push({...t,slot:t.slot+e.at,...void 0!==t.parent?{parent:t.parent+e.at}:{}})),r.stops+=l.stats.stops,r.bytes+=l.stats.bytes,r.capped||=l.stats.capped}),r.elements=s.length,r.warn=r.bytes>al.warnBytes;const o=n.plans[n.cut];return{engine:1,period:t,geometry:i,elements:s,stats:r,...o?{parts:{element:a,slot:o.at,front:o.front}}:{}}}const fl=(e,t,i)=>`mcc-${e}-${dn(JSON.stringify([t,i]))}`,vl=(e,t)=>`${e}-g${function(e){const t=e.content;return`${Math.round(4*e.aspect)}${t?`c${t.x}_${t.y}_${t.w}_${t.h}`:""}`}(t)}`;function bl(e){const t=e.shape,i={x:0,phase:0,k:0,style:""};return"builtin"in t?i.shape=t.builtin:"icon"in t?i.symbol={icon:t.icon}:"emoji"in t&&(i.symbol={text:t.emoji}),i}function yl(e,t){if(!e.length)return{t,x:0,y:0,rotate:0,scale:1,opacity:0};const i=e.findIndex(e=>e.t>=t);if(i<=0)return{...e[0===i?0:e.length-1],t};const n=e[i-1],s=e[i],r=s.t>n.t?(t-n.t)/(s.t-n.t):0,a=e=>n[e]+(s[e]-n[e])*r;return{t,x:a("x"),y:a("y"),rotate:a("rotate"),scale:a("scale"),opacity:a("opacity")}}function xl(e,t,i,n,s=e=>e){const r=`.mc-anim-fx[data-fx="${e}"]`,a=`mcp${dn(e)}-`,o=[`${r}{opacity:var(${hn(t,"s")},1)}`,`${r}>i{left:0;top:0;width:var(--mcc-sz);height:var(--mcc-sz);margin:calc(var(--mcc-sz)/-2) 0 0 calc(var(--mcc-sz)/-2);color:var(--mcc-pc,var(${hn(t,"c")},var(--mc-anim-c)));display:flex;align-items:center;justify-content:center;font-size:var(--mcc-sz);line-height:1;font-style:normal;--mdc-icon-size:var(--mcc-sz);${n?"animation-timing-function:linear":"animation:none"}}`],l=new Map;return i.forEach((e,t)=>{const i=s(t);"svg"in e.shape&&l.set(e.shape.svg,[...l.get(e.shape.svg)??[],i]);const c=n?`animation-name:${a}${i};`:"",d=e.color?it(e.color,"color"):void 0;var p;o.push(`${r}>i:nth-child(${i+1}){${c}--mcc-sz:${p=e.size,Math.round(100*p)/100||0}px${d?`;--mcc-pc:${d}`:""}}`),n&&o.push(`@keyframes ${a}${i}{${n(t)}}`)}),l.forEach((e,t)=>{const i=Ne(t).markup,n=i?`-webkit-mask:${jn(i)} center/contain no-repeat;mask:${jn(i)} center/contain no-repeat`:"border-radius:50%";o.push(`${r}>i:is(${e.map(e=>`:nth-child(${e+1})`).join(",")}){background:currentColor;${n}}`)}),o.join("\n")}function _l(e,t,i,n,s=0,r=e.elements.length,a=0){const o=e.elements.slice(s,r),l=o.map(e=>n?.[e.slot]??(e=>({shape:e.shape,size:e.size,...void 0!==e.color?{color:e.color}:{}}))(e));return{css:xl(t,i,l,e=>o[e].stops.map(pl).join(""),n?e=>o[e].slot-a:void 0),slots:(n??l).map(bl)}}const $l={circle:{d:"M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"},square:{d:"M5 5h14v14H5z"},triangle:{d:"M12 4l8 15H4z"},star:{d:"M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"},heart:{d:"M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"},ring:{d:"M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z",stroke:3},line:{d:"M6 19L18 5",stroke:3},spark:{d:"M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"}};function wl(e){const t=$l[e];return t.stroke?`<path d="${t.d}" fill="none" stroke="currentColor" stroke-width="${t.stroke}" stroke-linecap="round"/>`:`<path d="${t.d}"/>`}const kl=[".mc-anim-fx>i[data-s]{background:currentColor}",'.mc-anim-fx>i[data-s="circle"]{border-radius:50%}','.mc-anim-fx>i[data-s="square"]{border-radius:0}',...mo.filter(e=>"circle"!==e&&"square"!==e).map(e=>`.mc-anim-fx>i[data-s="${e}"]{${(e=>{const t=jn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${wl(e)}</svg>`);return`-webkit-mask:${t} center/contain no-repeat;mask:${t} center/contain no-repeat`})(e)}}`)].join("\n"),Ml=e=>String(Math.round(100*e)/100||0),Sl=e=>String(Math.round(1e3*e)/1e3||0),jl=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function Cl(e){const t=void 0!==e?it(e,"color"):void 0;return t&&!/var\(/i.test(t)?t:void 0}const Al=(e,t)=>`transform:translate(${Ml(e.x)}px,${Ml(e.y)}px) rotate(${Ml(e.rotate)}deg) scale(${Sl(e.scale*t)});opacity:${Sl(e.opacity)}`,zl="particles.sim",ql=[...Ue,"fountain","explode","wave","vortex","zigzag","rain","wander"],El=["death","collision","time"],Hl=["none","icon","text"],Ll=[0,1e3],Vl=[-3600,3600],Ol=[0,6e3],Pl=[.01,600],Rl=[0,1],Dl=[.001,1e3],Nl=[-360,360],Tl=[0,1e3],Fl=[0,20],Il=[0,1e3],Bl=[.1,1e3],Zl=[0,1],Kl=[0,600],Wl=[.1,200],Ul=[0,360],Gl=[0,1],Yl={speed:[20,40],spin:[0,0],delay:[0,2],lifetime:[2,2],opacity:[1,1]},Jl={gravity:{angle:0,strength:0},drag:0,turbulence:{strength:0,scale:20},bounce:.5},Xl={floor:!1,ceiling:!1,left:!1,right:!1,content:"none"},Ql=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function ec(e,t,i,n,s,r,a){const o=t[i];if(null==o)return[...r];if(!Array.isArray(o)||2!==o.length||!o.every(e=>"number"==typeof e&&Number.isFinite(e)))return e.err(n,"Must be [min, max]."),[...r];let[l,c]=o;if(l>c&&(a||e.err(n,"Min must not be above max."),[l,c]=[c,l]),l<s[0]||c>s[1]){if(e.err(n,`Must be between ${s[0]} and ${s[1]}.`),!a)return[...r];l=Math.min(s[1],Math.max(s[0],l)),c=Math.min(s[1],Math.max(s[0],c))}return[l,c]}const tc=(e,t,i,n,s,r,a=!1)=>e.num(t,i,n,s[0],s[1],r,a)??r;function ic(e,t,i){if(null==t)return[];const n=e.list(t,i,go.shapes),s=[];return n?.forEach((t,n)=>{const r=e.obj(t,`${i}[${n}]`);if(!r)return;const a=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["builtin","icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of builtin, icon, emoji or svg.");const r=s[0],a=n[r];if("string"!=typeof a)return e.err(`${i}.${r}`,"Must be text.");if("builtin"===r)return mo.includes(a)?{builtin:a}:e.err(`${i}.builtin`,`Must be one of: ${mo.join(", ")}.`);if("icon"===r)return rt.test(a.trim())?{icon:a.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===r){const t=a.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(o=a,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(o).length:o.length)>Me)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");var o;if(!/<svg[\s>]/i.test(a))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(a);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:a}}(e,r.shape,`${i}[${n}].shape`),o=e.num(r,"weight",`${i}[${n}].weight`,Dl[0],Dl[1],1);a&&void 0!==o&&s.push({shape:a,weight:o})}),s}function nc(e,t,i){if(null==t)return[];const n=[];return e.list(t,i,Ye)?.forEach((t,s)=>{const r=it(t,"color");r?n.push(r):e.err(`${i}[${s}]`,"Not a valid colour.")}),n}function sc(e,t,i,n,s){if(null==t)return s?{}:{...n};const r=e.obj(t,i);if(!r)return s?{}:{...n};const a={},o=e=>!s||void 0!==r[e]&&null!==r[e];if(o("gravity")){const t=Ql(r.gravity)?r.gravity:e.obj(r.gravity??{},`${i}.gravity`)??{};a.gravity={angle:tc(e,t,"angle",`${i}.gravity.angle`,Nl,n.gravity.angle),strength:tc(e,t,"strength",`${i}.gravity.strength`,Tl,n.gravity.strength)}}if(o("drag")&&(a.drag=tc(e,r,"drag",`${i}.drag`,Fl,n.drag)),o("turbulence")){const t=Ql(r.turbulence)?r.turbulence:e.obj(r.turbulence??{},`${i}.turbulence`)??{};a.turbulence={strength:tc(e,t,"strength",`${i}.turbulence.strength`,Il,n.turbulence.strength),scale:tc(e,t,"scale",`${i}.turbulence.scale`,Bl,n.turbulence.scale)}}return o("bounce")&&(a.bounce=tc(e,r,"bounce",`${i}.bounce`,Zl,n.bounce)),a}function rc(e,t,i){if(null==t)return{...Xl};const n=e.obj(t,i);return n?{floor:e.bool(n,"floor",`${i}.floor`,!1),ceiling:e.bool(n,"ceiling",`${i}.ceiling`,!1),left:e.bool(n,"left",`${i}.left`,!1),right:e.bool(n,"right",`${i}.right`,!1),content:e.oneOf(n,"content",`${i}.content`,Hl,"none")??"none"}:{...Xl}}function ac(e,t,i,n){const s=e.obj(t,i);if(!s)return;const r=e.errors.length;void 0!==s.children&&null!==s.children&&e.err(`${i}.children`,"Children cannot have children of their own.");const a=e.oneOf(s,"trigger",`${i}.trigger`,El);a||void 0!==s.trigger||e.err(`${i}.trigger`,"Required.");const o=Ql(s.ranges)?s.ranges:e.obj(s.ranges??{},`${i}.ranges`)??{},l={trigger:a??"death",count:tc(e,s,"count",`${i}.count`,[1,go.childrenPerParent],3,!0),shapes:ic(e,s.shapes,`${i}.shapes`),size:ec(e,s,"size",`${i}.size`,Wl,[4,6],n),colors:nc(e,s.colors,`${i}.colors`),ranges:{speed:ec(e,o,"speed",`${i}.ranges.speed`,Ll,[20,40],n),lifetime:ec(e,o,"lifetime",`${i}.ranges.lifetime`,Pl,[.5,1],n),opacity:ec(e,o,"opacity",`${i}.ranges.opacity`,Rl,[1,1],n),spin:ec(e,o,"spin",`${i}.ranges.spin`,Vl,[0,0],n)},cone:tc(e,s,"cone",`${i}.cone`,Ul,360),inherit:tc(e,s,"inherit",`${i}.inherit`,Gl,0)};"time"===l.trigger?l.at=tc(e,s,"at",`${i}.at`,Kl,.5):void 0===s.at||null===s.at||n||e.err(`${i}.at`,"Only for the trigger time.");const c=sc(e,s.physics,`${i}.physics`,Jl,!0);return Object.keys(c).length&&(l.physics=c),n&&e.errors.length>r?void 0:l}const oc=/^[a-z0-9-]{1,16}$/;function lc(e,t,i,n,s){const r=Ql(t.ranges)?t.ranges:e.obj(t.ranges??{},`${i}.ranges`)??{},a=Yl;return{seed:tc(e,t,"seed",`${i}.seed`,[0,4294967295],0,!0)>>>0,flow:s,shapes:ic(e,t.shapes,`${i}.shapes`),ranges:{speed:ec(e,r,"speed",`${i}.ranges.speed`,Ll,a.speed,n),spin:ec(e,r,"spin",`${i}.ranges.spin`,Vl,a.spin,n),delay:ec(e,r,"delay",`${i}.ranges.delay`,Ol,a.delay,n),lifetime:ec(e,r,"lifetime",`${i}.ranges.lifetime`,Pl,a.lifetime,n),opacity:ec(e,r,"opacity",`${i}.ranges.opacity`,Rl,a.opacity,n)},physics:sc(e,t.physics,`${i}.physics`,Jl,!1)}}function cc(e,t,i,n,s,r){const a="string"==typeof t.id&&oc.test(t.id)&&!n.has(t.id)?t.id:"";a?n.add(a):(s||null!=t.id)&&e.err(`${i}.id`,"Must be 1-16 of a-z, 0-9 and -, and unique.");const o="string"==typeof t.name?t.name.trim():void 0;return(void 0===o?null!=t.name:o.length>40&&!r)&&e.err(`${i}.name`,"Must be text of at most 40 characters."),{id:a,name:o?.slice(0,40)||void 0}}function dc(e,t,i){const n="lenient"===t,s=new pt,r=s.obj(e,zl);if(!r)return{errors:s.errors};if(1!==r.engine&&(s.err(`${zl}.engine`,void 0===r.engine?"Required.":"This card plays engine 1; update Magic Card to play this animation."),n))return{errors:s.errors};const a=s.oneOf(r,"flow",`${zl}.flow`,ql);if(!a&&(void 0===r.flow&&s.err(`${zl}.flow`,"Required."),n))return{errors:s.errors};const o={engine:1,mode:s.oneOf(r,"mode",`${zl}.mode`,["baked","live"],"baked")??"baked",...lc(s,r,zl,n,a??"fall"),colliders:rc(s,r.colliders,`${zl}.colliders`)};if(void 0!==r.children&&null!==r.children){const e=ac(s,r.children,`${zl}.children`,n);e&&(o.children=e)}if(void 0!==r.emitters&&null!==r.emitters){const e=cc(s,r,zl,new Set,!1,n),t=function(e,t,i,n,s){const r=`${zl}.emitters`,a=go.emitters-1,o=new Set(n?[n]:[]),l=[];e.list(t,r,i?1/0:a)?.slice(0,a).forEach((t,n)=>{const s=`${r}[${n}]`,a=e.obj(t,s);if(!a)return;const{id:c,name:d}=cc(e,a,s,o,!0,i),p=e.oneOf(a,"layer",`${s}.layer`,["front","back"]),h=e.errors.length,u=e.oneOf(a,"flow",`${s}.flow`,ql);u||e.err(`${s}.flow`,"Required.");const m={id:c,...d&&{name:d},...p&&{layer:p},count:tc(e,a,"count",`${s}.count`,[1,go.parents],10,!0),size:ec(e,a,"size",`${s}.size`,Wl,[6,10],i),colors:nc(e,a.colors,`${s}.colors`),fade:e.bool(a,"fade",`${s}.fade`,!0),spread:tc(e,a,"spread",`${s}.spread`,[0,100],100),...lc(e,a,s,i,u??"fall")},g=e.errors.length===h,f=null==a.children?void 0:ac(e,a.children,`${s}.children`,i);f&&(m.children=f),i&&!g||l.push(m)});let c=s+l.reduce((e,t)=>e+t.count,0)-go.parents;if(c>0){e.err(r,`At most ${go.parents} particles over all emitters.`);for(let e=l.length;i&&c>0&&e--;){const t=Math.min(c,l[e].count);l[e].count-=t,c-=t}}const d=l.filter(e=>e.count>0),p=new Set(n?[n]:[]);d.forEach(e=>e.id&&!p.has(e.id)?p.add(e.id):e.id="");let h=0;return d.forEach(e=>{if(!e.id){for(;p.has("e"+ ++h););p.add(e.id=`e${h}`)}}),d}(s,r.emitters,n,e.id,i?Math.max(0,Math.floor(i.count)):1);t.length&&Object.assign(o,e.id&&{id:e.id},e.name&&{name:e.name},{emitters:t})}return{sim:o,errors:s.errors}}const pc=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),pc(e,t);return!0},hc=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},uc=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),fc(t)}};function mc(e){void 0!==this._$AN?(hc(this),this._$AM=e,uc(this)):this._$AM=e}function gc(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)pc(n[e],!1),hc(n[e]);else null!=n&&(pc(n,!1),hc(n));else pc(this,e)}const fc=e=>{e.type==z.OA.CHILD&&(e._$AP??=gc,e._$AQ??=mc)};class vc extends z.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),uc(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(pc(this,e),hc(this))}setValue(e){if(E(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let bc;const yc=new WeakMap,xc=new Set,_c=new WeakMap,$c=new WeakSet,wc=new WeakSet,kc=new WeakSet;function Mc(e,t){for(let i=e;i;i=i.parentNode instanceof ShadowRoot?i.parentNode.host:i.parentNode)if(t?i===t:kc.has(i))return!0;return!1}function Sc(e,t){const i=t&&($c.has(e)||!Mc(e));e.toggleAttribute("offscreen",!i),yc.get(e)?.(i)}function jc(e,t=!0,i=!0){const n=function(){if(!bc&&"undefined"!=typeof IntersectionObserver){bc=new IntersectionObserver(e=>{for(const t of e)_c.set(t.target,t.isIntersecting),Sc(t.target,t.isIntersecting)});const[e,t]=[bc.observe.bind(bc),bc.unobserve.bind(bc)];bc.observe=t=>{xc.add(t),e(t)},bc.unobserve=e=>{xc.delete(e),_c.delete(e),t(e)}}return bc}();return!!n&&(t?$c.delete(e):$c.add(e),i?wc.delete(e):wc.add(e),n.observe(e),!0)}function Cc(e){bc?.unobserve(e),e.removeAttribute("offscreen")}(0,z.u$)(class extends vc{constructor(e){if(super(e),this._counted=!0,e.type!==z.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(e){return n.s6}update(e,[t]){const i=!1!==t?.counted;var s;return e.element!==this._el?(this._unwatch(),this._el=e.element,this._counted=i,this.isConnected&&jc(this._el,!0,i)&&(s=this._el,queueMicrotask(()=>Mc(s)&&Sc(s,!1)))):i!==this._counted&&(this._counted=i,this.isConnected&&jc(this._el,!0,i)),n.s6}_unwatch(){this._el&&Cc(this._el)}disconnected(){this._unwatch()}reconnected(){this._el&&jc(this._el,!0,this._counted)}});const Ac=go.dt,zc=Math.ceil(.1/Ac)+1,qc=e=>Math.round(100*e)/100;function Ec(e,t,i){const n=Fo(e,t,fo),s=i?i.n:Math.min(Math.max(0,Math.floor(e.count)),go.parents),r=vo(e.sim.seed),a=[];for(let e=0;e<s;e++){const t=Zo(n,r,e);a.push({shape:t.shape,size:qc(t.size),...void 0!==t.color?{color:t.color}:{}})}const o=e.sim.children,l=Jo(o),c=i?i.m:o&&s?Math.min(s*l,go.elements-s):0,d=vo(bo(e.sim.seed,5));for(let e=0;e<c;e++){const t=Io(d,o.shapes),i=yo(d,o.size),n=o.colors.length?o.colors[e%o.colors.length]:a[Math.floor(e/Math.max(1,l))%s].color;a.push({shape:t,size:qc(i),...void 0!==n?{color:n}:{}})}return{parents:s,children:c,looks:a}}const Hc=(e,t)=>e.plans.map(e=>Ec(e.spec,t,e));function Lc(e,t,i){const n=1e-6;return t.ny<0&&t.y>=e.H-i-n?"floor":t.ny>0&&t.y<=i+n?"ceiling":t.nx>0&&t.x<=i+n?"left":t.nx<0&&t.x>=e.W-i-n?"right":"content"}const Vc=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy});class Oc{constructor(e,t,i,n=Ec(e,t)){this.faces=new Set,this.slots=[],this.world=Fo(e,t,i),this.layout=n,this.rng=vo(e.sim.seed),this.crng=vo(bo(e.sim.seed,2));for(let e=0;e<n.parents;e++){const t=this.spawn(e);this.slots.push({next:t,wait:t.birth,fired:!1})}this.kids=new Array(n.children).fill(void 0)}spawn(e){const t=Zo(this.world,this.rng,e);return t.size=this.layout.looks[e].size,t.radius=Bo(t.size),t.persistent&&(t.life=1/0),t}emit(e,t,i){e.fired=!0;const n=this.world.sim.children;if(!n)return;const s=[];for(let e=0;e<this.kids.length&&s.length<Jo(n);e++)this.kids[e]||s.push(e);Qo(this.world,n,t,i,this.crng,s.length).forEach((e,t)=>{e.size=this.layout.looks[this.layout.parents+s[t]].size,e.radius=Bo(e.size),this.kids[s[t]]=e})}step(){const e=this.world,t=e.sim.children;this.slots.forEach((i,n)=>{if(!i.p){if(i.wait-=Ac,i.wait>1e-9)return;i.p=i.next,i.fired=!1}const s=i.p,r=Uo(e,s,Ac);r&&(this.faces.add(Lc(e,r,s.radius)),"collision"!==t?.trigger||i.fired||this.emit(i,s,{...r,vx:s.vx,vy:s.vy})),"time"===t?.trigger&&!i.fired&&s.age>=(t.at??0)-1e-9&&this.emit(i,s,Vc(s)),s.age>=s.life-1e-9&&("death"!==t?.trigger||i.fired||this.emit(i,s,Vc(s)),i.p=void 0,i.next=this.spawn(n),i.wait=i.next.birth)}),this.kids.forEach((t,i)=>{if(!t)return;const n=Uo(e,t,Ac);n&&this.faces.add(Lc(e,n,t.radius)),t.age>=t.life-1e-9&&(this.kids[i]=void 0)})}frame(){const e=this.world,t=t=>{if(!t)return;const i=Wo(e,t);return{x:i.x/e.W*100,y:i.y/e.H*100,rotate:i.rotate,opacity:i.opacity,scale:i.scale}};return[...this.slots.map(e=>t(e.p)),...this.kids.map(t)]}}const Pc=["translate","rotate","scale","opacity","animation"],Rc=(e,t)=>{const i=10**t;return Math.round(e*i)/i||0};function Dc(e,t,i=!1){const n=e.children;for(let e=0;e<n.length;e++){const s=n[e].style;i&&s.setProperty("animation","none");const r=t[e];!r||r.opacity<=0?"0"!==s.getPropertyValue("opacity")&&s.setProperty("opacity","0"):(s.setProperty("translate",`${Rc(r.x,2)}cqw ${Rc(r.y,2)}cqh`),s.setProperty("rotate",`${Rc(r.rotate,1)}deg`),s.setProperty("opacity",String(Rc(r.opacity,3))),1!==r.scale?s.setProperty("scale",String(Rc(r.scale,3))):s.removeProperty("scale"))}}function Nc(e){for(const t of e.children)for(const e of Pc)t.style.removeProperty(e)}const Tc=new Map;let Fc=0,Ic=0,Bc=!1;const Zc=()=>"undefined"==typeof document||"hidden"!==document.visibilityState,Kc=()=>{for(const e of Tc.values())if(e.on)return!0;return!1};function Wc(){Fc&&"function"==typeof cancelAnimationFrame&&cancelAnimationFrame(Fc),Fc=0,Ic=0}function Uc(){!Fc&&Zc()&&Kc()&&"function"==typeof requestAnimationFrame&&(Fc=requestAnimationFrame(Gc))}function Gc(e){Fc=0;const t=Ic?Math.min(.1,Math.max(0,(e-Ic)/1e3)):Ac;Ic=e;for(const e of[...Tc.values()])if(e.el.isConnected){if(e.on){e.acc+=t;for(let t=0;e.acc>=Ac-1e-9&&t<zc;t++){for(const t of e.sims)t.step();e.acc-=Ac}Dc(e.el,e.sims.flatMap(e=>e.frame()))}}else Xc(e.el);Kc()&&Zc()?Fc=requestAnimationFrame(Gc):Ic=0}function Yc(){Zc()?Uc():Wc()}function Jc(e,t,i,n){const s=sl(e),r=Hc(s,t);return s.plans.flatMap((e,a)=>a>=s.cut==!!n?[new Oc(e.spec,t,i,r[a])]:[])}function Xc(e){var t;Tc.delete(e)&&(t=e,yc.delete(t),Cc(t),Nc(e),Kc()||Wc())}const Qc=new Map;function ed(e,t,i,n,s,r){const a=sl(t),o=((e,t)=>Hc(e,t).flatMap(e=>e.looks))(a,i),l=t=>{const i=s?vl(t?n+"o":n,s):`${t?n+"o":n}-g0`,l=((e,t)=>[t.slice(0,rl(e)),t.slice(rl(e))])(a,o)[t],c=r?_l(r,i,e,o,t?r.parts.element:0,t?void 0:r.parts?.element,t?r.parts.slot:0).css:function(e,t,i){return{css:xl(t,i,e),slots:e.map(bl)}}(l,i,e).css;return{name:i,css:c,slots:l.map(bl)}},c=l(0),d=a.cut<a.plans.length?l(1):void 0,p="front"===t.layer,h=!!s&&!r&&a.plans.some(e=>Math.floor(e.spec.count)>e.n||e.m<e.n*Jo(e.spec.sim.children)),u=r?r.stats:{elements:o.length,stops:0,bytes:c.css.length+(d?.css.length??0),capped:h,warn:!1},m=rl(a),g=a.plans.map((e,t)=>({index:e.index,part:t<a.cut?0:1,first:e.at-(t<a.cut?0:m),parents:e.n,children:e.m})).sort((e,t)=>e.index-t.index);return{compiled:{mode:t.sim.mode,...c,front:p,...d?{other:{...d,front:!p}}:{},emitterSlots:g,stats:u},...r?{loop:r}:{},plan:a,still:[]}}function td(e,t,i,n){const s=dl(n),r=fl(e,t,i),a=vl(r,s);let o=Qc.get(r);const l=o?.get(a);if(o&&l)return o.delete(a),o.set(a,l),Qc.delete(r),Qc.set(r,o),l;const c=ed(e,t,i,r,s,"live"===t.sim.mode?void 0:gl({spec:t,period:i,geometry:s}));if(!o)for(o=new Map,Qc.set(r,o);Qc.size>32;)Qc.delete(Qc.keys().next().value);for(o.set(a,c);o.size>go.geometryVariants;)o.delete(o.keys().next().value);return c}const id=new WeakSet;let nd=!1;var sd;sd=dc,Ie.simValidator=sd;const rd={version:"1.2.0",validateSim:dc,bake:gl,bakedCss:_l,bakedSvg:function(e,t){const i=Number.isFinite(t.width)&&t.width>0?Math.round(t.width):200,n=Number.isFinite(t.height)&&t.height>0?Math.round(t.height):100,s=e.period>0&&Number.isFinite(e.period)?e.period:1,r=`p${dn(JSON.stringify([e.period,e.geometry,e.elements.length,e.stats.bytes]))}`,a=void 0!==t.background?Cl(t.background):void 0,o=new Map,l=`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}" fill="currentColor" color="#03a9f4">`,c=a?`<path d="M0 0H${i}V${n}H0z" fill="${jl(a)}"/>`:"";let d=l.length+c.length+64;const p=[],h=[],u=[],m=e=>({...e,x:e.x/100*i,y:e.y/100*n}),g=e.elements.map((e,t)=>t);return e.parts&&!e.parts.front&&g.push(...g.splice(0,e.parts.element)),g.forEach(t=>{const i=e.elements[t],n=(e=>{const t=JSON.stringify(e);let i=o.get(t);return i||o.set(t,i=function(e){const t=(e,t,i,n,s)=>({markup:`<g transform="translate(${Sl(-(t+n/2))} ${Sl(-(i+s/2))})">${e}</g>`,grid:Math.max(n,s)||24});if("builtin"in e)return t(wl(e.builtin),0,0,24,24);if("svg"in e){const i=Ne(e.svg);if(!i.error){const e=new Set(i.evenodd?.paths??[]),n=new Set(i.evenodd?.accent??[]),s=[...i.paths.map((t,i)=>`<path d="${jl(t)}"${e.has(i)?' fill-rule="evenodd"':""}/>`),...i.accentPaths.map((e,t)=>`<path d="${jl(e)}"${n.has(t)?' fill-rule="evenodd"':""}/>`),...i.strokes.map(e=>`<path d="${jl(e.d)}" fill="none" stroke="currentColor" stroke-width="${Sl(e.width)}"${e.cap?` stroke-linecap="${jl(e.cap)}"`:""}${e.join?` stroke-linejoin="${jl(e.join)}"`:""}/>`)].join(""),[r,a,o,l]=i.viewBox.split(/[\s,]+/).map(Number);if(s.length<=2048&&[r,a,o,l].every(Number.isFinite)&&o>0&&l>0)return t(s,r,a,o,l)}}return t('<path d="M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"/>',0,0,24,24)}(e)),i})(i.shape),s=Cl(i.color),a=`<g class="${r}e${t}"${s?` color="${jl(s)}"`:""}>${n.markup}</g>`;if(d+a.length>31744)return;d+=a.length,p.push(a);const l=i.size/n.grid;h.push(`.${r}e${t}{${Al(m(yl(i.stops,.5)),l)}}`);const c=i.stops.map(e=>`${Sl(100*e.t)}%{${Al(m(e),l)}}`).join("");u.push(`.${r} .${r}e${t}{animation-name:${r}a${t}}@keyframes ${r}a${t}{${c}}`)}),[l,`<style>${[`.${r}>g{transform-box:view-box;transform-origin:0 0}`,...h,`@media (prefers-reduced-motion:no-preference){.${r}>g{animation-duration:${Sl(s)}s;animation-timing-function:linear;animation-iteration-count:infinite}`,...u,"}"].join("\n")}</style>`,c,`<g class="${r}">`,...p,"</g>","</svg>"].join("\n")},apply:function(e,t){try{const{spec:i,period:n,docId:s}=t;if(!i?.sim)throw new Error("the animation has no particle simulation");t.useCss("mcp-shapes",kl);const r=function(e,t){const i=e.getBoundingClientRect();if(!(i.width>0&&i.height>0))return;const n={aspect:i.width/i.height};if("none"!==t.spec.sim.colliders.content){const e=t.content?.()?.getBoundingClientRect();e&&e.width>0&&e.height>0&&(n.content={x:(e.left-i.left)/i.width*100,y:(e.top-i.top)/i.height*100,w:e.width/i.width*100,h:e.height/i.height*100})}return dl(n)}(e,t),a=r??fo,o=td(s,i,n,a),l=t.part?1:0,c=l?o.compiled.other:o.compiled;if(e.getAttribute("data-fx")!==c.name&&(t.useCss(c.name,c.css),e.setAttribute("data-fx",c.name)),t.reducedMotion)return Xc(e),Dc(e,function(e,t,i,n,s){if(e.still[s])return e.still[s];const r=[],a=e.loop;if(a){const e=a.parts?.element??a.elements.length;a.elements.slice(s?e:0,s?void 0:e).forEach(e=>r[e.slot-(s?a.parts.slot:0)]=yl(e.stops,.5))}else{const e=Jc(t,i,n,s),a=Math.round(Math.min(.5*i,3)/go.dt);for(const t of e)for(let e=0;e<a;e++)t.step();r.push(...e.flatMap(e=>e.frame()))}return e.still[s]=r}(o,i,n,a,l),!0),void id.add(e);id.delete(e)&&Nc(e),"live"===i.sim.mode?function(e,t,i,n,s,r=0){if(Tc.get(e)?.key===s)return;Xc(e),Bc||"undefined"==typeof document||(document.addEventListener("visibilitychange",Yc),Bc=!0);const a=Jc(t,i,n,r),o={el:e,sims:a,key:s,on:!1,acc:0};var l,c;Tc.set(e,o),l=e,c=t=>{Tc.get(e)===o&&(o.on=t,t?Uc():Kc()||Wc())},yc.set(l,c),jc(l,!0,!0)||(o.on=!0,Uc())}(e,i,n,a,c.name,l):Xc(e)}catch(e){nd||(nd=!0,console.warn("Magic Card: a particle layer could not be set up; it plays its simple version.",e))}},release:function(e){Xc(e),id.delete(e)&&Nc(e)}},ad=function(e,t,i,n){return n.aspect>0?td(e,t,i,n).compiled:ed(e,t,i,fl(e,t,i)).compiled},od=new WeakMap;function ld(e){const t="particles"===e.kind?e.particles:void 0;if(!t?.sim)return;if(od.has(t))return od.get(t);let i;try{const n=dc(t.sim,"lenient").sim;if(n){const s={...t,sim:n},r=ad(e.id,s,e.duration/t.speed,{aspect:0}),a=Ua({...e,particles:{...t,sim:n}});r.emitterSlots&&(i={base:r.name.replace(/-g\w+$/,""),emitterSlots:r.emitterSlots,ids:a})}}catch{i=void 0}return od.set(t,i),i}function cd(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e&&e!==document.body?e:null}function dd(e,t,i){const s="alert"===e.variant;return n.qy`<mc-ui-window
    variant=${e.variant??"sheet"}
    size=${e.size??n.s6}
    heading=${e.heading}
    closeLabel=${In(158)}
    ?movable=${!s}
    ?resizable=${!s}
    ?maximizable=${!s}
    moveLabel=${In(482)}
    resizeLabel=${In(736)}
    maximizeLabel=${In(440)}
    restoreLabel=${In(737)}
    initialFocus=${e.initialFocus??n.s6}
    .dismissible=${e.dismissible??!s}
    @mc-window-close=${t=>{t.stopPropagation(),e.onClose()}}
  >
    ${t}${i?n.qy`<div slot="footer" class="foot">${i}</div>`:n.s6}
  </mc-ui-window>`}const pd=new WeakMap;function hd(e,t=18){return e.glyph&&m(e.glyph)?u(e.glyph,t):e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}(0,z.u$)(class extends vc{render(e){return A.s6}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),A.s6}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=pd.get(t);void 0===i&&(i=new WeakMap,pd.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?pd.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});const ud=n.AH`.lip{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;display:grid;place-items:center;width:28px;height:72px;margin:0;padding:0;border:1px solid var(--mc-text-2);background:var(--mc-surface);color:var(--mc-text-2);font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip svg{width:18px;height:18px;pointer-events:none}.lip[aria-expanded='false']{border-color:var(--mc-text-2);background:var(--mc-accent-fill);color:var(--mc-on-accent)} .lip[data-side='start']{left:var(--mc-lip-at-start,0);inset-inline-start:var(--mc-lip-at-start,0);border-left-width:0;border-radius:0 8px 8px 0}.lip[data-side='start'][data-dir='rtl']{left:auto;right:var(--mc-lip-at-start,0);border-left-width:1px;border-right-width:0;border-radius:8px 0 0 8px}.lip[data-side='end']{right:var(--mc-lip-at-end,0);inset-inline-end:var(--mc-lip-at-end,0);border-right-width:0;border-radius:8px 0 0 8px}.lip[data-side='end'][data-dir='rtl']{right:auto;left:var(--mc-lip-at-end,0);border-right-width:1px;border-left-width:0;border-radius:0 8px 8px 0} .lip[data-side='start'][aria-expanded='true'] svg,.lip[data-side='end'][aria-expanded='false'] svg{transform:scaleX(-1)}.lip[data-side='start'][aria-expanded='true'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='false'][data-dir='rtl'] svg{transform:none}.lip[data-side='start'][aria-expanded='false'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='true'][data-dir='rtl'] svg{transform:scaleX(-1)} .lip:focus{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip:focus:not(:focus-visible){outline:none}.lip:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip[aria-expanded='false']:focus{outline:2px solid var(--mc-on-accent);outline-offset:-4px}.lip[aria-expanded='false']:focus:not(:focus-visible){outline:none}.lip[aria-expanded='false']:focus-visible{outline:2px solid var(--mc-on-accent);outline-offset:-4px}@media (hover:hover){.lip:hover{background:var(--mc-surface-2);border-color:var(--mc-text);color:var(--mc-text)}.lip[aria-expanded='false']:hover{background:var(--mc-accent-fill);border-color:var(--mc-text-2);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)}}.lip:active{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.lip[aria-expanded='false']:active{background:var(--mc-accent-fill);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)} @media (pointer:coarse){.lip::after{content:'';position:absolute;top:50%;height:72px;transform:translateY(-50%)}.lip[data-side='start']::after{left:100%;width:17px}.lip[data-side='end']::after{right:100%;width:17px}.lip[data-side='start'][data-dir='rtl']::after{left:auto;right:100%}.lip[data-side='end'][data-dir='rtl']::after{right:auto;left:100%}.lip[aria-expanded='false']::after{width:calc(17px + var(--mc-lip-pull,0px))} .lip[aria-expanded='false'][data-side='start']{left:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='end']{right:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='start'][data-dir='rtl']{left:auto;right:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='end'][data-dir='rtl']{right:auto;left:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}} [data-lip]{transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear 0s}[data-lip='hidden']{visibility:hidden;pointer-events:none;transform:translateX(var(--mc-lip-off,0px));transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear var(--mc-lip-ms,200ms)}[data-lip='hidden'][data-dir='rtl']{transform:translateX(calc(-1 * var(--mc-lip-off,0px)))}@media (prefers-reduced-motion:reduce){[data-lip],[data-lip='hidden'],.lip{transition:none}} .lip-hint{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,var(--mc-lip-hint-max,260px));padding:12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;animation:lip-hint-in 160ms ease-out;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip-hint p{margin:0 0 8px}.lip-hint .lip-hint-keys{color:var(--mc-text-2)}@media (hover:none){.lip-hint .lip-hint-keys{display:none}}.lip-hint button{min-height:var(--mc-hit,40px);padding:0 12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);font:inherit;cursor:pointer}.lip-hint button:focus{outline:2px solid var(--mc-focus);outline-offset:2px}.lip-hint button:focus:not(:focus-visible){outline:none}.lip-hint button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}@media (pointer:coarse){.lip-hint button{min-height:44px}} .lip-hint::before{content:'';position:absolute;top:50%;width:10px;height:10px;margin-top:-5px;border:1px solid var(--mc-text-2);background:var(--mc-surface)}.lip-hint[data-side='start']{left:calc(var(--mc-lip-at-start,0px) + 36px);inset-inline-start:calc(var(--mc-lip-at-start,0px) + 36px)}.lip-hint[data-side='start']::before{left:-6px;border-width:0 0 1px 1px;transform:rotate(45deg)}.lip-hint[data-side='end']{right:calc(var(--mc-lip-at-end,0px) + 36px);inset-inline-end:calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end']::before{right:-6px;border-width:1px 1px 0 0;transform:rotate(45deg)}.lip-hint[data-side='start'][data-dir='rtl']{left:auto;right:calc(var(--mc-lip-at-start,0px) + 36px)}.lip-hint[data-side='start'][data-dir='rtl']::before{left:auto;right:-6px;border-width:1px 1px 0 0}.lip-hint[data-side='end'][data-dir='rtl']{right:auto;left:calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end'][data-dir='rtl']::before{right:auto;left:-6px;border-width:0 0 1px 1px}@keyframes lip-hint-in{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.lip-hint{animation:none;transition:none}} .lip-status{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap}`,md="mc-panels:",gd="mc-panels-hint:",fd="data-mc-lips",vd={"card-studio":["layers","inspector"],"anim-studio":["layers","inspector"],"svg-editor":["side","inspector"],"shape-studio":["side","inspector"],"theme-editor":["variables"]},bd=n.JW`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;function yd(){try{return window.localStorage??null}catch{return null}}class xd{constructor(e,t){this.host=e,this.dir="ltr",this.restoredFrom="none",this.hidden=new Set,this.cols={},this._suspended=!1,this.remembered=null,this.hintDone=!1,this.statusText="",this.frame=0,this.onKeydown=e=>{this.handleKey(e)},this.editor=t.editor,this.panels=t.panels,this.strings=t.strings,this.keys=t.keys??"host",this.fallback=t.fallback,e.addController(this)}hostConnected(){this.host.setAttribute(fd,""),"host"===this.keys&&this.host.addEventListener("keydown",this.onKeydown,{capture:!0}),this.restore()}hostDisconnected(){this.host.removeAttribute(fd),this.host.removeEventListener("keydown",this.onKeydown,{capture:!0}),this.frame&&cancelAnimationFrame(this.frame),this.frame=0}restore(){this.remembered=null,this.readDir(),this.readMemory(),this.hintDone=this.readFlag(),this.host.requestUpdate()}setPanels(e,t){this.panels=e,this.strings=t,this.readDir(),this.host.requestUpdate()}columns(e){const t=new Set([...Object.keys(this.cols),...Object.keys(e)]);let i=!0;for(const n of t)Boolean(this.cols[n])!==Boolean(e[n])&&(i=!1);i||(this.cols={...e},this.host.requestUpdate())}get suspended(){return this._suspended}set suspended(e){e!==this._suspended&&(this._suspended=e,this.host.requestUpdate())}state(e){return!this._suspended&&this.cols[e]&&this.panels.some(t=>t.id===e)?this.hidden.has(e)?"hidden":"shown":"off"}isHidden(e){return"hidden"===this.state(e)}get active(){return!this._suspended&&this.panels.some(e=>this.cols[e.id])}toggle(e){this.remembered=null,this.apply([e],"shown"===this.state(e),"api")}show(e){this.remembered=null,this.apply([e],!1,"api")}hide(e){this.remembered=null,this.apply([e],!0,"api")}toggleAll(){const e=this.panels.map(e=>e.id).filter(e=>"off"!==this.state(e));if(!e.length)return!1;const t=e.filter(e=>!this.hidden.has(e));let i,n;if(t.length)this.remembered=t,i=t,n=!0;else{const t=(this.remembered??[]).filter(t=>e.includes(t));i=t.length?t:e,n=!1,this.remembered=null}return!!this.apply(i,n,"key")&&(this.announce(i,n),!0)}async reveal(e){"hidden"===this.state(e)&&(this.remembered=null,this.apply([e],!1,"reveal"),await this.host.updateComplete)}handleKey(e){if(e.defaultPrevented||!function(e){return(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&!e.getModifierState?.("AltGraph")&&("\\"===e.key||"Backslash"===e.code)&&!e.repeat&&!e.isComposing}(e))return!1;const t=e.composedPath(),i=t.indexOf(this.host);for(let e=0;e<(i<0?t.length:i);e++){const i=t[e];if(i instanceof Element&&i.hasAttribute(fd))return!1}return e.preventDefault(),this.toggleAll(),!0}apply(e,t,i){const n=this.panels.map(e=>e.id).filter(i=>e.includes(i)&&"off"!==this.state(i)&&this.hidden.has(i)!==t);if(!n.length)return!1;const s=this.root()?.activeElement,r=t?n.filter(e=>{const t=this.panelEl(e);return!!t&&!!s&&t.contains(s)}):[];for(const e of n)t?this.hidden.add(e):this.hidden.delete(e);return t||this.dismissHint(),this.writeMemory(),this.host.requestUpdate(),r.length&&this.host.updateComplete.then(()=>this.lipEl(r[0])?.focus()),this.host.dispatchEvent(new CustomEvent("mc-panels-change",{detail:{editor:this.editor,hidden:this.panels.map(e=>e.id).filter(e=>this.hidden.has(e)),cause:i}})),!0}announce(e,t){const i=this.panels.filter(t=>e.includes(t.id)).map(e=>e.noun),n=t?this.strings.hidden:this.strings.shown,s=this.strings.locale;let r;try{const e=new Intl.ListFormat(s,{type:"conjunction"}).format(i),t=n.replace("{panels}",()=>e);r=t.charAt(0).toLocaleUpperCase(s)+t.slice(1)}catch{const e=n.replace("{panels}",()=>i.join(", "));r=e.charAt(0).toUpperCase()+e.slice(1)}this.statusText="",this.host.requestUpdate(),this.frame&&cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>{this.frame=0,this.statusText=r,this.host.requestUpdate()})}readDir(){try{this.dir="rtl"===getComputedStyle(this.host).direction?"rtl":"ltr"}catch{this.dir="ltr"}}allowed(e){const t=new Set(vd[this.editor]),i=new Set;for(const n of e)"string"==typeof n&&t.has(n)&&i.add(n);return i}readMemory(){let e;this.hidden=new Set,this.restoredFrom="none";try{const t=yd();if(!t)return;e=t.getItem(md+this.editor)}catch{return}if(null===e){let e;try{e=this.fallback?.()??null}catch{e=null}const t=this.allowed(e??[]);return void(t.size&&(this.hidden=t,this.restoredFrom="fallback",this.writeMemory()))}if("string"!=typeof e||e.length>64)return;const t=this.allowed(e.split(","));t.size&&(this.hidden=t,this.restoredFrom="stored")}writeMemory(){try{const e=yd();if(!e)return;const t=md+this.editor,i=vd[this.editor].filter(e=>this.hidden.has(e));i.length?e.setItem(t,i.join(",")):e.removeItem(t)}catch{}}readFlag(){try{return"1"===yd()?.getItem(gd+this.editor)}catch{return!1}}hintPanel(){if(!this.hintDone&&"none"!==this.restoredFrom)return this.panels.find(e=>"hidden"===this.state(e.id))}dismissHint(){if(!this.hintDone){this.hintDone=!0;try{yd()?.setItem(gd+this.editor,"1")}catch{}}}closeHint(e){const t=this.root(),i=t?.getElementById(`${e.controls}-hint`),n=!!i&&!!t?.activeElement&&i.contains(t.activeElement);this.dismissHint(),this.host.requestUpdate(),n&&this.lipEl(e.id)?.focus()}onLipKey(e,t){"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.closeHint(t))}hintTemplate(e){const t=this.panels.filter(e=>"hidden"===this.state(e.id)),i=this.strings,s="fallback"===this.restoredFrom?i.hintMigrated:1===t.length?i.hintOne.replace("{noun}",()=>t[0].noun):i.hintMany;return n.qy`<div class="lip-hint" id="${e.controls}-hint" data-side=${e.side} data-dir=${this.dir} @keydown=${t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this.closeHint(e))}}> <p>${s}</p><p class="lip-hint-keys">${i.hintShortcut}</p><button type="button" @click=${()=>this.closeHint(e)}>${i.gotIt}</button></div>`}lip(e){const t=this.panels.find(t=>t.id===e);if(!t)return n.s6;const i=this.state(e);if("off"===i)return n.s6;const s="hidden"===i,r=this.hintPanel()?.id===e;return n.qy`<button type="button" class="lip" data-side=${t.side} data-dir=${this.dir} aria-expanded=${s?"false":"true"} aria-controls=${t.controls} aria-label=${t.name} title=${s?t.showLabel:t.hideLabel} aria-describedby=${(e=>e??A.s6)(r?`${t.controls}-hint`:void 0)} @click=${t=>{t.currentTarget?.focus(),this.remembered=null,this.apply([e],"shown"===this.state(e),"lip")}} @keydown=${r?e=>this.onLipKey(e,t):n.s6} >${bd}</button>${r?this.hintTemplate(t):n.s6}`}status(){return n.qy`<div class="lip-status" role="status" aria-live="polite" aria-atomic="true">${this.statusText}</div>`}root(){return this.host.renderRoot??this.host.shadowRoot}panelEl(e){const t=this.panels.find(t=>t.id===e);return t?this.root()?.getElementById(t.controls)??null:null}lipEl(e){const t=this.panels.find(t=>t.id===e);if(!t)return null;for(const e of Array.from(this.root()?.querySelectorAll(".lip")??[]))if(e.getAttribute("aria-controls")===t.controls)return e;return null}}class _d{constructor(e,t){this.host=e,this.onChange=t,this.width=0,this.watched=[],e.addController(this)}hostDisconnected(){this.observer?.disconnect(),this.observer=void 0,this.watched=[]}watch(e,...t){const i=[e,...t].filter(e=>!!e);if((i.length!==this.watched.length||i.some((e,t)=>e!==this.watched[t]))&&(this.observer?.disconnect(),this.watched=i,"undefined"!=typeof ResizeObserver)){this.observer=new ResizeObserver(()=>this.measure(e));for(const e of i)this.observer.observe(e)}this.measure(e)}measure(e){const t=e?function(e){let t;try{const i=getComputedStyle(e);t=(parseFloat(i.borderLeftWidth)||0)+(parseFloat(i.borderRightWidth)||0)}catch{t=0}return Math.max(0,Math.round(e.offsetWidth-e.clientWidth-t))}(e):0;t!==this.width&&(this.width=t,this.onChange?.(t),this.host.requestUpdate())}}const $d={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};class wd{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),n=i.indexOf(e.composedPath().find(e=>i.includes(e))),s=function(e,t,i,n="horizontal",s=!0){if(!$d[n].includes(e)||!i.length)return-1;const r=i.length,a=e=>e>=0&&e<r&&!i[e].disabled,o=(e,t)=>{for(let i=1;i<=r;i++){let n=e+t*i;if(s)n=(n+2*r)%r;else if(n<0||n>=r)return e;if(a(n))return n}return e};if("Home"===e)return a(0)?0:o(0,1);if("End"===e)return a(r-1)?r-1:o(r-1,-1);const l="ArrowLeft"===e||"ArrowUp"===e;return o(t<0?l?0:-1:t,l?-1:1)}(e.key,n,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap);s<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,s),this.opts.onMove?.(i[s],s))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}function kd(e){const t="tablist"===e.role,i=new wd({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return n.qy`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const s=i.value===e.value,r=!!i.disabledReason;return n.qy`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(s):n.s6} aria-checked=${t?n.s6:String(s)} aria-disabled=${r?"true":n.s6} tabindex=${s?"0":"-1"} @click=${()=>{r||e.onChange(i.value)}} >${hd(i)}${i.label}</button>`})}</div>`}const Md="{opacity:0!important}",Sd=e=>`"${e.replace(/[\\"]/g,"\\$&").replace(/\n/g,"\\a ")}"`,jd=e=>`.mc-module-wrapper[data-mc-run] [data-mc-part=${Sd(e)}]:not(.mc-module-wrapper[data-mc-run] .mc-module-wrapper [data-mc-part])`,Cd="data-mc-stage-hide";class Ad{constructor(){this._css={icon:"",card:""},this._sheets={},this._text=new WeakMap}set(e,t){this._css=t,this.attach(e)}attach(e){if(e){this._into(e,"card");for(const t of e.querySelectorAll(".mc-anim-icon"))t.shadowRoot&&this._into(t.shadowRoot,"icon")}}_into(e,t){const i=this._css[t];if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype){let n=this._sheets[t];return n||(n=new CSSStyleSheet,this._sheets[t]=n,n.replaceSync(i)),this._text.get(n)!==i&&(n.replaceSync(i),this._text.set(n,i)),void(e.adoptedStyleSheets.includes(n)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]))}let n=[...e.children].find(e=>"STYLE"===e.tagName&&e.hasAttribute(Cd));n||(n=document.createElement("style"),n.setAttribute(Cd,""),e.appendChild(n)),n.textContent!==i&&(n.textContent=i)}}const zd="light.mc_studio_preview",qd=e=>(e?.clips?.length??0)>0||(e?.bindings?.length??0)>0,Ed={state:"on",value:.6,attributes:{}},Hd=e=>Math.round(1e3*e)/1e3,Ld=(e,t)=>Hd(e.input.min+(e.input.max-e.input.min)*Math.min(1,Math.max(0,t)));function Vd(e){const t=e?.bindings??[],i=t.find(e=>!e.input.attribute),n=(e?.clips??[]).some(e=>"above"in e.when||"below"in e.when);return{value:t.length>0||n,numericState:!!i||n,...i?{stateRange:[i.input.min,i.input.max]}:{}}}function Od(e,t){const i={};for(const n of e?.bindings??[])n.input.attribute&&!(n.input.attribute in i)&&(i[n.input.attribute]=Ld(n,t));return i}function Pd(e){const t=new Date(0).toISOString();return{entity_id:zd,state:e.state??Ed.state,attributes:{friendly_name:In(687),...e.attributes??{}},last_changed:t,last_updated:t,context:{id:"mc-studio-preview",parent_id:null,user_id:null}}}function Rd(e){return"state"in e?In(882,{state:e.state}):"state_not"in e?In(881,{state_not:e.state_not}):"entity_on"in e?e.entity_on?In(305):In(304):"above"in e?In(1062,{above:e.above}):In(1064,{below:e.below})}var Dd=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Nd=[{id:"light",label:418,icon:"mdi:white-balance-sunny"},{id:"dark",label:213,icon:"mdi:weather-night"}],Td=[.25,.5,1,1.5,2],Fd=zd,Id=(e,t)=>!!t||qd(e);function Bd(e,t,i,n,s=1){return i>0&&n>0&&e>0&&t>0?Math.max(.2,Math.min(s,e/i,t/n)):1}const Zd={light:"--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#f2f3f5;--primary-text-color:#212121;--secondary-text-color:#5f6368;--divider-color:rgba(0,0,0,.12);--state-icon-color:#44739e;color-scheme:light",dark:"--card-background-color:#1c1c1c;--primary-background-color:#111111;--secondary-background-color:#282a2d;--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--divider-color:rgba(225,225,225,.12);--state-icon-color:#9fbcd9;color-scheme:dark"};function Kd(e){return{states:{},entities:{},language:"en",locale:{language:"en",number_format:"language",time_format:"language"},themes:{themes:{},darkMode:e},callWS:async()=>({}),callService:async()=>{}}}class Wd extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this.tile="icon",this.zoomIcon=!1,this.layerView=Ka,this.hiddenLayers=0,this.theme="light",this.reduced=!1,this.speed=1,this.playing=!0,this._t=0,this._k=1,this._fh=0,this._raf=0,this._last=0,this._lastTimeEvent=0,this._sentTime=-1,this._themeSet=!1,this._sheets=new Ad,this._attachQueued=!1,this._rates=new WeakMap,this._drives=!1,this._canvasOn=!1,this._onCanvasSlot=e=>{this._canvasOn=e.target.assignedElements().length>0},this._loop=()=>{if(!this.isConnected)return;const e=performance.now();if(this.playing&&this._last){const t=this.cycle;this._t=(this._t+(e-this._last)/1e3*this.speed)%t,this._emitTime()}this._last=e,this._raf=requestAnimationFrame(this._loop)}}connectedCallback(){if(super.connectedCallback(),!this._themeSet){this._themeSet=!0;const e=this.hass?.themes?.darkMode;this.theme=e??function(e){const t=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(e).color||"");if(!t)return!1;const[i,n,s]=t.slice(1).map(Number);return.2126*i+.7152*n+.0722*s>140}(this)?"dark":"light"}customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate()),this._poll=setInterval(()=>this._sync(),250),this._loop(),this.hasUpdated&&this._observeFrame()}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._mo?.disconnect(),this._mo=this._moRoot=void 0,cancelAnimationFrame(this._raf),this._raf=0,this._poll&&clearInterval(this._poll),this._poll=void 0}get card(){return this._card}get cycle(){return this.doc?function(e,t){if("sequence"===e.kind){const i=On(e,{lookup:t}).schedule?.total??0;return i>0?i:1}const i="particles"!==e.kind||e.particles?.preset?1:e.particles?.speed||1;return Math.max(.05,e.duration/i)}(this.doc,this.lookup):1}get scale(){return this._k}togglePlay(){this.playing?this.pause():this.play()}play(){this.playing=!0;for(const e of this._anims())this._rate(e),e.play()}pause(){this.playing=!1;for(const e of this._anims())e.pause()}seek(e){this.playing=!1,this._t=Math.min(this.cycle,Math.max(0,e));for(const e of this._anims())e.pause(),e.currentTime=1e3*this._t;this._emitTime(!0)}_emitTime(e=!1){const t=performance.now(),i=Math.min(1,Math.max(0,this._t/this.cycle));!e&&(t-this._lastTimeEvent<33||i===this._sentTime)||(this._lastTimeEvent=t,this._sentTime=i,this.dispatchEvent(new CustomEvent("stage-time",{detail:{time:i}})))}_observeFrame(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");e&&t&&!this._ro&&"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this._fit()),this._ro.observe(e),this._ro.observe(t))}_fit(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");if(!e||!t)return;const i=e.offsetHeight,n=this.zoomIcon?this._iconBox(e):void 0;let s,r;if(n&&t.clientWidth>0&&t.clientHeight>0){const e=function(e,t,i){const n=Math.round(1e3*Bd(e-32,t-32,i.width+40,i.height+40,4))/1e3;return{k:n,x:Math.round(e/2-(i.x+i.width/2)*n),y:Math.round(t/2-(i.y+i.height/2)*n)}}(t.clientWidth,t.clientHeight,n);s=e.k,r={x:e.x,y:e.y}}else s=Math.round(1e3*Bd(t.clientWidth-32,t.clientHeight-32,e.offsetWidth,i,1))/1e3;s!==this._k&&(this._k=s),i!==this._fh&&(this._fh=i),r?.x===this._off?.x&&r?.y===this._off?.y||(this._off=r),this.isUpdatePending?this.updateComplete.then(()=>this._emitRect()):this._emitRect()}_emitRect(){const e=this.shadowRoot?.querySelector(".frame");e&&this.dispatchEvent(new CustomEvent("stage-rect",{detail:this._rectDetail(e)}))}_rectDetail(e){const t=this._subjectRect(e),i=this._screenRect(e),n=this._iconViewBox();return{width:e.offsetWidth,height:e.offsetHeight,scale:this._k,...t?{subject:t}:{},...n?{viewBox:n}:{},...i?{screen:i}:{}}}_screenRect(e){const t=this.shadowRoot?.querySelector(".area");if(!t)return;const i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),s=e=>Math.round(100*e)/100;return{left:s(n.left-i.left),top:s(n.top-i.top),width:s(n.width),height:s(n.height)}}_iconViewBox(){const e=this._card?.shadowRoot?.querySelector(".mc-anim-icon"),t="MC-SVG-ICON"===e?.tagName?e.shadowRoot?.querySelector("svg")?.getAttribute("viewBox"):null,i=t?.trim().split(/[\s,]+/).map(Number);return i&&4===i.length&&i.every(Number.isFinite)?i:void 0}_subjectRect(e){const t=this._card?.shadowRoot;if(!t||!this.doc)return;const i=this.subjectTarget,n="name"===i||"state"===i||"background"===i?t.querySelector(`[data-mc-part="${i}"]`):null,s=i?"icon"===i||/^(part|group|shape):/.test(i):"path"===this.doc.kind?"icon"===this.doc.path?.subject:"icon"===this.doc.target,r=n??(s?t.querySelector(".mc-anim-icon"):null)??t.querySelector(".mc-module-wrapper");return this._boxOf(r,e)}_iconBox(e){return this._boxOf(this._card?.shadowRoot?.querySelector(".mc-anim-icon")??null,e)}_boxOf(e,t){const i=e?.offsetParent;if(!e||!i||!e.offsetWidth)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),r=this._k||1;return{x:Math.round((s.left-n.left)/r+i.clientLeft+e.offsetLeft),y:Math.round((s.top-n.top)/r+i.clientTop+e.offsetTop),width:e.offsetWidth,height:e.offsetHeight}}setSpeed(e){this.speed=e;for(const e of this._anims())this._rate(e)}_rate(e){const t=this._rates.get(e),i=t&&e.playbackRate===t.set?t.base:e.playbackRate,n=i*this.speed;e.playbackRate!==n&&(e.playbackRate=n),this._rates.set(e,{base:i,set:e.playbackRate})}_anims(){return function(e){const t=new Set,i=e=>{for(const i of e.getAnimations?.()??[])t.add(i);for(const t of e.querySelectorAll("*"))t.shadowRoot&&i(t.shadowRoot)};return e&&i(e),[...t]}(this._card?.shadowRoot)}_sync(){for(const e of this._anims())this._rate(e),this.playing||"running"!==e.playState||(e.pause(),e.currentTime=1e3*this._t)}_previewHass(){const e=this.hass,t=this._hassFor,i=Id(this.doc,this.preview)?(n=this.preview)?function(e,t){return{state:t.state??e.state,value:t.value??e.value,attributes:t.attributes??e.attributes}}(Ed,n):Ed:void 0;var n;if(t&&t.src===e&&t.theme===this.theme&&t.tile===this.tile&&JSON.stringify(t.sim)===JSON.stringify(i))return t.value;const s="dark"===this.theme,r=e?{...e,themes:{...e.themes??{},darkMode:s}}:Kd(s),a=Xn(this.tile,r),o=i?function(e,t){const i=e.states??{};return{...e,states:{...i,[zd]:Pd(t)}}}(a,i):a;return this._hassFor={src:e,theme:this.theme,tile:this.tile,sim:i,value:o},o}willUpdate(e){if(!customElements.get("magic-card")||!this.doc)return;this._card||(this._card=document.createElement("magic-card"));const t=Id(this.doc,this.preview),i=t!==this._drives;if(this._drives=t,e.has("doc")||e.has("tile")||e.has("reduced")||e.has("lookup")||i||!this._card.shadowRoot)try{this._card.setConfig(cs(this.doc,this.lookup,{tile:this.tile,still:this.reduced,...t?{entity:Fd}:{}}))}catch(e){console.warn("Magic Card studio: preview failed",e)}if(e.has("hass")||e.has("theme")||e.has("preview")||e.has("tile")||e.has("doc")||!this._card.hass){const e=this._previewHass();e!==this._card.hass&&(this._card.hass=e)}}firstUpdated(){this._observeFrame()}_applyHide(){const e=this._card?.shadowRoot;e&&this.doc&&(this._sheets.set(e,((e,t,i)=>{const n=[],s=[],r=eo(e,t);for(const t of r){const r=t.indexOf(":"),a=t.slice(0,r),o=t.slice(r+1);"part"===a?n.push(`[data-p=${Sd(o)}]${Md}`):"group"===a?n.push(`[data-g=${Sd(o)}]${Md}`):"shape"===a?n.push(`[data-s=${Sd(o)}]${Md}`):"emitter"!==a||i||e.particles?.sim?"target"===a&&("background"===o?s.push(".mc-module-wrapper{background:none!important}",`[data-mc-gen-bg]${Md}`):"element"!==o&&s.push(`${jd(o)}${Md}`)):s.push(`.mc-anim-fx${Md}`)}return i&&s.push(...function(e,t){const i=[];return t.ids.forEach((n,s)=>{const r=t.emitterSlots.find(e=>e.index===s);if(!r)return;const a=`.mc-anim-fx[data-fx^=${Sd(`${t.base}${r.part?"o":""}-g`)}]>i`,o=(e,t)=>{t>=e&&i.push(`${a}:nth-child(n+${e}):nth-child(-n+${t})${Md}`)};e.has(`emitter:${n}`)?o(r.first+1,r.first+r.parents+r.children):(e.has(`${Qa}${n}`)&&o(r.first+1,r.first+r.parents),e.has(`children:${n}`)&&o(r.first+r.parents+1,r.first+r.parents+r.children))}),i}(r,i)),{icon:n.join("\n"),card:s.join("\n")}})(this.doc,this.layerView,this.stageParticles)),this._moRoot!==e&&(this._mo?.disconnect(),this._moRoot=e,this._mo=new MutationObserver(()=>{this._attachQueued||(this._attachQueued=!0,queueMicrotask(()=>{this._attachQueued=!1,this._sheets.attach(this._card?.shadowRoot)}))}),this._mo.observe(e,{childList:!0,subtree:!0})))}_showAll(){const e={...this.layerView,hidden:[],solo:[]};this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:e,announce:this.layerView.locked.length?In(47):In(46)},bubbles:!0,composed:!0}))}updated(e){(e.has("doc")||e.has("layerView")||e.has("stageParticles")||e.has("tile")||e.has("reduced")||!this._moRoot)&&(this._applyHide(),this._card?.updateComplete?.then(()=>this._applyHide())),e.has("subjectTarget")&&requestAnimationFrame(()=>this._emitRect()),e.has("zoomIcon")&&requestAnimationFrame(()=>this._fit()),(e.has("doc")||e.has("tile")||e.has("reduced")||e.has("preview"))&&this._card?.updateComplete?.then(()=>{this._sync(),requestAnimationFrame(()=>this._fit())})}_pickTile(e){e!==this.tile&&(this.tile=e,this.dispatchEvent(new CustomEvent("stage-tile",{detail:{tile:e},bubbles:!0,composed:!0})))}_seg(e,t,i,s,r){return n.qy`<div class="seg ${r}" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.id===i),r={ArrowRight:(n+1)%t.length,ArrowLeft:(n-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];if(void 0===r)return;e.preventDefault(),s(t[r].id);const a=e.currentTarget;this.updateComplete.then(()=>a.querySelector('[aria-checked="true"]')?.focus())}}>
      ${t.map(e=>{const t=e.id===i;return n.qy`<button
          type="button"
          role="radio"
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          title=${In(e.label)}
          @click=${()=>s(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon><span class="lbl">${In(e.label)}</span>
        </button>`})}
    </div>`}_missing(){return n.qy`<div class="missing" role="status">
      <ha-icon icon="mdi:card-off-outline"></ha-icon>
      <strong>${In(438)}</strong>
      <p>${In(971)}</p>
    </div>`}render(){const e=this.cycle,t=Math.min(this._t,e),i=!!customElements.get("magic-card"),s=this._k,r=this._off,a=r?"":`width: ${Math.round(360*s)}px; height: ${this._fh?`${Math.round(this._fh*s)}px`:"auto"}`,o=r?`translate(${r.x}px, ${r.y}px) `:"";return n.qy`
      <div class="canvas">
        <div class="dock dock-top">
          ${this.hiddenLayers>0||this.layerView.solo.length>0?n.qy`<div class="hide-chip" role="group" aria-label=${In(409)}>
                <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                <span>${this.hiddenLayers>0?In(689,{count:this.hiddenLayers}):In(842)}</span>
                <button type="button" class="show-all" aria-label=${In(818)} @click=${()=>this._showAll()}>${In(817)}</button>
              </div>`:n.s6}
          <slot name="top"></slot>
        </div>
        <div class="area ${this._canvasOn?"canvas-on":""}">
        <div class="fit ${r?"zoomed":""}" style=${a}>
          <div class="frame" style="${Zd[this.theme]};width:${360}px;transform:${o}scale(${s})" data-theme=${this.theme}>
            ${i&&this._card?this._card:this._missing()}
            <div class="overlay"><slot name="overlay"></slot></div>
          </div>
        </div>
        <div class="canvas-layer"><slot name="canvas" @slotchange=${this._onCanvasSlot}></slot></div>
        ${this.reduced&&i?n.qy`<p class="note">${In(1077)}</p>`:n.s6}
        ${r?n.qy`<span class="zoom-tag" title=${In(1086)}>${In(379,{percent:Math.round(100*s)})}</span>`:Math.abs(s-1)>.005?n.qy`<span class="zoom-tag" title=${In(970)}>${Math.round(100*s)}%</span>`:n.s6}
        </div>
        <div class="dock dock-bottom"><slot name="bottom"></slot></div>
      </div>
      <div class="transport">
        <button
          type="button"
          class="icon-btn sm play"
          aria-label=${this.playing?In(646):In(663)}
          title=${this.playing?In(646):In(663)}
          ?disabled=${this.reduced||!i}
          @click=${()=>this.togglePlay()}
        >
          <ha-icon icon=${this.playing?"mdi:pause":"mdi:play"}></ha-icon>
        </button>
        <input
          class="scrub"
          type="range"
          min="0"
          max=${e}
          step="0.01"
          aria-label=${In(683)}
          aria-valuetext=${In(1237,{now:t.toFixed(2),total:e.toFixed(2)})}
          .value=${String(t)}
          ?disabled=${this.reduced||!i}
          @input=${e=>this.seek(Number(e.target.value))}
        />
        <span class="time mono" aria-hidden="true">${t.toFixed(2)} / ${e.toFixed(2)} s</span>
        <label class="speed">
          <span class="sr-only">${In(849)}</span>
          <div class="select">
            <select class="input" aria-label=${In(849)} @change=${e=>this.setSpeed(Number(e.target.value))}>
              ${Td.map(e=>n.qy`<option value=${e} ?selected=${e===this.speed}>${e}×</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </label>
        <span class="view">
          ${this._seg(In(691),Gn,this.tile,e=>this._pickTile(e),"tiles")}
          ${this._seg(In(124),Nd,this.theme,e=>this.theme=e,"themes")}
          <button
            type="button"
            class="toggle reduced"
            aria-pressed=${this.reduced?"true":"false"}
            aria-label=${In(702)}
            title=${In(693)}
            @click=${()=>this.reduced=!this.reduced}
          >
            <ha-icon icon="mdi:motion-pause-outline"></ha-icon>
          </button>
        </span>
      </div>
    `}}Wd.styles=[ps,hs,n.AH`
      :host {
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }
      .transport {
        display: flex;
        align-items: center;
        gap: 6px 8px;
        flex-wrap: wrap;
        padding: 6px 12px;
        background: var(--mc-surface);
        border-top: 1px solid var(--mc-divider);
        min-width: 0;
      }
      /* tile, theme and reduced motion: right-aligned, wrapping as one group when the stage is narrow */
      .view {
        display: inline-flex;
        flex-wrap: wrap;
        max-width: 100%;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        padding-left: 8px;
        border-left: 1px solid var(--mc-divider);
      }
      .view .seg {
        flex-wrap: wrap;
      }
      .seg > button {
        gap: 6px;
        min-height: 28px;
        padding: 0 8px;
      }
      .seg > button ha-icon {
        --mdc-icon-size: 16px;
      }
      /* icon-only tiles and themes: the label is for assistive tech, the title for the tooltip */
      .seg .lbl {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
      }
      .toggle {
        display: inline-grid;
        place-items: center;
        width: 34px;
        height: 34px;
        padding: 0;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
        transition:
          background-color 0.15s ease-out,
          color 0.15s ease-out;
      }
      .toggle:hover {
        background: var(--mc-surface-2);
        color: var(--mc-text);
      }
      .toggle[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        border-color: transparent;
        color: var(--mc-accent-ink);
      }
      .canvas {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 16px 16px;
      }
      /* the card's area: what the card is fitted into */
      .area {
        position: relative;
        /* fills a stage of fixed height (the studio); a stage of auto height wraps the card */
        flex: 1 1 auto;
        display: grid;
        place-items: center;
        padding: ${(0,n.iz)(16)}px;
        min-height: 0;
        min-width: 0;
      }
      /* docked stage tools (toolbars, the preview-entity capsule): unscaled, above / below the card, never over it */
      .dock {
        flex: none;
        min-width: 0;
      }
      .dock ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        display: flex !important;
        justify-content: center;
        margin: 8px 12px 0;
      }
      .hide-chip {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin: 8px auto 0;
        padding: 2px 4px 2px 10px;
        width: fit-content;
        max-width: calc(100% - 24px);
        border: 1px solid var(--mc-divider);
        border-radius: 9999px;
        background: var(--mc-surface-2, var(--mc-surface));
        color: var(--mc-text);
        font-size: 0.8125rem;
        --mdc-icon-size: 16px;
      }
      .hide-chip .show-all {
        min-height: 24px;
        padding: 0 10px;
        border: 0;
        border-radius: 9999px;
        background: transparent;
        color: var(--mc-accent, var(--primary-color, #03a9f4));
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      .hide-chip .show-all:hover {
        background: color-mix(in srgb, var(--mc-accent, var(--primary-color, #03a9f4)) 12%, transparent);
      }
      .hide-chip .show-all:focus-visible {
        outline: 2px solid var(--mc-accent, var(--primary-color, #03a9f4));
        outline-offset: 1px;
      }
      .dock-bottom ::slotted(*) {
        margin: 0 12px 8px;
      }
      /* the scaled card's box; the frame inside keeps its natural size and scales from its corner */
      .fit {
        position: relative;
      }
      /* zoomed to the icon: the canvas shows the part of the card around it */
      .fit.zoomed {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .frame {
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        color: var(--primary-text-color);
      }
      /* the path editor's overlay and stage tools: exactly over the preview card */
      .overlay {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .overlay ::slotted(*) {
        position: absolute;
        inset: 0;
        pointer-events: auto;
      }
      /* tools that edit over the card but cannot sit inside its scale: the card area's box, unscaled */
      /* a canvas tool is in the slot: a drag on the area is the tool's, not a page pan or zoom */
      .area.canvas-on {
        touch-action: none;
      }
      .canvas-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .canvas-layer ::slotted(*) {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .frame magic-card {
        display: block;
      }
      .note {
        position: absolute;
        left: 50%;
        bottom: 8px;
        transform: translateX(-50%);
        width: max-content;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 4px 10px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        text-align: center;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .zoom-tag {
        position: absolute;
        right: 8px;
        top: 8px;
        padding: 1px 6px;
        border-radius: 6px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        font-size: 0.6875rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        pointer-events: none;
      }
      .missing {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px;
        text-align: center;
        border: 1px dashed var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        color: var(--mc-text);
      }
      .missing ha-icon {
        --mdc-icon-size: 32px;
        color: var(--mc-text-2);
      }
      .missing strong {
        font-weight: 500;
      }
      .missing p {
        margin: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
        max-width: 36ch;
      }
      .scrub {
        flex: 1 1 120px;
        min-width: 80px;
        accent-color: var(--mc-accent-fill);
      }
      .time {
        flex: none;
        min-width: 11ch;
        text-align: right;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .speed .select {
        width: 76px;
      }
      .speed select.input {
        min-height: 32px;
        padding-top: 2px;
        padding-bottom: 2px;
      }
    `],Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"doc",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"lookup",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"hass",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"tile",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"preview",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"subjectTarget",void 0),Dd([(0,s.MZ)({type:Boolean})],Wd.prototype,"zoomIcon",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"layerView",void 0),Dd([(0,s.MZ)({attribute:!1})],Wd.prototype,"stageParticles",void 0),Dd([(0,s.MZ)({type:Number})],Wd.prototype,"hiddenLayers",void 0),Dd([(0,s.wk)()],Wd.prototype,"theme",void 0),Dd([(0,s.wk)()],Wd.prototype,"reduced",void 0),Dd([(0,s.wk)()],Wd.prototype,"speed",void 0),Dd([(0,s.wk)()],Wd.prototype,"playing",void 0),Dd([(0,s.wk)()],Wd.prototype,"_t",void 0),Dd([(0,s.wk)()],Wd.prototype,"_k",void 0),Dd([(0,s.wk)()],Wd.prototype,"_fh",void 0),Dd([(0,s.wk)()],Wd.prototype,"_off",void 0),Dd([(0,s.wk)()],Wd.prototype,"_canvasOn",void 0);var Ud=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Gd={"Glow & pulse":"mdi:lightbulb-on-outline",Motion:"mdi:rotate-right",Playful:"mdi:emoticon-happy-outline","Light & colour":"mdi:palette-outline","Rings & sweeps":"mdi:radar",Borders:"mdi:border-outside","Weather & device":"mdi:weather-partly-rainy",Scenes:"mdi:image-filter-hdr",Backgrounds:"mdi:gradient-horizontal",Seasonal:"mdi:pine-tree",Interaction:"mdi:gesture-tap","Fire & heat":"mdi:fire",Cleaning:"mdi:broom",Christmas:"mdi:pine-tree",Halloween:"mdi:halloween",Valentine:"mdi:heart-outline","Home automation":"mdi:home-automation"};let Yd,Jd;const Xd=e=>e in Q?(0,T.t)(Q[e]):e,Qd=e=>"builtin"===e.kind?e.id:`cat:${e.entry.id}`,ep=e=>"builtin"===e.kind?e.group:e.entry.group,tp=[...X,...["Fire & heat","Cleaning","Christmas","Halloween","Valentine","Home automation","Light & colour"].filter(e=>!X.includes(e))],ip=new Map,np=new WeakMap;function sp(e){if("catalogue"===e.kind){if(np.has(e.entry))return np.get(e.entry);let t;try{t=e.entry.build()}catch{t=void 0}return np.set(e.entry,t),t}if(ip.has(e.id))return ip.get(e.id);let t=wt(e.id);return t&&e.tap&&(t={...t,iterations:"infinite"}),ip.set(e.id,t),t}class rp extends n.WF{constructor(){super(...arguments),this.play=!1,this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0,this._card=void 0}willUpdate(e){const t=this.source?sp(this.source):void 0;if(!(this._visible&&t&&this.source&&customElements.get("magic-card")))return void(this._card=void 0);const i=!this._card;if(i&&(this._card=document.createElement("magic-card")),i||e.has("source")||e.has("play")||e.has("lookup"))try{const e=cs(t,this.lookup,{tile:"card",thumb:!0,as:(n=Qd(this.source),`pt-${n.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}`.slice(0,64)),still:!this.play}),i="catalogue"===this.source.kind?this.source.entry.icon:void 0;i&&function(e,t){const i=e.rows??[];for(const e of i)for(const i of e.columns??[])for(const e of i.modules??[])"icon"in e&&(e.icon=t)}(e,i),this._card.setConfig(e)}catch{return void(this._card=void 0)}var n;(i||e.has("hass"))&&(this._card.hass=Xn("card",this.hass??Kd(!1)))}render(){const e=this.source?Gd[ep(this.source)]??"mdi:animation-outline":"mdi:animation-outline";return n.qy`<div class="box">${this._card?n.qy`<div class="scale">${this._card}</div>`:n.qy`<ha-icon icon=${e}></ha-icon>`}</div>`}}rp.styles=[ps,n.AH`
      :host {
        display: block;
        width: 100%;
        height: 88px;
      }
      .box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--mc-text-2);
        --mdc-icon-size: 24px;
      }
      /* a fixed 200px card scaled to 120px: the type never reflows per tile; 8px of canvas around it for glows and borders */
      .scale {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200px;
        transform: translate(-50%, -50%) scale(0.6);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `],Ud([(0,s.MZ)({attribute:!1})],rp.prototype,"source",void 0),Ud([(0,s.MZ)({type:Boolean})],rp.prototype,"play",void 0),Ud([(0,s.MZ)({attribute:!1})],rp.prototype,"hass",void 0),Ud([(0,s.MZ)({attribute:!1})],rp.prototype,"lookup",void 0),Ud([(0,s.wk)()],rp.prototype,"_visible",void 0);class ap extends n.WF{constructor(){super(...arguments),this.sources=[],this.query="",this.lookup=()=>{},this.notice="",this._active=new Set,this._previewing=new Set,this._reduced=!1,this._timers=new Map,this._onMq=()=>{this._reduced=!!this._mq?.matches}}connectedCallback(){super.connectedCallback(),this._mq="function"==typeof window.matchMedia?window.matchMedia(In(3)):void 0,this._reduced=!!this._mq?.matches,this._mq?.addEventListener?.("change",this._onMq)}disconnectedCallback(){super.disconnectedCallback(),this._mq?.removeEventListener?.("change",this._onMq),this._mq=void 0;for(const e of this._timers.values())clearTimeout(e);this._timers.clear()}_set(e,t,i){const n=this[e];if(n.has(t)===i)return;const s=new Set(n);i?s.add(t):s.delete(t),this[e]=s}_preview(e,t){clearTimeout(this._timers.get(t)),this._set("_previewing",t,!0),this._timers.set(t,setTimeout(()=>{this._timers.delete(t),this._set("_previewing",t,!1)},function(e){const t="number"==typeof e?.duration?e.duration:2;return Math.min(8e3,Math.max(2500,Math.round(1e3*t)))}(sp(e))))}_pick(e){this.dispatchEvent(new CustomEvent("preset-pick",{detail:{source:e},bubbles:!0,composed:!0}))}_tile(e){const t=Qd(e),i=(e=>"builtin"===e.kind?e.name:e.entry.name)(e),s=(e=>"builtin"===e.kind?e.tap||e.heavy:!!e.entry.heavy)(e),r=(e=>"builtin"===e.kind&&e.tap)(e),a=!this._reduced&&(!s||this._active.has(t)||this._previewing.has(t));return n.qy`<li class="pt-cell">
      <button
        type="button"
        class="pt"
        data-preset=${t}
        title=${i}
        aria-description=${r?In(673):n.s6}
        @click=${()=>this._pick(e)}
        @pointerenter=${()=>this._set("_active",t,!0)}
        @pointerleave=${()=>this._set("_active",t,!1)}
        @focus=${()=>this._set("_active",t,!0)}
        @blur=${()=>this._set("_active",t,!1)}
      >
        <mc-preset-thumb aria-hidden="true" .source=${e} .play=${a} .hass=${this.hass} .lookup=${this.lookup}></mc-preset-thumb>
        <span class="nm">${i}</span>
        ${r?n.qy`<span class="chip is-count" aria-hidden="true">${In(912)}</span>`:n.s6}
      </button>
      ${s&&!this._reduced?n.qy`<button type="button" class="pt-play" tabindex="-1" aria-hidden="true" title=${In(687)} @click=${()=>this._preview(e,t)}>
            <ha-icon icon="mdi:play"></ha-icon>
          </button>`:n.s6}
    </li>`}render(){const e=function(e,t){const i=(0,kt.A)(t).split(/\s+/).filter(Boolean),n=e=>{if(!i.length)return!0;const t=(0,kt.A)("builtin"===e.kind?`${e.name} ${e.id} ${e.group} ${Xd(e.group)}`:`${e.entry.name} ${e.entry.id} ${e.entry.group} ${e.entry.tags.join(" ")}`);return i.every(e=>t.includes(e))},s=new Map;for(const t of e){if(!n(t))continue;const e=ep(t),i=s.get(e);i?i.push(t):s.set(e,[t])}return tp.filter(e=>s.has(e)).map(e=>({group:e,tiles:s.get(e)}))}(this.sources,this.query.trim());return n.qy`
      ${e.length?e.map(e=>n.qy`<section class="pg" role="group" aria-label=${Xd(e.group)}>
              <h3>${Xd(e.group)} <span class="chip is-count">${e.tiles.length}</span></h3>
              <ul class="grid" role="list">
                ${e.tiles.map(e=>this._tile(e))}
              </ul>
            </section>`):n.qy`<div class="no-results">
            <p>${In(559,{query:this.query})}</p>
            <button type="button" class="btn btn-text btn-sm no-results-clear" @click=${()=>this.dispatchEvent(new CustomEvent("preset-clear-search",{bubbles:!0,composed:!0}))}>
              ${In(149)}
            </button>
          </div>`}
      <p class="notice" role="status" ?hidden=${!this.notice}>${this.notice}</p>
    `}}ap.styles=[ps,hs,n.AH`
      :host {
        display: block;
        max-height: min(64vh, 640px);
        overflow: auto;
        /* sticky group headings never cover the focused tile (WCAG 2.4.11) */
        scroll-padding-top: 32px;
        padding-right: 4px;
      }
      .pg + .pg {
        margin-top: 12px;
      }
      h3 {
        position: sticky;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        padding: 4px 0 6px;
        background: var(--mc-surface);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .grid {
        list-style: none;
        margin: 0;
        padding: 2px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
        gap: 10px;
      }
      .pt-cell {
        position: relative;
        display: flex;
      }
      .pt {
        width: 100%;
        display: grid;
        align-content: start;
        justify-items: center;
        gap: 6px;
        padding: 8px;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text);
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .pt:hover {
        border-color: color-mix(in srgb, var(--mc-accent) 60%, transparent);
      }
      .pt:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .nm {
        font-size: 0.8125rem;
        line-height: 1.25;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .pt-play {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 24px;
        height: 24px;
        display: grid;
        place-items: center;
        padding: 0;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text);
        cursor: pointer;
        --mdc-icon-size: 16px;
      }
      .pt-play:hover {
        border-color: var(--mc-field-border);
      }
      .no-results {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 32px 12px;
        text-align: center;
      }
      .no-results p,
      .notice {
        margin: 0;
        color: var(--mc-text-2);
      }
      .notice {
        margin-top: 12px;
        font-size: 0.8125rem;
      }
    `],Ud([(0,s.MZ)({attribute:!1})],ap.prototype,"sources",void 0),Ud([(0,s.MZ)()],ap.prototype,"query",void 0),Ud([(0,s.MZ)({attribute:!1})],ap.prototype,"hass",void 0),Ud([(0,s.MZ)({attribute:!1})],ap.prototype,"lookup",void 0),Ud([(0,s.MZ)()],ap.prototype,"notice",void 0),Ud([(0,s.wk)()],ap.prototype,"_active",void 0),Ud([(0,s.wk)()],ap.prototype,"_previewing",void 0),Ud([(0,s.wk)()],ap.prototype,"_reduced",void 0);var op=i(2231);let lp;var cp=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const dp=e=>e?`mc-anim-draft:${e}`:"mc-anim-draft-new";function pp(e){try{const t=JSON.parse(sessionStorage.getItem(e)??"null");return t&&"object"==typeof t&&"string"==typeof t.id&&"string"==typeof t.name&&We.includes(t.kind)?t:void 0}catch{return}}function hp(e,t){try{const i=t?JSON.stringify(t):"";i&&i.length<=65536?sessionStorage.setItem(e,i):sessionStorage.removeItem(e)}catch{}}const up=[{value:"normal",label:567},{value:"reverse",label:740},{value:"alternate",label:56},{value:"alternate-reverse",label:57}],mp={"mc-anim-states-panel":"mdi:state-machine","mc-anim-key-inspector":"mdi:key-variant","mc-anim-part-inspector":"mdi:vector-square","mc-anim-shape-inspector":"mdi:draw","mc-anim-bindings-panel":"mdi:link-variant","mc-anim-targets-layers":"mdi:card-text-outline","mc-anim-parts-layers":"mdi:vector-square","mc-anim-shapes-layers":"mdi:shape-outline","mc-anim-shapes-under-layers":"mdi:shape-outline","mc-anim-particles-layers":"mdi:shimmer","mc-anim-path-layers":"mdi:vector-curve","mc-anim-steps-layers":"mdi:format-list-numbered","mc-anim-part-presets":"mdi:auto-fix"},gp="mc-anim-parts-layers",fp=new Set(["mc-anim-keyframes-editor","mc-anim-sequence-editor",vs]),vp="var(--primary-color, #03a9f4)",bp=["infinite","1","2","3","5"],yp=["center","top","bottom","left","right","top left","top right","bottom left","bottom right"],xp={keyframes:539,particles:540,path:541,sequence:542},_p={keyframes:91,particles:92,path:93,sequence:94},$p={keyframes:491,particles:380,path:338,sequence:664},wp=["name","duration","easing","iterations","direction","target","origin"];function kp(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}const Mp=e=>{const t=e??{},i=Array.isArray(t.errors)?t.errors.filter(e=>e&&"string"==typeof e.message):[];return{message:"string"==typeof t.message&&t.message?t.message:In(765),errors:i}},Sp="mcas-split",jp="mcas-sections",Cp="mcas-layers";function Ap(){return/Mac|iPhone|iPad/.test(navigator.platform||"")?"⌘\\":"Ctrl+\\"}function zp(){const e=Ap();return[{id:"layers",side:"start",controls:"layers",name:In(410),noun:In(1112),hideLabel:In(366,{noun:In(1112),keys:e}),showLabel:In(820,{noun:In(1112),keys:e})},{id:"inspector",side:"end",controls:"inspector",name:In(390),noun:In(1108),hideLabel:In(366,{noun:In(1108),keys:e}),showLabel:In(820,{noun:In(1108),keys:e})}]}function qp(e){return{locale:e,hidden:In(1238,{panels:"{panels}"}),shown:In(1239,{panels:"{panels}"}),hintOne:In(983,{noun:"{noun}"}),hintMany:In(843),hintMigrated:In(950),hintShortcut:In(816,{keys:Ap()}),gotIt:In(351)}}function Ep(e){try{return localStorage.getItem(e)}catch{return null}}function Hp(e,t){try{void 0===t?localStorage.removeItem(e):localStorage.setItem(e,t)}catch{}}const Lp=e=>Math.min(.8,Math.max(.15,e)),Vp=e=>"keyframes"===e.kind||"sequence"===e.kind;function Op(e){if(!e)return"none";const t=e.keys?.[0];return`${e.kind}|${"keys"===e.kind?`${t?.target}|${t?.lane}|${1===e.keys?.length?1:"n"}`:e.target??e.tool??""}`}let Pp="loading";const Rp=(0,T.G)().then(e=>Pp=e?"ready":"failed");class Dp extends n.WF{constructor(){super(...arguments),this.standalone=!1,this._docs=new Map,this._view="library",this._query="",this._kind="all",this._menu=!1,this._menuClosedAt=0,this._saved=null,this._errors=[],this._saveError="",this._busy=!1,this._status="",this._presetQuery="",this._catalogueFailed=!1,this._labels=Pp,this._customRepeat=!1,this._selection=ys,this._tile="icon",this._split=function(){const e=Number(Ep(Sp));return null!==Ep(Sp)&&Number.isFinite(e)&&e>0?Lp(e):.4}(),this._lips=new xd(this,{editor:"anim-studio",panels:zp(),strings:qp("en"),fallback:()=>{const e=Ep(Cp);if(null===e)return null;try{localStorage.removeItem(Cp)}catch{}return"rail"===e?["layers"]:null}}),this._lipLocale="en",this._lipSig="",this._bar=new _d(this),this._width=0,this._height=0,this._userSplit=null!==Ep(Sp),this._inspOpen=!1,this._collapsed=function(){try{const e=JSON.parse(Ep(jp)??"[]");return new Set(Array.isArray(e)?e.filter(e=>"string"==typeof e):[])}catch{return new Set}}(),this._editorRequested=!1,this._history=new rs(void 0),this._pointer=!1,this._onPointer=()=>{this._pointer=!0},this._lookup=e=>this._docs.get(e),this._onBeforeUnload=e=>{this._keepDraft(),this.dirty&&(e.preventDefault(),e.returnValue="")},this._taken=e=>this._docs.has(e)||this._doc?.id===e,this._time=0,this._libraryObj={},this._gesture=!1,this._layerViews=new Map,this._emitter={index:0,all:!1},this._onEmitter=e=>{e.stopPropagation();const{index:t,all:i}=e.detail??{};Number.isInteger(t)&&t>=0&&(t!==this._emitter.index||!!i!==this._emitter.all)&&(this._emitter={index:t,all:!!i})},this._onLayerView=e=>{const{view:t,announce:i}=e.detail;e.stopPropagation();const n=this._doc?.id;if(n){if(t!==this._layerViews.get(n)&&t!==this._viewOf(this._doc)){const e=new Map(this._layerViews);e.set(n,t),this._layerViews=e}i&&this._say(i)}},this._onKeydown=e=>{if(this._pointer=!1,e.defaultPrevented||this._dialog)return;const t=e.key.toLowerCase(),i=(e.ctrlKey||e.metaKey)&&!e.altKey;if("editor"!==this._view)"/"!==e.key||i||kp(e)||(e.preventDefault(),this.shadowRoot?.querySelector(".search input")?.focus());else{if(i&&"s"===t)return e.preventDefault(),void this.save();if(i&&("z"===t||"y"===t)){if(kp(e))return;return e.preventDefault(),void("y"===t||e.shiftKey?this.redo():this.undo())}if(" "===e.key&&!i&&!kp(e)){const t=e.composedPath()[0];if(t instanceof HTMLElement&&/^(BUTTON|A)$/.test(t.tagName))return;return e.preventDefault(),void this._stage()?.togglePlay()}if("Escape"===e.key&&!kp(e))if(this._inspOpen&&this._slideOver)e.preventDefault(),this._inspOpen=!1,this._focusSel=".insp-toggle";else if("none"!==this._selection.kind){e.preventDefault();const t=this.shadowRoot?.querySelector("aside.inspector"),i=this.shadowRoot?.activeElement,n=!!t&&!!i&&(t===i||t.contains(i));this._setSelection(ys),!n&&i||(this._focusSel="aside.inspector")}}},this._onSelection=e=>{e.stopPropagation();const t=e.detail?.selection;var i;(i=t)&&"object"==typeof i&&["none","keys","target","tool"].includes(i.kind)&&this._setSelection(t)},this._onDocChange=e=>{e.stopPropagation();const{doc:t,label:i,transient:n}=e.detail??{};if(!t||!this._doc)return;const s=Ha(t);if(s)n||(this._endGesture(),this._say(In(575,{big:s})),this._doc={...this._doc});else{if(n)this._gesture?this._history.replace(t):(this._gestureBase=this._doc,this._history.push(t)),this._gesture=!0;else if(this._gesture){const e=this._gestureBase;!e||t!==e&&JSON.stringify(t)!==JSON.stringify(e)?this._history.replace(t):this._history.revert(),this._endGesture()}else this._history.push(t,`editor:${i??""}`);this._doc=t,this._check(),this._pruneSelection()}},this._onStageRect=e=>{const{width:t,height:i,subject:n}=e.detail??{};if(!Number.isFinite(t)||!Number.isFinite(i))return;this._stageRect&&this._stageRect.width===t&&this._stageRect.height===i||(this._stageRect={width:t,height:i}),JSON.stringify(n)!==JSON.stringify(this._subjectRect)&&(this._subjectRect=n);const{scale:s,viewBox:r,screen:a}=e.detail??{},o={rect:{width:t,height:i},scale:Number.isFinite(s)&&s>0?s:1,...n?{subject:n}:{},...Array.isArray(r)&&4===r.length?{viewBox:r}:{},...a&&[a.left,a.top,a.width,a.height].every(Number.isFinite)?{screen:{left:a.left,top:a.top,width:a.width,height:a.height}}:{}};JSON.stringify(o)!==JSON.stringify(this._stageInfo)&&(this._stageInfo=o)},this._onPreviewChange=e=>{e.stopPropagation();const t=e.detail;if(!t||"object"!=typeof t)return;const i={...this._preview??{}};"string"==typeof t.state&&(i.state=t.state),"number"==typeof t.value&&Number.isFinite(t.value)&&(i.value=t.value),t.attributes&&"object"==typeof t.attributes&&(i.attributes={...t.attributes}),this._preview=Object.keys(i).length?i:void 0},this._onSeek=e=>{e.stopPropagation();const t=Number(e.detail?.time),i=this._stage();i&&Number.isFinite(t)&&i.seek(Math.min(1,Math.max(0,t))*i.cycle)},this._onSplitDown=e=>{if(0===e.button){e.preventDefault(),this._splitDrag={pointerId:e.pointerId};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}}},this._onSplitMove=e=>{if(!this._splitDrag||e.pointerId!==this._splitDrag.pointerId)return;const t=this._splitAt(e.clientY);void 0!==t&&this._setSplit(t,!1)},this._onSplitUp=e=>{this._splitDrag&&e.pointerId===this._splitDrag.pointerId&&(this._splitDrag=void 0,this._setSplit(this._split,!0))},this._onSplitKey=e=>{const t=e.shiftKey?.1:.05,i={ArrowUp:this._split-t,ArrowDown:this._split+t,Home:0,End:1};void 0!==i[e.key]&&(e.preventDefault(),this._setSplit(i[e.key],!0))},this._closeDialog=()=>{const e=this.shadowRoot?.querySelector("mc-ui-window");e?.open?e.close("action"):this._dialog=void 0}}willUpdate(e){e.has("hass")&&((0,N.Zc)(this.hass),window.MagicCard?.setLocale?.(this.hass)),this.lang!==Kn()&&(this.lang=Kn());const t=Kn();t!==this._lipLocale&&(this._lipLocale=t,this._lips.setPanels(zp(),qp(t)));const i="editor"===this._view&&!!this._doc;if(this._lips.columns({layers:i,inspector:i&&!this._slideOver}),e.has("library")&&(this._docs=function(e){if(!e||"object"!=typeof e)return new Map;const t=Array.isArray(e)?e:(n=e,Array.isArray(n)?n:n&&"object"==typeof n?Object.entries(n).map(([e,t])=>t&&"object"==typeof t&&!("id"in t)&&Xe.test(e)?{id:e,...t}:t):[]),i=new Map;var n;for(const e of t){const t=ft(e);t.ok&&!i.has(t.doc.id)&&i.set(t.doc.id,t.doc)}return i}(this.library)),(e.has("library")||e.has("_docs"))&&(this._lookup=e=>this._docs.get(e),this._libraryObj=Object.fromEntries(this._docs)),e.has("library")){const e=this._doc&&this._saved?this._docs.get(this._saved.id):void 0;e&&!this.dirty&&JSON.stringify(e)!==JSON.stringify(this._saved)&&(this._saved=e,this._doc=e,this._playable=e,this._history.reset(e))}if(e.has("selectedId")){const e=this.selectedId||void 0;e?this._doc?.id!==e&&(this._wantId=e):("editor"===this._view&&!this.dirty&&this._saved&&this._closeEditor(!1),this._wantId=void 0)}if(this._wantId&&this._docs.has(this._wantId)){const e=this._docs.get(this._wantId);this._wantId=void 0,this.dirty||this._openDoc(e,!1,!1)}}updated(e){const t=e.get("_doc"),i=this._lipsChanged();if(e.has("_height")||e.has("_width")||i||e.has("_view")||e.has("_doc")&&t?.id!==this._doc?.id?this._autoSplit():e.has("_doc")&&this._autoSplit(!0),e.has("_inspOpen")&&this._inspOpen&&this._slideOver&&(this._focusSel??="aside.inspector"),e.has("_doc")&&this._doc&&t&&t.id===this._doc.id&&(this._doc.rig?.shapes?.length??0)>(t.rig?.shapes?.length??0)){const e=this._doc.rig?.shapes??[],t=e[e.length-1].id;this._revealShape(t)}if((i||e.has("_view")||e.has("_width")||e.has("_height")||e.has("_split")||e.has("_stageRect")||e.has("_doc"))&&this._placeLips(),e.has("_selection")&&Op(e.get("_selection"))!==Op(this._selection)){const e=this.shadowRoot?.querySelector("aside.inspector");e&&(e.scrollTop=0)}if(this._focusSel){const e=this.shadowRoot?.querySelector(this._focusSel);e&&(e.focus(),e instanceof HTMLInputElement&&e.select()),this._focusSel=void 0}const n=this._menu?this.shadowRoot?.querySelector("mc-ui-menu.new-menu"):void 0;n&&!n.open&&(n.anchor=this.shadowRoot?.querySelector(".new-btn")??void 0,n.show());const s=this.shadowRoot?.querySelector("mc-ui-window");if(s&&!s.open){const e=cd();e?.isConnected&&e!==document.body&&(this._opener=e),s.opener=this._opener,s.show();const t=s.querySelector("mc-anim-icon-start");t&&s.updateComplete.then(()=>setTimeout(()=>t.focusStart?.(),0));const i=s.querySelector("mc-transfer-panel");i&&s.updateComplete.then(()=>i.focusHeading?.())}else if(!s&&e.has("_dialog")&&e.get("_dialog")&&this._opener?.isConnected){const e=cd();e&&e!==document.body||this._opener.focus({preventScroll:!0}),this._opener=void 0}}_lipsChanged(){const e=`${this._lips.state("layers")}${this._lips.state("inspector")}`,t=e!==this._lipSig;return this._lipSig=e,t}_placeLips(){const e=this.shadowRoot,t=e?.querySelector(".workspace"),i=e?.querySelector("mcas-stage");if(this._bar.watch(i??null,t??null),!t||!i)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect();if(!n.height||!s.height)return;const r=s.top-n.top+s.height/2,a=Math.round(Math.min(Math.max(r,44),Math.max(44,n.height-44)));a!==this._lipTop&&(this._lipTop=a)}_lipTokens(){const e=this._lips,t=e.isHidden("layers")?"0px":"var(--layers-w)",i=e.isHidden("inspector")?"0px":"var(--insp-w)",n=void 0===this._lipTop?"":`; --mc-lip-top: ${this._lipTop}px`;return`--mc-lip-at-start: ${t}; --mc-lip-at-end: calc(${i} + ${this._bar.width}px)${n}`}connectedCallback(){super.connectedCallback(),Rp.then(()=>this._labels=Pp),this.addEventListener("keydown",this._onKeydown),this.addEventListener("pointerdown",this._onPointer),window.addEventListener("beforeunload",this._onBeforeUnload);const e=this._doc||this._dialog?void 0:pp(dp());e&&(this._dialog={type:"restore",draft:e,isNew:!0}),!this._editorRequested&&window.MagicCard?.loadEditor&&(this._editorRequested=!0,window.MagicCard.loadEditor());for(const e of[...Object.values(fs).map(e=>e.tag),vs,...xs.map(e=>e.tag)])bs(e)||customElements.whenDefined(e).then(()=>this.requestUpdate());"undefined"==typeof ResizeObserver||this._ro||(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0),i=Math.round(e[0]?.contentRect.height??0);t&&t!==this._width&&(this._width=t),i&&i!==this._height&&(this._height=i)}),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("pointerdown",this._onPointer),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,this._keepDraft()}_keepDraft(){this._doc&&"restore"!==this._dialog?.type&&hp(dp(this._saved?.id),this.dirty?this._doc:void 0)}get dirty(){const e=this._doc;if(!e)return!1;const t=this._dirtyFor;if(t&&t.doc===e&&t.saved===this._saved)return t.value;const i=!this._saved||JSON.stringify(e)!==JSON.stringify(this._saved);return this._dirtyFor={doc:e,saved:this._saved,value:i},i}get docs(){return[...this._docs.values()].sort((e,t)=>e.name.localeCompare(t.name))}async _emit(e,t,i=!0){const n={...t};if(this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0})),n.result)return await n.result;if(i&&!this.standalone)throw{message:In(926)}}_store(e){const t=new Map(this._docs);t.set(e.id,e),this._docs=t}_say(e){this._status="",this.updateComplete.then(()=>this._status=e),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._status="",4e3)}_stored(e,t){const i=e?.animation??e,n=i?ft(i):void 0;return n?.ok?n.doc:t}_select(e){this._emit("mc-anim-select",{id:e},!1)}_new(e){this._menu=!1;const t=new Set(this.docs.map(e=>e.name)),i=In(xp[e]);let n=i;for(let e=2;t.has(n);e++)n=`${i} ${e}`;this._guard(()=>this._openDoc(function(e,t,i="New animation"){const n={id:t,name:i,kind:e,duration:2,easing:"ease-in-out",iterations:"infinite",target:"element",origin:"center",version:1};switch(e){case"keyframes":return{...n,keyframes:[{at:0,transform:{scale:1}},{at:50,transform:{scale:1.1}},{at:100,transform:{scale:1}}]};case"particles":return{...n,duration:4,easing:"linear",particles:{...Qe,size:[...Qe.size],colors:[]}};case"path":return{...n,duration:3,easing:"linear",path:{d:"M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0",units:"px",follow_rotation:!1,subject:"element"}};case"sequence":return{...n,steps:[{animation:"pop",delay:0,repeat:1},{animation:"wiggle",delay:.2,repeat:1}],loop:!0,stagger:{children:!1,delay:.15}}}}(e,as(n,this._taken),n),!0))}_openIconStart(){this._menu=!1,this._dialog={type:"icon"}}_startIcon(e){e.stopPropagation();const{doc:t,from:i}=e.detail??{};if(!t)return;this._dialog=void 0;const n=new Set(this.docs.map(e=>e.name));let s=t.name;for(let e=2;n.has(s);e++)s=`${t.name} ${e}`;const r={...t,id:as(t.id,this._taken),name:s};this._guard(()=>{this._openDoc(r,!0);const e=r.rig?.parts[0]?.id;"icon"===i&&e&&(this._selection={kind:"target",target:`part:${e}`,targets:[`part:${e}`]})})}_openPresets(){this._presetQuery="",this._dialog={type:"presets"},this._catalogue||(this._catalogueFailed=!1,(lp??=i.e(494).then(()=>i(298)).then(e=>(0,op.t)("magic-card-preset-catalogue.js",e),e=>{lp=void 0,console.warn("Magic Card: preset catalogue not loaded",e)}),lp).then(e=>{e?this._catalogue=e.CATALOGUE:this._catalogueFailed=!0}))}_pickPreset(e){e.stopPropagation();const t=(e.detail??{}).source;if(!t)return;if("builtin"===t.kind)return this._customise(t.id);let i;try{i=structuredClone(t.entry.build())}catch(e){return void this._say(In(998,{message:Mp(e).message}))}const n={...i,id:as($t(t.entry.id),this._taken)};this._dialog=void 0,this._guard(()=>this._openDoc(n,!0))}_presetSources(){return this._sourcesFor&&this._sourcesFor.catalogue===this._catalogue||(this._sourcesFor={catalogue:this._catalogue,list:[...(Yd&&Jd===(0,T.H)()||(Jd=(0,T.H)(),Yd=J.map(e=>({kind:"builtin",id:e.id,name:(0,T.t)(e.name),group:e.group,tap:"tap"===e.trigger,heavy:"Seasonal"===e.group||!!e.seasonal}))),Yd),...(this._catalogue??[]).map(e=>({kind:"catalogue",entry:e}))]}),this._sourcesFor.list}async _clearPresetSearch(){this._presetQuery="",await this.updateComplete,this.shadowRoot?.querySelector("input.preset-search")?.focus()}_customise(e){const t=wt(e,as($t(e),this._taken));t&&(this._dialog=void 0,this._guard(()=>this._openDoc(t,!0)))}async _duplicate(e){const t={...structuredClone(e),id:as(`${e.id}-copy`,this._taken),name:os(e.name,new Set(this.docs.map(e=>e.name)))};try{const e=await this._emit("mc-anim-duplicate",{animation:t});this._store(this._stored(e,t)),this._say(In(281,{name:t.name}))}catch(e){this._say(In(282,{message:Mp(e).message}))}}async _rename(e,t){if(this._renaming!==e.id)return;this._renaming=void 0;const i=t.trim();if(!i||i===e.name)return;const n=ft({...e,name:i});if(n.ok)try{const e=await this._emit("mc-anim-save",{animation:n.doc});this._store(this._stored(e,n.doc)),this._say(In(726,{clean:i}))}catch(e){this._say(In(727,{message:Mp(e).message}))}else this._say(In(581,{message:is(n.errors[0].message)}))}_askDelete(e){const t=this.usage?this.usage[e.id]??0:void 0,i=(n=e.id,s=this._docs.values(),[...s].filter(e=>"sequence"===e.kind&&e.id!==n&&ls(e).includes(n)));var n,s;0!==t||i.length?this._dialog={type:"delete",doc:e,uses:t,sequences:i}:this._delete(e)}async _delete(e){this._dialog=void 0;try{await this._emit("mc-anim-delete",{id:e.id});const t=new Map(this._docs);t.delete(e.id),this._docs=t,this._say(In(236,{name:e.name}))}catch(e){this._say(In(237,{message:Mp(e).message}))}}async _transferChunk(){try{const e=window.MagicCard;if(!e?.loadEditor||!e.loadTransfer||!await e.loadEditor())return;return await e.loadTransfer()}catch{return}}async _openTransfer(e){await this._transferChunk()?this._dialog=e:this._say(In(949))}_export(e){this._openTransfer({type:"export",items:ds(e,this._docs)})}async _onImport(e){e.stopPropagation();const{docs:t,errors:i}=function(e,t){const i=[],n=[];for(const s of e){const e=ft({...s.data,id:s.id,name:s.name});e.ok?i.length>=Math.max(0,t)?n.push(In(1188,{id:s.id})):i.push(e.doc):n.push(`${s.id}: ${e.errors[0]?is(e.errors[0].message):In(1121)}`)}return{docs:i,errors:n}}(e.detail.items,200-this._docs.size),n=[...i];let s=0;for(const e of t)try{const t=await this._emit("mc-anim-save",{animation:e});this._store(this._stored(t,e)),s++}catch(t){n.push(`${e.id}: ${Mp(t).message}`)}const r=In(384,{count:s});this._say(n.length?`${r} ${In(578,{list:n.slice(0,4).join("; ")})}`:r),n.length||(this._dialog=void 0)}_guard(e){"editor"===this._view&&this.dirty?this._dialog={type:"discard",then:e}:e()}_openDoc(e,t,i=!0){this._doc=e,this._emitter={index:0,all:!1},this._saved=t?null:e,this._history.reset(e),this._errors=[],this._saveError="",this._customRepeat=!1,this._playable=e,this._endGesture(),this._time=0,this._selection=ys,this._preview=void 0,this._inspOpen=!1,this._view="editor",this._pointer||(this._focusSel=".back"),i&&!t&&this._select(e.id);const n=t?void 0:pp(dp(e.id));n&&JSON.stringify(n)!==JSON.stringify(e)?this._dialog={type:"restore",draft:n,isNew:!1}:n&&hp(dp(e.id))}_restoreDraft(e,t){this._dialog=void 0,t?this._openDoc(this._taken(e.id)?{...e,id:as(e.id,this._taken)}:e,!0):this._doc?.id===e.id&&this._apply(e)}_closeEditor(e=!0){const t=!!this._doc;this._view="library",this._doc=void 0,this._selection=ys,this._preview=void 0,this._saved=null,this._history.reset(void 0),this._errors=[],this._saveError="",e&&t&&this._select(null)}_back(){this._guard(()=>this._closeEditor())}_set(e,t){if(!this._doc)return;const i={...this._doc,...e};for(const[t,n]of Object.entries(e))void 0===n&&delete i[t];this._apply(i,t)}_apply(e,t){this._endGesture(),this._history.push(e,t),this._doc=e,this._check(),this._pruneSelection()}_endGesture(){this._gesture=!1,this._gestureBase=void 0}_viewOf(e){return function(e,t){const i=Xa(e),n=e=>!/^(target|part|group|shape|lane|emitter|children|step):/.test(e)||i.has(e)||"target:element"===e,s=e=>e.every(n)?e:e.filter(n),r=s(t.hidden),a=s(t.solo),o=s(t.locked),l=s(t.open);return r===t.hidden&&a===t.solo&&o===t.locked&&l===t.open?t:{hidden:r,solo:a,locked:o,open:l}}(e,this._layerViews.get(e.id)??Ka)}_previewDoc(e,t){const i=this._previewMemo;if(i&&i.base===e&&i.view===t)return i.out;const n=((e,t)=>{const i=eo(e,t),n=new Map,s=new Set;for(const e of i)if(e.startsWith("lane:")){const t=e.lastIndexOf("|"),i=e.slice(5,t);n.set(i,[...n.get(i)??[],e.slice(t+1)])}else e.startsWith("step:")&&s.add(Number(e.slice(5)));if(!n.size&&!s.size)return e;const r={...e};return s.size&&(r.steps=(e.steps??[]).filter((e,t)=>!s.has(t))),n.size&&(e.keyframes&&n.has(_r(e))&&(r.keyframes=ro(e.keyframes,n.get(_r(e)))),e.tracks&&(r.tracks=e.tracks.flatMap(e=>{const t=n.get(e.target);if(!t)return[e];const i=ro(e.keyframes,t);return i.length||e.path?[{...e,keyframes:i}]:[]})),e.bindings&&(r.bindings=e.bindings.filter(e=>!n.get(e.target)?.some(t=>so[e.property]===t)))),r})(e,t);return this._previewMemo={base:e,view:t,out:n},n}_check(){const e=this._doc?ft(this._doc):void 0;this._errors=e&&!e.ok?e.errors:[],e?.ok&&(this._playable=e.doc)}undo(){this._endGesture();const e=this._history.undo();e&&(this._doc=e,this._check(),this._pruneSelection())}redo(){this._endGesture();const e=this._history.redo();e&&(this._doc=e,this._check(),this._pruneSelection())}_pruneSelection(){const e=this._doc,t=this._selection;if(!e||"none"===t.kind)return;const i=t=>{const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return!0;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return!!n?.some(e=>e.id===i[2])};if("tool"===t.kind)return void(t.target&&!i(t.target)&&(this._selection={kind:"tool",tool:t.tool}));if("keys"===t.kind){const i=(t.keys??[]).filter(t=>jr(e,{target:t.target,lane:t.lane,at:t.at}));if(i.length===(t.keys??[]).length)return;if(!i.length)return void(this._selection=ys);const n=[...new Set(i.map(e=>e.target))];return void(this._selection={kind:"keys",keys:i,targets:n,target:t.target&&n.includes(t.target)?t.target:i[i.length-1].target})}const n=(t.targets??(t.target?[t.target]:[])).filter(i);n.length?n.length===(t.targets?.length??1)&&t.target&&i(t.target)||(this._selection={kind:"target",target:t.target&&i(t.target)?t.target:n[0],targets:n}):this._selection=ys}async save(){if(!this._doc||this._busy)return!1;const e=ft(this._doc);if(!e.ok)return this._errors=e.errors,this._saveError=In(331),!1;this._busy=!0,this._saveError="";const t=JSON.stringify(this._doc);try{const i=await this._emit("mc-anim-save",{animation:e.doc}),n=this._stored(i,e.doc),s=!this._saved;this._store(n),this._saved=n,hp(dp(n.id)),s&&hp(dp());const r=JSON.stringify(this._doc);return r===t&&JSON.stringify(n)!==r?this._apply(n):this._check(),this._say(In(764,{name:n.name})),s&&this._select(n.id),!0}catch(e){const t=Mp(e);return this._errors=t.errors,this._saveError=t.message,!1}finally{this._busy=!1}}_stage(){return this.shadowRoot?.querySelector("mcas-stage")??null}_renderNewMenu(){const e=[...We.map(e=>({id:`kind:${e}`,label:In(_p[e]),sub:In($p[e]),icon:ss[e]})),{id:"preset",label:In(209),icon:"mdi:auto-fix",separatorBefore:!0},{id:"icon",label:In(374),icon:"mdi:motion-play-outline"}];return n.qy`<mc-ui-menu
      class="new-menu"
      .items=${e}
      label=${In(538)}
      .align=${"end"}
      @mc-menu-pick=${e=>{e.stopPropagation();const t=e.detail.id;this._menu=!1,this._opener=this.shadowRoot?.querySelector(".new-btn")??void 0,"preset"===t?this._openPresets():"icon"===t?this._openIconStart():this._new(t.slice(5))}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menu=!1}}
    ></mc-ui-menu>`}_toggleNewMenu(){this._menu?(this.shadowRoot?.querySelector("mc-ui-menu.new-menu")?.close("escape"),this._menu=!1):Date.now()-this._menuClosedAt>400&&(this._menu=!0)}_renderNewButton(){return n.qy`<div class="menu-anchor">
      <button
        type="button"
        class="btn btn-primary btn-sm new-btn"
        aria-haspopup="menu"
        aria-expanded=${this._menu?"true":"false"}
        @click=${()=>this._toggleNewMenu()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>${In(538)}<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${this._menu?this._renderNewMenu():n.s6}
    </div>`}_usedBy(e){if(!this.usage)return n.s6;const t=this.usage[e]??0;return n.qy`<span class="used ${t?"":"none"}">${t?In(1058,{count:t}):In(583)}</span>`}_renderRow(e){const t=this._renaming===e.id,i=t=>{this._rename(e,t.target.value)};return n.qy`
      <li class="lib-row" data-id=${e.id}>
        <mcas-thumb .doc=${e} .lookup=${this._lookup} .hass=${this.hass}></mcas-thumb>
        ${t?n.qy`<div class="name-cell">
                <input
                  class="input rename"
                  aria-label=${In(533,{name:e.name})}
                  maxlength="80"
                  .value=${e.name}
                  @keydown=${t=>{"Enter"===t.key&&i(t),"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this._renaming=void 0,this._focusSel=`.lib-row[data-id="${e.id}"] .rename-btn`)}}
                  @blur=${i}
                />
              </div>`:n.qy`<button type="button" class="open name-cell" @click=${()=>this._guard(()=>this._openDoc(e,!1))}>
                <span class="nm">${e.name}</span>
                <span class="id mono">${In(1096,{id:e.id})}</span>
              </button>`}
        <span class="chip kind"><ha-icon icon=${ss[e.kind]}></ha-icon>${In(ns[e.kind])}</span>
        ${this._usedBy(e.id)}
        <span class="acts">
          <button type="button" class="icon-btn sm" title=${In(276)} aria-label=${In(280,{name:e.name})} @click=${()=>this._duplicate(e)}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm rename-btn"
            title=${In(721)}
            aria-label=${In(724,{name:e.name})}
            @click=${()=>{this._renaming=e.id,this._focusSel=".rename"}}
          >
            <ha-icon icon="mdi:rename-outline"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            title=${In(312)}
            aria-label=${In(315,{name:e.name})}
            @click=${()=>this._export([e])}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>
          </button>
          <button type="button" class="icon-btn sm danger" title=${In(220)} aria-label=${In(235,{name:e.name})} @click=${()=>this._askDelete(e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </span>
      </li>
    `}_renderEmpty(){return n.qy`<div class="empty lib-empty">
      <ha-icon icon="mdi:animation-play-outline"></ha-icon>
      <strong>${In(551)}</strong>
      <p>${In(111)}</p>
      <div class="starters">
        ${We.map(e=>n.qy`<button type="button" class="starter" @click=${()=>this._new(e)}>
              <ha-icon icon=${ss[e]}></ha-icon><span class="mi-t">${In(ns[e])}</span><span class="mi-s">${In($p[e])}</span>
            </button>`)}
        <button
          type="button"
          class="starter"
          @click=${()=>this._openPresets()}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon><span class="mi-t">${In(346)}</span><span class="mi-s">${In(210,{count:J.length})}</span>
        </button>
        <button type="button" class="starter" data-kind="icon" @click=${()=>this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon><span class="mi-t">${In(373)}</span><span class="mi-s">${In(62)}</span>
        </button>
      </div>
    </div>`}_renderLibrary(){const e=this.docs,t=[{id:"all",label:In(44)},...We.map(e=>({id:e,label:In(ns[e])}))],i=function(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>{const t=(0,kt.A)(`${e.name} ${e.id} ${e.kind} ${In(ns[e.kind])}`);return i.every(e=>t.includes(e))}):e}(e,this._query).filter(e=>"all"===this._kind||e.kind===this._kind);return n.qy`
      <header class="topbar">
        <div class="grp title">
          <ha-icon class="title-icon" icon="mdi:animation-play-outline"></ha-icon>
          <h1>${In(68)}</h1>
          <span class="chip is-count">${e.length}</span>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click=${()=>{this._openTransfer({type:"import"})}}
          >
            <ha-icon icon="mdi:import"></ha-icon>${In(381)}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            ?disabled=${!e.length}
            @click=${()=>this._export(e)}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>${In(313)}
          </button>
          ${this._renderNewButton()}
        </div>
      </header>
      <main class="lib">
        <div class="lib-inner">
          ${e.length?n.qy`
                  <div class="lib-tools">
                    <div class="with-icon search">
                      <ha-icon icon="mdi:magnify"></ha-icon>
                      <input
                        class="input"
                        type="search"
                        placeholder=${In(772)}
                        aria-label=${In(772)}
                        aria-keyshortcuts="/"
                        .value=${L(this._query)}
                        @input=${e=>this._query=e.target.value}
                      />
                    </div>
                    <div class="kinds">${kd({role:"radiogroup",label:In(400),value:this._kind,items:t.map(e=>({value:e.id,label:e.label})),onChange:e=>this._kind=e})}</div>
                  </div>
                  ${i.length?n.qy`<ul class="lib-list ${this.usage?"has-usage":""}" aria-label=${In(531)}>
                          ${i.map(e=>this._renderRow(e))}
                        </ul>`:n.qy`<p class="no-results">${this._query?In(549,{query:this._query}):In(550)}</p>`}
                `:this._renderEmpty()}
        </div>
      </main>
    `}_fieldErrors(e){const t=this._errors.filter(t=>t.path===e);return t.length?n.qy`${t.map(t=>n.qy`<p class="help error" id="err-${e}">${is(t.message)}</p>`)}`:n.s6}_field(e,t,i,s,r){return n.qy`<div class="field">
      <div class="field-head"><label for=${t}>${e}</label></div>
      ${i} ${r?n.qy`<p class="help">${r}</p>`:n.s6} ${s?this._fieldErrors(s):n.s6}
    </div>`}_selectEl(e,t,i,s){return n.qy`<div class="select">
      <select class="input" id=${e} @change=${e=>s(e.target.value)}>
        ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}get _compact(){return this._width>0&&this._width<1100&&!this._slideOver}get _slideOver(){return this._width>0&&this._width<900}_setSelection(e){this._selection=e,this._slideOver&&"keys"===e.kind&&(this._inspOpen=!0)}_toggleSection(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t,Hp(jp,JSON.stringify([...t]))}_section(e,t,i,s,r={}){const a=r.errors||!this._collapsed.has(e);return n.qy`<section class="sec ${r.cls??""}" data-sec=${e}>
      ${function(e){const t=4===e.level,i=hd(e,18);if(!e.collapsible){const s=n.qy`${i}${t?n.qy`<h4>${e.title}</h4>`:n.qy`<h3>${e.title}</h3>`}`;return n.qy`<div class="group-head">${s}</div>`}const s=n.qy`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${u("chevronDown",20)}</span> </button>`;return t?n.qy`<h4 class="sector-head">${s}</h4>`:n.qy`<h3 class="sector-head">${s}</h3>`}({title:t,icon:i,collapsible:!0,expanded:a,onToggle:()=>this._toggleSection(e)})}
      ${r.errors?n.qy`<span class="sec-err" role="img" aria-label=${In(360)}></span>`:n.s6}
      <div class="sec-body" id="secb-${e}" ?hidden=${!a}>${a?s:n.s6}</div>
    </section>`}_hasErrors(e){return this._errors.some(t=>e.includes(t.path))}_renderErrors(){const e=this._errors.filter(e=>!wp.includes(e.path));return this._saveError||e.length?n.qy`<div class="errors" role="alert">
          ${this._saveError?n.qy`<strong>${this._saveError}</strong>`:n.s6}
          ${e.length?n.qy`<ul>
                  ${e.map(e=>n.qy`<li><span class="mono">${e.path||"animation"}</span> ${is(e.message)}</li>`)}
                </ul>`:n.s6}
        </div>`:n.s6}_renderForm(e){const t=I.map(e=>({value:e.id,label:(0,T.t)(e.label)}));I.some(t=>t.id===e.easing)||t.push({value:e.easing,label:e.easing});const i=String(e.iterations),s=this._customRepeat||!bp.includes(i),r=[...bp.map(e=>({value:e,label:"infinite"===e?In(388):e})),{value:"custom",label:In(204)}],a="keyframes"===e.kind||"sequence"===e.kind,o=this._field(In(532),"f-name",n.qy`<input
        class="input"
        id="f-name"
        maxlength="80"
        .value=${L(e.name)}
        aria-invalid=${this._errors.some(e=>"name"===e.path)?"true":"false"}
        @input=${e=>this._set({name:e.target.value},"name")}
      />`,"name",n.qy`${In(126)} <span class="mono ref">${In(1096,{id:e.id})}</span>`),l=n.qy`
      ${"sequence"===e.kind?n.qy`<p class="help">${In(19)}</p>`:this._field(In(283),"f-duration",n.qy`<div class="suffix">
                <input
                  class="input"
                  id="f-duration"
                  type="number"
                  inputmode="decimal"
                  min="0.05"
                  max="600"
                  step="any"
                  .value=${L(String(e.duration))}
                  @input=${e=>{const t=e.target.value;""!==t&&Number.isFinite(Number(t))&&this._set({duration:Number(t)},"duration")}}
                />
                <span aria-hidden="true">s</span>
              </div>`,"duration")}
      <div class="two">
        ${this._field(In(286),"f-easing",this._selectEl("f-easing",e.easing,t,e=>this._set({easing:e},"easing")),"easing")}
        ${this._field(In(728),"f-repeat",this._selectEl("f-repeat",s?"custom":i,r,t=>{if("custom"===t)return this._customRepeat=!0,void("infinite"===e.iterations&&this._set({iterations:10},"iterations"));this._customRepeat=!1,this._set({iterations:"infinite"===t?"infinite":Number(t)},"iterations")}),"iterations")}
      </div>
      ${s?this._field(In(729),"f-count",n.qy`<input
                class="input"
                id="f-count"
                type="number"
                min="1"
                step="1"
                .value=${L("number"==typeof e.iterations?String(e.iterations):"")}
                @input=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&t>0&&this._set({iterations:t},"count")}}
              />`):n.s6}
      ${this._field(In(240),"f-dir",this._selectEl("f-dir",e.direction??"normal",(c=up,c.map(e=>({...e,label:In(e.label)}))),e=>this._set({direction:"normal"===e?void 0:e},"direction")),"direction")}
    `;var c;return n.qy`
      ${this._section("anim",In(65),ss[e.kind],o,{errors:this._hasErrors(["name"])})}
      ${this._section("timing",In(1003),"mdi:timer-outline",l,{errors:this._hasErrors(["duration","easing","iterations","direction"])})}
      ${a?this._section("moves",In(1072),"mdi:cursor-move",this._renderMoves(e),{errors:this._hasErrors(["target","origin"])}):n.s6}
    `}_renderMoves(e){const t=yp.map(e=>({value:e,label:Jr.includes(e)?In(Xr[Jr.indexOf(e)]):e.charAt(0).toUpperCase()+e.slice(1)}));yp.includes(e.origin)||t.push({value:e.origin,label:e.origin});const i="icon"===e.target?"icon":"element";return n.qy`
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-target">${In(913)}</span></div>
        <div class="seg full target" role="radiogroup" aria-labelledby="l-target" @keydown=${e=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)&&(e.preventDefault(),this._set({target:"icon"===i?"element":"icon"},"target"),this._focusSel='.target [aria-checked="true"]')}}>
          ${["element","icon"].map(e=>{const t=e===i;return n.qy`<button
              type="button"
              role="radio"
              aria-checked=${t?"true":"false"}
              tabindex=${t?"0":"-1"}
              @click=${()=>this._set({target:e},"target")}
            >
              ${In("element"===e?292:371)}
            </button>`})}
        </div>
        <p class="help">${In(375)}</p>
        ${this._fieldErrors("target")}
      </div>
      ${"keyframes"===e.kind?this._field(In(612),"f-origin",this._selectEl("f-origin",e.origin,t,e=>this._set({origin:e},"origin")),"origin",In(964)):n.s6}
    `}_editorEl(e,t,i={}){const s=(e=>({_$litStatic$:e,r:V}))(e);return i.panel?D`<${s}
        class=${i.cls??"panel"}
        slot=${i.slot??n.s6}
        .doc=${t}
        .hass=${this.hass}
        .library=${this._libraryObj}
        .time=${fp.has(e)?this._time:0}
        .disabled=${this._busy||!!i.inspector&&oo(t,this._viewOf(t),this._selection)}
        .selection=${this._selection}
        .tile=${this._tile}
        .stage=${this._stageInfo}
        .layerView=${this._viewOf(t)}
        .density=${this._width>0&&this._width<1e3?"compact":"full"}
        .emitter=${this._emitter.index}
        .all=${this._emitter.all}
        .stageRect=${i.stageRect}
        .subjectRect=${i.subjectRect}
        .entityColor=${vp}
        @doc-change=${this._onDocChange}
        @seek=${this._onSeek}
        @selection-change=${this._onSelection}
      ></${s}>`:D`<${s}
      class=${i.cls??"kind-editor"}
      slot=${i.slot??n.s6}
      .doc=${t}
      .hass=${this.hass}
      .library=${this._libraryObj}
      .time=${fp.has(e)?this._time:0}
      .disabled=${this._busy||e===vs&&this._viewOf(t).locked.includes("path")}
      .studioSelection=${this._selection}
      .layerView=${this._viewOf(t)}
      .emitter=${this._emitter.index}
      .all=${this._emitter.all}
      .tile=${this._tile}
      .stage=${this._stageInfo}
      .stageRect=${i.stageRect}
      .subjectRect=${i.subjectRect}
      .entityColor=${vp}
      @doc-change=${this._onDocChange}
      @seek=${this._onSeek}
      @selection-change=${this._onSelection}
    ></${s}>`}_panels(e,t,i={}){return $s(e,t,this._selection).filter(e=>bs(e.tag)).map(e=>this._editorEl(e.tag,t,{cls:`panel panel-${e.place}`,panel:!0,...i,..."stage-tool"===e.place&&e.dock&&"overlay"!==e.dock?{slot:e.dock}:{}}))}_renderKindSlot(e){const t=fs[e.kind],i=bs(t.tag)?this._editorEl(t.tag,e):n.qy`<p class="help">${In(426,{kind:In(t.title).toLowerCase()})}</p>`;return"inspector"===t.place?n.qy`<div class="kind-slot place-inspector" data-kind=${e.kind}>${this._section(`kind-${e.kind}`,In(t.title),ss[e.kind],i)}</div>`:n.qy`<section class="kind-slot place-panel" aria-label=${In(t.title)} data-kind=${e.kind}>${i} ${this._panels("timeline",e)}</section>`}_setSplit(e,t){this._split=this._clampSplitPx(Lp(Math.round(1e3*e)/1e3)),this._userSplit=!0,t&&Hp(Sp,String(this._split))}_clampSplitPx(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect().height??0;if(t<=0)return e;const i=Math.min(.45,160/t);return Math.round(1e3*Math.min(1-i,Math.max(i,e)))/1e3}_splitAt(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect();if(t&&!(t.height<=0))return(e-t.top)/t.height}_resetSplit(){Hp(Sp,void 0),this._userSplit=!1,this._split=.4,this._autoSplit()}_autoSplit(e=!1){const t=this._doc;if(this._userSplit||!t||"editor"!==this._view||"panel"!==fs[t.kind].place)return;const i=this.shadowRoot?.querySelector(".center"),n=i?.getBoundingClientRect().height??0;if(n<=0)return;const s=this.shadowRoot?.querySelector(".kind-slot.place-panel .kind-editor"),r=s?.getBoundingClientRect().width||i?.getBoundingClientRect().width||0,a=function(e,t,i=!1){const n=$r(e).filter(e=>e.main||e.keyframes.length),s=n.reduce((e,t)=>e+Ds(t.keyframes).length,0),r=Math.max(0,...n.map(e=>Fs(e.keyframes,"*").length)),a=i?187+49*r+(r?0:44):146+41*n.length+35*s+(s?0:44),o=Math.max(160,Math.min(.6*t,a));return Math.round(1e3*Lp((t-9-o)/t))/1e3}(t,n,r>0&&r<480);(e?a<this._split-.002:Math.abs(a-this._split)>.002)&&(this._split=a)}async _revealShape(e){await this.updateComplete;const t=this.shadowRoot?.querySelector("nav.layers"),i=[...t?.querySelectorAll("mc-anim-shapes-layers, mc-anim-shapes-under-layers")??[]];await Promise.all(i.map(e=>e.updateComplete));const n=i.find(t=>t.shadowRoot?.querySelector(`li[data-id="${e}"]`))??i[0],s=n?.shadowRoot?.querySelector(`li[data-id="${e}"]`);s?.scrollIntoView?.({block:"nearest"})}_layerTargets(e){const t=["element","icon"];for(const i of e.tracks??[])t.includes(i.target)||t.push(i.target);return t}_renderLayerList(e){if("particles"===e.kind)return n.qy`<p class="help layers-note">${In(633)}</p>`;const t=Gn.find(e=>e.id===this._tile),i=this._selection;return n.qy`<ul class="layer-list" role="list">
      ${this._layerTargets(e).map(s=>{const r=!("target"!==i.kind&&"keys"!==i.kind||i.target!==s&&!i.targets?.includes(s)),a=!!t&&"element"!==s&&!t.targets.includes(s),o=yr(e,s),l=(t=>t===e.target&&"keyframes"===e.kind?e.keyframes?.length??0:e.tracks?.find(e=>e.target===t)?.keyframes.length??0)(s),c=s===e.target,d=c&&a?In(1194,{label:o,tile:In(t.label).toLowerCase()}):c?In(1193,{label:o}):a?In(1202,{label:o,tile:In(t.label).toLowerCase()}):o;return n.qy`<li>
          <button
            type="button"
            class="layer ${a?"off":""}"
            data-target=${s}
            aria-pressed=${r?"true":"false"}
            title=${d}
            @click=${e=>this._pickLayer(s,e.ctrlKey||e.metaKey||e.shiftKey)}
          >
            <ha-icon icon=${xr(s)}></ha-icon>
            <span class="layer-name">${o}</span> ${c&&Vp(e)?n.qy`<span class="chip is-accent layer-main">${In(495)}</span>`:n.s6}
            ${l?n.qy`<span class="layer-count" title=${In(1155,{count:l})}>${l}</span>`:n.s6}
          </button>
        </li>`})}
    </ul>`}_pickLayer(e,t){const i=this._selection,n="target"===i.kind||"keys"===i.kind?i.targets??(i.target?[i.target]:[]):[];if(!t){const t=1===n.length&&n[0]===e&&"target"===i.kind;return void this._setSelection(t?ys:{kind:"target",target:e,targets:[e]})}const s=n.includes(e),r=s?n.filter(t=>t!==e):[...n,e];r.length?this._setSelection({kind:"target",target:s?i.target&&r.includes(i.target)?i.target:r[0]:e,targets:r}):this._setSelection(ys)}_renderLayers(e){const t=$s("layers",e,this._selection).filter(e=>bs(e.tag)).map(t=>n.qy`<section class="layer-group" data-panel=${t.tag} aria-label=${In(t.title)} tabindex="-1">
          <h3 class="layer-head">${In(t.title)}</h3>
          ${this._editorEl(t.tag,e,{cls:"panel panel-layers",panel:!0})}
        </section>`),i=this._lips;return n.qy`<nav class="layers" id="layers" aria-label=${In(410)} ?inert=${i.isHidden("layers")} data-lip=${i.state("layers")} data-dir=${i.dir}>
      <div class="layers-head">
        <h2>${In(408)}</h2>
      </div>
      <div class="layers-body">${t.length?n.qy`${t}<p class="help layers-help">${In(367)}</p>`:this._renderLayerList(e)}</div>
    </nav>
    ${i.lip("layers")}`}_renderContext(e){const t=this._selection,i=t.keys?.length??0,s="keys"===t.kind?`${In(1155,{count:i})}${t.target?` · ${yr(e,t.target)}`:""}`:"target"===t.kind&&t.target?(t.targets?.length??0)>1?In(1169,{count:t.targets.length}):yr(e,t.target):"tool"===t.kind?In(1006,{tool:t.tool??""}):"";return n.qy`<div class="ctx">
      <button type="button" class="btn btn-text btn-sm ctx-back" title=${In(67)} @click=${()=>this._setSelection(ys)}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>${In(65)}
      </button>
      <span class="ctx-what">${s}</span>
    </div>`}_renderFallback(e){const t=this._selection;if("target"===t.kind&&("element"===t.target||"icon"===t.target)&&Vp(e)){const i=t.target===e.target;return this._section("target",yr(e,t.target),xr(t.target),n.qy`<p class="help">
            ${i?"icon"===t.target?In(931):In(932):"icon"===e.target?In(930):In(929)}
          </p>
          ${i?n.s6:n.qy`<button
                  type="button"
                  class="btn btn-secondary btn-sm make-main"
                  @click=${()=>this._set({target:t.target},"target")}
                >
                  <ha-icon icon="mdi:target"></ha-icon>${"icon"===t.target?In(478):In(477)}
                </button>`}
          ${"keyframes"===e.kind&&i?this._renderMoves(e):n.s6}`)}const i=t.keys?.length??0;return n.qy`<p class="help ctx-note">${"keys"===t.kind?In(1159,{count:i}):In(592)}</p>`}_renderInspector(e){const t=this._selection,i="inspector"===fs[e.kind].place?this._renderKindSlot(e):n.s6;if("none"===t.kind){const s=$s("inspector",e,t).filter(e=>bs(e.tag)).map(t=>this._section(`panel-${t.tag}`,In(t.title),mp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0})));return n.qy`${this._renderErrors()} ${i} ${this._renderForm(e)} ${s}`}const s=$s("inspector",e,t).filter(e=>bs(e.tag)).map(t=>this._section(`panel-${t.tag}`,In(t.title),mp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0,inspector:!0}))),r=this._viewOf(e),a=oo(e,r,t)?ho(e,r,ao(t)):n.s6,o="target"!==t.kind||"element"!==t.target&&"icon"!==t.target||!Vp(e)?n.s6:this._renderFallback(e),l="target"===t.kind&&"icon"===t.target&&"keyframes"===e.kind&&!e.rig?.parts?.length&&bs(gp)?this._section("split-icon",In(376),mp[gp],this._editorEl(gp,e,{cls:"panel panel-inspector",panel:!0})):n.s6,c=s.length?s:o===n.s6&&l===n.s6?this._renderFallback(e):n.s6;return n.qy`${a} ${this._renderContext(e)} ${this._renderErrors()} ${o} ${l} ${c}`}_zoomIcon(e){const t=this._selection;return"keyframes"===e.kind&&("tool"===t.kind||("target"===t.kind||"keys"===t.kind)&&!!t.target&&/^(part|group|shape):/.test(t.target))}_renderEditor(e){const t=this.dirty,i="panel"===fs[e.kind].place,s=this._slideOver,r=this._lips,a=this._viewOf(e),o=this._playable??e,l=function(e,t){const i=eo(e,t);let n=0;for(const t of i){if(t.startsWith(Qa))continue;const s=to(e,t);s&&i.has(s)||n++}return n}(o,a);return n.qy`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm back" @click=${()=>this._back()}><ha-icon icon="mdi:arrow-left"></ha-icon>${In(414)}</button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong class="doc-name">${e.name.trim()||In(1040)}</strong>
            <span class="chip kind"><ha-icon icon=${ss[e.kind]}></ha-icon>${In(ns[e.kind])}</span>
            ${this._saved?t?n.qy`<span class="chip is-warn">${In(1038)}</span>`:n.s6:n.qy`<span class="chip is-accent">${In(537)}</span>`}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="icon-btn"
            aria-label=${In(1029)}
            title=${In(1029)}
            ?disabled=${!this._history.canUndo()}
            @click=${()=>this.undo()}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${In(700)}
            title=${In(700)}
            ?disabled=${!this._history.canRedo()}
            @click=${()=>this.redo()}
          >
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          ${s?n.qy`<button
                  type="button"
                  class="icon-btn insp-toggle"
                  aria-controls="inspector"
                  aria-expanded=${this._inspOpen?"true":"false"}
                  aria-label=${In(389)}
                  title=${In(389)}
                  @click=${()=>this._inspOpen=!this._inspOpen}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`:n.s6}
          <button
            type="button"
            class="btn btn-primary btn-sm save"
            ?disabled=${this._busy||!t&&!!this._saved}
            title=${In(760)}
            @click=${()=>this.save()}
          >
            <ha-icon icon=${this._busy?"mdi:progress-upload":"mdi:content-save-outline"}></ha-icon>${this._busy?In(766):In(759)}
          </button>
        </div>
      </header>
      <div
        @preview-change=${this._onPreviewChange}
        @layer-view-change=${this._onLayerView}
        @emitter-change=${this._onEmitter}
        style=${this._lipTokens()}
        class="workspace ${r.isHidden("layers")?"no-layers":""} ${r.isHidden("inspector")?"no-inspector":""} ${this._compact?"compact":""} ${this._width>0&&this._width<1e3?"dense":""} ${s?"slide":""} ${s&&this._inspOpen?"insp-open":""}"
      >
        ${this._renderLayers(e)}
        <div class="center ${i?"with-panel":""}" style="--split: ${this._split}">
          <mcas-stage
            .doc=${this._previewDoc(o,a)}
            .layerView=${a}
            .hiddenLayers=${l}
            .stageParticles=${l?ld(o):void 0}
            .lookup=${this._lookup}
            .hass=${this.hass}
            .tile=${this._tile}
            .preview=${this._preview}
            .subjectTarget=${"keyframes"===e.kind&&"none"!==this._selection.kind?this._selection.target:void 0}
            .zoomIcon=${this._zoomIcon(e)}
            @stage-tile=${e=>this._tile=e.detail.tile}
            @stage-time=${e=>this._time=e.detail.time}
            @stage-rect=${this._onStageRect}
          >
            ${"path"===e.kind&&bs(vs)?this._editorEl(vs,e,{slot:"canvas",stageRect:this._stageRect,subjectRect:this._subjectRect}):n.s6}
            ${this._panels("stage-tool",e,{slot:"overlay",stageRect:this._stageRect,subjectRect:this._subjectRect})}
          </mcas-stage>
          ${i?n.qy`<div
                    class="splitter"
                    role="separator"
                    tabindex="0"
                    aria-orientation="horizontal"
                    aria-label=${In(865)}
                    aria-valuemin="15"
                    aria-valuemax="80"
                    aria-valuenow=${Math.round(100*this._split)}
                    title=${In(256)}
                    @pointerdown=${this._onSplitDown}
                    @pointermove=${this._onSplitMove}
                    @pointerup=${this._onSplitUp}
                    @pointercancel=${this._onSplitUp}
                    @keydown=${this._onSplitKey}
                    @dblclick=${()=>this._resetSplit()}
                  ></div>
                  ${this._renderKindSlot(e)}`:n.s6}
        </div>
        ${r.lip("inspector")}
        <aside class="inspector" id="inspector" tabindex="-1" ?inert=${r.isHidden("inspector")} data-lip=${r.state("inspector")} data-dir=${r.dir} aria-label=${In(390)}>
          ${this._renderInspector(e)}
        </aside>
        ${s&&this._inspOpen?n.qy`<div class="insp-scrim" @click=${()=>this._inspOpen=!1}></div>`:n.s6}
      </div>
    `}_renderDialog(){const e=this._dialog;if(!e)return n.s6;const t=()=>{this._dialog===e&&(this._dialog=void 0)};switch(e.type){case"delete":{const{doc:i,uses:s,sequences:r}=e,a=[];return void 0===s?a.push(In(125)):s&&a.push(In(391,{count:s})),r.length&&a.push(In(795,{names:r.map(e=>e.name).join(", ")})),dd({heading:In(221,{name:i.name}),variant:"alert",initialFocus:"dlg-safe",onClose:t},n.qy`<div class="dlg">${a.map(e=>n.qy`<p>${e}</p>`)}</div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${In(116)}</button>
            <button type="button" class="btn btn-danger btn-sm confirm-delete" @click=${()=>this._delete(i)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${In(220)}
            </button>`)}case"discard":return dd({heading:In(763),variant:"alert",initialFocus:"dlg-safe",onClose:t},n.qy`<div class="dlg"><p>${In(0,{name:this._doc?.name||In(986)})}</p></div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${In(393)}</button>
            <button
              type="button"
              class="btn btn-secondary btn-sm discard"
              @click=${()=>{this._dialog=void 0,hp(dp(this._saved?.id)),this._saved=this._doc??null,e.then()}}
            >
              ${In(241)}
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click=${async()=>{this._dialog=void 0,await this.save()&&e.then()}}
            >
              ${In(759)}
            </button>`);case"restore":return dd({heading:In(739),variant:"alert",initialFocus:"restore-draft",onClose:t},n.qy`<div class="dlg">
            <p>${e.isNew?In(957,{name:e.draft.name}):In(1,{name:e.draft.name})}</p>
          </div>`,n.qy`<button
              type="button"
              class="btn btn-secondary btn-sm discard-draft"
              @click=${()=>{this._dialog=void 0,hp(dp(e.isNew?void 0:e.draft.id))}}
            >
              ${In(241)}
            </button>
            <button type="button" class="btn btn-primary btn-sm restore-draft" id="restore-draft" @click=${()=>this._restoreDraft(e.draft,e.isNew)}>
              ${In(738)}
            </button>`);case"export":case"import":return dd({heading:"export"===e.type?In(314):In(383),size:"l",dismissible:!1,onClose:t},n.qy`<mc-transfer-panel
            host="animation-studio"
            .mode=${e.type}
            .exportItems=${"export"===e.type?{kind:"animation",items:e.items}:void 0}
            .taken=${(e,t)=>this._taken(t)}
            @mc-transfer-import=${e=>{this._onImport(e)}}
            @mc-transfer-close=${this._closeDialog}
          ></mc-transfer-panel>`);case"icon":return dd({heading:In(373),size:"l",onClose:t},n.qy`<div class="dlg">
            ${bs("mc-anim-icon-start")?n.qy`<mc-anim-icon-start class="icon-start" .hass=${this.hass} .lookup=${this._lookup} @icon-start=${e=>this._startIcon(e)}></mc-anim-icon-start>`:n.qy`<p class="help">${In(427)}</p>`}
          </div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${In(116)}</button>`);case"presets":return dd({heading:In(208),size:"xl",initialFocus:"preset-search",onClose:t},n.qy`<div class="dlg">
            <p class="help">${In(969)}</p>
            <div class="with-icon">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                class="input preset-search"
                id="preset-search"
                type="search"
                placeholder=${In(774)}
                aria-label=${In(774)}
                .value=${L(this._presetQuery)}
                @input=${e=>this._presetQuery=e.target.value}
              />
            </div>
            <mc-preset-grid
              class="preset-list"
              .sources=${this._presetSources()}
              .query=${this._presetQuery}
              .hass=${this.hass}
              .lookup=${this._lookup}
              .notice=${this._catalogueFailed?In(448):""}
              @preset-pick=${e=>this._pickPreset(e)}
              @preset-clear-search=${()=>{this._clearPresetSearch()}}
            ></mc-preset-grid>
          </div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${In(116)}</button>`)}}render(){if("ready"!==this._labels)return n.qy`<div class="shell" role="status">${"failed"===this._labels?"The studio texts (magic-card-i18n-labels.js) could not be loaded. Reload the page.":n.s6}</div>`;const e="editor"===this._view?this._doc:void 0;return n.qy`
      <div class="shell" data-view=${e?"editor":"library"}>${e?this._renderEditor(e):this._renderLibrary()}</div>
      ${this._renderDialog()}
      <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      ${this._lips.status()}
      ${this._status?n.qy`<div class="toast" aria-hidden="true">${this._status}</div>`:n.s6}
    `}}Dp.styles=[...gs,ud,po],cp([(0,s.MZ)({attribute:!1})],Dp.prototype,"hass",void 0),cp([(0,s.MZ)({attribute:!1})],Dp.prototype,"library",void 0),cp([(0,s.MZ)({attribute:!1})],Dp.prototype,"selectedId",void 0),cp([(0,s.MZ)({attribute:!1})],Dp.prototype,"usage",void 0),cp([(0,s.MZ)({type:Boolean})],Dp.prototype,"standalone",void 0),cp([(0,s.wk)()],Dp.prototype,"_docs",void 0),cp([(0,s.wk)()],Dp.prototype,"_view",void 0),cp([(0,s.wk)()],Dp.prototype,"_query",void 0),cp([(0,s.wk)()],Dp.prototype,"_kind",void 0),cp([(0,s.wk)()],Dp.prototype,"_menu",void 0),cp([(0,s.wk)()],Dp.prototype,"_renaming",void 0),cp([(0,s.wk)()],Dp.prototype,"_dialog",void 0),cp([(0,s.wk)()],Dp.prototype,"_doc",void 0),cp([(0,s.wk)()],Dp.prototype,"_saved",void 0),cp([(0,s.wk)()],Dp.prototype,"_errors",void 0),cp([(0,s.wk)()],Dp.prototype,"_saveError",void 0),cp([(0,s.wk)()],Dp.prototype,"_busy",void 0),cp([(0,s.wk)()],Dp.prototype,"_status",void 0),cp([(0,s.wk)()],Dp.prototype,"_presetQuery",void 0),cp([(0,s.wk)()],Dp.prototype,"_catalogue",void 0),cp([(0,s.wk)()],Dp.prototype,"_catalogueFailed",void 0),cp([(0,s.wk)()],Dp.prototype,"_labels",void 0),cp([(0,s.wk)()],Dp.prototype,"_customRepeat",void 0),cp([(0,s.wk)()],Dp.prototype,"_selection",void 0),cp([(0,s.wk)()],Dp.prototype,"_tile",void 0),cp([(0,s.wk)()],Dp.prototype,"_split",void 0),cp([(0,s.wk)()],Dp.prototype,"_lipTop",void 0),cp([(0,s.wk)()],Dp.prototype,"_width",void 0),cp([(0,s.wk)()],Dp.prototype,"_height",void 0),cp([(0,s.wk)()],Dp.prototype,"_inspOpen",void 0),cp([(0,s.wk)()],Dp.prototype,"_collapsed",void 0),cp([(0,s.wk)()],Dp.prototype,"_time",void 0),cp([(0,s.wk)()],Dp.prototype,"_stageRect",void 0),cp([(0,s.wk)()],Dp.prototype,"_subjectRect",void 0),cp([(0,s.wk)()],Dp.prototype,"_stageInfo",void 0),cp([(0,s.wk)()],Dp.prototype,"_preview",void 0),cp([(0,s.wk)()],Dp.prototype,"_layerViews",void 0),cp([(0,s.wk)()],Dp.prototype,"_emitter",void 0),cp([(0,s.wk)()],Dp.prototype,"_playable",void 0);var Np=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class Tp extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(!this._visible||!this.doc||!customElements.get("magic-card"))return void(this._card=void 0);const t=!this._card;if(t&&(this._card=document.createElement("magic-card")),t||e.has("doc")||e.has("lookup"))try{this._card.setConfig(cs(this.doc,this.lookup,{tile:"icon",thumb:!0,as:this.doc.id}))}catch{return void(this._card=void 0)}(t||e.has("hass"))&&(this._card.hass=this.hass??Kd(!1))}render(){const e=this.doc?ss[this.doc.kind]:"mdi:animation-outline";return n.qy`<div class="box" aria-hidden="true">
      ${this._card?n.qy`<div class="scale">${this._card}</div>`:n.qy`<ha-icon icon=${e}></ha-icon>`}
    </div>`}}Tp.styles=[ps,n.AH`
      :host {
        display: block;
        width: 88px;
        height: 56px;
        flex: none;
      }
      .box {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--mc-text-2);
        --mdc-icon-size: 22px;
      }
      .scale {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 176px;
        transform: translate(-50%, -50%) scale(0.5);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `],Np([(0,s.MZ)({attribute:!1})],Tp.prototype,"doc",void 0),Np([(0,s.MZ)({attribute:!1})],Tp.prototype,"lookup",void 0),Np([(0,s.MZ)({attribute:!1})],Tp.prototype,"hass",void 0),Np([(0,s.wk)()],Tp.prototype,"_visible",void 0);const Fp=(0,n.iz)(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),Ip=[ps,hs,n.AH`.mc-tab-content{display:grid;gap:16px}.mc-field{display:grid;gap:6px;min-width:0}.mc-field-label,.mc-field>label,.mc-input-label{display:flex;align-items:center;gap:8px;min-height:24px;font-size:.8125rem;font-weight:500;color:var(--mc-text);text-transform:none;letter-spacing:normal}.mc-field-hint,.mc-mode-help{font-size:.75rem;font-style:normal;color:var(--mc-text-2)} ${Fp},.mc-input-field.mc-input-field{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font:inherit;font-size:.875rem;line-height:1.4;outline:none;box-shadow:none;transition:border-color .15s ease-out,box-shadow .15s ease-out}${Fp}::placeholder,.mc-input-field.mc-input-field::placeholder{color:var(--mc-text-2);opacity:1}${Fp}:hover,.mc-input-field.mc-input-field:hover{border-color:var(--mc-text-2)}${Fp}:focus,.mc-input-field.mc-input-field:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}${Fp}:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed}${Fp}.mono{font-family:var(--mc-mono);font-size:.8125rem} ${Fp}:is(select):not([multiple]):not([size]){appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer}${Fp}:is(select):not(.input):not([multiple]):not([size]){background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:18px 18px} ${Fp}:is(textarea){resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem} .mc-section{display:grid;gap:16px}.mc-section + .mc-section{padding-top:20px;border-top:1px solid var(--mc-divider)}.mc-section-header{display:flex;align-items:center;gap:8px;margin:0;padding:0;border:0;font-size:.875rem;font-weight:500;color:var(--mc-text)} .mc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;filter:none;transform:none;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out;--mdc-icon-size:18px}.mc-btn-primary{background:var(--mc-accent-fill);border-color:transparent;color:var(--mc-on-accent)}.mc-btn-primary:hover{filter:none;box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.mc-btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.mc-btn-secondary{background:var(--mc-surface);border:1px solid var(--mc-field-border);color:var(--mc-text)}.mc-btn-secondary:hover{background:var(--mc-surface-2)}.mc-btn-small{min-height:32px;padding:0 12px;font-size:.8125rem}.mc-btn-icon{display:inline-grid;place-items:center;width:32px;height:32px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:18px}.mc-btn-icon:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):active{opacity:1;transform:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):disabled{opacity:.45;cursor:not-allowed;box-shadow:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px} .mc-conditions-list{display:grid;gap:12px;margin:0}.mc-condition-item{position:relative;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px} .mc-tabs-header{display:flex;width:100%;align-items:stretch;gap:2px;padding:3px;margin:0;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.mc-tab-button{flex:1 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);box-shadow:none;transition:background-color .15s ease-out,color .15s ease-out;--mdc-icon-size:18px}.mc-tab-button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.mc-tab-button.active,.mc-tab-button[aria-selected='true']{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.mc-tab-button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}`,n.AH`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`];var Bp=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Zp=168,Kp=140,Wp=e=>14+e*Kp,Up=e=>14+(1.5-e)/2*Kp,Gp=(e,t=Wp,i=Up)=>`M${t(0)} ${i(0)} C${t(e[0])} ${i(e[1])} ${t(e[2])} ${i(e[3])} ${t(1)} ${i(1)}`,Yp={"ease-in-out":387};let Jp=class extends n.WF{constructor(){super(...arguments),this.inherited="ease",this.disabled=!1,this.label="",this._textError=""}willUpdate(e){e.has("value")&&(this._textError="")}get _bezier(){return this._drag?.bezier??Dr(this.value||this.inherited)}_emit(e,t=!1){this.dispatchEvent(new CustomEvent("easing-change",{bubbles:!0,composed:!0,detail:t?{value:e,transient:t}:{value:e}}))}_fromPointer(e){const t=this.renderRoot.querySelector(".plot").getBoundingClientRect(),i=t.width/Zp||1;return[((e.clientX-t.left)/i-14)/Kp,1.5-((e.clientY-t.top)/i-14)/Kp*2]}_down(e,t){if(this.disabled||0!==e.button)return;const i=this._bezier??[0,0,1,1];e.preventDefault(),e.currentTarget.focus(),e.currentTarget.setPointerCapture?.(e.pointerId),this._drag={handle:t,bezier:[...i]}}_move(e){if(!this._drag)return;const[t,i]=this._fromPointer(e),n=[...this._drag.bezier];n[2*this._drag.handle]=t,n[2*this._drag.handle+1]=i,this._drag={...this._drag,bezier:Fr(n)},this._emit(Ir(this._drag.bezier),!0)}_up(){if(!this._drag)return;const e=Ir(this._drag.bezier);this._drag=void 0,this._emit(e)}_key(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!i||this.disabled)return;e.preventDefault(),e.stopPropagation();const n=e.shiftKey?.1:.01,s=[...this._bezier??[0,0,1,1]];s[2*t]+=i[0]*n,s[2*t+1]+=i[1]*n,this._emit(Ir(Fr(s)))}_num(e,t){const i=Number(t),n=[...this._bezier??[0,0,1,1]];""!==t.trim()&&Number.isFinite(i)?(n[e]=i,this._emit(Ir(Fr(n)))):this.requestUpdate()}_text(e){const t=e.value.trim();if(!t)return void(this.value&&this._emit(void 0));if(t===(this.value??""))return;if(!ot(t))return void(this._textError=In(1046));this._textError="";const i=Dr(t);this._emit(i&&t.startsWith("cubic-bezier")?Ir(i):t)}render(){const e=this._bezier,t=this._drag?Ir(this._drag.bezier):this.value,i=Nr.map(e=>e.id),s=t?i.includes(t)?t:"custom":"",r=t?Dr(t)?`cubic-bezier(${Dr(t).join(",")})`:t:e?`cubic-bezier(${e.join(",")})`:"linear";return n.qy`
      <div class="presets" role="radiogroup" aria-label=${In(1200,{label:this.label||In(286)})}>
        ${[{id:"",label:In(214),bezier:Dr(this.inherited)},...Nr.map(e=>({...e,label:(0,T.t)(e.label)}))].map(e=>n.qy`<button
            type="button"
            class="preset"
            role="radio"
            data-easing=${e.id||"default"}
            aria-checked=${s===e.id?"true":"false"}
            title=${e.id?e.label:In(928,{easingLabel:ta(this.inherited).toLowerCase()})}
            ?disabled=${this.disabled}
            @click=${()=>this._emit(e.id||void 0)}
          >
            ${function(e){return n.qy`<svg class="glyph" viewBox="0 0 ${22} ${22}" aria-hidden="true">
    ${e?n.JW`<path d=${Gp(e,e=>3+16*e,e=>19-16*e*.82-2)}></path>`:n.JW`<path d="M3 ${17} H${19}" stroke-dasharray="2 2.5"></path>`}
  </svg>`}(e.bezier)}<span>${void 0!==Yp[e.id]?In(Yp[e.id]):e.label}</span>
          </button>`)}
      </div>
      <div class="wrap">
        <div class="body">
          <div
            class="plot"
            aria-disabled=${this.disabled?"true":"false"}
            @pointermove=${this._move}
            @pointerup=${this._up}
            @pointercancel=${this._up}
            @lostpointercapture=${this._up}
          >
            <svg viewBox="0 0 ${Zp} ${Zp}" aria-hidden="true">
              <g class="grid">
                <rect x=${Wp(0)} y=${Up(1)} width=${Kp} height=${Up(0)-Up(1)} rx="2"></rect>
                ${[.25,.5,.75].map(e=>n.JW`<line x1=${Wp(e)} x2=${Wp(e)} y1=${Up(1)} y2=${Up(0)}></line><line x1=${Wp(0)} x2=${Wp(1)} y1=${Up(e)} y2=${Up(e)}></line>`)}
              </g>
              <path class="diag" d="M${Wp(0)} ${Up(0)} L${Wp(1)} ${Up(1)}"></path>
              ${e?n.JW`<line class="arm" x1=${Wp(0)} y1=${Up(0)} x2=${Wp(e[0])} y2=${Up(e[1])}></line>
                  <line class="arm" x1=${Wp(1)} y1=${Up(1)} x2=${Wp(e[2])} y2=${Up(e[3])}></line>
                  <path class="curve" d=${Gp(e)}></path>`:n.s6}
              <circle class="end" cx=${Wp(0)} cy=${Up(0)} r="3.5"></circle>
              <circle class="end" cx=${Wp(1)} cy=${Up(1)} r="3.5"></circle>
            </svg>
            ${e?[0,1].map(t=>n.qy`<button
                    type="button"
                    class="knob ${this._drag?.handle===t?"dragging":""}"
                    data-handle=${t}
                    style="left: ${Wp(e[2*t])/Zp*100}%; top: ${Up(e[2*t+1])/Zp*100}%"
                    role="slider"
                    aria-label=${In(0===t?875:300)}
                    aria-valuemin="-1"
                    aria-valuemax="2"
                    aria-valuenow=${e[2*t+1]}
                    aria-valuetext=${`x ${e[2*t]}, y ${e[2*t+1]}`}
                    ?disabled=${this.disabled}
                    @pointerdown=${e=>this._down(e,t)}
                    @keydown=${e=>this._key(e,t)}
                  ></button>`):n.qy`<p class="steps-note">${t?.startsWith("steps")?In(899):""}</p>`}
          </div>
          <div class="nums">
            ${["x1","y1","x2","y2"].map((t,i)=>n.qy`<div class="num">
                <label for=${`bz-${t}`}>${t.toUpperCase()}</label>
                <input
                  class="input mono"
                  id=${`bz-${t}`}
                  type="number"
                  step="0.01"
                  min=${i%2?-1:0}
                  max=${i%2?2:1}
                  inputmode="decimal"
                  .value=${e?String(e[i]):""}
                  ?disabled=${this.disabled||!e}
                  @change=${e=>this._num(i,e.target.value)}
                />
              </div>`)}
            <div class="num text">
              <label for="bz-text">${In(288)}</label>
              <input
                class="input mono"
                id="bz-text"
                type="text"
                spellcheck="false"
                autocomplete="off"
                placeholder=${In(215,{inherited:this.inherited})}
                aria-invalid=${this._textError?"true":"false"}
                aria-describedby=${this._textError?"bz-err":n.s6}
                .value=${t??""}
                ?disabled=${this.disabled}
                @change=${e=>this._text(e.target)}
                @keydown=${e=>"Enter"===e.key&&this._text(e.target)}
              />
              ${this._textError?n.qy`<p class="help error" id="bz-err">${this._textError}</p>`:n.s6}
            </div>
            <div class="preview" aria-hidden="true" style="--ease: ${r}"><i></i></div>
          </div>
        </div>
      </div>
    `}};Jp.styles=[Ip,n.AH`
      :host {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .presets {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 6px;
      }
      .preset {
        display: flex;
        align-items: center;
        gap: 5px;
        min-height: 32px;
        padding: 0 6px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.75rem;
        font-weight: 500;
        text-align: left;
        min-width: 0;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .preset span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preset:hover {
        border-color: var(--mc-field-border);
        color: var(--mc-text);
      }
      .preset[aria-checked='true'] {
        border-color: color-mix(in srgb, var(--mc-accent) 55%, transparent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .glyph {
        width: 18px;
        height: 18px;
        flex: none;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.6;
        stroke-linecap: round;
      }
      .body {
        display: grid;
        grid-template-columns: ${Zp}px minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }
      @container (max-width: 340px) {
        .body {
          grid-template-columns: minmax(0, 1fr);
        }
        .plot {
          width: 100%;
          max-width: 260px;
          justify-self: center;
        }
        .nums {
          width: 100%;
        }
      }
      .wrap {
        container-type: inline-size;
      }
      .plot {
        position: relative;
        width: ${Zp}px;
        aspect-ratio: 1;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
        touch-action: none;
        user-select: none;
      }
      .plot svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .grid line {
        stroke: var(--mc-divider);
        stroke-width: 1;
      }
      .grid rect {
        fill: var(--mc-surface);
        stroke: var(--mc-divider);
      }
      .diag {
        stroke: var(--mc-field-border);
        stroke-dasharray: 3 3;
        fill: none;
      }
      .arm {
        stroke: var(--mc-text-2);
        stroke-width: 1.25;
      }
      .curve {
        fill: none;
        stroke: var(--mc-text);
        stroke-width: 2.5;
        stroke-linecap: round;
      }
      .end {
        fill: var(--mc-text-2);
      }
      .knob {
        position: absolute;
        width: 32px;
        height: 32px;
        margin: -16px 0 0 -16px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        cursor: grab;
        touch-action: none;
      }
      .knob::before {
        content: '';
        position: absolute;
        inset: 9px;
        border-radius: 50%;
        background: var(--mc-surface);
        border: 2.5px solid var(--mc-text);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        transition: transform 0.15s ease-out, border-color 0.15s ease-out, background-color 0.15s ease-out;
      }
      .knob:hover::before,
      .knob.dragging::before {
        transform: scale(1.15);
      }
      .knob:focus-visible {
        outline: none;
      }
      .knob:focus-visible::before,
      .knob.dragging::before {
        border-color: var(--mc-accent);
        background: var(--mc-accent-fill);
      }
      .knob.dragging {
        cursor: grabbing;
      }
      .plot[aria-disabled='true'] {
        opacity: 0.55;
      }
      .steps-note {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 16px;
        text-align: center;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .nums {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
      }
      .num {
        display: grid;
        gap: 4px;
        min-width: 0;
      }
      .num label {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .num .input {
        min-height: 32px;
        padding: 4px 8px;
      }
      .text {
        grid-column: 1 / -1;
      }
      .preview {
        grid-column: 1 / -1;
        position: relative;
        height: 24px;
        border-radius: 9999px;
        background: var(--mc-surface-2);
        overflow: hidden;
      }
      .preview i {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mc-text-2);
        animation: mc-ease-run 1.6s var(--ease, ease) infinite alternate;
      }
      @keyframes mc-ease-run {
        to {
          left: calc(100% - 20px);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .preview i {
          animation: none;
        }
      }
    `],Bp([(0,s.MZ)({type:String})],Jp.prototype,"value",void 0),Bp([(0,s.MZ)({type:String})],Jp.prototype,"inherited",void 0),Bp([(0,s.MZ)({type:Boolean})],Jp.prototype,"disabled",void 0),Bp([(0,s.MZ)({type:String})],Jp.prototype,"label",void 0),Bp([(0,s.wk)()],Jp.prototype,"_drag",void 0),Bp([(0,s.wk)()],Jp.prototype,"_textError",void 0),Jp=Bp([(0,s.EM)("mc-anim-bezier-editor")],Jp);var Xp=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Qp=(e,t,i,n)=>e<t||e>i?In(518,{min:t,max:i,unit:n}):void 0,eh=(e,t)=>({...e,transform:{...e.transform??{},...t}}),th=e=>void 0===e?void 0:Math.round(1e5*e)/1e3,ih=e=>{return t=e,Math.round(10*t)/10+"%";var t},nh={x:[{key:"x",label:1078,unit:"px",get:e=>e.transform?.x,set:(e,t)=>Qp(t,-1e4,1e4,"px")??eh(e,{x:t})}],y:[{key:"y",label:1079,unit:"px",get:e=>e.transform?.y,set:(e,t)=>Qp(t,-1e4,1e4,"px")??eh(e,{y:t})}],scale:[{key:"scale",label:767,unit:"%",get:e=>th(e.transform?.scale),set:(e,t)=>Qp(t,0,1e4,"%")??eh(e,{scale:t/100})}],scale_x:[{key:"scale_x",label:768,unit:"%",get:e=>th(e.transform?.scale_x),set:(e,t)=>Qp(t,-1e4,1e4,"%")??eh(e,{scale_x:t/100})}],scale_y:[{key:"scale_y",label:769,unit:"%",get:e=>th(e.transform?.scale_y),set:(e,t)=>Qp(t,-1e4,1e4,"%")??eh(e,{scale_y:t/100})}],rotate:[{key:"rotate",label:60,unit:"deg",get:e=>e.transform?.rotate,set:(e,t)=>Qp(t,-36e3,36e3,"deg")??eh(e,{rotate:t})}],skew:[{key:"skew_x",label:828,unit:"deg",get:e=>e.transform?.skew_x??0,set:(e,t)=>Qp(t,-89,89,"deg")??eh(e,{skew_x:t})},{key:"skew_y",label:829,unit:"deg",get:e=>e.transform?.skew_y??0,set:(e,t)=>Qp(t,-89,89,"deg")??eh(e,{skew_y:t})}],opacity:[{key:"opacity",label:605,unit:"%",get:e=>th(e.opacity),set:(e,t)=>Qp(t,0,100,"%")??{...e,opacity:Math.round(10*t)/1e3}}],blur:[{key:"blur",label:96,unit:"px",get:e=>e.blur,set:(e,t)=>Qp(t,0,200,"px")??{...e,blur:t}}],radius:[{key:"radius",label:697,unit:"px",get:e=>e.radius,set:(e,t)=>Qp(t,0,1e3,"px")??{...e,radius:t}}],draw:[{key:"draw",label:269,unit:"%",get:e=>th(e.draw),set:(e,t)=>Qp(t,0,100,"%")??{...e,draw:Math.round(10*t)/1e3}}]},sh=[{id:"z",label:333},{id:"y",label:335,axis:[0,1,0]},{id:"x",label:334,axis:[1,0,0]}];let rh=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.entityColor="var(--primary-color, #03a9f4)",this._errors={}}willUpdate(e){e.has("doc")&&(this._draft=void 0),e.has("selection")&&(this._errors={})}get _view(){return this._draft??this.doc}get _keys(){const e=this._view;return e&&"keys"===this.selection?.kind?(this.selection.keys??[]).map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(t=>jr(e,t)):[]}_emit(e,t,i=!1){this.disabled||(this._draft=i?e:void 0,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}})))}_select(e){const t=this._view?_r(this._view):"element",i=e.length?{kind:"keys",target:e[e.length-1].target,targets:[...new Set(e.map(e=>e.target))],keys:e.map(e=>({target:e.target,lane:e.lane,at:e.at,id:Mr(e,t)}))}:{kind:"none"};this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:i}}))}_editTrack(e,t){const i=this.doc;return kr(i,e,t(wr(i,e)))}_setFragment(e,t,i,n,s){this.doc&&this._emit(this._editTrack(e,e=>function(e,t,i,n){let s=!1;const r=e.map(e=>{if(e.at!==i||!Ls(e,t))return e;s=!0;const r=Ps(Rs(e,t),n);return e.easings?{...r,easings:e.easings}:r});return s?r:Us(Ys(e,i,n))}(e,t,i,n)),s)}_ownEasing(e){const t=wr(this._view,e.target);return"*"===e.lane?Zs(t,e.at):Ks(t,e.lane,e.at)}_setEasing(e,t,i){if(!this.doc)return;let n=this.doc;for(const i of e){const e=wr(n,i.target);n=kr(n,i.target,"*"===i.lane?or(e,i.at,t):Ws(e,i.lane,i.at,t))}this._emit(n,"Change easing",i)}_delete(e){this.doc&&e.length&&(this._emit(zr(this.doc,e),"Delete "+(1===e.length?"keyframe":"keyframes")),this._select([]))}_copy(e){const t=this.doc?qr(this.doc,e):void 0;t&&mr(t)}_moveTo(e,t){if(!this.doc)return;const i=Ar(this.doc,[e],t-e.at);this._emit(i.doc,"Move keyframe"),this._select(i.selection)}render(){const e=this._keys;return this._view&&e.length?(this._last=n.qy`<section class="insp" aria-label=${In(395)}>${e.length>1?this._renderMany(e):this._renderOne(e[0])}</section>`,this._last):"keys"===this.selection?.kind&&this.selection.keys?.length&&this._last?this._last:n.qy``}_easingEditor(e,t,i,s){return n.qy`<mc-anim-bezier-editor
      .value=${s}
      .inherited=${t}
      ?disabled=${this.disabled||i}
      @easing-change=${t=>this._setEasing(e,t.detail.value,!!t.detail.transient)}
    ></mc-anim-bezier-editor>`}_renderMany(e){const t=this._view,i=[...new Set(e.map(e=>e.at))].sort((e,t)=>e-t),s=[...new Set(e.map(e=>e.target))],r=new Set(e.map(e=>this._ownEasing(e)??"")),a=1===r.size&&[...r][0]||void 0,o=new Set(e.map(e=>e.lane)),l=s.length>1?In(1169,{count:s.length}):yr(t,s[0]);return n.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon="mdi:selection-multiple"></ha-icon></span>
        <div class="insp-title">
          <b>${In(1155,{count:e.length})}</b>
          <span>${In(1260,{where:l,from:ih(i[0]),to:ih(i[i.length-1])})}</span>
        </div>
      </div>
      <p class="note">${In(249)}</p>
      <div class="foot-actions">
        <button type="button" class="btn btn-text btn-sm" data-act="copy" @click=${()=>this._copy(e)}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${In(184)}
        </button>
        <button type="button" class="btn btn-text btn-sm danger-text" data-act="delete" @click=${()=>this._delete(e)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${In(1172,{count:e.length})}
        </button>
      </div>
      <div class="sub">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${In(287)}</span></div>
        ${r.size>1?n.qy`<p class="note">${In(974)}</p>`:n.s6}
        ${o.size>1||!o.has("*")?n.qy`<p class="note">${In(696)}</p>`:n.s6}
        ${this._easingEditor(e,t.easing,!1,a)}
      </div>
    `}_renderOne(e){const t=this._view,i=wr(t,e.target),s="*"===e.lane?Ds(i.filter(t=>t.at===e.at)):[e.lane],r="*"===e.lane?void 0:js[e.lane],a="*"===e.lane?[]:Ds(i.filter(t=>t.at===e.at)).filter(t=>t!==e.lane),o=Fs(i,e.lane).every(t=>t<=e.at),l=(t.duration*e.at/100).toFixed(2),c=(t.tracks?.length??0)>0||e.target!==_r(t)?yr(t,e.target):"";return n.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon=${r?.icon??xr(e.target)}></ha-icon></span>
        <div class="insp-title">
          <b>${In(r?r.label:394)}</b>
          <span>${c?In(1257,{target:c,at:ih(e.at),secs:l}):In(76,{at:ih(e.at),secs:l})}</span>
        </div>
        <button
          type="button"
          class="icon-btn sm danger"
          data-act="delete"
          aria-label=${In(226)}
          title=${In(226)}
          @click=${()=>this._delete([e])}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-at">${In(682)}</label></div>
        <div class="at-field">
          <mc-unit-field
            inputId="kf-at"
            .label=${In(682)}
            .value=${`${e.at}%`}
            .units=${["%"]}
            noCustom
            ?disabled=${this.disabled}
            @value-changed=${t=>this._onAt(t,e)}
          ></mc-unit-field>
          <span class="secs">${l} s</span>
        </div>
        ${this._errors.at?n.qy`<p class="help error">${this._errors.at}</p>`:n.s6}
      </div>
      ${s.length?s.map(t=>this._renderLaneFields(e.target,t,e.at,"*"===e.lane)):n.qy`<p class="note">${In(994)}</p>`}
      ${a.length?n.qy`<div class="field">
              <div class="field-head"><span class="lbl">${In(51,{at:ih(e.at)})}</span></div>
              <div class="chips">
                ${a.map(t=>n.qy`<button type="button" class="chip" data-lane=${t} @click=${()=>this._select([{target:e.target,lane:t,at:e.at}])}>
                      <ha-icon icon=${js[t].icon}></ha-icon>${As(t)}
                    </button>`)}
                <button type="button" class="chip" data-lane="*" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                  <ha-icon icon="mdi:key-variant"></ha-icon>${In(1075)}
                </button>
              </div>
            </div>`:n.s6}
      ${this._renderEasing(e,i,o)}
    `}_renderEasing(e,t,i){const s=this._view,r=Zs(t,e.at);if("*"===e.lane)return n.qy`<div class="sub" data-easing="keyframe">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${In(287)}</span></div>
        ${i?n.qy`<p class="note">${In(993)}</p>`:n.s6}
        ${this._easingEditor([e],s.easing,i,r)}
      </div>`;const a=e.lane,o=Es(a).filter(e=>e!==a),l=o.length?Wn(o.map(e=>As(e))):"";return n.qy`<div class="sub" data-easing="lane">
      <div class="sub-head">
        <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${In(1197,{label:As(a)})}</span>
      </div>
      ${i?n.qy`<p class="note">${In(992)}</p>`:n.qy`<p class="note">
              ${In(r?604:603)}${l?` ${In(1212,{names:l})}`:""}
            </p>`}
      ${this._easingEditor([e],r??s.easing,i,Ks(t,a,e.at))}
      ${Ls(t.find(t=>t.at===e.at)??{at:0},a)?n.qy`<div class="ease-of">
              <button type="button" class="btn btn-text btn-sm" data-act="whole" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                <ha-icon icon="mdi:key-variant"></ha-icon>${In(289)}
              </button>
            </div>`:n.s6}
    </div>`}_onAt(e,t){e.stopPropagation();const i=parseFloat(String(e.detail.value));if(!Number.isFinite(i)||i<0||i>100)return this._errors={...this._errors,at:In(517)},void e.target.revert?.();this._errors={...this._errors,at:""},i!==t.at&&this._moveTo(t,Math.round(100*i)/100)}_renderLaneFields(e,t,i,s){const r=js[t],a=Bs(wr(this._view,e),t,i),o=this._laneBody(e,t,i,a,s);return s?n.qy`<div class="sub" data-lane=${t}>
      <div class="sub-head">
        <ha-icon icon=${r.icon}></ha-icon><span class="grow">${In(r.label)}</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${In(720,{name:In(r.label).toLowerCase()})}
          title=${In(713)}
          @click=${()=>this._emit(this._editTrack(e,e=>nr(e,[{lane:t,at:i}])),`Remove ${t}`)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${o}
    </div>`:n.qy`<div class="fields" data-lane=${t}>${o}</div>`}_laneBody(e,t,i,s,r=!1){const a=nh[t];return a?n.qy`
        <div class="pair">${a.map(n=>this._numField(e,t,i,s,n,r&&1===a.length))}</div>
        ${"rotate"===t?this._axisField(e,i,s):n.s6}
      `:"color"===t||"background"===t||"stroke"===t?this._colorField(e,t,i,s):"shadow"===t?this._shadowField(e,i,s):this._filterField(e,i,s)}_numField(e,t,i,s,r,a=!1){const o=r.get(s),l=`kf-${t}-${r.key}`,c=this._errors[l];return n.qy`<div class="field">
      ${a?n.s6:n.qy`<div class="field-head"><label for=${l}>${In(r.label)}</label></div>`}
      <mc-unit-field
        .inputId=${l}
        .label=${In(r.label)}
        .value=${void 0===o?"":`${o}${r.unit}`}
        .units=${[r.unit]}
        noCustom
        ?disabled=${this.disabled}
        @value-changed=${n=>{n.stopPropagation();const s=n.target,a=parseFloat(String(n.detail.value));if(!Number.isFinite(a))return void s.revert?.();const o=r.set(Bs(wr(this._view,e),t,i),a);if("string"==typeof o)return this._errors={...this._errors,[l]:o},void s.revert?.();this._errors={...this._errors,[l]:""},this._setFragment(e,t,i,o,`Change ${t}`)}}
      ></mc-unit-field>
      ${c?n.qy`<p class="help error">${c}</p>`:n.s6}
    </div>`}_axisField(e,t,i){const s=i.transform?.axis,r=s?sh.find(e=>e.axis&&e.axis.every((e,t)=>e===s[t]))?.id??"custom":"z";return n.qy`<div class="field">
      <div class="field-head"><label for="kf-axis">${In(1018)}</label></div>
      <div class="select">
        <select
          class="input"
          id="kf-axis"
          ?disabled=${this.disabled}
          @change=${i=>{const n=sh.find(e=>e.id===i.target.value);if(!n)return;const s={...Bs(wr(this._view,e),"rotate",t).transform??{}};n.axis?s.axis=[...n.axis]:delete s.axis,this._setFragment(e,"rotate",t,{transform:s},"Change turn axis")}}
        >
          ${sh.map(e=>n.qy`<option value=${e.id} ?selected=${r===e.id}>${In(e.label)}</option>`)}
          ${"custom"===r?n.qy`<option value="custom" selected>${In(205,{axis:s.join(", ")})}</option>`:n.s6}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_colorField(e,t,i,s){const r=`kf-${t}`,a=s[t],o=In("color"===t?915:"stroke"===t?905:80),l="background"===t?"background":"color";return n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${o}</span></div>
      <mc-color-picker
        .value=${Zr(a)}
        .label=${o}
        allowEntity
        .entityColor=${this.entityColor}
        @value-changed=${n=>{n.stopPropagation();let s=Kr(String(n.detail.value??""));if(!s){if(!Zr(a).startsWith("entity"))return;s="var(--primary-color)"}Yr(s,l)?(this._errors={...this._errors,[r]:""},s!==a&&this._setFragment(e,t,i,{[t]:s},`Change ${o.toLowerCase()}`)):this._errors={...this._errors,[r]:In("color"===l?571:1045)}}}
      ></mc-color-picker>
      ${this._errors[r]?n.qy`<p class="help error">${this._errors[r]}</p>`:n.qy`<p class="help">${In(938)}</p>`}
    </div>`}_shadowField(e,t,i){const s=i.shadow??"",r=function(e){if(!e)return;const t=e.trim().match(/^(-?\d*\.?\d+)(?:px)?\s+(-?\d*\.?\d+)(?:px)?(?:\s+(\d*\.?\d+)(?:px)?)?(?:\s+(-?\d*\.?\d+)(?:px)?)?\s+(.+)$/);return t&&!/,(?![^(]*\))/.test(t[5])?{x:Number(t[1]),y:Number(t[2]),blur:Number(t[3]??0),spread:Number(t[4]??0),color:t[5].trim()}:void 0}(s),a=this._errors["kf-shadow"],o=i=>{Yr(i,"shadow")?(this._errors={...this._errors,"kf-shadow":""},i!==s&&this._setFragment(e,"shadow",t,{shadow:i},"Change shadow")):this._errors={...this._errors,"kf-shadow":In(573)}},l=(e,t)=>n.qy`<div class="field">
        <div class="field-head"><label for=${`kf-sh-${e}`}>${t}</label></div>
        <mc-unit-field
          .inputId=${`kf-sh-${e}`}
          .label=${In(805,{name:t.toLowerCase()})}
          .value=${`${r[e]}px`}
          .units=${["px"]}
          noCustom
          compact
          @value-changed=${t=>{t.stopPropagation();const i=parseFloat(String(t.detail.value));if(!Number.isFinite(i)||"blur"===e&&i<0)return t.target.revert?.();o(Wr({...r,[e]:i}))}}
        ></mc-unit-field>
      </div>`;return n.qy`
      <div class="chips" role="group" aria-label=${In(804)}>
        ${Ur.map(e=>n.qy`<button type="button" class="chip" aria-pressed=${s===e.value?"true":"false"} @click=${()=>o(e.value)}>${In(e.label)}</button>`)}
      </div>
      ${r?n.qy`<div class="quad">${l("x","X")} ${l("y","Y")} ${l("blur",In(96))} ${l("spread",In(861))}</div>
              <div class="field">
                <div class="field-head"><span class="lbl">${In(803)}</span></div>
                <mc-color-picker
                  .value=${Zr(r.color)}
                  .label=${In(803)}
                  allowEntity
                  .entityColor=${this.entityColor}
                  @value-changed=${e=>{e.stopPropagation();const t=Kr(String(e.detail.value??""))||"rgba(0, 0, 0, 0.3)";o(Wr({...r,color:t}))}}
                ></mc-color-picker>
              </div>`:n.qy`<div class="field">
              <div class="field-head"><label for="kf-shadow">${In(801)}</label></div>
              <input
                class="input mono"
                id="kf-shadow"
                type="text"
                spellcheck="false"
                .value=${s}
                @change=${e=>o(e.target.value.trim())}
              />
            </div>`}
      ${a?n.qy`<p class="help error">${a}</p>`:n.s6}
    `}_filterField(e,t,i){const s=i.filter??"",r=this._errors["kf-filter"],a=i=>{Yr(i,"filter")?(this._errors={...this._errors,"kf-filter":""},i!==s&&this._setFragment(e,"filter",t,{filter:i},"Change filter")):this._errors={...this._errors,"kf-filter":In(1051)}};return n.qy`
      <div class="chips" role="group" aria-label=${In(325)}>
        ${Gr.map(e=>n.qy`<button type="button" class="chip" aria-pressed=${s===e.value?"true":"false"} @click=${()=>a(e.value)}>${In(e.label)}</button>`)}
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-filter">${In(324)}</label></div>
        <input
          class="input mono"
          id="kf-filter"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-invalid=${r?"true":"false"}
          .value=${s}
          @change=${e=>a(e.target.value.trim())}
        />
        ${r?n.qy`<p class="help error">${r}</p>`:n.qy`<p class="help">${In(97)}</p>`}
      </div>
    `}};rh.styles=[Ip,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      :host([disabled]) .insp {
        opacity: 0.6;
        pointer-events: none;
      }
      .insp {
        display: grid;
        gap: 16px;
        align-content: start;
        min-width: 0;
        padding: 16px 0;
      }
      .insp-head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .tile {
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        flex: none;
        border-radius: var(--mc-radius);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 20px;
      }
      .insp-title {
        flex: 1;
        min-width: 0;
      }
      .insp-title b {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .insp-title span {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fields {
        display: grid;
        gap: 12px;
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
        gap: 12px;
      }
      .quad {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .sub {
        display: grid;
        gap: 10px;
        padding-top: 12px;
        border-top: 1px solid var(--mc-divider);
      }
      .sub-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 28px;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .sub-head ha-icon {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
      }
      .sub-head .grow {
        flex: 1;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chip[aria-pressed='true'] {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
      .at-field {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
      }
      .at-field .secs {
        font-family: var(--mc-mono);
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .ease-of {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 8px;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .danger-text:hover {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      .foot-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: space-between;
      }
    `],Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"doc",void 0),Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"hass",void 0),Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"library",void 0),Xp([(0,s.MZ)({type:Number})],rh.prototype,"time",void 0),Xp([(0,s.MZ)({type:Boolean,reflect:!0})],rh.prototype,"disabled",void 0),Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"selection",void 0),Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"tile",void 0),Xp([(0,s.MZ)({attribute:!1})],rh.prototype,"stage",void 0),Xp([(0,s.MZ)({type:String})],rh.prototype,"entityColor",void 0),Xp([(0,s.wk)()],rh.prototype,"_errors",void 0),Xp([(0,s.wk)()],rh.prototype,"_draft",void 0),rh=Xp([(0,s.EM)("mc-anim-key-inspector")],rh),_s({tag:"mc-anim-key-inspector",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"keys"===t.kind&&!!t.keys?.length,title:394,order:0});var ah=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const oh=e=>Math.round(10*e)/10,lh=e=>`${oh(e)}%`;let ch=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.onionSkin=!1,this.layout="auto",this.entityColor="var(--primary-color, #03a9f4)",this._keys=[],this._width=0,this._viewW=0,this._menuOpen=!1,this._status="",this._zoom=1,this._unit="pct",this._snap=!0,this._grid="pct1",this._collapsed=new Set,this._laneFocus=new Map,this._selFrame=0,this._menuClosedAt=0,this._onTouchMove=e=>{"band"===this._drag?.kind&&"touch"===this._drag.pointerType&&e.preventDefault()},this._pxCache=0,this._onPointerMove=e=>{const t=this._hold;t&&e.pointerId===t.pointerId&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._cancelHold();const i=this._drag;if(!i||e.pointerId!==i.pointerId)return;if("seek"===i.kind)return void this._seek(this._atFromX(e.clientX));if("band"===i.kind){const t=this.renderRoot.querySelector(".lanes").getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top;if(!i.moved&&Math.hypot(n-i.x0,s-i.y0)<3)return;i.moved=!0,this._band={x0:i.x0,y0:i.y0,x1:n,y1:s};const r=this._main,a=i.baseSel??[];return void this._select([...a,...this._keysInBand(i.centres).filter(e=>!a.some(t=>Mr(t,r)===Mr(e,r)))],!0)}const n=e.clientX-i.x0;if(!i.moved&&Math.abs(n)<3)return;i.moved=!0;const s=this._pxCache||this._pxPerPct(),r=this._snapAt(i.grab.at+n/s,e.shiftKey,i.duplicate?[]:i.sel,i.snaps,s);if(i.lastTarget===r)return;i.lastTarget=r;const a=Ar(i.base,i.sel,r-i.grab.at,i.duplicate),o=i.sel.length;i.label=i.duplicate?In(279,{count:o}):In(483,{count:o}),this._draft=a.doc,this._select(a.selection,!0);const l=a.selection[i.sel.findIndex(e=>Mr(e,this._main)===Mr(i.grab,this._main))];l&&this._laneFocus.set(`${l.target}|${l.lane}`,l.at),(a.doc!==i.base||i.emitted)&&(i.emitted=!0,this._emit(this._draft,i.label,!0),this._selFrame||(this._selFrame=requestAnimationFrame(()=>{this._selFrame=0,"keys"===this._drag?.kind&&this._emitSelection()})))},this._onPointerUp=e=>{const t=this._hold;if(t&&e.pointerId===t.pointerId)return this._cancelHold(),void("pointerup"!==e.type||t.additive||(this._lastTarget=t.target,this._select([])));const i=this._drag;if(i&&e.pointerId===i.pointerId){if(this._drag=void 0,this._pxCache=0,cancelAnimationFrame(this._selFrame),this._selFrame=0,"band"===i.kind)return this._band=void 0,void(i.moved||i.additive?this._emitSelection():(i.target&&(this._lastTarget=i.target),this._select([])));if("keys"===i.kind){if(i.moved&&this._draft&&i.emitted){const e=this._draft,t=this._keys.find(e=>e.target===i.grab.target&&e.lane===i.grab.lane);return t&&(this._pendingFocus=Mr(t,this._main)),this._emit(e,i.label??In(467)),this._emitSelection(),this._draft=e,void(this.doc===e&&(this._draft=void 0))}this._draft=void 0,!i.additive&&i.wasSelected&&this._select([i.clickKey])}}},this._onWheel=e=>{!e.ctrlKey&&!e.metaKey||this._narrow||(e.preventDefault(),this._setZoom(this._zoom*Math.exp(.002*-e.deltaY),e.clientX))}}get onion(){const e=Fs(this._kfsOf(this._active),"*"),t=100*this.time;return{prev:[...e].reverse().find(e=>e<t-.001),next:e.find(e=>e>t+.001)}}get selection(){return this._keys.map(e=>Mr(e,this._main))}set selection(e){this._select(e.map(e=>Sr(e,this._main)))}get zoom(){return this._zoom}set zoom(e){this._zoom=Lr(e)}connectedCallback(){var e;super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0);t&&t!==this._width&&(this._width=t)}),this._ro.observe(this)),this._unsubClip=(e=()=>this.requestUpdate(),hr.add(e),()=>hr.delete(e)),this.addEventListener("touchmove",this._onTouchMove,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._bodyRo?.disconnect(),this._bodyRo=void 0,this._unsubClip?.(),this.removeEventListener("touchmove",this._onTouchMove),this._cancelHold(),cancelAnimationFrame(this._selFrame)}get _view(){return this._draft??this.doc}get _main(){return this._view?_r(this._view):"element"}_kfsOf(e){return this._view?wr(this._view,e):[]}get _narrow(){return"narrow"===this.layout||"auto"===this.layout&&this._width>0&&this._width<480}get _active(){const e=this.studioSelection;return(!e||"target"!==e.kind&&"keys"!==e.kind?void 0:e.target)??this._keys[this._keys.length-1]?.target??this._lastTarget??this._main}_groups(){const e=this._view;if(!e)return[];const t=$r(e),i=this.studioSelection,n=new Set([...i?.targets??[],...i?.target?[i.target]:[],...this._keys.map(e=>e.target)]),s=t.filter(e=>e.main||e.keyframes.length||n.has(e.target));for(const e of n)s.some(t=>t.target===e)||s.push({target:e,keyframes:[],main:!1});return s}_rows(){const e=[];for(const t of this._groups())if(e.push({target:t.target,lane:"*"}),!this._narrow&&!this._collapsed.has(t.target))for(const i of Ds(t.keyframes))e.push({target:t.target,lane:i});return e}willUpdate(e){if(e.has("doc")){this._drag||(this._draft=void 0);const e=this._view,t=e?this._keys.filter(t=>jr(e,t)):[];t.length!==this._keys.length&&this._select(t)}e.has("studioSelection")&&this._adopt()}_adopt(){const e=this.studioSelection,t=this._view;if(e&&t)if("keys"===e.kind&&e.keys){const i=e.keys.map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(e=>jr(t,e)),n=this._main;i.map(e=>Mr(e,n)).join()!==this.selection.join()&&(this._keys=i)}else this._keys.length&&(this._keys=[])}updated(){const e=this._menuOpen?this.renderRoot.querySelector("mc-ui-menu.add-menu"):null;if(e&&!e.open&&(e.anchor=this.renderRoot.querySelector(".add-btn")??void 0,e.show()),this._pendingFocus){const e=this.renderRoot.querySelector(`.key[data-key="${CSS.escape(this._pendingFocus)}"]`);this._pendingFocus=void 0,e?.focus()}const t=this.renderRoot.querySelector(".tl-body");if(t&&!this._bodyRo&&"undefined"!=typeof ResizeObserver&&(this._bodyRo=new ResizeObserver(()=>{const e=this.renderRoot.querySelector(".tl-body")?.clientWidth??0;e&&e!==this._viewW&&(this._viewW=e)}),this._bodyRo.observe(t)),this._zoomAnchor&&t){const{at:e,clientX:i}=this._zoomAnchor;this._zoomAnchor=void 0;const n=this._trackRect();n&&(t.scrollLeft+=n.left+12+e/100*(n.width-24)-i)}}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e,t=!1){const i=this._main,n=new Set,s=e.filter(e=>{const t=Mr(e,i);return!n.has(t)&&(n.add(t),!0)}),r=s.map(e=>Mr(e,i)).join()!==this.selection.join();this._keys=s,s.length&&(this._lastTarget=s[s.length-1].target),r&&!t&&this._emitSelection()}_emitSelection(){const e=this._main,t=this._keys,i=[...new Set(t.map(e=>e.target))],n=t.length?{kind:"keys",target:t[t.length-1].target,targets:i,keys:t.map(t=>({target:t.target,lane:t.lane,at:t.at,id:Mr(t,e)}))}:{kind:"none"};!t.length&&this.studioSelection&&"keys"!==this.studioSelection.kind||this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:n}}))}_isLocked(e){const t=this.layerView,i=this.doc;return!(!i||!t?.locked.length)&&("*"!==e.lane?no(i,t,`lane:${e.target}|${e.lane}`):no(i,t,/^(part|group|shape):/.test(e.target)?e.target:`target:${e.target}`)||Ya(i,e.target).some(n=>no(i,t,`lane:${e.target}|${n}`)))}_refuseLocked(e){const t=e.find(e=>this._isLocked(e));if(!t||!this._view)return!1;const i=yr(this._view,t.target);return this._announce(In(1219,{name:"*"===t.lane?i:`${i} ${js[t.lane]?As(t.lane).toLowerCase():t.lane}`})),!0}_commit(e,t,i){this.doc&&!this.disabled&&(this._emit(e,t),i&&this._select(i))}_seek(e){const t=Math.min(1,Math.max(0,e/100));this.dispatchEvent(new CustomEvent("seek",{bubbles:!0,composed:!0,detail:{time:t}}))}_announce(e){this._status="",this.updateComplete.then(()=>this._status=e)}_isSel(e){return this._keys.some(t=>t.target===e.target&&t.lane===e.lane&&t.at===e.at)}_trackRect(){return this.renderRoot.querySelector(".track, .ruler-track")?.getBoundingClientRect()}_atFromX(e){const t=this._trackRect();return!t||t.width<=24?0:(e-t.left-12)/(t.width-24)*100}_pxPerPct(){const e=this._trackRect();return e&&e.width>24?(e.width-24)/100:6}_snapTargets(e=[]){const t=this._main,i=new Set(e.map(e=>Mr(e,t))),n=new Set([100*this.time]);for(const e of this._groups())for(const s of["*",...Ds(e.keyframes)])for(const r of Fs(e.keyframes,s))i.has(Mr({target:e.target,lane:s,at:r},t))||n.add(r);return[...n]}_snapAt(e,t,i=[],n=this._snapTargets(i),s=this._pxPerPct()){return function(e,t){const i=e=>Math.min(100,Math.max(0,e));if(t.free)return i(Math.round(10*e)/10);let n;for(const i of t.targets??[])Math.abs(i-e)<=(t.threshold??0)&&(void 0===n||Math.abs(i-e)<Math.abs(n-e))&&(n=i);if(void 0!==n)return i(n);const s=function(e,t){const i=t>0?t:1;switch(e){case"pct5":return 5;case"s01":return.1/i*100;case"fps30":return 1/30/i*100;default:return 1}}(t.grid,t.duration);return i(Math.round(Math.round(e/s)*s*100)/100)}(e,{free:t||!this._snap,grid:this._grid,duration:this._view?.duration??1,targets:n,threshold:6/s})}_range(e,t){const i=this._rows(),n=i.findIndex(t=>t.target===e.target&&t.lane===e.lane),s=i.findIndex(e=>e.target===t.target&&e.lane===t.lane);if(n<0||s<0)return[t];const[r,a]=[Math.min(e.at,t.at),Math.max(e.at,t.at)],o=[];for(const e of i.slice(Math.min(n,s),Math.max(n,s)+1))for(const t of Fs(this._kfsOf(e.target),e.lane))t>=r&&t<=a&&o.push({target:e.target,lane:e.lane,at:t});return o}_onKeyDown(e,t){if(this.disabled||0!==e.button||!this.doc)return;e.preventDefault(),e.stopPropagation(),e.currentTarget.focus();const i=this._isSel(t),n=e.ctrlKey||e.metaKey;if(e.shiftKey&&this._anchor)this._select(n?[...this._keys,...this._range(this._anchor,t)]:this._range(this._anchor,t));else if(n){if(this._select(i?this._keys.filter(e=>Mr(e,this._main)!==Mr(t,this._main)):[...this._keys,t]),i)return}else i||this._select([t]),this._anchor=t;this._laneFocus.set(`${t.target}|${t.lane}`,t.at),this._refuseLocked(this._keys)||(this._drag={kind:"keys",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1,base:this.doc,grab:t,sel:[...this._keys],duplicate:e.altKey,clickKey:t,wasSelected:i,additive:e.shiftKey||n,snaps:this._snapTargets(e.altKey?[]:this._keys)},this._pxCache=this._pxPerPct(),this._capture(e))}_cancelHold(){this._hold&&clearTimeout(this._hold.timer),this._hold=void 0}_onTrackDown(e,t){if(this.disabled||0!==e.button)return;const i=e.shiftKey||e.ctrlKey||e.metaKey;if("touch"===e.pointerType){this._cancelHold();const{pointerId:n,clientX:s,clientY:r}=e;return void(this._hold={pointerId:n,x:s,y:r,target:t,additive:i,timer:setTimeout(()=>{this._hold=void 0,this._startBand(n,s,r,t,i,"touch")},400)})}this._startBand(e.pointerId,e.clientX,e.clientY,t,i,e.pointerType)}_startBand(e,t,i,n,s,r){const a=this.renderRoot.querySelector(".lanes");if(!a)return;const o=a.getBoundingClientRect(),l=this._main,c=[...this.renderRoot.querySelectorAll(".lanes .key")].map(e=>{const t=e.getBoundingClientRect();return{key:Sr(e.dataset.key,l),x:t.left+t.width/2-o.left,y:t.top+t.height/2-o.top}});this._drag={kind:"band",pointerId:e,x0:t-o.left,y0:i-o.top,moved:!1,baseSel:s?[...this._keys]:[],additive:s,target:n,pointerType:r,centres:c};try{a.setPointerCapture?.(e)}catch{}}_capture(e){const t=this.renderRoot.querySelector(".lanes");try{(t??e.currentTarget).setPointerCapture?.(e.pointerId)}catch{}}_keysInBand(e=[]){const t=this._band;if(!t)return[];const[i,n]=[Math.min(t.x0,t.x1),Math.max(t.x0,t.x1)],[s,r]=[Math.min(t.y0,t.y1),Math.max(t.y0,t.y1)];return e.filter(e=>e.x>=i&&e.x<=n&&e.y>=s&&e.y<=r).map(e=>e.key)}_onRulerDown(e){if(0===e.button){e.preventDefault(),this._drag={kind:"seek",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}this._seek(this._atFromX(e.clientX))}}_onRulerKey(e){const t=100*this.time,i=e.shiftKey?10:1,n={ArrowLeft:t-i,ArrowDown:t-i,ArrowRight:t+i,ArrowUp:t+i,Home:0,End:100,PageUp:t+10,PageDown:t-10};e.key in n&&(e.preventDefault(),this._seek(oh(n[e.key])))}_jump(e){const t=this.onion,i=e<0?t.prev:t.next;void 0!==i&&this._seek(i)}_setZoom(e,t){const i=Lr(e);if(i===this._zoom)return;const n=this._trackRect(),s=void 0!==t?this._atFromX(t):100*this.time,r=t??(n?n.left+12+s/100*(n.width-24):0);this._zoomAnchor={at:s,clientX:r},this._zoom=i}_onKeyKeydown(e,t){if(this.disabled||!this._view)return;const i=e.ctrlKey||e.metaKey,n=this._main;if(!("ArrowLeft"!==e.key&&"ArrowRight"!==e.key||e.altKey||i)){e.preventDefault(),this._isSel(t)||this._select([t]);const i=this._keys;if(this._refuseLocked(i))return;const s=Ar(this._view,i,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?10:1));if(s.doc===this._view)return;const r=i.findIndex(e=>Mr(e,n)===Mr(t,n)),a=s.selection[r]??s.selection[0];return a&&(this._pendingFocus=Mr(a,n),this._laneFocus.set(`${a.target}|${a.lane}`,a.at)),void this._commit(s.doc,"Move "+(1===i.length?"keyframe":"keyframes"),s.selection)}if("ArrowLeft"===e.key||"ArrowRight"===e.key||"Home"===e.key||"End"===e.key){e.preventDefault();const i=Fs(this._kfsOf(t.target),t.lane),n=i.indexOf(t.at),s="Home"===e.key?0:"End"===e.key?i.length-1:n+("ArrowLeft"===e.key?-1:1);return void(s>=0&&s<i.length&&this._focusKey({target:t.target,lane:t.lane,at:i[s]},e.shiftKey))}if("ArrowUp"===e.key||"ArrowDown"===e.key){e.preventDefault();const i=this._rows(),n=i.findIndex(e=>e.target===t.target&&e.lane===t.lane)+("ArrowUp"===e.key?-1:1);if(n<0||n>=i.length)return;const s=Fs(this._kfsOf(i[n].target),i[n].lane),r=s.reduce((e,i)=>Math.abs(i-t.at)<Math.abs(e-t.at)?i:e,s[0]);return void(void 0!==r&&this._focusKey({...i[n],at:r},e.shiftKey))}if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),this._isSel(t)||this._select([t]),void this._delete();if(" "===e.key||"Enter"===e.key){e.preventDefault();const s=e.shiftKey||i;this._select(s?this._isSel(t)?this._keys.filter(e=>Mr(e,n)!==Mr(t,n)):[...this._keys,t]:[t]),s||(this._anchor=t)}}_onTimelineKeydown(e){if(this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.composedPath()[0]?.tagName;if("INPUT"===i||"TEXTAREA"===i||"SELECT"===i)return;const n=e.key.toLowerCase();if(t&&"c"===n)e.preventDefault(),this._copy();else if(t&&"v"===n)e.preventDefault(),this._paste();else if(t&&"a"===n){e.preventDefault();const t=[];for(const e of this._rows())for(const i of Fs(this._kfsOf(e.target),e.lane))this._narrow&&"*"!==e.lane||t.push({...e,at:i});this._select(t)}else!t||"="!==n&&"+"!==n&&"-"!==n?"Escape"===e.key&&this._keys.length&&(e.preventDefault(),e.stopPropagation(),this._select([])):(e.preventDefault(),this._setZoom(Vr(this._zoom,"-"===n?-1:1)))}_focusKey(e,t=!1){this._select(t&&!this._isSel(e)?[...this._keys,e]:t?this._keys:[e]),t||(this._anchor=e),this._laneFocus.set(`${e.target}|${e.lane}`,e.at),this._pendingFocus=Mr(e,this._main),this.requestUpdate()}_add(e,t,i){const n=this._view;if(!this.doc||!n||this.disabled)return;if(this._refuseLocked([{target:e,lane:t}]))return;const s=oh(Math.min(100,Math.max(0,i))),r=wr(n,e),a="*"===t?function(e,t,i){const n=Gs(t);let s=e;for(const t of Ds(e))s=Ys(s,n,ar(e,t,n,i));return e.some(e=>e.at===n)||s!==e||(s=[...e,{at:n}]),{keyframes:Us(s),selection:[{lane:"*",at:n}]}}(r,s,n.easing):function(e,t,i,n){const s=Gs(i),r=ar(e,t,s,n)??js[t].def;return{keyframes:Us(Ys(e,s,r)),selection:[{lane:t,at:s}]}}(r,t,s,n.easing),o=a.selection.map(t=>({...t,target:e}));this._pendingFocus=Mr(o[0],this._main),this._laneFocus.set(`${e}|${t}`,o[0].at),this._anchor=o[0],this._collapsed.delete(e),this._commit(kr(n,e,a.keyframes),"*"===t?In(29):In(40,{lane:As(t).toLowerCase()}),o)}_onTrackDblClick(e,t,i){e.target.closest(".key")||this._add(t,i,this._snapAt(this._atFromX(e.clientX),e.shiftKey))}_addLane(e){this._menuOpen=!1,this._add(this._active,e,100*this.time)}_delete(){const e=this._keys.length,t=this._view;e&&t&&!this._refuseLocked(this._keys)&&(this._commit(zr(t,this._keys),"Delete "+(1===e?"keyframe":"keyframes"),[]),this._announce(In(1157,{count:e})))}_copy(){const e=this._view,t=e?qr(e,this._keys):void 0;t&&(mr(t),this._announce(In(1156,{count:t.items.length})))}_paste(){const e=ur(),t=this._view;if(!e||!t||!this.doc)return;const i=new Set(e.items.map(e=>e.target??this._main)),n=1===new Set(this._keys.map(e=>`${e.target}|${e.lane}`)).size&&"*"!==this._keys[0].lane?this._keys[0]:void 0,s=i.size>1?{}:n?{target:n.target,lane:n.lane}:{target:this._active},r=function(e,t,i,n={}){const s=_r(e),r=new Set(t.items.map(e=>e.lane)),a=!n.lane||1!==r.size||r.has("*")||r.has(n.lane)?void 0:{from:[...r][0],to:n.lane},o=new Map;let l=0;for(const e of t.items){const t=n.target??e.target??s;let i=e;if(a){const t=vr(a.from,a.to,e.frag);if(!t){l++;continue}i={...e,lane:a.to,frag:t,easings:e.easings?.[a.from]?{[a.to]:e.easings[a.from]}:void 0}}if("*"!==i.lane&&!zs(t).some(e=>e.id===i.lane)){l++;continue}if("*"===i.lane&&!Cs(t)&&(void 0!==i.frag.draw||void 0!==i.frag.stroke)){const e={...i.frag};delete e.draw,delete e.stroke,i={...i,frag:e}}const r=o.get(t)??[];r.push(i),o.set(t,r)}let c=e;const d=[];for(const[e,t]of o){const n=dr(wr(c,e),{items:t},i);c=kr(c,e,n.keyframes),d.push(...n.selection.map(t=>({...t,target:e})))}return{doc:c,selection:d,skipped:l}}(t,e,oh(100*this.time),s);if(!r.selection.length)return void this._announce(In(589));if(this._refuseLocked(r.selection))return;this._commit(r.doc,"Paste "+(1===r.selection.length?"keyframe":"keyframes"),r.selection);const a=r.skipped?In(13,{skipped:r.skipped}):"";this._announce(In(1158,{count:r.selection.length,at:lh(100*this.time),skipped:a}))}_selectLane(e,t,i){const n=Fs(this._kfsOf(e),t).map(i=>({target:e,lane:t,at:i}));this._lastTarget=e,this._select(i?[...this._keys.filter(i=>!(i.target===e&&i.lane===t)),...n]:n)}_toggleGroup(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t}render(){if(!this._view)return n.qy``;const e=this._narrow;return n.qy`
      <div class="shell" @keydown=${this._onTimelineKeydown}>
        ${this._renderBar(e)} ${e?this._renderNarrow():this._renderTimeline()}
        <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      </div>
    `}_renderAddMenu(e,t,i){const s=e.map((t,i)=>({id:t.id,label:In(t.label),icon:t.icon,separatorBefore:i>0&&e[i-1].group!==t.group}));return n.qy`<mc-ui-menu
      class="add-menu"
      .items=${s}
      label=${In(33,{target:yr(this._view,t),at:lh(i)})}
      @mc-menu-pick=${e=>{e.stopPropagation(),this._addLane(e.detail.id)}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menuOpen=!1}}
    ></mc-ui-menu>`}_renderBar(e){const t=100*this.time,i=(this._view.duration*this.time).toFixed(2),s=this.onion,r=this._active,a=new Set(Ds(this._kfsOf(r))),o=zs(r).filter(e=>!a.has(e.id)),l=ur();return n.qy`
      <div class="bar">
        <div class="readout" role="group" aria-label=${In(671)}>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${In(694)}
            title=${In(694)}
            ?disabled=${void 0===s.prev}
            @click=${()=>this._jump(-1)}
          >
            <ha-icon icon="mdi:skip-previous"></ha-icon>
          </button>
          <span class="now">${lh(t)} <small>${i} s</small></span>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${In(544)}
            title=${In(544)}
            ?disabled=${void 0===s.next}
            @click=${()=>this._jump(1)}
          >
            <ha-icon icon="mdi:skip-next"></ha-icon>
          </button>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm add-btn"
          aria-haspopup="menu"
          aria-expanded=${this._menuOpen?"true":"false"}
          title=${In(23,{target:yr(this._view,r)})}
          ?disabled=${this.disabled||!o.length}
          @click=${()=>{this._menuOpen?this._menuOpen=!1:Date.now()-this._menuClosedAt>400&&(this._menuOpen=!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon><span class="lbl">${In(e?695:32)}</span>
        </button>
        ${this._menuOpen?this._renderAddMenu(o,r,t):n.s6}
        <span class="spacer"></span>
        <div class="tools" role="toolbar" aria-label=${In(397)}>
          <button
            type="button"
            class="icon-btn sm"
            data-act="copy"
            aria-label=${In(188)}
            title=${In(185)}
            ?disabled=${!this._keys.length}
            @click=${this._copy}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            data-act="paste"
            aria-label=${In(639)}
            title=${l?In(638,{target:yr(this._view,r)}):In(189)}
            ?disabled=${!l||this.disabled}
            @click=${this._paste}
          >
            <ha-icon icon="mdi:content-paste"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            data-act="delete"
            aria-label=${In(227)}
            title=${In(222)}
            ?disabled=${!this._keys.length||this.disabled}
            @click=${this._delete}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <span class="sep" aria-hidden="true"></span>
          <button
            type="button"
            class="icon-btn sm"
            data-act="onion"
            aria-pressed=${this.onionSkin?"true":"false"}
            aria-label=${In(599)}
            title=${In(600)}
            @click=${()=>this.onionSkin=!this.onionSkin}
          >
            <ha-icon icon="mdi:layers-triple-outline"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderRuler(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=this._narrow,s=this._pxPerPct(),r=function(e,t,i){const n=t>0?t:1,s=64/(e>0?e:6),r=e=>String(Math.round(1e3*e)/1e3);let a,o;"s"===i?(a=Pr(s/100*n)/n*100,o=e=>`${r(e/100*n)} s`):(a=Math.min(50,Pr(s)),o=e=>`${r(e)}%`);const l=Math.abs(a/Pr(a/5)-5)<.01?5:4,c=a/l,d=[],p=[];for(let e=0;e*c<=100.000001&&e<2e3;e++){const t=Math.round(e*c*1e3)/1e3;e%l===0?d.push(t):p.push(t)}return{major:d,minor:p,label:o}}(i?Math.min(s,2.5):s,this._view.duration,this._unit),a=r.major.filter(t=>Math.abs(t-100*e)*s>34);return n.qy`
      <div class="ruler">
        <div class="ruler-head">${i?"":"s"===this._unit?In(777):In(212)}</div>
        <div
          class="ruler-track"
          role="slider"
          tabindex="0"
          aria-label=${In(671)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${oh(100*e)}
          aria-valuetext=${In(1244,{pct:lh(100*e),seconds:(this._view.duration*e).toFixed(2)})}
          @pointerdown=${this._onRulerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @keydown=${this._onRulerKey}
        >
          ${r.minor.map(e=>n.qy`<i class="tick" style="--at: ${e/100}"></i>`)}
          ${r.major.map(e=>n.qy`<i class="tick major" style="--at: ${e/100}"></i>`)}
          ${a.map(e=>n.qy`<span class="tick-label ${0===e?"first":e>=99.999?"last":""}" style="--at: ${e/100}">${r.label(e)}</span>`)}
          ${void 0!==t.prev?n.qy`<i class="ghost" style="--at: ${t.prev/100}"></i>`:n.s6}
          ${void 0!==t.next?n.qy`<i class="ghost" style="--at: ${t.next/100}"></i>`:n.s6}
          <span class="ph-tag" style="--t: ${e}">${"s"===this._unit?`${(this._view.duration*e).toFixed(2)} s`:lh(100*e)}</span>
        </div>
      </div>
    `}_overlays(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=t.prev??(void 0!==t.next?100*e:void 0),s=t.next??(void 0!==t.prev?100*e:void 0);return n.qy`
      ${this.onionSkin&&void 0!==i&&void 0!==s?n.qy`<div class="onion-band" style="--a: ${i/100}; --b: ${s/100}" aria-hidden="true"></div>`:n.s6}
      <div class="ph-line" style="--t: ${e}" aria-hidden="true"></div>
    `}_laneTab(e,t,i){const n=this._laneFocus.get(`${e}|${t}`);return void 0!==n&&i.includes(n)?n:this._keys.find(n=>n.target===e&&n.lane===t&&i.includes(n.at))?.at??i[0]}_renderKeys(e,t,i){const s=e.keyframes,r=e.target,a=this._main,o=this._laneTab(r,t,i),l=this.onionSkin&&r===this._active?this.onion:{},c=r===a&&1===this._groups().length?"":`${yr(this._view,r)} `,d="*"===t?c?In(1255,{target:c.trim()}):In(1109):c?In(1256,{target:c.trim(),lane:As(t).toLowerCase()}):In(1203,{lane:As(t).toLowerCase()}),p=d.charAt(0).toUpperCase()+d.slice(1),h=i.slice(0,-1).map((e,a)=>{const o=i[a+1],l=this._isSel({target:r,lane:t,at:e})&&this._isSel({target:r,lane:t,at:o});if("*"!==t)return n.qy`<i class="span ${l?"sel":""} ${Ks(s,t,e)?"own":""}" style="--a: ${e/100}; --b: ${o/100}"></i>`;const c=Dr(Zs(s,e)??this._view.easing),d=c?`M0 20 C${100*c[0]} ${20-16*c[1]} ${100*c[2]} ${20-16*c[3]} 100 4`:"M0 20 L100 4";return n.qy`<i class="span ${l?"sel":""}" style="--a: ${e/100}; --b: ${o/100}">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${n.JW`<path class="area" d="${d} L100 24 L0 24 Z"></path><path d=${d}></path>`}
        </svg>
      </i>`});return[...h,...i.map(e=>{const i={target:r,lane:t,at:e},c=this._isSel(i),d="*"===t?this._kfLanesText(s,e):ea(t,Bs(s,t,e)),h=this._isLocked(i);return n.qy`<button
        type="button"
        class="key ${c?"sel":""} ${h?"locked":""} ${e===l.prev||e===l.next?"onion":""} ${"keys"===this._drag?.kind&&c?"dragging":""}"
        style="--at: ${e/100}"
        data-key=${Mr(i,a)}
        data-lane=${t}
        data-target=${r}
        data-at=${e}
        role="slider"
        tabindex=${e===o?"0":"-1"}
        aria-label=${p}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${e}
        aria-valuetext=${[lh(e),d,c?In(1128):"",h?In(1116):""].filter(Boolean).join(", ")}
        aria-describedby="kf-help"
        title=${d?In(1196,{label:p,at:lh(e),value:d}):In(1195,{label:p,at:lh(e)})}
        @pointerdown=${e=>this._onKeyDown(e,i)}
        @keydown=${e=>this._onKeyKeydown(e,i)}
        @focus=${()=>this._laneFocus.set(`${r}|${t}`,e)}
        @dblclick=${e=>e.stopPropagation()}
      ></button>`})]}_kfLanesText(e,t){return Ds(e.filter(e=>e.at===t)).map(e=>As(e)).join(", ")}_renderGroupHead(e,t){const i=Fs(e.keyframes,"*"),s=yr(this._view,e.target),r=!this._collapsed.has(e.target),a=e.target===this._active&&!t;return n.qy`
      <div
        class="row lane summary ${a?"target-active":""} ${this._keys.some(t=>t.target===e.target&&"*"===t.lane)?"active":""}"
        data-lane="*"
        data-target=${e.target}
        role="group"
        aria-label=${In(1222,{name:s})}
      >
        <div class="head">
          <button
            type="button"
            class="icon-btn sm collapse"
            aria-expanded=${r?"true":"false"}
            aria-label=${In(r?163:310,{name:s})}
            title=${In(r?162:309)}
            @click=${()=>this._toggleGroup(e.target)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="lane-name"
            title=${In(783,{name:s.toLowerCase()})}
            @click=${t=>this._selectLane(e.target,"*",t.shiftKey||t.ctrlKey||t.metaKey)}
          >
            <ha-icon icon=${xr(e.target)}></ha-icon>
            <span class="nm">${s}</span>
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${In(25,{name:s.toLowerCase()})}
            title=${In(22)}
            ?disabled=${this.disabled}
            @click=${()=>this._add(e.target,"*",100*this.time)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <div
          class="track"
          @pointerdown=${t=>this._onTrackDown(t,e.target)}
          @dblclick=${t=>this._onTrackDblClick(t,e.target,"*")}
        >
          ${this._renderKeys(e,"*",i)}
        </div>
      </div>
    `}_renderLane(e,t){const i=e.keyframes,s=Fs(i,t),r=js[t],a=ea(r.id,ar(i,r.id,100*this.time,this._view.easing)),o=this._keys.some(i=>i.target===e.target&&i.lane===t);return n.qy`
      <div class="row lane sub ${o?"active":""}" data-lane=${t} data-target=${e.target} role="group" aria-label=${In(1199,{label:In(r.label)})}>
        <div class="head">
          <button
            type="button"
            class="lane-name"
            title=${In(783,{name:In(r.label).toLowerCase()})}
            @click=${i=>this._selectLane(e.target,t,i.shiftKey||i.ctrlKey||i.metaKey)}
          >
            <ha-icon icon=${r.icon}></ha-icon>
            <span class="nm">${In(r.label)}</span>
            ${a?this._laneValue(i,r.id,a):n.s6}
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${In(41,{name:In(r.label).toLowerCase()})}
            title=${In(22)}
            ?disabled=${this.disabled}
            @click=${()=>this._add(e.target,t,100*this.time)}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
        <div
          class="track"
          @pointerdown=${t=>this._onTrackDown(t,e.target)}
          @dblclick=${i=>this._onTrackDblClick(i,e.target,t)}
        >
          ${this._renderKeys(e,t,s)}
        </div>
      </div>
    `}_laneValue(e,t,i){const s=ar(e,t,100*this.time,this._view.easing)??{},r=(e,t="")=>n.qy`<span class="val" title=${In(75,{text:i})}><i class="sw" style="background: ${e};${t}"></i></span>`,a=e=>e.replace(/var\(--mc-anim-c\)/g,this.entityColor);return"color"===t&&s.color?r(a(s.color)):"background"===t&&s.background?r(a(s.background)):"stroke"===t&&s.stroke?r(a(s.stroke)):"shadow"===t&&s.shadow?r("var(--mc-surface)",`box-shadow: ${"none"===s.shadow?"none":a(s.shadow).replace(/(\d+(?:\.\d+)?)px/g,(e,t)=>`${Math.min(4,Number(t)/4)}px`)}`):"filter"===t&&s.filter?n.qy`<span class="val" title=${In(74,{filter:s.filter})}>${s.filter.match(/^[a-z-]+/)?.[0]??s.filter}</span>`:n.qy`<span class="val" title=${In(75,{text:i})}>${i}</span>`}_trackWidth(){if(this._zoom<=1||!this._viewW)return;const e=this._narrow?44:216;return`${Math.round(Math.max(100,this._viewW-e)*this._zoom)}px`}_renderTimeline(){const e=this._groups(),t=1===e.length,i=[];for(const s of e){if(i.push(this._renderGroupHead(s,t)),this._collapsed.has(s.target))continue;const e=Ds(s.keyframes);for(const t of e)i.push(this._renderLane(s,t));e.length||s.main||i.push(n.qy`<div class="empty-group">${In(556)}</div>`)}const s=this._band,r=this._trackWidth(),a=e.every(e=>!Ds(e.keyframes).length);return n.qy`
      <div class="tl" role="group" aria-label=${In(396)}>
        <div class="tl-body" @wheel=${this._onWheel}>
          <div class="tl-content" style=${r?`--tw: ${r}`:""}>
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${i}
              ${s?n.qy`<div
                      class="band"
                      style="left: ${Math.min(s.x0,s.x1)}px; top: ${Math.min(s.y0,s.y1)}px; width: ${Math.abs(s.x1-s.x0)}px; height: ${Math.abs(s.y1-s.y0)}px"
                    ></div>`:n.s6}
            </div>
            ${a?n.qy`<div class="empty-lanes"><ha-icon icon="mdi:information-outline"></ha-icon>${In(560)}</div>`:n.s6}
            ${this._overlays()}
          </div>
        </div>
        ${this._renderFoot()}
        <span class="sr-only" id="kf-help">
          ${In(254)}
        </span>
      </div>
    `}_renderFoot(){const e=this._zoom;return n.qy`<div class="tl-foot" role="toolbar" aria-label=${In(1001)}>
      <button
        type="button"
        class="icon-btn sm"
        data-act="snap"
        aria-pressed=${this._snap?"true":"false"}
        aria-label=${In(839)}
        title=${In(838)}
        @click=${()=>this._snap=!this._snap}
      >
        <ha-icon icon="mdi:magnet"></ha-icon>
      </button>
      <label class="grid-select">
        <span class="sr-only">${In(837)}</span>
        <div class="select">
          <select
            class="input"
            data-act="grid"
            aria-label=${In(837)}
            ?disabled=${!this._snap}
            @change=${e=>this._grid=e.target.value}
          >
            ${Er.map(e=>n.qy`<option value=${e.id} ?selected=${e.id===this._grid}>${In(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </label>
      <button
        type="button"
        class="unit-btn"
        data-act="units"
        aria-label=${"s"===this._unit?In(753):In(752)}
        title=${In(751)}
        @click=${()=>this._unit="s"===this._unit?"pct":"s"}
      >
        ${"s"===this._unit?"s":"%"}
      </button>
      <span class="spacer"></span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-out"
        aria-label=${In(1084)}
        title=${In(1085)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(Vr(e,-1))}
      >
        <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
      </button>
      <span class="zoom-pct" aria-live="polite" title=${In(197)}>${Math.round(100*e)}%</span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-in"
        aria-label=${In(1082)}
        title=${In(1083)}
        ?disabled=${e>=10}
        @click=${()=>this._setZoom(Vr(e,1))}
      >
        <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-fit"
        aria-label=${In(329)}
        title=${In(330)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(1)}
      >
        <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
      </button>
    </div>`}_renderNarrow(){const e=this._active,t=this._kfsOf(e),i={target:e,keyframes:t,main:e===this._main},s=Fs(t,"*");return n.qy`
      <div class="tl narrow" role="group" aria-label=${In(396)}>
        <div class="tl-body">
          <div class="tl-content">
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${this._renderGroupHead(i,!0)}
            </div>
            ${this._overlays()}
          </div>
          <ul class="kf-list" aria-label=${In(398)}>
            ${s.map(i=>{const s={target:e,lane:"*",at:i},r=this._isSel(s),a=this._kfLanesText(t,i),o=Zs(t,i),l=Ds(t.filter(e=>e.at===i)).map(e=>ea(e,Bs(t,e,i))).filter(Boolean).join(" · ");return n.qy`<li>
                <button
                  type="button"
                  class="kf-row"
                  data-at=${i}
                  aria-pressed=${r?"true":"false"}
                  @click=${t=>{const n=t.shiftKey||t.ctrlKey||t.metaKey;this._select(n?r?this._keys.filter(t=>!(t.target===e&&"*"===t.lane&&t.at===i)):[...this._keys,s]:[s])}}
                >
                  <span class="at">${lh(i)}</span>
                  <span class="props">${a||In(298)}${l?n.qy`<small>${l}</small>`:n.s6}</span>
                  <span class="ease">${ta(o)}</span>
                </button>
              </li>`})}
          </ul>
        </div>
        <span class="sr-only" id="kf-help">${In(72)}</span>
      </div>
    `}};ch.styles=[Ip,n.AH`
      :host {
        display: block;
        min-width: 0;
        height: 100%;
        container: kf / inline-size;
        --head: ${(0,n.iz)(216)}px;
        --row: 34px;
        --inset: 12px;
        --key-ink: var(--mc-text-2);
        --grid-line: color-mix(in srgb, var(--mc-text) 7%, transparent);
        --grid-major: color-mix(in srgb, var(--mc-text) 12%, transparent);
        --ph: var(--mc-accent);
      }
      :host([disabled]) .tl {
        opacity: 0.6;
        pointer-events: none;
      }
      .shell {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        gap: 8px;
        min-width: 0;
        height: 100%;
        min-height: 0;
      }
      /* ── toolbar ── */
      .bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }
      .readout {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        padding: 2px;
        border: 1px solid var(--mc-divider);
        border-radius: 10px;
        background: var(--mc-surface-2);
      }
      .readout .now {
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
        min-width: 104px;
        justify-content: center;
        padding: 0 4px;
        font-family: var(--mc-mono);
        font-size: 0.8125rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text);
      }
      .readout .now small {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .spacer {
        flex: 1;
      }
      .tools {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .sep {
        width: 1px;
        height: 20px;
        margin: 0 4px;
        background: var(--mc-divider);
      }
      .icon-btn[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .add-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      /* ── timeline ── */
      .tl {
        position: relative;
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        min-width: 0;
        min-height: 0;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
      }
      /* the scroll area: lanes scroll vertically, zoomed tracks sideways; heads and ruler stay */
      .tl-body {
        position: relative;
        min-height: 0;
        overflow: auto;
        overscroll-behavior: contain;
      }
      .tl-content {
        position: relative;
        min-width: 100%;
        width: max-content;
      }
      .tl.narrow {
        --head: ${(0,n.iz)(44)}px;
      }
      .tl.narrow .lane-name .nm,
      .tl.narrow .lane-name .val,
      .tl.narrow .collapse {
        display: none;
      }
      .row,
      .ruler {
        display: grid;
        grid-template-columns: var(--head) var(--tw, minmax(0, 1fr));
      }
      .row {
        min-height: var(--row);
      }
      .ruler {
        position: sticky;
        top: 0;
        z-index: 6;
        height: 36px;
        border-bottom: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
      }
      .ruler-head {
        position: sticky;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 8px 0 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
        background: var(--mc-surface-2);
        border-right: 1px solid var(--mc-divider);
      }
      .ruler-track {
        position: relative;
        cursor: ew-resize;
        touch-action: none;
        overflow: hidden;
      }
      .ruler-track:focus-visible {
        outline-offset: -2px;
      }
      .tick {
        position: absolute;
        bottom: 0;
        width: 1px;
        height: 5px;
        background: var(--mc-field-border);
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at));
      }
      .tick.major {
        height: 9px;
        background: var(--mc-text-2);
      }
      .tick-label {
        position: absolute;
        top: 5px;
        transform: translateX(-50%);
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at));
        font-size: 0.6875rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        pointer-events: none;
        white-space: nowrap;
      }
      .tick-label.first {
        transform: translateX(-2px);
      }
      .tick-label.last {
        transform: translateX(calc(-100% + 2px));
      }
      .ph-tag {
        position: absolute;
        top: 3px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--t));
        transform: translateX(-50%);
        z-index: 4;
        padding: 2px 6px;
        border-radius: 6px;
        background: var(--mc-accent-fill);
        color: var(--mc-on-accent);
        font-size: 0.6875rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
        pointer-events: none;
        white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
      .ph-tag::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -4px;
        width: 8px;
        height: 8px;
        margin-left: -4px;
        background: inherit;
        transform: rotate(45deg);
        border-radius: 1px;
        z-index: -1;
      }
      .ph-line {
        position: absolute;
        top: 36px;
        bottom: 0;
        width: 2px;
        margin-left: -1px;
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--t));
        background: var(--ph);
        z-index: 3;
        pointer-events: none;
      }
      .onion-band {
        position: absolute;
        top: 36px;
        bottom: 0;
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--a));
        width: calc((100% - var(--head) - 2 * var(--inset)) * (var(--b) - var(--a)));
        background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--mc-text) 5%, transparent) 0 6px, transparent 6px 12px);
        border-left: 1px dashed var(--mc-field-border);
        border-right: 1px dashed var(--mc-field-border);
        pointer-events: none;
        z-index: 0;
      }
      .ghost {
        position: absolute;
        bottom: 4px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at));
        width: 10px;
        height: 10px;
        margin-left: -5px;
        border: 1.5px dashed var(--mc-text-2);
        border-radius: 2px;
        transform: rotate(45deg);
        pointer-events: none;
      }
      .lanes {
        position: relative;
        touch-action: pan-x pan-y;
      }
      .lane {
        border-top: 1px solid var(--mc-divider);
      }
      .lane.summary {
        min-height: 40px;
        background: color-mix(in srgb, var(--mc-surface-2) 45%, var(--mc-surface));
      }
      .lanes > .lane.summary:first-child {
        border-top: 0;
      }
      .head {
        position: sticky;
        left: 0;
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
        padding: 0 2px 0 4px;
        background: var(--mc-surface);
        border-right: 1px solid var(--mc-divider);
      }
      .lane.summary .head {
        background: color-mix(in srgb, var(--mc-surface-2) 45%, var(--mc-surface));
      }
      .lane.sub .head {
        padding-left: 20px;
      }
      .lane.active .head {
        background: var(--mc-surface-2);
      }
      .collapse {
        flex: none;
      }
      .collapse ha-icon {
        transition: transform 0.15s ease-out;
      }
      .collapse[aria-expanded='false'] ha-icon {
        transform: rotate(-90deg);
      }
      .lane-name {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        min-height: 32px;
        padding: 0 6px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        text-align: left;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .lane.sub .lane-name {
        font-weight: 400;
      }
      .lane-name:hover {
        background: var(--mc-surface-2);
      }
      .lane-name ha-icon {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
        flex: none;
      }
      .lane.target-active .lane-name ha-icon {
        color: var(--mc-accent-ink);
      }
      .lane-name .nm {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .lane-name .val {
        flex: none;
        max-width: 64px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        font-weight: 400;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .val .sw {
        display: inline-block;
        width: 14px;
        height: 14px;
        vertical-align: middle;
        border-radius: 4px;
        border: 1px solid var(--mc-field-border);
      }
      .head .icon-btn.sm {
        width: 28px;
        height: 28px;
        --mdc-icon-size: 16px;
      }
      .track {
        position: relative;
        min-width: 0;
        cursor: crosshair;
        background-image: linear-gradient(to right, var(--grid-major) 1px, transparent 1px), linear-gradient(to right, var(--grid-line) 1px, transparent 1px);
        background-size:
          calc((100% - 2 * var(--inset)) / 4) 100%,
          calc((100% - 2 * var(--inset)) / 20) 100%;
        background-position:
          var(--inset) 0,
          var(--inset) 0;
        background-repeat: repeat-x;
        background-clip: content-box;
        padding: 0 var(--inset);
        touch-action: pan-x pan-y;
      }
      .span {
        position: absolute;
        top: 50%;
        height: 2px;
        margin-top: -1px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--a));
        width: calc((100% - 2 * var(--inset)) * (var(--b) - var(--a)));
        background: color-mix(in srgb, var(--mc-text-2) 45%, transparent);
        border-radius: 1px;
        pointer-events: none;
      }
      /* a lane segment with its own easing */
      .span.own {
        height: 3px;
        margin-top: -1.5px;
        background: repeating-linear-gradient(90deg, var(--mc-text-2) 0 4px, transparent 4px 7px);
      }
      .lane.summary .span {
        height: 24px;
        margin-top: -12px;
        background: none;
      }
      .span svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .span path {
        fill: none;
        stroke: color-mix(in srgb, var(--mc-text-2) 60%, transparent);
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
      }
      .span .area {
        fill: color-mix(in srgb, var(--mc-text-2) 8%, transparent);
        stroke: none;
      }
      .span.sel path {
        stroke: var(--mc-accent);
      }
      .span.sel {
        background: color-mix(in srgb, var(--mc-accent) 55%, transparent);
      }
      .lane.summary .span.sel {
        background: none;
      }
      .key.locked {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .key {
        position: absolute;
        top: 50%;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at));
        width: 24px;
        height: 32px;
        margin: -16px 0 0 -12px;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: grab;
        z-index: 2;
        touch-action: none;
      }
      .key::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 11px;
        height: 11px;
        margin: -5.5px 0 0 -5.5px;
        border-radius: 2px;
        transform: rotate(45deg);
        background: var(--key-ink);
        box-shadow: 0 0 0 2px var(--mc-surface);
        transition:
          transform 0.15s ease-out,
          background-color 0.15s ease-out,
          box-shadow 0.15s ease-out;
      }
      .lane.summary .key::before {
        width: 13px;
        height: 13px;
        margin: -6.5px 0 0 -6.5px;
        background: var(--mc-surface);
        box-shadow:
          inset 0 0 0 2px var(--mc-text),
          0 0 0 2px var(--mc-surface);
      }
      .key:hover::before {
        transform: rotate(45deg) scale(1.2);
      }
      .key.sel::before {
        background: var(--mc-accent-fill);
        box-shadow:
          0 0 0 2px var(--mc-surface),
          0 0 0 4px color-mix(in srgb, var(--mc-accent) 45%, transparent);
      }
      .lane.summary .key.sel::before {
        background: var(--mc-accent-fill);
        box-shadow:
          inset 0 0 0 2px var(--mc-accent-fill),
          0 0 0 2px var(--mc-surface),
          0 0 0 4px color-mix(in srgb, var(--mc-accent) 45%, transparent);
      }
      .key.onion::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 19px;
        height: 19px;
        margin: -9.5px 0 0 -9.5px;
        border: 1.5px dashed var(--mc-text-2);
        border-radius: 4px;
        transform: rotate(45deg);
        pointer-events: none;
      }
      .key:focus-visible {
        outline: none;
      }
      .key:focus-visible::before {
        box-shadow:
          0 0 0 2px var(--mc-surface),
          0 0 0 4px var(--mc-accent);
      }
      .key.dragging {
        cursor: grabbing;
      }
      .band {
        position: absolute;
        z-index: 5;
        border: 1px solid var(--mc-accent);
        background: var(--mc-accent-tint);
        border-radius: 2px;
        pointer-events: none;
      }
      .empty-lanes,
      .empty-group {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        border-top: 1px solid var(--mc-divider);
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .empty-group {
        position: sticky;
        left: 0;
        width: max-content;
        max-width: 100cqw;
        padding-left: 24px;
        border-top: 0;
        font-size: 0.75rem;
      }
      /* ── footer: snapping, ruler unit, zoom ── */
      .tl-foot {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 6px;
        padding: 4px 8px;
        border-top: 1px solid var(--mc-divider);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, var(--mc-surface));
      }
      .tl-foot .icon-btn.sm {
        width: 30px;
        height: 30px;
        --mdc-icon-size: 17px;
      }
      .grid-select {
        width: 92px;
      }
      .grid-select select.input {
        min-height: 30px;
        padding-top: 2px;
        padding-bottom: 2px;
        font-size: 0.8125rem;
      }
      .unit-btn {
        min-width: 34px;
        height: 30px;
        padding: 0 8px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text);
        font-size: 0.75rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .unit-btn:hover {
        background: var(--mc-surface-2);
      }
      .zoom-pct {
        min-width: 44px;
        text-align: center;
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
      }
      kbd {
        display: inline-block;
        min-width: 18px;
        padding: 1px 5px;
        border: 1px solid var(--mc-divider);
        border-bottom-width: 2px;
        border-radius: 4px;
        background: var(--mc-surface);
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        line-height: 1.4;
        color: var(--mc-text);
        text-align: center;
      }
      /* ── narrow: keyframe list ── */
      .kf-list {
        display: grid;
        gap: 0;
        margin: 0;
        padding: 0;
        list-style: none;
        border-top: 1px solid var(--mc-divider);
      }
      .kf-row {
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr) auto;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: 48px;
        padding: 6px 12px;
        border: 0;
        border-top: 1px solid var(--mc-divider);
        background: transparent;
        text-align: left;
      }
      .kf-list li:first-child .kf-row {
        border-top: 0;
      }
      .kf-row:hover {
        background: var(--mc-surface-2);
      }
      .kf-row[aria-pressed='true'] {
        background: var(--mc-accent-tint);
      }
      .kf-row[aria-pressed='true'] .at {
        color: var(--mc-accent-ink);
      }
      .kf-row:focus-visible {
        outline-offset: -2px;
      }
      .kf-row .at {
        font-family: var(--mc-mono);
        font-size: 0.8125rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .kf-row .props {
        min-width: 0;
        font-size: 0.8125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .kf-row .props small {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .kf-row .ease {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      @container kf (max-width: 560px) {
        .readout .now {
          min-width: 88px;
        }
        .add-btn .lbl {
          display: none;
        }
      }
    `],ah([(0,s.MZ)({attribute:!1})],ch.prototype,"doc",void 0),ah([(0,s.MZ)({attribute:!1})],ch.prototype,"hass",void 0),ah([(0,s.MZ)({attribute:!1})],ch.prototype,"library",void 0),ah([(0,s.MZ)({type:Number})],ch.prototype,"time",void 0),ah([(0,s.MZ)({type:Boolean,reflect:!0})],ch.prototype,"disabled",void 0),ah([(0,s.MZ)({attribute:!1})],ch.prototype,"layerView",void 0),ah([(0,s.MZ)({type:Boolean,reflect:!0,attribute:"onion-skin"})],ch.prototype,"onionSkin",void 0),ah([(0,s.MZ)({type:String})],ch.prototype,"layout",void 0),ah([(0,s.MZ)({type:String})],ch.prototype,"entityColor",void 0),ah([(0,s.MZ)({attribute:!1})],ch.prototype,"studioSelection",void 0),ah([(0,s.wk)()],ch.prototype,"_keys",void 0),ah([(0,s.wk)()],ch.prototype,"_draft",void 0),ah([(0,s.wk)()],ch.prototype,"_band",void 0),ah([(0,s.wk)()],ch.prototype,"_width",void 0),ah([(0,s.wk)()],ch.prototype,"_viewW",void 0),ah([(0,s.wk)()],ch.prototype,"_menuOpen",void 0),ah([(0,s.wk)()],ch.prototype,"_status",void 0),ah([(0,s.wk)()],ch.prototype,"_zoom",void 0),ah([(0,s.wk)()],ch.prototype,"_unit",void 0),ah([(0,s.wk)()],ch.prototype,"_snap",void 0),ah([(0,s.wk)()],ch.prototype,"_grid",void 0),ah([(0,s.wk)()],ch.prototype,"_collapsed",void 0),ah([(0,s.wk)()],ch.prototype,"_lastTarget",void 0),ch=ah([(0,s.EM)("mc-anim-keyframes-editor")],ch);const dh={...ie,...se,...ae},ph={"steam-rise":"bottom:-12px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:$c;filter:blur(5px);",bubbles:"bottom:-10px;width:8px;height:8px;margin-left:-4px;border-radius:50%;border:1.5px solid $c;background:color-mix(in srgb,$c 22%,transparent);","bubbles|:nth-child(even)":"width:5px;height:5px;","snow-fall":"top:-8px;width:5px;height:5px;border-radius:50%;background:$c;","rain-fall":"top:-18px;width:2px;height:14px;border-radius:1px;background:linear-gradient(transparent,$c);","liquid-wave":"left:-50%;top:calc(100% - $i * 1%);width:200%;aspect-ratio:1;border-radius:42%;background:color-mix(in srgb,$c 50%,transparent);opacity:1;","liquid-wave|:nth-child(2)":"top:calc(100% - $i * .9%);border-radius:38%;background:$c;animation-direction:reverse;","storm-flash":"inset:0;background:color-mix(in srgb,$c 35%,rgba(255,255,255,.55));","shine-sweep":"top:0;bottom:0;left:0;width:45%;opacity:1;background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--mca-shine-sweep-c,#fff) calc($i * 1%),transparent) 50%,transparent 100%);",...re,"holographic-shimmer":"left:0;top:0;width:400%;height:100%;opacity:calc($i / 100);background:linear-gradient(115deg,transparent 20%,color-mix(in srgb,$c 55%,#ff80ab) 35%,color-mix(in srgb,$c 55%,#80d8ff) 50%,color-mix(in srgb,$c 55%,#ccff90) 65%,transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"left:0;top:0;width:100%;height:14%;opacity:calc($i / 100);background:linear-gradient(transparent,color-mix(in srgb,$c 45%,transparent) 70%,$c 96%,transparent);",twinkle:"top:calc(8% + var(--mc-anim-phase) * 80%);width:10px;height:10px;margin:-5px 0 0 -5px;background:$c;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);",spotlight:"left:50%;top:50%;width:70cqmin;aspect-ratio:1;margin:-35cqmin 0 0 -35cqmin;opacity:calc($i / 100);border-radius:50%;background:radial-gradient(circle,$c,transparent 65%);","color-cycle-bg":"left:0;top:0;width:100%;height:100%;opacity:calc($i / 100);background:$c;",aurora:"left:-25%;top:calc(-10% + var(--mc-anim-k) * 40%);width:150%;height:55%;background:radial-gradient(ellipse 30% 50% at 32% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 62% 50%,color-mix(in srgb,$c 50%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 50%,#00e5ff) 45%,transparent) 45%,transparent);","aurora|:nth-child(2)":"animation-duration:calc(var(--mc-fx-dur) * 1.4);animation-direction:reverse;background:radial-gradient(ellipse 30% 50% at 37% 50%,color-mix(in srgb,$c 50%,#76ff03),color-mix(in srgb,color-mix(in srgb,$c 50%,#76ff03) 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 68% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent);","aurora|:nth-child(3)":"animation-duration:calc(var(--mc-fx-dur) * .8);background:radial-gradient(ellipse 38% 50% at 42% 50%,color-mix(in srgb,$c 50%,#e040fb),color-mix(in srgb,color-mix(in srgb,$c 50%,#e040fb) 45%,transparent) 45%,transparent);","lava-lamp":"bottom:-12%;width:calc(14cqmin + var(--mc-anim-phase) * 16cqmin);aspect-ratio:1;margin-left:-10cqmin;border-radius:50%;background:radial-gradient(circle at 35% 35%,color-mix(in srgb,$c 55%,#fff),$c 70%);filter:blur(2px);","plasma-gradient":"left:50%;top:50%;width:160cqmax;aspect-ratio:1;margin:-80cqmax 0 0 -80cqmax;opacity:calc($i / 100);background:radial-gradient(circle at 30% 30%,$c,color-mix(in srgb,$c 55%,transparent) 22%,color-mix(in srgb,$c 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 70% 40%,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 45% 75%,color-mix(in srgb,$c 40%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 15%,transparent) 38%,transparent 52%);","gradient-flow":"left:0;top:0;width:300%;height:100%;opacity:calc($i / 100);background:linear-gradient(110deg,$c,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,$c 40%,#00e5ff),$c);",starfield:"top:calc(6% + var(--mc-anim-phase) * 86%);width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:$c;box-shadow:0 0 4px 1px color-mix(in srgb,$c 60%,transparent);","starfield|:nth-child(3n)":"width:2px;height:2px;","meteor-shower":"top:calc(-10% + var(--mc-anim-phase) * 30%);left:calc(30% + var(--mc-anim-x) * .8);width:22%;height:2px;rotate:-45deg;transform-origin:0 50%;border-radius:2px;background:linear-gradient(90deg,$c,transparent);",bokeh:"top:calc(10% + var(--mc-anim-phase) * 75%);width:calc(10cqmin + var(--mc-anim-k) * 18cqmin);aspect-ratio:1;margin:-10cqmin 0 0 -10cqmin;border-radius:50%;filter:blur(1px);background:radial-gradient(circle,color-mix(in srgb,$c 70%,transparent),color-mix(in srgb,$c 25%,transparent) 60%,transparent 72%);","matrix-rain":"top:0;width:2px;height:calc(20% + var(--mc-anim-phase) * 25%);border-radius:1px;background:linear-gradient(transparent,color-mix(in srgb,$c 60%,transparent) 70%,$c);","matrix-rain|:nth-child(odd)":"width:3px;background:repeating-linear-gradient(transparent 0 3px,$c 3px 6px);-webkit-mask:linear-gradient(transparent,#000);mask:linear-gradient(transparent,#000);",smoke:"bottom:-20px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:color-mix(in srgb,$c 70%,#9e9e9e);filter:blur(8px);","clouds-drift":"left:-40%;top:calc(5% + var(--mc-anim-phase) * 55%);width:38%;aspect-ratio:2.4;filter:blur(1.5px);background:radial-gradient(ellipse 35% 45% at 30% 60%,$c 60%,transparent 62%),radial-gradient(ellipse 30% 55% at 55% 45%,$c 60%,transparent 62%),radial-gradient(ellipse 28% 40% at 75% 62%,$c 60%,transparent 62%);","water-ripple":"top:calc(25% + var(--mc-anim-phase) * 50%);width:60cqmin;aspect-ratio:2.2;margin:-13.6cqmin 0 0 -30cqmin;border:2px solid $c;border-radius:50%;box-sizing:border-box;box-shadow:0 0 0 3px color-mix(in srgb,$c 25%,transparent);",fireworks:"left:50%;top:45%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 1px $c;animation-delay:var(--mc-fx-delay,0s);","fireworks|:nth-child(even)":"background:color-mix(in srgb,$c 50%,#ffeb3b);box-shadow:0 0 6px 1px color-mix(in srgb,$c 50%,#ffeb3b);","tap-ripple":"left:var(--mc-tap-x,50%);top:var(--mc-tap-y,50%);width:290cqmax;aspect-ratio:1;margin:-145cqmax 0 0 -145cqmax;border-radius:50%;background:radial-gradient(circle,$c 0,color-mix(in srgb,$c 55%,transparent) 40%,transparent 70%);"};function hh(e,t,i=!1){const n=te(t),s=`var(--mca-${t}-c, var(--mc-anim-c))`;return e.replace(/\$i/g,`var(--mca-${t}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${s} calc(var(--mca-${t}-s, 1) * 100%), transparent)`:s)}const uh=n.AH`[data-mc-anim],[data-mc-anim-fx]{--mc-anim-c:var(--mc-anim-color,var(--mc-design-color,var(--primary-color,#03a9f4)))}[data-mc-anim~='module']{animation:var(--mc-anim-m);transform-origin:var(--mc-anim-om,center)} [data-mc-anim~='icon'] .mc-anim-icon{display:inline-block;animation:var(--mc-anim-i);transform-origin:var(--mc-anim-oi,center)} [data-mc-anim~='label'] [data-mc-part='name']{display:inline-block;animation:var(--mc-anim-n);transform-origin:var(--mc-anim-on,center)} [data-mc-anim~='icon']:not(:has(.mc-anim-icon)){animation:var(--mc-anim-mi);transform-origin:var(--mc-anim-om,var(--mc-anim-oi,center))} [data-mc-anim-fx]{position:relative;isolation:isolate}.mc-anim-fx{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;border-radius:inherit;container-type:size}.mc-anim-fx[data-front]{z-index:auto}.mc-anim-fx>i{position:absolute;display:block;left:var(--mc-anim-x,50%);opacity:0;will-change:translate,scale,rotate,opacity;animation:var(--mc-fx-anim);animation-delay:calc(var(--mc-fx-delay,0s) - var(--mc-anim-phase,0) * var(--mc-fx-dur,1s))} [data-mc-tap][data-mc-tapped]{animation:var(--mc-anim-m,none),var(--mc-anim-t);transform-origin:var(--mc-anim-om,center)} .mc-anim-fx[data-tap]:not([data-tapped]),.mc-anim-ring[data-tap]:not([data-tapped]){display:none}`,mh=n.AH`@media (prefers-reduced-motion:reduce){[data-mc-anim],[data-mc-anim] .mc-anim-icon,[data-mc-anim~='label'] [data-mc-part='name'],[data-mc-tap],.mc-anim-fx>i{animation:none !important}.mc-anim-fx:not([data-p]),.mc-anim-ring{display:none}}`,gh=(0,n.iz)(uh.cssText+[...Object.entries(dh).map(([e,t])=>`@keyframes mc-anim-${e} {${hh(t,e.replace(/-icon$/,""),!0)}\n}`),...J.filter(e=>void 0!==e.particles).map(e=>`.mc-anim-fx[data-fx="${e.id}"] {\n  opacity: var(--mca-${e.id}-s, 1);\n}`),...Object.entries({"conic-border-spin":"padding:calc($i * 1px);box-sizing:border-box;background:color-mix(in srgb,$c 18%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);"}).map(([e,t])=>`.mc-anim-fx[data-fx="${e}"] {${hh(t,e)}\n}`),...Object.entries(ph).map(([e,t])=>{const[i,n=""]=e.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${hh(t,i)}\n}`})].join("\n")+mh.cssText),fh=new Set(["off","unavailable","unknown","idle","standby"]),vh=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function bh(e){if(!e)return!1;const t=e.entity_id.split(".")[0],i=e.state;if(fh.has(i))return!1;switch(t){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function yh(e,t){if(!e||!Object.prototype.hasOwnProperty.call(e,t))return;const i=e[t];if(!Array.isArray(i))return;const n=[i[0],i[1],i[2]];return"hs_color"===t&&n.slice(0,2).every(Number.isFinite)?function(e,t){const i=Math.max(0,Math.min(100,t))/100,n=t=>{const n=(t+e/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(e=>Math.round(255*e))}((n[0]%360+360)%360,n[1]):n.every(Number.isFinite)?n.map(e=>Math.max(0,Math.min(255,Math.round(e)))):void 0}const xh=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function _h(e){if("string"!=typeof e)return;const t=e.trim().match(xh);return t?{opacity:void 0===t[1]?100:Math.min(100,Number(t[1]))}:void 0}function $h(e){return void 0!==_h(e)}function wh(e){const t=_h(e);if(!t)return;const i="var(--mc-entity-color, currentColor)";return t.opacity>=100?i:`color-mix(in srgb, ${i} ${t.opacity}%, transparent)`}const kh=e=>e.replace(/_/g,"-"),Mh={margin:["top","right","bottom","left"].map(e=>({key:`margin_${e}`,cssProperty:`margin-${e}`})),padding:["top","right","bottom","left"].map(e=>({key:`padding_${e}`,cssProperty:`padding-${e}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(e=>({key:`border_${e}_radius`,cssProperty:`border-${e.replace("_","-")}-radius`}))},Sh="margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap background background_color:c background_image:i background_position background_size background_repeat background_attachment background_clip background_origin backdrop_filter flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction animation_fill_mode animation_play_state filter list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side".split(" ").map(e=>{const[t,i=""]=e.split(":");return{key:t,flag:i}}),jh=[...Sh.filter(e=>"c"===e.flag).map(e=>e.key),"icon_color","icon_background","label_color","state_color"];new Set(Sh.filter(e=>"i"===e.flag).map(e=>e.key)),Object.fromEntries(Sh.filter(e=>"p"===e.flag||"s"===e.flag).flatMap(e=>{const t="s"===e.flag?"s":"px";return[[e.key,t],...(Mh[e.key]||[]).map(e=>[e.key,t])]})),new Map;const Ch=e=>"string"==typeof e&&""!==e.trim()?e.trim():void 0;function Ah(e){if("number"==typeof e&&Number.isFinite(e)&&e>=0)return+e.toFixed(3)+"s";const t=Ch(e);if(!t)return;const i=t.length<=64?/^(?:\d+(?:\.\d+)?|\.\d+)(m?s)?$/.exec(t):null;return i?i[1]?t:+(+t).toFixed(3)+"s":void 0}const zh=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function qh(e){const t=Ch(e);if(!t||t.length>256||!/^[#\w\s(),.%+*/-]+$/.test(t)||t.includes("/*")||t.includes("*/"))return;let i=0;for(const e of t)if("("===e)i++;else if(")"===e&&--i<0)return;if(0!==i)return;const n=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==n||s.some(e=>!zh.has(e[1].toLowerCase()))?void 0:t}const Eh=/^(\d+(?:\.\d+)?|\.\d+)(%)?$/;new Map([["blur",/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem)?$/],["hue-rotate",/^(-?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)$/],...["brightness","contrast","grayscale","invert","opacity","saturate","sepia"].map(e=>[e,Eh])]),new Map,new Map,new Map([["left",["2/1/4/2",3]],["right",["2/4/4/5",2]],["above",["1/2/2/4",1]],["below",["4/2/5/4",0]]]),new Set(["start","center","end"]),function(){const e={};for(const{key:t}of Sh){e[t]=kh(t);for(const i of Mh[t]||[])e[i.key]=i.cssProperty}}();const Hh=/(?<![\w-])entity(?: \d+(?:\.\d+)?%)?(?![\w-])/g;function Lh(e){const t="string"==typeof e&&e.length<=256?e.replace(Hh,e=>wh(e)??e):e;return t===e?void 0:t}function Vh(e,t,i){const n=Ch(e.trigger_entity);switch(n&&(t=i?.[n]),e.trigger){case"entity_on":return bh(t);case"state":{const i=(e.state||"").trim();return!!i&&!!t&&t.state===i}default:return!0}}new Set(["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color","box_shadow"]),new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]);const Oh={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"},Ph=new Map,Rh=new Set;const Dh=new Map,Nh={slow:1.6,normal:1,fast:.6},Th=["normal","reverse","alternate","alternate-reverse"],Fh=e=>e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);function Ih(e){const t=Ch(e);if(!t)return;const i=I.find(e=>e.id===t);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)?t:void 0}function Bh(e){if("infinite"===e)return"infinite";const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?String(+t.toFixed(2)):void 0}function Zh(e,t){const i="string"==typeof t?Number(t):t;return"number"==typeof i&&Number.isFinite(i)?Math.min(e.intensity.max,Math.max(e.intensity.min,i)):e.defaults.intensity}function Kh(e){const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?Math.min(100,Math.max(0,t)):void 0}const Wh=(e,t)=>t&&"icon"===e.target,Uh=(e,t)=>!e.target&&!!t?.channels.includes("rotate"),Gh=(e,t)=>t&&"label"===e.target;function Yh(e,t,i,n){if("weather"===e.seasonal){const e=Ch(t.trigger_entity),r=e?.startsWith("weather.")?n?.[e]:i;return r?.entity_id?.startsWith("weather.")&&(s=r.state)?Oh[s]:void 0}var s;if("daynight"===e.seasonal){const e=n?.["sun.sun"],t=e?.attributes?.elevation;return function(e,t){if("below_horizon"===e||"above_horizon"===e)return"number"==typeof t&&Number.isFinite(t)&&Math.abs(t)<=6?"dusk":"below_horizon"===e?"night":void 0}(e?.state,"number"==typeof t?t:"string"==typeof t&&""!==t.trim()?Number(t):void 0)}return e.seasonal}const Jh=.618034;function Xh(e){return Array.from({length:e},(t,i)=>{const n=60/e*(i*Jh%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/e*100+n)).toFixed(1),phase:+(i*Jh%1).toFixed(3),k:e>1?+(i/e).toFixed(3):0}})}function Qh(e,t,i={}){e=function(e){if(!e)return e;const t=e;let i;for(const e of jh){const n=Lh(t[e]);n&&((i??={...t})[e]=n)}return Array.isArray(t.animations)&&t.animations.some(e=>$h(e?.color))&&((i??={...t}).animations=t.animations.map(e=>$h(e?.color)?{...e,color:wh(e.color)}:e)),i??e}(e);const n=!1!==i.allowIcon,s={m:[],i:[],mi:[],t:[],n:[]},r=[],a={},o=[],l=[],c=[],d={need:!1,p:!1};for(let p of function(e){if(!e)return[];if(Array.isArray(e.animations))return e.animations.filter(e=>!!e&&"object"==typeof e&&!!Ch(e.preset)).map((e,t)=>Ch(e.id)?e:{...e,id:`anim-${t}`});const t=Ch(e.animation_preset);if(!t)return[];const i=te(t),n={id:"legacy",preset:t};if(e.animation_target&&(n.target=e.animation_target),e.animation_trigger&&(n.trigger=e.animation_trigger),e.animation_state&&(n.state=e.animation_state),e.animation_color&&(n.color=e.animation_color),!i)return[n];const s=function(e){if(e.seasonal)return{intensity:e.defaults.intensity};const{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:a}=e.defaults;return{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:a,...F(e)?{strength:100}:{}}}(i),r=Nh[e.animation_speed||"normal"]??1;return[{...n,...s,duration:+(Fh(s.duration)*r).toFixed(3)+"s"}]}(e)){const e=!!i.spinIcon&&!Ze(p.preset);if(Ze(p.preset)){const e=i.custom?.(Ke(p.preset));if(!e||!Vh(p,t,i.states))continue;const h=eu(e,p,{lists:s,vars:r,origins:a,fx:o,seq:l,v2:c,allowIcon:n,runtime:d,custom:i.custom,stateObj:t,states:i.states});if(!h)continue;p=h}const h=te(p.preset);if(!h||!Vh(p,t,i.states))continue;const u=h.defaults,m=Ah(p.duration)??u.duration,g=Ah(p.delay)??u.delay,f="tap"===p.trigger;let v=Bh(p.iterations)??Bh(u.iterations);f&&"infinite"===v&&(v="1");const b=`${Ih(p.easing)??Ih(u.easing)} ${g} ${v} ${Th.includes(p.direction)?p.direction:u.direction}`,y=`${m} ${b}`,x=[`--mca-${h.id}-i: ${Zh(h,p.intensity)}`],_=qh(p.color);_&&x.push(`--mca-${h.id}-c: ${_}`);const $=F(h)?Kh(p.strength):void 0;if(void 0!==$&&100!==$&&x.push(`--mca-${h.id}-s: ${+($/100).toFixed(3)}`),h.seasonal){const e=Yh(h,p,t,i.states);if(!e)continue;o.push({preset:h.id,front:!1,style:void 0!==$&&100!==$?"opacity: "+ +($/100).toFixed(3):"",particles:[],seasonal:{scenes:[e],intensity:Zh(h,p.intensity)/100,decorations:!1!==p.decorations}});continue}if(h.ring){o.push({preset:h.id,front:!0,style:x.join("; "),particles:[],...f?{tap:f}:{},ring:tu(h,p,m,b,$)});continue}if(void 0!==h.particles){const e="count"===h.particles?Math.min(12,Math.round(Zh(h,p.intensity))):h.particles;o.push({preset:h.id,front:!!h.front,style:[`--mc-fx-anim: mc-anim-${h.id} ${y}`,`--mc-fx-dur: ${m}`,`--mc-fx-delay: ${g}`,...x].join("; "),particles:Xh(Math.max(1,e)),...f?{tap:f}:{}});continue}if(r.push(...x),f){s.t.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.m&&(a.m=h.origin);continue}if(Gh(p,n)){s.n.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.n&&(a.n=h.origin);continue}const w=Wh(p,n)||e&&Uh(p,h);s.mi.push(`mc-anim-${h.id} ${y}`),w?(s.i.push(`mc-anim-${h.id}${h.iconKeyframes?"-icon":""} ${y}`),h.origin&&!a.i&&(a.i=h.origin)):(s.m.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.m&&(a.m=h.origin))}if(!(s.mi.length||s.n.length||s.t.length||o.length||l.length||d.need))return;const p=[];s.m.length&&p.push(`--mc-anim-m: ${s.m.join(", ")}`),s.t.length&&p.push(`--mc-anim-t: ${s.t.join(", ")}`),s.i.length&&p.push(`--mc-anim-i: ${s.i.join(", ")}`,`--mc-anim-mi: ${s.mi.join(", ")}`),s.n.length&&p.push(`--mc-anim-n: ${s.n.join(", ")}`),a.m&&p.push(`--mc-anim-om: ${a.m}`),a.i&&p.push(`--mc-anim-oi: ${a.i}`),a.n&&p.push(`--mc-anim-on: ${a.n}`),p.push(...function(e){const t=new Map;for(const i of e){const e=i.slice(0,i.indexOf(":"));t.delete(e),t.set(e,i)}return[...t.values()]}(r));const h=qh(e?.color)??qh(function(e){if(!e)return;const t=e.entity_id.split(".")[0];if(!vh.has(t))return;if(!bh(e))return`var(--state-${t}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=function(e){const t=yh(e,"rgb_color")||yh(e,"hs_color");return t?`rgb(${t.join(", ")})`:void 0}(e.attributes||{});return i||`var(--state-${t}-${e.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${t}-active-color, var(--state-active-color, var(--primary-color))))`}(t));h&&p.push(`--mc-anim-color: ${h}`);const u=[s.m.length?"module":"",s.i.length?"icon":"",s.n.length?"label":""].filter(Boolean).join(" ");return{...u?{targets:u}:{},style:p.join("; "),fx:o,...s.t.length?{tap:!0}:{},...l.length?{seq:l.join(" ")}:{},...d.need?{needsRuntime:!0}:{},...d.p?{needsParticles:!0}:{},...c.length?{v2:c,run:[...new Set(c.map(e=>e.run))].join(" ")}:{}}}function eu(e,t,i){const n=On(e,{lookup:i.custom}),s=Bh(e.iterations)??"infinite",r="tap"===t.trigger,a=Ah(t.duration)??`${e.duration}s`,o=Ah(t.delay)??"0s";let l=Bh(t.iterations)??s;r&&"infinite"===l&&(l="1");const c=Th.includes(t.direction)?t.direction:e.direction??"normal",d=`${Ih(t.easing)??Ih(e.easing)??"ease"} ${o} ${l} ${c}`,p=Gh(t,i.allowIcon),h=i.allowIcon&&("icon"===t.target||!t.target&&"icon"===n.motion?.target);let u;if(Fe(e)&&(i.runtime.need=!0,n.v2)){const s="string"==typeof t.entity&&t.entity?t.entity:void 0,r=s?i.states?.[s]:i.stateObj,o=s??i.stateObj?.entity_id,l=n.name||pn(e),c={};u=c.clip?.animation,i.v2.push({run:l,docId:e.id,v2:u?{...n.v2,tracks:[]}:n.v2,timing:`${a} ${d}`,icon:h,...o?{entityId:o}:{},...r?{stateObj:r}:{},hints:c})}if(u){if("none"===u)return;const n={...t,preset:u,target:h?"icon":t.target};for(const e of["duration","delay","easing","iterations","direction"])delete n[e];if(!Ze(u))return n;const s=i.custom?.(Ke(u));return s&&s!==e?eu(s,n,i):void 0}if(n.preset)return{...t,preset:n.preset.id,intensity:t.intensity??n.preset.intensity,duration:t.duration??`${e.duration}s`,easing:t.easing??e.easing,iterations:t.iterations??("infinite"===s?"infinite":Number(s)),direction:t.direction??e.direction};if(n.schedule){const e=n.schedule,s=Ah(t.duration),r=s&&e.total>0?Fh(s)/e.total:1,a="number"==typeof t.iterations&&t.iterations>0?Math.round(t.iterations):void 0;return void(e.steps.length&&i.seq.push(function(e){const t=`s${dn(JSON.stringify(e))}`;return Dh.set(t,e),Dh.size>64&&Dh.delete(Dh.keys().next().value),t}({...e,delay:Fh(o),scale:r,...a?{cycles:a}:{},...p?{target:"label"}:{}})))}const m=[],g="number"==typeof t.intensity&&Number.isFinite(t.intensity)?t.intensity:void 0;void 0!==g&&100!==g&&m.push(`${hn(e.id,"i")}: ${+(g/100).toFixed(3)}`);const f=qh(t.color);f&&m.push(`${hn(e.id,"c")}: ${f}`);const v=Kh(t.strength);if(void 0!==v&&100!==v&&m.push(`${hn(e.id,"s")}: ${+(v/100).toFixed(3)}`),b=e.id,y=n.name,x=n.css,y&&x&&Ph.get(b)?.name!==y&&(Ph.set(b,{name:y,css:x}),function(){const e=[...Ph.values()].map(e=>e.css).join("\n");for(const t of Rh)t.isConnected?t.textContent=e:Rh.delete(t)}()),n.layer){(n.sim||n.needsParticles)&&(i.runtime.p=!0);const e=+(Fh(a)/n.layer.speed).toFixed(3)+"s";for(const[t,s,a]of[[n.name,n.layer,n.sim],...n.split?[[n.split.name,n.split.layer,n.split.sim]]:[]])i.fx.push({preset:t,front:s.front,style:[`--mc-fx-anim: ${t} ${e} ${d}`,`--mc-fx-dur: ${e}`,`--mc-fx-delay: ${o}`,...m].join("; "),particles:s.particles,...s.symbol?{symbol:s.symbol}:{},sim:a,...r?{tap:r}:{}});return}var b,y,x;if(!n.motion)return;const _=[n.name,...n.lanes??[]].map(e=>`${e} ${a} ${d}`).join(", "),$="center"!==n.motion.origin?n.motion.origin:void 0;return i.vars.push(...m),r?(i.lists.t.push(_),void($&&!i.origins.m&&(i.origins.m=$))):p?(i.lists.n.push(_),void($&&!i.origins.n&&(i.origins.n=$))):(i.lists.mi.push(_),void(h?(i.lists.i.push(_),$&&!i.origins.i&&(i.origins.i=$)):(i.lists.m.push(_),$&&!i.origins.m&&(i.origins.m=$))))}function tu(e,t,i,n,s){return{mode:"animated",fill:1,animation:e.ring,color:qh(t.color)??"var(--mc-anim-c)",width:Zh(e,t.intensity),linecap:"dashes"===e.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==s&&100!==s?{opacity:+(s/100).toFixed(3)}:{}}}const iu=["❤️","💖","⭐","✨","❄️","💧","🔥","🍂","🌸","🎉","🎈","🫧","☁️","⚡","🌙","🦋"],nu={icon:{icon:"mdi:star"},emoji:{emoji:"✨"},svg:{svg:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'}},su=/^[a-z0-9_-]+:[a-z0-9_-]+$/i;function ru(e){const t=e.trim();return t?[...t].length>8?In(1056):/[<>&"'\\{};]/.test(t)?"These characters are not allowed: < > & \" ' \\ { } ;":void 0:In(302)}function au(e){if(!e.trim())return In(641);if(!/<svg[\s>]/i.test(e))return In(545);const t=Ne(e);return t.error?is(t.error):t.paths.length||t.strokes.length||t.accentPaths.length?void 0:In(919)}const ou=wh("entity"),lu=/^color-mix\(in srgb, var\(--mc-entity-color, currentColor\) (\d+(?:\.\d+)?)%, transparent\)$/;function cu(e){const t=e.trim();if(t)return _h(t)?wh(t):it(t,"color")}function du(e){if(e===ou)return"entity";const t=lu.exec(e);return t?`entity ${t[1]}%`:e}const pu=(e,t,i)=>Math.min(i,Math.max(t,e)),hu=(e,t)=>+(Math.round(e/t)*t).toFixed(4),uu={count:{min:1,max:Ge,step:1},speed:{min:.1,max:10,step:.1},size:{min:1,max:200,step:1},spin:{min:-3600,max:3600,step:15},spread:{min:0,max:100,step:5},gravity:{min:-1,max:1,step:.1}};function mu(e,t){const i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;const n=uu[e],s=pu(i,n.min,n.max);return"count"===e?Math.round(s):"gravity"===e||"speed"===e?hu(s,.01):+s.toFixed(2)}function gu(e,t){const i={...e.particles??Qe,...t};for(const e of Object.keys(i))void 0===i[e]&&delete i[e];return{...e,particles:i}}const fu=e=>e.particles?.preset?te(e.particles.preset):void 0;function vu(e){return e.ring?In(745):e.seasonal?In(776):"count"===e.particles?In(628):In(770)}const bu={"snow-fall":{direction:"fall",size:[4,8],colors:["#ffffff"],spin:0},"rain-fall":{direction:"fall",size:[2,4],speed:2,colors:["#90caf9"],gravity:.6,fade:!1},bubbles:{direction:"rise",size:[6,14],colors:[]},"steam-rise":{direction:"rise",size:[10,18],spread:60},confetti:{direction:"fall",size:[5,9],spin:360,colors:["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899"]},"falling-leaves":{direction:"fall",shape:{icon:"mdi:leaf"},size:[10,16],spin:180,colors:["#f97316","#eab308","#a16207"]},fireflies:{direction:"drift",size:[3,6],colors:["#fde047"]},twinkle:{direction:"drift",shape:{emoji:"✨"},size:[8,14],layer:"front",speed:.5},"orbit-dots":{direction:"orbit",size:[6,8],spread:70,fade:!1},starfield:{direction:"fall",size:[2,4],colors:["#ffffff"],speed:1.5},"meteor-shower":{direction:"fall",size:[3,5],gravity:.6,colors:["#ffffff"]},bokeh:{direction:"drift",size:[16,32],speed:.4},smoke:{direction:"rise",size:[16,28],spread:70,speed:.6},"clouds-drift":{direction:"drift",shape:{icon:"mdi:cloud"},size:[24,40],colors:["#ffffff"],speed:.3},fireworks:{direction:"burst",size:[4,6],spread:80,colors:["#ef4444","#eab308","#3b82f6"]},"ripple-rings":{direction:"burst",size:[8,12],spread:90},"water-ripple":{direction:"burst",size:[8,12],spread:90},"wind-lines":{direction:"drift",size:[3,5],speed:1.5},drip:{direction:"fall",size:[4,7],gravity:.8,colors:["#4fc3f7"]}},yu=["fall","rise","drift","burst","orbit","spiral","fountain","explode","wave","vortex","zigzag","rain","wander"],xu={fall:319,rise:746,drift:271,burst:112,orbit:611,spiral:853,fountain:343,explode:311,wave:1069,vortex:909,zigzag:1080,rain:698,wander:328},_u=new Set(Ue),$u=new Set(["burst","orbit","spiral","explode","vortex"]),wu=[{id:"circle",label:147},{id:"square",label:864},{id:"triangle",label:1014},{id:"star",label:869},{id:"heart",label:361},{id:"ring",label:744},{id:"line",label:903},{id:"spark",label:845},{id:"icon",label:371,icon:"mdi:star-outline"},{id:"emoji",label:296,icon:"mdi:emoticon-outline"},{id:"svg",label:755,icon:"mdi:svg"}],ku=new Set(mo),Mu=e=>ku.has(e),Su=e=>{return"builtin"in e?e.builtin:(t=e)?"icon"in t?"icon":"emoji"in t?"emoji":"svg":"dot";var t},ju=e=>{const t=wu.find(t=>t.id===Su(e));return In(t?t.label:806)},Cu=Math.min(4,go.shapes),Au=200,zu={pspeed:{min:0,max:500,step:5},spin:{min:-3600,max:3600,step:15},delay:{min:0,max:60,step:.1},lifetime:{min:.1,max:60,step:.1},opacity:{min:0,max:100,step:5},seed:{min:0,max:4294967295,step:1},weight:{min:1,max:10,step:1},childCount:{min:1,max:go.childrenPerParent,step:1},childSize:{min:1,max:200,step:1},childLife:{min:.1,max:10,step:.1},angle:{min:0,max:359,step:1},wind:{min:-60,max:60,step:5},unit:{min:0,max:1,step:.05}},qu=new Set(["seed","weight","childCount","childSize","angle","opacity","spin","wind"]);function Eu(e,t){let i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;"angle"===e&&(i=(Math.round(i)%360+360)%360);const n=zu[e],s=pu(i,n.min,n.max);return qu.has(e)?Math.round(s):hu(s,.01)}const Hu=e=>e[0]>e[1]?[e[1],e[0]]:[e[0],e[1]],Lu=e=>e.duration/(e.particles?.speed||1);function Vu(e,t=Math.random){for(let i=0;i<8;i++){const i=Math.floor(4294967296*t())>>>0;if(i!==e)return i}return(e??0)+1>>>0}const Ou=e=>+e.toFixed(2);function Pu(e,t){const i=e.particles??Qe,n=Lu(e),s=Ou(($u.has(i.direction)?Math.max(10,i.spread):100)/n),r=Ou(i.spin/n);return{engine:1,mode:"baked",seed:t>>>0,flow:i.direction,shapes:i.shape?[{shape:i.shape,weight:1}]:[],ranges:{speed:[s,s],spin:[r,r],delay:[0,Ou(n)],lifetime:[Ou(n),Ou(n)],opacity:[1,1]},physics:{gravity:{angle:i.gravity<0?180:0,strength:Ou(Math.abs(i.gravity)*Au)},drag:0,turbulence:{strength:0,scale:25},bounce:.5},colliders:{floor:!1,ceiling:!1,left:!1,right:!1,content:"none"}}}const Ru=(e,t)=>e.particles?.sim??Pu(e,t),Du=e=>!!e.particles?.sim;function Nu(e){const t=e.strength/Au*Math.cos(e.angle*Math.PI/180);return pu(Math.round(100*t)/100,-1,1)||0}function Tu(e,t){const i=t.shapes.find(e=>!("builtin"in e.shape))?.shape,n=pu(Math.round(t.ranges.spin[1]*Lu(e)),uu.spin.min,uu.spin.max),s=gu(e,{sim:t,direction:uo[t.flow],gravity:Nu(t.physics.gravity),spin:n});return i?s.particles.shape=i:delete s.particles.shape,s}const Fu=(e,t,i)=>Tu(e,i(Ru(e,t))),Iu=e=>e.shapes.length?e.shapes:[{shape:{builtin:"circle"},weight:1}];function Bu(e,t){if(!Du(e)){const t=e.particles?.spin??0;return[t,t]}const i=Lu(e);return[Math.round(t.ranges.spin[0]*i),Math.round(t.ranges.spin[1]*i)]}function Zu(e,t,i,n){const s=Ou(pu(n,0,1));return!Du(e)&&(0===i||180===i&&s>0)?gu(e,{gravity:180===i?-s:s}):Fu(e,t,e=>({...e,physics:{...e.physics,gravity:{angle:i,strength:Ou(s*Au)}}}))}const Ku=(e,t,i)=>Fu(e,t,e=>({...e,seed:Vu(e.seed,i)}));function Wu(e,t){const i=e.reduce((e,t)=>e+t.weight,0);return i>0?5*Math.round((e[t]?.weight??0)/i*20):0}function Uu(e){const t=new Set(e.map(e=>Su(e.shape)));return{builtin:["star","heart","circle","spark","square","triangle","ring","line"].find(e=>!t.has(e))??"circle"}}const Gu=e=>e.floor||e.ceiling||e.left||e.right||"none"!==e.content;function Yu(e){return{trigger:Gu(e.colliders)?"collision":"death",count:6,shapes:[{shape:{builtin:"spark"},weight:1}],size:[2,4],colors:[],ranges:{speed:[30,60],lifetime:[.6,.6],opacity:[1,1],spin:[0,0]},cone:360,inherit:.2}}const Ju=[{angle:0,name:1097,icon:"mdi:arrow-down"},{angle:45,name:1098,icon:"mdi:arrow-bottom-left"},{angle:90,name:1113,icon:"mdi:arrow-left"},{angle:135,name:1145,icon:"mdi:arrow-top-left"},{angle:180,name:1144,icon:"mdi:arrow-up"},{angle:225,name:1146,icon:"mdi:arrow-top-right"},{angle:270,name:1127,icon:"mdi:arrow-right"},{angle:315,name:1099,icon:"mdi:arrow-bottom-right"}],Xu=e=>{const t=Ju.find(t=>t.angle===e);return t?In(t.name):In(1091,{angle:e})},Qu=e=>String(+e.toFixed(2)),em=(e,t="")=>e[0]===e[1]?`${Qu(e[0])}${t}`:In(1185,{from:Qu(e[0]),to:Qu(e[1]),unit:t}),tm=[{id:"floor",label:336},{id:"ceiling",label:127},{id:"left",label:412},{id:"right",label:743},{id:"content",label:180}],im=(e,t)=>"content"===t?"none"!==e.content:e[t];let nm;const sm=()=>nm;function rm(e,t=0){const i="particles"===e.kind?e.particles:void 0;if(i&&!i.preset)return{...i,sim:i.sim??Pu(e,t)}}const am=e=>1+(e.particles?.sim?.emitters?.length??0);function om(e){return(e.particles?.count??Qe.count)+(e.particles?.sim?.emitters??[]).reduce((e,t)=>e+t.count,0)}const lm=e=>Math.max(0,go.parents-om(e)),cm=e=>am(e)<go.emitters&&lm(e)>=1,dm=(e,t)=>e.layer??t;function pm(e,t){const i=e.particles??Qe,n=Ru(e,t);return[{id:n.id??"",...void 0!==n.name?{name:n.name}:{},layer:i.layer,seed:n.seed,count:i.count,size:[i.size[0],i.size[1]],colors:[...i.colors],fade:i.fade,spread:i.spread,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics,...n.children?{children:n.children}:{}},...(n.emitters??[]).map(e=>({...e,layer:dm(e,i.layer)}))]}function hm(e,t,i){const n=Ru(e,t),[s,...r]=i,a={...n,seed:s.seed,flow:s.flow,shapes:s.shapes,ranges:s.ranges,physics:s.physics};if(s.children?a.children=s.children:delete a.children,delete a.id,delete a.name,delete a.emitters,i.length>1){const e=new Set,t=i.map(t=>t.id&&!e.has(t.id)?(e.add(t.id),t.id):"").map(t=>{if(t)return t;let i=1;for(;e.has(`e${i}`);)i++;return e.add(`e${i}`),`e${i}`});a.id=t[0],s.name&&(a.name=s.name),a.emitters=r.map((e,i)=>{const{layer:n,name:r,...a}=e;return{...a,id:t[i+1],...r?{name:r}:{},...n!==s.layer?{layer:n}:{}}})}return Tu(gu(e,{count:s.count,size:s.size,colors:s.colors,fade:s.fade,spread:s.spread,layer:s.layer}),a)}const um=(e,t)=>Number.isInteger(t)&&t>=0&&t<am(e);function mm(e,t,i,n){if(!um(e,i)||am(e)<2)return e;const s=(e=>e.trim().slice(0,40).trim())(n),r=e.particles.sim;if((0===i?r.name:r.emitters[i-1].name)===(s||void 0))return e;const a=pm(e,t);return s?a[i].name=s:delete a[i].name,hm(e,t,a)}function gm(e,t){const i=e.particles??Qe;return t<=0?i.layer:dm(i.sim?.emitters?.[t-1]??{},i.layer)}function fm(e,t,i){if(i<=0||i>=am(e))return e;const n=pm(e,t)[i],s={...Ru(e,t),seed:n.seed,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics};return delete s.id,delete s.name,delete s.emitters,delete s.children,n.children&&(s.children=n.children),Tu(gu(e,{count:n.count,size:n.size,colors:n.colors,fade:n.fade,spread:n.spread,layer:n.layer}),s)}function vm(e,t,i,n){const s=fm(e,t,i);if(s===e)return n(e);const r=n(s);if(r===s)return e;const a=r.particles,o=a.sim,l=e.particles.sim,c=l.emitters.map((t,n)=>{if(n!==i-1)return t;const s={...t};return delete s.children,{...s,seed:o.seed,flow:o.flow,shapes:o.shapes,ranges:o.ranges,physics:o.physics,count:Math.max(1,Math.min(a.count,t.count+lm(e))),size:a.size,colors:a.colors,fade:a.fade,spread:a.spread,...o.children?{children:o.children}:{}}});return gu(e,{speed:a.speed,sim:{...l,mode:o.mode,colliders:o.colliders,emitters:c}})}function bm(e,t,i){const n=pm(e,t),s=n[i];if(s?.name)return s.name;if(n.length<2)return In(630);const r=/^e(\d+)$/.exec(s?.id??""),a=r?Number(r[1]):i+1;return a>1?In(636,{n:a}):In(630)}class ym extends z.WL{constructor(e){if(super(e),this.it=A.s6,e.type!==z.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===A.s6||null==e)return this._t=void 0,this.it=e;if(e===A.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}ym.directiveName="unsafeHTML",ym.resultType=1,(0,z.u$)(ym);class xm extends ym{}xm.directiveName="unsafeSVG",xm.resultType=2;const _m=(0,z.u$)(xm),$m=Object.freeze({kind:"svg",extensions:Object.freeze([".svg"]),mimeTypes:Object.freeze(["image/svg+xml"])}),wm=Object.freeze({types:Object.freeze([Object.freeze({...$m,maxBytes:32768})])});Object.freeze({types:Object.freeze([Object.freeze({...$m,maxBytes:8388608})])});const km=1048576,Mm=["path","circle","ellipse","rect","line","polyline","polygon"],Sm=/^(none|transparent)$/i,jm=/^(currentcolor|inherit|black|#0{3}|#0{6})$/i,Cm=e=>Object.is(e,-0)?"-0":String(e),Am=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),zm=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i,qm=/^(butt|round|square)$/,Em=/^(miter|round|bevel|arcs|miter-clip)$/;function Hm(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":zm.test(t)?t:"currentColor"}function Lm(e){const t=Ma(e)?Hm(e.fill)??"currentColor":"none";let i=` id="${Am(e.id)}" class="shape" d="${Am(e.d)}" fill="${Am(t)}"`;return Sa(e)&&(i+=` stroke="${Am(Hm(e.stroke)??"currentColor")}" stroke-width="${e.stroke_width??1}"`,e.linecap&&(i+=` stroke-linecap="${e.linecap}"`),i+=' stroke-linejoin="round"'),`<path${i}/>`}function Vm(e,t){const i=Ne(/^\s*<svg[\s>]/i.test(e)?e:`<svg viewBox="${t}">${e}</svg>`);return i.error?"":i.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}function Om(e){const t=e.accent?"mc-accent":"";if(!e.stroke)return e.evenodd?{cls:t,attrs:' fill="currentColor" fill-rule="evenodd"',key:`e${t}`}:{cls:t,attrs:' fill="currentColor"',key:`f${t}`};let i=` fill="none" stroke="currentColor" stroke-width="${+e.stroke.width.toFixed(3)}"`;return e.stroke.cap&&qm.test(e.stroke.cap)&&(i+=` stroke-linecap="${e.stroke.cap}"`),e.stroke.join&&Em.test(e.stroke.join)&&(i+=` stroke-linejoin="${e.stroke.join}"`),{cls:t,attrs:i,key:`s${t}${i}`}}function Pm(e,t,i){const n=new Map;for(const t of e){const e=Om(t),i=n.get(e.key)??{paint:e,d:[]};i.d.push(t.d),n.set(e.key,i)}const s=t?` id="${Am(t)}"`:"",r=[...n.values()],a=(e,t)=>{const n=[t?i:"",e.paint.cls].filter(Boolean).join(" ");return`<path${t?s:""}${n?` class="${n}"`:""} d="${Am(e.d.join(" "))}"${e.paint.attrs}/>`};return 1===r.length?a(r[0],!0):`<g${s} class="${i}">${r.map(e=>a(e,!1)).join("")}</g>`}const Rm={not_svg:"No <svg> element found.",empty:"The SVG has no shapes to draw.",too_detailed:"A shape in the SVG is too detailed (over 8192 characters of path data).",too_many:"The SVG has too many shapes; at most {room} fit."};function Dm(e){const t=_a(e);return!t||function(e){let t=0;for(const i of xa(e)){let e=0;for(let t=0,n=i.length-1;t<i.length;n=t++)e+=(i[n][0]+i[t][0])*(i[n][1]-i[t][1]);t+=Math.abs(e)/2}return t}(e)<.001*Math.max(t.w,t.h)}function Nm(e){if(void 0===e)return;const t=e.trim();return/^(none|transparent)$/i.test(t)?"none":it(t,"color")&&!/url\(/i.test(t)?t:"currentColor"}function Tm(e){return e?.svg?$a(Ne(e.svg).viewBox).join(" "):"0 0 24 24"}var Fm=i(2637);function Im(e){const t=/^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(e);if(t)return`[data-${"part"===t[1]?"p":"group"===t[1]?"g":"s"}="${t[2]}"]`}const Bm=e=>e.css.includes("stroke-dashoffset");function Zm(e){const t=new Map;for(const i of e.css.matchAll(/(-?[\d.]+)% \{([^}]*)\}/g)){const e=/stroke-dashoffset: (-?[\d.]+)/.exec(i[2]);e&&t.set(Number(i[1]),Number(e[1])<=.001?1:0)}const i=[...t].sort((e,t)=>e[0]-t[0]),n=[];return i.forEach(([e,t],s)=>{const r=i[s-1];r&&r[1]!==t&&n.push([+(r[0]+(e-r[0])*(t?.75:.25)).toFixed(2),0]),n.push([e,t])}),n}function Km(e){const t=Zm(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { fill-opacity: ${t}; }`);return`@keyframes ${e.name}-fill {\n${i.join("\n")}\n}`}function Wm(e){const t=Zm(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { stroke-opacity: ${1-t}; }`);return`@keyframes ${e.name}-outline {\n${i.join("\n")}\n}`}const Um=[".rig { color: var(--mc-rig-paint, var(--icon-primary-color, currentColor)); }",".rig .primary { fill: var(--mc-rig-fill, currentColor); }",".rig .outlines { stroke-opacity: 0; }",".rig [data-p], .rig [data-g], .rig [data-s] { transform-box: view-box; }",".rig .drawn { stroke-dasharray: 1; stroke-linecap: round; stroke-linejoin: round; }",".rig .outlines .drawn { stroke-linecap: butt; stroke-dasharray: 0.999 2; }","@media (prefers-reduced-motion: reduce) { .rig, .rig * { animation: none !important; } }"].join("\n");function Gm(e,t,i={}){const n=[Um];if(i.still)return n.join("\n");const s=i.timing||"1s ease 0s infinite normal",r=new Set([...t.parts.map(e=>`part:${e.id}`),...(t.groups??[]).map(e=>`group:${e.id}`),...(t.shapes??[]).map(e=>`shape:${e.id}`)]);for(const t of e){const e=Im(t.target);if(!e||!r.has(t.target)||!t.css)continue;const i=[t.name,...t.lanes??[]];n.push(t.css);const a=e=>`${e} ${s}`;if(Bm(t)){const s=Km(t);s&&(n.push(s,Wm(t)),i.push(`${t.name}-fill`),n.push(`.rig ${e} .outlines { animation: ${a(`${t.name}-outline`)}; }`)),n.push(`.rig ${e} { stroke: currentColor; }`,`.rig ${e} .primary, .rig ${e} .secondary { stroke: none; }`)}t.origin&&n.push(`.rig ${e} { transform-origin: ${t.origin} !important; }`),n.push(`.rig ${e} { animation: ${i.map(a).join(", ")}; }`)}return n.join("\n")}const Ym=e=>String(+e.toFixed(3)),Jm=e=>[e[0]+e[2]/2,e[1]+e[3]/2],Xm=e=>`transform-origin: ${Ym(e[0])}px ${Ym(e[1])}px`,Qm=e=>(0,de.Mj)(e).map(e=>(0,de.ER)([e])),eg=new Map;function tg(e,t){const i=`${t}|${e}`;let n=eg.get(i);if(void 0===n){const s=Ne(`<svg viewBox="${t}">${e}</svg>`);n=s.error?null:{markup:s.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""),box:(0,Fm.Zg)([...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].map(Fm.hd)),outlines:[...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].flatMap(Qm)},eg.size>100&&eg.clear(),eg.set(i,n)}return n??void 0}function ig(e,t,i="0 0 24 24"){return e.svg?tg(e.svg,i)?.box:(0,Fm.Zg)((e.from??[]).map(e=>t[e]?.bbox).filter(e=>!!e))}function ng(e,t,i="0 0 24 24"){const n=new Map,s=new Map;for(const r of e.parts){const e=ig(r,t,i);e&&s.set(r.id,e);const a=r.origin??(e?Jm(e):void 0);a&&n.set(`part:${r.id}`,a)}for(const t of e.groups??[]){const e=(0,Fm.Zg)(t.parts.map(e=>s.get(e)).filter(e=>!!e)),i=t.origin??(e?Jm(e):void 0);i&&n.set(`group:${t.id}`,i)}for(const t of e.shapes??[])n.set(`shape:${t.id}`,t.origin??Jm((0,Fm.hd)(t.d)));return n}const sg=e=>{if(!e)return;const t=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(e.trim());if(t){const e=void 0===t[1]?100:Math.min(100,Number(t[1]));return e>=100?"var(--mc-entity-color, currentColor)":`color-mix(in srgb, var(--mc-entity-color, currentColor) ${e}%, transparent)`}return it(e,"color")},rg=e=>Object.entries(e).filter(([,e])=>void 0!==e&&!1!==e&&""!==e).map(([e,t])=>` ${e}="${(e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"))(t)}"`).join("");new WeakMap,new Map,new Map,new WeakMap;const ag=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;function og(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":ag.test(t)?t:"currentColor"}const lg=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),cg=e=>String(+e.toFixed(4)),dg=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;function pg(e,t){const i=(e??"center").trim().split(/\s+/),n=(e,i)=>{const n=t[2+i],s=t[i];if(!e||"center"===e)return s+n/2;if("left"===e||"top"===e)return s;if("right"===e||"bottom"===e)return s+n;const r=parseFloat(e);return Number.isFinite(r)?e.endsWith("%")?s+n*r/100:s+r:s+n/2};let[s,r]=i;return"top"!==s&&"bottom"!==s&&("left"!==r&&"right"!==r||"center"!==s)||([s,r]=[r,s]),[n(s,0),n(r??"center",1)]}const hg={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function ug(e){const t=(I.find(t=>t.id===e)?.css??e??"ease").trim();if(/^steps\(/.test(t))return"steps";if(hg[t])return hg[t];const i=/^cubic-bezier\(([^)]*)\)$/.exec(t);if(i){const e=i[1].split(",").map(e=>Math.min(1,Math.max(0,Number(e))));if(4===e.length&&e.every(Number.isFinite))return e}return hg.ease}const mg={translate:"x",rotate:"rotate",scale:"scale",skewX:"skew",skewY:"skew",opacity:"opacity",color:"color",stroke:"stroke",draw:"draw"};function gg(e,t){const i=e.transform;switch(t){case"translate":return!i||void 0===i.x&&void 0===i.y?void 0:[i.x??0,i.y??0];case"rotate":return void 0!==i?.rotate?[i.rotate]:void 0;case"scale":if(!i||void 0===i.scale&&void 0===i.scale_x&&void 0===i.scale_y)return;return[(i.scale??1)*(i.scale_x??1),(i.scale??1)*(i.scale_y??1)];case"skewX":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_x??0];case"skewY":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_y??0];case"opacity":return void 0!==e.opacity?[e.opacity]:void 0;case"color":return e.color?og(e.color)??"currentColor":void 0;case"stroke":return e.stroke?og(e.stroke)??"currentColor":void 0;case"draw":return void 0!==e.draw?[1-e.draw]:void 0}}const fg=e=>"string"==typeof e?e:e.map(cg).join(" ");function vg(e){const t=e.easings.map(ug),i=` keyTimes="${e.times.map(cg).join(";")}"`;return t.some(e=>"steps"===e)?` calcMode="discrete"${i}`:` calcMode="spline"${i} keySplines="${t.map(e=>e.map(cg).join(" ")).join(";")}"`}const bg=e=>` dur="${cg(e)}s" repeatCount="indefinite" begin="0s"`;function yg(e,t,i,n){return`<animateTransform attributeName="transform" type="${e}" additive="sum" values="${t.values.map(e=>n(e)).join(";")}"${vg(t)}${bg(i)}/>`}function xg(e,t,i){return`<animate attributeName="${e}" values="${t.values.map(fg).join(";")}"${vg(t)}${bg(i)}/>`}function _g(e,t,i,n,s){const r=[],a=t=>function(e,t,i){const n=e.filter(e=>void 0!==gg(e,t));if(!n.length)return;const s=[],r=[],a=[],o=(e,t,i)=>{const n=Math.min(1,Math.max(0,e/100));if(s.length&&n<=s[s.length-1])return r[r.length-1]=t,void(a[a.length-1]=i);s.push(n),r.push(t),a.push(i)};n[0].at>0&&o(0,gg(n[0],t),"linear");for(const e of n)o(e.at,gg(e,t),e.easings?.[mg[t]]??e.easing??i);return s[s.length-1]<1&&o(100,r[r.length-1],"linear"),1===s.length&&(s.push(1),r.push(r[0]),a.push("linear")),a.pop(),{times:s,values:r,easings:a}}(e,t,n),o=a("translate"),l=[a("rotate"),a("scale"),a("skewX"),a("skewY")],c=l.some(Boolean),[d,p]=c?t:[0,0];if(s){const e=wn(s.d,32);if(e.length){const t={times:e.map(e=>e.t),values:e.map(e=>[e.x,e.y]),easings:e.slice(1).map(()=>"linear")};r.push(yg("translate",t,i,e=>`${cg(e[0])} ${cg(e[1])}`))}}o?r.push(yg("translate",o,i,e=>`${cg(e[0]+d)} ${cg(e[1]+p)}`)):c&&r.push(yg("translate",{times:[0,1],values:[[d,p],[d,p]],easings:["linear"]},i,e=>`${cg(e[0])} ${cg(e[1])}`));const[h,u,m,g]=l;h&&r.push(yg("rotate",h,i,e=>cg(e[0]))),u&&r.push(yg("scale",u,i,e=>`${cg(e[0])} ${cg(e[1])}`)),m&&r.push(yg("skewX",m,i,e=>cg(e[0]))),g&&r.push(yg("skewY",g,i,e=>cg(e[0]))),c&&r.push(yg("translate",{times:[0,1],values:[[-d,-p],[-d,-p]],easings:["linear"]},i,e=>`${cg(e[0])} ${cg(e[1])}`));const f=a("opacity");f&&r.push(xg("opacity",f,i));const v=a("color");v&&r.push(xg("color",v,i));const b=a("stroke");b&&r.push(xg("stroke",b,i));const y=a("draw");if(y){r.push(xg("stroke-dashoffset",y,i));const e=function(e){const t=e.times.map((t,i)=>[t,e.values[i][0]<=.001?1:0]),i=[],n=[];return t.forEach(([e,s],r)=>{const a=t[r-1];if(a&&a[1]!==s){const t=a[0]+(e-a[0])*(s?.75:.25);t>i[i.length-1]&&(i.push(t),n.push([0]))}(!i.length||e>i[i.length-1])&&(i.push(e),n.push([s]))}),{times:i,values:n,easings:i.slice(1).map(()=>"linear")}}(y);r.push(xg("fill-opacity",e,i)),r.push(xg("stroke-opacity",{...e,values:e.values.map(e=>[1-e[0]])},i))}return r.join("")}function $g(e,t,i){const n=/^(part|group|shape):(.+)$/.exec(t);if(!n||!i)return e;const s="part"===n[1]?"data-p":"group"===n[1]?"data-g":"data-s",r=new RegExp(`(<(g|path) ${s}="${n[2]}"[^>]*>)`);return e.replace(r,e=>`${e}${i}`)}function wg(e,t){const i=function(e,t){const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return;const n="part"===i[1]?"data-p":"group"===i[1]?"data-g":"data-s",s=new RegExp(`<(g|path) ${n}="${i[2]}"[^>]*>`).exec(e);if(!s)return;if("path"===s[1])return[s.index,e.indexOf("</path>",s.index)+7];const r=/<g\b[^>]*>|<\/g>/g;r.lastIndex=s.index+s[0].length;let a=1;for(let t=r.exec(e);t;t=r.exec(e))if(a+="</g>"===t[0]?-1:1,!a)return[s.index,t.index+4]}(e,t);if(!i)return e;const n=e.slice(i[0],i[1]).replace(/ class="(primary|secondary)"/g,' class="$1" stroke="none"');return e.slice(0,i[0])+n+e.slice(i[1])}function kg(e){const t=e=>{const t={...e};return delete t.at,delete t.easing,delete t.easings,JSON.stringify(t)};return e.every(i=>t(i)===t(e[0]))}const Mg=new Set(["name","state","background"]);const Sg=new Set(["svg","g","path","title","style","animate","animatetransform"]);var jg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Cg=e=>In(1250,{size:(e/1024).toFixed(e<10240?1:0)}),Ag=e=>(new TextEncoder).encode(e).length;function zg(e,t,i="image/svg+xml"){const n=URL.createObjectURL(new Blob([e],{type:i})),s=document.createElement("a");s.href=n,s.download=t,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}async function qg(e){const t=await async function(e,t){const i=function(e,t){const i=e.name.lastIndexOf("."),n=e.name.slice(i<0?e.name.length:i).toLowerCase(),s=t.types.find(e=>e.extensions.includes(n))??t.types.find(t=>t.mimeTypes.includes(e.type))??(t.other&&{kind:"other",...t.other});return s?e.size>s.maxBytes?{code:"too_large",maxBytes:s.maxBytes}:s:{code:"wrong_type"}}(e,t);if("code"in i)return{ok:!1,...i};try{return{ok:!0,text:await e.text(),kind:i.kind,bytes:e.size,name:e.name}}catch{return{ok:!1,code:"unreadable"}}}(e,wm);return t.ok?{text:t.text}:{error:"too_large"===t.code?In(921):"wrong_type"===t.code?In(144):In(940)}}let Eg=class extends n.WF{constructor(){super(...arguments),this.pieces=[],this.viewBox="0 0 24 24",this.disabled=!1,this._open=!1,this._mode="export",this._format="still",this._smil=!0,this._color="",this._text="",this._fileName="",this._status="",this._error="",this._over=!1,this._textSeq=0}openExport(e=!1){this._mode="export",this._format=e||this._isParticles?"animated":"still",this._manual=void 0,this._status="",this._error="",this._show()}openImport(e="",t=""){this._mode="import",this._text="",this._take(e),this._fileName=t,this._status="",this._error="",this._show()}close(){const e=this.renderRoot.querySelector("mc-ui-window");e?.open?e.close("action"):this._open=!1}get open(){return this._open}get _isParticles(){return"particles"===this.doc?.kind}get exportText(){return this._export().text}_export(){const e=this._exportMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox)return e;const t=this.doc?.rig??{parts:[]},i=function(e,t,i={}){const n=i.viewBox??Tm(e),s=new Map(t.map(e=>[e.index,e])),r=new Set,a=[],o=Ca(e.shapes??[]);for(const e of o)"under"===e.layer&&a.push(Lm(e));const l=[];for(const t of e.parts??[])if(t.svg){const e=Vm(t.svg,n);e&&l.push(`<g id="${Am(t.id)}" class="part" fill="currentColor">${e}</g>`)}else if(t.from?.length){const e=t.from.map(e=>(r.add(e),s.get(e))).filter(e=>!!e);e.length&&l.push(Pm(e,t.id,"part"))}const c=t.filter(e=>!r.has(e.index));c.length&&a.push(Pm(c,void 0,"base")),a.push(...l);for(const e of o)"under"!==e.layer&&a.push(Lm(e));return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${Am(n)}">\n${a.map(e=>`  ${e}`).join("\n")}\n</svg>`}(t,this.pieces,{viewBox:t.svg?void 0:this.viewBox}),n=(a=r=i,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(a).length:a.length)>Me?"The SVG is larger than 32 KB.":/<path|<g/.test(r)?Ne(r).error:"Nothing to save yet: draw a shape or use an icon."),s=n?"":Ne(i).markup;var r,a;return this._exportMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,text:i,error:n,clean:s},this._exportMemo}_animated(){const e=this._animMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox&&e.smil===this._smil&&e.color===this._color)return e;const t=this.doc?this._isParticles?function(e){const t=nm;if(!t)return{svg:"",warnings:[In(960)]};const i=rm(e);if(!i)return{svg:"",warnings:[In(181)]};const n=t.bake({spec:i,period:Lu(e),geometry:fo}),s=[];return"live"===i.sim.mode&&s.push(In(422)),n.elements.some(e=>"icon"in e.shape||"emoji"in e.shape)&&s.push(In(372)),n.stats.capped&&s.push(In(954)),{svg:t.bakedSvg(n,{width:200,height:Math.round(200/fo.aspect)}),warnings:s}}(this.doc):function(e,t,i={}){const n=[],s=ft(e,{v2:"lenient"});if(!s.ok)return{svg:"",warnings:[In(925,{message:s.errors[0]?.message??In(1143)})]};const r=s.doc;if("keyframes"!==r.kind)return{svg:"",warnings:[In(602)]};r.clips?.length&&n.push(In(888)),r.bindings?.length&&n.push(In(1066)),"infinite"!==r.iterations&&n.push(In(942)),r.tracks?.some(e=>Mg.has(e.target))&&n.push(In(1012));const a=!1!==i.smil;a&&r.direction&&"normal"!==r.direction&&n.push(In(918)),a&&[...r.keyframes??[],...(r.tracks??[]).flatMap(e=>e.keyframes)].some(e=>e.transform?.axis)&&n.push("3D turns play flat in the SMIL fallback.");const o=t.viewBox||"0 0 24 24",l=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(o),c=(0,Fm.WP)(t),d=r.rig??{parts:[]},p=Fn(r),h=function(e){return new Set(e.filter(e=>Im(e.target)&&Bm(e)).map(e=>e.target))}(p);let u=function(e,t,i={}){const n=i.viewBox??"0 0 24 24",s=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(n),r=i.drawn??new Set,a=ng(e,t,n),o=Ym(s[2]/24*1.2),l=new Set(e.parts.flatMap(e=>e.from??[])),c=new Map;for(const t of e.groups??[])for(const e of t.parts)c.has(e)||c.set(e,t.id);const d=(e,t=!1)=>e.stroke?(t?Qm(e.d):[e.d]).map(i=>`<path${rg({class:t&&"drawn",d:i,fill:"none",stroke:"currentColor","stroke-width":Ym(e.stroke.width),"stroke-linecap":e.stroke.cap,"stroke-linejoin":e.stroke.join,pathLength:t&&"1"})}></path>`).join(""):`<path${rg({class:e.secondary?"secondary":"primary",d:e.d,"fill-rule":e.evenodd&&"evenodd"})}></path>`,p=e=>e.length?`<g class="outlines">${e.map(e=>`<path${rg({class:"drawn",d:e,fill:"none",pathLength:"1","stroke-width":o})}></path>`).join("")}</g>`:"";let h=!1;const u=(e,i)=>{const s=i||r.has(`part:${e.id}`),o=a.get(`part:${e.id}`),l=`<g${rg({"data-p":e.id,style:o&&Xm(o)})}>`;if(e.svg){const t=tg(e.svg,n);return t?(h=!0,`${l}${t.markup}${s?p(t.outlines):""}</g>`):""}const c=(e.from??[]).map(e=>t[e]).filter(e=>!!e);if(!c.length)return"";h=!0;const u=c.filter(e=>!e.stroke);return`${l}${c.map(e=>d(e,s)).join("")}${s?p(u.flatMap(e=>Qm(e.d))):""}</g>`},m=new Set;let g="";for(const t of e.parts){const i=c.get(t.id);if(!i){g+=u(t,!1);continue}if(m.has(i))continue;m.add(i);const n=r.has(`group:${i}`),s=e.parts.filter(e=>c.get(e.id)===i).map(e=>u(e,n)).join(""),o=a.get(`group:${i}`);g+=`<g${rg({"data-g":i,style:o&&Xm(o)})}>${s}</g>`}const f=e.shapes??[],v=e=>f.filter(t=>t.layer===e).map(e=>function(e,t,i){const n=sg(e.fill)??(e.stroke?"none":"currentColor"),s=sg(e.stroke),r=[`fill: ${n}`,s?`stroke: ${s}`:"",t?Xm(t):""].filter(Boolean).join("; ");return`<path${rg({"data-s":e.id,class:i&&"drawn",d:e.d,pathLength:i&&"1","stroke-width":e.stroke_width??(i||s?1:void 0),"stroke-linecap":e.linecap,style:r})}></path>`}(e,a.get(`shape:${e.id}`),r.has(`shape:${e.id}`))).join("");if(!h&&!f.length)return;const b=t.filter(e=>!l.has(e.index)).map(e=>d(e)).join("");return`<g class="rig">${v("under")}${b}${g}${v("over")}</g>`}(d,c,{viewBox:o,drawn:h});if(u||(u=`<g class="rig">${c.map(e=>`<path class="${e.secondary?"secondary":"primary"}" d="${lg(e.d)}"${e.evenodd?' fill-rule="evenodd"':""}></path>`).join("")}</g>`),!c.length&&!d.shapes?.length)return{svg:"",warnings:[...n,In(945)]};const m=r.duration,g=`${cg(m)}s ${un(r.easing)} 0s infinite ${r.direction??"normal"}`,f=i.color?it(i.color,"color"):void 0;i.color&&!f&&n.push(In(934));const v=f?og(f)??"currentColor":void 0,b=`mc-a-${dn(`${u}|${JSON.stringify(r)}|${a}|${f??""}`)}`,y=pn(r),x=mn(r.id),_=r.origin||"center",$=[],w=(e,t,i,n)=>{if(kg(i))return;const s=xn(t,i,x);$.push(s.css,`.${b} .mc-css .${e} { transform-box: view-box; transform-origin: ${n??_}; animation: ${[t,...s.lanes].map(e=>`${e} ${g}`).join(", ")}; }`)},k=r.tracks?.find(e=>"element"===e.target),M=r.tracks?.find(e=>"icon"===e.target);w("mc-el",`${y}-el`,r.keyframes??[]),w("mc-et",`${y}-et`,k?.keyframes??[],k?.origin),w("mc-it",`${y}-it`,M?.keyframes??[],M?.origin);const S=[`.${b} { --mc-anim-c: ${f??"currentColor"};${f?` color: ${f};`:""} }`,...a?[`.${b} .mc-css { visibility: visible; }`,`.${b} .mc-smil { display: none; }`]:[],(C=Gm(p,d,{timing:g}),C.replace(/(^|[\s,{])\.rig\b/g,`$1.${b} .mc-css .rig`)),...$,...$.length?[`@media (prefers-reduced-motion: reduce) { .${b} .mc-el, .${b} .mc-et, .${b} .mc-it { animation: none !important; } }`]:[]].join("\n"),j=[];var C,A;if(j.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${lg(l.join(" "))}" class="mc-anim ${b}"${v?` color="${lg(v)}"`:""}>`),j.push(`<title>${lg(r.name)}</title>`),j.push(`<style>\n${S}\n</style>`),j.push(`<g class="mc-css"${a?' visibility="hidden"':""}>${A=u,`<g class="mc-el"><g class="mc-et"><g class="mc-it">${A}</g></g></g>`}</g>`),a){let e=u.replace(/ style="([^"]*)"/g,(e,t)=>t.split(";").map(e=>e.trim()).filter(Boolean).map(e=>{const[t,...i]=e.split(":"),n=t.trim(),s=i.join(":").trim();return"fill"===n||"stroke"===n?` ${n}="${lg("none"===s?"none":og(s)??"currentColor")}"`:""}).join("")).replace(/ class="drawn"/g,' class="drawn" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"').replace(/<g class="outlines">[\s\S]*?<\/g>/g,e=>e.replace(/stroke-linecap="round"/g,'stroke-linecap="butt"').replace(/stroke-dasharray="1"/g,'stroke-dasharray="0.999 2"')).replace(/<g class="outlines">/g,'<g class="outlines" stroke="currentColor">').replace(/<g class="rig">/,'<g class="rig" fill="currentColor">');const t=ng(d,c,o),i=[0,0,l[2],l[3]];for(const n of r.tracks??[])/^(part|group|shape):/.test(n.target)&&(h.has(n.target)&&(e=wg(e,n.target)),e=$g(e,n.target,_g(n.keyframes,n.origin?pg(n.origin,i):t.get(n.target)??pg("center",l),m,r.easing,n.path)));const n=pg(_,l),s=(e,t,i)=>{const n=e&&!kg(e)?_g(e,t,m,r.easing):"";return n?`<g>${n}${i}</g>`:i};e=s(M?.keyframes,M?.origin?pg(M.origin,l):n,e),e=s(k?.keyframes,k?.origin?pg(k.origin,l):n,e),e=s(r.keyframes,n,e),j.push(`<g class="mc-smil">${e}</g>`)}j.push("</svg>");const z=j.join("\n");return dg(z)>262144&&n.push(In(941,{size:Math.round(dg(z)/1024)})),{svg:z,warnings:n}}(this.doc,function(e,t="0 0 24 24"){const i=e=>!(!e.accent&&!e.secondary),n=e.filter(e=>!e.stroke&&!i(e)),s=e.filter(e=>!e.stroke&&i(e)),r=e.filter(e=>e.stroke),a=e=>e.map((e,t)=>e.evenodd?t:-1).filter(e=>e>=0),o={paths:a(n),accent:a(s)};return{paths:n.map(e=>e.d),viewBox:t,...s.length?{secondary:s.map(e=>e.d)}:{},...r.length?{strokes:r.map(e=>({d:e.d,width:e.stroke.width,...e.stroke.cap?{cap:e.stroke.cap}:{},...e.stroke.join?{join:e.stroke.join}:{},...i(e)?{accent:!0}:{}}))}:{},...o.paths.length||o.accent.length?{evenodd:o}:{}}}(this.pieces,this.viewBox),{smil:this._smil,...this._color?{color:this._color}:{}}):{svg:"",warnings:[]},i=t.svg?function(e){if(/<script|<foreignobject|<iframe|<image|<use|<!entity|<!doctype/i.test(e))return In(177);if(/\son[a-z]+\s*=/i.test(e))return In(178);if(/\shref\s*=|xlink:/i.test(e))return In(176);if(/url\(\s*['"]?(?!#)/i.test(e)||/@import|javascript:|expression\s*\(/i.test(e))return In(179);for(const t of e.matchAll(/<([a-zA-Z][\w-]*)/g))if(!Sg.has(t[1].toLowerCase()))return In(1030,{element:t[1]});let t=e.replace(/<style>[\s\S]*?<\/style>/g,"").replace(/<animate(Transform)?\b[^>]*\/>/g,"");dg(t)>Me&&t.includes('<g class="mc-smil">')&&(t=`${t.slice(0,t.indexOf('<g class="mc-smil">'))}</svg>`);const i=Ne(t);return i.error?i.error:i.paths.length||i.strokes.length||i.accentPaths.length?void 0:In(588)}(t.svg):t.warnings[0]??In(591),n=t.svg?t.warnings:t.warnings.slice(1),s="function"==typeof getComputedStyle?getComputedStyle(this).getPropertyValue("--state-icon-color").trim():"",r=/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(s)?s:"#44739e",a=this._color?t.svg:t.svg.replace('class="mc-anim ',`color="${r}" class="mc-anim `),o=t.svg&&!i?`data:image/svg+xml;charset=utf-8,${encodeURIComponent(a)}`:"";return this._animMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,smil:this._smil,color:this._color,text:t.svg,warnings:n,error:i,url:o},this._animMemo}_ready(){return this._cssLoad??=(async()=>{let e;try{const t=await Promise.race([i.e(417).then(()=>i(8844)),new Promise(t=>{e=setTimeout(t,1e4,void 0)})]);return t?"2026.10.12-beta.13"!==t.BUILD?void console.warn("Magic Card was updated, reload the page (magic-card-svg-css.js)"):t.resolveCss:void console.warn("Magic Card: magic-card-svg-css.js did not load")}catch{return void console.warn("Magic Card: magic-card-svg-css.js did not load")}finally{clearTimeout(e)}})().then(e=>{this._css=e})}_take(e){const t=++this._textSeq,i=()=>{t===this._textSeq&&(this._text=e)};if(!e)return i(),Promise.resolve();const n=this._ready().then(i);return this._taking=n,n}async getUpdateComplete(){return await this._taking,super.getUpdateComplete()}_sourceError(){return this._srcMemo?.text!==this._text&&(this._srcMemo={text:this._text,error:Ne(this._text,{css:this._css}).error}),this._srcMemo.error}async _copy(e,t,i){const n=await async function(e,t){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.style.cssText="position:fixed;left:-9999px;top:0;opacity:0",(t??document.body).appendChild(i),i.select();const n=document.execCommand("copy");return i.remove(),n}catch{return!1}}(e,this.renderRoot.querySelector("mc-ui-window"));n?(this._manual=void 0,this._status=i):(this._manual={label:t,text:e},this._status=In(187))}async _show(){const e=cd()??void 0;this._open=!0,await this.updateComplete;const t=this.renderRoot.querySelector("mc-ui-window");t&&!t.open&&(t.opener=e,t.show())}updated(e){if(e.has("_manual")&&this._manual){const e=this.renderRoot.querySelector("textarea.manual");e?.focus(),e?.select()}if(e.has("_status")&&this._status){const e=this._status;setTimeout(()=>{this._status===e&&(this._status="")},2500)}}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_imported(){if(!this._text||!this.doc)return;const e=this._importMemo;if(e&&e.text===this._text&&e.doc===this.doc&&e.viewBox===this.viewBox)return e.r;const t=Ui-(this.doc.rig?.shapes?.length??0),i=function(e,t,i=[],n=48,s){const r=Ne(e,{css:s});if(r.error)return{error:r.error};const a=wa(r.viewBox,t),o=function(e,t){const i="undefined"==typeof DOMParser?void 0:(new DOMParser).parseFromString(e,"image/svg+xml").documentElement;if(!i||"svg"!==i.localName)return{ok:!1,error:"not_svg"};const n=Math.min(t.maxShapes??1e4,1e4),s=Math.min(t.maxPathChars??km,km),r={transforms:!1,colours:!1,opacity:!1,mergedGroups:!1},a=[],o=[];let l,c=0;const d=e=>(void 0!==t.paint?.(e)||Sm.test(e)||jm.test(e)||(r.colours=!0),e),p=(e,t)=>{const i=t=>e.getAttribute(t)?.trim(),n={...t},s=i("fill");void 0!==s&&(n.fill=d(s));const a=i("stroke");void 0!==a&&(n.stroke=d(a));const o=parseFloat(i("stroke-width")??"");Number.isFinite(o)&&o>=0&&(n.width=o);const l=i("stroke-linecap");"butt"!==l&&"round"!==l&&"square"!==l||(n.cap=l);const c=i("stroke-linejoin");"miter"!==c&&"round"!==c&&"bevel"!==c||(n.join=c);const p=i("fill-rule");"evenodd"!==p&&"nonzero"!==p||(n.evenodd="evenodd"===p),(i("class")??"").split(/\s+/).includes("mc-accent")&&(n.accent=!0),(i("opacity")||i("fill-opacity")||i("stroke-opacity"))&&(r.opacity=!0);const h=parseFloat(i("opacity")??"");return Number.isFinite(h)&&(n.opacity=(n.opacity??1)*Math.min(Math.max(h,0),1)),n},h=(e,i,d,u,m)=>{const g=e.localName.toLowerCase(),f=Mm.find(e=>e===g);if(l||!f&&"g"!==g&&"svg"!==g)return;const v=e.getAttribute("transform");v&&(r.transforms=!0);const b=v?$e(i,we(v)):i,y=p(e,d);if("g"===g){let i=u,n=m;if(t.keepGroups)if(m<4){const t=e.getAttribute("id");o.push({...void 0===u?{}:{parent:u},...t?{id:t}:{}}),i=o.length-1,n++}else r.mergedGroups=!0;for(const t of e.children)h(t,b,y,i,n);return}if(!f)return;const x=ke(e,g);if(!x)return;if(a.length>=n)return void(l="too_many");const _=function(e,t){const i=e=>`${Cm(t[0]*e[0]+t[2]*e[1]+t[4])} ${Cm(t[1]*e[0]+t[3]*e[1]+t[5])}`;return(0,de.Rr)(e).map(e=>`M${i(e.start)}${e.segs.map(e=>e.c1&&e.c2?`C${i(e.c1)} ${i(e.c2)} ${i(e.to)}`:`L${i(e.to)}`).join("")}${e.closed?"Z":""}`).join("")}(x,b);if(!_)return;if(c+=_.length,c>s)return void(l="too_detailed");const $=e.getAttribute("id"),w={from:f,d:_,fill:y.fill,stroke:y.stroke,strokeWidth:y.width*Math.sqrt(Math.abs(b[0]*b[3]-b[1]*b[2])),cap:y.cap,join:y.join,evenodd:y.evenodd,opacity:y.opacity,accent:y.accent,group:u,...$?{id:$}:{}};a.push(t.each?t.each(e,w):w)},u=we(i.getAttribute("transform"));i.getAttribute("transform")&&(r.transforms=!0);const m=t.matrix?$e(t.matrix,u):u,g=p(i,{width:1,accent:!1});for(const e of i.children)h(e,m,g,void 0,0);return l?{ok:!1,error:l}:a.length?{ok:!0,shapes:a,groups:o,viewBox:t.viewBox,notes:r}:{ok:!1,error:"empty"}}(r.markup,{viewBox:t,keepGroups:!1,maxShapes:n,maxPathChars:Math.min(n*Je,km),matrix:[a.k,0,0,a.k,a.dx,a.dy]});if(!o.ok)return{error:Rm[o.error].replace("{room}",String(n))};const l=new Set(i),c=[];for(const e of o.shapes){const t=va(e.d,e=>e);if(t.length>Je)return{error:Rm.too_detailed};if(!t)continue;const i=e.id??"",n=Gi.test(i)&&!l.has(i)?i:Ea([...l],"shape");l.add(n);const s={id:n,name:i&&Gi.test(i)?i:`Shape ${c.length+1}`,d:t,layer:"over"},r="line"===e.from?"none":Nm(e.fill)??"currentColor",o=Nm(e.stroke),d=e.strokeWidth??1;o&&"none"!==o?(s.stroke=o,s.stroke_width=Math.round(1e3*d)/1e3,"round"!==e.cap&&"butt"!==e.cap&&"square"!==e.cap||(s.linecap=e.cap),"none"!==r&&(s.fill=r)):"none"===r||Dm(t)?(s.stroke="currentColor",s.stroke_width=Math.round(1e3*Math.max(a.k,.05))/1e3):s.fill=r,c.push(s)}return c}(this._text,this.viewBox,Va(this.doc),t,this._css);return this._importMemo={text:this._text,doc:this.doc,viewBox:this.viewBox,r:i},i}async _pick(e){const t=e.target,i=t.files?.[0];t.value="",i&&await this._takeFile(i)}async _takeFile(e){const t=await qg(e);if("error"in t)return this._error=is(t.error),void this._take("");this._error="",this._fileName=e.name,await this._take(t.text)}_drop(e){e.preventDefault(),this._over=!1;const t=e.dataTransfer?.files?.[0];t&&this._takeFile(t)}_addShapes(e){if(!this.doc)return;let t=this.doc;for(const i of e)t=t&&Oa(t,i);if(!t)return void(this._error=In(1249,{shapes:Ui}));const i=Ha(t);i?this._error=i:(this._emit(t,In(1177,{count:e.length})),this.close())}_useAsIcon(){if(!this.doc)return;const e=function(e,t,i,n){const s=Ne(t,{css:n});if(s.error)return{error:s.error};const r=e.rig??{parts:[]},a=$a(i??Tm(r)).join(" "),o=$a(s.viewBox).join(" "),l=wa(a,o),c=a===o,d=e=>{return e.origin?{...e,origin:(t=e.origin,t&&!c?[Math.round(100*(t[0]*l.k+l.dx))/100,Math.round(100*(t[1]*l.k+l.dy))/100]:t)}:e;var t},p=e=>String(Math.round(1e4*e)/1e4),h=(r.parts??[]).filter(e=>!e.from).map(e=>d(c||!e.svg?e:{...e,svg:`<g transform="matrix(${p(l.k)} 0 0 ${p(l.k)} ${p(l.dx)} ${p(l.dy)})">${e.svg}</g>`})),u=r.shapes?.map(e=>c?e:d({...e,d:va(e.d,e=>[e[0]*l.k+l.dx,e[1]*l.k+l.dy]),...void 0!==e.stroke_width?{stroke_width:Math.round(e.stroke_width*l.k*1e3)/1e3}:{}})),m=new Set(h.map(e=>e.id)),g=(r.groups??[]).map(e=>d({...e,parts:e.parts.filter(e=>m.has(e))})).filter(e=>e.parts.length),f=new Set([...(r.parts??[]).filter(e=>!m.has(e.id)).map(e=>`part:${e.id}`),...(r.groups??[]).filter(e=>!g.some(t=>t.id===e.id)).map(e=>`group:${e.id}`)]),v={...r,svg:s.markup,parts:h,...r.groups?{groups:g}:{},...u?{shapes:u}:{}};delete v.icon;const b={...e,rig:v};return e.tracks&&(b.tracks=e.tracks.filter(e=>!f.has(e.target)).map(e=>e.path&&!c&&/^(part|group|shape):/.test(e.target)?{...e,path:{...e.path,d:va(e.path.d,e=>[e[0]*l.k,e[1]*l.k])}}:e)),e.bindings&&(b.bindings=e.bindings.filter(e=>!f.has(e.target))),b}(this.doc,this._text,this.viewBox,this._css);if("error"in e)return void(this._error=is(e.error));const t=Ha(e);t?this._error=t:(this._emit(e,"Use SVG as icon"),this.close())}_shapesPreview(e,t){return n.qy`<svg viewBox=${t} aria-hidden="true">
      ${Ca(e).map(e=>n.JW`<path d=${e.d} fill=${Ma(e)?e.fill&&!/^entity|var\(/.test(e.fill)?e.fill:"currentColor":"none"}
            stroke=${Sa(e)?/^entity|var\(/.test(e.stroke)?"currentColor":e.stroke:"none"}
            stroke-width=${e.stroke_width??1} stroke-linecap=${e.linecap??"butt"} stroke-linejoin="round"></path>`)}
    </svg>`}_renderFormat(){const e=[["still",In(371),"mdi:image-outline"],["animated",In(63),"mdi:motion-play-outline"]];return n.qy`<div class="format">${kd({role:"radiogroup",label:In(1073),full:!0,value:this._format,items:e.map(([e,t,i])=>({value:e,label:t,icon:i})),onChange:e=>{this._format=e,this._status="",this._manual=void 0}})}</div>`}_renderManual(){return this._manual?n.qy`<div class="field">
          <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
          <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
        </div>`:n.s6}_renderAnimated(){const{text:e,warnings:t,error:i,url:s}=this._animated(),r=Ag(e);return n.qy`
      <div class="body">
        ${this._isParticles?n.s6:this._renderFormat()}
        <div class="top">
          <div class="preview">${s?n.qy`<img class="anim" src=${s} alt="" />`:n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this._isParticles?In(17):In(16)}</span>
            <span class="muted">${Cg(r)}${r>262144?In(4):""}</span>
            ${this._isParticles?n.qy`<span class="muted">${In(109)}</span>`:n.qy`<span class="muted">${In(110)}</span>
            <div class="color-row">
              <label class="check">
                <input type="color" class="color" .value=${this._color||"#03a9f4"} @input=${e=>this._color=e.target.value} />
                ${this._color?n.qy`${In(166)} <span class="mono">${this._color}</span>`:In(172)}
              </label>
              ${this._color?n.qy`<button type="button" class="btn btn-text btn-sm color-reset" @click=${()=>this._color=""}>${In(1050)}</button>`:n.qy`<span class="muted">${In(90)}</span>`}
            </div>
            <label class="check">
              <input type="checkbox" class="smil" .checked=${this._smil} @change=${e=>this._smil=e.target.checked} />
              ${In(754)}
            </label>
            `}
            ${t.length?n.qy`<ul class="warn">${t.map(e=>n.qy`<li>${e}</li>`)}</ul>`:n.s6}
            ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-anim-code">${In(63)}</label></div>
          <textarea id="svg-anim-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._renderManual()}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!i} @click=${()=>this._copy(e,In(758),In(64))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${In(186)}
        </button>
        <button
          type="button"
          class="btn btn-primary download"
          ?disabled=${!!i}
          @click=${()=>{zg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}-animated.svg`),this._status=In(247)}}
        >
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${In(246)}
        </button>
      </div>
    `}_renderExport(){if("animated"===this._format)return this._renderAnimated();const{text:e,error:t,clean:i}=this._export(),s=Ag(e),r=this.doc?.rig?.parts?.length??0,a=this.doc?.rig?.shapes?.length??0,o=Math.min(100,s/Me*100);return n.qy`
      <div class="body">
        ${this._renderFormat()}
        <div class="top">
          <div class="preview">${i?_m(i):n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this.pieces.length?In(1241,{parts:r,shapes:a}):In(1242,{parts:r,shapes:a})}</span>
            <span class="muted">${In(1189,{kb:Cg(s)})}</span>
            <div class="meter ${s>Me?"over":""}" role="meter" aria-label=${In(825)} aria-valuemin="0" aria-valuemax=${Me} aria-valuenow=${s}>
              <i style="width:${o}%"></i>
            </div>
            <span class="muted">${In(944)}</span>
            ${t?n.qy`<p class="error" role="alert">${t}</p>`:n.s6}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-code">SVG</label></div>
          <textarea id="svg-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._manual?n.qy`<div class="field">
              <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
              <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
            </div>`:n.s6}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!t} @click=${()=>this._copy(e,In(758),In(756))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${In(186)}
        </button>
        <button type="button" class="btn btn-secondary download" ?disabled=${!!t} @click=${()=>{zg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}.svg`),this._status=In(247)}}>
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${In(246)}
        </button>
        <button
          type="button"
          class="btn btn-primary use"
          ?disabled=${!!t}
          title=${In(183)}
          @click=${()=>this._copy(`icon: svg\nsvg: |\n${e.replace(/\r\n?/g,"\n").trim().split("\n").map(e=>`  ${e}`).join("\n")}\n`,In(120),In(119))}
        >
          <ha-icon icon="mdi:card-text-outline"></ha-icon>${In(1052)}
        </button>
      </div>
    `}_renderImport(){const e=this._imported(),t=e&&!("error"in e)?e:void 0,i=this._error||(e&&"error"in e?is(e.error):"");return n.qy`
      <div class="body">
        ${this._text?n.qy`<div class="top">
              <div class="preview">${t?this._shapesPreview(t,this.viewBox):n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
              <div class="facts">
                <span>${this._fileName||"SVG"}</span>
                ${t?n.qy`<span class="muted">${In(1166,{count:t.length})}</span>`:n.s6}
                <span class="muted">${In(38)}</span>
                ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
              </div>
            </div>`:n.qy`<div
              class="drop ${this._over?"over":""}"
              @dragover=${e=>{e.preventDefault(),this._over=!0}}
              @dragleave=${()=>this._over=!1}
              @drop=${e=>this._drop(e)}
            >
              <ha-icon icon="mdi:file-upload-outline"></ha-icon>
              <span>${In(273)}</span>
              <label class="btn btn-secondary">
                ${In(146)}
                <input type="file" accept=".svg,image/svg+xml" class="sr-only" @change=${e=>this._pick(e)} />
              </label>
              ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
            </div>`}
      </div>
      <div slot="footer" class="foot">
        ${this._text?n.qy`<button type="button" class="btn btn-text again" @click=${()=>{this._take("")}}>${In(145)}</button><span class="grow"></span>`:n.qy`<span class="grow"></span>`}
        <button type="button" class="btn btn-secondary use-icon" ?disabled=${!this._text||!!this._sourceError()} @click=${()=>this._useAsIcon()}>
          <ha-icon icon="mdi:star-four-points-outline"></ha-icon>${In(1048)}
        </button>
        <button type="button" class="btn btn-primary add" ?disabled=${!t} @click=${()=>t&&this._addShapes(t)}>
          <ha-icon icon="mdi:shape-plus-outline"></ha-icon>${In(26)}
        </button>
      </div>
    `}render(){return this._open?dd({heading:"import"===this._mode?In(382):this._isParticles?In(63):In(762),size:"m",onClose:()=>{this._open=!1,this._status=""}},"export"===this._mode?this._renderExport():this._renderImport()):n.s6}};Eg.styles=[Ip,n.AH`
      :host {
        display: contents;
      }
      /* the window brings the frame, header and footer row; what is slotted in is a grid */
      .body {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .foot {
        display: contents;
      }
      .foot .grow {
        flex: 1;
      }
      .top {
        display: grid;
        grid-template-columns: 120px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .preview {
        width: 120px;
        height: 120px;
        box-sizing: border-box;
        border-radius: 12px;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        display: grid;
        place-items: center;
        color: var(--state-icon-color, #44739e);
        background-color: color-mix(in srgb, var(--primary-text-color, #212121) 4%, var(--card-background-color, #fff));
        background-image: radial-gradient(color-mix(in srgb, var(--primary-text-color, #212121) 14%, transparent) 1px, transparent 1px);
        background-size: 12px 12px;
      }
      .preview img.anim {
        width: 88px;
        height: 88px;
      }
      .check {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        font-size: 0.875rem;
        cursor: pointer;
      }
      .color-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 12px;
      }
      .color-row .muted {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
      .check input[type='color'] {
        width: 28px;
        height: 28px;
        padding: 0;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        border-radius: 6px;
        background: none;
      }
      .check input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--primary-color, #03a9f4);
      }
      .warn {
        margin: 0;
        padding-left: 18px;
        font-size: 0.8125rem;
        color: color-mix(in srgb, var(--warning-color, #ff9800) 65%, var(--primary-text-color, #212121));
      }
      .preview svg {
        width: 88px;
        height: 88px;
        overflow: visible;
      }
      .facts {
        display: grid;
        gap: 6px;
        font-size: 0.875rem;
      }
      .facts .muted {
        color: var(--secondary-text-color, #5f6368);
        font-size: 0.8125rem;
      }
      .meter {
        height: 6px;
        border-radius: 3px;
        background: var(--secondary-background-color, #f2f3f5);
        overflow: hidden;
      }
      .meter i {
        display: block;
        height: 100%;
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .meter.over i {
        background: var(--error-color, #db4437);
      }
      textarea.code {
        width: 100%;
        box-sizing: border-box;
        min-height: 120px;
        max-height: 200px;
        resize: vertical;
        font: 0.8125rem/1.5 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
        padding: 8px 12px;
        border-radius: 8px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color, #212121) 40%, transparent);
        background: var(--card-background-color, #fff);
        color: inherit;
      }
      .status {
        min-height: 1.2em;
        margin: 0;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        align-self: center;
      }
      .error {
        margin: 0;
        color: color-mix(in srgb, var(--error-color, #db4437) 80%, var(--primary-text-color, #212121));
        font-size: 0.8125rem;
      }
      .drop {
        display: grid;
        place-items: center;
        gap: 8px;
        min-height: 140px;
        padding: 16px;
        border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.24));
        border-radius: 12px;
        text-align: center;
        color: var(--secondary-text-color, #5f6368);
        font-size: 0.875rem;
      }
      .drop.over {
        border-color: var(--primary-color, #03a9f4);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
      }
      .drop ha-icon {
        --mdc-icon-size: 32px;
      }
    `],jg([(0,s.MZ)({attribute:!1})],Eg.prototype,"doc",void 0),jg([(0,s.MZ)({attribute:!1})],Eg.prototype,"pieces",void 0),jg([(0,s.MZ)({type:String})],Eg.prototype,"viewBox",void 0),jg([(0,s.MZ)({type:Boolean})],Eg.prototype,"disabled",void 0),jg([(0,s.wk)()],Eg.prototype,"_open",void 0),jg([(0,s.wk)()],Eg.prototype,"_mode",void 0),jg([(0,s.wk)()],Eg.prototype,"_format",void 0),jg([(0,s.wk)()],Eg.prototype,"_smil",void 0),jg([(0,s.wk)()],Eg.prototype,"_color",void 0),jg([(0,s.wk)()],Eg.prototype,"_text",void 0),jg([(0,s.wk)()],Eg.prototype,"_fileName",void 0),jg([(0,s.wk)()],Eg.prototype,"_status",void 0),jg([(0,s.wk)()],Eg.prototype,"_error",void 0),jg([(0,s.wk)()],Eg.prototype,"_over",void 0),jg([(0,s.wk)()],Eg.prototype,"_manual",void 0),Eg=jg([(0,s.EM)("mc-anim-svg-dialog")],Eg);var Hg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Lg={circle:n.JW`<circle cx="12" cy="12" r="7"></circle>`,square:n.JW`<rect x="5" y="5" width="14" height="14" rx="1.5"></rect>`,triangle:n.JW`<path d="M12 4l8 15H4z"></path>`,star:n.JW`<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"></path>`,heart:n.JW`<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"></path>`,ring:n.JW`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="3"></circle>`,line:n.JW`<path d="M6 19L18 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`,spark:n.JW`<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"></path>`};function Vg(e){return Mu(e)?n.qy`<svg class="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${Lg[e]}</svg>`:n.qy`<ha-icon class="glyph" icon=${wu.find(t=>t.id===e).icon}></ha-icon>`}const Og=["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899","#ffffff","#f97316","#8b5cf6"];let Pg=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.emitter=0,this._shapes={},this._color=-1,this._chip=0,this._paused=!1,this._open={},this._baking=!1,this.all=!1,this._live="",this._seed=Vu(),this._bakeMs=0,this._bakeToken=0,this._applied=[],this._liveCss=new Map,this._previewCss="",this._shuffle=()=>{if(!this.doc)return;const e=this._multi&&this.all;let t=this.doc;for(let i=e?0:this._em;i<(e?am(this.doc):this._em+1);i++)t=vm(t,this._seed,i,e=>Ku(e,this._seed));this._emit(t,"Shuffle")},this._openExport=()=>{this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)},this._convert=()=>{this.doc&&(this._emit(function(e){const t=e.particles??Qe,i=fu(e),n=(i&&bu[i.id])??{},s="count"===i?.particles?t.intensity??i.defaults.intensity:void 0,r=void 0!==s&&Number.isFinite(s)?pu(Math.round(s),1,Ge):Qe.count,{preset:a,intensity:o,...l}=t,c={...Qe,...l,...n,count:r,size:[...n.size??l.size??Qe.size],colors:[...n.colors??l.colors??[]]};return c.shape||delete c.shape,{...e,particles:c}}(this.doc),"Convert to custom particles"),this._focus('.mode-seg [aria-checked="true"]'))},this._addEmitter=()=>{if(!this.doc)return;const e=function(e,t){if(!cm(e))return e;const i=pm(e,t),n=structuredClone(i[0]);return delete n.name,n.id="",n.seed=Vu(i[0].seed,void 0),n.count=Math.min(10,i[0].count,lm(e)),hm(e,t,[...i,n])}(this.doc,this._seed);e!==this.doc&&(this._emit(e,"Add emitter"),this._select(am(e)-1),this._focus('.em-tabs [aria-selected="true"]'))},this._dupEmitter=()=>{if(!this.doc)return;const e=function(e,t,i){if(!um(e,i)||!cm(e))return e;const n=pm(e,t),s=structuredClone(n[i]);return s.id="",s.seed=Vu(n[i].seed,void 0),s.count=Math.min(n[i].count,lm(e)),s.name&&(s.name=In(1217,{name:s.name}).slice(0,40).trim()),n.splice(i+1,0,s),hm(e,t,n)}(this.doc,this._seed,this._em);e!==this.doc&&(this._emit(e,"Duplicate emitter"),this._select(this._em+1),this._focus('.em-tabs [aria-selected="true"]'))},this._removeEmitter=()=>{if(!this.doc)return;const e=this._em,t=function(e,t,i){if(!um(e,i)||am(e)<2)return e;const n=pm(e,t);return n.splice(i,1),hm(e,t,n)}(this.doc,this._seed,e);t!==this.doc&&(this._emit(t,"Remove emitter"),this._select(Math.max(0,e-1)),this._focus('.em-tabs [aria-selected="true"]'))},this._onFocusOut=e=>{const t=e.target;this._pending&&["f-svg","f-emoji","f-grav","f-drag","f-turb","f-bounce"].includes(t.id)&&this._settle()}}_emit(e,t,i=!1){if(this.disabled||e===this.doc)return;this._pending=i?{doc:e,label:t}:void 0;const n=i?{doc:e,label:t,transient:!0}:{doc:e,label:t};this.dispatchEvent(new CustomEvent("doc-change",{detail:n,bubbles:!0,composed:!0}))}_settle(){if(this._pending){const{doc:e,label:t}=this._pending;if(this._pending=void 0,this.disabled)return;this.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:e,label:t},bubbles:!0,composed:!0}))}}get _em(){return this.doc?Math.max(0,Math.min(Math.trunc(this.emitter)||0,am(this.doc)-1)):0}get _vdoc(){const e=this.doc,t=this._em;return this._viewKey?.doc===e&&this._viewKey.em===t||(this._viewKey={doc:e,em:t,view:fm(e,this._seed,t)}),this._viewKey.view}get _p(){return"particles"===this.doc?.kind?this._vdoc.particles:void 0}get _sim(){return Ru(this._vdoc,this._seed)}_on(e){return vm(this.doc,this._seed,this._em,e)}_patch(e,t,i=!1){this.doc&&this._emit(this._on(t=>gu(t,e)),t,i)}_editSim(e,t,i=!1){this.doc&&this._emit(this._on(t=>Fu(t,this._seed,e)),t,i)}_editAll(e,t,i=!1){if(!this.doc)return;let n=this.doc;for(let t=0;t<am(n);t++)n=vm(n,this._seed,t,t=>Fu(t,this._seed,e));this._emit(n,t,i)}_select(e,t=!1){this.emitter=e,this.all=t,this.dispatchEvent(new CustomEvent("emitter-change",{detail:{index:e,all:t},bubbles:!0,composed:!0}))}get _multi(){return!!this.doc&&am(this.doc)>1}_name(e){return this._multi?bm(this.doc,this._seed,e):In(630)}willUpdate(e){if(e.has("emitter")&&void 0!==e.get("emitter")&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._color=-1,this._chip=0,this._live=""),e.has("doc")){const t=e.get("doc");if(t&&t.id!==this.doc?.id&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._shapes={},this._color=-1,this._chip=0,this._seed=Vu(),this._stats=void 0,this.all=!1,this._live=""),this._p&&!this._p.preset){for(const e of this._sim.shapes)"builtin"in e.shape||(this._shapes={...this._shapes,[Su(e.shape)]:e.shape});const e=Iu(this._sim).length;this._chip>=e&&(this._chip=e-1)}const i=this._p?.colors.length??0;this._color>=i&&(this._color=i-1)}}_preview(){const e=this.doc,t=this._p;if(!e||!t)return{css:""};if(t.preset)return{anim:Qh({animations:[{id:"pv",preset:t.preset,intensity:t.intensity,duration:`${e.duration}s`,easing:e.easing,iterations:"infinite",direction:e.direction}]}),css:""};const i=On(e);if(!i.layer||!i.name)return{css:""};const n=+(e.duration/i.layer.speed).toFixed(3),s=[[i.name,i.layer],...i.split?[[i.split.name,i.split.layer]]:[]].map(([t,i])=>({preset:t,front:i.front,style:`--mc-fx-anim: ${t} ${n}s ${un(e.easing)} 0s infinite ${e.direction??"normal"}; --mc-fx-dur: ${n}s; --mc-fx-delay: 0s`,particles:i.particles,...i.symbol?{symbol:i.symbol}:{}}));return{css:i.css,anim:{style:"",fx:s}}}updated(e){const t=this.renderRoot.querySelector("style[data-pv]");t&&t.textContent!==this._previewCss&&(t.textContent=this._previewCss),e.has("doc")&&this._scheduleBake(),this._applyModule()}disconnectedCallback(){super.disconnectedCallback(),this._release(),this._bakeToken++}_scheduleBake(){const e=sm(),t=this.doc&&this._p?.sim&&!this._p.preset?rm(this.doc):void 0,i=++this._bakeToken;if(!e||!t)return this._stats=void 0,void(this._baking=!1);this._bakeMs>150&&(this._baking=!0);const n=this.doc;setTimeout(()=>{if(i!==this._bakeToken)return;const s=performance.now();try{this._stats=e.bake({spec:t,period:Lu(n),geometry:fo}).stats}catch{this._stats=void 0}this._bakeMs=performance.now()-s,this._baking=!1},0)}_applyModule(){const e=sm(),t=this.doc&&this._p?.sim&&!this._p.preset?rm(this.doc):void 0,i=[...this.renderRoot.querySelectorAll(".stage .mc-anim-fx")];if(this._applied.some((e,t)=>e!==i[t])&&this._release(),!e||!t||!i.length||this._paused&&"live"===t.sim.mode)return void this._release();const n="function"==typeof matchMedia&&matchMedia(In(3)).matches;try{i.forEach((i,s)=>{e.apply(i,{useCss:(e,t)=>{this._liveCss.set(e,t);const i=this.renderRoot.querySelector("style[data-live]");i&&(i.textContent=[...this._liveCss.values()].join("\n"))},reducedMotion:n,content:()=>this.renderRoot.querySelector(".stage-module")??void 0,docId:this.doc.id,spec:t,period:Lu(this.doc),...1===s?{part:1}:{}})}),this._applied=i}catch{}}_release(){for(const e of this._applied)sm()?.release(e);this._applied=[]}_renderPreview(){const{anim:e,css:t}=this._preview();this._previewCss=t;const i=this._p,s=fu(this.doc),r=i.preset?void 0:this._sim,a=r?this._baking?In(82):`${this._multi?In(1240,{particles:om(this.doc),emitters:am(this.doc)}):In(1162,{count:i.count,flow:In(xu[r.flow]).toLowerCase()})} · ${"live"===r.mode?In(1115):In(1248,{seconds:+Lu(this.doc).toFixed(2)})}`:`${s?(0,T.t)(s.name):i.preset} · ${this.doc.duration} s`,o=!!r&&!!this._stats?.capped,l=!!r&&!o&&!!this._stats?.warn,c=!!r&&!!sm();return n.qy`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>${In(424)}</span></div>
        ${e?function(e){return e.fx.some(e=>e.seasonal)&&window.MagicCard?.loadSeasonal?.(),n.qy`${e.fx.map(e=>e.seasonal?n.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${e.preset} .scenes=${e.seasonal.scenes} .intensity=${e.seasonal.intensity} .seed=${`pv|${e.preset}`}></mc-seasonal>`:e.ring?n.qy`<mc-ring class="mc-anim-ring" data-fx=${e.preset} style=${e.style} .ring=${e.ring}></mc-ring>`:n.qy`<span class="mc-anim-fx" data-fx=${e.preset} ?data-front=${e.front} style=${e.style} aria-hidden="true">${e.particles.map(t=>{return n.qy`<i data-s=${t.shape??n.s6} style="--mc-anim-x: ${t.x}%; --mc-anim-phase: ${t.phase}; --mc-anim-k: ${t.k}${t.style?`; ${t.style}`:""}"
                >${i=t.symbol??e.symbol,i?"icon"in i?n.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:n.s6}</i
              >`;var i})}</span>`)}`}(e):n.s6}
      </div>
      <div class="preview-foot">
        <span class="sum">${a}</span>
        ${o?n.qy`<span class="chip is-warn trimmed">${In(1015)}</span>`:n.s6}
        ${c?n.qy`<button type="button" class="icon-btn sm export" aria-label=${In(63)} title=${In(761)} ?disabled=${this.disabled} @click=${this._openExport}>
              <ha-icon icon="mdi:motion-play-outline"></ha-icon>
            </button>`:n.s6}
        ${r?n.qy`<button type="button" class="icon-btn sm shuffle" aria-label=${In(821)} title=${In(822)} ?disabled=${this.disabled} @click=${this._shuffle}>
              <ha-icon icon="mdi:dice-5-outline"></ha-icon>
            </button>`:n.s6}
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused?"true":"false"}
          aria-label=${In(647)}
          title=${this._paused?In(667):In(647)}
          @click=${()=>this._paused=!this._paused}
        >
          <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
        </button>
      </div>
      ${o?n.qy`<p class="help cap-note">${In(995)}</p>`:n.s6}
      ${l?n.qy`<p class="help cap-note">${In(996)}</p>`:n.s6}
      <p class="help reduced-note">${In(703)}</p>
      ${c?n.qy`<mc-anim-svg-dialog .doc=${this.doc}></mc-anim-svg-dialog>`:n.s6}
    </div>`}_cols(e){if(!e||"function"!=typeof getComputedStyle)return 3;const t=getComputedStyle(e).gridTemplateColumns||"",i=/^repeat\((\d+)/.exec(t);return i?+i[1]:t.split(/\s+/).filter(e=>/px$/.test(e)).length||3}_radioKeys(e,t,i,n,s=0){const r=Math.max(0,t.indexOf(i));let a;if("ArrowRight"===e.key)a=r+1;else if("ArrowLeft"===e.key)a=r-1;else if("ArrowDown"===e.key)a=r+(s||1);else if("ArrowUp"===e.key)a=r-(s||1);else if("Home"===e.key)a=0;else{if("End"!==e.key)return;a=t.length-1}e.preventDefault(),a=(a+t.length)%t.length,n(t[a])}_focus(e){this.updateComplete.then(()=>this.renderRoot.querySelector(e)?.focus())}_pickMode(e,t=!1){this.doc&&this._emit(function(e,t,i){return Ru(e,t).mode===i?e:Fu(e,t,e=>({...e,mode:i}))}(this.doc,this._seed,e),In("live"===e?1054:1049)),t&&this._focus(`.mode-seg [data-mode="${e}"]`)}_renderMode(e){const t=[["baked",In(81),"mdi:repeat"],["live",In(421),"mdi:pulse"]];return n.qy`<section class="group" aria-labelledby="h-mode">
      <div class="group-head"><h3 id="h-mode">${In(447)}</h3></div>
      <div
        class="seg full mode-seg"
        role="radiogroup"
        aria-label=${In(823)}
        @keydown=${t=>this._radioKeys(t,["baked","live"],e.mode,e=>this._pickMode(e,!0))}
      >
        ${t.map(([t,i,s])=>n.qy`<button
            type="button"
            role="radio"
            data-mode=${t}
            aria-checked=${e.mode===t?"true":"false"}
            tabindex=${e.mode===t?0:-1}
            @click=${()=>this._pickMode(t)}
          >
            <ha-icon icon=${s}></ha-icon>${i}
          </button>`)}
      </div>
      <div class="mode-status" role="status">
        ${"live"===e.mode?n.qy`<p class="note is-warn live-warning"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${In(423)}</span></p>`:n.qy`<p class="help">${In(977)}</p>`}
      </div>
    </section>`}_chips(){return Iu(this._sim)}_setShapes(e,t,i=!1){this.doc&&this._emit(this._on(t=>function(e,t,i){const n=1===i.length?i[0].shape:void 0;return Du(e)||i.length&&(!n||"builtin"in n&&"circle"!==n.builtin)?Fu(e,t,e=>({...e,shapes:i.map(e=>({shape:e.shape,weight:e.weight}))})):function(e,t){const i=gu(e,{});return t?i.particles.shape=t:delete i.particles.shape,i}(e,n&&!("builtin"in n)?n:void 0)}(t,this._seed,e)),t,i)}_setChip(e,t,i,n=!1){const s=this._chips().map((i,n)=>n===e?{shape:t,weight:i.weight}:i);this._setShapes(s,i,n)}_shapeFor(e){return Mu(e)?{builtin:e}:this._shapes[e]??nu[e]}_pickKind(e,t=!1){const i=this._chips()[this._chip];i&&Su(i.shape)!==e&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._setChip(this._chip,this._shapeFor(e),`Use ${e}`)),t&&this._focus(`.shapes.main [data-kind="${e}"]`)}_addShape(){const e=this._chips();e.length>=Cu||(this._chip=e.length,this._setShapes([...e,{shape:Uu(e),weight:1}],In(34)))}_removeShape(e){const t=this._chips();t.length<=1||(this._chip=Math.max(0,Math.min(e,t.length-2)),this._setShapes(t.filter((t,i)=>i!==e),In(716)),this._focus(`.schip[data-i="${this._chip}"]`))}_shapeGrid(e,t,i,s){const r=wu.map(e=>e.id),a=e??r[0];return n.qy`<div
      class="shapes ${t}"
      role="radiogroup"
      aria-label=${i}
      @keydown=${e=>this._radioKeys(e,r,a,e=>s(e,!0),this._cols(e.currentTarget))}
    >
      ${wu.map(t=>n.qy`<button
          type="button"
          class="dir shape-tile"
          role="radio"
          data-kind=${t.id}
          aria-checked=${t.id===e?"true":"false"}
          tabindex=${t.id===a?0:-1}
          @click=${()=>s(t.id,!1)}
        >
          ${Vg(t.id)}<span>${In(t.label)}</span>
        </button>`)}
    </div>`}_renderShape(){const e=this._chips(),t=Math.min(this._chip,e.length-1),i=e[t],s=Su(i.shape),r=e.length>1,a=e.length>=Cu;return n.qy`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">${In(806)}</h3></div>
      <div class="schips" role="group" aria-label=${In(807)}>
        ${e.map((e,i)=>{return n.qy`<button
            type="button"
            class="schip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${r?In(813,{n:i+1,shape:ju(e.shape),weight:e.weight}):In(812,{n:i+1,shape:ju(e.shape)})}
            title=${ju(e.shape)}
            @click=${()=>this._chip=i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||!r||(e.preventDefault(),this._removeShape(i))}}
          >
            ${s=e.shape,"emoji"in s?n.qy`<span class="emo" aria-hidden="true">${s.emoji}</span>`:"icon"in s?n.qy`<ha-icon class="glyph" icon=${s.icon}></ha-icon>`:Vg(Su(s))}${r?n.qy`<span>${e.weight}</span>`:n.s6}
          </button>`;var s})}
        <button type="button" class="schip add" aria-label=${In(34)} title=${a?In(1205,{mAX_SHAPES:Cu}):In(34)} ?disabled=${a} @click=${()=>this._addShape()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      <div class="chip-edit">
        <div class="chip-edit-head">
          <span>${In(811,{n:t+1})}</span>
          ${r?n.qy`<button type="button" class="icon-btn sm danger remove-shape" aria-label=${In(717,{n:t+1})} title=${In(716)} @click=${()=>this._removeShape(t)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>`:n.s6}
        </div>
        ${this._shapeGrid(s,"main",In(811,{n:t+1}),(e,t)=>this._pickKind(e,t))}
        ${"icon"===s?this._renderIcon(i.shape):"emoji"===s?this._renderEmoji(i.shape):"svg"===s?this._renderSvg(i.shape):n.s6}
        ${r?this._renderWeight(e,t):n.s6}
      </div>
      ${r?n.s6:n.qy`<p class="help">${In(24)}</p>`}
    </section>`}_renderWeight(e,t){const i=e[t].weight;return n.qy`<div class="field">
      <div class="field-head"><label for="f-weight">${In(1071)}</label></div>
      <input
        id="f-weight"
        class="input"
        type="number"
        inputmode="numeric"
        min=${zu.weight.min}
        max=${zu.weight.max}
        step="1"
        .value=${L(String(i))}
        aria-describedby="h-weight"
        @change=${n=>{const s=n.target,r=Eu("weight",s.value);void 0!==r&&r!==i?(s.value=String(r),this._setShapes(e.map((e,i)=>i===t?{shape:e.shape,weight:r}:e),In(135))):s.value=String(i)}}
      />
      <p class="help" id="h-weight">${In(21,{percent:Wu(e,t)})}</p>
    </div>`}_renderIcon(e){const t="icon"in e?e.icon:"";return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">${In(371)}</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${t}
        label=${In(626)}
        aria-labelledby="l-icon"
        @value-changed=${e=>{e.stopPropagation();const i=String(e.detail.value??"").trim();(e=>su.test(e.trim()))(i)&&i!==t&&this._setChip(this._chip,{icon:i},"Change icon")}}
      ></mc-icon-picker>
    </div>`}_renderEmoji(e){const t="emoji"in e?e.emoji:"",i=this._emojiDraft??t,s=void 0!==this._emojiDraft?ru(this._emojiDraft):void 0,r=(e,t,i)=>{ru(e)||e.trim()===this._lastEmoji()||this._setChip(this._chip,{emoji:e.trim()},t,i)};return n.qy`<div class="field">
      <div class="field-head"><label for="f-emoji">${In(297)}</label></div>
      <div class="emoji-row">
        <span class="emoji-big" aria-hidden="true">${t}</span>
        <input
          id="f-emoji"
          class="input"
          type="text"
          maxlength="24"
          autocomplete="off"
          .value=${i}
          aria-invalid=${s?"true":"false"}
          aria-describedby=${s?"e-emoji":n.s6}
          @input=${e=>{const t=e.target.value;this._emojiDraft=t,r(t,"Change emoji",!0)}}
          @change=${()=>{void 0===this._emojiDraft||ru(this._emojiDraft)||(this._emojiDraft=void 0),this._settle()}}
        />
      </div>
      ${s?n.qy`<p class="help error" id="e-emoji" role="alert">${s}</p>`:n.s6}
      <div class="emoji-grid" role="group" aria-label=${In(174)}>
        ${iu.map(e=>n.qy`<button
            type="button"
            aria-pressed=${e===t?"true":"false"}
            aria-label=${In(1057,{emoji:e})}
            @click=${()=>{this._emojiDraft=void 0,e!==t&&this._setChip(this._chip,{emoji:e},"Change emoji")}}
          >
            ${e}
          </button>`)}
      </div>
    </div>`}_lastEmoji(){const e=this._chips()[this._chip]?.shape;return e&&"emoji"in e?e.emoji:""}_renderSvg(e){const t="svg"in e?e.svg:"",i=this._svgDraft??t,s=void 0!==this._svgDraft?au(this._svgDraft):void 0,r=On({...this.doc,particles:{...this._p,sim:void 0,shape:{svg:t}}}),a=/mask: (url\("[^"]*"\))/.exec(r.css)?.[1];return n.qy`<div class="field">
      <div class="field-head"><label for="f-svg">${In(615)}</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${i}
          aria-invalid=${s?"true":"false"}
          aria-describedby=${s?"e-svg h-svg":"h-svg"}
          @input=${e=>{const i=e.target.value;this._svgDraft=i,au(i)||i===t||this._setChip(this._chip,{svg:i},"Edit SVG",!0)}}
          @change=${()=>{void 0===this._svgDraft||au(this._svgDraft)||(this._svgDraft=void 0),this._settle()}}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title=${In(975)}>
          ${a?n.qy`<span style=${`-webkit-mask: ${a} center / contain no-repeat; mask: ${a} center / contain no-repeat;`}></span>`:n.s6}
        </span>
      </div>
      ${s?n.qy`<p class="help error" id="e-svg" role="alert">${s}</p>`:n.s6}
      <p class="help" id="h-svg">${In(645)}</p>
    </div>`}_pickFlow(e,t=!1){this.doc&&this._sim.flow!==e&&this._emit(this._on(t=>function(e,t,i){return!Du(e)&&(n=i,_u.has(n))?gu(e,{direction:i}):Fu(e,t,e=>({...e,flow:i}));var n}(t,this._seed,e)),"Change flow"),t&&this._focus(`.dir[data-dir="${e}"]`)}_number(e,t,i,s){const r=uu[e],a="count"===e?Math.min(r.max,i+lm(this.doc)):r.max;return n.qy`<input
      id=${t}
      class="input"
      type="number"
      inputmode="decimal"
      min=${r.min}
      max=${a}
      step=${"speed"===e?.1:1}
      .value=${String(i)}
      @change=${t=>{const n=t.target,r=mu(e,n.value),o=void 0===r?void 0:Math.min(r,a);void 0!==o&&o!==i?(n.value=String(o),this._patch({[e]:o},s)):n.value=String(i)}}
    />`}_unit(e,t,i,s,r,a){return n.qy`<mc-unit-field
      .inputId=${t}
      .value=${`${i}${s}`}
      .units=${[s]}
      noCustom
      .label=${r}
      ?disabled=${this.disabled}
      @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??""),s=""===n?a:mu(e,n);void 0!==s&&s!==i?this._patch({[e]:s},r):t.target.revert?.()}}
    ></mc-unit-field>`}_range(e,t,i,s,r,a,o={}){const l=o.scale??1,c=[+(s[0]*l).toFixed(2),+(s[1]*l).toFixed(2)],d=zu[r].step;return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id=${`l-${e}`}>${t}</span></div>
      <div class="pair" role="group" aria-labelledby=${`l-${e}`}>
        ${[0,1].map(t=>n.qy`<div>
            <label class="sub-lbl" for=${`f-${e}-${t}`}>${In(0===t?345:1004)}</label>
            <input
              id=${`f-${e}-${t}`}
              class="input"
              type="number"
              inputmode="decimal"
              min=${zu[r].min}
              max=${zu[r].max}
              step=${d}
              aria-label=${In(0===t?437:368,{noun:i})}
              .value=${L(String(c[t]))}
              @change=${e=>{const i=e.target,n=Eu(r,i.value);if(void 0===n)return void(i.value=String(c[t]));const s=Hu(0===t?[n,c[1]]:[c[0],n]);s[0]!==c[0]||s[1]!==c[1]?a([+(s[0]/l).toFixed(4),+(s[1]/l).toFixed(4)]):i.value=String(c[t])}}
            />
          </div>`)}
      </div>
      ${o.help?n.qy`<p class="help">${o.help}</p>`:n.s6}
    </div>`}_slider(e,t,i,s,r,a={}){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label><span class="val">${s}</span></div>
      <div class="slider">
        <input
          id=${e}
          type="range"
          min="0"
          max="1"
          step=${zu.unit.step}
          .value=${L(String(i))}
          aria-valuetext=${s}
          ?disabled=${a.disabled}
          @input=${e=>{const t=Eu("unit",e.target.value);void 0!==t&&r(t,!0)}}
          @change=${()=>this._settle()}
        />
      </div>
      ${a.help?n.qy`<p class="help">${a.help}</p>`:n.s6}
    </div>`}_renderTiming(e){return n.qy`<section class="group" aria-labelledby="h-timing">
      <div class="group-head"><h3 id="h-timing">${In(1003)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-speed">${In(435)}</label></div>
        ${this._number("speed","f-speed",e.speed,In(132))}
      </div>
    </section>`}_renderMovement(e,t,i=!0){return n.qy`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">${In(494)}</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">${In(337)}</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${e=>this._radioKeys(e,yu,t.flow,e=>this._pickFlow(e,!0),this._cols(e.currentTarget))}
        >
          ${yu.map(e=>n.qy`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${e}
              aria-checked=${e===t.flow?"true":"false"}
              tabindex=${e===t.flow?0:-1}
              title=${In(xu[e])}
              @click=${()=>this._pickFlow(e)}
            >
              <span class="dir-pv ${e}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${In(xu[e])}</span>
            </button>`)}
        </div>
      </div>
      <div class=${i?"pair":""}>
        ${i?n.qy`<div class="field">
              <div class="field-head"><label for="f-speed">${In(435)}</label></div>
              ${this._number("speed","f-speed",e.speed,In(132))}
            </div>`:n.s6}
        <div class="field">
          <div class="field-head"><label for="f-spread">${s=t.flow,$u.has(s)?In(697):In("drift"===s||"wave"===s||"wander"===s?863:862)}</label></div>
          ${this._unit("spread","f-spread",e.spread,"%",In(133),100)}
        </div>
      </div>
      ${"rain"===t.flow?this._renderWind(t):n.s6}
      ${this._range("pspeed",In(629),In(1129),t.ranges.speed,"pspeed",e=>this._editSim(t=>({...t,ranges:{...t.ranges,speed:e}}),"Change particle speed"),{help:In(284)})}
    </section>`;var s}_renderWind(e){const t=(i=e.physics.gravity.angle,pu(-(i>180?i-360:i),zu.wind.min,zu.wind.max)||0);var i;return n.qy`<div class="field">
      <div class="field-head"><label for="f-wind">${In(1076)}</label></div>
      <input
        id="f-wind"
        class="input"
        type="number"
        inputmode="numeric"
        min=${zu.wind.min}
        max=${zu.wind.max}
        step=${zu.wind.step}
        .value=${L(String(t))}
        aria-describedby="h-wind"
        @change=${e=>{const i=e.target,n=Eu("wind",i.value);void 0!==n&&n!==t?(i.value=String(n),this._emit(this._on(e=>function(e,t,i){const n=Ru(e,t).physics.gravity;return Zu(e,t,(360-pu(Math.round(i),zu.wind.min,zu.wind.max))%360,n.strength>0?n.strength/Au:.5)}(e,this._seed,n)),"Change wind angle")):i.value=String(t)}}
      />
      <p class="help" id="h-wind">${In(536)}</p>
    </div>`}_setSize(e,t,i){const n=this._p,s=""===t?void 0:parseFloat(t);if(void 0===s||!Number.isFinite(s))return void i.revert?.();const r=function(e,t,i){const n=pu(i,uu.size.min,uu.size.max);return 0===t?[n,Math.max(n,e[1])]:[Math.min(e[0],n),n]}(n.size,e,s);r[0]===n.size[0]&&r[1]===n.size[1]?i.revert?.():this._patch({size:r},"Change size")}_renderLook(e,t){return n.qy`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">${In(431)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-count">${In(193)}</label></div>
        ${this._number("count","f-count",e.count,In(129))}
        ${this._multi?n.qy`<p class="help count-help">${In(1041,{parentsLeft:e.count+lm(this.doc),parents:go.parents})}</p>`:n.s6}
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">${In(825)}</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${[0,1].map(t=>n.qy`<div>
              <label class="sub-lbl" for=${`f-size-${t}`}>${In(0===t?345:1004)}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${t}`}
                .value=${`${e.size[t]}px`}
                .units=${["px"]}
                noCustom
                .label=${In(0===t?832:402)}
                ?disabled=${this.disabled}
                @value-changed=${e=>{e.stopPropagation(),this._setSize(t,String(e.detail.value??""),e.target)}}
              ></mc-unit-field>
            </div>`)}
        </div>
      </div>
      ${this._range("opacity",In(606),In(1124),t.ranges.opacity,"opacity",e=>this._editSim(t=>({...t,ranges:{...t.ranges,opacity:e}}),"Change opacity"),{scale:100})}
      ${this._renderColors(e)}
      <div class="switch-row">
        <span class="txt" id="l-fade">${In(316)}<p class="help">${In(632)}</p></span>
        <button
          type="button"
          class="switch fade"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${e.fade?"true":"false"}
          @click=${()=>this._patch({fade:!e.fade},e.fade?In(1021):In(1022))}
        ></button>
      </div>
    </section>`}_pickLayer(e,t=!1){if(this.doc&&gm(this.doc,this._em)!==e){const t=this._name(this._em),i=In("front"===e?1107:1092);this._live=In(1221,{name:t,where:i}),this._emit(function(e,t,i,n){if(!um(e,i)||gm(e,i)===n)return e;if(1===am(e))return gu(e,{layer:n});const s=pm(e,t);return s[i].layer=n,hm(e,t,s)}(this.doc,this._seed,this._em,e),`${t} ${i}`)}t&&this._focus(`.layer-seg [data-layer="${e}"]`)}_renderPlacement(){const e=gm(this.doc,this._em);return n.qy`<div class="field placement">
      <div class="field-head"><span class="lbl" id="l-place">${In(660)}</span></div>
      <div
        class="seg full layer-seg"
        role="radiogroup"
        aria-label=${In(660)}
        @keydown=${t=>this._radioKeys(t,["back","front"],e,e=>this._pickLayer(e,!0))}
      >
        ${["back","front"].map(t=>n.qy`<button type="button" role="radio" data-layer=${t} aria-checked=${e===t?"true":"false"} tabindex=${e===t?0:-1} aria-describedby="h-place" @click=${()=>this._pickLayer(t)}>
            ${In("back"===t?84:385)}
          </button>`)}
      </div>
      <p class="help placement-help" id="h-place">${In(386)}</p>
      <p class="em-live" role="status">${this._live}</p>
    </div>`}_addColor(){const e=this._p;if(e.colors.length>=Ye)return;const t=Og.find(t=>!e.colors.includes(t))??Og[e.colors.length%Og.length];this._color=e.colors.length,this._patch({colors:[...e.colors,t]},"Add colour")}_removeColor(e){const t=this._p.colors.filter((t,i)=>i!==e);this._color=t.length?Math.min(e,t.length-1):-1,this._patch({colors:t},"Remove colour"),this.updateComplete.then(()=>(this.renderRoot.querySelector(`.cchip[data-i="${this._color}"]`)??this.renderRoot.querySelector(".cchip.add"))?.focus())}_renderColors(e){const t=this._color>=0&&this._color<e.colors.length?this._color:-1,i=e.colors.length>=Ye;return n.qy`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">${In(173)}</span>
        ${e.colors.length?n.qy`<span class="val">${In(1183,{count:e.colors.length,colours:Ye})}</span>`:n.s6}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${e.colors.map((e,i)=>{const s=du(e).startsWith("entity");return n.qy`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${s?In(170,{n:i+1}):In(171,{n:i+1,colour:e})}
            title=${s?In(303):e}
            @click=${()=>this._color=i===t?-1:i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||(e.preventDefault(),this._removeColor(i))}}
          >
            <span style=${`background: ${s?"var(--mc-text-2)":e}`}></span>
            ${s?n.qy`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>`:n.s6}
          </button>`})}
        <button type="button" class="cchip add" aria-label=${In(27)} title=${i?In(1152,{colours:Ye}):In(27)} ?disabled=${i} @click=${()=>this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${t>=0?n.qy`<div class="color-edit">
            <div class="color-edit-head">
              <span>${In(169,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${In(709,{n:t+1})}
                title=${In(707)}
                @click=${()=>this._removeColor(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${In(169,{n:t+1})}
              .value=${du(e.colors[t])}
              @value-changed=${i=>{i.stopPropagation();const n=cu(String(i.detail.value??""));if(!n||n===e.colors[t])return;const s=[...e.colors];s[t]=n,this._patch({colors:s},"Change colour")}}
            ></mc-color-picker>
          </div>`:n.qy`<p class="help">${e.colors.length?In(634):In(552)}</p>`}
    </div>`}_sector(e,t,i,s,r){const a=!!this._open[e];return n.qy`<div class="sector" data-sector=${e}>
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${a?"true":"false"}
        aria-controls=${a?`sb-${e}`:n.s6}
        @click=${()=>this._open={...this._open,[e]:!a}}
      >
        <ha-icon icon=${t}></ha-icon>
        <span class="nm">${i}<span class="sr-only">, </span><span class="ssum">${s}</span></span>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${a?n.qy`<div class="sector-body" id=${`sb-${e}`}>${r()}</div>`:n.s6}
    </div>`}_renderVariation(e){const t=this._vdoc;return n.qy`<div class="field">
        <div class="field-head"><label for="f-seed">${In(778)}</label></div>
        <div class="seed-row">
          <input
            id="f-seed"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            max=${zu.seed.max}
            step="1"
            .value=${L(String(e.seed))}
            aria-describedby="h-seed"
            @change=${t=>{const i=t.target,n=Eu("seed",i.value);void 0===n||n===e.seed&&this._p?.sim?i.value=String(e.seed):this._editSim(e=>({...e,seed:n}),"Change seed")}}
          />
          <button type="button" class="btn btn-secondary btn-sm shuffle-seed" @click=${this._shuffle}><ha-icon icon="mdi:dice-5-outline"></ha-icon>${In(821)}</button>
        </div>
        <p class="help" id="h-seed">${In(973)}</p>
      </div>
      ${this._range("spin",In(851),In(1130),Bu(t,e),"spin",e=>this._emit(this._on(t=>function(e,t,i){const n=Hu(i);if(!Du(e)&&n[0]===n[1])return gu(e,{spin:n[0]});const s=Lu(e);return Fu(e,t,e=>({...e,ranges:{...e.ranges,spin:[Ou(n[0]/s),Ou(n[1]/s)]}}))}(t,this._seed,e)),"Change spin"),{help:In(285)})}
      ${this._range("delay",In(872),In(1131),e.ranges.delay,"delay",e=>this._editSim(t=>({...t,ranges:{...t.ranges,delay:e}}),"Change start delay"))}
      ${this._range("life",In(415),In(1114),e.ranges.lifetime,"lifetime",e=>this._editSim(t=>({...t,ranges:{...t.ranges,lifetime:e}}),"Change lifetime"),{help:In(14)})}`}_pickGravityAngle(e,t=!1){const i=this._sim,n=i.physics.gravity.strength/Au;this.doc&&e!==i.physics.gravity.angle&&this._emit(this._on(t=>Zu(t,this._seed,e,n)),"Change gravity direction"),t&&this._focus(`.compass [data-angle="${e}"]`)}_renderPhysics(e){const t=e.physics.gravity,i=+(t.strength/Au).toFixed(2),s=+(e.physics.drag/3).toFixed(2),r=+(e.physics.turbulence.strength/150).toFixed(2),a=Ju.map(e=>String(e.angle)),o=Ju.some(e=>e.angle===t.angle);return n.qy`${this._slider("f-grav",In(352),i,i?i.toFixed(2):In(565),(e,i)=>this._emit(this._on(i=>Zu(i,this._seed,t.angle,e)),"Change gravity",i))}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-gdir">${In(353)}</span></div>
        <div
          class="seg full compass"
          role="radiogroup"
          aria-labelledby="l-gdir"
          @keydown=${e=>this._radioKeys(e,a,String(t.angle),e=>this._pickGravityAngle(+e,!0))}
        >
          ${Ju.map((e,i)=>n.qy`<button
              type="button"
              role="radio"
              data-angle=${e.angle}
              aria-checked=${e.angle===t.angle?"true":"false"}
              aria-label=${In(e.name)}
              title=${In(e.name)}
              tabindex=${e.angle===t.angle||!o&&0===i?0:-1}
              @click=${()=>this._pickGravityAngle(e.angle)}
            >
              <ha-icon icon=${e.icon}></ha-icon>
            </button>`)}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gangle">${In(61)}</label></div>
        <input
          id="f-gangle"
          class="input"
          type="number"
          inputmode="numeric"
          min="0"
          max="359"
          step="1"
          .value=${L(String(t.angle))}
          aria-describedby="h-gangle"
          @change=${e=>{const n=e.target,s=Eu("angle",n.value);void 0!==s&&s!==t.angle?this._emit(this._on(e=>Zu(e,this._seed,s,i)),"Change gravity direction"):n.value=String(t.angle)}}
        />
        <p class="help" id="h-gangle">${In(7)}</p>
      </div>
      ${this._slider("f-drag",In(248),s,s.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,drag:+(3*e).toFixed(2)}}),"Change drag",t),{help:In(830)})}
      ${this._slider("f-turb",In(1017),r,r.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,turbulence:{...t.physics.turbulence,strength:+(150*e).toFixed(2)}}}),"Change turbulence",t),{help:In(42)})}`}_setCollider(e,t){this._editSim(i=>({...i,colliders:{...i.colliders,..."content"===e?{content:t?"icon":"none"}:{[e]:t}}}),In(t?1020:1019))}_renderCollisions(e){const t=e.colliders,i=Gu(t);return n.qy`<div class="checks" role="group" aria-label=${In(164)}>
        ${tm.map(e=>n.qy`<label class="check">
            <input type="checkbox" data-collider=${e.id} .checked=${im(t,e.id)} @change=${t=>this._setCollider(e.id,t.target.checked)} />
            ${In(e.label)}
          </label>`)}
      </div>
      ${"none"!==t.content?n.qy`<div class="field">
            <div class="field-head"><span class="lbl">${In(180)}</span></div>
            <div
              class="seg full content-seg"
              role="radiogroup"
              aria-label=${In(180)}
              @keydown=${e=>this._radioKeys(e,["icon","text"],t.content,e=>{e!==t.content&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box"),this._focus(`.content-seg [data-content="${e}"]`)})}
            >
              ${["icon","text"].map(e=>n.qy`<button
                  type="button"
                  role="radio"
                  data-content=${e}
                  aria-checked=${t.content===e?"true":"false"}
                  tabindex=${t.content===e?0:-1}
                  @click=${()=>t.content!==e&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box")}
                >
                  ${In("icon"===e?371:914)}
                </button>`)}
            </div>
            <p class="help">${In(933)}</p>
          </div>`:n.s6}
      ${this._slider("f-bounce",In(101),e.physics.bounce,e.physics.bounce.toFixed(2),(e,t)=>this._editAll(t=>({...t,physics:{...t.physics,bounce:e}}),"Change bounce",t),{help:In(8),disabled:!i})}`}_child(e,t){this._editSim(t=>t.children?{...t,children:{...t.children,...e}}:t,t)}_renderChildren(e){const t=e.children,i=Gu(e.colliders),s=n.qy`<div class="switch-row">
      <span class="txt" id="l-children">${In(847)}<p class="help">${In(141)}</p></span>
      <button
        type="button"
        class="switch children"
        role="switch"
        aria-labelledby="l-children"
        aria-checked=${t?"true":"false"}
        @click=${()=>{t?this._editSim(e=>{const{children:t,...i}=e;return i},"Turn child particles off"):this._editSim(e=>({...e,children:Yu(e)}),"Turn child particles on")}}
      ></button>
    </div>`;if(!t)return s;const r=[["collision",In(596)],["death",In(73)]],a=(e,n=!1)=>{("collision"!==e||i)&&(e!==t.trigger&&this._child({trigger:e,at:void 0},"Change child trigger"),n&&this._focus(`.trigger-seg [data-trigger="${e}"]`))},o=Su(t.shapes[0]?.shape??{builtin:"circle"}),l=!t.colors.length;return n.qy`${s}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-trigger">${In(846)}</span></div>
        <div
          class="seg full trigger-seg"
          role="radiogroup"
          aria-labelledby="l-trigger"
          @keydown=${e=>this._radioKeys(e,i?["collision","death"]:["death"],t.trigger,e=>a(e,!0))}
        >
          ${r.map(([e,s])=>n.qy`<button
              type="button"
              role="radio"
              data-trigger=${e}
              aria-checked=${t.trigger===e?"true":"false"}
              tabindex=${t.trigger===e||"time"===t.trigger&&"death"===e?0:-1}
              ?disabled=${"collision"===e&&!i}
              @click=${()=>a(e)}
            >
              ${s}
            </button>`)}
        </div>
        ${i?n.s6:n.qy`<p class="help">${In(1023)}</p>`}
        ${"time"===t.trigger?n.qy`<p class="help">${In(848,{seconds:t.at??0})}</p>`:n.s6}
      </div>
      <div class="field">
        <div class="field-head"><label for="f-ccount">${In(194)}</label></div>
        <input
          id="f-ccount"
          class="input"
          type="number"
          inputmode="numeric"
          min="1"
          max=${zu.childCount.max}
          step="1"
          .value=${L(String(t.count))}
          @change=${e=>{const i=e.target,n=Eu("childCount",i.value);void 0!==n&&n!==t.count?(i.value=String(n),this._child({count:n},"Change child count")):i.value=String(t.count)}}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${In(140)}</span></div>
        ${this._shapeGrid(o,"child",In(140),(e,t)=>{if(e!==o){const t=this._sim.shapes.find(t=>Su(t.shape)===e)?.shape;this._child({shapes:[{shape:t??this._shapeFor(e),weight:1}]},"Change child shape")}t&&this._focus(`.shapes.child [data-kind="${e}"]`)})}
      </div>
      ${this._range("csize",In(826),In(1093),t.size,"childSize",e=>this._child({size:e},"Change child size"))}
      ${this._range("cspeed",In(850),In(1094),t.ranges.speed,"pspeed",e=>this._child({ranges:{...t.ranges,speed:e}},"Change child speed"))}
      <div class="field">
        <div class="field-head"><label for="f-clife">${In(415)}</label></div>
        <input
          id="f-clife"
          class="input"
          type="number"
          inputmode="decimal"
          min=${zu.childLife.min}
          max=${zu.childLife.max}
          step="0.1"
          .value=${L(String(t.ranges.lifetime[1]))}
          @change=${e=>{const i=e.target,n=Eu("childLife",i.value);void 0===n||n===t.ranges.lifetime[0]&&n===t.ranges.lifetime[1]?i.value=String(t.ranges.lifetime[1]):this._child({ranges:{...t.ranges,lifetime:[n,n]}},"Change child lifetime")}}
        />
      </div>
      <div class="switch-row">
        <span class="txt" id="l-ccolors">${In(1055)}</span>
        <button
          type="button"
          class="switch child-colors"
          role="switch"
          aria-labelledby="l-ccolors"
          aria-checked=${l?"true":"false"}
          @click=${()=>this._child({colors:l?[this._p?.colors[0]??"#ffffff"]:[]},In(l?616:1055))}
        ></button>
      </div>
      ${l?n.s6:n.qy`<mc-color-picker
            allowEntity
            label=${In(137)}
            .value=${du(t.colors[0])}
            @value-changed=${e=>{e.stopPropagation();const i=cu(String(e.detail.value??""));i&&i!==t.colors[0]&&this._child({colors:[i]},"Change child colour")}}
          ></mc-color-picker>`}`}_renderSectors(e,t){return n.qy`<div class="sectors">
      ${"all"===t?n.s6:this._sector("variation","mdi:dice-multiple-outline",In(1068),function(e,t){return In(779,{seed:String(t.seed),span:em(Bu(e,t),"°")})}(this._vdoc,e),()=>this._renderVariation(e))}
      ${"all"===t?n.s6:this._sector("physics","mdi:weight",In(651),function(e){const{gravity:t,drag:i,turbulence:n}=e.physics,s=t.strength/Au,r=[s>0?In(354,{strength:s.toFixed(1),direction:Xu(t.angle)}):In(554)];return i>0&&r.push(In(1100,{value:Qu(i/3)})),n.strength>0&&r.push(In(1140,{value:Qu(n.strength/150)})),r.join(", ")}(e),()=>this._renderPhysics(e))}
      ${"emitter"===t?n.s6:this._sector("collisions","mdi:arrow-collapse-down",In(165),function(e){const t=tm.filter(t=>im(e.colliders,t.id)).map(e=>In(e.label));return t.length?In(1204,{list:t.join(", "),bounce:Qu(e.physics.bounce)}):In(594)}(e),()=>this._renderCollisions(e))}
      ${"all"===t?n.s6:this._sector("children","mdi:creation-outline",In(138),function(e){const t=e.children;if(!t)return In(594);const i=t.shapes[0]?.shape??{builtin:"circle"},n=Su(i),s="svg"===n?In(757):"emoji"===n?In(1103):ju(i).toLowerCase();return In(1170,{count:t.count,shape:s,trigger:(r=t,"collision"===r.trigger?In(1123):"death"===r.trigger?In(1090):In(1088,{seconds:Qu(r.at??0)}))});var r}(e),()=>n.qy`<div class="sector-body-lk" ?inert=${this._locks.kids.length>0}>${this._renderChildren(e)}</div>`)}
    </div>`}_renderPreset(e){const t=fu(this.doc),i=t?((e,t)=>e.particles?.intensity??t.defaults.intensity)(this.doc,t):void 0;return n.qy`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${t?(0,T.t)(t.name):e.preset}</strong>
          <span class="kind">${t?In(83,{kind:vu(t).toLowerCase()}):In(1033)}</span>
        </span>
      </div>
      ${t?n.qy`<div class="field">
            <div class="field-head"><label for="f-intensity">${((e,t)=>e.intensity.unit?`${t(e.intensity.label)} (${e.intensity.unit})`:t(e.intensity.label))(t,In)}</label></div>
            <input
              id="f-intensity"
              class="input"
              type="number"
              inputmode="decimal"
              min=${t.intensity.min}
              max=${t.intensity.max}
              step=${t.intensity.step??1}
              placeholder=${String(t.defaults.intensity)}
              .value=${void 0===e.intensity?"":String(i)}
              @change=${i=>{const n=i.target.value,s=function(e,t,i){return void 0!==i&&Number.isFinite(i)?gu(e,{intensity:pu(i,t.intensity.min,t.intensity.max)}):gu(e,{intensity:void 0})}(this.doc,t,""===n?void 0:Number(n));s.particles.intensity!==e.intensity?this._emit(s,"Change intensity"):i.target.value=void 0===e.intensity?"":String(e.intensity)}}
            />
            <p class="help">${In(85,{min:t.intensity.min,max:t.intensity.max,intensity:t.defaults.intensity})}</p>
          </div>`:n.qy`<p class="help error">${In(999)}</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>${In(182)}
      </button>
      <p class="help">
        ${In(908)}
        ${!t||"count"!==t.particles||t.ring||t.seasonal?In(985):In(953)}
      </p>
    </section>`}get _locks(){const e=this.doc,t=this.layerView;if(!e||!t?.locked.length)return{own:[],kids:[]};const i=e.particles?.sim?Ua(e):["main"],n=this.all&&i.length>1?i:[i[Math.min(this._em,i.length-1)]??"main"];return{own:n.filter(i=>no(e,t,`emitter:${i}`)).map(e=>`emitter:${e}`),kids:n.filter(i=>no(e,t,`children:${i}`)).map(e=>`children:${e}`)}}render(){const e=this._p;if(!this.doc||!e)return n.qy`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>${In(608)}</p></div>`;const t=e.preset?void 0:this._sim;return n.qy`<style data-pv></style>
      <style data-live></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${this._locks.own.length?ho(this.doc,this.layerView,this._locks.own):n.s6}
          ${t?this._renderForm(e,t):n.qy`<div class="lk" ?inert=${this._locks.own.length>0}>${this._renderPreset(e)}</div>`}
        </div>
      </div>`}_renderForm(e,t){const i=this._multi,s=i&&this.all;return n.qy`${this._renderBar()}
      <div class="lk" ?inert=${this._locks.own.length>0}>
      ${s?n.qy`<p class="help all-note">${In(984)}</p>
            ${this._renderMode(t)}${this._renderTiming(e)}${this._renderSectors(t,"all")}`:n.qy`${i?this._renderEmitterHead():n.s6}${this._renderPlacement()}
            ${i?n.s6:this._renderMode(t)}${this._renderShape()}${this._renderMovement(e,t,!i)}${this._renderLook(e,t)}${this._renderSectors(t,i?"emitter":void 0)}`}
      </div>`}_renderBar(){const e=this.doc,t=am(e),i=cm(e),s=this.all?"all":String(this._em),r=["all",...Array.from({length:t},(e,t)=>String(t))];return n.qy`<div class="em-bar">
      ${t>1?n.qy`<div class="em-tabs">${kd({role:"tablist",label:In(295),value:s,items:r.map(e=>({value:e,label:"all"===e?In(48):this._name(+e)})),onChange:e=>{"all"===e?this._select(this._em,!0):this._select(+e),this._focus(`.em-tabs [data-val="${e}"]`)}})}</div>`:n.s6}
      <button type="button" class="btn btn-secondary btn-sm em-add" ?disabled=${!i||this.disabled} aria-describedby=${i?n.s6:"h-em-cap"} @click=${this._addEmitter}>
        <ha-icon icon="mdi:plus"></ha-icon>${In(28)}
      </button>
      ${i?n.s6:n.qy`<p class="help em-cap" id="h-em-cap">${t>=go.emitters?In(1184,{emitters:go.emitters}):In(553)}</p>`}
    </div>`}_renderEmitterHead(){const e=this._em,t=this.doc.particles.sim,i=(0===e?t.name:t.emitters?.[e-1]?.name)??"";return n.qy`<div class="em-head">
      <div class="field em-name-field">
        <div class="field-head"><label for="f-em-name">${In(294)}</label></div>
        <input
          id="f-em-name"
          class="input em-name"
          type="text"
          maxlength=${40}
          placeholder=${bm(this.doc,this._seed,e)}
          .value=${L(i)}
          @change=${t=>{const i=t.target,n=mm(this.doc,this._seed,e,i.value);i.value=(0===e?n.particles.sim.name:n.particles.sim.emitters?.[e-1]?.name)??"",this._emit(n,"Rename emitter")}}
        />
      </div>
      <button type="button" class="icon-btn sm em-dup" aria-label=${In(277)} title=${In(277)} ?disabled=${!cm(this.doc)||this.disabled} @click=${this._dupEmitter}>
        <ha-icon icon="mdi:content-copy"></ha-icon>
      </button>
      <button type="button" class="icon-btn sm danger em-remove" aria-label=${In(711)} title=${In(711)} ?disabled=${this.disabled} @click=${this._removeEmitter}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`}};Pg.styles=[Ip,gh,po,n.AH`
      .lk[inert],
      .sector-body[inert] {
        opacity: 0.55;
      }
      :host {
        display: block;
        container-type: inline-size;
        color: var(--mc-text);
      }
      :host([disabled]) .form {
        opacity: 0.55;
      }
      .wrap {
        display: grid;
        gap: 20px;
      }
      .form {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 0;
        min-width: 0;
        container: form / inline-size;
      }
      .form > * {
        min-width: 0;
      }
      .form > .group {
        padding-bottom: 20px;
      }
      .form > .group:last-child,
      .form > .sectors {
        margin-bottom: 0;
      }
      .group-head h3 {
        color: var(--mc-text);
      }

      /* ── preview ── */
      .preview {
        display: grid;
        gap: 6px;
      }
      .stage {
        position: relative;
        height: 128px;
        border-radius: var(--mc-radius-lg);
        border: 1px solid var(--mc-divider);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 14px 14px;
        display: grid;
        place-items: center;
        overflow: hidden;
      }
      .stage-module {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 8px 10px;
        border-radius: 12px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
        --mdc-icon-size: 20px;
      }
      .stage-module ha-icon {
        color: var(--mc-text-2);
      }
      .stage mc-seasonal {
        z-index: -1;
        pointer-events: none;
      }
      .stage[data-paused] .mc-anim-fx > i {
        animation-play-state: paused;
      }
      .preview-foot {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        min-width: 0;
      }
      .preview-foot .sum {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .reduced-note {
        display: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .reduced-note {
          display: block;
        }
      }

      /* ── emitters ── */
      .em-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding-bottom: 16px;
      }
      .em-tabs {
        flex: 1 1 100%;
        min-width: 0;
        display: flex;
      }
      .em-tabs .seg,
      .placement .seg {
        flex-wrap: wrap;
        max-width: 100%;
      }
      .placement .seg > button {
        flex: 1 1 0;
        white-space: normal;
      }
      .em-tabs .seg > button {
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .em-cap {
        flex-basis: 100%;
        margin: 0;
      }
      .em-head {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        padding-bottom: 16px;
      }
      .em-name-field {
        flex: 1;
        min-width: 0;
      }
      .all-note {
        margin: 0 0 16px;
      }
      .placement {
        padding-bottom: 20px;
      }
      .em-live {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .em-live:empty {
        display: none;
      }

      /* ── mode ── */
      .note.is-warn {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        margin: 0;
        padding: 10px 12px;
        border-radius: var(--mc-radius);
        background: var(--mc-warn-tint);
        border: 1px solid color-mix(in srgb, var(--mc-warn-ink) 40%, transparent);
        color: var(--mc-text);
        font-size: 0.8125rem;
        line-height: 1.4;
      }
      .note.is-warn ha-icon {
        flex: none;
        --mdc-icon-size: 18px;
        color: var(--mc-warn-ink);
      }
      .mode-status > .help {
        margin: 0;
      }

      /* ── shape ── */
      .glyph {
        width: 18px;
        height: 18px;
        --mdc-icon-size: 18px;
      }
      .schips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .schip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 32px;
        min-width: 32px;
        padding: 0 8px;
        border-radius: 16px;
        border: 1px solid var(--mc-field-border);
        background: var(--mc-surface);
        color: var(--mc-text);
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        justify-content: center;
      }
      .schip .emo {
        font-size: 1rem;
        line-height: 1;
      }
      .schip[aria-pressed='true'] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .schip.add {
        border-style: dashed;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .schip.add:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .chip-edit {
        display: grid;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .chip-edit-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .chip-edit-head > span {
        flex: 1;
      }
      .chip-edit-head .icon-btn {
        margin: -4px -6px -4px 0;
      }
      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(8, minmax(0, 1fr));
        gap: 4px;
      }
      .emoji-grid button {
        height: 36px;
        min-width: 0;
        padding: 0;
        border: 1px solid transparent;
        border-radius: var(--mc-radius);
        background: transparent;
        font-size: 1.15rem;
        line-height: 1;
        transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
      }
      .emoji-grid button:hover {
        background: var(--mc-surface-2);
      }
      .emoji-grid button[aria-pressed='true'] {
        border-color: color-mix(in srgb, var(--mc-accent) 55%, transparent);
        background: var(--mc-accent-tint);
      }
      .emoji-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .emoji-row .input {
        flex: 1;
        min-width: 0;
        font-size: 1rem;
      }
      .emoji-big {
        flex: none;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        font-size: 1.35rem;
      }
      .svg-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 56px;
        gap: 8px;
        align-items: start;
      }
      .svg-thumb {
        width: 56px;
        height: 56px;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface-2);
        display: grid;
        place-items: center;
      }
      .svg-thumb > span {
        width: 32px;
        height: 32px;
        background: var(--mc-text);
      }
      textarea.input[aria-invalid='true'],
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }

      /* ── tiles (flows, shapes) ── */
      .dirs,
      .shapes {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .dir {
        display: grid;
        gap: 4px;
        justify-items: center;
        align-content: center;
        min-height: 44px;
        padding: 6px 4px 6px;
        min-width: 0;
        border-radius: var(--mc-radius);
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font-size: 0.75rem;
        font-weight: 500;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .dir > span:last-child {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .dir:hover {
        border-color: var(--mc-field-border);
        color: var(--mc-text);
      }
      .dir[aria-checked='true'] {
        border-color: var(--mc-accent);
        box-shadow: inset 0 0 0 1px var(--mc-accent);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .dir-pv {
        position: relative;
        width: 100%;
        height: 34px;
        overflow: hidden;
        border-radius: 6px;
        background: var(--mc-surface-2);
      }
      .dir[aria-checked='true'] .dir-pv {
        background: color-mix(in srgb, var(--mc-surface) 70%, transparent);
      }
      .dir-pv i {
        position: absolute;
        width: 5px;
        height: 5px;
        margin: -2.5px 0 0 -2.5px;
        border-radius: 50%;
        background: currentColor;
        animation: var(--a) 1.8s linear infinite;
        animation-delay: calc(var(--n) * -0.6s);
      }
      .dir-pv i:nth-child(1) { --n: 0; }
      .dir-pv i:nth-child(2) { --n: 1; }
      .dir-pv i:nth-child(3) { --n: 2; }
      .dir-pv.fall i, .dir-pv.rise i, .dir-pv.zigzag i, .dir-pv.rain i { left: calc(25% + var(--n) * 25%); top: 0; }
      .dir-pv.fall i { --a: pv-fall; }
      .dir-pv.rise i { --a: pv-rise; }
      .dir-pv.zigzag i { --a: pv-zigzag; animation-duration: 2.2s; animation-delay: calc(var(--n) * -0.73s); }
      .dir-pv.rain i { --a: pv-rain; width: 2px; height: 7px; border-radius: 1px; animation-duration: 0.9s; animation-delay: calc(var(--n) * -0.3s); }
      .dir-pv.drift i, .dir-pv.wave i { left: 0; top: calc(30% + var(--n) * 20%); animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.drift i { --a: pv-drift; }
      .dir-pv.wave i { --a: pv-wave; }
      .dir-pv.burst i, .dir-pv.orbit i, .dir-pv.spiral i, .dir-pv.vortex i, .dir-pv.explode i { left: 50%; top: 50%; }
      .dir-pv.burst i { --a: pv-burst; animation-delay: calc(var(--n) * -0.15s); animation-timing-function: ease-out; }
      .dir-pv.orbit i { --a: pv-orbit; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.spiral i { --a: pv-spiral; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.vortex i { --a: pv-vortex; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.explode i { top: 30%; --a: pv-explode; animation-duration: 2s; animation-delay: calc(var(--n) * -0.1s); }
      .dir-pv.fountain i { left: 50%; top: 100%; --a: pv-fountain; animation-duration: 1.8s; }
      .dir-pv.wander i { left: calc(25% + var(--n) * 25%); top: 50%; --a: pv-wander; animation-duration: 3s; animation-delay: calc(var(--n) * -1s); }
      @keyframes pv-fall {
        from { translate: 0 -4px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 38px; opacity: 0; }
      }
      @keyframes pv-rise {
        from { translate: 0 38px; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 0 -4px; opacity: 0; }
      }
      @keyframes pv-drift {
        from { translate: -4px 0; opacity: 0; }
        20%, 80% { opacity: 1; }
        to { translate: 80px 0; opacity: 0; }
      }
      @keyframes pv-wave {
        0% { translate: -4px 0; opacity: 0; }
        20% { opacity: 1; }
        25% { translate: 18px -6px; }
        50% { translate: 38px 0; }
        75% { translate: 58px 6px; }
        80% { opacity: 1; }
        100% { translate: 80px 0; opacity: 0; }
      }
      @keyframes pv-zigzag {
        0% { translate: 0 -4px; opacity: 0; }
        20% { opacity: 1; }
        25% { translate: 6px 6px; }
        50% { translate: -6px 16px; }
        75% { translate: 6px 26px; }
        80% { opacity: 1; }
        100% { translate: 0 38px; opacity: 0; }
      }
      @keyframes pv-rain {
        from { translate: 6px -8px; opacity: 0; }
        15%, 85% { opacity: 1; }
        to { translate: -6px 38px; opacity: 0; }
      }
      @keyframes pv-burst {
        from { transform: rotate(calc(var(--n) * 120deg)) translateY(0); opacity: 0; }
        10%, 60% { opacity: 1; }
        to { transform: rotate(calc(var(--n) * 120deg)) translateY(-15px); opacity: 0; }
      }
      @keyframes pv-explode {
        0% { translate: 0 0; opacity: 0; }
        10% { opacity: 1; }
        35% { translate: calc((var(--n) - 1) * 16px) -8px; }
        85% { opacity: 1; }
        100% { translate: calc((var(--n) - 1) * 24px) 26px; opacity: 0; }
      }
      @keyframes pv-fountain {
        0% { translate: 0 0; opacity: 0; }
        10% { opacity: 1; }
        45% { translate: calc((var(--n) - 1) * 10px) -30px; }
        85% { opacity: 1; }
        100% { translate: calc((var(--n) - 1) * 20px) 0; opacity: 0; }
      }
      @keyframes pv-orbit {
        from { transform: rotate(0deg) translateY(-11px); }
        to { transform: rotate(360deg) translateY(-11px); }
      }
      @keyframes pv-spiral {
        from { transform: rotate(0deg) translateY(0); opacity: 0; }
        25%, 75% { opacity: 1; }
        to { transform: rotate(540deg) translateY(-15px); opacity: 0; }
      }
      @keyframes pv-vortex {
        from { transform: rotate(0deg) translateY(-15px); opacity: 0; }
        25%, 75% { opacity: 1; }
        to { transform: rotate(540deg) translateY(0); opacity: 0; }
      }
      @keyframes pv-wander {
        0%, 100% { translate: 0 0; opacity: 0.3; }
        25% { translate: 8px -6px; opacity: 1; }
        50% { translate: -4px 6px; opacity: 0.5; }
        75% { translate: 6px 4px; opacity: 1; }
      }
      .shape-tile {
        min-height: 52px;
        --mdc-icon-size: 22px;
      }
      .shape-tile .glyph {
        width: 22px;
        height: 22px;
        --mdc-icon-size: 22px;
      }
      @media (prefers-reduced-motion: reduce) {
        .dir-pv i {
          animation-play-state: paused;
        }
      }

      /* ── numbers ── */
      .pair {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .sub-lbl {
        display: block;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        margin-bottom: 4px;
      }
      .slider {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: center;
        min-height: 32px;
      }
      .slider input[type='range'] {
        width: 100%;
        margin: 0;
        accent-color: var(--mc-accent-fill);
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .seg.compass button {
        padding: 0;
        min-width: 32px;
        flex: 1;
        --mdc-icon-size: 18px;
      }

      /* ── colours ── */
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .cchip {
        position: relative;
        width: 32px;
        height: 32px;
        padding: 3px;
        border-radius: 50%;
        border: 1px solid var(--mc-field-border);
        background: var(--mc-surface);
        display: grid;
        place-items: center;
      }
      .cchip > span {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc-text) 18%, transparent);
      }
      .cchip > ha-icon.ent {
        position: absolute;
        --mdc-icon-size: 14px;
        color: var(--mc-surface);
      }
      .cchip[aria-pressed='true'] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .cchip.add {
        border-style: dashed;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .cchip.add:hover:not(:disabled) {
        color: var(--mc-text);
        border-color: var(--mc-text-2);
      }
      .cchip.add:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .color-edit {
        display: grid;
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .color-edit-head {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 24px;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .color-edit-head > span {
        flex: 1;
      }
      .color-edit-head .icon-btn {
        margin: -4px -6px -4px 0;
      }

      /* ── closed sections ── */
      .sector-btn .nm {
        display: grid;
        gap: 2px;
      }
      .sector-btn .ssum {
        font-size: 0.75rem;
        font-weight: 400;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .seed-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .seed-row .input {
        flex: 1;
        min-width: 0;
      }
      .checks {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 12px;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        font-size: 0.8125rem;
      }
      .check input {
        width: 18px;
        height: 18px;
        margin: 0;
        accent-color: var(--mc-accent-fill);
      }

      /* ── preset-based ── */
      .preset-card {
        display: grid;
        gap: 12px;
      }
      .preset-name {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .preset-name .tile {
        flex: none;
        width: 36px;
        height: 36px;
        border-radius: var(--mc-radius);
        display: grid;
        place-items: center;
        background: var(--mc-surface-2);
        color: var(--mc-text-2);
        --mdc-icon-size: 20px;
      }
      .preset-name .txt {
        display: grid;
        gap: 2px;
        min-width: 0;
      }
      .preset-name strong {
        font-size: 0.875rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preset-name .kind {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .convert {
        justify-self: start;
      }

      /* the wide panel: preview beside the fields */
      @container (min-width: 640px) {
        .wrap {
          grid-template-columns: minmax(240px, 320px) minmax(0, 1fr);
          align-items: start;
          gap: 24px;
        }
        .preview {
          position: sticky;
          top: 0;
        }
        .stage {
          height: 180px;
        }
      }
      /* a wide form (the bottom panel): more tiles per row */
      @container form (min-width: 480px) {
        .dirs {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .shapes {
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }
        .checks {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `],Hg([(0,s.MZ)({attribute:!1})],Pg.prototype,"doc",void 0),Hg([(0,s.MZ)({attribute:!1})],Pg.prototype,"hass",void 0),Hg([(0,s.MZ)({attribute:!1})],Pg.prototype,"library",void 0),Hg([(0,s.MZ)({attribute:!1})],Pg.prototype,"time",void 0),Hg([(0,s.MZ)({type:Boolean,reflect:!0})],Pg.prototype,"disabled",void 0),Hg([(0,s.MZ)({attribute:!1})],Pg.prototype,"layerView",void 0),Hg([(0,s.MZ)({type:Number})],Pg.prototype,"emitter",void 0),Hg([(0,s.wk)()],Pg.prototype,"_shapes",void 0),Hg([(0,s.wk)()],Pg.prototype,"_svgDraft",void 0),Hg([(0,s.wk)()],Pg.prototype,"_emojiDraft",void 0),Hg([(0,s.wk)()],Pg.prototype,"_color",void 0),Hg([(0,s.wk)()],Pg.prototype,"_chip",void 0),Hg([(0,s.wk)()],Pg.prototype,"_paused",void 0),Hg([(0,s.wk)()],Pg.prototype,"_open",void 0),Hg([(0,s.wk)()],Pg.prototype,"_stats",void 0),Hg([(0,s.wk)()],Pg.prototype,"_baking",void 0),Hg([(0,s.MZ)({type:Boolean})],Pg.prototype,"all",void 0),Hg([(0,s.wk)()],Pg.prototype,"_live",void 0),Pg=Hg([(0,s.EM)("mc-anim-particles-editor")],Pg);var Rg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Dg=[{value:"element",label:292,icon:"mdi:square-rounded-outline"},{value:"icon",label:371,icon:"mdi:star-outline"},{value:"particles",label:630,icon:"mdi:scatter-plot-outline"}],Ng=[{value:"percent",label:2},{value:"px",label:659}],Tg={count:3,size:[6,12],colors:[]},Fg={d:"",units:"percent",follow_rotation:!1,subject:"element"},Ig=new Map;let Bg=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1}get _spec(){return this.doc?.path??Fg}_locked(e){return!!this.layerView?.locked.includes(e)}_emit(e,t){if(!this.doc||this.disabled)return;const i={...this.doc,path:e};this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_set(e,t){this._emit({...this._spec,...e},t)}_edit(e,t){this._set({d:sa(e(na(this._spec.d)))},t)}_template(e,t){const i=this._spec;this._set({d:ha(e,ua({subject:i.subject,units:"percent"})),units:"percent"},`Use ${t.toLowerCase()} path`)}_subject(e){const t=this._spec;if(e===t.subject)return;const i={subject:e},n="particles"===t.subject,s="particles"===e;if("percent"===t.units&&n!==s&&t.d){const e=s?50:-50;i.d=sa(oa(na(t.d),e,e))}s&&!t.particles&&(i.particles={...Tg,size:[...Tg.size],colors:[]}),this._set(i,"What moves")}_look(e,t){const i=this._spec.particles??Tg;this._set({particles:{...i,size:[...i.size],colors:[...i.colors],...e}},t)}_seg(e,t,i,s){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.value===i),r={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in r))return;e.preventDefault();const a=t[(n+r[e.key]+t.length)%t.length].value,o=e.currentTarget;s(a),requestAnimationFrame(()=>o.querySelector(`[data-val="${a}"]`)?.focus())}}>
      ${t.map(e=>{const t=e.value===i;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          ?disabled=${this.disabled}
          @click=${()=>s(e.value)}
        >
          ${e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}${In(e.label)}
        </button>`})}
    </div>`}_switch(e,t,i,s,r,a=!1){return n.qy`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        <p class="help">${t}</p>
      </div>
      <button
        type="button"
        class="switch ${r}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||a}
        @click=${s}
      ></button>
    </div>`}_templates(){return n.qy`<div class="tiles">
      ${da.map(e=>{const t=function(e){let t=Ig.get(e);if(!t){const i=ha(e),n=ra(na(i))??{x:-40,y:-40,w:80,h:80},s=6;let r=n.w+2*s,a=n.h+2*s;const o=44/30;r/a<o?r=a*o:a=r/o;const l=n.x+n.w/2,c=n.y+n.h/2;t={d:i,box:`${(l-r/2).toFixed(2)} ${(c-a/2).toFixed(2)} ${r.toFixed(2)} ${a.toFixed(2)}`},Ig.set(e,t)}return t}(e.id),i=na(t.d).anchors[0];return n.qy`<button
          type="button"
          class="tile"
          data-template=${e.id}
          title=${In(730,{name:In(e.label).toLowerCase()})}
          ?disabled=${this.disabled}
          @click=${()=>this._template(e.id,In(e.label))}
        >
          <svg viewBox=${t.box} aria-hidden="true">
            <path d=${t.d}></path>
            ${i?n.JW`<circle cx=${i.x} cy=${i.y} r=${t.box.split(" ").map(Number)[2]/18}></circle>`:n.s6}
          </svg>
          <span>${In(e.label)}</span>
        </button>`})}
    </div>`}_pathSection(e){const t=e.anchors.length,i=e.anchors.filter(e=>e.in||e.out).length,s=t>1&&!this.disabled;return n.qy`<section class="sec" aria-label=${In(642)}><div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${In(873)}</span></div>
        ${this._templates()}
      </div>
      <div class="stats" aria-live="polite">
        <span class="chip">${In(1164,{count:t})}</span>
        <span class="chip">${e.closed?In(160):In(607)}</span>
        ${t>1?n.qy`<span class="chip">${In(0===i?901:i===t?203:446)}</span>`:n.s6}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary btn-sm smooth-all" ?disabled=${!s} @click=${()=>this._edit(ia.smoothAll,"Smooth all points")}>
          <ha-icon icon="mdi:vector-curve"></ha-icon>${In(834)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm straighten-all" ?disabled=${!s} @click=${()=>this._edit(ia.straightenAll,"Straighten all points")}>
          <ha-icon icon="mdi:vector-polyline"></ha-icon>${In(902)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm reverse" ?disabled=${!s} @click=${()=>this._edit(aa,"Reverse direction")}>
          <ha-icon icon="mdi:swap-horizontal"></ha-icon>${In(741)}
        </button>
      </div>
      ${this._switch(In(161),In(956),e.closed,()=>{t>1&&this._edit(t=>(0,ia.setClosed)(t,!e.closed),e.closed?In(609):In(159))},"closed-switch",t<2)}
      <ul class="tips help">
        <li>${In(153)}</li>
        <li>${In(250)} ${Bn(1190,{key:n.qy`<kbd>Alt</kbd>`})}</li>
        <li>${In(245)} ${Bn(1191,{key:n.qy`<kbd>${In(220)}</kbd>`})}</li>
        <li>${"px"===this._spec.units?Bn(680,{key:n.qy`<kbd>Shift</kbd>`}):Bn(681,{key:n.qy`<kbd>Shift</kbd>`})}</li>
      </ul>
      <div class="foot">
        <button type="button" class="btn btn-text btn-sm btn-danger clear" ?disabled=${0===t||this.disabled} @click=${()=>this._set({d:""},"Clear path")}>
          <ha-icon icon="mdi:eraser"></ha-icon>${In(148)}
        </button>
      </div>
    </div></section>`}_motionSection(){const e=this._spec;return n.qy`<section class="sec" aria-labelledby="pe-motion">
      <h3 id="pe-motion">${In(451)}</h3>
      <div class="lk-subject" ?inert=${this._locked("subject")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${In(1072)}</span></div>
        ${this._seg(In(1072),Dg,e.subject,e=>this._subject(e))}
        <p class="help">
          ${"particles"===e.subject?In(635):"icon"===e.subject?In(955):In(982)}
        </p>
      </div>
      </div>
      <div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${In(1032)}</span></div>
        ${this._seg(In(1032),Ng,e.units,e=>this._set({units:e},"Units"))}
        <p class="help">${"percent"===e.units?In(676):In(677)}</p>
      </div>
      ${this._switch(In(340),In(1024),e.follow_rotation,()=>this._set({follow_rotation:!e.follow_rotation},"Follow rotation"),"follow-switch")}
      </div>
    </section>`}_particlesSection(){const e=this._spec.particles??Tg,[t,i]=e.size,s=(s,r,a)=>n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${r}</span></div>
      <mc-unit-field
        .value=${`${e.size[s]}px`}
        .label=${r}
        .units=${["px"]}
        .noCustom=${!0}
        .inputId=${a}
        .disabled=${this.disabled}
        @value-changed=${e=>{e.stopPropagation();const n=parseFloat(String(e.detail.value));if(!Number.isFinite(n))return;const r=Math.min(200,Math.max(1,Math.round(n))),a=0===s?[r,Math.max(r,i)]:[Math.min(t,r),r];this._look({size:a},"Particle size")}}
      ></mc-unit-field>
    </div>`;return n.qy`<section class="sec particles" aria-labelledby="pe-particles">
      <h3 id="pe-particles">${In(630)}</h3>
      <div class="field">
        <div class="field-head"><label for="pe-count">${In(193)}</label></div>
        <input
          class="input"
          id="pe-count"
          type="number"
          min="1"
          max=${Ge}
          step="1"
          inputmode="numeric"
          .value=${String(e.count)}
          ?disabled=${this.disabled}
          @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isInteger(i)&&i>=1&&i<=Ge&&this._look({count:i},"Particle count")}}
        />
        <p class="help">${In(844,{particles:Ge})}</p>
      </div>
      <div class="pair">${s(0,In(831),"pe-size-min")} ${s(1,In(401),"pe-size-max")}</div>
      <div class="field">
        <div class="field-head"><span class="lbl">${In(173)}</span></div>
        <div class="colors">
          ${e.colors.map((t,i)=>n.qy`<div class="color-row">
              <mc-color-picker
                .value=${t}
                .label=${In(168,{i:i+1})}
                @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??"").trim();if(!n)return;const s=[...e.colors];s[i]=n,this._look({colors:s},"Particle colour")}}
              ></mc-color-picker>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${In(708,{i:i+1})}
                title=${In(707)}
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:e.colors.filter((e,t)=>t!==i)},"Remove particle colour")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`)}
        </div>
        ${e.colors.length?n.s6:n.qy`<p class="help">${In(566)}</p>`}
        ${e.colors.length<Ye?n.qy`<div>
              <button
                type="button"
                class="btn btn-text btn-sm add-color"
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:[...e.colors,e.colors[e.colors.length-1]??"#ffc107"]},"Add particle colour")}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${In(27)}
              </button>
            </div>`:n.s6}
      </div>
    </section>`}render(){const e=na(this._spec.d),t=["path","subject"].filter(e=>this._locked(e));return n.qy`<div class="ed">
      ${t.length?ho(this.doc,this.layerView,t):n.s6}
      ${this._pathSection(e)} ${this._motionSection()} ${"particles"===this._spec.subject?n.qy`<div class="lk-path" ?inert=${this._locked("path")}>${this._particlesSection()}</div>`:n.s6}
    </div>`}};function Zg(){return i.e(575).then(()=>i(9474)).then(e=>e,e=>{console.warn("Magic Card: path canvas not loaded",e)})}Bg.styles=[Ip,po,n.AH`
      .lk-path,
      .lk-subject {
        display: contents;
      }
      .lk-path[inert] > *,
      .lk-subject[inert] > * {
        opacity: 0.55;
      }
      :host {
        display: block;
        min-width: 0;
      }
      .ed {
        display: grid;
        gap: 16px;
      }
      .sec {
        display: grid;
        gap: 12px;
      }
      .sec + .sec {
        padding-top: 16px;
        border-top: 1px solid var(--mc-divider);
      }
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
        gap: 8px;
      }
      .tile {
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 4px;
        min-height: 64px;
        padding: 8px 4px 6px;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text-2);
        font: inherit;
        font-size: 0.75rem;
        line-height: 1.3;
        cursor: pointer;
        transition: border-color 0.15s ease-out, background-color 0.15s ease-out, color 0.15s ease-out;
      }
      .tile:hover:not(:disabled) {
        background: var(--mc-surface-2);
        border-color: var(--mc-text-2);
        color: var(--mc-text);
      }
      .tile:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .tile:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .tile svg {
        width: ${44}px;
        height: ${30}px;
        overflow: visible;
      }
      .tile path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
      }
      .tile circle {
        fill: currentColor;
      }
      .stats {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .actions .btn {
        flex: 1 1 auto;
      }
      .tips {
        margin: 0;
        padding: 0 0 0 18px;
        display: grid;
        gap: 2px;
      }
      kbd {
        font-family: var(--mc-mono);
        font-size: 0.6875rem;
        padding: 0 4px;
        border-radius: 3px;
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .colors {
        display: grid;
        gap: 8px;
      }
      .color-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .color-row mc-color-picker {
        flex: 1;
        min-width: 0;
      }
      .foot {
        display: flex;
        justify-content: flex-end;
      }
      .btn-danger {
        color: var(--mc-error-ink);
      }
      .btn-danger:hover:not(:disabled) {
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      @media (prefers-reduced-motion: reduce) {
        .tile {
          transition: none;
        }
      }
    `],Rg([(0,s.MZ)({attribute:!1})],Bg.prototype,"doc",void 0),Rg([(0,s.MZ)({attribute:!1})],Bg.prototype,"hass",void 0),Rg([(0,s.MZ)({attribute:!1})],Bg.prototype,"library",void 0),Rg([(0,s.MZ)({type:Number})],Bg.prototype,"time",void 0),Rg([(0,s.MZ)({type:Boolean,reflect:!0})],Bg.prototype,"disabled",void 0),Rg([(0,s.MZ)({attribute:!1})],Bg.prototype,"layerView",void 0),Bg=Rg([(0,s.EM)("mc-anim-path-editor")],Bg);var Kg=i(3706);let Wg=Date.now();const Ug={"Add point":31,"Move point":471,"Move points":472,"Move path":468,"Move handle":466,"Delete point":228,"Delete points":229,"Delete handle":225,"Close path":159,"Change point type":131},Gg=e=>Ug[e]?In(Ug[e]):e;function Yg(e,t){const i=e?.screen;if(!(e&&i&&e.scale>0))return;const n=e.scale;return{left:i.left+t.x*n,top:i.top+t.y*n,width:t.width*n,height:t.height*n}}class Jg extends n.WF{constructor(){super(...arguments),this.canvasState="idle",this._again=!1}ensureCanvas(){if("idle"!==this.canvasState||this._loading)return;this.canvasState="loading";const e=this._again;this._again=!1,this._loading=(e?function(){const e=i,t=e.u,n=++Wg;e.u=e=>{const i=t(e);return`${i}${i.includes("?")?"&":"?"}r=${n}`};try{return Zg()}finally{e.u=t}}():Zg()).then(t=>{this._loading=void 0,t?(()=>{const e="undefined"==typeof customElements?void 0:customElements.get(Kg.eo);return(e?.contractRevision??0)>=8})()?(this.chunk=t,this.canvasState="ready",e&&this.updateComplete.then(()=>this.toolsReady())):this.canvasState="old":this.canvasState="failed"})}retry(){this._again=!0,this.canvasState="idle",this.ensureCanvas()}toolsReady(){}_reload(){confirm(In(705))&&location.reload()}renderNotice(){return"failed"===this.canvasState?n.qy`<p class="host-notice" role="alert">${In(192)}<button type="button" @click=${()=>this.retry()}>${In(1016)}</button></p>`:"old"===this.canvasState?n.qy`<p class="host-notice" role="alert">
        ${In(937)}<button type="button" @click=${()=>this._reload()}>${In(704)}</button>
      </p>`:n.s6}}Jg.styles=n.AH`
    :host {
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      --ch-accent: var(--primary-color, #03a9f4);
      --ch-action: color-mix(in srgb, var(--ch-accent) 70%, #000);
      --ch-ink: var(--primary-text-color, #212121);
      --ch-surface: var(--card-background-color, #fff);
    }
    :host([disabled]) {
      opacity: 0.55;
    }
    .layer,
    mc-path-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .layer {
      pointer-events: none;
      overflow: visible;
    }
    .host-notice {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: calc(100% - 24px);
      margin: 0;
      padding: 6px 6px 6px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      border-radius: 9999px;
      background: var(--ch-surface);
      color: var(--ch-ink);
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.16),
        0 2px 6px rgba(0, 0, 0, 0.08);
      font-size: 0.8125rem;
      pointer-events: auto;
    }
    .host-notice button {
      min-height: 32px;
      padding: 0 12px;
      border: 0;
      border-radius: 9999px;
      background: var(--ch-action);
      color: var(--text-primary-color, #fff);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .host-notice button:focus-visible {
      outline: 2px solid var(--ch-ink);
      outline-offset: 2px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);r>3&&a&&Object.defineProperty(t,i,a)}([(0,s.wk)()],Jg.prototype,"canvasState",void 0);var Xg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Qg=[],ef=new Map,tf=(e,t)=>Object.entries(e).every(([e,i])=>Math.abs(t[e]-i)<.005);let nf=class extends Jg{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._live={anchors:[],closed:!1},this._list=[],this._path={anchors:[],closed:!1},this._announce="",this._onChange=e=>{e.stopPropagation();const t=e.detail,i=t.paths;if(this._setLive(i[0]??{anchors:[],closed:!1}),!t.commit||!this.doc)return;const n=sa(this._live);this._path=this._live,this._d=n;const s=Gg(t.label),r={...this.doc,path:{...this.doc.path??{units:"percent",follow_rotation:!1,subject:"element"},d:n}};this._announce=s,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:r,label:s}}))}}willUpdate(e){if(e.has("doc")){const e=this.doc?.path?.d??"";e!==this._d&&(this._path=na(e),this._d=e,this._setLive(this._path))}"path"===this.doc?.kind&&this.ensureCanvas()}_setLive(e){this._live=e,this._list=e.anchors.length?[e]:[]}_geometry(){const e=this.doc?.path,t=this.stage,i=t?.rect.width??0,n=t?.rect.height??0;if(!(t&&e&&i>0&&n>0))return;const s="px"===e.units,r=this.stage?.subject??this.subjectRect,a="particles"===e.subject,o=!a&&r&&r.width>0&&r.height>0?r:{x:0,y:0,width:i,height:n},l=Yg(t,o);if(!l)return;const c=s?o.width:100,d=s?o.height:100,p=a?{x:0,y:0,w:c,h:d}:{x:-c/2,y:-d/2,w:c,h:d},h=s?"px":"%",u=(e=>"px"===e?10:5)(e.units),m=this._geo;return m&&m.units===h&&m.step===u&&tf(m.frame,p)&&tf(m.place,l)?m:this._geo={frame:p,place:l,units:h,step:u}}_px(e,t){return[e.place.left+(t[0]-e.frame.x)*e.place.width/e.frame.w,e.place.top+(t[1]-e.frame.y)*e.place.height/e.frame.h]}toolsReady(){this._announce=In(936),this.renderRoot.querySelector("mc-path-canvas")?.focus({preventScroll:!0})}_mapD(e){const t=t=>this._px(e,t);return sa({closed:this._path.closed,anchors:this._path.anchors.map(e=>{const[i,n]=t([e.x,e.y]);return{...e,x:i,y:n,in:e.in?t(e.in):void 0,out:e.out?t(e.out):void 0}})})}_arrows(e){const t=this._d??"";return this._path.anchors.length<2||!t?[]:[.25,.5,.75].map(i=>{const s=ca(t,i-.01),r=ca(t,i+.01),a=ca(t,i);if(!s||!r||!a)return n.JW``;const o=this._px(e,[s.x,s.y]),l=this._px(e,[r.x,r.y]),c=this._px(e,[a.x,a.y]);if(Math.hypot(l[0]-o[0],l[1]-o[1])<.5)return n.JW``;const d=180*Math.atan2(l[1]-o[1],l[0]-o[0])/Math.PI;return n.JW`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${c[0].toFixed(1)} ${c[1].toFixed(1)}) rotate(${d.toFixed(1)})"></path>`})}_dot(e,t,i,s,r){const a=ca(t,i);if(!a)return n.s6;const[o,l]=this._px(e,[a.x,a.y]);let c=n.s6;if(s){const s=ca(t,Math.max(0,i-.005)),r=ca(t,Math.min(1,i+.005));if(s&&r){const t=this._px(e,[s.x,s.y]),i=this._px(e,[r.x,r.y]),a=180*Math.atan2(i[1]-t[1],i[0]-t[0])/Math.PI;c=n.JW`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${a.toFixed(1)})"></path>`}}return n.JW`<g class="subject" data-k=${r} transform="translate(${o.toFixed(1)} ${l.toFixed(1)})">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${c}
    </g>`}_subject(e){const t=this._d??"";if(this._path.anchors.length<2)return n.s6;const i=this.doc?.path,s=!!i?.follow_rotation,r=Math.min(1,Math.max(0,Number.isFinite(this.time)?this.time:0)),a="particles"===i?.subject?Math.min(60,Math.max(1,i.particles?.count??3)):1;return Array.from({length:a},(i,n)=>this._dot(e,t,0===n?r:(r+n/a)%1,s,n))}render(){const e=this._geometry();if(!e)return n.qy`${this.renderNotice()}`;const t=this._path.anchors.length,i=this._mapD(e),s=this._px(e,[0,0]),r=t>1?this._px(e,[this._path.anchors[0].x,this._path.anchors[0].y]):void 0,a="ready"===this.canvasState;return n.qy`
      <svg class="layer decor" aria-hidden="true">
        <path class="origin" d="M${s[0]-6} ${s[1]}h12M${s[0]} ${s[1]-6}v12"></path>
        ${i&&t>1?n.JW`<path class="line" d=${i}></path>`:n.s6} ${this._arrows(e)} ${this._subject(e)}
        ${r?n.JW`<text class="tag" x=${r[0]+10} y=${r[1]-9}>${In(870)}</text>`:n.s6}
      </svg>
      ${a?n.qy`<mc-path-canvas
            overlay
            .placement=${e.place}
            .frame=${e.frame}
            .units=${e.units}
            .paths=${this._list}
            .paint=${Qg}
            .mode=${this.disabled?"view":this._live.closed?"nodes":"add"}
            .maxPaths=${1}
            .gridStep=${e.step}
            .snap=${(e=>{let t=ef.get(e);return t||ef.set(e,t={enabled:!0,grid:e,anchors:!1,frame:!1}),t})(e.step)}
            .nudge=${1}
            .bigNudge=${e.step}
            .fineNudge=${.1}
            aria-label=${In(453)}
            @mc-path-change=${this._onChange}
          ></mc-path-canvas>`:n.s6}
      ${0===t&&a&&!this.disabled?n.qy`<p class="hint">${In(156)}</p>`:1===t&&a&&!this.disabled?n.qy`<p class="hint">${In(155)}</p>`:n.s6}
      ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `}};nf.styles=[Jg.styles,n.AH`
      .decor {
        fill: none;
      }
      .origin {
        stroke: color-mix(in srgb, var(--ch-ink) 45%, transparent);
        stroke-width: 1.25;
      }
      .line {
        stroke: var(--ch-accent);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .arrow {
        fill: var(--ch-accent);
        stroke: var(--ch-surface);
        stroke-width: 1;
      }
      .tag {
        font:
          500 10px/1 Roboto,
          system-ui,
          sans-serif;
        fill: var(--ch-ink);
        paint-order: stroke;
        stroke: var(--ch-surface);
        stroke-width: 3px;
        stroke-linejoin: round;
      }
      .subject .body {
        fill: color-mix(in srgb, var(--ch-ink) 14%, transparent);
        stroke: color-mix(in srgb, var(--ch-ink) 75%, transparent);
        stroke-width: 1.5;
        stroke-dasharray: 3 2;
      }
      .subject .core,
      .subject .heading {
        fill: var(--ch-ink);
      }
      .hint {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 6px 12px;
        border-radius: 9999px;
        background: var(--ch-surface);
        color: var(--ch-ink);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.16),
          0 2px 6px rgba(0, 0, 0, 0.08);
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
      }
    `],Xg([(0,s.MZ)({attribute:!1})],nf.prototype,"doc",void 0),Xg([(0,s.MZ)({type:Number})],nf.prototype,"time",void 0),Xg([(0,s.MZ)({type:Boolean,reflect:!0})],nf.prototype,"disabled",void 0),Xg([(0,s.MZ)({attribute:!1})],nf.prototype,"stage",void 0),Xg([(0,s.MZ)({attribute:!1})],nf.prototype,"subjectRect",void 0),Xg([(0,s.MZ)({attribute:!1})],nf.prototype,"hass",void 0),Xg([(0,s.MZ)({attribute:!1})],nf.prototype,"library",void 0),Xg([(0,s.wk)()],nf.prototype,"_live",void 0),Xg([(0,s.wk)()],nf.prototype,"_path",void 0),Xg([(0,s.wk)()],nf.prototype,"_announce",void 0),nf=Xg([(0,s.EM)("mc-anim-path-host")],nf);const sf=e=>Math.round(1e3*e)/1e3;function rf(e){return!!e&&("keyframes"===e.kind||"path"===e.kind&&"particles"!==e.path?.subject)}function af(e){if(!e)return;const t=parseFloat(e);return Number.isFinite(t)?/ms\s*$/i.test(e)?t/1e3:t:void 0}function of(e,t,i){const n=(e??"").trim();if(!n)return{status:"invalid",name:In(546),kind:"",problem:In(652)};if(Ze(n)){const e=Ke(n);if(i&&e===i)return{status:"invalid",name:e,kind:In(792),problem:In(18)};const s=t?.[e];if(!s)return{status:"missing",name:e,kind:"",problem:In(577)};if("keyframes"===s.kind)return{status:"ok",name:s.name||e,kind:In(398),defaultDuration:s.duration};if("path"===s.kind)return rf(s)?{status:"ok",name:s.name||e,kind:In(642),defaultDuration:s.duration}:{status:"invalid",name:s.name||e,kind:In(642),problem:In(631)};const r="particles"===s.kind?In(630):In(792);return{status:"invalid",name:s.name||e,kind:r,problem:In(1192,{kind:r})}}const s=te(n);return s?lt.has(s.id)?{status:"ok",name:(0,T.t)(s.name),kind:In(684),defaultDuration:af(s.defaults.duration)}:{status:"invalid",name:(0,T.t)(s.name),kind:In(684),problem:In(291)}:{status:"missing",name:n,kind:In(684),problem:In(1034)}}function lf(e,t,i){const n=[...e];if(t<0||t>=n.length||i<0||i>=n.length||t===i)return n;const[s]=n.splice(t,1);return n.splice(i,0,s),n}function cf(e){return`${sf(e).toFixed(2).replace(/\.?0+$/,"")} s`}const df={keyframes:"mdi:chart-bell-curve-cumulative",path:"mdi:vector-curve"},pf=e=>(e?.length??0)<20;var hf=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function uf(e){const t=String(e??"").trim();if(!t)return;const i=parseFloat(t);return Number.isFinite(i)?/ms$/i.test(t)?i/1e3:i:void 0}const mf=(e,t,i)=>Math.min(i,Math.max(t,e)),gf=e=>Math.round(1e3*e)/1e3;let ff=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._open=-1,this._query="",this._announce="",this._pick=null,this._trigger=null,this._focusSearch=!1,this._onDragKey=e=>{"Escape"===e.key&&this._drag&&(e.preventDefault(),e.stopPropagation(),this._cancelDrag())}}get _steps(){return this.doc?.steps??[]}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_remap(e){const t=this.layerView,i=t&&e(t);i&&i!==t&&this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:i},bubbles:!0,composed:!0}))}_writeSteps(e,t,i=!1){this.doc&&this._emit({...this.doc,steps:e},t,i)}_patchStep(e,t,i){const n=this._steps.map((i,n)=>{if(n!==e)return i;const s={...i,...t};return void 0===t.duration&&"duration"in t&&delete s.duration,s});this._writeSteps(n,i)}_addStep(e){if(!pf(this._steps))return;const t=[...this._steps,{animation:e,delay:0,repeat:1}];this._open=t.length-1,this._focusAfter={index:t.length-1,part:"toggle"},this._writeSteps(t,"Add step"),this._announce=In(892,{count:t.length,name:of(e,this.library,this.doc?.id).name})}_locked(e,t=!1){const i=!!this.layerView?.locked.includes(`step:${e}`);return i&&t&&(this._announce=In(897,{i:e+1})),i}_deleteStep(e){if(this._steps.length<=1||this._locked(e,!0))return;const t=this._steps.filter((t,i)=>i!==e);this._open===e?this._open=-1:this._open>e&&this._open--,this._focusAfter=t.length?{index:Math.min(e,t.length-1),part:"toggle"}:void 0,this._writeSteps(t,"Delete step"),this._remap(t=>function(e,t){return co(e,e=>e===t?-1:e>t?e-1:e)}(t,e)),this._announce=In(893,{index:e+1})}_move(e,t,i="handle"){const n=this._steps.length;e===t||t<0||t>=n||this._locked(e,!0)||(this._open=this._followMove(this._open,e,t),this._focusAfter={index:t,part:i},this._writeSteps(lf(this._steps,e,t),"Move step"),this._remap(i=>lo(i,e,t)),this._announce=In(891,{to:t+1,n}))}_followMove(e,t,i){return e<0?e:e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}_onHandleDown(e,t){if(this.disabled||0!==e.button||this._steps.length<2||this._locked(t,!0))return;const i=[...this.renderRoot.querySelectorAll(".step")];if(!i[t])return;e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId);const n=i.map(e=>e.getBoundingClientRect()),s=n[t+1]??n[t-1],r=s?Math.abs(t+1<n.length?s.top-n[t].bottom:n[t].top-s.bottom):0;this._drag={from:t,to:t,dy:0,startY:e.clientY,pointerId:e.pointerId,mids:n.map(e=>e.top+e.height/2),shift:n[t].height+r,steps:this._steps,moved:!1},window.addEventListener("keydown",this._onDragKey,!0)}_endDrag(){const e=this._drag;return this._drag=void 0,window.removeEventListener("keydown",this._onDragKey,!0),e}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_onHandleMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=e.clientY-t.startY,n=e.clientY;let s=t.from;for(let e=t.from+1;e<t.mids.length;e++)n>t.mids[e]&&(s=e);for(let e=t.from-1;e>=0;e--)n<t.mids[e]&&(s=e);const r=s!==t.to;this._drag={...t,dy:i,to:s,moved:t.moved||r},r&&this.doc&&this._emit({...this.doc,steps:lf(t.steps,t.from,s)},"Move step",!0)}_onHandleUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._endDrag(),t.to!==t.from&&(this._open=this._followMove(this._open,t.from,t.to),this._focusAfter={index:t.to,part:"handle"},this.doc&&this._emit({...this.doc,steps:lf(t.steps,t.from,t.to)},"Move step"),this._remap(e=>lo(e,t.from,t.to)),this._announce=In(890,{to:t.to+1,count:t.steps.length})))}_cancelDrag(){const e=this._endDrag();e&&e.moved&&this.doc&&this._emit({...this.doc,steps:e.steps},"Move step")}_onStepKey(e,t){if(!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key||this.disabled)return;e.preventDefault();const i=e.target.classList?.contains("handle");this._move(t,t+("ArrowUp"===e.key?-1:1),i?"handle":"toggle")}_dragOffset(e){const t=this._drag;return t?e===t.from?t.dy:t.from<t.to&&e>t.from&&e<=t.to?-t.shift:t.to<t.from&&e>=t.to&&e<t.from?t.shift:0:0}_popover(){return this.renderRoot.querySelector("mc-ui-popover.pick-pop")}_openPicker(e,t){if(this.disabled)return;const i=e.currentTarget;this._pick&&this._trigger===i?this._popover()?.close("action"):(this._trigger=i,this._pick=t,this._query="",this._focusSearch=!0)}_choose(e){const t=this._pick;this._popover()?.close("action"),this._pick=null,t&&("add"===t.mode?this._addStep(e):this._steps[t.index]?.animation!==e&&this._patchStep(t.index,{animation:e},"Change step animation"))}_onPickKey(e){const t="INPUT"===e.target.tagName;if(t&&("Home"===e.key||"End"===e.key))return;const i=[...this.renderRoot.querySelectorAll('.pick-pop [role="menuitem"]')],n=this.renderRoot.querySelector(".pick-pop .pick-search input"),s=i.indexOf(e.target),r=t=>{t&&(e.preventDefault(),t.focus())};"ArrowDown"===e.key?r(t?i[0]:i[Math.min(i.length-1,s+1)]):"ArrowUp"===e.key?r(s<=0?n:i[s-1]):"Home"===e.key?r(i[0]):"End"===e.key&&r(i[i.length-1])}_renderPicker(){const e=this._pick,t="step"===e?.mode?this._steps[e.index]?.animation:void 0,i=function(e,t,i=""){const n=(0,kt.A)(i.trim()),s=(...e)=>!n||e.some(e=>e&&(0,kt.A)(e).includes(n)),r=[],a=Object.values(e??{}).filter(e=>e.id!==t&&rf(e)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).filter(e=>s(e.name,e.id,In(1119),e.kind)).map(e=>({value:Be+e.id,name:e.name||e.id,kind:"path"===e.kind?In(642):In(398),icon:df[e.kind],duration:e.duration}));a.length&&r.push({label:In(531),items:a});for(const e of X){const t=J.filter(t=>t.group===e&&lt.has(t.id)&&s((0,T.t)(t.name),t.id,e,(0,T.t)(Q[e]))).map(e=>({value:e.id,name:(0,T.t)(e.name),icon:"mdi:motion-play-outline",duration:af(e.defaults.duration)}));t.length&&r.push({label:(0,T.t)(Q[e]),items:t})}return r}(this.library,this.doc?.id,this._query),s=In("add"===e?.mode?36:889);return n.qy`
      <mc-ui-popover
        class="pick-pop"
        label=${s}
        .anchor=${this._trigger}
        @mc-popover-close=${e=>{e.stopPropagation(),this._pick=null,this._query=""}}
      >
        <div class="pick" @keydown=${e=>this._onPickKey(e)}>
          <div class="pick-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${In(772)}
              aria-label=${In(772)}
              autocomplete="off"
              .value=${this._query}
              @input=${e=>this._query=e.target.value}
            />
          </div>
          <div class="pick-list" role="menu" aria-label=${s}>
            ${i.length?i.map(e=>n.qy`
                    <div class="pick-group" role="group" aria-label=${e.label}>
                      <div class="pick-head" aria-hidden="true">${e.label}</div>
                      ${e.items.map(e=>n.qy`<button
                          type="button"
                          role="menuitem"
                          class="pick-item ${e.value===t?"is-current":""}"
                          data-value=${e.value}
                          @click=${()=>this._choose(e.value)}
                        >
                          <ha-icon icon=${e.icon}></ha-icon>
                          <span class="pick-name">${e.name}${e.kind?n.qy`<span class="pick-kind"> · ${e.kind}</span>`:n.s6}</span>
                          ${void 0!==e.duration?n.qy`<span class="pick-dur">${cf(e.duration)}</span>`:n.s6}
                          ${e.value===t?n.qy`<ha-icon class="pick-check" icon="mdi:check"></ha-icon>`:n.s6}
                        </button>`)}
                    </div>
                  `):n.qy`<p class="menu-note">${In(547,{query:this._query})}</p>`}
          </div>
        </div>
      </mc-ui-popover>
    `}_field(e,t,i){return n.qy`<div class="field">
      <div class="field-head">${i?n.qy`<label for=${i}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}</div>
      ${t}
    </div>`}_renderSchedule(e){const t=e.total,i=function(e,t){if(!e.total)return-1;const i=Math.min(1,Math.max(0,t))*e.total,n=e.entries.find(t=>t.play>0&&i>=t.start&&(i<t.end||i===t.end&&t.end===e.total));return n?n.index:-1}(e,this.time),s=e=>t?e/t*100:0,r=this._steps.length,a=e.entries.filter(e=>"ok"!==e.status).length,o=!1!==this.doc?.loop,l=this._drag?this._followMove(this._open,this._drag.from,this._drag.to):this._open,c=new Map,d=t?In(1254,{steps:In(1167,{count:r}),total:cf(t),loop:In(o?1118:1126),skipped:a?In(5,{count:a}):""}):In(590);return n.qy`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${e.entries.map(e=>{if("ok"!==e.status){const t=c.get(e.start)??0;return c.set(e.start,t+1),n.qy`<span class="mark" style="left:calc(${s(e.start)}% + ${8*t}px)" title=${In(894,{index:e.index+1})} @click=${()=>this._reveal(e.index)}></span>`}const t=["blk",e.index===l?"is-open":"",e.index===i?"is-live":""].join(" "),r=s(e.end-e.start);return n.qy`<span
              class=${t}
              style="left:${s(e.start)}%;width:${r}%;--plays:${e.repeat}"
              title=${In(895,{index:e.index+1,from:cf(e.start),to:cf(e.end)})}
              @click=${()=>this._reveal(e.index)}
              >${r>=6?e.index+1:""}</span
            >`})}
          ${t?n.qy`<span class="playhead" style="left:${100*mf(this.time,0,1)}%"></span>`:n.s6}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${o?n.qy`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>${In(436)}</span>`:n.s6}
          <span>${cf(t)}</span>
        </div>
        <p class="sr-only">${d}</p>
      </div>
    `}_reveal(e){this._open=e,this.updateComplete.then(()=>this.renderRoot.querySelector(`.step[data-i="${e}"]`)?.scrollIntoView({block:"nearest"}))}_renderStep(e,t,i){const s=of(e.animation,this.library,this.doc?.id),r=this._open===t,a="ok"!==s.status,o=e=>`seq-${t}-${e}`,l=a?"missing"===s.status?In(576):In(117):function(e,t){const i=[];e.delay>0&&i.push(In(1087,{seconds:cf(e.delay)}));const n=e.duration??t.defaultDuration;return void 0!==n&&i.push(cf(n)),e.repeat>1&&i.push(`× ${e.repeat}`),i.join(" · ")}(e,s),c=this._drag?.from===t,d=this._dragOffset(t),p=void 0!==s.defaultDuration?String(gf(s.defaultDuration)):"",h=this._locked(t);return n.qy`
      <li
        class="step ${r?"is-open":""} ${a?"is-bad":""} ${c?"is-dragging":""}"
        data-i=${t}
        style=${d?`transform: translateY(${d}px)`:""}
        @keydown=${e=>this._onStepKey(e,t)}
      >
        <div class="row">
          <button
            type="button"
            class="icon-btn sm handle"
            aria-label=${In(476,{i:t+1})}
            aria-describedby="seq-move-hint"
            title=${In(255)}
            ?disabled=${this.disabled||h||i<2}
            @pointerdown=${e=>this._onHandleDown(e,t)}
            @pointermove=${e=>this._onHandleMove(e)}
            @pointerup=${e=>this._onHandleUp(e)}
            @pointercancel=${()=>this._cancelDrag()}
            @lostpointercapture=${e=>this._onHandleUp(e)}
          >
            <ha-icon icon="mdi:drag-vertical"></ha-icon>
          </button>
          <button
            type="button"
            class="toggle"
            aria-expanded=${r?"true":"false"}
            aria-controls=${o("body")}
            @click=${()=>this._open=r?-1:t}
          >
            <span class="num">${t+1}</span>
            <span class="txt">
              <span class="nm">${s.name}</span>
              <span class="sum ${a?"error":""}">${a?n.qy`<ha-icon icon="mdi:alert-circle-outline"></ha-icon>`:n.s6}${l}</span>
            </span>
            <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${In(234,{i:t+1})}
            title=${In(i<=1?20:233)}
            ?disabled=${this.disabled||h||i<=1}
            @click=${()=>this._deleteStep(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${r?n.qy`<div class="body" id=${o("body")}>
              ${h?ho(this.doc,this.layerView,[`step:${t}`]):n.s6}
              ${a?n.qy`<p class="help error problem" role="note">${s.problem}</p>`:n.s6}
              ${this._field(In(65),n.qy`<button
                  type="button"
                  class="input pick-btn"
                  id=${o("anim")}
                  aria-haspopup="menu"
                  aria-expanded=${"step"===this._pick?.mode&&this._pick.index===t?"true":"false"}
                  ?disabled=${this.disabled||h}
                  @click=${e=>this._openPicker(e,{mode:"step",index:t})}
                >
                  <span class="pick-val">${s.name}${s.kind&&s.kind!==In(684)?n.qy`<span class="pick-kind"> · ${s.kind}</span>`:n.s6}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,o("anim"))}
              <div class="fields">
                ${this._field(In(216),n.qy`<mc-unit-field
                    .value=${e.delay?`${gf(e.delay)}s`:""}
                    .label=${In(216)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${"0"}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation(),this._patchStep(t,{delay:mf(gf(uf(e.detail.value)??0),0,600)},"Change step delay")}}
                  ></mc-unit-field>`)}
                ${this._field(In(283),n.qy`<mc-unit-field
                    .value=${void 0!==e.duration?`${gf(e.duration)}s`:""}
                    .label=${In(283)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${p}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation();const i=uf(e.detail.value);this._patchStep(t,{duration:void 0===i||i<=0?void 0:mf(gf(i),.05,600)},"Change step duration")}}
                  ></mc-unit-field>`)}
                ${this._field(In(672),n.qy`<input
                    class="input"
                    id=${o("plays")}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    .value=${String(e.repeat)}
                    ?disabled=${this.disabled||h}
                    @change=${i=>{const n=i.target,s=Math.round(Number(n.value));if(!n.value.trim()||!Number.isFinite(s))return void(n.value=String(e.repeat));const r=mf(s,1,100);n.value=String(r),r!==e.repeat&&this._patchStep(t,{repeat:r},"Change step plays")}}
                  />`,o("plays"))}
              </div>
              <p class="help">${p?In(218,{seconds:p}):In(219)}</p>
            </div>`:n.s6}
      </li>
    `}render(){const e=this.doc;if(!e)return n.qy``;const t=this._drag?this._drag.steps:this._steps,i=function(e,t,i){const n=[];let s=0;return(e??[]).forEach((e,r)=>{const a=of(e.animation,t,i),o="ok"===a.status?e.duration??a.defaultDuration??0:0,l=Math.max(1,Math.round(e.repeat||1));if(!o)return void n.push({index:r,status:"ok"===a.status?"invalid":a.status,start:sf(s),play:0,repeat:l,end:sf(s)});const c=s+Math.max(0,e.delay||0),d=c+o*l;n.push({index:r,status:"ok",start:sf(c),play:sf(o),repeat:l,end:sf(d)}),s=d}),{entries:n,total:sf(s)}}(this._drag?lf(this._drag.steps,this._drag.from,this._drag.to):t,this.library,e.id),s=!1!==e.loop,r=e.stagger??{children:!1,delay:.15},a=!pf(t);return n.qy`
      <div class="wrap">
        <section class="group" aria-label=${In(771)}>${this._renderSchedule(i)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">${In(666)}</h3>
            <span class="chip is-count" title=${In(1253,{steps:20})}>${t.length} / ${20}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">${In(257)}</p>
          ${t.length?n.qy`<ol class="steps ${this._drag?"is-sorting":""}">${t.map((e,i)=>this._renderStep(e,i,t.length))}</ol>`:n.qy`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>${In(562)}</strong>
                <p>${In(37)}</p>
              </div>`}
          <div class="foot">
            <button
              type="button"
              class="btn btn-text btn-sm add"
              aria-haspopup="menu"
              aria-expanded=${"add"===this._pick?.mode?"true":"false"}
              ?disabled=${this.disabled||a}
              @click=${e=>this._openPicker(e,{mode:"add"})}
            >
              <ha-icon icon="mdi:plus"></ha-icon>${In(36)}
            </button>
            ${a?n.qy`<span class="help">${In(1252,{steps:20})}</span>`:n.s6}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">${In(669)}</h3></div>
          <div class="switch-row">
            <div class="txt">
              ${In(432)}
              <p class="help">${In(871)}</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${s?"true":"false"}
              aria-label=${In(432)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,loop:!s},In(s?433:434))}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              ${In(866)}
              <p class="help">${In(665)}</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${r.children?"true":"false"}
              aria-label=${In(866)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,stagger:{...r,children:!r.children}},r.children?In(867):In(868))}
            ></button>
          </div>
          ${r.children?this._field(In(217),n.qy`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${gf(r.delay)}s`}
                  .label=${In(217)}
                  .units=${["s"]}
                  .noCustom=${!0}
                  .placeholder=${"0"}
                  ?disabled=${this.disabled}
                  @value-changed=${t=>{t.stopPropagation(),this._emit({...e,stagger:{...r,delay:mf(gf(uf(t.detail.value)??0),0,10)}},"Change stagger delay")}}
                ></mc-unit-field>`):n.s6}
        </section>
        <div class="sr-only" aria-live="polite">${this._announce}</div>
        ${this._pick?this._renderPicker():n.s6}
      </div>
    `}willUpdate(e){e.has("doc")&&this._open>=this._steps.length&&(this._open=-1)}updated(){const e=this._pick?this._popover():null;e&&!e.open&&(e.anchor=this._trigger,e.show()),this._focusSearch&&e&&(this._focusSearch=!1,e.updateComplete.then(()=>this.renderRoot.querySelector(".pick-pop .pick-search input")?.focus({preventScroll:!0})));const t=this._focusAfter;t&&(this._focusAfter=void 0,this.renderRoot.querySelector(`.step[data-i="${t.index}"] .${t.part}`)?.focus())}};ff.styles=[Ip,po,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      :host([disabled]) .steps,
      :host([disabled]) .sched {
        opacity: 0.6;
      }
      .wrap {
        display: grid;
        gap: 0;
      }
      .group + .group {
        margin-top: 20px;
      }
      .group-head .chip {
        flex: none;
      }

      /* ── schedule bar ── */
      .sched {
        display: grid;
        gap: 6px;
      }
      .bar {
        position: relative;
        height: 32px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
      }
      .blk {
        position: absolute;
        top: 4px;
        bottom: 4px;
        min-width: 3px;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text);
        cursor: pointer;
        background-color: color-mix(in srgb, var(--mc-text) 16%, var(--mc-surface));
        /* one segment per play, split by a 2px gap in the track colour */
        background-image: linear-gradient(to right, transparent calc(100% - 2px), var(--mc-surface-2) 0);
        background-size: calc(100% / var(--plays, 1)) 100%;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mc-text) 22%, transparent);
        transition: background-color 0.15s ease-out;
      }
      .blk:hover {
        background-color: color-mix(in srgb, var(--mc-text) 26%, var(--mc-surface));
      }
      .blk.is-live {
        background-color: color-mix(in srgb, var(--mc-text) 30%, var(--mc-surface));
      }
      .blk.is-open {
        background-color: var(--mc-accent-fill);
        color: var(--mc-on-accent);
        box-shadow: none;
      }
      .mark {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 6px;
        margin-left: -3px;
        border-radius: 3px;
        cursor: pointer;
        background: repeating-linear-gradient(45deg, var(--mc-error-ink) 0 2px, transparent 2px 4px);
        box-shadow: inset 0 0 0 1px var(--mc-error-ink);
      }
      .playhead {
        position: absolute;
        top: -5px;
        bottom: -5px;
        width: 2px;
        margin-left: -1px;
        background: var(--mc-accent);
        border-radius: 1px;
        pointer-events: none;
      }
      .playhead::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--mc-accent);
      }
      .ruler {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .ruler .loop {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }

      /* ── steps ── */
      .steps {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 8px;
      }
      .step {
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
        min-width: 0;
      }
      .steps.is-sorting .step {
        transition: transform 0.15s ease-out;
      }
      .steps.is-sorting .step.is-dragging {
        transition: none;
        position: relative;
        z-index: 2;
        box-shadow: var(--mc-shadow-float);
      }
      .step.is-bad {
        border-color: color-mix(in srgb, var(--mc-error-ink) 55%, transparent);
      }
      .row {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 4px;
        min-height: 48px;
      }
      .handle {
        cursor: grab;
        touch-action: none;
      }
      .is-dragging .handle {
        cursor: grabbing;
      }
      .toggle {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 40px;
        padding: 4px 6px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        text-align: left;
      }
      .toggle:hover {
        background: var(--mc-surface-2);
      }
      .toggle:focus-visible {
        outline-offset: -2px;
      }
      .num {
        flex: none;
        display: inline-grid;
        place-items: center;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        border-radius: 9999px;
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .step.is-open .num {
        background: var(--mc-accent-fill);
        border-color: transparent;
        color: var(--mc-on-accent);
      }
      .txt {
        flex: 1;
        min-width: 0;
        display: grid;
      }
      .nm {
        font-size: 0.875rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .sum {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }
      .sum.error {
        color: var(--mc-error-ink);
      }
      .chev {
        flex: none;
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .toggle[aria-expanded='true'] .chev {
        transform: rotate(180deg);
      }
      .body {
        display: grid;
        gap: 16px;
        padding: 4px 12px 16px;
      }
      .problem {
        padding: 8px 10px;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 128px), 1fr));
        gap: 16px 12px;
      }
      .pick-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        text-align: left;
        cursor: pointer;
      }
      .pick-btn .pick-val {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pick-btn > ha-icon {
        flex: none;
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
      }
      .pick-kind {
        color: var(--mc-text-2);
        font-weight: 400;
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 12px;
      }

      /* ── step picker (the kit popover) ── */
      .pick {
        display: grid;
        width: min(320px, calc(100vw - 40px));
        font-size: 0.875rem;
      }
      .pick-search {
        position: relative;
        display: flex;
        align-items: center;
        padding-bottom: 6px;
      }
      .pick-search > ha-icon {
        position: absolute;
        left: 10px;
        --mdc-icon-size: 18px;
        color: var(--mc-text-2);
        pointer-events: none;
      }
      .pick-search .input {
        padding-left: 36px;
      }
      .pick-list {
        display: grid;
        align-content: start;
        max-height: min(340px, 50vh);
        overflow: auto;
        overscroll-behavior: contain;
      }
      .pick-group {
        display: grid;
      }
      .pick-head {
        padding: 10px 12px 4px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .pick-item {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-height: var(--mc-hit, 40px);
        padding: 0 12px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: pointer;
      }
      .pick-item:hover,
      .pick-item:focus-visible {
        background: var(--mc-surface-2);
      }
      .pick-item:focus-visible {
        outline: 2px solid var(--mc-focus, var(--mc-accent));
        outline-offset: -2px;
      }
      .menu-note {
        margin: 0;
        padding: 8px 12px;
        color: var(--mc-text-2);
        font-size: 0.8125rem;
      }
      .pick-name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pick-dur {
        flex: none;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        font-variant-numeric: tabular-nums;
      }
      .pick-item.is-current {
        color: var(--mc-accent-ink);
        font-weight: 500;
      }
      .pick-item .pick-check {
        color: var(--mc-accent-ink);
      }
    `],hf([(0,s.MZ)({attribute:!1})],ff.prototype,"doc",void 0),hf([(0,s.MZ)({attribute:!1})],ff.prototype,"hass",void 0),hf([(0,s.MZ)({attribute:!1})],ff.prototype,"library",void 0),hf([(0,s.MZ)({type:Number})],ff.prototype,"time",void 0),hf([(0,s.MZ)({type:Boolean,reflect:!0})],ff.prototype,"disabled",void 0),hf([(0,s.MZ)({attribute:!1})],ff.prototype,"layerView",void 0),hf([(0,s.wk)()],ff.prototype,"_open",void 0),hf([(0,s.wk)()],ff.prototype,"_drag",void 0),hf([(0,s.wk)()],ff.prototype,"_query",void 0),hf([(0,s.wk)()],ff.prototype,"_announce",void 0),hf([(0,s.wk)()],ff.prototype,"_pick",void 0),ff=hf([(0,s.EM)("mc-anim-sequence-editor")],ff);const vf={hide:{name:363,tip:[364,819],key:"H",icon:["mdi:eye-outline","mdi:eye-off-outline"]},solo:{name:840,tip:[841,301],key:"S",icon:["mdi:radiobox-blank","mdi:radiobox-marked"]},lock:{name:428,tip:[428,1036],key:"L",icon:["mdi:lock-open-variant-outline","mdi:lock-outline"]}},bf=["hide","solo","lock"],yf={hide:[1218,1231],solo:[1232,1229],lock:[1223,1233]};let xf="";function _f(e,t){const i=t??e.closest(".layers-body");return(i?[...i.querySelectorAll("[data-panel] > *")]:[e]).flatMap(e=>[...e.shadowRoot?.querySelectorAll("[data-lk]")??[]])}function $f(e){const t=_f(e),i=t.find(e=>e.dataset.lk===xf)??t.find(e=>"true"===e.getAttribute("aria-pressed"))??t[0];for(const e of t){const t=e===i;e.tabIndex=t?0:-1,e.closest("li")?.querySelectorAll("[data-ctl]").forEach(e=>e.tabIndex=t?0:-1)}}class wf{constructor(e,t){this.host=e,this.actions=t,this._n=0,e.addController(this)}hostUpdated(){$f(this.host);const e=this._focus,t=this.host.renderRoot?.querySelector("mc-ui-menu");t&&this._menu?.first&&(this._menu.first=!1,t.anchor=this.host.renderRoot?.querySelector(`li[data-ref="${this._menu.key}"] [data-ctl="menu"]`)??void 0,t.show()),e&&this._refocus(e)}get view(){return this.host.layerView??Ka}announce(e,t=this.view){this.host.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:t,announce:e},bubbles:!0,composed:!0}))}locked(e){return!!this.host.doc&&no(this.host.doc,this.view,e)}refuseLocked(e,t){return!!this.locked(e)&&(this.announce(In(1219,{name:t})),!0)}setOpen(e,t){const i=this.view;i.open.includes(e)!==t&&this.announce("",{...i,open:t?[...i.open,e]:i.open.filter(t=>t!==e)})}toggle(e,t,i){const n=function(e,t,i){const n=io[i];return{...e,[n]:e[n].includes(t)?e[n].filter(e=>e!==t):[...e[n],t]}}(this.view,e,i),s=n["hide"===i?"hidden":"solo"===i?"solo":"locked"].includes(e);this.announce(In(yf[i][s?0:1],{name:t}),n)}focusKey(e,t){this._focus={key:e,ctl:t},this._refocus(this._focus),this.host.requestUpdate()}async _refocus(e,t=0){await this.host.updateComplete;const i=_f(this.host).find(t=>t.dataset.lk===e.key),n=i?e.ctl?i.closest("li")?.querySelector(`[data-ctl="${e.ctl}"]`):i:void 0;n?(this._focus===e&&(this._focus=void 0),xf=e.key,n.focus(),n.scrollIntoView?.({block:"nearest"})):t<4&&this._focus===e?setTimeout(()=>{this._refocus(e,t+1)},16):this._focus===e&&(this._focus=void 0)}_key(e,t){const i=e.target;if(!i.matches?.("[data-lk]")||e.ctrlKey||e.metaKey)return;const n=_f(this.host),s=n.indexOf(i),r=t=>{e.preventDefault(),n[Math.max(0,Math.min(n.length-1,t))]?.focus()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key))return e.preventDefault(),void this._move(t,"ArrowUp"===e.key?"up":"down");if(!e.altKey){if(!e.shiftKey&&"ArrowUp"===e.key)return r(s-1);if(!e.shiftKey&&"ArrowDown"===e.key)return r(s+1);if("Home"===e.key)return r(0);if("End"===e.key)return r(n.length-1);if("ArrowRight"===e.key&&!1===t.expanded)e.preventDefault(),this.actions.open?.(t.key,!0);else if("ArrowLeft"===e.key)if(t.expanded)e.preventDefault(),this.actions.open?.(t.key,!1);else{const i=this.host.doc?to(this.host.doc,t.key):void 0;i&&(e.preventDefault(),this.focusKey(i))}else if("F2"===e.key&&t.renamable&&this.actions.rename)e.preventDefault(),this._rename(t);else if(!e.shiftKey&&1===e.key.length){const i=bf.find(t=>vf[t].key===e.key.toUpperCase());i&&this._toggles(t).includes(i)&&(e.preventDefault(),this.toggle(t.key,t.name,i))}}}_toggles(e){return e.toggles??Za[e.key.split(":")[0]]??[]}_move(e,t,i){const n="up"===t?e.up:e.down;n?.ok&&this.actions.move&&(this.refuseLocked(e.key,e.name)||(this.actions.move(e.key,t),this.focusKey(e.key,i)))}_rename(e){this.refuseLocked(e.key,e.name)||this.actions.rename?.(e.key)}_openMenu(e,t=!0){this._menu={key:e,first:t},this.host.requestUpdate()}_toggleMenu(e){if(this._menu?.key===e)return this._closeMenu();const t=this._outsideAt;this._outsideAt=void 0,t&&t.key===e&&Date.now()-t.at<400||this._openMenu(e)}_closeMenu(e=!0){const t=this._menu?.key;this._menu=void 0,this.host.requestUpdate(),t&&e&&this.focusKey(t,"menu")}_menuItems(e){const t=this.locked(e.key),i=[];if(this.actions.move)for(const n of["up","down"]){const s="up"===n?e.up:e.down;if(!s)continue;const r=s.menu??s.label,a=t?In(429):s.ok?void 0:In("up"===n?50:49);i.push({id:`move-${n}`,icon:"up"===n?"mdi:arrow-up":"mdi:arrow-down",label:t?r.replace(/ \(.*\)$/,""):r,reason:a,keys:In("up"===n?55:54),run:()=>this._move(e,n,"menu")})}e.renamable&&this.actions.rename&&i.push({id:"rename",icon:"mdi:rename-outline",label:In(721),reason:t?In(429):void 0,keys:"F2",run:()=>this._rename(e)});const n=this.view;return bf.filter(t=>this._toggles(e).includes(t)).forEach((t,s)=>{const r=n["hide"===t?"hidden":"solo"===t?"solo":"locked"].includes(e.key);i.push({id:t,icon:r?"mdi:checkbox-marked":"mdi:checkbox-blank-outline",label:In(vf[t].name),checked:r,keys:vf[t].key,separatorBefore:0===s&&i.length>0,run:()=>this.toggle(e.key,e.name,t)})}),i}_renderMenu(e){const t=this._menuItems(e);return n.qy`<mc-ui-menu
      .items=${t}
      .align=${"end"}
      label=${In(406,{name:e.name})}
      @mc-menu-pick=${e=>{e.stopPropagation();const i=t.find(t=>t.id===e.detail.id);this._closeMenu(),i?.run()}}
      @mc-menu-close=${e=>{e.stopPropagation();const t=e.detail.reason;"pick"!==t&&("outside"===t&&this._menu&&(this._outsideAt={key:this._menu.key,at:Date.now()}),this._closeMenu(!1))}}
    ></mc-ui-menu>`}row(e){const t=this.host,i=t.doc,s=this.view,r="compact"===t.density,a=this._toggles(e),o=i?function(e,t,i){if(t.hidden.includes(i))return{kind:"self"};const n=eo(e,t);if(n.has(i))return{kind:"solo"};for(let t=to(e,i),s=0;t&&s<4;t=to(e,t),s++)if(n.has(t))return{kind:"parent",by:t}}(i,s,e.key):void 0,l=s.solo.includes(e.key),c=s.locked.includes(e.key),d=!c&&this.locked(e.key),p=i&&!1===e.expanded?function(e,t,i){const n=eo(e,t);let s=0;for(const r of Xa(e).keys())to(e,r)===i&&(n.has(r)||t.solo.includes(r))&&s++;return s}(i,s,e.key):0,h=[e.describe,"self"===o?.kind&&In(1106),"solo"===o?.kind&&In(1104),"parent"===o?.kind&&In(1105,{name:(e=>e?this.actions.nameOf?.(e)??e.split(":").slice(1).join(":"):"")(o.by)}),l&&"solo",c&&"locked",d&&In(1117),p>0&&In(1149,{below:p})].filter(Boolean),u="ld"+this._n++,m=c||d,g=t=>{const i="up"===t?e.up:e.down;return i?n.qy`<button type="button" class="icon-btn xs lt mv ${t}" data-ctl=${t} tabindex="-1" aria-label=${i.label} title=${i.label} aria-disabled=${i.ok&&!m?n.s6:"true"} @click=${()=>this._move(e,t,t)}>
        <ha-icon icon=${"up"===t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>`:n.s6},f=a.length>0||!!e.up||!!e.down||e.renamable&&!!this.actions.rename,v=r?n.s6:n.qy`<span class="lfull">${a.length?bf.filter(e=>a.includes(e)).map(t=>{const i="hide"===t?"self"===o?.kind:"solo"===t?l:c,s=!i&&("hide"===t?!!o:"lock"===t&&d),r=vf[t];return n.qy`<button type="button" class="icon-btn xs lt ${s?"soft":""}" data-ctl=${t} data-toggle=${t} tabindex="-1" aria-pressed=${i?"true":"false"} aria-label=${In(r.name)} title=${"hide"===t&&!i&&e.key.startsWith("lane:")?In(365):In(r.tip[i?1:0])} @click=${()=>this.toggle(e.key,e.name,t)}>
        <ha-icon icon=${r.icon[i||s?1:0]}></ha-icon>
      </button>`}):n.s6}${g("up")}${g("down")}</span>`;return n.qy`<li class="lr lvl-${e.level??1} ${r?"compact":""} ${e.selected?"sel":""} ${o?"is-hidden":""} ${m?"is-locked":""}" data-ref=${e.key} data-id=${e.key.slice(e.key.indexOf(":")+1)} @dblclick=${()=>this.actions.dblclick?.(e.key)} @keydown=${t=>this._key(t,e)}>
      <div class="lr-in">
        ${void 0===e.expanded?n.qy`<span class="lcaret-space"></span>`:n.qy`<button type="button" class="icon-btn xs lt lcaret" tabindex="-1" aria-label=${e.expanded?In(163,{name:e.name}):In(310,{name:e.name})} @click=${()=>this.actions.open?.(e.key,!e.expanded)}>
              <ha-icon icon=${e.expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${e.key} tabindex="-1" aria-pressed=${e.selected?"true":"false"} aria-expanded=${void 0===e.expanded?n.s6:e.expanded?"true":"false"} aria-describedby=${h.length?u:n.s6} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${(e.title??e.name)+(e.badge&&!e.title?` (${e.badge})`:"")} @focus=${e=>(xf=e.currentTarget.dataset.lk,$f(t))} @click=${t=>this.actions.select(e.key,t)}>
          ${e.thumb??(e.bare?n.s6:n.qy`<ha-icon class="kind" icon=${e.icon??"mdi:layers-outline"}></ha-icon>`)}
          ${e.renaming?n.s6:n.qy`<span class="nm"><span class="nm-t">${e.name}</span>${e.note?n.qy`<small>${e.note}</small>`:n.s6}</span>`}
          ${e.badge?n.qy`<span class="lbadge">${e.badge}</span>`:n.s6}
          ${p>0?n.qy`<span class="lbadge warn" aria-hidden="true">${In(1148,{below:p})}</span>`:n.s6}
        </button>
        ${e.renaming?n.qy`<div class="lrename">${e.renaming}</div>`:n.s6}
        <span class="lst" aria-hidden="true">
          ${o?n.qy`<ha-icon icon="mdi:eye-off-outline"></ha-icon>`:n.s6}${l?n.qy`<ha-icon icon="mdi:radiobox-marked"></ha-icon>`:n.s6}${m?n.qy`<ha-icon icon="mdi:lock-outline"></ha-icon>`:n.s6}
        </span>
        ${v}
        ${f?n.qy`<button type="button" class="icon-btn xs lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key===e.key?"true":"false"} aria-label=${In(406,{name:e.name})} title=${In(405)} @click=${()=>this._toggleMenu(e.key)} @keydown=${t=>{"ArrowDown"!==t.key&&"ArrowUp"!==t.key||(t.preventDefault(),this._openMenu(e.key))}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`:n.s6}
        ${e.extra??n.s6}
      </div>
      ${h.length?n.qy`<span id=${u} class="lr-sr">${h.join(", ")}</span>`:n.s6}
      ${this._menu?.key===e.key?this._renderMenu(e):n.s6}
    </li>`}}const kf=n.AH`
  ${us}
  ${ms}
  .lr {
    list-style: none;
    container-type: inline-size;
    border-radius: var(--mc-radius, 8px);
  }
  .lr-in {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 2px;
    min-height: 32px;
    padding-right: 2px;
    border-radius: var(--mc-radius, 8px);
    --mdc-icon-size: 18px;
  }
  .lr:hover .lr-in {
    background: var(--mc-surface-2);
  }
  .lr.sel .lr-in {
    background: var(--mc-accent-tint);
    color: var(--mc-accent-ink);
  }
  .lr.lvl-2 .lr-in {
    padding-left: 18px;
  }
  .lr.lvl-3 .lr-in {
    padding-left: 36px;
  }
  .lr-main {
    all: unset;
    box-sizing: border-box;
    flex: 1 1 0;
    min-width: 0;
    min-height: 32px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 4px;
    border-radius: var(--mc-radius, 8px);
    color: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .lr-main:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent));
    outline-offset: -2px;
  }
  .kind {
    flex: none;
    color: var(--mc-text-2);
  }
  .lr.sel .kind {
    color: inherit;
  }
  .lr.is-hidden .kind,
  .lr.is-hidden .thumb {
    opacity: 0.5;
  }
  .nm {
    display: grid;
    min-width: 0;
    flex: 1;
  }
  .nm-t,
  .nm small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nm small {
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .lr.sel .nm small {
    color: inherit;
  }
  .lbadge {
    flex: none;
    padding: 0 6px;
    min-height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid var(--mc-divider);
    background: var(--mc-surface);
    color: var(--mc-text-2);
    font-size: 0.6875rem;
    font-weight: 500;
    white-space: nowrap;
  }
  .lbadge.warn {
    color: var(--mc-warn-ink);
    background: var(--mc-warn-tint);
  }
  .lcaret-space {
    width: 0;
  }
  .lrename {
    flex: 1;
    min-width: 0;
  }
  .lt:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent));
    outline-offset: 0;
  }
  .lr .lt:hover:not(:disabled) {
    background: var(--mc-surface);
  }
  .lr.sel .lt {
    color: inherit;
  }
  .lt.soft {
    opacity: 0.6;
  }
  .lfull {
    display: contents;
  }
  .lst {
    display: none;
    flex: none;
    gap: 2px;
    color: var(--mc-text-2);
    --mdc-icon-size: 16px;
  }
  .lm {
    display: none;
  }
  .lr.compact .lm {
    display: inline-grid;
  }
  .lr.compact .lst:not(:empty) {
    display: flex;
  }
  .lr-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  /* under 320 px the name needs the room: the count is read out (and in the tooltip) but not drawn */
  @container (max-width: 319px) {
    .lbadge:not(.warn) {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
      white-space: nowrap;
    }
  }
  @container (max-width: 199px) {
    .lfull {
      display: none;
    }
    .lm {
      display: inline-grid;
    }
    .lst:not(:empty) {
      display: flex;
    }
  }
  @container (min-width: 200px) and (max-width: 319px) {
    .lm {
      display: inline-grid;
    }
    .lfull .mv {
      display: none;
    }
  }
  @media (pointer: coarse) {
    @container (max-width: 319px) {
      .lfull {
        display: none;
      }
      .lst:not(:empty) {
        display: flex;
      }
    }
    .lr-main {
      min-height: var(--mc-hit, 44px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .lr * {
      transition: none !important;
    }
  }
`;function Mf(e){const t=e.lastIndexOf("|");return{target:e.slice(5,t),lane:e.slice(t+1)}}const Sf=e=>js[Mf(e).lane]?As(Mf(e).lane):e,jf=(e,t,i,n)=>Ya(e,i).length?t.open.includes(n):void 0;function Cf(e,t,i){const{target:n,lane:s}=Mf(i),r={kind:"keys",keys:Ja(t,n,s).map(e=>({target:n,lane:s,at:e,id:`${s}@${e}`})),target:n,targets:[n]};e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:r},bubbles:!0,composed:!0}))}function Af(e,t,i,n,s){return Ya(t,n).map(r=>{const a=((e,t)=>`lane:${e}|${t}`)(n,r),o=Ja(t,n,r).length,l="keys"===i?.kind&&!!i.keys?.length&&i.keys.every(e=>e.target===n&&e.lane===r);return e.row({key:a,name:Sf(a),bare:!0,level:s,badge:In(1160,{count:o}),describe:In(1110),selected:l,title:In(1236,{name:Sf(a),count:o})})})}const zf="0 0 24 24",qf=new Map,Ef=new Map,Hf=new Map,Lf=new Set;let Vf,Of,Pf=0;const Rf=new Set;let Df=!1;const Nf=e=>e.includes(":")?e.slice(0,e.indexOf(":")):"",Tf=new Set(["mdi","hass","hassio","hademo"]);function Ff(e){const t="undefined"==typeof window?{}:window,i=t.customIconsets?.[e];if("function"==typeof i)return i;const n=t.customIcons?.[e];return n&&"function"==typeof n.getIcon?e=>n.getIcon(e):void 0}function If(e,t){for(qf.delete(e),qf.set(e,{g:t,at:Date.now()});qf.size>200;)qf.delete(qf.keys().next().value);t&&(Lf.delete(e),Hf.get(e)?.forEach(e=>{try{e()}catch{}}))}function Bf(e){const t=qf.get(e);if(t?.g)return qf.delete(e),qf.set(e,t),t.g}const Zf=new Map;function Kf(e,t){t&&Zf.delete(t);const i=t??`svg:${function(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return(t>>>0).toString(36)+e.length.toString(36)}(e)}`;let n=i;for(let t=1;Zf.has(n)&&Zf.get(n).text!==e;t++)n=`${i}.${t}`;const s=function(e){const t=Zf.get(e);return t&&(Zf.delete(e),Zf.set(e,t)),t}(n);if(s)return s.geometry&&!qf.get(n)?.g&&If(n,s.geometry),n;const r=function(e){try{return Ne(e)}catch{return Oe(Ve)}}(e),a={text:e};if(r.error)a.error=r.error;else{const e={paths:r.paths,viewBox:r.viewBox};r.accentPaths.length&&(e.secondary=r.accentPaths),r.strokes.length&&(e.strokes=r.strokes),r.evenodd&&(e.evenodd=r.evenodd),a.markup=r.markup,a.geometry=e}for(Zf.set(n,a);Zf.size>50;){const e=Zf.keys().next().value;Zf.delete(e),qf.delete(e)}return a.geometry&&If(n,a.geometry),n}async function Wf(e){const t=Ff(Nf(e));if(!t)return;let i;try{i=await t((e=>e.slice(e.indexOf(":")+1))(e))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){Kf(i.mc_svg,e);const t=Bf(e);if(t)return t}const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const s={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():zf},r="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return r&&!r.startsWith("<")&&(s.secondary=[r]),s}function Uf(e,t){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",e);let s,r=!1;const a=setInterval(()=>{p(),c()},50),o=setTimeout(()=>l(void 0),t),l=e=>{r||(r=!0,Rf.delete(d),s?.disconnect(),clearInterval(a),clearTimeout(o),n.remove(),Of&&!Of.childElementCount&&(Of.remove(),Of=void 0),i(e))},c=()=>{if(r)return;const e=n.shadowRoot?.querySelector("ha-svg-icon"),t="string"==typeof e?.path?e.path.trim():"";if(!e||!t)return;const i={paths:[t],viewBox:"string"==typeof e.viewBox&&e.viewBox.trim()?e.viewBox.trim():zf},s="string"==typeof e.secondaryPath?e.secondaryPath.trim():"";s&&(i.secondary=[s]),l(i)},d=()=>l(void 0);function p(){!s&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(s=new MutationObserver(c),s.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}Rf.add(d),(Of?.isConnected||(Of=document.createElement("div"),Of.setAttribute("aria-hidden","true"),Of.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(Of)),Of).appendChild(n),p();const h=n;h.updateComplete?.then(()=>{p(),c()},()=>{}),c()})}function Gf(){for(const e of[...Lf]){if(!Ff(Nf(e))||Ef.has(e))continue;Lf.delete(e);const t=Wf(e).then(t=>(Ef.delete(e),If(e,t&&"markup"!==t?t:null),t&&"markup"!==t?t:void 0));Ef.set(e,t)}}function Yf(e){const t=e.detail;if("icons"===t?.kind)for(const e of t.ids?.length?t.ids.map(e=>`mcu:${e}`):[...qf.keys(),...Hf.keys()].filter(e=>e.startsWith("mcu:")))qf.delete(e),Zf.delete(e),Hf.get(e)?.forEach(e=>e())}function Jf(e,t={}){if(!e||!e.includes(":"))return Promise.resolve(void 0);if(e.startsWith("svg:"))return Promise.resolve(Bf(e));Df||"undefined"==typeof window||(Df=!0,window.addEventListener("iconset-registered",Gf),window.addEventListener("mcu-library-changed",Yf));const i=qf.get(e);if(i){if(i.g)return Promise.resolve(Bf(e));const t=Date.now()-i.at>6e4,n=Lf.has(e)&&!!Ff(Nf(e));if(!t&&!n)return Promise.resolve(void 0);n&&Lf.delete(e),qf.delete(e)}if(e.startsWith("svg:"))return Promise.resolve(void 0);const n=Ef.get(e);if(n)return n;const s=(async()=>{const i=!!Ff(Nf(e)),n=await Wf(e);if("markup"===n)return void If(e,null);if(n)return If(e,n),n;const s=Nf(e);if(!Tf.has(s))return If(e,null),void(i||(Lf.add(e),function(){if(Pf=10,Vf||!Lf.size)return;const e=()=>{Vf=void 0,Gf(),Lf.size&&--Pf>0&&(Vf=setTimeout(e,500))};Vf=setTimeout(e,500)}()));const r=t.timeoutMs??3e3,a=function(e,t){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?Uf(e,t):new Promise(i=>{const n=Date.now();let s=!1;const r=()=>!s&&(s=!0,Rf.delete(a),clearTimeout(o),!0),a=()=>{r()&&i(void 0)},o=setTimeout(a,t);Rf.add(a),customElements.whenDefined("ha-icon").then(()=>{r()&&Uf(e,Math.max(0,t-(Date.now()-n))).then(i)},a)}):Promise.resolve(void 0)}(e,Math.max(r,t.probeMaxMs??15e3));a.then(t=>{t&&(If(e,t),Gf())});const o=await new Promise(e=>{const t=setTimeout(()=>e(void 0),r);a.then(i=>{clearTimeout(t),e(i)})});if(o)return o;Bf(e)||If(e,null)})().finally(()=>Ef.delete(e));return Ef.set(e,s),s}const Xf=e=>e.slice(e.indexOf(":")+1),Qf=e=>`part:${e}`,ev=e=>`group:${e}`,tv=e=>"string"==typeof e&&/^(part|group):/.test(e),iv=e=>!!e.rig&&(e.rig.parts.length>0||!!e.rig.shapes?.length);function nv(e){return new Set([...(e?.parts??[]).map(e=>e.id),...(e?.groups??[]).map(e=>e.id),...(e?.shapes??[]).map(e=>e.id)])}function sv(e,t,i=nv(e)){const n=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^[-_]+/,"").slice(0,24)||"part";for(let e=1;;e++){const t=`${n}-${e}`;if(!i.has(t)&&Gi.test(t))return t}}function rv(e,t="icon"){return e.rig?.icon?e.rig.icon:e.rig?.svg?Kf(e.rig.svg):String(Jn(t,"m",!1).icon??"mdi:bell-ring")}const av=e=>Bf(e),ov=e=>Jf(e),lv=new WeakMap;function cv(e){let t=lv.get(e);return t||lv.set(e,t=(0,Fm.WP)(e)),t}const dv=(e,t)=>!e.tracks?.some(e=>e.target===t)&&(e.tracks?.length??0)>=24,pv=()=>In(1259,{tracks:24}),hv=(e,t)=>e.tracks?.find(e=>e.target===t);function uv(e,t,i){const n=(e.tracks??[]).filter(e=>e.target!==t),s=(e.tracks??[]).findIndex(e=>e.target===t);i&&n.splice(s<0?n.length:s,0,{...i,target:t});const r={...e,tracks:n};return n.length||delete r.tracks,r}function mv(e,t){const i={...e};return e.tracks&&(i.tracks=e.tracks.filter(e=>!t.has(e.target)),i.tracks.length||delete i.tracks),e.bindings&&(i.bindings=e.bindings.filter(e=>!t.has(e.target)),i.bindings.length||delete i.bindings),i}const gv=(e,t)=>({...e,rig:t});function fv(e,t,i){const n=e.rig,s=i.trim();if(!n||!s)return e;const r=Xf(t);return t.startsWith("part:")?gv(e,{...n,parts:n.parts.map(e=>e.id===r?{...e,name:s}:e)}):t.startsWith("group:")?gv(e,{...n,groups:(n.groups??[]).map(e=>e.id===r?{...e,name:s}:e)}):t.startsWith("shape:")?gv(e,{...n,shapes:(n.shapes??[]).map(e=>e.id===r?{...e,name:s}:e)}):e}function vv(e,t){const i=e.rig,n=[];for(const e of t){const t=Xf(e),s=e.startsWith("group:")?i?.groups?.find(e=>e.id===t)?.parts??[]:e.startsWith("part:")?[t]:[];for(const e of s)!n.includes(e)&&i?.parts.some(t=>t.id===e)&&n.push(e)}return(i?.parts??[]).map(e=>e.id).filter(e=>n.includes(e))}const bv=(e,t)=>e?.groups?.find(e=>e.parts.includes(t));function yv(e,t){return vv(e,t).length<2?In(784):(e.rig?.groups?.length??0)>=16?In(1186,{groups:16}):""}function xv(e,t,i){const n=e.rig;if(!n||yv(e,t))return{doc:e};const s=vv(e,t),r=sv(n,"group"),a=(n.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!s.includes(e))})),o=new Set(a.filter(e=>!e.parts.length).map(e=>ev(e.id))),l=[...a.filter(e=>e.parts.length),{id:r,name:i?.trim()||`Group ${(n.groups?.length??0)+1}`,parts:s}];return{doc:gv(mv(e,o),{...n,groups:l}),id:r}}function _v(e,t){const i=e.rig;if(!i?.groups?.some(e=>e.id===t))return e;const n=i.groups.filter(e=>e.id!==t),s={...i,groups:n};return n.length||delete s.groups,gv(mv(e,new Set([ev(t)])),s)}function $v(e,t,i){const n=e.rig;if(!n)return e;const s=Xf(t),r=e=>Math.round(100*e)/100,a=e=>{if(e.id!==s)return e;const t={...e};return i?t.origin=[r(i[0]),r(i[1])]:delete t.origin,t};return t.startsWith("part:")?gv(e,{...n,parts:n.parts.map(a)}):t.startsWith("group:")?gv(e,{...n,groups:(n.groups??[]).map(a)}):t.startsWith("shape:")?gv(e,{...n,shapes:(n.shapes??[]).map(a)}):e}const wv=e=>/^(part|group|shape):/.test(e),kv=(e,t)=>wv(t)&&!!hv(e,t)?.origin;function Mv(e,t,i){const n=hv(e,t);if(!n||!wv(t))return e;const s={...n},r=e=>Math.round(100*e)/100;return i?s.origin=`${r(i[0])}px ${r(i[1])}px`:delete s.origin,uv(e,t,s.keyframes.length||s.path||s.origin?s:void 0)}function Sv(e,t,i){return kv(e,t)?Mv(e,t,i):$v(e,t,i)}function jv(e,t,i){const n=e.rig;if(!n)return;const s=vv(e,[t]).flatMap(e=>(n.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.bbox)).filter(e=>!!e);return(0,Fm.Zg)(s)}function Cv(e,t,i,n){const s=function(e,t,i=[0,0,24,24]){const n=wv(t)?hv(e,t)?.origin?.trim():void 0;if(!n)return;const s=(e,t)=>{const n=i[2+t];if(!e||"center"===e)return n/2;if("left"===e||"top"===e)return 0;if("right"===e||"bottom"===e)return n;const s=parseFloat(e);return Number.isFinite(s)?e.endsWith("%")?n*s/100:s:n/2};let[r,a]=n.split(/\s+/);return"top"!==r&&"bottom"!==r&&("left"!==a&&"right"!==a||"center"!==r)||([r,a]=[a,r]),[s(r,0),s(a,1)]}(e,t,n);if(s)return s;const r=e.rig,a=Xf(t),o=t.startsWith("part:")?r?.parts.find(e=>e.id===a)?.origin:t.startsWith("group:")?r?.groups?.find(e=>e.id===a)?.origin:void 0;if(o)return o;const l=jv(e,t,i);return l?[l[0]+l[2]/2,l[1]+l[3]/2]:void 0}function Av(e,t){const i=Xf(t),n=e.rig;return t.startsWith("part:")?n?.parts.find(e=>e.id===i)?.name??i:t.startsWith("group:")?n?.groups?.find(e=>e.id===i)?.name??i:t.startsWith("shape:")?n?.shapes?.find(e=>e.id===i)?.name??i:t}function zv(e,t){return(hv(e,t)?.keyframes??[]).filter(e=>void 0!==e.draw).map(e=>[e.at,e.draw])}function qv(e,t,i){const n=e.map(e=>e.at===t?{...e,...i}:e);return e.some(e=>e.at===t)||n.push({at:t,...i}),n.sort((e,t)=>e.at-t.at)}function Ev(e,t,i,n=0,s=60){if("none"!==i&&dv(e,t))return e;const r=hv(e,t);let a=(r?.keyframes??[]).map(e=>{if(void 0===e.draw)return e;const t={...e};return delete t.draw,t});if(a=a.filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e&&"easings"!==e)),"none"!==i){const[e,t]="on"===i?[0,1]:[1,0],r=Math.max(0,Math.min(100,n)),o=Math.max(r,Math.min(100,s));a=qv(a,r,{draw:e}),a=qv(a,o,{draw:t}),r>0&&(a=qv(a,0,{draw:e})),o<100&&(a=qv(a,100,{draw:t}))}return a.length||r?.path?uv(e,t,{...r??{target:t},target:t,keyframes:a.slice(0,40)}):uv(e,t,void 0)}const Hv="M0 0 C 2 -3 4 -3 6 0 S 2 3 0 0";function Lv(e,t,i){const n=hv(e,t);if(!i){if(!n)return e;const i={...n};return delete i.path,uv(e,t,i.keyframes.length?i:void 0)}return dv(e,t)?e:uv(e,t,{...n??{target:t,keyframes:[]},target:t,path:i})}const Vv=/^(part|group|shape):/;function Ov(e){if(!e||"target"!==e.kind&&"keys"!==e.kind)return[];const t=[...e.target?[e.target]:[],...e.targets??[]];return[...new Set(t)].filter(e=>Vv.test(e))}function Pv(e,t){const i=[...new Set(e)];if(!i.length)return{kind:"none"};const n=t&&i.includes(t)?t:i[i.length-1];return{kind:"target",target:n,targets:[n,...i.filter(e=>e!==n)]}}function Rv(e,t){e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}function Dv(e,t,i,n=!1){e.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:t,label:i,...n?{transient:!0}:{}},bubbles:!0,composed:!0}))}var Nv=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Tv={part:"mdi:vector-square",group:"mdi:folder-outline",shape:"mdi:draw"};let Fv=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this.density="full",this._icon="",this._busy=!1,this._error="",this._confirm=!1,this._resplit=!1,this._collapsed=new Set,this._status="",this._notice="",this._iconTyped=!1,this._list=new wf(this,{select:(e,t)=>{if(e.startsWith("tracks:"))return this._list.setOpen(e.slice(7),!this.layerView?.open.includes(e.slice(7)));if(e.startsWith("lane:"))return this.disabled?void 0:Cf(this,this.doc,e);const i=this._rows(),n=i.find(t=>t.ref===e);n&&t instanceof MouseEvent?this._onRowClick(t,n,i):n&&(this._anchor=n.ref,this._select([n.ref]))},move:(e,t)=>this._move("up"===t?1:-1,e),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&!this._list.refuseLocked(e,Av(this.doc,e))&&(this._renaming=e),open:(e,t)=>e.startsWith("group:")?this._setOpen(e.slice(6),t):this._list.setOpen(e.startsWith("tracks:")?e.slice(7):e,t),nameOf:e=>e.startsWith("lane:")?Sf(e):this.doc?Av(this.doc,e):e})}connectedCallback(){super.connectedCallback(),bs("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}willUpdate(e){const t=e.get("doc");if(e.has("doc")&&t&&t.id!==this.doc?.id&&(this._icon="",this._iconTyped=!1,this._confirm=!1,this._resplit=!1,this._error="",this._notice=""),(e.has("doc")||e.has("tile"))&&!this._iconTyped&&this.doc){const e=rv(this.doc,this.tile);this._icon=e.startsWith("svg:")?"":e}}get _sel(){return Ov(this.selection)}_rows(){const e=this.doc,t=e?.rig;if(!e||!t)return[];const i=t=>hv(e,t)?.keyframes.length??0,n=[],s=new Set,r=[...t.parts].reverse();for(const e of r){const a=bv(t,e.id);if(a){if(!s.has(a.id)&&(s.add(a.id),n.push({ref:ev(a.id),level:1,kind:"group",name:a.name,count:a.parts.length,keys:i(ev(a.id))}),!this._collapsed.has(a.id)))for(const e of r.filter(e=>bv(t,e.id)?.id===a.id))n.push({ref:Qf(e.id),level:2,kind:"part",name:e.name,count:e.from?.length??1,keys:i(Qf(e.id))})}else n.push({ref:Qf(e.id),level:1,kind:"part",name:e.name,count:e.from?.length??1,keys:i(Qf(e.id))})}return n}_change(e,t,i=t){this._status=i,Dv(this,e,t)}_select(e,t){Rv(this,Pv(e,t))}async _split(){const e=this.doc;if(!e||this._busy||this.disabled)return;if(iv(e)&&!this._confirm)return void(this._confirm=!0);const t=!this._resplit&&e.rig?.svg?e.rig.svg:void 0,i=t?rv(e,this.tile):this._icon.trim()||rv(e,this.tile);if(t||/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(i)){this._busy=!0,this._error="";try{const n=await ov(i);if(this.doc?.id!==e.id)return;if(!n)return void(this._error=In(989));const s=cv(n);if(!s.length)return void(this._error=In(991));const r=function(e,t,i){const n=e.rig,s=new Set([...(n?.parts??[]).map(e=>Qf(e.id)),...(n?.groups??[]).map(e=>ev(e.id))]),r=function(e,t){const i=e.slice(0,Wi).map((e,t)=>({id:`part-${t+1}`,name:In(623,{i:t+1}),from:[e.index]}));return{...t?.svg?{svg:t.svg}:t?.icon?{icon:t.icon}:{},parts:i}}(t,i);if(n?.shapes?.length){const e=new Set(n.shapes.map(e=>e.id));r.parts=r.parts.map(t=>e.has(t.id)?{...t,id:sv(r,"part",new Set([...e,...r.parts.map(e=>e.id)]))}:t),r.shapes=n.shapes}return gv(mv(e,s),r)}(this.doc??e,s,t?{svg:t}:{icon:i}),a=r.rig?.parts.length??0,o=s.length>Wi;this._notice=o?In(946,{count:s.length,parts:Wi}):"",this._change(r,"Split icon",o?In(1180,{count:a,parts:Wi}):In(1179,{count:a})),this._confirm=!1,this._resplit=!1,this._select([])}finally{this._busy=!1}}else this._error=In(1047)}_group(){const e=this.doc;if(!e||this.disabled)return;if(this._lockedSel())return;const t=yv(e,this._sel);if(t)return void(this._status=t);const i=xv(e,this._sel);i.id&&(this._change(i.doc,"Group parts",In(1176,{count:vv(e,this._sel).length})),this._select([ev(i.id)]))}_ungroup(){const e=this.doc,t=this._sel.filter(e=>e.startsWith("group:"));if(!e||!t.length||this.disabled||this._lockedSel())return;let i=e;const n=[];for(const s of t)n.push(...(e.rig?.groups?.find(e=>`group:${e.id}`===s)?.parts??[]).map(Qf)),i=_v(i,s.slice(6));this._change(i,"Ungroup",In(1175,{count:t.length})),this._select(n)}_merge(){const e=this.doc;if(!e||this.disabled||this._lockedSel())return;const t=function(e,t){const i=e.rig,n=vv(e,t).filter(e=>i?.parts.find(t=>t.id===e)?.from);if(!i||n.length<2)return{doc:e};const[s,...r]=n,a=[...new Set(n.flatMap(e=>i.parts.find(t=>t.id===e).from??[]))].sort((e,t)=>e-t),o=i.parts.filter(e=>!r.includes(e.id)).map(e=>e.id===s?{...e,from:a}:e),l=(i.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!r.includes(e))})),c=l.filter(e=>!e.parts.length).map(e=>ev(e.id)),d={...i,parts:o,...i.groups?{groups:l.filter(e=>e.parts.length)}:{}};return d.groups&&!d.groups.length&&delete d.groups,{doc:gv(mv(e,new Set([...r.map(Qf),...c])),d),id:s}}(e,this._sel);t.id&&(this._change(t.doc,"Merge parts",In(637)),this._select([Qf(t.id)]))}_splitBack(){const e=this.doc,t=this._sel.find(e=>e.startsWith("part:"));if(!e||!t||this.disabled||this._lockedSel())return;const i=function(e,t){const i=e.rig,n=i?.parts.find(e=>e.id===t);if(!i||!n?.from||n.from.length<2)return{doc:e,ids:[t]};const s=Wi-i.parts.length+1,r=n.from.slice(0,Math.max(1,s)),a=nv(i),o=r.slice(1).map(e=>{const t=sv(i,"part",a);return a.add(t),{id:t,name:In(624,{n:t.slice(5)}),from:[e]}}),l={...n,from:[r[0]]};delete l.origin;const c=i.parts.indexOf(n),d=[...i.parts.slice(0,c),l,...o,...i.parts.slice(c+1)],p=i.groups?.map(e=>e.parts.includes(t)?{...e,parts:[...e.parts,...o.map(e=>e.id)]}:e);return{doc:gv(e,{...i,parts:d,...p?{groups:p}:{}}),ids:[t,...o.map(e=>e.id)]}}(e,t.slice(5));i.ids.length<2||(this._change(i.doc,"Split part",In(1179,{count:i.ids.length})),this._select(i.ids.map(Qf)))}_lockedSel(){const e=this.doc,t=e&&this._sel.find(e=>this._list.locked(e));return!!t&&this._list.refuseLocked(t,Av(e,t))}_move(e,t){const i=this.doc,n=t??this._sel.find(e=>e.startsWith("part:"));if(!i||!n||!n.startsWith("part:")||this.disabled)return;if(this._list.refuseLocked(n,Av(i,n)))return;const s=function(e,t,i){const n=e.rig,s=n?.parts.findIndex(e=>e.id===t)??-1,r=s+i;if(!n||s<0||r<0||r>=n.parts.length)return e;const a=[...n.parts];return[a[s],a[r]]=[a[r],a[s]],gv(e,{...n,parts:a})}(i,n.slice(5),e);s!==i&&(this._change(s,"Move part",In(e>0?493:492)),this._list.announce(In(1226,{name:Av(i,n),direction:In(e>0?1144:1097)})))}_setOpen(e,t){const i=new Set(this._collapsed);t?i.delete(e):i.add(e),this._collapsed=i}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc;i&&t.trim()&&t.trim()!==Av(i,e)&&!this._list.refuseLocked(e,Av(i,e))&&this._change(fv(i,e,t),"Rename part",In(725))}_onRowClick(e,t,i){if(this._renaming===t.ref)return;const n=this._sel;if(e.shiftKey&&this._anchor){const e=i.findIndex(e=>e.ref===this._anchor),n=i.findIndex(e=>e.ref===t.ref);if(e>=0&&n>=0){const[s,r]=e<n?[e,n]:[n,e];return void this._select(i.slice(s,r+1).map(e=>e.ref),t.ref)}}this._anchor=t.ref,e.ctrlKey||e.metaKey?this._select(n.includes(t.ref)?n.filter(e=>e!==t.ref):[...n,t.ref],t.ref):this._select([t.ref])}_onKey(e){if(this._renaming||this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase();if(t&&"g"===i)return e.preventDefault(),void(e.shiftKey?this._ungroup():this._group());const n=this._rows(),s=n.findIndex(t=>t.ref===(e.target.closest?.("li.lr")?.getAttribute("data-ref")??this.selection.target??this._anchor));if(e.shiftKey&&!e.altKey&&("ArrowDown"===e.key||"ArrowUp"===e.key)&&e.target.matches?.("[data-lk]")){if(/^(lane|tracks):/.test(e.target.dataset.lk??""))return;e.preventDefault();const t=n[Math.max(0,Math.min(n.length-1,s+("ArrowDown"===e.key?1:-1)))];if(!t)return;return s>=0?this._select([...this._sel,t.ref],t.ref):this._select([t.ref]),void this._focusRow(t.ref)}"Escape"===e.key&&this._sel.length&&e.target.matches?.("[data-lk]")&&(e.preventDefault(),this._select([]))}_focusRow(e){this._list.focusKey(e)}_iconBtn(e,t,i,s,r){return n.qy`<button
      type="button"
      class="icon-btn sm"
      title=${r?`${t} (${r})`:t}
      aria-label=${t}
      aria-keyshortcuts=${r??n.s6}
      ?disabled=${this.disabled||!s}
      @click=${i}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderSource(e){const t=this.doc,i=!!t.rig?.svg&&!this._resplit;return n.qy`<div class="source">
      ${i?n.qy`<p class="help">${In(961)}</p>`:bs("mc-icon-picker")?n.qy`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">${In(378)}</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${In(378)}
                aria-labelledby="pl-icon-l"
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._iconTyped=""!==this._icon,this._error="",this._confirm=!1}}
              ></mc-icon-picker>
            </div>`:n.qy`<div class="field">
            <div class="field-head"><label for="pl-icon">${In(378)}</label></div>
            <input
              id="pl-icon"
              class="input mono"
              .value=${this._icon}
              placeholder=${rv(t,this.tile)}
              spellcheck="false"
              ?disabled=${this.disabled||this._busy}
              @input=${e=>{this._icon=e.target.value,this._iconTyped=""!==this._icon.trim(),this._error=""}}
              @keydown=${e=>"Enter"===e.key&&void this._split()}
            />
          </div>`}
      ${this._error?n.qy`<p class="help error" role="alert">${this._error}</p>`:n.s6}
      <div class="actions">
        <button type="button" class="btn ${e?"btn-secondary":"btn-primary"} btn-sm" ?disabled=${this.disabled||this._busy} @click=${()=>{this._split()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?In(860):this._confirm?In(1178,{count:t.rig?.parts.length??0}):In(e?854:857)}
        </button>
        ${e?n.qy`<button
              type="button"
              class="btn btn-text btn-sm"
              @click=${()=>{this._resplit=!1,this._confirm=!1,this._error=""}}
            >
              ${In(116)}
            </button>`:n.s6}
      </div>
      ${this._confirm?n.qy`<p class="help">${In(859)}</p>`:n.s6}
    </div>`}_renderRow(e,t,i){const s=this.doc,r="group"===e.kind?e.ref.slice(6):"",a=s.rig?.parts??[],o="part"===e.kind?a.findIndex(t=>`part:${t.id}`===e.ref):-1,l=this._list.locked(e.ref),c=Ya(s,e.ref).length>0,d="group"===e.kind?void 0:jf(s,this.layerView??Ka,e.ref,e.ref),p=this._list.row({key:e.ref,name:e.name,icon:Tv[e.kind],note:"part"===e.kind&&e.count>1?In(1165,{count:e.count}):void 0,badge:e.keys?In(1160,{count:e.keys}):void 0,level:e.level,expanded:"group"===e.kind?!this._collapsed.has(r):d,selected:i.includes(e.ref)&&!(d&&"part"===e.kind&&"keys"===this.selection.kind),renamable:!0,up:"part"===e.kind?{ok:!this.disabled&&o>=0&&o<a.length-1&&!l,label:In(487,{name:e.name}),menu:In(480)}:void 0,down:"part"===e.kind?{ok:!this.disabled&&o>0&&!l,label:In(485,{name:e.name}),menu:In(459)}:void 0,renaming:this._renaming===e.ref?n.qy`<input
              class="input rename"
              aria-label=${In(532)}
              .value=${e.name}
              maxlength="80"
              @click=${e=>e.stopPropagation()}
              @keydown=${t=>{t.stopPropagation(),"Enter"===t.key&&(this._rename(e.ref,t.target.value),this._focusRow(e.ref)),"Escape"===t.key&&(this._renaming=void 0,this._focusRow(e.ref))}}
              @blur=${t=>this._rename(e.ref,t.target.value)}
            />`:void 0});if("group"===e.kind){if(!c||this._collapsed.has(r))return[p];const t=!!jf(s,this.layerView??Ka,e.ref,e.ref),i=this._list.row({key:`tracks:${e.ref}`,name:In(1011),bare:!0,level:2,expanded:t,selected:!1,toggles:[],describe:In(1111,{name:e.name})});return t?[p,i,...Af(this._list,s,this.selection,e.ref,3)]:[p,i]}return d?[p,...Af(this._list,s,this.selection,e.ref,2===e.level?3:2)]:[p]}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return n.qy``;const t=iv(e),i=this._rows(),s=this._sel,r=vv(e,s),a=1===s.length?s[0]:void 0,o=r.length>=2&&r.every(t=>e.rig?.parts.find(e=>e.id===t)?.from),l=!!a&&a.startsWith("part:")&&(e.rig?.parts.find(e=>`part:${e.id}`===a)?.from?.length??0)>1,c=a?.startsWith("part:")?e.rig.parts.findIndex(e=>`part:${e.id}`===a):-1;return n.qy`<div class="parts" @keydown=${this._onKey}>
      ${!t||this._resplit||this._confirm?n.qy`${t?n.s6:n.qy`<p class="lead">${In(858)}</p>`}${this._renderSource(t)}`:n.s6}
      ${t?n.qy`<div class="bar" role="toolbar" aria-label=${In(620)}>
              ${this._iconBtn("mdi:group",In(357),()=>this._group(),!yv(e,s),In(198))}
              ${this._iconBtn("mdi:ungroup",In(1031),()=>this._ungroup(),s.some(e=>e.startsWith("group:")),In(199))}
              ${this._iconBtn("mdi:set-merge",In(442),()=>this._merge(),o)}
              ${this._iconBtn("mdi:call-split",In(856),()=>this._splitBack(),l)}
              ${this._iconBtn("mdi:arrow-up",In(480),()=>this._move(1),c>=0&&c<e.rig.parts.length-1,In(53))}
              ${this._iconBtn("mdi:arrow-down",In(460),()=>this._move(-1),c>0,In(52))}
            </div>
            <ul class="tree" aria-label=${In(376)}>
              ${i.map(e=>this._renderRow(e,i,s))}
            </ul>
            ${this._notice?n.qy`<p class="help notice" role="note">${this._notice}</p>`:n.s6}
            <p class="help">${In(150)}</p>
            ${this._resplit||this._confirm?n.s6:n.qy`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>(this._resplit=!0,this._confirm=!1)}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>${In(854)}
                  </button>
                </div>`}`:n.s6}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`}};Fv.styles=[ps,hs,kf,n.AH`
      :host {
        display: block;
        font-size: 0.875rem;
        color: var(--mc-text);
      }
      .parts {
        display: grid;
        gap: 12px;
      }
      .lead {
        margin: 0;
        color: var(--mc-text-2);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .source {
        display: grid;
        gap: 8px;
      }
      .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .bar {
        display: flex;
        align-items: center;
        gap: 2px;
        flex-wrap: wrap;
      }
      .bar .spacer {
        flex: 1;
      }
      .tree {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 1px;
      }
      .help {
        margin: 0;
      }
    `],Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"doc",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"hass",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"library",void 0),Nv([(0,s.MZ)({type:Number})],Fv.prototype,"time",void 0),Nv([(0,s.MZ)({type:Boolean})],Fv.prototype,"disabled",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"selection",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"tile",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"stage",void 0),Nv([(0,s.MZ)({attribute:!1})],Fv.prototype,"layerView",void 0),Nv([(0,s.MZ)()],Fv.prototype,"density",void 0),Nv([(0,s.wk)()],Fv.prototype,"_renaming",void 0),Nv([(0,s.wk)()],Fv.prototype,"_icon",void 0),Nv([(0,s.wk)()],Fv.prototype,"_busy",void 0),Nv([(0,s.wk)()],Fv.prototype,"_error",void 0),Nv([(0,s.wk)()],Fv.prototype,"_confirm",void 0),Nv([(0,s.wk)()],Fv.prototype,"_resplit",void 0),Nv([(0,s.wk)()],Fv.prototype,"_collapsed",void 0),Nv([(0,s.wk)()],Fv.prototype,"_status",void 0),Nv([(0,s.wk)()],Fv.prototype,"_notice",void 0),Fv=Nv([(0,s.EM)("mc-anim-parts-layers")],Fv),_s({tag:"mc-anim-parts-layers",place:"layers",title:376,order:20,when:e=>"keyframes"===e.kind});var Iv=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function Bv(e){const t=(e??"").split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:void 0}let Zv=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._vb=[0,0,24,24],this._scale=1,this._watched=new WeakSet}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._watched=new WeakSet,this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measure())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}get _pieces(){return this._geom?cv(this._geom):[]}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=rv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=av(e),this._geom||ov(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}e.has("doc")&&!this._drag&&(this._live=void 0)}updated(){requestAnimationFrame(()=>this._measure())}_icon(){return this.iconEl??function(e){let t=e;for(;t;)if(t instanceof Element){const e=t.shadowRoot?.querySelector("magic-card")??t.querySelector("magic-card");if(e)return e.shadowRoot?.querySelector('[data-mc-part="icon"]')??void 0;t=t.parentElement??t.getRootNode().host??null}else t=t.host??null}(this)}_measure(){if(!this.isConnected)return;const e=this._icon(),t=this.getBoundingClientRect(),i=this.offsetWidth>0&&t.width>0?t.width/this.offsetWidth:1;let n,s;for(const t of[e,e?.getRootNode()?.host])t&&this._ro&&!this._watched.has(t)&&(this._watched.add(t),this._ro.observe(t));if(e){const r=e.shadowRoot?.querySelector('svg[part="svg"]'),a=(r??e).getBoundingClientRect();a.width>0&&(n={x:(a.left-t.left)/i,y:(a.top-t.top)/i,w:a.width/i,h:a.height/i}),s=Bv(r?.getAttribute("viewBox"))}if(!n&&this.stage?.subject){const e=this.stage.subject;n={x:e.x,y:e.y,w:e.width,h:e.height}}s??=this.stage?.viewBox??Bv(this._geom?.viewBox)??[0,0,24,24],((e,t)=>!!e&&!!t&&Math.abs(e.x-t.x)<.5&&Math.abs(e.y-t.y)<.5&&Math.abs(e.w-t.w)<.5&&Math.abs(e.h-t.h)<.5)(n,this._box)||!n&&!this._box||(this._box=n),s.join(" ")!==this._vb.join(" ")&&(this._vb=s);const r=this.offsetWidth>0&&t.width>0?i:this.stage&&this.stage.scale>0?this.stage.scale:1;Math.abs(r-this._scale)>.001&&(this._scale=r)}get _unit(){return this._box&&this._box.w>0?this._vb[2]/(this._box.w*(this._scale||1)):.1}_toVb(e){const t=this.renderRoot.querySelector("svg.ov"),i=t?.getBoundingClientRect();return i&&i.width?[this._vb[0]+(e.clientX-i.left)/i.width*this._vb[2],this._vb[1]+(e.clientY-i.top)/i.height*this._vb[3]]:[0,0]}_lk(e){return!!this.doc&&!!this.layerView?.locked.length&&no(this.doc,this.layerView,e)}get _sel(){return Ov(this.selection)}_pick(e,t){const i=this._sel;t.shiftKey?Rv(this,Pv([...i,e],e)):t.ctrlKey||t.metaKey?Rv(this,Pv(i.includes(e)?i.filter(t=>t!==e):[...i,e],e)):Rv(this,Pv([e],e))}_onDown(e){if(this.disabled||e.button>0||!this.doc)return;const t=e.target,i=t.closest("[data-pivot]")?.getAttribute("data-pivot"),n=t.closest("[data-anchor]")?.getAttribute("data-anchor"),s=t.closest("[data-ref]")?.getAttribute("data-ref"),r=this._toVb(e),a={pointerId:e.pointerId,kind:"band",start:r,startClient:[e.clientX,e.clientY],startDoc:this.doc,moved:!1,additive:e.shiftKey||e.ctrlKey||e.metaKey};if(i){if(this._lk(i))return;this._drag={...a,kind:"pivot",ref:i}}else if(null!=n&&this.selection.target){if(this._lk(this.selection.target))return;const e=hv(this.doc,this.selection.target)?.path?.d;if(!e)return;this._drag={...a,kind:"anchor",ref:this.selection.target,index:Number(n),path:na(e)}}else{if(s)return void this._pick(s,e);this._drag=a}e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId)}_onMove(e){const t=this._drag;if(!t){const t=e.target.closest?.("[data-ref]")?.getAttribute("data-ref");return void(t!==this._hover&&(this._hover=t))}if(e.pointerId!==t.pointerId)return;if(!t.moved&&Math.hypot(e.clientX-t.startClient[0],e.clientY-t.startClient[1])<3)return;t.moved=!0;const i=this._toVb(e),n=e.shiftKey?0:.25;if("band"===t.kind)this._band=[t.start,i];else if("pivot"===t.kind&&t.ref){const e=[(0,ia.snap)(i[0],n),(0,ia.snap)(i[1],n)];this._live={ref:t.ref,pivot:e},Dv(this,Sv(this.doc,t.ref,e),"Move pivot",!0)}else if("anchor"===t.kind&&t.ref&&t.path&&void 0!==t.index){const e=this._pivotOf(t.ref)??[0,0],s=(0,ia.serialize)((0,ia.moveAnchor)(t.path,t.index,(0,ia.snap)(i[0]-e[0],n),(0,ia.snap)(i[1]-e[1],n)));this._live={ref:t.ref,path:s};const r=hv(this.doc,t.ref);Dv(this,Lv(this.doc,t.ref,{...r.path,d:s}),"Move path point",!0)}}_onUp(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;this._drag=void 0;const i=this.doc,n=this._live;if(this._live=void 0,"band"===t.kind){const e=this._band;if(this._band=void 0,!t.moved||!e)return void(t.additive||Rv(this,{kind:"none"}));const[n,s]=e,r=Math.min(n[0],s[0]),a=Math.max(n[0],s[0]),o=Math.min(n[1],s[1]),l=Math.max(n[1],s[1]),c=(i.rig?.parts??[]).map(e=>Qf(e.id)).filter(e=>!this._lk(e)).filter(e=>{const t=jv(i,e,this._pieces);return!!t&&t[0]>=r&&t[0]+t[2]<=a&&t[1]>=o&&t[1]+t[3]<=l});return void Rv(this,Pv(t.additive?[...this._sel,...c]:c))}if(t.moved&&("pivot"===t.kind&&t.ref&&n?.pivot&&Dv(this,Sv(i,t.ref,n.pivot),"Move pivot"),"anchor"===t.kind&&t.ref&&n?.path)){const e=hv(i,t.ref);e?.path&&Dv(this,Lv(i,t.ref,{...e.path,d:n.path}),"Move path point")}}_onCancel(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._drag=void 0,this._band=void 0,this._live=void 0,t.moved&&"band"!==t.kind&&Dv(this,t.startDoc,"pivot"===t.kind?In(470):In(469)))}_onPivotKey(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i||this.disabled||!this.doc||this._lk(t))return;e.preventDefault();const n=e.shiftKey?1:.25,s=this._pivotOf(t)??[12,12];this._nudge?.ref!==t&&(this._nudge={ref:t,doc:this.doc}),Dv(this,Sv(this.doc,t,[s[0]+i[0]*n,s[1]+i[1]*n]),"Move pivot",!0)}_onKeyUp(e){const t=this._nudge;t&&e.key.startsWith("Arrow")&&this.doc&&(this._nudge=void 0,this.doc!==t.doc&&Dv(this,this.doc,"Move pivot"))}_onKey(e){if(this.doc&&!this.disabled)if(!e.ctrlKey&&!e.metaKey||"g"!==e.key.toLowerCase()||e.shiftKey)"Escape"===e.key&&this._sel.length&&(e.preventDefault(),Rv(this,{kind:"none"}));else{if(this._sel.some(e=>this._lk(e)))return;const t=xv(this.doc,this._sel);if(!t.id)return;e.preventDefault(),Dv(this,t.doc,"Group parts"),Rv(this,Pv([ev(t.id)]))}}_pivotOf(e){return this._live?.ref===e&&this._live.pivot?this._live.pivot:this.doc?Cv(this.doc,e,this._pieces,this._vb):void 0}_partPaths(e){const t=this.doc,i=this._pieces;return vv(t,[e]).flatMap(e=>(t.rig.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.d).filter(e=>!!e))}_selected(e,t){const i=this.doc;return e.flatMap(e=>{if(!/^(part|group):/.test(e))return[];const s=jv(i,e,this._pieces),r=this._pivotOf(e),a=e===this.selection.target,o=[];if(o.push(n.JW`${this._partPaths(e).map(e=>n.JW`<path class="sel-outline" d=${e}></path>`)}`),s&&o.push(n.JW`<rect class="bbox" x=${s[0]} y=${s[1]} width=${s[2]} height=${s[3]}></rect>`),r&&a&&!this._lk(e)){const s=Av(i,e);o.push(n.JW`<g
          class="pivot"
          data-pivot=${e}
          tabindex="0"
          role="slider"
          aria-label=${kv(i,e)?In(686,{name:s}):In(655,{name:s})}
          aria-valuetext=${`x ${r[0].toFixed(2)}, y ${r[1].toFixed(2)}`}
          @keydown=${t=>this._onPivotKey(t,e)}
        >
          <circle class="pivot-hit" cx=${r[0]} cy=${r[1]} r=${12*t}></circle>
          <circle class="pivot-ring" cx=${r[0]} cy=${r[1]} r=${5*t} style=${"stroke-width: "+2*t}></circle>
          <path class="pivot-cross" d=${`M${r[0]-9*t} ${r[1]}H${r[0]+9*t}M${r[0]} ${r[1]-9*t}V${r[1]+9*t}`} style=${"stroke-width: "+1.5*t}></path>
        </g>`)}return o})}_motionPath(e){const t=this.selection.target;if(!t||!this.doc||!/^(part|group):/.test(t))return n.s6;const i=this._live?.ref===t&&this._live.path?this._live.path:hv(this.doc,t)?.path?.d,s=this._pivotOf(t);if(!i||!s)return n.s6;const r=na(i);return n.JW`<g class="mpath" transform=${`translate(${s[0]} ${s[1]})`}>
      <path class="mline" d=${i} style=${"stroke-width: "+2*e}></path>
      ${this._lk(t)?n.s6:r.anchors.map((t,i)=>n.JW`<g class="anchor" data-anchor=${i}>
          <circle class="anchor-hit" cx=${t.x} cy=${t.y} r=${12*e}></circle>
          <circle class="anchor-dot" cx=${t.x} cy=${t.y} r=${4.5*e} style=${"stroke-width: "+1.5*e}></circle>
        </g>`)}
    </g>`}render(){const e=this.doc;if(!e||!iv(e))return n.qy``;const t=this._box,i=this._unit,s=this._sel,r=this.layerView,a=r?eo(e,r):new Set,o=this._vb,l=this._band,c=this._hover&&!s.includes(this._hover)?this._hover:void 0,d=e.rig.parts.map(e=>Qf(e.id)).filter(t=>!(a.has(t)||a.has(ev(bv(e.rig,t.slice(5))?.id??""))||r&&no(e,r,t))).map(e=>n.JW`<g class="hit" data-ref=${e}>${this._partPaths(e).map(e=>n.JW`<path d=${e} style=${"stroke-width: "+8*i}></path>`)}</g>`);return n.qy`<div
      class="layer"
      @pointerdown=${this._onDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onUp}
      @pointercancel=${this._onCancel}
      @keyup=${this._onKeyUp}
      @pointerleave=${()=>!this._drag&&(this._hover=void 0)}
      @keydown=${this._onKey}
    >
      ${t?n.qy`<svg
            class="ov"
            viewBox=${o.join(" ")}
            style=${`left: ${t.x}px; top: ${t.y}px; width: ${t.w}px; height: ${t.h}px`}
            role="group"
            aria-label=${In(377)}
          >
            ${d}
            ${c?n.JW`${this._partPaths(c).map(e=>n.JW`<path class="hover" d=${e} style=${"stroke-width: "+2*i}></path>`)}`:n.s6}
            <g style=${`--u: ${i}`}>${this._selected(s,i)}</g>
            ${this._motionPath(i)}
            ${l?n.JW`<rect class="band" x=${Math.min(l[0][0],l[1][0])} y=${Math.min(l[0][1],l[1][1])}
                  width=${Math.abs(l[1][0]-l[0][0])} height=${Math.abs(l[1][1]-l[0][1])} style=${`stroke-width: ${i}`}></rect>`:n.s6}
          </svg>`:n.s6}
    </div>`}};Zv.styles=n.AH`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    .layer {
      position: absolute;
      inset: 0;
    }
    svg.ov {
      position: absolute;
      overflow: visible;
    }
    .hit path {
      fill: transparent;
      stroke: transparent;
      cursor: pointer;
    }
    .hover {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      opacity: 0.7;
      vector-effect: non-scaling-stroke;
      stroke-width: 1.5px !important;
      pointer-events: none;
    }
    .sel-outline {
      fill: color-mix(in srgb, var(--primary-color, #03a9f4) 14%, transparent);
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .bbox {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 1px;
      stroke-dasharray: 4 3;
      vector-effect: non-scaling-stroke;
      pointer-events: none;
    }
    .pivot {
      cursor: move;
      outline: none;
    }
    .pivot-hit {
      fill: transparent;
    }
    .pivot-ring {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-color, #03a9f4);
    }
    .pivot-cross {
      stroke: var(--primary-color, #03a9f4);
      pointer-events: none;
    }
    .pivot:focus-visible .pivot-ring {
      stroke: var(--primary-text-color, #212121);
    }
    .mline {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-dasharray: 3 2;
      vector-effect: non-scaling-stroke;
      stroke-width: 1.5px !important;
      pointer-events: none;
    }
    .anchor {
      cursor: grab;
    }
    .anchor-hit {
      fill: transparent;
    }
    .anchor-dot {
      fill: var(--card-background-color, #fff);
      stroke: var(--primary-color, #03a9f4);
    }
    .band {
      fill: color-mix(in srgb, var(--primary-color, #03a9f4) 10%, transparent);
      stroke: var(--primary-color, #03a9f4);
      vector-effect: non-scaling-stroke;
      stroke-width: 1px !important;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      .sel-outline,
      .bbox {
        transition: opacity 0.15s ease-out;
      }
    }
  `,Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"doc",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"hass",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"library",void 0),Iv([(0,s.MZ)({type:Number})],Zv.prototype,"time",void 0),Iv([(0,s.MZ)({type:Boolean})],Zv.prototype,"disabled",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"selection",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"tile",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"stage",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"layerView",void 0),Iv([(0,s.MZ)({attribute:!1})],Zv.prototype,"iconEl",void 0),Iv([(0,s.wk)()],Zv.prototype,"_box",void 0),Iv([(0,s.wk)()],Zv.prototype,"_vb",void 0),Iv([(0,s.wk)()],Zv.prototype,"_scale",void 0),Iv([(0,s.wk)()],Zv.prototype,"_hover",void 0),Iv([(0,s.wk)()],Zv.prototype,"_band",void 0),Iv([(0,s.wk)()],Zv.prototype,"_geom",void 0),Iv([(0,s.wk)()],Zv.prototype,"_live",void 0),Zv=Iv([(0,s.EM)("mc-anim-parts-overlay")],Zv),_s({tag:"mc-anim-parts-overlay",place:"stage-tool",title:376,order:20,when:(e,t)=>"keyframes"===e.kind&&iv(e)&&"tool"!==t.kind});var Kv=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Wv=[{fx:0,fy:0,label:1008},{fx:.5,fy:0,label:1007},{fx:1,fy:0,label:1009},{fx:0,fy:.5,label:411},{fx:.5,fy:.5,label:128},{fx:1,fy:.5,label:742},{fx:0,fy:1,label:99},{fx:.5,fy:1,label:98},{fx:1,fy:1,label:100}],Uv=e=>Math.round(100*e)/100,Gv=(e,t,i)=>[Uv(e[0]+e[2]*t),Uv(e[1]+e[3]*i)];let Yv=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._drawFrom=0,this._drawTo=60}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=rv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=av(e),this._geom||ov(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}const t=this._target;if((e.has("selection")||e.has("doc"))&&t&&this.doc){const e=zv(this.doc,t);if(e.length>=2){let t=0;for(;t+1<e.length&&e[t+1][1]===e[0][1];)t++;let i=e.length-1;for(;i-1>t&&e[i-1][1]===e[e.length-1][1];)i--;this._drawFrom=e[t][0],this._drawTo=e[i][0]}}}get _target(){const e=this.selection?.target;return tv(e)&&this.doc&&function(e,t){const i=Xf(t);return t.startsWith("part:")?!!e.rig?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e.rig?.groups?.some(e=>e.id===i):!!t.startsWith("shape:")&&!!e.rig?.shapes?.some(e=>e.id===i)}(this.doc,e)?e:void 0}_drawMode(e){const t=zv(this.doc,e);if(!t.length)return"none";const i=t[0][1],n=t[t.length-1][1],s=t.every((e,s)=>0===s||(i<n?e[1]>=t[s-1][1]:e[1]<=t[s-1][1]));return s&&0===i&&1===n?"on":s&&1===i&&0===n?"off":"custom"}_emit(e,t){Dv(this,e,t)}_renderName(e){const t=this.doc,i=e.startsWith("group:"),s=vv(t,[e]),r=i?0:t.rig?.parts.find(t=>t.id===Xf(e))?.from?.length??0,a=i?In(1174,{count:s.length}):r>1?In(1245,{pieces:r}):In(619);return n.qy`<div class="head">
        <span class="tile-icon"><ha-icon icon=${i?"mdi:folder-outline":"mdi:vector-square"}></ha-icon></span>
        <div class="titles">
          <span class="title">${Av(t,e)}</span>
          <span class="caption">${a} · <span class="mono">${Xf(e)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${In(532)}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${Av(t,e)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${n=>{const s=n.target.value;s.trim()&&s.trim()!==Av(t,e)&&this._emit(fv(t,e,s),In(i?722:723))}}
        />
      </div>
      ${i?n.qy`<div class="chips">
            ${s.map(e=>n.qy`<button type="button" class="chip" @click=${()=>Rv(this,Pv([`part:${e}`]))}>${Av(t,`part:${e}`)}</button>`)}
          </div>`:n.s6}`}_renderPivot(e){const t=this.doc,i=this._geom?cv(this._geom):[],s=jv(t,e,i),r=e.startsWith("group:"),a=r?t.rig?.groups?.find(t=>t.id===Xf(e))?.origin:t.rig?.parts.find(t=>t.id===Xf(e))?.origin,o=kv(t,e),l=Cv(t,e,i,$a(this._geom?.viewBox))??a,c=(i,n)=>this._emit(Sv(t,e,[i,n]),"Move pivot"),d=()=>this._emit(o?Sv(t,e,Gv(s,.5,.5)):$v(t,e,void 0),In(o?470:733)),p=(e,t)=>n.qy`<div class="field">
      <div class="field-head"><label for="pi-p${e}">${t}</label></div>
      <div class="unit">
        <input
          id="pi-p${e}"
          class="input"
          type="number"
          step="0.25"
          inputmode="decimal"
          .value=${l?String(Uv(l[e])):""}
          placeholder=${In(128)}
          ?disabled=${this.disabled}
          @change=${t=>{const i=Number(t.target.value);if(!Number.isFinite(i)||""===t.target.value)return;const n=l??[12,12];0===e?c(i,n[1]):c(n[0],i)}}
        />
        <span class="suffix" aria-hidden="true">${In(1142)}</span>
      </div>
    </div>`;return n.qy`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${In(654)}</h3>
        <span class=${o?"src is-preset":"src"} data-pivot-source=${o?"track":"part"}>${In(o?685:r?358:621)}</span>
        ${o?n.s6:(h=!!a,u=()=>this._emit($v(t,e,void 0),"Reset pivot"),h?n.qy`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,T.t)(386,{label:"pivot"})}
    title=${(0,T.t)(385)}
    @click=${e=>{e.stopPropagation(),u()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:n.s6)}
      </div>
      <p class="help">
        ${In(o?r?967:968:r?965:966)}
      </p>
      <div class="pair">${p(0,"X")} ${p(1,"Y")}</div>
      ${s?n.qy`<div class="grid3" role="group" aria-label=${In(r?656:657)}>
            ${Wv.map(e=>{const[t,i]=Gv(s,e.fx,e.fy),r=!!l&&Math.abs(l[0]-t)<.01&&Math.abs(l[1]-i)<.01;return n.qy`<button
                type="button"
                class="cell"
                aria-label=${In(658,{position:In(e.label).toLowerCase()})}
                title=${In(e.label)}
                aria-pressed=${r?"true":"false"}
                ?disabled=${this.disabled}
                @click=${()=>.5===e.fx&&.5===e.fy?d():c(t,i)}
              >
                <i></i>
              </button>`})}
          </div>`:n.s6}
      ${o?n.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(Mv(t,e,void 0),"Reset to part pivot")}>
              ${In(r?734:735)}
            </button>
          </div>`:n.s6}
    </section>`;var h,u}_renderDraw(e){const t=this.doc,i=this._drawMode(e),s=dv(t,e),r=i=>this._emit(Ev(t,e,i,this._drawFrom,this._drawTo),In("none"===i?710:"on"===i?262:261)),a=[{id:"none",label:In(594)},{id:"on",label:In(262)},{id:"off",label:In(261)}],o=(t,s,r,a)=>n.qy`<div class="field">
      <div class="field-head"><label for=${t}>${s}</label></div>
      <div class="unit">
        <input
          id=${t}
          class="input"
          type="number"
          min="0"
          max="100"
          step="1"
          inputmode="decimal"
          .value=${String(r)}
          ?disabled=${this.disabled}
          @change=${t=>{const n=Math.max(0,Math.min(100,Number(t.target.value)));Number.isFinite(n)&&(a(n),"on"!==i&&"off"!==i||this._emit(Ev(this.doc,e,i,this._drawFrom,this._drawTo),"Draw timing"))}}
        />
        <span class="suffix" aria-hidden="true">%</span>
      </div>
    </div>`;return n.qy`<section class="group" aria-labelledby="pi-draw">
      <div class="group-head">
        <ha-icon icon="mdi:draw"></ha-icon>
        <h3 id="pi-draw">${In(258)}</h3>
      </div>
      <p class="help">${In(959)}</p>
      <div class="seg full" role="radiogroup" aria-label=${In(258)}>
        ${a.map(e=>n.qy`<button type="button" role="radio" aria-checked=${i===e.id?"true":"false"} ?disabled=${this.disabled||s&&"none"!==e.id} @click=${()=>r(e.id)}>${e.label}</button>`)}
      </div>
      ${s?n.qy`<p class="help cap">${pv()}</p>`:n.s6}
      ${"custom"===i?n.qy`<p class="help">${In(997)}</p>`:n.s6}
      ${"none"!==i?n.qy`<div class="pair">
            ${o("pi-df",In(877),this._drawFrom,e=>this._drawFrom=e)}
            ${o("pi-dt",In(175),this._drawTo,e=>this._drawTo=Math.max(e,this._drawFrom))}
          </div>`:n.s6}
    </section>`}_renderPath(e){const t=this.doc,i=hv(t,e)?.path,s=!i&&dv(t,e);return n.qy`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${In(452)}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${In(339)}</span>
          <p class="help">${In(498)}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${i?"true":"false"} aria-label=${In(339)} ?disabled=${this.disabled||s} @click=${()=>this._emit(Lv(t,e,i?void 0:{d:Hv}),In(i?715:30))}></button>
      </div>
      ${s?n.qy`<p class="help cap">${pv()}</p>`:n.s6}
      ${i?n.qy`<div class="field">
              <div class="field-head"><label for="pi-tpl">${In(806)}</label></div>
              <div class="select">
                <select
                  id="pi-tpl"
                  class="input"
                  ?disabled=${this.disabled}
                  @change=${n=>{const s=n.target.value;if(!s)return;const r="arc"===s?Hv:ha(s,[0,0],4);this._emit(Lv(t,e,{...i,d:r}),"Path shape"),n.target.value=""}}
                >
                  <option value="">${In(731)}</option>
                  <option value="arc">${In(70)}</option>
                  ${da.map(e=>n.qy`<option value=${e.id}>${In(e.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${In(1025)}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${i.follow_rotation?"true":"false"}
                aria-label=${In(1025)}
                ?disabled=${this.disabled}
                @click=${()=>this._emit(Lv(t,e,{...i,follow_rotation:!i.follow_rotation}),"Path rotation")}
              ></button>
            </div>`:n.s6}
    </section>`}_renderKeys(e){const t=this.doc,i=hv(t,e),s=i?.keyframes.length??0;return n.qy`<section class="group" aria-labelledby="pi-keys">
      <div class="group-head">
        <ha-icon icon="mdi:timeline-outline"></ha-icon>
        <h3 id="pi-keys">${In(399)}</h3>
      </div>
      <p class="help">
        ${s?In(1161,{count:s}):In(557)}
      </p>
      ${i?n.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(uv(t,e,void 0),"Remove part animation")}>
              ${In(719)}
            </button>
          </div>`:n.s6}
    </section>`}render(){const e=this._target;return this.doc&&e?n.qy`<div class="insp">
      ${this._renderName(e)} ${this._renderPivot(e)} ${this._renderDraw(e)} ${this._renderPath(e)} ${this._renderKeys(e)}
    </div>`:n.qy``}};Yv.styles=[ps,hs,n.AH`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      .insp {
        display: grid;
        gap: 16px;
      }
      .head {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .tile-icon {
        width: 40px;
        height: 40px;
        flex: none;
        display: grid;
        place-items: center;
        border-radius: var(--mc-radius-md, 8px);
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 22px;
      }
      .titles {
        display: grid;
        min-width: 0;
      }
      .title {
        font-size: 1rem;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .caption {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 120px), 1fr));
        gap: 12px;
      }
      .unit {
        position: relative;
        display: flex;
      }
      .unit .input {
        flex: 1;
        min-width: 0;
        padding-right: 52px;
      }
      .suffix {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--mc-text-2);
        font-size: 0.8125rem;
        pointer-events: none;
      }
      .grid3 {
        display: grid;
        grid-template-columns: repeat(3, 32px);
        gap: 4px;
      }
      .cell {
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border: 1px solid var(--mc-field-border);
        border-radius: var(--mc-radius-sm, 6px);
        background: var(--mc-surface);
        padding: 0;
        cursor: pointer;
      }
      .cell i {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mc-text-2);
      }
      .cell[aria-pressed='true'] {
        border-color: var(--mc-accent);
        background: var(--mc-accent-tint);
      }
      .cell[aria-pressed='true'] i {
        background: var(--mc-accent-ink);
      }
      .cell:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
      .help {
        margin: 0;
      }
      /* which pivot the fields edit (a chip look; not .chip, the member chips use that) */
      .src {
        display: inline-flex;
        align-items: center;
        min-height: 20px;
        padding: 0 8px;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        background: var(--mc-surface);
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1;
        color: var(--mc-text-2);
        white-space: nowrap;
      }
      .src.is-preset {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
    `],Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"doc",void 0),Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"hass",void 0),Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"library",void 0),Kv([(0,s.MZ)({type:Number})],Yv.prototype,"time",void 0),Kv([(0,s.MZ)({type:Boolean})],Yv.prototype,"disabled",void 0),Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"selection",void 0),Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"tile",void 0),Kv([(0,s.MZ)({attribute:!1})],Yv.prototype,"stage",void 0),Kv([(0,s.wk)()],Yv.prototype,"_geom",void 0),Kv([(0,s.wk)()],Yv.prototype,"_drawFrom",void 0),Kv([(0,s.wk)()],Yv.prototype,"_drawTo",void 0),Yv=Kv([(0,s.EM)("mc-anim-part-inspector")],Yv),_s({tag:"mc-anim-part-inspector",place:"inspector",title:619,order:20,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&tv(t.target)});const Jv=["select","pen","line","rect","ellipse","freehand","erase","motion"],Xv=e=>"string"==typeof e&&Jv.includes(e),Qv=e=>"string"==typeof e&&e.startsWith("shape:"),eb=e=>"string"==typeof e&&/^(part|group|shape):/.test(e);function tb(e,t){return"keyframes"===e.kind&&"tool"===t.kind&&Xv(t.tool)}function ib(e){return"target"===e.kind||"tool"===e.kind&&"select"===e.tool?(e=>Qv(e)?e.slice(6):void 0)(e.target):void 0}function nb(e){return"tool"===e.kind&&Xv(e.tool)?e.tool:"select"}const sb={select:{label:780,icon:"mdi:cursor-default-outline",base:"shape",hint:151},pen:{label:648,icon:"mdi:fountain-pen-tip",base:"path",hint:154},line:{label:419,icon:"mdi:vector-line",base:"line",hint:251},rect:{label:699,icon:"mdi:square-rounded-outline",base:"rect",hint:253},ellipse:{label:293,icon:"mdi:ellipse-outline",base:"ellipse",hint:252},freehand:{label:344,icon:"mdi:draw",base:"stroke",hint:259},erase:{label:307,icon:"mdi:eraser",base:"shape",hint:152},motion:{label:452,icon:"mdi:map-marker-path",base:"path",hint:264}},rb={fill:"currentColor",stroke:"",strokeWidth:1.5,linecap:"round",layer:"over",radius:2,tolerance:.4,grid:!0,anchors:!0,follow:!1};function ab(e,t){const i=()=>({stroke:e.stroke||"currentColor",stroke_width:e.strokeWidth,linecap:e.linecap});if(!t)return i();const n={};return e.fill&&(n.fill=e.fill),e.stroke&&Object.assign(n,i()),e.fill||e.stroke||(n.fill="currentColor"),n}const ob=new class{constructor(){this.options={...rb},this.hint="",this._hintListeners=new Set,this._listeners=new Set}setHint(e){if(e!==this.hint){this.hint=e;for(const e of this._hintListeners)e()}}onHint(e){return this._hintListeners.add(e),()=>this._hintListeners.delete(e)}set(e){this.options={...this.options,...e},this._emit()}setLastFreehand(e){this.lastFreehand=e,this._emit()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}reset(){this.options={...rb},this.lastFreehand=void 0,this._emit()}_emit(){for(const e of this._listeners)e()}};let lb=e=>(0,Fm.WP)(e).map(e=>({index:e.index,d:e.d,...e.stroke?{stroke:e.stroke}:{},...e.secondary?{accent:!0}:{},...e.evenodd?{evenodd:!0}:{}}));function cb(e){const t=Jn(e??"icon","m",!1)?.icon;return"string"==typeof t?t:void 0}const db=new Map;function pb(e,t){return e?.svg?Tm(e):$a(t?.viewBox).join(" ")}function hb(e,t){const i=e.rig;if(i?.svg){const e=function(e){const t=Ne(e);if(t.error)return;const i={paths:t.paths,viewBox:t.viewBox};return t.accentPaths.length&&(i.secondary=t.accentPaths),t.strokes.length&&(i.strokes=t.strokes),t.evenodd&&(i.evenodd=t.evenodd),i}(i.svg);return Promise.resolve(e?{viewBox:e.viewBox,pieces:lb(e)}:void 0)}const n=i?.icon??cb(t);if(!n)return Promise.resolve(void 0);let s=db.get(n);return s||(s=Jf(n,{timeoutMs:4e3}).then(e=>e?{viewBox:e.viewBox,pieces:lb(e)}:void 0).catch(()=>{}),db.set(n,s),s.then(e=>{e||db.delete(n)})),s}const ub="important",mb=" !"+ub,gb=(0,z.u$)(class extends z.WL{constructor(e){if(super(e),e.type!==z.OA.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return null==n?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const n=t[e];if(null!=n){this.ft.add(e);const t="string"==typeof n&&n.endsWith(mb);e.includes("-")||t?i.setProperty(e,t?n.slice(0,-11):n,t?ub:""):i[e]=n}}return A.c0}});var fb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class vb extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new wf(this,{select:(e,t)=>e.startsWith("lane:")?!this.disabled&&Cf(this,this.doc,e):this._pick(e.slice(6),t),move:(e,t)=>this._shift(e.slice(6),t),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Sf(e):this.doc?.rig?.shapes?.find(t=>t.id===e.slice(6))?.name??e})}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_pick(e,t){const i=`shape:${e}`;this._select("tool"===this.selection.kind?{kind:"tool",tool:"select",target:i}:{kind:"target",target:i})}_shift(e,t){const i=this.doc,n=i?.rig?.shapes?.find(t=>t.id===e);if(!i||!n)return;const s=Da(i,e,t);if(s===i)return;const r="under"===this.side,a=i.rig.shapes.filter(e=>"under"===e.layer===r),o="up"===t?r&&a[a.length-1].id===e:!r&&a[0].id===e;this._emit(s,In("up"===t?o?106:105:o?787:786)),this._list.announce(In(1228,{name:n.name,where:In(o?"up"===t?1125:1141:"up"===t?1144:1097)}))}_delete(e){const t=this.doc,i=t?.rig?.shapes?.find(t=>t.id===e);t&&i&&!this.disabled&&!this._list.refuseLocked(`shape:${e}`,i.name)&&(this._emit(Na(t,e),"Delete shape"),ib(this.selection)===e&&this._select({kind:"none"}))}_thumb(e,t){const i=e=>e?wh(e)??e:"currentColor",s={fill:Ma(e)?i(e.fill):"none",stroke:Sa(e)?i(e.stroke):"none","stroke-width":String(Math.max(e.stroke_width??1,1))};return n.qy`<svg class="thumb" viewBox=${t} aria-hidden="true">
      ${n.JW`<path d=${e.d} style=${gb(s)} stroke-linecap="round" stroke-linejoin="round"></path>`}
    </svg>`}render(){const e=this.doc,t=e?.rig?.shapes??[],i="under"===this.side;if(!e||!t.some(e=>"under"===e.layer===i))return n.qy``;const s=ib(this.selection),r=pb(e.rig),a=t.map((e,t)=>({s:e,i:t})).filter(e=>"under"===e.s.layer===i).reverse(),o=a[0].s.id,l=a[a.length-1].s.id;return n.qy`<ul aria-label=${In(i?815:814)}>
      ${a.map(({s:t})=>{const a=`shape:${t.id}`,c=e.tracks?.find(e=>e.target===a),d=[Ia(e,a)?In(1102):"",c?.path?"moves":""].filter(Boolean).join(", "),p=i&&o===t.id,h=!i&&l===t.id,u=jf(e,this.layerView??Ka,a,a),m=this._list.row({key:a,expanded:u,name:t.name,thumb:this._thumb(t,r),note:d,describe:d,selected:t.id===s&&!(u&&"keys"===this.selection.kind),up:{ok:!this.disabled&&Da(e,t.id,"up")!==e,label:In(p?108:107,{name:t.name}),menu:In(p?104:480)},down:{ok:!this.disabled&&Da(e,t.id,"down")!==e,label:In(h?790:789,{name:t.name}),menu:In(h?788:459)},extra:t.id!==s?void 0:n.qy`<button type="button" class="icon-btn sm danger del" data-ctl="del" tabindex="-1" aria-label=${In(235,{name:t.name})} title=${In(230)} aria-disabled=${this.disabled||this._list.locked(a)?"true":n.s6} @click=${()=>this._delete(t.id)}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>`});return u?[m,...Af(this._list,e,this.selection,a,2)]:[m]})}
    </ul>
    ${t.length>=48?n.qy`<p class="empty-note">${In(972)}</p>`:n.s6}`}}vb.styles=[Ip,kf,n.AH`
      :host {
        display: block;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .thumb {
        flex: none;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: var(--secondary-background-color, #f2f3f5);
        color: var(--state-icon-color, #44739e);
      }
      .empty-note {
        margin: 0;
        padding: 8px;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
    `],fb([(0,s.MZ)({attribute:!1})],vb.prototype,"doc",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"selection",void 0),fb([(0,s.MZ)({type:Boolean})],vb.prototype,"disabled",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"hass",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"library",void 0),fb([(0,s.MZ)({type:Number})],vb.prototype,"time",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"tile",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"stage",void 0),fb([(0,s.MZ)({attribute:!1})],vb.prototype,"layerView",void 0),fb([(0,s.MZ)()],vb.prototype,"density",void 0);let bb=class extends vb{constructor(){super(...arguments),this.side="over"}};bb=fb([(0,s.EM)("mc-anim-shapes-layers")],bb);let yb=class extends vb{constructor(){super(...arguments),this.side="under"}};yb=fb([(0,s.EM)("mc-anim-shapes-under-layers")],yb),_s({tag:"mc-anim-shapes-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"!==e.layer),title:814,order:5}),_s({tag:"mc-anim-shapes-under-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"===e.layer),title:815,order:30});var xb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const _b=new Set(["line","rect","ellipse","freehand"]),$b={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},wb=new Set(["select","line","rect","ellipse","freehand","erase","motion"]),kb=[],Mb=[],Sb=[{fill:"none"}],jb=new Map,Cb=e=>e?wh(e)??e:void 0,Ab=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))};let zb=class extends Jg{constructor(){super(...arguments),this._selection={kind:"none"},this.disabled=!1,this.time=0,this.preview=!1,this._dropping=!1,this._announce="",this._piecesKey="",this._pointsSel=!1,this._onCanvas=e=>{e.stopPropagation();const t=e.detail,i=t.paths[0];if("pen"===nb(this.selection))return this._pen=i&&i.anchors.length?i:void 0,void(t.commit&&i?.closed&&this._finishPen(!0));const n=this._live,s=n?this._shapes.find(e=>e.id===n.id):void 0;if(!n||!s||!this.doc)return;if(this._live={...n,list:t.paths},this.requestUpdate(),!t.commit)return;if("Cancel"===t.label)return;if(!i||!i.anchors.length)return this._emitDoc(Na(this.doc,s.id),"Delete shape"),void Ab(this,{kind:"tool",tool:"select"});const r=sa(i);this._live={id:s.id,d:r,list:t.paths},ob.lastFreehand?.id===s.id&&ob.setLastFreehand(void 0),this._emitDoc(Pa(this.doc,s.id,{d:r}),Gg(t.label))},this._onCanvasSelect=e=>{this._pointsSel=(e.detail?.anchors.length??0)>0},this._endNudge=()=>{const e=this._nudge;if(!e)return;this._nudge=void 0;const t=Math.round(100*e.dx)/100,i=Math.round(100*e.dy)/100;this._emitDoc(Pa(e.base,e.id,{d:ba(e.d,t,i)}),"Nudge shape"),this._followFreehand(e.id,t,i)},this._onKeyUp=e=>{/^Arrow/.test(e.key)&&this._endNudge()},this._onKeyCapture=e=>{const t=this._selectedId;if(this.disabled||!this.doc||!t||this._pen||this._drag)return;const i="Delete"===e.key||"Backspace"===e.key;return i||/^Arrow/.test(e.key)?this._refuseLocked(t)?(e.preventDefault(),void e.stopPropagation()):void(i&&!this._pointsSel&&(e.preventDefault(),e.stopPropagation(),this._emitDoc(Na(this.doc,t),"Delete shape"),Ab(this,{kind:"tool",tool:"select"}))):void 0},this._onKey=e=>{if(this.disabled||!this.doc)return;if(this._drag&&"Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this._end(!1);if(this._kbKey(e))return;if(/^Arrow/.test(e.key)||this._endNudge(),this._pen)return void("Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._finishPen(!1)));const t=this._selectedId;if("Escape"===e.key&&t)return e.preventDefault(),e.stopPropagation(),void Ab(this,{kind:"tool",tool:"select"});if(!t)return;const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i)return;if(e.preventDefault(),this._nudge&&this._nudge.id!==t&&this._endNudge(),!this._nudge){const e=this._shapes.find(e=>e.id===t);if(!e)return;this._nudge={id:t,base:this.doc,d:e.d,dx:0,dy:0}}const n=this._nudge,s=e.shiftKey?1:.1;n.dx+=i[0]*s,n.dy+=i[1]*s,this._emitDoc(Pa(n.base,t,{d:ba(n.d,Math.round(100*n.dx)/100,Math.round(100*n.dy)/100)}),"Nudge shape",!0)},this._onDragOver=e=>{!this.disabled&&e.dataTransfer?.types?.includes("Files")&&(e.preventDefault(),this._dropping=!0)},this._onDragLeave=()=>{this._dropping=!1},this._onDrop=async e=>{this._dropping=!1;const t=e.dataTransfer?.files?.[0];if(!t||this.disabled)return;e.preventDefault();const i=await qg(t);if(this._dialog??=this.renderRoot.querySelector("mc-anim-svg-dialog")??void 0,"error"in i)return this._announce=is(i.error),void this._dialog?.openImport("",t.name);this._dialog?.openImport(i.text,t.name)},this._penList={list:kb}}get selection(){return this._selection}set selection(e){const t=e??{kind:"none"};this._pen&&"pen"!==nb(t)&&this._finishPen(!1),nb(t)!==nb(this._selection)&&(this._kb=this._cross=void 0),this._selection=t}get penPath(){return this._pen}connectedCallback(){super.connectedCallback(),this._unsub=ob.subscribe(()=>this.requestUpdate()),this._parent=this.parentNode,this.addEventListener("keydown",this._onKeyCapture,!0),this.addEventListener("keydown",this._onKey),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("blur",this._endNudge),this.addEventListener("dragover",this._onDragOver),this.addEventListener("dragleave",this._onDragLeave),this.addEventListener("drop",this._onDrop)}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this.removeEventListener("keydown",this._onKeyCapture,!0),this.removeEventListener("keydown",this._onKey),this.removeEventListener("keyup",this._onKeyUp),this.removeEventListener("blur",this._endNudge),this.removeEventListener("dragover",this._onDragOver),this.removeEventListener("dragleave",this._onDragLeave),this.removeEventListener("drop",this._onDrop),this._end(!0),this._endNudge(),this._finishPen(!1),ob.setHint("")}firstUpdated(){this.hasAttribute("tabindex")||(this.tabIndex=0)}willUpdate(e){if(e.has("selection")){const t=e.get("selection");t?.target!==this.selection.target&&(this._pointsSel=!1)}if((e.has("doc")||e.has("tile")||e.has("pieces"))&&!this.pieces&&this.doc){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._piecesKey&&(this._piecesKey=e,hb(this.doc,this.tile).then(t=>{this._piecesKey===e&&(this._resolved=t)}))}this.ensureCanvas()}get _viewBox(){return this.viewBox??this.stage?.viewBox?.join(" ")??pb(this.doc?.rig,this._resolved)}_view(){const e=this.stage,t=e?.rect?.width||this.stageRect?.width||360,i=e?.rect?.height||this.stageRect?.height||240,n=$a(this._viewBox),s=this.iconRect??e?.subject??this.stageRect?.subject??this.subjectRect;let r;if(s&&s.width>8&&s.height>8)r=s;else{const e=Math.max(48,Math.min(t,i)-48);r={x:(t-e)/2,y:(i-e)/2,width:e,height:e}}const a=Math.min(r.width/n[2],r.height/n[3]),o=Yg(e,{x:r.x+(r.width-n[2]*a)/2,y:r.y+(r.height-n[3]*a)/2,width:n[2]*a,height:n[3]*a});if(!(o&&a>0))return;const l=this._viewCache;return l&&l.vb.every((e,t)=>e===n[t])&&["left","top","width","height"].every(e=>Math.abs(l.place[e]-o[e])<.005)?l:this._viewCache={vb:n,place:o,ppu:o.width/n[2]}}_toPx(e,t){return[e.place.left+(t[0]-e.vb[0])*e.ppu,e.place.top+(t[1]-e.vb[1])*e.ppu]}_toVB(e,t){return[e.vb[0]+(t[0]-e.place.left)/e.ppu,e.vb[1]+(t[1]-e.place.top)/e.ppu]}_local(e){const t=this.getBoundingClientRect();return[e.clientX-t.left,e.clientY-t.top]}get _previewShapes(){return this.preview||!!this.tile&&!cb(this.tile)}get _shapes(){return this.doc?.rig?.shapes??[]}get _pieceList(){return this.pieces??this._resolved?.pieces??[]}_isLocked(e){return!!this.doc&&!!this.layerView?.locked.length&&no(this.doc,this.layerView,`shape:${e}`)}_refuseLocked(e){return!!this._isLocked(e)&&(this._announce=In(1219,{name:this._shapes.find(t=>t.id===e)?.name??In(806)}),!0)}get _selectedId(){return ib(this.selection)}_snapAnchors(e){if(!ob.options.anchors)return[];const t=this._anchorCache,i=this._shapes,n=this._pieceList;if(!t||t.shapes!==i||t.pieces!==n||t.exclude!==e){const t=[];for(const e of n)t.push(...ya(e.d));for(const n of i)n.id!==e&&t.push(...ya(n.d));this._anchorCache={shapes:i,pieces:n,exclude:e,pts:t}}return this._anchorCache.pts}_snap(e,t,i){if(i)return this._snapAt=void 0,[Math.round(100*t[0])/100,Math.round(100*t[1])/100];const n=function(e,t){if(t.anchors?.length&&t.radius){let i,n=t.radius;for(const s of t.anchors){const t=(0,de.xg)(s,e);t<=n&&(n=t,i=s)}if(i)return{p:[i[0],i[1]],kind:"anchor"}}return t.grid&&t.grid>0?{p:[ma(Math.round(e[0]/t.grid)*t.grid),ma(Math.round(e[1]/t.grid)*t.grid)],kind:"grid"}:{p:[ma(e[0]),ma(e[1])],kind:null}}(t,{grid:ob.options.grid?1:0,anchors:this._snapAnchors(),radius:10/e.ppu});return this._snapAt="anchor"===n.kind?n.p:void 0,n.p}_snapConfig(e){const t=ob.options.grid?1:0;let i;if(ob.options.anchors){const t=[this._shapes,this._pieceList,e];if(!this._lines||this._lines.key.some((e,i)=>e!==t[i])){const i=new Set,n=new Set;for(const t of this._snapAnchors(e))i.size<300&&i.add(t[0]),n.size<300&&n.add(t[1]);this._lines={key:t,extra:{x:[...i],y:[...n]}}}i=this._lines.extra}const n=`${t}|${e??""}`,s=jb.get(n);if(s&&s.extra===i)return s;const r={enabled:!0,grid:t,anchors:!1,frame:!1,extra:i};return jb.set(n,r),r}_emitDoc(e,t,i=!1){i||(this._announce=t),(this.isConnected?this:this._parent?.isConnected?this._parent:this).dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_commitShape(e,t,i){if(!this.doc||!t)return;if(this._shapes.length>=Ui)return void(this._announce=In(1171,{count:Ui}));const n=sb[e],s=Ea(Va(this.doc),n.base),r=this._shapes.filter(e=>e.id.startsWith(`${n.base}-`)).length+1,a={id:s,name:`${In("pen"===e?642:"freehand"===e?904:n.label)} ${r}`,d:t,layer:ob.options.layer,...ab(ob.options,i)},o=Oa(this.doc,a);return o?(this._emitDoc(o,`Draw ${e}`),this._announce="pen"===e?In(1182,{name:a.name,count:ya(t).length}):In(1215,{name:a.name}),s):void 0}_finishPen(e){const t=this._pen;if(this._pen=void 0,!t||t.anchors.length<2)return;const i=e?{...t,closed:!0}:t;this._commitShape("pen",sa(i),i.closed)}_capture(e){e.preventDefault();try{this.renderRoot.querySelector("svg.tool")?.setPointerCapture(e.pointerId)}catch{}}_onDown(e){const t=this._view();if(this.disabled||e.button>0||!this.doc||this._drag||!t)return;this._endNudge(),this.focus({preventScroll:!0,focusVisible:!1});const i=this._local(e),n=this._toVB(t,i),s=nb(this.selection);if(!_b.has(s)&&"motion"!==s||this.chunk)switch(s){case"select":{const s=za(this._shapes.filter(e=>!this._isLocked(e.id)),n,6/t.ppu);if(!s){const e=za(this._shapes,n,6/t.ppu);if(e&&this._refuseLocked(e))return;return void(this._selectedId&&Ab(this,{kind:"tool",tool:"select"}))}s!==this._selectedId&&Ab(this,{kind:"tool",tool:"select",target:`shape:${s}`});const r=this._shapes.find(e=>e.id===s);return this._capture(e),void(this._drag={kind:"move",pointerId:e.pointerId,id:s,base:this.doc,d:r.d,start:n,startPx:i,moved:!1,delta:[0,0]})}case"erase":return this._capture(e),this._drag={kind:"erase",pointerId:e.pointerId,base:this.doc,ids:[]},void this._eraseAt(n,t);case"line":case"rect":case"ellipse":{const i=this._snap(t,n,e.shiftKey&&"line"===s);return this._capture(e),void(this._drag={kind:"box",tool:s,pointerId:e.pointerId,a:i,b:i,shift:e.shiftKey,alt:e.altKey})}case"freehand":case"motion":return"motion"!==s||eb(this.selection.target)?"motion"===s&&this.layerView&&no(this.doc,this.layerView,this.selection.target)?void(this._announce=In(917)):(this._capture(e),this._drag={kind:"free",tool:s,pointerId:e.pointerId,raw:[n],poly:`${i[0].toFixed(1)},${i[1].toFixed(1)}`,last:i},void this.requestUpdate()):void(this._announce=In(781))}else this._announce=In(935)}_boxPath(e,t,i,n,s){const r=this.chunk?.pathDraw;if(!r||Math.hypot(i[0]-t[0],i[1]-t[1])<.2)return;if("line"===e)return r.linePath(t,i);const a=function(e,t,i,n){let s=t[0]-e[0],r=t[1]-e[1];if(i){const e=Math.max(Math.abs(s),Math.abs(r));s=Math.sign(s||1)*e,r=Math.sign(r||1)*e}return n?{x:ma(e[0]-Math.abs(s)),y:ma(e[1]-Math.abs(r)),w:ma(2*Math.abs(s)),h:ma(2*Math.abs(r))}:{x:ma(Math.min(e[0],e[0]+s)),y:ma(Math.min(e[1],e[1]+r)),w:ma(Math.abs(s)),h:ma(Math.abs(r))}}(t,i,n,s);return a.w<.2||a.h<.2?void 0:"rect"===e?r.rectPath(a.x,a.y,a.w,a.h,ob.options.radius):r.ellipsePath(a.x+a.w/2,a.y+a.h/2,a.w/2,a.h/2)}_commitBox(e,t,i,n,s){const r=this._boxPath(e,t,i,n,s);return r&&this._commitShape(e,r,"line"!==e),!!r}_eraseAt(e,t){const i=this._drag;if("erase"!==i?.kind)return;let n=i.base;for(const e of i.ids)n=Na(n,e);const s=za((n.rig?.shapes??[]).filter(e=>!this._isLocked(e.id)),e,6/t.ppu);s&&(i.ids.push(s),this._emitDoc(Na(n,s),"Erase shape",!0))}_onMove(e){const t=this._drag,i=this._view();if(!t||!i||e.pointerId!==t.pointerId)return;const n=this._local(e),s=this._toVB(i,n);switch(t.kind){case"box":return t.b=this._snap(i,s,e.shiftKey&&"line"===t.tool),t.shift=e.shiftKey,t.alt=e.altKey,void this.requestUpdate();case"free":{const n="function"==typeof e.getCoalescedEvents?e.getCoalescedEvents():[];let s=!1;for(const r of n.length?n:[e]){if(t.raw.length>=4e3)break;const e=this._local(r);Math.hypot(e[0]-t.last[0],e[1]-t.last[1])<.75||(t.raw.push(this._toVB(i,e)),t.poly+=` ${e[0].toFixed(1)},${e[1].toFixed(1)}`,t.last=e,s=!0)}return void(s&&this.requestUpdate())}case"erase":return void this._eraseAt(s,i);case"move":{if(!t.moved&&Math.hypot(n[0]-t.startPx[0],n[1]-t.startPx[1])<3)return;t.moved=!0;let i=s[0]-t.start[0],r=s[1]-t.start[1];return!e.shiftKey&&ob.options.grid&&(i=Math.round(i),r=Math.round(r)),t.delta=[Math.round(100*i)/100,Math.round(100*r)/100],void this._emitDoc(Pa(t.base,t.id,{d:ba(t.d,t.delta[0],t.delta[1])}),"Move shape",!0)}}}_onUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&this._end(!0)}_end(e){const t=this._drag;if(!t)return;this._drag=void 0,this._snapAt=void 0;try{const e=this.renderRoot.querySelector("svg.tool");e?.hasPointerCapture?.(t.pointerId)&&e.releasePointerCapture(t.pointerId)}catch{}if(!e||!this.doc)return"move"===t.kind&&t.moved&&this._emitDoc(t.base,"Move shape"),"erase"===t.kind&&t.ids.length&&this._emitDoc(t.base,"Erase shape"),void this.requestUpdate();const i=this.chunk?.pathDraw;switch(t.kind){case"box":this._commitBox(t.tool,t.a,t.b,t.shift,t.alt);break;case"free":{const e=i?.fitFreehand(t.raw,ob.options.tolerance);if(!e?.d)break;if("freehand"===t.tool){const i=this._commitShape("freehand",e.d,e.closed);i&&ob.setLastFreehand({id:i,raw:t.raw})}else{const t=this.selection.target,i=Ba(this.doc,t,e.d,ob.options.follow);i?this._emitDoc(i,"Draw motion path"):this._announce=In(1258,{tracks:24})}break}case"move":t.moved&&(this._emitDoc(Pa(t.base,t.id,{d:ba(t.d,t.delta[0],t.delta[1])}),"Move shape"),this._followFreehand(t.id,t.delta[0],t.delta[1]));break;case"erase":{if(!t.ids.length)break;let e=t.base;for(const i of t.ids)e=Na(e,i);this._emitDoc(e,In(1173,{count:t.ids.length}));break}}this.requestUpdate()}_followFreehand(e,t,i){const n=ob.lastFreehand;n?.id===e&&(t||i)&&ob.setLastFreehand({id:e,raw:n.raw.map(e=>[e[0]+t,e[1]+i])})}_finishButton(){this._kb?this._finishStroke():this._finishPen(!1),this._focusArea()}_focusArea(){this.updateComplete.then(()=>{(("view"!==this._canvasPaths().mode?this.renderRoot.querySelector("mc-path-canvas"):null)??this).focus({preventScroll:!0})})}_finishStroke(){const e=this._kb;this._kb=void 0;const t=this.chunk?.pathDraw;if(!e||!t||e.pts.length<2)return;const i=[e.pts[0]];for(let t=1;t<e.pts.length;t++){const n=e.pts[t-1],s=e.pts[t],r=Math.max(1,Math.ceil(Math.hypot(s[0]-n[0],s[1]-n[1])/.5));for(let e=1;e<=r;e++)i.push([n[0]+(s[0]-n[0])*e/r,n[1]+(s[1]-n[1])*e/r])}const n=t.fitFreehand(i,ob.options.tolerance);if(!n?.d)return;const s=this._commitShape("freehand",n.d,n.closed);s&&ob.setLastFreehand({id:s,raw:i})}_kbKey(e){const t=nb(this.selection);if(!_b.has(t)||this._selectedId||this._pen||e.composedPath()[0]!==this||e.ctrlKey||e.metaKey)return!1;if("Escape"===e.key)return!!this._kb&&(e.preventDefault(),e.stopPropagation(),this._kb=void 0,this._announce=In(267),!0);const i=$b[e.key];if(!i&&"Enter"!==e.key)return!1;e.preventDefault(),e.stopPropagation();const n=this._view();if(!n)return!0;if(!this.chunk)return this._announce=In(935),!0;const s=t,r=this._cross??[n.vb[0]+n.vb[2]/2,n.vb[1]+n.vb[3]/2],a=e=>String(Math.round(100*e)/100);if(i){const t=e.altKey?.1:e.shiftKey?5:1,o=ob.options.grid&&!e.altKey,l=(e,t,i)=>{const n=Math.min(t+i,Math.max(t,e));return o?Math.round(n):Math.round(100*n)/100},c=[l(r[0]+i[0]*t,n.vb[0],n.vb[2]),l(r[1]+i[1]*t,n.vb[1],n.vb[3])];this._cross=c;const d="freehand"!==s&&!!this._kb,p={x:a(c[0]),y:a(c[1])};return this._announce=In("freehand"===s?200:d?201:202,p),!0}this._cross=r;const o=this._kb;if("freehand"===s){const e=o?.pts[o.pts.length-1];if(o&&e&&e[0]===r[0]&&e[1]===r[1])return o.pts.length>1?this._finishStroke():this._announce=In(458),!0;const t=[...o?.pts??[],r];return this._kb={tool:s,pts:t},this._announce=In(675,{count:t.length}),!0}return o?this._commitBox(s,o.pts[0],r,!1,!1)?this._kb=void 0:this._announce=In(458):(this._kb={tool:s,pts:[r]},this._announce=In(876,{x:a(r[0]),y:a(r[1])})),!0}toolsReady(){this._announce=In(936),this._focusArea()}_grid(e){const t=nb(this.selection);if(!ob.options.grid||e.ppu<6||"select"===t||"erase"===t)return n.s6;const[i,s,r,a]=e.vb,o=[];for(let t=0;t<=r;t++)o.push(`M${(e.place.left+t*e.ppu).toFixed(1)} ${e.place.top.toFixed(1)}v${e.place.height.toFixed(1)}`);for(let t=0;t<=a;t++)o.push(`M${e.place.left.toFixed(1)} ${(e.place.top+t*e.ppu).toFixed(1)}h${e.place.width.toFixed(1)}`);return n.JW`<path class="grid" d=${o.join("")}></path>`}_shapesLayer(e){if(!this._previewShapes||!this._shapes.length)return n.s6;const t=this._selectedId;return n.JW`<g class="shapes" transform="translate(${e.place.left-e.vb[0]*e.ppu} ${e.place.top-e.vb[1]*e.ppu}) scale(${e.ppu})">
      ${Ca(this._shapes).map(e=>n.JW`<path class="${e.id===t?"sel":""} ${e.layer}" data-id=${e.id} d=${e.d} style=${gb(function(e){return{fill:Ma(e)?Cb(e.fill)??"currentColor":"none",stroke:Sa(e)?Cb(e.stroke)??"currentColor":"none","stroke-width":String(e.stroke_width??1),"stroke-linecap":e.linecap??"butt","stroke-linejoin":"round"}}(e))}></path>`)}
    </g>`}_pxD(e,t){return t?(0,de.Mj)(t).map(t=>{if(!t.length)return"";const i=t=>this._toPx(e,t),n=i(t[0][0]);return`M${n[0].toFixed(1)} ${n[1].toFixed(1)}${t.map(e=>`C${[e[1],e[2],e[3]].map(e=>i(e).map(e=>e.toFixed(1)).join(" ")).join(" ")}`).join("")}`}).join(""):""}_selectionBox(e){const t=this._selectedId,i=t?this._shapes.find(e=>e.id===t):void 0,s=i?_a(i.d):void 0;if(!s)return n.s6;const[r,a]=this._toPx(e,[s.x,s.y]);return n.JW`<rect class="bbox" x=${r-4} y=${a-4} width=${s.w*e.ppu+8} height=${s.h*e.ppu+8} rx="2"></rect>`}_dragLayer(e){const t=this._drag,i=this._kb;if(i&&this._cross){if("freehand"===i.tool)return n.JW`<polyline class="draft" points=${[...i.pts,this._cross].map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")}></polyline>`;const t=this._boxPath(i.tool,i.pts[0],this._cross,!1,!1);return t?n.JW`<path class="draft ${"line"===i.tool?"":"fillable"}" d=${this._pxD(e,t)}></path>`:n.s6}if(!t)return n.s6;if("box"===t.kind){const i=this._boxPath(t.tool,t.a,t.b,t.shift,t.alt);return i?n.JW`<path class="draft ${"line"===t.tool?"":"fillable"}" d=${this._pxD(e,i)}></path>`:n.s6}return"free"===t.kind?n.JW`<polyline class="draft" points=${t.poly}></polyline>`:n.s6}_ghost(e){const t=ob.lastFreehand;if(!t||!this._shapes.some(e=>e.id===t.id))return n.s6;const i=nb(this.selection);if(this._selectedId!==t.id&&"freehand"!==i)return n.s6;const s=`${e.ppu}|${e.place.left}|${e.place.top}`;this._ghostCache?.raw===t.raw&&this._ghostCache.key===s||(this._ghostCache={raw:t.raw,key:s,pts:t.raw.map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")});const r=this._ghostCache.pts;return n.JW`<polyline class="ghost-casing" points=${r}></polyline><polyline class="ghost" points=${r}></polyline>`}_motion(e){const t=this.selection.target;if(!eb(t))return n.s6;const i=this.doc?.tracks?.find(e=>e.target===t);if(!i?.path?.d)return n.s6;const s=this._targetCentre(t);return s?n.JW`<path class="motion" d=${this._pxD(e,ba(i.path.d,s[0],s[1]))}></path>`:n.s6}_targetCentre(e){const[t,i]=e.split(":"),n=this.doc?.rig,s="group"===t?n?.groups?.find(e=>e.id===i)?.parts??[]:[i],r=new Set(s.flatMap(e=>n?.parts.find(t=>t.id===e)?.from??[])),a="shape"===t?this._shapes.find(e=>e.id===i)?.d??"":this._pieceList.filter(e=>r.has(e.index)).map(e=>e.d).join(" "),o=a?_a(a):void 0;if(o)return[o.x+o.w/2,o.y+o.h/2];const l=$a(this._viewBox);return[l[0]+l[2]/2,l[1]+l[3]/2]}_crossMark(e){if(!this._cross||!_b.has(nb(this.selection)))return n.s6;const[t,i]=this._toPx(e,this._cross),s=`M${t-9} ${i}h18M${t} ${i-9}v18`;return n.JW`<path class="cross-casing" d=${s}></path><path class="cross" d=${s}></path>`}_dots(e){return("box"===this._drag?.kind||this._pen)&&ob.options.anchors?n.JW`<g class="dots">${this._snapAnchors().slice(0,600).map(t=>{const[i,s]=this._toPx(e,t);return n.JW`<circle cx=${i} cy=${s} r="1.5"></circle>`})}</g>`:n.s6}_hint(){const e=nb(this.selection);return this._pen?this._pen.anchors.length<2?In(155):In(sb.pen.hint):"motion"!==e||eb(this.selection.target)?"select"!==e||this._shapes.length?this._drag||this._selectedId?"":In(sb[e].hint):In(561):In(782)}_labelArea(){const e=nb(this.selection);if(this.disabled||!wb.has(e)){for(const e of["role","aria-roledescription","aria-label"])this.removeAttribute(e);return}this.setAttribute("role","application"),this.setAttribute("aria-roledescription",In(1101));const t=_b.has(e)?` ${In(71)}`:"";this.setAttribute("aria-label",In(1201,{label:In(sb[e].label),hint:In(sb[e].hint)})+t)}updated(){this._labelArea(),ob.setHint(this.disabled?"":this._hint())}_canvasPaths(){if(this.disabled||"ready"!==this.canvasState)return{mode:"view",paths:kb,paint:Mb};if("pen"===nb(this.selection))return this._penList.src!==this._pen&&(this._penList={src:this._pen,list:this._pen?[this._pen]:kb}),{mode:"add",paths:this._penList.list,paint:Mb};const e=this._selectedId,t=e?this._shapes.find(t=>t.id===e):void 0;return!t||this._isLocked(t.id)||1!==(0,de.Mj)(t.d).length?{mode:"view",paths:kb,paint:Mb}:(this._live?.id===t.id&&this._live.d===t.d||(this._live={id:t.id,d:t.d,list:[na(t.d)]}),{mode:"nodes",paths:this._live.list,paint:Sb,exclude:t.id})}render(){const e=this._view();if(!e)return n.qy`${this.renderNotice()}`;const t=nb(this.selection),i=this._canvasPaths(),s=wb.has(t)&&!this.disabled,r={x:e.vb[0],y:e.vb[1],w:e.vb[2],h:e.vb[3]};return n.qy`
      <svg class="layer" aria-hidden="true">
        ${this._grid(e)}
        <rect class="board" x=${e.place.left} y=${e.place.top} width=${e.place.width} height=${e.place.height} rx="2"></rect>
        ${this._shapesLayer(e)} ${this._ghost(e)} ${this._motion(e)} ${this._dots(e)} ${this._selectionBox(e)} ${this._dragLayer(e)} ${this._crossMark(e)}
        ${this._snapAt?n.JW`<circle class="snap" cx=${this._toPx(e,this._snapAt)[0]} cy=${this._toPx(e,this._snapAt)[1]} r="7"></circle>`:n.s6}
      </svg>
      ${s?n.qy`<svg
            class="tool t-${t}"
            aria-hidden="true"
            @pointerdown=${e=>this._onDown(e)}
            @pointermove=${e=>this._onMove(e)}
            @pointerup=${e=>this._onUp(e)}
            @pointercancel=${()=>this._end(!1)}
            @lostpointercapture=${e=>{this._drag&&e.pointerId===this._drag.pointerId&&this._end(!0)}}
          >
            <rect class="bg" x="0" y="0" width="100%" height="100%"></rect>
          </svg>`:n.s6}
      ${"ready"===this.canvasState?n.qy`<mc-path-canvas
            overlay
            .placement=${e.place}
            .frame=${r}
            .paths=${i.paths}
            .paint=${i.paint}
            .mode=${i.mode}
            .maxPaths=${1}
            .gridStep=${1}
            .snap=${this._snapConfig(i.exclude)}
            .nudge=${1}
            .bigNudge=${5}
            .fineNudge=${.1}
            aria-label=${In("pen"===t?649:809)}
            @mc-path-change=${this._onCanvas}
            @mc-path-select=${this._onCanvasSelect}
            @mc-path-limit=${()=>this._announce=In(963)}
          ></mc-path-canvas>`:n.s6}
      ${this._pen&&this._pen.anchors.length>=2||"freehand"===this._kb?.tool&&this._kb.pts.length>=2?n.qy`<button type="button" class="finish" @click=${()=>this._finishButton()}>${In(327)}</button>`:n.s6}
      ${this._dropping?n.qy`<div class="drop">${In(275)}</div>`:n.s6} ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `}};zb.styles=[Jg.styles,n.AH`
      :host {
        position: absolute;
        inset: 0;
        color: var(--state-icon-color, #44739e);
        --do-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      :host(:focus) {
        outline: none;
      }
      :host(:focus-visible) {
        outline: 2px solid var(--ch-accent);
        outline-offset: -2px;
      }
      svg.tool {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: auto;
        cursor: crosshair;
      }
      svg.tool.t-select {
        cursor: default;
      }
      svg.tool.t-erase {
        cursor: cell;
      }
      .bg {
        fill: transparent;
      }
      .grid {
        fill: none;
        stroke: color-mix(in srgb, var(--ch-ink) 6%, transparent);
      }
      .board {
        fill: none;
        stroke: color-mix(in srgb, var(--ch-ink) 30%, transparent);
        stroke-dasharray: 4 3;
      }
      .shapes .under {
        opacity: 0.5;
      }
      .ghost-casing {
        fill: none;
        stroke: var(--ch-surface);
        stroke-width: 3;
        stroke-linejoin: round;
        opacity: 0.85;
      }
      .ghost {
        fill: none;
        stroke: var(--ch-ink);
        stroke-width: 1.25;
        stroke-dasharray: 2 3;
        stroke-linecap: round;
      }
      .draft {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .draft.fillable {
        fill: color-mix(in srgb, var(--ch-accent) 12%, transparent);
      }
      .motion {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1.5;
        stroke-dasharray: 5 4;
      }
      .bbox {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1;
      }
      .snap {
        fill: none;
        stroke: var(--ch-accent);
        stroke-width: 1.5;
      }
      .cross {
        fill: none;
        stroke: var(--ch-ink);
        stroke-width: 1.5;
        stroke-linecap: round;
      }
      .cross-casing {
        fill: none;
        stroke: var(--ch-surface);
        stroke-width: 4;
        stroke-linecap: round;
      }
      .dots circle {
        fill: color-mix(in srgb, var(--ch-ink) 50%, transparent);
      }
      .finish {
        position: absolute;
        left: 50%;
        bottom: 12px;
        transform: translateX(-50%);
        min-height: 32px;
        padding: 0 14px;
        border: 0;
        border-radius: 9999px;
        background: var(--ch-action);
        color: var(--text-primary-color, #fff);
        font: inherit;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        pointer-events: auto;
      }
      .finish:focus-visible {
        outline: 2px solid var(--ch-ink);
        outline-offset: 2px;
      }
      .drop {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--ch-accent) 10%, transparent);
        border: 2px dashed var(--ch-accent);
        border-radius: 12px;
        color: var(--ch-ink);
        font-size: 0.875rem;
        font-weight: 500;
        pointer-events: none;
      }
    `],xb([(0,s.MZ)({attribute:!1})],zb.prototype,"doc",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"selection",null),xb([(0,s.MZ)({type:Boolean,reflect:!0})],zb.prototype,"disabled",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"layerView",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"tile",void 0),xb([(0,s.MZ)({type:Number})],zb.prototype,"time",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"hass",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"library",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"stage",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"stageRect",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"subjectRect",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"iconRect",void 0),xb([(0,s.MZ)({attribute:!1})],zb.prototype,"pieces",void 0),xb([(0,s.MZ)({type:String})],zb.prototype,"viewBox",void 0),xb([(0,s.MZ)({type:Boolean})],zb.prototype,"preview",void 0),xb([(0,s.wk)()],zb.prototype,"_resolved",void 0),xb([(0,s.wk)()],zb.prototype,"_pen",void 0),xb([(0,s.wk)()],zb.prototype,"_snapAt",void 0),xb([(0,s.wk)()],zb.prototype,"_dropping",void 0),xb([(0,s.wk)()],zb.prototype,"_announce",void 0),xb([(0,s.wk)()],zb.prototype,"_cross",void 0),xb([(0,s.wk)()],zb.prototype,"_kb",void 0),zb=xb([(0,s.EM)("mc-anim-draw-host")],zb),_s({tag:"mc-anim-draw-host",place:"stage-tool",when:tb,title:266,order:40,dock:"canvas"});var qb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Eb=[{value:"round",label:750},{value:"butt",label:332},{value:"square",label:864}],Hb=[{value:"over",label:614,icon:"mdi:arrange-bring-forward"},{value:"under",label:1028,icon:"mdi:arrange-send-backward"}],Lb=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));let Vb=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._drawLoading=!1,this._refitting=!1}connectedCallback(){super.connectedCallback(),this._unsub=ob.subscribe(()=>this.requestUpdate())}willUpdate(){this._draw||this._drawLoading||(ob.lastFreehand||"freehand"===nb(this.selection))&&(this._drawLoading=!0,Zg().then(e=>{this._drawLoading=!1,e&&(this._draw=e.pathDraw)}))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.()}get _shape(){const e=ib(this.selection);return e?this.doc?.rig?.shapes?.find(t=>t.id===e):void 0}_emit(e,t,i=!1){e&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_patch(e,t,i){this.doc&&this._emit(Pa(this.doc,e.id,t),i)}_seg(e,t,i,s,r=""){return n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${e}</span></div>
      <div class="seg full ${r}" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.value===i),r={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in r))return;e.preventDefault();const a=t[(n+r[e.key]+t.length)%t.length].value,o=e.currentTarget;s(a),requestAnimationFrame(()=>o.querySelector(`[data-val="${a}"]`)?.focus())}}>
        ${t.map(e=>{const t=e.value===i;return n.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            ?disabled=${this.disabled}
            @click=${()=>t||s(e.value)}
          >
            ${e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}${In(e.label)}
          </button>`})}
      </div>
    </div>`}_switch(e,t,i,s,r,a=!1){return n.qy`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        ${t?n.qy`<p class="help">${t}</p>`:n.s6}
      </div>
      <button
        type="button"
        class="switch ${r}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||a}
        @click=${s}
      ></button>
    </div>`}_color(e,t,i,s){return n.qy`<mc-color-picker
      class=${s}
      allowEntity
      .label=${e}
      .value=${t}
      ?disabled=${this.disabled}
      @value-changed=${e=>{e.stopPropagation();const n=function(e){const t=e.trim();if(t)return/^entity( \d{1,3}%)?$/.test(t)?t:it(t,"color")}(String(e.detail.value??""));n&&n!==t&&i(n)}}
    ></mc-color-picker>`}_number(e,t,i,s,r,a){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        id=${e}
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max=${r}
        step=${s}
        .value=${String(i)}
        ?disabled=${this.disabled}
        @change=${e=>{const t=e.target,n=Number(t.value);if(""===t.value||!Number.isFinite(n))return void(t.value=String(i));const s=Math.min(r,Math.max(0,Math.round(100*n)/100));t.value=String(s),s!==i&&a(s)}}
      />
    </div>`}_paint(e,t){return n.qy`<section class="group" aria-labelledby="h-paint">
      <div class="group-head"><h3 id="h-paint">${In(618)}</h3></div>
      ${e.closed?n.qy`<div class="paint">
            ${this._switch(In(322),"",void 0!==e.fill,()=>t.fill(void 0!==e.fill?void 0:"currentColor"),"fill-on",void 0!==e.fill&&void 0===e.stroke)}
            ${void 0!==e.fill?this._color(In(323),e.fill,e=>t.fill(e),"fill-color"):n.s6}
          </div>`:n.s6}
      <div class="paint">
        ${this._switch(In(904),e.closed?"":In(58),void 0!==e.stroke,()=>t.stroke(void 0!==e.stroke?void 0:"currentColor"),"stroke-on",!e.closed||void 0!==e.stroke&&void 0===e.fill)}
        ${void 0!==e.stroke?n.qy`${this._color(In(905),e.stroke,e=>t.stroke(e),"stroke-color")}
              <div class="two">
                ${this._number("f-width",In(906),e.width,.25,100,t.width)}
              </div>
              ${this._seg(In(420),Eb,e.cap,t.cap,"caps")}`:n.s6}
      </div>
    </section>`}_smoothing(e,t,i=!1){const s=ob.options.tolerance;return n.qy`<div class="field">
      <div class="field-head"><label for="f-tol">${In(835)}</label><span class="val">${s.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">${In(238)}</span>
        <input
          id="f-tol"
          type="range"
          min=${.05}
          max=${2}
          step=${.05}
          .value=${String(s)}
          aria-valuetext=${In(1251,{size:s.toFixed(2)})}
          ?disabled=${this.disabled||i}
          @input=${t=>e(Number(t.target.value),!1)}
          @change=${t=>e(Number(t.target.value),!0)}
        />
        <span aria-hidden="true">${In(833)}</span>
      </div>
      <p class="help">${t}</p>
    </div>`}_refit(e,t){ob.set({tolerance:e});const i=ob.lastFreehand,n=i&&this.doc?.rig?.shapes?.find(e=>e.id===i.id);if(!n||!this.doc)return;const s=this._draw?.fitFreehand(i.raw,e);if(s&&s.d){if(!t){if(s.d===n.d)return;return this._refitting=!0,void this._emit(Pa(this.doc,n.id,{d:s.d}),"Smooth stroke",!0)}(s.d!==n.d||this._refitting)&&this._emit(Pa(this.doc,n.id,{d:s.d}),"Smooth stroke"),this._refitting=!1}}_renderShape(e){const t=this.doc,i=`shape:${e.id}`,s=/[Zz]\s*$/.test(e.d)||Ma(e),r=t.rig?.shapes??[],a=r.findIndex(t=>t.id===e.id),o=t.tracks?.find(e=>e.target===i),l=ob.lastFreehand?.id===e.id;return n.qy`
      <section class="group" aria-labelledby="h-shape">
        <div class="group-head"><h3 id="h-shape">${In(806)}</h3><span class="id" title=${In(913)}>${i}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">${In(532)}</label></div>
          <input
            id="f-name"
            class="input"
            .value=${e.name}
            maxlength="80"
            ?disabled=${this.disabled}
            @change=${t=>{const i=t.target,n=i.value.trim();n?n!==e.name&&this._patch(e,{name:n},"Rename shape"):i.value=e.name}}
          />
        </div>
        ${this._seg(In(404),Hb,e.layer,t=>this._patch(e,{layer:t},In("under"===t?810:808)),"layer")}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled||a>=r.length-1} @click=${()=>this._emit(Ra(t,e.id,a+1),"Bring shape forward")}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>${In(103)}
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled||a<=0} @click=${()=>this._emit(Ra(t,e.id,a-1),"Send shape backward")}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>${In(785)}
          </button>
        </div>
      </section>
      ${this._paint({fill:Ma(e)?e.fill??"currentColor":void 0,stroke:Sa(e)?e.stroke:void 0,width:e.stroke_width??1,cap:e.linecap??"butt",closed:s},{fill:t=>this._patch(e,{fill:t},In(t?130:712)),stroke:t=>this._patch(e,t?{stroke:t,stroke_width:e.stroke_width??1}:{stroke:void 0,stroke_width:void 0,linecap:void 0},In(t?134:718)),width:t=>this._patch(e,{stroke_width:Lb(t)},"Change stroke width"),cap:t=>this._patch(e,{linecap:t},"Change line ends")})}
      ${l?n.qy`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">${In(344)}</h3></div>
            ${this._smoothing((e,t)=>this._refit(e,t),In(450),!this._draw)}
          </section>`:n.s6}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">${In(65)}</h3></div>
        ${this._switch(In(262),Ma(e)?In(958):In(952),Ia(t,i),()=>Ia(t,i)?this._emit(function(e,t){const i=Ta(e,t);if(!i)return e;const n=i.keyframes.map(e=>{const t={...e};return delete t.draw,t}).filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e)),s={...i,keyframes:n};return Fa(e,n.length||s.path?s:void 0,t)??e}(t,i),"Remove draw on"):this._emit(function(e,t){const i=Ta(e,t),n=(i?.keyframes??[]).map(e=>({...e}));for(const[e,t]of[[0,0],[100,1]]){const i=n.find(t=>t.at===e);i?i.draw=t:n.push({at:e,draw:t})}return n.sort((e,t)=>e.at-t.at),Fa(e,{...i??{target:t},target:t,keyframes:n},t)}(t,i),"Draw on"),"draw-on")}
        <div class="field">
          <div class="field-head"><span class="lbl">${In(452)}</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${()=>this._select({kind:"tool",tool:"motion",target:i})}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${In(o?.path?701:260)}
            </button>
            ${o?.path?n.qy`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${()=>this._emit(Ba(t,i,void 0,!1),"Remove motion path")}>
                  ${In(706)}
                </button>`:n.s6}
          </div>
          ${o?.path?this._switch(In(341),In(976),!!o.path.follow_rotation,()=>{const e=(t.tracks??[]).map(e=>e===o?{...e,path:{...e.path,follow_rotation:!e.path.follow_rotation}}:e);this._emit({...t,tracks:e},"Follow the path")},"follow"):n.qy`<p class="help">${In(263)}</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${()=>{this._emit(Na(t,e.id),"Delete shape"),this._select({kind:"tool",tool:"select"})}}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${In(230)}
        </button>
      </section>
    `}_opt(e){ob.set(e)}_renderTool(e){const t=ob.options,i=sb[e],s="pen"===e||"line"===e||"rect"===e||"ellipse"===e||"freehand"===e,r="rect"===e||"ellipse"===e||"pen"===e,a=this.selection.target;return n.qy`
      <section class="group" aria-labelledby="h-tool">
        <div class="group-head tool-head"><ha-icon icon=${i.icon}></ha-icon><h3 id="h-tool">${In(i.label)}</h3></div>
        <p class="help lead">${In(i.hint)}</p>
        ${"motion"===e?eb(a)?n.qy`<p class="help">${Bn(500,{target:n.qy`<span class="id">${a}</span>`})}</p>
                ${this._switch(In(341),In(392),t.follow,()=>this._opt({follow:!t.follow}),"follow-opt")}`:n.qy`<p class="help">${In(781)}</p>`:n.s6}
        ${"rect"===e?this._number("f-radius",In(191),t.radius,.5,12,e=>this._opt({radius:e})):n.s6}
        ${"freehand"===e||"motion"===e?this._smoothing((t,i)=>"freehand"===e?this._refit(t,i):this._opt({tolerance:t}),"freehand"===e&&ob.lastFreehand?In(136):In(449),"freehand"===e&&!this._draw):n.s6}
      </section>
      ${s?n.qy`${this._paint({fill:r&&t.fill||void 0,stroke:t.stroke||(r?void 0:"currentColor"),width:t.strokeWidth,cap:t.linecap,closed:r},{fill:e=>this._opt({fill:e??""}),stroke:e=>this._opt({stroke:e??""}),width:e=>this._opt({strokeWidth:Lb(e)}),cap:e=>this._opt({linecap:e})})}
            <section class="group" aria-labelledby="h-new">
              <div class="group-head"><h3 id="h-new">${In(543)}</h3></div>
              ${this._seg(In(404),Hb,t.layer,e=>this._opt({layer:e}),"layer")}
            </section>`:n.s6}
      ${"erase"!==e&&"select"!==e?n.qy`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">${In(839)}</h3></div>
            ${this._switch(In(356),In(679),t.grid,()=>this._opt({grid:!t.grid}),"snap-grid")}
            ${this._switch(In(59),In(678),t.anchors,()=>this._opt({anchors:!t.anchors}),"snap-anchors")}
          </section>`:n.s6}
    `}render(){if(!this.doc)return n.qy``;const e=this._shape;return e?this._renderShape(e):"tool"===this.selection.kind&&Xv(this.selection.tool)?this._renderTool(nb(this.selection)):n.qy``}};Vb.styles=[Ip,n.AH`
      :host {
        display: block;
      }
      .id {
        font: 0.75rem/1.5 'Roboto Mono', ui-monospace, SFMono-Regular, Consolas, monospace;
        color: var(--secondary-text-color, #5f6368);
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .slider {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 8px;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        min-height: 32px;
      }
      .slider input[type='range'] {
        width: 100%;
        margin: 0;
        accent-color: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        font-variant-numeric: tabular-nums;
      }
      .paint {
        display: grid;
        gap: 8px;
      }
      .danger-text {
        color: color-mix(in srgb, var(--error-color, #db4437) 80%, var(--primary-text-color, #212121));
      }
      .tool-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tool-head ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color, #5f6368);
      }
    `],qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"doc",void 0),qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"selection",void 0),qb([(0,s.MZ)({type:Boolean})],Vb.prototype,"disabled",void 0),qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"hass",void 0),qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"library",void 0),qb([(0,s.MZ)({type:Number})],Vb.prototype,"time",void 0),qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"tile",void 0),qb([(0,s.MZ)({attribute:!1})],Vb.prototype,"stage",void 0),qb([(0,s.wk)()],Vb.prototype,"_draw",void 0),Vb=qb([(0,s.EM)("mc-anim-shape-inspector")],Vb),_s({tag:"mc-anim-shape-inspector",place:"inspector",when:function(e,t){return"keyframes"===e.kind&&("tool"===t.kind?Xv(t.tool):"target"===t.kind&&Qv(t.target)&&!!e.rig?.shapes?.some(e=>`shape:${e.id}`===t.target))},title:266,order:30});var Ob=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Pb=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))},Rb=["select","pen","line","rect","ellipse","freehand","erase","motion"];let Db=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._key=""}connectedCallback(){super.connectedCallback(),this._offHint=ob.onHint(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._offHint?.()}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc&&!this.pieces){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._key&&(this._key=e,hb(this.doc,this.tile).then(t=>{this._key===e&&(this._resolved=t)}))}}get _dialog(){return this.renderRoot.querySelector("mc-anim-svg-dialog")}openExport(e=!1){this._dialog?.openExport(e)}openImport(e="",t=""){this._dialog?.openImport(e,t)}_choose(e){const t=this.selection;if((this.doc&&tb(this.doc,t)?nb(t):void 0)===e&&"tool"===t.kind)return void Pb(this,{kind:"none"});const i=eb(t.target)?t.target:void 0;Pb(this,{kind:"tool",tool:e,...i?{target:i}:{}})}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return n.qy``;const t=tb(e,this.selection),i=t?nb(this.selection):void 0,s=t?ob.hint:"",r=this.pieces??this._resolved?.pieces??[],a=n.qy`<mc-anim-svg-dialog
      .doc=${e}
      .pieces=${r}
      .viewBox=${pb(this.doc?.rig,this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;if(!t)return n.qy`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${()=>this._choose("select")}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>${In(258)}
        </button>
        ${a}`;const o=eb(this.selection.target);return n.qy`<div class="bar" role="toolbar" aria-label=${In(268)}>
        ${Rb.map(e=>{const t=sb[e],s=this.disabled||"motion"===e&&!o;return n.qy`<button
            type="button"
            class="icon-btn tool"
            data-tool=${e}
            aria-pressed=${i===e?"true":"false"}
            aria-label=${In(t.label)}
            title=${In("motion"!==e||o?t.label:454)}
            ?disabled=${s}
            @click=${()=>this._choose(e)}
          >
            <ha-icon icon=${t.icon}></ha-icon>
          </button>`})}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label=${In(382)} title=${In(382)} ?disabled=${this.disabled} @click=${()=>this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label=${In(762)} title=${In(762)} ?disabled=${this.disabled} @click=${()=>this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label=${In(900)} title=${In(900)} @click=${()=>Pb(this,{kind:"none"})}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${s?n.qy`<p class="hint">${s}</p>`:n.s6}
      ${a}`}};Db.styles=[Ip,n.AH`
      :host {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        pointer-events: none;
      }
      /* what to do next with the tool (the overlay's hint), under the bar and off the card */
      .hint {
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 4px 12px;
        border-radius: 9999px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        font-size: 0.75rem;
        font-weight: 500;
        text-align: center;
      }
      .bar {
        pointer-events: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 2px;
        padding: 3px;
        border-radius: 10px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .bar .icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 7px;
      }
      .bar .icon-btn[aria-pressed='true'] {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
        color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, var(--primary-text-color, #212121));
      }
      .sep {
        width: 1px;
        align-self: stretch;
        margin: 4px 3px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      /* the dialog's window sits under this host, so it takes presses itself instead of passing them to the canvas */
      mc-anim-svg-dialog {
        pointer-events: auto;
      }
      .open {
        pointer-events: auto;
        height: 36px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
    `],Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"doc",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"selection",void 0),Ob([(0,s.MZ)({type:Boolean})],Db.prototype,"disabled",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"tile",void 0),Ob([(0,s.MZ)({type:Number})],Db.prototype,"time",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"hass",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"library",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"stage",void 0),Ob([(0,s.MZ)({attribute:!1})],Db.prototype,"pieces",void 0),Ob([(0,s.wk)()],Db.prototype,"_resolved",void 0),Db=Ob([(0,s.EM)("mc-anim-draw-toolbar")],Db),_s({tag:"mc-anim-draw-toolbar",place:"stage-tool",when:e=>"keyframes"===e.kind,title:258,order:90,dock:"top"});var Nb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Tb=[{target:"element",label:292,icon:"mdi:square-rounded-outline"},{target:"icon",label:371,icon:"mdi:star-outline"},{target:"name",label:532,icon:"mdi:format-title"},{target:"state",label:878,icon:"mdi:numeric"},{target:"background",label:80,icon:"mdi:rectangle-outline"}];function Fb(e,t){return!!e.tracks?.some(e=>e.target===t&&(e.keyframes.length>0||!!e.path))||("element"===t||"icon"===t)&&(e.target??"element")===t&&(e.keyframes?.length??0)>0}const Ib=Wn;let Bb=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=ys,this.tile="icon",this.density="full",this._list=new wf(this,{select:e=>e.startsWith("lane:")?!this.disabled&&Cf(this,this.doc,e):this._select(e.slice(7)),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Sf(e):(e=>{const t=Tb.find(t=>t.target===e)?.label;return void 0===t?void 0:In(t)})(e.slice(7))??e})}_select(e){if(this.disabled)return;const t={kind:"target",target:e};this.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}_row(e,t,i){const n=this.doc,s=Fb(n,e.target)?(e.target===n.target&&"keyframes"===n.kind?n.keyframes?.length??0:0)+(n.tracks?.find(t=>t.target===e.target)?.keyframes.length??0):0,r=`target:${e.target}`,a=jf(n,this.layerView??Ka,e.target,r),o=this._list.row({key:r,expanded:a,name:In(e.label),icon:e.icon,note:t?void 0:In(580),badge:s?In(1160,{count:s}):void 0,describe:[Fb(n,e.target)?In(1089):"",t?"":In(1120,{tile:In(Yn(this.tile).label)})].filter(Boolean).join(", "),selected:i===e.target&&!(a&&"keys"===this.selection.kind),toggles:"element"===e.target?["lock"]:void 0,title:t?In(e.label):In(1198,{label:In(e.label),tile:In(Yn(this.tile).label)})});return a?[o,...Af(this._list,n,this.selection,e.target,2)]:[o]}render(){const e=this.doc;if(!e)return n.s6;const t=Yn(this.tile),i=(s=this.selection,"target"===s?.kind||"keys"===s?.kind?s.target??s.keys?.[0]?.target:void 0);var s;const r=e=>t.targets.includes(e),a=Tb.filter(t=>r(t.target)||Fb(e,t.target)||i===t.target),o=Tb.filter(e=>!r(e.target));return n.qy`
      <ul aria-label=${In(123)}>
        ${a.map(e=>this._row(e,r(e.target),i))}
      </ul>
      ${o.length?n.qy`<p class="hint">
            ${In(1181,{count:o.length,names:Ib(o.map(e=>In(e.label))),tile:In(t.label)})}
          </p>`:n.s6}
    `}};Bb.styles=[Ip,kf,n.AH`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .hint {
        margin: 8px 10px 0;
        font-size: 0.75rem;
        line-height: 1.4;
        color: var(--mc-text-2);
      }
    `],Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"doc",void 0),Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"hass",void 0),Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"library",void 0),Nb([(0,s.MZ)({type:Number})],Bb.prototype,"time",void 0),Nb([(0,s.MZ)({type:Boolean})],Bb.prototype,"disabled",void 0),Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"selection",void 0),Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"tile",void 0),Nb([(0,s.MZ)({attribute:!1})],Bb.prototype,"layerView",void 0),Nb([(0,s.MZ)()],Bb.prototype,"density",void 0),Bb=Nb([(0,s.EM)("mc-anim-targets-layers")],Bb),_s({tag:"mc-anim-targets-layers",place:"layers",when:e=>"keyframes"===e.kind,title:123,order:40});var Zb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Kb=["lock"],Wb=["hide","lock"],Ub=[];let Gb=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this.emitter=0,this.all=!1,this._open=new Map,this._list=new wf(this,{select:e=>this._pick(e),move:(e,t)=>this._move(e,t),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&/^emitter:/.test(e)&&this._multi&&!this._list.refuseLocked(e,this._nameOfKey(e))&&(this._renaming=e),open:(e,t)=>this._open=new Map(this._open).set(e,t),nameOf:e=>this._nameOfKey(e)})}get _multi(){return!!this.doc&&am(this.doc)>1}_ems(e){const t=e.particles?.sim?Ua(e):["main"];return Array.from({length:am(e)},(i,n)=>({i:n,id:t[n]??`e${n+1}`,name:bm(e,0,n),side:gm(e,n)}))}_nameOfKey(e){const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this.doc?this._ems(this.doc).find(e=>e.id===t):void 0;return e.startsWith("children:")?In(139,{name:i?.name??t}):i?.name??t}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("emitter-change",{bubbles:!0,composed:!0,detail:{index:e,all:!1}}))}_pick(e){if(this.disabled||!this.doc)return;const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this._ems(this.doc).find(e=>e.id===t);i&&(this._sub=e.startsWith("emitter:")?void 0:e,this._select(i.i))}_side(e,t){return e.filter(e=>e.side===t).reverse()}_move(e,t){const i=this.doc;if(!i||this.disabled)return;const n=this._ems(i),s=n.find(t=>`emitter:${t.id}`===e);if(!s)return;const r=this._side(n,s.side),a=r.indexOf(s),o=n[Math.max(0,Math.min(n.length-1,this.emitter))]?.id;let l,c,d;if("up"===t?"back"===s.side&&0===a:"front"===s.side&&a===r.length-1){const e="back"===s.side?"front":"back";l=function(e,t,i,n){if(!um(e,i)||gm(e,i)===n)return{doc:e,index:i};if(1===am(e))return{doc:gu(e,{layer:n}),index:0};const s=pm(e,0),[r]=s.splice(i,1);r.layer=n;let a=Math.min(i,s.length);if("front"===n){const e=s.findIndex(e=>"front"===e.layer);e>=0&&(a=e)}else{const e=s.map(e=>e.layer).lastIndexOf("back");e>=0&&(a=e+1)}return s.splice(a,0,r),{doc:hm(e,0,s),index:a}}(i,0,s.i,e).doc,c=In("front"===e?464:462),d=In("front"===e?1225:1224,{name:s.name})}else{const e=r["up"===t?a-1:a+1];if(!e)return;l=function(e,t,i,n){if(!um(e,i)||!um(e,n)||i===n)return e;const s=pm(e,0);return s.splice(n,0,s.splice(i,1)[0]),hm(e,0,s)}(i,0,s.i,e.i),c=In("up"===t?465:463),d=In(1227,{name:s.name,direction:In("up"===t?1144:1097),position:"up"===t?a:a+2,count:r.length})}if(l===i)return;this._emit(l,c),this._list.announce(d);const p=Ua(l).indexOf(o??"");p>=0&&p!==this.emitter&&l.particles?.sim&&this._select(p)}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc,n=i?this._ems(i).find(t=>`emitter:${t.id}`===e):void 0;if(!i||!n||this._list.refuseLocked(e,n.name))return;const s=mm(i,0,n.i,t);s!==i&&this._emit(s,"Rename emitter")}_moveInfo(e,t,i){const n=i.indexOf(e),s="up"===t?"back"===e.side&&0===n:"front"===e.side&&n===i.length-1,r="up"===t?0===n:n===i.length-1,a=!this.disabled&&(s||!r);if(s){const i=In("up"===t?1107:1092);return{ok:a,label:In(489,{name:e.name,where:i}),menu:In(490,{where:i})}}return"up"===t?{ok:a,label:In(487,{name:e.name}),menu:In(480)}:{ok:a,label:In(484,{name:e.name}),menu:In(459)}}_focusRow(e){this._list.focusKey(e)}_renameField(e,t){return n.qy`<input
      class="input rename"
      aria-label=${In(407)}
      maxlength=${40}
      .value=${e.name}
      @click=${e=>e.stopPropagation()}
      @keydown=${e=>{e.stopPropagation(),"Enter"===e.key?(this._rename(t,e.target.value),this._focusRow(t)):"Escape"===e.key&&(this._renaming=void 0,this._focusRow(t))}}
      @blur=${e=>this._rename(t,e.target.value)}
    />`}_rowsOf(e,t,i,n){const s=`emitter:${t.id}`,r=Ru(e,0),a=0===t.i?r:r.emitters[t.i-1],o=0===t.i?r.children:r.emitters[t.i-1].children,l=!this.all&&Math.min(this.emitter,i.length-1)===t.i,c=this._open.get(s)??(1===i.length||l),d=this._side(i,t.side),p=[this._list.row({key:s,name:t.name,icon:"mdi:shimmer",selected:l&&!this._sub,expanded:c,toggles:n,up:this._moveInfo(t,"up",d),down:this._moveInfo(t,"down",d),renamable:this._multi,renaming:this._renaming===s?this._renameField(t,s):void 0,describe:"front"===t.side?In(1107):In(1092),title:"front"===t.side?In(1235,{name:t.name}):In(1234,{name:t.name})})];if(!c)return p;o&&p.push(this._list.row({key:`children:${t.id}`,name:In(138),icon:"mdi:dots-hexagon",level:2,selected:this._sub===`children:${t.id}`,toggles:n}));const h=(e,t,i)=>{Iu({shapes:e}).forEach((e,n)=>{const s=`pshape:${t}|${n}`;p.push(this._list.row({key:s,name:`${i} ${n+1}: ${ju(e.shape)}`,icon:"mdi:shape-outline",level:2,selected:this._sub===s,toggles:Ub}))})};return h(a.shapes,t.id,In(806)),o&&h(o.shapes,`${t.id}/c`,In(140)),p}updated(e){if((e.has("emitter")&&void 0!==e.get("emitter")||e.has("all")&&void 0!==e.get("all"))&&this.doc&&!this.all){const e=this._ems(this.doc)[Math.min(this.emitter,am(this.doc)-1)]?.id;this.renderRoot.querySelector(`[data-lk="emitter:${e}"]`)?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.doc;if(!e||"particles"!==e.kind)return n.s6;const t=this._ems(e),i=!!e.particles?.sim,s=i&&!!ld(e),r=i?s?void 0:Kb:Wb,a=this._side(t,"front"),o=this._side(t,"back");return n.qy`<ul aria-label=${In(627)}>
        ${a.flatMap(i=>this._rowsOf(e,i,t,r))}
        <li class="lcontent" title=${In(122)}>
          <ha-icon icon="mdi:card-text-outline" aria-hidden="true"></ha-icon><span>${In(121)}</span><span class="sr">${In(6)}</span>
        </li>
        ${o.flatMap(i=>this._rowsOf(e,i,t,r))}
      </ul>
      ${i&&!s?n.qy`<p class="note">${In(362)}</p>`:n.s6}`}};Gb.styles=[Ip,kf,n.AH`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .lcontent {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
        padding: 2px 8px;
        border-top: 1px dashed var(--mc-divider);
        border-bottom: 1px dashed var(--mc-divider);
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .lcontent ha-icon {
        flex: none;
      }
      .sr {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      .note {
        margin: 6px 8px 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
    `],Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"doc",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"selection",void 0),Zb([(0,s.MZ)({type:Boolean})],Gb.prototype,"disabled",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"hass",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"library",void 0),Zb([(0,s.MZ)({type:Number})],Gb.prototype,"time",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"tile",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"stage",void 0),Zb([(0,s.MZ)({attribute:!1})],Gb.prototype,"layerView",void 0),Zb([(0,s.MZ)()],Gb.prototype,"density",void 0),Zb([(0,s.MZ)({type:Number})],Gb.prototype,"emitter",void 0),Zb([(0,s.MZ)({type:Boolean})],Gb.prototype,"all",void 0),Zb([(0,s.wk)()],Gb.prototype,"_open",void 0),Zb([(0,s.wk)()],Gb.prototype,"_renaming",void 0),Zb([(0,s.wk)()],Gb.prototype,"_sub",void 0),Gb=Zb([(0,s.EM)("mc-anim-particles-layers")],Gb),_s({tag:"mc-anim-particles-layers",place:"layers",when:e=>"particles"===e.kind,title:627,order:10});var Yb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Jb={element:292,icon:371,particles:630};let Xb=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._sel="path",this._list=new wf(this,{select:e=>this._sel=e,nameOf:e=>"path"===e?In(452):In(496,{subject:this._subject()})})}_subject(){const e=Jb[this.doc?.path?.subject??"element"]??Jb.element;return In(e)}render(){const e=this.doc;return e&&"path"===e.kind?e.path?.d.trim()?n.qy`<ul aria-label=${In(644)}>
      ${this._list.row({key:"path",name:In(452),icon:"mdi:vector-curve",selected:"path"===this._sel})}
      ${this._list.row({key:"subject",name:In(496,{subject:this._subject()}),icon:"mdi:arrow-right-bold-outline",selected:"subject"===this._sel})}
    </ul>`:n.qy`<p class="empty-note">${In(558)}</p>`:n.s6}};Xb.styles=[Ip,kf,n.AH`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .empty-note {
        margin: 0;
        padding: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
    `],Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"doc",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"selection",void 0),Yb([(0,s.MZ)({type:Boolean})],Xb.prototype,"disabled",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"hass",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"library",void 0),Yb([(0,s.MZ)({type:Number})],Xb.prototype,"time",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"tile",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"stage",void 0),Yb([(0,s.MZ)({attribute:!1})],Xb.prototype,"layerView",void 0),Yb([(0,s.MZ)()],Xb.prototype,"density",void 0),Yb([(0,s.wk)()],Xb.prototype,"_sel",void 0),Xb=Yb([(0,s.EM)("mc-anim-path-layers")],Xb),_s({tag:"mc-anim-path-layers",place:"layers",when:e=>"path"===e.kind,title:643,order:10});var Qb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let ey=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new wf(this,{select:e=>this._sel=e,move:(e,t)=>this._move(Number(e.slice(5)),t),nameOf:e=>this._name(Number(e.slice(5)))})}_name(e){const t=this.doc?.steps?.[e];return t?of(t.animation,this.library,this.doc?.id).name:In(896,{i:e+1})}_move(e,t){const i=this.doc,n=i?.steps??[],s="up"===t?e-1:e+1;if(!i||this.disabled||s<0||s>=n.length)return;const r=this._name(e);let a;try{a=this.renderRoot.activeElement?.getAttribute("data-ctl")??void 0}catch{a=void 0}this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:{...i,steps:lf(n,e,s)},label:In(475)}})),this._list.announce(In(1220,{name:r,to:s+1,count:n.length}),lo(this.layerView??{hidden:[],solo:[],locked:[],open:[]},e,s)),this._sel===`step:${e}`&&(this._sel=`step:${s}`),queueMicrotask(()=>this._list.focusKey(`step:${s}`,a))}render(){const e=this.doc;if(!e||"sequence"!==e.kind)return n.s6;const t=e.steps??[];return t.length?n.qy`<ol aria-label=${In(794)}>
      ${t.map((i,s)=>{const r=of(i.animation,this.library,e.id),a="ok"===r.status?i.duration??r.defaultDuration:void 0,o=`step:${s}`,l=r.name;return this._list.row({key:o,name:l,thumb:n.qy`<span class="num" aria-hidden="true">${s+1}</span>`,note:r.problem,badge:void 0!==a?cf(a):void 0,describe:r.problem?In(1134,{i:s+1,count:t.length,problem:r.problem}):In(1133,{i:s+1,count:t.length}),selected:this._sel===o,up:{ok:!this.disabled&&s>0,label:In(488,{name:l}),menu:In(481)},down:{ok:!this.disabled&&s<t.length-1,label:In(486,{name:l}),menu:In(461)}})})}
    </ol>`:n.qy`<p class="empty-note">${In(563)}</p>`}};ey.styles=[Ip,kf,n.AH`
      :host {
        display: block;
        color: var(--mc-text);
        font-size: 0.875rem;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 2px;
      }
      .num {
        flex: none;
        display: grid;
        place-items: center;
        min-width: 22px;
        height: 22px;
        border-radius: 9999px;
        border: 1px solid var(--mc-divider);
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
      }
      .lr.is-hidden .num {
        text-decoration: line-through;
        opacity: 0.6;
      }
      .empty-note {
        margin: 0;
        padding: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
    `],Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"doc",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"selection",void 0),Qb([(0,s.MZ)({type:Boolean})],ey.prototype,"disabled",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"hass",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"library",void 0),Qb([(0,s.MZ)({type:Number})],ey.prototype,"time",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"tile",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"stage",void 0),Qb([(0,s.MZ)({attribute:!1})],ey.prototype,"layerView",void 0),Qb([(0,s.MZ)()],ey.prototype,"density",void 0),Qb([(0,s.wk)()],ey.prototype,"_sel",void 0),ey=Qb([(0,s.EM)("mc-anim-steps-layers")],ey),_s({tag:"mc-anim-steps-layers",place:"layers",when:e=>"sequence"===e.kind,title:793,order:10});const ty=[{id:"state",label:879},{id:"state_not",label:880},{id:"entity_on",label:305},{id:"entity_off",label:304},{id:"above",label:1061},{id:"below",label:1063}],iy=[{id:"cut",label:211,hint:911},{id:"crossfade",label:196,hint:317},{id:"finish",label:326,hint:413}];function ny(e,t){const i=Number(t),n=""!==t.trim()&&Number.isFinite(i)?i:0,s=t.trim()||"on";switch(e){case"state":return{state:s};case"state_not":return{state_not:s};case"entity_on":return{entity_on:!0};case"entity_off":return{entity_on:!1};case"above":return{above:n};case"below":return{below:n}}}function sy(e){return e&&"object"==typeof e?(e instanceof Map?[...e.values()]:Array.isArray(e)?e:Object.values(e)).filter(e=>!!e&&"object"==typeof e&&"string"==typeof e.id):[]}const ry=e=>(e?.length??0)<12;var ay=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let oy=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=ys,this._announce=""}get _clips(){return Array.isArray(this.doc?.clips)?this.doc.clips:[]}_write(e,t){if(!this.doc)return;const i={...this.doc};e.length?i.clips=e:delete i.clips,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_patch(e,t,i){this._write(this._clips.map((i,n)=>n===e?{...i,...t}:i),i)}_add(){if(!ry(this._clips))return;const e=function(e){const t=new Set(e.map(e=>"state"in e.when?e.when.state:""));if(t.has("on")&&t.has("off"))return{when:{above:50},animation:"self",transition:"crossfade"};const i=t.has("on")?"off":"on";return{when:{state:i},animation:"off"===i?"none":"self",transition:"crossfade"}}(this._clips);this._write([...this._clips,e],"Add state"),this._focusAfter=`.clip[data-i="${this._clips.length}"] select.when`,this._announce=In(884,{count:this._clips.length+1,when:Rd(e.when)})}_remove(e){const t=this._clips.filter((t,i)=>i!==e);this._write(t,"Delete state"),this._focusAfter=t.length?`.clip[data-i="${Math.min(e,t.length-1)}"] .del`:".add",this._announce=In(886,{i:e+1})}_move(e,t){t<0||t>=this._clips.length||(this._write(function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return[...e];const n=[...e],[s]=n.splice(t,1);return n.splice(i,0,s),n}(this._clips,e,t),"Reorder states"),this._focusAfter=`.clip[data-i="${t}"] .${t<e?"up":"down"}`,this._announce=In(883,{to:t+1}))}updated(){const e=this._focusAfter;if(!e)return;this._focusAfter=void 0;const t=this.renderRoot.querySelector(e);(t&&!t.disabled?t:this.renderRoot.querySelector(".add"))?.focus()}_when(e,t){const i="state"in(s=e.when)?"state":"state_not"in s?"state_not":"entity_on"in s?s.entity_on?"entity_on":"entity_off":"above"in s?"above":"below";var s;const r=function(e){return"state"in e?e.state:"state_not"in e?e.state_not:"above"in e?String(e.above):"below"in e?String(e.below):""}(e.when),a=`st-${t}`,o="above"===i||"below"===i;return n.qy`<div class="pair">
      <div class="field">
        <div class="field-head"><label for="${a}-k">${In(1074)}</label></div>
        <div class="select">
          <select
            class="input when"
            id="${a}-k"
            ?disabled=${this.disabled}
            @change=${e=>this._patch(t,{when:ny(e.target.value,r)},"Change state condition")}
          >
            ${ty.map(e=>n.qy`<option value=${e.id} ?selected=${e.id===i}>${In(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
      ${"entity_on"===i||"entity_off"===i?n.qy`<div class="field"><div class="field-head"><span class="lbl">${In(1060)}</span></div><p class="help fill">${In(597)}</p></div>`:n.qy`<div class="field">
            <div class="field-head"><label for="${a}-v">${In(o?593:878)}</label></div>
            <input
              class="input ${o?"":"mono"}"
              id="${a}-v"
              type=${o?"number":"text"}
              step="any"
              inputmode=${o?"decimal":"text"}
              placeholder=${o?"0":In(1122)}
              autocomplete="off"
              spellcheck="false"
              ?disabled=${this.disabled}
              .value=${r}
              @change=${e=>{const n=e.target.value;!o||""!==n.trim()&&Number.isFinite(Number(n))?this._patch(t,{when:ny(i,n)},"Change state value"):e.target.value=r}}
            />
          </div>`}
    </div>`}_play(e,t){const i=`st-${t}-a`,s=function(e,t){const i=[{label:In(986),items:[{value:"self",label:In(617)},{value:"none",label:In(587)}]}],n=sy(e).filter(e=>((e,t)=>!!e&&e.id!==t&&rf(e)&&!(Array.isArray(e.clips)&&e.clips.length>0))(e,t)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).map(e=>({value:Be+e.id,label:e.name||e.id}));n.length&&i.push({label:In(531),items:n});for(const e of X){const t=J.filter(t=>t.group===e&&lt.has(t.id)).map(e=>({value:e.id,label:(0,T.t)(e.name)}));t.length&&i.push({label:(0,T.t)(Q[e]),items:t})}return i}(this.library,this.doc?.id),r=s.some(t=>t.items.some(t=>t.value===e.animation));return n.qy`<div class="field">
      <div class="field-head"><label for=${i}>${In(662)}</label></div>
      <div class="select">
        <select class="input play" id=${i} ?disabled=${this.disabled} @change=${e=>this._patch(t,{animation:e.target.value},"Change state animation")}>
          ${r?n.s6:n.qy`<option value=${e.animation} selected>${function(e,t,i){if("self"===e)return In(617);if("none"===e)return In(586);if(Ze(e)){const n=Ke(e),s=sy(t).find(e=>e.id===n);return s?s.name||s.id:n===i?In(617):In(1187,{id:n})}const n=te(e)?.name;return void 0!==n?(0,T.t)(n):In(1147,{animation:e})}(e.animation,this.library,this.doc?.id)}</option>`}
          ${s.map(t=>n.qy`<optgroup label=${t.label}>
              ${t.items.map(t=>n.qy`<option value=${t.value} ?selected=${t.value===e.animation}>${t.label}</option>`)}
            </optgroup>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_transition(e,t){const i=e.transition??"cut",s=e=>{e!==i&&this._patch(t,{transition:e},"Change state transition")},r=(iy.find(e=>e.id===i)??iy[0]).hint;return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="st-${t}-t">${In(1013)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="st-${t}-t" aria-describedby="st-${t}-th" @keydown=${e=>{const n=iy.findIndex(e=>e.id===i),r={ArrowRight:(n+1)%iy.length,ArrowLeft:(n-1+iy.length)%iy.length,Home:0,End:iy.length-1}[e.key];void 0!==r&&(e.preventDefault(),s(iy[r].id),this._focusAfter=`.clip[data-i="${t}"] .seg [aria-checked="true"]`)}}>
        ${iy.map(e=>{const t=e.id===i;return n.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>s(e.id)}>
            ${In(e.label)}
          </button>`})}
      </div>
      <p class="help" id="st-${t}-th">${In(r)}.</p>
    </div>`}_clip(e,t,i){const s=function(e,t,i){if(!Ze(e.animation)){if("self"===e.animation||"none"===e.animation)return;return te(e.animation)?lt.has(e.animation)?void 0:In(290):In(1035)}const n=Ke(e.animation);if(n===i)return In(1044);const s=sy(t).find(e=>e.id===n);return s?Array.isArray(s.clips)&&s.clips.length?In(916):rf(s)?void 0:In(625):In(579)}(e,this.library,this.doc?.id);return n.qy`<li class="cond clip" data-i=${t}>
      <div class="cond-head">
        <span class="n">${In(885,{i:t+1})} <span class="sub">· ${Rd(e.when)}</span></span>
        <button type="button" class="icon-btn sm up" aria-label=${In(474,{i:t+1})} title=${In(479)} ?disabled=${this.disabled||0===t} @click=${()=>this._move(t,t-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm down" aria-label=${In(473,{i:t+1})} title=${In(459)} ?disabled=${this.disabled||t===i-1} @click=${()=>this._move(t,t+1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm danger del" aria-label=${In(232,{i:t+1})} title=${In(231)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${s?n.qy`<p class="help error">${s}</p>`:n.s6}
      ${this._when(e,t)} ${this._play(e,t)} ${this._transition(e,t)}
    </li>`}render(){const e=this._clips,t=!ry(e);return n.qy`
      <div class="wrap">
        <p class="help lead">
          ${e.length?In(943):In(668)}
        </p>
        ${e.length?n.qy`<ol class="clips">${e.map((t,i)=>this._clip(t,i,e.length))}</ol>`:n.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||t} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${In(35)}
          </button>
          ${t?n.qy`<span class="help">${In(1150,{cLIPS_MAX:12})}</span>`:n.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};oy.styles=[Ip,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .help.lead {
        margin: 0;
      }
      .clips {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }
      .pair {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
      }
      .help.fill {
        margin: 0;
        min-height: 40px;
        display: flex;
        align-items: center;
      }
      .help.error {
        margin: 0;
      }
      .seg.full button {
        flex: 1;
        min-width: 0;
        padding: 0 6px;
        white-space: nowrap;
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .foot .help {
        margin: 0;
      }
    `],ay([(0,s.MZ)({attribute:!1})],oy.prototype,"doc",void 0),ay([(0,s.MZ)({attribute:!1})],oy.prototype,"hass",void 0),ay([(0,s.MZ)({attribute:!1})],oy.prototype,"library",void 0),ay([(0,s.MZ)({type:Number})],oy.prototype,"time",void 0),ay([(0,s.MZ)({type:Boolean,reflect:!0})],oy.prototype,"disabled",void 0),ay([(0,s.MZ)({attribute:!1})],oy.prototype,"selection",void 0),ay([(0,s.MZ)({attribute:!1})],oy.prototype,"tile",void 0),ay([(0,s.wk)()],oy.prototype,"_announce",void 0),oy=ay([(0,s.EM)("mc-anim-states-panel")],oy),_s({tag:"mc-anim-states-panel",place:"inspector",when:(e,t)=>"none"===t.kind,title:887,order:60});const ly=[{id:"rotate_speed",label:749,unit:"°/s",output:[0,720],step:10,hint:852},{id:"rotate",label:748,unit:"°",output:[0,180],step:5,hint:1026},{id:"x",label:456,unit:"px",output:[0,12],step:1,hint:497},{id:"y",label:457,unit:"px",output:[0,-12],step:1,hint:499},{id:"scale",label:767,unit:"×",output:[.8,1.2],step:.05,hint:359},{id:"opacity",label:605,unit:"0-1",output:[.3,1],step:.05,hint:318},{id:"draw",label:258,unit:"0-1",output:[0,1],step:.05,rigOnly:!0,hint:270},{id:"color_mix",label:167,unit:"",output:["#9e9e9e","#ffb300"],step:1,hint:95},{id:"speed",label:670,unit:"×",output:[.25,2],step:.05,hint:674}],cy=e=>ly.find(t=>t.id===e)??ly[0],dy=e=>ly.filter(t=>!t.rigOnly||(e=>/^(part|group|shape):/.test(e))(e)),py=e=>(e?.bindings?.length??0)<8;function hy(e,t){const i={...e};return t.length?i.bindings=t:delete i.bindings,i}const uy=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;var my=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const gy={element:292,icon:371,name:532,state:878,background:80},fy={element:1136,icon:1137,name:1138,state:1139,background:1135},vy=e=>e.target??e.keys?.[0]?.target;let by=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=ys,this._announce="",this._badAttr=new Set}get _target(){return vy(this.selection)}_write(e,t){this.doc&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:hy(this.doc,e),label:t}}))}_patch(e,t,i){this._write((this.doc?.bindings??[]).map((i,n)=>n===e?t:i),i)}_add(){const e=this._target;if(!e||!this.doc||!py(this.doc))return;const t=this.doc.bindings??[],i=function(e){const t=dy(e)[0];return{target:e,property:t.id,input:{min:0,max:100},output:[...t.output],smoothing:.4}}(e);this._write([...t,i],"Add value binding"),this._focusAfter=`.bind[data-i="${t.length}"] select.prop`,this._announce=In(87,{property:In(cy(i.property).label)})}_remove(e){const t=(this.doc?.bindings??[]).filter((t,i)=>i!==e);this._write(t,"Delete value binding"),this._focusAfter=".add",this._announce=In(88)}_checkAttr(e,t){const i=!t.trim()||uy.test(t.trim());if(i!==!this._badAttr.has(e)){const t=new Set(this._badAttr);i?t.delete(e):t.add(e),this._badAttr=t}return i}updated(){const e=this._focusAfter;e&&(this._focusAfter=void 0,this.renderRoot.querySelector(e)?.focus())}_num(e,t,i,s,r){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        class="input"
        id=${e}
        type="number"
        step=${s}
        inputmode="decimal"
        ?disabled=${this.disabled}
        .value=${String(i)}
        @change=${e=>{const t=e.target,n=Number(t.value);""!==t.value.trim()&&Number.isFinite(n)?n!==i&&r(n):t.value=String(i)}}
      />
    </div>`}_output(e,t){const i=cy(e.property),s=`bd-${t}`;if("color_mix"===e.property){const[i,s]=e.output,r=(n,r)=>{if(!r)return;const a=[i,s];a[n]=r,this._patch(t,{...e,output:a},"Change binding colours")};return n.qy`<div class="field">
          <div class="field-head"><span class="lbl">${In(347)}</span></div>
          <mc-color-picker .value=${i} .label=${In(347)} @value-changed=${e=>r(0,e.detail.value)}></mc-color-picker>
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${In(1005)}</span></div>
          <mc-color-picker .value=${s} .label=${In(1005)} @value-changed=${e=>r(1,e.detail.value)}></mc-color-picker>
        </div>`}const[r,a]=e.output,o=i.unit?` (${i.unit})`:"";return n.qy`<div class="pair">
      ${this._num(`${s}-from`,In(348,{unit:o}),r,i.step,i=>this._patch(t,{...e,output:[i,a]},"Change binding output"))}
      ${this._num(`${s}-to`,In(1010,{unit:o}),a,i.step,i=>this._patch(t,{...e,output:[r,i]},"Change binding output"))}
    </div>`}_binding(e,t,i){const s=`bd-${t}`,r=cy(e.property),a=dy(e.target),o=function(e){return e.input.min===e.input.max?In(444):void 0===e.input.attribute||""===e.input.attribute||uy.test(e.input.attribute)?void 0:In(79)}(e),l=function(e,t){if(!e)return;const i="element"===t.target||"icon"===t.target?e.keyframes:e.tracks?.find(e=>e.target===t.target)?.keyframes;if(!i?.length)return;const n=i,s=e=>n.some(t=>void 0!==e(t));switch(t.property){case"opacity":return s(e=>e.opacity)?In(979):void 0;case"draw":return s(e=>e.draw)?In(978):void 0;case"color_mix":return("background"===t.target?s(e=>e.background):s(e=>e.color))?In(980):void 0;case"rotate":case"x":case"y":case"scale":return s(e=>e.transform?.skew_x??e.transform?.skew_y)?In(981):void 0;default:return}}(this.doc,e),c=this._badAttr.has(t);return n.qy`<li class="cond bind" data-i=${t}>
      <div class="cond-head">
        <span class="n">${In(89,{n:i+1})} <span class="sub">· ${In(r.label)}</span></span>
        <button type="button" class="icon-btn sm danger del" aria-label=${In(224,{n:i+1})} title=${In(223)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="${s}-p">${In(695)}</label></div>
        <div class="select">
          <select
            class="input prop"
            id="${s}-p"
            aria-describedby="${s}-ph"
            ?disabled=${this.disabled}
            @change=${i=>this._patch(t,function(e,t){return e.property===t?e:{...e,property:t,output:[...cy(t).output]}}(e,i.target.value),"Change bound property")}
          >
            ${a.map(t=>n.qy`<option value=${t.id} ?selected=${t.id===e.property}>${In(t.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        <p class="help" id="${s}-ph">${In(r.hint)}</p>
      </div>
      <fieldset>
        <legend>${In(306)}</legend>
        <div class="field">
          <div class="field-head"><label for="${s}-a">${In(77)}</label></div>
          <input
            class="input mono"
            id="${s}-a"
            type="text"
            placeholder=${In(1132)}
            autocomplete="off"
            spellcheck="false"
            aria-describedby="${s}-ah"
            aria-invalid=${c?"true":"false"}
            ?disabled=${this.disabled}
            .value=${e.input.attribute??""}
            @input=${e=>this._checkAttr(t,e.target.value)}
            @change=${i=>{const n=i.target.value.trim();if(!this._checkAttr(t,n))return;const s={...e.input};n?s.attribute=n:delete s.attribute,this._patch(t,{...e,input:s},"Change binding attribute")}}
          />
          <p class="help ${c?"error":""}" id="${s}-ah">
            ${In(c?78:299)}
          </p>
        </div>
        <div class="pair">
          ${this._num(`${s}-min`,In(443),e.input.min,1,i=>this._patch(t,{...e,input:{...e.input,min:i}},"Change binding range"))}
          ${this._num(`${s}-max`,In(439),e.input.max,1,i=>this._patch(t,{...e,input:{...e.input,max:i}},"Change binding range"))}
        </div>
      </fieldset>
      <fieldset>
        <legend>${In(613)}</legend>
        ${this._output(e,t)}
        ${this._num(`${s}-s`,In(836),e.smoothing??0,.1,i=>{const n={...e};i>0?n.smoothing=Math.min(10,i):delete n.smoothing,this._patch(t,n,"Change binding smoothing")})}
      </fieldset>
      ${l?n.qy`<p class="help warn">${l}</p>`:n.s6}
      ${o?n.qy`<p class="help error" role="alert">${o}</p>`:n.s6}
    </li>`}render(){const e=this._target;if(!e||!this.doc)return n.qy``;const t=function(e,t){return t&&Array.isArray(e?.bindings)?e.bindings.map((e,t)=>({b:e,index:t})).filter(e=>e.b.target===t):[]}(this.doc,e),i=!py(this.doc),s=fy[e]?In(fy[e]):`“${function(e,t){if(gy[t])return In(gy[t]);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e?.rig?.parts:"group"===i[1]?e?.rig?.groups:e?.rig?.shapes;return n?.find(e=>e.id===i[2])?.name||i[2]}(this.doc,e)}”`;return n.qy`
      <div class="wrap">
        <p class="help lead">
          ${t.length?n.qy`${In(939,{name:s})}`:n.qy`${In(272,{name:s})}`}
        </p>
        ${t.length?n.qy`<ol class="binds">${t.map((e,t)=>this._binding(e.b,e.index,t))}</ol>`:n.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||i} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${In(39)}
          </button>
          ${i?n.qy`<span class="help">${In(1207,{max:8})}</span>`:n.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};by.styles=[Ip,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .wrap {
        display: grid;
        gap: 12px;
      }
      .binds {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 12px;
      }
      fieldset {
        margin: 0;
        padding: 0;
        border: 0;
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      legend {
        padding: 0;
        margin-bottom: 8px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .pair {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
        align-items: start;
      }
      .help.warn {
        color: var(--mc-warn-ink, var(--mc-text-2));
      }
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }
      .foot {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
    `],my([(0,s.MZ)({attribute:!1})],by.prototype,"doc",void 0),my([(0,s.MZ)({attribute:!1})],by.prototype,"hass",void 0),my([(0,s.MZ)({attribute:!1})],by.prototype,"library",void 0),my([(0,s.MZ)({type:Number})],by.prototype,"time",void 0),my([(0,s.MZ)({type:Boolean,reflect:!0})],by.prototype,"disabled",void 0),my([(0,s.MZ)({attribute:!1})],by.prototype,"selection",void 0),my([(0,s.MZ)({attribute:!1})],by.prototype,"tile",void 0),my([(0,s.wk)()],by.prototype,"_announce",void 0),my([(0,s.wk)()],by.prototype,"_badAttr",void 0),by=my([(0,s.EM)("mc-anim-bindings-panel")],by),_s({tag:"mc-anim-bindings-panel",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"target"===t.kind&&!!vy(t),title:1065,order:60});var yy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const xy=[{id:"on",label:595},{id:"off",label:594},{id:"unavailable",label:1027},{id:"value",label:1060,numeric:!0},{id:"custom",label:204}];let _y=class extends n.WF{constructor(){super(...arguments),this.disabled=!1,this.selection=ys,this.time=0,this._choice="on",this._custom="idle",this._value=Ed.value,this._sent="",this._picked=!1}get detail(){return{state:"value"===this._choice?function(e,t){const[i,n]=Vd(e).stateRange??[0,100];return String(Hd(i+(n-i)*Math.min(1,Math.max(0,t))))}(this.doc,this._value):"custom"===this._choice?this._custom.trim()||"idle":this._choice,value:this._value,attributes:Od(this.doc,this._value)}}_emit(){const e=this.detail,t=JSON.stringify(e);t!==this._sent&&(this._sent=t,this.dispatchEvent(new CustomEvent("preview-change",{bubbles:!0,composed:!0,detail:e})))}willUpdate(e){e.has("doc")&&!this._picked&&(this._choice=Vd(this.doc).numericState?"value":"on")}updated(e){(e.has("doc")||e.has("_choice")||e.has("_custom")||e.has("_value"))&&this._emit()}_pick(e){this._picked=!0,this._choice=e,"custom"===e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".custom")?.focus())}_states(e){const t=xy.filter(t=>!t.numeric||e||this._choice===t.id);return n.qy`<div class="seg" role="radiogroup" aria-label=${In(690)} @keydown=${e=>{const i=t.findIndex(e=>e.id===this._choice),n={ArrowRight:(i+1)%t.length,ArrowLeft:(i-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];void 0!==n&&(e.preventDefault(),this._picked=!0,this._choice=t[n].id,this.updateComplete.then(()=>this.renderRoot.querySelector('.seg [aria-checked="true"]')?.focus()))}}>
      ${t.map(e=>{const t=e.id===this._choice;return n.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>this._pick(e.id)}>${In(e.label)}</button>`})}
    </div>`}render(){if(!qd(this.doc))return n.qy``;const e=Vd(this.doc),t=Math.round(100*this._value);return n.qy`<div class="bar" role="group" aria-label=${In(688)}>
      <span class="lbl" aria-hidden="true"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></span>
      ${this._states(e.numericState)}
      ${"custom"===this._choice?n.qy`<input
            class="input mono custom"
            type="text"
            aria-label=${In(207)}
            placeholder=${In(878)}
            autocomplete="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            .value=${this._custom}
            @change=${e=>this._custom=e.target.value}
          />`:n.s6}
      ${e.value?n.qy`<label class="value">
            <span class="sr-only">${In(692)}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              ?disabled=${this.disabled}
              .value=${String(t)}
              aria-valuetext=${In(1243,{pct:t})}
              @input=${e=>this._value=Number(e.target.value)/100}
            />
            <output aria-hidden="true">${t}%</output>
          </label>`:n.s6}
    </div>`}};_y.styles=[Ip,n.AH`
      :host {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        display: flex;
        justify-content: center;
        pointer-events: none;
        z-index: 3;
      }
      .bar {
        pointer-events: auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        max-width: 100%;
        padding: 6px 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
      .lbl {
        display: inline-flex;
        color: var(--mc-text-2);
        --mdc-icon-size: 18px;
      }
      .custom {
        width: 120px;
        min-height: 32px;
        padding: 4px 8px;
      }
      .value {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 32px;
      }
      .value input {
        width: 140px;
        min-height: 24px;
        accent-color: var(--mc-accent);
        margin: 0;
      }
      .value output {
        min-width: 4ch;
        font-size: 0.8125rem;
        font-variant-numeric: tabular-nums;
        color: var(--mc-text-2);
        text-align: right;
      }
      input[type='range']:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
    `],yy([(0,s.MZ)({attribute:!1})],_y.prototype,"doc",void 0),yy([(0,s.MZ)({type:Boolean,reflect:!0})],_y.prototype,"disabled",void 0),yy([(0,s.MZ)({attribute:!1})],_y.prototype,"selection",void 0),yy([(0,s.MZ)({type:Number})],_y.prototype,"time",void 0),yy([(0,s.wk)()],_y.prototype,"_choice",void 0),yy([(0,s.wk)()],_y.prototype,"_custom",void 0),yy([(0,s.wk)()],_y.prototype,"_value",void 0),_y=yy([(0,s.EM)("mc-anim-stage-sim")],_y),_s({tag:"mc-anim-stage-sim",place:"stage-tool",when:e=>qd(e),title:688,order:80,dock:"bottom"});var $y=i(5084),wy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const ky=e=>!!e&&/^(part|group|shape):/.test(e),My=(e,t)=>"intensity"===e.id?`${t}×`:"direction"===e.id?In(t<0?740:342):`${t} %`;let Sy=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._applied=new Map,this._status=""}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=rv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=av(e),this._geom||ov(e).then(t=>{this._ref===e&&(this._geom=t)}))}}get _targets(){const e=Ov(this.selection).filter(ky),t=this.selection.target;ky(t)&&!e.includes(t)&&e.unshift(t);for(const t of this.selection.targets??[])ky(t)&&!e.includes(t)&&e.push(t);return e}get _key(){return this._targets.join(",")}_apply(e,t,i=!1){const n=i?this._dragBase??=this.doc:this._dragBase??this.doc;if(!n)return;const s=this._geom?cv(this._geom):void 0,r=(0,$y.ar)(n,this._targets,e.id,t,{pieces:s});if(i||(this._dragBase=void 0),r===n)return void(i||(this._status=In(987)));const a=new Map(this._applied);a.set(this._key,{preset:e.id,params:t}),this._applied=a;const o=this._targets.map(e=>Av(n,e));this._status=i?"":In(1246,{preset:(0,T.t)(e.name),targets:o.length>2?In(1163,{count:o.length}):Wn(o)}),Dv(this,r,`Preset: ${e.id}`,i)}_pickPreset(e,t){const i=$y.tP.find(t=>t.id===e.value);i&&(this._apply(i,t?.preset===i.id?t.params:{}),this._applied.get(this._key)?.preset!==i.id&&(e.value=t?.preset??""))}_clear(){if(!this.doc)return;const e=this._targets.reduce((e,t)=>(0,$y.di)(e,t),this.doc),t=new Map(this._applied);t.delete(this._key),this._applied=t,this._status=In(455),Dv(this,e,"Remove motion")}_openSvg(){this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)}_renderParams(e,t){const i=(0,$y.Cq)(e.id,t);return n.qy`<div class="params" role="group" aria-label=${In(1230,{name:(0,T.t)(e.name)})}>
      ${e.params.map(t=>{const s=i[t.id];if("direction"===t.id)return n.qy`<div class="field">
            <div class="field-head"><span class="lbl" id="pp-dir">${In(240)}</span></div>
            <div class="seg full" role="radiogroup" aria-labelledby="pp-dir">
              ${[1,-1].map(t=>n.qy`<button
                  type="button"
                  role="radio"
                  data-dir=${t}
                  aria-checked=${s===t?"true":"false"}
                  tabindex=${s===t?0:-1}
                  ?disabled=${this.disabled}
                  @click=${()=>this._apply(e,{...i,direction:t})}
                >
                  <ha-icon icon=${t>0?"mdi:rotate-right":"mdi:rotate-left"}></ha-icon>${In(t>0?342:740)}
                </button>`)}
            </div>
          </div>`;const r=`pp-${t.id}`;return n.qy`<div class="field">
          <div class="field-head"><label for=${r}>${(0,T.t)(t.label)}</label><span class="val">${My(t,s)}</span></div>
          <input
            id=${r}
            class="range"
            type="range"
            data-param=${t.id}
            min=${t.min}
            max=${t.max}
            step=${t.step}
            .value=${String(s)}
            aria-valuetext=${My(t,s)}
            ?disabled=${this.disabled}
            @input=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)},!0)}
            @change=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)})}
          />
        </div>`})}
    </div>`}updated(){const e=this.renderRoot.querySelector("select#pp-preset"),t=this._applied.get(this._key)?.preset??"";e&&e.value!==t&&(e.value=t)}render(){const e=this.doc,t=this._targets;if(!e||!t.length)return n.qy``;const i=this._applied.get(this._key),s=i?$y.tP.find(e=>e.id===i.preset):void 0,r=t.some(t=>(hv(e,t)?.keyframes.length??0)>0),a=this._geom?cv(this._geom):[];return n.qy`
      <p class="help">${t.length>1?In(1168,{count:t.length}):In(598)}</p>
      <div class="field">
        <div class="field-head"><label for="pp-preset">${In(684)}</label></div>
        <div class="select">
          <select
            class="input"
            id="pp-preset"
            aria-describedby=${s?.help?"pp-preset-help":n.s6}
            ?disabled=${this.disabled}
            @change=${e=>this._pickPreset(e.target,i)}
          >
            <option value="" ?selected=${!s} ?disabled=${!!s} ?hidden=${!!s}>${In(143)}</option>
            ${$y.tP.map(e=>n.qy`<option value=${e.id} data-preset=${e.id} ?selected=${s?.id===e.id}>${(0,T.t)(e.name)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        ${s?.help?n.qy`<p class="help" id="pp-preset-help">${(0,T.t)(s.help)}</p>`:n.s6}
      </div>
      ${s?this._renderParams(s,i.params):n.s6}
      <div class="actions">
        ${r?n.qy`<button type="button" class="btn btn-text btn-sm clear" ?disabled=${this.disabled} @click=${()=>this._clear()}>${In(714)}</button>`:n.s6}
        <span class="grow"></span>
        <button type="button" class="btn btn-secondary btn-sm export" @click=${()=>this._openSvg()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>${In(63)}
        </button>
      </div>
      <p class="status" role="status" aria-live="polite">${this._status}</p>
      <mc-anim-svg-dialog .doc=${e} .pieces=${a} .viewBox=${this._geom?.viewBox??"0 0 24 24"}></mc-anim-svg-dialog>
    `}};function jy(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}Sy.styles=[ps,hs,n.AH`
      :host {
        display: grid;
        gap: 12px;
      }
      .help {
        margin: 0;
      }
      .field {
        display: grid;
        gap: 6px;
      }
      .params {
        display: grid;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--mc-radius, 8px);
        background: var(--mc-surface-2, var(--secondary-background-color, #f2f3f5));
      }
      .field-head .val {
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
        font-variant-numeric: tabular-nums;
      }
      input.range {
        width: 100%;
        min-height: 24px;
        margin: 0;
        accent-color: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
      }
      .grow {
        flex: 1;
      }
      .status {
        margin: 0;
        min-height: 1em;
        font-size: 0.75rem;
        color: var(--secondary-text-color, #5f6368);
      }
    `],wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"doc",void 0),wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"hass",void 0),wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"library",void 0),wy([(0,s.MZ)({type:Number})],Sy.prototype,"time",void 0),wy([(0,s.MZ)({type:Boolean})],Sy.prototype,"disabled",void 0),wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"selection",void 0),wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"tile",void 0),wy([(0,s.MZ)({attribute:!1})],Sy.prototype,"stage",void 0),wy([(0,s.wk)()],Sy.prototype,"_applied",void 0),wy([(0,s.wk)()],Sy.prototype,"_geom",void 0),wy([(0,s.wk)()],Sy.prototype,"_status",void 0),Sy=wy([(0,s.EM)("mc-anim-part-presets")],Sy),_s({tag:"mc-anim-part-presets",place:"inspector",title:622,order:15,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&ky(t.target)}),new Map;var Cy=i(1474);let Ay,zy;function qy(){return Ay??=i.e(334).then(()=>i(1935)).then(e=>(0,op.t)("magic-card-icon-library.js",e)??Promise.reject(new Error("the icon library is from another release"))).then(async e=>await e.iconNamesReady()?e:Promise.reject(new Error("the icon names could not be loaded"))).then(e=>zy=e,e=>{throw Ay=void 0,console.warn("Magic Card: icon library not loaded",e),e}),Ay}var Ey=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let Hy=class extends n.WF{constructor(){super(...arguments),this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(e.has("entry")&&(this._card=void 0),this._card)return void(e.has("hass")&&this.hass&&(this._card.hass=this.hass));const t=this.entry;if(!this._visible||!t||!customElements.get("magic-card"))return;const i=t.build(),n=document.createElement("magic-card");try{n.setConfig({type:"custom:magic-card",custom_animations:[i],rows:[{id:"r",columns:[{id:"c",vertical_align:"center",modules:[{id:"m",type:"icon",icon:t.icon,size:"40px",design:{text_align:"center",animations:[{id:"a",preset:`custom:${i.id}`}]}}]}]}]})}catch{return}n.hass=this.hass??Kd(!1),this._card=n}render(){const e=this._visible?this._card:void 0;return n.qy`<div class="box" aria-hidden="true">${e??n.qy`<ha-icon icon=${this.entry?.icon??""}></ha-icon>`}</div>`}};Hy.styles=[ps,n.AH`
      :host {
        display: block;
        width: 100%;
        height: 64px;
      }
      .box {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: var(--mc-radius, 8px);
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 8px 8px;
        color: var(--state-icon-color, #44739e);
        --mdc-icon-size: 40px;
      }
      magic-card {
        display: block;
        width: 100%;
        pointer-events: none;
        --ha-card-background: transparent;
        --card-background-color: transparent;
        --ha-card-border-width: 0;
        --ha-card-box-shadow: none;
      }
    `],Ey([(0,s.MZ)({attribute:!1})],Hy.prototype,"entry",void 0),Ey([(0,s.MZ)({attribute:!1})],Hy.prototype,"hass",void 0),Ey([(0,s.wk)()],Hy.prototype,"_visible",void 0),Hy=Ey([(0,s.EM)("mc-anim-icon-thumb")],Hy);const Ly={alarm_control_panel:43,binary_sensor:86,button:113,calendar:114,camera:115,climate:157,cover:195,device_tracker:239,event:308,fan:320,humidifier:370,lawn_mower:403,light:417,lock:428,media_player:441,person:650,plant:661,sensor:791,siren:824,sun:907,switch:910,timer:1002,vacuum:1059,valve:1067,weather:1070,zone:1081},Vy=(e,t)=>t?.localize?.(`component.${e}.title`)||(void 0!==Ly[e]?In(Ly[e]):null)||e.replace(/_/g," ").replace(/^./,e=>e.toUpperCase());let Oy=class extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this._icon="mdi:bell-ring",this._query="",this._domain="",this._busy=!1,this._error="",this._lib=zy,this._libFailed=!1}connectedCallback(){super.connectedCallback(),this._lib||this._loadLibrary(),bs("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}async _loadLibrary(){this._libFailed=!1;try{this._lib=await qy()}catch{this._libFailed=!0}}_emit(e,t){this.dispatchEvent(new CustomEvent("icon-start",{detail:{doc:e,from:t},bubbles:!0,composed:!0}))}async start(){const e=this._icon.trim();if(rt.test(e)){this._busy=!0,this._error="";try{const t=this._lib??await qy().catch(()=>{}),i=t?.mdiGeometry(e)??await Jf(e);if(!i)return void(this._error=In(989));const n=In(1216,{name:jy(e)}),s=(0,Cy.a)(e,i,e.slice(e.indexOf(":")+1),n,{embed:!0});if(!s.rig?.parts.length)return void(this._error=In(990));this._emit(s,"icon")}finally{this._busy=!1}}else this._error=In(653)}focusStart(){const e=this.renderRoot.querySelector("mc-icon-picker, .icon-input");(e?.shadowRoot?.querySelector("input")??e)?.focus({preventScroll:!0})}_renderPick(){const e=bs("mc-icon-picker");return n.qy`<section class="pick" aria-labelledby="is-pick">
      <h3 id="is-pick">${In(874)}</h3>
      <p class="help">${In(947)}</p>
      <div class="pick-row">
        <div class="field grow">
          ${e?n.qy`<mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${In(371)}
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._error=""}}
              ></mc-icon-picker>`:n.qy`<input
                class="input mono icon-input"
                aria-label=${In(371)}
                spellcheck="false"
                .value=${L(this._icon)}
                @input=${e=>{this._icon=e.target.value,this._error=""}}
                @keydown=${e=>"Enter"===e.key&&void this.start()}
              />`}
        </div>
        <button type="button" class="btn btn-primary btn-sm start" ?disabled=${this._busy} @click=${()=>{this.start()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?In(860):In(855)}
        </button>
      </div>
      ${this._error?n.qy`<p class="help error" role="alert">${this._error}</p>`:n.s6}
    </section>`}_renderLibrary(){const e=this._lib,t=n.qy`<div class="lib-head">
      <h3 id="is-lib">${In(610)}</h3>
      ${e?n.qy`<span class="chip is-count">${e.ICON_LIBRARY.length}</span>`:n.s6}
    </div>`;if(!e)return n.qy`<section class="lib" aria-labelledby="is-lib">
        ${t}
        ${this._libFailed?n.qy`<p class="help error lib-error" role="alert">${In(948)}</p>
              <div><button type="button" class="btn btn-secondary btn-sm lib-retry" @click=${()=>{this._loadLibrary()}}><ha-icon icon="mdi:refresh"></ha-icon>${In(1016)}</button></div>`:n.qy`<p class="help lib-loading" role="status">${In(425)}</p>`}
      </section>`;const i=e.searchLibrary(this._query,this._domain||void 0);return n.qy`<section class="lib" aria-labelledby="is-lib">
      ${t}
      <div class="filters">
        <div class="with-icon grow">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input lib-search"
            type="search"
            placeholder=${In(773)}
            aria-label=${In(775)}
            .value=${L(this._query)}
            @input=${e=>this._query=e.target.value}
          />
        </div>
        <select class="input domain" aria-label=${In(242)} .value=${L(this._domain)} @change=${e=>this._domain=e.target.value}>
          <option value="">${In(45)}</option>
          ${[...e.LIBRARY_DOMAINS].sort((e,t)=>Vy(e,this.hass).localeCompare(Vy(t,this.hass))).map(e=>n.qy`<option value=${e} ?selected=${e===this._domain}>${Vy(e,this.hass)}</option>`)}
        </select>
      </div>
      ${i.length?n.qy`<ul class="grid" role="list">
            ${i.map(e=>n.qy`<li>
                <button type="button" class="entry" data-id=${e.id} title="${e.name} (${e.icon})" @click=${()=>this._emit(e.build(),"library")}>
                  <mc-anim-icon-thumb .entry=${e} .hass=${this.hass}></mc-anim-icon-thumb>
                  <span class="nm">${e.name}</span>
                  <span class="dm">${Vy(e.domain,this.hass)}</span>
                </button>
              </li>`)}
          </ul>`:n.qy`<p class="help no-results">${In(555,{query:this._query})}</p>`}
    </section>`}render(){return n.qy`${this._renderPick()} ${this._renderLibrary()}`}};Oy.styles=[ps,hs,n.AH`
      :host {
        display: grid;
        gap: 20px;
        min-height: 0;
      }
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }
      section {
        display: grid;
        gap: 10px;
        min-height: 0;
      }
      .help {
        margin: 0;
      }
      .pick-row,
      .filters,
      .lib-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .pick-row .field {
        margin: 0;
      }
      select.domain {
        width: auto;
        min-width: 150px;
      }
      .grid {
        list-style: none;
        margin: 0;
        padding: 2px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(116px, 1fr));
        gap: 8px;
        max-height: min(46vh, 420px);
        overflow: auto;
      }
      .grid > li {
        display: flex;
      }
      .entry {
        width: 100%;
        align-content: start;
        display: grid;
        justify-items: center;
        gap: 4px;
        padding: 8px 6px;
        border-radius: var(--mc-radius, 8px);
        border: 1px solid var(--mc-divider, var(--divider-color, rgba(0, 0, 0, 0.12)));
        background: var(--mc-surface, var(--card-background-color, #fff));
        color: var(--mc-text, var(--primary-text-color, #212121));
        font: inherit;
        cursor: pointer;
        text-align: center;
      }
      .entry:hover {
        border-color: color-mix(in srgb, var(--primary-color, #03a9f4) 60%, transparent);
      }
      .entry:focus-visible {
        outline: 2px solid var(--primary-color, #03a9f4);
        outline-offset: 2px;
      }
      .pick-row {
        align-items: flex-start;
      }
      .pick-row .start {
        min-height: 40px;
      }
      .nm {
        font-size: 0.8125rem;
        line-height: 1.25;
      }
      .dm {
        font-size: 0.6875rem;
        color: var(--mc-text-2, var(--secondary-text-color, #5f6368));
      }
    `],Ey([(0,s.MZ)({attribute:!1})],Oy.prototype,"hass",void 0),Ey([(0,s.MZ)({attribute:!1})],Oy.prototype,"lookup",void 0),Ey([(0,s.wk)()],Oy.prototype,"_icon",void 0),Ey([(0,s.wk)()],Oy.prototype,"_query",void 0),Ey([(0,s.wk)()],Oy.prototype,"_domain",void 0),Ey([(0,s.wk)()],Oy.prototype,"_busy",void 0),Ey([(0,s.wk)()],Oy.prototype,"_error",void 0),Ey([(0,s.wk)()],Oy.prototype,"_lib",void 0),Ey([(0,s.wk)()],Oy.prototype,"_libFailed",void 0),Oy=Ey([(0,s.EM)("mc-anim-icon-start")],Oy),function(e){nm=e}(rd),function(e,t){Ie.particles=e,Ie.checkSim=t,Ie.epoch++}(ad,rd.validateSim);const Py=[["magic-card-animation-studio",Dp],["mcas-stage",Wd],["mcas-thumb",Tp],["mc-preset-grid",ap],["mc-preset-thumb",rp]];for(const[e,t]of Py)customElements.get(e)||customElements.define(e,t)})();