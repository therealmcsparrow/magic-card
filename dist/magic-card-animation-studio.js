(()=>{"use strict";var e={3682(e,t,i){const n={colour:"color",centre:"center",grey:"gray",metre:"meter",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"};i.d(t,["A",0,e=>e.toLowerCase().replace(/colour|centre|grey|metre|customis|behaviour|favourite|maximis|minimis|organis/g,e=>n[e])])},201(e,t,i){var n=i(4753);const{t:s,tc:a,tx:r,m:o,locale:l,ready:c}=(0,n._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,c,"H",0,l,"t",0,s])},4753(e,t,i){var n=i(2016);const s=["en-GB","en-US","nl"];let a,r=0;const o={},l=e=>o[e]||=(console.debug("[i18n] "+e),1),c=e=>(0,n.ZV)(a,e),d=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,p=/\{((?:[^{}]|\{[^{}]*\})*)\}/,h=(e,t,i)=>e.split(d).flatMap((e,n)=>{if(!(1&n))return void 0===i?e:e.replace(/#/g,c(i));const a=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(e);if(!a)throw 0;const o=t[a[1]];if(void 0===o&&l("missing "+a[1]),!a[2])return"object"==typeof o?[o]:void 0===o?"":"number"==typeof o?c(o):o;const d=a[3].split(p),u="plural"==a[2],m=e=>d[d.findIndex((t,i)=>!(1&i)&&t.trim()==e)+1||-1],g=m("="+o)??m(u?new Intl.PluralRules(s[r]).select(+o):String(o))??m("other");if(void 0===g)throw 0;return h(g,t,u?+o:void 0)}).filter(String),u=(e,t)=>{const i=[],n=e=>i[e]||=t()[e].split("|");let a;const o=(i,s="",o=r)=>{if(!t())return l("not ready "+e),"";const c="number"==typeof i?i:(a||=new Map(n(0).map((e,t)=>[e,t]))).get(s?s+""+i:i)??-1;return c<0?(l("unknown "+i),String(i)):o&&n(o)[c]||(n(0)[c]??"").slice(s?s.length+1:0)},c=(e,t={},i)=>{try{return h(o(e,i),t)}catch{return l("malformed "+e),[o(e,i,0)]}};return{ns:e,locale:()=>s[r],t:(e,t)=>c(e,t).join(""),tc:(e,t,i)=>c(t,i,e).join(""),tx:(e,t)=>c(e,t),m:e=>e}};i.d(t,["Zc",0,e=>{a=e;const t=(e=>{const t=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((e||"").toLowerCase());return t?"nl"==t[1]?"nl":t[3]?"en-GB":"en-US":"en-GB"})(e?.locale?.language||e?.language||globalThis.navigator?.language);return r=s.indexOf(t),t},"_H",0,(e,t)=>{let i,n;return{...u(e,()=>i),ready:()=>n||=t().then(e=>(i=e.default,!0),()=>(n=void 0,!1))}},"my",0,(e,t)=>u(e,()=>t)])},1474(e,t,i){i.d(t,{a:()=>a,dI:()=>o});var n=i(9489),s=i(201);function a(e,t,i,a,o={}){const l=(0,n.WP)(t).slice(0,64).map((e,t)=>({id:`part-${t+1}`,name:(0,s.t)(348,{n:t+1}),from:[e.index]})),c=o.embed?function(e){const t=(t,i)=>e.evenodd?.[t]?.includes(i)?' fill-rule="evenodd"':"",i=[...(e.secondary??[]).map((e,i)=>`<path class="mc-accent" d="${r(e)}"${t("accent",i)}/>`),...e.paths.map((e,i)=>`<path d="${r(e)}"${t("paths",i)}/>`),...(e.strokes??[]).map(e=>`<path${e.accent?' class="mc-accent"':""} d="${r(e.d)}" fill="none" stroke="currentColor" stroke-width="${e.width}"${e.cap?` stroke-linecap="${r(e.cap)}"`:""}${e.join?` stroke-linejoin="${r(e.join)}"`:""}/>`)],n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(e.viewBox||"0 0 24 24")}">${i.join("")}</svg>`;return("undefined"!=typeof TextEncoder?(new TextEncoder).encode(n).length:n.length)>32768?void 0:n}(t):void 0;return{id:i,name:a,kind:"keyframes",duration:2,easing:"ease-in-out",iterations:"infinite",target:"icon",origin:"center",version:1,keyframes:[{at:0,opacity:1}],rig:c?{svg:c,parts:l}:{icon:e,parts:l}}}const r=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function o(e,t="center"){const[i,n,s,a]=e,r=/left/.test(t)?0:/right/.test(t)?1:.5,o=/top/.test(t)?0:/bottom/.test(t)?1:.5,l=e=>Math.round(100*e)/100;return[l(i+s*r),l(n+a*o)]}i.d(t,["jo",0,(e,t)=>(0,n.Zg)(t.map(t=>e[t]?.bbox).filter(e=>!!e))])},5084(e,t,i){i.d(t,{Cq:()=>b,Z3:()=>x,ar:()=>A,di:()=>j});var n=i(9489),s=i(1474);const a=(e,t,i,n,s,a)=>({id:e,label:t,min:i,max:n,step:s,default:a}),r=(e=100)=>({...a("share",169,10,100,5,e),unit:"%"}),o=()=>({...a("delay",135,0,90,5,0),unit:"%"}),l=()=>a("intensity",259,.25,3,.25,1),c=()=>a("direction",140,-1,1,2,1),d=(e=100)=>[r(e),o(),l(),c()],p=e=>Math.round(1e3*e)/1e3||0,h=(e,t,i="ease-in-out")=>({t:e,k:{transform:{rotate:p(t)},easing:i}}),u=(e,t,i={},n="ease-in-out")=>{const s={};for(const[e,i]of Object.entries(t))s[e]=p(i);return{t:e,k:{transform:s,...i,easing:n}}},m=(e,t)=>e.map(([e,i])=>h(e,t*i)),g=[{id:"swing",name:472,icon:"mdi:metronome",pivot:"top",help:475,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,1],[.4,-.8],[.6,.5],[.8,-.25],[1,0]],14*e*t)},{id:"ring",name:389,icon:"mdi:bell-ring-outline",pivot:"top",help:393,params:d(70),gen:({intensity:e,direction:t})=>m([[0,0],[.08,1],[.18,-.95],[.28,.85],[.38,-.72],[.48,.58],[.58,-.44],[.68,.3],[.78,-.16],[.88,.06],[1,0]],16*e*t)},{id:"spin",name:445,icon:"mdi:rotate-right",pivot:"center",help:527,params:[r(),o(),a("intensity",526,1,5,1,1),c()],gen:({intensity:e,direction:t})=>[h(0,0,"linear"),h(1,360*Math.max(1,Math.round(e))*t,"linear")]},{id:"pulse",name:368,icon:"mdi:heart-pulse",pivot:"center",help:231,params:d(),gen:({intensity:e,direction:t})=>[u(0,{scale:1}),u(.5,{scale:1+.15*e*t}),u(1,{scale:1})]},{id:"bounce",name:88,icon:"mdi:debug-step-over",pivot:"bottom",help:453,params:d(),gen:({intensity:e,direction:t})=>{const i=-3*e*t;return[u(0,{y:0,scale_x:1,scale_y:1},{},"ease-out"),u(.12,{y:0,scale_x:1.08,scale_y:.9},{},"ease-out"),u(.45,{y:i,scale_x:.96,scale_y:1.06},{},"ease-in"),u(.75,{y:0,scale_x:1.06,scale_y:.92},{},"ease-out"),u(.88,{y:0,scale_x:.98,scale_y:1.02}),u(1,{y:0,scale_x:1,scale_y:1})]}},{id:"shake",name:416,icon:"mdi:vibrate",help:419,params:d(60),gen:({intensity:e,direction:t})=>{const i=1.2*e*t;return[0,-1,1,-1,1,-.6,.6,-.3,.3,0].map((e,t,n)=>u(t/(n.length-1),{x:i*e}))}},{id:"wobble",name:556,icon:"mdi:rotate-3d-variant",pivot:"bottom",help:396,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,-1],[.3,.75],[.45,-.5],[.6,.3],[.75,-.15],[1,0]],8*e*t)},{id:"blink",name:65,icon:"mdi:eye-outline",help:66,params:[r(),o(),l()],gen:({intensity:e})=>{const t=p(Math.max(0,1-.9*e));return[1,t,1,t,1,1].map((e,t)=>({t:[0,.1,.2,.3,.4,1][t],k:{opacity:e,easing:"linear"}}))}},{id:"fade",name:183,icon:"mdi:circle-opacity",help:185,params:[r(),o(),l()],gen:({intensity:e})=>[{t:0,k:{opacity:1,easing:"ease-in-out"}},{t:.5,k:{opacity:p(Math.max(0,1-.8*e)),easing:"ease-in-out"}},{t:1,k:{opacity:1,easing:"ease-in-out"}}]},...[["slide-up",429,313,"mdi:arrow-up","y",-1],["slide-down",426,310,"mdi:arrow-down","y",1],["slide-left",427,311,"mdi:arrow-left","x",-1],["slide-right",428,312,"mdi:arrow-right","x",1]].map(([e,t,i,n,s,a])=>({id:e,name:t,icon:n,help:i,params:d(),gen:({intensity:e,direction:t})=>{const i=3*e*t*a;return[u(0,{[s]:0}),u(.4,{[s]:i}),u(.6,{[s]:i}),u(1,{[s]:0})]}})),{id:"draw-on",name:160,icon:"mdi:draw",draws:!0,help:161,params:[r(60),o(),c()],gen:({direction:e})=>[{t:0,k:{draw:e>0?0:1,easing:"ease-in-out"}},{t:1,k:{draw:e>0?1:0,easing:"ease-in-out"}}]},{id:"draw-loop",name:159,icon:"mdi:draw-pen",draws:!0,help:162,params:[r(),o()],gen:()=>[{t:0,k:{draw:0,easing:"ease-in-out"}},{t:.45,k:{draw:1,easing:"ease-in-out"}},{t:.7,k:{draw:1,easing:"ease-in-out"}},{t:1,k:{draw:0,easing:"ease-in-out"}}]},{id:"pop",name:359,icon:"mdi:star-four-points-outline",pivot:"center",help:360,params:[r(50),o(),l()],gen:({intensity:e})=>[u(0,{scale:0},{opacity:0},"ease-out"),u(.6,{scale:1+.2*e},{opacity:1},"ease-in-out"),u(1,{scale:1},{opacity:1})]},{id:"float",name:206,icon:"mdi:waves-arrow-up",help:163,params:d(),gen:({intensity:e,direction:t})=>[u(0,{y:0}),u(.5,{y:-1.5*e*t}),u(1,{y:0})]},{id:"flicker",name:203,icon:"mdi:fire",pivot:"bottom",help:204,params:[r(),o(),l()],gen:({intensity:e})=>[[0,1,1,0],[.12,1.08,.85,2],[.25,.96,1,-1.5],[.4,1.1,.9,1],[.55,.97,1,-2],[.7,1.06,.85,1.5],[.85,.98,1,-.5],[1,1,1,0]].map(([t,i,n,s])=>u(t,{scale_y:1+(i-1)*e,skew_x:s*e},{opacity:p(1-(1-n)*Math.min(e,1))}))},{id:"wave",name:546,icon:"mdi:wifi",pivot:"center",help:284,params:d(),gen:({intensity:e})=>{const t=p(Math.max(0,1-.7*Math.min(e,1.4))),i=p(1-.08*e);return[u(0,{scale:i},{opacity:t}),u(.35,{scale:1+.04*e},{opacity:1}),u(.7,{scale:i},{opacity:t}),u(1,{scale:i},{opacity:t})]}}],f=g.map(({gen:e,...t})=>t),v=new Map(g.map(e=>[e.id,e]));function b(e,t={}){const i=v.get(e),n={};for(const e of i?.params??[]){const i=t[e.id];n[e.id]="number"==typeof i&&Number.isFinite(i)?Math.min(e.max,Math.max(e.min,i)):e.default}return n}const y=e=>Math.round(100*e)/100;function x(e,t={}){const i=b(e,t),n=i.delay??0;return _(e,i,n,Math.min(100,n+(i.share??100)))}function _(e,t,i,n){const s=v.get(e);return s?function(e,t,i){const n=i-t,s=e=>{const t={...e};return delete t.easing,t},a=[],r=e=>{const t=a.findIndex(t=>t.at===e.at);t>=0?a[t]={...a[t],...e}:a.push(e)};t>0&&r({at:0,...s(e[0].k)});for(const i of e)r({at:y(t+i.t*n),...i.k});return i<100&&r({at:100,...s(e[e.length-1].k)}),a.sort((e,t)=>e.at-t.at)}(s.gen({intensity:t.intensity??1,direction:(t.direction??1)<0?-1:1}),i,Math.max(n,i+1)):[]}const $=e=>/^(part|group|shape):/.test(e),w=e=>e.slice(e.indexOf(":")+1);function k(e,t){const i=w(t);return t.startsWith("part:")?!!e?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e?.groups?.some(e=>e.id===i):t.startsWith("shape:")?!!e?.shapes?.some(e=>e.id===i):["element","icon","name","state","background"].includes(t)}function M(e,t,i){const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s<0&&n.length>=24)return;const a=s>=0?{...n[s],keyframes:i}:{target:t,keyframes:i};return s>=0?n[s]=a:n.push(a),{...e,tracks:n}}function S(e,t,i,a){if(!(i&&a&&e.rig&&$(t)))return e;const r=function(e,t,i){const a=e.rig,r=w(t);if(t.startsWith("shape:")){const e=a?.shapes?.find(e=>e.id===r);return e?(0,n.hd)(e.d):void 0}const o=t.startsWith("group:")?a?.groups?.find(e=>e.id===r)?.parts??[]:[r];return(0,s.jo)(i,o.flatMap(e=>a?.parts.find(t=>t.id===e)?.from??[]))}(e,t,a);if(!r)return e;const[o,l]=(0,s.dI)(r,i),c=`${o}px ${l}px`;return{...e,tracks:(e.tracks??[]).map(e=>e.target===t?{...e,origin:c}:e)}}function C(e,t,i,n){const s=v.get("wave").pivot;return function(e,t){const i=b("wave",e),n=i.delay,s=Math.max(1,Math.min(i.share,100-n)),a=t>1?.6*s:s,r=t>1?(s-a)/(t-1):0;return Array.from({length:t},(e,t)=>[n+t*r,n+t*r+a])}(i,t.length).reduce((e,[a,r],o)=>{const l=M(e,t[o],_("wave",i,a,r));return l?S(l,t[o],s,n.pieces):e},e)}function A(e,t,i,n,s={}){if(t.length<2||"wave"!==i)return t.reduce((e,t)=>function(e,t,i,n,s={}){const a=v.get(i);if(!a||"keyframes"!==e.kind||!k(e.rig,t))return e;if(a.draws&&!$(t))return e;const r=b(i,n);if("wave"===i&&t.startsWith("group:")){let i=e.rig?.groups?.find(e=>e.id===w(t))?.parts??[];r.direction<0&&(i=[...i].reverse());const n={...e,tracks:(e.tracks??[]).filter(e=>e.target!==t)};return n.tracks.length||delete n.tracks,C(n,i.map(e=>`part:${e}`),r,s)}const o=M(e,t,x(i,r));return o?S(o,t,a.pivot,s.pieces):e}(e,t,i,n,s),e);const a=b(i,n),r=(a.direction<0?[...t].reverse():t).filter(t=>k(e.rig,t));return C(e,r,a,s)}function j(e,t){const i=(e.tracks??[]).flatMap(e=>e.target!==t?[e]:e.path?[{...e,keyframes:[]}]:[]),n={...e,tracks:i};return i.length||delete n.tracks,n}i.d(t,["tP",0,f])},9489(e,t,i){i.d(t,{WP:()=>p,Zg:()=>h,hd:()=>u});var n=i(1771);function s(e){const t=e.length?[e[0][0]]:[];for(const[i,n,s,a]of e)for(let e=1;e<=8;e++){const r=e/8,o=1-r,l=o*o*o,c=3*o*o*r,d=3*o*r*r,p=r*r*r;t.push([l*i[0]+c*n[0]+d*s[0]+p*a[0],l*i[1]+c*n[1]+d*s[1]+p*a[1]])}return t}function a(e){let t=0;for(let i=0;i<e.length;i++){const[n,s]=e[i],[a,r]=e[(i+1)%e.length];t+=n*r-a*s}return t/2}function r(e){if(!e.length)return[0,0,0,0];let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const[a,r]of e)a<t&&(t=a),r<i&&(i=r),a>n&&(n=a),r>s&&(s=r);const a=e=>+e.toFixed(3);return[a(t),a(i),a(n-t),a(s-i)]}function o(e,t){let i=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const[a,r]=t[n],[o,l]=t[s];r>e[1]!=l>e[1]&&e[0]<(o-a)*(e[1]-r)/(l-r)+a&&(i=!i)}return i}function l(e,t){if(!((e,t,i=.001)=>e[0]>=t[0]-i&&e[1]>=t[1]-i&&e[0]+e[2]<=t[0]+t[2]+i&&e[1]+e[3]<=t[1]+t[3]+i)(t.box,e.box))return!1;const i=t.poly,n=Math.max(1,Math.floor(i.length/16));let s=0,a=0;for(let t=0;t<i.length;t+=n)s++,o(i[t],e.poly)&&a++;return s>0&&a/s>=.6}const c=1e-6,d=(e,t)=>({index:e,d:(0,n.ER)(t),bbox:r(t.flatMap(s))});function p(e){const t=[],i=e=>t.push({...e,index:t.length}),o=(t,i)=>!!e.evenodd?.[t]?.includes(i),p=e=>e?{evenodd:!0}:{},h=e=>(0,n.Mj)(e).filter(e=>Math.abs(a(s(e)))>c);if((e.secondary??[]).forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),secondary:!0,...p(o("accent",t))})}),1===e.paths.length){const t=o("paths",0);for(const o of function(e,t=!1){const i=(0,n.Mj)(e).map(e=>{const t=s(e);return{cubics:e,poly:t,area:a(t),box:r(t)}}).filter(e=>Math.abs(e.area)>c),o=i.map((e,t)=>t),d=i.map((e,t)=>t).sort((e,t)=>Math.abs(i[t].area)-Math.abs(i[e].area)||e-t);d.forEach((e,n)=>{let s=-1,a=0,r=0;for(let t=0;t<n;t++){const n=d[t];Math.abs(i[n].area)<=Math.abs(i[e].area)||l(i[n],i[e])&&(a+=Math.sign(i[n].area),r++,(s<0||Math.abs(i[n].area)<Math.abs(i[s].area))&&(s=n))}const c=t?r%2==1:0!==a&&a+Math.sign(i[e].area)===0;s>=0&&c&&(o[e]=o[s])});const p=new Map;return o.forEach((e,t)=>{const i=p.get(e);i?i.push(t):p.set(e,[t])}),[...p.values()].sort((e,t)=>e[0]-t[0]).map(e=>e.map(e=>i[e].cubics))}(e.paths[0],t))i({...d(0,o),...p(t)})}else e.paths.forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),...p(o("paths",t))})});for(const t of e.strokes??[]){const e=(0,n.Mj)(t.d);e.length&&i({...d(0,e),stroke:{width:t.width,...t.cap?{cap:t.cap}:{},...t.join?{join:t.join}:{}},...t.accent?{secondary:!0}:{}})}return t}function h(e){if(!e.length)return;const t=Math.min(...e.map(e=>e[0])),i=Math.min(...e.map(e=>e[1])),n=Math.max(...e.map(e=>e[0]+e[2])),s=Math.max(...e.map(e=>e[1]+e[3])),a=e=>+e.toFixed(3);return[a(t),a(i),a(n-t),a(s-i)]}function u(e){return r((0,n.Mj)(e).flatMap(s))}},1771(e,t,i){i.d(t,{ER:()=>v,Rr:()=>p,fs:()=>g,uD:()=>m});const n=1e-6,s=(e,t)=>Math.abs(e[0]-t[0])<n&&Math.abs(e[1]-t[1])<n,a=(e,t,i)=>e+(t-e)*i,r=(e,t,i)=>[a(e[0],t[0],i),a(e[1],t[1],i)],o=(e,t,i)=>({c1:[e[0]+2/3*(t[0]-e[0]),e[1]+2/3*(t[1]-e[1])],c2:[i[0]+2/3*(t[0]-i[0]),i[1]+2/3*(t[1]-i[1])],to:i}),l=/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;class c{constructor(e){this.d=e,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const e=this.d[this.i];if(e&&/[MmLlHhVvCcSsQqTtAaZz]/.test(e))return this.i++,e}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip(),l.lastIndex=this.i;const e=l.exec(this.d);if(!e)throw new Error(`Bad path number at ${this.i}`);return this.i+=e[0].length,Number(e[0])}flag(){this.skip();const e=this.d[this.i];if("0"!==e&&"1"!==e)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===e?1:0}}function d(e,t,i,a,r,o,l){if(s(e,l))return[];if(t=Math.abs(t),i=Math.abs(i),t<n||i<n)return[{to:l}];const c=a*Math.PI/180,d=Math.cos(c),p=Math.sin(c),h=(e[0]-l[0])/2,u=(e[1]-l[1])/2,m=d*h+p*u,g=-p*h+d*u,f=m*m/(t*t)+g*g/(i*i);if(f>1){const e=Math.sqrt(f);t*=e,i*=e}const v=t*t*i*i-t*t*g*g-i*i*m*m,b=t*t*g*g+i*i*m*m;let y=Math.sqrt(Math.max(0,v/b));r===o&&(y=-y);const x=y*t*g/i,_=-y*i*m/t,$=d*x-p*_+(e[0]+l[0])/2,w=p*x+d*_+(e[1]+l[1])/2,k=(e,t,i,n)=>Math.atan2(e*n-t*i,e*i+t*n),M=(m-x)/t,S=(g-_)/i,C=(-m-x)/t,A=(-g-_)/i,j=k(1,0,M,S);let z=k(M,S,C,A);!o&&z>0?z-=2*Math.PI:o&&z<0&&(z+=2*Math.PI);const E=Math.max(1,Math.ceil(Math.abs(z)/(Math.PI/2)-1e-9)),V=z/E,L=4/3*Math.tan(V/4),P=e=>[$+t*Math.cos(e)*d-i*Math.sin(e)*p,w+t*Math.cos(e)*p+i*Math.sin(e)*d],D=e=>[-t*Math.sin(e)*d-i*Math.cos(e)*p,-t*Math.sin(e)*p+i*Math.cos(e)*d],H=[];let R=e;for(let e=0;e<E;e++){const t=j+e*V,i=t+V,n=e===E-1?l:P(i),s=D(t),a=D(i);H.push({c1:[R[0]+L*s[0],R[1]+L*s[1]],c2:[n[0]-L*a[0],n[1]-L*a[1]],to:n}),R=n}return H}function p(e){const t=new c(e),i=[];let n,a,r,l,p=[0,0],h=[0,0];const u=e=>{n||(n={start:p,segs:[],closed:!1},i.push(n),h=p),n.segs.push(e)};try{for(;!t.done();){const e=t.command();if(e)l=e;else{if(!l||!t.hasNumber())break;"M"===l?l="L":"m"===l&&(l="l")}const i=l===l.toLowerCase(),c=i?p[0]:0,m=i?p[1]:0,g=()=>[t.number()+c,t.number()+m];let f,v,b;switch(l.toUpperCase()){case"M":p=g(),h=p,n=void 0;break;case"L":u({to:b=g()});break;case"H":u({to:b=[t.number()+c,p[1]]});break;case"V":u({to:b=[p[0],t.number()+m]});break;case"C":{const e=g();f=g(),u({c1:e,c2:f,to:b=g()});break}case"S":{const e=a?[2*p[0]-a[0],2*p[1]-a[1]]:p;f=g(),u({c1:e,c2:f,to:b=g()});break}case"Q":v=g(),u(o(p,v,b=g()));break;case"T":v=r?[2*p[0]-r[0],2*p[1]-r[1]]:p,u(o(p,v,b=g()));break;case"A":{const e=t.number(),i=t.number(),n=t.number(),s=t.flag(),a=t.flag();b=g(),d(p,e,i,n,s,a,b).forEach(u);break}case"Z":n&&n.segs.length&&(s(p,h)||n.segs.push({to:h}),n.closed=!0),p=h,n=void 0,l=void 0}b&&(p=b),a=f,r=v}}catch{}return i.filter(e=>e.segs.length>0)}const h=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},u=e=>`${h(e[0])} ${h(e[1])}`;function m(e){return e.map(e=>{const t=e.segs.slice(),i=t[t.length-1];return e.closed&&i&&!i.c1&&s(i.to,e.start)&&t.length>1&&t.pop(),[`M${u(e.start)}`,...t.map(e=>e.c1&&e.c2?`C${u(e.c1)} ${u(e.c2)} ${u(e.to)}`:`L${u(e.to)}`),...e.closed?["Z"]:[]].join(" ")}).join(" ")}function g(e,t){const[i,n,s,a]=e,o=r(i,n,t),l=r(n,s,t),c=r(s,a,t),d=r(o,l,t),p=r(l,c,t),h=r(d,p,t);return[[i,o,d,h],[h,p,c,a]]}const f=e=>{const t=Math.round(1e3*e)/1e3;return String(Object.is(t,-0)?0:t)};function v(e){return e.map(e=>{if(!e.length)return"";const t=e=>`${f(e[0])} ${f(e[1])}`,i=e.map(e=>`C${t(e[1])} ${t(e[2])} ${t(e[3])}`).join("");return`M${t(e[0][0])}${i}${(e=>e.length>1&&s(e[0][0],e[e.length-1][3]))(e)?"Z":""}`}).join("")}i.d(t,["Mj",0,e=>function(e){return e.map(e=>{let t=e.start;return e.segs.map(e=>{const i=((e,t)=>t.c1&&t.c2?[e,t.c1,t.c2,t.to]:((e,t)=>[e,r(e,t,1/3),r(e,t,2/3),t])(e,t.to))(t,e);return t=e.to,i})})}(p(e))])},1235(e,t,i){i.d(t,{t:()=>s});const n="2026.10.12-beta.6";function s(e,t){if(t?.BUILD===n)return t;console.warn(`Magic Card was updated, reload the page (magic-card.js ${n}, ${e} ${String(t?.BUILD)}).`)}i.d(t,["Q",0,n])},2016(e,t,i){function n(e,t,i=1){const n={maximumFractionDigits:i};"none"===e?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(function(e){switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return function(e){return e?.locale?.language||e?.language||void 0}(e)}}(e),n).format(t)}catch{return String(t)}}i.d(t,{ZV:()=>n})}};const t={};function i(n){const s=t[n];if(void 0!==s)return s.exports;const a=t[n]={exports:{}};return e[n](a,a.exports,i),a.exports}if(i.m=e,i.d=(e,t)=>{if(Array.isArray(t))for(var n=0;n<t.length;){var s=t[n++],a=t[n++],r=0===a?{enumerable:!0,value:t[n++]}:{enumerable:!0,get:a};i.o(e,s)||Object.defineProperty(e,s,r)}else for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.f={},i.e=e=>{const t=[];return i.f.j(e,t),Promise.all(t)},i.u=e=>"magic-card-"+{249:"i18n-labels",334:"icon-library",342:"i18n-icons",494:"preset-catalogue"}[e]+"."+{249:"41cfb442",334:"907cb790",342:"af267976",494:"1a9bcedc"}[e]+".js",i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="",(()=>{const e={126:0,885:0},t=t=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:s,__webpack_esm_runtime__:a}=t;var r,o,l=0;for(r in s)i.o(s,r)&&(i.m[r]=s[r]);for(a&&a(i);l<n.length;l++)o=n[l],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0};i.f.j=(n,s)=>{let a=i.o(e,n)?e[n]:void 0;if(0!==a)if(a)s.push(a[1]);else{let r=import(i.p+i.u(n)).then(t,t=>{throw 0!==e[n]&&(e[n]=void 0),t});r=Promise.race([r,new Promise(t=>a=e[n]=[t])]),s.push(a[1]=r)}}})(),"undefined"!=typeof location){const e=function(e,t){try{const i=new URL(e);return i.protocol===t.protocol&&i.host===t.host?new URL(".",i).href:""}catch{return""}}(import.meta.url,location);e&&(i.p=e)}const n=globalThis,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),r=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new o("string"==typeof e?e:e+"",void 0,a),c=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,a)},d=(e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=n.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}},p=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return l(t)})(e):e,{is:h,defineProperty:u,getOwnPropertyDescriptor:m,getOwnPropertyNames:g,getOwnPropertySymbols:f,getPrototypeOf:v}=Object,b=globalThis,y=b.trustedTypes,x=y?y.emptyScript:"",_=b.reactiveElementPolyfillSupport,$=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?x:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},k=(e,t)=>!h(e,t),M={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=M){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&u(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const a=n?.call(this);s?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??M}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const e=v(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const e=this.properties,t=[...g(e),...f(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=n;const a=s.fromAttribute(t,e.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const a=this.constructor;if(!1===n&&(s=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??k)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==s||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[$("elementProperties")]=new Map,S[$("finalized")]=new Map,_?.({ReactiveElement:S}),(b.reactiveElementVersions??=[]).push("2.1.2");const C=globalThis,A=e=>e,j=C.trustedTypes,z=j?j.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",V=`lit$${Math.random().toFixed(9).slice(2)}$`,L="?"+V,P=`<${L}>`,D=document,H=()=>D.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,O=e=>N(e)||"function"==typeof e?.[Symbol.iterator],T="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,B=/>/g,q=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),K=/'/g,U=/"/g,G=/^(?:script|style|textarea|title)$/i,W=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),Z=W(1),Y=W(2),X=W(3),J=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),ee=new WeakMap,te=D.createTreeWalker(D,129);function ie(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const ne=(e,t)=>{const i=e.length-1,n=[];let s,a=2===t?"<svg>":3===t?"<math>":"",r=F;for(let t=0;t<i;t++){const i=e[t];let o,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===F?"!--"===l[1]?r=I:void 0!==l[1]?r=B:void 0!==l[2]?(G.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=q):void 0!==l[3]&&(r=q):r===q?">"===l[0]?(r=s??F,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,o=l[1],r=void 0===l[3]?q:'"'===l[3]?U:K):r===U||r===K?r=q:r===I||r===B?r=F:(r=q,s=void 0);const p=r===q&&e[t+1].startsWith("/>")?" ":"";a+=r===F?i+P:c>=0?(n.push(o),i.slice(0,c)+E+i.slice(c)+V+p):i+V+(-2===c?t:p)}return[ie(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class se{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,a=0;const r=e.length-1,o=this.parts,[l,c]=ne(e,t);if(this.el=se.createElement(l,i),te.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=te.nextNode())&&o.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(E)){const t=c[a++],i=n.getAttribute(e).split(V),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?ce:"?"===r[1]?de:"@"===r[1]?pe:le}),n.removeAttribute(e)}else e.startsWith(V)&&(o.push({type:6,index:s}),n.removeAttribute(e));if(G.test(n.tagName)){const e=n.textContent.split(V),t=e.length-1;if(t>0){n.textContent=j?j.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],H()),te.nextNode(),o.push({type:2,index:++s});n.append(e[t],H())}}}else if(8===n.nodeType)if(n.data===L)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(V,e+1));)o.push({type:7,index:s}),e+=V.length-1}s++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function ae(e,t,i=e,n){if(t===J)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const a=R(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=ae(e,s._$AS(e,t.values),s,n)),t}class re{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??D).importNode(t,!0);te.currentNode=n;let s=te.nextNode(),a=0,r=0,o=i[0];for(;void 0!==o;){if(a===o.index){let t;2===o.type?t=new oe(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new he(s,this,e)),this._$AV.push(t),o=i[++r]}a!==o?.index&&(s=te.nextNode(),a++)}return te.currentNode=D,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class oe{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ae(this,e,t),R(e)?e===Q||null==e||""===e?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==J&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):O(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=se.createElement(ie(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new re(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=ee.get(e.strings);return void 0===t&&ee.set(e.strings,t=new se(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new oe(this.O(H()),this.O(H()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class le{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(e,t=this,i,n){const s=this.strings;let a=!1;if(void 0===s)e=ae(this,e,t,0),a=!R(e)||e!==this._$AH&&e!==J,a&&(this._$AH=e);else{const n=e;let r,o;for(e=s[0],r=0;r<s.length-1;r++)o=ae(this,n[i+r],t,r),o===J&&(o=this._$AH[r]),a||=!R(o)||o!==this._$AH[r],o===Q?e=Q:e!==Q&&(e+=(o??"")+s[r+1]),this._$AH[r]=o}a&&!n&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ce extends le{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class de extends le{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class pe extends le{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=ae(this,e,t,0)??Q)===J)return;const i=this._$AH,n=e===Q&&i!==Q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==Q&&(i===Q||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class he{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ae(this,e)}}const ue={M:E,P:V,A:L,C:1,L:ne,R:re,D:O,V:ae,I:oe,H:le,N:de,U:pe,B:ce,F:he},me=C.litHtmlPolyfillSupport;me?.(se,oe),(C.litHtmlVersions??=[]).push("3.3.3");const ge=globalThis;class fe extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new oe(t.insertBefore(H(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}}fe._$litElement$=!0,fe.finalized=!0,ge.litElementHydrateSupport?.({LitElement:fe});const ve=ge.litElementPolyfillSupport;ve?.({LitElement:fe}),(ge.litElementVersions??=[]).push("4.2.2");const be=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ye={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:k},xe=(e=ye,t,i)=>{const{kind:n,metadata:s}=i;let a=globalThis.litPropertyMetadata.get(s);if(void 0===a&&globalThis.litPropertyMetadata.set(s,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function _e(e){return(t,i)=>"object"==typeof i?xe(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function $e(e){return _e({...e,state:!0,attribute:!1})}const we=c`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,ke=c`
  ${we}
  .menu {
    position: fixed;
    inset: auto;
    z-index: 30;
    margin: 0;
    min-width: 240px;
    max-width: calc(100vw - 16px);
    padding: 4px;
    overflow-y: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius-lg, 12px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    box-shadow: var(--mc-shadow-float, 0 4px 16px rgba(0, 0, 0, 0.2));
    font-size: 0.875rem;
    line-height: 1.3;
  }
  .item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 12px;
    min-height: var(--mc-hit, 40px);
    padding: 0 12px;
    border-radius: var(--mc-radius, 8px);
    cursor: pointer;
    outline: none;
  }
  .item:hover {
    background: var(--mc-surface-2, #f2f3f5);
  }
  .item:focus-visible {
    background: var(--mc-surface-2, #f2f3f5);
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: -2px;
  }
  .item.danger {
    color: var(--mc-error-ink, #b3261e);
  }
  .item[aria-disabled='true'] {
    opacity: 0.6;
    cursor: default;
  }
  .item[aria-disabled='true']:hover {
    background: transparent;
  }
  .glyph {
    display: inline-flex;
    color: var(--mc-text-2, #5f6368);
  }
  .label {
    flex: 1;
  }
  .item:has(.sub-line) {
    padding-block: 6px;
  }
  .sub-line {
    flex-basis: 100%;
    font-size: 0.75rem;
    color: var(--mc-text-2, #5f6368);
  }
  .keys,
  .why {
    font-size: 0.75rem;
    color: var(--mc-text-2, #5f6368);
  }
  .keys {
    font-family: var(--mc-mono, ui-monospace, monospace);
  }
  .why {
    display: none;
    flex-basis: 100%;
  }
  .item:focus .why {
    display: block;
  }
  .sep {
    height: 1px;
    margin: 4px 0;
    background: var(--mc-divider, rgba(0, 0, 0, 0.12));
  }
  @media (pointer: coarse) {
    .item {
      min-height: var(--mc-hit, 44px);
    }
    .keys {
      display: none;
    }
  }
`,Me=c`${we}${c`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`}`,Se=c`
  ${we}
  .panel {
    position: fixed;
    inset: auto;
    z-index: 30;
    margin: 0;
    max-width: min(360px, calc(100vw - 16px));
    padding: 12px;
    overflow: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius-lg, 12px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    box-shadow: var(--mc-shadow-float, 0 4px 16px rgba(0, 0, 0, 0.2));
  }
`,Ce={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},Ae={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},je=e=>Object.prototype.hasOwnProperty.call(Ae,e),ze=(e,t=20)=>je(e)?Z`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${Ae[e]} fill="currentColor"></path></svg>`:Z`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${Ce[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,Ee=e=>Object.prototype.hasOwnProperty.call(Ce,e)||je(e);function Ve(e,t,i="start"){const n=window.innerWidth||document.documentElement.clientWidth||0,s=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const a=e.offsetWidth,r=e.offsetHeight,o=s-t.bottom-4-8,l=t.top-4-8,c=s>0&&r>o&&l>o,d=c?l:o;s>0&&r>d&&(e.style.maxHeight=`${Math.max(120,d)}px`);const p=Math.min(r,s>0?Math.max(120,d):r),h=c?Math.max(8,t.top-4-p):t.bottom+4;let u="end"===i?t.right-a:t.left;return n>0&&(u=Math.min(u,n-a-8)),u=Math.max(8,u),Object.assign(e.style,{top:`${Math.round(h)}px`,left:`${Math.round(u)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=c?"top":"bottom",c?"top":"bottom"}function Le(e,t,i=0){const n=e.getBoundingClientRect(),s=(e,t,n)=>{let s=e+i;return s+t>n-8&&(s=e-i-t),Math.max(8,Math.min(s,n-8-t))},a=[s(t[0],n.width,window.innerWidth),s(t[1],n.height,window.innerHeight)];return Object.assign(e.style,{left:`${a[0]}px`,top:`${a[1]}px`,right:"auto",bottom:"auto"}),a}function Pe(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}var De=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class He extends fe{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],n=i.indexOf(e.composedPath()[0]),s=this.entries(),a=i.length,r=e=>i[(e+a)%a]?.focus(),o=e.key;let l=!0;if("ArrowDown"===o)r(n+1);else if("ArrowUp"===o)r(n<0?a-1:n-1);else if("Home"===o)r(0);else if("End"===o)r(a-1);else if("Enter"===o||" "===o)this.pick(n,i[n]);else if("ArrowRight"===o)this._sub<0&&s[n]?.items&&this.openSub(n,i[n]);else if("ArrowLeft"===o||"Escape"===o)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===o&&this.close("escape");else if("Tab"===o)l=!1,this.close("tab");else if(1!==o.length||e.ctrlKey||e.metaKey||e.altKey)l=!1;else{const e=s.map((e,t)=>(n+1+t)%a).find(e=>s[e].label.toLowerCase().startsWith(o.toLowerCase()));void 0!==e&&r(e)}l&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))Pe(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&(Pe(e),this.anchor?Ve(e,this.anchor.getBoundingClientRect(),this.align):Le(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){Pe(e);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect().width;Le(e,[i.right+n+8<=window.innerWidth?i.right:Math.max(8,i.left-n),i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&Ee(e.glyph)?Z`<span class="glyph">${ze(e.glyph,18)}</span>`:e.icon?Z`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:Q}row(e,t){const i=!!e.items,n=void 0===e.checked?"menuitem":"menuitemcheckbox";return Z`${e.separatorBefore?Z`<div class="sep" role="separator"></div>`:Q}<div class="item ${e.danger?"danger":""}" role=${n} tabindex="-1" aria-checked=${void 0===e.checked?Q:String(e.checked)} aria-disabled=${e.reason?"true":Q} aria-description=${e.reason??e.sub??Q} aria-keyshortcuts=${e.keys??Q} aria-haspopup=${i?"menu":Q} aria-expanded=${i?String(this._sub===t):Q} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?Z`<span class="keys">${e.keys}</span>`:Q}${i?"›":Q}${e.reason?Z`<span class="why">${e.reason}</span>`:Q}${e.sub?Z`<span class="sub-line">${e.sub}</span>`:Q}</div>`}render(){if(!this._open)return Q;const e=this.items[this._sub];return Z`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?Z`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:Q}`}}He.uiKitRevision=5,He.styles=ke,De([_e({attribute:!1})],He.prototype,"items",void 0),De([_e()],He.prototype,"label",void 0),De([_e({attribute:!1})],He.prototype,"at",void 0),De([_e({attribute:!1})],He.prototype,"anchor",void 0),De([_e()],He.prototype,"align",void 0),De([_e({type:Boolean})],He.prototype,"touch",void 0),De([_e({attribute:!1})],He.prototype,"opener",void 0),De([$e()],He.prototype,"_open",void 0),De([$e()],He.prototype,"_sub",void 0);var Re=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class Ne extends fe{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&(Pe(e),this.anchor&&Ve(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?Z`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:Q}}Ne.uiKitRevision=5,Ne.styles=Se,Re([_e({attribute:!1})],Ne.prototype,"anchor",void 0),Re([_e()],Ne.prototype,"label",void 0),Re([_e()],Ne.prototype,"align",void 0),Re([$e()],Ne.prototype,"_open",void 0);const Oe=[420,480,640,880];function Te(e,t,i){const n=Math.min(Math.max(e.w,320),t-32);return{w:n,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-n),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const Fe=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});var Ie=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Be=["centre","end","start"];class qe extends fe{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._rtl=!1,this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=Te(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,n=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,n)<4)return;t.moved=!0,this._dock=0;const s=t.r0;if("move"===t.mode)return this._set({...s,x:s.x+i,y:s.y+n});const a=this._rtl,r=Te({...s,w:s.w+(a?-i:i),h:s.h+n},this._vw(),this._vh());this._set({...r,x:a?s.x+s.w-r.w:s.x})},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),this._rtl="rtl"===getComputedStyle(this).direction,window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=Te(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%Be.length,this._set(function(e,t,i,n,s){if("centre"===t)return Fe(e,n,s);const a="end"===t!==i;return{...e,x:a?n-e.w-16:16}}(this._now(),Be[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=Oe.find(t=>t>e.w+1)??Oe[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=this._now();if(this._dock=0,!i){if("move"===e)return this._set(Fe(n,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const s=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...n,w:s.w,h:s.h})}if("move"===e)return this._set({...n,x:n.x+i[0],y:n.y+i[1]});const s=this._rtl,a=Te({...n,w:n.w+(s?-i[0]:i[0]),h:n.h+i[1]},this._vw(),this._vh());this._set({...a,x:s?n.x+n.w-a.w:n.x})}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return Q;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,n=t&&this.resizable&&!this.maximized,s=t&&this.maximizable;return Z`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${n?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?Z`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${ze("grip",20)}</button>`:Q}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${s?Z`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${ze(this.maximized?"restore":"maximize",20)}</button>`:Q} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${ze("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${n?Z`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${ze("resizeCorner",20)}</button>`:Q}</dialog>`}}qe.uiKitRevision=5,qe.styles=Me,Ie([_e()],qe.prototype,"heading",void 0),Ie([_e()],qe.prototype,"closeLabel",void 0),Ie([_e()],qe.prototype,"variant",void 0),Ie([_e({reflect:!0})],qe.prototype,"size",void 0),Ie([_e()],qe.prototype,"initialFocus",void 0),Ie([_e({attribute:!1})],qe.prototype,"opener",void 0),Ie([_e({type:Boolean})],qe.prototype,"dismissible",void 0),Ie([_e({type:Boolean})],qe.prototype,"movable",void 0),Ie([_e({type:Boolean})],qe.prototype,"resizable",void 0),Ie([_e({type:Boolean})],qe.prototype,"maximizable",void 0),Ie([_e({type:Boolean,reflect:!0})],qe.prototype,"maximized",void 0),Ie([_e()],qe.prototype,"moveLabel",void 0),Ie([_e()],qe.prototype,"resizeLabel",void 0),Ie([_e()],qe.prototype,"maximizeLabel",void 0),Ie([_e()],qe.prototype,"restoreLabel",void 0),Ie([$e()],qe.prototype,"_open",void 0),Ie([$e()],qe.prototype,"_hasFooter",void 0),Ie([$e()],qe.prototype,"_r",void 0),Ie([$e()],qe.prototype,"_compact",void 0),Ie([$e()],qe.prototype,"_rtl",void 0),function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<5&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}([["mc-ui-window",qe],["mc-ui-menu",He],["mc-ui-popover",Ne]]);const Ke=e=>(...t)=>({_$litDirective$:e,values:t});class Ue{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const{I:Ge}=ue,We=e=>void 0===e.strings,Ze={},Ye=Ke(class extends Ue{constructor(e){if(super(e),3!==e.type&&1!==e.type&&4!==e.type)throw Error("The `live` directive is not allowed on child or event bindings");if(!We(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===J||t===Q)return t;const i=e.element,n=e.name;if(3===e.type){if(t===i[n])return J}else if(4===e.type){if(!!t===i.hasAttribute(n))return J}else if(1===e.type&&i.getAttribute(n)===t+"")return J;return((e,t=Ze)=>{e._$AH=t})(e),t}}),Xe=Symbol.for(""),Je=e=>{if(e?.r===Xe)return e?._$litStatic$},Qe=new Map,et=e=>(t,...i)=>{const n=i.length;let s,a;const r=[],o=[];let l,c=0,d=!1;for(;c<n;){for(l=t[c];c<n&&void 0!==(a=i[c],s=Je(a));)l+=s+t[++c],d=!0;c!==n&&o.push(a),r.push(l),c++}if(c===n&&r.push(t[n]),d){const e=r.join("$$lit$$");void 0===(t=Qe.get(e))&&(r.raw=r,Qe.set(e,t=r)),i=o}return e(t,...i)},tt=et(Z);et(Y),et(X);var it=i(4753),nt=i(201);const st=e=>e.channels.includes("glow")||e.channels.includes("fx")||!!e.colour,at=[{id:"linear",label:287,css:"linear"},{id:"ease",label:172,css:"ease"},{id:"ease-in",label:173,css:"ease-in"},{id:"ease-out",label:175,css:"ease-out"},{id:"ease-in-out",label:174,css:"ease-in-out"},{id:"spring",label:449,css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:433,css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:434,css:"cubic-bezier(0.7, 0, 0.3, 1)"}],rt=(e,t=1080)=>({label:e,unit:"deg",min:0,max:t}),ot=(e,t=100)=>({label:e,unit:"%",min:0,max:t}),lt=(e,t=60)=>({label:e,unit:"px",min:0,max:t}),ct=(e=349,t=12)=>({label:e,unit:"",min:1,max:t}),dt=ct();function pt(e,t,i){const{direction:n="normal",iterations:s="infinite",...a}=i.extra||{};return{id:e,name:t,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:s,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...a}}const ht={iconKeyframes:!0},ut=[pt("breathe",94,{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[ot(407,50),4]}),pt("glow-pulse",222,{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[lt(223),16],extra:ht}),pt("halo-ripple",233,{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[lt(390),14],extra:ht}),pt("aura",34,{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[lt(223),24],extra:ht}),pt("heartbeat",235,{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[ot(407,50),12]}),pt("spin",445,{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[rt(397),360]}),pt("fast-spin",187,{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[rt(397),360]}),pt("sway",471,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[rt(21,90),6]}),pt("wobble",556,{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[lt(154),6]}),pt("shake-alert",417,{group:"Motion",channels:["translate"],duration:2,intensity:[lt(154),4]}),pt("rumble",405,{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[lt(154,10),1]}),pt("float",206,{group:"Motion",channels:["translate"],duration:3,intensity:[lt(154),6]}),pt("flame-flicker",194,{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[ot(203,30),5],extra:{origin:"50% 100%",colour:!0}}),pt("steam-rise",460,{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[dt,4],extra:{particles:"count"}}),pt("bubbles",97,{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[dt,6],extra:{particles:"count"}}),pt("snow-fall",436,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[dt,6],extra:{particles:"count"}}),pt("rain-fall",374,{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[dt,6],extra:{particles:"count"}}),pt("liquid-wave",288,{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[ot(188),40],extra:{particles:2}}),pt("storm-flash",462,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[ot(96),75],extra:{particles:1,front:!0}}),pt("shine-sweep",422,{group:"Light & colour",channels:["fx"],duration:3,intensity:[ot(421),45],extra:{particles:1,front:!0}}),pt("bounce",88,{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[lt(237),10],extra:{origin:"50% 100%"}}),pt("jello",264,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[ot(451,50),12]}),pt("rubber-band",404,{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[ot(465,50),25]}),pt("tada",501,{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[rt(21,45),3]}),pt("swing",472,{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[rt(21,90),15],extra:{origin:"50% 0"}}),pt("flip",205,{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[rt(397),360]}),pt("pop",359,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[ot(407,50),18]}),pt("head-shake",234,{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[lt(154,30),6]}),pt("blink",65,{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[ot(139),85]}),pt("neon-flicker",315,{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[lt(223,30),8],extra:{colour:!0}}),pt("rainbow-hue",375,{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[rt(241,720),360]}),pt("glitch",219,{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[lt(327,20),3],extra:{colour:!0}}),pt("fade-pulse",184,{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[ot(183),60]}),pt("ping",352,{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[ot(390,200),90],extra:{particles:1}}),pt("ripple-rings",394,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[ct(391,6),3],extra:{particles:"count"}}),pt("radar-sweep",371,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[rt(62,180),70],extra:{particles:1}}),pt("conic-border-spin",122,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[lt(82,12),2],extra:{particles:1}}),pt("breathing-border",95,{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[lt(82,12),2],extra:ht}),pt("fireflies",191,{group:"Scenes",channels:["fx"],duration:6,intensity:[dt,8],extra:{particles:"count"}}),pt("confetti",121,{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[dt,10],extra:{particles:"count"}}),pt("falling-leaves",186,{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[dt,5],extra:{particles:"count"}}),pt("lightning",283,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[ot(96),90],extra:{particles:1,front:!0}}),pt("ocean-waves",326,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[ot(547),35],extra:{particles:3}}),pt("sun-rays",469,{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[rt(378,30),6],extra:{particles:1}}),pt("heat-shimmer",236,{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[lt(464,10),2]}),pt("wind-lines",553,{group:"Scenes",channels:["fx"],duration:2.2,intensity:[dt,5],extra:{particles:"count"}}),pt("drip",164,{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[dt,3],extra:{particles:"count"}}),pt("equalizer-bars",181,{group:"Scenes",channels:["fx"],duration:.9,intensity:[ct(60),5],extra:{particles:"count",direction:"alternate"}}),pt("charging-stripes",104,{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[ot(466),100],extra:{particles:1}}),pt("orbit-dots",331,{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[ct(156,8),3],extra:{particles:"count"}}),pt("typing-dots",529,{group:"Scenes",channels:["fx"],duration:1.2,intensity:[lt(88,20),4],extra:{particles:3}}),pt("pendulum",351,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[rt(21,90),20],extra:{origin:"50% 0",direction:"alternate"}}),pt("orbit",330,{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[lt(372,40),6]}),pt("coin-spin",113,{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[rt(397),360]}),pt("rotate-3d",3,{group:"Motion",channels:["rotate"],duration:3,intensity:[rt(515,180),25],extra:{direction:"alternate"}}),pt("squash-stretch",452,{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[ot(451,50),14],extra:{origin:"50% 100%"}}),pt("wiggle",552,{group:"Motion",channels:["rotate"],duration:2.5,intensity:[rt(21,45),8]}),pt("shadow-lift",415,{group:"Motion",channels:["translate","glow"],duration:3,intensity:[lt(279,20),4],extra:ht}),pt("holographic-shimmer",239,{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[ot(464),35],extra:{particles:1,front:!0}}),pt("scanline",408,{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[ot(96),50],extra:{particles:1,front:!0}}),pt("twinkle",528,{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[dt,6],extra:{particles:"count",front:!0}}),pt("spotlight",448,{group:"Light & colour",channels:["fx"],duration:7,intensity:[ot(96),45],extra:{particles:1}}),pt("border-snake",78,{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[lt(551,12),3],extra:{ring:"snake"}}),pt("neon-border",314,{group:"Borders",channels:["glow"],duration:2.4,intensity:[lt(223,30),10],extra:ht}),pt("power-flow",363,{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[lt(155,12),5],extra:{ring:"dots"}}),pt("marching-ants",299,{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[lt(551,12),2],extra:{ring:"dashes"}}),pt("aurora",35,{group:"Backgrounds",channels:["fx"],duration:12,intensity:[ot(220),55],extra:{particles:3}}),pt("lava-lamp",274,{group:"Backgrounds",channels:["fx"],duration:9,intensity:[dt,5],extra:{particles:"count",direction:"alternate"}}),pt("plasma-gradient",353,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[ot(464),70],extra:{particles:1}}),pt("gradient-flow",226,{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[ot(464),60],extra:{particles:1,direction:"alternate"}}),pt("color-cycle-bg",116,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[ot(464),35],extra:{particles:1}}),pt("starfield",454,{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[dt,12],extra:{particles:"count"}}),pt("meteor-shower",305,{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[dt,4],extra:{particles:"count"}}),pt("bokeh",68,{group:"Backgrounds",channels:["fx"],duration:8,intensity:[dt,7],extra:{particles:"count",direction:"alternate"}}),pt("matrix-rain",302,{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[ct(463),10],extra:{particles:"count"}}),pt("smoke",432,{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[dt,5],extra:{particles:"count"}}),pt("clouds-drift",111,{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[ct(110,6),3],extra:{particles:"count"}}),pt("water-ripple",545,{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[ct(395,8),3],extra:{particles:"count"}}),pt("fireworks",192,{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[ct(444),10],extra:{particles:"count"}}),...[["winter",555,"winter"],["spring",449,"spring"],["summer",468,"summer"],["autumn",40,"autumn"],["christmas",105,"christmas"],["new_year",316,"new_year"],["valentine",535,"valentine"],["easter",176,"easter"],["halloween",232,"halloween"],["weather",294,"weather"],["daynight",132,"daynight"],["snow",437,"snow"],["rain",376,"rain"],["storm",513,"storm"],["sun",470,"sun"],["clouds",112,"clouds"],["fog",208,"fog"],["wind",554,"wind"],["night",318,"night"],["dusk",171,"dusk"]].map(([e,t,i])=>pt(e,t,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[ot(137),50],extra:{seasonal:i}})),pt("tap-ripple",502,{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[ot(96),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),pt("press",367,{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[ot(138,30),6],extra:{trigger:"tap",iterations:1}})],mt=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(e=>ut.some(t=>t.group===e)),gt={"Glow & pulse":221,Motion:308,Playful:355,"Light & colour":281,"Rings & sweeps":392,Borders:84,"Weather & device":549,Scenes:409,Backgrounds:51,Seasonal:411,Interaction:260},ft=new Map(ut.map(e=>[e.id,e])),vt=e=>e?ft.get(e):void 0,bt={breathe:"0%,100%{scale:1;opacity:1}50%{scale:calc(1 + $i / 100);opacity:.78}","glow-pulse":"0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 calc($i * 1px) calc($i * .19px) $c}","glow-pulse-icon":"0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 calc($i * .375px) $c)}","halo-ripple":"0%{box-shadow:0 0 0 0 $c}100%{box-shadow:0 0 0 calc($i * 1px) transparent}","halo-ripple-icon":"0%{filter:drop-shadow(0 0 0 $c)}100%{filter:drop-shadow(0 0 calc($i * .7px) transparent)}",aura:"0%,100%{box-shadow:0 0 calc($i * .42px) calc($i * .04px) color-mix(in srgb,$c 60%,transparent),inset 0 0 calc($i * .42px) color-mix(in srgb,$c 24%,transparent)}50%{box-shadow:0 0 calc($i * 1px) calc($i * .25px) $c,inset 0 0 calc($i * .75px) color-mix(in srgb,$c 48%,transparent)}","aura-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .125px) color-mix(in srgb,$c 50%,transparent))}50%{filter:drop-shadow(0 0 calc($i * .42px) $c)}",heartbeat:"0%,70%,100%{scale:1}14%{scale:calc(1 + $i / 100)}28%{scale:1}42%{scale:calc(1 + $i / 150)}",spin:"from{rotate:0deg}to{rotate:calc($i * 1deg)}","fast-spin":"from{rotate:0deg}to{rotate:calc($i * 1deg)}",sway:"0%,100%{rotate:calc($i * -1deg)}50%{rotate:calc($i * 1deg)}",wobble:"0%,100%{translate:0 0;rotate:0deg}15%{translate:calc($i * -1px) 0;rotate:calc($i * -.66deg)}30%{translate:calc($i * .83px) 0;rotate:calc($i * .5deg)}45%{translate:calc($i * -.66px) 0;rotate:calc($i * -.33deg)}60%{translate:calc($i * .33px) 0;rotate:calc($i * .17deg)}75%{translate:calc($i * -.17px) 0;rotate:calc($i * -.08deg)}","shake-alert":"0%,50%,100%{translate:0 0}5%,15%,25%,35%,45%{translate:calc($i * -1px) 0}10%,20%,30%,40%{translate:calc($i * 1px) 0}",rumble:"0%,100%{translate:0 0}25%{translate:calc($i * 1px) calc($i * -1px)}50%{translate:calc($i * -1px) calc($i * 1px)}75%{translate:calc($i * 1px) calc($i * 1px)}",float:"0%,100%{translate:0 0}50%{translate:0 calc($i * -1px)}","flame-flicker":"0%,100%{scale:1 1;rotate:0deg;filter:drop-shadow(0 0 2px $c) brightness(1)}25%{scale:calc(1 - $i * .004) calc(1 + $i / 100);rotate:calc($i * .3deg);filter:drop-shadow(0 -1px 6px $c) brightness(1.15)}50%{scale:calc(1 + $i * .004) calc(1 - $i * .006);rotate:calc($i * -.2deg);filter:drop-shadow(0 0 3px $c) brightness(.95)}75%{scale:calc(1 - $i * .002) calc(1 + $i * .008);rotate:calc($i * -.4deg);filter:drop-shadow(0 -1px 5px $c) brightness(1.1)}","steam-rise":"0%{translate:0 0;scale:.5;opacity:0}25%{opacity:1}100%{translate:0 -100cqh;scale:1.7;opacity:0}",bubbles:"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:4px -55cqh}90%{opacity:.8}100%{translate:-3px calc(-100cqh - 12px);opacity:0}","snow-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:6px 50cqh}100%{translate:-2px calc(100cqh + 12px);opacity:.7}","rain-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 24px);opacity:.6}","liquid-wave":"from{rotate:0deg}to{rotate:360deg}","storm-flash":"0%,88%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.1}93.5%{opacity:calc($i / 125)}96%{opacity:0}","shine-sweep":"0%{translate:-100% 0}60%,100%{translate:100cqw 0}",blink:"0%,45%,100%{opacity:1}50%,95%{opacity:calc(1 - $i / 100)}","neon-flicker":"0%,17%,23%,26%,52%,58%,100%{opacity:1;filter:drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1)}20%,25%,55%{opacity:.45;filter:drop-shadow(0 0 0 transparent) brightness(.8)}24%{opacity:.8;filter:drop-shadow(0 0 calc($i * .4px) $c) brightness(1)}","rainbow-hue":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(calc($i * 1deg))}",glitch:"0%,86%,100%{translate:0 0;filter:none}88%{translate:calc($i * -1px) 0;filter:drop-shadow(calc($i * .7px) 0 0 $c) drop-shadow(calc($i * -.7px) 0 0 color-mix(in srgb,$c 35%,#00e5ff))}90%{translate:calc($i * 1px) calc($i * .3px);filter:drop-shadow(calc($i * -.7px) 0 0 $c) hue-rotate(40deg)}92%{translate:calc($i * -.5px) 0;filter:drop-shadow(calc($i * .4px) 0 0 color-mix(in srgb,$c 35%,#ff1744))}94%{translate:0 0;filter:none}","fade-pulse":"0%,100%{opacity:1}50%{opacity:calc(1 - $i / 100)}",bounce:"0%,20%,53%,100%{translate:0 0;scale:1 1}40%,43%{translate:0 calc($i * -1px);scale:.96 1.06}70%{translate:0 calc($i * -.5px);scale:.98 1.03}80%{translate:0 0;scale:1.04 .96}90%{translate:0 calc($i * -.12px);scale:1 1}",jello:"0%,10%,60%,100%{scale:1 1}18%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}26%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}34%{scale:calc(1 + $i / 200) calc(1 - $i / 200)}42%{scale:calc(1 - $i / 400) calc(1 + $i / 400)}50%{scale:calc(1 + $i / 800) calc(1 - $i / 800)}","rubber-band":"0%,55%,100%{scale:1 1}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}20%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}25%{scale:calc(1 + $i / 160) calc(1 - $i / 160)}33%{scale:calc(1 - $i / 500) calc(1 + $i / 500)}42%{scale:calc(1 + $i / 500) calc(1 - $i / 500)}",tada:"0%,50%,100%{scale:1;rotate:0deg}5%,10%{scale:.9;rotate:calc($i * -1deg)}15%,25%,35%,45%{scale:1.1;rotate:calc($i * 1deg)}20%,30%,40%{scale:1.1;rotate:calc($i * -1deg)}",swing:"0%,60%,100%{rotate:0deg}12%{rotate:calc($i * 1deg)}24%{rotate:calc($i * -.66deg)}36%{rotate:calc($i * .33deg)}48%{rotate:calc($i * -.2deg)}",flip:"0%,10%{rotate:y 0deg}60%,100%{rotate:y calc($i * 1deg)}",pop:"0%,40%,100%{scale:1}10%{scale:calc(1 + $i / 100)}20%{scale:calc(1 - $i / 400)}30%{scale:calc(1 + $i / 600)}","head-shake":"0%,50%,100%{translate:0 0;rotate:0deg}6.5%{translate:calc($i * -1px) 0;rotate:calc($i * -1deg)}18.5%{translate:calc($i * .8px) 0;rotate:calc($i * .8deg)}31.5%{translate:calc($i * -.5px) 0;rotate:calc($i * -.5deg)}43.5%{translate:calc($i * .3px) 0;rotate:calc($i * .3deg)}"},yt="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",xt={ping:"0%{scale:.15;opacity:1}80%,100%{scale:1;opacity:0}","ripple-rings":"0%{scale:.1;opacity:1}100%{scale:1;opacity:0}","radar-sweep":"from{rotate:0deg}to{rotate:360deg}","conic-border-spin":"from{rotate:0deg}to{rotate:360deg}","breathing-border":"0%,100%{box-shadow:inset 0 0 0 calc($i * 1px) color-mix(in srgb,$c 30%,transparent),0 0 0 0 transparent}50%{box-shadow:inset 0 0 0 calc($i * 1px) $c,0 0 calc($i * 4px) color-mix(in srgb,$c 35%,transparent)}","breathing-border-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .5px) color-mix(in srgb,$c 40%,transparent))}50%{filter:drop-shadow(0 0 calc($i * 1.5px) $c)}",fireflies:"0%{translate:0 0;opacity:0}20%{opacity:1}40%{translate:10px -8px}60%{opacity:.3}75%{translate:-6px -14px;opacity:1}100%{translate:4px -22px;opacity:0}",confetti:"0%{translate:0 0;rotate:0deg;opacity:1}25%{translate:8px 25cqh;rotate:160deg}50%{translate:-6px 50cqh;rotate:300deg}75%{translate:6px 75cqh;rotate:420deg}100%{translate:0 calc(100cqh + 14px);rotate:540deg;opacity:1}","falling-leaves":"0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:1}30%{translate:14px 30cqh;rotate:60deg}55%{translate:-8px 55cqh;rotate:-20deg}80%{translate:12px 80cqh;rotate:80deg}100%{translate:0 calc(100cqh + 16px);rotate:20deg;opacity:.8}",lightning:"0%,89%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.15}93%{opacity:calc($i / 100)}96%{opacity:0}","ocean-waves":"from{translate:0 0}to{translate:-40px 0}","sun-rays":"from{rotate:0deg}to{rotate:360deg}","heat-shimmer":"0%,100%{translate:0 0;filter:blur(0)}25%{translate:calc($i * .5px) calc($i * -.5px);filter:blur(calc($i * .3px))}50%{translate:calc($i * -.5px) 0;filter:blur(0)}75%{translate:0 calc($i * .5px);filter:blur(calc($i * .2px))}","wind-lines":"0%{translate:0 0;opacity:0}15%{opacity:1}85%{opacity:.8}100%{translate:calc(100cqw + 100%) 0;opacity:0}",drip:"0%{translate:0 0;scale:.4 .2;opacity:0}15%{scale:1 1;opacity:1}35%{translate:0 2px;scale:.9 1.25}45%{translate:0 4px;scale:1 1}100%{translate:0 calc(100cqh + 12px);scale:.9 1.3;opacity:.7}","equalizer-bars":"0%{scale:1 .15}30%{scale:1 .8}60%{scale:1 .35}100%{scale:1 1}","charging-stripes":"from{translate:0 0}to{translate:28.2843px 0}","orbit-dots":"from{rotate:0deg}to{rotate:360deg}","typing-dots":"0%,60%,100%{translate:0 0;opacity:.35}30%{translate:0 calc($i * -1px);opacity:1}"},_t={ping:"left:50%;top:50%;width:calc($i * 1cqmin);aspect-ratio:1;translate:-50% -50%;border:2px solid $c;border-radius:50%;box-sizing:border-box;","ripple-rings":` left:50%;top:50%;width:110cqmin;aspect-ratio:1;translate:-50% -50%;border:1.5px solid $c;border-radius:50%;box-sizing:border-box;${yt}`,"radar-sweep":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:1;background:conic-gradient(from 0deg,transparent 0deg calc(360deg - $i * 1deg),$c 360deg);","conic-border-spin":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:conic-gradient(from 0deg,transparent 0% 55%,$c 80%,transparent 100%);",fireflies:"top:calc(12% + var(--mc-anim-phase) * 72%);width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 2px $c;",confetti:"top:-10px;width:6px;height:10px;border-radius:1px;background:$c;","confetti|:nth-child(3n + 2)":"background:color-mix(in srgb,$c 40%,#ffeb3b);","confetti|:nth-child(3n)":"width:8px;height:6px;background:color-mix(in srgb,$c 40%,#e91e63);","falling-leaves":"top:-14px;width:10px;height:10px;border-radius:0 80% 0 80%;background:$c;","falling-leaves|:nth-child(even)":"background:color-mix(in srgb,$c 75%,#7cb342);",lightning:"left:50%;top:0;width:32cqmin;height:100%;translate:-50% 0;background:color-mix(in srgb,$c 40%,#fff);clip-path:polygon(58% 0,22% 56%,46% 56%,32% 100%,80% 40%,56% 40%,72% 0);","ocean-waves":"left:0;bottom:0;width:calc(100% + 40px);height:calc($i * 1%);opacity:1;background:radial-gradient(22px 12px at 20px 0,transparent 98%,color-mix(in srgb,$c 45%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"height:calc($i * .75%);animation-direction:reverse;animation-duration:calc(var(--mc-fx-dur) * 1.5);background:radial-gradient(22px 10px at 20px 0,transparent 98%,color-mix(in srgb,$c 70%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"height:calc($i * .5%);animation-duration:calc(var(--mc-fx-dur) * .7);background:radial-gradient(22px 8px at 20px 0,transparent 98%,$c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"left:50%;top:50%;width:170cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:repeating-conic-gradient(from 0deg,$c 0deg calc($i * 1deg),transparent calc($i * 1deg) calc($i * 3deg));mask:radial-gradient(closest-side,#000 15%,transparent 70%);","wind-lines":"left:-35%;top:calc(10% + var(--mc-anim-phase) * 80%);width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,$c);",drip:"top:-4px;width:6px;height:9px;margin-left:-3px;transform-origin:50% 0;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;background:$c;","equalizer-bars":"left:calc(10% + var(--mc-anim-k) * 80%);bottom:0;width:max(3px,5%);height:70%;opacity:1;border-radius:2px 2px 0 0;transform-origin:50% 100%;background:$c;","charging-stripes":"top:0;bottom:0;left:-28.2843px;width:calc(100% + 28.2843px);opacity:1;background:repeating-linear-gradient(-45deg,color-mix(in srgb,$c calc($i * 1%),transparent) 0 10px,transparent 10px 20px);","orbit-dots":` left:50%;top:calc(50% - 38cqmin);width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;opacity:1;background:$c;transform-origin:3px calc(3px + 38cqmin);${yt}`,"typing-dots":"left:calc(50% - 12px + var(--mc-anim-k) * 36px);top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:$c;animation-delay:calc(var(--mc-fx-delay,0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur,1s) * .5);"},$t={pendulum:"from{rotate:calc($i * -1deg)}to{rotate:calc($i * 1deg)}",orbit:"0%,100%{translate:calc($i * 1px) 0}12.5%{translate:calc($i * .707px) calc($i * .707px)}25%{translate:0 calc($i * 1px)}37.5%{translate:calc($i * -.707px) calc($i * .707px)}50%{translate:calc($i * -1px) 0}62.5%{translate:calc($i * -.707px) calc($i * -.707px)}75%{translate:0 calc($i * -1px)}87.5%{translate:calc($i * .707px) calc($i * -.707px)}","coin-spin":"from{rotate:y 0deg}to{rotate:y calc($i * 1deg)}","rotate-3d":"from{rotate:1 1 0 calc($i * -1deg)}to{rotate:1 1 0 calc($i * 1deg)}","squash-stretch":"0%,100%{scale:1 1;translate:0 0}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100);translate:0 0}45%{scale:calc(1 - $i / 200) calc(1 + $i / 150);translate:0 calc($i * -.8px)}70%{scale:1 1;translate:0 calc($i * -.4px)}85%{scale:calc(1 + $i / 160) calc(1 - $i / 160);translate:0 0}",wiggle:"0%,40%,100%{rotate:0deg}5%{rotate:calc($i * 1deg)}10%{rotate:calc($i * -1deg)}15%{rotate:calc($i * .8deg)}20%{rotate:calc($i * -.6deg)}25%{rotate:calc($i * .4deg)}30%{rotate:calc($i * -.2deg)}","shadow-lift":"0%,100%{translate:0 0;box-shadow:0 1px 2px color-mix(in srgb,$c 20%,rgba(0,0,0,.2))}50%{translate:0 calc($i * -1px);box-shadow:0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3))}","shadow-lift-icon":"0%,100%{translate:0 0;filter:drop-shadow(0 1px 1px color-mix(in srgb,$c 20%,rgba(0,0,0,.2)))}50%{translate:0 calc($i * -1px);filter:drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3)))}","holographic-shimmer":"from{translate:0 0;filter:hue-rotate(0deg)}to{translate:-50% 0;filter:hue-rotate(360deg)}",scanline:"from{translate:0 -100%}to{translate:0 100cqh}",twinkle:"0%,100%{scale:0;rotate:0deg;opacity:0}50%{scale:1;rotate:90deg;opacity:1}",spotlight:"0%,100%{translate:-30cqw -10cqh}33%{translate:25cqw 15cqh}66%{translate:10cqw -20cqh}","neon-border":"0%,100%{box-shadow:0 0 0 1px $c,0 0 calc($i * .6px) color-mix(in srgb,$c 70%,transparent),inset 0 0 calc($i * .5px) color-mix(in srgb,$c 45%,transparent)}50%{box-shadow:0 0 0 1.5px $c,0 0 calc($i * 1.4px) $c,inset 0 0 calc($i * .9px) color-mix(in srgb,$c 60%,transparent)}","neon-border-icon":"0%,100%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .3px) color-mix(in srgb,$c 70%,transparent))}50%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .7px) $c)}","color-cycle-bg":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}",aurora:"0%,100%{translate:-12% 0;rotate:-8deg;scale:1 1;opacity:calc($i / 100)}50%{translate:12% 6%;rotate:6deg;scale:1.15 .85;opacity:calc($i / 160)}","lava-lamp":"0%{translate:0 0;scale:1 1;opacity:.9}50%{translate:6px -45cqh;scale:1.25 .85}100%{translate:-4px -85cqh;scale:.85 1.15;opacity:.9}","plasma-gradient":"0%{rotate:0deg;scale:1}50%{rotate:180deg;scale:1.25}100%{rotate:360deg;scale:1}","gradient-flow":"from{translate:0 0}to{translate:-66.667% 0}",starfield:"0%,100%{opacity:.15;scale:.6}50%{opacity:1;scale:1}","meteor-shower":"0%{translate:0 0;opacity:0}6%{opacity:1}40%,100%{translate:-60cqw 60cqh;opacity:0}",bokeh:"0%{translate:0 0;scale:.8;opacity:.15}50%{opacity:.55}100%{translate:10px -16px;scale:1.15;opacity:.25}","matrix-rain":"0%{translate:0 -100%;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 100%);opacity:.6}",smoke:"0%{translate:0 0;scale:.4;opacity:0}20%{opacity:.5}100%{translate:18px -90cqh;scale:2.6;opacity:0}","clouds-drift":"from{translate:0 0;opacity:.9}to{translate:calc(100cqw + 100%) 0;opacity:.9}","water-ripple":"0%{scale:.05;opacity:.9}100%{scale:1;opacity:0}",fireworks:"0%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1);opacity:1}70%{opacity:1}100%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(.3);opacity:0}","tap-ripple":"0%{scale:0;opacity:calc($i / 100)}100%{scale:1;opacity:0}",press:"0%,100%{scale:1}40%{scale:calc(1 - $i / 100)}"};function wt(e,t){const i=bt[e]??xt[e]??$t[e];if(void 0===i)return;const n=vt(e.replace(/-icon$/,"")),s=t??n?.defaults.intensity??1;return i.replace(/\$i/g,String(s)).replace(/\$c/g,"var(--mc-anim-c)")}function kt(e){const t=[];for(const i of e.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const e=i[1].split(",").map(e=>e.trim().toLowerCase()).map(e=>"from"===e?0:"to"===e?100:parseFloat(e)).filter(e=>Number.isFinite(e)),n=[];for(const e of i[2].split(";")){const t=e.indexOf(":");if(t<0)continue;const i=e.slice(0,t).trim().toLowerCase(),s=e.slice(t+1).trim().replace(/\s+/g," ");i&&s&&n.push([i,s])}e.length&&n.length&&t.push({offsets:e,decls:n})}return t}const Mt=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());var St=i(1771);const Ct="0 0 24 24",At=e=>new Map(e.map(e=>[e.toLowerCase(),e])),jt=At(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),zt=At(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"]),Et=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),Vt=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]),Lt=/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,Pt=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),Dt=new Set(["matrix","translate","scale","rotate","skewx","skewy"]),Ht=new Set(["transform","gradientTransform"]);function Rt(e,t){const i=e.match(/\(/g)?.length??0,n=[...e.matchAll(/([a-z-]+)\s*\(/gi)];return n.length===i&&n.every(e=>t.has(e[1].toLowerCase()))}function Nt(e,t){const i=t.trim();if(!/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i.test(i)){if(Ht.has(e))return Rt(i,Dt)?t:void 0;if(Rt(i.replace(Lt,""),Pt)){if("id"===e)return/^[\w.:-]+$/.test(i)?i:void 0;if("class"===e){const e=i.split(/\s+/).filter(e=>/^[\w-]+$/.test(e));return e.length?e.join(" "):void 0}return t}}}const Ot=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),Tt=e=>"mc-accent"!==e&&(Ot.has(e)||/^(mc-|dev-|xfade-)/.test(e))?`u-${e}`:e,Ft=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),It=e=>String(+e.toFixed(3)),Bt=e=>{if(null==e||/%/.test(e))return;const t=parseFloat(e);return Number.isFinite(t)?t:void 0},qt=[1,0,0,1,0,0],Kt=(e,t)=>[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]];function Ut(e){let t=qt;if(!e)return t;for(const[,i,n]of e.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const e=n.split(/[\s,]+/).filter(Boolean).map(Number);if(e.some(e=>!Number.isFinite(e)))continue;let s=qt;switch(i){case"matrix":6===e.length&&(s=e);break;case"translate":s=[1,0,0,1,e[0]??0,e[1]??0];break;case"scale":s=[e[0]??1,0,0,e[1]??e[0]??1,0,0];break;case"rotate":{const t=(e[0]??0)*Math.PI/180,[i,n]=[e[1]??0,e[2]??0],a=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];s=Kt(Kt([1,0,0,1,i,n],a),[1,0,0,1,-i,-n]);break}case"skewX":s=[1,0,Math.tan((e[0]??0)*Math.PI/180),1,0,0];break;case"skewY":s=[1,Math.tan((e[0]??0)*Math.PI/180),0,1,0,0]}t=Kt(t,s)}return t}function Gt(e,t){const i=t=>Bt(e.getAttribute(t));switch(t){case"path":{const t=e.getAttribute("d")?.trim();return t||void 0}case"circle":case"ellipse":{const e=i("cx")??0,n=i("cy")??0,s="circle"===t?i("r"):i("rx")??i("ry"),a="circle"===t?s:i("ry")??i("rx");if(!s||!a||s<=0||a<=0)return;const r=`A${It(s)} ${It(a)} 0 1 0`;return`M${It(e-s)} ${It(n)}${r} ${It(e+s)} ${It(n)}${r} ${It(e-s)} ${It(n)}Z`}case"rect":{const e=i("x")??0,t=i("y")??0,n=i("width"),s=i("height");if(!n||!s||n<=0||s<=0)return;let a=i("rx")??i("ry")??0,r=i("ry")??i("rx")??0;if(a=Math.min(Math.max(a,0),n/2),r=Math.min(Math.max(r,0),s/2),!a||!r)return`M${It(e)} ${It(t)}H${It(e+n)}V${It(t+s)}H${It(e)}Z`;const o=`A${It(a)} ${It(r)} 0 0 1`;return`M${It(e+a)} ${It(t)}H${It(e+n-a)}${o} ${It(e+n)} ${It(t+r)}V${It(t+s-r)}${o} ${It(e+n-a)} ${It(t+s)}H${It(e+a)}${o} ${It(e)} ${It(t+s-r)}V${It(t+r)}${o} ${It(e+a)} ${It(t)}Z`}case"line":return`M${It(i("x1")??0)} ${It(i("y1")??0)}L${It(i("x2")??0)} ${It(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(e){const t=(e??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let e=0;e+1<t.length;e+=2)Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&i.push([t[e],t[e+1]]);return i}(e.getAttribute("points"));if(i.length<2)return;return`M${i.map(([e,t])=>`${It(e)} ${It(t)}`).join("L")}${"polygon"===t?"Z":""}`}}}const Wt="The SVG is too complex.",Zt=e=>({markup:"",viewBox:Ct,paths:[],accentPaths:[],strokes:[],error:e}),Yt={fill:!0,stroke:!1,width:1},Xt=/^(none|transparent)$/i;function Jt(e,t){const i=t=>{const i=e.getAttribute(t);return null===i?void 0:Nt(t,i)?.trim()},n=i("fill"),s=i("stroke"),a=Bt(i("stroke-width")),r=i("stroke-linecap"),o=i("stroke-linejoin"),l=i("fill-rule");return{evenodd:void 0===l?t.evenodd:"evenodd"===l,fill:void 0===n?t.fill:!Xt.test(n),stroke:void 0===s?t.stroke:!Xt.test(s),width:void 0!==a&&a>=0?a:t.width,cap:r&&/^(butt|round|square)$/.test(r)?r:t.cap,join:o&&/^(miter|round|bevel|arcs|miter-clip)$/.test(o)?o:t.join}}function Qt(e){const t="string"==typeof e?e:"";if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>32768)return Zt("The SVG is larger than 32 KB.");const i=function(e){if("undefined"==typeof DOMParser)return;const t=new DOMParser;try{const i=t.parseFromString(e,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return n}catch{}return[...t.parseFromString(e,"text/html").getElementsByTagName("*")].find(e=>"svg"===e.localName.toLowerCase())}(t);if(!i)return Zt("No <svg> element found.");const n=function(e){const t=(e.getAttribute("viewBox")??e.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0)return t.map(It).join(" ");const i=Bt(e.getAttribute("width")),n=Bt(e.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${It(i)} ${It(n)}`:Ct}(i),s=[],a=[],r=[],o={},l=(e,t,i=[])=>{let n="",s="";for(const i of[...e.attributes]){const e=zt.get(i.name.toLowerCase());if(!e||i.name.includes(":"))continue;if(t&&("viewBox"===e||"width"===e||"height"===e))continue;const a=Nt(e,i.value);void 0!==a&&("class"===e?s=a.split(" ").map(Tt).join(" "):n+=` ${e}="${Ft(a)}"`)}const a=[s,...i].filter(Boolean).join(" ");return a?` class="${Ft(a)}"${n}`:n};let c=!1;const d=(e,t,i,n,p,h)=>{if(h>64||c)return c=!0,"";const u=jt.get(e.localName.toLowerCase());if(!u||"svg"===u)return"";if("title"===u)return`<title>${(e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"))(e.textContent??"")}</title>`;const m=Kt(t,Ut(Nt("transform",e.getAttribute("transform")??"")??null)),g=n||(e.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),f=i&&!Vt.has(u),v=Jt(e,p),b=[];if(f&&Et.has(u)){const t=Gt(e,u);if(t){const e=function(e,t){if((e=>e.every((e,t)=>Math.abs(e-qt[t])<1e-9))(t))return e;const i=e=>[t[0]*e[0]+t[2]*e[1]+t[4],t[1]*e[0]+t[3]*e[1]+t[5]];return(0,St.ER)((0,St.Mj)(e).map(e=>e.map(e=>e.map(i))))}(t,m);if(v.fill&&"line"!==u){const t=g?a:s;v.evenodd&&(g?o.accent??=[]:o.paths??=[]).push(t.length),t.push(e),b.push("mc-f")}if(v.stroke&&v.width>0){const t=+(v.width*Math.sqrt(Math.abs(m[0]*m[3]-m[1]*m[2]))).toFixed(3);r.push({d:e,width:t,...v.cap?{cap:v.cap}:{},...v.join?{join:v.join}:{},...g?{accent:!0}:{}}),b.push("mc-s")}}}const y=[...e.children].map(e=>d(e,m,f,g,v,h+1)).join("");return`<${u}${l(e,!1,b)}>${y}</${u}>`},p=Ut(Nt("transform",i.getAttribute("transform")??"")??null),h=Jt(i,Yt),u=[...i.children].map(e=>d(e,p,!0,!1,h,1)).join("");return c?Zt(Wt):s.length||a.length||r.length?{markup:`<svg viewBox="${n}"${l(i,!0)}>${u}</svg>`,viewBox:n,paths:s,accentPaths:a,strokes:r,...o.paths||o.accent?{evenodd:o}:{}}:Zt("The SVG has no shapes to draw.")}const ei=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function ti(e){const t=e=>Array.isArray(e)&&e.length>0,i=e.rig;return t(e.tracks)||t(e.clips)||t(e.bindings)||!!i&&"object"==typeof i&&(t(i.parts)||t(i.shapes))}const ii={epoch:0,failedSims:new Set},ni="custom:",si=e=>"string"==typeof e&&e.startsWith(ni),ai=e=>e.slice(7).trim(),ri=["keyframes","particles","path","sequence"],oi=["fall","rise","drift","burst","orbit","spiral"],li=65536,ci=60,di=12,pi=8192,hi=/^[a-z0-9][a-z0-9_-]{0,63}$/,ui={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"},mi=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],gi={color:new Set(mi),background:new Set([...mi,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(mi),filter:new Set([...mi,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function fi(e,t){if("string"!=typeof e)return;const i=e.trim();if(!i||i.length>600||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const e of i)if("("===e)n++;else if(")"===e&&--n<0)return;if(0!==n)return;const s=i.match(/\(/g)?.length??0,a=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return a.length!==s||a.some(e=>!gi[t].has(e[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(e=>!/^--[\w-]+$/.test(e[1]))?void 0:i}const vi=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,bi=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,yi=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,xi=["normal","reverse","alternate","alternate-reverse"];function _i(e){if("string"!=typeof e)return!1;const t=e.trim();return at.some(e=>e.id===t)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)}const $i=new Set(ut.filter(e=>!e.channels.includes("fx")).map(e=>e.id)),wi=new Set(ut.filter(e=>e.channels.includes("fx")).map(e=>e.id)),ki=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;class Mi{constructor(){this.errors=[]}err(e,t){this.errors.push({path:e,message:t})}num(e,t,i,n,s,a,r=!1){const o=e[t];if(null==o||""===o)return void 0===a?void 0:a;const l="string"==typeof o?Number(o):o;return"number"==typeof l&&Number.isFinite(l)?r&&!Number.isInteger(l)?this.err(i,"Must be a whole number."):l<n||l>s?this.err(i,`Must be between ${n} and ${s}.`):l:this.err(i,"Must be a number.")}bool(e,t,i,n){const s=e[t];return null==s?n:"boolean"!=typeof s?this.err(i,"Must be true or false.")??n:s}oneOf(e,t,i,n,s){const a=e[t];return null==a||""===a?s:n.includes(a)?a:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(e,t,i,n){const s=e[t];if(null!=s&&""!==s)return fi(s,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(e,t){return!e||"object"!=typeof e||Array.isArray(e)?this.err(t,"Must be an object."):e}list(e,t,i,n=0){return Array.isArray(e)?e.length<n?this.err(t,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):e.length>i?this.err(t,`At most ${i} entries.`):e:this.err(t,"Must be a list.")}}function Si(e,t,i,n=!1,s=!1){const a=e.obj(t,i);if(!a)return;const r=e.num(a,"at",`${i}.at`,0,100);void 0===a.at&&e.err(`${i}.at`,"Required.");const o={at:r??0};if(void 0!==a.transform){const t=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={},a=(t,a,r)=>{const o=e.num(n,t,`${i}.${t}`,a,r);void 0!==o&&(s[t]=o)};if(a("x",-1e4,1e4),a("y",-1e4,1e4),a("scale",0,100),a("scale_x",-100,100),a("scale_y",-100,100),a("rotate",-36e3,36e3),a("skew_x",-89,89),a("skew_y",-89,89),void 0!==n.axis){const t=n.axis;!Array.isArray(t)||3!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e))||t.every(e=>0===e)?e.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):s.axis=[t[0],t[1],t[2]]}return s}(e,a.transform,`${i}.transform`);t&&Object.keys(t).length&&(o.transform=t)}const l=e.num(a,"opacity",`${i}.opacity`,0,1);void 0!==l&&(o.opacity=l);const c=e.css(a,"color",`${i}.color`,"color");c&&(o.color=c);const d=e.css(a,"background",`${i}.background`,"background");d&&(o.background=d);const p=e.css(a,"shadow",`${i}.shadow`,"shadow");p&&(o.shadow=p);const h=e.css(a,"filter",`${i}.filter`,"filter");h&&(o.filter=h);const u=e.num(a,"blur",`${i}.blur`,0,200);void 0!==u&&(o.blur=u);const m=e.num(a,"radius",`${i}.radius`,0,1e3);void 0!==m&&(o.radius=m),void 0!==a.easing&&""!==a.easing&&(_i(a.easing)?o.easing=a.easing.trim():e.err(`${i}.easing`,"Not a valid easing."));const g=s?new Mi:e,f=g.css(a,"stroke",`${i}.stroke`,"color");if(f&&(o.stroke=f),void 0!==a.draw&&null!==a.draw&&""!==a.draw)if(n){const e=g.num(a,"draw",`${i}.draw`,0,1);void 0!==e&&(o.draw=e)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==a.easings&&null!==a.easings){const e=g.obj(a.easings,`${i}.easings`),t={};for(const[n,s]of Object.entries(e??{}))ei.includes(n)?_i(s)?t[n]=s.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(t).length&&(o.easings=t)}return o}function Ci(e,t,i,n){const s=e.num(t,"count",`${i}.count`,1,ci,n.count,!0)??n.count;let a=[...n.size];if(void 0!==t.size){const n=t.size;"number"==typeof n&&n>0&&n<=200?a=[n,n]:Array.isArray(n)&&2===n.length&&n.every(e=>"number"==typeof e&&e>0&&e<=200)&&n[0]<=n[1]?a=[n[0],n[1]]:e.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const r=[];if(void 0!==t.colors){const n=e.list(t.colors,`${i}.colors`,di);n?.forEach((t,n)=>{const s=fi(t,"color");s?r.push(s):e.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const o=void 0!==t.shape&&null!==t.shape?function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of icon, emoji or svg.");const a=s[0],r=n[a];if("string"!=typeof r)return e.err(`${i}.${a}`,"Must be text.");if("icon"===a)return yi.test(r.trim())?{icon:r.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===a){const t=r.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(ki(r)>32768)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(r))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Qt(r);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:r}}(e,t.shape,`${i}.shape`):void 0;return{...o?{shape:o}:{},count:s,size:a,colors:r}}const Ai=["rig","tracks","clips","bindings"];let ji;function zi(e,t={}){const i=new Mi,n=i.obj(e,"");if(!n)return{ok:!1,errors:i.errors};let s;try{s=JSON.stringify(n)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(ki(s)>li)return{ok:!1,errors:[{path:"",message:"The animation is larger than 64 KB."}]};const a="string"==typeof n.id?n.id.trim():"";hi.test(a)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const r="string"==typeof n.name?n.name.trim():"";r?r.length>80&&i.err("name","At most 80 characters."):i.err("name","Required."),void 0!==n.version&&1!==n.version&&i.err("version","Unsupported version (expected 1).");const o=i.oneOf(n,"kind","kind",ri);n.kind||i.err("kind","Required.");const l={id:a,name:r,kind:o??"keyframes",duration:i.num(n,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(n,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==n.easing&&""!==n.easing&&(_i(n.easing)?l.easing=n.easing.trim():i.err("easing","Not a valid easing.")),void 0!==n.iterations&&"infinite"!==n.iterations){const e=i.num(n,"iterations","iterations",.01,1e3);void 0!==e&&(l.iterations=e)}const c=i.oneOf(n,"direction","direction",xi);switch(c&&"normal"!==c&&(l.direction=c),void 0!==n.origin&&""!==n.origin&&("string"==typeof n.origin&&vi.test(n.origin.trim())?l.origin=n.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),o){case"keyframes":{const e=Array.isArray(n.tracks)&&n.tracks.length>0,s=void 0===n.keyframes?e?[]:i.err("keyframes","Required."):i.list(n.keyframes,"keyframes",40,e?0:1),a="lenient"===t.v2,r=(s??[]).map((e,t)=>Si(i,e,`keyframes[${t}]`,!1,a)).filter(e=>!!e);l.keyframes=r.sort((e,t)=>e.at-t.at);break}case"particles":void 0===n.particles?i.err("particles","Required."):l.particles=function(e,t,i,n){const s=e.obj(t,i);if(!s)return;const a=ui,r={...Ci(e,s,i,a),direction:e.oneOf(s,"direction",`${i}.direction`,oi,a.direction)??a.direction,speed:e.num(s,"speed",`${i}.speed`,.1,10,a.speed)??a.speed,spin:e.num(s,"spin",`${i}.spin`,-3600,3600,a.spin)??a.spin,fade:e.bool(s,"fade",`${i}.fade`,a.fade),spread:e.num(s,"spread",`${i}.spread`,0,100,a.spread)??a.spread,gravity:e.num(s,"gravity",`${i}.gravity`,-1,1,a.gravity)??a.gravity,layer:e.oneOf(s,"layer",`${i}.layer`,["back","front"],a.layer)??a.layer};if(void 0!==s.preset&&""!==s.preset){"string"==typeof s.preset&&wi.has(s.preset)?r.preset=s.preset:e.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const t=e.num(s,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==t&&(r.intensity=t)}if(void 0!==s.sim&&null!==s.sim&&(n?new Mi:e).obj(s.sim,`${i}.sim`))if(ii.simValidator){const t=ii.simValidator(s.sim,n?"lenient":"strict",{count:r.count,layer:r.layer});n||e.errors.push(...t.errors),!t.sim||!n&&t.errors.length||(r.sim=t.sim)}else r.sim=s.sim;return r}(i,n.particles,"particles","lenient"===t.v2);break;case"path":void 0===n.path?i.err("path","Required."):l.path=function(e,t,i){const n=e.obj(t,i);if(!n)return;let s="";"string"==typeof n.d&&n.d.trim()?n.d.length>pi?e.err(`${i}.d`,"At most 8192 characters."):bi.test(n.d)&&/^\s*[Mm]/.test(n.d)?(0,St.Mj)(n.d).some(e=>e.length)?s=n.d.trim().replace(/\s+/g," "):e.err(`${i}.d`,"The path draws nothing."):e.err(`${i}.d`,"Not valid path data (it must start with M)."):e.err(`${i}.d`,"Required.");const a={d:s,units:e.oneOf(n,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:e.bool(n,"follow_rotation",`${i}.follow_rotation`,!1),subject:e.oneOf(n,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==n.particles&&null!==n.particles){const t=e.obj(n.particles,`${i}.particles`);t&&(a.particles=Ci(e,t,`${i}.particles`,{...ui,count:3}))}return a}(i,n.path,"path");break;case"sequence":{l.steps=void 0===n.steps?(i.err("steps","Required."),[]):function(e,t,i,n){const s=e.list(t,i,20,1);if(!s)return[];const a=[];return s.forEach((t,s)=>{const r=`${i}[${s}]`,o=e.obj(t,r);if(!o)return;const l="string"==typeof o.animation?o.animation.trim():"";l?si(l)?ai(l)===n?e.err(`${r}.animation`,"A sequence cannot play itself."):hi.test(ai(l))||e.err(`${r}.animation`,"Not a valid animation id."):$i.has(l)||e.err(`${r}.animation`,"Must be a motion preset or a custom keyframes / path animation."):e.err(`${r}.animation`,"Required.");const c={animation:l,delay:e.num(o,"delay",`${r}.delay`,0,600,0)??0,repeat:e.num(o,"repeat",`${r}.repeat`,1,100,1,!0)??1},d=e.num(o,"duration",`${r}.duration`,.05,600);void 0!==d&&(c.duration=d),a.push(c)}),a}(i,n.steps,"steps",a),l.loop=i.bool(n,"loop","loop",!0);const e=void 0===n.stagger||null===n.stagger?{}:i.obj(n.stagger,"stagger");e&&(l.stagger={children:i.bool(e,"children","stagger.children",!1),delay:i.num(e,"delay","stagger.delay",0,10,.1)??.1});break}}if(o)if(ji)"lenient"===t.v2?Object.assign(l,ji(n,new Mi)):Object.assign(l,ji(n,i));else for(const e of Ai)void 0===n[e]||null===n[e]||"clips"!==e&&"keyframes"!==o||(l[e]=n[e]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:l,errors:[]}}function Ei(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},s=()=>{const a=n();if("("===a){i++;const t=r();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===a||"+"===a){i++;const e=s();return"-"===a?-e:e}const o=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!o)throw new Error(`Not a number in "${e}"`);return i+=o[0].length,Number(o[0])},a=()=>{let e=s();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=s();e="*"===t?e*n:e/n}return e},r=()=>{let e=a();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=a();e="+"===t?e+n:e-n}return e},o=r();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+o.toFixed(4)}function Vi(e){const t=[];let i=0,n="";for(const s of e.trim())"("===s&&i++,")"===s&&i--," "===s&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}const Li={x:[1,0,0],y:[0,1,0]};function Pi(e,t,i,n){const s=e.transform??={};switch(t){case"translate":{const[e,t="0"]=Vi(i);return s.x=Ei(e),void(s.y=Ei(t))}case"scale":{const e=Vi(i).map(Ei);return void(1===e.length?s.scale=e[0]:(s.scale_x=e[0],s.scale_y=e[1]))}case"rotate":{const e=Vi(i);return s.rotate=Ei(e[e.length-1]),void(2===e.length&&Li[e[0]]?s.axis=Li[e[0]]:4===e.length&&(s.axis=[Ei(e[0]),Ei(e[1]),Ei(e[2])]))}case"opacity":return void(e.opacity=Ei(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function Di(e){const t=wt(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of kt(t))for(const t of n.offsets){const s=i.get(t)??{at:t};for(const[t,i]of n.decls)Pi(s,t,i,e);i.set(t,s)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}const Hi=e=>`${e.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}-custom`.slice(0,64);function Ri(e,t=Hi(e),i){const n=vt(e);if(!n)return;const s=n.defaults,a={id:t,name:i??(0,nt.t)(n.name),kind:"keyframes",duration:parseFloat(s.duration),easing:s.easing,iterations:s.iterations,..."normal"!==s.direction?{direction:s.direction}:{},target:"element",origin:n.origin??"center",version:1};return n.channels.includes("fx")?{...a,kind:"particles",particles:{...ui,size:[...ui.size],colors:[],..."count"===n.particles?{count:Math.max(1,Math.round(s.intensity))}:{},layer:n.front?"front":"back",preset:n.id,intensity:s.intensity}}:{...a,keyframes:Di(n.id)}}var Ni=i(3682),Oi=Symbol("NOT_RESOLVED");function Ti(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function Fi(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function Ii(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var Bi=Ti("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),qi=["","~","null","Null","NULL"],Ki=Ti("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==qi.indexOf(e)?null:Oi,identify:e=>null===e,represent:()=>"null"}),Ui=Ti("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:Oi,identify:e=>null===e,represent:()=>"null"}),Gi=["","~","null","Null","NULL"],Wi=Ti("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Gi.indexOf(e)?null:Oi,identify:e=>null===e,represent:()=>"null"}),Zi=["true","True","TRUE"],Yi=["false","False","FALSE"],Xi=Ti("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Zi.indexOf(e)||-1===Yi.indexOf(e)&&Oi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Ji=["true"],Qi=["false"],en=Ti("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Ji.indexOf(e)||-1===Qi.indexOf(e)&&Oi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),tn=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],nn=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],sn=Ti("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==tn.indexOf(e)||-1===nn.indexOf(e)&&Oi,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),an=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),rn=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),on=Ti("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!rn.test(e))return Oi}else if(!an.test(e))return Oi;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Oi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ln=new RegExp("^-?(?:0|[1-9][0-9]*)$"),cn=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),dn=Ti("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!cn.test(e))return Oi}else if(!ln.test(e))return Oi;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Oi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),pn=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),hn=Ti("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!pn.test(e))return Oi;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:Oi},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),un=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),mn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),gn=Ti("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!un.test(e))return Oi;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)||mn.test(e)?n:Oi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),fn=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),vn=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),bn=Ti("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!vn.test(e))return Oi;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)?n:Oi}if(!fn.test(e))return Oi;const i=Number(e);return Number.isFinite(i)?i:Oi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),yn=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),xn=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),_n=Ti("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!yn.test(e))return Oi;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let n=0;if(t.includes(":")){for(const e of t.split(":"))n=60*n+Number(e);n*=i}else n=i*parseFloat(t);return Number.isFinite(n)||xn.test(e)?n:Oi},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),$n=Ti("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":Oi,identify:()=>!1}),wn=/^[A-Za-z0-9+/]*={0,2}$/,kn=Ti("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!wn.test(t))return Oi;const i=atob(t),n=new Uint8Array(i.length);for(let e=0;e<i.length;e++)n[e]=i.charCodeAt(e);return n},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),Mn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Sn=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Cn(e,t,i,n=0,s=0,a=0,r=0){const o=new Date(Date.UTC(e,t,i,n,s,a,r));return o.setUTCFullYear(e,t,i),o}var An=Ti("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=Mn.exec(e);if(null===t&&(t=Sn.exec(e)),null===t)return Oi;const i=+t[1],n=+t[2]-1,s=+t[3];if(!t[4]){const e=Cn(i,n,s);return e.getUTCFullYear()!==i||e.getUTCMonth()!==n||e.getUTCDate()!==s?Oi:e}const a=+t[4],r=+t[5],o=+t[6];let l=0;if(a>23||r>59||o>59)return Oi;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=Cn(i,n,s,a,r,o,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==n||c.getUTCDate()!==s)return Oi;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return Oi;const n=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-n:n))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),jn=Fi("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function zn(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var En=Fi("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!zn(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Vn=Fi("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,n=Object.keys(i);return 1!==n.length?"cannot resolve a pairs item":(e.push([n[0],i[n[0]]]),"")},identify:()=>!1}),Ln=Ii("tag:yaml.org,2002:map",{create:()=>({}),identify:zn,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const n=String(t);return"__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),Pn=Ii("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),Dn=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let n=0;n<t.length;n++){const s=t[n];if(s.nodeKind===i.nodeKind&&s.tagName===i.tagName&&s.matchByTagPrefix===i.matchByTagPrefix){e=n;break}}t[e]=i}return t}(e),i=[],n={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},s={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?s.scalar.push(e):n.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?s.sequence.push(e):n.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?s.mapping.push(e):n.mapping[e.tagName]=e}}const a=i.filter(e=>null===e.implicitFirstChars),r=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)r.add(t);const o=new Map;for(const e of r)o.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=n.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=o,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=n.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=n.mapping["tag:yaml.org,2002:map"],this.exact=n,this.prefix=s}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==Oi)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},Hn=new Dn([Bi,jn,Ln]),Rn=(new Dn([...Hn.tags,Ui,en,dn,bn]),new Dn([...Hn.tags,Ki,Xi,on,gn]));new Dn([...Hn.tags,Wi,sn,hn,_n,An,$n,kn,En,Vn,Pn]).withTags({...hn,resolve:(e,t,i)=>{const n=hn.resolve(e,t,i);return n===Oi?on.resolve(e,t,i):n}},{..._n,resolve:(e,t,i)=>{const n=_n.resolve(e,t,i);return n===Oi?gn.resolve(e,t,i):n}});function Nn(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}Ii("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||zn(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),Ii("tag:yaml.org,2002:map",{create:()=>({}),identify:zn,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const n=Nn(t);return null===n?"nested arrays are not supported inside keys":("__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,"")},has:(e,t)=>{const i=Nn(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});Error;function On(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var Tn=new Array(256),Fn=new Array(256);for(let e=0;e<256;e++)Tn[e]=On(e)?1:0,Fn[e]=On(e);Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});Object.prototype.hasOwnProperty;var In=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Bn=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;new RegExp(`^(?:${In})*$`),new RegExp(`^(?:${Bn})+$`),new RegExp(`^(?:!(?:${In})*|${Bn}(?:${In})*)$`);function qn(e,t){return!!(e&1<<t)}Symbol("INVALID"),Symbol("visit:break"),Symbol("visit:skip");var Kn={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:Un(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!qn(e.allowedStylesMask,4))return void(i&&(e.style=3));const n=e.presenterOptions.lineWidth;if(-1===n)return void(i&&(e.style=4));const s=Math.max(Math.min(n,40),n-e.shiftOfContent);let a=0,r=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const n=t.slice(a,e);if(n.length>s&&" "!==n[0]&&/ [^ \t]/.test(n)&&(r=!0),-1===i)break;a=i+1}r?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||qn(e.allowedStylesMask,1)||(e.style=Un(e))},fallbackToDoubleQuoted:function(e){qn(e.allowedStylesMask,e.style)||(e.style=3)}};function Un(e){return"single"===e.presenterOptions.quoteStyle&&qn(e.allowedStylesMask,2)?2:3}var Gn="[ \\t]",Wn="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Zn=`(?:(?!${Gn})${Wn})`,Yn="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Xn="[-?:,\\[\\]{}#&*!|>'\"%@`]",Jn=`(?:(?![,\\[\\]{}])${Zn})`,Qn=`(?:(?:(?![:#])${Zn})|:(?=${Zn}))#*`,es=`(?:(?:(?![:#])${Jn})|:(?=${Jn}))#*`,ts=`(?:${Gn}*${Qn})*`,is=`(?:${Gn}*${es})*`,ns=`(?:(?:(?!${Xn})${Zn})|[?:-](?=${Zn}))#*${ts}`,ss=`(?:(?:(?!${Xn})${Zn})|[?:-](?=${Jn}))#*${is}`,as=ns,rs=ss,os=`${ss}(?:\\n+${es}${is})*`;new RegExp(`^(?:${ns}(?:\\n+${Qn}${ts})*)$`,"u"),new RegExp(`^(?:${os})$`,"u"),new RegExp(`^(?:${as})$`,"u"),new RegExp(`^(?:${rs})$`,"u"),new RegExp(`^(?:${Yn})*$`,"u"),new RegExp(`^(?:${Yn}|\\n)*$`,"u"),new RegExp(`^(?:${Wn}|\\n)*$`,"u");Object.keys(Kn).map(e=>Reflect.get(Kn,e));Rn.withTags($n);const ls=64,cs=48,ds=/^[a-z0-9][a-z0-9_-]{0,31}$/,ps=["element","icon","name","state","background"],hs=["rotate","x","y","scale","opacity","draw","color_mix","speed","rotate_speed"],us=["cut","crossfade","finish"],ms=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;function gs(e,t,i,n){return Array.isArray(t)?t.length>n?e.err(`${i}[${n}]`,`At most ${n} entries.`):t:e.err(i,"Must be a list.")}function fs(e,t,i,n){const s="string"==typeof t.id?t.id.trim():"";return ds.test(s)?n.has(s)?e.err(`${i}.id`,`Duplicate id "${s}".`):(n.add(s),s):e.err(`${i}.id`,"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).")}function vs(e,t,i,n){if(void 0===t.name||null===t.name||""===t.name)return n;if("string"!=typeof t.name||!t.name.trim())return e.err(`${i}.name`,"Must be text.")??n;const s=t.name.trim();return s.length>80?e.err(`${i}.name`,"At most 80 characters.")??n:s}function bs(e,t,i){if(null!=t)return!Array.isArray(t)||2!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e)||Math.abs(e)>1e4)?e.err(i,"Must be two numbers [x, y]."):[t[0],t[1]]}function ys(e,t,i){return"string"==typeof t&&t.trim()?t.length>pi?e.err(i,"At most 8192 characters."):bi.test(t)&&/^\s*[Mm]/.test(t)?(0,St.Mj)(t).some(e=>e.length)?t.trim().replace(/\s+/g," "):e.err(i,"The path draws nothing."):e.err(i,"Not valid path data (it must start with M)."):e.err(i,"Required.")}function xs(e,t,i,n){if("string"!=typeof t||!t.trim())return e.err(i,"Must be SVG markup.");if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>32768)return e.err(i,"The SVG is larger than 32 KB.");const s=n&&!/^\s*<svg[\s>]/i.test(t)?`<svg viewBox="0 0 24 24">${t}</svg>`:t;if(!/<svg[\s>]/i.test(s))return e.err(i,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Qt(s);if(t.error)return e.err(i,t.error)}return t}function _s(e,t,i,n){const s=function(e){if("string"!=typeof e)return;if(ps.includes(e))return{kind:e};const t=/^(part|group|shape):(.+)$/.exec(e);return t&&ds.test(t[2])?{kind:t[1],id:t[2]}:void 0}(t);if(!s)return e.err(i,"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.");if(void 0!==s.id){const t="part"===s.kind?n?.parts:"group"===s.kind?n?.groups:n?.shapes;if(!t?.some(e=>e.id===s.id))return e.err(i,`No ${s.kind} "${s.id}" in the rig.`)}return t}function $s(e,t){const i={},n=t=>void 0!==e[t]&&null!==e[t],s="keyframes"===e.kind;let a;return s&&n("rig")&&(a=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={parts:[]},a=void 0!==n.icon&&null!==n.icon&&""!==n.icon,r=void 0!==n.svg&&null!==n.svg&&""!==n.svg;if(a&&r&&e.err(i,"Set icon or svg, not both."),a&&("string"==typeof n.icon&&yi.test(n.icon.trim())?s.icon=n.icon.trim():e.err(`${i}.icon`,"Must be an icon id like mdi:bell.")),r){const t=xs(e,n.svg,`${i}.svg`,!1);t&&(s.svg=t)}const o=new Set,l=void 0===n.parts?[]:gs(e,n.parts,`${i}.parts`,ls);if(l?.forEach((t,n)=>{const a=`${i}.parts[${n}]`,r=e.obj(t,a);if(!r)return;const l=fs(e,r,a,o);if(!l)return;const c={id:l,name:vs(e,r,a,l)},d=void 0!==r.from&&null!==r.from;if(d===(void 0!==r.svg&&null!==r.svg&&""!==r.svg))return void e.err(a,"Set one of from or svg.");if(d){const t=e.list(r.from,`${a}.from`,256,1),i=[];t?.forEach((t,n)=>{"number"==typeof t&&Number.isInteger(t)&&t>=0&&t<=4095?i.push(t):e.err(`${a}.from[${n}]`,"Must be a subpath index (a whole number from 0).")}),c.from=i}else{const t=xs(e,r.svg,`${a}.svg`,!0);t&&(c.svg=t)}const p=bs(e,r.origin,`${a}.origin`);p&&(c.origin=p),s.parts.push(c)}),void 0!==n.groups&&null!==n.groups){const t=new Set(s.parts.map(e=>e.id)),a=[];gs(e,n.groups,`${i}.groups`,16)?.forEach((n,s)=>{const r=`${i}.groups[${s}]`,l=e.obj(n,r);if(!l)return;const c=fs(e,l,r,o);if(!c)return;const d=[];e.list(l.parts,`${r}.parts`,ls,1)?.forEach((i,n)=>{"string"==typeof i&&t.has(i)?d.includes(i)||d.push(i):e.err(`${r}.parts[${n}]`,"Not a part of this rig.")});const p={id:c,name:vs(e,l,r,c),parts:d},h=bs(e,l.origin,`${r}.origin`);h&&(p.origin=h),d.length&&a.push(p)}),s.groups=a}if(void 0!==n.shapes&&null!==n.shapes){const t=[];gs(e,n.shapes,`${i}.shapes`,cs)?.forEach((n,s)=>{const a=`${i}.shapes[${s}]`,r=e.obj(n,a);if(!r)return;const l=fs(e,r,a,o);if(!l)return;const c=ys(e,r.d,`${a}.d`),d={id:l,name:vs(e,r,a,l),d:c??"",layer:"over"},p=e.css(r,"fill",`${a}.fill`,"color");p&&(d.fill=p);const h=e.css(r,"stroke",`${a}.stroke`,"color");h&&(d.stroke=h);const u=e.num(r,"stroke_width",`${a}.stroke_width`,0,100);void 0!==u&&(d.stroke_width=u);const m=e.oneOf(r,"linecap",`${a}.linecap`,["round","butt","square"]);m&&(d.linecap=m),d.layer=e.oneOf(r,"layer",`${a}.layer`,["over","under"],"over")??"over";const g=bs(e,r.origin,`${a}.origin`);g&&(d.origin=g),c&&t.push(d)}),s.shapes=t}return s}(t,e.rig,"rig"),a&&(i.rig=a)),s&&n("tracks")&&(i.tracks=function(e,t,i){const n=[],s=new Set;return gs(e,t,"tracks",24)?.forEach((t,a)=>{const r=`tracks[${a}]`,o=e.obj(t,r);if(!o)return;let l=_s(e,o.target,`${r}.target`,i);l&&s.has(l)&&(l=e.err(`${r}.target`,"Another track already animates this target.")),l&&s.add(l);const c=!!l&&/^(part|group|shape):/.test(l),d=((void 0===o.keyframes?[]:gs(e,o.keyframes,`${r}.keyframes`,40))??[]).map((t,i)=>Si(e,t,`${r}.keyframes[${i}]`,c)).filter(e=>!!e).sort((e,t)=>e.at-t.at),p={target:l??"element",keyframes:d};if(void 0!==o.origin&&""!==o.origin&&("string"==typeof o.origin&&vi.test(o.origin.trim())?p.origin=o.origin.trim():e.err(`${r}.origin`,'Use keywords, lengths or percentages, e.g. "50% 100%".')),void 0!==o.path&&null!==o.path){const t=e.obj(o.path,`${r}.path`);if(t){const i=ys(e,t.d,`${r}.path.d`);i&&(p.path={d:i,...void 0!==t.follow_rotation?{follow_rotation:e.bool(t,"follow_rotation",`${r}.path.follow_rotation`,!1)}:{}})}}l&&n.push(p)}),n}(t,e.tracks,a)),n("clips")&&(i.clips=function(e,t,i){const n=[],s=new Set(ut.map(e=>e.id));return gs(e,t,"clips",12)?.forEach((t,a)=>{const r=`clips[${a}]`,o=e.obj(t,r);if(!o)return;const l=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["state","state_not","entity_on","above","below"].filter(e=>void 0!==n[e]&&null!==n[e]);if(1!==s.length)return e.err(i,"Set one of state, state_not, entity_on, above or below.");const a=s[0],r=n[a];if("state"===a||"state_not"===a){const t="boolean"==typeof r?r?"on":"off":"string"==typeof r||"number"==typeof r?String(r).trim():"";return!t||t.length>255?e.err(`${i}.${a}`,"Must be a state (text)."):"state"===a?{state:t}:{state_not:t}}if("entity_on"===a)return"boolean"==typeof r?{entity_on:r}:e.err(`${i}.entity_on`,"Must be true or false.");const o=e.num(n,a,`${i}.${a}`,-1e9,1e9);return void 0===o?void 0:"above"===a?{above:o}:{below:o}}(e,o.when,`${r}.when`),c="string"==typeof o.animation?o.animation.trim():"";let d=!0;if(c)if(si(c)){const t=ai(c);t===i?d=!!e.err(`${r}.animation`,"A clip cannot play its own document (use self)."):hi.test(t)||(d=!!e.err(`${r}.animation`,"Not a valid animation id."))}else"self"===c||"none"===c||s.has(c)||(d=!!e.err(`${r}.animation`,"Must be self, none, a preset or custom:<id>."));else d=!!e.err(`${r}.animation`,"Required.");const p=e.oneOf(o,"transition",`${r}.transition`,us);l&&d&&n.push({when:l,animation:c,...p?{transition:p}:{}})}),n}(t,e.clips,"string"==typeof e.id?e.id.trim():"")),s&&n("bindings")&&(i.bindings=function(e,t,i){const n=[];return gs(e,t,"bindings",8)?.forEach((t,s)=>{const a=`bindings[${s}]`,r=e.obj(t,a);if(!r)return;const o=_s(e,r.target,`${a}.target`,i),l=e.oneOf(r,"property",`${a}.property`,hs);void 0===r.property&&e.err(`${a}.property`,"Required.");const c=e.obj(r.input,`${a}.input`);let d,p;if(c){const t=e.num(c,"min",`${a}.input.min`,-1e9,1e9,0),i=e.num(c,"max",`${a}.input.max`,-1e9,1e9,100);void 0!==t&&void 0!==i&&t===i?e.err(`${a}.input.max`,"Must differ from min."):void 0!==t&&void 0!==i&&(d={min:t,max:i}),void 0!==c.attribute&&null!==c.attribute&&""!==c.attribute&&("string"==typeof c.attribute&&ms.test(c.attribute.trim())?d=d&&{attribute:c.attribute.trim(),...d}:(e.err(`${a}.input.attribute`,"Must be an attribute name."),d=void 0))}const h=r.output;if(Array.isArray(h)&&2===h.length)if("color_mix"===l){const t=fi(h[0],"color"),i=fi(h[1],"color");t&&i?p=[t,i]:e.err(`${a}.output`,"color_mix needs two colours.")}else h.every(e=>"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=1e6)?p=[h[0],h[1]]:e.err(`${a}.output`,"Must be two numbers (colours only for color_mix).");else e.err(`${a}.output`,"Must be a pair [from, to].");const u=e.num(r,"smoothing",`${a}.smoothing`,0,10);o&&l&&d&&p&&n.push({target:o,property:l,input:d,output:p,...void 0!==u?{smoothing:u}:{}})}),n}(t,e.bindings,a)),i}ji=$s;const ws=e=>+e.toFixed(4);function ks(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}const Ms=e=>`mcc-${e.id}-${ks(JSON.stringify(e))}`,Ss=(e,t)=>`--mcc-${e}-${t}`;function Cs(e){return at.find(t=>t.id===e)?.css??e??"ease"}const As=e=>({len:(t,i)=>0===t?`0${i}`:`calc(${ws(t)}${i} * var(${Ss(e,"i")}, 1))`,scale:t=>1===t?"1":`calc(1 + ${ws(t-1)} * var(${Ss(e,"i")}, 1))`,color:t=>((e,t)=>t?e.replace(/var\(\s*--mc-anim-c\s*\)/g,(e=>`color-mix(in srgb, var(${Ss(e,"c")}, var(--mc-anim-c)) calc(var(${Ss(e,"s")}, 1) * 100%), transparent)`)(t)):e)(t,e)}),js=(e=1)=>({len:(t,i)=>`${ws(t*e)}${i}`,scale:t=>String(ws(1+(t-1)*e)),color:e=>e});function zs(e,t){const i=[],n=e.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${t.len(n.x??0,"px")} ${t.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const e=n.scale??1,s=e*(n.scale_x??1),a=e*(n.scale_y??1);i.push(["scale",s===a?t.scale(s):`${t.scale(s)} ${t.scale(a)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${t.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${t.len(n.skew_x??0,"deg")}, ${t.len(n.skew_y??0,"deg")})`])}if(void 0!==e.opacity&&i.push(["opacity",String(e.opacity)]),e.color&&i.push(["color",t.color(e.color)]),e.background&&i.push(["background",t.color(e.background)]),e.shadow&&i.push(["box-shadow",t.color(e.shadow)]),void 0!==e.filter||void 0!==e.blur){const n=[e.filter&&"none"!==e.filter?t.color(e.filter):"",void 0!==e.blur?`blur(${t.len(e.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==e.radius&&i.push(["border-radius",`${e.radius}px`]),void 0!==e.draw&&i.push(["stroke-dashoffset",String(ws(1-e.draw))]),e.stroke&&i.push(["stroke",t.color(e.stroke)]),e.easing&&i.push(["animation-timing-function",Cs(e.easing)]),i}const Es=(e,t)=>`  ${e} { ${t.map(([e,t])=>`${e}: ${t};`).join(" ")} }`,Vs=(e,t)=>`@keyframes ${e} {\n${t.join("\n")}\n}`,Ls={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function Ps(e,t,i){const n=t.map(e=>zs(e,i)),s=Object.keys(Ls).filter(e=>t.some(t=>Ls[e].some(e=>void 0!==t.easings?.[e]))),a=Vs(e,t.map((e,t)=>Es(`${ws(e.at)}%`,n[t].filter(([e])=>!s.includes(e)))));if(!s.length)return{css:a,lanes:[]};const r=[],o=[a];for(const i of s){const s=`${e}-l${Ls[i][0]}`,a=[];t.forEach((e,t)=>{const s=n[t].filter(([e])=>e===i);if(!s.length)return;const r=Ls[i].map(t=>e.easings?.[t]).find(e=>void 0!==e),o=r??e.easing;a.push(Es(`${ws(e.at)}%`,o?[...s,["animation-timing-function",Cs(o)]]:s))}),a.length&&(r.push(s),o.push(Vs(s,a)))}return{css:o.join("\n"),lanes:r}}const Ds=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());const Hs=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,a=3*i*t*t,r=t*t*t;return[n*e[0][0]+s*e[1][0]+a*e[2][0]+r*e[3][0],n*e[0][1]+s*e[1][1]+a*e[2][1]+r*e[3][1]]};function Rs(e,t=48){const i=(0,St.Mj)(e).flat();if(!i.length)return[];const n=[i[0][0]];for(const e of i)for(let t=1;t<=16;t++)n.push(Hs(e,t/16));const s=[0];for(let e=1;e<n.length;e++)s.push(s[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const a=s[s.length-1],r=e=>{if(0===a)return n[0];let t=1;for(;t<s.length-1&&s[t]<e;)t++;const i=s[t]-s[t-1]||1,r=Math.min(1,Math.max(0,(e-s[t-1])/i));return[n[t-1][0]+(n[t][0]-n[t-1][0])*r,n[t-1][1]+(n[t][1]-n[t-1][1])*r]},o=[];let l;const c=a/(4*t)||.001;for(let e=0;e<=t;e++){const i=a*e/t,n=r(i),s=r(Math.max(0,i-c)),d=r(Math.min(a,i+c));let p=180*Math.atan2(d[1]-s[1],d[0]-s[0])/Math.PI;if(void 0!==l){for(;p-l>180;)p-=360;for(;p-l<-180;)p+=360}l=p,o.push({t:e/t,x:n[0],y:n[1],angle:p})}return o}function Ns(e,t,i){return Rs(e.d).map(n=>{const s=[["translate",`${t.len(ws(n.x),i[0])} ${t.len(ws(n.y),i[1])}`]];return e.follow_rotation&&s.push(["rotate",`${ws(n.angle)}deg`]),[ws(100*n.t),s]})}const Os=.618034,Ts=e=>e-Math.floor(e);function Fs(e){const t=e.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(t)}")`}function Is(e,t){if(!e)return"border-radius: 50%; background: currentColor;";if("svg"in e){const i=t(e.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=Fs(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const Bs=e=>e&&"icon"in e?{icon:e.icon}:e&&"emoji"in e?{text:e.emoji}:void 0;function qs(e,t=100){const i=e.count;return Array.from({length:i},(n,s)=>{const a=(Ts(s*Os)-.5)*(60/i),r=Math.min(96,Math.max(4,(s+.5)/i*100+a)),o=50+t/100*(r-50),l=e.size[0]+(e.size[1]-e.size[0])*Ts(.381966*s+.25),c=e.colors.length?e.colors[s%e.colors.length]:"",d=[`--mcc-sz: ${ws(l)}px`,"--mcc-sp: "+(s%2?-1:1),`--mcc-dx: ${ws(16*(2*Ts(.7548*s)-1))}`,c&&`--mcc-pc: ${c}`].filter(Boolean).join("; ");return{x:ws(o),phase:ws(Ts(s*Os)),k:i>1?ws(s/i):0,style:d}})}const Ks=(e,t)=>`.mc-anim-fx[data-fx="${e}"] { opacity: var(${Ss(t,"s")}, 1); }\n.mc-anim-fx[data-fx="${e}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${Ss(t,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function Us(e,t,i,n){const s=i.fade?0:1,a=`calc(var(--mcc-sp, 1) * ${ws(i.spin)}deg)`,r=i.gravity,o=`${ws(i.spread/2)}cqmin`,l=r>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":r<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let c,d;switch(i.direction){case"fall":case"rise":{const e="fall"===i.direction?"":"-";c="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s};${l} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${e}100cqh ${e?"-":"+"} var(--mcc-sz) * 2); rotate: ${a}; opacity: ${s}; }`];break}case"drift":c="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${ws(15*r)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${ws(30*r)}cqh; rotate: ${a}; opacity: ${s}; }`];break;case"burst":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(${a}); translate: 0 ${ws(30*r)}cqh; opacity: ${s}; }`];break;case"orbit":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${o} * -1)) rotate(${a}); opacity: 1; }`].filter(Boolean);break;case"spiral":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${s}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${o} * -1)) rotate(${a}); opacity: ${s}; }`]}return`${Ks(e,t)} ${c} ${Is(i.shape,n)} }\n${Vs(e,d)}`}function Gs(e,t,i,n,s){const a=As(t),r=i.follow_rotation?"auto":"0deg",o=e=>Vs(e,Ns(i,a,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([e,t])=>Es(`${e}%`,[...t,["opacity","1"]]))),l=`${Ks(e,t)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${Is(n.shape,s)} }`;if("px"!==i.units)return`${l}\n${o(e)}`;const c='offset-path: path("M0 0 L1 1")';return[l,`@supports (${c}) {`,`  .mc-anim-fx[data-fx="${e}"] > i { offset-path: path("${i.d}"); offset-rotate: ${r}; offset-anchor: center; margin: 0; }`,`  @keyframes ${e} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${c}) {`,o(e),"}"].join("\n")}function Ws(e,t){const i=[],n=[];let s=0;const a="icon"===e.target;return(e.steps??[]).forEach((e,r)=>{let o,l,c,d=e.duration;if(si(e.animation)){const i=t?.(ai(e.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(o=function(e,t=1){if("path"===e.kind&&e.path)return Ns(i=e.path,js(t),"px"===i.units?["px","px"]:["%","%"]).map(([e,t])=>({...Object.fromEntries(t.map(([e,t])=>[Ds(e),t])),offset:ws(e/100)}));var i;if("keyframes"!==e.kind||!e.keyframes)return[];const n=new Map;for(const i of e.keyframes){const e=n.get(i.at)??{};for(const[n,s]of zs(i,js(t)))e[Ds(n)]=s;n.set(i.at,e)}return[...n.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:ws(e/100)}))}(i),d??=i.duration,l=Cs(i.easing),c=i.origin)}else{const t=vt(e.animation);o=t&&!t.channels.includes("fx")?function(e,t={}){const i=vt(e);if(!i)return;const n=wt(t.icon&&i.iconKeyframes?`${e}-icon`:e,t.intensity);return void 0===n?void 0:function(e){const t=new Map;for(const i of e)for(const e of i.offsets){const n=t.get(e)??{};for(const[e,t]of i.decls)n[Mt(e)]=t;t.set(e,n)}return[...t.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:+(e/100).toFixed(4)}))}(kt(n))}(t.id,{icon:a}):void 0,t&&(d??=parseFloat(t.defaults.duration),l=Cs(t.defaults.easing),c=t.origin)}if(!o?.length||!d)return void n.push(r);const p=s+e.delay;i.push({start:ws(p),duration:d,iterations:e.repeat,easing:l??"ease",frames:o,...c&&"center"!==c?{origin:c}:{}}),s=p+d*e.repeat}),{steps:i,total:ws(s),loop:!1!==e.loop,target:e.target,...e.stagger?.children?{stagger:e.stagger.delay}:{},skipped:n}}const Zs=new WeakMap;function Ys(e,t={}){const i=!t.reducedMotion&&(e=>"particles"===e.kind&&!!e.particles?.sim&&!e.particles.preset)(e);let n=i&&function(e){if(ii.failedSims.has(e.id))return;Js!==ii.epoch&&(Xs=new WeakMap,Js=ii.epoch);let t=Xs.get(e);const i=e.particles;try{const n=ii.particles&&!t&&ii.checkSim?.(i.sim,"lenient",{count:i.count,layer:i.layer}).sim;if(n){const s={...i,sim:n},a=e.duration/i.speed,r=ii.particles(e.id,s,a,{aspect:0}),o=r.other;Xs.set(e,t={kind:"particles",name:r.name,css:o?`${r.css}\n${o.css}`:r.css,layer:{front:r.front,particles:r.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:a},...o?{split:{name:o.name,layer:{front:o.front,particles:o.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:a,part:1}}}:{}})}}catch{ii.failedSims.add(e.id)}return t}(e)||function(e,t){if(t.reducedMotion)return{kind:e.kind,name:"",css:"",reduced:!0,..."sequence"===e.kind?{schedule:{steps:[],total:0,loop:!1,target:e.target,skipped:[]}}:{}};if("sequence"===e.kind)return{kind:"sequence",name:Ms(e),css:"",schedule:Ws(e,t.lookup)};const i=Zs.get(e);if(i)return i;const n=Ms(e),s=e=>Qt(e).markup;let a;switch(e.kind){case"keyframes":{const{css:t,lanes:i}=Ps(n,e.keyframes??[],As(e.id));a={kind:"keyframes",name:n,css:t,motion:{target:e.target,origin:e.origin},...i.length?{lanes:i}:{}};break}case"particles":{const t=e.particles;if(t.preset){a={kind:"particles",name:"",css:"",preset:{id:t.preset,...void 0!==t.intensity?{intensity:t.intensity}:{}}};break}a={kind:"particles",name:n,css:Us(n,e.id,t,s),layer:{front:"front"===t.layer,particles:qs(t,t.spread),speed:t.speed,...Bs(t.shape)?{symbol:Bs(t.shape)}:{}}};break}case"path":{const t=e.path;if("particles"===t.subject){const i=t.particles??{count:3,size:[8,8],colors:[]};a={kind:"path",name:n,css:Gs(n,e.id,t,i,s),layer:{front:!1,particles:qs(i),speed:1,...Bs(i.shape)?{symbol:Bs(i.shape)}:{}}};break}const i=Ns(t,As(e.id),"px"===t.units?["px","px"]:["%","%"]).map(([e,t])=>Es(`${e}%`,t));a={kind:"path",name:n,css:Vs(n,i),motion:{target:"icon"===t.subject?"icon":"element",origin:e.origin}};break}}return Zs.set(e,a),a}(e,t);return i&&!ii.particles&&(n={...n,needsParticles:!0}),ii.v2&&ti(e)?{...n,v2:ii.v2(e,t)}:n}let Xs=new WeakMap,Js=0;const Qs=new WeakMap,ea=new WeakMap;function ta(e){let t=ea.get(e);if(!t){const i={...e};delete i.rig,delete i.tracks,delete i.clips,delete i.bindings,t={...i,...$s(e,new Mi)},ea.set(e,t)}return t}function ia(e,t={}){if(t.reducedMotion||!Array.isArray(e.tracks)||!e.tracks.length)return[];let i=Qs.get(e);return i||Qs.set(e,i=function(e,t){const i=As(e.id);return(e.tracks??[]).map((e,n)=>{const s=`${t}-t${n}`,a=[],r=[];if(e.keyframes.length){const t=Ps(s,e.keyframes,i);a.push(t.css),r.push(...t.lanes)}if(e.path){const t=e.keyframes.length?`${s}-path`:s,n={d:e.path.d,units:"px",follow_rotation:!!e.path.follow_rotation,subject:"element"};a.push(Vs(t,Ns(n,i,["px","px"]).map(([e,t])=>Es(`${e}%`,t)))),t!==s&&r.push(t)}return{target:e.target,name:s,css:a.join("\n"),...e.origin?{origin:e.origin}:{},...r.length?{lanes:r}:{}}})}(ta(e),Ms(e))),i}ii.v2=function(e,t={}){const i=ta(e),n=ia(e,t),s=[],a=i.clips?.filter((i,n)=>{if(!si(i.animation))return!0;const a=t.lookup?.(ai(i.animation));return!(a===e||a&&Array.isArray(a.clips)&&a.clips.length)||(s.push(n),!1)});return{tracks:n,...i.rig?{rig:i.rig}:{},...a?{clips:a}:{},...i.bindings?{bindings:i.bindings}:{},...s.length?{skipped:s}:{}}};const{t:na,tc:sa,tx:aa,m:ra,locale:oa}=(0,it.my)("anim-studio",["\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, no icon|, start|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|30 fps|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A rig has at most {groups} groups.|A sequence cannot play itself.|A sequence has at most {steps} steps.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add colour|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation colour|Animation settings|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At most {cLIPS_MAX} states.|At most {colours} colours|At most {count} shapes fit in a rig.|At most {emitters} emitters.|At most {mAX_SHAPES} shapes|At most {max} animations.|At most {max} bindings per animation.|At most {max} characters.|At most {max} entries.|At most {max} particles over all emitters.|At most {shapes} shapes fit in a rig.|At most {steps} steps|At most {tracks} animated targets.|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and colour come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text colour inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first colour to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customise one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Centre|Change count|Change fill|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child colour|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, Enter to finish.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse layers|Collapse {name}|Collide with|Collisions|Colour|Colour mix|Colour {i}|Colour {n}|Colour {n}: entity colour|Colour {n}: {colour}|Colour: currentColor|Colours|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner point|Corner radius|Corner radius (icon units)|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customise a preset|Customise a preset…|Customise one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete keyframe|Delete keyframes|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {count} keyframes|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the centre.|Drag to draw. Shift: square, Alt: from the centre.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity colour|Entity is off|Entity is on|Entity value|Erase|Erase shape|Erase shapes|Event|Expand|Expand layers|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill colour|Filter|Filter presets|Finish cycle|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From colour|From{unit}|Front door|Glow|Gravity|Gravity direction|Gravity {strength} {direction}|Greyscale|Grid|Group|Group of {count, plural, one {# part} other {# parts}}|Group pivot|Group removed|Grouped {count} parts|Groups removed|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Import shape|Import shapes|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximise|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path point|Move pivot|Move point|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and colour on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colours only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colours: particles use the animation colour.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or colour this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation colour.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid colour.|Not a valid easing.|Not an allowed shadow: x y blur spread colour.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open in the layers column|Open path|Open {title}|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child colour|Own timeline|Paint|Part|Part actions|Part of {pieces} shapes|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colours in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.|Pause (Space)|Pause preview|Pen|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {i} of {n}{start}, {kind}, at {x}, {y}|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Remove|Remove colour|Remove colour {i}|Remove colour {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Replace {count} parts|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow colour|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes|Shapes over the icon|Shapes under the icon|Show all|Show all hidden layers|Show in preview|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smooth point|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split into {count, plural, one {# part} other {# parts}}|Split into {count, plural, one {# part} other {# parts}} (the first {parts})|Split into {count} parts|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke colour|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colours become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon colour|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The colour is not a valid CSS colour: the file uses currentColor.|The entity colour button uses the animation colour (the card entry's colour, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count} shapes: the first {parts} became parts (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The library holds at most {cap} animations: only {fit} more fit, {skipped} were not imported.|The library is full ({cap} animations): nothing was imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this colour: while it plays, its colour wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This animation has {tracks} animated targets, the most it can hold. Remove one to animate this part.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To colour|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a colour or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colours|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colours.|corner|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|keyframe|keyframe track|keyframe tracks of {name}|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|smooth|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and colour this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count} keyframes|{count} of {colours}|{count} parts|{count} shapes|{count} targets|{count} targets selected: a preset plays on each (Wave: one after another).|{from} to {to}{unit}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{particles} particles · {emitters} emitters|{pct} % of the input range|{pct}, {seconds} seconds|{preset} on {targets}|{seconds} s loop|{size} KB|{size} icon units|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{where} · {from} to {to}","\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, no icon|, start|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|30 fps|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A rig has at most {groups} groups.|A sequence cannot play itself.|A sequence has at most {steps} steps.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add color|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation color|Animation settings|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At most {cLIPS_MAX} states.|At most {colours} colors|At most {count} shapes fit in a rig.|At most {emitters} emitters.|At most {mAX_SHAPES} shapes|At most {max} animations.|At most {max} bindings per animation.|At most {max} characters.|At most {max} entries.|At most {max} particles over all emitters.|At most {shapes} shapes fit in a rig.|At most {steps} steps|At most {tracks} animated targets.|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and color come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text color inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first color to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customize one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Center|Change count|Change fill|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child color|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, Enter to finish.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse layers|Collapse {name}|Collide with|Collisions|Color|Color mix|Color {i}|Color {n}|Color {n}: entity color|Color {n}: {colour}|Color: currentColor|Colors|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner point|Corner radius|Corner radius (icon units)|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customize a preset|Customize a preset…|Customize one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete keyframe|Delete keyframes|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {count} keyframes|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the center.|Drag to draw. Shift: square, Alt: from the center.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity color|Entity is off|Entity is on|Entity value|Erase|Erase shape|Erase shapes|Event|Expand|Expand layers|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill color|Filter|Filter presets|Finish cycle|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From color|From{unit}|Front door|Glow|Gravity|Gravity direction|Gravity {strength} {direction}|Grayscale|Grid|Group|Group of {count, plural, one {# part} other {# parts}}|Group pivot|Group removed|Grouped {count} parts|Groups removed|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Import shape|Import shapes|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximize|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path point|Move pivot|Move point|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and color on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colors only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colors: particles use the animation color.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or color this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation color.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid color.|Not a valid easing.|Not an allowed shadow: x y blur spread color.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open in the layers column|Open path|Open {title}|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child color|Own timeline|Paint|Part|Part actions|Part of {pieces} shapes|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colors in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle color.|Pause (Space)|Pause preview|Pen|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {i} of {n}{start}, {kind}, at {x}, {y}|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Remove|Remove color|Remove color {i}|Remove color {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Replace {count} parts|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow color|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes|Shapes over the icon|Shapes under the icon|Show all|Show all hidden layers|Show in preview|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smooth point|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split into {count, plural, one {# part} other {# parts}}|Split into {count, plural, one {# part} other {# parts}} (the first {parts})|Split into {count} parts|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke color|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colors become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon color|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The color is not a valid CSS color: the file uses currentColor.|The entity color button uses the animation color (the card entry's color, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count} shapes: the first {parts} became parts (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The library holds at most {cap} animations: only {fit} more fit, {skipped} were not imported.|The library is full ({cap} animations): nothing was imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this color: while it plays, its color wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This animation has {tracks} animated targets, the most it can hold. Remove one to animate this part.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To color|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a color or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colors|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colors.|corner|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|keyframe|keyframe track|keyframe tracks of {name}|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|smooth|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and color this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count} keyframes|{count} of {colours}|{count} parts|{count} shapes|{count} targets|{count} targets selected: a preset plays on each (Wave: one after another).|{from} to {to}{unit}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{particles} particles · {emitters} emitters|{pct} % of the input range|{pct}, {seconds} seconds|{preset} on {targets}|{seconds} s loop|{size} KB|{size} icon units|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{where} · {from} to {to}",'"{name}" heeft wijzigingen die nog niet zijn opgeslagen.|"{name}" had de vorige keer wijzigingen die niet zijn opgeslagen.|% van de grootte|(prefers-reduced-motion: reduce)|, groot|, geen pictogram|, start|, {count} overgeslagen|. Tekst, pictogrammen en achtergrond van de kaart.|0 trekt omlaag, 90 naar links, 180 omhoog, 270 naar rechts.|0 stopt bij de botsing, 1 kaatst terug op volle snelheid.|30 fps|; {skipped} overgeslagen (niet voor dit doel of deze baan)|Een ingebakken lus houdt levensduren binnen één lus.|Een clip kan zijn eigen document niet afspelen (gebruik self).|Een SVG-bestand van de animatie dat zich herhaalt|Een SVG-bestand van de ingebakken deeltjes dat zich herhaalt|Een rig heeft hooguit {groups} groepen.|Een reeks kan zichzelf niet afspelen.|Een reeks heeft hooguit {steps} stappen.|Een reeks duurt zo lang als haar stappen. Kaarten kunnen haar nog schalen met hun Duur.|Een reeks heeft minstens één stap nodig|Ongeveer {percent}% van de deeltjes|Een keyframe toevoegen op de afspeelkop|Een eigenschap toevoegen aan {target}|Voeg een vorm toe om vormen te mengen. Elke vorm krijgt een gewicht.|Een {name}-keyframe toevoegen op de afspeelkop|Toevoegen als vormen|Kleur toevoegen|Emitter toevoegen|Keyframe toevoegen|Bewegingspad toevoegen|Punt toevoegen|Eigenschap toevoegen|Eigenschap toevoegen aan {target} op de afspeelkop ({at})|Vorm toevoegen|Status toevoegen|Stap toevoegen|Voeg de animaties toe die na elkaar worden afgespeeld.|Voeg de tekening toe als vormen over het pictogram, of gebruik haar als het pictogram zelf.|Waardekoppeling toevoegen|{lane}-keyframe toevoegen|{name}-keyframe toevoegen op de afspeelkop|Voegt willekeurige wervelingen toe aan de beweging.|Alarmpaneel|Alle|Alle domeinen|Alle lagen getoond|Alle lagen getoond. Vergrendelingen blijven behouden.|Alle deeltjes|Staat al onderaan|Staat al bovenaan|Ook op {at}|Alt+pijl-omlaag|Alt+pijl-omhoog|Alt+omlaag|Alt+omhoog|Afwisselend|Afwisselend omgekeerd|Een open lijn wordt getekend met haar lijn.|Ankerpunten|Hoek|Hoek (gr.)|De onderdelen van een pictogram animeren|Geanimeerde SVG|Geanimeerde SVG gekopieerd|Animatie|Animatiekleur|Animatie-instellingen|Animatie-instellingen (Esc)|Animatiestudio|Een andere track animeert dit doel al.|Boog|Pijltjes verplaatsen het keyframe, Alt en pijltjes gaan naar het volgende, Delete verwijdert het.|Aan het einde van de levensduur|Hooguit {cLIPS_MAX} statussen.|Hooguit {colours} kleuren|Hooguit {count} vormen passen in een rig.|Hooguit {emitters} emitters.|Hooguit {mAX_SHAPES} vormen|Hooguit {max} animaties.|Hooguit {max} koppelingen per animatie.|Hooguit {max} tekens.|Hooguit {max} items.|Hooguit {max} deeltjes over alle emitters.|Hooguit {shapes} vormen passen in een rig.|Hooguit {steps} stappen|Hooguit {tracks} geanimeerde doelen.|Op de afspeelkop: {filter}|Op de afspeelkop: {text}|Op {at} · {secs} s|Attribuut|Attribuutnamen gebruiken letters, cijfers, _ . en - (geen spaties).|Attribuutnamen gebruiken letters, cijfers, _ . en -.|Achtergrond|Ingebakken lus|Bezig met inbakken…|Gebaseerd op een ingebouwde {kind}|Achter de inhoud|Tussen {min} en {max}; leeg gebruikt {intensity}. Timing en kleur komen uit de animatie-instellingen.|Binaire sensor|Koppeling toegevoegd: {property}.|Koppeling verwijderd.|Koppeling {n}|Zwart in een <img>, de tekstkleur inline.|Lege keyframes|Lege deeltjes|Leeg pad|Lege reeks|Vloeit van de eerste kleur naar de tweede.|Vervagen|Vervaging heeft een eigen baan en wordt aan deze lijst toegevoegd.|Onder|Linksonder|Rechtsonder|Stuiteren|Verhelderen|Naar voren halen|Over het pictogram halen|Vorm naar voren halen|Vorm over het pictogram halen|{name} naar voren halen|{name} over het pictogram halen|Browsers spelen de CSS-keyframes af.|Browsers spelen de CSS-keyframes af; de SMIL-kopie speelt waar CSS-animatie ontbreekt.|Bouw er een vanaf nul of pas een van de voorinstellingen aan. Opgeslagen animaties staan in de animatiekiezer van elke kaart, onder Mijn animaties.|Uitbarsting|Knop|Agenda|Camera|Annuleren|Kan niet afspelen|Kaart|Kaart-YAML gekopieerd: plak hem in een module|Kaart-YAML om te kopiëren|Kaartinhoud|Kaartinhoud. Tekst, pictogrammen en achtergrond van de kaart.|Kaartonderdelen|Kaartthema|Kaarten die hem gebruiken, spelen hem niet meer af, tenzij ze een kopie insluiten.|Kaarten gebruiken hem als|Plafond|Midden|Aantal wijzigen|Vulling wijzigen|Snelheid wijzigen|Spreiding wijzigen|Lijn wijzigen|Gewicht wijzigen|Wijzigt ook de laatste lijn. De stippellijn is wat je tekende.|Kleur van kind|Kinddeeltjes|Kinddeeltjes van {name}|Kindvorm|Kinderen barsten uit vanaf het punt waar ze ontstaan.|Kinderen kunnen geen eigen kinderen hebben.|Kies een voorinstelling|Kies een .svg-bestand.|Kies een andere|Bestand kiezen|Cirkel|Pad wissen|Zoekopdracht wissen|Klik op een onderdeel om het op de tijdlijn te animeren. Shift of Ctrl voegt toe aan de selectie; dubbelklik of F2 hernoemt. H verbergt, S solo, L vergrendelt (alleen voorbeeld).|Klik op een vorm om hem te selecteren, sleep om hem te verplaatsen.|Klik of sleep over vormen om ze te verwijderen.|Klik op het canvas om een punt toe te voegen, klik op de lijn om er een in te voegen.|Klik om punten toe te voegen, sleep voor bochten. Klik op het eerste punt om te sluiten, Enter om af te ronden.|Klik om het volgende punt toe te voegen|Klik om het eerste punt te plaatsen|Klimaat|Sluiten|Pad sluiten|Gesloten|Gesloten pad|Samenvoegen|Lagen samenvouwen|{name} inklappen|Botsen met|Botsingen|Kleur|Kleurmenging|Kleur {i}|Kleur {n}|Kleur {n}: entiteitskleur|Kleur {n}: {colour}|Kleur: currentColor|Kleuren|Veelgebruikte emoji|Klaar op|Bevat een link.|Bevat een element dat iets uitvoert of ophaalt.|Bevat een gebeurtenis-handler.|Bevat een externe verwijzing.|Inhoudsvak|Zet het voorinstel om naar eigen deeltjes om het te exporteren.|Omzetten naar eigen deeltjes|Kopieert pictogram: svg en de SVG als kaart-YAML|Kopiëren|Kopiëren (Ctrl+C)|SVG kopiëren|Kopiëren mislukt: selecteer de tekst hieronder en kopieer hem|Keyframes kopiëren|Kopieer eerst keyframes|Hoekpunt|Hoekstraal|Hoekradius (pictogrameenheden)|Aantal|Aantal per keer|Bedekkend|Overvloeien|Ctrl + scrollwiel zoomt|Ctrl+G|Ctrl+Shift+G|Gebogen|Aangepast|Eigen as ({axis})|Eigen curve|Eigen status|Een voorinstelling aanpassen|Een voorinstelling aanpassen…|Een van de {count} aanpassen|Knippen|Cyclus|Donkere kaart|Standaard|Standaard ({inherited})|Vertraging|Vertraging tussen kinderen|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf ({seconds} s).|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf.|Verwijderen|"{name}" verwijderen?|Verwijderen (Del)|Koppeling verwijderen|Koppeling {n} verwijderen|Keyframe verwijderen|Keyframes verwijderen|Vorm verwijderen|Status verwijderen|Status {i} verwijderen|Stap verwijderen|Stap {i} verwijderen|{count} keyframes verwijderen|{name} verwijderen|"{name}" verwijderd.|Verwijderen mislukt: {message}|Detail|Apparaattracker|Richting|Verwerpen|Domein|Deurbel|Stip|Dubbelklik op een punt om het glad of een hoekpunt te maken.|.svg downloaden|Download gestart|Slepen|Sleep een ervan op de tijdlijn, of gebruik de pijltjestoetsen, om ze samen te verplaatsen.|Sleep punten en handvatten.|Sleep om een lijn te tekenen.|Sleep om te tekenen. Shift: cirkel, Alt: vanuit het midden.|Sleep om te tekenen. Shift: vierkant, Alt: vanuit het midden.|Sleep om te verplaatsen (klikt vast; Shift: vrij, Alt: dupliceren). Ctrl-klik voegt een key toe, Shift-klik selecteert een bereik. Pijltjes verplaatsen, Alt en pijltjes gaan naar de volgende key, Delete verwijdert.|Sleep om te herschikken (Alt+omhoog / Alt+omlaag)|Sleep om het canvas te vergroten of verkleinen (dubbelklik: herstellen)|Sleep, of druk op Alt+omhoog of Alt+omlaag, om de stap te verplaatsen.|Tekenen|Teken vrij; de lijn wordt gladgestreken als je loslaat.|Bewegingspad tekenen|Tekenen uit|Tekenen aan|Teken op het canvas waar de vorm langs gaat, beginnend waar hij rust.|Teken het pad dat het geselecteerde onderdeel volgt, beginnend waar het rust.|Tekenen is alleen voor pictogramonderdelen en vormen.|Tekening|Tekengereedschap|Getekend|Tekent de lijn bij (een batterij of niveau).|Drift|Stuur {name} aan met de waarde van de entiteit: draaisnelheid vanuit het percentage van een ventilator, een vulling vanuit een batterijniveau.|Zet hier een .svg-bestand neer|Slagschaduw|Laat de .svg los om te importeren|Dupliceren|Emitter dupliceren|Dubbele id "{id}".|{count, plural, one {Keyframe} other {Keyframes}} dupliceren|{name} dupliceren|Gedupliceerd als "{name}".|Dupliceren mislukt: {message}|Duur|Elk deeltje kiest een snelheid in dit bereik, gemeten in % van de kortste zijde van de kaart per seconde. Bij 100 steekt een deeltje een vierkante kaart in één seconde over.|Elk deeltje draait de kant die het kiest, naar links of rechts.|Versnelling|Versoepeling naar het volgende keyframe|Versoepelingswaarde|De versoepeling van het keyframe bewerken|Effectvoorinstellingen kunnen niet als status afspelen: speelt niets.|Effecten met een eigen laag kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Element|Ellips|Naam van emitter|Emitters|Emoji|Emoji of symbool|Leeg keyframe|Leeg leest de status. Bijvoorbeeld percentage (ventilator) of helderheid (lamp).|Eindhandvat|Solo beëindigen|Voer een emoji of symbool in.|Entiteitskleur|Entiteit is uit|Entiteit is aan|Entiteitswaarde|Wissen|Vorm wissen|Vormen wissen|Gebeurtenis|Uitvouwen|Lagen uitvouwen|{name} uitklappen|Ontploffen en vallen|Exporteren|Alles exporteren|Animaties exporteren|{name} exporteren|In- en uitfaden|Uitfaden en weer infaden (0,2 s)|Fadet in met de waarde.|Vallen|Ventilator|Acht|Vullen|Vulkleur|Filter|Voorinstellingen filteren|Cyclus afmaken|Vuurvliegjes|Cyclus passend maken|De hele cyclus passend maken|Herstel eerst de gemarkeerde velden.|Plat|Plat (Z)|Omslaan (X)|Zijwaarts kantelen (Y)|Vloer|Stroom|Een getekend pad volgen|Een pad volgen|Rotatie volgen|Het pad volgen|Eén naar voren|Fontein|Uit de vrije hand|Van|Van een voorinstelling|Van kleur|Van{unit}|Voordeur|Gloed|Zwaartekracht|Richting van de zwaartekracht|Zwaartekracht {strength} {direction}|Grijstinten|Raster|Groep|Groep van {count, plural, one {# onderdeel} other {# onderdelen}}|Draaipunt van groep|Groep verwijderd|{count} onderdelen gegroepeerd|Groepen verwijderd|Groeit met de waarde.|Bevat fouten|Hart|Verbergen en solo zijn niet beschikbaar: het deeltjesvoorbeeld kon niet worden opgebouwd.|Verbergen in voorbeeld|Verbergen in voorbeeld (niet opgeslagen)|Verbergen in voorbeeld: de laag blijft op zijn normale waarde|Verbergen, solo en vergrendelen werken alleen in dit voorbeeld.|Hoogste {noun}|Tintverschuiving|Luchtbevochtiger|Pictogram|Pictogram- en emoji-deeltjes worden als stippen geëxporteerd.|Pictogramanimatie|Pictogramanimatie…|Pictogram beweegt alleen het pictogram van de module. Kaarten kunnen het overschrijven.|Pictogramonderdelen|Pictogramonderdelen op het canvas|Pictogram om te splitsen|Pictogram {percent}%|Pictogrammen, emoji of vormen die vallen, stijgen of uitbarsten|Importeren|SVG importeren|Animaties importeren|Vorm importeren|Vormen importeren|{count, plural, one {# animatie} other {# animaties}} geïmporteerd.|Voor de inhoud|Ervoor: deeltjes worden over tekst en pictogrammen getekend. Ze blokkeren nooit klikken.|In-uit|Oneindig|Inspecteur|Wordt gebruikt door {count, plural, one {# kaart} other {# kaarten}}; die spelen hem niet meer af, tenzij ze een kopie insluiten.|Draait mee met de richting waarin het beweegt.|Verder bewerken|Keyframe|Keyframe-inspecteur|Keyframe-tijdlijn|Keyframe-gereedschap|Keyframes|Keys|Soort|Grootste|Grootste afmeting|Grasmaaier|Laag|Laagacties|Laagacties, {name}|Laagnaam|Lagen|Lagen verborgen in het voorbeeld|Links|Linkerrand|Laat eerst de huidige cyclus eindigen|Bibliotheek|Levensduur (s)|Optillen|Licht|Lichte kaart|Lijn|Lijneinden|Live simulatie|Live simulatie wordt als zijn ingebakken lus geëxporteerd.|Live simulatie draait op elk dashboard dat deze kaart toont en gebruikt meer processor, vooral op wandtablets. De export als geanimeerde SVG speelt in plaats daarvan de ingebakken lus af.|Woonkamer|Pictogrambibliotheek laden…|De {kind}-editor laden…|Laden…|Vergrendelen|Vergrendeld|Vergrendeld. Ontgrendel om te bewerken.|Uiterlijk|Herhalen|Lus uit|Lus aan|Lussnelheid (×)|Lussen|Laagste {noun}|Magic Card is niet geladen op deze pagina|Max|Maximaliseren|Mediaspeler|Onderdelen samenvoegen|Min|Min en max moeten verschillen.|Min mag niet boven max liggen.|Gemengd|Modus|Meer voorinstellingen konden niet laden. De ingebouwde voorinstellingen werken nog.|Meer afvlakken: minder punten en een rustiger lijn.|Meer afvlakken: minder punten en een rustiger lijn. De stippellijn is wat je tekende.|Beweging|Bewegingspad|Bewegingspad. Klik om punten toe te voegen, sleep om ze te verplaatsen.|Bewegingspad: selecteer eerst een onderdeel of vorm|Beweging verwijderd|X verplaatsen|Y verplaatsen|Omlaag|Omlaag verplaatsen (eronder getekend)|Omlaag verplaatsen (speelt later)|Emitter achter de inhoud zetten|Emitter omlaag verplaatsen|Emitter voor de inhoud zetten|Emitter omhoog verplaatsen|Handvat verplaatsen|Keyframe verplaatsen|Padpunt verplaatsen|Draaipunt verplaatsen|Punt verplaatsen|Status {i} omlaag verplaatsen|Status {i} omhoog verplaatsen|Stap verplaatsen|Stap {i} verplaatsen|Verplaats in plaats daarvan het element|Verplaats in plaats daarvan het pictogram|Omhoog|Omhoog verplaatsen (bovenop getekend)|Omhoog verplaatsen (speelt eerder)|Venster verplaatsen|{count, plural, one {Keyframe} other {Keyframes}} verplaatsen|{name} omlaag verplaatsen|{name} omlaag verplaatsen (eronder getekend)|{name} omlaag verplaatsen (speelt later)|{name} omhoog verplaatsen (bovenop getekend)|{name} omhoog verplaatsen (speelt eerder)|{name} {where} verplaatsen|{where} verplaatsen|Verplaats, schaal, draai en kleur op een tijdlijn|Omlaag verplaatst: eronder getekend|Omhoog verplaatst: bovenop getekend|Beweging|Bewegingen|Beweegt mee met: {subject}|Beweegt zijwaarts.|Beweegt het onderdeel langs een curve, vanaf zijn rustpositie. Sleep de punten op het canvas.|Beweegt omhoog of omlaag.|{target} verplaatsen.|Moet 1-16 tekens uit a-z, 0-9 en - zijn, en uniek.|Moet SVG-opmaak zijn.|Moet [min, max] px zijn tussen 1 en 200, min ≤ max.|Moet [min, max] zijn.|Moet een lijst zijn.|Moet een bewegingsvoorinstelling of een eigen keyframes- of padanimatie zijn.|Moet een getal zijn.|Moet een paar [van, naar] zijn.|Moet een deeltjes-, ring- of scènevoorinstelling zijn.|Moet een status (tekst) zijn.|Moet een subpad-index zijn (een geheel getal vanaf 0).|Moet een geheel getal zijn.|Moet een attribuutnaam zijn.|Moet een pictogram-id zijn zoals mdi:bell.|Moet een pictogram-id zijn zoals mdi:star.|Moet een object zijn.|Moet tussen 0 en 100% liggen.|Moet tussen {min} en {max} {unit} liggen.|Moet tussen {min} en {max} liggen.|Moet element, icon, name, state, background, part:<id>, group:<id> of shape:<id> zijn.|Moet een van deze zijn: {options}.|Moet self, none, een voorinstelling of custom:<id> zijn.|Moet tekst van hooguit 40 tekens zijn.|Moet tekst zijn.|Moet drie getallen [x, y, z] zijn, niet allemaal 0.|Moet waar of onwaar zijn.|Moet twee getallen zijn (kleuren alleen voor color_mix).|Moet twee getallen [x, y] zijn.|Moet hooguit 8 tekens zijn (een emoji of een symbool).|Moet afwijken van min.|Mijn animaties|Naam|Naam van {name}|Heeft minstens één item nodig.|Heeft minstens {min} items nodig.|Negatief blaast de regen naar links, positief naar rechts. Het bepaalt de richting van de zwaartekracht.|Nieuw|Nieuwe animatie|Nieuwe keyframes|Nieuwe deeltjes|Nieuw pad|Nieuwe reeks|Nieuwe vormen|Volgend keyframe|Geen <svg>-element gevonden.|Geen animatie|Geen animatie komt overeen met “{query}”.|Geen animaties gevonden.|Geen animaties komen overeen met "{query}".|Geen animaties komen overeen.|Nog geen animaties|Geen kleuren: deeltjes gebruiken de animatiekleur.|Geen vrije deeltjes meer. Verlaag een aantal om een emitter toe te voegen.|Geen zwaartekracht|Geen pictogramanimaties komen overeen met "{query}".|Nog geen keyframes: gebruik Eigenschap toevoegen, of dubbelklik op de baan.|Nog geen keys. Voeg keys toe op de tijdlijn om dit onderdeel te draaien, verplaatsen, schalen, te laten vervagen of te kleuren.|Nog geen bewegingspad. Teken er een op het canvas.|Geen voorinstellingen komen overeen met "{query}".|Nog geen eigenschappen geanimeerd. Gebruik Eigenschap toevoegen, of dubbelklik op een baan.|Nog geen vormen: kies een tekengereedschap.|Nog geen stappen|Nog geen stappen. Voeg een clip toe om de reeks te beginnen.|Geen {kind} "{id}" in de rig.|Geen|Niet ingesteld: de deeltjes nemen de animatiekleur.|Normaal|Geen onderdeel van deze rig.|Geen tijdlijnbaan.|Geen geldige animatie-id.|Geen geldige kleur.|Geen geldige versoepeling.|Geen toegestane schaduw: x y vervaging spreiding kleur.|Geen toegestane {kind}-waarde.|Niet gewijzigd: {big}|Niet gevonden|Niet gevonden in Mijn animaties. Deze stap wordt overgeslagen.|Niet geïmporteerd: {list}.|Niet in je animaties: speelt niets tot hij daar is opgeslagen.|Niet op deze tegel|Niet hernoemd: {message}|Niet te serialiseren.|Niet gebruikt|Geen geldige YAML.|Geen geldige paddata (moet met M beginnen).|Niets|Niets (stoppen)|Er wordt niets getekend.|Niets geplakt: die eigenschappen passen hier niet|Er speelt nog niets.|Er is nog niets om te exporteren.|Hier valt nog niets in te stellen.|Getal|Uit|Aan|Bij botsing|Aan betekent actief voor het domein (open, thuis, speelt...).|Eén klik animeert de selectie; stem de keys af op de tijdlijn.|Onion skin|Onion skin: markeer de keyframes rond de afspeelkop|Alleen voor het activeringsmoment.|Alleen keyframe-animaties exporteren als geanimeerde SVG.|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe (de animatieversoepeling).|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe.|Dekking|Dekking (%)|Openen|Open een deeltjesanimatie om de deeltjes te ontwerpen.|Openen in de lagenkolom|Pad openen|{title} openen|Of begin met de pictogrambibliotheek|Baan|Oorsprong|Uitvoer|Over het pictogram|Eigen SVG|Eigen kinderkleur|Eigen tijdlijn|Verf|Onderdeel|Onderdeelacties|Deel van {pieces} vormen|Draaipunt van onderdeel|Onderdeelvoorinstellingen|Onderdeel {i}|Onderdeel {n}|Deeltjes- en reeksanimaties kunnen niet als status afspelen.|Deeltjespictogram|Deeltjeslagen|Deeltjesvoorinstelling|Deeltjessnelheid (% van korte zijde/s)|Deeltjes|Deeltjes langs een pad kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Deeltjes verschijnen en verdwijnen zacht.|Deeltjes spelen op het hele element.|Deeltjes nemen om beurten de kleuren. Kies er een om hem te wijzigen.|Deeltjes volgen het pad na elkaar, over het hele element.|Deeltjes {n}|Onderdelen samengevoegd|Plakken op de afspeelkop in {target} (Ctrl+V)|Keyframes plakken op de afspeelkop|Plak eerst YAML of laad het.|Plak de opmaak van een <svg>.|Pad|Padlagen|Padlagen (geen stapelvolgorde)|Alleen paden en vormen: scripts, stijlen en links worden verwijderd. De vorm wordt gevuld met de deeltjeskleur.|Pauzeren (spatie)|Voorbeeld pauzeren|Pen|Persoon|Fysica|Kies een animatie voor deze stap.|Kies een pictogram, of typ een id zoals mdi:bell-ring.|Draaipunt|Draaipunt van {name}|Draaipunt op het vak van de groep|Draaipunt op het vak van het onderdeel|Draaipunt: {position}|Pixels|Plaatsing|Plant|Afspelen|Afspelen (spatie)|Animaties na elkaar afspelen|Speel de kolommen van een rij of de modules van een kolom na elkaar af.|Afspeelvolgorde|Voorbeeld afspelen|Speel per status van de entiteit iets anders af: een lamp die gloeit als hij aan is en rust als hij uit is. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Afspelen|Afspeelsnelheid|Afspeelkop|Speelt|Speelt bij tikken|Speelt deze animatie sneller of langzamer af.|Punt {i} van {n}{start}, {kind}, op {x}, {y}|Punten staan in % van het bewegende element, dus het pad schaalt mee.|Punten staan in pixels, bij elke grootte hetzelfde.|Punten springen naar nabije punten van het pictogram en andere vormen.|Punten komen op hele pictogrameenheden. Houd Shift ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 10 px. Houd {key} ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 5%. Houd {key} ingedrukt om vrij te plaatsen.|Positie|Positie in de cyclus|Voorinstelling|Draaipunt van voorinstelling|Draaipunt van voorinstelling van {name}|Voorbeeld|Voorbeeldentiteit|Voorbeeld verbergt {count, plural, one {# laag} other {# lagen}}|Voorbeeldstatus|Voorbeeldtegel|Voorbeeldwaarde|Voorbeeld met verminderde beweging|Vorig keyframe|Eigenschap|Eigenschapskeys krijgen hun eigen versoepeling; hele keyframes bepalen de versoepeling van het keyframe.|Straal|Regen|Rechthoek|Opnieuw (Ctrl+Y)|Opnieuw tekenen|Verminderde beweging|Verminderde beweging staat aan, dus het voorbeeld blijft stil.|Verwijderen|Kleur verwijderen|Kleur {i} verwijderen|Kleur {n} verwijderen|Intekenen verwijderen|Emitter verwijderen|Vulling verwijderen|Uit dit keyframe verwijderen|Beweging verwijderen|Bewegingspad verwijderen|Vorm verwijderen|Vorm {n} verwijderen|Lijn verwijderen|De animatie van dit onderdeel verwijderen|{name} uit dit keyframe verwijderen|Hernoemen|Groep hernoemen|Onderdeel hernoemen|{name} hernoemen|Hernoemd|Hernoemd naar "{clean}".|Hernoemen mislukt: {message}|Herhalen|Aantal herhalingen|Het pad vervangen door een {name}|Vervangen door…|{count} onderdelen vervangen|Verplicht.|Draaipunt herstellen|Herstellen naar draaipunt van groep|Herstellen naar draaipunt van onderdeel|Venstergrootte wijzigen|Oorspronkelijke grootte|Niet-opgeslagen wijzigingen herstellen|Niet-opgeslagen wijzigingen herstellen?|Omgekeerd|Richting omkeren|Rechts|Rechterrand|Ring|Ringvoorinstelling|Stijgen|Draaien|Rotatie|Draaisnelheid|Rond|Liniaal in procenten van de cyclus of in seconden|Liniaal in procenten; toon seconden|Liniaal in seconden; toon procenten|SMIL-terugval|SVG|SVG gekopieerd|SVG-vorm|SVG om te kopiëren|Opslaan|Opslaan (Ctrl+S)|Opslaan als geanimeerde SVG|Opslaan als pictogram|Je wijzigingen opslaan?|"{name}" opgeslagen.|Opslaan mislukt.|Opslaan…|Schaal|Schaal X|Schaal Y|Scènevoorinstelling|Schema|Animaties zoeken|Pictogrammen zoeken|Voorinstellingen zoeken|De pictogrambibliotheek doorzoeken|Seizoensscène|Seconden|Startwaarde|Seed {seed} · draai {span}|Kiezen|Selecteer eerst een onderdeel of vorm.|Selecteer een onderdeel of vorm en teken dan zijn bewegingspad.|Alle {name}-keyframes selecteren (Shift voegt toe)|Selecteer twee of meer onderdelen om ze te groeperen.|Naar achteren sturen|Vorm naar achteren sturen|Vorm onder het pictogram sturen|Onder het pictogram sturen|{name} naar achteren sturen|{name} onder het pictogram sturen|Sensor|Reeks|Reeksstappen|Reeksstappen (speelt van eerste naar laatste)|Reeksen die hem afspelen, slaan die stap over: {names}.|Stel icon of svg in, niet beide.|Stel een van builtin, icon, emoji of svg in.|Stel een van from of svg in.|Stel een van icon, emoji of svg in.|Stel een van state, state_not, entity_on, above of below in.|Schaduw|Schaduw en gloed|Schaduwkleur|Schaduwvoorinstellingen|Schaduw {name}|Vorm|Vormmix|Vorm over het pictogram|Vorm onder het pictogram|Vorm {n}|Vorm {n}: {shape}|Vorm {n}: {shape}, gewicht {weight}|Vormen|Vormen over het pictogram|Vormen onder het pictogram|Alles tonen|Alle verborgen lagen tonen|Tonen in voorbeeld|Willekeurig|Willekeurig: nieuwe willekeurige paden|Simulatie|Sirene|Grootte|Grootte (px)|Scheeftrekken|Scheeftrekken X|Scheeftrekken Y|Vertraagt deeltjes in de loop van de tijd.|Kleinste|Kleinste afmeting|Vloeiend|Alles afvlakken|Punt afvlakken|Afvlakking|Afvlakking (s)|Magnetisch raster|Vastklikken op keyframes, de afspeelkop en het raster (houd Shift ingedrukt om vrij te slepen)|Vastklikken|Solo in voorbeeld|Solo in voorbeeld (verbergt de rest, niet opgeslagen)|Solo aan|Gelijkmatig verdeeld langs het pad, 1 tot {particles}.|Vonk|Ontstaan|Kinddeeltjes laten ontstaan|Ontstaat {seconds} s na de geboorte (in te stellen in YAML).|Snelheid|Snelheid (% van korte zijde/s)|Draaiing per lus (gr.)|Draait continu, sneller naarmate de waarde stijgt (een ventilator).|Spiraal|Opnieuw splitsen|Splitsen en beginnen|Terug splitsen in vormen|Pictogram splitsen|Splitsen in {count, plural, one {# onderdeel} other {# onderdelen}}|Splitsen in {count, plural, one {# onderdeel} other {# onderdelen}} (de eerste {parts})|Gesplitst in {count} onderdelen|Splits het pictogram om zijn vormen een voor een te animeren: de klepel van een bel, de bladen van een ventilator.|Opnieuw splitsen vervangt de onderdelen, hun groepen en hun keys.|Bezig met splitsen…|Spreiding|Verspreid over|Verspreid omlaag|Vierkant|Hoogte van het canvas|Kinderen gespreid|Spreiding uit|Spreiding aan|Ster|Begin|Begin opnieuw na de laatste stap.|Startvertraging (s)|Beginnen met een sjabloon|Beginnen met een pictogram|Beginhandvat|Begint op|Status|Status is|Status is niet|Status is niet {state_not}|Status is {state}|Status verplaatst naar positie {to}.|Status {count} toegevoegd: {when}.|Status {i}|Status {i} verwijderd.|Statussen|Statussen (clips) worden niet geëxporteerd: het bestand speelt de eigen tijdlijn van de animatie.|Stapanimatie|Stap verplaatst naar positie {to} van {count}.|Stap verplaatst naar positie {to} van {n}.|Stap {count} toegevoegd: {name}.|Stap {index} verwijderd.|Stap {index} wordt overgeslagen|Stap {index}: {from} tot {to}|Stap {i}|Stap {i} is vergrendeld. Ontgrendel hem in Lagen.|Stappen|Stappen springen tussen waarden; er is geen curve om te bewerken.|Stoppen met tekenen|Recht|Alles recht maken|Streep|Lijn|Lijnkleur|Lijndikte (pictogrameenheden)|Zon|Vervangt het voorinstel door je eigen deeltjes: vorm, beweging, grootte en kleuren worden bewerkbaar.|Wervel|Schakelaar|Direct wisselen|Tikken|Doel|Tekst|Tekst- en pictogramkleur|Die animatie heeft eigen statussen: de kaart slaat deze status over.|Die laag is vergrendeld. Ontgrendel hem in Lagen.|De SMIL-terugval speelt de animatie alleen vooruit af.|De SVG tekent niets.|De SVG heeft geen vormen om te tekenen.|De SVG is groter dan 32 KB.|De SVG is te complex.|De YAML is te groot om te importeren (meer dan 1 MB).|De animatie is groter dan {size} KB.|De animatie is niet geldig: {message}|De animatiebibliotheek is niet verbonden.|De animatie zou groter worden dan {max} KB ({size} KB).|De versoepeling van de animatie ({easingLabel})|De keyframes van de animatie verplaatsen het element.|De keyframes van de animatie verplaatsen het pictogram.|De keyframes van de animatie verplaatsen het pictogram van de module.|De keyframes van de animatie verplaatsen het hele element.|Het vak van het pictogram of van de tekst van de kaart.|De kleur is geen geldige CSS-kleur: het bestand gebruikt currentColor.|De entiteitskleurknop gebruikt de animatiekleur (de kleur van het kaartitem, anders die van de entiteit).|De waarde van de entiteit stuurt {name} aan. Bekijk het met de waardeschuif op het canvas.|Het bestand kon niet worden gelezen.|Het bestand is {size} KB, groter dan 256 KB.|Het bestand loopt in een lus: het aantal herhalingen wordt niet geëxporteerd.|De eerste status die past, speelt; zonder match (of bij een niet-beschikbare entiteit) speelt de eigen tijdlijn. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Het pictogram in rust, zonder animatie. Id\'s blijven op elk onderdeel en elke vorm staan.|Het pictogram heeft geen vormen om te exporteren.|Het pictogram heeft {count} vormen: de eerste {parts} werden onderdelen (het meeste wat een rig aankan), de rest blijft in rust.|Het pictogram is gesplitst in zijn onderdelen. Selecteer een onderdeel en geef het een voorinstelling: slingeren, draaien, intekenen en meer.|De pictogrambibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|Het import- en exportgereedschap kon niet worden geladen. Laad de pagina opnieuw en probeer het nog eens.|De bibliotheek bevat hooguit {cap} animaties: er passen nog maar {fit}, {skipped} zijn niet geïmporteerd.|De bibliotheek is vol ({cap} animaties): er is niets geïmporteerd.|De lijn wordt in de loop van de cyclus ingetekend.|Het uiterlijk verandert een beetje.|De lus haalde de groottelimiet, dus het bestand toont minder deeltjes.|Het pictogram van de module beweegt langs het pad.|De beweging loopt langs het pad terug naar het begin.|De nieuwe animatie "{name}" is de vorige keer niet opgeslagen.|De omtrek wordt in de loop van de cyclus ingetekend, daarna wordt de vorm gevuld.|De omtrek wordt gevolgd, daarna wordt het onderdeel gevuld.|De deeltjesengine is nog niet geladen.|De onderdelen komen uit de eigen SVG van het document, een onderdeel per vorm.|Het pad tekent niets.|Het pad heeft het maximale aantal punten.|Het punt waaromheen het schaalt en draait.|Het punt waaromheen de groep draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het onderdeel draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het voorinstel deze groep draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van de groep. Sleep het op het canvas.|Het punt waaromheen het voorinstel dit onderdeel draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van het onderdeel. Sleep het op het canvas.|Het voorinstel wordt je eigen animatie om te bewerken: bewegingsvoorinstellingen als keyframes, deeltjes- en ringvoorinstellingen met hun instellingen.|Het voorbeeld is geschaald om op het canvas te passen|Het voorbeeld speelt op een echte magic-card. Laad magic-card.js (je dashboardbron) vóór de animatiestudio.|De rig bevat het maximale aantal vormen (48).|Dezelfde seed geeft elke keer dezelfde lus.|De geselecteerde keyframes gebruiken verschillende versoepelingen; een keuze hier stelt ze allemaal in.|De vorm als masker|De vorm draait mee met de richting waarin hij beweegt.|De studio berekent het pad van elk deeltje eenmaal en speelt het af als lus. Licht voor dashboards.|De tijdlijn animeert hier ook het intekenen: terwijl hij speelt, gaat hij voor deze koppeling.|De tijdlijn animeert hier ook de dekking: terwijl hij speelt, gaat zijn dekking voor deze koppeling.|De tijdlijn animeert deze kleur ook: terwijl hij speelt, gaat zijn kleur voor deze koppeling.|De tijdlijn trekt dit doel scheef: terwijl hij speelt, vervangt het scheeftrekken de beweging van deze koppeling.|Het hele element beweegt langs het pad vanaf waar het rust.|Deze gelden voor elke emitter. Plaatsing wordt per emitter ingesteld.|Ze vervangen het uiterlijk van het voorinstel.|Deze animatie|Deze animatie heeft al 24 geanimeerde doelen: verwijder er een om een voorinstelling toe te voegen.|Deze animatie heeft {tracks} geanimeerde doelen, het maximum. Verwijder er een om dit onderdeel te animeren.|Deze kaart speelt engine {engine}; werk Magic Card bij om deze animatie af te spelen.|Dit pictogram kon niet worden geladen. Controleer de pictogram-id, of probeer het opnieuw als Home Assistant bereikbaar is.|Dit pictogram heeft geen vormen om te animeren.|Dit pictogram heeft geen vormen om te splitsen.|Dit is de laatste key van de baan: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit is het laatste keyframe: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit keyframe stelt geen eigenschap in. Voeg er een toe met Eigenschap toevoegen.|Deze lus haalde de groottelimiet, dus hij toont minder deeltjes. Verlaag het aantal of de kinddeeltjes.|Deze lus is groot en laadt daarom trager op wandtablets. Verlaag het aantal of de kinddeeltjes.|Dit onderdeel heeft eigen intekenkeys op de tijdlijn.|Deze voorinstelling kon niet worden geopend: {message}|Deze voorinstelling is niet beschikbaar in deze versie van Magic Card.|Tijdlijn|Tijdlijnweergave|Timer|Timing|Tot|Naar kleur|Gereedschap: {tool}|Boven|Linksboven|Rechtsboven|Naar{unit}|Tracks (gecombineerd, geen volgorde)|Tracks van kaartonderdelen (naam, status, achtergrond) worden niet geëxporteerd.|Overgang|Driehoek|Bijgesneden|Opnieuw proberen|Turbulentie|Draaien|Botser uitzetten|Botser aanzetten|Vervagen uitzetten|Vervagen aanzetten|Zet eerst een botser aan.|Draai het onderwerp in de reisrichting.|Meedraaien met het pad|Draait naar een hoek (een naald of een wijzerplaat).|Niet beschikbaar|Onder het pictogram|Ongedaan maken (Ctrl+Z)|Onverwacht element <{element}>.|Groep opheffen|Eenheden|Onbekende voorinstelling|Onbekende voorinstelling. Deze stap wordt overgeslagen.|Onbekende voorinstelling: speelt niets.|Ontgrendelen|Ontgrendeld|Niet-opgeslagen wijzigingen|Niet-ondersteunde versie (verwacht 1).|Naamloze animatie|Tot {parentsLeft} voor deze emitter. Alle emitters delen {parents} deeltjes.|Gebruik 1-32 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik 1-64 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik Eigen tijdlijn om deze animatie af te spelen.|Gebruik een kleur of een kleurverloop.|Gebruik een voorinstellingsnaam, cubic-bezier(x1, y1, x2, y2) of steps(n).|Gebruik een pictogram-id zoals mdi:bell-ring.|Gebruiken als pictogram|Ingebakken lus gebruiken|currentColor gebruiken|Gebruik filterfuncties zoals brightness(1.2) hue-rotate(30deg); url() is niet toegestaan.|Gebruiken in kaart|Gebruik trefwoorden, lengtes of percentages, bijv. "50% 100%".|Live simulatie gebruiken|De kleuren van de ouder gebruiken|Gebruik hooguit 8 tekens.|{emoji} gebruiken|Gebruikt door {count, plural, one {# kaart} other {# kaarten}}|Stofzuiger|Waarde|Waarde boven|Waarde boven {above}|Waarde onder|Waarde onder {below}|Waardekoppelingen|Waardekoppelingen worden niet geëxporteerd: het bestand speelt af op de getekende waarden.|Klep|Variatie|Golf|Weer|Gewicht|Wat beweegt|Wat opslaan|Wanneer|Heel keyframe|Windhoek (gr.)|Bij verminderde beweging toont de kaart zijn stilstaande staat: deze animatie speelt niet.|X|Y|Zigzag|Zone|Inzoomen|Inzoomen (Ctrl +)|Uitzoomen|Uitzoomen (Ctrl -)|Ingezoomd op het pictogram terwijl je zijn onderdelen bewerkt of tekent|na {seconds}|na {seconds} s|geanimeerd|aan het einde van de levensduur|op {angle}°|achter de inhoud|kindgrootte|kindsnelheid|color_mix heeft twee kleuren nodig.|hoek|custom:{id}|omlaag|linksonder|rechtsonder|sleep {value}|tekengebied|tekent in|emoji|verborgen omdat een andere laag solo staat|verborgen omdat {name} verborgen is|verborgen in het voorbeeld|voor de inhoud|keyframe|keyframe-track|keyframe-tracks van {name}|links|levensduur|live|vergrendeld|vergrendeld omdat de laag waartoe hij behoort vergrendeld is|lussen|mijn animaties|niet op de tegel {tile}|ongeldig|aan|bij botsing|dekking|over het pictogram|speelt eenmaal|rechts|geselecteerd|glad|snelheid|draaiing|startvertraging|status|stap {i} van {count}|stap {i} van {count}, {problem}|de achtergrond|het element|het pictogram|de naam|de status|turbulentie {value}|onder het pictogram|eenheden|onbekende fout|omhoog|linksboven|rechtsboven|{animation} (onbekend)|{below} verborgen|{below} hieronder verborgen|{count, plural, one {# stip} other {# stippen}}|{count, plural, one {# pictogram} other {# pictogrammen}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} gekopieerd|{count, plural, one {# keyframe} other {# keyframes}} verwijderd|{count, plural, one {# keyframe} other {# keyframes}} geplakt op {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} geselecteerd.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} op de tijdlijn. Draai, verplaats, schaal, fade en kleur dit onderdeel daar.|{count, plural, one {# deeltje} other {# deeltjes}} · {flow}|{count, plural, one {# punt} other {# punten}}|{count, plural, one {# vorm} other {# vormen}}|{count, plural, one {# vorm} other {# vormen}}, geschaald in het pictogram|{count, plural, one {# stap} other {# stappen}}|{count, plural, one {# {shape}} other {# {shape}}} {trigger}|{count, plural, one {{names} staat niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om het te zien.} other {{names} staan niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om ze te zien.}}|{count} keyframes|{count} van {colours}|{count} onderdelen|{count} vormen|{count} doelen|{count} doelen geselecteerd: op elk speelt een voorinstelling (Golf: na elkaar).|{from} tot {to}{unit}|{id} (niet gevonden)|{id}: de bibliotheek is vol|{kb} van 32 KB|{key} verplaatst één handvat afzonderlijk.|{key} verwijdert het.|{kind} kan niet in een reeks afspelen. Deze stap wordt overgeslagen.|{label} (de animatie beweegt het)|{label} (de animatie beweegt het) · niet op de tegel {tile}|{label} op {at}|{label} op {at} · {value}|{label} versoepeling naar de volgende key|{label} staat niet op de tegel {tile}|Baan {label}|Voorinstelling {label}|Gereedschap {label}. {hint}|{label} · niet op de tegel {tile}|{lane}-keyframe|{list}, stuiter {bounce}|{min}–{max} px|{names} delen deze curve.|{name} (kopie {n})|{name} (kopie)|Animatie {name}|{name} kopie|{name} verborgen in het voorbeeld|{name} is vergrendeld. Ontgrendel hem in Lagen.|{name} is nu stap {to} van {count}|{name} staat nu {where}.|Keyframes van {name}|{name} vergrendeld|{name} achter de inhoud gezet|{name} voor de inhoud gezet|{name} {direction} verplaatst|{name} {direction} verplaatst, positie {position} van {count}|{name} {where} verplaatst|{name} staat niet meer solo|Instellingen van {name}|{name} getoond in het voorbeeld|{name} solo in het voorbeeld|{name} ontgrendeld|{name}, achter de inhoud|{name}, voor de inhoud|{name}: {count, plural, one {# key} other {# keys}}|{now} van {total} seconden|{particles} deeltjes · {emitters} emitters|{pct} % van het invoerbereik|{pct}, {seconds} seconden|{preset} op {targets}|Lus van {seconds} s|{size} KB|{size} pictogrameenheden|{steps}, {total} per cyclus, {loop}{skipped}.|{target}-keyframe|{target} {lane}-keyframe|{target} · op {at} · {secs} s|{where} · {from} tot {to}']),la=e=>e.length<2?e[0]??"":new Intl.ListFormat(oa(),{style:"long",type:"conjunction"}).format(e),ca="sensor.mc_studio_living_room",da=[{id:"icon",label:383,icon:"mdi:bell-ring-outline",targets:["element","icon"]},{id:"button",label:127,icon:"mdi:gesture-tap-button",targets:["element","icon","name"]},{id:"text",label:924,icon:"mdi:format-text",targets:["element","name"]},{id:"card",label:132,icon:"mdi:card-text-outline",targets:["element","icon","name","state","background"],entities:{[ca]:{state:"21.5",attributes:{friendly_name:436,unit_of_measurement:"°C",device_class:"temperature",state_class:"measurement"}}}}],pa=e=>da.find(t=>t.id===e)??da[0];function ha(e,t,i,n){const s={text_align:"center",...n?{animations:n}:{}};switch(e){case"icon":return{id:t,type:"icon",icon:"mdi:bell-ring",size:i?"36px":"64px",design:s};case"button":return{id:t,type:"button",label:na(252),icon:"mdi:bell",design:s};case"text":return{id:t,type:"text",text:na(359),design:{...s,font_size:i?"18px":"28px",font_weight:"500"}};case"card":return{id:t,type:"info",entity:ca,icon:"mdi:thermometer",show_icon:!0,show_name:!0,show_state:!0,design:{...s,text_align:"left",background_color:"var(--secondary-background-color, #f2f3f5)",border_radius:"12px",padding:i?"8px 10px":"14px 18px"}}}}function ua(e,t){const i=pa(e).entities;if(!i)return t;let n=ma.get(t);n||ma.set(t,n=new Map);const s=n.get(e);if(s)return s;const a={};for(const[e,t]of Object.entries(i)){const i=t.attributes.friendly_name;a[e]={entity_id:e,state:t.state,attributes:void 0===i?t.attributes:{...t.attributes,friendly_name:na(i)},last_changed:"",last_updated:"",context:{id:""}}}const r={...t,states:{...a,...t.states??{}}};return n.set(e,r),r}const ma=new WeakMap,ga={"A clip cannot play its own document (use self).":()=>na(14),"A sequence cannot play itself.":()=>na(18),"Another track already animates this target.":()=>na(71),"Children cannot have children of their own.":()=>na(155),"color_mix needs two colours.":()=>na(1102),"Draw-on is only for icon parts and shapes.":()=>na(274),"Min must not be above max.":()=>na(457),"Must be [min, max] px between 1 and 200, min ≤ max.":()=>na(512),"Must be [min, max].":()=>na(513),"Must be 1-16 of a-z, 0-9 and -, and unique.":()=>na(510),"Must be a list.":()=>na(514),"Must be a motion preset or a custom keyframes / path animation.":()=>na(515),"Must be a number.":()=>na(516),"Must be a pair [from, to].":()=>na(517),"Must be a particle, ring or scene preset.":()=>na(518),"Must be a state (text).":()=>na(519),"Must be a subpath index (a whole number from 0).":()=>na(520),"Must be a whole number.":()=>na(521),"Must be an attribute name.":()=>na(522),"Must be an icon id like mdi:bell.":()=>na(523),"Must be an icon id like mdi:star.":()=>na(524),"Must be an object.":()=>na(525),"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.":()=>na(529),"Must be self, none, a preset or custom:<id>.":()=>na(531),"Must be SVG markup.":()=>na(511),"Must be text of at most 40 characters.":()=>na(532),"Must be text.":()=>na(533),"Must be three numbers [x, y, z], not all 0.":()=>na(534),"Must be true or false.":()=>na(535),"Must be two numbers (colours only for color_mix).":()=>na(536),"Must be two numbers [x, y].":()=>na(537),"Must be up to 8 characters (an emoji or a symbol).":()=>na(538),"Must differ from min.":()=>na(539),"Needs at least one entry.":()=>na(543),"No <svg> element found.":()=>na(554),"Not a part of this rig.":()=>na(577),"Not a timeline lane.":()=>na(578),"Not a valid animation id.":()=>na(579),"Not a valid colour.":()=>na(580),"Not a valid easing.":()=>na(581),"Not serialisable.":()=>na(591),"Not valid path data (it must start with M).":()=>na(594),"Only for the trigger time.":()=>na(610),"Required.":()=>na(742),"Set icon or svg, not both.":()=>na(806),"Set one of builtin, icon, emoji or svg.":()=>na(807),"Set one of from or svg.":()=>na(808),"Set one of icon, emoji or svg.":()=>na(809),"Set one of state, state_not, entity_on, above or below.":()=>na(810),"The path draws nothing.":()=>na(969),"The SVG draws nothing.":()=>na(929),"The SVG has no shapes to draw.":()=>na(930),"The SVG is larger than 32 KB.":()=>na(931),"The SVG is too complex.":()=>na(932),"Unsupported version (expected 1).":()=>na(1046),"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>na(1049),"Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>na(1050),'Use keywords, lengths or percentages, e.g. "50% 100%".':()=>na(1060)},fa=[[/^At most (\d+) animations\.$/,e=>na(80,{max:+e[1]})],[/^At most (\d+) characters\.$/,e=>na(82,{max:+e[1]})],[/^At most (\d+) entries\.$/,e=>na(83,{max:+e[1]})],[/^At most (\d+) particles over all emitters\.$/,e=>na(84,{max:+e[1]})],[/^Duplicate id "(.*)"\.$/,e=>na(286,{id:e[1]})],[/^Must be between (\S+) and (\S+)\.$/,e=>na(528,{min:e[1],max:e[2]})],[/^Must be one of: (.+)\.$/,e=>na(530,{options:e[1]})],[/^Needs at least (\d+) entries\.$/,e=>na(544,{min:+e[1]})],[/^No (\w+) "(.*)" in the rig\.$/,e=>na(573,{kind:e[1],id:e[2]})],[/^Not an allowed (\w+) value\.$/,e=>na(583,{kind:e[1]})],[/^The animation is larger than (\d+) KB\.$/,e=>na(934,{size:+e[1]})],[/^This card plays engine (\d+); update Magic Card to play this animation\.$/,e=>na(995,{engine:+e[1]})]];function va(e){const t=ga[e];if(t)return t();for(const[t,i]of fa){const n=t.exec(e);if(n)return i(n)}return e}const ba={keyframes:411,particles:642,path:654,sequence:802},ya={keyframes:"mdi:vector-polyline",particles:"mdi:shimmer",path:"mdi:vector-curve",sequence:"mdi:format-list-numbered"};class xa{constructor(e,t=600,i=100){this.current=e,this._mergeMs=t,this._limit=i,this._past=[],this._future=[],this._lastAt=0}push(e,t,i=Date.now()){void 0!==t&&t===this._lastKey&&i-this._lastAt<this._mergeMs&&this._past.length>0||(this._past.push(this.current),this._past.length>this._limit&&this._past.shift()),this.current=e,this._future=[],this._lastKey=t,this._lastAt=i}replace(e){this.current=e,this._future=[]}revert(){const e=this._past.pop();void 0!==e&&(this.current=e,this._lastKey=void 0)}canUndo(){return this._past.length>0}canRedo(){return this._future.length>0}undo(){const e=this._past.pop();if(void 0!==e)return this._future.push(this.current),this.current=e,this._lastKey=void 0,e}redo(){const e=this._future.pop();if(void 0!==e)return this._past.push(this.current),this.current=e,this._lastKey=void 0,e}reset(e){this.current=e,this._past=[],this._future=[],this._lastKey=void 0}}function _a(e,t){const i=function(e){return e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"animation"}(e);if(!t(i))return i;for(let e=2;;e++){const n=`${i.slice(0,60)}-${e}`;if(!t(n))return n}}function $a(e,t){const i=na(1201,{name:e});if(!t.has(i))return i.slice(0,80);for(let i=2;;i++){const n=na(1200,{name:e,n:i});if(!t.has(n))return n.slice(0,80)}}function wa(e){return(e.steps??[]).filter(e=>e.animation.startsWith(ni)).map(e=>e.animation.slice(7))}function ka(e,t,i){const n=i.as??"studio-preview",s={...e,id:n},a=i.still?[]:[{id:"preview",preset:ni+n,...i.entity?{entity:i.entity}:{}}],r=(e=>"particles"===e.kind||"path"===e.kind&&"particles"===e.path?.subject||"sequence"===e.kind&&!!e.stagger?.children)(e),o="sequence"===e.kind&&!!e.stagger?.children,l=!r&&a.length?a:void 0,c=(o?["a","b","c"]:["a"]).map(e=>({id:`c${e}`,vertical_align:"center",modules:[ha(i.tile,`m${e}`,!!i.thumb,l)]})),d={type:"custom:magic-card",rows:[{id:"r",layout:o?"1-1-1":"1",columns:c,design:{min_height:i.thumb?"112px":"icon"!==i.tile||r?"240px":"144px",border_radius:"12px",...r&&a.length?{animations:a}:{}}}]},p=new Map([[n,s]]),h=function(e,t){const i=new Map((n=e.custom_animations,Array.isArray(n)?n.filter(e=>!!e&&"object"==typeof e):n&&"object"==typeof n?Object.entries(n).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]).map(e=>[String(e.id),e]));var n;const s=new Map,a=[],r=function(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[n,s]of Object.entries(e))if("custom_animations"!==n)if("preset"===n&&si(s)){const e=ai(s);e&&t.add(e)}else s&&"object"==typeof s&&i(s)};return i(e),[...t]}(e);for(;r.length;){const e=r.shift();if(s.has(e)||a.includes(e))continue;const n=t(e)??i.get(e);if(!n){a.push(e);continue}s.set(e,n);const o=n.steps;for(const e of Array.isArray(o)?o:[])"string"==typeof e?.animation&&e.animation.startsWith(ni)&&r.push(ai(e.animation))}if(!s.size)return{config:e,embedded:[],missing:a};const o=[...s.keys()];for(const[e,t]of i)s.has(e)||s.set(e,t);return{config:{...e,custom_animations:[...s.values()]},embedded:o,missing:a}}(d,e=>p.get(e)??t(e));return h.config}function Ma(e,t){const i=new Map,n=e=>{if(!i.has(e.id)){i.set(e.id,e);for(const i of wa(e)){const e=t.get(i);e&&n(e)}}};return e.forEach(n),[...i.values()].map(e=>{const{id:t,name:i,...n}=JSON.parse(JSON.stringify(e));return{id:t,name:i,data:n}})}const Sa=c`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`,Ca=c`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px} .with-action>.input{padding-right:44px}.with-icon>.field-action{position:absolute;right:4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;padding-left:10px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{transform:translateX(16px)}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:left}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:left}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`,Aa=c`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,ja=c`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,za=[Sa,Ca,c`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,c`
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
      grid-template-columns: var(--layers-w) minmax(0, 1fr) var(--insp-w);
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }
    .workspace.compact {
      --layers-w: 224px;
      --insp-w: 288px;
    }
    .workspace.dense:not(.rail) {
      --layers-w: 208px;
    }
    .workspace.rail {
      --layers-w: 52px;
    }
    .workspace.slide {
      grid-template-columns: var(--layers-w) minmax(0, 1fr);
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
    .layers.rail .layers-head {
      justify-content: center;
      padding: 4px;
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
    .layers.rail .layers-body {
      padding: 6px;
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
    /* the rail's buttons that open the column at a panel, under the targets */
    .rail-panels {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid var(--mc-divider);
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
    .layers.rail .layer {
      justify-content: center;
      padding: 0;
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
        minmax(${l(160)}px, calc(var(--split, 0.4) * 100%))
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
  `],Ea={keyframes:{tag:"mc-anim-keyframes-editor",place:"panel",title:1007},particles:{tag:"mc-anim-particles-editor",place:"inspector",title:642},path:{tag:"mc-anim-path-editor",place:"inspector",title:654},sequence:{tag:"mc-anim-sequence-editor",place:"inspector",title:908}},Va="mc-anim-path-overlay",La=e=>"undefined"!=typeof customElements&&!!customElements.get(e),Pa={kind:"none"},Da=[];function Ha(e){const t=Da.findIndex(t=>t.tag===e.tag&&t.place===e.place);t>=0?Da[t]=e:Da.push(e)}function Ra(e,t,i){return Da.map((e,t)=>({p:e,i:t})).filter(({p:n})=>{if(n.place!==e)return!1;try{return n.when(t,i)}catch{return!1}}).sort((e,t)=>e.p.order-t.p.order||e.i-t.i).map(({p:e})=>e)}const Na="var(--mc-anim-c)",Oa=[{id:"x",label:468,group:"Transform",icon:"mdi:arrow-left-right",kind:"number",def:{transform:{x:0}}},{id:"y",label:469,group:"Transform",icon:"mdi:arrow-up-down",kind:"number",def:{transform:{y:0}}},{id:"scale",label:777,group:"Transform",icon:"mdi:resize",kind:"number",def:{transform:{scale:1}}},{id:"scale_x",label:778,group:"Transform",icon:"mdi:arrow-expand-horizontal",kind:"number",def:{transform:{scale_x:1}}},{id:"scale_y",label:779,group:"Transform",icon:"mdi:arrow-expand-vertical",kind:"number",def:{transform:{scale_y:1}}},{id:"rotate",label:757,group:"Transform",icon:"mdi:rotate-right",kind:"number",def:{transform:{rotate:0}}},{id:"skew",label:835,group:"Transform",icon:"mdi:vector-polygon",kind:"number",def:{transform:{skew_x:0,skew_y:0}}},{id:"opacity",label:614,group:"Appearance",icon:"mdi:circle-opacity",kind:"number",def:{opacity:1}},{id:"color",label:180,group:"Appearance",icon:"mdi:format-color-text",kind:"css",def:{color:Na}},{id:"background",label:94,group:"Appearance",icon:"mdi:format-color-fill",kind:"css",def:{background:`color-mix(in srgb, ${Na} 20%, transparent)`}},{id:"shadow",label:812,group:"Appearance",icon:"mdi:box-shadow",kind:"css",def:{shadow:`0 0 16px 2px ${Na}`}},{id:"blur",label:110,group:"Appearance",icon:"mdi:blur",kind:"number",def:{blur:0}},{id:"radius",label:205,group:"Appearance",icon:"mdi:rounded-corner",kind:"number",def:{radius:0}},{id:"filter",label:335,group:"Appearance",icon:"mdi:auto-fix",kind:"css",def:{filter:"brightness(1.2)"}}],Ta=[{id:"draw",label:271,group:"Appearance",icon:"mdi:draw",kind:"number",def:{draw:1},rig:!0},{id:"stroke",label:915,group:"Appearance",icon:"mdi:border-color",kind:"css",def:{stroke:Na},rig:!0}],Fa=[...Oa,...Ta],Ia=Object.fromEntries(Fa.map(e=>[e.id,e])),Ba=e=>!!e&&/^(part|group|shape):/.test(e),qa=e=>na(Ia[e].label),Ka=e=>Ba(e)?Fa:Oa,Ua=[["x","y"],["scale","scale_x","scale_y"],["filter","blur"]],Ga=e=>Ua.find(t=>t.includes(e))??[e],Wa={x:["x"],y:["y"],scale:["scale"],scale_x:["scale_x"],scale_y:["scale_y"],rotate:["rotate","axis"],skew:["skew_x","skew_y"]};function Za(e,t){if("*"===t)return!0;const i=Wa[t];return i?"rotate"===t?void 0!==e.transform?.rotate:i.some(t=>void 0!==e.transform?.[t]):void 0!==e[t]}const Ya=e=>Fa.every(t=>!Za(e,t.id));function Xa(e,t){const i=Wa[t];if(i){const t={};for(const n of i){const i=e.transform?.[n];void 0!==i&&(t[n]=Array.isArray(i)?[...i]:i)}return{transform:t}}const n=e[t];return void 0===n?{}:{[t]:n}}function Ja(e,t){const i={...e};for(const[n,s]of Object.entries(t))"transform"===n?i.transform={...e.transform??{},...s}:i[n]=s;return i.transform&&!Object.keys(i.transform).length&&delete i.transform,i}function Qa(e,t){const i={...e};if(i.easings&&void 0!==i.easings[t]){const e={...i.easings};delete e[t],Object.keys(e).length?i.easings=e:delete i.easings}const n=Wa[t];if(n){if(i.transform){const e={...i.transform};for(const t of n)delete e[t];Object.keys(e).length?i.transform=e:delete i.transform}}else delete i[t];return i}const er=e=>Fa.filter(t=>e.some(e=>Za(e,t.id))).map(e=>e.id),tr=e=>`${e.lane}@${e.at}`;function ir(e){const t=e.lastIndexOf("@");return{lane:e.slice(0,t),at:Number(e.slice(t+1))}}function nr(e,t){return[...new Set(e.filter(e=>Za(e,t)).map(e=>e.at))].sort((e,t)=>e-t)}const sr=(e,t)=>e.some(e=>e.at===t.at&&Za(e,t.lane));function ar(e,t,i){return e.filter(e=>e.at===i&&Za(e,t)).reduce((e,i)=>Ja(e,Xa(i,t)),{})}function rr(e,t){let i;for(const n of e)n.at===t&&n.easing&&(i=n.easing);return i}function or(e,t,i){let n;for(const s of e)s.at===i&&s.easings?.[t]&&(n=s.easings[t]);return n}function lr(e,t,i,n){const s=Ga(t),a=e.map((e,t)=>e.at===i&&s.some(t=>Za(e,t))?t:-1).filter(e=>e>=0);return a.length?e.map((e,t)=>{if(e.at!==i)return e;const r={...e.easings??{}};for(const e of s)delete r[e];if(n&&a.includes(t))for(const t of s)Za(e,t)&&(r[t]=n);const o={...e};return Object.keys(r).length?o.easings=r:delete o.easings,o}):e}const cr=e=>e.map((e,t)=>[e,t]).sort((e,t)=>e[0].at-t[0].at||e[1]-t[1]).map(([e])=>e),dr=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));function pr(e,t,i,n,s){const a=s&&Object.keys(s).length?{...s}:void 0,r=e.map(e=>e.at).lastIndexOf(t);if(r<0)return[...e,{at:t,...Ja({},i),...n?{easing:n}:{},...a?{easings:a}:{}}];const o=[...e];return o[r]=Ja(o[r],i),n&&!o[r].easing&&(o[r]={...o[r],easing:n}),a&&(o[r]={...o[r],easings:{...o[r].easings??{},...a}}),o}function hr(e,t){if("*"===t.lane)return e.filter(e=>e.at!==t.at);const i=t.lane;return e.flatMap(e=>{if(e.at!==t.at||!Za(e,i))return[e];const n=Qa(e,i);return Ya(n)?[]:[n]})}function ur(e,t,i){const n={};for(const s of e)if(s.at===t&&s.easings)for(const[e,t]of Object.entries(s.easings))void 0===t||i&&!i.includes(e)||(n[e]=t);return Object.keys(n).length?n:void 0}function mr(e,t){if(!sr(e,t))return;if("*"===t.lane){const i=e.filter(e=>e.at===t.at);return{key:t,frag:i.reduce((e,t)=>Ja(e,function(e){return Fa.reduce((t,i)=>Za(e,i.id)?Ja(t,Xa(e,i.id)):t,{})}(t)),{}),easing:rr(e,t.at),easings:ur(e,t.at)}}const i=e.filter(e=>e.at===t.at),n=i.every(e=>Fa.every(i=>i.id===t.lane||!Za(e,i.id)));return{key:t,frag:ar(e,t.lane,t.at),easing:n?rr(e,t.at):void 0,easings:ur(e,t.at,[t.lane])}}function gr(e){const t=new Set(e.filter(e=>"*"===e.lane).map(e=>e.at)),i=new Set;return e.filter(e=>{const n=tr(e);return!(i.has(n)||"*"!==e.lane&&t.has(e.at)||(i.add(n),0))})}function fr(e,t){if(!e.length)return 0;const i=Math.min(...e.map(e=>e.at)),n=Math.max(...e.map(e=>e.at));return Math.min(100-n,Math.max(-i,t))}function vr(e,t,i,n=!1){const s=gr(t).filter(t=>sr(e,t)),a=fr(s,i);if(!s.length||0===a&&!n)return{keyframes:e,selection:s};const r=s.map(t=>mr(e,t)).filter(Boolean);let o=e;if(!n)for(const e of r)o=hr(o,e.key);const l=[];for(const e of[...r].sort((e,t)=>("*"===e.key.lane?0:1)-("*"===t.key.lane?0:1))){const t=dr(e.key.at+a);o=pr(o,t,e.frag,e.easing,e.easings),l.push({lane:e.key.lane,at:t})}return{keyframes:cr(o),selection:l}}function br(e,t){let i=e;for(const e of gr(t))i=hr(i,e);return i}const yr=(e,t,i)=>e+(t-e)*i,xr=(e,t=4)=>Math.round(e*10**t)/10**t;function _r(e,t,i,n="ease"){const s=nr(e,t);if(!s.length)return;if(s.includes(i))return ar(e,t,i);const a=s.find(e=>e>i),r=[...s].reverse().find(e=>e<i);if(void 0===r)return ar(e,t,a);if(void 0===a)return ar(e,t,r);const o=(i-r)/(a-r),l=function(e,t){const i=e?.match(/^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+)\s*)?\)$/);if(i){const e=Math.max(1,Number(i[1])),n="start"===i[2]||"jump-start"===i[2];return Math.min(1,(n?Math.ceil(t*e):Math.floor(t*e))/e)}return function([e,t,i,n],s){if(s<=0)return 0;if(s>=1)return 1;const a=t=>3*e*t*(1-t)**2+3*i*t**2*(1-t)+t**3,r=e=>3*t*e*(1-e)**2+3*n*e**2*(1-e)+e**3,o=t=>3*e*(1-t)**2+6*(i-e)*t*(1-t)+3*(1-i)*t**2;let l=s;for(let e=0;e<8;e++){const e=a(l)-s;if(Math.abs(e)<1e-6)return r(l);const t=o(l);if(Math.abs(t)<1e-6)break;l-=e/t}let c=0,d=1;l=s;for(let e=0;e<40;e++){const e=a(l);if(Math.abs(e-s)<1e-6)break;e<s?c=l:d=l,l=(c+d)/2}return r(l)}(eo(e)??[0,0,1,1],t)}(((e,t,i)=>or(e,t,i)??rr(e,i))(e,t,r)??n,o);return function(e){const t={...e};for(const e of["opacity","blur","radius","draw"])void 0!==t[e]&&(t[e]=xr(t[e],"opacity"===e||"draw"===e?3:2));if(t.transform){const e={...t.transform};for(const[t,i]of Object.entries(e))"number"==typeof i&&(e[t]=xr(i,t.startsWith("scale")?3:2));t.transform=e}return t}(function(e,t,i){const n={},s=["opacity","blur","radius","draw"];for(const a of s){const s=e[a],r=t[a];void 0===s&&void 0===r||(n[a]=yr(s??r,r??s,i))}if(e.transform||t.transform){const s=e.transform??{},a=t.transform??{},r={};for(const e of["x","y","scale","scale_x","scale_y","rotate","skew_x","skew_y"]){const t=s[e],n=a[e];void 0===t&&void 0===n||(r[e]=yr(t??n,n??t,i))}const o=s.axis??a.axis;o&&(r.axis=[...o]),n.transform=r}for(const s of["color","background","shadow","filter","stroke"]){const a=i<1?e[s]??t[s]:t[s]??e[s];void 0!==a&&(n[s]=a)}return n}(ar(e,t,r),ar(e,t,a),l))}function $r(e,t,i){return e.map(e=>{if(e.at!==t)return e;const n={...e};return i?n.easing=i:delete n.easing,n})}function wr(e,t){const i=gr(t).filter(t=>sr(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at));return{items:i.map(t=>{const i=mr(e,t);return{lane:t.lane,dt:t.at-n,frag:kr(i.frag),easing:i.easing,...i.easings?{easings:{...i.easings}}:{}}})}}const kr=e=>JSON.parse(JSON.stringify(e));function Mr(e,t,i){let n=e;const s=[],a=[...t.items].sort((e,t)=>("*"===e.lane?0:1)-("*"===t.lane?0:1));for(const e of a){const t=dr(i+e.dt);n=pr(n,t,kr(e.frag),e.easing,e.easings),s.push({lane:e.lane,at:t})}return{keyframes:cr(n),selection:s}}let Sr;const Cr=new Set,Ar=()=>Sr;function jr(e){Sr=e;for(const e of Cr)e()}const zr={x:e=>({transform:{x:e}}),y:e=>({transform:{y:e}}),scale:e=>({transform:{scale:e}}),scale_x:e=>({transform:{scale_x:e}}),scale_y:e=>({transform:{scale_y:e}}),rotate:e=>({transform:{rotate:e}}),skew:e=>({transform:{skew_x:e,skew_y:0}}),opacity:e=>({opacity:Math.min(1,Math.max(0,e))}),blur:e=>({blur:Math.max(0,e)}),radius:e=>({radius:Math.max(0,e)}),draw:e=>({draw:Math.min(1,Math.max(0,e))})},Er=["color","background","stroke"];function Vr(e,t,i){if(e===t)return kr(i);const n=e=>["x","y"].includes(e)?"move":["scale","scale_x","scale_y"].includes(e)?"scale":["opacity","draw"].includes(e)?"unit":["blur","radius"].includes(e)?"px":e;if(zr[e]&&zr[t]&&n(e)===n(t)){const n=function(e,t){const i=t.transform??{};switch(e){case"x":case"y":case"scale":case"scale_x":case"scale_y":case"rotate":return i[e];case"skew":return i.skew_x;default:{const i=t[e];return"number"==typeof i?i:void 0}}}(e,i);return void 0===n?void 0:zr[t](n)}if(Er.includes(e)&&Er.includes(t)){const n=i[e];return"string"==typeof n?{[t]:n}:void 0}}const Lr={element:{label:300,icon:"mdi:card-outline"},icon:{label:383,icon:"mdi:emoticon-outline"},name:{label:541,icon:"mdi:format-text"},state:{label:888,icon:"mdi:information-outline"},background:{label:94,icon:"mdi:texture-box"}};function Pr(e,t){if(Lr[t])return na(Lr[t].label);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return n?.find(e=>e.id===i[2])?.name??i[2]}const Dr=e=>Lr[e]?.icon??(e.startsWith("group:")?"mdi:group":e.startsWith("shape:")?"mdi:vector-square":"mdi:puzzle-outline"),Hr=e=>"icon"===e.target?"icon":"element";function Rr(e){const t=[{target:Hr(e),keyframes:e.keyframes??[],main:!0}];for(const i of e.tracks??[])t.some(e=>e.target===i.target)||t.push({target:i.target,keyframes:i.keyframes??[],main:!1});return t}function Nr(e,t){return t===Hr(e)?e.keyframes??[]:e.tracks?.find(e=>e.target===t)?.keyframes??[]}function Or(e,t,i){if(t===Hr(e))return{...e,keyframes:i};const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s>=0){const e={...n[s],keyframes:i};i.length||e.path||e.origin?n[s]=e:n.splice(s,1)}else i.length&&n.push({target:t,keyframes:i});const a={...e};return n.length?a.tracks=n:delete a.tracks,a}const Tr=(e,t)=>e.target===t?tr(e):`${e.target}/${tr(e)}`;function Fr(e,t){const i=e.indexOf("/");return{target:i>=0?e.slice(0,i):t,...ir(i>=0?e.slice(i+1):e)}}const Ir=(e,t)=>sr(Nr(e,t.target),t);function Br(e){const t=new Map;for(const i of e){const e=t.get(i.target)??[];e.push({lane:i.lane,at:i.at}),t.set(i.target,e)}return t}function qr(e,t,i,n=!1){const s=t.filter(t=>Ir(e,t)),a=fr(s,i);if(!s.length||0===a&&!n)return{doc:e,selection:s};let r=e;const o=[];for(const[e,t]of Br(s)){const i=vr(Nr(r,e),t,a,n);r=Or(r,e,i.keyframes),o.push(...i.selection.map(t=>({...t,target:e})))}return{doc:r,selection:o}}function Kr(e,t){let i=e;for(const[e,n]of Br(t))i=Or(i,e,br(Nr(i,e),n));return i}function Ur(e,t){const i=t.filter(t=>Ir(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at)),s=[];for(const[t,a]of Br(i)){const i=wr(Nr(e,t),a),r=Math.min(...a.map(e=>e.at));for(const e of i?.items??[])s.push({...e,dt:e.dt+r-n,target:t})}return{items:s}}const Gr=[{id:"pct1",label:"1%"},{id:"pct5",label:"5%"},{id:"s01",label:"0.1 s"},{id:"fps30",label:11}],Wr=[1,1.5,2,3,4,6,8,10],Zr=e=>Math.min(10,Math.max(1,Math.round(100*e)/100));function Yr(e,t){return t>0?Wr.find(t=>t>e+.001)??10:[...Wr].reverse().find(t=>t<e-.001)??1}const Xr=[1,2,2.5,5];function Jr(e){const t=10**Math.floor(Math.log10(e));for(const i of[...Xr,10])if(i*t>=e-1e-9)return i*t;return 10*t}const Qr={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function eo(e){if(!e)return;const t=e.trim(),i=at.find(e=>e.id===t)?.css??t;if(Qr[i])return[...Qr[i]];const n=i.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);if(!n)return;const s=n.slice(1).map(Number);return s.every(Number.isFinite)?s:void 0}const to=at.map(e=>({id:e.id,label:e.label,bezier:eo(e.id)})),io=e=>Math.round(100*e)/100;function no(e){const t=e=>io(Math.min(1,Math.max(0,e))),i=e=>io(Math.min(2,Math.max(-1,e)));return[t(e[0]),i(e[1]),t(e[2]),i(e[3])]}function so(e){const t=no(e),i=to.find(e=>e.bezier.every((e,i)=>Math.abs(e-t[i])<.005));return i?i.id:`cubic-bezier(${t.join(", ")})`}const ao=/^color-mix\(in srgb, var\(--mc-anim-c\) (\d+(?:\.\d+)?)%, transparent\)$/;function ro(e){if(!e)return"";const t=e.trim();if(/^var\(\s*--mc-anim-c\s*\)$/.test(t))return"entity";const i=t.match(ao);return i?`entity ${i[1]}%`:t}function oo(e){const t=e.trim().match(/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/i);return t?void 0===t[1]||Number(t[1])>=100?Na:`color-mix(in srgb, ${Na} ${Number(t[1])}%, transparent)`:e.trim()}const lo=e=>`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`,co=[{id:"glow",label:360,value:`0px 0px 16px 2px ${Na}`},{id:"drop",label:282,value:"0px 6px 16px 0px rgba(0, 0, 0, 0.3)"},{id:"lift",label:428,value:"0px 14px 28px -6px rgba(0, 0, 0, 0.35)"},{id:"none",label:574,value:"none"}],po=[{id:"bright",label:116,value:"brightness(1.3)"},{id:"hue",label:381,value:"hue-rotate(90deg)"},{id:"gray",label:364,value:"grayscale(1)"},{id:"glow",label:360,value:`drop-shadow(0 0 6px ${Na})`},{id:"none",label:574,value:"none"}],ho=(e,t)=>"none"===e.trim()?"shadow"===t||"filter"===t:void 0!==fi(e,t),uo=["top left","top","top right","left","center","right","bottom left","bottom","bottom right"],mo=[1015,1014,1016,423,142,752,113,112,114],go=(e,t=2)=>String(xr(e,t));function fo(e,t){if(!t)return"";const i=t.transform??{};switch(e){case"x":return void 0===i.x?"":`${go(i.x,1)} px`;case"y":return void 0===i.y?"":`${go(i.y,1)} px`;case"scale":case"scale_x":case"scale_y":{const t=i[e];return void 0===t?"":`${go(100*t,1)}%`}case"rotate":return void 0===i.rotate?"":`${go(i.rotate,1)}°`;case"skew":return`${go(i.skew_x??0,1)}° ${go(i.skew_y??0,1)}°`;case"opacity":return void 0===t.opacity?"":`${go(100*t.opacity,0)}%`;case"blur":return void 0===t.blur?"":`${go(t.blur,1)} px`;case"radius":return void 0===t.radius?"":`${go(t.radius,1)} px`;case"draw":return void 0===t.draw?"":`${go(100*t.draw,0)}%`;default:{const i=t[e];return void 0===i?"":ro(i).startsWith("entity")?na(67):i}}}const vo=e=>{const t=e?at.find(t=>t.id===e)?.label:void 0;return void 0!==t?(0,nt.t)(t):e?e.startsWith("steps")?na(908):na(217):na(225)},bo=1e-4,yo=(e,t,i=bo)=>Math.abs(e[0]-t[0])<i&&Math.abs(e[1]-t[1])<i,xo=(e,t,i)=>[e[0]+(t[0]-e[0])*i,e[1]+(t[1]-e[1])*i],_o=e=>[e.x,e.y],$o=e=>e?[e[0],e[1]]:void 0,wo=e=>{const t={x:e.x,y:e.y,in:$o(e.in),out:$o(e.out)};return e.kind&&(t.kind=e.kind),t},ko=e=>({anchors:e.anchors.map(wo),closed:e.closed});function Mo(e){const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)}const So=e=>{const t=Math.max(bo,.001*Math.hypot(e[3][0]-e[0][0],e[3][1]-e[0][1]));return yo(e[1],xo(e[0],e[3],1/3),t)&&yo(e[2],xo(e[0],e[3],2/3),t)};function Co(e){const t=e.anchors.length;return t<2?0:e.closed?t:t-1}function Ao(e,t){const i=e.anchors[t],n=e.anchors[(t+1)%e.anchors.length];return[_o(i),i.out??_o(i),n.in??_o(n),_o(n)]}function jo(e){const t=e.anchors[0],i=Array.from({length:Co(e)},(t,i)=>{const n=Ao(e,i);return((e,t)=>!e.anchors[t].out&&!e.anchors[(t+1)%e.anchors.length].in)(e,i)?{to:n[3]}:{c1:n[1],c2:n[2],to:n[3]}});return{start:t?_o(t):[0,0],segs:i,closed:e.closed&&e.anchors.length>1}}const zo=e=>e.anchors.length?(0,St.uD)([jo(e)]):"";function Eo(e){if(!e.in||!e.out)return!1;const t=e.in[0]-e.x,i=e.in[1]-e.y,n=e.out[0]-e.x,s=e.out[1]-e.y,a=Math.hypot(t,i),r=Math.hypot(n,s);return!(a<bo||r<bo)&&-(t*n+i*s)/(a*r)>.9995}const Vo=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,a=3*i*t*t,r=t*t*t;return[n*e[0][0]+s*e[1][0]+a*e[2][0]+r*e[3][0],n*e[0][1]+s*e[1][1]+a*e[2][1]+r*e[3][1]]},Lo=e=>e.anchors.length<100;function Po(e,t,i){const n=ko(e),s=n.anchors.length;if(t<0||t>=Co(n)||!Lo(n))return{path:n,index:-1};const a=n.anchors[t],r=n.anchors[(t+1)%s],o=Math.min(1,Math.max(0,i));if(!a.out&&!r.in){const e=xo(_o(a),_o(r),o);return n.anchors.splice(t+1,0,{x:e[0],y:e[1]}),{path:n,index:t+1}}const[l,c]=(0,St.fs)(Ao(n,t),o);a.out=yo(l[1],l[0])?void 0:l[1],r.in=yo(c[2],c[3])?void 0:c[2];const d={x:l[3][0],y:l[3][1],in:yo(l[2],l[3])?void 0:l[2],out:yo(c[1],c[0])?void 0:c[1]};return n.anchors.splice(t+1,0,d),{path:n,index:t+1}}function Do(e,t,i=!1){const n=ko(e);if(!Lo(n))return{path:n,index:-1};const s={x:t[0],y:t[1]};return i?(n.anchors.unshift(s),{path:n,index:0}):(n.anchors.push(s),{path:n,index:n.anchors.length-1})}function Ho(e,t){const i=ko(e);return t<0||t>=i.anchors.length||(i.anchors.splice(t,1),i.anchors.length<2&&(i.closed=!1)),i}function Ro(e,t,i,n){const s=ko(e),a=s.anchors[t];if(!a)return s;const r=i-a.x,o=n-a.y;return a.x=i,a.y=n,a.in&&(a.in=[a.in[0]+r,a.in[1]+o]),a.out&&(a.out=[a.out[0]+r,a.out[1]+o]),s}function No(e,t,i){const n=t.anchors[i],s=function(e,t){const i=e.anchors.length;if(i<2)return;const n=e.anchors[t],s=t>0?e.anchors[t-1]:e.closed?e.anchors[i-1]:n,a=t<i-1?e.anchors[t+1]:e.closed?e.anchors[0]:n,r=(a.x-s.x)/6,o=(a.y-s.y)/6;return Math.hypot(r,o)<bo?void 0:[r,o]}(e,i);s&&(n.in=e.closed||i>0?[n.x-s[0],n.y-s[1]]:void 0,n.out=e.closed||i<e.anchors.length-1?[n.x+s[0],n.y+s[1]]:void 0)}function Oo(e){const t=ko(e);for(let i=0;i<t.anchors.length;i++)No(e,t,i);return t}const To=e=>({anchors:e.anchors.map(e=>({x:e.x,y:e.y})),closed:e.closed});function Fo(e){const t=e.anchors.map(e=>{const t={x:e.x,y:e.y,in:$o(e.out),out:$o(e.in)};return e.kind&&(t.kind=e.kind),t}).reverse();return e.closed&&t.length&&t.unshift(t.pop()),{anchors:t,closed:e.closed}}function Io(e,t){const i=ko(e);return i.closed=t&&i.anchors.length>1,!i.closed&&i.anchors.length&&(i.anchors[0].in=void 0,i.anchors[i.anchors.length-1].out=void 0),i}const Bo=(e,t)=>t>0?Math.round(e/t)*t:e,qo=e=>`${Mo(e[0])} ${Mo(e[1])}`,Ko=1e-9,Uo=(e,t)=>[e[0]-t[0],e[1]-t[1]],Go=(e,t)=>[e[0]+t[0],e[1]+t[1]],Wo=(e,t)=>[e[0]*t,e[1]*t],Zo=(e,t)=>e[0]*t[0]+e[1]*t[1],Yo=e=>Math.hypot(e[0],e[1]),Xo=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1]),Jo=e=>{const t=Yo(e);return t<Ko?[0,0]:[e[0]/t,e[1]/t]};const Qo=(e,t,i)=>{const n=Uo(i,t),s=Zo(n,n);if(s<Ko)return Xo(e,t);const a=Math.max(0,Math.min(1,Zo(Uo(e,t),n)/s));return Xo(e,Go(t,Wo(n,a)))};function el(e,t){const i=e.length;if(i<3)return e.map((e,t)=>t);const n=new Uint8Array(i);n[0]=1,n[i-1]=1;const s=[[0,i-1]];for(;s.length;){const[i,a]=s.pop();let r=-1,o=t;for(let t=i+1;t<a;t++){const n=Qo(e[t],e[i],e[a]);n>o&&(o=n,r=t)}r>0&&(n[r]=1,s.push([i,r],[r,a]))}const a=[];return n.forEach((e,t)=>e&&a.push(t)),a}const tl=(e,t)=>el(e,t).map(t=>e[t]),il=(e,t)=>{const i=1-t;return[i*i*i*e[0][0]+3*i*i*t*e[1][0]+3*i*t*t*e[2][0]+t*t*t*e[3][0],i*i*i*e[0][1]+3*i*i*t*e[1][1]+3*i*t*t*e[2][1]+t*t*t*e[3][1]]};function nl(e,t,i,n){const s=e[0],a=e[e.length-1];let r=0,o=0,l=0,c=0,d=0;for(let p=0;p<e.length;p++){const h=t[p],u=1-h,m=Wo(i,3*h*u*u),g=Wo(n,3*h*h*u);r+=Zo(m,m),o+=Zo(m,g),l+=Zo(g,g);const f=Uo(e[p],Go(Wo(s,u*u*u+3*h*u*u),Wo(a,3*h*h*u+h*h*h)));c+=Zo(m,f),d+=Zo(g,f)}const p=r*l-o*o;let h=Math.abs(p)<Ko?0:(c*l-o*d)/p,u=Math.abs(p)<Ko?0:(r*d-o*c)/p;const m=Xo(s,a),g=1e-6*m;return(h<g||u<g)&&(h=m/3,u=m/3),[s,Go(s,Wo(i,h)),Go(a,Wo(n,u)),a]}function sl(e,t,i){let n=0,s=Math.floor(e.length/2);for(let a=1;a<e.length-1;a++){const r=Xo(il(t,i[a]),e[a]);r>n&&(n=r,s=a)}return{err:n,split:Math.min(e.length-2,Math.max(1,s))}}function al(e,t,i){return t.map((t,n)=>{const s=Uo(il(i,t),e[n]),a=((e,t)=>{const i=1-t;return[3*i*i*(e[1][0]-e[0][0])+6*i*t*(e[2][0]-e[1][0])+3*t*t*(e[3][0]-e[2][0]),3*i*i*(e[1][1]-e[0][1])+6*i*t*(e[2][1]-e[1][1])+3*t*t*(e[3][1]-e[2][1])]})(i,t),r=((e,t)=>{const i=1-t;return[6*i*(e[2][0]-2*e[1][0]+e[0][0])+6*t*(e[3][0]-2*e[2][0]+e[1][0]),6*i*(e[2][1]-2*e[1][1]+e[0][1])+6*t*(e[3][1]-2*e[2][1]+e[1][1])]})(i,t),o=Zo(a,a)+Zo(s,r);return Math.abs(o)<Ko?t:Math.min(1,Math.max(0,t-Zo(s,a)/o))})}function rl(e,t,i,n,s,a){if(2===e.length||a>24){const n=e[0],a=e[e.length-1],r=Xo(n,a)/3;return void s.push([n,Go(n,Wo(t,r)),Go(a,Wo(i,r)),a])}let r=function(e){const t=[0];for(let i=1;i<e.length;i++)t.push(t[i-1]+Xo(e[i],e[i-1]));const i=t[t.length-1]||1;return t.map(e=>e/i)}(e),o=nl(e,r,t,i),{err:l,split:c}=sl(e,o,r);if(l<=n)return void s.push(o);if(l<=4*n)for(let a=0;a<6;a++)if(r=al(e,r,o),o=nl(e,r,t,i),({err:l,split:c}=sl(e,o,r)),l<=n)return void s.push(o);let d=Jo(Uo(e[c-1],e[c+1]));Yo(d)<Ko&&(d=Jo(Uo(e[c-1],e[c]))),rl(e.slice(0,c+1),t,d,n,s,a+1),rl(e.slice(c),Wo(d,-1),i,n,s,a+1)}function ol(e,t,i,n){const s=[0];if(n){const i=el(e,t);for(let n=1;n<i.length-1;n++){const a=e[i[n-1]],r=e[i[n]],o=e[i[n+1]],l=Uo(r,a),c=Uo(o,r);Yo(l)<2*t||Yo(c)<2*t||Zo(l,c)/(Yo(l)*Yo(c))<Math.cos(70*Math.PI/180)&&s.push(i[n])}}s.push(e.length-1);const a=[];for(let n=0;n+1<s.length;n++){const r=e.slice(s[n],s[n+1]+1);if(r.length<2)continue;let o=Jo(Uo(r[1],r[0])),l=Jo(Uo(r[r.length-2],r[r.length-1]));if(i&&2===s.length&&r.length>3){const e=Jo(Uo(r[1],r[r.length-2]));Yo(e)>Ko&&(o=e,l=Wo(e,-1))}rl(r,o,l,t,a,0)}return a}function ll(e,t){const i=Math.max(.01,t),n=Math.ceil(e.length/4e3),s=n>1?e.filter((t,i)=>i%n===0||i===e.length-1):e,a=function(e,t){const i=[];for(const n of e)Number.isFinite(n[0])&&Number.isFinite(n[1])&&(!i.length||Xo(i[i.length-1],n)>=t)&&i.push([n[0],n[1]]);const n=e[e.length-1];return i.length>1&&n&&Xo(i[i.length-1],n)>Ko&&Number.isFinite(n[0])&&Number.isFinite(n[1])&&(i[i.length-1]=[n[0],n[1]]),i}(s,Math.max(.005,i/10));if(a.length<2)return{d:"",segments:0,closed:!1};if(2===a.length)return{d:`M${qo(a[0])} L${qo(a[1])}`,segments:1,closed:!1};let r=0;for(let e=1;e<a.length;e++)r+=Xo(a[e],a[e-1]);const o=Math.max(2*i,.6),l=a.length>=8&&Xo(a[0],a[a.length-1])<=o&&r>6*o;l&&(a[a.length-1]=[a[0][0],a[0][1]]);const c=e=>{const t=function(e,t){const i=[{x:e[0][0][0],y:e[0][0][1]}],n=e=>Qo(e[1],e[0],e[3])<.001&&Qo(e[2],e[0],e[3])<.001;for(const t of e){const e=i[i.length-1],s={x:t[3][0],y:t[3][1]};n(t)||(Xo(t[1],t[0])>.001&&(e.out=[t[1][0],t[1][1]]),Xo(t[2],t[3])>.001&&(s.in=[t[2][0],t[2][1]])),i.push(s)}if(t&&i.length>2){const e=i.pop();i[0].in=e.in}return{anchors:i,closed:t&&i.length>1}}(e,l);return{d:zo(t),segments:e.length,closed:t.closed}};for(let e=0,t=i;e<8;e++,t*=1.6){const e=ol(a,t,l,!0);if(e.length&&e.length<=60)return c(e)}let d=i,p=tl(a,d);for(;p.length>61;)p=tl(a,d*=1.5);l&&p.length>3&&(p=p.slice(0,-1));const h=l&&p.length>2,u=Oo({anchors:p.map(([e,t])=>({x:e,y:t})),closed:h});return{d:zo(u),segments:h?p.length:p.length-1,closed:h}}const cl=.5522847498;function dl(e,t,i,n,s){const a=Math.max(0,Math.min(s,i/2,n/2));if(a<.005)return`M${qo([e,t])} H${Mo(e+i)} V${Mo(t+n)} H${Mo(e)} Z`;const r=a*(1-cl),o=e+i,l=t+n;return[`M${qo([e+a,t])}`,`H${Mo(o-a)}`,`C${qo([o-r,t])} ${qo([o,t+r])} ${qo([o,t+a])}`,`V${Mo(l-a)}`,`C${qo([o,l-r])} ${qo([o-r,l])} ${qo([o-a,l])}`,`H${Mo(e+a)}`,`C${qo([e+r,l])} ${qo([e,l-r])} ${qo([e,l-a])}`,`V${Mo(t+a)}`,`C${qo([e,t+r])} ${qo([e+r,t])} ${qo([e+a,t])}`,"Z"].join(" ")}function pl(e,t,i,n){const s=i*cl,a=n*cl;return[`M${qo([e+i,t])}`,`C${qo([e+i,t+a])} ${qo([e+s,t+n])} ${qo([e,t+n])}`,`C${qo([e-s,t+n])} ${qo([e-i,t+a])} ${qo([e-i,t])}`,`C${qo([e-i,t-a])} ${qo([e-s,t-n])} ${qo([e,t-n])}`,`C${qo([e+s,t-n])} ${qo([e+i,t-a])} ${qo([e+i,t])}`,"Z"].join(" ")}const hl=(e,t)=>`M${qo(e)} L${qo(t)}`,ul=e=>Math.round(100*e)/100,ml=e=>`${Mo(e[0])} ${Mo(e[1])}`;function gl(e,t,i,n){let s=t[0]-e[0],a=t[1]-e[1];if(i){const e=Math.max(Math.abs(s),Math.abs(a));s=Math.sign(s||1)*e,a=Math.sign(a||1)*e}return n?{x:ul(e[0]-Math.abs(s)),y:ul(e[1]-Math.abs(a)),w:ul(2*Math.abs(s)),h:ul(2*Math.abs(a))}:{x:ul(Math.min(e[0],e[0]+s)),y:ul(Math.min(e[1],e[1]+a)),w:ul(Math.abs(s)),h:ul(Math.abs(a))}}const fl=e=>e.length>1&&Xo(e[0][0],e[e.length-1][3])<1e-6;function vl(e,t){return function(e){const t=[];for(const i of e){if(!i.length)continue;const e=fl(i);t.push(`M${ml(i[0][0])}`),i.forEach((n,s)=>{Qo(n[1],n[0],n[3])<1e-4&&Qo(n[2],n[0],n[3])<1e-4?e&&s===i.length-1||t.push(`L${ml(n[3])}`):t.push(`C${ml(n[1])} ${ml(n[2])} ${ml(n[3])}`)}),e&&t.push("Z")}return t.join(" ")}((0,St.Mj)(e).map(e=>e.map(e=>e.map(t))))}const bl=(e,t,i)=>vl(e,e=>[e[0]+t,e[1]+i]);function yl(e){const t=[];for(const i of(0,St.Mj)(e))i.length&&(t.push([i[0][0][0],i[0][0][1]]),i.forEach((e,n)=>{n===i.length-1&&fl(i)||t.push([e[3][0],e[3][1]])}));return t.map(e=>[ul(e[0]),ul(e[1])])}function xl(e,t=12){return(0,St.Mj)(e).map(e=>{const i=e.length?[e[0][0]]:[];for(const n of e)for(let e=1;e<=t;e++)i.push(il(n,e/t));return i})}function _l(e){let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const a of xl(e,16))for(const e of a)t=Math.min(t,e[0]),i=Math.min(i,e[1]),n=Math.max(n,e[0]),s=Math.max(s,e[1]);return Number.isFinite(t)?{x:t,y:i,w:n-t,h:s-i}:void 0}function $l(e){const t=(e??"").trim().split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:[0,0,24,24]}function wl(e,t){const[i,n,s,a]=$l(e),[r,o,l,c]=$l(t),d=Math.min(l/s,c/a);return{k:d,dx:r+(l-s*d)/2-i*d,dy:o+(c-a*d)/2-n*d}}const kl=/^(none|transparent)$/i,Ml=e=>e.fill?!kl.test(e.fill):!e.stroke,Sl=e=>!!e.stroke&&!kl.test(e.stroke);function Cl(e,t){let i=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){const[a,r]=e[n],[o,l]=e[s];r>t[1]!=l>t[1]&&t[0]<(o-a)*(t[1]-r)/(l-r||1e-9)+a&&(i=!i)}return i}const Al=e=>[...e.filter(e=>"under"===e.layer),...e.filter(e=>"under"!==e.layer)];function jl(e,t){let i=1/0;for(const n of xl(e))for(let e=1;e<n.length;e++)i=Math.min(i,Qo(t,n[e-1],n[e]));return i}function zl(e,t,i){const n=Al(e);for(let e=n.length-1;e>=0;e--){const s=n[e],a=xl(s.d);if(Ml(s)){let e=!1;for(const i of a)Cl(i,t)&&(e=!e);if(e)return s.id}const r=(Sl(s)?(s.stroke_width??1)/2:0)+i;if(jl(s.d,t)<=r)return s.id}}const El=/^[a-z0-9][a-z0-9_-]{0,24}$/;function Vl(e,t="shape"){const i=new Set(e.map(e=>"string"==typeof e?e:e.id)),n=El.test(t)?t:"shape";let s=1;for(;i.has(`${n}-${s}`);)s++;return`${n}-${s}`}function Ll(e){const t=JSON.stringify(e),i="undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length;return i>li?na(937,{max:Math.round(64),size:Math.ceil(i/1024)}):void 0}const Pl=e=>e.rig?.shapes??[],Dl=e=>[...(e.rig?.parts??[]).map(e=>e.id),...(e.rig?.groups??[]).map(e=>e.id),...Pl(e).map(e=>e.id)];function Hl(e,t){const i=Pl(e);if(i.length>=cs||Dl(e).includes(t.id))return;const n=e.rig??{parts:[]};return{...e,rig:{...n,parts:n.parts??[],shapes:[...i,t]}}}function Rl(e,t,i){if(!e.rig?.shapes)return e;const n=e.rig.shapes.map(e=>{if(e.id!==t)return e;const n={...e,...i};for(const e of Object.keys(n))void 0===n[e]&&delete n[e];return n});return{...e,rig:{...e.rig,shapes:n}}}function Nl(e,t,i){const n=[...Pl(e)],s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const[a]=n.splice(s,1);return n.splice(Math.max(0,Math.min(n.length,i)),0,a),{...e,rig:{...e.rig,shapes:n}}}function Ol(e,t,i){const n=Pl(e),s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const a="under"===n[s].layer?"under":"over",r=e=>("under"===e.layer?"under":"over")===a,o=[...n],[l]=o.splice(s,1);let c=-1;if("up"===i)c=n.findIndex((e,t)=>t>s&&r(e));else for(let e=s-1;e>=0;e--)if(r(n[e])){c=e;break}if(c>=0)return o.splice(c,0,l),{...e,rig:{...e.rig,shapes:o}};if("over"===a==("up"===i))return e;const d={...l,layer:"over"===a?"under":"over"};if("over"===d.layer){const e=o.findIndex(e=>"under"!==e.layer);o.splice(e<0?s:e,0,d)}else{let e=-1;o.forEach((t,i)=>{"under"===t.layer&&(e=i)}),o.splice(e<0?s:e+1,0,d)}return{...e,rig:{...e.rig,shapes:o}}}function Tl(e,t){if(!e.rig?.shapes)return e;const i=`shape:${t}`,n={...e,rig:{...e.rig,shapes:e.rig.shapes.filter(e=>e.id!==t)}};return e.tracks&&(n.tracks=e.tracks.filter(e=>e.target!==i)),e.bindings&&(n.bindings=e.bindings.filter(e=>e.target!==i)),n}const Fl=(e,t)=>e.tracks?.find(e=>e.target===t);function Il(e,t,i){const n=e.tracks??[],s=n.findIndex(e=>e.target===i);return t?s<0?n.length>=24?void 0:{...e,tracks:[...n,t]}:{...e,tracks:n.map((e,i)=>i===s?t:e)}:s<0?e:{...e,tracks:n.filter((e,t)=>t!==s)}}const Bl=(e,t)=>!!Fl(e,t)?.keyframes.some(e=>void 0!==e.draw);function ql(e,t,i,n){const s=Fl(e,t);if(!i){if(!s?.path)return e;const i={...s};return delete i.path,Il(e,i.keyframes.length?i:void 0,t)}const a=(0,St.Mj)(i)[0]?.[0]?.[0];return a?Il(e,{...s??{target:t,keyframes:[]},target:t,path:{d:bl(i,-a[0],-a[1]),...n?{follow_rotation:!0}:{}}},t):e}const Kl={target:["hide","solo","lock"],part:["hide","solo","lock"],group:["hide","solo","lock"],shape:["hide","solo","lock"],lane:["hide","solo","lock"],emitter:["hide","solo","lock"],children:["hide","solo","lock"],pshape:[],content:[],path:["lock"],subject:["lock"],step:["hide","solo","lock"]},Ul={hidden:[],solo:[],locked:[],open:[]},Gl=["icon","name","state","background"];function Wl(e){const t="particles"===e.kind?e.particles?.sim:void 0;if(!t)return[];const i=t.emitters??[];return[t.id??"main",...i.map((e,t)=>e.id??`e${t+1}`)]}function Zl(e){const t=[];"keyframes"===e.kind&&t.push([Hr(e),e.keyframes??[]]);for(const i of e.tracks??[])t.push([i.target,i.keyframes]);return t}function Yl(e,t){return er(Zl(e).filter(([e])=>e===t).flatMap(([,e])=>e))}function Xl(e,t,i){return nr(Zl(e).filter(([e])=>e===t).flatMap(([,e])=>e),i)}function Jl(e){const t=new Map;if("keyframes"===e.kind){for(const e of Gl)t.set(`target:${e}`,"targets");for(const i of e.rig?.parts??[])t.set(`part:${i.id}`,"parts");for(const i of e.rig?.groups??[])t.set(`group:${i.id}`,"parts");for(const i of e.rig?.shapes??[])t.set(`shape:${i.id}`,"under"===i.layer?"under":"over");for(const[i,n]of Zl(e))for(const e of er(n))t.set(`lane:${i}|${e}`,"lanes")}const i="particles"===e.kind?e.particles?.sim:void 0;if(i){const n=Wl(e),s=[i.children,...(i.emitters??[]).map(e=>e.children)];n.forEach((e,i)=>{t.set(`emitter:${e}`,"emitters"),s[i]&&t.set(`children:${e}`,"emitters")})}else"particles"===e.kind&&e.particles&&t.set("emitter:main","emitters");return"sequence"===e.kind&&(e.steps??[]).forEach((e,i)=>t.set(`step:${i}`,"steps")),t}const Ql="parents:";function ec(e,t){const i=Jl(e),n=new Set(t.hidden.filter(e=>i.has(e))),s=new Set(t.solo.filter(e=>i.has(e)));if(!s.size)return n;const a=new Set([...s].map(e=>i.get(e))),r=new Map;for(const t of e.rig?.groups??[])for(const e of t.parts)r.has(e)||r.set(e,t.id);for(const[e,t]of i){if(!a.has(t)||s.has(e))continue;const[i,...o]=e.split(":"),l=o.join(":");if("parts"===t){if("group"===i||s.has(`group:${r.get(l)}`))continue}else if("emitters"===t){const t=l;if("children"===i){if(s.has(`emitter:${t}`))continue}else if(s.has(`children:${t}`)&&!n.has(e)){n.add(`${Ql}${t}`);continue}}n.add(e)}return n}function tc(e,t){const[i,...n]=t.split(":"),s=n.join(":");if("part"===i){const t=e.rig?.groups?.find(e=>e.parts.includes(s));return t?`group:${t.id}`:void 0}if("children"===i)return`emitter:${s}`;if("lane"===i){const e=t.slice(5,t.lastIndexOf("|"));return/^(part|group|shape):/.test(e)?e:`target:${e}`}}const ic={hide:"hidden",solo:"solo",lock:"locked"},nc=(e,t,i)=>{for(let n=i,s=0;n&&s<4;n=tc(e,n),s++)if(t.locked.includes(n))return!0;return!1},sc={rotate:"rotate",rotate_speed:"rotate",x:"x",y:"y",scale:"scale",opacity:"opacity",draw:"draw",color_mix:"color"};function ac(e,t){return e.map(e=>t.reduce(Qa,e)).filter(e=>!Ya(e))}function rc(e){const t=e=>/^(part|group|shape):/.test(e)?e:`target:${e}`;return"keys"===e.kind?(e.keys??[]).map(e=>"*"===e.lane?t(e.target):`lane:${e.target}|${e.lane}`):(e.targets?.length?e.targets:e.target?[e.target]:[]).map(t)}function oc(e,t,i){return t.locked.length>0&&rc(i).some(i=>nc(e,t,i))}function lc(e,t,i){return cc(e,e=>e===t?i:t<i?e>t&&e<=i?e-1:e:e>=i&&e<t?e+1:e)}function cc(e,t){const i=e=>{let i=!1;const n=[];for(const s of e){const e=/^step:(\d+)$/.exec(s);if(!e){n.push(s);continue}const a=t(Number(e[1]));a!==Number(e[1])&&(i=!0),a>=0&&n.push(`step:${a}`)}return i?n:e},n={hidden:i(e.hidden),solo:i(e.solo),locked:i(e.locked),open:i(e.open)};return n.hidden===e.hidden&&n.solo===e.solo&&n.locked===e.locked&&n.open===e.open?e:n}const dc=c`
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
`;function pc(e,t,i){return Z`<div class="lock-banner" role="status"><ha-icon icon="mdi:lock-outline"></ha-icon><span class="txt">${na(442)}</span><button type="button" class="btn btn-text btn-sm unlock" @click=${n=>{const s=function(e,t,i){const n=new Set;for(const s of i)for(let i=s,a=0;i&&a<4;i=tc(e,i),a++)t.locked.includes(i)&&n.add(i);return n.size?{...t,locked:t.locked.filter(e=>!n.has(e))}:t}(e,t,i);n.currentTarget.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:s,announce:na(1044)},bubbles:!0,composed:!0}))}}>${na(1043)}</button></div>`}const hc={fall:"fall",rise:"rise",drift:"drift",burst:"burst",orbit:"orbit",spiral:"spiral",fountain:"rise",explode:"burst",wave:"drift",vortex:"spiral",zigzag:"fall",rain:"fall",wander:"drift"},uc=["circle","square","triangle","star","heart","ring","line","spark"],mc={parents:60,childrenPerParent:8,elements:160,shapes:6,emitters:4,parts:2,stopsPerElement:32,warnBytes:65536,maxBytes:131072,dt:1/60,geometryVariants:4},gc={aspect:2};function fc(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const vc=(e,t)=>{let i=Math.imul(e>>>0^Math.imul(t,2654435761),2246822507);return i^=i>>>13,i=Math.imul(i,3266489909),(i^i>>>16)>>>0};function bc(e,[t,i]){const n=Math.min(t,i),s=Math.max(t,i),a=e();return s===n?n:n+a*(s-n)}const yc=Math.PI/180;function xc(e){const t=e.angle*yc;return{x:-Math.sin(t)*e.strength,y:Math.cos(t)*e.strength}}const _c=e=>e*e*(3-2*e),$c=(e,t,i)=>e+(t-e)*i;function wc(e,t,i,n){const s=Math.floor(t),a=Math.floor(i),r=Math.floor(n),o=_c(t-s),l=_c(i-a),c=_c(n-r),d=(t,i,n)=>function(e,t,i,n){let s=e^Math.imul(t,668265261)^Math.imul(i,374761393)^Math.imul(n,2654435761);return s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),((s^s>>>16)>>>0)/4294967296}(e,s+t,a+i,r+n),p=$c($c(d(0,0,0),d(1,0,0),o),$c(d(0,1,0),d(1,1,0),o),l),h=$c($c(d(0,0,1),d(1,0,1),o),$c(d(0,1,1),d(1,1,1),o),l);return 2*$c(p,h,c)-1}const kc=2*Math.PI,Mc=Math.PI/180,Sc=(e,t,i)=>t/2+(e()-.5)*t*(Math.max(0,i)/100),Cc=e=>Math.max(5,e.spread/2),Ac=(e,t)=>{e.x=t.W/2,e.y=t.H/2},jc=(e,t,i,n)=>{n.x+=3*(t-e.vx),n.y+=3*(i-e.vy)},zc=(e,t)=>{const i=e.x-t.W/2,n=e.y-t.H/2,s=Math.hypot(i,n)||1e-6,a=i/s,r=n/s;return{r:s,ux:a,uy:r,tx:-r*e.dir,ty:a*e.dir}},Ec=(e,t)=>{const i=t*Mc;e.vx=Math.sin(i)*e.speed,e.vy=-Math.cos(i)*e.speed},Vc=e=>Math.max(.1,e.lifeMean/4),Lc={persistent:!1,spawn(e,t,i,n){e.x=Sc(t,i.W,i.spread),e.y=-n,e.vx=0,e.vy=e.speed}},Pc={fall:Lc,rise:{persistent:!1,spawn(e,t,i,n){e.x=Sc(t,i.W,i.spread),e.y=i.H+n,e.vx=0,e.vy=-e.speed}},drift:{persistent:!1,spawn(e,t,i,n){e.x=-n,e.y=Sc(t,i.H,i.spread),e.vx=e.speed,e.vy=0}},burst:{persistent:!1,spawn(e,t,i){Ac(e,i),Ec(e,360*t())}},orbit:{persistent:!0,spawn(e,t,i){const n=t()*kc,s=Cc(i);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const a=zc(e,i);e.vx=a.tx*e.speed,e.vy=a.ty*e.speed},accel(e,t,i){const n=zc(e,t),s=2*(Cc(t)-n.r);jc(e,n.tx*e.speed+n.ux*s,n.ty*e.speed+n.uy*s,i)}},spiral:{persistent:!1,spawn(e,t,i){const n=t()*kc;e.x=i.W/2+Math.cos(n),e.y=i.H/2+Math.sin(n);const s=zc(e,i);e.vx=(.6*s.ux+s.tx)*e.speed,e.vy=(.6*s.uy+s.ty)*e.speed},accel(e,t,i){const n=zc(e,t);jc(e,(.6*n.ux+n.tx)*e.speed,(.6*n.uy+n.ty)*e.speed,i)}},fountain:{persistent:!1,spawn(e,t,i,n){e.x=i.W/2+(t()-.5)*i.W*(Math.max(0,i.spread)/100)*.25,e.y=i.H+n,Ec(e,40*(t()-.5))},fall:e=>2*e.vMean/Math.max(.1,e.lifeMean)},explode:{persistent:!1,spawn(e,t,i){Ac(e,i),Ec(e,150*(t()-.5))},fall:e=>1.5*e.vMean/Math.max(.1,e.lifeMean)},wave:{persistent:!1,spawn(e,t,i,n){const s=t()*kc,a=2*kc/Math.max(.2,i.lifeMean);e.baseY=Sc(t,i.H,i.spread),e.x=-n,e.y=e.baseY+8*Math.sin(s),e.vx=e.speed,e.vy=8*a*Math.cos(s)},accel(e,t,i){const n=2*kc/Math.max(.2,t.lifeMean);i.y+=-n*n*(e.y-e.baseY)}},vortex:{persistent:!1,spawn(e,t,i){const n=t()*kc,s=Math.max(10,i.spread/2);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const a=zc(e,i);e.vx=a.tx*e.speed,e.vy=a.ty*e.speed},accel(e,t,i){const n=zc(e,t),s=n.r>2?.4:0;jc(e,(n.tx-n.ux*s)*e.speed,(n.ty-n.uy*s)*e.speed,i)}},zigzag:{persistent:!1,spawn(e,t,i,n){Lc.spawn(e,t,i,n);const s=Vc(i);e.baseX=e.x,e.vx=24*-e.dir/s},accel(e,t,i){const n=Vc(t),s=Math.floor(e.age/n)%2==0?1:-1;i.x+=s*e.dir*48/(n*n)}},rain:{persistent:!1,align:!0,spawn(e,t,i,n){e.x=t()*i.W*(.2+Math.max(0,i.spread)/100)-.1*i.W,e.y=-n,e.vx=0,e.vy=e.speed}},wander:{persistent:!0,spawn(e,t,i){e.x=Sc(t,i.W,i.spread),e.y=Sc(t,i.H,i.spread),e.baseX=e.x,e.baseY=e.y,Ec(e,360*t())},accel(e,t,i){const n=wc(625341585^t.noiseSeed,e.x/20,e.y/20,.4*e.age)*kc;jc(e,Math.cos(n)*e.speed+.8*(e.baseX-e.x),Math.sin(n)*e.speed+.8*(e.baseY-e.y),i)}}},Dc=mc.dt,Hc=2*Dc,Rc={builtin:"circle"},Nc=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy}),Oc=([e,t])=>(e+t)/2,Tc=e=>2+2*Math.hypot(e.x,e.y)*Dc,Fc=(e,t)=>Math.min(Math.max(e,Hc),Math.max(Hc,Math.min(20,t-Hc)));function Ic(e,t,i){const n=e.sim,s=i.aspect>0?i.aspect:2,a=s>=1?100*s:100,r=s>=1?100:100/s,o=Pc[n.flow]??Pc.fall,l=vc(n.seed,3),c={W:a,H:r,spread:e.spread,vMean:Math.abs(Oc(n.ranges.speed)),lifeMean:Fc(Oc(n.ranges.lifetime),t),noiseSeed:l},d=function(e,t,i,n){const s=t.content,a="none"!==e.content&&s&&s.w>0&&s.h>0?{x0:s.x/100*i,y0:s.y/100*n,x1:(s.x+s.w)/100*i,y1:(s.y+s.h)/100*n}:void 0;return{floor:e.floor,ceiling:e.ceiling,left:e.left,right:e.right,...a?{content:a}:{}}}(n.colliders,i,a,r),p=((e,t)=>({x:e.x+t.x,y:e.y+t.y}))(xc(n.physics.gravity),{x:0,y:o.fall?.(c)??0});return{spec:e,sim:n,period:t,W:a,H:r,flow:o,ctx:c,physics:n.physics,colliders:d,...d.content?{content:d.content}:{},gravity:p,rest:Tc(p),noiseSeed:l}}const Bc=(e,t)=>{const i=function(e,t){const i=e();let n=0;for(const e of t)n+=e>0?e:0;if(!(n>0))return 0;let s=0;const a=i*n;for(let e=0;e<t.length;e++)if(s+=t[e]>0?t[e]:0,a<s)return e;for(let e=t.length-1;e>=0;e--)if(t[e]>0)return e;return 0}(e,t.map(e=>e.weight));return t.length?t[i].shape:Rc},qc=e=>e/2/120*100;function Kc(e,t,i){const{sim:n,spec:s,period:a}=e,r=Bc(t,n.shapes),o=bc(t,s.size),l=bc(t,n.ranges.speed),c=bc(t,n.ranges.spin),d=t()<.5?-c:c,p=bc(t,n.ranges.delay),h=bc(t,n.ranges.lifetime),u=bc(t,n.ranges.opacity),m=t()<.5?-1:1,g=qc(o),f=e.flow.persistent&&a<=20,v={index:i,x:0,y:0,vx:0,vy:0,age:0,speed:l,dir:m,baseX:0,baseY:0,birth:a>0?(Math.max(0,p)%a+a)%a:0,life:f?a:Fc(h,a),spin:d,peak:u,size:o,radius:g,shape:r,...s.colors.length?{color:s.colors[i%s.colors.length]}:{},persistent:f,physics:e.physics,gravity:e.gravity,flow:e.flow};return e.flow.spawn(v,t,e.ctx,g),v}function Uc(e,t,i,n){if(e.persistent)return i?.675+.325*Math.cos(t/n*Math.PI*2):1;const s=i?.1*e.life:Dc;return Math.max(0,Math.min(1,t/s,(e.life-t)/s))}function Gc(e,t){let i=t.spin*t.age;return t.flow?.align&&(t.vx||t.vy)&&(i+=180*Math.atan2(-t.vx,t.vy)/Math.PI),{age:t.age,x:t.x,y:t.y,rotate:i,opacity:t.peak*Uc(t,t.age,e.spec.fade,e.period),scale:1}}function Wc(e,t,i){const n={x:t.gravity.x,y:t.gravity.y},s=function(e,t,i,n){if(!(t.strength>0))return{x:0,y:0};const s=Math.max(1,t.scale),a=.6*n;return{x:wc(e,i.x/s,i.y/s,a)*t.strength,y:wc(1540483477^e,i.x/s,i.y/s,a+17)*t.strength}}(e.noiseSeed,t.physics.turbulence,t,t.age);n.x+=s.x,n.y+=s.y,t.flow?.accel?.(t,e.ctx,n);const a=((e,t)=>e>0?Math.exp(-e*t):1)(t.physics.drag,i);return t.vx=(t.vx+n.x*i)*a,t.vy=(t.vy+n.y*i)*a,t.x+=t.vx*i,t.y+=t.vy*i,t.age+=i,function(e,t,i,n,s,a,r,o){let l;const c=(t,i,n,s)=>{e.x=n,e.y=s;const c=e.vx*t+e.vy*i;if(c>=0)return;const d=e.vx-c*t,p=e.vy-c*i,h=Math.sqrt(Math.max(0,a));let u=-c*a;u<r&&(u=0),e.vx=d*h+u*t,e.vy=p*h+u*i,-c>=r&&!l&&(l={age:o,x:n,y:s,nx:t,ny:i,speed:-c})};s.floor&&e.y>n-t&&c(0,-1,e.x,n-t),s.ceiling&&e.y<t&&c(0,1,e.x,t),s.left&&e.x<t&&c(1,0,t,e.y),s.right&&e.x>i-t&&c(-1,0,i-t,e.y);const d=s.content;if(d&&e.x>d.x0-t&&e.x<d.x1+t&&e.y>d.y0-t&&e.y<d.y1+t){const i=e.x-(d.x0-t),n=d.x1+t-e.x,s=e.y-(d.y0-t),a=d.y1+t-e.y,r=Math.min(i,n,s,a);r===s?c(0,-1,e.x,d.y0-t):r===a?c(0,1,e.x,d.y1+t):r===i?c(-1,0,d.x0-t,e.y):c(1,0,d.x1+t,e.y)}return l}(t,t.radius,e.W,e.H,e.colliders,t.physics.bounce,e.rest,t.age)}function Zc(e,t,i){const n=[Gc(e,t)],s=[];let a=void 0!==i&&i<=0?Nc(t):void 0;const r=t.x,o=t.y,l=Math.ceil(t.life/Dc-1e-9);for(let c=0;c<l;c++){const d=Math.min(Dc,t.life-t.age);if(d<=1e-12)break;const p=Wc(e,t,d);c===l-1&&(t.age=t.life),p&&s.push({...p,vx:t.vx,vy:t.vy}),void 0!==i&&!a&&t.age>=i-1e-9&&(a=Nc(t));const h=Gc(e,t);if(t.persistent){const e=Math.max(0,Math.min(1,(t.age-.85*t.life)/(.15*t.life))),i=e*e*(3-2*e);h.x+=(r-h.x)*i,h.y+=(o-h.y)*i}n.push(h)}const c=n[n.length-1];return{samples:n,hits:s,...a?{at:a}:{},end:{...Nc(t),x:c.x,y:c.y}}}const Yc=Math.PI/180,Xc=e=>e?Math.max(0,Math.min(mc.childrenPerParent,Math.floor(e.count))):0;function Jc(e,t){return"collision"===e.trigger?t.hits[0]:"time"===e.trigger?t.at:t.end}function Qc(e,t,i,n,s,a){const r=Xc(t),{physics:o,gravity:l}=function(e,t){const i=t.physics??{},n={...e.physics,...i},s=e.gravity.y-xc(e.physics.gravity).y,a=xc(n.gravity);return{physics:n,gravity:{x:a.x,y:a.y+s}}}(e,t),c=Math.hypot(n.vx,n.vy),d=void 0!==n.nx&&void 0!==n.ny?Math.atan2(n.nx,-n.ny):c>1e-9?Math.atan2(n.vx,-n.vy):0,p=Math.max(0,Math.min(360,t.cone))*Yc,h=[];for(let c=0;c<r;c++){const r=Bc(s,t.shapes),u=bc(s,t.size),m=bc(s,t.ranges.speed),g=bc(s,t.ranges.spin),f=s()<.5?-g:g,v=Fc(bc(s,t.ranges.lifetime),e.period),b=bc(s,t.ranges.opacity),y=d+(s()-.5)*p;if(c>=a)continue;const x=t.colors.length?t.colors[c%t.colors.length]:i.color;h.push({index:c,x:n.x,y:n.y,vx:Math.sin(y)*m+n.vx*t.inherit,vy:-Math.cos(y)*m+n.vy*t.inherit,age:0,speed:m,dir:1,baseX:n.x,baseY:n.y,birth:((i.birth+n.age)%e.period+e.period)%e.period,life:v,spin:f,peak:b,size:u,radius:qc(u),shape:r,...void 0!==x?{color:x}:{},persistent:!1,physics:o,gravity:l})}return h}function ed(e,t,i){const n=t.t-e.t,s=n>0?(i.t-e.t)/n:0,a=i=>e[i]+(t[i]-e[i])*s;return Math.max(Math.abs(i.x-a("x")),Math.abs(i.y-a("y")),Math.abs(i.rotate-a("rotate"))/3.6,100*Math.abs(i.opacity-a("opacity")),100*Math.abs(i.scale-a("scale")))}function td(e){const t=e.length,i=new Float64Array(t);if(!t)return i;i[0]=1/0,i[t-1]=1/0;for(let n=1;n<t-1;n++)e[n].keep&&(i[n]=1/0);const n=[];for(let e=0;e<t;e++)i[e]===1/0&&n.push(e);const s=[];for(let e=0;e+1<n.length;e++)s.push([n[e],n[e+1],1/0]);for(;s.length;){const[t,n,a]=s.pop();if(n-t<2)continue;let r=-1,o=t+1;for(let i=t+1;i<n;i++){const s=ed(e[t],e[n],e[i]);s>r&&(r=s,o=i)}const l=Math.min(r,a);i[o]=l,s.push([t,o,l],[o,n,l])}return i}function id(e,t,i,n){let s=0;for(let e=0;e<t.length;e++)t[e]>i&&s++;let a=i;if(s>n){const s=Array.from(t).sort((e,t)=>t-e);if(a=Math.max(i,s[n-1]===1/0?1/0:s[n]),a===1/0)return e.filter((e,i)=>t[i]===1/0).slice(0,n)}return e.filter((e,i)=>t[i]>a)}const nd=e=>e.reduce((e,t)=>e+t,0);function sd(e){const t=[e,...(e.sim.emitters??[]).slice(0,mc.emitters-1).map(t=>((e,t)=>({...e,count:t.count,size:t.size,colors:t.colors,fade:t.fade,spread:t.spread,layer:t.layer??e.layer,sim:{...e.sim,seed:t.seed,flow:t.flow,shapes:t.shapes,ranges:t.ranges,physics:t.physics,children:t.children}}))(e,t))];let i=mc.parents;const n=t.map(e=>{const t=Math.min(Math.max(0,Math.floor(e.count)),i);return i-=t,t}),s=t.map((e,t)=>n[t]*Xc(e.sim.children)),a=mc.elements-nd(n);let r=s;if(nd(s)>a){const e=nd(n.filter((e,t)=>s[t]));r=s.map((t,i)=>t&&Math.min(t,Math.floor(a*n[i]/e)));let t=a-nd(r);r=r.map((e,i)=>e<s[i]&&t-- >0?e+1:e)}const o="front"!==e.layer,l=t.map((e,t)=>({spec:e,n:n[t],m:r[t],at:0,front:"front"===e.layer,index:t})),c=e=>e.front===o,d=[...l.filter(e=>!c(e)),...l.filter(c)];let p=0;d.forEach(e=>{e.at=p,p+=e.n+e.m});const h=d.findIndex(c);return{plans:d,cut:h<0?d.length:h,pool:p}}const ad=e=>e.cut<e.plans.length?e.plans[e.cut].at:e.pool,rd=mc,od=[.5,1,2,4,8,16,32],ld=(e,t)=>{const i=10**t,n=Math.round(e*i)/i;return 0===n?0:n},cd=(e,t,i)=>Math.min(i,Math.max(t,e));function dd(e){const t=Number.isFinite(e.aspect)&&e.aspect>0?e.aspect:2,i=cd(Math.round(4*t)/4,.25,8),n=e.content;if(!n||![n.x,n.y,n.w,n.h].every(Number.isFinite))return{aspect:i};const s=e=>cd(5*Math.round(e/5),0,100);return{aspect:i,content:{x:s(n.x),y:s(n.y),w:s(n.w),h:s(n.h)}}}function pd(e){return`${(e=>ld(100*e,3))(e.t)}%{translate:${e.x}cqw ${e.y}cqh;rotate:${e.rotate}deg;opacity:${e.opacity}${1!==e.scale?`;scale:${e.scale}`:""}}`}const hd=e=>e.reduce((e,t)=>e+pd(t).length,160);function ud(e,t,i){const n=e.period,s=i.map(e=>({...e,tau:t.birth+e.age}));let a;if(t.persistent?s[s.length-1]={...s[0],tau:t.birth+n}:(s[0].keep=!0,s[s.length-1].keep=!0,s.push({...s[0],tau:t.birth+n,keep:!0})),t.birth<=0)a=s;else{let e=s.findIndex(e=>e.tau>=n);e<1&&(e=1);const t=s[e].tau===n?{...s[e],keep:!0}:((e,t,i)=>{const n=t.tau>e.tau?(i-e.tau)/(t.tau-e.tau):0,s=i=>e[i]+(t[i]-e[i])*n;return{tau:i,age:s("age"),x:s("x"),y:s("y"),rotate:s("rotate"),opacity:s("opacity"),scale:s("scale"),keep:!0}})(s[e-1],s[e],n),i=s.slice(0,e),r=s.slice(s[e].tau===n?e+1:e,-1).map(e=>({...e,tau:e.tau-n}));a=[{...t,tau:0},...r,...i,{...t,tau:n}]}const r=t.persistent?360*Math.round(t.spin*n/360):0,o=a.map(i=>({t:i.tau/n,x:i.x/e.W*100,y:i.y/e.H*100,rotate:t.persistent?r*i.tau/n:i.rotate,opacity:i.opacity,scale:i.scale,...i.keep?{keep:!0}:{}}));return o[0].t=0,o[o.length-1].t=1,o}function md(e){const t=[];return e.forEach((i,n)=>{const s=n===e.length-1?1:ld(i.t,5),a={t:s,x:ld(i.x,2),y:ld(i.y,2),rotate:ld(i.rotate,1),opacity:ld(cd(i.opacity,0,1),3),scale:ld(i.scale,3)},r=t[t.length-1];r&&r.t>=s?(n===e.length-1||i.keep)&&(t[t.length-1]=a):t.push(a)}),t}function gd(e){const t=e.period>0&&Number.isFinite(e.period)?e.period:1,i=dd(e.geometry),n=sd(e.spec),s=[],a={elements:0,stops:0,bytes:0,capped:!1,warn:!1};let r=0;n.plans.forEach((e,o)=>{o===n.cut&&(r=s.length);const l=function(e,t,i,n){const s=e.spec,a=s.sim,r=Ic(s,t,i),o=e.n;let l=Math.floor(s.count)>o;const c=a.children,d=Xc(c),p=fc(a.seed),h=[],u=[];for(let e=0;e<o;e++){const t=Kc(r,p,e),i=Zc(r,t,"time"===c?.trigger?c.at??0:void 0);u.push(i);const n=ud(r,t,i.samples);h.push({p:t,raw:n,rank:td(n)})}const m=[];if(c&&d>0){const t=h.map((e,t)=>Jc(c,u[t])?t:-1).filter(e=>e>=0),i=e.m,n=t.length?Math.floor(i/t.length):0,s=t.length?i%t.length:0;t.length*d>i&&(l=!0);const o=fc(vc(a.seed,2));t.forEach((e,t)=>{const i=Math.min(d,n+(t<s?1:0)),a=Jc(c,u[e]);for(const t of Qc(r,c,h[e].p,a,o,i)){const i=ud(r,t,Zc(r,t).samples);m.push({p:t,raw:i,rank:td(i),parent:e})}})}let g=d,f=[],v=0;for(;;){const e=[...h,...m.filter(e=>e.p.index<g)];for(const t of od){f=[],v=0;const i=new Map;if(e.forEach((e,n)=>{void 0===e.parent&&i.set(e.p.index,n);const s=md(id(e.raw,e.rank,t,rd.stopsPerElement));v+=hd(s),f.push({slot:n,...void 0!==e.parent?{parent:i.get(e.parent)}:{},shape:{...e.p.shape},size:ld(e.p.size,2),...void 0!==e.p.color?{color:e.p.color}:{},stops:s})}),v<=n)break;l=!0}if(v<=n||0===g)break;g=Math.floor(g/2)}for(;v>n&&f.length;){const e=f.pop();v-=hd(e.stops),l=!0}const b=f.reduce((e,t)=>e+t.stops.length,0);return{engine:1,period:t,geometry:i,elements:f,stats:{elements:f.length,stops:b,bytes:v,capped:l,warn:v>rd.warnBytes}}}(e,t,i,n.plans[1]?Math.floor(rd.maxBytes*(e.n+e.m)/n.pool):rd.maxBytes);l.elements.forEach(t=>s.push({...t,slot:t.slot+e.at,...void 0!==t.parent?{parent:t.parent+e.at}:{}})),a.stops+=l.stats.stops,a.bytes+=l.stats.bytes,a.capped||=l.stats.capped}),a.elements=s.length,a.warn=a.bytes>rd.warnBytes;const o=n.plans[n.cut];return{engine:1,period:t,geometry:i,elements:s,stats:a,...o?{parts:{element:r,slot:o.at,front:o.front}}:{}}}const fd=(e,t,i)=>`mcc-${e}-${ks(JSON.stringify([t,i]))}`,vd=(e,t)=>`${e}-g${function(e){const t=e.content;return`${Math.round(4*e.aspect)}${t?`c${t.x}_${t.y}_${t.w}_${t.h}`:""}`}(t)}`;function bd(e){const t=e.shape,i={x:0,phase:0,k:0,style:""};return"builtin"in t?i.shape=t.builtin:"icon"in t?i.symbol={icon:t.icon}:"emoji"in t&&(i.symbol={text:t.emoji}),i}function yd(e,t){if(!e.length)return{t,x:0,y:0,rotate:0,scale:1,opacity:0};const i=e.findIndex(e=>e.t>=t);if(i<=0)return{...e[0===i?0:e.length-1],t};const n=e[i-1],s=e[i],a=s.t>n.t?(t-n.t)/(s.t-n.t):0,r=e=>n[e]+(s[e]-n[e])*a;return{t,x:r("x"),y:r("y"),rotate:r("rotate"),scale:r("scale"),opacity:r("opacity")}}function xd(e,t,i,n,s=e=>e){const a=`.mc-anim-fx[data-fx="${e}"]`,r=`mcp${ks(e)}-`,o=[`${a}{opacity:var(${Ss(t,"s")},1)}`,`${a}>i{left:0;top:0;width:var(--mcc-sz);height:var(--mcc-sz);margin:calc(var(--mcc-sz)/-2) 0 0 calc(var(--mcc-sz)/-2);color:var(--mcc-pc,var(${Ss(t,"c")},var(--mc-anim-c)));display:flex;align-items:center;justify-content:center;font-size:var(--mcc-sz);line-height:1;font-style:normal;--mdc-icon-size:var(--mcc-sz);${n?"animation-timing-function:linear":"animation:none"}}`],l=new Map;return i.forEach((e,t)=>{const i=s(t);"svg"in e.shape&&l.set(e.shape.svg,[...l.get(e.shape.svg)??[],i]);const c=n?`animation-name:${r}${i};`:"",d=e.color?fi(e.color,"color"):void 0;o.push(`${a}>i:nth-child(${i+1}){${c}--mcc-sz:${(e=>Math.round(100*e)/100||0)(e.size)}px${d?`;--mcc-pc:${d}`:""}}`),n&&o.push(`@keyframes ${r}${i}{${n(t)}}`)}),l.forEach((e,t)=>{const i=Qt(t).markup,n=i?`-webkit-mask:${Fs(i)} center/contain no-repeat;mask:${Fs(i)} center/contain no-repeat`:"border-radius:50%";o.push(`${a}>i:is(${e.map(e=>`:nth-child(${e+1})`).join(",")}){background:currentColor;${n}}`)}),o.join("\n")}function _d(e,t,i,n,s=0,a=e.elements.length,r=0){const o=e.elements.slice(s,a),l=o.map(e=>n?.[e.slot]??(e=>({shape:e.shape,size:e.size,...void 0!==e.color?{color:e.color}:{}}))(e)),c=xd(t,i,l,e=>o[e].stops.map(pd).join(""),n?e=>o[e].slot-r:void 0);return{css:c,slots:(n??l).map(bd)}}const $d={circle:{d:"M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"},square:{d:"M5 5h14v14H5z"},triangle:{d:"M12 4l8 15H4z"},star:{d:"M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"},heart:{d:"M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"},ring:{d:"M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z",stroke:3},line:{d:"M6 19L18 5",stroke:3},spark:{d:"M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"}};function wd(e){const t=$d[e];return t.stroke?`<path d="${t.d}" fill="none" stroke="currentColor" stroke-width="${t.stroke}" stroke-linecap="round"/>`:`<path d="${t.d}"/>`}const kd=[".mc-anim-fx>i[data-s]{background:currentColor}",'.mc-anim-fx>i[data-s="circle"]{border-radius:50%}','.mc-anim-fx>i[data-s="square"]{border-radius:0}',...uc.filter(e=>"circle"!==e&&"square"!==e).map(e=>`.mc-anim-fx>i[data-s="${e}"]{${(e=>{const t=Fs(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${wd(e)}</svg>`);return`-webkit-mask:${t} center/contain no-repeat;mask:${t} center/contain no-repeat`})(e)}}`)].join("\n"),Md=e=>String(Math.round(100*e)/100||0),Sd=e=>String(Math.round(1e3*e)/1e3||0),Cd=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function Ad(e){const t=void 0!==e?fi(e,"color"):void 0;return t&&!/var\(/i.test(t)?t:void 0}const jd=(e,t)=>`transform:translate(${Md(e.x)}px,${Md(e.y)}px) rotate(${Md(e.rotate)}deg) scale(${Sd(e.scale*t)});opacity:${Sd(e.opacity)}`,zd="particles.sim",Ed=[...oi,"fountain","explode","wave","vortex","zigzag","rain","wander"],Vd=["death","collision","time"],Ld=["none","icon","text"],Pd=[0,1e3],Dd=[-3600,3600],Hd=[0,6e3],Rd=[.01,600],Nd=[0,1],Od=[.001,1e3],Td=[-360,360],Fd=[0,1e3],Id=[0,20],Bd=[0,1e3],qd=[.1,1e3],Kd=[0,1],Ud=[0,600],Gd=[.1,200],Wd=[0,360],Zd=[0,1],Yd={speed:[20,40],spin:[0,0],delay:[0,2],lifetime:[2,2],opacity:[1,1]},Xd={gravity:{angle:0,strength:0},drag:0,turbulence:{strength:0,scale:20},bounce:.5},Jd={floor:!1,ceiling:!1,left:!1,right:!1,content:"none"},Qd=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function ep(e,t,i,n,s,a,r){const o=t[i];if(null==o)return[...a];if(!Array.isArray(o)||2!==o.length||!o.every(e=>"number"==typeof e&&Number.isFinite(e)))return e.err(n,"Must be [min, max]."),[...a];let[l,c]=o;if(l>c&&(r||e.err(n,"Min must not be above max."),[l,c]=[c,l]),l<s[0]||c>s[1]){if(e.err(n,`Must be between ${s[0]} and ${s[1]}.`),!r)return[...a];l=Math.min(s[1],Math.max(s[0],l)),c=Math.min(s[1],Math.max(s[0],c))}return[l,c]}const tp=(e,t,i,n,s,a,r=!1)=>e.num(t,i,n,s[0],s[1],a,r)??a;function ip(e,t,i){if(null==t)return[];const n=e.list(t,i,mc.shapes),s=[];return n?.forEach((t,n)=>{const a=e.obj(t,`${i}[${n}]`);if(!a)return;const r=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["builtin","icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of builtin, icon, emoji or svg.");const a=s[0],r=n[a];if("string"!=typeof r)return e.err(`${i}.${a}`,"Must be text.");if("builtin"===a)return uc.includes(r)?{builtin:r}:e.err(`${i}.builtin`,`Must be one of: ${uc.join(", ")}.`);if("icon"===a)return yi.test(r.trim())?{icon:r.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===a){const t=r.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if((e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length)(r)>32768)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(r))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Qt(r);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:r}}(e,a.shape,`${i}[${n}].shape`),o=e.num(a,"weight",`${i}[${n}].weight`,Od[0],Od[1],1);r&&void 0!==o&&s.push({shape:r,weight:o})}),s}function np(e,t,i){if(null==t)return[];const n=[];return e.list(t,i,di)?.forEach((t,s)=>{const a=fi(t,"color");a?n.push(a):e.err(`${i}[${s}]`,"Not a valid colour.")}),n}function sp(e,t,i,n,s){if(null==t)return s?{}:{...n};const a=e.obj(t,i);if(!a)return s?{}:{...n};const r={},o=e=>!s||void 0!==a[e]&&null!==a[e];if(o("gravity")){const t=Qd(a.gravity)?a.gravity:e.obj(a.gravity??{},`${i}.gravity`)??{};r.gravity={angle:tp(e,t,"angle",`${i}.gravity.angle`,Td,n.gravity.angle),strength:tp(e,t,"strength",`${i}.gravity.strength`,Fd,n.gravity.strength)}}if(o("drag")&&(r.drag=tp(e,a,"drag",`${i}.drag`,Id,n.drag)),o("turbulence")){const t=Qd(a.turbulence)?a.turbulence:e.obj(a.turbulence??{},`${i}.turbulence`)??{};r.turbulence={strength:tp(e,t,"strength",`${i}.turbulence.strength`,Bd,n.turbulence.strength),scale:tp(e,t,"scale",`${i}.turbulence.scale`,qd,n.turbulence.scale)}}return o("bounce")&&(r.bounce=tp(e,a,"bounce",`${i}.bounce`,Kd,n.bounce)),r}function ap(e,t,i){if(null==t)return{...Jd};const n=e.obj(t,i);return n?{floor:e.bool(n,"floor",`${i}.floor`,!1),ceiling:e.bool(n,"ceiling",`${i}.ceiling`,!1),left:e.bool(n,"left",`${i}.left`,!1),right:e.bool(n,"right",`${i}.right`,!1),content:e.oneOf(n,"content",`${i}.content`,Ld,"none")??"none"}:{...Jd}}function rp(e,t,i,n){const s=e.obj(t,i);if(!s)return;const a=e.errors.length;void 0!==s.children&&null!==s.children&&e.err(`${i}.children`,"Children cannot have children of their own.");const r=e.oneOf(s,"trigger",`${i}.trigger`,Vd);r||void 0!==s.trigger||e.err(`${i}.trigger`,"Required.");const o=Qd(s.ranges)?s.ranges:e.obj(s.ranges??{},`${i}.ranges`)??{},l={trigger:r??"death",count:tp(e,s,"count",`${i}.count`,[1,mc.childrenPerParent],3,!0),shapes:ip(e,s.shapes,`${i}.shapes`),size:ep(e,s,"size",`${i}.size`,Gd,[4,6],n),colors:np(e,s.colors,`${i}.colors`),ranges:{speed:ep(e,o,"speed",`${i}.ranges.speed`,Pd,[20,40],n),lifetime:ep(e,o,"lifetime",`${i}.ranges.lifetime`,Rd,[.5,1],n),opacity:ep(e,o,"opacity",`${i}.ranges.opacity`,Nd,[1,1],n),spin:ep(e,o,"spin",`${i}.ranges.spin`,Dd,[0,0],n)},cone:tp(e,s,"cone",`${i}.cone`,Wd,360),inherit:tp(e,s,"inherit",`${i}.inherit`,Zd,0)};"time"===l.trigger?l.at=tp(e,s,"at",`${i}.at`,Ud,.5):void 0===s.at||null===s.at||n||e.err(`${i}.at`,"Only for the trigger time.");const c=sp(e,s.physics,`${i}.physics`,Xd,!0);return Object.keys(c).length&&(l.physics=c),n&&e.errors.length>a?void 0:l}const op=/^[a-z0-9-]{1,16}$/;function lp(e,t,i,n,s){const a=Qd(t.ranges)?t.ranges:e.obj(t.ranges??{},`${i}.ranges`)??{},r=Yd;return{seed:tp(e,t,"seed",`${i}.seed`,[0,4294967295],0,!0)>>>0,flow:s,shapes:ip(e,t.shapes,`${i}.shapes`),ranges:{speed:ep(e,a,"speed",`${i}.ranges.speed`,Pd,r.speed,n),spin:ep(e,a,"spin",`${i}.ranges.spin`,Dd,r.spin,n),delay:ep(e,a,"delay",`${i}.ranges.delay`,Hd,r.delay,n),lifetime:ep(e,a,"lifetime",`${i}.ranges.lifetime`,Rd,r.lifetime,n),opacity:ep(e,a,"opacity",`${i}.ranges.opacity`,Nd,r.opacity,n)},physics:sp(e,t.physics,`${i}.physics`,Xd,!1)}}function cp(e,t,i,n,s,a){const r="string"==typeof t.id&&op.test(t.id)&&!n.has(t.id)?t.id:"";r?n.add(r):(s||null!=t.id)&&e.err(`${i}.id`,"Must be 1-16 of a-z, 0-9 and -, and unique.");const o="string"==typeof t.name?t.name.trim():void 0;return(void 0===o?null!=t.name:o.length>40&&!a)&&e.err(`${i}.name`,"Must be text of at most 40 characters."),{id:r,name:o?.slice(0,40)||void 0}}function dp(e,t,i){const n="lenient"===t,s=new Mi,a=s.obj(e,zd);if(!a)return{errors:s.errors};if(1!==a.engine&&(s.err(`${zd}.engine`,void 0===a.engine?"Required.":"This card plays engine 1; update Magic Card to play this animation."),n))return{errors:s.errors};const r=s.oneOf(a,"flow",`${zd}.flow`,Ed);if(!r&&(void 0===a.flow&&s.err(`${zd}.flow`,"Required."),n))return{errors:s.errors};const o={engine:1,mode:s.oneOf(a,"mode",`${zd}.mode`,["baked","live"],"baked")??"baked",...lp(s,a,zd,n,r??"fall"),colliders:ap(s,a.colliders,`${zd}.colliders`)};if(void 0!==a.children&&null!==a.children){const e=rp(s,a.children,`${zd}.children`,n);e&&(o.children=e)}if(void 0!==a.emitters&&null!==a.emitters){const e=cp(s,a,zd,new Set,!1,n),t=function(e,t,i,n,s){const a=`${zd}.emitters`,r=mc.emitters-1,o=new Set(n?[n]:[]),l=[];e.list(t,a,i?1/0:r)?.slice(0,r).forEach((t,n)=>{const s=`${a}[${n}]`,r=e.obj(t,s);if(!r)return;const{id:c,name:d}=cp(e,r,s,o,!0,i),p=e.oneOf(r,"layer",`${s}.layer`,["front","back"]),h=e.errors.length,u=e.oneOf(r,"flow",`${s}.flow`,Ed);u||e.err(`${s}.flow`,"Required.");const m={id:c,...d&&{name:d},...p&&{layer:p},count:tp(e,r,"count",`${s}.count`,[1,mc.parents],10,!0),size:ep(e,r,"size",`${s}.size`,Gd,[6,10],i),colors:np(e,r.colors,`${s}.colors`),fade:e.bool(r,"fade",`${s}.fade`,!0),spread:tp(e,r,"spread",`${s}.spread`,[0,100],100),...lp(e,r,s,i,u??"fall")},g=e.errors.length===h,f=null==r.children?void 0:rp(e,r.children,`${s}.children`,i);f&&(m.children=f),i&&!g||l.push(m)});let c=s+l.reduce((e,t)=>e+t.count,0)-mc.parents;if(c>0){e.err(a,`At most ${mc.parents} particles over all emitters.`);for(let e=l.length;i&&c>0&&e--;){const t=Math.min(c,l[e].count);l[e].count-=t,c-=t}}const d=l.filter(e=>e.count>0),p=new Set(n?[n]:[]);d.forEach(e=>e.id&&!p.has(e.id)?p.add(e.id):e.id="");let h=0;return d.forEach(e=>{if(!e.id){for(;p.has("e"+ ++h););p.add(e.id=`e${h}`)}}),d}(s,a.emitters,n,e.id,i?Math.max(0,Math.floor(i.count)):1);t.length&&Object.assign(o,e.id&&{id:e.id},e.name&&{name:e.name},{emitters:t})}return{sim:o,errors:s.errors}}const pp=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),pp(e,t);return!0},hp=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},up=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),fp(t)}};function mp(e){void 0!==this._$AN?(hp(this),this._$AM=e,up(this)):this._$AM=e}function gp(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)pp(n[e],!1),hp(n[e]);else null!=n&&(pp(n,!1),hp(n));else pp(this,e)}const fp=e=>{2==e.type&&(e._$AP??=gp,e._$AQ??=mp)};class vp extends Ue{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),up(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(pp(this,e),hp(this))}setValue(e){if(We(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let bp;const yp=new WeakMap,xp=new Set,_p=new WeakMap,$p=new WeakSet,wp=new WeakSet,kp=new WeakSet;function Mp(e,t){for(let i=e;i;i=i.parentNode instanceof ShadowRoot?i.parentNode.host:i.parentNode)if(t?i===t:kp.has(i))return!0;return!1}function Sp(e,t){const i=t&&($p.has(e)||!Mp(e));e.toggleAttribute("offscreen",!i),yp.get(e)?.(i)}function Cp(e,t=!0,i=!0){const n=function(){if(!bp&&"undefined"!=typeof IntersectionObserver){bp=new IntersectionObserver(e=>{for(const t of e)_p.set(t.target,t.isIntersecting),Sp(t.target,t.isIntersecting)});const[e,t]=[bp.observe.bind(bp),bp.unobserve.bind(bp)];bp.observe=t=>{xp.add(t),e(t)},bp.unobserve=e=>{xp.delete(e),_p.delete(e),t(e)}}return bp}();return!!n&&(t?$p.delete(e):$p.add(e),i?wp.delete(e):wp.add(e),n.observe(e),!0)}function Ap(e){bp?.unobserve(e),e.removeAttribute("offscreen")}Ke(class extends vp{constructor(e){if(super(e),this._counted=!0,6!==e.type)throw new Error("pauseOffscreen() is an element directive")}render(e){return Q}update(e,[t]){const i=!1!==t?.counted;var n;return e.element!==this._el?(this._unwatch(),this._el=e.element,this._counted=i,this.isConnected&&Cp(this._el,!0,i)&&(n=this._el,queueMicrotask(()=>Mp(n)&&Sp(n,!1)))):i!==this._counted&&(this._counted=i,this.isConnected&&Cp(this._el,!0,i)),Q}_unwatch(){this._el&&Ap(this._el)}disconnected(){this._unwatch()}reconnected(){this._el&&Cp(this._el,!0,this._counted)}});const jp=mc.dt,zp=Math.ceil(.1/jp)+1,Ep=e=>Math.round(100*e)/100;function Vp(e,t,i){const n=Ic(e,t,gc),s=i?i.n:Math.min(Math.max(0,Math.floor(e.count)),mc.parents),a=fc(e.sim.seed),r=[];for(let e=0;e<s;e++){const t=Kc(n,a,e);r.push({shape:t.shape,size:Ep(t.size),...void 0!==t.color?{color:t.color}:{}})}const o=e.sim.children,l=Xc(o),c=i?i.m:o&&s?Math.min(s*l,mc.elements-s):0,d=fc(vc(e.sim.seed,5));for(let e=0;e<c;e++){const t=Bc(d,o.shapes),i=bc(d,o.size),n=o.colors.length?o.colors[e%o.colors.length]:r[Math.floor(e/Math.max(1,l))%s].color;r.push({shape:t,size:Ep(i),...void 0!==n?{color:n}:{}})}return{parents:s,children:c,looks:r}}const Lp=(e,t)=>e.plans.map(e=>Vp(e.spec,t,e));function Pp(e,t,i){const n=1e-6;return t.ny<0&&t.y>=e.H-i-n?"floor":t.ny>0&&t.y<=i+n?"ceiling":t.nx>0&&t.x<=i+n?"left":t.nx<0&&t.x>=e.W-i-n?"right":"content"}const Dp=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy});class Hp{constructor(e,t,i,n=Vp(e,t)){this.faces=new Set,this.slots=[],this.world=Ic(e,t,i),this.layout=n,this.rng=fc(e.sim.seed),this.crng=fc(vc(e.sim.seed,2));for(let e=0;e<n.parents;e++){const t=this.spawn(e);this.slots.push({next:t,wait:t.birth,fired:!1})}this.kids=new Array(n.children).fill(void 0)}spawn(e){const t=Kc(this.world,this.rng,e);return t.size=this.layout.looks[e].size,t.radius=qc(t.size),t.persistent&&(t.life=1/0),t}emit(e,t,i){e.fired=!0;const n=this.world.sim.children;if(!n)return;const s=[];for(let e=0;e<this.kids.length&&s.length<Xc(n);e++)this.kids[e]||s.push(e);Qc(this.world,n,t,i,this.crng,s.length).forEach((e,t)=>{e.size=this.layout.looks[this.layout.parents+s[t]].size,e.radius=qc(e.size),this.kids[s[t]]=e})}step(){const e=this.world,t=e.sim.children;this.slots.forEach((i,n)=>{if(!i.p){if(i.wait-=jp,i.wait>1e-9)return;i.p=i.next,i.fired=!1}const s=i.p,a=Wc(e,s,jp);a&&(this.faces.add(Pp(e,a,s.radius)),"collision"!==t?.trigger||i.fired||this.emit(i,s,{...a,vx:s.vx,vy:s.vy})),"time"===t?.trigger&&!i.fired&&s.age>=(t.at??0)-1e-9&&this.emit(i,s,Dp(s)),s.age>=s.life-1e-9&&("death"!==t?.trigger||i.fired||this.emit(i,s,Dp(s)),i.p=void 0,i.next=this.spawn(n),i.wait=i.next.birth)}),this.kids.forEach((t,i)=>{if(!t)return;const n=Wc(e,t,jp);n&&this.faces.add(Pp(e,n,t.radius)),t.age>=t.life-1e-9&&(this.kids[i]=void 0)})}frame(){const e=this.world,t=t=>{if(!t)return;const i=Gc(e,t);return{x:i.x/e.W*100,y:i.y/e.H*100,rotate:i.rotate,opacity:i.opacity,scale:i.scale}};return[...this.slots.map(e=>t(e.p)),...this.kids.map(t)]}}const Rp=["translate","rotate","scale","opacity","animation"],Np=(e,t)=>{const i=10**t;return Math.round(e*i)/i||0};function Op(e,t,i=!1){const n=e.children;for(let e=0;e<n.length;e++){const s=n[e].style;i&&s.setProperty("animation","none");const a=t[e];!a||a.opacity<=0?"0"!==s.getPropertyValue("opacity")&&s.setProperty("opacity","0"):(s.setProperty("translate",`${Np(a.x,2)}cqw ${Np(a.y,2)}cqh`),s.setProperty("rotate",`${Np(a.rotate,1)}deg`),s.setProperty("opacity",String(Np(a.opacity,3))),1!==a.scale?s.setProperty("scale",String(Np(a.scale,3))):s.removeProperty("scale"))}}function Tp(e){for(const t of e.children)for(const e of Rp)t.style.removeProperty(e)}const Fp=new Map;let Ip=0,Bp=0,qp=!1;const Kp=()=>"undefined"==typeof document||"hidden"!==document.visibilityState,Up=()=>{for(const e of Fp.values())if(e.on)return!0;return!1};function Gp(){Ip&&"function"==typeof cancelAnimationFrame&&cancelAnimationFrame(Ip),Ip=0,Bp=0}function Wp(){!Ip&&Kp()&&Up()&&"function"==typeof requestAnimationFrame&&(Ip=requestAnimationFrame(Zp))}function Zp(e){Ip=0;const t=Bp?Math.min(.1,Math.max(0,(e-Bp)/1e3)):jp;Bp=e;for(const e of[...Fp.values()])if(e.el.isConnected){if(e.on){e.acc+=t;for(let t=0;e.acc>=jp-1e-9&&t<zp;t++){for(const t of e.sims)t.step();e.acc-=jp}Op(e.el,e.sims.flatMap(e=>e.frame()))}}else Jp(e.el);Up()&&Kp()?Ip=requestAnimationFrame(Zp):Bp=0}function Yp(){Kp()?Wp():Gp()}function Xp(e,t,i,n){const s=sd(e),a=Lp(s,t);return s.plans.flatMap((e,r)=>r>=s.cut==!!n?[new Hp(e.spec,t,i,a[r])]:[])}function Jp(e){var t;Fp.delete(e)&&(t=e,yp.delete(t),Ap(t),Tp(e),Up()||Gp())}const Qp=new Map;function eh(e,t,i,n,s,a){const r=sd(t),o=((e,t)=>Lp(e,t).flatMap(e=>e.looks))(r,i),l=t=>{const i=s?vd(t?n+"o":n,s):`${t?n+"o":n}-g0`,l=((e,t)=>[t.slice(0,ad(e)),t.slice(ad(e))])(r,o)[t],c=a?_d(a,i,e,o,t?a.parts.element:0,t?void 0:a.parts?.element,t?a.parts.slot:0).css:function(e,t,i){return{css:xd(t,i,e),slots:e.map(bd)}}(l,i,e).css;return{name:i,css:c,slots:l.map(bd)}},c=l(0),d=r.cut<r.plans.length?l(1):void 0,p="front"===t.layer,h=!!s&&!a&&r.plans.some(e=>Math.floor(e.spec.count)>e.n||e.m<e.n*Xc(e.spec.sim.children)),u=a?a.stats:{elements:o.length,stops:0,bytes:c.css.length+(d?.css.length??0),capped:h,warn:!1},m=ad(r),g=r.plans.map((e,t)=>({index:e.index,part:t<r.cut?0:1,first:e.at-(t<r.cut?0:m),parents:e.n,children:e.m})).sort((e,t)=>e.index-t.index);return{compiled:{mode:t.sim.mode,...c,front:p,...d?{other:{...d,front:!p}}:{},emitterSlots:g,stats:u},...a?{loop:a}:{},plan:r,still:[]}}function th(e,t,i,n){const s=dd(n),a=fd(e,t,i),r=vd(a,s);let o=Qp.get(a);const l=o?.get(r);if(o&&l)return o.delete(r),o.set(r,l),Qp.delete(a),Qp.set(a,o),l;const c=eh(e,t,i,a,s,"live"===t.sim.mode?void 0:gd({spec:t,period:i,geometry:s}));if(!o)for(o=new Map,Qp.set(a,o);Qp.size>32;)Qp.delete(Qp.keys().next().value);for(o.set(r,c);o.size>mc.geometryVariants;)o.delete(o.keys().next().value);return c}const ih=new WeakSet;let nh=!1;var sh;sh=dp,ii.simValidator=sh;const ah={version:"1.2.0",validateSim:dp,bake:gd,bakedCss:_d,bakedSvg:function(e,t){const i=Number.isFinite(t.width)&&t.width>0?Math.round(t.width):200,n=Number.isFinite(t.height)&&t.height>0?Math.round(t.height):100,s=e.period>0&&Number.isFinite(e.period)?e.period:1,a=`p${ks(JSON.stringify([e.period,e.geometry,e.elements.length,e.stats.bytes]))}`,r=void 0!==t.background?Ad(t.background):void 0,o=new Map,l=`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}" fill="currentColor" color="#03a9f4">`,c=r?`<path d="M0 0H${i}V${n}H0z" fill="${Cd(r)}"/>`:"";let d=l.length+c.length+64;const p=[],h=[],u=[],m=e=>({...e,x:e.x/100*i,y:e.y/100*n}),g=e.elements.map((e,t)=>t);return e.parts&&!e.parts.front&&g.push(...g.splice(0,e.parts.element)),g.forEach(t=>{const i=e.elements[t],n=(e=>{const t=JSON.stringify(e);let i=o.get(t);return i||o.set(t,i=function(e){const t=(e,t,i,n,s)=>({markup:`<g transform="translate(${Sd(-(t+n/2))} ${Sd(-(i+s/2))})">${e}</g>`,grid:Math.max(n,s)||24});if("builtin"in e)return t(wd(e.builtin),0,0,24,24);if("svg"in e){const i=Qt(e.svg);if(!i.error){const e=new Set(i.evenodd?.paths??[]),n=new Set(i.evenodd?.accent??[]),s=[...i.paths.map((t,i)=>`<path d="${Cd(t)}"${e.has(i)?' fill-rule="evenodd"':""}/>`),...i.accentPaths.map((e,t)=>`<path d="${Cd(e)}"${n.has(t)?' fill-rule="evenodd"':""}/>`),...i.strokes.map(e=>`<path d="${Cd(e.d)}" fill="none" stroke="currentColor" stroke-width="${Sd(e.width)}"${e.cap?` stroke-linecap="${Cd(e.cap)}"`:""}${e.join?` stroke-linejoin="${Cd(e.join)}"`:""}/>`)].join(""),[a,r,o,l]=i.viewBox.split(/[\s,]+/).map(Number);if(s.length<=2048&&[a,r,o,l].every(Number.isFinite)&&o>0&&l>0)return t(s,a,r,o,l)}}return t('<path d="M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"/>',0,0,24,24)}(e)),i})(i.shape),s=Ad(i.color),r=`<g class="${a}e${t}"${s?` color="${Cd(s)}"`:""}>${n.markup}</g>`;if(d+r.length>31744)return;d+=r.length,p.push(r);const l=i.size/n.grid;h.push(`.${a}e${t}{${jd(m(yd(i.stops,.5)),l)}}`);const c=i.stops.map(e=>`${Sd(100*e.t)}%{${jd(m(e),l)}}`).join("");u.push(`.${a} .${a}e${t}{animation-name:${a}a${t}}@keyframes ${a}a${t}{${c}}`)}),[l,`<style>${[`.${a}>g{transform-box:view-box;transform-origin:0 0}`,...h,`@media (prefers-reduced-motion:no-preference){.${a}>g{animation-duration:${Sd(s)}s;animation-timing-function:linear;animation-iteration-count:infinite}`,...u,"}"].join("\n")}</style>`,c,`<g class="${a}">`,...p,"</g>","</svg>"].join("\n")},apply:function(e,t){try{const{spec:i,period:n,docId:s}=t;if(!i?.sim)throw new Error("the animation has no particle simulation");t.useCss("mcp-shapes",kd);const a=function(e,t){const i=e.getBoundingClientRect();if(!(i.width>0&&i.height>0))return;const n={aspect:i.width/i.height};if("none"!==t.spec.sim.colliders.content){const e=t.content?.()?.getBoundingClientRect();e&&e.width>0&&e.height>0&&(n.content={x:(e.left-i.left)/i.width*100,y:(e.top-i.top)/i.height*100,w:e.width/i.width*100,h:e.height/i.height*100})}return dd(n)}(e,t),r=a??gc,o=th(s,i,n,r),l=t.part?1:0,c=l?o.compiled.other:o.compiled;if(e.getAttribute("data-fx")!==c.name&&(t.useCss(c.name,c.css),e.setAttribute("data-fx",c.name)),t.reducedMotion)return Jp(e),Op(e,function(e,t,i,n,s){if(e.still[s])return e.still[s];const a=[],r=e.loop;if(r){const e=r.parts?.element??r.elements.length;r.elements.slice(s?e:0,s?void 0:e).forEach(e=>a[e.slot-(s?r.parts.slot:0)]=yd(e.stops,.5))}else{const e=Xp(t,i,n,s),r=Math.round(Math.min(.5*i,3)/mc.dt);for(const t of e)for(let e=0;e<r;e++)t.step();a.push(...e.flatMap(e=>e.frame()))}return e.still[s]=a}(o,i,n,r,l),!0),void ih.add(e);ih.delete(e)&&Tp(e),"live"===i.sim.mode?function(e,t,i,n,s,a=0){if(Fp.get(e)?.key===s)return;Jp(e),qp||"undefined"==typeof document||(document.addEventListener("visibilitychange",Yp),qp=!0);const r=Xp(t,i,n,a),o={el:e,sims:r,key:s,on:!1,acc:0};var l,c;Fp.set(e,o),l=e,c=t=>{Fp.get(e)===o&&(o.on=t,t?Wp():Up()||Gp())},yp.set(l,c),Cp(l,!0,!0)||(o.on=!0,Wp())}(e,i,n,r,c.name,l):Jp(e)}catch(e){nh||(nh=!0,console.warn("Magic Card: a particle layer could not be set up; it plays its simple version.",e))}},release:function(e){Jp(e),ih.delete(e)&&Tp(e)}},rh=function(e,t,i,n){return n.aspect>0?th(e,t,i,n).compiled:eh(e,t,i,fd(e,t,i)).compiled},oh=new WeakMap;function lh(e){const t="particles"===e.kind?e.particles:void 0;if(!t?.sim)return;if(oh.has(t))return oh.get(t);let i;try{const n=dp(t.sim,"lenient").sim;if(n){const s={...t,sim:n},a=rh(e.id,s,e.duration/t.speed,{aspect:0}),r=Wl({...e,particles:{...t,sim:n}});a.emitterSlots&&(i={base:a.name.replace(/-g\w+$/,""),emitterSlots:a.emitterSlots,ids:r})}}catch{i=void 0}return oh.set(t,i),i}function ch(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e&&e!==document.body?e:null}function dh(e,t,i){const n="alert"===e.variant;return Z`<mc-ui-window
    variant=${e.variant??"sheet"}
    size=${e.size??Q}
    heading=${e.heading}
    closeLabel=${na(171)}
    ?movable=${!n}
    ?resizable=${!n}
    ?maximizable=${!n}
    moveLabel=${na(491)}
    resizeLabel=${na(746)}
    maximizeLabel=${na(452)}
    restoreLabel=${na(747)}
    initialFocus=${e.initialFocus??Q}
    .dismissible=${e.dismissible??!n}
    @mc-window-close=${t=>{t.stopPropagation(),e.onClose()}}
  >
    ${t}${i?Z`<div slot="footer" class="foot">${i}</div>`:Q}
  </mc-ui-window>`}const ph=new WeakMap;function hh(e,t=18){return e.glyph&&Ee(e.glyph)?ze(e.glyph,t):e.icon?Z`<ha-icon icon=${e.icon}></ha-icon>`:Q}Ke(class extends vp{render(e){return Q}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),Q}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=ph.get(t);void 0===i&&(i=new WeakMap,ph.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?ph.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});const uh={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};class mh{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),n=i.indexOf(e.composedPath().find(e=>i.includes(e))),s=function(e,t,i,n="horizontal",s=!0){if(!uh[n].includes(e)||!i.length)return-1;const a=i.length,r=e=>e>=0&&e<a&&!i[e].disabled,o=(e,t)=>{for(let i=1;i<=a;i++){let n=e+t*i;if(s)n=(n+2*a)%a;else if(n<0||n>=a)return e;if(r(n))return n}return e};if("Home"===e)return r(0)?0:o(0,1);if("End"===e)return r(a-1)?a-1:o(a-1,-1);const l="ArrowLeft"===e||"ArrowUp"===e;return o(t<0?l?0:-1:t,l?-1:1)}(e.key,n,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap);s<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,s),this.opts.onMove?.(i[s],s))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}function gh(e){const t="tablist"===e.role,i=new mh({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return Z`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const n=i.value===e.value,s=!!i.disabledReason;return Z`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(n):Q} aria-checked=${t?Q:String(n)} aria-disabled=${s?"true":Q} tabindex=${n?"0":"-1"} @click=${()=>{s||e.onChange(i.value)}} >${hh(i)}${i.label}</button>`})}</div>`}const fh="{opacity:0!important}",vh=e=>`"${e.replace(/[\\"]/g,"\\$&").replace(/\n/g,"\\a ")}"`,bh=e=>`.mc-module-wrapper[data-mc-run] [data-mc-part=${vh(e)}]:not(.mc-module-wrapper[data-mc-run] .mc-module-wrapper [data-mc-part])`,yh="data-mc-stage-hide";class xh{constructor(){this._css={icon:"",card:""},this._sheets={},this._text=new WeakMap}set(e,t){this._css=t,this.attach(e)}attach(e){if(e){this._into(e,"card");for(const t of e.querySelectorAll(".mc-anim-icon"))t.shadowRoot&&this._into(t.shadowRoot,"icon")}}_into(e,t){const i=this._css[t];if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype){let n=this._sheets[t];return n||(n=new CSSStyleSheet,this._sheets[t]=n,n.replaceSync(i)),this._text.get(n)!==i&&(n.replaceSync(i),this._text.set(n,i)),void(e.adoptedStyleSheets.includes(n)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]))}let n=[...e.children].find(e=>"STYLE"===e.tagName&&e.hasAttribute(yh));n||(n=document.createElement("style"),n.setAttribute(yh,""),e.appendChild(n)),n.textContent!==i&&(n.textContent=i)}}const _h="light.mc_studio_preview",$h=e=>(e?.clips?.length??0)>0||(e?.bindings?.length??0)>0,wh={state:"on",value:.6,attributes:{}},kh=e=>Math.round(1e3*e)/1e3,Mh=(e,t)=>kh(e.input.min+(e.input.max-e.input.min)*Math.min(1,Math.max(0,t)));function Sh(e){const t=e?.bindings??[],i=t.find(e=>!e.input.attribute),n=(e?.clips??[]).some(e=>"above"in e.when||"below"in e.when);return{value:t.length>0||n,numericState:!!i||n,...i?{stateRange:[i.input.min,i.input.max]}:{}}}function Ch(e,t){const i={};for(const n of e?.bindings??[])n.input.attribute&&!(n.input.attribute in i)&&(i[n.input.attribute]=Mh(n,t));return i}function Ah(e){const t=new Date(0).toISOString();return{entity_id:_h,state:e.state??wh.state,attributes:{friendly_name:na(698),...e.attributes??{}},last_changed:t,last_updated:t,context:{id:"mc-studio-preview",parent_id:null,user_id:null}}}function jh(e){return"state"in e?na(892,{state:e.state}):"state_not"in e?na(891,{state_not:e.state_not}):"entity_on"in e?e.entity_on?na(313):na(312):"above"in e?na(1069,{above:e.above}):na(1071,{below:e.below})}var zh=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Eh=[{id:"light",label:430,icon:"mdi:white-balance-sunny"},{id:"dark",label:224,icon:"mdi:weather-night"}],Vh=[.25,.5,1,1.5,2],Lh=_h,Ph=(e,t)=>!!t||$h(e);function Dh(e,t,i,n,s=1){return i>0&&n>0&&e>0&&t>0?Math.max(.2,Math.min(s,e/i,t/n)):1}const Hh={light:"--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#f2f3f5;--primary-text-color:#212121;--secondary-text-color:#5f6368;--divider-color:rgba(0,0,0,.12);--state-icon-color:#44739e;color-scheme:light",dark:"--card-background-color:#1c1c1c;--primary-background-color:#111111;--secondary-background-color:#282a2d;--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--divider-color:rgba(225,225,225,.12);--state-icon-color:#9fbcd9;color-scheme:dark"};function Rh(e){return{states:{},entities:{},language:"en",locale:{language:"en",number_format:"language",time_format:"language"},themes:{themes:{},darkMode:e},callWS:async()=>({}),callService:async()=>{}}}class Nh extends fe{constructor(){super(...arguments),this.lookup=()=>{},this.tile="icon",this.zoomIcon=!1,this.layerView=Ul,this.hiddenLayers=0,this.theme="light",this.reduced=!1,this.speed=1,this.playing=!0,this._t=0,this._k=1,this._fh=0,this._raf=0,this._last=0,this._lastTimeEvent=0,this._sentTime=-1,this._themeSet=!1,this._sheets=new xh,this._attachQueued=!1,this._rates=new WeakMap,this._drives=!1,this._loop=()=>{if(!this.isConnected)return;const e=performance.now();if(this.playing&&this._last){const t=this.cycle;this._t=(this._t+(e-this._last)/1e3*this.speed)%t,this._emitTime()}this._last=e,this._raf=requestAnimationFrame(this._loop)}}connectedCallback(){if(super.connectedCallback(),!this._themeSet){this._themeSet=!0;const e=this.hass?.themes?.darkMode;this.theme=e??function(e){const t=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(e).color||"");if(!t)return!1;const[i,n,s]=t.slice(1).map(Number);return.2126*i+.7152*n+.0722*s>140}(this)?"dark":"light"}customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate()),this._poll=setInterval(()=>this._sync(),250),this._loop(),this.hasUpdated&&this._observeFrame()}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._mo?.disconnect(),this._mo=this._moRoot=void 0,cancelAnimationFrame(this._raf),this._raf=0,this._poll&&clearInterval(this._poll),this._poll=void 0}get card(){return this._card}get cycle(){return this.doc?function(e,t){if("sequence"===e.kind){const i=Ys(e,{lookup:t}).schedule?.total??0;return i>0?i:1}const i="particles"!==e.kind||e.particles?.preset?1:e.particles?.speed||1;return Math.max(.05,e.duration/i)}(this.doc,this.lookup):1}get scale(){return this._k}togglePlay(){this.playing?this.pause():this.play()}play(){this.playing=!0;for(const e of this._anims())this._rate(e),e.play()}pause(){this.playing=!1;for(const e of this._anims())e.pause()}seek(e){this.playing=!1,this._t=Math.min(this.cycle,Math.max(0,e));for(const e of this._anims())e.pause(),e.currentTime=1e3*this._t;this._emitTime(!0)}_emitTime(e=!1){const t=performance.now(),i=Math.min(1,Math.max(0,this._t/this.cycle));!e&&(t-this._lastTimeEvent<33||i===this._sentTime)||(this._lastTimeEvent=t,this._sentTime=i,this.dispatchEvent(new CustomEvent("stage-time",{detail:{time:i}})))}_observeFrame(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");e&&t&&!this._ro&&"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this._fit()),this._ro.observe(e),this._ro.observe(t))}_fit(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");if(!e||!t)return;const i=e.offsetHeight,n=this.zoomIcon?this._iconBox(e):void 0;let s,a;if(n&&t.clientWidth>0&&t.clientHeight>0){const e=function(e,t,i){const n=Math.round(1e3*Dh(e-32,t-32,i.width+40,i.height+40,4))/1e3;return{k:n,x:Math.round(e/2-(i.x+i.width/2)*n),y:Math.round(t/2-(i.y+i.height/2)*n)}}(t.clientWidth,t.clientHeight,n);s=e.k,a={x:e.x,y:e.y}}else s=Math.round(1e3*Dh(t.clientWidth-32,t.clientHeight-32,e.offsetWidth,i,1))/1e3;s!==this._k&&(this._k=s),i!==this._fh&&(this._fh=i),a?.x===this._off?.x&&a?.y===this._off?.y||(this._off=a),this.isUpdatePending?this.updateComplete.then(()=>this._emitRect()):this._emitRect()}_emitRect(){const e=this.shadowRoot?.querySelector(".frame");e&&this.dispatchEvent(new CustomEvent("stage-rect",{detail:this._rectDetail(e)}))}_rectDetail(e){const t=this._subjectRect(e),i=this._iconViewBox();return{width:e.offsetWidth,height:e.offsetHeight,scale:this._k,...t?{subject:t}:{},...i?{viewBox:i}:{}}}_iconViewBox(){const e=this._card?.shadowRoot?.querySelector(".mc-anim-icon"),t="MC-SVG-ICON"===e?.tagName?e.shadowRoot?.querySelector("svg")?.getAttribute("viewBox"):null,i=t?.trim().split(/[\s,]+/).map(Number);return i&&4===i.length&&i.every(Number.isFinite)?i:void 0}_subjectRect(e){const t=this._card?.shadowRoot;if(!t||!this.doc)return;const i=this.subjectTarget,n="name"===i||"state"===i||"background"===i?t.querySelector(`[data-mc-part="${i}"]`):null,s=i?"icon"===i||/^(part|group|shape):/.test(i):"path"===this.doc.kind?"icon"===this.doc.path?.subject:"icon"===this.doc.target,a=n??(s?t.querySelector(".mc-anim-icon"):null)??t.querySelector(".mc-module-wrapper");return this._boxOf(a,e)}_iconBox(e){return this._boxOf(this._card?.shadowRoot?.querySelector(".mc-anim-icon")??null,e)}_boxOf(e,t){const i=e?.offsetParent;if(!e||!i||!e.offsetWidth)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),a=this._k||1;return{x:Math.round((s.left-n.left)/a+i.clientLeft+e.offsetLeft),y:Math.round((s.top-n.top)/a+i.clientTop+e.offsetTop),width:e.offsetWidth,height:e.offsetHeight}}setSpeed(e){this.speed=e;for(const e of this._anims())this._rate(e)}_rate(e){const t=this._rates.get(e),i=t&&e.playbackRate===t.set?t.base:e.playbackRate,n=i*this.speed;e.playbackRate!==n&&(e.playbackRate=n),this._rates.set(e,{base:i,set:e.playbackRate})}_anims(){return function(e){const t=new Set,i=e=>{for(const i of e.getAnimations?.()??[])t.add(i);for(const t of e.querySelectorAll("*"))t.shadowRoot&&i(t.shadowRoot)};return e&&i(e),[...t]}(this._card?.shadowRoot)}_sync(){for(const e of this._anims())this._rate(e),this.playing||"running"!==e.playState||(e.pause(),e.currentTime=1e3*this._t)}_previewHass(){const e=this.hass,t=this._hassFor,i=Ph(this.doc,this.preview)?(e=>e?function(e,t){return{state:t.state??e.state,value:t.value??e.value,attributes:t.attributes??e.attributes}}(wh,e):wh)(this.preview):void 0;if(t&&t.src===e&&t.theme===this.theme&&t.tile===this.tile&&JSON.stringify(t.sim)===JSON.stringify(i))return t.value;const n="dark"===this.theme,s=e?{...e,themes:{...e.themes??{},darkMode:n}}:Rh(n),a=ua(this.tile,s),r=i?function(e,t){const i=e.states??{};return{...e,states:{...i,[_h]:Ah(t)}}}(a,i):a;return this._hassFor={src:e,theme:this.theme,tile:this.tile,sim:i,value:r},r}willUpdate(e){if(!customElements.get("magic-card")||!this.doc)return;this._card||(this._card=document.createElement("magic-card"));const t=Ph(this.doc,this.preview),i=t!==this._drives;if(this._drives=t,e.has("doc")||e.has("tile")||e.has("reduced")||e.has("lookup")||i||!this._card.shadowRoot)try{this._card.setConfig(ka(this.doc,this.lookup,{tile:this.tile,still:this.reduced,...t?{entity:Lh}:{}}))}catch(e){console.warn("Magic Card studio: preview failed",e)}if(e.has("hass")||e.has("theme")||e.has("preview")||e.has("tile")||e.has("doc")||!this._card.hass){const e=this._previewHass();e!==this._card.hass&&(this._card.hass=e)}}firstUpdated(){this._observeFrame()}_applyHide(){const e=this._card?.shadowRoot;e&&this.doc&&(this._sheets.set(e,((e,t,i)=>{const n=[],s=[],a=ec(e,t);for(const t of a){const a=t.indexOf(":"),r=t.slice(0,a),o=t.slice(a+1);"part"===r?n.push(`[data-p=${vh(o)}]${fh}`):"group"===r?n.push(`[data-g=${vh(o)}]${fh}`):"shape"===r?n.push(`[data-s=${vh(o)}]${fh}`):"emitter"!==r||i||e.particles?.sim?"target"===r&&("background"===o?s.push(".mc-module-wrapper{background:none!important}",`[data-mc-gen-bg]${fh}`):"element"!==o&&s.push(`${bh(o)}${fh}`)):s.push(`.mc-anim-fx${fh}`)}return i&&s.push(...function(e,t){const i=[];return t.ids.forEach((n,s)=>{const a=t.emitterSlots.find(e=>e.index===s);if(!a)return;const r=`.mc-anim-fx[data-fx^=${vh(`${t.base}${a.part?"o":""}-g`)}]>i`,o=(e,t)=>{t>=e&&i.push(`${r}:nth-child(n+${e}):nth-child(-n+${t})${fh}`)};e.has(`emitter:${n}`)?o(a.first+1,a.first+a.parents+a.children):(e.has(`${Ql}${n}`)&&o(a.first+1,a.first+a.parents),e.has(`children:${n}`)&&o(a.first+a.parents+1,a.first+a.parents+a.children))}),i}(a,i)),{icon:n.join("\n"),card:s.join("\n")}})(this.doc,this.layerView,this.stageParticles)),this._moRoot!==e&&(this._mo?.disconnect(),this._moRoot=e,this._mo=new MutationObserver(()=>{this._attachQueued||(this._attachQueued=!0,queueMicrotask(()=>{this._attachQueued=!1,this._sheets.attach(this._card?.shadowRoot)}))}),this._mo.observe(e,{childList:!0,subtree:!0})))}_showAll(){const e={...this.layerView,hidden:[],solo:[]};this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:e,announce:this.layerView.locked.length?na(48):na(47)},bubbles:!0,composed:!0}))}updated(e){(e.has("doc")||e.has("layerView")||e.has("stageParticles")||e.has("tile")||e.has("reduced")||!this._moRoot)&&(this._applyHide(),this._card?.updateComplete?.then(()=>this._applyHide())),e.has("subjectTarget")&&requestAnimationFrame(()=>this._emitRect()),e.has("zoomIcon")&&requestAnimationFrame(()=>this._fit()),(e.has("doc")||e.has("tile")||e.has("reduced")||e.has("preview"))&&this._card?.updateComplete?.then(()=>{this._sync(),requestAnimationFrame(()=>this._fit())})}_pickTile(e){e!==this.tile&&(this.tile=e,this.dispatchEvent(new CustomEvent("stage-tile",{detail:{tile:e},bubbles:!0,composed:!0})))}_seg(e,t,i,n,s){return Z`<div class="seg ${s}" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.id===i),a={ArrowRight:(s+1)%t.length,ArrowLeft:(s-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];if(void 0===a)return;e.preventDefault(),n(t[a].id);const r=e.currentTarget;this.updateComplete.then(()=>r.querySelector('[aria-checked="true"]')?.focus())}}>
      ${t.map(e=>{const t=e.id===i;return Z`<button
          type="button"
          role="radio"
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          title=${na(e.label)}
          @click=${()=>n(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon><span class="lbl">${na(e.label)}</span>
        </button>`})}
    </div>`}_missing(){return Z`<div class="missing" role="status">
      <ha-icon icon="mdi:card-off-outline"></ha-icon>
      <strong>${na(450)}</strong>
      <p>${na(978)}</p>
    </div>`}render(){const e=this.cycle,t=Math.min(this._t,e),i=!!customElements.get("magic-card"),n=this._k,s=this._off,a=s?"":`width: ${Math.round(360*n)}px; height: ${this._fh?`${Math.round(this._fh*n)}px`:"auto"}`,r=s?`translate(${s.x}px, ${s.y}px) `:"";return Z`
      <div class="canvas">
        <div class="dock dock-top">
          ${this.hiddenLayers>0||this.layerView.solo.length>0?Z`<div class="hide-chip" role="group" aria-label=${na(422)}>
                <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                <span>${this.hiddenLayers>0?na(700,{count:this.hiddenLayers}):na(851)}</span>
                <button type="button" class="show-all" aria-label=${na(827)} @click=${()=>this._showAll()}>${na(826)}</button>
              </div>`:Q}
          <slot name="top"></slot>
        </div>
        <div class="area">
        <div class="fit ${s?"zoomed":""}" style=${a}>
          <div class="frame" style="${Hh[this.theme]};width:${360}px;transform:${r}scale(${n})" data-theme=${this.theme}>
            ${i&&this._card?this._card:this._missing()}
            <div class="overlay"><slot name="overlay"></slot></div>
          </div>
        </div>
        ${this.reduced&&i?Z`<p class="note">${na(1084)}</p>`:Q}
        ${s?Z`<span class="zoom-tag" title=${na(1093)}>${na(391,{percent:Math.round(100*n)})}</span>`:Math.abs(n-1)>.005?Z`<span class="zoom-tag" title=${na(977)}>${Math.round(100*n)}%</span>`:Q}
        </div>
        <div class="dock dock-bottom"><slot name="bottom"></slot></div>
      </div>
      <div class="transport">
        <button
          type="button"
          class="icon-btn sm play"
          aria-label=${this.playing?na(658):na(674)}
          title=${this.playing?na(658):na(674)}
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
          aria-label=${na(694)}
          aria-valuetext=${na(1223,{now:t.toFixed(2),total:e.toFixed(2)})}
          .value=${String(t)}
          ?disabled=${this.reduced||!i}
          @input=${e=>this.seek(Number(e.target.value))}
        />
        <span class="time mono" aria-hidden="true">${t.toFixed(2)} / ${e.toFixed(2)} s</span>
        <label class="speed">
          <span class="sr-only">${na(857)}</span>
          <div class="select">
            <select class="input" aria-label=${na(857)} @change=${e=>this.setSpeed(Number(e.target.value))}>
              ${Vh.map(e=>Z`<option value=${e} ?selected=${e===this.speed}>${e}×</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </label>
        <span class="view">
          ${this._seg(na(702),da,this.tile,e=>this._pickTile(e),"tiles")}
          ${this._seg(na(138),Eh,this.theme,e=>this.theme=e,"themes")}
          <button
            type="button"
            class="toggle reduced"
            aria-pressed=${this.reduced?"true":"false"}
            aria-label=${na(713)}
            title=${na(704)}
            @click=${()=>this.reduced=!this.reduced}
          >
            <ha-icon icon="mdi:motion-pause-outline"></ha-icon>
          </button>
        </span>
      </div>
    `}}Nh.styles=[Sa,Ca,c`
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
        padding: ${l(16)}px;
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
    `],zh([_e({attribute:!1})],Nh.prototype,"doc",void 0),zh([_e({attribute:!1})],Nh.prototype,"lookup",void 0),zh([_e({attribute:!1})],Nh.prototype,"hass",void 0),zh([_e({attribute:!1})],Nh.prototype,"tile",void 0),zh([_e({attribute:!1})],Nh.prototype,"preview",void 0),zh([_e({attribute:!1})],Nh.prototype,"subjectTarget",void 0),zh([_e({type:Boolean})],Nh.prototype,"zoomIcon",void 0),zh([_e({attribute:!1})],Nh.prototype,"layerView",void 0),zh([_e({attribute:!1})],Nh.prototype,"stageParticles",void 0),zh([_e({type:Number})],Nh.prototype,"hiddenLayers",void 0),zh([$e()],Nh.prototype,"theme",void 0),zh([$e()],Nh.prototype,"reduced",void 0),zh([$e()],Nh.prototype,"speed",void 0),zh([$e()],Nh.prototype,"playing",void 0),zh([$e()],Nh.prototype,"_t",void 0),zh([$e()],Nh.prototype,"_k",void 0),zh([$e()],Nh.prototype,"_fh",void 0),zh([$e()],Nh.prototype,"_off",void 0);var Oh=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Th={"Glow & pulse":"mdi:lightbulb-on-outline",Motion:"mdi:rotate-right",Playful:"mdi:emoticon-happy-outline","Light & colour":"mdi:palette-outline","Rings & sweeps":"mdi:radar",Borders:"mdi:border-outside","Weather & device":"mdi:weather-partly-rainy",Scenes:"mdi:image-filter-hdr",Backgrounds:"mdi:gradient-horizontal",Seasonal:"mdi:pine-tree",Interaction:"mdi:gesture-tap","Fire & heat":"mdi:fire",Cleaning:"mdi:broom",Christmas:"mdi:pine-tree",Halloween:"mdi:halloween",Valentine:"mdi:heart-outline","Home automation":"mdi:home-automation"};let Fh,Ih;const Bh=e=>e in gt?(0,nt.t)(gt[e]):e,qh=e=>"builtin"===e.kind?e.id:`cat:${e.entry.id}`,Kh=e=>"builtin"===e.kind?e.group:e.entry.group,Uh=[...mt,...["Fire & heat","Cleaning","Christmas","Halloween","Valentine","Home automation","Light & colour"].filter(e=>!mt.includes(e))],Gh=new Map,Wh=new WeakMap;function Zh(e){if("catalogue"===e.kind){if(Wh.has(e.entry))return Wh.get(e.entry);let t;try{t=e.entry.build()}catch{t=void 0}return Wh.set(e.entry,t),t}if(Gh.has(e.id))return Gh.get(e.id);let t=Ri(e.id);return t&&e.tap&&(t={...t,iterations:"infinite"}),Gh.set(e.id,t),t}class Yh extends fe{constructor(){super(...arguments),this.play=!1,this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0,this._card=void 0}willUpdate(e){const t=this.source?Zh(this.source):void 0;if(!(this._visible&&t&&this.source&&customElements.get("magic-card")))return void(this._card=void 0);const i=!this._card;if(i&&(this._card=document.createElement("magic-card")),i||e.has("source")||e.has("play")||e.has("lookup"))try{const e=ka(t,this.lookup,{tile:"card",thumb:!0,as:(n=qh(this.source),`pt-${n.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}`.slice(0,64)),still:!this.play}),i="catalogue"===this.source.kind?this.source.entry.icon:void 0;i&&function(e,t){const i=e.rows??[];for(const e of i)for(const i of e.columns??[])for(const e of i.modules??[])"icon"in e&&(e.icon=t)}(e,i),this._card.setConfig(e)}catch{return void(this._card=void 0)}var n;(i||e.has("hass"))&&(this._card.hass=ua("card",this.hass??Rh(!1)))}render(){const e=this.source?Th[Kh(this.source)]??"mdi:animation-outline":"mdi:animation-outline";return Z`<div class="box">${this._card?Z`<div class="scale">${this._card}</div>`:Z`<ha-icon icon=${e}></ha-icon>`}</div>`}}Yh.styles=[Sa,c`
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
    `],Oh([_e({attribute:!1})],Yh.prototype,"source",void 0),Oh([_e({type:Boolean})],Yh.prototype,"play",void 0),Oh([_e({attribute:!1})],Yh.prototype,"hass",void 0),Oh([_e({attribute:!1})],Yh.prototype,"lookup",void 0),Oh([$e()],Yh.prototype,"_visible",void 0);class Xh extends fe{constructor(){super(...arguments),this.sources=[],this.query="",this.lookup=()=>{},this.notice="",this._active=new Set,this._previewing=new Set,this._reduced=!1,this._timers=new Map,this._onMq=()=>{this._reduced=!!this._mq?.matches}}connectedCallback(){super.connectedCallback(),this._mq="function"==typeof window.matchMedia?window.matchMedia(na(3)):void 0,this._reduced=!!this._mq?.matches,this._mq?.addEventListener?.("change",this._onMq)}disconnectedCallback(){super.disconnectedCallback(),this._mq?.removeEventListener?.("change",this._onMq),this._mq=void 0;for(const e of this._timers.values())clearTimeout(e);this._timers.clear()}_set(e,t,i){const n=this[e];if(n.has(t)===i)return;const s=new Set(n);i?s.add(t):s.delete(t),this[e]=s}_preview(e,t){clearTimeout(this._timers.get(t)),this._set("_previewing",t,!0),this._timers.set(t,setTimeout(()=>{this._timers.delete(t),this._set("_previewing",t,!1)},function(e){const t="number"==typeof e?.duration?e.duration:2;return Math.min(8e3,Math.max(2500,Math.round(1e3*t)))}(Zh(e))))}_pick(e){this.dispatchEvent(new CustomEvent("preset-pick",{detail:{source:e},bubbles:!0,composed:!0}))}_tile(e){const t=qh(e),i=(e=>"builtin"===e.kind?e.name:e.entry.name)(e),n=(e=>"builtin"===e.kind?e.tap||e.heavy:!!e.entry.heavy)(e),s=(e=>"builtin"===e.kind&&e.tap)(e),a=!this._reduced&&(!n||this._active.has(t)||this._previewing.has(t));return Z`<li class="pt-cell">
      <button
        type="button"
        class="pt"
        data-preset=${t}
        title=${i}
        aria-description=${s?na(684):Q}
        @click=${()=>this._pick(e)}
        @pointerenter=${()=>this._set("_active",t,!0)}
        @pointerleave=${()=>this._set("_active",t,!1)}
        @focus=${()=>this._set("_active",t,!0)}
        @blur=${()=>this._set("_active",t,!1)}
      >
        <mc-preset-thumb aria-hidden="true" .source=${e} .play=${a} .hass=${this.hass} .lookup=${this.lookup}></mc-preset-thumb>
        <span class="nm">${i}</span>
        ${s?Z`<span class="chip is-count" aria-hidden="true">${na(922)}</span>`:Q}
      </button>
      ${n&&!this._reduced?Z`<button type="button" class="pt-play" tabindex="-1" aria-hidden="true" title=${na(698)} @click=${()=>this._preview(e,t)}>
            <ha-icon icon="mdi:play"></ha-icon>
          </button>`:Q}
    </li>`}render(){const e=function(e,t){const i=(0,Ni.A)(t).split(/\s+/).filter(Boolean),n=e=>{if(!i.length)return!0;const t=(0,Ni.A)("builtin"===e.kind?`${e.name} ${e.id} ${e.group} ${Bh(e.group)}`:`${e.entry.name} ${e.entry.id} ${e.entry.group} ${e.entry.tags.join(" ")}`);return i.every(e=>t.includes(e))},s=new Map;for(const t of e){if(!n(t))continue;const e=Kh(t),i=s.get(e);i?i.push(t):s.set(e,[t])}return Uh.filter(e=>s.has(e)).map(e=>({group:e,tiles:s.get(e)}))}(this.sources,this.query.trim());return Z`
      ${e.length?e.map(e=>Z`<section class="pg" role="group" aria-label=${Bh(e.group)}>
              <h3>${Bh(e.group)} <span class="chip is-count">${e.tiles.length}</span></h3>
              <ul class="grid" role="list">
                ${e.tiles.map(e=>this._tile(e))}
              </ul>
            </section>`):Z`<div class="no-results">
            <p>${na(568,{query:this.query})}</p>
            <button type="button" class="btn btn-text btn-sm no-results-clear" @click=${()=>this.dispatchEvent(new CustomEvent("preset-clear-search",{bubbles:!0,composed:!0}))}>
              ${na(162)}
            </button>
          </div>`}
      <p class="notice" role="status" ?hidden=${!this.notice}>${this.notice}</p>
    `}}Xh.styles=[Sa,Ca,c`
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
    `],Oh([_e({attribute:!1})],Xh.prototype,"sources",void 0),Oh([_e()],Xh.prototype,"query",void 0),Oh([_e({attribute:!1})],Xh.prototype,"hass",void 0),Oh([_e({attribute:!1})],Xh.prototype,"lookup",void 0),Oh([_e()],Xh.prototype,"notice",void 0),Oh([$e()],Xh.prototype,"_active",void 0),Oh([$e()],Xh.prototype,"_previewing",void 0),Oh([$e()],Xh.prototype,"_reduced",void 0);var Jh=i(1235);let Qh;var eu=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const tu=e=>e?`mc-anim-draft:${e}`:"mc-anim-draft-new";function iu(e){try{const t=JSON.parse(sessionStorage.getItem(e)??"null");return t&&"object"==typeof t&&"string"==typeof t.id&&"string"==typeof t.name&&ri.includes(t.kind)?t:void 0}catch{return}}function nu(e,t){try{const i=t?JSON.stringify(t):"";i&&i.length<=65536?sessionStorage.setItem(e,i):sessionStorage.removeItem(e)}catch{}}const su=[{value:"normal",label:576},{value:"reverse",label:750},{value:"alternate",label:57},{value:"alternate-reverse",label:58}],au={"mc-anim-states-panel":"mdi:state-machine","mc-anim-key-inspector":"mdi:key-variant","mc-anim-part-inspector":"mdi:vector-square","mc-anim-shape-inspector":"mdi:draw","mc-anim-bindings-panel":"mdi:link-variant","mc-anim-targets-layers":"mdi:card-text-outline","mc-anim-parts-layers":"mdi:vector-square","mc-anim-shapes-layers":"mdi:shape-outline","mc-anim-shapes-under-layers":"mdi:shape-outline","mc-anim-particles-layers":"mdi:shimmer","mc-anim-path-layers":"mdi:vector-curve","mc-anim-steps-layers":"mdi:format-list-numbered","mc-anim-part-presets":"mdi:auto-fix"},ru="mc-anim-parts-layers",ou=new Set(["mc-anim-keyframes-editor","mc-anim-sequence-editor",Va]),lu="var(--primary-color, #03a9f4)",cu=["infinite","1","2","3","5"],du=["center","top","bottom","left","right","top left","top right","bottom left","bottom right"],pu={keyframes:548,particles:549,path:550,sequence:551},hu={keyframes:105,particles:106,path:107,sequence:108},uu={keyframes:500,particles:392,path:348,sequence:675},mu=["name","duration","easing","iterations","direction","target","origin"];function gu(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}const fu={message:936},vu=e=>{const t=e??{},i=Array.isArray(t.errors)?t.errors.filter(e=>e&&"string"==typeof e.message):[];return{message:"string"==typeof t.message&&t.message?t.message:na(775),errors:i}},bu="mcas-split",yu="mcas-sections",xu="mcas-layers";function _u(e){try{return localStorage.getItem(e)}catch{return null}}function $u(e,t){try{void 0===t?localStorage.removeItem(e):localStorage.setItem(e,t)}catch{}}const wu=e=>Math.min(.8,Math.max(.15,e)),ku=e=>"keyframes"===e.kind||"sequence"===e.kind;function Mu(e){if(!e)return"none";const t=e.keys?.[0];return`${e.kind}|${"keys"===e.kind?`${t?.target}|${t?.lane}|${1===e.keys?.length?1:"n"}`:e.target??e.tool??""}`}let Su="loading";const Cu=(0,nt.G)().then(e=>Su=e?"ready":"failed");class Au extends fe{constructor(){super(...arguments),this.standalone=!1,this._docs=new Map,this._view="library",this._query="",this._kind="all",this._menu=!1,this._menuClosedAt=0,this._saved=null,this._errors=[],this._saveError="",this._busy=!1,this._status="",this._presetQuery="",this._catalogueFailed=!1,this._labels=Su,this._customRepeat=!1,this._selection=Pa,this._tile="icon",this._split=function(){const e=Number(_u(bu));return null!==_u(bu)&&Number.isFinite(e)&&e>0?wu(e):.4}(),this._layersPref=_u(xu),this._width=0,this._height=0,this._userSplit=null!==_u(bu),this._inspOpen=!1,this._collapsed=function(){try{const e=JSON.parse(_u(yu)??"[]");return new Set(Array.isArray(e)?e.filter(e=>"string"==typeof e):[])}catch{return new Set}}(),this._editorRequested=!1,this._history=new xa(void 0),this._pointer=!1,this._onPointer=()=>{this._pointer=!0},this._lookup=e=>this._docs.get(e),this._onBeforeUnload=e=>{this._keepDraft(),this.dirty&&(e.preventDefault(),e.returnValue="")},this._taken=e=>this._docs.has(e)||this._doc?.id===e,this._time=0,this._libraryObj={},this._gesture=!1,this._layerViews=new Map,this._emitter={index:0,all:!1},this._onEmitter=e=>{e.stopPropagation();const{index:t,all:i}=e.detail??{};Number.isInteger(t)&&t>=0&&(t!==this._emitter.index||!!i!==this._emitter.all)&&(this._emitter={index:t,all:!!i})},this._onLayerView=e=>{const{view:t,announce:i}=e.detail;e.stopPropagation();const n=this._doc?.id;if(n){if(t!==this._layerViews.get(n)&&t!==this._viewOf(this._doc)){const e=new Map(this._layerViews);e.set(n,t),this._layerViews=e}i&&this._say(i)}},this._onKeydown=e=>{if(this._pointer=!1,e.defaultPrevented||this._dialog)return;const t=e.key.toLowerCase(),i=(e.ctrlKey||e.metaKey)&&!e.altKey;if("editor"!==this._view)"/"!==e.key||i||gu(e)||(e.preventDefault(),this.shadowRoot?.querySelector(".search input")?.focus());else{if(i&&"s"===t)return e.preventDefault(),void this.save();if(i&&("z"===t||"y"===t)){if(gu(e))return;return e.preventDefault(),void("y"===t||e.shiftKey?this.redo():this.undo())}if(" "===e.key&&!i&&!gu(e)){const t=e.composedPath()[0];if(t instanceof HTMLElement&&/^(BUTTON|A)$/.test(t.tagName))return;return e.preventDefault(),void this._stage()?.togglePlay()}if("Escape"===e.key&&!gu(e))if(this._inspOpen&&this._slideOver)e.preventDefault(),this._inspOpen=!1,this._focusSel=".insp-toggle";else if("none"!==this._selection.kind){e.preventDefault();const t=this.shadowRoot?.querySelector("aside.inspector"),i=this.shadowRoot?.activeElement,n=!!t&&!!i&&(t===i||t.contains(i));this._setSelection(Pa),!n&&i||(this._focusSel="aside.inspector")}}},this._onSelection=e=>{e.stopPropagation();const t=e.detail?.selection;(function(e){return!!e&&"object"==typeof e&&["none","keys","target","tool"].includes(e.kind)})(t)&&this._setSelection(t)},this._onDocChange=e=>{e.stopPropagation();const{doc:t,label:i,transient:n}=e.detail??{};if(!t||!this._doc)return;const s=Ll(t);if(s)n||(this._endGesture(),this._say(na(584,{big:s})),this._doc={...this._doc});else{if(n)this._gesture?this._history.replace(t):(this._gestureBase=this._doc,this._history.push(t)),this._gesture=!0;else if(this._gesture){const e=this._gestureBase;!e||t!==e&&JSON.stringify(t)!==JSON.stringify(e)?this._history.replace(t):this._history.revert(),this._endGesture()}else this._history.push(t,`editor:${i??""}`);this._doc=t,this._check(),this._pruneSelection()}},this._onStageRect=e=>{const{width:t,height:i,subject:n}=e.detail??{};if(!Number.isFinite(t)||!Number.isFinite(i))return;this._stageRect&&this._stageRect.width===t&&this._stageRect.height===i||(this._stageRect={width:t,height:i}),JSON.stringify(n)!==JSON.stringify(this._subjectRect)&&(this._subjectRect=n);const{scale:s,viewBox:a}=e.detail??{},r={rect:{width:t,height:i},scale:Number.isFinite(s)&&s>0?s:1,...n?{subject:n}:{},...Array.isArray(a)&&4===a.length?{viewBox:a}:{}};JSON.stringify(r)!==JSON.stringify(this._stageInfo)&&(this._stageInfo=r)},this._onPreviewChange=e=>{e.stopPropagation();const t=e.detail;if(!t||"object"!=typeof t)return;const i={...this._preview??{}};"string"==typeof t.state&&(i.state=t.state),"number"==typeof t.value&&Number.isFinite(t.value)&&(i.value=t.value),t.attributes&&"object"==typeof t.attributes&&(i.attributes={...t.attributes}),this._preview=Object.keys(i).length?i:void 0},this._onSeek=e=>{e.stopPropagation();const t=Number(e.detail?.time),i=this._stage();i&&Number.isFinite(t)&&i.seek(Math.min(1,Math.max(0,t))*i.cycle)},this._onSplitDown=e=>{if(0===e.button){e.preventDefault(),this._splitDrag={pointerId:e.pointerId};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}}},this._onSplitMove=e=>{if(!this._splitDrag||e.pointerId!==this._splitDrag.pointerId)return;const t=this._splitAt(e.clientY);void 0!==t&&this._setSplit(t,!1)},this._onSplitUp=e=>{this._splitDrag&&e.pointerId===this._splitDrag.pointerId&&(this._splitDrag=void 0,this._setSplit(this._split,!0))},this._onSplitKey=e=>{const t=e.shiftKey?.1:.05,i={ArrowUp:this._split-t,ArrowDown:this._split+t,Home:0,End:1};void 0!==i[e.key]&&(e.preventDefault(),this._setSplit(i[e.key],!0))},this._closeDialog=()=>{const e=this.shadowRoot?.querySelector("mc-ui-window");e?.open?e.close("action"):this._dialog=void 0}}willUpdate(e){if(e.has("hass")&&((0,it.Zc)(this.hass),window.MagicCard?.setLocale?.(this.hass)),this.lang!==oa()&&(this.lang=oa()),e.has("library")&&(this._docs=function(e){if(!e||"object"!=typeof e)return new Map;const t=Array.isArray(e)?e:function(e){return Array.isArray(e)?e:e&&"object"==typeof e?Object.entries(e).map(([e,t])=>t&&"object"==typeof t&&!("id"in t)&&hi.test(e)?{id:e,...t}:t):[]}(e),i=new Map;for(const e of t){const t=zi(e);t.ok&&!i.has(t.doc.id)&&i.set(t.doc.id,t.doc)}return i}(this.library)),(e.has("library")||e.has("_docs"))&&(this._lookup=e=>this._docs.get(e),this._libraryObj=Object.fromEntries(this._docs)),e.has("library")){const e=this._doc&&this._saved?this._docs.get(this._saved.id):void 0;e&&!this.dirty&&JSON.stringify(e)!==JSON.stringify(this._saved)&&(this._saved=e,this._doc=e,this._playable=e,this._history.reset(e))}if(e.has("selectedId")){const e=this.selectedId||void 0;e?this._doc?.id!==e&&(this._wantId=e):("editor"===this._view&&!this.dirty&&this._saved&&this._closeEditor(!1),this._wantId=void 0)}if(this._wantId&&this._docs.has(this._wantId)){const e=this._docs.get(this._wantId);this._wantId=void 0,this.dirty||this._openDoc(e,!1,!1)}}updated(e){const t=e.get("_doc");if(e.has("_height")||e.has("_width")||e.has("_layersPref")||e.has("_view")||e.has("_doc")&&t?.id!==this._doc?.id?this._autoSplit():e.has("_doc")&&this._autoSplit(!0),e.has("_inspOpen")&&this._inspOpen&&this._slideOver&&(this._focusSel??="aside.inspector"),e.has("_doc")&&this._doc&&t&&t.id===this._doc.id&&(this._doc.rig?.shapes?.length??0)>(t.rig?.shapes?.length??0)){const e=this._doc.rig?.shapes??[],t=e[e.length-1].id;this._revealShape(t)}if(this._revealPanel){const e=this.shadowRoot?.querySelector(`.layer-group[data-panel="${this._revealPanel}"]`);this._revealPanel=void 0,e?.scrollIntoView?.({block:"start"}),e?.focus({preventScroll:!0})}if(e.has("_selection")&&Mu(e.get("_selection"))!==Mu(this._selection)){const e=this.shadowRoot?.querySelector("aside.inspector");e&&(e.scrollTop=0)}if(this._focusSel){const e=this.shadowRoot?.querySelector(this._focusSel);e&&(e.focus(),e instanceof HTMLInputElement&&e.select()),this._focusSel=void 0}const i=this._menu?this.shadowRoot?.querySelector("mc-ui-menu.new-menu"):void 0;i&&!i.open&&(i.anchor=this.shadowRoot?.querySelector(".new-btn")??void 0,i.show());const n=this.shadowRoot?.querySelector("mc-ui-window");if(n&&!n.open){this._opener=ch()??this._opener,n.opener=this._opener,n.show();const e=n.querySelector("mc-anim-icon-start");e&&n.updateComplete.then(()=>setTimeout(()=>e.focusStart?.(),0));const t=n.querySelector("mc-transfer-panel");t&&n.updateComplete.then(()=>t.focusHeading?.())}else if(!n&&e.has("_dialog")&&e.get("_dialog")&&this._opener?.isConnected){const e=ch();e&&e!==document.body||this._opener.focus({preventScroll:!0}),this._opener=void 0}}connectedCallback(){super.connectedCallback(),Cu.then(()=>this._labels=Su),this.addEventListener("keydown",this._onKeydown),this.addEventListener("pointerdown",this._onPointer),window.addEventListener("beforeunload",this._onBeforeUnload);const e=this._doc||this._dialog?void 0:iu(tu());e&&(this._dialog={type:"restore",draft:e,isNew:!0}),!this._editorRequested&&window.MagicCard?.loadEditor&&(this._editorRequested=!0,window.MagicCard.loadEditor());for(const e of[...Object.values(Ea).map(e=>e.tag),Va,...Da.map(e=>e.tag)])La(e)||customElements.whenDefined(e).then(()=>this.requestUpdate());"undefined"==typeof ResizeObserver||this._ro||(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0),i=Math.round(e[0]?.contentRect.height??0);t&&t!==this._width&&(this._width=t),i&&i!==this._height&&(this._height=i)}),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("pointerdown",this._onPointer),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,this._keepDraft()}_keepDraft(){this._doc&&"restore"!==this._dialog?.type&&nu(tu(this._saved?.id),this.dirty?this._doc:void 0)}get dirty(){const e=this._doc;if(!e)return!1;const t=this._dirtyFor;if(t&&t.doc===e&&t.saved===this._saved)return t.value;const i=!this._saved||JSON.stringify(e)!==JSON.stringify(this._saved);return this._dirtyFor={doc:e,saved:this._saved,value:i},i}get docs(){return[...this._docs.values()].sort((e,t)=>e.name.localeCompare(t.name))}async _emit(e,t,i=!0){const n={...t};if(this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0})),n.result)return await n.result;if(i&&!this.standalone)throw fu}_store(e){const t=new Map(this._docs);t.set(e.id,e),this._docs=t}_say(e){this._status="",this.updateComplete.then(()=>this._status=e),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._status="",4e3)}_stored(e,t){const i=e?.animation??e,n=i?zi(i):void 0;return n?.ok?n.doc:t}_select(e){this._emit("mc-anim-select",{id:e},!1)}_new(e){this._menu=!1;const t=new Set(this.docs.map(e=>e.name)),i=na(pu[e]);let n=i;for(let e=2;t.has(n);e++)n=`${i} ${e}`;this._guard(()=>this._openDoc(function(e,t,i="New animation"){const n={id:t,name:i,kind:e,duration:2,easing:"ease-in-out",iterations:"infinite",target:"element",origin:"center",version:1};switch(e){case"keyframes":return{...n,keyframes:[{at:0,transform:{scale:1}},{at:50,transform:{scale:1.1}},{at:100,transform:{scale:1}}]};case"particles":return{...n,duration:4,easing:"linear",particles:{...ui,size:[...ui.size],colors:[]}};case"path":return{...n,duration:3,easing:"linear",path:{d:"M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0",units:"px",follow_rotation:!1,subject:"element"}};case"sequence":return{...n,steps:[{animation:"pop",delay:0,repeat:1},{animation:"wiggle",delay:.2,repeat:1}],loop:!0,stagger:{children:!1,delay:.15}}}}(e,_a(n,this._taken),n),!0))}_openIconStart(){this._menu=!1,this._dialog={type:"icon"}}_startIcon(e){e.stopPropagation();const{doc:t,from:i}=e.detail??{};if(!t)return;this._dialog=void 0;const n=new Set(this.docs.map(e=>e.name));let s=t.name;for(let e=2;n.has(s);e++)s=`${t.name} ${e}`;const a={...t,id:_a(t.id,this._taken),name:s};this._guard(()=>{this._openDoc(a,!0);const e=a.rig?.parts[0]?.id;"icon"===i&&e&&(this._selection={kind:"target",target:`part:${e}`,targets:[`part:${e}`]})})}_openPresets(){this._presetQuery="",this._dialog={type:"presets"},this._catalogue||(this._catalogueFailed=!1,(Qh??=i.e(494).then(()=>i(298)).then(e=>(0,Jh.t)("magic-card-preset-catalogue.js",e),e=>{Qh=void 0,console.warn("Magic Card: preset catalogue not loaded",e)}),Qh).then(e=>{e?this._catalogue=e.CATALOGUE:this._catalogueFailed=!0}))}_pickPreset(e){e.stopPropagation();const t=(e.detail??{}).source;if(!t)return;if("builtin"===t.kind)return this._customise(t.id);let i;try{i=structuredClone(t.entry.build())}catch(e){return void this._say(na(1005,{message:vu(e).message}))}const n={...i,id:_a(Hi(t.entry.id),this._taken)};this._dialog=void 0,this._guard(()=>this._openDoc(n,!0))}_presetSources(){return this._sourcesFor&&this._sourcesFor.catalogue===this._catalogue||(this._sourcesFor={catalogue:this._catalogue,list:[...(Fh&&Ih===(0,nt.H)()||(Ih=(0,nt.H)(),Fh=ut.map(e=>({kind:"builtin",id:e.id,name:(0,nt.t)(e.name),group:e.group,tap:"tap"===e.trigger,heavy:"Seasonal"===e.group||!!e.seasonal}))),Fh),...(this._catalogue??[]).map(e=>({kind:"catalogue",entry:e}))]}),this._sourcesFor.list}async _clearPresetSearch(){this._presetQuery="",await this.updateComplete,this.shadowRoot?.querySelector("input.preset-search")?.focus()}_customise(e){const t=Ri(e,_a(Hi(e),this._taken));t&&(this._dialog=void 0,this._guard(()=>this._openDoc(t,!0)))}async _duplicate(e){const t={...structuredClone(e),id:_a(`${e.id}-copy`,this._taken),name:$a(e.name,new Set(this.docs.map(e=>e.name)))};try{const e=await this._emit("mc-anim-duplicate",{animation:t});this._store(this._stored(e,t)),this._say(na(289,{name:t.name}))}catch(e){this._say(na(290,{message:vu(e).message}))}}async _rename(e,t){if(this._renaming!==e.id)return;this._renaming=void 0;const i=t.trim();if(!i||i===e.name)return;const n=zi({...e,name:i});if(n.ok)try{const e=await this._emit("mc-anim-save",{animation:n.doc});this._store(this._stored(e,n.doc)),this._say(na(735,{clean:i}))}catch(e){this._say(na(736,{message:vu(e).message}))}else this._say(na(590,{message:va(n.errors[0].message)}))}_askDelete(e){const t=this.usage?this.usage[e.id]??0:void 0,i=(n=e.id,s=this._docs.values(),[...s].filter(e=>"sequence"===e.kind&&e.id!==n&&wa(e).includes(n)));var n,s;0!==t||i.length?this._dialog={type:"delete",doc:e,uses:t,sequences:i}:this._delete(e)}async _delete(e){this._dialog=void 0;try{await this._emit("mc-anim-delete",{id:e.id});const t=new Map(this._docs);t.delete(e.id),this._docs=t,this._say(na(245,{name:e.name}))}catch(e){this._say(na(246,{message:vu(e).message}))}}async _transferChunk(){try{const e=window.MagicCard;if(!e?.loadEditor||!e.loadTransfer||!await e.loadEditor())return;return await e.loadTransfer()}catch{return}}async _openTransfer(e){await this._transferChunk()?this._dialog=e:this._say(na(956))}_export(e){this._openTransfer({type:"export",items:Ma(e,this._docs)})}async _onImport(e){e.stopPropagation();const{docs:t,errors:i}=function(e,t){const i=[],n=[];for(const s of e){const e=zi({...s.data,id:s.id,name:s.name});e.ok?i.length>=Math.max(0,t)?n.push(na(1181,{id:s.id})):i.push(e.doc):n.push(`${s.id}: ${e.errors[0]?va(e.errors[0].message):na(1127)}`)}return{docs:i,errors:n}}(e.detail.items,200-this._docs.size),n=[...i];let s=0;for(const e of t)try{const t=await this._emit("mc-anim-save",{animation:e});this._store(this._stored(t,e)),s++}catch(t){n.push(`${e.id}: ${vu(t).message}`)}const a=na(398,{count:s});this._say(n.length?`${a} ${na(587,{list:n.slice(0,4).join("; ")})}`:a),n.length||(this._dialog=void 0)}_guard(e){"editor"===this._view&&this.dirty?this._dialog={type:"discard",then:e}:e()}_openDoc(e,t,i=!0){this._doc=e,this._emitter={index:0,all:!1},this._saved=t?null:e,this._history.reset(e),this._errors=[],this._saveError="",this._customRepeat=!1,this._playable=e,this._endGesture(),this._time=0,this._selection=Pa,this._preview=void 0,this._inspOpen=!1,this._view="editor",this._pointer||(this._focusSel=".back"),i&&!t&&this._select(e.id);const n=t?void 0:iu(tu(e.id));n&&JSON.stringify(n)!==JSON.stringify(e)?this._dialog={type:"restore",draft:n,isNew:!1}:n&&nu(tu(e.id))}_restoreDraft(e,t){this._dialog=void 0,t?this._openDoc(this._taken(e.id)?{...e,id:_a(e.id,this._taken)}:e,!0):this._doc?.id===e.id&&this._apply(e)}_closeEditor(e=!0){const t=!!this._doc;this._view="library",this._doc=void 0,this._selection=Pa,this._preview=void 0,this._saved=null,this._history.reset(void 0),this._errors=[],this._saveError="",e&&t&&this._select(null)}_back(){this._guard(()=>this._closeEditor())}_set(e,t){if(!this._doc)return;const i={...this._doc,...e};for(const[t,n]of Object.entries(e))void 0===n&&delete i[t];this._apply(i,t)}_apply(e,t){this._endGesture(),this._history.push(e,t),this._doc=e,this._check(),this._pruneSelection()}_endGesture(){this._gesture=!1,this._gestureBase=void 0}_viewOf(e){return function(e,t){const i=Jl(e),n=e=>!/^(target|part|group|shape|lane|emitter|children|step):/.test(e)||i.has(e)||"target:element"===e,s=e=>e.every(n)?e:e.filter(n),a=s(t.hidden),r=s(t.solo),o=s(t.locked),l=s(t.open);return a===t.hidden&&r===t.solo&&o===t.locked&&l===t.open?t:{hidden:a,solo:r,locked:o,open:l}}(e,this._layerViews.get(e.id)??Ul)}_previewDoc(e,t){const i=this._previewMemo;if(i&&i.base===e&&i.view===t)return i.out;const n=((e,t)=>{const i=ec(e,t),n=new Map,s=new Set;for(const e of i)if(e.startsWith("lane:")){const t=e.lastIndexOf("|"),i=e.slice(5,t);n.set(i,[...n.get(i)??[],e.slice(t+1)])}else e.startsWith("step:")&&s.add(Number(e.slice(5)));if(!n.size&&!s.size)return e;const a={...e};return s.size&&(a.steps=(e.steps??[]).filter((e,t)=>!s.has(t))),n.size&&(e.keyframes&&n.has(Hr(e))&&(a.keyframes=ac(e.keyframes,n.get(Hr(e)))),e.tracks&&(a.tracks=e.tracks.flatMap(e=>{const t=n.get(e.target);if(!t)return[e];const i=ac(e.keyframes,t);return i.length||e.path?[{...e,keyframes:i}]:[]})),e.bindings&&(a.bindings=e.bindings.filter(e=>!n.get(e.target)?.some(t=>sc[e.property]===t)))),a})(e,t);return this._previewMemo={base:e,view:t,out:n},n}_check(){const e=this._doc?zi(this._doc):void 0;this._errors=e&&!e.ok?e.errors:[],e?.ok&&(this._playable=e.doc)}undo(){this._endGesture();const e=this._history.undo();e&&(this._doc=e,this._check(),this._pruneSelection())}redo(){this._endGesture();const e=this._history.redo();e&&(this._doc=e,this._check(),this._pruneSelection())}_pruneSelection(){const e=this._doc,t=this._selection;if(!e||"none"===t.kind)return;const i=t=>{const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return!0;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return!!n?.some(e=>e.id===i[2])};if("tool"===t.kind)return void(t.target&&!i(t.target)&&(this._selection={kind:"tool",tool:t.tool}));if("keys"===t.kind){const i=(t.keys??[]).filter(t=>Ir(e,{target:t.target,lane:t.lane,at:t.at}));if(i.length===(t.keys??[]).length)return;if(!i.length)return void(this._selection=Pa);const n=[...new Set(i.map(e=>e.target))];return void(this._selection={kind:"keys",keys:i,targets:n,target:t.target&&n.includes(t.target)?t.target:i[i.length-1].target})}const n=(t.targets??(t.target?[t.target]:[])).filter(i);n.length?n.length===(t.targets?.length??1)&&t.target&&i(t.target)||(this._selection={kind:"target",target:t.target&&i(t.target)?t.target:n[0],targets:n}):this._selection=Pa}async save(){if(!this._doc||this._busy)return!1;const e=zi(this._doc);if(!e.ok)return this._errors=e.errors,this._saveError=na(341),!1;this._busy=!0,this._saveError="";const t=JSON.stringify(this._doc);try{const i=await this._emit("mc-anim-save",{animation:e.doc}),n=this._stored(i,e.doc),s=!this._saved;this._store(n),this._saved=n,nu(tu(n.id)),s&&nu(tu());const a=JSON.stringify(this._doc);return a===t&&JSON.stringify(n)!==a?this._apply(n):this._check(),this._say(na(774,{name:n.name})),s&&this._select(n.id),!0}catch(e){const t=vu(e);return this._errors=t.errors,this._saveError=t.message,!1}finally{this._busy=!1}}_stage(){return this.shadowRoot?.querySelector("mcas-stage")??null}_renderNewMenu(){const e=[...ri.map(e=>({id:`kind:${e}`,label:na(hu[e]),sub:na(uu[e]),icon:ya[e]})),{id:"preset",label:na(220),icon:"mdi:auto-fix",separatorBefore:!0},{id:"icon",label:na(386),icon:"mdi:motion-play-outline"}];return Z`<mc-ui-menu
      class="new-menu"
      .items=${e}
      label=${na(547)}
      .align=${"end"}
      @mc-menu-pick=${e=>{e.stopPropagation();const t=e.detail.id;this._menu=!1,"preset"===t?this._openPresets():"icon"===t?this._openIconStart():this._new(t.slice(5))}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menu=!1}}
    ></mc-ui-menu>`}_toggleNewMenu(){this._menu?(this.shadowRoot?.querySelector("mc-ui-menu.new-menu")?.close("escape"),this._menu=!1):Date.now()-this._menuClosedAt>400&&(this._menu=!0)}_renderNewButton(){return Z`<div class="menu-anchor">
      <button
        type="button"
        class="btn btn-primary btn-sm new-btn"
        aria-haspopup="menu"
        aria-expanded=${this._menu?"true":"false"}
        @click=${()=>this._toggleNewMenu()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>${na(547)}<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${this._menu?this._renderNewMenu():Q}
    </div>`}_usedBy(e){if(!this.usage)return Q;const t=this.usage[e]??0;return Z`<span class="used ${t?"":"none"}">${t?na(1065,{count:t}):na(592)}</span>`}_renderRow(e){const t=this._renaming===e.id,i=t=>{this._rename(e,t.target.value)};return Z`
      <li class="lib-row" data-id=${e.id}>
        <mcas-thumb .doc=${e} .lookup=${this._lookup} .hass=${this.hass}></mcas-thumb>
        ${t?Z`<div class="name-cell">
                <input
                  class="input rename"
                  aria-label=${na(542,{name:e.name})}
                  maxlength="80"
                  .value=${e.name}
                  @keydown=${t=>{"Enter"===t.key&&i(t),"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this._renaming=void 0,this._focusSel=`.lib-row[data-id="${e.id}"] .rename-btn`)}}
                  @blur=${i}
                />
              </div>`:Z`<button type="button" class="open name-cell" @click=${()=>this._guard(()=>this._openDoc(e,!1))}>
                <span class="nm">${e.name}</span>
                <span class="id mono">${na(1104,{id:e.id})}</span>
              </button>`}
        <span class="chip kind"><ha-icon icon=${ya[e.kind]}></ha-icon>${na(ba[e.kind])}</span>
        ${this._usedBy(e.id)}
        <span class="acts">
          <button type="button" class="icon-btn sm" title=${na(284)} aria-label=${na(288,{name:e.name})} @click=${()=>this._duplicate(e)}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm rename-btn"
            title=${na(730)}
            aria-label=${na(733,{name:e.name})}
            @click=${()=>{this._renaming=e.id,this._focusSel=".rename"}}
          >
            <ha-icon icon="mdi:rename-outline"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            title=${na(323)}
            aria-label=${na(326,{name:e.name})}
            @click=${()=>this._export([e])}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>
          </button>
          <button type="button" class="icon-btn sm danger" title=${na(231)} aria-label=${na(244,{name:e.name})} @click=${()=>this._askDelete(e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </span>
      </li>
    `}_renderEmpty(){return Z`<div class="empty lib-empty">
      <ha-icon icon="mdi:animation-play-outline"></ha-icon>
      <strong>${na(560)}</strong>
      <p>${na(125)}</p>
      <div class="starters">
        ${ri.map(e=>Z`<button type="button" class="starter" @click=${()=>this._new(e)}>
              <ha-icon icon=${ya[e]}></ha-icon><span class="mi-t">${na(ba[e])}</span><span class="mi-s">${na(uu[e])}</span>
            </button>`)}
        <button
          type="button"
          class="starter"
          @click=${()=>this._openPresets()}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon><span class="mi-t">${na(356)}</span><span class="mi-s">${na(221,{count:ut.length})}</span>
        </button>
        <button type="button" class="starter" data-kind="icon" @click=${()=>this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon><span class="mi-t">${na(385)}</span><span class="mi-s">${na(63)}</span>
        </button>
      </div>
    </div>`}_renderLibrary(){const e=this.docs,t=[{id:"all",label:na(45)},...ri.map(e=>({id:e,label:na(ba[e])}))],i=function(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>{const t=(0,Ni.A)(`${e.name} ${e.id} ${e.kind} ${na(ba[e.kind])}`);return i.every(e=>t.includes(e))}):e}(e,this._query).filter(e=>"all"===this._kind||e.kind===this._kind);return Z`
      <header class="topbar">
        <div class="grp title">
          <ha-icon class="title-icon" icon="mdi:animation-play-outline"></ha-icon>
          <h1>${na(70)}</h1>
          <span class="chip is-count">${e.length}</span>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click=${()=>{this._openTransfer({type:"import"})}}
          >
            <ha-icon icon="mdi:import"></ha-icon>${na(393)}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            ?disabled=${!e.length}
            @click=${()=>this._export(e)}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>${na(324)}
          </button>
          ${this._renderNewButton()}
        </div>
      </header>
      <main class="lib">
        <div class="lib-inner">
          ${e.length?Z`
                  <div class="lib-tools">
                    <div class="with-icon search">
                      <ha-icon icon="mdi:magnify"></ha-icon>
                      <input
                        class="input"
                        type="search"
                        placeholder=${na(782)}
                        aria-label=${na(782)}
                        aria-keyshortcuts="/"
                        .value=${Ye(this._query)}
                        @input=${e=>this._query=e.target.value}
                      />
                    </div>
                    <div class="kinds">${gh({role:"radiogroup",label:na(413),value:this._kind,items:t.map(e=>({value:e.id,label:e.label})),onChange:e=>this._kind=e})}</div>
                  </div>
                  ${i.length?Z`<ul class="lib-list ${this.usage?"has-usage":""}" aria-label=${na(540)}>
                          ${i.map(e=>this._renderRow(e))}
                        </ul>`:Z`<p class="no-results">${this._query?na(558,{query:this._query}):na(559)}</p>`}
                `:this._renderEmpty()}
        </div>
      </main>
    `}_fieldErrors(e){const t=this._errors.filter(t=>t.path===e);return t.length?Z`${t.map(t=>Z`<p class="help error" id="err-${e}">${va(t.message)}</p>`)}`:Q}_field(e,t,i,n,s){return Z`<div class="field">
      <div class="field-head"><label for=${t}>${e}</label></div>
      ${i} ${s?Z`<p class="help">${s}</p>`:Q} ${n?this._fieldErrors(n):Q}
    </div>`}_selectEl(e,t,i,n){return Z`<div class="select">
      <select class="input" id=${e} @change=${e=>n(e.target.value)}>
        ${i.map(e=>Z`<option value=${e.value} ?selected=${e.value===t}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}get _rail(){return"rail"===this._layersPref}get _compact(){return this._width>0&&this._width<1100&&!this._slideOver}_openLayers(e){this._layersPref="open",$u(xu,"open"),this._revealPanel=e}get _slideOver(){return this._width>0&&this._width<900}_toggleRail(){const e=this._rail?"open":"rail";this._layersPref=e,$u(xu,e)}_setSelection(e){this._selection=e,this._slideOver&&"keys"===e.kind&&(this._inspOpen=!0)}_toggleSection(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t,$u(yu,JSON.stringify([...t]))}_section(e,t,i,n,s={}){const a=s.errors||!this._collapsed.has(e);return Z`<section class="sec ${s.cls??""}" data-sec=${e}>
      ${function(e){const t=4===e.level,i=hh(e,18);if(!e.collapsible){const n=Z`${i}${t?Z`<h4>${e.title}</h4>`:Z`<h3>${e.title}</h3>`}`;return Z`<div class="group-head">${n}</div>`}const n=Z`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${ze("chevronDown",20)}</span> </button>`;return t?Z`<h4 class="sector-head">${n}</h4>`:Z`<h3 class="sector-head">${n}</h3>`}({title:t,icon:i,collapsible:!0,expanded:a,onToggle:()=>this._toggleSection(e)})}
      ${s.errors?Z`<span class="sec-err" role="img" aria-label=${na(373)}></span>`:Q}
      <div class="sec-body" id="secb-${e}" ?hidden=${!a}>${a?n:Q}</div>
    </section>`}_hasErrors(e){return this._errors.some(t=>e.includes(t.path))}_renderErrors(){const e=this._errors.filter(e=>!mu.includes(e.path));return this._saveError||e.length?Z`<div class="errors" role="alert">
          ${this._saveError?Z`<strong>${this._saveError}</strong>`:Q}
          ${e.length?Z`<ul>
                  ${e.map(e=>Z`<li><span class="mono">${e.path||"animation"}</span> ${va(e.message)}</li>`)}
                </ul>`:Q}
        </div>`:Q}_renderForm(e){const t=at.map(e=>({value:e.id,label:(0,nt.t)(e.label)}));at.some(t=>t.id===e.easing)||t.push({value:e.easing,label:e.easing});const i=String(e.iterations),n=this._customRepeat||!cu.includes(i),s=[...cu.map(e=>({value:e,label:"infinite"===e?na(402):e})),{value:"custom",label:na(215)}],a="keyframes"===e.kind||"sequence"===e.kind,r=this._field(na(541),"f-name",Z`<input
        class="input"
        id="f-name"
        maxlength="80"
        .value=${Ye(e.name)}
        aria-invalid=${this._errors.some(e=>"name"===e.path)?"true":"false"}
        @input=${e=>this._set({name:e.target.value},"name")}
      />`,"name",Z`${na(140)} <span class="mono ref">${na(1104,{id:e.id})}</span>`),o=Z`
      ${"sequence"===e.kind?Z`<p class="help">${na(20)}</p>`:this._field(na(291),"f-duration",Z`<div class="suffix">
                <input
                  class="input"
                  id="f-duration"
                  type="number"
                  inputmode="decimal"
                  min="0.05"
                  max="600"
                  step="any"
                  .value=${Ye(String(e.duration))}
                  @input=${e=>{const t=e.target.value;""!==t&&Number.isFinite(Number(t))&&this._set({duration:Number(t)},"duration")}}
                />
                <span aria-hidden="true">s</span>
              </div>`,"duration")}
      <div class="two">
        ${this._field(na(294),"f-easing",this._selectEl("f-easing",e.easing,t,e=>this._set({easing:e},"easing")),"easing")}
        ${this._field(na(737),"f-repeat",this._selectEl("f-repeat",n?"custom":i,s,t=>{if("custom"===t)return this._customRepeat=!0,void("infinite"===e.iterations&&this._set({iterations:10},"iterations"));this._customRepeat=!1,this._set({iterations:"infinite"===t?"infinite":Number(t)},"iterations")}),"iterations")}
      </div>
      ${n?this._field(na(738),"f-count",Z`<input
                class="input"
                id="f-count"
                type="number"
                min="1"
                step="1"
                .value=${Ye("number"==typeof e.iterations?String(e.iterations):"")}
                @input=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&t>0&&this._set({iterations:t},"count")}}
              />`):Q}
      ${this._field(na(249),"f-dir",this._selectEl("f-dir",e.direction??"normal",(l=su,l.map(e=>({...e,label:na(e.label)}))),e=>this._set({direction:"normal"===e?void 0:e},"direction")),"direction")}
    `;var l;return Z`
      ${this._section("anim",na(66),ya[e.kind],r,{errors:this._hasErrors(["name"])})}
      ${this._section("timing",na(1010),"mdi:timer-outline",o,{errors:this._hasErrors(["duration","easing","iterations","direction"])})}
      ${a?this._section("moves",na(1079),"mdi:cursor-move",this._renderMoves(e),{errors:this._hasErrors(["target","origin"])}):Q}
    `}_renderMoves(e){const t=du.map(e=>({value:e,label:uo.includes(e)?na(mo[uo.indexOf(e)]):e.charAt(0).toUpperCase()+e.slice(1)}));du.includes(e.origin)||t.push({value:e.origin,label:e.origin});const i="icon"===e.target?"icon":"element";return Z`
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-target">${na(923)}</span></div>
        <div class="seg full target" role="radiogroup" aria-labelledby="l-target" @keydown=${e=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)&&(e.preventDefault(),this._set({target:"icon"===i?"element":"icon"},"target"),this._focusSel='.target [aria-checked="true"]')}}>
          ${["element","icon"].map(e=>{const t=e===i;return Z`<button
              type="button"
              role="radio"
              aria-checked=${t?"true":"false"}
              tabindex=${t?"0":"-1"}
              @click=${()=>this._set({target:e},"target")}
            >
              ${na("element"===e?300:383)}
            </button>`})}
        </div>
        <p class="help">${na(387)}</p>
        ${this._fieldErrors("target")}
      </div>
      ${"keyframes"===e.kind?this._field(na(623),"f-origin",this._selectEl("f-origin",e.origin,t,e=>this._set({origin:e},"origin")),"origin",na(971)):Q}
    `}_editorEl(e,t,i={}){const n=(e=>({_$litStatic$:e,r:Xe}))(e);return i.panel?tt`<${n}
        class=${i.cls??"panel"}
        slot=${i.slot??Q}
        .doc=${t}
        .hass=${this.hass}
        .library=${this._libraryObj}
        .time=${ou.has(e)?this._time:0}
        .disabled=${this._busy||!!i.inspector&&oc(t,this._viewOf(t),this._selection)}
        .selection=${this._selection}
        .tile=${this._tile}
        .stage=${this._stageInfo}
        .layerView=${this._viewOf(t)}
        .density=${this._width>0&&this._width<1e3?"compact":"full"}
        .emitter=${this._emitter.index}
        .all=${this._emitter.all}
        .stageRect=${i.stageRect}
        .subjectRect=${i.subjectRect}
        .entityColor=${lu}
        @doc-change=${this._onDocChange}
        @seek=${this._onSeek}
        @selection-change=${this._onSelection}
      ></${n}>`:tt`<${n}
      class=${i.cls??"kind-editor"}
      slot=${i.slot??Q}
      .doc=${t}
      .hass=${this.hass}
      .library=${this._libraryObj}
      .time=${ou.has(e)?this._time:0}
      .disabled=${this._busy||e===Va&&this._viewOf(t).locked.includes("path")}
      .studioSelection=${this._selection}
      .layerView=${this._viewOf(t)}
      .emitter=${this._emitter.index}
      .all=${this._emitter.all}
      .tile=${this._tile}
      .stage=${this._stageInfo}
      .stageRect=${i.stageRect}
      .subjectRect=${i.subjectRect}
      .entityColor=${lu}
      @doc-change=${this._onDocChange}
      @seek=${this._onSeek}
      @selection-change=${this._onSelection}
    ></${n}>`}_panels(e,t,i={}){return Ra(e,t,this._selection).filter(e=>La(e.tag)).map(e=>this._editorEl(e.tag,t,{cls:`panel panel-${e.place}`,panel:!0,...i,..."stage-tool"===e.place&&e.dock&&"overlay"!==e.dock?{slot:e.dock}:{}}))}_renderKindSlot(e){const t=Ea[e.kind],i=La(t.tag)?this._editorEl(t.tag,e):Z`<p class="help">${na(438,{kind:na(t.title).toLowerCase()})}</p>`;return"inspector"===t.place?Z`<div class="kind-slot place-inspector" data-kind=${e.kind}>${this._section(`kind-${e.kind}`,na(t.title),ya[e.kind],i)}</div>`:Z`<section class="kind-slot place-panel" aria-label=${na(t.title)} data-kind=${e.kind}>${i} ${this._panels("timeline",e)}</section>`}_setSplit(e,t){this._split=this._clampSplitPx(wu(Math.round(1e3*e)/1e3)),this._userSplit=!0,t&&$u(bu,String(this._split))}_clampSplitPx(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect().height??0;if(t<=0)return e;const i=Math.min(.45,160/t);return Math.round(1e3*Math.min(1-i,Math.max(i,e)))/1e3}_splitAt(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect();if(t&&!(t.height<=0))return(e-t.top)/t.height}_resetSplit(){$u(bu,void 0),this._userSplit=!1,this._split=.4,this._autoSplit()}_autoSplit(e=!1){const t=this._doc;if(this._userSplit||!t||"editor"!==this._view||"panel"!==Ea[t.kind].place)return;const i=this.shadowRoot?.querySelector(".center"),n=i?.getBoundingClientRect().height??0;if(n<=0)return;const s=this.shadowRoot?.querySelector(".kind-slot.place-panel .kind-editor"),a=s?.getBoundingClientRect().width||i?.getBoundingClientRect().width||0,r=function(e,t,i=!1){const n=Rr(e).filter(e=>e.main||e.keyframes.length),s=n.reduce((e,t)=>e+er(t.keyframes).length,0),a=Math.max(0,...n.map(e=>nr(e.keyframes,"*").length)),r=i?187+49*a+(a?0:44):146+41*n.length+35*s+(s?0:44),o=Math.max(160,Math.min(.6*t,r));return Math.round(1e3*wu((t-9-o)/t))/1e3}(t,n,a>0&&a<480);(e?r<this._split-.002:Math.abs(r-this._split)>.002)&&(this._split=r)}async _revealShape(e){await this.updateComplete;const t=this.shadowRoot?.querySelector("nav.layers"),i=[...t?.querySelectorAll("mc-anim-shapes-layers, mc-anim-shapes-under-layers")??[]];await Promise.all(i.map(e=>e.updateComplete));const n=i.find(t=>t.shadowRoot?.querySelector(`li[data-id="${e}"]`))??i[0],s=n?.shadowRoot?.querySelector(`li[data-id="${e}"]`)??t?.querySelector(`[data-shape="${e}"]`);s?.scrollIntoView?.({block:"nearest"})}_layerTargets(e){const t=["element","icon"];for(const i of e.tracks??[])t.includes(i.target)||t.push(i.target);return t}_renderLayerList(e,t){if("particles"===e.kind)return t?Z``:Z`<p class="help layers-note">${na(645)}</p>`;const i=da.find(e=>e.id===this._tile),n=this._selection;return Z`<ul class="layer-list" role="list">
      ${this._layerTargets(e).map(s=>{const a=!("target"!==n.kind&&"keys"!==n.kind||n.target!==s&&!n.targets?.includes(s)),r=!!i&&"element"!==s&&!i.targets.includes(s),o=Pr(e,s),l=(t=>t===e.target&&"keyframes"===e.kind?e.keyframes?.length??0:e.tracks?.find(e=>e.target===t)?.keyframes.length??0)(s),c=s===e.target,d=c&&r?na(1187,{label:o,tile:na(i.label).toLowerCase()}):c?na(1186,{label:o}):r?na(1195,{label:o,tile:na(i.label).toLowerCase()}):o;return Z`<li>
          <button
            type="button"
            class="layer ${r?"off":""}"
            data-target=${s}
            aria-pressed=${a?"true":"false"}
            aria-label=${t?d:Q}
            title=${d}
            @click=${e=>this._pickLayer(s,e.ctrlKey||e.metaKey||e.shiftKey)}
          >
            <ha-icon icon=${Dr(s)}></ha-icon>
            ${t?Q:Z`<span class="layer-name">${o}</span> ${c&&ku(e)?Z`<span class="chip is-accent layer-main">${na(504)}</span>`:Q}
                    ${l?Z`<span class="layer-count" title=${na(1159,{count:l})}>${l}</span>`:Q}`}
          </button>
        </li>`})}
    </ul>`}_pickLayer(e,t){const i=this._selection,n="target"===i.kind||"keys"===i.kind?i.targets??(i.target?[i.target]:[]):[];if(!t){const t=1===n.length&&n[0]===e&&"target"===i.kind;return void this._setSelection(t?Pa:{kind:"target",target:e,targets:[e]})}const s=n.includes(e),a=s?n.filter(t=>t!==e):[...n,e];a.length?this._setSelection({kind:"target",target:s?i.target&&a.includes(i.target)?i.target:a[0]:e,targets:a}):this._setSelection(Pa)}_renderLayers(e){const t=this._rail,i=Ra("layers",e,this._selection).filter(e=>La(e.tag)),n=t?[]:i.map(t=>Z`<section class="layer-group" data-panel=${t.tag} aria-label=${na(t.title)} tabindex="-1">
              <h3 class="layer-head">${na(t.title)}</h3>
              ${this._editorEl(t.tag,e,{cls:"panel panel-layers",panel:!0})}
            </section>`),s=t&&i.length?Z`<ul class="layer-list rail-panels" role="list" aria-label=${na(618)}>
          ${i.map(e=>Z`<li>
              <button
                type="button"
                class="layer rail-open"
                data-open=${e.tag}
                aria-label=${na(620,{title:na(e.title)})}
                title=${na(e.title)}
                @click=${()=>this._openLayers(e.tag)}
              >
                <ha-icon icon=${au[e.tag]??"mdi:layers-outline"}></ha-icon>
              </button>
            </li>`)}
        </ul>`:Q,a=t&&"keyframes"===e.kind?Al(e.rig?.shapes??[]).reverse():[],r=a.length?Z`<ul class="layer-list rail-shapes" role="list" aria-label=${na(823)}>
          ${a.map(e=>{const t=`shape:${e.id}`,i=this._selection.target===t||!!this._selection.targets?.includes(t);return Z`<li>
              <button type="button" class="layer" data-shape=${e.id} aria-pressed=${i?"true":"false"} aria-label=${e.name} title=${e.name} @click=${e=>this._pickLayer(t,e.ctrlKey||e.metaKey||e.shiftKey)}>
                <ha-icon icon="mdi:vector-polyline"></ha-icon>
              </button>
            </li>`})}
        </ul>`:Q;return Z`<nav class="layers ${t?"rail":""}" aria-label=${na(421)}>
      <div class="layers-head">
        ${t?Q:Z`<h2>${na(421)}</h2>`}
        <button
          type="button"
          class="icon-btn sm rail-toggle"
          aria-expanded=${t?"false":"true"}
          aria-label=${na(t?320:176)}
          title=${na(t?320:176)}
          @click=${()=>this._toggleRail()}
        >
          <ha-icon icon=${t?"mdi:chevron-double-right":"mdi:chevron-double-left"}></ha-icon>
        </button>
      </div>
      <div class="layers-body">${n.length?Z`${n}<p class="help layers-help">${na(379)}</p>`:Z`${this._renderLayerList(e,t)}${s}${r}`}</div>
    </nav>`}_renderContext(e){const t=this._selection,i=t.keys?.length??0,n="keys"===t.kind?`${na(1159,{count:i})}${t.target?` · ${Pr(e,t.target)}`:""}`:"target"===t.kind&&t.target?(t.targets?.length??0)>1?na(1177,{count:t.targets.length}):Pr(e,t.target):"tool"===t.kind?na(1013,{tool:t.tool??""}):"";return Z`<div class="ctx">
      <button type="button" class="btn btn-text btn-sm ctx-back" title=${na(69)} @click=${()=>this._setSelection(Pa)}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>${na(66)}
      </button>
      <span class="ctx-what">${n}</span>
    </div>`}_renderFallback(e){const t=this._selection;if("target"===t.kind&&("element"===t.target||"icon"===t.target)&&ku(e)){const i=t.target===e.target;return this._section("target",Pr(e,t.target),Dr(t.target),Z`<p class="help">
            ${i?"icon"===t.target?na(941):na(942):"icon"===e.target?na(940):na(939)}
          </p>
          ${i?Q:Z`<button
                  type="button"
                  class="btn btn-secondary btn-sm make-main"
                  @click=${()=>this._set({target:t.target},"target")}
                >
                  <ha-icon icon="mdi:target"></ha-icon>${"icon"===t.target?na(487):na(486)}
                </button>`}
          ${"keyframes"===e.kind&&i?this._renderMoves(e):Q}`)}const i=t.keys?.length??0;return Z`<p class="help ctx-note">${"keys"===t.kind?na(1163,{count:i}):na(601)}</p>`}_renderInspector(e){const t=this._selection,i="inspector"===Ea[e.kind].place?this._renderKindSlot(e):Q;if("none"===t.kind){const n=Ra("inspector",e,t).filter(e=>La(e.tag)).map(t=>this._section(`panel-${t.tag}`,na(t.title),au[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0})));return Z`${this._renderErrors()} ${i} ${this._renderForm(e)} ${n}`}const n=Ra("inspector",e,t).filter(e=>La(e.tag)).map(t=>this._section(`panel-${t.tag}`,na(t.title),au[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0,inspector:!0}))),s=this._viewOf(e),a=oc(e,s,t)?pc(e,s,rc(t)):Q,r="target"!==t.kind||"element"!==t.target&&"icon"!==t.target||!ku(e)?Q:this._renderFallback(e),o="target"===t.kind&&"icon"===t.target&&"keyframes"===e.kind&&!e.rig?.parts?.length&&La(ru)?this._section("split-icon",na(388),au[ru],this._editorEl(ru,e,{cls:"panel panel-inspector",panel:!0})):Q,l=n.length?n:r===Q&&o===Q?this._renderFallback(e):Q;return Z`${a} ${this._renderContext(e)} ${this._renderErrors()} ${r} ${o} ${l}`}_zoomIcon(e){const t=this._selection;return"keyframes"===e.kind&&("tool"===t.kind||("target"===t.kind||"keys"===t.kind)&&!!t.target&&/^(part|group|shape):/.test(t.target))}_renderEditor(e){const t=this.dirty,i="panel"===Ea[e.kind].place,n=this._slideOver,s=this._rail,a=this._viewOf(e),r=this._playable??e,o=function(e,t){const i=ec(e,t);let n=0;for(const t of i){if(t.startsWith(Ql))continue;const s=tc(e,t);s&&i.has(s)||n++}return n}(r,a);return Z`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm back" @click=${()=>this._back()}><ha-icon icon="mdi:arrow-left"></ha-icon>${na(426)}</button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong class="doc-name">${e.name.trim()||na(1047)}</strong>
            <span class="chip kind"><ha-icon icon=${ya[e.kind]}></ha-icon>${na(ba[e.kind])}</span>
            ${this._saved?t?Z`<span class="chip is-warn">${na(1045)}</span>`:Q:Z`<span class="chip is-accent">${na(546)}</span>`}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="icon-btn"
            aria-label=${na(1036)}
            title=${na(1036)}
            ?disabled=${!this._history.canUndo()}
            @click=${()=>this.undo()}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${na(711)}
            title=${na(711)}
            ?disabled=${!this._history.canRedo()}
            @click=${()=>this.redo()}
          >
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          ${n?Z`<button
                  type="button"
                  class="icon-btn insp-toggle"
                  aria-controls="inspector"
                  aria-expanded=${this._inspOpen?"true":"false"}
                  aria-label=${na(403)}
                  title=${na(403)}
                  @click=${()=>this._inspOpen=!this._inspOpen}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`:Q}
          <button
            type="button"
            class="btn btn-primary btn-sm save"
            ?disabled=${this._busy||!t&&!!this._saved}
            title=${na(770)}
            @click=${()=>this.save()}
          >
            <ha-icon icon=${this._busy?"mdi:progress-upload":"mdi:content-save-outline"}></ha-icon>${this._busy?na(776):na(769)}
          </button>
        </div>
      </header>
      <div
        @preview-change=${this._onPreviewChange}
        @layer-view-change=${this._onLayerView}
        @emitter-change=${this._onEmitter}
        class="workspace ${s?"rail":""} ${this._compact?"compact":""} ${this._width>0&&this._width<1e3?"dense":""} ${n?"slide":""} ${n&&this._inspOpen?"insp-open":""}"
      >
        ${this._renderLayers(e)}
        <div class="center ${i?"with-panel":""}" style="--split: ${this._split}">
          <mcas-stage
            .doc=${this._previewDoc(r,a)}
            .layerView=${a}
            .hiddenLayers=${o}
            .stageParticles=${o?lh(r):void 0}
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
            ${"path"===e.kind&&La(Va)?this._editorEl(Va,e,{slot:"overlay",stageRect:this._stageRect,subjectRect:this._subjectRect}):Q}
            ${this._panels("stage-tool",e,{slot:"overlay",stageRect:this._stageRect,subjectRect:this._subjectRect})}
          </mcas-stage>
          ${i?Z`<div
                    class="splitter"
                    role="separator"
                    tabindex="0"
                    aria-orientation="horizontal"
                    aria-label=${na(876)}
                    aria-valuemin="15"
                    aria-valuemax="80"
                    aria-valuenow=${Math.round(100*this._split)}
                    title=${na(265)}
                    @pointerdown=${this._onSplitDown}
                    @pointermove=${this._onSplitMove}
                    @pointerup=${this._onSplitUp}
                    @pointercancel=${this._onSplitUp}
                    @keydown=${this._onSplitKey}
                    @dblclick=${()=>this._resetSplit()}
                  ></div>
                  ${this._renderKindSlot(e)}`:Q}
        </div>
        <aside class="inspector" id="inspector" tabindex="-1" aria-label=${"none"===this._selection.kind?na(68):na(403)}>
          ${this._renderInspector(e)}
        </aside>
        ${n&&this._inspOpen?Z`<div class="insp-scrim" @click=${()=>this._inspOpen=!1}></div>`:Q}
      </div>
    `}_renderDialog(){const e=this._dialog;if(!e)return Q;const t=()=>{this._dialog===e&&(this._dialog=void 0)};switch(e.type){case"delete":{const{doc:i,uses:n,sequences:s}=e,a=[];return void 0===n?a.push(na(139)):n&&a.push(na(404,{count:n})),s.length&&a.push(na(805,{names:s.map(e=>e.name).join(", ")})),dh({heading:na(232,{name:i.name}),variant:"alert",initialFocus:"dlg-safe",onClose:t},Z`<div class="dlg">${a.map(e=>Z`<p>${e}</p>`)}</div>`,Z`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${na(130)}</button>
            <button type="button" class="btn btn-danger btn-sm confirm-delete" @click=${()=>this._delete(i)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${na(231)}
            </button>`)}case"discard":return dh({heading:na(773),variant:"alert",initialFocus:"dlg-safe",onClose:t},Z`<div class="dlg"><p>${na(0,{name:this._doc?.name||na(992)})}</p></div>`,Z`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${na(406)}</button>
            <button
              type="button"
              class="btn btn-secondary btn-sm discard"
              @click=${()=>{this._dialog=void 0,nu(tu(this._saved?.id)),this._saved=this._doc??null,e.then()}}
            >
              ${na(250)}
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click=${async()=>{this._dialog=void 0,await this.save()&&e.then()}}
            >
              ${na(769)}
            </button>`);case"restore":return dh({heading:na(749),variant:"alert",initialFocus:"restore-draft",onClose:t},Z`<div class="dlg">
            <p>${e.isNew?na(964,{name:e.draft.name}):na(1,{name:e.draft.name})}</p>
          </div>`,Z`<button
              type="button"
              class="btn btn-secondary btn-sm discard-draft"
              @click=${()=>{this._dialog=void 0,nu(tu(e.isNew?void 0:e.draft.id))}}
            >
              ${na(250)}
            </button>
            <button type="button" class="btn btn-primary btn-sm restore-draft" id="restore-draft" @click=${()=>this._restoreDraft(e.draft,e.isNew)}>
              ${na(748)}
            </button>`);case"export":case"import":return dh({heading:"export"===e.type?na(325):na(395),size:"l",dismissible:!1,onClose:t},Z`<mc-transfer-panel
            host="animation-studio"
            .mode=${e.type}
            .exportItems=${"export"===e.type?{kind:"animation",items:e.items}:void 0}
            .taken=${(e,t)=>this._taken(t)}
            @mc-transfer-import=${e=>{this._onImport(e)}}
            @mc-transfer-close=${this._closeDialog}
          ></mc-transfer-panel>`);case"icon":return dh({heading:na(385),size:"l",onClose:t},Z`<div class="dlg">
            ${La("mc-anim-icon-start")?Z`<mc-anim-icon-start class="icon-start" .hass=${this.hass} .lookup=${this._lookup} @icon-start=${e=>this._startIcon(e)}></mc-anim-icon-start>`:Z`<p class="help">${na(439)}</p>`}
          </div>`,Z`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${na(130)}</button>`);case"presets":return dh({heading:na(219),size:"xl",initialFocus:"preset-search",onClose:t},Z`<div class="dlg">
            <p class="help">${na(976)}</p>
            <div class="with-icon">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                class="input preset-search"
                id="preset-search"
                type="search"
                placeholder=${na(784)}
                aria-label=${na(784)}
                .value=${Ye(this._presetQuery)}
                @input=${e=>this._presetQuery=e.target.value}
              />
            </div>
            <mc-preset-grid
              class="preset-list"
              .sources=${this._presetSources()}
              .query=${this._presetQuery}
              .hass=${this.hass}
              .lookup=${this._lookup}
              .notice=${this._catalogueFailed?na(460):""}
              @preset-pick=${e=>this._pickPreset(e)}
              @preset-clear-search=${()=>{this._clearPresetSearch()}}
            ></mc-preset-grid>
          </div>`,Z`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${na(130)}</button>`)}}render(){if("ready"!==this._labels)return Z`<div class="shell" role="status">${"failed"===this._labels?"The studio texts (magic-card-i18n-labels.js) could not be loaded. Reload the page.":Q}</div>`;const e="editor"===this._view?this._doc:void 0;return Z`
      <div class="shell" data-view=${e?"editor":"library"}>${e?this._renderEditor(e):this._renderLibrary()}</div>
      ${this._renderDialog()}
      <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      ${this._status?Z`<div class="toast" aria-hidden="true">${this._status}</div>`:Q}
    `}}Au.styles=[...za,dc],eu([_e({attribute:!1})],Au.prototype,"hass",void 0),eu([_e({attribute:!1})],Au.prototype,"library",void 0),eu([_e({attribute:!1})],Au.prototype,"selectedId",void 0),eu([_e({attribute:!1})],Au.prototype,"usage",void 0),eu([_e({type:Boolean})],Au.prototype,"standalone",void 0),eu([$e()],Au.prototype,"_docs",void 0),eu([$e()],Au.prototype,"_view",void 0),eu([$e()],Au.prototype,"_query",void 0),eu([$e()],Au.prototype,"_kind",void 0),eu([$e()],Au.prototype,"_menu",void 0),eu([$e()],Au.prototype,"_renaming",void 0),eu([$e()],Au.prototype,"_dialog",void 0),eu([$e()],Au.prototype,"_doc",void 0),eu([$e()],Au.prototype,"_saved",void 0),eu([$e()],Au.prototype,"_errors",void 0),eu([$e()],Au.prototype,"_saveError",void 0),eu([$e()],Au.prototype,"_busy",void 0),eu([$e()],Au.prototype,"_status",void 0),eu([$e()],Au.prototype,"_presetQuery",void 0),eu([$e()],Au.prototype,"_catalogue",void 0),eu([$e()],Au.prototype,"_catalogueFailed",void 0),eu([$e()],Au.prototype,"_labels",void 0),eu([$e()],Au.prototype,"_customRepeat",void 0),eu([$e()],Au.prototype,"_selection",void 0),eu([$e()],Au.prototype,"_tile",void 0),eu([$e()],Au.prototype,"_split",void 0),eu([$e()],Au.prototype,"_layersPref",void 0),eu([$e()],Au.prototype,"_width",void 0),eu([$e()],Au.prototype,"_height",void 0),eu([$e()],Au.prototype,"_inspOpen",void 0),eu([$e()],Au.prototype,"_collapsed",void 0),eu([$e()],Au.prototype,"_time",void 0),eu([$e()],Au.prototype,"_stageRect",void 0),eu([$e()],Au.prototype,"_subjectRect",void 0),eu([$e()],Au.prototype,"_stageInfo",void 0),eu([$e()],Au.prototype,"_preview",void 0),eu([$e()],Au.prototype,"_layerViews",void 0),eu([$e()],Au.prototype,"_emitter",void 0),eu([$e()],Au.prototype,"_playable",void 0);var ju=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class zu extends fe{constructor(){super(...arguments),this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(!this._visible||!this.doc||!customElements.get("magic-card"))return void(this._card=void 0);const t=!this._card;if(t&&(this._card=document.createElement("magic-card")),t||e.has("doc")||e.has("lookup"))try{this._card.setConfig(ka(this.doc,this.lookup,{tile:"icon",thumb:!0,as:this.doc.id}))}catch{return void(this._card=void 0)}(t||e.has("hass"))&&(this._card.hass=this.hass??Rh(!1))}render(){const e=this.doc?ya[this.doc.kind]:"mdi:animation-outline";return Z`<div class="box" aria-hidden="true">
      ${this._card?Z`<div class="scale">${this._card}</div>`:Z`<ha-icon icon=${e}></ha-icon>`}
    </div>`}}zu.styles=[Sa,c`
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
    `],ju([_e({attribute:!1})],zu.prototype,"doc",void 0),ju([_e({attribute:!1})],zu.prototype,"lookup",void 0),ju([_e({attribute:!1})],zu.prototype,"hass",void 0),ju([$e()],zu.prototype,"_visible",void 0);const Eu=l(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),Vu=[Sa,Ca,c`
  .mc-tab-content {
    display: grid;
    gap: 16px;
  }
  .mc-field {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .mc-field-label,
  .mc-field > label,
  .mc-input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 24px;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text);
    text-transform: none;
    letter-spacing: normal;
  }
  .mc-field-hint,
  .mc-mode-help {
    font-size: 0.75rem;
    font-style: normal;
    color: var(--mc-text-2);
  }

  /* inputs: identical to .input */
  ${Eu},
  .mc-input-field.mc-input-field {
    width: 100%;
    min-height: 40px;
    margin: 0;
    padding: 8px 12px;
    border: 1px solid var(--mc-field-border);
    border-radius: var(--mc-radius);
    background: var(--mc-surface);
    color: var(--mc-text);
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    outline: none;
    box-shadow: none;
    transition: border-color 0.15s ease-out, box-shadow 0.15s ease-out;
  }
  ${Eu}::placeholder,
  .mc-input-field.mc-input-field::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  ${Eu}:hover,
  .mc-input-field.mc-input-field:hover {
    border-color: var(--mc-text-2);
  }
  ${Eu}:focus,
  .mc-input-field.mc-input-field:focus {
    outline: none;
    border-color: var(--mc-focus);
    box-shadow: 0 0 0 1px var(--mc-focus);
  }
  ${Eu}:disabled {
    background: var(--mc-surface-2);
    color: var(--mc-text-2);
    cursor: not-allowed;
  }
  ${Eu}.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  /* selects: .select look (bare selects get the chevron as a background image) */
  ${Eu}:is(select):not([multiple]):not([size]) {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  ${Eu}:is(select):not(.input):not([multiple]):not([size]) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px 18px;
  }
  /* textareas: textarea.input */
  ${Eu}:is(textarea) {
    resize: vertical;
    min-height: 88px;
    line-height: 1.5;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }

  /* sections = .group */
  .mc-section {
    display: grid;
    gap: 16px;
  }
  .mc-section + .mc-section {
    padding-top: 20px;
    border-top: 1px solid var(--mc-divider);
  }
  .mc-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--mc-text);
  }

  /* buttons = .btn hierarchy */
  .mc-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 16px;
    border-radius: var(--mc-radius);
    border: 1px solid transparent;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    filter: none;
    transform: none;
    transition: background-color 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out;
    --mdc-icon-size: 18px;
  }
  .mc-btn-primary {
    background: var(--mc-accent-fill);
    border-color: transparent;
    color: var(--mc-on-accent);
  }
  .mc-btn-primary:hover {
    filter: none;
    box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.1);
  }
  .mc-btn-primary:active {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
  .mc-btn-secondary {
    background: var(--mc-surface);
    border: 1px solid var(--mc-field-border);
    color: var(--mc-text);
  }
  .mc-btn-secondary:hover {
    background: var(--mc-surface-2);
  }
  .mc-btn-small {
    min-height: 32px;
    padding: 0 12px;
    font-size: 0.8125rem;
  }
  .mc-btn-icon {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    padding: 0;
    border: 0;
    border-radius: var(--mc-radius);
    background: transparent;
    color: var(--mc-text-2);
    --mdc-icon-size: 18px;
  }
  .mc-btn-icon:hover:not(:disabled) {
    background: var(--mc-surface-2);
    color: var(--mc-text);
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):active {
    opacity: 1;
    transform: none;
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
  :is(.mc-btn, .mc-btn-primary, .mc-btn-secondary, .mc-btn-icon):focus-visible {
    outline: 2px solid var(--mc-focus);
    outline-offset: 2px;
  }

  /* conditions = .cond */
  .mc-conditions-list {
    display: grid;
    gap: 12px;
    margin: 0;
  }
  .mc-condition-item {
    position: relative;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    padding: 12px;
    display: grid;
    gap: 12px;
  }

  /* tabs = .seg (full width) */
  .mc-tabs-header {
    display: flex;
    width: 100%;
    align-items: stretch;
    gap: 2px;
    padding: 3px;
    margin: 0;
    background: var(--mc-surface-2);
    border: 1px solid var(--mc-divider);
    border-radius: 10px;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .mc-tab-button {
    flex: 1 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 10px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    white-space: nowrap;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-text-2);
    box-shadow: none;
    transition: background-color 0.15s ease-out, color 0.15s ease-out;
    --mdc-icon-size: 18px;
  }
  .mc-tab-button:hover {
    color: var(--mc-text);
    background: color-mix(in srgb, var(--mc-surface) 55%, transparent);
  }
  .mc-tab-button.active,
  .mc-tab-button[aria-selected='true'] {
    background: var(--mc-surface);
    color: var(--mc-accent-ink);
    box-shadow: 0 0 0 1px var(--mc-divider), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
  .mc-tab-button:focus-visible {
    outline: 2px solid var(--mc-focus);
    outline-offset: -2px;
  }
`,c`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`];var Lu=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Pu=168,Du=140,Hu=e=>14+e*Du,Ru=e=>14+(1.5-e)/2*Du,Nu=(e,t=Hu,i=Ru)=>`M${t(0)} ${i(0)} C${t(e[0])} ${i(e[1])} ${t(e[2])} ${i(e[3])} ${t(1)} ${i(1)}`,Ou={"ease-in-out":401};let Tu=class extends fe{constructor(){super(...arguments),this.inherited="ease",this.disabled=!1,this.label="",this._textError=""}willUpdate(e){e.has("value")&&(this._textError="")}get _bezier(){return this._drag?.bezier??eo(this.value||this.inherited)}_emit(e,t=!1){this.dispatchEvent(new CustomEvent("easing-change",{bubbles:!0,composed:!0,detail:t?{value:e,transient:t}:{value:e}}))}_fromPointer(e){const t=this.renderRoot.querySelector(".plot").getBoundingClientRect(),i=t.width/Pu||1;return[((e.clientX-t.left)/i-14)/Du,1.5-((e.clientY-t.top)/i-14)/Du*2]}_down(e,t){if(this.disabled||0!==e.button)return;const i=this._bezier??[0,0,1,1];e.preventDefault(),e.currentTarget.focus(),e.currentTarget.setPointerCapture?.(e.pointerId),this._drag={handle:t,bezier:[...i]}}_move(e){if(!this._drag)return;const[t,i]=this._fromPointer(e),n=[...this._drag.bezier];n[2*this._drag.handle]=t,n[2*this._drag.handle+1]=i,this._drag={...this._drag,bezier:no(n)},this._emit(so(this._drag.bezier),!0)}_up(){if(!this._drag)return;const e=so(this._drag.bezier);this._drag=void 0,this._emit(e)}_key(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!i||this.disabled)return;e.preventDefault(),e.stopPropagation();const n=e.shiftKey?.1:.01,s=[...this._bezier??[0,0,1,1]];s[2*t]+=i[0]*n,s[2*t+1]+=i[1]*n,this._emit(so(no(s)))}_num(e,t){const i=Number(t),n=[...this._bezier??[0,0,1,1]];""!==t.trim()&&Number.isFinite(i)?(n[e]=i,this._emit(so(no(n)))):this.requestUpdate()}_text(e){const t=e.value.trim();if(!t)return void(this.value&&this._emit(void 0));if(t===(this.value??""))return;if(!_i(t))return void(this._textError=na(1053));this._textError="";const i=eo(t);this._emit(i&&t.startsWith("cubic-bezier")?so(i):t)}render(){const e=this._bezier,t=this._drag?so(this._drag.bezier):this.value,i=to.map(e=>e.id),n=t?i.includes(t)?t:"custom":"",s=t?eo(t)?`cubic-bezier(${eo(t).join(",")})`:t:e?`cubic-bezier(${e.join(",")})`:"linear";return Z`
      <div class="presets" role="radiogroup" aria-label=${na(1193,{label:this.label||na(294)})}>
        ${[{id:"",label:na(225),bezier:eo(this.inherited)},...to.map(e=>({...e,label:(0,nt.t)(e.label)}))].map(e=>Z`<button
            type="button"
            class="preset"
            role="radio"
            data-easing=${e.id||"default"}
            aria-checked=${n===e.id?"true":"false"}
            title=${e.id?e.label:na(938,{easingLabel:vo(this.inherited).toLowerCase()})}
            ?disabled=${this.disabled}
            @click=${()=>this._emit(e.id||void 0)}
          >
            ${function(e){return Z`<svg class="glyph" viewBox="0 0 ${22} ${22}" aria-hidden="true">
    ${e?Y`<path d=${Nu(e,e=>3+16*e,e=>19-16*e*.82-2)}></path>`:Y`<path d="M3 ${17} H${19}" stroke-dasharray="2 2.5"></path>`}
  </svg>`}(e.bezier)}<span>${void 0!==Ou[e.id]?na(Ou[e.id]):e.label}</span>
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
            <svg viewBox="0 0 ${Pu} ${Pu}" aria-hidden="true">
              <g class="grid">
                <rect x=${Hu(0)} y=${Ru(1)} width=${Du} height=${Ru(0)-Ru(1)} rx="2"></rect>
                ${[.25,.5,.75].map(e=>Y`<line x1=${Hu(e)} x2=${Hu(e)} y1=${Ru(1)} y2=${Ru(0)}></line><line x1=${Hu(0)} x2=${Hu(1)} y1=${Ru(e)} y2=${Ru(e)}></line>`)}
              </g>
              <path class="diag" d="M${Hu(0)} ${Ru(0)} L${Hu(1)} ${Ru(1)}"></path>
              ${e?Y`<line class="arm" x1=${Hu(0)} y1=${Ru(0)} x2=${Hu(e[0])} y2=${Ru(e[1])}></line>
                  <line class="arm" x1=${Hu(1)} y1=${Ru(1)} x2=${Hu(e[2])} y2=${Ru(e[3])}></line>
                  <path class="curve" d=${Nu(e)}></path>`:Q}
              <circle class="end" cx=${Hu(0)} cy=${Ru(0)} r="3.5"></circle>
              <circle class="end" cx=${Hu(1)} cy=${Ru(1)} r="3.5"></circle>
            </svg>
            ${e?[0,1].map(t=>Z`<button
                    type="button"
                    class="knob ${this._drag?.handle===t?"dragging":""}"
                    data-handle=${t}
                    style="left: ${Hu(e[2*t])/Pu*100}%; top: ${Ru(e[2*t+1])/Pu*100}%"
                    role="slider"
                    aria-label=${na(0===t?886:308)}
                    aria-valuemin="-1"
                    aria-valuemax="2"
                    aria-valuenow=${e[2*t+1]}
                    aria-valuetext=${`x ${e[2*t]}, y ${e[2*t+1]}`}
                    ?disabled=${this.disabled}
                    @pointerdown=${e=>this._down(e,t)}
                    @keydown=${e=>this._key(e,t)}
                  ></button>`):Z`<p class="steps-note">${t?.startsWith("steps")?na(909):""}</p>`}
          </div>
          <div class="nums">
            ${["x1","y1","x2","y2"].map((t,i)=>Z`<div class="num">
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
              <label for="bz-text">${na(296)}</label>
              <input
                class="input mono"
                id="bz-text"
                type="text"
                spellcheck="false"
                autocomplete="off"
                placeholder=${na(226,{inherited:this.inherited})}
                aria-invalid=${this._textError?"true":"false"}
                aria-describedby=${this._textError?"bz-err":Q}
                .value=${t??""}
                ?disabled=${this.disabled}
                @change=${e=>this._text(e.target)}
                @keydown=${e=>"Enter"===e.key&&this._text(e.target)}
              />
              ${this._textError?Z`<p class="help error" id="bz-err">${this._textError}</p>`:Q}
            </div>
            <div class="preview" aria-hidden="true" style="--ease: ${s}"><i></i></div>
          </div>
        </div>
      </div>
    `}};Tu.styles=[Vu,c`
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
        grid-template-columns: ${Pu}px minmax(0, 1fr);
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
        width: ${Pu}px;
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
    `],Lu([_e({type:String})],Tu.prototype,"value",void 0),Lu([_e({type:String})],Tu.prototype,"inherited",void 0),Lu([_e({type:Boolean})],Tu.prototype,"disabled",void 0),Lu([_e({type:String})],Tu.prototype,"label",void 0),Lu([$e()],Tu.prototype,"_drag",void 0),Lu([$e()],Tu.prototype,"_textError",void 0),Tu=Lu([be("mc-anim-bezier-editor")],Tu);var Fu=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Iu=(e,t,i,n)=>e<t||e>i?na(527,{min:t,max:i,unit:n}):void 0,Bu=(e,t)=>({...e,transform:{...e.transform??{},...t}}),qu=e=>void 0===e?void 0:Math.round(1e5*e)/1e3,Ku=e=>`${(e=>Math.round(10*e)/10)(e)}%`,Uu={x:[{key:"x",label:1085,unit:"px",get:e=>e.transform?.x,set:(e,t)=>Iu(t,-1e4,1e4,"px")??Bu(e,{x:t})}],y:[{key:"y",label:1086,unit:"px",get:e=>e.transform?.y,set:(e,t)=>Iu(t,-1e4,1e4,"px")??Bu(e,{y:t})}],scale:[{key:"scale",label:777,unit:"%",get:e=>qu(e.transform?.scale),set:(e,t)=>Iu(t,0,1e4,"%")??Bu(e,{scale:t/100})}],scale_x:[{key:"scale_x",label:778,unit:"%",get:e=>qu(e.transform?.scale_x),set:(e,t)=>Iu(t,-1e4,1e4,"%")??Bu(e,{scale_x:t/100})}],scale_y:[{key:"scale_y",label:779,unit:"%",get:e=>qu(e.transform?.scale_y),set:(e,t)=>Iu(t,-1e4,1e4,"%")??Bu(e,{scale_y:t/100})}],rotate:[{key:"rotate",label:61,unit:"deg",get:e=>e.transform?.rotate,set:(e,t)=>Iu(t,-36e3,36e3,"deg")??Bu(e,{rotate:t})}],skew:[{key:"skew_x",label:836,unit:"deg",get:e=>e.transform?.skew_x??0,set:(e,t)=>Iu(t,-89,89,"deg")??Bu(e,{skew_x:t})},{key:"skew_y",label:837,unit:"deg",get:e=>e.transform?.skew_y??0,set:(e,t)=>Iu(t,-89,89,"deg")??Bu(e,{skew_y:t})}],opacity:[{key:"opacity",label:614,unit:"%",get:e=>qu(e.opacity),set:(e,t)=>Iu(t,0,100,"%")??{...e,opacity:Math.round(10*t)/1e3}}],blur:[{key:"blur",label:110,unit:"px",get:e=>e.blur,set:(e,t)=>Iu(t,0,200,"px")??{...e,blur:t}}],radius:[{key:"radius",label:708,unit:"px",get:e=>e.radius,set:(e,t)=>Iu(t,0,1e3,"px")??{...e,radius:t}}],draw:[{key:"draw",label:277,unit:"%",get:e=>qu(e.draw),set:(e,t)=>Iu(t,0,100,"%")??{...e,draw:Math.round(10*t)/1e3}}]},Gu=[{id:"z",label:343},{id:"y",label:345,axis:[0,1,0]},{id:"x",label:344,axis:[1,0,0]}];let Wu=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.entityColor="var(--primary-color, #03a9f4)",this._errors={}}willUpdate(e){e.has("doc")&&(this._draft=void 0),e.has("selection")&&(this._errors={})}get _view(){return this._draft??this.doc}get _keys(){const e=this._view;return e&&"keys"===this.selection?.kind?(this.selection.keys??[]).map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(t=>Ir(e,t)):[]}_emit(e,t,i=!1){this.disabled||(this._draft=i?e:void 0,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}})))}_select(e){const t=this._view?Hr(this._view):"element",i=e.length?{kind:"keys",target:e[e.length-1].target,targets:[...new Set(e.map(e=>e.target))],keys:e.map(e=>({target:e.target,lane:e.lane,at:e.at,id:Tr(e,t)}))}:{kind:"none"};this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:i}}))}_editTrack(e,t){const i=this.doc;return Or(i,e,t(Nr(i,e)))}_setFragment(e,t,i,n,s){this.doc&&this._emit(this._editTrack(e,e=>function(e,t,i,n){let s=!1;const a=e.map(e=>{if(e.at!==i||!Za(e,t))return e;s=!0;const a=Ja(Qa(e,t),n);return e.easings?{...a,easings:e.easings}:a});return s?a:cr(pr(e,i,n))}(e,t,i,n)),s)}_ownEasing(e){const t=Nr(this._view,e.target);return"*"===e.lane?rr(t,e.at):or(t,e.lane,e.at)}_setEasing(e,t,i){if(!this.doc)return;let n=this.doc;for(const i of e){const e=Nr(n,i.target);n=Or(n,i.target,"*"===i.lane?$r(e,i.at,t):lr(e,i.lane,i.at,t))}this._emit(n,"Change easing",i)}_delete(e){this.doc&&e.length&&(this._emit(Kr(this.doc,e),"Delete "+(1===e.length?"keyframe":"keyframes")),this._select([]))}_copy(e){const t=this.doc?Ur(this.doc,e):void 0;t&&jr(t)}_moveTo(e,t){if(!this.doc)return;const i=qr(this.doc,[e],t-e.at);this._emit(i.doc,"Move keyframe"),this._select(i.selection)}render(){const e=this._keys;return this._view&&e.length?(this._last=Z`<section class="insp" aria-label=${na(408)}>${e.length>1?this._renderMany(e):this._renderOne(e[0])}</section>`,this._last):"keys"===this.selection?.kind&&this.selection.keys?.length&&this._last?this._last:Z``}_easingEditor(e,t,i,n){return Z`<mc-anim-bezier-editor
      .value=${n}
      .inherited=${t}
      ?disabled=${this.disabled||i}
      @easing-change=${t=>this._setEasing(e,t.detail.value,!!t.detail.transient)}
    ></mc-anim-bezier-editor>`}_renderMany(e){const t=this._view,i=[...new Set(e.map(e=>e.at))].sort((e,t)=>e-t),n=[...new Set(e.map(e=>e.target))],s=new Set(e.map(e=>this._ownEasing(e)??"")),a=1===s.size&&[...s][0]||void 0,r=new Set(e.map(e=>e.lane)),o=n.length>1?na(1177,{count:n.length}):Pr(t,n[0]);return Z`
      <div class="insp-head">
        <span class="tile"><ha-icon icon="mdi:selection-multiple"></ha-icon></span>
        <div class="insp-title">
          <b>${na(1173,{count:e.length})}</b>
          <span>${na(1235,{where:o,from:Ku(i[0]),to:Ku(i[i.length-1])})}</span>
        </div>
      </div>
      <p class="note">${na(258)}</p>
      <div class="foot-actions">
        <button type="button" class="btn btn-text btn-sm" data-act="copy" @click=${()=>this._copy(e)}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${na(198)}
        </button>
        <button type="button" class="btn btn-text btn-sm danger-text" data-act="delete" @click=${()=>this._delete(e)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${na(243,{count:e.length})}
        </button>
      </div>
      <div class="sub">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${na(295)}</span></div>
        ${s.size>1?Z`<p class="note">${na(981)}</p>`:Q}
        ${r.size>1||!r.has("*")?Z`<p class="note">${na(707)}</p>`:Q}
        ${this._easingEditor(e,t.easing,!1,a)}
      </div>
    `}_renderOne(e){const t=this._view,i=Nr(t,e.target),n="*"===e.lane?er(i.filter(t=>t.at===e.at)):[e.lane],s="*"===e.lane?void 0:Ia[e.lane],a="*"===e.lane?[]:er(i.filter(t=>t.at===e.at)).filter(t=>t!==e.lane),r=nr(i,e.lane).every(t=>t<=e.at),o=(t.duration*e.at/100).toFixed(2),l=(t.tracks?.length??0)>0||e.target!==Hr(t)?Pr(t,e.target):"";return Z`
      <div class="insp-head">
        <span class="tile"><ha-icon icon=${s?.icon??Dr(e.target)}></ha-icon></span>
        <div class="insp-title">
          <b>${na(s?s.label:407)}</b>
          <span>${l?na(1234,{target:l,at:Ku(e.at),secs:o}):na(90,{at:Ku(e.at),secs:o})}</span>
        </div>
        <button
          type="button"
          class="icon-btn sm danger"
          data-act="delete"
          aria-label=${na(236)}
          title=${na(236)}
          @click=${()=>this._delete([e])}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-at">${na(693)}</label></div>
        <div class="at-field">
          <mc-unit-field
            inputId="kf-at"
            .label=${na(693)}
            .value=${`${e.at}%`}
            .units=${["%"]}
            noCustom
            ?disabled=${this.disabled}
            @value-changed=${t=>this._onAt(t,e)}
          ></mc-unit-field>
          <span class="secs">${o} s</span>
        </div>
        ${this._errors.at?Z`<p class="help error">${this._errors.at}</p>`:Q}
      </div>
      ${n.length?n.map(t=>this._renderLaneFields(e.target,t,e.at,"*"===e.lane)):Z`<p class="note">${na(1001)}</p>`}
      ${a.length?Z`<div class="field">
              <div class="field-head"><span class="lbl">${na(52,{at:Ku(e.at)})}</span></div>
              <div class="chips">
                ${a.map(t=>Z`<button type="button" class="chip" data-lane=${t} @click=${()=>this._select([{target:e.target,lane:t,at:e.at}])}>
                      <ha-icon icon=${Ia[t].icon}></ha-icon>${qa(t)}
                    </button>`)}
                <button type="button" class="chip" data-lane="*" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                  <ha-icon icon="mdi:key-variant"></ha-icon>${na(1082)}
                </button>
              </div>
            </div>`:Q}
      ${this._renderEasing(e,i,r)}
    `}_renderEasing(e,t,i){const n=this._view,s=rr(t,e.at);if("*"===e.lane)return Z`<div class="sub" data-easing="keyframe">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${na(295)}</span></div>
        ${i?Z`<p class="note">${na(1e3)}</p>`:Q}
        ${this._easingEditor([e],n.easing,i,s)}
      </div>`;const a=e.lane,r=Ga(a).filter(e=>e!==a),o=r.length?la(r.map(e=>qa(e))):"";return Z`<div class="sub" data-easing="lane">
      <div class="sub-head">
        <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${na(1190,{label:qa(a)})}</span>
      </div>
      ${i?Z`<p class="note">${na(999)}</p>`:Z`<p class="note">
              ${na(s?613:612)}${o?` ${na(1199,{names:o})}`:""}
            </p>`}
      ${this._easingEditor([e],s??n.easing,i,or(t,a,e.at))}
      ${Za(t.find(t=>t.at===e.at)??{at:0},a)?Z`<div class="ease-of">
              <button type="button" class="btn btn-text btn-sm" data-act="whole" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                <ha-icon icon="mdi:key-variant"></ha-icon>${na(297)}
              </button>
            </div>`:Q}
    </div>`}_onAt(e,t){e.stopPropagation();const i=parseFloat(String(e.detail.value));if(!Number.isFinite(i)||i<0||i>100)return this._errors={...this._errors,at:na(526)},void e.target.revert?.();this._errors={...this._errors,at:""},i!==t.at&&this._moveTo(t,Math.round(100*i)/100)}_renderLaneFields(e,t,i,n){const s=Ia[t],a=ar(Nr(this._view,e),t,i),r=this._laneBody(e,t,i,a,n);return n?Z`<div class="sub" data-lane=${t}>
      <div class="sub-head">
        <ha-icon icon=${s.icon}></ha-icon><span class="grow">${na(s.label)}</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${na(729,{name:na(s.label).toLowerCase()})}
          title=${na(722)}
          @click=${()=>this._emit(this._editTrack(e,e=>br(e,[{lane:t,at:i}])),`Remove ${t}`)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${r}
    </div>`:Z`<div class="fields" data-lane=${t}>${r}</div>`}_laneBody(e,t,i,n,s=!1){const a=Uu[t];return a?Z`
        <div class="pair">${a.map(r=>this._numField(e,t,i,n,r,s&&1===a.length))}</div>
        ${"rotate"===t?this._axisField(e,i,n):Q}
      `:"color"===t||"background"===t||"stroke"===t?this._colorField(e,t,i,n):"shadow"===t?this._shadowField(e,i,n):this._filterField(e,i,n)}_numField(e,t,i,n,s,a=!1){const r=s.get(n),o=`kf-${t}-${s.key}`,l=this._errors[o];return Z`<div class="field">
      ${a?Q:Z`<div class="field-head"><label for=${o}>${na(s.label)}</label></div>`}
      <mc-unit-field
        .inputId=${o}
        .label=${na(s.label)}
        .value=${void 0===r?"":`${r}${s.unit}`}
        .units=${[s.unit]}
        noCustom
        ?disabled=${this.disabled}
        @value-changed=${n=>{n.stopPropagation();const a=n.target,r=parseFloat(String(n.detail.value));if(!Number.isFinite(r))return void a.revert?.();const l=s.set(ar(Nr(this._view,e),t,i),r);if("string"==typeof l)return this._errors={...this._errors,[o]:l},void a.revert?.();this._errors={...this._errors,[o]:""},this._setFragment(e,t,i,l,`Change ${t}`)}}
      ></mc-unit-field>
      ${l?Z`<p class="help error">${l}</p>`:Q}
    </div>`}_axisField(e,t,i){const n=i.transform?.axis,s=n?Gu.find(e=>e.axis&&e.axis.every((e,t)=>e===n[t]))?.id??"custom":"z";return Z`<div class="field">
      <div class="field-head"><label for="kf-axis">${na(1025)}</label></div>
      <div class="select">
        <select
          class="input"
          id="kf-axis"
          ?disabled=${this.disabled}
          @change=${i=>{const n=Gu.find(e=>e.id===i.target.value);if(!n)return;const s={...ar(Nr(this._view,e),"rotate",t).transform??{}};n.axis?s.axis=[...n.axis]:delete s.axis,this._setFragment(e,"rotate",t,{transform:s},"Change turn axis")}}
        >
          ${Gu.map(e=>Z`<option value=${e.id} ?selected=${s===e.id}>${na(e.label)}</option>`)}
          ${"custom"===s?Z`<option value="custom" selected>${na(216,{axis:n.join(", ")})}</option>`:Q}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_colorField(e,t,i,n){const s=`kf-${t}`,a=n[t],r=na("color"===t?925:"stroke"===t?915:94),o="background"===t?"background":"color";return Z`<div class="field">
      <div class="field-head"><span class="lbl">${r}</span></div>
      <mc-color-picker
        .value=${ro(a)}
        .label=${r}
        allowEntity
        .entityColor=${this.entityColor}
        @value-changed=${n=>{n.stopPropagation();let l=oo(String(n.detail.value??""));if(!l){if(!ro(a).startsWith("entity"))return;l="var(--primary-color)"}ho(l,o)?(this._errors={...this._errors,[s]:""},l!==a&&this._setFragment(e,t,i,{[t]:l},`Change ${r.toLowerCase()}`)):this._errors={...this._errors,[s]:na("color"===o?580:1052)}}}
      ></mc-color-picker>
      ${this._errors[s]?Z`<p class="help error">${this._errors[s]}</p>`:Z`<p class="help">${na(945)}</p>`}
    </div>`}_shadowField(e,t,i){const n=i.shadow??"",s=function(e){if(!e)return;const t=e.trim().match(/^(-?\d*\.?\d+)(?:px)?\s+(-?\d*\.?\d+)(?:px)?(?:\s+(\d*\.?\d+)(?:px)?)?(?:\s+(-?\d*\.?\d+)(?:px)?)?\s+(.+)$/);return t&&!/,(?![^(]*\))/.test(t[5])?{x:Number(t[1]),y:Number(t[2]),blur:Number(t[3]??0),spread:Number(t[4]??0),color:t[5].trim()}:void 0}(n),a=this._errors["kf-shadow"],r=i=>{ho(i,"shadow")?(this._errors={...this._errors,"kf-shadow":""},i!==n&&this._setFragment(e,"shadow",t,{shadow:i},"Change shadow")):this._errors={...this._errors,"kf-shadow":na(582)}},o=(e,t)=>Z`<div class="field">
        <div class="field-head"><label for=${`kf-sh-${e}`}>${t}</label></div>
        <mc-unit-field
          .inputId=${`kf-sh-${e}`}
          .label=${na(815,{name:t.toLowerCase()})}
          .value=${`${s[e]}px`}
          .units=${["px"]}
          noCustom
          compact
          @value-changed=${t=>{t.stopPropagation();const i=parseFloat(String(t.detail.value));if(!Number.isFinite(i)||"blur"===e&&i<0)return t.target.revert?.();r(lo({...s,[e]:i}))}}
        ></mc-unit-field>
      </div>`;return Z`
      <div class="chips" role="group" aria-label=${na(814)}>
        ${co.map(e=>Z`<button type="button" class="chip" aria-pressed=${n===e.value?"true":"false"} @click=${()=>r(e.value)}>${na(e.label)}</button>`)}
      </div>
      ${s?Z`<div class="quad">${o("x","X")} ${o("y","Y")} ${o("blur",na(110))} ${o("spread",na(872))}</div>
              <div class="field">
                <div class="field-head"><span class="lbl">${na(813)}</span></div>
                <mc-color-picker
                  .value=${ro(s.color)}
                  .label=${na(813)}
                  allowEntity
                  .entityColor=${this.entityColor}
                  @value-changed=${e=>{e.stopPropagation();const t=oo(String(e.detail.value??""))||"rgba(0, 0, 0, 0.3)";r(lo({...s,color:t}))}}
                ></mc-color-picker>
              </div>`:Z`<div class="field">
              <div class="field-head"><label for="kf-shadow">${na(811)}</label></div>
              <input
                class="input mono"
                id="kf-shadow"
                type="text"
                spellcheck="false"
                .value=${n}
                @change=${e=>r(e.target.value.trim())}
              />
            </div>`}
      ${a?Z`<p class="help error">${a}</p>`:Q}
    `}_filterField(e,t,i){const n=i.filter??"",s=this._errors["kf-filter"],a=i=>{ho(i,"filter")?(this._errors={...this._errors,"kf-filter":""},i!==n&&this._setFragment(e,"filter",t,{filter:i},"Change filter")):this._errors={...this._errors,"kf-filter":na(1058)}};return Z`
      <div class="chips" role="group" aria-label=${na(336)}>
        ${po.map(e=>Z`<button type="button" class="chip" aria-pressed=${n===e.value?"true":"false"} @click=${()=>a(e.value)}>${na(e.label)}</button>`)}
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-filter">${na(335)}</label></div>
        <input
          class="input mono"
          id="kf-filter"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-invalid=${s?"true":"false"}
          .value=${n}
          @change=${e=>a(e.target.value.trim())}
        />
        ${s?Z`<p class="help error">${s}</p>`:Z`<p class="help">${na(111)}</p>`}
      </div>
    `}};Wu.styles=[Vu,c`
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
    `],Fu([_e({attribute:!1})],Wu.prototype,"doc",void 0),Fu([_e({attribute:!1})],Wu.prototype,"hass",void 0),Fu([_e({attribute:!1})],Wu.prototype,"library",void 0),Fu([_e({type:Number})],Wu.prototype,"time",void 0),Fu([_e({type:Boolean,reflect:!0})],Wu.prototype,"disabled",void 0),Fu([_e({attribute:!1})],Wu.prototype,"selection",void 0),Fu([_e({attribute:!1})],Wu.prototype,"tile",void 0),Fu([_e({attribute:!1})],Wu.prototype,"stage",void 0),Fu([_e({type:String})],Wu.prototype,"entityColor",void 0),Fu([$e()],Wu.prototype,"_errors",void 0),Fu([$e()],Wu.prototype,"_draft",void 0),Wu=Fu([be("mc-anim-key-inspector")],Wu),Ha({tag:"mc-anim-key-inspector",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"keys"===t.kind&&!!t.keys?.length,title:407,order:0});var Zu=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Yu=e=>Math.round(10*e)/10,Xu=e=>`${Yu(e)}%`;let Ju=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.onionSkin=!1,this.layout="auto",this.entityColor="var(--primary-color, #03a9f4)",this._keys=[],this._width=0,this._viewW=0,this._menuOpen=!1,this._status="",this._zoom=1,this._unit="pct",this._snap=!0,this._grid="pct1",this._collapsed=new Set,this._laneFocus=new Map,this._selFrame=0,this._menuClosedAt=0,this._onTouchMove=e=>{"band"===this._drag?.kind&&"touch"===this._drag.pointerType&&e.preventDefault()},this._pxCache=0,this._onPointerMove=e=>{const t=this._hold;t&&e.pointerId===t.pointerId&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._cancelHold();const i=this._drag;if(!i||e.pointerId!==i.pointerId)return;if("seek"===i.kind)return void this._seek(this._atFromX(e.clientX));if("band"===i.kind){const t=this.renderRoot.querySelector(".lanes").getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top;if(!i.moved&&Math.hypot(n-i.x0,s-i.y0)<3)return;i.moved=!0,this._band={x0:i.x0,y0:i.y0,x1:n,y1:s};const a=this._main,r=i.baseSel??[];return void this._select([...r,...this._keysInBand(i.centres).filter(e=>!r.some(t=>Tr(t,a)===Tr(e,a)))],!0)}const n=e.clientX-i.x0;if(!i.moved&&Math.abs(n)<3)return;i.moved=!0;const s=this._pxCache||this._pxPerPct(),a=this._snapAt(i.grab.at+n/s,e.shiftKey,i.duplicate?[]:i.sel,i.snaps,s);if(i.lastTarget===a)return;i.lastTarget=a;const r=qr(i.base,i.sel,a-i.grab.at,i.duplicate),o=i.sel.length;i.label=i.duplicate?na(287,{count:o}):na(492,{count:o}),this._draft=r.doc,this._select(r.selection,!0);const l=r.selection[i.sel.findIndex(e=>Tr(e,this._main)===Tr(i.grab,this._main))];l&&this._laneFocus.set(`${l.target}|${l.lane}`,l.at),(r.doc!==i.base||i.emitted)&&(i.emitted=!0,this._emit(this._draft,i.label,!0),this._selFrame||(this._selFrame=requestAnimationFrame(()=>{this._selFrame=0,"keys"===this._drag?.kind&&this._emitSelection()})))},this._onPointerUp=e=>{const t=this._hold;if(t&&e.pointerId===t.pointerId)return this._cancelHold(),void("pointerup"!==e.type||t.additive||(this._lastTarget=t.target,this._select([])));const i=this._drag;if(i&&e.pointerId===i.pointerId){if(this._drag=void 0,this._pxCache=0,cancelAnimationFrame(this._selFrame),this._selFrame=0,"band"===i.kind)return this._band=void 0,void(i.moved||i.additive?this._emitSelection():(i.target&&(this._lastTarget=i.target),this._select([])));if("keys"===i.kind){if(i.moved&&this._draft&&i.emitted){const e=this._draft,t=this._keys.find(e=>e.target===i.grab.target&&e.lane===i.grab.lane);return t&&(this._pendingFocus=Tr(t,this._main)),this._emit(e,i.label??na(478)),this._emitSelection(),this._draft=e,void(this.doc===e&&(this._draft=void 0))}this._draft=void 0,!i.additive&&i.wasSelected&&this._select([i.clickKey])}}},this._onWheel=e=>{!e.ctrlKey&&!e.metaKey||this._narrow||(e.preventDefault(),this._setZoom(this._zoom*Math.exp(.002*-e.deltaY),e.clientX))}}get onion(){const e=nr(this._kfsOf(this._active),"*"),t=100*this.time;return{prev:[...e].reverse().find(e=>e<t-.001),next:e.find(e=>e>t+.001)}}get selection(){return this._keys.map(e=>Tr(e,this._main))}set selection(e){this._select(e.map(e=>Fr(e,this._main)))}get zoom(){return this._zoom}set zoom(e){this._zoom=Zr(e)}connectedCallback(){var e;super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0);t&&t!==this._width&&(this._width=t)}),this._ro.observe(this)),this._unsubClip=(e=()=>this.requestUpdate(),Cr.add(e),()=>Cr.delete(e)),this.addEventListener("touchmove",this._onTouchMove,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._bodyRo?.disconnect(),this._bodyRo=void 0,this._unsubClip?.(),this.removeEventListener("touchmove",this._onTouchMove),this._cancelHold(),cancelAnimationFrame(this._selFrame)}get _view(){return this._draft??this.doc}get _main(){return this._view?Hr(this._view):"element"}_kfsOf(e){return this._view?Nr(this._view,e):[]}get _narrow(){return"narrow"===this.layout||"auto"===this.layout&&this._width>0&&this._width<480}get _active(){const e=this.studioSelection;return(!e||"target"!==e.kind&&"keys"!==e.kind?void 0:e.target)??this._keys[this._keys.length-1]?.target??this._lastTarget??this._main}_groups(){const e=this._view;if(!e)return[];const t=Rr(e),i=this.studioSelection,n=new Set([...i?.targets??[],...i?.target?[i.target]:[],...this._keys.map(e=>e.target)]),s=t.filter(e=>e.main||e.keyframes.length||n.has(e.target));for(const e of n)s.some(t=>t.target===e)||s.push({target:e,keyframes:[],main:!1});return s}_rows(){const e=[];for(const t of this._groups())if(e.push({target:t.target,lane:"*"}),!this._narrow&&!this._collapsed.has(t.target))for(const i of er(t.keyframes))e.push({target:t.target,lane:i});return e}willUpdate(e){if(e.has("doc")){this._drag||(this._draft=void 0);const e=this._view,t=e?this._keys.filter(t=>Ir(e,t)):[];t.length!==this._keys.length&&this._select(t)}e.has("studioSelection")&&this._adopt()}_adopt(){const e=this.studioSelection,t=this._view;if(e&&t)if("keys"===e.kind&&e.keys){const i=e.keys.map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(e=>Ir(t,e)),n=this._main;i.map(e=>Tr(e,n)).join()!==this.selection.join()&&(this._keys=i)}else this._keys.length&&(this._keys=[])}updated(){const e=this._menuOpen?this.renderRoot.querySelector("mc-ui-menu.add-menu"):null;if(e&&!e.open&&(e.anchor=this.renderRoot.querySelector(".add-btn")??void 0,e.show()),this._pendingFocus){const e=this.renderRoot.querySelector(`.key[data-key="${CSS.escape(this._pendingFocus)}"]`);this._pendingFocus=void 0,e?.focus()}const t=this.renderRoot.querySelector(".tl-body");if(t&&!this._bodyRo&&"undefined"!=typeof ResizeObserver&&(this._bodyRo=new ResizeObserver(()=>{const e=this.renderRoot.querySelector(".tl-body")?.clientWidth??0;e&&e!==this._viewW&&(this._viewW=e)}),this._bodyRo.observe(t)),this._zoomAnchor&&t){const{at:e,clientX:i}=this._zoomAnchor;this._zoomAnchor=void 0;const n=this._trackRect();n&&(t.scrollLeft+=n.left+12+e/100*(n.width-24)-i)}}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e,t=!1){const i=this._main,n=new Set,s=e.filter(e=>{const t=Tr(e,i);return!n.has(t)&&(n.add(t),!0)}),a=s.map(e=>Tr(e,i)).join()!==this.selection.join();this._keys=s,s.length&&(this._lastTarget=s[s.length-1].target),a&&!t&&this._emitSelection()}_emitSelection(){const e=this._main,t=this._keys,i=[...new Set(t.map(e=>e.target))],n=t.length?{kind:"keys",target:t[t.length-1].target,targets:i,keys:t.map(t=>({target:t.target,lane:t.lane,at:t.at,id:Tr(t,e)}))}:{kind:"none"};!t.length&&this.studioSelection&&"keys"!==this.studioSelection.kind||this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:n}}))}_isLocked(e){const t=this.layerView,i=this.doc;return!(!i||!t?.locked.length)&&("*"!==e.lane?nc(i,t,`lane:${e.target}|${e.lane}`):nc(i,t,/^(part|group|shape):/.test(e.target)?e.target:`target:${e.target}`)||Yl(i,e.target).some(n=>nc(i,t,`lane:${e.target}|${n}`)))}_refuseLocked(e){const t=e.find(e=>this._isLocked(e));if(!t||!this._view)return!1;const i=Pr(this._view,t.target);return this._announce(na(1205,{name:"*"===t.lane?i:`${i} ${Ia[t.lane]?qa(t.lane).toLowerCase():t.lane}`})),!0}_commit(e,t,i){this.doc&&!this.disabled&&(this._emit(e,t),i&&this._select(i))}_seek(e){const t=Math.min(1,Math.max(0,e/100));this.dispatchEvent(new CustomEvent("seek",{bubbles:!0,composed:!0,detail:{time:t}}))}_announce(e){this._status="",this.updateComplete.then(()=>this._status=e)}_isSel(e){return this._keys.some(t=>t.target===e.target&&t.lane===e.lane&&t.at===e.at)}_trackRect(){return this.renderRoot.querySelector(".track, .ruler-track")?.getBoundingClientRect()}_atFromX(e){const t=this._trackRect();return!t||t.width<=24?0:(e-t.left-12)/(t.width-24)*100}_pxPerPct(){const e=this._trackRect();return e&&e.width>24?(e.width-24)/100:6}_snapTargets(e=[]){const t=this._main,i=new Set(e.map(e=>Tr(e,t))),n=new Set([100*this.time]);for(const e of this._groups())for(const s of["*",...er(e.keyframes)])for(const a of nr(e.keyframes,s))i.has(Tr({target:e.target,lane:s,at:a},t))||n.add(a);return[...n]}_snapAt(e,t,i=[],n=this._snapTargets(i),s=this._pxPerPct()){return function(e,t){const i=e=>Math.min(100,Math.max(0,e));if(t.free)return i(Math.round(10*e)/10);let n;for(const i of t.targets??[])Math.abs(i-e)<=(t.threshold??0)&&(void 0===n||Math.abs(i-e)<Math.abs(n-e))&&(n=i);if(void 0!==n)return i(n);const s=function(e,t){const i=t>0?t:1;switch(e){case"pct5":return 5;case"s01":return.1/i*100;case"fps30":return 1/30/i*100;default:return 1}}(t.grid,t.duration);return i(Math.round(Math.round(e/s)*s*100)/100)}(e,{free:t||!this._snap,grid:this._grid,duration:this._view?.duration??1,targets:n,threshold:6/s})}_range(e,t){const i=this._rows(),n=i.findIndex(t=>t.target===e.target&&t.lane===e.lane),s=i.findIndex(e=>e.target===t.target&&e.lane===t.lane);if(n<0||s<0)return[t];const[a,r]=[Math.min(e.at,t.at),Math.max(e.at,t.at)],o=[];for(const e of i.slice(Math.min(n,s),Math.max(n,s)+1))for(const t of nr(this._kfsOf(e.target),e.lane))t>=a&&t<=r&&o.push({target:e.target,lane:e.lane,at:t});return o}_onKeyDown(e,t){if(this.disabled||0!==e.button||!this.doc)return;e.preventDefault(),e.stopPropagation(),e.currentTarget.focus();const i=this._isSel(t),n=e.ctrlKey||e.metaKey;if(e.shiftKey&&this._anchor)this._select(n?[...this._keys,...this._range(this._anchor,t)]:this._range(this._anchor,t));else if(n){if(this._select(i?this._keys.filter(e=>Tr(e,this._main)!==Tr(t,this._main)):[...this._keys,t]),i)return}else i||this._select([t]),this._anchor=t;this._laneFocus.set(`${t.target}|${t.lane}`,t.at),this._refuseLocked(this._keys)||(this._drag={kind:"keys",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1,base:this.doc,grab:t,sel:[...this._keys],duplicate:e.altKey,clickKey:t,wasSelected:i,additive:e.shiftKey||n,snaps:this._snapTargets(e.altKey?[]:this._keys)},this._pxCache=this._pxPerPct(),this._capture(e))}_cancelHold(){this._hold&&clearTimeout(this._hold.timer),this._hold=void 0}_onTrackDown(e,t){if(this.disabled||0!==e.button)return;const i=e.shiftKey||e.ctrlKey||e.metaKey;if("touch"===e.pointerType){this._cancelHold();const{pointerId:n,clientX:s,clientY:a}=e;return void(this._hold={pointerId:n,x:s,y:a,target:t,additive:i,timer:setTimeout(()=>{this._hold=void 0,this._startBand(n,s,a,t,i,"touch")},400)})}this._startBand(e.pointerId,e.clientX,e.clientY,t,i,e.pointerType)}_startBand(e,t,i,n,s,a){const r=this.renderRoot.querySelector(".lanes");if(!r)return;const o=r.getBoundingClientRect(),l=this._main,c=[...this.renderRoot.querySelectorAll(".lanes .key")].map(e=>{const t=e.getBoundingClientRect();return{key:Fr(e.dataset.key,l),x:t.left+t.width/2-o.left,y:t.top+t.height/2-o.top}});this._drag={kind:"band",pointerId:e,x0:t-o.left,y0:i-o.top,moved:!1,baseSel:s?[...this._keys]:[],additive:s,target:n,pointerType:a,centres:c};try{r.setPointerCapture?.(e)}catch{}}_capture(e){const t=this.renderRoot.querySelector(".lanes");try{(t??e.currentTarget).setPointerCapture?.(e.pointerId)}catch{}}_keysInBand(e=[]){const t=this._band;if(!t)return[];const[i,n]=[Math.min(t.x0,t.x1),Math.max(t.x0,t.x1)],[s,a]=[Math.min(t.y0,t.y1),Math.max(t.y0,t.y1)];return e.filter(e=>e.x>=i&&e.x<=n&&e.y>=s&&e.y<=a).map(e=>e.key)}_onRulerDown(e){if(0===e.button){e.preventDefault(),this._drag={kind:"seek",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}this._seek(this._atFromX(e.clientX))}}_onRulerKey(e){const t=100*this.time,i=e.shiftKey?10:1,n={ArrowLeft:t-i,ArrowDown:t-i,ArrowRight:t+i,ArrowUp:t+i,Home:0,End:100,PageUp:t+10,PageDown:t-10};e.key in n&&(e.preventDefault(),this._seek(Yu(n[e.key])))}_jump(e){const t=this.onion,i=e<0?t.prev:t.next;void 0!==i&&this._seek(i)}_setZoom(e,t){const i=Zr(e);if(i===this._zoom)return;const n=this._trackRect(),s=void 0!==t?this._atFromX(t):100*this.time,a=t??(n?n.left+12+s/100*(n.width-24):0);this._zoomAnchor={at:s,clientX:a},this._zoom=i}_onKeyKeydown(e,t){if(this.disabled||!this._view)return;const i=e.ctrlKey||e.metaKey,n=this._main;if(!("ArrowLeft"!==e.key&&"ArrowRight"!==e.key||e.altKey||i)){e.preventDefault(),this._isSel(t)||this._select([t]);const i=this._keys;if(this._refuseLocked(i))return;const s=qr(this._view,i,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?10:1));if(s.doc===this._view)return;const a=i.findIndex(e=>Tr(e,n)===Tr(t,n)),r=s.selection[a]??s.selection[0];return r&&(this._pendingFocus=Tr(r,n),this._laneFocus.set(`${r.target}|${r.lane}`,r.at)),void this._commit(s.doc,"Move "+(1===i.length?"keyframe":"keyframes"),s.selection)}if("ArrowLeft"===e.key||"ArrowRight"===e.key||"Home"===e.key||"End"===e.key){e.preventDefault();const i=nr(this._kfsOf(t.target),t.lane),n=i.indexOf(t.at),s="Home"===e.key?0:"End"===e.key?i.length-1:n+("ArrowLeft"===e.key?-1:1);return void(s>=0&&s<i.length&&this._focusKey({target:t.target,lane:t.lane,at:i[s]},e.shiftKey))}if("ArrowUp"===e.key||"ArrowDown"===e.key){e.preventDefault();const i=this._rows(),n=i.findIndex(e=>e.target===t.target&&e.lane===t.lane)+("ArrowUp"===e.key?-1:1);if(n<0||n>=i.length)return;const s=nr(this._kfsOf(i[n].target),i[n].lane),a=s.reduce((e,i)=>Math.abs(i-t.at)<Math.abs(e-t.at)?i:e,s[0]);return void(void 0!==a&&this._focusKey({...i[n],at:a},e.shiftKey))}if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),this._isSel(t)||this._select([t]),void this._delete();if(" "===e.key||"Enter"===e.key){e.preventDefault();const s=e.shiftKey||i;this._select(s?this._isSel(t)?this._keys.filter(e=>Tr(e,n)!==Tr(t,n)):[...this._keys,t]:[t]),s||(this._anchor=t)}}_onTimelineKeydown(e){if(this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.composedPath()[0]?.tagName;if("INPUT"===i||"TEXTAREA"===i||"SELECT"===i)return;const n=e.key.toLowerCase();if(t&&"c"===n)e.preventDefault(),this._copy();else if(t&&"v"===n)e.preventDefault(),this._paste();else if(t&&"a"===n){e.preventDefault();const t=[];for(const e of this._rows())for(const i of nr(this._kfsOf(e.target),e.lane))this._narrow&&"*"!==e.lane||t.push({...e,at:i});this._select(t)}else!t||"="!==n&&"+"!==n&&"-"!==n?"Escape"===e.key&&this._keys.length&&(e.preventDefault(),e.stopPropagation(),this._select([])):(e.preventDefault(),this._setZoom(Yr(this._zoom,"-"===n?-1:1)))}_focusKey(e,t=!1){this._select(t&&!this._isSel(e)?[...this._keys,e]:t?this._keys:[e]),t||(this._anchor=e),this._laneFocus.set(`${e.target}|${e.lane}`,e.at),this._pendingFocus=Tr(e,this._main),this.requestUpdate()}_add(e,t,i){const n=this._view;if(!this.doc||!n||this.disabled)return;if(this._refuseLocked([{target:e,lane:t}]))return;const s=Yu(Math.min(100,Math.max(0,i))),a=Nr(n,e),r="*"===t?function(e,t,i){const n=dr(t);let s=e;for(const t of er(e))s=pr(s,n,_r(e,t,n,i));return e.some(e=>e.at===n)||s!==e||(s=[...e,{at:n}]),{keyframes:cr(s),selection:[{lane:"*",at:n}]}}(a,s,n.easing):function(e,t,i,n){const s=dr(i),a=_r(e,t,s,n)??Ia[t].def;return{keyframes:cr(pr(e,s,a)),selection:[{lane:t,at:s}]}}(a,t,s,n.easing),o=r.selection.map(t=>({...t,target:e}));this._pendingFocus=Tr(o[0],this._main),this._laneFocus.set(`${e}|${t}`,o[0].at),this._anchor=o[0],this._collapsed.delete(e),this._commit(Or(n,e,r.keyframes),"*"===t?na(30):na(41,{lane:qa(t).toLowerCase()}),o)}_onTrackDblClick(e,t,i){e.target.closest(".key")||this._add(t,i,this._snapAt(this._atFromX(e.clientX),e.shiftKey))}_addLane(e){this._menuOpen=!1,this._add(this._active,e,100*this.time)}_delete(){const e=this._keys.length,t=this._view;e&&t&&!this._refuseLocked(this._keys)&&(this._commit(Kr(t,this._keys),"Delete "+(1===e?"keyframe":"keyframes"),[]),this._announce(na(1161,{count:e})))}_copy(){const e=this._view,t=e?Ur(e,this._keys):void 0;t&&(jr(t),this._announce(na(1160,{count:t.items.length})))}_paste(){const e=Ar(),t=this._view;if(!e||!t||!this.doc)return;const i=new Set(e.items.map(e=>e.target??this._main)),n=new Set(this._keys.map(e=>`${e.target}|${e.lane}`)),s=1===n.size&&"*"!==this._keys[0].lane?this._keys[0]:void 0,a=i.size>1?{}:s?{target:s.target,lane:s.lane}:{target:this._active},r=function(e,t,i,n={}){const s=Hr(e),a=new Set(t.items.map(e=>e.lane)),r=!n.lane||1!==a.size||a.has("*")||a.has(n.lane)?void 0:{from:[...a][0],to:n.lane},o=new Map;let l=0;for(const e of t.items){const t=n.target??e.target??s;let i=e;if(r){const t=Vr(r.from,r.to,e.frag);if(!t){l++;continue}i={...e,lane:r.to,frag:t,easings:e.easings?.[r.from]?{[r.to]:e.easings[r.from]}:void 0}}if("*"!==i.lane&&!Ka(t).some(e=>e.id===i.lane)){l++;continue}if("*"===i.lane&&!Ba(t)&&(void 0!==i.frag.draw||void 0!==i.frag.stroke)){const e={...i.frag};delete e.draw,delete e.stroke,i={...i,frag:e}}const a=o.get(t)??[];a.push(i),o.set(t,a)}let c=e;const d=[];for(const[e,t]of o){const n=Mr(Nr(c,e),{items:t},i);c=Or(c,e,n.keyframes),d.push(...n.selection.map(t=>({...t,target:e})))}return{doc:c,selection:d,skipped:l}}(t,e,Yu(100*this.time),a);if(!r.selection.length)return void this._announce(na(598));if(this._refuseLocked(r.selection))return;this._commit(r.doc,"Paste "+(1===r.selection.length?"keyframe":"keyframes"),r.selection);const o=r.skipped?na(12,{skipped:r.skipped}):"";this._announce(na(1162,{count:r.selection.length,at:Xu(100*this.time),skipped:o}))}_selectLane(e,t,i){const n=nr(this._kfsOf(e),t).map(i=>({target:e,lane:t,at:i}));this._lastTarget=e,this._select(i?[...this._keys.filter(i=>!(i.target===e&&i.lane===t)),...n]:n)}_toggleGroup(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t}render(){if(!this._view)return Z``;const e=this._narrow;return Z`
      <div class="shell" @keydown=${this._onTimelineKeydown}>
        ${this._renderBar(e)} ${e?this._renderNarrow():this._renderTimeline()}
        <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      </div>
    `}_renderAddMenu(e,t,i){const n=e.map((t,i)=>({id:t.id,label:na(t.label),icon:t.icon,separatorBefore:i>0&&e[i-1].group!==t.group}));return Z`<mc-ui-menu
      class="add-menu"
      .items=${n}
      label=${na(34,{target:Pr(this._view,t),at:Xu(i)})}
      @mc-menu-pick=${e=>{e.stopPropagation(),this._addLane(e.detail.id)}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menuOpen=!1}}
    ></mc-ui-menu>`}_renderBar(e){const t=100*this.time,i=(this._view.duration*this.time).toFixed(2),n=this.onion,s=this._active,a=new Set(er(this._kfsOf(s))),r=Ka(s).filter(e=>!a.has(e.id)),o=Ar();return Z`
      <div class="bar">
        <div class="readout" role="group" aria-label=${na(682)}>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${na(705)}
            title=${na(705)}
            ?disabled=${void 0===n.prev}
            @click=${()=>this._jump(-1)}
          >
            <ha-icon icon="mdi:skip-previous"></ha-icon>
          </button>
          <span class="now">${Xu(t)} <small>${i} s</small></span>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${na(553)}
            title=${na(553)}
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
          title=${na(24,{target:Pr(this._view,s)})}
          ?disabled=${this.disabled||!r.length}
          @click=${()=>{this._menuOpen?this._menuOpen=!1:Date.now()-this._menuClosedAt>400&&(this._menuOpen=!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon><span class="lbl">${na(e?706:33)}</span>
        </button>
        ${this._menuOpen?this._renderAddMenu(r,s,t):Q}
        <span class="spacer"></span>
        <div class="tools" role="toolbar" aria-label=${na(410)}>
          <button
            type="button"
            class="icon-btn sm"
            data-act="copy"
            aria-label=${na(202)}
            title=${na(199)}
            ?disabled=${!this._keys.length}
            @click=${this._copy}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            data-act="paste"
            aria-label=${na(651)}
            title=${o?na(650,{target:Pr(this._view,s)}):na(203)}
            ?disabled=${!o||this.disabled}
            @click=${this._paste}
          >
            <ha-icon icon="mdi:content-paste"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            data-act="delete"
            aria-label=${na(237)}
            title=${na(233)}
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
            aria-label=${na(608)}
            title=${na(609)}
            @click=${()=>this.onionSkin=!this.onionSkin}
          >
            <ha-icon icon="mdi:layers-triple-outline"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderRuler(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=this._narrow,n=this._pxPerPct(),s=function(e,t,i){const n=t>0?t:1,s=64/(e>0?e:6),a=e=>String(Math.round(1e3*e)/1e3);let r,o;"s"===i?(r=Jr(s/100*n)/n*100,o=e=>`${a(e/100*n)} s`):(r=Math.min(50,Jr(s)),o=e=>`${a(e)}%`);const l=Math.abs(r/Jr(r/5)-5)<.01?5:4,c=r/l,d=[],p=[];for(let e=0;e*c<=100.000001&&e<2e3;e++){const t=Math.round(e*c*1e3)/1e3;e%l===0?d.push(t):p.push(t)}return{major:d,minor:p,label:o}}(i?Math.min(n,2.5):n,this._view.duration,this._unit),a=s.major.filter(t=>Math.abs(t-100*e)*n>34);return Z`
      <div class="ruler">
        <div class="ruler-head">${i?"":"s"===this._unit?na(787):na(223)}</div>
        <div
          class="ruler-track"
          role="slider"
          tabindex="0"
          aria-label=${na(682)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Yu(100*e)}
          aria-valuetext=${na(1226,{pct:Xu(100*e),seconds:(this._view.duration*e).toFixed(2)})}
          @pointerdown=${this._onRulerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @keydown=${this._onRulerKey}
        >
          ${s.minor.map(e=>Z`<i class="tick" style="--at: ${e/100}"></i>`)}
          ${s.major.map(e=>Z`<i class="tick major" style="--at: ${e/100}"></i>`)}
          ${a.map(e=>Z`<span class="tick-label ${0===e?"first":e>=99.999?"last":""}" style="--at: ${e/100}">${s.label(e)}</span>`)}
          ${void 0!==t.prev?Z`<i class="ghost" style="--at: ${t.prev/100}"></i>`:Q}
          ${void 0!==t.next?Z`<i class="ghost" style="--at: ${t.next/100}"></i>`:Q}
          <span class="ph-tag" style="--t: ${e}">${"s"===this._unit?`${(this._view.duration*e).toFixed(2)} s`:Xu(100*e)}</span>
        </div>
      </div>
    `}_overlays(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=t.prev??(void 0!==t.next?100*e:void 0),n=t.next??(void 0!==t.prev?100*e:void 0);return Z`
      ${this.onionSkin&&void 0!==i&&void 0!==n?Z`<div class="onion-band" style="--a: ${i/100}; --b: ${n/100}" aria-hidden="true"></div>`:Q}
      <div class="ph-line" style="--t: ${e}" aria-hidden="true"></div>
    `}_laneTab(e,t,i){const n=this._laneFocus.get(`${e}|${t}`);return void 0!==n&&i.includes(n)?n:this._keys.find(n=>n.target===e&&n.lane===t&&i.includes(n.at))?.at??i[0]}_renderKeys(e,t,i){const n=e.keyframes,s=e.target,a=this._main,r=this._laneTab(s,t,i),o=this.onionSkin&&s===this._active?this.onion:{},l=s===a&&1===this._groups().length?"":`${Pr(this._view,s)} `,c="*"===t?l?na(1232,{target:l.trim()}):na(1116):l?na(1233,{target:l.trim(),lane:qa(t).toLowerCase()}):na(1196,{lane:qa(t).toLowerCase()}),d=c.charAt(0).toUpperCase()+c.slice(1),p=i.slice(0,-1).map((e,a)=>{const r=i[a+1],o=this._isSel({target:s,lane:t,at:e})&&this._isSel({target:s,lane:t,at:r});if("*"!==t)return Z`<i class="span ${o?"sel":""} ${or(n,t,e)?"own":""}" style="--a: ${e/100}; --b: ${r/100}"></i>`;const l=eo(rr(n,e)??this._view.easing),c=l?`M0 20 C${100*l[0]} ${20-16*l[1]} ${100*l[2]} ${20-16*l[3]} 100 4`:"M0 20 L100 4";return Z`<i class="span ${o?"sel":""}" style="--a: ${e/100}; --b: ${r/100}">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${Y`<path class="area" d="${c} L100 24 L0 24 Z"></path><path d=${c}></path>`}
        </svg>
      </i>`}),h=i.map(e=>{const i={target:s,lane:t,at:e},l=this._isSel(i),c="*"===t?this._kfLanesText(n,e):fo(t,ar(n,t,e)),p=this._isLocked(i);return Z`<button
        type="button"
        class="key ${l?"sel":""} ${p?"locked":""} ${e===o.prev||e===o.next?"onion":""} ${"keys"===this._drag?.kind&&l?"dragging":""}"
        style="--at: ${e/100}"
        data-key=${Tr(i,a)}
        data-lane=${t}
        data-target=${s}
        data-at=${e}
        role="slider"
        tabindex=${e===r?"0":"-1"}
        aria-label=${d}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${e}
        aria-valuetext=${[Xu(e),c,l?na(1134):"",p?na(1122):""].filter(Boolean).join(", ")}
        aria-describedby="kf-help"
        title=${c?na(1189,{label:d,at:Xu(e),value:c}):na(1188,{label:d,at:Xu(e)})}
        @pointerdown=${e=>this._onKeyDown(e,i)}
        @keydown=${e=>this._onKeyKeydown(e,i)}
        @focus=${()=>this._laneFocus.set(`${s}|${t}`,e)}
        @dblclick=${e=>e.stopPropagation()}
      ></button>`});return[...p,...h]}_kfLanesText(e,t){return er(e.filter(e=>e.at===t)).map(e=>qa(e)).join(", ")}_renderGroupHead(e,t){const i=nr(e.keyframes,"*"),n=Pr(this._view,e.target),s=!this._collapsed.has(e.target),a=e.target===this._active&&!t;return Z`
      <div
        class="row lane summary ${a?"target-active":""} ${this._keys.some(t=>t.target===e.target&&"*"===t.lane)?"active":""}"
        data-lane="*"
        data-target=${e.target}
        role="group"
        aria-label=${na(1208,{name:n})}
      >
        <div class="head">
          <button
            type="button"
            class="icon-btn sm collapse"
            aria-expanded=${s?"true":"false"}
            aria-label=${na(s?177:321,{name:n})}
            title=${na(s?175:319)}
            @click=${()=>this._toggleGroup(e.target)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="lane-name"
            title=${na(793,{name:n.toLowerCase()})}
            @click=${t=>this._selectLane(e.target,"*",t.shiftKey||t.ctrlKey||t.metaKey)}
          >
            <ha-icon icon=${Dr(e.target)}></ha-icon>
            <span class="nm">${n}</span>
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${na(26,{name:n.toLowerCase()})}
            title=${na(23)}
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
    `}_renderLane(e,t){const i=e.keyframes,n=nr(i,t),s=Ia[t],a=fo(s.id,_r(i,s.id,100*this.time,this._view.easing)),r=this._keys.some(i=>i.target===e.target&&i.lane===t);return Z`
      <div class="row lane sub ${r?"active":""}" data-lane=${t} data-target=${e.target} role="group" aria-label=${na(1192,{label:na(s.label)})}>
        <div class="head">
          <button
            type="button"
            class="lane-name"
            title=${na(793,{name:na(s.label).toLowerCase()})}
            @click=${i=>this._selectLane(e.target,t,i.shiftKey||i.ctrlKey||i.metaKey)}
          >
            <ha-icon icon=${s.icon}></ha-icon>
            <span class="nm">${na(s.label)}</span>
            ${a?this._laneValue(i,s.id,a):Q}
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${na(42,{name:na(s.label).toLowerCase()})}
            title=${na(23)}
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
    `}_laneValue(e,t,i){const n=_r(e,t,100*this.time,this._view.easing)??{},s=(e,t="")=>Z`<span class="val" title=${na(89,{text:i})}><i class="sw" style="background: ${e};${t}"></i></span>`,a=e=>e.replace(/var\(--mc-anim-c\)/g,this.entityColor);return"color"===t&&n.color?s(a(n.color)):"background"===t&&n.background?s(a(n.background)):"stroke"===t&&n.stroke?s(a(n.stroke)):"shadow"===t&&n.shadow?s("var(--mc-surface)",`box-shadow: ${"none"===n.shadow?"none":a(n.shadow).replace(/(\d+(?:\.\d+)?)px/g,(e,t)=>`${Math.min(4,Number(t)/4)}px`)}`):"filter"===t&&n.filter?Z`<span class="val" title=${na(88,{filter:n.filter})}>${n.filter.match(/^[a-z-]+/)?.[0]??n.filter}</span>`:Z`<span class="val" title=${na(89,{text:i})}>${i}</span>`}_trackWidth(){if(this._zoom<=1||!this._viewW)return;const e=this._narrow?44:216;return`${Math.round(Math.max(100,this._viewW-e)*this._zoom)}px`}_renderTimeline(){const e=this._groups(),t=1===e.length,i=[];for(const n of e){if(i.push(this._renderGroupHead(n,t)),this._collapsed.has(n.target))continue;const e=er(n.keyframes);for(const t of e)i.push(this._renderLane(n,t));e.length||n.main||i.push(Z`<div class="empty-group">${na(565)}</div>`)}const n=this._band,s=this._trackWidth(),a=e.every(e=>!er(e.keyframes).length);return Z`
      <div class="tl" role="group" aria-label=${na(409)}>
        <div class="tl-body" @wheel=${this._onWheel}>
          <div class="tl-content" style=${s?`--tw: ${s}`:""}>
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${i}
              ${n?Z`<div
                      class="band"
                      style="left: ${Math.min(n.x0,n.x1)}px; top: ${Math.min(n.y0,n.y1)}px; width: ${Math.abs(n.x1-n.x0)}px; height: ${Math.abs(n.y1-n.y0)}px"
                    ></div>`:Q}
            </div>
            ${a?Z`<div class="empty-lanes"><ha-icon icon="mdi:information-outline"></ha-icon>${na(569)}</div>`:Q}
            ${this._overlays()}
          </div>
        </div>
        ${this._renderFoot()}
        <span class="sr-only" id="kf-help">
          ${na(263)}
        </span>
      </div>
    `}_renderFoot(){const e=this._zoom;return Z`<div class="tl-foot" role="toolbar" aria-label=${na(1008)}>
      <button
        type="button"
        class="icon-btn sm"
        data-act="snap"
        aria-pressed=${this._snap?"true":"false"}
        aria-label=${na(848)}
        title=${na(847)}
        @click=${()=>this._snap=!this._snap}
      >
        <ha-icon icon="mdi:magnet"></ha-icon>
      </button>
      <label class="grid-select">
        <span class="sr-only">${na(846)}</span>
        <div class="select">
          <select
            class="input"
            data-act="grid"
            aria-label=${na(846)}
            ?disabled=${!this._snap}
            @change=${e=>this._grid=e.target.value}
          >
            ${Gr.map(e=>Z`<option value=${e.id} ?selected=${e.id===this._grid}>${na(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </label>
      <button
        type="button"
        class="unit-btn"
        data-act="units"
        aria-label=${"s"===this._unit?na(763):na(762)}
        title=${na(761)}
        @click=${()=>this._unit="s"===this._unit?"pct":"s"}
      >
        ${"s"===this._unit?"s":"%"}
      </button>
      <span class="spacer"></span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-out"
        aria-label=${na(1091)}
        title=${na(1092)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(Yr(e,-1))}
      >
        <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
      </button>
      <span class="zoom-pct" aria-live="polite" title=${na(211)}>${Math.round(100*e)}%</span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-in"
        aria-label=${na(1089)}
        title=${na(1090)}
        ?disabled=${e>=10}
        @click=${()=>this._setZoom(Yr(e,1))}
      >
        <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-fit"
        aria-label=${na(339)}
        title=${na(340)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(1)}
      >
        <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
      </button>
    </div>`}_renderNarrow(){const e=this._active,t=this._kfsOf(e),i={target:e,keyframes:t,main:e===this._main},n=nr(t,"*");return Z`
      <div class="tl narrow" role="group" aria-label=${na(409)}>
        <div class="tl-body">
          <div class="tl-content">
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${this._renderGroupHead(i,!0)}
            </div>
            ${this._overlays()}
          </div>
          <ul class="kf-list" aria-label=${na(411)}>
            ${n.map(i=>{const n={target:e,lane:"*",at:i},s=this._isSel(n),a=this._kfLanesText(t,i),r=rr(t,i),o=er(t.filter(e=>e.at===i)).map(e=>fo(e,ar(t,e,i))).filter(Boolean).join(" · ");return Z`<li>
                <button
                  type="button"
                  class="kf-row"
                  data-at=${i}
                  aria-pressed=${s?"true":"false"}
                  @click=${t=>{const a=t.shiftKey||t.ctrlKey||t.metaKey;this._select(a?s?this._keys.filter(t=>!(t.target===e&&"*"===t.lane&&t.at===i)):[...this._keys,n]:[n])}}
                >
                  <span class="at">${Xu(i)}</span>
                  <span class="props">${a||na(306)}${o?Z`<small>${o}</small>`:Q}</span>
                  <span class="ease">${vo(r)}</span>
                </button>
              </li>`})}
          </ul>
        </div>
        <span class="sr-only" id="kf-help">${na(73)}</span>
      </div>
    `}};Ju.styles=[Vu,c`
      :host {
        display: block;
        min-width: 0;
        height: 100%;
        container: kf / inline-size;
        --head: ${l(216)}px;
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
        --head: ${l(44)}px;
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
    `],Zu([_e({attribute:!1})],Ju.prototype,"doc",void 0),Zu([_e({attribute:!1})],Ju.prototype,"hass",void 0),Zu([_e({attribute:!1})],Ju.prototype,"library",void 0),Zu([_e({type:Number})],Ju.prototype,"time",void 0),Zu([_e({type:Boolean,reflect:!0})],Ju.prototype,"disabled",void 0),Zu([_e({attribute:!1})],Ju.prototype,"layerView",void 0),Zu([_e({type:Boolean,reflect:!0,attribute:"onion-skin"})],Ju.prototype,"onionSkin",void 0),Zu([_e({type:String})],Ju.prototype,"layout",void 0),Zu([_e({type:String})],Ju.prototype,"entityColor",void 0),Zu([_e({attribute:!1})],Ju.prototype,"studioSelection",void 0),Zu([$e()],Ju.prototype,"_keys",void 0),Zu([$e()],Ju.prototype,"_draft",void 0),Zu([$e()],Ju.prototype,"_band",void 0),Zu([$e()],Ju.prototype,"_width",void 0),Zu([$e()],Ju.prototype,"_viewW",void 0),Zu([$e()],Ju.prototype,"_menuOpen",void 0),Zu([$e()],Ju.prototype,"_status",void 0),Zu([$e()],Ju.prototype,"_zoom",void 0),Zu([$e()],Ju.prototype,"_unit",void 0),Zu([$e()],Ju.prototype,"_snap",void 0),Zu([$e()],Ju.prototype,"_grid",void 0),Zu([$e()],Ju.prototype,"_collapsed",void 0),Zu([$e()],Ju.prototype,"_lastTarget",void 0),Ju=Zu([be("mc-anim-keyframes-editor")],Ju);const Qu={...bt,...xt,...$t},em={"steam-rise":"bottom:-12px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:$c;filter:blur(5px);",bubbles:"bottom:-10px;width:8px;height:8px;margin-left:-4px;border-radius:50%;border:1.5px solid $c;background:color-mix(in srgb,$c 22%,transparent);","bubbles|:nth-child(even)":"width:5px;height:5px;","snow-fall":"top:-8px;width:5px;height:5px;border-radius:50%;background:$c;","rain-fall":"top:-18px;width:2px;height:14px;border-radius:1px;background:linear-gradient(transparent,$c);","liquid-wave":"left:-50%;top:calc(100% - $i * 1%);width:200%;aspect-ratio:1;border-radius:42%;background:color-mix(in srgb,$c 50%,transparent);opacity:1;","liquid-wave|:nth-child(2)":"top:calc(100% - $i * .9%);border-radius:38%;background:$c;animation-direction:reverse;","storm-flash":"inset:0;background:color-mix(in srgb,$c 35%,rgba(255,255,255,.55));","shine-sweep":"top:0;bottom:0;left:0;width:45%;opacity:1;background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--mca-shine-sweep-c,#fff) calc($i * 1%),transparent) 50%,transparent 100%);",..._t,"holographic-shimmer":"left:0;top:0;width:400%;height:100%;opacity:calc($i / 100);background:linear-gradient(115deg,transparent 20%,color-mix(in srgb,$c 55%,#ff80ab) 35%,color-mix(in srgb,$c 55%,#80d8ff) 50%,color-mix(in srgb,$c 55%,#ccff90) 65%,transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"left:0;top:0;width:100%;height:14%;opacity:calc($i / 100);background:linear-gradient(transparent,color-mix(in srgb,$c 45%,transparent) 70%,$c 96%,transparent);",twinkle:"top:calc(8% + var(--mc-anim-phase) * 80%);width:10px;height:10px;margin:-5px 0 0 -5px;background:$c;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);",spotlight:"left:50%;top:50%;width:70cqmin;aspect-ratio:1;margin:-35cqmin 0 0 -35cqmin;opacity:calc($i / 100);border-radius:50%;background:radial-gradient(circle,$c,transparent 65%);","color-cycle-bg":"left:0;top:0;width:100%;height:100%;opacity:calc($i / 100);background:$c;",aurora:"left:-25%;top:calc(-10% + var(--mc-anim-k) * 40%);width:150%;height:55%;background:radial-gradient(ellipse 30% 50% at 32% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 62% 50%,color-mix(in srgb,$c 50%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 50%,#00e5ff) 45%,transparent) 45%,transparent);","aurora|:nth-child(2)":"animation-duration:calc(var(--mc-fx-dur) * 1.4);animation-direction:reverse;background:radial-gradient(ellipse 30% 50% at 37% 50%,color-mix(in srgb,$c 50%,#76ff03),color-mix(in srgb,color-mix(in srgb,$c 50%,#76ff03) 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 68% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent);","aurora|:nth-child(3)":"animation-duration:calc(var(--mc-fx-dur) * .8);background:radial-gradient(ellipse 38% 50% at 42% 50%,color-mix(in srgb,$c 50%,#e040fb),color-mix(in srgb,color-mix(in srgb,$c 50%,#e040fb) 45%,transparent) 45%,transparent);","lava-lamp":"bottom:-12%;width:calc(14cqmin + var(--mc-anim-phase) * 16cqmin);aspect-ratio:1;margin-left:-10cqmin;border-radius:50%;background:radial-gradient(circle at 35% 35%,color-mix(in srgb,$c 55%,#fff),$c 70%);filter:blur(2px);","plasma-gradient":"left:50%;top:50%;width:160cqmax;aspect-ratio:1;margin:-80cqmax 0 0 -80cqmax;opacity:calc($i / 100);background:radial-gradient(circle at 30% 30%,$c,color-mix(in srgb,$c 55%,transparent) 22%,color-mix(in srgb,$c 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 70% 40%,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 45% 75%,color-mix(in srgb,$c 40%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 15%,transparent) 38%,transparent 52%);","gradient-flow":"left:0;top:0;width:300%;height:100%;opacity:calc($i / 100);background:linear-gradient(110deg,$c,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,$c 40%,#00e5ff),$c);",starfield:"top:calc(6% + var(--mc-anim-phase) * 86%);width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:$c;box-shadow:0 0 4px 1px color-mix(in srgb,$c 60%,transparent);","starfield|:nth-child(3n)":"width:2px;height:2px;","meteor-shower":"top:calc(-10% + var(--mc-anim-phase) * 30%);left:calc(30% + var(--mc-anim-x) * .8);width:22%;height:2px;rotate:-45deg;transform-origin:0 50%;border-radius:2px;background:linear-gradient(90deg,$c,transparent);",bokeh:"top:calc(10% + var(--mc-anim-phase) * 75%);width:calc(10cqmin + var(--mc-anim-k) * 18cqmin);aspect-ratio:1;margin:-10cqmin 0 0 -10cqmin;border-radius:50%;filter:blur(1px);background:radial-gradient(circle,color-mix(in srgb,$c 70%,transparent),color-mix(in srgb,$c 25%,transparent) 60%,transparent 72%);","matrix-rain":"top:0;width:2px;height:calc(20% + var(--mc-anim-phase) * 25%);border-radius:1px;background:linear-gradient(transparent,color-mix(in srgb,$c 60%,transparent) 70%,$c);","matrix-rain|:nth-child(odd)":"width:3px;background:repeating-linear-gradient(transparent 0 3px,$c 3px 6px);-webkit-mask:linear-gradient(transparent,#000);mask:linear-gradient(transparent,#000);",smoke:"bottom:-20px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:color-mix(in srgb,$c 70%,#9e9e9e);filter:blur(8px);","clouds-drift":"left:-40%;top:calc(5% + var(--mc-anim-phase) * 55%);width:38%;aspect-ratio:2.4;filter:blur(1.5px);background:radial-gradient(ellipse 35% 45% at 30% 60%,$c 60%,transparent 62%),radial-gradient(ellipse 30% 55% at 55% 45%,$c 60%,transparent 62%),radial-gradient(ellipse 28% 40% at 75% 62%,$c 60%,transparent 62%);","water-ripple":"top:calc(25% + var(--mc-anim-phase) * 50%);width:60cqmin;aspect-ratio:2.2;margin:-13.6cqmin 0 0 -30cqmin;border:2px solid $c;border-radius:50%;box-sizing:border-box;box-shadow:0 0 0 3px color-mix(in srgb,$c 25%,transparent);",fireworks:"left:50%;top:45%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 1px $c;animation-delay:var(--mc-fx-delay,0s);","fireworks|:nth-child(even)":"background:color-mix(in srgb,$c 50%,#ffeb3b);box-shadow:0 0 6px 1px color-mix(in srgb,$c 50%,#ffeb3b);","tap-ripple":"left:var(--mc-tap-x,50%);top:var(--mc-tap-y,50%);width:290cqmax;aspect-ratio:1;margin:-145cqmax 0 0 -145cqmax;border-radius:50%;background:radial-gradient(circle,$c 0,color-mix(in srgb,$c 55%,transparent) 40%,transparent 70%);"},tm={"conic-border-spin":"padding:calc($i * 1px);box-sizing:border-box;background:color-mix(in srgb,$c 18%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);"};function im(e,t,i=!1){const n=vt(t),s=`var(--mca-${t}-c, var(--mc-anim-c))`;return e.replace(/\$i/g,`var(--mca-${t}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${s} calc(var(--mca-${t}-s, 1) * 100%), transparent)`:s)}const nm=c`[data-mc-anim],[data-mc-anim-fx]{--mc-anim-c:var(--mc-anim-color,var(--mc-design-color,var(--primary-color,#03a9f4)))}[data-mc-anim~='module']{animation:var(--mc-anim-m);transform-origin:var(--mc-anim-om,center)} [data-mc-anim~='icon'] .mc-anim-icon{display:inline-block;animation:var(--mc-anim-i);transform-origin:var(--mc-anim-oi,center)} [data-mc-anim~='label'] [data-mc-part='name']{display:inline-block;animation:var(--mc-anim-n);transform-origin:var(--mc-anim-on,center)} [data-mc-anim~='icon']:not(:has(.mc-anim-icon)){animation:var(--mc-anim-mi);transform-origin:var(--mc-anim-om,var(--mc-anim-oi,center))} [data-mc-anim-fx]{position:relative;isolation:isolate}.mc-anim-fx{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;border-radius:inherit;container-type:size}.mc-anim-fx[data-front]{z-index:auto}.mc-anim-fx>i{position:absolute;display:block;left:var(--mc-anim-x,50%);opacity:0;will-change:translate,scale,rotate,opacity;animation:var(--mc-fx-anim);animation-delay:calc(var(--mc-fx-delay,0s) - var(--mc-anim-phase,0) * var(--mc-fx-dur,1s))} [data-mc-tap][data-mc-tapped]{animation:var(--mc-anim-m,none),var(--mc-anim-t);transform-origin:var(--mc-anim-om,center)} .mc-anim-fx[data-tap]:not([data-tapped]),.mc-anim-ring[data-tap]:not([data-tapped]){display:none}`,sm=c`@media (prefers-reduced-motion:reduce){[data-mc-anim],[data-mc-anim] .mc-anim-icon,[data-mc-anim~='label'] [data-mc-part='name'],[data-mc-tap],.mc-anim-fx>i{animation:none !important}.mc-anim-fx:not([data-p]),.mc-anim-ring{display:none}}`,am=l(nm.cssText+function(){const e=Object.entries(Qu).map(([e,t])=>`@keyframes mc-anim-${e} {${im(t,e.replace(/-icon$/,""),!0)}\n}`),t=ut.filter(e=>void 0!==e.particles).map(e=>`.mc-anim-fx[data-fx="${e.id}"] {\n  opacity: var(--mca-${e.id}-s, 1);\n}`);return[...e,...t,...Object.entries(tm).map(([e,t])=>`.mc-anim-fx[data-fx="${e}"] {${im(t,e)}\n}`),...Object.entries(em).map(([e,t])=>{const[i,n=""]=e.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${im(t,i)}\n}`})].join("\n")}()+sm.cssText),rm=new Set(["off","unavailable","unknown","idle","standby"]),om=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function lm(e){if(!e)return!1;const t=e.entity_id.split(".")[0],i=e.state;if(rm.has(i))return!1;switch(t){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function cm(e,t){if(!e||!Object.prototype.hasOwnProperty.call(e,t))return;const i=e[t];if(!Array.isArray(i))return;const n=[i[0],i[1],i[2]];return"hs_color"===t&&n.slice(0,2).every(Number.isFinite)?function(e,t){const i=Math.max(0,Math.min(100,t))/100,n=t=>{const n=(t+e/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(e=>Math.round(255*e))}((n[0]%360+360)%360,n[1]):n.every(Number.isFinite)?n.map(e=>Math.max(0,Math.min(255,Math.round(e)))):void 0}const dm=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function pm(e){if("string"!=typeof e)return;const t=e.trim().match(dm);return t?{opacity:void 0===t[1]?100:Math.min(100,Number(t[1]))}:void 0}function hm(e){return void 0!==pm(e)}function um(e){const t=pm(e);if(!t)return;const i="var(--mc-entity-color, currentColor)";return t.opacity>=100?i:`color-mix(in srgb, ${i} ${t.opacity}%, transparent)`}const mm=e=>e.replace(/_/g,"-"),gm={margin:["top","right","bottom","left"].map(e=>({key:`margin_${e}`,cssProperty:`margin-${e}`})),padding:["top","right","bottom","left"].map(e=>({key:`padding_${e}`,cssProperty:`padding-${e}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(e=>({key:`border_${e}_radius`,cssProperty:`border-${e.replace("_","-")}-radius`}))},fm="margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap background background_color:c background_image:i background_position background_size background_repeat background_attachment background_clip background_origin backdrop_filter flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction animation_fill_mode animation_play_state filter list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side".split(" ").map(e=>{const[t,i=""]=e.split(":");return{key:t,flag:i}}),vm=[...fm.filter(e=>"c"===e.flag).map(e=>e.key),"icon_color","icon_background","label_color","state_color"];new Set(fm.filter(e=>"i"===e.flag).map(e=>e.key)),Object.fromEntries(fm.filter(e=>"p"===e.flag||"s"===e.flag).flatMap(e=>{const t="s"===e.flag?"s":"px";return[[e.key,t],...(gm[e.key]||[]).map(e=>[e.key,t])]}));new Map;const bm=e=>"string"==typeof e&&""!==e.trim()?e.trim():void 0;function ym(e){if("number"==typeof e&&Number.isFinite(e)&&e>=0)return+e.toFixed(3)+"s";const t=bm(e);if(!t)return;const i=t.length<=64?/^(?:\d+(?:\.\d+)?|\.\d+)(m?s)?$/.exec(t):null;return i?i[1]?t:+(+t).toFixed(3)+"s":void 0}const xm=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function _m(e){const t=bm(e);if(!t||t.length>256||!/^[#\w\s(),.%+*/-]+$/.test(t)||t.includes("/*")||t.includes("*/"))return;let i=0;for(const e of t)if("("===e)i++;else if(")"===e&&--i<0)return;if(0!==i)return;const n=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==n||s.some(e=>!xm.has(e[1].toLowerCase()))?void 0:t}const $m=/^(\d+(?:\.\d+)?|\.\d+)(%)?$/;new Map([["blur",/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem)?$/],["hue-rotate",/^(-?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)$/],...["brightness","contrast","grayscale","invert","opacity","saturate","sepia"].map(e=>[e,$m])]),new Map,new Map,new Map([["left",["2/1/4/2",3]],["right",["2/4/4/5",2]],["above",["1/2/2/4",1]],["below",["4/2/5/4",0]]]),new Set(["start","center","end"]),function(){const e={};for(const{key:t}of fm){e[t]=mm(t);for(const i of gm[t]||[])e[i.key]=i.cssProperty}}();const wm=/(?<![\w-])entity(?: \d+(?:\.\d+)?%)?(?![\w-])/g;function km(e){const t="string"==typeof e&&e.length<=256?e.replace(wm,e=>um(e)??e):e;return t===e?void 0:t}function Mm(e,t,i){const n=bm(e.trigger_entity);switch(n&&(t=i?.[n]),e.trigger){case"entity_on":return lm(t);case"state":{const i=(e.state||"").trim();return!!i&&!!t&&t.state===i}default:return!0}}new Set(["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color","box_shadow"]),new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]);const Sm={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"};const Cm=new Map;const Am=new Set;function jm(e,t,i){t&&i&&Cm.get(e)?.name!==t&&(Cm.set(e,{name:t,css:i}),function(){const e=[...Cm.values()].map(e=>e.css).join("\n");for(const t of Am)t.isConnected?t.textContent=e:Am.delete(t)}())}const zm=new Map,Em={slow:1.6,normal:1,fast:.6},Vm=["normal","reverse","alternate","alternate-reverse"],Lm=e=>e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);function Pm(e){const t=bm(e);if(!t)return;const i=at.find(e=>e.id===t);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)?t:void 0}function Dm(e){if("infinite"===e)return"infinite";const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?String(+t.toFixed(2)):void 0}function Hm(e,t){const i="string"==typeof t?Number(t):t;return"number"==typeof i&&Number.isFinite(i)?Math.min(e.intensity.max,Math.max(e.intensity.min,i)):e.defaults.intensity}function Rm(e){const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?Math.min(100,Math.max(0,t)):void 0}const Nm=(e,t)=>t&&"icon"===e.target,Om=(e,t)=>t&&"label"===e.target;function Tm(e,t,i,n){if("weather"===e.seasonal){const e=bm(t.trigger_entity),a=e?.startsWith("weather.")?n?.[e]:i;return a?.entity_id?.startsWith("weather.")&&(s=a.state)?Sm[s]:void 0}var s;if("daynight"===e.seasonal){const e=n?.["sun.sun"],t=e?.attributes?.elevation;return function(e,t){if("below_horizon"===e||"above_horizon"===e)return"number"==typeof t&&Number.isFinite(t)&&Math.abs(t)<=6?"dusk":"below_horizon"===e?"night":void 0}(e?.state,"number"==typeof t?t:"string"==typeof t&&""!==t.trim()?Number(t):void 0)}return e.seasonal}const Fm=.618034;function Im(e){return Array.from({length:e},(t,i)=>{const n=60/e*(i*Fm%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/e*100+n)).toFixed(1),phase:+(i*Fm%1).toFixed(3),k:e>1?+(i/e).toFixed(3):0}})}function Bm(e,t,i={}){e=function(e){if(!e)return e;const t=e;let i;for(const e of vm){const n=km(t[e]);n&&((i??={...t})[e]=n)}return Array.isArray(t.animations)&&t.animations.some(e=>hm(e?.color))&&((i??={...t}).animations=t.animations.map(e=>hm(e?.color)?{...e,color:um(e.color)}:e)),i??e}(e);const n=!1!==i.allowIcon,s={m:[],i:[],mi:[],t:[],n:[]},a=[],r={},o=[],l=[],c=[],d={need:!1,p:!1};for(let p of function(e){if(!e)return[];if(Array.isArray(e.animations))return e.animations.filter(e=>!!e&&"object"==typeof e&&!!bm(e.preset)).map((e,t)=>bm(e.id)?e:{...e,id:`anim-${t}`});const t=bm(e.animation_preset);if(!t)return[];const i=vt(t),n={id:"legacy",preset:t};if(e.animation_target&&(n.target=e.animation_target),e.animation_trigger&&(n.trigger=e.animation_trigger),e.animation_state&&(n.state=e.animation_state),e.animation_color&&(n.color=e.animation_color),!i)return[n];const s=function(e){if(e.seasonal)return{intensity:e.defaults.intensity};const{duration:t,delay:i,easing:n,iterations:s,direction:a,intensity:r}=e.defaults;return{duration:t,delay:i,easing:n,iterations:s,direction:a,intensity:r,...st(e)?{strength:100}:{}}}(i),a=Em[e.animation_speed||"normal"]??1;return[{...n,...s,duration:+(Lm(s.duration)*a).toFixed(3)+"s"}]}(e)){if(si(p.preset)){const e=i.custom?.(ai(p.preset));if(!e||!Mm(p,t,i.states))continue;const h=qm(e,p,{lists:s,vars:a,origins:r,fx:o,seq:l,v2:c,allowIcon:n,runtime:d,custom:i.custom,stateObj:t,states:i.states});if(!h)continue;p=h}const e=vt(p.preset);if(!e||!Mm(p,t,i.states))continue;const h=e.defaults,u=ym(p.duration)??h.duration,m=ym(p.delay)??h.delay,g="tap"===p.trigger;let f=Dm(p.iterations)??Dm(h.iterations);g&&"infinite"===f&&(f="1");const v=`${Pm(p.easing)??Pm(h.easing)} ${m} ${f} ${Vm.includes(p.direction)?p.direction:h.direction}`,b=`${u} ${v}`,y=[`--mca-${e.id}-i: ${Hm(e,p.intensity)}`],x=_m(p.color);x&&y.push(`--mca-${e.id}-c: ${x}`);const _=st(e)?Rm(p.strength):void 0;if(void 0!==_&&100!==_&&y.push(`--mca-${e.id}-s: ${+(_/100).toFixed(3)}`),e.seasonal){const n=Tm(e,p,t,i.states);if(!n)continue;o.push({preset:e.id,front:!1,style:void 0!==_&&100!==_?"opacity: "+ +(_/100).toFixed(3):"",particles:[],seasonal:{scenes:[n],intensity:Hm(e,p.intensity)/100,decorations:!1!==p.decorations}});continue}if(e.ring){o.push({preset:e.id,front:!0,style:y.join("; "),particles:[],...g?{tap:g}:{},ring:Km(e,p,u,v,_)});continue}if(void 0!==e.particles){const t="count"===e.particles?Math.min(12,Math.round(Hm(e,p.intensity))):e.particles;o.push({preset:e.id,front:!!e.front,style:[`--mc-fx-anim: mc-anim-${e.id} ${b}`,`--mc-fx-dur: ${u}`,`--mc-fx-delay: ${m}`,...y].join("; "),particles:Im(Math.max(1,t)),...g?{tap:g}:{}});continue}if(a.push(...y),g){s.t.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.m&&(r.m=e.origin);continue}if(Om(p,n)){s.n.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.n&&(r.n=e.origin);continue}const $=Nm(p,n);s.mi.push(`mc-anim-${e.id} ${b}`),$?(s.i.push(`mc-anim-${e.id}${e.iconKeyframes?"-icon":""} ${b}`),e.origin&&!r.i&&(r.i=e.origin)):(s.m.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.m&&(r.m=e.origin))}if(!(s.mi.length||s.n.length||s.t.length||o.length||l.length||d.need))return;const p=[];s.m.length&&p.push(`--mc-anim-m: ${s.m.join(", ")}`),s.t.length&&p.push(`--mc-anim-t: ${s.t.join(", ")}`),s.i.length&&p.push(`--mc-anim-i: ${s.i.join(", ")}`,`--mc-anim-mi: ${s.mi.join(", ")}`),s.n.length&&p.push(`--mc-anim-n: ${s.n.join(", ")}`),r.m&&p.push(`--mc-anim-om: ${r.m}`),r.i&&p.push(`--mc-anim-oi: ${r.i}`),r.n&&p.push(`--mc-anim-on: ${r.n}`),p.push(...function(e){const t=new Map;for(const i of e){const e=i.slice(0,i.indexOf(":"));t.delete(e),t.set(e,i)}return[...t.values()]}(a));const h=_m(e?.color)??_m(function(e){if(!e)return;const t=e.entity_id.split(".")[0];if(!om.has(t))return;if(!lm(e))return`var(--state-${t}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=function(e){const t=cm(e,"rgb_color")||cm(e,"hs_color");return t?`rgb(${t.join(", ")})`:void 0}(e.attributes||{});return i||`var(--state-${t}-${e.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${t}-active-color, var(--state-active-color, var(--primary-color))))`}(t));h&&p.push(`--mc-anim-color: ${h}`);const u=[s.m.length?"module":"",s.i.length?"icon":"",s.n.length?"label":""].filter(Boolean).join(" ");return{...u?{targets:u}:{},style:p.join("; "),fx:o,...s.t.length?{tap:!0}:{},...l.length?{seq:l.join(" ")}:{},...d.need?{needsRuntime:!0}:{},...d.p?{needsParticles:!0}:{},...c.length?{v2:c,run:[...new Set(c.map(e=>e.run))].join(" ")}:{}}}function qm(e,t,i){const n=Ys(e,{lookup:i.custom}),s=Dm(e.iterations)??"infinite",a="tap"===t.trigger,r=ym(t.duration)??`${e.duration}s`,o=ym(t.delay)??"0s";let l=Dm(t.iterations)??s;a&&"infinite"===l&&(l="1");const c=Vm.includes(t.direction)?t.direction:e.direction??"normal",d=`${Pm(t.easing)??Pm(e.easing)??"ease"} ${o} ${l} ${c}`,p=Om(t,i.allowIcon),h=i.allowIcon&&("icon"===t.target||!t.target&&"icon"===n.motion?.target);let u;if(ti(e)&&(i.runtime.need=!0,n.v2)){const s="string"==typeof t.entity&&t.entity?t.entity:void 0,a=s?i.states?.[s]:i.stateObj,o=s??i.stateObj?.entity_id,l=n.name||Ms(e),c={};u=c.clip?.animation,i.v2.push({run:l,docId:e.id,v2:u?{...n.v2,tracks:[]}:n.v2,timing:`${r} ${d}`,icon:h,...o?{entityId:o}:{},...a?{stateObj:a}:{},hints:c})}if(u){if("none"===u)return;const n={...t,preset:u,target:h?"icon":t.target};for(const e of["duration","delay","easing","iterations","direction"])delete n[e];if(!si(u))return n;const s=i.custom?.(ai(u));return s&&s!==e?qm(s,n,i):void 0}if(n.preset)return{...t,preset:n.preset.id,intensity:t.intensity??n.preset.intensity,duration:t.duration??`${e.duration}s`,easing:t.easing??e.easing,iterations:t.iterations??("infinite"===s?"infinite":Number(s)),direction:t.direction??e.direction};if(n.schedule){const e=n.schedule,s=ym(t.duration),a=s&&e.total>0?Lm(s)/e.total:1,r="number"==typeof t.iterations&&t.iterations>0?Math.round(t.iterations):void 0;return void(e.steps.length&&i.seq.push(function(e){const t=`s${ks(JSON.stringify(e))}`;return zm.set(t,e),zm.size>64&&zm.delete(zm.keys().next().value),t}({...e,delay:Lm(o),scale:a,...r?{cycles:r}:{},...p?{target:"label"}:{}})))}const m=[],g="number"==typeof t.intensity&&Number.isFinite(t.intensity)?t.intensity:void 0;void 0!==g&&100!==g&&m.push(`${Ss(e.id,"i")}: ${+(g/100).toFixed(3)}`);const f=_m(t.color);f&&m.push(`${Ss(e.id,"c")}: ${f}`);const v=Rm(t.strength);if(void 0!==v&&100!==v&&m.push(`${Ss(e.id,"s")}: ${+(v/100).toFixed(3)}`),jm(e.id,n.name,n.css),n.layer){(n.sim||n.needsParticles)&&(i.runtime.p=!0);const e=+(Lm(r)/n.layer.speed).toFixed(3)+"s";for(const[t,s,r]of[[n.name,n.layer,n.sim],...n.split?[[n.split.name,n.split.layer,n.split.sim]]:[]])i.fx.push({preset:t,front:s.front,style:[`--mc-fx-anim: ${t} ${e} ${d}`,`--mc-fx-dur: ${e}`,`--mc-fx-delay: ${o}`,...m].join("; "),particles:s.particles,...s.symbol?{symbol:s.symbol}:{},sim:r,...a?{tap:a}:{}});return}if(!n.motion)return;const b=[n.name,...n.lanes??[]].map(e=>`${e} ${r} ${d}`).join(", "),y="center"!==n.motion.origin?n.motion.origin:void 0;return i.vars.push(...m),a?(i.lists.t.push(b),void(y&&!i.origins.m&&(i.origins.m=y))):p?(i.lists.n.push(b),void(y&&!i.origins.n&&(i.origins.n=y))):(i.lists.mi.push(b),void(h?(i.lists.i.push(b),y&&!i.origins.i&&(i.origins.i=y)):(i.lists.m.push(b),y&&!i.origins.m&&(i.origins.m=y))))}function Km(e,t,i,n,s){return{mode:"animated",fill:1,animation:e.ring,color:_m(t.color)??"var(--mc-anim-c)",width:Hm(e,t.intensity),linecap:"dashes"===e.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==s&&100!==s?{opacity:+(s/100).toFixed(3)}:{}}}const Um=["❤️","💖","⭐","✨","❄️","💧","🔥","🍂","🌸","🎉","🎈","🫧","☁️","⚡","🌙","🦋"],Gm={icon:{icon:"mdi:star"},emoji:{emoji:"✨"},svg:{svg:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'}},Wm=/^[a-z0-9_-]+:[a-z0-9_-]+$/i;function Zm(e){const t=e.trim();return t?[...t].length>8?na(1063):/[<>&"'\\{};]/.test(t)?"These characters are not allowed: < > & \" ' \\ { } ;":void 0:na(310)}function Ym(e){if(!e.trim())return na(653);if(!/<svg[\s>]/i.test(e))return na(554);const t=Qt(e);return t.error?va(t.error):t.paths.length||t.strokes.length||t.accentPaths.length?void 0:na(929)}const Xm=um("entity"),Jm=/^color-mix\(in srgb, var\(--mc-entity-color, currentColor\) (\d+(?:\.\d+)?)%, transparent\)$/;function Qm(e){const t=e.trim();if(t)return pm(t)?um(t):fi(t,"color")}function eg(e){if(e===Xm)return"entity";const t=Jm.exec(e);return t?`entity ${t[1]}%`:e}const tg=(e,t,i)=>Math.min(i,Math.max(t,e)),ig=(e,t)=>+(Math.round(e/t)*t).toFixed(4),ng={count:{min:1,max:ci,step:1},speed:{min:.1,max:10,step:.1},size:{min:1,max:200,step:1},spin:{min:-3600,max:3600,step:15},spread:{min:0,max:100,step:5},gravity:{min:-1,max:1,step:.1}};function sg(e,t){const i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;const n=ng[e],s=tg(i,n.min,n.max);return"count"===e?Math.round(s):"gravity"===e||"speed"===e?ig(s,.01):+s.toFixed(2)}function ag(e,t){const i={...e.particles??ui,...t};for(const e of Object.keys(i))void 0===i[e]&&delete i[e];return{...e,particles:i}}const rg=e=>e.particles?.preset?vt(e.particles.preset):void 0;function og(e){return e.ring?na(755):e.seasonal?na(786):"count"===e.particles?na(640):na(780)}const lg={"snow-fall":{direction:"fall",size:[4,8],colors:["#ffffff"],spin:0},"rain-fall":{direction:"fall",size:[2,4],speed:2,colors:["#90caf9"],gravity:.6,fade:!1},bubbles:{direction:"rise",size:[6,14],colors:[]},"steam-rise":{direction:"rise",size:[10,18],spread:60},confetti:{direction:"fall",size:[5,9],spin:360,colors:["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899"]},"falling-leaves":{direction:"fall",shape:{icon:"mdi:leaf"},size:[10,16],spin:180,colors:["#f97316","#eab308","#a16207"]},fireflies:{direction:"drift",size:[3,6],colors:["#fde047"]},twinkle:{direction:"drift",shape:{emoji:"✨"},size:[8,14],layer:"front",speed:.5},"orbit-dots":{direction:"orbit",size:[6,8],spread:70,fade:!1},starfield:{direction:"fall",size:[2,4],colors:["#ffffff"],speed:1.5},"meteor-shower":{direction:"fall",size:[3,5],gravity:.6,colors:["#ffffff"]},bokeh:{direction:"drift",size:[16,32],speed:.4},smoke:{direction:"rise",size:[16,28],spread:70,speed:.6},"clouds-drift":{direction:"drift",shape:{icon:"mdi:cloud"},size:[24,40],colors:["#ffffff"],speed:.3},fireworks:{direction:"burst",size:[4,6],spread:80,colors:["#ef4444","#eab308","#3b82f6"]},"ripple-rings":{direction:"burst",size:[8,12],spread:90},"water-ripple":{direction:"burst",size:[8,12],spread:90},"wind-lines":{direction:"drift",size:[3,5],speed:1.5},drip:{direction:"fall",size:[4,7],gravity:.8,colors:["#4fc3f7"]}},cg=["fall","rise","drift","burst","orbit","spiral","fountain","explode","wave","vortex","zigzag","rain","wander"],dg={fall:330,rise:756,drift:279,burst:126,orbit:622,spiral:861,fountain:353,explode:322,wave:1076,vortex:919,zigzag:1087,rain:709,wander:338},pg=new Set(oi),hg=new Set(["burst","orbit","spiral","explode","vortex"]),ug=[{id:"circle",label:160},{id:"square",label:875},{id:"triangle",label:1021},{id:"star",label:880},{id:"heart",label:374},{id:"ring",label:754},{id:"line",label:913},{id:"spark",label:853},{id:"icon",label:383,icon:"mdi:star-outline"},{id:"emoji",label:304,icon:"mdi:emoticon-outline"},{id:"svg",label:"SVG",icon:"mdi:svg"}],mg=new Set(uc),gg=e=>mg.has(e),fg=e=>"builtin"in e?e.builtin:(e=>e?"icon"in e?"icon":"emoji"in e?"emoji":"svg":"dot")(e),vg=e=>{const t=ug.find(t=>t.id===fg(e));return na(t?t.label:816)},bg=Math.min(4,mc.shapes),yg=200,xg={pspeed:{min:0,max:500,step:5},spin:{min:-3600,max:3600,step:15},delay:{min:0,max:60,step:.1},lifetime:{min:.1,max:60,step:.1},opacity:{min:0,max:100,step:5},seed:{min:0,max:4294967295,step:1},weight:{min:1,max:10,step:1},childCount:{min:1,max:mc.childrenPerParent,step:1},childSize:{min:1,max:200,step:1},childLife:{min:.1,max:10,step:.1},angle:{min:0,max:359,step:1},wind:{min:-60,max:60,step:5},unit:{min:0,max:1,step:.05}},_g=new Set(["seed","weight","childCount","childSize","angle","opacity","spin","wind"]);function $g(e,t){let i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;"angle"===e&&(i=(Math.round(i)%360+360)%360);const n=xg[e],s=tg(i,n.min,n.max);return _g.has(e)?Math.round(s):ig(s,.01)}const wg=e=>e[0]>e[1]?[e[1],e[0]]:[e[0],e[1]],kg=e=>e.duration/(e.particles?.speed||1);function Mg(e,t=Math.random){for(let i=0;i<8;i++){const i=Math.floor(4294967296*t())>>>0;if(i!==e)return i}return(e??0)+1>>>0}const Sg=e=>+e.toFixed(2);function Cg(e,t){const i=e.particles??ui,n=kg(e),s=Sg((hg.has(i.direction)?Math.max(10,i.spread):100)/n),a=Sg(i.spin/n);return{engine:1,mode:"baked",seed:t>>>0,flow:i.direction,shapes:i.shape?[{shape:i.shape,weight:1}]:[],ranges:{speed:[s,s],spin:[a,a],delay:[0,Sg(n)],lifetime:[Sg(n),Sg(n)],opacity:[1,1]},physics:{gravity:{angle:i.gravity<0?180:0,strength:Sg(Math.abs(i.gravity)*yg)},drag:0,turbulence:{strength:0,scale:25},bounce:.5},colliders:{floor:!1,ceiling:!1,left:!1,right:!1,content:"none"}}}const Ag=(e,t)=>e.particles?.sim??Cg(e,t),jg=e=>!!e.particles?.sim;function zg(e){const t=e.strength/yg*Math.cos(e.angle*Math.PI/180);return tg(Math.round(100*t)/100,-1,1)||0}function Eg(e,t){const i=t.shapes.find(e=>!("builtin"in e.shape))?.shape,n=tg(Math.round(t.ranges.spin[1]*kg(e)),ng.spin.min,ng.spin.max),s=ag(e,{sim:t,direction:hc[t.flow],gravity:zg(t.physics.gravity),spin:n});return i?s.particles.shape=i:delete s.particles.shape,s}const Vg=(e,t,i)=>Eg(e,i(Ag(e,t)));const Lg=e=>e.shapes.length?e.shapes:[{shape:{builtin:"circle"},weight:1}];function Pg(e,t){if(!jg(e)){const t=e.particles?.spin??0;return[t,t]}const i=kg(e);return[Math.round(t.ranges.spin[0]*i),Math.round(t.ranges.spin[1]*i)]}function Dg(e,t,i,n){const s=Sg(tg(n,0,1));return!jg(e)&&(0===i||180===i&&s>0)?ag(e,{gravity:180===i?-s:s}):Vg(e,t,e=>({...e,physics:{...e.physics,gravity:{angle:i,strength:Sg(s*yg)}}}))}const Hg=(e,t,i)=>Vg(e,t,e=>({...e,seed:Mg(e.seed,i)}));function Rg(e,t){const i=e.reduce((e,t)=>e+t.weight,0);return i>0?5*Math.round((e[t]?.weight??0)/i*20):0}function Ng(e){const t=new Set(e.map(e=>fg(e.shape))),i=["star","heart","circle","spark","square","triangle","ring","line"].find(e=>!t.has(e))??"circle";return{builtin:i}}const Og=e=>e.floor||e.ceiling||e.left||e.right||"none"!==e.content;function Tg(e){return{trigger:Og(e.colliders)?"collision":"death",count:6,shapes:[{shape:{builtin:"spark"},weight:1}],size:[2,4],colors:[],ranges:{speed:[30,60],lifetime:[.6,.6],opacity:[1,1],spin:[0,0]},cone:360,inherit:.2}}const Fg=[{angle:0,name:1105,icon:"mdi:arrow-down"},{angle:45,name:1106,icon:"mdi:arrow-bottom-left"},{angle:90,name:1119,icon:"mdi:arrow-left"},{angle:135,name:1152,icon:"mdi:arrow-top-left"},{angle:180,name:1151,icon:"mdi:arrow-up"},{angle:225,name:1153,icon:"mdi:arrow-top-right"},{angle:270,name:1133,icon:"mdi:arrow-right"},{angle:315,name:1107,icon:"mdi:arrow-bottom-right"}],Ig=e=>{const t=Fg.find(t=>t.angle===e);return t?na(t.name):na(1098,{angle:e})},Bg=e=>String(+e.toFixed(2)),qg=(e,t="")=>e[0]===e[1]?`${Bg(e[0])}${t}`:na(1179,{from:Bg(e[0]),to:Bg(e[1]),unit:t}),Kg=[{id:"floor",label:346},{id:"ceiling",label:141},{id:"left",label:424},{id:"right",label:753},{id:"content",label:194}],Ug=(e,t)=>"content"===t?"none"!==e.content:e[t],Gg=e=>"collision"===e.trigger?na(1129):"death"===e.trigger?na(1097):na(1095,{seconds:Bg(e.at??0)});let Wg;const Zg=()=>Wg;function Yg(e,t=0){const i="particles"===e.kind?e.particles:void 0;if(i&&!i.preset)return{...i,sim:i.sim??Cg(e,t)}}const Xg=e=>1+(e.particles?.sim?.emitters?.length??0);function Jg(e){return(e.particles?.count??ui.count)+(e.particles?.sim?.emitters??[]).reduce((e,t)=>e+t.count,0)}const Qg=e=>Math.max(0,mc.parents-Jg(e)),ef=e=>Xg(e)<mc.emitters&&Qg(e)>=1,tf=(e,t)=>e.layer??t;function nf(e,t){const i=e.particles??ui,n=Ag(e,t);return[{id:n.id??"",...void 0!==n.name?{name:n.name}:{},layer:i.layer,seed:n.seed,count:i.count,size:[i.size[0],i.size[1]],colors:[...i.colors],fade:i.fade,spread:i.spread,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics,...n.children?{children:n.children}:{}},...(n.emitters??[]).map(e=>({...e,layer:tf(e,i.layer)}))]}function sf(e,t,i){const n=Ag(e,t),[s,...a]=i,r={...n,seed:s.seed,flow:s.flow,shapes:s.shapes,ranges:s.ranges,physics:s.physics};if(s.children?r.children=s.children:delete r.children,delete r.id,delete r.name,delete r.emitters,i.length>1){const e=new Set,t=i.map(t=>t.id&&!e.has(t.id)?(e.add(t.id),t.id):""),n=t.map(t=>{if(t)return t;let i=1;for(;e.has(`e${i}`);)i++;return e.add(`e${i}`),`e${i}`});r.id=n[0],s.name&&(r.name=s.name),r.emitters=a.map((e,t)=>{const{layer:i,name:a,...r}=e;return{...r,id:n[t+1],...a?{name:a}:{},...i!==s.layer?{layer:i}:{}}})}return Eg(ag(e,{count:s.count,size:s.size,colors:s.colors,fade:s.fade,spread:s.spread,layer:s.layer}),r)}const af=(e,t)=>Number.isInteger(t)&&t>=0&&t<Xg(e);function rf(e,t,i,n){if(!af(e,i)||Xg(e)<2)return e;const s=(e=>e.trim().slice(0,40).trim())(n),a=e.particles.sim;if((0===i?a.name:a.emitters[i-1].name)===(s||void 0))return e;const r=nf(e,t);return s?r[i].name=s:delete r[i].name,sf(e,t,r)}function of(e,t){const i=e.particles??ui;return t<=0?i.layer:tf(i.sim?.emitters?.[t-1]??{},i.layer)}function lf(e,t,i){if(i<=0||i>=Xg(e))return e;const n=nf(e,t)[i],s={...Ag(e,t),seed:n.seed,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics};return delete s.id,delete s.name,delete s.emitters,delete s.children,n.children&&(s.children=n.children),Eg(ag(e,{count:n.count,size:n.size,colors:n.colors,fade:n.fade,spread:n.spread,layer:n.layer}),s)}function cf(e,t,i,n){const s=lf(e,t,i);if(s===e)return n(e);const a=n(s);if(a===s)return e;const r=a.particles,o=r.sim,l=e.particles.sim,c=l.emitters.map((t,n)=>{if(n!==i-1)return t;const s={...t};return delete s.children,{...s,seed:o.seed,flow:o.flow,shapes:o.shapes,ranges:o.ranges,physics:o.physics,count:Math.max(1,Math.min(r.count,t.count+Qg(e))),size:r.size,colors:r.colors,fade:r.fade,spread:r.spread,...o.children?{children:o.children}:{}}});return ag(e,{speed:r.speed,sim:{...l,mode:o.mode,colliders:o.colliders,emitters:c}})}function df(e,t,i){const n=nf(e,t),s=n[i];if(s?.name)return s.name;if(n.length<2)return na(642);const a=/^e(\d+)$/.exec(s?.id??""),r=a?Number(a[1]):i+1;return r>1?na(648,{n:r}):na(642)}class pf extends Ue{constructor(e){if(super(e),this.it=Q,2!==e.type)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===Q||null==e)return this._t=void 0,this.it=e;if(e===J)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}pf.directiveName="unsafeHTML",pf.resultType=1,Ke(pf);class hf extends pf{}hf.directiveName="unsafeSVG",hf.resultType=2;const uf=Ke(hf),mf=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),gf=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i,ff=/^(butt|round|square)$/,vf=/^(miter|round|bevel|arcs|miter-clip)$/;function bf(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":gf.test(t)?t:"currentColor"}function yf(e){const t=Ml(e)?bf(e.fill)??"currentColor":"none";let i=` id="${mf(e.id)}" class="shape" d="${mf(e.d)}" fill="${mf(t)}"`;return Sl(e)&&(i+=` stroke="${mf(bf(e.stroke)??"currentColor")}" stroke-width="${e.stroke_width??1}"`,e.linecap&&(i+=` stroke-linecap="${e.linecap}"`),i+=' stroke-linejoin="round"'),`<path${i}/>`}function xf(e,t){const i=Qt(/^\s*<svg[\s>]/i.test(e)?e:`<svg viewBox="${t}">${e}</svg>`);return i.error?"":i.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}function _f(e){const t=e.accent?"mc-accent":"";if(!e.stroke)return e.evenodd?{cls:t,attrs:' fill="currentColor" fill-rule="evenodd"',key:`e${t}`}:{cls:t,attrs:' fill="currentColor"',key:`f${t}`};let i=` fill="none" stroke="currentColor" stroke-width="${+e.stroke.width.toFixed(3)}"`;return e.stroke.cap&&ff.test(e.stroke.cap)&&(i+=` stroke-linecap="${e.stroke.cap}"`),e.stroke.join&&vf.test(e.stroke.join)&&(i+=` stroke-linejoin="${e.stroke.join}"`),{cls:t,attrs:i,key:`s${t}${i}`}}function $f(e,t,i){const n=new Map;for(const t of e){const e=_f(t),i=n.get(e.key)??{paint:e,d:[]};i.d.push(t.d),n.set(e.key,i)}const s=t?` id="${mf(t)}"`:"",a=[...n.values()],r=(e,t)=>{const n=[t?i:"",e.paint.cls].filter(Boolean).join(" ");return`<path${t?s:""}${n?` class="${n}"`:""} d="${mf(e.d.join(" "))}"${e.paint.attrs}/>`};return 1===a.length?r(a[0],!0):`<g${s} class="${i}">${a.map(e=>r(e,!1)).join("")}</g>`}const wf=new Set(["defs","clippath","mask","lineargradient","radialgradient","title"]),kf=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]);function Mf(e){if(void 0===e)return;const t=e.trim();return/^(none|transparent)$/i.test(t)?"none":fi(t,"color")&&!/url\(/i.test(t)?t:"currentColor"}function Sf(e,t,i=[],n=48){const s=Qt(e);if(s.error)return{error:s.error};const a=function(e){if("undefined"!=typeof DOMParser)return[...(new DOMParser).parseFromString(e,"text/html").getElementsByTagName("*")].find(e=>"svg"===e.localName.toLowerCase())}(s.markup);if(!a)return{error:"No <svg> element found."};const r=wl(s.viewBox,t),o=new Set(i),l=[];let c=!1;const d=(e,t,i)=>{const n=t=>e.getAttribute(t)??void 0,s=Number.parseFloat(n("stroke-width")??"");return{m:Kt(t,Ut(e.getAttribute("transform"))),paint:{fill:n("fill")??i.fill,stroke:n("stroke")??i.stroke,width:Number.isFinite(s)&&s>=0?s:i.width,cap:n("stroke-linecap")??i.cap}}},p=(e,t,i)=>{const n=e.localName.toLowerCase();if(wf.has(n))return;const{m:s,paint:a}=d(e,t,i);if(kf.has(n)){const t=Gt(e,n);if(t){const i=Math.sqrt(Math.abs(s[0]*s[3]-s[1]*s[2]))*r.k,d=vl(t,e=>[(s[0]*e[0]+s[2]*e[1]+s[4])*r.k+r.dx,(s[1]*e[0]+s[3]*e[1]+s[5])*r.k+r.dy]);if(d.length>pi)c=!0;else if(d){const t=e.getAttribute("id")??"",s=ds.test(t)&&!o.has(t)?t:Vl([...o],"shape");o.add(s);const r={id:s,name:t&&ds.test(t)?t:`Shape ${l.length+1}`,d,layer:"over"},c="line"===n?"none":Mf(a.fill)??"currentColor",p=Mf(a.stroke);p&&"none"!==p?(r.stroke=p,r.stroke_width=Math.round((a.width??1)*i*1e3)/1e3,"round"!==a.cap&&"butt"!==a.cap&&"square"!==a.cap||(r.linecap=a.cap),"none"!==c&&(r.fill=c)):"none"===c||function(e){const t=_l(e);return!t||function(e){let t=0;for(const i of xl(e)){let e=0;for(let t=0,n=i.length-1;t<i.length;n=t++)e+=(i[n][0]+i[t][0])*(i[n][1]-i[t][1]);t+=Math.abs(e)/2}return t}(e)<.001*Math.max(t.w,t.h)}(d)?(r.stroke="currentColor",r.stroke_width=Math.round(1e3*Math.max(i,.05))/1e3):r.fill=c,l.push(r)}}}for(const t of[...e.children])p(t,s,a)},h=d(a,[1,0,0,1,0,0],{});for(const e of[...a.children])p(e,h.m,h.paint);return c?{error:"A shape in the SVG is too detailed (over 8192 characters of path data)."}:l.length?l.length>n?{error:`The SVG has ${l.length} shapes; at most ${n} fit.`}:l:{error:"The SVG has no shapes to draw."}}function Cf(e){return e?.svg?$l(Qt(e.svg).viewBox).join(" "):"0 0 24 24"}var Af=i(9489);function jf(e){const t=/^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(e);if(t)return`[data-${"part"===t[1]?"p":"group"===t[1]?"g":"s"}="${t[2]}"]`}const zf=e=>e.css.includes("stroke-dashoffset");function Ef(e){const t=new Map;for(const i of e.css.matchAll(/(-?[\d.]+)% \{([^}]*)\}/g)){const e=/stroke-dashoffset: (-?[\d.]+)/.exec(i[2]);e&&t.set(Number(i[1]),Number(e[1])<=.001?1:0)}const i=[...t].sort((e,t)=>e[0]-t[0]),n=[];return i.forEach(([e,t],s)=>{const a=i[s-1];a&&a[1]!==t&&n.push([+(a[0]+(e-a[0])*(t?.75:.25)).toFixed(2),0]),n.push([e,t])}),n}function Vf(e){const t=Ef(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { fill-opacity: ${t}; }`);return`@keyframes ${e.name}-fill {\n${i.join("\n")}\n}`}function Lf(e){const t=Ef(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { stroke-opacity: ${1-t}; }`);return`@keyframes ${e.name}-outline {\n${i.join("\n")}\n}`}const Pf=[".rig { color: var(--mc-rig-paint, var(--icon-primary-color, currentColor)); }",".rig .primary { fill: var(--mc-rig-fill, currentColor); }",".rig .outlines { stroke-opacity: 0; }",".rig [data-p], .rig [data-g], .rig [data-s] { transform-box: view-box; }",".rig .drawn { stroke-dasharray: 1; stroke-linecap: round; stroke-linejoin: round; }",".rig .outlines .drawn { stroke-linecap: butt; stroke-dasharray: 0.999 2; }","@media (prefers-reduced-motion: reduce) { .rig, .rig * { animation: none !important; } }"].join("\n");function Df(e,t,i={}){const n=[Pf];if(i.still)return n.join("\n");const s=i.timing||"1s ease 0s infinite normal",a=new Set([...t.parts.map(e=>`part:${e.id}`),...(t.groups??[]).map(e=>`group:${e.id}`),...(t.shapes??[]).map(e=>`shape:${e.id}`)]);for(const t of e){const e=jf(t.target);if(!e||!a.has(t.target)||!t.css)continue;const i=[t.name,...t.lanes??[]];n.push(t.css);const r=e=>`${e} ${s}`;if(zf(t)){const s=Vf(t);s&&(n.push(s,Lf(t)),i.push(`${t.name}-fill`),n.push(`.rig ${e} .outlines { animation: ${r(`${t.name}-outline`)}; }`)),n.push(`.rig ${e} { stroke: currentColor; }`,`.rig ${e} .primary, .rig ${e} .secondary { stroke: none; }`)}t.origin&&n.push(`.rig ${e} { transform-origin: ${t.origin} !important; }`),n.push(`.rig ${e} { animation: ${i.map(r).join(", ")}; }`)}return n.join("\n")}const Hf=e=>String(+e.toFixed(3)),Rf=e=>[e[0]+e[2]/2,e[1]+e[3]/2],Nf=e=>`transform-origin: ${Hf(e[0])}px ${Hf(e[1])}px`,Of=e=>(0,St.Mj)(e).map(e=>(0,St.ER)([e])),Tf=new Map;function Ff(e,t){const i=`${t}|${e}`;let n=Tf.get(i);if(void 0===n){const s=Qt(`<svg viewBox="${t}">${e}</svg>`);n=s.error?null:{markup:s.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""),box:(0,Af.Zg)([...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].map(Af.hd)),outlines:[...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].flatMap(Of)},Tf.size>100&&Tf.clear(),Tf.set(i,n)}return n??void 0}function If(e,t,i="0 0 24 24"){return e.svg?Ff(e.svg,i)?.box:(0,Af.Zg)((e.from??[]).map(e=>t[e]?.bbox).filter(e=>!!e))}function Bf(e,t,i="0 0 24 24"){const n=new Map,s=new Map;for(const a of e.parts){const e=If(a,t,i);e&&s.set(a.id,e);const r=a.origin??(e?Rf(e):void 0);r&&n.set(`part:${a.id}`,r)}for(const t of e.groups??[]){const e=(0,Af.Zg)(t.parts.map(e=>s.get(e)).filter(e=>!!e)),i=t.origin??(e?Rf(e):void 0);i&&n.set(`group:${t.id}`,i)}for(const t of e.shapes??[])n.set(`shape:${t.id}`,t.origin??Rf((0,Af.hd)(t.d)));return n}const qf=e=>{if(!e)return;const t=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(e.trim());if(t){const e=void 0===t[1]?100:Math.min(100,Number(t[1]));return e>=100?"var(--mc-entity-color, currentColor)":`color-mix(in srgb, var(--mc-entity-color, currentColor) ${e}%, transparent)`}return fi(e,"color")},Kf=e=>Object.entries(e).filter(([,e])=>void 0!==e&&!1!==e&&""!==e).map(([e,t])=>` ${e}="${(e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"))(t)}"`).join("");new WeakMap,new Map,new Map,new WeakMap;const Uf=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;function Gf(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":Uf.test(t)?t:"currentColor"}const Wf=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Zf=e=>String(+e.toFixed(4)),Yf=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;function Xf(e,t){const i=(e??"center").trim().split(/\s+/),n=(e,i)=>{const n=t[2+i],s=t[i];if(!e||"center"===e)return s+n/2;if("left"===e||"top"===e)return s;if("right"===e||"bottom"===e)return s+n;const a=parseFloat(e);return Number.isFinite(a)?e.endsWith("%")?s+n*a/100:s+a:s+n/2};let[s,a]=i;return"top"!==s&&"bottom"!==s&&("left"!==a&&"right"!==a||"center"!==s)||([s,a]=[a,s]),[n(s,0),n(a??"center",1)]}const Jf={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function Qf(e){const t=(at.find(t=>t.id===e)?.css??e??"ease").trim();if(/^steps\(/.test(t))return"steps";if(Jf[t])return Jf[t];const i=/^cubic-bezier\(([^)]*)\)$/.exec(t);if(i){const e=i[1].split(",").map(e=>Math.min(1,Math.max(0,Number(e))));if(4===e.length&&e.every(Number.isFinite))return e}return Jf.ease}const ev={translate:"x",rotate:"rotate",scale:"scale",skewX:"skew",skewY:"skew",opacity:"opacity",color:"color",stroke:"stroke",draw:"draw"};function tv(e,t){const i=e.transform;switch(t){case"translate":return!i||void 0===i.x&&void 0===i.y?void 0:[i.x??0,i.y??0];case"rotate":return void 0!==i?.rotate?[i.rotate]:void 0;case"scale":if(!i||void 0===i.scale&&void 0===i.scale_x&&void 0===i.scale_y)return;return[(i.scale??1)*(i.scale_x??1),(i.scale??1)*(i.scale_y??1)];case"skewX":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_x??0];case"skewY":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_y??0];case"opacity":return void 0!==e.opacity?[e.opacity]:void 0;case"color":return e.color?Gf(e.color)??"currentColor":void 0;case"stroke":return e.stroke?Gf(e.stroke)??"currentColor":void 0;case"draw":return void 0!==e.draw?[1-e.draw]:void 0}}const iv=e=>"string"==typeof e?e:e.map(Zf).join(" ");function nv(e){const t=e.easings.map(Qf),i=` keyTimes="${e.times.map(Zf).join(";")}"`;return t.some(e=>"steps"===e)?` calcMode="discrete"${i}`:` calcMode="spline"${i} keySplines="${t.map(e=>e.map(Zf).join(" ")).join(";")}"`}const sv=e=>` dur="${Zf(e)}s" repeatCount="indefinite" begin="0s"`;function av(e,t,i,n){return`<animateTransform attributeName="transform" type="${e}" additive="sum" values="${t.values.map(e=>n(e)).join(";")}"${nv(t)}${sv(i)}/>`}function rv(e,t,i){return`<animate attributeName="${e}" values="${t.values.map(iv).join(";")}"${nv(t)}${sv(i)}/>`}function ov(e,t,i,n,s){const a=[],r=t=>function(e,t,i){const n=e.filter(e=>void 0!==tv(e,t));if(!n.length)return;const s=[],a=[],r=[],o=(e,t,i)=>{const n=Math.min(1,Math.max(0,e/100));if(s.length&&n<=s[s.length-1])return a[a.length-1]=t,void(r[r.length-1]=i);s.push(n),a.push(t),r.push(i)};n[0].at>0&&o(0,tv(n[0],t),"linear");for(const e of n)o(e.at,tv(e,t),e.easings?.[ev[t]]??e.easing??i);return s[s.length-1]<1&&o(100,a[a.length-1],"linear"),1===s.length&&(s.push(1),a.push(a[0]),r.push("linear")),r.pop(),{times:s,values:a,easings:r}}(e,t,n),o=r("translate"),l=[r("rotate"),r("scale"),r("skewX"),r("skewY")],c=l.some(Boolean),[d,p]=c?t:[0,0];if(s){const e=Rs(s.d,32);if(e.length){const t={times:e.map(e=>e.t),values:e.map(e=>[e.x,e.y]),easings:e.slice(1).map(()=>"linear")};a.push(av("translate",t,i,e=>`${Zf(e[0])} ${Zf(e[1])}`))}}o?a.push(av("translate",o,i,e=>`${Zf(e[0]+d)} ${Zf(e[1]+p)}`)):c&&a.push(av("translate",{times:[0,1],values:[[d,p],[d,p]],easings:["linear"]},i,e=>`${Zf(e[0])} ${Zf(e[1])}`));const[h,u,m,g]=l;h&&a.push(av("rotate",h,i,e=>Zf(e[0]))),u&&a.push(av("scale",u,i,e=>`${Zf(e[0])} ${Zf(e[1])}`)),m&&a.push(av("skewX",m,i,e=>Zf(e[0]))),g&&a.push(av("skewY",g,i,e=>Zf(e[0]))),c&&a.push(av("translate",{times:[0,1],values:[[-d,-p],[-d,-p]],easings:["linear"]},i,e=>`${Zf(e[0])} ${Zf(e[1])}`));const f=r("opacity");f&&a.push(rv("opacity",f,i));const v=r("color");v&&a.push(rv("color",v,i));const b=r("stroke");b&&a.push(rv("stroke",b,i));const y=r("draw");if(y){a.push(rv("stroke-dashoffset",y,i));const e=function(e){const t=e.times.map((t,i)=>[t,e.values[i][0]<=.001?1:0]),i=[],n=[];return t.forEach(([e,s],a)=>{const r=t[a-1];if(r&&r[1]!==s){const t=r[0]+(e-r[0])*(s?.75:.25);t>i[i.length-1]&&(i.push(t),n.push([0]))}(!i.length||e>i[i.length-1])&&(i.push(e),n.push([s]))}),{times:i,values:n,easings:i.slice(1).map(()=>"linear")}}(y);a.push(rv("fill-opacity",e,i)),a.push(rv("stroke-opacity",{...e,values:e.values.map(e=>[1-e[0]])},i))}return a.join("")}function lv(e,t,i){const n=/^(part|group|shape):(.+)$/.exec(t);if(!n||!i)return e;const s="part"===n[1]?"data-p":"group"===n[1]?"data-g":"data-s",a=new RegExp(`(<(g|path) ${s}="${n[2]}"[^>]*>)`);return e.replace(a,e=>`${e}${i}`)}function cv(e,t){const i=function(e,t){const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return;const n="part"===i[1]?"data-p":"group"===i[1]?"data-g":"data-s",s=new RegExp(`<(g|path) ${n}="${i[2]}"[^>]*>`).exec(e);if(!s)return;if("path"===s[1])return[s.index,e.indexOf("</path>",s.index)+7];const a=/<g\b[^>]*>|<\/g>/g;a.lastIndex=s.index+s[0].length;let r=1;for(let t=a.exec(e);t;t=a.exec(e))if(r+="</g>"===t[0]?-1:1,!r)return[s.index,t.index+4]}(e,t);if(!i)return e;const n=e.slice(i[0],i[1]).replace(/ class="(primary|secondary)"/g,' class="$1" stroke="none"');return e.slice(0,i[0])+n+e.slice(i[1])}function dv(e){const t=e=>{const t={...e};return delete t.at,delete t.easing,delete t.easings,JSON.stringify(t)};return e.every(i=>t(i)===t(e[0]))}const pv=new Set(["name","state","background"]);function hv(e,t,i={}){const n=[],s=zi(e,{v2:"lenient"});if(!s.ok)return{svg:"",warnings:[na(935,{message:s.errors[0]?.message??na(1150)})]};const a=s.doc;if("keyframes"!==a.kind)return{svg:"",warnings:[na(611)]};a.clips?.length&&n.push(na(898)),a.bindings?.length&&n.push(na(1073)),"infinite"!==a.iterations&&n.push(na(949)),a.tracks?.some(e=>pv.has(e.target))&&n.push(na(1019));const r=!1!==i.smil;r&&a.direction&&"normal"!==a.direction&&n.push(na(928)),r&&[...a.keyframes??[],...(a.tracks??[]).flatMap(e=>e.keyframes)].some(e=>e.transform?.axis)&&n.push("3D turns play flat in the SMIL fallback.");const o=t.viewBox||"0 0 24 24",l=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(o),c=(0,Af.WP)(t),d=a.rig??{parts:[]},p=ia(a),h=function(e){return new Set(e.filter(e=>jf(e.target)&&zf(e)).map(e=>e.target))}(p);let u=function(e,t,i={}){const n=i.viewBox??"0 0 24 24",s=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(n),a=i.drawn??new Set,r=Bf(e,t,n),o=Hf(s[2]/24*1.2),l=new Set(e.parts.flatMap(e=>e.from??[])),c=new Map;for(const t of e.groups??[])for(const e of t.parts)c.has(e)||c.set(e,t.id);const d=(e,t=!1)=>e.stroke?(t?Of(e.d):[e.d]).map(i=>`<path${Kf({class:t&&"drawn",d:i,fill:"none",stroke:"currentColor","stroke-width":Hf(e.stroke.width),"stroke-linecap":e.stroke.cap,"stroke-linejoin":e.stroke.join,pathLength:t&&"1"})}></path>`).join(""):`<path${Kf({class:e.secondary?"secondary":"primary",d:e.d,"fill-rule":e.evenodd&&"evenodd"})}></path>`,p=e=>e.length?`<g class="outlines">${e.map(e=>`<path${Kf({class:"drawn",d:e,fill:"none",pathLength:"1","stroke-width":o})}></path>`).join("")}</g>`:"";let h=!1;const u=(e,i)=>{const s=i||a.has(`part:${e.id}`),o=r.get(`part:${e.id}`),l=`<g${Kf({"data-p":e.id,style:o&&Nf(o)})}>`;if(e.svg){const t=Ff(e.svg,n);return t?(h=!0,`${l}${t.markup}${s?p(t.outlines):""}</g>`):""}const c=(e.from??[]).map(e=>t[e]).filter(e=>!!e);if(!c.length)return"";h=!0;const u=c.filter(e=>!e.stroke);return`${l}${c.map(e=>d(e,s)).join("")}${s?p(u.flatMap(e=>Of(e.d))):""}</g>`},m=new Set;let g="";for(const t of e.parts){const i=c.get(t.id);if(!i){g+=u(t,!1);continue}if(m.has(i))continue;m.add(i);const n=a.has(`group:${i}`),s=e.parts.filter(e=>c.get(e.id)===i).map(e=>u(e,n)).join(""),o=r.get(`group:${i}`);g+=`<g${Kf({"data-g":i,style:o&&Nf(o)})}>${s}</g>`}const f=e.shapes??[],v=e=>f.filter(t=>t.layer===e).map(e=>function(e,t,i){const n=qf(e.fill)??(e.stroke?"none":"currentColor"),s=qf(e.stroke),a=[`fill: ${n}`,s?`stroke: ${s}`:"",t?Nf(t):""].filter(Boolean).join("; ");return`<path${Kf({"data-s":e.id,class:i&&"drawn",d:e.d,pathLength:i&&"1","stroke-width":e.stroke_width??(i||s?1:void 0),"stroke-linecap":e.linecap,style:a})}></path>`}(e,r.get(`shape:${e.id}`),a.has(`shape:${e.id}`))).join("");if(!h&&!f.length)return;const b=t.filter(e=>!l.has(e.index)).map(e=>d(e)).join("");return`<g class="rig">${v("under")}${b}${g}${v("over")}</g>`}(d,c,{viewBox:o,drawn:h});if(u||(u=`<g class="rig">${c.map(e=>`<path class="${e.secondary?"secondary":"primary"}" d="${Wf(e.d)}"${e.evenodd?' fill-rule="evenodd"':""}></path>`).join("")}</g>`),!c.length&&!d.shapes?.length)return{svg:"",warnings:[...n,na(952)]};const m=a.duration,g=`${Zf(m)}s ${Cs(a.easing)} 0s infinite ${a.direction??"normal"}`,f=i.color?fi(i.color,"color"):void 0;i.color&&!f&&n.push(na(944));const v=f?Gf(f)??"currentColor":void 0,b=`mc-a-${ks(`${u}|${JSON.stringify(a)}|${r}|${f??""}`)}`,y=Ms(a),x=As(a.id),_=a.origin||"center",$=[],w=(e,t,i,n)=>{if(dv(i))return;const s=Ps(t,i,x);$.push(s.css,`.${b} .mc-css .${e} { transform-box: view-box; transform-origin: ${n??_}; animation: ${[t,...s.lanes].map(e=>`${e} ${g}`).join(", ")}; }`)},k=a.tracks?.find(e=>"element"===e.target),M=a.tracks?.find(e=>"icon"===e.target);w("mc-el",`${y}-el`,a.keyframes??[]),w("mc-et",`${y}-et`,k?.keyframes??[],k?.origin),w("mc-it",`${y}-it`,M?.keyframes??[],M?.origin);const S=[`.${b} { --mc-anim-c: ${f??"currentColor"};${f?` color: ${f};`:""} }`,...r?[`.${b} .mc-css { visibility: visible; }`,`.${b} .mc-smil { display: none; }`]:[],(A=Df(p,d,{timing:g}),A.replace(/(^|[\s,{])\.rig\b/g,`$1.${b} .mc-css .rig`)),...$,...$.length?[`@media (prefers-reduced-motion: reduce) { .${b} .mc-el, .${b} .mc-et, .${b} .mc-it { animation: none !important; } }`]:[]].join("\n"),C=[];var A,j;if(C.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${Wf(l.join(" "))}" class="mc-anim ${b}"${v?` color="${Wf(v)}"`:""}>`),C.push(`<title>${Wf(a.name)}</title>`),C.push(`<style>\n${S}\n</style>`),C.push(`<g class="mc-css"${r?' visibility="hidden"':""}>${j=u,`<g class="mc-el"><g class="mc-et"><g class="mc-it">${j}</g></g></g>`}</g>`),r){let e=u.replace(/ style="([^"]*)"/g,(e,t)=>t.split(";").map(e=>e.trim()).filter(Boolean).map(e=>{const[t,...i]=e.split(":"),n=t.trim(),s=i.join(":").trim();return"fill"===n||"stroke"===n?` ${n}="${Wf("none"===s?"none":Gf(s)??"currentColor")}"`:""}).join("")).replace(/ class="drawn"/g,' class="drawn" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"').replace(/<g class="outlines">[\s\S]*?<\/g>/g,e=>e.replace(/stroke-linecap="round"/g,'stroke-linecap="butt"').replace(/stroke-dasharray="1"/g,'stroke-dasharray="0.999 2"')).replace(/<g class="outlines">/g,'<g class="outlines" stroke="currentColor">').replace(/<g class="rig">/,'<g class="rig" fill="currentColor">');const t=Bf(d,c,o),i=[0,0,l[2],l[3]];for(const n of a.tracks??[])/^(part|group|shape):/.test(n.target)&&(h.has(n.target)&&(e=cv(e,n.target)),e=lv(e,n.target,ov(n.keyframes,n.origin?Xf(n.origin,i):t.get(n.target)??Xf("center",l),m,a.easing,n.path)));const n=Xf(_,l),s=(e,t,i)=>{const n=e&&!dv(e)?ov(e,t,m,a.easing):"";return n?`<g>${n}${i}</g>`:i};e=s(M?.keyframes,M?.origin?Xf(M.origin,l):n,e),e=s(k?.keyframes,k?.origin?Xf(k.origin,l):n,e),e=s(a.keyframes,n,e),C.push(`<g class="mc-smil">${e}</g>`)}C.push("</svg>");const z=C.join("\n");return Yf(z)>262144&&n.push(na(948,{size:Math.round(Yf(z)/1024)})),{svg:z,warnings:n}}const uv=new Set(["svg","g","path","title","style","animate","animatetransform"]);var mv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const gv=e=>na(1229,{size:(e/1024).toFixed(e<10240?1:0)}),fv=e=>(new TextEncoder).encode(e).length;function vv(e,t,i="image/svg+xml"){const n=URL.createObjectURL(new Blob([e],{type:i})),s=document.createElement("a");s.href=n,s.download=t,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}async function bv(e){if(e.size>32768)return{error:na(931)};if(!/\.svg$/i.test(e.name)&&e.type&&"image/svg+xml"!==e.type)return{error:na(157)};try{return{text:await e.text()}}catch{return{error:na(947)}}}let yv=class extends fe{constructor(){super(...arguments),this.pieces=[],this.viewBox="0 0 24 24",this.disabled=!1,this._open=!1,this._mode="export",this._format="still",this._smil=!0,this._color="",this._text="",this._fileName="",this._status="",this._error="",this._over=!1}openExport(e=!1){this._mode="export",this._format=e||this._isParticles?"animated":"still",this._manual=void 0,this._status="",this._error="",this._show()}openImport(e="",t=""){this._mode="import",this._text=e,this._fileName=t,this._status="",this._error="",this._show()}close(){const e=this.renderRoot.querySelector("mc-ui-window");e?.open?e.close("action"):this._open=!1}get open(){return this._open}get _isParticles(){return"particles"===this.doc?.kind}get exportText(){return this._export().text}_export(){const e=this._exportMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox)return e;const t=this.doc?.rig??{parts:[]},i=function(e,t,i={}){const n=i.viewBox??Cf(e),s=new Map(t.map(e=>[e.index,e])),a=new Set,r=[],o=Al(e.shapes??[]);for(const e of o)"under"===e.layer&&r.push(yf(e));const l=[];for(const t of e.parts??[])if(t.svg){const e=xf(t.svg,n);e&&l.push(`<g id="${mf(t.id)}" class="part" fill="currentColor">${e}</g>`)}else if(t.from?.length){const e=t.from.map(e=>(a.add(e),s.get(e))).filter(e=>!!e);e.length&&l.push($f(e,t.id,"part"))}const c=t.filter(e=>!a.has(e.index));c.length&&r.push($f(c,void 0,"base")),r.push(...l);for(const e of o)"under"!==e.layer&&r.push(yf(e));return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mf(n)}">\n${r.map(e=>`  ${e}`).join("\n")}\n</svg>`}(t,this.pieces,{viewBox:t.svg?void 0:this.viewBox}),n=(e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length)(a=i)>32768?"The SVG is larger than 32 KB.":/<path|<g/.test(a)?Qt(a).error:"Nothing to save yet: draw a shape or use an icon.",s=n?"":Qt(i).markup;var a;return this._exportMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,text:i,error:n,clean:s},this._exportMemo}_animated(){const e=this._animMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox&&e.smil===this._smil&&e.color===this._color)return e;const t=this.doc?this._isParticles?function(e){const t=Wg;if(!t)return{svg:"",warnings:[na(967)]};const i=Yg(e);if(!i)return{svg:"",warnings:[na(195)]};const n=t.bake({spec:i,period:kg(e),geometry:gc}),s=[];return"live"===i.sim.mode&&s.push(na(434)),n.elements.some(e=>"icon"in e.shape||"emoji"in e.shape)&&s.push(na(384)),n.stats.capped&&s.push(na(961)),{svg:t.bakedSvg(n,{width:200,height:Math.round(200/gc.aspect)}),warnings:s}}(this.doc):hv(this.doc,function(e,t="0 0 24 24"){const i=e=>!(!e.accent&&!e.secondary),n=e.filter(e=>!e.stroke&&!i(e)),s=e.filter(e=>!e.stroke&&i(e)),a=e.filter(e=>e.stroke),r=e=>e.map((e,t)=>e.evenodd?t:-1).filter(e=>e>=0),o={paths:r(n),accent:r(s)};return{paths:n.map(e=>e.d),viewBox:t,...s.length?{secondary:s.map(e=>e.d)}:{},...a.length?{strokes:a.map(e=>({d:e.d,width:e.stroke.width,...e.stroke.cap?{cap:e.stroke.cap}:{},...e.stroke.join?{join:e.stroke.join}:{},...i(e)?{accent:!0}:{}}))}:{},...o.paths.length||o.accent.length?{evenodd:o}:{}}}(this.pieces,this.viewBox),{smil:this._smil,...this._color?{color:this._color}:{}}):{svg:"",warnings:[]},i=t.svg?function(e){if(/<script|<foreignobject|<iframe|<image|<use|<!entity|<!doctype/i.test(e))return na(191);if(/\son[a-z]+\s*=/i.test(e))return na(192);if(/\shref\s*=|xlink:/i.test(e))return na(190);if(/url\(\s*['"]?(?!#)/i.test(e)||/@import|javascript:|expression\s*\(/i.test(e))return na(193);for(const t of e.matchAll(/<([a-zA-Z][\w-]*)/g))if(!uv.has(t[1].toLowerCase()))return na(1037,{element:t[1]});let t=e.replace(/<style>[\s\S]*?<\/style>/g,"").replace(/<animate(Transform)?\b[^>]*\/>/g,"");Yf(t)>32768&&t.includes('<g class="mc-smil">')&&(t=`${t.slice(0,t.indexOf('<g class="mc-smil">'))}</svg>`);const i=Qt(t);return i.error?i.error:i.paths.length||i.strokes.length||i.accentPaths.length?void 0:na(597)}(t.svg):t.warnings[0]??na(600),n=t.svg?t.warnings:t.warnings.slice(1),s="function"==typeof getComputedStyle?getComputedStyle(this).getPropertyValue("--state-icon-color").trim():"",a=/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(s)?s:"#44739e",r=this._color?t.svg:t.svg.replace('class="mc-anim ',`color="${a}" class="mc-anim `),o=t.svg&&!i?`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`:"";return this._animMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,smil:this._smil,color:this._color,text:t.svg,warnings:n,error:i,url:o},this._animMemo}_sourceError(){return this._srcMemo?.text!==this._text&&(this._srcMemo={text:this._text,error:Qt(this._text).error}),this._srcMemo.error}async _copy(e,t,i){const n=await async function(e,t){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.style.cssText="position:fixed;left:-9999px;top:0;opacity:0",(t??document.body).appendChild(i),i.select();const n=document.execCommand("copy");return i.remove(),n}catch{return!1}}(e,this.renderRoot.querySelector("mc-ui-window"));n?(this._manual=void 0,this._status=i):(this._manual={label:t,text:e},this._status=na(201))}async _show(){const e=ch()??void 0;this._open=!0,await this.updateComplete;const t=this.renderRoot.querySelector("mc-ui-window");t&&!t.open&&(t.opener=e,t.show())}updated(e){if(e.has("_manual")&&this._manual){const e=this.renderRoot.querySelector("textarea.manual");e?.focus(),e?.select()}if(e.has("_status")&&this._status){const e=this._status;setTimeout(()=>{this._status===e&&(this._status="")},2500)}}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_imported(){if(!this._text||!this.doc)return;const e=this._importMemo;if(e&&e.text===this._text&&e.doc===this.doc&&e.viewBox===this.viewBox)return e.r;const t=cs-(this.doc.rig?.shapes?.length??0),i=Sf(this._text,this.viewBox,Dl(this.doc),t);return this._importMemo={text:this._text,doc:this.doc,viewBox:this.viewBox,r:i},i}async _pick(e){const t=e.target,i=t.files?.[0];t.value="",i&&await this._takeFile(i)}async _takeFile(e){const t=await bv(e);if("error"in t)return this._error=va(t.error),void(this._text="");this._error="",this._text=t.text,this._fileName=e.name}_drop(e){e.preventDefault(),this._over=!1;const t=e.dataTransfer?.files?.[0];t&&this._takeFile(t)}_addShapes(e){if(!this.doc)return;let t=this.doc;for(const i of e)t=t&&Hl(t,i);if(!t)return void(this._error=na(85,{shapes:cs}));const i=Ll(t);i?this._error=i:(this._emit(t,1===e.length?na(396):na(397)),this.close())}_useAsIcon(){if(!this.doc)return;const e=function(e,t,i){const n=Qt(t);if(n.error)return{error:n.error};const s=e.rig??{parts:[]},a=$l(i??Cf(s)).join(" "),r=$l(n.viewBox).join(" "),o=wl(a,r),l=a===r,c=e=>e&&!l?[Math.round(100*(e[0]*o.k+o.dx))/100,Math.round(100*(e[1]*o.k+o.dy))/100]:e,d=e=>e.origin?{...e,origin:c(e.origin)}:e,p=e=>String(Math.round(1e4*e)/1e4),h=(s.parts??[]).filter(e=>!e.from).map(e=>d(l||!e.svg?e:{...e,svg:`<g transform="matrix(${p(o.k)} 0 0 ${p(o.k)} ${p(o.dx)} ${p(o.dy)})">${e.svg}</g>`})),u=s.shapes?.map(e=>l?e:d({...e,d:vl(e.d,e=>[e[0]*o.k+o.dx,e[1]*o.k+o.dy]),...void 0!==e.stroke_width?{stroke_width:Math.round(e.stroke_width*o.k*1e3)/1e3}:{}})),m=new Set(h.map(e=>e.id)),g=(s.groups??[]).map(e=>d({...e,parts:e.parts.filter(e=>m.has(e))})).filter(e=>e.parts.length),f=new Set([...(s.parts??[]).filter(e=>!m.has(e.id)).map(e=>`part:${e.id}`),...(s.groups??[]).filter(e=>!g.some(t=>t.id===e.id)).map(e=>`group:${e.id}`)]),v={...s,svg:n.markup,parts:h,...s.groups?{groups:g}:{},...u?{shapes:u}:{}};delete v.icon;const b={...e,rig:v};return e.tracks&&(b.tracks=e.tracks.filter(e=>!f.has(e.target)).map(e=>e.path&&!l&&/^(part|group|shape):/.test(e.target)?{...e,path:{...e.path,d:vl(e.path.d,e=>[e[0]*o.k,e[1]*o.k])}}:e)),e.bindings&&(b.bindings=e.bindings.filter(e=>!f.has(e.target))),b}(this.doc,this._text,this.viewBox);if("error"in e)return void(this._error=va(e.error));const t=Ll(e);t?this._error=t:(this._emit(e,"Use SVG as icon"),this.close())}_shapesPreview(e,t){return Z`<svg viewBox=${t} aria-hidden="true">
      ${Al(e).map(e=>Y`<path d=${e.d} fill=${Ml(e)?e.fill&&!/^entity|var\(/.test(e.fill)?e.fill:"currentColor":"none"}
            stroke=${Sl(e)?/^entity|var\(/.test(e.stroke)?"currentColor":e.stroke:"none"}
            stroke-width=${e.stroke_width??1} stroke-linecap=${e.linecap??"butt"} stroke-linejoin="round"></path>`)}
    </svg>`}_renderFormat(){const e=[["still",na(383),"mdi:image-outline"],["animated",na(64),"mdi:motion-play-outline"]];return Z`<div class="format">${gh({role:"radiogroup",label:na(1080),full:!0,value:this._format,items:e.map(([e,t,i])=>({value:e,label:t,icon:i})),onChange:e=>{this._format=e,this._status="",this._manual=void 0}})}</div>`}_renderManual(){return this._manual?Z`<div class="field">
          <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
          <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
        </div>`:Q}_renderAnimated(){const{text:e,warnings:t,error:i,url:n}=this._animated(),s=fv(e);return Z`
      <div class="body">
        ${this._isParticles?Q:this._renderFormat()}
        <div class="top">
          <div class="preview">${n?Z`<img class="anim" src=${n} alt="" />`:Z`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this._isParticles?na(16):na(15)}</span>
            <span class="muted">${gv(s)}${s>262144?na(4):""}</span>
            ${this._isParticles?Z`<span class="muted">${na(123)}</span>`:Z`<span class="muted">${na(124)}</span>
            <div class="color-row">
              <label class="check">
                <input type="color" class="color" .value=${this._color||"#03a9f4"} @input=${e=>this._color=e.target.value} />
                ${this._color?Z`${na(180)} <span class="mono">${this._color}</span>`:na(186)}
              </label>
              ${this._color?Z`<button type="button" class="btn btn-text btn-sm color-reset" @click=${()=>this._color=""}>${na(1057)}</button>`:Z`<span class="muted">${na(104)}</span>`}
            </div>
            <label class="check">
              <input type="checkbox" class="smil" .checked=${this._smil} @change=${e=>this._smil=e.target.checked} />
              ${na(764)}
            </label>
            `}
            ${t.length?Z`<ul class="warn">${t.map(e=>Z`<li>${e}</li>`)}</ul>`:Q}
            ${i?Z`<p class="error" role="alert">${i}</p>`:Q}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-anim-code">${na(64)}</label></div>
          <textarea id="svg-anim-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._renderManual()}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!i} @click=${()=>this._copy(e,na(768),na(65))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${na(200)}
        </button>
        <button
          type="button"
          class="btn btn-primary download"
          ?disabled=${!!i}
          @click=${()=>{vv(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}-animated.svg`),this._status=na(256)}}
        >
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${na(255)}
        </button>
      </div>
    `}_renderExport(){if("animated"===this._format)return this._renderAnimated();const{text:e,error:t,clean:i}=this._export(),n=fv(e),s=this.doc?.rig?.parts?.length??0,a=this.doc?.rig?.shapes?.length??0,r=Math.min(100,n/32768*100);return Z`
      <div class="body">
        ${this._renderFormat()}
        <div class="top">
          <div class="preview">${i?uf(i):Z`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${s} ${1===s?"part":"parts"}, ${a} ${1===a?"shape":"shapes"}${this.pieces.length?"":na(5)}</span>
            <span class="muted">${na(1182,{kb:gv(n)})}</span>
            <div class="meter ${n>32768?"over":""}" role="meter" aria-label=${na(833)} aria-valuemin="0" aria-valuemax=${32768} aria-valuenow=${n}>
              <i style="width:${r}%"></i>
            </div>
            <span class="muted">${na(951)}</span>
            ${t?Z`<p class="error" role="alert">${t}</p>`:Q}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-code">SVG</label></div>
          <textarea id="svg-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._manual?Z`<div class="field">
              <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
              <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
            </div>`:Q}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!t} @click=${()=>this._copy(e,na(768),na(766))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${na(200)}
        </button>
        <button type="button" class="btn btn-secondary download" ?disabled=${!!t} @click=${()=>{vv(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}.svg`),this._status=na(256)}}>
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${na(255)}
        </button>
        <button
          type="button"
          class="btn btn-primary use"
          ?disabled=${!!t}
          title=${na(197)}
          @click=${()=>this._copy(`icon: svg\nsvg: |\n${e.replace(/\r\n?/g,"\n").trim().split("\n").map(e=>`  ${e}`).join("\n")}\n`,na(134),na(133))}
        >
          <ha-icon icon="mdi:card-text-outline"></ha-icon>${na(1059)}
        </button>
      </div>
    `}_renderImport(){const e=this._imported(),t=e&&!("error"in e)?e:void 0,i=this._error||(e&&"error"in e?va(e.error):"");return Z`
      <div class="body">
        ${this._text?Z`<div class="top">
              <div class="preview">${t?this._shapesPreview(t,this.viewBox):Z`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
              <div class="facts">
                <span>${this._fileName||"SVG"}</span>
                ${t?Z`<span class="muted">${na(1169,{count:t.length})}</span>`:Q}
                <span class="muted">${na(39)}</span>
                ${i?Z`<p class="error" role="alert">${i}</p>`:Q}
              </div>
            </div>`:Z`<div
              class="drop ${this._over?"over":""}"
              @dragover=${e=>{e.preventDefault(),this._over=!0}}
              @dragleave=${()=>this._over=!1}
              @drop=${e=>this._drop(e)}
            >
              <ha-icon icon="mdi:file-upload-outline"></ha-icon>
              <span>${na(281)}</span>
              <label class="btn btn-secondary">
                ${na(159)}
                <input type="file" accept=".svg,image/svg+xml" class="sr-only" @change=${e=>this._pick(e)} />
              </label>
              ${i?Z`<p class="error" role="alert">${i}</p>`:Q}
            </div>`}
      </div>
      <div slot="footer" class="foot">
        ${this._text?Z`<button type="button" class="btn btn-text again" @click=${()=>this._text=""}>${na(158)}</button><span class="grow"></span>`:Z`<span class="grow"></span>`}
        <button type="button" class="btn btn-secondary use-icon" ?disabled=${!this._text||!!this._sourceError()} @click=${()=>this._useAsIcon()}>
          <ha-icon icon="mdi:star-four-points-outline"></ha-icon>${na(1055)}
        </button>
        <button type="button" class="btn btn-primary add" ?disabled=${!t} @click=${()=>t&&this._addShapes(t)}>
          <ha-icon icon="mdi:shape-plus-outline"></ha-icon>${na(27)}
        </button>
      </div>
    `}render(){return this._open?dh({heading:"import"===this._mode?na(394):this._isParticles?na(64):na(772),size:"m",onClose:()=>{this._open=!1,this._status=""}},"export"===this._mode?this._renderExport():this._renderImport()):Q}};yv.styles=[Vu,c`
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
    `],mv([_e({attribute:!1})],yv.prototype,"doc",void 0),mv([_e({attribute:!1})],yv.prototype,"pieces",void 0),mv([_e({type:String})],yv.prototype,"viewBox",void 0),mv([_e({type:Boolean})],yv.prototype,"disabled",void 0),mv([$e()],yv.prototype,"_open",void 0),mv([$e()],yv.prototype,"_mode",void 0),mv([$e()],yv.prototype,"_format",void 0),mv([$e()],yv.prototype,"_smil",void 0),mv([$e()],yv.prototype,"_color",void 0),mv([$e()],yv.prototype,"_text",void 0),mv([$e()],yv.prototype,"_fileName",void 0),mv([$e()],yv.prototype,"_status",void 0),mv([$e()],yv.prototype,"_error",void 0),mv([$e()],yv.prototype,"_over",void 0),mv([$e()],yv.prototype,"_manual",void 0),yv=mv([be("mc-anim-svg-dialog")],yv);var xv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const _v={circle:Y`<circle cx="12" cy="12" r="7"></circle>`,square:Y`<rect x="5" y="5" width="14" height="14" rx="1.5"></rect>`,triangle:Y`<path d="M12 4l8 15H4z"></path>`,star:Y`<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"></path>`,heart:Y`<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"></path>`,ring:Y`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="3"></circle>`,line:Y`<path d="M6 19L18 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`,spark:Y`<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"></path>`};function $v(e){return gg(e)?Z`<svg class="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${_v[e]}</svg>`:Z`<ha-icon class="glyph" icon=${ug.find(t=>t.id===e).icon}></ha-icon>`}const wv=["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899","#ffffff","#f97316","#8b5cf6"];let kv=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.emitter=0,this._shapes={},this._color=-1,this._chip=0,this._paused=!1,this._open={},this._baking=!1,this.all=!1,this._live="",this._seed=Mg(),this._bakeMs=0,this._bakeToken=0,this._applied=[],this._liveCss=new Map,this._previewCss="",this._shuffle=()=>{if(!this.doc)return;const e=this._multi&&this.all;let t=this.doc;for(let i=e?0:this._em;i<(e?Xg(this.doc):this._em+1);i++)t=cf(t,this._seed,i,e=>Hg(e,this._seed));this._emit(t,"Shuffle")},this._openExport=()=>{this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)},this._convert=()=>{this.doc&&(this._emit(function(e){const t=e.particles??ui,i=rg(e),n=(i&&lg[i.id])??{},s="count"===i?.particles?t.intensity??i.defaults.intensity:void 0,a=void 0!==s&&Number.isFinite(s)?tg(Math.round(s),1,ci):ui.count,{preset:r,intensity:o,...l}=t,c={...ui,...l,...n,count:a,size:[...n.size??l.size??ui.size],colors:[...n.colors??l.colors??[]]};return c.shape||delete c.shape,{...e,particles:c}}(this.doc),"Convert to custom particles"),this._focus('.mode-seg [aria-checked="true"]'))},this._addEmitter=()=>{if(!this.doc)return;const e=function(e,t){if(!ef(e))return e;const i=nf(e,t),n=structuredClone(i[0]);return delete n.name,n.id="",n.seed=Mg(i[0].seed,void 0),n.count=Math.min(10,i[0].count,Qg(e)),sf(e,t,[...i,n])}(this.doc,this._seed);e!==this.doc&&(this._emit(e,"Add emitter"),this._select(Xg(e)-1),this._focus('.em-tabs [aria-selected="true"]'))},this._dupEmitter=()=>{if(!this.doc)return;const e=function(e,t,i){if(!af(e,i)||!ef(e))return e;const n=nf(e,t),s=structuredClone(n[i]);return s.id="",s.seed=Mg(n[i].seed,void 0),s.count=Math.min(n[i].count,Qg(e)),s.name&&(s.name=na(1203,{name:s.name}).slice(0,40).trim()),n.splice(i+1,0,s),sf(e,t,n)}(this.doc,this._seed,this._em);e!==this.doc&&(this._emit(e,"Duplicate emitter"),this._select(this._em+1),this._focus('.em-tabs [aria-selected="true"]'))},this._removeEmitter=()=>{if(!this.doc)return;const e=this._em,t=function(e,t,i){if(!af(e,i)||Xg(e)<2)return e;const n=nf(e,t);return n.splice(i,1),sf(e,t,n)}(this.doc,this._seed,e);t!==this.doc&&(this._emit(t,"Remove emitter"),this._select(Math.max(0,e-1)),this._focus('.em-tabs [aria-selected="true"]'))},this._onFocusOut=e=>{const t=e.target;this._pending&&["f-svg","f-emoji","f-grav","f-drag","f-turb","f-bounce"].includes(t.id)&&this._settle()}}_emit(e,t,i=!1){if(this.disabled||e===this.doc)return;this._pending=i?{doc:e,label:t}:void 0;const n=i?{doc:e,label:t,transient:!0}:{doc:e,label:t};this.dispatchEvent(new CustomEvent("doc-change",{detail:n,bubbles:!0,composed:!0}))}_settle(){if(this._pending){const{doc:e,label:t}=this._pending;if(this._pending=void 0,this.disabled)return;this.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:e,label:t},bubbles:!0,composed:!0}))}}get _em(){return this.doc?Math.max(0,Math.min(Math.trunc(this.emitter)||0,Xg(this.doc)-1)):0}get _vdoc(){const e=this.doc,t=this._em;return this._viewKey?.doc===e&&this._viewKey.em===t||(this._viewKey={doc:e,em:t,view:lf(e,this._seed,t)}),this._viewKey.view}get _p(){return"particles"===this.doc?.kind?this._vdoc.particles:void 0}get _sim(){return Ag(this._vdoc,this._seed)}_on(e){return cf(this.doc,this._seed,this._em,e)}_patch(e,t,i=!1){this.doc&&this._emit(this._on(t=>ag(t,e)),t,i)}_editSim(e,t,i=!1){this.doc&&this._emit(this._on(t=>Vg(t,this._seed,e)),t,i)}_editAll(e,t,i=!1){if(!this.doc)return;let n=this.doc;for(let t=0;t<Xg(n);t++)n=cf(n,this._seed,t,t=>Vg(t,this._seed,e));this._emit(n,t,i)}_select(e,t=!1){this.emitter=e,this.all=t,this.dispatchEvent(new CustomEvent("emitter-change",{detail:{index:e,all:t},bubbles:!0,composed:!0}))}get _multi(){return!!this.doc&&Xg(this.doc)>1}_name(e){return this._multi?df(this.doc,this._seed,e):na(642)}willUpdate(e){if(e.has("emitter")&&void 0!==e.get("emitter")&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._color=-1,this._chip=0,this._live=""),e.has("doc")){const t=e.get("doc");if(t&&t.id!==this.doc?.id&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._shapes={},this._color=-1,this._chip=0,this._seed=Mg(),this._stats=void 0,this.all=!1,this._live=""),this._p&&!this._p.preset){for(const e of this._sim.shapes)"builtin"in e.shape||(this._shapes={...this._shapes,[fg(e.shape)]:e.shape});const e=Lg(this._sim).length;this._chip>=e&&(this._chip=e-1)}const i=this._p?.colors.length??0;this._color>=i&&(this._color=i-1)}}_preview(){const e=this.doc,t=this._p;if(!e||!t)return{css:""};if(t.preset)return{anim:Bm({animations:[{id:"pv",preset:t.preset,intensity:t.intensity,duration:`${e.duration}s`,easing:e.easing,iterations:"infinite",direction:e.direction}]}),css:""};const i=Ys(e);if(!i.layer||!i.name)return{css:""};const n=+(e.duration/i.layer.speed).toFixed(3),s=[[i.name,i.layer],...i.split?[[i.split.name,i.split.layer]]:[]].map(([t,i])=>({preset:t,front:i.front,style:`--mc-fx-anim: ${t} ${n}s ${Cs(e.easing)} 0s infinite ${e.direction??"normal"}; --mc-fx-dur: ${n}s; --mc-fx-delay: 0s`,particles:i.particles,...i.symbol?{symbol:i.symbol}:{}}));return{css:i.css,anim:{style:"",fx:s}}}updated(e){const t=this.renderRoot.querySelector("style[data-pv]");t&&t.textContent!==this._previewCss&&(t.textContent=this._previewCss),e.has("doc")&&this._scheduleBake(),this._applyModule()}disconnectedCallback(){super.disconnectedCallback(),this._release(),this._bakeToken++}_scheduleBake(){const e=Zg(),t=this.doc&&this._p?.sim&&!this._p.preset?Yg(this.doc):void 0,i=++this._bakeToken;if(!e||!t)return this._stats=void 0,void(this._baking=!1);this._bakeMs>150&&(this._baking=!0);const n=this.doc;setTimeout(()=>{if(i!==this._bakeToken)return;const s=performance.now();try{this._stats=e.bake({spec:t,period:kg(n),geometry:gc}).stats}catch{this._stats=void 0}this._bakeMs=performance.now()-s,this._baking=!1},0)}_applyModule(){const e=Zg(),t=this.doc&&this._p?.sim&&!this._p.preset?Yg(this.doc):void 0,i=[...this.renderRoot.querySelectorAll(".stage .mc-anim-fx")];if(this._applied.some((e,t)=>e!==i[t])&&this._release(),!e||!t||!i.length||this._paused&&"live"===t.sim.mode)return void this._release();const n="function"==typeof matchMedia&&matchMedia(na(3)).matches;try{i.forEach((i,s)=>{e.apply(i,{useCss:(e,t)=>{this._liveCss.set(e,t);const i=this.renderRoot.querySelector("style[data-live]");i&&(i.textContent=[...this._liveCss.values()].join("\n"))},reducedMotion:n,content:()=>this.renderRoot.querySelector(".stage-module")??void 0,docId:this.doc.id,spec:t,period:kg(this.doc),...1===s?{part:1}:{}})}),this._applied=i}catch{}}_release(){for(const e of this._applied)Zg()?.release(e);this._applied=[]}_renderPreview(){const{anim:e,css:t}=this._preview();this._previewCss=t;const i=this._p,n=rg(this.doc),s=i.preset?void 0:this._sim,a=s?this._baking?na(96):`${this._multi?na(1224,{particles:Jg(this.doc),emitters:Xg(this.doc)}):na(1166,{count:i.count,flow:na(dg[s.flow]).toLowerCase()})} · ${"live"===s.mode?na(1121):na(1228,{seconds:+kg(this.doc).toFixed(2)})}`:`${n?(0,nt.t)(n.name):i.preset} · ${this.doc.duration} s`,r=!!s&&!!this._stats?.capped,o=!!s&&!r&&!!this._stats?.warn,l=!!s&&!!Zg();return Z`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>${na(436)}</span></div>
        ${e?function(e){return e.fx.some(e=>e.seasonal)&&window.MagicCard?.loadSeasonal?.(),Z`${e.fx.map(e=>e.seasonal?Z`<mc-seasonal class="mc-anim-seasonal" data-fx=${e.preset} .scenes=${e.seasonal.scenes} .intensity=${e.seasonal.intensity} .seed=${`pv|${e.preset}`}></mc-seasonal>`:e.ring?Z`<mc-ring class="mc-anim-ring" data-fx=${e.preset} style=${e.style} .ring=${e.ring}></mc-ring>`:Z`<span class="mc-anim-fx" data-fx=${e.preset} ?data-front=${e.front} style=${e.style} aria-hidden="true">${e.particles.map(t=>Z`<i data-s=${t.shape??Q} style="--mc-anim-x: ${t.x}%; --mc-anim-phase: ${t.phase}; --mc-anim-k: ${t.k}${t.style?`; ${t.style}`:""}"
                >${(e=>e?"icon"in e?Z`<ha-icon .icon=${e.icon}></ha-icon>`:e.text:Q)(t.symbol??e.symbol)}</i
              >`)}</span>`)}`}(e):Q}
      </div>
      <div class="preview-foot">
        <span class="sum">${a}</span>
        ${r?Z`<span class="chip is-warn trimmed">${na(1022)}</span>`:Q}
        ${l?Z`<button type="button" class="icon-btn sm export" aria-label=${na(64)} title=${na(771)} ?disabled=${this.disabled} @click=${this._openExport}>
              <ha-icon icon="mdi:motion-play-outline"></ha-icon>
            </button>`:Q}
        ${s?Z`<button type="button" class="icon-btn sm shuffle" aria-label=${na(829)} title=${na(830)} ?disabled=${this.disabled} @click=${this._shuffle}>
              <ha-icon icon="mdi:dice-5-outline"></ha-icon>
            </button>`:Q}
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused?"true":"false"}
          aria-label=${na(659)}
          title=${this._paused?na(678):na(659)}
          @click=${()=>this._paused=!this._paused}
        >
          <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
        </button>
      </div>
      ${r?Z`<p class="help cap-note">${na(1002)}</p>`:Q}
      ${o?Z`<p class="help cap-note">${na(1003)}</p>`:Q}
      <p class="help reduced-note">${na(714)}</p>
      ${l?Z`<mc-anim-svg-dialog .doc=${this.doc}></mc-anim-svg-dialog>`:Q}
    </div>`}_cols(e){if(!e||"function"!=typeof getComputedStyle)return 3;const t=getComputedStyle(e).gridTemplateColumns||"",i=/^repeat\((\d+)/.exec(t);if(i)return+i[1];const n=t.split(/\s+/).filter(e=>/px$/.test(e)).length;return n||3}_radioKeys(e,t,i,n,s=0){const a=Math.max(0,t.indexOf(i));let r;if("ArrowRight"===e.key)r=a+1;else if("ArrowLeft"===e.key)r=a-1;else if("ArrowDown"===e.key)r=a+(s||1);else if("ArrowUp"===e.key)r=a-(s||1);else if("Home"===e.key)r=0;else{if("End"!==e.key)return;r=t.length-1}e.preventDefault(),r=(r+t.length)%t.length,n(t[r])}_focus(e){this.updateComplete.then(()=>this.renderRoot.querySelector(e)?.focus())}_pickMode(e,t=!1){this.doc&&this._emit(function(e,t,i){return Ag(e,t).mode===i?e:Vg(e,t,e=>({...e,mode:i}))}(this.doc,this._seed,e),na("live"===e?1061:1056)),t&&this._focus(`.mode-seg [data-mode="${e}"]`)}_renderMode(e){const t=[["baked",na(95),"mdi:repeat"],["live",na(433),"mdi:pulse"]];return Z`<section class="group" aria-labelledby="h-mode">
      <div class="group-head"><h3 id="h-mode">${na(459)}</h3></div>
      <div
        class="seg full mode-seg"
        role="radiogroup"
        aria-label=${na(831)}
        @keydown=${t=>this._radioKeys(t,["baked","live"],e.mode,e=>this._pickMode(e,!0))}
      >
        ${t.map(([t,i,n])=>Z`<button
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
        ${"live"===e.mode?Z`<p class="note is-warn live-warning"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${435}</span></p>`:Z`<p class="help">${na(984)}</p>`}
      </div>
    </section>`}_chips(){return Lg(this._sim)}_setShapes(e,t,i=!1){this.doc&&this._emit(this._on(t=>function(e,t,i){const n=1===i.length?i[0].shape:void 0;return jg(e)||i.length&&(!n||"builtin"in n&&"circle"!==n.builtin)?Vg(e,t,e=>({...e,shapes:i.map(e=>({shape:e.shape,weight:e.weight}))})):function(e,t){const i=ag(e,{});return t?i.particles.shape=t:delete i.particles.shape,i}(e,n&&!("builtin"in n)?n:void 0)}(t,this._seed,e)),t,i)}_setChip(e,t,i,n=!1){const s=this._chips().map((i,n)=>n===e?{shape:t,weight:i.weight}:i);this._setShapes(s,i,n)}_shapeFor(e){return gg(e)?{builtin:e}:this._shapes[e]??Gm[e]}_pickKind(e,t=!1){const i=this._chips()[this._chip];i&&fg(i.shape)!==e&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._setChip(this._chip,this._shapeFor(e),`Use ${e}`)),t&&this._focus(`.shapes.main [data-kind="${e}"]`)}_addShape(){const e=this._chips();e.length>=bg||(this._chip=e.length,this._setShapes([...e,{shape:Ng(e),weight:1}],na(35)))}_removeShape(e){const t=this._chips();t.length<=1||(this._chip=Math.max(0,Math.min(e,t.length-2)),this._setShapes(t.filter((t,i)=>i!==e),na(725)),this._focus(`.schip[data-i="${this._chip}"]`))}_shapeGrid(e,t,i,n){const s=ug.map(e=>e.id),a=e??s[0];return Z`<div
      class="shapes ${t}"
      role="radiogroup"
      aria-label=${i}
      @keydown=${e=>this._radioKeys(e,s,a,e=>n(e,!0),this._cols(e.currentTarget))}
    >
      ${ug.map(t=>Z`<button
          type="button"
          class="dir shape-tile"
          role="radio"
          data-kind=${t.id}
          aria-checked=${t.id===e?"true":"false"}
          tabindex=${t.id===a?0:-1}
          @click=${()=>n(t.id,!1)}
        >
          ${$v(t.id)}<span>${na(t.label)}</span>
        </button>`)}
    </div>`}_renderShape(){const e=this._chips(),t=Math.min(this._chip,e.length-1),i=e[t],n=fg(i.shape),s=e.length>1,a=e.length>=bg;return Z`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">${na(816)}</h3></div>
      <div class="schips" role="group" aria-label=${na(817)}>
        ${e.map((e,i)=>Z`<button
            type="button"
            class="schip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${s?na(822,{n:i+1,shape:vg(e.shape),weight:e.weight}):na(821,{n:i+1,shape:vg(e.shape)})}
            title=${vg(e.shape)}
            @click=${()=>this._chip=i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||!s||(e.preventDefault(),this._removeShape(i))}}
          >
            ${(e=>"emoji"in e?Z`<span class="emo" aria-hidden="true">${e.emoji}</span>`:"icon"in e?Z`<ha-icon class="glyph" icon=${e.icon}></ha-icon>`:$v(fg(e)))(e.shape)}${s?Z`<span>${e.weight}</span>`:Q}
          </button>`)}
        <button type="button" class="schip add" aria-label=${na(35)} title=${a?na(79,{mAX_SHAPES:bg}):na(35)} ?disabled=${a} @click=${()=>this._addShape()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      <div class="chip-edit">
        <div class="chip-edit-head">
          <span>${na(820,{n:t+1})}</span>
          ${s?Z`<button type="button" class="icon-btn sm danger remove-shape" aria-label=${na(726,{n:t+1})} title=${na(725)} @click=${()=>this._removeShape(t)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>`:Q}
        </div>
        ${this._shapeGrid(n,"main",na(820,{n:t+1}),(e,t)=>this._pickKind(e,t))}
        ${"icon"===n?this._renderIcon(i.shape):"emoji"===n?this._renderEmoji(i.shape):"svg"===n?this._renderSvg(i.shape):Q}
        ${s?this._renderWeight(e,t):Q}
      </div>
      ${s?Q:Z`<p class="help">${na(25)}</p>`}
    </section>`}_renderWeight(e,t){const i=e[t].weight;return Z`<div class="field">
      <div class="field-head"><label for="f-weight">${na(1078)}</label></div>
      <input
        id="f-weight"
        class="input"
        type="number"
        inputmode="numeric"
        min=${xg.weight.min}
        max=${xg.weight.max}
        step="1"
        .value=${Ye(String(i))}
        aria-describedby="h-weight"
        @change=${n=>{const s=n.target,a=$g("weight",s.value);void 0!==a&&a!==i?(s.value=String(a),this._setShapes(e.map((e,i)=>i===t?{shape:e.shape,weight:a}:e),na(148))):s.value=String(i)}}
      />
      <p class="help" id="h-weight">${na(22,{percent:Rg(e,t)})}</p>
    </div>`}_renderIcon(e){const t="icon"in e?e.icon:"";return Z`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">${na(383)}</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${t}
        label=${na(638)}
        aria-labelledby="l-icon"
        @value-changed=${e=>{e.stopPropagation();const i=String(e.detail.value??"").trim();(e=>Wm.test(e.trim()))(i)&&i!==t&&this._setChip(this._chip,{icon:i},"Change icon")}}
      ></mc-icon-picker>
    </div>`}_renderEmoji(e){const t="emoji"in e?e.emoji:"",i=this._emojiDraft??t,n=void 0!==this._emojiDraft?Zm(this._emojiDraft):void 0,s=(e,t,i)=>{Zm(e)||e.trim()===this._lastEmoji()||this._setChip(this._chip,{emoji:e.trim()},t,i)};return Z`<div class="field">
      <div class="field-head"><label for="f-emoji">${na(305)}</label></div>
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
          aria-describedby=${n?"e-emoji":Q}
          @input=${e=>{const t=e.target.value;this._emojiDraft=t,s(t,"Change emoji",!0)}}
          @change=${()=>{void 0===this._emojiDraft||Zm(this._emojiDraft)||(this._emojiDraft=void 0),this._settle()}}
        />
      </div>
      ${n?Z`<p class="help error" id="e-emoji" role="alert">${n}</p>`:Q}
      <div class="emoji-grid" role="group" aria-label=${na(188)}>
        ${Um.map(e=>Z`<button
            type="button"
            aria-pressed=${e===t?"true":"false"}
            aria-label=${na(1064,{emoji:e})}
            @click=${()=>{this._emojiDraft=void 0,e!==t&&this._setChip(this._chip,{emoji:e},"Change emoji")}}
          >
            ${e}
          </button>`)}
      </div>
    </div>`}_lastEmoji(){const e=this._chips()[this._chip]?.shape;return e&&"emoji"in e?e.emoji:""}_renderSvg(e){const t="svg"in e?e.svg:"",i=this._svgDraft??t,n=void 0!==this._svgDraft?Ym(this._svgDraft):void 0,s=Ys({...this.doc,particles:{...this._p,sim:void 0,shape:{svg:t}}}),a=/mask: (url\("[^"]*"\))/.exec(s.css)?.[1];return Z`<div class="field">
      <div class="field-head"><label for="f-svg">${na(626)}</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${i}
          aria-invalid=${n?"true":"false"}
          aria-describedby=${n?"e-svg h-svg":"h-svg"}
          @input=${e=>{const i=e.target.value;this._svgDraft=i,Ym(i)||i===t||this._setChip(this._chip,{svg:i},"Edit SVG",!0)}}
          @change=${()=>{void 0===this._svgDraft||Ym(this._svgDraft)||(this._svgDraft=void 0),this._settle()}}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title=${na(982)}>
          ${a?Z`<span style=${`-webkit-mask: ${a} center / contain no-repeat; mask: ${a} center / contain no-repeat;`}></span>`:Q}
        </span>
      </div>
      ${n?Z`<p class="help error" id="e-svg" role="alert">${n}</p>`:Q}
      <p class="help" id="h-svg">${na(657)}</p>
    </div>`}_pickFlow(e,t=!1){this.doc&&this._sim.flow!==e&&this._emit(this._on(t=>{return i=t,n=this._seed,s=e,!jg(i)&&(e=>pg.has(e))(s)?ag(i,{direction:s}):Vg(i,n,e=>({...e,flow:s}));var i,n,s}),"Change flow"),t&&this._focus(`.dir[data-dir="${e}"]`)}_number(e,t,i,n){const s=ng[e],a="count"===e?Math.min(s.max,i+Qg(this.doc)):s.max;return Z`<input
      id=${t}
      class="input"
      type="number"
      inputmode="decimal"
      min=${s.min}
      max=${a}
      step=${"speed"===e?.1:1}
      .value=${String(i)}
      @change=${t=>{const s=t.target,r=sg(e,s.value),o=void 0===r?void 0:Math.min(r,a);void 0!==o&&o!==i?(s.value=String(o),this._patch({[e]:o},n)):s.value=String(i)}}
    />`}_unit(e,t,i,n,s,a){return Z`<mc-unit-field
      .inputId=${t}
      .value=${`${i}${n}`}
      .units=${[n]}
      noCustom
      .label=${s}
      ?disabled=${this.disabled}
      @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??""),r=""===n?a:sg(e,n);void 0!==r&&r!==i?this._patch({[e]:r},s):t.target.revert?.()}}
    ></mc-unit-field>`}_range(e,t,i,n,s,a,r={}){const o=r.scale??1,l=[+(n[0]*o).toFixed(2),+(n[1]*o).toFixed(2)],c=xg[s].step;return Z`<div class="field">
      <div class="field-head"><span class="lbl" id=${`l-${e}`}>${t}</span></div>
      <div class="pair" role="group" aria-labelledby=${`l-${e}`}>
        ${[0,1].map(t=>Z`<div>
            <label class="sub-lbl" for=${`f-${e}-${t}`}>${na(0===t?355:1011)}</label>
            <input
              id=${`f-${e}-${t}`}
              class="input"
              type="number"
              inputmode="decimal"
              min=${xg[s].min}
              max=${xg[s].max}
              step=${c}
              aria-label=${na(0===t?449:380,{noun:i})}
              .value=${Ye(String(l[t]))}
              @change=${e=>{const i=e.target,n=$g(s,i.value);if(void 0===n)return void(i.value=String(l[t]));const r=wg(0===t?[n,l[1]]:[l[0],n]);r[0]!==l[0]||r[1]!==l[1]?a([+(r[0]/o).toFixed(4),+(r[1]/o).toFixed(4)]):i.value=String(l[t])}}
            />
          </div>`)}
      </div>
      ${r.help?Z`<p class="help">${r.help}</p>`:Q}
    </div>`}_slider(e,t,i,n,s,a={}){return Z`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label><span class="val">${n}</span></div>
      <div class="slider">
        <input
          id=${e}
          type="range"
          min="0"
          max="1"
          step=${xg.unit.step}
          .value=${Ye(String(i))}
          aria-valuetext=${n}
          ?disabled=${a.disabled}
          @input=${e=>{const t=$g("unit",e.target.value);void 0!==t&&s(t,!0)}}
          @change=${()=>this._settle()}
        />
      </div>
      ${a.help?Z`<p class="help">${a.help}</p>`:Q}
    </div>`}_renderTiming(e){return Z`<section class="group" aria-labelledby="h-timing">
      <div class="group-head"><h3 id="h-timing">${na(1010)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-speed">${na(447)}</label></div>
        ${this._number("speed","f-speed",e.speed,na(145))}
      </div>
    </section>`}_renderMovement(e,t,i=!0){return Z`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">${na(503)}</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">${na(347)}</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${e=>this._radioKeys(e,cg,t.flow,e=>this._pickFlow(e,!0),this._cols(e.currentTarget))}
        >
          ${cg.map(e=>Z`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${e}
              aria-checked=${e===t.flow?"true":"false"}
              tabindex=${e===t.flow?0:-1}
              title=${na(dg[e])}
              @click=${()=>this._pickFlow(e)}
            >
              <span class="dir-pv ${e}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${na(dg[e])}</span>
            </button>`)}
        </div>
      </div>
      <div class=${i?"pair":""}>
        ${i?Z`<div class="field">
              <div class="field-head"><label for="f-speed">${na(447)}</label></div>
              ${this._number("speed","f-speed",e.speed,na(145))}
            </div>`:Q}
        <div class="field">
          <div class="field-head"><label for="f-spread">${(e=>hg.has(e)?na(708):na("drift"===e||"wave"===e||"wander"===e?874:873))(t.flow)}</label></div>
          ${this._unit("spread","f-spread",e.spread,"%",na(146),100)}
        </div>
      </div>
      ${"rain"===t.flow?this._renderWind(t):Q}
      ${this._range("pspeed",na(641),na(1136),t.ranges.speed,"pspeed",e=>this._editSim(t=>({...t,ranges:{...t.ranges,speed:e}}),"Change particle speed"),{help:na(292)})}
    </section>`}_renderWind(e){const t=(i=e.physics.gravity.angle,tg(-(i>180?i-360:i),xg.wind.min,xg.wind.max)||0);var i;return Z`<div class="field">
      <div class="field-head"><label for="f-wind">${na(1083)}</label></div>
      <input
        id="f-wind"
        class="input"
        type="number"
        inputmode="numeric"
        min=${xg.wind.min}
        max=${xg.wind.max}
        step=${xg.wind.step}
        .value=${Ye(String(t))}
        aria-describedby="h-wind"
        @change=${e=>{const i=e.target,n=$g("wind",i.value);void 0!==n&&n!==t?(i.value=String(n),this._emit(this._on(e=>function(e,t,i){const n=Ag(e,t).physics.gravity;return Dg(e,t,(360-tg(Math.round(i),xg.wind.min,xg.wind.max))%360,n.strength>0?n.strength/yg:.5)}(e,this._seed,n)),"Change wind angle")):i.value=String(t)}}
      />
      <p class="help" id="h-wind">${na(545)}</p>
    </div>`}_setSize(e,t,i){const n=this._p,s=""===t?void 0:parseFloat(t);if(void 0===s||!Number.isFinite(s))return void i.revert?.();const a=function(e,t,i){const n=tg(i,ng.size.min,ng.size.max);return 0===t?[n,Math.max(n,e[1])]:[Math.min(e[0],n),n]}(n.size,e,s);a[0]===n.size[0]&&a[1]===n.size[1]?i.revert?.():this._patch({size:a},"Change size")}_renderLook(e,t){return Z`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">${na(443)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-count">${na(207)}</label></div>
        ${this._number("count","f-count",e.count,na(143))}
        ${this._multi?Z`<p class="help count-help">${na(1048,{parentsLeft:e.count+Qg(this.doc),parents:mc.parents})}</p>`:Q}
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">${na(833)}</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${[0,1].map(t=>Z`<div>
              <label class="sub-lbl" for=${`f-size-${t}`}>${na(0===t?355:1011)}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${t}`}
                .value=${`${e.size[t]}px`}
                .units=${["px"]}
                noCustom
                .label=${na(0===t?840:415)}
                ?disabled=${this.disabled}
                @value-changed=${e=>{e.stopPropagation(),this._setSize(t,String(e.detail.value??""),e.target)}}
              ></mc-unit-field>
            </div>`)}
        </div>
      </div>
      ${this._range("opacity",na(615),na(1130),t.ranges.opacity,"opacity",e=>this._editSim(t=>({...t,ranges:{...t.ranges,opacity:e}}),"Change opacity"),{scale:100})}
      ${this._renderColors(e)}
      <div class="switch-row">
        <span class="txt" id="l-fade">${na(327)}<p class="help">${na(644)}</p></span>
        <button
          type="button"
          class="switch fade"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${e.fade?"true":"false"}
          @click=${()=>this._patch({fade:!e.fade},e.fade?na(1028):na(1029))}
        ></button>
      </div>
    </section>`}_pickLayer(e,t=!1){if(this.doc&&of(this.doc,this._em)!==e){const t=this._name(this._em),i=na("front"===e?1115:1099);this._live=na(1207,{name:t,where:i}),this._emit(function(e,t,i,n){if(!af(e,i)||of(e,i)===n)return e;if(1===Xg(e))return ag(e,{layer:n});const s=nf(e,t);return s[i].layer=n,sf(e,t,s)}(this.doc,this._seed,this._em,e),`${t} ${i}`)}t&&this._focus(`.layer-seg [data-layer="${e}"]`)}_renderPlacement(){const e=of(this.doc,this._em);return Z`<div class="field placement">
      <div class="field-head"><span class="lbl" id="l-place">${na(671)}</span></div>
      <div
        class="seg full layer-seg"
        role="radiogroup"
        aria-label=${na(671)}
        @keydown=${t=>this._radioKeys(t,["back","front"],e,e=>this._pickLayer(e,!0))}
      >
        ${["back","front"].map(t=>Z`<button type="button" role="radio" data-layer=${t} aria-checked=${e===t?"true":"false"} tabindex=${e===t?0:-1} aria-describedby="h-place" @click=${()=>this._pickLayer(t)}>
            ${na("back"===t?98:399)}
          </button>`)}
      </div>
      <p class="help placement-help" id="h-place">${na(400)}</p>
      <p class="em-live" role="status">${this._live}</p>
    </div>`}_addColor(){const e=this._p;if(e.colors.length>=di)return;const t=wv.find(t=>!e.colors.includes(t))??wv[e.colors.length%wv.length];this._color=e.colors.length,this._patch({colors:[...e.colors,t]},"Add colour")}_removeColor(e){const t=this._p.colors.filter((t,i)=>i!==e);this._color=t.length?Math.min(e,t.length-1):-1,this._patch({colors:t},"Remove colour"),this.updateComplete.then(()=>(this.renderRoot.querySelector(`.cchip[data-i="${this._color}"]`)??this.renderRoot.querySelector(".cchip.add"))?.focus())}_renderColors(e){const t=this._color>=0&&this._color<e.colors.length?this._color:-1,i=e.colors.length>=di;return Z`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">${na(187)}</span>
        ${e.colors.length?Z`<span class="val">${na(1174,{count:e.colors.length,colours:di})}</span>`:Q}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${e.colors.map((e,i)=>{const n=eg(e).startsWith("entity");return Z`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${n?na(184,{n:i+1}):na(185,{n:i+1,colour:e})}
            title=${n?na(311):e}
            @click=${()=>this._color=i===t?-1:i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||(e.preventDefault(),this._removeColor(i))}}
          >
            <span style=${`background: ${n?"var(--mc-text-2)":e}`}></span>
            ${n?Z`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>`:Q}
          </button>`})}
        <button type="button" class="cchip add" aria-label=${na(28)} title=${i?na(76,{colours:di}):na(28)} ?disabled=${i} @click=${()=>this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${t>=0?Z`<div class="color-edit">
            <div class="color-edit-head">
              <span>${na(183,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${na(718,{n:t+1})}
                title=${na(716)}
                @click=${()=>this._removeColor(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${na(183,{n:t+1})}
              .value=${eg(e.colors[t])}
              @value-changed=${i=>{i.stopPropagation();const n=Qm(String(i.detail.value??""));if(!n||n===e.colors[t])return;const s=[...e.colors];s[t]=n,this._patch({colors:s},"Change colour")}}
            ></mc-color-picker>
          </div>`:Z`<p class="help">${e.colors.length?na(646):na(561)}</p>`}
    </div>`}_sector(e,t,i,n,s){const a=!!this._open[e];return Z`<div class="sector" data-sector=${e}>
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${a?"true":"false"}
        aria-controls=${a?`sb-${e}`:Q}
        @click=${()=>this._open={...this._open,[e]:!a}}
      >
        <ha-icon icon=${t}></ha-icon>
        <span class="nm">${i}<span class="sr-only">, </span><span class="ssum">${n}</span></span>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${a?Z`<div class="sector-body" id=${`sb-${e}`}>${s()}</div>`:Q}
    </div>`}_renderVariation(e){const t=this._vdoc;return Z`<div class="field">
        <div class="field-head"><label for="f-seed">${na(788)}</label></div>
        <div class="seed-row">
          <input
            id="f-seed"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            max=${xg.seed.max}
            step="1"
            .value=${Ye(String(e.seed))}
            aria-describedby="h-seed"
            @change=${t=>{const i=t.target,n=$g("seed",i.value);void 0===n||n===e.seed&&this._p?.sim?i.value=String(e.seed):this._editSim(e=>({...e,seed:n}),"Change seed")}}
          />
          <button type="button" class="btn btn-secondary btn-sm shuffle-seed" @click=${this._shuffle}><ha-icon icon="mdi:dice-5-outline"></ha-icon>${na(829)}</button>
        </div>
        <p class="help" id="h-seed">${na(980)}</p>
      </div>
      ${this._range("spin",na(859),na(1137),Pg(t,e),"spin",e=>this._emit(this._on(t=>function(e,t,i){const n=wg(i);if(!jg(e)&&n[0]===n[1])return ag(e,{spin:n[0]});const s=kg(e);return Vg(e,t,e=>({...e,ranges:{...e.ranges,spin:[Sg(n[0]/s),Sg(n[1]/s)]}}))}(t,this._seed,e)),"Change spin"),{help:na(293)})}
      ${this._range("delay",na(883),na(1138),e.ranges.delay,"delay",e=>this._editSim(t=>({...t,ranges:{...t.ranges,delay:e}}),"Change start delay"))}
      ${this._range("life",na(427),na(1120),e.ranges.lifetime,"lifetime",e=>this._editSim(t=>({...t,ranges:{...t.ranges,lifetime:e}}),"Change lifetime"),{help:na(13)})}`}_pickGravityAngle(e,t=!1){const i=this._sim,n=i.physics.gravity.strength/yg;this.doc&&e!==i.physics.gravity.angle&&this._emit(this._on(t=>Dg(t,this._seed,e,n)),"Change gravity direction"),t&&this._focus(`.compass [data-angle="${e}"]`)}_renderPhysics(e){const t=e.physics.gravity,i=+(t.strength/yg).toFixed(2),n=+(e.physics.drag/3).toFixed(2),s=+(e.physics.turbulence.strength/150).toFixed(2),a=Fg.map(e=>String(e.angle)),r=Fg.some(e=>e.angle===t.angle);return Z`${this._slider("f-grav",na(361),i,i?i.toFixed(2):na(574),(e,i)=>this._emit(this._on(i=>Dg(i,this._seed,t.angle,e)),"Change gravity",i))}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-gdir">${na(362)}</span></div>
        <div
          class="seg full compass"
          role="radiogroup"
          aria-labelledby="l-gdir"
          @keydown=${e=>this._radioKeys(e,a,String(t.angle),e=>this._pickGravityAngle(+e,!0))}
        >
          ${Fg.map((e,i)=>Z`<button
              type="button"
              role="radio"
              data-angle=${e.angle}
              aria-checked=${e.angle===t.angle?"true":"false"}
              aria-label=${na(e.name)}
              title=${na(e.name)}
              tabindex=${e.angle===t.angle||!r&&0===i?0:-1}
              @click=${()=>this._pickGravityAngle(e.angle)}
            >
              <ha-icon icon=${e.icon}></ha-icon>
            </button>`)}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gangle">${na(62)}</label></div>
        <input
          id="f-gangle"
          class="input"
          type="number"
          inputmode="numeric"
          min="0"
          max="359"
          step="1"
          .value=${Ye(String(t.angle))}
          aria-describedby="h-gangle"
          @change=${e=>{const n=e.target,s=$g("angle",n.value);void 0!==s&&s!==t.angle?this._emit(this._on(e=>Dg(e,this._seed,s,i)),"Change gravity direction"):n.value=String(t.angle)}}
        />
        <p class="help" id="h-gangle">${na(9)}</p>
      </div>
      ${this._slider("f-drag",na(257),n,n.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,drag:+(3*e).toFixed(2)}}),"Change drag",t),{help:na(838)})}
      ${this._slider("f-turb",na(1024),s,s.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,turbulence:{...t.physics.turbulence,strength:+(150*e).toFixed(2)}}}),"Change turbulence",t),{help:na(43)})}`}_setCollider(e,t){this._editSim(i=>({...i,colliders:{...i.colliders,..."content"===e?{content:t?"icon":"none"}:{[e]:t}}}),na(t?1027:1026))}_renderCollisions(e){const t=e.colliders,i=Og(t);return Z`<div class="checks" role="group" aria-label=${na(178)}>
        ${Kg.map(e=>Z`<label class="check">
            <input type="checkbox" data-collider=${e.id} .checked=${Ug(t,e.id)} @change=${t=>this._setCollider(e.id,t.target.checked)} />
            ${na(e.label)}
          </label>`)}
      </div>
      ${"none"!==t.content?Z`<div class="field">
            <div class="field-head"><span class="lbl">${na(194)}</span></div>
            <div
              class="seg full content-seg"
              role="radiogroup"
              aria-label=${na(194)}
              @keydown=${e=>this._radioKeys(e,["icon","text"],t.content,e=>{e!==t.content&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box"),this._focus(`.content-seg [data-content="${e}"]`)})}
            >
              ${["icon","text"].map(e=>Z`<button
                  type="button"
                  role="radio"
                  data-content=${e}
                  aria-checked=${t.content===e?"true":"false"}
                  tabindex=${t.content===e?0:-1}
                  @click=${()=>t.content!==e&&this._editSim(t=>({...t,colliders:{...t.colliders,content:e}}),"Change content box")}
                >
                  ${na("icon"===e?383:924)}
                </button>`)}
            </div>
            <p class="help">${na(943)}</p>
          </div>`:Q}
      ${this._slider("f-bounce",na(115),e.physics.bounce,e.physics.bounce.toFixed(2),(e,t)=>this._editAll(t=>({...t,physics:{...t.physics,bounce:e}}),"Change bounce",t),{help:na(10),disabled:!i})}`}_child(e,t){this._editSim(t=>t.children?{...t,children:{...t.children,...e}}:t,t)}_renderChildren(e){const t=e.children,i=Og(e.colliders),n=Z`<div class="switch-row">
      <span class="txt" id="l-children">${na(855)}<p class="help">${na(154)}</p></span>
      <button
        type="button"
        class="switch children"
        role="switch"
        aria-labelledby="l-children"
        aria-checked=${t?"true":"false"}
        @click=${()=>{t?this._editSim(e=>{const{children:t,...i}=e;return i},"Turn child particles off"):this._editSim(e=>({...e,children:Tg(e)}),"Turn child particles on")}}
      ></button>
    </div>`;if(!t)return n;const s=[["collision",na(605)],["death",na(74)]],a=(e,n=!1)=>{("collision"!==e||i)&&(e!==t.trigger&&this._child({trigger:e,at:void 0},"Change child trigger"),n&&this._focus(`.trigger-seg [data-trigger="${e}"]`))},r=fg(t.shapes[0]?.shape??{builtin:"circle"}),o=!t.colors.length;return Z`${n}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-trigger">${na(854)}</span></div>
        <div
          class="seg full trigger-seg"
          role="radiogroup"
          aria-labelledby="l-trigger"
          @keydown=${e=>this._radioKeys(e,i?["collision","death"]:["death"],t.trigger,e=>a(e,!0))}
        >
          ${s.map(([e,n])=>Z`<button
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
        ${i?Q:Z`<p class="help">${na(1030)}</p>`}
        ${"time"===t.trigger?Z`<p class="help">${na(856,{seconds:t.at??0})}</p>`:Q}
      </div>
      <div class="field">
        <div class="field-head"><label for="f-ccount">${na(208)}</label></div>
        <input
          id="f-ccount"
          class="input"
          type="number"
          inputmode="numeric"
          min="1"
          max=${xg.childCount.max}
          step="1"
          .value=${Ye(String(t.count))}
          @change=${e=>{const i=e.target,n=$g("childCount",i.value);void 0!==n&&n!==t.count?(i.value=String(n),this._child({count:n},"Change child count")):i.value=String(t.count)}}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${na(153)}</span></div>
        ${this._shapeGrid(r,"child",na(153),(e,t)=>{if(e!==r){const t=this._sim.shapes.find(t=>fg(t.shape)===e)?.shape;this._child({shapes:[{shape:t??this._shapeFor(e),weight:1}]},"Change child shape")}t&&this._focus(`.shapes.child [data-kind="${e}"]`)})}
      </div>
      ${this._range("csize",na(834),na(1100),t.size,"childSize",e=>this._child({size:e},"Change child size"))}
      ${this._range("cspeed",na(858),na(1101),t.ranges.speed,"pspeed",e=>this._child({ranges:{...t.ranges,speed:e}},"Change child speed"))}
      <div class="field">
        <div class="field-head"><label for="f-clife">${na(427)}</label></div>
        <input
          id="f-clife"
          class="input"
          type="number"
          inputmode="decimal"
          min=${xg.childLife.min}
          max=${xg.childLife.max}
          step="0.1"
          .value=${Ye(String(t.ranges.lifetime[1]))}
          @change=${e=>{const i=e.target,n=$g("childLife",i.value);void 0===n||n===t.ranges.lifetime[0]&&n===t.ranges.lifetime[1]?i.value=String(t.ranges.lifetime[1]):this._child({ranges:{...t.ranges,lifetime:[n,n]}},"Change child lifetime")}}
        />
      </div>
      <div class="switch-row">
        <span class="txt" id="l-ccolors">${na(1062)}</span>
        <button
          type="button"
          class="switch child-colors"
          role="switch"
          aria-labelledby="l-ccolors"
          aria-checked=${o?"true":"false"}
          @click=${()=>this._child({colors:o?[this._p?.colors[0]??"#ffffff"]:[]},na(o?627:1062))}
        ></button>
      </div>
      ${o?Q:Z`<mc-color-picker
            allowEntity
            label=${na(150)}
            .value=${eg(t.colors[0])}
            @value-changed=${e=>{e.stopPropagation();const i=Qm(String(e.detail.value??""));i&&i!==t.colors[0]&&this._child({colors:[i]},"Change child colour")}}
          ></mc-color-picker>`}`}_renderSectors(e,t){return Z`<div class="sectors">
      ${"all"===t?Q:this._sector("variation","mdi:dice-multiple-outline",na(1075),function(e,t){return na(789,{seed:String(t.seed),span:qg(Pg(e,t),"°")})}(this._vdoc,e),()=>this._renderVariation(e))}
      ${"all"===t?Q:this._sector("physics","mdi:weight",na(662),function(e){const{gravity:t,drag:i,turbulence:n}=e.physics,s=t.strength/yg,a=[s>0?na(363,{strength:s.toFixed(1),direction:Ig(t.angle)}):na(563)];return i>0&&a.push(na(1108,{value:Bg(i/3)})),n.strength>0&&a.push(na(1147,{value:Bg(n.strength/150)})),a.join(", ")}(e),()=>this._renderPhysics(e))}
      ${"emitter"===t?Q:this._sector("collisions","mdi:arrow-collapse-down",na(179),function(e){const t=Kg.filter(t=>Ug(e.colliders,t.id)).map(e=>na(e.label));return t.length?na(1197,{list:t.join(", "),bounce:Bg(e.physics.bounce)}):na(603)}(e),()=>this._renderCollisions(e))}
      ${"all"===t?Q:this._sector("children","mdi:creation-outline",na(151),function(e){const t=e.children;if(!t)return na(603);const i=t.shapes[0]?.shape??{builtin:"circle"},n=fg(i),s="svg"===n?na(767):"emoji"===n?na(1111):vg(i).toLowerCase();return na(1171,{count:t.count,shape:s,trigger:Gg(t)})}(e),()=>Z`<div class="sector-body-lk" ?inert=${this._locks.kids.length>0}>${this._renderChildren(e)}</div>`)}
    </div>`}_renderPreset(e){const t=rg(this.doc),i=t?((e,t)=>e.particles?.intensity??t.defaults.intensity)(this.doc,t):void 0;return Z`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${t?(0,nt.t)(t.name):e.preset}</strong>
          <span class="kind">${t?na(97,{kind:og(t).toLowerCase()}):na(1040)}</span>
        </span>
      </div>
      ${t?Z`<div class="field">
            <div class="field-head"><label for="f-intensity">${((e,t)=>e.intensity.unit?`${t(e.intensity.label)} (${e.intensity.unit})`:t(e.intensity.label))(t,na)}</label></div>
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
              @change=${i=>{const n=i.target.value,s=function(e,t,i){return void 0!==i&&Number.isFinite(i)?ag(e,{intensity:tg(i,t.intensity.min,t.intensity.max)}):ag(e,{intensity:void 0})}(this.doc,t,""===n?void 0:Number(n));s.particles.intensity!==e.intensity?this._emit(s,"Change intensity"):i.target.value=void 0===e.intensity?"":String(e.intensity)}}
            />
            <p class="help">${na(99,{min:t.intensity.min,max:t.intensity.max,intensity:t.defaults.intensity})}</p>
          </div>`:Z`<p class="help error">${na(1006)}</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>${na(196)}
      </button>
      <p class="help">
        ${na(918)}
        ${!t||"count"!==t.particles||t.ring||t.seasonal?na(991):na(960)}
      </p>
    </section>`}get _locks(){const e=this.doc,t=this.layerView;if(!e||!t?.locked.length)return{own:[],kids:[]};const i=e.particles?.sim?Wl(e):["main"],n=this.all&&i.length>1?i:[i[Math.min(this._em,i.length-1)]??"main"];return{own:n.filter(i=>nc(e,t,`emitter:${i}`)).map(e=>`emitter:${e}`),kids:n.filter(i=>nc(e,t,`children:${i}`)).map(e=>`children:${e}`)}}render(){const e=this._p;if(!this.doc||!e)return Z`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>${na(617)}</p></div>`;const t=e.preset?void 0:this._sim;return Z`<style data-pv></style>
      <style data-live></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${this._locks.own.length?pc(this.doc,this.layerView,this._locks.own):Q}
          ${t?this._renderForm(e,t):Z`<div class="lk" ?inert=${this._locks.own.length>0}>${this._renderPreset(e)}</div>`}
        </div>
      </div>`}_renderForm(e,t){const i=this._multi,n=i&&this.all;return Z`${this._renderBar()}
      <div class="lk" ?inert=${this._locks.own.length>0}>
      ${n?Z`<p class="help all-note">${na(990)}</p>
            ${this._renderMode(t)}${this._renderTiming(e)}${this._renderSectors(t,"all")}`:Z`${i?this._renderEmitterHead():Q}${this._renderPlacement()}
            ${i?Q:this._renderMode(t)}${this._renderShape()}${this._renderMovement(e,t,!i)}${this._renderLook(e,t)}${this._renderSectors(t,i?"emitter":void 0)}`}
      </div>`}_renderBar(){const e=this.doc,t=Xg(e),i=ef(e),n=this.all?"all":String(this._em),s=["all",...Array.from({length:t},(e,t)=>String(t))];return Z`<div class="em-bar">
      ${t>1?Z`<div class="em-tabs">${gh({role:"tablist",label:na(303),value:n,items:s.map(e=>({value:e,label:"all"===e?na(49):this._name(+e)})),onChange:e=>{"all"===e?this._select(this._em,!0):this._select(+e),this._focus(`.em-tabs [data-val="${e}"]`)}})}</div>`:Q}
      <button type="button" class="btn btn-secondary btn-sm em-add" ?disabled=${!i||this.disabled} aria-describedby=${i?Q:"h-em-cap"} @click=${this._addEmitter}>
        <ha-icon icon="mdi:plus"></ha-icon>${na(29)}
      </button>
      ${i?Q:Z`<p class="help em-cap" id="h-em-cap">${t>=mc.emitters?na(78,{emitters:mc.emitters}):na(562)}</p>`}
    </div>`}_renderEmitterHead(){const e=this._em,t=this.doc.particles.sim,i=(0===e?t.name:t.emitters?.[e-1]?.name)??"";return Z`<div class="em-head">
      <div class="field em-name-field">
        <div class="field-head"><label for="f-em-name">${na(302)}</label></div>
        <input
          id="f-em-name"
          class="input em-name"
          type="text"
          maxlength=${40}
          placeholder=${df(this.doc,this._seed,e)}
          .value=${Ye(i)}
          @change=${t=>{const i=t.target,n=rf(this.doc,this._seed,e,i.value);i.value=(0===e?n.particles.sim.name:n.particles.sim.emitters?.[e-1]?.name)??"",this._emit(n,"Rename emitter")}}
        />
      </div>
      <button type="button" class="icon-btn sm em-dup" aria-label=${na(285)} title=${na(285)} ?disabled=${!ef(this.doc)||this.disabled} @click=${this._dupEmitter}>
        <ha-icon icon="mdi:content-copy"></ha-icon>
      </button>
      <button type="button" class="icon-btn sm danger em-remove" aria-label=${na(720)} title=${na(720)} ?disabled=${this.disabled} @click=${this._removeEmitter}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`}};function Mv(e){const t=e?(0,St.Rr)(e)[0]:void 0;if(t)return function(e){const t=[{x:e.start[0],y:e.start[1]}];let i=e.start;for(const n of e.segs){const e=t[t.length-1],s={x:n.to[0],y:n.to[1]};n.c1&&n.c2&&!So([i,n.c1,n.c2,n.to])&&(yo(n.c1,i)||(e.out=[n.c1[0],n.c1[1]]),yo(n.c2,n.to)||(s.in=[n.c2[0],n.c2[1]])),t.push(s),i=n.to}const n=e.closed&&e.segs.length>0;if(n&&t.length>1){const e=t.pop();t[0].in=e.in}return{anchors:t,closed:n&&t.length>1}}(t);const i=String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`,n=new RegExp(String.raw`^\s*[Mm]\s*${i}[\s,]*${i}`).exec(e||"");return{anchors:n?[{x:Number(n[1]),y:Number(n[2])}]:[],closed:!1}}kv.styles=[Vu,am,dc,c`
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
    `],xv([_e({attribute:!1})],kv.prototype,"doc",void 0),xv([_e({attribute:!1})],kv.prototype,"hass",void 0),xv([_e({attribute:!1})],kv.prototype,"library",void 0),xv([_e({attribute:!1})],kv.prototype,"time",void 0),xv([_e({type:Boolean,reflect:!0})],kv.prototype,"disabled",void 0),xv([_e({attribute:!1})],kv.prototype,"layerView",void 0),xv([_e({type:Number})],kv.prototype,"emitter",void 0),xv([$e()],kv.prototype,"_shapes",void 0),xv([$e()],kv.prototype,"_svgDraft",void 0),xv([$e()],kv.prototype,"_emojiDraft",void 0),xv([$e()],kv.prototype,"_color",void 0),xv([$e()],kv.prototype,"_chip",void 0),xv([$e()],kv.prototype,"_paused",void 0),xv([$e()],kv.prototype,"_open",void 0),xv([$e()],kv.prototype,"_stats",void 0),xv([$e()],kv.prototype,"_baking",void 0),xv([_e({type:Boolean})],kv.prototype,"all",void 0),xv([$e()],kv.prototype,"_live",void 0),kv=xv([be("mc-anim-particles-editor")],kv);const Sv=zo,Cv=(e,t,i,n,s)=>function(e,t,i,n,s){const a=ko(e),r=a.anchors[t];if(!r)return a;const o=s??(e=>e.kind??(Eo(e)?"smooth":"corner"))(r),l=yo(n,_o(r))?void 0:[n[0],n[1]];r[i]=l;const c="in"===i?"out":"in";if("symmetric"===o)r[c]=l?[2*r.x-l[0],2*r.y-l[1]]:void 0;else if("smooth"===o&&l&&r[c]){const e=Math.hypot(r[c][0]-r.x,r[c][1]-r.y),t=Math.hypot(r.x-l[0],r.y-l[1]);r[c]=[r.x+(r.x-l[0])/t*e,r.y+(r.y-l[1])/t*e]}return a}(e,t,i,n,s?"symmetric":"corner"),Av=new Map;function jv(e,t){let i=Av.get(e);if(i||(i=e?Rs(e,200):[],Av.size>32&&Av.clear(),Av.set(e,i)),!i.length)return;const n=Math.min(1,Math.max(0,Number.isFinite(t)?t:0))*(i.length-1),s=Math.min(i.length-2,Math.floor(n));if(s<0)return i[0];const a=i[s],r=i[s+1],o=n-s;return{t:a.t+(r.t-a.t)*o,x:a.x+(r.x-a.x)*o,y:a.y+(r.y-a.y)*o,angle:a.angle+(r.angle-a.angle)*o}}const zv=[{id:"circle",label:160},{id:"figure-8",label:332},{id:"wave",label:1076},{id:"bounce",label:115},{id:"zigzag",label:1087},{id:"spiral",label:861}];function Ev(e,t,i,n,s,a){const r=(n-i)/s,o=[],l=a?s:s+1;for(let n=0;n<l;n++){const s=i+n*r,[c,d]=e(s),[p,h]=t(s),u=[p*r/3,h*r/3];o.push({x:c,y:d,in:a||n>0?[c-u[0],d-u[1]]:void 0,out:a||n<l-1?[c+u[0],d+u[1]]:void 0})}return{anchors:o,closed:a}}function Vv(e,t=[0,0],i=40){const[n,s]=t,a=i/40,r=2*Math.PI;let o;switch(e){case"circle":{const e=30*a;o=Ev(t=>[n+e*Math.cos(t),s+e*Math.sin(t)],t=>[-e*Math.sin(t),e*Math.cos(t)],0,r,8,!0);break}case"figure-8":{const e=36*a,t=56*a;o=Ev(i=>[n+e*Math.sin(i),s+t*Math.sin(i)*Math.cos(i)],i=>[e*Math.cos(i),t*Math.cos(2*i)],0,r,8,!0);break}case"wave":{const e=80*a,t=20*a,i=2,l=r*i/e;o=Ev(i=>[n-e/2+i,s-t*Math.sin(l*i)],e=>[1,-t*l*Math.cos(l*e)],0,e,4*i,!1);break}case"bounce":{const e=s+20*a,t=[40,25,12].map(e=>e*a),i=[34,26,20].map(e=>e*a);let r=n-40*a;const l=[{x:r,y:e}];t.forEach((t,n)=>{const s=r+i[n],a=[r+i[n]/2,e-2*t];l[l.length-1].out=[r+2/3*(a[0]-r),e+2/3*(a[1]-e)],l.push({x:s,y:e,in:[s+2/3*(a[0]-s),e+2/3*(a[1]-e)]}),r=s}),o={anchors:l,closed:!1};break}case"zigzag":{const e=[],t=6;for(let i=0;i<=t;i++)e.push({x:n-40*a+80*a*i/t,y:s+(i%2?-15:15)*a});o={anchors:e,closed:!1};break}case"spiral":{const e=2.5,t=r*e,i=40*a/t;o=Ev(e=>[n+i*e*Math.cos(e),s+i*e*Math.sin(e)],e=>[i*(Math.cos(e)-e*Math.sin(e)),i*(Math.sin(e)+e*Math.cos(e))],0,t,4*e,!1);break}}return Sv(o)}const Lv=e=>"particles"===e.subject&&"percent"===e.units?[50,50]:[0,0];var Pv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Dv=[{value:"element",label:300,icon:"mdi:square-rounded-outline"},{value:"icon",label:383,icon:"mdi:star-outline"},{value:"particles",label:642,icon:"mdi:scatter-plot-outline"}],Hv=[{value:"percent",label:2},{value:"px",label:670}],Rv={count:3,size:[6,12],colors:[]},Nv={d:"",units:"percent",follow_rotation:!1,subject:"element"},Ov=new Map;let Tv=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1}get _spec(){return this.doc?.path??Nv}_locked(e){return!!this.layerView?.locked.includes(e)}_emit(e,t){if(!this.doc||this.disabled)return;const i={...this.doc,path:e};this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_set(e,t){this._emit({...this._spec,...e},t)}_edit(e,t){this._set({d:zo(e(Mv(this._spec.d)))},t)}_template(e,t){const i=this._spec;this._set({d:Vv(e,Lv({subject:i.subject,units:"percent"})),units:"percent"},`Use ${t.toLowerCase()} path`)}_subject(e){const t=this._spec;if(e===t.subject)return;const i={subject:e},n="particles"===t.subject,s="particles"===e;if("percent"===t.units&&n!==s&&t.d){const e=s?50:-50;i.d=zo(((e,t,i)=>function(e,t){const i=(e,i)=>[t[0]*e+t[2]*i+t[4],t[1]*e+t[3]*i+t[5]],n=e=>e?i(e[0],e[1]):void 0;return{anchors:e.anchors.map(e=>{const[t,s]=i(e.x,e.y),a={x:t,y:s,in:n(e.in),out:n(e.out)};return e.kind&&(a.kind=e.kind),a}),closed:e.closed}}(e,[1,0,0,1,t,i]))(Mv(t.d),e,e))}s&&!t.particles&&(i.particles={...Rv,size:[...Rv.size],colors:[]}),this._set(i,"What moves")}_look(e,t){const i=this._spec.particles??Rv;this._set({particles:{...i,size:[...i.size],colors:[...i.colors],...e}},t)}_seg(e,t,i,n){return Z`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.value===i),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=t[(s+a[e.key]+t.length)%t.length].value,o=e.currentTarget;n(r),requestAnimationFrame(()=>o.querySelector(`[data-val="${r}"]`)?.focus())}}>
      ${t.map(e=>{const t=e.value===i;return Z`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          ?disabled=${this.disabled}
          @click=${()=>n(e.value)}
        >
          ${e.icon?Z`<ha-icon icon=${e.icon}></ha-icon>`:Q}${na(e.label)}
        </button>`})}
    </div>`}_switch(e,t,i,n,s,a=!1){return Z`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        <p class="help">${t}</p>
      </div>
      <button
        type="button"
        class="switch ${s}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||a}
        @click=${n}
      ></button>
    </div>`}_templates(){return Z`<div class="tiles">
      ${zv.map(e=>{const t=function(e){let t=Ov.get(e);if(!t){const i=Vv(e),n=function(e){const t=[];for(const i of e.anchors)t.push(_o(i)),i.in&&t.push(i.in),i.out&&t.push(i.out);if(!t.length)return;const i=t.map(e=>e[0]),n=t.map(e=>e[1]),s=Math.min(...i),a=Math.min(...n);return{x:s,y:a,w:Math.max(...i)-s,h:Math.max(...n)-a}}(Mv(i))??{x:-40,y:-40,w:80,h:80},s=6;let a=n.w+2*s,r=n.h+2*s;const o=44/30;a/r<o?a=r*o:r=a/o;const l=n.x+n.w/2,c=n.y+n.h/2;t={d:i,box:`${(l-a/2).toFixed(2)} ${(c-r/2).toFixed(2)} ${a.toFixed(2)} ${r.toFixed(2)}`},Ov.set(e,t)}return t}(e.id),i=Mv(t.d).anchors[0];return Z`<button
          type="button"
          class="tile"
          data-template=${e.id}
          title=${na(739,{name:na(e.label).toLowerCase()})}
          ?disabled=${this.disabled}
          @click=${()=>this._template(e.id,na(e.label))}
        >
          <svg viewBox=${t.box} aria-hidden="true">
            <path d=${t.d}></path>
            ${i?Y`<circle cx=${i.x} cy=${i.y} r=${t.box.split(" ").map(Number)[2]/18}></circle>`:Q}
          </svg>
          <span>${na(e.label)}</span>
        </button>`})}
    </div>`}_pathSection(e){const t=e.anchors.length,i=e.anchors.filter(e=>e.in||e.out).length,n=t>1&&!this.disabled;return Z`<section class="sec" aria-label=${na(654)}><div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${na(884)}</span></div>
        ${this._templates()}
      </div>
      <div class="stats" aria-live="polite">
        <span class="chip">${na(1167,{count:t})}</span>
        <span class="chip">${e.closed?na(173):na(616)}</span>
        ${t>1?Z`<span class="chip">${na(0===i?911:i===t?214:458)}</span>`:Q}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary btn-sm smooth-all" ?disabled=${!n} @click=${()=>this._edit(Oo,"Smooth all points")}>
          <ha-icon icon="mdi:vector-curve"></ha-icon>${na(842)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm straighten-all" ?disabled=${!n} @click=${()=>this._edit(To,"Straighten all points")}>
          <ha-icon icon="mdi:vector-polyline"></ha-icon>${na(912)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm reverse" ?disabled=${!n} @click=${()=>this._edit(Fo,"Reverse direction")}>
          <ha-icon icon="mdi:swap-horizontal"></ha-icon>${na(751)}
        </button>
      </div>
      ${this._switch(na(174),na(963),e.closed,()=>{t>1&&this._edit(t=>Io(t,!e.closed),e.closed?na(619):na(172))},"closed-switch",t<2)}
      <ul class="tips help">
        <li>${na(166)}</li>
        <li>${na(259)} ${aa(1183,{key:Z`<kbd>Alt</kbd>`})}</li>
        <li>${na(254)} ${aa(1184,{key:Z`<kbd>${na(231)}</kbd>`})}</li>
        <li>${"px"===this._spec.units?aa(691,{key:Z`<kbd>Shift</kbd>`}):aa(692,{key:Z`<kbd>Shift</kbd>`})}</li>
      </ul>
      <div class="foot">
        <button type="button" class="btn btn-text btn-sm btn-danger clear" ?disabled=${0===t||this.disabled} @click=${()=>this._set({d:""},"Clear path")}>
          <ha-icon icon="mdi:eraser"></ha-icon>${na(161)}
        </button>
      </div>
    </div></section>`}_motionSection(){const e=this._spec;return Z`<section class="sec" aria-labelledby="pe-motion">
      <h3 id="pe-motion">${na(463)}</h3>
      <div class="lk-subject" ?inert=${this._locked("subject")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${na(1079)}</span></div>
        ${this._seg(na(1079),Dv,e.subject,e=>this._subject(e))}
        <p class="help">
          ${"particles"===e.subject?na(647):"icon"===e.subject?na(962):na(989)}
        </p>
      </div>
      </div>
      <div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${na(1039)}</span></div>
        ${this._seg(na(1039),Hv,e.units,e=>this._set({units:e},"Units"))}
        <p class="help">${"percent"===e.units?na(687):na(688)}</p>
      </div>
      ${this._switch(na(350),na(1031),e.follow_rotation,()=>this._set({follow_rotation:!e.follow_rotation},"Follow rotation"),"follow-switch")}
      </div>
    </section>`}_particlesSection(){const e=this._spec.particles??Rv,[t,i]=e.size,n=(n,s,a)=>Z`<div class="field">
      <div class="field-head"><span class="lbl">${s}</span></div>
      <mc-unit-field
        .value=${`${e.size[n]}px`}
        .label=${s}
        .units=${["px"]}
        .noCustom=${!0}
        .inputId=${a}
        .disabled=${this.disabled}
        @value-changed=${e=>{e.stopPropagation();const s=parseFloat(String(e.detail.value));if(!Number.isFinite(s))return;const a=Math.min(200,Math.max(1,Math.round(s))),r=0===n?[a,Math.max(a,i)]:[Math.min(t,a),a];this._look({size:r},"Particle size")}}
      ></mc-unit-field>
    </div>`;return Z`<section class="sec particles" aria-labelledby="pe-particles">
      <h3 id="pe-particles">${na(642)}</h3>
      <div class="field">
        <div class="field-head"><label for="pe-count">${na(207)}</label></div>
        <input
          class="input"
          id="pe-count"
          type="number"
          min="1"
          max=${ci}
          step="1"
          inputmode="numeric"
          .value=${String(e.count)}
          ?disabled=${this.disabled}
          @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isInteger(i)&&i>=1&&i<=ci&&this._look({count:i},"Particle count")}}
        />
        <p class="help">${na(852,{particles:ci})}</p>
      </div>
      <div class="pair">${n(0,na(839),"pe-size-min")} ${n(1,na(414),"pe-size-max")}</div>
      <div class="field">
        <div class="field-head"><span class="lbl">${na(187)}</span></div>
        <div class="colors">
          ${e.colors.map((t,i)=>Z`<div class="color-row">
              <mc-color-picker
                .value=${t}
                .label=${na(182,{i:i+1})}
                @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??"").trim();if(!n)return;const s=[...e.colors];s[i]=n,this._look({colors:s},"Particle colour")}}
              ></mc-color-picker>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${na(717,{i:i+1})}
                title=${na(716)}
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:e.colors.filter((e,t)=>t!==i)},"Remove particle colour")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`)}
        </div>
        ${e.colors.length?Q:Z`<p class="help">${na(575)}</p>`}
        ${e.colors.length<di?Z`<div>
              <button
                type="button"
                class="btn btn-text btn-sm add-color"
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:[...e.colors,e.colors[e.colors.length-1]??"#ffc107"]},"Add particle colour")}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${na(28)}
              </button>
            </div>`:Q}
      </div>
    </section>`}render(){const e=Mv(this._spec.d),t=["path","subject"].filter(e=>this._locked(e));return Z`<div class="ed">
      ${t.length?pc(this.doc,this.layerView,t):Q}
      ${this._pathSection(e)} ${this._motionSection()} ${"particles"===this._spec.subject?Z`<div class="lk-path" ?inert=${this._locked("path")}>${this._particlesSection()}</div>`:Q}
    </div>`}};Tv.styles=[Vu,dc,c`
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
    `],Pv([_e({attribute:!1})],Tv.prototype,"doc",void 0),Pv([_e({attribute:!1})],Tv.prototype,"hass",void 0),Pv([_e({attribute:!1})],Tv.prototype,"library",void 0),Pv([_e({type:Number})],Tv.prototype,"time",void 0),Pv([_e({type:Boolean,reflect:!0})],Tv.prototype,"disabled",void 0),Pv([_e({attribute:!1})],Tv.prototype,"layerView",void 0),Tv=Pv([be("mc-anim-path-editor")],Tv);var Fv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Iv=e=>"px"===e?10:5;let Bv=class extends fe{get selected(){return this._sel}select(e){this._sel=e>=0&&e<this._path.anchors.length?e:-1}constructor(){super(),this.time=0,this.disabled=!1,this.closed=!1,this._sel=-1,this._free=!1,this._announce="",this._path={anchors:[],closed:!1},this.addEventListener("keydown",e=>this._onKey(e))}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>{const e=this.getBoundingClientRect();e.width&&e.height&&(e.width!==this._box?.width||e.height!==this._box?.height)&&(this._box={width:e.width,height:e.height})}),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._endDrag(!0)}willUpdate(e){if(e.has("doc")){const e=this.doc?.path?.d??"";e!==this._d&&(this._path=Mv(e),this._d=e,this._sel>=this._path.anchors.length&&(this._sel=-1),this._drag&&this._endDrag(!1))}this.closed=this._path.closed}_view(){const e=this.stageRect?.width||this._box?.width||360,t=this.stageRect?.height||this._box?.height||120,i=this.doc?.path,n="px"===i?.units;if("particles"===i?.subject)return{w:e,h:t,ox:0,oy:0,sx:n?1:e/100,sy:n?1:t/100};const s=this.subjectRect&&this.subjectRect.width>0&&this.subjectRect.height>0?this.subjectRect:{x:0,y:0,width:e,height:t};return{w:e,h:t,ox:s.x+s.width/2,oy:s.y+s.height/2,sx:n?1:s.width/100,sy:n?1:s.height/100}}_toStage(e,t){return[e.ox+t[0]*e.sx,e.oy+t[1]*e.sy]}_toDoc(e,t){return[(t[0]-e.ox)/e.sx,(t[1]-e.oy)/e.sy]}_local(e,t){const i=this.getBoundingClientRect(),n=i.width?t.w/i.width:1,s=i.height?t.h/i.height:1;return[(e.clientX-i.left)*n,(e.clientY-i.top)*s]}_snapPt(e,t){if(t)return[Math.round(100*e[0])/100,Math.round(100*e[1])/100];const i=Iv(this.doc?.path?.units);return[Bo(e[0],i),Bo(e[1],i)]}_emit(e,t,i=!1){if(!this.doc)return;const n=zo(e);this._path=e,this._d=n,this.closed=e.closed;const s={...this.doc,path:{...this.doc.path??{units:"percent",follow_rotation:!1,subject:"element"},d:n}};i||(this._announce=t),this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:s,label:t,transient:!0}:{doc:s,label:t}})),this.requestUpdate()}_press(e,t,i){e.preventDefault(),e.stopPropagation();const n=this.renderRoot.querySelector("svg");try{n?.setPointerCapture(e.pointerId)}catch{}this._drag={...t,pointerId:e.pointerId,start:this._local(e,i),moved:!1},this._free=e.shiftKey}_onAnchorDown(e,t){if(this.disabled||e.button>0)return;const i=this._view(),n=e.timeStamp||performance.now();if(this._lastTap&&this._lastTap.index===t&&n-this._lastTap.at<350)return e.preventDefault(),e.stopPropagation(),this._lastTap=void 0,void this._toggleSmooth(t);this._lastTap={index:t,at:n};const s=this._sel;this._sel=t;const a=this._path.anchors[t],r=this._toDoc(i,this._local(e,i));this._press(e,{kind:"anchor",index:t,grab:[a.x-r[0],a.y-r[1]],added:!1,label:na(481),prevSel:s},i),e.currentTarget?.focus?.({preventScroll:!0})}_onHandleDown(e,t,i){if(this.disabled||e.button>0)return;const n=this._view(),s=this._path.anchors[t]?.[i];if(!s)return;const a=this._toDoc(n,this._local(e,n));this._press(e,{kind:"handle",index:t,which:i,grab:[s[0]-a[0],s[1]-a[1]],added:!1,label:na(477),prevSel:this._sel},n)}_onLineDown(e){if(this.disabled||e.button>0)return;const t=this._view(),i=this._toDoc(t,this._local(e,t)),n=function(e,t,i=[1,1]){const n=Co(e);if(!n)return;const s=e=>Math.hypot((e[0]-t[0])*i[0],(e[1]-t[1])*i[1]);let a;for(let t=0;t<n;t++){const i=Ao(e,t),n=32;let r=0,o=1/0;for(let e=0;e<=n;e++){const t=s(Vo(i,e/n));t<o&&(o=t,r=e/n)}let l=1/n;for(let e=0;e<12;e++){l/=2;for(const e of[r-l,r+l]){if(e<0||e>1)continue;const t=s(Vo(i,e));t<o&&(o=t,r=e)}}(!a||o<a.dist)&&(a={seg:t,t:r,point:Vo(i,r),dist:o})}return a}(this._path,i,[t.sx,t.sy]);if(!n)return;const{path:s,index:a}=Po(this._path,n.seg,n.t);a<0||(this._sel=a,this._lastTap={index:a,at:e.timeStamp||performance.now()},this._press(e,{kind:"anchor",index:a,grab:[0,0],added:!0,label:na(32),prevSel:a},t),this._emit(s,"Add point",!0))}_onStageDown(e){if(this.disabled||e.button>0)return;if(this.focus({preventScroll:!0}),this._path.closed)return void(this._sel=-1);const t=this._view(),i=this._snapPt(this._toDoc(t,this._local(e,t)),e.shiftKey),n=0===this._sel&&this._path.anchors.length>1,{path:s,index:a}=Do(this._path,i,n);a<0||(this._sel=a,this._lastTap={index:a,at:e.timeStamp||performance.now()},this._press(e,{kind:"anchor",index:a,grab:[0,0],added:!0,label:na(32),prevSel:a},t),this._emit(s,"Add point",!0))}_onMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=this._view(),n=this._local(e,i);if(!t.moved&&Math.hypot(n[0]-t.start[0],n[1]-t.start[1])<3)return;t.moved=!0,this._lastTap=void 0,this._free=e.shiftKey;const s=this._toDoc(i,n),a=this._snapPt([s[0]+t.grab[0],s[1]+t.grab[1]],e.shiftKey);let r;if("anchor"===t.kind)r=Ro(this._path,t.index,a[0],a[1]);else{const i=this._path.anchors[t.index];r=Cv(this._path,t.index,t.which,a,Eo(i)&&!e.altKey)}this._emit(r,t.label,!0)}_onUp(e){const t=this._drag;if(t&&e.pointerId===t.pointerId){if(!t.moved&&!t.added&&"anchor"===t.kind&&!this._path.closed&&this._path.anchors.length>2){const e=this._path.anchors.length-1;if(0===t.index&&t.prevSel===e||t.index===e&&0===t.prevSel)return this._drag=void 0,this._free=!1,void this._emit(Io(this._path,!0),"Close path")}this._endDrag(!0)}}_endDrag(e){const t=this._drag;if(!t)return;this._drag=void 0,this._free=!1;const i=this.renderRoot?.querySelector("svg");try{i?.hasPointerCapture?.(t.pointerId)&&i.releasePointerCapture(t.pointerId)}catch{}e&&(t.moved||t.added)?this._emit(this._path,t.label):this.requestUpdate()}_toggleSmooth(e){const t=this._path.anchors[e];if(!t)return;const i=!(!t.in&&!t.out);this._sel=e,this._emit(function(e,t){const i=ko(e),n=i.anchors[t];return n?(n.in||n.out?(n.in=void 0,n.out=void 0):No(e,i,t),i):i}(this._path,e),na(i?204:843))}deleteSelected(){const e=this._sel;if(e<0||this.disabled)return;const t=Ho(this._path,e);this._sel=t.anchors.length?Math.max(0,e-1):-1,this._emit(t,"Delete point"),this.updateComplete.then(()=>this._focusAnchor(this._sel))}toggleClosed(){if(this.disabled||this._path.anchors.length<2)return;const e=!this._path.closed;this._emit(Io(this._path,e),na(e?172:619))}_focusAnchor(e){e<0||this.renderRoot.querySelector(`.anchor[data-i="${e}"]`)?.focus({preventScroll:!0})}_onKey(e){if(this.disabled)return;if("Escape"===e.key)return this._drag&&this._endDrag(!0),void(this._sel>=0&&(e.preventDefault(),e.stopPropagation(),this._sel=-1,this.focus({preventScroll:!0})));const t=this._sel;if(t<0)return;if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),void this.deleteSelected();if("Enter"===e.key||" "===e.key)return e.preventDefault(),void this._toggleSmooth(t);const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i)return;e.preventDefault();const n=e.shiftKey?Iv(this.doc?.path?.units):1,s=this._path.anchors[t];this._emit(Ro(this._path,t,Math.round(100*(s.x+i[0]*n))/100,Math.round(100*(s.y+i[1]*n))/100),"Nudge point")}_grid(e){const t=Iv(this.doc?.path?.units),i=[],n=t*e.sx,s=t*e.sy;if(n>=4)for(let t=e.ox%n;t<=e.w+.01;t+=n)i.push(`M${t.toFixed(1)} 0V${e.h}`);if(s>=4)for(let t=e.oy%s;t<=e.h+.01;t+=s)i.push(`M0 ${t.toFixed(1)}H${e.w}`);return Y`<path class="grid" d=${i.join("")}></path>`}_stageD(e){const t=t=>this._toStage(e,t);return zo({closed:this._path.closed,anchors:this._path.anchors.map(e=>{const[i,n]=t([e.x,e.y]);return{x:i,y:n,in:e.in?t(e.in):void 0,out:e.out?t(e.out):void 0}})})}_arrows(e){const t=this._d??"";return this._path.anchors.length<2||!t?[]:[.25,.5,.75].map(i=>{const n=jv(t,i-.01),s=jv(t,i+.01),a=jv(t,i);if(!n||!s||!a)return Y``;const r=this._toStage(e,[n.x,n.y]),o=this._toStage(e,[s.x,s.y]),l=this._toStage(e,[a.x,a.y]);if(Math.hypot(o[0]-r[0],o[1]-r[1])<.5)return Y``;const c=180*Math.atan2(o[1]-r[1],o[0]-r[0])/Math.PI;return Y`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${l[0].toFixed(1)} ${l[1].toFixed(1)}) rotate(${c.toFixed(1)})"></path>`})}get _u(){const e=this.stage?.scale;return e&&e>0&&e<1?1/e:1}_handles(e){const t=this._sel,i=this._path.anchors[t];if(!i)return Q;const n=this._toStage(e,[i.x,i.y]),s=this._u,a=a=>{const r=i[a];if(!r)return Q;const o=this._toStage(e,r),l="handle"===this._drag?.kind&&this._drag.which===a;return Y`
        <line class="hline" x1=${n[0]} y1=${n[1]} x2=${o[0]} y2=${o[1]}></line>
        <g class="handle ${l?"active":""}" data-which=${a} @pointerdown=${e=>this._onHandleDown(e,t,a)}>
          <circle cx=${o[0]} cy=${o[1]} r=${12*s} fill="transparent"></circle>
          <circle class="knob" cx=${o[0]} cy=${o[1]} r=${4.5*s}></circle>
        </g>`};return Y`${a("in")}${a("out")}`}_anchors(e){const t=this._path.anchors.length,i=t-1,n=!this._path.closed&&t>2&&(0===this._sel||this._sel===i),s=this._u;return this._path.anchors.map((a,r)=>{const[o,l]=this._toStage(e,[a.x,a.y]),c=!(!a.in&&!a.out),d=r===this._sel,p=n&&(0===this._sel&&r===i||this._sel===i&&0===r),h=na(686,{i:r+1,n:t,start:0===r?na(6):"",kind:na(c?1135:1103),x:Math.round(10*a.x)/10,y:Math.round(10*a.y)/10});return Y`<g
        class="anchor ${d?"sel":""} ${0===r?"start":""} ${p?"closable":""}"
        data-i=${r}
        data-kind=${c?"smooth":"corner"}
        tabindex=${this.disabled?-1:0}
        role="button"
        aria-pressed=${d?"true":"false"}
        aria-label=${h}
        @pointerdown=${e=>this._onAnchorDown(e,r)}
        @focus=${()=>{this._drag||(this._sel=r)}}
      >
        <circle cx=${o} cy=${l} r=${13*s} fill="transparent"></circle>
        <circle class="ring" cx=${o} cy=${l} r=${10*s}></circle>
        ${c?Y`<circle class="mark" cx=${o} cy=${l} r=${5.5*s}></circle>`:Y`<rect class="mark" x=${o-5*s} y=${l-5*s} width=${10*s} height=${10*s} rx=${1.5*s}></rect>`}
      </g>`})}_dot(e,t,i,n,s){const a=jv(t,i);if(!a)return Q;const[r,o]=this._toStage(e,[a.x,a.y]);let l=Q;if(n){const n=jv(t,Math.max(0,i-.005)),s=jv(t,Math.min(1,i+.005));if(n&&s){const t=this._toStage(e,[n.x,n.y]),i=this._toStage(e,[s.x,s.y]),a=180*Math.atan2(i[1]-t[1],i[0]-t[0])/Math.PI;l=Y`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${a.toFixed(1)})"></path>`}}return Y`<g class="subject" data-k=${s} transform="translate(${r.toFixed(1)} ${o.toFixed(1)})${1!==this._u?` scale(${this._u})`:""}">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${l}
    </g>`}_subject(e){const t=this._d??"";if(this._path.anchors.length<2)return Q;const i=this.doc?.path,n=!!i?.follow_rotation,s=Math.min(1,Math.max(0,Number.isFinite(this.time)?this.time:0)),a="particles"===i?.subject?Math.min(60,Math.max(1,i.particles?.count??3)):1;return Array.from({length:a},(i,r)=>this._dot(e,t,0===r?s:(s+r/a)%1,n,r))}render(){const e=this._view(),t=this._path.anchors.length,i=this._stageD(e),n=t>1?this._toStage(e,[this._path.anchors[0].x,this._path.anchors[0].y]):void 0,s=[this._drag?"dragging":"",this._free?"free":""].join(" ");return Z`
      <svg
        class=${s}
        style="--u: ${this._u}"
        viewBox="0 0 ${e.w} ${e.h}"
        preserveAspectRatio="none"
        role="group"
        aria-label=${na(465)}
        @pointerdown=${e=>this._onStageDown(e)}
        @pointermove=${e=>this._onMove(e)}
        @pointerup=${e=>this._onUp(e)}
        @pointercancel=${()=>this._endDrag(!0)}
        @lostpointercapture=${e=>{this._drag&&e.pointerId===this._drag.pointerId&&this._endDrag(!0)}}
      >
        <rect class="bg" x="0" y="0" width=${e.w} height=${e.h}></rect>
        ${this._grid(e)}
        <path class="origin" d="M${e.ox-6} ${e.oy}h12M${e.ox} ${e.oy-6}v12"></path>
        ${i?Y`<path class="casing" d=${i}></path><path class="line" d=${i}></path>
              <path class="hit" d=${i} @pointerdown=${e=>this._onLineDown(e)}></path>`:Q}
        ${this._arrows(e)} ${this._subject(e)} ${this._handles(e)} ${this._anchors(e)}
        ${n?Y`<text class="tag" x=${n[0]+10} y=${n[1]-9}>${na(881)}</text>`:Q}
      </svg>
      ${0!==t||this.disabled?1!==t||this.disabled?Q:Z`<p class="hint">${na(168)}</p>`:Z`<p class="hint">${na(169)}</p>`}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `}firstUpdated(){this.hasAttribute("tabindex")||(this.tabIndex=-1)}};Bv.styles=c`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 40px;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      --po-accent: var(--primary-color, #03a9f4);
      --po-ink: var(--primary-text-color, #212121);
      --po-surface: var(--card-background-color, #fff);
      --po-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.55;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
      cursor: crosshair;
    }
    :host([closed]) svg {
      cursor: default;
    }
    .bg {
      fill: transparent;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--po-ink) 9%, transparent);
      stroke-width: 1;
      pointer-events: none;
      transition: stroke 0.15s ease-out;
    }
    .dragging .grid {
      stroke: color-mix(in srgb, var(--po-ink) 16%, transparent);
    }
    .free .grid {
      stroke: transparent;
    }
    .origin {
      fill: none;
      stroke: color-mix(in srgb, var(--po-ink) 45%, transparent);
      stroke-width: 1.25;
      pointer-events: none;
    }
    .casing {
      fill: none;
      stroke: color-mix(in srgb, var(--po-surface) 85%, transparent);
      stroke-width: calc(6px * var(--u, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .line {
      fill: none;
      stroke: var(--po-accent);
      stroke-width: calc(2px * var(--u, 1));
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .hit {
      fill: none;
      stroke: transparent;
      stroke-width: calc(16px * var(--u, 1));
      pointer-events: stroke;
      cursor: copy;
    }
    .arrow {
      fill: var(--po-accent);
      stroke: var(--po-surface);
      stroke-width: 1;
      pointer-events: none;
    }
    .hline {
      stroke: color-mix(in srgb, var(--po-ink) 55%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .handle {
      cursor: grab;
    }
    .handle .knob {
      fill: var(--po-surface);
      stroke: var(--po-ink);
      stroke-width: calc(1.5px * var(--u, 1));
    }
    .handle:hover .knob,
    .handle.active .knob {
      fill: var(--po-accent);
      stroke: var(--po-surface);
    }
    .anchor {
      cursor: move;
      outline: none;
    }
    .anchor .mark {
      fill: var(--po-surface);
      stroke: var(--po-accent);
      stroke-width: calc(2px * var(--u, 1));
      transition: fill 0.15s ease-out;
    }
    .anchor.start .mark {
      fill: var(--po-accent);
      stroke: var(--po-surface);
    }
    .anchor:hover .mark {
      fill: color-mix(in srgb, var(--po-accent) 30%, var(--po-surface));
    }
    .anchor.sel .mark {
      fill: var(--po-fill);
      stroke: var(--po-surface);
    }
    .anchor .ring {
      fill: none;
      stroke: transparent;
      stroke-width: 2;
    }
    .anchor.sel .ring {
      stroke: var(--po-accent);
    }
    .anchor:focus-visible .ring {
      stroke: var(--po-accent);
      stroke-dasharray: 3 2;
    }
    .closable .mark {
      stroke-width: 3;
    }
    .tag {
      font:
        500 10px/1 Roboto,
        system-ui,
        sans-serif;
      fill: var(--po-ink);
      paint-order: stroke;
      stroke: var(--po-surface);
      stroke-width: 3px;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .subject {
      pointer-events: none;
    }
    /* the subject: neutral, so it never reads as a selected (accent) point */
    .subject .body {
      fill: color-mix(in srgb, var(--po-ink) 14%, transparent);
      stroke: color-mix(in srgb, var(--po-ink) 75%, transparent);
      stroke-width: 1.5;
      stroke-dasharray: 3 2;
    }
    .subject .core {
      fill: var(--po-ink);
    }
    .subject .heading {
      fill: var(--po-ink);
    }
    .hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
      padding: 6px 12px;
      border-radius: 9999px;
      background: var(--po-surface);
      color: var(--po-ink);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.16),
        0 2px 6px rgba(0, 0, 0, 0.08);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    @media (prefers-reduced-motion: reduce) {
      .grid,
      .anchor .mark {
        transition: none;
      }
    }
  `,Fv([_e({attribute:!1})],Bv.prototype,"doc",void 0),Fv([_e({attribute:!1})],Bv.prototype,"stageRect",void 0),Fv([_e({attribute:!1})],Bv.prototype,"subjectRect",void 0),Fv([_e({type:Number})],Bv.prototype,"time",void 0),Fv([_e({type:Boolean,reflect:!0})],Bv.prototype,"disabled",void 0),Fv([_e({attribute:!1})],Bv.prototype,"stage",void 0),Fv([_e({attribute:!1})],Bv.prototype,"hass",void 0),Fv([_e({attribute:!1})],Bv.prototype,"library",void 0),Fv([_e({type:Boolean,reflect:!0})],Bv.prototype,"closed",void 0),Fv([$e()],Bv.prototype,"_sel",void 0),Fv([$e()],Bv.prototype,"_box",void 0),Fv([$e()],Bv.prototype,"_free",void 0),Fv([$e()],Bv.prototype,"_announce",void 0),Bv=Fv([be("mc-anim-path-overlay")],Bv);const qv=e=>Math.round(1e3*e)/1e3;function Kv(e){return!!e&&("keyframes"===e.kind||"path"===e.kind&&"particles"!==e.path?.subject)}function Uv(e){if(!e)return;const t=parseFloat(e);return Number.isFinite(t)?/ms\s*$/i.test(e)?t/1e3:t:void 0}function Gv(e,t,i){const n=(e??"").trim();if(!n)return{status:"invalid",name:na(555),kind:"",problem:na(663)};if(si(n)){const e=ai(n);if(i&&e===i)return{status:"invalid",name:e,kind:na(802),problem:na(18)};const s=t?.[e];if(!s)return{status:"missing",name:e,kind:"",problem:na(586)};if("keyframes"===s.kind)return{status:"ok",name:s.name||e,kind:na(411),defaultDuration:s.duration};if("path"===s.kind)return Kv(s)?{status:"ok",name:s.name||e,kind:na(654),defaultDuration:s.duration}:{status:"invalid",name:s.name||e,kind:na(654),problem:na(643)};const a="particles"===s.kind?na(642):na(802);return{status:"invalid",name:s.name||e,kind:a,problem:na(1185,{kind:a})}}const s=vt(n);return s?$i.has(s.id)?{status:"ok",name:(0,nt.t)(s.name),kind:na(695),defaultDuration:Uv(s.defaults.duration)}:{status:"invalid",name:(0,nt.t)(s.name),kind:na(695),problem:na(299)}:{status:"missing",name:n,kind:na(695),problem:na(1041)}}function Wv(e,t,i){const n=[...e];if(t<0||t>=n.length||i<0||i>=n.length||t===i)return n;const[s]=n.splice(t,1);return n.splice(i,0,s),n}function Zv(e){return`${qv(e).toFixed(2).replace(/\.?0+$/,"")} s`}const Yv={keyframes:"mdi:chart-bell-curve-cumulative",path:"mdi:vector-curve"},Xv=e=>(e?.length??0)<20;var Jv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};function Qv(e){const t=String(e??"").trim();if(!t)return;const i=parseFloat(t);return Number.isFinite(i)?/ms$/i.test(t)?i/1e3:i:void 0}const eb=(e,t,i)=>Math.min(i,Math.max(t,e)),tb=e=>Math.round(1e3*e)/1e3;let ib=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._open=-1,this._query="",this._announce="",this._pick=null,this._trigger=null,this._focusSearch=!1,this._onDragKey=e=>{"Escape"===e.key&&this._drag&&(e.preventDefault(),e.stopPropagation(),this._cancelDrag())}}get _steps(){return this.doc?.steps??[]}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_remap(e){const t=this.layerView,i=t&&e(t);i&&i!==t&&this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:i},bubbles:!0,composed:!0}))}_writeSteps(e,t,i=!1){this.doc&&this._emit({...this.doc,steps:e},t,i)}_patchStep(e,t,i){const n=this._steps.map((i,n)=>{if(n!==e)return i;const s={...i,...t};return void 0===t.duration&&"duration"in t&&delete s.duration,s});this._writeSteps(n,i)}_addStep(e){if(!Xv(this._steps))return;const t=[...this._steps,{animation:e,delay:0,repeat:1}];this._open=t.length-1,this._focusAfter={index:t.length-1,part:"toggle"},this._writeSteps(t,"Add step"),this._announce=na(902,{count:t.length,name:Gv(e,this.library,this.doc?.id).name})}_locked(e,t=!1){const i=!!this.layerView?.locked.includes(`step:${e}`);return i&&t&&(this._announce=na(907,{i:e+1})),i}_deleteStep(e){if(this._steps.length<=1||this._locked(e,!0))return;const t=this._steps.filter((t,i)=>i!==e);this._open===e?this._open=-1:this._open>e&&this._open--,this._focusAfter=t.length?{index:Math.min(e,t.length-1),part:"toggle"}:void 0,this._writeSteps(t,"Delete step"),this._remap(t=>function(e,t){return cc(e,e=>e===t?-1:e>t?e-1:e)}(t,e)),this._announce=na(903,{index:e+1})}_move(e,t,i="handle"){const n=this._steps.length;e===t||t<0||t>=n||this._locked(e,!0)||(this._open=this._followMove(this._open,e,t),this._focusAfter={index:t,part:i},this._writeSteps(Wv(this._steps,e,t),"Move step"),this._remap(i=>lc(i,e,t)),this._announce=na(901,{to:t+1,n}))}_followMove(e,t,i){return e<0?e:e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}_onHandleDown(e,t){if(this.disabled||0!==e.button||this._steps.length<2||this._locked(t,!0))return;const i=[...this.renderRoot.querySelectorAll(".step")];if(!i[t])return;e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId);const n=i.map(e=>e.getBoundingClientRect()),s=n[t+1]??n[t-1],a=s?Math.abs(t+1<n.length?s.top-n[t].bottom:n[t].top-s.bottom):0;this._drag={from:t,to:t,dy:0,startY:e.clientY,pointerId:e.pointerId,mids:n.map(e=>e.top+e.height/2),shift:n[t].height+a,steps:this._steps,moved:!1},window.addEventListener("keydown",this._onDragKey,!0)}_endDrag(){const e=this._drag;return this._drag=void 0,window.removeEventListener("keydown",this._onDragKey,!0),e}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_onHandleMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=e.clientY-t.startY,n=e.clientY;let s=t.from;for(let e=t.from+1;e<t.mids.length;e++)n>t.mids[e]&&(s=e);for(let e=t.from-1;e>=0;e--)n<t.mids[e]&&(s=e);const a=s!==t.to;this._drag={...t,dy:i,to:s,moved:t.moved||a},a&&this.doc&&this._emit({...this.doc,steps:Wv(t.steps,t.from,s)},"Move step",!0)}_onHandleUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._endDrag(),t.to!==t.from&&(this._open=this._followMove(this._open,t.from,t.to),this._focusAfter={index:t.to,part:"handle"},this.doc&&this._emit({...this.doc,steps:Wv(t.steps,t.from,t.to)},"Move step"),this._remap(e=>lc(e,t.from,t.to)),this._announce=na(900,{to:t.to+1,count:t.steps.length})))}_cancelDrag(){const e=this._endDrag();e&&e.moved&&this.doc&&this._emit({...this.doc,steps:e.steps},"Move step")}_onStepKey(e,t){if(!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key||this.disabled)return;e.preventDefault();const i=e.target.classList?.contains("handle");this._move(t,t+("ArrowUp"===e.key?-1:1),i?"handle":"toggle")}_dragOffset(e){const t=this._drag;return t?e===t.from?t.dy:t.from<t.to&&e>t.from&&e<=t.to?-t.shift:t.to<t.from&&e>=t.to&&e<t.from?t.shift:0:0}_popover(){return this.renderRoot.querySelector("mc-ui-popover.pick-pop")}_openPicker(e,t){if(this.disabled)return;const i=e.currentTarget;this._pick&&this._trigger===i?this._popover()?.close("action"):(this._trigger=i,this._pick=t,this._query="",this._focusSearch=!0)}_choose(e){const t=this._pick;this._popover()?.close("action"),this._pick=null,t&&("add"===t.mode?this._addStep(e):this._steps[t.index]?.animation!==e&&this._patchStep(t.index,{animation:e},"Change step animation"))}_onPickKey(e){const t="INPUT"===e.target.tagName;if(t&&("Home"===e.key||"End"===e.key))return;const i=[...this.renderRoot.querySelectorAll('.pick-pop [role="menuitem"]')],n=this.renderRoot.querySelector(".pick-pop .pick-search input"),s=i.indexOf(e.target),a=t=>{t&&(e.preventDefault(),t.focus())};"ArrowDown"===e.key?a(t?i[0]:i[Math.min(i.length-1,s+1)]):"ArrowUp"===e.key?a(s<=0?n:i[s-1]):"Home"===e.key?a(i[0]):"End"===e.key&&a(i[i.length-1])}_renderPicker(){const e=this._pick,t="step"===e?.mode?this._steps[e.index]?.animation:void 0,i=function(e,t,i=""){const n=(0,Ni.A)(i.trim()),s=(...e)=>!n||e.some(e=>e&&(0,Ni.A)(e).includes(n)),a=[],r=Object.values(e??{}).filter(e=>e.id!==t&&Kv(e)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).filter(e=>s(e.name,e.id,na(1125),e.kind)).map(e=>({value:ni+e.id,name:e.name||e.id,kind:"path"===e.kind?na(654):na(411),icon:Yv[e.kind],duration:e.duration}));r.length&&a.push({label:na(540),items:r});for(const e of mt){const t=ut.filter(t=>t.group===e&&$i.has(t.id)&&s((0,nt.t)(t.name),t.id,e,(0,nt.t)(gt[e]))).map(e=>({value:e.id,name:(0,nt.t)(e.name),icon:"mdi:motion-play-outline",duration:Uv(e.defaults.duration)}));t.length&&a.push({label:(0,nt.t)(gt[e]),items:t})}return a}(this.library,this.doc?.id,this._query),n=na("add"===e?.mode?37:899);return Z`
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
              placeholder=${na(782)}
              aria-label=${na(782)}
              autocomplete="off"
              .value=${this._query}
              @input=${e=>this._query=e.target.value}
            />
          </div>
          <div class="pick-list" role="menu" aria-label=${n}>
            ${i.length?i.map(e=>Z`
                    <div class="pick-group" role="group" aria-label=${e.label}>
                      <div class="pick-head" aria-hidden="true">${e.label}</div>
                      ${e.items.map(e=>Z`<button
                          type="button"
                          role="menuitem"
                          class="pick-item ${e.value===t?"is-current":""}"
                          data-value=${e.value}
                          @click=${()=>this._choose(e.value)}
                        >
                          <ha-icon icon=${e.icon}></ha-icon>
                          <span class="pick-name">${e.name}${e.kind?Z`<span class="pick-kind"> · ${e.kind}</span>`:Q}</span>
                          ${void 0!==e.duration?Z`<span class="pick-dur">${Zv(e.duration)}</span>`:Q}
                          ${e.value===t?Z`<ha-icon class="pick-check" icon="mdi:check"></ha-icon>`:Q}
                        </button>`)}
                    </div>
                  `):Z`<p class="menu-note">${na(556,{query:this._query})}</p>`}
          </div>
        </div>
      </mc-ui-popover>
    `}_field(e,t,i){return Z`<div class="field">
      <div class="field-head">${i?Z`<label for=${i}>${e}</label>`:Z`<span class="lbl">${e}</span>`}</div>
      ${t}
    </div>`}_renderSchedule(e){const t=e.total,i=function(e,t){if(!e.total)return-1;const i=Math.min(1,Math.max(0,t))*e.total,n=e.entries.find(t=>t.play>0&&i>=t.start&&(i<t.end||i===t.end&&t.end===e.total));return n?n.index:-1}(e,this.time),n=e=>t?e/t*100:0,s=this._steps.length,a=e.entries.filter(e=>"ok"!==e.status).length,r=!1!==this.doc?.loop,o=this._drag?this._followMove(this._open,this._drag.from,this._drag.to):this._open,l=new Map,c=t?na(1231,{steps:na(1170,{count:s}),total:Zv(t),loop:na(r?1124:1132),skipped:a?na(7,{count:a}):""}):na(599);return Z`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${e.entries.map(e=>{if("ok"!==e.status){const t=l.get(e.start)??0;return l.set(e.start,t+1),Z`<span class="mark" style="left:calc(${n(e.start)}% + ${8*t}px)" title=${na(904,{index:e.index+1})} @click=${()=>this._reveal(e.index)}></span>`}const t=["blk",e.index===o?"is-open":"",e.index===i?"is-live":""].join(" "),s=n(e.end-e.start);return Z`<span
              class=${t}
              style="left:${n(e.start)}%;width:${s}%;--plays:${e.repeat}"
              title=${na(905,{index:e.index+1,from:Zv(e.start),to:Zv(e.end)})}
              @click=${()=>this._reveal(e.index)}
              >${s>=6?e.index+1:""}</span
            >`})}
          ${t?Z`<span class="playhead" style="left:${100*eb(this.time,0,1)}%"></span>`:Q}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${r?Z`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>${na(448)}</span>`:Q}
          <span>${Zv(t)}</span>
        </div>
        <p class="sr-only">${c}</p>
      </div>
    `}_reveal(e){this._open=e,this.updateComplete.then(()=>this.renderRoot.querySelector(`.step[data-i="${e}"]`)?.scrollIntoView({block:"nearest"}))}_renderStep(e,t,i){const n=Gv(e.animation,this.library,this.doc?.id),s=this._open===t,a="ok"!==n.status,r=e=>`seq-${t}-${e}`,o=a?"missing"===n.status?na(585):na(131):function(e,t){const i=[];e.delay>0&&i.push(na(1094,{seconds:Zv(e.delay)}));const n=e.duration??t.defaultDuration;return void 0!==n&&i.push(Zv(n)),e.repeat>1&&i.push(`× ${e.repeat}`),i.join(" · ")}(e,n),l=this._drag?.from===t,c=this._dragOffset(t),d=void 0!==n.defaultDuration?String(tb(n.defaultDuration)):"",p=this._locked(t);return Z`
      <li
        class="step ${s?"is-open":""} ${a?"is-bad":""} ${l?"is-dragging":""}"
        data-i=${t}
        style=${c?`transform: translateY(${c}px)`:""}
        @keydown=${e=>this._onStepKey(e,t)}
      >
        <div class="row">
          <button
            type="button"
            class="icon-btn sm handle"
            aria-label=${na(485,{i:t+1})}
            aria-describedby="seq-move-hint"
            title=${na(264)}
            ?disabled=${this.disabled||p||i<2}
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
            aria-expanded=${s?"true":"false"}
            aria-controls=${r("body")}
            @click=${()=>this._open=s?-1:t}
          >
            <span class="num">${t+1}</span>
            <span class="txt">
              <span class="nm">${n.name}</span>
              <span class="sum ${a?"error":""}">${a?Z`<ha-icon icon="mdi:alert-circle-outline"></ha-icon>`:Q}${o}</span>
            </span>
            <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${na(242,{i:t+1})}
            title=${na(i<=1?21:241)}
            ?disabled=${this.disabled||p||i<=1}
            @click=${()=>this._deleteStep(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${s?Z`<div class="body" id=${r("body")}>
              ${p?pc(this.doc,this.layerView,[`step:${t}`]):Q}
              ${a?Z`<p class="help error problem" role="note">${n.problem}</p>`:Q}
              ${this._field(na(66),Z`<button
                  type="button"
                  class="input pick-btn"
                  id=${r("anim")}
                  aria-haspopup="menu"
                  aria-expanded=${"step"===this._pick?.mode&&this._pick.index===t?"true":"false"}
                  ?disabled=${this.disabled||p}
                  @click=${e=>this._openPicker(e,{mode:"step",index:t})}
                >
                  <span class="pick-val">${n.name}${n.kind&&n.kind!==na(695)?Z`<span class="pick-kind"> · ${n.kind}</span>`:Q}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,r("anim"))}
              <div class="fields">
                ${this._field(na(227),Z`<mc-unit-field
                    .value=${e.delay?`${tb(e.delay)}s`:""}
                    .label=${na(227)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${"0"}
                    ?disabled=${this.disabled||p}
                    @value-changed=${e=>{e.stopPropagation(),this._patchStep(t,{delay:eb(tb(Qv(e.detail.value)??0),0,600)},"Change step delay")}}
                  ></mc-unit-field>`)}
                ${this._field(na(291),Z`<mc-unit-field
                    .value=${void 0!==e.duration?`${tb(e.duration)}s`:""}
                    .label=${na(291)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${d}
                    ?disabled=${this.disabled||p}
                    @value-changed=${e=>{e.stopPropagation();const i=Qv(e.detail.value);this._patchStep(t,{duration:void 0===i||i<=0?void 0:eb(tb(i),.05,600)},"Change step duration")}}
                  ></mc-unit-field>`)}
                ${this._field(na(683),Z`<input
                    class="input"
                    id=${r("plays")}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    .value=${String(e.repeat)}
                    ?disabled=${this.disabled||p}
                    @change=${i=>{const n=i.target,s=Math.round(Number(n.value));if(!n.value.trim()||!Number.isFinite(s))return void(n.value=String(e.repeat));const a=eb(s,1,100);n.value=String(a),a!==e.repeat&&this._patchStep(t,{repeat:a},"Change step plays")}}
                  />`,r("plays"))}
              </div>
              <p class="help">${d?na(229,{seconds:d}):na(230)}</p>
            </div>`:Q}
      </li>
    `}render(){const e=this.doc;if(!e)return Z``;const t=this._drag?this._drag.steps:this._steps,i=function(e,t,i){const n=[];let s=0;return(e??[]).forEach((e,a)=>{const r=Gv(e.animation,t,i),o="ok"===r.status?e.duration??r.defaultDuration??0:0,l=Math.max(1,Math.round(e.repeat||1));if(!o)return void n.push({index:a,status:"ok"===r.status?"invalid":r.status,start:qv(s),play:0,repeat:l,end:qv(s)});const c=s+Math.max(0,e.delay||0),d=c+o*l;n.push({index:a,status:"ok",start:qv(c),play:qv(o),repeat:l,end:qv(d)}),s=d}),{entries:n,total:qv(s)}}(this._drag?Wv(this._drag.steps,this._drag.from,this._drag.to):t,this.library,e.id),n=!1!==e.loop,s=e.stagger??{children:!1,delay:.15},a=!Xv(t);return Z`
      <div class="wrap">
        <section class="group" aria-label=${na(781)}>${this._renderSchedule(i)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">${na(677)}</h3>
            <span class="chip is-count" title=${na(86,{steps:20})}>${t.length} / ${20}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">${na(266)}</p>
          ${t.length?Z`<ol class="steps ${this._drag?"is-sorting":""}">${t.map((e,i)=>this._renderStep(e,i,t.length))}</ol>`:Z`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>${na(571)}</strong>
                <p>${na(38)}</p>
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
              <ha-icon icon="mdi:plus"></ha-icon>${na(37)}
            </button>
            ${a?Z`<span class="help">${na(19,{steps:20})}</span>`:Q}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">${na(680)}</h3></div>
          <div class="switch-row">
            <div class="txt">
              ${na(444)}
              <p class="help">${na(882)}</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${n?"true":"false"}
              aria-label=${na(444)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,loop:!n},na(n?445:446))}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              ${na(877)}
              <p class="help">${na(676)}</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${s.children?"true":"false"}
              aria-label=${na(877)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,stagger:{...s,children:!s.children}},s.children?na(878):na(879))}
            ></button>
          </div>
          ${s.children?this._field(na(228),Z`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${tb(s.delay)}s`}
                  .label=${na(228)}
                  .units=${["s"]}
                  .noCustom=${!0}
                  .placeholder=${"0"}
                  ?disabled=${this.disabled}
                  @value-changed=${t=>{t.stopPropagation(),this._emit({...e,stagger:{...s,delay:eb(tb(Qv(t.detail.value)??0),0,10)}},"Change stagger delay")}}
                ></mc-unit-field>`):Q}
        </section>
        <div class="sr-only" aria-live="polite">${this._announce}</div>
        ${this._pick?this._renderPicker():Q}
      </div>
    `}willUpdate(e){e.has("doc")&&this._open>=this._steps.length&&(this._open=-1)}updated(){const e=this._pick?this._popover():null;e&&!e.open&&(e.anchor=this._trigger,e.show()),this._focusSearch&&e&&(this._focusSearch=!1,e.updateComplete.then(()=>this.renderRoot.querySelector(".pick-pop .pick-search input")?.focus({preventScroll:!0})));const t=this._focusAfter;t&&(this._focusAfter=void 0,this.renderRoot.querySelector(`.step[data-i="${t.index}"] .${t.part}`)?.focus())}};ib.styles=[Vu,dc,c`
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
    `],Jv([_e({attribute:!1})],ib.prototype,"doc",void 0),Jv([_e({attribute:!1})],ib.prototype,"hass",void 0),Jv([_e({attribute:!1})],ib.prototype,"library",void 0),Jv([_e({type:Number})],ib.prototype,"time",void 0),Jv([_e({type:Boolean,reflect:!0})],ib.prototype,"disabled",void 0),Jv([_e({attribute:!1})],ib.prototype,"layerView",void 0),Jv([$e()],ib.prototype,"_open",void 0),Jv([$e()],ib.prototype,"_drag",void 0),Jv([$e()],ib.prototype,"_query",void 0),Jv([$e()],ib.prototype,"_announce",void 0),Jv([$e()],ib.prototype,"_pick",void 0),ib=Jv([be("mc-anim-sequence-editor")],ib);const nb={hide:{name:376,tip:[377,828],key:"H",icon:["mdi:eye-outline","mdi:eye-off-outline"]},solo:{name:849,tip:[850,309],key:"S",icon:["mdi:radiobox-blank","mdi:radiobox-marked"]},lock:{name:440,tip:[440,1043],key:"L",icon:["mdi:lock-open-variant-outline","mdi:lock-outline"]}},sb=["hide","solo","lock"],ab={hide:[1204,1217],solo:[1218,1215],lock:[1209,1219]};let rb="";function ob(e,t){const i=t??e.closest(".layers-body");return(i?[...i.querySelectorAll("[data-panel] > *")]:[e]).flatMap(e=>[...e.shadowRoot?.querySelectorAll("[data-lk]")??[]])}function lb(e){const t=ob(e),i=t.find(e=>e.dataset.lk===rb)??t.find(e=>"true"===e.getAttribute("aria-pressed"))??t[0];for(const e of t){const t=e===i;e.tabIndex=t?0:-1,e.closest("li")?.querySelectorAll("[data-ctl]").forEach(e=>e.tabIndex=t?0:-1)}}class cb{constructor(e,t){this.host=e,this.actions=t,this._n=0,e.addController(this)}hostUpdated(){lb(this.host);const e=this._focus,t=this.host.renderRoot?.querySelector("mc-ui-menu");t&&this._menu?.first&&(this._menu.first=!1,t.anchor=this.host.renderRoot?.querySelector(`li[data-ref="${this._menu.key}"] [data-ctl="menu"]`)??void 0,t.show()),e&&this._refocus(e)}get view(){return this.host.layerView??Ul}announce(e,t=this.view){this.host.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:t,announce:e},bubbles:!0,composed:!0}))}locked(e){return!!this.host.doc&&nc(this.host.doc,this.view,e)}refuseLocked(e,t){return!!this.locked(e)&&(this.announce(na(1205,{name:t})),!0)}setOpen(e,t){const i=this.view;i.open.includes(e)!==t&&this.announce("",{...i,open:t?[...i.open,e]:i.open.filter(t=>t!==e)})}toggle(e,t,i){const n=function(e,t,i){const n=ic[i];return{...e,[n]:e[n].includes(t)?e[n].filter(e=>e!==t):[...e[n],t]}}(this.view,e,i),s=n["hide"===i?"hidden":"solo"===i?"solo":"locked"].includes(e);this.announce(na(ab[i][s?0:1],{name:t}),n)}focusKey(e,t){this._focus={key:e,ctl:t},this._refocus(this._focus),this.host.requestUpdate()}async _refocus(e,t=0){await this.host.updateComplete;const i=ob(this.host).find(t=>t.dataset.lk===e.key),n=i?e.ctl?i.closest("li")?.querySelector(`[data-ctl="${e.ctl}"]`):i:void 0;n?(this._focus===e&&(this._focus=void 0),rb=e.key,n.focus(),n.scrollIntoView?.({block:"nearest"})):t<4&&this._focus===e?setTimeout(()=>{this._refocus(e,t+1)},16):this._focus===e&&(this._focus=void 0)}_key(e,t){const i=e.target;if(!i.matches?.("[data-lk]")||e.ctrlKey||e.metaKey)return;const n=ob(this.host),s=n.indexOf(i),a=t=>{e.preventDefault(),n[Math.max(0,Math.min(n.length-1,t))]?.focus()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key))return e.preventDefault(),void this._move(t,"ArrowUp"===e.key?"up":"down");if(!e.altKey){if(!e.shiftKey&&"ArrowUp"===e.key)return a(s-1);if(!e.shiftKey&&"ArrowDown"===e.key)return a(s+1);if("Home"===e.key)return a(0);if("End"===e.key)return a(n.length-1);if("ArrowRight"===e.key&&!1===t.expanded)e.preventDefault(),this.actions.open?.(t.key,!0);else if("ArrowLeft"===e.key)if(t.expanded)e.preventDefault(),this.actions.open?.(t.key,!1);else{const i=this.host.doc?tc(this.host.doc,t.key):void 0;i&&(e.preventDefault(),this.focusKey(i))}else if("F2"===e.key&&t.renamable&&this.actions.rename)e.preventDefault(),this._rename(t);else if(!e.shiftKey&&1===e.key.length){const i=sb.find(t=>nb[t].key===e.key.toUpperCase());i&&this._toggles(t).includes(i)&&(e.preventDefault(),this.toggle(t.key,t.name,i))}}}_toggles(e){return e.toggles??Kl[e.key.split(":")[0]]??[]}_move(e,t,i){const n="up"===t?e.up:e.down;n?.ok&&this.actions.move&&(this.refuseLocked(e.key,e.name)||(this.actions.move(e.key,t),this.focusKey(e.key,i)))}_rename(e){this.refuseLocked(e.key,e.name)||this.actions.rename?.(e.key)}_openMenu(e,t=!0){this._menu={key:e,first:t},this.host.requestUpdate()}_toggleMenu(e){if(this._menu?.key===e)return this._closeMenu();const t=this._outsideAt;this._outsideAt=void 0,t&&t.key===e&&Date.now()-t.at<400||this._openMenu(e)}_closeMenu(e=!0){const t=this._menu?.key;this._menu=void 0,this.host.requestUpdate(),t&&e&&this.focusKey(t,"menu")}_menuItems(e){const t=this.locked(e.key),i=[];if(this.actions.move)for(const n of["up","down"]){const s="up"===n?e.up:e.down;if(!s)continue;const a=s.menu??s.label,r=t?na(441):s.ok?void 0:na("up"===n?51:50);i.push({id:`move-${n}`,icon:"up"===n?"mdi:arrow-up":"mdi:arrow-down",label:t?a.replace(/ \(.*\)$/,""):a,reason:r,keys:na("up"===n?56:55),run:()=>this._move(e,n,"menu")})}e.renamable&&this.actions.rename&&i.push({id:"rename",icon:"mdi:rename-outline",label:na(730),reason:t?na(441):void 0,keys:"F2",run:()=>this._rename(e)});const n=this.view;return sb.filter(t=>this._toggles(e).includes(t)).forEach((t,s)=>{const a=n["hide"===t?"hidden":"solo"===t?"solo":"locked"].includes(e.key);i.push({id:t,icon:a?"mdi:checkbox-marked":"mdi:checkbox-blank-outline",label:na(nb[t].name),checked:a,keys:nb[t].key,separatorBefore:0===s&&i.length>0,run:()=>this.toggle(e.key,e.name,t)})}),i}_renderMenu(e){const t=this._menuItems(e);return Z`<mc-ui-menu
      .items=${t}
      .align=${"end"}
      label=${na(419,{name:e.name})}
      @mc-menu-pick=${e=>{e.stopPropagation();const i=t.find(t=>t.id===e.detail.id);this._closeMenu(),i?.run()}}
      @mc-menu-close=${e=>{e.stopPropagation();const t=e.detail.reason;"pick"!==t&&("outside"===t&&this._menu&&(this._outsideAt={key:this._menu.key,at:Date.now()}),this._closeMenu(!1))}}
    ></mc-ui-menu>`}row(e){const t=this.host,i=t.doc,n=this.view,s="compact"===t.density,a=this._toggles(e),r=i?function(e,t,i){if(t.hidden.includes(i))return{kind:"self"};const n=ec(e,t);if(n.has(i))return{kind:"solo"};for(let t=tc(e,i),s=0;t&&s<4;t=tc(e,t),s++)if(n.has(t))return{kind:"parent",by:t}}(i,n,e.key):void 0,o=n.solo.includes(e.key),l=n.locked.includes(e.key),c=!l&&this.locked(e.key),d=i&&!1===e.expanded?function(e,t,i){const n=ec(e,t);let s=0;for(const a of Jl(e).keys())tc(e,a)===i&&(n.has(a)||t.solo.includes(a))&&s++;return s}(i,n,e.key):0,p=[e.describe,"self"===r?.kind&&na(1114),"solo"===r?.kind&&na(1112),"parent"===r?.kind&&na(1113,{name:(e=>e?this.actions.nameOf?.(e)??e.split(":").slice(1).join(":"):"")(r.by)}),o&&"solo",l&&"locked",c&&na(1123),d>0&&na(1156,{below:d})].filter(Boolean),h="ld"+this._n++,u=l||c,m=t=>{const i="up"===t?e.up:e.down;return i?Z`<button type="button" class="icon-btn xs lt mv ${t}" data-ctl=${t} tabindex="-1" aria-label=${i.label} title=${i.label} aria-disabled=${i.ok&&!u?Q:"true"} @click=${()=>this._move(e,t,t)}>
        <ha-icon icon=${"up"===t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>`:Q},g=a.length>0||!!e.up||!!e.down||e.renamable&&!!this.actions.rename,f=s?Q:Z`<span class="lfull">${a.length?sb.filter(e=>a.includes(e)).map(t=>{const i="hide"===t?"self"===r?.kind:"solo"===t?o:l,n=!i&&("hide"===t?!!r:"lock"===t&&c),s=nb[t];return Z`<button type="button" class="icon-btn xs lt ${n?"soft":""}" data-ctl=${t} data-toggle=${t} tabindex="-1" aria-pressed=${i?"true":"false"} aria-label=${na(s.name)} title=${"hide"===t&&!i&&e.key.startsWith("lane:")?na(378):na(s.tip[i?1:0])} @click=${()=>this.toggle(e.key,e.name,t)}>
        <ha-icon icon=${s.icon[i||n?1:0]}></ha-icon>
      </button>`}):Q}${m("up")}${m("down")}</span>`;return Z`<li class="lr lvl-${e.level??1} ${s?"compact":""} ${e.selected?"sel":""} ${r?"is-hidden":""} ${u?"is-locked":""}" data-ref=${e.key} data-id=${e.key.slice(e.key.indexOf(":")+1)} @dblclick=${()=>this.actions.dblclick?.(e.key)} @keydown=${t=>this._key(t,e)}>
      <div class="lr-in">
        ${void 0===e.expanded?Z`<span class="lcaret-space"></span>`:Z`<button type="button" class="icon-btn xs lt lcaret" tabindex="-1" aria-label=${e.expanded?na(177,{name:e.name}):na(321,{name:e.name})} @click=${()=>this.actions.open?.(e.key,!e.expanded)}>
              <ha-icon icon=${e.expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${e.key} tabindex="-1" aria-pressed=${e.selected?"true":"false"} aria-expanded=${void 0===e.expanded?Q:e.expanded?"true":"false"} aria-describedby=${p.length?h:Q} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${(e.title??e.name)+(e.badge&&!e.title?` (${e.badge})`:"")} @focus=${e=>(rb=e.currentTarget.dataset.lk,lb(t))} @click=${t=>this.actions.select(e.key,t)}>
          ${e.thumb??(e.bare?Q:Z`<ha-icon class="kind" icon=${e.icon??"mdi:layers-outline"}></ha-icon>`)}
          ${e.renaming?Q:Z`<span class="nm"><span class="nm-t">${e.name}</span>${e.note?Z`<small>${e.note}</small>`:Q}</span>`}
          ${e.badge?Z`<span class="lbadge">${e.badge}</span>`:Q}
          ${d>0?Z`<span class="lbadge warn" aria-hidden="true">${na(1155,{below:d})}</span>`:Q}
        </button>
        ${e.renaming?Z`<div class="lrename">${e.renaming}</div>`:Q}
        <span class="lst" aria-hidden="true">
          ${r?Z`<ha-icon icon="mdi:eye-off-outline"></ha-icon>`:Q}${o?Z`<ha-icon icon="mdi:radiobox-marked"></ha-icon>`:Q}${u?Z`<ha-icon icon="mdi:lock-outline"></ha-icon>`:Q}
        </span>
        ${f}
        ${g?Z`<button type="button" class="icon-btn xs lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key===e.key?"true":"false"} aria-label=${na(419,{name:e.name})} title=${na(418)} @click=${()=>this._toggleMenu(e.key)} @keydown=${t=>{"ArrowDown"!==t.key&&"ArrowUp"!==t.key||(t.preventDefault(),this._openMenu(e.key))}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`:Q}
        ${e.extra??Q}
      </div>
      ${p.length?Z`<span id=${h} class="lr-sr">${p.join(", ")}</span>`:Q}
      ${this._menu?.key===e.key?this._renderMenu(e):Q}
    </li>`}}const db=c`
  ${Aa}
  ${ja}
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
`;function pb(e){const t=e.lastIndexOf("|");return{target:e.slice(5,t),lane:e.slice(t+1)}}const hb=e=>Ia[pb(e).lane]?qa(pb(e).lane):e,ub=(e,t,i,n)=>Yl(e,i).length?t.open.includes(n):void 0;function mb(e,t,i){const{target:n,lane:s}=pb(i),a={kind:"keys",keys:Xl(t,n,s).map(e=>({target:n,lane:s,at:e,id:`${s}@${e}`})),target:n,targets:[n]};e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:a},bubbles:!0,composed:!0}))}function gb(e,t,i,n,s){return Yl(t,n).map(a=>{const r=((e,t)=>`lane:${e}|${t}`)(n,a),o=Xl(t,n,a).length,l="keys"===i?.kind&&!!i.keys?.length&&i.keys.every(e=>e.target===n&&e.lane===a);return e.row({key:r,name:hb(r),bare:!0,level:s,badge:na(1164,{count:o}),describe:na(1117),selected:l,title:na(1222,{name:hb(r),count:o})})})}const fb="0 0 24 24",vb=new Map,bb=new Map,yb=new Map,xb=new Set;let _b,$b,wb=0;const kb=new Set;let Mb=!1;const Sb=e=>e.includes(":")?e.slice(0,e.indexOf(":")):"",Cb=new Set(["mdi","hass","hassio","hademo"]);function Ab(e){const t="undefined"==typeof window?{}:window,i=t.customIconsets?.[e];if("function"==typeof i)return i;const n=t.customIcons?.[e];return n&&"function"==typeof n.getIcon?e=>n.getIcon(e):void 0}function jb(e,t){for(vb.delete(e),vb.set(e,{g:t,at:Date.now()});vb.size>200;)vb.delete(vb.keys().next().value);t&&(xb.delete(e),yb.get(e)?.forEach(e=>{try{e()}catch{}}))}function zb(e){const t=vb.get(e);if(t?.g)return vb.delete(e),vb.set(e,t),t.g}const Eb=new Map;let Vb=function(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return(t>>>0).toString(36)+e.length.toString(36)};function Lb(e,t){t&&Eb.delete(t);const i=t??`svg:${Vb(e)}`;let n=i;for(let t=1;Eb.has(n)&&Eb.get(n).text!==e;t++)n=`${i}.${t}`;const s=function(e){const t=Eb.get(e);return t&&(Eb.delete(e),Eb.set(e,t)),t}(n);if(s)return s.geometry&&!vb.get(n)?.g&&jb(n,s.geometry),n;const a=function(e){try{return Qt(e)}catch{return{markup:"",viewBox:"0 0 24 24",paths:[],accentPaths:[],strokes:[],error:Wt}}}(e),r={text:e};if(a.error)r.error=a.error;else{const e={paths:a.paths,viewBox:a.viewBox};a.accentPaths.length&&(e.secondary=a.accentPaths),a.strokes.length&&(e.strokes=a.strokes),a.evenodd&&(e.evenodd=a.evenodd),r.markup=a.markup,r.geometry=e}for(Eb.set(n,r);Eb.size>50;){const e=Eb.keys().next().value;Eb.delete(e),vb.delete(e)}return r.geometry&&jb(n,r.geometry),n}async function Pb(e){const t=Ab(Sb(e));if(!t)return;let i;try{i=await t((e=>e.slice(e.indexOf(":")+1))(e))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){Lb(i.mc_svg,e);const t=zb(e);if(t)return t}const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const s={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():fb},a="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return a&&!a.startsWith("<")&&(s.secondary=[a]),s}function Db(e,t){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",e);let s,a=!1;const r=setInterval(()=>{p(),c()},50),o=setTimeout(()=>l(void 0),t),l=e=>{a||(a=!0,kb.delete(d),s?.disconnect(),clearInterval(r),clearTimeout(o),n.remove(),$b&&!$b.childElementCount&&($b.remove(),$b=void 0),i(e))},c=()=>{if(a)return;const e=n.shadowRoot?.querySelector("ha-svg-icon"),t="string"==typeof e?.path?e.path.trim():"";if(!e||!t)return;const i={paths:[t],viewBox:"string"==typeof e.viewBox&&e.viewBox.trim()?e.viewBox.trim():fb},s="string"==typeof e.secondaryPath?e.secondaryPath.trim():"";s&&(i.secondary=[s]),l(i)},d=()=>l(void 0);function p(){!s&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(s=new MutationObserver(c),s.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}kb.add(d),($b?.isConnected||($b=document.createElement("div"),$b.setAttribute("aria-hidden","true"),$b.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild($b)),$b).appendChild(n),p();const h=n;h.updateComplete?.then(()=>{p(),c()},()=>{}),c()})}function Hb(){for(const e of[...xb]){if(!Ab(Sb(e))||bb.has(e))continue;xb.delete(e);const t=Pb(e).then(t=>(bb.delete(e),jb(e,t&&"markup"!==t?t:null),t&&"markup"!==t?t:void 0));bb.set(e,t)}}function Rb(e){const t=e.detail;if("icons"===t?.kind)for(const e of t.ids?.length?t.ids.map(e=>`mcu:${e}`):[...vb.keys(),...yb.keys()].filter(e=>e.startsWith("mcu:")))vb.delete(e),Eb.delete(e),yb.get(e)?.forEach(e=>e())}function Nb(e,t={}){if(!e||!e.includes(":"))return Promise.resolve(void 0);if(e.startsWith("svg:"))return Promise.resolve(zb(e));Mb||"undefined"==typeof window||(Mb=!0,window.addEventListener("iconset-registered",Hb),window.addEventListener("mcu-library-changed",Rb));const i=vb.get(e);if(i){if(i.g)return Promise.resolve(zb(e));const t=Date.now()-i.at>6e4,n=xb.has(e)&&!!Ab(Sb(e));if(!t&&!n)return Promise.resolve(void 0);n&&xb.delete(e),vb.delete(e)}if(e.startsWith("svg:"))return Promise.resolve(void 0);const n=bb.get(e);if(n)return n;const s=(async()=>{const i=!!Ab(Sb(e)),n=await Pb(e);if("markup"===n)return void jb(e,null);if(n)return jb(e,n),n;const s=Sb(e);if(!Cb.has(s))return jb(e,null),void(i||(xb.add(e),function(){if(wb=10,_b||!xb.size)return;const e=()=>{_b=void 0,Hb(),xb.size&&--wb>0&&(_b=setTimeout(e,500))};_b=setTimeout(e,500)}()));const a=t.timeoutMs??3e3,r=function(e,t){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?Db(e,t):new Promise(i=>{const n=Date.now();let s=!1;const a=()=>!s&&(s=!0,kb.delete(r),clearTimeout(o),!0),r=()=>{a()&&i(void 0)},o=setTimeout(r,t);kb.add(r),customElements.whenDefined("ha-icon").then(()=>{a()&&Db(e,Math.max(0,t-(Date.now()-n))).then(i)},r)}):Promise.resolve(void 0)}(e,Math.max(a,t.probeMaxMs??15e3));r.then(t=>{t&&(jb(e,t),Hb())});const o=await new Promise(e=>{const t=setTimeout(()=>e(void 0),a);r.then(i=>{clearTimeout(t),e(i)})});if(o)return o;zb(e)||jb(e,null)})().finally(()=>bb.delete(e));return bb.set(e,s),s}const Ob=e=>e.slice(e.indexOf(":")+1),Tb=e=>`part:${e}`,Fb=e=>`group:${e}`,Ib=e=>"string"==typeof e&&/^(part|group):/.test(e),Bb=e=>!!e.rig&&(e.rig.parts.length>0||!!e.rig.shapes?.length);function qb(e){return new Set([...(e?.parts??[]).map(e=>e.id),...(e?.groups??[]).map(e=>e.id),...(e?.shapes??[]).map(e=>e.id)])}function Kb(e,t,i=qb(e)){const n=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^[-_]+/,"").slice(0,24)||"part";for(let e=1;;e++){const t=`${n}-${e}`;if(!i.has(t)&&ds.test(t))return t}}function Ub(e,t="icon"){return e.rig?.icon?e.rig.icon:e.rig?.svg?Lb(e.rig.svg):String(ha(t,"m",!1).icon??"mdi:bell-ring")}const Gb=e=>zb(e),Wb=e=>Nb(e),Zb=new WeakMap;function Yb(e){let t=Zb.get(e);return t||Zb.set(e,t=(0,Af.WP)(e)),t}const Xb=(e,t)=>!e.tracks?.some(e=>e.target===t)&&(e.tracks?.length??0)>=24,Jb=()=>na(994,{tracks:24}),Qb=(e,t)=>e.tracks?.find(e=>e.target===t);function ey(e,t,i){const n=(e.tracks??[]).filter(e=>e.target!==t),s=(e.tracks??[]).findIndex(e=>e.target===t);i&&n.splice(s<0?n.length:s,0,{...i,target:t});const a={...e,tracks:n};return n.length||delete a.tracks,a}function ty(e,t){const i={...e};return e.tracks&&(i.tracks=e.tracks.filter(e=>!t.has(e.target)),i.tracks.length||delete i.tracks),e.bindings&&(i.bindings=e.bindings.filter(e=>!t.has(e.target)),i.bindings.length||delete i.bindings),i}const iy=(e,t)=>({...e,rig:t});function ny(e,t,i){const n=e.rig,s=i.trim();if(!n||!s)return e;const a=Ob(t);return t.startsWith("part:")?iy(e,{...n,parts:n.parts.map(e=>e.id===a?{...e,name:s}:e)}):t.startsWith("group:")?iy(e,{...n,groups:(n.groups??[]).map(e=>e.id===a?{...e,name:s}:e)}):t.startsWith("shape:")?iy(e,{...n,shapes:(n.shapes??[]).map(e=>e.id===a?{...e,name:s}:e)}):e}function sy(e,t){const i=e.rig,n=[];for(const e of t){const t=Ob(e),s=e.startsWith("group:")?i?.groups?.find(e=>e.id===t)?.parts??[]:e.startsWith("part:")?[t]:[];for(const e of s)!n.includes(e)&&i?.parts.some(t=>t.id===e)&&n.push(e)}return(i?.parts??[]).map(e=>e.id).filter(e=>n.includes(e))}const ay=(e,t)=>e?.groups?.find(e=>e.parts.includes(t));function ry(e,t){return sy(e,t).length<2?na(794):(e.rig?.groups?.length??0)>=16?na(17,{groups:16}):""}function oy(e,t,i){const n=e.rig;if(!n||ry(e,t))return{doc:e};const s=sy(e,t),a=Kb(n,"group"),r=(n.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!s.includes(e))})),o=new Set(r.filter(e=>!e.parts.length).map(e=>Fb(e.id))),l=[...r.filter(e=>e.parts.length),{id:a,name:i?.trim()||`Group ${(n.groups?.length??0)+1}`,parts:s}];return{doc:iy(ty(e,o),{...n,groups:l}),id:a}}function ly(e,t){const i=e.rig;if(!i?.groups?.some(e=>e.id===t))return e;const n=i.groups.filter(e=>e.id!==t),s={...i,groups:n};return n.length||delete s.groups,iy(ty(e,new Set([Fb(t)])),s)}function cy(e,t,i){const n=e.rig;if(!n)return e;const s=Ob(t),a=e=>Math.round(100*e)/100,r=e=>{if(e.id!==s)return e;const t={...e};return i?t.origin=[a(i[0]),a(i[1])]:delete t.origin,t};return t.startsWith("part:")?iy(e,{...n,parts:n.parts.map(r)}):t.startsWith("group:")?iy(e,{...n,groups:(n.groups??[]).map(r)}):t.startsWith("shape:")?iy(e,{...n,shapes:(n.shapes??[]).map(r)}):e}const dy=e=>/^(part|group|shape):/.test(e),py=(e,t)=>dy(t)&&!!Qb(e,t)?.origin;function hy(e,t,i){const n=Qb(e,t);if(!n||!dy(t))return e;const s={...n},a=e=>Math.round(100*e)/100;return i?s.origin=`${a(i[0])}px ${a(i[1])}px`:delete s.origin,ey(e,t,s.keyframes.length||s.path||s.origin?s:void 0)}function uy(e,t,i){return py(e,t)?hy(e,t,i):cy(e,t,i)}function my(e,t,i){const n=e.rig;if(!n)return;const s=sy(e,[t]).flatMap(e=>(n.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.bbox)).filter(e=>!!e);return(0,Af.Zg)(s)}function gy(e,t,i,n){const s=function(e,t,i=[0,0,24,24]){const n=dy(t)?Qb(e,t)?.origin?.trim():void 0;if(!n)return;const s=(e,t)=>{const n=i[2+t];if(!e||"center"===e)return n/2;if("left"===e||"top"===e)return 0;if("right"===e||"bottom"===e)return n;const s=parseFloat(e);return Number.isFinite(s)?e.endsWith("%")?n*s/100:s:n/2};let[a,r]=n.split(/\s+/);return"top"!==a&&"bottom"!==a&&("left"!==r&&"right"!==r||"center"!==a)||([a,r]=[r,a]),[s(a,0),s(r,1)]}(e,t,n);if(s)return s;const a=e.rig,r=Ob(t),o=t.startsWith("part:")?a?.parts.find(e=>e.id===r)?.origin:t.startsWith("group:")?a?.groups?.find(e=>e.id===r)?.origin:void 0;if(o)return o;const l=my(e,t,i);return l?[l[0]+l[2]/2,l[1]+l[3]/2]:void 0}function fy(e,t){const i=Ob(t),n=e.rig;return t.startsWith("part:")?n?.parts.find(e=>e.id===i)?.name??i:t.startsWith("group:")?n?.groups?.find(e=>e.id===i)?.name??i:t.startsWith("shape:")?n?.shapes?.find(e=>e.id===i)?.name??i:t}function vy(e,t){return(Qb(e,t)?.keyframes??[]).filter(e=>void 0!==e.draw).map(e=>[e.at,e.draw])}function by(e,t,i){const n=e.map(e=>e.at===t?{...e,...i}:e);return e.some(e=>e.at===t)||n.push({at:t,...i}),n.sort((e,t)=>e.at-t.at)}function yy(e,t,i,n=0,s=60){if("none"!==i&&Xb(e,t))return e;const a=Qb(e,t);let r=(a?.keyframes??[]).map(e=>{if(void 0===e.draw)return e;const t={...e};return delete t.draw,t});if(r=r.filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e&&"easings"!==e)),"none"!==i){const[e,t]="on"===i?[0,1]:[1,0],a=Math.max(0,Math.min(100,n)),o=Math.max(a,Math.min(100,s));r=by(r,a,{draw:e}),r=by(r,o,{draw:t}),a>0&&(r=by(r,0,{draw:e})),o<100&&(r=by(r,100,{draw:t}))}return r.length||a?.path?ey(e,t,{...a??{target:t},target:t,keyframes:r.slice(0,40)}):ey(e,t,void 0)}const xy="M0 0 C 2 -3 4 -3 6 0 S 2 3 0 0";function _y(e,t,i){const n=Qb(e,t);if(!i){if(!n)return e;const i={...n};return delete i.path,ey(e,t,i.keyframes.length?i:void 0)}return Xb(e,t)?e:ey(e,t,{...n??{target:t,keyframes:[]},target:t,path:i})}const $y=/^(part|group|shape):/;function wy(e){if(!e||"target"!==e.kind&&"keys"!==e.kind)return[];const t=[...e.target?[e.target]:[],...e.targets??[]];return[...new Set(t)].filter(e=>$y.test(e))}function ky(e,t){const i=[...new Set(e)];if(!i.length)return{kind:"none"};const n=t&&i.includes(t)?t:i[i.length-1];return{kind:"target",target:n,targets:[n,...i.filter(e=>e!==n)]}}function My(e,t){e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}function Sy(e,t,i,n=!1){e.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:t,label:i,...n?{transient:!0}:{}},bubbles:!0,composed:!0}))}var Cy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ay={part:"mdi:vector-square",group:"mdi:folder-outline",shape:"mdi:draw"};let jy=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this.density="full",this._icon="",this._busy=!1,this._error="",this._confirm=!1,this._resplit=!1,this._collapsed=new Set,this._status="",this._notice="",this._iconTyped=!1,this._list=new cb(this,{select:(e,t)=>{if(e.startsWith("tracks:"))return this._list.setOpen(e.slice(7),!this.layerView?.open.includes(e.slice(7)));if(e.startsWith("lane:"))return this.disabled?void 0:mb(this,this.doc,e);const i=this._rows(),n=i.find(t=>t.ref===e);n&&t instanceof MouseEvent?this._onRowClick(t,n,i):n&&(this._anchor=n.ref,this._select([n.ref]))},move:(e,t)=>this._move("up"===t?1:-1,e),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&!this._list.refuseLocked(e,fy(this.doc,e))&&(this._renaming=e),open:(e,t)=>e.startsWith("group:")?this._setOpen(e.slice(6),t):this._list.setOpen(e.startsWith("tracks:")?e.slice(7):e,t),nameOf:e=>e.startsWith("lane:")?hb(e):this.doc?fy(this.doc,e):e})}connectedCallback(){super.connectedCallback(),La("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}willUpdate(e){const t=e.get("doc");if(e.has("doc")&&t&&t.id!==this.doc?.id&&(this._icon="",this._iconTyped=!1,this._confirm=!1,this._resplit=!1,this._error="",this._notice=""),(e.has("doc")||e.has("tile"))&&!this._iconTyped&&this.doc){const e=Ub(this.doc,this.tile);this._icon=e.startsWith("svg:")?"":e}}get _sel(){return wy(this.selection)}_rows(){const e=this.doc,t=e?.rig;if(!e||!t)return[];const i=t=>Qb(e,t)?.keyframes.length??0,n=[],s=new Set,a=[...t.parts].reverse();for(const e of a){const r=ay(t,e.id);if(r){if(!s.has(r.id)&&(s.add(r.id),n.push({ref:Fb(r.id),level:1,kind:"group",name:r.name,count:r.parts.length,keys:i(Fb(r.id))}),!this._collapsed.has(r.id)))for(const e of a.filter(e=>ay(t,e.id)?.id===r.id))n.push({ref:Tb(e.id),level:2,kind:"part",name:e.name,count:e.from?.length??1,keys:i(Tb(e.id))})}else n.push({ref:Tb(e.id),level:1,kind:"part",name:e.name,count:e.from?.length??1,keys:i(Tb(e.id))})}return n}_change(e,t,i=t){this._status=i,Sy(this,e,t)}_select(e,t){My(this,ky(e,t))}async _split(){const e=this.doc;if(!e||this._busy||this.disabled)return;if(Bb(e)&&!this._confirm)return void(this._confirm=!0);const t=!this._resplit&&e.rig?.svg?e.rig.svg:void 0,i=t?Ub(e,this.tile):this._icon.trim()||Ub(e,this.tile);if(t||/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(i)){this._busy=!0,this._error="";try{const n=await Wb(i);if(this.doc?.id!==e.id)return;if(!n)return void(this._error=na(996));const s=Yb(n);if(!s.length)return void(this._error=na(998));const a=function(e,t,i){const n=e.rig,s=new Set([...(n?.parts??[]).map(e=>Tb(e.id)),...(n?.groups??[]).map(e=>Fb(e.id))]),a=function(e,t){const i=e.slice(0,ls).map((e,t)=>({id:`part-${t+1}`,name:na(635,{i:t+1}),from:[e.index]}));return{...t?.svg?{svg:t.svg}:t?.icon?{icon:t.icon}:{},parts:i}}(t,i);if(n?.shapes?.length){const e=new Set(n.shapes.map(e=>e.id));a.parts=a.parts.map(t=>e.has(t.id)?{...t,id:Kb(a,"part",new Set([...e,...a.parts.map(e=>e.id)]))}:t),a.shapes=n.shapes}return iy(ty(e,s),a)}(this.doc??e,s,t?{svg:t}:{icon:i}),r=a.rig?.parts.length??0,o=s.length>ls;this._notice=o?na(953,{count:s.length,parts:ls}):"",this._change(a,"Split icon",o?na(867,{count:r,parts:ls}):na(866,{count:r})),this._confirm=!1,this._resplit=!1,this._select([])}finally{this._busy=!1}}else this._error=na(1054)}_group(){const e=this.doc;if(!e||this.disabled)return;if(this._lockedSel())return;const t=ry(e,this._sel);if(t)return void(this._status=t);const i=oy(e,this._sel);i.id&&(this._change(i.doc,"Group parts",na(370,{count:sy(e,this._sel).length})),this._select([Fb(i.id)]))}_ungroup(){const e=this.doc,t=this._sel.filter(e=>e.startsWith("group:"));if(!e||!t.length||this.disabled||this._lockedSel())return;let i=e;const n=[];for(const s of t)n.push(...(e.rig?.groups?.find(e=>`group:${e.id}`===s)?.parts??[]).map(Tb)),i=ly(i,s.slice(6));this._change(i,"Ungroup",t.length>1?na(371):na(369)),this._select(n)}_merge(){const e=this.doc;if(!e||this.disabled||this._lockedSel())return;const t=function(e,t){const i=e.rig,n=sy(e,t).filter(e=>i?.parts.find(t=>t.id===e)?.from);if(!i||n.length<2)return{doc:e};const[s,...a]=n,r=[...new Set(n.flatMap(e=>i.parts.find(t=>t.id===e).from??[]))].sort((e,t)=>e-t),o=i.parts.filter(e=>!a.includes(e.id)).map(e=>e.id===s?{...e,from:r}:e),l=(i.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!a.includes(e))})),c=l.filter(e=>!e.parts.length).map(e=>Fb(e.id)),d={...i,parts:o,...i.groups?{groups:l.filter(e=>e.parts.length)}:{}};return d.groups&&!d.groups.length&&delete d.groups,{doc:iy(ty(e,new Set([...a.map(Tb),...c])),d),id:s}}(e,this._sel);t.id&&(this._change(t.doc,"Merge parts",na(649)),this._select([Tb(t.id)]))}_splitBack(){const e=this.doc,t=this._sel.find(e=>e.startsWith("part:"));if(!e||!t||this.disabled||this._lockedSel())return;const i=function(e,t){const i=e.rig,n=i?.parts.find(e=>e.id===t);if(!i||!n?.from||n.from.length<2)return{doc:e,ids:[t]};const s=ls-i.parts.length+1,a=n.from.slice(0,Math.max(1,s)),r=qb(i),o=a.slice(1).map(e=>{const t=Kb(i,"part",r);return r.add(t),{id:t,name:na(636,{n:t.slice(5)}),from:[e]}}),l={...n,from:[a[0]]};delete l.origin;const c=i.parts.indexOf(n),d=[...i.parts.slice(0,c),l,...o,...i.parts.slice(c+1)],p=i.groups?.map(e=>e.parts.includes(t)?{...e,parts:[...e.parts,...o.map(e=>e.id)]}:e);return{doc:iy(e,{...i,parts:d,...p?{groups:p}:{}}),ids:[t,...o.map(e=>e.id)]}}(e,t.slice(5));i.ids.length<2||(this._change(i.doc,"Split part",na(868,{count:i.ids.length})),this._select(i.ids.map(Tb)))}_lockedSel(){const e=this.doc,t=e&&this._sel.find(e=>this._list.locked(e));return!!t&&this._list.refuseLocked(t,fy(e,t))}_move(e,t){const i=this.doc,n=t??this._sel.find(e=>e.startsWith("part:"));if(!i||!n||!n.startsWith("part:")||this.disabled)return;if(this._list.refuseLocked(n,fy(i,n)))return;const s=function(e,t,i){const n=e.rig,s=n?.parts.findIndex(e=>e.id===t)??-1,a=s+i;if(!n||s<0||a<0||a>=n.parts.length)return e;const r=[...n.parts];return[r[s],r[a]]=[r[a],r[s]],iy(e,{...n,parts:r})}(i,n.slice(5),e);s!==i&&(this._change(s,"Move part",na(e>0?502:501)),this._list.announce(na(1212,{name:fy(i,n),direction:na(e>0?1151:1105)})))}_setOpen(e,t){const i=new Set(this._collapsed);t?i.delete(e):i.add(e),this._collapsed=i}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc;i&&t.trim()&&t.trim()!==fy(i,e)&&!this._list.refuseLocked(e,fy(i,e))&&this._change(ny(i,e,t),"Rename part",na(734))}_onRowClick(e,t,i){if(this._renaming===t.ref)return;const n=this._sel;if(e.shiftKey&&this._anchor){const e=i.findIndex(e=>e.ref===this._anchor),n=i.findIndex(e=>e.ref===t.ref);if(e>=0&&n>=0){const[s,a]=e<n?[e,n]:[n,e];return void this._select(i.slice(s,a+1).map(e=>e.ref),t.ref)}}this._anchor=t.ref,e.ctrlKey||e.metaKey?this._select(n.includes(t.ref)?n.filter(e=>e!==t.ref):[...n,t.ref],t.ref):this._select([t.ref])}_onKey(e){if(this._renaming||this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase();if(t&&"g"===i)return e.preventDefault(),void(e.shiftKey?this._ungroup():this._group());const n=this._rows(),s=n.findIndex(t=>t.ref===(e.target.closest?.("li.lr")?.getAttribute("data-ref")??this.selection.target??this._anchor));if(e.shiftKey&&!e.altKey&&("ArrowDown"===e.key||"ArrowUp"===e.key)&&e.target.matches?.("[data-lk]")){if(/^(lane|tracks):/.test(e.target.dataset.lk??""))return;e.preventDefault();const t=n[Math.max(0,Math.min(n.length-1,s+("ArrowDown"===e.key?1:-1)))];if(!t)return;return s>=0?this._select([...this._sel,t.ref],t.ref):this._select([t.ref]),void this._focusRow(t.ref)}"Escape"===e.key&&this._sel.length&&e.target.matches?.("[data-lk]")&&(e.preventDefault(),this._select([]))}_focusRow(e){this._list.focusKey(e)}_iconBtn(e,t,i,n,s){return Z`<button
      type="button"
      class="icon-btn sm"
      title=${s?`${t} (${s})`:t}
      aria-label=${t}
      aria-keyshortcuts=${s??Q}
      ?disabled=${this.disabled||!n}
      @click=${i}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderSource(e){const t=this.doc,i=!!t.rig?.svg&&!this._resplit;return Z`<div class="source">
      ${i?Z`<p class="help">${na(968)}</p>`:La("mc-icon-picker")?Z`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">${na(390)}</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${na(390)}
                aria-labelledby="pl-icon-l"
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._iconTyped=""!==this._icon,this._error="",this._confirm=!1}}
              ></mc-icon-picker>
            </div>`:Z`<div class="field">
            <div class="field-head"><label for="pl-icon">${na(390)}</label></div>
            <input
              id="pl-icon"
              class="input mono"
              .value=${this._icon}
              placeholder=${Ub(t,this.tile)}
              spellcheck="false"
              ?disabled=${this.disabled||this._busy}
              @input=${e=>{this._icon=e.target.value,this._iconTyped=""!==this._icon.trim(),this._error=""}}
              @keydown=${e=>"Enter"===e.key&&void this._split()}
            />
          </div>`}
      ${this._error?Z`<p class="help error" role="alert">${this._error}</p>`:Q}
      <div class="actions">
        <button type="button" class="btn ${e?"btn-secondary":"btn-primary"} btn-sm" ?disabled=${this.disabled||this._busy} @click=${()=>{this._split()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?na(871):this._confirm?na(741,{count:t.rig?.parts.length??0}):na(e?862:865)}
        </button>
        ${e?Z`<button
              type="button"
              class="btn btn-text btn-sm"
              @click=${()=>{this._resplit=!1,this._confirm=!1,this._error=""}}
            >
              ${na(130)}
            </button>`:Q}
      </div>
      ${this._confirm?Z`<p class="help">${na(870)}</p>`:Q}
    </div>`}_renderRow(e,t,i){const n=this.doc,s="group"===e.kind?e.ref.slice(6):"",a=n.rig?.parts??[],r="part"===e.kind?a.findIndex(t=>`part:${t.id}`===e.ref):-1,o=this._list.locked(e.ref),l=Yl(n,e.ref).length>0,c="group"===e.kind?void 0:ub(n,this.layerView??Ul,e.ref,e.ref),d=this._list.row({key:e.ref,name:e.name,icon:Ay[e.kind],note:"part"===e.kind&&e.count>1?na(1176,{count:e.count}):void 0,badge:e.keys?na(1164,{count:e.keys}):void 0,level:e.level,expanded:"group"===e.kind?!this._collapsed.has(s):c,selected:i.includes(e.ref)&&!(c&&"part"===e.kind&&"keys"===this.selection.kind),renamable:!0,up:"part"===e.kind?{ok:!this.disabled&&r>=0&&r<a.length-1&&!o,label:na(496,{name:e.name}),menu:na(489)}:void 0,down:"part"===e.kind?{ok:!this.disabled&&r>0&&!o,label:na(494,{name:e.name}),menu:na(470)}:void 0,renaming:this._renaming===e.ref?Z`<input
              class="input rename"
              aria-label=${na(541)}
              .value=${e.name}
              maxlength="80"
              @click=${e=>e.stopPropagation()}
              @keydown=${t=>{t.stopPropagation(),"Enter"===t.key&&(this._rename(e.ref,t.target.value),this._focusRow(e.ref)),"Escape"===t.key&&(this._renaming=void 0,this._focusRow(e.ref))}}
              @blur=${t=>this._rename(e.ref,t.target.value)}
            />`:void 0});if("group"===e.kind){if(!l||this._collapsed.has(s))return[d];const t=!!ub(n,this.layerView??Ul,e.ref,e.ref),i=this._list.row({key:`tracks:${e.ref}`,name:na(1018),bare:!0,level:2,expanded:t,selected:!1,toggles:[],describe:na(1118,{name:e.name})});return t?[d,i,...gb(this._list,n,this.selection,e.ref,3)]:[d,i]}return c?[d,...gb(this._list,n,this.selection,e.ref,2===e.level?3:2)]:[d]}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return Z``;const t=Bb(e),i=this._rows(),n=this._sel,s=sy(e,n),a=1===n.length?n[0]:void 0,r=s.length>=2&&s.every(t=>e.rig?.parts.find(e=>e.id===t)?.from),o=!!a&&a.startsWith("part:")&&(e.rig?.parts.find(e=>`part:${e.id}`===a)?.from?.length??0)>1,l=a?.startsWith("part:")?e.rig.parts.findIndex(e=>`part:${e.id}`===a):-1;return Z`<div class="parts" @keydown=${this._onKey}>
      ${!t||this._resplit||this._confirm?Z`${t?Q:Z`<p class="lead">${na(869)}</p>`}${this._renderSource(t)}`:Q}
      ${t?Z`<div class="bar" role="toolbar" aria-label=${na(631)}>
              ${this._iconBtn("mdi:group",na(366),()=>this._group(),!ry(e,n),na(212))}
              ${this._iconBtn("mdi:ungroup",na(1038),()=>this._ungroup(),n.some(e=>e.startsWith("group:")),na(213))}
              ${this._iconBtn("mdi:set-merge",na(454),()=>this._merge(),r)}
              ${this._iconBtn("mdi:call-split",na(864),()=>this._splitBack(),o)}
              ${this._iconBtn("mdi:arrow-up",na(489),()=>this._move(1),l>=0&&l<e.rig.parts.length-1,na(54))}
              ${this._iconBtn("mdi:arrow-down",na(471),()=>this._move(-1),l>0,na(53))}
            </div>
            <ul class="tree" aria-label=${na(388)}>
              ${i.map(e=>this._renderRow(e,i,n))}
            </ul>
            ${this._notice?Z`<p class="help notice" role="note">${this._notice}</p>`:Q}
            <p class="help">${na(163)}</p>
            ${this._resplit||this._confirm?Q:Z`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>(this._resplit=!0,this._confirm=!1)}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>${na(862)}
                  </button>
                </div>`}`:Q}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`}};jy.styles=[Sa,Ca,db,c`
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
    `],Cy([_e({attribute:!1})],jy.prototype,"doc",void 0),Cy([_e({attribute:!1})],jy.prototype,"hass",void 0),Cy([_e({attribute:!1})],jy.prototype,"library",void 0),Cy([_e({type:Number})],jy.prototype,"time",void 0),Cy([_e({type:Boolean})],jy.prototype,"disabled",void 0),Cy([_e({attribute:!1})],jy.prototype,"selection",void 0),Cy([_e({attribute:!1})],jy.prototype,"tile",void 0),Cy([_e({attribute:!1})],jy.prototype,"stage",void 0),Cy([_e({attribute:!1})],jy.prototype,"layerView",void 0),Cy([_e()],jy.prototype,"density",void 0),Cy([$e()],jy.prototype,"_renaming",void 0),Cy([$e()],jy.prototype,"_icon",void 0),Cy([$e()],jy.prototype,"_busy",void 0),Cy([$e()],jy.prototype,"_error",void 0),Cy([$e()],jy.prototype,"_confirm",void 0),Cy([$e()],jy.prototype,"_resplit",void 0),Cy([$e()],jy.prototype,"_collapsed",void 0),Cy([$e()],jy.prototype,"_status",void 0),Cy([$e()],jy.prototype,"_notice",void 0),jy=Cy([be("mc-anim-parts-layers")],jy),Ha({tag:"mc-anim-parts-layers",place:"layers",title:388,order:20,when:e=>"keyframes"===e.kind});var zy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};function Ey(e){const t=(e??"").split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:void 0}let Vy=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._vb=[0,0,24,24],this._scale=1,this._watched=new WeakSet}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._watched=new WeakSet,this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measure())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}get _pieces(){return this._geom?Yb(this._geom):[]}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=Ub(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=Gb(e),this._geom||Wb(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}e.has("doc")&&!this._drag&&(this._live=void 0)}updated(){requestAnimationFrame(()=>this._measure())}_icon(){return this.iconEl??function(e){let t=e;for(;t;)if(t instanceof Element){const e=t.shadowRoot?.querySelector("magic-card")??t.querySelector("magic-card");if(e)return e.shadowRoot?.querySelector('[data-mc-part="icon"]')??void 0;t=t.parentElement??t.getRootNode().host??null}else t=t.host??null}(this)}_measure(){if(!this.isConnected)return;const e=this._icon(),t=this.getBoundingClientRect(),i=this.offsetWidth>0&&t.width>0?t.width/this.offsetWidth:1;let n,s;for(const t of[e,e?.getRootNode()?.host])t&&this._ro&&!this._watched.has(t)&&(this._watched.add(t),this._ro.observe(t));if(e){const a=e.shadowRoot?.querySelector('svg[part="svg"]'),r=(a??e).getBoundingClientRect();r.width>0&&(n={x:(r.left-t.left)/i,y:(r.top-t.top)/i,w:r.width/i,h:r.height/i}),s=Ey(a?.getAttribute("viewBox"))}if(!n&&this.stage?.subject){const e=this.stage.subject;n={x:e.x,y:e.y,w:e.width,h:e.height}}s??=this.stage?.viewBox??Ey(this._geom?.viewBox)??[0,0,24,24],((e,t)=>!!e&&!!t&&Math.abs(e.x-t.x)<.5&&Math.abs(e.y-t.y)<.5&&Math.abs(e.w-t.w)<.5&&Math.abs(e.h-t.h)<.5)(n,this._box)||!n&&!this._box||(this._box=n),s.join(" ")!==this._vb.join(" ")&&(this._vb=s);const a=this.offsetWidth>0&&t.width>0?i:this.stage&&this.stage.scale>0?this.stage.scale:1;Math.abs(a-this._scale)>.001&&(this._scale=a)}get _unit(){return this._box&&this._box.w>0?this._vb[2]/(this._box.w*(this._scale||1)):.1}_toVb(e){const t=this.renderRoot.querySelector("svg.ov"),i=t?.getBoundingClientRect();return i&&i.width?[this._vb[0]+(e.clientX-i.left)/i.width*this._vb[2],this._vb[1]+(e.clientY-i.top)/i.height*this._vb[3]]:[0,0]}_lk(e){return!!this.doc&&!!this.layerView?.locked.length&&nc(this.doc,this.layerView,e)}get _sel(){return wy(this.selection)}_pick(e,t){const i=this._sel;t.shiftKey?My(this,ky([...i,e],e)):t.ctrlKey||t.metaKey?My(this,ky(i.includes(e)?i.filter(t=>t!==e):[...i,e],e)):My(this,ky([e],e))}_onDown(e){if(this.disabled||e.button>0||!this.doc)return;const t=e.target,i=t.closest("[data-pivot]")?.getAttribute("data-pivot"),n=t.closest("[data-anchor]")?.getAttribute("data-anchor"),s=t.closest("[data-ref]")?.getAttribute("data-ref"),a=this._toVb(e),r={pointerId:e.pointerId,kind:"band",start:a,startClient:[e.clientX,e.clientY],startDoc:this.doc,moved:!1,additive:e.shiftKey||e.ctrlKey||e.metaKey};if(i){if(this._lk(i))return;this._drag={...r,kind:"pivot",ref:i}}else if(null!=n&&this.selection.target){if(this._lk(this.selection.target))return;const e=Qb(this.doc,this.selection.target)?.path?.d;if(!e)return;this._drag={...r,kind:"anchor",ref:this.selection.target,index:Number(n),path:Mv(e)}}else{if(s)return void this._pick(s,e);this._drag=r}e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId)}_onMove(e){const t=this._drag;if(!t){const t=e.target.closest?.("[data-ref]")?.getAttribute("data-ref");return void(t!==this._hover&&(this._hover=t))}if(e.pointerId!==t.pointerId)return;if(!t.moved&&Math.hypot(e.clientX-t.startClient[0],e.clientY-t.startClient[1])<3)return;t.moved=!0;const i=this._toVb(e),n=e.shiftKey?0:.25;if("band"===t.kind)this._band=[t.start,i];else if("pivot"===t.kind&&t.ref){const e=[Bo(i[0],n),Bo(i[1],n)];this._live={ref:t.ref,pivot:e},Sy(this,uy(this.doc,t.ref,e),"Move pivot",!0)}else if("anchor"===t.kind&&t.ref&&t.path&&void 0!==t.index){const e=this._pivotOf(t.ref)??[0,0],s=zo(Ro(t.path,t.index,Bo(i[0]-e[0],n),Bo(i[1]-e[1],n)));this._live={ref:t.ref,path:s};const a=Qb(this.doc,t.ref);Sy(this,_y(this.doc,t.ref,{...a.path,d:s}),"Move path point",!0)}}_onUp(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;this._drag=void 0;const i=this.doc,n=this._live;if(this._live=void 0,"band"===t.kind){const e=this._band;if(this._band=void 0,!t.moved||!e)return void(t.additive||My(this,{kind:"none"}));const[n,s]=e,a=Math.min(n[0],s[0]),r=Math.max(n[0],s[0]),o=Math.min(n[1],s[1]),l=Math.max(n[1],s[1]),c=(i.rig?.parts??[]).map(e=>Tb(e.id)).filter(e=>!this._lk(e)).filter(e=>{const t=my(i,e,this._pieces);return!!t&&t[0]>=a&&t[0]+t[2]<=r&&t[1]>=o&&t[1]+t[3]<=l});return void My(this,ky(t.additive?[...this._sel,...c]:c))}if(t.moved&&("pivot"===t.kind&&t.ref&&n?.pivot&&Sy(this,uy(i,t.ref,n.pivot),"Move pivot"),"anchor"===t.kind&&t.ref&&n?.path)){const e=Qb(i,t.ref);e?.path&&Sy(this,_y(i,t.ref,{...e.path,d:n.path}),"Move path point")}}_onCancel(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._drag=void 0,this._band=void 0,this._live=void 0,t.moved&&"band"!==t.kind&&Sy(this,t.startDoc,"pivot"===t.kind?na(480):na(479)))}_onPivotKey(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i||this.disabled||!this.doc||this._lk(t))return;e.preventDefault();const n=e.shiftKey?1:.25,s=this._pivotOf(t)??[12,12];this._nudge?.ref!==t&&(this._nudge={ref:t,doc:this.doc}),Sy(this,uy(this.doc,t,[s[0]+i[0]*n,s[1]+i[1]*n]),"Move pivot",!0)}_onKeyUp(e){const t=this._nudge;t&&e.key.startsWith("Arrow")&&this.doc&&(this._nudge=void 0,this.doc!==t.doc&&Sy(this,this.doc,"Move pivot"))}_onKey(e){if(this.doc&&!this.disabled)if(!e.ctrlKey&&!e.metaKey||"g"!==e.key.toLowerCase()||e.shiftKey)"Escape"===e.key&&this._sel.length&&(e.preventDefault(),My(this,{kind:"none"}));else{if(this._sel.some(e=>this._lk(e)))return;const t=oy(this.doc,this._sel);if(!t.id)return;e.preventDefault(),Sy(this,t.doc,"Group parts"),My(this,ky([Fb(t.id)]))}}_pivotOf(e){return this._live?.ref===e&&this._live.pivot?this._live.pivot:this.doc?gy(this.doc,e,this._pieces,this._vb):void 0}_partPaths(e){const t=this.doc,i=this._pieces;return sy(t,[e]).flatMap(e=>(t.rig.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.d).filter(e=>!!e))}_selected(e,t){const i=this.doc;return e.flatMap(e=>{if(!/^(part|group):/.test(e))return[];const n=my(i,e,this._pieces),s=this._pivotOf(e),a=e===this.selection.target,r=[];if(r.push(Y`${this._partPaths(e).map(e=>Y`<path class="sel-outline" d=${e}></path>`)}`),n&&r.push(Y`<rect class="bbox" x=${n[0]} y=${n[1]} width=${n[2]} height=${n[3]}></rect>`),s&&a&&!this._lk(e)){const n=fy(i,e);r.push(Y`<g
          class="pivot"
          data-pivot=${e}
          tabindex="0"
          role="slider"
          aria-label=${py(i,e)?na(697,{name:n}):na(666,{name:n})}
          aria-valuetext=${`x ${s[0].toFixed(2)}, y ${s[1].toFixed(2)}`}
          @keydown=${t=>this._onPivotKey(t,e)}
        >
          <circle class="pivot-hit" cx=${s[0]} cy=${s[1]} r=${12*t}></circle>
          <circle class="pivot-ring" cx=${s[0]} cy=${s[1]} r=${5*t} style=${"stroke-width: "+2*t}></circle>
          <path class="pivot-cross" d=${`M${s[0]-9*t} ${s[1]}H${s[0]+9*t}M${s[0]} ${s[1]-9*t}V${s[1]+9*t}`} style=${"stroke-width: "+1.5*t}></path>
        </g>`)}return r})}_motionPath(e){const t=this.selection.target;if(!t||!this.doc||!/^(part|group):/.test(t))return Q;const i=this._live?.ref===t&&this._live.path?this._live.path:Qb(this.doc,t)?.path?.d,n=this._pivotOf(t);if(!i||!n)return Q;const s=Mv(i);return Y`<g class="mpath" transform=${`translate(${n[0]} ${n[1]})`}>
      <path class="mline" d=${i} style=${"stroke-width: "+2*e}></path>
      ${this._lk(t)?Q:s.anchors.map((t,i)=>Y`<g class="anchor" data-anchor=${i}>
          <circle class="anchor-hit" cx=${t.x} cy=${t.y} r=${12*e}></circle>
          <circle class="anchor-dot" cx=${t.x} cy=${t.y} r=${4.5*e} style=${"stroke-width: "+1.5*e}></circle>
        </g>`)}
    </g>`}render(){const e=this.doc;if(!e||!Bb(e))return Z``;const t=this._box,i=this._unit,n=this._sel,s=this.layerView,a=s?ec(e,s):new Set,r=this._vb,o=this._band,l=this._hover&&!n.includes(this._hover)?this._hover:void 0,c=e.rig.parts.map(e=>Tb(e.id)).filter(t=>!(a.has(t)||a.has(Fb(ay(e.rig,t.slice(5))?.id??""))||s&&nc(e,s,t))).map(e=>Y`<g class="hit" data-ref=${e}>${this._partPaths(e).map(e=>Y`<path d=${e} style=${"stroke-width: "+8*i}></path>`)}</g>`);return Z`<div
      class="layer"
      @pointerdown=${this._onDown}
      @pointermove=${this._onMove}
      @pointerup=${this._onUp}
      @pointercancel=${this._onCancel}
      @keyup=${this._onKeyUp}
      @pointerleave=${()=>!this._drag&&(this._hover=void 0)}
      @keydown=${this._onKey}
    >
      ${t?Z`<svg
            class="ov"
            viewBox=${r.join(" ")}
            style=${`left: ${t.x}px; top: ${t.y}px; width: ${t.w}px; height: ${t.h}px`}
            role="group"
            aria-label=${na(389)}
          >
            ${c}
            ${l?Y`${this._partPaths(l).map(e=>Y`<path class="hover" d=${e} style=${"stroke-width: "+2*i}></path>`)}`:Q}
            <g style=${`--u: ${i}`}>${this._selected(n,i)}</g>
            ${this._motionPath(i)}
            ${o?Y`<rect class="band" x=${Math.min(o[0][0],o[1][0])} y=${Math.min(o[0][1],o[1][1])}
                  width=${Math.abs(o[1][0]-o[0][0])} height=${Math.abs(o[1][1]-o[0][1])} style=${`stroke-width: ${i}`}></rect>`:Q}
          </svg>`:Q}
    </div>`}};Vy.styles=c`
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
  `,zy([_e({attribute:!1})],Vy.prototype,"doc",void 0),zy([_e({attribute:!1})],Vy.prototype,"hass",void 0),zy([_e({attribute:!1})],Vy.prototype,"library",void 0),zy([_e({type:Number})],Vy.prototype,"time",void 0),zy([_e({type:Boolean})],Vy.prototype,"disabled",void 0),zy([_e({attribute:!1})],Vy.prototype,"selection",void 0),zy([_e({attribute:!1})],Vy.prototype,"tile",void 0),zy([_e({attribute:!1})],Vy.prototype,"stage",void 0),zy([_e({attribute:!1})],Vy.prototype,"layerView",void 0),zy([_e({attribute:!1})],Vy.prototype,"iconEl",void 0),zy([$e()],Vy.prototype,"_box",void 0),zy([$e()],Vy.prototype,"_vb",void 0),zy([$e()],Vy.prototype,"_scale",void 0),zy([$e()],Vy.prototype,"_hover",void 0),zy([$e()],Vy.prototype,"_band",void 0),zy([$e()],Vy.prototype,"_geom",void 0),zy([$e()],Vy.prototype,"_live",void 0),Vy=zy([be("mc-anim-parts-overlay")],Vy),Ha({tag:"mc-anim-parts-overlay",place:"stage-tool",title:388,order:20,when:(e,t)=>"keyframes"===e.kind&&Bb(e)&&"tool"!==t.kind});var Ly=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Py=[{fx:0,fy:0,label:1015},{fx:.5,fy:0,label:1014},{fx:1,fy:0,label:1016},{fx:0,fy:.5,label:423},{fx:.5,fy:.5,label:142},{fx:1,fy:.5,label:752},{fx:0,fy:1,label:113},{fx:.5,fy:1,label:112},{fx:1,fy:1,label:114}],Dy=e=>Math.round(100*e)/100,Hy=(e,t,i)=>[Dy(e[0]+e[2]*t),Dy(e[1]+e[3]*i)];let Ry=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._drawFrom=0,this._drawTo=60}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=Ub(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=Gb(e),this._geom||Wb(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}const t=this._target;if((e.has("selection")||e.has("doc"))&&t&&this.doc){const e=vy(this.doc,t);if(e.length>=2){let t=0;for(;t+1<e.length&&e[t+1][1]===e[0][1];)t++;let i=e.length-1;for(;i-1>t&&e[i-1][1]===e[e.length-1][1];)i--;this._drawFrom=e[t][0],this._drawTo=e[i][0]}}}get _target(){const e=this.selection?.target;return Ib(e)&&this.doc&&function(e,t){const i=Ob(t);return t.startsWith("part:")?!!e.rig?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e.rig?.groups?.some(e=>e.id===i):!!t.startsWith("shape:")&&!!e.rig?.shapes?.some(e=>e.id===i)}(this.doc,e)?e:void 0}_drawMode(e){const t=vy(this.doc,e);if(!t.length)return"none";const i=t[0][1],n=t[t.length-1][1],s=t.every((e,s)=>0===s||(i<n?e[1]>=t[s-1][1]:e[1]<=t[s-1][1]));return s&&0===i&&1===n?"on":s&&1===i&&0===n?"off":"custom"}_emit(e,t){Sy(this,e,t)}_renderName(e){const t=this.doc,i=e.startsWith("group:"),n=sy(t,[e]),s=i?0:t.rig?.parts.find(t=>t.id===Ob(e))?.from?.length??0,a=i?na(367,{count:n.length}):s>1?na(632,{pieces:s}):na(630);return Z`<div class="head">
        <span class="tile-icon"><ha-icon icon=${i?"mdi:folder-outline":"mdi:vector-square"}></ha-icon></span>
        <div class="titles">
          <span class="title">${fy(t,e)}</span>
          <span class="caption">${a} · <span class="mono">${Ob(e)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${na(541)}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${fy(t,e)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${n=>{const s=n.target.value;s.trim()&&s.trim()!==fy(t,e)&&this._emit(ny(t,e,s),na(i?731:732))}}
        />
      </div>
      ${i?Z`<div class="chips">
            ${n.map(e=>Z`<button type="button" class="chip" @click=${()=>My(this,ky([`part:${e}`]))}>${fy(t,`part:${e}`)}</button>`)}
          </div>`:Q}`}_renderPivot(e){const t=this.doc,i=this._geom?Yb(this._geom):[],n=my(t,e,i),s=e.startsWith("group:"),a=s?t.rig?.groups?.find(t=>t.id===Ob(e))?.origin:t.rig?.parts.find(t=>t.id===Ob(e))?.origin,r=py(t,e),o=gy(t,e,i,$l(this._geom?.viewBox))??a,l=(i,n)=>this._emit(uy(t,e,[i,n]),"Move pivot"),c=()=>this._emit(r?uy(t,e,Hy(n,.5,.5)):cy(t,e,void 0),na(r?480:743)),d=(e,t)=>Z`<div class="field">
      <div class="field-head"><label for="pi-p${e}">${t}</label></div>
      <div class="unit">
        <input
          id="pi-p${e}"
          class="input"
          type="number"
          step="0.25"
          inputmode="decimal"
          .value=${o?String(Dy(o[e])):""}
          placeholder=${na(142)}
          ?disabled=${this.disabled}
          @change=${t=>{const i=Number(t.target.value);if(!Number.isFinite(i)||""===t.target.value)return;const n=o??[12,12];0===e?l(i,n[1]):l(n[0],i)}}
        />
        <span class="suffix" aria-hidden="true">${na(1149)}</span>
      </div>
    </div>`;return Z`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${na(665)}</h3>
        <span class=${r?"src is-preset":"src"} data-pivot-source=${r?"track":"part"}>${na(r?696:s?368:633)}</span>
        ${r?Q:(p=!!a,h=()=>this._emit(cy(t,e,void 0),"Reset pivot"),p?Z`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,nt.t)(385,{label:"pivot"})}
    title=${(0,nt.t)(384)}
    @click=${e=>{e.stopPropagation(),h()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:Q)}
      </div>
      <p class="help">
        ${na(r?s?974:975:s?972:973)}
      </p>
      <div class="pair">${d(0,"X")} ${d(1,"Y")}</div>
      ${n?Z`<div class="grid3" role="group" aria-label=${na(s?667:668)}>
            ${Py.map(e=>{const[t,i]=Hy(n,e.fx,e.fy),s=!!o&&Math.abs(o[0]-t)<.01&&Math.abs(o[1]-i)<.01;return Z`<button
                type="button"
                class="cell"
                aria-label=${na(669,{position:na(e.label).toLowerCase()})}
                title=${na(e.label)}
                aria-pressed=${s?"true":"false"}
                ?disabled=${this.disabled}
                @click=${()=>.5===e.fx&&.5===e.fy?c():l(t,i)}
              >
                <i></i>
              </button>`})}
          </div>`:Q}
      ${r?Z`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(hy(t,e,void 0),"Reset to part pivot")}>
              ${na(s?744:745)}
            </button>
          </div>`:Q}
    </section>`;var p,h}_renderDraw(e){const t=this.doc,i=this._drawMode(e),n=Xb(t,e),s=i=>this._emit(yy(t,e,i,this._drawFrom,this._drawTo),na("none"===i?719:"on"===i?271:270)),a=[{id:"none",label:na(603)},{id:"on",label:na(271)},{id:"off",label:na(270)}],r=(t,n,s,a)=>Z`<div class="field">
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
          .value=${String(s)}
          ?disabled=${this.disabled}
          @change=${t=>{const n=Math.max(0,Math.min(100,Number(t.target.value)));Number.isFinite(n)&&(a(n),"on"!==i&&"off"!==i||this._emit(yy(this.doc,e,i,this._drawFrom,this._drawTo),"Draw timing"))}}
        />
        <span class="suffix" aria-hidden="true">%</span>
      </div>
    </div>`;return Z`<section class="group" aria-labelledby="pi-draw">
      <div class="group-head">
        <ha-icon icon="mdi:draw"></ha-icon>
        <h3 id="pi-draw">${na(267)}</h3>
      </div>
      <p class="help">${na(966)}</p>
      <div class="seg full" role="radiogroup" aria-label=${na(267)}>
        ${a.map(e=>Z`<button type="button" role="radio" aria-checked=${i===e.id?"true":"false"} ?disabled=${this.disabled||n&&"none"!==e.id} @click=${()=>s(e.id)}>${e.label}</button>`)}
      </div>
      ${n?Z`<p class="help cap">${Jb()}</p>`:Q}
      ${"custom"===i?Z`<p class="help">${na(1004)}</p>`:Q}
      ${"none"!==i?Z`<div class="pair">
            ${r("pi-df",na(887),this._drawFrom,e=>this._drawFrom=e)}
            ${r("pi-dt",na(189),this._drawTo,e=>this._drawTo=Math.max(e,this._drawFrom))}
          </div>`:Q}
    </section>`}_renderPath(e){const t=this.doc,i=Qb(t,e)?.path,n=!i&&Xb(t,e);return Z`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${na(464)}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${na(349)}</span>
          <p class="help">${na(507)}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${i?"true":"false"} aria-label=${na(349)} ?disabled=${this.disabled||n} @click=${()=>this._emit(_y(t,e,i?void 0:{d:xy}),na(i?724:31))}></button>
      </div>
      ${n?Z`<p class="help cap">${Jb()}</p>`:Q}
      ${i?Z`<div class="field">
              <div class="field-head"><label for="pi-tpl">${na(816)}</label></div>
              <div class="select">
                <select
                  id="pi-tpl"
                  class="input"
                  ?disabled=${this.disabled}
                  @change=${n=>{const s=n.target.value;if(!s)return;const a="arc"===s?xy:Vv(s,[0,0],4);this._emit(_y(t,e,{...i,d:a}),"Path shape"),n.target.value=""}}
                >
                  <option value="">${na(740)}</option>
                  <option value="arc">${na(72)}</option>
                  ${zv.map(e=>Z`<option value=${e.id}>${na(e.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${na(1032)}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${i.follow_rotation?"true":"false"}
                aria-label=${na(1032)}
                ?disabled=${this.disabled}
                @click=${()=>this._emit(_y(t,e,{...i,follow_rotation:!i.follow_rotation}),"Path rotation")}
              ></button>
            </div>`:Q}
    </section>`}_renderKeys(e){const t=this.doc,i=Qb(t,e),n=i?.keyframes.length??0;return Z`<section class="group" aria-labelledby="pi-keys">
      <div class="group-head">
        <ha-icon icon="mdi:timeline-outline"></ha-icon>
        <h3 id="pi-keys">${na(412)}</h3>
      </div>
      <p class="help">
        ${n?na(1165,{count:n}):na(566)}
      </p>
      ${i?Z`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(ey(t,e,void 0),"Remove part animation")}>
              ${na(728)}
            </button>
          </div>`:Q}
    </section>`}render(){const e=this._target;return this.doc&&e?Z`<div class="insp">
      ${this._renderName(e)} ${this._renderPivot(e)} ${this._renderDraw(e)} ${this._renderPath(e)} ${this._renderKeys(e)}
    </div>`:Z``}};Ry.styles=[Sa,Ca,c`
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
    `],Ly([_e({attribute:!1})],Ry.prototype,"doc",void 0),Ly([_e({attribute:!1})],Ry.prototype,"hass",void 0),Ly([_e({attribute:!1})],Ry.prototype,"library",void 0),Ly([_e({type:Number})],Ry.prototype,"time",void 0),Ly([_e({type:Boolean})],Ry.prototype,"disabled",void 0),Ly([_e({attribute:!1})],Ry.prototype,"selection",void 0),Ly([_e({attribute:!1})],Ry.prototype,"tile",void 0),Ly([_e({attribute:!1})],Ry.prototype,"stage",void 0),Ly([$e()],Ry.prototype,"_geom",void 0),Ly([$e()],Ry.prototype,"_drawFrom",void 0),Ly([$e()],Ry.prototype,"_drawTo",void 0),Ry=Ly([be("mc-anim-part-inspector")],Ry),Ha({tag:"mc-anim-part-inspector",place:"inspector",title:630,order:20,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&Ib(t.target)});const Ny="important",Oy=" !"+Ny,Ty=Ke(class extends Ue{constructor(e){if(super(e),1!==e.type||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return null==n?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const n=t[e];if(null!=n){this.ft.add(e);const t="string"==typeof n&&n.endsWith(Oy);e.includes("-")||t?i.setProperty(e,t?n.slice(0,-11):n,t?Ny:""):i[e]=n}}return J}}),Fy=["select","pen","line","rect","ellipse","freehand","erase","motion"],Iy=e=>"string"==typeof e&&Fy.includes(e),By=e=>"string"==typeof e&&e.startsWith("shape:"),qy=e=>"string"==typeof e&&/^(part|group|shape):/.test(e);function Ky(e,t){return"keyframes"===e.kind&&"tool"===t.kind&&Iy(t.tool)}function Uy(e){return"target"===e.kind||"tool"===e.kind&&"select"===e.tool?(e=>By(e)?e.slice(6):void 0)(e.target):void 0}function Gy(e){return"tool"===e.kind&&Iy(e.tool)?e.tool:"select"}const Wy={select:{label:790,icon:"mdi:cursor-default-outline",base:"shape",hint:164},pen:{label:660,icon:"mdi:fountain-pen-tip",base:"path",hint:167},line:{label:431,icon:"mdi:vector-line",base:"line",hint:260},rect:{label:710,icon:"mdi:square-rounded-outline",base:"rect",hint:262},ellipse:{label:301,icon:"mdi:ellipse-outline",base:"ellipse",hint:261},freehand:{label:354,icon:"mdi:draw",base:"stroke",hint:268},erase:{label:315,icon:"mdi:eraser",base:"shape",hint:165},motion:{label:464,icon:"mdi:map-marker-path",base:"path",hint:273}},Zy={fill:"currentColor",stroke:"",strokeWidth:1.5,linecap:"round",layer:"over",radius:2,tolerance:.4,grid:!0,anchors:!0,follow:!1};function Yy(e,t){const i=()=>({stroke:e.stroke||"currentColor",stroke_width:e.strokeWidth,linecap:e.linecap});if(!t)return i();const n={};return e.fill&&(n.fill=e.fill),e.stroke&&Object.assign(n,i()),e.fill||e.stroke||(n.fill="currentColor"),n}const Xy=new class{constructor(){this.options={...Zy},this.hint="",this._hintListeners=new Set,this._listeners=new Set}setHint(e){if(e!==this.hint){this.hint=e;for(const e of this._hintListeners)e()}}onHint(e){return this._hintListeners.add(e),()=>this._hintListeners.delete(e)}set(e){this.options={...this.options,...e},this._emit()}setLastFreehand(e){this.lastFreehand=e,this._emit()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}reset(){this.options={...Zy},this.lastFreehand=void 0,this._emit()}_emit(){for(const e of this._listeners)e()}};let Jy=e=>(0,Af.WP)(e).map(e=>({index:e.index,d:e.d,...e.stroke?{stroke:e.stroke}:{},...e.secondary?{accent:!0}:{},...e.evenodd?{evenodd:!0}:{}}));function Qy(e){const t=ha(e??"icon","m",!1)?.icon;return"string"==typeof t?t:void 0}const ex=new Map;function tx(e,t){return e?.svg?Cf(e):$l(t?.viewBox).join(" ")}function ix(e,t){const i=e.rig;if(i?.svg){const e=function(e){const t=Qt(e);if(t.error)return;const i={paths:t.paths,viewBox:t.viewBox};return t.accentPaths.length&&(i.secondary=t.accentPaths),t.strokes.length&&(i.strokes=t.strokes),t.evenodd&&(i.evenodd=t.evenodd),i}(i.svg);return Promise.resolve(e?{viewBox:e.viewBox,pieces:Jy(e)}:void 0)}const n=i?.icon??Qy(t);if(!n)return Promise.resolve(void 0);let s=ex.get(n);return s||(s=Nb(n,{timeoutMs:4e3}).then(e=>e?{viewBox:e.viewBox,pieces:Jy(e)}:void 0).catch(()=>{}),ex.set(n,s),s.then(e=>{e||ex.delete(n)})),s}var nx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class sx extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new cb(this,{select:(e,t)=>e.startsWith("lane:")?!this.disabled&&mb(this,this.doc,e):this._pick(e.slice(6),t),move:(e,t)=>this._shift(e.slice(6),t),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?hb(e):this.doc?.rig?.shapes?.find(t=>t.id===e.slice(6))?.name??e})}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_pick(e,t){const i=`shape:${e}`;this._select("tool"===this.selection.kind?{kind:"tool",tool:"select",target:i}:{kind:"target",target:i})}_shift(e,t){const i=this.doc,n=i?.rig?.shapes?.find(t=>t.id===e);if(!i||!n)return;const s=Ol(i,e,t);if(s===i)return;const a="under"===this.side,r=i.rig.shapes.filter(e=>"under"===e.layer===a),o="up"===t?a&&r[r.length-1].id===e:!a&&r[0].id===e;this._emit(s,na("up"===t?o?120:119:o?797:796)),this._list.announce(na(1214,{name:n.name,where:na(o?"up"===t?1131:1148:"up"===t?1151:1105)}))}_delete(e){const t=this.doc,i=t?.rig?.shapes?.find(t=>t.id===e);t&&i&&!this.disabled&&!this._list.refuseLocked(`shape:${e}`,i.name)&&(this._emit(Tl(t,e),"Delete shape"),Uy(this.selection)===e&&this._select({kind:"none"}))}_thumb(e,t){const i=e=>e?um(e)??e:"currentColor",n={fill:Ml(e)?i(e.fill):"none",stroke:Sl(e)?i(e.stroke):"none","stroke-width":String(Math.max(e.stroke_width??1,1))};return Z`<svg class="thumb" viewBox=${t} aria-hidden="true">
      ${Y`<path d=${e.d} style=${Ty(n)} stroke-linecap="round" stroke-linejoin="round"></path>`}
    </svg>`}render(){const e=this.doc,t=e?.rig?.shapes??[],i="under"===this.side;if(!e||!t.some(e=>"under"===e.layer===i))return Z``;const n=Uy(this.selection),s=tx(e.rig),a=t.map((e,t)=>({s:e,i:t})).filter(e=>"under"===e.s.layer===i).reverse(),r=a[0].s.id,o=a[a.length-1].s.id;return Z`<ul aria-label=${na(i?825:824)}>
      ${a.map(({s:t})=>{const a=`shape:${t.id}`,l=e.tracks?.find(e=>e.target===a),c=[Bl(e,a)?na(1110):"",l?.path?"moves":""].filter(Boolean).join(", "),d=i&&r===t.id,p=!i&&o===t.id,h=ub(e,this.layerView??Ul,a,a),u=this._list.row({key:a,expanded:h,name:t.name,thumb:this._thumb(t,s),note:c,describe:c,selected:t.id===n&&!(h&&"keys"===this.selection.kind),up:{ok:!this.disabled&&Ol(e,t.id,"up")!==e,label:na(d?122:121,{name:t.name}),menu:na(d?118:489)},down:{ok:!this.disabled&&Ol(e,t.id,"down")!==e,label:na(p?800:799,{name:t.name}),menu:na(p?798:470)},extra:t.id!==n?void 0:Z`<button type="button" class="icon-btn sm danger del" data-ctl="del" tabindex="-1" aria-label=${na(244,{name:t.name})} title=${na(238)} aria-disabled=${this.disabled||this._list.locked(a)?"true":Q} @click=${()=>this._delete(t.id)}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>`});return h?[u,...gb(this._list,e,this.selection,a,2)]:[u]})}
    </ul>
    ${t.length>=48?Z`<p class="empty-note">${na(979)}</p>`:Q}`}}sx.styles=[Vu,db,c`
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
    `],nx([_e({attribute:!1})],sx.prototype,"doc",void 0),nx([_e({attribute:!1})],sx.prototype,"selection",void 0),nx([_e({type:Boolean})],sx.prototype,"disabled",void 0),nx([_e({attribute:!1})],sx.prototype,"hass",void 0),nx([_e({attribute:!1})],sx.prototype,"library",void 0),nx([_e({type:Number})],sx.prototype,"time",void 0),nx([_e({attribute:!1})],sx.prototype,"tile",void 0),nx([_e({attribute:!1})],sx.prototype,"stage",void 0),nx([_e({attribute:!1})],sx.prototype,"layerView",void 0),nx([_e()],sx.prototype,"density",void 0);let ax=class extends sx{constructor(){super(...arguments),this.side="over"}};ax=nx([be("mc-anim-shapes-layers")],ax);let rx=class extends sx{constructor(){super(...arguments),this.side="under"}};rx=nx([be("mc-anim-shapes-under-layers")],rx),Ha({tag:"mc-anim-shapes-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"!==e.layer),title:824,order:5}),Ha({tag:"mc-anim-shapes-under-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"===e.layer),title:825,order:30});var ox=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const lx=[{value:"round",label:760},{value:"butt",label:342},{value:"square",label:875}],cx=[{value:"over",label:625,icon:"mdi:arrange-bring-forward"},{value:"under",label:1035,icon:"mdi:arrange-send-backward"}],dx=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));let px=class extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._refitting=!1}connectedCallback(){super.connectedCallback(),this._unsub=Xy.subscribe(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.()}get _shape(){const e=Uy(this.selection);return e?this.doc?.rig?.shapes?.find(t=>t.id===e):void 0}_emit(e,t,i=!1){e&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_patch(e,t,i){this.doc&&this._emit(Rl(this.doc,e.id,t),i)}_seg(e,t,i,n,s=""){return Z`<div class="field">
      <div class="field-head"><span class="lbl">${e}</span></div>
      <div class="seg full ${s}" role="radiogroup" aria-label=${e} @keydown=${e=>{const s=t.findIndex(e=>e.value===i),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=t[(s+a[e.key]+t.length)%t.length].value,o=e.currentTarget;n(r),requestAnimationFrame(()=>o.querySelector(`[data-val="${r}"]`)?.focus())}}>
        ${t.map(e=>{const t=e.value===i;return Z`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            ?disabled=${this.disabled}
            @click=${()=>t||n(e.value)}
          >
            ${e.icon?Z`<ha-icon icon=${e.icon}></ha-icon>`:Q}${na(e.label)}
          </button>`})}
      </div>
    </div>`}_switch(e,t,i,n,s,a=!1){return Z`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        ${t?Z`<p class="help">${t}</p>`:Q}
      </div>
      <button
        type="button"
        class="switch ${s}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||a}
        @click=${n}
      ></button>
    </div>`}_color(e,t,i,n){return Z`<mc-color-picker
      class=${n}
      allowEntity
      .label=${e}
      .value=${t}
      ?disabled=${this.disabled}
      @value-changed=${e=>{e.stopPropagation();const n=function(e){const t=e.trim();if(t)return/^entity( \d{1,3}%)?$/.test(t)?t:fi(t,"color")}(String(e.detail.value??""));n&&n!==t&&i(n)}}
    ></mc-color-picker>`}_number(e,t,i,n,s,a){return Z`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        id=${e}
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max=${s}
        step=${n}
        .value=${String(i)}
        ?disabled=${this.disabled}
        @change=${e=>{const t=e.target,n=Number(t.value);if(""===t.value||!Number.isFinite(n))return void(t.value=String(i));const r=Math.min(s,Math.max(0,Math.round(100*n)/100));t.value=String(r),r!==i&&a(r)}}
      />
    </div>`}_paint(e,t){return Z`<section class="group" aria-labelledby="h-paint">
      <div class="group-head"><h3 id="h-paint">${na(629)}</h3></div>
      ${e.closed?Z`<div class="paint">
            ${this._switch(na(333),"",void 0!==e.fill,()=>t.fill(void 0!==e.fill?void 0:"currentColor"),"fill-on",void 0!==e.fill&&void 0===e.stroke)}
            ${void 0!==e.fill?this._color(na(334),e.fill,e=>t.fill(e),"fill-color"):Q}
          </div>`:Q}
      <div class="paint">
        ${this._switch(na(914),e.closed?"":na(59),void 0!==e.stroke,()=>t.stroke(void 0!==e.stroke?void 0:"currentColor"),"stroke-on",!e.closed||void 0!==e.stroke&&void 0===e.fill)}
        ${void 0!==e.stroke?Z`${this._color(na(915),e.stroke,e=>t.stroke(e),"stroke-color")}
              <div class="two">
                ${this._number("f-width",na(916),e.width,.25,100,t.width)}
              </div>
              ${this._seg(na(432),lx,e.cap,t.cap,"caps")}`:Q}
      </div>
    </section>`}_smoothing(e,t){const i=Xy.options.tolerance;return Z`<div class="field">
      <div class="field-head"><label for="f-tol">${na(844)}</label><span class="val">${i.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">${na(247)}</span>
        <input
          id="f-tol"
          type="range"
          min=${.05}
          max=${2}
          step=${.05}
          .value=${String(i)}
          aria-valuetext=${na(1230,{size:i.toFixed(2)})}
          ?disabled=${this.disabled}
          @input=${t=>e(Number(t.target.value),!1)}
          @change=${t=>e(Number(t.target.value),!0)}
        />
        <span aria-hidden="true">${na(841)}</span>
      </div>
      <p class="help">${t}</p>
    </div>`}_refit(e,t){Xy.set({tolerance:e});const i=Xy.lastFreehand,n=i&&this.doc?.rig?.shapes?.find(e=>e.id===i.id);if(!n||!this.doc)return;const s=ll(i.raw,e);if(s.d){if(!t){if(s.d===n.d)return;return this._refitting=!0,void this._emit(Rl(this.doc,n.id,{d:s.d}),"Smooth stroke",!0)}(s.d!==n.d||this._refitting)&&this._emit(Rl(this.doc,n.id,{d:s.d}),"Smooth stroke"),this._refitting=!1}}_renderShape(e){const t=this.doc,i=`shape:${e.id}`,n=/[Zz]\s*$/.test(e.d)||Ml(e),s=t.rig?.shapes??[],a=s.findIndex(t=>t.id===e.id),r=t.tracks?.find(e=>e.target===i),o=Xy.lastFreehand?.id===e.id;return Z`
      <section class="group" aria-labelledby="h-shape">
        <div class="group-head"><h3 id="h-shape">${na(816)}</h3><span class="id" title=${na(923)}>${i}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">${na(541)}</label></div>
          <input
            id="f-name"
            class="input"
            .value=${e.name}
            maxlength="80"
            ?disabled=${this.disabled}
            @change=${t=>{const i=t.target,n=i.value.trim();n?n!==e.name&&this._patch(e,{name:n},"Rename shape"):i.value=e.name}}
          />
        </div>
        ${this._seg(na(417),cx,e.layer,t=>this._patch(e,{layer:t},na("under"===t?819:818)),"layer")}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled||a>=s.length-1} @click=${()=>this._emit(Nl(t,e.id,a+1),"Bring shape forward")}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>${na(117)}
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled||a<=0} @click=${()=>this._emit(Nl(t,e.id,a-1),"Send shape backward")}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>${na(795)}
          </button>
        </div>
      </section>
      ${this._paint({fill:Ml(e)?e.fill??"currentColor":void 0,stroke:Sl(e)?e.stroke:void 0,width:e.stroke_width??1,cap:e.linecap??"butt",closed:n},{fill:t=>this._patch(e,{fill:t},na(t?144:721)),stroke:t=>this._patch(e,t?{stroke:t,stroke_width:e.stroke_width??1}:{stroke:void 0,stroke_width:void 0,linecap:void 0},na(t?147:727)),width:t=>this._patch(e,{stroke_width:dx(t)},"Change stroke width"),cap:t=>this._patch(e,{linecap:t},"Change line ends")})}
      ${o?Z`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">${na(354)}</h3></div>
            ${this._smoothing((e,t)=>this._refit(e,t),na(462))}
          </section>`:Q}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">${na(66)}</h3></div>
        ${this._switch(na(271),Ml(e)?na(965):na(959),Bl(t,i),()=>Bl(t,i)?this._emit(function(e,t){const i=Fl(e,t);if(!i)return e;const n=i.keyframes.map(e=>{const t={...e};return delete t.draw,t}).filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e)),s={...i,keyframes:n};return Il(e,n.length||s.path?s:void 0,t)??e}(t,i),"Remove draw on"):this._emit(function(e,t){const i=Fl(e,t),n=(i?.keyframes??[]).map(e=>({...e}));for(const[e,t]of[[0,0],[100,1]]){const i=n.find(t=>t.at===e);i?i.draw=t:n.push({at:e,draw:t})}return n.sort((e,t)=>e.at-t.at),Il(e,{...i??{target:t},target:t,keyframes:n},t)}(t,i),"Draw on"),"draw-on")}
        <div class="field">
          <div class="field-head"><span class="lbl">${na(464)}</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${()=>this._select({kind:"tool",tool:"motion",target:i})}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${na(r?.path?712:269)}
            </button>
            ${r?.path?Z`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${()=>this._emit(ql(t,i,void 0,!1),"Remove motion path")}>
                  ${na(715)}
                </button>`:Q}
          </div>
          ${r?.path?this._switch(na(351),na(983),!!r.path.follow_rotation,()=>{const e=(t.tracks??[]).map(e=>e===r?{...e,path:{...e.path,follow_rotation:!e.path.follow_rotation}}:e);this._emit({...t,tracks:e},"Follow the path")},"follow"):Z`<p class="help">${na(272)}</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${()=>{this._emit(Tl(t,e.id),"Delete shape"),this._select({kind:"tool",tool:"select"})}}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${na(238)}
        </button>
      </section>
    `}_opt(e){Xy.set(e)}_renderTool(e){const t=Xy.options,i=Wy[e],n="pen"===e||"line"===e||"rect"===e||"ellipse"===e||"freehand"===e,s="rect"===e||"ellipse"===e||"pen"===e,a=this.selection.target;return Z`
      <section class="group" aria-labelledby="h-tool">
        <div class="group-head tool-head"><ha-icon icon=${i.icon}></ha-icon><h3 id="h-tool">${na(i.label)}</h3></div>
        <p class="help lead">${na(i.hint)}</p>
        ${"motion"===e?qy(a)?Z`<p class="help">${aa(509,{target:Z`<span class="id">${a}</span>`})}</p>
                ${this._switch(na(351),na(405),t.follow,()=>this._opt({follow:!t.follow}),"follow-opt")}`:Z`<p class="help">${na(791)}</p>`:Q}
        ${"rect"===e?this._number("f-radius",na(206),t.radius,.5,12,e=>this._opt({radius:e})):Q}
        ${"freehand"===e||"motion"===e?this._smoothing((t,i)=>"freehand"===e?this._refit(t,i):this._opt({tolerance:t}),"freehand"===e&&Xy.lastFreehand?na(149):na(461)):Q}
      </section>
      ${n?Z`${this._paint({fill:s&&t.fill||void 0,stroke:t.stroke||(s?void 0:"currentColor"),width:t.strokeWidth,cap:t.linecap,closed:s},{fill:e=>this._opt({fill:e??""}),stroke:e=>this._opt({stroke:e??""}),width:e=>this._opt({strokeWidth:dx(e)}),cap:e=>this._opt({linecap:e})})}
            <section class="group" aria-labelledby="h-new">
              <div class="group-head"><h3 id="h-new">${na(552)}</h3></div>
              ${this._seg(na(417),cx,t.layer,e=>this._opt({layer:e}),"layer")}
            </section>`:Q}
      ${"erase"!==e&&"select"!==e?Z`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">${na(848)}</h3></div>
            ${this._switch(na(365),na(690),t.grid,()=>this._opt({grid:!t.grid}),"snap-grid")}
            ${this._switch(na(60),na(689),t.anchors,()=>this._opt({anchors:!t.anchors}),"snap-anchors")}
          </section>`:Q}
    `}render(){if(!this.doc)return Z``;const e=this._shape;return e?this._renderShape(e):"tool"===this.selection.kind&&Iy(this.selection.tool)?this._renderTool(Gy(this.selection)):Z``}};px.styles=[Vu,c`
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
    `],ox([_e({attribute:!1})],px.prototype,"doc",void 0),ox([_e({attribute:!1})],px.prototype,"selection",void 0),ox([_e({type:Boolean})],px.prototype,"disabled",void 0),ox([_e({attribute:!1})],px.prototype,"hass",void 0),ox([_e({attribute:!1})],px.prototype,"library",void 0),ox([_e({type:Number})],px.prototype,"time",void 0),ox([_e({attribute:!1})],px.prototype,"tile",void 0),ox([_e({attribute:!1})],px.prototype,"stage",void 0),px=ox([be("mc-anim-shape-inspector")],px),Ha({tag:"mc-anim-shape-inspector",place:"inspector",when:function(e,t){return"keyframes"===e.kind&&("tool"===t.kind?Iy(t.tool):"target"===t.kind&&By(t.target)&&!!e.rig?.shapes?.some(e=>`shape:${e.id}`===t.target))},title:275,order:30});var hx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const ux=e=>e?um(e)??e:void 0,mx=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))};let gx=class extends fe{constructor(){super(...arguments),this._selection={kind:"none"},this.disabled=!1,this.time=0,this.preview=!1,this._penSel=-1,this._anchorSel=-1,this._dropping=!1,this._announce="",this._piecesKey="",this._endNudge=()=>{const e=this._nudge;if(!e)return;this._nudge=void 0;const t=Math.round(100*e.dx)/100,i=Math.round(100*e.dy)/100;this._emitDoc(Rl(e.base,e.id,{d:bl(e.d,t,i)}),"Nudge shape"),this._followFreehand(e.id,t,i)},this._onKeyUp=e=>{/^Arrow/.test(e.key)&&this._endNudge()},this._onKey=e=>{if(this.disabled||!this.doc)return;if(this._drag&&"Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this._end(!1);if(/^Arrow/.test(e.key)||this._endNudge(),this._pen){if("Enter"===e.key)e.preventDefault(),this._finishPen(!1);else if("Escape"===e.key)e.preventDefault(),e.stopPropagation(),this._finishPen(!1);else if("Backspace"===e.key||"Delete"===e.key){e.preventDefault();const t=Ho(this._pen,this._pen.anchors.length-1);this._pen=t.anchors.length?t:void 0,this._penSel=t.anchors.length-1}return}const t=this._selectedId;if("Escape"===e.key&&t)return e.preventDefault(),e.stopPropagation(),void mx(this,{kind:"tool",tool:"select"});if(!t)return;if(this._refuseLocked(t))return;if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),this._emitDoc(Tl(this.doc,t),"Delete shape"),void mx(this,{kind:"tool",tool:"select"});const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i)return;if(e.preventDefault(),this._nudge&&this._nudge.id!==t&&this._endNudge(),!this._nudge){const e=this._shapes.find(e=>e.id===t);if(!e)return;this._nudge={id:t,base:this.doc,d:e.d,dx:0,dy:0}}const n=this._nudge,s=e.shiftKey?1:.1;n.dx+=i[0]*s,n.dy+=i[1]*s,this._emitDoc(Rl(n.base,t,{d:bl(n.d,Math.round(100*n.dx)/100,Math.round(100*n.dy)/100)}),"Nudge shape",!0)},this._onDragOver=e=>{!this.disabled&&e.dataTransfer?.types?.includes("Files")&&(e.preventDefault(),this._dropping=!0)},this._onDragLeave=()=>{this._dropping=!1},this._onDrop=async e=>{this._dropping=!1;const t=e.dataTransfer?.files?.[0];if(!t||this.disabled)return;e.preventDefault();const i=await bv(t);if(this._dialog??=this.renderRoot.querySelector("mc-anim-svg-dialog")??void 0,"error"in i)return this._announce=va(i.error),void this._dialog?.openImport("",t.name);this._dialog?.openImport(i.text,t.name)}}get selection(){return this._selection}set selection(e){const t=e??{kind:"none"};this._pen&&"pen"!==Gy(t)&&this._finishPen(!1),this._selection=t}get penPath(){return this._pen}connectedCallback(){super.connectedCallback(),this._unsub=Xy.subscribe(()=>this.requestUpdate()),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>{const e=this.getBoundingClientRect();e.width&&e.height&&(e.width!==this._box?.width||e.height!==this._box?.height)&&(this._box={width:e.width,height:e.height})}),this._ro.observe(this)),this._parent=this.parentNode,this.addEventListener("keydown",this._onKey),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("blur",this._endNudge),this.addEventListener("dragover",this._onDragOver),this.addEventListener("dragleave",this._onDragLeave),this.addEventListener("drop",this._onDrop)}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this._ro?.disconnect(),this._ro=void 0,this.removeEventListener("keydown",this._onKey),this.removeEventListener("keyup",this._onKeyUp),this.removeEventListener("blur",this._endNudge),this.removeEventListener("dragover",this._onDragOver),this.removeEventListener("dragleave",this._onDragLeave),this.removeEventListener("drop",this._onDrop),this._end(!0),this._endNudge(),this._finishPen(!1),Xy.setHint("")}firstUpdated(){this.hasAttribute("tabindex")||(this.tabIndex=0)}willUpdate(e){if(e.has("selection")){const t=e.get("selection");t?.target!==this.selection.target&&(this._anchorSel=-1)}if((e.has("doc")||e.has("tile")||e.has("pieces"))&&!this.pieces&&this.doc){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._piecesKey&&(this._piecesKey=e,ix(this.doc,this.tile).then(t=>{this._piecesKey===e&&(this._resolved=t)}))}}get _viewBox(){return this.viewBox??this.stage?.viewBox?.join(" ")??tx(this.doc?.rig,this._resolved)}_view(){const e=this.stage&&this.stage.scale>0?this.stage.scale:1,t=this._cardView(e);return{w:t.w*e,h:t.h*e,k:t.k*e,ox:t.ox*e,oy:t.oy*e,vb:t.vb}}_cardView(e){const t=this.stage?.rect?.width||this.stageRect?.width||(this._box?this._box.width/e:0)||360,i=this.stage?.rect?.height||this.stageRect?.height||(this._box?this._box.height/e:0)||240,n=$l(this._viewBox),s=this.iconRect??this.stage?.subject??this.stageRect?.subject??this.subjectRect;let a;if(s&&s.width>8&&s.height>8)a=s;else{const e=Math.max(48,Math.min(t,i)-48);a={x:(t-e)/2,y:(i-e)/2,width:e,height:e}}const r=Math.min(a.width/n[2],a.height/n[3]);return{w:t,h:i,k:r,vb:n,ox:a.x+(a.width-n[2]*r)/2-n[0]*r,oy:a.y+(a.height-n[3]*r)/2-n[1]*r}}_toStage(e,t){return[e.ox+t[0]*e.k,e.oy+t[1]*e.k]}_toVB(e,t){return[(t[0]-e.ox)/e.k,(t[1]-e.oy)/e.k]}_local(e,t){const i=this.getBoundingClientRect(),n=i.width?t.w/i.width:1,s=i.height?t.h/i.height:1;return[(e.clientX-i.left)*n,(e.clientY-i.top)*s]}get _previewShapes(){return this.preview||!!this.tile&&!Qy(this.tile)}get _shapes(){return this.doc?.rig?.shapes??[]}get _pieceList(){return this.pieces??this._resolved?.pieces??[]}_isLocked(e){return!!this.doc&&!!this.layerView?.locked.length&&nc(this.doc,this.layerView,`shape:${e}`)}_refuseLocked(e){return!!this._isLocked(e)&&(this._announce=na(1205,{name:this._shapes.find(t=>t.id===e)?.name??na(816)}),!0)}get _selectedId(){return Uy(this.selection)}_snapAnchors(e){if(!Xy.options.anchors)return this._pen?.anchors.length?[[this._pen.anchors[0].x,this._pen.anchors[0].y]]:[];const t=this._anchorCache,i=this._shapes,n=this._pieceList;if(!t||t.shapes!==i||t.pieces!==n||t.exclude!==e){const t=[];for(const e of n)t.push(...yl(e.d));for(const n of i)n.id!==e&&t.push(...yl(n.d));this._anchorCache={shapes:i,pieces:n,exclude:e,pts:t}}return this._pen?[...this._anchorCache.pts,...this._pen.anchors.map(e=>[e.x,e.y])]:this._anchorCache.pts}_snap(e,t,i,n){if(i)return this._snapAt=void 0,[Math.round(100*t[0])/100,Math.round(100*t[1])/100];const s=function(e,t){if(t.anchors?.length&&t.radius){let i,n=t.radius;for(const s of t.anchors){const t=Xo(s,e);t<=n&&(n=t,i=s)}if(i)return{p:[i[0],i[1]],kind:"anchor"}}return t.grid&&t.grid>0?{p:[ul(Math.round(e[0]/t.grid)*t.grid),ul(Math.round(e[1]/t.grid)*t.grid)],kind:"grid"}:{p:[ul(e[0]),ul(e[1])],kind:null}}(t,{grid:Xy.options.grid?1:0,anchors:this._snapAnchors(n),radius:10/e.k});return this._snapAt="anchor"===s.kind?s.p:void 0,s.p}_emitDoc(e,t,i=!1){i||(this._announce=t),(this.isConnected?this:this._parent?.isConnected?this._parent:this).dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_commitShape(e,t,i){if(!this.doc||!t)return;if(this._shapes.length>=cs)return void(this._announce=na(77,{count:cs}));const n=Wy[e],s=Vl(Dl(this.doc),n.base),a=this._shapes.filter(e=>e.id.startsWith(`${n.base}-`)).length+1,r={id:s,name:`${na("pen"===e?654:"freehand"===e?914:n.label)} ${a}`,d:t,layer:Xy.options.layer,...Yy(Xy.options,i)},o=Hl(this.doc,r);return o?(this._emitDoc(o,`Draw ${e}`),s):void 0}_finishPen(e){const t=this._pen;if(this._pen=void 0,this._penSel=-1,!t||t.anchors.length<2)return;const i=e?Io(t,!0):t;this._commitShape("pen",zo(i),i.closed)}_capture(e){e.preventDefault();try{this.renderRoot.querySelector("svg.stage")?.setPointerCapture(e.pointerId)}catch{}}_onDown(e){if(this.disabled||e.button>0||!this.doc||this._drag)return;this._endNudge(),this.focus({preventScroll:!0,focusVisible:!1});const t=this._view(),i=this._local(e,t),n=this._toVB(t,i),s=Gy(this.selection);switch(s){case"select":{const s=zl(this._shapes.filter(e=>!this._isLocked(e.id)),n,6/t.k);if(!s){const e=zl(this._shapes,n,6/t.k);if(e&&this._refuseLocked(e))return;return void(this._selectedId&&mx(this,{kind:"tool",tool:"select"}))}s!==this._selectedId&&mx(this,{kind:"tool",tool:"select",target:`shape:${s}`});const a=this._shapes.find(e=>e.id===s);return this._capture(e),void(this._drag={kind:"move",pointerId:e.pointerId,id:s,base:this.doc,d:a.d,start:n,startStage:i,moved:!1,delta:[0,0]})}case"erase":return this._capture(e),this._drag={kind:"erase",pointerId:e.pointerId,base:this.doc,ids:[]},void this._eraseAt(n,t);case"line":case"rect":case"ellipse":{const i=this._snap(t,n,e.shiftKey&&"line"===s);return this._capture(e),void(this._drag={kind:"box",tool:s,pointerId:e.pointerId,a:i,b:i,shift:e.shiftKey,alt:e.altKey})}case"freehand":case"motion":return"motion"!==s||qy(this.selection.target)?"motion"===s&&this.doc&&this.layerView&&nc(this.doc,this.layerView,this.selection.target)?void(this._announce=na(927)):(this._capture(e),this._drag={kind:"free",tool:s,pointerId:e.pointerId,raw:[n],poly:`${i[0].toFixed(1)},${i[1].toFixed(1)}`,last:i},void this.requestUpdate()):void(this._announce=na(791));case"pen":return void this._penDown(e,t,i,n)}}_penDown(e,t,i,n){const s=this._pen,a=e=>{const n=s.anchors[e],a=this._toStage(t,[n.x,n.y]);return Math.hypot(a[0]-i[0],a[1]-i[1])<=13};if(s&&s.anchors.length>=2&&a(0))return void this._finishPen(!0);if(s&&s.anchors.length>=2&&a(s.anchors.length-1))return void this._finishPen(!1);const r=this._snap(t,n,e.shiftKey),o=Do(s??{anchors:[],closed:!1},r);o.index<0?this._announce=na(970):(this._pen=o.path,this._penSel=o.index,this._capture(e),this._drag={kind:"pen",pointerId:e.pointerId,index:o.index,startStage:i,moved:!1})}_eraseAt(e,t){const i=this._drag;if("erase"!==i?.kind)return;let n=i.base;for(const e of i.ids)n=Tl(n,e);const s=zl((n.rig?.shapes??[]).filter(e=>!this._isLocked(e.id)),e,6/t.k);s&&(i.ids.push(s),this._emitDoc(Tl(n,s),"Erase shape",!0))}_onAnchorDown(e,t,i){if(this.disabled||e.button>0||!this.doc)return;e.stopPropagation();const n=this._selectedId,s=n?this._shapes.find(e=>e.id===n):void 0;if(!s||this._refuseLocked(s.id))return;const a=this._view(),r=this._local(e,a),o=this._toVB(a,r),l=Mv(s.d),c=l.anchors[t];if(!c)return;const d=i?c[i]:[c.x,c.y];this._anchorSel=t,this._capture(e),this._drag={kind:"anchor",pointerId:e.pointerId,id:s.id,base:this.doc,path:l,index:t,which:i,grab:[d[0]-o[0],d[1]-o[1]],startStage:r,moved:!1}}_onMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=this._view(),n=this._local(e,i),s=this._toVB(i,n);switch(t.kind){case"box":return t.b=this._snap(i,s,e.shiftKey&&"line"===t.tool),t.shift=e.shiftKey,t.alt=e.altKey,void this.requestUpdate();case"free":{const n="function"==typeof e.getCoalescedEvents?e.getCoalescedEvents():[];let s=!1;for(const a of n.length?n:[e]){if(t.raw.length>=4e3)break;const e=this._local(a,i);Math.hypot(e[0]-t.last[0],e[1]-t.last[1])<.75||(t.raw.push(this._toVB(i,e)),t.poly+=` ${e[0].toFixed(1)},${e[1].toFixed(1)}`,t.last=e,s=!0)}return void(s&&this.requestUpdate())}case"erase":return void this._eraseAt(s,i);case"move":{if(!t.moved&&Math.hypot(n[0]-t.startStage[0],n[1]-t.startStage[1])<3)return;t.moved=!0;let i=s[0]-t.start[0],a=s[1]-t.start[1];return!e.shiftKey&&Xy.options.grid&&(i=Math.round(i),a=Math.round(a)),t.delta=[Math.round(100*i)/100,Math.round(100*a)/100],void this._emitDoc(Rl(t.base,t.id,{d:bl(t.d,t.delta[0],t.delta[1])}),"Move shape",!0)}case"anchor":{if(!t.moved&&Math.hypot(n[0]-t.startStage[0],n[1]-t.startStage[1])<3)return;t.moved=!0;const a=this._snap(i,[s[0]+t.grab[0],s[1]+t.grab[1]],e.shiftKey,t.id),r=t.path.anchors[t.index],o=t.which?Cv(t.path,t.index,t.which,a,Eo(r)&&!e.altKey):Ro(t.path,t.index,a[0],a[1]);return void this._emitDoc(Rl(t.base,t.id,{d:zo(o)}),t.which?na(477):na(481),!0)}case"pen":{if(!t.moved&&Math.hypot(n[0]-t.startStage[0],n[1]-t.startStage[1])<3)return;if(t.moved=!0,!this._pen)return;const i=e.shiftKey?s:[Math.round(10*s[0])/10,Math.round(10*s[1])/10];return void(this._pen=Cv(this._pen,t.index,"out",i,!e.altKey))}}}_onUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&this._end(!0)}_end(e){const t=this._drag;if(t){this._drag=void 0,this._snapAt=void 0;try{const e=this.renderRoot.querySelector("svg.stage");e?.hasPointerCapture?.(t.pointerId)&&e.releasePointerCapture(t.pointerId)}catch{}if(!e||!this.doc)return"move"===t.kind&&t.moved&&this._emitDoc(t.base,"Move shape"),"anchor"===t.kind&&t.moved&&this._emitDoc(t.base,"Move point"),"erase"===t.kind&&t.ids.length&&this._emitDoc(t.base,"Erase shape"),void this.requestUpdate();switch(t.kind){case"box":{const{tool:e,a:i,b:n}=t;if(Math.hypot(n[0]-i[0],n[1]-i[1])<.2)break;if("line"===e)this._commitShape("line",hl(i,n),!1);else{const s=gl(i,n,t.shift,t.alt);if(s.w<.2||s.h<.2)break;const a="rect"===e?dl(s.x,s.y,s.w,s.h,Xy.options.radius):pl(s.x+s.w/2,s.y+s.h/2,s.w/2,s.h/2);this._commitShape(e,a,!0)}break}case"free":{const e=ll(t.raw,Xy.options.tolerance);if(!e.d)break;if("freehand"===t.tool){const i=this._commitShape("freehand",e.d,e.closed);i&&Xy.setLastFreehand({id:i,raw:t.raw})}else{const t=this.selection.target,i=ql(this.doc,t,e.d,Xy.options.follow);i?this._emitDoc(i,"Draw motion path"):this._announce=na(87,{tracks:24})}break}case"move":t.moved&&(this._emitDoc(Rl(t.base,t.id,{d:bl(t.d,t.delta[0],t.delta[1])}),"Move shape"),this._followFreehand(t.id,t.delta[0],t.delta[1]));break;case"anchor":if(t.moved){const e=this._shapes.find(e=>e.id===t.id);e&&this._emitDoc(Rl(t.base,t.id,{d:e.d}),t.which?na(477):na(481)),Xy.lastFreehand?.id===t.id&&Xy.setLastFreehand(void 0)}break;case"erase":{if(!t.ids.length)break;let e=t.base;for(const i of t.ids)e=Tl(e,i);this._emitDoc(e,1===t.ids.length?na(316):na(317));break}}this.requestUpdate()}}_followFreehand(e,t,i){const n=Xy.lastFreehand;n?.id===e&&(t||i)&&Xy.setLastFreehand({id:e,raw:n.raw.map(e=>[e[0]+t,e[1]+i])})}_grid(e){const t=Gy(this.selection);if(!Xy.options.grid||e.k<6||"select"===t||"erase"===t)return Q;const[i,n,s,a]=e.vb,r=[];for(let t=0;t<=s;t++){const[s]=this._toStage(e,[i+t,n]);r.push(`M${s.toFixed(1)} ${(e.oy+n*e.k).toFixed(1)}v${(a*e.k).toFixed(1)}`)}for(let t=0;t<=a;t++){const[,a]=this._toStage(e,[i,n+t]);r.push(`M${(e.ox+i*e.k).toFixed(1)} ${a.toFixed(1)}h${(s*e.k).toFixed(1)}`)}return Y`<path class="grid" d=${r.join("")}></path>`}_shapesLayer(e){if(!this._previewShapes||!this._shapes.length)return Q;const t=this._selectedId;return Y`<g class="shapes" transform="translate(${e.ox} ${e.oy}) scale(${e.k})">
      ${Al(this._shapes).map(e=>Y`<path class="${e.id===t?"sel":""} ${e.layer}" data-id=${e.id} d=${e.d} style=${Ty(function(e){return{fill:Ml(e)?ux(e.fill)??"currentColor":"none",stroke:Sl(e)?ux(e.stroke)??"currentColor":"none","stroke-width":String(e.stroke_width??1),"stroke-linecap":e.linecap??"butt","stroke-linejoin":"round"}}(e))}></path>`)}
    </g>`}_stageD(e,t){return t?(0,St.Mj)(t).map(t=>{if(!t.length)return"";const i=t=>this._toStage(e,t),n=i(t[0][0]);return`M${n[0].toFixed(1)} ${n[1].toFixed(1)}${t.map(e=>`C${[e[1],e[2],e[3]].map(e=>i(e).map(e=>e.toFixed(1)).join(" ")).join(" ")}`).join("")}`}).join(""):""}_selectionLayer(e){const t=this._selectedId,i=t?this._shapes.find(e=>e.id===t):void 0;if(!i)return Q;const n=_l(i.d),s=n?(()=>{const[t,i]=this._toStage(e,[n.x,n.y]);return Y`<rect class="bbox" x=${t-4} y=${i-4} width=${n.w*e.k+8} height=${n.h*e.k+8} rx="2"></rect>`})():Q;if(1!==(0,St.Mj)(i.d).length||"move"===this._drag?.kind||this._isLocked(i.id))return s;const a=Mv(i.d);return a.anchors.length>100?s:Y`${s}${this._handlesOf(e,a,this._anchorSel,(e,t)=>i=>this._onAnchorDown(i,e,t))}
      ${a.anchors.map((t,i)=>{const[n,s]=this._toStage(e,[t.x,t.y]);return Y`<g class="anchor ${i===this._anchorSel?"sel":""}" data-i=${i} @pointerdown=${e=>this._onAnchorDown(e,i)}>
          <circle cx=${n} cy=${s} r="13" fill="transparent"></circle>
          <rect class="mark" x=${n-4.5} y=${s-4.5} width="9" height="9" rx="1.5"></rect>
        </g>`})}`}_handlesOf(e,t,i,n){const s=t.anchors[i];if(!s)return Q;const a=this._toStage(e,[s.x,s.y]),r=t=>{const r=s[t];if(!r)return Q;const o=this._toStage(e,r);return Y`<line class="hline" x1=${a[0]} y1=${a[1]} x2=${o[0]} y2=${o[1]}></line>
        <g class="handle" data-which=${t} @pointerdown=${n?n(i,t):null}>
          <circle cx=${o[0]} cy=${o[1]} r="13" fill="transparent"></circle>
          <circle class="knob" cx=${o[0]} cy=${o[1]} r="4.5"></circle>
        </g>`};return Y`${r("in")}${r("out")}`}_penLayer(e){const t=this._pen;if(!t)return Q;const i=zo(t),n=t.anchors.length>=2;return Y`<path class="draft" d=${this._stageD(e,i)}></path>
      ${this._handlesOf(e,t,this._penSel)}
      ${t.anchors.map((t,i)=>{const[s,a]=this._toStage(e,[t.x,t.y]);return Y`<g class="anchor pen ${0===i?"first":""} ${i===this._penSel?"sel":""} ${0===i&&n?"closable":""}" data-i=${i}>
          <circle cx=${s} cy=${a} r="13" fill="transparent"></circle>
          ${t.in||t.out?Y`<circle class="mark" cx=${s} cy=${a} r="5"></circle>`:Y`<rect class="mark" x=${s-4.5} y=${a-4.5} width="9" height="9" rx="1.5"></rect>`}
        </g>`})}`}_dragLayer(e){const t=this._drag;if(!t)return Q;if("box"===t.kind){let i="";if("line"===t.tool)i=hl(t.a,t.b);else{const e=gl(t.a,t.b,t.shift,t.alt);e.w>0&&e.h>0&&(i="rect"===t.tool?dl(e.x,e.y,e.w,e.h,Xy.options.radius):pl(e.x+e.w/2,e.y+e.h/2,e.w/2,e.h/2))}return i?Y`<path class="draft ${"line"===t.tool?"":"fillable"}" d=${this._stageD(e,i)}></path>`:Q}return"free"===t.kind?Y`<polyline class="draft" points=${t.poly}></polyline>`:Q}_ghost(e){const t=Xy.lastFreehand;if(!t||!this._shapes.some(e=>e.id===t.id))return Q;const i=Gy(this.selection);if(this._selectedId!==t.id&&"freehand"!==i)return Q;const n=`${e.k}|${e.ox}|${e.oy}`;this._ghostCache?.raw===t.raw&&this._ghostCache.key===n||(this._ghostCache={raw:t.raw,key:n,pts:t.raw.map(t=>this._toStage(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")});const s=this._ghostCache.pts;return Y`<polyline class="ghost-casing" points=${s}></polyline><polyline class="ghost" points=${s}></polyline>`}_motion(e){const t=this.selection.target;if(!qy(t))return Q;const i=this.doc?.tracks?.find(e=>e.target===t);if(!i?.path?.d)return Q;const n=this._targetCentre(t);return n?Y`<path class="motion" d=${this._stageD(e,bl(i.path.d,n[0],n[1]))}></path>`:Q}_targetCentre(e){const[t,i]=e.split(":"),n=this.doc?.rig,s="group"===t?n?.groups?.find(e=>e.id===i)?.parts??[]:[i],a=new Set(s.flatMap(e=>n?.parts.find(t=>t.id===e)?.from??[])),r="shape"===t?this._shapes.find(e=>e.id===i)?.d??"":this._pieceList.filter(e=>a.has(e.index)).map(e=>e.d).join(" "),o=r?_l(r):void 0;if(o)return[o.x+o.w/2,o.y+o.h/2];const l=$l(this._viewBox);return[l[0]+l[2]/2,l[1]+l[3]/2]}_dots(e){const t=this._drag;if((!t||"box"!==t.kind&&"anchor"!==t.kind&&"pen"!==t.kind)&&!this._pen||!Xy.options.anchors)return Q;const i=this._snapAnchors("anchor"===t?.kind?t.id:void 0);return Y`<g class="dots">${i.slice(0,600).map(t=>{const[i,n]=this._toStage(e,t);return Y`<circle cx=${i} cy=${n} r="1.5"></circle>`})}</g>`}_hint(){const e=Gy(this.selection);return this._pen?this._pen.anchors.length<2?na(168):na(Wy.pen.hint):"motion"!==e||qy(this.selection.target)?"select"!==e||this._shapes.length?this._drag||this._selectedId?"":na(Wy[e].hint):na(570):na(792)}updated(){Xy.setHint(this.disabled?"":this._hint())}render(){const e=this._view(),t=Gy(this.selection),[i,n]=this._toStage(e,[e.vb[0],e.vb[1]]);return Z`
      <svg
        class="stage t-${t}"
        viewBox="0 0 ${e.w} ${e.h}"
        preserveAspectRatio="none"
        role="application"
        aria-roledescription=${na(1109)}
        aria-label=${na(1194,{label:na(Wy[t].label),hint:na(Wy[t].hint)})}
        @pointerdown=${e=>this._onDown(e)}
        @pointermove=${e=>this._onMove(e)}
        @pointerup=${e=>this._onUp(e)}
        @pointercancel=${()=>this._end(!1)}
        @lostpointercapture=${e=>{this._drag&&e.pointerId===this._drag.pointerId&&this._end(!0)}}
      >
        <rect class="bg" x="0" y="0" width=${e.w} height=${e.h}></rect>
        ${this._grid(e)}
        <rect class="board" x=${i} y=${n} width=${e.vb[2]*e.k} height=${e.vb[3]*e.k} rx="2"></rect>
        ${this._shapesLayer(e)} ${this._ghost(e)} ${this._motion(e)} ${this._dots(e)} ${this._selectionLayer(e)} ${this._penLayer(e)} ${this._dragLayer(e)}
        ${this._snapAt?(()=>{const[t,i]=this._toStage(e,this._snapAt);return Y`<circle class="snap" cx=${t} cy=${i} r="7"></circle>`})():Q}
      </svg>
      ${this._dropping?Z`<div class="drop">${na(283)}</div>`:Q}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `}};gx.styles=c`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      color: var(--state-icon-color, #44739e);
      --do-accent: var(--primary-color, #03a9f4);
      --do-ink: var(--primary-text-color, #212121);
      --do-surface: var(--card-background-color, #fff);
      --do-fill: color-mix(in srgb, var(--primary-color, #03a9f4) 70%, #000);
      z-index: 1;
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.55;
    }
    /* a tab stop for the keyboard (nudge, delete, finish the pen); pointer focus shows no ring */
    :host(:focus) {
      outline: none;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--do-accent);
      outline-offset: -2px;
    }
    svg.stage {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      display: block;
      cursor: crosshair;
      outline: none;
    }
    svg.stage.t-select {
      cursor: default;
    }
    svg.stage.t-erase {
      cursor: cell;
    }
    .bg {
      fill: transparent;
    }
    .grid {
      fill: none;
      stroke: color-mix(in srgb, var(--do-ink) 6%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .board {
      fill: none;
      stroke: color-mix(in srgb, var(--do-ink) 30%, transparent);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      pointer-events: none;
    }
    .shapes {
      pointer-events: none;
    }
    /* under-layer shapes sit behind the icon on the card; over it here, so they are dimmed */
    .shapes .under {
      opacity: 0.5;
    }
    .ghost-casing {
      fill: none;
      stroke: var(--do-surface);
      stroke-width: 3;
      stroke-linejoin: round;
      opacity: 0.85;
      pointer-events: none;
    }
    .ghost {
      fill: none;
      stroke: var(--do-ink);
      stroke-width: 1.25;
      stroke-dasharray: 2 3;
      stroke-linecap: round;
      pointer-events: none;
    }
    .draft {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: none;
    }
    .draft.fillable {
      fill: color-mix(in srgb, var(--do-accent) 12%, transparent);
    }
    .motion {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1.5;
      stroke-dasharray: 5 4;
      pointer-events: none;
    }
    .bbox {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1;
      pointer-events: none;
    }
    .hline {
      stroke: color-mix(in srgb, var(--do-ink) 55%, transparent);
      stroke-width: 1;
      pointer-events: none;
    }
    .knob {
      fill: var(--do-surface);
      stroke: var(--do-ink);
      stroke-width: 1.5;
    }
    .handle {
      cursor: grab;
    }
    .handle:hover .knob {
      fill: var(--do-accent);
    }
    .anchor {
      cursor: move;
    }
    .anchor .mark {
      fill: var(--do-surface);
      stroke: var(--do-accent);
      stroke-width: 2;
    }
    .anchor.first .mark {
      fill: var(--do-accent);
      stroke: var(--do-surface);
    }
    .anchor.sel .mark {
      fill: var(--do-fill);
      stroke: var(--do-surface);
    }
    .anchor.closable .mark {
      stroke-width: 3;
    }
    .snap {
      fill: none;
      stroke: var(--do-accent);
      stroke-width: 1.5;
      pointer-events: none;
    }
    .dots circle {
      fill: color-mix(in srgb, var(--do-ink) 50%, transparent);
      pointer-events: none;
    }
    .drop {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, var(--do-accent) 10%, transparent);
      border: 2px dashed var(--do-accent);
      border-radius: 12px;
      color: var(--do-ink);
      font-size: 0.875rem;
      font-weight: 500;
      pointer-events: none;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,hx([_e({attribute:!1})],gx.prototype,"doc",void 0),hx([_e({attribute:!1})],gx.prototype,"selection",null),hx([_e({type:Boolean,reflect:!0})],gx.prototype,"disabled",void 0),hx([_e({attribute:!1})],gx.prototype,"layerView",void 0),hx([_e({attribute:!1})],gx.prototype,"tile",void 0),hx([_e({type:Number})],gx.prototype,"time",void 0),hx([_e({attribute:!1})],gx.prototype,"hass",void 0),hx([_e({attribute:!1})],gx.prototype,"library",void 0),hx([_e({attribute:!1})],gx.prototype,"stage",void 0),hx([_e({attribute:!1})],gx.prototype,"stageRect",void 0),hx([_e({attribute:!1})],gx.prototype,"subjectRect",void 0),hx([_e({attribute:!1})],gx.prototype,"iconRect",void 0),hx([_e({attribute:!1})],gx.prototype,"pieces",void 0),hx([_e({type:String})],gx.prototype,"viewBox",void 0),hx([_e({type:Boolean})],gx.prototype,"preview",void 0),hx([$e()],gx.prototype,"_box",void 0),hx([$e()],gx.prototype,"_resolved",void 0),hx([$e()],gx.prototype,"_pen",void 0),hx([$e()],gx.prototype,"_penSel",void 0),hx([$e()],gx.prototype,"_anchorSel",void 0),hx([$e()],gx.prototype,"_snapAt",void 0),hx([$e()],gx.prototype,"_dropping",void 0),hx([$e()],gx.prototype,"_announce",void 0),gx=hx([be("mc-anim-draw-overlay")],gx);const fx=["select","pen","line","rect","ellipse","freehand","erase","motion"];let vx=class extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._key=""}connectedCallback(){super.connectedCallback(),this._offHint=Xy.onHint(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._offHint?.()}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc&&!this.pieces){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._key&&(this._key=e,ix(this.doc,this.tile).then(t=>{this._key===e&&(this._resolved=t)}))}}get _dialog(){return this.renderRoot.querySelector("mc-anim-svg-dialog")}openExport(e=!1){this._dialog?.openExport(e)}openImport(e="",t=""){this._dialog?.openImport(e,t)}_choose(e){const t=this.selection;if((this.doc&&Ky(this.doc,t)?Gy(t):void 0)===e&&"tool"===t.kind)return void mx(this,{kind:"none"});const i=qy(t.target)?t.target:void 0;mx(this,{kind:"tool",tool:e,...i?{target:i}:{}})}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return Z``;const t=Ky(e,this.selection),i=t?Gy(this.selection):void 0,n=t?Xy.hint:"",s=this.pieces??this._resolved?.pieces??[],a=Z`<mc-anim-svg-dialog
      .doc=${e}
      .pieces=${s}
      .viewBox=${tx(this.doc?.rig,this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;if(!t)return Z`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${()=>this._choose("select")}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>${na(267)}
        </button>
        ${a}`;const r=qy(this.selection.target);return Z`<div class="bar" role="toolbar" aria-label=${na(276)}>
        ${fx.map(e=>{const t=Wy[e],n=this.disabled||"motion"===e&&!r;return Z`<button
            type="button"
            class="icon-btn tool"
            data-tool=${e}
            aria-pressed=${i===e?"true":"false"}
            aria-label=${na(t.label)}
            title=${na("motion"!==e||r?t.label:466)}
            ?disabled=${n}
            @click=${()=>this._choose(e)}
          >
            <ha-icon icon=${t.icon}></ha-icon>
          </button>`})}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label=${na(394)} title=${na(394)} ?disabled=${this.disabled} @click=${()=>this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label=${na(772)} title=${na(772)} ?disabled=${this.disabled} @click=${()=>this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label=${na(910)} title=${na(910)} @click=${()=>mx(this,{kind:"none"})}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${n?Z`<p class="hint">${n}</p>`:Q}
      ${a}`}};vx.styles=[Vu,c`
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
      .open {
        pointer-events: auto;
        height: 36px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
      }
    `],hx([_e({attribute:!1})],vx.prototype,"doc",void 0),hx([_e({attribute:!1})],vx.prototype,"selection",void 0),hx([_e({type:Boolean})],vx.prototype,"disabled",void 0),hx([_e({attribute:!1})],vx.prototype,"tile",void 0),hx([_e({type:Number})],vx.prototype,"time",void 0),hx([_e({attribute:!1})],vx.prototype,"hass",void 0),hx([_e({attribute:!1})],vx.prototype,"library",void 0),hx([_e({attribute:!1})],vx.prototype,"stage",void 0),hx([_e({attribute:!1})],vx.prototype,"pieces",void 0),hx([$e()],vx.prototype,"_resolved",void 0),vx=hx([be("mc-anim-draw-toolbar")],vx),Ha({tag:"mc-anim-draw-overlay",place:"stage-tool",when:Ky,title:275,order:40}),Ha({tag:"mc-anim-draw-toolbar",place:"stage-tool",when:e=>"keyframes"===e.kind,title:267,order:90,dock:"top"});var bx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const yx=[{target:"element",label:300,icon:"mdi:square-rounded-outline"},{target:"icon",label:383,icon:"mdi:star-outline"},{target:"name",label:541,icon:"mdi:format-title"},{target:"state",label:888,icon:"mdi:numeric"},{target:"background",label:94,icon:"mdi:rectangle-outline"}];function xx(e,t){return!!e.tracks?.some(e=>e.target===t&&(e.keyframes.length>0||!!e.path))||("element"===t||"icon"===t)&&(e.target??"element")===t&&(e.keyframes?.length??0)>0}const _x=la;let $x=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Pa,this.tile="icon",this.density="full",this._list=new cb(this,{select:e=>e.startsWith("lane:")?!this.disabled&&mb(this,this.doc,e):this._select(e.slice(7)),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?hb(e):(e=>{const t=yx.find(t=>t.target===e)?.label;return void 0===t?void 0:na(t)})(e.slice(7))??e})}_select(e){if(this.disabled)return;const t={kind:"target",target:e};this.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}_row(e,t,i){const n=this.doc,s=xx(n,e.target)?(e.target===n.target&&"keyframes"===n.kind?n.keyframes?.length??0:0)+(n.tracks?.find(t=>t.target===e.target)?.keyframes.length??0):0,a=`target:${e.target}`,r=ub(n,this.layerView??Ul,e.target,a),o=this._list.row({key:a,expanded:r,name:na(e.label),icon:e.icon,note:t?void 0:na(589),badge:s?na(1164,{count:s}):void 0,describe:[xx(n,e.target)?na(1096):"",t?"":na(1126,{tile:na(pa(this.tile).label)})].filter(Boolean).join(", "),selected:i===e.target&&!(r&&"keys"===this.selection.kind),toggles:"element"===e.target?["lock"]:void 0,title:t?na(e.label):na(1191,{label:na(e.label),tile:na(pa(this.tile).label)})});return r?[o,...gb(this._list,n,this.selection,e.target,2)]:[o]}render(){const e=this.doc;if(!e)return Q;const t=pa(this.tile),i=(n=this.selection,"target"===n?.kind||"keys"===n?.kind?n.target??n.keys?.[0]?.target:void 0);var n;const s=e=>t.targets.includes(e),a=yx.filter(t=>s(t.target)||xx(e,t.target)||i===t.target),r=yx.filter(e=>!s(e.target));return Z`
      <ul aria-label=${na(137)}>
        ${a.map(e=>this._row(e,s(e.target),i))}
      </ul>
      ${r.length?Z`<p class="hint">
            ${na(1172,{count:r.length,names:_x(r.map(e=>na(e.label))),tile:na(t.label)})}
          </p>`:Q}
    `}};$x.styles=[Vu,db,c`
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
    `],bx([_e({attribute:!1})],$x.prototype,"doc",void 0),bx([_e({attribute:!1})],$x.prototype,"hass",void 0),bx([_e({attribute:!1})],$x.prototype,"library",void 0),bx([_e({type:Number})],$x.prototype,"time",void 0),bx([_e({type:Boolean})],$x.prototype,"disabled",void 0),bx([_e({attribute:!1})],$x.prototype,"selection",void 0),bx([_e({attribute:!1})],$x.prototype,"tile",void 0),bx([_e({attribute:!1})],$x.prototype,"layerView",void 0),bx([_e()],$x.prototype,"density",void 0),$x=bx([be("mc-anim-targets-layers")],$x),Ha({tag:"mc-anim-targets-layers",place:"layers",when:e=>"keyframes"===e.kind,title:137,order:40});var wx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const kx=["lock"],Mx=["hide","lock"],Sx=[];let Cx=class extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this.emitter=0,this.all=!1,this._open=new Map,this._list=new cb(this,{select:e=>this._pick(e),move:(e,t)=>this._move(e,t),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&/^emitter:/.test(e)&&this._multi&&!this._list.refuseLocked(e,this._nameOfKey(e))&&(this._renaming=e),open:(e,t)=>this._open=new Map(this._open).set(e,t),nameOf:e=>this._nameOfKey(e)})}get _multi(){return!!this.doc&&Xg(this.doc)>1}_ems(e){const t=e.particles?.sim?Wl(e):["main"];return Array.from({length:Xg(e)},(i,n)=>({i:n,id:t[n]??`e${n+1}`,name:df(e,0,n),side:of(e,n)}))}_nameOfKey(e){const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this.doc?this._ems(this.doc).find(e=>e.id===t):void 0;return e.startsWith("children:")?na(152,{name:i?.name??t}):i?.name??t}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("emitter-change",{bubbles:!0,composed:!0,detail:{index:e,all:!1}}))}_pick(e){if(this.disabled||!this.doc)return;const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this._ems(this.doc).find(e=>e.id===t);i&&(this._sub=e.startsWith("emitter:")?void 0:e,this._select(i.i))}_side(e,t){return e.filter(e=>e.side===t).reverse()}_move(e,t){const i=this.doc;if(!i||this.disabled)return;const n=this._ems(i),s=n.find(t=>`emitter:${t.id}`===e);if(!s)return;const a=this._side(n,s.side),r=a.indexOf(s),o=n[Math.max(0,Math.min(n.length-1,this.emitter))]?.id;let l,c,d;if("up"===t?"back"===s.side&&0===r:"front"===s.side&&r===a.length-1){const e="back"===s.side?"front":"back";l=function(e,t,i,n){if(!af(e,i)||of(e,i)===n)return{doc:e,index:i};if(1===Xg(e))return{doc:ag(e,{layer:n}),index:0};const s=nf(e,0),[a]=s.splice(i,1);a.layer=n;let r=Math.min(i,s.length);if("front"===n){const e=s.findIndex(e=>"front"===e.layer);e>=0&&(r=e)}else{const e=s.map(e=>e.layer).lastIndexOf("back");e>=0&&(r=e+1)}return s.splice(r,0,a),{doc:sf(e,0,s),index:r}}(i,0,s.i,e).doc,c=na("front"===e?475:473),d=na("front"===e?1211:1210,{name:s.name})}else{const e=a["up"===t?r-1:r+1];if(!e)return;l=function(e,t,i,n){if(!af(e,i)||!af(e,n)||i===n)return e;const s=nf(e,0);return s.splice(n,0,s.splice(i,1)[0]),sf(e,0,s)}(i,0,s.i,e.i),c=na("up"===t?476:474),d=na(1213,{name:s.name,direction:na("up"===t?1151:1105),position:"up"===t?r:r+2,count:a.length})}if(l===i)return;this._emit(l,c),this._list.announce(d);const p=Wl(l).indexOf(o??"");p>=0&&p!==this.emitter&&l.particles?.sim&&this._select(p)}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc,n=i?this._ems(i).find(t=>`emitter:${t.id}`===e):void 0;if(!i||!n||this._list.refuseLocked(e,n.name))return;const s=rf(i,0,n.i,t);s!==i&&this._emit(s,"Rename emitter")}_moveInfo(e,t,i){const n=i.indexOf(e),s="up"===t?"back"===e.side&&0===n:"front"===e.side&&n===i.length-1,a="up"===t?0===n:n===i.length-1,r=!this.disabled&&(s||!a);if(s){const i=na("up"===t?1115:1099);return{ok:r,label:na(498,{name:e.name,where:i}),menu:na(499,{where:i})}}return"up"===t?{ok:r,label:na(496,{name:e.name}),menu:na(489)}:{ok:r,label:na(493,{name:e.name}),menu:na(470)}}_focusRow(e){this._list.focusKey(e)}_renameField(e,t){return Z`<input
      class="input rename"
      aria-label=${na(420)}
      maxlength=${40}
      .value=${e.name}
      @click=${e=>e.stopPropagation()}
      @keydown=${e=>{e.stopPropagation(),"Enter"===e.key?(this._rename(t,e.target.value),this._focusRow(t)):"Escape"===e.key&&(this._renaming=void 0,this._focusRow(t))}}
      @blur=${e=>this._rename(t,e.target.value)}
    />`}_rowsOf(e,t,i,n){const s=`emitter:${t.id}`,a=Ag(e,0),r=0===t.i?a:a.emitters[t.i-1],o=0===t.i?a.children:a.emitters[t.i-1].children,l=!this.all&&Math.min(this.emitter,i.length-1)===t.i,c=this._open.get(s)??(1===i.length||l),d=this._side(i,t.side),p=[this._list.row({key:s,name:t.name,icon:"mdi:shimmer",selected:l&&!this._sub,expanded:c,toggles:n,up:this._moveInfo(t,"up",d),down:this._moveInfo(t,"down",d),renamable:this._multi,renaming:this._renaming===s?this._renameField(t,s):void 0,describe:"front"===t.side?na(1115):na(1099),title:"front"===t.side?na(1221,{name:t.name}):na(1220,{name:t.name})})];if(!c)return p;o&&p.push(this._list.row({key:`children:${t.id}`,name:na(151),icon:"mdi:dots-hexagon",level:2,selected:this._sub===`children:${t.id}`,toggles:n}));const h=(e,t,i)=>{Lg({shapes:e}).forEach((e,n)=>{const s=`pshape:${t}|${n}`;p.push(this._list.row({key:s,name:`${i} ${n+1}: ${vg(e.shape)}`,icon:"mdi:shape-outline",level:2,selected:this._sub===s,toggles:Sx}))})};return h(r.shapes,t.id,na(816)),o&&h(o.shapes,`${t.id}/c`,na(153)),p}updated(e){if((e.has("emitter")&&void 0!==e.get("emitter")||e.has("all")&&void 0!==e.get("all"))&&this.doc&&!this.all){const e=this._ems(this.doc)[Math.min(this.emitter,Xg(this.doc)-1)]?.id;this.renderRoot.querySelector(`[data-lk="emitter:${e}"]`)?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.doc;if(!e||"particles"!==e.kind)return Q;const t=this._ems(e),i=!!e.particles?.sim,n=i&&!!lh(e),s=i?n?void 0:kx:Mx,a=this._side(t,"front"),r=this._side(t,"back");return Z`<ul aria-label=${na(639)}>
        ${a.flatMap(i=>this._rowsOf(e,i,t,s))}
        <li class="lcontent" title=${na(136)}>
          <ha-icon icon="mdi:card-text-outline" aria-hidden="true"></ha-icon><span>${na(135)}</span><span class="sr">${na(8)}</span>
        </li>
        ${r.flatMap(i=>this._rowsOf(e,i,t,s))}
      </ul>
      ${i&&!n?Z`<p class="note">${na(375)}</p>`:Q}`}};Cx.styles=[Vu,db,c`
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
    `],wx([_e({attribute:!1})],Cx.prototype,"doc",void 0),wx([_e({attribute:!1})],Cx.prototype,"selection",void 0),wx([_e({type:Boolean})],Cx.prototype,"disabled",void 0),wx([_e({attribute:!1})],Cx.prototype,"hass",void 0),wx([_e({attribute:!1})],Cx.prototype,"library",void 0),wx([_e({type:Number})],Cx.prototype,"time",void 0),wx([_e({attribute:!1})],Cx.prototype,"tile",void 0),wx([_e({attribute:!1})],Cx.prototype,"stage",void 0),wx([_e({attribute:!1})],Cx.prototype,"layerView",void 0),wx([_e()],Cx.prototype,"density",void 0),wx([_e({type:Number})],Cx.prototype,"emitter",void 0),wx([_e({type:Boolean})],Cx.prototype,"all",void 0),wx([$e()],Cx.prototype,"_open",void 0),wx([$e()],Cx.prototype,"_renaming",void 0),wx([$e()],Cx.prototype,"_sub",void 0),Cx=wx([be("mc-anim-particles-layers")],Cx),Ha({tag:"mc-anim-particles-layers",place:"layers",when:e=>"particles"===e.kind,title:639,order:10});var Ax=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const jx={element:300,icon:383,particles:642};let zx=class extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._sel="path",this._list=new cb(this,{select:e=>this._sel=e,nameOf:e=>"path"===e?na(464):na(505,{subject:this._subject()})})}_subject(){const e=jx[this.doc?.path?.subject??"element"]??jx.element;return na(e)}render(){const e=this.doc;return e&&"path"===e.kind?e.path?.d.trim()?Z`<ul aria-label=${na(656)}>
      ${this._list.row({key:"path",name:na(464),icon:"mdi:vector-curve",selected:"path"===this._sel})}
      ${this._list.row({key:"subject",name:na(505,{subject:this._subject()}),icon:"mdi:arrow-right-bold-outline",selected:"subject"===this._sel})}
    </ul>`:Z`<p class="empty-note">${na(567)}</p>`:Q}};zx.styles=[Vu,db,c`
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
    `],Ax([_e({attribute:!1})],zx.prototype,"doc",void 0),Ax([_e({attribute:!1})],zx.prototype,"selection",void 0),Ax([_e({type:Boolean})],zx.prototype,"disabled",void 0),Ax([_e({attribute:!1})],zx.prototype,"hass",void 0),Ax([_e({attribute:!1})],zx.prototype,"library",void 0),Ax([_e({type:Number})],zx.prototype,"time",void 0),Ax([_e({attribute:!1})],zx.prototype,"tile",void 0),Ax([_e({attribute:!1})],zx.prototype,"stage",void 0),Ax([_e({attribute:!1})],zx.prototype,"layerView",void 0),Ax([_e()],zx.prototype,"density",void 0),Ax([$e()],zx.prototype,"_sel",void 0),zx=Ax([be("mc-anim-path-layers")],zx),Ha({tag:"mc-anim-path-layers",place:"layers",when:e=>"path"===e.kind,title:655,order:10});var Ex=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Vx=class extends fe{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new cb(this,{select:e=>this._sel=e,move:(e,t)=>this._move(Number(e.slice(5)),t),nameOf:e=>this._name(Number(e.slice(5)))})}_name(e){const t=this.doc?.steps?.[e];return t?Gv(t.animation,this.library,this.doc?.id).name:na(906,{i:e+1})}_move(e,t){const i=this.doc,n=i?.steps??[],s="up"===t?e-1:e+1;if(!i||this.disabled||s<0||s>=n.length)return;const a=this._name(e);let r;try{r=this.renderRoot.activeElement?.getAttribute("data-ctl")??void 0}catch{r=void 0}this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:{...i,steps:Wv(n,e,s)},label:na(484)}})),this._list.announce(na(1206,{name:a,to:s+1,count:n.length}),lc(this.layerView??{hidden:[],solo:[],locked:[],open:[]},e,s)),this._sel===`step:${e}`&&(this._sel=`step:${s}`),queueMicrotask(()=>this._list.focusKey(`step:${s}`,r))}render(){const e=this.doc;if(!e||"sequence"!==e.kind)return Q;const t=e.steps??[];return t.length?Z`<ol aria-label=${na(804)}>
      ${t.map((i,n)=>{const s=Gv(i.animation,this.library,e.id),a="ok"===s.status?i.duration??s.defaultDuration:void 0,r=`step:${n}`,o=s.name;return this._list.row({key:r,name:o,thumb:Z`<span class="num" aria-hidden="true">${n+1}</span>`,note:s.problem,badge:void 0!==a?Zv(a):void 0,describe:s.problem?na(1141,{i:n+1,count:t.length,problem:s.problem}):na(1140,{i:n+1,count:t.length}),selected:this._sel===r,up:{ok:!this.disabled&&n>0,label:na(497,{name:o}),menu:na(490)},down:{ok:!this.disabled&&n<t.length-1,label:na(495,{name:o}),menu:na(472)}})})}
    </ol>`:Z`<p class="empty-note">${na(572)}</p>`}};Vx.styles=[Vu,db,c`
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
    `],Ex([_e({attribute:!1})],Vx.prototype,"doc",void 0),Ex([_e({attribute:!1})],Vx.prototype,"selection",void 0),Ex([_e({type:Boolean})],Vx.prototype,"disabled",void 0),Ex([_e({attribute:!1})],Vx.prototype,"hass",void 0),Ex([_e({attribute:!1})],Vx.prototype,"library",void 0),Ex([_e({type:Number})],Vx.prototype,"time",void 0),Ex([_e({attribute:!1})],Vx.prototype,"tile",void 0),Ex([_e({attribute:!1})],Vx.prototype,"stage",void 0),Ex([_e({attribute:!1})],Vx.prototype,"layerView",void 0),Ex([_e()],Vx.prototype,"density",void 0),Ex([$e()],Vx.prototype,"_sel",void 0),Vx=Ex([be("mc-anim-steps-layers")],Vx),Ha({tag:"mc-anim-steps-layers",place:"layers",when:e=>"sequence"===e.kind,title:803,order:10});const Lx=[{id:"state",label:889},{id:"state_not",label:890},{id:"entity_on",label:313},{id:"entity_off",label:312},{id:"above",label:1068},{id:"below",label:1070}],Px=[{id:"cut",label:222,hint:921},{id:"crossfade",label:210,hint:328},{id:"finish",label:337,hint:425}];function Dx(e,t){const i=Number(t),n=""!==t.trim()&&Number.isFinite(i)?i:0,s=t.trim()||"on";switch(e){case"state":return{state:s};case"state_not":return{state_not:s};case"entity_on":return{entity_on:!0};case"entity_off":return{entity_on:!1};case"above":return{above:n};case"below":return{below:n}}}function Hx(e){return e&&"object"==typeof e?(e instanceof Map?[...e.values()]:Array.isArray(e)?e:Object.values(e)).filter(e=>!!e&&"object"==typeof e&&"string"==typeof e.id):[]}const Rx=e=>(e?.length??0)<12;var Nx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ox=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Pa,this._announce=""}get _clips(){return Array.isArray(this.doc?.clips)?this.doc.clips:[]}_write(e,t){if(!this.doc)return;const i={...this.doc};e.length?i.clips=e:delete i.clips,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_patch(e,t,i){this._write(this._clips.map((i,n)=>n===e?{...i,...t}:i),i)}_add(){if(!Rx(this._clips))return;const e=function(e){const t=new Set(e.map(e=>"state"in e.when?e.when.state:""));if(t.has("on")&&t.has("off"))return{when:{above:50},animation:"self",transition:"crossfade"};const i=t.has("on")?"off":"on";return{when:{state:i},animation:"off"===i?"none":"self",transition:"crossfade"}}(this._clips);this._write([...this._clips,e],"Add state"),this._focusAfter=`.clip[data-i="${this._clips.length}"] select.when`,this._announce=na(894,{count:this._clips.length+1,when:jh(e.when)})}_remove(e){const t=this._clips.filter((t,i)=>i!==e);this._write(t,"Delete state"),this._focusAfter=t.length?`.clip[data-i="${Math.min(e,t.length-1)}"] .del`:".add",this._announce=na(896,{i:e+1})}_move(e,t){t<0||t>=this._clips.length||(this._write(function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return[...e];const n=[...e],[s]=n.splice(t,1);return n.splice(i,0,s),n}(this._clips,e,t),"Reorder states"),this._focusAfter=`.clip[data-i="${t}"] .${t<e?"up":"down"}`,this._announce=na(893,{to:t+1}))}updated(){const e=this._focusAfter;if(!e)return;this._focusAfter=void 0;const t=this.renderRoot.querySelector(e);(t&&!t.disabled?t:this.renderRoot.querySelector(".add"))?.focus()}_when(e,t){const i="state"in(n=e.when)?"state":"state_not"in n?"state_not":"entity_on"in n?n.entity_on?"entity_on":"entity_off":"above"in n?"above":"below";var n;const s=function(e){return"state"in e?e.state:"state_not"in e?e.state_not:"above"in e?String(e.above):"below"in e?String(e.below):""}(e.when),a=`st-${t}`,r="above"===i||"below"===i;return Z`<div class="pair">
      <div class="field">
        <div class="field-head"><label for="${a}-k">${na(1081)}</label></div>
        <div class="select">
          <select
            class="input when"
            id="${a}-k"
            ?disabled=${this.disabled}
            @change=${e=>this._patch(t,{when:Dx(e.target.value,s)},"Change state condition")}
          >
            ${Lx.map(e=>Z`<option value=${e.id} ?selected=${e.id===i}>${na(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
      ${"entity_on"===i||"entity_off"===i?Z`<div class="field"><div class="field-head"><span class="lbl">${na(1067)}</span></div><p class="help fill">${na(606)}</p></div>`:Z`<div class="field">
            <div class="field-head"><label for="${a}-v">${na(r?602:888)}</label></div>
            <input
              class="input ${r?"":"mono"}"
              id="${a}-v"
              type=${r?"number":"text"}
              step="any"
              inputmode=${r?"decimal":"text"}
              placeholder=${r?"0":na(1128)}
              autocomplete="off"
              spellcheck="false"
              ?disabled=${this.disabled}
              .value=${s}
              @change=${e=>{const n=e.target.value;!r||""!==n.trim()&&Number.isFinite(Number(n))?this._patch(t,{when:Dx(i,n)},"Change state value"):e.target.value=s}}
            />
          </div>`}
    </div>`}_play(e,t){const i=`st-${t}-a`,n=function(e,t){const i=[{label:na(992),items:[{value:"self",label:na(628)},{value:"none",label:na(596)}]}],n=Hx(e).filter(e=>((e,t)=>!!e&&e.id!==t&&Kv(e)&&!(Array.isArray(e.clips)&&e.clips.length>0))(e,t)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).map(e=>({value:ni+e.id,label:e.name||e.id}));n.length&&i.push({label:na(540),items:n});for(const e of mt){const t=ut.filter(t=>t.group===e&&$i.has(t.id)).map(e=>({value:e.id,label:(0,nt.t)(e.name)}));t.length&&i.push({label:(0,nt.t)(gt[e]),items:t})}return i}(this.library,this.doc?.id),s=n.some(t=>t.items.some(t=>t.value===e.animation));return Z`<div class="field">
      <div class="field-head"><label for=${i}>${na(673)}</label></div>
      <div class="select">
        <select class="input play" id=${i} ?disabled=${this.disabled} @change=${e=>this._patch(t,{animation:e.target.value},"Change state animation")}>
          ${s?Q:Z`<option value=${e.animation} selected>${function(e,t,i){if("self"===e)return na(628);if("none"===e)return na(595);if(si(e)){const n=ai(e),s=Hx(t).find(e=>e.id===n);return s?s.name||s.id:n===i?na(628):na(1180,{id:n})}const n=vt(e)?.name;return void 0!==n?(0,nt.t)(n):na(1154,{animation:e})}(e.animation,this.library,this.doc?.id)}</option>`}
          ${n.map(t=>Z`<optgroup label=${t.label}>
              ${t.items.map(t=>Z`<option value=${t.value} ?selected=${t.value===e.animation}>${t.label}</option>`)}
            </optgroup>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_transition(e,t){const i=e.transition??"cut",n=e=>{e!==i&&this._patch(t,{transition:e},"Change state transition")},s=(Px.find(e=>e.id===i)??Px[0]).hint;return Z`<div class="field">
      <div class="field-head"><span class="lbl" id="st-${t}-t">${na(1020)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="st-${t}-t" aria-describedby="st-${t}-th" @keydown=${e=>{const s=Px.findIndex(e=>e.id===i),a={ArrowRight:(s+1)%Px.length,ArrowLeft:(s-1+Px.length)%Px.length,Home:0,End:Px.length-1}[e.key];void 0!==a&&(e.preventDefault(),n(Px[a].id),this._focusAfter=`.clip[data-i="${t}"] .seg [aria-checked="true"]`)}}>
        ${Px.map(e=>{const t=e.id===i;return Z`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>n(e.id)}>
            ${na(e.label)}
          </button>`})}
      </div>
      <p class="help" id="st-${t}-th">${na(s)}.</p>
    </div>`}_clip(e,t,i){const n=function(e,t,i){if(!si(e.animation)){if("self"===e.animation||"none"===e.animation)return;return vt(e.animation)?$i.has(e.animation)?void 0:na(298):na(1042)}const n=ai(e.animation);if(n===i)return na(1051);const s=Hx(t).find(e=>e.id===n);return s?Array.isArray(s.clips)&&s.clips.length?na(926):Kv(s)?void 0:na(637):na(588)}(e,this.library,this.doc?.id);return Z`<li class="cond clip" data-i=${t}>
      <div class="cond-head">
        <span class="n">${na(895,{i:t+1})} <span class="sub">· ${jh(e.when)}</span></span>
        <button type="button" class="icon-btn sm up" aria-label=${na(483,{i:t+1})} title=${na(488)} ?disabled=${this.disabled||0===t} @click=${()=>this._move(t,t-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm down" aria-label=${na(482,{i:t+1})} title=${na(470)} ?disabled=${this.disabled||t===i-1} @click=${()=>this._move(t,t+1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm danger del" aria-label=${na(240,{i:t+1})} title=${na(239)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${n?Z`<p class="help error">${n}</p>`:Q}
      ${this._when(e,t)} ${this._play(e,t)} ${this._transition(e,t)}
    </li>`}render(){const e=this._clips,t=!Rx(e);return Z`
      <div class="wrap">
        <p class="help lead">
          ${e.length?na(950):na(679)}
        </p>
        ${e.length?Z`<ol class="clips">${e.map((t,i)=>this._clip(t,i,e.length))}</ol>`:Q}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||t} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${na(36)}
          </button>
          ${t?Z`<span class="help">${na(75,{cLIPS_MAX:12})}</span>`:Q}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};Ox.styles=[Vu,c`
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
    `],Nx([_e({attribute:!1})],Ox.prototype,"doc",void 0),Nx([_e({attribute:!1})],Ox.prototype,"hass",void 0),Nx([_e({attribute:!1})],Ox.prototype,"library",void 0),Nx([_e({type:Number})],Ox.prototype,"time",void 0),Nx([_e({type:Boolean,reflect:!0})],Ox.prototype,"disabled",void 0),Nx([_e({attribute:!1})],Ox.prototype,"selection",void 0),Nx([_e({attribute:!1})],Ox.prototype,"tile",void 0),Nx([$e()],Ox.prototype,"_announce",void 0),Ox=Nx([be("mc-anim-states-panel")],Ox),Ha({tag:"mc-anim-states-panel",place:"inspector",when:(e,t)=>"none"===t.kind,title:897,order:60});const Tx=[{id:"rotate_speed",label:759,unit:"°/s",output:[0,720],step:10,hint:860},{id:"rotate",label:758,unit:"°",output:[0,180],step:5,hint:1033},{id:"x",label:468,unit:"px",output:[0,12],step:1,hint:506},{id:"y",label:469,unit:"px",output:[0,-12],step:1,hint:508},{id:"scale",label:777,unit:"×",output:[.8,1.2],step:.05,hint:372},{id:"opacity",label:614,unit:"0-1",output:[.3,1],step:.05,hint:329},{id:"draw",label:267,unit:"0-1",output:[0,1],step:.05,rigOnly:!0,hint:278},{id:"color_mix",label:181,unit:"",output:["#9e9e9e","#ffb300"],step:1,hint:109},{id:"speed",label:681,unit:"×",output:[.25,2],step:.05,hint:685}],Fx=e=>Tx.find(t=>t.id===e)??Tx[0],Ix=e=>Tx.filter(t=>!t.rigOnly||(e=>/^(part|group|shape):/.test(e))(e)),Bx=e=>(e?.bindings?.length??0)<8;function qx(e,t){const i={...e};return t.length?i.bindings=t:delete i.bindings,i}const Kx=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;var Ux=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Gx={element:300,icon:383,name:541,state:888,background:94},Wx={element:1143,icon:1144,name:1145,state:1146,background:1142},Zx=e=>e.target??e.keys?.[0]?.target;let Yx=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=Pa,this._announce="",this._badAttr=new Set}get _target(){return Zx(this.selection)}_write(e,t){this.doc&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:qx(this.doc,e),label:t}}))}_patch(e,t,i){this._write((this.doc?.bindings??[]).map((i,n)=>n===e?t:i),i)}_add(){const e=this._target;if(!e||!this.doc||!Bx(this.doc))return;const t=this.doc.bindings??[],i=function(e){const t=Ix(e)[0];return{target:e,property:t.id,input:{min:0,max:100},output:[...t.output],smoothing:.4}}(e);this._write([...t,i],"Add value binding"),this._focusAfter=`.bind[data-i="${t.length}"] select.prop`,this._announce=na(101,{property:na(Fx(i.property).label)})}_remove(e){const t=(this.doc?.bindings??[]).filter((t,i)=>i!==e);this._write(t,"Delete value binding"),this._focusAfter=".add",this._announce=na(102)}_checkAttr(e,t){const i=!t.trim()||Kx.test(t.trim());if(i!==!this._badAttr.has(e)){const t=new Set(this._badAttr);i?t.delete(e):t.add(e),this._badAttr=t}return i}updated(){const e=this._focusAfter;e&&(this._focusAfter=void 0,this.renderRoot.querySelector(e)?.focus())}_num(e,t,i,n,s){return Z`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        class="input"
        id=${e}
        type="number"
        step=${n}
        inputmode="decimal"
        ?disabled=${this.disabled}
        .value=${String(i)}
        @change=${e=>{const t=e.target,n=Number(t.value);""!==t.value.trim()&&Number.isFinite(n)?n!==i&&s(n):t.value=String(i)}}
      />
    </div>`}_output(e,t){const i=Fx(e.property),n=`bd-${t}`;if("color_mix"===e.property){const[i,n]=e.output,s=(s,a)=>{if(!a)return;const r=[i,n];r[s]=a,this._patch(t,{...e,output:r},"Change binding colours")};return Z`<div class="field">
          <div class="field-head"><span class="lbl">${na(357)}</span></div>
          <mc-color-picker .value=${i} .label=${na(357)} @value-changed=${e=>s(0,e.detail.value)}></mc-color-picker>
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${na(1012)}</span></div>
          <mc-color-picker .value=${n} .label=${na(1012)} @value-changed=${e=>s(1,e.detail.value)}></mc-color-picker>
        </div>`}const[s,a]=e.output,r=i.unit?` (${i.unit})`:"";return Z`<div class="pair">
      ${this._num(`${n}-from`,na(358,{unit:r}),s,i.step,i=>this._patch(t,{...e,output:[i,a]},"Change binding output"))}
      ${this._num(`${n}-to`,na(1017,{unit:r}),a,i.step,i=>this._patch(t,{...e,output:[s,i]},"Change binding output"))}
    </div>`}_binding(e,t,i){const n=`bd-${t}`,s=Fx(e.property),a=Ix(e.target),r=function(e){return e.input.min===e.input.max?na(456):void 0===e.input.attribute||""===e.input.attribute||Kx.test(e.input.attribute)?void 0:na(93)}(e),o=function(e,t){if(!e)return;const i="element"===t.target||"icon"===t.target?e.keyframes:e.tracks?.find(e=>e.target===t.target)?.keyframes;if(!i?.length)return;const n=i,s=e=>n.some(t=>void 0!==e(t));switch(t.property){case"opacity":return s(e=>e.opacity)?na(986):void 0;case"draw":return s(e=>e.draw)?na(985):void 0;case"color_mix":{const e="background"===t.target?s(e=>e.background):s(e=>e.color);return e?na(987):void 0}case"rotate":case"x":case"y":case"scale":return s(e=>e.transform?.skew_x??e.transform?.skew_y)?na(988):void 0;default:return}}(this.doc,e),l=this._badAttr.has(t);return Z`<li class="cond bind" data-i=${t}>
      <div class="cond-head">
        <span class="n">${na(103,{n:i+1})} <span class="sub">· ${na(s.label)}</span></span>
        <button type="button" class="icon-btn sm danger del" aria-label=${na(235,{n:i+1})} title=${na(234)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="${n}-p">${na(706)}</label></div>
        <div class="select">
          <select
            class="input prop"
            id="${n}-p"
            aria-describedby="${n}-ph"
            ?disabled=${this.disabled}
            @change=${i=>this._patch(t,function(e,t){return e.property===t?e:{...e,property:t,output:[...Fx(t).output]}}(e,i.target.value),"Change bound property")}
          >
            ${a.map(t=>Z`<option value=${t.id} ?selected=${t.id===e.property}>${na(t.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        <p class="help" id="${n}-ph">${na(s.hint)}</p>
      </div>
      <fieldset>
        <legend>${na(314)}</legend>
        <div class="field">
          <div class="field-head"><label for="${n}-a">${na(91)}</label></div>
          <input
            class="input mono"
            id="${n}-a"
            type="text"
            placeholder=${na(1139)}
            autocomplete="off"
            spellcheck="false"
            aria-describedby="${n}-ah"
            aria-invalid=${l?"true":"false"}
            ?disabled=${this.disabled}
            .value=${e.input.attribute??""}
            @input=${e=>this._checkAttr(t,e.target.value)}
            @change=${i=>{const n=i.target.value.trim();if(!this._checkAttr(t,n))return;const s={...e.input};n?s.attribute=n:delete s.attribute,this._patch(t,{...e,input:s},"Change binding attribute")}}
          />
          <p class="help ${l?"error":""}" id="${n}-ah">
            ${na(l?92:307)}
          </p>
        </div>
        <div class="pair">
          ${this._num(`${n}-min`,na(455),e.input.min,1,i=>this._patch(t,{...e,input:{...e.input,min:i}},"Change binding range"))}
          ${this._num(`${n}-max`,na(451),e.input.max,1,i=>this._patch(t,{...e,input:{...e.input,max:i}},"Change binding range"))}
        </div>
      </fieldset>
      <fieldset>
        <legend>${na(624)}</legend>
        ${this._output(e,t)}
        ${this._num(`${n}-s`,na(845),e.smoothing??0,.1,i=>{const n={...e};i>0?n.smoothing=Math.min(10,i):delete n.smoothing,this._patch(t,n,"Change binding smoothing")})}
      </fieldset>
      ${o?Z`<p class="help warn">${o}</p>`:Q}
      ${r?Z`<p class="help error" role="alert">${r}</p>`:Q}
    </li>`}render(){const e=this._target;if(!e||!this.doc)return Z``;const t=function(e,t){return t&&Array.isArray(e?.bindings)?e.bindings.map((e,t)=>({b:e,index:t})).filter(e=>e.b.target===t):[]}(this.doc,e),i=!Bx(this.doc),n=Wx[e]?na(Wx[e]):`“${function(e,t){if(Gx[t])return na(Gx[t]);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e?.rig?.parts:"group"===i[1]?e?.rig?.groups:e?.rig?.shapes;return n?.find(e=>e.id===i[2])?.name||i[2]}(this.doc,e)}”`;return Z`
      <div class="wrap">
        <p class="help lead">
          ${t.length?Z`${na(946,{name:n})}`:Z`${na(280,{name:n})}`}
        </p>
        ${t.length?Z`<ol class="binds">${t.map((e,t)=>this._binding(e.b,e.index,t))}</ol>`:Q}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||i} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${na(40)}
          </button>
          ${i?Z`<span class="help">${na(81,{max:8})}</span>`:Q}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};Yx.styles=[Vu,c`
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
    `],Ux([_e({attribute:!1})],Yx.prototype,"doc",void 0),Ux([_e({attribute:!1})],Yx.prototype,"hass",void 0),Ux([_e({attribute:!1})],Yx.prototype,"library",void 0),Ux([_e({type:Number})],Yx.prototype,"time",void 0),Ux([_e({type:Boolean,reflect:!0})],Yx.prototype,"disabled",void 0),Ux([_e({attribute:!1})],Yx.prototype,"selection",void 0),Ux([_e({attribute:!1})],Yx.prototype,"tile",void 0),Ux([$e()],Yx.prototype,"_announce",void 0),Ux([$e()],Yx.prototype,"_badAttr",void 0),Yx=Ux([be("mc-anim-bindings-panel")],Yx),Ha({tag:"mc-anim-bindings-panel",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"target"===t.kind&&!!Zx(t),title:1072,order:60});var Xx=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Jx=[{id:"on",label:604},{id:"off",label:603},{id:"unavailable",label:1034},{id:"value",label:1067,numeric:!0},{id:"custom",label:215}];let Qx=class extends fe{constructor(){super(...arguments),this.disabled=!1,this.selection=Pa,this.time=0,this._choice="on",this._custom="idle",this._value=wh.value,this._sent="",this._picked=!1}get detail(){return{state:"value"===this._choice?function(e,t){const[i,n]=Sh(e).stateRange??[0,100];return String(kh(i+(n-i)*Math.min(1,Math.max(0,t))))}(this.doc,this._value):"custom"===this._choice?this._custom.trim()||"idle":this._choice,value:this._value,attributes:Ch(this.doc,this._value)}}_emit(){const e=this.detail,t=JSON.stringify(e);t!==this._sent&&(this._sent=t,this.dispatchEvent(new CustomEvent("preview-change",{bubbles:!0,composed:!0,detail:e})))}willUpdate(e){e.has("doc")&&!this._picked&&(this._choice=Sh(this.doc).numericState?"value":"on")}updated(e){(e.has("doc")||e.has("_choice")||e.has("_custom")||e.has("_value"))&&this._emit()}_pick(e){this._picked=!0,this._choice=e,"custom"===e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".custom")?.focus())}_states(e){const t=Jx.filter(t=>!t.numeric||e||this._choice===t.id);return Z`<div class="seg" role="radiogroup" aria-label=${na(701)} @keydown=${e=>{const i=t.findIndex(e=>e.id===this._choice),n={ArrowRight:(i+1)%t.length,ArrowLeft:(i-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];void 0!==n&&(e.preventDefault(),this._picked=!0,this._choice=t[n].id,this.updateComplete.then(()=>this.renderRoot.querySelector('.seg [aria-checked="true"]')?.focus()))}}>
      ${t.map(e=>{const t=e.id===this._choice;return Z`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>this._pick(e.id)}>${na(e.label)}</button>`})}
    </div>`}render(){if(!$h(this.doc))return Z``;const e=Sh(this.doc),t=Math.round(100*this._value);return Z`<div class="bar" role="group" aria-label=${na(699)}>
      <span class="lbl" aria-hidden="true"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></span>
      ${this._states(e.numericState)}
      ${"custom"===this._choice?Z`<input
            class="input mono custom"
            type="text"
            aria-label=${na(218)}
            placeholder=${na(888)}
            autocomplete="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            .value=${this._custom}
            @change=${e=>this._custom=e.target.value}
          />`:Q}
      ${e.value?Z`<label class="value">
            <span class="sr-only">${na(703)}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              ?disabled=${this.disabled}
              .value=${String(t)}
              aria-valuetext=${na(1225,{pct:t})}
              @input=${e=>this._value=Number(e.target.value)/100}
            />
            <output aria-hidden="true">${t}%</output>
          </label>`:Q}
    </div>`}};Qx.styles=[Vu,c`
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
    `],Xx([_e({attribute:!1})],Qx.prototype,"doc",void 0),Xx([_e({type:Boolean,reflect:!0})],Qx.prototype,"disabled",void 0),Xx([_e({attribute:!1})],Qx.prototype,"selection",void 0),Xx([_e({type:Number})],Qx.prototype,"time",void 0),Xx([$e()],Qx.prototype,"_choice",void 0),Xx([$e()],Qx.prototype,"_custom",void 0),Xx([$e()],Qx.prototype,"_value",void 0),Qx=Xx([be("mc-anim-stage-sim")],Qx),Ha({tag:"mc-anim-stage-sim",place:"stage-tool",when:e=>$h(e),title:699,order:80,dock:"bottom"});var e_=i(5084),t_=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const i_=e=>!!e&&/^(part|group|shape):/.test(e),n_=(e,t)=>"intensity"===e.id?`${t}×`:"direction"===e.id?na(t<0?750:352):`${t} %`;let s_=class extends fe{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._applied=new Map,this._status=""}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=Ub(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=Gb(e),this._geom||Wb(e).then(t=>{this._ref===e&&(this._geom=t)}))}}get _targets(){const e=wy(this.selection).filter(i_),t=this.selection.target;i_(t)&&!e.includes(t)&&e.unshift(t);for(const t of this.selection.targets??[])i_(t)&&!e.includes(t)&&e.push(t);return e}get _key(){return this._targets.join(",")}_apply(e,t,i=!1){const n=i?this._dragBase??=this.doc:this._dragBase??this.doc;if(!n)return;const s=this._geom?Yb(this._geom):void 0,a=(0,e_.ar)(n,this._targets,e.id,t,{pieces:s});if(i||(this._dragBase=void 0),a===n)return void(i||(this._status=na(993)));const r=new Map(this._applied);r.set(this._key,{preset:e.id,params:t}),this._applied=r;const o=this._targets.map(e=>fy(n,e));this._status=i?"":na(1227,{preset:(0,nt.t)(e.name),targets:o.length>2?na(1175,{count:o.length}):la(o)}),Sy(this,a,`Preset: ${e.id}`,i)}_pickPreset(e,t){const i=e_.tP.find(t=>t.id===e.value);i&&(this._apply(i,t?.preset===i.id?t.params:{}),this._applied.get(this._key)?.preset!==i.id&&(e.value=t?.preset??""))}_clear(){if(!this.doc)return;const e=this._targets.reduce((e,t)=>(0,e_.di)(e,t),this.doc),t=new Map(this._applied);t.delete(this._key),this._applied=t,this._status=na(467),Sy(this,e,"Remove motion")}_openSvg(){this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)}_renderParams(e,t){const i=(0,e_.Cq)(e.id,t);return Z`<div class="params" role="group" aria-label=${na(1216,{name:(0,nt.t)(e.name)})}>
      ${e.params.map(t=>{const n=i[t.id];if("direction"===t.id)return Z`<div class="field">
            <div class="field-head"><span class="lbl" id="pp-dir">${na(249)}</span></div>
            <div class="seg full" role="radiogroup" aria-labelledby="pp-dir">
              ${[1,-1].map(t=>Z`<button
                  type="button"
                  role="radio"
                  data-dir=${t}
                  aria-checked=${n===t?"true":"false"}
                  tabindex=${n===t?0:-1}
                  ?disabled=${this.disabled}
                  @click=${()=>this._apply(e,{...i,direction:t})}
                >
                  <ha-icon icon=${t>0?"mdi:rotate-right":"mdi:rotate-left"}></ha-icon>${na(t>0?352:750)}
                </button>`)}
            </div>
          </div>`;const s=`pp-${t.id}`;return Z`<div class="field">
          <div class="field-head"><label for=${s}>${(0,nt.t)(t.label)}</label><span class="val">${n_(t,n)}</span></div>
          <input
            id=${s}
            class="range"
            type="range"
            data-param=${t.id}
            min=${t.min}
            max=${t.max}
            step=${t.step}
            .value=${String(n)}
            aria-valuetext=${n_(t,n)}
            ?disabled=${this.disabled}
            @input=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)},!0)}
            @change=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)})}
          />
        </div>`})}
    </div>`}updated(){const e=this.renderRoot.querySelector("select#pp-preset"),t=this._applied.get(this._key)?.preset??"";e&&e.value!==t&&(e.value=t)}render(){const e=this.doc,t=this._targets;if(!e||!t.length)return Z``;const i=this._applied.get(this._key),n=i?e_.tP.find(e=>e.id===i.preset):void 0,s=t.some(t=>(Qb(e,t)?.keyframes.length??0)>0),a=this._geom?Yb(this._geom):[];return Z`
      <p class="help">${t.length>1?na(1178,{count:t.length}):na(607)}</p>
      <div class="field">
        <div class="field-head"><label for="pp-preset">${na(695)}</label></div>
        <div class="select">
          <select
            class="input"
            id="pp-preset"
            aria-describedby=${n?.help?"pp-preset-help":Q}
            ?disabled=${this.disabled}
            @change=${e=>this._pickPreset(e.target,i)}
          >
            <option value="" ?selected=${!n} ?disabled=${!!n} ?hidden=${!!n}>${na(156)}</option>
            ${e_.tP.map(e=>Z`<option value=${e.id} data-preset=${e.id} ?selected=${n?.id===e.id}>${(0,nt.t)(e.name)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        ${n?.help?Z`<p class="help" id="pp-preset-help">${(0,nt.t)(n.help)}</p>`:Q}
      </div>
      ${n?this._renderParams(n,i.params):Q}
      <div class="actions">
        ${s?Z`<button type="button" class="btn btn-text btn-sm clear" ?disabled=${this.disabled} @click=${()=>this._clear()}>${na(723)}</button>`:Q}
        <span class="grow"></span>
        <button type="button" class="btn btn-secondary btn-sm export" @click=${()=>this._openSvg()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>${na(64)}
        </button>
      </div>
      <p class="status" role="status" aria-live="polite">${this._status}</p>
      <mc-anim-svg-dialog .doc=${e} .pieces=${a} .viewBox=${this._geom?.viewBox??"0 0 24 24"}></mc-anim-svg-dialog>
    `}};function a_(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}s_.styles=[Sa,Ca,c`
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
    `],t_([_e({attribute:!1})],s_.prototype,"doc",void 0),t_([_e({attribute:!1})],s_.prototype,"hass",void 0),t_([_e({attribute:!1})],s_.prototype,"library",void 0),t_([_e({type:Number})],s_.prototype,"time",void 0),t_([_e({type:Boolean})],s_.prototype,"disabled",void 0),t_([_e({attribute:!1})],s_.prototype,"selection",void 0),t_([_e({attribute:!1})],s_.prototype,"tile",void 0),t_([_e({attribute:!1})],s_.prototype,"stage",void 0),t_([$e()],s_.prototype,"_applied",void 0),t_([$e()],s_.prototype,"_geom",void 0),t_([$e()],s_.prototype,"_status",void 0),s_=t_([be("mc-anim-part-presets")],s_),Ha({tag:"mc-anim-part-presets",place:"inspector",title:634,order:15,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&i_(t.target)}),new Map;var r_=i(1474);let o_,l_;function c_(){return o_??=i.e(334).then(()=>i(1935)).then(e=>(0,Jh.t)("magic-card-icon-library.js",e)??Promise.reject(new Error("the icon library is from another release"))).then(async e=>await e.iconNamesReady()?e:Promise.reject(new Error("the icon names could not be loaded"))).then(e=>l_=e,e=>{throw o_=void 0,console.warn("Magic Card: icon library not loaded",e),e}),o_}var d_=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let p_=class extends fe{constructor(){super(...arguments),this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(e.has("entry")&&(this._card=void 0),this._card)return void(e.has("hass")&&this.hass&&(this._card.hass=this.hass));const t=this.entry;if(!this._visible||!t||!customElements.get("magic-card"))return;const i=t.build(),n=document.createElement("magic-card");try{n.setConfig({type:"custom:magic-card",custom_animations:[i],rows:[{id:"r",columns:[{id:"c",vertical_align:"center",modules:[{id:"m",type:"icon",icon:t.icon,size:"40px",design:{text_align:"center",animations:[{id:"a",preset:`custom:${i.id}`}]}}]}]}]})}catch{return}n.hass=this.hass??Rh(!1),this._card=n}render(){const e=this._visible?this._card:void 0;return Z`<div class="box" aria-hidden="true">${e??Z`<ha-icon icon=${this.entry?.icon??""}></ha-icon>`}</div>`}};p_.styles=[Sa,c`
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
    `],d_([_e({attribute:!1})],p_.prototype,"entry",void 0),d_([_e({attribute:!1})],p_.prototype,"hass",void 0),d_([$e()],p_.prototype,"_visible",void 0),p_=d_([be("mc-anim-icon-thumb")],p_);const h_={alarm_control_panel:44,binary_sensor:100,button:127,calendar:128,camera:129,climate:170,cover:209,device_tracker:248,event:318,fan:331,humidifier:382,lawn_mower:416,light:429,lock:440,media_player:453,person:661,plant:672,sensor:801,siren:832,sun:917,switch:920,timer:1009,vacuum:1066,valve:1074,weather:1077,zone:1088},u_=(e,t)=>t?.localize?.(`component.${e}.title`)||(void 0!==h_[e]?na(h_[e]):null)||e.replace(/_/g," ").replace(/^./,e=>e.toUpperCase());let m_=class extends fe{constructor(){super(...arguments),this.lookup=()=>{},this._icon="mdi:bell-ring",this._query="",this._domain="",this._busy=!1,this._error="",this._lib=l_,this._libFailed=!1}connectedCallback(){super.connectedCallback(),this._lib||this._loadLibrary(),La("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}async _loadLibrary(){this._libFailed=!1;try{this._lib=await c_()}catch{this._libFailed=!0}}_emit(e,t){this.dispatchEvent(new CustomEvent("icon-start",{detail:{doc:e,from:t},bubbles:!0,composed:!0}))}async start(){const e=this._icon.trim();if(yi.test(e)){this._busy=!0,this._error="";try{const t=this._lib??await c_().catch(()=>{}),i=t?.mdiGeometry(e)??await Nb(e);if(!i)return void(this._error=na(996));const n=na(1202,{name:a_(e)}),s=(0,r_.a)(e,i,e.slice(e.indexOf(":")+1),n,{embed:!0});if(!s.rig?.parts.length)return void(this._error=na(997));this._emit(s,"icon")}finally{this._busy=!1}}else this._error=na(664)}focusStart(){const e=this.renderRoot.querySelector("mc-icon-picker, .icon-input");(e?.shadowRoot?.querySelector("input")??e)?.focus({preventScroll:!0})}_renderPick(){const e=La("mc-icon-picker");return Z`<section class="pick" aria-labelledby="is-pick">
      <h3 id="is-pick">${na(885)}</h3>
      <p class="help">${na(954)}</p>
      <div class="pick-row">
        <div class="field grow">
          ${e?Z`<mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${na(383)}
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._error=""}}
              ></mc-icon-picker>`:Z`<input
                class="input mono icon-input"
                aria-label=${na(383)}
                spellcheck="false"
                .value=${Ye(this._icon)}
                @input=${e=>{this._icon=e.target.value,this._error=""}}
                @keydown=${e=>"Enter"===e.key&&void this.start()}
              />`}
        </div>
        <button type="button" class="btn btn-primary btn-sm start" ?disabled=${this._busy} @click=${()=>{this.start()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?na(871):na(863)}
        </button>
      </div>
      ${this._error?Z`<p class="help error" role="alert">${this._error}</p>`:Q}
    </section>`}_renderLibrary(){const e=this._lib,t=Z`<div class="lib-head">
      <h3 id="is-lib">${na(621)}</h3>
      ${e?Z`<span class="chip is-count">${e.ICON_LIBRARY.length}</span>`:Q}
    </div>`;if(!e)return Z`<section class="lib" aria-labelledby="is-lib">
        ${t}
        ${this._libFailed?Z`<p class="help error lib-error" role="alert">${na(955)}</p>
              <div><button type="button" class="btn btn-secondary btn-sm lib-retry" @click=${()=>{this._loadLibrary()}}><ha-icon icon="mdi:refresh"></ha-icon>${na(1023)}</button></div>`:Z`<p class="help lib-loading" role="status">${na(437)}</p>`}
      </section>`;const i=e.searchLibrary(this._query,this._domain||void 0);return Z`<section class="lib" aria-labelledby="is-lib">
      ${t}
      <div class="filters">
        <div class="with-icon grow">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input lib-search"
            type="search"
            placeholder=${na(783)}
            aria-label=${na(785)}
            .value=${Ye(this._query)}
            @input=${e=>this._query=e.target.value}
          />
        </div>
        <select class="input domain" aria-label=${na(251)} .value=${Ye(this._domain)} @change=${e=>this._domain=e.target.value}>
          <option value="">${na(46)}</option>
          ${[...e.LIBRARY_DOMAINS].sort((e,t)=>u_(e,this.hass).localeCompare(u_(t,this.hass))).map(e=>Z`<option value=${e} ?selected=${e===this._domain}>${u_(e,this.hass)}</option>`)}
        </select>
      </div>
      ${i.length?Z`<ul class="grid" role="list">
            ${i.map(e=>Z`<li>
                <button type="button" class="entry" data-id=${e.id} title="${e.name} (${e.icon})" @click=${()=>this._emit(e.build(),"library")}>
                  <mc-anim-icon-thumb .entry=${e} .hass=${this.hass}></mc-anim-icon-thumb>
                  <span class="nm">${e.name}</span>
                  <span class="dm">${u_(e.domain,this.hass)}</span>
                </button>
              </li>`)}
          </ul>`:Z`<p class="help no-results">${na(564,{query:this._query})}</p>`}
    </section>`}render(){return Z`${this._renderPick()} ${this._renderLibrary()}`}};m_.styles=[Sa,Ca,c`
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
    `],d_([_e({attribute:!1})],m_.prototype,"hass",void 0),d_([_e({attribute:!1})],m_.prototype,"lookup",void 0),d_([$e()],m_.prototype,"_icon",void 0),d_([$e()],m_.prototype,"_query",void 0),d_([$e()],m_.prototype,"_domain",void 0),d_([$e()],m_.prototype,"_busy",void 0),d_([$e()],m_.prototype,"_error",void 0),d_([$e()],m_.prototype,"_lib",void 0),d_([$e()],m_.prototype,"_libFailed",void 0),m_=d_([be("mc-anim-icon-start")],m_),function(e){Wg=e}(ah),function(e,t){ii.particles=e,ii.checkSim=t,ii.epoch++}(rh,ah.validateSim);const g_=[["magic-card-animation-studio",Au],["mcas-stage",Nh],["mcas-thumb",zu],["mc-preset-grid",Xh],["mc-preset-thumb",Yh]];for(const[e,t]of g_)customElements.get(e)||customElements.define(e,t)})();