(()=>{"use strict";var e={3706(e,t,i){i.d(t,["eo",0,"mc-path-canvas"])},3682(e,t,i){const n={colour:"color",centre:"center",grey:"gray",metre:"meter",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"};i.d(t,["A",0,e=>e.toLowerCase().replace(/colour|centre|grey|metre|customis|behaviour|favourite|maximis|minimis|organis/g,e=>n[e])])},201(e,t,i){var n=i(4753);const{t:s,tx:r,m:a,locale:o,ready:l}=(0,n._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,l,"H",0,o,"t",0,s])},1699(e,t,i){const n="mc-i18n-wrap",s="mc-i18n-wrap-query";let r=null,a=!1,o=!1,l=!1;const c={},d=e=>c[e]||=(console.debug("[i18n] "+e),1),p=()=>{o=!0;try{window.dispatchEvent(new CustomEvent(n,{detail:{wrap:r}}))}finally{o=!1}},h=()=>{l||"undefined"==typeof window||(l=!0,window.addEventListener(n,e=>{const t=e.detail?.wrap;"function"!=typeof t&&null!==t||(r=t,a=o)}),window.addEventListener(s,()=>a&&p()),window.dispatchEvent(new Event(s)))};i.d(t,["B6",0,h,"C1",0,(e,t)=>{if(r){try{const i=r(e,t);if("string"==typeof i)return i}catch{}d("bad wrap")}return e},"fo",0,()=>!!r,"iC",0,e=>{h(),r=e,p()},"st",0,d])},4753(e,t,i){var n=i(796),s=i(1699);const r=["en-GB","en-US","nl"];let a,o=0;const l=e=>(0,n.ZV)(a,e),c=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,d=/\{((?:[^{}]|\{[^{}]*\})*)\}/,p=/^(ar|he|iw|fa|ur|ps|sd|ug|yi|dv|ckb)\b/i,h=/[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/,u=(e,t,i,n)=>t.split(c).flatMap((t,r)=>{if(!(1&r))return void 0===n?t:t.replace(/#/g,l(n));const a=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(t);if(!a)throw 0;const o=i[a[1]];if(void 0===o&&(0,s.st)("missing "+a[1]),!a[2])return"object"==typeof o?[o]:void 0===o?"":"number"==typeof o?l(o):p.test(e)||(0,s.fo)()||h.test(o)?"⁨"+o+"⁩":o;const c=a[3].split(d),m="plural"==a[2],g=m?Math.round(10*+o)/10:o,f=e=>c[c.findIndex((t,i)=>!(1&i)&&t.trim()==e)+1||-1],v=f("="+g)??f(m?new Intl.PluralRules(e).select(g):String(o))??f("other");if(void 0===v)throw 0;return u(e,v,i,m?g:void 0)}).filter(String),m=(e,t)=>{(0,s.B6)();const i=[],n=e=>i[e]||=t()[e].split("|"),a=(i,r=o)=>t()?(n(r)[i]||n(0)[i])??"":((0,s.st)("not ready "+e),""),l=(e,t={})=>{try{return u(r[o],a(e),t)}catch{return(0,s.st)("malformed "+e),[a(e,0)]}};return{ns:e,locale:()=>r[o],t:(e,t)=>(0,s.C1)(l(e,t).join(""),"msg"),tx:(e,t)=>l(e,t).map(e=>"string"==typeof e?(0,s.C1)(e,"msg"):e),en:e=>a(e,0),m:e=>e}};i.d(t,["Zc",0,e=>{a=e;const t=(e=>{const t=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((e||"").toLowerCase());return t?"nl"==t[1]?"nl":t[3]?"en-GB":"en-US":"en-GB"})(e?.locale?.language||e?.language||globalThis.navigator?.language);return o=r.indexOf(t),t},"_H",0,(e,t)=>{let i,n;return{...m(e,()=>i),ready:()=>n||=t().then(e=>(i=e.default,!0),()=>(n=void 0,!1))}},"my",0,(e,t)=>m(e,()=>t)])},1474(e,t,i){i.d(t,{a:()=>r,dI:()=>o});var n=i(2637),s=i(201);function r(e,t,i,r,o={}){const l=(0,n.WP)(t).slice(0,64).map((e,t)=>({id:`part-${t+1}`,name:(0,s.t)(349,{n:t+1}),from:[e.index]})),c=o.embed?function(e){const t=(t,i)=>e.evenodd?.[t]?.includes(i)?' fill-rule="evenodd"':"",i=[...(e.secondary??[]).map((e,i)=>`<path class="mc-accent" d="${a(e)}"${t("accent",i)}/>`),...e.paths.map((e,i)=>`<path d="${a(e)}"${t("paths",i)}/>`),...(e.strokes??[]).map(e=>`<path${e.accent?' class="mc-accent"':""} d="${a(e.d)}" fill="none" stroke="currentColor" stroke-width="${e.width}"${e.cap?` stroke-linecap="${a(e.cap)}"`:""}${e.join?` stroke-linejoin="${a(e.join)}"`:""}/>`)],n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a(e.viewBox||"0 0 24 24")}">${i.join("")}</svg>`;return("undefined"!=typeof TextEncoder?(new TextEncoder).encode(n).length:n.length)>32768?void 0:n}(t):void 0;return{id:i,name:r,kind:"keyframes",duration:2,easing:"ease-in-out",iterations:"infinite",target:"icon",origin:"center",version:1,keyframes:[{at:0,opacity:1}],rig:c?{svg:c,parts:l}:{icon:e,parts:l}}}const a=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function o(e,t="center"){const[i,n,s,r]=e,a=/left/.test(t)?0:/right/.test(t)?1:.5,o=/top/.test(t)?0:/bottom/.test(t)?1:.5,l=e=>Math.round(100*e)/100;return[l(i+s*a),l(n+r*o)]}i.d(t,["jo",0,(e,t)=>(0,n.Zg)(t.map(t=>e[t]?.bbox).filter(e=>!!e))])},5084(e,t,i){i.d(t,{Cq:()=>b,Z3:()=>x,ar:()=>C,di:()=>A});var n=i(2637),s=i(1474);const r=(e,t,i,n,s,r)=>({id:e,label:t,min:i,max:n,step:s,default:r}),a=(e=100)=>({...r("share",169,10,100,5,e),unit:"%"}),o=()=>({...r("delay",135,0,90,5,0),unit:"%"}),l=()=>r("intensity",259,.25,3,.25,1),c=()=>r("direction",140,-1,1,2,1),d=(e=100)=>[a(e),o(),l(),c()],p=e=>Math.round(1e3*e)/1e3||0,h=(e,t,i="ease-in-out")=>({t:e,k:{transform:{rotate:p(t)},easing:i}}),u=(e,t,i={},n="ease-in-out")=>{const s={};for(const[e,i]of Object.entries(t))s[e]=p(i);return{t:e,k:{transform:s,...i,easing:n}}},m=(e,t)=>e.map(([e,i])=>h(e,t*i)),g=[{id:"swing",name:473,icon:"mdi:metronome",pivot:"top",help:476,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,1],[.4,-.8],[.6,.5],[.8,-.25],[1,0]],14*e*t)},{id:"ring",name:390,icon:"mdi:bell-ring-outline",pivot:"top",help:394,params:d(70),gen:({intensity:e,direction:t})=>m([[0,0],[.08,1],[.18,-.95],[.28,.85],[.38,-.72],[.48,.58],[.58,-.44],[.68,.3],[.78,-.16],[.88,.06],[1,0]],16*e*t)},{id:"spin",name:446,icon:"mdi:rotate-right",pivot:"center",help:528,params:[a(),o(),r("intensity",527,1,5,1,1),c()],gen:({intensity:e,direction:t})=>[h(0,0,"linear"),h(1,360*Math.max(1,Math.round(e))*t,"linear")]},{id:"pulse",name:369,icon:"mdi:heart-pulse",pivot:"center",help:231,params:d(),gen:({intensity:e,direction:t})=>[u(0,{scale:1}),u(.5,{scale:1+.15*e*t}),u(1,{scale:1})]},{id:"bounce",name:88,icon:"mdi:debug-step-over",pivot:"bottom",help:454,params:d(),gen:({intensity:e,direction:t})=>{const i=-3*e*t;return[u(0,{y:0,scale_x:1,scale_y:1},{},"ease-out"),u(.12,{y:0,scale_x:1.08,scale_y:.9},{},"ease-out"),u(.45,{y:i,scale_x:.96,scale_y:1.06},{},"ease-in"),u(.75,{y:0,scale_x:1.06,scale_y:.92},{},"ease-out"),u(.88,{y:0,scale_x:.98,scale_y:1.02}),u(1,{y:0,scale_x:1,scale_y:1})]}},{id:"shake",name:417,icon:"mdi:vibrate",help:420,params:d(60),gen:({intensity:e,direction:t})=>{const i=1.2*e*t;return[0,-1,1,-1,1,-.6,.6,-.3,.3,0].map((e,t,n)=>u(t/(n.length-1),{x:i*e}))}},{id:"wobble",name:557,icon:"mdi:rotate-3d-variant",pivot:"bottom",help:397,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,-1],[.3,.75],[.45,-.5],[.6,.3],[.75,-.15],[1,0]],8*e*t)},{id:"blink",name:65,icon:"mdi:eye-outline",help:66,params:[a(),o(),l()],gen:({intensity:e})=>{const t=p(Math.max(0,1-.9*e));return[1,t,1,t,1,1].map((e,t)=>({t:[0,.1,.2,.3,.4,1][t],k:{opacity:e,easing:"linear"}}))}},{id:"fade",name:183,icon:"mdi:circle-opacity",help:185,params:[a(),o(),l()],gen:({intensity:e})=>[{t:0,k:{opacity:1,easing:"ease-in-out"}},{t:.5,k:{opacity:p(Math.max(0,1-.8*e)),easing:"ease-in-out"}},{t:1,k:{opacity:1,easing:"ease-in-out"}}]},...[["slide-up",430,313,"mdi:arrow-up","y",-1],["slide-down",427,310,"mdi:arrow-down","y",1],["slide-left",428,311,"mdi:arrow-left","x",-1],["slide-right",429,312,"mdi:arrow-right","x",1]].map(([e,t,i,n,s,r])=>({id:e,name:t,icon:n,help:i,params:d(),gen:({intensity:e,direction:t})=>{const i=3*e*t*r;return[u(0,{[s]:0}),u(.4,{[s]:i}),u(.6,{[s]:i}),u(1,{[s]:0})]}})),{id:"draw-on",name:160,icon:"mdi:draw",draws:!0,help:161,params:[a(60),o(),c()],gen:({direction:e})=>[{t:0,k:{draw:e>0?0:1,easing:"ease-in-out"}},{t:1,k:{draw:e>0?1:0,easing:"ease-in-out"}}]},{id:"draw-loop",name:159,icon:"mdi:draw-pen",draws:!0,help:162,params:[a(),o()],gen:()=>[{t:0,k:{draw:0,easing:"ease-in-out"}},{t:.45,k:{draw:1,easing:"ease-in-out"}},{t:.7,k:{draw:1,easing:"ease-in-out"}},{t:1,k:{draw:0,easing:"ease-in-out"}}]},{id:"pop",name:360,icon:"mdi:star-four-points-outline",pivot:"center",help:361,params:[a(50),o(),l()],gen:({intensity:e})=>[u(0,{scale:0},{opacity:0},"ease-out"),u(.6,{scale:1+.2*e},{opacity:1},"ease-in-out"),u(1,{scale:1},{opacity:1})]},{id:"float",name:206,icon:"mdi:waves-arrow-up",help:163,params:d(),gen:({intensity:e,direction:t})=>[u(0,{y:0}),u(.5,{y:-1.5*e*t}),u(1,{y:0})]},{id:"flicker",name:203,icon:"mdi:fire",pivot:"bottom",help:204,params:[a(),o(),l()],gen:({intensity:e})=>[[0,1,1,0],[.12,1.08,.85,2],[.25,.96,1,-1.5],[.4,1.1,.9,1],[.55,.97,1,-2],[.7,1.06,.85,1.5],[.85,.98,1,-.5],[1,1,1,0]].map(([t,i,n,s])=>u(t,{scale_y:1+(i-1)*e,skew_x:s*e},{opacity:p(1-(1-n)*Math.min(e,1))}))},{id:"wave",name:547,icon:"mdi:wifi",pivot:"center",help:284,params:d(),gen:({intensity:e})=>{const t=p(Math.max(0,1-.7*Math.min(e,1.4))),i=p(1-.08*e);return[u(0,{scale:i},{opacity:t}),u(.35,{scale:1+.04*e},{opacity:1}),u(.7,{scale:i},{opacity:t}),u(1,{scale:i},{opacity:t})]}}],f=g.map(({gen:e,...t})=>t),v=new Map(g.map(e=>[e.id,e]));function b(e,t={}){const i=v.get(e),n={};for(const e of i?.params??[]){const i=t[e.id];n[e.id]="number"==typeof i&&Number.isFinite(i)?Math.min(e.max,Math.max(e.min,i)):e.default}return n}const y=e=>Math.round(100*e)/100;function x(e,t={}){const i=b(e,t),n=i.delay??0;return _(e,i,n,Math.min(100,n+(i.share??100)))}function _(e,t,i,n){const s=v.get(e);return s?function(e,t,i){const n=i-t,s=e=>{const t={...e};return delete t.easing,t},r=[],a=e=>{const t=r.findIndex(t=>t.at===e.at);t>=0?r[t]={...r[t],...e}:r.push(e)};t>0&&a({at:0,...s(e[0].k)});for(const i of e)a({at:y(t+i.t*n),...i.k});return i<100&&a({at:100,...s(e[e.length-1].k)}),r.sort((e,t)=>e.at-t.at)}(s.gen({intensity:t.intensity??1,direction:(t.direction??1)<0?-1:1}),i,Math.max(n,i+1)):[]}const w=e=>/^(part|group|shape):/.test(e),$=e=>e.slice(e.indexOf(":")+1);function k(e,t){const i=$(t);return t.startsWith("part:")?!!e?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e?.groups?.some(e=>e.id===i):t.startsWith("shape:")?!!e?.shapes?.some(e=>e.id===i):["element","icon","name","state","background"].includes(t)}function M(e,t,i){const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s<0&&n.length>=24)return;const r=s>=0?{...n[s],keyframes:i}:{target:t,keyframes:i};return s>=0?n[s]=r:n.push(r),{...e,tracks:n}}function S(e,t,i,r){if(!(i&&r&&e.rig&&w(t)))return e;const a=function(e,t,i){const r=e.rig,a=$(t);if(t.startsWith("shape:")){const e=r?.shapes?.find(e=>e.id===a);return e?(0,n.hd)(e.d):void 0}const o=t.startsWith("group:")?r?.groups?.find(e=>e.id===a)?.parts??[]:[a];return(0,s.jo)(i,o.flatMap(e=>r?.parts.find(t=>t.id===e)?.from??[]))}(e,t,r);if(!a)return e;const[o,l]=(0,s.dI)(a,i),c=`${o}px ${l}px`;return{...e,tracks:(e.tracks??[]).map(e=>e.target===t?{...e,origin:c}:e)}}function j(e,t,i,n){const s=v.get("wave").pivot;return function(e,t){const i=b("wave",e),n=i.delay,s=Math.max(1,Math.min(i.share,100-n)),r=t>1?.6*s:s,a=t>1?(s-r)/(t-1):0;return Array.from({length:t},(e,t)=>[n+t*a,n+t*a+r])}(i,t.length).reduce((e,[r,a],o)=>{const l=M(e,t[o],_("wave",i,r,a));return l?S(l,t[o],s,n.pieces):e},e)}function C(e,t,i,n,s={}){if(t.length<2||"wave"!==i)return t.reduce((e,t)=>function(e,t,i,n,s={}){const r=v.get(i);if(!r||"keyframes"!==e.kind||!k(e.rig,t))return e;if(r.draws&&!w(t))return e;const a=b(i,n);if("wave"===i&&t.startsWith("group:")){let i=e.rig?.groups?.find(e=>e.id===$(t))?.parts??[];a.direction<0&&(i=[...i].reverse());const n={...e,tracks:(e.tracks??[]).filter(e=>e.target!==t)};return n.tracks.length||delete n.tracks,j(n,i.map(e=>`part:${e}`),a,s)}const o=M(e,t,x(i,a));return o?S(o,t,r.pivot,s.pieces):e}(e,t,i,n,s),e);const r=b(i,n),a=(r.direction<0?[...t].reverse():t).filter(t=>k(e.rig,t));return j(e,a,r,s)}function A(e,t){const i=(e.tracks??[]).flatMap(e=>e.target!==t?[e]:e.path?[{...e,keyframes:[]}]:[]),n={...e,tracks:i};return i.length||delete n.tracks,n}i.d(t,["tP",0,f])},1771(e,t,i){i.d(t,{Bq:()=>v,ER:()=>x,Rr:()=>p,fs:()=>f,uD:()=>m});const n=1e-6,s=(e,t)=>Math.abs(e[0]-t[0])<n&&Math.abs(e[1]-t[1])<n,r=(e,t,i)=>e+(t-e)*i,a=(e,t,i)=>[r(e[0],t[0],i),r(e[1],t[1],i)],o=(e,t,i)=>({c1:[e[0]+2/3*(t[0]-e[0]),e[1]+2/3*(t[1]-e[1])],c2:[i[0]+2/3*(t[0]-i[0]),i[1]+2/3*(t[1]-i[1])],to:i}),l=/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;class c{constructor(e){this.d=e,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const e=this.d[this.i];if(e&&/[MmLlHhVvCcSsQqTtAaZz]/.test(e))return this.i++,e}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip(),l.lastIndex=this.i;const e=l.exec(this.d);if(!e)throw new Error(`Bad path number at ${this.i}`);return this.i+=e[0].length,Number(e[0])}flag(){this.skip();const e=this.d[this.i];if("0"!==e&&"1"!==e)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===e?1:0}}function d(e,t,i,r,a,o,l){if(s(e,l))return[];if(t=Math.abs(t),i=Math.abs(i),t<n||i<n)return[{to:l}];const c=r*Math.PI/180,d=Math.cos(c),p=Math.sin(c),h=(e[0]-l[0])/2,u=(e[1]-l[1])/2,m=d*h+p*u,g=-p*h+d*u,f=m*m/(t*t)+g*g/(i*i);if(f>1){const e=Math.sqrt(f);t*=e,i*=e}const v=t*t*i*i-t*t*g*g-i*i*m*m,b=t*t*g*g+i*i*m*m;let y=Math.sqrt(Math.max(0,v/b));a===o&&(y=-y);const x=y*t*g/i,_=-y*i*m/t,w=d*x-p*_+(e[0]+l[0])/2,$=p*x+d*_+(e[1]+l[1])/2,k=(e,t,i,n)=>Math.atan2(e*n-t*i,e*i+t*n),M=(m-x)/t,S=(g-_)/i,j=(-m-x)/t,C=(-g-_)/i,A=k(1,0,M,S);let z=k(M,S,j,C);!o&&z>0?z-=2*Math.PI:o&&z<0&&(z+=2*Math.PI);const q=Math.max(1,Math.ceil(Math.abs(z)/(Math.PI/2)-1e-9)),E=z/q,H=4/3*Math.tan(E/4),L=e=>[w+t*Math.cos(e)*d-i*Math.sin(e)*p,$+t*Math.cos(e)*p+i*Math.sin(e)*d],V=e=>[-t*Math.sin(e)*d-i*Math.cos(e)*p,-t*Math.sin(e)*p+i*Math.cos(e)*d],O=[];let P=e;for(let e=0;e<q;e++){const t=A+e*E,i=t+E,n=e===q-1?l:L(i),s=V(t),r=V(i);O.push({c1:[P[0]+H*s[0],P[1]+H*s[1]],c2:[n[0]-H*r[0],n[1]-H*r[1]],to:n}),P=n}return O}function p(e){const t=new c(e),i=[];let n,r,a,l,p=[0,0],h=[0,0];const u=e=>{n||(n={start:p,segs:[],closed:!1},i.push(n),h=p),n.segs.push(e)};try{for(;!t.done();){const e=t.command();if(e)l=e;else{if(!l||!t.hasNumber())break;"M"===l?l="L":"m"===l&&(l="l")}const i=l===l.toLowerCase(),c=i?p[0]:0,m=i?p[1]:0,g=()=>[t.number()+c,t.number()+m];let f,v,b;switch(l.toUpperCase()){case"M":p=g(),h=p,n=void 0;break;case"L":u({to:b=g()});break;case"H":u({to:b=[t.number()+c,p[1]]});break;case"V":u({to:b=[p[0],t.number()+m]});break;case"C":{const e=g();f=g(),u({c1:e,c2:f,to:b=g()});break}case"S":{const e=r?[2*p[0]-r[0],2*p[1]-r[1]]:p;f=g(),u({c1:e,c2:f,to:b=g()});break}case"Q":v=g(),u(o(p,v,b=g()));break;case"T":v=a?[2*p[0]-a[0],2*p[1]-a[1]]:p,u(o(p,v,b=g()));break;case"A":{const e=t.number(),i=t.number(),n=t.number(),s=t.flag(),r=t.flag();b=g(),d(p,e,i,n,s,r,b).forEach(u);break}case"Z":n&&n.segs.length&&(s(p,h)||n.segs.push({to:h}),n.closed=!0),p=h,n=void 0,l=void 0}b&&(p=b),r=f,a=v}}catch{}return i.filter(e=>e.segs.length>0)}const h=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},u=e=>`${h(e[0])} ${h(e[1])}`;function m(e){return e.map(e=>{const t=e.segs.slice(),i=t[t.length-1];return e.closed&&i&&!i.c1&&s(i.to,e.start)&&t.length>1&&t.pop(),[`M${u(e.start)}`,...t.map(e=>e.c1&&e.c2?`C${u(e.c1)} ${u(e.c2)} ${u(e.to)}`:`L${u(e.to)}`),...e.closed?["Z"]:[]].join(" ")}).join(" ")}function g(e,t,i){const n=1-i;return t.c1&&t.c2?[n*n*n*e[0]+3*n*n*i*t.c1[0]+3*n*i*i*t.c2[0]+i*i*i*t.to[0],n*n*n*e[1]+3*n*n*i*t.c1[1]+3*n*i*i*t.c2[1]+i*i*i*t.to[1]]:[e[0]+(t.to[0]-e[0])*i,e[1]+(t.to[1]-e[1])*i]}function f(e,t){const[i,n,s,r]=e,o=a(i,n,t),l=a(n,s,t),c=a(s,r,t),d=a(o,l,t),p=a(l,c,t),h=a(d,p,t);return[[i,o,d,h],[h,p,c,r]]}function v(e,t=12){const i=[e.start];let n=e.start;for(const s of e.segs){if(s.c1)for(let e=1;e<t;e++)i.push(g(n,s,e/t));i.push(s.to),n=s.to}return i.length>1&&s(i[i.length-1],e.start)&&i.pop(),i}const b=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1]),y=e=>{const t=Math.round(1e3*e)/1e3;return String(Object.is(t,-0)?0:t)};function x(e){return e.map(e=>{if(!e.length)return"";const t=e=>`${y(e[0])} ${y(e[1])}`,i=e.map(e=>`C${t(e[1])} ${t(e[2])} ${t(e[3])}`).join("");return`M${t(e[0][0])}${i}${(e=>e.length>1&&s(e[0][0],e[e.length-1][3]))(e)?"Z":""}`}).join("")}i.d(t,["Mj",0,e=>p(e).map(e=>{let t=e.start;return e.segs.map(e=>{const i=((e,t)=>t.c1&&t.c2?[e,t.c1,t.c2,t.to]:((e,t)=>[e,a(e,t,1/3),a(e,t,2/3),t])(e,t.to))(t,e);return t=e.to,i})}),"Mo",0,(e,t)=>{const i=1-t;return[i*i*i*e[0][0]+3*i*i*t*e[1][0]+3*i*t*t*e[2][0]+t*t*t*e[3][0],i*i*i*e[0][1]+3*i*i*t*e[1][1]+3*i*t*t*e[2][1]+t*t*t*e[3][1]]},"Wv",0,(e,t,i)=>{const n=i[0]-t[0],s=i[1]-t[1],r=n*n+s*s;if(r<1e-9)return b(e,t);const a=Math.max(0,Math.min(1,((e[0]-t[0])*n+(e[1]-t[1])*s)/r));return b(e,[t[0]+n*a,t[1]+s*a])},"xg",0,b])},8164(e,t,i){i.r(t),i.d(t,{append:()=>w,bounds:()=>H,fmtNum:()=>p,fromEdit:()=>f,insertAt:()=>_,isSmooth:()=>v,moveAnchor:()=>k,nearestOnPath:()=>y,remove:()=>$,reverse:()=>z,segment:()=>g,segmentCount:()=>m,setClosed:()=>q,setHandle:()=>M,setKind:()=>S,smoothAll:()=>C,toEdit:()=>u,toggleSmooth:()=>A,transform:()=>E});var n=i(1771);const s=1e-4,r=(e,t,i=s)=>Math.abs(e[0]-t[0])<i&&Math.abs(e[1]-t[1])<i,a=(e,t,i)=>[e[0]+(t[0]-e[0])*i,e[1]+(t[1]-e[1])*i],o=e=>[e.x,e.y],l=e=>e?[e[0],e[1]]:void 0,c=e=>{const t={x:e.x,y:e.y,in:l(e.in),out:l(e.out)};return e.kind&&(t.kind=e.kind),t},d=e=>({anchors:e.anchors.map(c),closed:e.closed});function p(e){const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)}const h=e=>{const t=Math.max(s,.001*Math.hypot(e[3][0]-e[0][0],e[3][1]-e[0][1]));return r(e[1],a(e[0],e[3],1/3),t)&&r(e[2],a(e[0],e[3],2/3),t)};function u(e){const t=[{x:e.start[0],y:e.start[1]}];let i=e.start;for(const n of e.segs){const e=t[t.length-1],s={x:n.to[0],y:n.to[1]};n.c1&&n.c2&&!h([i,n.c1,n.c2,n.to])&&(r(n.c1,i)||(e.out=[n.c1[0],n.c1[1]]),r(n.c2,n.to)||(s.in=[n.c2[0],n.c2[1]])),t.push(s),i=n.to}const n=e.closed&&e.segs.length>0;if(n&&t.length>1){const e=t.pop();t[0].in=e.in}return{anchors:t,closed:n&&t.length>1}}function m(e){const t=e.anchors.length;return t<2?0:e.closed?t:t-1}function g(e,t){const i=e.anchors[t],n=e.anchors[(t+1)%e.anchors.length];return[o(i),i.out??o(i),n.in??o(n),o(n)]}function f(e){const t=e.anchors[0],i=Array.from({length:m(e)},(t,i)=>{const n=g(e,i);return((e,t)=>!e.anchors[t].out&&!e.anchors[(t+1)%e.anchors.length].in)(e,i)?{to:n[3]}:{c1:n[1],c2:n[2],to:n[3]}});return{start:t?o(t):[0,0],segs:i,closed:e.closed&&e.anchors.length>1}}function v(e){if(!e.in||!e.out)return!1;const t=e.in[0]-e.x,i=e.in[1]-e.y,n=e.out[0]-e.x,r=e.out[1]-e.y,a=Math.hypot(t,i),o=Math.hypot(n,r);return!(a<s||o<s)&&-(t*n+i*r)/(a*o)>.9995}const b=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,r=3*i*t*t,a=t*t*t;return[n*e[0][0]+s*e[1][0]+r*e[2][0]+a*e[3][0],n*e[0][1]+s*e[1][1]+r*e[2][1]+a*e[3][1]]};function y(e,t,i=[1,1]){const n=m(e);if(!n)return;const s=e=>Math.hypot((e[0]-t[0])*i[0],(e[1]-t[1])*i[1]);let r;for(let t=0;t<n;t++){const i=g(e,t),n=32;let a=0,o=1/0;for(let e=0;e<=n;e++){const t=s(b(i,e/n));t<o&&(o=t,a=e/n)}let l=1/n;for(let e=0;e<12;e++){l/=2;for(const e of[a-l,a+l]){if(e<0||e>1)continue;const t=s(b(i,e));t<o&&(o=t,a=e)}}(!r||o<r.dist)&&(r={seg:t,t:a,point:b(i,a),dist:o})}return r}const x=e=>e.anchors.length<100;function _(e,t,i){const s=d(e),l=s.anchors.length;if(t<0||t>=m(s)||!x(s))return{path:s,index:-1};const c=s.anchors[t],p=s.anchors[(t+1)%l],h=Math.min(1,Math.max(0,i));if(!c.out&&!p.in){const e=a(o(c),o(p),h);return s.anchors.splice(t+1,0,{x:e[0],y:e[1]}),{path:s,index:t+1}}const[u,f]=(0,n.fs)(g(s,t),h);c.out=r(u[1],u[0])?void 0:u[1],p.in=r(f[2],f[3])?void 0:f[2];const v={x:u[3][0],y:u[3][1],in:r(u[2],u[3])?void 0:u[2],out:r(f[1],f[0])?void 0:f[1]};return s.anchors.splice(t+1,0,v),{path:s,index:t+1}}function w(e,t,i=!1){const n=d(e);if(!x(n))return{path:n,index:-1};const s={x:t[0],y:t[1]};return i?(n.anchors.unshift(s),{path:n,index:0}):(n.anchors.push(s),{path:n,index:n.anchors.length-1})}function $(e,t){const i=d(e);return t<0||t>=i.anchors.length||(i.anchors.splice(t,1),i.anchors.length<2&&(i.closed=!1)),i}function k(e,t,i,n){const s=d(e),r=s.anchors[t];if(!r)return s;const a=i-r.x,o=n-r.y;return r.x=i,r.y=n,r.in&&(r.in=[r.in[0]+a,r.in[1]+o]),r.out&&(r.out=[r.out[0]+a,r.out[1]+o]),s}function M(e,t,i,n,s){const a=d(e),l=a.anchors[t];if(!l)return a;const c=s??(e=>e.kind??(v(e)?"smooth":"corner"))(l),p=r(n,o(l))?void 0:[n[0],n[1]];l[i]=p;const h="in"===i?"out":"in";if("symmetric"===c)l[h]=p?[2*l.x-p[0],2*l.y-p[1]]:void 0;else if("smooth"===c&&p&&l[h]){const e=Math.hypot(l[h][0]-l.x,l[h][1]-l.y),t=Math.hypot(l.x-p[0],l.y-p[1]);l[h]=[l.x+(l.x-p[0])/t*e,l.y+(l.y-p[1])/t*e]}return a}function S(e,t,i){const n=d(e),s=n.anchors[t];return s?(s.kind=i,"corner"!==i&&s.in&&s.out?M(n,t,"in",s.in,i):n):n}function j(e,t,i){const n=t.anchors[i],r=function(e,t){const i=e.anchors.length;if(i<2)return;const n=e.anchors[t],r=t>0?e.anchors[t-1]:e.closed?e.anchors[i-1]:n,a=t<i-1?e.anchors[t+1]:e.closed?e.anchors[0]:n,o=(a.x-r.x)/6,l=(a.y-r.y)/6;return Math.hypot(o,l)<s?void 0:[o,l]}(e,i);r&&(n.in=e.closed||i>0?[n.x-r[0],n.y-r[1]]:void 0,n.out=e.closed||i<e.anchors.length-1?[n.x+r[0],n.y+r[1]]:void 0)}function C(e){const t=d(e);for(let i=0;i<t.anchors.length;i++)j(e,t,i);return t}function A(e,t){const i=d(e),n=i.anchors[t];return n?(n.in||n.out?(n.in=void 0,n.out=void 0):j(e,i,t),i):i}function z(e){const t=e.anchors.map(e=>{const t={x:e.x,y:e.y,in:l(e.out),out:l(e.in)};return e.kind&&(t.kind=e.kind),t}).reverse();return e.closed&&t.length&&t.unshift(t.pop()),{anchors:t,closed:e.closed}}function q(e,t){const i=d(e);return i.closed=t&&i.anchors.length>1,!i.closed&&i.anchors.length&&(i.anchors[0].in=void 0,i.anchors[i.anchors.length-1].out=void 0),i}function E(e,t){const i=(e,i)=>[t[0]*e+t[2]*i+t[4],t[1]*e+t[3]*i+t[5]],n=e=>e?i(e[0],e[1]):void 0;return{anchors:e.anchors.map(e=>{const[t,s]=i(e.x,e.y),r={x:t,y:s,in:n(e.in),out:n(e.out)};return e.kind&&(r.kind=e.kind),r}),closed:e.closed}}function H(e){const t=[];for(const i of e.anchors)t.push(o(i)),i.in&&t.push(i.in),i.out&&t.push(i.out);if(!t.length)return;const i=t.map(e=>e[0]),n=t.map(e=>e[1]),s=Math.min(...i),r=Math.min(...n);return{x:s,y:r,w:Math.max(...i)-s,h:Math.max(...n)-r}}i.d(t,["MAX_ANCHORS",0,100,"canAdd",0,x,"copyAnchor",0,c,"copyPath",0,d,"serialize",0,e=>e.anchors.length?(0,n.uD)([f(e)]):"","snap",0,(e,t)=>t>0?Math.round(e/t)*t:e,"straightenAll",0,e=>({anchors:e.anchors.map(e=>({x:e.x,y:e.y})),closed:e.closed}),"translate",0,(e,t,i)=>E(e,[1,0,0,1,t,i])])},3910(e,t,i){i.d(t,{I:()=>o,M7:()=>l,dp:()=>c,wn:()=>a});const n=/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i,s=e=>32===e||e>=9&&e<=13||160===e||5760===e||e>=8192&&e<=8202||8232===e||8233===e||8239===e||8287===e||12288===e||65279===e,r=e=>e>=65&&e<=90||e>=97&&e<=122;function a(e,t){for(let i=e.indexOf("(");i>=0;i=e.indexOf("(",i+1)){let n=i;for(;n>0&&s(e.charCodeAt(n-1));)n--;let a=n;for(;a>0&&(r(e.charCodeAt(a-1))||45===e.charCodeAt(a-1));)a--;if(a===n||!t.includes(e.slice(a,n).toLowerCase()))return!1}return!0}function o(e,t){return Object.prototype.hasOwnProperty.call(e.kinds,t)?e.kinds[t]:e.fallback}function l(e,t,i){if(void 0!==i.maxValueChars&&t.length>i.maxValueChars)return;const s=t.trim();if(!function(e,t){if(n.test(e))return!0;if(!t.denyExtra.length)return!1;const i=e.toLowerCase();return t.denyExtra.some(e=>i.includes(e))}(s,i)){if("transform"===e)return a(s,i.transformFunctions)?t:void 0;if(a(s.replace(/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,""),i.colourFunctions))return"id"===e?/^[\w.:-]+$/.test(s)?s:void 0:"class"===e?function(e,t){const i=e.split(/\s+/).filter(e=>t.test(e));return i.length?i.join(" "):void 0}(s,/^[\w-]+$/):t}}function c(e){return"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length}const d=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");i.d(t,["X1",0,d,"dc",0,e=>d(e).replace(/"/g,"&quot;")])},2637(e,t,i){i.d(t,{WP:()=>p,Zg:()=>h,hd:()=>u});var n=i(1771);function s(e){const t=e.length?[e[0][0]]:[];for(const[i,n,s,r]of e)for(let e=1;e<=8;e++){const a=e/8,o=1-a,l=o*o*o,c=3*o*o*a,d=3*o*a*a,p=a*a*a;t.push([l*i[0]+c*n[0]+d*s[0]+p*r[0],l*i[1]+c*n[1]+d*s[1]+p*r[1]])}return t}function r(e){let t=0;for(let i=0;i<e.length;i++){const[n,s]=e[i],[r,a]=e[(i+1)%e.length];t+=n*a-r*s}return t/2}function a(e){if(!e.length)return[0,0,0,0];let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const[r,a]of e)r<t&&(t=r),a<i&&(i=a),r>n&&(n=r),a>s&&(s=a);const r=e=>+e.toFixed(3);return[r(t),r(i),r(n-t),r(s-i)]}function o(e,t){let i=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const[r,a]=t[n],[o,l]=t[s];a>e[1]!=l>e[1]&&e[0]<(o-r)*(e[1]-a)/(l-a)+r&&(i=!i)}return i}function l(e,t){if(!((e,t,i=.001)=>e[0]>=t[0]-i&&e[1]>=t[1]-i&&e[0]+e[2]<=t[0]+t[2]+i&&e[1]+e[3]<=t[1]+t[3]+i)(t.box,e.box))return!1;const i=t.poly,n=Math.max(1,Math.floor(i.length/16));let s=0,r=0;for(let t=0;t<i.length;t+=n)s++,o(i[t],e.poly)&&r++;return s>0&&r/s>=.6}const c=1e-6,d=(e,t)=>({index:e,d:(0,n.ER)(t),bbox:a(t.flatMap(s))});function p(e){const t=[],i=e=>t.push({...e,index:t.length}),o=(t,i)=>!!e.evenodd?.[t]?.includes(i),p=e=>e?{evenodd:!0}:{},h=e=>(0,n.Mj)(e).filter(e=>Math.abs(r(s(e)))>c);if((e.secondary??[]).forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),secondary:!0,...p(o("accent",t))})}),1===e.paths.length){const t=o("paths",0);for(const o of function(e,t=!1){const i=(0,n.Mj)(e).map(e=>{const t=s(e);return{cubics:e,poly:t,area:r(t),box:a(t)}}).filter(e=>Math.abs(e.area)>c),o=i.map((e,t)=>t),d=i.map((e,t)=>t).sort((e,t)=>Math.abs(i[t].area)-Math.abs(i[e].area)||e-t);d.forEach((e,n)=>{let s=-1,r=0,a=0;for(let t=0;t<n;t++){const n=d[t];Math.abs(i[n].area)<=Math.abs(i[e].area)||l(i[n],i[e])&&(r+=Math.sign(i[n].area),a++,(s<0||Math.abs(i[n].area)<Math.abs(i[s].area))&&(s=n))}const c=t?a%2==1:0!==r&&r+Math.sign(i[e].area)===0;s>=0&&c&&(o[e]=o[s])});const p=new Map;return o.forEach((e,t)=>{const i=p.get(e);i?i.push(t):p.set(e,[t])}),[...p.values()].sort((e,t)=>e[0]-t[0]).map(e=>e.map(e=>i[e].cubics))}(e.paths[0],t))i({...d(0,o),...p(t)})}else e.paths.forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),...p(o("paths",t))})});for(const t of e.strokes??[]){const e=(0,n.Mj)(t.d);e.length&&i({...d(0,e),stroke:{width:t.width,...t.cap?{cap:t.cap}:{},...t.join?{join:t.join}:{}},...t.accent?{secondary:!0}:{}})}return t}function h(e){if(!e.length)return;const t=Math.min(...e.map(e=>e[0])),i=Math.min(...e.map(e=>e[1])),n=Math.max(...e.map(e=>e[0]+e[2])),s=Math.max(...e.map(e=>e[1]+e[3])),r=e=>+e.toFixed(3);return[r(t),r(i),r(n-t),r(s-i)]}function u(e){return a((0,n.Mj)(e).flatMap(s))}},2231(e,t,i){i.d(t,{t:()=>s});const n="2026.10.12-beta.17";function s(e,t){if(t?.BUILD===n)return t;console.warn(`Magic Card was updated, reload the page (magic-card.js ${n}, ${e} ${String(t?.BUILD)}).`)}i.d(t,["Q",0,n])},796(e,t,i){i.d(t,{ZV:()=>s});var n=i(1699);function s(e,t,i=1){const s={maximumFractionDigits:i};let r;"none"===e?.locale?.number_format&&(s.useGrouping=!1);try{r=new Intl.NumberFormat(function(e){switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return function(e){return e?.locale?.language||e?.language||void 0}(e)}}(e),s).format(t)}catch{r=String(t)}return(0,n.C1)(r,"num")}},3826(e,t,i){const n=globalThis,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),a=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new o("string"==typeof e?e:e+"",void 0,r),c=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return l(t)})(e):e;i.d(t,["AH",0,(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,r)},"Rf",0,(e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=n.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}},"iz",0,l,"sk",0,c])},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>a});var n=i(8760);const s={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},r=(e=s,t,i)=>{const{kind:n,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function a(e){return(t,i)=>"object"==typeof i?r(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>s});var n=i(5694);function s(e){return(0,n.M)({...e,state:!0,attribute:!1})}},8760(e,t,i){i.d(t,{AH:()=>n.AH,iz:()=>n.iz,mN:()=>v});var n=i(3826);const{is:s,defineProperty:r,getOwnPropertyDescriptor:a,getOwnPropertyNames:o,getOwnPropertySymbols:l,getPrototypeOf:c}=Object,d=globalThis,p=d.trustedTypes,h=p?p.emptyScript:"",u=d.reactiveElementPolyfillSupport,m={toAttribute(e,t){switch(t){case Boolean:e=e?h:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},g=(e,t)=>!s(e,t),f={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=Symbol("metadata"),d.litPropertyMetadata??=new WeakMap;class v extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=f){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&r(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=a(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const r=n?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??f}static _$Ei(){if(this.hasOwnProperty("elementProperties"))return;const e=c(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty("finalized"))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty("properties")){const e=this.properties,t=[...o(e),...l(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift((0,n.sk)(e))}else void 0!==e&&t.push((0,n.sk)(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return(0,n.Rf)(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:m).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:m;this._$Em=n;const r=s.fromAttribute(t,e.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const r=this.constructor;if(!1===n&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??g)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}v.elementStyles=[],v.shadowRootOptions={mode:"open"},v.elementProperties=new Map,v.finalized=new Map,u?.({ReactiveElement:v}),(d.reactiveElementVersions??=[]).push("2.1.2"),i.d(t,["Ec",0,g,"W3",0,m])},5228(e,t,i){i.d(t,{AH:()=>n.AH,JW:()=>s.JW,WF:()=>a,iz:()=>n.iz,qy:()=>s.qy,s6:()=>s.s6});var n=i(8760),s=i(6752);const r=globalThis;class a extends n.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,s.XX)(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return s.c0}}a._$litElement$=!0,a.finalized=!0,r.litElementHydrateSupport?.({LitElement:a});const o=r.litElementPolyfillSupport;o?.({LitElement:a}),(r.litElementVersions??=[]).push("4.2.2")},7804(e,t,i){i.d(t,{WL:()=>n});class n{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}i.d(t,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,e=>(...t)=>({_$litDirective$:e,values:t})])},6752(e,t,i){const n=globalThis,s=e=>e,r=n.trustedTypes,a=r?r.createPolicy("lit-html",{createHTML:e=>e}):void 0,o="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,c="?"+l,d=`<${c}>`,p=document,h=()=>p.createComment(""),u=e=>null===e||"object"!=typeof e&&"function"!=typeof e,m=Array.isArray,g=e=>m(e)||"function"==typeof e?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,b=/-->/g,y=/>/g,x=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),_=/'/g,w=/"/g,$=/^(?:script|style|textarea|title)$/i,k=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),M=k(1),S=k(2),j=k(3),C=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),z=new WeakMap,q=p.createTreeWalker(p,129);function E(e,t){if(!m(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==a?a.createHTML(t):t}const H=(e,t)=>{const i=e.length-1,n=[];let s,r=2===t?"<svg>":3===t?"<math>":"",a=v;for(let t=0;t<i;t++){const i=e[t];let c,p,h=-1,u=0;for(;u<i.length&&(a.lastIndex=u,p=a.exec(i),null!==p);)u=a.lastIndex,a===v?"!--"===p[1]?a=b:void 0!==p[1]?a=y:void 0!==p[2]?($.test(p[2])&&(s=RegExp("</"+p[2],"g")),a=x):void 0!==p[3]&&(a=x):a===x?">"===p[0]?(a=s??v,h=-1):void 0===p[1]?h=-2:(h=a.lastIndex-p[2].length,c=p[1],a=void 0===p[3]?x:'"'===p[3]?w:_):a===w||a===_?a=x:a===b||a===y?a=v:(a=x,s=void 0);const m=a===x&&e[t+1].startsWith("/>")?" ":"";r+=a===v?i+d:h>=0?(n.push(c),i.slice(0,h)+o+i.slice(h)+l+m):i+l+(-2===h?t:m)}return[E(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class L{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,a=0;const d=e.length-1,p=this.parts,[u,m]=H(e,t);if(this.el=L.createElement(u,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=q.nextNode())&&p.length<d;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(o)){const t=m[a++],i=n.getAttribute(e).split(l),r=/([.?@])?(.*)/.exec(t);p.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?N:"?"===r[1]?D:"@"===r[1]?T:R}),n.removeAttribute(e)}else e.startsWith(l)&&(p.push({type:6,index:s}),n.removeAttribute(e));if($.test(n.tagName)){const e=n.textContent.split(l),t=e.length-1;if(t>0){n.textContent=r?r.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],h()),q.nextNode(),p.push({type:2,index:++s});n.append(e[t],h())}}}else if(8===n.nodeType)if(n.data===c)p.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(l,e+1));)p.push({type:7,index:s}),e+=l.length-1}s++}}static createElement(e,t){const i=p.createElement("template");return i.innerHTML=e,i}}function V(e,t,i=e,n){if(t===C)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=u(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=V(e,s._$AS(e,t.values),s,n)),t}class O{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??p).importNode(t,!0);q.currentNode=n;let s=q.nextNode(),r=0,a=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new P(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new F(s,this,e)),this._$AV.push(t),o=i[++a]}r!==o?.index&&(s=q.nextNode(),r++)}return q.currentNode=p,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class P{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),u(e)?e===A||null==e||""===e?(this._$AH!==A&&this._$AR(),this._$AH=A):e!==this._$AH&&e!==C&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):g(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==A&&u(this._$AH)?this._$AA.nextSibling.data=e:this.T(p.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=L.createElement(E(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new O(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=z.get(e.strings);return void 0===t&&z.set(e.strings,t=new L(e)),t}k(e){m(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new P(this.O(h()),this.O(h()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=s(e).nextSibling;s(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class R{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=A,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=A}_$AI(e,t=this,i,n){const s=this.strings;let r=!1;if(void 0===s)e=V(this,e,t,0),r=!u(e)||e!==this._$AH&&e!==C,r&&(this._$AH=e);else{const n=e;let a,o;for(e=s[0],a=0;a<s.length-1;a++)o=V(this,n[i+a],t,a),o===C&&(o=this._$AH[a]),r||=!u(o)||o!==this._$AH[a],o===A?e=A:e!==A&&(e+=(o??"")+s[a+1]),this._$AH[a]=o}r&&!n&&this.j(e)}j(e){e===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class N extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===A?void 0:e}}class D extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==A)}}class T extends R{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=V(this,e,t,0)??A)===C)return;const i=this._$AH,n=e===A&&i!==A||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==A&&(i===A||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class F{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}}const B={M:o,P:l,A:c,C:1,L:H,R:O,D:g,V,I:P,H:R,N:D,U:T,B:N,F},I=n.litHtmlPolyfillSupport;I?.(L,P),(n.litHtmlVersions??=[]).push("3.3.3"),i.d(t,["JW",0,S,"XX",0,(e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new P(t.insertBefore(h(),e),e,void 0,i??{})}return s._$AI(e),s},"c0",0,C,"ej",0,j,"ge",0,B,"qy",0,M,"s6",0,A])},5707(e,t,i){i.d(t,{EM:()=>n.E,MZ:()=>s.M,wk:()=>r.w});var n=i(6505),s=i(5694),r=i(4290)},6161(e,t,i){i.d(t,{AH:()=>n.AH,JW:()=>n.JW,WF:()=>n.WF,iz:()=>n.iz,qy:()=>n.qy,s6:()=>n.s6}),i(8760),i(6752);var n=i(5228)}};const t={};function i(n){const s=t[n];if(void 0!==s)return s.exports;const r=t[n]={exports:{}};return e[n](r,r.exports,i),r.exports}if(i.m=e,i.d=(e,t)=>{if(Array.isArray(t))for(var n=0;n<t.length;){var s=t[n++],r=t[n++],a=0===r?{enumerable:!0,value:t[n++]}:{enumerable:!0,get:r};i.o(e,s)||Object.defineProperty(e,s,a)}else for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.f={},i.e=e=>{const t=[];return i.f.j(e,t),Promise.all(t)},i.u=e=>"magic-card-"+{249:"i18n-labels",278:"i18n-pseudo",334:"icon-library",342:"i18n-icons",417:"svg-css",494:"preset-catalogue",575:"path-canvas",626:"icon-shared"}[e]+"."+{249:"2fdda151",278:"264fd6dc",334:"c51d9342",342:"e7b24946",417:"6598a98d",494:"a488cdf7",575:"440f0962",626:"ab1b2683"}[e]+".js",i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.j=885,i.p="",(()=>{const e={126:0,626:0,885:0},t=t=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:s,__webpack_esm_runtime__:r}=t;var a,o,l=0;for(a in s)i.o(s,a)&&(i.m[a]=s[a]);for(r&&r(i);l<n.length;l++)o=n[l],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0};i.f.j=(n,s)=>{let r=i.o(e,n)?e[n]:void 0;if(0!==r)if(r)s.push(r[1]);else{let a=import(i.p+i.u(n)).then(t,t=>{throw 0!==e[n]&&(e[n]=void 0),t});a=Promise.race([a,new Promise(t=>r=e[n]=[t])]),s.push(r[1]=a)}}})(),"undefined"!=typeof location){const e=function(e,t){try{const i=new URL(e);return i.protocol===t.protocol&&i.host===t.host?new URL(".",i).href:""}catch{return""}}(import.meta.url,location);e&&(i.p=e)}const n="mc-dir-change";var s=i(6161),r=i(5707);const a=s.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,o=s.AH`${a} .menu{position:fixed;inset:auto;z-index:30;margin:0;min-width:240px;max-width:calc(100vw - 16px);padding:4px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2));font-size:.875rem;line-height:1.3}.item{display:flex;flex-wrap:wrap;align-items:center;gap:2px 12px;min-height:var(--mc-hit,40px);padding:0 12px;border-radius:var(--mc-radius,8px);cursor:pointer;outline:none}.item:hover{background:var(--mc-surface-2,#f2f3f5)}.item:focus-visible{background:var(--mc-surface-2,#f2f3f5);outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:-2px}.item.danger{color:var(--mc-error-ink,#b3261e)}.item[aria-disabled='true']{opacity:.6;cursor:default}.item[aria-disabled='true']:hover{background:transparent}.glyph{display:inline-flex;color:var(--mc-text-2,#5f6368)}.label{flex:1}.item:has(.sub-line){padding-block:6px}.sub-line{flex-basis:100%;font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys,.why{font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys{font-family:var(--mc-mono,ui-monospace,monospace)}.why{display:none;flex-basis:100%}.item:focus .why{display:block}.sep{height:1px;margin:4px 0;background:var(--mc-divider,rgba(0,0,0,.12))}@media (pointer:coarse){.item{min-height:var(--mc-hit,44px)}.keys{display:none}}`,l=s.AH`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`,c=s.AH`${a}${l}`,d=s.AH`${a} .panel{position:fixed;inset:auto;z-index:30;margin:0;max-width:min(360px,calc(100vw - 16px));padding:12px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2))}`,p={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},h={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},u=e=>Object.prototype.hasOwnProperty.call(h,e),m=["left","right","back","arrowLeft","arrowRight","chevronRight","undo","redo"],g=Object.fromEntries([...Object.keys(p),...Object.keys(h)].map(e=>[e,m.includes(e)?"mirror":"keep"])),f=(e,t=20)=>{const i="mirror"===g[e]?"mirror":s.s6;return u(e)?s.qy`<svg class="gl" data-dir=${i} viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${h[e]} fill="currentColor"></path></svg>`:s.qy`<svg class="gl" data-dir=${i} viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${p[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`},v=e=>Object.prototype.hasOwnProperty.call(p,e)||u(e);function b(e){let t=e;for(;t;){const e=t.getAttribute("dir")?.toLowerCase();if("rtl"===e||"ltr"===e)return e;t=t.parentElement??t.getRootNode().host??null}try{return"rtl"===getComputedStyle(document.documentElement).direction?"rtl":"ltr"}catch{return"ltr"}}class y{constructor(e){this.host=e,this.direction="ltr",this.reflected=!1,this.sync=()=>{const e=this.host;if(!this.reflected&&e.hasAttribute("dir"))return void this.set(b(e));this.reflected&&e.removeAttribute("dir");const t=b(e);this.reflected=!1,"rtl"===t&&(e.setAttribute("dir","rtl"),this.reflected=!0),this.set(t)},e.addController(this)}hostConnected(){window.addEventListener(n,this.sync),"function"==typeof MutationObserver&&(this.observer=new MutationObserver(this.sync),this.observer.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]})),this.sync()}hostDisconnected(){window.removeEventListener(n,this.sync),this.observer?.disconnect(),this.observer=void 0,this.reflected&&(this.host.removeAttribute("dir"),this.reflected=!1)}set(e){e!==this.direction&&(this.direction=e,this.host.requestUpdate())}}function x(e,t,i="start"){const n=window.innerWidth||document.documentElement.clientWidth||0,s=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const r=e.offsetWidth,a=e.offsetHeight,o=s-t.bottom-4-8,l=t.top-4-8,c=s>0&&a>o&&l>o,d=c?l:o;s>0&&a>d&&(e.style.maxHeight=`${Math.max(120,d)}px`);const p=Math.min(a,s>0?Math.max(120,d):a),h=c?Math.max(8,t.top-4-p):t.bottom+4;let u=function(e,t,i,n){return"end"===i!==n?e.right-t:e.left}(t,r,i,"rtl"===b(e));return n>0&&(u=Math.min(u,n-r-8)),u=Math.max(8,u),Object.assign(e.style,{top:`${Math.round(h)}px`,left:`${Math.round(u)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=c?"top":"bottom",c?"top":"bottom"}function _(e,t,i=0){const n=e.getBoundingClientRect(),s=(e,t,n)=>{let s=e+i;return s+t>n-8&&(s=e-i-t),Math.max(8,Math.min(s,n-8-t))},r=[s(t[0],n.width,window.innerWidth),s(t[1],n.height,window.innerHeight)];return Object.assign(e.style,{left:`${r[0]}px`,top:`${r[1]}px`,right:"auto",bottom:"auto"}),r}function w(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}var $=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class k extends s.WF{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._dir=new y(this),this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],n=i.indexOf(e.composedPath()[0]),s=this.entries(),r=i.length,a=e=>i[(e+r)%r]?.focus(),o=e.key,l="rtl"===this._dir.direction;let c=!0;if("ArrowDown"===o)a(n+1);else if("ArrowUp"===o)a(n<0?r-1:n-1);else if("Home"===o)a(0);else if("End"===o)a(r-1);else if("Enter"===o||" "===o)this.pick(n,i[n]);else if(o===(l?"ArrowLeft":"ArrowRight"))this._sub<0&&s[n]?.items&&this.openSub(n,i[n]);else if(o===(l?"ArrowRight":"ArrowLeft")||"Escape"===o)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===o&&this.close("escape");else if("Tab"===o)c=!1,this.close("tab");else if(1!==o.length||e.ctrlKey||e.metaKey||e.altKey)c=!1;else{const e=s.map((e,t)=>(n+1+t)%r).find(e=>s[e].label.toLowerCase().startsWith(o.toLowerCase()));void 0!==e&&a(e)}c&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))w(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&(w(e),this.anchor?x(e,this.anchor.getBoundingClientRect(),this.align):_(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){w(e);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect().width,s="rtl"===this._dir.direction?i.left-n>=8:i.right+n+8>window.innerWidth;_(e,["rtl"===this._dir.direction?s?i.left-n:i.right:s?Math.max(8,i.left-n):i.right,i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&v(e.glyph)?s.qy`<span class="glyph">${f(e.glyph,18)}</span>`:e.icon?s.qy`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:s.s6}row(e,t){const i=!!e.items,n=void 0===e.checked?"menuitem":"menuitemcheckbox";return s.qy`${e.separatorBefore?s.qy`<div class="sep" role="separator"></div>`:s.s6}<div class="item ${e.danger?"danger":""}" role=${n} tabindex="-1" aria-checked=${void 0===e.checked?s.s6:String(e.checked)} aria-disabled=${e.reason?"true":s.s6} aria-description=${e.reason??e.sub??s.s6} aria-keyshortcuts=${e.keys??s.s6} aria-haspopup=${i?"menu":s.s6} aria-expanded=${i?String(this._sub===t):s.s6} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?s.qy`<span class="keys">${e.keys}</span>`:s.s6}${i?"rtl"===this._dir.direction?"‹":"›":s.s6}${e.reason?s.qy`<span class="why">${e.reason}</span>`:s.s6}${e.sub?s.qy`<span class="sub-line">${e.sub}</span>`:s.s6}</div>`}render(){if(!this._open)return s.s6;const e=this.items[this._sub];return s.qy`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?s.qy`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:s.s6}`}}k.uiKitRevision=6,k.styles=o,$([(0,r.MZ)({attribute:!1})],k.prototype,"items",void 0),$([(0,r.MZ)()],k.prototype,"label",void 0),$([(0,r.MZ)({attribute:!1})],k.prototype,"at",void 0),$([(0,r.MZ)({attribute:!1})],k.prototype,"anchor",void 0),$([(0,r.MZ)()],k.prototype,"align",void 0),$([(0,r.MZ)({type:Boolean})],k.prototype,"touch",void 0),$([(0,r.MZ)({attribute:!1})],k.prototype,"opener",void 0),$([(0,r.wk)()],k.prototype,"_open",void 0),$([(0,r.wk)()],k.prototype,"_sub",void 0);var M=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class S extends s.WF{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&(w(e),this.anchor&&x(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?s.qy`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:s.s6}}S.uiKitRevision=6,S.styles=d,M([(0,r.MZ)({attribute:!1})],S.prototype,"anchor",void 0),M([(0,r.MZ)()],S.prototype,"label",void 0),M([(0,r.MZ)()],S.prototype,"align",void 0),M([(0,r.wk)()],S.prototype,"_open",void 0);const j=[420,480,640,880];function C(e,t,i){const n=Math.min(Math.max(e.w,320),t-32);return{w:n,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-n),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const A=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});function z(e,t,i,n,s,r){const a=C({...e,w:e.w+(n?-t:t),h:e.h+i},s,r);return{...a,x:n?e.x+e.w-a.w:e.x}}var q=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const E=["centre","end","start"],H='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';class L extends s.WF{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._dir=new y(this),this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=C(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{if("Tab"===e.key)return this._tab(e);"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,n=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,n)<4)return;t.moved=!0,this._dock=0;const s=t.r0;if("move"===t.mode)return this._set({...s,x:s.x+i,y:s.y+n});this._set(z(s,i,n,this._rtl,this._vw(),this._vh()))},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector(H);(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}get _rtl(){return"rtl"===this._dir.direction||"rtl"===getComputedStyle(this).direction}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=C(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_tab(e){if(e.defaultPrevented)return;const t=[],i=e=>{if(e instanceof HTMLElement&&!e.hasAttribute("hidden")){if(e instanceof HTMLSlotElement)return e.assignedNodes({flatten:!0}).forEach(i);e.matches(H)&&t.push(e),(e.shadowRoot??e).childNodes.forEach(i)}};this.renderRoot.childNodes.forEach(i);const n=t.indexOf(e.composedPath()[0]),s=e.shiftKey?0===n?t[t.length-1]:void 0:n===t.length-1?t[0]:void 0;s&&(e.preventDefault(),s.focus({preventScroll:!0}))}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%E.length,this._set(function(e,t,i,n,s){if("centre"===t)return A(e,n,s);const r="end"===t!==i;return{...e,x:r?n-e.w-16:16}}(this._now(),E[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=j.find(t=>t>e.w+1)??j[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=this._now();if(this._dock=0,!i){if("move"===e)return this._set(A(n,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const s=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...n,w:s.w,h:s.h})}if("move"===e)return this._set({...n,x:n.x+i[0],y:n.y+i[1]});this._set(z(n,i[0],i[1],this._rtl,this._vw(),this._vh()))}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return s.s6;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,n=t&&this.resizable&&!this.maximized,r=t&&this.maximizable;return s.qy`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${n?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?s.qy`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${f("grip",20)}</button>`:s.s6}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${r?s.qy`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${f(this.maximized?"restore":"maximize",20)}</button>`:s.s6} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${f("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${n?s.qy`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${f("resizeCorner",20)}</button>`:s.s6}</dialog>`}}L.uiKitRevision=6,L.styles=c,q([(0,r.MZ)()],L.prototype,"heading",void 0),q([(0,r.MZ)()],L.prototype,"closeLabel",void 0),q([(0,r.MZ)()],L.prototype,"variant",void 0),q([(0,r.MZ)({reflect:!0})],L.prototype,"size",void 0),q([(0,r.MZ)()],L.prototype,"initialFocus",void 0),q([(0,r.MZ)({attribute:!1})],L.prototype,"opener",void 0),q([(0,r.MZ)({type:Boolean})],L.prototype,"dismissible",void 0),q([(0,r.MZ)({type:Boolean})],L.prototype,"movable",void 0),q([(0,r.MZ)({type:Boolean})],L.prototype,"resizable",void 0),q([(0,r.MZ)({type:Boolean})],L.prototype,"maximizable",void 0),q([(0,r.MZ)({type:Boolean,reflect:!0})],L.prototype,"maximized",void 0),q([(0,r.MZ)()],L.prototype,"moveLabel",void 0),q([(0,r.MZ)()],L.prototype,"resizeLabel",void 0),q([(0,r.MZ)()],L.prototype,"maximizeLabel",void 0),q([(0,r.MZ)()],L.prototype,"restoreLabel",void 0),q([(0,r.wk)()],L.prototype,"_open",void 0),q([(0,r.wk)()],L.prototype,"_hasFooter",void 0),q([(0,r.wk)()],L.prototype,"_r",void 0),q([(0,r.wk)()],L.prototype,"_compact",void 0),function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<6&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}([["mc-ui-window",L],["mc-ui-menu",k],["mc-ui-popover",S]]);var V=i(6752),O=i(7804);const{I:P}=V.ge,R=e=>void 0===e.strings,N={},D=(0,O.u$)(class extends O.WL{constructor(e){if(super(e),e.type!==O.OA.PROPERTY&&e.type!==O.OA.ATTRIBUTE&&e.type!==O.OA.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!R(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===V.c0||t===V.s6)return t;const i=e.element,n=e.name;if(e.type===O.OA.PROPERTY){if(t===i[n])return V.c0}else if(e.type===O.OA.BOOLEAN_ATTRIBUTE){if(!!t===i.hasAttribute(n))return V.c0}else if(e.type===O.OA.ATTRIBUTE&&i.getAttribute(n)===t+"")return V.c0;return((e,t=N)=>{e._$AH=t})(e),t}}),T=Symbol.for(""),F=e=>{if(e?.r===T)return e?._$litStatic$},B=new Map,I=e=>(t,...i)=>{const n=i.length;let s,r;const a=[],o=[];let l,c=0,d=!1;for(;c<n;){for(l=t[c];c<n&&void 0!==(r=i[c],s=F(r));)l+=s+t[++c],d=!0;c!==n&&o.push(r),a.push(l),c++}if(c===n&&a.push(t[n]),d){const e=a.join("$$lit$$");void 0===(t=B.get(e))&&(a.raw=a,B.set(e,t=a)),i=o}return e(t,...i)},Z=I(V.qy);I(V.JW),I(V.ej);var W=i(4753),K=i(201);const U=e=>e.channels.includes("glow")||e.channels.includes("fx")||!!e.colour,G=[{id:"linear",label:287,css:"linear"},{id:"ease",label:172,css:"ease"},{id:"ease-in",label:173,css:"ease-in"},{id:"ease-out",label:175,css:"ease-out"},{id:"ease-in-out",label:174,css:"ease-in-out"},{id:"spring",label:450,css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:434,css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:435,css:"cubic-bezier(0.7, 0, 0.3, 1)"}],Y=(e,t=1080)=>({label:e,unit:"deg",min:0,max:t}),J=(e,t=100)=>({label:e,unit:"%",min:0,max:t}),X=(e,t=60)=>({label:e,unit:"px",min:0,max:t}),Q=(e=350,t=12)=>({label:e,unit:"",min:1,max:t}),ee=Q();function te(e,t,i){const{direction:n="normal",iterations:s="infinite",...r}=i.extra||{};return{id:e,name:t,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:s,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...r}}const ie={iconKeyframes:!0},ne=[te("breathe",94,{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[J(408,50),4]}),te("glow-pulse",222,{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[X(223),16],extra:ie}),te("halo-ripple",233,{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[X(391),14],extra:ie}),te("aura",34,{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[X(223),24],extra:ie}),te("heartbeat",235,{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[J(408,50),12]}),te("spin",446,{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[Y(398),360]}),te("fast-spin",187,{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[Y(398),360]}),te("sway",472,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[Y(21,90),6]}),te("wobble",557,{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[X(154),6]}),te("shake-alert",418,{group:"Motion",channels:["translate"],duration:2,intensity:[X(154),4]}),te("rumble",406,{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[X(154,10),1]}),te("float",206,{group:"Motion",channels:["translate"],duration:3,intensity:[X(154),6]}),te("flame-flicker",194,{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[J(203,30),5],extra:{origin:"50% 100%",colour:!0}}),te("steam-rise",461,{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[ee,4],extra:{particles:"count"}}),te("bubbles",97,{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[ee,6],extra:{particles:"count"}}),te("snow-fall",437,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[ee,6],extra:{particles:"count"}}),te("rain-fall",375,{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[ee,6],extra:{particles:"count"}}),te("liquid-wave",288,{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[J(188),40],extra:{particles:2}}),te("storm-flash",463,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[J(96),75],extra:{particles:1,front:!0}}),te("shine-sweep",423,{group:"Light & colour",channels:["fx"],duration:3,intensity:[J(422),45],extra:{particles:1,front:!0}}),te("bounce",88,{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[X(237),10],extra:{origin:"50% 100%"}}),te("jello",264,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[J(452,50),12]}),te("rubber-band",405,{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[J(466,50),25]}),te("tada",502,{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[Y(21,45),3]}),te("swing",473,{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[Y(21,90),15],extra:{origin:"50% 0"}}),te("flip",205,{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[Y(398),360]}),te("pop",360,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[J(408,50),18]}),te("head-shake",234,{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[X(154,30),6]}),te("blink",65,{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[J(139),85]}),te("neon-flicker",315,{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[X(223,30),8],extra:{colour:!0}}),te("rainbow-hue",376,{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[Y(241,720),360]}),te("glitch",219,{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[X(327,20),3],extra:{colour:!0}}),te("fade-pulse",184,{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[J(183),60]}),te("ping",353,{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[J(391,200),90],extra:{particles:1}}),te("ripple-rings",395,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[Q(392,6),3],extra:{particles:"count"}}),te("radar-sweep",372,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[Y(62,180),70],extra:{particles:1}}),te("conic-border-spin",122,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[X(82,12),2],extra:{particles:1}}),te("breathing-border",95,{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[X(82,12),2],extra:ie}),te("fireflies",191,{group:"Scenes",channels:["fx"],duration:6,intensity:[ee,8],extra:{particles:"count"}}),te("confetti",121,{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[ee,10],extra:{particles:"count"}}),te("falling-leaves",186,{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[ee,5],extra:{particles:"count"}}),te("lightning",283,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[J(96),90],extra:{particles:1,front:!0}}),te("ocean-waves",326,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[J(548),35],extra:{particles:3}}),te("sun-rays",470,{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[Y(379,30),6],extra:{particles:1}}),te("heat-shimmer",236,{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[X(465,10),2]}),te("wind-lines",554,{group:"Scenes",channels:["fx"],duration:2.2,intensity:[ee,5],extra:{particles:"count"}}),te("drip",164,{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[ee,3],extra:{particles:"count"}}),te("equalizer-bars",181,{group:"Scenes",channels:["fx"],duration:.9,intensity:[Q(60),5],extra:{particles:"count",direction:"alternate"}}),te("charging-stripes",104,{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[J(467),100],extra:{particles:1}}),te("orbit-dots",332,{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[Q(156,8),3],extra:{particles:"count"}}),te("typing-dots",530,{group:"Scenes",channels:["fx"],duration:1.2,intensity:[X(88,20),4],extra:{particles:3}}),te("pendulum",352,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[Y(21,90),20],extra:{origin:"50% 0",direction:"alternate"}}),te("orbit",331,{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[X(373,40),6]}),te("coin-spin",113,{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[Y(398),360]}),te("rotate-3d",3,{group:"Motion",channels:["rotate"],duration:3,intensity:[Y(516,180),25],extra:{direction:"alternate"}}),te("squash-stretch",453,{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[J(452,50),14],extra:{origin:"50% 100%"}}),te("wiggle",553,{group:"Motion",channels:["rotate"],duration:2.5,intensity:[Y(21,45),8]}),te("shadow-lift",416,{group:"Motion",channels:["translate","glow"],duration:3,intensity:[X(279,20),4],extra:ie}),te("holographic-shimmer",239,{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[J(465),35],extra:{particles:1,front:!0}}),te("scanline",409,{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[J(96),50],extra:{particles:1,front:!0}}),te("twinkle",529,{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[ee,6],extra:{particles:"count",front:!0}}),te("spotlight",449,{group:"Light & colour",channels:["fx"],duration:7,intensity:[J(96),45],extra:{particles:1}}),te("border-snake",78,{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[X(552,12),3],extra:{ring:"snake"}}),te("neon-border",314,{group:"Borders",channels:["glow"],duration:2.4,intensity:[X(223,30),10],extra:ie}),te("power-flow",364,{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[X(155,12),5],extra:{ring:"dots"}}),te("marching-ants",299,{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[X(552,12),2],extra:{ring:"dashes"}}),te("aurora",35,{group:"Backgrounds",channels:["fx"],duration:12,intensity:[J(220),55],extra:{particles:3}}),te("lava-lamp",274,{group:"Backgrounds",channels:["fx"],duration:9,intensity:[ee,5],extra:{particles:"count",direction:"alternate"}}),te("plasma-gradient",354,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[J(465),70],extra:{particles:1}}),te("gradient-flow",226,{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[J(465),60],extra:{particles:1,direction:"alternate"}}),te("color-cycle-bg",116,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[J(465),35],extra:{particles:1}}),te("starfield",455,{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[ee,12],extra:{particles:"count"}}),te("meteor-shower",305,{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[ee,4],extra:{particles:"count"}}),te("bokeh",68,{group:"Backgrounds",channels:["fx"],duration:8,intensity:[ee,7],extra:{particles:"count",direction:"alternate"}}),te("matrix-rain",302,{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[Q(464),10],extra:{particles:"count"}}),te("smoke",433,{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[ee,5],extra:{particles:"count"}}),te("clouds-drift",111,{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[Q(110,6),3],extra:{particles:"count"}}),te("water-ripple",546,{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[Q(396,8),3],extra:{particles:"count"}}),te("fireworks",192,{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[Q(445),10],extra:{particles:"count"}}),...[["winter",556,"winter"],["spring",450,"spring"],["summer",469,"summer"],["autumn",40,"autumn"],["christmas",105,"christmas"],["new_year",316,"new_year"],["valentine",536,"valentine"],["easter",176,"easter"],["halloween",232,"halloween"],["weather",294,"weather"],["daynight",132,"daynight"],["snow",438,"snow"],["rain",377,"rain"],["storm",514,"storm"],["sun",471,"sun"],["clouds",112,"clouds"],["fog",208,"fog"],["wind",555,"wind"],["night",318,"night"],["dusk",171,"dusk"]].map(([e,t,i])=>te(e,t,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[J(137),50],extra:{seasonal:i}})),te("tap-ripple",503,{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[J(96),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),te("press",368,{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[J(138,30),6],extra:{trigger:"tap",iterations:1}})],se=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(e=>ne.some(t=>t.group===e)),re={"Glow & pulse":221,Motion:308,Playful:356,"Light & colour":281,"Rings & sweeps":393,Borders:84,"Weather & device":550,Scenes:410,Backgrounds:51,Seasonal:412,Interaction:260},ae=new Map(ne.map(e=>[e.id,e])),oe=e=>e?ae.get(e):void 0,le={breathe:"0%,100%{scale:1;opacity:1}50%{scale:calc(1 + $i / 100);opacity:.78}","glow-pulse":"0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 calc($i * 1px) calc($i * .19px) $c}","glow-pulse-icon":"0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 calc($i * .375px) $c)}","halo-ripple":"0%{box-shadow:0 0 0 0 $c}100%{box-shadow:0 0 0 calc($i * 1px) transparent}","halo-ripple-icon":"0%{filter:drop-shadow(0 0 0 $c)}100%{filter:drop-shadow(0 0 calc($i * .7px) transparent)}",aura:"0%,100%{box-shadow:0 0 calc($i * .42px) calc($i * .04px) color-mix(in srgb,$c 60%,transparent),inset 0 0 calc($i * .42px) color-mix(in srgb,$c 24%,transparent)}50%{box-shadow:0 0 calc($i * 1px) calc($i * .25px) $c,inset 0 0 calc($i * .75px) color-mix(in srgb,$c 48%,transparent)}","aura-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .125px) color-mix(in srgb,$c 50%,transparent))}50%{filter:drop-shadow(0 0 calc($i * .42px) $c)}",heartbeat:"0%,70%,100%{scale:1}14%{scale:calc(1 + $i / 100)}28%{scale:1}42%{scale:calc(1 + $i / 150)}",spin:"from{rotate:0deg}to{rotate:calc($i * 1deg)}","fast-spin":"from{rotate:0deg}to{rotate:calc($i * 1deg)}",sway:"0%,100%{rotate:calc($i * -1deg)}50%{rotate:calc($i * 1deg)}",wobble:"0%,100%{translate:0 0;rotate:0deg}15%{translate:calc($i * -1px) 0;rotate:calc($i * -.66deg)}30%{translate:calc($i * .83px) 0;rotate:calc($i * .5deg)}45%{translate:calc($i * -.66px) 0;rotate:calc($i * -.33deg)}60%{translate:calc($i * .33px) 0;rotate:calc($i * .17deg)}75%{translate:calc($i * -.17px) 0;rotate:calc($i * -.08deg)}","shake-alert":"0%,50%,100%{translate:0 0}5%,15%,25%,35%,45%{translate:calc($i * -1px) 0}10%,20%,30%,40%{translate:calc($i * 1px) 0}",rumble:"0%,100%{translate:0 0}25%{translate:calc($i * 1px) calc($i * -1px)}50%{translate:calc($i * -1px) calc($i * 1px)}75%{translate:calc($i * 1px) calc($i * 1px)}",float:"0%,100%{translate:0 0}50%{translate:0 calc($i * -1px)}","flame-flicker":"0%,100%{scale:1 1;rotate:0deg;filter:drop-shadow(0 0 2px $c) brightness(1)}25%{scale:calc(1 - $i * .004) calc(1 + $i / 100);rotate:calc($i * .3deg);filter:drop-shadow(0 -1px 6px $c) brightness(1.15)}50%{scale:calc(1 + $i * .004) calc(1 - $i * .006);rotate:calc($i * -.2deg);filter:drop-shadow(0 0 3px $c) brightness(.95)}75%{scale:calc(1 - $i * .002) calc(1 + $i * .008);rotate:calc($i * -.4deg);filter:drop-shadow(0 -1px 5px $c) brightness(1.1)}","steam-rise":"0%{translate:0 0;scale:.5;opacity:0}25%{opacity:1}100%{translate:0 -100cqh;scale:1.7;opacity:0}",bubbles:"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:4px -55cqh}90%{opacity:.8}100%{translate:-3px calc(-100cqh - 12px);opacity:0}","snow-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:6px 50cqh}100%{translate:-2px calc(100cqh + 12px);opacity:.7}","rain-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 24px);opacity:.6}","liquid-wave":"from{rotate:0deg}to{rotate:360deg}","storm-flash":"0%,88%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.1}93.5%{opacity:calc($i / 125)}96%{opacity:0}","shine-sweep":"0%{translate:-100% 0}60%,100%{translate:100cqw 0}",blink:"0%,45%,100%{opacity:1}50%,95%{opacity:calc(1 - $i / 100)}","neon-flicker":"0%,17%,23%,26%,52%,58%,100%{opacity:1;filter:drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1)}20%,25%,55%{opacity:.45;filter:drop-shadow(0 0 0 transparent) brightness(.8)}24%{opacity:.8;filter:drop-shadow(0 0 calc($i * .4px) $c) brightness(1)}","rainbow-hue":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(calc($i * 1deg))}",glitch:"0%,86%,100%{translate:0 0;filter:none}88%{translate:calc($i * -1px) 0;filter:drop-shadow(calc($i * .7px) 0 0 $c) drop-shadow(calc($i * -.7px) 0 0 color-mix(in srgb,$c 35%,#00e5ff))}90%{translate:calc($i * 1px) calc($i * .3px);filter:drop-shadow(calc($i * -.7px) 0 0 $c) hue-rotate(40deg)}92%{translate:calc($i * -.5px) 0;filter:drop-shadow(calc($i * .4px) 0 0 color-mix(in srgb,$c 35%,#ff1744))}94%{translate:0 0;filter:none}","fade-pulse":"0%,100%{opacity:1}50%{opacity:calc(1 - $i / 100)}",bounce:"0%,20%,53%,100%{translate:0 0;scale:1 1}40%,43%{translate:0 calc($i * -1px);scale:.96 1.06}70%{translate:0 calc($i * -.5px);scale:.98 1.03}80%{translate:0 0;scale:1.04 .96}90%{translate:0 calc($i * -.12px);scale:1 1}",jello:"0%,10%,60%,100%{scale:1 1}18%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}26%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}34%{scale:calc(1 + $i / 200) calc(1 - $i / 200)}42%{scale:calc(1 - $i / 400) calc(1 + $i / 400)}50%{scale:calc(1 + $i / 800) calc(1 - $i / 800)}","rubber-band":"0%,55%,100%{scale:1 1}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}20%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}25%{scale:calc(1 + $i / 160) calc(1 - $i / 160)}33%{scale:calc(1 - $i / 500) calc(1 + $i / 500)}42%{scale:calc(1 + $i / 500) calc(1 - $i / 500)}",tada:"0%,50%,100%{scale:1;rotate:0deg}5%,10%{scale:.9;rotate:calc($i * -1deg)}15%,25%,35%,45%{scale:1.1;rotate:calc($i * 1deg)}20%,30%,40%{scale:1.1;rotate:calc($i * -1deg)}",swing:"0%,60%,100%{rotate:0deg}12%{rotate:calc($i * 1deg)}24%{rotate:calc($i * -.66deg)}36%{rotate:calc($i * .33deg)}48%{rotate:calc($i * -.2deg)}",flip:"0%,10%{rotate:y 0deg}60%,100%{rotate:y calc($i * 1deg)}",pop:"0%,40%,100%{scale:1}10%{scale:calc(1 + $i / 100)}20%{scale:calc(1 - $i / 400)}30%{scale:calc(1 + $i / 600)}","head-shake":"0%,50%,100%{translate:0 0;rotate:0deg}6.5%{translate:calc($i * -1px) 0;rotate:calc($i * -1deg)}18.5%{translate:calc($i * .8px) 0;rotate:calc($i * .8deg)}31.5%{translate:calc($i * -.5px) 0;rotate:calc($i * -.5deg)}43.5%{translate:calc($i * .3px) 0;rotate:calc($i * .3deg)}"},ce="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",de={ping:"0%{scale:.15;opacity:1}80%,100%{scale:1;opacity:0}","ripple-rings":"0%{scale:.1;opacity:1}100%{scale:1;opacity:0}","radar-sweep":"from{rotate:0deg}to{rotate:360deg}","conic-border-spin":"from{rotate:0deg}to{rotate:360deg}","breathing-border":"0%,100%{box-shadow:inset 0 0 0 calc($i * 1px) color-mix(in srgb,$c 30%,transparent),0 0 0 0 transparent}50%{box-shadow:inset 0 0 0 calc($i * 1px) $c,0 0 calc($i * 4px) color-mix(in srgb,$c 35%,transparent)}","breathing-border-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .5px) color-mix(in srgb,$c 40%,transparent))}50%{filter:drop-shadow(0 0 calc($i * 1.5px) $c)}",fireflies:"0%{translate:0 0;opacity:0}20%{opacity:1}40%{translate:10px -8px}60%{opacity:.3}75%{translate:-6px -14px;opacity:1}100%{translate:4px -22px;opacity:0}",confetti:"0%{translate:0 0;rotate:0deg;opacity:1}25%{translate:8px 25cqh;rotate:160deg}50%{translate:-6px 50cqh;rotate:300deg}75%{translate:6px 75cqh;rotate:420deg}100%{translate:0 calc(100cqh + 14px);rotate:540deg;opacity:1}","falling-leaves":"0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:1}30%{translate:14px 30cqh;rotate:60deg}55%{translate:-8px 55cqh;rotate:-20deg}80%{translate:12px 80cqh;rotate:80deg}100%{translate:0 calc(100cqh + 16px);rotate:20deg;opacity:.8}",lightning:"0%,89%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.15}93%{opacity:calc($i / 100)}96%{opacity:0}","ocean-waves":"from{translate:0 0}to{translate:-40px 0}","sun-rays":"from{rotate:0deg}to{rotate:360deg}","heat-shimmer":"0%,100%{translate:0 0;filter:blur(0)}25%{translate:calc($i * .5px) calc($i * -.5px);filter:blur(calc($i * .3px))}50%{translate:calc($i * -.5px) 0;filter:blur(0)}75%{translate:0 calc($i * .5px);filter:blur(calc($i * .2px))}","wind-lines":"0%{translate:0 0;opacity:0}15%{opacity:1}85%{opacity:.8}100%{translate:calc(100cqw + 100%) 0;opacity:0}",drip:"0%{translate:0 0;scale:.4 .2;opacity:0}15%{scale:1 1;opacity:1}35%{translate:0 2px;scale:.9 1.25}45%{translate:0 4px;scale:1 1}100%{translate:0 calc(100cqh + 12px);scale:.9 1.3;opacity:.7}","equalizer-bars":"0%{scale:1 .15}30%{scale:1 .8}60%{scale:1 .35}100%{scale:1 1}","charging-stripes":"from{translate:0 0}to{translate:28.2843px 0}","orbit-dots":"from{rotate:0deg}to{rotate:360deg}","typing-dots":"0%,60%,100%{translate:0 0;opacity:.35}30%{translate:0 calc($i * -1px);opacity:1}"},pe={ping:"left:50%;top:50%;width:calc($i * 1cqmin);aspect-ratio:1;translate:-50% -50%;border:2px solid $c;border-radius:50%;box-sizing:border-box;","ripple-rings":` left:50%;top:50%;width:110cqmin;aspect-ratio:1;translate:-50% -50%;border:1.5px solid $c;border-radius:50%;box-sizing:border-box;${ce}`,"radar-sweep":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:1;background:conic-gradient(from 0deg,transparent 0deg calc(360deg - $i * 1deg),$c 360deg);","conic-border-spin":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:conic-gradient(from 0deg,transparent 0% 55%,$c 80%,transparent 100%);",fireflies:"top:calc(12% + var(--mc-anim-phase) * 72%);width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 2px $c;",confetti:"top:-10px;width:6px;height:10px;border-radius:1px;background:$c;","confetti|:nth-child(3n + 2)":"background:color-mix(in srgb,$c 40%,#ffeb3b);","confetti|:nth-child(3n)":"width:8px;height:6px;background:color-mix(in srgb,$c 40%,#e91e63);","falling-leaves":"top:-14px;width:10px;height:10px;border-radius:0 80% 0 80%;background:$c;","falling-leaves|:nth-child(even)":"background:color-mix(in srgb,$c 75%,#7cb342);",lightning:"left:50%;top:0;width:32cqmin;height:100%;translate:-50% 0;background:color-mix(in srgb,$c 40%,#fff);clip-path:polygon(58% 0,22% 56%,46% 56%,32% 100%,80% 40%,56% 40%,72% 0);","ocean-waves":"left:0;bottom:0;width:calc(100% + 40px);height:calc($i * 1%);opacity:1;background:radial-gradient(22px 12px at 20px 0,transparent 98%,color-mix(in srgb,$c 45%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"height:calc($i * .75%);animation-direction:reverse;animation-duration:calc(var(--mc-fx-dur) * 1.5);background:radial-gradient(22px 10px at 20px 0,transparent 98%,color-mix(in srgb,$c 70%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"height:calc($i * .5%);animation-duration:calc(var(--mc-fx-dur) * .7);background:radial-gradient(22px 8px at 20px 0,transparent 98%,$c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"left:50%;top:50%;width:170cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:repeating-conic-gradient(from 0deg,$c 0deg calc($i * 1deg),transparent calc($i * 1deg) calc($i * 3deg));mask:radial-gradient(closest-side,#000 15%,transparent 70%);","wind-lines":"left:-35%;top:calc(10% + var(--mc-anim-phase) * 80%);width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,$c);",drip:"top:-4px;width:6px;height:9px;margin-left:-3px;transform-origin:50% 0;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;background:$c;","equalizer-bars":"left:calc(10% + var(--mc-anim-k) * 80%);bottom:0;width:max(3px,5%);height:70%;opacity:1;border-radius:2px 2px 0 0;transform-origin:50% 100%;background:$c;","charging-stripes":"top:0;bottom:0;left:-28.2843px;width:calc(100% + 28.2843px);opacity:1;background:repeating-linear-gradient(-45deg,color-mix(in srgb,$c calc($i * 1%),transparent) 0 10px,transparent 10px 20px);","orbit-dots":` left:50%;top:calc(50% - 38cqmin);width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;opacity:1;background:$c;transform-origin:3px calc(3px + 38cqmin);${ce}`,"typing-dots":"left:calc(50% - 12px + var(--mc-anim-k) * 36px);top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:$c;animation-delay:calc(var(--mc-fx-delay,0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur,1s) * .5);"},he={pendulum:"from{rotate:calc($i * -1deg)}to{rotate:calc($i * 1deg)}",orbit:"0%,100%{translate:calc($i * 1px) 0}12.5%{translate:calc($i * .707px) calc($i * .707px)}25%{translate:0 calc($i * 1px)}37.5%{translate:calc($i * -.707px) calc($i * .707px)}50%{translate:calc($i * -1px) 0}62.5%{translate:calc($i * -.707px) calc($i * -.707px)}75%{translate:0 calc($i * -1px)}87.5%{translate:calc($i * .707px) calc($i * -.707px)}","coin-spin":"from{rotate:y 0deg}to{rotate:y calc($i * 1deg)}","rotate-3d":"from{rotate:1 1 0 calc($i * -1deg)}to{rotate:1 1 0 calc($i * 1deg)}","squash-stretch":"0%,100%{scale:1 1;translate:0 0}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100);translate:0 0}45%{scale:calc(1 - $i / 200) calc(1 + $i / 150);translate:0 calc($i * -.8px)}70%{scale:1 1;translate:0 calc($i * -.4px)}85%{scale:calc(1 + $i / 160) calc(1 - $i / 160);translate:0 0}",wiggle:"0%,40%,100%{rotate:0deg}5%{rotate:calc($i * 1deg)}10%{rotate:calc($i * -1deg)}15%{rotate:calc($i * .8deg)}20%{rotate:calc($i * -.6deg)}25%{rotate:calc($i * .4deg)}30%{rotate:calc($i * -.2deg)}","shadow-lift":"0%,100%{translate:0 0;box-shadow:0 1px 2px color-mix(in srgb,$c 20%,rgba(0,0,0,.2))}50%{translate:0 calc($i * -1px);box-shadow:0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3))}","shadow-lift-icon":"0%,100%{translate:0 0;filter:drop-shadow(0 1px 1px color-mix(in srgb,$c 20%,rgba(0,0,0,.2)))}50%{translate:0 calc($i * -1px);filter:drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3)))}","holographic-shimmer":"from{translate:0 0;filter:hue-rotate(0deg)}to{translate:-50% 0;filter:hue-rotate(360deg)}",scanline:"from{translate:0 -100%}to{translate:0 100cqh}",twinkle:"0%,100%{scale:0;rotate:0deg;opacity:0}50%{scale:1;rotate:90deg;opacity:1}",spotlight:"0%,100%{translate:-30cqw -10cqh}33%{translate:25cqw 15cqh}66%{translate:10cqw -20cqh}","neon-border":"0%,100%{box-shadow:0 0 0 1px $c,0 0 calc($i * .6px) color-mix(in srgb,$c 70%,transparent),inset 0 0 calc($i * .5px) color-mix(in srgb,$c 45%,transparent)}50%{box-shadow:0 0 0 1.5px $c,0 0 calc($i * 1.4px) $c,inset 0 0 calc($i * .9px) color-mix(in srgb,$c 60%,transparent)}","neon-border-icon":"0%,100%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .3px) color-mix(in srgb,$c 70%,transparent))}50%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .7px) $c)}","color-cycle-bg":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}",aurora:"0%,100%{translate:-12% 0;rotate:-8deg;scale:1 1;opacity:calc($i / 100)}50%{translate:12% 6%;rotate:6deg;scale:1.15 .85;opacity:calc($i / 160)}","lava-lamp":"0%{translate:0 0;scale:1 1;opacity:.9}50%{translate:6px -45cqh;scale:1.25 .85}100%{translate:-4px -85cqh;scale:.85 1.15;opacity:.9}","plasma-gradient":"0%{rotate:0deg;scale:1}50%{rotate:180deg;scale:1.25}100%{rotate:360deg;scale:1}","gradient-flow":"from{translate:0 0}to{translate:-66.667% 0}",starfield:"0%,100%{opacity:.15;scale:.6}50%{opacity:1;scale:1}","meteor-shower":"0%{translate:0 0;opacity:0}6%{opacity:1}40%,100%{translate:-60cqw 60cqh;opacity:0}",bokeh:"0%{translate:0 0;scale:.8;opacity:.15}50%{opacity:.55}100%{translate:10px -16px;scale:1.15;opacity:.25}","matrix-rain":"0%{translate:0 -100%;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 100%);opacity:.6}",smoke:"0%{translate:0 0;scale:.4;opacity:0}20%{opacity:.5}100%{translate:18px -90cqh;scale:2.6;opacity:0}","clouds-drift":"from{translate:0 0;opacity:.9}to{translate:calc(100cqw + 100%) 0;opacity:.9}","water-ripple":"0%{scale:.05;opacity:.9}100%{scale:1;opacity:0}",fireworks:"0%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1);opacity:1}70%{opacity:1}100%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(.3);opacity:0}","tap-ripple":"0%{scale:0;opacity:calc($i / 100)}100%{scale:1;opacity:0}",press:"0%,100%{scale:1}40%{scale:calc(1 - $i / 100)}"};function ue(e,t){const i=le[e]??de[e]??he[e];if(void 0===i)return;const n=oe(e.replace(/-icon$/,"")),s=t??n?.defaults.intensity??1;return i.replace(/\$i/g,String(s)).replace(/\$c/g,"var(--mc-anim-c)")}function me(e){const t=[];for(const i of e.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const e=i[1].split(",").map(e=>e.trim().toLowerCase()).map(e=>"from"===e?0:"to"===e?100:parseFloat(e)).filter(e=>Number.isFinite(e)),n=[];for(const e of i[2].split(";")){const t=e.indexOf(":");if(t<0)continue;const i=e.slice(0,t).trim().toLowerCase(),s=e.slice(t+1).trim().replace(/\s+/g," ");i&&s&&n.push([i,s])}e.length&&n.length&&t.push({offsets:e,decls:n})}return t}const ge=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());var fe=i(1771);const ve=e=>{if(e&&"object"==typeof e){for(const t of Object.values(e))ve(t);Object.freeze(e)}return e},be=ve(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),ye=ve(["matrix","translate","scale","rotate","skewx","skewy"]),xe=ve({maxStyleAttrChars:2e3,maxStyleBlocks:16,maxCssChars:32768,maxRules:512,maxDeclarations:64,maxSelectors:32,maxClassTokens:32,maxBracketDepth:8,maxPaintChars:200,maxValueChars:64,maxDashValues:32,maxColourFunctionDepth:2,maxHrefHops:8,maxStopsPerGradient:256,maxStopClones:1024}),_e=(...e)=>({kind:"keyword",keywords:ve(e)}),we=ve({fill:{kind:"paint"},stroke:{kind:"paint"},"stop-color":{kind:"stop-paint"},opacity:{kind:"alpha"},"fill-opacity":{kind:"alpha"},"stroke-opacity":{kind:"alpha"},"stop-opacity":{kind:"alpha"},"stroke-width":{kind:"width"},"stroke-miterlimit":{kind:"miterlimit"},"stroke-dashoffset":{kind:"offset"},"stroke-dasharray":{kind:"dasharray"},"stroke-linecap":_e("butt","round","square"),"stroke-linejoin":_e("miter","round","bevel","arcs","miter-clip"),"fill-rule":_e("nonzero","evenodd"),"clip-rule":_e("nonzero","evenodd"),"paint-order":{kind:"paint-order"},"vector-effect":_e("none","non-scaling-stroke")}),$e=ve({name:"icon",elements:ve(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),kinds:ve(Object.fromEntries(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"].map(e=>{return[e,(t=e,"transform"===t||"gradientTransform"===t?"transform":"id"===t?"id":"class"===t?"class":"value")];var t}))),colourFunctions:be,transformFunctions:ye,paintVar:!1,maxValueChars:32768,denyExtra:ve([]),limits:ve({maxNodes:32768,maxDepth:64}),css:ve({properties:we,limits:xe,maxWrittenBytes:32768})});var ke=i(3910);const Me=e=>String(+e.toFixed(3)),Se=e=>{if(null==e||/%/.test(e))return;const t=parseFloat(e);return Number.isFinite(t)?t:void 0},je=[1,0,0,1,0,0],Ce=(e,t)=>[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]];function Ae(e){let t=je;if(!e)return t;for(const[,i,n]of e.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const e=n.split(/[\s,]+/).filter(Boolean).map(Number);if(e.some(e=>!Number.isFinite(e)))continue;let s=je;switch(i){case"matrix":6===e.length&&(s=e);break;case"translate":s=[1,0,0,1,e[0]??0,e[1]??0];break;case"scale":s=[e[0]??1,0,0,e[1]??e[0]??1,0,0];break;case"rotate":{const t=(e[0]??0)*Math.PI/180,[i,n]=[e[1]??0,e[2]??0],r=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];s=Ce(Ce([1,0,0,1,i,n],r),[1,0,0,1,-i,-n]);break}case"skewX":s=[1,0,Math.tan((e[0]??0)*Math.PI/180),1,0,0];break;case"skewY":s=[1,Math.tan((e[0]??0)*Math.PI/180),0,1,0,0]}t=Ce(t,s)}return t}function ze(e,t){const i=t=>Se(e.getAttribute(t));switch(t){case"path":{const t=e.getAttribute("d")?.trim();return t||void 0}case"circle":case"ellipse":{const e=i("cx")??0,n=i("cy")??0,s="circle"===t?i("r"):i("rx")??i("ry"),r="circle"===t?s:i("ry")??i("rx");if(!s||!r||s<=0||r<=0)return;const a=`A${Me(s)} ${Me(r)} 0 1 0`;return`M${Me(e-s)} ${Me(n)}${a} ${Me(e+s)} ${Me(n)}${a} ${Me(e-s)} ${Me(n)}Z`}case"rect":{const e=i("x")??0,t=i("y")??0,n=i("width"),s=i("height");if(!n||!s||n<=0||s<=0)return;let r=i("rx")??i("ry")??0,a=i("ry")??i("rx")??0;if(r=Math.min(Math.max(r,0),n/2),a=Math.min(Math.max(a,0),s/2),!r||!a)return`M${Me(e)} ${Me(t)}H${Me(e+n)}V${Me(t+s)}H${Me(e)}Z`;const o=`A${Me(r)} ${Me(a)} 0 0 1`;return`M${Me(e+r)} ${Me(t)}H${Me(e+n-r)}${o} ${Me(e+n)} ${Me(t+a)}V${Me(t+s-a)}${o} ${Me(e+n-r)} ${Me(t+s)}H${Me(e+r)}${o} ${Me(e)} ${Me(t+s-a)}V${Me(t+a)}${o} ${Me(e+r)} ${Me(t)}Z`}case"line":return`M${Me(i("x1")??0)} ${Me(i("y1")??0)}L${Me(i("x2")??0)} ${Me(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(e){const t=(e??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let e=0;e+1<t.length;e+=2)Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&i.push([t[e],t[e+1]]);return i}(e.getAttribute("points"));if(i.length<2)return;return`M${i.map(([e,t])=>`${Me(e)} ${Me(t)}`).join("L")}${"polygon"===t?"Z":""}`}}}const qe=32768,Ee="0 0 24 24",He=e=>new Map(e.map(e=>[e.toLowerCase(),e])),Le=He($e.elements),Ve=He(Object.keys($e.kinds)),Oe=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),Pe=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]);function Re(e,t){const i=(0,ke.I)($e,e);return i?(0,ke.M7)(i,t,$e):void 0}const Ne=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),De=e=>"mc-accent"!==e&&(Ne.has(e)||/^(mc-|dev-|xfade-)/.test(e))?`u-${e}`:e,Te="The SVG is too complex.",Fe=e=>({markup:"",viewBox:Ee,paths:[],accentPaths:[],strokes:[],error:e}),Be={fill:!0,stroke:!1,width:1},Ie=/^(none|transparent)$/i;function Ze(e,t){const i=t=>{const i=e.getAttribute(t);return null===i?void 0:Re(t,i)?.trim()},n=i("fill"),s=i("stroke"),r=Se(i("stroke-width")),a=i("stroke-linecap"),o=i("stroke-linejoin"),l=i("fill-rule");return{evenodd:void 0===l?t.evenodd:"evenodd"===l,fill:void 0===n?t.fill:!Ie.test(n),stroke:void 0===s?t.stroke:!Ie.test(s),width:void 0!==r&&r>=0?r:t.width,cap:a&&/^(butt|round|square)$/.test(a)?a:t.cap,join:o&&/^(miter|round|bevel|arcs|miter-clip)$/.test(o)?o:t.join}}function We(e,t={}){const i="string"==typeof e?e:"";if((0,ke.dp)(i)>qe)return Fe("The SVG is larger than 32 KB.");const n=function(e){if("undefined"==typeof DOMParser)return;const t=new DOMParser;try{const i=t.parseFromString(e,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return{root:n,via:"xml",doc:i}}catch{}try{const i=t.parseFromString(e,"text/html"),n=i.getElementsByTagName("*");for(let e=0;e<n.length;e++)if("svg"===n[e].localName.toLowerCase())return{root:n[e],via:"html",doc:i}}catch{}}(i)?.root;if(!n)return Fe("No <svg> element found.");const s=function(e){const t=(e.getAttribute("viewBox")??e.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0)return t.map(Me).join(" ");const i=Se(e.getAttribute("width")),n=Se(e.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${Me(i)} ${Me(n)}`:Ee}(n);if(t.css)try{if("ok"!==t.css(n,$e).status)return Fe(Te)}catch{return Fe(Te)}const r=[],a=[],o=[],l={},c=(e,t,i=[])=>{let n="",s="";for(const i of[...e.attributes]){const e=Ve.get(i.name.toLowerCase());if(!e||i.name.includes(":"))continue;if(t&&("viewBox"===e||"width"===e||"height"===e))continue;const r=Re(e,i.value);void 0!==r&&("class"===e?s=r.split(" ").map(De).join(" "):n+=` ${e}="${(0,ke.dc)(r)}"`)}const r=[s,...i].filter(Boolean).join(" ");return r?` class="${(0,ke.dc)(r)}"${n}`:n};let d=!1;const p=(e,t,i,n,s,h)=>{if(h>64||d)return d=!0,"";const u=Le.get(e.localName.toLowerCase());if(!u||"svg"===u)return"";if("title"===u)return`<title>${(0,ke.X1)(e.textContent??"")}</title>`;const m=Ce(t,Ae(Re("transform",e.getAttribute("transform")??"")??null)),g=n||(e.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),f=i&&!Pe.has(u),v=Ze(e,s),b=[];if(f&&Oe.has(u)){const t=ze(e,u);if(t){const e=function(e,t){if((e=>e.every((e,t)=>Math.abs(e-je[t])<1e-9))(t))return e;const i=e=>[t[0]*e[0]+t[2]*e[1]+t[4],t[1]*e[0]+t[3]*e[1]+t[5]];return(0,fe.ER)((0,fe.Mj)(e).map(e=>e.map(e=>e.map(i))))}(t,m);if(v.fill&&"line"!==u){const t=g?a:r;v.evenodd&&(g?l.accent??=[]:l.paths??=[]).push(t.length),t.push(e),b.push("mc-f")}if(v.stroke&&v.width>0){const t=+(v.width*Math.sqrt(Math.abs(m[0]*m[3]-m[1]*m[2]))).toFixed(3);o.push({d:e,width:t,...v.cap?{cap:v.cap}:{},...v.join?{join:v.join}:{},...g?{accent:!0}:{}}),b.push("mc-s")}}}const y=[...e.children].map(e=>p(e,m,f,g,v,h+1)).join("");return`<${u}${c(e,!1,b)}>${y}</${u}>`},h=Ae(Re("transform",n.getAttribute("transform")??"")??null),u=Ze(n,Be),m=[...n.children].map(e=>p(e,h,!0,!1,u,1)).join("");return d?Fe(Te):r.length||a.length||o.length?{markup:`<svg viewBox="${s}"${c(n,!0)}>${m}</svg>`,viewBox:s,paths:r,accentPaths:a,strokes:o,...l.paths||l.accent?{evenodd:l}:{}}:Fe("The SVG has no shapes to draw.")}const Ke=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function Ue(e){const t=e=>Array.isArray(e)&&e.length>0,i=e.rig;return t(e.tracks)||t(e.clips)||t(e.bindings)||!!i&&"object"==typeof i&&(t(i.parts)||t(i.shapes))}const Ge={epoch:0,failedSims:new Set},Ye="custom:",Je=e=>"string"==typeof e&&e.startsWith(Ye),Xe=e=>e.slice(7).trim(),Qe=["keyframes","particles","path","sequence"],et=["fall","rise","drift","burst","orbit","spiral"],tt=60,it=12,nt=8192,st=/^[a-z0-9][a-z0-9_-]{0,63}$/,rt={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"},at=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],ot={color:new Set(at),background:new Set([...at,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(at),filter:new Set([...at,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function lt(e,t){if("string"!=typeof e)return;const i=e.trim();if(!i||i.length>600||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const e of i)if("("===e)n++;else if(")"===e&&--n<0)return;if(0!==n)return;const s=i.match(/\(/g)?.length??0,r=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return r.length!==s||r.some(e=>!ot[t].has(e[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(e=>!/^--[\w-]+$/.test(e[1]))?void 0:i}const ct=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,dt=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,pt=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,ht=["normal","reverse","alternate","alternate-reverse"];function ut(e){if("string"!=typeof e)return!1;const t=e.trim();return G.some(e=>e.id===t)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)}const mt=new Set(ne.filter(e=>!e.channels.includes("fx")).map(e=>e.id)),gt=new Set(ne.filter(e=>e.channels.includes("fx")).map(e=>e.id)),ft=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;class vt{constructor(){this.errors=[]}err(e,t){this.errors.push({path:e,message:t})}num(e,t,i,n,s,r,a=!1){const o=e[t];if(null==o||""===o)return void 0===r?void 0:r;const l="string"==typeof o?Number(o):o;return"number"==typeof l&&Number.isFinite(l)?a&&!Number.isInteger(l)?this.err(i,"Must be a whole number."):l<n||l>s?this.err(i,`Must be between ${n} and ${s}.`):l:this.err(i,"Must be a number.")}bool(e,t,i,n){const s=e[t];return null==s?n:"boolean"!=typeof s?this.err(i,"Must be true or false.")??n:s}oneOf(e,t,i,n,s){const r=e[t];return null==r||""===r?s:n.includes(r)?r:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(e,t,i,n){const s=e[t];if(null!=s&&""!==s)return lt(s,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(e,t){return!e||"object"!=typeof e||Array.isArray(e)?this.err(t,"Must be an object."):e}list(e,t,i,n=0){return Array.isArray(e)?e.length<n?this.err(t,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):e.length>i?this.err(t,`At most ${i} entries.`):e:this.err(t,"Must be a list.")}}function bt(e,t,i,n=!1,s=!1){const r=e.obj(t,i);if(!r)return;const a=e.num(r,"at",`${i}.at`,0,100);void 0===r.at&&e.err(`${i}.at`,"Required.");const o={at:a??0};if(void 0!==r.transform){const t=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={},r=(t,r,a)=>{const o=e.num(n,t,`${i}.${t}`,r,a);void 0!==o&&(s[t]=o)};if(r("x",-1e4,1e4),r("y",-1e4,1e4),r("scale",0,100),r("scale_x",-100,100),r("scale_y",-100,100),r("rotate",-36e3,36e3),r("skew_x",-89,89),r("skew_y",-89,89),void 0!==n.axis){const t=n.axis;!Array.isArray(t)||3!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e))||t.every(e=>0===e)?e.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):s.axis=[t[0],t[1],t[2]]}return s}(e,r.transform,`${i}.transform`);t&&Object.keys(t).length&&(o.transform=t)}const l=e.num(r,"opacity",`${i}.opacity`,0,1);void 0!==l&&(o.opacity=l);const c=e.css(r,"color",`${i}.color`,"color");c&&(o.color=c);const d=e.css(r,"background",`${i}.background`,"background");d&&(o.background=d);const p=e.css(r,"shadow",`${i}.shadow`,"shadow");p&&(o.shadow=p);const h=e.css(r,"filter",`${i}.filter`,"filter");h&&(o.filter=h);const u=e.num(r,"blur",`${i}.blur`,0,200);void 0!==u&&(o.blur=u);const m=e.num(r,"radius",`${i}.radius`,0,1e3);void 0!==m&&(o.radius=m),void 0!==r.easing&&""!==r.easing&&(ut(r.easing)?o.easing=r.easing.trim():e.err(`${i}.easing`,"Not a valid easing."));const g=s?new vt:e,f=g.css(r,"stroke",`${i}.stroke`,"color");if(f&&(o.stroke=f),void 0!==r.draw&&null!==r.draw&&""!==r.draw)if(n){const e=g.num(r,"draw",`${i}.draw`,0,1);void 0!==e&&(o.draw=e)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==r.easings&&null!==r.easings){const e=g.obj(r.easings,`${i}.easings`),t={};for(const[n,s]of Object.entries(e??{}))Ke.includes(n)?ut(s)?t[n]=s.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(t).length&&(o.easings=t)}return o}function yt(e,t,i,n){const s=e.num(t,"count",`${i}.count`,1,tt,n.count,!0)??n.count;let r=[...n.size];if(void 0!==t.size){const n=t.size;"number"==typeof n&&n>0&&n<=200?r=[n,n]:Array.isArray(n)&&2===n.length&&n.every(e=>"number"==typeof e&&e>0&&e<=200)&&n[0]<=n[1]?r=[n[0],n[1]]:e.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const a=[];if(void 0!==t.colors){const n=e.list(t.colors,`${i}.colors`,it);n?.forEach((t,n)=>{const s=lt(t,"color");s?a.push(s):e.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const o=void 0!==t.shape&&null!==t.shape?function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of icon, emoji or svg.");const r=s[0],a=n[r];if("string"!=typeof a)return e.err(`${i}.${r}`,"Must be text.");if("icon"===r)return pt.test(a.trim())?{icon:a.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===r){const t=a.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(ft(a)>qe)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(a))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=We(a);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:a}}(e,t.shape,`${i}.shape`):void 0;return{...o?{shape:o}:{},count:s,size:r,colors:a}}const xt=["rig","tracks","clips","bindings"];let _t;function wt(e,t={}){const i=new vt,n=i.obj(e,"");if(!n)return{ok:!1,errors:i.errors};let s;try{s=JSON.stringify(n)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(ft(s)>65536)return{ok:!1,errors:[{path:"",message:"The animation is larger than 64 KB."}]};const r="string"==typeof n.id?n.id.trim():"";st.test(r)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const a="string"==typeof n.name?n.name.trim():"";a?a.length>80&&i.err("name","At most 80 characters."):i.err("name","Required."),void 0!==n.version&&1!==n.version&&i.err("version","Unsupported version (expected 1).");const o=i.oneOf(n,"kind","kind",Qe);n.kind||i.err("kind","Required.");const l={id:r,name:a,kind:o??"keyframes",duration:i.num(n,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(n,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==n.easing&&""!==n.easing&&(ut(n.easing)?l.easing=n.easing.trim():i.err("easing","Not a valid easing.")),void 0!==n.iterations&&"infinite"!==n.iterations){const e=i.num(n,"iterations","iterations",.01,1e3);void 0!==e&&(l.iterations=e)}const c=i.oneOf(n,"direction","direction",ht);switch(c&&"normal"!==c&&(l.direction=c),Object.prototype.hasOwnProperty.call(n,"mirror")&&("mirror"===n.mirror||"keep"===n.mirror?l.mirror=n.mirror:i.err("mirror","Use mirror or keep.")),void 0!==n.origin&&""!==n.origin&&("string"==typeof n.origin&&ct.test(n.origin.trim())?l.origin=n.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),o){case"keyframes":{const e=Array.isArray(n.tracks)&&n.tracks.length>0,s=void 0===n.keyframes?e?[]:i.err("keyframes","Required."):i.list(n.keyframes,"keyframes",40,e?0:1),r="lenient"===t.v2,a=(s??[]).map((e,t)=>bt(i,e,`keyframes[${t}]`,!1,r)).filter(e=>!!e);l.keyframes=a.sort((e,t)=>e.at-t.at);break}case"particles":void 0===n.particles?i.err("particles","Required."):l.particles=function(e,t,i,n){const s=e.obj(t,i);if(!s)return;const r=rt,a={...yt(e,s,i,r),direction:e.oneOf(s,"direction",`${i}.direction`,et,r.direction)??r.direction,speed:e.num(s,"speed",`${i}.speed`,.1,10,r.speed)??r.speed,spin:e.num(s,"spin",`${i}.spin`,-3600,3600,r.spin)??r.spin,fade:e.bool(s,"fade",`${i}.fade`,r.fade),spread:e.num(s,"spread",`${i}.spread`,0,100,r.spread)??r.spread,gravity:e.num(s,"gravity",`${i}.gravity`,-1,1,r.gravity)??r.gravity,layer:e.oneOf(s,"layer",`${i}.layer`,["back","front"],r.layer)??r.layer};if(void 0!==s.preset&&""!==s.preset){"string"==typeof s.preset&&gt.has(s.preset)?a.preset=s.preset:e.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const t=e.num(s,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==t&&(a.intensity=t)}if(void 0!==s.sim&&null!==s.sim&&(n?new vt:e).obj(s.sim,`${i}.sim`))if(Ge.simValidator){const t=Ge.simValidator(s.sim,n?"lenient":"strict",{count:a.count,layer:a.layer});n||e.errors.push(...t.errors),!t.sim||!n&&t.errors.length||(a.sim=t.sim)}else a.sim=s.sim;return a}(i,n.particles,"particles","lenient"===t.v2);break;case"path":void 0===n.path?i.err("path","Required."):l.path=function(e,t,i){const n=e.obj(t,i);if(!n)return;let s="";"string"==typeof n.d&&n.d.trim()?n.d.length>nt?e.err(`${i}.d`,"At most 8192 characters."):dt.test(n.d)&&/^\s*[Mm]/.test(n.d)?(0,fe.Mj)(n.d).some(e=>e.length)?s=n.d.trim().replace(/\s+/g," "):e.err(`${i}.d`,"The path draws nothing."):e.err(`${i}.d`,"Not valid path data (it must start with M)."):e.err(`${i}.d`,"Required.");const r={d:s,units:e.oneOf(n,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:e.bool(n,"follow_rotation",`${i}.follow_rotation`,!1),subject:e.oneOf(n,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==n.particles&&null!==n.particles){const t=e.obj(n.particles,`${i}.particles`);t&&(r.particles=yt(e,t,`${i}.particles`,{...rt,count:3}))}return r}(i,n.path,"path");break;case"sequence":{l.steps=void 0===n.steps?(i.err("steps","Required."),[]):function(e,t,i,n){const s=e.list(t,i,20,1);if(!s)return[];const r=[];return s.forEach((t,s)=>{const a=`${i}[${s}]`,o=e.obj(t,a);if(!o)return;const l="string"==typeof o.animation?o.animation.trim():"";l?Je(l)?Xe(l)===n?e.err(`${a}.animation`,"A sequence cannot play itself."):st.test(Xe(l))||e.err(`${a}.animation`,"Not a valid animation id."):mt.has(l)||e.err(`${a}.animation`,"Must be a motion preset or a custom keyframes / path animation."):e.err(`${a}.animation`,"Required.");const c={animation:l,delay:e.num(o,"delay",`${a}.delay`,0,600,0)??0,repeat:e.num(o,"repeat",`${a}.repeat`,1,100,1,!0)??1},d=e.num(o,"duration",`${a}.duration`,.05,600);void 0!==d&&(c.duration=d),r.push(c)}),r}(i,n.steps,"steps",r),l.loop=i.bool(n,"loop","loop",!0);const e=void 0===n.stagger||null===n.stagger?{}:i.obj(n.stagger,"stagger");e&&(l.stagger={children:i.bool(e,"children","stagger.children",!1),delay:i.num(e,"delay","stagger.delay",0,10,.1)??.1});break}}if(o)if(_t)"lenient"===t.v2?Object.assign(l,_t(n,new vt)):Object.assign(l,_t(n,i));else for(const e of xt)void 0===n[e]||null===n[e]||"clips"!==e&&"keyframes"!==o||(l[e]=n[e]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:l,errors:[]}}function $t(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},s=()=>{const r=n();if("("===r){i++;const t=a();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===r||"+"===r){i++;const e=s();return"-"===r?-e:e}const o=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!o)throw new Error(`Not a number in "${e}"`);return i+=o[0].length,Number(o[0])},r=()=>{let e=s();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=s();e="*"===t?e*n:e/n}return e},a=()=>{let e=r();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=r();e="+"===t?e+n:e-n}return e},o=a();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+o.toFixed(4)}function kt(e){const t=[];let i=0,n="";for(const s of e.trim())"("===s&&i++,")"===s&&i--," "===s&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}const Mt={x:[1,0,0],y:[0,1,0]};function St(e,t,i,n){const s=e.transform??={};switch(t){case"translate":{const[e,t="0"]=kt(i);return s.x=$t(e),void(s.y=$t(t))}case"scale":{const e=kt(i).map($t);return void(1===e.length?s.scale=e[0]:(s.scale_x=e[0],s.scale_y=e[1]))}case"rotate":{const e=kt(i);return s.rotate=$t(e[e.length-1]),void(2===e.length&&Mt[e[0]]?s.axis=Mt[e[0]]:4===e.length&&(s.axis=[$t(e[0]),$t(e[1]),$t(e[2])]))}case"opacity":return void(e.opacity=$t(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function jt(e){const t=ue(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of me(t))for(const t of n.offsets){const s=i.get(t)??{at:t};for(const[t,i]of n.decls)St(s,t,i,e);i.set(t,s)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}const Ct=e=>`${e.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}-custom`.slice(0,64);function At(e,t=Ct(e),i){const n=oe(e);if(!n)return;const s=n.defaults,r={id:t,name:i??(0,K.t)(n.name),kind:"keyframes",duration:parseFloat(s.duration),easing:s.easing,iterations:s.iterations,..."normal"!==s.direction?{direction:s.direction}:{},target:"element",origin:n.origin??"center",version:1};return n.channels.includes("fx")?{...r,kind:"particles",particles:{...rt,size:[...rt.size],colors:[],..."count"===n.particles?{count:Math.max(1,Math.round(s.intensity))}:{},layer:n.front?"front":"back",preset:n.id,intensity:s.intensity}}:{...r,keyframes:jt(n.id)}}var zt=i(3682),qt=Symbol("NOT_RESOLVED");function Et(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function Ht(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Lt(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var Vt=Et("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),Ot=["","~","null","Null","NULL"],Pt=Et("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Ot.indexOf(e)?null:qt,identify:e=>null===e,represent:()=>"null"}),Rt=Et("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:qt,identify:e=>null===e,represent:()=>"null"}),Nt=["","~","null","Null","NULL"],Dt=Et("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Nt.indexOf(e)?null:qt,identify:e=>null===e,represent:()=>"null"}),Tt=["true","True","TRUE"],Ft=["false","False","FALSE"],Bt=Et("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Tt.indexOf(e)||-1===Ft.indexOf(e)&&qt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),It=["true"],Zt=["false"],Wt=Et("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==It.indexOf(e)||-1===Zt.indexOf(e)&&qt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Kt=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],Ut=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Gt=Et("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==Kt.indexOf(e)||-1===Ut.indexOf(e)&&qt,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Yt=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Jt=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Xt=Et("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!Jt.test(e))return qt}else if(!Yt.test(e))return qt;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:qt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Qt=new RegExp("^-?(?:0|[1-9][0-9]*)$"),ei=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),ti=Et("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!ei.test(e))return qt}else if(!Qt.test(e))return qt;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:qt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ii=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),ni=Et("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!ii.test(e))return qt;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:qt},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),si=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ri=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ai=Et("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!si.test(e))return qt;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)||ri.test(e)?n:qt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),oi=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),li=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ci=Et("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!li.test(e))return qt;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)?n:qt}if(!oi.test(e))return qt;const i=Number(e);return Number.isFinite(i)?i:qt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),di=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),pi=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),hi=Et("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!di.test(e))return qt;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let n=0;if(t.includes(":")){for(const e of t.split(":"))n=60*n+Number(e);n*=i}else n=i*parseFloat(t);return Number.isFinite(n)||pi.test(e)?n:qt},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ui=Et("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":qt,identify:()=>!1}),mi=/^[A-Za-z0-9+/]*={0,2}$/,gi=Et("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!mi.test(t))return qt;const i=atob(t),n=new Uint8Array(i.length);for(let e=0;e<i.length;e++)n[e]=i.charCodeAt(e);return n},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),fi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),vi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function bi(e,t,i,n=0,s=0,r=0,a=0){const o=new Date(Date.UTC(e,t,i,n,s,r,a));return o.setUTCFullYear(e,t,i),o}var yi=Et("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=fi.exec(e);if(null===t&&(t=vi.exec(e)),null===t)return qt;const i=+t[1],n=+t[2]-1,s=+t[3];if(!t[4]){const e=bi(i,n,s);return e.getUTCFullYear()!==i||e.getUTCMonth()!==n||e.getUTCDate()!==s?qt:e}const r=+t[4],a=+t[5],o=+t[6];let l=0;if(r>23||a>59||o>59)return qt;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=bi(i,n,s,r,a,o,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==n||c.getUTCDate()!==s)return qt;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return qt;const n=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-n:n))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),xi=Ht("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function _i(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var wi=Ht("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!_i(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),$i=Ht("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,n=Object.keys(i);return 1!==n.length?"cannot resolve a pairs item":(e.push([n[0],i[n[0]]]),"")},identify:()=>!1}),ki=Lt("tag:yaml.org,2002:map",{create:()=>({}),identify:_i,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const n=String(t);return"__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Mi=Lt("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),Si=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let n=0;n<t.length;n++){const s=t[n];if(s.nodeKind===i.nodeKind&&s.tagName===i.tagName&&s.matchByTagPrefix===i.matchByTagPrefix){e=n;break}}t[e]=i}return t}(e),i=[],n={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},s={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?s.scalar.push(e):n.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?s.sequence.push(e):n.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?s.mapping.push(e):n.mapping[e.tagName]=e}}const r=i.filter(e=>null===e.implicitFirstChars),a=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)a.add(t);const o=new Map;for(const e of a)o.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=n.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=o,this.implicitScalarAnyFirstChar=r,this.defaultScalarTag=l,this.defaultSequenceTag=n.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=n.mapping["tag:yaml.org,2002:map"],this.exact=n,this.prefix=s}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==qt)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},ji=new Si([Vt,xi,ki]),Ci=(new Si([...ji.tags,Rt,Wt,ti,ci]),new Si([...ji.tags,Pt,Bt,Xt,ai]));function Ai(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}function zi(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}new Si([...ji.tags,Dt,Gt,ni,hi,yi,ui,gi,wi,$i,Mi]).withTags({...ni,resolve:(e,t,i)=>{const n=ni.resolve(e,t,i);return n===qt?Xt.resolve(e,t,i):n}},{...hi,resolve:(e,t,i)=>{const n=hi.resolve(e,t,i);return n===qt?ai.resolve(e,t,i):n}}),Lt("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||_i(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),Lt("tag:yaml.org,2002:map",{create:()=>({}),identify:_i,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const n=Ai(t);return null===n?"nested arrays are not supported inside keys":("__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,"")},has:(e,t)=>{const i=Ai(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Error;var qi=new Array(256),Ei=new Array(256);for(let e=0;e<256;e++)qi[e]=zi(e)?1:0,Ei[e]=zi(e);Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"}),Object.prototype.hasOwnProperty;var Hi=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Li=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;function Vi(e,t){return!!(e&1<<t)}new RegExp(`^(?:${Hi})*$`),new RegExp(`^(?:${Li})+$`),new RegExp(`^(?:!(?:${Hi})*|${Li}(?:${Hi})*)$`),Symbol("INVALID"),Symbol("visit:break"),Symbol("visit:skip");var Oi={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:Pi(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Vi(e.allowedStylesMask,4))return void(i&&(e.style=3));const n=e.presenterOptions.lineWidth;if(-1===n)return void(i&&(e.style=4));const s=Math.max(Math.min(n,40),n-e.shiftOfContent);let r=0,a=!1;for(;r<=t.length;){let e=t.length;const i=t.indexOf("\n",r);-1!==i&&(e=i);const n=t.slice(r,e);if(n.length>s&&" "!==n[0]&&/ [^ \t]/.test(n)&&(a=!0),-1===i)break;r=i+1}a?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||Vi(e.allowedStylesMask,1)||(e.style=Pi(e))},fallbackToDoubleQuoted:function(e){Vi(e.allowedStylesMask,e.style)||(e.style=3)}};function Pi(e){return"single"===e.presenterOptions.quoteStyle&&Vi(e.allowedStylesMask,2)?2:3}var Ri="[ \\t]",Ni="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Di=`(?:(?!${Ri})${Ni})`,Ti="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Fi="[-?:,\\[\\]{}#&*!|>'\"%@`]",Bi=`(?:(?![,\\[\\]{}])${Di})`,Ii=`(?:(?:(?![:#])${Di})|:(?=${Di}))#*`,Zi=`(?:(?:(?![:#])${Bi})|:(?=${Bi}))#*`,Wi=`(?:${Ri}*${Ii})*`,Ki=`(?:${Ri}*${Zi})*`,Ui=`(?:(?:(?!${Fi})${Di})|[?:-](?=${Di}))#*${Wi}`,Gi=`(?:(?:(?!${Fi})${Di})|[?:-](?=${Bi}))#*${Ki}`,Yi=Ui,Ji=Gi,Xi=`${Gi}(?:\\n+${Zi}${Ki})*`;new RegExp(`^(?:${Ui}(?:\\n+${Ii}${Wi})*)$`,"u"),new RegExp(`^(?:${Xi})$`,"u"),new RegExp(`^(?:${Yi})$`,"u"),new RegExp(`^(?:${Ji})$`,"u"),new RegExp(`^(?:${Ti})*$`,"u"),new RegExp(`^(?:${Ti}|\\n)*$`,"u"),new RegExp(`^(?:${Ni}|\\n)*$`,"u"),Object.keys(Oi).map(e=>Reflect.get(Oi,e)),Ci.withTags(ui);const Qi=64,en=48,tn=/^[a-z0-9][a-z0-9_-]{0,31}$/,nn=["element","icon","name","state","background"],sn=["rotate","x","y","scale","opacity","draw","color_mix","speed","rotate_speed"],rn=["cut","crossfade","finish"],an=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;function on(e,t,i,n){return Array.isArray(t)?t.length>n?e.err(`${i}[${n}]`,`At most ${n} entries.`):t:e.err(i,"Must be a list.")}function ln(e,t,i,n){const s="string"==typeof t.id?t.id.trim():"";return tn.test(s)?n.has(s)?e.err(`${i}.id`,`Duplicate id "${s}".`):(n.add(s),s):e.err(`${i}.id`,"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).")}function cn(e,t,i,n){if(void 0===t.name||null===t.name||""===t.name)return n;if("string"!=typeof t.name||!t.name.trim())return e.err(`${i}.name`,"Must be text.")??n;const s=t.name.trim();return s.length>80?e.err(`${i}.name`,"At most 80 characters.")??n:s}function dn(e,t,i){if(null!=t)return!Array.isArray(t)||2!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e)||Math.abs(e)>1e4)?e.err(i,"Must be two numbers [x, y]."):[t[0],t[1]]}function pn(e,t,i){return"string"==typeof t&&t.trim()?t.length>nt?e.err(i,"At most 8192 characters."):dt.test(t)&&/^\s*[Mm]/.test(t)?(0,fe.Mj)(t).some(e=>e.length)?t.trim().replace(/\s+/g," "):e.err(i,"The path draws nothing."):e.err(i,"Not valid path data (it must start with M)."):e.err(i,"Required.")}function hn(e,t,i,n){if("string"!=typeof t||!t.trim())return e.err(i,"Must be SVG markup.");if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>qe)return e.err(i,"The SVG is larger than 32 KB.");const s=n&&!/^\s*<svg[\s>]/i.test(t)?`<svg viewBox="0 0 24 24">${t}</svg>`:t;if(!/<svg[\s>]/i.test(s))return e.err(i,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=We(s);if(t.error)return e.err(i,t.error)}return t}function un(e,t,i,n){const s=function(e){if("string"!=typeof e)return;if(nn.includes(e))return{kind:e};const t=/^(part|group|shape):(.+)$/.exec(e);return t&&tn.test(t[2])?{kind:t[1],id:t[2]}:void 0}(t);if(!s)return e.err(i,"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.");if(void 0!==s.id){const t="part"===s.kind?n?.parts:"group"===s.kind?n?.groups:n?.shapes;if(!t?.some(e=>e.id===s.id))return e.err(i,`No ${s.kind} "${s.id}" in the rig.`)}return t}function mn(e,t){const i={},n=t=>void 0!==e[t]&&null!==e[t],s="keyframes"===e.kind;let r;return s&&n("rig")&&(r=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={parts:[]},r=void 0!==n.icon&&null!==n.icon&&""!==n.icon,a=void 0!==n.svg&&null!==n.svg&&""!==n.svg;if(r&&a&&e.err(i,"Set icon or svg, not both."),r&&("string"==typeof n.icon&&pt.test(n.icon.trim())?s.icon=n.icon.trim():e.err(`${i}.icon`,"Must be an icon id like mdi:bell.")),a){const t=hn(e,n.svg,`${i}.svg`,!1);t&&(s.svg=t)}const o=new Set,l=void 0===n.parts?[]:on(e,n.parts,`${i}.parts`,Qi);if(l?.forEach((t,n)=>{const r=`${i}.parts[${n}]`,a=e.obj(t,r);if(!a)return;const l=ln(e,a,r,o);if(!l)return;const c={id:l,name:cn(e,a,r,l)},d=void 0!==a.from&&null!==a.from;if(d===(void 0!==a.svg&&null!==a.svg&&""!==a.svg))return void e.err(r,"Set one of from or svg.");if(d){const t=e.list(a.from,`${r}.from`,256,1),i=[];t?.forEach((t,n)=>{"number"==typeof t&&Number.isInteger(t)&&t>=0&&t<=4095?i.push(t):e.err(`${r}.from[${n}]`,"Must be a subpath index (a whole number from 0).")}),c.from=i}else{const t=hn(e,a.svg,`${r}.svg`,!0);t&&(c.svg=t)}const p=dn(e,a.origin,`${r}.origin`);p&&(c.origin=p),s.parts.push(c)}),void 0!==n.groups&&null!==n.groups){const t=new Set(s.parts.map(e=>e.id)),r=[];on(e,n.groups,`${i}.groups`,16)?.forEach((n,s)=>{const a=`${i}.groups[${s}]`,l=e.obj(n,a);if(!l)return;const c=ln(e,l,a,o);if(!c)return;const d=[];e.list(l.parts,`${a}.parts`,Qi,1)?.forEach((i,n)=>{"string"==typeof i&&t.has(i)?d.includes(i)||d.push(i):e.err(`${a}.parts[${n}]`,"Not a part of this rig.")});const p={id:c,name:cn(e,l,a,c),parts:d},h=dn(e,l.origin,`${a}.origin`);h&&(p.origin=h),d.length&&r.push(p)}),s.groups=r}if(void 0!==n.shapes&&null!==n.shapes){const t=[];on(e,n.shapes,`${i}.shapes`,en)?.forEach((n,s)=>{const r=`${i}.shapes[${s}]`,a=e.obj(n,r);if(!a)return;const l=ln(e,a,r,o);if(!l)return;const c=pn(e,a.d,`${r}.d`),d={id:l,name:cn(e,a,r,l),d:c??"",layer:"over"},p=e.css(a,"fill",`${r}.fill`,"color");p&&(d.fill=p);const h=e.css(a,"stroke",`${r}.stroke`,"color");h&&(d.stroke=h);const u=e.num(a,"stroke_width",`${r}.stroke_width`,0,100);void 0!==u&&(d.stroke_width=u);const m=e.oneOf(a,"linecap",`${r}.linecap`,["round","butt","square"]);m&&(d.linecap=m),d.layer=e.oneOf(a,"layer",`${r}.layer`,["over","under"],"over")??"over";const g=dn(e,a.origin,`${r}.origin`);g&&(d.origin=g),c&&t.push(d)}),s.shapes=t}return s}(t,e.rig,"rig"),r&&(i.rig=r)),s&&n("tracks")&&(i.tracks=function(e,t,i){const n=[],s=new Set;return on(e,t,"tracks",24)?.forEach((t,r)=>{const a=`tracks[${r}]`,o=e.obj(t,a);if(!o)return;let l=un(e,o.target,`${a}.target`,i);l&&s.has(l)&&(l=e.err(`${a}.target`,"Another track already animates this target.")),l&&s.add(l);const c=!!l&&/^(part|group|shape):/.test(l),d=((void 0===o.keyframes?[]:on(e,o.keyframes,`${a}.keyframes`,40))??[]).map((t,i)=>bt(e,t,`${a}.keyframes[${i}]`,c)).filter(e=>!!e).sort((e,t)=>e.at-t.at),p={target:l??"element",keyframes:d};if(void 0!==o.origin&&""!==o.origin&&("string"==typeof o.origin&&ct.test(o.origin.trim())?p.origin=o.origin.trim():e.err(`${a}.origin`,'Use keywords, lengths or percentages, e.g. "50% 100%".')),void 0!==o.path&&null!==o.path){const t=e.obj(o.path,`${a}.path`);if(t){const i=pn(e,t.d,`${a}.path.d`);i&&(p.path={d:i,...void 0!==t.follow_rotation?{follow_rotation:e.bool(t,"follow_rotation",`${a}.path.follow_rotation`,!1)}:{}})}}l&&n.push(p)}),n}(t,e.tracks,r)),n("clips")&&(i.clips=function(e,t,i){const n=[],s=new Set(ne.map(e=>e.id));return on(e,t,"clips",12)?.forEach((t,r)=>{const a=`clips[${r}]`,o=e.obj(t,a);if(!o)return;const l=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["state","state_not","entity_on","above","below"].filter(e=>void 0!==n[e]&&null!==n[e]);if(1!==s.length)return e.err(i,"Set one of state, state_not, entity_on, above or below.");const r=s[0],a=n[r];if("state"===r||"state_not"===r){const t="boolean"==typeof a?a?"on":"off":"string"==typeof a||"number"==typeof a?String(a).trim():"";return!t||t.length>255?e.err(`${i}.${r}`,"Must be a state (text)."):"state"===r?{state:t}:{state_not:t}}if("entity_on"===r)return"boolean"==typeof a?{entity_on:a}:e.err(`${i}.entity_on`,"Must be true or false.");const o=e.num(n,r,`${i}.${r}`,-1e9,1e9);return void 0===o?void 0:"above"===r?{above:o}:{below:o}}(e,o.when,`${a}.when`),c="string"==typeof o.animation?o.animation.trim():"";let d=!0;if(c)if(Je(c)){const t=Xe(c);t===i?d=!!e.err(`${a}.animation`,"A clip cannot play its own document (use self)."):st.test(t)||(d=!!e.err(`${a}.animation`,"Not a valid animation id."))}else"self"===c||"none"===c||s.has(c)||(d=!!e.err(`${a}.animation`,"Must be self, none, a preset or custom:<id>."));else d=!!e.err(`${a}.animation`,"Required.");const p=e.oneOf(o,"transition",`${a}.transition`,rn);l&&d&&n.push({when:l,animation:c,...p?{transition:p}:{}})}),n}(t,e.clips,"string"==typeof e.id?e.id.trim():"")),s&&n("bindings")&&(i.bindings=function(e,t,i){const n=[];return on(e,t,"bindings",8)?.forEach((t,s)=>{const r=`bindings[${s}]`,a=e.obj(t,r);if(!a)return;const o=un(e,a.target,`${r}.target`,i),l=e.oneOf(a,"property",`${r}.property`,sn);void 0===a.property&&e.err(`${r}.property`,"Required.");const c=e.obj(a.input,`${r}.input`);let d,p;if(c){const t=e.num(c,"min",`${r}.input.min`,-1e9,1e9,0),i=e.num(c,"max",`${r}.input.max`,-1e9,1e9,100);void 0!==t&&void 0!==i&&t===i?e.err(`${r}.input.max`,"Must differ from min."):void 0!==t&&void 0!==i&&(d={min:t,max:i}),void 0!==c.attribute&&null!==c.attribute&&""!==c.attribute&&("string"==typeof c.attribute&&an.test(c.attribute.trim())?d=d&&{attribute:c.attribute.trim(),...d}:(e.err(`${r}.input.attribute`,"Must be an attribute name."),d=void 0))}const h=a.output;if(Array.isArray(h)&&2===h.length)if("color_mix"===l){const t=lt(h[0],"color"),i=lt(h[1],"color");t&&i?p=[t,i]:e.err(`${r}.output`,"color_mix needs two colours.")}else h.every(e=>"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=1e6)?p=[h[0],h[1]]:e.err(`${r}.output`,"Must be two numbers (colours only for color_mix).");else e.err(`${r}.output`,"Must be a pair [from, to].");const u=e.num(a,"smoothing",`${r}.smoothing`,0,10);o&&l&&d&&p&&n.push({target:o,property:l,input:d,output:p,...void 0!==u?{smoothing:u}:{}})}),n}(t,e.bindings,r)),i}_t=mn;const gn=e=>+e.toFixed(4);function fn(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}const vn=e=>`mcc-${e.id}-${fn(JSON.stringify(e))}`,bn=(e,t)=>`--mcc-${e}-${t}`;function yn(e){return G.find(t=>t.id===e)?.css??e??"ease"}const xn=e=>({len:(t,i)=>0===t?`0${i}`:`calc(${gn(t)}${i} * var(${bn(e,"i")}, 1))`,scale:t=>1===t?"1":`calc(1 + ${gn(t-1)} * var(${bn(e,"i")}, 1))`,color:t=>((e,t)=>t?e.replace(/var\(\s*--mc-anim-c\s*\)/g,(e=>`color-mix(in srgb, var(${bn(e,"c")}, var(--mc-anim-c)) calc(var(${bn(e,"s")}, 1) * 100%), transparent)`)(t)):e)(t,e)}),_n=(e=1)=>({len:(t,i)=>`${gn(t*e)}${i}`,scale:t=>String(gn(1+(t-1)*e)),color:e=>e});function wn(e,t){const i=[],n=e.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${t.len(n.x??0,"px")} ${t.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const e=n.scale??1,s=e*(n.scale_x??1),r=e*(n.scale_y??1);i.push(["scale",s===r?t.scale(s):`${t.scale(s)} ${t.scale(r)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${t.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${t.len(n.skew_x??0,"deg")}, ${t.len(n.skew_y??0,"deg")})`])}if(void 0!==e.opacity&&i.push(["opacity",String(e.opacity)]),e.color&&i.push(["color",t.color(e.color)]),e.background&&i.push(["background",t.color(e.background)]),e.shadow&&i.push(["box-shadow",t.color(e.shadow)]),void 0!==e.filter||void 0!==e.blur){const n=[e.filter&&"none"!==e.filter?t.color(e.filter):"",void 0!==e.blur?`blur(${t.len(e.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==e.radius&&i.push(["border-radius",`${e.radius}px`]),void 0!==e.draw&&i.push(["stroke-dashoffset",String(gn(1-e.draw))]),e.stroke&&i.push(["stroke",t.color(e.stroke)]),e.easing&&i.push(["animation-timing-function",yn(e.easing)]),i}const $n=(e,t)=>`  ${e} { ${t.map(([e,t])=>`${e}: ${t};`).join(" ")} }`,kn=(e,t)=>`@keyframes ${e} {\n${t.join("\n")}\n}`,Mn={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function Sn(e,t,i){const n=t.map(e=>wn(e,i)),s=Object.keys(Mn).filter(e=>t.some(t=>Mn[e].some(e=>void 0!==t.easings?.[e]))),r=kn(e,t.map((e,t)=>$n(`${gn(e.at)}%`,n[t].filter(([e])=>!s.includes(e)))));if(!s.length)return{css:r,lanes:[]};const a=[],o=[r];for(const i of s){const s=`${e}-l${Mn[i][0]}`,r=[];t.forEach((e,t)=>{const s=n[t].filter(([e])=>e===i);if(!s.length)return;const a=Mn[i].map(t=>e.easings?.[t]).find(e=>void 0!==e)??e.easing;r.push($n(`${gn(e.at)}%`,a?[...s,["animation-timing-function",yn(a)]]:s))}),r.length&&(a.push(s),o.push(kn(s,r)))}return{css:o.join("\n"),lanes:a}}const jn=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase()),Cn=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,r=3*i*t*t,a=t*t*t;return[n*e[0][0]+s*e[1][0]+r*e[2][0]+a*e[3][0],n*e[0][1]+s*e[1][1]+r*e[2][1]+a*e[3][1]]};function An(e,t=48){const i=(0,fe.Mj)(e).flat();if(!i.length)return[];const n=[i[0][0]];for(const e of i)for(let t=1;t<=16;t++)n.push(Cn(e,t/16));const s=[0];for(let e=1;e<n.length;e++)s.push(s[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const r=s[s.length-1],a=e=>{if(0===r)return n[0];let t=1;for(;t<s.length-1&&s[t]<e;)t++;const i=s[t]-s[t-1]||1,a=Math.min(1,Math.max(0,(e-s[t-1])/i));return[n[t-1][0]+(n[t][0]-n[t-1][0])*a,n[t-1][1]+(n[t][1]-n[t-1][1])*a]},o=[];let l;const c=r/(4*t)||.001;for(let e=0;e<=t;e++){const i=r*e/t,n=a(i),s=a(Math.max(0,i-c)),d=a(Math.min(r,i+c));let p=180*Math.atan2(d[1]-s[1],d[0]-s[0])/Math.PI;if(void 0!==l){for(;p-l>180;)p-=360;for(;p-l<-180;)p+=360}l=p,o.push({t:e/t,x:n[0],y:n[1],angle:p})}return o}function zn(e,t,i){return An(e.d).map(n=>{const s=[["translate",`${t.len(gn(n.x),i[0])} ${t.len(gn(n.y),i[1])}`]];return e.follow_rotation&&s.push(["rotate",`${gn(n.angle)}deg`]),[gn(100*n.t),s]})}const qn=.618034,En=e=>e-Math.floor(e);function Hn(e){const t=e.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(t)}")`}function Ln(e,t){if(!e)return"border-radius: 50%; background: currentColor;";if("svg"in e){const i=t(e.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=Hn(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const Vn=e=>e&&"icon"in e?{icon:e.icon}:e&&"emoji"in e?{text:e.emoji}:void 0;function On(e,t=100){const i=e.count;return Array.from({length:i},(n,s)=>{const r=(En(s*qn)-.5)*(60/i),a=Math.min(96,Math.max(4,(s+.5)/i*100+r)),o=50+t/100*(a-50),l=e.size[0]+(e.size[1]-e.size[0])*En(.381966*s+.25),c=e.colors.length?e.colors[s%e.colors.length]:"",d=[`--mcc-sz: ${gn(l)}px`,"--mcc-sp: "+(s%2?-1:1),`--mcc-dx: ${gn(16*(2*En(.7548*s)-1))}`,c&&`--mcc-pc: ${c}`].filter(Boolean).join("; ");return{x:gn(o),phase:gn(En(s*qn)),k:i>1?gn(s/i):0,style:d}})}const Pn=(e,t)=>`.mc-anim-fx[data-fx="${e}"] { opacity: var(${bn(t,"s")}, 1); }\n.mc-anim-fx[data-fx="${e}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${bn(t,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function Rn(e,t,i,n){const s=i.fade?0:1,r=`calc(var(--mcc-sp, 1) * ${gn(i.spin)}deg)`,a=i.gravity,o=`${gn(i.spread/2)}cqmin`,l=a>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":a<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let c,d;switch(i.direction){case"fall":case"rise":{const e="fall"===i.direction?"":"-";c="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s};${l} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${e}100cqh ${e?"-":"+"} var(--mcc-sz) * 2); rotate: ${r}; opacity: ${s}; }`];break}case"drift":c="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${gn(15*a)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${gn(30*a)}cqh; rotate: ${r}; opacity: ${s}; }`];break;case"burst":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(${r}); translate: 0 ${gn(30*a)}cqh; opacity: ${s}; }`];break;case"orbit":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: 1; }`].filter(Boolean);break;case"spiral":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${s}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${o} * -1)) rotate(${r}); opacity: ${s}; }`]}return`${Pn(e,t)} ${c} ${Ln(i.shape,n)} }\n${kn(e,d)}`}function Nn(e,t,i,n,s){const r=xn(t),a=i.follow_rotation?"auto":"0deg",o=e=>kn(e,zn(i,r,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([e,t])=>$n(`${e}%`,[...t,["opacity","1"]]))),l=`${Pn(e,t)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${Ln(n.shape,s)} }`;if("px"!==i.units)return`${l}\n${o(e)}`;const c='offset-path: path("M0 0 L1 1")';return[l,`@supports (${c}) {`,`  .mc-anim-fx[data-fx="${e}"] > i { offset-path: path("${i.d}"); offset-rotate: ${a}; offset-anchor: center; margin: 0; }`,`  @keyframes ${e} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${c}) {`,o(e),"}"].join("\n")}function Dn(e,t){const i=[],n=[];let s=0;const r="icon"===e.target;return(e.steps??[]).forEach((e,a)=>{let o,l,c,d=e.duration;if(Je(e.animation)){const i=t?.(Xe(e.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(o=function(e,t=1){if("path"===e.kind&&e.path)return zn(i=e.path,_n(t),"px"===i.units?["px","px"]:["%","%"]).map(([e,t])=>({...Object.fromEntries(t.map(([e,t])=>[jn(e),t])),offset:gn(e/100)}));var i;if("keyframes"!==e.kind||!e.keyframes)return[];const n=new Map;for(const i of e.keyframes){const e=n.get(i.at)??{};for(const[n,s]of wn(i,_n(t)))e[jn(n)]=s;n.set(i.at,e)}return[...n.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:gn(e/100)}))}(i),d??=i.duration,l=yn(i.easing),c=i.origin)}else{const t=oe(e.animation);o=t&&!t.channels.includes("fx")?function(e,t={}){const i=oe(e);if(!i)return;const n=ue(t.icon&&i.iconKeyframes?`${e}-icon`:e,t.intensity);return void 0===n?void 0:function(e){const t=new Map;for(const i of e)for(const e of i.offsets){const n=t.get(e)??{};for(const[e,t]of i.decls)n[ge(e)]=t;t.set(e,n)}return[...t.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:+(e/100).toFixed(4)}))}(me(n))}(t.id,{icon:r}):void 0,t&&(d??=parseFloat(t.defaults.duration),l=yn(t.defaults.easing),c=t.origin)}if(!o?.length||!d)return void n.push(a);const p=s+e.delay;i.push({start:gn(p),duration:d,iterations:e.repeat,easing:l??"ease",frames:o,...c&&"center"!==c?{origin:c}:{}}),s=p+d*e.repeat}),{steps:i,total:gn(s),loop:!1!==e.loop,target:e.target,...e.stagger?.children?{stagger:e.stagger.delay}:{},skipped:n}}const Tn=new WeakMap;function Fn(e,t={}){const i=!t.reducedMotion&&(e=>"particles"===e.kind&&!!e.particles?.sim&&!e.particles.preset)(e);let n=i&&function(e){if(Ge.failedSims.has(e.id))return;In!==Ge.epoch&&(Bn=new WeakMap,In=Ge.epoch);let t=Bn.get(e);const i=e.particles;try{const n=Ge.particles&&!t&&Ge.checkSim?.(i.sim,"lenient",{count:i.count,layer:i.layer}).sim;if(n){const s={...i,sim:n},r=e.duration/i.speed,a=Ge.particles(e.id,s,r,{aspect:0}),o=a.other;Bn.set(e,t={kind:"particles",name:a.name,css:o?`${a.css}\n${o.css}`:a.css,layer:{front:a.front,particles:a.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:r},...o?{split:{name:o.name,layer:{front:o.front,particles:o.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:r,part:1}}}:{}})}}catch{Ge.failedSims.add(e.id)}return t}(e)||function(e,t){if(t.reducedMotion)return{kind:e.kind,name:"",css:"",reduced:!0,..."sequence"===e.kind?{schedule:{steps:[],total:0,loop:!1,target:e.target,skipped:[]}}:{}};if("sequence"===e.kind)return{kind:"sequence",name:vn(e),css:"",schedule:Dn(e,t.lookup)};const i=Tn.get(e);if(i)return i;const n=vn(e),s=e=>We(e).markup;let r;switch(e.kind){case"keyframes":{const{css:t,lanes:i}=Sn(n,e.keyframes??[],xn(e.id));r={kind:"keyframes",name:n,css:t,motion:{target:e.target,origin:e.origin},...i.length?{lanes:i}:{}};break}case"particles":{const t=e.particles;if(t.preset){r={kind:"particles",name:"",css:"",preset:{id:t.preset,...void 0!==t.intensity?{intensity:t.intensity}:{}}};break}r={kind:"particles",name:n,css:Rn(n,e.id,t,s),layer:{front:"front"===t.layer,particles:On(t,t.spread),speed:t.speed,...Vn(t.shape)?{symbol:Vn(t.shape)}:{}}};break}case"path":{const t=e.path;if("particles"===t.subject){const i=t.particles??{count:3,size:[8,8],colors:[]};r={kind:"path",name:n,css:Nn(n,e.id,t,i,s),layer:{front:!1,particles:On(i),speed:1,...Vn(i.shape)?{symbol:Vn(i.shape)}:{}}};break}const i=zn(t,xn(e.id),"px"===t.units?["px","px"]:["%","%"]).map(([e,t])=>$n(`${e}%`,t));r={kind:"path",name:n,css:kn(n,i),motion:{target:"icon"===t.subject?"icon":"element",origin:e.origin}};break}}return Tn.set(e,r),r}(e,t);return i&&!Ge.particles&&(n={...n,needsParticles:!0}),Ge.v2&&Ue(e)?{...n,v2:Ge.v2(e,t)}:n}let Bn=new WeakMap,In=0;const Zn=new WeakMap,Wn=new WeakMap;function Kn(e){let t=Wn.get(e);if(!t){const i={...e};delete i.rig,delete i.tracks,delete i.clips,delete i.bindings,t={...i,...mn(e,new vt)},Wn.set(e,t)}return t}function Un(e,t={}){if(t.reducedMotion||!Array.isArray(e.tracks)||!e.tracks.length)return[];let i=Zn.get(e);return i||Zn.set(e,i=function(e,t){const i=xn(e.id);return(e.tracks??[]).map((e,n)=>{const s=`${t}-t${n}`,r=[],a=[];if(e.keyframes.length){const t=Sn(s,e.keyframes,i);r.push(t.css),a.push(...t.lanes)}if(e.path){const t=e.keyframes.length?`${s}-path`:s,n={d:e.path.d,units:"px",follow_rotation:!!e.path.follow_rotation,subject:"element"};r.push(kn(t,zn(n,i,["px","px"]).map(([e,t])=>$n(`${e}%`,t)))),t!==s&&a.push(t)}return{target:e.target,name:s,css:r.join("\n"),...e.origin?{origin:e.origin}:{},...a.length?{lanes:a}:{}}})}(Kn(e),vn(e))),i}Ge.v2=function(e,t={}){const i=Kn(e),n=Un(e,t),s=[],r=i.clips?.filter((i,n)=>{if(!Je(i.animation))return!0;const r=t.lookup?.(Xe(i.animation));return!(r===e||r&&Array.isArray(r.clips)&&r.clips.length)||(s.push(n),!1)});return{tracks:n,...i.rig?{rig:i.rig}:{},...r?{clips:r}:{},...i.bindings?{bindings:i.bindings}:{},...s.length?{skipped:s}:{}}};const{t:Gn,tx:Yn,m:Jn,locale:Xn}=(0,W.my)("anim-studio",["\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|0.1 s|1%|30 fps|5%|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A sequence cannot play itself.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add colour|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation colour|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrow keys move the cursor, Enter places points, Escape cancels.|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and colour come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text colour inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first colour to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customise one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Centre|Change count|Change fill|Change point type|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child colour|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, or choose Finish path.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse {name}|Collide with|Collisions|Colour|Colour mix|Colour {i}|Colour {n}|Colour {n}: entity colour|Colour {n}: {colour}|Colour: currentColor|Colours|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner radius|Corner radius (icon units)|Couldn't load the drawing tools.|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Cursor at x {x}, y {y}. Press Enter to add a point.|Cursor at x {x}, y {y}. Press Enter to finish.|Cursor at x {x}, y {y}. Press Enter to start.|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customise a preset|Customise a preset…|Customise one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete handle|Delete keyframe|Delete keyframes|Delete point|Delete points|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the centre.|Drag to draw. Shift: square, Alt: from the centre.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing cancelled.|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity colour|Entity is off|Entity is on|Entity value|Erase|Event|Expand|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill colour|Filter|Filter presets|Finish cycle|Finish path|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From colour|From{unit}|Front door|Glow|Got it|Gravity|Gravity direction|Gravity {strength} {direction}|Greyscale|Grid|Group|Group pivot|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide {noun} ({keys})|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|Inspector panel|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Layers panel|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximise|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move away from the start first.|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path|Move path point|Move pivot|Move point|Move points|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and colour on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colours only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New in this release|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colours: particles use the animation colour.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or colour this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation colour.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid colour.|Not a valid easing.|Not an allowed shadow: x y blur spread colour.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open path|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child colour|Own timeline|Paint|Part|Part actions|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colours in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.|Pause (Space)|Pause preview|Pen|Pen. Click to add points, click the first point to close.|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {count} placed. Enter again on the same spot finishes the stroke.|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Pseudo RTL|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Reload page|Reloading the page discards changes that are not saved. Reload anyway?|Remove|Remove colour|Remove colour {i}|Remove colour {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow colour|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape points. Drag a point to move it.|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes over the icon|Shapes under the icon|Shortcut: {keys}|Show all|Show all hidden layers|Show in preview|Show {noun} ({keys})|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Some panels are hidden, as you left them. Use the arrows on the edges to show them.|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Started at x {x}, y {y}. Move the cursor and press Enter to finish. Escape cancels.|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke colour|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colours become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon colour|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The colour is not a valid CSS colour: the file uses currentColor.|The drawing tools are not loaded yet.|The drawing tools are ready.|The drawing tools on this page are from another Magic Card version. Reload the page to draw here.|The entity colour button uses the animation colour (the card entry's colour, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count, plural, one {# shape} other {# shapes}}: {parts, plural, one {the first # became a part} other {the first # became parts}} (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The layers panel is hidden, as you collapsed it before. Use the arrow on the edge to show it.|The library holds at most {cap, plural, one {# animation} other {# animations}}: only {fit, plural, one {# more fits} other {# more fit}}, {skipped, plural, one {# was} other {# were}} not imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this colour: while it plays, its colour wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To colour|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a colour or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colours|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colours.|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|inspector|keyframe|keyframe track|keyframe tracks of {name}|layers|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{cLIPS_MAX, plural, one {At most # state.} other {At most # states.}}|{cap, plural, one {The library is full (# animation): nothing was imported.} other {The library is full (# animations): nothing was imported.}}|{colours, plural, one {At most # colour} other {At most # colours}}|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and colour this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# part} other {# parts}}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# target selected: a preset plays on each (Wave: one after another).} other {# targets selected: a preset plays on each (Wave: one after another).}}|{count, plural, one {# target} other {# targets}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {At most # shape fits in a rig.} other {At most # shapes fit in a rig.}}|{count, plural, one {Delete # keyframe} other {Delete # keyframes}}|{count, plural, one {Erase shape} other {Erase shapes}}|{count, plural, one {Group of # part} other {Group of # parts}}|{count, plural, one {Group removed} other {Groups removed}}|{count, plural, one {Grouped # part} other {Grouped # parts}}|{count, plural, one {Import shape} other {Import shapes}}|{count, plural, one {Replace # part} other {Replace # parts}}|{count, plural, one {Split into # part} other {Split into # parts}}|{count, plural, one {Split into # part} other {Split into # parts}} (the first {parts})|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count, plural, one {{name} added, # point.} other {{name} added, # points.}}|{count} of {colours}|{emitters, plural, one {At most # emitter.} other {At most # emitters.}}|{from} to {to}{unit}|{groups, plural, one {A rig has at most # group.} other {A rig has at most # groups.}}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{mAX_SHAPES, plural, one {At most # shape} other {At most # shapes}}|{max, plural, one {At most # animation.} other {At most # animations.}}|{max, plural, one {At most # binding per animation.} other {At most # bindings per animation.}}|{max, plural, one {At most # character.} other {At most # characters.}}|{max, plural, one {At most # entry.} other {At most # entries.}}|{max, plural, one {At most # particle over all emitters.} other {At most # particles over all emitters.}}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} added.|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{panels} hidden|{panels} shown|{particles, plural, one {# particle} other {# particles}} · {emitters, plural, one {# emitter} other {# emitters}}|{parts, plural, one {# part} other {# parts}}, {shapes, plural, one {# shape} other {# shapes}}|{parts, plural, one {# part} other {# parts}}, {shapes, plural, one {# shape} other {# shapes}}, no icon|{pct} % of the input range|{pct}, {seconds} seconds|{pieces, plural, one {Part of # shape} other {Part of # shapes}}|{preset} on {targets}|{room, plural, one {The SVG has too many shapes; at most # fits.} other {The SVG has too many shapes; at most # fit.}}|{seconds} s loop|{shapes, plural, one {At most # shape fits in a rig.} other {At most # shapes fit in a rig.}}|{size} KB|{size} icon units|{steps, plural, one {A sequence has at most # step.} other {A sequence has at most # steps.}}|{steps, plural, one {At most # step} other {At most # steps}}|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{tracks, plural, one {At most # animated target.} other {At most # animated targets.}}|{tracks, plural, one {This animation has # animated target, the most it can hold. Remove it to animate this part.} other {This animation has # animated targets, the most it can hold. Remove one to animate this part.}}|{where} · {from} to {to}","|||||||||||||||||||||||||||Add color|||||||||||||||||||||||||||||||||||||||Animation color|||||||||||||||||||Between {min} and {max}; empty uses {intensity}. Timing and color come from the animation settings.|||||Black in an <img>, the text color inline.|||||Blends from the first color to the second.||||||||||||||||Build one from scratch or customize one of the presets. Saved animations appear in every card's animation picker, under My animations.|||||||||||||||||Center|||||||||Child color|||||||||||||||||||||||||||||Color|Color mix|Color {i}|Color {n}|Color {n}: entity color|Color {n}: {colour}|Color: currentColor|Colors|||||||||||||||||||||||||||||||||||Customize a preset|Customize a preset…|Customize one of {count}||||||||||||||||||||||||||||||||||||||||||Drag to draw. Shift: circle, Alt: from the center.|Drag to draw. Shift: square, Alt: from the center.||||||||||||||Drawing canceled.||||||||||||||||||||||||||||||||||||Entity color||||||||||||||||||||Fill color||||||||||||||||||||||||From color||||||||Grayscale|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Maximize|||||||||||||||||||||||||||||||||||||||||||||||||||Move, scale, turn and color on a timeline||||||||||||||||||||||||||||||||||||Must be two numbers (colors only for color_mix).||||||||||||||||||||||||||No colors: particles use the animation color.|||||No keys yet. Add keys on the timeline to rotate, move, scale, fade or color this part.|||||||||None set: the particles take the animation color.|||||Not a valid color.||Not an allowed shadow: x y blur spread color.|||||||||||||||||||||||||||||||||||||||||||Own child color||||||||||||||||||Particles take the colors in turn. Pick one to change it.|||||||||||Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle color.|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Remove color|Remove color {i}|Remove color {n}||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Shadow color||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Stroke color|||Swaps the preset for your own particles: shape, movement, size and colors become editable.|||||||Text and icon color|||||||||||||||||||The color is not a valid CSS color: the file uses currentColor.||||The entity color button uses the animation color (the card entry's color, else the entity's).||||||||||||||||||||||||||||||||||||||||||The timeline also animates this color: while it plays, its color wins over this binding.|||||||||||||||||||||||||To color||||||||||||||||||||||||||||||||||||||||Use a color or a gradient.||||||||||Use the parent's colors||||||||||||||||||||||||||||||||||||||||color_mix needs two colors.|||||||||||||||||||||||||||||||||||||||||||||||||||||||||{colours, plural, one {At most # color} other {At most # colors}}|||||||||{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and color this part there.|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||",'"{name}" heeft wijzigingen die nog niet zijn opgeslagen.|"{name}" had de vorige keer wijzigingen die niet zijn opgeslagen.|% van de grootte||, groot|, {count} overgeslagen|. Tekst, pictogrammen en achtergrond van de kaart.|0 trekt omlaag, 90 naar links, 180 omhoog, 270 naar rechts.|0 stopt bij de botsing, 1 kaatst terug op volle snelheid.|0,1 s||||; {skipped} overgeslagen (niet voor dit doel of deze baan)|Een ingebakken lus houdt levensduren binnen één lus.|Een clip kan zijn eigen document niet afspelen (gebruik self).|Een SVG-bestand van de animatie dat zich herhaalt|Een SVG-bestand van de ingebakken deeltjes dat zich herhaalt|Een reeks kan zichzelf niet afspelen.|Een reeks duurt zo lang als haar stappen. Kaarten kunnen haar nog schalen met hun Duur.|Een reeks heeft minstens één stap nodig|Ongeveer {percent}% van de deeltjes|Een keyframe toevoegen op de afspeelkop|Een eigenschap toevoegen aan {target}|Voeg een vorm toe om vormen te mengen. Elke vorm krijgt een gewicht.|Een {name}-keyframe toevoegen op de afspeelkop|Toevoegen als vormen|Kleur toevoegen|Emitter toevoegen|Keyframe toevoegen|Bewegingspad toevoegen|Punt toevoegen|Eigenschap toevoegen|Eigenschap toevoegen aan {target} op de afspeelkop ({at})|Vorm toevoegen|Status toevoegen|Stap toevoegen|Voeg de animaties toe die na elkaar worden afgespeeld.|Voeg de tekening toe als vormen over het pictogram, of gebruik haar als het pictogram zelf.|Waardekoppeling toevoegen|{lane}-keyframe toevoegen|{name}-keyframe toevoegen op de afspeelkop|Voegt willekeurige wervelingen toe aan de beweging.|Alarmpaneel|Alle|Alle domeinen|Alle lagen getoond|Alle lagen getoond. Vergrendelingen blijven behouden.|Alle deeltjes|Staat al onderaan|Staat al bovenaan|Ook op {at}|Alt+pijl-omlaag|Alt+pijl-omhoog|Alt+omlaag|Alt+omhoog|Afwisselend|Afwisselend omgekeerd|Een open lijn wordt getekend met haar lijn.|Ankerpunten|Hoek|Hoek (gr.)|De onderdelen van een pictogram animeren|Geanimeerde SVG|Geanimeerde SVG gekopieerd|Animatie|Animatiekleur|Animatie-instellingen (Esc)|Animatiestudio|Een andere track animeert dit doel al.|Boog|Met de pijltjestoetsen verplaats je de cursor, Enter zet punten, Escape annuleert.|Pijltjes verplaatsen het keyframe, Alt en pijltjes gaan naar het volgende, Delete verwijdert het.|Aan het einde van de levensduur|Op de afspeelkop: {filter}|Op de afspeelkop: {text}|Op {at} · {secs} s|Attribuut|Attribuutnamen gebruiken letters, cijfers, _ . en - (geen spaties).|Attribuutnamen gebruiken letters, cijfers, _ . en -.|Achtergrond|Ingebakken lus|Bezig met inbakken…|Gebaseerd op een ingebouwde {kind}|Achter de inhoud|Tussen {min} en {max}; leeg gebruikt {intensity}. Timing en kleur komen uit de animatie-instellingen.|Binaire sensor|Koppeling toegevoegd: {property}.|Koppeling verwijderd.|Koppeling {n}|Zwart in een <img>, de tekstkleur inline.|Lege keyframes|Lege deeltjes|Leeg pad|Lege reeks|Vloeit van de eerste kleur naar de tweede.|Vervagen|Vervaging heeft een eigen baan en wordt aan deze lijst toegevoegd.|Onder|Linksonder|Rechtsonder|Stuiteren|Verhelderen|Naar voren halen|Over het pictogram halen|Vorm naar voren halen|Vorm over het pictogram halen|{name} naar voren halen|{name} over het pictogram halen|Browsers spelen de CSS-keyframes af.|Browsers spelen de CSS-keyframes af; de SMIL-kopie speelt waar CSS-animatie ontbreekt.|Bouw er een vanaf nul of pas een van de voorinstellingen aan. Opgeslagen animaties staan in de animatiekiezer van elke kaart, onder Mijn animaties.|Uitbarsting|Knop|Agenda||Annuleren|Kan niet afspelen|Kaart|Kaart-YAML gekopieerd: plak hem in een module|Kaart-YAML om te kopiëren|Kaartinhoud|Kaartinhoud. Tekst, pictogrammen en achtergrond van de kaart.|Kaartonderdelen|Kaartthema|Kaarten die hem gebruiken, spelen hem niet meer af, tenzij ze een kopie insluiten.|Kaarten gebruiken hem als|Plafond|Midden|Aantal wijzigen|Vulling wijzigen|Puntsoort wijzigen|Snelheid wijzigen|Spreiding wijzigen|Lijn wijzigen|Gewicht wijzigen|Wijzigt ook de laatste lijn. De stippellijn is wat je tekende.|Kleur van kind|Kinddeeltjes|Kinddeeltjes van {name}|Kindvorm|Kinderen barsten uit vanaf het punt waar ze ontstaan.|Kinderen kunnen geen eigen kinderen hebben.|Kies een voorinstelling|Kies een .svg-bestand.|Kies een andere|Bestand kiezen|Cirkel|Pad wissen|Zoekopdracht wissen|Klik op een onderdeel om het op de tijdlijn te animeren. Shift of Ctrl voegt toe aan de selectie; dubbelklik of F2 hernoemt. H verbergt, S solo, L vergrendelt (alleen voorbeeld).|Klik op een vorm om hem te selecteren, sleep om hem te verplaatsen.|Klik of sleep over vormen om ze te verwijderen.|Klik op het canvas om een punt toe te voegen, klik op de lijn om er een in te voegen.|Klik om punten toe te voegen, sleep voor bochten. Klik op het eerste punt om te sluiten, of kies Pad afronden.|Klik om het volgende punt toe te voegen|Klik om het eerste punt te plaatsen|Klimaat|Sluiten|Pad sluiten|Gesloten|Gesloten pad|Samenvoegen|{name} inklappen|Botsen met|Botsingen|Kleur|Kleurmenging|Kleur {i}|Kleur {n}|Kleur {n}: entiteitskleur|Kleur {n}: {colour}|Kleur: currentColor|Kleuren|Veelgebruikte emoji|Klaar op|Bevat een link.|Bevat een element dat iets uitvoert of ophaalt.|Bevat een gebeurtenis-handler.|Bevat een externe verwijzing.|Inhoudsvak|Zet het voorinstel om naar eigen deeltjes om het te exporteren.|Omzetten naar eigen deeltjes|Kopieert pictogram: svg en de SVG als kaart-YAML|Kopiëren|Kopiëren (Ctrl+C)|SVG kopiëren|Kopiëren mislukt: selecteer de tekst hieronder en kopieer hem|Keyframes kopiëren|Kopieer eerst keyframes|Hoekstraal|Hoekradius (pictogrameenheden)|De tekengereedschappen konden niet worden geladen.|Aantal|Aantal per keer|Bedekkend|Overvloeien|Ctrl + scrollwiel zoomt|||Cursor op x {x}, y {y}. Druk op Enter om een punt toe te voegen.|Cursor op x {x}, y {y}. Druk op Enter om af te ronden.|Cursor op x {x}, y {y}. Druk op Enter om te beginnen.|Gebogen|Aangepast|Eigen as ({axis})|Eigen curve|Eigen status|Een voorinstelling aanpassen|Een voorinstelling aanpassen…|Een van de {count} aanpassen|Knippen|Cyclus|Donkere kaart|Standaard|Standaard ({inherited})|Vertraging|Vertraging tussen kinderen|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf ({seconds} s).|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf.|Verwijderen|"{name}" verwijderen?|Verwijderen (Del)|Koppeling verwijderen|Koppeling {n} verwijderen|Handvat verwijderen|Keyframe verwijderen|Keyframes verwijderen|Punt verwijderen|Punten verwijderen|Vorm verwijderen|Status verwijderen|Status {i} verwijderen|Stap verwijderen|Stap {i} verwijderen|{name} verwijderen|"{name}" verwijderd.|Verwijderen mislukt: {message}||Apparaattracker|Richting|Verwerpen|Domein|Deurbel|Stip|Dubbelklik op een punt om het glad of een hoekpunt te maken.|.svg downloaden|Download gestart|Slepen|Sleep een ervan op de tijdlijn, of gebruik de pijltjestoetsen, om ze samen te verplaatsen.|Sleep punten en handvatten.|Sleep om een lijn te tekenen.|Sleep om te tekenen. Shift: cirkel, Alt: vanuit het midden.|Sleep om te tekenen. Shift: vierkant, Alt: vanuit het midden.|Sleep om te verplaatsen (klikt vast; Shift: vrij, Alt: dupliceren). Ctrl-klik voegt een key toe, Shift-klik selecteert een bereik. Pijltjes verplaatsen, Alt en pijltjes gaan naar de volgende key, Delete verwijdert.|Sleep om te herschikken (Alt+omhoog / Alt+omlaag)|Sleep om het canvas te vergroten of verkleinen (dubbelklik: herstellen)|Sleep, of druk op Alt+omhoog of Alt+omlaag, om de stap te verplaatsen.|Tekenen|Teken vrij; de lijn wordt gladgestreken als je loslaat.|Bewegingspad tekenen|Tekenen uit|Tekenen aan|Teken op het canvas waar de vorm langs gaat, beginnend waar hij rust.|Teken het pad dat het geselecteerde onderdeel volgt, beginnend waar het rust.|Tekenen is alleen voor pictogramonderdelen en vormen.|Tekening|Tekenen geannuleerd.|Tekengereedschap|Getekend|Tekent de lijn bij (een batterij of niveau).||Stuur {name} aan met de waarde van de entiteit: draaisnelheid vanuit het percentage van een ventilator, een vulling vanuit een batterijniveau.|Zet hier een .svg-bestand neer|Slagschaduw|Laat de .svg los om te importeren|Dupliceren|Emitter dupliceren|Dubbele id "{id}".|{count, plural, one {Keyframe} other {Keyframes}} dupliceren|{name} dupliceren|Gedupliceerd als "{name}".|Dupliceren mislukt: {message}|Duur|Elk deeltje kiest een snelheid in dit bereik, gemeten in % van de kortste zijde van de kaart per seconde. Bij 100 steekt een deeltje een vierkante kaart in één seconde over.|Elk deeltje draait de kant die het kiest, naar links of rechts.|Versnelling|Versoepeling naar het volgende keyframe|Versoepelingswaarde|De versoepeling van het keyframe bewerken|Effectvoorinstellingen kunnen niet als status afspelen: speelt niets.|Effecten met een eigen laag kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.||Ellips|Naam van emitter|||Emoji of symbool|Leeg keyframe|Leeg leest de status. Bijvoorbeeld percentage (ventilator) of helderheid (lamp).|Eindhandvat|Solo beëindigen|Voer een emoji of symbool in.|Entiteitskleur|Entiteit is uit|Entiteit is aan|Entiteitswaarde|Wissen|Gebeurtenis|Uitvouwen|{name} uitklappen|Ontploffen en vallen|Exporteren|Alles exporteren|Animaties exporteren|{name} exporteren|In- en uitfaden|Uitfaden en weer infaden (0,2 s)|Fadet in met de waarde.|Vallen|Ventilator|Acht|Vullen|Vulkleur||Voorinstellingen filteren|Cyclus afmaken|Pad afronden|Vuurvliegjes|Cyclus passend maken|De hele cyclus passend maken|Herstel eerst de gemarkeerde velden.|Plat|Plat (Z)|Omslaan (X)|Zijwaarts kantelen (Y)|Vloer|Stroom|Een getekend pad volgen|Een pad volgen|Rotatie volgen|Het pad volgen|Eén naar voren|Fontein|Uit de vrije hand|Van|Van een voorinstelling|Van kleur|Van{unit}|Voordeur|Gloed|Begrepen|Zwaartekracht|Richting van de zwaartekracht|Zwaartekracht {strength} {direction}|Grijstinten|Raster|Groep|Draaipunt van groep|Groeit met de waarde.|Bevat fouten|Hart|Verbergen en solo zijn niet beschikbaar: het deeltjesvoorbeeld kon niet worden opgebouwd.|Verbergen in voorbeeld|Verbergen in voorbeeld (niet opgeslagen)|Verbergen in voorbeeld: de laag blijft op zijn normale waarde|Verberg {noun} ({keys})|Verbergen, solo en vergrendelen werken alleen in dit voorbeeld.|Hoogste {noun}|Tintverschuiving|Luchtbevochtiger|Pictogram|Pictogram- en emoji-deeltjes worden als stippen geëxporteerd.|Pictogramanimatie|Pictogramanimatie…|Pictogram beweegt alleen het pictogram van de module. Kaarten kunnen het overschrijven.|Pictogramonderdelen|Pictogramonderdelen op het canvas|Pictogram om te splitsen|Pictogram {percent}%|Pictogrammen, emoji of vormen die vallen, stijgen of uitbarsten|Importeren|SVG importeren|Animaties importeren|{count, plural, one {# animatie} other {# animaties}} geïmporteerd.|Voor de inhoud|Ervoor: deeltjes worden over tekst en pictogrammen getekend. Ze blokkeren nooit klikken.|In-uit|Oneindig|Inspecteur|Inspectorpaneel|Wordt gebruikt door {count, plural, one {# kaart} other {# kaarten}}; die spelen hem niet meer af, tenzij ze een kopie insluiten.|Draait mee met de richting waarin het beweegt.|Verder bewerken||Keyframe-inspecteur|Keyframe-tijdlijn|Keyframe-gereedschap|||Soort|Grootste|Grootste afmeting|Grasmaaier|Laag|Laagacties|Laagacties, {name}|Laagnaam|Lagen|Lagen verborgen in het voorbeeld|Lagenpaneel|Links|Linkerrand|Laat eerst de huidige cyclus eindigen|Bibliotheek|Levensduur (s)|Optillen|Licht|Lichte kaart|Lijn|Lijneinden|Live simulatie|Live simulatie wordt als zijn ingebakken lus geëxporteerd.|Live simulatie draait op elk dashboard dat deze kaart toont en gebruikt meer processor, vooral op wandtablets. De export als geanimeerde SVG speelt in plaats daarvan de ingebakken lus af.|Woonkamer|Pictogrambibliotheek laden…|De {kind}-editor laden…|Laden…|Vergrendelen|Vergrendeld|Vergrendeld. Ontgrendel om te bewerken.|Uiterlijk|Herhalen|Lus uit|Lus aan|Lussnelheid (×)|Lussen|Laagste {noun}|Magic Card is niet geladen op deze pagina||Maximaliseren|Mediaspeler|Onderdelen samenvoegen||Min en max moeten verschillen.|Min mag niet boven max liggen.|Gemengd|Modus|Meer voorinstellingen konden niet laden. De ingebouwde voorinstellingen werken nog.|Meer afvlakken: minder punten en een rustiger lijn.|Meer afvlakken: minder punten en een rustiger lijn. De stippellijn is wat je tekende.|Beweging|Bewegingspad|Bewegingspad. Klik om punten toe te voegen, sleep om ze te verplaatsen.|Bewegingspad: selecteer eerst een onderdeel of vorm|Beweging verwijderd|X verplaatsen|Y verplaatsen|Ga eerst weg van het beginpunt.|Omlaag|Omlaag verplaatsen (eronder getekend)|Omlaag verplaatsen (speelt later)|Emitter achter de inhoud zetten|Emitter omlaag verplaatsen|Emitter voor de inhoud zetten|Emitter omhoog verplaatsen|Handvat verplaatsen|Keyframe verplaatsen|Pad verplaatsen|Padpunt verplaatsen|Draaipunt verplaatsen|Punt verplaatsen|Punten verplaatsen|Status {i} omlaag verplaatsen|Status {i} omhoog verplaatsen|Stap verplaatsen|Stap {i} verplaatsen|Verplaats in plaats daarvan het element|Verplaats in plaats daarvan het pictogram|Omhoog|Omhoog verplaatsen (bovenop getekend)|Omhoog verplaatsen (speelt eerder)|Venster verplaatsen|{count, plural, one {Keyframe} other {Keyframes}} verplaatsen|{name} omlaag verplaatsen|{name} omlaag verplaatsen (eronder getekend)|{name} omlaag verplaatsen (speelt later)|{name} omhoog verplaatsen (bovenop getekend)|{name} omhoog verplaatsen (speelt eerder)|{name} {where} verplaatsen|{where} verplaatsen|Verplaats, schaal, draai en kleur op een tijdlijn|Omlaag verplaatst: eronder getekend|Omhoog verplaatst: bovenop getekend|Beweging|Bewegingen|Beweegt mee met: {subject}|Beweegt zijwaarts.|Beweegt het onderdeel langs een curve, vanaf zijn rustpositie. Sleep de punten op het canvas.|Beweegt omhoog of omlaag.|{target} verplaatsen.|Moet 1-16 tekens uit a-z, 0-9 en - zijn, en uniek.|Moet SVG-opmaak zijn.|Moet [min, max] px zijn tussen 1 en 200, min ≤ max.|Moet [min, max] zijn.|Moet een lijst zijn.|Moet een bewegingsvoorinstelling of een eigen keyframes- of padanimatie zijn.|Moet een getal zijn.|Moet een paar [van, naar] zijn.|Moet een deeltjes-, ring- of scènevoorinstelling zijn.|Moet een status (tekst) zijn.|Moet een subpad-index zijn (een geheel getal vanaf 0).|Moet een geheel getal zijn.|Moet een attribuutnaam zijn.|Moet een pictogram-id zijn zoals mdi:bell.|Moet een pictogram-id zijn zoals mdi:star.|Moet een object zijn.|Moet tussen 0 en 100% liggen.|Moet tussen {min} en {max} {unit} liggen.|Moet tussen {min} en {max} liggen.|Moet element, icon, name, state, background, part:<id>, group:<id> of shape:<id> zijn.|Moet een van deze zijn: {options}.|Moet self, none, een voorinstelling of custom:<id> zijn.|Moet tekst van hooguit 40 tekens zijn.|Moet tekst zijn.|Moet drie getallen [x, y, z] zijn, niet allemaal 0.|Moet waar of onwaar zijn.|Moet twee getallen zijn (kleuren alleen voor color_mix).|Moet twee getallen [x, y] zijn.|Moet hooguit 8 tekens zijn (een emoji of een symbool).|Moet afwijken van min.|Mijn animaties|Naam|Naam van {name}|Heeft minstens één item nodig.|Heeft minstens {min} items nodig.|Negatief blaast de regen naar links, positief naar rechts. Het bepaalt de richting van de zwaartekracht.|Nieuw|Nieuwe animatie|Nieuw in deze versie|Nieuwe keyframes|Nieuwe deeltjes|Nieuw pad|Nieuwe reeks|Nieuwe vormen|Volgend keyframe|Geen <svg>-element gevonden.|Geen animatie|Geen animatie komt overeen met “{query}”.|Geen animaties gevonden.|Geen animaties komen overeen met "{query}".|Geen animaties komen overeen.|Nog geen animaties|Geen kleuren: deeltjes gebruiken de animatiekleur.|Geen vrije deeltjes meer. Verlaag een aantal om een emitter toe te voegen.|Geen zwaartekracht|Geen pictogramanimaties komen overeen met "{query}".|Nog geen keyframes: gebruik Eigenschap toevoegen, of dubbelklik op de baan.|Nog geen keys. Voeg keys toe op de tijdlijn om dit onderdeel te draaien, verplaatsen, schalen, te laten vervagen of te kleuren.|Nog geen bewegingspad. Teken er een op het canvas.|Geen voorinstellingen komen overeen met "{query}".|Nog geen eigenschappen geanimeerd. Gebruik Eigenschap toevoegen, of dubbelklik op een baan.|Nog geen vormen: kies een tekengereedschap.|Nog geen stappen|Nog geen stappen. Voeg een clip toe om de reeks te beginnen.|Geen {kind} "{id}" in de rig.|Geen|Niet ingesteld: de deeltjes nemen de animatiekleur.|Normaal|Geen onderdeel van deze rig.|Geen tijdlijnbaan.|Geen geldige animatie-id.|Geen geldige kleur.|Geen geldige versoepeling.|Geen toegestane schaduw: x y vervaging spreiding kleur.|Geen toegestane {kind}-waarde.|Niet gewijzigd: {big}|Niet gevonden|Niet gevonden in Mijn animaties. Deze stap wordt overgeslagen.|Niet geïmporteerd: {list}.|Niet in je animaties: speelt niets tot hij daar is opgeslagen.|Niet op deze tegel|Niet hernoemd: {message}|Niet te serialiseren.|Niet gebruikt|Geen geldige YAML.|Geen geldige paddata (moet met M beginnen).|Niets|Niets (stoppen)|Er wordt niets getekend.|Niets geplakt: die eigenschappen passen hier niet|Er speelt nog niets.|Er is nog niets om te exporteren.|Hier valt nog niets in te stellen.|Getal|Uit|Aan|Bij botsing|Aan betekent actief voor het domein (open, thuis, speelt...).|Eén klik animeert de selectie; stem de keys af op de tijdlijn.||Onion skin: markeer de keyframes rond de afspeelkop|Alleen voor het activeringsmoment.|Alleen keyframe-animaties exporteren als geanimeerde SVG.|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe (de animatieversoepeling).|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe.|Dekking|Dekking (%)|Openen|Open een deeltjesanimatie om de deeltjes te ontwerpen.|Pad openen|Of begin met de pictogrambibliotheek|Baan|Oorsprong|Uitvoer|Over het pictogram|Eigen SVG|Eigen kinderkleur|Eigen tijdlijn|Verf|Onderdeel|Onderdeelacties|Draaipunt van onderdeel|Onderdeelvoorinstellingen|Onderdeel {i}|Onderdeel {n}|Deeltjes- en reeksanimaties kunnen niet als status afspelen.|Deeltjespictogram|Deeltjeslagen|Deeltjesvoorinstelling|Deeltjessnelheid (% van korte zijde/s)|Deeltjes|Deeltjes langs een pad kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Deeltjes verschijnen en verdwijnen zacht.|Deeltjes spelen op het hele element.|Deeltjes nemen om beurten de kleuren. Kies er een om hem te wijzigen.|Deeltjes volgen het pad na elkaar, over het hele element.|Deeltjes {n}|Onderdelen samengevoegd|Plakken op de afspeelkop in {target} (Ctrl+V)|Keyframes plakken op de afspeelkop|Plak eerst YAML of laad het.|Plak de opmaak van een <svg>.|Pad|Padlagen|Padlagen (geen stapelvolgorde)|Alleen paden en vormen: scripts, stijlen en links worden verwijderd. De vorm wordt gevuld met de deeltjeskleur.|Pauzeren (spatie)|Voorbeeld pauzeren||Pen. Klik om punten toe te voegen, klik op het eerste punt om te sluiten.|Persoon|Fysica|Kies een animatie voor deze stap.|Kies een pictogram, of typ een id zoals mdi:bell-ring.|Draaipunt|Draaipunt van {name}|Draaipunt op het vak van de groep|Draaipunt op het vak van het onderdeel|Draaipunt: {position}||Plaatsing||Afspelen|Afspelen (spatie)|Animaties na elkaar afspelen|Speel de kolommen van een rij of de modules van een kolom na elkaar af.|Afspeelvolgorde|Voorbeeld afspelen|Speel per status van de entiteit iets anders af: een lamp die gloeit als hij aan is en rust als hij uit is. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Afspelen|Afspeelsnelheid|Afspeelkop|Speelt|Speelt bij tikken|Speelt deze animatie sneller of langzamer af.|Punt {count} geplaatst. Nogmaals Enter op dezelfde plek rondt de lijn af.|Punten staan in % van het bewegende element, dus het pad schaalt mee.|Punten staan in pixels, bij elke grootte hetzelfde.|Punten springen naar nabije punten van het pictogram en andere vormen.|Punten komen op hele pictogrameenheden. Houd Shift ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 10 px. Houd {key} ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 5%. Houd {key} ingedrukt om vrij te plaatsen.|Positie|Positie in de cyclus|Voorinstelling|Draaipunt van voorinstelling|Draaipunt van voorinstelling van {name}|Voorbeeld|Voorbeeldentiteit|Voorbeeld verbergt {count, plural, one {# laag} other {# lagen}}|Voorbeeldstatus|Voorbeeldtegel|Voorbeeldwaarde|Voorbeeld met verminderde beweging|Vorig keyframe|Eigenschap|Eigenschapskeys krijgen hun eigen versoepeling; hele keyframes bepalen de versoepeling van het keyframe.|Pseudo-RTL|Straal|Regen|Rechthoek|Opnieuw (Ctrl+Y)|Opnieuw tekenen|Verminderde beweging|Verminderde beweging staat aan, dus het voorbeeld blijft stil.|Pagina opnieuw laden|Door de pagina te herladen gaan wijzigingen verloren die niet zijn opgeslagen. Toch herladen?|Verwijderen|Kleur verwijderen|Kleur {i} verwijderen|Kleur {n} verwijderen|Intekenen verwijderen|Emitter verwijderen|Vulling verwijderen|Uit dit keyframe verwijderen|Beweging verwijderen|Bewegingspad verwijderen|Vorm verwijderen|Vorm {n} verwijderen|Lijn verwijderen|De animatie van dit onderdeel verwijderen|{name} uit dit keyframe verwijderen|Hernoemen|Groep hernoemen|Onderdeel hernoemen|{name} hernoemen|Hernoemd|Hernoemd naar "{clean}".|Hernoemen mislukt: {message}|Herhalen|Aantal herhalingen|Het pad vervangen door een {name}|Vervangen door…|Verplicht.|Draaipunt herstellen|Herstellen naar draaipunt van groep|Herstellen naar draaipunt van onderdeel|Venstergrootte wijzigen|Oorspronkelijke grootte|Niet-opgeslagen wijzigingen herstellen|Niet-opgeslagen wijzigingen herstellen?|Omgekeerd|Richting omkeren|Rechts|Rechterrand||Ringvoorinstelling|Stijgen|Draaien|Rotatie|Draaisnelheid|Rond|Liniaal in procenten van de cyclus of in seconden|Liniaal in procenten; toon seconden|Liniaal in seconden; toon procenten|SMIL-terugval||SVG gekopieerd|SVG-vorm|SVG om te kopiëren|Opslaan|Opslaan (Ctrl+S)|Opslaan als geanimeerde SVG|Opslaan als pictogram|Je wijzigingen opslaan?|"{name}" opgeslagen.|Opslaan mislukt.|Opslaan…|Schaal|Schaal X|Schaal Y|Scènevoorinstelling|Schema|Animaties zoeken|Pictogrammen zoeken|Voorinstellingen zoeken|De pictogrambibliotheek doorzoeken|Seizoensscène|Seconden|Startwaarde|Seed {seed} · draai {span}|Kiezen|Selecteer eerst een onderdeel of vorm.|Selecteer een onderdeel of vorm en teken dan zijn bewegingspad.|Alle {name}-keyframes selecteren (Shift voegt toe)|Selecteer twee of meer onderdelen om ze te groeperen.|Naar achteren sturen|Vorm naar achteren sturen|Vorm onder het pictogram sturen|Onder het pictogram sturen|{name} naar achteren sturen|{name} onder het pictogram sturen||Reeks|Reeksstappen|Reeksstappen (speelt van eerste naar laatste)|Reeksen die hem afspelen, slaan die stap over: {names}.|Stel icon of svg in, niet beide.|Stel een van builtin, icon, emoji of svg in.|Stel een van from of svg in.|Stel een van icon, emoji of svg in.|Stel een van state, state_not, entity_on, above of below in.|Schaduw|Schaduw en gloed|Schaduwkleur|Schaduwvoorinstellingen|Schaduw {name}|Vorm|Vormmix|Vorm over het pictogram|Punten van de vorm. Sleep een punt om het te verplaatsen.|Vorm onder het pictogram|Vorm {n}|Vorm {n}: {shape}|Vorm {n}: {shape}, gewicht {weight}|Vormen over het pictogram|Vormen onder het pictogram|Sneltoets: {keys}|Alles tonen|Alle verborgen lagen tonen|Tonen in voorbeeld|Toon {noun} ({keys})|Willekeurig|Willekeurig: nieuwe willekeurige paden|Simulatie|Sirene|Grootte|Grootte (px)|Scheeftrekken|Scheeftrekken X|Scheeftrekken Y|Vertraagt deeltjes in de loop van de tijd.|Kleinste|Kleinste afmeting|Vloeiend|Alles afvlakken|Afvlakking|Afvlakking (s)|Magnetisch raster|Vastklikken op keyframes, de afspeelkop en het raster (houd Shift ingedrukt om vrij te slepen)|Vastklikken|Solo in voorbeeld|Solo in voorbeeld (verbergt de rest, niet opgeslagen)|Solo aan|Een paar panelen zijn verborgen, zoals je ze had achtergelaten. Gebruik de pijlen aan de randen om ze te tonen.|Gelijkmatig verdeeld langs het pad, 1 tot {particles}.|Vonk|Ontstaan|Kinddeeltjes laten ontstaan|Ontstaat {seconds} s na de geboorte (in te stellen in YAML).|Snelheid|Snelheid (% van korte zijde/s)|Draaiing per lus (gr.)|Draait continu, sneller naarmate de waarde stijgt (een ventilator).|Spiraal|Opnieuw splitsen|Splitsen en beginnen|Terug splitsen in vormen|Pictogram splitsen|Splits het pictogram om zijn vormen een voor een te animeren: de klepel van een bel, de bladen van een ventilator.|Opnieuw splitsen vervangt de onderdelen, hun groepen en hun keys.|Bezig met splitsen…|Spreiding|Verspreid over|Verspreid omlaag|Vierkant|Hoogte van het canvas|Kinderen gespreid|Spreiding uit|Spreiding aan|Ster|Begin|Begin opnieuw na de laatste stap.|Startvertraging (s)|Beginnen met een sjabloon|Beginnen met een pictogram|Beginhandvat|Begonnen bij x {x}, y {y}. Verplaats de cursor en druk op Enter om af te ronden. Escape annuleert.|Begint op|Status|Status is|Status is niet|Status is niet {state_not}|Status is {state}|Status verplaatst naar positie {to}.|Status {count} toegevoegd: {when}.|Status {i}|Status {i} verwijderd.|Statussen|Statussen (clips) worden niet geëxporteerd: het bestand speelt de eigen tijdlijn van de animatie.|Stapanimatie|Stap verplaatst naar positie {to} van {count}.|Stap verplaatst naar positie {to} van {n}.|Stap {count} toegevoegd: {name}.|Stap {index} verwijderd.|Stap {index} wordt overgeslagen|Stap {index}: {from} tot {to}|Stap {i}|Stap {i} is vergrendeld. Ontgrendel hem in Lagen.|Stappen|Stappen springen tussen waarden; er is geen curve om te bewerken.|Stoppen met tekenen|Recht|Alles recht maken|Streep|Lijn|Lijnkleur|Lijndikte (pictogrameenheden)|Zon|Vervangt het voorinstel door je eigen deeltjes: vorm, beweging, grootte en kleuren worden bewerkbaar.|Wervel|Schakelaar|Direct wisselen|Tikken|Doel|Tekst|Tekst- en pictogramkleur|Die animatie heeft eigen statussen: de kaart slaat deze status over.|Die laag is vergrendeld. Ontgrendel hem in Lagen.|De SMIL-terugval speelt de animatie alleen vooruit af.|De SVG tekent niets.|De SVG heeft geen vormen om te tekenen.|De SVG is groter dan 32 KB.|De SVG is te complex.|De YAML is te groot om te importeren (meer dan 1 MB).|De animatie is groter dan {size} KB.|De animatie is niet geldig: {message}|De animatiebibliotheek is niet verbonden.|De animatie zou groter worden dan {max} KB ({size} KB).|De versoepeling van de animatie ({easingLabel})|De keyframes van de animatie verplaatsen het element.|De keyframes van de animatie verplaatsen het pictogram.|De keyframes van de animatie verplaatsen het pictogram van de module.|De keyframes van de animatie verplaatsen het hele element.|Het vak van het pictogram of van de tekst van de kaart.|De kleur is geen geldige CSS-kleur: het bestand gebruikt currentColor.|De tekengereedschappen zijn nog niet geladen.|De tekengereedschappen zijn klaar.|De tekengereedschappen op deze pagina komen uit een andere versie van Magic Card. Laad de pagina opnieuw om hier te tekenen.|De entiteitskleurknop gebruikt de animatiekleur (de kleur van het kaartitem, anders die van de entiteit).|De waarde van de entiteit stuurt {name} aan. Bekijk het met de waardeschuif op het canvas.|Het bestand kon niet worden gelezen.|Het bestand is {size} KB, groter dan 256 KB.|Het bestand loopt in een lus: het aantal herhalingen wordt niet geëxporteerd.|De eerste status die past, speelt; zonder match (of bij een niet-beschikbare entiteit) speelt de eigen tijdlijn. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Het pictogram in rust, zonder animatie. Id\'s blijven op elk onderdeel en elke vorm staan.|Het pictogram heeft geen vormen om te exporteren.|Het pictogram heeft {count, plural, one {# vorm} other {# vormen}}: {parts, plural, one {het eerste werd een onderdeel} other {de eerste # werden onderdelen}} (het meeste wat een rig aankan), de rest blijft in rust.|Het pictogram is gesplitst in zijn onderdelen. Selecteer een onderdeel en geef het een voorinstelling: slingeren, draaien, intekenen en meer.|De pictogrambibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|Het import- en exportgereedschap kon niet worden geladen. Laad de pagina opnieuw en probeer het nog eens.|Het paneel lagen is verborgen, zoals je het eerder had ingeklapt. Gebruik de pijl aan de rand om het te tonen.|De bibliotheek bevat hooguit {cap, plural, one {# animatie} other {# animaties}}: {fit, plural, one {er past nog maar #} other {er passen nog maar #}}, {skipped, plural, one {# is} other {# zijn}} niet geïmporteerd.|De lijn wordt in de loop van de cyclus ingetekend.|Het uiterlijk verandert een beetje.|De lus haalde de groottelimiet, dus het bestand toont minder deeltjes.|Het pictogram van de module beweegt langs het pad.|De beweging loopt langs het pad terug naar het begin.|De nieuwe animatie "{name}" is de vorige keer niet opgeslagen.|De omtrek wordt in de loop van de cyclus ingetekend, daarna wordt de vorm gevuld.|De omtrek wordt gevolgd, daarna wordt het onderdeel gevuld.|De deeltjesengine is nog niet geladen.|De onderdelen komen uit de eigen SVG van het document, een onderdeel per vorm.|Het pad tekent niets.|Het pad heeft het maximale aantal punten.|Het punt waaromheen het schaalt en draait.|Het punt waaromheen de groep draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het onderdeel draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het voorinstel deze groep draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van de groep. Sleep het op het canvas.|Het punt waaromheen het voorinstel dit onderdeel draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van het onderdeel. Sleep het op het canvas.|Het voorinstel wordt je eigen animatie om te bewerken: bewegingsvoorinstellingen als keyframes, deeltjes- en ringvoorinstellingen met hun instellingen.|Het voorbeeld is geschaald om op het canvas te passen|Het voorbeeld speelt op een echte magic-card. Laad magic-card.js (je dashboardbron) vóór de animatiestudio.|De rig bevat het maximale aantal vormen (48).|Dezelfde seed geeft elke keer dezelfde lus.|De geselecteerde keyframes gebruiken verschillende versoepelingen; een keuze hier stelt ze allemaal in.|De vorm als masker|De vorm draait mee met de richting waarin hij beweegt.|De studio berekent het pad van elk deeltje eenmaal en speelt het af als lus. Licht voor dashboards.|De tijdlijn animeert hier ook het intekenen: terwijl hij speelt, gaat hij voor deze koppeling.|De tijdlijn animeert hier ook de dekking: terwijl hij speelt, gaat zijn dekking voor deze koppeling.|De tijdlijn animeert deze kleur ook: terwijl hij speelt, gaat zijn kleur voor deze koppeling.|De tijdlijn trekt dit doel scheef: terwijl hij speelt, vervangt het scheeftrekken de beweging van deze koppeling.|Het hele element beweegt langs het pad vanaf waar het rust.|Het paneel {noun} is verborgen, zoals je het had achtergelaten. Gebruik de pijl aan de rand om het te tonen.|Deze gelden voor elke emitter. Plaatsing wordt per emitter ingesteld.|Ze vervangen het uiterlijk van het voorinstel.|Deze animatie|Deze animatie heeft al 24 geanimeerde doelen: verwijder er een om een voorinstelling toe te voegen.|Deze kaart speelt engine {engine}; werk Magic Card bij om deze animatie af te spelen.|Dit pictogram kon niet worden geladen. Controleer de pictogram-id, of probeer het opnieuw als Home Assistant bereikbaar is.|Dit pictogram heeft geen vormen om te animeren.|Dit pictogram heeft geen vormen om te splitsen.|Dit is de laatste key van de baan: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit is het laatste keyframe: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit keyframe stelt geen eigenschap in. Voeg er een toe met Eigenschap toevoegen.|Deze lus haalde de groottelimiet, dus hij toont minder deeltjes. Verlaag het aantal of de kinddeeltjes.|Deze lus is groot en laadt daarom trager op wandtablets. Verlaag het aantal of de kinddeeltjes.|Dit onderdeel heeft eigen intekenkeys op de tijdlijn.|Deze voorinstelling kon niet worden geopend: {message}|Deze voorinstelling is niet beschikbaar in deze versie van Magic Card.|Tijdlijn|Tijdlijnweergave|||Tot|Naar kleur|Gereedschap: {tool}|Boven|Linksboven|Rechtsboven|Naar{unit}|Tracks (gecombineerd, geen volgorde)|Tracks van kaartonderdelen (naam, status, achtergrond) worden niet geëxporteerd.|Overgang|Driehoek|Bijgesneden|Opnieuw proberen|Turbulentie|Draaien|Botser uitzetten|Botser aanzetten|Vervagen uitzetten|Vervagen aanzetten|Zet eerst een botser aan.|Draai het onderwerp in de reisrichting.|Meedraaien met het pad|Draait naar een hoek (een naald of een wijzerplaat).|Niet beschikbaar|Onder het pictogram|Ongedaan maken (Ctrl+Z)|Onverwacht element <{element}>.|Groep opheffen|Eenheden|Onbekende voorinstelling|Onbekende voorinstelling. Deze stap wordt overgeslagen.|Onbekende voorinstelling: speelt niets.|Ontgrendelen|Ontgrendeld|Niet-opgeslagen wijzigingen|Niet-ondersteunde versie (verwacht 1).|Naamloze animatie|Tot {parentsLeft} voor deze emitter. Alle emitters delen {parents} deeltjes.|Gebruik 1-32 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik 1-64 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik Eigen tijdlijn om deze animatie af te spelen.|Gebruik een kleur of een kleurverloop.|Gebruik een voorinstellingsnaam, cubic-bezier(x1, y1, x2, y2) of steps(n).|Gebruik een pictogram-id zoals mdi:bell-ring.|Gebruiken als pictogram|Ingebakken lus gebruiken|currentColor gebruiken|Gebruik filterfuncties zoals brightness(1.2) hue-rotate(30deg); url() is niet toegestaan.|Gebruiken in kaart|Gebruik trefwoorden, lengtes of percentages, bijv. "50% 100%".|Live simulatie gebruiken|De kleuren van de ouder gebruiken|Gebruik hooguit 8 tekens.|{emoji} gebruiken|Gebruikt door {count, plural, one {# kaart} other {# kaarten}}|Stofzuiger|Waarde|Waarde boven|Waarde boven {above}|Waarde onder|Waarde onder {below}|Waardekoppelingen|Waardekoppelingen worden niet geëxporteerd: het bestand speelt af op de getekende waarden.|Klep|Variatie|Golf|Weer|Gewicht|Wat beweegt|Wat opslaan|Wanneer|Heel keyframe|Windhoek (gr.)|Bij verminderde beweging toont de kaart zijn stilstaande staat: deze animatie speelt niet.|||||Inzoomen|Inzoomen (Ctrl +)|Uitzoomen|Uitzoomen (Ctrl -)|Ingezoomd op het pictogram terwijl je zijn onderdelen bewerkt of tekent|na {seconds}|na {seconds} s|geanimeerd|aan het einde van de levensduur|op {angle}°|achter de inhoud|kindgrootte|kindsnelheid|color_mix heeft twee kleuren nodig.||omlaag|linksonder|rechtsonder|sleep {value}|tekengebied|tekent in||verborgen omdat een andere laag solo staat|verborgen omdat {name} verborgen is|verborgen in het voorbeeld|voor de inhoud|||keyframe-track|keyframe-tracks van {name}|lagen|links|levensduur||vergrendeld|vergrendeld omdat de laag waartoe hij behoort vergrendeld is|lussen|mijn animaties|niet op de tegel {tile}|ongeldig|aan|bij botsing|dekking|over het pictogram|speelt eenmaal|rechts|geselecteerd|snelheid|draaiing|startvertraging|status|stap {i} van {count}|stap {i} van {count}, {problem}|de achtergrond|het element|het pictogram|de naam|de status|turbulentie {value}|onder het pictogram|eenheden|onbekende fout|omhoog|linksboven|rechtsboven|{animation} (onbekend)|{below} verborgen|{below} hieronder verborgen|{cLIPS_MAX, plural, one {Hooguit # status.} other {Hooguit # statussen.}}|{cap, plural, one {De bibliotheek is vol (# animatie): er is niets geïmporteerd.} other {De bibliotheek is vol (# animaties): er is niets geïmporteerd.}}|{colours, plural, one {Hooguit # kleur} other {Hooguit # kleuren}}|{count, plural, one {# stip} other {# stippen}}|{count, plural, one {# pictogram} other {# pictogrammen}}||{count, plural, one {# keyframe} other {# keyframes}} gekopieerd|{count, plural, one {# keyframe} other {# keyframes}} verwijderd|{count, plural, one {# keyframe} other {# keyframes}} geplakt op {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} geselecteerd.||{count, plural, one {# key} other {# keys}} op de tijdlijn. Draai, verplaats, schaal, fade en kleur dit onderdeel daar.|{count, plural, one {# deeltje} other {# deeltjes}} · {flow}|{count, plural, one {# onderdeel} other {# onderdelen}}|{count, plural, one {# punt} other {# punten}}|{count, plural, one {# vorm} other {# vormen}}|{count, plural, one {# vorm} other {# vormen}}, geschaald in het pictogram|{count, plural, one {# stap} other {# stappen}}|{count, plural, one {# doel geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).} other {# doelen geselecteerd: op elk speelt een voorinstelling af (Golf: na elkaar).}}|{count, plural, one {# doel} other {# doelen}}|{count, plural, one {# {shape}} other {# {shape}}} {trigger}|{count, plural, one {Hooguit # vorm past in een rig.} other {Hooguit # vormen passen in een rig.}}|{count, plural, one {# keyframe verwijderen} other {# keyframes verwijderen}}|{count, plural, one {Vorm wissen} other {Vormen wissen}}|{count, plural, one {Groep van # onderdeel} other {Groep van # onderdelen}}|{count, plural, one {Groep verwijderd} other {Groepen verwijderd}}|{count, plural, one {# onderdeel gegroepeerd} other {# onderdelen gegroepeerd}}|{count, plural, one {Vorm importeren} other {Vormen importeren}}|{count, plural, one {Vervang # onderdeel} other {Vervang # onderdelen}}|{count, plural, one {Splitsen in # onderdeel} other {Splitsen in # onderdelen}}|{count, plural, one {Splitsen in # onderdeel} other {Splitsen in # onderdelen}} (de eerste {parts})|{count, plural, one {{names} staat niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om het te zien.} other {{names} staan niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om ze te zien.}}|{count, plural, one {{name} toegevoegd, # punt.} other {{name} toegevoegd, # punten.}}|{count} van {colours}|{emitters, plural, one {Hooguit # emitter.} other {Hooguit # emitters.}}|{from} tot {to}{unit}|{groups, plural, one {Een rig heeft hooguit # groep.} other {Een rig heeft hooguit # groepen.}}|{id} (niet gevonden)|{id}: de bibliotheek is vol|{kb} van 32 KB|{key} verplaatst één handvat afzonderlijk.|{key} verwijdert het.|{kind} kan niet in een reeks afspelen. Deze stap wordt overgeslagen.|{label} (de animatie beweegt het)|{label} (de animatie beweegt het) · niet op de tegel {tile}|{label} op {at}|{label} op {at} · {value}|{label} versoepeling naar de volgende key|{label} staat niet op de tegel {tile}|Baan {label}|Voorinstelling {label}|Gereedschap {label}. {hint}|{label} · niet op de tegel {tile}|{lane}-keyframe|{list}, stuiter {bounce}|{mAX_SHAPES, plural, one {Hooguit # vorm} other {Hooguit # vormen}}|{max, plural, one {Hooguit # animatie.} other {Hooguit # animaties.}}|{max, plural, one {Hooguit # koppeling per animatie.} other {Hooguit # koppelingen per animatie.}}|{max, plural, one {Hooguit # teken.} other {Hooguit # tekens.}}|{max, plural, one {Hooguit # item.} other {Hooguit # items.}}|{max, plural, one {Hooguit # deeltje over alle emitters.} other {Hooguit # deeltjes over alle emitters.}}||{names} delen deze curve.|{name} (kopie {n})|{name} (kopie)|{name} toegevoegd.|Animatie {name}|{name} kopie|{name} verborgen in het voorbeeld|{name} is vergrendeld. Ontgrendel hem in Lagen.|{name} is nu stap {to} van {count}|{name} staat nu {where}.|Keyframes van {name}|{name} vergrendeld|{name} achter de inhoud gezet|{name} voor de inhoud gezet|{name} {direction} verplaatst|{name} {direction} verplaatst, positie {position} van {count}|{name} {where} verplaatst|{name} staat niet meer solo|Instellingen van {name}|{name} getoond in het voorbeeld|{name} solo in het voorbeeld|{name} ontgrendeld|{name}, achter de inhoud|{name}, voor de inhoud||{now} van {total} seconden|{panels} verborgen|{panels} getoond|{particles, plural, one {# deeltje} other {# deeltjes}} · {emitters, plural, one {# emitter} other {# emitters}}|{parts, plural, one {# onderdeel} other {# onderdelen}}, {shapes, plural, one {# vorm} other {# vormen}}|{parts, plural, one {# onderdeel} other {# onderdelen}}, {shapes, plural, one {# vorm} other {# vormen}}, geen pictogram|{pct} % van het invoerbereik|{pct}, {seconds} seconden|{pieces, plural, one {Deel van # vorm} other {Deel van # vormen}}|{preset} op {targets}|{room, plural, one {De SVG heeft te veel vormen; er past nog maar #.} other {De SVG heeft te veel vormen; er passen nog maar #.}}|Lus van {seconds} s|{shapes, plural, one {Hooguit # vorm past in een rig.} other {Hooguit # vormen passen in een rig.}}||{size} pictogrameenheden|{steps, plural, one {Een reeks heeft hooguit # stap.} other {Een reeks heeft hooguit # stappen.}}|{steps, plural, one {Hooguit # stap} other {Hooguit # stappen}}|{steps}, {total} per cyclus, {loop}{skipped}.|{target}-keyframe|{target} {lane}-keyframe|{target} · op {at} · {secs} s|{tracks, plural, one {Hooguit # geanimeerd doel.} other {Hooguit # geanimeerde doelen.}}|{tracks, plural, one {Deze animatie heeft # geanimeerd doel, het maximum. Verwijder het om dit onderdeel te animeren.} other {Deze animatie heeft # geanimeerde doelen, het maximum. Verwijder er een om dit onderdeel te animeren.}}|{where} · {from} tot {to}']),Qn=e=>e.length<2?e[0]??"":new Intl.ListFormat(Xn(),{style:"long",type:"conjunction"}).format(e),es="sensor.mc_studio_living_room",ts=[{id:"icon",label:371,icon:"mdi:bell-ring-outline",targets:["element","icon"]},{id:"button",label:113,icon:"mdi:gesture-tap-button",targets:["element","icon","name"]},{id:"text",label:916,icon:"mdi:format-text",targets:["element","name"]},{id:"card",label:118,icon:"mdi:card-text-outline",targets:["element","icon","name","state","background"],entities:{[es]:{state:"21.5",name:424,attributes:{unit_of_measurement:"°C",device_class:"temperature",state_class:"measurement"}}}}],is=e=>ts.find(t=>t.id===e)??ts[0];function ns(e,t,i,n){const s={text_align:"center",...n?{animations:n}:{}};switch(e){case"icon":return{id:t,type:"icon",icon:"mdi:bell-ring",size:i?"36px":"64px",design:s};case"button":return{id:t,type:"button",label:Gn(243),icon:"mdi:bell",design:s};case"text":return{id:t,type:"text",text:Gn(349),design:{...s,font_size:i?"18px":"28px",font_weight:"500"}};case"card":return{id:t,type:"info",entity:es,icon:"mdi:thermometer",show_icon:!0,show_name:!0,show_state:!0,design:{...s,text_align:"left",background_color:"var(--secondary-background-color, #f2f3f5)",border_radius:"12px",padding:i?"8px 10px":"14px 18px"}}}}function ss(e,t){const i=is(e).entities;if(!i)return t;let n=rs.get(t);n||rs.set(t,n=new Map);const s=n.get(e);if(s)return s;const r={};for(const[e,t]of Object.entries(i))r[e]={entity_id:e,state:t.state,attributes:{...t.attributes,friendly_name:Gn(t.name)},last_changed:"",last_updated:"",context:{id:""}};const a={...t,states:{...r,...t.states??{}}};return n.set(e,a),a}const rs=new WeakMap,as={"A clip cannot play its own document (use self).":()=>Gn(15),"A sequence cannot play itself.":()=>Gn(18),"Another track already animates this target.":()=>Gn(69),"Children cannot have children of their own.":()=>Gn(142),"color_mix needs two colours.":()=>Gn(1097),"Draw-on is only for icon parts and shapes.":()=>Gn(265),"Min must not be above max.":()=>Gn(445),"Must be [min, max] px between 1 and 200, min ≤ max.":()=>Gn(503),"Must be [min, max].":()=>Gn(504),"Must be 1-16 of a-z, 0-9 and -, and unique.":()=>Gn(501),"Must be a list.":()=>Gn(505),"Must be a motion preset or a custom keyframes / path animation.":()=>Gn(506),"Must be a number.":()=>Gn(507),"Must be a pair [from, to].":()=>Gn(508),"Must be a particle, ring or scene preset.":()=>Gn(509),"Must be a state (text).":()=>Gn(510),"Must be a subpath index (a whole number from 0).":()=>Gn(511),"Must be a whole number.":()=>Gn(512),"Must be an attribute name.":()=>Gn(513),"Must be an icon id like mdi:bell.":()=>Gn(514),"Must be an icon id like mdi:star.":()=>Gn(515),"Must be an object.":()=>Gn(516),"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.":()=>Gn(520),"Must be self, none, a preset or custom:<id>.":()=>Gn(522),"Must be SVG markup.":()=>Gn(502),"Must be text of at most 40 characters.":()=>Gn(523),"Must be text.":()=>Gn(524),"Must be three numbers [x, y, z], not all 0.":()=>Gn(525),"Must be true or false.":()=>Gn(526),"Must be two numbers (colours only for color_mix).":()=>Gn(527),"Must be two numbers [x, y].":()=>Gn(528),"Must be up to 8 characters (an emoji or a symbol).":()=>Gn(529),"Must differ from min.":()=>Gn(530),"Needs at least one entry.":()=>Gn(534),"No <svg> element found.":()=>Gn(546),"Not a part of this rig.":()=>Gn(569),"Not a timeline lane.":()=>Gn(570),"Not a valid animation id.":()=>Gn(571),"Not a valid colour.":()=>Gn(572),"Not a valid easing.":()=>Gn(573),"Not serialisable.":()=>Gn(583),"Not valid path data (it must start with M).":()=>Gn(586),"Only for the trigger time.":()=>Gn(602),"Required.":()=>Gn(734),"Set icon or svg, not both.":()=>Gn(798),"Set one of builtin, icon, emoji or svg.":()=>Gn(799),"Set one of from or svg.":()=>Gn(800),"Set one of icon, emoji or svg.":()=>Gn(801),"Set one of state, state_not, entity_on, above or below.":()=>Gn(802),"The path draws nothing.":()=>Gn(964),"The SVG draws nothing.":()=>Gn(921),"The SVG has no shapes to draw.":()=>Gn(922),"The SVG is larger than 32 KB.":()=>Gn(923),"The SVG is too complex.":()=>Gn(924),"Unsupported version (expected 1).":()=>Gn(1041),"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>Gn(1044),"Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>Gn(1045),'Use keywords, lengths or percentages, e.g. "50% 100%".':()=>Gn(1055)},os=[[/^At most (\d+) animations\.$/,e=>Gn(1208,{max:+e[1]})],[/^At most (\d+) characters\.$/,e=>Gn(1210,{max:+e[1]})],[/^At most (\d+) entries\.$/,e=>Gn(1211,{max:+e[1]})],[/^At most (\d+) particles over all emitters\.$/,e=>Gn(1212,{max:+e[1]})],[/^Duplicate id "(.*)"\.$/,e=>Gn(278,{id:e[1]})],[/^Must be between (\S+) and (\S+)\.$/,e=>Gn(519,{min:e[1],max:e[2]})],[/^Must be one of: (.+)\.$/,e=>Gn(521,{options:e[1]})],[/^Needs at least (\d+) entries\.$/,e=>Gn(535,{min:+e[1]})],[/^No (\w+) "(.*)" in the rig\.$/,e=>Gn(565,{kind:e[1],id:e[2]})],[/^Not an allowed (\w+) value\.$/,e=>Gn(575,{kind:e[1]})],[/^The animation is larger than (\d+) KB\.$/,e=>Gn(926,{size:+e[1]})],[/^The SVG has too many shapes; at most (\d+) fit\.$/,e=>Gn(1249,{room:+e[1]})],[/^This card plays engine (\d+); update Magic Card to play this animation\.$/,e=>Gn(990,{engine:+e[1]})]];function ls(e){const t=as[e];if(t)return t();for(const[t,i]of os){const n=t.exec(e);if(n)return i(n)}return e}const cs={keyframes:398,particles:631,path:643,sequence:794},ds={keyframes:"mdi:vector-polyline",particles:"mdi:shimmer",path:"mdi:vector-curve",sequence:"mdi:format-list-numbered"};class ps{constructor(e,t=600,i=100){this.current=e,this._mergeMs=t,this._limit=i,this._past=[],this._future=[],this._lastAt=0}push(e,t,i=Date.now()){void 0!==t&&t===this._lastKey&&i-this._lastAt<this._mergeMs&&this._past.length>0||(this._past.push(this.current),this._past.length>this._limit&&this._past.shift()),this.current=e,this._future=[],this._lastKey=t,this._lastAt=i}replace(e){this.current=e,this._future=[]}revert(){const e=this._past.pop();void 0!==e&&(this.current=e,this._lastKey=void 0)}canUndo(){return this._past.length>0}canRedo(){return this._future.length>0}undo(){const e=this._past.pop();if(void 0!==e)return this._future.push(this.current),this.current=e,this._lastKey=void 0,e}redo(){const e=this._future.pop();if(void 0!==e)return this._past.push(this.current),this.current=e,this._lastKey=void 0,e}reset(e){this.current=e,this._past=[],this._future=[],this._lastKey=void 0}}function hs(e,t){const i=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"animation";if(!t(i))return i;for(let e=2;;e++){const n=`${i.slice(0,60)}-${e}`;if(!t(n))return n}}function us(e,t){const i=Gn(1216,{name:e});if(!t.has(i))return i.slice(0,80);for(let i=2;;i++){const n=Gn(1215,{name:e,n:i});if(!t.has(n))return n.slice(0,80)}}function ms(e){return(e.steps??[]).filter(e=>e.animation.startsWith(Ye)).map(e=>e.animation.slice(7))}function gs(e,t,i){const n=i.as??"studio-preview",s={...e,id:n},r=i.still?[]:[{id:"preview",preset:Ye+n,...i.entity?{entity:i.entity}:{}}],a=(e=>"particles"===e.kind||"path"===e.kind&&"particles"===e.path?.subject||"sequence"===e.kind&&!!e.stagger?.children)(e),o="sequence"===e.kind&&!!e.stagger?.children,l=!a&&r.length?r:void 0,c={type:"custom:magic-card",rows:[{id:"r",layout:o?"1-1-1":"1",columns:(o?["a","b","c"]:["a"]).map(e=>({id:`c${e}`,vertical_align:"center",modules:[ns(i.tile,`m${e}`,!!i.thumb,l)]})),design:{min_height:i.thumb?"112px":"icon"!==i.tile||a?"240px":"144px",border_radius:"12px",...a&&r.length?{animations:r}:{}}}]},d=new Map([[n,s]]);return function(e,t){const i=new Map((n=e.custom_animations,Array.isArray(n)?n.filter(e=>!!e&&"object"==typeof e):n&&"object"==typeof n?Object.entries(n).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]).map(e=>[String(e.id),e]));var n;const s=new Map,r=[],a=function(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[n,s]of Object.entries(e))if("custom_animations"!==n)if("preset"===n&&Je(s)){const e=Xe(s);e&&t.add(e)}else s&&"object"==typeof s&&i(s)};return i(e),[...t]}(e);for(;a.length;){const e=a.shift();if(s.has(e)||r.includes(e))continue;const n=t(e)??i.get(e);if(!n){r.push(e);continue}s.set(e,n);const o=n.steps;for(const e of Array.isArray(o)?o:[])"string"==typeof e?.animation&&e.animation.startsWith(Ye)&&a.push(Xe(e.animation))}if(!s.size)return{config:e,embedded:[],missing:r};const o=[...s.keys()];for(const[e,t]of i)s.has(e)||s.set(e,t);return{config:{...e,custom_animations:[...s.values()]},embedded:o,missing:r}}(c,e=>d.get(e)??t(e)).config}function fs(e,t){const i=new Map,n=e=>{if(!i.has(e.id)){i.set(e.id,e);for(const i of ms(e)){const e=t.get(i);e&&n(e)}}};return e.forEach(n),[...i.values()].map(e=>{const{id:t,name:i,...n}=JSON.parse(JSON.stringify(e));return{id:t,name:i,data:n}})}const vs=s.AH`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`,bs=s.AH`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;inset-inline:12px auto;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px;padding-inline:40px 12px} .with-action>.input{padding-right:44px;padding-inline:12px 44px}.with-icon.with-action>.input{padding-inline:40px 44px}.with-icon>.field-action{position:absolute;right:4px;inset-inline:auto 4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;padding-inline:12px 36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;inset-inline:auto 10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0;direction:ltr;}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;margin-inline:-1px 0;padding-left:10px;padding-inline:10px 36px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;inset-inline:3px auto;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s ease-out,inset-inline-start .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{left:19px;inset-inline:19px auto}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:start}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:start}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`,ys=s.AH`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,xs=s.AH`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,_s=[vs,bs,s.AH`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,s.AH`
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
      left: 0; /* physical */
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
      margin-inline: -2px -4px;
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
      inset-inline: auto 0;
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
      text-align: start;
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
      text-align: start;
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
      border-inline-end: 1px solid var(--mc-divider);
    }
    .layers-head {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 44px;
      padding: 4px 6px 4px 16px;
      padding-inline: 16px 6px;
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
      padding-inline: 10px 8px;
      border: 0;
      border-radius: var(--mc-radius);
      background: transparent;
      color: var(--mc-text);
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: start;
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
      text-align: end;
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
    mcas-stage {
      direction: ltr;
    }
    :host([dir='rtl']) .back ha-icon,
    :host([dir='rtl']) .ctx-back ha-icon {
      transform: scaleX(-1);
    }
    .center.with-panel {
      grid-template-rows:
        minmax(${(0,s.iz)(160)}px, calc(var(--split, 0.4) * 100%))
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
      left: 50%; /* physical */
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
      left: 0; /* physical */
      right: 0; /* physical */
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
      border-inline-start: 1px solid var(--mc-divider);
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
      inset-inline: auto 0;
      bottom: 0;
      width: min(var(--insp-w), 100%);
      z-index: 8;
      transform: translateX(100%);
      visibility: hidden;
      transition:
        transform 0.2s ease-out,
        visibility 0s linear 0.2s;
    }
    .workspace.slide .inspector[data-dir='rtl'] {
      transform: translateX(-100%);
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
      padding-inline: 8px 16px;
      background: var(--mc-surface);
      border-bottom: 1px solid var(--mc-divider);
    }
    .ctx-what {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: end;
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
      inset-inline: auto 36px;
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
      padding-inline-end: 36px;
    }
    .suffix span {
      position: absolute;
      right: 12px;
      inset-inline: auto 12px;
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
      padding-inline-start: 18px;
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
      left: 50%; /* physical */
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
  `],ws={keyframes:{tag:"mc-anim-keyframes-editor",place:"panel",title:1002},particles:{tag:"mc-anim-particles-editor",place:"inspector",title:631},path:{tag:"mc-anim-path-editor",place:"inspector",title:643},sequence:{tag:"mc-anim-sequence-editor",place:"inspector",title:900}},$s="mc-anim-path-host",ks=e=>"undefined"!=typeof customElements&&!!customElements.get(e),Ms={kind:"none"},Ss=[];function js(e){const t=Ss.findIndex(t=>t.tag===e.tag&&t.place===e.place);t>=0?Ss[t]=e:Ss.push(e)}function Cs(e,t,i){return Ss.map((e,t)=>({p:e,i:t})).filter(({p:n})=>{if(n.place!==e)return!1;try{return n.when(t,i)}catch{return!1}}).sort((e,t)=>e.p.order-t.p.order||e.i-t.i).map(({p:e})=>e)}const As="var(--mc-anim-c)",zs=[{id:"x",label:456,group:"Transform",icon:"mdi:arrow-left-right",kind:"number",def:{transform:{x:0}}},{id:"y",label:457,group:"Transform",icon:"mdi:arrow-up-down",kind:"number",def:{transform:{y:0}}},{id:"scale",label:769,group:"Transform",icon:"mdi:resize",kind:"number",def:{transform:{scale:1}}},{id:"scale_x",label:770,group:"Transform",icon:"mdi:arrow-expand-horizontal",kind:"number",def:{transform:{scale_x:1}}},{id:"scale_y",label:771,group:"Transform",icon:"mdi:arrow-expand-vertical",kind:"number",def:{transform:{scale_y:1}}},{id:"rotate",label:749,group:"Transform",icon:"mdi:rotate-right",kind:"number",def:{transform:{rotate:0}}},{id:"skew",label:829,group:"Transform",icon:"mdi:vector-polygon",kind:"number",def:{transform:{skew_x:0,skew_y:0}}},{id:"opacity",label:606,group:"Appearance",icon:"mdi:circle-opacity",kind:"number",def:{opacity:1}},{id:"color",label:166,group:"Appearance",icon:"mdi:format-color-text",kind:"css",def:{color:As}},{id:"background",label:80,group:"Appearance",icon:"mdi:format-color-fill",kind:"css",def:{background:`color-mix(in srgb, ${As} 20%, transparent)`}},{id:"shadow",label:804,group:"Appearance",icon:"mdi:box-shadow",kind:"css",def:{shadow:`0 0 16px 2px ${As}`}},{id:"blur",label:96,group:"Appearance",icon:"mdi:blur",kind:"number",def:{blur:0}},{id:"radius",label:190,group:"Appearance",icon:"mdi:rounded-corner",kind:"number",def:{radius:0}},{id:"filter",label:324,group:"Appearance",icon:"mdi:auto-fix",kind:"css",def:{filter:"brightness(1.2)"}}],qs=[{id:"draw",label:262,group:"Appearance",icon:"mdi:draw",kind:"number",def:{draw:1},rig:!0},{id:"stroke",label:907,group:"Appearance",icon:"mdi:border-color",kind:"css",def:{stroke:As},rig:!0}],Es=[...zs,...qs],Hs=Object.fromEntries(Es.map(e=>[e.id,e])),Ls=e=>!!e&&/^(part|group|shape):/.test(e),Vs=e=>Gn(Hs[e].label),Os=e=>Ls(e)?Es:zs,Ps=[["x","y"],["scale","scale_x","scale_y"],["filter","blur"]],Rs=e=>Ps.find(t=>t.includes(e))??[e],Ns={x:["x"],y:["y"],scale:["scale"],scale_x:["scale_x"],scale_y:["scale_y"],rotate:["rotate","axis"],skew:["skew_x","skew_y"]};function Ds(e,t){if("*"===t)return!0;const i=Ns[t];return i?"rotate"===t?void 0!==e.transform?.rotate:i.some(t=>void 0!==e.transform?.[t]):void 0!==e[t]}const Ts=e=>Es.every(t=>!Ds(e,t.id));function Fs(e,t){const i=Ns[t];if(i){const t={};for(const n of i){const i=e.transform?.[n];void 0!==i&&(t[n]=Array.isArray(i)?[...i]:i)}return{transform:t}}const n=e[t];return void 0===n?{}:{[t]:n}}function Bs(e,t){const i={...e};for(const[n,s]of Object.entries(t))"transform"===n?i.transform={...e.transform??{},...s}:i[n]=s;return i.transform&&!Object.keys(i.transform).length&&delete i.transform,i}function Is(e,t){const i={...e};if(i.easings&&void 0!==i.easings[t]){const e={...i.easings};delete e[t],Object.keys(e).length?i.easings=e:delete i.easings}const n=Ns[t];if(n){if(i.transform){const e={...i.transform};for(const t of n)delete e[t];Object.keys(e).length?i.transform=e:delete i.transform}}else delete i[t];return i}const Zs=e=>Es.filter(t=>e.some(e=>Ds(e,t.id))).map(e=>e.id),Ws=e=>`${e.lane}@${e.at}`;function Ks(e){const t=e.lastIndexOf("@");return{lane:e.slice(0,t),at:Number(e.slice(t+1))}}function Us(e,t){return[...new Set(e.filter(e=>Ds(e,t)).map(e=>e.at))].sort((e,t)=>e-t)}const Gs=(e,t)=>e.some(e=>e.at===t.at&&Ds(e,t.lane));function Ys(e,t,i){return e.filter(e=>e.at===i&&Ds(e,t)).reduce((e,i)=>Bs(e,Fs(i,t)),{})}function Js(e,t){let i;for(const n of e)n.at===t&&n.easing&&(i=n.easing);return i}function Xs(e,t,i){let n;for(const s of e)s.at===i&&s.easings?.[t]&&(n=s.easings[t]);return n}function Qs(e,t,i,n){const s=Rs(t),r=e.map((e,t)=>e.at===i&&s.some(t=>Ds(e,t))?t:-1).filter(e=>e>=0);return r.length?e.map((e,t)=>{if(e.at!==i)return e;const a={...e.easings??{}};for(const e of s)delete a[e];if(n&&r.includes(t))for(const t of s)Ds(e,t)&&(a[t]=n);const o={...e};return Object.keys(a).length?o.easings=a:delete o.easings,o}):e}const er=e=>e.map((e,t)=>[e,t]).sort((e,t)=>e[0].at-t[0].at||e[1]-t[1]).map(([e])=>e),tr=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));function ir(e,t,i,n,s){const r=s&&Object.keys(s).length?{...s}:void 0,a=e.map(e=>e.at).lastIndexOf(t);if(a<0)return[...e,{at:t,...Bs({},i),...n?{easing:n}:{},...r?{easings:r}:{}}];const o=[...e];return o[a]=Bs(o[a],i),n&&!o[a].easing&&(o[a]={...o[a],easing:n}),r&&(o[a]={...o[a],easings:{...o[a].easings??{},...r}}),o}function nr(e,t){if("*"===t.lane)return e.filter(e=>e.at!==t.at);const i=t.lane;return e.flatMap(e=>{if(e.at!==t.at||!Ds(e,i))return[e];const n=Is(e,i);return Ts(n)?[]:[n]})}function sr(e,t,i){const n={};for(const s of e)if(s.at===t&&s.easings)for(const[e,t]of Object.entries(s.easings))void 0===t||i&&!i.includes(e)||(n[e]=t);return Object.keys(n).length?n:void 0}function rr(e,t){if(!Gs(e,t))return;if("*"===t.lane){const i=e.filter(e=>e.at===t.at);return{key:t,frag:i.reduce((e,t)=>Bs(e,function(e){return Es.reduce((t,i)=>Ds(e,i.id)?Bs(t,Fs(e,i.id)):t,{})}(t)),{}),easing:Js(e,t.at),easings:sr(e,t.at)}}const i=e.filter(e=>e.at===t.at).every(e=>Es.every(i=>i.id===t.lane||!Ds(e,i.id)));return{key:t,frag:Ys(e,t.lane,t.at),easing:i?Js(e,t.at):void 0,easings:sr(e,t.at,[t.lane])}}function ar(e){const t=new Set(e.filter(e=>"*"===e.lane).map(e=>e.at)),i=new Set;return e.filter(e=>{const n=Ws(e);return!(i.has(n)||"*"!==e.lane&&t.has(e.at)||(i.add(n),0))})}function or(e,t){if(!e.length)return 0;const i=Math.min(...e.map(e=>e.at)),n=Math.max(...e.map(e=>e.at));return Math.min(100-n,Math.max(-i,t))}function lr(e,t,i,n=!1){const s=ar(t).filter(t=>Gs(e,t)),r=or(s,i);if(!s.length||0===r&&!n)return{keyframes:e,selection:s};const a=s.map(t=>rr(e,t)).filter(Boolean);let o=e;if(!n)for(const e of a)o=nr(o,e.key);const l=[];for(const e of[...a].sort((e,t)=>("*"===e.key.lane?0:1)-("*"===t.key.lane?0:1))){const t=tr(e.key.at+r);o=ir(o,t,e.frag,e.easing,e.easings),l.push({lane:e.key.lane,at:t})}return{keyframes:er(o),selection:l}}function cr(e,t){let i=e;for(const e of ar(t))i=nr(i,e);return i}const dr=(e,t,i)=>e+(t-e)*i,pr=(e,t=4)=>Math.round(e*10**t)/10**t;function hr(e,t,i,n="ease"){const s=Us(e,t);if(!s.length)return;if(s.includes(i))return Ys(e,t,i);const r=s.find(e=>e>i),a=[...s].reverse().find(e=>e<i);if(void 0===a)return Ys(e,t,r);if(void 0===r)return Ys(e,t,a);const o=(i-a)/(r-a),l=function(e,t){const i=e?.match(/^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+)\s*)?\)$/);if(i){const e=Math.max(1,Number(i[1])),n="start"===i[2]||"jump-start"===i[2];return Math.min(1,(n?Math.ceil(t*e):Math.floor(t*e))/e)}return function([e,t,i,n],s){if(s<=0)return 0;if(s>=1)return 1;const r=t=>3*e*t*(1-t)**2+3*i*t**2*(1-t)+t**3,a=e=>3*t*e*(1-e)**2+3*n*e**2*(1-e)+e**3,o=t=>3*e*(1-t)**2+6*(i-e)*t*(1-t)+3*(1-i)*t**2;let l=s;for(let e=0;e<8;e++){const e=r(l)-s;if(Math.abs(e)<1e-6)return a(l);const t=o(l);if(Math.abs(t)<1e-6)break;l-=e/t}let c=0,d=1;l=s;for(let e=0;e<40;e++){const e=r(l);if(Math.abs(e-s)<1e-6)break;e<s?c=l:d=l,l=(c+d)/2}return a(l)}(Zr(e)??[0,0,1,1],t)}(((e,t,i)=>Xs(e,t,i)??Js(e,i))(e,t,a)??n,o);return function(e){const t={...e};for(const e of["opacity","blur","radius","draw"])void 0!==t[e]&&(t[e]=pr(t[e],"opacity"===e||"draw"===e?3:2));if(t.transform){const e={...t.transform};for(const[t,i]of Object.entries(e))"number"==typeof i&&(e[t]=pr(i,t.startsWith("scale")?3:2));t.transform=e}return t}(function(e,t,i){const n={},s=["opacity","blur","radius","draw"];for(const r of s){const s=e[r],a=t[r];void 0===s&&void 0===a||(n[r]=dr(s??a,a??s,i))}if(e.transform||t.transform){const s=e.transform??{},r=t.transform??{},a={};for(const e of["x","y","scale","scale_x","scale_y","rotate","skew_x","skew_y"]){const t=s[e],n=r[e];void 0===t&&void 0===n||(a[e]=dr(t??n,n??t,i))}const o=s.axis??r.axis;o&&(a.axis=[...o]),n.transform=a}for(const s of["color","background","shadow","filter","stroke"]){const r=i<1?e[s]??t[s]:t[s]??e[s];void 0!==r&&(n[s]=r)}return n}(Ys(e,t,a),Ys(e,t,r),l))}function ur(e,t,i){return e.map(e=>{if(e.at!==t)return e;const n={...e};return i?n.easing=i:delete n.easing,n})}function mr(e,t){const i=ar(t).filter(t=>Gs(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at));return{items:i.map(t=>{const i=rr(e,t);return{lane:t.lane,dt:t.at-n,frag:gr(i.frag),easing:i.easing,...i.easings?{easings:{...i.easings}}:{}}})}}const gr=e=>JSON.parse(JSON.stringify(e));function fr(e,t,i){let n=e;const s=[],r=[...t.items].sort((e,t)=>("*"===e.lane?0:1)-("*"===t.lane?0:1));for(const e of r){const t=tr(i+e.dt);n=ir(n,t,gr(e.frag),e.easing,e.easings),s.push({lane:e.lane,at:t})}return{keyframes:er(n),selection:s}}let vr;const br=new Set,yr=()=>vr;function xr(e){vr=e;for(const e of br)e()}const _r={x:e=>({transform:{x:e}}),y:e=>({transform:{y:e}}),scale:e=>({transform:{scale:e}}),scale_x:e=>({transform:{scale_x:e}}),scale_y:e=>({transform:{scale_y:e}}),rotate:e=>({transform:{rotate:e}}),skew:e=>({transform:{skew_x:e,skew_y:0}}),opacity:e=>({opacity:Math.min(1,Math.max(0,e))}),blur:e=>({blur:Math.max(0,e)}),radius:e=>({radius:Math.max(0,e)}),draw:e=>({draw:Math.min(1,Math.max(0,e))})},wr=["color","background","stroke"];function $r(e,t,i){if(e===t)return gr(i);const n=e=>["x","y"].includes(e)?"move":["scale","scale_x","scale_y"].includes(e)?"scale":["opacity","draw"].includes(e)?"unit":["blur","radius"].includes(e)?"px":e;if(_r[e]&&_r[t]&&n(e)===n(t)){const n=function(e,t){const i=t.transform??{};switch(e){case"x":case"y":case"scale":case"scale_x":case"scale_y":case"rotate":return i[e];case"skew":return i.skew_x;default:{const i=t[e];return"number"==typeof i?i:void 0}}}(e,i);return void 0===n?void 0:_r[t](n)}if(wr.includes(e)&&wr.includes(t)){const n=i[e];return"string"==typeof n?{[t]:n}:void 0}}const kr={element:{label:292,icon:"mdi:card-outline"},icon:{label:371,icon:"mdi:emoticon-outline"},name:{label:532,icon:"mdi:format-text"},state:{label:880,icon:"mdi:information-outline"},background:{label:80,icon:"mdi:texture-box"}};function Mr(e,t){if(kr[t])return Gn(kr[t].label);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return n?.find(e=>e.id===i[2])?.name??i[2]}const Sr=e=>kr[e]?.icon??(e.startsWith("group:")?"mdi:group":e.startsWith("shape:")?"mdi:vector-square":"mdi:puzzle-outline"),jr=e=>"icon"===e.target?"icon":"element";function Cr(e){const t=[{target:jr(e),keyframes:e.keyframes??[],main:!0}];for(const i of e.tracks??[])t.some(e=>e.target===i.target)||t.push({target:i.target,keyframes:i.keyframes??[],main:!1});return t}function Ar(e,t){return t===jr(e)?e.keyframes??[]:e.tracks?.find(e=>e.target===t)?.keyframes??[]}function zr(e,t,i){if(t===jr(e))return{...e,keyframes:i};const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s>=0){const e={...n[s],keyframes:i};i.length||e.path||e.origin?n[s]=e:n.splice(s,1)}else i.length&&n.push({target:t,keyframes:i});const r={...e};return n.length?r.tracks=n:delete r.tracks,r}const qr=(e,t)=>e.target===t?Ws(e):`${e.target}/${Ws(e)}`;function Er(e,t){const i=e.indexOf("/");return{target:i>=0?e.slice(0,i):t,...Ks(i>=0?e.slice(i+1):e)}}const Hr=(e,t)=>Gs(Ar(e,t.target),t);function Lr(e){const t=new Map;for(const i of e){const e=t.get(i.target)??[];e.push({lane:i.lane,at:i.at}),t.set(i.target,e)}return t}function Vr(e,t,i,n=!1){const s=t.filter(t=>Hr(e,t)),r=or(s,i);if(!s.length||0===r&&!n)return{doc:e,selection:s};let a=e;const o=[];for(const[e,t]of Lr(s)){const i=lr(Ar(a,e),t,r,n);a=zr(a,e,i.keyframes),o.push(...i.selection.map(t=>({...t,target:e})))}return{doc:a,selection:o}}function Or(e,t){let i=e;for(const[e,n]of Lr(t))i=zr(i,e,cr(Ar(i,e),n));return i}function Pr(e,t){const i=t.filter(t=>Hr(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at)),s=[];for(const[t,r]of Lr(i)){const i=mr(Ar(e,t),r),a=Math.min(...r.map(e=>e.at));for(const e of i?.items??[])s.push({...e,dt:e.dt+a-n,target:t})}return{items:s}}const Rr=[{id:"pct1",label:10},{id:"pct5",label:12},{id:"s01",label:9},{id:"fps30",label:11}],Nr=[1,1.5,2,3,4,6,8,10],Dr=e=>Math.min(10,Math.max(1,Math.round(100*e)/100));function Tr(e,t){return t>0?Nr.find(t=>t>e+.001)??10:[...Nr].reverse().find(t=>t<e-.001)??1}const Fr=[1,2,2.5,5];function Br(e){const t=10**Math.floor(Math.log10(e));for(const i of[...Fr,10])if(i*t>=e-1e-9)return i*t;return 10*t}const Ir={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function Zr(e){if(!e)return;const t=e.trim(),i=G.find(e=>e.id===t)?.css??t;if(Ir[i])return[...Ir[i]];const n=i.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);if(!n)return;const s=n.slice(1).map(Number);return s.every(Number.isFinite)?s:void 0}const Wr=G.map(e=>({id:e.id,label:e.label,bezier:Zr(e.id)})),Kr=e=>Math.round(100*e)/100;function Ur(e){const t=e=>Kr(Math.min(1,Math.max(0,e))),i=e=>Kr(Math.min(2,Math.max(-1,e)));return[t(e[0]),i(e[1]),t(e[2]),i(e[3])]}function Gr(e){const t=Ur(e),i=Wr.find(e=>e.bezier.every((e,i)=>Math.abs(e-t[i])<.005));return i?i.id:`cubic-bezier(${t.join(", ")})`}const Yr=/^color-mix\(in srgb, var\(--mc-anim-c\) (\d+(?:\.\d+)?)%, transparent\)$/;function Jr(e){if(!e)return"";const t=e.trim();if(/^var\(\s*--mc-anim-c\s*\)$/.test(t))return"entity";const i=t.match(Yr);return i?`entity ${i[1]}%`:t}function Xr(e){const t=e.trim().match(/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/i);return t?void 0===t[1]||Number(t[1])>=100?As:`color-mix(in srgb, ${As} ${Number(t[1])}%, transparent)`:e.trim()}const Qr=e=>`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`,ea=[{id:"glow",label:350,value:`0px 0px 16px 2px ${As}`},{id:"drop",label:274,value:"0px 6px 16px 0px rgba(0, 0, 0, 0.3)"},{id:"lift",label:416,value:"0px 14px 28px -6px rgba(0, 0, 0, 0.35)"},{id:"none",label:566,value:"none"}],ta=[{id:"bright",label:102,value:"brightness(1.3)"},{id:"hue",label:369,value:"hue-rotate(90deg)"},{id:"gray",label:355,value:"grayscale(1)"},{id:"glow",label:350,value:`drop-shadow(0 0 6px ${As})`},{id:"none",label:566,value:"none"}],ia=(e,t)=>"none"===e.trim()?"shadow"===t||"filter"===t:void 0!==lt(e,t),na=["top left","top","top right","left","center","right","bottom left","bottom","bottom right"],sa=[1010,1009,1011,411,128,744,99,98,100],ra=(e,t=2)=>String(pr(e,t));function aa(e,t){if(!t)return"";const i=t.transform??{};switch(e){case"x":return void 0===i.x?"":`${ra(i.x,1)} px`;case"y":return void 0===i.y?"":`${ra(i.y,1)} px`;case"scale":case"scale_x":case"scale_y":{const t=i[e];return void 0===t?"":`${ra(100*t,1)}%`}case"rotate":return void 0===i.rotate?"":`${ra(i.rotate,1)}°`;case"skew":return`${ra(i.skew_x??0,1)}° ${ra(i.skew_y??0,1)}°`;case"opacity":return void 0===t.opacity?"":`${ra(100*t.opacity,0)}%`;case"blur":return void 0===t.blur?"":`${ra(t.blur,1)} px`;case"radius":return void 0===t.radius?"":`${ra(t.radius,1)} px`;case"draw":return void 0===t.draw?"":`${ra(100*t.draw,0)}%`;default:{const i=t[e];return void 0===i?"":Jr(i).startsWith("entity")?Gn(66):i}}}const oa=e=>{const t=e?G.find(t=>t.id===e)?.label:void 0;return void 0!==t?(0,K.t)(t):e?e.startsWith("steps")?Gn(900):Gn(206):Gn(214)};var la=i(8164);function ca(e){const t=e?(0,fe.Rr)(e)[0]:void 0;if(t)return(0,la.toEdit)(t);const i=String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`,n=new RegExp(String.raw`^\s*[Mm]\s*${i}[\s,]*${i}`).exec(e||"");return{anchors:n?[{x:Number(n[1]),y:Number(n[2])}]:[],closed:!1}}const da=la.serialize,pa=la.bounds,ha=la.reverse,ua=la.translate,ma=new Map;function ga(e,t){let i=ma.get(e);if(i||(i=e?An(e,200):[],ma.size>32&&ma.clear(),ma.set(e,i)),!i.length)return;const n=Math.min(1,Math.max(0,Number.isFinite(t)?t:0))*(i.length-1),s=Math.min(i.length-2,Math.floor(n));if(s<0)return i[0];const r=i[s],a=i[s+1],o=n-s;return{t:r.t+(a.t-r.t)*o,x:r.x+(a.x-r.x)*o,y:r.y+(a.y-r.y)*o,angle:r.angle+(a.angle-r.angle)*o}}const fa=[{id:"circle",label:147},{id:"figure-8",label:321},{id:"wave",label:1071},{id:"bounce",label:101},{id:"zigzag",label:1082},{id:"spiral",label:855}];function va(e,t,i,n,s,r){const a=(n-i)/s,o=[],l=r?s:s+1;for(let n=0;n<l;n++){const s=i+n*a,[c,d]=e(s),[p,h]=t(s),u=[p*a/3,h*a/3];o.push({x:c,y:d,in:r||n>0?[c-u[0],d-u[1]]:void 0,out:r||n<l-1?[c+u[0],d+u[1]]:void 0})}return{anchors:o,closed:r}}function ba(e,t=[0,0],i=40){const[n,s]=t,r=i/40,a=2*Math.PI;let o;switch(e){case"circle":{const e=30*r;o=va(t=>[n+e*Math.cos(t),s+e*Math.sin(t)],t=>[-e*Math.sin(t),e*Math.cos(t)],0,a,8,!0);break}case"figure-8":{const e=36*r,t=56*r;o=va(i=>[n+e*Math.sin(i),s+t*Math.sin(i)*Math.cos(i)],i=>[e*Math.cos(i),t*Math.cos(2*i)],0,a,8,!0);break}case"wave":{const e=80*r,t=20*r,i=2,l=a*i/e;o=va(i=>[n-e/2+i,s-t*Math.sin(l*i)],e=>[1,-t*l*Math.cos(l*e)],0,e,4*i,!1);break}case"bounce":{const e=s+20*r,t=[40,25,12].map(e=>e*r),i=[34,26,20].map(e=>e*r);let a=n-40*r;const l=[{x:a,y:e}];t.forEach((t,n)=>{const s=a+i[n],r=[a+i[n]/2,e-2*t];l[l.length-1].out=[a+2/3*(r[0]-a),e+2/3*(r[1]-e)],l.push({x:s,y:e,in:[s+2/3*(r[0]-s),e+2/3*(r[1]-e)]}),a=s}),o={anchors:l,closed:!1};break}case"zigzag":{const e=[],t=6;for(let i=0;i<=t;i++)e.push({x:n-40*r+80*r*i/t,y:s+(i%2?-15:15)*r});o={anchors:e,closed:!1};break}case"spiral":{const e=2.5,t=a*e,i=40*r/t;o=va(e=>[n+i*e*Math.cos(e),s+i*e*Math.sin(e)],e=>[i*(Math.cos(e)-e*Math.sin(e)),i*(Math.sin(e)+e*Math.cos(e))],0,t,4*e,!1);break}}return da(o)}const ya=e=>"particles"===e.subject&&"percent"===e.units?[50,50]:[0,0],xa=e=>Math.round(100*e)/100,_a=e=>`${(0,la.fmtNum)(e[0])} ${(0,la.fmtNum)(e[1])}`,wa=e=>e.length>1&&(0,fe.xg)(e[0][0],e[e.length-1][3])<1e-6;function $a(e,t){return function(e){const t=[];for(const i of e){if(!i.length)continue;const e=wa(i);t.push(`M${_a(i[0][0])}`),i.forEach((n,s)=>{(0,fe.Wv)(n[1],n[0],n[3])<1e-4&&(0,fe.Wv)(n[2],n[0],n[3])<1e-4?e&&s===i.length-1||t.push(`L${_a(n[3])}`):t.push(`C${_a(n[1])} ${_a(n[2])} ${_a(n[3])}`)}),e&&t.push("Z")}return t.join(" ")}((0,fe.Mj)(e).map(e=>e.map(e=>e.map(t))))}const ka=(e,t,i)=>$a(e,e=>[e[0]+t,e[1]+i]);function Ma(e){const t=[];for(const i of(0,fe.Mj)(e))i.length&&(t.push([i[0][0][0],i[0][0][1]]),i.forEach((e,n)=>{n===i.length-1&&wa(i)||t.push([e[3][0],e[3][1]])}));return t.map(e=>[xa(e[0]),xa(e[1])])}function Sa(e,t=12){return(0,fe.Mj)(e).map(e=>{const i=e.length?[e[0][0]]:[];for(const n of e)for(let e=1;e<=t;e++)i.push((0,fe.Mo)(n,e/t));return i})}function ja(e){let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const r of Sa(e,16))for(const e of r)t=Math.min(t,e[0]),i=Math.min(i,e[1]),n=Math.max(n,e[0]),s=Math.max(s,e[1]);return Number.isFinite(t)?{x:t,y:i,w:n-t,h:s-i}:void 0}function Ca(e){const t=(e??"").trim().split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:[0,0,24,24]}function Aa(e,t){const[i,n,s,r]=Ca(e),[a,o,l,c]=Ca(t),d=Math.min(l/s,c/r);return{k:d,dx:a+(l-s*d)/2-i*d,dy:o+(c-r*d)/2-n*d}}const za=/^(none|transparent)$/i,qa=e=>e.fill?!za.test(e.fill):!e.stroke,Ea=e=>!!e.stroke&&!za.test(e.stroke);function Ha(e,t){let i=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){const[r,a]=e[n],[o,l]=e[s];a>t[1]!=l>t[1]&&t[0]<(o-r)*(t[1]-a)/(l-a||1e-9)+r&&(i=!i)}return i}const La=e=>[...e.filter(e=>"under"===e.layer),...e.filter(e=>"under"!==e.layer)];function Va(e,t){let i=1/0;for(const n of Sa(e))for(let e=1;e<n.length;e++)i=Math.min(i,(0,fe.Wv)(t,n[e-1],n[e]));return i}function Oa(e,t,i){const n=La(e);for(let e=n.length-1;e>=0;e--){const s=n[e],r=Sa(s.d);if(qa(s)){let e=!1;for(const i of r)Ha(i,t)&&(e=!e);if(e)return s.id}const a=(Ea(s)?(s.stroke_width??1)/2:0)+i;if(Va(s.d,t)<=a)return s.id}}const Pa=/^[a-z0-9][a-z0-9_-]{0,24}$/;function Ra(e,t="shape"){const i=new Set(e.map(e=>"string"==typeof e?e:e.id)),n=Pa.test(t)?t:"shape";let s=1;for(;i.has(`${n}-${s}`);)s++;return`${n}-${s}`}function Na(e){const t=JSON.stringify(e),i="undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length;return i>65536?Gn(929,{max:Math.round(64),size:Math.ceil(i/1024)}):void 0}const Da=e=>e.rig?.shapes??[],Ta=e=>[...(e.rig?.parts??[]).map(e=>e.id),...(e.rig?.groups??[]).map(e=>e.id),...Da(e).map(e=>e.id)];function Fa(e,t){const i=Da(e);if(i.length>=en||Ta(e).includes(t.id))return;const n=e.rig??{parts:[]};return{...e,rig:{...n,parts:n.parts??[],shapes:[...i,t]}}}function Ba(e,t,i){if(!e.rig?.shapes)return e;const n=e.rig.shapes.map(e=>{if(e.id!==t)return e;const n={...e,...i};for(const e of Object.keys(n))void 0===n[e]&&delete n[e];return n});return{...e,rig:{...e.rig,shapes:n}}}function Ia(e,t,i){const n=[...Da(e)],s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const[r]=n.splice(s,1);return n.splice(Math.max(0,Math.min(n.length,i)),0,r),{...e,rig:{...e.rig,shapes:n}}}function Za(e,t,i){const n=Da(e),s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const r="under"===n[s].layer?"under":"over",a=e=>("under"===e.layer?"under":"over")===r,o=[...n],[l]=o.splice(s,1);let c=-1;if("up"===i)c=n.findIndex((e,t)=>t>s&&a(e));else for(let e=s-1;e>=0;e--)if(a(n[e])){c=e;break}if(c>=0)return o.splice(c,0,l),{...e,rig:{...e.rig,shapes:o}};if("over"===r==("up"===i))return e;const d={...l,layer:"over"===r?"under":"over"};if("over"===d.layer){const e=o.findIndex(e=>"under"!==e.layer);o.splice(e<0?s:e,0,d)}else{let e=-1;o.forEach((t,i)=>{"under"===t.layer&&(e=i)}),o.splice(e<0?s:e+1,0,d)}return{...e,rig:{...e.rig,shapes:o}}}function Wa(e,t){if(!e.rig?.shapes)return e;const i=`shape:${t}`,n={...e,rig:{...e.rig,shapes:e.rig.shapes.filter(e=>e.id!==t)}};return e.tracks&&(n.tracks=e.tracks.filter(e=>e.target!==i)),e.bindings&&(n.bindings=e.bindings.filter(e=>e.target!==i)),n}const Ka=(e,t)=>e.tracks?.find(e=>e.target===t);function Ua(e,t,i){const n=e.tracks??[],s=n.findIndex(e=>e.target===i);return t?s<0?n.length>=24?void 0:{...e,tracks:[...n,t]}:{...e,tracks:n.map((e,i)=>i===s?t:e)}:s<0?e:{...e,tracks:n.filter((e,t)=>t!==s)}}const Ga=(e,t)=>!!Ka(e,t)?.keyframes.some(e=>void 0!==e.draw);function Ya(e,t,i,n){const s=Ka(e,t);if(!i){if(!s?.path)return e;const i={...s};return delete i.path,Ua(e,i.keyframes.length?i:void 0,t)}const r=(0,fe.Mj)(i)[0]?.[0]?.[0];return r?Ua(e,{...s??{target:t,keyframes:[]},target:t,path:{d:ka(i,-r[0],-r[1]),...n?{follow_rotation:!0}:{}}},t):e}const Ja={target:["hide","solo","lock"],part:["hide","solo","lock"],group:["hide","solo","lock"],shape:["hide","solo","lock"],lane:["hide","solo","lock"],emitter:["hide","solo","lock"],children:["hide","solo","lock"],pshape:[],content:[],path:["lock"],subject:["lock"],step:["hide","solo","lock"]},Xa={hidden:[],solo:[],locked:[],open:[]},Qa=["icon","name","state","background"];function eo(e){const t="particles"===e.kind?e.particles?.sim:void 0;if(!t)return[];const i=t.emitters??[];return[t.id??"main",...i.map((e,t)=>e.id??`e${t+1}`)]}function to(e){const t=[];"keyframes"===e.kind&&t.push([jr(e),e.keyframes??[]]);for(const i of e.tracks??[])t.push([i.target,i.keyframes]);return t}function io(e,t){return Zs(to(e).filter(([e])=>e===t).flatMap(([,e])=>e))}function no(e,t,i){return Us(to(e).filter(([e])=>e===t).flatMap(([,e])=>e),i)}function so(e){const t=new Map;if("keyframes"===e.kind){for(const e of Qa)t.set(`target:${e}`,"targets");for(const i of e.rig?.parts??[])t.set(`part:${i.id}`,"parts");for(const i of e.rig?.groups??[])t.set(`group:${i.id}`,"parts");for(const i of e.rig?.shapes??[])t.set(`shape:${i.id}`,"under"===i.layer?"under":"over");for(const[i,n]of to(e))for(const e of Zs(n))t.set(`lane:${i}|${e}`,"lanes")}const i="particles"===e.kind?e.particles?.sim:void 0;if(i){const n=eo(e),s=[i.children,...(i.emitters??[]).map(e=>e.children)];n.forEach((e,i)=>{t.set(`emitter:${e}`,"emitters"),s[i]&&t.set(`children:${e}`,"emitters")})}else"particles"===e.kind&&e.particles&&t.set("emitter:main","emitters");return"sequence"===e.kind&&(e.steps??[]).forEach((e,i)=>t.set(`step:${i}`,"steps")),t}const ro="parents:";function ao(e,t){const i=so(e),n=new Set(t.hidden.filter(e=>i.has(e))),s=new Set(t.solo.filter(e=>i.has(e)));if(!s.size)return n;const r=new Set([...s].map(e=>i.get(e))),a=new Map;for(const t of e.rig?.groups??[])for(const e of t.parts)a.has(e)||a.set(e,t.id);for(const[e,t]of i){if(!r.has(t)||s.has(e))continue;const[i,...o]=e.split(":"),l=o.join(":");if("parts"===t){if("group"===i||s.has(`group:${a.get(l)}`))continue}else if("emitters"===t){const t=l;if("children"===i){if(s.has(`emitter:${t}`))continue}else if(s.has(`children:${t}`)&&!n.has(e)){n.add(`${ro}${t}`);continue}}n.add(e)}return n}function oo(e,t){const[i,...n]=t.split(":"),s=n.join(":");if("part"===i){const t=e.rig?.groups?.find(e=>e.parts.includes(s));return t?`group:${t.id}`:void 0}if("children"===i)return`emitter:${s}`;if("lane"===i){const e=t.slice(5,t.lastIndexOf("|"));return/^(part|group|shape):/.test(e)?e:`target:${e}`}}const lo={hide:"hidden",solo:"solo",lock:"locked"},co=(e,t,i)=>{for(let n=i,s=0;n&&s<4;n=oo(e,n),s++)if(t.locked.includes(n))return!0;return!1},po={rotate:"rotate",rotate_speed:"rotate",x:"x",y:"y",scale:"scale",opacity:"opacity",draw:"draw",color_mix:"color"};function ho(e,t){return e.map(e=>t.reduce(Is,e)).filter(e=>!Ts(e))}function uo(e){const t=e=>/^(part|group|shape):/.test(e)?e:`target:${e}`;return"keys"===e.kind?(e.keys??[]).map(e=>"*"===e.lane?t(e.target):`lane:${e.target}|${e.lane}`):(e.targets?.length?e.targets:e.target?[e.target]:[]).map(t)}function mo(e,t,i){return t.locked.length>0&&uo(i).some(i=>co(e,t,i))}function go(e,t,i){return fo(e,e=>e===t?i:t<i?e>t&&e<=i?e-1:e:e>=i&&e<t?e+1:e)}function fo(e,t){const i=e=>{let i=!1;const n=[];for(const s of e){const e=/^step:(\d+)$/.exec(s);if(!e){n.push(s);continue}const r=t(Number(e[1]));r!==Number(e[1])&&(i=!0),r>=0&&n.push(`step:${r}`)}return i?n:e},n={hidden:i(e.hidden),solo:i(e.solo),locked:i(e.locked),open:i(e.open)};return n.hidden===e.hidden&&n.solo===e.solo&&n.locked===e.locked&&n.open===e.open?e:n}const vo=s.AH`
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
`;function bo(e,t,i){return s.qy`<div class="lock-banner" role="status"><ha-icon icon="mdi:lock-outline"></ha-icon><span class="txt">${Gn(430)}</span><button type="button" class="btn btn-text btn-sm unlock" @click=${n=>{const s=function(e,t,i){const n=new Set;for(const s of i)for(let i=s,r=0;i&&r<4;i=oo(e,i),r++)t.locked.includes(i)&&n.add(i);return n.size?{...t,locked:t.locked.filter(e=>!n.has(e))}:t}(e,t,i);n.currentTarget.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:s,announce:Gn(1039)},bubbles:!0,composed:!0}))}}>${Gn(1038)}</button></div>`}const yo={fall:"fall",rise:"rise",drift:"drift",burst:"burst",orbit:"orbit",spiral:"spiral",fountain:"rise",explode:"burst",wave:"drift",vortex:"spiral",zigzag:"fall",rain:"fall",wander:"drift"},xo=["circle","square","triangle","star","heart","ring","line","spark"],_o={parents:60,childrenPerParent:8,elements:160,shapes:6,emitters:4,parts:2,stopsPerElement:32,warnBytes:65536,maxBytes:131072,dt:1/60,geometryVariants:4},wo={aspect:2};function $o(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const ko=(e,t)=>{let i=Math.imul(e>>>0^Math.imul(t,2654435761),2246822507);return i^=i>>>13,i=Math.imul(i,3266489909),(i^i>>>16)>>>0};function Mo(e,[t,i]){const n=Math.min(t,i),s=Math.max(t,i),r=e();return s===n?n:n+r*(s-n)}const So=Math.PI/180;function jo(e){const t=e.angle*So;return{x:-Math.sin(t)*e.strength,y:Math.cos(t)*e.strength}}const Co=e=>e*e*(3-2*e),Ao=(e,t,i)=>e+(t-e)*i;function zo(e,t,i,n){const s=Math.floor(t),r=Math.floor(i),a=Math.floor(n),o=Co(t-s),l=Co(i-r),c=Co(n-a),d=(t,i,n)=>function(e,t,i,n){let s=e^Math.imul(t,668265261)^Math.imul(i,374761393)^Math.imul(n,2654435761);return s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),((s^s>>>16)>>>0)/4294967296}(e,s+t,r+i,a+n),p=Ao(Ao(d(0,0,0),d(1,0,0),o),Ao(d(0,1,0),d(1,1,0),o),l),h=Ao(Ao(d(0,0,1),d(1,0,1),o),Ao(d(0,1,1),d(1,1,1),o),l);return 2*Ao(p,h,c)-1}const qo=2*Math.PI,Eo=Math.PI/180,Ho=(e,t,i)=>t/2+(e()-.5)*t*(Math.max(0,i)/100),Lo=e=>Math.max(5,e.spread/2),Vo=(e,t)=>{e.x=t.W/2,e.y=t.H/2},Oo=(e,t,i,n)=>{n.x+=3*(t-e.vx),n.y+=3*(i-e.vy)},Po=(e,t)=>{const i=e.x-t.W/2,n=e.y-t.H/2,s=Math.hypot(i,n)||1e-6,r=i/s,a=n/s;return{r:s,ux:r,uy:a,tx:-a*e.dir,ty:r*e.dir}},Ro=(e,t)=>{const i=t*Eo;e.vx=Math.sin(i)*e.speed,e.vy=-Math.cos(i)*e.speed},No=e=>Math.max(.1,e.lifeMean/4),Do={persistent:!1,spawn(e,t,i,n){e.x=Ho(t,i.W,i.spread),e.y=-n,e.vx=0,e.vy=e.speed}},To={fall:Do,rise:{persistent:!1,spawn(e,t,i,n){e.x=Ho(t,i.W,i.spread),e.y=i.H+n,e.vx=0,e.vy=-e.speed}},drift:{persistent:!1,spawn(e,t,i,n){e.x=-n,e.y=Ho(t,i.H,i.spread),e.vx=e.speed,e.vy=0}},burst:{persistent:!1,spawn(e,t,i){Vo(e,i),Ro(e,360*t())}},orbit:{persistent:!0,spawn(e,t,i){const n=t()*qo,s=Lo(i);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const r=Po(e,i);e.vx=r.tx*e.speed,e.vy=r.ty*e.speed},accel(e,t,i){const n=Po(e,t),s=2*(Lo(t)-n.r);Oo(e,n.tx*e.speed+n.ux*s,n.ty*e.speed+n.uy*s,i)}},spiral:{persistent:!1,spawn(e,t,i){const n=t()*qo;e.x=i.W/2+Math.cos(n),e.y=i.H/2+Math.sin(n);const s=Po(e,i);e.vx=(.6*s.ux+s.tx)*e.speed,e.vy=(.6*s.uy+s.ty)*e.speed},accel(e,t,i){const n=Po(e,t);Oo(e,(.6*n.ux+n.tx)*e.speed,(.6*n.uy+n.ty)*e.speed,i)}},fountain:{persistent:!1,spawn(e,t,i,n){e.x=i.W/2+(t()-.5)*i.W*(Math.max(0,i.spread)/100)*.25,e.y=i.H+n,Ro(e,40*(t()-.5))},fall:e=>2*e.vMean/Math.max(.1,e.lifeMean)},explode:{persistent:!1,spawn(e,t,i){Vo(e,i),Ro(e,150*(t()-.5))},fall:e=>1.5*e.vMean/Math.max(.1,e.lifeMean)},wave:{persistent:!1,spawn(e,t,i,n){const s=t()*qo,r=2*qo/Math.max(.2,i.lifeMean);e.baseY=Ho(t,i.H,i.spread),e.x=-n,e.y=e.baseY+8*Math.sin(s),e.vx=e.speed,e.vy=8*r*Math.cos(s)},accel(e,t,i){const n=2*qo/Math.max(.2,t.lifeMean);i.y+=-n*n*(e.y-e.baseY)}},vortex:{persistent:!1,spawn(e,t,i){const n=t()*qo,s=Math.max(10,i.spread/2);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const r=Po(e,i);e.vx=r.tx*e.speed,e.vy=r.ty*e.speed},accel(e,t,i){const n=Po(e,t),s=n.r>2?.4:0;Oo(e,(n.tx-n.ux*s)*e.speed,(n.ty-n.uy*s)*e.speed,i)}},zigzag:{persistent:!1,spawn(e,t,i,n){Do.spawn(e,t,i,n);const s=No(i);e.baseX=e.x,e.vx=24*-e.dir/s},accel(e,t,i){const n=No(t),s=Math.floor(e.age/n)%2==0?1:-1;i.x+=s*e.dir*48/(n*n)}},rain:{persistent:!1,align:!0,spawn(e,t,i,n){e.x=t()*i.W*(.2+Math.max(0,i.spread)/100)-.1*i.W,e.y=-n,e.vx=0,e.vy=e.speed}},wander:{persistent:!0,spawn(e,t,i){e.x=Ho(t,i.W,i.spread),e.y=Ho(t,i.H,i.spread),e.baseX=e.x,e.baseY=e.y,Ro(e,360*t())},accel(e,t,i){const n=zo(625341585^t.noiseSeed,e.x/20,e.y/20,.4*e.age)*qo;Oo(e,Math.cos(n)*e.speed+.8*(e.baseX-e.x),Math.sin(n)*e.speed+.8*(e.baseY-e.y),i)}}},Fo=_o.dt,Bo=2*Fo,Io={builtin:"circle"},Zo=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy}),Wo=([e,t])=>(e+t)/2,Ko=(e,t)=>Math.min(Math.max(e,Bo),Math.max(Bo,Math.min(20,t-Bo)));function Uo(e,t,i){const n=e.sim,s=i.aspect>0?i.aspect:2,r=s>=1?100*s:100,a=s>=1?100:100/s,o=To[n.flow]??To.fall,l=ko(n.seed,3),c={W:r,H:a,spread:e.spread,vMean:Math.abs(Wo(n.ranges.speed)),lifeMean:Ko(Wo(n.ranges.lifetime),t),noiseSeed:l},d=function(e,t,i,n){const s=t.content,r="none"!==e.content&&s&&s.w>0&&s.h>0?{x0:s.x/100*i,y0:s.y/100*n,x1:(s.x+s.w)/100*i,y1:(s.y+s.h)/100*n}:void 0;return{floor:e.floor,ceiling:e.ceiling,left:e.left,right:e.right,...r?{content:r}:{}}}(n.colliders,i,r,a),p=((e,t)=>({x:e.x+t.x,y:e.y+t.y}))(jo(n.physics.gravity),{x:0,y:o.fall?.(c)??0});return{spec:e,sim:n,period:t,W:r,H:a,flow:o,ctx:c,physics:n.physics,colliders:d,...d.content?{content:d.content}:{},gravity:p,rest:(h=p,2+2*Math.hypot(h.x,h.y)*Fo),noiseSeed:l};var h}const Go=(e,t)=>{const i=function(e,t){const i=e();let n=0;for(const e of t)n+=e>0?e:0;if(!(n>0))return 0;let s=0;const r=i*n;for(let e=0;e<t.length;e++)if(s+=t[e]>0?t[e]:0,r<s)return e;for(let e=t.length-1;e>=0;e--)if(t[e]>0)return e;return 0}(e,t.map(e=>e.weight));return t.length?t[i].shape:Io},Yo=e=>e/2/120*100;function Jo(e,t,i){const{sim:n,spec:s,period:r}=e,a=Go(t,n.shapes),o=Mo(t,s.size),l=Mo(t,n.ranges.speed),c=Mo(t,n.ranges.spin),d=t()<.5?-c:c,p=Mo(t,n.ranges.delay),h=Mo(t,n.ranges.lifetime),u=Mo(t,n.ranges.opacity),m=t()<.5?-1:1,g=Yo(o),f=e.flow.persistent&&r<=20,v={index:i,x:0,y:0,vx:0,vy:0,age:0,speed:l,dir:m,baseX:0,baseY:0,birth:r>0?(Math.max(0,p)%r+r)%r:0,life:f?r:Ko(h,r),spin:d,peak:u,size:o,radius:g,shape:a,...s.colors.length?{color:s.colors[i%s.colors.length]}:{},persistent:f,physics:e.physics,gravity:e.gravity,flow:e.flow};return e.flow.spawn(v,t,e.ctx,g),v}function Xo(e,t,i,n){if(e.persistent)return i?.675+.325*Math.cos(t/n*Math.PI*2):1;const s=i?.1*e.life:Fo;return Math.max(0,Math.min(1,t/s,(e.life-t)/s))}function Qo(e,t){let i=t.spin*t.age;return t.flow?.align&&(t.vx||t.vy)&&(i+=180*Math.atan2(-t.vx,t.vy)/Math.PI),{age:t.age,x:t.x,y:t.y,rotate:i,opacity:t.peak*Xo(t,t.age,e.spec.fade,e.period),scale:1}}function el(e,t,i){const n={x:t.gravity.x,y:t.gravity.y},s=function(e,t,i,n){if(!(t.strength>0))return{x:0,y:0};const s=Math.max(1,t.scale),r=.6*n;return{x:zo(e,i.x/s,i.y/s,r)*t.strength,y:zo(1540483477^e,i.x/s,i.y/s,r+17)*t.strength}}(e.noiseSeed,t.physics.turbulence,t,t.age);n.x+=s.x,n.y+=s.y,t.flow?.accel?.(t,e.ctx,n);const r=((e,t)=>e>0?Math.exp(-e*t):1)(t.physics.drag,i);return t.vx=(t.vx+n.x*i)*r,t.vy=(t.vy+n.y*i)*r,t.x+=t.vx*i,t.y+=t.vy*i,t.age+=i,function(e,t,i,n,s,r,a,o){let l;const c=(t,i,n,s)=>{e.x=n,e.y=s;const c=e.vx*t+e.vy*i;if(c>=0)return;const d=e.vx-c*t,p=e.vy-c*i,h=Math.sqrt(Math.max(0,r));let u=-c*r;u<a&&(u=0),e.vx=d*h+u*t,e.vy=p*h+u*i,-c>=a&&!l&&(l={age:o,x:n,y:s,nx:t,ny:i,speed:-c})};s.floor&&e.y>n-t&&c(0,-1,e.x,n-t),s.ceiling&&e.y<t&&c(0,1,e.x,t),s.left&&e.x<t&&c(1,0,t,e.y),s.right&&e.x>i-t&&c(-1,0,i-t,e.y);const d=s.content;if(d&&e.x>d.x0-t&&e.x<d.x1+t&&e.y>d.y0-t&&e.y<d.y1+t){const i=e.x-(d.x0-t),n=d.x1+t-e.x,s=e.y-(d.y0-t),r=d.y1+t-e.y,a=Math.min(i,n,s,r);a===s?c(0,-1,e.x,d.y0-t):a===r?c(0,1,e.x,d.y1+t):a===i?c(-1,0,d.x0-t,e.y):c(1,0,d.x1+t,e.y)}return l}(t,t.radius,e.W,e.H,e.colliders,t.physics.bounce,e.rest,t.age)}function tl(e,t,i){const n=[Qo(e,t)],s=[];let r=void 0!==i&&i<=0?Zo(t):void 0;const a=t.x,o=t.y,l=Math.ceil(t.life/Fo-1e-9);for(let c=0;c<l;c++){const d=Math.min(Fo,t.life-t.age);if(d<=1e-12)break;const p=el(e,t,d);c===l-1&&(t.age=t.life),p&&s.push({...p,vx:t.vx,vy:t.vy}),void 0!==i&&!r&&t.age>=i-1e-9&&(r=Zo(t));const h=Qo(e,t);if(t.persistent){const e=Math.max(0,Math.min(1,(t.age-.85*t.life)/(.15*t.life))),i=e*e*(3-2*e);h.x+=(a-h.x)*i,h.y+=(o-h.y)*i}n.push(h)}const c=n[n.length-1];return{samples:n,hits:s,...r?{at:r}:{},end:{...Zo(t),x:c.x,y:c.y}}}const il=Math.PI/180,nl=e=>e?Math.max(0,Math.min(_o.childrenPerParent,Math.floor(e.count))):0;function sl(e,t){return"collision"===e.trigger?t.hits[0]:"time"===e.trigger?t.at:t.end}function rl(e,t,i,n,s,r){const a=nl(t),{physics:o,gravity:l}=function(e,t){const i=t.physics??{},n={...e.physics,...i},s=e.gravity.y-jo(e.physics.gravity).y,r=jo(n.gravity);return{physics:n,gravity:{x:r.x,y:r.y+s}}}(e,t),c=Math.hypot(n.vx,n.vy),d=void 0!==n.nx&&void 0!==n.ny?Math.atan2(n.nx,-n.ny):c>1e-9?Math.atan2(n.vx,-n.vy):0,p=Math.max(0,Math.min(360,t.cone))*il,h=[];for(let c=0;c<a;c++){const a=Go(s,t.shapes),u=Mo(s,t.size),m=Mo(s,t.ranges.speed),g=Mo(s,t.ranges.spin),f=s()<.5?-g:g,v=Ko(Mo(s,t.ranges.lifetime),e.period),b=Mo(s,t.ranges.opacity),y=d+(s()-.5)*p;if(c>=r)continue;const x=t.colors.length?t.colors[c%t.colors.length]:i.color;h.push({index:c,x:n.x,y:n.y,vx:Math.sin(y)*m+n.vx*t.inherit,vy:-Math.cos(y)*m+n.vy*t.inherit,age:0,speed:m,dir:1,baseX:n.x,baseY:n.y,birth:((i.birth+n.age)%e.period+e.period)%e.period,life:v,spin:f,peak:b,size:u,radius:Yo(u),shape:a,...void 0!==x?{color:x}:{},persistent:!1,physics:o,gravity:l})}return h}function al(e,t,i){const n=t.t-e.t,s=n>0?(i.t-e.t)/n:0,r=i=>e[i]+(t[i]-e[i])*s;return Math.max(Math.abs(i.x-r("x")),Math.abs(i.y-r("y")),Math.abs(i.rotate-r("rotate"))/3.6,100*Math.abs(i.opacity-r("opacity")),100*Math.abs(i.scale-r("scale")))}function ol(e){const t=e.length,i=new Float64Array(t);if(!t)return i;i[0]=1/0,i[t-1]=1/0;for(let n=1;n<t-1;n++)e[n].keep&&(i[n]=1/0);const n=[];for(let e=0;e<t;e++)i[e]===1/0&&n.push(e);const s=[];for(let e=0;e+1<n.length;e++)s.push([n[e],n[e+1],1/0]);for(;s.length;){const[t,n,r]=s.pop();if(n-t<2)continue;let a=-1,o=t+1;for(let i=t+1;i<n;i++){const s=al(e[t],e[n],e[i]);s>a&&(a=s,o=i)}const l=Math.min(a,r);i[o]=l,s.push([t,o,l],[o,n,l])}return i}function ll(e,t,i,n){let s=0;for(let e=0;e<t.length;e++)t[e]>i&&s++;let r=i;if(s>n){const s=Array.from(t).sort((e,t)=>t-e);if(r=Math.max(i,s[n-1]===1/0?1/0:s[n]),r===1/0)return e.filter((e,i)=>t[i]===1/0).slice(0,n)}return e.filter((e,i)=>t[i]>r)}const cl=e=>e.reduce((e,t)=>e+t,0);function dl(e){const t=[e,...(e.sim.emitters??[]).slice(0,_o.emitters-1).map(t=>((e,t)=>({...e,count:t.count,size:t.size,colors:t.colors,fade:t.fade,spread:t.spread,layer:t.layer??e.layer,sim:{...e.sim,seed:t.seed,flow:t.flow,shapes:t.shapes,ranges:t.ranges,physics:t.physics,children:t.children}}))(e,t))];let i=_o.parents;const n=t.map(e=>{const t=Math.min(Math.max(0,Math.floor(e.count)),i);return i-=t,t}),s=t.map((e,t)=>n[t]*nl(e.sim.children)),r=_o.elements-cl(n);let a=s;if(cl(s)>r){const e=cl(n.filter((e,t)=>s[t]));a=s.map((t,i)=>t&&Math.min(t,Math.floor(r*n[i]/e)));let t=r-cl(a);a=a.map((e,i)=>e<s[i]&&t-- >0?e+1:e)}const o="front"!==e.layer,l=t.map((e,t)=>({spec:e,n:n[t],m:a[t],at:0,front:"front"===e.layer,index:t})),c=e=>e.front===o,d=[...l.filter(e=>!c(e)),...l.filter(c)];let p=0;d.forEach(e=>{e.at=p,p+=e.n+e.m});const h=d.findIndex(c);return{plans:d,cut:h<0?d.length:h,pool:p}}const pl=e=>e.cut<e.plans.length?e.plans[e.cut].at:e.pool,hl=_o,ul=[.5,1,2,4,8,16,32],ml=(e,t)=>{const i=10**t,n=Math.round(e*i)/i;return 0===n?0:n},gl=(e,t,i)=>Math.min(i,Math.max(t,e));function fl(e){const t=Number.isFinite(e.aspect)&&e.aspect>0?e.aspect:2,i=gl(Math.round(4*t)/4,.25,8),n=e.content;if(!n||![n.x,n.y,n.w,n.h].every(Number.isFinite))return{aspect:i};const s=e=>gl(5*Math.round(e/5),0,100);return{aspect:i,content:{x:s(n.x),y:s(n.y),w:s(n.w),h:s(n.h)}}}function vl(e){return`${(e=>ml(100*e,3))(e.t)}%{translate:${e.x}cqw ${e.y}cqh;rotate:${e.rotate}deg;opacity:${e.opacity}${1!==e.scale?`;scale:${e.scale}`:""}}`}const bl=e=>e.reduce((e,t)=>e+vl(t).length,160);function yl(e,t,i){const n=e.period,s=i.map(e=>({...e,tau:t.birth+e.age}));let r;if(t.persistent?s[s.length-1]={...s[0],tau:t.birth+n}:(s[0].keep=!0,s[s.length-1].keep=!0,s.push({...s[0],tau:t.birth+n,keep:!0})),t.birth<=0)r=s;else{let e=s.findIndex(e=>e.tau>=n);e<1&&(e=1);const t=s[e].tau===n?{...s[e],keep:!0}:((e,t,i)=>{const n=t.tau>e.tau?(i-e.tau)/(t.tau-e.tau):0,s=i=>e[i]+(t[i]-e[i])*n;return{tau:i,age:s("age"),x:s("x"),y:s("y"),rotate:s("rotate"),opacity:s("opacity"),scale:s("scale"),keep:!0}})(s[e-1],s[e],n),i=s.slice(0,e),a=s.slice(s[e].tau===n?e+1:e,-1).map(e=>({...e,tau:e.tau-n}));r=[{...t,tau:0},...a,...i,{...t,tau:n}]}const a=t.persistent?360*Math.round(t.spin*n/360):0,o=r.map(i=>({t:i.tau/n,x:i.x/e.W*100,y:i.y/e.H*100,rotate:t.persistent?a*i.tau/n:i.rotate,opacity:i.opacity,scale:i.scale,...i.keep?{keep:!0}:{}}));return o[0].t=0,o[o.length-1].t=1,o}function xl(e){const t=[];return e.forEach((i,n)=>{const s=n===e.length-1?1:ml(i.t,5),r={t:s,x:ml(i.x,2),y:ml(i.y,2),rotate:ml(i.rotate,1),opacity:ml(gl(i.opacity,0,1),3),scale:ml(i.scale,3)},a=t[t.length-1];a&&a.t>=s?(n===e.length-1||i.keep)&&(t[t.length-1]=r):t.push(r)}),t}function _l(e){const t=e.period>0&&Number.isFinite(e.period)?e.period:1,i=fl(e.geometry),n=dl(e.spec),s=[],r={elements:0,stops:0,bytes:0,capped:!1,warn:!1};let a=0;n.plans.forEach((e,o)=>{o===n.cut&&(a=s.length);const l=function(e,t,i,n){const s=e.spec,r=s.sim,a=Uo(s,t,i),o=e.n;let l=Math.floor(s.count)>o;const c=r.children,d=nl(c),p=$o(r.seed),h=[],u=[];for(let e=0;e<o;e++){const t=Jo(a,p,e),i=tl(a,t,"time"===c?.trigger?c.at??0:void 0);u.push(i);const n=yl(a,t,i.samples);h.push({p:t,raw:n,rank:ol(n)})}const m=[];if(c&&d>0){const t=h.map((e,t)=>sl(c,u[t])?t:-1).filter(e=>e>=0),i=e.m,n=t.length?Math.floor(i/t.length):0,s=t.length?i%t.length:0;t.length*d>i&&(l=!0);const o=$o(ko(r.seed,2));t.forEach((e,t)=>{const i=Math.min(d,n+(t<s?1:0)),r=sl(c,u[e]);for(const t of rl(a,c,h[e].p,r,o,i)){const i=yl(a,t,tl(a,t).samples);m.push({p:t,raw:i,rank:ol(i),parent:e})}})}let g=d,f=[],v=0;for(;;){const e=[...h,...m.filter(e=>e.p.index<g)];for(const t of ul){f=[],v=0;const i=new Map;if(e.forEach((e,n)=>{void 0===e.parent&&i.set(e.p.index,n);const s=xl(ll(e.raw,e.rank,t,hl.stopsPerElement));v+=bl(s),f.push({slot:n,...void 0!==e.parent?{parent:i.get(e.parent)}:{},shape:{...e.p.shape},size:ml(e.p.size,2),...void 0!==e.p.color?{color:e.p.color}:{},stops:s})}),v<=n)break;l=!0}if(v<=n||0===g)break;g=Math.floor(g/2)}for(;v>n&&f.length;){const e=f.pop();v-=bl(e.stops),l=!0}const b=f.reduce((e,t)=>e+t.stops.length,0);return{engine:1,period:t,geometry:i,elements:f,stats:{elements:f.length,stops:b,bytes:v,capped:l,warn:v>hl.warnBytes}}}(e,t,i,n.plans[1]?Math.floor(hl.maxBytes*(e.n+e.m)/n.pool):hl.maxBytes);l.elements.forEach(t=>s.push({...t,slot:t.slot+e.at,...void 0!==t.parent?{parent:t.parent+e.at}:{}})),r.stops+=l.stats.stops,r.bytes+=l.stats.bytes,r.capped||=l.stats.capped}),r.elements=s.length,r.warn=r.bytes>hl.warnBytes;const o=n.plans[n.cut];return{engine:1,period:t,geometry:i,elements:s,stats:r,...o?{parts:{element:a,slot:o.at,front:o.front}}:{}}}const wl=(e,t,i)=>`mcc-${e}-${fn(JSON.stringify([t,i]))}`,$l=(e,t)=>`${e}-g${function(e){const t=e.content;return`${Math.round(4*e.aspect)}${t?`c${t.x}_${t.y}_${t.w}_${t.h}`:""}`}(t)}`;function kl(e){const t=e.shape,i={x:0,phase:0,k:0,style:""};return"builtin"in t?i.shape=t.builtin:"icon"in t?i.symbol={icon:t.icon}:"emoji"in t&&(i.symbol={text:t.emoji}),i}function Ml(e,t){if(!e.length)return{t,x:0,y:0,rotate:0,scale:1,opacity:0};const i=e.findIndex(e=>e.t>=t);if(i<=0)return{...e[0===i?0:e.length-1],t};const n=e[i-1],s=e[i],r=s.t>n.t?(t-n.t)/(s.t-n.t):0,a=e=>n[e]+(s[e]-n[e])*r;return{t,x:a("x"),y:a("y"),rotate:a("rotate"),scale:a("scale"),opacity:a("opacity")}}function Sl(e,t,i,n,s=e=>e){const r=`.mc-anim-fx[data-fx="${e}"]`,a=`mcp${fn(e)}-`,o=[`${r}{opacity:var(${bn(t,"s")},1)}`,`${r}>i{left:0;top:0;width:var(--mcc-sz);height:var(--mcc-sz);margin:calc(var(--mcc-sz)/-2) 0 0 calc(var(--mcc-sz)/-2);color:var(--mcc-pc,var(${bn(t,"c")},var(--mc-anim-c)));display:flex;align-items:center;justify-content:center;font-size:var(--mcc-sz);line-height:1;font-style:normal;--mdc-icon-size:var(--mcc-sz);${n?"animation-timing-function:linear":"animation:none"}}`],l=new Map;return i.forEach((e,t)=>{const i=s(t);"svg"in e.shape&&l.set(e.shape.svg,[...l.get(e.shape.svg)??[],i]);const c=n?`animation-name:${a}${i};`:"",d=e.color?lt(e.color,"color"):void 0;var p;o.push(`${r}>i:nth-child(${i+1}){${c}--mcc-sz:${p=e.size,Math.round(100*p)/100||0}px${d?`;--mcc-pc:${d}`:""}}`),n&&o.push(`@keyframes ${a}${i}{${n(t)}}`)}),l.forEach((e,t)=>{const i=We(t).markup,n=i?`-webkit-mask:${Hn(i)} center/contain no-repeat;mask:${Hn(i)} center/contain no-repeat`:"border-radius:50%";o.push(`${r}>i:is(${e.map(e=>`:nth-child(${e+1})`).join(",")}){background:currentColor;${n}}`)}),o.join("\n")}function jl(e,t,i,n,s=0,r=e.elements.length,a=0){const o=e.elements.slice(s,r),l=o.map(e=>n?.[e.slot]??(e=>({shape:e.shape,size:e.size,...void 0!==e.color?{color:e.color}:{}}))(e));return{css:Sl(t,i,l,e=>o[e].stops.map(vl).join(""),n?e=>o[e].slot-a:void 0),slots:(n??l).map(kl)}}const Cl={circle:{d:"M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"},square:{d:"M5 5h14v14H5z"},triangle:{d:"M12 4l8 15H4z"},star:{d:"M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"},heart:{d:"M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"},ring:{d:"M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z",stroke:3},line:{d:"M6 19L18 5",stroke:3},spark:{d:"M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"}};function Al(e){const t=Cl[e];return t.stroke?`<path d="${t.d}" fill="none" stroke="currentColor" stroke-width="${t.stroke}" stroke-linecap="round"/>`:`<path d="${t.d}"/>`}const zl=[".mc-anim-fx>i[data-s]{background:currentColor}",'.mc-anim-fx>i[data-s="circle"]{border-radius:50%}','.mc-anim-fx>i[data-s="square"]{border-radius:0}',...xo.filter(e=>"circle"!==e&&"square"!==e).map(e=>`.mc-anim-fx>i[data-s="${e}"]{${(e=>{const t=Hn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${Al(e)}</svg>`);return`-webkit-mask:${t} center/contain no-repeat;mask:${t} center/contain no-repeat`})(e)}}`)].join("\n"),ql=e=>String(Math.round(100*e)/100||0),El=e=>String(Math.round(1e3*e)/1e3||0),Hl=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function Ll(e){const t=void 0!==e?lt(e,"color"):void 0;return t&&!/var\(/i.test(t)?t:void 0}const Vl=(e,t)=>`transform:translate(${ql(e.x)}px,${ql(e.y)}px) rotate(${ql(e.rotate)}deg) scale(${El(e.scale*t)});opacity:${El(e.opacity)}`,Ol="particles.sim",Pl=[...et,"fountain","explode","wave","vortex","zigzag","rain","wander"],Rl=["death","collision","time"],Nl=["none","icon","text"],Dl=[0,1e3],Tl=[-3600,3600],Fl=[0,6e3],Bl=[.01,600],Il=[0,1],Zl=[.001,1e3],Wl=[-360,360],Kl=[0,1e3],Ul=[0,20],Gl=[0,1e3],Yl=[.1,1e3],Jl=[0,1],Xl=[0,600],Ql=[.1,200],ec=[0,360],tc=[0,1],ic={speed:[20,40],spin:[0,0],delay:[0,2],lifetime:[2,2],opacity:[1,1]},nc={gravity:{angle:0,strength:0},drag:0,turbulence:{strength:0,scale:20},bounce:.5},sc={floor:!1,ceiling:!1,left:!1,right:!1,content:"none"},rc=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function ac(e,t,i,n,s,r,a){const o=t[i];if(null==o)return[...r];if(!Array.isArray(o)||2!==o.length||!o.every(e=>"number"==typeof e&&Number.isFinite(e)))return e.err(n,"Must be [min, max]."),[...r];let[l,c]=o;if(l>c&&(a||e.err(n,"Min must not be above max."),[l,c]=[c,l]),l<s[0]||c>s[1]){if(e.err(n,`Must be between ${s[0]} and ${s[1]}.`),!a)return[...r];l=Math.min(s[1],Math.max(s[0],l)),c=Math.min(s[1],Math.max(s[0],c))}return[l,c]}const oc=(e,t,i,n,s,r,a=!1)=>e.num(t,i,n,s[0],s[1],r,a)??r;function lc(e,t,i){if(null==t)return[];const n=e.list(t,i,_o.shapes),s=[];return n?.forEach((t,n)=>{const r=e.obj(t,`${i}[${n}]`);if(!r)return;const a=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["builtin","icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of builtin, icon, emoji or svg.");const r=s[0],a=n[r];if("string"!=typeof a)return e.err(`${i}.${r}`,"Must be text.");if("builtin"===r)return xo.includes(a)?{builtin:a}:e.err(`${i}.builtin`,`Must be one of: ${xo.join(", ")}.`);if("icon"===r)return pt.test(a.trim())?{icon:a.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===r){const t=a.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(o=a,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(o).length:o.length)>qe)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");var o;if(!/<svg[\s>]/i.test(a))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=We(a);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:a}}(e,r.shape,`${i}[${n}].shape`),o=e.num(r,"weight",`${i}[${n}].weight`,Zl[0],Zl[1],1);a&&void 0!==o&&s.push({shape:a,weight:o})}),s}function cc(e,t,i){if(null==t)return[];const n=[];return e.list(t,i,it)?.forEach((t,s)=>{const r=lt(t,"color");r?n.push(r):e.err(`${i}[${s}]`,"Not a valid colour.")}),n}function dc(e,t,i,n,s){if(null==t)return s?{}:{...n};const r=e.obj(t,i);if(!r)return s?{}:{...n};const a={},o=e=>!s||void 0!==r[e]&&null!==r[e];if(o("gravity")){const t=rc(r.gravity)?r.gravity:e.obj(r.gravity??{},`${i}.gravity`)??{};a.gravity={angle:oc(e,t,"angle",`${i}.gravity.angle`,Wl,n.gravity.angle),strength:oc(e,t,"strength",`${i}.gravity.strength`,Kl,n.gravity.strength)}}if(o("drag")&&(a.drag=oc(e,r,"drag",`${i}.drag`,Ul,n.drag)),o("turbulence")){const t=rc(r.turbulence)?r.turbulence:e.obj(r.turbulence??{},`${i}.turbulence`)??{};a.turbulence={strength:oc(e,t,"strength",`${i}.turbulence.strength`,Gl,n.turbulence.strength),scale:oc(e,t,"scale",`${i}.turbulence.scale`,Yl,n.turbulence.scale)}}return o("bounce")&&(a.bounce=oc(e,r,"bounce",`${i}.bounce`,Jl,n.bounce)),a}function pc(e,t,i){if(null==t)return{...sc};const n=e.obj(t,i);return n?{floor:e.bool(n,"floor",`${i}.floor`,!1),ceiling:e.bool(n,"ceiling",`${i}.ceiling`,!1),left:e.bool(n,"left",`${i}.left`,!1),right:e.bool(n,"right",`${i}.right`,!1),content:e.oneOf(n,"content",`${i}.content`,Nl,"none")??"none"}:{...sc}}function hc(e,t,i,n){const s=e.obj(t,i);if(!s)return;const r=e.errors.length;void 0!==s.children&&null!==s.children&&e.err(`${i}.children`,"Children cannot have children of their own.");const a=e.oneOf(s,"trigger",`${i}.trigger`,Rl);a||void 0!==s.trigger||e.err(`${i}.trigger`,"Required.");const o=rc(s.ranges)?s.ranges:e.obj(s.ranges??{},`${i}.ranges`)??{},l={trigger:a??"death",count:oc(e,s,"count",`${i}.count`,[1,_o.childrenPerParent],3,!0),shapes:lc(e,s.shapes,`${i}.shapes`),size:ac(e,s,"size",`${i}.size`,Ql,[4,6],n),colors:cc(e,s.colors,`${i}.colors`),ranges:{speed:ac(e,o,"speed",`${i}.ranges.speed`,Dl,[20,40],n),lifetime:ac(e,o,"lifetime",`${i}.ranges.lifetime`,Bl,[.5,1],n),opacity:ac(e,o,"opacity",`${i}.ranges.opacity`,Il,[1,1],n),spin:ac(e,o,"spin",`${i}.ranges.spin`,Tl,[0,0],n)},cone:oc(e,s,"cone",`${i}.cone`,ec,360),inherit:oc(e,s,"inherit",`${i}.inherit`,tc,0)};"time"===l.trigger?l.at=oc(e,s,"at",`${i}.at`,Xl,.5):void 0===s.at||null===s.at||n||e.err(`${i}.at`,"Only for the trigger time.");const c=dc(e,s.physics,`${i}.physics`,nc,!0);return Object.keys(c).length&&(l.physics=c),n&&e.errors.length>r?void 0:l}const uc=/^[a-z0-9-]{1,16}$/;function mc(e,t,i,n,s){const r=rc(t.ranges)?t.ranges:e.obj(t.ranges??{},`${i}.ranges`)??{},a=ic;return{seed:oc(e,t,"seed",`${i}.seed`,[0,4294967295],0,!0)>>>0,flow:s,shapes:lc(e,t.shapes,`${i}.shapes`),ranges:{speed:ac(e,r,"speed",`${i}.ranges.speed`,Dl,a.speed,n),spin:ac(e,r,"spin",`${i}.ranges.spin`,Tl,a.spin,n),delay:ac(e,r,"delay",`${i}.ranges.delay`,Fl,a.delay,n),lifetime:ac(e,r,"lifetime",`${i}.ranges.lifetime`,Bl,a.lifetime,n),opacity:ac(e,r,"opacity",`${i}.ranges.opacity`,Il,a.opacity,n)},physics:dc(e,t.physics,`${i}.physics`,nc,!1)}}function gc(e,t,i,n,s,r){const a="string"==typeof t.id&&uc.test(t.id)&&!n.has(t.id)?t.id:"";a?n.add(a):(s||null!=t.id)&&e.err(`${i}.id`,"Must be 1-16 of a-z, 0-9 and -, and unique.");const o="string"==typeof t.name?t.name.trim():void 0;return(void 0===o?null!=t.name:o.length>40&&!r)&&e.err(`${i}.name`,"Must be text of at most 40 characters."),{id:a,name:o?.slice(0,40)||void 0}}function fc(e,t,i){const n="lenient"===t,s=new vt,r=s.obj(e,Ol);if(!r)return{errors:s.errors};if(1!==r.engine&&(s.err(`${Ol}.engine`,void 0===r.engine?"Required.":"This card plays engine 1; update Magic Card to play this animation."),n))return{errors:s.errors};const a=s.oneOf(r,"flow",`${Ol}.flow`,Pl);if(!a&&(void 0===r.flow&&s.err(`${Ol}.flow`,"Required."),n))return{errors:s.errors};const o={engine:1,mode:s.oneOf(r,"mode",`${Ol}.mode`,["baked","live"],"baked")??"baked",...mc(s,r,Ol,n,a??"fall"),colliders:pc(s,r.colliders,`${Ol}.colliders`)};if(void 0!==r.children&&null!==r.children){const e=hc(s,r.children,`${Ol}.children`,n);e&&(o.children=e)}if(void 0!==r.emitters&&null!==r.emitters){const e=gc(s,r,Ol,new Set,!1,n),t=function(e,t,i,n,s){const r=`${Ol}.emitters`,a=_o.emitters-1,o=new Set(n?[n]:[]),l=[];e.list(t,r,i?1/0:a)?.slice(0,a).forEach((t,n)=>{const s=`${r}[${n}]`,a=e.obj(t,s);if(!a)return;const{id:c,name:d}=gc(e,a,s,o,!0,i),p=e.oneOf(a,"layer",`${s}.layer`,["front","back"]),h=e.errors.length,u=e.oneOf(a,"flow",`${s}.flow`,Pl);u||e.err(`${s}.flow`,"Required.");const m={id:c,...d&&{name:d},...p&&{layer:p},count:oc(e,a,"count",`${s}.count`,[1,_o.parents],10,!0),size:ac(e,a,"size",`${s}.size`,Ql,[6,10],i),colors:cc(e,a.colors,`${s}.colors`),fade:e.bool(a,"fade",`${s}.fade`,!0),spread:oc(e,a,"spread",`${s}.spread`,[0,100],100),...mc(e,a,s,i,u??"fall")},g=e.errors.length===h,f=null==a.children?void 0:hc(e,a.children,`${s}.children`,i);f&&(m.children=f),i&&!g||l.push(m)});let c=s+l.reduce((e,t)=>e+t.count,0)-_o.parents;if(c>0){e.err(r,`At most ${_o.parents} particles over all emitters.`);for(let e=l.length;i&&c>0&&e--;){const t=Math.min(c,l[e].count);l[e].count-=t,c-=t}}const d=l.filter(e=>e.count>0),p=new Set(n?[n]:[]);d.forEach(e=>e.id&&!p.has(e.id)?p.add(e.id):e.id="");let h=0;return d.forEach(e=>{if(!e.id){for(;p.has("e"+ ++h););p.add(e.id=`e${h}`)}}),d}(s,r.emitters,n,e.id,i?Math.max(0,Math.floor(i.count)):1);t.length&&Object.assign(o,e.id&&{id:e.id},e.name&&{name:e.name},{emitters:t})}return{sim:o,errors:s.errors}}const vc=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),vc(e,t);return!0},bc=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},yc=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),wc(t)}};function xc(e){void 0!==this._$AN?(bc(this),this._$AM=e,yc(this)):this._$AM=e}function _c(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)vc(n[e],!1),bc(n[e]);else null!=n&&(vc(n,!1),bc(n));else vc(this,e)}const wc=e=>{e.type==O.OA.CHILD&&(e._$AP??=_c,e._$AQ??=xc)};class $c extends O.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),yc(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(vc(this,e),bc(this))}setValue(e){if(R(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let kc;const Mc=new WeakMap,Sc=new Set,jc=new WeakMap,Cc=new WeakSet,Ac=new WeakSet,zc=new WeakSet;function qc(e,t){for(let i=e;i;i=i.parentNode instanceof ShadowRoot?i.parentNode.host:i.parentNode)if(t?i===t:zc.has(i))return!0;return!1}function Ec(e,t){const i=t&&(Cc.has(e)||!qc(e));e.toggleAttribute("offscreen",!i),Mc.get(e)?.(i)}function Hc(e,t=!0,i=!0){const n=function(){if(!kc&&"undefined"!=typeof IntersectionObserver){kc=new IntersectionObserver(e=>{for(const t of e)jc.set(t.target,t.isIntersecting),Ec(t.target,t.isIntersecting)});const[e,t]=[kc.observe.bind(kc),kc.unobserve.bind(kc)];kc.observe=t=>{Sc.add(t),e(t)},kc.unobserve=e=>{Sc.delete(e),jc.delete(e),t(e)}}return kc}();return!!n&&(t?Cc.delete(e):Cc.add(e),i?Ac.delete(e):Ac.add(e),n.observe(e),!0)}function Lc(e){kc?.unobserve(e),e.removeAttribute("offscreen")}(0,O.u$)(class extends $c{constructor(e){if(super(e),this._counted=!0,e.type!==O.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(e){return s.s6}update(e,[t]){const i=!1!==t?.counted;var n;return e.element!==this._el?(this._unwatch(),this._el=e.element,this._counted=i,this.isConnected&&Hc(this._el,!0,i)&&(n=this._el,queueMicrotask(()=>qc(n)&&Ec(n,!1)))):i!==this._counted&&(this._counted=i,this.isConnected&&Hc(this._el,!0,i)),s.s6}_unwatch(){this._el&&Lc(this._el)}disconnected(){this._unwatch()}reconnected(){this._el&&Hc(this._el,!0,this._counted)}});const Vc=_o.dt,Oc=Math.ceil(.1/Vc)+1,Pc=e=>Math.round(100*e)/100;function Rc(e,t,i){const n=Uo(e,t,wo),s=i?i.n:Math.min(Math.max(0,Math.floor(e.count)),_o.parents),r=$o(e.sim.seed),a=[];for(let e=0;e<s;e++){const t=Jo(n,r,e);a.push({shape:t.shape,size:Pc(t.size),...void 0!==t.color?{color:t.color}:{}})}const o=e.sim.children,l=nl(o),c=i?i.m:o&&s?Math.min(s*l,_o.elements-s):0,d=$o(ko(e.sim.seed,5));for(let e=0;e<c;e++){const t=Go(d,o.shapes),i=Mo(d,o.size),n=o.colors.length?o.colors[e%o.colors.length]:a[Math.floor(e/Math.max(1,l))%s].color;a.push({shape:t,size:Pc(i),...void 0!==n?{color:n}:{}})}return{parents:s,children:c,looks:a}}const Nc=(e,t)=>e.plans.map(e=>Rc(e.spec,t,e));function Dc(e,t,i){const n=1e-6;return t.ny<0&&t.y>=e.H-i-n?"floor":t.ny>0&&t.y<=i+n?"ceiling":t.nx>0&&t.x<=i+n?"left":t.nx<0&&t.x>=e.W-i-n?"right":"content"}const Tc=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy});class Fc{constructor(e,t,i,n=Rc(e,t)){this.faces=new Set,this.slots=[],this.world=Uo(e,t,i),this.layout=n,this.rng=$o(e.sim.seed),this.crng=$o(ko(e.sim.seed,2));for(let e=0;e<n.parents;e++){const t=this.spawn(e);this.slots.push({next:t,wait:t.birth,fired:!1})}this.kids=new Array(n.children).fill(void 0)}spawn(e){const t=Jo(this.world,this.rng,e);return t.size=this.layout.looks[e].size,t.radius=Yo(t.size),t.persistent&&(t.life=1/0),t}emit(e,t,i){e.fired=!0;const n=this.world.sim.children;if(!n)return;const s=[];for(let e=0;e<this.kids.length&&s.length<nl(n);e++)this.kids[e]||s.push(e);rl(this.world,n,t,i,this.crng,s.length).forEach((e,t)=>{e.size=this.layout.looks[this.layout.parents+s[t]].size,e.radius=Yo(e.size),this.kids[s[t]]=e})}step(){const e=this.world,t=e.sim.children;this.slots.forEach((i,n)=>{if(!i.p){if(i.wait-=Vc,i.wait>1e-9)return;i.p=i.next,i.fired=!1}const s=i.p,r=el(e,s,Vc);r&&(this.faces.add(Dc(e,r,s.radius)),"collision"!==t?.trigger||i.fired||this.emit(i,s,{...r,vx:s.vx,vy:s.vy})),"time"===t?.trigger&&!i.fired&&s.age>=(t.at??0)-1e-9&&this.emit(i,s,Tc(s)),s.age>=s.life-1e-9&&("death"!==t?.trigger||i.fired||this.emit(i,s,Tc(s)),i.p=void 0,i.next=this.spawn(n),i.wait=i.next.birth)}),this.kids.forEach((t,i)=>{if(!t)return;const n=el(e,t,Vc);n&&this.faces.add(Dc(e,n,t.radius)),t.age>=t.life-1e-9&&(this.kids[i]=void 0)})}frame(){const e=this.world,t=t=>{if(!t)return;const i=Qo(e,t);return{x:i.x/e.W*100,y:i.y/e.H*100,rotate:i.rotate,opacity:i.opacity,scale:i.scale}};return[...this.slots.map(e=>t(e.p)),...this.kids.map(t)]}}const Bc=["translate","rotate","scale","opacity","animation"],Ic=(e,t)=>{const i=10**t;return Math.round(e*i)/i||0};function Zc(e,t,i=!1){const n=e.children;for(let e=0;e<n.length;e++){const s=n[e].style;i&&s.setProperty("animation","none");const r=t[e];!r||r.opacity<=0?"0"!==s.getPropertyValue("opacity")&&s.setProperty("opacity","0"):(s.setProperty("translate",`${Ic(r.x,2)}cqw ${Ic(r.y,2)}cqh`),s.setProperty("rotate",`${Ic(r.rotate,1)}deg`),s.setProperty("opacity",String(Ic(r.opacity,3))),1!==r.scale?s.setProperty("scale",String(Ic(r.scale,3))):s.removeProperty("scale"))}}function Wc(e){for(const t of e.children)for(const e of Bc)t.style.removeProperty(e)}const Kc=new Map;let Uc=0,Gc=0,Yc=!1;const Jc=()=>"undefined"==typeof document||"hidden"!==document.visibilityState,Xc=()=>{for(const e of Kc.values())if(e.on)return!0;return!1};function Qc(){Uc&&"function"==typeof cancelAnimationFrame&&cancelAnimationFrame(Uc),Uc=0,Gc=0}function ed(){!Uc&&Jc()&&Xc()&&"function"==typeof requestAnimationFrame&&(Uc=requestAnimationFrame(td))}function td(e){Uc=0;const t=Gc?Math.min(.1,Math.max(0,(e-Gc)/1e3)):Vc;Gc=e;for(const e of[...Kc.values()])if(e.el.isConnected){if(e.on){e.acc+=t;for(let t=0;e.acc>=Vc-1e-9&&t<Oc;t++){for(const t of e.sims)t.step();e.acc-=Vc}Zc(e.el,e.sims.flatMap(e=>e.frame()),!1)}}else sd(e.el);Xc()&&Jc()?Uc=requestAnimationFrame(td):Gc=0}function id(){Jc()?ed():Qc()}function nd(e,t,i,n){const s=dl(e),r=Nc(s,t);return s.plans.flatMap((e,a)=>a>=s.cut==!!n?[new Fc(e.spec,t,i,r[a])]:[])}function sd(e){var t;Kc.delete(e)&&(t=e,Mc.delete(t),Lc(t),Wc(e),Xc()||Qc())}const rd=new Map;function ad(e,t,i,n,s,r){const a=dl(t),o=((e,t)=>Nc(e,t).flatMap(e=>e.looks))(a,i),l=t=>{const i=s?$l(t?n+"o":n,s):`${t?n+"o":n}-g0`,l=((e,t)=>[t.slice(0,pl(e)),t.slice(pl(e))])(a,o)[t],c=r?jl(r,i,e,o,t?r.parts.element:0,t?void 0:r.parts?.element,t?r.parts.slot:0).css:function(e,t,i){return{css:Sl(t,i,e),slots:e.map(kl)}}(l,i,e).css;return{name:i,css:c,slots:l.map(kl)}},c=l(0),d=a.cut<a.plans.length?l(1):void 0,p="front"===t.layer,h=!!s&&!r&&a.plans.some(e=>Math.floor(e.spec.count)>e.n||e.m<e.n*nl(e.spec.sim.children)),u=r?r.stats:{elements:o.length,stops:0,bytes:c.css.length+(d?.css.length??0),capped:h,warn:!1},m=pl(a),g=a.plans.map((e,t)=>({index:e.index,part:t<a.cut?0:1,first:e.at-(t<a.cut?0:m),parents:e.n,children:e.m})).sort((e,t)=>e.index-t.index);return{compiled:{mode:t.sim.mode,...c,front:p,...d?{other:{...d,front:!p}}:{},emitterSlots:g,stats:u},...r?{loop:r}:{},plan:a,still:[]}}function od(e,t,i,n){const s=fl(n),r=wl(e,t,i),a=$l(r,s);let o=rd.get(r);const l=o?.get(a);if(o&&l)return o.delete(a),o.set(a,l),rd.delete(r),rd.set(r,o),l;const c=ad(e,t,i,r,s,"live"===t.sim.mode?void 0:_l({spec:t,period:i,geometry:s}));if(!o)for(o=new Map,rd.set(r,o);rd.size>32;)rd.delete(rd.keys().next().value);for(o.set(a,c);o.size>_o.geometryVariants;)o.delete(o.keys().next().value);return c}const ld=new WeakSet;let cd=!1;var dd;dd=fc,Ge.simValidator=dd;const pd={version:"1.3.0",validateSim:fc,bake:_l,bakedCss:jl,bakedSvg:function(e,t){const i=Number.isFinite(t.width)&&t.width>0?Math.round(t.width):200,n=Number.isFinite(t.height)&&t.height>0?Math.round(t.height):100,s=e.period>0&&Number.isFinite(e.period)?e.period:1,r=`p${fn(JSON.stringify([e.period,e.geometry,e.elements.length,e.stats.bytes]))}`,a=void 0!==t.background?Ll(t.background):void 0,o=new Map,l=`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}" fill="currentColor" color="#03a9f4">`,c=a?`<path d="M0 0H${i}V${n}H0z" fill="${Hl(a)}"/>`:"";let d=l.length+c.length+64;const p=[],h=[],u=[],m=e=>({...e,x:e.x/100*i,y:e.y/100*n}),g=e.elements.map((e,t)=>t);return e.parts&&!e.parts.front&&g.push(...g.splice(0,e.parts.element)),g.forEach(t=>{const i=e.elements[t],n=(e=>{const t=JSON.stringify(e);let i=o.get(t);return i||o.set(t,i=function(e){const t=(e,t,i,n,s)=>({markup:`<g transform="translate(${El(-(t+n/2))} ${El(-(i+s/2))})">${e}</g>`,grid:Math.max(n,s)||24});if("builtin"in e)return t(Al(e.builtin),0,0,24,24);if("svg"in e){const i=We(e.svg);if(!i.error){const e=new Set(i.evenodd?.paths??[]),n=new Set(i.evenodd?.accent??[]),s=[...i.paths.map((t,i)=>`<path d="${Hl(t)}"${e.has(i)?' fill-rule="evenodd"':""}/>`),...i.accentPaths.map((e,t)=>`<path d="${Hl(e)}"${n.has(t)?' fill-rule="evenodd"':""}/>`),...i.strokes.map(e=>`<path d="${Hl(e.d)}" fill="none" stroke="currentColor" stroke-width="${El(e.width)}"${e.cap?` stroke-linecap="${Hl(e.cap)}"`:""}${e.join?` stroke-linejoin="${Hl(e.join)}"`:""}/>`)].join(""),[r,a,o,l]=i.viewBox.split(/[\s,]+/).map(Number);if(s.length<=2048&&[r,a,o,l].every(Number.isFinite)&&o>0&&l>0)return t(s,r,a,o,l)}}return t('<path d="M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"/>',0,0,24,24)}(e)),i})(i.shape),s=Ll(i.color),a=`<g class="${r}e${t}"${s?` color="${Hl(s)}"`:""}>${n.markup}</g>`;if(d+a.length>31744)return;d+=a.length,p.push(a);const l=i.size/n.grid;h.push(`.${r}e${t}{${Vl(m(Ml(i.stops,.5)),l)}}`);const c=i.stops.map(e=>`${El(100*e.t)}%{${Vl(m(e),l)}}`).join("");u.push(`.${r} .${r}e${t}{animation-name:${r}a${t}}@keyframes ${r}a${t}{${c}}`)}),[l,`<style>${[`.${r}>g{transform-box:view-box;transform-origin:0 0}`,...h,`@media (prefers-reduced-motion:no-preference){.${r}>g{animation-duration:${El(s)}s;animation-timing-function:linear;animation-iteration-count:infinite}`,...u,"}"].join("\n")}</style>`,c,`<g class="${r}">`,...p,"</g>","</svg>"].join("\n")},apply:function(e,t){try{const{spec:i,period:n,docId:s}=t;if(!i?.sim)throw new Error("the animation has no particle simulation");t.useCss("mcp-shapes",zl);const r=function(e,t){const i=e.getBoundingClientRect();if(!(i.width>0&&i.height>0))return;const n={aspect:i.width/i.height};if("none"!==t.spec.sim.colliders.content){const e=t.content?.()?.getBoundingClientRect();e&&e.width>0&&e.height>0&&(n.content={x:(e.left-i.left)/i.width*100,y:(e.top-i.top)/i.height*100,w:e.width/i.width*100,h:e.height/i.height*100})}return fl(n)}(e,t),a=r??wo,o=od(s,i,n,a),l=t.part?1:0;t.mirror?e.style.setProperty("scale","-1 1"):e.style.getPropertyValue("scale")&&e.style.removeProperty("scale");const c=l?o.compiled.other:o.compiled;if(e.getAttribute("data-fx")!==c.name&&(t.useCss(c.name,c.css),e.setAttribute("data-fx",c.name)),t.reducedMotion)return sd(e),Zc(e,function(e,t,i,n,s){if(e.still[s])return e.still[s];const r=[],a=e.loop;if(a){const e=a.parts?.element??a.elements.length;a.elements.slice(s?e:0,s?void 0:e).forEach(e=>r[e.slot-(s?a.parts.slot:0)]=Ml(e.stops,.5))}else{const e=nd(t,i,n,s),a=Math.round(Math.min(.5*i,3)/_o.dt);for(const t of e)for(let e=0;e<a;e++)t.step();r.push(...e.flatMap(e=>e.frame()))}return e.still[s]=r}(o,i,n,a,l),!0),void ld.add(e);ld.delete(e)&&Wc(e),"live"===i.sim.mode?function(e,t,i,n,s,r=0){const a=Kc.get(e);if(a?.key===s)return;sd(e),Yc||"undefined"==typeof document||(document.addEventListener("visibilitychange",id),Yc=!0);const o=nd(t,i,n,r),l={el:e,sims:o,key:s,on:!1,acc:0};var c,d;Kc.set(e,l),c=e,d=t=>{Kc.get(e)===l&&(l.on=t,t?ed():Xc()||Qc())},Mc.set(c,d),Hc(c,!0,!0)||(l.on=!0,ed())}(e,i,n,a,c.name,l):sd(e)}catch(e){cd||(cd=!0,console.warn("Magic Card: a particle layer could not be set up; it plays its simple version.",e))}},release:function(e){sd(e),ld.delete(e)&&Wc(e)}},hd=function(e,t,i,n){return n.aspect>0?od(e,t,i,n).compiled:ad(e,t,i,wl(e,t,i)).compiled},ud=new WeakMap;function md(e){const t="particles"===e.kind?e.particles:void 0;if(!t?.sim)return;if(ud.has(t))return ud.get(t);let i;try{const n=fc(t.sim,"lenient").sim;if(n){const s={...t,sim:n},r=hd(e.id,s,e.duration/t.speed,{aspect:0}),a=eo({...e,particles:{...t,sim:n}});r.emitterSlots&&(i={base:r.name.replace(/-g\w+$/,""),emitterSlots:r.emitterSlots,ids:a})}}catch{i=void 0}return ud.set(t,i),i}function gd(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e&&e!==document.body?e:null}function fd(e,t,i){const n="alert"===e.variant;return s.qy`<mc-ui-window
    variant=${e.variant??"sheet"}
    size=${e.size??s.s6}
    heading=${e.heading}
    closeLabel=${Gn(158)}
    ?movable=${!n}
    ?resizable=${!n}
    ?maximizable=${!n}
    moveLabel=${Gn(482)}
    resizeLabel=${Gn(738)}
    maximizeLabel=${Gn(440)}
    restoreLabel=${Gn(739)}
    initialFocus=${e.initialFocus??s.s6}
    .dismissible=${e.dismissible??!n}
    @mc-window-close=${t=>{t.stopPropagation(),e.onClose()}}
  >
    ${t}${i?s.qy`<div slot="footer" class="foot">${i}</div>`:s.s6}
  </mc-ui-window>`}const vd=new WeakMap;function bd(e,t=18){return e.glyph&&v(e.glyph)?f(e.glyph,t):e.icon?s.qy`<ha-icon icon=${e.icon}></ha-icon>`:s.s6}(0,O.u$)(class extends $c{render(e){return V.s6}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),V.s6}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=vd.get(t);void 0===i&&(i=new WeakMap,vd.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?vd.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});const yd=s.AH`.lip{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;display:grid;place-items:center;width:28px;height:72px;margin:0;padding:0;border:1px solid var(--mc-text-2);background:var(--mc-surface);color:var(--mc-text-2);font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip svg{width:18px;height:18px;pointer-events:none}.lip[aria-expanded='false']{border-color:var(--mc-text-2);background:var(--mc-accent-fill);color:var(--mc-on-accent)} .lip[data-side='start']{left:var(--mc-lip-at-start,0);right:auto;inset-inline:var(--mc-lip-at-start,0) auto;border-left-width:0;border-inline-width:0 1px;border-radius:0 8px 8px 0}.lip[data-side='start'][data-dir='rtl']{border-radius:8px 0 0 8px}.lip[data-side='end']{right:var(--mc-lip-at-end,0);left:auto;inset-inline:auto var(--mc-lip-at-end,0);border-right-width:0;border-inline-width:1px 0;border-radius:8px 0 0 8px}.lip[data-side='end'][data-dir='rtl']{border-radius:0 8px 8px 0} .lip[data-side='start'][aria-expanded='true'] svg,.lip[data-side='end'][aria-expanded='false'] svg{transform:scaleX(-1)}.lip[data-side='start'][aria-expanded='true'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='false'][data-dir='rtl'] svg{transform:none}.lip[data-side='start'][aria-expanded='false'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='true'][data-dir='rtl'] svg{transform:scaleX(-1)} .lip:focus{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip:focus:not(:focus-visible){outline:none}.lip:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip[aria-expanded='false']:focus{outline:2px solid var(--mc-on-accent);outline-offset:-4px}.lip[aria-expanded='false']:focus:not(:focus-visible){outline:none}.lip[aria-expanded='false']:focus-visible{outline:2px solid var(--mc-on-accent);outline-offset:-4px}@media (hover:hover){.lip:hover{background:var(--mc-surface-2);border-color:var(--mc-text);color:var(--mc-text)}.lip[aria-expanded='false']:hover{background:var(--mc-accent-fill);border-color:var(--mc-text-2);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)}}.lip:active{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.lip[aria-expanded='false']:active{background:var(--mc-accent-fill);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)} @media (pointer:coarse){.lip::after{content:'';position:absolute;top:50%;height:72px;transform:translateY(-50%)}.lip[data-side='start']::after{left:100%;right:auto;inset-inline:100% auto;width:17px}.lip[data-side='end']::after{right:100%;left:auto;inset-inline:auto 100%;width:17px}.lip[aria-expanded='false']::after{width:calc(17px + var(--mc-lip-pull,0px))} .lip[aria-expanded='false'][data-side='start']{left:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px));right:auto;inset-inline:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px)) auto}.lip[aria-expanded='false'][data-side='end']{right:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px));left:auto;inset-inline:auto calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}} [data-lip]{transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear 0s}[data-lip='hidden']{visibility:hidden;pointer-events:none;transform:translateX(var(--mc-lip-off,0px));transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear var(--mc-lip-ms,200ms)}[data-lip='hidden'][data-dir='rtl']{transform:translateX(calc(-1 * var(--mc-lip-off,0px)))}@media (prefers-reduced-motion:reduce){[data-lip],[data-lip='hidden'],.lip{transition:none}} .lip-hint{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,var(--mc-lip-hint-max,260px));padding:12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;animation:lip-hint-in 160ms ease-out;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip-hint p{margin:0 0 8px}.lip-hint .lip-hint-keys{color:var(--mc-text-2)}@media (hover:none){.lip-hint .lip-hint-keys{display:none}}.lip-hint button{min-height:var(--mc-hit,40px);padding:0 12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);font:inherit;cursor:pointer}.lip-hint button:focus{outline:2px solid var(--mc-focus);outline-offset:2px}.lip-hint button:focus:not(:focus-visible){outline:none}.lip-hint button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}@media (pointer:coarse){.lip-hint button{min-height:44px}} .lip-hint::before{content:'';position:absolute;top:50%;width:10px;height:10px;margin-top:-5px;border:1px solid var(--mc-text-2);background:var(--mc-surface)}.lip-hint[data-side='start']{left:calc(var(--mc-lip-at-start,0px) + 36px);right:auto;inset-inline:calc(var(--mc-lip-at-start,0px) + 36px) auto}.lip-hint[data-side='start']::before{left:-6px;right:auto;inset-inline:-6px auto;border-width:0 0 1px 1px;transform:rotate(45deg)}.lip-hint[data-side='end']{right:calc(var(--mc-lip-at-end,0px) + 36px);left:auto;inset-inline:auto calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end']::before{right:-6px;left:auto;inset-inline:auto -6px;border-width:1px 1px 0 0;transform:rotate(45deg)}.lip-hint[data-side='start'][data-dir='rtl']::before{border-width:1px 1px 0 0}.lip-hint[data-side='end'][data-dir='rtl']::before{border-width:0 0 1px 1px}@keyframes lip-hint-in{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.lip-hint{animation:none;transition:none}} .lip-status{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap}`,xd="mc-panels:",_d="mc-panels-hint:",wd="data-mc-lips",$d={"card-studio":["layers","inspector"],"anim-studio":["layers","inspector"],"svg-editor":["side","inspector"],"shape-studio":["side","inspector"],"theme-editor":["variables"]},kd=s.JW`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;function Md(){try{return window.localStorage??null}catch{return null}}class Sd{constructor(e,t){this.host=e,this.restoredFrom="none",this.hidden=new Set,this.cols={},this._suspended=!1,this.remembered=null,this.hintDone=!1,this.statusText="",this.frame=0,this.onKeydown=e=>{this.handleKey(e)},this.editor=t.editor,this.panels=t.panels,this.strings=t.strings,this.keys=t.keys??"host",this.fallback=t.fallback,this.direction=new y(e),e.addController(this)}get dir(){return this.direction.direction}hostConnected(){this.host.setAttribute(wd,""),"host"===this.keys&&this.host.addEventListener("keydown",this.onKeydown,{capture:!0}),this.restore()}hostDisconnected(){this.host.removeAttribute(wd),this.host.removeEventListener("keydown",this.onKeydown,{capture:!0}),this.frame&&cancelAnimationFrame(this.frame),this.frame=0}restore(){this.remembered=null,this.direction.sync(),this.readMemory(),this.hintDone=this.readFlag(),this.host.requestUpdate()}setPanels(e,t){this.panels=e,this.strings=t,this.direction.sync(),this.host.requestUpdate()}columns(e){const t=new Set([...Object.keys(this.cols),...Object.keys(e)]);let i=!0;for(const n of t)Boolean(this.cols[n])!==Boolean(e[n])&&(i=!1);i||(this.cols={...e},this.host.requestUpdate())}get suspended(){return this._suspended}set suspended(e){e!==this._suspended&&(this._suspended=e,this.host.requestUpdate())}state(e){return!this._suspended&&this.cols[e]&&this.panels.some(t=>t.id===e)?this.hidden.has(e)?"hidden":"shown":"off"}isHidden(e){return"hidden"===this.state(e)}get active(){return!this._suspended&&this.panels.some(e=>this.cols[e.id])}toggle(e){this.remembered=null,this.apply([e],"shown"===this.state(e),"api")}show(e){this.remembered=null,this.apply([e],!1,"api")}hide(e){this.remembered=null,this.apply([e],!0,"api")}toggleAll(){const e=this.panels.map(e=>e.id).filter(e=>"off"!==this.state(e));if(!e.length)return!1;const t=e.filter(e=>!this.hidden.has(e));let i,n;if(t.length)this.remembered=t,i=t,n=!0;else{const t=(this.remembered??[]).filter(t=>e.includes(t));i=t.length?t:e,n=!1,this.remembered=null}return!!this.apply(i,n,"key")&&(this.announce(i,n),!0)}async reveal(e){"hidden"===this.state(e)&&(this.remembered=null,this.apply([e],!1,"reveal"),await this.host.updateComplete)}handleKey(e){if(e.defaultPrevented||!function(e){return(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&!e.getModifierState?.("AltGraph")&&("\\"===e.key||"Backslash"===e.code)&&!e.repeat&&!e.isComposing}(e))return!1;const t=e.composedPath(),i=t.indexOf(this.host);for(let e=0;e<(i<0?t.length:i);e++){const i=t[e];if(i instanceof Element&&i.hasAttribute(wd))return!1}return e.preventDefault(),this.toggleAll(),!0}apply(e,t,i){const n=this.panels.map(e=>e.id).filter(i=>e.includes(i)&&"off"!==this.state(i)&&this.hidden.has(i)!==t);if(!n.length)return!1;const s=this.root()?.activeElement,r=t?n.filter(e=>{const t=this.panelEl(e);return!!t&&!!s&&t.contains(s)}):[];for(const e of n)t?this.hidden.add(e):this.hidden.delete(e);return t||this.dismissHint(),this.writeMemory(),this.host.requestUpdate(),r.length&&this.host.updateComplete.then(()=>this.lipEl(r[0])?.focus()),this.host.dispatchEvent(new CustomEvent("mc-panels-change",{detail:{editor:this.editor,hidden:this.panels.map(e=>e.id).filter(e=>this.hidden.has(e)),cause:i}})),!0}announce(e,t){const i=this.panels.filter(t=>e.includes(t.id)).map(e=>e.noun),n=t?this.strings.hidden:this.strings.shown,s=this.strings.locale;let r;try{const e=new Intl.ListFormat(s,{type:"conjunction"}).format(i),t=n.replace("{panels}",()=>e);r=t.charAt(0).toLocaleUpperCase(s)+t.slice(1)}catch{const e=n.replace("{panels}",()=>i.join(", "));r=e.charAt(0).toUpperCase()+e.slice(1)}this.statusText="",this.host.requestUpdate(),this.frame&&cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>{this.frame=0,this.statusText=r,this.host.requestUpdate()})}allowed(e){const t=new Set($d[this.editor]),i=new Set;for(const n of e)"string"==typeof n&&t.has(n)&&i.add(n);return i}readMemory(){let e;this.hidden=new Set,this.restoredFrom="none";try{const t=Md();if(!t)return;e=t.getItem(xd+this.editor)}catch{return}if(null===e){let e;try{e=this.fallback?.()??null}catch{e=null}const t=this.allowed(e??[]);return void(t.size&&(this.hidden=t,this.restoredFrom="fallback",this.writeMemory()))}if("string"!=typeof e||e.length>64)return;const t=this.allowed(e.split(","));t.size&&(this.hidden=t,this.restoredFrom="stored")}writeMemory(){try{const e=Md();if(!e)return;const t=xd+this.editor,i=$d[this.editor].filter(e=>this.hidden.has(e));i.length?e.setItem(t,i.join(",")):e.removeItem(t)}catch{}}readFlag(){try{return"1"===Md()?.getItem(_d+this.editor)}catch{return!1}}hintPanel(){if(!this.hintDone&&"none"!==this.restoredFrom)return this.panels.find(e=>"hidden"===this.state(e.id))}dismissHint(){if(!this.hintDone){this.hintDone=!0;try{Md()?.setItem(_d+this.editor,"1")}catch{}}}closeHint(e){const t=this.root(),i=t?.getElementById(`${e.controls}-hint`),n=!!i&&!!t?.activeElement&&i.contains(t.activeElement);this.dismissHint(),this.host.requestUpdate(),n&&this.lipEl(e.id)?.focus()}onLipKey(e,t){"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.closeHint(t))}hintTemplate(e){const t=this.panels.filter(e=>"hidden"===this.state(e.id)),i=this.strings,n="fallback"===this.restoredFrom?i.hintMigrated:1===t.length?i.hintOne.replace("{noun}",()=>t[0].noun):i.hintMany;return s.qy`<div class="lip-hint" id="${e.controls}-hint" data-side=${e.side} data-dir=${this.dir} @keydown=${t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this.closeHint(e))}}> <p>${n}</p><p class="lip-hint-keys">${i.hintShortcut}</p><button type="button" @click=${()=>this.closeHint(e)}>${i.gotIt}</button></div>`}lip(e){const t=this.panels.find(t=>t.id===e);if(!t)return s.s6;const i=this.state(e);if("off"===i)return s.s6;const n="hidden"===i,r=this.hintPanel()?.id===e;return s.qy`<button type="button" class="lip" data-side=${t.side} data-dir=${this.dir} aria-expanded=${n?"false":"true"} aria-controls=${t.controls} aria-label=${t.name} title=${n?t.showLabel:t.hideLabel} aria-describedby=${(e=>e??V.s6)(r?`${t.controls}-hint`:void 0)} @click=${t=>{t.currentTarget?.focus(),this.remembered=null,this.apply([e],"shown"===this.state(e),"lip")}} @keydown=${r?e=>this.onLipKey(e,t):s.s6} >${kd}</button>${r?this.hintTemplate(t):s.s6}`}status(){return s.qy`<div class="lip-status" role="status" aria-live="polite" aria-atomic="true">${this.statusText}</div>`}root(){return this.host.renderRoot??this.host.shadowRoot}panelEl(e){const t=this.panels.find(t=>t.id===e);return t?this.root()?.getElementById(t.controls)??null:null}lipEl(e){const t=this.panels.find(t=>t.id===e);if(!t)return null;for(const e of Array.from(this.root()?.querySelectorAll(".lip")??[]))if(e.getAttribute("aria-controls")===t.controls)return e;return null}}class jd{constructor(e,t){this.host=e,this.onChange=t,this.width=0,this.watched=[],e.addController(this)}hostDisconnected(){this.observer?.disconnect(),this.observer=void 0,this.watched=[]}watch(e,...t){const i=[e,...t].filter(e=>!!e);if((i.length!==this.watched.length||i.some((e,t)=>e!==this.watched[t]))&&(this.observer?.disconnect(),this.watched=i,"undefined"!=typeof ResizeObserver)){this.observer=new ResizeObserver(()=>this.measure(e));for(const e of i)this.observer.observe(e)}this.measure(e)}measure(e){const t=e?function(e){let t;try{const i=getComputedStyle(e);t=(parseFloat(i.borderLeftWidth)||0)+(parseFloat(i.borderRightWidth)||0)}catch{t=0}return Math.max(0,Math.round(e.offsetWidth-e.clientWidth-t))}(e):0;t!==this.width&&(this.width=t,this.onChange?.(t),this.host.requestUpdate())}}const Cd={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};class Ad{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),n=i.indexOf(e.composedPath().find(e=>i.includes(e))),s=function(e,t,i,n="horizontal",s=!0,r=!1){if(!Cd[n].includes(e)||!i.length)return-1;const a=i.length,o=e=>e>=0&&e<a&&!i[e].disabled,l=(e,t)=>{for(let i=1;i<=a;i++){let n=e+t*i;if(s)n=(n+2*a)%a;else if(n<0||n>=a)return e;if(o(n))return n}return e};if("Home"===e)return o(0)?0:l(0,1);if("End"===e)return o(a-1)?a-1:l(a-1,-1);const c="ArrowUp"===e||e===(r?"ArrowRight":"ArrowLeft");return l(t<0?c?0:-1:t,c?-1:1)}(e.key,n,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap,"rtl"===b(t));s<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,s),this.opts.onMove?.(i[s],s))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}function zd(e){const t="tablist"===e.role,i=new Ad({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return s.qy`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const n=i.value===e.value,r=!!i.disabledReason;return s.qy`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(n):s.s6} aria-checked=${t?s.s6:String(n)} aria-disabled=${r?"true":s.s6} tabindex=${n?"0":"-1"} @click=${()=>{r||e.onChange(i.value)}} >${bd(i)}${i.label}</button>`})}</div>`}const qd="{opacity:0!important}",Ed=e=>`"${e.replace(/[\\"]/g,"\\$&").replace(/\n/g,"\\a ")}"`,Hd=e=>`.mc-module-wrapper[data-mc-run] [data-mc-part=${Ed(e)}]:not(.mc-module-wrapper[data-mc-run] .mc-module-wrapper [data-mc-part])`,Ld="data-mc-stage-hide";class Vd{constructor(){this._css={icon:"",card:""},this._sheets={},this._text=new WeakMap}set(e,t){this._css=t,this.attach(e)}attach(e){if(e){this._into(e,"card");for(const t of e.querySelectorAll(".mc-anim-icon"))t.shadowRoot&&this._into(t.shadowRoot,"icon")}}_into(e,t){const i=this._css[t];if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype){let n=this._sheets[t];return n||(n=new CSSStyleSheet,this._sheets[t]=n,n.replaceSync(i)),this._text.get(n)!==i&&(n.replaceSync(i),this._text.set(n,i)),void(e.adoptedStyleSheets.includes(n)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]))}let n=[...e.children].find(e=>"STYLE"===e.tagName&&e.hasAttribute(Ld));n||(n=document.createElement("style"),n.setAttribute(Ld,""),e.appendChild(n)),n.textContent!==i&&(n.textContent=i)}}const Od="light.mc_studio_preview",Pd=e=>(e?.clips?.length??0)>0||(e?.bindings?.length??0)>0,Rd={state:"on",value:.6,attributes:{}},Nd=e=>Math.round(1e3*e)/1e3,Dd=(e,t)=>Nd(e.input.min+(e.input.max-e.input.min)*Math.min(1,Math.max(0,t)));function Td(e){const t=e?.bindings??[],i=t.find(e=>!e.input.attribute),n=(e?.clips??[]).some(e=>"above"in e.when||"below"in e.when);return{value:t.length>0||n,numericState:!!i||n,...i?{stateRange:[i.input.min,i.input.max]}:{}}}function Fd(e,t){const i={};for(const n of e?.bindings??[])n.input.attribute&&!(n.input.attribute in i)&&(i[n.input.attribute]=Dd(n,t));return i}function Bd(e){const t=new Date(0).toISOString();return{entity_id:Od,state:e.state??Rd.state,attributes:{friendly_name:Gn(688),...e.attributes??{}},last_changed:t,last_updated:t,context:{id:"mc-studio-preview",parent_id:null,user_id:null}}}function Id(e){return"state"in e?Gn(884,{state:e.state}):"state_not"in e?Gn(883,{state_not:e.state_not}):"entity_on"in e?e.entity_on?Gn(305):Gn(304):"above"in e?Gn(1064,{above:e.above}):Gn(1066,{below:e.below})}var Zd=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Wd=[{id:"light",label:418,icon:"mdi:white-balance-sunny"},{id:"dark",label:213,icon:"mdi:weather-night"}],Kd=[.25,.5,1,1.5,2],Ud=Od,Gd=(e,t)=>!!t||Pd(e);function Yd(e,t,i,n,s=1){return i>0&&n>0&&e>0&&t>0?Math.max(.2,Math.min(s,e/i,t/n)):1}const Jd={light:"--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#f2f3f5;--primary-text-color:#212121;--secondary-text-color:#5f6368;--divider-color:rgba(0,0,0,.12);--state-icon-color:#44739e;color-scheme:light",dark:"--card-background-color:#1c1c1c;--primary-background-color:#111111;--secondary-background-color:#282a2d;--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--divider-color:rgba(225,225,225,.12);--state-icon-color:#9fbcd9;color-scheme:dark"};function Xd(e){return{states:{},entities:{},language:"en",locale:{language:"en",number_format:"language",time_format:"language"},themes:{themes:{},darkMode:e},callWS:async()=>({}),callService:async()=>{}}}const Qd="mc-i18n-wrap";class ep extends s.WF{constructor(){super(...arguments),this.lookup=()=>{},this.tile="icon",this.zoomIcon=!1,this.layerView=Xa,this.hiddenLayers=0,this.theme="light",this.reduced=!1,this.speed=1,this.playing=!0,this._t=0,this._k=1,this._fh=0,this._wraps=0,this._raf=0,this._last=0,this._lastTimeEvent=0,this._sentTime=-1,this._themeSet=!1,this._sheets=new Vd,this._attachQueued=!1,this._rates=new WeakMap,this._drives=!1,this._onWrap=()=>{this._wraps++},this._canvasOn=!1,this._onCanvasSlot=e=>{this._canvasOn=e.target.assignedElements().length>0},this._loop=()=>{if(!this.isConnected)return;const e=performance.now();if(this.playing&&this._last){const t=this.cycle;this._t=(this._t+(e-this._last)/1e3*this.speed)%t,this._emitTime()}this._last=e,this._raf=requestAnimationFrame(this._loop)}}connectedCallback(){if(super.connectedCallback(),window.addEventListener(Qd,this._onWrap),!this._themeSet){this._themeSet=!0;const e=this.hass?.themes?.darkMode;this.theme=e??function(e){const t=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(e).color||"");if(!t)return!1;const[i,n,s]=t.slice(1).map(Number);return.2126*i+.7152*n+.0722*s>140}(this)?"dark":"light"}customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate()),this._poll=setInterval(()=>this._sync(),250),this._loop(),this.hasUpdated&&this._observeFrame()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(Qd,this._onWrap),this._ro?.disconnect(),this._ro=void 0,this._mo?.disconnect(),this._mo=this._moRoot=void 0,cancelAnimationFrame(this._raf),this._raf=0,this._poll&&clearInterval(this._poll),this._poll=void 0}get card(){return this._card}get cycle(){return this.doc?function(e,t){if("sequence"===e.kind){const i=Fn(e,{lookup:t}).schedule?.total??0;return i>0?i:1}const i="particles"!==e.kind||e.particles?.preset?1:e.particles?.speed||1;return Math.max(.05,e.duration/i)}(this.doc,this.lookup):1}get scale(){return this._k}togglePlay(){this.playing?this.pause():this.play()}play(){this.playing=!0;for(const e of this._anims())this._rate(e),e.play()}pause(){this.playing=!1;for(const e of this._anims())e.pause()}seek(e){this.playing=!1,this._t=Math.min(this.cycle,Math.max(0,e));for(const e of this._anims())e.pause(),e.currentTime=1e3*this._t;this._emitTime(!0)}_emitTime(e=!1){const t=performance.now(),i=Math.min(1,Math.max(0,this._t/this.cycle));!e&&(t-this._lastTimeEvent<33||i===this._sentTime)||(this._lastTimeEvent=t,this._sentTime=i,this.dispatchEvent(new CustomEvent("stage-time",{detail:{time:i}})))}_observeFrame(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");e&&t&&!this._ro&&"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this._fit()),this._ro.observe(e),this._ro.observe(t))}_fit(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");if(!e||!t)return;const i=e.offsetHeight,n=this.zoomIcon?this._iconBox(e):void 0;let s,r;if(n&&t.clientWidth>0&&t.clientHeight>0){const e=function(e,t,i){const n=Math.round(1e3*Yd(e-32,t-32,i.width+40,i.height+40,4))/1e3;return{k:n,x:Math.round(e/2-(i.x+i.width/2)*n),y:Math.round(t/2-(i.y+i.height/2)*n)}}(t.clientWidth,t.clientHeight,n);s=e.k,r={x:e.x,y:e.y}}else s=Math.round(1e3*Yd(t.clientWidth-32,t.clientHeight-32,e.offsetWidth,i,1))/1e3;s!==this._k&&(this._k=s),i!==this._fh&&(this._fh=i),r?.x===this._off?.x&&r?.y===this._off?.y||(this._off=r),this.isUpdatePending?this.updateComplete.then(()=>this._emitRect()):this._emitRect()}_emitRect(){const e=this.shadowRoot?.querySelector(".frame");e&&this.dispatchEvent(new CustomEvent("stage-rect",{detail:this._rectDetail(e)}))}_rectDetail(e){const t=this._subjectRect(e),i=this._screenRect(e),n=this._iconViewBox();return{width:e.offsetWidth,height:e.offsetHeight,scale:this._k,...t?{subject:t}:{},...n?{viewBox:n}:{},...i?{screen:i}:{}}}_screenRect(e){const t=this.shadowRoot?.querySelector(".area");if(!t)return;const i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),s=e=>Math.round(100*e)/100;return{left:s(n.left-i.left),top:s(n.top-i.top),width:s(n.width),height:s(n.height)}}_iconViewBox(){const e=this._card?.shadowRoot?.querySelector(".mc-anim-icon"),t="MC-SVG-ICON"===e?.tagName?e.shadowRoot?.querySelector("svg")?.getAttribute("viewBox"):null,i=t?.trim().split(/[\s,]+/).map(Number);return i&&4===i.length&&i.every(Number.isFinite)?i:void 0}_subjectRect(e){const t=this._card?.shadowRoot;if(!t||!this.doc)return;const i=this.subjectTarget,n="name"===i||"state"===i||"background"===i?t.querySelector(`[data-mc-part="${i}"]`):null,s=i?"icon"===i||/^(part|group|shape):/.test(i):"path"===this.doc.kind?"icon"===this.doc.path?.subject:"icon"===this.doc.target,r=n??(s?t.querySelector(".mc-anim-icon"):null)??t.querySelector(".mc-module-wrapper");return this._boxOf(r,e)}_iconBox(e){return this._boxOf(this._card?.shadowRoot?.querySelector(".mc-anim-icon")??null,e)}_boxOf(e,t){const i=e?.offsetParent;if(!e||!i||!e.offsetWidth)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),r=this._k||1;return{x:Math.round((s.left-n.left)/r+i.clientLeft+e.offsetLeft),y:Math.round((s.top-n.top)/r+i.clientTop+e.offsetTop),width:e.offsetWidth,height:e.offsetHeight}}setSpeed(e){this.speed=e;for(const e of this._anims())this._rate(e)}_rate(e){const t=this._rates.get(e),i=t&&e.playbackRate===t.set?t.base:e.playbackRate,n=i*this.speed;e.playbackRate!==n&&(e.playbackRate=n),this._rates.set(e,{base:i,set:e.playbackRate})}_anims(){return function(e){const t=new Set,i=e=>{for(const i of e.getAnimations?.()??[])t.add(i);for(const t of e.querySelectorAll("*"))t.shadowRoot&&i(t.shadowRoot)};return e&&i(e),[...t]}(this._card?.shadowRoot)}_sync(){for(const e of this._anims())this._rate(e),this.playing||"running"!==e.playState||(e.pause(),e.currentTime=1e3*this._t)}_previewHass(){const e=this.hass,t=this._hassFor,i=Gd(this.doc,this.preview)?(n=this.preview)?function(e,t){return{state:t.state??e.state,value:t.value??e.value,attributes:t.attributes??e.attributes}}(Rd,n):Rd:void 0;var n;if(t&&t.src===e&&t.theme===this.theme&&t.tile===this.tile&&JSON.stringify(t.sim)===JSON.stringify(i))return t.value;const s="dark"===this.theme,r=e?{...e,themes:{...e.themes??{},darkMode:s}}:Xd(s),a=ss(this.tile,r),o=i?function(e,t){const i=e.states??{};return{...e,states:{...i,[Od]:Bd(t)}}}(a,i):a;return this._hassFor={src:e,theme:this.theme,tile:this.tile,sim:i,value:o},o}willUpdate(e){if(!customElements.get("magic-card")||!this.doc)return;this._card||(this._card=document.createElement("magic-card"));const t=Gd(this.doc,this.preview),i=t!==this._drives;if(this._drives=t,e.has("doc")||e.has("tile")||e.has("reduced")||e.has("lookup")||e.has("_wraps")||i||!this._card.shadowRoot)try{this._card.setConfig(gs(this.doc,this.lookup,{tile:this.tile,still:this.reduced,...t?{entity:Ud}:{}}))}catch(e){console.warn("Magic Card studio: preview failed",e)}if(e.has("hass")||e.has("theme")||e.has("preview")||e.has("tile")||e.has("doc")||!this._card.hass){const e=this._previewHass();e!==this._card.hass&&(this._card.hass=e)}}firstUpdated(){this._observeFrame()}_applyHide(){const e=this._card?.shadowRoot;e&&this.doc&&(this._sheets.set(e,((e,t,i)=>{const n=[],s=[],r=ao(e,t);for(const t of r){const r=t.indexOf(":"),a=t.slice(0,r),o=t.slice(r+1);"part"===a?n.push(`[data-p=${Ed(o)}]${qd}`):"group"===a?n.push(`[data-g=${Ed(o)}]${qd}`):"shape"===a?n.push(`[data-s=${Ed(o)}]${qd}`):"emitter"!==a||i||e.particles?.sim?"target"===a&&("background"===o?s.push(".mc-module-wrapper{background:none!important}",`[data-mc-gen-bg]${qd}`):"element"!==o&&s.push(`${Hd(o)}${qd}`)):s.push(`.mc-anim-fx${qd}`)}return i&&s.push(...function(e,t){const i=[];return t.ids.forEach((n,s)=>{const r=t.emitterSlots.find(e=>e.index===s);if(!r)return;const a=`.mc-anim-fx[data-fx^=${Ed(`${t.base}${r.part?"o":""}-g`)}]>i`,o=(e,t)=>{t>=e&&i.push(`${a}:nth-child(n+${e}):nth-child(-n+${t})${qd}`)};e.has(`emitter:${n}`)?o(r.first+1,r.first+r.parents+r.children):(e.has(`${ro}${n}`)&&o(r.first+1,r.first+r.parents),e.has(`children:${n}`)&&o(r.first+r.parents+1,r.first+r.parents+r.children))}),i}(r,i)),{icon:n.join("\n"),card:s.join("\n")}})(this.doc,this.layerView,this.stageParticles)),this._moRoot!==e&&(this._mo?.disconnect(),this._moRoot=e,this._mo=new MutationObserver(()=>{this._attachQueued||(this._attachQueued=!0,queueMicrotask(()=>{this._attachQueued=!1,this._sheets.attach(this._card?.shadowRoot)}))}),this._mo.observe(e,{childList:!0,subtree:!0})))}_showAll(){const e={...this.layerView,hidden:[],solo:[]};this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:e,announce:this.layerView.locked.length?Gn(47):Gn(46)},bubbles:!0,composed:!0}))}updated(e){(e.has("doc")||e.has("layerView")||e.has("stageParticles")||e.has("tile")||e.has("reduced")||!this._moRoot)&&(this._applyHide(),this._card?.updateComplete?.then(()=>this._applyHide())),e.has("subjectTarget")&&requestAnimationFrame(()=>this._emitRect()),e.has("zoomIcon")&&requestAnimationFrame(()=>this._fit()),(e.has("doc")||e.has("tile")||e.has("reduced")||e.has("preview"))&&this._card?.updateComplete?.then(()=>{this._sync(),requestAnimationFrame(()=>this._fit())})}_pickTile(e){e!==this.tile&&(this.tile=e,this.dispatchEvent(new CustomEvent("stage-tile",{detail:{tile:e},bubbles:!0,composed:!0})))}_seg(e,t,i,n,r){return s.qy`<div class="seg ${r}" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.id===i),r={ArrowRight:(s+1)%t.length,ArrowLeft:(s-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];if(void 0===r)return;e.preventDefault(),n(t[r].id);const a=e.currentTarget;this.updateComplete.then(()=>a.querySelector('[aria-checked="true"]')?.focus())}}>
      ${t.map(e=>{const t=e.id===i;return s.qy`<button
          type="button"
          role="radio"
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          title=${Gn(e.label)}
          @click=${()=>n(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon><span class="lbl">${Gn(e.label)}</span>
        </button>`})}
    </div>`}_missing(){return s.qy`<div class="missing" role="status">
      <ha-icon icon="mdi:card-off-outline"></ha-icon>
      <strong>${Gn(438)}</strong>
      <p>${Gn(973)}</p>
    </div>`}render(){const e=this.cycle,t=Math.min(this._t,e),i=!!customElements.get("magic-card"),n=this._k,r=this._off,a=r?"":`width: ${Math.round(360*n)}px; height: ${this._fh?`${Math.round(this._fh*n)}px`:"auto"}`,o=r?`translate(${r.x}px, ${r.y}px) `:"";return s.qy`
      <div class="canvas">
        <div class="dock dock-top">
          ${this.hiddenLayers>0||this.layerView.solo.length>0?s.qy`<div class="hide-chip" role="group" aria-label=${Gn(409)}>
                <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                <span>${this.hiddenLayers>0?Gn(690,{count:this.hiddenLayers}):Gn(844)}</span>
                <button type="button" class="show-all" aria-label=${Gn(820)} @click=${()=>this._showAll()}>${Gn(819)}</button>
              </div>`:s.s6}
          <slot name="top"></slot>
        </div>
        <div class="area ${this._canvasOn?"canvas-on":""}">
        <div class="fit ${r?"zoomed":""}" style=${a}>
          <div class="frame" style="${Jd[this.theme]};width:${360}px;transform:${o}scale(${n})" data-theme=${this.theme}>
            ${i&&this._card?this._card:this._missing()}
            <div class="overlay"><slot name="overlay"></slot></div>
          </div>
        </div>
        <div class="canvas-layer"><slot name="canvas" @slotchange=${this._onCanvasSlot}></slot></div>
        ${this.reduced&&i?s.qy`<p class="note">${Gn(1079)}</p>`:s.s6}
        ${r?s.qy`<span class="zoom-tag" title=${Gn(1088)}>${Gn(379,{percent:Math.round(100*n)})}</span>`:Math.abs(n-1)>.005?s.qy`<span class="zoom-tag" title=${Gn(972)}>${Math.round(100*n)}%</span>`:s.s6}
        </div>
        <div class="dock dock-bottom"><slot name="bottom"></slot></div>
      </div>
      <div class="transport">
        <button
          type="button"
          class="icon-btn sm play"
          aria-label=${this.playing?Gn(647):Gn(664)}
          title=${this.playing?Gn(647):Gn(664)}
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
          aria-label=${Gn(684)}
          aria-valuetext=${Gn(1239,{now:t.toFixed(2),total:e.toFixed(2)})}
          .value=${String(t)}
          ?disabled=${this.reduced||!i}
          @input=${e=>this.seek(Number(e.target.value))}
        />
        <span class="time mono" aria-hidden="true">${t.toFixed(2)} / ${e.toFixed(2)} s</span>
        <label class="speed">
          <span class="sr-only">${Gn(851)}</span>
          <div class="select">
            <select class="input" aria-label=${Gn(851)} @change=${e=>this.setSpeed(Number(e.target.value))}>
              ${Kd.map(e=>s.qy`<option value=${e} ?selected=${e===this.speed}>${e}×</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </label>
        <span class="view">
          ${this._seg(Gn(692),ts,this.tile,e=>this._pickTile(e),"tiles")}
          ${this._seg(Gn(124),Wd,this.theme,e=>this.theme=e,"themes")}
          <button
            type="button"
            class="toggle reduced"
            aria-pressed=${this.reduced?"true":"false"}
            aria-label=${Gn(704)}
            title=${Gn(694)}
            @click=${()=>this.reduced=!this.reduced}
          >
            <ha-icon icon="mdi:motion-pause-outline"></ha-icon>
          </button>
        </span>
      </div>
    `}}ep.styles=[vs,bs,s.AH`
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
        margin-inline: auto 0;
        padding-left: 8px;
        padding-inline: 8px 0;
        border-left: 1px solid var(--mc-divider);
        border-inline-width: 1px 0;
        border-inline-style: solid;
        border-inline-color: var(--mc-divider);
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
        padding: ${(0,s.iz)(16)}px;
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
        left: 0; /* physical */
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
        left: 50%; /* physical */
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
        inset-inline: auto 8px;
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
        text-align: end;
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
    `],Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"doc",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"lookup",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"hass",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"tile",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"preview",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"subjectTarget",void 0),Zd([(0,r.MZ)({type:Boolean})],ep.prototype,"zoomIcon",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"layerView",void 0),Zd([(0,r.MZ)({attribute:!1})],ep.prototype,"stageParticles",void 0),Zd([(0,r.MZ)({type:Number})],ep.prototype,"hiddenLayers",void 0),Zd([(0,r.wk)()],ep.prototype,"theme",void 0),Zd([(0,r.wk)()],ep.prototype,"reduced",void 0),Zd([(0,r.wk)()],ep.prototype,"speed",void 0),Zd([(0,r.wk)()],ep.prototype,"playing",void 0),Zd([(0,r.wk)()],ep.prototype,"_t",void 0),Zd([(0,r.wk)()],ep.prototype,"_k",void 0),Zd([(0,r.wk)()],ep.prototype,"_fh",void 0),Zd([(0,r.wk)()],ep.prototype,"_off",void 0),Zd([(0,r.wk)()],ep.prototype,"_wraps",void 0),Zd([(0,r.wk)()],ep.prototype,"_canvasOn",void 0);var tp=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const ip={"Glow & pulse":"mdi:lightbulb-on-outline",Motion:"mdi:rotate-right",Playful:"mdi:emoticon-happy-outline","Light & colour":"mdi:palette-outline","Rings & sweeps":"mdi:radar",Borders:"mdi:border-outside","Weather & device":"mdi:weather-partly-rainy",Scenes:"mdi:image-filter-hdr",Backgrounds:"mdi:gradient-horizontal",Seasonal:"mdi:pine-tree",Interaction:"mdi:gesture-tap","Fire & heat":"mdi:fire",Cleaning:"mdi:broom",Christmas:"mdi:pine-tree",Halloween:"mdi:halloween",Valentine:"mdi:heart-outline","Home automation":"mdi:home-automation"};let np,sp;const rp=e=>e in re?(0,K.t)(re[e]):e,ap=e=>"builtin"===e.kind?e.id:`cat:${e.entry.id}`,op=e=>"builtin"===e.kind?e.group:e.entry.group,lp=[...se,...["Fire & heat","Cleaning","Christmas","Halloween","Valentine","Home automation","Light & colour"].filter(e=>!se.includes(e))],cp=new Map,dp=new WeakMap;function pp(e){if("catalogue"===e.kind){if(dp.has(e.entry))return dp.get(e.entry);let t;try{t=e.entry.build()}catch{t=void 0}return dp.set(e.entry,t),t}if(cp.has(e.id))return cp.get(e.id);let t=At(e.id);return t&&e.tap&&(t={...t,iterations:"infinite"}),cp.set(e.id,t),t}class hp extends s.WF{constructor(){super(...arguments),this.play=!1,this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0,this._card=void 0}willUpdate(e){const t=this.source?pp(this.source):void 0;if(!(this._visible&&t&&this.source&&customElements.get("magic-card")))return void(this._card=void 0);const i=!this._card;if(i&&(this._card=document.createElement("magic-card")),i||e.has("source")||e.has("play")||e.has("lookup"))try{const e=gs(t,this.lookup,{tile:"card",thumb:!0,as:(n=ap(this.source),`pt-${n.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}`.slice(0,64)),still:!this.play}),i="catalogue"===this.source.kind?this.source.entry.icon:void 0;i&&function(e,t){const i=e.rows??[];for(const e of i)for(const i of e.columns??[])for(const e of i.modules??[])"icon"in e&&(e.icon=t)}(e,i),this._card.setConfig(e)}catch{return void(this._card=void 0)}var n;(i||e.has("hass"))&&(this._card.hass=ss("card",this.hass??Xd(!1)))}render(){const e=this.source?ip[op(this.source)]??"mdi:animation-outline":"mdi:animation-outline";return s.qy`<div class="box">${this._card?s.qy`<div class="scale">${this._card}</div>`:s.qy`<ha-icon icon=${e}></ha-icon>`}</div>`}}hp.styles=[vs,s.AH`
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
        left: 50%; /* physical */
        top: 50%;
        width: 200px;
        transform: translate(-50%, -50%) scale(0.6);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `],tp([(0,r.MZ)({attribute:!1})],hp.prototype,"source",void 0),tp([(0,r.MZ)({type:Boolean})],hp.prototype,"play",void 0),tp([(0,r.MZ)({attribute:!1})],hp.prototype,"hass",void 0),tp([(0,r.MZ)({attribute:!1})],hp.prototype,"lookup",void 0),tp([(0,r.wk)()],hp.prototype,"_visible",void 0);class up extends s.WF{constructor(){super(...arguments),this.sources=[],this.query="",this.lookup=()=>{},this.notice="",this._active=new Set,this._previewing=new Set,this._reduced=!1,this._timers=new Map,this._onMq=()=>{this._reduced=!!this._mq?.matches}}connectedCallback(){super.connectedCallback(),this._mq="function"==typeof window.matchMedia?window.matchMedia(Gn(3)):void 0,this._reduced=!!this._mq?.matches,this._mq?.addEventListener?.("change",this._onMq)}disconnectedCallback(){super.disconnectedCallback(),this._mq?.removeEventListener?.("change",this._onMq),this._mq=void 0;for(const e of this._timers.values())clearTimeout(e);this._timers.clear()}_set(e,t,i){const n=this[e];if(n.has(t)===i)return;const s=new Set(n);i?s.add(t):s.delete(t),this[e]=s}_preview(e,t){clearTimeout(this._timers.get(t)),this._set("_previewing",t,!0),this._timers.set(t,setTimeout(()=>{this._timers.delete(t),this._set("_previewing",t,!1)},function(e){const t="number"==typeof e?.duration?e.duration:2;return Math.min(8e3,Math.max(2500,Math.round(1e3*t)))}(pp(e))))}_pick(e){this.dispatchEvent(new CustomEvent("preset-pick",{detail:{source:e},bubbles:!0,composed:!0}))}_tile(e){const t=ap(e),i=(e=>"builtin"===e.kind?e.name:e.entry.name)(e),n=(e=>"builtin"===e.kind?e.tap||e.heavy:!!e.entry.heavy)(e),r=(e=>"builtin"===e.kind&&e.tap)(e),a=!this._reduced&&(!n||this._active.has(t)||this._previewing.has(t));return s.qy`<li class="pt-cell">
      <button
        type="button"
        class="pt"
        data-preset=${t}
        title=${i}
        aria-description=${r?Gn(674):s.s6}
        @click=${()=>this._pick(e)}
        @pointerenter=${()=>this._set("_active",t,!0)}
        @pointerleave=${()=>this._set("_active",t,!1)}
        @focus=${()=>this._set("_active",t,!0)}
        @blur=${()=>this._set("_active",t,!1)}
      >
        <mc-preset-thumb aria-hidden="true" .source=${e} .play=${a} .hass=${this.hass} .lookup=${this.lookup}></mc-preset-thumb>
        <span class="nm">${i}</span>
        ${r?s.qy`<span class="chip is-count" aria-hidden="true">${Gn(914)}</span>`:s.s6}
      </button>
      ${n&&!this._reduced?s.qy`<button type="button" class="pt-play" tabindex="-1" aria-hidden="true" title=${Gn(688)} @click=${()=>this._preview(e,t)}>
            <ha-icon icon="mdi:play"></ha-icon>
          </button>`:s.s6}
    </li>`}render(){const e=function(e,t){const i=(0,zt.A)(t).split(/\s+/).filter(Boolean),n=e=>{if(!i.length)return!0;const t=(0,zt.A)("builtin"===e.kind?`${e.name} ${e.id} ${e.group} ${rp(e.group)}`:`${e.entry.name} ${e.entry.id} ${e.entry.group} ${e.entry.tags.join(" ")}`);return i.every(e=>t.includes(e))},s=new Map;for(const t of e){if(!n(t))continue;const e=op(t),i=s.get(e);i?i.push(t):s.set(e,[t])}return lp.filter(e=>s.has(e)).map(e=>({group:e,tiles:s.get(e)}))}(this.sources,this.query.trim());return s.qy`
      ${e.length?e.map(e=>s.qy`<section class="pg" role="group" aria-label=${rp(e.group)}>
              <h3>${rp(e.group)} <span class="chip is-count">${e.tiles.length}</span></h3>
              <ul class="grid" role="list">
                ${e.tiles.map(e=>this._tile(e))}
              </ul>
            </section>`):s.qy`<div class="no-results">
            <p>${Gn(560,{query:this.query})}</p>
            <button type="button" class="btn btn-text btn-sm no-results-clear" @click=${()=>this.dispatchEvent(new CustomEvent("preset-clear-search",{bubbles:!0,composed:!0}))}>
              ${Gn(149)}
            </button>
          </div>`}
      <p class="notice" role="status" ?hidden=${!this.notice}>${this.notice}</p>
    `}}up.styles=[vs,bs,s.AH`
      :host {
        display: block;
        max-height: min(64vh, 640px);
        overflow: auto;
        /* sticky group headings never cover the focused tile (WCAG 2.4.11) */
        scroll-padding-top: 32px;
        padding-inline-end: 4px;
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
        inset-inline: auto 12px;
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
    `],tp([(0,r.MZ)({attribute:!1})],up.prototype,"sources",void 0),tp([(0,r.MZ)()],up.prototype,"query",void 0),tp([(0,r.MZ)({attribute:!1})],up.prototype,"hass",void 0),tp([(0,r.MZ)({attribute:!1})],up.prototype,"lookup",void 0),tp([(0,r.MZ)()],up.prototype,"notice",void 0),tp([(0,r.wk)()],up.prototype,"_active",void 0),tp([(0,r.wk)()],up.prototype,"_previewing",void 0),tp([(0,r.wk)()],up.prototype,"_reduced",void 0);var mp=i(2231);let gp;var fp=i(1699),vp=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const bp=e=>e?`mc-anim-draft:${e}`:"mc-anim-draft-new";function yp(e){try{const t=JSON.parse(sessionStorage.getItem(e)??"null");return t&&"object"==typeof t&&"string"==typeof t.id&&"string"==typeof t.name&&Qe.includes(t.kind)?t:void 0}catch{return}}function xp(e,t){try{const i=t?JSON.stringify(t):"";i&&i.length<=65536?sessionStorage.setItem(e,i):sessionStorage.removeItem(e)}catch{}}const _p=[{value:"normal",label:568},{value:"reverse",label:742},{value:"alternate",label:56},{value:"alternate-reverse",label:57}],wp={"mc-anim-states-panel":"mdi:state-machine","mc-anim-key-inspector":"mdi:key-variant","mc-anim-part-inspector":"mdi:vector-square","mc-anim-shape-inspector":"mdi:draw","mc-anim-bindings-panel":"mdi:link-variant","mc-anim-targets-layers":"mdi:card-text-outline","mc-anim-parts-layers":"mdi:vector-square","mc-anim-shapes-layers":"mdi:shape-outline","mc-anim-shapes-under-layers":"mdi:shape-outline","mc-anim-particles-layers":"mdi:shimmer","mc-anim-path-layers":"mdi:vector-curve","mc-anim-steps-layers":"mdi:format-list-numbered","mc-anim-part-presets":"mdi:auto-fix"},$p="mc-anim-parts-layers",kp=new Set(["mc-anim-keyframes-editor","mc-anim-sequence-editor",$s]),Mp="var(--primary-color, #03a9f4)",Sp=["infinite","1","2","3","5"],jp=["center","top","bottom","left","right","top left","top right","bottom left","bottom right"],Cp={keyframes:540,particles:541,path:542,sequence:543},Ap={keyframes:91,particles:92,path:93,sequence:94},zp={keyframes:491,particles:380,path:338,sequence:665},qp=["name","duration","easing","iterations","direction","target","origin"];function Ep(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}const Hp=e=>{const t=e??{},i=Array.isArray(t.errors)?t.errors.filter(e=>e&&"string"==typeof e.message):[];return{message:"string"==typeof t.message&&t.message?t.message:Gn(767),errors:i}},Lp="mcas-split",Vp="mcas-sections",Op="mcas-layers";function Pp(){return/Mac|iPhone|iPad/.test(navigator.platform||"")?"⌘\\":"Ctrl+\\"}function Rp(){const e=Pp();return[{id:"layers",side:"start",controls:"layers",name:Gn(410),noun:Gn(1114),hideLabel:Gn(366,{noun:Gn(1114),keys:e}),showLabel:Gn(822,{noun:Gn(1114),keys:e})},{id:"inspector",side:"end",controls:"inspector",name:Gn(390),noun:Gn(1110),hideLabel:Gn(366,{noun:Gn(1110),keys:e}),showLabel:Gn(822,{noun:Gn(1110),keys:e})}]}function Np(e){return{locale:e,hidden:Gn(1240,{panels:"{panels}"}),shown:Gn(1241,{panels:"{panels}"}),hintOne:Gn(985,{noun:"{noun}"}),hintMany:Gn(845),hintMigrated:Gn(952),hintShortcut:Gn(818,{keys:Pp()}),gotIt:Gn(351)}}function Dp(e){try{return localStorage.getItem(e)}catch{return null}}function Tp(e,t){try{void 0===t?localStorage.removeItem(e):localStorage.setItem(e,t)}catch{}}const Fp=e=>Math.min(.8,Math.max(.15,e)),Bp=e=>"keyframes"===e.kind||"sequence"===e.kind;function Ip(e){if(!e)return"none";const t=e.keys?.[0];return`${e.kind}|${"keys"===e.kind?`${t?.target}|${t?.lane}|${1===e.keys?.length?1:"n"}`:e.target??e.tool??""}`}let Zp="loading";const Wp=(0,K.G)().then(e=>Zp=e?"ready":"failed");class Kp extends s.WF{constructor(){super(...arguments),this.standalone=!1,this._docs=new Map,this._view="library",this._query="",this._kind="all",this._menu=!1,this._menuClosedAt=0,this._saved=null,this._errors=[],this._saveError="",this._busy=!1,this._status="",this._pseudo=!1,this._presetQuery="",this._catalogueFailed=!1,this._labels=Zp,this._customRepeat=!1,this._selection=Ms,this._tile="icon",this._split=function(){const e=Number(Dp(Lp));return null!==Dp(Lp)&&Number.isFinite(e)&&e>0?Fp(e):.4}(),this._lips=new Sd(this,{editor:"anim-studio",panels:Rp(),strings:Np("en"),fallback:()=>{const e=Dp(Op);if(null===e)return null;try{localStorage.removeItem(Op)}catch{}return"rail"===e?["layers"]:null}}),this._lipLocale="en",this._lipSig="",this._bar=new jd(this),this._width=0,this._height=0,this._userSplit=null!==Dp(Lp),this._inspOpen=!1,this._collapsed=function(){try{const e=JSON.parse(Dp(Vp)??"[]");return new Set(Array.isArray(e)?e.filter(e=>"string"==typeof e):[])}catch{return new Set}}(),this._editorRequested=!1,this._history=new ps(void 0),this._pointer=!1,this._onPointer=()=>{this._pointer=!0},this._lookup=e=>this._docs.get(e),this._onBeforeUnload=e=>{this._keepDraft(),this.dirty&&(e.preventDefault(),e.returnValue="")},this._taken=e=>this._docs.has(e)||this._doc?.id===e,this._time=0,this._libraryObj={},this._gesture=!1,this._layerViews=new Map,this._emitter={index:0,all:!1},this._onEmitter=e=>{e.stopPropagation();const{index:t,all:i}=e.detail??{};Number.isInteger(t)&&t>=0&&(t!==this._emitter.index||!!i!==this._emitter.all)&&(this._emitter={index:t,all:!!i})},this._onLayerView=e=>{const{view:t,announce:i}=e.detail;e.stopPropagation();const n=this._doc?.id;if(n){if(t!==this._layerViews.get(n)&&t!==this._viewOf(this._doc)){const e=new Map(this._layerViews);e.set(n,t),this._layerViews=e}i&&this._say(i)}},this._onKeydown=e=>{if(this._pointer=!1,e.defaultPrevented||this._dialog)return;const t=e.key.toLowerCase(),i=(e.ctrlKey||e.metaKey)&&!e.altKey;if("editor"!==this._view)"/"!==e.key||i||Ep(e)||(e.preventDefault(),this.shadowRoot?.querySelector(".search input")?.focus());else{if(i&&"s"===t)return e.preventDefault(),void this.save();if(i&&("z"===t||"y"===t)){if(Ep(e))return;return e.preventDefault(),void("y"===t||e.shiftKey?this.redo():this.undo())}if(" "===e.key&&!i&&!Ep(e)){const t=e.composedPath()[0];if(t instanceof HTMLElement&&/^(BUTTON|A)$/.test(t.tagName))return;return e.preventDefault(),void this._stage()?.togglePlay()}if("Escape"===e.key&&!Ep(e))if(this._inspOpen&&this._slideOver)e.preventDefault(),this._inspOpen=!1,this._focusSel=".insp-toggle";else if("none"!==this._selection.kind){e.preventDefault();const t=this.shadowRoot?.querySelector("aside.inspector"),i=this.shadowRoot?.activeElement,n=!!t&&!!i&&(t===i||t.contains(i));this._setSelection(Ms),!n&&i||(this._focusSel="aside.inspector")}}},this._onSelection=e=>{e.stopPropagation();const t=e.detail?.selection;var i;(i=t)&&"object"==typeof i&&["none","keys","target","tool"].includes(i.kind)&&this._setSelection(t)},this._onDocChange=e=>{e.stopPropagation();const{doc:t,label:i,transient:n}=e.detail??{};if(!t||!this._doc)return;const s=Na(t);if(s)n||(this._endGesture(),this._say(Gn(576,{big:s})),this._doc={...this._doc});else{if(n)this._gesture?this._history.replace(t):(this._gestureBase=this._doc,this._history.push(t)),this._gesture=!0;else if(this._gesture){const e=this._gestureBase;!e||t!==e&&JSON.stringify(t)!==JSON.stringify(e)?this._history.replace(t):this._history.revert(),this._endGesture()}else this._history.push(t,`editor:${i??""}`);this._doc=t,this._check(),this._pruneSelection()}},this._onStageRect=e=>{const{width:t,height:i,subject:n}=e.detail??{};if(!Number.isFinite(t)||!Number.isFinite(i))return;this._stageRect&&this._stageRect.width===t&&this._stageRect.height===i||(this._stageRect={width:t,height:i}),JSON.stringify(n)!==JSON.stringify(this._subjectRect)&&(this._subjectRect=n);const{scale:s,viewBox:r,screen:a}=e.detail??{},o={rect:{width:t,height:i},scale:Number.isFinite(s)&&s>0?s:1,...n?{subject:n}:{},...Array.isArray(r)&&4===r.length?{viewBox:r}:{},...a&&[a.left,a.top,a.width,a.height].every(Number.isFinite)?{screen:{left:a.left,top:a.top,width:a.width,height:a.height}}:{}};JSON.stringify(o)!==JSON.stringify(this._stageInfo)&&(this._stageInfo=o)},this._onPreviewChange=e=>{e.stopPropagation();const t=e.detail;if(!t||"object"!=typeof t)return;const i={...this._preview??{}};"string"==typeof t.state&&(i.state=t.state),"number"==typeof t.value&&Number.isFinite(t.value)&&(i.value=t.value),t.attributes&&"object"==typeof t.attributes&&(i.attributes={...t.attributes}),this._preview=Object.keys(i).length?i:void 0},this._onSeek=e=>{e.stopPropagation();const t=Number(e.detail?.time),i=this._stage();i&&Number.isFinite(t)&&i.seek(Math.min(1,Math.max(0,t))*i.cycle)},this._onSplitDown=e=>{if(0===e.button){e.preventDefault(),this._splitDrag={pointerId:e.pointerId};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}}},this._onSplitMove=e=>{if(!this._splitDrag||e.pointerId!==this._splitDrag.pointerId)return;const t=this._splitAt(e.clientY);void 0!==t&&this._setSplit(t,!1)},this._onSplitUp=e=>{this._splitDrag&&e.pointerId===this._splitDrag.pointerId&&(this._splitDrag=void 0,this._setSplit(this._split,!0))},this._onSplitKey=e=>{const t=e.shiftKey?.1:.05,i={ArrowUp:this._split-t,ArrowDown:this._split+t,Home:0,End:1};void 0!==i[e.key]&&(e.preventDefault(),this._setSplit(i[e.key],!0))},this._closeDialog=()=>{const e=this.shadowRoot?.querySelector("mc-ui-window");e?.open?e.close("action"):this._dialog=void 0}}willUpdate(e){e.has("hass")&&((0,W.Zc)(this.hass),window.MagicCard?.setLocale?.(this.hass)),this.lang!==Xn()&&(this.lang=Xn());const t=Xn();t!==this._lipLocale&&(this._lipLocale=t,this._lips.setPanels(Rp(),Np(t)));const i="editor"===this._view&&!!this._doc;if(this._lips.columns({layers:i,inspector:i&&!this._slideOver}),e.has("library")&&(this._docs=function(e){if(!e||"object"!=typeof e)return new Map;const t=Array.isArray(e)?e:(n=e,Array.isArray(n)?n:n&&"object"==typeof n?Object.entries(n).map(([e,t])=>t&&"object"==typeof t&&!("id"in t)&&st.test(e)?{id:e,...t}:t):[]),i=new Map;var n;for(const e of t){const t=wt(e);t.ok&&!i.has(t.doc.id)&&i.set(t.doc.id,t.doc)}return i}(this.library)),(e.has("library")||e.has("_docs"))&&(this._lookup=e=>this._docs.get(e),this._libraryObj=Object.fromEntries(this._docs)),e.has("library")){const e=this._doc&&this._saved?this._docs.get(this._saved.id):void 0;e&&!this.dirty&&JSON.stringify(e)!==JSON.stringify(this._saved)&&(this._saved=e,this._doc=e,this._playable=e,this._history.reset(e))}if(e.has("selectedId")){const e=this.selectedId||void 0;e?this._doc?.id!==e&&(this._wantId=e):("editor"===this._view&&!this.dirty&&this._saved&&this._closeEditor(!1),this._wantId=void 0)}if(this._wantId&&this._docs.has(this._wantId)){const e=this._docs.get(this._wantId);this._wantId=void 0,this.dirty||this._openDoc(e,!1,!1)}}updated(e){const t=e.get("_doc"),i=this._lipsChanged();if(e.has("_height")||e.has("_width")||i||e.has("_view")||e.has("_doc")&&t?.id!==this._doc?.id?this._autoSplit():e.has("_doc")&&this._autoSplit(!0),e.has("_inspOpen")&&this._inspOpen&&this._slideOver&&(this._focusSel??="aside.inspector"),e.has("_doc")&&this._doc&&t&&t.id===this._doc.id&&(this._doc.rig?.shapes?.length??0)>(t.rig?.shapes?.length??0)){const e=this._doc.rig?.shapes??[],t=e[e.length-1].id;this._revealShape(t)}if((i||e.has("_view")||e.has("_width")||e.has("_height")||e.has("_split")||e.has("_stageRect")||e.has("_doc"))&&this._placeLips(),e.has("_selection")&&Ip(e.get("_selection"))!==Ip(this._selection)){const e=this.shadowRoot?.querySelector("aside.inspector");e&&(e.scrollTop=0)}if(this._focusSel){const e=this.shadowRoot?.querySelector(this._focusSel);e&&(e.focus(),e instanceof HTMLInputElement&&e.select()),this._focusSel=void 0}const n=this._menu?this.shadowRoot?.querySelector("mc-ui-menu.new-menu"):void 0;n&&!n.open&&(n.anchor=this.shadowRoot?.querySelector(".new-btn")??void 0,n.show());const s=this.shadowRoot?.querySelector("mc-ui-window");if(s&&!s.open){const e=gd();e?.isConnected&&e!==document.body&&(this._opener=e),s.opener=this._opener,s.show();const t=s.querySelector("mc-anim-icon-start");t&&s.updateComplete.then(()=>setTimeout(()=>t.focusStart?.(),0));const i=s.querySelector("mc-transfer-panel");i&&s.updateComplete.then(()=>i.focusHeading?.())}else if(!s&&e.has("_dialog")&&e.get("_dialog")&&this._opener?.isConnected){const e=gd();e&&e!==document.body||this._opener.focus({preventScroll:!0}),this._opener=void 0}}_lipsChanged(){const e=`${this._lips.state("layers")}${this._lips.state("inspector")}`,t=e!==this._lipSig;return this._lipSig=e,t}_placeLips(){const e=this.shadowRoot,t=e?.querySelector(".workspace"),i=e?.querySelector("mcas-stage");if(this._bar.watch(i??null,t??null),!t||!i)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect();if(!n.height||!s.height)return;const r=s.top-n.top+s.height/2,a=Math.round(Math.min(Math.max(r,44),Math.max(44,n.height-44)));a!==this._lipTop&&(this._lipTop=a)}_lipTokens(){const e=this._lips,t=e.isHidden("layers")?"0px":"var(--layers-w)",i=e.isHidden("inspector")?"0px":"var(--insp-w)",n=void 0===this._lipTop?"":`; --mc-lip-top: ${this._lipTop}px`;return`--mc-lip-at-start: ${t}; --mc-lip-at-end: calc(${i} + ${this._bar.width}px)${n}`}connectedCallback(){super.connectedCallback(),Wp.then(()=>this._labels=Zp),this.addEventListener("keydown",this._onKeydown),this.addEventListener("pointerdown",this._onPointer),window.addEventListener("beforeunload",this._onBeforeUnload);const e=this._doc||this._dialog?void 0:yp(bp());e&&(this._dialog={type:"restore",draft:e,isNew:!0}),!this._editorRequested&&window.MagicCard?.loadEditor&&(this._editorRequested=!0,window.MagicCard.loadEditor());for(const e of[...Object.values(ws).map(e=>e.tag),$s,...Ss.map(e=>e.tag)])ks(e)||customElements.whenDefined(e).then(()=>this.requestUpdate());"undefined"==typeof ResizeObserver||this._ro||(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0),i=Math.round(e[0]?.contentRect.height??0);t&&t!==this._width&&(this._width=t),i&&i!==this._height&&(this._height=i)}),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("pointerdown",this._onPointer),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,this._keepDraft()}_keepDraft(){this._doc&&"restore"!==this._dialog?.type&&xp(bp(this._saved?.id),this.dirty?this._doc:void 0)}get dirty(){const e=this._doc;if(!e)return!1;const t=this._dirtyFor;if(t&&t.doc===e&&t.saved===this._saved)return t.value;const i=!this._saved||JSON.stringify(e)!==JSON.stringify(this._saved);return this._dirtyFor={doc:e,saved:this._saved,value:i},i}get docs(){return[...this._docs.values()].sort((e,t)=>e.name.localeCompare(t.name))}async _emit(e,t,i=!0){const n={...t};if(this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0})),n.result)return await n.result;if(i&&!this.standalone)throw{message:Gn(928)}}_store(e){const t=new Map(this._docs);t.set(e.id,e),this._docs=t}_say(e){this._status="",this.updateComplete.then(()=>this._status=e),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._status="",4e3)}_stored(e,t){const i=e?.animation??e,n=i?wt(i):void 0;return n?.ok?n.doc:t}_select(e){this._emit("mc-anim-select",{id:e},!1)}_new(e){this._menu=!1;const t=new Set(this.docs.map(e=>e.name)),i=Gn(Cp[e]);let n=i;for(let e=2;t.has(n);e++)n=`${i} ${e}`;this._guard(()=>this._openDoc(function(e,t,i="New animation"){const n={id:t,name:i,kind:e,duration:2,easing:"ease-in-out",iterations:"infinite",target:"element",origin:"center",version:1};switch(e){case"keyframes":return{...n,keyframes:[{at:0,transform:{scale:1}},{at:50,transform:{scale:1.1}},{at:100,transform:{scale:1}}]};case"particles":return{...n,duration:4,easing:"linear",particles:{...rt,size:[...rt.size],colors:[]}};case"path":return{...n,duration:3,easing:"linear",path:{d:"M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0",units:"px",follow_rotation:!1,subject:"element"}};case"sequence":return{...n,steps:[{animation:"pop",delay:0,repeat:1},{animation:"wiggle",delay:.2,repeat:1}],loop:!0,stagger:{children:!1,delay:.15}}}}(e,hs(n,this._taken),n),!0))}_openIconStart(){this._menu=!1,this._dialog={type:"icon"}}_startIcon(e){e.stopPropagation();const{doc:t,from:i}=e.detail??{};if(!t)return;this._dialog=void 0;const n=new Set(this.docs.map(e=>e.name));let s=t.name;for(let e=2;n.has(s);e++)s=`${t.name} ${e}`;const r={...t,id:hs(t.id,this._taken),name:s};this._guard(()=>{this._openDoc(r,!0);const e=r.rig?.parts[0]?.id;"icon"===i&&e&&(this._selection={kind:"target",target:`part:${e}`,targets:[`part:${e}`]})})}_openPresets(){this._presetQuery="",this._dialog={type:"presets"},this._catalogue||(this._catalogueFailed=!1,(gp??=i.e(494).then(()=>i(298)).then(e=>(0,mp.t)("magic-card-preset-catalogue.js",e),e=>{gp=void 0,console.warn("Magic Card: preset catalogue not loaded",e)}),gp).then(e=>{e?this._catalogue=e.CATALOGUE:this._catalogueFailed=!0}))}_pickPreset(e){e.stopPropagation();const t=(e.detail??{}).source;if(!t)return;if("builtin"===t.kind)return this._customise(t.id);let i;try{i=structuredClone(t.entry.build())}catch(e){return void this._say(Gn(1e3,{message:Hp(e).message}))}const n={...i,id:hs(Ct(t.entry.id),this._taken)};this._dialog=void 0,this._guard(()=>this._openDoc(n,!0))}_presetSources(){return this._sourcesFor&&this._sourcesFor.catalogue===this._catalogue||(this._sourcesFor={catalogue:this._catalogue,list:[...(np&&sp===(0,K.H)()||(sp=(0,K.H)(),np=ne.map(e=>({kind:"builtin",id:e.id,name:(0,K.t)(e.name),group:e.group,tap:"tap"===e.trigger,heavy:"Seasonal"===e.group||!!e.seasonal}))),np),...(this._catalogue??[]).map(e=>({kind:"catalogue",entry:e}))]}),this._sourcesFor.list}async _clearPresetSearch(){this._presetQuery="",await this.updateComplete,this.shadowRoot?.querySelector("input.preset-search")?.focus()}_customise(e){const t=At(e,hs(Ct(e),this._taken));t&&(this._dialog=void 0,this._guard(()=>this._openDoc(t,!0)))}async _duplicate(e){const t={...structuredClone(e),id:hs(`${e.id}-copy`,this._taken),name:us(e.name,new Set(this.docs.map(e=>e.name)))};try{const e=await this._emit("mc-anim-duplicate",{animation:t});this._store(this._stored(e,t)),this._say(Gn(281,{name:t.name}))}catch(e){this._say(Gn(282,{message:Hp(e).message}))}}async _rename(e,t){if(this._renaming!==e.id)return;this._renaming=void 0;const i=t.trim();if(!i||i===e.name)return;const n=wt({...e,name:i});if(n.ok)try{const e=await this._emit("mc-anim-save",{animation:n.doc});this._store(this._stored(e,n.doc)),this._say(Gn(728,{clean:i}))}catch(e){this._say(Gn(729,{message:Hp(e).message}))}else this._say(Gn(582,{message:ls(n.errors[0].message)}))}_askDelete(e){const t=this.usage?this.usage[e.id]??0:void 0,i=(n=e.id,s=this._docs.values(),[...s].filter(e=>"sequence"===e.kind&&e.id!==n&&ms(e).includes(n)));var n,s;0!==t||i.length?this._dialog={type:"delete",doc:e,uses:t,sequences:i}:this._delete(e)}async _delete(e){this._dialog=void 0;try{await this._emit("mc-anim-delete",{id:e.id});const t=new Map(this._docs);t.delete(e.id),this._docs=t,this._say(Gn(236,{name:e.name}))}catch(e){this._say(Gn(237,{message:Hp(e).message}))}}async _transferChunk(){try{const e=window.MagicCard;if(!e?.loadEditor||!e.loadTransfer||!await e.loadEditor())return;return await e.loadTransfer()}catch{return}}async _openTransfer(e){await this._transferChunk()?this._dialog=e:this._say(Gn(951))}_export(e){this._openTransfer({type:"export",items:fs(e,this._docs)})}async _onImport(e){e.stopPropagation();const{docs:t,errors:i}=function(e,t){const i=[],n=[];for(const s of e){const e=wt({...s.data,id:s.id,name:s.name});e.ok?i.length>=Math.max(0,t)?n.push(Gn(1190,{id:s.id})):i.push(e.doc):n.push(`${s.id}: ${e.errors[0]?ls(e.errors[0].message):Gn(1123)}`)}return{docs:i,errors:n}}(e.detail.items,200-this._docs.size),n=[...i];let s=0;for(const e of t)try{const t=await this._emit("mc-anim-save",{animation:e});this._store(this._stored(t,e)),s++}catch(t){n.push(`${e.id}: ${Hp(t).message}`)}const r=Gn(384,{count:s});this._say(n.length?`${r} ${Gn(579,{list:n.slice(0,4).join("; ")})}`:r),n.length||(this._dialog=void 0)}_guard(e){"editor"===this._view&&this.dirty?this._dialog={type:"discard",then:e}:e()}_openDoc(e,t,i=!0){this._doc=e,this._emitter={index:0,all:!1},this._saved=t?null:e,this._history.reset(e),this._errors=[],this._saveError="",this._customRepeat=!1,this._playable=e,this._endGesture(),this._time=0,this._selection=Ms,this._preview=void 0,this._inspOpen=!1,this._view="editor",this._pointer||(this._focusSel=".back"),i&&!t&&this._select(e.id);const n=t?void 0:yp(bp(e.id));n&&JSON.stringify(n)!==JSON.stringify(e)?this._dialog={type:"restore",draft:n,isNew:!1}:n&&xp(bp(e.id))}_restoreDraft(e,t){this._dialog=void 0,t?this._openDoc(this._taken(e.id)?{...e,id:hs(e.id,this._taken)}:e,!0):this._doc?.id===e.id&&this._apply(e)}_closeEditor(e=!0){const t=!!this._doc;this._view="library",this._doc=void 0,this._selection=Ms,this._preview=void 0,this._saved=null,this._history.reset(void 0),this._errors=[],this._saveError="",e&&t&&this._select(null)}_back(){this._guard(()=>this._closeEditor())}_set(e,t){if(!this._doc)return;const i={...this._doc,...e};for(const[t,n]of Object.entries(e))void 0===n&&delete i[t];this._apply(i,t)}_apply(e,t){this._endGesture(),this._history.push(e,t),this._doc=e,this._check(),this._pruneSelection()}_endGesture(){this._gesture=!1,this._gestureBase=void 0}_viewOf(e){return function(e,t){const i=so(e),n=e=>!/^(target|part|group|shape|lane|emitter|children|step):/.test(e)||i.has(e)||"target:element"===e,s=e=>e.every(n)?e:e.filter(n),r=s(t.hidden),a=s(t.solo),o=s(t.locked),l=s(t.open);return r===t.hidden&&a===t.solo&&o===t.locked&&l===t.open?t:{hidden:r,solo:a,locked:o,open:l}}(e,this._layerViews.get(e.id)??Xa)}_previewDoc(e,t){const i=this._previewMemo;if(i&&i.base===e&&i.view===t)return i.out;const n=((e,t)=>{const i=ao(e,t),n=new Map,s=new Set;for(const e of i)if(e.startsWith("lane:")){const t=e.lastIndexOf("|"),i=e.slice(5,t);n.set(i,[...n.get(i)??[],e.slice(t+1)])}else e.startsWith("step:")&&s.add(Number(e.slice(5)));if(!n.size&&!s.size)return e;const r={...e};return s.size&&(r.steps=(e.steps??[]).filter((e,t)=>!s.has(t))),n.size&&(e.keyframes&&n.has(jr(e))&&(r.keyframes=ho(e.keyframes,n.get(jr(e)))),e.tracks&&(r.tracks=e.tracks.flatMap(e=>{const t=n.get(e.target);if(!t)return[e];const i=ho(e.keyframes,t);return i.length||e.path?[{...e,keyframes:i}]:[]})),e.bindings&&(r.bindings=e.bindings.filter(e=>!n.get(e.target)?.some(t=>po[e.property]===t)))),r})(e,t);return this._previewMemo={base:e,view:t,out:n},n}_check(){const e=this._doc?wt(this._doc):void 0;this._errors=e&&!e.ok?e.errors:[],e?.ok&&(this._playable=e.doc)}undo(){this._endGesture();const e=this._history.undo();e&&(this._doc=e,this._check(),this._pruneSelection())}redo(){this._endGesture();const e=this._history.redo();e&&(this._doc=e,this._check(),this._pruneSelection())}_pruneSelection(){const e=this._doc,t=this._selection;if(!e||"none"===t.kind)return;const i=t=>{const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return!0;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return!!n?.some(e=>e.id===i[2])};if("tool"===t.kind)return void(t.target&&!i(t.target)&&(this._selection={kind:"tool",tool:t.tool}));if("keys"===t.kind){const i=(t.keys??[]).filter(t=>Hr(e,{target:t.target,lane:t.lane,at:t.at}));if(i.length===(t.keys??[]).length)return;if(!i.length)return void(this._selection=Ms);const n=[...new Set(i.map(e=>e.target))];return void(this._selection={kind:"keys",keys:i,targets:n,target:t.target&&n.includes(t.target)?t.target:i[i.length-1].target})}const n=(t.targets??(t.target?[t.target]:[])).filter(i);n.length?n.length===(t.targets?.length??1)&&t.target&&i(t.target)||(this._selection={kind:"target",target:t.target&&i(t.target)?t.target:n[0],targets:n}):this._selection=Ms}async save(){if(!this._doc||this._busy)return!1;const e=wt(this._doc);if(!e.ok)return this._errors=e.errors,this._saveError=Gn(331),!1;this._busy=!0,this._saveError="";const t=JSON.stringify(this._doc);try{const i=await this._emit("mc-anim-save",{animation:e.doc}),n=this._stored(i,e.doc),s=!this._saved;this._store(n),this._saved=n,xp(bp(n.id)),s&&xp(bp());const r=JSON.stringify(this._doc);return r===t&&JSON.stringify(n)!==r?this._apply(n):this._check(),this._say(Gn(766,{name:n.name})),s&&this._select(n.id),!0}catch(e){const t=Hp(e);return this._errors=t.errors,this._saveError=t.message,!1}finally{this._busy=!1}}_pseudoSwitch(){return s.qy`<button
      type="button"
      class="btn ${this._pseudo?"btn-primary":"btn-secondary"} btn-sm pseudo-switch"
      role="switch"
      aria-checked=${this._pseudo?"true":"false"}
      @click=${()=>{this._togglePseudo()}}
    >
      <ha-icon icon="mdi:format-textdirection-r-to-l"></ha-icon>${Gn(698)}
    </button>`}async _togglePseudo(){const e=!this._pseudo;await async function(e,t){let s=null;if(e)try{s=(await i.e(278).then(()=>i(419))).pseudoWrap}catch{return!1}(0,fp.iC)(s);for(const i of t)i&&(e?i.setAttribute("dir","rtl"):i.removeAttribute("dir"));return window.dispatchEvent(new Event(n)),!0}(e,[this,this._stage()])&&(this._pseudo=e)}_stage(){return this.shadowRoot?.querySelector("mcas-stage")??null}_renderNewMenu(){const e=[...Qe.map(e=>({id:`kind:${e}`,label:Gn(Ap[e]),sub:Gn(zp[e]),icon:ds[e]})),{id:"preset",label:Gn(209),icon:"mdi:auto-fix",separatorBefore:!0},{id:"icon",label:Gn(374),icon:"mdi:motion-play-outline"}];return s.qy`<mc-ui-menu
      class="new-menu"
      .items=${e}
      label=${Gn(538)}
      .align=${"end"}
      @mc-menu-pick=${e=>{e.stopPropagation();const t=e.detail.id;this._menu=!1,this._opener=this.shadowRoot?.querySelector(".new-btn")??void 0,"preset"===t?this._openPresets():"icon"===t?this._openIconStart():this._new(t.slice(5))}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menu=!1}}
    ></mc-ui-menu>`}_toggleNewMenu(){this._menu?(this.shadowRoot?.querySelector("mc-ui-menu.new-menu")?.close("escape"),this._menu=!1):Date.now()-this._menuClosedAt>400&&(this._menu=!0)}_renderNewButton(){return s.qy`<div class="menu-anchor">
      <button
        type="button"
        class="btn btn-primary btn-sm new-btn"
        aria-haspopup="menu"
        aria-expanded=${this._menu?"true":"false"}
        @click=${()=>this._toggleNewMenu()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>${Gn(538)}<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${this._menu?this._renderNewMenu():s.s6}
    </div>`}_usedBy(e){if(!this.usage)return s.s6;const t=this.usage[e]??0;return s.qy`<span class="used ${t?"":"none"}">${t?Gn(1060,{count:t}):Gn(584)}</span>`}_renderRow(e){const t=this._renaming===e.id,i=t=>{this._rename(e,t.target.value)};return s.qy`
      <li class="lib-row" data-id=${e.id}>
        <mcas-thumb .doc=${e} .lookup=${this._lookup} .hass=${this.hass}></mcas-thumb>
        ${t?s.qy`<div class="name-cell">
                <input
                  class="input rename"
                  aria-label=${Gn(533,{name:e.name})}
                  maxlength="80"
                  .value=${e.name}
                  @keydown=${t=>{"Enter"===t.key&&i(t),"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this._renaming=void 0,this._focusSel=`.lib-row[data-id="${e.id}"] .rename-btn`)}}
                  @blur=${i}
                />
              </div>`:s.qy`<button type="button" class="open name-cell" @click=${()=>this._guard(()=>this._openDoc(e,!1))}>
                <span class="nm">${e.name}</span>
                <span class="id mono">${Gn(1098,{id:e.id})}</span>
              </button>`}
        <span class="chip kind"><ha-icon icon=${ds[e.kind]}></ha-icon>${Gn(cs[e.kind])}</span>
        ${this._usedBy(e.id)}
        <span class="acts">
          <button type="button" class="icon-btn sm" title=${Gn(276)} aria-label=${Gn(280,{name:e.name})} @click=${()=>this._duplicate(e)}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm rename-btn"
            title=${Gn(723)}
            aria-label=${Gn(726,{name:e.name})}
            @click=${()=>{this._renaming=e.id,this._focusSel=".rename"}}
          >
            <ha-icon icon="mdi:rename-outline"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            title=${Gn(312)}
            aria-label=${Gn(315,{name:e.name})}
            @click=${()=>this._export([e])}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>
          </button>
          <button type="button" class="icon-btn sm danger" title=${Gn(220)} aria-label=${Gn(235,{name:e.name})} @click=${()=>this._askDelete(e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </span>
      </li>
    `}_renderEmpty(){return s.qy`<div class="empty lib-empty">
      <ha-icon icon="mdi:animation-play-outline"></ha-icon>
      <strong>${Gn(552)}</strong>
      <p>${Gn(111)}</p>
      <div class="starters">
        ${Qe.map(e=>s.qy`<button type="button" class="starter" @click=${()=>this._new(e)}>
              <ha-icon icon=${ds[e]}></ha-icon><span class="mi-t">${Gn(cs[e])}</span><span class="mi-s">${Gn(zp[e])}</span>
            </button>`)}
        <button
          type="button"
          class="starter"
          @click=${()=>this._openPresets()}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon><span class="mi-t">${Gn(346)}</span><span class="mi-s">${Gn(210,{count:ne.length})}</span>
        </button>
        <button type="button" class="starter" data-kind="icon" @click=${()=>this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon><span class="mi-t">${Gn(373)}</span><span class="mi-s">${Gn(62)}</span>
        </button>
      </div>
    </div>`}_renderLibrary(){const e=this.docs,t=[{id:"all",label:Gn(44)},...Qe.map(e=>({id:e,label:Gn(cs[e])}))],i=function(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>{const t=(0,zt.A)(`${e.name} ${e.id} ${e.kind} ${Gn(cs[e.kind])}`);return i.every(e=>t.includes(e))}):e}(e,this._query).filter(e=>"all"===this._kind||e.kind===this._kind);return s.qy`
      <header class="topbar">
        <div class="grp title">
          <ha-icon class="title-icon" icon="mdi:animation-play-outline"></ha-icon>
          <h1>${Gn(68)}</h1>
          <span class="chip is-count">${e.length}</span>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          ${this._pseudoSwitch()}
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click=${()=>{this._openTransfer({type:"import"})}}
          >
            <ha-icon icon="mdi:import"></ha-icon>${Gn(381)}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            ?disabled=${!e.length}
            @click=${()=>this._export(e)}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>${Gn(313)}
          </button>
          ${this._renderNewButton()}
        </div>
      </header>
      <main class="lib">
        <div class="lib-inner">
          ${e.length?s.qy`
                  <div class="lib-tools">
                    <div class="with-icon search">
                      <ha-icon icon="mdi:magnify"></ha-icon>
                      <input
                        class="input"
                        type="search"
                        placeholder=${Gn(774)}
                        aria-label=${Gn(774)}
                        aria-keyshortcuts="/"
                        .value=${D(this._query)}
                        @input=${e=>this._query=e.target.value}
                      />
                    </div>
                    <div class="kinds">${zd({role:"radiogroup",label:Gn(400),value:this._kind,items:t.map(e=>({value:e.id,label:e.label})),onChange:e=>this._kind=e})}</div>
                  </div>
                  ${i.length?s.qy`<ul class="lib-list ${this.usage?"has-usage":""}" aria-label=${Gn(531)}>
                          ${i.map(e=>this._renderRow(e))}
                        </ul>`:s.qy`<p class="no-results">${this._query?Gn(550,{query:this._query}):Gn(551)}</p>`}
                `:this._renderEmpty()}
        </div>
      </main>
    `}_fieldErrors(e){const t=this._errors.filter(t=>t.path===e);return t.length?s.qy`${t.map(t=>s.qy`<p class="help error" id="err-${e}">${ls(t.message)}</p>`)}`:s.s6}_field(e,t,i,n,r){return s.qy`<div class="field">
      <div class="field-head"><label for=${t}>${e}</label></div>
      ${i} ${r?s.qy`<p class="help">${r}</p>`:s.s6} ${n?this._fieldErrors(n):s.s6}
    </div>`}_selectEl(e,t,i,n){return s.qy`<div class="select">
      <select class="input" id=${e} @change=${e=>n(e.target.value)}>
        ${i.map(e=>s.qy`<option value=${e.value} ?selected=${e.value===t}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}get _compact(){return this._width>0&&this._width<1100&&!this._slideOver}get _slideOver(){return this._width>0&&this._width<900}_setSelection(e){this._selection=e,this._slideOver&&"keys"===e.kind&&(this._inspOpen=!0)}_toggleSection(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t,Tp(Vp,JSON.stringify([...t]))}_section(e,t,i,n,r={}){const a=r.errors||!this._collapsed.has(e);return s.qy`<section class="sec ${r.cls??""}" data-sec=${e}>
      ${function(e){const t=4===e.level,i=bd(e,18);if(!e.collapsible){const n=s.qy`${i}${t?s.qy`<h4>${e.title}</h4>`:s.qy`<h3>${e.title}</h3>`}`;return s.qy`<div class="group-head">${n}</div>`}const n=s.qy`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${f("chevronDown",20)}</span> </button>`;return t?s.qy`<h4 class="sector-head">${n}</h4>`:s.qy`<h3 class="sector-head">${n}</h3>`}({title:t,icon:i,collapsible:!0,expanded:a,onToggle:()=>this._toggleSection(e)})}
      ${r.errors?s.qy`<span class="sec-err" role="img" aria-label=${Gn(360)}></span>`:s.s6}
      <div class="sec-body" id="secb-${e}" ?hidden=${!a}>${a?n:s.s6}</div>
    </section>`}_hasErrors(e){return this._errors.some(t=>e.includes(t.path))}_renderErrors(){const e=this._errors.filter(e=>!qp.includes(e.path));return this._saveError||e.length?s.qy`<div class="errors" role="alert">
          ${this._saveError?s.qy`<strong>${this._saveError}</strong>`:s.s6}
          ${e.length?s.qy`<ul>
                  ${e.map(e=>s.qy`<li><span class="mono">${e.path||"animation"}</span> ${ls(e.message)}</li>`)}
                </ul>`:s.s6}
        </div>`:s.s6}_renderForm(e){const t=G.map(e=>({value:e.id,label:(0,K.t)(e.label)}));G.some(t=>t.id===e.easing)||t.push({value:e.easing,label:e.easing});const i=String(e.iterations),n=this._customRepeat||!Sp.includes(i),r=[...Sp.map(e=>({value:e,label:"infinite"===e?Gn(388):e})),{value:"custom",label:Gn(204)}],a="keyframes"===e.kind||"sequence"===e.kind,o=this._field(Gn(532),"f-name",s.qy`<input
        class="input"
        id="f-name"
        maxlength="80"
        .value=${D(e.name)}
        aria-invalid=${this._errors.some(e=>"name"===e.path)?"true":"false"}
        @input=${e=>this._set({name:e.target.value},"name")}
      />`,"name",s.qy`${Gn(126)} <span class="mono ref">${Gn(1098,{id:e.id})}</span>`),l=s.qy`
      ${"sequence"===e.kind?s.qy`<p class="help">${Gn(19)}</p>`:this._field(Gn(283),"f-duration",s.qy`<div class="suffix">
                <input
                  class="input"
                  id="f-duration"
                  type="number"
                  inputmode="decimal"
                  min="0.05"
                  max="600"
                  step="any"
                  .value=${D(String(e.duration))}
                  @input=${e=>{const t=e.target.value;""!==t&&Number.isFinite(Number(t))&&this._set({duration:Number(t)},"duration")}}
                />
                <span aria-hidden="true">s</span>
              </div>`,"duration")}
      <div class="two">
        ${this._field(Gn(286),"f-easing",this._selectEl("f-easing",e.easing,t,e=>this._set({easing:e},"easing")),"easing")}
        ${this._field(Gn(730),"f-repeat",this._selectEl("f-repeat",n?"custom":i,r,t=>{if("custom"===t)return this._customRepeat=!0,void("infinite"===e.iterations&&this._set({iterations:10},"iterations"));this._customRepeat=!1,this._set({iterations:"infinite"===t?"infinite":Number(t)},"iterations")}),"iterations")}
      </div>
      ${n?this._field(Gn(731),"f-count",s.qy`<input
                class="input"
                id="f-count"
                type="number"
                min="1"
                step="1"
                .value=${D("number"==typeof e.iterations?String(e.iterations):"")}
                @input=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&t>0&&this._set({iterations:t},"count")}}
              />`):s.s6}
      ${this._field(Gn(240),"f-dir",this._selectEl("f-dir",e.direction??"normal",(c=_p,c.map(e=>({...e,label:Gn(e.label)}))),e=>this._set({direction:"normal"===e?void 0:e},"direction")),"direction")}
    `;var c;return s.qy`
      ${this._section("anim",Gn(65),ds[e.kind],o,{errors:this._hasErrors(["name"])})}
      ${this._section("timing",Gn(1005),"mdi:timer-outline",l,{errors:this._hasErrors(["duration","easing","iterations","direction"])})}
      ${a?this._section("moves",Gn(1074),"mdi:cursor-move",this._renderMoves(e),{errors:this._hasErrors(["target","origin"])}):s.s6}
    `}_renderMoves(e){const t=jp.map(e=>({value:e,label:na.includes(e)?Gn(sa[na.indexOf(e)]):e.charAt(0).toUpperCase()+e.slice(1)}));jp.includes(e.origin)||t.push({value:e.origin,label:e.origin});const i="icon"===e.target?"icon":"element";return s.qy`
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-target">${Gn(915)}</span></div>
        <div class="seg full target" role="radiogroup" aria-labelledby="l-target" @keydown=${e=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)&&(e.preventDefault(),this._set({target:"icon"===i?"element":"icon"},"target"),this._focusSel='.target [aria-checked="true"]')}}>
          ${["element","icon"].map(e=>{const t=e===i;return s.qy`<button
              type="button"
              role="radio"
              aria-checked=${t?"true":"false"}
              tabindex=${t?"0":"-1"}
              @click=${()=>this._set({target:e},"target")}
            >
              ${Gn("element"===e?292:371)}
            </button>`})}
        </div>
        <p class="help">${Gn(375)}</p>
        ${this._fieldErrors("target")}
      </div>
      ${"keyframes"===e.kind?this._field(Gn(613),"f-origin",this._selectEl("f-origin",e.origin,t,e=>this._set({origin:e},"origin")),"origin",Gn(966)):s.s6}
    `}_editorEl(e,t,i={}){const n=(e=>({_$litStatic$:e,r:T}))(e);return i.panel?Z`<${n}
        class=${i.cls??"panel"}
        slot=${i.slot??s.s6}
        .doc=${t}
        .hass=${this.hass}
        .library=${this._libraryObj}
        .time=${kp.has(e)?this._time:0}
        .disabled=${this._busy||!!i.inspector&&mo(t,this._viewOf(t),this._selection)}
        .selection=${this._selection}
        .tile=${this._tile}
        .stage=${this._stageInfo}
        .layerView=${this._viewOf(t)}
        .density=${this._width>0&&this._width<1e3?"compact":"full"}
        .emitter=${this._emitter.index}
        .all=${this._emitter.all}
        .stageRect=${i.stageRect}
        .subjectRect=${i.subjectRect}
        .entityColor=${Mp}
        @doc-change=${this._onDocChange}
        @seek=${this._onSeek}
        @selection-change=${this._onSelection}
      ></${n}>`:Z`<${n}
      class=${i.cls??"kind-editor"}
      slot=${i.slot??s.s6}
      .doc=${t}
      .hass=${this.hass}
      .library=${this._libraryObj}
      .time=${kp.has(e)?this._time:0}
      .disabled=${this._busy||e===$s&&this._viewOf(t).locked.includes("path")}
      .studioSelection=${this._selection}
      .layerView=${this._viewOf(t)}
      .emitter=${this._emitter.index}
      .all=${this._emitter.all}
      .tile=${this._tile}
      .stage=${this._stageInfo}
      .stageRect=${i.stageRect}
      .subjectRect=${i.subjectRect}
      .entityColor=${Mp}
      @doc-change=${this._onDocChange}
      @seek=${this._onSeek}
      @selection-change=${this._onSelection}
    ></${n}>`}_panels(e,t,i={}){return Cs(e,t,this._selection).filter(e=>ks(e.tag)).map(e=>this._editorEl(e.tag,t,{cls:`panel panel-${e.place}`,panel:!0,...i,..."stage-tool"===e.place&&e.dock&&"overlay"!==e.dock?{slot:e.dock}:{}}))}_renderKindSlot(e){const t=ws[e.kind],i=ks(t.tag)?this._editorEl(t.tag,e):s.qy`<p class="help">${Gn(426,{kind:Gn(t.title).toLowerCase()})}</p>`;return"inspector"===t.place?s.qy`<div class="kind-slot place-inspector" data-kind=${e.kind}>${this._section(`kind-${e.kind}`,Gn(t.title),ds[e.kind],i)}</div>`:s.qy`<section class="kind-slot place-panel" aria-label=${Gn(t.title)} data-kind=${e.kind}>${i} ${this._panels("timeline",e)}</section>`}_setSplit(e,t){this._split=this._clampSplitPx(Fp(Math.round(1e3*e)/1e3)),this._userSplit=!0,t&&Tp(Lp,String(this._split))}_clampSplitPx(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect().height??0;if(t<=0)return e;const i=Math.min(.45,160/t);return Math.round(1e3*Math.min(1-i,Math.max(i,e)))/1e3}_splitAt(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect();if(t&&!(t.height<=0))return(e-t.top)/t.height}_resetSplit(){Tp(Lp,void 0),this._userSplit=!1,this._split=.4,this._autoSplit()}_autoSplit(e=!1){const t=this._doc;if(this._userSplit||!t||"editor"!==this._view||"panel"!==ws[t.kind].place)return;const i=this.shadowRoot?.querySelector(".center"),n=i?.getBoundingClientRect().height??0;if(n<=0)return;const s=this.shadowRoot?.querySelector(".kind-slot.place-panel .kind-editor"),r=s?.getBoundingClientRect().width||i?.getBoundingClientRect().width||0,a=function(e,t,i=!1){const n=Cr(e).filter(e=>e.main||e.keyframes.length),s=n.reduce((e,t)=>e+Zs(t.keyframes).length,0),r=Math.max(0,...n.map(e=>Us(e.keyframes,"*").length)),a=i?187+49*r+(r?0:44):146+41*n.length+35*s+(s?0:44),o=Math.max(160,Math.min(.6*t,a));return Math.round(1e3*Fp((t-9-o)/t))/1e3}(t,n,r>0&&r<480);(e?a<this._split-.002:Math.abs(a-this._split)>.002)&&(this._split=a)}async _revealShape(e){await this.updateComplete;const t=this.shadowRoot?.querySelector("nav.layers"),i=[...t?.querySelectorAll("mc-anim-shapes-layers, mc-anim-shapes-under-layers")??[]];await Promise.all(i.map(e=>e.updateComplete));const n=i.find(t=>t.shadowRoot?.querySelector(`li[data-id="${e}"]`))??i[0],s=n?.shadowRoot?.querySelector(`li[data-id="${e}"]`);s?.scrollIntoView?.({block:"nearest"})}_layerTargets(e){const t=["element","icon"];for(const i of e.tracks??[])t.includes(i.target)||t.push(i.target);return t}_renderLayerList(e){if("particles"===e.kind)return s.qy`<p class="help layers-note">${Gn(634)}</p>`;const t=ts.find(e=>e.id===this._tile),i=this._selection;return s.qy`<ul class="layer-list" role="list">
      ${this._layerTargets(e).map(n=>{const r=!("target"!==i.kind&&"keys"!==i.kind||i.target!==n&&!i.targets?.includes(n)),a=!!t&&"element"!==n&&!t.targets.includes(n),o=Mr(e,n),l=(t=>t===e.target&&"keyframes"===e.kind?e.keyframes?.length??0:e.tracks?.find(e=>e.target===t)?.keyframes.length??0)(n),c=n===e.target,d=c&&a?Gn(1196,{label:o,tile:Gn(t.label).toLowerCase()}):c?Gn(1195,{label:o}):a?Gn(1204,{label:o,tile:Gn(t.label).toLowerCase()}):o;return s.qy`<li>
          <button
            type="button"
            class="layer ${a?"off":""}"
            data-target=${n}
            aria-pressed=${r?"true":"false"}
            title=${d}
            @click=${e=>this._pickLayer(n,e.ctrlKey||e.metaKey||e.shiftKey)}
          >
            <ha-icon icon=${Sr(n)}></ha-icon>
            <span class="layer-name">${o}</span> ${c&&Bp(e)?s.qy`<span class="chip is-accent layer-main">${Gn(495)}</span>`:s.s6}
            ${l?s.qy`<span class="layer-count" title=${Gn(1157,{count:l})}>${l}</span>`:s.s6}
          </button>
        </li>`})}
    </ul>`}_pickLayer(e,t){const i=this._selection,n="target"===i.kind||"keys"===i.kind?i.targets??(i.target?[i.target]:[]):[];if(!t){const t=1===n.length&&n[0]===e&&"target"===i.kind;return void this._setSelection(t?Ms:{kind:"target",target:e,targets:[e]})}const s=n.includes(e),r=s?n.filter(t=>t!==e):[...n,e];r.length?this._setSelection({kind:"target",target:s?i.target&&r.includes(i.target)?i.target:r[0]:e,targets:r}):this._setSelection(Ms)}_renderLayers(e){const t=Cs("layers",e,this._selection).filter(e=>ks(e.tag)).map(t=>s.qy`<section class="layer-group" data-panel=${t.tag} aria-label=${Gn(t.title)} tabindex="-1">
          <h3 class="layer-head">${Gn(t.title)}</h3>
          ${this._editorEl(t.tag,e,{cls:"panel panel-layers",panel:!0})}
        </section>`),i=this._lips;return s.qy`<nav class="layers" id="layers" aria-label=${Gn(410)} ?inert=${i.isHidden("layers")} data-lip=${i.state("layers")} data-dir=${i.dir}>
      <div class="layers-head">
        <h2>${Gn(408)}</h2>
      </div>
      <div class="layers-body">${t.length?s.qy`${t}<p class="help layers-help">${Gn(367)}</p>`:this._renderLayerList(e)}</div>
    </nav>
    ${i.lip("layers")}`}_renderContext(e){const t=this._selection,i=t.keys?.length??0,n="keys"===t.kind?`${Gn(1157,{count:i})}${t.target?` · ${Mr(e,t.target)}`:""}`:"target"===t.kind&&t.target?(t.targets?.length??0)>1?Gn(1171,{count:t.targets.length}):Mr(e,t.target):"tool"===t.kind?Gn(1008,{tool:t.tool??""}):"";return s.qy`<div class="ctx">
      <button type="button" class="btn btn-text btn-sm ctx-back" title=${Gn(67)} @click=${()=>this._setSelection(Ms)}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>${Gn(65)}
      </button>
      <span class="ctx-what">${n}</span>
    </div>`}_renderFallback(e){const t=this._selection;if("target"===t.kind&&("element"===t.target||"icon"===t.target)&&Bp(e)){const i=t.target===e.target;return this._section("target",Mr(e,t.target),Sr(t.target),s.qy`<p class="help">
            ${i?"icon"===t.target?Gn(933):Gn(934):"icon"===e.target?Gn(932):Gn(931)}
          </p>
          ${i?s.s6:s.qy`<button
                  type="button"
                  class="btn btn-secondary btn-sm make-main"
                  @click=${()=>this._set({target:t.target},"target")}
                >
                  <ha-icon icon="mdi:target"></ha-icon>${"icon"===t.target?Gn(478):Gn(477)}
                </button>`}
          ${"keyframes"===e.kind&&i?this._renderMoves(e):s.s6}`)}const i=t.keys?.length??0;return s.qy`<p class="help ctx-note">${"keys"===t.kind?Gn(1161,{count:i}):Gn(593)}</p>`}_renderInspector(e){const t=this._selection,i="inspector"===ws[e.kind].place?this._renderKindSlot(e):s.s6;if("none"===t.kind){const n=Cs("inspector",e,t).filter(e=>ks(e.tag)).map(t=>this._section(`panel-${t.tag}`,Gn(t.title),wp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0})));return s.qy`${this._renderErrors()} ${i} ${this._renderForm(e)} ${n}`}const n=Cs("inspector",e,t).filter(e=>ks(e.tag)).map(t=>this._section(`panel-${t.tag}`,Gn(t.title),wp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0,inspector:!0}))),r=this._viewOf(e),a=mo(e,r,t)?bo(e,r,uo(t)):s.s6,o="target"!==t.kind||"element"!==t.target&&"icon"!==t.target||!Bp(e)?s.s6:this._renderFallback(e),l="target"===t.kind&&"icon"===t.target&&"keyframes"===e.kind&&!e.rig?.parts?.length&&ks($p)?this._section("split-icon",Gn(376),wp[$p],this._editorEl($p,e,{cls:"panel panel-inspector",panel:!0})):s.s6,c=n.length?n:o===s.s6&&l===s.s6?this._renderFallback(e):s.s6;return s.qy`${a} ${this._renderContext(e)} ${this._renderErrors()} ${o} ${l} ${c}`}_zoomIcon(e){const t=this._selection;return"keyframes"===e.kind&&("tool"===t.kind||("target"===t.kind||"keys"===t.kind)&&!!t.target&&/^(part|group|shape):/.test(t.target))}_renderEditor(e){const t=this.dirty,i="panel"===ws[e.kind].place,n=this._slideOver,r=this._lips,a=this._viewOf(e),o=this._playable??e,l=function(e,t){const i=ao(e,t);let n=0;for(const t of i){if(t.startsWith(ro))continue;const s=oo(e,t);s&&i.has(s)||n++}return n}(o,a);return s.qy`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm back" @click=${()=>this._back()}><ha-icon icon="mdi:arrow-left"></ha-icon>${Gn(414)}</button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong class="doc-name">${e.name.trim()||Gn(1042)}</strong>
            <span class="chip kind"><ha-icon icon=${ds[e.kind]}></ha-icon>${Gn(cs[e.kind])}</span>
            ${this._saved?t?s.qy`<span class="chip is-warn">${Gn(1040)}</span>`:s.s6:s.qy`<span class="chip is-accent">${Gn(537)}</span>`}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          ${this._pseudoSwitch()}
          <button
            type="button"
            class="icon-btn"
            aria-label=${Gn(1031)}
            title=${Gn(1031)}
            ?disabled=${!this._history.canUndo()}
            @click=${()=>this.undo()}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${Gn(702)}
            title=${Gn(702)}
            ?disabled=${!this._history.canRedo()}
            @click=${()=>this.redo()}
          >
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          ${n?s.qy`<button
                  type="button"
                  class="icon-btn insp-toggle"
                  aria-controls="inspector"
                  aria-expanded=${this._inspOpen?"true":"false"}
                  aria-label=${Gn(389)}
                  title=${Gn(389)}
                  @click=${()=>this._inspOpen=!this._inspOpen}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`:s.s6}
          <button
            type="button"
            class="btn btn-primary btn-sm save"
            ?disabled=${this._busy||!t&&!!this._saved}
            title=${Gn(762)}
            @click=${()=>this.save()}
          >
            <ha-icon icon=${this._busy?"mdi:progress-upload":"mdi:content-save-outline"}></ha-icon>${this._busy?Gn(768):Gn(761)}
          </button>
        </div>
      </header>
      <div
        @preview-change=${this._onPreviewChange}
        @layer-view-change=${this._onLayerView}
        @emitter-change=${this._onEmitter}
        style=${this._lipTokens()}
        class="workspace ${r.isHidden("layers")?"no-layers":""} ${r.isHidden("inspector")?"no-inspector":""} ${this._compact?"compact":""} ${this._width>0&&this._width<1e3?"dense":""} ${n?"slide":""} ${n&&this._inspOpen?"insp-open":""}"
      >
        ${this._renderLayers(e)}
        <div class="center ${i?"with-panel":""}" style="--split: ${this._split}">
          <mcas-stage
            dir=${this._pseudo?"rtl":s.s6}
            .doc=${this._previewDoc(o,a)}
            .layerView=${a}
            .hiddenLayers=${l}
            .stageParticles=${l?md(o):void 0}
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
            ${"path"===e.kind&&ks($s)?this._editorEl($s,e,{slot:"canvas",stageRect:this._stageRect,subjectRect:this._subjectRect}):s.s6}
            ${this._panels("stage-tool",e,{slot:"overlay",stageRect:this._stageRect,subjectRect:this._subjectRect})}
          </mcas-stage>
          ${i?s.qy`<div
                    class="splitter"
                    role="separator"
                    tabindex="0"
                    aria-orientation="horizontal"
                    aria-label=${Gn(867)}
                    aria-valuemin="15"
                    aria-valuemax="80"
                    aria-valuenow=${Math.round(100*this._split)}
                    title=${Gn(256)}
                    @pointerdown=${this._onSplitDown}
                    @pointermove=${this._onSplitMove}
                    @pointerup=${this._onSplitUp}
                    @pointercancel=${this._onSplitUp}
                    @keydown=${this._onSplitKey}
                    @dblclick=${()=>this._resetSplit()}
                  ></div>
                  ${this._renderKindSlot(e)}`:s.s6}
        </div>
        ${r.lip("inspector")}
        <aside class="inspector" id="inspector" tabindex="-1" ?inert=${r.isHidden("inspector")} data-lip=${r.state("inspector")} data-dir=${r.dir} aria-label=${Gn(390)}>
          ${this._renderInspector(e)}
        </aside>
        ${n&&this._inspOpen?s.qy`<div class="insp-scrim" @click=${()=>this._inspOpen=!1}></div>`:s.s6}
      </div>
    `}_renderDialog(){const e=this._dialog;if(!e)return s.s6;const t=()=>{this._dialog===e&&(this._dialog=void 0)};switch(e.type){case"delete":{const{doc:i,uses:n,sequences:r}=e,a=[];return void 0===n?a.push(Gn(125)):n&&a.push(Gn(391,{count:n})),r.length&&a.push(Gn(797,{names:r.map(e=>e.name).join(", ")})),fd({heading:Gn(221,{name:i.name}),variant:"alert",initialFocus:"dlg-safe",onClose:t},s.qy`<div class="dlg">${a.map(e=>s.qy`<p>${e}</p>`)}</div>`,s.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${Gn(116)}</button>
            <button type="button" class="btn btn-danger btn-sm confirm-delete" @click=${()=>this._delete(i)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${Gn(220)}
            </button>`)}case"discard":return fd({heading:Gn(765),variant:"alert",initialFocus:"dlg-safe",onClose:t},s.qy`<div class="dlg"><p>${Gn(0,{name:this._doc?.name||Gn(988)})}</p></div>`,s.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${Gn(393)}</button>
            <button
              type="button"
              class="btn btn-secondary btn-sm discard"
              @click=${()=>{this._dialog=void 0,xp(bp(this._saved?.id)),this._saved=this._doc??null,e.then()}}
            >
              ${Gn(241)}
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click=${async()=>{this._dialog=void 0,await this.save()&&e.then()}}
            >
              ${Gn(761)}
            </button>`);case"restore":return fd({heading:Gn(741),variant:"alert",initialFocus:"restore-draft",onClose:t},s.qy`<div class="dlg">
            <p>${e.isNew?Gn(959,{name:e.draft.name}):Gn(1,{name:e.draft.name})}</p>
          </div>`,s.qy`<button
              type="button"
              class="btn btn-secondary btn-sm discard-draft"
              @click=${()=>{this._dialog=void 0,xp(bp(e.isNew?void 0:e.draft.id))}}
            >
              ${Gn(241)}
            </button>
            <button type="button" class="btn btn-primary btn-sm restore-draft" id="restore-draft" @click=${()=>this._restoreDraft(e.draft,e.isNew)}>
              ${Gn(740)}
            </button>`);case"export":case"import":return fd({heading:"export"===e.type?Gn(314):Gn(383),size:"l",dismissible:!1,onClose:t},s.qy`<mc-transfer-panel
            host="animation-studio"
            .mode=${e.type}
            .exportItems=${"export"===e.type?{kind:"animation",items:e.items}:void 0}
            .taken=${(e,t)=>this._taken(t)}
            @mc-transfer-import=${e=>{this._onImport(e)}}
            @mc-transfer-close=${this._closeDialog}
          ></mc-transfer-panel>`);case"icon":return fd({heading:Gn(373),size:"l",onClose:t},s.qy`<div class="dlg">
            ${ks("mc-anim-icon-start")?s.qy`<mc-anim-icon-start class="icon-start" .hass=${this.hass} .lookup=${this._lookup} @icon-start=${e=>this._startIcon(e)}></mc-anim-icon-start>`:s.qy`<p class="help">${Gn(427)}</p>`}
          </div>`,s.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${Gn(116)}</button>`);case"presets":return fd({heading:Gn(208),size:"xl",initialFocus:"preset-search",onClose:t},s.qy`<div class="dlg">
            <p class="help">${Gn(971)}</p>
            <div class="with-icon">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                class="input preset-search"
                id="preset-search"
                type="search"
                placeholder=${Gn(776)}
                aria-label=${Gn(776)}
                .value=${D(this._presetQuery)}
                @input=${e=>this._presetQuery=e.target.value}
              />
            </div>
            <mc-preset-grid
              class="preset-list"
              .sources=${this._presetSources()}
              .query=${this._presetQuery}
              .hass=${this.hass}
              .lookup=${this._lookup}
              .notice=${this._catalogueFailed?Gn(448):""}
              @preset-pick=${e=>this._pickPreset(e)}
              @preset-clear-search=${()=>{this._clearPresetSearch()}}
            ></mc-preset-grid>
          </div>`,s.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${Gn(116)}</button>`)}}render(){if("ready"!==this._labels)return s.qy`<div class="shell" role="status">${"failed"===this._labels?"The studio texts (magic-card-i18n-labels.js) could not be loaded. Reload the page.":s.s6}</div>`;const e="editor"===this._view?this._doc:void 0;return s.qy`
      <div class="shell" data-view=${e?"editor":"library"}>${e?this._renderEditor(e):this._renderLibrary()}</div>
      ${this._renderDialog()}
      <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      ${this._lips.status()}
      ${this._status?s.qy`<div class="toast" aria-hidden="true">${this._status}</div>`:s.s6}
    `}}Kp.styles=[..._s,yd,vo],vp([(0,r.MZ)({attribute:!1})],Kp.prototype,"hass",void 0),vp([(0,r.MZ)({attribute:!1})],Kp.prototype,"library",void 0),vp([(0,r.MZ)({attribute:!1})],Kp.prototype,"selectedId",void 0),vp([(0,r.MZ)({attribute:!1})],Kp.prototype,"usage",void 0),vp([(0,r.MZ)({type:Boolean})],Kp.prototype,"standalone",void 0),vp([(0,r.wk)()],Kp.prototype,"_docs",void 0),vp([(0,r.wk)()],Kp.prototype,"_view",void 0),vp([(0,r.wk)()],Kp.prototype,"_query",void 0),vp([(0,r.wk)()],Kp.prototype,"_kind",void 0),vp([(0,r.wk)()],Kp.prototype,"_menu",void 0),vp([(0,r.wk)()],Kp.prototype,"_renaming",void 0),vp([(0,r.wk)()],Kp.prototype,"_dialog",void 0),vp([(0,r.wk)()],Kp.prototype,"_doc",void 0),vp([(0,r.wk)()],Kp.prototype,"_saved",void 0),vp([(0,r.wk)()],Kp.prototype,"_errors",void 0),vp([(0,r.wk)()],Kp.prototype,"_saveError",void 0),vp([(0,r.wk)()],Kp.prototype,"_busy",void 0),vp([(0,r.wk)()],Kp.prototype,"_status",void 0),vp([(0,r.wk)()],Kp.prototype,"_pseudo",void 0),vp([(0,r.wk)()],Kp.prototype,"_presetQuery",void 0),vp([(0,r.wk)()],Kp.prototype,"_catalogue",void 0),vp([(0,r.wk)()],Kp.prototype,"_catalogueFailed",void 0),vp([(0,r.wk)()],Kp.prototype,"_labels",void 0),vp([(0,r.wk)()],Kp.prototype,"_customRepeat",void 0),vp([(0,r.wk)()],Kp.prototype,"_selection",void 0),vp([(0,r.wk)()],Kp.prototype,"_tile",void 0),vp([(0,r.wk)()],Kp.prototype,"_split",void 0),vp([(0,r.wk)()],Kp.prototype,"_lipTop",void 0),vp([(0,r.wk)()],Kp.prototype,"_width",void 0),vp([(0,r.wk)()],Kp.prototype,"_height",void 0),vp([(0,r.wk)()],Kp.prototype,"_inspOpen",void 0),vp([(0,r.wk)()],Kp.prototype,"_collapsed",void 0),vp([(0,r.wk)()],Kp.prototype,"_time",void 0),vp([(0,r.wk)()],Kp.prototype,"_stageRect",void 0),vp([(0,r.wk)()],Kp.prototype,"_subjectRect",void 0),vp([(0,r.wk)()],Kp.prototype,"_stageInfo",void 0),vp([(0,r.wk)()],Kp.prototype,"_preview",void 0),vp([(0,r.wk)()],Kp.prototype,"_layerViews",void 0),vp([(0,r.wk)()],Kp.prototype,"_emitter",void 0),vp([(0,r.wk)()],Kp.prototype,"_playable",void 0);var Up=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class Gp extends s.WF{constructor(){super(...arguments),this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(!this._visible||!this.doc||!customElements.get("magic-card"))return void(this._card=void 0);const t=!this._card;if(t&&(this._card=document.createElement("magic-card")),t||e.has("doc")||e.has("lookup"))try{this._card.setConfig(gs(this.doc,this.lookup,{tile:"icon",thumb:!0,as:this.doc.id}))}catch{return void(this._card=void 0)}(t||e.has("hass"))&&(this._card.hass=this.hass??Xd(!1))}render(){const e=this.doc?ds[this.doc.kind]:"mdi:animation-outline";return s.qy`<div class="box" aria-hidden="true">
      ${this._card?s.qy`<div class="scale">${this._card}</div>`:s.qy`<ha-icon icon=${e}></ha-icon>`}
    </div>`}}Gp.styles=[vs,s.AH`
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
        left: 50%; /* physical */
        top: 50%;
        width: 176px;
        transform: translate(-50%, -50%) scale(0.5);
        pointer-events: none;
      }
      .scale magic-card {
        display: block;
        --ha-card-border-width: 0;
      }
    `],Up([(0,r.MZ)({attribute:!1})],Gp.prototype,"doc",void 0),Up([(0,r.MZ)({attribute:!1})],Gp.prototype,"lookup",void 0),Up([(0,r.MZ)({attribute:!1})],Gp.prototype,"hass",void 0),Up([(0,r.wk)()],Gp.prototype,"_visible",void 0);const Yp=(0,s.iz)(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),Jp=s.AH`.mc-tab-content{display:grid;gap:16px}.mc-field{display:grid;gap:6px;min-width:0}.mc-field-label,.mc-field>label,.mc-input-label{display:flex;align-items:center;gap:8px;min-height:24px;font-size:.8125rem;font-weight:500;color:var(--mc-text);text-transform:none;letter-spacing:normal}.mc-field-hint,.mc-mode-help{font-size:.75rem;font-style:normal;color:var(--mc-text-2)} ${Yp},.mc-input-field.mc-input-field{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font:inherit;font-size:.875rem;line-height:1.4;outline:none;box-shadow:none;transition:border-color .15s ease-out,box-shadow .15s ease-out}${Yp}::placeholder,.mc-input-field.mc-input-field::placeholder{color:var(--mc-text-2);opacity:1}${Yp}:hover,.mc-input-field.mc-input-field:hover{border-color:var(--mc-text-2)}${Yp}:focus,.mc-input-field.mc-input-field:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}${Yp}:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed}${Yp}.mono{font-family:var(--mc-mono);font-size:.8125rem} ${Yp}:is(select):not([multiple]):not([size]){appearance:none;-webkit-appearance:none;padding-right:36px;padding-inline:12px 36px;cursor:pointer}${Yp}:is(select):not(.input):not([multiple]):not([size]){background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:18px 18px}:host([dir='rtl']) ${Yp}:is(select):not(.input):not([multiple]):not([size]),[dir='rtl'] ${Yp}:is(select):not(.input):not([multiple]):not([size]){background-position:left 10px center} ${Yp}:is(textarea){resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem} .mc-section{display:grid;gap:16px}.mc-section + .mc-section{padding-top:20px;border-top:1px solid var(--mc-divider)}.mc-section-header{display:flex;align-items:center;gap:8px;margin:0;padding:0;border:0;font-size:.875rem;font-weight:500;color:var(--mc-text)} .mc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;filter:none;transform:none;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out;--mdc-icon-size:18px}.mc-btn-primary{background:var(--mc-accent-fill);border-color:transparent;color:var(--mc-on-accent)}.mc-btn-primary:hover{filter:none;box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.mc-btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.mc-btn-secondary{background:var(--mc-surface);border:1px solid var(--mc-field-border);color:var(--mc-text)}.mc-btn-secondary:hover{background:var(--mc-surface-2)}.mc-btn-small{min-height:32px;padding:0 12px;font-size:.8125rem}.mc-btn-icon{display:inline-grid;place-items:center;width:32px;height:32px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:18px}.mc-btn-icon:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):active{opacity:1;transform:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):disabled{opacity:.45;cursor:not-allowed;box-shadow:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px} .mc-conditions-list{display:grid;gap:12px;margin:0}.mc-condition-item{position:relative;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px} .mc-tabs-header{display:flex;width:100%;align-items:stretch;gap:2px;padding:3px;margin:0;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.mc-tab-button{flex:1 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);box-shadow:none;transition:background-color .15s ease-out,color .15s ease-out;--mdc-icon-size:18px}.mc-tab-button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.mc-tab-button.active,.mc-tab-button[aria-selected='true']{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.mc-tab-button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}`,Xp=s.AH`:host([dir='rtl']) .gl[data-dir='mirror']{transform:scaleX(-1)}:host .mono,:host textarea.mono,:host input.mono,:host code,:host pre{direction:ltr;unicode-bidi:isolate}`,Qp=[vs,bs,Jp,s.AH`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`,Xp];var eh=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const th=168,ih=140,nh=e=>14+e*ih,sh=e=>14+(1.5-e)/2*ih,rh=(e,t=nh,i=sh)=>`M${t(0)} ${i(0)} C${t(e[0])} ${i(e[1])} ${t(e[2])} ${i(e[3])} ${t(1)} ${i(1)}`,ah={"ease-in-out":387};let oh=class extends s.WF{constructor(){super(...arguments),this.inherited="ease",this.disabled=!1,this.label="",this._textError=""}willUpdate(e){e.has("value")&&(this._textError="")}get _bezier(){return this._drag?.bezier??Zr(this.value||this.inherited)}_emit(e,t=!1){this.dispatchEvent(new CustomEvent("easing-change",{bubbles:!0,composed:!0,detail:t?{value:e,transient:t}:{value:e}}))}_fromPointer(e){const t=this.renderRoot.querySelector(".plot").getBoundingClientRect(),i=t.width/th||1;return[((e.clientX-t.left)/i-14)/ih,1.5-((e.clientY-t.top)/i-14)/ih*2]}_down(e,t){if(this.disabled||0!==e.button)return;const i=this._bezier??[0,0,1,1];e.preventDefault(),e.currentTarget.focus(),e.currentTarget.setPointerCapture?.(e.pointerId),this._drag={handle:t,bezier:[...i]}}_move(e){if(!this._drag)return;const[t,i]=this._fromPointer(e),n=[...this._drag.bezier];n[2*this._drag.handle]=t,n[2*this._drag.handle+1]=i,this._drag={...this._drag,bezier:Ur(n)},this._emit(Gr(this._drag.bezier),!0)}_up(){if(!this._drag)return;const e=Gr(this._drag.bezier);this._drag=void 0,this._emit(e)}_key(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!i||this.disabled)return;e.preventDefault(),e.stopPropagation();const n=e.shiftKey?.1:.01,s=[...this._bezier??[0,0,1,1]];s[2*t]+=i[0]*n,s[2*t+1]+=i[1]*n,this._emit(Gr(Ur(s)))}_num(e,t){const i=Number(t),n=[...this._bezier??[0,0,1,1]];""!==t.trim()&&Number.isFinite(i)?(n[e]=i,this._emit(Gr(Ur(n)))):this.requestUpdate()}_text(e){const t=e.value.trim();if(!t)return void(this.value&&this._emit(void 0));if(t===(this.value??""))return;if(!ut(t))return void(this._textError=Gn(1048));this._textError="";const i=Zr(t);this._emit(i&&t.startsWith("cubic-bezier")?Gr(i):t)}render(){const e=this._bezier,t=this._drag?Gr(this._drag.bezier):this.value,i=Wr.map(e=>e.id),n=t?i.includes(t)?t:"custom":"",r=t?Zr(t)?`cubic-bezier(${Zr(t).join(",")})`:t:e?`cubic-bezier(${e.join(",")})`:"linear";return s.qy`
      <div class="presets" role="radiogroup" aria-label=${Gn(1202,{label:this.label||Gn(286)})}>
        ${[{id:"",label:Gn(214),bezier:Zr(this.inherited)},...Wr.map(e=>({...e,label:(0,K.t)(e.label)}))].map(e=>s.qy`<button
            type="button"
            class="preset"
            role="radio"
            data-easing=${e.id||"default"}
            aria-checked=${n===e.id?"true":"false"}
            title=${e.id?e.label:Gn(930,{easingLabel:oa(this.inherited).toLowerCase()})}
            ?disabled=${this.disabled}
            @click=${()=>this._emit(e.id||void 0)}
          >
            ${function(e){return s.qy`<svg class="glyph" viewBox="0 0 ${22} ${22}" aria-hidden="true">
    ${e?s.JW`<path d=${rh(e,e=>3+16*e,e=>19-16*e*.82-2)}></path>`:s.JW`<path d="M3 ${17} H${19}" stroke-dasharray="2 2.5"></path>`}
  </svg>`}(e.bezier)}<span>${void 0!==ah[e.id]?Gn(ah[e.id]):e.label}</span>
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
            <svg viewBox="0 0 ${th} ${th}" aria-hidden="true">
              <g class="grid">
                <rect x=${nh(0)} y=${sh(1)} width=${ih} height=${sh(0)-sh(1)} rx="2"></rect>
                ${[.25,.5,.75].map(e=>s.JW`<line x1=${nh(e)} x2=${nh(e)} y1=${sh(1)} y2=${sh(0)}></line><line x1=${nh(0)} x2=${nh(1)} y1=${sh(e)} y2=${sh(e)}></line>`)}
              </g>
              <path class="diag" d="M${nh(0)} ${sh(0)} L${nh(1)} ${sh(1)}"></path>
              ${e?s.JW`<line class="arm" x1=${nh(0)} y1=${sh(0)} x2=${nh(e[0])} y2=${sh(e[1])}></line>
                  <line class="arm" x1=${nh(1)} y1=${sh(1)} x2=${nh(e[2])} y2=${sh(e[3])}></line>
                  <path class="curve" d=${rh(e)}></path>`:s.s6}
              <circle class="end" cx=${nh(0)} cy=${sh(0)} r="3.5"></circle>
              <circle class="end" cx=${nh(1)} cy=${sh(1)} r="3.5"></circle>
            </svg>
            ${e?[0,1].map(t=>s.qy`<button
                    type="button"
                    class="knob ${this._drag?.handle===t?"dragging":""}"
                    data-handle=${t}
                    style="left: ${nh(e[2*t])/th*100}%; top: ${sh(e[2*t+1])/th*100}%"
                    role="slider"
                    aria-label=${Gn(0===t?877:300)}
                    aria-valuemin="-1"
                    aria-valuemax="2"
                    aria-valuenow=${e[2*t+1]}
                    aria-valuetext=${`x ${e[2*t]}, y ${e[2*t+1]}`}
                    ?disabled=${this.disabled}
                    @pointerdown=${e=>this._down(e,t)}
                    @keydown=${e=>this._key(e,t)}
                  ></button>`):s.qy`<p class="steps-note">${t?.startsWith("steps")?Gn(901):""}</p>`}
          </div>
          <div class="nums">
            ${["x1","y1","x2","y2"].map((t,i)=>s.qy`<div class="num">
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
              <label for="bz-text">${Gn(288)}</label>
              <input
                class="input mono"
                id="bz-text"
                type="text"
                spellcheck="false"
                autocomplete="off"
                placeholder=${Gn(215,{inherited:this.inherited})}
                aria-invalid=${this._textError?"true":"false"}
                aria-describedby=${this._textError?"bz-err":s.s6}
                .value=${t??""}
                ?disabled=${this.disabled}
                @change=${e=>this._text(e.target)}
                @keydown=${e=>"Enter"===e.key&&this._text(e.target)}
              />
              ${this._textError?s.qy`<p class="help error" id="bz-err">${this._textError}</p>`:s.s6}
            </div>
            <div class="preview" aria-hidden="true" style="--ease: ${r}"><i></i></div>
          </div>
        </div>
      </div>
    `}};oh.styles=[Qp,s.AH`
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
        text-align: start;
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
        grid-template-columns: ${th}px minmax(0, 1fr);
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
        width: ${th}px;
        aspect-ratio: 1;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
        border: 1px solid var(--mc-divider);
        direction: ltr; /* x is time, y is progress */
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
        direction: ltr; /* the run goes from start to end of time */
        overflow: hidden;
      }
      .preview i {
        position: absolute;
        top: 4px;
        left: 4px; /* physical */
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--mc-text-2);
        animation: mc-ease-run 1.6s var(--ease, ease) infinite alternate;
      }
      @keyframes mc-ease-run {
        to {
          left: calc(100% - 20px); /* physical */
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .preview i {
          animation: none;
        }
      }
    `],eh([(0,r.MZ)({type:String})],oh.prototype,"value",void 0),eh([(0,r.MZ)({type:String})],oh.prototype,"inherited",void 0),eh([(0,r.MZ)({type:Boolean})],oh.prototype,"disabled",void 0),eh([(0,r.MZ)({type:String})],oh.prototype,"label",void 0),eh([(0,r.wk)()],oh.prototype,"_drag",void 0),eh([(0,r.wk)()],oh.prototype,"_textError",void 0),oh=eh([(0,r.EM)("mc-anim-bezier-editor")],oh);var lh=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const ch=(e,t,i,n)=>e<t||e>i?Gn(518,{min:t,max:i,unit:n}):void 0,dh=(e,t)=>({...e,transform:{...e.transform??{},...t}}),ph=e=>void 0===e?void 0:Math.round(1e5*e)/1e3,hh=e=>{return t=e,Math.round(10*t)/10+"%";var t},uh={x:[{key:"x",label:1080,unit:"px",get:e=>e.transform?.x,set:(e,t)=>ch(t,-1e4,1e4,"px")??dh(e,{x:t})}],y:[{key:"y",label:1081,unit:"px",get:e=>e.transform?.y,set:(e,t)=>ch(t,-1e4,1e4,"px")??dh(e,{y:t})}],scale:[{key:"scale",label:769,unit:"%",get:e=>ph(e.transform?.scale),set:(e,t)=>ch(t,0,1e4,"%")??dh(e,{scale:t/100})}],scale_x:[{key:"scale_x",label:770,unit:"%",get:e=>ph(e.transform?.scale_x),set:(e,t)=>ch(t,-1e4,1e4,"%")??dh(e,{scale_x:t/100})}],scale_y:[{key:"scale_y",label:771,unit:"%",get:e=>ph(e.transform?.scale_y),set:(e,t)=>ch(t,-1e4,1e4,"%")??dh(e,{scale_y:t/100})}],rotate:[{key:"rotate",label:60,unit:"deg",get:e=>e.transform?.rotate,set:(e,t)=>ch(t,-36e3,36e3,"deg")??dh(e,{rotate:t})}],skew:[{key:"skew_x",label:830,unit:"deg",get:e=>e.transform?.skew_x??0,set:(e,t)=>ch(t,-89,89,"deg")??dh(e,{skew_x:t})},{key:"skew_y",label:831,unit:"deg",get:e=>e.transform?.skew_y??0,set:(e,t)=>ch(t,-89,89,"deg")??dh(e,{skew_y:t})}],opacity:[{key:"opacity",label:606,unit:"%",get:e=>ph(e.opacity),set:(e,t)=>ch(t,0,100,"%")??{...e,opacity:Math.round(10*t)/1e3}}],blur:[{key:"blur",label:96,unit:"px",get:e=>e.blur,set:(e,t)=>ch(t,0,200,"px")??{...e,blur:t}}],radius:[{key:"radius",label:699,unit:"px",get:e=>e.radius,set:(e,t)=>ch(t,0,1e3,"px")??{...e,radius:t}}],draw:[{key:"draw",label:269,unit:"%",get:e=>ph(e.draw),set:(e,t)=>ch(t,0,100,"%")??{...e,draw:Math.round(10*t)/1e3}}]},mh=[{id:"z",label:333},{id:"y",label:335,axis:[0,1,0]},{id:"x",label:334,axis:[1,0,0]}];let gh=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.entityColor="var(--primary-color, #03a9f4)",this._errors={}}willUpdate(e){e.has("doc")&&(this._draft=void 0),e.has("selection")&&(this._errors={})}get _view(){return this._draft??this.doc}get _keys(){const e=this._view;return e&&"keys"===this.selection?.kind?(this.selection.keys??[]).map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(t=>Hr(e,t)):[]}_emit(e,t,i=!1){this.disabled||(this._draft=i?e:void 0,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}})))}_select(e){const t=this._view?jr(this._view):"element",i=e.length?{kind:"keys",target:e[e.length-1].target,targets:[...new Set(e.map(e=>e.target))],keys:e.map(e=>({target:e.target,lane:e.lane,at:e.at,id:qr(e,t)}))}:{kind:"none"};this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:i}}))}_editTrack(e,t){const i=this.doc;return zr(i,e,t(Ar(i,e)))}_setFragment(e,t,i,n,s){this.doc&&this._emit(this._editTrack(e,e=>function(e,t,i,n){let s=!1;const r=e.map(e=>{if(e.at!==i||!Ds(e,t))return e;s=!0;const r=Bs(Is(e,t),n);return e.easings?{...r,easings:e.easings}:r});return s?r:er(ir(e,i,n))}(e,t,i,n)),s)}_ownEasing(e){const t=Ar(this._view,e.target);return"*"===e.lane?Js(t,e.at):Xs(t,e.lane,e.at)}_setEasing(e,t,i){if(!this.doc)return;let n=this.doc;for(const i of e){const e=Ar(n,i.target);n=zr(n,i.target,"*"===i.lane?ur(e,i.at,t):Qs(e,i.lane,i.at,t))}this._emit(n,"Change easing",i)}_delete(e){this.doc&&e.length&&(this._emit(Or(this.doc,e),"Delete "+(1===e.length?"keyframe":"keyframes")),this._select([]))}_copy(e){const t=this.doc?Pr(this.doc,e):void 0;t&&xr(t)}_moveTo(e,t){if(!this.doc)return;const i=Vr(this.doc,[e],t-e.at);this._emit(i.doc,"Move keyframe"),this._select(i.selection)}render(){const e=this._keys;return this._view&&e.length?(this._last=s.qy`<section class="insp" aria-label=${Gn(395)}>${e.length>1?this._renderMany(e):this._renderOne(e[0])}</section>`,this._last):"keys"===this.selection?.kind&&this.selection.keys?.length&&this._last?this._last:s.qy``}_easingEditor(e,t,i,n){return s.qy`<mc-anim-bezier-editor
      .value=${n}
      .inherited=${t}
      ?disabled=${this.disabled||i}
      @easing-change=${t=>this._setEasing(e,t.detail.value,!!t.detail.transient)}
    ></mc-anim-bezier-editor>`}_renderMany(e){const t=this._view,i=[...new Set(e.map(e=>e.at))].sort((e,t)=>e-t),n=[...new Set(e.map(e=>e.target))],r=new Set(e.map(e=>this._ownEasing(e)??"")),a=1===r.size&&[...r][0]||void 0,o=new Set(e.map(e=>e.lane)),l=n.length>1?Gn(1171,{count:n.length}):Mr(t,n[0]);return s.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon="mdi:selection-multiple"></ha-icon></span>
        <div class="insp-title">
          <b>${Gn(1157,{count:e.length})}</b>
          <span>${Gn(1262,{where:l,from:hh(i[0]),to:hh(i[i.length-1])})}</span>
        </div>
      </div>
      <p class="note">${Gn(249)}</p>
      <div class="foot-actions">
        <button type="button" class="btn btn-text btn-sm" data-act="copy" @click=${()=>this._copy(e)}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Gn(184)}
        </button>
        <button type="button" class="btn btn-text btn-sm danger-text" data-act="delete" @click=${()=>this._delete(e)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${Gn(1174,{count:e.length})}
        </button>
      </div>
      <div class="sub">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Gn(287)}</span></div>
        ${r.size>1?s.qy`<p class="note">${Gn(976)}</p>`:s.s6}
        ${o.size>1||!o.has("*")?s.qy`<p class="note">${Gn(697)}</p>`:s.s6}
        ${this._easingEditor(e,t.easing,!1,a)}
      </div>
    `}_renderOne(e){const t=this._view,i=Ar(t,e.target),n="*"===e.lane?Zs(i.filter(t=>t.at===e.at)):[e.lane],r="*"===e.lane?void 0:Hs[e.lane],a="*"===e.lane?[]:Zs(i.filter(t=>t.at===e.at)).filter(t=>t!==e.lane),o=Us(i,e.lane).every(t=>t<=e.at),l=(t.duration*e.at/100).toFixed(2),c=(t.tracks?.length??0)>0||e.target!==jr(t)?Mr(t,e.target):"";return s.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon=${r?.icon??Sr(e.target)}></ha-icon></span>
        <div class="insp-title">
          <b>${Gn(r?r.label:394)}</b>
          <span>${c?Gn(1259,{target:c,at:hh(e.at),secs:l}):Gn(76,{at:hh(e.at),secs:l})}</span>
        </div>
        <button
          type="button"
          class="icon-btn sm danger"
          data-act="delete"
          aria-label=${Gn(226)}
          title=${Gn(226)}
          @click=${()=>this._delete([e])}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-at">${Gn(683)}</label></div>
        <div class="at-field">
          <mc-unit-field
            inputId="kf-at"
            .label=${Gn(683)}
            .value=${`${e.at}%`}
            .units=${["%"]}
            noCustom
            ?disabled=${this.disabled}
            @value-changed=${t=>this._onAt(t,e)}
          ></mc-unit-field>
          <span class="secs">${l} s</span>
        </div>
        ${this._errors.at?s.qy`<p class="help error">${this._errors.at}</p>`:s.s6}
      </div>
      ${n.length?n.map(t=>this._renderLaneFields(e.target,t,e.at,"*"===e.lane)):s.qy`<p class="note">${Gn(996)}</p>`}
      ${a.length?s.qy`<div class="field">
              <div class="field-head"><span class="lbl">${Gn(51,{at:hh(e.at)})}</span></div>
              <div class="chips">
                ${a.map(t=>s.qy`<button type="button" class="chip" data-lane=${t} @click=${()=>this._select([{target:e.target,lane:t,at:e.at}])}>
                      <ha-icon icon=${Hs[t].icon}></ha-icon>${Vs(t)}
                    </button>`)}
                <button type="button" class="chip" data-lane="*" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                  <ha-icon icon="mdi:key-variant"></ha-icon>${Gn(1077)}
                </button>
              </div>
            </div>`:s.s6}
      ${this._renderEasing(e,i,o)}
    `}_renderEasing(e,t,i){const n=this._view,r=Js(t,e.at);if("*"===e.lane)return s.qy`<div class="sub" data-easing="keyframe">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Gn(287)}</span></div>
        ${i?s.qy`<p class="note">${Gn(995)}</p>`:s.s6}
        ${this._easingEditor([e],n.easing,i,r)}
      </div>`;const a=e.lane,o=Rs(a).filter(e=>e!==a),l=o.length?Qn(o.map(e=>Vs(e))):"";return s.qy`<div class="sub" data-easing="lane">
      <div class="sub-head">
        <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Gn(1199,{label:Vs(a)})}</span>
      </div>
      ${i?s.qy`<p class="note">${Gn(994)}</p>`:s.qy`<p class="note">
              ${Gn(r?605:604)}${l?` ${Gn(1214,{names:l})}`:""}
            </p>`}
      ${this._easingEditor([e],r??n.easing,i,Xs(t,a,e.at))}
      ${Ds(t.find(t=>t.at===e.at)??{at:0},a)?s.qy`<div class="ease-of">
              <button type="button" class="btn btn-text btn-sm" data-act="whole" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                <ha-icon icon="mdi:key-variant"></ha-icon>${Gn(289)}
              </button>
            </div>`:s.s6}
    </div>`}_onAt(e,t){e.stopPropagation();const i=parseFloat(String(e.detail.value));if(!Number.isFinite(i)||i<0||i>100)return this._errors={...this._errors,at:Gn(517)},void e.target.revert?.();this._errors={...this._errors,at:""},i!==t.at&&this._moveTo(t,Math.round(100*i)/100)}_renderLaneFields(e,t,i,n){const r=Hs[t],a=Ys(Ar(this._view,e),t,i),o=this._laneBody(e,t,i,a,n);return n?s.qy`<div class="sub" data-lane=${t}>
      <div class="sub-head">
        <ha-icon icon=${r.icon}></ha-icon><span class="grow">${Gn(r.label)}</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${Gn(722,{name:Gn(r.label).toLowerCase()})}
          title=${Gn(715)}
          @click=${()=>this._emit(this._editTrack(e,e=>cr(e,[{lane:t,at:i}])),`Remove ${t}`)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${o}
    </div>`:s.qy`<div class="fields" data-lane=${t}>${o}</div>`}_laneBody(e,t,i,n,r=!1){const a=uh[t];return a?s.qy`
        <div class="pair">${a.map(s=>this._numField(e,t,i,n,s,r&&1===a.length))}</div>
        ${"rotate"===t?this._axisField(e,i,n):s.s6}
      `:"color"===t||"background"===t||"stroke"===t?this._colorField(e,t,i,n):"shadow"===t?this._shadowField(e,i,n):this._filterField(e,i,n)}_numField(e,t,i,n,r,a=!1){const o=r.get(n),l=`kf-${t}-${r.key}`,c=this._errors[l];return s.qy`<div class="field">
      ${a?s.s6:s.qy`<div class="field-head"><label for=${l}>${Gn(r.label)}</label></div>`}
      <mc-unit-field
        .inputId=${l}
        .label=${Gn(r.label)}
        .value=${void 0===o?"":`${o}${r.unit}`}
        .units=${[r.unit]}
        noCustom
        ?disabled=${this.disabled}
        @value-changed=${n=>{n.stopPropagation();const s=n.target,a=parseFloat(String(n.detail.value));if(!Number.isFinite(a))return void s.revert?.();const o=r.set(Ys(Ar(this._view,e),t,i),a);if("string"==typeof o)return this._errors={...this._errors,[l]:o},void s.revert?.();this._errors={...this._errors,[l]:""},this._setFragment(e,t,i,o,`Change ${t}`)}}
      ></mc-unit-field>
      ${c?s.qy`<p class="help error">${c}</p>`:s.s6}
    </div>`}_axisField(e,t,i){const n=i.transform?.axis,r=n?mh.find(e=>e.axis&&e.axis.every((e,t)=>e===n[t]))?.id??"custom":"z";return s.qy`<div class="field">
      <div class="field-head"><label for="kf-axis">${Gn(1020)}</label></div>
      <div class="select">
        <select
          class="input"
          id="kf-axis"
          ?disabled=${this.disabled}
          @change=${i=>{const n=mh.find(e=>e.id===i.target.value);if(!n)return;const s={...Ys(Ar(this._view,e),"rotate",t).transform??{}};n.axis?s.axis=[...n.axis]:delete s.axis,this._setFragment(e,"rotate",t,{transform:s},"Change turn axis")}}
        >
          ${mh.map(e=>s.qy`<option value=${e.id} ?selected=${r===e.id}>${Gn(e.label)}</option>`)}
          ${"custom"===r?s.qy`<option value="custom" selected>${Gn(205,{axis:n.join(", ")})}</option>`:s.s6}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_colorField(e,t,i,n){const r=`kf-${t}`,a=n[t],o=Gn("color"===t?917:"stroke"===t?907:80),l="background"===t?"background":"color";return s.qy`<div class="field">
      <div class="field-head"><span class="lbl">${o}</span></div>
      <mc-color-picker
        .value=${Jr(a)}
        .label=${o}
        allowEntity
        .entityColor=${this.entityColor}
        @value-changed=${n=>{n.stopPropagation();let s=Xr(String(n.detail.value??""));if(!s){if(!Jr(a).startsWith("entity"))return;s="var(--primary-color)"}ia(s,l)?(this._errors={...this._errors,[r]:""},s!==a&&this._setFragment(e,t,i,{[t]:s},`Change ${o.toLowerCase()}`)):this._errors={...this._errors,[r]:Gn("color"===l?572:1047)}}}
      ></mc-color-picker>
      ${this._errors[r]?s.qy`<p class="help error">${this._errors[r]}</p>`:s.qy`<p class="help">${Gn(940)}</p>`}
    </div>`}_shadowField(e,t,i){const n=i.shadow??"",r=function(e){if(!e)return;const t=e.trim().match(/^(-?\d*\.?\d+)(?:px)?\s+(-?\d*\.?\d+)(?:px)?(?:\s+(\d*\.?\d+)(?:px)?)?(?:\s+(-?\d*\.?\d+)(?:px)?)?\s+(.+)$/);return t&&!/,(?![^(]*\))/.test(t[5])?{x:Number(t[1]),y:Number(t[2]),blur:Number(t[3]??0),spread:Number(t[4]??0),color:t[5].trim()}:void 0}(n),a=this._errors["kf-shadow"],o=i=>{ia(i,"shadow")?(this._errors={...this._errors,"kf-shadow":""},i!==n&&this._setFragment(e,"shadow",t,{shadow:i},"Change shadow")):this._errors={...this._errors,"kf-shadow":Gn(574)}},l=(e,t)=>s.qy`<div class="field">
        <div class="field-head"><label for=${`kf-sh-${e}`}>${t}</label></div>
        <mc-unit-field
          .inputId=${`kf-sh-${e}`}
          .label=${Gn(807,{name:t.toLowerCase()})}
          .value=${`${r[e]}px`}
          .units=${["px"]}
          noCustom
          compact
          @value-changed=${t=>{t.stopPropagation();const i=parseFloat(String(t.detail.value));if(!Number.isFinite(i)||"blur"===e&&i<0)return t.target.revert?.();o(Qr({...r,[e]:i}))}}
        ></mc-unit-field>
      </div>`;return s.qy`
      <div class="chips" role="group" aria-label=${Gn(806)}>
        ${ea.map(e=>s.qy`<button type="button" class="chip" aria-pressed=${n===e.value?"true":"false"} @click=${()=>o(e.value)}>${Gn(e.label)}</button>`)}
      </div>
      ${r?s.qy`<div class="quad">${l("x","X")} ${l("y","Y")} ${l("blur",Gn(96))} ${l("spread",Gn(863))}</div>
              <div class="field">
                <div class="field-head"><span class="lbl">${Gn(805)}</span></div>
                <mc-color-picker
                  .value=${Jr(r.color)}
                  .label=${Gn(805)}
                  allowEntity
                  .entityColor=${this.entityColor}
                  @value-changed=${e=>{e.stopPropagation();const t=Xr(String(e.detail.value??""))||"rgba(0, 0, 0, 0.3)";o(Qr({...r,color:t}))}}
                ></mc-color-picker>
              </div>`:s.qy`<div class="field">
              <div class="field-head"><label for="kf-shadow">${Gn(803)}</label></div>
              <input
                class="input mono"
                id="kf-shadow"
                type="text"
                spellcheck="false"
                .value=${n}
                @change=${e=>o(e.target.value.trim())}
              />
            </div>`}
      ${a?s.qy`<p class="help error">${a}</p>`:s.s6}
    `}_filterField(e,t,i){const n=i.filter??"",r=this._errors["kf-filter"],a=i=>{ia(i,"filter")?(this._errors={...this._errors,"kf-filter":""},i!==n&&this._setFragment(e,"filter",t,{filter:i},"Change filter")):this._errors={...this._errors,"kf-filter":Gn(1053)}};return s.qy`
      <div class="chips" role="group" aria-label=${Gn(325)}>
        ${ta.map(e=>s.qy`<button type="button" class="chip" aria-pressed=${n===e.value?"true":"false"} @click=${()=>a(e.value)}>${Gn(e.label)}</button>`)}
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-filter">${Gn(324)}</label></div>
        <input
          class="input mono"
          id="kf-filter"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-invalid=${r?"true":"false"}
          .value=${n}
          @change=${e=>a(e.target.value.trim())}
        />
        ${r?s.qy`<p class="help error">${r}</p>`:s.qy`<p class="help">${Gn(97)}</p>`}
      </div>
    `}};gh.styles=[Qp,s.AH`
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
    `],lh([(0,r.MZ)({attribute:!1})],gh.prototype,"doc",void 0),lh([(0,r.MZ)({attribute:!1})],gh.prototype,"hass",void 0),lh([(0,r.MZ)({attribute:!1})],gh.prototype,"library",void 0),lh([(0,r.MZ)({type:Number})],gh.prototype,"time",void 0),lh([(0,r.MZ)({type:Boolean,reflect:!0})],gh.prototype,"disabled",void 0),lh([(0,r.MZ)({attribute:!1})],gh.prototype,"selection",void 0),lh([(0,r.MZ)({attribute:!1})],gh.prototype,"tile",void 0),lh([(0,r.MZ)({attribute:!1})],gh.prototype,"stage",void 0),lh([(0,r.MZ)({type:String})],gh.prototype,"entityColor",void 0),lh([(0,r.wk)()],gh.prototype,"_errors",void 0),lh([(0,r.wk)()],gh.prototype,"_draft",void 0),gh=lh([(0,r.EM)("mc-anim-key-inspector")],gh),js({tag:"mc-anim-key-inspector",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"keys"===t.kind&&!!t.keys?.length,title:394,order:0});var fh=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const vh=e=>Math.round(10*e)/10,bh=e=>`${vh(e)}%`;let yh=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.onionSkin=!1,this.layout="auto",this.entityColor="var(--primary-color, #03a9f4)",this._keys=[],this._width=0,this._viewW=0,this._menuOpen=!1,this._status="",this._zoom=1,this._unit="pct",this._snap=!0,this._grid="pct1",this._collapsed=new Set,this._laneFocus=new Map,this._selFrame=0,this._menuClosedAt=0,this._onTouchMove=e=>{"band"===this._drag?.kind&&"touch"===this._drag.pointerType&&e.preventDefault()},this._pxCache=0,this._onPointerMove=e=>{const t=this._hold;t&&e.pointerId===t.pointerId&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._cancelHold();const i=this._drag;if(!i||e.pointerId!==i.pointerId)return;if("seek"===i.kind)return void this._seek(this._atFromX(e.clientX));if("band"===i.kind){const t=this.renderRoot.querySelector(".lanes").getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top;if(!i.moved&&Math.hypot(n-i.x0,s-i.y0)<3)return;i.moved=!0,this._band={x0:i.x0,y0:i.y0,x1:n,y1:s};const r=this._main,a=i.baseSel??[];return void this._select([...a,...this._keysInBand(i.centres).filter(e=>!a.some(t=>qr(t,r)===qr(e,r)))],!0)}const n=e.clientX-i.x0;if(!i.moved&&Math.abs(n)<3)return;i.moved=!0;const s=this._pxCache||this._pxPerPct(),r=this._snapAt(i.grab.at+n/s,e.shiftKey,i.duplicate?[]:i.sel,i.snaps,s);if(i.lastTarget===r)return;i.lastTarget=r;const a=Vr(i.base,i.sel,r-i.grab.at,i.duplicate),o=i.sel.length;i.label=i.duplicate?Gn(279,{count:o}):Gn(483,{count:o}),this._draft=a.doc,this._select(a.selection,!0);const l=a.selection[i.sel.findIndex(e=>qr(e,this._main)===qr(i.grab,this._main))];l&&this._laneFocus.set(`${l.target}|${l.lane}`,l.at),(a.doc!==i.base||i.emitted)&&(i.emitted=!0,this._emit(this._draft,i.label,!0),this._selFrame||(this._selFrame=requestAnimationFrame(()=>{this._selFrame=0,"keys"===this._drag?.kind&&this._emitSelection()})))},this._onPointerUp=e=>{const t=this._hold;if(t&&e.pointerId===t.pointerId)return this._cancelHold(),void("pointerup"!==e.type||t.additive||(this._lastTarget=t.target,this._select([])));const i=this._drag;if(i&&e.pointerId===i.pointerId){if(this._drag=void 0,this._pxCache=0,cancelAnimationFrame(this._selFrame),this._selFrame=0,"band"===i.kind)return this._band=void 0,void(i.moved||i.additive?this._emitSelection():(i.target&&(this._lastTarget=i.target),this._select([])));if("keys"===i.kind){if(i.moved&&this._draft&&i.emitted){const e=this._draft,t=this._keys.find(e=>e.target===i.grab.target&&e.lane===i.grab.lane);return t&&(this._pendingFocus=qr(t,this._main)),this._emit(e,i.label??Gn(467)),this._emitSelection(),this._draft=e,void(this.doc===e&&(this._draft=void 0))}this._draft=void 0,!i.additive&&i.wasSelected&&this._select([i.clickKey])}}},this._onWheel=e=>{!e.ctrlKey&&!e.metaKey||this._narrow||(e.preventDefault(),this._setZoom(this._zoom*Math.exp(.002*-e.deltaY),e.clientX))}}get onion(){const e=Us(this._kfsOf(this._active),"*"),t=100*this.time;return{prev:[...e].reverse().find(e=>e<t-.001),next:e.find(e=>e>t+.001)}}get selection(){return this._keys.map(e=>qr(e,this._main))}set selection(e){this._select(e.map(e=>Er(e,this._main)))}get zoom(){return this._zoom}set zoom(e){this._zoom=Dr(e)}connectedCallback(){var e;super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0);t&&t!==this._width&&(this._width=t)}),this._ro.observe(this)),this._unsubClip=(e=()=>this.requestUpdate(),br.add(e),()=>br.delete(e)),this.addEventListener("touchmove",this._onTouchMove,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._bodyRo?.disconnect(),this._bodyRo=void 0,this._unsubClip?.(),this.removeEventListener("touchmove",this._onTouchMove),this._cancelHold(),cancelAnimationFrame(this._selFrame)}get _view(){return this._draft??this.doc}get _main(){return this._view?jr(this._view):"element"}_kfsOf(e){return this._view?Ar(this._view,e):[]}get _narrow(){return"narrow"===this.layout||"auto"===this.layout&&this._width>0&&this._width<480}get _active(){const e=this.studioSelection;return(!e||"target"!==e.kind&&"keys"!==e.kind?void 0:e.target)??this._keys[this._keys.length-1]?.target??this._lastTarget??this._main}_groups(){const e=this._view;if(!e)return[];const t=Cr(e),i=this.studioSelection,n=new Set([...i?.targets??[],...i?.target?[i.target]:[],...this._keys.map(e=>e.target)]),s=t.filter(e=>e.main||e.keyframes.length||n.has(e.target));for(const e of n)s.some(t=>t.target===e)||s.push({target:e,keyframes:[],main:!1});return s}_rows(){const e=[];for(const t of this._groups())if(e.push({target:t.target,lane:"*"}),!this._narrow&&!this._collapsed.has(t.target))for(const i of Zs(t.keyframes))e.push({target:t.target,lane:i});return e}willUpdate(e){if(e.has("doc")){this._drag||(this._draft=void 0);const e=this._view,t=e?this._keys.filter(t=>Hr(e,t)):[];t.length!==this._keys.length&&this._select(t)}e.has("studioSelection")&&this._adopt()}_adopt(){const e=this.studioSelection,t=this._view;if(e&&t)if("keys"===e.kind&&e.keys){const i=e.keys.map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(e=>Hr(t,e)),n=this._main;i.map(e=>qr(e,n)).join()!==this.selection.join()&&(this._keys=i)}else this._keys.length&&(this._keys=[])}updated(){const e=this._menuOpen?this.renderRoot.querySelector("mc-ui-menu.add-menu"):null;if(e&&!e.open&&(e.anchor=this.renderRoot.querySelector(".add-btn")??void 0,e.show()),this._pendingFocus){const e=this.renderRoot.querySelector(`.key[data-key="${CSS.escape(this._pendingFocus)}"]`);this._pendingFocus=void 0,e?.focus()}const t=this.renderRoot.querySelector(".tl-body");if(t&&!this._bodyRo&&"undefined"!=typeof ResizeObserver&&(this._bodyRo=new ResizeObserver(()=>{const e=this.renderRoot.querySelector(".tl-body")?.clientWidth??0;e&&e!==this._viewW&&(this._viewW=e)}),this._bodyRo.observe(t)),this._zoomAnchor&&t){const{at:e,clientX:i}=this._zoomAnchor;this._zoomAnchor=void 0;const n=this._trackRect();n&&(t.scrollLeft+=n.left+12+e/100*(n.width-24)-i)}}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e,t=!1){const i=this._main,n=new Set,s=e.filter(e=>{const t=qr(e,i);return!n.has(t)&&(n.add(t),!0)}),r=s.map(e=>qr(e,i)).join()!==this.selection.join();this._keys=s,s.length&&(this._lastTarget=s[s.length-1].target),r&&!t&&this._emitSelection()}_emitSelection(){const e=this._main,t=this._keys,i=[...new Set(t.map(e=>e.target))],n=t.length?{kind:"keys",target:t[t.length-1].target,targets:i,keys:t.map(t=>({target:t.target,lane:t.lane,at:t.at,id:qr(t,e)}))}:{kind:"none"};!t.length&&this.studioSelection&&"keys"!==this.studioSelection.kind||this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:n}}))}_isLocked(e){const t=this.layerView,i=this.doc;return!(!i||!t?.locked.length)&&("*"!==e.lane?co(i,t,`lane:${e.target}|${e.lane}`):co(i,t,/^(part|group|shape):/.test(e.target)?e.target:`target:${e.target}`)||io(i,e.target).some(n=>co(i,t,`lane:${e.target}|${n}`)))}_refuseLocked(e){const t=e.find(e=>this._isLocked(e));if(!t||!this._view)return!1;const i=Mr(this._view,t.target);return this._announce(Gn(1221,{name:"*"===t.lane?i:`${i} ${Hs[t.lane]?Vs(t.lane).toLowerCase():t.lane}`})),!0}_commit(e,t,i){this.doc&&!this.disabled&&(this._emit(e,t),i&&this._select(i))}_seek(e){const t=Math.min(1,Math.max(0,e/100));this.dispatchEvent(new CustomEvent("seek",{bubbles:!0,composed:!0,detail:{time:t}}))}_announce(e){this._status="",this.updateComplete.then(()=>this._status=e)}_isSel(e){return this._keys.some(t=>t.target===e.target&&t.lane===e.lane&&t.at===e.at)}_trackRect(){return this.renderRoot.querySelector(".track, .ruler-track")?.getBoundingClientRect()}_atFromX(e){const t=this._trackRect();return!t||t.width<=24?0:(e-t.left-12)/(t.width-24)*100}_pxPerPct(){const e=this._trackRect();return e&&e.width>24?(e.width-24)/100:6}_snapTargets(e=[]){const t=this._main,i=new Set(e.map(e=>qr(e,t))),n=new Set([100*this.time]);for(const e of this._groups())for(const s of["*",...Zs(e.keyframes)])for(const r of Us(e.keyframes,s))i.has(qr({target:e.target,lane:s,at:r},t))||n.add(r);return[...n]}_snapAt(e,t,i=[],n=this._snapTargets(i),s=this._pxPerPct()){return function(e,t){const i=e=>Math.min(100,Math.max(0,e));if(t.free)return i(Math.round(10*e)/10);let n;for(const i of t.targets??[])Math.abs(i-e)<=(t.threshold??0)&&(void 0===n||Math.abs(i-e)<Math.abs(n-e))&&(n=i);if(void 0!==n)return i(n);const s=function(e,t){const i=t>0?t:1;switch(e){case"pct5":return 5;case"s01":return.1/i*100;case"fps30":return 1/30/i*100;default:return 1}}(t.grid,t.duration);return i(Math.round(Math.round(e/s)*s*100)/100)}(e,{free:t||!this._snap,grid:this._grid,duration:this._view?.duration??1,targets:n,threshold:6/s})}_range(e,t){const i=this._rows(),n=i.findIndex(t=>t.target===e.target&&t.lane===e.lane),s=i.findIndex(e=>e.target===t.target&&e.lane===t.lane);if(n<0||s<0)return[t];const[r,a]=[Math.min(e.at,t.at),Math.max(e.at,t.at)],o=[];for(const e of i.slice(Math.min(n,s),Math.max(n,s)+1))for(const t of Us(this._kfsOf(e.target),e.lane))t>=r&&t<=a&&o.push({target:e.target,lane:e.lane,at:t});return o}_onKeyDown(e,t){if(this.disabled||0!==e.button||!this.doc)return;e.preventDefault(),e.stopPropagation(),e.currentTarget.focus();const i=this._isSel(t),n=e.ctrlKey||e.metaKey;if(e.shiftKey&&this._anchor)this._select(n?[...this._keys,...this._range(this._anchor,t)]:this._range(this._anchor,t));else if(n){if(this._select(i?this._keys.filter(e=>qr(e,this._main)!==qr(t,this._main)):[...this._keys,t]),i)return}else i||this._select([t]),this._anchor=t;this._laneFocus.set(`${t.target}|${t.lane}`,t.at),this._refuseLocked(this._keys)||(this._drag={kind:"keys",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1,base:this.doc,grab:t,sel:[...this._keys],duplicate:e.altKey,clickKey:t,wasSelected:i,additive:e.shiftKey||n,snaps:this._snapTargets(e.altKey?[]:this._keys)},this._pxCache=this._pxPerPct(),this._capture(e))}_cancelHold(){this._hold&&clearTimeout(this._hold.timer),this._hold=void 0}_onTrackDown(e,t){if(this.disabled||0!==e.button)return;const i=e.shiftKey||e.ctrlKey||e.metaKey;if("touch"===e.pointerType){this._cancelHold();const{pointerId:n,clientX:s,clientY:r}=e;return void(this._hold={pointerId:n,x:s,y:r,target:t,additive:i,timer:setTimeout(()=>{this._hold=void 0,this._startBand(n,s,r,t,i,"touch")},400)})}this._startBand(e.pointerId,e.clientX,e.clientY,t,i,e.pointerType)}_startBand(e,t,i,n,s,r){const a=this.renderRoot.querySelector(".lanes");if(!a)return;const o=a.getBoundingClientRect(),l=this._main,c=[...this.renderRoot.querySelectorAll(".lanes .key")].map(e=>{const t=e.getBoundingClientRect();return{key:Er(e.dataset.key,l),x:t.left+t.width/2-o.left,y:t.top+t.height/2-o.top}});this._drag={kind:"band",pointerId:e,x0:t-o.left,y0:i-o.top,moved:!1,baseSel:s?[...this._keys]:[],additive:s,target:n,pointerType:r,centres:c};try{a.setPointerCapture?.(e)}catch{}}_capture(e){const t=this.renderRoot.querySelector(".lanes");try{(t??e.currentTarget).setPointerCapture?.(e.pointerId)}catch{}}_keysInBand(e=[]){const t=this._band;if(!t)return[];const[i,n]=[Math.min(t.x0,t.x1),Math.max(t.x0,t.x1)],[s,r]=[Math.min(t.y0,t.y1),Math.max(t.y0,t.y1)];return e.filter(e=>e.x>=i&&e.x<=n&&e.y>=s&&e.y<=r).map(e=>e.key)}_onRulerDown(e){if(0===e.button){e.preventDefault(),this._drag={kind:"seek",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}this._seek(this._atFromX(e.clientX))}}_onRulerKey(e){const t=100*this.time,i=e.shiftKey?10:1,n={ArrowLeft:t-i,ArrowDown:t-i,ArrowRight:t+i,ArrowUp:t+i,Home:0,End:100,PageUp:t+10,PageDown:t-10};e.key in n&&(e.preventDefault(),this._seek(vh(n[e.key])))}_jump(e){const t=this.onion,i=e<0?t.prev:t.next;void 0!==i&&this._seek(i)}_setZoom(e,t){const i=Dr(e);if(i===this._zoom)return;const n=this._trackRect(),s=void 0!==t?this._atFromX(t):100*this.time,r=t??(n?n.left+12+s/100*(n.width-24):0);this._zoomAnchor={at:s,clientX:r},this._zoom=i}_onKeyKeydown(e,t){if(this.disabled||!this._view)return;const i=e.ctrlKey||e.metaKey,n=this._main;if(!("ArrowLeft"!==e.key&&"ArrowRight"!==e.key||e.altKey||i)){e.preventDefault(),this._isSel(t)||this._select([t]);const i=this._keys;if(this._refuseLocked(i))return;const s=Vr(this._view,i,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?10:1));if(s.doc===this._view)return;const r=i.findIndex(e=>qr(e,n)===qr(t,n)),a=s.selection[r]??s.selection[0];return a&&(this._pendingFocus=qr(a,n),this._laneFocus.set(`${a.target}|${a.lane}`,a.at)),void this._commit(s.doc,"Move "+(1===i.length?"keyframe":"keyframes"),s.selection)}if("ArrowLeft"===e.key||"ArrowRight"===e.key||"Home"===e.key||"End"===e.key){e.preventDefault();const i=Us(this._kfsOf(t.target),t.lane),n=i.indexOf(t.at),s="Home"===e.key?0:"End"===e.key?i.length-1:n+("ArrowLeft"===e.key?-1:1);return void(s>=0&&s<i.length&&this._focusKey({target:t.target,lane:t.lane,at:i[s]},e.shiftKey))}if("ArrowUp"===e.key||"ArrowDown"===e.key){e.preventDefault();const i=this._rows(),n=i.findIndex(e=>e.target===t.target&&e.lane===t.lane)+("ArrowUp"===e.key?-1:1);if(n<0||n>=i.length)return;const s=Us(this._kfsOf(i[n].target),i[n].lane),r=s.reduce((e,i)=>Math.abs(i-t.at)<Math.abs(e-t.at)?i:e,s[0]);return void(void 0!==r&&this._focusKey({...i[n],at:r},e.shiftKey))}if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),this._isSel(t)||this._select([t]),void this._delete();if(" "===e.key||"Enter"===e.key){e.preventDefault();const s=e.shiftKey||i;this._select(s?this._isSel(t)?this._keys.filter(e=>qr(e,n)!==qr(t,n)):[...this._keys,t]:[t]),s||(this._anchor=t)}}_onTimelineKeydown(e){if(this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.composedPath()[0]?.tagName;if("INPUT"===i||"TEXTAREA"===i||"SELECT"===i)return;const n=e.key.toLowerCase();if(t&&"c"===n)e.preventDefault(),this._copy();else if(t&&"v"===n)e.preventDefault(),this._paste();else if(t&&"a"===n){e.preventDefault();const t=[];for(const e of this._rows())for(const i of Us(this._kfsOf(e.target),e.lane))this._narrow&&"*"!==e.lane||t.push({...e,at:i});this._select(t)}else!t||"="!==n&&"+"!==n&&"-"!==n?"Escape"===e.key&&this._keys.length&&(e.preventDefault(),e.stopPropagation(),this._select([])):(e.preventDefault(),this._setZoom(Tr(this._zoom,"-"===n?-1:1)))}_focusKey(e,t=!1){this._select(t&&!this._isSel(e)?[...this._keys,e]:t?this._keys:[e]),t||(this._anchor=e),this._laneFocus.set(`${e.target}|${e.lane}`,e.at),this._pendingFocus=qr(e,this._main),this.requestUpdate()}_add(e,t,i){const n=this._view;if(!this.doc||!n||this.disabled)return;if(this._refuseLocked([{target:e,lane:t}]))return;const s=vh(Math.min(100,Math.max(0,i))),r=Ar(n,e),a="*"===t?function(e,t,i){const n=tr(t);let s=e;for(const t of Zs(e))s=ir(s,n,hr(e,t,n,i));return e.some(e=>e.at===n)||s!==e||(s=[...e,{at:n}]),{keyframes:er(s),selection:[{lane:"*",at:n}]}}(r,s,n.easing):function(e,t,i,n){const s=tr(i),r=hr(e,t,s,n)??Hs[t].def;return{keyframes:er(ir(e,s,r)),selection:[{lane:t,at:s}]}}(r,t,s,n.easing),o=a.selection.map(t=>({...t,target:e}));this._pendingFocus=qr(o[0],this._main),this._laneFocus.set(`${e}|${t}`,o[0].at),this._anchor=o[0],this._collapsed.delete(e),this._commit(zr(n,e,a.keyframes),"*"===t?Gn(29):Gn(40,{lane:Vs(t).toLowerCase()}),o)}_onTrackDblClick(e,t,i){e.target.closest(".key")||this._add(t,i,this._snapAt(this._atFromX(e.clientX),e.shiftKey))}_addLane(e){this._menuOpen=!1,this._add(this._active,e,100*this.time)}_delete(){const e=this._keys.length,t=this._view;e&&t&&!this._refuseLocked(this._keys)&&(this._commit(Or(t,this._keys),"Delete "+(1===e?"keyframe":"keyframes"),[]),this._announce(Gn(1159,{count:e})))}_copy(){const e=this._view,t=e?Pr(e,this._keys):void 0;t&&(xr(t),this._announce(Gn(1158,{count:t.items.length})))}_paste(){const e=yr(),t=this._view;if(!e||!t||!this.doc)return;const i=new Set(e.items.map(e=>e.target??this._main)),n=1===new Set(this._keys.map(e=>`${e.target}|${e.lane}`)).size&&"*"!==this._keys[0].lane?this._keys[0]:void 0,s=i.size>1?{}:n?{target:n.target,lane:n.lane}:{target:this._active},r=function(e,t,i,n={}){const s=jr(e),r=new Set(t.items.map(e=>e.lane)),a=!n.lane||1!==r.size||r.has("*")||r.has(n.lane)?void 0:{from:[...r][0],to:n.lane},o=new Map;let l=0;for(const e of t.items){const t=n.target??e.target??s;let i=e;if(a){const t=$r(a.from,a.to,e.frag);if(!t){l++;continue}i={...e,lane:a.to,frag:t,easings:e.easings?.[a.from]?{[a.to]:e.easings[a.from]}:void 0}}if("*"!==i.lane&&!Os(t).some(e=>e.id===i.lane)){l++;continue}if("*"===i.lane&&!Ls(t)&&(void 0!==i.frag.draw||void 0!==i.frag.stroke)){const e={...i.frag};delete e.draw,delete e.stroke,i={...i,frag:e}}const r=o.get(t)??[];r.push(i),o.set(t,r)}let c=e;const d=[];for(const[e,t]of o){const n=fr(Ar(c,e),{items:t},i);c=zr(c,e,n.keyframes),d.push(...n.selection.map(t=>({...t,target:e})))}return{doc:c,selection:d,skipped:l}}(t,e,vh(100*this.time),s);if(!r.selection.length)return void this._announce(Gn(590));if(this._refuseLocked(r.selection))return;this._commit(r.doc,"Paste "+(1===r.selection.length?"keyframe":"keyframes"),r.selection);const a=r.skipped?Gn(13,{skipped:r.skipped}):"";this._announce(Gn(1160,{count:r.selection.length,at:bh(100*this.time),skipped:a}))}_selectLane(e,t,i){const n=Us(this._kfsOf(e),t).map(i=>({target:e,lane:t,at:i}));this._lastTarget=e,this._select(i?[...this._keys.filter(i=>!(i.target===e&&i.lane===t)),...n]:n)}_toggleGroup(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t}render(){if(!this._view)return s.qy``;const e=this._narrow;return s.qy`
      <div class="shell" @keydown=${this._onTimelineKeydown}>
        ${this._renderBar(e)} ${e?this._renderNarrow():this._renderTimeline()}
        <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      </div>
    `}_renderAddMenu(e,t,i){const n=e.map((t,i)=>({id:t.id,label:Gn(t.label),icon:t.icon,separatorBefore:i>0&&e[i-1].group!==t.group}));return s.qy`<mc-ui-menu
      class="add-menu"
      .items=${n}
      label=${Gn(33,{target:Mr(this._view,t),at:bh(i)})}
      @mc-menu-pick=${e=>{e.stopPropagation(),this._addLane(e.detail.id)}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menuOpen=!1}}
    ></mc-ui-menu>`}_renderBar(e){const t=100*this.time,i=(this._view.duration*this.time).toFixed(2),n=this.onion,r=this._active,a=new Set(Zs(this._kfsOf(r))),o=Os(r).filter(e=>!a.has(e.id)),l=yr();return s.qy`
      <div class="bar">
        <div class="readout" role="group" aria-label=${Gn(672)}>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${Gn(695)}
            title=${Gn(695)}
            ?disabled=${void 0===n.prev}
            @click=${()=>this._jump(-1)}
          >
            <ha-icon icon="mdi:skip-previous"></ha-icon>
          </button>
          <span class="now">${bh(t)} <small>${i} s</small></span>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${Gn(545)}
            title=${Gn(545)}
            ?disabled=${void 0===n.next}
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
          title=${Gn(23,{target:Mr(this._view,r)})}
          ?disabled=${this.disabled||!o.length}
          @click=${()=>{this._menuOpen?this._menuOpen=!1:Date.now()-this._menuClosedAt>400&&(this._menuOpen=!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon><span class="lbl">${Gn(e?696:32)}</span>
        </button>
        ${this._menuOpen?this._renderAddMenu(o,r,t):s.s6}
        <span class="spacer"></span>
        <div class="tools" role="toolbar" aria-label=${Gn(397)}>
          <button
            type="button"
            class="icon-btn sm"
            data-act="copy"
            aria-label=${Gn(188)}
            title=${Gn(185)}
            ?disabled=${!this._keys.length}
            @click=${this._copy}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            data-act="paste"
            aria-label=${Gn(640)}
            title=${l?Gn(639,{target:Mr(this._view,r)}):Gn(189)}
            ?disabled=${!l||this.disabled}
            @click=${this._paste}
          >
            <ha-icon icon="mdi:content-paste"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            data-act="delete"
            aria-label=${Gn(227)}
            title=${Gn(222)}
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
            aria-label=${Gn(600)}
            title=${Gn(601)}
            @click=${()=>this.onionSkin=!this.onionSkin}
          >
            <ha-icon icon="mdi:layers-triple-outline"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderRuler(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=this._narrow,n=this._pxPerPct(),r=function(e,t,i){const n=t>0?t:1,s=64/(e>0?e:6),r=e=>String(Math.round(1e3*e)/1e3);let a,o;"s"===i?(a=Br(s/100*n)/n*100,o=e=>`${r(e/100*n)} s`):(a=Math.min(50,Br(s)),o=e=>`${r(e)}%`);const l=Math.abs(a/Br(a/5)-5)<.01?5:4,c=a/l,d=[],p=[];for(let e=0;e*c<=100.000001&&e<2e3;e++){const t=Math.round(e*c*1e3)/1e3;e%l===0?d.push(t):p.push(t)}return{major:d,minor:p,label:o}}(i?Math.min(n,2.5):n,this._view.duration,this._unit),a=r.major.filter(t=>Math.abs(t-100*e)*n>34);return s.qy`
      <div class="ruler">
        <div class="ruler-head">${i?"":"s"===this._unit?Gn(779):Gn(212)}</div>
        <div
          class="ruler-track"
          role="slider"
          tabindex="0"
          aria-label=${Gn(672)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${vh(100*e)}
          aria-valuetext=${Gn(1246,{pct:bh(100*e),seconds:(this._view.duration*e).toFixed(2)})}
          @pointerdown=${this._onRulerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @keydown=${this._onRulerKey}
        >
          ${r.minor.map(e=>s.qy`<i class="tick" style="--at: ${e/100}"></i>`)}
          ${r.major.map(e=>s.qy`<i class="tick major" style="--at: ${e/100}"></i>`)}
          ${a.map(e=>s.qy`<span class="tick-label ${0===e?"first":e>=99.999?"last":""}" style="--at: ${e/100}">${r.label(e)}</span>`)}
          ${void 0!==t.prev?s.qy`<i class="ghost" style="--at: ${t.prev/100}"></i>`:s.s6}
          ${void 0!==t.next?s.qy`<i class="ghost" style="--at: ${t.next/100}"></i>`:s.s6}
          <span class="ph-tag" style="--t: ${e}">${"s"===this._unit?`${(this._view.duration*e).toFixed(2)} s`:bh(100*e)}</span>
        </div>
      </div>
    `}_overlays(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=t.prev??(void 0!==t.next?100*e:void 0),n=t.next??(void 0!==t.prev?100*e:void 0);return s.qy`
      ${this.onionSkin&&void 0!==i&&void 0!==n?s.qy`<div class="onion-band" style="--a: ${i/100}; --b: ${n/100}" aria-hidden="true"></div>`:s.s6}
      <div class="ph-line" style="--t: ${e}" aria-hidden="true"></div>
    `}_laneTab(e,t,i){const n=this._laneFocus.get(`${e}|${t}`);return void 0!==n&&i.includes(n)?n:this._keys.find(n=>n.target===e&&n.lane===t&&i.includes(n.at))?.at??i[0]}_renderKeys(e,t,i){const n=e.keyframes,r=e.target,a=this._main,o=this._laneTab(r,t,i),l=this.onionSkin&&r===this._active?this.onion:{},c=r===a&&1===this._groups().length?"":`${Mr(this._view,r)} `,d="*"===t?c?Gn(1257,{target:c.trim()}):Gn(1111):c?Gn(1258,{target:c.trim(),lane:Vs(t).toLowerCase()}):Gn(1205,{lane:Vs(t).toLowerCase()}),p=d.charAt(0).toUpperCase()+d.slice(1),h=i.slice(0,-1).map((e,a)=>{const o=i[a+1],l=this._isSel({target:r,lane:t,at:e})&&this._isSel({target:r,lane:t,at:o});if("*"!==t)return s.qy`<i class="span ${l?"sel":""} ${Xs(n,t,e)?"own":""}" style="--a: ${e/100}; --b: ${o/100}"></i>`;const c=Zr(Js(n,e)??this._view.easing),d=c?`M0 20 C${100*c[0]} ${20-16*c[1]} ${100*c[2]} ${20-16*c[3]} 100 4`:"M0 20 L100 4";return s.qy`<i class="span ${l?"sel":""}" style="--a: ${e/100}; --b: ${o/100}">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${s.JW`<path class="area" d="${d} L100 24 L0 24 Z"></path><path d=${d}></path>`}
        </svg>
      </i>`});return[...h,...i.map(e=>{const i={target:r,lane:t,at:e},c=this._isSel(i),d="*"===t?this._kfLanesText(n,e):aa(t,Ys(n,t,e)),h=this._isLocked(i);return s.qy`<button
        type="button"
        class="key ${c?"sel":""} ${h?"locked":""} ${e===l.prev||e===l.next?"onion":""} ${"keys"===this._drag?.kind&&c?"dragging":""}"
        style="--at: ${e/100}"
        data-key=${qr(i,a)}
        data-lane=${t}
        data-target=${r}
        data-at=${e}
        role="slider"
        tabindex=${e===o?"0":"-1"}
        aria-label=${p}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${e}
        aria-valuetext=${[bh(e),d,c?Gn(1130):"",h?Gn(1118):""].filter(Boolean).join(", ")}
        aria-describedby="kf-help"
        title=${d?Gn(1198,{label:p,at:bh(e),value:d}):Gn(1197,{label:p,at:bh(e)})}
        @pointerdown=${e=>this._onKeyDown(e,i)}
        @keydown=${e=>this._onKeyKeydown(e,i)}
        @focus=${()=>this._laneFocus.set(`${r}|${t}`,e)}
        @dblclick=${e=>e.stopPropagation()}
      ></button>`})]}_kfLanesText(e,t){return Zs(e.filter(e=>e.at===t)).map(e=>Vs(e)).join(", ")}_renderGroupHead(e,t){const i=Us(e.keyframes,"*"),n=Mr(this._view,e.target),r=!this._collapsed.has(e.target),a=e.target===this._active&&!t;return s.qy`
      <div
        class="row lane summary ${a?"target-active":""} ${this._keys.some(t=>t.target===e.target&&"*"===t.lane)?"active":""}"
        data-lane="*"
        data-target=${e.target}
        role="group"
        aria-label=${Gn(1224,{name:n})}
      >
        <div class="head">
          <button
            type="button"
            class="icon-btn sm collapse"
            aria-expanded=${r?"true":"false"}
            aria-label=${Gn(r?163:310,{name:n})}
            title=${Gn(r?162:309)}
            @click=${()=>this._toggleGroup(e.target)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="lane-name"
            title=${Gn(785,{name:n.toLowerCase()})}
            @click=${t=>this._selectLane(e.target,"*",t.shiftKey||t.ctrlKey||t.metaKey)}
          >
            <ha-icon icon=${Sr(e.target)}></ha-icon>
            <span class="nm">${n}</span>
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${Gn(25,{name:n.toLowerCase()})}
            title=${Gn(22)}
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
    `}_renderLane(e,t){const i=e.keyframes,n=Us(i,t),r=Hs[t],a=aa(r.id,hr(i,r.id,100*this.time,this._view.easing)),o=this._keys.some(i=>i.target===e.target&&i.lane===t);return s.qy`
      <div class="row lane sub ${o?"active":""}" data-lane=${t} data-target=${e.target} role="group" aria-label=${Gn(1201,{label:Gn(r.label)})}>
        <div class="head">
          <button
            type="button"
            class="lane-name"
            title=${Gn(785,{name:Gn(r.label).toLowerCase()})}
            @click=${i=>this._selectLane(e.target,t,i.shiftKey||i.ctrlKey||i.metaKey)}
          >
            <ha-icon icon=${r.icon}></ha-icon>
            <span class="nm">${Gn(r.label)}</span>
            ${a?this._laneValue(i,r.id,a):s.s6}
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${Gn(41,{name:Gn(r.label).toLowerCase()})}
            title=${Gn(22)}
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
          ${this._renderKeys(e,t,n)}
        </div>
      </div>
    `}_laneValue(e,t,i){const n=hr(e,t,100*this.time,this._view.easing)??{},r=(e,t="")=>s.qy`<span class="val" title=${Gn(75,{text:i})}><i class="sw" style="background: ${e};${t}"></i></span>`,a=e=>e.replace(/var\(--mc-anim-c\)/g,this.entityColor);return"color"===t&&n.color?r(a(n.color)):"background"===t&&n.background?r(a(n.background)):"stroke"===t&&n.stroke?r(a(n.stroke)):"shadow"===t&&n.shadow?r("var(--mc-surface)",`box-shadow: ${"none"===n.shadow?"none":a(n.shadow).replace(/(\d+(?:\.\d+)?)px/g,(e,t)=>`${Math.min(4,Number(t)/4)}px`)}`):"filter"===t&&n.filter?s.qy`<span class="val" title=${Gn(74,{filter:n.filter})}>${n.filter.match(/^[a-z-]+/)?.[0]??n.filter}</span>`:s.qy`<span class="val" title=${Gn(75,{text:i})}>${i}</span>`}_trackWidth(){if(this._zoom<=1||!this._viewW)return;const e=this._narrow?44:216;return`${Math.round(Math.max(100,this._viewW-e)*this._zoom)}px`}_renderTimeline(){const e=this._groups(),t=1===e.length,i=[];for(const n of e){if(i.push(this._renderGroupHead(n,t)),this._collapsed.has(n.target))continue;const e=Zs(n.keyframes);for(const t of e)i.push(this._renderLane(n,t));e.length||n.main||i.push(s.qy`<div class="empty-group">${Gn(557)}</div>`)}const n=this._band,r=this._trackWidth(),a=e.every(e=>!Zs(e.keyframes).length);return s.qy`
      <div class="tl" role="group" aria-label=${Gn(396)}>
        <div class="tl-body" @wheel=${this._onWheel}>
          <div class="tl-content" style=${r?`--tw: ${r}`:""}>
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${i}
              ${n?s.qy`<div
                      class="band"
                      style="left: ${Math.min(n.x0,n.x1)}px; top: ${Math.min(n.y0,n.y1)}px; width: ${Math.abs(n.x1-n.x0)}px; height: ${Math.abs(n.y1-n.y0)}px"
                    ></div>`:s.s6}
            </div>
            ${a?s.qy`<div class="empty-lanes"><ha-icon icon="mdi:information-outline"></ha-icon>${Gn(561)}</div>`:s.s6}
            ${this._overlays()}
          </div>
        </div>
        ${this._renderFoot()}
        <span class="sr-only" id="kf-help">
          ${Gn(254)}
        </span>
      </div>
    `}_renderFoot(){const e=this._zoom;return s.qy`<div class="tl-foot" role="toolbar" aria-label=${Gn(1003)}>
      <button
        type="button"
        class="icon-btn sm"
        data-act="snap"
        aria-pressed=${this._snap?"true":"false"}
        aria-label=${Gn(841)}
        title=${Gn(840)}
        @click=${()=>this._snap=!this._snap}
      >
        <ha-icon icon="mdi:magnet"></ha-icon>
      </button>
      <label class="grid-select">
        <span class="sr-only">${Gn(839)}</span>
        <div class="select">
          <select
            class="input"
            data-act="grid"
            aria-label=${Gn(839)}
            ?disabled=${!this._snap}
            @change=${e=>this._grid=e.target.value}
          >
            ${Rr.map(e=>s.qy`<option value=${e.id} ?selected=${e.id===this._grid}>${Gn(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </label>
      <button
        type="button"
        class="unit-btn"
        data-act="units"
        aria-label=${"s"===this._unit?Gn(755):Gn(754)}
        title=${Gn(753)}
        @click=${()=>this._unit="s"===this._unit?"pct":"s"}
      >
        ${"s"===this._unit?"s":"%"}
      </button>
      <span class="spacer"></span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-out"
        aria-label=${Gn(1086)}
        title=${Gn(1087)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(Tr(e,-1))}
      >
        <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
      </button>
      <span class="zoom-pct" aria-live="polite" title=${Gn(197)}>${Math.round(100*e)}%</span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-in"
        aria-label=${Gn(1084)}
        title=${Gn(1085)}
        ?disabled=${e>=10}
        @click=${()=>this._setZoom(Tr(e,1))}
      >
        <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-fit"
        aria-label=${Gn(329)}
        title=${Gn(330)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(1)}
      >
        <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
      </button>
    </div>`}_renderNarrow(){const e=this._active,t=this._kfsOf(e),i={target:e,keyframes:t,main:e===this._main},n=Us(t,"*");return s.qy`
      <div class="tl narrow" role="group" aria-label=${Gn(396)}>
        <div class="tl-body">
          <div class="tl-content">
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${this._renderGroupHead(i,!0)}
            </div>
            ${this._overlays()}
          </div>
          <ul class="kf-list" aria-label=${Gn(398)}>
            ${n.map(i=>{const n={target:e,lane:"*",at:i},r=this._isSel(n),a=this._kfLanesText(t,i),o=Js(t,i),l=Zs(t.filter(e=>e.at===i)).map(e=>aa(e,Ys(t,e,i))).filter(Boolean).join(" · ");return s.qy`<li>
                <button
                  type="button"
                  class="kf-row"
                  data-at=${i}
                  aria-pressed=${r?"true":"false"}
                  @click=${t=>{const s=t.shiftKey||t.ctrlKey||t.metaKey;this._select(s?r?this._keys.filter(t=>!(t.target===e&&"*"===t.lane&&t.at===i)):[...this._keys,n]:[n])}}
                >
                  <span class="at">${bh(i)}</span>
                  <span class="props">${a||Gn(298)}${l?s.qy`<small>${l}</small>`:s.s6}</span>
                  <span class="ease">${oa(o)}</span>
                </button>
              </li>`})}
          </ul>
        </div>
        <span class="sr-only" id="kf-help">${Gn(72)}</span>
      </div>
    `}};yh.styles=[Qp,s.AH`
      :host {
        display: block;
        min-width: 0;
        height: 100%;
        container: kf / inline-size;
        --head: ${(0,s.iz)(216)}px;
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
        direction: ltr; /* time runs left to right */
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
        --head: ${(0,s.iz)(44)}px;
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
        left: 0; /* physical */
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 8px 0 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
        background: var(--mc-surface-2);
        border-right: 1px solid var(--mc-divider); /* physical */
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
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
      }
      .tick.major {
        height: 9px;
        background: var(--mc-text-2);
      }
      .tick-label {
        position: absolute;
        top: 5px;
        transform: translateX(-50%);
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
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
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--t)); /* physical */
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
        left: 50%; /* physical */
        bottom: -4px;
        width: 8px;
        height: 8px;
        margin-left: -4px; /* physical */
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
        margin-left: -1px; /* physical */
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--t)); /* physical */
        background: var(--ph);
        z-index: 3;
        pointer-events: none;
      }
      .onion-band {
        position: absolute;
        top: 36px;
        bottom: 0;
        left: calc(var(--head) + var(--inset) + (100% - var(--head) - 2 * var(--inset)) * var(--a)); /* physical */
        width: calc((100% - var(--head) - 2 * var(--inset)) * (var(--b) - var(--a)));
        background: repeating-linear-gradient(135deg, color-mix(in srgb, var(--mc-text) 5%, transparent) 0 6px, transparent 6px 12px);
        border-left: 1px dashed var(--mc-field-border); /* physical */
        border-right: 1px dashed var(--mc-field-border); /* physical */
        pointer-events: none;
        z-index: 0;
      }
      .ghost {
        position: absolute;
        bottom: 4px;
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
        width: 10px;
        height: 10px;
        margin-left: -5px; /* physical */
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
        left: 0; /* physical */
        z-index: 4;
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
        padding: 0 2px 0 4px;
        background: var(--mc-surface);
        border-right: 1px solid var(--mc-divider); /* physical */
      }
      .lane.summary .head {
        background: color-mix(in srgb, var(--mc-surface-2) 45%, var(--mc-surface));
      }
      .lane.sub .head {
        padding-left: 20px; /* physical */
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
        text-align: start;
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
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--a)); /* physical */
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
        left: calc(var(--inset) + (100% - 2 * var(--inset)) * var(--at)); /* physical */
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
        left: 50%; /* physical */
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
        left: 50%; /* physical */
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
        left: 0; /* physical */
        width: max-content;
        max-width: 100cqw;
        padding-left: 24px; /* physical */
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
        text-align: start;
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
    `],fh([(0,r.MZ)({attribute:!1})],yh.prototype,"doc",void 0),fh([(0,r.MZ)({attribute:!1})],yh.prototype,"hass",void 0),fh([(0,r.MZ)({attribute:!1})],yh.prototype,"library",void 0),fh([(0,r.MZ)({type:Number})],yh.prototype,"time",void 0),fh([(0,r.MZ)({type:Boolean,reflect:!0})],yh.prototype,"disabled",void 0),fh([(0,r.MZ)({attribute:!1})],yh.prototype,"layerView",void 0),fh([(0,r.MZ)({type:Boolean,reflect:!0,attribute:"onion-skin"})],yh.prototype,"onionSkin",void 0),fh([(0,r.MZ)({type:String})],yh.prototype,"layout",void 0),fh([(0,r.MZ)({type:String})],yh.prototype,"entityColor",void 0),fh([(0,r.MZ)({attribute:!1})],yh.prototype,"studioSelection",void 0),fh([(0,r.wk)()],yh.prototype,"_keys",void 0),fh([(0,r.wk)()],yh.prototype,"_draft",void 0),fh([(0,r.wk)()],yh.prototype,"_band",void 0),fh([(0,r.wk)()],yh.prototype,"_width",void 0),fh([(0,r.wk)()],yh.prototype,"_viewW",void 0),fh([(0,r.wk)()],yh.prototype,"_menuOpen",void 0),fh([(0,r.wk)()],yh.prototype,"_status",void 0),fh([(0,r.wk)()],yh.prototype,"_zoom",void 0),fh([(0,r.wk)()],yh.prototype,"_unit",void 0),fh([(0,r.wk)()],yh.prototype,"_snap",void 0),fh([(0,r.wk)()],yh.prototype,"_grid",void 0),fh([(0,r.wk)()],yh.prototype,"_collapsed",void 0),fh([(0,r.wk)()],yh.prototype,"_lastTarget",void 0),yh=fh([(0,r.EM)("mc-anim-keyframes-editor")],yh);const xh={...le,...de,...he},_h={"steam-rise":"bottom:-12px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:$c;filter:blur(5px);",bubbles:"bottom:-10px;width:8px;height:8px;margin-left:-4px;border-radius:50%;border:1.5px solid $c;background:color-mix(in srgb,$c 22%,transparent);","bubbles|:nth-child(even)":"width:5px;height:5px;","snow-fall":"top:-8px;width:5px;height:5px;border-radius:50%;background:$c;","rain-fall":"top:-18px;width:2px;height:14px;border-radius:1px;background:linear-gradient(transparent,$c);","liquid-wave":"left:-50%;top:calc(100% - $i * 1%);width:200%;aspect-ratio:1;border-radius:42%;background:color-mix(in srgb,$c 50%,transparent);opacity:1;","liquid-wave|:nth-child(2)":"top:calc(100% - $i * .9%);border-radius:38%;background:$c;animation-direction:reverse;","storm-flash":"inset:0;background:color-mix(in srgb,$c 35%,rgba(255,255,255,.55));","shine-sweep":"top:0;bottom:0;left:0;width:45%;opacity:1;background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--mca-shine-sweep-c,#fff) calc($i * 1%),transparent) 50%,transparent 100%);",...pe,"holographic-shimmer":"left:0;top:0;width:400%;height:100%;opacity:calc($i / 100);background:linear-gradient(115deg,transparent 20%,color-mix(in srgb,$c 55%,#ff80ab) 35%,color-mix(in srgb,$c 55%,#80d8ff) 50%,color-mix(in srgb,$c 55%,#ccff90) 65%,transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"left:0;top:0;width:100%;height:14%;opacity:calc($i / 100);background:linear-gradient(transparent,color-mix(in srgb,$c 45%,transparent) 70%,$c 96%,transparent);",twinkle:"top:calc(8% + var(--mc-anim-phase) * 80%);width:10px;height:10px;margin:-5px 0 0 -5px;background:$c;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);",spotlight:"left:50%;top:50%;width:70cqmin;aspect-ratio:1;margin:-35cqmin 0 0 -35cqmin;opacity:calc($i / 100);border-radius:50%;background:radial-gradient(circle,$c,transparent 65%);","color-cycle-bg":"left:0;top:0;width:100%;height:100%;opacity:calc($i / 100);background:$c;",aurora:"left:-25%;top:calc(-10% + var(--mc-anim-k) * 40%);width:150%;height:55%;background:radial-gradient(ellipse 30% 50% at 32% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 62% 50%,color-mix(in srgb,$c 50%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 50%,#00e5ff) 45%,transparent) 45%,transparent);","aurora|:nth-child(2)":"animation-duration:calc(var(--mc-fx-dur) * 1.4);animation-direction:reverse;background:radial-gradient(ellipse 30% 50% at 37% 50%,color-mix(in srgb,$c 50%,#76ff03),color-mix(in srgb,color-mix(in srgb,$c 50%,#76ff03) 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 68% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent);","aurora|:nth-child(3)":"animation-duration:calc(var(--mc-fx-dur) * .8);background:radial-gradient(ellipse 38% 50% at 42% 50%,color-mix(in srgb,$c 50%,#e040fb),color-mix(in srgb,color-mix(in srgb,$c 50%,#e040fb) 45%,transparent) 45%,transparent);","lava-lamp":"bottom:-12%;width:calc(14cqmin + var(--mc-anim-phase) * 16cqmin);aspect-ratio:1;margin-left:-10cqmin;border-radius:50%;background:radial-gradient(circle at 35% 35%,color-mix(in srgb,$c 55%,#fff),$c 70%);filter:blur(2px);","plasma-gradient":"left:50%;top:50%;width:160cqmax;aspect-ratio:1;margin:-80cqmax 0 0 -80cqmax;opacity:calc($i / 100);background:radial-gradient(circle at 30% 30%,$c,color-mix(in srgb,$c 55%,transparent) 22%,color-mix(in srgb,$c 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 70% 40%,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 45% 75%,color-mix(in srgb,$c 40%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 15%,transparent) 38%,transparent 52%);","gradient-flow":"left:0;top:0;width:300%;height:100%;opacity:calc($i / 100);background:linear-gradient(110deg,$c,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,$c 40%,#00e5ff),$c);",starfield:"top:calc(6% + var(--mc-anim-phase) * 86%);width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:$c;box-shadow:0 0 4px 1px color-mix(in srgb,$c 60%,transparent);","starfield|:nth-child(3n)":"width:2px;height:2px;","meteor-shower":"top:calc(-10% + var(--mc-anim-phase) * 30%);left:calc(30% + var(--mc-anim-x) * .8);width:22%;height:2px;rotate:-45deg;transform-origin:0 50%;border-radius:2px;background:linear-gradient(90deg,$c,transparent);",bokeh:"top:calc(10% + var(--mc-anim-phase) * 75%);width:calc(10cqmin + var(--mc-anim-k) * 18cqmin);aspect-ratio:1;margin:-10cqmin 0 0 -10cqmin;border-radius:50%;filter:blur(1px);background:radial-gradient(circle,color-mix(in srgb,$c 70%,transparent),color-mix(in srgb,$c 25%,transparent) 60%,transparent 72%);","matrix-rain":"top:0;width:2px;height:calc(20% + var(--mc-anim-phase) * 25%);border-radius:1px;background:linear-gradient(transparent,color-mix(in srgb,$c 60%,transparent) 70%,$c);","matrix-rain|:nth-child(odd)":"width:3px;background:repeating-linear-gradient(transparent 0 3px,$c 3px 6px);-webkit-mask:linear-gradient(transparent,#000);mask:linear-gradient(transparent,#000);",smoke:"bottom:-20px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:color-mix(in srgb,$c 70%,#9e9e9e);filter:blur(8px);","clouds-drift":"left:-40%;top:calc(5% + var(--mc-anim-phase) * 55%);width:38%;aspect-ratio:2.4;filter:blur(1.5px);background:radial-gradient(ellipse 35% 45% at 30% 60%,$c 60%,transparent 62%),radial-gradient(ellipse 30% 55% at 55% 45%,$c 60%,transparent 62%),radial-gradient(ellipse 28% 40% at 75% 62%,$c 60%,transparent 62%);","water-ripple":"top:calc(25% + var(--mc-anim-phase) * 50%);width:60cqmin;aspect-ratio:2.2;margin:-13.6cqmin 0 0 -30cqmin;border:2px solid $c;border-radius:50%;box-sizing:border-box;box-shadow:0 0 0 3px color-mix(in srgb,$c 25%,transparent);",fireworks:"left:50%;top:45%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 1px $c;animation-delay:var(--mc-fx-delay,0s);","fireworks|:nth-child(even)":"background:color-mix(in srgb,$c 50%,#ffeb3b);box-shadow:0 0 6px 1px color-mix(in srgb,$c 50%,#ffeb3b);","tap-ripple":"left:var(--mc-tap-x,50%);top:var(--mc-tap-y,50%);width:290cqmax;aspect-ratio:1;margin:-145cqmax 0 0 -145cqmax;border-radius:50%;background:radial-gradient(circle,$c 0,color-mix(in srgb,$c 55%,transparent) 40%,transparent 70%);"};function wh(e,t,i=!1){const n=oe(t),s=`var(--mca-${t}-c, var(--mc-anim-c))`;return e.replace(/\$i/g,`var(--mca-${t}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${s} calc(var(--mca-${t}-s, 1) * 100%), transparent)`:s)}const $h=s.AH`[data-mc-anim],[data-mc-anim-fx]{--mc-anim-c:var(--mc-anim-color,var(--mc-design-color,var(--primary-color,#03a9f4)))}[data-mc-anim~='module']{animation:var(--mc-anim-m);transform-origin:var(--mc-anim-om,center)} [data-mc-anim~='icon'] .mc-anim-icon{display:inline-block;animation:var(--mc-anim-i);transform-origin:var(--mc-anim-oi,center)} [data-mc-anim~='label'] [data-mc-part='name']{display:inline-block;animation:var(--mc-anim-n);transform-origin:var(--mc-anim-on,center)} [data-mc-anim~='icon']:not(:has(.mc-anim-icon)){animation:var(--mc-anim-mi);transform-origin:var(--mc-anim-om,var(--mc-anim-oi,center))} [data-mc-anim-fx]{position:relative;isolation:isolate}.mc-anim-fx{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;border-radius:inherit;container-type:size}.mc-anim-fx[data-front]{z-index:auto}.mc-anim-fx>i{position:absolute;display:block;left:var(--mc-anim-x,50%);opacity:0;will-change:translate,scale,rotate,opacity;animation:var(--mc-fx-anim);animation-delay:calc(var(--mc-fx-delay,0s) - var(--mc-anim-phase,0) * var(--mc-fx-dur,1s))} [data-mc-tap][data-mc-tapped]{animation:var(--mc-anim-m,none),var(--mc-anim-t);transform-origin:var(--mc-anim-om,center)} .mc-anim-fx[data-tap]:not([data-tapped]),.mc-anim-ring[data-tap]:not([data-tapped]){display:none}`,kh=s.AH`@media (prefers-reduced-motion:reduce){[data-mc-anim],[data-mc-anim] .mc-anim-icon,[data-mc-anim~='label'] [data-mc-part='name'],[data-mc-tap],.mc-anim-fx>i{animation:none !important}.mc-anim-fx:not([data-p]),.mc-anim-ring{display:none}}`,Mh=(0,s.iz)($h.cssText+[...Object.entries(xh).map(([e,t])=>`@keyframes mc-anim-${e} {${wh(t,e.replace(/-icon$/,""),!0)}\n}`),...ne.filter(e=>void 0!==e.particles).map(e=>`.mc-anim-fx[data-fx="${e.id}"] {\n  opacity: var(--mca-${e.id}-s, 1);\n}`),...Object.entries({"conic-border-spin":"padding:calc($i * 1px);box-sizing:border-box;background:color-mix(in srgb,$c 18%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);"}).map(([e,t])=>`.mc-anim-fx[data-fx="${e}"] {${wh(t,e)}\n}`),...Object.entries(_h).map(([e,t])=>{const[i,n=""]=e.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${wh(t,i)}\n}`})].join("\n")+kh.cssText),Sh=new Set(["off","unavailable","unknown","idle","standby"]),jh=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function Ch(e){if(!e)return!1;const t=e.entity_id.split(".")[0],i=e.state;if(Sh.has(i))return!1;switch(t){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function Ah(e,t){if(!e||!Object.prototype.hasOwnProperty.call(e,t))return;const i=e[t];if(!Array.isArray(i))return;const n=[i[0],i[1],i[2]];return"hs_color"===t&&n.slice(0,2).every(Number.isFinite)?function(e,t){const i=Math.max(0,Math.min(100,t))/100,n=t=>{const n=(t+e/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(e=>Math.round(255*e))}((n[0]%360+360)%360,n[1]):n.every(Number.isFinite)?n.map(e=>Math.max(0,Math.min(255,Math.round(e)))):void 0}const zh=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function qh(e){if("string"!=typeof e)return;const t=e.trim().match(zh);return t?{opacity:void 0===t[1]?100:Math.min(100,Number(t[1]))}:void 0}function Eh(e){return void 0!==qh(e)}function Hh(e){const t=qh(e);if(!t)return;const i="var(--mc-entity-color, currentColor)";return t.opacity>=100?i:`color-mix(in srgb, ${i} ${t.opacity}%, transparent)`}const Lh=e=>e.replace(/_/g,"-"),Vh={margin:["top","right","bottom","left"].map(e=>({key:`margin_${e}`,cssProperty:`margin-${e}`})),padding:["top","right","bottom","left"].map(e=>({key:`padding_${e}`,cssProperty:`padding-${e}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(e=>({key:`border_${e}_radius`,cssProperty:`border-${e.replace("_","-")}-radius`}))},Oh="margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap background background_color:c background_image:i background_position background_size background_repeat background_attachment background_clip background_origin backdrop_filter flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction animation_fill_mode animation_play_state filter list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side".split(" ").map(e=>{const[t,i=""]=e.split(":");return{key:t,flag:i}}),Ph=[...Oh.filter(e=>"c"===e.flag).map(e=>e.key),"icon_color","icon_background","label_color","state_color"];new Set(Oh.filter(e=>"i"===e.flag).map(e=>e.key)),Object.fromEntries(Oh.filter(e=>"p"===e.flag||"s"===e.flag).flatMap(e=>{const t="s"===e.flag?"s":"px";return[[e.key,t],...(Vh[e.key]||[]).map(e=>[e.key,t])]})),new Map;const Rh=e=>"string"==typeof e&&""!==e.trim()?e.trim():void 0;function Nh(e){if("number"==typeof e&&Number.isFinite(e)&&e>=0)return+e.toFixed(3)+"s";const t=Rh(e);if(!t)return;const i=t.length<=64?/^(?:\d+(?:\.\d+)?|\.\d+)(m?s)?$/.exec(t):null;return i?i[1]?t:+(+t).toFixed(3)+"s":void 0}const Dh=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function Th(e){const t=Rh(e);if(!t||t.length>256||!/^[#\w\s(),.%+*/-]+$/.test(t)||t.includes("/*")||t.includes("*/"))return;let i=0;for(const e of t)if("("===e)i++;else if(")"===e&&--i<0)return;if(0!==i)return;const n=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==n||s.some(e=>!Dh.has(e[1].toLowerCase()))?void 0:t}const Fh=/^(\d+(?:\.\d+)?|\.\d+)(%)?$/;new Map([["blur",/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem)?$/],["hue-rotate",/^(-?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)$/],...["brightness","contrast","grayscale","invert","opacity","saturate","sepia"].map(e=>[e,Fh])]),new Map,new Map,new Map([["left",["2/1/4/2",3]],["right",["2/4/4/5",2]],["above",["1/2/2/4",1]],["below",["4/2/5/4",0]]]),new Set(["start","center","end"]),function(){const e={};for(const{key:t}of Oh){e[t]=Lh(t);for(const i of Vh[t]||[])e[i.key]=i.cssProperty}}();const Bh=/(?<![\w-])entity(?: \d+(?:\.\d+)?%)?(?![\w-])/g;function Ih(e){const t="string"==typeof e&&e.length<=256?e.replace(Bh,e=>Hh(e)??e):e;return t===e?void 0:t}function Zh(e,t,i){const n=Rh(e.trigger_entity);switch(n&&(t=i?.[n]),e.trigger){case"entity_on":return Ch(t);case"state":{const i=(e.state||"").trim();return!!i&&!!t&&t.state===i}default:return!0}}new Set(["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color","box_shadow"]),new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]);const Wh={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"},Kh=new Map,Uh=new Set;const Gh=new Map,Yh={slow:1.6,normal:1,fast:.6},Jh=["normal","reverse","alternate","alternate-reverse"],Xh=e=>e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);function Qh(e){const t=Rh(e);if(!t)return;const i=G.find(e=>e.id===t);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)?t:void 0}function eu(e){if("infinite"===e)return"infinite";const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?String(+t.toFixed(2)):void 0}function tu(e,t){const i="string"==typeof t?Number(t):t;return"number"==typeof i&&Number.isFinite(i)?Math.min(e.intensity.max,Math.max(e.intensity.min,i)):e.defaults.intensity}function iu(e){const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?Math.min(100,Math.max(0,t)):void 0}const nu=(e,t)=>t&&"icon"===e.target,su=(e,t)=>!e.target&&!!t?.channels.includes("rotate"),ru=(e,t)=>t&&"label"===e.target;function au(e,t,i,n){if("weather"===e.seasonal){const e=Rh(t.trigger_entity),r=e?.startsWith("weather.")?n?.[e]:i;return r?.entity_id?.startsWith("weather.")&&(s=r.state)?Wh[s]:void 0}var s;if("daynight"===e.seasonal){const e=n?.["sun.sun"],t=e?.attributes?.elevation;return function(e,t){if("below_horizon"===e||"above_horizon"===e)return"number"==typeof t&&Number.isFinite(t)&&Math.abs(t)<=6?"dusk":"below_horizon"===e?"night":void 0}(e?.state,"number"==typeof t?t:"string"==typeof t&&""!==t.trim()?Number(t):void 0)}return e.seasonal}const ou=.618034;function lu(e){return Array.from({length:e},(t,i)=>{const n=60/e*(i*ou%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/e*100+n)).toFixed(1),phase:+(i*ou%1).toFixed(3),k:e>1?+(i/e).toFixed(3):0}})}function cu(e,t,i={}){e=function(e){if(!e)return e;const t=e;let i;for(const e of Ph){const n=Ih(t[e]);n&&((i??={...t})[e]=n)}return Array.isArray(t.animations)&&t.animations.some(e=>Eh(e?.color))&&((i??={...t}).animations=t.animations.map(e=>Eh(e?.color)?{...e,color:Hh(e.color)}:e)),i??e}(e);const n=!1!==i.allowIcon,s={m:[],i:[],mi:[],t:[],n:[]},r=[],a={},o=[],l=[],c=[],d={need:!1,p:!1};for(let p of function(e){if(!e)return[];if(Array.isArray(e.animations))return e.animations.filter(e=>!!e&&"object"==typeof e&&!!Rh(e.preset)).map((e,t)=>Rh(e.id)?e:{...e,id:`anim-${t}`});const t=Rh(e.animation_preset);if(!t)return[];const i=oe(t),n={id:"legacy",preset:t};if(e.animation_target&&(n.target=e.animation_target),e.animation_trigger&&(n.trigger=e.animation_trigger),e.animation_state&&(n.state=e.animation_state),e.animation_color&&(n.color=e.animation_color),!i)return[n];const s=function(e){if(e.seasonal)return{intensity:e.defaults.intensity};const{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:a}=e.defaults;return{duration:t,delay:i,easing:n,iterations:s,direction:r,intensity:a,...U(e)?{strength:100}:{}}}(i),r=Yh[e.animation_speed||"normal"]??1;return[{...n,...s,duration:+(Xh(s.duration)*r).toFixed(3)+"s"}]}(e)){const e=!!i.spinIcon&&!Je(p.preset);if(Je(p.preset)){const e=i.custom?.(Xe(p.preset));if(!e||!Zh(p,t,i.states))continue;const h=du(e,p,{lists:s,vars:r,origins:a,fx:o,seq:l,v2:c,allowIcon:n,runtime:d,custom:i.custom,stateObj:t,states:i.states});if(!h)continue;p=h}const h=oe(p.preset);if(!h||!Zh(p,t,i.states))continue;const u=h.defaults,m=Nh(p.duration)??u.duration,g=Nh(p.delay)??u.delay,f="tap"===p.trigger;let v=eu(p.iterations)??eu(u.iterations);f&&"infinite"===v&&(v="1");const b=`${Qh(p.easing)??Qh(u.easing)} ${g} ${v} ${Jh.includes(p.direction)?p.direction:u.direction}`,y=`${m} ${b}`,x=[`--mca-${h.id}-i: ${tu(h,p.intensity)}`],_=Th(p.color);_&&x.push(`--mca-${h.id}-c: ${_}`);const w=U(h)?iu(p.strength):void 0;if(void 0!==w&&100!==w&&x.push(`--mca-${h.id}-s: ${+(w/100).toFixed(3)}`),h.seasonal){const e=au(h,p,t,i.states);if(!e)continue;o.push({preset:h.id,front:!1,style:void 0!==w&&100!==w?"opacity: "+ +(w/100).toFixed(3):"",particles:[],seasonal:{scenes:[e],intensity:tu(h,p.intensity)/100,decorations:!1!==p.decorations}});continue}if(h.ring){o.push({preset:h.id,front:!0,style:x.join("; "),particles:[],...f?{tap:f}:{},ring:pu(h,p,m,b,w)});continue}if(void 0!==h.particles){const e="count"===h.particles?Math.min(12,Math.round(tu(h,p.intensity))):h.particles;o.push({preset:h.id,front:!!h.front,style:[`--mc-fx-anim: mc-anim-${h.id} ${y}`,`--mc-fx-dur: ${m}`,`--mc-fx-delay: ${g}`,...x].join("; "),particles:lu(Math.max(1,e)),...f?{tap:f}:{}});continue}if(r.push(...x),f){s.t.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.m&&(a.m=h.origin);continue}if(ru(p,n)){s.n.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.n&&(a.n=h.origin);continue}const $=nu(p,n)||e&&su(p,h);s.mi.push(`mc-anim-${h.id} ${y}`),$?(s.i.push(`mc-anim-${h.id}${h.iconKeyframes?"-icon":""} ${y}`),h.origin&&!a.i&&(a.i=h.origin)):(s.m.push(`mc-anim-${h.id} ${y}`),h.origin&&!a.m&&(a.m=h.origin))}if(!(s.mi.length||s.n.length||s.t.length||o.length||l.length||d.need))return;const p=[];s.m.length&&p.push(`--mc-anim-m: ${s.m.join(", ")}`),s.t.length&&p.push(`--mc-anim-t: ${s.t.join(", ")}`),s.i.length&&p.push(`--mc-anim-i: ${s.i.join(", ")}`,`--mc-anim-mi: ${s.mi.join(", ")}`),s.n.length&&p.push(`--mc-anim-n: ${s.n.join(", ")}`),a.m&&p.push(`--mc-anim-om: ${a.m}`),a.i&&p.push(`--mc-anim-oi: ${a.i}`),a.n&&p.push(`--mc-anim-on: ${a.n}`),p.push(...function(e){const t=new Map;for(const i of e){const e=i.slice(0,i.indexOf(":"));t.delete(e),t.set(e,i)}return[...t.values()]}(r));const h=Th(e?.color)??Th(function(e){if(!e)return;const t=e.entity_id.split(".")[0];if(!jh.has(t))return;if(!Ch(e))return`var(--state-${t}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=function(e){const t=Ah(e,"rgb_color")||Ah(e,"hs_color");return t?`rgb(${t.join(", ")})`:void 0}(e.attributes||{});return i||`var(--state-${t}-${e.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${t}-active-color, var(--state-active-color, var(--primary-color))))`}(t));h&&p.push(`--mc-anim-color: ${h}`);const u=[s.m.length?"module":"",s.i.length?"icon":"",s.n.length?"label":""].filter(Boolean).join(" ");return{...u?{targets:u}:{},style:p.join("; "),fx:o,...s.t.length?{tap:!0}:{},...l.length?{seq:l.join(" ")}:{},...d.need?{needsRuntime:!0}:{},...d.p?{needsParticles:!0}:{},...c.length?{v2:c,run:[...new Set(c.map(e=>e.run))].join(" ")}:{}}}function du(e,t,i){const n=Fn(e,{lookup:i.custom}),s=eu(e.iterations)??"infinite",r="tap"===t.trigger,a=Nh(t.duration)??`${e.duration}s`,o=Nh(t.delay)??"0s";let l=eu(t.iterations)??s;r&&"infinite"===l&&(l="1");const c=Jh.includes(t.direction)?t.direction:e.direction??"normal",d=`${Qh(t.easing)??Qh(e.easing)??"ease"} ${o} ${l} ${c}`,p=ru(t,i.allowIcon),h=i.allowIcon&&("icon"===t.target||!t.target&&"icon"===n.motion?.target);let u;if(Ue(e)&&(i.runtime.need=!0,n.v2)){const s="string"==typeof t.entity&&t.entity?t.entity:void 0,r=s?i.states?.[s]:i.stateObj,o=s??i.stateObj?.entity_id,l=n.name||vn(e),c={};u=c.clip?.animation,i.v2.push({run:l,docId:e.id,v2:u?{...n.v2,tracks:[]}:n.v2,timing:`${a} ${d}`,icon:h,...o?{entityId:o}:{},...r?{stateObj:r}:{},hints:c})}if(u){if("none"===u)return;const n={...t,preset:u,target:h?"icon":t.target};for(const e of["duration","delay","easing","iterations","direction"])delete n[e];if(!Je(u))return n;const s=i.custom?.(Xe(u));return s&&s!==e?du(s,n,i):void 0}if(n.preset)return{...t,preset:n.preset.id,intensity:t.intensity??n.preset.intensity,duration:t.duration??`${e.duration}s`,easing:t.easing??e.easing,iterations:t.iterations??("infinite"===s?"infinite":Number(s)),direction:t.direction??e.direction};if(n.schedule){const e=n.schedule,s=Nh(t.duration),r=s&&e.total>0?Xh(s)/e.total:1,a="number"==typeof t.iterations&&t.iterations>0?Math.round(t.iterations):void 0;return void(e.steps.length&&i.seq.push(function(e){const t=`s${fn(JSON.stringify(e))}`;return Gh.set(t,e),Gh.size>64&&Gh.delete(Gh.keys().next().value),t}({...e,delay:Xh(o),scale:r,...a?{cycles:a}:{},...p?{target:"label"}:{}})))}const m=[],g="number"==typeof t.intensity&&Number.isFinite(t.intensity)?t.intensity:void 0;void 0!==g&&100!==g&&m.push(`${bn(e.id,"i")}: ${+(g/100).toFixed(3)}`);const f=Th(t.color);f&&m.push(`${bn(e.id,"c")}: ${f}`);const v=iu(t.strength);if(void 0!==v&&100!==v&&m.push(`${bn(e.id,"s")}: ${+(v/100).toFixed(3)}`),b=e.id,y=n.name,x=n.css,y&&x&&Kh.get(b)?.name!==y&&(Kh.set(b,{name:y,css:x}),function(){const e=[...Kh.values()].map(e=>e.css).join("\n");for(const t of Uh)t.isConnected?t.textContent=e:Uh.delete(t)}()),n.layer){(n.sim||n.needsParticles)&&(i.runtime.p=!0);const e=+(Xh(a)/n.layer.speed).toFixed(3)+"s";for(const[t,s,a]of[[n.name,n.layer,n.sim],...n.split?[[n.split.name,n.split.layer,n.split.sim]]:[]])i.fx.push({preset:t,front:s.front,style:[`--mc-fx-anim: ${t} ${e} ${d}`,`--mc-fx-dur: ${e}`,`--mc-fx-delay: ${o}`,...m].join("; "),particles:s.particles,...s.symbol?{symbol:s.symbol}:{},sim:a,...r?{tap:r}:{}});return}var b,y,x;if(!n.motion)return;const _=[n.name,...n.lanes??[]].map(e=>`${e} ${a} ${d}`).join(", "),w="center"!==n.motion.origin?n.motion.origin:void 0;return i.vars.push(...m),r?(i.lists.t.push(_),void(w&&!i.origins.m&&(i.origins.m=w))):p?(i.lists.n.push(_),void(w&&!i.origins.n&&(i.origins.n=w))):(i.lists.mi.push(_),void(h?(i.lists.i.push(_),w&&!i.origins.i&&(i.origins.i=w)):(i.lists.m.push(_),w&&!i.origins.m&&(i.origins.m=w))))}function pu(e,t,i,n,s){return{mode:"animated",fill:1,animation:e.ring,color:Th(t.color)??"var(--mc-anim-c)",width:tu(e,t.intensity),linecap:"dashes"===e.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==s&&100!==s?{opacity:+(s/100).toFixed(3)}:{}}}const hu=["❤️","💖","⭐","✨","❄️","💧","🔥","🍂","🌸","🎉","🎈","🫧","☁️","⚡","🌙","🦋"],uu={icon:{icon:"mdi:star"},emoji:{emoji:"✨"},svg:{svg:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'}},mu=/^[a-z0-9_-]+:[a-z0-9_-]+$/i;function gu(e){const t=e.trim();return t?[...t].length>8?Gn(1058):/[<>&"'\\{};]/.test(t)?"These characters are not allowed: < > & \" ' \\ { } ;":void 0:Gn(302)}function fu(e){if(!e.trim())return Gn(642);if(!/<svg[\s>]/i.test(e))return Gn(546);const t=We(e);return t.error?ls(t.error):t.paths.length||t.strokes.length||t.accentPaths.length?void 0:Gn(921)}const vu=Hh("entity"),bu=/^color-mix\(in srgb, var\(--mc-entity-color, currentColor\) (\d+(?:\.\d+)?)%, transparent\)$/;function yu(e){const t=e.trim();if(t)return qh(t)?Hh(t):lt(t,"color")}function xu(e){if(e===vu)return"entity";const t=bu.exec(e);return t?`entity ${t[1]}%`:e}const _u=(e,t,i)=>Math.min(i,Math.max(t,e)),wu=(e,t)=>+(Math.round(e/t)*t).toFixed(4),$u={count:{min:1,max:tt,step:1},speed:{min:.1,max:10,step:.1},size:{min:1,max:200,step:1},spin:{min:-3600,max:3600,step:15},spread:{min:0,max:100,step:5},gravity:{min:-1,max:1,step:.1}};function ku(e,t){const i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;const n=$u[e],s=_u(i,n.min,n.max);return"count"===e?Math.round(s):"gravity"===e||"speed"===e?wu(s,.01):+s.toFixed(2)}function Mu(e,t){const i={...e.particles??rt,...t};for(const e of Object.keys(i))void 0===i[e]&&delete i[e];return{...e,particles:i}}const Su=e=>e.particles?.preset?oe(e.particles.preset):void 0;function ju(e){return e.ring?Gn(747):e.seasonal?Gn(778):"count"===e.particles?Gn(629):Gn(772)}const Cu={"snow-fall":{direction:"fall",size:[4,8],colors:["#ffffff"],spin:0},"rain-fall":{direction:"fall",size:[2,4],speed:2,colors:["#90caf9"],gravity:.6,fade:!1},bubbles:{direction:"rise",size:[6,14],colors:[]},"steam-rise":{direction:"rise",size:[10,18],spread:60},confetti:{direction:"fall",size:[5,9],spin:360,colors:["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899"]},"falling-leaves":{direction:"fall",shape:{icon:"mdi:leaf"},size:[10,16],spin:180,colors:["#f97316","#eab308","#a16207"]},fireflies:{direction:"drift",size:[3,6],colors:["#fde047"]},twinkle:{direction:"drift",shape:{emoji:"✨"},size:[8,14],layer:"front",speed:.5},"orbit-dots":{direction:"orbit",size:[6,8],spread:70,fade:!1},starfield:{direction:"fall",size:[2,4],colors:["#ffffff"],speed:1.5},"meteor-shower":{direction:"fall",size:[3,5],gravity:.6,colors:["#ffffff"]},bokeh:{direction:"drift",size:[16,32],speed:.4},smoke:{direction:"rise",size:[16,28],spread:70,speed:.6},"clouds-drift":{direction:"drift",shape:{icon:"mdi:cloud"},size:[24,40],colors:["#ffffff"],speed:.3},fireworks:{direction:"burst",size:[4,6],spread:80,colors:["#ef4444","#eab308","#3b82f6"]},"ripple-rings":{direction:"burst",size:[8,12],spread:90},"water-ripple":{direction:"burst",size:[8,12],spread:90},"wind-lines":{direction:"drift",size:[3,5],speed:1.5},drip:{direction:"fall",size:[4,7],gravity:.8,colors:["#4fc3f7"]}},Au=["fall","rise","drift","burst","orbit","spiral","fountain","explode","wave","vortex","zigzag","rain","wander"],zu={fall:319,rise:748,drift:271,burst:112,orbit:612,spiral:855,fountain:343,explode:311,wave:1071,vortex:911,zigzag:1082,rain:700,wander:328},qu=new Set(et),Eu=new Set(["burst","orbit","spiral","explode","vortex"]),Hu=[{id:"circle",label:147},{id:"square",label:866},{id:"triangle",label:1016},{id:"star",label:871},{id:"heart",label:361},{id:"ring",label:746},{id:"line",label:905},{id:"spark",label:847},{id:"icon",label:371,icon:"mdi:star-outline"},{id:"emoji",label:296,icon:"mdi:emoticon-outline"},{id:"svg",label:757,icon:"mdi:svg"}],Lu=new Set(xo),Vu=e=>Lu.has(e),Ou=e=>{return"builtin"in e?e.builtin:(t=e)?"icon"in t?"icon":"emoji"in t?"emoji":"svg":"dot";var t},Pu=e=>{const t=Hu.find(t=>t.id===Ou(e));return Gn(t?t.label:808)},Ru=Math.min(4,_o.shapes),Nu=200,Du={pspeed:{min:0,max:500,step:5},spin:{min:-3600,max:3600,step:15},delay:{min:0,max:60,step:.1},lifetime:{min:.1,max:60,step:.1},opacity:{min:0,max:100,step:5},seed:{min:0,max:4294967295,step:1},weight:{min:1,max:10,step:1},childCount:{min:1,max:_o.childrenPerParent,step:1},childSize:{min:1,max:200,step:1},childLife:{min:.1,max:10,step:.1},angle:{min:0,max:359,step:1},wind:{min:-60,max:60,step:5},unit:{min:0,max:1,step:.05}},Tu=new Set(["seed","weight","childCount","childSize","angle","opacity","spin","wind"]);function Fu(e,t){let i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;"angle"===e&&(i=(Math.round(i)%360+360)%360);const n=Du[e],s=_u(i,n.min,n.max);return Tu.has(e)?Math.round(s):wu(s,.01)}const Bu=e=>e[0]>e[1]?[e[1],e[0]]:[e[0],e[1]],Iu=e=>e.duration/(e.particles?.speed||1);function Zu(e,t=Math.random){for(let i=0;i<8;i++){const i=Math.floor(4294967296*t())>>>0;if(i!==e)return i}return(e??0)+1>>>0}const Wu=e=>+e.toFixed(2);function Ku(e,t){const i=e.particles??rt,n=Iu(e),s=Wu((Eu.has(i.direction)?Math.max(10,i.spread):100)/n),r=Wu(i.spin/n);return{engine:1,mode:"baked",seed:t>>>0,flow:i.direction,shapes:i.shape?[{shape:i.shape,weight:1}]:[],ranges:{speed:[s,s],spin:[r,r],delay:[0,Wu(n)],lifetime:[Wu(n),Wu(n)],opacity:[1,1]},physics:{gravity:{angle:i.gravity<0?180:0,strength:Wu(Math.abs(i.gravity)*Nu)},drag:0,turbulence:{strength:0,scale:25},bounce:.5},colliders:{floor:!1,ceiling:!1,left:!1,right:!1,content:"none"}}}const Uu=(e,t)=>e.particles?.sim??Ku(e,t),Gu=e=>!!e.particles?.sim;function Yu(e){const t=e.strength/Nu*Math.cos(e.angle*Math.PI/180);return _u(Math.round(100*t)/100,-1,1)||0}function Ju(e,t){const i=t.shapes.find(e=>!("builtin"in e.shape))?.shape,n=_u(Math.round(t.ranges.spin[1]*Iu(e)),$u.spin.min,$u.spin.max),s=Mu(e,{sim:t,direction:yo[t.flow],gravity:Yu(t.physics.gravity),spin:n});return i?s.particles.shape=i:delete s.particles.shape,s}const Xu=(e,t,i)=>Ju(e,i(Uu(e,t))),Qu=e=>e.shapes.length?e.shapes:[{shape:{builtin:"circle"},weight:1}];function em(e,t){if(!Gu(e)){const t=e.particles?.spin??0;return[t,t]}const i=Iu(e);return[Math.round(t.ranges.spin[0]*i),Math.round(t.ranges.spin[1]*i)]}function tm(e,t,i,n){const s=Wu(_u(n,0,1));return!Gu(e)&&(0===i||180===i&&s>0)?Mu(e,{gravity:180===i?-s:s}):Xu(e,t,e=>({...e,physics:{...e.physics,gravity:{angle:i,strength:Wu(s*Nu)}}}))}const im=(e,t,i)=>Xu(e,t,e=>({...e,seed:Zu(e.seed,i)}));function nm(e,t){const i=e.reduce((e,t)=>e+t.weight,0);return i>0?5*Math.round((e[t]?.weight??0)/i*20):0}function sm(e){const t=new Set(e.map(e=>Ou(e.shape)));return{builtin:["star","heart","circle","spark","square","triangle","ring","line"].find(e=>!t.has(e))??"circle"}}const rm=e=>e.floor||e.ceiling||e.left||e.right||"none"!==e.content;function am(e){return{trigger:rm(e.colliders)?"collision":"death",count:6,shapes:[{shape:{builtin:"spark"},weight:1}],size:[2,4],colors:[],ranges:{speed:[30,60],lifetime:[.6,.6],opacity:[1,1],spin:[0,0]},cone:360,inherit:.2}}const om=[{angle:0,name:1099,icon:"mdi:arrow-down"},{angle:45,name:1100,icon:"mdi:arrow-bottom-left"},{angle:90,name:1115,icon:"mdi:arrow-left"},{angle:135,name:1147,icon:"mdi:arrow-top-left"},{angle:180,name:1146,icon:"mdi:arrow-up"},{angle:225,name:1148,icon:"mdi:arrow-top-right"},{angle:270,name:1129,icon:"mdi:arrow-right"},{angle:315,name:1101,icon:"mdi:arrow-bottom-right"}],lm=e=>{const t=om.find(t=>t.angle===e);return t?Gn(t.name):Gn(1093,{angle:e})},cm=e=>String(+e.toFixed(2)),dm=(e,t="")=>e[0]===e[1]?`${cm(e[0])}${t}`:Gn(1187,{from:cm(e[0]),to:cm(e[1]),unit:t}),pm=[{id:"floor",label:336},{id:"ceiling",label:127},{id:"left",label:412},{id:"right",label:745},{id:"content",label:180}],hm=(e,t)=>"content"===t?"none"!==e.content:e[t];let um;const mm=()=>um;function gm(e,t=0){const i="particles"===e.kind?e.particles:void 0;if(i&&!i.preset)return{...i,sim:i.sim??Ku(e,t)}}const fm=e=>1+(e.particles?.sim?.emitters?.length??0);function vm(e){return(e.particles?.count??rt.count)+(e.particles?.sim?.emitters??[]).reduce((e,t)=>e+t.count,0)}const bm=e=>Math.max(0,_o.parents-vm(e)),ym=e=>fm(e)<_o.emitters&&bm(e)>=1,xm=(e,t)=>e.layer??t;function _m(e,t){const i=e.particles??rt,n=Uu(e,t);return[{id:n.id??"",...void 0!==n.name?{name:n.name}:{},layer:i.layer,seed:n.seed,count:i.count,size:[i.size[0],i.size[1]],colors:[...i.colors],fade:i.fade,spread:i.spread,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics,...n.children?{children:n.children}:{}},...(n.emitters??[]).map(e=>({...e,layer:xm(e,i.layer)}))]}function wm(e,t,i){const n=Uu(e,t),[s,...r]=i,a={...n,seed:s.seed,flow:s.flow,shapes:s.shapes,ranges:s.ranges,physics:s.physics};if(s.children?a.children=s.children:delete a.children,delete a.id,delete a.name,delete a.emitters,i.length>1){const e=new Set,t=i.map(t=>t.id&&!e.has(t.id)?(e.add(t.id),t.id):"").map(t=>{if(t)return t;let i=1;for(;e.has(`e${i}`);)i++;return e.add(`e${i}`),`e${i}`});a.id=t[0],s.name&&(a.name=s.name),a.emitters=r.map((e,i)=>{const{layer:n,name:r,...a}=e;return{...a,id:t[i+1],...r?{name:r}:{},...n!==s.layer?{layer:n}:{}}})}return Ju(Mu(e,{count:s.count,size:s.size,colors:s.colors,fade:s.fade,spread:s.spread,layer:s.layer}),a)}const $m=(e,t)=>Number.isInteger(t)&&t>=0&&t<fm(e);function km(e,t,i,n){if(!$m(e,i)||fm(e)<2)return e;const s=(e=>e.trim().slice(0,40).trim())(n),r=e.particles.sim;if((0===i?r.name:r.emitters[i-1].name)===(s||void 0))return e;const a=_m(e,t);return s?a[i].name=s:delete a[i].name,wm(e,t,a)}function Mm(e,t){const i=e.particles??rt;return t<=0?i.layer:xm(i.sim?.emitters?.[t-1]??{},i.layer)}function Sm(e,t,i){if(i<=0||i>=fm(e))return e;const n=_m(e,t)[i],s={...Uu(e,t),seed:n.seed,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics};return delete s.id,delete s.name,delete s.emitters,delete s.children,n.children&&(s.children=n.children),Ju(Mu(e,{count:n.count,size:n.size,colors:n.colors,fade:n.fade,spread:n.spread,layer:n.layer}),s)}function jm(e,t,i,n){const s=Sm(e,t,i);if(s===e)return n(e);const r=n(s);if(r===s)return e;const a=r.particles,o=a.sim,l=e.particles.sim,c=l.emitters.map((t,n)=>{if(n!==i-1)return t;const s={...t};return delete s.children,{...s,seed:o.seed,flow:o.flow,shapes:o.shapes,ranges:o.ranges,physics:o.physics,count:Math.max(1,Math.min(a.count,t.count+bm(e))),size:a.size,colors:a.colors,fade:a.fade,spread:a.spread,...o.children?{children:o.children}:{}}});return Mu(e,{speed:a.speed,sim:{...l,mode:o.mode,colliders:o.colliders,emitters:c}})}function Cm(e,t,i){const n=_m(e,t),s=n[i];if(s?.name)return s.name;if(n.length<2)return Gn(631);const r=/^e(\d+)$/.exec(s?.id??""),a=r?Number(r[1]):i+1;return a>1?Gn(637,{n:a}):Gn(631)}class Am extends O.WL{constructor(e){if(super(e),this.it=V.s6,e.type!==O.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===V.s6||null==e)return this._t=void 0,this.it=e;if(e===V.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}Am.directiveName="unsafeHTML",Am.resultType=1,(0,O.u$)(Am);class zm extends Am{}zm.directiveName="unsafeSVG",zm.resultType=2;const qm=(0,O.u$)(zm),Em=Object.freeze({kind:"svg",extensions:Object.freeze([".svg"]),mimeTypes:Object.freeze(["image/svg+xml"])}),Hm=Object.freeze({types:Object.freeze([Object.freeze({...Em,maxBytes:32768})])});Object.freeze({types:Object.freeze([Object.freeze({...Em,maxBytes:8388608})])});const Lm=1048576,Vm=["path","circle","ellipse","rect","line","polyline","polygon"],Om=/^(none|transparent)$/i,Pm=/^(currentcolor|inherit|black|#0{3}|#0{6})$/i,Rm=e=>Object.is(e,-0)?"-0":String(e),Nm=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Dm=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i,Tm=/^(butt|round|square)$/,Fm=/^(miter|round|bevel|arcs|miter-clip)$/;function Bm(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":Dm.test(t)?t:"currentColor"}function Im(e){const t=qa(e)?Bm(e.fill)??"currentColor":"none";let i=` id="${Nm(e.id)}" class="shape" d="${Nm(e.d)}" fill="${Nm(t)}"`;return Ea(e)&&(i+=` stroke="${Nm(Bm(e.stroke)??"currentColor")}" stroke-width="${e.stroke_width??1}"`,e.linecap&&(i+=` stroke-linecap="${e.linecap}"`),i+=' stroke-linejoin="round"'),`<path${i}/>`}function Zm(e,t){const i=We(/^\s*<svg[\s>]/i.test(e)?e:`<svg viewBox="${t}">${e}</svg>`);return i.error?"":i.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}function Wm(e){const t=e.accent?"mc-accent":"";if(!e.stroke)return e.evenodd?{cls:t,attrs:' fill="currentColor" fill-rule="evenodd"',key:`e${t}`}:{cls:t,attrs:' fill="currentColor"',key:`f${t}`};let i=` fill="none" stroke="currentColor" stroke-width="${+e.stroke.width.toFixed(3)}"`;return e.stroke.cap&&Tm.test(e.stroke.cap)&&(i+=` stroke-linecap="${e.stroke.cap}"`),e.stroke.join&&Fm.test(e.stroke.join)&&(i+=` stroke-linejoin="${e.stroke.join}"`),{cls:t,attrs:i,key:`s${t}${i}`}}function Km(e,t,i){const n=new Map;for(const t of e){const e=Wm(t),i=n.get(e.key)??{paint:e,d:[]};i.d.push(t.d),n.set(e.key,i)}const s=t?` id="${Nm(t)}"`:"",r=[...n.values()],a=(e,t)=>{const n=[t?i:"",e.paint.cls].filter(Boolean).join(" ");return`<path${t?s:""}${n?` class="${n}"`:""} d="${Nm(e.d.join(" "))}"${e.paint.attrs}/>`};return 1===r.length?a(r[0],!0):`<g${s} class="${i}">${r.map(e=>a(e,!1)).join("")}</g>`}const Um={not_svg:"No <svg> element found.",empty:"The SVG has no shapes to draw.",too_detailed:"A shape in the SVG is too detailed (over 8192 characters of path data).",too_many:"The SVG has too many shapes; at most {room} fit."};function Gm(e){const t=ja(e);return!t||function(e){let t=0;for(const i of Sa(e)){let e=0;for(let t=0,n=i.length-1;t<i.length;n=t++)e+=(i[n][0]+i[t][0])*(i[n][1]-i[t][1]);t+=Math.abs(e)/2}return t}(e)<.001*Math.max(t.w,t.h)}function Ym(e){if(void 0===e)return;const t=e.trim();return/^(none|transparent)$/i.test(t)?"none":lt(t,"color")&&!/url\(/i.test(t)?t:"currentColor"}function Jm(e){return e?.svg?Ca(We(e.svg).viewBox).join(" "):"0 0 24 24"}var Xm=i(2637);function Qm(e){const t=/^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(e);if(t)return`[data-${"part"===t[1]?"p":"group"===t[1]?"g":"s"}="${t[2]}"]`}const eg=e=>e.css.includes("stroke-dashoffset");function tg(e){const t=new Map;for(const i of e.css.matchAll(/(-?[\d.]+)% \{([^}]*)\}/g)){const e=/stroke-dashoffset: (-?[\d.]+)/.exec(i[2]);e&&t.set(Number(i[1]),Number(e[1])<=.001?1:0)}const i=[...t].sort((e,t)=>e[0]-t[0]),n=[];return i.forEach(([e,t],s)=>{const r=i[s-1];r&&r[1]!==t&&n.push([+(r[0]+(e-r[0])*(t?.75:.25)).toFixed(2),0]),n.push([e,t])}),n}function ig(e){const t=tg(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { fill-opacity: ${t}; }`);return`@keyframes ${e.name}-fill {\n${i.join("\n")}\n}`}function ng(e){const t=tg(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { stroke-opacity: ${1-t}; }`);return`@keyframes ${e.name}-outline {\n${i.join("\n")}\n}`}const sg=[".rig { color: var(--mc-rig-paint, var(--icon-primary-color, currentColor)); }",".rig .primary { fill: var(--mc-rig-fill, currentColor); }",".rig .outlines { stroke-opacity: 0; }",".rig [data-p], .rig [data-g], .rig [data-s] { transform-box: view-box; }",".rig .drawn { stroke-dasharray: 1; stroke-linecap: round; stroke-linejoin: round; }",".rig .outlines .drawn { stroke-linecap: butt; stroke-dasharray: 0.999 2; }","@media (prefers-reduced-motion: reduce) { .rig, .rig * { animation: none !important; } }"].join("\n");function rg(e,t,i={}){const n=[sg];if(i.still)return n.join("\n");const s=i.timing||"1s ease 0s infinite normal",r=new Set([...t.parts.map(e=>`part:${e.id}`),...(t.groups??[]).map(e=>`group:${e.id}`),...(t.shapes??[]).map(e=>`shape:${e.id}`)]);for(const t of e){const e=Qm(t.target);if(!e||!r.has(t.target)||!t.css)continue;const i=[t.name,...t.lanes??[]];n.push(t.css);const a=e=>`${e} ${s}`;if(eg(t)){const s=ig(t);s&&(n.push(s,ng(t)),i.push(`${t.name}-fill`),n.push(`.rig ${e} .outlines { animation: ${a(`${t.name}-outline`)}; }`)),n.push(`.rig ${e} { stroke: currentColor; }`,`.rig ${e} .primary, .rig ${e} .secondary { stroke: none; }`)}t.origin&&n.push(`.rig ${e} { transform-origin: ${t.origin} !important; }`),n.push(`.rig ${e} { animation: ${i.map(a).join(", ")}; }`)}return n.join("\n")}const ag=e=>String(+e.toFixed(3)),og=e=>[e[0]+e[2]/2,e[1]+e[3]/2],lg=e=>`transform-origin: ${ag(e[0])}px ${ag(e[1])}px`,cg=e=>(0,fe.Mj)(e).map(e=>(0,fe.ER)([e])),dg=new Map;function pg(e,t){const i=`${t}|${e}`;let n=dg.get(i);if(void 0===n){const s=We(`<svg viewBox="${t}">${e}</svg>`);n=s.error?null:{markup:s.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""),box:(0,Xm.Zg)([...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].map(Xm.hd)),outlines:[...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].flatMap(cg)},dg.size>100&&dg.clear(),dg.set(i,n)}return n??void 0}function hg(e,t,i="0 0 24 24"){return e.svg?pg(e.svg,i)?.box:(0,Xm.Zg)((e.from??[]).map(e=>t[e]?.bbox).filter(e=>!!e))}function ug(e,t,i="0 0 24 24"){const n=new Map,s=new Map;for(const r of e.parts){const e=hg(r,t,i);e&&s.set(r.id,e);const a=r.origin??(e?og(e):void 0);a&&n.set(`part:${r.id}`,a)}for(const t of e.groups??[]){const e=(0,Xm.Zg)(t.parts.map(e=>s.get(e)).filter(e=>!!e)),i=t.origin??(e?og(e):void 0);i&&n.set(`group:${t.id}`,i)}for(const t of e.shapes??[])n.set(`shape:${t.id}`,t.origin??og((0,Xm.hd)(t.d)));return n}const mg=e=>{if(!e)return;const t=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(e.trim());if(t){const e=void 0===t[1]?100:Math.min(100,Number(t[1]));return e>=100?"var(--mc-entity-color, currentColor)":`color-mix(in srgb, var(--mc-entity-color, currentColor) ${e}%, transparent)`}return lt(e,"color")},gg=e=>Object.entries(e).filter(([,e])=>void 0!==e&&!1!==e&&""!==e).map(([e,t])=>` ${e}="${(e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"))(t)}"`).join("");new WeakMap,new Map,new Map,new WeakMap;const fg=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;function vg(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":fg.test(t)?t:"currentColor"}const bg=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),yg=e=>String(+e.toFixed(4)),xg=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;function _g(e,t){const i=(e??"center").trim().split(/\s+/),n=(e,i)=>{const n=t[2+i],s=t[i];if(!e||"center"===e)return s+n/2;if("left"===e||"top"===e)return s;if("right"===e||"bottom"===e)return s+n;const r=parseFloat(e);return Number.isFinite(r)?e.endsWith("%")?s+n*r/100:s+r:s+n/2};let[s,r]=i;return"top"!==s&&"bottom"!==s&&("left"!==r&&"right"!==r||"center"!==s)||([s,r]=[r,s]),[n(s,0),n(r??"center",1)]}const wg={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function $g(e){const t=(G.find(t=>t.id===e)?.css??e??"ease").trim();if(/^steps\(/.test(t))return"steps";if(wg[t])return wg[t];const i=/^cubic-bezier\(([^)]*)\)$/.exec(t);if(i){const e=i[1].split(",").map(e=>Math.min(1,Math.max(0,Number(e))));if(4===e.length&&e.every(Number.isFinite))return e}return wg.ease}const kg={translate:"x",rotate:"rotate",scale:"scale",skewX:"skew",skewY:"skew",opacity:"opacity",color:"color",stroke:"stroke",draw:"draw"};function Mg(e,t){const i=e.transform;switch(t){case"translate":return!i||void 0===i.x&&void 0===i.y?void 0:[i.x??0,i.y??0];case"rotate":return void 0!==i?.rotate?[i.rotate]:void 0;case"scale":if(!i||void 0===i.scale&&void 0===i.scale_x&&void 0===i.scale_y)return;return[(i.scale??1)*(i.scale_x??1),(i.scale??1)*(i.scale_y??1)];case"skewX":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_x??0];case"skewY":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_y??0];case"opacity":return void 0!==e.opacity?[e.opacity]:void 0;case"color":return e.color?vg(e.color)??"currentColor":void 0;case"stroke":return e.stroke?vg(e.stroke)??"currentColor":void 0;case"draw":return void 0!==e.draw?[1-e.draw]:void 0}}const Sg=e=>"string"==typeof e?e:e.map(yg).join(" ");function jg(e){const t=e.easings.map($g),i=` keyTimes="${e.times.map(yg).join(";")}"`;return t.some(e=>"steps"===e)?` calcMode="discrete"${i}`:` calcMode="spline"${i} keySplines="${t.map(e=>e.map(yg).join(" ")).join(";")}"`}const Cg=e=>` dur="${yg(e)}s" repeatCount="indefinite" begin="0s"`;function Ag(e,t,i,n){return`<animateTransform attributeName="transform" type="${e}" additive="sum" values="${t.values.map(e=>n(e)).join(";")}"${jg(t)}${Cg(i)}/>`}function zg(e,t,i){return`<animate attributeName="${e}" values="${t.values.map(Sg).join(";")}"${jg(t)}${Cg(i)}/>`}function qg(e,t,i,n,s){const r=[],a=t=>function(e,t,i){const n=e.filter(e=>void 0!==Mg(e,t));if(!n.length)return;const s=[],r=[],a=[],o=(e,t,i)=>{const n=Math.min(1,Math.max(0,e/100));if(s.length&&n<=s[s.length-1])return r[r.length-1]=t,void(a[a.length-1]=i);s.push(n),r.push(t),a.push(i)};n[0].at>0&&o(0,Mg(n[0],t),"linear");for(const e of n)o(e.at,Mg(e,t),e.easings?.[kg[t]]??e.easing??i);return s[s.length-1]<1&&o(100,r[r.length-1],"linear"),1===s.length&&(s.push(1),r.push(r[0]),a.push("linear")),a.pop(),{times:s,values:r,easings:a}}(e,t,n),o=a("translate"),l=[a("rotate"),a("scale"),a("skewX"),a("skewY")],c=l.some(Boolean),[d,p]=c?t:[0,0];if(s){const e=An(s.d,32);if(e.length){const t={times:e.map(e=>e.t),values:e.map(e=>[e.x,e.y]),easings:e.slice(1).map(()=>"linear")};r.push(Ag("translate",t,i,e=>`${yg(e[0])} ${yg(e[1])}`))}}o?r.push(Ag("translate",o,i,e=>`${yg(e[0]+d)} ${yg(e[1]+p)}`)):c&&r.push(Ag("translate",{times:[0,1],values:[[d,p],[d,p]],easings:["linear"]},i,e=>`${yg(e[0])} ${yg(e[1])}`));const[h,u,m,g]=l;h&&r.push(Ag("rotate",h,i,e=>yg(e[0]))),u&&r.push(Ag("scale",u,i,e=>`${yg(e[0])} ${yg(e[1])}`)),m&&r.push(Ag("skewX",m,i,e=>yg(e[0]))),g&&r.push(Ag("skewY",g,i,e=>yg(e[0]))),c&&r.push(Ag("translate",{times:[0,1],values:[[-d,-p],[-d,-p]],easings:["linear"]},i,e=>`${yg(e[0])} ${yg(e[1])}`));const f=a("opacity");f&&r.push(zg("opacity",f,i));const v=a("color");v&&r.push(zg("color",v,i));const b=a("stroke");b&&r.push(zg("stroke",b,i));const y=a("draw");if(y){r.push(zg("stroke-dashoffset",y,i));const e=function(e){const t=e.times.map((t,i)=>[t,e.values[i][0]<=.001?1:0]),i=[],n=[];return t.forEach(([e,s],r)=>{const a=t[r-1];if(a&&a[1]!==s){const t=a[0]+(e-a[0])*(s?.75:.25);t>i[i.length-1]&&(i.push(t),n.push([0]))}(!i.length||e>i[i.length-1])&&(i.push(e),n.push([s]))}),{times:i,values:n,easings:i.slice(1).map(()=>"linear")}}(y);r.push(zg("fill-opacity",e,i)),r.push(zg("stroke-opacity",{...e,values:e.values.map(e=>[1-e[0]])},i))}return r.join("")}function Eg(e,t,i){const n=/^(part|group|shape):(.+)$/.exec(t);if(!n||!i)return e;const s="part"===n[1]?"data-p":"group"===n[1]?"data-g":"data-s",r=new RegExp(`(<(g|path) ${s}="${n[2]}"[^>]*>)`);return e.replace(r,e=>`${e}${i}`)}function Hg(e,t){const i=function(e,t){const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return;const n="part"===i[1]?"data-p":"group"===i[1]?"data-g":"data-s",s=new RegExp(`<(g|path) ${n}="${i[2]}"[^>]*>`).exec(e);if(!s)return;if("path"===s[1])return[s.index,e.indexOf("</path>",s.index)+7];const r=/<g\b[^>]*>|<\/g>/g;r.lastIndex=s.index+s[0].length;let a=1;for(let t=r.exec(e);t;t=r.exec(e))if(a+="</g>"===t[0]?-1:1,!a)return[s.index,t.index+4]}(e,t);if(!i)return e;const n=e.slice(i[0],i[1]).replace(/ class="(primary|secondary)"/g,' class="$1" stroke="none"');return e.slice(0,i[0])+n+e.slice(i[1])}function Lg(e){const t=e=>{const t={...e};return delete t.at,delete t.easing,delete t.easings,JSON.stringify(t)};return e.every(i=>t(i)===t(e[0]))}const Vg=new Set(["name","state","background"]);const Og=new Set(["svg","g","path","title","style","animate","animatetransform"]);var Pg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Rg=e=>Gn(1252,{size:(e/1024).toFixed(e<10240?1:0)}),Ng=e=>(new TextEncoder).encode(e).length;function Dg(e,t,i="image/svg+xml"){const n=URL.createObjectURL(new Blob([e],{type:i})),s=document.createElement("a");s.href=n,s.download=t,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}async function Tg(e){const t=await async function(e,t){const i=function(e,t){const i=e.name.lastIndexOf("."),n=e.name.slice(i<0?e.name.length:i).toLowerCase(),s=t.types.find(e=>e.extensions.includes(n))??t.types.find(t=>t.mimeTypes.includes(e.type))??(t.other&&{kind:"other",...t.other});return s?e.size>s.maxBytes?{code:"too_large",maxBytes:s.maxBytes}:s:{code:"wrong_type"}}(e,t);if("code"in i)return{ok:!1,...i};try{return{ok:!0,text:await e.text(),kind:i.kind,bytes:e.size,name:e.name}}catch{return{ok:!1,code:"unreadable"}}}(e,Hm);return t.ok?{text:t.text}:{error:"too_large"===t.code?Gn(923):"wrong_type"===t.code?Gn(144):Gn(942)}}let Fg=class extends s.WF{constructor(){super(...arguments),this.pieces=[],this.viewBox="0 0 24 24",this.disabled=!1,this._open=!1,this._mode="export",this._format="still",this._smil=!0,this._color="",this._text="",this._fileName="",this._status="",this._error="",this._over=!1,this._textSeq=0}openExport(e=!1){this._mode="export",this._format=e||this._isParticles?"animated":"still",this._manual=void 0,this._status="",this._error="",this._show()}openImport(e="",t=""){this._mode="import",this._text="",this._take(e),this._fileName=t,this._status="",this._error="",this._show()}close(){const e=this.renderRoot.querySelector("mc-ui-window");e?.open?e.close("action"):this._open=!1}get open(){return this._open}get _isParticles(){return"particles"===this.doc?.kind}get exportText(){return this._export().text}_export(){const e=this._exportMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox)return e;const t=this.doc?.rig??{parts:[]},i=function(e,t,i={}){const n=i.viewBox??Jm(e),s=new Map(t.map(e=>[e.index,e])),r=new Set,a=[],o=La(e.shapes??[]);for(const e of o)"under"===e.layer&&a.push(Im(e));const l=[];for(const t of e.parts??[])if(t.svg){const e=Zm(t.svg,n);e&&l.push(`<g id="${Nm(t.id)}" class="part" fill="currentColor">${e}</g>`)}else if(t.from?.length){const e=t.from.map(e=>(r.add(e),s.get(e))).filter(e=>!!e);e.length&&l.push(Km(e,t.id,"part"))}const c=t.filter(e=>!r.has(e.index));c.length&&a.push(Km(c,void 0,"base")),a.push(...l);for(const e of o)"under"!==e.layer&&a.push(Im(e));return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${Nm(n)}">\n${a.map(e=>`  ${e}`).join("\n")}\n</svg>`}(t,this.pieces,{viewBox:t.svg?void 0:this.viewBox}),n=(a=r=i,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(a).length:a.length)>qe?"The SVG is larger than 32 KB.":/<path|<g/.test(r)?We(r).error:"Nothing to save yet: draw a shape or use an icon."),s=n?"":We(i).markup;var r,a;return this._exportMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,text:i,error:n,clean:s},this._exportMemo}_animated(){const e=this._animMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox&&e.smil===this._smil&&e.color===this._color)return e;const t=this.doc?this._isParticles?function(e){const t=um;if(!t)return{svg:"",warnings:[Gn(962)]};const i=gm(e);if(!i)return{svg:"",warnings:[Gn(181)]};const n=t.bake({spec:i,period:Iu(e),geometry:wo}),s=[];return"live"===i.sim.mode&&s.push(Gn(422)),n.elements.some(e=>"icon"in e.shape||"emoji"in e.shape)&&s.push(Gn(372)),n.stats.capped&&s.push(Gn(956)),{svg:t.bakedSvg(n,{width:200,height:Math.round(200/wo.aspect)}),warnings:s}}(this.doc):function(e,t,i={}){const n=[],s=wt(e,{v2:"lenient"});if(!s.ok)return{svg:"",warnings:[Gn(927,{message:s.errors[0]?.message??Gn(1145)})]};const r=s.doc;if("keyframes"!==r.kind)return{svg:"",warnings:[Gn(603)]};r.clips?.length&&n.push(Gn(890)),r.bindings?.length&&n.push(Gn(1068)),"infinite"!==r.iterations&&n.push(Gn(944)),r.tracks?.some(e=>Vg.has(e.target))&&n.push(Gn(1014));const a=!1!==i.smil;a&&r.direction&&"normal"!==r.direction&&n.push(Gn(920)),a&&[...r.keyframes??[],...(r.tracks??[]).flatMap(e=>e.keyframes)].some(e=>e.transform?.axis)&&n.push("3D turns play flat in the SMIL fallback.");const o=t.viewBox||"0 0 24 24",l=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(o),c=(0,Xm.WP)(t),d=r.rig??{parts:[]},p=Un(r),h=function(e){return new Set(e.filter(e=>Qm(e.target)&&eg(e)).map(e=>e.target))}(p);let u=function(e,t,i={}){const n=i.viewBox??"0 0 24 24",s=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(n),r=i.drawn??new Set,a=ug(e,t,n),o=ag(s[2]/24*1.2),l=new Set(e.parts.flatMap(e=>e.from??[])),c=new Map;for(const t of e.groups??[])for(const e of t.parts)c.has(e)||c.set(e,t.id);const d=(e,t=!1)=>e.stroke?(t?cg(e.d):[e.d]).map(i=>`<path${gg({class:t&&"drawn",d:i,fill:"none",stroke:"currentColor","stroke-width":ag(e.stroke.width),"stroke-linecap":e.stroke.cap,"stroke-linejoin":e.stroke.join,pathLength:t&&"1"})}></path>`).join(""):`<path${gg({class:e.secondary?"secondary":"primary",d:e.d,"fill-rule":e.evenodd&&"evenodd"})}></path>`,p=e=>e.length?`<g class="outlines">${e.map(e=>`<path${gg({class:"drawn",d:e,fill:"none",pathLength:"1","stroke-width":o})}></path>`).join("")}</g>`:"";let h=!1;const u=(e,i)=>{const s=i||r.has(`part:${e.id}`),o=a.get(`part:${e.id}`),l=`<g${gg({"data-p":e.id,style:o&&lg(o)})}>`;if(e.svg){const t=pg(e.svg,n);return t?(h=!0,`${l}${t.markup}${s?p(t.outlines):""}</g>`):""}const c=(e.from??[]).map(e=>t[e]).filter(e=>!!e);if(!c.length)return"";h=!0;const u=c.filter(e=>!e.stroke);return`${l}${c.map(e=>d(e,s)).join("")}${s?p(u.flatMap(e=>cg(e.d))):""}</g>`},m=new Set;let g="";for(const t of e.parts){const i=c.get(t.id);if(!i){g+=u(t,!1);continue}if(m.has(i))continue;m.add(i);const n=r.has(`group:${i}`),s=e.parts.filter(e=>c.get(e.id)===i).map(e=>u(e,n)).join(""),o=a.get(`group:${i}`);g+=`<g${gg({"data-g":i,style:o&&lg(o)})}>${s}</g>`}const f=e.shapes??[],v=e=>f.filter(t=>t.layer===e).map(e=>function(e,t,i){const n=mg(e.fill)??(e.stroke?"none":"currentColor"),s=mg(e.stroke),r=[`fill: ${n}`,s?`stroke: ${s}`:"",t?lg(t):""].filter(Boolean).join("; ");return`<path${gg({"data-s":e.id,class:i&&"drawn",d:e.d,pathLength:i&&"1","stroke-width":e.stroke_width??(i||s?1:void 0),"stroke-linecap":e.linecap,style:r})}></path>`}(e,a.get(`shape:${e.id}`),r.has(`shape:${e.id}`))).join("");if(!h&&!f.length)return;const b=t.filter(e=>!l.has(e.index)).map(e=>d(e)).join("");return`<g class="rig">${v("under")}${b}${g}${v("over")}</g>`}(d,c,{viewBox:o,drawn:h});if(u||(u=`<g class="rig">${c.map(e=>`<path class="${e.secondary?"secondary":"primary"}" d="${bg(e.d)}"${e.evenodd?' fill-rule="evenodd"':""}></path>`).join("")}</g>`),!c.length&&!d.shapes?.length)return{svg:"",warnings:[...n,Gn(947)]};const m=r.duration,g=`${yg(m)}s ${yn(r.easing)} 0s infinite ${r.direction??"normal"}`,f=i.color?lt(i.color,"color"):void 0;i.color&&!f&&n.push(Gn(936));const v=f?vg(f)??"currentColor":void 0,b=`mc-a-${fn(`${u}|${JSON.stringify(r)}|${a}|${f??""}`)}`,y=vn(r),x=xn(r.id),_=r.origin||"center",w=[],$=(e,t,i,n)=>{if(Lg(i))return;const s=Sn(t,i,x);w.push(s.css,`.${b} .mc-css .${e} { transform-box: view-box; transform-origin: ${n??_}; animation: ${[t,...s.lanes].map(e=>`${e} ${g}`).join(", ")}; }`)},k=r.tracks?.find(e=>"element"===e.target),M=r.tracks?.find(e=>"icon"===e.target);$("mc-el",`${y}-el`,r.keyframes??[]),$("mc-et",`${y}-et`,k?.keyframes??[],k?.origin),$("mc-it",`${y}-it`,M?.keyframes??[],M?.origin);const S=[`.${b} { --mc-anim-c: ${f??"currentColor"};${f?` color: ${f};`:""} }`,...a?[`.${b} .mc-css { visibility: visible; }`,`.${b} .mc-smil { display: none; }`]:[],(C=rg(p,d,{timing:g}),C.replace(/(^|[\s,{])\.rig\b/g,`$1.${b} .mc-css .rig`)),...w,...w.length?[`@media (prefers-reduced-motion: reduce) { .${b} .mc-el, .${b} .mc-et, .${b} .mc-it { animation: none !important; } }`]:[]].join("\n"),j=[];var C,A;if(j.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bg(l.join(" "))}" class="mc-anim ${b}"${v?` color="${bg(v)}"`:""}>`),j.push(`<title>${bg(r.name)}</title>`),j.push(`<style>\n${S}\n</style>`),j.push(`<g class="mc-css"${a?' visibility="hidden"':""}>${A=u,`<g class="mc-el"><g class="mc-et"><g class="mc-it">${A}</g></g></g>`}</g>`),a){let e=u.replace(/ style="([^"]*)"/g,(e,t)=>t.split(";").map(e=>e.trim()).filter(Boolean).map(e=>{const[t,...i]=e.split(":"),n=t.trim(),s=i.join(":").trim();return"fill"===n||"stroke"===n?` ${n}="${bg("none"===s?"none":vg(s)??"currentColor")}"`:""}).join("")).replace(/ class="drawn"/g,' class="drawn" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"').replace(/<g class="outlines">[\s\S]*?<\/g>/g,e=>e.replace(/stroke-linecap="round"/g,'stroke-linecap="butt"').replace(/stroke-dasharray="1"/g,'stroke-dasharray="0.999 2"')).replace(/<g class="outlines">/g,'<g class="outlines" stroke="currentColor">').replace(/<g class="rig">/,'<g class="rig" fill="currentColor">');const t=ug(d,c,o),i=[0,0,l[2],l[3]];for(const n of r.tracks??[])/^(part|group|shape):/.test(n.target)&&(h.has(n.target)&&(e=Hg(e,n.target)),e=Eg(e,n.target,qg(n.keyframes,n.origin?_g(n.origin,i):t.get(n.target)??_g("center",l),m,r.easing,n.path)));const n=_g(_,l),s=(e,t,i)=>{const n=e&&!Lg(e)?qg(e,t,m,r.easing):"";return n?`<g>${n}${i}</g>`:i};e=s(M?.keyframes,M?.origin?_g(M.origin,l):n,e),e=s(k?.keyframes,k?.origin?_g(k.origin,l):n,e),e=s(r.keyframes,n,e),j.push(`<g class="mc-smil">${e}</g>`)}j.push("</svg>");const z=j.join("\n");return xg(z)>262144&&n.push(Gn(943,{size:Math.round(xg(z)/1024)})),{svg:z,warnings:n}}(this.doc,function(e,t="0 0 24 24"){const i=e=>!(!e.accent&&!e.secondary),n=e.filter(e=>!e.stroke&&!i(e)),s=e.filter(e=>!e.stroke&&i(e)),r=e.filter(e=>e.stroke),a=e=>e.map((e,t)=>e.evenodd?t:-1).filter(e=>e>=0),o={paths:a(n),accent:a(s)};return{paths:n.map(e=>e.d),viewBox:t,...s.length?{secondary:s.map(e=>e.d)}:{},...r.length?{strokes:r.map(e=>({d:e.d,width:e.stroke.width,...e.stroke.cap?{cap:e.stroke.cap}:{},...e.stroke.join?{join:e.stroke.join}:{},...i(e)?{accent:!0}:{}}))}:{},...o.paths.length||o.accent.length?{evenodd:o}:{}}}(this.pieces,this.viewBox),{smil:this._smil,...this._color?{color:this._color}:{}}):{svg:"",warnings:[]},i=t.svg?function(e){if(/<script|<foreignobject|<iframe|<image|<use|<!entity|<!doctype/i.test(e))return Gn(177);if(/\son[a-z]+\s*=/i.test(e))return Gn(178);if(/\shref\s*=|xlink:/i.test(e))return Gn(176);if(/url\(\s*['"]?(?!#)/i.test(e)||/@import|javascript:|expression\s*\(/i.test(e))return Gn(179);for(const t of e.matchAll(/<([a-zA-Z][\w-]*)/g))if(!Og.has(t[1].toLowerCase()))return Gn(1032,{element:t[1]});let t=e.replace(/<style>[\s\S]*?<\/style>/g,"").replace(/<animate(Transform)?\b[^>]*\/>/g,"");xg(t)>qe&&t.includes('<g class="mc-smil">')&&(t=`${t.slice(0,t.indexOf('<g class="mc-smil">'))}</svg>`);const i=We(t);return i.error?i.error:i.paths.length||i.strokes.length||i.accentPaths.length?void 0:Gn(589)}(t.svg):t.warnings[0]??Gn(592),n=t.svg?t.warnings:t.warnings.slice(1),s="function"==typeof getComputedStyle?getComputedStyle(this).getPropertyValue("--state-icon-color").trim():"",r=/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(s)?s:"#44739e",a=this._color?t.svg:t.svg.replace('class="mc-anim ',`color="${r}" class="mc-anim `),o=t.svg&&!i?`data:image/svg+xml;charset=utf-8,${encodeURIComponent(a)}`:"";return this._animMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,smil:this._smil,color:this._color,text:t.svg,warnings:n,error:i,url:o},this._animMemo}_ready(){return this._cssLoad??=(async()=>{let e;try{const t=await Promise.race([i.e(417).then(()=>i(8844)),new Promise(t=>{e=setTimeout(t,1e4,void 0)})]);return t?"2026.10.12-beta.17"!==t.BUILD?void console.warn("Magic Card was updated, reload the page (magic-card-svg-css.js)"):t.resolveCss:void console.warn("Magic Card: magic-card-svg-css.js did not load")}catch{return void console.warn("Magic Card: magic-card-svg-css.js did not load")}finally{clearTimeout(e)}})().then(e=>{this._css=e})}_take(e){const t=++this._textSeq,i=()=>{t===this._textSeq&&(this._text=e)};if(!e)return i(),Promise.resolve();const n=this._ready().then(i);return this._taking=n,n}async getUpdateComplete(){return await this._taking,super.getUpdateComplete()}_sourceError(){return this._srcMemo?.text!==this._text&&(this._srcMemo={text:this._text,error:We(this._text,{css:this._css}).error}),this._srcMemo.error}async _copy(e,t,i){const n=await async function(e,t){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.style.cssText="position:fixed;left:-9999px;top:0;opacity:0",(t??document.body).appendChild(i),i.select();const n=document.execCommand("copy");return i.remove(),n}catch{return!1}}(e,this.renderRoot.querySelector("mc-ui-window"));n?(this._manual=void 0,this._status=i):(this._manual={label:t,text:e},this._status=Gn(187))}async _show(){const e=gd()??void 0;this._open=!0,await this.updateComplete;const t=this.renderRoot.querySelector("mc-ui-window");t&&!t.open&&(t.opener=e,t.show())}updated(e){if(e.has("_manual")&&this._manual){const e=this.renderRoot.querySelector("textarea.manual");e?.focus(),e?.select()}if(e.has("_status")&&this._status){const e=this._status;setTimeout(()=>{this._status===e&&(this._status="")},2500)}}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_imported(){if(!this._text||!this.doc)return;const e=this._importMemo;if(e&&e.text===this._text&&e.doc===this.doc&&e.viewBox===this.viewBox)return e.r;const t=en-(this.doc.rig?.shapes?.length??0),i=function(e,t,i=[],n=48,s){const r=We(e,{css:s});if(r.error)return{error:r.error};const a=Aa(r.viewBox,t),o=function(e,t){const i="undefined"==typeof DOMParser?void 0:(new DOMParser).parseFromString(e,"image/svg+xml").documentElement;if(!i||"svg"!==i.localName)return{ok:!1,error:"not_svg"};const n=Math.min(t.maxShapes??1e4,1e4),s=Math.min(t.maxPathChars??Lm,Lm),r={transforms:!1,colours:!1,opacity:!1,mergedGroups:!1},a=[],o=[];let l,c=0;const d=e=>(void 0!==t.paint?.(e)||Om.test(e)||Pm.test(e)||(r.colours=!0),e),p=(e,t)=>{const i=t=>e.getAttribute(t)?.trim(),n={...t},s=i("fill");void 0!==s&&(n.fill=d(s));const a=i("stroke");void 0!==a&&(n.stroke=d(a));const o=parseFloat(i("stroke-width")??"");Number.isFinite(o)&&o>=0&&(n.width=o);const l=i("stroke-linecap");"butt"!==l&&"round"!==l&&"square"!==l||(n.cap=l);const c=i("stroke-linejoin");"miter"!==c&&"round"!==c&&"bevel"!==c||(n.join=c);const p=i("fill-rule");"evenodd"!==p&&"nonzero"!==p||(n.evenodd="evenodd"===p),(i("class")??"").split(/\s+/).includes("mc-accent")&&(n.accent=!0),(i("opacity")||i("fill-opacity")||i("stroke-opacity"))&&(r.opacity=!0);const h=parseFloat(i("opacity")??"");return Number.isFinite(h)&&(n.opacity=(n.opacity??1)*Math.min(Math.max(h,0),1)),n},h=(e,i,d,u,m)=>{const g=e.localName.toLowerCase(),f=Vm.find(e=>e===g);if(l||!f&&"g"!==g&&"svg"!==g)return;const v=e.getAttribute("transform");v&&(r.transforms=!0);const b=v?Ce(i,Ae(v)):i,y=p(e,d);if("g"===g){let i=u,n=m;if(t.keepGroups)if(m<4){const t=e.getAttribute("id");o.push({...void 0===u?{}:{parent:u},...t?{id:t}:{}}),i=o.length-1,n++}else r.mergedGroups=!0;for(const t of e.children)h(t,b,y,i,n);return}if(!f)return;const x=ze(e,g);if(!x)return;if(a.length>=n)return void(l="too_many");const _=function(e,t){const i=e=>`${Rm(t[0]*e[0]+t[2]*e[1]+t[4])} ${Rm(t[1]*e[0]+t[3]*e[1]+t[5])}`;return(0,fe.Rr)(e).map(e=>`M${i(e.start)}${e.segs.map(e=>e.c1&&e.c2?`C${i(e.c1)} ${i(e.c2)} ${i(e.to)}`:`L${i(e.to)}`).join("")}${e.closed?"Z":""}`).join("")}(x,b);if(!_)return;if(c+=_.length,c>s)return void(l="too_detailed");const w=e.getAttribute("id"),$={from:f,d:_,fill:y.fill,stroke:y.stroke,strokeWidth:y.width*Math.sqrt(Math.abs(b[0]*b[3]-b[1]*b[2])),cap:y.cap,join:y.join,evenodd:y.evenodd,opacity:y.opacity,accent:y.accent,group:u,...w?{id:w}:{}};a.push(t.each?t.each(e,$):$)},u=Ae(i.getAttribute("transform"));i.getAttribute("transform")&&(r.transforms=!0);const m=t.matrix?Ce(t.matrix,u):u,g=p(i,{width:1,accent:!1});for(const e of i.children)h(e,m,g,void 0,0);return l?{ok:!1,error:l}:a.length?{ok:!0,shapes:a,groups:o,viewBox:t.viewBox,notes:r}:{ok:!1,error:"empty"}}(r.markup,{viewBox:t,keepGroups:!1,maxShapes:n,maxPathChars:Math.min(n*nt,Lm),matrix:[a.k,0,0,a.k,a.dx,a.dy]});if(!o.ok)return{error:Um[o.error].replace("{room}",String(n))};const l=new Set(i),c=[];for(const e of o.shapes){const t=$a(e.d,e=>e);if(t.length>nt)return{error:Um.too_detailed};if(!t)continue;const i=e.id??"",n=tn.test(i)&&!l.has(i)?i:Ra([...l],"shape");l.add(n);const s={id:n,name:i&&tn.test(i)?i:`Shape ${c.length+1}`,d:t,layer:"over"},r="line"===e.from?"none":Ym(e.fill)??"currentColor",o=Ym(e.stroke),d=e.strokeWidth??1;o&&"none"!==o?(s.stroke=o,s.stroke_width=Math.round(1e3*d)/1e3,"round"!==e.cap&&"butt"!==e.cap&&"square"!==e.cap||(s.linecap=e.cap),"none"!==r&&(s.fill=r)):"none"===r||Gm(t)?(s.stroke="currentColor",s.stroke_width=Math.round(1e3*Math.max(a.k,.05))/1e3):s.fill=r,c.push(s)}return c}(this._text,this.viewBox,Ta(this.doc),t,this._css);return this._importMemo={text:this._text,doc:this.doc,viewBox:this.viewBox,r:i},i}async _pick(e){const t=e.target,i=t.files?.[0];t.value="",i&&await this._takeFile(i)}async _takeFile(e){const t=await Tg(e);if("error"in t)return this._error=ls(t.error),void this._take("");this._error="",this._fileName=e.name,await this._take(t.text)}_drop(e){e.preventDefault(),this._over=!1;const t=e.dataTransfer?.files?.[0];t&&this._takeFile(t)}_addShapes(e){if(!this.doc)return;let t=this.doc;for(const i of e)t=t&&Fa(t,i);if(!t)return void(this._error=Gn(1251,{shapes:en}));const i=Na(t);i?this._error=i:(this._emit(t,Gn(1179,{count:e.length})),this.close())}_useAsIcon(){if(!this.doc)return;const e=function(e,t,i,n){const s=We(t,{css:n});if(s.error)return{error:s.error};const r=e.rig??{parts:[]},a=Ca(i??Jm(r)).join(" "),o=Ca(s.viewBox).join(" "),l=Aa(a,o),c=a===o,d=e=>{return e.origin?{...e,origin:(t=e.origin,t&&!c?[Math.round(100*(t[0]*l.k+l.dx))/100,Math.round(100*(t[1]*l.k+l.dy))/100]:t)}:e;var t},p=e=>String(Math.round(1e4*e)/1e4),h=(r.parts??[]).filter(e=>!e.from).map(e=>d(c||!e.svg?e:{...e,svg:`<g transform="matrix(${p(l.k)} 0 0 ${p(l.k)} ${p(l.dx)} ${p(l.dy)})">${e.svg}</g>`})),u=r.shapes?.map(e=>c?e:d({...e,d:$a(e.d,e=>[e[0]*l.k+l.dx,e[1]*l.k+l.dy]),...void 0!==e.stroke_width?{stroke_width:Math.round(e.stroke_width*l.k*1e3)/1e3}:{}})),m=new Set(h.map(e=>e.id)),g=(r.groups??[]).map(e=>d({...e,parts:e.parts.filter(e=>m.has(e))})).filter(e=>e.parts.length),f=new Set([...(r.parts??[]).filter(e=>!m.has(e.id)).map(e=>`part:${e.id}`),...(r.groups??[]).filter(e=>!g.some(t=>t.id===e.id)).map(e=>`group:${e.id}`)]),v={...r,svg:s.markup,parts:h,...r.groups?{groups:g}:{},...u?{shapes:u}:{}};delete v.icon;const b={...e,rig:v};return e.tracks&&(b.tracks=e.tracks.filter(e=>!f.has(e.target)).map(e=>e.path&&!c&&/^(part|group|shape):/.test(e.target)?{...e,path:{...e.path,d:$a(e.path.d,e=>[e[0]*l.k,e[1]*l.k])}}:e)),e.bindings&&(b.bindings=e.bindings.filter(e=>!f.has(e.target))),b}(this.doc,this._text,this.viewBox,this._css);if("error"in e)return void(this._error=ls(e.error));const t=Na(e);t?this._error=t:(this._emit(e,"Use SVG as icon"),this.close())}_shapesPreview(e,t){return s.qy`<svg viewBox=${t} aria-hidden="true">
      ${La(e).map(e=>s.JW`<path d=${e.d} fill=${qa(e)?e.fill&&!/^entity|var\(/.test(e.fill)?e.fill:"currentColor":"none"}
            stroke=${Ea(e)?/^entity|var\(/.test(e.stroke)?"currentColor":e.stroke:"none"}
            stroke-width=${e.stroke_width??1} stroke-linecap=${e.linecap??"butt"} stroke-linejoin="round"></path>`)}
    </svg>`}_renderFormat(){const e=[["still",Gn(371),"mdi:image-outline"],["animated",Gn(63),"mdi:motion-play-outline"]];return s.qy`<div class="format">${zd({role:"radiogroup",label:Gn(1075),full:!0,value:this._format,items:e.map(([e,t,i])=>({value:e,label:t,icon:i})),onChange:e=>{this._format=e,this._status="",this._manual=void 0}})}</div>`}_renderManual(){return this._manual?s.qy`<div class="field">
          <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
          <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
        </div>`:s.s6}_renderAnimated(){const{text:e,warnings:t,error:i,url:n}=this._animated(),r=Ng(e);return s.qy`
      <div class="body">
        ${this._isParticles?s.s6:this._renderFormat()}
        <div class="top">
          <div class="preview">${n?s.qy`<img class="anim" src=${n} alt="" />`:s.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this._isParticles?Gn(17):Gn(16)}</span>
            <span class="muted">${Rg(r)}${r>262144?Gn(4):""}</span>
            ${this._isParticles?s.qy`<span class="muted">${Gn(109)}</span>`:s.qy`<span class="muted">${Gn(110)}</span>
            <div class="color-row">
              <label class="check">
                <input type="color" class="color" .value=${this._color||"#03a9f4"} @input=${e=>this._color=e.target.value} />
                ${this._color?s.qy`${Gn(166)} <span class="mono">${this._color}</span>`:Gn(172)}
              </label>
              ${this._color?s.qy`<button type="button" class="btn btn-text btn-sm color-reset" @click=${()=>this._color=""}>${Gn(1052)}</button>`:s.qy`<span class="muted">${Gn(90)}</span>`}
            </div>
            <label class="check">
              <input type="checkbox" class="smil" .checked=${this._smil} @change=${e=>this._smil=e.target.checked} />
              ${Gn(756)}
            </label>
            `}
            ${t.length?s.qy`<ul class="warn">${t.map(e=>s.qy`<li>${e}</li>`)}</ul>`:s.s6}
            ${i?s.qy`<p class="error" role="alert">${i}</p>`:s.s6}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-anim-code">${Gn(63)}</label></div>
          <textarea id="svg-anim-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._renderManual()}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!i} @click=${()=>this._copy(e,Gn(760),Gn(64))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Gn(186)}
        </button>
        <button
          type="button"
          class="btn btn-primary download"
          ?disabled=${!!i}
          @click=${()=>{Dg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}-animated.svg`),this._status=Gn(247)}}
        >
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${Gn(246)}
        </button>
      </div>
    `}_renderExport(){if("animated"===this._format)return this._renderAnimated();const{text:e,error:t,clean:i}=this._export(),n=Ng(e),r=this.doc?.rig?.parts?.length??0,a=this.doc?.rig?.shapes?.length??0,o=Math.min(100,n/qe*100);return s.qy`
      <div class="body">
        ${this._renderFormat()}
        <div class="top">
          <div class="preview">${i?qm(i):s.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this.pieces.length?Gn(1243,{parts:r,shapes:a}):Gn(1244,{parts:r,shapes:a})}</span>
            <span class="muted">${Gn(1191,{kb:Rg(n)})}</span>
            <div class="meter ${n>qe?"over":""}" role="meter" aria-label=${Gn(827)} aria-valuemin="0" aria-valuemax=${qe} aria-valuenow=${n}>
              <i style="width:${o}%"></i>
            </div>
            <span class="muted">${Gn(946)}</span>
            ${t?s.qy`<p class="error" role="alert">${t}</p>`:s.s6}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-code">SVG</label></div>
          <textarea id="svg-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._manual?s.qy`<div class="field">
              <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
              <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
            </div>`:s.s6}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!t} @click=${()=>this._copy(e,Gn(760),Gn(758))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Gn(186)}
        </button>
        <button type="button" class="btn btn-secondary download" ?disabled=${!!t} @click=${()=>{Dg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}.svg`),this._status=Gn(247)}}>
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${Gn(246)}
        </button>
        <button
          type="button"
          class="btn btn-primary use"
          ?disabled=${!!t}
          title=${Gn(183)}
          @click=${()=>this._copy(`icon: svg\nsvg: |\n${e.replace(/\r\n?/g,"\n").trim().split("\n").map(e=>`  ${e}`).join("\n")}\n`,Gn(120),Gn(119))}
        >
          <ha-icon icon="mdi:card-text-outline"></ha-icon>${Gn(1054)}
        </button>
      </div>
    `}_renderImport(){const e=this._imported(),t=e&&!("error"in e)?e:void 0,i=this._error||(e&&"error"in e?ls(e.error):"");return s.qy`
      <div class="body">
        ${this._text?s.qy`<div class="top">
              <div class="preview">${t?this._shapesPreview(t,this.viewBox):s.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
              <div class="facts">
                <span>${this._fileName||"SVG"}</span>
                ${t?s.qy`<span class="muted">${Gn(1168,{count:t.length})}</span>`:s.s6}
                <span class="muted">${Gn(38)}</span>
                ${i?s.qy`<p class="error" role="alert">${i}</p>`:s.s6}
              </div>
            </div>`:s.qy`<div
              class="drop ${this._over?"over":""}"
              @dragover=${e=>{e.preventDefault(),this._over=!0}}
              @dragleave=${()=>this._over=!1}
              @drop=${e=>this._drop(e)}
            >
              <ha-icon icon="mdi:file-upload-outline"></ha-icon>
              <span>${Gn(273)}</span>
              <label class="btn btn-secondary">
                ${Gn(146)}
                <input type="file" accept=".svg,image/svg+xml" class="sr-only" @change=${e=>this._pick(e)} />
              </label>
              ${i?s.qy`<p class="error" role="alert">${i}</p>`:s.s6}
            </div>`}
      </div>
      <div slot="footer" class="foot">
        ${this._text?s.qy`<button type="button" class="btn btn-text again" @click=${()=>{this._take("")}}>${Gn(145)}</button><span class="grow"></span>`:s.qy`<span class="grow"></span>`}
        <button type="button" class="btn btn-secondary use-icon" ?disabled=${!this._text||!!this._sourceError()} @click=${()=>this._useAsIcon()}>
          <ha-icon icon="mdi:star-four-points-outline"></ha-icon>${Gn(1050)}
        </button>
        <button type="button" class="btn btn-primary add" ?disabled=${!t} @click=${()=>t&&this._addShapes(t)}>
          <ha-icon icon="mdi:shape-plus-outline"></ha-icon>${Gn(26)}
        </button>
      </div>
    `}render(){return this._open?fd({heading:"import"===this._mode?Gn(382):this._isParticles?Gn(63):Gn(764),size:"m",onClose:()=>{this._open=!1,this._status=""}},"export"===this._mode?this._renderExport():this._renderImport()):s.s6}};Fg.styles=[Qp,s.AH`
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
        padding-inline-start: 18px;
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
    `],Pg([(0,r.MZ)({attribute:!1})],Fg.prototype,"doc",void 0),Pg([(0,r.MZ)({attribute:!1})],Fg.prototype,"pieces",void 0),Pg([(0,r.MZ)({type:String})],Fg.prototype,"viewBox",void 0),Pg([(0,r.MZ)({type:Boolean})],Fg.prototype,"disabled",void 0),Pg([(0,r.wk)()],Fg.prototype,"_open",void 0),Pg([(0,r.wk)()],Fg.prototype,"_mode",void 0),Pg([(0,r.wk)()],Fg.prototype,"_format",void 0),Pg([(0,r.wk)()],Fg.prototype,"_smil",void 0),Pg([(0,r.wk)()],Fg.prototype,"_color",void 0),Pg([(0,r.wk)()],Fg.prototype,"_text",void 0),Pg([(0,r.wk)()],Fg.prototype,"_fileName",void 0),Pg([(0,r.wk)()],Fg.prototype,"_status",void 0),Pg([(0,r.wk)()],Fg.prototype,"_error",void 0),Pg([(0,r.wk)()],Fg.prototype,"_over",void 0),Pg([(0,r.wk)()],Fg.prototype,"_manual",void 0),Fg=Pg([(0,r.EM)("mc-anim-svg-dialog")],Fg);var Bg=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Ig={circle:s.JW`<circle cx="12" cy="12" r="7"></circle>`,square:s.JW`<rect x="5" y="5" width="14" height="14" rx="1.5"></rect>`,triangle:s.JW`<path d="M12 4l8 15H4z"></path>`,star:s.JW`<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"></path>`,heart:s.JW`<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"></path>`,ring:s.JW`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="3"></circle>`,line:s.JW`<path d="M6 19L18 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`,spark:s.JW`<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"></path>`};function Zg(e){return Vu(e)?s.qy`<svg class="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${Ig[e]}</svg>`:s.qy`<ha-icon class="glyph" icon=${Hu.find(t=>t.id===e).icon}></ha-icon>`}const Wg=["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899","#ffffff","#f97316","#8b5cf6"];let Kg=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.emitter=0,this._shapes={},this._color=-1,this._chip=0,this._paused=!1,this._open={},this._baking=!1,this.all=!1,this._live="",this._seed=Zu(),this._bakeMs=0,this._bakeToken=0,this._applied=[],this._liveCss=new Map,this._previewCss="",this._shuffle=()=>{if(!this.doc)return;const e=this._multi&&this.all;let t=this.doc;for(let i=e?0:this._em;i<(e?fm(this.doc):this._em+1);i++)t=jm(t,this._seed,i,e=>im(e,this._seed));this._emit(t,"Shuffle")},this._openExport=()=>{this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)},this._convert=()=>{this.doc&&(this._emit(function(e){const t=e.particles??rt,i=Su(e),n=(i&&Cu[i.id])??{},s="count"===i?.particles?t.intensity??i.defaults.intensity:void 0,r=void 0!==s&&Number.isFinite(s)?_u(Math.round(s),1,tt):rt.count,{preset:a,intensity:o,...l}=t,c={...rt,...l,...n,count:r,size:[...n.size??l.size??rt.size],colors:[...n.colors??l.colors??[]]};return c.shape||delete c.shape,{...e,particles:c}}(this.doc),"Convert to custom particles"),this._focus('.mode-seg [aria-checked="true"]'))},this._addEmitter=()=>{if(!this.doc)return;const e=function(e,t){if(!ym(e))return e;const i=_m(e,t),n=structuredClone(i[0]);return delete n.name,n.id="",n.seed=Zu(i[0].seed,void 0),n.count=Math.min(10,i[0].count,bm(e)),wm(e,t,[...i,n])}(this.doc,this._seed);e!==this.doc&&(this._emit(e,"Add emitter"),this._select(fm(e)-1),this._focus('.em-tabs [aria-selected="true"]'))},this._dupEmitter=()=>{if(!this.doc)return;const e=function(e,t,i){if(!$m(e,i)||!ym(e))return e;const n=_m(e,t),s=structuredClone(n[i]);return s.id="",s.seed=Zu(n[i].seed,void 0),s.count=Math.min(n[i].count,bm(e)),s.name&&(s.name=Gn(1219,{name:s.name}).slice(0,40).trim()),n.splice(i+1,0,s),wm(e,t,n)}(this.doc,this._seed,this._em);e!==this.doc&&(this._emit(e,"Duplicate emitter"),this._select(this._em+1),this._focus('.em-tabs [aria-selected="true"]'))},this._removeEmitter=()=>{if(!this.doc)return;const e=this._em,t=function(e,t,i){if(!$m(e,i)||fm(e)<2)return e;const n=_m(e,t);return n.splice(i,1),wm(e,t,n)}(this.doc,this._seed,e);t!==this.doc&&(this._emit(t,"Remove emitter"),this._select(Math.max(0,e-1)),this._focus('.em-tabs [aria-selected="true"]'))},this._onFocusOut=e=>{const t=e.target;this._pending&&["f-svg","f-emoji","f-grav","f-drag","f-turb","f-bounce"].includes(t.id)&&this._settle()}}_emit(e,t,i=!1){if(this.disabled||e===this.doc)return;this._pending=i?{doc:e,label:t}:void 0;const n=i?{doc:e,label:t,transient:!0}:{doc:e,label:t};this.dispatchEvent(new CustomEvent("doc-change",{detail:n,bubbles:!0,composed:!0}))}_settle(){if(this._pending){const{doc:e,label:t}=this._pending;if(this._pending=void 0,this.disabled)return;this.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:e,label:t},bubbles:!0,composed:!0}))}}get _em(){return this.doc?Math.max(0,Math.min(Math.trunc(this.emitter)||0,fm(this.doc)-1)):0}get _vdoc(){const e=this.doc,t=this._em;return this._viewKey?.doc===e&&this._viewKey.em===t||(this._viewKey={doc:e,em:t,view:Sm(e,this._seed,t)}),this._viewKey.view}get _p(){return"particles"===this.doc?.kind?this._vdoc.particles:void 0}get _sim(){return Uu(this._vdoc,this._seed)}_on(e){return jm(this.doc,this._seed,this._em,e)}_patch(e,t,i=!1){this.doc&&this._emit(this._on(t=>Mu(t,e)),t,i)}_editSim(e,t,i=!1){this.doc&&this._emit(this._on(t=>Xu(t,this._seed,e)),t,i)}_editAll(e,t,i=!1){if(!this.doc)return;let n=this.doc;for(let t=0;t<fm(n);t++)n=jm(n,this._seed,t,t=>Xu(t,this._seed,e));this._emit(n,t,i)}_select(e,t=!1){this.emitter=e,this.all=t,this.dispatchEvent(new CustomEvent("emitter-change",{detail:{index:e,all:t},bubbles:!0,composed:!0}))}get _multi(){return!!this.doc&&fm(this.doc)>1}_name(e){return this._multi?Cm(this.doc,this._seed,e):Gn(631)}willUpdate(e){if(e.has("emitter")&&void 0!==e.get("emitter")&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._color=-1,this._chip=0,this._live=""),e.has("doc")){const t=e.get("doc");if(t&&t.id!==this.doc?.id&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._shapes={},this._color=-1,this._chip=0,this._seed=Zu(),this._stats=void 0,this.all=!1,this._live=""),this._p&&!this._p.preset){for(const e of this._sim.shapes)"builtin"in e.shape||(this._shapes={...this._shapes,[Ou(e.shape)]:e.shape});const e=Qu(this._sim).length;this._chip>=e&&(this._chip=e-1)}const i=this._p?.colors.length??0;this._color>=i&&(this._color=i-1)}}_preview(){const e=this.doc,t=this._p;if(!e||!t)return{css:""};if(t.preset)return{anim:cu({animations:[{id:"pv",preset:t.preset,intensity:t.intensity,duration:`${e.duration}s`,easing:e.easing,iterations:"infinite",direction:e.direction}]}),css:""};const i=Fn(e);if(!i.layer||!i.name)return{css:""};const n=+(e.duration/i.layer.speed).toFixed(3),s=[[i.name,i.layer],...i.split?[[i.split.name,i.split.layer]]:[]].map(([t,i])=>({preset:t,front:i.front,style:`--mc-fx-anim: ${t} ${n}s ${yn(e.easing)} 0s infinite ${e.direction??"normal"}; --mc-fx-dur: ${n}s; --mc-fx-delay: 0s`,particles:i.particles,...i.symbol?{symbol:i.symbol}:{}}));return{css:i.css,anim:{style:"",fx:s}}}updated(e){const t=this.renderRoot.querySelector("style[data-pv]");t&&t.textContent!==this._previewCss&&(t.textContent=this._previewCss),e.has("doc")&&this._scheduleBake(),this._applyModule()}disconnectedCallback(){super.disconnectedCallback(),this._release(),this._bakeToken++}_scheduleBake(){const e=mm(),t=this.doc&&this._p?.sim&&!this._p.preset?gm(this.doc):void 0,i=++this._bakeToken;if(!e||!t)return this._stats=void 0,void(this._baking=!1);this._bakeMs>150&&(this._baking=!0);const n=this.doc;setTimeout(()=>{if(i!==this._bakeToken)return;const s=performance.now();try{this._stats=e.bake({spec:t,period:Iu(n),geometry:wo}).stats}catch{this._stats=void 0}this._bakeMs=performance.now()-s,this._baking=!1},0)}_applyModule(){const e=mm(),t=this.doc&&this._p?.sim&&!this._p.preset?gm(this.doc):void 0,i=[...this.renderRoot.querySelectorAll(".stage .mc-anim-fx")];if(this._applied.some((e,t)=>e!==i[t])&&this._release(),!e||!t||!i.length||this._paused&&"live"===t.sim.mode)return void this._release();const n="function"==typeof matchMedia&&matchMedia(Gn(3)).matches;try{i.forEach((i,s)=>{e.apply(i,{useCss:(e,t)=>{this._liveCss.set(e,t);const i=this.renderRoot.querySelector("style[data-live]");i&&(i.textContent=[...this._liveCss.values()].join("\n"))},reducedMotion:n,content:()=>this.renderRoot.querySelector(".stage-module")??void 0,docId:this.doc.id,spec:t,period:Iu(this.doc),...1===s?{part:1}:{}})}),this._applied=i}catch{}}_release(){for(const e of this._applied)mm()?.release(e);this._applied=[]}_renderPreview(){const{anim:e,css:t}=this._preview();this._previewCss=t;const i=this._p,n=Su(this.doc),r=i.preset?void 0:this._sim,a=r?this._baking?Gn(82):`${this._multi?Gn(1242,{particles:vm(this.doc),emitters:fm(this.doc)}):Gn(1164,{count:i.count,flow:Gn(zu[r.flow]).toLowerCase()})} · ${"live"===r.mode?Gn(1117):Gn(1250,{seconds:+Iu(this.doc).toFixed(2)})}`:`${n?(0,K.t)(n.name):i.preset} · ${this.doc.duration} s`,o=!!r&&!!this._stats?.capped,l=!!r&&!o&&!!this._stats?.warn,c=!!r&&!!mm();return s.qy`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>${Gn(424)}</span></div>
        ${e?function(e){return e.fx.some(e=>e.seasonal)&&window.MagicCard?.loadSeasonal?.(),s.qy`${e.fx.map(e=>e.seasonal?s.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${e.preset} .scenes=${e.seasonal.scenes} .intensity=${e.seasonal.intensity} .seed=${`pv|${e.preset}`}></mc-seasonal>`:e.ring?s.qy`<mc-ring class="mc-anim-ring" data-fx=${e.preset} style=${e.style} .ring=${e.ring}></mc-ring>`:s.qy`<span class="mc-anim-fx" data-fx=${e.preset} ?data-front=${e.front} style=${e.style} aria-hidden="true">${e.particles.map(t=>{return s.qy`<i data-s=${t.shape??s.s6} style="--mc-anim-x: ${t.x}%; --mc-anim-phase: ${t.phase}; --mc-anim-k: ${t.k}${t.style?`; ${t.style}`:""}"
                >${i=t.symbol??e.symbol,i?"icon"in i?s.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:s.s6}</i
              >`;var i})}</span>`)}`}(e):s.s6}
      </div>
      <div class="preview-foot">
        <span class="sum">${a}</span>
        ${o?s.qy`<span class="chip is-warn trimmed">${Gn(1017)}</span>`:s.s6}
        ${c?s.qy`<button type="button" class="icon-btn sm export" aria-label=${Gn(63)} title=${Gn(763)} ?disabled=${this.disabled} @click=${this._openExport}>
              <ha-icon icon="mdi:motion-play-outline"></ha-icon>
            </button>`:s.s6}
        ${r?s.qy`<button type="button" class="icon-btn sm shuffle" aria-label=${Gn(823)} title=${Gn(824)} ?disabled=${this.disabled} @click=${this._shuffle}>
              <ha-icon icon="mdi:dice-5-outline"></ha-icon>
            </button>`:s.s6}
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused?"true":"false"}
          aria-label=${Gn(648)}
          title=${this._paused?Gn(668):Gn(648)}
          @click=${()=>this._paused=!this._paused}
        >
          <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
        </button>
      </div>
      ${o?s.qy`<p class="help cap-note">${Gn(997)}</p>`:s.s6}
      ${l?s.qy`<p class="help cap-note">${Gn(998)}</p>`:s.s6}
      <p class="help reduced-note">${Gn(705)}</p>
      ${c?s.qy`<mc-anim-svg-dialog .doc=${this.doc}></mc-anim-svg-dialog>`:s.s6}
    </div>`}_cols(e){if(!e||"function"!=typeof getComputedStyle)return 3;const t=getComputedStyle(e).gridTemplateColumns||"",i=/^repeat\((\d+)/.exec(t);return i?+i[1]:t.split(/\s+/).filter(e=>/px$/.test(e)).length||3}_radioKeys(e,t,i,n,s=0){const r=Math.max(0,t.indexOf(i));let a;const o="rtl"===b(this);if(e.key===(o?"ArrowLeft":"ArrowRight"))a=r+1;else if(e.key===(o?"ArrowRight":"ArrowLeft"))a=r-1;else if("ArrowDown"===e.key)a=r+(s||1);else if("ArrowUp"===e.key)a=r-(s||1);else if("Home"===e.key)a=0;else{if("End"!==e.key)return;a=t.length-1}e.preventDefault(),a=(a+t.length)%t.length,n(t[a])}_focus(e){this.updateComplete.then(()=>this.renderRoot.querySelector(e)?.focus())}_pickMode(e,t=!1){this.doc&&this._emit(function(e,t,i){return Uu(e,t).mode===i?e:Xu(e,t,e=>({...e,mode:i}))}(this.doc,this._seed,e),Gn("live"===e?1056:1051)),t&&this._focus(`.mode-seg [data-mode="${e}"]`)}_renderMode(e){const t=[["baked",Gn(81),"mdi:repeat"],["live",Gn(421),"mdi:pulse"]];return s.qy`<section class="group" aria-labelledby="h-mode">
      <div class="group-head"><h3 id="h-mode">${Gn(447)}</h3></div>
      <div
        class="seg full mode-seg"
        role="radiogroup"
        aria-label=${Gn(825)}
        @keydown=${t=>this._radioKeys(t,["baked","live"],e.mode,e=>this._pickMode(e,!0))}
      >
        ${t.map(([t,i,n])=>s.qy`<button
            type="button"
            role="radio"
            data-mode=${t}
            aria-checked=${e.mode===t?"true":"false"}
            tabindex=${e.mode===t?0:-1}
            @click=${()=>this._pickMode(t)}
          >
            <ha-icon icon=${n}></ha-icon>${i}
          </button>`)}
      </div>
      <div class="mode-status" role="status">
        ${"live"===e.mode?s.qy`<p class="note is-warn live-warning"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${Gn(423)}</span></p>`:s.qy`<p class="help">${Gn(979)}</p>`}
      </div>
    </section>`}_chips(){return Qu(this._sim)}_setShapes(e,t,i=!1){this.doc&&this._emit(this._on(t=>function(e,t,i){const n=1===i.length?i[0].shape:void 0;return Gu(e)||i.length&&(!n||"builtin"in n&&"circle"!==n.builtin)?Xu(e,t,e=>({...e,shapes:i.map(e=>({shape:e.shape,weight:e.weight}))})):function(e,t){const i=Mu(e,{});return t?i.particles.shape=t:delete i.particles.shape,i}(e,n&&!("builtin"in n)?n:void 0)}(t,this._seed,e)),t,i)}_setChip(e,t,i,n=!1){const s=this._chips().map((i,n)=>n===e?{shape:t,weight:i.weight}:i);this._setShapes(s,i,n)}_shapeFor(e){return Vu(e)?{builtin:e}:this._shapes[e]??uu[e]}_pickKind(e,t=!1){const i=this._chips()[this._chip];i&&Ou(i.shape)!==e&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._setChip(this._chip,this._shapeFor(e),`Use ${e}`)),t&&this._focus(`.shapes.main [data-kind="${e}"]`)}_addShape(){const e=this._chips();e.length>=Ru||(this._chip=e.length,this._setShapes([...e,{shape:sm(e),weight:1}],Gn(34)))}_removeShape(e){const t=this._chips();t.length<=1||(this._chip=Math.max(0,Math.min(e,t.length-2)),this._setShapes(t.filter((t,i)=>i!==e),Gn(718)),this._focus(`.schip[data-i="${this._chip}"]`))}_shapeGrid(e,t,i,n){const r=Hu.map(e=>e.id),a=e??r[0];return s.qy`<div
      class="shapes ${t}"
      role="radiogroup"
      aria-label=${i}
      @keydown=${e=>this._radioKeys(e,r,a,e=>n(e,!0),this._cols(e.currentTarget))}
    >
      ${Hu.map(t=>s.qy`<button
          type="button"
          class="dir shape-tile"
          role="radio"
          data-kind=${t.id}
          aria-checked=${t.id===e?"true":"false"}
          tabindex=${t.id===a?0:-1}
          @click=${()=>n(t.id,!1)}
        >
          ${Zg(t.id)}<span>${Gn(t.label)}</span>
        </button>`)}
    </div>`}_renderShape(){const e=this._chips(),t=Math.min(this._chip,e.length-1),i=e[t],n=Ou(i.shape),r=e.length>1,a=e.length>=Ru;return s.qy`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">${Gn(808)}</h3></div>
      <div class="schips" role="group" aria-label=${Gn(809)}>
        ${e.map((e,i)=>{return s.qy`<button
            type="button"
            class="schip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${r?Gn(815,{n:i+1,shape:Pu(e.shape),weight:e.weight}):Gn(814,{n:i+1,shape:Pu(e.shape)})}
            title=${Pu(e.shape)}
            @click=${()=>this._chip=i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||!r||(e.preventDefault(),this._removeShape(i))}}
          >
            ${n=e.shape,"emoji"in n?s.qy`<span class="emo" aria-hidden="true">${n.emoji}</span>`:"icon"in n?s.qy`<ha-icon class="glyph" icon=${n.icon}></ha-icon>`:Zg(Ou(n))}${r?s.qy`<span>${e.weight}</span>`:s.s6}
          </button>`;var n})}
        <button type="button" class="schip add" aria-label=${Gn(34)} title=${a?Gn(1207,{mAX_SHAPES:Ru}):Gn(34)} ?disabled=${a} @click=${()=>this._addShape()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      <div class="chip-edit">
        <div class="chip-edit-head">
          <span>${Gn(813,{n:t+1})}</span>
          ${r?s.qy`<button type="button" class="icon-btn sm danger remove-shape" aria-label=${Gn(719,{n:t+1})} title=${Gn(718)} @click=${()=>this._removeShape(t)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>`:s.s6}
        </div>
        ${this._shapeGrid(n,"main",Gn(813,{n:t+1}),(e,t)=>this._pickKind(e,t))}
        ${"icon"===n?this._renderIcon(i.shape):"emoji"===n?this._renderEmoji(i.shape):"svg"===n?this._renderSvg(i.shape):s.s6}
        ${r?this._renderWeight(e,t):s.s6}
      </div>
      ${r?s.s6:s.qy`<p class="help">${Gn(24)}</p>`}
    </section>`}_renderWeight(e,t){const i=e[t].weight;return s.qy`<div class="field">
      <div class="field-head"><label for="f-weight">${Gn(1073)}</label></div>
      <input
        id="f-weight"
        class="input"
        type="number"
        inputmode="numeric"
        min=${Du.weight.min}
        max=${Du.weight.max}
        step="1"
        .value=${D(String(i))}
        aria-describedby="h-weight"
        @change=${n=>{const s=n.target,r=Fu("weight",s.value);void 0!==r&&r!==i?(s.value=String(r),this._setShapes(e.map((e,i)=>i===t?{shape:e.shape,weight:r}:e),Gn(135))):s.value=String(i)}}
      />
      <p class="help" id="h-weight">${Gn(21,{percent:nm(e,t)})}</p>
    </div>`}_renderIcon(e){const t="icon"in e?e.icon:"";return s.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">${Gn(371)}</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${t}
        label=${Gn(627)}
        aria-labelledby="l-icon"
        @value-changed=${e=>{e.stopPropagation();const i=String(e.detail.value??"").trim();(e=>mu.test(e.trim()))(i)&&i!==t&&this._setChip(this._chip,{icon:i},"Change icon")}}
      ></mc-icon-picker>
    </div>`}_renderEmoji(e){const t="emoji"in e?e.emoji:"",i=this._emojiDraft??t,n=void 0!==this._emojiDraft?gu(this._emojiDraft):void 0,r=(e,t,i)=>{gu(e)||e.trim()===this._lastEmoji()||this._setChip(this._chip,{emoji:e.trim()},t,i)};return s.qy`<div class="field">
      <div class="field-head"><label for="f-emoji">${Gn(297)}</label></div>
      <div class="emoji-row">
        <span class="emoji-big" aria-hidden="true">${t}</span>
        <input
          id="f-emoji"
          class="input"
          type="text"
          maxlength="24"
          autocomplete="off"
          .value=${i}
          aria-invalid=${n?"true":"false"}
          aria-describedby=${n?"e-emoji":s.s6}
          @input=${e=>{const t=e.target.value;this._emojiDraft=t,r(t,"Change emoji",!0)}}
          @change=${()=>{void 0===this._emojiDraft||gu(this._emojiDraft)||(this._emojiDraft=void 0),this._settle()}}
        />
      </div>
      ${n?s.qy`<p class="help error" id="e-emoji" role="alert">${n}</p>`:s.s6}
      <div class="emoji-grid" role="group" aria-label=${Gn(174)}>
        ${hu.map(e=>s.qy`<button
            type="button"
            aria-pressed=${e===t?"true":"false"}
            aria-label=${Gn(1059,{emoji:e})}
            @click=${()=>{this._emojiDraft=void 0,e!==t&&this._setChip(this._chip,{emoji:e},"Change emoji")}}
          >
            ${e}
          </button>`)}
      </div>
    </div>`}_lastEmoji(){const e=this._chips()[this._chip]?.shape;return e&&"emoji"in e?e.emoji:""}_renderSvg(e){const t="svg"in e?e.svg:"",i=this._svgDraft??t,n=void 0!==this._svgDraft?fu(this._svgDraft):void 0,r=Fn({...this.doc,particles:{...this._p,sim:void 0,shape:{svg:t}}}),a=/mask: (url\("[^"]*"\))/.exec(r.css)?.[1];return s.qy`<div class="field">
      <div class="field-head"><label for="f-svg">${Gn(616)}</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${i}
          aria-invalid=${n?"true":"false"}
          aria-describedby=${n?"e-svg h-svg":"h-svg"}
          @input=${e=>{const i=e.target.value;this._svgDraft=i,fu(i)||i===t||this._setChip(this._chip,{svg:i},"Edit SVG",!0)}}
          @change=${()=>{void 0===this._svgDraft||fu(this._svgDraft)||(this._svgDraft=void 0),this._settle()}}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title=${Gn(977)}>
          ${a?s.qy`<span style=${`-webkit-mask: ${a} center / contain no-repeat; mask: ${a} center / contain no-repeat;`}></span>`:s.s6}
        </span>
      </div>
      ${n?s.qy`<p class="help error" id="e-svg" role="alert">${n}</p>`:s.s6}
      <p class="help" id="h-svg">${Gn(646)}</p>
    </div>`}_pickFlow(e,t=!1){this.doc&&this._sim.flow!==e&&this._emit(this._on(t=>function(e,t,i){return!Gu(e)&&(n=i,qu.has(n))?Mu(e,{direction:i}):Xu(e,t,e=>({...e,flow:i}));var n}(t,this._seed,e)),"Change flow"),t&&this._focus(`.dir[data-dir="${e}"]`)}_number(e,t,i,n){const r=$u[e],a="count"===e?Math.min(r.max,i+bm(this.doc)):r.max;return s.qy`<input
      id=${t}
      class="input"
      type="number"
      inputmode="decimal"
      min=${r.min}
      max=${a}
      step=${"speed"===e?.1:1}
      .value=${String(i)}
      @change=${t=>{const s=t.target,r=ku(e,s.value),o=void 0===r?void 0:Math.min(r,a);void 0!==o&&o!==i?(s.value=String(o),this._patch({[e]:o},n)):s.value=String(i)}}
    />`}_unit(e,t,i,n,r,a){return s.qy`<mc-unit-field
      .inputId=${t}
      .value=${`${i}${n}`}
      .units=${[n]}
      noCustom
      .label=${r}
      ?disabled=${this.disabled}
      @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??""),s=""===n?a:ku(e,n);void 0!==s&&s!==i?this._patch({[e]:s},r):t.target.revert?.()}}
    ></mc-unit-field>`}_range(e,t,i,n,r,a,o={}){const l=o.scale??1,c=[+(n[0]*l).toFixed(2),+(n[1]*l).toFixed(2)],d=Du[r].step;return s.qy`<div class="field">
      <div class="field-head"><span class="lbl" id=${`l-${e}`}>${t}</span></div>
      <div class="pair" role="group" aria-labelledby=${`l-${e}`}>
        ${[0,1].map(t=>s.qy`<div>
            <label class="sub-lbl" for=${`f-${e}-${t}`}>${Gn(0===t?345:1006)}</label>
            <input
              id=${`f-${e}-${t}`}
              class="input"
              type="number"
              inputmode="decimal"
              min=${Du[r].min}
              max=${Du[r].max}
              step=${d}
              aria-label=${Gn(0===t?437:368,{noun:i})}
              .value=${D(String(c[t]))}
              @change=${e=>{const i=e.target,n=Fu(r,i.value);if(void 0===n)return void(i.value=String(c[t]));const s=Bu(0===t?[n,c[1]]:[c[0],n]);s[0]!==c[0]||s[1]!==c[1]?a([+(s[0]/l).toFixed(4),+(s[1]/l).toFixed(4)]):i.value=String(c[t])}}
            />
          </div>`)}
      </div>
      ${o.help?s.qy`<p class="help">${o.help}</p>`:s.s6}
    </div>`}_slider(e,t,i,n,r,a={}){return s.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label><span class="val">${n}</span></div>
      <div class="slider">
        <input
          id=${e}
          type="range"
          min="0"
          max="1"
          step=${Du.unit.step}
          .value=${D(String(i))}
          aria-valuetext=${n}
          ?disabled=${a.disabled}
          @input=${e=>{const t=Fu("unit",e.target.value);void 0!==t&&r(t,!0)}}
          @change=${()=>this._settle()}
        />
      </div>
      ${a.help?s.qy`<p class="help">${a.help}</p>`:s.s6}
    </div>`}_renderTiming(e){return s.qy`<section class="group" aria-labelledby="h-timing">
      <div class="group-head"><h3 id="h-timing">${Gn(1005)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-speed">${Gn(435)}</label></div>
        ${this._number("speed","f-speed",e.speed,Gn(132))}
      </div>
    </section>`}_renderMovement(e,t,i=!0){return s.qy`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">${Gn(494)}</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">${Gn(337)}</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${e=>this._radioKeys(e,Au,t.flow,e=>this._pickFlow(e,!0),this._cols(e.currentTarget))}
        >
          ${Au.map(e=>s.qy`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${e}
              aria-checked=${e===t.flow?"true":"false"}
              tabindex=${e===t.flow?0:-1}
              title=${Gn(zu[e])}
              @click=${()=>this._pickFlow(e)}
            >
              <span class="dir-pv ${e}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${Gn(zu[e])}</span>
            </button>`)}
        </div>
      </div>
      <div class=${i?"pair":""}>
        ${i?s.qy`<div class="field">
              <div class="field-head"><label for="f-speed">${Gn(435)}</label></div>
              ${this._number("speed","f-speed",e.speed,Gn(132))}
            </div>`:s.s6}
        <div class="field">
          <div class="field-head"><label for="f-spread">${n=t.flow,Eu.has(n)?Gn(699):Gn("drift"===n||"wave"===n||"wander"===n?865:864)}</label></div>
          ${this._unit("spread","f-spread",e.spread,"%",Gn(133),100)}
        </div>
      </div>
      ${"rain"===t.flow?this._renderWind(t):s.s6}
      ${this._range("pspeed",Gn(630),Gn(1131),t.ranges.speed,"pspeed",e=>this._editSim(t=>({...t,ranges:{...t.ranges,speed:e}}),"Change particle speed"),{help:Gn(284)})}
    </section>`;var n}_renderWind(e){const t=(i=e.physics.gravity.angle,_u(-(i>180?i-360:i),Du.wind.min,Du.wind.max)||0);var i;return s.qy`<div class="field">
      <div class="field-head"><label for="f-wind">${Gn(1078)}</label></div>
      <input
        id="f-wind"
        class="input"
        type="number"
        inputmode="numeric"
        min=${Du.wind.min}
        max=${Du.wind.max}
        step=${Du.wind.step}
        .value=${D(String(t))}
        aria-describedby="h-wind"
        @change=${e=>{const i=e.target,n=Fu("wind",i.value);void 0!==n&&n!==t?(i.value=String(n),this._emit(this._on(e=>function(e,t,i){const n=Uu(e,t).physics.gravity;return tm(e,t,(360-_u(Math.round(i),Du.wind.min,Du.wind.max))%360,n.strength>0?n.strength/Nu:.5)}(e,this._seed,n)),"Change wind angle")):i.value=String(t)}}
      />
      <p class="help" id="h-wind">${Gn(536)}</p>
    </div>`}_setSize(e,t,i){const n=this._p,s=""===t?void 0:parseFloat(t);if(void 0===s||!Number.isFinite(s))return void i.revert?.();const r=function(e,t,i){const n=_u(i,$u.size.min,$u.size.max);return 0===t?[n,Math.max(n,e[1])]:[Math.min(e[0],n),n]}(n.size,e,s);r[0]===n.size[0]&&r[1]===n.size[1]?i.revert?.():this._patch({size:r},"Change size")}_renderLook(e,t){return s.qy`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">${Gn(431)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-count">${Gn(193)}</label></div>
        ${this._number("count","f-count",e.count,Gn(129))}
        ${this._multi?s.qy`<p class="help count-help">${Gn(1043,{parentsLeft:e.count+bm(this.doc),parents:_o.parents})}</p>`:s.s6}
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">${Gn(827)}</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${[0,1].map(t=>s.qy`<div>
              <label class="sub-lbl" for=${`f-size-${t}`}>${Gn(0===t?345:1006)}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${t}`}
                .value=${`${e.size[t]}px`}
                .units=${["px"]}
                noCustom
                .label=${Gn(0===t?834:402)}
                ?disabled=${this.disabled}
                @value-changed=${e=>{e.stopPropagation(),this._setSize(t,String(e.detail.value??""),e.target)}}
              ></mc-unit-field>
            </div>`)}
        </div>
      </div>
      ${this._range("opacity",Gn(607),Gn(1126),t.ranges.opacity,"opacity",e=>this._editSim(t=>({...t,ranges:{...t.ranges,opacity:e}}),"Change opacity"),{scale:100})}
      ${this._renderColors(e)}
      <div class="switch-row">
        <span class="txt" id="l-fade">${Gn(316)}<p class="help">${Gn(633)}</p></span>
        <button
          type="button"
          class="switch fade"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${e.fade?"true":"false"}
          @click=${()=>this._patch({fade:!e.fade},e.fade?Gn(1023):Gn(1024))}
        ></button>
      </div>
    </section>`}_pickLayer(e,t=!1){if(this.doc&&Mm(this.doc,this._em)!==e){const t=this._name(this._em),i=Gn("front"===e?1109:1094);this._live=Gn(1223,{name:t,where:i}),this._emit(function(e,t,i,n){if(!$m(e,i)||Mm(e,i)===n)return e;if(1===fm(e))return Mu(e,{layer:n});const s=_m(e,t);return s[i].layer=n,wm(e,t,s)}(this.doc,this._seed,this._em,e),`${t} ${i}`)}t&&this._focus(`.layer-seg [data-layer="${e}"]`)}_renderPlacement(){const e=Mm(this.doc,this._em);return s.qy`<div class="field placement">
      <div class="field-head"><span class="lbl" id="l-place">${Gn(661)}</span></div>
      <div
        class="seg full layer-seg"
        role="radiogroup"
        aria-label=${Gn(661)}
        @keydown=${t=>this._radioKeys(t,["back","front"],e,e=>this._pickLayer(e,!0))}
      >
        ${["back","front"].map(t=>s.qy`<button type="button" role="radio" data-layer=${t} aria-checked=${e===t?"true":"false"} tabindex=${e===t?0:-1} aria-describedby="h-place" @click=${()=>this._pickLayer(t)}>
            ${Gn("back"===t?84:385)}
          </button>`)}
      </div>
      <p class="help placement-help" id="h-place">${Gn(386)}</p>
      <p class="em-live" role="status">${this._live}</p>
    </div>`}_addColor(){const e=this._p;if(e.colors.length>=it)return;const t=Wg.find(t=>!e.colors.includes(t))??Wg[e.colors.length%Wg.length];this._color=e.colors.length,this._patch({colors:[...e.colors,t]},"Add colour")}_removeColor(e){const t=this._p.colors.filter((t,i)=>i!==e);this._color=t.length?Math.min(e,t.length-1):-1,this._patch({colors:t},"Remove colour"),this.updateComplete.then(()=>(this.renderRoot.querySelector(`.cchip[data-i="${this._color}"]`)??this.renderRoot.querySelector(".cchip.add"))?.focus())}_renderColors(e){const t=this._color>=0&&this._color<e.colors.length?this._color:-1,i=e.colors.length>=it;return s.qy`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">${Gn(173)}</span>
        ${e.colors.length?s.qy`<span class="val">${Gn(1185,{count:e.colors.length,colours:it})}</span>`:s.s6}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${e.colors.map((e,i)=>{const n=xu(e).startsWith("entity");return s.qy`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${n?Gn(170,{n:i+1}):Gn(171,{n:i+1,colour:e})}
            title=${n?Gn(303):e}
            @click=${()=>this._color=i===t?-1:i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||(e.preventDefault(),this._removeColor(i))}}
          >
            <span style=${`background: ${n?"var(--mc-text-2)":e}`}></span>
            ${n?s.qy`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>`:s.s6}
          </button>`})}
        <button type="button" class="cchip add" aria-label=${Gn(27)} title=${i?Gn(1154,{colours:it}):Gn(27)} ?disabled=${i} @click=${()=>this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${t>=0?s.qy`<div class="color-edit">
            <div class="color-edit-head">
              <span>${Gn(169,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${Gn(711,{n:t+1})}
                title=${Gn(709)}
                @click=${()=>this._removeColor(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${Gn(169,{n:t+1})}
              .value=${xu(e.colors[t])}
              @value-changed=${i=>{i.stopPropagation();const n=yu(String(i.detail.value??""));if(!n||n===e.colors[t])return;const s=[...e.colors];s[t]=n,this._patch({colors:s},"Change colour")}}
            ></mc-color-picker>
          </div>`:s.qy`<p class="help">${e.colors.length?Gn(635):Gn(553)}</p>`}
    </div>`}_sector(e,t,i,n,r){const a=!!this._open[e];return s.qy`<div class="sector" data-sector=${e}>
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${a?"true":"false"}
        aria-controls=${a?`sb-${e}`:s.s6}
        @click=${()=>this._open={...this._open,[e]:!a}}
      >
        <ha-icon icon=${t}></ha-icon>
        <span class="nm">${i}<span class="sr-only">, </span><span class="ssum">${n}</span></span>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${a?s.qy`<div class="sector-body" id=${`sb-${e}`}>${r()}</div>`:s.s6}
    </div>`}_renderVariation(e){const t=this._vdoc;return s.qy`<div class="field">
        <div class="field-head"><label for="f-seed">${Gn(780)}</label></div>
        <div class="seed-row">
          <input
            id="f-seed"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            max=${Du.seed.max}
            step="1"
            .value=${D(String(e.seed))}
            aria-describedby="h-seed"
            @change=${t=>{const i=t.target,n=Fu("seed",i.value);void 0===n||n===e.seed&&this._p?.sim?i.value=String(e.seed):this._editSim(e=>({...e,seed:n}),"Change seed")}}
          />
          <button type="button" class="btn btn-secondary btn-sm shuffle-seed" @click=${this._shuffle}><ha-icon icon="mdi:dice-5-outline"></ha-icon>${Gn(823)}</button>
        </div>
        <p class="help" id="h-seed">${Gn(975)}</p>
      </div>
      ${this._range("spin",Gn(853),Gn(1132),em(t,e),"spin",e=>this._emit(this._on(t=>function(e,t,i){const n=Bu(i);if(!Gu(e)&&n[0]===n[1])return Mu(e,{spin:n[0]});const s=Iu(e);return Xu(e,t,e=>({...e,ranges:{...e.ranges,spin:[Wu(n[0]/s),Wu(n[1]/s)]}}))}(t,this._seed,e)),"Change spin"),{help:Gn(285)})}
      ${this._range("delay",Gn(874),Gn(1133),e.ranges.delay,"delay",e=>this._editSim(t=>({...t,ranges:{...t.ranges,delay:e}}),"Change start delay"))}
      ${this._range("life",Gn(415),Gn(1116),e.ranges.lifetime,"lifetime",e=>this._editSim(t=>({...t,ranges:{...t.ranges,lifetime:e}}),"Change lifetime"),{help:Gn(14)})}`}_pickGravityAngle(e,t=!1){const i=this._sim,n=i.physics.gravity.strength/Nu;this.doc&&e!==i.physics.gravity.angle&&this._emit(this._on(t=>tm(t,this._seed,e,n)),"Change gravity direction"),t&&this._focus(`.compass [data-angle="${e}"]`)}_renderPhysics(e){const t=e.physics.gravity,i=+(t.strength/Nu).toFixed(2),n=+(e.physics.drag/3).toFixed(2),r=+(e.physics.turbulence.strength/150).toFixed(2),a=om.map(e=>String(e.angle)),o=om.some(e=>e.angle===t.angle);return s.qy`${this._slider("f-grav",Gn(352),i,i?i.toFixed(2):Gn(566),(e,i)=>this._emit(this._on(i=>tm(i,this._seed,t.angle,e)),"Change gravity",i))}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-gdir">${Gn(353)}</span></div>
        <div
          class="seg full compass"
          role="radiogroup"
          aria-labelledby="l-gdir"
          @keydown=${e=>this._radioKeys(e,a,String(t.angle),e=>this._pickGravityAngle(+e,!0))}
        >
          ${om.map((e,i)=>s.qy`<button
              type="button"
              role="radio"
              data-angle=${e.angle}
              aria-checked=${e.angle===t.angle?"true":"false"}
              aria-label=${Gn(e.name)}
              title=${Gn(e.name)}
              tabindex=${e.angle===t.angle||!o&&0===i?0:-1}
              @click=${()=>this._pickGravityAngle(e.angle)}
            >
              <ha-icon icon=${e.icon}></ha-icon>
            </button>`)}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gangle">${Gn(61)}</label></div>
        <input
          id="f-gangle"
          class="input"
          type="number"
          inputmode="numeric"
          min="0"
          max="359"
          step="1"
          .value=${D(String(t.angle))}
          aria-describedby="h-gangle"
          @change=${e=>{const n=e.target,s=Fu("angle",n.value);void 0!==s&&s!==t.angle?this._emit(this._on(e=>tm(e,this._seed,s,i)),"Change gravity direction"):n.value=String(t.angle)}}
        />
        <p class="help" id="h-gangle">${Gn(7)}</p>
      </div>
      ${this._slider("f-drag",Gn(248),n,n.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,drag:+(3*e).toFixed(2)}}),"Change drag",t),{help:Gn(832)})}
      ${this._slider("f-turb",Gn(1019),r,r.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,turbulence:{...t.physics.turbulence,strength:+(150*e).toFixed(2)}}}),"Change turbulence",t),{help:Gn(42)})}`}_setCollider(e,t){this._editSim(i=>({...i,colliders:{...i.colliders,..."content"===e?{content:t?"icon":"none"}:{[e]:t}}}),Gn(t?1022:1021))}_renderCollisions(e){const t=e.colliders,i=rm(t);return s.qy`<div class="checks" role="group" aria-label=${Gn(164)}>
        ${pm.map(e=>s.qy`<label class="check">
            <input type="checkbox" data-collider=${e.id} .checked=${hm(t,e.id)} @change=${t=>this._setCollider(e.id,t.target.checked)} />
            ${Gn(e.label)}
          </label>`)}
      </div>
      ${"none"!==t.content?s.qy`<div class="field">
            <div class="field-head"><span class="lbl">${Gn(180)}</span></div>
            <div
              class="seg full content-seg"
              role="radiogroup"
              aria-label=${Gn(180)}
              @keydown=${e=>this._radioKeys(e,["icon","text"],t.content,e=>{e!==t.content&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box"),this._focus(`.content-seg [data-content="${e}"]`)})}
            >
              ${["icon","text"].map(e=>s.qy`<button
                  type="button"
                  role="radio"
                  data-content=${e}
                  aria-checked=${t.content===e?"true":"false"}
                  tabindex=${t.content===e?0:-1}
                  @click=${()=>t.content!==e&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box")}
                >
                  ${Gn("icon"===e?371:916)}
                </button>`)}
            </div>
            <p class="help">${Gn(935)}</p>
          </div>`:s.s6}
      ${this._slider("f-bounce",Gn(101),e.physics.bounce,e.physics.bounce.toFixed(2),(e,t)=>this._editAll(t=>({...t,physics:{...t.physics,bounce:e}}),"Change bounce",t),{help:Gn(8),disabled:!i})}`}_child(e,t){this._editSim(t=>t.children?{...t,children:{...t.children,...e}}:t,t)}_renderChildren(e){const t=e.children,i=rm(e.colliders),n=s.qy`<div class="switch-row">
      <span class="txt" id="l-children">${Gn(849)}<p class="help">${Gn(141)}</p></span>
      <button
        type="button"
        class="switch children"
        role="switch"
        aria-labelledby="l-children"
        aria-checked=${t?"true":"false"}
        @click=${()=>{t?this._editSim(e=>{const{children:t,...i}=e;return i},"Turn child particles off"):this._editSim(e=>({...e,children:am(e)}),"Turn child particles on")}}
      ></button>
    </div>`;if(!t)return n;const r=[["collision",Gn(597)],["death",Gn(73)]],a=(e,n=!1)=>{("collision"!==e||i)&&(e!==t.trigger&&this._child({trigger:e,at:void 0},"Change child trigger"),n&&this._focus(`.trigger-seg [data-trigger="${e}"]`))},o=Ou(t.shapes[0]?.shape??{builtin:"circle"}),l=!t.colors.length;return s.qy`${n}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-trigger">${Gn(848)}</span></div>
        <div
          class="seg full trigger-seg"
          role="radiogroup"
          aria-labelledby="l-trigger"
          @keydown=${e=>this._radioKeys(e,i?["collision","death"]:["death"],t.trigger,e=>a(e,!0))}
        >
          ${r.map(([e,n])=>s.qy`<button
              type="button"
              role="radio"
              data-trigger=${e}
              aria-checked=${t.trigger===e?"true":"false"}
              tabindex=${t.trigger===e||"time"===t.trigger&&"death"===e?0:-1}
              ?disabled=${"collision"===e&&!i}
              @click=${()=>a(e)}
            >
              ${n}
            </button>`)}
        </div>
        ${i?s.s6:s.qy`<p class="help">${Gn(1025)}</p>`}
        ${"time"===t.trigger?s.qy`<p class="help">${Gn(850,{seconds:t.at??0})}</p>`:s.s6}
      </div>
      <div class="field">
        <div class="field-head"><label for="f-ccount">${Gn(194)}</label></div>
        <input
          id="f-ccount"
          class="input"
          type="number"
          inputmode="numeric"
          min="1"
          max=${Du.childCount.max}
          step="1"
          .value=${D(String(t.count))}
          @change=${e=>{const i=e.target,n=Fu("childCount",i.value);void 0!==n&&n!==t.count?(i.value=String(n),this._child({count:n},"Change child count")):i.value=String(t.count)}}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${Gn(140)}</span></div>
        ${this._shapeGrid(o,"child",Gn(140),(e,t)=>{if(e!==o){const t=this._sim.shapes.find(t=>Ou(t.shape)===e)?.shape;this._child({shapes:[{shape:t??this._shapeFor(e),weight:1}]},"Change child shape")}t&&this._focus(`.shapes.child [data-kind="${e}"]`)})}
      </div>
      ${this._range("csize",Gn(828),Gn(1095),t.size,"childSize",e=>this._child({size:e},"Change child size"))}
      ${this._range("cspeed",Gn(852),Gn(1096),t.ranges.speed,"pspeed",e=>this._child({ranges:{...t.ranges,speed:e}},"Change child speed"))}
      <div class="field">
        <div class="field-head"><label for="f-clife">${Gn(415)}</label></div>
        <input
          id="f-clife"
          class="input"
          type="number"
          inputmode="decimal"
          min=${Du.childLife.min}
          max=${Du.childLife.max}
          step="0.1"
          .value=${D(String(t.ranges.lifetime[1]))}
          @change=${e=>{const i=e.target,n=Fu("childLife",i.value);void 0===n||n===t.ranges.lifetime[0]&&n===t.ranges.lifetime[1]?i.value=String(t.ranges.lifetime[1]):this._child({ranges:{...t.ranges,lifetime:[n,n]}},"Change child lifetime")}}
        />
      </div>
      <div class="switch-row">
        <span class="txt" id="l-ccolors">${Gn(1057)}</span>
        <button
          type="button"
          class="switch child-colors"
          role="switch"
          aria-labelledby="l-ccolors"
          aria-checked=${l?"true":"false"}
          @click=${()=>this._child({colors:l?[this._p?.colors[0]??"#ffffff"]:[]},Gn(l?617:1057))}
        ></button>
      </div>
      ${l?s.s6:s.qy`<mc-color-picker
            allowEntity
            label=${Gn(137)}
            .value=${xu(t.colors[0])}
            @value-changed=${e=>{e.stopPropagation();const i=yu(String(e.detail.value??""));i&&i!==t.colors[0]&&this._child({colors:[i]},"Change child colour")}}
          ></mc-color-picker>`}`}_renderSectors(e,t){return s.qy`<div class="sectors">
      ${"all"===t?s.s6:this._sector("variation","mdi:dice-multiple-outline",Gn(1070),function(e,t){return Gn(781,{seed:String(t.seed),span:dm(em(e,t),"°")})}(this._vdoc,e),()=>this._renderVariation(e))}
      ${"all"===t?s.s6:this._sector("physics","mdi:weight",Gn(652),function(e){const{gravity:t,drag:i,turbulence:n}=e.physics,s=t.strength/Nu,r=[s>0?Gn(354,{strength:s.toFixed(1),direction:lm(t.angle)}):Gn(555)];return i>0&&r.push(Gn(1102,{value:cm(i/3)})),n.strength>0&&r.push(Gn(1142,{value:cm(n.strength/150)})),r.join(", ")}(e),()=>this._renderPhysics(e))}
      ${"emitter"===t?s.s6:this._sector("collisions","mdi:arrow-collapse-down",Gn(165),function(e){const t=pm.filter(t=>hm(e.colliders,t.id)).map(e=>Gn(e.label));return t.length?Gn(1206,{list:t.join(", "),bounce:cm(e.physics.bounce)}):Gn(595)}(e),()=>this._renderCollisions(e))}
      ${"all"===t?s.s6:this._sector("children","mdi:creation-outline",Gn(138),function(e){const t=e.children;if(!t)return Gn(595);const i=t.shapes[0]?.shape??{builtin:"circle"},n=Ou(i),s="svg"===n?Gn(759):"emoji"===n?Gn(1105):Pu(i).toLowerCase();return Gn(1172,{count:t.count,shape:s,trigger:(r=t,"collision"===r.trigger?Gn(1125):"death"===r.trigger?Gn(1092):Gn(1090,{seconds:cm(r.at??0)}))});var r}(e),()=>s.qy`<div class="sector-body-lk" ?inert=${this._locks.kids.length>0}>${this._renderChildren(e)}</div>`)}
    </div>`}_renderPreset(e){const t=Su(this.doc),i=t?((e,t)=>e.particles?.intensity??t.defaults.intensity)(this.doc,t):void 0;return s.qy`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${t?(0,K.t)(t.name):e.preset}</strong>
          <span class="kind">${t?Gn(83,{kind:ju(t).toLowerCase()}):Gn(1035)}</span>
        </span>
      </div>
      ${t?s.qy`<div class="field">
            <div class="field-head"><label for="f-intensity">${((e,t)=>e.intensity.unit?`${t(e.intensity.label)} (${e.intensity.unit})`:t(e.intensity.label))(t,Gn)}</label></div>
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
              @change=${i=>{const n=i.target.value,s=function(e,t,i){return void 0!==i&&Number.isFinite(i)?Mu(e,{intensity:_u(i,t.intensity.min,t.intensity.max)}):Mu(e,{intensity:void 0})}(this.doc,t,""===n?void 0:Number(n));s.particles.intensity!==e.intensity?this._emit(s,"Change intensity"):i.target.value=void 0===e.intensity?"":String(e.intensity)}}
            />
            <p class="help">${Gn(85,{min:t.intensity.min,max:t.intensity.max,intensity:t.defaults.intensity})}</p>
          </div>`:s.qy`<p class="help error">${Gn(1001)}</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>${Gn(182)}
      </button>
      <p class="help">
        ${Gn(910)}
        ${!t||"count"!==t.particles||t.ring||t.seasonal?Gn(987):Gn(955)}
      </p>
    </section>`}get _locks(){const e=this.doc,t=this.layerView;if(!e||!t?.locked.length)return{own:[],kids:[]};const i=e.particles?.sim?eo(e):["main"],n=this.all&&i.length>1?i:[i[Math.min(this._em,i.length-1)]??"main"];return{own:n.filter(i=>co(e,t,`emitter:${i}`)).map(e=>`emitter:${e}`),kids:n.filter(i=>co(e,t,`children:${i}`)).map(e=>`children:${e}`)}}render(){const e=this._p;if(!this.doc||!e)return s.qy`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>${Gn(609)}</p></div>`;const t=e.preset?void 0:this._sim;return s.qy`<style data-pv></style>
      <style data-live></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${this._locks.own.length?bo(this.doc,this.layerView,this._locks.own):s.s6}
          ${t?this._renderForm(e,t):s.qy`<div class="lk" ?inert=${this._locks.own.length>0}>${this._renderPreset(e)}</div>`}
        </div>
      </div>`}_renderForm(e,t){const i=this._multi,n=i&&this.all;return s.qy`${this._renderBar()}
      <div class="lk" ?inert=${this._locks.own.length>0}>
      ${n?s.qy`<p class="help all-note">${Gn(986)}</p>
            ${this._renderMode(t)}${this._renderTiming(e)}${this._renderSectors(t,"all")}`:s.qy`${i?this._renderEmitterHead():s.s6}${this._renderPlacement()}
            ${i?s.s6:this._renderMode(t)}${this._renderShape()}${this._renderMovement(e,t,!i)}${this._renderLook(e,t)}${this._renderSectors(t,i?"emitter":void 0)}`}
      </div>`}_renderBar(){const e=this.doc,t=fm(e),i=ym(e),n=this.all?"all":String(this._em),r=["all",...Array.from({length:t},(e,t)=>String(t))];return s.qy`<div class="em-bar">
      ${t>1?s.qy`<div class="em-tabs">${zd({role:"tablist",label:Gn(295),value:n,items:r.map(e=>({value:e,label:"all"===e?Gn(48):this._name(+e)})),onChange:e=>{"all"===e?this._select(this._em,!0):this._select(+e),this._focus(`.em-tabs [data-val="${e}"]`)}})}</div>`:s.s6}
      <button type="button" class="btn btn-secondary btn-sm em-add" ?disabled=${!i||this.disabled} aria-describedby=${i?s.s6:"h-em-cap"} @click=${this._addEmitter}>
        <ha-icon icon="mdi:plus"></ha-icon>${Gn(28)}
      </button>
      ${i?s.s6:s.qy`<p class="help em-cap" id="h-em-cap">${t>=_o.emitters?Gn(1186,{emitters:_o.emitters}):Gn(554)}</p>`}
    </div>`}_renderEmitterHead(){const e=this._em,t=this.doc.particles.sim,i=(0===e?t.name:t.emitters?.[e-1]?.name)??"";return s.qy`<div class="em-head">
      <div class="field em-name-field">
        <div class="field-head"><label for="f-em-name">${Gn(294)}</label></div>
        <input
          id="f-em-name"
          class="input em-name"
          type="text"
          maxlength=${40}
          placeholder=${Cm(this.doc,this._seed,e)}
          .value=${D(i)}
          @change=${t=>{const i=t.target,n=km(this.doc,this._seed,e,i.value);i.value=(0===e?n.particles.sim.name:n.particles.sim.emitters?.[e-1]?.name)??"",this._emit(n,"Rename emitter")}}
        />
      </div>
      <button type="button" class="icon-btn sm em-dup" aria-label=${Gn(277)} title=${Gn(277)} ?disabled=${!ym(this.doc)||this.disabled} @click=${this._dupEmitter}>
        <ha-icon icon="mdi:content-copy"></ha-icon>
      </button>
      <button type="button" class="icon-btn sm danger em-remove" aria-label=${Gn(713)} title=${Gn(713)} ?disabled=${this.disabled} @click=${this._removeEmitter}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`}};Kg.styles=[Qp,Mh,vo,s.AH`
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
        padding-inline: 10px 14px;
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
        margin-inline: 0 -6px;
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
      .dir-pv.fall i, .dir-pv.rise i, .dir-pv.zigzag i, .dir-pv.rain i { left: calc(25% + var(--n) * 25%); /* physical */ top: 0; }
      .dir-pv.fall i { --a: pv-fall; }
      .dir-pv.rise i { --a: pv-rise; }
      .dir-pv.zigzag i { --a: pv-zigzag; animation-duration: 2.2s; animation-delay: calc(var(--n) * -0.73s); }
      .dir-pv.rain i { --a: pv-rain; width: 2px; height: 7px; border-radius: 1px; animation-duration: 0.9s; animation-delay: calc(var(--n) * -0.3s); }
      .dir-pv.drift i, .dir-pv.wave i { left: 0; /* physical */ top: calc(30% + var(--n) * 20%); animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.drift i { --a: pv-drift; }
      .dir-pv.wave i { --a: pv-wave; }
      .dir-pv.burst i, .dir-pv.orbit i, .dir-pv.spiral i, .dir-pv.vortex i, .dir-pv.explode i { left: 50%; /* physical */ top: 50%; }
      .dir-pv.burst i { --a: pv-burst; animation-delay: calc(var(--n) * -0.15s); animation-timing-function: ease-out; }
      .dir-pv.orbit i { --a: pv-orbit; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.spiral i { --a: pv-spiral; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.vortex i { --a: pv-vortex; animation-duration: 2.4s; animation-delay: calc(var(--n) * -0.8s); }
      .dir-pv.explode i { top: 30%; --a: pv-explode; animation-duration: 2s; animation-delay: calc(var(--n) * -0.1s); }
      .dir-pv.fountain i { left: 50%; /* physical */ top: 100%; --a: pv-fountain; animation-duration: 1.8s; }
      .dir-pv.wander i { left: calc(25% + var(--n) * 25%); /* physical */ top: 50%; --a: pv-wander; animation-duration: 3s; animation-delay: calc(var(--n) * -1s); }
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
        margin-inline: 0 -6px;
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
    `],Bg([(0,r.MZ)({attribute:!1})],Kg.prototype,"doc",void 0),Bg([(0,r.MZ)({attribute:!1})],Kg.prototype,"hass",void 0),Bg([(0,r.MZ)({attribute:!1})],Kg.prototype,"library",void 0),Bg([(0,r.MZ)({attribute:!1})],Kg.prototype,"time",void 0),Bg([(0,r.MZ)({type:Boolean,reflect:!0})],Kg.prototype,"disabled",void 0),Bg([(0,r.MZ)({attribute:!1})],Kg.prototype,"layerView",void 0),Bg([(0,r.MZ)({type:Number})],Kg.prototype,"emitter",void 0),Bg([(0,r.wk)()],Kg.prototype,"_shapes",void 0),Bg([(0,r.wk)()],Kg.prototype,"_svgDraft",void 0),Bg([(0,r.wk)()],Kg.prototype,"_emojiDraft",void 0),Bg([(0,r.wk)()],Kg.prototype,"_color",void 0),Bg([(0,r.wk)()],Kg.prototype,"_chip",void 0),Bg([(0,r.wk)()],Kg.prototype,"_paused",void 0),Bg([(0,r.wk)()],Kg.prototype,"_open",void 0),Bg([(0,r.wk)()],Kg.prototype,"_stats",void 0),Bg([(0,r.wk)()],Kg.prototype,"_baking",void 0),Bg([(0,r.MZ)({type:Boolean})],Kg.prototype,"all",void 0),Bg([(0,r.wk)()],Kg.prototype,"_live",void 0),Kg=Bg([(0,r.EM)("mc-anim-particles-editor")],Kg);var Ug=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Gg=[{value:"element",label:292,icon:"mdi:square-rounded-outline"},{value:"icon",label:371,icon:"mdi:star-outline"},{value:"particles",label:631,icon:"mdi:scatter-plot-outline"}],Yg=[{value:"percent",label:2},{value:"px",label:660}],Jg={count:3,size:[6,12],colors:[]},Xg={d:"",units:"percent",follow_rotation:!1,subject:"element"},Qg=new Map;let ef=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1}get _spec(){return this.doc?.path??Xg}_locked(e){return!!this.layerView?.locked.includes(e)}_emit(e,t){if(!this.doc||this.disabled)return;const i={...this.doc,path:e};this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_set(e,t){this._emit({...this._spec,...e},t)}_edit(e,t){this._set({d:da(e(ca(this._spec.d)))},t)}_template(e,t){const i=this._spec;this._set({d:ba(e,ya({subject:i.subject,units:"percent"})),units:"percent"},`Use ${t.toLowerCase()} path`)}_subject(e){const t=this._spec;if(e===t.subject)return;const i={subject:e},n="particles"===t.subject,s="particles"===e;if("percent"===t.units&&n!==s&&t.d){const e=s?50:-50;i.d=da(ua(ca(t.d),e,e))}s&&!t.particles&&(i.particles={...Jg,size:[...Jg.size],colors:[]}),this._set(i,"What moves")}_look(e,t){const i=this._spec.particles??Jg;this._set({particles:{...i,size:[...i.size],colors:[...i.colors],...e}},t)}_seg(e,t,i,n){return s.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.value===i),r="rtl"===b(e.currentTarget)?-1:1,a={ArrowRight:r,ArrowDown:1,ArrowLeft:-r,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const o=t[(s+a[e.key]+t.length)%t.length].value,l=e.currentTarget;n(o),requestAnimationFrame(()=>l.querySelector(`[data-val="${o}"]`)?.focus())}}>
      ${t.map(e=>{const t=e.value===i;return s.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          ?disabled=${this.disabled}
          @click=${()=>n(e.value)}
        >
          ${e.icon?s.qy`<ha-icon icon=${e.icon}></ha-icon>`:s.s6}${Gn(e.label)}
        </button>`})}
    </div>`}_switch(e,t,i,n,r,a=!1){return s.qy`<div class="switch-row">
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
        @click=${n}
      ></button>
    </div>`}_templates(){return s.qy`<div class="tiles">
      ${fa.map(e=>{const t=function(e){let t=Qg.get(e);if(!t){const i=ba(e),n=pa(ca(i))??{x:-40,y:-40,w:80,h:80},s=6;let r=n.w+2*s,a=n.h+2*s;const o=44/30;r/a<o?r=a*o:a=r/o;const l=n.x+n.w/2,c=n.y+n.h/2;t={d:i,box:`${(l-r/2).toFixed(2)} ${(c-a/2).toFixed(2)} ${r.toFixed(2)} ${a.toFixed(2)}`},Qg.set(e,t)}return t}(e.id),i=ca(t.d).anchors[0];return s.qy`<button
          type="button"
          class="tile"
          data-template=${e.id}
          title=${Gn(732,{name:Gn(e.label).toLowerCase()})}
          ?disabled=${this.disabled}
          @click=${()=>this._template(e.id,Gn(e.label))}
        >
          <svg viewBox=${t.box} aria-hidden="true">
            <path d=${t.d}></path>
            ${i?s.JW`<circle cx=${i.x} cy=${i.y} r=${t.box.split(" ").map(Number)[2]/18}></circle>`:s.s6}
          </svg>
          <span>${Gn(e.label)}</span>
        </button>`})}
    </div>`}_pathSection(e){const t=e.anchors.length,i=e.anchors.filter(e=>e.in||e.out).length,n=t>1&&!this.disabled;return s.qy`<section class="sec" aria-label=${Gn(643)}><div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Gn(875)}</span></div>
        ${this._templates()}
      </div>
      <div class="stats" aria-live="polite">
        <span class="chip">${Gn(1166,{count:t})}</span>
        <span class="chip">${e.closed?Gn(160):Gn(608)}</span>
        ${t>1?s.qy`<span class="chip">${Gn(0===i?903:i===t?203:446)}</span>`:s.s6}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary btn-sm smooth-all" ?disabled=${!n} @click=${()=>this._edit(la.smoothAll,"Smooth all points")}>
          <ha-icon icon="mdi:vector-curve"></ha-icon>${Gn(836)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm straighten-all" ?disabled=${!n} @click=${()=>this._edit(la.straightenAll,"Straighten all points")}>
          <ha-icon icon="mdi:vector-polyline"></ha-icon>${Gn(904)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm reverse" ?disabled=${!n} @click=${()=>this._edit(ha,"Reverse direction")}>
          <ha-icon icon="mdi:swap-horizontal"></ha-icon>${Gn(743)}
        </button>
      </div>
      ${this._switch(Gn(161),Gn(958),e.closed,()=>{t>1&&this._edit(t=>(0,la.setClosed)(t,!e.closed),e.closed?Gn(610):Gn(159))},"closed-switch",t<2)}
      <ul class="tips help">
        <li>${Gn(153)}</li>
        <li>${Gn(250)} ${Yn(1192,{key:s.qy`<kbd>Alt</kbd>`})}</li>
        <li>${Gn(245)} ${Yn(1193,{key:s.qy`<kbd>${Gn(220)}</kbd>`})}</li>
        <li>${"px"===this._spec.units?Yn(681,{key:s.qy`<kbd>Shift</kbd>`}):Yn(682,{key:s.qy`<kbd>Shift</kbd>`})}</li>
      </ul>
      <div class="foot">
        <button type="button" class="btn btn-text btn-sm btn-danger clear" ?disabled=${0===t||this.disabled} @click=${()=>this._set({d:""},"Clear path")}>
          <ha-icon icon="mdi:eraser"></ha-icon>${Gn(148)}
        </button>
      </div>
    </div></section>`}_motionSection(){const e=this._spec;return s.qy`<section class="sec" aria-labelledby="pe-motion">
      <h3 id="pe-motion">${Gn(451)}</h3>
      <div class="lk-subject" ?inert=${this._locked("subject")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Gn(1074)}</span></div>
        ${this._seg(Gn(1074),Gg,e.subject,e=>this._subject(e))}
        <p class="help">
          ${"particles"===e.subject?Gn(636):"icon"===e.subject?Gn(957):Gn(984)}
        </p>
      </div>
      </div>
      <div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Gn(1034)}</span></div>
        ${this._seg(Gn(1034),Yg,e.units,e=>this._set({units:e},"Units"))}
        <p class="help">${"percent"===e.units?Gn(677):Gn(678)}</p>
      </div>
      ${this._switch(Gn(340),Gn(1026),e.follow_rotation,()=>this._set({follow_rotation:!e.follow_rotation},"Follow rotation"),"follow-switch")}
      </div>
    </section>`}_particlesSection(){const e=this._spec.particles??Jg,[t,i]=e.size,n=(n,r,a)=>s.qy`<div class="field">
      <div class="field-head"><span class="lbl">${r}</span></div>
      <mc-unit-field
        .value=${`${e.size[n]}px`}
        .label=${r}
        .units=${["px"]}
        .noCustom=${!0}
        .inputId=${a}
        .disabled=${this.disabled}
        @value-changed=${e=>{e.stopPropagation();const s=parseFloat(String(e.detail.value));if(!Number.isFinite(s))return;const r=Math.min(200,Math.max(1,Math.round(s))),a=0===n?[r,Math.max(r,i)]:[Math.min(t,r),r];this._look({size:a},"Particle size")}}
      ></mc-unit-field>
    </div>`;return s.qy`<section class="sec particles" aria-labelledby="pe-particles">
      <h3 id="pe-particles">${Gn(631)}</h3>
      <div class="field">
        <div class="field-head"><label for="pe-count">${Gn(193)}</label></div>
        <input
          class="input"
          id="pe-count"
          type="number"
          min="1"
          max=${tt}
          step="1"
          inputmode="numeric"
          .value=${String(e.count)}
          ?disabled=${this.disabled}
          @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isInteger(i)&&i>=1&&i<=tt&&this._look({count:i},"Particle count")}}
        />
        <p class="help">${Gn(846,{particles:tt})}</p>
      </div>
      <div class="pair">${n(0,Gn(833),"pe-size-min")} ${n(1,Gn(401),"pe-size-max")}</div>
      <div class="field">
        <div class="field-head"><span class="lbl">${Gn(173)}</span></div>
        <div class="colors">
          ${e.colors.map((t,i)=>s.qy`<div class="color-row">
              <mc-color-picker
                .value=${t}
                .label=${Gn(168,{i:i+1})}
                @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??"").trim();if(!n)return;const s=[...e.colors];s[i]=n,this._look({colors:s},"Particle colour")}}
              ></mc-color-picker>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${Gn(710,{i:i+1})}
                title=${Gn(709)}
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:e.colors.filter((e,t)=>t!==i)},"Remove particle colour")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`)}
        </div>
        ${e.colors.length?s.s6:s.qy`<p class="help">${Gn(567)}</p>`}
        ${e.colors.length<it?s.qy`<div>
              <button
                type="button"
                class="btn btn-text btn-sm add-color"
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:[...e.colors,e.colors[e.colors.length-1]??"#ffc107"]},"Add particle colour")}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${Gn(27)}
              </button>
            </div>`:s.s6}
      </div>
    </section>`}render(){const e=ca(this._spec.d),t=["path","subject"].filter(e=>this._locked(e));return s.qy`<div class="ed">
      ${t.length?bo(this.doc,this.layerView,t):s.s6}
      ${this._pathSection(e)} ${this._motionSection()} ${"particles"===this._spec.subject?s.qy`<div class="lk-path" ?inert=${this._locked("path")}>${this._particlesSection()}</div>`:s.s6}
    </div>`}};function tf(){return i.e(575).then(()=>i(9474)).then(e=>e,e=>{console.warn("Magic Card: path canvas not loaded",e)})}ef.styles=[Qp,vo,s.AH`
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
    `],Ug([(0,r.MZ)({attribute:!1})],ef.prototype,"doc",void 0),Ug([(0,r.MZ)({attribute:!1})],ef.prototype,"hass",void 0),Ug([(0,r.MZ)({attribute:!1})],ef.prototype,"library",void 0),Ug([(0,r.MZ)({type:Number})],ef.prototype,"time",void 0),Ug([(0,r.MZ)({type:Boolean,reflect:!0})],ef.prototype,"disabled",void 0),Ug([(0,r.MZ)({attribute:!1})],ef.prototype,"layerView",void 0),ef=Ug([(0,r.EM)("mc-anim-path-editor")],ef);var nf=i(3706);let sf=Date.now();const rf={"Add point":31,"Move point":471,"Move points":472,"Move path":468,"Move handle":466,"Delete point":228,"Delete points":229,"Delete handle":225,"Close path":159,"Change point type":131},af=e=>rf[e]?Gn(rf[e]):e;function of(e,t){const i=e?.screen;if(!(e&&i&&e.scale>0))return;const n=e.scale;return{left:i.left+t.x*n,top:i.top+t.y*n,width:t.width*n,height:t.height*n}}class lf extends s.WF{constructor(){super(...arguments),this.canvasState="idle",this._again=!1}ensureCanvas(){if("idle"!==this.canvasState||this._loading)return;this.canvasState="loading";const e=this._again;this._again=!1,this._loading=(e?function(){const e=i,t=e.u,n=++sf;e.u=e=>{const i=t(e);return`${i}${i.includes("?")?"&":"?"}r=${n}`};try{return tf()}finally{e.u=t}}():tf()).then(t=>{this._loading=void 0,t?(()=>{const e="undefined"==typeof customElements?void 0:customElements.get(nf.eo);return(e?.contractRevision??0)>=8})()?(this.chunk=t,this.canvasState="ready",e&&this.updateComplete.then(()=>this.toolsReady())):this.canvasState="old":this.canvasState="failed"})}retry(){this._again=!0,this.canvasState="idle",this.ensureCanvas()}toolsReady(){}_reload(){confirm(Gn(707))&&location.reload()}renderNotice(){return"failed"===this.canvasState?s.qy`<p class="host-notice" role="alert">${Gn(192)}<button type="button" @click=${()=>this.retry()}>${Gn(1018)}</button></p>`:"old"===this.canvasState?s.qy`<p class="host-notice" role="alert">
        ${Gn(939)}<button type="button" @click=${()=>this._reload()}>${Gn(706)}</button>
      </p>`:s.s6}}lf.styles=s.AH`
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
      left: 50%; /* physical */
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: calc(100% - 24px);
      margin: 0;
      padding: 6px 6px 6px 12px;
      padding-inline: 12px 6px;
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
  `,function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);r>3&&a&&Object.defineProperty(t,i,a)}([(0,r.wk)()],lf.prototype,"canvasState",void 0);var cf=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const df=[],pf=new Map,hf=(e,t)=>Object.entries(e).every(([e,i])=>Math.abs(t[e]-i)<.005);let uf=class extends lf{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._live={anchors:[],closed:!1},this._list=[],this._path={anchors:[],closed:!1},this._announce="",this._onChange=e=>{e.stopPropagation();const t=e.detail,i=t.paths;if(this._setLive(i[0]??{anchors:[],closed:!1}),!t.commit||!this.doc)return;const n=da(this._live);this._path=this._live,this._d=n;const s=af(t.label),r={...this.doc,path:{...this.doc.path??{units:"percent",follow_rotation:!1,subject:"element"},d:n}};this._announce=s,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:r,label:s}}))}}willUpdate(e){if(e.has("doc")){const e=this.doc?.path?.d??"";e!==this._d&&(this._path=ca(e),this._d=e,this._setLive(this._path))}"path"===this.doc?.kind&&this.ensureCanvas()}_setLive(e){this._live=e,this._list=e.anchors.length?[e]:[]}_geometry(){const e=this.doc?.path,t=this.stage,i=t?.rect.width??0,n=t?.rect.height??0;if(!(t&&e&&i>0&&n>0))return;const s="px"===e.units,r=this.stage?.subject??this.subjectRect,a="particles"===e.subject,o=!a&&r&&r.width>0&&r.height>0?r:{x:0,y:0,width:i,height:n},l=of(t,o);if(!l)return;const c=s?o.width:100,d=s?o.height:100,p=a?{x:0,y:0,w:c,h:d}:{x:-c/2,y:-d/2,w:c,h:d},h=s?"px":"%",u=(e=>"px"===e?10:5)(e.units),m=this._geo;return m&&m.units===h&&m.step===u&&hf(m.frame,p)&&hf(m.place,l)?m:this._geo={frame:p,place:l,units:h,step:u}}_px(e,t){return[e.place.left+(t[0]-e.frame.x)*e.place.width/e.frame.w,e.place.top+(t[1]-e.frame.y)*e.place.height/e.frame.h]}toolsReady(){this._announce=Gn(938),this.renderRoot.querySelector("mc-path-canvas")?.focus({preventScroll:!0})}_mapD(e){const t=t=>this._px(e,t);return da({closed:this._path.closed,anchors:this._path.anchors.map(e=>{const[i,n]=t([e.x,e.y]);return{...e,x:i,y:n,in:e.in?t(e.in):void 0,out:e.out?t(e.out):void 0}})})}_arrows(e){const t=this._d??"";return this._path.anchors.length<2||!t?[]:[.25,.5,.75].map(i=>{const n=ga(t,i-.01),r=ga(t,i+.01),a=ga(t,i);if(!n||!r||!a)return s.JW``;const o=this._px(e,[n.x,n.y]),l=this._px(e,[r.x,r.y]),c=this._px(e,[a.x,a.y]);if(Math.hypot(l[0]-o[0],l[1]-o[1])<.5)return s.JW``;const d=180*Math.atan2(l[1]-o[1],l[0]-o[0])/Math.PI;return s.JW`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${c[0].toFixed(1)} ${c[1].toFixed(1)}) rotate(${d.toFixed(1)})"></path>`})}_dot(e,t,i,n,r){const a=ga(t,i);if(!a)return s.s6;const[o,l]=this._px(e,[a.x,a.y]);let c=s.s6;if(n){const n=ga(t,Math.max(0,i-.005)),r=ga(t,Math.min(1,i+.005));if(n&&r){const t=this._px(e,[n.x,n.y]),i=this._px(e,[r.x,r.y]),a=180*Math.atan2(i[1]-t[1],i[0]-t[0])/Math.PI;c=s.JW`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${a.toFixed(1)})"></path>`}}return s.JW`<g class="subject" data-k=${r} transform="translate(${o.toFixed(1)} ${l.toFixed(1)})">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${c}
    </g>`}_subject(e){const t=this._d??"";if(this._path.anchors.length<2)return s.s6;const i=this.doc?.path,n=!!i?.follow_rotation,r=Math.min(1,Math.max(0,Number.isFinite(this.time)?this.time:0)),a="particles"===i?.subject?Math.min(60,Math.max(1,i.particles?.count??3)):1;return Array.from({length:a},(i,s)=>this._dot(e,t,0===s?r:(r+s/a)%1,n,s))}render(){const e=this._geometry();if(!e)return s.qy`${this.renderNotice()}`;const t=this._path.anchors.length,i=this._mapD(e),n=this._px(e,[0,0]),r=t>1?this._px(e,[this._path.anchors[0].x,this._path.anchors[0].y]):void 0,a="ready"===this.canvasState;return s.qy`
      <svg class="layer decor" aria-hidden="true">
        <path class="origin" d="M${n[0]-6} ${n[1]}h12M${n[0]} ${n[1]-6}v12"></path>
        ${i&&t>1?s.JW`<path class="line" d=${i}></path>`:s.s6} ${this._arrows(e)} ${this._subject(e)}
        ${r?s.JW`<text class="tag" x=${r[0]+10} y=${r[1]-9}>${Gn(872)}</text>`:s.s6}
      </svg>
      ${a?s.qy`<mc-path-canvas
            overlay
            .placement=${e.place}
            .frame=${e.frame}
            .units=${e.units}
            .paths=${this._list}
            .paint=${df}
            .mode=${this.disabled?"view":this._live.closed?"nodes":"add"}
            .maxPaths=${1}
            .gridStep=${e.step}
            .snap=${(e=>{let t=pf.get(e);return t||pf.set(e,t={enabled:!0,grid:e,anchors:!1,frame:!1}),t})(e.step)}
            .nudge=${1}
            .bigNudge=${e.step}
            .fineNudge=${.1}
            aria-label=${Gn(453)}
            @mc-path-change=${this._onChange}
          ></mc-path-canvas>`:s.s6}
      ${0===t&&a&&!this.disabled?s.qy`<p class="hint">${Gn(156)}</p>`:1===t&&a&&!this.disabled?s.qy`<p class="hint">${Gn(155)}</p>`:s.s6}
      ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `}};uf.styles=[lf.styles,s.AH`
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
        left: 50%; /* physical */
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
    `],cf([(0,r.MZ)({attribute:!1})],uf.prototype,"doc",void 0),cf([(0,r.MZ)({type:Number})],uf.prototype,"time",void 0),cf([(0,r.MZ)({type:Boolean,reflect:!0})],uf.prototype,"disabled",void 0),cf([(0,r.MZ)({attribute:!1})],uf.prototype,"stage",void 0),cf([(0,r.MZ)({attribute:!1})],uf.prototype,"subjectRect",void 0),cf([(0,r.MZ)({attribute:!1})],uf.prototype,"hass",void 0),cf([(0,r.MZ)({attribute:!1})],uf.prototype,"library",void 0),cf([(0,r.wk)()],uf.prototype,"_live",void 0),cf([(0,r.wk)()],uf.prototype,"_path",void 0),cf([(0,r.wk)()],uf.prototype,"_announce",void 0),uf=cf([(0,r.EM)("mc-anim-path-host")],uf);const mf=e=>Math.round(1e3*e)/1e3;function gf(e){return!!e&&("keyframes"===e.kind||"path"===e.kind&&"particles"!==e.path?.subject)}function ff(e){if(!e)return;const t=parseFloat(e);return Number.isFinite(t)?/ms\s*$/i.test(e)?t/1e3:t:void 0}function vf(e,t,i){const n=(e??"").trim();if(!n)return{status:"invalid",name:Gn(547),kind:"",problem:Gn(653)};if(Je(n)){const e=Xe(n);if(i&&e===i)return{status:"invalid",name:e,kind:Gn(794),problem:Gn(18)};const s=t?.[e];if(!s)return{status:"missing",name:e,kind:"",problem:Gn(578)};if("keyframes"===s.kind)return{status:"ok",name:s.name||e,kind:Gn(398),defaultDuration:s.duration};if("path"===s.kind)return gf(s)?{status:"ok",name:s.name||e,kind:Gn(643),defaultDuration:s.duration}:{status:"invalid",name:s.name||e,kind:Gn(643),problem:Gn(632)};const r="particles"===s.kind?Gn(631):Gn(794);return{status:"invalid",name:s.name||e,kind:r,problem:Gn(1194,{kind:r})}}const s=oe(n);return s?mt.has(s.id)?{status:"ok",name:(0,K.t)(s.name),kind:Gn(685),defaultDuration:ff(s.defaults.duration)}:{status:"invalid",name:(0,K.t)(s.name),kind:Gn(685),problem:Gn(291)}:{status:"missing",name:n,kind:Gn(685),problem:Gn(1036)}}function bf(e,t,i){const n=[...e];if(t<0||t>=n.length||i<0||i>=n.length||t===i)return n;const[s]=n.splice(t,1);return n.splice(i,0,s),n}function yf(e){return`${mf(e).toFixed(2).replace(/\.?0+$/,"")} s`}const xf={keyframes:"mdi:chart-bell-curve-cumulative",path:"mdi:vector-curve"},_f=e=>(e?.length??0)<20;var wf=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function $f(e){const t=String(e??"").trim();if(!t)return;const i=parseFloat(t);return Number.isFinite(i)?/ms$/i.test(t)?i/1e3:i:void 0}const kf=(e,t,i)=>Math.min(i,Math.max(t,e)),Mf=e=>Math.round(1e3*e)/1e3;let Sf=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._open=-1,this._query="",this._announce="",this._pick=null,this._trigger=null,this._focusSearch=!1,this._onDragKey=e=>{"Escape"===e.key&&this._drag&&(e.preventDefault(),e.stopPropagation(),this._cancelDrag())}}get _steps(){return this.doc?.steps??[]}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_remap(e){const t=this.layerView,i=t&&e(t);i&&i!==t&&this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:i},bubbles:!0,composed:!0}))}_writeSteps(e,t,i=!1){this.doc&&this._emit({...this.doc,steps:e},t,i)}_patchStep(e,t,i){const n=this._steps.map((i,n)=>{if(n!==e)return i;const s={...i,...t};return void 0===t.duration&&"duration"in t&&delete s.duration,s});this._writeSteps(n,i)}_addStep(e){if(!_f(this._steps))return;const t=[...this._steps,{animation:e,delay:0,repeat:1}];this._open=t.length-1,this._focusAfter={index:t.length-1,part:"toggle"},this._writeSteps(t,"Add step"),this._announce=Gn(894,{count:t.length,name:vf(e,this.library,this.doc?.id).name})}_locked(e,t=!1){const i=!!this.layerView?.locked.includes(`step:${e}`);return i&&t&&(this._announce=Gn(899,{i:e+1})),i}_deleteStep(e){if(this._steps.length<=1||this._locked(e,!0))return;const t=this._steps.filter((t,i)=>i!==e);this._open===e?this._open=-1:this._open>e&&this._open--,this._focusAfter=t.length?{index:Math.min(e,t.length-1),part:"toggle"}:void 0,this._writeSteps(t,"Delete step"),this._remap(t=>function(e,t){return fo(e,e=>e===t?-1:e>t?e-1:e)}(t,e)),this._announce=Gn(895,{index:e+1})}_move(e,t,i="handle"){const n=this._steps.length;e===t||t<0||t>=n||this._locked(e,!0)||(this._open=this._followMove(this._open,e,t),this._focusAfter={index:t,part:i},this._writeSteps(bf(this._steps,e,t),"Move step"),this._remap(i=>go(i,e,t)),this._announce=Gn(893,{to:t+1,n}))}_followMove(e,t,i){return e<0?e:e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}_onHandleDown(e,t){if(this.disabled||0!==e.button||this._steps.length<2||this._locked(t,!0))return;const i=[...this.renderRoot.querySelectorAll(".step")];if(!i[t])return;e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId);const n=i.map(e=>e.getBoundingClientRect()),s=n[t+1]??n[t-1],r=s?Math.abs(t+1<n.length?s.top-n[t].bottom:n[t].top-s.bottom):0;this._drag={from:t,to:t,dy:0,startY:e.clientY,pointerId:e.pointerId,mids:n.map(e=>e.top+e.height/2),shift:n[t].height+r,steps:this._steps,moved:!1},window.addEventListener("keydown",this._onDragKey,!0)}_endDrag(){const e=this._drag;return this._drag=void 0,window.removeEventListener("keydown",this._onDragKey,!0),e}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_onHandleMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=e.clientY-t.startY,n=e.clientY;let s=t.from;for(let e=t.from+1;e<t.mids.length;e++)n>t.mids[e]&&(s=e);for(let e=t.from-1;e>=0;e--)n<t.mids[e]&&(s=e);const r=s!==t.to;this._drag={...t,dy:i,to:s,moved:t.moved||r},r&&this.doc&&this._emit({...this.doc,steps:bf(t.steps,t.from,s)},"Move step",!0)}_onHandleUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._endDrag(),t.to!==t.from&&(this._open=this._followMove(this._open,t.from,t.to),this._focusAfter={index:t.to,part:"handle"},this.doc&&this._emit({...this.doc,steps:bf(t.steps,t.from,t.to)},"Move step"),this._remap(e=>go(e,t.from,t.to)),this._announce=Gn(892,{to:t.to+1,count:t.steps.length})))}_cancelDrag(){const e=this._endDrag();e&&e.moved&&this.doc&&this._emit({...this.doc,steps:e.steps},"Move step")}_onStepKey(e,t){if(!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key||this.disabled)return;e.preventDefault();const i=e.target.classList?.contains("handle");this._move(t,t+("ArrowUp"===e.key?-1:1),i?"handle":"toggle")}_dragOffset(e){const t=this._drag;return t?e===t.from?t.dy:t.from<t.to&&e>t.from&&e<=t.to?-t.shift:t.to<t.from&&e>=t.to&&e<t.from?t.shift:0:0}_popover(){return this.renderRoot.querySelector("mc-ui-popover.pick-pop")}_openPicker(e,t){if(this.disabled)return;const i=e.currentTarget;this._pick&&this._trigger===i?this._popover()?.close("action"):(this._trigger=i,this._pick=t,this._query="",this._focusSearch=!0)}_choose(e){const t=this._pick;this._popover()?.close("action"),this._pick=null,t&&("add"===t.mode?this._addStep(e):this._steps[t.index]?.animation!==e&&this._patchStep(t.index,{animation:e},"Change step animation"))}_onPickKey(e){const t="INPUT"===e.target.tagName;if(t&&("Home"===e.key||"End"===e.key))return;const i=[...this.renderRoot.querySelectorAll('.pick-pop [role="menuitem"]')],n=this.renderRoot.querySelector(".pick-pop .pick-search input"),s=i.indexOf(e.target),r=t=>{t&&(e.preventDefault(),t.focus())};"ArrowDown"===e.key?r(t?i[0]:i[Math.min(i.length-1,s+1)]):"ArrowUp"===e.key?r(s<=0?n:i[s-1]):"Home"===e.key?r(i[0]):"End"===e.key&&r(i[i.length-1])}_renderPicker(){const e=this._pick,t="step"===e?.mode?this._steps[e.index]?.animation:void 0,i=function(e,t,i=""){const n=(0,zt.A)(i.trim()),s=(...e)=>!n||e.some(e=>e&&(0,zt.A)(e).includes(n)),r=[],a=Object.values(e??{}).filter(e=>e.id!==t&&gf(e)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).filter(e=>s(e.name,e.id,Gn(1121),e.kind)).map(e=>({value:Ye+e.id,name:e.name||e.id,kind:"path"===e.kind?Gn(643):Gn(398),icon:xf[e.kind],duration:e.duration}));a.length&&r.push({label:Gn(531),items:a});for(const e of se){const t=ne.filter(t=>t.group===e&&mt.has(t.id)&&s((0,K.t)(t.name),t.id,e,(0,K.t)(re[e]))).map(e=>({value:e.id,name:(0,K.t)(e.name),icon:"mdi:motion-play-outline",duration:ff(e.defaults.duration)}));t.length&&r.push({label:(0,K.t)(re[e]),items:t})}return r}(this.library,this.doc?.id,this._query),n=Gn("add"===e?.mode?36:891);return s.qy`
      <mc-ui-popover
        class="pick-pop"
        label=${n}
        .anchor=${this._trigger}
        @mc-popover-close=${e=>{e.stopPropagation(),this._pick=null,this._query=""}}
      >
        <div class="pick" @keydown=${e=>this._onPickKey(e)}>
          <div class="pick-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${Gn(774)}
              aria-label=${Gn(774)}
              autocomplete="off"
              .value=${this._query}
              @input=${e=>this._query=e.target.value}
            />
          </div>
          <div class="pick-list" role="menu" aria-label=${n}>
            ${i.length?i.map(e=>s.qy`
                    <div class="pick-group" role="group" aria-label=${e.label}>
                      <div class="pick-head" aria-hidden="true">${e.label}</div>
                      ${e.items.map(e=>s.qy`<button
                          type="button"
                          role="menuitem"
                          class="pick-item ${e.value===t?"is-current":""}"
                          data-value=${e.value}
                          @click=${()=>this._choose(e.value)}
                        >
                          <ha-icon icon=${e.icon}></ha-icon>
                          <span class="pick-name">${e.name}${e.kind?s.qy`<span class="pick-kind"> · ${e.kind}</span>`:s.s6}</span>
                          ${void 0!==e.duration?s.qy`<span class="pick-dur">${yf(e.duration)}</span>`:s.s6}
                          ${e.value===t?s.qy`<ha-icon class="pick-check" icon="mdi:check"></ha-icon>`:s.s6}
                        </button>`)}
                    </div>
                  `):s.qy`<p class="menu-note">${Gn(548,{query:this._query})}</p>`}
          </div>
        </div>
      </mc-ui-popover>
    `}_field(e,t,i){return s.qy`<div class="field">
      <div class="field-head">${i?s.qy`<label for=${i}>${e}</label>`:s.qy`<span class="lbl">${e}</span>`}</div>
      ${t}
    </div>`}_renderSchedule(e){const t=e.total,i=function(e,t){if(!e.total)return-1;const i=Math.min(1,Math.max(0,t))*e.total,n=e.entries.find(t=>t.play>0&&i>=t.start&&(i<t.end||i===t.end&&t.end===e.total));return n?n.index:-1}(e,this.time),n=e=>t?e/t*100:0,r=this._steps.length,a=e.entries.filter(e=>"ok"!==e.status).length,o=!1!==this.doc?.loop,l=this._drag?this._followMove(this._open,this._drag.from,this._drag.to):this._open,c=new Map,d=t?Gn(1256,{steps:Gn(1169,{count:r}),total:yf(t),loop:Gn(o?1120:1128),skipped:a?Gn(5,{count:a}):""}):Gn(591);return s.qy`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${e.entries.map(e=>{if("ok"!==e.status){const t=c.get(e.start)??0;return c.set(e.start,t+1),s.qy`<span class="mark" style="left:calc(${n(e.start)}% + ${8*t}px)" title=${Gn(896,{index:e.index+1})} @click=${()=>this._reveal(e.index)}></span>`}const t=["blk",e.index===l?"is-open":"",e.index===i?"is-live":""].join(" "),r=n(e.end-e.start);return s.qy`<span
              class=${t}
              style="left:${n(e.start)}%;width:${r}%;--plays:${e.repeat}"
              title=${Gn(897,{index:e.index+1,from:yf(e.start),to:yf(e.end)})}
              @click=${()=>this._reveal(e.index)}
              >${r>=6?e.index+1:""}</span
            >`})}
          ${t?s.qy`<span class="playhead" style="left:${100*kf(this.time,0,1)}%"></span>`:s.s6}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${o?s.qy`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>${Gn(436)}</span>`:s.s6}
          <span>${yf(t)}</span>
        </div>
        <p class="sr-only">${d}</p>
      </div>
    `}_reveal(e){this._open=e,this.updateComplete.then(()=>this.renderRoot.querySelector(`.step[data-i="${e}"]`)?.scrollIntoView({block:"nearest"}))}_renderStep(e,t,i){const n=vf(e.animation,this.library,this.doc?.id),r=this._open===t,a="ok"!==n.status,o=e=>`seq-${t}-${e}`,l=a?"missing"===n.status?Gn(577):Gn(117):function(e,t){const i=[];e.delay>0&&i.push(Gn(1089,{seconds:yf(e.delay)}));const n=e.duration??t.defaultDuration;return void 0!==n&&i.push(yf(n)),e.repeat>1&&i.push(`× ${e.repeat}`),i.join(" · ")}(e,n),c=this._drag?.from===t,d=this._dragOffset(t),p=void 0!==n.defaultDuration?String(Mf(n.defaultDuration)):"",h=this._locked(t);return s.qy`
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
            aria-label=${Gn(476,{i:t+1})}
            aria-describedby="seq-move-hint"
            title=${Gn(255)}
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
              <span class="nm">${n.name}</span>
              <span class="sum ${a?"error":""}">${a?s.qy`<ha-icon icon="mdi:alert-circle-outline"></ha-icon>`:s.s6}${l}</span>
            </span>
            <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${Gn(234,{i:t+1})}
            title=${Gn(i<=1?20:233)}
            ?disabled=${this.disabled||h||i<=1}
            @click=${()=>this._deleteStep(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${r?s.qy`<div class="body" id=${o("body")}>
              ${h?bo(this.doc,this.layerView,[`step:${t}`]):s.s6}
              ${a?s.qy`<p class="help error problem" role="note">${n.problem}</p>`:s.s6}
              ${this._field(Gn(65),s.qy`<button
                  type="button"
                  class="input pick-btn"
                  id=${o("anim")}
                  aria-haspopup="menu"
                  aria-expanded=${"step"===this._pick?.mode&&this._pick.index===t?"true":"false"}
                  ?disabled=${this.disabled||h}
                  @click=${e=>this._openPicker(e,{mode:"step",index:t})}
                >
                  <span class="pick-val">${n.name}${n.kind&&n.kind!==Gn(685)?s.qy`<span class="pick-kind"> · ${n.kind}</span>`:s.s6}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,o("anim"))}
              <div class="fields">
                ${this._field(Gn(216),s.qy`<mc-unit-field
                    .value=${e.delay?`${Mf(e.delay)}s`:""}
                    .label=${Gn(216)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${"0"}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation(),this._patchStep(t,{delay:kf(Mf($f(e.detail.value)??0),0,600)},"Change step delay")}}
                  ></mc-unit-field>`)}
                ${this._field(Gn(283),s.qy`<mc-unit-field
                    .value=${void 0!==e.duration?`${Mf(e.duration)}s`:""}
                    .label=${Gn(283)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${p}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation();const i=$f(e.detail.value);this._patchStep(t,{duration:void 0===i||i<=0?void 0:kf(Mf(i),.05,600)},"Change step duration")}}
                  ></mc-unit-field>`)}
                ${this._field(Gn(673),s.qy`<input
                    class="input"
                    id=${o("plays")}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    .value=${String(e.repeat)}
                    ?disabled=${this.disabled||h}
                    @change=${i=>{const n=i.target,s=Math.round(Number(n.value));if(!n.value.trim()||!Number.isFinite(s))return void(n.value=String(e.repeat));const r=kf(s,1,100);n.value=String(r),r!==e.repeat&&this._patchStep(t,{repeat:r},"Change step plays")}}
                  />`,o("plays"))}
              </div>
              <p class="help">${p?Gn(218,{seconds:p}):Gn(219)}</p>
            </div>`:s.s6}
      </li>
    `}render(){const e=this.doc;if(!e)return s.qy``;const t=this._drag?this._drag.steps:this._steps,i=function(e,t,i){const n=[];let s=0;return(e??[]).forEach((e,r)=>{const a=vf(e.animation,t,i),o="ok"===a.status?e.duration??a.defaultDuration??0:0,l=Math.max(1,Math.round(e.repeat||1));if(!o)return void n.push({index:r,status:"ok"===a.status?"invalid":a.status,start:mf(s),play:0,repeat:l,end:mf(s)});const c=s+Math.max(0,e.delay||0),d=c+o*l;n.push({index:r,status:"ok",start:mf(c),play:mf(o),repeat:l,end:mf(d)}),s=d}),{entries:n,total:mf(s)}}(this._drag?bf(this._drag.steps,this._drag.from,this._drag.to):t,this.library,e.id),n=!1!==e.loop,r=e.stagger??{children:!1,delay:.15},a=!_f(t);return s.qy`
      <div class="wrap">
        <section class="group" aria-label=${Gn(773)}>${this._renderSchedule(i)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">${Gn(667)}</h3>
            <span class="chip is-count" title=${Gn(1255,{steps:20})}>${t.length} / ${20}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">${Gn(257)}</p>
          ${t.length?s.qy`<ol class="steps ${this._drag?"is-sorting":""}">${t.map((e,i)=>this._renderStep(e,i,t.length))}</ol>`:s.qy`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>${Gn(563)}</strong>
                <p>${Gn(37)}</p>
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
              <ha-icon icon="mdi:plus"></ha-icon>${Gn(36)}
            </button>
            ${a?s.qy`<span class="help">${Gn(1254,{steps:20})}</span>`:s.s6}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">${Gn(670)}</h3></div>
          <div class="switch-row">
            <div class="txt">
              ${Gn(432)}
              <p class="help">${Gn(873)}</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${n?"true":"false"}
              aria-label=${Gn(432)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,loop:!n},Gn(n?433:434))}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              ${Gn(868)}
              <p class="help">${Gn(666)}</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${r.children?"true":"false"}
              aria-label=${Gn(868)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,stagger:{...r,children:!r.children}},r.children?Gn(869):Gn(870))}
            ></button>
          </div>
          ${r.children?this._field(Gn(217),s.qy`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${Mf(r.delay)}s`}
                  .label=${Gn(217)}
                  .units=${["s"]}
                  .noCustom=${!0}
                  .placeholder=${"0"}
                  ?disabled=${this.disabled}
                  @value-changed=${t=>{t.stopPropagation(),this._emit({...e,stagger:{...r,delay:kf(Mf($f(t.detail.value)??0),0,10)}},"Change stagger delay")}}
                ></mc-unit-field>`):s.s6}
        </section>
        <div class="sr-only" aria-live="polite">${this._announce}</div>
        ${this._pick?this._renderPicker():s.s6}
      </div>
    `}willUpdate(e){e.has("doc")&&this._open>=this._steps.length&&(this._open=-1)}updated(){const e=this._pick?this._popover():null;e&&!e.open&&(e.anchor=this._trigger,e.show()),this._focusSearch&&e&&(this._focusSearch=!1,e.updateComplete.then(()=>this.renderRoot.querySelector(".pick-pop .pick-search input")?.focus({preventScroll:!0})));const t=this._focusAfter;t&&(this._focusAfter=void 0,this.renderRoot.querySelector(`.step[data-i="${t.index}"] .${t.part}`)?.focus())}};Sf.styles=[Qp,vo,s.AH`
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
        direction: ltr; /* the schedule runs left to right */
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
        margin-left: -3px; /* physical */
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
        margin-left: -1px; /* physical */
        background: var(--mc-accent);
        border-radius: 1px;
        pointer-events: none;
      }
      .playhead::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -4px; /* physical */
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
        text-align: start;
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
        text-align: start;
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
        inset-inline: 10px auto;
        --mdc-icon-size: 18px;
        color: var(--mc-text-2);
        pointer-events: none;
      }
      .pick-search .input {
        padding-inline-start: 36px;
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
        text-align: start;
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
    `],wf([(0,r.MZ)({attribute:!1})],Sf.prototype,"doc",void 0),wf([(0,r.MZ)({attribute:!1})],Sf.prototype,"hass",void 0),wf([(0,r.MZ)({attribute:!1})],Sf.prototype,"library",void 0),wf([(0,r.MZ)({type:Number})],Sf.prototype,"time",void 0),wf([(0,r.MZ)({type:Boolean,reflect:!0})],Sf.prototype,"disabled",void 0),wf([(0,r.MZ)({attribute:!1})],Sf.prototype,"layerView",void 0),wf([(0,r.wk)()],Sf.prototype,"_open",void 0),wf([(0,r.wk)()],Sf.prototype,"_drag",void 0),wf([(0,r.wk)()],Sf.prototype,"_query",void 0),wf([(0,r.wk)()],Sf.prototype,"_announce",void 0),wf([(0,r.wk)()],Sf.prototype,"_pick",void 0),Sf=wf([(0,r.EM)("mc-anim-sequence-editor")],Sf);const jf={hide:{name:363,tip:[364,821],key:"H",icon:["mdi:eye-outline","mdi:eye-off-outline"]},solo:{name:842,tip:[843,301],key:"S",icon:["mdi:radiobox-blank","mdi:radiobox-marked"]},lock:{name:428,tip:[428,1038],key:"L",icon:["mdi:lock-open-variant-outline","mdi:lock-outline"]}},Cf=["hide","solo","lock"],Af={hide:[1220,1233],solo:[1234,1231],lock:[1225,1235]};let zf="";function qf(e,t){const i=t??e.closest(".layers-body");return(i?[...i.querySelectorAll("[data-panel] > *")]:[e]).flatMap(e=>[...e.shadowRoot?.querySelectorAll("[data-lk]")??[]])}function Ef(e){const t=qf(e),i=t.find(e=>e.dataset.lk===zf)??t.find(e=>"true"===e.getAttribute("aria-pressed"))??t[0];for(const e of t){const t=e===i;e.tabIndex=t?0:-1,e.closest("li")?.querySelectorAll("[data-ctl]").forEach(e=>e.tabIndex=t?0:-1)}}class Hf{constructor(e,t){this.host=e,this.actions=t,this._n=0,e.addController(this),this.direction=new y(e)}hostUpdated(){Ef(this.host);const e=this._focus,t=this.host.renderRoot?.querySelector("mc-ui-menu");t&&this._menu?.first&&(this._menu.first=!1,t.anchor=this.host.renderRoot?.querySelector(`li[data-ref="${this._menu.key}"] [data-ctl="menu"]`)??void 0,t.show()),e&&this._refocus(e)}get view(){return this.host.layerView??Xa}announce(e,t=this.view){this.host.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:t,announce:e},bubbles:!0,composed:!0}))}locked(e){return!!this.host.doc&&co(this.host.doc,this.view,e)}refuseLocked(e,t){return!!this.locked(e)&&(this.announce(Gn(1221,{name:t})),!0)}setOpen(e,t){const i=this.view;i.open.includes(e)!==t&&this.announce("",{...i,open:t?[...i.open,e]:i.open.filter(t=>t!==e)})}toggle(e,t,i){const n=function(e,t,i){const n=lo[i];return{...e,[n]:e[n].includes(t)?e[n].filter(e=>e!==t):[...e[n],t]}}(this.view,e,i),s=n["hide"===i?"hidden":"solo"===i?"solo":"locked"].includes(e);this.announce(Gn(Af[i][s?0:1],{name:t}),n)}focusKey(e,t){this._focus={key:e,ctl:t},this._refocus(this._focus),this.host.requestUpdate()}async _refocus(e,t=0){await this.host.updateComplete;const i=qf(this.host).find(t=>t.dataset.lk===e.key),n=i?e.ctl?i.closest("li")?.querySelector(`[data-ctl="${e.ctl}"]`):i:void 0;n?(this._focus===e&&(this._focus=void 0),zf=e.key,n.focus(),n.scrollIntoView?.({block:"nearest"})):t<4&&this._focus===e?setTimeout(()=>{this._refocus(e,t+1)},16):this._focus===e&&(this._focus=void 0)}_key(e,t){const i=e.target;if(!i.matches?.("[data-lk]")||e.ctrlKey||e.metaKey)return;const n=qf(this.host),s=n.indexOf(i),r=t=>{e.preventDefault(),n[Math.max(0,Math.min(n.length-1,t))]?.focus()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key))return e.preventDefault(),void this._move(t,"ArrowUp"===e.key?"up":"down");if(e.altKey)return;if(!e.shiftKey&&"ArrowUp"===e.key)return r(s-1);if(!e.shiftKey&&"ArrowDown"===e.key)return r(s+1);if("Home"===e.key)return r(0);if("End"===e.key)return r(n.length-1);const a="rtl"===this.direction.direction;if(e.key===(a?"ArrowLeft":"ArrowRight")&&!1===t.expanded)e.preventDefault(),this.actions.open?.(t.key,!0);else if(e.key===(a?"ArrowRight":"ArrowLeft"))if(t.expanded)e.preventDefault(),this.actions.open?.(t.key,!1);else{const i=this.host.doc?oo(this.host.doc,t.key):void 0;i&&(e.preventDefault(),this.focusKey(i))}else if("F2"===e.key&&t.renamable&&this.actions.rename)e.preventDefault(),this._rename(t);else if(!e.shiftKey&&1===e.key.length){const i=Cf.find(t=>jf[t].key===e.key.toUpperCase());i&&this._toggles(t).includes(i)&&(e.preventDefault(),this.toggle(t.key,t.name,i))}}_toggles(e){return e.toggles??Ja[e.key.split(":")[0]]??[]}_move(e,t,i){const n="up"===t?e.up:e.down;n?.ok&&this.actions.move&&(this.refuseLocked(e.key,e.name)||(this.actions.move(e.key,t),this.focusKey(e.key,i)))}_rename(e){this.refuseLocked(e.key,e.name)||this.actions.rename?.(e.key)}_openMenu(e,t=!0){this._menu={key:e,first:t},this.host.requestUpdate()}_toggleMenu(e){if(this._menu?.key===e)return this._closeMenu();const t=this._outsideAt;this._outsideAt=void 0,t&&t.key===e&&Date.now()-t.at<400||this._openMenu(e)}_closeMenu(e=!0){const t=this._menu?.key;this._menu=void 0,this.host.requestUpdate(),t&&e&&this.focusKey(t,"menu")}_menuItems(e){const t=this.locked(e.key),i=[];if(this.actions.move)for(const n of["up","down"]){const s="up"===n?e.up:e.down;if(!s)continue;const r=s.menu??s.label,a=t?Gn(429):s.ok?void 0:Gn("up"===n?50:49);i.push({id:`move-${n}`,icon:"up"===n?"mdi:arrow-up":"mdi:arrow-down",label:t?r.replace(/ \(.*\)$/,""):r,reason:a,keys:Gn("up"===n?55:54),run:()=>this._move(e,n,"menu")})}e.renamable&&this.actions.rename&&i.push({id:"rename",icon:"mdi:rename-outline",label:Gn(723),reason:t?Gn(429):void 0,keys:"F2",run:()=>this._rename(e)});const n=this.view;return Cf.filter(t=>this._toggles(e).includes(t)).forEach((t,s)=>{const r=n["hide"===t?"hidden":"solo"===t?"solo":"locked"].includes(e.key);i.push({id:t,icon:r?"mdi:checkbox-marked":"mdi:checkbox-blank-outline",label:Gn(jf[t].name),checked:r,keys:jf[t].key,separatorBefore:0===s&&i.length>0,run:()=>this.toggle(e.key,e.name,t)})}),i}_renderMenu(e){const t=this._menuItems(e);return s.qy`<mc-ui-menu
      .items=${t}
      .align=${"end"}
      label=${Gn(406,{name:e.name})}
      @mc-menu-pick=${e=>{e.stopPropagation();const i=t.find(t=>t.id===e.detail.id);this._closeMenu(),i?.run()}}
      @mc-menu-close=${e=>{e.stopPropagation();const t=e.detail.reason;"pick"!==t&&("outside"===t&&this._menu&&(this._outsideAt={key:this._menu.key,at:Date.now()}),this._closeMenu(!1))}}
    ></mc-ui-menu>`}row(e){const t=this.host,i=t.doc,n=this.view,r="compact"===t.density,a=this._toggles(e),o=i?function(e,t,i){if(t.hidden.includes(i))return{kind:"self"};const n=ao(e,t);if(n.has(i))return{kind:"solo"};for(let t=oo(e,i),s=0;t&&s<4;t=oo(e,t),s++)if(n.has(t))return{kind:"parent",by:t}}(i,n,e.key):void 0,l=n.solo.includes(e.key),c=n.locked.includes(e.key),d=!c&&this.locked(e.key),p=i&&!1===e.expanded?function(e,t,i){const n=ao(e,t);let s=0;for(const r of so(e).keys())oo(e,r)===i&&(n.has(r)||t.solo.includes(r))&&s++;return s}(i,n,e.key):0,h=[e.describe,"self"===o?.kind&&Gn(1108),"solo"===o?.kind&&Gn(1106),"parent"===o?.kind&&Gn(1107,{name:(e=>e?this.actions.nameOf?.(e)??e.split(":").slice(1).join(":"):"")(o.by)}),l&&"solo",c&&"locked",d&&Gn(1119),p>0&&Gn(1151,{below:p})].filter(Boolean),u="ld"+this._n++,m=c||d,g=t=>{const i="up"===t?e.up:e.down;return i?s.qy`<button type="button" class="icon-btn xs lt mv ${t}" data-ctl=${t} tabindex="-1" aria-label=${i.label} title=${i.label} aria-disabled=${i.ok&&!m?s.s6:"true"} @click=${()=>this._move(e,t,t)}>
        <ha-icon icon=${"up"===t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>`:s.s6},f=a.length>0||!!e.up||!!e.down||e.renamable&&!!this.actions.rename,v=r?s.s6:s.qy`<span class="lfull">${a.length?Cf.filter(e=>a.includes(e)).map(t=>{const i="hide"===t?"self"===o?.kind:"solo"===t?l:c,n=!i&&("hide"===t?!!o:"lock"===t&&d),r=jf[t];return s.qy`<button type="button" class="icon-btn xs lt ${n?"soft":""}" data-ctl=${t} data-toggle=${t} tabindex="-1" aria-pressed=${i?"true":"false"} aria-label=${Gn(r.name)} title=${"hide"===t&&!i&&e.key.startsWith("lane:")?Gn(365):Gn(r.tip[i?1:0])} @click=${()=>this.toggle(e.key,e.name,t)}>
        <ha-icon icon=${r.icon[i||n?1:0]}></ha-icon>
      </button>`}):s.s6}${g("up")}${g("down")}</span>`;return s.qy`<li class="lr lvl-${e.level??1} ${r?"compact":""} ${e.selected?"sel":""} ${o?"is-hidden":""} ${m?"is-locked":""}" data-ref=${e.key} data-id=${e.key.slice(e.key.indexOf(":")+1)} @dblclick=${()=>this.actions.dblclick?.(e.key)} @keydown=${t=>this._key(t,e)}>
      <div class="lr-in">
        ${void 0===e.expanded?s.qy`<span class="lcaret-space"></span>`:s.qy`<button type="button" class="icon-btn xs lt lcaret" tabindex="-1" aria-label=${e.expanded?Gn(163,{name:e.name}):Gn(310,{name:e.name})} @click=${()=>this.actions.open?.(e.key,!e.expanded)}>
              <ha-icon icon=${e.expanded?"mdi:chevron-down":"rtl"===this.direction.direction?"mdi:chevron-left":"mdi:chevron-right"}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${e.key} tabindex="-1" aria-pressed=${e.selected?"true":"false"} aria-expanded=${void 0===e.expanded?s.s6:e.expanded?"true":"false"} aria-describedby=${h.length?u:s.s6} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${(e.title??e.name)+(e.badge&&!e.title?` (${e.badge})`:"")} @focus=${e=>(zf=e.currentTarget.dataset.lk,Ef(t))} @click=${t=>this.actions.select(e.key,t)}>
          ${e.thumb??(e.bare?s.s6:s.qy`<ha-icon class="kind" icon=${e.icon??"mdi:layers-outline"}></ha-icon>`)}
          ${e.renaming?s.s6:s.qy`<span class="nm"><span class="nm-t">${e.name}</span>${e.note?s.qy`<small>${e.note}</small>`:s.s6}</span>`}
          ${e.badge?s.qy`<span class="lbadge">${e.badge}</span>`:s.s6}
          ${p>0?s.qy`<span class="lbadge warn" aria-hidden="true">${Gn(1150,{below:p})}</span>`:s.s6}
        </button>
        ${e.renaming?s.qy`<div class="lrename">${e.renaming}</div>`:s.s6}
        <span class="lst" aria-hidden="true">
          ${o?s.qy`<ha-icon icon="mdi:eye-off-outline"></ha-icon>`:s.s6}${l?s.qy`<ha-icon icon="mdi:radiobox-marked"></ha-icon>`:s.s6}${m?s.qy`<ha-icon icon="mdi:lock-outline"></ha-icon>`:s.s6}
        </span>
        ${v}
        ${f?s.qy`<button type="button" class="icon-btn xs lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key===e.key?"true":"false"} aria-label=${Gn(406,{name:e.name})} title=${Gn(405)} @click=${()=>this._toggleMenu(e.key)} @keydown=${t=>{"ArrowDown"!==t.key&&"ArrowUp"!==t.key||(t.preventDefault(),this._openMenu(e.key))}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`:s.s6}
        ${e.extra??s.s6}
      </div>
      ${h.length?s.qy`<span id=${u} class="lr-sr">${h.join(", ")}</span>`:s.s6}
      ${this._menu?.key===e.key?this._renderMenu(e):s.s6}
    </li>`}}const Lf=s.AH`
  ${ys}
  ${xs}
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
    padding-inline-end: 2px;
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
    padding-inline-start: 18px;
  }
  .lr.lvl-3 .lr-in {
    padding-inline-start: 36px;
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
`;function Vf(e){const t=e.lastIndexOf("|");return{target:e.slice(5,t),lane:e.slice(t+1)}}const Of=e=>Hs[Vf(e).lane]?Vs(Vf(e).lane):e,Pf=(e,t,i,n)=>io(e,i).length?t.open.includes(n):void 0;function Rf(e,t,i){const{target:n,lane:s}=Vf(i),r={kind:"keys",keys:no(t,n,s).map(e=>({target:n,lane:s,at:e,id:`${s}@${e}`})),target:n,targets:[n]};e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:r},bubbles:!0,composed:!0}))}function Nf(e,t,i,n,s){return io(t,n).map(r=>{const a=((e,t)=>`lane:${e}|${t}`)(n,r),o=no(t,n,r).length,l="keys"===i?.kind&&!!i.keys?.length&&i.keys.every(e=>e.target===n&&e.lane===r);return e.row({key:a,name:Of(a),bare:!0,level:s,badge:Gn(1162,{count:o}),describe:Gn(1112),selected:l,title:Gn(1238,{name:Of(a),count:o})})})}const Df="0 0 24 24",Tf=new Map,Ff=new Map,Bf=new Map,If=new Set;let Zf,Wf,Kf=0;const Uf=new Set;let Gf=!1;const Yf=e=>e.includes(":")?e.slice(0,e.indexOf(":")):"",Jf=new Set(["mdi","hass","hassio","hademo"]);function Xf(e){const t="undefined"==typeof window?{}:window,i=t.customIconsets?.[e];if("function"==typeof i)return i;const n=t.customIcons?.[e];return n&&"function"==typeof n.getIcon?e=>n.getIcon(e):void 0}function Qf(e,t){for(Tf.delete(e),Tf.set(e,{g:t,at:Date.now()});Tf.size>200;)Tf.delete(Tf.keys().next().value);t&&(If.delete(e),Bf.get(e)?.forEach(e=>{try{e()}catch{}}))}function ev(e){const t=Tf.get(e);if(t?.g)return Tf.delete(e),Tf.set(e,t),t.g}const tv=new Map;function iv(e,t){t&&tv.delete(t);const i=t??`svg:${function(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return(t>>>0).toString(36)+e.length.toString(36)}(e)}`;let n=i;for(let t=1;tv.has(n)&&tv.get(n).text!==e;t++)n=`${i}.${t}`;const s=function(e){const t=tv.get(e);return t&&(tv.delete(e),tv.set(e,t)),t}(n);if(s)return s.geometry&&!Tf.get(n)?.g&&Qf(n,s.geometry),n;const r=function(e){try{return We(e)}catch{return Fe(Te)}}(e),a={text:e};if(r.error)a.error=r.error;else{const e={paths:r.paths,viewBox:r.viewBox};r.accentPaths.length&&(e.secondary=r.accentPaths),r.strokes.length&&(e.strokes=r.strokes),r.evenodd&&(e.evenodd=r.evenodd),a.markup=r.markup,a.geometry=e}for(tv.set(n,a);tv.size>50;){const e=tv.keys().next().value;tv.delete(e),Tf.delete(e)}return a.geometry&&Qf(n,a.geometry),n}async function nv(e){const t=Xf(Yf(e));if(!t)return;let i;try{i=await t((e=>e.slice(e.indexOf(":")+1))(e))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){iv(i.mc_svg,e);const t=ev(e);if(t)return t}const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const s={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():Df},r="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return r&&!r.startsWith("<")&&(s.secondary=[r]),s}function sv(e,t){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",e);let s,r=!1;const a=setInterval(()=>{p(),c()},50),o=setTimeout(()=>l(void 0),t),l=e=>{r||(r=!0,Uf.delete(d),s?.disconnect(),clearInterval(a),clearTimeout(o),n.remove(),Wf&&!Wf.childElementCount&&(Wf.remove(),Wf=void 0),i(e))},c=()=>{if(r)return;const e=n.shadowRoot?.querySelector("ha-svg-icon"),t="string"==typeof e?.path?e.path.trim():"";if(!e||!t)return;const i={paths:[t],viewBox:"string"==typeof e.viewBox&&e.viewBox.trim()?e.viewBox.trim():Df},s="string"==typeof e.secondaryPath?e.secondaryPath.trim():"";s&&(i.secondary=[s]),l(i)},d=()=>l(void 0);function p(){!s&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(s=new MutationObserver(c),s.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}Uf.add(d),(Wf?.isConnected||(Wf=document.createElement("div"),Wf.setAttribute("aria-hidden","true"),Wf.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(Wf)),Wf).appendChild(n),p();const h=n;h.updateComplete?.then(()=>{p(),c()},()=>{}),c()})}function rv(){for(const e of[...If]){if(!Xf(Yf(e))||Ff.has(e))continue;If.delete(e);const t=nv(e).then(t=>(Ff.delete(e),Qf(e,t&&"markup"!==t?t:null),t&&"markup"!==t?t:void 0));Ff.set(e,t)}}function av(e){const t=e.detail;if("icons"===t?.kind)for(const e of t.ids?.length?t.ids.map(e=>`mcu:${e}`):[...Tf.keys(),...Bf.keys()].filter(e=>e.startsWith("mcu:")))Tf.delete(e),tv.delete(e),Bf.get(e)?.forEach(e=>e())}function ov(e,t={}){if(!e||!e.includes(":"))return Promise.resolve(void 0);if(e.startsWith("svg:"))return Promise.resolve(ev(e));Gf||"undefined"==typeof window||(Gf=!0,window.addEventListener("iconset-registered",rv),window.addEventListener("mcu-library-changed",av));const i=Tf.get(e);if(i){if(i.g)return Promise.resolve(ev(e));const t=Date.now()-i.at>6e4,n=If.has(e)&&!!Xf(Yf(e));if(!t&&!n)return Promise.resolve(void 0);n&&If.delete(e),Tf.delete(e)}if(e.startsWith("svg:"))return Promise.resolve(void 0);const n=Ff.get(e);if(n)return n;const s=(async()=>{const i=!!Xf(Yf(e)),n=await nv(e);if("markup"===n)return void Qf(e,null);if(n)return Qf(e,n),n;const s=Yf(e);if(!Jf.has(s))return Qf(e,null),void(i||(If.add(e),function(){if(Kf=10,Zf||!If.size)return;const e=()=>{Zf=void 0,rv(),If.size&&--Kf>0&&(Zf=setTimeout(e,500))};Zf=setTimeout(e,500)}()));const r=t.timeoutMs??3e3,a=function(e,t){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?sv(e,t):new Promise(i=>{const n=Date.now();let s=!1;const r=()=>!s&&(s=!0,Uf.delete(a),clearTimeout(o),!0),a=()=>{r()&&i(void 0)},o=setTimeout(a,t);Uf.add(a),customElements.whenDefined("ha-icon").then(()=>{r()&&sv(e,Math.max(0,t-(Date.now()-n))).then(i)},a)}):Promise.resolve(void 0)}(e,Math.max(r,t.probeMaxMs??15e3));a.then(t=>{t&&(Qf(e,t),rv())});const o=await new Promise(e=>{const t=setTimeout(()=>e(void 0),r);a.then(i=>{clearTimeout(t),e(i)})});if(o)return o;ev(e)||Qf(e,null)})().finally(()=>Ff.delete(e));return Ff.set(e,s),s}const lv=e=>e.slice(e.indexOf(":")+1),cv=e=>`part:${e}`,dv=e=>`group:${e}`,pv=e=>"string"==typeof e&&/^(part|group):/.test(e),hv=e=>!!e.rig&&(e.rig.parts.length>0||!!e.rig.shapes?.length);function uv(e){return new Set([...(e?.parts??[]).map(e=>e.id),...(e?.groups??[]).map(e=>e.id),...(e?.shapes??[]).map(e=>e.id)])}function mv(e,t,i=uv(e)){const n=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^[-_]+/,"").slice(0,24)||"part";for(let e=1;;e++){const t=`${n}-${e}`;if(!i.has(t)&&tn.test(t))return t}}function gv(e,t="icon"){return e.rig?.icon?e.rig.icon:e.rig?.svg?iv(e.rig.svg):String(ns(t,"m",!1).icon??"mdi:bell-ring")}const fv=e=>ev(e),vv=e=>ov(e),bv=new WeakMap;function yv(e){let t=bv.get(e);return t||bv.set(e,t=(0,Xm.WP)(e)),t}const xv=(e,t)=>!e.tracks?.some(e=>e.target===t)&&(e.tracks?.length??0)>=24,_v=()=>Gn(1261,{tracks:24}),wv=(e,t)=>e.tracks?.find(e=>e.target===t);function $v(e,t,i){const n=(e.tracks??[]).filter(e=>e.target!==t),s=(e.tracks??[]).findIndex(e=>e.target===t);i&&n.splice(s<0?n.length:s,0,{...i,target:t});const r={...e,tracks:n};return n.length||delete r.tracks,r}function kv(e,t){const i={...e};return e.tracks&&(i.tracks=e.tracks.filter(e=>!t.has(e.target)),i.tracks.length||delete i.tracks),e.bindings&&(i.bindings=e.bindings.filter(e=>!t.has(e.target)),i.bindings.length||delete i.bindings),i}const Mv=(e,t)=>({...e,rig:t});function Sv(e,t,i){const n=e.rig,s=i.trim();if(!n||!s)return e;const r=lv(t);return t.startsWith("part:")?Mv(e,{...n,parts:n.parts.map(e=>e.id===r?{...e,name:s}:e)}):t.startsWith("group:")?Mv(e,{...n,groups:(n.groups??[]).map(e=>e.id===r?{...e,name:s}:e)}):t.startsWith("shape:")?Mv(e,{...n,shapes:(n.shapes??[]).map(e=>e.id===r?{...e,name:s}:e)}):e}function jv(e,t){const i=e.rig,n=[];for(const e of t){const t=lv(e),s=e.startsWith("group:")?i?.groups?.find(e=>e.id===t)?.parts??[]:e.startsWith("part:")?[t]:[];for(const e of s)!n.includes(e)&&i?.parts.some(t=>t.id===e)&&n.push(e)}return(i?.parts??[]).map(e=>e.id).filter(e=>n.includes(e))}const Cv=(e,t)=>e?.groups?.find(e=>e.parts.includes(t));function Av(e,t){return jv(e,t).length<2?Gn(786):(e.rig?.groups?.length??0)>=16?Gn(1188,{groups:16}):""}function zv(e,t,i){const n=e.rig;if(!n||Av(e,t))return{doc:e};const s=jv(e,t),r=mv(n,"group"),a=(n.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!s.includes(e))})),o=new Set(a.filter(e=>!e.parts.length).map(e=>dv(e.id))),l=[...a.filter(e=>e.parts.length),{id:r,name:i?.trim()||`Group ${(n.groups?.length??0)+1}`,parts:s}];return{doc:Mv(kv(e,o),{...n,groups:l}),id:r}}function qv(e,t){const i=e.rig;if(!i?.groups?.some(e=>e.id===t))return e;const n=i.groups.filter(e=>e.id!==t),s={...i,groups:n};return n.length||delete s.groups,Mv(kv(e,new Set([dv(t)])),s)}function Ev(e,t,i){const n=e.rig;if(!n)return e;const s=lv(t),r=e=>Math.round(100*e)/100,a=e=>{if(e.id!==s)return e;const t={...e};return i?t.origin=[r(i[0]),r(i[1])]:delete t.origin,t};return t.startsWith("part:")?Mv(e,{...n,parts:n.parts.map(a)}):t.startsWith("group:")?Mv(e,{...n,groups:(n.groups??[]).map(a)}):t.startsWith("shape:")?Mv(e,{...n,shapes:(n.shapes??[]).map(a)}):e}const Hv=e=>/^(part|group|shape):/.test(e),Lv=(e,t)=>Hv(t)&&!!wv(e,t)?.origin;function Vv(e,t,i){const n=wv(e,t);if(!n||!Hv(t))return e;const s={...n},r=e=>Math.round(100*e)/100;return i?s.origin=`${r(i[0])}px ${r(i[1])}px`:delete s.origin,$v(e,t,s.keyframes.length||s.path||s.origin?s:void 0)}function Ov(e,t,i){return Lv(e,t)?Vv(e,t,i):Ev(e,t,i)}function Pv(e,t,i){const n=e.rig;if(!n)return;const s=jv(e,[t]).flatMap(e=>(n.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.bbox)).filter(e=>!!e);return(0,Xm.Zg)(s)}function Rv(e,t,i,n){const s=function(e,t,i=[0,0,24,24]){const n=Hv(t)?wv(e,t)?.origin?.trim():void 0;if(!n)return;const s=(e,t)=>{const n=i[2+t];if(!e||"center"===e)return n/2;if("left"===e||"top"===e)return 0;if("right"===e||"bottom"===e)return n;const s=parseFloat(e);return Number.isFinite(s)?e.endsWith("%")?n*s/100:s:n/2};let[r,a]=n.split(/\s+/);return"top"!==r&&"bottom"!==r&&("left"!==a&&"right"!==a||"center"!==r)||([r,a]=[a,r]),[s(r,0),s(a,1)]}(e,t,n);if(s)return s;const r=e.rig,a=lv(t),o=t.startsWith("part:")?r?.parts.find(e=>e.id===a)?.origin:t.startsWith("group:")?r?.groups?.find(e=>e.id===a)?.origin:void 0;if(o)return o;const l=Pv(e,t,i);return l?[l[0]+l[2]/2,l[1]+l[3]/2]:void 0}function Nv(e,t){const i=lv(t),n=e.rig;return t.startsWith("part:")?n?.parts.find(e=>e.id===i)?.name??i:t.startsWith("group:")?n?.groups?.find(e=>e.id===i)?.name??i:t.startsWith("shape:")?n?.shapes?.find(e=>e.id===i)?.name??i:t}function Dv(e,t){return(wv(e,t)?.keyframes??[]).filter(e=>void 0!==e.draw).map(e=>[e.at,e.draw])}function Tv(e,t,i){const n=e.map(e=>e.at===t?{...e,...i}:e);return e.some(e=>e.at===t)||n.push({at:t,...i}),n.sort((e,t)=>e.at-t.at)}function Fv(e,t,i,n=0,s=60){if("none"!==i&&xv(e,t))return e;const r=wv(e,t);let a=(r?.keyframes??[]).map(e=>{if(void 0===e.draw)return e;const t={...e};return delete t.draw,t});if(a=a.filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e&&"easings"!==e)),"none"!==i){const[e,t]="on"===i?[0,1]:[1,0],r=Math.max(0,Math.min(100,n)),o=Math.max(r,Math.min(100,s));a=Tv(a,r,{draw:e}),a=Tv(a,o,{draw:t}),r>0&&(a=Tv(a,0,{draw:e})),o<100&&(a=Tv(a,100,{draw:t}))}return a.length||r?.path?$v(e,t,{...r??{target:t},target:t,keyframes:a.slice(0,40)}):$v(e,t,void 0)}const Bv="M0 0 C 2 -3 4 -3 6 0 S 2 3 0 0";function Iv(e,t,i){const n=wv(e,t);if(!i){if(!n)return e;const i={...n};return delete i.path,$v(e,t,i.keyframes.length?i:void 0)}return xv(e,t)?e:$v(e,t,{...n??{target:t,keyframes:[]},target:t,path:i})}const Zv=/^(part|group|shape):/;function Wv(e){if(!e||"target"!==e.kind&&"keys"!==e.kind)return[];const t=[...e.target?[e.target]:[],...e.targets??[]];return[...new Set(t)].filter(e=>Zv.test(e))}function Kv(e,t){const i=[...new Set(e)];if(!i.length)return{kind:"none"};const n=t&&i.includes(t)?t:i[i.length-1];return{kind:"target",target:n,targets:[n,...i.filter(e=>e!==n)]}}function Uv(e,t){e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}function Gv(e,t,i,n=!1){e.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:t,label:i,...n?{transient:!0}:{}},bubbles:!0,composed:!0}))}var Yv=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Jv={part:"mdi:vector-square",group:"mdi:folder-outline",shape:"mdi:draw"};let Xv=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this.density="full",this._icon="",this._busy=!1,this._error="",this._confirm=!1,this._resplit=!1,this._collapsed=new Set,this._status="",this._notice="",this._iconTyped=!1,this._list=new Hf(this,{select:(e,t)=>{if(e.startsWith("tracks:"))return this._list.setOpen(e.slice(7),!this.layerView?.open.includes(e.slice(7)));if(e.startsWith("lane:"))return this.disabled?void 0:Rf(this,this.doc,e);const i=this._rows(),n=i.find(t=>t.ref===e);n&&t instanceof MouseEvent?this._onRowClick(t,n,i):n&&(this._anchor=n.ref,this._select([n.ref]))},move:(e,t)=>this._move("up"===t?1:-1,e),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&!this._list.refuseLocked(e,Nv(this.doc,e))&&(this._renaming=e),open:(e,t)=>e.startsWith("group:")?this._setOpen(e.slice(6),t):this._list.setOpen(e.startsWith("tracks:")?e.slice(7):e,t),nameOf:e=>e.startsWith("lane:")?Of(e):this.doc?Nv(this.doc,e):e})}connectedCallback(){super.connectedCallback(),ks("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}willUpdate(e){const t=e.get("doc");if(e.has("doc")&&t&&t.id!==this.doc?.id&&(this._icon="",this._iconTyped=!1,this._confirm=!1,this._resplit=!1,this._error="",this._notice=""),(e.has("doc")||e.has("tile"))&&!this._iconTyped&&this.doc){const e=gv(this.doc,this.tile);this._icon=e.startsWith("svg:")?"":e}}get _sel(){return Wv(this.selection)}_rows(){const e=this.doc,t=e?.rig;if(!e||!t)return[];const i=t=>wv(e,t)?.keyframes.length??0,n=[],s=new Set,r=[...t.parts].reverse();for(const e of r){const a=Cv(t,e.id);if(a){if(!s.has(a.id)&&(s.add(a.id),n.push({ref:dv(a.id),level:1,kind:"group",name:a.name,count:a.parts.length,keys:i(dv(a.id))}),!this._collapsed.has(a.id)))for(const e of r.filter(e=>Cv(t,e.id)?.id===a.id))n.push({ref:cv(e.id),level:2,kind:"part",name:e.name,count:e.from?.length??1,keys:i(cv(e.id))})}else n.push({ref:cv(e.id),level:1,kind:"part",name:e.name,count:e.from?.length??1,keys:i(cv(e.id))})}return n}_change(e,t,i=t){this._status=i,Gv(this,e,t)}_select(e,t){Uv(this,Kv(e,t))}async _split(){const e=this.doc;if(!e||this._busy||this.disabled)return;if(hv(e)&&!this._confirm)return void(this._confirm=!0);const t=!this._resplit&&e.rig?.svg?e.rig.svg:void 0,i=t?gv(e,this.tile):this._icon.trim()||gv(e,this.tile);if(t||/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(i)){this._busy=!0,this._error="";try{const n=await vv(i);if(this.doc?.id!==e.id)return;if(!n)return void(this._error=Gn(991));const s=yv(n);if(!s.length)return void(this._error=Gn(993));const r=function(e,t,i){const n=e.rig,s=new Set([...(n?.parts??[]).map(e=>cv(e.id)),...(n?.groups??[]).map(e=>dv(e.id))]),r=function(e,t){const i=e.slice(0,Qi).map((e,t)=>({id:`part-${t+1}`,name:Gn(624,{i:t+1}),from:[e.index]}));return{...t?.svg?{svg:t.svg}:t?.icon?{icon:t.icon}:{},parts:i}}(t,i);if(n?.shapes?.length){const e=new Set(n.shapes.map(e=>e.id));r.parts=r.parts.map(t=>e.has(t.id)?{...t,id:mv(r,"part",new Set([...e,...r.parts.map(e=>e.id)]))}:t),r.shapes=n.shapes}return Mv(kv(e,s),r)}(this.doc??e,s,t?{svg:t}:{icon:i}),a=r.rig?.parts.length??0,o=s.length>Qi;this._notice=o?Gn(948,{count:s.length,parts:Qi}):"",this._change(r,"Split icon",o?Gn(1182,{count:a,parts:Qi}):Gn(1181,{count:a})),this._confirm=!1,this._resplit=!1,this._select([])}finally{this._busy=!1}}else this._error=Gn(1049)}_group(){const e=this.doc;if(!e||this.disabled)return;if(this._lockedSel())return;const t=Av(e,this._sel);if(t)return void(this._status=t);const i=zv(e,this._sel);i.id&&(this._change(i.doc,"Group parts",Gn(1178,{count:jv(e,this._sel).length})),this._select([dv(i.id)]))}_ungroup(){const e=this.doc,t=this._sel.filter(e=>e.startsWith("group:"));if(!e||!t.length||this.disabled||this._lockedSel())return;let i=e;const n=[];for(const s of t)n.push(...(e.rig?.groups?.find(e=>`group:${e.id}`===s)?.parts??[]).map(cv)),i=qv(i,s.slice(6));this._change(i,"Ungroup",Gn(1177,{count:t.length})),this._select(n)}_merge(){const e=this.doc;if(!e||this.disabled||this._lockedSel())return;const t=function(e,t){const i=e.rig,n=jv(e,t).filter(e=>i?.parts.find(t=>t.id===e)?.from);if(!i||n.length<2)return{doc:e};const[s,...r]=n,a=[...new Set(n.flatMap(e=>i.parts.find(t=>t.id===e).from??[]))].sort((e,t)=>e-t),o=i.parts.filter(e=>!r.includes(e.id)).map(e=>e.id===s?{...e,from:a}:e),l=(i.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!r.includes(e))})),c=l.filter(e=>!e.parts.length).map(e=>dv(e.id)),d={...i,parts:o,...i.groups?{groups:l.filter(e=>e.parts.length)}:{}};return d.groups&&!d.groups.length&&delete d.groups,{doc:Mv(kv(e,new Set([...r.map(cv),...c])),d),id:s}}(e,this._sel);t.id&&(this._change(t.doc,"Merge parts",Gn(638)),this._select([cv(t.id)]))}_splitBack(){const e=this.doc,t=this._sel.find(e=>e.startsWith("part:"));if(!e||!t||this.disabled||this._lockedSel())return;const i=function(e,t){const i=e.rig,n=i?.parts.find(e=>e.id===t);if(!i||!n?.from||n.from.length<2)return{doc:e,ids:[t]};const s=Qi-i.parts.length+1,r=n.from.slice(0,Math.max(1,s)),a=uv(i),o=r.slice(1).map(e=>{const t=mv(i,"part",a);return a.add(t),{id:t,name:Gn(625,{n:t.slice(5)}),from:[e]}}),l={...n,from:[r[0]]};delete l.origin;const c=i.parts.indexOf(n),d=[...i.parts.slice(0,c),l,...o,...i.parts.slice(c+1)],p=i.groups?.map(e=>e.parts.includes(t)?{...e,parts:[...e.parts,...o.map(e=>e.id)]}:e);return{doc:Mv(e,{...i,parts:d,...p?{groups:p}:{}}),ids:[t,...o.map(e=>e.id)]}}(e,t.slice(5));i.ids.length<2||(this._change(i.doc,"Split part",Gn(1181,{count:i.ids.length})),this._select(i.ids.map(cv)))}_lockedSel(){const e=this.doc,t=e&&this._sel.find(e=>this._list.locked(e));return!!t&&this._list.refuseLocked(t,Nv(e,t))}_move(e,t){const i=this.doc,n=t??this._sel.find(e=>e.startsWith("part:"));if(!i||!n||!n.startsWith("part:")||this.disabled)return;if(this._list.refuseLocked(n,Nv(i,n)))return;const s=function(e,t,i){const n=e.rig,s=n?.parts.findIndex(e=>e.id===t)??-1,r=s+i;if(!n||s<0||r<0||r>=n.parts.length)return e;const a=[...n.parts];return[a[s],a[r]]=[a[r],a[s]],Mv(e,{...n,parts:a})}(i,n.slice(5),e);s!==i&&(this._change(s,"Move part",Gn(e>0?493:492)),this._list.announce(Gn(1228,{name:Nv(i,n),direction:Gn(e>0?1146:1099)})))}_setOpen(e,t){const i=new Set(this._collapsed);t?i.delete(e):i.add(e),this._collapsed=i}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc;i&&t.trim()&&t.trim()!==Nv(i,e)&&!this._list.refuseLocked(e,Nv(i,e))&&this._change(Sv(i,e,t),"Rename part",Gn(727))}_onRowClick(e,t,i){if(this._renaming===t.ref)return;const n=this._sel;if(e.shiftKey&&this._anchor){const e=i.findIndex(e=>e.ref===this._anchor),n=i.findIndex(e=>e.ref===t.ref);if(e>=0&&n>=0){const[s,r]=e<n?[e,n]:[n,e];return void this._select(i.slice(s,r+1).map(e=>e.ref),t.ref)}}this._anchor=t.ref,e.ctrlKey||e.metaKey?this._select(n.includes(t.ref)?n.filter(e=>e!==t.ref):[...n,t.ref],t.ref):this._select([t.ref])}_onKey(e){if(this._renaming||this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase();if(t&&"g"===i)return e.preventDefault(),void(e.shiftKey?this._ungroup():this._group());const n=this._rows(),s=n.findIndex(t=>t.ref===(e.target.closest?.("li.lr")?.getAttribute("data-ref")??this.selection.target??this._anchor));if(e.shiftKey&&!e.altKey&&("ArrowDown"===e.key||"ArrowUp"===e.key)&&e.target.matches?.("[data-lk]")){if(/^(lane|tracks):/.test(e.target.dataset.lk??""))return;e.preventDefault();const t=n[Math.max(0,Math.min(n.length-1,s+("ArrowDown"===e.key?1:-1)))];if(!t)return;return s>=0?this._select([...this._sel,t.ref],t.ref):this._select([t.ref]),void this._focusRow(t.ref)}"Escape"===e.key&&this._sel.length&&e.target.matches?.("[data-lk]")&&(e.preventDefault(),this._select([]))}_focusRow(e){this._list.focusKey(e)}_iconBtn(e,t,i,n,r){return s.qy`<button
      type="button"
      class="icon-btn sm"
      title=${r?`${t} (${r})`:t}
      aria-label=${t}
      aria-keyshortcuts=${r??s.s6}
      ?disabled=${this.disabled||!n}
      @click=${i}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderSource(e){const t=this.doc,i=!!t.rig?.svg&&!this._resplit;return s.qy`<div class="source">
      ${i?s.qy`<p class="help">${Gn(963)}</p>`:ks("mc-icon-picker")?s.qy`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">${Gn(378)}</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${Gn(378)}
                aria-labelledby="pl-icon-l"
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._iconTyped=""!==this._icon,this._error="",this._confirm=!1}}
              ></mc-icon-picker>
            </div>`:s.qy`<div class="field">
            <div class="field-head"><label for="pl-icon">${Gn(378)}</label></div>
            <input
              id="pl-icon"
              class="input mono"
              .value=${this._icon}
              placeholder=${gv(t,this.tile)}
              spellcheck="false"
              ?disabled=${this.disabled||this._busy}
              @input=${e=>{this._icon=e.target.value,this._iconTyped=""!==this._icon.trim(),this._error=""}}
              @keydown=${e=>"Enter"===e.key&&void this._split()}
            />
          </div>`}
      ${this._error?s.qy`<p class="help error" role="alert">${this._error}</p>`:s.s6}
      <div class="actions">
        <button type="button" class="btn ${e?"btn-secondary":"btn-primary"} btn-sm" ?disabled=${this.disabled||this._busy} @click=${()=>{this._split()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?Gn(862):this._confirm?Gn(1180,{count:t.rig?.parts.length??0}):Gn(e?856:859)}
        </button>
        ${e?s.qy`<button
              type="button"
              class="btn btn-text btn-sm"
              @click=${()=>{this._resplit=!1,this._confirm=!1,this._error=""}}
            >
              ${Gn(116)}
            </button>`:s.s6}
      </div>
      ${this._confirm?s.qy`<p class="help">${Gn(861)}</p>`:s.s6}
    </div>`}_renderRow(e,t,i){const n=this.doc,r="group"===e.kind?e.ref.slice(6):"",a=n.rig?.parts??[],o="part"===e.kind?a.findIndex(t=>`part:${t.id}`===e.ref):-1,l=this._list.locked(e.ref),c=io(n,e.ref).length>0,d="group"===e.kind?void 0:Pf(n,this.layerView??Xa,e.ref,e.ref),p=this._list.row({key:e.ref,name:e.name,icon:Jv[e.kind],note:"part"===e.kind&&e.count>1?Gn(1167,{count:e.count}):void 0,badge:e.keys?Gn(1162,{count:e.keys}):void 0,level:e.level,expanded:"group"===e.kind?!this._collapsed.has(r):d,selected:i.includes(e.ref)&&!(d&&"part"===e.kind&&"keys"===this.selection.kind),renamable:!0,up:"part"===e.kind?{ok:!this.disabled&&o>=0&&o<a.length-1&&!l,label:Gn(487,{name:e.name}),menu:Gn(480)}:void 0,down:"part"===e.kind?{ok:!this.disabled&&o>0&&!l,label:Gn(485,{name:e.name}),menu:Gn(459)}:void 0,renaming:this._renaming===e.ref?s.qy`<input
              class="input rename"
              aria-label=${Gn(532)}
              .value=${e.name}
              maxlength="80"
              @click=${e=>e.stopPropagation()}
              @keydown=${t=>{t.stopPropagation(),"Enter"===t.key&&(this._rename(e.ref,t.target.value),this._focusRow(e.ref)),"Escape"===t.key&&(this._renaming=void 0,this._focusRow(e.ref))}}
              @blur=${t=>this._rename(e.ref,t.target.value)}
            />`:void 0});if("group"===e.kind){if(!c||this._collapsed.has(r))return[p];const t=!!Pf(n,this.layerView??Xa,e.ref,e.ref),i=this._list.row({key:`tracks:${e.ref}`,name:Gn(1013),bare:!0,level:2,expanded:t,selected:!1,toggles:[],describe:Gn(1113,{name:e.name})});return t?[p,i,...Nf(this._list,n,this.selection,e.ref,3)]:[p,i]}return d?[p,...Nf(this._list,n,this.selection,e.ref,2===e.level?3:2)]:[p]}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return s.qy``;const t=hv(e),i=this._rows(),n=this._sel,r=jv(e,n),a=1===n.length?n[0]:void 0,o=r.length>=2&&r.every(t=>e.rig?.parts.find(e=>e.id===t)?.from),l=!!a&&a.startsWith("part:")&&(e.rig?.parts.find(e=>`part:${e.id}`===a)?.from?.length??0)>1,c=a?.startsWith("part:")?e.rig.parts.findIndex(e=>`part:${e.id}`===a):-1;return s.qy`<div class="parts" @keydown=${this._onKey}>
      ${!t||this._resplit||this._confirm?s.qy`${t?s.s6:s.qy`<p class="lead">${Gn(860)}</p>`}${this._renderSource(t)}`:s.s6}
      ${t?s.qy`<div class="bar" role="toolbar" aria-label=${Gn(621)}>
              ${this._iconBtn("mdi:group",Gn(357),()=>this._group(),!Av(e,n),Gn(198))}
              ${this._iconBtn("mdi:ungroup",Gn(1033),()=>this._ungroup(),n.some(e=>e.startsWith("group:")),Gn(199))}
              ${this._iconBtn("mdi:set-merge",Gn(442),()=>this._merge(),o)}
              ${this._iconBtn("mdi:call-split",Gn(858),()=>this._splitBack(),l)}
              ${this._iconBtn("mdi:arrow-up",Gn(480),()=>this._move(1),c>=0&&c<e.rig.parts.length-1,Gn(53))}
              ${this._iconBtn("mdi:arrow-down",Gn(460),()=>this._move(-1),c>0,Gn(52))}
            </div>
            <ul class="tree" aria-label=${Gn(376)}>
              ${i.map(e=>this._renderRow(e,i,n))}
            </ul>
            ${this._notice?s.qy`<p class="help notice" role="note">${this._notice}</p>`:s.s6}
            <p class="help">${Gn(150)}</p>
            ${this._resplit||this._confirm?s.s6:s.qy`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>(this._resplit=!0,this._confirm=!1)}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>${Gn(856)}
                  </button>
                </div>`}`:s.s6}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`}};Xv.styles=[vs,bs,Lf,s.AH`
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
    `],Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"doc",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"hass",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"library",void 0),Yv([(0,r.MZ)({type:Number})],Xv.prototype,"time",void 0),Yv([(0,r.MZ)({type:Boolean})],Xv.prototype,"disabled",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"selection",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"tile",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"stage",void 0),Yv([(0,r.MZ)({attribute:!1})],Xv.prototype,"layerView",void 0),Yv([(0,r.MZ)()],Xv.prototype,"density",void 0),Yv([(0,r.wk)()],Xv.prototype,"_renaming",void 0),Yv([(0,r.wk)()],Xv.prototype,"_icon",void 0),Yv([(0,r.wk)()],Xv.prototype,"_busy",void 0),Yv([(0,r.wk)()],Xv.prototype,"_error",void 0),Yv([(0,r.wk)()],Xv.prototype,"_confirm",void 0),Yv([(0,r.wk)()],Xv.prototype,"_resplit",void 0),Yv([(0,r.wk)()],Xv.prototype,"_collapsed",void 0),Yv([(0,r.wk)()],Xv.prototype,"_status",void 0),Yv([(0,r.wk)()],Xv.prototype,"_notice",void 0),Xv=Yv([(0,r.EM)("mc-anim-parts-layers")],Xv),js({tag:"mc-anim-parts-layers",place:"layers",title:376,order:20,when:e=>"keyframes"===e.kind});var Qv=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};function eb(e){const t=(e??"").split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:void 0}let tb=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._vb=[0,0,24,24],this._scale=1,this._watched=new WeakSet}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._watched=new WeakSet,this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measure())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}get _pieces(){return this._geom?yv(this._geom):[]}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=gv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=fv(e),this._geom||vv(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}e.has("doc")&&!this._drag&&(this._live=void 0)}updated(){requestAnimationFrame(()=>this._measure())}_icon(){return this.iconEl??function(e){let t=e;for(;t;)if(t instanceof Element){const e=t.shadowRoot?.querySelector("magic-card")??t.querySelector("magic-card");if(e)return e.shadowRoot?.querySelector('[data-mc-part="icon"]')??void 0;t=t.parentElement??t.getRootNode().host??null}else t=t.host??null}(this)}_measure(){if(!this.isConnected)return;const e=this._icon(),t=this.getBoundingClientRect(),i=this.offsetWidth>0&&t.width>0?t.width/this.offsetWidth:1;let n,s;for(const t of[e,e?.getRootNode()?.host])t&&this._ro&&!this._watched.has(t)&&(this._watched.add(t),this._ro.observe(t));if(e){const r=e.shadowRoot?.querySelector('svg[part="svg"]'),a=(r??e).getBoundingClientRect();a.width>0&&(n={x:(a.left-t.left)/i,y:(a.top-t.top)/i,w:a.width/i,h:a.height/i}),s=eb(r?.getAttribute("viewBox"))}if(!n&&this.stage?.subject){const e=this.stage.subject;n={x:e.x,y:e.y,w:e.width,h:e.height}}s??=this.stage?.viewBox??eb(this._geom?.viewBox)??[0,0,24,24],((e,t)=>!!e&&!!t&&Math.abs(e.x-t.x)<.5&&Math.abs(e.y-t.y)<.5&&Math.abs(e.w-t.w)<.5&&Math.abs(e.h-t.h)<.5)(n,this._box)||!n&&!this._box||(this._box=n),s.join(" ")!==this._vb.join(" ")&&(this._vb=s);const r=this.offsetWidth>0&&t.width>0?i:this.stage&&this.stage.scale>0?this.stage.scale:1;Math.abs(r-this._scale)>.001&&(this._scale=r)}get _unit(){return this._box&&this._box.w>0?this._vb[2]/(this._box.w*(this._scale||1)):.1}_toVb(e){const t=this.renderRoot.querySelector("svg.ov"),i=t?.getBoundingClientRect();return i&&i.width?[this._vb[0]+(e.clientX-i.left)/i.width*this._vb[2],this._vb[1]+(e.clientY-i.top)/i.height*this._vb[3]]:[0,0]}_lk(e){return!!this.doc&&!!this.layerView?.locked.length&&co(this.doc,this.layerView,e)}get _sel(){return Wv(this.selection)}_pick(e,t){const i=this._sel;t.shiftKey?Uv(this,Kv([...i,e],e)):t.ctrlKey||t.metaKey?Uv(this,Kv(i.includes(e)?i.filter(t=>t!==e):[...i,e],e)):Uv(this,Kv([e],e))}_onDown(e){if(this.disabled||e.button>0||!this.doc)return;const t=e.target,i=t.closest("[data-pivot]")?.getAttribute("data-pivot"),n=t.closest("[data-anchor]")?.getAttribute("data-anchor"),s=t.closest("[data-ref]")?.getAttribute("data-ref"),r=this._toVb(e),a={pointerId:e.pointerId,kind:"band",start:r,startClient:[e.clientX,e.clientY],startDoc:this.doc,moved:!1,additive:e.shiftKey||e.ctrlKey||e.metaKey};if(i){if(this._lk(i))return;this._drag={...a,kind:"pivot",ref:i}}else if(null!=n&&this.selection.target){if(this._lk(this.selection.target))return;const e=wv(this.doc,this.selection.target)?.path?.d;if(!e)return;this._drag={...a,kind:"anchor",ref:this.selection.target,index:Number(n),path:ca(e)}}else{if(s)return void this._pick(s,e);this._drag=a}e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId)}_onMove(e){const t=this._drag;if(!t){const t=e.target.closest?.("[data-ref]")?.getAttribute("data-ref");return void(t!==this._hover&&(this._hover=t))}if(e.pointerId!==t.pointerId)return;if(!t.moved&&Math.hypot(e.clientX-t.startClient[0],e.clientY-t.startClient[1])<3)return;t.moved=!0;const i=this._toVb(e),n=e.shiftKey?0:.25;if("band"===t.kind)this._band=[t.start,i];else if("pivot"===t.kind&&t.ref){const e=[(0,la.snap)(i[0],n),(0,la.snap)(i[1],n)];this._live={ref:t.ref,pivot:e},Gv(this,Ov(this.doc,t.ref,e),"Move pivot",!0)}else if("anchor"===t.kind&&t.ref&&t.path&&void 0!==t.index){const e=this._pivotOf(t.ref)??[0,0],s=(0,la.serialize)((0,la.moveAnchor)(t.path,t.index,(0,la.snap)(i[0]-e[0],n),(0,la.snap)(i[1]-e[1],n)));this._live={ref:t.ref,path:s};const r=wv(this.doc,t.ref);Gv(this,Iv(this.doc,t.ref,{...r.path,d:s}),"Move path point",!0)}}_onUp(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;this._drag=void 0;const i=this.doc,n=this._live;if(this._live=void 0,"band"===t.kind){const e=this._band;if(this._band=void 0,!t.moved||!e)return void(t.additive||Uv(this,{kind:"none"}));const[n,s]=e,r=Math.min(n[0],s[0]),a=Math.max(n[0],s[0]),o=Math.min(n[1],s[1]),l=Math.max(n[1],s[1]),c=(i.rig?.parts??[]).map(e=>cv(e.id)).filter(e=>!this._lk(e)).filter(e=>{const t=Pv(i,e,this._pieces);return!!t&&t[0]>=r&&t[0]+t[2]<=a&&t[1]>=o&&t[1]+t[3]<=l});return void Uv(this,Kv(t.additive?[...this._sel,...c]:c))}if(t.moved&&("pivot"===t.kind&&t.ref&&n?.pivot&&Gv(this,Ov(i,t.ref,n.pivot),"Move pivot"),"anchor"===t.kind&&t.ref&&n?.path)){const e=wv(i,t.ref);e?.path&&Gv(this,Iv(i,t.ref,{...e.path,d:n.path}),"Move path point")}}_onCancel(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._drag=void 0,this._band=void 0,this._live=void 0,t.moved&&"band"!==t.kind&&Gv(this,t.startDoc,"pivot"===t.kind?Gn(470):Gn(469)))}_onPivotKey(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i||this.disabled||!this.doc||this._lk(t))return;e.preventDefault();const n=e.shiftKey?1:.25,s=this._pivotOf(t)??[12,12];this._nudge?.ref!==t&&(this._nudge={ref:t,doc:this.doc}),Gv(this,Ov(this.doc,t,[s[0]+i[0]*n,s[1]+i[1]*n]),"Move pivot",!0)}_onKeyUp(e){const t=this._nudge;t&&e.key.startsWith("Arrow")&&this.doc&&(this._nudge=void 0,this.doc!==t.doc&&Gv(this,this.doc,"Move pivot"))}_onKey(e){if(this.doc&&!this.disabled)if(!e.ctrlKey&&!e.metaKey||"g"!==e.key.toLowerCase()||e.shiftKey)"Escape"===e.key&&this._sel.length&&(e.preventDefault(),Uv(this,{kind:"none"}));else{if(this._sel.some(e=>this._lk(e)))return;const t=zv(this.doc,this._sel);if(!t.id)return;e.preventDefault(),Gv(this,t.doc,"Group parts"),Uv(this,Kv([dv(t.id)]))}}_pivotOf(e){return this._live?.ref===e&&this._live.pivot?this._live.pivot:this.doc?Rv(this.doc,e,this._pieces,this._vb):void 0}_partPaths(e){const t=this.doc,i=this._pieces;return jv(t,[e]).flatMap(e=>(t.rig.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.d).filter(e=>!!e))}_selected(e,t){const i=this.doc;return e.flatMap(e=>{if(!/^(part|group):/.test(e))return[];const n=Pv(i,e,this._pieces),r=this._pivotOf(e),a=e===this.selection.target,o=[];if(o.push(s.JW`${this._partPaths(e).map(e=>s.JW`<path class="sel-outline" d=${e}></path>`)}`),n&&o.push(s.JW`<rect class="bbox" x=${n[0]} y=${n[1]} width=${n[2]} height=${n[3]}></rect>`),r&&a&&!this._lk(e)){const n=Nv(i,e);o.push(s.JW`<g
          class="pivot"
          data-pivot=${e}
          tabindex="0"
          role="slider"
          aria-label=${Lv(i,e)?Gn(687,{name:n}):Gn(656,{name:n})}
          aria-valuetext=${`x ${r[0].toFixed(2)}, y ${r[1].toFixed(2)}`}
          @keydown=${t=>this._onPivotKey(t,e)}
        >
          <circle class="pivot-hit" cx=${r[0]} cy=${r[1]} r=${12*t}></circle>
          <circle class="pivot-ring" cx=${r[0]} cy=${r[1]} r=${5*t} style=${"stroke-width: "+2*t}></circle>
          <path class="pivot-cross" d=${`M${r[0]-9*t} ${r[1]}H${r[0]+9*t}M${r[0]} ${r[1]-9*t}V${r[1]+9*t}`} style=${"stroke-width: "+1.5*t}></path>
        </g>`)}return o})}_motionPath(e){const t=this.selection.target;if(!t||!this.doc||!/^(part|group):/.test(t))return s.s6;const i=this._live?.ref===t&&this._live.path?this._live.path:wv(this.doc,t)?.path?.d,n=this._pivotOf(t);if(!i||!n)return s.s6;const r=ca(i);return s.JW`<g class="mpath" transform=${`translate(${n[0]} ${n[1]})`}>
      <path class="mline" d=${i} style=${"stroke-width: "+2*e}></path>
      ${this._lk(t)?s.s6:r.anchors.map((t,i)=>s.JW`<g class="anchor" data-anchor=${i}>
          <circle class="anchor-hit" cx=${t.x} cy=${t.y} r=${12*e}></circle>
          <circle class="anchor-dot" cx=${t.x} cy=${t.y} r=${4.5*e} style=${"stroke-width: "+1.5*e}></circle>
        </g>`)}
    </g>`}render(){const e=this.doc;if(!e||!hv(e))return s.qy``;const t=this._box,i=this._unit,n=this._sel,r=this.layerView,a=r?ao(e,r):new Set,o=this._vb,l=this._band,c=this._hover&&!n.includes(this._hover)?this._hover:void 0,d=e.rig.parts.map(e=>cv(e.id)).filter(t=>!(a.has(t)||a.has(dv(Cv(e.rig,t.slice(5))?.id??""))||r&&co(e,r,t))).map(e=>s.JW`<g class="hit" data-ref=${e}>${this._partPaths(e).map(e=>s.JW`<path d=${e} style=${"stroke-width: "+8*i}></path>`)}</g>`);return s.qy`<div
      class="layer"
      @pointerdown=${this._onDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onUp}
      @pointercancel=${this._onCancel}
      @keyup=${this._onKeyUp}
      @pointerleave=${()=>!this._drag&&(this._hover=void 0)}
      @keydown=${this._onKey}
    >
      ${t?s.qy`<svg
            class="ov"
            viewBox=${o.join(" ")}
            style=${`left: ${t.x}px; top: ${t.y}px; width: ${t.w}px; height: ${t.h}px`}
            role="group"
            aria-label=${Gn(377)}
          >
            ${d}
            ${c?s.JW`${this._partPaths(c).map(e=>s.JW`<path class="hover" d=${e} style=${"stroke-width: "+2*i}></path>`)}`:s.s6}
            <g style=${`--u: ${i}`}>${this._selected(n,i)}</g>
            ${this._motionPath(i)}
            ${l?s.JW`<rect class="band" x=${Math.min(l[0][0],l[1][0])} y=${Math.min(l[0][1],l[1][1])}
                  width=${Math.abs(l[1][0]-l[0][0])} height=${Math.abs(l[1][1]-l[0][1])} style=${`stroke-width: ${i}`}></rect>`:s.s6}
          </svg>`:s.s6}
    </div>`}};tb.styles=s.AH`
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
  `,Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"doc",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"hass",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"library",void 0),Qv([(0,r.MZ)({type:Number})],tb.prototype,"time",void 0),Qv([(0,r.MZ)({type:Boolean})],tb.prototype,"disabled",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"selection",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"tile",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"stage",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"layerView",void 0),Qv([(0,r.MZ)({attribute:!1})],tb.prototype,"iconEl",void 0),Qv([(0,r.wk)()],tb.prototype,"_box",void 0),Qv([(0,r.wk)()],tb.prototype,"_vb",void 0),Qv([(0,r.wk)()],tb.prototype,"_scale",void 0),Qv([(0,r.wk)()],tb.prototype,"_hover",void 0),Qv([(0,r.wk)()],tb.prototype,"_band",void 0),Qv([(0,r.wk)()],tb.prototype,"_geom",void 0),Qv([(0,r.wk)()],tb.prototype,"_live",void 0),tb=Qv([(0,r.EM)("mc-anim-parts-overlay")],tb),js({tag:"mc-anim-parts-overlay",place:"stage-tool",title:376,order:20,when:(e,t)=>"keyframes"===e.kind&&hv(e)&&"tool"!==t.kind});var ib=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const nb=[{fx:0,fy:0,label:1010},{fx:.5,fy:0,label:1009},{fx:1,fy:0,label:1011},{fx:0,fy:.5,label:411},{fx:.5,fy:.5,label:128},{fx:1,fy:.5,label:744},{fx:0,fy:1,label:99},{fx:.5,fy:1,label:98},{fx:1,fy:1,label:100}],sb=e=>Math.round(100*e)/100,rb=(e,t,i)=>[sb(e[0]+e[2]*t),sb(e[1]+e[3]*i)];let ab=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._drawFrom=0,this._drawTo=60}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=gv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=fv(e),this._geom||vv(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}const t=this._target;if((e.has("selection")||e.has("doc"))&&t&&this.doc){const e=Dv(this.doc,t);if(e.length>=2){let t=0;for(;t+1<e.length&&e[t+1][1]===e[0][1];)t++;let i=e.length-1;for(;i-1>t&&e[i-1][1]===e[e.length-1][1];)i--;this._drawFrom=e[t][0],this._drawTo=e[i][0]}}}get _target(){const e=this.selection?.target;return pv(e)&&this.doc&&function(e,t){const i=lv(t);return t.startsWith("part:")?!!e.rig?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e.rig?.groups?.some(e=>e.id===i):!!t.startsWith("shape:")&&!!e.rig?.shapes?.some(e=>e.id===i)}(this.doc,e)?e:void 0}_drawMode(e){const t=Dv(this.doc,e);if(!t.length)return"none";const i=t[0][1],n=t[t.length-1][1],s=t.every((e,s)=>0===s||(i<n?e[1]>=t[s-1][1]:e[1]<=t[s-1][1]));return s&&0===i&&1===n?"on":s&&1===i&&0===n?"off":"custom"}_emit(e,t){Gv(this,e,t)}_renderName(e){const t=this.doc,i=e.startsWith("group:"),n=jv(t,[e]),r=i?0:t.rig?.parts.find(t=>t.id===lv(e))?.from?.length??0,a=i?Gn(1176,{count:n.length}):r>1?Gn(1247,{pieces:r}):Gn(620);return s.qy`<div class="head">
        <span class="tile-icon"><ha-icon icon=${i?"mdi:folder-outline":"mdi:vector-square"}></ha-icon></span>
        <div class="titles">
          <span class="title">${Nv(t,e)}</span>
          <span class="caption">${a} · <span class="mono">${lv(e)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${Gn(532)}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${Nv(t,e)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${n=>{const s=n.target.value;s.trim()&&s.trim()!==Nv(t,e)&&this._emit(Sv(t,e,s),Gn(i?724:725))}}
        />
      </div>
      ${i?s.qy`<div class="chips">
            ${n.map(e=>s.qy`<button type="button" class="chip" @click=${()=>Uv(this,Kv([`part:${e}`]))}>${Nv(t,`part:${e}`)}</button>`)}
          </div>`:s.s6}`}_renderPivot(e){const t=this.doc,i=this._geom?yv(this._geom):[],n=Pv(t,e,i),r=e.startsWith("group:"),a=r?t.rig?.groups?.find(t=>t.id===lv(e))?.origin:t.rig?.parts.find(t=>t.id===lv(e))?.origin,o=Lv(t,e),l=Rv(t,e,i,Ca(this._geom?.viewBox))??a,c=(i,n)=>this._emit(Ov(t,e,[i,n]),"Move pivot"),d=()=>this._emit(o?Ov(t,e,rb(n,.5,.5)):Ev(t,e,void 0),Gn(o?470:735)),p=(e,t)=>s.qy`<div class="field">
      <div class="field-head"><label for="pi-p${e}">${t}</label></div>
      <div class="unit">
        <input
          id="pi-p${e}"
          class="input"
          type="number"
          step="0.25"
          inputmode="decimal"
          .value=${l?String(sb(l[e])):""}
          placeholder=${Gn(128)}
          ?disabled=${this.disabled}
          @change=${t=>{const i=Number(t.target.value);if(!Number.isFinite(i)||""===t.target.value)return;const n=l??[12,12];0===e?c(i,n[1]):c(n[0],i)}}
        />
        <span class="suffix" aria-hidden="true">${Gn(1144)}</span>
      </div>
    </div>`;return s.qy`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${Gn(655)}</h3>
        <span class=${o?"src is-preset":"src"} data-pivot-source=${o?"track":"part"}>${Gn(o?686:r?358:622)}</span>
        ${o?s.s6:(h=!!a,u=()=>this._emit(Ev(t,e,void 0),"Reset pivot"),h?s.qy`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,K.t)(386,{label:"pivot"})}
    title=${(0,K.t)(385)}
    @click=${e=>{e.stopPropagation(),u()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:s.s6)}
      </div>
      <p class="help">
        ${Gn(o?r?969:970:r?967:968)}
      </p>
      <div class="pair">${p(0,"X")} ${p(1,"Y")}</div>
      ${n?s.qy`<div class="grid3" role="group" aria-label=${Gn(r?657:658)}>
            ${nb.map(e=>{const[t,i]=rb(n,e.fx,e.fy),r=!!l&&Math.abs(l[0]-t)<.01&&Math.abs(l[1]-i)<.01;return s.qy`<button
                type="button"
                class="cell"
                aria-label=${Gn(659,{position:Gn(e.label).toLowerCase()})}
                title=${Gn(e.label)}
                aria-pressed=${r?"true":"false"}
                ?disabled=${this.disabled}
                @click=${()=>.5===e.fx&&.5===e.fy?d():c(t,i)}
              >
                <i></i>
              </button>`})}
          </div>`:s.s6}
      ${o?s.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(Vv(t,e,void 0),"Reset to part pivot")}>
              ${Gn(r?736:737)}
            </button>
          </div>`:s.s6}
    </section>`;var h,u}_renderDraw(e){const t=this.doc,i=this._drawMode(e),n=xv(t,e),r=i=>this._emit(Fv(t,e,i,this._drawFrom,this._drawTo),Gn("none"===i?712:"on"===i?262:261)),a=[{id:"none",label:Gn(595)},{id:"on",label:Gn(262)},{id:"off",label:Gn(261)}],o=(t,n,r,a)=>s.qy`<div class="field">
      <div class="field-head"><label for=${t}>${n}</label></div>
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
          @change=${t=>{const n=Math.max(0,Math.min(100,Number(t.target.value)));Number.isFinite(n)&&(a(n),"on"!==i&&"off"!==i||this._emit(Fv(this.doc,e,i,this._drawFrom,this._drawTo),"Draw timing"))}}
        />
        <span class="suffix" aria-hidden="true">%</span>
      </div>
    </div>`;return s.qy`<section class="group" aria-labelledby="pi-draw">
      <div class="group-head">
        <ha-icon icon="mdi:draw"></ha-icon>
        <h3 id="pi-draw">${Gn(258)}</h3>
      </div>
      <p class="help">${Gn(961)}</p>
      <div class="seg full" role="radiogroup" aria-label=${Gn(258)}>
        ${a.map(e=>s.qy`<button type="button" role="radio" aria-checked=${i===e.id?"true":"false"} ?disabled=${this.disabled||n&&"none"!==e.id} @click=${()=>r(e.id)}>${e.label}</button>`)}
      </div>
      ${n?s.qy`<p class="help cap">${_v()}</p>`:s.s6}
      ${"custom"===i?s.qy`<p class="help">${Gn(999)}</p>`:s.s6}
      ${"none"!==i?s.qy`<div class="pair">
            ${o("pi-df",Gn(879),this._drawFrom,e=>this._drawFrom=e)}
            ${o("pi-dt",Gn(175),this._drawTo,e=>this._drawTo=Math.max(e,this._drawFrom))}
          </div>`:s.s6}
    </section>`}_renderPath(e){const t=this.doc,i=wv(t,e)?.path,n=!i&&xv(t,e);return s.qy`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${Gn(452)}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${Gn(339)}</span>
          <p class="help">${Gn(498)}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${i?"true":"false"} aria-label=${Gn(339)} ?disabled=${this.disabled||n} @click=${()=>this._emit(Iv(t,e,i?void 0:{d:Bv}),Gn(i?717:30))}></button>
      </div>
      ${n?s.qy`<p class="help cap">${_v()}</p>`:s.s6}
      ${i?s.qy`<div class="field">
              <div class="field-head"><label for="pi-tpl">${Gn(808)}</label></div>
              <div class="select">
                <select
                  id="pi-tpl"
                  class="input"
                  ?disabled=${this.disabled}
                  @change=${n=>{const s=n.target.value;if(!s)return;const r="arc"===s?Bv:ba(s,[0,0],4);this._emit(Iv(t,e,{...i,d:r}),"Path shape"),n.target.value=""}}
                >
                  <option value="">${Gn(733)}</option>
                  <option value="arc">${Gn(70)}</option>
                  ${fa.map(e=>s.qy`<option value=${e.id}>${Gn(e.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${Gn(1027)}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${i.follow_rotation?"true":"false"}
                aria-label=${Gn(1027)}
                ?disabled=${this.disabled}
                @click=${()=>this._emit(Iv(t,e,{...i,follow_rotation:!i.follow_rotation}),"Path rotation")}
              ></button>
            </div>`:s.s6}
    </section>`}_renderKeys(e){const t=this.doc,i=wv(t,e),n=i?.keyframes.length??0;return s.qy`<section class="group" aria-labelledby="pi-keys">
      <div class="group-head">
        <ha-icon icon="mdi:timeline-outline"></ha-icon>
        <h3 id="pi-keys">${Gn(399)}</h3>
      </div>
      <p class="help">
        ${n?Gn(1163,{count:n}):Gn(558)}
      </p>
      ${i?s.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit($v(t,e,void 0),"Remove part animation")}>
              ${Gn(721)}
            </button>
          </div>`:s.s6}
    </section>`}render(){const e=this._target;return this.doc&&e?s.qy`<div class="insp">
      ${this._renderName(e)} ${this._renderPivot(e)} ${this._renderDraw(e)} ${this._renderPath(e)} ${this._renderKeys(e)}
    </div>`:s.qy``}};ab.styles=[vs,bs,s.AH`
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
        padding-inline-end: 52px;
      }
      .suffix {
        position: absolute;
        right: 12px;
        inset-inline: auto 12px;
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
    `],ib([(0,r.MZ)({attribute:!1})],ab.prototype,"doc",void 0),ib([(0,r.MZ)({attribute:!1})],ab.prototype,"hass",void 0),ib([(0,r.MZ)({attribute:!1})],ab.prototype,"library",void 0),ib([(0,r.MZ)({type:Number})],ab.prototype,"time",void 0),ib([(0,r.MZ)({type:Boolean})],ab.prototype,"disabled",void 0),ib([(0,r.MZ)({attribute:!1})],ab.prototype,"selection",void 0),ib([(0,r.MZ)({attribute:!1})],ab.prototype,"tile",void 0),ib([(0,r.MZ)({attribute:!1})],ab.prototype,"stage",void 0),ib([(0,r.wk)()],ab.prototype,"_geom",void 0),ib([(0,r.wk)()],ab.prototype,"_drawFrom",void 0),ib([(0,r.wk)()],ab.prototype,"_drawTo",void 0),ab=ib([(0,r.EM)("mc-anim-part-inspector")],ab),js({tag:"mc-anim-part-inspector",place:"inspector",title:620,order:20,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&pv(t.target)});const ob=["select","pen","line","rect","ellipse","freehand","erase","motion"],lb=e=>"string"==typeof e&&ob.includes(e),cb=e=>"string"==typeof e&&e.startsWith("shape:"),db=e=>"string"==typeof e&&/^(part|group|shape):/.test(e);function pb(e,t){return"keyframes"===e.kind&&"tool"===t.kind&&lb(t.tool)}function hb(e){return"target"===e.kind||"tool"===e.kind&&"select"===e.tool?(e=>cb(e)?e.slice(6):void 0)(e.target):void 0}function ub(e){return"tool"===e.kind&&lb(e.tool)?e.tool:"select"}const mb={select:{label:782,icon:"mdi:cursor-default-outline",base:"shape",hint:151},pen:{label:649,icon:"mdi:fountain-pen-tip",base:"path",hint:154},line:{label:419,icon:"mdi:vector-line",base:"line",hint:251},rect:{label:701,icon:"mdi:square-rounded-outline",base:"rect",hint:253},ellipse:{label:293,icon:"mdi:ellipse-outline",base:"ellipse",hint:252},freehand:{label:344,icon:"mdi:draw",base:"stroke",hint:259},erase:{label:307,icon:"mdi:eraser",base:"shape",hint:152},motion:{label:452,icon:"mdi:map-marker-path",base:"path",hint:264}},gb={fill:"currentColor",stroke:"",strokeWidth:1.5,linecap:"round",layer:"over",radius:2,tolerance:.4,grid:!0,anchors:!0,follow:!1};function fb(e,t){const i=()=>({stroke:e.stroke||"currentColor",stroke_width:e.strokeWidth,linecap:e.linecap});if(!t)return i();const n={};return e.fill&&(n.fill=e.fill),e.stroke&&Object.assign(n,i()),e.fill||e.stroke||(n.fill="currentColor"),n}const vb=new class{constructor(){this.options={...gb},this.hint="",this._hintListeners=new Set,this._listeners=new Set}setHint(e){if(e!==this.hint){this.hint=e;for(const e of this._hintListeners)e()}}onHint(e){return this._hintListeners.add(e),()=>this._hintListeners.delete(e)}set(e){this.options={...this.options,...e},this._emit()}setLastFreehand(e){this.lastFreehand=e,this._emit()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}reset(){this.options={...gb},this.lastFreehand=void 0,this._emit()}_emit(){for(const e of this._listeners)e()}};let bb=e=>(0,Xm.WP)(e).map(e=>({index:e.index,d:e.d,...e.stroke?{stroke:e.stroke}:{},...e.secondary?{accent:!0}:{},...e.evenodd?{evenodd:!0}:{}}));function yb(e){const t=ns(e??"icon","m",!1)?.icon;return"string"==typeof t?t:void 0}const xb=new Map;function _b(e,t){return e?.svg?Jm(e):Ca(t?.viewBox).join(" ")}function wb(e,t){const i=e.rig;if(i?.svg){const e=function(e){const t=We(e);if(t.error)return;const i={paths:t.paths,viewBox:t.viewBox};return t.accentPaths.length&&(i.secondary=t.accentPaths),t.strokes.length&&(i.strokes=t.strokes),t.evenodd&&(i.evenodd=t.evenodd),i}(i.svg);return Promise.resolve(e?{viewBox:e.viewBox,pieces:bb(e)}:void 0)}const n=i?.icon??yb(t);if(!n)return Promise.resolve(void 0);let s=xb.get(n);return s||(s=ov(n,{timeoutMs:4e3}).then(e=>e?{viewBox:e.viewBox,pieces:bb(e)}:void 0).catch(()=>{}),xb.set(n,s),s.then(e=>{e||xb.delete(n)})),s}const $b="important",kb=" !"+$b,Mb=(0,O.u$)(class extends O.WL{constructor(e){if(super(e),e.type!==O.OA.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return null==n?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const n=t[e];if(null!=n){this.ft.add(e);const t="string"==typeof n&&n.endsWith(kb);e.includes("-")||t?i.setProperty(e,t?n.slice(0,-11):n,t?$b:""):i[e]=n}}return V.c0}});var Sb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};class jb extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new Hf(this,{select:(e,t)=>e.startsWith("lane:")?!this.disabled&&Rf(this,this.doc,e):this._pick(e.slice(6),t),move:(e,t)=>this._shift(e.slice(6),t),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Of(e):this.doc?.rig?.shapes?.find(t=>t.id===e.slice(6))?.name??e})}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_pick(e,t){const i=`shape:${e}`;this._select("tool"===this.selection.kind?{kind:"tool",tool:"select",target:i}:{kind:"target",target:i})}_shift(e,t){const i=this.doc,n=i?.rig?.shapes?.find(t=>t.id===e);if(!i||!n)return;const s=Za(i,e,t);if(s===i)return;const r="under"===this.side,a=i.rig.shapes.filter(e=>"under"===e.layer===r),o="up"===t?r&&a[a.length-1].id===e:!r&&a[0].id===e;this._emit(s,Gn("up"===t?o?106:105:o?789:788)),this._list.announce(Gn(1230,{name:n.name,where:Gn(o?"up"===t?1127:1143:"up"===t?1146:1099)}))}_delete(e){const t=this.doc,i=t?.rig?.shapes?.find(t=>t.id===e);t&&i&&!this.disabled&&!this._list.refuseLocked(`shape:${e}`,i.name)&&(this._emit(Wa(t,e),"Delete shape"),hb(this.selection)===e&&this._select({kind:"none"}))}_thumb(e,t){const i=e=>e?Hh(e)??e:"currentColor",n={fill:qa(e)?i(e.fill):"none",stroke:Ea(e)?i(e.stroke):"none","stroke-width":String(Math.max(e.stroke_width??1,1))};return s.qy`<svg class="thumb" viewBox=${t} aria-hidden="true">
      ${s.JW`<path d=${e.d} style=${Mb(n)} stroke-linecap="round" stroke-linejoin="round"></path>`}
    </svg>`}render(){const e=this.doc,t=e?.rig?.shapes??[],i="under"===this.side;if(!e||!t.some(e=>"under"===e.layer===i))return s.qy``;const n=hb(this.selection),r=_b(e.rig),a=t.map((e,t)=>({s:e,i:t})).filter(e=>"under"===e.s.layer===i).reverse(),o=a[0].s.id,l=a[a.length-1].s.id;return s.qy`<ul aria-label=${Gn(i?817:816)}>
      ${a.map(({s:t})=>{const a=`shape:${t.id}`,c=e.tracks?.find(e=>e.target===a),d=[Ga(e,a)?Gn(1104):"",c?.path?"moves":""].filter(Boolean).join(", "),p=i&&o===t.id,h=!i&&l===t.id,u=Pf(e,this.layerView??Xa,a,a),m=this._list.row({key:a,expanded:u,name:t.name,thumb:this._thumb(t,r),note:d,describe:d,selected:t.id===n&&!(u&&"keys"===this.selection.kind),up:{ok:!this.disabled&&Za(e,t.id,"up")!==e,label:Gn(p?108:107,{name:t.name}),menu:Gn(p?104:480)},down:{ok:!this.disabled&&Za(e,t.id,"down")!==e,label:Gn(h?792:791,{name:t.name}),menu:Gn(h?790:459)},extra:t.id!==n?void 0:s.qy`<button type="button" class="icon-btn sm danger del" data-ctl="del" tabindex="-1" aria-label=${Gn(235,{name:t.name})} title=${Gn(230)} aria-disabled=${this.disabled||this._list.locked(a)?"true":s.s6} @click=${()=>this._delete(t.id)}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>`});return u?[m,...Nf(this._list,e,this.selection,a,2)]:[m]})}
    </ul>
    ${t.length>=48?s.qy`<p class="empty-note">${Gn(974)}</p>`:s.s6}`}}jb.styles=[Qp,Lf,s.AH`
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
    `],Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"doc",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"selection",void 0),Sb([(0,r.MZ)({type:Boolean})],jb.prototype,"disabled",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"hass",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"library",void 0),Sb([(0,r.MZ)({type:Number})],jb.prototype,"time",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"tile",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"stage",void 0),Sb([(0,r.MZ)({attribute:!1})],jb.prototype,"layerView",void 0),Sb([(0,r.MZ)()],jb.prototype,"density",void 0);let Cb=class extends jb{constructor(){super(...arguments),this.side="over"}};Cb=Sb([(0,r.EM)("mc-anim-shapes-layers")],Cb);let Ab=class extends jb{constructor(){super(...arguments),this.side="under"}};Ab=Sb([(0,r.EM)("mc-anim-shapes-under-layers")],Ab),js({tag:"mc-anim-shapes-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"!==e.layer),title:816,order:5}),js({tag:"mc-anim-shapes-under-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"===e.layer),title:817,order:30});var zb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const qb=new Set(["line","rect","ellipse","freehand"]),Eb={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},Hb=new Set(["select","line","rect","ellipse","freehand","erase","motion"]),Lb=[],Vb=[],Ob=[{fill:"none"}],Pb=new Map,Rb=e=>e?Hh(e)??e:void 0,Nb=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))};let Db=class extends lf{constructor(){super(...arguments),this._selection={kind:"none"},this.disabled=!1,this.time=0,this.preview=!1,this._dropping=!1,this._announce="",this._piecesKey="",this._pointsSel=!1,this._onCanvas=e=>{e.stopPropagation();const t=e.detail,i=t.paths[0];if("pen"===ub(this.selection))return this._pen=i&&i.anchors.length?i:void 0,void(t.commit&&i?.closed&&this._finishPen(!0));const n=this._live,s=n?this._shapes.find(e=>e.id===n.id):void 0;if(!n||!s||!this.doc)return;if(this._live={...n,list:t.paths},this.requestUpdate(),!t.commit)return;if("Cancel"===t.label)return;if(!i||!i.anchors.length)return this._emitDoc(Wa(this.doc,s.id),"Delete shape"),void Nb(this,{kind:"tool",tool:"select"});const r=da(i);this._live={id:s.id,d:r,list:t.paths},vb.lastFreehand?.id===s.id&&vb.setLastFreehand(void 0),this._emitDoc(Ba(this.doc,s.id,{d:r}),af(t.label))},this._onCanvasSelect=e=>{this._pointsSel=(e.detail?.anchors.length??0)>0},this._endNudge=()=>{const e=this._nudge;if(!e)return;this._nudge=void 0;const t=Math.round(100*e.dx)/100,i=Math.round(100*e.dy)/100;this._emitDoc(Ba(e.base,e.id,{d:ka(e.d,t,i)}),"Nudge shape"),this._followFreehand(e.id,t,i)},this._onKeyUp=e=>{/^Arrow/.test(e.key)&&this._endNudge()},this._onKeyCapture=e=>{const t=this._selectedId;if(this.disabled||!this.doc||!t||this._pen||this._drag)return;const i="Delete"===e.key||"Backspace"===e.key;return i||/^Arrow/.test(e.key)?this._refuseLocked(t)?(e.preventDefault(),void e.stopPropagation()):void(i&&!this._pointsSel&&(e.preventDefault(),e.stopPropagation(),this._emitDoc(Wa(this.doc,t),"Delete shape"),Nb(this,{kind:"tool",tool:"select"}))):void 0},this._onKey=e=>{if(this.disabled||!this.doc)return;if(this._drag&&"Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this._end(!1);if(this._kbKey(e))return;if(/^Arrow/.test(e.key)||this._endNudge(),this._pen)return void("Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._finishPen(!1)));const t=this._selectedId;if("Escape"===e.key&&t)return e.preventDefault(),e.stopPropagation(),void Nb(this,{kind:"tool",tool:"select"});if(!t)return;const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i)return;if(e.preventDefault(),this._nudge&&this._nudge.id!==t&&this._endNudge(),!this._nudge){const e=this._shapes.find(e=>e.id===t);if(!e)return;this._nudge={id:t,base:this.doc,d:e.d,dx:0,dy:0}}const n=this._nudge,s=e.shiftKey?1:.1;n.dx+=i[0]*s,n.dy+=i[1]*s,this._emitDoc(Ba(n.base,t,{d:ka(n.d,Math.round(100*n.dx)/100,Math.round(100*n.dy)/100)}),"Nudge shape",!0)},this._onDragOver=e=>{!this.disabled&&e.dataTransfer?.types?.includes("Files")&&(e.preventDefault(),this._dropping=!0)},this._onDragLeave=()=>{this._dropping=!1},this._onDrop=async e=>{this._dropping=!1;const t=e.dataTransfer?.files?.[0];if(!t||this.disabled)return;e.preventDefault();const i=await Tg(t);if(this._dialog??=this.renderRoot.querySelector("mc-anim-svg-dialog")??void 0,"error"in i)return this._announce=ls(i.error),void this._dialog?.openImport("",t.name);this._dialog?.openImport(i.text,t.name)},this._penList={list:Lb}}get selection(){return this._selection}set selection(e){const t=e??{kind:"none"};this._pen&&"pen"!==ub(t)&&this._finishPen(!1),ub(t)!==ub(this._selection)&&(this._kb=this._cross=void 0),this._selection=t}get penPath(){return this._pen}connectedCallback(){super.connectedCallback(),this._unsub=vb.subscribe(()=>this.requestUpdate()),this._parent=this.parentNode,this.addEventListener("keydown",this._onKeyCapture,!0),this.addEventListener("keydown",this._onKey),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("blur",this._endNudge),this.addEventListener("dragover",this._onDragOver),this.addEventListener("dragleave",this._onDragLeave),this.addEventListener("drop",this._onDrop)}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this.removeEventListener("keydown",this._onKeyCapture,!0),this.removeEventListener("keydown",this._onKey),this.removeEventListener("keyup",this._onKeyUp),this.removeEventListener("blur",this._endNudge),this.removeEventListener("dragover",this._onDragOver),this.removeEventListener("dragleave",this._onDragLeave),this.removeEventListener("drop",this._onDrop),this._end(!0),this._endNudge(),this._finishPen(!1),vb.setHint("")}firstUpdated(){this.hasAttribute("tabindex")||(this.tabIndex=0)}willUpdate(e){if(e.has("selection")){const t=e.get("selection");t?.target!==this.selection.target&&(this._pointsSel=!1)}if((e.has("doc")||e.has("tile")||e.has("pieces"))&&!this.pieces&&this.doc){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._piecesKey&&(this._piecesKey=e,wb(this.doc,this.tile).then(t=>{this._piecesKey===e&&(this._resolved=t)}))}this.ensureCanvas()}get _viewBox(){return this.viewBox??this.stage?.viewBox?.join(" ")??_b(this.doc?.rig,this._resolved)}_view(){const e=this.stage,t=e?.rect?.width||this.stageRect?.width||360,i=e?.rect?.height||this.stageRect?.height||240,n=Ca(this._viewBox),s=this.iconRect??e?.subject??this.stageRect?.subject??this.subjectRect;let r;if(s&&s.width>8&&s.height>8)r=s;else{const e=Math.max(48,Math.min(t,i)-48);r={x:(t-e)/2,y:(i-e)/2,width:e,height:e}}const a=Math.min(r.width/n[2],r.height/n[3]),o=of(e,{x:r.x+(r.width-n[2]*a)/2,y:r.y+(r.height-n[3]*a)/2,width:n[2]*a,height:n[3]*a});if(!(o&&a>0))return;const l=this._viewCache;return l&&l.vb.every((e,t)=>e===n[t])&&["left","top","width","height"].every(e=>Math.abs(l.place[e]-o[e])<.005)?l:this._viewCache={vb:n,place:o,ppu:o.width/n[2]}}_toPx(e,t){return[e.place.left+(t[0]-e.vb[0])*e.ppu,e.place.top+(t[1]-e.vb[1])*e.ppu]}_toVB(e,t){return[e.vb[0]+(t[0]-e.place.left)/e.ppu,e.vb[1]+(t[1]-e.place.top)/e.ppu]}_local(e){const t=this.getBoundingClientRect();return[e.clientX-t.left,e.clientY-t.top]}get _previewShapes(){return this.preview||!!this.tile&&!yb(this.tile)}get _shapes(){return this.doc?.rig?.shapes??[]}get _pieceList(){return this.pieces??this._resolved?.pieces??[]}_isLocked(e){return!!this.doc&&!!this.layerView?.locked.length&&co(this.doc,this.layerView,`shape:${e}`)}_refuseLocked(e){return!!this._isLocked(e)&&(this._announce=Gn(1221,{name:this._shapes.find(t=>t.id===e)?.name??Gn(808)}),!0)}get _selectedId(){return hb(this.selection)}_snapAnchors(e){if(!vb.options.anchors)return[];const t=this._anchorCache,i=this._shapes,n=this._pieceList;if(!t||t.shapes!==i||t.pieces!==n||t.exclude!==e){const t=[];for(const e of n)t.push(...Ma(e.d));for(const n of i)n.id!==e&&t.push(...Ma(n.d));this._anchorCache={shapes:i,pieces:n,exclude:e,pts:t}}return this._anchorCache.pts}_snap(e,t,i){if(i)return this._snapAt=void 0,[Math.round(100*t[0])/100,Math.round(100*t[1])/100];const n=function(e,t){if(t.anchors?.length&&t.radius){let i,n=t.radius;for(const s of t.anchors){const t=(0,fe.xg)(s,e);t<=n&&(n=t,i=s)}if(i)return{p:[i[0],i[1]],kind:"anchor"}}return t.grid&&t.grid>0?{p:[xa(Math.round(e[0]/t.grid)*t.grid),xa(Math.round(e[1]/t.grid)*t.grid)],kind:"grid"}:{p:[xa(e[0]),xa(e[1])],kind:null}}(t,{grid:vb.options.grid?1:0,anchors:this._snapAnchors(),radius:10/e.ppu});return this._snapAt="anchor"===n.kind?n.p:void 0,n.p}_snapConfig(e){const t=vb.options.grid?1:0;let i;if(vb.options.anchors){const t=[this._shapes,this._pieceList,e];if(!this._lines||this._lines.key.some((e,i)=>e!==t[i])){const i=new Set,n=new Set;for(const t of this._snapAnchors(e))i.size<300&&i.add(t[0]),n.size<300&&n.add(t[1]);this._lines={key:t,extra:{x:[...i],y:[...n]}}}i=this._lines.extra}const n=`${t}|${e??""}`,s=Pb.get(n);if(s&&s.extra===i)return s;const r={enabled:!0,grid:t,anchors:!1,frame:!1,extra:i};return Pb.set(n,r),r}_emitDoc(e,t,i=!1){i||(this._announce=t),(this.isConnected?this:this._parent?.isConnected?this._parent:this).dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_commitShape(e,t,i){if(!this.doc||!t)return;if(this._shapes.length>=en)return void(this._announce=Gn(1173,{count:en}));const n=mb[e],s=Ra(Ta(this.doc),n.base),r=this._shapes.filter(e=>e.id.startsWith(`${n.base}-`)).length+1,a={id:s,name:`${Gn("pen"===e?643:"freehand"===e?906:n.label)} ${r}`,d:t,layer:vb.options.layer,...fb(vb.options,i)},o=Fa(this.doc,a);return o?(this._emitDoc(o,`Draw ${e}`),this._announce="pen"===e?Gn(1184,{name:a.name,count:Ma(t).length}):Gn(1217,{name:a.name}),s):void 0}_finishPen(e){const t=this._pen;if(this._pen=void 0,!t||t.anchors.length<2)return;const i=e?{...t,closed:!0}:t;this._commitShape("pen",da(i),i.closed)}_capture(e){e.preventDefault();try{this.renderRoot.querySelector("svg.tool")?.setPointerCapture(e.pointerId)}catch{}}_onDown(e){const t=this._view();if(this.disabled||e.button>0||!this.doc||this._drag||!t)return;this._endNudge(),this.focus({preventScroll:!0,focusVisible:!1});const i=this._local(e),n=this._toVB(t,i),s=ub(this.selection);if(!qb.has(s)&&"motion"!==s||this.chunk)switch(s){case"select":{const s=Oa(this._shapes.filter(e=>!this._isLocked(e.id)),n,6/t.ppu);if(!s){const e=Oa(this._shapes,n,6/t.ppu);if(e&&this._refuseLocked(e))return;return void(this._selectedId&&Nb(this,{kind:"tool",tool:"select"}))}s!==this._selectedId&&Nb(this,{kind:"tool",tool:"select",target:`shape:${s}`});const r=this._shapes.find(e=>e.id===s);return this._capture(e),void(this._drag={kind:"move",pointerId:e.pointerId,id:s,base:this.doc,d:r.d,start:n,startPx:i,moved:!1,delta:[0,0]})}case"erase":return this._capture(e),this._drag={kind:"erase",pointerId:e.pointerId,base:this.doc,ids:[]},void this._eraseAt(n,t);case"line":case"rect":case"ellipse":{const i=this._snap(t,n,e.shiftKey&&"line"===s);return this._capture(e),void(this._drag={kind:"box",tool:s,pointerId:e.pointerId,a:i,b:i,shift:e.shiftKey,alt:e.altKey})}case"freehand":case"motion":return"motion"!==s||db(this.selection.target)?"motion"===s&&this.layerView&&co(this.doc,this.layerView,this.selection.target)?void(this._announce=Gn(919)):(this._capture(e),this._drag={kind:"free",tool:s,pointerId:e.pointerId,raw:[n],poly:`${i[0].toFixed(1)},${i[1].toFixed(1)}`,last:i},void this.requestUpdate()):void(this._announce=Gn(783))}else this._announce=Gn(937)}_boxPath(e,t,i,n,s){const r=this.chunk?.pathDraw;if(!r||Math.hypot(i[0]-t[0],i[1]-t[1])<.2)return;if("line"===e)return r.linePath(t,i);const a=function(e,t,i,n){let s=t[0]-e[0],r=t[1]-e[1];if(i){const e=Math.max(Math.abs(s),Math.abs(r));s=Math.sign(s||1)*e,r=Math.sign(r||1)*e}return n?{x:xa(e[0]-Math.abs(s)),y:xa(e[1]-Math.abs(r)),w:xa(2*Math.abs(s)),h:xa(2*Math.abs(r))}:{x:xa(Math.min(e[0],e[0]+s)),y:xa(Math.min(e[1],e[1]+r)),w:xa(Math.abs(s)),h:xa(Math.abs(r))}}(t,i,n,s);return a.w<.2||a.h<.2?void 0:"rect"===e?r.rectPath(a.x,a.y,a.w,a.h,vb.options.radius):r.ellipsePath(a.x+a.w/2,a.y+a.h/2,a.w/2,a.h/2)}_commitBox(e,t,i,n,s){const r=this._boxPath(e,t,i,n,s);return r&&this._commitShape(e,r,"line"!==e),!!r}_eraseAt(e,t){const i=this._drag;if("erase"!==i?.kind)return;let n=i.base;for(const e of i.ids)n=Wa(n,e);const s=Oa((n.rig?.shapes??[]).filter(e=>!this._isLocked(e.id)),e,6/t.ppu);s&&(i.ids.push(s),this._emitDoc(Wa(n,s),"Erase shape",!0))}_onMove(e){const t=this._drag,i=this._view();if(!t||!i||e.pointerId!==t.pointerId)return;const n=this._local(e),s=this._toVB(i,n);switch(t.kind){case"box":return t.b=this._snap(i,s,e.shiftKey&&"line"===t.tool),t.shift=e.shiftKey,t.alt=e.altKey,void this.requestUpdate();case"free":{const n="function"==typeof e.getCoalescedEvents?e.getCoalescedEvents():[];let s=!1;for(const r of n.length?n:[e]){if(t.raw.length>=4e3)break;const e=this._local(r);Math.hypot(e[0]-t.last[0],e[1]-t.last[1])<.75||(t.raw.push(this._toVB(i,e)),t.poly+=` ${e[0].toFixed(1)},${e[1].toFixed(1)}`,t.last=e,s=!0)}return void(s&&this.requestUpdate())}case"erase":return void this._eraseAt(s,i);case"move":{if(!t.moved&&Math.hypot(n[0]-t.startPx[0],n[1]-t.startPx[1])<3)return;t.moved=!0;let i=s[0]-t.start[0],r=s[1]-t.start[1];return!e.shiftKey&&vb.options.grid&&(i=Math.round(i),r=Math.round(r)),t.delta=[Math.round(100*i)/100,Math.round(100*r)/100],void this._emitDoc(Ba(t.base,t.id,{d:ka(t.d,t.delta[0],t.delta[1])}),"Move shape",!0)}}}_onUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&this._end(!0)}_end(e){const t=this._drag;if(!t)return;this._drag=void 0,this._snapAt=void 0;try{const e=this.renderRoot.querySelector("svg.tool");e?.hasPointerCapture?.(t.pointerId)&&e.releasePointerCapture(t.pointerId)}catch{}if(!e||!this.doc)return"move"===t.kind&&t.moved&&this._emitDoc(t.base,"Move shape"),"erase"===t.kind&&t.ids.length&&this._emitDoc(t.base,"Erase shape"),void this.requestUpdate();const i=this.chunk?.pathDraw;switch(t.kind){case"box":this._commitBox(t.tool,t.a,t.b,t.shift,t.alt);break;case"free":{const e=i?.fitFreehand(t.raw,vb.options.tolerance);if(!e?.d)break;if("freehand"===t.tool){const i=this._commitShape("freehand",e.d,e.closed);i&&vb.setLastFreehand({id:i,raw:t.raw})}else{const t=this.selection.target,i=Ya(this.doc,t,e.d,vb.options.follow);i?this._emitDoc(i,"Draw motion path"):this._announce=Gn(1260,{tracks:24})}break}case"move":t.moved&&(this._emitDoc(Ba(t.base,t.id,{d:ka(t.d,t.delta[0],t.delta[1])}),"Move shape"),this._followFreehand(t.id,t.delta[0],t.delta[1]));break;case"erase":{if(!t.ids.length)break;let e=t.base;for(const i of t.ids)e=Wa(e,i);this._emitDoc(e,Gn(1175,{count:t.ids.length}));break}}this.requestUpdate()}_followFreehand(e,t,i){const n=vb.lastFreehand;n?.id===e&&(t||i)&&vb.setLastFreehand({id:e,raw:n.raw.map(e=>[e[0]+t,e[1]+i])})}_finishButton(){this._kb?this._finishStroke():this._finishPen(!1),this._focusArea()}_focusArea(){this.updateComplete.then(()=>{(("view"!==this._canvasPaths().mode?this.renderRoot.querySelector("mc-path-canvas"):null)??this).focus({preventScroll:!0})})}_finishStroke(){const e=this._kb;this._kb=void 0;const t=this.chunk?.pathDraw;if(!e||!t||e.pts.length<2)return;const i=[e.pts[0]];for(let t=1;t<e.pts.length;t++){const n=e.pts[t-1],s=e.pts[t],r=Math.max(1,Math.ceil(Math.hypot(s[0]-n[0],s[1]-n[1])/.5));for(let e=1;e<=r;e++)i.push([n[0]+(s[0]-n[0])*e/r,n[1]+(s[1]-n[1])*e/r])}const n=t.fitFreehand(i,vb.options.tolerance);if(!n?.d)return;const s=this._commitShape("freehand",n.d,n.closed);s&&vb.setLastFreehand({id:s,raw:i})}_kbKey(e){const t=ub(this.selection);if(!qb.has(t)||this._selectedId||this._pen||e.composedPath()[0]!==this||e.ctrlKey||e.metaKey)return!1;if("Escape"===e.key)return!!this._kb&&(e.preventDefault(),e.stopPropagation(),this._kb=void 0,this._announce=Gn(267),!0);const i=Eb[e.key];if(!i&&"Enter"!==e.key)return!1;e.preventDefault(),e.stopPropagation();const n=this._view();if(!n)return!0;if(!this.chunk)return this._announce=Gn(937),!0;const s=t,r=this._cross??[n.vb[0]+n.vb[2]/2,n.vb[1]+n.vb[3]/2],a=e=>String(Math.round(100*e)/100);if(i){const t=e.altKey?.1:e.shiftKey?5:1,o=vb.options.grid&&!e.altKey,l=(e,t,i)=>{const n=Math.min(t+i,Math.max(t,e));return o?Math.round(n):Math.round(100*n)/100},c=[l(r[0]+i[0]*t,n.vb[0],n.vb[2]),l(r[1]+i[1]*t,n.vb[1],n.vb[3])];this._cross=c;const d="freehand"!==s&&!!this._kb,p={x:a(c[0]),y:a(c[1])};return this._announce=Gn("freehand"===s?200:d?201:202,p),!0}this._cross=r;const o=this._kb;if("freehand"===s){const e=o?.pts[o.pts.length-1];if(o&&e&&e[0]===r[0]&&e[1]===r[1])return o.pts.length>1?this._finishStroke():this._announce=Gn(458),!0;const t=[...o?.pts??[],r];return this._kb={tool:s,pts:t},this._announce=Gn(676,{count:t.length}),!0}return o?this._commitBox(s,o.pts[0],r,!1,!1)?this._kb=void 0:this._announce=Gn(458):(this._kb={tool:s,pts:[r]},this._announce=Gn(878,{x:a(r[0]),y:a(r[1])})),!0}toolsReady(){this._announce=Gn(938),this._focusArea()}_grid(e){const t=ub(this.selection);if(!vb.options.grid||e.ppu<6||"select"===t||"erase"===t)return s.s6;const[i,n,r,a]=e.vb,o=[];for(let t=0;t<=r;t++)o.push(`M${(e.place.left+t*e.ppu).toFixed(1)} ${e.place.top.toFixed(1)}v${e.place.height.toFixed(1)}`);for(let t=0;t<=a;t++)o.push(`M${e.place.left.toFixed(1)} ${(e.place.top+t*e.ppu).toFixed(1)}h${e.place.width.toFixed(1)}`);return s.JW`<path class="grid" d=${o.join("")}></path>`}_shapesLayer(e){if(!this._previewShapes||!this._shapes.length)return s.s6;const t=this._selectedId;return s.JW`<g class="shapes" transform="translate(${e.place.left-e.vb[0]*e.ppu} ${e.place.top-e.vb[1]*e.ppu}) scale(${e.ppu})">
      ${La(this._shapes).map(e=>s.JW`<path class="${e.id===t?"sel":""} ${e.layer}" data-id=${e.id} d=${e.d} style=${Mb(function(e){return{fill:qa(e)?Rb(e.fill)??"currentColor":"none",stroke:Ea(e)?Rb(e.stroke)??"currentColor":"none","stroke-width":String(e.stroke_width??1),"stroke-linecap":e.linecap??"butt","stroke-linejoin":"round"}}(e))}></path>`)}
    </g>`}_pxD(e,t){return t?(0,fe.Mj)(t).map(t=>{if(!t.length)return"";const i=t=>this._toPx(e,t),n=i(t[0][0]);return`M${n[0].toFixed(1)} ${n[1].toFixed(1)}${t.map(e=>`C${[e[1],e[2],e[3]].map(e=>i(e).map(e=>e.toFixed(1)).join(" ")).join(" ")}`).join("")}`}).join(""):""}_selectionBox(e){const t=this._selectedId,i=t?this._shapes.find(e=>e.id===t):void 0,n=i?ja(i.d):void 0;if(!n)return s.s6;const[r,a]=this._toPx(e,[n.x,n.y]);return s.JW`<rect class="bbox" x=${r-4} y=${a-4} width=${n.w*e.ppu+8} height=${n.h*e.ppu+8} rx="2"></rect>`}_dragLayer(e){const t=this._drag,i=this._kb;if(i&&this._cross){if("freehand"===i.tool)return s.JW`<polyline class="draft" points=${[...i.pts,this._cross].map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")}></polyline>`;const t=this._boxPath(i.tool,i.pts[0],this._cross,!1,!1);return t?s.JW`<path class="draft ${"line"===i.tool?"":"fillable"}" d=${this._pxD(e,t)}></path>`:s.s6}if(!t)return s.s6;if("box"===t.kind){const i=this._boxPath(t.tool,t.a,t.b,t.shift,t.alt);return i?s.JW`<path class="draft ${"line"===t.tool?"":"fillable"}" d=${this._pxD(e,i)}></path>`:s.s6}return"free"===t.kind?s.JW`<polyline class="draft" points=${t.poly}></polyline>`:s.s6}_ghost(e){const t=vb.lastFreehand;if(!t||!this._shapes.some(e=>e.id===t.id))return s.s6;const i=ub(this.selection);if(this._selectedId!==t.id&&"freehand"!==i)return s.s6;const n=`${e.ppu}|${e.place.left}|${e.place.top}`;this._ghostCache?.raw===t.raw&&this._ghostCache.key===n||(this._ghostCache={raw:t.raw,key:n,pts:t.raw.map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")});const r=this._ghostCache.pts;return s.JW`<polyline class="ghost-casing" points=${r}></polyline><polyline class="ghost" points=${r}></polyline>`}_motion(e){const t=this.selection.target;if(!db(t))return s.s6;const i=this.doc?.tracks?.find(e=>e.target===t);if(!i?.path?.d)return s.s6;const n=this._targetCentre(t);return n?s.JW`<path class="motion" d=${this._pxD(e,ka(i.path.d,n[0],n[1]))}></path>`:s.s6}_targetCentre(e){const[t,i]=e.split(":"),n=this.doc?.rig,s="group"===t?n?.groups?.find(e=>e.id===i)?.parts??[]:[i],r=new Set(s.flatMap(e=>n?.parts.find(t=>t.id===e)?.from??[])),a="shape"===t?this._shapes.find(e=>e.id===i)?.d??"":this._pieceList.filter(e=>r.has(e.index)).map(e=>e.d).join(" "),o=a?ja(a):void 0;if(o)return[o.x+o.w/2,o.y+o.h/2];const l=Ca(this._viewBox);return[l[0]+l[2]/2,l[1]+l[3]/2]}_crossMark(e){if(!this._cross||!qb.has(ub(this.selection)))return s.s6;const[t,i]=this._toPx(e,this._cross),n=`M${t-9} ${i}h18M${t} ${i-9}v18`;return s.JW`<path class="cross-casing" d=${n}></path><path class="cross" d=${n}></path>`}_dots(e){return("box"===this._drag?.kind||this._pen)&&vb.options.anchors?s.JW`<g class="dots">${this._snapAnchors().slice(0,600).map(t=>{const[i,n]=this._toPx(e,t);return s.JW`<circle cx=${i} cy=${n} r="1.5"></circle>`})}</g>`:s.s6}_hint(){const e=ub(this.selection);return this._pen?this._pen.anchors.length<2?Gn(155):Gn(mb.pen.hint):"motion"!==e||db(this.selection.target)?"select"!==e||this._shapes.length?this._drag||this._selectedId?"":Gn(mb[e].hint):Gn(562):Gn(784)}_labelArea(){const e=ub(this.selection);if(this.disabled||!Hb.has(e)){for(const e of["role","aria-roledescription","aria-label"])this.removeAttribute(e);return}this.setAttribute("role","application"),this.setAttribute("aria-roledescription",Gn(1103));const t=qb.has(e)?` ${Gn(71)}`:"";this.setAttribute("aria-label",Gn(1203,{label:Gn(mb[e].label),hint:Gn(mb[e].hint)})+t)}updated(){this._labelArea(),vb.setHint(this.disabled?"":this._hint())}_canvasPaths(){if(this.disabled||"ready"!==this.canvasState)return{mode:"view",paths:Lb,paint:Vb};if("pen"===ub(this.selection))return this._penList.src!==this._pen&&(this._penList={src:this._pen,list:this._pen?[this._pen]:Lb}),{mode:"add",paths:this._penList.list,paint:Vb};const e=this._selectedId,t=e?this._shapes.find(t=>t.id===e):void 0;return!t||this._isLocked(t.id)||1!==(0,fe.Mj)(t.d).length?{mode:"view",paths:Lb,paint:Vb}:(this._live?.id===t.id&&this._live.d===t.d||(this._live={id:t.id,d:t.d,list:[ca(t.d)]}),{mode:"nodes",paths:this._live.list,paint:Ob,exclude:t.id})}render(){const e=this._view();if(!e)return s.qy`${this.renderNotice()}`;const t=ub(this.selection),i=this._canvasPaths(),n=Hb.has(t)&&!this.disabled,r={x:e.vb[0],y:e.vb[1],w:e.vb[2],h:e.vb[3]};return s.qy`
      <svg class="layer" aria-hidden="true">
        ${this._grid(e)}
        <rect class="board" x=${e.place.left} y=${e.place.top} width=${e.place.width} height=${e.place.height} rx="2"></rect>
        ${this._shapesLayer(e)} ${this._ghost(e)} ${this._motion(e)} ${this._dots(e)} ${this._selectionBox(e)} ${this._dragLayer(e)} ${this._crossMark(e)}
        ${this._snapAt?s.JW`<circle class="snap" cx=${this._toPx(e,this._snapAt)[0]} cy=${this._toPx(e,this._snapAt)[1]} r="7"></circle>`:s.s6}
      </svg>
      ${n?s.qy`<svg
            class="tool t-${t}"
            aria-hidden="true"
            @pointerdown=${e=>this._onDown(e)}
            @pointermove=${e=>this._onMove(e)}
            @pointerup=${e=>this._onUp(e)}
            @pointercancel=${()=>this._end(!1)}
            @lostpointercapture=${e=>{this._drag&&e.pointerId===this._drag.pointerId&&this._end(!0)}}
          >
            <rect class="bg" x="0" y="0" width="100%" height="100%"></rect>
          </svg>`:s.s6}
      ${"ready"===this.canvasState?s.qy`<mc-path-canvas
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
            aria-label=${Gn("pen"===t?650:811)}
            @mc-path-change=${this._onCanvas}
            @mc-path-select=${this._onCanvasSelect}
            @mc-path-limit=${()=>this._announce=Gn(965)}
          ></mc-path-canvas>`:s.s6}
      ${this._pen&&this._pen.anchors.length>=2||"freehand"===this._kb?.tool&&this._kb.pts.length>=2?s.qy`<button type="button" class="finish" @click=${()=>this._finishButton()}>${Gn(327)}</button>`:s.s6}
      ${this._dropping?s.qy`<div class="drop">${Gn(275)}</div>`:s.s6} ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `}};Db.styles=[lf.styles,s.AH`
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
        left: 50%; /* physical */
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
    `],zb([(0,r.MZ)({attribute:!1})],Db.prototype,"doc",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"selection",null),zb([(0,r.MZ)({type:Boolean,reflect:!0})],Db.prototype,"disabled",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"layerView",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"tile",void 0),zb([(0,r.MZ)({type:Number})],Db.prototype,"time",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"hass",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"library",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"stage",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"stageRect",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"subjectRect",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"iconRect",void 0),zb([(0,r.MZ)({attribute:!1})],Db.prototype,"pieces",void 0),zb([(0,r.MZ)({type:String})],Db.prototype,"viewBox",void 0),zb([(0,r.MZ)({type:Boolean})],Db.prototype,"preview",void 0),zb([(0,r.wk)()],Db.prototype,"_resolved",void 0),zb([(0,r.wk)()],Db.prototype,"_pen",void 0),zb([(0,r.wk)()],Db.prototype,"_snapAt",void 0),zb([(0,r.wk)()],Db.prototype,"_dropping",void 0),zb([(0,r.wk)()],Db.prototype,"_announce",void 0),zb([(0,r.wk)()],Db.prototype,"_cross",void 0),zb([(0,r.wk)()],Db.prototype,"_kb",void 0),Db=zb([(0,r.EM)("mc-anim-draw-host")],Db),js({tag:"mc-anim-draw-host",place:"stage-tool",when:pb,title:266,order:40,dock:"canvas"});var Tb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Fb=[{value:"round",label:752},{value:"butt",label:332},{value:"square",label:866}],Bb=[{value:"over",label:615,icon:"mdi:arrange-bring-forward"},{value:"under",label:1030,icon:"mdi:arrange-send-backward"}],Ib=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));let Zb=class extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._drawLoading=!1,this._refitting=!1}connectedCallback(){super.connectedCallback(),this._unsub=vb.subscribe(()=>this.requestUpdate())}willUpdate(){this._draw||this._drawLoading||(vb.lastFreehand||"freehand"===ub(this.selection))&&(this._drawLoading=!0,tf().then(e=>{this._drawLoading=!1,e&&(this._draw=e.pathDraw)}))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.()}get _shape(){const e=hb(this.selection);return e?this.doc?.rig?.shapes?.find(t=>t.id===e):void 0}_emit(e,t,i=!1){e&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_patch(e,t,i){this.doc&&this._emit(Ba(this.doc,e.id,t),i)}_seg(e,t,i,n,r=""){return s.qy`<div class="field">
      <div class="field-head"><span class="lbl">${e}</span></div>
      <div class="seg full ${r}" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.value===i),r="rtl"===b(e.currentTarget)?-1:1,a={ArrowRight:r,ArrowDown:1,ArrowLeft:-r,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const o=t[(s+a[e.key]+t.length)%t.length].value,l=e.currentTarget;n(o),requestAnimationFrame(()=>l.querySelector(`[data-val="${o}"]`)?.focus())}}>
        ${t.map(e=>{const t=e.value===i;return s.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            ?disabled=${this.disabled}
            @click=${()=>t||n(e.value)}
          >
            ${e.icon?s.qy`<ha-icon icon=${e.icon}></ha-icon>`:s.s6}${Gn(e.label)}
          </button>`})}
      </div>
    </div>`}_switch(e,t,i,n,r,a=!1){return s.qy`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        ${t?s.qy`<p class="help">${t}</p>`:s.s6}
      </div>
      <button
        type="button"
        class="switch ${r}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||a}
        @click=${n}
      ></button>
    </div>`}_color(e,t,i,n){return s.qy`<mc-color-picker
      class=${n}
      allowEntity
      .label=${e}
      .value=${t}
      ?disabled=${this.disabled}
      @value-changed=${e=>{e.stopPropagation();const n=function(e){const t=e.trim();if(t)return/^entity( \d{1,3}%)?$/.test(t)?t:lt(t,"color")}(String(e.detail.value??""));n&&n!==t&&i(n)}}
    ></mc-color-picker>`}_number(e,t,i,n,r,a){return s.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        id=${e}
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max=${r}
        step=${n}
        .value=${String(i)}
        ?disabled=${this.disabled}
        @change=${e=>{const t=e.target,n=Number(t.value);if(""===t.value||!Number.isFinite(n))return void(t.value=String(i));const s=Math.min(r,Math.max(0,Math.round(100*n)/100));t.value=String(s),s!==i&&a(s)}}
      />
    </div>`}_paint(e,t){return s.qy`<section class="group" aria-labelledby="h-paint">
      <div class="group-head"><h3 id="h-paint">${Gn(619)}</h3></div>
      ${e.closed?s.qy`<div class="paint">
            ${this._switch(Gn(322),"",void 0!==e.fill,()=>t.fill(void 0!==e.fill?void 0:"currentColor"),"fill-on",void 0!==e.fill&&void 0===e.stroke)}
            ${void 0!==e.fill?this._color(Gn(323),e.fill,e=>t.fill(e),"fill-color"):s.s6}
          </div>`:s.s6}
      <div class="paint">
        ${this._switch(Gn(906),e.closed?"":Gn(58),void 0!==e.stroke,()=>t.stroke(void 0!==e.stroke?void 0:"currentColor"),"stroke-on",!e.closed||void 0!==e.stroke&&void 0===e.fill)}
        ${void 0!==e.stroke?s.qy`${this._color(Gn(907),e.stroke,e=>t.stroke(e),"stroke-color")}
              <div class="two">
                ${this._number("f-width",Gn(908),e.width,.25,100,t.width)}
              </div>
              ${this._seg(Gn(420),Fb,e.cap,t.cap,"caps")}`:s.s6}
      </div>
    </section>`}_smoothing(e,t,i=!1){const n=vb.options.tolerance;return s.qy`<div class="field">
      <div class="field-head"><label for="f-tol">${Gn(837)}</label><span class="val">${n.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">${Gn(238)}</span>
        <input
          id="f-tol"
          type="range"
          min=${.05}
          max=${2}
          step=${.05}
          .value=${String(n)}
          aria-valuetext=${Gn(1253,{size:n.toFixed(2)})}
          ?disabled=${this.disabled||i}
          @input=${t=>e(Number(t.target.value),!1)}
          @change=${t=>e(Number(t.target.value),!0)}
        />
        <span aria-hidden="true">${Gn(835)}</span>
      </div>
      <p class="help">${t}</p>
    </div>`}_refit(e,t){vb.set({tolerance:e});const i=vb.lastFreehand,n=i&&this.doc?.rig?.shapes?.find(e=>e.id===i.id);if(!n||!this.doc)return;const s=this._draw?.fitFreehand(i.raw,e);if(s&&s.d){if(!t){if(s.d===n.d)return;return this._refitting=!0,void this._emit(Ba(this.doc,n.id,{d:s.d}),"Smooth stroke",!0)}(s.d!==n.d||this._refitting)&&this._emit(Ba(this.doc,n.id,{d:s.d}),"Smooth stroke"),this._refitting=!1}}_renderShape(e){const t=this.doc,i=`shape:${e.id}`,n=/[Zz]\s*$/.test(e.d)||qa(e),r=t.rig?.shapes??[],a=r.findIndex(t=>t.id===e.id),o=t.tracks?.find(e=>e.target===i),l=vb.lastFreehand?.id===e.id;return s.qy`
      <section class="group" aria-labelledby="h-shape">
        <div class="group-head"><h3 id="h-shape">${Gn(808)}</h3><span class="id" title=${Gn(915)}>${i}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">${Gn(532)}</label></div>
          <input
            id="f-name"
            class="input"
            .value=${e.name}
            maxlength="80"
            ?disabled=${this.disabled}
            @change=${t=>{const i=t.target,n=i.value.trim();n?n!==e.name&&this._patch(e,{name:n},"Rename shape"):i.value=e.name}}
          />
        </div>
        ${this._seg(Gn(404),Bb,e.layer,t=>this._patch(e,{layer:t},Gn("under"===t?812:810)),"layer")}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled||a>=r.length-1} @click=${()=>this._emit(Ia(t,e.id,a+1),"Bring shape forward")}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>${Gn(103)}
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled||a<=0} @click=${()=>this._emit(Ia(t,e.id,a-1),"Send shape backward")}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>${Gn(787)}
          </button>
        </div>
      </section>
      ${this._paint({fill:qa(e)?e.fill??"currentColor":void 0,stroke:Ea(e)?e.stroke:void 0,width:e.stroke_width??1,cap:e.linecap??"butt",closed:n},{fill:t=>this._patch(e,{fill:t},Gn(t?130:714)),stroke:t=>this._patch(e,t?{stroke:t,stroke_width:e.stroke_width??1}:{stroke:void 0,stroke_width:void 0,linecap:void 0},Gn(t?134:720)),width:t=>this._patch(e,{stroke_width:Ib(t)},"Change stroke width"),cap:t=>this._patch(e,{linecap:t},"Change line ends")})}
      ${l?s.qy`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">${Gn(344)}</h3></div>
            ${this._smoothing((e,t)=>this._refit(e,t),Gn(450),!this._draw)}
          </section>`:s.s6}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">${Gn(65)}</h3></div>
        ${this._switch(Gn(262),qa(e)?Gn(960):Gn(954),Ga(t,i),()=>Ga(t,i)?this._emit(function(e,t){const i=Ka(e,t);if(!i)return e;const n=i.keyframes.map(e=>{const t={...e};return delete t.draw,t}).filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e)),s={...i,keyframes:n};return Ua(e,n.length||s.path?s:void 0,t)??e}(t,i),"Remove draw on"):this._emit(function(e,t){const i=Ka(e,t),n=(i?.keyframes??[]).map(e=>({...e}));for(const[e,t]of[[0,0],[100,1]]){const i=n.find(t=>t.at===e);i?i.draw=t:n.push({at:e,draw:t})}return n.sort((e,t)=>e.at-t.at),Ua(e,{...i??{target:t},target:t,keyframes:n},t)}(t,i),"Draw on"),"draw-on")}
        <div class="field">
          <div class="field-head"><span class="lbl">${Gn(452)}</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${()=>this._select({kind:"tool",tool:"motion",target:i})}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${Gn(o?.path?703:260)}
            </button>
            ${o?.path?s.qy`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${()=>this._emit(Ya(t,i,void 0,!1),"Remove motion path")}>
                  ${Gn(708)}
                </button>`:s.s6}
          </div>
          ${o?.path?this._switch(Gn(341),Gn(978),!!o.path.follow_rotation,()=>{const e=(t.tracks??[]).map(e=>e===o?{...e,path:{...e.path,follow_rotation:!e.path.follow_rotation}}:e);this._emit({...t,tracks:e},"Follow the path")},"follow"):s.qy`<p class="help">${Gn(263)}</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${()=>{this._emit(Wa(t,e.id),"Delete shape"),this._select({kind:"tool",tool:"select"})}}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${Gn(230)}
        </button>
      </section>
    `}_opt(e){vb.set(e)}_renderTool(e){const t=vb.options,i=mb[e],n="pen"===e||"line"===e||"rect"===e||"ellipse"===e||"freehand"===e,r="rect"===e||"ellipse"===e||"pen"===e,a=this.selection.target;return s.qy`
      <section class="group" aria-labelledby="h-tool">
        <div class="group-head tool-head"><ha-icon icon=${i.icon}></ha-icon><h3 id="h-tool">${Gn(i.label)}</h3></div>
        <p class="help lead">${Gn(i.hint)}</p>
        ${"motion"===e?db(a)?s.qy`<p class="help">${Yn(500,{target:s.qy`<span class="id">${a}</span>`})}</p>
                ${this._switch(Gn(341),Gn(392),t.follow,()=>this._opt({follow:!t.follow}),"follow-opt")}`:s.qy`<p class="help">${Gn(783)}</p>`:s.s6}
        ${"rect"===e?this._number("f-radius",Gn(191),t.radius,.5,12,e=>this._opt({radius:e})):s.s6}
        ${"freehand"===e||"motion"===e?this._smoothing((t,i)=>"freehand"===e?this._refit(t,i):this._opt({tolerance:t}),"freehand"===e&&vb.lastFreehand?Gn(136):Gn(449),"freehand"===e&&!this._draw):s.s6}
      </section>
      ${n?s.qy`${this._paint({fill:r&&t.fill||void 0,stroke:t.stroke||(r?void 0:"currentColor"),width:t.strokeWidth,cap:t.linecap,closed:r},{fill:e=>this._opt({fill:e??""}),stroke:e=>this._opt({stroke:e??""}),width:e=>this._opt({strokeWidth:Ib(e)}),cap:e=>this._opt({linecap:e})})}
            <section class="group" aria-labelledby="h-new">
              <div class="group-head"><h3 id="h-new">${Gn(544)}</h3></div>
              ${this._seg(Gn(404),Bb,t.layer,e=>this._opt({layer:e}),"layer")}
            </section>`:s.s6}
      ${"erase"!==e&&"select"!==e?s.qy`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">${Gn(841)}</h3></div>
            ${this._switch(Gn(356),Gn(680),t.grid,()=>this._opt({grid:!t.grid}),"snap-grid")}
            ${this._switch(Gn(59),Gn(679),t.anchors,()=>this._opt({anchors:!t.anchors}),"snap-anchors")}
          </section>`:s.s6}
    `}render(){if(!this.doc)return s.qy``;const e=this._shape;return e?this._renderShape(e):"tool"===this.selection.kind&&lb(this.selection.tool)?this._renderTool(ub(this.selection)):s.qy``}};Zb.styles=[Qp,s.AH`
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
    `],Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"doc",void 0),Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"selection",void 0),Tb([(0,r.MZ)({type:Boolean})],Zb.prototype,"disabled",void 0),Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"hass",void 0),Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"library",void 0),Tb([(0,r.MZ)({type:Number})],Zb.prototype,"time",void 0),Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"tile",void 0),Tb([(0,r.MZ)({attribute:!1})],Zb.prototype,"stage",void 0),Tb([(0,r.wk)()],Zb.prototype,"_draw",void 0),Zb=Tb([(0,r.EM)("mc-anim-shape-inspector")],Zb),js({tag:"mc-anim-shape-inspector",place:"inspector",when:function(e,t){return"keyframes"===e.kind&&("tool"===t.kind?lb(t.tool):"target"===t.kind&&cb(t.target)&&!!e.rig?.shapes?.some(e=>`shape:${e.id}`===t.target))},title:266,order:30});var Wb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Kb=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))},Ub=["select","pen","line","rect","ellipse","freehand","erase","motion"];let Gb=class extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._key=""}connectedCallback(){super.connectedCallback(),this._offHint=vb.onHint(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._offHint?.()}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc&&!this.pieces){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._key&&(this._key=e,wb(this.doc,this.tile).then(t=>{this._key===e&&(this._resolved=t)}))}}get _dialog(){return this.renderRoot.querySelector("mc-anim-svg-dialog")}openExport(e=!1){this._dialog?.openExport(e)}openImport(e="",t=""){this._dialog?.openImport(e,t)}_choose(e){const t=this.selection;if((this.doc&&pb(this.doc,t)?ub(t):void 0)===e&&"tool"===t.kind)return void Kb(this,{kind:"none"});const i=db(t.target)?t.target:void 0;Kb(this,{kind:"tool",tool:e,...i?{target:i}:{}})}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return s.qy``;const t=pb(e,this.selection),i=t?ub(this.selection):void 0,n=t?vb.hint:"",r=this.pieces??this._resolved?.pieces??[],a=s.qy`<mc-anim-svg-dialog
      .doc=${e}
      .pieces=${r}
      .viewBox=${_b(this.doc?.rig,this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;if(!t)return s.qy`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${()=>this._choose("select")}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>${Gn(258)}
        </button>
        ${a}`;const o=db(this.selection.target);return s.qy`<div class="bar" role="toolbar" aria-label=${Gn(268)}>
        ${Ub.map(e=>{const t=mb[e],n=this.disabled||"motion"===e&&!o;return s.qy`<button
            type="button"
            class="icon-btn tool"
            data-tool=${e}
            aria-pressed=${i===e?"true":"false"}
            aria-label=${Gn(t.label)}
            title=${Gn("motion"!==e||o?t.label:454)}
            ?disabled=${n}
            @click=${()=>this._choose(e)}
          >
            <ha-icon icon=${t.icon}></ha-icon>
          </button>`})}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label=${Gn(382)} title=${Gn(382)} ?disabled=${this.disabled} @click=${()=>this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label=${Gn(764)} title=${Gn(764)} ?disabled=${this.disabled} @click=${()=>this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label=${Gn(902)} title=${Gn(902)} @click=${()=>Kb(this,{kind:"none"})}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${n?s.qy`<p class="hint">${n}</p>`:s.s6}
      ${a}`}};Gb.styles=[Qp,s.AH`
      :host {
        position: absolute;
        top: 8px;
        left: 8px; /* physical */
        right: 8px; /* physical */
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
    `],Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"doc",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"selection",void 0),Wb([(0,r.MZ)({type:Boolean})],Gb.prototype,"disabled",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"tile",void 0),Wb([(0,r.MZ)({type:Number})],Gb.prototype,"time",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"hass",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"library",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"stage",void 0),Wb([(0,r.MZ)({attribute:!1})],Gb.prototype,"pieces",void 0),Wb([(0,r.wk)()],Gb.prototype,"_resolved",void 0),Gb=Wb([(0,r.EM)("mc-anim-draw-toolbar")],Gb),js({tag:"mc-anim-draw-toolbar",place:"stage-tool",when:e=>"keyframes"===e.kind,title:258,order:90,dock:"top"});var Yb=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Jb=[{target:"element",label:292,icon:"mdi:square-rounded-outline"},{target:"icon",label:371,icon:"mdi:star-outline"},{target:"name",label:532,icon:"mdi:format-title"},{target:"state",label:880,icon:"mdi:numeric"},{target:"background",label:80,icon:"mdi:rectangle-outline"}];function Xb(e,t){return!!e.tracks?.some(e=>e.target===t&&(e.keyframes.length>0||!!e.path))||("element"===t||"icon"===t)&&(e.target??"element")===t&&(e.keyframes?.length??0)>0}const Qb=Qn;let ey=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Ms,this.tile="icon",this.density="full",this._list=new Hf(this,{select:e=>e.startsWith("lane:")?!this.disabled&&Rf(this,this.doc,e):this._select(e.slice(7)),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Of(e):(e=>{const t=Jb.find(t=>t.target===e)?.label;return void 0===t?void 0:Gn(t)})(e.slice(7))??e})}_select(e){if(this.disabled)return;const t={kind:"target",target:e};this.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}_row(e,t,i){const n=this.doc,s=Xb(n,e.target)?(e.target===n.target&&"keyframes"===n.kind?n.keyframes?.length??0:0)+(n.tracks?.find(t=>t.target===e.target)?.keyframes.length??0):0,r=`target:${e.target}`,a=Pf(n,this.layerView??Xa,e.target,r),o=this._list.row({key:r,expanded:a,name:Gn(e.label),icon:e.icon,note:t?void 0:Gn(581),badge:s?Gn(1162,{count:s}):void 0,describe:[Xb(n,e.target)?Gn(1091):"",t?"":Gn(1122,{tile:Gn(is(this.tile).label)})].filter(Boolean).join(", "),selected:i===e.target&&!(a&&"keys"===this.selection.kind),toggles:"element"===e.target?["lock"]:void 0,title:t?Gn(e.label):Gn(1200,{label:Gn(e.label),tile:Gn(is(this.tile).label)})});return a?[o,...Nf(this._list,n,this.selection,e.target,2)]:[o]}render(){const e=this.doc;if(!e)return s.s6;const t=is(this.tile),i=(n=this.selection,"target"===n?.kind||"keys"===n?.kind?n.target??n.keys?.[0]?.target:void 0);var n;const r=e=>t.targets.includes(e),a=Jb.filter(t=>r(t.target)||Xb(e,t.target)||i===t.target),o=Jb.filter(e=>!r(e.target));return s.qy`
      <ul aria-label=${Gn(123)}>
        ${a.map(e=>this._row(e,r(e.target),i))}
      </ul>
      ${o.length?s.qy`<p class="hint">
            ${Gn(1183,{count:o.length,names:Qb(o.map(e=>Gn(e.label))),tile:Gn(t.label)})}
          </p>`:s.s6}
    `}};ey.styles=[Qp,Lf,s.AH`
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
    `],Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"doc",void 0),Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"hass",void 0),Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"library",void 0),Yb([(0,r.MZ)({type:Number})],ey.prototype,"time",void 0),Yb([(0,r.MZ)({type:Boolean})],ey.prototype,"disabled",void 0),Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"selection",void 0),Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"tile",void 0),Yb([(0,r.MZ)({attribute:!1})],ey.prototype,"layerView",void 0),Yb([(0,r.MZ)()],ey.prototype,"density",void 0),ey=Yb([(0,r.EM)("mc-anim-targets-layers")],ey),js({tag:"mc-anim-targets-layers",place:"layers",when:e=>"keyframes"===e.kind,title:123,order:40});var ty=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const iy=["lock"],ny=["hide","lock"],sy=[];let ry=class extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this.emitter=0,this.all=!1,this._open=new Map,this._list=new Hf(this,{select:e=>this._pick(e),move:(e,t)=>this._move(e,t),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&/^emitter:/.test(e)&&this._multi&&!this._list.refuseLocked(e,this._nameOfKey(e))&&(this._renaming=e),open:(e,t)=>this._open=new Map(this._open).set(e,t),nameOf:e=>this._nameOfKey(e)})}get _multi(){return!!this.doc&&fm(this.doc)>1}_ems(e){const t=e.particles?.sim?eo(e):["main"];return Array.from({length:fm(e)},(i,n)=>({i:n,id:t[n]??`e${n+1}`,name:Cm(e,0,n),side:Mm(e,n)}))}_nameOfKey(e){const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this.doc?this._ems(this.doc).find(e=>e.id===t):void 0;return e.startsWith("children:")?Gn(139,{name:i?.name??t}):i?.name??t}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("emitter-change",{bubbles:!0,composed:!0,detail:{index:e,all:!1}}))}_pick(e){if(this.disabled||!this.doc)return;const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this._ems(this.doc).find(e=>e.id===t);i&&(this._sub=e.startsWith("emitter:")?void 0:e,this._select(i.i))}_side(e,t){return e.filter(e=>e.side===t).reverse()}_move(e,t){const i=this.doc;if(!i||this.disabled)return;const n=this._ems(i),s=n.find(t=>`emitter:${t.id}`===e);if(!s)return;const r=this._side(n,s.side),a=r.indexOf(s),o=n[Math.max(0,Math.min(n.length-1,this.emitter))]?.id;let l,c,d;if("up"===t?"back"===s.side&&0===a:"front"===s.side&&a===r.length-1){const e="back"===s.side?"front":"back";l=function(e,t,i,n){if(!$m(e,i)||Mm(e,i)===n)return{doc:e,index:i};if(1===fm(e))return{doc:Mu(e,{layer:n}),index:0};const s=_m(e,0),[r]=s.splice(i,1);r.layer=n;let a=Math.min(i,s.length);if("front"===n){const e=s.findIndex(e=>"front"===e.layer);e>=0&&(a=e)}else{const e=s.map(e=>e.layer).lastIndexOf("back");e>=0&&(a=e+1)}return s.splice(a,0,r),{doc:wm(e,0,s),index:a}}(i,0,s.i,e).doc,c=Gn("front"===e?464:462),d=Gn("front"===e?1227:1226,{name:s.name})}else{const e=r["up"===t?a-1:a+1];if(!e)return;l=function(e,t,i,n){if(!$m(e,i)||!$m(e,n)||i===n)return e;const s=_m(e,0);return s.splice(n,0,s.splice(i,1)[0]),wm(e,0,s)}(i,0,s.i,e.i),c=Gn("up"===t?465:463),d=Gn(1229,{name:s.name,direction:Gn("up"===t?1146:1099),position:"up"===t?a:a+2,count:r.length})}if(l===i)return;this._emit(l,c),this._list.announce(d);const p=eo(l).indexOf(o??"");p>=0&&p!==this.emitter&&l.particles?.sim&&this._select(p)}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc,n=i?this._ems(i).find(t=>`emitter:${t.id}`===e):void 0;if(!i||!n||this._list.refuseLocked(e,n.name))return;const s=km(i,0,n.i,t);s!==i&&this._emit(s,"Rename emitter")}_moveInfo(e,t,i){const n=i.indexOf(e),s="up"===t?"back"===e.side&&0===n:"front"===e.side&&n===i.length-1,r="up"===t?0===n:n===i.length-1,a=!this.disabled&&(s||!r);if(s){const i=Gn("up"===t?1109:1094);return{ok:a,label:Gn(489,{name:e.name,where:i}),menu:Gn(490,{where:i})}}return"up"===t?{ok:a,label:Gn(487,{name:e.name}),menu:Gn(480)}:{ok:a,label:Gn(484,{name:e.name}),menu:Gn(459)}}_focusRow(e){this._list.focusKey(e)}_renameField(e,t){return s.qy`<input
      class="input rename"
      aria-label=${Gn(407)}
      maxlength=${40}
      .value=${e.name}
      @click=${e=>e.stopPropagation()}
      @keydown=${e=>{e.stopPropagation(),"Enter"===e.key?(this._rename(t,e.target.value),this._focusRow(t)):"Escape"===e.key&&(this._renaming=void 0,this._focusRow(t))}}
      @blur=${e=>this._rename(t,e.target.value)}
    />`}_rowsOf(e,t,i,n){const s=`emitter:${t.id}`,r=Uu(e,0),a=0===t.i?r:r.emitters[t.i-1],o=0===t.i?r.children:r.emitters[t.i-1].children,l=!this.all&&Math.min(this.emitter,i.length-1)===t.i,c=this._open.get(s)??(1===i.length||l),d=this._side(i,t.side),p=[this._list.row({key:s,name:t.name,icon:"mdi:shimmer",selected:l&&!this._sub,expanded:c,toggles:n,up:this._moveInfo(t,"up",d),down:this._moveInfo(t,"down",d),renamable:this._multi,renaming:this._renaming===s?this._renameField(t,s):void 0,describe:"front"===t.side?Gn(1109):Gn(1094),title:"front"===t.side?Gn(1237,{name:t.name}):Gn(1236,{name:t.name})})];if(!c)return p;o&&p.push(this._list.row({key:`children:${t.id}`,name:Gn(138),icon:"mdi:dots-hexagon",level:2,selected:this._sub===`children:${t.id}`,toggles:n}));const h=(e,t,i)=>{Qu({shapes:e}).forEach((e,n)=>{const s=`pshape:${t}|${n}`;p.push(this._list.row({key:s,name:`${i} ${n+1}: ${Pu(e.shape)}`,icon:"mdi:shape-outline",level:2,selected:this._sub===s,toggles:sy}))})};return h(a.shapes,t.id,Gn(808)),o&&h(o.shapes,`${t.id}/c`,Gn(140)),p}updated(e){if((e.has("emitter")&&void 0!==e.get("emitter")||e.has("all")&&void 0!==e.get("all"))&&this.doc&&!this.all){const e=this._ems(this.doc)[Math.min(this.emitter,fm(this.doc)-1)]?.id;this.renderRoot.querySelector(`[data-lk="emitter:${e}"]`)?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.doc;if(!e||"particles"!==e.kind)return s.s6;const t=this._ems(e),i=!!e.particles?.sim,n=i&&!!md(e),r=i?n?void 0:iy:ny,a=this._side(t,"front"),o=this._side(t,"back");return s.qy`<ul aria-label=${Gn(628)}>
        ${a.flatMap(i=>this._rowsOf(e,i,t,r))}
        <li class="lcontent" title=${Gn(122)}>
          <ha-icon icon="mdi:card-text-outline" aria-hidden="true"></ha-icon><span>${Gn(121)}</span><span class="sr">${Gn(6)}</span>
        </li>
        ${o.flatMap(i=>this._rowsOf(e,i,t,r))}
      </ul>
      ${i&&!n?s.qy`<p class="note">${Gn(362)}</p>`:s.s6}`}};ry.styles=[Qp,Lf,s.AH`
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
    `],ty([(0,r.MZ)({attribute:!1})],ry.prototype,"doc",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"selection",void 0),ty([(0,r.MZ)({type:Boolean})],ry.prototype,"disabled",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"hass",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"library",void 0),ty([(0,r.MZ)({type:Number})],ry.prototype,"time",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"tile",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"stage",void 0),ty([(0,r.MZ)({attribute:!1})],ry.prototype,"layerView",void 0),ty([(0,r.MZ)()],ry.prototype,"density",void 0),ty([(0,r.MZ)({type:Number})],ry.prototype,"emitter",void 0),ty([(0,r.MZ)({type:Boolean})],ry.prototype,"all",void 0),ty([(0,r.wk)()],ry.prototype,"_open",void 0),ty([(0,r.wk)()],ry.prototype,"_renaming",void 0),ty([(0,r.wk)()],ry.prototype,"_sub",void 0),ry=ty([(0,r.EM)("mc-anim-particles-layers")],ry),js({tag:"mc-anim-particles-layers",place:"layers",when:e=>"particles"===e.kind,title:628,order:10});var ay=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const oy={element:292,icon:371,particles:631};let ly=class extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._sel="path",this._list=new Hf(this,{select:e=>this._sel=e,nameOf:e=>"path"===e?Gn(452):Gn(496,{subject:this._subject()})})}_subject(){const e=oy[this.doc?.path?.subject??"element"]??oy.element;return Gn(e)}render(){const e=this.doc;return e&&"path"===e.kind?e.path?.d.trim()?s.qy`<ul aria-label=${Gn(645)}>
      ${this._list.row({key:"path",name:Gn(452),icon:"mdi:vector-curve",selected:"path"===this._sel})}
      ${this._list.row({key:"subject",name:Gn(496,{subject:this._subject()}),icon:"mdi:arrow-right-bold-outline",selected:"subject"===this._sel})}
    </ul>`:s.qy`<p class="empty-note">${Gn(559)}</p>`:s.s6}};ly.styles=[Qp,Lf,s.AH`
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
    `],ay([(0,r.MZ)({attribute:!1})],ly.prototype,"doc",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"selection",void 0),ay([(0,r.MZ)({type:Boolean})],ly.prototype,"disabled",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"hass",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"library",void 0),ay([(0,r.MZ)({type:Number})],ly.prototype,"time",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"tile",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"stage",void 0),ay([(0,r.MZ)({attribute:!1})],ly.prototype,"layerView",void 0),ay([(0,r.MZ)()],ly.prototype,"density",void 0),ay([(0,r.wk)()],ly.prototype,"_sel",void 0),ly=ay([(0,r.EM)("mc-anim-path-layers")],ly),js({tag:"mc-anim-path-layers",place:"layers",when:e=>"path"===e.kind,title:644,order:10});var cy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let dy=class extends s.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new Hf(this,{select:e=>this._sel=e,move:(e,t)=>this._move(Number(e.slice(5)),t),nameOf:e=>this._name(Number(e.slice(5)))})}_name(e){const t=this.doc?.steps?.[e];return t?vf(t.animation,this.library,this.doc?.id).name:Gn(898,{i:e+1})}_move(e,t){const i=this.doc,n=i?.steps??[],s="up"===t?e-1:e+1;if(!i||this.disabled||s<0||s>=n.length)return;const r=this._name(e);let a;try{a=this.renderRoot.activeElement?.getAttribute("data-ctl")??void 0}catch{a=void 0}this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:{...i,steps:bf(n,e,s)},label:Gn(475)}})),this._list.announce(Gn(1222,{name:r,to:s+1,count:n.length}),go(this.layerView??{hidden:[],solo:[],locked:[],open:[]},e,s)),this._sel===`step:${e}`&&(this._sel=`step:${s}`),queueMicrotask(()=>this._list.focusKey(`step:${s}`,a))}render(){const e=this.doc;if(!e||"sequence"!==e.kind)return s.s6;const t=e.steps??[];return t.length?s.qy`<ol aria-label=${Gn(796)}>
      ${t.map((i,n)=>{const r=vf(i.animation,this.library,e.id),a="ok"===r.status?i.duration??r.defaultDuration:void 0,o=`step:${n}`,l=r.name;return this._list.row({key:o,name:l,thumb:s.qy`<span class="num" aria-hidden="true">${n+1}</span>`,note:r.problem,badge:void 0!==a?yf(a):void 0,describe:r.problem?Gn(1136,{i:n+1,count:t.length,problem:r.problem}):Gn(1135,{i:n+1,count:t.length}),selected:this._sel===o,up:{ok:!this.disabled&&n>0,label:Gn(488,{name:l}),menu:Gn(481)},down:{ok:!this.disabled&&n<t.length-1,label:Gn(486,{name:l}),menu:Gn(461)}})})}
    </ol>`:s.qy`<p class="empty-note">${Gn(564)}</p>`}};dy.styles=[Qp,Lf,s.AH`
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
    `],cy([(0,r.MZ)({attribute:!1})],dy.prototype,"doc",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"selection",void 0),cy([(0,r.MZ)({type:Boolean})],dy.prototype,"disabled",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"hass",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"library",void 0),cy([(0,r.MZ)({type:Number})],dy.prototype,"time",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"tile",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"stage",void 0),cy([(0,r.MZ)({attribute:!1})],dy.prototype,"layerView",void 0),cy([(0,r.MZ)()],dy.prototype,"density",void 0),cy([(0,r.wk)()],dy.prototype,"_sel",void 0),dy=cy([(0,r.EM)("mc-anim-steps-layers")],dy),js({tag:"mc-anim-steps-layers",place:"layers",when:e=>"sequence"===e.kind,title:795,order:10});const py=[{id:"state",label:881},{id:"state_not",label:882},{id:"entity_on",label:305},{id:"entity_off",label:304},{id:"above",label:1063},{id:"below",label:1065}],hy=[{id:"cut",label:211,hint:913},{id:"crossfade",label:196,hint:317},{id:"finish",label:326,hint:413}];function uy(e,t){const i=Number(t),n=""!==t.trim()&&Number.isFinite(i)?i:0,s=t.trim()||"on";switch(e){case"state":return{state:s};case"state_not":return{state_not:s};case"entity_on":return{entity_on:!0};case"entity_off":return{entity_on:!1};case"above":return{above:n};case"below":return{below:n}}}function my(e){return e&&"object"==typeof e?(e instanceof Map?[...e.values()]:Array.isArray(e)?e:Object.values(e)).filter(e=>!!e&&"object"==typeof e&&"string"==typeof e.id):[]}const gy=e=>(e?.length??0)<12;var fy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let vy=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Ms,this._announce=""}get _clips(){return Array.isArray(this.doc?.clips)?this.doc.clips:[]}_write(e,t){if(!this.doc)return;const i={...this.doc};e.length?i.clips=e:delete i.clips,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_patch(e,t,i){this._write(this._clips.map((i,n)=>n===e?{...i,...t}:i),i)}_add(){if(!gy(this._clips))return;const e=function(e){const t=new Set(e.map(e=>"state"in e.when?e.when.state:""));if(t.has("on")&&t.has("off"))return{when:{above:50},animation:"self",transition:"crossfade"};const i=t.has("on")?"off":"on";return{when:{state:i},animation:"off"===i?"none":"self",transition:"crossfade"}}(this._clips);this._write([...this._clips,e],"Add state"),this._focusAfter=`.clip[data-i="${this._clips.length}"] select.when`,this._announce=Gn(886,{count:this._clips.length+1,when:Id(e.when)})}_remove(e){const t=this._clips.filter((t,i)=>i!==e);this._write(t,"Delete state"),this._focusAfter=t.length?`.clip[data-i="${Math.min(e,t.length-1)}"] .del`:".add",this._announce=Gn(888,{i:e+1})}_move(e,t){t<0||t>=this._clips.length||(this._write(function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return[...e];const n=[...e],[s]=n.splice(t,1);return n.splice(i,0,s),n}(this._clips,e,t),"Reorder states"),this._focusAfter=`.clip[data-i="${t}"] .${t<e?"up":"down"}`,this._announce=Gn(885,{to:t+1}))}updated(){const e=this._focusAfter;if(!e)return;this._focusAfter=void 0;const t=this.renderRoot.querySelector(e);(t&&!t.disabled?t:this.renderRoot.querySelector(".add"))?.focus()}_when(e,t){const i="state"in(n=e.when)?"state":"state_not"in n?"state_not":"entity_on"in n?n.entity_on?"entity_on":"entity_off":"above"in n?"above":"below";var n;const r=function(e){return"state"in e?e.state:"state_not"in e?e.state_not:"above"in e?String(e.above):"below"in e?String(e.below):""}(e.when),a=`st-${t}`,o="above"===i||"below"===i;return s.qy`<div class="pair">
      <div class="field">
        <div class="field-head"><label for="${a}-k">${Gn(1076)}</label></div>
        <div class="select">
          <select
            class="input when"
            id="${a}-k"
            ?disabled=${this.disabled}
            @change=${e=>this._patch(t,{when:uy(e.target.value,r)},"Change state condition")}
          >
            ${py.map(e=>s.qy`<option value=${e.id} ?selected=${e.id===i}>${Gn(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
      ${"entity_on"===i||"entity_off"===i?s.qy`<div class="field"><div class="field-head"><span class="lbl">${Gn(1062)}</span></div><p class="help fill">${Gn(598)}</p></div>`:s.qy`<div class="field">
            <div class="field-head"><label for="${a}-v">${Gn(o?594:880)}</label></div>
            <input
              class="input ${o?"":"mono"}"
              id="${a}-v"
              type=${o?"number":"text"}
              step="any"
              inputmode=${o?"decimal":"text"}
              placeholder=${o?"0":Gn(1124)}
              autocomplete="off"
              spellcheck="false"
              ?disabled=${this.disabled}
              .value=${r}
              @change=${e=>{const n=e.target.value;!o||""!==n.trim()&&Number.isFinite(Number(n))?this._patch(t,{when:uy(i,n)},"Change state value"):e.target.value=r}}
            />
          </div>`}
    </div>`}_play(e,t){const i=`st-${t}-a`,n=function(e,t){const i=[{label:Gn(988),items:[{value:"self",label:Gn(618)},{value:"none",label:Gn(588)}]}],n=my(e).filter(e=>((e,t)=>!!e&&e.id!==t&&gf(e)&&!(Array.isArray(e.clips)&&e.clips.length>0))(e,t)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).map(e=>({value:Ye+e.id,label:e.name||e.id}));n.length&&i.push({label:Gn(531),items:n});for(const e of se){const t=ne.filter(t=>t.group===e&&mt.has(t.id)).map(e=>({value:e.id,label:(0,K.t)(e.name)}));t.length&&i.push({label:(0,K.t)(re[e]),items:t})}return i}(this.library,this.doc?.id),r=n.some(t=>t.items.some(t=>t.value===e.animation));return s.qy`<div class="field">
      <div class="field-head"><label for=${i}>${Gn(663)}</label></div>
      <div class="select">
        <select class="input play" id=${i} ?disabled=${this.disabled} @change=${e=>this._patch(t,{animation:e.target.value},"Change state animation")}>
          ${r?s.s6:s.qy`<option value=${e.animation} selected>${function(e,t,i){if("self"===e)return Gn(618);if("none"===e)return Gn(587);if(Je(e)){const n=Xe(e),s=my(t).find(e=>e.id===n);return s?s.name||s.id:n===i?Gn(618):Gn(1189,{id:n})}const n=oe(e)?.name;return void 0!==n?(0,K.t)(n):Gn(1149,{animation:e})}(e.animation,this.library,this.doc?.id)}</option>`}
          ${n.map(t=>s.qy`<optgroup label=${t.label}>
              ${t.items.map(t=>s.qy`<option value=${t.value} ?selected=${t.value===e.animation}>${t.label}</option>`)}
            </optgroup>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_transition(e,t){const i=e.transition??"cut",n=e=>{e!==i&&this._patch(t,{transition:e},"Change state transition")},r=(hy.find(e=>e.id===i)??hy[0]).hint;return s.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="st-${t}-t">${Gn(1015)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="st-${t}-t" aria-describedby="st-${t}-th" @keydown=${e=>{const s=hy.findIndex(e=>e.id===i),r="rtl"===b(e.currentTarget),a={[r?"ArrowLeft":"ArrowRight"]:(s+1)%hy.length,[r?"ArrowRight":"ArrowLeft"]:(s-1+hy.length)%hy.length,Home:0,End:hy.length-1}[e.key];void 0!==a&&(e.preventDefault(),n(hy[a].id),this._focusAfter=`.clip[data-i="${t}"] .seg [aria-checked="true"]`)}}>
        ${hy.map(e=>{const t=e.id===i;return s.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>n(e.id)}>
            ${Gn(e.label)}
          </button>`})}
      </div>
      <p class="help" id="st-${t}-th">${Gn(r)}.</p>
    </div>`}_clip(e,t,i){const n=function(e,t,i){if(!Je(e.animation)){if("self"===e.animation||"none"===e.animation)return;return oe(e.animation)?mt.has(e.animation)?void 0:Gn(290):Gn(1037)}const n=Xe(e.animation);if(n===i)return Gn(1046);const s=my(t).find(e=>e.id===n);return s?Array.isArray(s.clips)&&s.clips.length?Gn(918):gf(s)?void 0:Gn(626):Gn(580)}(e,this.library,this.doc?.id);return s.qy`<li class="cond clip" data-i=${t}>
      <div class="cond-head">
        <span class="n">${Gn(887,{i:t+1})} <span class="sub">· ${Id(e.when)}</span></span>
        <button type="button" class="icon-btn sm up" aria-label=${Gn(474,{i:t+1})} title=${Gn(479)} ?disabled=${this.disabled||0===t} @click=${()=>this._move(t,t-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm down" aria-label=${Gn(473,{i:t+1})} title=${Gn(459)} ?disabled=${this.disabled||t===i-1} @click=${()=>this._move(t,t+1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm danger del" aria-label=${Gn(232,{i:t+1})} title=${Gn(231)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${n?s.qy`<p class="help error">${n}</p>`:s.s6}
      ${this._when(e,t)} ${this._play(e,t)} ${this._transition(e,t)}
    </li>`}render(){const e=this._clips,t=!gy(e);return s.qy`
      <div class="wrap">
        <p class="help lead">
          ${e.length?Gn(945):Gn(669)}
        </p>
        ${e.length?s.qy`<ol class="clips">${e.map((t,i)=>this._clip(t,i,e.length))}</ol>`:s.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||t} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${Gn(35)}
          </button>
          ${t?s.qy`<span class="help">${Gn(1152,{cLIPS_MAX:12})}</span>`:s.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};vy.styles=[Qp,s.AH`
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
    `],fy([(0,r.MZ)({attribute:!1})],vy.prototype,"doc",void 0),fy([(0,r.MZ)({attribute:!1})],vy.prototype,"hass",void 0),fy([(0,r.MZ)({attribute:!1})],vy.prototype,"library",void 0),fy([(0,r.MZ)({type:Number})],vy.prototype,"time",void 0),fy([(0,r.MZ)({type:Boolean,reflect:!0})],vy.prototype,"disabled",void 0),fy([(0,r.MZ)({attribute:!1})],vy.prototype,"selection",void 0),fy([(0,r.MZ)({attribute:!1})],vy.prototype,"tile",void 0),fy([(0,r.wk)()],vy.prototype,"_announce",void 0),vy=fy([(0,r.EM)("mc-anim-states-panel")],vy),js({tag:"mc-anim-states-panel",place:"inspector",when:(e,t)=>"none"===t.kind,title:889,order:60});const by=[{id:"rotate_speed",label:751,unit:"°/s",output:[0,720],step:10,hint:854},{id:"rotate",label:750,unit:"°",output:[0,180],step:5,hint:1028},{id:"x",label:456,unit:"px",output:[0,12],step:1,hint:497},{id:"y",label:457,unit:"px",output:[0,-12],step:1,hint:499},{id:"scale",label:769,unit:"×",output:[.8,1.2],step:.05,hint:359},{id:"opacity",label:606,unit:"0-1",output:[.3,1],step:.05,hint:318},{id:"draw",label:258,unit:"0-1",output:[0,1],step:.05,rigOnly:!0,hint:270},{id:"color_mix",label:167,unit:"",output:["#9e9e9e","#ffb300"],step:1,hint:95},{id:"speed",label:671,unit:"×",output:[.25,2],step:.05,hint:675}],yy=e=>by.find(t=>t.id===e)??by[0],xy=e=>by.filter(t=>!t.rigOnly||(e=>/^(part|group|shape):/.test(e))(e)),_y=e=>(e?.bindings?.length??0)<8;function wy(e,t){const i={...e};return t.length?i.bindings=t:delete i.bindings,i}const $y=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;var ky=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const My={element:292,icon:371,name:532,state:880,background:80},Sy={element:1138,icon:1139,name:1140,state:1141,background:1137},jy=e=>e.target??e.keys?.[0]?.target;let Cy=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Ms,this._announce="",this._badAttr=new Set}get _target(){return jy(this.selection)}_write(e,t){this.doc&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:wy(this.doc,e),label:t}}))}_patch(e,t,i){this._write((this.doc?.bindings??[]).map((i,n)=>n===e?t:i),i)}_add(){const e=this._target;if(!e||!this.doc||!_y(this.doc))return;const t=this.doc.bindings??[],i=function(e){const t=xy(e)[0];return{target:e,property:t.id,input:{min:0,max:100},output:[...t.output],smoothing:.4}}(e);this._write([...t,i],"Add value binding"),this._focusAfter=`.bind[data-i="${t.length}"] select.prop`,this._announce=Gn(87,{property:Gn(yy(i.property).label)})}_remove(e){const t=(this.doc?.bindings??[]).filter((t,i)=>i!==e);this._write(t,"Delete value binding"),this._focusAfter=".add",this._announce=Gn(88)}_checkAttr(e,t){const i=!t.trim()||$y.test(t.trim());if(i!==!this._badAttr.has(e)){const t=new Set(this._badAttr);i?t.delete(e):t.add(e),this._badAttr=t}return i}updated(){const e=this._focusAfter;e&&(this._focusAfter=void 0,this.renderRoot.querySelector(e)?.focus())}_num(e,t,i,n,r){return s.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        class="input"
        id=${e}
        type="number"
        step=${n}
        inputmode="decimal"
        ?disabled=${this.disabled}
        .value=${String(i)}
        @change=${e=>{const t=e.target,n=Number(t.value);""!==t.value.trim()&&Number.isFinite(n)?n!==i&&r(n):t.value=String(i)}}
      />
    </div>`}_output(e,t){const i=yy(e.property),n=`bd-${t}`;if("color_mix"===e.property){const[i,n]=e.output,r=(s,r)=>{if(!r)return;const a=[i,n];a[s]=r,this._patch(t,{...e,output:a},"Change binding colours")};return s.qy`<div class="field">
          <div class="field-head"><span class="lbl">${Gn(347)}</span></div>
          <mc-color-picker .value=${i} .label=${Gn(347)} @value-changed=${e=>r(0,e.detail.value)}></mc-color-picker>
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${Gn(1007)}</span></div>
          <mc-color-picker .value=${n} .label=${Gn(1007)} @value-changed=${e=>r(1,e.detail.value)}></mc-color-picker>
        </div>`}const[r,a]=e.output,o=i.unit?` (${i.unit})`:"";return s.qy`<div class="pair">
      ${this._num(`${n}-from`,Gn(348,{unit:o}),r,i.step,i=>this._patch(t,{...e,output:[i,a]},"Change binding output"))}
      ${this._num(`${n}-to`,Gn(1012,{unit:o}),a,i.step,i=>this._patch(t,{...e,output:[r,i]},"Change binding output"))}
    </div>`}_binding(e,t,i){const n=`bd-${t}`,r=yy(e.property),a=xy(e.target),o=function(e){return e.input.min===e.input.max?Gn(444):void 0===e.input.attribute||""===e.input.attribute||$y.test(e.input.attribute)?void 0:Gn(79)}(e),l=function(e,t){if(!e)return;const i="element"===t.target||"icon"===t.target?e.keyframes:e.tracks?.find(e=>e.target===t.target)?.keyframes;if(!i?.length)return;const n=i,s=e=>n.some(t=>void 0!==e(t));switch(t.property){case"opacity":return s(e=>e.opacity)?Gn(981):void 0;case"draw":return s(e=>e.draw)?Gn(980):void 0;case"color_mix":return("background"===t.target?s(e=>e.background):s(e=>e.color))?Gn(982):void 0;case"rotate":case"x":case"y":case"scale":return s(e=>e.transform?.skew_x??e.transform?.skew_y)?Gn(983):void 0;default:return}}(this.doc,e),c=this._badAttr.has(t);return s.qy`<li class="cond bind" data-i=${t}>
      <div class="cond-head">
        <span class="n">${Gn(89,{n:i+1})} <span class="sub">· ${Gn(r.label)}</span></span>
        <button type="button" class="icon-btn sm danger del" aria-label=${Gn(224,{n:i+1})} title=${Gn(223)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="${n}-p">${Gn(696)}</label></div>
        <div class="select">
          <select
            class="input prop"
            id="${n}-p"
            aria-describedby="${n}-ph"
            ?disabled=${this.disabled}
            @change=${i=>this._patch(t,function(e,t){return e.property===t?e:{...e,property:t,output:[...yy(t).output]}}(e,i.target.value),"Change bound property")}
          >
            ${a.map(t=>s.qy`<option value=${t.id} ?selected=${t.id===e.property}>${Gn(t.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        <p class="help" id="${n}-ph">${Gn(r.hint)}</p>
      </div>
      <fieldset>
        <legend>${Gn(306)}</legend>
        <div class="field">
          <div class="field-head"><label for="${n}-a">${Gn(77)}</label></div>
          <input
            class="input mono"
            id="${n}-a"
            type="text"
            placeholder=${Gn(1134)}
            autocomplete="off"
            spellcheck="false"
            aria-describedby="${n}-ah"
            aria-invalid=${c?"true":"false"}
            ?disabled=${this.disabled}
            .value=${e.input.attribute??""}
            @input=${e=>this._checkAttr(t,e.target.value)}
            @change=${i=>{const n=i.target.value.trim();if(!this._checkAttr(t,n))return;const s={...e.input};n?s.attribute=n:delete s.attribute,this._patch(t,{...e,input:s},"Change binding attribute")}}
          />
          <p class="help ${c?"error":""}" id="${n}-ah">
            ${Gn(c?78:299)}
          </p>
        </div>
        <div class="pair">
          ${this._num(`${n}-min`,Gn(443),e.input.min,1,i=>this._patch(t,{...e,input:{...e.input,min:i}},"Change binding range"))}
          ${this._num(`${n}-max`,Gn(439),e.input.max,1,i=>this._patch(t,{...e,input:{...e.input,max:i}},"Change binding range"))}
        </div>
      </fieldset>
      <fieldset>
        <legend>${Gn(614)}</legend>
        ${this._output(e,t)}
        ${this._num(`${n}-s`,Gn(838),e.smoothing??0,.1,i=>{const n={...e};i>0?n.smoothing=Math.min(10,i):delete n.smoothing,this._patch(t,n,"Change binding smoothing")})}
      </fieldset>
      ${l?s.qy`<p class="help warn">${l}</p>`:s.s6}
      ${o?s.qy`<p class="help error" role="alert">${o}</p>`:s.s6}
    </li>`}render(){const e=this._target;if(!e||!this.doc)return s.qy``;const t=function(e,t){return t&&Array.isArray(e?.bindings)?e.bindings.map((e,t)=>({b:e,index:t})).filter(e=>e.b.target===t):[]}(this.doc,e),i=!_y(this.doc),n=Sy[e]?Gn(Sy[e]):`“${function(e,t){if(My[t])return Gn(My[t]);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e?.rig?.parts:"group"===i[1]?e?.rig?.groups:e?.rig?.shapes;return n?.find(e=>e.id===i[2])?.name||i[2]}(this.doc,e)}”`;return s.qy`
      <div class="wrap">
        <p class="help lead">
          ${t.length?s.qy`${Gn(941,{name:n})}`:s.qy`${Gn(272,{name:n})}`}
        </p>
        ${t.length?s.qy`<ol class="binds">${t.map((e,t)=>this._binding(e.b,e.index,t))}</ol>`:s.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||i} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${Gn(39)}
          </button>
          ${i?s.qy`<span class="help">${Gn(1209,{max:8})}</span>`:s.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};Cy.styles=[Qp,s.AH`
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
    `],ky([(0,r.MZ)({attribute:!1})],Cy.prototype,"doc",void 0),ky([(0,r.MZ)({attribute:!1})],Cy.prototype,"hass",void 0),ky([(0,r.MZ)({attribute:!1})],Cy.prototype,"library",void 0),ky([(0,r.MZ)({type:Number})],Cy.prototype,"time",void 0),ky([(0,r.MZ)({type:Boolean,reflect:!0})],Cy.prototype,"disabled",void 0),ky([(0,r.MZ)({attribute:!1})],Cy.prototype,"selection",void 0),ky([(0,r.MZ)({attribute:!1})],Cy.prototype,"tile",void 0),ky([(0,r.wk)()],Cy.prototype,"_announce",void 0),ky([(0,r.wk)()],Cy.prototype,"_badAttr",void 0),Cy=ky([(0,r.EM)("mc-anim-bindings-panel")],Cy),js({tag:"mc-anim-bindings-panel",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"target"===t.kind&&!!jy(t),title:1067,order:60});var Ay=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const zy=[{id:"on",label:596},{id:"off",label:595},{id:"unavailable",label:1029},{id:"value",label:1062,numeric:!0},{id:"custom",label:204}];let qy=class extends s.WF{constructor(){super(...arguments),this.disabled=!1,this.selection=Ms,this.time=0,this._choice="on",this._custom="idle",this._value=Rd.value,this._sent="",this._picked=!1}get detail(){return{state:"value"===this._choice?function(e,t){const[i,n]=Td(e).stateRange??[0,100];return String(Nd(i+(n-i)*Math.min(1,Math.max(0,t))))}(this.doc,this._value):"custom"===this._choice?this._custom.trim()||"idle":this._choice,value:this._value,attributes:Fd(this.doc,this._value)}}_emit(){const e=this.detail,t=JSON.stringify(e);t!==this._sent&&(this._sent=t,this.dispatchEvent(new CustomEvent("preview-change",{bubbles:!0,composed:!0,detail:e})))}willUpdate(e){e.has("doc")&&!this._picked&&(this._choice=Td(this.doc).numericState?"value":"on")}updated(e){(e.has("doc")||e.has("_choice")||e.has("_custom")||e.has("_value"))&&this._emit()}_pick(e){this._picked=!0,this._choice=e,"custom"===e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".custom")?.focus())}_states(e){const t=zy.filter(t=>!t.numeric||e||this._choice===t.id);return s.qy`<div class="seg" role="radiogroup" aria-label=${Gn(691)} @keydown=${e=>{const i=t.findIndex(e=>e.id===this._choice),n={ArrowRight:(i+1)%t.length,ArrowLeft:(i-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];void 0!==n&&(e.preventDefault(),this._picked=!0,this._choice=t[n].id,this.updateComplete.then(()=>this.renderRoot.querySelector('.seg [aria-checked="true"]')?.focus()))}}>
      ${t.map(e=>{const t=e.id===this._choice;return s.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>this._pick(e.id)}>${Gn(e.label)}</button>`})}
    </div>`}render(){if(!Pd(this.doc))return s.qy``;const e=Td(this.doc),t=Math.round(100*this._value);return s.qy`<div class="bar" role="group" aria-label=${Gn(689)}>
      <span class="lbl" aria-hidden="true"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></span>
      ${this._states(e.numericState)}
      ${"custom"===this._choice?s.qy`<input
            class="input mono custom"
            type="text"
            aria-label=${Gn(207)}
            placeholder=${Gn(880)}
            autocomplete="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            .value=${this._custom}
            @change=${e=>this._custom=e.target.value}
          />`:s.s6}
      ${e.value?s.qy`<label class="value">
            <span class="sr-only">${Gn(693)}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              ?disabled=${this.disabled}
              .value=${String(t)}
              aria-valuetext=${Gn(1245,{pct:t})}
              @input=${e=>this._value=Number(e.target.value)/100}
            />
            <output aria-hidden="true">${t}%</output>
          </label>`:s.s6}
    </div>`}};qy.styles=[Qp,s.AH`
      :host {
        position: absolute;
        left: 12px;
        right: 12px;
        inset-inline: 12px;
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
        text-align: end;
      }
      input[type='range']:focus-visible {
        outline: 2px solid var(--mc-accent);
        outline-offset: 2px;
      }
    `],Ay([(0,r.MZ)({attribute:!1})],qy.prototype,"doc",void 0),Ay([(0,r.MZ)({type:Boolean,reflect:!0})],qy.prototype,"disabled",void 0),Ay([(0,r.MZ)({attribute:!1})],qy.prototype,"selection",void 0),Ay([(0,r.MZ)({type:Number})],qy.prototype,"time",void 0),Ay([(0,r.wk)()],qy.prototype,"_choice",void 0),Ay([(0,r.wk)()],qy.prototype,"_custom",void 0),Ay([(0,r.wk)()],qy.prototype,"_value",void 0),qy=Ay([(0,r.EM)("mc-anim-stage-sim")],qy),js({tag:"mc-anim-stage-sim",place:"stage-tool",when:e=>Pd(e),title:689,order:80,dock:"bottom"});var Ey=i(5084),Hy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};const Ly=e=>!!e&&/^(part|group|shape):/.test(e),Vy=(e,t)=>"intensity"===e.id?`${t}×`:"direction"===e.id?Gn(t<0?742:342):`${t} %`;let Oy=class extends s.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._applied=new Map,this._status=""}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=gv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=fv(e),this._geom||vv(e).then(t=>{this._ref===e&&(this._geom=t)}))}}get _targets(){const e=Wv(this.selection).filter(Ly),t=this.selection.target;Ly(t)&&!e.includes(t)&&e.unshift(t);for(const t of this.selection.targets??[])Ly(t)&&!e.includes(t)&&e.push(t);return e}get _key(){return this._targets.join(",")}_apply(e,t,i=!1){const n=i?this._dragBase??=this.doc:this._dragBase??this.doc;if(!n)return;const s=this._geom?yv(this._geom):void 0,r=(0,Ey.ar)(n,this._targets,e.id,t,{pieces:s});if(i||(this._dragBase=void 0),r===n)return void(i||(this._status=Gn(989)));const a=new Map(this._applied);a.set(this._key,{preset:e.id,params:t}),this._applied=a;const o=this._targets.map(e=>Nv(n,e));this._status=i?"":Gn(1248,{preset:(0,K.t)(e.name),targets:o.length>2?Gn(1165,{count:o.length}):Qn(o)}),Gv(this,r,`Preset: ${e.id}`,i)}_pickPreset(e,t){const i=Ey.tP.find(t=>t.id===e.value);i&&(this._apply(i,t?.preset===i.id?t.params:{}),this._applied.get(this._key)?.preset!==i.id&&(e.value=t?.preset??""))}_clear(){if(!this.doc)return;const e=this._targets.reduce((e,t)=>(0,Ey.di)(e,t),this.doc),t=new Map(this._applied);t.delete(this._key),this._applied=t,this._status=Gn(455),Gv(this,e,"Remove motion")}_openSvg(){this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)}_renderParams(e,t){const i=(0,Ey.Cq)(e.id,t);return s.qy`<div class="params" role="group" aria-label=${Gn(1232,{name:(0,K.t)(e.name)})}>
      ${e.params.map(t=>{const n=i[t.id];if("direction"===t.id)return s.qy`<div class="field">
            <div class="field-head"><span class="lbl" id="pp-dir">${Gn(240)}</span></div>
            <div class="seg full" role="radiogroup" aria-labelledby="pp-dir">
              ${[1,-1].map(t=>s.qy`<button
                  type="button"
                  role="radio"
                  data-dir=${t}
                  aria-checked=${n===t?"true":"false"}
                  tabindex=${n===t?0:-1}
                  ?disabled=${this.disabled}
                  @click=${()=>this._apply(e,{...i,direction:t})}
                >
                  <ha-icon icon=${t>0?"mdi:rotate-right":"mdi:rotate-left"}></ha-icon>${Gn(t>0?342:742)}
                </button>`)}
            </div>
          </div>`;const r=`pp-${t.id}`;return s.qy`<div class="field">
          <div class="field-head"><label for=${r}>${(0,K.t)(t.label)}</label><span class="val">${Vy(t,n)}</span></div>
          <input
            id=${r}
            class="range"
            type="range"
            data-param=${t.id}
            min=${t.min}
            max=${t.max}
            step=${t.step}
            .value=${String(n)}
            aria-valuetext=${Vy(t,n)}
            ?disabled=${this.disabled}
            @input=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)},!0)}
            @change=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)})}
          />
        </div>`})}
    </div>`}updated(){const e=this.renderRoot.querySelector("select#pp-preset"),t=this._applied.get(this._key)?.preset??"";e&&e.value!==t&&(e.value=t)}render(){const e=this.doc,t=this._targets;if(!e||!t.length)return s.qy``;const i=this._applied.get(this._key),n=i?Ey.tP.find(e=>e.id===i.preset):void 0,r=t.some(t=>(wv(e,t)?.keyframes.length??0)>0),a=this._geom?yv(this._geom):[];return s.qy`
      <p class="help">${t.length>1?Gn(1170,{count:t.length}):Gn(599)}</p>
      <div class="field">
        <div class="field-head"><label for="pp-preset">${Gn(685)}</label></div>
        <div class="select">
          <select
            class="input"
            id="pp-preset"
            aria-describedby=${n?.help?"pp-preset-help":s.s6}
            ?disabled=${this.disabled}
            @change=${e=>this._pickPreset(e.target,i)}
          >
            <option value="" ?selected=${!n} ?disabled=${!!n} ?hidden=${!!n}>${Gn(143)}</option>
            ${Ey.tP.map(e=>s.qy`<option value=${e.id} data-preset=${e.id} ?selected=${n?.id===e.id}>${(0,K.t)(e.name)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        ${n?.help?s.qy`<p class="help" id="pp-preset-help">${(0,K.t)(n.help)}</p>`:s.s6}
      </div>
      ${n?this._renderParams(n,i.params):s.s6}
      <div class="actions">
        ${r?s.qy`<button type="button" class="btn btn-text btn-sm clear" ?disabled=${this.disabled} @click=${()=>this._clear()}>${Gn(716)}</button>`:s.s6}
        <span class="grow"></span>
        <button type="button" class="btn btn-secondary btn-sm export" @click=${()=>this._openSvg()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>${Gn(63)}
        </button>
      </div>
      <p class="status" role="status" aria-live="polite">${this._status}</p>
      <mc-anim-svg-dialog .doc=${e} .pieces=${a} .viewBox=${this._geom?.viewBox??"0 0 24 24"}></mc-anim-svg-dialog>
    `}};function Py(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}Oy.styles=[vs,bs,s.AH`
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
    `],Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"doc",void 0),Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"hass",void 0),Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"library",void 0),Hy([(0,r.MZ)({type:Number})],Oy.prototype,"time",void 0),Hy([(0,r.MZ)({type:Boolean})],Oy.prototype,"disabled",void 0),Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"selection",void 0),Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"tile",void 0),Hy([(0,r.MZ)({attribute:!1})],Oy.prototype,"stage",void 0),Hy([(0,r.wk)()],Oy.prototype,"_applied",void 0),Hy([(0,r.wk)()],Oy.prototype,"_geom",void 0),Hy([(0,r.wk)()],Oy.prototype,"_status",void 0),Oy=Hy([(0,r.EM)("mc-anim-part-presets")],Oy),js({tag:"mc-anim-part-presets",place:"inspector",title:623,order:15,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&Ly(t.target)}),new Map;var Ry=i(1474);let Ny,Dy;function Ty(){return Ny??=Promise.all([i.e(626),i.e(334)]).then(()=>i(1402)).then(e=>(0,mp.t)("magic-card-icon-library.js",e)??Promise.reject(new Error("the icon library is from another release"))).then(async e=>await e.iconNamesReady()?e:Promise.reject(new Error("the icon names could not be loaded"))).then(e=>Dy=e,e=>{throw Ny=void 0,console.warn("Magic Card: icon library not loaded",e),e}),Ny}var Fy=function(e,t,i,n){var s,r=arguments.length,a=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(a=(r<3?s(a):r>3?s(t,i,a):s(t,i))||a);return r>3&&a&&Object.defineProperty(t,i,a),a};let By=class extends s.WF{constructor(){super(...arguments),this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(e.has("entry")&&(this._card=void 0),this._card)return void(e.has("hass")&&this.hass&&(this._card.hass=this.hass));const t=this.entry;if(!this._visible||!t||!customElements.get("magic-card"))return;const i=t.build(),n=document.createElement("magic-card");try{n.setConfig({type:"custom:magic-card",custom_animations:[i],rows:[{id:"r",columns:[{id:"c",vertical_align:"center",modules:[{id:"m",type:"icon",icon:t.icon,size:"40px",design:{text_align:"center",animations:[{id:"a",preset:`custom:${i.id}`}]}}]}]}]})}catch{return}n.hass=this.hass??Xd(!1),this._card=n}render(){const e=this._visible?this._card:void 0;return s.qy`<div class="box" aria-hidden="true">${e??s.qy`<ha-icon icon=${this.entry?.icon??""}></ha-icon>`}</div>`}};By.styles=[vs,s.AH`
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
    `],Fy([(0,r.MZ)({attribute:!1})],By.prototype,"entry",void 0),Fy([(0,r.MZ)({attribute:!1})],By.prototype,"hass",void 0),Fy([(0,r.wk)()],By.prototype,"_visible",void 0),By=Fy([(0,r.EM)("mc-anim-icon-thumb")],By);const Iy={alarm_control_panel:43,binary_sensor:86,button:113,calendar:114,camera:115,climate:157,cover:195,device_tracker:239,event:308,fan:320,humidifier:370,lawn_mower:403,light:417,lock:428,media_player:441,person:651,plant:662,sensor:793,siren:826,sun:909,switch:912,timer:1004,vacuum:1061,valve:1069,weather:1072,zone:1083},Zy=(e,t)=>t?.localize?.(`component.${e}.title`)||(void 0!==Iy[e]?Gn(Iy[e]):null)||e.replace(/_/g," ").replace(/^./,e=>e.toUpperCase());let Wy=class extends s.WF{constructor(){super(...arguments),this.lookup=()=>{},this._icon="mdi:bell-ring",this._query="",this._domain="",this._busy=!1,this._error="",this._lib=Dy,this._libFailed=!1}connectedCallback(){super.connectedCallback(),this._lib||this._loadLibrary(),ks("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}async _loadLibrary(){this._libFailed=!1;try{this._lib=await Ty()}catch{this._libFailed=!0}}_emit(e,t){this.dispatchEvent(new CustomEvent("icon-start",{detail:{doc:e,from:t},bubbles:!0,composed:!0}))}async start(){const e=this._icon.trim();if(pt.test(e)){this._busy=!0,this._error="";try{const t=this._lib??await Ty().catch(()=>{}),i=t?.mdiGeometry(e)??await ov(e);if(!i)return void(this._error=Gn(991));const n=Gn(1218,{name:Py(e)}),s=(0,Ry.a)(e,i,e.slice(e.indexOf(":")+1),n,{embed:!0});if(!s.rig?.parts.length)return void(this._error=Gn(992));this._emit(s,"icon")}finally{this._busy=!1}}else this._error=Gn(654)}focusStart(){const e=this.renderRoot.querySelector("mc-icon-picker, .icon-input");(e?.shadowRoot?.querySelector("input")??e)?.focus({preventScroll:!0})}_renderPick(){const e=ks("mc-icon-picker");return s.qy`<section class="pick" aria-labelledby="is-pick">
      <h3 id="is-pick">${Gn(876)}</h3>
      <p class="help">${Gn(949)}</p>
      <div class="pick-row">
        <div class="field grow">
          ${e?s.qy`<mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${Gn(371)}
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._error=""}}
              ></mc-icon-picker>`:s.qy`<input
                class="input mono icon-input"
                aria-label=${Gn(371)}
                spellcheck="false"
                .value=${D(this._icon)}
                @input=${e=>{this._icon=e.target.value,this._error=""}}
                @keydown=${e=>"Enter"===e.key&&void this.start()}
              />`}
        </div>
        <button type="button" class="btn btn-primary btn-sm start" ?disabled=${this._busy} @click=${()=>{this.start()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?Gn(862):Gn(857)}
        </button>
      </div>
      ${this._error?s.qy`<p class="help error" role="alert">${this._error}</p>`:s.s6}
    </section>`}_renderLibrary(){const e=this._lib,t=s.qy`<div class="lib-head">
      <h3 id="is-lib">${Gn(611)}</h3>
      ${e?s.qy`<span class="chip is-count">${e.ICON_LIBRARY.length}</span>`:s.s6}
    </div>`;if(!e)return s.qy`<section class="lib" aria-labelledby="is-lib">
        ${t}
        ${this._libFailed?s.qy`<p class="help error lib-error" role="alert">${Gn(950)}</p>
              <div><button type="button" class="btn btn-secondary btn-sm lib-retry" @click=${()=>{this._loadLibrary()}}><ha-icon icon="mdi:refresh"></ha-icon>${Gn(1018)}</button></div>`:s.qy`<p class="help lib-loading" role="status">${Gn(425)}</p>`}
      </section>`;const i=e.searchLibrary(this._query,this._domain||void 0);return s.qy`<section class="lib" aria-labelledby="is-lib">
      ${t}
      <div class="filters">
        <div class="with-icon grow">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input lib-search"
            type="search"
            placeholder=${Gn(775)}
            aria-label=${Gn(777)}
            .value=${D(this._query)}
            @input=${e=>this._query=e.target.value}
          />
        </div>
        <select class="input domain" aria-label=${Gn(242)} .value=${D(this._domain)} @change=${e=>this._domain=e.target.value}>
          <option value="">${Gn(45)}</option>
          ${[...e.LIBRARY_DOMAINS].sort((e,t)=>Zy(e,this.hass).localeCompare(Zy(t,this.hass))).map(e=>s.qy`<option value=${e} ?selected=${e===this._domain}>${Zy(e,this.hass)}</option>`)}
        </select>
      </div>
      ${i.length?s.qy`<ul class="grid" role="list">
            ${i.map(t=>s.qy`<li>
                <button type="button" class="entry" data-id=${t.id} title="${t.name} (${t.icon})" @click=${()=>this._emit({...t.build(),...t.mirror?{mirror:t.mirror}:{}},"library")}>
                  <mc-anim-icon-thumb .entry=${t} .hass=${this.hass}></mc-anim-icon-thumb>
                  ${e.isNewInRelease(t.id)?s.qy`<span class="new-mark" aria-hidden="true"></span><span class="sr-only">${Gn(539)}</span>`:s.s6}
                  <span class="nm">${t.name}</span>
                  <span class="dm">${Zy(t.domain,this.hass)}</span>
                  ${(()=>{const i=e.mirrorBadge(t.mirror);return s.qy`<span class="mirror-badge ${i.unset?"is-unset":""}">${i.label}</span>`})()}
                </button>
              </li>`)}
          </ul>`:s.qy`<p class="help no-results">${Gn(556,{query:this._query})}</p>`}
    </section>`}render(){return s.qy`${this._renderPick()} ${this._renderLibrary()}`}};Wy.styles=[vs,bs,s.AH`
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
        position: relative;
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
        outline: 2px solid var(--mc-accent-ink, #01579b);
        outline-offset: 2px;
      }
      .new-mark {
        position: absolute;
        top: 6px;
        right: 6px;
        inset-inline: auto 6px;
        width: 8px;
        height: 8px;
        background: var(--mc-accent-ink, #01579b);
        box-shadow: 0 0 0 1.5px var(--mc-surface, var(--card-background-color, #fff));
        transform: rotate(45deg);
      }
      @media (forced-colors: active) {
        .new-mark {
          background: CanvasText;
        }
      }
      .mirror-badge {
        font-size: 0.6875rem;
        color: var(--mc-text-secondary, var(--secondary-text-color, #727272));
      }
      .mirror-badge.is-unset {
        padding: 0 6px;
        border-radius: 999px;
        font-weight: 600;
        color: var(--mc-accent-ink, #01579b);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 16%, transparent);
        outline: 1px solid currentColor;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
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
    `],Fy([(0,r.MZ)({attribute:!1})],Wy.prototype,"hass",void 0),Fy([(0,r.MZ)({attribute:!1})],Wy.prototype,"lookup",void 0),Fy([(0,r.wk)()],Wy.prototype,"_icon",void 0),Fy([(0,r.wk)()],Wy.prototype,"_query",void 0),Fy([(0,r.wk)()],Wy.prototype,"_domain",void 0),Fy([(0,r.wk)()],Wy.prototype,"_busy",void 0),Fy([(0,r.wk)()],Wy.prototype,"_error",void 0),Fy([(0,r.wk)()],Wy.prototype,"_lib",void 0),Fy([(0,r.wk)()],Wy.prototype,"_libFailed",void 0),Wy=Fy([(0,r.EM)("mc-anim-icon-start")],Wy),function(e){um=e}(pd),function(e,t){Ge.particles=e,Ge.checkSim=t,Ge.epoch++}(hd,pd.validateSim);const Ky=[["magic-card-animation-studio",Kp],["mcas-stage",ep],["mcas-thumb",Gp],["mc-preset-grid",up],["mc-preset-thumb",hp]];for(const[e,t]of Ky)customElements.get(e)||customElements.define(e,t)})();